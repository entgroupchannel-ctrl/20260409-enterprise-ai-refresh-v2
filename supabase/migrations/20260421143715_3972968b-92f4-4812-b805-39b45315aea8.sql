-- ═══════════════════════════════════════════════════════════════════════════
-- P-0.2 D-lite: Bug Layer 5 (link_id type) + Layer 6 (observability)
-- ═══════════════════════════════════════════════════════════════════════════

-- Helper: safe text → uuid cast
CREATE OR REPLACE FUNCTION public.try_cast_uuid(p_text text)
RETURNS uuid
LANGUAGE plpgsql
STABLE STRICT
SET search_path TO 'public'
AS $$
BEGIN
  IF p_text = '' THEN RETURN NULL; END IF;
  RETURN p_text::uuid;
EXCEPTION WHEN invalid_text_representation THEN
  RETURN NULL;
END;
$$;

COMMENT ON FUNCTION public.try_cast_uuid(text) IS
  'Safely cast text to uuid. Returns NULL for invalid uuid strings or empty strings. STRICT: NULL input bypasses body and returns NULL.';

-- Patch dispatcher (preserve signature, minimal diff vs P-0)
CREATE OR REPLACE FUNCTION public.dispatch_notification_event(
  p_event_key text,
  p_recipient_user_id uuid DEFAULT NULL::uuid,
  p_recipient_role text DEFAULT NULL::text,
  p_title text DEFAULT NULL::text,
  p_message text DEFAULT NULL::text,
  p_action_url text DEFAULT NULL::text,
  p_action_label text DEFAULT NULL::text,
  p_link_type text DEFAULT NULL::text,
  p_link_id text DEFAULT NULL::text,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_actor_id uuid DEFAULT NULL::uuid,
  p_entity_type text DEFAULT NULL::text,
  p_entity_id text DEFAULT NULL::text,
  p_idempotency_key text DEFAULT NULL::text,
  p_safe_mode boolean DEFAULT false
)
RETURNS TABLE(recipients_count integer, enqueued_count integer, skipped_count integer, dispatch_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_event RECORD;
  v_recipient_ids uuid[];
  v_recipient_id uuid;
  v_enqueued integer := 0;
  v_skipped integer := 0;
  v_dispatch_id uuid := gen_random_uuid();
  v_final_title text;
  v_final_message text;
  v_final_priority text;
  v_is_admin_target boolean;
  v_channel_enabled boolean;
  v_in_app_status text := 'not_attempted';
  v_idem_key text;
BEGIN
  v_idem_key := COALESCE(p_idempotency_key, p_event_key || '-' || v_dispatch_id::text);

  SELECT * INTO v_event
  FROM public.notification_events
  WHERE event_key = p_event_key AND is_active = true;

  IF NOT FOUND THEN
    RAISE WARNING 'dispatch_notification_event: event_key % not found or inactive', p_event_key;
    RETURN QUERY SELECT 0, 0, 0, v_dispatch_id;
    RETURN;
  END IF;

  v_is_admin_target := false;
  IF p_recipient_user_id IS NOT NULL THEN
    v_recipient_ids := ARRAY[p_recipient_user_id];
  ELSIF p_recipient_role = 'super_admin' THEN
    v_is_admin_target := true;
    SELECT ARRAY_AGG(DISTINCT id) INTO v_recipient_ids
    FROM public.users WHERE role = 'super_admin' AND is_active = true;
  ELSIF p_recipient_role = 'admin' THEN
    v_is_admin_target := true;
    SELECT ARRAY_AGG(DISTINCT id) INTO v_recipient_ids
    FROM public.users WHERE role IN ('admin', 'super_admin') AND is_active = true;
  END IF;

  IF v_is_admin_target THEN
    v_channel_enabled := COALESCE(v_event.notify_admin_in_app, false);
  ELSE
    v_channel_enabled := COALESCE(v_event.notify_customer_in_app, false);
  END IF;

  IF NOT v_channel_enabled THEN
    v_in_app_status := 'disabled_in_registry';
  ELSIF v_recipient_ids IS NULL OR array_length(v_recipient_ids, 1) IS NULL THEN
    v_in_app_status := 'no_recipients';
  ELSE
    v_final_title := COALESCE(p_title, v_event.display_name, p_event_key);
    v_final_message := COALESCE(p_message, '');
    v_final_priority := CASE COALESCE(v_event.priority, 'P3')
      WHEN 'P1' THEN 'urgent' WHEN 'P2' THEN 'high' ELSE 'normal'
    END;

    FOREACH v_recipient_id IN ARRAY v_recipient_ids LOOP
      IF public.notification_is_enabled_for_user(v_recipient_id, p_event_key, 'in_app') THEN
        INSERT INTO public.notifications (
          user_id, type, title, message, priority,
          action_url, action_label, link_type, link_id
        ) VALUES (
          v_recipient_id, p_event_key, v_final_title, v_final_message, v_final_priority,
          p_action_url, p_action_label, p_link_type,
          public.try_cast_uuid(p_link_id)  -- ← Layer 5 FIX
        );
        v_enqueued := v_enqueued + 1;
      ELSE
        v_skipped := v_skipped + 1;
      END IF;
    END LOOP;
    v_in_app_status := CASE WHEN v_enqueued > 0 THEN 'delivered' ELSE 'skipped' END;
  END IF;

  INSERT INTO public.notification_dispatch_log (
    id, event_key, idempotency_key, entity_type, entity_id, actor_id,
    customer_user_id,
    customer_in_app_status, admin_in_app_status,
    payload
  ) VALUES (
    v_dispatch_id, p_event_key, v_idem_key, p_entity_type, p_entity_id, p_actor_id,
    CASE WHEN NOT v_is_admin_target THEN p_recipient_user_id END,
    CASE WHEN NOT v_is_admin_target THEN v_in_app_status END,
    CASE WHEN v_is_admin_target THEN v_in_app_status END,
    jsonb_build_object(
      'recipients', COALESCE(array_length(v_recipient_ids, 1), 0),
      'enqueued', v_enqueued,
      'skipped', v_skipped,
      'title', v_final_title,
      'link_type', p_link_type,
      'link_id', p_link_id
    ) || COALESCE(p_metadata, '{}'::jsonb)
  );

  RETURN QUERY SELECT COALESCE(array_length(v_recipient_ids, 1), 0), v_enqueued, v_skipped, v_dispatch_id;

EXCEPTION WHEN OTHERS THEN
  -- Layer 6 FIX: Observability via postgres_logs (survives RPC rollback)
  RAISE WARNING 'dispatch_notification_event failed: event_key=% recipient_role=% recipient_user=% link_type=% link_id=% | %: %',
    p_event_key, p_recipient_role, p_recipient_user_id,
    p_link_type, p_link_id, SQLSTATE, SQLERRM;

  -- Best-effort dispatch_log insert (persists for safe_mode=true callers; rolled back otherwise)
  BEGIN
    INSERT INTO public.notification_dispatch_log (
      id, event_key, idempotency_key, entity_type, entity_id, actor_id,
      customer_user_id,
      customer_in_app_status, admin_in_app_status,
      error_message,
      payload
    ) VALUES (
      gen_random_uuid(),
      p_event_key,
      COALESCE(p_idempotency_key, p_event_key) || '-ERR-' || extract(epoch from clock_timestamp())::text,
      p_entity_type, p_entity_id, p_actor_id,
      CASE WHEN NOT COALESCE(v_is_admin_target, false) THEN p_recipient_user_id END,
      CASE WHEN NOT COALESCE(v_is_admin_target, false) THEN 'error' END,
      CASE WHEN COALESCE(v_is_admin_target, false) THEN 'error' END,
      SQLSTATE || ': ' || SQLERRM,
      COALESCE(p_metadata, '{}'::jsonb) || jsonb_build_object(
        'recipient_role', p_recipient_role,
        'recipient_user_id', p_recipient_user_id,
        'link_type', p_link_type,
        'link_id', p_link_id
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'dispatch_notification_event: failed to log error to dispatch_log: %', SQLERRM;
  END;

  IF p_safe_mode THEN
    RETURN QUERY SELECT 0, 0, 0, v_dispatch_id;
    RETURN;
  ELSE
    RAISE;
  END IF;
END;
$function$;
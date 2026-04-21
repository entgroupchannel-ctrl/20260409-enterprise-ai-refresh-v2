DROP FUNCTION IF EXISTS public.dispatch_notification_event(text, uuid, text, text, text, text, text, text, text, jsonb, uuid);

CREATE OR REPLACE FUNCTION public.dispatch_notification_event(
  p_event_key text,
  p_recipient_user_id uuid DEFAULT NULL,
  p_recipient_role text DEFAULT NULL,
  p_title text DEFAULT NULL,
  p_message text DEFAULT NULL,
  p_action_url text DEFAULT NULL,
  p_action_label text DEFAULT NULL,
  p_link_type text DEFAULT NULL,
  p_link_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_actor_id uuid DEFAULT NULL,
  p_entity_type text DEFAULT NULL,
  p_entity_id text DEFAULT NULL,
  p_idempotency_key text DEFAULT NULL
)
RETURNS TABLE(
  recipients_count integer,
  enqueued_count integer,
  skipped_count integer,
  dispatch_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
BEGIN
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
    SELECT ARRAY_AGG(DISTINCT user_id) INTO v_recipient_ids
    FROM public.user_roles WHERE role = 'super_admin';
  ELSIF p_recipient_role = 'admin' THEN
    v_is_admin_target := true;
    SELECT ARRAY_AGG(DISTINCT user_id) INTO v_recipient_ids
    FROM public.user_roles WHERE role IN ('admin', 'super_admin');
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
          p_action_url, p_action_label, p_link_type, p_link_id
        );
        v_enqueued := v_enqueued + 1;
      ELSE
        v_skipped := v_skipped + 1;
      END IF;
    END LOOP;
    v_in_app_status := CASE WHEN v_enqueued > 0 THEN 'delivered' ELSE 'skipped' END;
  END IF;

  -- Audit log (matches actual schema: per-channel status columns)
  INSERT INTO public.notification_dispatch_log (
    id, event_key, idempotency_key, entity_type, entity_id, actor_id,
    customer_user_id,
    customer_in_app_status, admin_in_app_status,
    payload
  ) VALUES (
    v_dispatch_id, p_event_key, p_idempotency_key, p_entity_type, p_entity_id, p_actor_id,
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
END;
$$;

GRANT EXECUTE ON FUNCTION public.dispatch_notification_event(
  text, uuid, text, text, text, text, text, text, text, jsonb, uuid, text, text, text
) TO authenticated, anon;
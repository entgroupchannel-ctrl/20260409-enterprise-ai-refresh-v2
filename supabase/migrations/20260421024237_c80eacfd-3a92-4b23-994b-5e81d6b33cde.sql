-- Centralized notification dispatcher
-- Single entry point for all notification events in the system
CREATE OR REPLACE FUNCTION public.dispatch_notification_event(
  p_event_key text,
  p_recipient_user_id uuid DEFAULT NULL,
  p_recipient_role text DEFAULT NULL,  -- 'admin' | 'super_admin' | NULL
  p_title text DEFAULT NULL,
  p_message text DEFAULT NULL,
  p_action_url text DEFAULT NULL,
  p_action_label text DEFAULT NULL,
  p_link_type text DEFAULT NULL,
  p_link_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_actor_id uuid DEFAULT NULL
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
BEGIN
  -- 1. Lookup event in registry
  SELECT * INTO v_event
  FROM public.notification_events
  WHERE event_key = p_event_key AND is_enabled = true;

  IF NOT FOUND THEN
    RAISE WARNING 'dispatch_notification_event: event_key % not found or disabled', p_event_key;
    RETURN QUERY SELECT 0, 0, 0, v_dispatch_id;
    RETURN;
  END IF;

  -- 2. Resolve recipients
  IF p_recipient_user_id IS NOT NULL THEN
    v_recipient_ids := ARRAY[p_recipient_user_id];
  ELSIF p_recipient_role IN ('admin', 'super_admin') THEN
    SELECT ARRAY_AGG(DISTINCT user_id) INTO v_recipient_ids
    FROM public.user_roles
    WHERE role IN ('admin', 'super_admin');
  ELSIF p_recipient_role = 'super_admin' THEN
    SELECT ARRAY_AGG(DISTINCT user_id) INTO v_recipient_ids
    FROM public.user_roles
    WHERE role = 'super_admin';
  END IF;

  IF v_recipient_ids IS NULL OR array_length(v_recipient_ids, 1) IS NULL THEN
    RETURN QUERY SELECT 0, 0, 0, v_dispatch_id;
    RETURN;
  END IF;

  -- 3. Resolve title/message/priority (use event defaults if not provided)
  v_final_title := COALESCE(p_title, v_event.default_title, p_event_key);
  v_final_message := COALESCE(p_message, v_event.default_message, '');
  v_final_priority := COALESCE(v_event.default_priority, 'normal');

  -- 4. Fan-out to recipients
  FOREACH v_recipient_id IN ARRAY v_recipient_ids LOOP
    -- Check user preference (critical events bypass preference check)
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

  -- 5. Audit log
  INSERT INTO public.notification_dispatch_log (
    id, event_key, actor_id, recipients_count, enqueued_count, skipped_count,
    channels, link_type, link_id, metadata
  ) VALUES (
    v_dispatch_id, p_event_key, p_actor_id,
    array_length(v_recipient_ids, 1), v_enqueued, v_skipped,
    ARRAY['in_app']::text[], p_link_type, p_link_id, p_metadata
  );

  RETURN QUERY SELECT array_length(v_recipient_ids, 1), v_enqueued, v_skipped, v_dispatch_id;
END;
$$;

-- Allow authenticated users to call (SECURITY DEFINER protects integrity)
GRANT EXECUTE ON FUNCTION public.dispatch_notification_event(
  text, uuid, text, text, text, text, text, text, text, jsonb, uuid
) TO authenticated, anon;
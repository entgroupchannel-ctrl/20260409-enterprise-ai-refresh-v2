-- Create SECURITY DEFINER function to notify all admins
-- Allows authenticated users (e.g. customers uploading payment slips) to enqueue
-- notifications for admin/super_admin without needing direct INSERT on notifications table.

CREATE OR REPLACE FUNCTION public.notify_admins(
  p_type text,
  p_title text,
  p_message text,
  p_priority text DEFAULT 'normal',
  p_action_url text DEFAULT NULL,
  p_action_label text DEFAULT NULL,
  p_link_type text DEFAULT NULL,
  p_link_id text DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer := 0;
BEGIN
  -- Require authenticated session (prevent anonymous spam)
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'authentication required';
  END IF;

  -- Validate priority
  IF p_priority NOT IN ('urgent', 'high', 'normal') THEN
    p_priority := 'normal';
  END IF;

  INSERT INTO public.notifications (
    user_id, type, title, message, priority,
    action_url, action_label, link_type, link_id
  )
  SELECT DISTINCT ur.user_id, p_type, p_title, p_message, p_priority,
         p_action_url, p_action_label, p_link_type, p_link_id
  FROM public.user_roles ur
  WHERE ur.role IN ('admin', 'super_admin');

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.notify_admins(text, text, text, text, text, text, text, text) TO authenticated;
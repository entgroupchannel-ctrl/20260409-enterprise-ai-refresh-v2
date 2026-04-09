
-- ═══ STEP 1: SLA columns on contact_submissions ═══
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS sla_response_due TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sla_resolution_due TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_response_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sla_breached BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_contact_sla_response ON contact_submissions(sla_response_due) WHERE status NOT IN ('closed');
CREATE INDEX IF NOT EXISTS idx_contact_sla_breach ON contact_submissions(sla_breached) WHERE sla_breached = TRUE;

-- ═══ STEP 2: SLA configuration table ═══
CREATE TABLE IF NOT EXISTS public.sla_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_type TEXT NOT NULL CHECK (case_type IN ('sales', 'service', 'support')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  response_minutes INTEGER NOT NULL,
  resolution_hours INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (case_type, priority)
);

INSERT INTO sla_config (case_type, priority, response_minutes, resolution_hours) VALUES
  ('sales',   'urgent',  30,    8),
  ('sales',   'high',    60,    24),
  ('sales',   'normal',  240,   72),
  ('sales',   'low',     480,   168),
  ('service', 'urgent',  15,    4),
  ('service', 'high',    30,    8),
  ('service', 'normal',  120,   48),
  ('service', 'low',     240,   120),
  ('support', 'urgent',  30,    8),
  ('support', 'high',    60,    24),
  ('support', 'normal',  180,   72),
  ('support', 'low',     360,   168)
ON CONFLICT (case_type, priority) DO NOTHING;

ALTER TABLE sla_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read sla_config" ON sla_config;
CREATE POLICY "Anyone can read sla_config" ON sla_config FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Admins manage sla_config" ON sla_config;
CREATE POLICY "Admins manage sla_config" ON sla_config FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ═══ STEP 3: ALTER existing notifications table ═══
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS link_type TEXT,
  ADD COLUMN IF NOT EXISTS link_id UUID,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

UPDATE notifications SET read_at = created_at WHERE read = TRUE AND read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);

DROP POLICY IF EXISTS "System inserts notifications" ON notifications;
CREATE POLICY "System inserts notifications" ON notifications FOR INSERT TO authenticated
  WITH CHECK (true);

-- ═══ STEP 4: calculate_sla_dues ═══
CREATE OR REPLACE FUNCTION public.calculate_sla_dues(
  _case_type TEXT, _priority TEXT, _start_time TIMESTAMPTZ DEFAULT now()
) RETURNS TABLE (response_due TIMESTAMPTZ, resolution_due TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _config sla_config%ROWTYPE;
BEGIN
  SELECT * INTO _config FROM sla_config
  WHERE case_type = _case_type AND priority = _priority AND active = TRUE LIMIT 1;
  IF NOT FOUND THEN
    RETURN QUERY SELECT _start_time + INTERVAL '4 hours', _start_time + INTERVAL '3 days';
  ELSE
    RETURN QUERY SELECT
      _start_time + (_config.response_minutes || ' minutes')::INTERVAL,
      _start_time + (_config.resolution_hours || ' hours')::INTERVAL;
  END IF;
END; $$;
GRANT EXECUTE ON FUNCTION public.calculate_sla_dues(TEXT, TEXT, TIMESTAMPTZ) TO authenticated;

-- ═══ STEP 5: Auto-set SLA on contact creation ═══
CREATE OR REPLACE FUNCTION public.set_contact_sla()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _dues RECORD;
BEGIN
  IF NEW.sla_response_due IS NULL THEN
    SELECT * INTO _dues FROM calculate_sla_dues(
      COALESCE(NEW.case_type, 'sales'), COALESCE(NEW.priority, 'normal'), NEW.created_at);
    NEW.sla_response_due := _dues.response_due;
    NEW.sla_resolution_due := _dues.resolution_due;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_set_contact_sla ON contact_submissions;
CREATE TRIGGER trg_set_contact_sla BEFORE INSERT ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_contact_sla();

-- ═══ STEP 6: Recalculate SLA ═══
CREATE OR REPLACE FUNCTION public.recalc_contact_sla()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _dues RECORD;
BEGIN
  IF (OLD.priority IS DISTINCT FROM NEW.priority) OR (OLD.case_type IS DISTINCT FROM NEW.case_type) THEN
    SELECT * INTO _dues FROM calculate_sla_dues(
      COALESCE(NEW.case_type, 'sales'), COALESCE(NEW.priority, 'normal'), NEW.created_at);
    NEW.sla_response_due := _dues.response_due;
    NEW.sla_resolution_due := _dues.resolution_due;
    NEW.sla_breached := FALSE;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_recalc_contact_sla ON contact_submissions;
CREATE TRIGGER trg_recalc_contact_sla BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.recalc_contact_sla();

-- ═══ STEP 7: Mark first response ═══
CREATE OR REPLACE FUNCTION public.mark_first_response()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF OLD.status = 'new' AND NEW.status IN ('contacted', 'qualified', 'in_progress') AND NEW.first_response_at IS NULL THEN
    NEW.first_response_at := now();
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_mark_first_response ON contact_submissions;
CREATE TRIGGER trg_mark_first_response BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.mark_first_response();

-- ═══ STEP 8: Notify on assignment ═══
CREATE OR REPLACE FUNCTION public.notify_on_contact_assignment()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS DISTINCT FROM NEW.assigned_to) THEN
    INSERT INTO notifications (user_id, type, title, message, link_type, link_id, metadata)
    VALUES (
      NEW.assigned_to, 'contact_assigned',
      'มีเรื่องใหม่มอบหมายให้คุณ',
      COALESCE(NEW.name, 'ลูกค้า') || ' — ' ||
      CASE NEW.case_type WHEN 'sales' THEN 'งานขาย' WHEN 'service' THEN 'งานบริการ' WHEN 'support' THEN 'งานสนับสนุน' ELSE 'ติดต่อ' END ||
      CASE NEW.priority WHEN 'urgent' THEN ' [ด่วน]' WHEN 'high' THEN ' [สูง]' ELSE '' END,
      'contact', NEW.id,
      jsonb_build_object('case_type', NEW.case_type, 'priority', NEW.priority));
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_assignment ON contact_submissions;
CREATE TRIGGER trg_notify_assignment AFTER UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_contact_assignment();

-- ═══ STEP 9: Detect SLA breaches ═══
CREATE OR REPLACE FUNCTION public.detect_sla_breaches()
RETURNS TABLE (contact_id UUID, customer_name TEXT, case_type TEXT, priority TEXT, assigned_to UUID, minutes_overdue INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE contact_submissions SET sla_breached = TRUE
  WHERE sla_breached = FALSE AND status NOT IN ('closed')
    AND first_response_at IS NULL AND sla_response_due IS NOT NULL AND sla_response_due < now();
  INSERT INTO notifications (user_id, type, title, message, link_type, link_id)
  SELECT cs.assigned_to, 'contact_sla_breached', 'SLA เกินกำหนด!',
    'ลูกค้า ' || cs.name || ' (Response SLA เกินแล้ว)', 'contact', cs.id
  FROM contact_submissions cs
  WHERE cs.sla_breached = TRUE AND cs.assigned_to IS NOT NULL AND cs.status NOT IN ('closed')
    AND NOT EXISTS (SELECT 1 FROM notifications n WHERE n.link_id = cs.id AND n.type = 'contact_sla_breached' AND n.created_at > now() - INTERVAL '24 hours');
  RETURN QUERY
  SELECT cs.id, cs.name::TEXT, cs.case_type::TEXT, cs.priority::TEXT, cs.assigned_to,
    (EXTRACT(EPOCH FROM (now() - cs.sla_response_due)) / 60)::INTEGER
  FROM contact_submissions cs WHERE cs.sla_breached = TRUE AND cs.status NOT IN ('closed') ORDER BY cs.sla_response_due ASC;
END; $$;
GRANT EXECUTE ON FUNCTION public.detect_sla_breaches() TO authenticated;

-- ═══ STEP 10: Follow-up reminders ═══
CREATE OR REPLACE FUNCTION public.send_followup_reminders()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _count INTEGER := 0;
BEGIN
  WITH due_followups AS (
    SELECT cs.id, cs.name, cs.assigned_to FROM contact_submissions cs
    WHERE cs.follow_up_date = CURRENT_DATE AND cs.assigned_to IS NOT NULL AND cs.status NOT IN ('closed')
      AND NOT EXISTS (SELECT 1 FROM notifications n WHERE n.link_id = cs.id AND n.type = 'contact_followup_due' AND n.created_at::DATE = CURRENT_DATE)
  ),
  inserted AS (
    INSERT INTO notifications (user_id, type, title, message, link_type, link_id)
    SELECT assigned_to, 'contact_followup_due', 'ติดตามวันนี้', 'ถึงเวลาติดตามลูกค้า: ' || name, 'contact', id FROM due_followups RETURNING 1
  )
  SELECT COUNT(*) INTO _count FROM inserted;
  RETURN _count;
END; $$;
GRANT EXECUTE ON FUNCTION public.send_followup_reminders() TO authenticated;

-- ═══ STEP 11: Get unread count ═══
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM notifications WHERE user_id = auth.uid() AND read_at IS NULL);
END; $$;
GRANT EXECUTE ON FUNCTION public.get_unread_notification_count() TO authenticated;

-- ═══ STEP 12: Mark notifications read ═══
CREATE OR REPLACE FUNCTION public.mark_notifications_read(_ids UUID[] DEFAULT NULL)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _count INTEGER;
BEGIN
  IF _ids IS NULL THEN
    UPDATE notifications SET read_at = now() WHERE user_id = auth.uid() AND read_at IS NULL;
  ELSE
    UPDATE notifications SET read_at = now() WHERE user_id = auth.uid() AND id = ANY(_ids) AND read_at IS NULL;
  END IF;
  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END; $$;
GRANT EXECUTE ON FUNCTION public.mark_notifications_read(UUID[]) TO authenticated;

-- ═══ STEP 13: Backfill SLA ═══
DO $$
DECLARE _row RECORD; _dues RECORD;
BEGIN
  FOR _row IN SELECT id, case_type, priority, created_at FROM contact_submissions WHERE sla_response_due IS NULL
  LOOP
    SELECT * INTO _dues FROM calculate_sla_dues(COALESCE(_row.case_type, 'sales'), COALESCE(_row.priority, 'normal'), _row.created_at);
    UPDATE contact_submissions SET sla_response_due = _dues.response_due, sla_resolution_due = _dues.resolution_due WHERE id = _row.id;
  END LOOP;
END $$;

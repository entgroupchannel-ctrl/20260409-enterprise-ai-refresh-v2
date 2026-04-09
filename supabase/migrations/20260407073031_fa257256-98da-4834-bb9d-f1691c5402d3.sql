-- ═══ STEP 1: Add new roles to app_role enum ═══
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sales';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'service';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'support';


-- ═══ STEP 2: Add columns to contact_submissions ═══
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS case_type TEXT
    CHECK (case_type IN ('sales', 'service', 'support')) DEFAULT 'sales',
  ADD COLUMN IF NOT EXISTS priority TEXT
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS source TEXT
    CHECK (source IN ('web_form', 'phone', 'walkin', 'line', 'email', 'other'))
    DEFAULT 'web_form',
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS assigned_team TEXT
    CHECK (assigned_team IN ('sales', 'service', 'support')),
  ADD COLUMN IF NOT EXISTS follow_up_date DATE,
  ADD COLUMN IF NOT EXISTS converted_to_quote_id UUID REFERENCES quote_requests(id),
  ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS closed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update status check constraint to include 'in_progress'
ALTER TABLE contact_submissions DROP CONSTRAINT IF EXISTS contact_submissions_status_check;
ALTER TABLE contact_submissions ADD CONSTRAINT contact_submissions_status_check
  CHECK (status IN ('new', 'contacted', 'qualified', 'in_progress', 'closed'));

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_contact_case_type   ON contact_submissions(case_type);
CREATE INDEX IF NOT EXISTS idx_contact_priority    ON contact_submissions(priority);
CREATE INDEX IF NOT EXISTS idx_contact_assigned    ON contact_submissions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contact_team        ON contact_submissions(assigned_team);
CREATE INDEX IF NOT EXISTS idx_contact_followup    ON contact_submissions(follow_up_date);
CREATE INDEX IF NOT EXISTS idx_contact_status      ON contact_submissions(status);


-- ═══ STEP 3: Activity log table ═══
CREATE TABLE IF NOT EXISTS public.contact_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contact_submissions(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'note', 'call', 'email', 'sms', 'line', 'meeting',
    'status_change', 'assignment', 'priority_change', 'case_type_change',
    'follow_up_set', 'converted'
  )),
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_activities_contact ON contact_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_activities_created ON contact_activities(created_at DESC);

-- RLS
ALTER TABLE public.contact_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage contact activities" ON public.contact_activities;
CREATE POLICY "Admins manage contact activities"
  ON public.contact_activities FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));


-- ═══ STEP 4: Helper RPC — get all internal staff (for assignment dropdown) ═══
CREATE OR REPLACE FUNCTION public.get_internal_staff()
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  full_name TEXT,
  roles TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id AS user_id,
    u.email::TEXT,
    COALESCE(p.full_name, u.email::TEXT) AS full_name,
    ARRAY_AGG(DISTINCT ur.role::TEXT) AS roles
  FROM auth.users u
  LEFT JOIN profiles p ON p.id = u.id
  INNER JOIN user_roles ur ON ur.user_id = u.id
  WHERE ur.role IN ('admin', 'super_admin', 'moderator', 'sales', 'service', 'support')
  GROUP BY u.id, u.email, p.full_name
  ORDER BY full_name;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_internal_staff() TO authenticated;


-- ═══ STEP 5: Auto-log activity on contact updates ═══
CREATE OR REPLACE FUNCTION public.log_contact_activity()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Status change
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO contact_activities (contact_id, activity_type, content, created_by)
    VALUES (NEW.id, 'status_change',
      'เปลี่ยนสถานะจาก "' || COALESCE(OLD.status, '-') || '" เป็น "' || NEW.status || '"',
      auth.uid());
  END IF;

  -- Assignment change
  IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
    INSERT INTO contact_activities (contact_id, activity_type, content, created_by, metadata)
    VALUES (NEW.id, 'assignment',
      CASE
        WHEN NEW.assigned_to IS NULL THEN 'ยกเลิกการมอบหมาย'
        ELSE 'มอบหมายให้ผู้ใช้ใหม่'
      END,
      auth.uid(),
      jsonb_build_object('old_assigned_to', OLD.assigned_to, 'new_assigned_to', NEW.assigned_to));
  END IF;

  -- Team change
  IF OLD.assigned_team IS DISTINCT FROM NEW.assigned_team THEN
    INSERT INTO contact_activities (contact_id, activity_type, content, created_by)
    VALUES (NEW.id, 'assignment',
      'เปลี่ยนทีมจาก "' || COALESCE(OLD.assigned_team, '-') || '" เป็น "' || COALESCE(NEW.assigned_team, '-') || '"',
      auth.uid());
  END IF;

  -- Priority change
  IF OLD.priority IS DISTINCT FROM NEW.priority THEN
    INSERT INTO contact_activities (contact_id, activity_type, content, created_by)
    VALUES (NEW.id, 'priority_change',
      'เปลี่ยนความสำคัญจาก "' || COALESCE(OLD.priority, '-') || '" เป็น "' || COALESCE(NEW.priority, '-') || '"',
      auth.uid());
  END IF;

  -- Case type change
  IF OLD.case_type IS DISTINCT FROM NEW.case_type THEN
    INSERT INTO contact_activities (contact_id, activity_type, content, created_by)
    VALUES (NEW.id, 'case_type_change',
      'เปลี่ยนประเภทเคสจาก "' || COALESCE(OLD.case_type, '-') || '" เป็น "' || COALESCE(NEW.case_type, '-') || '"',
      auth.uid());
  END IF;

  -- Follow-up set
  IF OLD.follow_up_date IS DISTINCT FROM NEW.follow_up_date AND NEW.follow_up_date IS NOT NULL THEN
    INSERT INTO contact_activities (contact_id, activity_type, content, created_by)
    VALUES (NEW.id, 'follow_up_set',
      'ตั้งติดตามวันที่ ' || NEW.follow_up_date::TEXT,
      auth.uid());
  END IF;

  -- Closed
  IF OLD.status != 'closed' AND NEW.status = 'closed' THEN
    NEW.closed_at := now();
    NEW.closed_by := auth.uid();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_contact_activity ON contact_submissions;
CREATE TRIGGER trg_log_contact_activity
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_contact_activity();


-- ═══ STEP 6: Auto-log on insert (creation) ═══
CREATE OR REPLACE FUNCTION public.log_contact_creation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO contact_activities (contact_id, activity_type, content, created_by, metadata)
  VALUES (NEW.id, 'note',
    'รับเรื่องเข้าระบบ (ที่มา: ' || COALESCE(NEW.source, 'web_form') || ')',
    COALESCE(NEW.created_by, auth.uid()),
    jsonb_build_object('source', NEW.source, 'case_type', NEW.case_type));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_contact_creation ON contact_submissions;
CREATE TRIGGER trg_log_contact_creation
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_contact_creation();


-- ═══ STEP 7: Backfill defaults for existing rows ═══
UPDATE contact_submissions
SET case_type = 'sales',
    priority = 'normal',
    source = 'web_form'
WHERE case_type IS NULL OR priority IS NULL OR source IS NULL;
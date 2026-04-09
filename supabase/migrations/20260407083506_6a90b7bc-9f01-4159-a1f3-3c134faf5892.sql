-- ═══ STEP 1: Add PO workflow + SLA columns to quote_requests ═══
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS po_review_due TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS po_review_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS po_reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS po_reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS po_overdue BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS po_priority TEXT
    CHECK (po_priority IN ('urgent', 'normal')) DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS po_uploaded_by UUID REFERENCES auth.users(id);

-- Drop old check constraint (if any) and add new one with extended workflow
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'quote_requests_po_status_check'
  ) THEN
    EXECUTE 'ALTER TABLE quote_requests DROP CONSTRAINT quote_requests_po_status_check';
  END IF;
END $$;

ALTER TABLE quote_requests
  ADD CONSTRAINT quote_requests_po_status_check
  CHECK (po_status IS NULL OR po_status IN (
    'uploaded', 'under_review', 'pending_clarification', 'approved', 'rejected'
  ));

CREATE INDEX IF NOT EXISTS idx_quote_po_status ON quote_requests(po_status) WHERE po_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quote_po_review_due ON quote_requests(po_review_due) WHERE po_status IN ('uploaded', 'under_review');
CREATE INDEX IF NOT EXISTS idx_quote_po_overdue ON quote_requests(po_overdue) WHERE po_overdue = TRUE;


-- ═══ STEP 2: PO Files table (multi-document support) ═══
CREATE TABLE IF NOT EXISTS public.po_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  document_type TEXT DEFAULT 'po' CHECK (document_type IN ('po', 'spec', 'reference', 'other')),
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_po_files_quote ON po_files(quote_id);

ALTER TABLE po_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers upload own PO files" ON po_files;
CREATE POLICY "Customers upload own PO files"
  ON po_files FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM quote_requests WHERE id = quote_id AND user_id = auth.uid())
    OR public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Customers view own PO files" ON po_files;
CREATE POLICY "Customers view own PO files"
  ON po_files FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM quote_requests WHERE id = quote_id AND user_id = auth.uid())
    OR public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Admins manage PO files" ON po_files;
CREATE POLICY "Admins manage PO files"
  ON po_files FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


-- ═══ STEP 3: PO Review audit log ═══
CREATE TABLE IF NOT EXISTS public.po_review_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN (
    'uploaded', 'viewed', 'started_review', 'comment',
    'requested_clarification', 'customer_replied',
    'approved', 'rejected', 'sla_warning', 'sla_breached', 'reassigned'
  )),
  performed_by UUID REFERENCES auth.users(id),
  comment TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_po_review_log_quote ON po_review_log(quote_id);
CREATE INDEX IF NOT EXISTS idx_po_review_log_created ON po_review_log(created_at DESC);

ALTER TABLE po_review_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins view all PO logs" ON po_review_log;
CREATE POLICY "Admins view all PO logs"
  ON po_review_log FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid())
    OR EXISTS (SELECT 1 FROM quote_requests WHERE id = quote_id AND user_id = auth.uid()));

DROP POLICY IF EXISTS "Authenticated insert PO logs" ON po_review_log;
CREATE POLICY "Authenticated insert PO logs"
  ON po_review_log FOR INSERT TO authenticated
  WITH CHECK (true);


-- ═══ STEP 4: Calculate PO review due time ═══
CREATE OR REPLACE FUNCTION public.calculate_po_review_due(
  _priority TEXT DEFAULT 'normal',
  _start TIMESTAMPTZ DEFAULT now()
) RETURNS TIMESTAMPTZ
LANGUAGE plpgsql IMMUTABLE
AS $$
BEGIN
  IF _priority = 'urgent' THEN
    RETURN _start + INTERVAL '4 hours';
  END IF;
  RETURN _start + INTERVAL '24 hours';
END;
$$;

GRANT EXECUTE ON FUNCTION public.calculate_po_review_due(TEXT, TIMESTAMPTZ) TO authenticated;


-- ═══ STEP 5: Auto-set PO SLA + auto-assign on upload ═══
CREATE OR REPLACE FUNCTION public.handle_po_upload()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _least_busy_user UUID;
BEGIN
  IF NEW.po_status = 'uploaded' AND (OLD.po_status IS NULL OR OLD.po_status != 'uploaded') THEN
    NEW.po_review_due := public.calculate_po_review_due(
      COALESCE(NEW.po_priority, 'normal'), now()
    );
    NEW.po_overdue := FALSE;
    NEW.po_review_started_at := NULL;
    NEW.po_reviewed_at := NULL;
    NEW.po_reviewed_by := NULL;

    IF NEW.assigned_to IS NULL THEN
      SELECT ur.user_id INTO _least_busy_user
      FROM user_roles ur
      LEFT JOIN quote_requests qr ON qr.assigned_to = ur.user_id
        AND qr.status NOT IN ('lost', 'closed')
      WHERE ur.role IN ('admin', 'super_admin', 'sales')
      GROUP BY ur.user_id
      ORDER BY COUNT(qr.id) ASC
      LIMIT 1;
      IF _least_busy_user IS NOT NULL THEN
        NEW.assigned_to := _least_busy_user;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_handle_po_upload ON quote_requests;
CREATE TRIGGER trg_handle_po_upload
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_po_upload();


-- ═══ STEP 6: Auto-log to po_review_log + send notifications ═══
CREATE OR REPLACE FUNCTION public.log_po_state_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.po_status IS DISTINCT FROM NEW.po_status THEN
    INSERT INTO po_review_log (quote_id, action, performed_by, metadata)
    VALUES (
      NEW.id,
      CASE NEW.po_status
        WHEN 'uploaded'              THEN 'uploaded'
        WHEN 'under_review'          THEN 'started_review'
        WHEN 'pending_clarification' THEN 'requested_clarification'
        WHEN 'approved'              THEN 'approved'
        WHEN 'rejected'              THEN 'rejected'
        ELSE 'viewed'
      END,
      COALESCE(NEW.po_reviewed_by, auth.uid()),
      jsonb_build_object('old_status', OLD.po_status, 'new_status', NEW.po_status)
    );

    IF NEW.po_status = 'uploaded' AND NEW.assigned_to IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, link_type, link_id, metadata)
      VALUES (
        NEW.assigned_to, 'contact_assigned',
        '📥 มี PO ใหม่รอตรวจสอบ',
        'ลูกค้า ' || COALESCE(NEW.name, 'ไม่ระบุ') || ' ส่ง PO สำหรับ ' || COALESCE(NEW.quote_number, '#') ||
          CASE NEW.po_priority WHEN 'urgent' THEN ' [ด่วน — SLA 4 ชม.]' ELSE ' [SLA 24 ชม.]' END,
        'quote', NEW.id,
        jsonb_build_object('po_priority', NEW.po_priority, 'po_review_due', NEW.po_review_due)
      );
    END IF;

    IF NEW.po_status = 'approved' AND NEW.user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, link_type, link_id)
      VALUES (NEW.user_id, 'quote_approved',
        '✅ PO ได้รับการอนุมัติ',
        COALESCE(NEW.quote_number, '#') || ' — PO ผ่านการตรวจสอบแล้ว ทีมงานเริ่มดำเนินการต่อ',
        'quote', NEW.id);
    END IF;

    IF NEW.po_status = 'rejected' AND NEW.user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, link_type, link_id)
      VALUES (NEW.user_id, 'quote_rejected',
        '❌ PO ถูกปฏิเสธ',
        COALESCE(NEW.quote_number, '#') || ' — กรุณาตรวจสอบและอัปโหลด PO ใหม่',
        'quote', NEW.id);
    END IF;

    IF NEW.po_status = 'pending_clarification' AND NEW.user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, link_type, link_id)
      VALUES (NEW.user_id, 'quote_status',
        '📝 ต้องการข้อมูลเพิ่มเติม',
        COALESCE(NEW.quote_number, '#') || ' — ทีมขายต้องการข้อมูลเพิ่มเติมเกี่ยวกับ PO',
        'quote', NEW.id);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_po_state_change ON quote_requests;
CREATE TRIGGER trg_log_po_state_change
  AFTER UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.log_po_state_change();


-- ═══ STEP 7: Detect PO SLA breaches ═══
CREATE OR REPLACE FUNCTION public.detect_po_sla_breaches()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _count INTEGER := 0;
BEGIN
  WITH breached AS (
    UPDATE quote_requests SET po_overdue = TRUE
    WHERE po_overdue = FALSE
      AND po_status IN ('uploaded', 'under_review')
      AND po_review_due IS NOT NULL
      AND po_review_due < now()
    RETURNING id, name, quote_number, assigned_to, po_review_due
  )
  INSERT INTO notifications (user_id, type, title, message, link_type, link_id)
  SELECT b.assigned_to, 'contact_sla_breached',
    '⚠️ PO SLA เลยกำหนด!',
    'ลูกค้า ' || b.name || ' (' || COALESCE(b.quote_number, '#') || ') — PO รอตรวจเกิน SLA',
    'quote', b.id
  FROM breached b
  WHERE b.assigned_to IS NOT NULL;

  GET DIAGNOSTICS _count = ROW_COUNT;

  INSERT INTO po_review_log (quote_id, action, comment)
  SELECT id, 'sla_breached', 'SLA เลยกำหนด ' || EXTRACT(EPOCH FROM (now() - po_review_due))::INTEGER / 60 || ' นาที'
  FROM quote_requests
  WHERE po_overdue = TRUE
    AND po_status IN ('uploaded', 'under_review')
    AND NOT EXISTS (
      SELECT 1 FROM po_review_log
      WHERE quote_id = quote_requests.id
        AND action = 'sla_breached'
        AND created_at > now() - INTERVAL '24 hours'
    );

  RETURN _count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.detect_po_sla_breaches() TO authenticated;


-- ═══ STEP 8: PO inbox stats RPC ═══
CREATE OR REPLACE FUNCTION public.get_po_inbox_stats()
RETURNS TABLE (
  total INTEGER, pending_review INTEGER, under_review INTEGER,
  pending_clarification INTEGER, approved INTEGER, rejected INTEGER,
  overdue INTEGER, urgent INTEGER
) LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER,
    COUNT(*) FILTER (WHERE po_status = 'uploaded')::INTEGER,
    COUNT(*) FILTER (WHERE po_status = 'under_review')::INTEGER,
    COUNT(*) FILTER (WHERE po_status = 'pending_clarification')::INTEGER,
    COUNT(*) FILTER (WHERE po_status = 'approved')::INTEGER,
    COUNT(*) FILTER (WHERE po_status = 'rejected')::INTEGER,
    COUNT(*) FILTER (WHERE po_overdue = TRUE AND po_status IN ('uploaded', 'under_review'))::INTEGER,
    COUNT(*) FILTER (WHERE po_priority = 'urgent' AND po_status IN ('uploaded', 'under_review'))::INTEGER
  FROM quote_requests
  WHERE po_status IS NOT NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_po_inbox_stats() TO authenticated;


-- ═══ STEP 9: Mark as viewed (auto when admin opens) ═══
CREATE OR REPLACE FUNCTION public.mark_po_viewed(_quote_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM po_review_log
    WHERE quote_id = _quote_id
      AND action = 'viewed'
      AND performed_by = auth.uid()
      AND created_at::DATE = CURRENT_DATE
  ) THEN
    INSERT INTO po_review_log (quote_id, action, performed_by)
    VALUES (_quote_id, 'viewed', auth.uid());
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_po_viewed(UUID) TO authenticated;


-- ═══ STEP 10: Backfill SLA for existing PO uploads ═══
UPDATE quote_requests
SET po_review_due = po_uploaded_at + INTERVAL '24 hours'
WHERE po_status IN ('uploaded', 'under_review')
  AND po_review_due IS NULL
  AND po_uploaded_at IS NOT NULL;
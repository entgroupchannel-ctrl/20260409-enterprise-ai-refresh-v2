DROP FUNCTION IF EXISTS public.detect_po_sla_breaches();

CREATE OR REPLACE FUNCTION public.detect_po_sla_breaches()
RETURNS TABLE(
  quote_id UUID,
  quote_number TEXT,
  customer_name TEXT,
  assigned_to UUID,
  hours_overdue INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link_type, link_id, metadata)
  SELECT
    COALESCE(qr.assigned_to, (SELECT id FROM auth.users WHERE id IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'super_admin') LIMIT 1
    ))) AS user_id,
    'po_sla_breached' AS type,
    '⚠️ PO เกินกำหนดตรวจสอบ' AS title,
    'PO #' || COALESCE(qr.po_number, qr.quote_number, '?') ||
    ' จาก ' || COALESCE(qr.name, 'ลูกค้า') ||
    ' เลย SLA แล้ว ' ||
    EXTRACT(EPOCH FROM (now() - qr.po_review_due))::INTEGER / 3600 || ' ชั่วโมง' AS message,
    'quote' AS link_type,
    qr.id AS link_id,
    jsonb_build_object(
      'quote_number', qr.quote_number,
      'po_number', qr.po_number,
      'hours_overdue', EXTRACT(EPOCH FROM (now() - qr.po_review_due))::INTEGER / 3600
    ) AS metadata
  FROM quote_requests qr
  WHERE qr.po_status IN ('uploaded', 'under_review')
    AND qr.po_review_due IS NOT NULL
    AND qr.po_review_due < now()
    AND qr.assigned_to IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM notifications n
      WHERE n.link_id = qr.id::text
        AND n.type = 'po_sla_breached'
        AND n.created_at > now() - INTERVAL '24 hours'
    );

  RETURN QUERY
  SELECT
    qr.id AS quote_id,
    qr.quote_number AS quote_number,
    qr.name::TEXT AS customer_name,
    qr.assigned_to,
    (EXTRACT(EPOCH FROM (now() - qr.po_review_due)) / 3600)::INTEGER AS hours_overdue
  FROM quote_requests qr
  WHERE qr.po_status IN ('uploaded', 'under_review')
    AND qr.po_review_due IS NOT NULL
    AND qr.po_review_due < now()
  ORDER BY qr.po_review_due ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.detect_po_sla_breaches() TO authenticated;
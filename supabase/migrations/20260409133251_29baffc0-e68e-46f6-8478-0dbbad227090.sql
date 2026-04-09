-- Add confirmed_at column for PO confirmation flow
ALTER TABLE public.quote_requests
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;

-- Add index for confirmed_at
CREATE INDEX IF NOT EXISTS idx_quote_requests_confirmed_at 
ON public.quote_requests(confirmed_at);

-- Update SLA trigger to handle po_confirmed status
CREATE OR REPLACE FUNCTION public.set_sla_timestamps()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'pending' AND NEW.sla_response_due IS NULL THEN
    NEW.sla_response_due := NOW() + INTERVAL '24 hours';
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'po_uploaded' AND OLD.status != 'po_uploaded' THEN
      NEW.sla_po_review_due := NOW() + INTERVAL '24 hours';
      NEW.po_uploaded_at := NOW();
    END IF;
    IF NEW.status = 'po_confirmed' AND OLD.status != 'po_confirmed' THEN
      NEW.confirmed_at := NOW();
    END IF;
    IF NEW.status = 'quote_sent' AND OLD.status != 'quote_sent' THEN
      NEW.sent_at := NOW();
    END IF;
    IF NEW.status = 'po_approved' AND OLD.status != 'po_approved' THEN
      NEW.approved_at := NOW();
    END IF;
    IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
      NEW.rejected_at := NOW();
    END IF;
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
      NEW.completed_at := NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Update notification trigger to notify admin when PO is confirmed
CREATE OR REPLACE FUNCTION public.create_quote_notification()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    IF NEW.status = 'po_uploaded' AND NEW.assigned_to IS NOT NULL THEN
      INSERT INTO notifications (
        user_id, quote_id, title, message, type, priority, action_url, action_label
      ) VALUES (
        NEW.assigned_to, NEW.id,
        'รอตรวจสอบ PO',
        'ลูกค้าอัปโหลด PO สำหรับ ' || NEW.quote_number,
        'po_uploaded', 'urgent',
        '/admin/quotes/' || NEW.id,
        'ตรวจสอบเลย'
      );
    END IF;
    IF NEW.status = 'po_confirmed' AND NEW.assigned_to IS NOT NULL THEN
      INSERT INTO notifications (
        user_id, quote_id, title, message, type, priority, action_url, action_label
      ) VALUES (
        NEW.assigned_to, NEW.id,
        'ลูกค้ายืนยัน PO แล้ว',
        'ลูกค้ายืนยันคำสั่งซื้อ ' || NEW.quote_number || ' พร้อมดำเนินการ',
        'po_confirmed', 'urgent',
        '/admin/quotes/' || NEW.id,
        'อนุมัติ PO'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

COMMENT ON COLUMN public.quote_requests.confirmed_at IS 'Timestamp when customer confirmed the PO after uploading';
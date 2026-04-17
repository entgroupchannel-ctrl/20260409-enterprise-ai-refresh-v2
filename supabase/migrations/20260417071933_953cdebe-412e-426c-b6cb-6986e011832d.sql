CREATE OR REPLACE FUNCTION public.notify_quote_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_quote_url_admin TEXT;
  v_quote_url_user  TEXT;
  v_qnum            TEXT;
  v_customer        TEXT;
BEGIN
  IF OLD.status = NEW.status THEN RETURN NEW; END IF;

  v_qnum        := COALESCE(NEW.quote_number, '#');
  v_customer    := COALESCE(NEW.customer_name, NEW.customer_company, NEW.customer_email, 'ลูกค้า');
  v_quote_url_admin := '/admin/quotes/' || NEW.id;
  v_quote_url_user  := '/dashboard?id=' || NEW.id;

  IF NEW.status = 'pending' AND OLD.status IS DISTINCT FROM 'pending' THEN
    PERFORM notify_all_admins(
      '📋 ใบขอราคาใหม่: ' || v_qnum,
      v_customer || ' ส่งคำขอใบเสนอราคาใหม่ กรุณาจัดทำราคา',
      'new_quote_request', 'high',
      v_quote_url_admin, 'เปิดดูและทำราคา', NEW.id
    );
  END IF;

  IF NEW.status = 'quote_sent' AND NEW.created_by IS NOT NULL THEN
    INSERT INTO notifications (user_id, quote_id, title, message, type, priority, action_url, action_label)
    VALUES (
      NEW.created_by, NEW.id,
      '📄 ได้รับใบเสนอราคาแล้ว: ' || v_qnum,
      'ทีมขายส่งใบเสนอราคามาให้แล้ว กรุณาตรวจสอบและยืนยัน',
      'quote_sent', 'high',
      v_quote_url_user, 'ดูและยืนยันราคา'
    );
  END IF;

  IF NEW.status = 'negotiating' THEN
    PERFORM notify_all_admins(
      '💬 ลูกค้าขอต่อรองราคา: ' || v_qnum,
      v_customer || ' ส่งคำขอต่อรองราคา กรุณาตรวจสอบและตอบกลับ',
      'negotiation_request', 'high',
      v_quote_url_admin, 'ดูคำขอต่อรอง', NEW.id
    );
  END IF;

  IF NEW.status = 'accepted' THEN
    PERFORM notify_all_admins(
      '✅ ลูกค้ายอมรับราคา: ' || v_qnum,
      v_customer || ' ยอมรับใบเสนอราคาแล้ว รอลูกค้าแนบ PO',
      'quote_accepted', 'normal',
      v_quote_url_admin, 'ดูรายละเอียด', NEW.id
    );
  END IF;

  IF NEW.status = 'po_uploaded' THEN
    IF NEW.assigned_to IS NOT NULL THEN
      INSERT INTO notifications (user_id, quote_id, title, message, type, priority, action_url, action_label)
      VALUES (
        NEW.assigned_to, NEW.id,
        '📥 PO ใหม่รอตรวจสอบ: ' || v_qnum,
        v_customer || ' อัปโหลด PO แล้ว กรุณาตรวจสอบภายใน 24 ชม.',
        'po_uploaded', 'urgent',
        v_quote_url_admin, 'ตรวจสอบ PO'
      );
    ELSE
      PERFORM notify_all_admins(
        '📥 PO ใหม่รอตรวจสอบ: ' || v_qnum,
        v_customer || ' อัปโหลด PO แล้ว กรุณาตรวจสอบภายใน 24 ชม.',
        'po_uploaded', 'urgent',
        v_quote_url_admin, 'ตรวจสอบ PO', NEW.id
      );
    END IF;
    IF NEW.created_by IS NOT NULL THEN
      INSERT INTO notifications (user_id, quote_id, title, message, type, priority, action_url, action_label)
      VALUES (
        NEW.created_by, NEW.id,
        '✅ ระบบได้รับ PO แล้ว: ' || v_qnum,
        'ทีมงานกำลังตรวจสอบ PO ของคุณ จะแจ้งผลภายใน 24 ชม.',
        'po_received', 'normal',
        v_quote_url_user, 'ดูสถานะ'
      );
    END IF;
  END IF;

  IF NEW.status = 'po_approved' AND NEW.created_by IS NOT NULL THEN
    INSERT INTO notifications (user_id, quote_id, title, message, type, priority, action_url, action_label)
    VALUES (
      NEW.created_by, NEW.id,
      '🎉 PO ได้รับการอนุมัติ: ' || v_qnum,
      'PO ของคุณได้รับการอนุมัติแล้ว เริ่มกระบวนการจัดส่ง',
      'po_approved', 'high',
      v_quote_url_user, 'ดูรายละเอียด'
    );
  END IF;

  IF NEW.status = 'completed' AND NEW.created_by IS NOT NULL THEN
    INSERT INTO notifications (user_id, quote_id, title, message, type, priority, action_url, action_label)
    VALUES (
      NEW.created_by, NEW.id,
      '✅ คำสั่งซื้อเสร็จสมบูรณ์: ' || v_qnum,
      'ขอบคุณที่ใช้บริการ คำสั่งซื้อของคุณเสร็จสมบูรณ์แล้ว',
      'order_completed', 'normal',
      v_quote_url_user, 'ดูรายละเอียด'
    );
  END IF;

  RETURN NEW;
END;
$function$;
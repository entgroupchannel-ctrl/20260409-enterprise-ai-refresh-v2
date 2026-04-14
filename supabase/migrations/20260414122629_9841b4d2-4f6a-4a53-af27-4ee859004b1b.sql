
-- Phase 5.2 — Notification System Core

-- PART 1: Schema
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS link_type TEXT,
  ADD COLUMN IF NOT EXISTS link_id UUID;

CREATE INDEX IF NOT EXISTS idx_notifications_user_priority
  ON public.notifications(user_id, priority, created_at DESC)
  WHERE read IS NOT TRUE;

-- PART 2: Helper Functions
CREATE OR REPLACE FUNCTION public.notify_user(
  p_user_id UUID, p_type TEXT, p_title TEXT, p_message TEXT,
  p_priority TEXT DEFAULT 'normal', p_action_url TEXT DEFAULT NULL,
  p_action_label TEXT DEFAULT NULL, p_link_type TEXT DEFAULT NULL,
  p_link_id UUID DEFAULT NULL, p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE v_notif_id UUID;
BEGIN
  IF p_user_id IS NULL THEN RETURN NULL; END IF;
  INSERT INTO public.notifications (user_id, type, title, message, priority, action_url, action_label, link_type, link_id, metadata, read, created_at)
  VALUES (p_user_id, p_type, p_title, p_message, COALESCE(p_priority,'normal'), p_action_url, p_action_label, p_link_type, p_link_id, COALESCE(p_metadata,'{}'::jsonb), false, now())
  RETURNING id INTO v_notif_id;
  RETURN v_notif_id;
EXCEPTION WHEN OTHERS THEN RAISE WARNING 'notify_user failed: %', SQLERRM; RETURN NULL;
END; $$;

GRANT EXECUTE ON FUNCTION public.notify_user TO authenticated;

CREATE OR REPLACE FUNCTION public.notify_admins(
  p_type TEXT, p_title TEXT, p_message TEXT,
  p_priority TEXT DEFAULT 'normal', p_action_url TEXT DEFAULT NULL,
  p_action_label TEXT DEFAULT NULL, p_link_type TEXT DEFAULT NULL,
  p_link_id UUID DEFAULT NULL, p_exclude_user_id UUID DEFAULT NULL
) RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE v_count INT := 0; v_rec RECORD;
BEGIN
  FOR v_rec IN SELECT id FROM public.users WHERE role IN ('admin','sales') AND is_active = true AND (p_exclude_user_id IS NULL OR id != p_exclude_user_id)
  LOOP
    PERFORM public.notify_user(v_rec.id, p_type, p_title, p_message, p_priority, p_action_url, p_action_label, p_link_type, p_link_id);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
EXCEPTION WHEN OTHERS THEN RAISE WARNING 'notify_admins failed: %', SQLERRM; RETURN 0;
END; $$;

GRANT EXECUTE ON FUNCTION public.notify_admins TO authenticated;

-- PART 3: Triggers

-- T1: Quote created → admins
CREATE OR REPLACE FUNCTION public.trg_notify_quote_created() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  PERFORM public.notify_admins('quote_new', '📋 ใบเสนอราคาใหม่',
    COALESCE(NEW.customer_company, NEW.customer_name, 'ลูกค้า') || ' — ยอด ฿' || COALESCE(TO_CHAR(NEW.grand_total, 'FM999,999,999.00'), '0.00'),
    'high', '/admin/quotes/' || NEW.id, 'ดูใบเสนอราคา', 'quote_request', NEW.id);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_quote_created ON public.quote_requests;
CREATE TRIGGER trg_notify_quote_created AFTER INSERT ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.trg_notify_quote_created();

-- T2: PO uploaded (po_uploaded_at NULL → NOT NULL) → admins
CREATE OR REPLACE FUNCTION public.trg_notify_po_uploaded() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF OLD.po_uploaded_at IS NOT NULL OR NEW.po_uploaded_at IS NULL THEN RETURN NEW; END IF;
  PERFORM public.notify_admins('quote_po_uploaded', '📎 PO ใหม่จากลูกค้า',
    COALESCE(NEW.customer_company, NEW.customer_name, 'ลูกค้า') || ' อัปโหลด PO สำหรับ ' || COALESCE(NEW.quote_number, ''),
    'high', '/admin/quotes/' || NEW.id, 'ตรวจสอบ PO', 'quote_request', NEW.id);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_po_uploaded ON public.quote_requests;
CREATE TRIGGER trg_notify_po_uploaded AFTER UPDATE OF po_uploaded_at ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.trg_notify_po_uploaded();

-- T3: Invoice created → customer
CREATE OR REPLACE FUNCTION public.trg_notify_invoice_created() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF NEW.customer_id IS NULL THEN RETURN NEW; END IF;
  PERFORM public.notify_user(NEW.customer_id, 'invoice_new', '🧾 ใบวางบิลใหม่',
    'ใบวางบิล ' || NEW.invoice_number || ' ยอด ฿' || TO_CHAR(NEW.grand_total, 'FM999,999,999.00') || ' — รอการชำระเงิน',
    'normal', '/my-invoices/' || NEW.id, 'ดูใบวางบิล', 'invoice', NEW.id);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_invoice_created ON public.invoices;
CREATE TRIGGER trg_notify_invoice_created AFTER INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.trg_notify_invoice_created();

-- T4: Payment uploaded → admins (URGENT)
CREATE OR REPLACE FUNCTION public.trg_notify_payment_uploaded() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE v_inv_num TEXT; v_cust TEXT;
BEGIN
  SELECT invoice_number, COALESCE(customer_company, customer_name) INTO v_inv_num, v_cust FROM public.invoices WHERE id = NEW.invoice_id;
  PERFORM public.notify_admins('payment_uploaded', '💰 สลิปการโอนใหม่รอตรวจสอบ',
    COALESCE(v_cust, 'ลูกค้า') || ' ส่งสลิป ฿' || TO_CHAR(NEW.amount, 'FM999,999,999.00') || ' สำหรับ ' || COALESCE(v_inv_num, 'ใบวางบิล'),
    'urgent', '/admin/invoices/' || NEW.invoice_id, 'ตรวจสอบสลิป', 'invoice', NEW.invoice_id);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_payment_uploaded ON public.payment_records;
CREATE TRIGGER trg_notify_payment_uploaded AFTER INSERT ON public.payment_records FOR EACH ROW EXECUTE FUNCTION public.trg_notify_payment_uploaded();

-- T5: Payment verified → customer
CREATE OR REPLACE FUNCTION public.trg_notify_payment_verified() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE v_inv_num TEXT; v_cust_id UUID;
BEGIN
  IF OLD.verification_status = NEW.verification_status OR NEW.verification_status != 'verified' THEN RETURN NEW; END IF;
  SELECT invoice_number, customer_id INTO v_inv_num, v_cust_id FROM public.invoices WHERE id = NEW.invoice_id;
  IF v_cust_id IS NULL THEN RETURN NEW; END IF;
  PERFORM public.notify_user(v_cust_id, 'payment_verified', '✅ ยืนยันการชำระเงินแล้ว',
    'การชำระเงิน ฿' || TO_CHAR(NEW.amount, 'FM999,999,999.00') || ' สำหรับ ' || COALESCE(v_inv_num, 'ใบวางบิล') || ' ได้รับการยืนยันแล้ว',
    'normal', '/my-invoices/' || NEW.invoice_id, 'ดูรายละเอียด', 'invoice', NEW.invoice_id);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_payment_verified ON public.payment_records;
CREATE TRIGGER trg_notify_payment_verified AFTER UPDATE OF verification_status ON public.payment_records FOR EACH ROW EXECUTE FUNCTION public.trg_notify_payment_verified();

-- T6: Payment rejected → customer
CREATE OR REPLACE FUNCTION public.trg_notify_payment_rejected() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE v_inv_num TEXT; v_cust_id UUID;
BEGIN
  IF OLD.verification_status = NEW.verification_status OR NEW.verification_status != 'rejected' THEN RETURN NEW; END IF;
  SELECT invoice_number, customer_id INTO v_inv_num, v_cust_id FROM public.invoices WHERE id = NEW.invoice_id;
  IF v_cust_id IS NULL THEN RETURN NEW; END IF;
  PERFORM public.notify_user(v_cust_id, 'payment_rejected', '⚠️ สลิปถูกปฏิเสธ',
    'การชำระเงิน ฿' || TO_CHAR(NEW.amount, 'FM999,999,999.00') || ' สำหรับ ' || COALESCE(v_inv_num, 'ใบวางบิล') || COALESCE(' — ' || NEW.rejection_reason, ' ถูกปฏิเสธ กรุณาส่งสลิปใหม่'),
    'high', '/my-invoices/' || NEW.invoice_id, 'ส่งสลิปใหม่', 'invoice', NEW.invoice_id);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_payment_rejected ON public.payment_records;
CREATE TRIGGER trg_notify_payment_rejected AFTER UPDATE OF verification_status ON public.payment_records FOR EACH ROW EXECUTE FUNCTION public.trg_notify_payment_rejected();

-- T7: Tax invoice → customer
CREATE OR REPLACE FUNCTION public.trg_notify_tax_invoice_created() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF NEW.customer_id IS NULL THEN RETURN NEW; END IF;
  PERFORM public.notify_user(NEW.customer_id, 'tax_invoice_new', '📄 ใบกำกับภาษีใหม่',
    'ใบกำกับภาษี ' || NEW.tax_invoice_number || ' ยอด ฿' || TO_CHAR(NEW.grand_total, 'FM999,999,999.00') || ' พร้อมให้ดาวน์โหลด',
    'normal', '/my-tax-invoices/' || NEW.id, 'ดูใบกำกับภาษี', 'tax_invoice', NEW.id);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_tax_invoice_created ON public.tax_invoices;
CREATE TRIGGER trg_notify_tax_invoice_created AFTER INSERT ON public.tax_invoices FOR EACH ROW EXECUTE FUNCTION public.trg_notify_tax_invoice_created();

-- T8: Receipt → customer
CREATE OR REPLACE FUNCTION public.trg_notify_receipt_created() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF NEW.customer_id IS NULL THEN RETURN NEW; END IF;
  PERFORM public.notify_user(NEW.customer_id, 'receipt_new', '🧾 ใบเสร็จรับเงินใหม่',
    'ใบเสร็จ ' || NEW.receipt_number || ' ยอด ฿' || TO_CHAR(NEW.amount, 'FM999,999,999.00') || ' พร้อมให้ดาวน์โหลด',
    'normal', '/my-receipts/' || NEW.id, 'ดูใบเสร็จ', 'receipt', NEW.id);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_notify_receipt_created ON public.receipts;
CREATE TRIGGER trg_notify_receipt_created AFTER INSERT ON public.receipts FOR EACH ROW EXECUTE FUNCTION public.trg_notify_receipt_created();

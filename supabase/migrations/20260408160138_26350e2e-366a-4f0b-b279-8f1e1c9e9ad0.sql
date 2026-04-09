
-- ═══════════════════════════════════════════════════════════════════════════
-- QUOTE FLOW MIGRATION - Sales Pipeline → Document Workflow
-- Fixed to match actual database schema
-- ═══════════════════════════════════════════════════════════════════════════

-- STEP 1: Remove old constraint
ALTER TABLE quote_requests 
DROP CONSTRAINT IF EXISTS quote_requests_status_check;

-- STEP 2: Migrate existing data
UPDATE quote_requests SET status = 'pending' WHERE status IN ('new', 'draft');
UPDATE quote_requests SET status = 'quote_sent' WHERE status IN ('quoted', 'negotiating');
UPDATE quote_requests SET status = 'cancelled' WHERE status = 'lost';
UPDATE quote_requests SET status = 'po_approved' WHERE status = 'won';
UPDATE quote_requests SET status = 'po_uploaded' WHERE status = 'po_received';

-- STEP 3: Add new constraint
ALTER TABLE quote_requests 
ADD CONSTRAINT quote_requests_status_check 
CHECK (status IN ('pending', 'quote_sent', 'po_uploaded', 'po_approved', 'completed', 'cancelled'));

ALTER TABLE quote_requests ALTER COLUMN status SET DEFAULT 'pending';

-- STEP 4: update_quote_status function (auto SO+BL on po_approved)
CREATE OR REPLACE FUNCTION public.update_quote_status(
  p_quote_id uuid,
  p_new_status text,
  p_admin_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old_status text;
  v_quote record;
  v_so_id uuid;
  v_bl_id uuid;
  v_so_number text;
  v_bl_number text;
BEGIN
  SELECT * INTO v_quote FROM quote_requests WHERE id = p_quote_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quote not found: %', p_quote_id;
  END IF;
  
  v_old_status := v_quote.status;
  
  IF p_new_status NOT IN ('pending','quote_sent','po_uploaded','po_approved','completed','cancelled') THEN
    RAISE EXCEPTION 'Invalid status: %', p_new_status;
  END IF;

  -- Update status
  UPDATE quote_requests 
  SET status = p_new_status, updated_at = now()
  WHERE id = p_quote_id;

  -- Log status change
  INSERT INTO quote_messages (quote_id, sender_role, sender_id, content, message_type)
  VALUES (p_quote_id, 'system', p_admin_id, 
    'เปลี่ยนสถานะจาก "' || v_old_status || '" เป็น "' || p_new_status || '"',
    'status_change');

  -- On po_approved → auto-create SO + BL then set completed
  IF p_new_status = 'po_approved' AND v_old_status != 'po_approved' THEN
    -- Create Sales Order
    INSERT INTO sales_orders (
      quote_id, user_id, customer_name, customer_email, customer_phone,
      customer_company, customer_address, customer_tax_id,
      subtotal, discount_amount, vat_amount, withholding_tax, grand_total,
      po_number, po_file_url, po_file_name, status
    )
    VALUES (
      p_quote_id, v_quote.user_id, v_quote.name, v_quote.email, v_quote.phone,
      v_quote.company, v_quote.customer_address, v_quote.customer_tax_id,
      COALESCE(v_quote.subtotal, 0), COALESCE(v_quote.discount_amount, 0),
      COALESCE(v_quote.vat_amount, 0), COALESCE(v_quote.withholding_tax, 0),
      COALESCE(v_quote.grand_total, 0),
      v_quote.po_number, v_quote.po_file_url, v_quote.po_file_name, 'pending'
    )
    RETURNING id, order_number INTO v_so_id, v_so_number;

    -- Copy line items to SO
    INSERT INTO sales_order_items (
      order_id, product_id, model, name_th, description, category,
      qty, unit_label, unit_price, discount_percent, line_total,
      specs, warranty_terms, admin_notes, sort_order
    )
    SELECT
      v_so_id, product_id, model, description, description, category,
      qty, 'เครื่อง', unit_price, COALESCE(discount_percent, 0), line_total,
      custom_specs, NULL, admin_notes, COALESCE(sort_order, 0)
    FROM quote_line_items
    WHERE quote_id = p_quote_id;

    -- Create Billing Note
    INSERT INTO billing_notes (
      order_id, quote_id, user_id,
      customer_name, customer_email, customer_phone, customer_company,
      customer_address, customer_tax_id,
      subtotal, discount_amount, vat_amount, withholding_tax, grand_total,
      po_number, po_file_url, status
    )
    VALUES (
      v_so_id, p_quote_id, v_quote.user_id,
      v_quote.name, v_quote.email, v_quote.phone, v_quote.company,
      v_quote.customer_address, v_quote.customer_tax_id,
      COALESCE(v_quote.subtotal, 0), COALESCE(v_quote.discount_amount, 0),
      COALESCE(v_quote.vat_amount, 0), COALESCE(v_quote.withholding_tax, 0),
      COALESCE(v_quote.grand_total, 0),
      v_quote.po_number, v_quote.po_file_url, 'draft'
    )
    RETURNING id, billing_number INTO v_bl_id, v_bl_number;

    -- Set quote to completed
    UPDATE quote_requests SET status = 'completed', updated_at = now() WHERE id = p_quote_id;

    -- Log
    INSERT INTO quote_messages (quote_id, sender_role, sender_id, content, message_type)
    VALUES (p_quote_id, 'system', p_admin_id,
      'สร้าง Sales Order (' || COALESCE(v_so_number,'') || ') และ Billing Note (' || COALESCE(v_bl_number,'') || ') อัตโนมัติแล้ว',
      'status_change');

    RETURN jsonb_build_object(
      'status', 'completed',
      'so_id', v_so_id, 'so_number', v_so_number,
      'bl_id', v_bl_id, 'bl_number', v_bl_number
    );
  END IF;

  RETURN jsonb_build_object('status', p_new_status, 'old_status', v_old_status);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_quote_status TO authenticated;

-- STEP 5: send_quotation function
CREATE OR REPLACE FUNCTION public.send_quotation(
  p_quote_id uuid,
  p_pdf_url text,
  p_admin_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quote record;
BEGIN
  SELECT * INTO v_quote FROM quote_requests WHERE id = p_quote_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Quote not found'; END IF;

  UPDATE quote_requests 
  SET status = 'quote_sent', pdf_url = p_pdf_url,
      approved_by = p_admin_id, approved_at = now(), updated_at = now()
  WHERE id = p_quote_id;

  INSERT INTO quote_messages (quote_id, sender_role, sender_id, content, message_type)
  VALUES (p_quote_id, 'system', p_admin_id, 'ส่งใบเสนอราคาให้ลูกค้าแล้ว', 'status_change');

  -- Notify customer
  IF v_quote.user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link, metadata)
    VALUES (
      v_quote.user_id, 'quote', 'ได้รับใบเสนอราคาแล้ว',
      'ใบเสนอราคา ' || COALESCE(v_quote.quote_number,'') || ' พร้อมให้ตรวจสอบ',
      '/my-account/quotes',
      jsonb_build_object('quote_id', p_quote_id)
    );
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.send_quotation TO authenticated;

-- STEP 6: PO upload trigger
CREATE OR REPLACE FUNCTION public.handle_po_upload()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quote record;
BEGIN
  SELECT * INTO v_quote FROM quote_requests WHERE id = NEW.quote_id;
  IF NOT FOUND THEN RETURN NEW; END IF;

  UPDATE quote_requests 
  SET status = 'po_uploaded',
      po_file_url = NEW.file_url, po_file_name = NEW.file_name,
      po_uploaded_at = now(), updated_at = now()
  WHERE id = NEW.quote_id;

  INSERT INTO quote_messages (quote_id, sender_role, sender_id, content, message_type)
  VALUES (NEW.quote_id, 'user', NEW.uploaded_by, 'อัปโหลด PO แล้ว: ' || NEW.file_name, 'message');

  -- Notify assigned sales
  IF v_quote.assigned_to IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link, metadata)
    VALUES (
      v_quote.assigned_to, 'po_uploaded', 'มี PO ใหม่รอตรวจสอบ',
      'ลูกค้า ' || v_quote.name || ' อัปโหลด PO แล้ว',
      '/admin?tab=quotes&id=' || NEW.quote_id,
      jsonb_build_object('quote_id', NEW.quote_id, 'quote_number', v_quote.quote_number)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_po_upload ON po_files;
CREATE TRIGGER on_po_upload
  AFTER INSERT ON po_files
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_po_upload();

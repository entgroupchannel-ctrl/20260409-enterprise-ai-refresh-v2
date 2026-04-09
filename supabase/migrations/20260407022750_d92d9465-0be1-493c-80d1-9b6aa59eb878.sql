
-- ═══ STEP 1: เพิ่ม chain_number column ในทุกตาราง ═══
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS chain_number TEXT;
ALTER TABLE sales_orders   ADD COLUMN IF NOT EXISTS chain_number TEXT;
ALTER TABLE billing_notes  ADD COLUMN IF NOT EXISTS chain_number TEXT;
ALTER TABLE invoices       ADD COLUMN IF NOT EXISTS chain_number TEXT;
ALTER TABLE delivery_notes ADD COLUMN IF NOT EXISTS chain_number TEXT;
ALTER TABLE payment_records ADD COLUMN IF NOT EXISTS chain_number TEXT;
ALTER TABLE receipts       ADD COLUMN IF NOT EXISTS chain_number TEXT;
ALTER TABLE tax_invoices   ADD COLUMN IF NOT EXISTS chain_number TEXT;

CREATE INDEX IF NOT EXISTS idx_quote_chain    ON quote_requests(chain_number);
CREATE INDEX IF NOT EXISTS idx_so_chain       ON sales_orders(chain_number);
CREATE INDEX IF NOT EXISTS idx_bl_chain       ON billing_notes(chain_number);
CREATE INDEX IF NOT EXISTS idx_inv_chain      ON invoices(chain_number);
CREATE INDEX IF NOT EXISTS idx_dn_chain       ON delivery_notes(chain_number);
CREATE INDEX IF NOT EXISTS idx_pay_chain      ON payment_records(chain_number);
CREATE INDEX IF NOT EXISTS idx_rcp_chain      ON receipts(chain_number);
CREATE INDEX IF NOT EXISTS idx_tiv_chain      ON tax_invoices(chain_number);

-- ═══ STEP 2: Helper function — generate next chain_number ═══
CREATE OR REPLACE FUNCTION public.generate_chain_number()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  current_year TEXT;
  seq_num INTEGER;
  result TEXT;
BEGIN
  current_year := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(seq), 0) + 1 INTO seq_num
  FROM (
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM quote_requests
    WHERE chain_number LIKE current_year || '-%'
    UNION ALL
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM sales_orders
    WHERE chain_number LIKE current_year || '-%'
    UNION ALL
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM billing_notes
    WHERE chain_number LIKE current_year || '-%'
    UNION ALL
    SELECT CAST(SUBSTRING(chain_number FROM '\d{4}-(\d+)') AS INTEGER) AS seq
    FROM invoices
    WHERE chain_number LIKE current_year || '-%'
  ) all_chains;
  result := current_year || '-' || lpad(seq_num::text, 4, '0');
  RETURN result;
END;
$$;

-- ═══ STEP 3: Helper function — format document number ═══
CREATE OR REPLACE FUNCTION public.format_doc_number(prefix TEXT, chain TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT prefix || '-' || chain;
$$;

-- ═══ STEP 4: Backfill chain_number (ไม่เปลี่ยนเลขเอกสาร) ═══
UPDATE quote_requests
SET chain_number = SUBSTRING(quote_number FROM 'Q-(\d{4}-\d+)')
WHERE chain_number IS NULL AND quote_number IS NOT NULL AND quote_number LIKE 'Q-%';

UPDATE sales_orders so
SET chain_number = q.chain_number
FROM quote_requests q
WHERE so.quote_id = q.id AND so.chain_number IS NULL AND q.chain_number IS NOT NULL;

UPDATE billing_notes bn
SET chain_number = q.chain_number
FROM quote_requests q
WHERE bn.quote_id = q.id AND bn.chain_number IS NULL AND q.chain_number IS NOT NULL;

UPDATE invoices inv
SET chain_number = q.chain_number
FROM quote_requests q
WHERE inv.quote_id = q.id AND inv.chain_number IS NULL AND q.chain_number IS NOT NULL;

UPDATE invoices inv
SET chain_number = bn.chain_number
FROM billing_notes bn
WHERE inv.billing_note_id = bn.id AND inv.chain_number IS NULL AND bn.chain_number IS NOT NULL;

UPDATE delivery_notes dn
SET chain_number = q.chain_number
FROM quote_requests q
WHERE dn.quote_id = q.id AND dn.chain_number IS NULL AND q.chain_number IS NOT NULL;

UPDATE payment_records pr
SET chain_number = inv.chain_number
FROM invoices inv
WHERE pr.invoice_id = inv.id AND pr.chain_number IS NULL AND inv.chain_number IS NOT NULL;

UPDATE receipts r
SET chain_number = inv.chain_number
FROM invoices inv
WHERE r.invoice_id = inv.id AND r.chain_number IS NULL AND inv.chain_number IS NOT NULL;

UPDATE tax_invoices ti
SET chain_number = inv.chain_number
FROM invoices inv
WHERE ti.invoice_id = inv.id AND ti.chain_number IS NULL AND inv.chain_number IS NOT NULL;

-- ═══ STEP 5: Drop old number generators ═══
DROP TRIGGER IF EXISTS trg_generate_quote_number ON quote_requests;
DROP TRIGGER IF EXISTS trg_quote_number ON quote_requests;
DROP TRIGGER IF EXISTS trg_generate_order_number ON sales_orders;
DROP TRIGGER IF EXISTS trg_order_number ON sales_orders;
DROP TRIGGER IF EXISTS trg_generate_billing_number ON billing_notes;
DROP TRIGGER IF EXISTS trg_billing_number ON billing_notes;
DROP TRIGGER IF EXISTS trg_generate_invoice_number ON invoices;
DROP TRIGGER IF EXISTS trg_invoice_number ON invoices;
DROP TRIGGER IF EXISTS trg_generate_delivery_number ON delivery_notes;
DROP TRIGGER IF EXISTS trg_generate_payment_number ON payment_records;
DROP TRIGGER IF EXISTS trg_generate_receipt_number ON receipts;
DROP TRIGGER IF EXISTS trg_receipt_number ON receipts;
DROP TRIGGER IF EXISTS trg_generate_tax_invoice_number ON tax_invoices;
DROP TRIGGER IF EXISTS trg_tax_invoice_number ON tax_invoices;

-- ═══ STEP 6: New unified number generators ═══

-- 6a. Quote
CREATE OR REPLACE FUNCTION public.set_quote_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.chain_number IS NULL OR NEW.chain_number = '' THEN
    NEW.chain_number := generate_chain_number();
  END IF;
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := 'QT-' || NEW.chain_number;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_quote_number
  BEFORE INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_quote_number();

-- 6b. Sales Order
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE _chain TEXT;
BEGIN
  IF NEW.chain_number IS NULL OR NEW.chain_number = '' THEN
    SELECT chain_number INTO _chain FROM quote_requests WHERE id = NEW.quote_id;
    NEW.chain_number := COALESCE(_chain, generate_chain_number());
  END IF;
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'SO-' || NEW.chain_number;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_order_number
  BEFORE INSERT ON sales_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_number();

-- 6c. Billing Note
CREATE OR REPLACE FUNCTION public.set_billing_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE _chain TEXT;
BEGIN
  IF NEW.chain_number IS NULL OR NEW.chain_number = '' THEN
    IF NEW.quote_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM quote_requests WHERE id = NEW.quote_id;
    END IF;
    IF _chain IS NULL AND NEW.order_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM sales_orders WHERE id = NEW.order_id;
    END IF;
    NEW.chain_number := COALESCE(_chain, generate_chain_number());
  END IF;
  IF NEW.billing_number IS NULL OR NEW.billing_number = '' THEN
    NEW.billing_number := 'BL-' || NEW.chain_number;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_billing_number
  BEFORE INSERT ON billing_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_billing_number();

-- 6d. Invoice
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE _chain TEXT;
BEGIN
  IF NEW.chain_number IS NULL OR NEW.chain_number = '' THEN
    IF NEW.billing_note_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM billing_notes WHERE id = NEW.billing_note_id;
    END IF;
    IF _chain IS NULL AND NEW.order_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM sales_orders WHERE id = NEW.order_id;
    END IF;
    IF _chain IS NULL AND NEW.quote_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM quote_requests WHERE id = NEW.quote_id;
    END IF;
    NEW.chain_number := COALESCE(_chain, generate_chain_number());
  END IF;
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := 'INV-' || NEW.chain_number;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_invoice_number();

-- 6e. Delivery Note
CREATE OR REPLACE FUNCTION public.set_delivery_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE _chain TEXT;
BEGIN
  IF NEW.chain_number IS NULL OR NEW.chain_number = '' THEN
    IF NEW.invoice_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM invoices WHERE id = NEW.invoice_id;
    END IF;
    IF _chain IS NULL AND NEW.order_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM sales_orders WHERE id = NEW.order_id;
    END IF;
    IF _chain IS NULL AND NEW.quote_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM quote_requests WHERE id = NEW.quote_id;
    END IF;
    NEW.chain_number := COALESCE(_chain, generate_chain_number());
  END IF;
  IF NEW.delivery_number IS NULL OR NEW.delivery_number = '' THEN
    NEW.delivery_number := 'DN-' || NEW.chain_number;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_delivery_number
  BEFORE INSERT ON delivery_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_delivery_number();

-- 6f. Payment Record
CREATE OR REPLACE FUNCTION public.set_payment_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE _chain TEXT;
BEGIN
  IF NEW.chain_number IS NULL OR NEW.chain_number = '' THEN
    IF NEW.invoice_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM invoices WHERE id = NEW.invoice_id;
    END IF;
    IF _chain IS NULL AND NEW.billing_note_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM billing_notes WHERE id = NEW.billing_note_id;
    END IF;
    IF _chain IS NULL AND NEW.quote_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM quote_requests WHERE id = NEW.quote_id;
    END IF;
    NEW.chain_number := COALESCE(_chain, generate_chain_number());
  END IF;
  IF NEW.payment_number IS NULL OR NEW.payment_number = '' THEN
    NEW.payment_number := 'PAY-' || NEW.chain_number;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_payment_number
  BEFORE INSERT ON payment_records
  FOR EACH ROW
  EXECUTE FUNCTION public.set_payment_number();

-- 6g. Receipt
CREATE OR REPLACE FUNCTION public.set_receipt_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE _chain TEXT;
BEGIN
  IF NEW.chain_number IS NULL OR NEW.chain_number = '' THEN
    IF NEW.invoice_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM invoices WHERE id = NEW.invoice_id;
    END IF;
    IF _chain IS NULL AND NEW.payment_record_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM payment_records WHERE id = NEW.payment_record_id;
    END IF;
    NEW.chain_number := COALESCE(_chain, generate_chain_number());
  END IF;
  IF NEW.receipt_number IS NULL OR NEW.receipt_number = '' THEN
    NEW.receipt_number := 'RCP-' || NEW.chain_number;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_receipt_number
  BEFORE INSERT ON receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_receipt_number();

-- 6h. Tax Invoice
CREATE OR REPLACE FUNCTION public.set_tax_invoice_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE _chain TEXT;
BEGIN
  IF NEW.chain_number IS NULL OR NEW.chain_number = '' THEN
    IF NEW.invoice_id IS NOT NULL THEN
      SELECT chain_number INTO _chain FROM invoices WHERE id = NEW.invoice_id;
    END IF;
    NEW.chain_number := COALESCE(_chain, generate_chain_number());
  END IF;
  IF NEW.tax_invoice_number IS NULL OR NEW.tax_invoice_number = '' THEN
    NEW.tax_invoice_number := 'TIV-' || NEW.chain_number;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_tax_invoice_number
  BEFORE INSERT ON tax_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_tax_invoice_number();

-- ═══ STEP 7: Update auto_create_sales_order to pass chain_number ═══
CREATE OR REPLACE FUNCTION public.auto_create_sales_order()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  _order_id UUID;
  _should_create BOOLEAN := FALSE;
BEGIN
  IF NEW.po_status = 'approved' AND (OLD.po_status IS DISTINCT FROM 'approved') THEN
    _should_create := TRUE;
  END IF;
  IF NEW.status = 'won' AND OLD.status IS DISTINCT FROM 'won' THEN
    _should_create := TRUE;
  END IF;

  IF _should_create AND NOT EXISTS (SELECT 1 FROM sales_orders WHERE quote_id = NEW.id) THEN
    INSERT INTO sales_orders (
      quote_id, chain_number,
      customer_name, customer_email, customer_phone, customer_company,
      user_id, assigned_to, po_number, po_file_url, po_file_name,
      subtotal, discount_amount,
      vat_amount, withholding_tax,
      grand_total, net_payable,
      payment_terms, delivery_terms, status
    ) VALUES (
      NEW.id, NEW.chain_number,
      NEW.name, NEW.email, NEW.phone, NEW.company,
      NEW.user_id, NEW.assigned_to, NEW.po_number, NEW.po_file_url, NEW.po_file_name,
      NEW.subtotal, NEW.discount_amount,
      COALESCE(NEW.vat_amount, 0), COALESCE(NEW.withholding_tax, 0),
      NEW.grand_total, NEW.grand_total - COALESCE(NEW.withholding_tax, 0),
      NEW.payment_terms, NEW.delivery_terms, 'confirmed'
    ) RETURNING id INTO _order_id;

    INSERT INTO sales_order_items (
      order_id, product_id, model, category, qty, unit_price,
      discount_percent, line_total, specs, admin_notes, sort_order
    )
    SELECT
      _order_id, product_id, model, category, qty, unit_price,
      discount_percent,
      ROUND(unit_price * (1 - discount_percent / 100) * qty, 2),
      custom_specs, admin_notes, sort_order
    FROM quote_line_items
    WHERE quote_id = NEW.id
    ORDER BY sort_order;

    UPDATE sales_order_items soi
    SET
      name_th = pc.name_th,
      description = pc.description,
      unit_label = COALESCE(pc.unit_label, 'เครื่อง'),
      warranty_terms = pc.warranty_terms
    FROM product_catalog pc
    WHERE soi.order_id = _order_id
      AND soi.product_id = pc.id;
  END IF;
  RETURN NEW;
END;
$$;

-- ═══ STEP 8: Update auto_create_billing_note to pass chain_number ═══
CREATE OR REPLACE FUNCTION public.auto_create_billing_note()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  _billing_id UUID;
  _order_id UUID;
  _should_create BOOLEAN := FALSE;
BEGIN
  IF NEW.po_status = 'approved' AND (OLD.po_status IS DISTINCT FROM 'approved') THEN
    _should_create := TRUE;
  END IF;
  IF NEW.status = 'won' AND OLD.status IS DISTINCT FROM 'won' THEN
    _should_create := TRUE;
  END IF;

  IF _should_create AND NOT EXISTS (SELECT 1 FROM billing_notes WHERE quote_id = NEW.id) THEN
    SELECT id INTO _order_id FROM sales_orders WHERE quote_id = NEW.id LIMIT 1;

    INSERT INTO billing_notes (
      quote_id, order_id, chain_number,
      customer_name, customer_company, customer_email, customer_phone,
      po_number, po_file_url,
      subtotal, discount_amount, vat_amount, withholding_tax, grand_total,
      payment_terms, due_date,
      assigned_to, user_id, status
    ) VALUES (
      NEW.id, _order_id, NEW.chain_number,
      NEW.name, NEW.company, NEW.email, NEW.phone,
      NEW.po_number, NEW.po_file_url,
      NEW.subtotal, NEW.discount_amount,
      COALESCE(NEW.vat_amount, 0), COALESCE(NEW.withholding_tax, 0),
      NEW.grand_total,
      NEW.payment_terms,
      CURRENT_DATE + INTERVAL '30 days',
      NEW.assigned_to, NEW.user_id, 'draft'
    ) RETURNING id INTO _billing_id;

    INSERT INTO billing_note_items (
      billing_note_id, product_id, model, category, description,
      qty, unit_price, discount_percent, line_total, sort_order
    )
    SELECT
      _billing_id, li.product_id, li.model, li.category,
      COALESCE(pc.name_th, li.admin_notes, li.model),
      li.qty, li.unit_price, li.discount_percent,
      ROUND(li.unit_price * (1 - li.discount_percent / 100) * li.qty, 2),
      li.sort_order
    FROM quote_line_items li
    LEFT JOIN product_catalog pc ON pc.id = li.product_id
    WHERE li.quote_id = NEW.id
    ORDER BY li.sort_order;
  END IF;
  RETURN NEW;
END;
$$;

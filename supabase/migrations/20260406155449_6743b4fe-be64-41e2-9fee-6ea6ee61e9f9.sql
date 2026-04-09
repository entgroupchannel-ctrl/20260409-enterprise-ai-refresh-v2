-- ═══ STEP 1: Drop ALL conflicting triggers on quote_requests ═══
DROP TRIGGER IF EXISTS trg_auto_create_order ON quote_requests;
DROP TRIGGER IF EXISTS trg_auto_create_sales_order ON quote_requests;
DROP TRIGGER IF EXISTS trg_auto_billing_note ON quote_requests;
DROP TRIGGER IF EXISTS trg_auto_create_billing_note ON quote_requests;

-- Also drop number generation triggers that may conflict
DROP TRIGGER IF EXISTS trg_order_number ON sales_orders;
DROP TRIGGER IF EXISTS trg_generate_order_number ON sales_orders;
DROP TRIGGER IF EXISTS trg_billing_number ON billing_notes;
DROP TRIGGER IF EXISTS trg_generate_billing_number ON billing_notes;


-- ═══ STEP 2: Recreate auto_create_sales_order ═══
CREATE OR REPLACE FUNCTION public.auto_create_sales_order()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  _order_id UUID;
  _should_create BOOLEAN := FALSE;
BEGIN
  -- Condition A: PO approved
  IF NEW.po_status = 'approved' AND (OLD.po_status IS DISTINCT FROM 'approved') THEN
    _should_create := TRUE;
  END IF;

  -- Condition B: Status changed to 'won'
  IF NEW.status = 'won' AND OLD.status IS DISTINCT FROM 'won' THEN
    _should_create := TRUE;
  END IF;

  IF _should_create AND NOT EXISTS (SELECT 1 FROM sales_orders WHERE quote_id = NEW.id) THEN
    INSERT INTO sales_orders (
      quote_id, customer_name, customer_email, customer_phone, customer_company,
      user_id, assigned_to, po_number, po_file_url, po_file_name,
      subtotal, discount_amount,
      vat_amount, withholding_tax,
      grand_total, net_payable,
      payment_terms, delivery_terms, status
    ) VALUES (
      NEW.id, NEW.name, NEW.email, NEW.phone, NEW.company,
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


-- ═══ STEP 3: Recreate auto_create_billing_note ═══
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
      quote_id, order_id,
      customer_name, customer_company, customer_email, customer_phone,
      po_number, po_file_url,
      subtotal, discount_amount, vat_amount, withholding_tax, grand_total,
      payment_terms, due_date,
      assigned_to, user_id, status
    ) VALUES (
      NEW.id, _order_id,
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


-- ═══ STEP 4: Recreate number generators ═══
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE seq_num INTEGER;
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    SELECT COUNT(*) + 1 INTO seq_num FROM sales_orders
    WHERE created_at >= date_trunc('year', now());
    NEW.order_number := 'SO-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_billing_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE seq_num INTEGER;
BEGIN
  IF NEW.billing_number IS NULL OR NEW.billing_number = '' THEN
    SELECT COUNT(*) + 1 INTO seq_num FROM billing_notes
    WHERE created_at >= date_trunc('year', now());
    NEW.billing_number := 'BL-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;


-- ═══ STEP 5: Attach ALL triggers (clean slate) ═══
CREATE TRIGGER trg_auto_create_sales_order
  AFTER UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_sales_order();

CREATE TRIGGER trg_auto_create_billing_note
  AFTER UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_billing_note();

CREATE TRIGGER trg_generate_order_number
  BEFORE INSERT ON public.sales_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_order_number();

CREATE TRIGGER trg_generate_billing_number
  BEFORE INSERT ON public.billing_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_billing_number();
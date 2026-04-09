
-- ═══ 1. BILLING NOTES (ใบวางบิล) ═══
CREATE TABLE IF NOT EXISTS public.billing_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_number TEXT UNIQUE NOT NULL DEFAULT '',
  quote_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.sales_orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  customer_address TEXT,
  customer_tax_id TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  po_number TEXT,
  po_file_url TEXT,
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  withholding_tax NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) DEFAULT 0,
  billing_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  payment_terms TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_by UUID,
  assigned_to UUID,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.billing_note_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_note_id UUID NOT NULL REFERENCES public.billing_notes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.product_catalog(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  category TEXT,
  description TEXT,
  qty INTEGER DEFAULT 1,
  unit_price NUMERIC(12,2) DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  line_total NUMERIC(12,2) DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_notes_quote ON billing_notes(quote_id);
CREATE INDEX IF NOT EXISTS idx_billing_notes_order ON billing_notes(order_id);
CREATE INDEX IF NOT EXISTS idx_billing_notes_status ON billing_notes(status);

ALTER TABLE billing_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_note_items ENABLE ROW LEVEL SECURITY;

-- RLS: Admins full access, users view own
CREATE POLICY "Admins manage billing_notes" ON billing_notes FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Users view own billing_notes" ON billing_notes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage billing_note_items" ON billing_note_items FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Users view own billing_note_items" ON billing_note_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM billing_notes bn WHERE bn.id = billing_note_items.billing_note_id AND (bn.user_id = auth.uid() OR is_admin(auth.uid()))));

-- Auto-generate billing number: BL-YYYY-XXXX
CREATE OR REPLACE FUNCTION public.generate_billing_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM billing_notes WHERE created_at >= date_trunc('year', now());
  NEW.billing_number := 'BL-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_billing_number BEFORE INSERT ON public.billing_notes
FOR EACH ROW WHEN (NEW.billing_number = '' OR NEW.billing_number IS NULL)
EXECUTE FUNCTION public.generate_billing_number();


-- ═══ 2. DELIVERY NOTES (ใบส่งสินค้า) ═══
CREATE TABLE IF NOT EXISTS public.delivery_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_number TEXT UNIQUE NOT NULL DEFAULT '',
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  billing_note_id UUID REFERENCES public.billing_notes(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.sales_orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  customer_address TEXT,
  customer_phone TEXT,
  delivery_address TEXT,
  delivery_date DATE DEFAULT CURRENT_DATE,
  courier TEXT,
  tracking_number TEXT,
  status TEXT NOT NULL DEFAULT 'preparing',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.delivery_note_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_note_id UUID NOT NULL REFERENCES public.delivery_notes(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  description TEXT,
  qty INTEGER DEFAULT 1,
  serial_numbers TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delivery_notes_invoice ON delivery_notes(invoice_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_status ON delivery_notes(status);

ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_note_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage delivery_notes" ON delivery_notes FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins manage delivery_note_items" ON delivery_note_items FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Auto-generate delivery number: DN-YYYY-XXXX
CREATE OR REPLACE FUNCTION public.generate_delivery_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM delivery_notes WHERE created_at >= date_trunc('year', now());
  NEW.delivery_number := 'DN-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_delivery_number BEFORE INSERT ON public.delivery_notes
FOR EACH ROW WHEN (NEW.delivery_number = '' OR NEW.delivery_number IS NULL)
EXECUTE FUNCTION public.generate_delivery_number();


-- ═══ 3. PAYMENT RECORDS (บันทึกการจ่ายเงิน) ═══
CREATE TABLE IF NOT EXISTS public.payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT UNIQUE NOT NULL DEFAULT '',
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  billing_note_id UUID REFERENCES public.billing_notes(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL DEFAULT 'transfer',
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  bank_name TEXT,
  reference_number TEXT,
  slip_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  confirmed_by UUID,
  confirmed_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_records_invoice ON payment_records(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_status ON payment_records(status);

ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payment_records" ON payment_records FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Auto-generate payment number: PAY-YYYY-XXXX
CREATE OR REPLACE FUNCTION public.generate_payment_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM payment_records WHERE created_at >= date_trunc('year', now());
  NEW.payment_number := 'PAY-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_payment_number BEFORE INSERT ON public.payment_records
FOR EACH ROW WHEN (NEW.payment_number = '' OR NEW.payment_number IS NULL)
EXECUTE FUNCTION public.generate_payment_number();


-- ═══ 4. ALTER EXISTING TABLES ═══
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS billing_note_id UUID REFERENCES public.billing_notes(id);
ALTER TABLE public.receipts ADD COLUMN IF NOT EXISTS payment_record_id UUID REFERENCES public.payment_records(id);
ALTER TABLE public.receipts ADD COLUMN IF NOT EXISTS billing_note_id UUID REFERENCES public.billing_notes(id);


-- ═══ 5. AUTO-CREATE BILLING NOTE WHEN PO APPROVED ═══
CREATE OR REPLACE FUNCTION public.auto_create_billing_note()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  _billing_id UUID;
  _order_id UUID;
BEGIN
  IF NEW.po_status = 'approved' AND (OLD.po_status IS NULL OR OLD.po_status != 'approved') THEN
    SELECT id INTO _order_id FROM sales_orders WHERE quote_id = NEW.id LIMIT 1;

    IF NOT EXISTS (SELECT 1 FROM billing_notes WHERE quote_id = NEW.id) THEN
      INSERT INTO billing_notes (
        quote_id, order_id,
        customer_name, customer_company, customer_email, customer_phone,
        po_number, po_file_url,
        subtotal, discount_amount, vat_amount, withholding_tax, grand_total,
        payment_terms, due_date, assigned_to, user_id, status
      ) VALUES (
        NEW.id, _order_id,
        NEW.name, NEW.company, NEW.email, NEW.phone,
        NEW.po_number, NEW.po_file_url,
        NEW.subtotal, NEW.discount_amount,
        COALESCE(NEW.vat_amount, 0), COALESCE(NEW.withholding_tax, 0),
        NEW.grand_total, NEW.payment_terms,
        CURRENT_DATE + INTERVAL '30 days',
        NEW.assigned_to, NEW.user_id, 'draft'
      ) RETURNING id INTO _billing_id;

      INSERT INTO billing_note_items (
        billing_note_id, product_id, model, category, description,
        qty, unit_price, discount_percent, line_total, sort_order
      )
      SELECT _billing_id, product_id, model, category, COALESCE(admin_notes, model),
        qty, unit_price, discount_percent,
        ROUND(unit_price * (1 - discount_percent / 100) * qty, 2), sort_order
      FROM quote_line_items WHERE quote_id = NEW.id ORDER BY sort_order;

      UPDATE billing_note_items bni
      SET description = COALESCE(pc.name_th, bni.description)
      FROM product_catalog pc
      WHERE bni.billing_note_id = _billing_id AND bni.product_id = pc.id AND bni.description = bni.model;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_billing_note AFTER UPDATE ON public.quote_requests
FOR EACH ROW EXECUTE FUNCTION public.auto_create_billing_note();

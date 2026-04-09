
-- ═══ 1. INVOICES (ใบวางบิล/ใบแจ้งหนี้) ═══
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  quote_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.sales_orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  customer_address TEXT,
  customer_tax_id TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  withholding_tax NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  payment_terms TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_to UUID,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ 2. INVOICE LINE ITEMS ═══
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.product_catalog(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  category TEXT,
  description TEXT,
  qty INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  line_total NUMERIC(12,2) DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══ 3. TAX INVOICES (ใบกำกับภาษี) ═══
CREATE TABLE public.tax_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_invoice_number TEXT UNIQUE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.sales_orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  customer_address TEXT,
  customer_tax_id TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal NUMERIC(12,2) DEFAULT 0,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ 4. RECEIPTS (ใบเสร็จรับเงิน) ═══
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT UNIQUE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.sales_orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'transfer',
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ 5. AUTO-NUMBER TRIGGERS ═══
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM invoices WHERE created_at >= date_trunc('year', now());
  NEW.invoice_number := 'INV-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_invoice_number BEFORE INSERT ON public.invoices
FOR EACH ROW WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
EXECUTE FUNCTION public.generate_invoice_number();

CREATE OR REPLACE FUNCTION public.generate_tax_invoice_number()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM tax_invoices WHERE created_at >= date_trunc('year', now());
  NEW.tax_invoice_number := 'TIV-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_tax_invoice_number BEFORE INSERT ON public.tax_invoices
FOR EACH ROW WHEN (NEW.tax_invoice_number IS NULL OR NEW.tax_invoice_number = '')
EXECUTE FUNCTION public.generate_tax_invoice_number();

CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM receipts WHERE created_at >= date_trunc('year', now());
  NEW.receipt_number := 'RCP-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_receipt_number BEFORE INSERT ON public.receipts
FOR EACH ROW WHEN (NEW.receipt_number IS NULL OR NEW.receipt_number = '')
EXECUTE FUNCTION public.generate_receipt_number();

-- ═══ 6. RLS ═══
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Admins can manage all
CREATE POLICY "Admins manage invoices" ON public.invoices FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins manage invoice_items" ON public.invoice_items FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins manage tax_invoices" ON public.tax_invoices FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins manage receipts" ON public.receipts FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Users can view own documents
CREATE POLICY "Users view own invoices" ON public.invoices FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users view own invoice items" ON public.invoice_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_items.invoice_id AND (i.user_id = auth.uid() OR is_admin(auth.uid()))));
CREATE POLICY "Users view own tax_invoices" ON public.tax_invoices FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM invoices i WHERE i.id = tax_invoices.invoice_id AND (i.user_id = auth.uid() OR is_admin(auth.uid()))));
CREATE POLICY "Users view own receipts" ON public.receipts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM invoices i WHERE i.id = receipts.invoice_id AND (i.user_id = auth.uid() OR is_admin(auth.uid()))));

-- =====================================================
-- BILLING SYSTEM — Phase 1 Foundation
-- 6 tables: invoices, invoice_items, tax_invoices, 
--           tax_invoice_items, payment_records, receipts
-- =====================================================

-- ==================================================
-- 1. INVOICES (ใบวางบิล / ใบแจ้งหนี้)
-- ==================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  
  sale_order_id UUID REFERENCES public.sale_orders(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  
  customer_id UUID,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  customer_address TEXT,
  customer_tax_id TEXT,
  customer_branch_type TEXT,
  customer_branch_code TEXT,
  customer_branch_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  payment_terms TEXT DEFAULT '30 วัน',
  
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  vat_percent NUMERIC(5,2) DEFAULT 7,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  withholding_tax_percent NUMERIC(5,2) DEFAULT 0,
  withholding_tax_amount NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  invoice_type TEXT NOT NULL DEFAULT 'full' 
    CHECK (invoice_type IN ('full','downpayment','installment','final')),
  
  parent_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  installment_number INT,
  installment_total INT,
  downpayment_percent NUMERIC(5,2),
  
  status TEXT NOT NULL DEFAULT 'draft' 
    CHECK (status IN ('draft','sent','partially_paid','paid','overdue','cancelled')),
  
  notes TEXT,
  internal_notes TEXT,
  project_name TEXT,
  po_number TEXT,
  
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_invoices_sale_order ON public.invoices(sale_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_quote ON public.invoices(quote_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_parent ON public.invoices(parent_invoice_id);

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  next_num INT;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM 'INV-' || year_suffix || '-(\d+)') AS INT)
  ), 0) + 1
  INTO next_num
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || year_suffix || '-%';
  RETURN 'INV-' || year_suffix || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_set_invoice_number ON public.invoices;
CREATE TRIGGER trg_set_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();

DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.invoices;
CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================================================
-- 2. INVOICE ITEMS
-- ==================================================
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  
  product_id UUID,
  product_name TEXT NOT NULL,
  product_description TEXT,
  sku TEXT,
  
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'ชิ้น',
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  line_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON public.invoice_items(invoice_id);

-- ==================================================
-- 3. TAX INVOICES (ใบกำกับภาษี + ใบส่งสินค้า)
-- ==================================================
CREATE TABLE IF NOT EXISTS public.tax_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_invoice_number TEXT NOT NULL UNIQUE,
  
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
  sale_order_id UUID REFERENCES public.sale_orders(id) ON DELETE SET NULL,
  
  customer_id UUID,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  customer_address TEXT,
  customer_tax_id TEXT,
  customer_branch_type TEXT,
  customer_branch_code TEXT,
  customer_branch_name TEXT,
  
  tax_invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  withholding_tax_amount NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending','paid','partially_paid','cancelled')),
  
  delivery_address TEXT,
  delivery_date DATE,
  delivery_method TEXT,
  tracking_number TEXT,
  
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tax_invoices_invoice ON public.tax_invoices(invoice_id);
CREATE INDEX IF NOT EXISTS idx_tax_invoices_status ON public.tax_invoices(status);
CREATE INDEX IF NOT EXISTS idx_tax_invoices_customer ON public.tax_invoices(customer_id);

CREATE OR REPLACE FUNCTION public.generate_tax_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  next_num INT;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(tax_invoice_number FROM 'TXI-' || year_suffix || '-(\d+)') AS INT)
  ), 0) + 1
  INTO next_num
  FROM public.tax_invoices
  WHERE tax_invoice_number LIKE 'TXI-' || year_suffix || '-%';
  RETURN 'TXI-' || year_suffix || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.set_tax_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tax_invoice_number IS NULL OR NEW.tax_invoice_number = '' THEN
    NEW.tax_invoice_number := public.generate_tax_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_set_tax_invoice_number ON public.tax_invoices;
CREATE TRIGGER trg_set_tax_invoice_number
  BEFORE INSERT ON public.tax_invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_tax_invoice_number();

DROP TRIGGER IF EXISTS trg_tax_invoices_updated_at ON public.tax_invoices;
CREATE TRIGGER trg_tax_invoices_updated_at
  BEFORE UPDATE ON public.tax_invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================================================
-- 4. TAX INVOICE ITEMS
-- ==================================================
CREATE TABLE IF NOT EXISTS public.tax_invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_invoice_id UUID NOT NULL REFERENCES public.tax_invoices(id) ON DELETE CASCADE,
  
  product_id UUID,
  product_name TEXT NOT NULL,
  product_description TEXT,
  sku TEXT,
  
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'ชิ้น',
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tax_invoice_items_tax_invoice ON public.tax_invoice_items(tax_invoice_id);

-- ==================================================
-- 5. PAYMENT RECORDS (หลักฐานการชำระ + verification)
-- ==================================================
CREATE TABLE IF NOT EXISTS public.payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  tax_invoice_id UUID REFERENCES public.tax_invoices(id) ON DELETE CASCADE,
  
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL 
    CHECK (payment_method IN ('bank_transfer','cash','cheque','credit_card','other')),
  amount NUMERIC(12,2) NOT NULL,
  
  bank_name TEXT,
  bank_account TEXT,
  reference_number TEXT,
  
  proof_url TEXT,
  proof_uploaded_at TIMESTAMPTZ,
  
  verification_status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (verification_status IN ('pending','verified','rejected')),
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_invoice ON public.payment_records(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_tax_invoice ON public.payment_records(tax_invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payment_records(verification_status);

DROP TRIGGER IF EXISTS trg_payments_updated_at ON public.payment_records;
CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON public.payment_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================================================
-- 6. RECEIPTS (ใบเสร็จรับเงิน)
-- ==================================================
CREATE TABLE IF NOT EXISTS public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT NOT NULL UNIQUE,
  
  payment_record_id UUID NOT NULL REFERENCES public.payment_records(id) ON DELETE RESTRICT,
  tax_invoice_id UUID REFERENCES public.tax_invoices(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  
  customer_id UUID,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  customer_address TEXT,
  customer_tax_id TEXT,
  
  receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT,
  
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_receipts_payment ON public.receipts(payment_record_id);
CREATE INDEX IF NOT EXISTS idx_receipts_customer ON public.receipts(customer_id);
CREATE INDEX IF NOT EXISTS idx_receipts_tax_invoice ON public.receipts(tax_invoice_id);

CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  next_num INT;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(receipt_number FROM 'RCP-' || year_suffix || '-(\d+)') AS INT)
  ), 0) + 1
  INTO next_num
  FROM public.receipts
  WHERE receipt_number LIKE 'RCP-' || year_suffix || '-%';
  RETURN 'RCP-' || year_suffix || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.set_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.receipt_number IS NULL OR NEW.receipt_number = '' THEN
    NEW.receipt_number := public.generate_receipt_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_set_receipt_number ON public.receipts;
CREATE TRIGGER trg_set_receipt_number
  BEFORE INSERT ON public.receipts
  FOR EACH ROW EXECUTE FUNCTION public.set_receipt_number();

DROP TRIGGER IF EXISTS trg_receipts_updated_at ON public.receipts;
CREATE TRIGGER trg_receipts_updated_at
  BEFORE UPDATE ON public.receipts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================================================
-- ROW LEVEL SECURITY
-- ==================================================
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Admin/sales: full access
DROP POLICY IF EXISTS "billing_invoices_admin_all" ON public.invoices;
CREATE POLICY "billing_invoices_admin_all" ON public.invoices FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')));

DROP POLICY IF EXISTS "billing_invoice_items_admin_all" ON public.invoice_items;
CREATE POLICY "billing_invoice_items_admin_all" ON public.invoice_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')));

DROP POLICY IF EXISTS "billing_tax_invoices_admin_all" ON public.tax_invoices;
CREATE POLICY "billing_tax_invoices_admin_all" ON public.tax_invoices FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')));

DROP POLICY IF EXISTS "billing_tax_invoice_items_admin_all" ON public.tax_invoice_items;
CREATE POLICY "billing_tax_invoice_items_admin_all" ON public.tax_invoice_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')));

DROP POLICY IF EXISTS "billing_payments_admin_all" ON public.payment_records;
CREATE POLICY "billing_payments_admin_all" ON public.payment_records FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')));

DROP POLICY IF EXISTS "billing_receipts_admin_all" ON public.receipts;
CREATE POLICY "billing_receipts_admin_all" ON public.receipts FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','sales')));

-- Customer: read-only of their own
DROP POLICY IF EXISTS "billing_invoices_customer_read" ON public.invoices;
CREATE POLICY "billing_invoices_customer_read" ON public.invoices FOR SELECT
  USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "billing_tax_invoices_customer_read" ON public.tax_invoices;
CREATE POLICY "billing_tax_invoices_customer_read" ON public.tax_invoices FOR SELECT
  USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "billing_receipts_customer_read" ON public.receipts;
CREATE POLICY "billing_receipts_customer_read" ON public.receipts FOR SELECT
  USING (customer_id = auth.uid());

-- ==================================================
-- COMMENTS
-- ==================================================
COMMENT ON TABLE public.invoices IS 'Customer invoices (ใบวางบิล/ใบแจ้งหนี้) — supports full/downpayment/installment';
COMMENT ON TABLE public.invoice_items IS 'Line items for invoices';
COMMENT ON TABLE public.tax_invoices IS 'Tax invoices + delivery notes (ใบกำกับภาษี/ใบส่งสินค้า)';
COMMENT ON TABLE public.tax_invoice_items IS 'Line items for tax invoices';
COMMENT ON TABLE public.payment_records IS 'Payment proofs with verification workflow';
COMMENT ON TABLE public.receipts IS 'Final receipts after payment verified';

-- =============================================
-- Phase 10: Supplier Management + International Transfer
-- =============================================

-- Table 1: suppliers
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_code TEXT UNIQUE,
  
  -- Company info
  company_name TEXT NOT NULL,
  company_name_en TEXT,
  business_type TEXT,
  registration_number TEXT,
  year_established INT,
  country TEXT DEFAULT 'China',
  
  -- Contact
  contact_name TEXT,
  contact_position TEXT,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  fax TEXT,
  website TEXT,
  line_id TEXT,
  wechat_id TEXT,
  
  -- Address
  address TEXT,
  city TEXT,
  state_province TEXT,
  postal_code TEXT,
  
  -- Bank details (for wire transfer)
  bank_name TEXT,
  bank_address TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  swift_code TEXT,
  iban TEXT,
  bank_country TEXT,
  intermediary_bank TEXT,
  intermediary_swift TEXT,
  
  -- Products & quality
  main_products TEXT[],
  certifications TEXT[],
  quality_rating NUMERIC(3,1) CHECK (quality_rating BETWEEN 0 AND 5),
  is_preferred BOOLEAN DEFAULT false,
  
  -- Terms
  payment_terms TEXT,
  lead_time_days INT,
  minimum_order_amount NUMERIC(12,2),
  currency TEXT DEFAULT 'USD',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'suspended')),
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  rejection_reason TEXT,
  
  -- Notes
  notes TEXT,
  tags TEXT[],
  
  -- Meta
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Table 2: supplier_documents
CREATE TABLE public.supplier_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  
  document_type TEXT NOT NULL
    CHECK (document_type IN (
      'proforma_invoice', 'commercial_invoice', 'air_waybill',
      'packing_list', 'certificate', 'contract', 'other'
    )),
  document_number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size INT,
  
  transfer_request_id UUID,
  purchase_order_id UUID,
  
  amount NUMERIC(12,2),
  currency TEXT DEFAULT 'USD',
  issue_date DATE,
  
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 3: purchase_orders
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE NOT NULL DEFAULT '',
  
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  subtotal NUMERIC(12,2) DEFAULT 0,
  shipping_cost NUMERIC(12,2) DEFAULT 0,
  other_cost NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  
  order_date DATE DEFAULT CURRENT_DATE,
  expected_delivery DATE,
  
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'confirmed', 'shipped', 'received', 'cancelled')),
  
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Table 4: international_transfer_requests
CREATE TABLE public.international_transfer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_number TEXT UNIQUE NOT NULL DEFAULT '',
  
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  supplier_name TEXT NOT NULL,
  
  bank_name TEXT NOT NULL,
  bank_address TEXT,
  bank_account_number TEXT NOT NULL,
  bank_account_name TEXT,
  swift_code TEXT NOT NULL,
  iban TEXT,
  intermediary_bank TEXT,
  intermediary_swift TEXT,
  
  amount NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  exchange_rate NUMERIC(10,4),
  amount_thb NUMERIC(14,2),
  
  purchase_order_ids UUID[],
  invoice_reference TEXT,
  
  purpose TEXT NOT NULL,
  due_date DATE,
  requested_transfer_date DATE,
  priority TEXT DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  transfer_fee NUMERIC(10,2) DEFAULT 0,
  bank_fee NUMERIC(10,2) DEFAULT 0,
  other_fee NUMERIC(10,2) DEFAULT 0,
  total_fee NUMERIC(10,2) DEFAULT 0,
  total_cost_thb NUMERIC(14,2) DEFAULT 0,
  
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending', 'approved', 'transferred', 'rejected', 'cancelled')),
  
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  transferred_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  transfer_slip_url TEXT,
  
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Add FK from supplier_documents to transfer_requests
ALTER TABLE public.supplier_documents
  ADD CONSTRAINT fk_supplier_documents_transfer
  FOREIGN KEY (transfer_request_id)
  REFERENCES public.international_transfer_requests(id)
  ON DELETE SET NULL;

-- Add FK from supplier_documents to purchase_orders
ALTER TABLE public.supplier_documents
  ADD CONSTRAINT fk_supplier_documents_po
  FOREIGN KEY (purchase_order_id)
  REFERENCES public.purchase_orders(id)
  ON DELETE SET NULL;

-- =============================================
-- View: supplier_payment_summary
-- =============================================
CREATE VIEW public.supplier_payment_summary AS
SELECT 
  s.id as supplier_id,
  s.company_name,
  s.supplier_code,
  COUNT(t.id) as total_transfers,
  SUM(CASE WHEN t.status = 'transferred' THEN t.amount ELSE 0 END) as total_paid,
  SUM(CASE WHEN t.status = 'transferred' THEN t.amount_thb ELSE 0 END) as total_paid_thb,
  SUM(CASE WHEN t.status = 'pending' THEN t.amount ELSE 0 END) as pending_amount,
  MAX(t.transferred_at) as last_payment_date
FROM public.suppliers s
LEFT JOIN public.international_transfer_requests t 
  ON t.supplier_id = s.id AND t.deleted_at IS NULL
GROUP BY s.id, s.company_name, s.supplier_code;

-- =============================================
-- Auto-numbering functions
-- =============================================

-- Supplier: SUP-YYYY-XXXX
CREATE OR REPLACE FUNCTION public.generate_supplier_code()
RETURNS TRIGGER AS $$
DECLARE 
  seq_num INTEGER;
  year_str TEXT;
BEGIN
  IF NEW.supplier_code IS NOT NULL AND NEW.supplier_code != '' THEN RETURN NEW; END IF;
  year_str := to_char(now(), 'YYYY');
  SELECT COUNT(*) + 1 INTO seq_num 
  FROM public.suppliers 
  WHERE created_at >= date_trunc('year', now());
  NEW.supplier_code := 'SUP-' || year_str || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_generate_supplier_code
BEFORE INSERT ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.generate_supplier_code();

-- PO: PO-YYYY-XXXX
CREATE OR REPLACE FUNCTION public.generate_po_number()
RETURNS TRIGGER AS $$
DECLARE 
  seq_num INTEGER;
  year_str TEXT;
BEGIN
  IF NEW.po_number IS NOT NULL AND NEW.po_number != '' THEN RETURN NEW; END IF;
  year_str := to_char(now(), 'YYYY');
  SELECT COUNT(*) + 1 INTO seq_num 
  FROM public.purchase_orders 
  WHERE created_at >= date_trunc('year', now());
  NEW.po_number := 'PO-' || year_str || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_generate_po_number
BEFORE INSERT ON public.purchase_orders
FOR EACH ROW EXECUTE FUNCTION public.generate_po_number();

-- Transfer: TRF-YYYY-XXXX
CREATE OR REPLACE FUNCTION public.generate_transfer_number()
RETURNS TRIGGER AS $$
DECLARE 
  seq_num INTEGER;
  year_str TEXT;
BEGIN
  IF NEW.transfer_number IS NOT NULL AND NEW.transfer_number != '' THEN RETURN NEW; END IF;
  year_str := to_char(now(), 'YYYY');
  SELECT COUNT(*) + 1 INTO seq_num 
  FROM public.international_transfer_requests 
  WHERE created_at >= date_trunc('year', now());
  NEW.transfer_number := 'TRF-' || year_str || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_generate_transfer_number
BEFORE INSERT ON public.international_transfer_requests
FOR EACH ROW EXECUTE FUNCTION public.generate_transfer_number();

-- =============================================
-- Updated_at triggers
-- =============================================
CREATE TRIGGER trg_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_purchase_orders_updated_at
BEFORE UPDATE ON public.purchase_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_transfers_updated_at
BEFORE UPDATE ON public.international_transfer_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_suppliers_status ON suppliers(status);
CREATE INDEX idx_suppliers_country ON suppliers(country);
CREATE INDEX idx_suppliers_preferred ON suppliers(is_preferred) WHERE is_preferred = true;
CREATE INDEX idx_suppliers_deleted ON suppliers(deleted_at) WHERE deleted_at IS NOT NULL;

CREATE INDEX idx_supplier_documents_supplier ON supplier_documents(supplier_id);
CREATE INDEX idx_supplier_documents_type ON supplier_documents(document_type);
CREATE INDEX idx_supplier_documents_transfer ON supplier_documents(transfer_request_id);

CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);

CREATE INDEX idx_transfers_supplier ON international_transfer_requests(supplier_id);
CREATE INDEX idx_transfers_status ON international_transfer_requests(status);
CREATE INDEX idx_transfers_date ON international_transfer_requests(requested_transfer_date);

-- =============================================
-- RLS Policies
-- =============================================

-- suppliers
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/accountant full access to suppliers"
ON public.suppliers FOR ALL
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant']))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant']));

CREATE POLICY "Sales read-only suppliers"
ON public.suppliers FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'sales'));

-- supplier_documents
ALTER TABLE public.supplier_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/accountant full access to supplier_documents"
ON public.supplier_documents FOR ALL
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant']))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant']));

CREATE POLICY "Sales read-only supplier_documents"
ON public.supplier_documents FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'sales'));

-- purchase_orders
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/accountant full access to purchase_orders"
ON public.purchase_orders FOR ALL
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant']))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant']));

CREATE POLICY "Sales read-only purchase_orders"
ON public.purchase_orders FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'sales'));

-- international_transfer_requests
ALTER TABLE public.international_transfer_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin/accountant full access to transfers"
ON public.international_transfer_requests FOR ALL
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant']))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant']));

-- =============================================
-- Storage bucket
-- =============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'supplier-documents', 
  'supplier-documents', 
  false,
  20971520,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Storage policies
CREATE POLICY "Staff can upload supplier documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'supplier-documents' 
  AND public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant'])
);

CREATE POLICY "Staff can view supplier documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'supplier-documents' 
  AND public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant', 'sales'])
);

CREATE POLICY "Staff can delete supplier documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'supplier-documents' 
  AND public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'accountant'])
);

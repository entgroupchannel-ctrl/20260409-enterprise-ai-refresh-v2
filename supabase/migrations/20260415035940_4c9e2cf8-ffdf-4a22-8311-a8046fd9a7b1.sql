
-- =====================================================
-- Phase 9.1 — Product Registration & Warranty Core
-- Uses trigger for warranty_end_date (GENERATED not immutable)
-- =====================================================

-- PART 1: Extend products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS warranty_months INT NOT NULL DEFAULT 12;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS warranty_type TEXT NOT NULL DEFAULT 'carry_in';

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_warranty_type_check;

ALTER TABLE public.products
  ADD CONSTRAINT products_warranty_type_check
  CHECK (warranty_type IN ('carry_in', 'on_site'));

-- PART 2: registered_products table
CREATE TABLE IF NOT EXISTS public.registered_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT UNIQUE NOT NULL DEFAULT '',
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  product_sku_snapshot TEXT,
  serial_number TEXT NOT NULL,
  customer_id UUID,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_company TEXT,
  purchase_date DATE,
  warranty_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  warranty_months INT NOT NULL DEFAULT 12 CHECK (warranty_months > 0),
  warranty_end_date DATE,
  warranty_type TEXT NOT NULL DEFAULT 'carry_in' 
    CHECK (warranty_type IN ('carry_in', 'on_site')),
  warranty_terms TEXT,
  source TEXT NOT NULL DEFAULT 'admin'
    CHECK (source IN ('delivery', 'admin', 'customer', 'import')),
  delivery_note_id UUID,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'pending_verification', 'void')),
  void_reason TEXT,
  voided_at TIMESTAMPTZ,
  voided_by UUID,
  admin_notes TEXT,
  customer_notes TEXT,
  registered_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_registered_products_serial_unique
  ON public.registered_products(serial_number)
  WHERE deleted_at IS NULL AND status != 'void';

CREATE INDEX IF NOT EXISTS idx_registered_products_customer 
  ON public.registered_products(customer_id);
CREATE INDEX IF NOT EXISTS idx_registered_products_email 
  ON public.registered_products(customer_email);
CREATE INDEX IF NOT EXISTS idx_registered_products_product 
  ON public.registered_products(product_id);
CREATE INDEX IF NOT EXISTS idx_registered_products_end_date 
  ON public.registered_products(warranty_end_date);
CREATE INDEX IF NOT EXISTS idx_registered_products_status 
  ON public.registered_products(status);
CREATE INDEX IF NOT EXISTS idx_registered_products_source 
  ON public.registered_products(source);
CREATE INDEX IF NOT EXISTS idx_registered_products_deleted 
  ON public.registered_products(deleted_at) WHERE deleted_at IS NOT NULL;

-- PART 3: Trigger to compute warranty_end_date
CREATE OR REPLACE FUNCTION public.compute_warranty_end_date()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.warranty_end_date := NEW.warranty_start_date + (NEW.warranty_months * INTERVAL '1 month');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_compute_warranty_end ON public.registered_products;
CREATE TRIGGER trg_compute_warranty_end
BEFORE INSERT OR UPDATE OF warranty_start_date, warranty_months ON public.registered_products
FOR EACH ROW EXECUTE FUNCTION public.compute_warranty_end_date();

-- PART 4: Auto-number generator
CREATE OR REPLACE FUNCTION public.generate_registration_number()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE 
  seq_num INTEGER;
  year_str TEXT;
BEGIN
  year_str := to_char(now(), 'YYYY');
  SELECT COUNT(*) + 1 INTO seq_num 
  FROM public.registered_products 
  WHERE created_at >= date_trunc('year', now());
  NEW.registration_number := 'REG-' || year_str || '-' || lpad(seq_num::text, 5, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_registration_number ON public.registered_products;
CREATE TRIGGER trg_registration_number 
BEFORE INSERT ON public.registered_products
FOR EACH ROW 
WHEN (NEW.registration_number IS NULL OR NEW.registration_number = '')
EXECUTE FUNCTION public.generate_registration_number();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.trg_registered_products_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_registered_products_updated_at ON public.registered_products;
CREATE TRIGGER trg_registered_products_updated_at
BEFORE UPDATE ON public.registered_products
FOR EACH ROW EXECUTE FUNCTION public.trg_registered_products_updated_at();

-- PART 5: Warranty check function
CREATE OR REPLACE FUNCTION public.check_warranty_status(
  p_serial_number TEXT,
  p_check_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_rp RECORD;
  v_days_remaining INT;
  v_status TEXT;
  v_chargeable BOOLEAN;
BEGIN
  SELECT * INTO v_rp 
  FROM public.registered_products
  WHERE serial_number = p_serial_number AND deleted_at IS NULL
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('registered', false, 'status', 'not_registered', 'chargeable', true);
  END IF;
  
  IF v_rp.status = 'void' THEN
    RETURN jsonb_build_object('registered', true, 'status', 'void', 'chargeable', true,
      'void_reason', v_rp.void_reason, 'serial_number', v_rp.serial_number,
      'product_name', v_rp.product_name_snapshot, 'customer_name', v_rp.customer_name);
  END IF;
  
  IF v_rp.status = 'pending_verification' THEN
    RETURN jsonb_build_object('registered', true, 'status', 'pending_verification', 'chargeable', true,
      'serial_number', v_rp.serial_number, 'product_name', v_rp.product_name_snapshot,
      'customer_name', v_rp.customer_name);
  END IF;
  
  v_days_remaining := v_rp.warranty_end_date - p_check_date;
  
  IF v_days_remaining < 0 THEN v_status := 'expired'; v_chargeable := true;
  ELSIF v_days_remaining <= 30 THEN v_status := 'expiring'; v_chargeable := false;
  ELSE v_status := 'active'; v_chargeable := false;
  END IF;
  
  RETURN jsonb_build_object(
    'registered', true, 'id', v_rp.id, 'registration_number', v_rp.registration_number,
    'status', v_status, 'chargeable', v_chargeable, 'serial_number', v_rp.serial_number,
    'product_name', v_rp.product_name_snapshot, 'product_sku', v_rp.product_sku_snapshot,
    'customer_id', v_rp.customer_id, 'customer_name', v_rp.customer_name,
    'customer_email', v_rp.customer_email, 'purchase_date', v_rp.purchase_date,
    'warranty_start', v_rp.warranty_start_date, 'warranty_end', v_rp.warranty_end_date,
    'warranty_months', v_rp.warranty_months, 'warranty_type', v_rp.warranty_type,
    'warranty_terms', v_rp.warranty_terms, 'days_remaining', v_days_remaining
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_warranty_status(TEXT, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_warranty_status(TEXT, DATE) TO anon;

-- PART 6: Void + Soft delete
CREATE OR REPLACE FUNCTION public.void_registered_product(p_id UUID, p_reason TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'Not authenticated'); END IF;
  SELECT role INTO v_user_role FROM public.users WHERE id = auth.uid();
  IF v_user_role != 'super_admin' THEN RETURN jsonb_build_object('success', false, 'error', 'Only super_admin can void'); END IF;
  IF p_reason IS NULL OR trim(p_reason) = '' THEN RETURN jsonb_build_object('success', false, 'error', 'Reason required'); END IF;
  UPDATE public.registered_products SET status = 'void', void_reason = p_reason, voided_at = now(), voided_by = auth.uid()
  WHERE id = p_id AND status != 'void' AND deleted_at IS NULL;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'Not found or already voided'); END IF;
  RETURN jsonb_build_object('success', true);
END;
$$;
GRANT EXECUTE ON FUNCTION public.void_registered_product(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.soft_delete_registered_product(p_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'Not authenticated'); END IF;
  SELECT role INTO v_user_role FROM public.users WHERE id = auth.uid();
  IF v_user_role NOT IN ('super_admin', 'admin') THEN RETURN jsonb_build_object('success', false, 'error', 'Only admin can delete'); END IF;
  UPDATE public.registered_products SET deleted_at = now() WHERE id = p_id AND deleted_at IS NULL;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'Not found or already deleted'); END IF;
  RETURN jsonb_build_object('success', true);
END;
$$;
GRANT EXECUTE ON FUNCTION public.soft_delete_registered_product(UUID) TO authenticated;

-- PART 7: RLS
ALTER TABLE public.registered_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "registered_products_admin_all" ON public.registered_products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'sales', 'accountant')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'sales', 'accountant')));

CREATE POLICY "registered_products_customer_read" ON public.registered_products FOR SELECT
  USING (deleted_at IS NULL AND (customer_id = auth.uid() OR customer_email = (SELECT email FROM public.users WHERE id = auth.uid())));

CREATE POLICY "registered_products_customer_insert" ON public.registered_products FOR INSERT
  WITH CHECK (customer_id = auth.uid() AND status = 'pending_verification' AND source = 'customer');

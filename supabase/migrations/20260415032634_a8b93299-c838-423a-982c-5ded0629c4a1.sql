
BEGIN;

-- ═══════════════════════════════════════════════════════════
-- PART 1: credit_notes table
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.credit_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_note_number TEXT NOT NULL UNIQUE,
  
  original_tax_invoice_id UUID NOT NULL 
    REFERENCES public.tax_invoices(id) ON DELETE RESTRICT,
  original_invoice_id UUID NOT NULL 
    REFERENCES public.invoices(id) ON DELETE RESTRICT,
  
  customer_id UUID,
  customer_name TEXT NOT NULL,
  customer_company TEXT,
  customer_address TEXT,
  customer_tax_id TEXT,
  customer_branch_type TEXT,
  customer_branch_code TEXT,
  customer_branch_name TEXT,
  
  credit_note_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  reason_code TEXT NOT NULL 
    CHECK (reason_code IN (
      'return',
      'damaged',
      'price_correction',
      'quantity_error',
      'additional_discount',
      'service_cancelled',
      'other'
    )),
  reason_detail TEXT NOT NULL,
  
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_type TEXT NOT NULL DEFAULT 'percent' 
    CHECK (discount_type IN ('percent','baht')),
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  vat_percent NUMERIC(5,2) DEFAULT 7,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  adjustment_target TEXT NOT NULL DEFAULT 'both'
    CHECK (adjustment_target IN ('payment','invoice','both')),
  
  status TEXT NOT NULL DEFAULT 'issued' 
    CHECK (status IN ('issued','voided')),
  
  voided_at TIMESTAMPTZ,
  voided_by UUID,
  void_reason TEXT,
  
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_notes_unique_active
  ON public.credit_notes(original_tax_invoice_id)
  WHERE status = 'issued' AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_credit_notes_invoice 
  ON public.credit_notes(original_invoice_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_customer 
  ON public.credit_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_status 
  ON public.credit_notes(status);
CREATE INDEX IF NOT EXISTS idx_credit_notes_date 
  ON public.credit_notes(credit_note_date DESC);
CREATE INDEX IF NOT EXISTS idx_credit_notes_deleted 
  ON public.credit_notes(deleted_at) WHERE deleted_at IS NOT NULL;

-- ═══════════════════════════════════════════════════════════
-- PART 2: credit_note_items table
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.credit_note_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_note_id UUID NOT NULL 
    REFERENCES public.credit_notes(id) ON DELETE CASCADE,
  
  original_item_id UUID,
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

CREATE INDEX IF NOT EXISTS idx_credit_note_items_cn 
  ON public.credit_note_items(credit_note_id);

-- ═══════════════════════════════════════════════════════════
-- PART 3: Auto-number generator
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.generate_credit_note_number()
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
  FROM public.credit_notes 
  WHERE created_at >= date_trunc('year', now());
  
  NEW.credit_note_number := 'CN-' || year_str || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_credit_note_number ON public.credit_notes;
CREATE TRIGGER trg_credit_note_number 
BEFORE INSERT ON public.credit_notes
FOR EACH ROW 
WHEN (NEW.credit_note_number IS NULL OR NEW.credit_note_number = '')
EXECUTE FUNCTION public.generate_credit_note_number();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.trg_credit_notes_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_credit_notes_updated_at ON public.credit_notes;
CREATE TRIGGER trg_credit_notes_updated_at
BEFORE UPDATE ON public.credit_notes
FOR EACH ROW EXECUTE FUNCTION public.trg_credit_notes_updated_at();

-- ═══════════════════════════════════════════════════════════
-- PART 4: Soft delete / restore functions
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.soft_delete_credit_note(
  p_credit_note_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  SELECT role INTO v_user_role FROM public.users WHERE id = v_user_id;
  
  IF v_user_role NOT IN ('super_admin', 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only admin can delete credit notes');
  END IF;
  
  UPDATE public.credit_notes
  SET deleted_at = now(),
      notes = COALESCE(notes || E'\n', '') || 'Deleted: ' || COALESCE(p_reason, 'No reason')
  WHERE id = p_credit_note_id AND deleted_at IS NULL;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Credit note not found or already deleted');
  END IF;
  
  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_credit_note(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.restore_credit_note(p_credit_note_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  SELECT role INTO v_user_role FROM public.users WHERE id = v_user_id;
  
  IF v_user_role NOT IN ('super_admin', 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only admin can restore');
  END IF;
  
  UPDATE public.credit_notes
  SET deleted_at = NULL
  WHERE id = p_credit_note_id AND deleted_at IS NOT NULL;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Credit note not found');
  END IF;
  
  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.restore_credit_note(UUID) TO authenticated;

-- ═══════════════════════════════════════════════════════════
-- PART 5: RLS Policies
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_note_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "credit_notes_admin_all" ON public.credit_notes;
CREATE POLICY "credit_notes_admin_all" ON public.credit_notes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'sales')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'sales')
  ));

DROP POLICY IF EXISTS "credit_note_items_admin_all" ON public.credit_note_items;
CREATE POLICY "credit_note_items_admin_all" ON public.credit_note_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'sales')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'sales')
  ));

DROP POLICY IF EXISTS "credit_notes_customer_read" ON public.credit_notes;
CREATE POLICY "credit_notes_customer_read" ON public.credit_notes FOR SELECT
  USING (customer_id = auth.uid() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "credit_note_items_customer_read" ON public.credit_note_items;
CREATE POLICY "credit_note_items_customer_read" ON public.credit_note_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.credit_notes cn
    WHERE cn.id = credit_note_items.credit_note_id
    AND cn.customer_id = auth.uid()
    AND cn.deleted_at IS NULL
  ));

COMMIT;

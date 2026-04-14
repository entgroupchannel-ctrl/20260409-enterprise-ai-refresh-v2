-- Phase 8.1 — Invoice/Payment/Tax/Receipt Logic Redesign
-- Business rule: 1 invoice = 1 tax invoice = 1 receipt
-- Payment records = proofs (many slips, one payment total)

-- PART 1: Make receipts.payment_record_id nullable
ALTER TABLE public.receipts
  ALTER COLUMN payment_record_id DROP NOT NULL;

COMMENT ON COLUMN public.receipts.payment_record_id IS 
  'Phase 8.1: Nullable. Primary link is via tax_invoice_id. Legacy field for single-payment receipts.';

-- PART 2: Unique constraints
DROP INDEX IF EXISTS idx_unique_tax_invoice_per_invoice;
CREATE UNIQUE INDEX idx_unique_tax_invoice_per_invoice
  ON public.tax_invoices(invoice_id) 
  WHERE deleted_at IS NULL AND invoice_id IS NOT NULL;

DROP INDEX IF EXISTS idx_unique_receipt_per_tax_invoice;
CREATE UNIQUE INDEX idx_unique_receipt_per_tax_invoice
  ON public.receipts(tax_invoice_id) 
  WHERE deleted_at IS NULL AND tax_invoice_id IS NOT NULL;

-- PART 3: Helper function — sum verified payments
CREATE OR REPLACE FUNCTION public.sum_verified_payments(p_invoice_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM public.payment_records
  WHERE invoice_id = p_invoice_id
    AND verification_status = 'verified';
$$;

GRANT EXECUTE ON FUNCTION public.sum_verified_payments(UUID) TO authenticated;

COMMENT ON FUNCTION public.sum_verified_payments IS
  'Phase 8.1: Returns sum of verified payments for an invoice';

-- PART 4: Helper function — sum pending payments
CREATE OR REPLACE FUNCTION public.sum_pending_payments(p_invoice_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM public.payment_records
  WHERE invoice_id = p_invoice_id
    AND verification_status = 'pending';
$$;

GRANT EXECUTE ON FUNCTION public.sum_pending_payments(UUID) TO authenticated;

-- PART 5: Verify existing data
DO $$
DECLARE
  v_dup_tax_invoices INT;
  v_dup_receipts INT;
BEGIN
  SELECT COUNT(*) INTO v_dup_tax_invoices
  FROM (
    SELECT invoice_id, COUNT(*) cnt
    FROM public.tax_invoices
    WHERE deleted_at IS NULL AND invoice_id IS NOT NULL
    GROUP BY invoice_id
    HAVING COUNT(*) > 1
  ) dup;
  
  SELECT COUNT(*) INTO v_dup_receipts
  FROM (
    SELECT tax_invoice_id, COUNT(*) cnt
    FROM public.receipts
    WHERE deleted_at IS NULL AND tax_invoice_id IS NOT NULL
    GROUP BY tax_invoice_id
    HAVING COUNT(*) > 1
  ) dup;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Phase 8.1 Invoice/Payment Redesign';
  RAISE NOTICE '========================================';
  RAISE NOTICE '  receipts.payment_record_id: now nullable';
  RAISE NOTICE '  Unique index: 1 tax invoice per invoice';
  RAISE NOTICE '  Unique index: 1 receipt per tax invoice';
  RAISE NOTICE '  Helper: sum_verified_payments()';
  RAISE NOTICE '  Helper: sum_pending_payments()';
  RAISE NOTICE '========================================';
  
  IF v_dup_tax_invoices > 0 THEN
    RAISE WARNING 'Found % invoices with duplicate tax invoices', v_dup_tax_invoices;
  END IF;
  
  IF v_dup_receipts > 0 THEN
    RAISE WARNING 'Found % tax invoices with duplicate receipts', v_dup_receipts;
  END IF;
END $$;
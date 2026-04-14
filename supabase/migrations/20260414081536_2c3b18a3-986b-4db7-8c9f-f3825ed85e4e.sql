BEGIN;

-- Phase 1: Add column (nullable for backward compatibility)
ALTER TABLE public.tax_invoices
  ADD COLUMN IF NOT EXISTS payment_record_id UUID 
    REFERENCES public.payment_records(id) ON DELETE RESTRICT;

-- Phase 2: Create UNIQUE constraint (allows multiple NULLs for legacy data)
-- This enforces 1:1 mapping for new tax invoices
DROP INDEX IF EXISTS idx_tax_invoices_payment_unique;
CREATE UNIQUE INDEX idx_tax_invoices_payment_unique
  ON public.tax_invoices(payment_record_id)
  WHERE payment_record_id IS NOT NULL AND deleted_at IS NULL;

-- Phase 3: Index for query performance
CREATE INDEX IF NOT EXISTS idx_tax_invoices_payment
  ON public.tax_invoices(payment_record_id)
  WHERE payment_record_id IS NOT NULL;

-- Phase 4: Add comment for documentation
COMMENT ON COLUMN public.tax_invoices.payment_record_id IS
  '1:1 link to verified payment_record. Enforces 1 payment = 1 tax invoice (Thai Revenue Code มาตรา 78). NULL = legacy data before Phase 5.0';

-- Verify
DO $$
DECLARE
  v_col_exists BOOLEAN;
  v_index_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'tax_invoices' 
      AND column_name = 'payment_record_id'
  ) INTO v_col_exists;
  
  SELECT EXISTS(
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'tax_invoices'
      AND indexname = 'idx_tax_invoices_payment_unique'
  ) INTO v_index_exists;
  
  IF NOT v_col_exists THEN
    RAISE EXCEPTION 'Failed: payment_record_id column not created';
  END IF;
  
  IF NOT v_index_exists THEN
    RAISE EXCEPTION 'Failed: unique index not created';
  END IF;
  
  RAISE NOTICE 'Phase 5.0 migration successful: column + unique index created';
END $$;

COMMIT;
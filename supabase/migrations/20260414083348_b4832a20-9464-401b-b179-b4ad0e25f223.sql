BEGIN;

-- =====================================================
-- PART 0: Clean up legacy duplicates
-- Keep newest active invoice per quote, soft-delete others
-- =====================================================
WITH ranked AS (
  SELECT id, quote_id,
    ROW_NUMBER() OVER (PARTITION BY quote_id ORDER BY created_at DESC) AS rn
  FROM invoices
  WHERE quote_id IS NOT NULL AND deleted_at IS NULL
)
UPDATE invoices
SET deleted_at = NOW(),
    delete_reason = 'Auto-cleaned: legacy duplicate invoice per quote (Phase 5.0)'
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- =====================================================
-- PART 1: Quote → Invoice (1:1)
-- =====================================================

ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS has_invoice BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS invoice_created_at TIMESTAMPTZ;

DROP INDEX IF EXISTS idx_invoices_quote_unique;
CREATE UNIQUE INDEX idx_invoices_quote_unique
  ON public.invoices(quote_id)
  WHERE quote_id IS NOT NULL AND deleted_at IS NULL;

CREATE OR REPLACE FUNCTION public.sync_quote_has_invoice()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.quote_id IS NOT NULL AND NEW.deleted_at IS NULL THEN
    UPDATE quote_requests
    SET has_invoice = TRUE,
        invoice_created_at = COALESCE(invoice_created_at, NEW.created_at)
    WHERE id = NEW.quote_id;
  END IF;
  
  IF TG_OP = 'UPDATE' AND OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL AND NEW.quote_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM invoices 
      WHERE quote_id = NEW.quote_id 
        AND deleted_at IS NULL 
        AND id != NEW.id
    ) THEN
      UPDATE quote_requests
      SET has_invoice = FALSE,
          invoice_created_at = NULL
      WHERE id = NEW.quote_id;
    END IF;
  END IF;
  
  IF TG_OP = 'UPDATE' AND OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL AND NEW.quote_id IS NOT NULL THEN
    UPDATE quote_requests
    SET has_invoice = TRUE,
        invoice_created_at = COALESCE(invoice_created_at, NEW.created_at)
    WHERE id = NEW.quote_id;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_quote_has_invoice ON public.invoices;
CREATE TRIGGER trg_sync_quote_has_invoice
AFTER INSERT OR UPDATE OF deleted_at ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.sync_quote_has_invoice();

UPDATE quote_requests q
SET has_invoice = TRUE,
    invoice_created_at = (
      SELECT MIN(i.created_at) 
      FROM invoices i 
      WHERE i.quote_id = q.id AND i.deleted_at IS NULL
    )
WHERE EXISTS (
  SELECT 1 FROM invoices i 
  WHERE i.quote_id = q.id AND i.deleted_at IS NULL
);

-- =====================================================
-- PART 2: Tax Invoice → Payment (1:1) — idempotent
-- =====================================================

ALTER TABLE public.tax_invoices
  ADD COLUMN IF NOT EXISTS payment_record_id UUID 
    REFERENCES public.payment_records(id) ON DELETE RESTRICT;

DROP INDEX IF EXISTS idx_tax_invoices_payment_unique;
CREATE UNIQUE INDEX idx_tax_invoices_payment_unique
  ON public.tax_invoices(payment_record_id)
  WHERE payment_record_id IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tax_invoices_payment
  ON public.tax_invoices(payment_record_id)
  WHERE payment_record_id IS NOT NULL;

-- =====================================================
-- PART 3: Verify
-- =====================================================
DO $$
DECLARE
  v_ok BOOLEAN;
  v_backfill INT;
  v_cleaned INT;
BEGIN
  SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_requests' AND column_name='has_invoice') INTO v_ok;
  IF NOT v_ok THEN RAISE EXCEPTION 'Failed: has_invoice not created'; END IF;
  
  SELECT EXISTS(SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='invoices' AND indexname='idx_invoices_quote_unique') INTO v_ok;
  IF NOT v_ok THEN RAISE EXCEPTION 'Failed: idx_invoices_quote_unique not created'; END IF;

  SELECT EXISTS(SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='tax_invoices' AND indexname='idx_tax_invoices_payment_unique') INTO v_ok;
  IF NOT v_ok THEN RAISE EXCEPTION 'Failed: idx_tax_invoices_payment_unique not created'; END IF;

  SELECT COUNT(*) INTO v_backfill FROM quote_requests WHERE has_invoice = TRUE;
  SELECT COUNT(*) INTO v_cleaned FROM invoices WHERE delete_reason LIKE '%Phase 5.0%';
  
  RAISE NOTICE 'Phase 5.0 OK: % quotes backfilled, % duplicate invoices cleaned', v_backfill, v_cleaned;
END $$;

COMMIT;
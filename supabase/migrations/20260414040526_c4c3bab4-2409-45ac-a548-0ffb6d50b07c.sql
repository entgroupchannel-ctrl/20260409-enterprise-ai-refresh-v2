CREATE OR REPLACE FUNCTION public.sync_invoice_status_from_payments()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_invoice_id UUID;
  v_grand_total NUMERIC;
  v_verified_total NUMERIC;
  v_current_status TEXT;
  v_new_status TEXT;
  v_due_date DATE;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_invoice_id := OLD.invoice_id;
  ELSE
    v_invoice_id := NEW.invoice_id;
  END IF;

  IF v_invoice_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  SELECT grand_total, status, due_date
    INTO v_grand_total, v_current_status, v_due_date
  FROM public.invoices
  WHERE id = v_invoice_id AND deleted_at IS NULL;

  IF v_grand_total IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  IF v_current_status IN ('cancelled', 'draft') THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  SELECT COALESCE(SUM(amount), 0)
    INTO v_verified_total
  FROM public.payment_records
  WHERE invoice_id = v_invoice_id
    AND verification_status = 'verified';

  IF v_verified_total >= v_grand_total THEN
    v_new_status := 'paid';
  ELSIF v_verified_total > 0 THEN
    v_new_status := 'partially_paid';
  ELSIF v_due_date IS NOT NULL AND v_due_date < CURRENT_DATE THEN
    v_new_status := 'overdue';
  ELSE
    v_new_status := 'sent';
  END IF;

  IF v_new_status != v_current_status THEN
    UPDATE public.invoices
    SET status = v_new_status
    WHERE id = v_invoice_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

COMMENT ON FUNCTION public.sync_invoice_status_from_payments IS
'Recalculates invoice.status based on sum of verified payment_records amounts. Called by trigger.';

DROP TRIGGER IF EXISTS trg_sync_invoice_status_from_payments ON public.payment_records;

CREATE TRIGGER trg_sync_invoice_status_from_payments
AFTER INSERT OR UPDATE OF verification_status, amount OR DELETE
ON public.payment_records
FOR EACH ROW
EXECUTE FUNCTION public.sync_invoice_status_from_payments();

-- One-time backfill
DO $$
DECLARE
  inv RECORD;
  v_verified_total NUMERIC;
  v_new_status TEXT;
BEGIN
  FOR inv IN
    SELECT id, grand_total, status, due_date
    FROM public.invoices
    WHERE deleted_at IS NULL
      AND status NOT IN ('cancelled', 'draft', 'paid')
  LOOP
    SELECT COALESCE(SUM(amount), 0)
      INTO v_verified_total
    FROM public.payment_records
    WHERE invoice_id = inv.id
      AND verification_status = 'verified';

    IF v_verified_total >= inv.grand_total THEN
      v_new_status := 'paid';
    ELSIF v_verified_total > 0 THEN
      v_new_status := 'partially_paid';
    ELSIF inv.due_date IS NOT NULL AND inv.due_date < CURRENT_DATE THEN
      v_new_status := 'overdue';
    ELSE
      v_new_status := 'sent';
    END IF;

    IF v_new_status != inv.status THEN
      UPDATE public.invoices SET status = v_new_status WHERE id = inv.id;
    END IF;
  END LOOP;

  RAISE NOTICE 'Payment status sync backfill complete';
END $$;
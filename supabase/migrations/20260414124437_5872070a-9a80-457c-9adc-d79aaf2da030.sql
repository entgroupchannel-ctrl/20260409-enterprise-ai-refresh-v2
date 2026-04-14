-- Phase 5.2.5 — Security Hardening
-- 1. Drop legacy RLS policies that use user_id
-- 2. Verify new billing_* policies still in place

DROP POLICY IF EXISTS "Users view own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users view own invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users view own tax_invoices" ON public.tax_invoices;
DROP POLICY IF EXISTS "Users view own receipts" ON public.receipts;

DO $$
DECLARE
  v_missing TEXT[] := '{}';
BEGIN
  IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='invoices' AND policyname='billing_invoices_customer_read') THEN
    v_missing := array_append(v_missing, 'billing_invoices_customer_read');
  END IF;
  IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='invoice_items' AND policyname='billing_invoice_items_customer_read') THEN
    v_missing := array_append(v_missing, 'billing_invoice_items_customer_read');
  END IF;
  IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tax_invoices' AND policyname='billing_tax_invoices_customer_read') THEN
    v_missing := array_append(v_missing, 'billing_tax_invoices_customer_read');
  END IF;
  IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tax_invoice_items' AND policyname='billing_tax_invoice_items_customer_read') THEN
    v_missing := array_append(v_missing, 'billing_tax_invoice_items_customer_read');
  END IF;
  IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='receipts' AND policyname='billing_receipts_customer_read') THEN
    v_missing := array_append(v_missing, 'billing_receipts_customer_read');
  END IF;

  IF array_length(v_missing, 1) > 0 THEN
    RAISE EXCEPTION 'CRITICAL: Missing policies: %', array_to_string(v_missing, ', ');
  END IF;

  RAISE NOTICE '✅ Phase 5.2.5: 4 legacy policies dropped, 5 new policies verified';
END $$;
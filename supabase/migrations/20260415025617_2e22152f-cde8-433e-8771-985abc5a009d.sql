
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS discount_type TEXT NOT NULL DEFAULT 'percent';
ALTER TABLE public.quote_requests
  DROP CONSTRAINT IF EXISTS quote_requests_discount_type_check;
ALTER TABLE public.quote_requests
  ADD CONSTRAINT quote_requests_discount_type_check
  CHECK (discount_type IN ('percent', 'baht'));

ALTER TABLE public.quote_revisions
  ADD COLUMN IF NOT EXISTS discount_type TEXT NOT NULL DEFAULT 'percent';
ALTER TABLE public.quote_revisions
  DROP CONSTRAINT IF EXISTS quote_revisions_discount_type_check;
ALTER TABLE public.quote_revisions
  ADD CONSTRAINT quote_revisions_discount_type_check
  CHECK (discount_type IN ('percent', 'baht'));

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS discount_type TEXT NOT NULL DEFAULT 'percent';
ALTER TABLE public.invoices
  DROP CONSTRAINT IF EXISTS invoices_discount_type_check;
ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_discount_type_check
  CHECK (discount_type IN ('percent', 'baht'));

ALTER TABLE public.tax_invoices
  ADD COLUMN IF NOT EXISTS discount_type TEXT NOT NULL DEFAULT 'percent';
ALTER TABLE public.tax_invoices
  DROP CONSTRAINT IF EXISTS tax_invoices_discount_type_check;
ALTER TABLE public.tax_invoices
  ADD CONSTRAINT tax_invoices_discount_type_check
  CHECK (discount_type IN ('percent', 'baht'));

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables 
             WHERE table_schema = 'public' AND table_name = 'sale_orders') THEN
    EXECUTE 'ALTER TABLE public.sale_orders 
             ADD COLUMN IF NOT EXISTS discount_type TEXT NOT NULL DEFAULT ''percent''';
    EXECUTE 'ALTER TABLE public.sale_orders 
             DROP CONSTRAINT IF EXISTS sale_orders_discount_type_check';
    EXECUTE 'ALTER TABLE public.sale_orders 
             ADD CONSTRAINT sale_orders_discount_type_check
             CHECK (discount_type IN (''percent'', ''baht''))';
  END IF;
END $$;

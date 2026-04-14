ALTER TABLE public.tax_invoice_items
  ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) DEFAULT 0;

COMMENT ON COLUMN public.tax_invoice_items.discount_percent IS 'Percentage discount on this line item (0-100)';
COMMENT ON COLUMN public.tax_invoice_items.discount_amount IS 'Absolute discount amount on this line item';
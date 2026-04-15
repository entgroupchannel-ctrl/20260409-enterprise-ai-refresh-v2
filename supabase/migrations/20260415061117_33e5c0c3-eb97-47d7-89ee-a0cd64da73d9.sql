
ALTER TABLE public.purchase_orders
  ADD COLUMN IF NOT EXISTS pi_number TEXT,
  ADD COLUMN IF NOT EXISTS ci_number TEXT,
  ADD COLUMN IF NOT EXISTS price_terms TEXT,
  ADD COLUMN IF NOT EXISTS payment_terms TEXT,
  ADD COLUMN IF NOT EXISTS delivery_days TEXT,
  ADD COLUMN IF NOT EXISTS shipping_method TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS carrier TEXT,
  ADD COLUMN IF NOT EXISTS country_of_origin TEXT DEFAULT 'CHINA',
  ADD COLUMN IF NOT EXISTS loading_port TEXT,
  ADD COLUMN IF NOT EXISTS destination TEXT DEFAULT 'Thailand',
  ADD COLUMN IF NOT EXISTS handling_fee NUMERIC(12,2) DEFAULT 0;

ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS warranty_terms_free TEXT,
  ADD COLUMN IF NOT EXISTS warranty_terms_paid TEXT,
  ADD COLUMN IF NOT EXISTS default_price_terms TEXT,
  ADD COLUMN IF NOT EXISTS default_payment_terms TEXT,
  ADD COLUMN IF NOT EXISTS default_delivery_days TEXT,
  ADD COLUMN IF NOT EXISTS skype TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp TEXT;

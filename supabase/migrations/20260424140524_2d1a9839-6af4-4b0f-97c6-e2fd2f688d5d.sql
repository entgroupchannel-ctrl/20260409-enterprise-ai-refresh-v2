ALTER TABLE public.cart_items
ADD COLUMN IF NOT EXISTS configuration jsonb;

COMMENT ON COLUMN public.cart_items.configuration IS 'User-selected product configuration: screen, cpu, ram, ssd, wifi, os, warranty, etc.';
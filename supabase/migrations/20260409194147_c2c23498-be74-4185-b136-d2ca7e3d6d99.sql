-- Add unique constraint on products.sku for upsert support
ALTER TABLE public.products ADD CONSTRAINT products_sku_unique UNIQUE (sku);

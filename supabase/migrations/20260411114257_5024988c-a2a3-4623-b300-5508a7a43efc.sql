-- Phase 1: Consolidate duplicate products into parent + variants

-- Step 1: Add staging columns
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS migration_status TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS migration_keep BOOLEAN DEFAULT FALSE;

-- Step 2: Mark first product per model as "parent"
WITH ranked_products AS (
  SELECT 
    id,
    model,
    ROW_NUMBER() OVER (
      PARTITION BY model 
      ORDER BY 
        COALESCE(sort_order, 999),
        unit_price ASC,
        created_at ASC
    ) as rn
  FROM public.products
  WHERE is_active = true
)
UPDATE public.products p
SET 
  migration_keep = TRUE,
  migration_status = 'parent'
FROM ranked_products rp
WHERE p.id = rp.id AND rp.rn = 1;

-- Step 3: Mark non-keepers as 'variant'
UPDATE public.products
SET migration_status = 'variant'
WHERE migration_keep = FALSE 
  AND is_active = true 
  AND migration_status IS NULL;

-- Step 4: Insert variants into product_variants table
INSERT INTO public.product_variants (
  product_id, variant_name, sku, cpu, ram_gb, storage_gb, storage_type,
  has_wifi, has_4g, os, unit_price, unit_price_vat,
  stock_quantity, stock_status, is_active, is_default, created_at
)
SELECT 
  parent.id as product_id,
  TRIM(BOTH ' / ' FROM CONCAT_WS(' / ',
    NULLIF(child.cpu, ''),
    CASE WHEN child.ram_gb IS NOT NULL THEN child.ram_gb || 'GB' END,
    CASE WHEN child.storage_gb IS NOT NULL THEN child.storage_gb || 'GB ' || COALESCE(child.storage_type, '') END,
    CASE WHEN child.os IS NOT NULL THEN child.os END
  )) as variant_name,
  child.sku,
  child.cpu,
  child.ram_gb,
  child.storage_gb,
  child.storage_type,
  COALESCE(child.has_wifi, false),
  COALESCE(child.has_4g, false),
  child.os,
  child.unit_price,
  child.unit_price_vat,
  COALESCE(child.stock_quantity, 0),
  COALESCE(child.stock_status, 'available'),
  true,
  false,
  child.created_at
FROM public.products child
INNER JOIN public.products parent
  ON parent.model = child.model 
  AND parent.migration_status = 'parent'
WHERE child.migration_status = 'variant'
ON CONFLICT (sku) DO NOTHING;

-- Step 5: Insert "default variant" for each parent
INSERT INTO public.product_variants (
  product_id, variant_name, sku, cpu, ram_gb, storage_gb, storage_type,
  has_wifi, has_4g, os, unit_price, unit_price_vat,
  stock_quantity, stock_status, is_active, is_default, created_at
)
SELECT 
  id as product_id,
  TRIM(BOTH ' / ' FROM CONCAT_WS(' / ',
    NULLIF(cpu, ''),
    CASE WHEN ram_gb IS NOT NULL THEN ram_gb || 'GB' END,
    CASE WHEN storage_gb IS NOT NULL THEN storage_gb || 'GB ' || COALESCE(storage_type, '') END,
    CASE WHEN os IS NOT NULL THEN os END
  )) as variant_name,
  sku,
  cpu, ram_gb, storage_gb, storage_type,
  COALESCE(has_wifi, false), COALESCE(has_4g, false), os,
  unit_price, unit_price_vat,
  COALESCE(stock_quantity, 0),
  COALESCE(stock_status, 'available'),
  true,
  true,
  created_at
FROM public.products
WHERE migration_status = 'parent'
ON CONFLICT (sku) DO NOTHING;

-- Step 6: Clean parent names (remove spec strings)
UPDATE public.products
SET 
  name = REGEXP_REPLACE(name, '\s*[\-/]?\s*(i[357]|Celeron|Atom|Core).*$', '', 'i'),
  description = REGEXP_REPLACE(COALESCE(description, ''), '^CPU [^,\.]+[,\.]\s*', '', 'i')
WHERE migration_status = 'parent'
  AND name ~* '(i[357]|celeron|atom)';

-- Step 7: Soft-delete non-parent products
UPDATE public.products
SET 
  is_active = false,
  updated_at = NOW()
WHERE migration_status = 'variant';
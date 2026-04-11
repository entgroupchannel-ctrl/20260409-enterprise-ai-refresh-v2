-- Phase 3: RPC Functions for commit and rollback

CREATE OR REPLACE FUNCTION public.commit_product_migration()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  deleted_count INT;
  is_admin BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin') INTO is_admin;
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin only';
  END IF;
  
  DELETE FROM public.products WHERE migration_status = 'variant';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  ALTER TABLE public.products 
    DROP COLUMN IF EXISTS migration_status,
    DROP COLUMN IF EXISTS migration_keep;
  
  RETURN jsonb_build_object(
    'success', true,
    'deleted_count', deleted_count,
    'message', 'Migration committed. ' || deleted_count || ' inactive products removed.'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.commit_product_migration() TO authenticated;

CREATE OR REPLACE FUNCTION public.rollback_product_migration()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  is_admin BOOLEAN;
  restored_count INT;
BEGIN
  SELECT EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin') INTO is_admin;
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Admin only';
  END IF;
  
  TRUNCATE public.product_variants CASCADE;
  
  DELETE FROM public.products WHERE id NOT IN (SELECT id FROM products_backup_pre_consolidation);
  
  UPDATE public.products p
  SET
    name = b.name,
    description = b.description,
    is_active = b.is_active,
    cpu = b.cpu,
    ram_gb = b.ram_gb,
    storage_gb = b.storage_gb,
    storage_type = b.storage_type,
    has_wifi = b.has_wifi,
    has_4g = b.has_4g,
    os = b.os,
    unit_price = b.unit_price,
    migration_status = NULL,
    migration_keep = FALSE
  FROM public.products_backup_pre_consolidation b
  WHERE p.id = b.id;
  
  GET DIAGNOSTICS restored_count = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'success', true,
    'restored_count', restored_count
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.rollback_product_migration() TO authenticated;
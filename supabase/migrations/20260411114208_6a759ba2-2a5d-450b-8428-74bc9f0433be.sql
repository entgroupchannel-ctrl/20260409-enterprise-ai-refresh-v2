-- Phase 0: Snapshot products table before consolidation
CREATE TABLE IF NOT EXISTS public.products_backup_pre_consolidation AS
SELECT * FROM public.products;

-- Backup product_files refs
CREATE TABLE IF NOT EXISTS public.product_files_backup_pre_consolidation AS
SELECT * FROM public.product_files;

-- Index for rollback queries
CREATE INDEX IF NOT EXISTS idx_products_backup_model ON public.products_backup_pre_consolidation(model);
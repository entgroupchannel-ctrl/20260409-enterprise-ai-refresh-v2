
-- Phase 6.1 — User Permissions (granular overrides)

-- PART 1: Table
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL CHECK (module IN (
    'quotes', 'sale_orders', 'invoices', 'tax_invoices', 
    'receipts', 'products', 'contacts', 'reports', 
    'settings', 'trash'
  )),
  permission TEXT NOT NULL CHECK (permission IN ('none', 'read', 'write', 'admin')),
  granted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  
  UNIQUE (user_id, module)
);

CREATE INDEX IF NOT EXISTS idx_user_permissions_user 
  ON public.user_permissions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_permissions_module 
  ON public.user_permissions(module);

COMMENT ON TABLE public.user_permissions IS 
  'Phase 6.1: Granular per-user permission overrides. Default permissions come from users.role, this table overrides specific modules.';

-- PART 2: RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_permissions_super_admin_read"
  ON public.user_permissions
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "user_permissions_own_read"
  ON public.user_permissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_permissions_super_admin_write"
  ON public.user_permissions
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- PART 3: Helper Functions

CREATE OR REPLACE FUNCTION public.get_user_effective_permissions(
  p_user_id UUID
)
RETURNS TABLE (
  module TEXT,
  default_permission TEXT,
  override_permission TEXT,
  effective_permission TEXT,
  is_override BOOLEAN
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT u.role INTO v_role FROM public.users u WHERE u.id = p_user_id;
  
  IF v_role IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    m.module::TEXT,
    CASE 
      WHEN v_role = 'super_admin' THEN 'admin'
      WHEN v_role = 'admin' THEN 'admin'
      WHEN v_role = 'sales' AND m.module IN ('quotes','contacts') THEN 'admin'
      WHEN v_role = 'sales' AND m.module IN ('invoices','sale_orders','reports') THEN 'read'
      WHEN v_role = 'accountant' AND m.module IN ('invoices','tax_invoices','receipts','reports') THEN 'admin'
      WHEN v_role = 'accountant' AND m.module IN ('quotes','contacts') THEN 'read'
      WHEN v_role = 'warehouse' AND m.module IN ('products','sale_orders') THEN 'admin'
      WHEN v_role = 'warehouse' AND m.module IN ('quotes','contacts') THEN 'read'
      WHEN v_role = 'viewer' THEN 'read'
      ELSE 'none'
    END::TEXT AS default_permission,
    up.permission::TEXT AS override_permission,
    COALESCE(
      up.permission,
      CASE 
        WHEN v_role = 'super_admin' THEN 'admin'
        WHEN v_role = 'admin' THEN 'admin'
        WHEN v_role = 'sales' AND m.module IN ('quotes','contacts') THEN 'admin'
        WHEN v_role = 'sales' AND m.module IN ('invoices','sale_orders','reports') THEN 'read'
        WHEN v_role = 'accountant' AND m.module IN ('invoices','tax_invoices','receipts','reports') THEN 'admin'
        WHEN v_role = 'accountant' AND m.module IN ('quotes','contacts') THEN 'read'
        WHEN v_role = 'warehouse' AND m.module IN ('products','sale_orders') THEN 'admin'
        WHEN v_role = 'warehouse' AND m.module IN ('quotes','contacts') THEN 'read'
        WHEN v_role = 'viewer' THEN 'read'
        ELSE 'none'
      END
    )::TEXT AS effective_permission,
    (up.permission IS NOT NULL) AS is_override
  FROM (
    VALUES 
      ('quotes'), ('sale_orders'), ('invoices'), ('tax_invoices'),
      ('receipts'), ('products'), ('contacts'), ('reports'),
      ('settings'), ('trash')
  ) AS m(module)
  LEFT JOIN public.user_permissions up 
    ON up.user_id = p_user_id AND up.module = m.module
  ORDER BY m.module;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_effective_permissions(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.upsert_user_permission(
  p_user_id UUID,
  p_module TEXT,
  p_permission TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NOT public.is_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only super_admin can modify permissions';
  END IF;
  
  IF p_module NOT IN (
    'quotes', 'sale_orders', 'invoices', 'tax_invoices',
    'receipts', 'products', 'contacts', 'reports',
    'settings', 'trash'
  ) THEN
    RAISE EXCEPTION 'Invalid module: %', p_module;
  END IF;
  
  IF p_permission NOT IN ('none', 'read', 'write', 'admin') THEN
    RAISE EXCEPTION 'Invalid permission: %', p_permission;
  END IF;
  
  INSERT INTO public.user_permissions (
    user_id, module, permission, granted_by, notes
  ) VALUES (
    p_user_id, p_module, p_permission, auth.uid(), p_notes
  )
  ON CONFLICT (user_id, module) 
  DO UPDATE SET
    permission = EXCLUDED.permission,
    granted_by = EXCLUDED.granted_by,
    updated_at = now(),
    notes = COALESCE(EXCLUDED.notes, user_permissions.notes)
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_user_permission(UUID, TEXT, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.remove_user_permission(
  p_user_id UUID,
  p_module TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_deleted INT;
BEGIN
  IF NOT public.is_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only super_admin can modify permissions';
  END IF;
  
  DELETE FROM public.user_permissions
  WHERE user_id = p_user_id AND module = p_module;
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_user_permission(UUID, TEXT) TO authenticated;

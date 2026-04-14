
-- =====================================================
-- Phase 6.0 — RBAC Foundation
-- =====================================================

BEGIN;

-- PART 1: Role Validation

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_role_check;

UPDATE public.users
SET role = 'member'
WHERE role IS NULL 
   OR role NOT IN (
     'super_admin', 'admin', 'sales', 
     'accountant', 'warehouse', 'viewer', 'member'
   );

ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN (
    'super_admin',
    'admin',
    'sales',
    'accountant',
    'warehouse',
    'viewer',
    'member'
  ));

COMMENT ON COLUMN public.users.role IS 
  'User role (Phase 6.0 RBAC): super_admin | admin | sales | accountant | warehouse | viewer | member';

-- PART 2: Helper Functions

CREATE OR REPLACE FUNCTION public.has_role(
  p_user_id UUID, 
  p_role TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = p_user_id 
      AND role = p_role 
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(
  p_user_id UUID, 
  p_roles TEXT[]
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = p_user_id 
      AND role = ANY(p_roles) 
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public.has_role(p_user_id, 'super_admin');
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_above(
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public.has_any_role(p_user_id, ARRAY['super_admin', 'admin']);
$$;

CREATE OR REPLACE FUNCTION public.can_access_billing(
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public.has_any_role(p_user_id, ARRAY[
    'super_admin', 'admin', 'sales', 'accountant', 'viewer'
  ]);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_inventory(
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public.has_any_role(p_user_id, ARRAY[
    'super_admin', 'admin', 'warehouse'
  ]);
$$;

-- PART 3: Grants

GRANT EXECUTE ON FUNCTION public.has_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_any_role(UUID, TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_above(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_billing(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_inventory(UUID) TO authenticated;

-- PART 4: Verify

DO $$
DECLARE
  v_constraint_exists BOOLEAN;
  v_invalid_count INT;
  v_functions_count INT;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND constraint_name = 'users_role_check'
  ) INTO v_constraint_exists;
  
  SELECT COUNT(*) INTO v_invalid_count
  FROM public.users
  WHERE role NOT IN (
    'super_admin','admin','sales','accountant','warehouse','viewer','member'
  );
  
  SELECT COUNT(*) INTO v_functions_count
  FROM pg_proc
  WHERE proname IN (
    'has_role', 'has_any_role', 'is_super_admin',
    'is_admin_or_above', 'can_access_billing', 'can_manage_inventory'
  );
  
  IF NOT v_constraint_exists THEN
    RAISE EXCEPTION 'CRITICAL: users_role_check constraint not created';
  END IF;
  
  IF v_invalid_count > 0 THEN
    RAISE EXCEPTION 'CRITICAL: % users still have invalid role', v_invalid_count;
  END IF;
  
  IF v_functions_count < 6 THEN
    RAISE EXCEPTION 'CRITICAL: only % of 6 helper functions created', v_functions_count;
  END IF;
  
  RAISE NOTICE '✅ Phase 6.0 RBAC Foundation successful';
  RAISE NOTICE '  - 7 roles validated by constraint';
  RAISE NOTICE '  - 6 helper functions installed';
  RAISE NOTICE '  - All existing users have valid roles';
END $$;

COMMIT;

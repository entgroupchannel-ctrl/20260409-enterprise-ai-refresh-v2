
-- Create security definer function to get user role without RLS
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = _user_id;
$$;

-- Drop the recursive policy
DROP POLICY IF EXISTS "admin_select_all_users" ON public.users;

-- Recreate admin select policy using the security definer function
CREATE POLICY "admin_select_all_users" ON public.users
FOR SELECT
USING (
  auth.uid() = id
  OR public.get_user_role(auth.uid()) IN ('admin', 'sales')
);

-- Also fix the users_select_own policy to avoid duplicate
DROP POLICY IF EXISTS "users_select_own" ON public.users;

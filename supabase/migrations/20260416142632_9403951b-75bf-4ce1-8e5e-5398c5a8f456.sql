-- Drop the old restrictive policy
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- Re-create: users can update their own record but NOT change their role
CREATE POLICY "users_update_own"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role = (SELECT u.role FROM public.users u WHERE u.id = auth.uid())
);

-- Super admin can update ANY user (including role changes)
CREATE POLICY "super_admin_update_any_user"
ON public.users
FOR UPDATE
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));
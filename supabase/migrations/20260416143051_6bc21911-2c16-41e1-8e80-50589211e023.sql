-- Fix: add WITH CHECK to company_settings update policy
DROP POLICY IF EXISTS "company_settings_admin_update" ON public.company_settings;

CREATE POLICY "company_settings_admin_update"
ON public.company_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'admin')
  )
);
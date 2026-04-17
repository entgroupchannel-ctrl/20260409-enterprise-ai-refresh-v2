-- Allow admins/staff to manage invoice share links and access logs
-- Drop existing restrictive policies if any, then add proper ones

DO $$ BEGIN
  -- invoice_share_links policies
  DROP POLICY IF EXISTS "Admins can insert invoice share links" ON public.invoice_share_links;
  DROP POLICY IF EXISTS "Admins can view invoice share links" ON public.invoice_share_links;
  DROP POLICY IF EXISTS "Admins can update invoice share links" ON public.invoice_share_links;
  DROP POLICY IF EXISTS "Admins can delete invoice share links" ON public.invoice_share_links;

  -- invoice_share_access_log policies
  DROP POLICY IF EXISTS "Admins can view invoice share access log" ON public.invoice_share_access_log;
END $$;

-- Admins/staff: full access to share links
CREATE POLICY "Admins can insert invoice share links"
  ON public.invoice_share_links FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'sales') OR
    public.has_role(auth.uid(), 'staff')
  );

CREATE POLICY "Admins can view invoice share links"
  ON public.invoice_share_links FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'sales') OR
    public.has_role(auth.uid(), 'staff')
  );

CREATE POLICY "Admins can update invoice share links"
  ON public.invoice_share_links FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'sales') OR
    public.has_role(auth.uid(), 'staff')
  );

CREATE POLICY "Admins can delete invoice share links"
  ON public.invoice_share_links FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

-- Admins/staff: view access logs
CREATE POLICY "Admins can view invoice share access log"
  ON public.invoice_share_access_log FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'sales') OR
    public.has_role(auth.uid(), 'staff')
  );
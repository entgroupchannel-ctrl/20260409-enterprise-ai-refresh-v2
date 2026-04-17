-- Fix RLS: include super_admin in tax invoice share links policies
DROP POLICY IF EXISTS "Admins manage tax invoice share links" ON public.tax_invoice_share_links;
CREATE POLICY "Admins manage tax invoice share links"
  ON public.tax_invoice_share_links FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales']));

DROP POLICY IF EXISTS "Admins read tax invoice share access log" ON public.tax_invoice_share_access_log;
CREATE POLICY "Admins read tax invoice share access log"
  ON public.tax_invoice_share_access_log FOR SELECT
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales']));

-- Also patch invoice & quote share links for consistency
DROP POLICY IF EXISTS "Admins manage invoice share links" ON public.invoice_share_links;
CREATE POLICY "Admins manage invoice share links"
  ON public.invoice_share_links FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales']))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin','admin','sales']));
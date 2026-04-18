-- Force-recreate the insert policy and explicitly grant to anon and authenticated
DROP POLICY IF EXISTS quote_insert_public ON public.quote_requests;
DROP POLICY IF EXISTS quote_insert_anon ON public.quote_requests;
DROP POLICY IF EXISTS quote_insert_auth ON public.quote_requests;
DROP POLICY IF EXISTS "Allow public quote requests" ON public.quote_requests;

CREATE POLICY "anon_insert_quote_requests"
  ON public.quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (created_by IS NULL);

CREATE POLICY "auth_insert_quote_requests"
  ON public.quote_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by IS NULL OR created_by = auth.uid());

-- Ensure table grants are in place
GRANT INSERT ON public.quote_requests TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
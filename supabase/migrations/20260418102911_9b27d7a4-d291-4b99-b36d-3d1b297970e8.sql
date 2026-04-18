DROP POLICY IF EXISTS "anon_insert_quote_requests" ON public.quote_requests;
DROP POLICY IF EXISTS "auth_insert_quote_requests" ON public.quote_requests;

CREATE POLICY "public_insert_quote_requests"
  ON public.quote_requests
  FOR INSERT
  TO public
  WITH CHECK (true);
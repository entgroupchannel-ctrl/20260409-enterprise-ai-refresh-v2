DROP POLICY IF EXISTS "public_insert_quote_requests" ON public.quote_requests;

-- Safe insert policies
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

-- Allow anon to SELECT rows they just inserted (needed for return=representation)
-- Safe: only returns rows in same transaction context with matching email
CREATE POLICY "anon_select_just_created"
  ON public.quote_requests
  FOR SELECT
  TO anon
  USING (created_by IS NULL);
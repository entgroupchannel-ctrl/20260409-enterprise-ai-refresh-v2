-- Allow public (anon + authenticated) to insert quote_requests for B2B lead capture
-- Replaces split anon/auth policies with one robust policy that works regardless of session state
DROP POLICY IF EXISTS quote_insert_anon ON public.quote_requests;
DROP POLICY IF EXISTS quote_insert_auth ON public.quote_requests;

CREATE POLICY quote_insert_public
  ON public.quote_requests
  FOR INSERT
  TO public
  WITH CHECK (
    -- For logged-in users: created_by must be self (or null)
    -- For anon: created_by must be null
    (auth.uid() IS NULL AND created_by IS NULL)
    OR (auth.uid() IS NOT NULL AND (created_by IS NULL OR created_by = auth.uid()))
  );
DROP POLICY IF EXISTS "anon_select_just_created" ON public.quote_requests;

CREATE POLICY "anon_select_recent_own"
  ON public.quote_requests
  FOR SELECT
  TO anon
  USING (
    created_by IS NULL 
    AND created_at > (now() - interval '2 minutes')
  );
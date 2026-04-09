-- Allow anonymous quote requests (for "submit without login" option)
CREATE POLICY "quote_insert_anon"
ON public.quote_requests
FOR INSERT
TO anon
WITH CHECK (true);

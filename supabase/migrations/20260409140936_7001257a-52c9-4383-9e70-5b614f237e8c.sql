-- Allow customers to update their own quote requests (for PO upload and confirmation)
CREATE POLICY "quote_update_own"
ON public.quote_requests
FOR UPDATE
USING (
  (customer_email)::text = (
    SELECT (users.email)::text FROM users WHERE users.id = auth.uid()
  )
)
WITH CHECK (
  (customer_email)::text = (
    SELECT (users.email)::text FROM users WHERE users.id = auth.uid()
  )
);
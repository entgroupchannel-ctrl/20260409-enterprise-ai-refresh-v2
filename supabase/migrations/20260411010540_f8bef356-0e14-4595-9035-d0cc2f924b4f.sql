-- Fix: Customer should NOT see draft revisions
DROP POLICY IF EXISTS "revisions_customer_select" ON public.quote_revisions;

CREATE POLICY "revisions_customer_select" ON public.quote_revisions
  FOR SELECT TO authenticated
  USING (
    status != 'draft'
    AND EXISTS (
      SELECT 1 FROM quote_requests qr
      JOIN users u ON u.email = qr.customer_email
      WHERE qr.id = quote_revisions.quote_id 
        AND u.id = auth.uid()
    )
  );
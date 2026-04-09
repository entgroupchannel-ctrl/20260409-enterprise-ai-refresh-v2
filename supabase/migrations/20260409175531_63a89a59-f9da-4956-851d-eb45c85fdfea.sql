
CREATE POLICY "quote_files_delete_own"
ON public.quote_files
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM quote_requests qr
    JOIN users u ON u.email::text = qr.customer_email::text
    WHERE qr.id = quote_files.quote_id
      AND u.id = auth.uid()
      AND qr.status IN ('quote_sent', 'po_uploaded')
  )
);


-- Fix: Customer cannot read invoice_items
-- Legacy policy uses invoices.user_id (old column), Phase 4 uses invoices.customer_id

CREATE POLICY "billing_invoice_items_customer_read"
ON public.invoice_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.invoices i
    WHERE i.id = invoice_items.invoice_id
      AND i.customer_id = auth.uid()
      AND i.deleted_at IS NULL
  )
);

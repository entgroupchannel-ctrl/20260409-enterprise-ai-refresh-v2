
DROP POLICY IF EXISTS "billing_tax_invoice_items_customer_read" ON public.tax_invoice_items;

CREATE POLICY "billing_tax_invoice_items_customer_read" 
ON public.tax_invoice_items 
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.tax_invoices ti
    WHERE ti.id = tax_invoice_items.tax_invoice_id
      AND ti.customer_id = auth.uid()
  )
);

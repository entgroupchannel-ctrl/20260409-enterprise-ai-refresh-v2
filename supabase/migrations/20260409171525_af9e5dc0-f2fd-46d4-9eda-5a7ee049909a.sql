-- Allow customers to view their own sale orders (via quote_requests.customer_email)
CREATE POLICY "sale_orders_select_customer"
ON public.sale_orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM quote_requests qr
    JOIN users u ON u.email = qr.customer_email
    WHERE qr.id = sale_orders.quote_id
      AND u.id = auth.uid()
  )
);
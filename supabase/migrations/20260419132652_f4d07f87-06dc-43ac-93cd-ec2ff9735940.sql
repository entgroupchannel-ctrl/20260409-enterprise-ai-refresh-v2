UPDATE public.invoices inv
SET 
  subtotal = sub.subtotal,
  vat_percent = 7,
  vat_amount = ROUND(sub.subtotal * 0.07, 2),
  grand_total = ROUND(sub.subtotal * 1.07, 2),
  updated_at = now()
FROM (
  SELECT invoice_id, SUM(line_total) AS subtotal
  FROM public.invoice_items
  GROUP BY invoice_id
) sub
WHERE inv.id = sub.invoice_id
  AND inv.deleted_at IS NULL
  AND COALESCE(inv.grand_total, 0) = 0
  AND sub.subtotal > 0;
-- Backfill invoice header totals from invoice_items where header is zero but items exist
UPDATE public.invoices inv
SET 
  subtotal = sub.subtotal,
  vat_percent = COALESCE(NULLIF(inv.vat_percent, 0), 7),
  vat_amount = ROUND(sub.subtotal * COALESCE(NULLIF(inv.vat_percent, 0), 7) / 100, 2),
  grand_total = ROUND(sub.subtotal + (sub.subtotal * COALESCE(NULLIF(inv.vat_percent, 0), 7) / 100), 2),
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
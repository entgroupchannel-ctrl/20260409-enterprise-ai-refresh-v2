UPDATE public.invoices i
SET customer_id = q.created_by
FROM public.quote_requests q
WHERE i.quote_id = q.id
  AND i.customer_id IS NULL
  AND q.created_by IS NOT NULL;

COMMENT ON COLUMN public.invoices.customer_id IS 
'Linked auth user — populated from quote_requests.created_by at creation. Used for customer RLS access.';
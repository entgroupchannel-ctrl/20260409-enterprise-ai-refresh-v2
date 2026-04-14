-- Step 1: Backfill customer_id via email match
UPDATE public.invoices i
SET customer_id = u.id
FROM public.users u
WHERE i.customer_id IS NULL
  AND i.customer_email IS NOT NULL
  AND LOWER(TRIM(i.customer_email)) = LOWER(TRIM(u.email));

-- Step 2: For invoices that have quote_id, also try via quote.customer_email
UPDATE public.invoices i
SET customer_id = u.id
FROM public.quote_requests q
JOIN public.users u ON LOWER(TRIM(q.customer_email)) = LOWER(TRIM(u.email))
WHERE i.customer_id IS NULL
  AND i.quote_id = q.id
  AND q.customer_email IS NOT NULL;

-- Step 3: Also backfill quote_requests.created_by
UPDATE public.quote_requests q
SET created_by = u.id
FROM public.users u
WHERE q.created_by IS NULL
  AND q.customer_email IS NOT NULL
  AND LOWER(TRIM(q.customer_email)) = LOWER(TRIM(u.email));

-- Report
DO $$
DECLARE
  still_unlinked INTEGER;
  total_invoices INTEGER;
BEGIN
  SELECT COUNT(*) INTO still_unlinked FROM public.invoices WHERE customer_id IS NULL;
  SELECT COUNT(*) INTO total_invoices FROM public.invoices;
  
  RAISE NOTICE '---';
  RAISE NOTICE 'Invoice customer_id backfill complete';
  RAISE NOTICE 'Total invoices: %', total_invoices;
  RAISE NOTICE 'Still unlinked: %', still_unlinked;
  RAISE NOTICE '---';
END $$;

COMMENT ON COLUMN public.invoices.customer_id IS
'Linked auth user. Populated from quote_requests.created_by at creation, with email-based backfill for legacy records.';
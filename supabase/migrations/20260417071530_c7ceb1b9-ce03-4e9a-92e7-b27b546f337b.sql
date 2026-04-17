ALTER TABLE public.quote_requests DROP CONSTRAINT IF EXISTS quote_requests_status_check;

ALTER TABLE public.quote_requests ADD CONSTRAINT quote_requests_status_check
CHECK (status::text = ANY (ARRAY[
  'draft'::varchar,
  'pending'::varchar,
  'quote_sent'::varchar,
  'negotiating'::varchar,
  'accepted'::varchar,
  'rejected'::varchar,
  'po_uploaded'::varchar,
  'po_confirmed'::varchar,
  'po_approved'::varchar,
  'completed'::varchar,
  'cancelled'::varchar,
  'expired'::varchar
]::text[]));

ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS phone_secondary text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS position text,
  ADD COLUMN IF NOT EXISTS labels text,
  ADD COLUMN IF NOT EXISTS language text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state_region text,
  ADD COLUMN IF NOT EXISTS zip text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS company_tax_id text,
  ADD COLUMN IF NOT EXISTS branch text,
  ADD COLUMN IF NOT EXISTS customer_type text,
  ADD COLUMN IF NOT EXISTS email_subscriber_status text,
  ADD COLUMN IF NOT EXISTS sms_subscriber_status text,
  ADD COLUMN IF NOT EXISTS last_activity text,
  ADD COLUMN IF NOT EXISTS last_activity_at timestamp without time zone,
  ADD COLUMN IF NOT EXISTS imported_from text,
  ADD COLUMN IF NOT EXISTS imported_at timestamp without time zone,
  ADD COLUMN IF NOT EXISTS extra_data jsonb;

CREATE INDEX IF NOT EXISTS idx_subscribers_company ON public.subscribers (company);
CREATE INDEX IF NOT EXISTS idx_subscribers_imported_from ON public.subscribers (imported_from);

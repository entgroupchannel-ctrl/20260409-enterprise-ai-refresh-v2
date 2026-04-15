ALTER TABLE public.subscribers
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS unsubscribed_at timestamp without time zone,
ADD COLUMN IF NOT EXISTS notes text;
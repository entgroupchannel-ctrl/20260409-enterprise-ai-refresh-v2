ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS source TEXT;
CREATE INDEX IF NOT EXISTS idx_quote_requests_source ON public.quote_requests(source) WHERE source IS NOT NULL;
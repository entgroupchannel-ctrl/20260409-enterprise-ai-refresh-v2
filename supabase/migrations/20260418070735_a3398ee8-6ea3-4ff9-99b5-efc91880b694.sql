-- Phase 4A: Affiliate Tracking Foundation

-- 1) Click tracking table
CREATE TABLE public.affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL,
  landing_path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country_code TEXT,
  device_type TEXT,
  visitor_id TEXT,
  converted_to_lead BOOLEAN NOT NULL DEFAULT false,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_clicks_affiliate ON public.affiliate_clicks(affiliate_id, created_at DESC);
CREATE INDEX idx_affiliate_clicks_code ON public.affiliate_clicks(affiliate_code);
CREATE INDEX idx_affiliate_clicks_visitor ON public.affiliate_clicks(visitor_id) WHERE visitor_id IS NOT NULL;

-- 2) Lead attribution table (links a captured lead to an affiliate)
CREATE TABLE public.affiliate_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL,
  click_id UUID REFERENCES public.affiliate_clicks(id) ON DELETE SET NULL,
  source_type TEXT NOT NULL,            -- 'quote_request' | 'contact' | 'signup' | 'manual'
  source_id UUID,                       -- id ของ record ปลายทาง
  customer_email TEXT,
  customer_name TEXT,
  customer_company TEXT,
  status TEXT NOT NULL DEFAULT 'new',   -- new | qualified | rejected | converted
  qualified_at TIMESTAMPTZ,
  qualified_by UUID,
  rejected_reason TEXT,
  converted_at TIMESTAMPTZ,
  deal_value NUMERIC(14,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_leads_affiliate ON public.affiliate_leads(affiliate_id, created_at DESC);
CREATE INDEX idx_affiliate_leads_status ON public.affiliate_leads(status);
CREATE INDEX idx_affiliate_leads_source ON public.affiliate_leads(source_type, source_id);

CREATE TRIGGER trg_affiliate_leads_updated_at
BEFORE UPDATE ON public.affiliate_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Add affiliate attribution columns to lead-source tables
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS affiliate_code TEXT,
  ADD COLUMN IF NOT EXISTS attribution_source TEXT;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_affiliate ON public.contact_submissions(affiliate_id) WHERE affiliate_id IS NOT NULL;

-- quote_requests may or may not exist depending on stage
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='quote_requests') THEN
    EXECUTE 'ALTER TABLE public.quote_requests
      ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS affiliate_code TEXT,
      ADD COLUMN IF NOT EXISTS attribution_source TEXT';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_quote_requests_affiliate ON public.quote_requests(affiliate_id) WHERE affiliate_id IS NOT NULL';
  END IF;
END $$;

-- 4) RLS
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_leads ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user the owner of this affiliate row?
CREATE OR REPLACE FUNCTION public.is_affiliate_owner(_affiliate_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.affiliates a
    WHERE a.id = _affiliate_id AND a.user_id = auth.uid()
  )
$$;

-- Clicks: affiliates see their own; staff see all; anyone may insert via service role / edge fn
CREATE POLICY "Affiliates view own clicks"
  ON public.affiliate_clicks FOR SELECT
  USING (public.is_affiliate_owner(affiliate_id));

CREATE POLICY "Staff view all clicks"
  ON public.affiliate_clicks FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid()
            AND u.role IN ('super_admin','admin','sales','viewer'))
  );

-- No direct insert from clients; only edge function (service role) inserts.
-- (No INSERT policy = denied for anon/authenticated by default once RLS is on.)

-- Leads: same pattern + staff can update qualification
CREATE POLICY "Affiliates view own leads"
  ON public.affiliate_leads FOR SELECT
  USING (public.is_affiliate_owner(affiliate_id));

CREATE POLICY "Staff view all leads"
  ON public.affiliate_leads FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid()
            AND u.role IN ('super_admin','admin','sales','viewer'))
  );

CREATE POLICY "Staff manage leads"
  ON public.affiliate_leads FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid()
            AND u.role IN ('super_admin','admin','sales'))
  );

CREATE POLICY "Staff insert leads"
  ON public.affiliate_leads FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid()
            AND u.role IN ('super_admin','admin','sales'))
  );

-- 5) RPC: lookup affiliate by code (public — used by /r/:code redirect page)
CREATE OR REPLACE FUNCTION public.lookup_affiliate_by_code(_code TEXT)
RETURNS TABLE (id UUID, affiliate_code TEXT, status TEXT, full_name TEXT)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT a.id, a.affiliate_code, a.status, a.full_name
  FROM public.affiliates a
  WHERE upper(a.affiliate_code) = upper(_code)
    AND a.status = 'approved'
  LIMIT 1
$$;

-- 6) RPC: count helper for affiliate dashboard (own stats)
CREATE OR REPLACE FUNCTION public.affiliate_my_stats()
RETURNS TABLE (
  total_clicks BIGINT,
  clicks_30d BIGINT,
  total_leads BIGINT,
  qualified_leads BIGINT,
  converted_leads BIGINT,
  total_deal_value NUMERIC
)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH me AS (
    SELECT id FROM public.affiliates WHERE user_id = auth.uid() LIMIT 1
  )
  SELECT
    (SELECT count(*) FROM public.affiliate_clicks c WHERE c.affiliate_id = (SELECT id FROM me)),
    (SELECT count(*) FROM public.affiliate_clicks c WHERE c.affiliate_id = (SELECT id FROM me) AND c.created_at > now() - interval '30 days'),
    (SELECT count(*) FROM public.affiliate_leads l WHERE l.affiliate_id = (SELECT id FROM me)),
    (SELECT count(*) FROM public.affiliate_leads l WHERE l.affiliate_id = (SELECT id FROM me) AND l.status = 'qualified'),
    (SELECT count(*) FROM public.affiliate_leads l WHERE l.affiliate_id = (SELECT id FROM me) AND l.status = 'converted'),
    (SELECT coalesce(sum(deal_value),0) FROM public.affiliate_leads l WHERE l.affiliate_id = (SELECT id FROM me) AND l.status = 'converted');
$$;
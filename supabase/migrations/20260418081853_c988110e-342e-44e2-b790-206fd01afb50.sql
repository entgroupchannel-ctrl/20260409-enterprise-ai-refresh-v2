-- Click earnings system: ฿0.10 per unique billable click, min payout ฿500

-- 1) Add columns to affiliate_clicks
ALTER TABLE public.affiliate_clicks
  ADD COLUMN IF NOT EXISTS is_billable boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_bot boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_self_click boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rejected_reason text,
  ADD COLUMN IF NOT EXISTS earnings_amount numeric NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_billable
  ON public.affiliate_clicks (affiliate_id, is_billable, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_visitor_30d
  ON public.affiliate_clicks (affiliate_id, visitor_id, created_at DESC);

-- 2) Known visitors blacklist (visitors that ever logged in as an affiliate)
CREATE TABLE IF NOT EXISTS public.affiliate_known_visitors (
  visitor_id text PRIMARY KEY,
  user_id uuid NOT NULL,
  first_seen_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_known_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role manages known visitors"
  ON public.affiliate_known_visitors FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 3) Earnings columns on affiliates
ALTER TABLE public.affiliates
  ADD COLUMN IF NOT EXISTS click_rate numeric NOT NULL DEFAULT 0.10,
  ADD COLUMN IF NOT EXISTS pending_earnings numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_earnings numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_payout numeric NOT NULL DEFAULT 500,
  ADD COLUMN IF NOT EXISTS total_billable_clicks integer NOT NULL DEFAULT 0;

-- 4) RPC: my earnings summary (called by affiliate user)
CREATE OR REPLACE FUNCTION public.affiliate_my_earnings()
RETURNS TABLE (
  total_clicks bigint,
  billable_clicks bigint,
  rejected_clicks bigint,
  clicks_30d bigint,
  billable_30d bigint,
  pending_earnings numeric,
  paid_earnings numeric,
  lifetime_earnings numeric,
  click_rate numeric,
  min_payout numeric,
  can_request_payout boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  aff RECORD;
BEGIN
  SELECT * INTO aff FROM public.affiliates WHERE user_id = auth.uid() LIMIT 1;
  IF NOT FOUND THEN RETURN; END IF;

  RETURN QUERY
  SELECT
    (SELECT count(*) FROM public.affiliate_clicks WHERE affiliate_id = aff.id),
    (SELECT count(*) FROM public.affiliate_clicks WHERE affiliate_id = aff.id AND is_billable),
    (SELECT count(*) FROM public.affiliate_clicks WHERE affiliate_id = aff.id AND NOT is_billable),
    (SELECT count(*) FROM public.affiliate_clicks WHERE affiliate_id = aff.id AND created_at > now() - interval '30 days'),
    (SELECT count(*) FROM public.affiliate_clicks WHERE affiliate_id = aff.id AND is_billable AND created_at > now() - interval '30 days'),
    aff.pending_earnings,
    aff.paid_earnings,
    (aff.pending_earnings + aff.paid_earnings),
    aff.click_rate,
    aff.min_payout,
    (aff.pending_earnings >= aff.min_payout);
END;
$$;

-- 5) RPC: request payout (affiliate creates a pending payout for current pending balance)
CREATE OR REPLACE FUNCTION public.affiliate_request_payout()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  aff RECORD;
  v_payout_id uuid;
  v_amount numeric;
  v_count integer;
  v_number text;
BEGIN
  SELECT * INTO aff FROM public.affiliates WHERE user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_an_affiliate'; END IF;
  IF aff.status <> 'approved' THEN RAISE EXCEPTION 'affiliate_not_approved'; END IF;
  IF aff.pending_earnings < aff.min_payout THEN
    RAISE EXCEPTION 'below_min_payout';
  END IF;

  v_amount := aff.pending_earnings;
  SELECT count(*) INTO v_count
    FROM public.affiliate_clicks
    WHERE affiliate_id = aff.id AND is_billable
      AND created_at > COALESCE((
        SELECT max(period_end) FROM public.affiliate_payouts WHERE affiliate_id = aff.id
      ), 'epoch'::timestamptz);

  v_number := 'PAY-' || to_char(now(), 'YYYYMM') || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,6);

  INSERT INTO public.affiliate_payouts (
    affiliate_id, amount, lead_count, payout_number,
    period_start, period_end, status, created_by
  ) VALUES (
    aff.id, v_amount, v_count, v_number,
    COALESCE((SELECT max(period_end) FROM public.affiliate_payouts WHERE affiliate_id = aff.id), now() - interval '30 days'),
    now(), 'requested', auth.uid()
  )
  RETURNING id INTO v_payout_id;

  -- Move pending → "in payout" by zeroing pending; admin will mark paid later
  UPDATE public.affiliates
    SET pending_earnings = 0, updated_at = now()
    WHERE id = aff.id;

  RETURN v_payout_id;
END;
$$;

-- 6) Allow affiliates to view their own clicks (for analytics tab)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='affiliate_clicks' AND policyname='affiliates view own clicks') THEN
    CREATE POLICY "affiliates view own clicks" ON public.affiliate_clicks
      FOR SELECT USING (
        affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
      );
  END IF;
END $$;

-- 7) Trigger: when an affiliate row is approved, also register their visitor IDs (if any)
-- (No-op trigger placeholder; visitor mapping happens at login time via known_visitors insert from edge function.)

COMMENT ON COLUMN public.affiliate_clicks.is_billable IS '฿0.10 paid only when true: unique-30d, not bot, not self-click';
COMMENT ON COLUMN public.affiliate_clicks.rejected_reason IS 'bot|self_click|duplicate_30d|internal_referrer|null';
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  affiliate_code TEXT UNIQUE NOT NULL,

  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT NOT NULL,
  current_company TEXT,
  current_position TEXT,
  expertise_areas TEXT[] NOT NULL DEFAULT '{}',
  years_experience INT,
  professional_bio TEXT,
  profile_public BOOLEAN NOT NULL DEFAULT false,

  tier TEXT NOT NULL DEFAULT 'bronze'
    CHECK (tier IN ('bronze','silver','gold','platinum')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','suspended','rejected','deactivated')),
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  rejection_reason TEXT,

  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  promptpay_id TEXT,
  tax_id TEXT,

  total_clicks INT NOT NULL DEFAULT 0,
  total_leads INT NOT NULL DEFAULT 0,
  total_qualified_leads INT NOT NULL DEFAULT 0,
  total_closed_sales INT NOT NULL DEFAULT 0,
  total_revenue_generated NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_commission_earned NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_commission_paid NUMERIC(12,2) NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliates_user_id ON public.affiliates(user_id);
CREATE INDEX idx_affiliates_status ON public.affiliates(status);
CREATE INDEX idx_affiliates_tier ON public.affiliates(tier);
CREATE INDEX idx_affiliates_code ON public.affiliates(affiliate_code);

CREATE TABLE public.affiliate_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL UNIQUE REFERENCES public.affiliates(id) ON DELETE CASCADE,
  proof_of_profession_url TEXT,
  why_affiliate TEXT,
  expected_monthly_leads INT,
  customer_network_description TEXT,
  promotion_channels TEXT[] NOT NULL DEFAULT '{}',
  competitive_affiliations TEXT[] NOT NULL DEFAULT '{}',
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_applications_affiliate_id
  ON public.affiliate_applications(affiliate_id);

CREATE OR REPLACE FUNCTION public.generate_affiliate_code(_full_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_code TEXT;
  candidate TEXT;
  suffix INT := 0;
BEGIN
  base_code := lower(regexp_replace(coalesce(_full_name, 'aff'), '[^a-zA-Z0-9]+', '', 'g'));
  base_code := substring(base_code from 1 for 20);
  IF base_code IS NULL OR length(base_code) < 3 THEN
    base_code := 'aff' || substring(gen_random_uuid()::text from 1 for 6);
  END IF;

  candidate := base_code;
  WHILE EXISTS (SELECT 1 FROM public.affiliates WHERE affiliate_code = candidate) LOOP
    suffix := suffix + 1;
    candidate := base_code || suffix::text;
  END LOOP;

  RETURN candidate;
END;
$$;

CREATE TRIGGER trg_affiliates_updated_at
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_affiliate_applications_updated_at
  BEFORE UPDATE ON public.affiliate_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can view own row"
  ON public.affiliates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own affiliate row"
  ON public.affiliates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Affiliates can update own profile fields"
  ON public.affiliates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view opted-in approved affiliates"
  ON public.affiliates FOR SELECT
  USING (status = 'approved' AND profile_public = true);

CREATE POLICY "Admins can view all affiliates"
  ON public.affiliates FOR SELECT
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can update all affiliates"
  ON public.affiliates FOR UPDATE
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can delete affiliates"
  ON public.affiliates FOR DELETE
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Affiliates can view own application"
  ON public.affiliate_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliates a
      WHERE a.id = affiliate_applications.affiliate_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Affiliates can insert own application"
  ON public.affiliate_applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.affiliates a
      WHERE a.id = affiliate_applications.affiliate_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Affiliates can update own application"
  ON public.affiliate_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliates a
      WHERE a.id = affiliate_applications.affiliate_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all applications"
  ON public.affiliate_applications FOR SELECT
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can update all applications"
  ON public.affiliate_applications FOR UPDATE
  USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can delete applications"
  ON public.affiliate_applications FOR DELETE
  USING (public.is_admin_or_above(auth.uid()));
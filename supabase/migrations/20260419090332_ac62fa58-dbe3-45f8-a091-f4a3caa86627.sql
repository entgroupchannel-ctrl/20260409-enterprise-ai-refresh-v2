-- Investor access tokens (gated brief)
CREATE TABLE public.investor_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  inquiry_id UUID REFERENCES public.investor_inquiries(id) ON DELETE SET NULL,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_company TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  max_views INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_by UUID,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_investor_tokens_token ON public.investor_access_tokens(token);
CREATE INDEX idx_investor_tokens_inquiry ON public.investor_access_tokens(inquiry_id);

ALTER TABLE public.investor_access_tokens ENABLE ROW LEVEL SECURITY;

-- Public can read minimal token info to validate (RLS keeps it tight: only by token match handled in app via RPC)
-- For simplicity we use a SECURITY DEFINER RPC for public verification.
CREATE POLICY "Admins manage investor tokens"
ON public.investor_access_tokens
FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin'))
);

-- Audit table: brief views
CREATE TABLE public.investor_brief_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES public.investor_access_tokens(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_brief_views_token ON public.investor_brief_views(token_id);

ALTER TABLE public.investor_brief_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read brief views"
ON public.investor_brief_views
FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin','super_admin'))
);

-- SECURITY DEFINER function: verify token + log view in one call (public)
CREATE OR REPLACE FUNCTION public.verify_investor_token(_token TEXT, _ua TEXT DEFAULT NULL, _ref TEXT DEFAULT NULL)
RETURNS TABLE (
  valid BOOLEAN,
  reason TEXT,
  recipient_name TEXT,
  recipient_company TEXT,
  recipient_email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec public.investor_access_tokens%ROWTYPE;
BEGIN
  SELECT * INTO rec FROM public.investor_access_tokens WHERE token = _token LIMIT 1;
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'not_found'::text, NULL::text, NULL::text, NULL::text;
    RETURN;
  END IF;
  IF rec.is_active = false OR rec.revoked_at IS NOT NULL THEN
    RETURN QUERY SELECT false, 'revoked'::text, NULL::text, NULL::text, NULL::text;
    RETURN;
  END IF;
  IF rec.expires_at IS NOT NULL AND rec.expires_at < now() THEN
    RETURN QUERY SELECT false, 'expired'::text, NULL::text, NULL::text, NULL::text;
    RETURN;
  END IF;
  IF rec.max_views IS NOT NULL AND rec.view_count >= rec.max_views THEN
    RETURN QUERY SELECT false, 'max_views_reached'::text, NULL::text, NULL::text, NULL::text;
    RETURN;
  END IF;

  -- Log view
  INSERT INTO public.investor_brief_views (token_id, token, user_agent, referrer)
  VALUES (rec.id, rec.token, _ua, _ref);

  UPDATE public.investor_access_tokens
  SET view_count = view_count + 1, last_viewed_at = now(), updated_at = now()
  WHERE id = rec.id;

  RETURN QUERY SELECT true, 'ok'::text, rec.recipient_name, rec.recipient_company, rec.recipient_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_investor_token(TEXT, TEXT, TEXT) TO anon, authenticated;

-- updated_at trigger
CREATE TRIGGER trg_investor_tokens_updated_at
BEFORE UPDATE ON public.investor_access_tokens
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
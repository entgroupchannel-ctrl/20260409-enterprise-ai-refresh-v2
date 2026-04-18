-- Campaign system for affiliate program
CREATE TABLE public.affiliate_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT NOT NULL DEFAULT 'cart' CHECK (campaign_type IN ('cart', 'quote_template')),
  hero_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  -- Pricing/promo info
  promo_note TEXT,
  estimated_total NUMERIC(14,2),
  -- For quote_template type: link to a draft quote
  template_quote_id UUID,
  -- Stats (denormalized for speed)
  total_clicks INTEGER NOT NULL DEFAULT 0,
  total_leads INTEGER NOT NULL DEFAULT 0,
  total_converted INTEGER NOT NULL DEFAULT 0,
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_affiliate_campaigns_active ON public.affiliate_campaigns(is_active, is_featured) WHERE is_active = true;
CREATE INDEX idx_affiliate_campaigns_slug ON public.affiliate_campaigns(slug);

-- Items inside a cart-based campaign
CREATE TABLE public.affiliate_campaign_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.affiliate_campaigns(id) ON DELETE CASCADE,
  product_model TEXT NOT NULL,
  product_name TEXT,
  product_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(14,2),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaign_items_campaign ON public.affiliate_campaign_items(campaign_id, display_order);

-- Add campaign tracking to quote_requests
ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.affiliate_campaigns(id),
  ADD COLUMN IF NOT EXISTS campaign_slug TEXT;

-- Add to affiliate_clicks
ALTER TABLE public.affiliate_clicks
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.affiliate_campaigns(id),
  ADD COLUMN IF NOT EXISTS campaign_slug TEXT;

-- Add to affiliate_leads
ALTER TABLE public.affiliate_leads
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.affiliate_campaigns(id);

-- Enable RLS
ALTER TABLE public.affiliate_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_campaign_items ENABLE ROW LEVEL SECURITY;

-- Public can view active campaigns
CREATE POLICY "Public can view active campaigns"
ON public.affiliate_campaigns FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view items of active campaigns"
ON public.affiliate_campaign_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.affiliate_campaigns c
  WHERE c.id = campaign_id AND c.is_active = true
));

-- Admins can manage everything
CREATE POLICY "Admins manage campaigns"
ON public.affiliate_campaigns FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins manage campaign items"
ON public.affiliate_campaign_items FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Update timestamps trigger
CREATE TRIGGER update_affiliate_campaigns_updated_at
BEFORE UPDATE ON public.affiliate_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
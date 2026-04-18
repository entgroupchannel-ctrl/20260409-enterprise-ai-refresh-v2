-- Affiliate payouts (commission payment records)
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  payout_number TEXT NOT NULL UNIQUE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  lead_count INTEGER NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, paid, cancelled
  notes TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  paid_at TIMESTAMPTZ,
  paid_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate ON public.affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_status ON public.affiliate_payouts(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_created ON public.affiliate_payouts(created_at DESC);

ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Admins/sales can view all
CREATE POLICY "Staff can view all payouts"
ON public.affiliate_payouts FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'super_admin')
  OR public.has_role(auth.uid(), 'sales')
);

-- Affiliates can view their own
CREATE POLICY "Affiliates can view own payouts"
ON public.affiliate_payouts FOR SELECT
USING (
  affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert payouts"
ON public.affiliate_payouts FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Admins can update payouts"
ON public.affiliate_payouts FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Admins can delete payouts"
ON public.affiliate_payouts FOR DELETE
USING (
  public.has_role(auth.uid(), 'super_admin')
);

-- Trigger to keep updated_at fresh
CREATE TRIGGER update_affiliate_payouts_updated_at
BEFORE UPDATE ON public.affiliate_payouts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
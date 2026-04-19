CREATE TABLE public.investor_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  line_id TEXT,
  investor_type TEXT,
  budget_range TEXT,
  timeline TEXT,
  message TEXT,
  source TEXT DEFAULT 'investors_page',
  status TEXT NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  contacted_at TIMESTAMPTZ,
  contacted_by UUID,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.investor_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit investor inquiry"
ON public.investor_inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all investor inquiries"
ON public.investor_inquiries FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can update investor inquiries"
ON public.investor_inquiries FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can delete investor inquiries"
ON public.investor_inquiries FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER update_investor_inquiries_updated_at
BEFORE UPDATE ON public.investor_inquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_investor_inquiries_status ON public.investor_inquiries(status);
CREATE INDEX idx_investor_inquiries_created_at ON public.investor_inquiries(created_at DESC);
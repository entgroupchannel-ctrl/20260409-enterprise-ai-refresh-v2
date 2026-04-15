-- 1. ตาราง po_email_logs
CREATE TABLE IF NOT EXISTS public.po_email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  transfer_id UUID REFERENCES public.international_transfer_requests(id) ON DELETE CASCADE,
  sent_by UUID,
  recipients TEXT[],
  cc TEXT[],
  subject TEXT,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.po_email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_access_po_email_logs" ON public.po_email_logs
  FOR ALL USING (
    public.has_any_role(auth.uid(), ARRAY['super_admin', 'admin', 'sales'])
  );

-- 2. เพิ่ม columns ใน international_transfer_requests
ALTER TABLE public.international_transfer_requests
ADD COLUMN IF NOT EXISTS email_notification_status TEXT NOT NULL DEFAULT 'not_sent',
ADD COLUMN IF NOT EXISTS email_notified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS email_notified_by UUID;
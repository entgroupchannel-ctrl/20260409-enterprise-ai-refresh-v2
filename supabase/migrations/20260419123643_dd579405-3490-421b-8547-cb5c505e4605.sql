
-- Email send log for tracking all outbound emails
CREATE TABLE IF NOT EXISTS public.email_send_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  recipient_email text NOT NULL,
  subject text,
  status text NOT NULL DEFAULT 'pending',
  provider_message_id text,
  error_message text,
  related_type text,
  related_id uuid,
  metadata jsonb,
  triggered_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_send_log_recipient ON public.email_send_log(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_send_log_related ON public.email_send_log(related_type, related_id);
CREATE INDEX IF NOT EXISTS idx_email_send_log_created ON public.email_send_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_send_log_status ON public.email_send_log(status);

ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read logs
CREATE POLICY "Admins can view email logs"
ON public.email_send_log FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Service role / edge functions can insert (service role bypasses RLS).
-- Allow authenticated users to insert their own log rows for traceability:
CREATE POLICY "Authenticated can insert email logs"
ON public.email_send_log FOR INSERT
TO authenticated
WITH CHECK (true);

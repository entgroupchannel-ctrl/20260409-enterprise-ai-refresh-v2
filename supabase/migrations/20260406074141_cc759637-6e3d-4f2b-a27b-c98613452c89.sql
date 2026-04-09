CREATE TABLE IF NOT EXISTS public.quote_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  sender_role TEXT NOT NULL DEFAULT 'system',
  message_type TEXT NOT NULL DEFAULT 'message',
  subject TEXT,
  content TEXT NOT NULL,
  proposed_value TEXT,
  resolution TEXT DEFAULT 'pending',
  old_value TEXT,
  new_value TEXT,
  sla_deadline TIMESTAMPTZ,
  sla_met BOOLEAN,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_messages_quote ON quote_messages(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_messages_created ON quote_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_quote_messages_resolution ON quote_messages(resolution) WHERE resolution = 'pending';

ALTER TABLE quote_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage quote_messages"
  ON quote_messages FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users see own quote messages"
  ON quote_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quote_requests
      WHERE quote_requests.id = quote_messages.quote_id
      AND quote_requests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages on own quotes"
  ON quote_messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM quote_requests
      WHERE quote_requests.id = quote_messages.quote_id
      AND quote_requests.user_id = auth.uid()
    )
  );

ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS admin_sla_hours INTEGER DEFAULT 24;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS customer_sla_hours INTEGER DEFAULT 48;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS last_action_by TEXT DEFAULT 'customer';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS last_action_at TIMESTAMPTZ DEFAULT now();

CREATE OR REPLACE FUNCTION public.count_pending_negotiations()
RETURNS INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM quote_messages
  WHERE resolution = 'pending'
  AND message_type = 'negotiation';
$$;

GRANT EXECUTE ON FUNCTION public.count_pending_negotiations() TO authenticated;
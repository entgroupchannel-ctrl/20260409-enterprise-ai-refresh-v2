
CREATE TABLE public.chat_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  line_id TEXT,
  interest TEXT,
  conversation_summary TEXT,
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert chat leads" ON public.chat_leads
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Authenticated users can view chat leads" ON public.chat_leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update chat leads" ON public.chat_leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

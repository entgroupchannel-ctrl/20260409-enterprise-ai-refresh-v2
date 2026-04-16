-- Allow anonymous users to see their own chat sessions
CREATE POLICY "Anon can select chat session" ON public.chat_sessions
  FOR SELECT TO anon
  USING (true);

-- Allow anonymous users to read messages
CREATE POLICY "Anon can read chat messages" ON public.chat_messages
  FOR SELECT TO anon
  USING (true);

-- Ensure anon can insert into chat_sessions
CREATE POLICY "Anon can create chat session" ON public.chat_sessions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Ensure anon can send chat messages
CREATE POLICY "Anon can send chat message" ON public.chat_messages
  FOR INSERT TO anon
  WITH CHECK (true);
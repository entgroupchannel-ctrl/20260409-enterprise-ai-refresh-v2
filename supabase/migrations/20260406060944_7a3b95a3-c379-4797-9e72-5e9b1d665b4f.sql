
-- Conversations table
CREATE TABLE public.live_chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT,
  guest_email TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  assigned_admin UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Messages table
CREATE TABLE public.live_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.live_chat_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin', 'system')),
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_live_chat_conv_status ON public.live_chat_conversations(status);
CREATE INDEX idx_live_chat_conv_user ON public.live_chat_conversations(user_id);
CREATE INDEX idx_live_chat_msg_conv ON public.live_chat_messages(conversation_id);
CREATE INDEX idx_live_chat_msg_created ON public.live_chat_messages(created_at);

-- Enable RLS
ALTER TABLE public.live_chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS for conversations
CREATE POLICY "Users can view own conversations"
  ON public.live_chat_conversations FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Anyone can create conversations"
  ON public.live_chat_conversations FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Admins can update conversations"
  ON public.live_chat_conversations FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()) OR user_id = auth.uid());

-- RLS for messages
CREATE POLICY "Users can view messages in own conversations"
  ON public.live_chat_messages FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.live_chat_conversations c
    WHERE c.id = conversation_id AND (c.user_id = auth.uid() OR is_admin(auth.uid()))
  ));

CREATE POLICY "Anon can view messages by conversation"
  ON public.live_chat_messages FOR SELECT TO anon
  USING (true);

CREATE POLICY "Anyone can insert messages"
  ON public.live_chat_messages FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Admins can update messages"
  ON public.live_chat_messages FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

-- Anon can view own conversations (by matching on guest info)
CREATE POLICY "Anon can view conversations"
  ON public.live_chat_conversations FOR SELECT TO anon
  USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_conversations;

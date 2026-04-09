
-- Create storage bucket for business cards
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('business-cards', 'business-cards', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']);

-- Storage policies: authenticated users can upload their own cards
CREATE POLICY "Users can upload their own business cards"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'business-cards' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can view their own cards
CREATE POLICY "Users can view their own business cards"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'business-cards' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Admins can view all cards
CREATE POLICY "Admins can view all business cards"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'business-cards' AND public.is_admin(auth.uid()));

-- Create business_cards table
CREATE TABLE public.business_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  extracted_data JSONB,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  position TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.business_cards ENABLE ROW LEVEL SECURITY;

-- Users can see their own cards
CREATE POLICY "Users can view own business cards"
ON public.business_cards FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own cards
CREATE POLICY "Users can insert own business cards"
ON public.business_cards FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Admins can view all
CREATE POLICY "Admins can view all business cards"
ON public.business_cards FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

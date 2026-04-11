-- Migration 2: Extend users table for profile + signature

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS position TEXT,
  ADD COLUMN IF NOT EXISTS signature_url TEXT,
  ADD COLUMN IF NOT EXISTS line_id TEXT,
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS employee_code TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS show_signature_on_quotes BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_signature_on_orders BOOLEAN DEFAULT TRUE;

-- Update users_update_own policy to prevent role self-change
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.users WHERE id = auth.uid())
  );

-- Migration 3: Storage buckets

-- Avatars (public, 2MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 'avatars', TRUE, 2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Signatures (public for PDF display, 1MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'signatures', 'signatures', TRUE, 1048576,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Company assets (public, 5MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-assets', 'company-assets', TRUE, 5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Avatars
CREATE POLICY "avatars_upload_own" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_update_own" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars_delete_own" ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars_read_public" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Storage RLS: Signatures
CREATE POLICY "signatures_upload_own" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'signatures'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "signatures_update_own" ON storage.objects FOR UPDATE
  USING (bucket_id = 'signatures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "signatures_delete_own" ON storage.objects FOR DELETE
  USING (bucket_id = 'signatures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "signatures_read_auth" ON storage.objects FOR SELECT
  USING (bucket_id = 'signatures' AND auth.uid() IS NOT NULL);

-- Storage RLS: Company assets (admin manage, public read)
CREATE POLICY "company_assets_admin_manage" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-assets'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "company_assets_admin_update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'company-assets'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "company_assets_admin_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'company-assets'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "company_assets_read_all" ON storage.objects FOR SELECT
  USING (bucket_id = 'company-assets');
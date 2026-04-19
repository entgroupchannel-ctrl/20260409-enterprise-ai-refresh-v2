-- Create public bucket for quote PDFs attached in emails
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('quote-pdfs', 'quote-pdfs', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 10485760, allowed_mime_types = ARRAY['application/pdf'];

-- Public read access (so email recipients can download without auth)
CREATE POLICY "Public can read quote PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'quote-pdfs');

-- Authenticated users (admins/staff) can upload
CREATE POLICY "Authenticated can upload quote PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'quote-pdfs');

-- Authenticated users can update/replace
CREATE POLICY "Authenticated can update quote PDFs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'quote-pdfs');
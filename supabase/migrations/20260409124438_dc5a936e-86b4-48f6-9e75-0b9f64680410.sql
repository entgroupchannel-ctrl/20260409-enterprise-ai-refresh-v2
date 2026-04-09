
-- Create storage bucket for quote files (PO uploads, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('quote-files', 'quote-files', true, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to quote-files bucket
CREATE POLICY "Authenticated users can upload quote files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'quote-files');

-- Allow authenticated users to read quote files
CREATE POLICY "Authenticated users can read quote files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'quote-files');

-- Allow public read for quote files (since bucket is public)
CREATE POLICY "Public can read quote files"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'quote-files');

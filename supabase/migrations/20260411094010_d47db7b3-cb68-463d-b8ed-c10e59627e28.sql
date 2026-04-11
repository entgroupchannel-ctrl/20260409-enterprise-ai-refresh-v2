-- Create storage bucket for RFQ file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'quote-attachments',
  'quote-attachments',
  false,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload their own files
CREATE POLICY "Users can upload quote attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quote-attachments' AND auth.uid() IS NOT NULL);

-- Users can view their own uploads, admins can view all
CREATE POLICY "Users can view own quote attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'quote-attachments' AND auth.uid() IS NOT NULL);

-- Admins can delete
CREATE POLICY "Admins can delete quote attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'quote-attachments' AND EXISTS (
  SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'sales')
));
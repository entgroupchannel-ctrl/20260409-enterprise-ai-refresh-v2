
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'datasheets',
  'datasheets',
  TRUE,
  52428800,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "datasheets_public_read" ON storage.objects;
CREATE POLICY "datasheets_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'datasheets');

DROP POLICY IF EXISTS "datasheets_admin_insert" ON storage.objects;
CREATE POLICY "datasheets_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'datasheets'
    AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "datasheets_admin_update" ON storage.objects;
CREATE POLICY "datasheets_admin_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'datasheets'
    AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "datasheets_admin_delete" ON storage.objects;
CREATE POLICY "datasheets_admin_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'datasheets'
    AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

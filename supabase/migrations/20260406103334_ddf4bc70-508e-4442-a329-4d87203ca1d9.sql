
-- PO (Purchase Order) Upload System
-- Add PO columns to quote_requests
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS po_file_url TEXT,
  ADD COLUMN IF NOT EXISTS po_file_name TEXT,
  ADD COLUMN IF NOT EXISTS po_number TEXT,
  ADD COLUMN IF NOT EXISTS po_uploaded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS po_uploaded_by UUID,
  ADD COLUMN IF NOT EXISTS po_notes TEXT,
  ADD COLUMN IF NOT EXISTS po_status TEXT DEFAULT NULL;

-- Create storage bucket for PO files (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'purchase-orders',
  'purchase-orders',
  false,
  20971520,
  ARRAY['application/pdf','image/png','image/jpeg','image/gif',
        'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload own PO"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'purchase-orders');

CREATE POLICY "Users can read own PO"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'purchase-orders'
    AND (
      public.is_admin(auth.uid())
      OR (storage.foldername(name))[1] = auth.uid()::text
    )
  );

CREATE POLICY "Admins can manage PO files"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'purchase-orders' AND public.is_admin(auth.uid()));

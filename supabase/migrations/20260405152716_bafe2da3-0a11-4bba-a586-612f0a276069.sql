CREATE TABLE IF NOT EXISTS public.document_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  product_model TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doc_library_type ON document_library(document_type);
CREATE INDEX IF NOT EXISTS idx_doc_library_public ON document_library(is_public);

ALTER TABLE document_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage document library"
  ON document_library FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view public documents"
  ON document_library FOR SELECT TO authenticated
  USING (is_public = true);
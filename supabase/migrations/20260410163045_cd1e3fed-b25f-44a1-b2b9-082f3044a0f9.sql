
CREATE TABLE public.product_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  file_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_files_product ON product_files(product_id);
CREATE INDEX idx_product_files_type ON product_files(file_type);
CREATE INDEX idx_product_files_order ON product_files(product_id, display_order);

ALTER TABLE product_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product files"
  ON product_files FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage product files"
  ON product_files FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin', 'sales'))
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'sales'));

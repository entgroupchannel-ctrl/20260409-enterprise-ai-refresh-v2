CREATE TABLE IF NOT EXISTS public.product_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL UNIQUE,
  name_th TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  base_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  specs JSONB DEFAULT '{}'::jsonb,
  configurable_options JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  min_qty INTEGER DEFAULT 1,
  lead_days INTEGER DEFAULT 7,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_catalog_model ON product_catalog(model);
CREATE INDEX IF NOT EXISTS idx_product_catalog_category ON product_catalog(category);
CREATE INDEX IF NOT EXISTS idx_product_catalog_active ON product_catalog(is_active);

ALTER TABLE product_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON product_catalog FOR SELECT TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage product catalog"
  ON product_catalog FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TABLE IF NOT EXISTS public.quote_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  product_id UUID REFERENCES product_catalog(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  category TEXT,
  qty INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  line_total NUMERIC(12,2) GENERATED ALWAYS AS (
    qty * unit_price * (1 - discount_percent / 100)
  ) STORED,
  custom_specs JSONB DEFAULT '{}'::jsonb,
  admin_notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_line_items_quote ON quote_line_items(quote_id);

ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quote line items"
  ON quote_line_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quote_requests q
      WHERE q.id = quote_line_items.quote_id
      AND (q.user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

CREATE POLICY "Admins can manage quote line items"
  ON quote_line_items FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

ALTER TABLE public.quote_requests
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS grand_total NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valid_until DATE,
  ADD COLUMN IF NOT EXISTS payment_terms TEXT,
  ADD COLUMN IF NOT EXISTS delivery_terms TEXT,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS quote_number TEXT,
  ADD COLUMN IF NOT EXISTS customer_response TEXT CHECK (customer_response IN ('accepted', 'negotiating', 'rejected', NULL));

CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM quote_requests
  WHERE created_at >= date_trunc('year', now());
  NEW.quote_number := 'Q-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_quote_number ON quote_requests;
CREATE TRIGGER trg_quote_number
  BEFORE INSERT ON quote_requests
  FOR EACH ROW
  WHEN (NEW.quote_number IS NULL)
  EXECUTE FUNCTION public.generate_quote_number();
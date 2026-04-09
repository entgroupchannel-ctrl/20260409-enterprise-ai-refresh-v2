
-- ============================================================================
-- Products Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text UNIQUE,
  sku text UNIQUE NOT NULL,
  model text NOT NULL,
  series text DEFAULT 'GT Series',
  name text NOT NULL,
  description text,
  category text,
  cpu text,
  ram_gb integer,
  storage_gb integer,
  storage_type text,
  has_wifi boolean DEFAULT false,
  has_4g boolean DEFAULT false,
  os text,
  form_factor text,
  unit_price numeric(10,2) NOT NULL,
  unit_price_vat numeric(10,2),
  buy_price numeric(10,2),
  buy_price_vat numeric(10,2),
  stock_status text DEFAULT 'available',
  stock_quantity integer DEFAULT 0,
  min_stock_level integer DEFAULT 0,
  max_stock_level integer,
  reorder_point integer,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  slug text UNIQUE NOT NULL,
  image_url text,
  thumbnail_url text,
  gallery_urls text[],
  tags text[],
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(model, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(name, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(description, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(cpu, '')), 'D')
  ) STORED
);

-- Indexes
CREATE INDEX idx_products_model ON public.products(model);
CREATE INDEX idx_products_series ON public.products(series);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_stock_status ON public.products(stock_status);
CREATE INDEX idx_products_search ON public.products USING gin(search_vector);
CREATE INDEX idx_products_price ON public.products(unit_price) WHERE unit_price > 0;
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_tags ON public.products USING gin(tags);

-- Updated_at trigger
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'sales'));

CREATE POLICY "Admin can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin', 'sales'));

CREATE POLICY "Admin can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin', 'sales'));

-- ============================================================================
-- Product Categories
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES public.product_categories(id) ON DELETE CASCADE,
  icon text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_categories_slug ON public.product_categories(slug);
CREATE INDEX idx_categories_parent ON public.product_categories(parent_id);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON public.product_categories FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage categories"
  ON public.product_categories FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin', 'sales'))
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'sales'));

-- Seed categories
INSERT INTO public.product_categories (name, slug, description, sort_order) VALUES
('GT Series', 'gt-series', 'Industrial Mini PC GT Series', 1),
('Box PC', 'box-pc', 'Industrial Box PC', 2),
('AIO Desktop', 'aio-desktop', 'All-in-One Desktop', 3),
('Panel PC', 'panel-pc', 'Industrial Panel PC', 4),
('Mini PC', 'mini-pc', 'Compact Mini PC', 5),
('Rugged Notebook', 'rugged-notebook', 'Rugged Mobile Computers', 6),
('Rugged Tablet', 'rugged-tablet', 'Industrial Tablets', 7);

-- ============================================================================
-- Product Variants
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_name text NOT NULL,
  sku text UNIQUE NOT NULL,
  cpu text,
  ram_gb integer,
  storage_gb integer,
  storage_type text,
  has_wifi boolean DEFAULT false,
  has_4g boolean DEFAULT false,
  os text,
  unit_price numeric(10,2) NOT NULL,
  unit_price_vat numeric(10,2),
  stock_quantity integer DEFAULT 0,
  stock_status text DEFAULT 'available',
  is_active boolean DEFAULT true,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_variants_sku ON public.product_variants(sku);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active variants"
  ON public.product_variants FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can view all variants"
  ON public.product_variants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage variants"
  ON public.product_variants FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin', 'sales'))
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'sales'));

-- ============================================================================
-- Product Tags
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text,
  icon text,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON public.product_tags FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage tags"
  ON public.product_tags FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin', 'sales'))
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'sales'));

-- Seed tags
INSERT INTO public.product_tags (name, slug, color) VALUES
('WiFi', 'wifi', '#3b82f6'),
('4G/5G', '4g-5g', '#10b981'),
('GPIO', 'gpio', '#8b5cf6'),
('Industrial Grade', 'industrial-grade', '#f59e0b'),
('Fanless', 'fanless', '#06b6d4'),
('Wide Temperature', 'wide-temp', '#ef4444'),
('IoT Ready', 'iot-ready', '#14b8a6'),
('VESA Mount', 'vesa-mount', '#6366f1');

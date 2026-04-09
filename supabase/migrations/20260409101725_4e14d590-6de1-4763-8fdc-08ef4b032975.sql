
-- ========== user_profiles ==========
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Company Info
  company_name TEXT,
  company_tax_id TEXT,
  company_address TEXT,
  company_phone TEXT,

  -- Contact Person
  contact_name TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_line TEXT,

  -- Billing Address
  billing_address TEXT,
  billing_district TEXT,
  billing_city TEXT,
  billing_province TEXT,
  billing_postal_code TEXT,
  billing_country TEXT DEFAULT 'ไทย',

  -- Shipping Address
  shipping_same_as_billing BOOLEAN DEFAULT TRUE,
  shipping_address TEXT,
  shipping_district TEXT,
  shipping_city TEXT,
  shipping_province TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT DEFAULT 'ไทย',

  -- Preferences
  payment_terms TEXT,
  delivery_method TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id)
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all profiles"
ON public.user_profiles FOR SELECT
USING (public.get_user_role(auth.uid()) IN ('admin', 'sales'));

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ========== cart_items ==========
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  product_model TEXT NOT NULL,
  product_name TEXT,
  product_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  estimated_price DECIMAL(12,2),

  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cart"
ON public.cart_items FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

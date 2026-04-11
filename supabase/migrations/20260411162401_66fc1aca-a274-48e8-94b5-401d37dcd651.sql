-- Migration 1: company_settings singleton table

CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Thai info
  name_th TEXT NOT NULL DEFAULT 'บริษัท อี เอ็น ที กรุ๊ป จำกัด',
  address_th TEXT,

  -- English info
  name_en TEXT,
  address_en TEXT,

  -- Tax & registration
  tax_id TEXT,
  vat_registered BOOLEAN DEFAULT TRUE,
  branch_type TEXT DEFAULT 'head_office',
  branch_code TEXT,
  branch_name TEXT,

  -- Contact
  phone TEXT,
  fax TEXT,
  email TEXT,
  website TEXT,

  -- Banking
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  bank_branch TEXT,
  promptpay_id TEXT,

  -- Branding
  logo_url TEXT,
  signature_url TEXT,
  letterhead_url TEXT,

  -- Document defaults
  default_payment_terms TEXT,
  default_delivery_terms TEXT,
  default_warranty_terms TEXT,
  default_quote_validity_days INT DEFAULT 30,
  default_vat_percent NUMERIC(5,2) DEFAULT 7,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID
);

-- Singleton constraint: only one active row
CREATE UNIQUE INDEX idx_company_settings_singleton
  ON public.company_settings(is_active) WHERE is_active = TRUE;

-- Enable RLS
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read
CREATE POLICY "company_settings_read_all" ON public.company_settings
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admin can update
CREATE POLICY "company_settings_admin_update" ON public.company_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admin can insert
CREATE POLICY "company_settings_admin_insert" ON public.company_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-update updated_at trigger
CREATE OR REPLACE TRIGGER trg_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default row
INSERT INTO public.company_settings (
  name_th, name_en, tax_id, vat_registered, branch_type,
  address_th, phone, email, website
) VALUES (
  'บริษัท อี เอ็น ที กรุ๊ป จำกัด',
  'ENT Group Co., Ltd.',
  '0135558013167',
  TRUE,
  'head_office',
  '70/5 หมู่บ้าน เมโทร บิซทาวน์ ซอยแจ้งวัฒนะ 2 หมู่ที่ 4 ต.คลองพระอุดม อ.ปากเกร็ด จ.นนทบุรี 11120',
  '02-001-8800',
  'info@ent.co.th',
  'https://ent-vision-v2.lovable.app'
) ON CONFLICT DO NOTHING;
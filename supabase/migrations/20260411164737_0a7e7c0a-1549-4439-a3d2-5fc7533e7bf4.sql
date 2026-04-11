
-- ============================================================
-- STEP 1: Create company_bank_accounts table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.company_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.company_settings(id) ON DELETE CASCADE,
  bank_code TEXT,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT DEFAULT 'savings'
    CHECK (account_type IN ('savings', 'current', 'fixed')),
  branch TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  swift_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bank_accounts_company ON public.company_bank_accounts(company_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_default 
  ON public.company_bank_accounts(company_id, is_default) 
  WHERE is_default = TRUE;
CREATE INDEX IF NOT EXISTS idx_bank_accounts_active 
  ON public.company_bank_accounts(company_id, is_active) 
  WHERE is_active = TRUE;

-- Auto-update updated_at
DROP TRIGGER IF EXISTS trg_bank_accounts_updated_at ON public.company_bank_accounts;
CREATE TRIGGER trg_bank_accounts_updated_at
  BEFORE UPDATE ON public.company_bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.company_bank_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "bank_accounts_read_all" 
  ON public.company_bank_accounts FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "bank_accounts_admin_insert" 
  ON public.company_bank_accounts FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "bank_accounts_admin_update" 
  ON public.company_bank_accounts FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "bank_accounts_admin_delete" 
  ON public.company_bank_accounts FOR DELETE 
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Singleton constraint: only ONE default per company
CREATE UNIQUE INDEX idx_bank_accounts_one_default 
  ON public.company_bank_accounts(company_id) 
  WHERE is_default = TRUE;

COMMENT ON TABLE public.company_bank_accounts 
  IS 'บัญชีธนาคารของบริษัท สำหรับแสดงบน PDF ใบเสนอราคา/Invoice';


-- ============================================================
-- STEP 2: UPDATE company_settings (ENT Group real data)
-- ============================================================

UPDATE public.company_settings
SET 
  name_th = 'บริษัท อี เอ็น ที กรุ๊ป จำกัด',
  address_th = 'เลขที่ 70/5 หมู่บ้าน เมโทร บิซทาวน์ แจ้งวัฒนะ 2 หมู่ที่ 4 ตำบลคลองพระอุดม อำเภอปากเกร็ด จังหวัดนนทบุรี 11120',
  name_en = 'ENT GROUP Co., Ltd.',
  address_en = '70/5 Metro Biz Town Chaengwattana 2 Village Moo 4, Khlong Phra Udom Sub-district, Pak Kret District, Nonthaburi Province 11120',
  tax_id = '0135558013167',
  vat_registered = TRUE,
  branch_type = 'head_office',
  phone = '02-045-6104',
  fax = '02-045-6105',
  email = 'info@entgroup.co.th',
  website = 'www.entgroup.co.th',
  default_vat_percent = 7,
  default_quote_validity_days = 30,
  default_payment_terms = 'มัดจำ 50% ที่เหลือชำระก่อนการส่งมอบสินค้า',
  default_delivery_terms = 'จัดส่งฟรีในเขตกรุงเทพและปริมณฑล ภายใน 5-7 วันทำการ',
  default_warranty_terms = 'รับประกันสินค้า 1 ปี นับจากวันส่งมอบ (ไม่รวมอุปกรณ์สิ้นเปลือง)',
  updated_at = NOW()
WHERE is_active = TRUE;


-- ============================================================
-- STEP 3: INSERT bank accounts (2 บัญชีหลัก)
-- ============================================================

DO $$
DECLARE
  v_company_id UUID;
BEGIN
  SELECT id INTO v_company_id 
  FROM public.company_settings 
  WHERE is_active = TRUE 
  LIMIT 1;
  
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'No active company_settings row found.';
  END IF;
  
  DELETE FROM public.company_bank_accounts WHERE company_id = v_company_id;
  
  -- Bank #1: กสิกรไทย (DEFAULT)
  INSERT INTO public.company_bank_accounts (
    company_id, bank_code, bank_name, account_number, account_name, 
    account_type, branch, is_default, is_active, display_order
  ) VALUES (
    v_company_id,
    'kbank',
    'ธนาคารกสิกรไทย',
    '841-2-05851-9',
    'บริษัท อี เอ็น ที กรุ๊ป จำกัด',
    'savings',
    'สาขาบางเดื่อ ปทุมธานี',
    TRUE,
    TRUE,
    1
  );
  
  -- Bank #2: ไทยพาณิชย์
  INSERT INTO public.company_bank_accounts (
    company_id, bank_code, bank_name, account_number, account_name,
    account_type, branch, is_default, is_active, display_order
  ) VALUES (
    v_company_id,
    'scb',
    'ธนาคารไทยพาณิชย์',
    '406-8-17747-1',
    'บริษัท อี เอ็น ที กรุ๊ป จำกัด',
    'savings',
    'สาขาบางเดื่อ ปทุมธานี',
    FALSE,
    TRUE,
    2
  );
END $$;


-- ============================================================
-- STEP 4: UPDATE user profile (therdpoom)
-- ============================================================

UPDATE public.users
SET 
  full_name = 'เทิดภูมิ พานิชย์',
  phone = '081-449-7542',
  position = 'เจ้าของกิจการ',
  department = 'บริหาร',
  updated_at = NOW()
WHERE email = 'therdpoom@entgroup.co.th';

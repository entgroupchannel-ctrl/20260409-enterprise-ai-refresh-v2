-- Phase 26: Enhanced Product Catalog + Professional Quotation

-- Step 1: Add more columns to product_catalog
ALTER TABLE product_catalog
  ADD COLUMN IF NOT EXISTS unit_label TEXT DEFAULT 'เครื่อง',
  ADD COLUMN IF NOT EXISTS warranty_terms TEXT DEFAULT '1 ปี Carry-in',
  ADD COLUMN IF NOT EXISTS brand TEXT;

-- Step 2: Company settings table (for quotation header/footer)
CREATE TABLE IF NOT EXISTS public.company_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  company_name_th TEXT DEFAULT 'บริษัท อี เอ็น ที กรุ๊ป จำกัด',
  company_name_en TEXT DEFAULT 'ENT Group Co., Ltd.',
  branch TEXT DEFAULT 'สำนักงานใหญ่',
  address_line1 TEXT DEFAULT 'เลขที่ 70/5',
  address_line2 TEXT DEFAULT 'หมู่บ้าน เมทโทร บิซทาวน์ แจ้งวัฒนะ 2 หมู่ 4',
  district TEXT DEFAULT 'ตำบลคลองพระอุดม อำเภอปากเกร็ด',
  province TEXT DEFAULT 'จังหวัดนนทบุรี 11120',
  tax_id TEXT DEFAULT '0135558013167',
  phone TEXT DEFAULT '02-045-6104',
  mobile TEXT DEFAULT '095-7391053, 082-2497922',
  fax TEXT DEFAULT '02-045-6105',
  website TEXT DEFAULT 'www.entgroup.co.th',
  email TEXT DEFAULT 'sales@entgroup.co.th',
  logo_url TEXT DEFAULT '/logo-entgroup.avif',
  bank_accounts JSONB DEFAULT '[
    {"bank":"ธนาคารไทยพาณิชย์","branch":"สาขาบางบัวทอง (ปทุมธานี)","type":"ออมทรัพย์","number":"406-817747-1"},
    {"bank":"ธนาคารกสิกรไทย","branch":"สาขา ปทุมธานี","type":"ออมทรัพย์","number":"841-2-05851-9"}
  ]'::jsonb,
  quote_terms TEXT DEFAULT '1. กรณีสินค้าหมดสต็อก รอสินค้า By Order 30-45 วัน หรือมากกว่านั้น ขึ้นอยู่กับจำนวนสินค้าที่สั่ง
2. กรณีลูกค้าสั่งซื้อสินค้า ลูกค้าต้องชำระเงินก่อนการสั่งซื้อ 70% หรือ 100% เต็มเท่านั้น
3. สินค้าเป็น By Order หลังจากสินค้าพร้อมส่งแล้วลูกค้าชำระเงินยอดที่เหลือทั้งหมด (ก่อนการจัดส่งสินค้าให้ลูกค้า)
4. สินค้าพร้อมส่ง ลูกค้าต้องชำระเงินเต็มจำนวน 100% ก่อนการจัดส่งสินค้าเท่านั้น
5. เอกสารใบกำกับภาษีและใบเสร็จรับเงินจัดส่งพร้อมกับสินค้าในส่วนที่โอนที่เหลือ หรือ ชำระเต็มจำนวน 100%
6. สินค้าที่เป็น By Order จากโรงงานต่างประเทศ กรณีถ้าลูกค้ามัดจำเงิน 100% (มีส่วนลดเพิ่มอีก 1% จากยอดสินค้าที่ลดแล้วให้อีก) แต่ถ้าสินค้ามีพร้อมส่งจะไม่ได้ลด 1% (ทำการลดราคาให้ตามปกติ)
7. ของแถม ไม่สามารถใช้เป็นส่วนลดเงินสดได้
8. การพิจารณาเสนอเงื่อนไขการขายหรือโปรโมชั่นจากบริษัทฯ ถือเป็นอันสิ้นสุด
9. ใบเสนอราคายืนราคา 30 วันเท่านั้น นับตั้งแต่วันที่ลูกค้าขอราคา
10. ลูกค้าเป็นผู้รับผิดชอบค่าใช้จ่าย ค่าธรรมเนียมในการโอนเงินเท่านั้น',
  vat_percent NUMERIC(5,2) DEFAULT 7.00,
  withholding_tax_percent NUMERIC(5,2) DEFAULT 3.00,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Initialize default
INSERT INTO company_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read company settings"
  ON company_settings FOR SELECT TO public
  USING (true);

CREATE POLICY "Admins can update company settings"
  ON company_settings FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- Step 3: Add VAT fields to quote_requests
ALTER TABLE quote_requests
  ADD COLUMN IF NOT EXISTS vat_amount NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS withholding_tax NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS include_vat BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS include_withholding_tax BOOLEAN DEFAULT false;
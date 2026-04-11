-- Quote Term Templates for standardized terms
CREATE TABLE IF NOT EXISTS public.quote_term_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type TEXT NOT NULL CHECK (template_type IN ('payment','delivery','warranty','notes')),
  label TEXT NOT NULL,
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_quote_term_templates_type ON public.quote_term_templates(template_type, sort_order);

ALTER TABLE public.quote_term_templates ENABLE ROW LEVEL SECURITY;

-- Admin/Sales can manage templates
CREATE POLICY "term_templates_admin" ON public.quote_term_templates
  FOR ALL TO authenticated
  USING (get_user_role(auth.uid()) IN ('admin', 'sales'))
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'sales'));

-- Seed common defaults
INSERT INTO public.quote_term_templates (template_type, label, content, is_default, sort_order) VALUES
  ('payment', 'เงินสด/โอน/เช็ค', 'เงินสด / โอน / เช็ค ชำระเต็มจำนวนก่อนการส่งมอบสินค้า', true, 1),
  ('payment', 'เครดิต 30 วัน', 'เครดิต 30 วัน นับจากวันที่ในใบแจ้งหนี้', false, 2),
  ('payment', 'เครดิต 60 วัน', 'เครดิต 60 วัน นับจากวันที่ในใบแจ้งหนี้', false, 3),
  ('payment', 'มัดจำ 50% ที่เหลือก่อนส่งของ', 'มัดจำ 50% เมื่อยืนยัน PO ส่วนที่เหลือชำระก่อนการส่งมอบสินค้า', false, 4),
  
  ('delivery', 'กรุงเทพและปริมณฑล — ฟรี', 'จัดส่งฟรีในเขตกรุงเทพและปริมณฑล ภายใน 3-5 วันทำการ', true, 1),
  ('delivery', 'ต่างจังหวัด — คิดตามจริง', 'ต่างจังหวัด คิดค่าจัดส่งตามจริง ภายใน 5-7 วันทำการ', false, 2),
  ('delivery', 'Ex-Works', 'Ex-Works — ลูกค้ามารับสินค้าที่บริษัท', false, 3),
  ('delivery', 'ด่วน 1-2 วัน', 'จัดส่งด่วนภายใน 1-2 วันทำการ (มีค่าจัดส่งด่วนเพิ่มเติม)', false, 4),
  
  ('warranty', 'รับประกัน 1 ปี', 'รับประกันสินค้า 1 ปี นับจากวันที่ส่งมอบ (ไม่รวมอุปกรณ์สิ้นเปลือง)', true, 1),
  ('warranty', 'รับประกัน 2 ปี', 'รับประกันสินค้า 2 ปี นับจากวันที่ส่งมอบ', false, 2),
  ('warranty', 'รับประกัน 3 ปี (Premium)', 'รับประกันสินค้า 3 ปี พร้อมบริการ On-site ภายในเขตกรุงเทพและปริมณฑล', false, 3),
  ('warranty', 'ไม่มีการรับประกัน', 'สินค้ามือสอง / Clearance — ไม่มีการรับประกัน', false, 4),
  
  ('notes', 'มาตรฐาน', 'ราคาข้างต้นรวมภาษีมูลค่าเพิ่ม 7% แล้ว ใบเสนอราคานี้เป็นราคาพิเศษสำหรับลูกค้า', true, 1),
  ('notes', 'ราคาไม่รวม VAT', 'ราคาข้างต้นยังไม่รวมภาษีมูลค่าเพิ่ม 7%', false, 2);
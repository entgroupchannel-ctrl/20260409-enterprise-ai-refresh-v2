-- Import GB Series products
INSERT INTO products (sku, model, series, name, description, category, cpu, tags, unit_price, unit_price_vat, is_active, is_featured, stock_status, slug, sort_order, warranty_months, warranty_type)
VALUES
('gb1000-base', 'GB1000', 'GB Series',
 'Industrial PC GB1000 — Ultra-Compact',
 'ขนาดเล็กที่สุดในซีรีส์ เพียง 21×18×5.2 cm เล็กกว่า GB5000 ถึง 60%. Fanless Silent, 6 COM ports (RS232/422/485), Dual Display (HDMI+VGA), 4 USB, 2x Gigabit LAN. DIN Rail/Wall Mount.',
 'Industrial PC', 'Intel Celeron J1900 / Core i3 / i5',
 ARRAY['GB Series','GB1000','Fanless','Ultra-Compact','DIN Rail','NEW'],
 0, 0, true, true, 'available', 'gb1000', 200, 12, 'carry_in'),

('gb2000-base', 'GB2000', 'GB Series',
 'Industrial PC GB2000 — Network Professional 2.5G',
 '2x 2.5G LAN (Intel i225V), 6 COM (RS422/RS485), GPIO 7in+7out, SIM slot 3G/4G, PS/2 + LPT legacy. เหมาะธุรกิจที่ต้องการอัปเกรดระบบเก่าให้ทันสมัย.',
 'Industrial PC', 'Intel Core i5/i7',
 ARRAY['GB Series','GB2000','2.5G LAN','GPIO','4G','Legacy IO'],
 0, 0, true, true, 'available', 'gb2000', 210, 12, 'carry_in'),

('gb4000v1-base', 'GB4000 v1', 'GB Series',
 'Industrial PC GB4000 v1 — Standard Edition',
 'Industrial PC เกรดสูง รองรับ CPU Intel ได้หลายรุ่น. มี COM ports หลายช่อง, USB 3.0, Dual LAN, Display หลายพอร์ต.',
 'Industrial PC', 'Intel Core i5 / i7',
 ARRAY['GB Series','GB4000'],
 0, 0, true, false, 'available', 'gb4000-v1', 220, 12, 'carry_in'),

('gb4000v2-base', 'GB4000 v2', 'GB Series',
 'Industrial PC GB4000 v2 — Enhanced Edition',
 'รุ่นอัปเกรดของ GB4000 เพิ่มช่องต่อและ performance สูงขึ้น รองรับ DDR4 RAM สูงสุด. เหมาะงาน HMI, SCADA, Machine Control.',
 'Industrial PC', 'Intel Core i5 / i7 (ใหม่กว่า)',
 ARRAY['GB Series','GB4000','v2','DDR4'],
 0, 0, true, false, 'available', 'gb4000-v2', 225, 12, 'carry_in'),

('gb5000-base', 'GB5000', 'GB Series',
 'Industrial PC GB5000 — Full-Size Performance',
 'Industrial PC ขนาดใหญ่ สมรรถนะสูง รองรับ Expansion Card, PCIe Slot, Storage หลายช่อง. เหมาะงาน Server Edge, Vision System, Data Acquisition.',
 'Industrial PC', 'Intel Core i7 / i9',
 ARRAY['GB Series','GB5000','High Performance','PCIe'],
 0, 0, true, true, 'available', 'gb5000', 230, 12, 'carry_in')

ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description,
  category = EXCLUDED.category, cpu = EXCLUDED.cpu, tags = EXCLUDED.tags,
  is_featured = EXCLUDED.is_featured, sort_order = EXCLUDED.sort_order,
  series = EXCLUDED.series;
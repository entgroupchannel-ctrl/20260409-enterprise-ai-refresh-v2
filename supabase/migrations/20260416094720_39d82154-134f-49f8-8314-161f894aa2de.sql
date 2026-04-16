
-- Deactivate old duplicate
UPDATE products SET is_active = false WHERE id = 'a032e83f-7f13-4207-a113-1764b9088d2e';

-- Update base GT2000 record
UPDATE products SET
  unit_price = 15990,
  unit_price_vat = 17109.30,
  cpu = 'Intel Celeron 1037U',
  ram_gb = 4,
  storage_gb = 128,
  storage_type = 'SSD',
  has_wifi = true,
  has_4g = false,
  description = 'Industrial Fanless PC ยอดนิยม — โครงอลูมิเนียมแข็งแรง Fanless 0 dB ทำงาน 24/7 รองรับ Windows XP ขนาดกะทัดรัด 23.4×15×4.8 cm น้ำหนัก 1.5 kg พร้อม 8 USB (4×USB3.0 + 4×USB2.0), 4 COM (RS232), Dual GbE LAN, HDMI+VGA Dual Display, ประหยัดไฟเพียง 15W เหมาะสำหรับโรงงาน ระบบ Kiosk และ Thin Client',
  gallery_urls = ARRAY[
    '/images/wix/005637_58feaede6057451aa5fd7afe6ec6f880_87e3b32b.jpg',
    '/images/wix/005637_ab944bafb9764a7c9fec363c2e2c8ef5_2db86367.jpg',
    '/images/wix/005637_bade0d66426d44dea1328e1b2eb149b1_eef91dfa.jpg',
    '/images/wix/005637_9a8e5e98c73b46a8981bfbd6ef8f682c_b918e0a4.jpg',
    '/images/wix/005637_78842837709848ea983945436f0822ee_591fff34.jpg',
    '/images/wix/3e5003_6bf58ba61ae245ea82f96cb2171fb9b7_16926587.jpg',
    '/images/wix/0597a3_2f4f2a02ac1542fb8ce44f6b78f5c5f9_98c59f5e.png',
    '/images/wix/0597a3_126df8ab2d554a9a8b4a6074fe4f7647_c1e10423.png',
    '/images/wix/0597a3_dac94b90d7444622918e2fe4f69de597_c78e860e.png'
  ],
  tags = ARRAY['best-seller', 'fanless', 'windows-xp', 'industrial'],
  is_active = true,
  updated_at = now()
WHERE id = '07cf1ac9-956c-4381-8dd4-d0d9614b1eb8';

-- Insert GT2000 variants
INSERT INTO products (sku, slug, model, name, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, unit_price, unit_price_vat, description, category, series, form_factor, warranty_months, warranty_type, is_active, tags) VALUES
('gt2000-cel1037u-4-256', 'gt2000-cel1037u-4gb-256gb', 'GT2000', 'GT2000 Celeron 1037U 4GB 256GB', 'Intel Celeron 1037U', 4, 256, 'SSD', true, false, 15990, 17109.30, 'Industrial Fanless PC ยอดนิยม 8 USB + 4 COM รองรับ Windows XP', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['best-seller','fanless','windows-xp']),
('gt2000-cel1037u-8-128', 'gt2000-cel1037u-8gb-128gb', 'GT2000', 'GT2000 Celeron 1037U 8GB 128GB', 'Intel Celeron 1037U', 8, 128, 'SSD', true, false, 15990, 17109.30, 'Industrial Fanless PC ยอดนิยม 8 USB + 4 COM รองรับ Windows XP', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['best-seller','fanless','windows-xp']),
('gt2000-cel1037u-8-256', 'gt2000-cel1037u-8gb-256gb', 'GT2000', 'GT2000 Celeron 1037U 8GB 256GB', 'Intel Celeron 1037U', 8, 256, 'SSD', true, false, 16990, 18179.30, 'Industrial Fanless PC ยอดนิยม 8 USB + 4 COM รองรับ Windows XP', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['best-seller','fanless','windows-xp']),
('gt2000-i5-3317u-4-128', 'gt2000-i5-3317u-4gb-128gb', 'GT2000', 'GT2000 Core i5-3317U 4GB 128GB', 'Intel Core i5-3317U', 4, 128, 'SSD', true, false, 18990, 20319.30, 'Industrial Fanless PC ยอดนิยม 8 USB + 4 COM รองรับ Windows XP', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['best-seller','fanless','windows-xp']),
('gt2000-i5-3317u-4-256', 'gt2000-i5-3317u-4gb-256gb', 'GT2000', 'GT2000 Core i5-3317U 4GB 256GB', 'Intel Core i5-3317U', 4, 256, 'SSD', true, false, 19990, 21389.30, 'Industrial Fanless PC ยอดนิยม 8 USB + 4 COM รองรับ Windows XP', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['best-seller','fanless','windows-xp']),
('gt2000-i5-3317u-4-512', 'gt2000-i5-3317u-4gb-512gb', 'GT2000', 'GT2000 Core i5-3317U 4GB 512GB', 'Intel Core i5-3317U', 4, 512, 'SSD', true, false, 21990, 23529.30, 'Industrial Fanless PC ยอดนิยม 8 USB + 4 COM รองรับ Windows XP', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['best-seller','fanless','windows-xp']),
('gt2000-i5-3317u-8-128', 'gt2000-i5-3317u-8gb-128gb', 'GT2000', 'GT2000 Core i5-3317U 8GB 128GB', 'Intel Core i5-3317U', 8, 128, 'SSD', true, false, 18990, 20319.30, 'Industrial Fanless PC ยอดนิยม 8 USB + 4 COM รองรับ Windows XP', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['best-seller','fanless','windows-xp']);

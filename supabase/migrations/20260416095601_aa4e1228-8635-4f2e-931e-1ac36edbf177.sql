
-- Deactivate old duplicate
UPDATE products SET is_active = false WHERE id = 'b221e5bf-592e-45c8-b4b8-8526c4ff4965';

-- Update base GT7000 record
UPDATE products SET
  unit_price = 15190,
  unit_price_vat = 16253.30,
  cpu = 'Intel Core i3-7100U',
  ram_gb = 4,
  storage_gb = 128,
  storage_type = 'mSATA SSD',
  has_wifi = true,
  has_4g = false,
  image_url = '/images/gt7000/front.jpg',
  thumbnail_url = '/images/gt7000/front.jpg',
  description = 'Industrial Fanless PC โครง Brushed Aluminum Alloy — 6 COM (RS232/RS485), Micro SIM 4G, VGA+HDMI Dual Display, Dual GbE LAN, USB 3.0+2.0 รวม 6 พอร์ต, mSATA+SATA Dual Storage, Watchdog, ทนร้อน 70°C ทำงาน 24/7 ขนาด 23×17.5×5 cm เหมาะสำหรับโรงงาน POS ร้านอาหาร Kiosk และ Factory Automation',
  gallery_urls = ARRAY[
    '/images/gt7000/main.jpg',
    '/images/gt7000/front.jpg',
    '/images/gt7000/side.jpg',
    '/images/gt7000/angle.jpg',
    '/images/gt7000/rear.jpg',
    '/images/gt7000-wix/cost-saving.png',
    '/images/gt7000-wix/ports-overview.png',
    '/images/gt7000-wix/compact-design.png',
    '/images/gt7000-wix/heatsink.png',
    '/images/gt7000-wix/spec-detail.png'
  ],
  tags = ARRAY['fanless', 'ddr4', '6-com', 'rs485', 'industrial'],
  is_active = true,
  updated_at = now()
WHERE id = '628f9f7d-7675-4e22-888b-10c198bc5f94';

-- Insert GT7000 variants (19 additional)
INSERT INTO products (sku, slug, model, name, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, unit_price, unit_price_vat, image_url, thumbnail_url, description, category, series, form_factor, warranty_months, warranty_type, is_active, tags) VALUES
('gt7000-i3-7100u-4-256', 'gt7000-i3-7100u-4gb-256gb', 'GT7000', 'GT7000 i3-7100U 4GB 256GB', 'Intel Core i3-7100U', 4, 256, 'mSATA SSD', true, false, 16690, 17858.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i3-7100u-8-128', 'gt7000-i3-7100u-8gb-128gb', 'GT7000', 'GT7000 i3-7100U 8GB 128GB', 'Intel Core i3-7100U', 8, 128, 'mSATA SSD', true, false, 16590, 17751.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i3-7100u-8-256', 'gt7000-i3-7100u-8gb-256gb', 'GT7000', 'GT7000 i3-7100U 8GB 256GB', 'Intel Core i3-7100U', 8, 256, 'mSATA SSD', true, false, 17190, 18393.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i3-7100u-8-128-4g', 'gt7000-i3-7100u-8gb-128gb-4g', 'GT7000', 'GT7000 i3-7100U 8GB 128GB 4G RS485', 'Intel Core i3-7100U', 8, 128, 'mSATA SSD', true, true, 19190, 20533.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C พร้อม 4G+RS485', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com','4g','rs485']),
('gt7000-i5-7267u-4-128', 'gt7000-i5-7267u-4gb-128gb', 'GT7000', 'GT7000 i5-7267U 4GB 128GB', 'Intel Core i5-7267U', 4, 128, 'mSATA SSD', true, false, 20290, 21710.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-7267u-4-256', 'gt7000-i5-7267u-4gb-256gb', 'GT7000', 'GT7000 i5-7267U 4GB 256GB', 'Intel Core i5-7267U', 4, 256, 'mSATA SSD', true, false, 20790, 22245.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-7267u-8-128', 'gt7000-i5-7267u-8gb-128gb', 'GT7000', 'GT7000 i5-7267U 8GB 128GB', 'Intel Core i5-7267U', 8, 128, 'mSATA SSD', true, false, 20890, 22352.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-7267u-8-256', 'gt7000-i5-7267u-8gb-256gb', 'GT7000', 'GT7000 i5-7267U 8GB 256GB', 'Intel Core i5-7267U', 8, 256, 'mSATA SSD', true, false, 21390, 22887.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-7267u-8-256-4g', 'gt7000-i5-7267u-8gb-256gb-4g', 'GT7000', 'GT7000 i5-7267U 8GB 256GB 4G', 'Intel Core i5-7267U', 8, 256, 'mSATA SSD', false, true, 23890, 25562.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C พร้อม 4G Module', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com','4g']),
('gt7000-i5-8250u-4-128', 'gt7000-i5-8250u-4gb-128gb', 'GT7000', 'GT7000 i5-8250U 4GB 128GB', 'Intel Core i5-8250U', 4, 128, 'mSATA SSD', true, false, 21090, 22566.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-8250u-4-256', 'gt7000-i5-8250u-4gb-256gb', 'GT7000', 'GT7000 i5-8250U 4GB 256GB', 'Intel Core i5-8250U', 4, 256, 'mSATA SSD', true, false, 21690, 23208.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-8250u-4-512', 'gt7000-i5-8250u-4gb-512gb', 'GT7000', 'GT7000 i5-8250U 4GB 512GB', 'Intel Core i5-8250U', 4, 512, 'mSATA SSD', true, false, 22790, 24385.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-8250u-8-128', 'gt7000-i5-8250u-8gb-128gb', 'GT7000', 'GT7000 i5-8250U 8GB 128GB', 'Intel Core i5-8250U', 8, 128, 'mSATA SSD', true, false, 21490, 22994.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-8250u-8-256', 'gt7000-i5-8250u-8gb-256gb', 'GT7000', 'GT7000 i5-8250U 8GB 256GB', 'Intel Core i5-8250U', 8, 256, 'mSATA SSD', true, false, 22190, 23743.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-8250u-8-256-4g', 'gt7000-i5-8250u-8gb-256gb-4g', 'GT7000', 'GT7000 i5-8250U 8GB 256GB 4G', 'Intel Core i5-8250U', 8, 256, 'mSATA SSD', false, true, 24690, 26418.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C พร้อม 4G Module', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com','4g']),
('gt7000-i5-8250u-8-1000', 'gt7000-i5-8250u-8gb-1tb', 'GT7000', 'GT7000 i5-8250U 8GB 1TB', 'Intel Core i5-8250U', 8, 1000, 'mSATA SSD', true, false, 25490, 27274.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-8250u-16-256', 'gt7000-i5-8250u-16gb-256gb', 'GT7000', 'GT7000 i5-8250U 16GB 256GB', 'Intel Core i5-8250U', 16, 256, 'mSATA SSD', true, false, 23090, 24706.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i5-8250u-16-1000', 'gt7000-i5-8250u-16gb-1tb', 'GT7000', 'GT7000 i5-8250U 16GB 1TB', 'Intel Core i5-8250U', 16, 1000, 'mSATA SSD', true, false, 26590, 28451.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']),
('gt7000-i7-7510u-4-128', 'gt7000-i7-7510u-4gb-128gb', 'GT7000', 'GT7000 i7-7510U 4GB 128GB', 'Intel Core i7-7510U', 4, 128, 'mSATA SSD', true, false, 22590, 24171.30, '/images/gt7000/front.jpg', '/images/gt7000/front.jpg', 'Industrial Fanless PC 6 COM DDR4 ทนร้อน 70°C', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['fanless','ddr4','6-com']);

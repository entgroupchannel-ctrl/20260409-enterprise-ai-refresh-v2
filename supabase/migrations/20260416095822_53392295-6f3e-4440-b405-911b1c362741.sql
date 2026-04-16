
-- Deactivate old duplicate
UPDATE products SET is_active = false WHERE id = 'c0279b46-75c5-4f6c-9d3a-8f24c2bc54b0';

-- Update base GT9000 record
UPDATE products SET
  unit_price = 25290,
  unit_price_vat = 27060.30,
  cpu = 'Intel Core i5-10200H',
  ram_gb = 4,
  storage_gb = 128,
  storage_type = 'M-SATA SSD',
  has_wifi = true,
  has_4g = false,
  image_url = '/images/gt9000/front.jpg',
  thumbnail_url = '/images/gt9000/front.jpg',
  description = 'เรือธง Industrial Fanless PC — Triple HDMI Display 3 จอพร้อมกัน, 6 COM (RS232/RS422/RS485), Full-height 4G Module+SIM, Dual-Band WiFi, M-SATA+SATA+NVMe Triple Storage, 8 USB (4×USB3.0+4×USB2.0), Dual GbE LAN, TDP 45W โครง Brushed Aluminum Alloy ทนร้อน 60°C ทำงาน 24/7 เหมาะสำหรับ AI Vision, Factory Automation, SCADA',
  gallery_urls = ARRAY[
    '/images/gt9000/main.jpg',
    '/images/gt9000/front.jpg',
    '/images/gt9000/side.jpg',
    '/images/gt9000/angle.jpg',
    '/images/gt9000/motherboard.png',
    '/images/wix/0597a3_b68e0174e2b54d39b0bdf80ae71118e5_dbbc6602.png',
    '/images/wix/0597a3_ecdc35b7d41e4cfba1afa5d11300df17_1c556fc5.png',
    '/images/wix/0597a3_77a9c0395f984fde811028a4f0fbc5e4_64748b8e.png',
    '/images/wix/0597a3_c5d446300d3a4d9caabc33cad2911b4b_5ecb9f30.png',
    '/images/wix/005637_11c4dd2fbe1048448d0663de7ae71804_852cd386.jpg'
  ],
  tags = ARRAY['flagship', 'fanless', 'triple-hdmi', '6-com', 'nvme', 'industrial'],
  is_active = true,
  updated_at = now()
WHERE id = 'c9055efa-143c-4bf8-9202-a22bcf227304';

-- Insert GT9000 variants (9 additional)
INSERT INTO products (sku, slug, model, name, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, unit_price, unit_price_vat, image_url, thumbnail_url, description, category, series, form_factor, warranty_months, warranty_type, is_active, tags) VALUES
('gt9000-i5-10200h-4-256', 'gt9000-i5-10200h-4gb-256gb', 'GT9000', 'GT9000 i5-10200H 4GB 256GB', 'Intel Core i5-10200H', 4, 256, 'M-SATA SSD', true, false, 26090, 27916.30, '/images/gt9000/front.jpg', '/images/gt9000/front.jpg', 'Industrial Fanless PC Triple HDMI 6 COM NVMe', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['flagship','fanless','triple-hdmi','6-com']),
('gt9000-i5-10200h-8-128', 'gt9000-i5-10200h-8gb-128gb', 'GT9000', 'GT9000 i5-10200H 8GB 128GB', 'Intel Core i5-10200H', 8, 128, 'M-SATA SSD', true, false, 25890, 27702.30, '/images/gt9000/front.jpg', '/images/gt9000/front.jpg', 'Industrial Fanless PC Triple HDMI 6 COM NVMe', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['flagship','fanless','triple-hdmi','6-com']),
('gt9000-i5-10200h-8-256', 'gt9000-i5-10200h-8gb-256gb', 'GT9000', 'GT9000 i5-10200H 8GB 256GB', 'Intel Core i5-10200H', 8, 256, 'M-SATA SSD', true, false, 26490, 28344.30, '/images/gt9000/front.jpg', '/images/gt9000/front.jpg', 'Industrial Fanless PC Triple HDMI 6 COM NVMe', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['flagship','fanless','triple-hdmi','6-com']),
('gt9000-i5-10200h-16-256', 'gt9000-i5-10200h-16gb-256gb', 'GT9000', 'GT9000 i5-10200H 16GB 256GB', 'Intel Core i5-10200H', 16, 256, 'M-SATA SSD', true, false, 27690, 29628.30, '/images/gt9000/front.jpg', '/images/gt9000/front.jpg', 'Industrial Fanless PC Triple HDMI 6 COM NVMe', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['flagship','fanless','triple-hdmi','6-com']),
('gt9000-i5-10200h-8-512', 'gt9000-i5-10200h-8gb-512gb-hdd', 'GT9000', 'GT9000 i5-10200H 8GB 512GB+HDD500GB', 'Intel Core i5-10200H', 8, 512, 'SSD+HDD', true, false, 26490, 28344.30, '/images/gt9000/front.jpg', '/images/gt9000/front.jpg', 'Industrial Fanless PC Triple HDMI 6 COM พร้อม HDD 500GB', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['flagship','fanless','triple-hdmi','6-com']),
('gt9000-i7-10750h-4-128', 'gt9000-i7-10750h-4gb-128gb', 'GT9000', 'GT9000 i7-10750H 4GB 128GB', 'Intel Core i7-10750H', 4, 128, 'M-SATA SSD', true, false, 27690, 29628.30, '/images/gt9000/front.jpg', '/images/gt9000/front.jpg', 'Industrial Fanless PC Triple HDMI 6 COM NVMe', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['flagship','fanless','triple-hdmi','6-com']),
('gt9000-i7-10750h-8-128', 'gt9000-i7-10750h-8gb-128gb', 'GT9000', 'GT9000 i7-10750H 8GB 128GB', 'Intel Core i7-10750H', 8, 128, 'M-SATA SSD', true, false, 28190, 30163.30, '/images/gt9000/front.jpg', '/images/gt9000/front.jpg', 'Industrial Fanless PC Triple HDMI 6 COM NVMe', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['flagship','fanless','triple-hdmi','6-com']),
('gt9000-i7-10750h-8-256', 'gt9000-i7-10750h-8gb-256gb', 'GT9000', 'GT9000 i7-10750H 8GB 256GB', 'Intel Core i7-10750H', 8, 256, 'M-SATA SSD', true, false, 28790, 30805.30, '/images/gt9000/front.jpg', '/images/gt9000/front.jpg', 'Industrial Fanless PC Triple HDMI 6 COM NVMe', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['flagship','fanless','triple-hdmi','6-com']),
('gt9000-i7-10750h-16-512', 'gt9000-i7-10750h-16gb-512gb', 'GT9000', 'GT9000 i7-10750H 16GB 512GB', 'Intel Core i7-10750H', 16, 512, 'M-SATA SSD', true, false, 31390, 33587.30, '/images/gt9000/front.jpg', '/images/gt9000/front.jpg', 'Industrial Fanless PC Triple HDMI 6 COM NVMe', 'industrial-pc', 'GT', 'Fanless Box PC', 24, 'carry_in', true, ARRAY['flagship','fanless','triple-hdmi','6-com']);


-- Deactivate old duplicate GT1400 record
UPDATE products SET is_active = false WHERE id = 'a6083d5e-5fd2-4d5f-b59b-7087684b5a59';

-- Update base GT1400 record
UPDATE products SET 
  unit_price = 28990,
  description = 'GT1400 คอมพิวเตอร์อุตสาหกรรมรุ่นใหม่ รองรับ CPU 9 รุ่น (Celeron J4125 ถึง i7-1165G7) | 2× Intel i225V 2.5G LAN | 6 COM Port (2× RS232/422/485 + 4× RS232) | GPIO 10 ช่อง | M.2 3042/3052 สำหรับ 4G/5G + SIM | ไฟ 9–36V กว้าง | Fanless | -20°C~60°C | 300×155×50mm | เหมาะสำหรับ Automation, Robotics, Maritime, Surveillance, Smart City',
  cpu = 'Intel Core i5-8305G',
  ram_gb = 4,
  storage_gb = 128,
  storage_type = 'M.2 SSD',
  has_wifi = true,
  has_4g = false,
  os = 'Windows 10',
  form_factor = 'Mini PC',
  stock_status = 'available',
  gallery_urls = ARRAY[
    '/images/gt1400/main.jpg',
    '/images/gt1400/front.jpg',
    '/images/gt1400/rear.jpg',
    '/images/gt1400/side.jpg',
    '/images/gt1400/internal.jpg',
    '/images/gt1400/ports.png',
    '/images/gt1400/dimension.png'
  ],
  image_url = '/images/gt1400/main.jpg',
  thumbnail_url = '/images/gt1400/main.jpg'
WHERE id = 'b244152e-b496-4c63-987b-858aec38d728';

-- Insert GT1400 variants (11 more — base covers i5-8305G/4GB/128GB)
INSERT INTO products (sku, slug, model, series, name, description, category, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, os, form_factor, unit_price, stock_status, is_active, image_url, thumbnail_url, gallery_urls, tags) VALUES
('gt1400-i5-8305g-8-128', 'gt1400-i5-8305g-8gb-128gb', 'GT1400', 'GT Series', 'GT1400 i5-8305G 8GB 128GB', 'GT1400 Fanless IPC — Intel i5-8305G / DDR4 8GB / SSD 128GB + WiFi', 'Mini PC', 'Intel Core i5-8305G', 8, 128, 'M.2 SSD', true, false, 'Windows 10', 'Mini PC', 29190, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR4']),
('gt1400-i5-8305g-4-256', 'gt1400-i5-8305g-4gb-256gb', 'GT1400', 'GT Series', 'GT1400 i5-8305G 4GB 256GB', 'GT1400 Fanless IPC — Intel i5-8305G / DDR4 4GB / SSD 256GB + WiFi', 'Mini PC', 'Intel Core i5-8305G', 4, 256, 'M.2 SSD', true, false, 'Windows 10', 'Mini PC', 29590, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR4']),
('gt1400-i5-8305g-8-256', 'gt1400-i5-8305g-8gb-256gb', 'GT1400', 'GT Series', 'GT1400 i5-8305G 8GB 256GB', 'GT1400 Fanless IPC — Intel i5-8305G / DDR4 8GB / SSD 256GB + WiFi', 'Mini PC', 'Intel Core i5-8305G', 8, 256, 'M.2 SSD', true, false, 'Windows 10', 'Mini PC', 29990, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR4']),
('gt1400-i7-12650hx-8-128', 'gt1400-i7-12650hx-8gb-128gb', 'GT1400', 'GT Series', 'GT1400 i7-12650HX 8GB 128GB', 'GT1400 Fanless IPC — Intel i7-12650HX / DDR5 8GB / SSD 128GB + WiFi', 'Mini PC', 'Intel Core i7-12650HX', 8, 128, 'M.2 SSD', true, false, 'Windows 11', 'Mini PC', 34690, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR5','Gen12']),
('gt1400-i7-12650hx-8-256', 'gt1400-i7-12650hx-8gb-256gb', 'GT1400', 'GT Series', 'GT1400 i7-12650HX 8GB 256GB', 'GT1400 Fanless IPC — Intel i7-12650HX / DDR5 8GB / SSD 256GB + WiFi', 'Mini PC', 'Intel Core i7-12650HX', 8, 256, 'M.2 SSD', true, false, 'Windows 11', 'Mini PC', 35290, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR5','Gen12']),
('gt1400-i7-12650hx-16-128', 'gt1400-i7-12650hx-16gb-128gb', 'GT1400', 'GT Series', 'GT1400 i7-12650HX 16GB 128GB', 'GT1400 Fanless IPC — Intel i7-12650HX / DDR5 16GB / SSD 128GB + WiFi', 'Mini PC', 'Intel Core i7-12650HX', 16, 128, 'M.2 SSD', true, false, 'Windows 11', 'Mini PC', 36490, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR5','Gen12']),
('gt1400-i7-12650hx-16-256', 'gt1400-i7-12650hx-16gb-256gb', 'GT1400', 'GT Series', 'GT1400 i7-12650HX 16GB 256GB', 'GT1400 Fanless IPC — Intel i7-12650HX / DDR5 16GB / SSD 256GB + WiFi', 'Mini PC', 'Intel Core i7-12650HX', 16, 256, 'M.2 SSD', true, false, 'Windows 11', 'Mini PC', 36990, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR5','Gen12']),
('gt1400-i7-13650hx-8-128', 'gt1400-i7-13650hx-8gb-128gb', 'GT1400', 'GT Series', 'GT1400 i7-13650HX 8GB 128GB', 'GT1400 Fanless IPC — Intel i7-13650HX / DDR5 8GB / SSD 128GB + WiFi', 'Mini PC', 'Intel Core i7-13650HX', 8, 128, 'M.2 SSD', true, false, 'Windows 11', 'Mini PC', 37790, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR5','Gen13']),
('gt1400-i7-13650hx-8-256', 'gt1400-i7-13650hx-8gb-256gb', 'GT1400', 'GT Series', 'GT1400 i7-13650HX 8GB 256GB', 'GT1400 Fanless IPC — Intel i7-13650HX / DDR5 8GB / SSD 256GB + WiFi', 'Mini PC', 'Intel Core i7-13650HX', 8, 256, 'M.2 SSD', true, false, 'Windows 11', 'Mini PC', 38390, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR5','Gen13']),
('gt1400-i7-13650hx-16-128', 'gt1400-i7-13650hx-16gb-128gb', 'GT1400', 'GT Series', 'GT1400 i7-13650HX 16GB 128GB', 'GT1400 Fanless IPC — Intel i7-13650HX / DDR5 16GB / SSD 128GB + WiFi', 'Mini PC', 'Intel Core i7-13650HX', 16, 128, 'M.2 SSD', true, false, 'Windows 11', 'Mini PC', 39590, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR5','Gen13']),
('gt1400-i7-13650hx-16-256', 'gt1400-i7-13650hx-16gb-256gb', 'GT1400', 'GT Series', 'GT1400 i7-13650HX 16GB 256GB', 'GT1400 Fanless IPC — Intel i7-13650HX / DDR5 16GB / SSD 256GB + WiFi', 'Mini PC', 'Intel Core i7-13650HX', 16, 256, 'M.2 SSD', true, false, 'Windows 11', 'Mini PC', 39990, 'available', true, '/images/gt1400/main.jpg', '/images/gt1400/main.jpg', ARRAY['/images/gt1400/main.jpg','/images/gt1400/front.jpg','/images/gt1400/rear.jpg'], ARRAY['GT Series','GT1400','Fanless','DDR5','Gen13']);

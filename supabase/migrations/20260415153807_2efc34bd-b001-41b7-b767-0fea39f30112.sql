-- GB Series Variants Seed

-- GB1000 variants
INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb1000-j1900-4gb-128ssd', 'Celeron J1900 / 4GB / 128GB SSD',
  'Intel Celeron J1900', 4, 128, 'SSD', false, false, 0, 0, true, true, 'available'
FROM products p WHERE p.sku = 'gb1000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu, ram_gb = EXCLUDED.ram_gb, storage_gb = EXCLUDED.storage_gb, is_default = EXCLUDED.is_default;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb1000-j1900-8gb-256ssd', 'Celeron J1900 / 8GB / 256GB SSD',
  'Intel Celeron J1900', 8, 256, 'SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb1000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, ram_gb = EXCLUDED.ram_gb, storage_gb = EXCLUDED.storage_gb;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb1000-i3-8gb-256ssd', 'Core i3 / 8GB / 256GB SSD',
  'Intel Core i3', 8, 256, 'SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb1000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb1000-i5-8gb-512ssd', 'Core i5 / 8GB / 512GB SSD',
  'Intel Core i5', 8, 512, 'SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb1000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu, storage_gb = EXCLUDED.storage_gb;

-- GB2000 variants
INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb2000-celeron-4gb-128ssd', 'Celeron / 4GB / 128GB SSD — 2.5G LAN',
  'Intel Celeron', 4, 128, 'SSD', false, false, 0, 0, true, true, 'available'
FROM products p WHERE p.sku = 'gb2000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, is_default = EXCLUDED.is_default;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb2000-celeron-8gb-256ssd', 'Celeron / 8GB / 256GB SSD — 2.5G LAN',
  'Intel Celeron', 8, 256, 'SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb2000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb2000-i3-8gb-256ssd', 'Core i3 / 8GB / 256GB SSD — 2.5G LAN + GPIO',
  'Intel Core i3', 8, 256, 'SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb2000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb2000-i5-16gb-512ssd-4g', 'Core i5 / 16GB / 512GB SSD + 4G SIM',
  'Intel Core i5', 16, 512, 'SSD', false, true, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb2000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu, ram_gb = EXCLUDED.ram_gb, has_4g = EXCLUDED.has_4g;

-- GB4000 v1 variants
INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb4000v1-i3-gen10-8gb-256nvme', 'Core i3 Gen 10 / 8GB / 256GB NVMe — 12 COM',
  'Intel Core i3 Gen 10', 8, 256, 'NVMe SSD', false, false, 0, 0, true, true, 'available'
FROM products p WHERE p.sku = 'gb4000v1-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, is_default = EXCLUDED.is_default;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb4000v1-i5-gen10-16gb-512nvme', 'Core i5 Gen 10 / 16GB / 512GB NVMe — 12 COM',
  'Intel Core i5 Gen 10', 16, 512, 'NVMe SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb4000v1-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu, ram_gb = EXCLUDED.ram_gb;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb4000v1-i7-gen10-32gb-512nvme', 'Core i7 Gen 10 / 32GB / 512GB NVMe — 12 COM',
  'Intel Core i7 Gen 10', 32, 512, 'NVMe SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb4000v1-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu, ram_gb = EXCLUDED.ram_gb;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb4000v1-i5-gen12-16gb-512nvme', 'Core i5 Gen 12 (Alder Lake) / 16GB / 512GB NVMe',
  'Intel Core i5 Gen 12', 16, 512, 'NVMe SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb4000v1-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb4000v1-i7-gen13-32gb-1tb-nvme', 'Core i7 Gen 13 (Raptor Lake) / 32GB / 1TB NVMe',
  'Intel Core i7 Gen 13', 32, 1000, 'NVMe SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb4000v1-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu, storage_gb = EXCLUDED.storage_gb;

-- GB4000 v2 variants
INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb4000v2-i3-gen10-8gb-256nvme', 'Core i3 Gen 10 / 8GB / 256GB NVMe — 10 USB + 2x HDMI',
  'Intel Core i3 Gen 10', 8, 256, 'NVMe SSD', false, false, 0, 0, true, true, 'available'
FROM products p WHERE p.sku = 'gb4000v2-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, is_default = EXCLUDED.is_default;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb4000v2-i5-gen10-16gb-512nvme', 'Core i5 Gen 10 / 16GB / 512GB NVMe — 10 USB + 2x HDMI',
  'Intel Core i5 Gen 10', 16, 512, 'NVMe SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb4000v2-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu, ram_gb = EXCLUDED.ram_gb;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb4000v2-i7-gen10-32gb-512nvme', 'Core i7 Gen 10 / 32GB / 512GB NVMe — 10 USB + 2x HDMI',
  'Intel Core i7 Gen 10', 32, 512, 'NVMe SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb4000v2-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu, ram_gb = EXCLUDED.ram_gb;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb4000v2-i5-gen12-16gb-512nvme', 'Core i5 Gen 12 (Alder Lake) / 16GB / 512GB NVMe',
  'Intel Core i5 Gen 12', 16, 512, 'NVMe SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb4000v2-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb4000v2-i7-gen13-32gb-1tb-nvme', 'Core i7 Gen 13 (Raptor Lake) / 32GB / 1TB NVMe',
  'Intel Core i7 Gen 13', 32, 1000, 'NVMe SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb4000v2-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu, storage_gb = EXCLUDED.storage_gb;

-- GB5000 variants
INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb5000-i5-13500h-16gb-512nvme', 'Core i5-13500H / 16GB DDR5 / 512GB NVMe — 4x HDMI 4K',
  'Intel Core i5-13500H', 16, 512, 'NVMe SSD', false, false, 0, 0, true, true, 'available'
FROM products p WHERE p.sku = 'gb5000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, is_default = EXCLUDED.is_default;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb5000-i7-13650hx-32gb-512nvme', 'Core i7-13650HX / 32GB DDR5 / 512GB NVMe — 4x HDMI 4K',
  'Intel Core i7-13650HX', 32, 512, 'NVMe SSD', false, false, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb5000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, cpu = EXCLUDED.cpu, ram_gb = EXCLUDED.ram_gb;

INSERT INTO product_variants
  (product_id, sku, variant_name, cpu, ram_gb, storage_gb, storage_type,
   has_wifi, has_4g, unit_price, unit_price_vat, is_active, is_default, stock_status)
SELECT p.id, 'gb5000-i7-13650hx-64gb-1tb-nvme-5g', 'Core i7-13650HX / 64GB DDR5 / 1TB NVMe + 5G Module',
  'Intel Core i7-13650HX', 64, 1000, 'NVMe SSD', true, true, 0, 0, true, false, 'available'
FROM products p WHERE p.sku = 'gb5000-base'
ON CONFLICT (sku) DO UPDATE SET variant_name = EXCLUDED.variant_name, ram_gb = EXCLUDED.ram_gb,
  storage_gb = EXCLUDED.storage_gb, has_wifi = EXCLUDED.has_wifi, has_4g = EXCLUDED.has_4g;

-- Update images
UPDATE products SET
  image_url = '/images/wix/0597a3_8f5ea734fd4e41de8db85394a03f50bf_f19d04ba.png',
  thumbnail_url = '/images/wix/0597a3_8f5ea734fd4e41de8db85394a03f50bf_f19d04ba.png'
WHERE sku = 'gb1000-base' AND image_url IS NULL;

UPDATE products SET
  image_url = '/images/wix/0597a3_b7d3859e0bcf4d2eaeb80e45384e91dc_d4e6442f.jpg',
  thumbnail_url = '/images/wix/0597a3_b7d3859e0bcf4d2eaeb80e45384e91dc_d4e6442f.jpg'
WHERE sku = 'gb2000-base' AND image_url IS NULL;

UPDATE products SET
  image_url = '/images/wix/0597a3_95c69a88c2ba459e88ffef869f27fb02_e12a03c2.png',
  thumbnail_url = '/images/wix/0597a3_95c69a88c2ba459e88ffef869f27fb02_e12a03c2.png'
WHERE sku = 'gb4000v1-base' AND image_url IS NULL;

UPDATE products SET
  image_url = '/images/wix/0597a3_6ee79905a67f4623be10cf8545d60eca_5b79f36c.png',
  thumbnail_url = '/images/wix/0597a3_6ee79905a67f4623be10cf8545d60eca_5b79f36c.png'
WHERE sku = 'gb4000v2-base' AND image_url IS NULL;

UPDATE products SET
  image_url = '/images/wix/0597a3_84464f31e83d47a982b5ee3b559db400_8ab46d63.png',
  thumbnail_url = '/images/wix/0597a3_84464f31e83d47a982b5ee3b559db400_8ab46d63.png'
WHERE sku = 'gb5000-base' AND image_url IS NULL;

-- Update descriptions
UPDATE products SET
  description = 'Industrial PC GB1000 ขนาดเล็กที่สุดในซีรีส์ เพียง 21×18×5.2 cm เล็กกว่า GB5000 ถึง 60% แต่ยังคงประสิทธิภาพ Industrial Grade. Fanless Silent 0dB, 6x COM (RS232/422/485), Dual Display HDMI+VGA, 4x USB, 2x Gigabit LAN. รองรับ DIN Rail / Wall Mount. อุณหภูมิ -20°C ถึง +60°C.'
WHERE sku = 'gb1000-base';

UPDATE products SET
  description = 'Industrial PC GB2000 — เครือข่ายความเร็วสูง 2x 2.5G LAN (Intel i225V) พร้อม Legacy I/O ครบครัน: PS/2, GPIO 7in+7out, LPT. 6x COM (RS422/RS485), SIM Slot 3G/4G Module. DDR4 Max 16GB. เหมาะธุรกิจที่ต้องการอัปเกรดระบบเก่าให้ทันสมัยพร้อม network เร็ว.',
  has_4g = true
WHERE sku = 'gb2000-base';

UPDATE products SET
  description = 'Industrial PC GB4000 v1 — Legacy Max 12 COM Ports (6x DB9 + 6x RS232 Terminal Phoenix) รองรับ RS422/RS485. CPU Intel Gen 4 ถึง Gen 13 (Raptor Lake). DDR4 Max 64GB, 2x M.2 NVMe + 1x SATA. เหมาะ SCADA, BMS, ระบบควบคุมอุตสาหกรรมที่ต้องการ COM ports จำนวนมาก.'
WHERE sku = 'gb4000v1-base';

UPDATE products SET
  description = 'Industrial PC GB4000 v2 — USB Max 10 Ports (USB 3.0/2.0) พร้อม 6x COM (4x RS422/RS485), Dual HDMI Display. CPU Intel Gen 4 ถึง Gen 13 (Raptor Lake). DDR4 Max 64GB, 2x M.2 NVMe + 1x SATA. เหมาะงาน Industry 4.0 ที่ต้องการเชื่อมต่ออุปกรณ์ USB หลายตัวพร้อม 2 จอ.'
WHERE sku = 'gb4000v2-base';

UPDATE products SET
  description = 'Industrial PC GB5000 — Premium Performance สูงสุด. Intel Core i7-13650HX (14 cores, 20 threads). DDR5 RAM สูงสุด 64GB. 4x HDMI 2.0 (4K@60Hz) รองรับ 4 จอพร้อมกัน. 4x Intel i226V 2.5G LAN. 6x COM (4x RS422/RS485), 8x USB, 5G Module Ready, DC 9-36V. เหมาะ Digital Signage ขนาดใหญ่, Control Room, Edge AI.',
  has_4g = true
WHERE sku = 'gb5000-base';
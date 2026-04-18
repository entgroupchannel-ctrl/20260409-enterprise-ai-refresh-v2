
WITH new_campaigns AS (
  INSERT INTO public.affiliate_campaigns (slug, title, description, campaign_type, is_featured, estimated_total, promo_note)
  VALUES
    ('gk-mini-pc-office-starter', 'GK Mini PC Office Starter — เริ่มต้นออฟฟิศพันท์ใช้งานง่าย', 'GK Series Mini PC ขนาดเล็ก ประหยัดพื้นที่ เหมาะสำหรับงานออฟฟิศทั่วไป POS หน้าร้าน หรือ Digital Signage', 'cart', true, 8900, 'ส่งฟรีกรุงเทพฯ-ปริมณฑล'),
    ('gk-pos-bundle-3pack', 'GK POS Bundle x3 — ชุดเปิดร้านค้า 3 จุด', '3 เครื่อง GK Mini PC พร้อมใช้งาน POS หน้าร้าน ราคาประหยัดกว่าซื้อแยก 15%', 'cart', false, 25500, 'แถมสาย HDMI 3 เส้น + รับประกัน 1 ปี'),
    ('gt-mini-pc-i5-workstation', 'GT Mini PC i5 Workstation — เครื่องทำงานสายช่าง', 'GT Series i5 Gen 12 RAM 16GB SSD 512GB เหมาะสำหรับงานออกแบบ AutoCAD, SolidWorks ขนาดเบา', 'cart', true, 19900, 'พร้อม Windows 11 Pro แท้'),
    ('gt-mini-pc-dual-display', 'GT Mini PC Dual Display Setup — ชุดจอคู่สำหรับงานเทรด/วิเคราะห์', 'GT Mini PC + 2 จอ 24" Full HD พร้อมขายึด เหมาะสำหรับห้องควบคุม, เทรดเดอร์, นักวิเคราะห์', 'cart', false, 32500, 'ส่งฟรี + ติดตั้งฟรีในกรุงเทพ'),
    ('gt-rugged-mini-pc-industrial', 'GT Rugged Mini PC — เครื่องทนทานสำหรับโรงงาน', 'GT Series รุ่น Industrial Grade ทนฝุ่น/ความสั่นสะเทือน รับประกัน 3 ปี เหมาะสำหรับสายการผลิต', 'cart', true, 28900, '🏭 Industrial Grade • รับประกัน 3 ปี'),
    ('gb-server-edge-compute', 'GB Series Edge Server — เซิร์ฟเวอร์หน้างาน', 'GB Server Xeon RAM 32GB SSD 1TB สำหรับ Edge Computing, Video Analytics หน้างาน', 'cart', false, 45900, 'รับประกัน 3 ปี Onsite'),
    ('gb-mini-server-vm-host', 'GB Mini Server VM Host — รัน VM/Docker หลายตัว', 'GB Mini Server i7 RAM 64GB เหมาะสำหรับรัน VMware/Proxmox/Docker ใน SME ราคาคุ้มค่ากว่า Dell/HP', 'cart', false, 52000, 'ติดตั้ง Proxmox ฟรี'),
    ('epc-panel-pc-15-touch', 'EPC Panel PC 15.6" Touch — จอสัมผัสสำหรับสายการผลิต', 'EPC Panel PC จอสัมผัส 15.6" IP65 หน้าจอ ทนน้ำ/ฝุ่น พร้อมติดตั้งบนตู้ควบคุม', 'cart', true, 24900, '⚙️ IP65 • พร้อม Bracket ติดตั้ง'),
    ('epc-panel-pc-21-hmi', 'EPC Panel PC 21.5" HMI Workstation — สถานี HMI ขนาดใหญ่', 'EPC Panel PC 21.5" Multi-touch ใช้กับ SCADA/HMI โรงงานหรือศูนย์ควบคุม', 'cart', false, 38900, 'พร้อม Software License แนะนำ'),
    ('epc-box-pc-fanless-trio', 'EPC Box PC Fanless Trio — 3 รุ่นแกร่งไม่มีพัดลม', '3 รุ่น EPC Box PC Fanless: i3 / i5 / i7 เหมาะสำหรับ Machine Vision, Edge AI, Video Wall', 'cart', false, 58900, 'ลด 12% เมื่อสั่ง 3 รุ่น'),
    ('epc-box-pc-gpu-edge-ai', 'EPC Box PC + GPU — Edge AI Inference Box', 'EPC Box PC พร้อม GPU NVIDIA T1000 สำหรับงาน Edge AI Inference, License Plate Recognition', 'cart', true, 65000, '🤖 พร้อมเริ่ม AI Inference'),
    ('starter-mixed-test-kit', 'Mixed Industrial Test Kit — ชุดทดลองลูกค้าใหม่', '1 GK Mini + 1 EPC Panel 10" สำหรับลูกค้าทดลองก่อนสั่งจริง ราคาพิเศษ', 'cart', false, 13900, '🎁 สำหรับลูกค้าใหม่เท่านั้น')
  RETURNING id, slug
)
INSERT INTO public.affiliate_campaign_items (campaign_id, product_model, product_name, quantity, unit_price, display_order)
SELECT nc.id, items.model, items.name, items.qty, items.price, items.ord
FROM new_campaigns nc
JOIN (VALUES
  -- gk-mini-pc-office-starter
  ('gk-mini-pc-office-starter', 'GK-Mini-i3', 'GK Mini PC Intel i3 / 8GB / 256GB SSD', 1, 8900, 1),

  -- gk-pos-bundle-3pack
  ('gk-pos-bundle-3pack', 'GK-Mini-Celeron-POS', 'GK Mini PC Celeron N5105 / 8GB / 128GB (POS Edition)', 3, 8500, 1),

  -- gt-mini-pc-i5-workstation
  ('gt-mini-pc-i5-workstation', 'GT-i5-12450H-16GB', 'GT Mini PC i5-12450H / 16GB / 512GB SSD + Win11 Pro', 1, 19900, 1),

  -- gt-mini-pc-dual-display
  ('gt-mini-pc-dual-display', 'GT-i5-12450H-16GB', 'GT Mini PC i5-12450H / 16GB / 512GB SSD', 1, 19900, 1),
  ('gt-mini-pc-dual-display', 'MON-24-FHD', 'จอ Monitor 24" Full HD IPS', 2, 4500, 2),
  ('gt-mini-pc-dual-display', 'DUAL-MOUNT-ARM', 'ขายึดจอคู่ Dual Monitor Arm', 1, 3600, 3),

  -- gt-rugged-mini-pc-industrial
  ('gt-rugged-mini-pc-industrial', 'GT-Rugged-i5-IP40', 'GT Rugged Mini PC i5 / 16GB / 512GB / IP40', 1, 28900, 1),

  -- gb-server-edge-compute
  ('gb-server-edge-compute', 'GB-Edge-Xeon-E2336', 'GB Edge Server Xeon E-2336 / 32GB ECC / 1TB NVMe', 1, 45900, 1),

  -- gb-mini-server-vm-host
  ('gb-mini-server-vm-host', 'GB-Mini-i7-64GB', 'GB Mini Server i7-13700 / 64GB / 1TB NVMe x2', 1, 52000, 1),

  -- epc-panel-pc-15-touch
  ('epc-panel-pc-15-touch', 'EPC-PPC-156-IP65', 'EPC Panel PC 15.6" Touch IP65 / i5 / 8GB / 256GB', 1, 24900, 1),

  -- epc-panel-pc-21-hmi
  ('epc-panel-pc-21-hmi', 'EPC-PPC-215-MULTI', 'EPC Panel PC 21.5" Multi-touch / i5 / 16GB / 512GB', 1, 38900, 1),

  -- epc-box-pc-fanless-trio
  ('epc-box-pc-fanless-trio', 'EPC-Box-Fanless-i3', 'EPC Box PC Fanless i3 / 8GB / 256GB', 1, 14900, 1),
  ('epc-box-pc-fanless-trio', 'EPC-Box-Fanless-i5', 'EPC Box PC Fanless i5 / 16GB / 512GB', 1, 19900, 2),
  ('epc-box-pc-fanless-trio', 'EPC-Box-Fanless-i7', 'EPC Box PC Fanless i7 / 32GB / 1TB', 1, 24100, 3),

  -- epc-box-pc-gpu-edge-ai
  ('epc-box-pc-gpu-edge-ai', 'EPC-Box-GPU-T1000', 'EPC Box PC + NVIDIA T1000 4GB / i7 / 32GB / 1TB', 1, 65000, 1),

  -- starter-mixed-test-kit
  ('starter-mixed-test-kit', 'GK-Mini-i3', 'GK Mini PC Intel i3 / 8GB / 256GB SSD', 1, 8900, 1),
  ('starter-mixed-test-kit', 'EPC-PPC-101-MINI', 'EPC Panel PC 10.1" Touch / Celeron / 4GB / 64GB', 1, 5000, 2)
) AS items(slug, model, name, qty, price, ord) ON items.slug = nc.slug;

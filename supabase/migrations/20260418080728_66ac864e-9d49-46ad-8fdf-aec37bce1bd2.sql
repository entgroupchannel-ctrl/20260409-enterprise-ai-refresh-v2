
-- Seed 5 sample affiliate campaigns
WITH new_campaigns AS (
  INSERT INTO public.affiliate_campaigns
    (slug, title, description, campaign_type, promo_note, is_active, is_featured, estimated_total, created_by)
  VALUES
    (
      'gt-mini-pc-starter',
      'GT Mini PC Starter Pack — เริ่มต้นออฟฟิศอุตสาหกรรม',
      'แพ็กเริ่มต้น 3 เครื่อง GT1400 สำหรับสายการผลิตหรือออฟฟิศที่ต้องการคอมพิวเตอร์ทนทาน ใช้งานต่อเนื่อง 24/7',
      'cart',
      'ลด 8% เมื่อสั่งครบแพ็ก + ส่งฟรีในกรุงเทพและปริมณฑล',
      true, true,
      3 * 36490,
      '1965537e-3a6a-462f-ac20-2da63538b0e4'
    ),
    (
      'panel-pc-line-bundle',
      'Industrial Panel PC Line Bundle — ติดตั้งสายการผลิต',
      'ชุดอุปกรณ์ Panel PC 3 ขนาด (15.6"/17"/21.5") เหมาะสำหรับติดตั้งหลายจุดในไลน์ผลิตเดียวกัน',
      'cart',
      'แถมสาย VGA/HDMI 5 เมตร + รับประกัน on-site 1 ปี',
      true, false,
      38000 + 45000 + 65000,
      '1965537e-3a6a-462f-ac20-2da63538b0e4'
    ),
    (
      'edge-ai-jetson-kit',
      'Edge AI Jetson Kit — เริ่มโปรเจกต์ AI ที่หน้างาน',
      'ชุดพัฒนา AI ที่หน้างาน (Edge AI) ประกอบด้วย Orin Nano Super 8GB และระบบพัฒนา Y-C18-DEV — พร้อมใช้กับงาน Vision/Robotics',
      'cart',
      'ฟรี! เซสชัน Onboarding 2 ชั่วโมงกับวิศวกร ENT',
      true, true,
      48900 + 38900,
      '1965537e-3a6a-462f-ac20-2da63538b0e4'
    ),
    (
      'epc-box-pc-trio',
      'EPC Box PC Trio — 3 รุ่นยอดนิยมในชุดเดียว',
      'ชุดทดลอง EPC Box PC 3 รุ่น (EPC-202A / EPC-302A / EPC-402A) ให้ลูกค้าเปรียบเทียบ Gen 10 vs Gen 12 ได้ในออเดอร์เดียว',
      'cart',
      'เหมาะสำหรับ SI / Reseller ที่ต้องการตัวอย่างประเมินก่อนสั่งล็อตใหญ่',
      true, false,
      30990 * 3,
      '1965537e-3a6a-462f-ac20-2da63538b0e4'
    ),
    (
      'gt8000-display-quote',
      'GT8000 Industrial Display 27" — ขอใบเสนอราคาโครงการ',
      'จอแสดงผลอุตสาหกรรม 27 นิ้ว GT8000 สำหรับโครงการ Control Room / Smart Factory — กรอกจำนวนและรายละเอียดโครงการเพื่อรับใบเสนอราคาภายใน 1 วันทำการ',
      'quote_template',
      'มีส่วนลดพิเศษเมื่อสั่งตั้งแต่ 5 เครื่องขึ้นไป',
      true, true,
      NULL,
      '1965537e-3a6a-462f-ac20-2da63538b0e4'
    )
  RETURNING id, slug
)
-- Insert items only for cart campaigns (4 of 5)
INSERT INTO public.affiliate_campaign_items
  (campaign_id, product_model, product_name, quantity, unit_price, display_order)
SELECT c.id, i.product_model, i.product_name, i.quantity, i.unit_price, i.display_order
FROM new_campaigns c
JOIN (
  VALUES
    ('gt-mini-pc-starter',     'GT1400',  'GT1400 i7-12650HX 16GB 256GB',                       3, 36490::numeric, 0),

    ('panel-pc-line-bundle',   'GT3000',  'GT3000 — 15.6" Industrial Panel PC',                 1, 38000::numeric, 0),
    ('panel-pc-line-bundle',   'GT4000',  'GT4000 — 17" Industrial Panel PC',                   1, 45000::numeric, 1),
    ('panel-pc-line-bundle',   'GT6000',  'GT6000 — 21.5" Industrial Panel PC',                 1, 65000::numeric, 2),

    ('edge-ai-jetson-kit',     'T201S-ORIN-NANO-SUPER-8G', 'เครื่อง AI Orin Nano Super 8GB T201S', 1, 48900::numeric, 0),
    ('edge-ai-jetson-kit',     'Y-C18-DEV', 'Y-C18-DEV ระบบพัฒนา AI',                            1, 38900::numeric, 1),

    ('epc-box-pc-trio',        'EPC-202A', 'EPC Box PC EPC-202A — Core i3/i5/i7 Gen 10 Standard', 1, 30990::numeric, 0),
    ('epc-box-pc-trio',        'EPC-302A', 'EPC Box PC EPC-302A — Core i3/i5 Gen 12 Wide',        1, 30990::numeric, 1),
    ('epc-box-pc-trio',        'EPC-402A', 'EPC Box PC EPC-402A — Core i3/i5 Gen 12 Flagship',    1, 30990::numeric, 2)
) AS i(slug, product_model, product_name, quantity, unit_price, display_order)
  ON c.slug = i.slug;

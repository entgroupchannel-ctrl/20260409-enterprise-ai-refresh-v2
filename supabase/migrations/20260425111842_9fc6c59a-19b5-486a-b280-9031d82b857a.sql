INSERT INTO public.products (
  sku, model, name, description, category, slug,
  form_factor, unit_price, stock_status, is_active, is_featured,
  warranty_months, warranty_type, sort_order, tags
) VALUES
('ITD-HD32','HD32',
 'Interactive Touch Display HD32 — 32" Capacitive Touch Monitor',
 'จอทัชสกรีนอุตสาหกรรม 32 นิ้ว FHD 1920×1080 16:9 Capacitive Multi-touch กระจกนิรภัย IP65 รองรับ Wall mount / Desktop / Embedded',
 'Interactive Touch Display','interactive-display-hd32',
 '32" Wall/Desktop/Embedded',0,'in_stock',true,true,24,'on_site',1,
 ARRAY['touch-monitor','32-inch','capacitive','fhd','ip65']),
('ITD-HR43','HR43',
 'Interactive Touch Display HR43 — 43" IR Touch Monitor',
 'จอ 43 นิ้ว IR Touch 7th-gen <5ms 10-point Anti-glare Vandal-Proof IP65',
 'Interactive Touch Display','interactive-display-hr43',
 '43" Wall/Floor stand',0,'in_stock',true,true,24,'on_site',2,
 ARRAY['touch-monitor','43-inch','ir-touch','10-point']),
('ITD-HR55','HR55',
 'Interactive Touch Display HR55 — 55" IR Touch Monitor',
 'จอ 55 นิ้ว IR Touch 10 จุด Anti-glare เหมาะสำหรับห้องประชุม-ห้องเรียน-Wayfinding IP65',
 'Interactive Touch Display','interactive-display-hr55',
 '55" Wall/Floor stand',0,'in_stock',true,true,24,'on_site',3,
 ARRAY['touch-monitor','55-inch','ir-touch','10-point']),
('ITD-HR65','HR65',
 'Interactive Touch Display HR65 — 65" IR Touch Monitor',
 'จอ 65 นิ้วระดับพรีเมียม Unibody Sunlight-Readable Vandal-Proof สำหรับ Boardroom/War Room/Interactive Whiteboard',
 'Interactive Touch Display','interactive-display-hr65',
 '65" Wall/Floor stand',0,'in_stock',true,true,24,'on_site',4,
 ARRAY['touch-monitor','65-inch','ir-touch','10-point']);

INSERT INTO public.product_categories (name, slug, description, sort_order, is_active)
VALUES ('Interactive Touch Display','interactive-display',
        'จอทัชสกรีนอุตสาหกรรม 32"–65" สำหรับ Retail, Meeting Room, Education, Industrial',8,true)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (
  product_code, sku, model, series, name, description, category,
  form_factor, unit_price, stock_status, is_active, is_featured,
  slug, image_url, thumbnail_url, tags, sort_order,
  warranty_months, warranty_type
) VALUES (
  'KD156B', 'KD156B-KIOSK', 'KD156B', 'KD156',
  '15.6" KD156B — Floor-Stand Touch Kiosk (Monitor / Windows / Android)',
  'ตู้คีออสก์ตั้งพื้น 15.6" FHD PCAP 10-point — เลือก Configuration ได้ 3 แบบ: Touch Monitor / Windows x86 / Android พร้อม Replaceable Front Panel รองรับ Printer / Scanner / RFID / Fingerprint',
  'Floor-Stand Kiosk', 'Floor Kiosk', 22990, 'in_stock', true, true,
  'displays-15.6', '/placeholder.svg', '/placeholder.svg',
  ARRAY['kiosk','touch','15.6','floor-stand','featured','new'], 10, 24, 'on_site'
)
ON CONFLICT (slug) DO UPDATE SET
  is_active = EXCLUDED.is_active, is_featured = EXCLUDED.is_featured,
  name = EXCLUDED.name, description = EXCLUDED.description,
  category = EXCLUDED.category, unit_price = EXCLUDED.unit_price,
  tags = EXCLUDED.tags, updated_at = now();
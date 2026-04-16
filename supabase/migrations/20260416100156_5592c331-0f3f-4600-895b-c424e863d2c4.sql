
UPDATE products SET
  unit_price = 23990,
  unit_price_vat = 25669.30,
  cpu = 'RK3588 Octa-Core (4×A76+4×A55)',
  ram_gb = 8,
  storage_gb = 128,
  storage_type = 'eMMC',
  has_wifi = true,
  has_4g = false,
  os = 'Android',
  image_url = '/images/rugged/f9r-V3GyP6IL.jpg',
  thumbnail_url = '/images/rugged/f9r-V3GyP6IL.jpg',
  description = 'Rugged Android Tablet 10.1" IPS 1200×1920 ความสว่าง 600 nits — RK3588 Octa-Core (4×Cortex-A76+4×Cortex-A55), RAM 8GB, ROM 128GB, WiFi 6, กล้องความละเอียดสูง เหมาะสำหรับงานภาคสนาม มัลติมีเดีย และแอป Android หนัก',
  gallery_urls = ARRAY['/images/rugged/f9r-V3GyP6IL.jpg'],
  category = 'rugged-tablet',
  series = 'Rugged Tablet',
  form_factor = 'Tablet',
  tags = ARRAY['android', 'rugged', 'rk3588', 'wifi6', '10-inch'],
  is_active = true,
  updated_at = now()
WHERE id = '034da92b-b3df-4019-9a0c-d44140221fd9';

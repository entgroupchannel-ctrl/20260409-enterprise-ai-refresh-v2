UPDATE public.company_settings
SET address_th = REPLACE(
  address_th,
  'หมู่บ้าน เมโทร บิซทาวน์',
  'เมโทร บิซทาวน์'
),
    updated_at = NOW()
WHERE address_th LIKE '%หมู่บ้าน เมโทร บิซทาวน์%';
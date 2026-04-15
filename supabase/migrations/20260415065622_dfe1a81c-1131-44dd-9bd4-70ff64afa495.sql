INSERT INTO public.suppliers (
  company_name,
  company_name_en,
  contact_name,
  email,
  phone,
  address,
  country,
  main_products,
  status,
  is_preferred,
  quality_rating,
  notes
) VALUES (
  'Cloud Embedded Technology Limited (CESIPC)',
  'Cloud Embedded Technology Limited',
  'Everly',
  'sales11@cesipc.com',
  '+8619860075914',
  'Floor 8, Building 1B, Shangzhi Science and Technology Park, Fenghuang Street, Guang Ming District, Shenzhen, 518107',
  'China',
  ARRAY['Monitor', 'Industrial PC', 'Embedded Computer'],
  'approved',
  false,
  NULL,
  'ข้อมูลจาก Commercial Invoice AWB 3711407840 (2025-12-26) — สินค้า: Monitor computer'
) ON CONFLICT DO NOTHING;
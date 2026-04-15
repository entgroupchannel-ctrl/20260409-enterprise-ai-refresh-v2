
-- 1) GOLE TECHNOLOGY (HK) LIMITED
INSERT INTO public.suppliers (
  company_name, company_name_en, business_type, country,
  contact_name, contact_position, email, phone, website,
  address, city,
  bank_name, bank_address, bank_account_number, bank_account_name, swift_code, bank_country,
  main_products, payment_terms, lead_time_days, currency,
  default_price_terms, default_payment_terms, default_delivery_days,
  status, approved_at, is_preferred, quality_rating, notes
) VALUES (
  'GOLE TECHNOLOGY (HK) LIMITED',
  'GOLE TECHNOLOGY (HK) LIMITED',
  'manufacturer', 'Hong Kong',
  'Chen Qiang', 'Sales', 'N/A', '+8613322986335', NULL,
  'ROOM 1103, HANG SENG MONGKOK BUILDING, 677 NATHAN ROAD, MONGKOK, KOWLOON', 'Hong Kong',
  'HSBC Hong Kong', '1 Queen''s Road Central, Hong Kong',
  '652-477043-838', 'GOLE TECHNOLOGY (HK) LIMITED', 'HSBCHKHHHKH', 'Hong Kong',
  ARRAY['Rugged Tablet PC', 'Industrial Tablet'],
  'TT 100% before shipping', 7, 'USD',
  'EXW', 'TT 100% before shipping', '5-7 working days',
  'approved', now(), false, 4.0,
  'Imported from PI 20250606383818. Shipping via HK DHL. HS code: 8471301000.'
) ON CONFLICT DO NOTHING;

-- 2) HK INNODA INDUSTRY CO., LTD
INSERT INTO public.suppliers (
  company_name, company_name_en, business_type, country,
  contact_name, contact_position, email, phone, website,
  address, city, state_province,
  bank_name, bank_address, bank_account_number, bank_account_name, swift_code, bank_country,
  main_products, payment_terms, lead_time_days, currency,
  default_price_terms, default_payment_terms, default_delivery_days,
  status, approved_at, is_preferred, quality_rating, notes
) VALUES (
  'HK INNODA INDUSTRY CO., LTD',
  'HK INNODA INDUSTRY CO., LTD',
  'manufacturer', 'China',
  'Tina', 'Sales', 'sales@innodapc.com', '+86-13554782291', 'www.innodapc.com',
  '4/F, Building B, Anlom Technology Park, No. 381, Huating Rd, Longhua', 'Shenzhen', 'Guangdong',
  'HSBC Hong Kong', '1 Queen''s Road Central, Hong Kong',
  '561 883448 838', 'HK INNODA INDUSTRY CO., LIMITED', 'HSBCHKHHHKH', 'Hong Kong',
  ARRAY['Waterproof Panel PC', 'Industrial Panel PC', 'Stainless Steel PC'],
  'TT 100% in advance', 20, 'USD',
  'EXW', '100% T/T in advance', '20 working days',
  'approved', now(), false, 4.0,
  'Imported from PI IND20250620TN01. TEL: +86-755-29108731, FAX: +86-755-83551350. Bank fee $28.'
) ON CONFLICT DO NOTHING;

-- 3) EMDOOR INFORMATION INTERNATIONAL CO LIMITED
INSERT INTO public.suppliers (
  company_name, company_name_en, business_type, country,
  contact_name, contact_position, email, phone, website,
  address, city,
  bank_name, bank_address, bank_account_number, bank_account_name, swift_code, bank_country,
  main_products, payment_terms, lead_time_days, currency,
  default_price_terms, default_payment_terms, default_delivery_days,
  status, approved_at, is_preferred, quality_rating, notes
) VALUES (
  'EMDOOR INFORMATION INTERNATIONAL CO LIMITED',
  'EMDOOR INFORMATION INTERNATIONAL CO LIMITED',
  'manufacturer', 'Hong Kong',
  'Andy', 'Sales', 'andy@emdoor.com', '+86-755-23722880', 'info.emdoor.com',
  '19H Maxgrand Plaza, No.3 Tai Yau Street, San Po Kong, Kowloon', 'Hong Kong',
  'The Hongkong and Shanghai Banking Corporation Limited', 'Head Office, 1 Queen''s Road Central Hong Kong',
  '652-593476-838', 'EMDOOR INFORMATION INTERNATIONAL CO LIMITED', 'HSBCHKHHHKH', 'Hong Kong',
  ARRAY['Rugged Tablet', 'Rugged Handheld', 'Rugged Notebook', 'Industrial PDA'],
  'TT 100% before delivery', 14, 'USD',
  'FOB HK', '100% T/T before delivery', '7-14 working days',
  'approved', now(), true, 4.5,
  'Imported from PI EM-CJH20251009-06. FAX: +852-28382602. Warranty 1 year from receipt. Confirm within 7 working days.'
) ON CONFLICT DO NOTHING;

-- 4) Sharevdi Technology Co.,Ltd
INSERT INTO public.suppliers (
  company_name, company_name_en, business_type, country,
  contact_name, contact_position, email, phone, website,
  address, city, state_province,
  bank_name, bank_address, bank_account_number, bank_account_name, swift_code, bank_country,
  main_products, payment_terms, lead_time_days, currency,
  default_price_terms, default_payment_terms, default_delivery_days,
  status, approved_at, is_preferred, quality_rating, notes
) VALUES (
  'Sharevdi Technology Co.,Ltd',
  'Sharevdi Technology Co.,Ltd',
  'manufacturer', 'China',
  'Tiffany (T1)', 'Sales', 'tiffany@sharevdi.com', '+86-13534038519', 'www.sharevdi.com',
  '11th Floor, Building 1, Phase 1, Dongjiu Innovation and Technology Park I, No. 76 Bulan Road, Nanwan Street, Longgang District', 'Shenzhen', 'Guangdong',
  'HSBC Hong Kong', 'HSBC International Banking Centre, L6, 1 Queen''s Road Central, Hong Kong',
  '456-412-915-838', 'Sharevdi Technology Company Limited', 'HSBCHKHHHKH', 'Hong Kong',
  ARRAY['Mini PC', 'Industrial Panel PC', 'Fanless PC'],
  'TT', 7, 'USD',
  'CFR', 'T/T', '5-7 workdays',
  'approved', now(), false, 4.0,
  'Imported from PI ST-T1-251219-2. Export email: export@sharevdi.com. Invoice valid 7 days. Bank fee $60. Shipping via UPS.'
) ON CONFLICT DO NOTHING;

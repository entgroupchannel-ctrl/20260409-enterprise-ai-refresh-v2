-- Seed Product Catalog — ข้อมูลสินค้าจากเว็บไซต์
-- ราคาเป็นราคาเบื้องต้น Admin สามารถปรับได้ภายหลังจากหน้า "สินค้า+ราคา"

-- GT Series — Mini PC
INSERT INTO product_catalog (model, name_th, category, base_price, specs, lead_days, is_active) VALUES
('GT1000', 'มินิพีซี GT1000 Celeron', 'GT Series — Mini PC', 5900, '{"cpu":"Intel Celeron J1900","ram":"4GB DDR3L","storage":"64GB SSD"}', 3, true),
('GT1200', 'มินิพีซี GT1200 Celeron', 'GT Series — Mini PC', 6900, '{"cpu":"Intel Celeron J3455","ram":"4GB DDR3L","storage":"64GB SSD"}', 3, true),
('GT1300', 'มินิพีซี GT1300 Celeron', 'GT Series — Mini PC', 7900, '{"cpu":"Intel Celeron N5095","ram":"8GB DDR4","storage":"128GB SSD"}', 3, true),
('GT1400', 'มินิพีซี GT1400 N100', 'GT Series — Mini PC', 7500, '{"cpu":"Intel N100","ram":"8GB DDR4","storage":"256GB SSD"}', 3, true),
('GT2000', 'มินิพีซี GT2000 Core i3', 'GT Series — Mini PC', 12900, '{"cpu":"Intel Core i3-8145U","ram":"8GB DDR4","storage":"256GB SSD"}', 5, true),
('GT3000', 'มินิพีซี GT3000 Core i5', 'GT Series — Mini PC', 16900, '{"cpu":"Intel Core i5-8265U","ram":"8GB DDR4","storage":"256GB SSD"}', 5, true),
('GT4000', 'มินิพีซี GT4000 Core i5 Gen10', 'GT Series — Mini PC', 19900, '{"cpu":"Intel Core i5-10210U","ram":"8GB DDR4","storage":"256GB SSD"}', 5, true),
('GT4500', 'มินิพีซี GT4500 Core i5 Gen11', 'GT Series — Mini PC', 22900, '{"cpu":"Intel Core i5-1135G7","ram":"8GB DDR4","storage":"512GB SSD"}', 7, true),
('GT5000', 'มินิพีซี GT5000 Core i7 Gen10', 'GT Series — Mini PC', 24900, '{"cpu":"Intel Core i7-10510U","ram":"16GB DDR4","storage":"512GB SSD"}', 7, true),
('GT6000', 'มินิพีซี GT6000 Core i5 Gen12', 'GT Series — Mini PC', 26900, '{"cpu":"Intel Core i5-1235U","ram":"16GB DDR4","storage":"512GB SSD"}', 7, true),
('GT7000', 'มินิพีซี GT7000 Core i7 Gen12', 'GT Series — Mini PC', 29900, '{"cpu":"Intel Core i7-1255U","ram":"16GB DDR4","storage":"512GB SSD"}', 7, true),
('GT8000', 'มินิพีซี GT8000 Core i5 Gen13', 'GT Series — Mini PC', 32900, '{"cpu":"Intel Core i5-1340P","ram":"16GB DDR5","storage":"512GB SSD"}', 10, true),
('GT9000', 'มินิพีซี GT9000 Core i7 Gen13', 'GT Series — Mini PC', 36900, '{"cpu":"Intel Core i7-1360P","ram":"16GB DDR5","storage":"512GB SSD"}', 10, true)
ON CONFLICT (model) DO UPDATE SET name_th = EXCLUDED.name_th, category = EXCLUDED.category, base_price = EXCLUDED.base_price, specs = EXCLUDED.specs, updated_at = now();

-- GB Series — Compact PC
INSERT INTO product_catalog (model, name_th, category, base_price, specs, lead_days, is_active) VALUES
('GB1000', 'คอมแพ็ค GB1000 Celeron', 'GB Series — Compact PC', 8900, '{"cpu":"Intel Celeron","ram":"4GB","storage":"128GB SSD"}', 5, true),
('GB2000', 'คอมแพ็ค GB2000 Core i3', 'GB Series — Compact PC', 14900, '{"cpu":"Intel Core i3","ram":"8GB","storage":"256GB SSD"}', 5, true),
('GB4000', 'คอมแพ็ค GB4000 Core i5', 'GB Series — Compact PC', 21900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB SSD"}', 7, true),
('GB5000', 'คอมแพ็ค GB5000 Core i7', 'GB Series — Compact PC', 28900, '{"cpu":"Intel Core i7","ram":"16GB","storage":"512GB SSD"}', 7, true)
ON CONFLICT (model) DO UPDATE SET name_th = EXCLUDED.name_th, category = EXCLUDED.category, base_price = EXCLUDED.base_price, specs = EXCLUDED.specs, updated_at = now();

-- GK Series — Panel PC
INSERT INTO product_catalog (model, name_th, category, base_price, specs, lead_days, is_active) VALUES
('GK1004', 'Panel PC 10.4" Touch', 'GK Series — Panel PC', 35900, '{"cpu":"Intel Celeron/i5","ram":"4-8GB","storage":"64-256GB SSD","display":"10.4 inch Touch"}', 14, true),
('GK1501', 'Panel PC 15" Touch IP65', 'GK Series — Panel PC', 45900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB SSD","display":"15.0 inch Touch IP65"}', 14, true),
('GK2101', 'Panel PC 21.5" Touch', 'GK Series — Panel PC', 55900, '{"cpu":"Intel Core i5/i7","ram":"8-16GB","storage":"256-512GB SSD","display":"21.5 inch Touch"}', 14, true)
ON CONFLICT (model) DO UPDATE SET name_th = EXCLUDED.name_th, category = EXCLUDED.category, base_price = EXCLUDED.base_price, specs = EXCLUDED.specs, updated_at = now();

-- Mini PC Firewall
INSERT INTO product_catalog (model, name_th, category, base_price, specs, lead_days, is_active) VALUES
('GT194L-J4125', 'Mini PC Firewall 4 LAN', 'Mini PC Firewall', 8900, '{"cpu":"Intel Celeron J4125","ram":"8GB DDR4","storage":"128GB SSD","lan":"4x Intel i225-V 2.5GbE"}', 3, true),
('GT194L-N5105', 'Mini PC Firewall 4 LAN N5105', 'Mini PC Firewall', 9900, '{"cpu":"Intel Celeron N5105","ram":"8GB DDR4","storage":"256GB SSD","lan":"4x Intel i225-V 2.5GbE"}', 3, true),
('GT196L', 'Mini PC Firewall 6 LAN', 'Mini PC Firewall', 7900, '{"cpu":"Intel Celeron J1900","ram":"4GB DDR3L","storage":"64GB SSD","lan":"6x Gigabit LAN"}', 3, true),
('K8-F12', 'Mini PC Firewall K8-F12', 'Mini PC Firewall', 12900, '{"cpu":"Intel Core i3/i5","ram":"8GB DDR4","storage":"256GB SSD","lan":"6x 2.5GbE"}', 5, true)
ON CONFLICT (model) DO UPDATE SET name_th = EXCLUDED.name_th, category = EXCLUDED.category, base_price = EXCLUDED.base_price, specs = EXCLUDED.specs, updated_at = now();

-- Rugged Tablet
INSERT INTO product_catalog (model, name_th, category, base_price, specs, lead_days, is_active) VALUES
('F7G', 'แท็บเล็ตทนทาน 7" Android', 'Rugged Tablet', 31900, '{"cpu":"MTK","ram":"8GB","storage":"128GB","display":"7 inch","os":"Android"}', 7, true),
('F7R', 'แท็บเล็ตทนทาน 7" Windows', 'Rugged Tablet', 35900, '{"cpu":"Intel Celeron","ram":"8GB","storage":"128GB","display":"7 inch","os":"Windows"}', 7, true),
('F7N', 'แท็บเล็ตทนทาน 7" Lite', 'Rugged Tablet', 18900, '{"cpu":"MTK","ram":"4GB","storage":"64GB","display":"7 inch","os":"Android"}', 5, true),
('F8R', 'แท็บเล็ตทนทาน 8"', 'Rugged Tablet', 38900, '{"cpu":"Qualcomm","ram":"8GB","storage":"128GB","display":"8 inch"}', 7, true),
('F8CT', 'แท็บเล็ตทนทาน 8" Compact', 'Rugged Tablet', 28900, '{"cpu":"MTK","ram":"4GB","storage":"64GB","display":"8 inch"}', 5, true),
('F9R', 'แท็บเล็ตทนทาน 9"', 'Rugged Tablet', 42900, '{"cpu":"Qualcomm","ram":"8GB","storage":"128GB","display":"9 inch"}', 10, true),
('F9A', 'แท็บเล็ตทนทาน 9" Android', 'Rugged Tablet', 35900, '{"cpu":"MTK","ram":"6GB","storage":"128GB","display":"9 inch","os":"Android"}', 7, true),
('F9E', 'แท็บเล็ตทนทาน 9" Enterprise', 'Rugged Tablet', 45900, '{"cpu":"Qualcomm","ram":"8GB","storage":"256GB","display":"9 inch"}', 10, true),
('F10', 'แท็บเล็ตทนทาน 10"', 'Rugged Tablet', 42900, '{"cpu":"Intel/Qualcomm","ram":"8GB","storage":"128GB","display":"10 inch"}', 7, true),
('F12R', 'แท็บเล็ตทนทาน 12"', 'Rugged Tablet', 55900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB","display":"12 inch"}', 14, true),
('W10N', 'แท็บเล็ตทนทาน 10" Windows', 'Rugged Tablet', 45900, '{"cpu":"Intel Celeron","ram":"8GB","storage":"128GB","display":"10 inch","os":"Windows"}', 10, true),
('W10Y', 'แท็บเล็ตทนทาน 10" Windows Pro', 'Rugged Tablet', 52900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB","display":"10 inch","os":"Windows 11 Pro"}', 10, true),
('W109U', 'แท็บเล็ตทนทาน 10.9"', 'Rugged Tablet', 48900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB","display":"10.9 inch","os":"Windows 11 Pro"}', 10, true),
('A10ST', 'แท็บเล็ตทนทาน 10" Android', 'Rugged Tablet', 25900, '{"cpu":"MTK","ram":"4GB","storage":"64GB","display":"10 inch","os":"Android"}', 5, true),
('A109T', 'แท็บเล็ตทนทาน 10.9" Android', 'Rugged Tablet', 32900, '{"cpu":"MTK","ram":"6GB","storage":"128GB","display":"10.9 inch","os":"Android"}', 7, true),
('EM-T195', 'แท็บเล็ตทนทาน Enterprise 19.5"', 'Rugged Tablet', 89900, '{"cpu":"Intel Core i5","ram":"16GB","storage":"512GB","display":"19.5 inch"}', 21, true)
ON CONFLICT (model) DO UPDATE SET name_th = EXCLUDED.name_th, category = EXCLUDED.category, base_price = EXCLUDED.base_price, specs = EXCLUDED.specs, updated_at = now();

-- Rugged Notebook
INSERT INTO product_catalog (model, name_th, category, base_price, specs, lead_days, is_active) VALUES
('W14U-A', 'โน้ตบุ๊คทนทาน 14" AMD', 'Rugged Notebook', 65900, '{"cpu":"AMD Ryzen 5","ram":"8GB","storage":"256GB SSD","display":"14 inch FHD"}', 14, true),
('W14U-S', 'โน้ตบุ๊คทนทาน 14" Intel', 'Rugged Notebook', 69900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB SSD","display":"14 inch FHD"}', 14, true),
('W15U-T', 'โน้ตบุ๊คทนทาน 15.6" Touch', 'Rugged Notebook', 75900, '{"cpu":"Intel Core i5","ram":"16GB","storage":"512GB SSD","display":"15.6 inch FHD Touch"}', 14, true),
('W33U', 'โน้ตบุ๊คทนทาน 13.3" Ultra', 'Rugged Notebook', 89900, '{"cpu":"Intel Core i7","ram":"16GB","storage":"512GB SSD","display":"13.3 inch FHD"}', 21, true),
('EM-X14A', 'โน้ตบุ๊คทนทาน Semi-Rugged 14"', 'Rugged Notebook', 55900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB SSD","display":"14 inch FHD"}', 14, true),
('EM-X14M', 'โน้ตบุ๊คทนทาน Military 14"', 'Rugged Notebook', 125900, '{"cpu":"Intel Core i7","ram":"16GB","storage":"1TB SSD","display":"14 inch FHD Sunlight Readable"}', 30, true),
('EM-X15A', 'โน้ตบุ๊คทนทาน Semi-Rugged 15.6"', 'Rugged Notebook', 59900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB SSD","display":"15.6 inch FHD"}', 14, true),
('EM-X15M', 'โน้ตบุ๊คทนทาน Military 15.6"', 'Rugged Notebook', 135900, '{"cpu":"Intel Core i7","ram":"32GB","storage":"1TB SSD","display":"15.6 inch FHD MIL-STD"}', 30, true),
('EM-I22J', 'โน้ตบุ๊คทนทาน Industrial 22"', 'Rugged Notebook', 159900, '{"cpu":"Intel Core i7","ram":"32GB","storage":"1TB SSD","display":"22 inch FHD"}', 30, true)
ON CONFLICT (model) DO UPDATE SET name_th = EXCLUDED.name_th, category = EXCLUDED.category, base_price = EXCLUDED.base_price, specs = EXCLUDED.specs, updated_at = now();

-- Rugged Handheld & PDA
INSERT INTO product_catalog (model, name_th, category, base_price, specs, lead_days, is_active) VALUES
('P28T', 'PDA ทนทาน 2.8"', 'Rugged Handheld', 15900, '{"cpu":"MTK","ram":"3GB","storage":"32GB","display":"2.8 inch","barcode":"1D/2D"}', 5, true),
('P40AT', 'PDA ทนทาน 4" Android', 'Rugged Handheld', 18900, '{"cpu":"MTK","ram":"4GB","storage":"64GB","display":"4 inch","barcode":"1D/2D"}', 5, true),
('A52T', 'PDA ทนทาน 5.2"', 'Rugged Handheld', 22900, '{"cpu":"Qualcomm","ram":"4GB","storage":"64GB","display":"5.2 inch","barcode":"1D/2D"}', 7, true),
('A55GT', 'PDA ทนทาน 5.5" 5G', 'Rugged Handheld', 28900, '{"cpu":"Qualcomm","ram":"6GB","storage":"128GB","display":"5.5 inch","barcode":"1D/2D","5g":"Yes"}', 7, true),
('A60T', 'PDA ทนทาน 6" Android', 'Rugged Handheld', 25900, '{"cpu":"MTK","ram":"4GB","storage":"64GB","display":"6 inch","barcode":"1D/2D"}', 5, true),
('P61G', 'PDA ทนทาน 6.1"', 'Rugged Handheld', 32900, '{"cpu":"Qualcomm","ram":"6GB","storage":"128GB","display":"6.1 inch","barcode":"1D/2D"}', 7, true),
('P66G', 'PDA ทนทาน 6.6" 5G', 'Rugged Handheld', 35900, '{"cpu":"Qualcomm","ram":"8GB","storage":"128GB","display":"6.6 inch","barcode":"1D/2D","5g":"Yes"}', 10, true),
('A71T M16', 'PDA ทนทาน 7.1" MTK', 'Rugged Handheld', 28900, '{"cpu":"MTK","ram":"4GB","storage":"64GB","display":"7.1 inch","barcode":"1D/2D"}', 7, true),
('P72T', 'PDA ทนทาน 7.2"', 'Rugged Handheld', 38900, '{"cpu":"Qualcomm","ram":"6GB","storage":"128GB","display":"7.2 inch","barcode":"1D/2D"}', 10, true),
('W62H', 'PDA ทนทาน 6.2" Windows', 'Rugged Handheld', 45900, '{"cpu":"Intel Celeron","ram":"8GB","storage":"128GB","display":"6.2 inch","os":"Windows","barcode":"1D/2D"}', 14, true),
('W65G', 'PDA ทนทาน 6.5" Windows 5G', 'Rugged Handheld', 55900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB","display":"6.5 inch","os":"Windows","barcode":"1D/2D","5g":"Yes"}', 14, true),
('EM-P1', 'PDA Enterprise P1', 'Rugged Handheld', 35900, '{"cpu":"Qualcomm","ram":"4GB","storage":"64GB","display":"5 inch","barcode":"1D/2D"}', 10, true),
('EM-P2 Pro', 'PDA Enterprise P2 Pro', 'Rugged Handheld', 42900, '{"cpu":"Qualcomm","ram":"6GB","storage":"128GB","display":"5.5 inch","barcode":"1D/2D"}', 10, true),
('EM-T1 MAX', 'Tablet Enterprise T1 MAX', 'Rugged Handheld', 55900, '{"cpu":"Qualcomm","ram":"8GB","storage":"256GB","display":"8 inch","barcode":"1D/2D"}', 14, true),
('EM-T2 Ultra', 'Tablet Enterprise T2 Ultra', 'Rugged Handheld', 65900, '{"cpu":"Qualcomm","ram":"8GB","storage":"256GB","display":"10 inch","barcode":"1D/2D"}', 14, true)
ON CONFLICT (model) DO UPDATE SET name_th = EXCLUDED.name_th, category = EXCLUDED.category, base_price = EXCLUDED.base_price, specs = EXCLUDED.specs, updated_at = now();

-- All-in-One PC
INSERT INTO product_catalog (model, name_th, category, base_price, specs, lead_days, is_active) VALUES
('H7A', 'All-in-One 7" Android', 'All-in-One PC', 12900, '{"cpu":"MTK/RK","ram":"2-4GB","storage":"16-32GB","display":"7 inch Touch"}', 7, true),
('H108', 'All-in-One 10.8"', 'All-in-One PC', 18900, '{"cpu":"Intel/MTK","ram":"4GB","storage":"64GB","display":"10.8 inch Touch"}', 7, true),
('H10F', 'All-in-One 10" Fanless', 'All-in-One PC', 22900, '{"cpu":"Intel Celeron","ram":"4GB","storage":"128GB","display":"10 inch Touch"}', 10, true),
('H10PRO', 'All-in-One 10" Pro', 'All-in-One PC', 29900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB","display":"10 inch Touch"}', 10, true),
('F3APL', 'All-in-One F3 Apollo Lake', 'All-in-One PC', 15900, '{"cpu":"Intel Celeron","ram":"4GB","storage":"64GB","display":"Touch"}', 7, true),
('F6', 'All-in-One 6"', 'All-in-One PC', 9900, '{"cpu":"MTK","ram":"2GB","storage":"16GB","display":"6 inch Touch"}', 5, true),
('F11', 'All-in-One 11.6"', 'All-in-One PC', 25900, '{"cpu":"Intel Celeron/i5","ram":"4-8GB","storage":"128-256GB","display":"11.6 inch Touch"}', 10, true),
('F15', 'All-in-One 15.6"', 'All-in-One PC', 32900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB","display":"15.6 inch FHD Touch"}', 10, true),
('EM-P17R', 'All-in-One 17" Industrial', 'All-in-One PC', 45900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB","display":"17 inch Touch IP65"}', 14, true),
('EM-P18R', 'All-in-One 18.5" Industrial', 'All-in-One PC', 49900, '{"cpu":"Intel Core i5/i7","ram":"8-16GB","storage":"256-512GB","display":"18.5 inch Touch IP65"}', 14, true),
('EM-P21R', 'All-in-One 21.5" Industrial', 'All-in-One PC', 55900, '{"cpu":"Intel Core i5/i7","ram":"8-16GB","storage":"256-512GB","display":"21.5 inch FHD Touch IP65"}', 14, true),
('EM-P21A', 'All-in-One 21.5" Android', 'All-in-One PC', 35900, '{"cpu":"RK3588","ram":"4-8GB","storage":"32-64GB","display":"21.5 inch FHD Touch","os":"Android"}', 10, true),
('EM-P21J', 'All-in-One 21.5" Slim', 'All-in-One PC', 42900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB","display":"21.5 inch FHD Touch"}', 14, true),
('EM-PT21', 'All-in-One 21.5" PCAP Touch', 'All-in-One PC', 52900, '{"cpu":"Intel Core i5/i7","ram":"8-16GB","storage":"256-512GB","display":"21.5 inch PCAP Touch"}', 14, true)
ON CONFLICT (model) DO UPDATE SET name_th = EXCLUDED.name_th, category = EXCLUDED.category, base_price = EXCLUDED.base_price, specs = EXCLUDED.specs, updated_at = now();

-- Waterproof PC IP69K
INSERT INTO product_catalog (model, name_th, category, base_price, specs, lead_days, is_active) VALUES
('IP69K-15', 'Waterproof PC 15" IP69K', 'Waterproof PC IP69K', 89900, '{"cpu":"Intel Core i5","ram":"8GB","storage":"256GB","display":"15 inch Stainless Steel IP69K"}', 30, true),
('IP69K-21', 'Waterproof PC 21.5" IP69K', 'Waterproof PC IP69K', 109900, '{"cpu":"Intel Core i5/i7","ram":"16GB","storage":"512GB","display":"21.5 inch Stainless Steel IP69K"}', 30, true)
ON CONFLICT (model) DO UPDATE SET name_th = EXCLUDED.name_th, category = EXCLUDED.category, base_price = EXCLUDED.base_price, specs = EXCLUDED.specs, updated_at = now();
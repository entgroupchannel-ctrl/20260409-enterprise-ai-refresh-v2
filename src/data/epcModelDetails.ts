// EPC Panel PC + EPC Box Series — static spec data for /shop/<model> detail pages
export type EpcModelSpec = { label: string; value: string };
export type EpcSpecGroup = { title: string; rows: EpcModelSpec[] };
export type EpcOptionGroup = { label: string; choices: string[]; note?: string };
export type EpcCertification = { code: string; description?: string };
export type EpcGalleryImage = { src: string; alt: string; caption?: string };
export type EpcSelectionRow = {
  no: string; model: string; partNumber: string; cpu: string; memory: string; storage: string;
};
// Configurator (W24X2A-style) — buyer-selectable options with price deltas
export type EpcCpuOption = {
  key: string;          // unique id, e.g. 'j1900'
  label: string;        // display, e.g. 'Intel® Celeron® J1900'
  cores: number;
  threads: number;
  freq: string;         // '2.0–2.4 GHz'
  cache: string;        // '2MB'
  tdp: string;          // '10W'
  graphics: string;     // 'Intel® HD'
  memorySupport: string; // '4–8GB DDR3L'
  storageSupport: string; // '1× mSATA SSD'
  baseModel: string;    // factory model code, e.g. 'EPC-W2462A'
  basePrice: number;    // THB before VAT — base unit (CPU+min RAM+min SSD)
};
export type EpcChoiceOption = { key: string; label: string; addPrice: number; note?: string };
export type EpcConfigurator = {
  cpus: EpcCpuOption[];
  ram: EpcChoiceOption[];        // delta vs base RAM
  storage: EpcChoiceOption[];    // delta vs base SSD
  touch: EpcChoiceOption[];      // P-CAP / Resistive
  wireless: EpcChoiceOption[];   // None / Wi-Fi / 4G / both
  os: EpcChoiceOption[];         // None / Win10 / Win11 / Ubuntu
  tempRange: EpcChoiceOption[];  // 0~50°C / -40~70°C
  powerInput: EpcChoiceOption[]; // 12V / 9-36V
  warranty: { years: 1 | 2 | 3; label: string; multiplier: number }[];
};

export type EpcModelDetail = {
  slug: string;          // route slug, e.g. 'epc-w15x2a'
  model: string;         // display model, e.g. 'EPC-W15X2A'
  series: 'EPC Panel PC' | 'EPC Box';
  category: 'Touch Panel PC' | 'Box PC';
  tagline: string;
  intro: string;
  highlights: string[];
  specs: EpcModelSpec[];                 // legacy flat specs (fallback)
  specGroups?: EpcSpecGroup[];           // new grouped specs (factory-accurate)
  options?: EpcOptionGroup[];            // configurable options for buyer
  certifications?: EpcCertification[];   // CE / FCC / BIS …
  applications?: string[];               // application industries / use cases
  heroImages?: string[];                 // photo slider in hero (top-left)
  productImages?: EpcGalleryImage[];     // ►Product images & sizes (dimensions, IO map)
  gallery?: EpcGalleryImage[];           // additional product photos
  selectionTable?: EpcSelectionRow[];    // factory part-number selection guide
  configurator?: EpcConfigurator;        // buyer-selectable build (W24X2A-style)
  datasheetUrl?: string;                 // PDF datasheet link (factory)
  image: string;
  landingHref: string;   // landing page anchor on EPCSeries / EPCBoxSeries
  popular?: boolean;
};

const PANEL_COMMON_SPECS: EpcModelSpec[] = [
  { label: 'CPU', value: 'Intel® Core™ i3 / i5 / i7 (configurable)' },
  { label: 'Memory', value: 'DDR4 SO-DIMM, สูงสุด 32GB' },
  { label: 'Storage', value: 'M.2 NVMe SSD / 2.5" SATA SSD' },
  { label: 'Touch', value: 'Projected Capacitive (P-CAP), 10-point multi-touch' },
  { label: 'Brightness', value: '300–1000 nits (เลือกได้)' },
  { label: 'I/O', value: 'COM ×2, USB 3.0 ×4, GbE LAN ×2, HDMI ×1' },
  { label: 'Power', value: 'DC 9–36V wide-input' },
  { label: 'Mounting', value: 'VESA 75/100, Panel Mount, Wall Mount' },
  { label: 'Warranty', value: '12 เดือน (ขยายได้)' },
];

const BOX_COMMON_SPECS: EpcModelSpec[] = [
  { label: 'CPU', value: 'Intel® Core™ i3 / i5 / i7 / i9 (configurable)' },
  { label: 'Memory', value: 'DDR4/DDR5 SO-DIMM (รุ่นรองรับ)' },
  { label: 'Storage', value: 'M.2 NVMe ×1–2 + 2.5" SATA' },
  { label: 'Cooling', value: 'Fanless / Active Hybrid (เลือกได้)' },
  { label: 'I/O', value: 'COM, USB 3.x, GbE LAN ×2+, HDMI/DP, GPIO' },
  { label: 'Expansion', value: 'PCIe / Mini-PCIe / M.2 (รุ่นรองรับ)' },
  { label: 'Power', value: 'DC 9–36V wide-input' },
  { label: 'Operating Temp', value: '-20°C ~ 60°C' },
  { label: 'Warranty', value: '12 เดือน (ขยายได้)' },
];

export const epcModelDetails: Record<string, EpcModelDetail> = {
  'epc-w13x2a': {
    slug: 'epc-w13x2a', model: 'EPC-W13X2A', series: 'EPC Panel PC', category: 'Touch Panel PC',
    tagline: '13.3" IP65 Fanless Industrial Panel PC — Compact Wide Series',
    intro: 'EPC-W13X2A คอมพิวเตอร์อุตสาหกรรมแบบจอสัมผัสฝังตัวขนาด 13.3" 16:9 Full HD (350 cd/m²) — โครงสร้าง 6061 Aluminum Alloy แบบ Fanless, IP65 ด้านหน้า, รองรับ Intel® Celeron® จนถึง 12th Gen Core™ i7 พร้อม SafeCore™ Power-loss Protection, TPM 2.0 และ BlockCore™ Modular Design ขนาดกะทัดรัด เหมาะกับ HMI, POS, Self-service Kiosk และ Edge Control ที่ต้องการพื้นที่ติดตั้งจำกัด',
    highlights: [
      '13.3" Full HD (1920×1080) 350 cd/m² • Contrast 450:1',
      'P-CAP Touch 10 จุด • IP65 ด้านหน้า • 6H Hardness',
      'Fanless • อุณหภูมิทำงาน 0–50°C (Optional -40~70°C)',
      'CPU เลือกได้ Celeron® J1900/J6412 ถึง 12th Gen Core™ i7-1255U',
      'Dual Intel® I210 Gigabit LAN',
      '3× COM (2×RS-232 + 1×RS-485 DB9) • Dual Display HDMI+VGA',
      'Dual M.2 2280 NVMe + M.2 2230 Wi-Fi + Mini PCIe',
      'TPM 2.0 • SafeCore™ Power-loss Protection',
      'Wide DC Input 9–36V • โครงสร้าง 6061 Aluminum Alloy',
      'น้ำหนัก 4.1 kg • Compact 345 × 216 × 75 mm',
    ],
    specs: [{ label: 'Display', value: '13.3" 16:9 Full HD (1920×1080)' }, ...PANEL_COMMON_SPECS],
    specGroups: [
      {
        title: 'System Core',
        rows: [
          { label: 'CPU (Celeron)', value: 'Intel® Celeron® J1900 (2.0–2.42GHz) / J6412 (2.0–2.6GHz)' },
          { label: 'CPU (10th Gen)', value: 'Intel® Core™ i3-10110U / i5-10210U / i7-10710U' },
          { label: 'CPU (12th Gen)', value: 'Intel® Core™ i3-1215U / i5-1235U / i5-1240P / i7-1255U' },
          { label: 'Memory', value: '4–8GB DDR3L • 4–32GB DDR4 • 4–32GB DDR5 (ขึ้นกับรุ่น CPU)' },
          { label: 'Storage', value: 'mSATA / M.2 2280 NVMe SSD (สูงสุด 2 ชุด)' },
          { label: 'Cooling', value: 'Fanless (ระบายความร้อนผ่านครีบอลูมิเนียม)' },
          { label: 'OS Support', value: 'Windows 10 / 11 • Linux Ubuntu' },
        ],
      },
      {
        title: 'I/O Ports',
        rows: [
          { label: 'USB 2.0', value: '5× USB 2.0 (หรือ 2× USB 2.0 ขึ้นกับรุ่น CPU)' },
          { label: 'USB 3.0', value: '1× USB 3.0 (หรือ 4× USB 3.0 ขึ้นกับรุ่น CPU)' },
          { label: 'COM', value: '2× RS-232 + 1× RS-485 (DB9)' },
          { label: 'Display', value: '1× HDMI + 1× VGA — Dual Display' },
          { label: 'Audio', value: '1× Audio Out + 1× Mic In' },
          { label: 'Ethernet', value: '2× 10/100/1000 Mbps Intel® I210 LAN' },
          { label: 'Expansion', value: '1× Mini PCIe • Dual M.2 2280 NVMe • M.2 2230 Wi-Fi' },
        ],
      },
      {
        title: 'LCD Display & Touch',
        rows: [
          { label: 'Panel Size', value: '13.3"' },
          { label: 'Resolution', value: '1920×1080 (Full HD) 16:9' },
          { label: 'Brightness', value: '350 cd/m²' },
          { label: 'Contrast', value: '450:1' },
          { label: 'Backlight Life', value: '> 50,000 ชั่วโมง' },
          { label: 'Touch Panel', value: 'Multi-touch P-CAP 10-point • 6H Hardness' },
          { label: 'Transmittance', value: '85%' },
          { label: 'Touch Controller', value: 'USB' },
        ],
      },
      {
        title: 'Wireless Communication',
        rows: [
          { label: 'Wi-Fi / Bluetooth', value: 'Wi-Fi + BT (M.2 2230)' },
          { label: 'Cellular', value: '4G LTE Full Network (Optional)' },
        ],
      },
      {
        title: 'Power Supply',
        rows: [
          { label: 'DC Input', value: '12V DC standard (รองรับ Wide 9–36V Optional) ผ่าน 3-pin Pluggable Terminal Block' },
          { label: 'Booting', value: 'AT / ATX • Auto Power-on after Power Recovery' },
          { label: 'Protection', value: 'CESIPC SafeCore™ Power-loss Protection' },
        ],
      },
      {
        title: 'Mechanical',
        rows: [
          { label: 'Dimensions', value: '345.2 (W) × 215.6 (D) × 74.6 (H) mm' },
          { label: 'Cutout', value: '325.1 × 195.5 mm' },
          { label: 'Weight', value: '4.1 kg' },
          { label: 'Material', value: 'High-Strength 6061 Aluminum Alloy' },
          { label: 'Mounting', value: 'Wall Mount / VESA Mount / Panel Mount' },
        ],
      },
      {
        title: 'Environmental',
        rows: [
          { label: 'Operating Temp', value: '0 ~ 50°C (Optional -40 ~ 70°C)' },
          { label: 'Storage Temp', value: '-10 ~ 60°C' },
          { label: 'Front Protection', value: 'IP65' },
        ],
      },
      {
        title: 'Security & Services',
        rows: [
          { label: 'Hardware Security', value: 'TPM 2.0' },
          { label: 'ODM Support', value: 'BIOS / Boot Logo / OEM Customization' },
          { label: 'Warranty', value: '12 เดือน — ขยายเป็น 24/36 เดือนได้' },
        ],
      },
    ],
    certifications: [
      { code: 'CE', description: 'European Conformity (EN 55032 & EN 55035)' },
      { code: 'FCC', description: 'Federal Communications Commission (USA)' },
      { code: 'BIS', description: 'Bureau of Indian Standards' },
    ],
    applications: [
      'HMI Compact — สถานีควบคุมพื้นที่จำกัด',
      'POS / Self-service Kiosk',
      'Medical Cart / Bedside Terminal',
      'Smart Logistics — Warehouse Scanner Station',
      'Edge IoT Gateway with Display',
      'Robotics Teach Pendant',
    ],
    heroImages: [
      '/images/products/w13x2a/front.jpg',
      '/images/products/w13x2a/side-1.jpg',
      '/images/products/w13x2a/side-2.jpg',
      '/images/products/w13x2a/side-3.jpg',
      '/images/products/w13x2a/side-4.jpg',
      '/images/products/w13x2a/io-labels.png',
      '/images/products/w13x2a/dimensions-detail.png',
    ],
    productImages: [
      { src: '/images/products/w13x2a/dimensions-detail.png', alt: 'EPC-W13X2A Detailed Dimensions Drawing', caption: 'Dimensions: 345.2 × 215.6 × 74.6 mm • Cutout: 325.1 × 195.5 mm' },
      { src: '/images/products/w13x2a/io-labels.png', alt: 'EPC-W13X2A I/O Layout Diagram', caption: 'I/O Layout — COM, USB, HDMI, VGA, Dual LAN, Audio, Wi-Fi Antennas, DC In' },
    ],
    selectionTable: [
      { no: '1', model: 'EPC-W1362A', partNumber: 'C11.01.01.001', cpu: 'Intel® Celeron® J1900',     memory: '4GB',  storage: 'mSATA SSD 128GB' },
      { no: '2', model: 'EPC-W1372A', partNumber: 'C11.01.05.001', cpu: 'Intel® Celeron® J6412',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '3', model: 'EPC-W1392A', partNumber: 'C11.01.03.001', cpu: 'Intel® Core™ i3-10110U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '4', model: 'EPC-W1392A', partNumber: 'C11.01.03.002', cpu: 'Intel® Core™ i5-10210U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '5', model: 'EPC-W1392A', partNumber: 'C11.01.03.003', cpu: 'Intel® Core™ i7-10710U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '6', model: 'EPC-W1322A', partNumber: 'C11.01.04.001', cpu: 'Intel® Core™ i3-1215U',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '7', model: 'EPC-W1322A', partNumber: 'C11.01.04.002', cpu: 'Intel® Core™ i5-1235U',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '8', model: 'EPC-W1322A', partNumber: 'C11.01.04.003', cpu: 'Intel® Core™ i5-1240P',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '9', model: 'EPC-W1322A', partNumber: 'C11.01.04.004', cpu: 'Intel® Core™ i7-1255U',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
    ],
    configurator: {
      cpus: [
        { key: 'j1900',    label: 'Intel® Celeron® J1900',     cores: 4,  threads: 4,  freq: '2.0–2.4 GHz', cache: '2MB',   tdp: '10W', graphics: 'Intel® HD',          memorySupport: '4–8GB DDR3L',  storageSupport: '1× mSATA SSD',           baseModel: 'EPC-W1362A', basePrice: 28900 },
        { key: 'j6412',    label: 'Intel® Celeron® J6412',     cores: 4,  threads: 4,  freq: '2.0–2.6 GHz', cache: '1.5MB', tdp: '10W', graphics: 'Intel® UHD',         memorySupport: '4–16GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W1372A', basePrice: 33900 },
        { key: 'i3-10110u',label: 'Intel® Core™ i3-10110U',    cores: 2,  threads: 4,  freq: '2.1–4.1 GHz', cache: '4MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W1392A', basePrice: 42900 },
        { key: 'i5-10210u',label: 'Intel® Core™ i5-10210U',    cores: 4,  threads: 8,  freq: '1.6–4.2 GHz', cache: '6MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W1392A', basePrice: 49900 },
        { key: 'i7-10710u',label: 'Intel® Core™ i7-10710U',    cores: 6,  threads: 12, freq: '1.1–4.7 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W1392A', basePrice: 57900 },
        { key: 'i3-1215u', label: 'Intel® Core™ i3-1215U',     cores: 6,  threads: 8,  freq: '1.2–4.4 GHz', cache: '10MB',  tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1322A', basePrice: 52900 },
        { key: 'i5-1235u', label: 'Intel® Core™ i5-1235U',     cores: 10, threads: 12, freq: '1.3–4.4 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1322A', basePrice: 60900 },
        { key: 'i5-1240p', label: 'Intel® Core™ i5-1240P',     cores: 12, threads: 16, freq: '1.7–4.4 GHz', cache: '12MB',  tdp: '28W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1322A', basePrice: 67900 },
        { key: 'i7-1255u', label: 'Intel® Core™ i7-1255U',     cores: 10, threads: 12, freq: '1.7–4.7 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1322A', basePrice: 71900 },
      ],
      ram: [
        { key: 'r4',  label: '4GB',  addPrice: 0,    note: 'รวมในราคาเริ่มต้น' },
        { key: 'r8',  label: '8GB',  addPrice: 1500 },
        { key: 'r16', label: '16GB', addPrice: 3500, note: 'แนะนำสำหรับ Gen10/Gen12' },
        { key: 'r32', label: '32GB', addPrice: 7500, note: 'รองรับเฉพาะ Gen10/Gen12' },
      ],
      storage: [
        { key: 's128',  label: 'SSD 128GB',  addPrice: 0,    note: 'รวมในราคาเริ่มต้น' },
        { key: 's256',  label: 'SSD 256GB',  addPrice: 1200 },
        { key: 's512',  label: 'SSD 512GB',  addPrice: 2800 },
        { key: 's1024', label: 'SSD 1TB',    addPrice: 5500 },
        { key: 's2048', label: 'SSD 2TB',    addPrice: 11500, note: 'รองรับเฉพาะรุ่นที่มี 2× M.2' },
      ],
      touch: [
        { key: 'pcap',     label: 'P-CAP 10-point Multi-touch', addPrice: 0, note: 'มาตรฐาน — กระจกเต็มหน้า 6H' },
        { key: 'resistive',label: 'Resistive 5-wire Touch',     addPrice: 0, note: 'เหมาะกับงานสวมถุงมือ' },
      ],
      wireless: [
        { key: 'none',  label: 'ไม่ต้องการโมดูลไร้สาย',                addPrice: 0 },
        { key: 'wifi',  label: 'Wi-Fi + Bluetooth (M.2 2230) + Antenna', addPrice: 1800 },
        { key: '4g',    label: '4G LTE Full Netcom + SIM Slot',         addPrice: 3800 },
        { key: 'both',  label: 'Wi-Fi + 4G LTE (รวม 2 โมดูล)',           addPrice: 5200 },
      ],
      os: [
        { key: 'none',    label: 'ไม่ลง OS (ลูกค้าติดตั้งเอง)', addPrice: 0 },
        { key: 'win10',   label: 'Windows 10 IoT Enterprise',     addPrice: 4500, note: 'License แท้ + Activation' },
        { key: 'win11',   label: 'Windows 11 Pro',                addPrice: 4500, note: 'License แท้ + Activation' },
        { key: 'ubuntu',  label: 'Ubuntu 22.04 LTS',              addPrice: 0,    note: 'ฟรี — Long-term support' },
      ],
      tempRange: [
        { key: 'standard', label: 'อุณหภูมิใช้งาน 0 ~ 50°C',  addPrice: 0,    note: 'มาตรฐาน' },
        { key: 'wide',     label: 'Wide-Temp -40 ~ 70°C',     addPrice: 4500, note: 'สำหรับโรงงานหนัก/Outdoor' },
      ],
      powerInput: [
        { key: 'dc12',  label: 'DC 12V (3-pin Terminal Block)',  addPrice: 0, note: 'มาตรฐาน' },
        { key: 'dc936', label: 'Wide DC 9–36V Input',            addPrice: 1500, note: 'รองรับยานพาหนะ/UPS' },
      ],
      warranty: [
        { years: 1, label: 'รับประกัน 1 ปี', multiplier: 0     },
        { years: 2, label: 'รับประกัน 2 ปี', multiplier: 0.06  },
        { years: 3, label: 'รับประกัน 3 ปี', multiplier: 0.12  },
      ],
    },
    datasheetUrl: 'https://cesipc.com/wp-content/uploads/2025/08/EPC-W13X2A-EN.pdf',
    image: '/images/products/w13x2a/front.jpg',
    landingHref: '/epc-series#wide',
  },
  'epc-w15x2a': {
    slug: 'epc-w15x2a', model: 'EPC-W15X2A', series: 'EPC Panel PC', category: 'Touch Panel PC',
    tagline: '15.6" IP65 Fanless Industrial Panel PC — Popular Wide Series',
    intro: 'EPC-W15X2A คอมพิวเตอร์อุตสาหกรรมแบบจอสัมผัสฝังตัวขนาด 15.6" 16:9 Full HD (350 cd/m²) — รุ่นยอดนิยมที่มีขนาดจอกำลังดี โครงสร้าง 6061 Aluminum Alloy แบบ Fanless, IP65 ด้านหน้า รองรับ Intel® Celeron® จนถึง 12th Gen Core™ i7 พร้อม SafeCore™, TPM 2.0 และ BlockCore™ Modular เหมาะกับ HMI, MES Terminal, POS Premium, Andon Board และ Self-service Kiosk',
    highlights: [
      '15.6" Full HD (1920×1080) 350 cd/m² • Contrast 450:1',
      'P-CAP Touch 10 จุด • IP65 ด้านหน้า • 6H Hardness',
      'Fanless • อุณหภูมิทำงาน 0–50°C (Optional -40~70°C)',
      'CPU เลือกได้ Celeron® J1900/J6412 ถึง 12th Gen Core™ i7-1255U',
      'Dual Intel® I210 Gigabit LAN',
      '6× COM (4×RS-232 + 2×RS-485 DB9) • Dual Display HDMI+VGA',
      'Dual M.2 2280 NVMe + M.2 2230 Wi-Fi + Mini PCIe',
      'TPM 2.0 • SafeCore™ Power-loss Protection',
      'Wide DC Input 9–36V • โครงสร้าง 6061 Aluminum Alloy',
      'น้ำหนัก 6.1 kg • Compact 404 × 254 × 75 mm',
    ],
    specs: [{ label: 'Display', value: '15.6" 16:9 Full HD (1920×1080)' }, ...PANEL_COMMON_SPECS],
    specGroups: [
      {
        title: 'System Core',
        rows: [
          { label: 'CPU (Celeron)', value: 'Intel® Celeron® J1900 (2.0–2.42GHz) / J6412 (2.0–2.6GHz)' },
          { label: 'CPU (10th Gen)', value: 'Intel® Core™ i3-10110U / i5-10210U / i7-10710U' },
          { label: 'CPU (12th Gen)', value: 'Intel® Core™ i3-1215U / i5-1235U / i5-1240P / i7-1255U' },
          { label: 'Memory', value: '4–8GB DDR3L • 4–32GB DDR4 • 8–32GB DDR5 (ขึ้นกับรุ่น CPU)' },
          { label: 'Storage', value: 'M.2 2280 NVMe SSD (สูงสุด 2 ชุด)' },
          { label: 'Cooling', value: 'Fanless (ระบายความร้อนผ่านครีบอลูมิเนียม)' },
          { label: 'OS Support', value: 'Windows 10 / 11 • Linux Ubuntu' },
        ],
      },
      {
        title: 'I/O Ports',
        rows: [
          { label: 'USB 2.0', value: '5× USB 2.0 (หรือ 2× USB 2.0 ขึ้นกับรุ่น CPU)' },
          { label: 'USB 3.0', value: '1× USB 3.0 (หรือ 4× USB 3.0 ขึ้นกับรุ่น CPU)' },
          { label: 'COM', value: '4× RS-232 + 2× RS-485 (DB9)' },
          { label: 'Display', value: '1× HDMI + 1× VGA — Dual Display' },
          { label: 'Audio', value: '1× Audio Out + 1× Mic In' },
          { label: 'Ethernet', value: '2× 10/100/1000 Mbps Intel® I210 LAN' },
          { label: 'Expansion', value: '1× Mini PCIe • Dual M.2 2280 NVMe • M.2 2230 Wi-Fi' },
        ],
      },
      {
        title: 'LCD Display & Touch',
        rows: [
          { label: 'Panel Size', value: '15.6"' },
          { label: 'Resolution', value: '1920×1080 (Full HD) 16:9' },
          { label: 'Brightness', value: '350 cd/m²' },
          { label: 'Contrast', value: '450:1' },
          { label: 'Backlight Life', value: '> 50,000 ชั่วโมง' },
          { label: 'Touch Panel', value: 'Multi-touch P-CAP 10-point • 6H Hardness' },
          { label: 'Transmittance', value: '85%' },
          { label: 'Touch Controller', value: 'USB' },
        ],
      },
      {
        title: 'Wireless Communication',
        rows: [
          { label: 'Wi-Fi / Bluetooth', value: 'Wi-Fi + BT (M.2 2230)' },
          { label: 'Cellular', value: '4G LTE Full Network (Optional)' },
        ],
      },
      {
        title: 'Power Supply',
        rows: [
          { label: 'DC Input', value: '12V DC standard (รองรับ Wide 9–36V Optional) ผ่าน 3-pin Pluggable Terminal Block' },
          { label: 'Booting', value: 'AT / ATX • Auto Power-on after Power Recovery' },
          { label: 'Protection', value: 'CESIPC SafeCore™ Power-loss Protection' },
        ],
      },
      {
        title: 'Mechanical',
        rows: [
          { label: 'Dimensions', value: '404.2 (W) × 253.5 (D) × 75.1 (H) mm' },
          { label: 'Cutout', value: '388.0 × 237.3 mm' },
          { label: 'Weight', value: '6.1 kg' },
          { label: 'Material', value: 'High-Strength 6061 Aluminum Alloy' },
          { label: 'Mounting', value: 'Wall Mount / VESA Mount / Panel Mount' },
        ],
      },
      {
        title: 'Environmental',
        rows: [
          { label: 'Operating Temp', value: '0 ~ 50°C (Optional -40 ~ 70°C)' },
          { label: 'Storage Temp', value: '-10 ~ 60°C' },
          { label: 'Front Protection', value: 'IP65' },
        ],
      },
      {
        title: 'Security & Services',
        rows: [
          { label: 'Hardware Security', value: 'TPM 2.0' },
          { label: 'ODM Support', value: 'BIOS / Boot Logo / OEM Customization' },
          { label: 'Warranty', value: '12 เดือน — ขยายเป็น 24/36 เดือนได้' },
        ],
      },
    ],
    certifications: [
      { code: 'CE', description: 'European Conformity (EN 55032 & EN 55035)' },
      { code: 'FCC', description: 'Federal Communications Commission (USA)' },
      { code: 'BIS', description: 'Bureau of Indian Standards' },
    ],
    applications: [
      'HMI / SCADA — สถานีควบคุมสายการผลิต',
      'MES Terminal — เก็บข้อมูลโรงงานแบบ Real-time',
      'Food & Beverage — รองรับการล้างทำความสะอาด',
      'POS Premium / Self-service Kiosk',
      'Energy & Power — Substation Visualization',
      'Smart Logistics — Warehouse / Andon Board',
      'Medical Cart / Clinical Workstation',
      'Robotics & Machine Vision Interface',
    ],
    heroImages: [
      '/images/products/w15x2a/front.jpg',
      '/images/products/w15x2a/side-1.png',
      '/images/products/w15x2a/side-2.png',
      '/images/products/w15x2a/side-3.png',
      '/images/products/w15x2a/side-4.png',
      '/images/products/w15x2a/io-labels.png',
      '/images/products/w15x2a/dimensions-detail.png',
    ],
    productImages: [
      { src: '/images/products/w15x2a/dimensions-detail.png', alt: 'EPC-W15X2A Detailed Dimensions Drawing', caption: 'Dimensions: 404.2 × 253.5 × 75.1 mm • Cutout: 388.0 × 237.3 mm' },
      { src: '/images/products/w15x2a/io-labels.png', alt: 'EPC-W15X2A I/O Layout Diagram', caption: 'I/O Layout — COM, USB, HDMI, VGA, Dual LAN, Audio, Wi-Fi Antennas, DC In' },
    ],
    selectionTable: [
      { no: '1', model: 'EPC-W1562A', partNumber: 'C11.01.01.001', cpu: 'Intel® Celeron® J1900',     memory: '4GB',  storage: 'mSATA SSD 128GB' },
      { no: '2', model: 'EPC-W1572A', partNumber: 'C11.01.05.001', cpu: 'Intel® Celeron® J6412',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '3', model: 'EPC-W1592A', partNumber: 'C11.01.03.001', cpu: 'Intel® Core™ i3-10110U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '4', model: 'EPC-W1592A', partNumber: 'C11.01.03.002', cpu: 'Intel® Core™ i5-10210U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '5', model: 'EPC-W1592A', partNumber: 'C11.01.03.003', cpu: 'Intel® Core™ i7-10710U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '6', model: 'EPC-W1522A', partNumber: 'C11.01.04.001', cpu: 'Intel® Core™ i3-1215U',     memory: '16GB', storage: 'mSATA SSD 256GB' },
      { no: '7', model: 'EPC-W1522A', partNumber: 'C11.01.04.002', cpu: 'Intel® Core™ i5-1235U',     memory: '16GB', storage: 'mSATA SSD 256GB' },
      { no: '8', model: 'EPC-W1522A', partNumber: 'C11.01.04.003', cpu: 'Intel® Core™ i5-1240P',     memory: '16GB', storage: 'mSATA SSD 256GB' },
      { no: '9', model: 'EPC-W1522A', partNumber: 'C11.01.04.004', cpu: 'Intel® Core™ i7-1255U',     memory: '16GB', storage: 'mSATA SSD 256GB' },
    ],
    configurator: {
      cpus: [
        { key: 'j1900',    label: 'Intel® Celeron® J1900',     cores: 4,  threads: 4,  freq: '2.0–2.4 GHz', cache: '2MB',   tdp: '10W', graphics: 'Intel® HD',          memorySupport: '4–8GB DDR3L',  storageSupport: '1× M.2 SSD',             baseModel: 'EPC-W1562A', basePrice: 31900 },
        { key: 'j6412',    label: 'Intel® Celeron® J6412',     cores: 4,  threads: 4,  freq: '2.0–2.6 GHz', cache: '1.5MB', tdp: '10W', graphics: 'Intel® UHD',         memorySupport: '4–16GB DDR4',  storageSupport: '1× M.2 SSD',             baseModel: 'EPC-W1572A', basePrice: 36900 },
        { key: 'i3-10110u',label: 'Intel® Core™ i3-10110U',    cores: 2,  threads: 4,  freq: '2.1–4.1 GHz', cache: '4MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× M.2 SSD',             baseModel: 'EPC-W1592A', basePrice: 45900 },
        { key: 'i5-10210u',label: 'Intel® Core™ i5-10210U',    cores: 4,  threads: 8,  freq: '1.6–4.2 GHz', cache: '6MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× M.2 SSD',             baseModel: 'EPC-W1592A', basePrice: 53900 },
        { key: 'i7-10710u',label: 'Intel® Core™ i7-10710U',    cores: 6,  threads: 12, freq: '1.1–4.7 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× M.2 SSD',             baseModel: 'EPC-W1592A', basePrice: 61900 },
        { key: 'i3-1215u', label: 'Intel® Core™ i3-1215U',     cores: 6,  threads: 8,  freq: '1.2–4.4 GHz', cache: '10MB',  tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1522A', basePrice: 56900 },
        { key: 'i5-1235u', label: 'Intel® Core™ i5-1235U',     cores: 10, threads: 12, freq: '1.3–4.4 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1522A', basePrice: 64900 },
        { key: 'i5-1240p', label: 'Intel® Core™ i5-1240P',     cores: 12, threads: 16, freq: '1.7–4.4 GHz', cache: '12MB',  tdp: '28W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1522A', basePrice: 71900 },
        { key: 'i7-1255u', label: 'Intel® Core™ i7-1255U',     cores: 10, threads: 12, freq: '1.7–4.7 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1522A', basePrice: 75900 },
      ],
      ram: [
        { key: 'r4',  label: '4GB',  addPrice: 0,    note: 'รวมในราคาเริ่มต้น' },
        { key: 'r8',  label: '8GB',  addPrice: 1500 },
        { key: 'r16', label: '16GB', addPrice: 3500, note: 'แนะนำสำหรับ Gen10/Gen12' },
        { key: 'r32', label: '32GB', addPrice: 7500, note: 'รองรับเฉพาะ Gen10/Gen12' },
      ],
      storage: [
        { key: 's128',  label: 'SSD 128GB',  addPrice: 0,    note: 'รวมในราคาเริ่มต้น' },
        { key: 's256',  label: 'SSD 256GB',  addPrice: 1200 },
        { key: 's512',  label: 'SSD 512GB',  addPrice: 2800 },
        { key: 's1024', label: 'SSD 1TB',    addPrice: 5500 },
        { key: 's2048', label: 'SSD 2TB',    addPrice: 11500, note: 'รองรับเฉพาะรุ่นที่มี 2× M.2' },
      ],
      touch: [
        { key: 'pcap',     label: 'P-CAP 10-point Multi-touch', addPrice: 0, note: 'มาตรฐาน — กระจกเต็มหน้า 6H' },
        { key: 'resistive',label: 'Resistive 5-wire Touch',     addPrice: 0, note: 'เหมาะกับงานสวมถุงมือ' },
      ],
      wireless: [
        { key: 'none',  label: 'ไม่ต้องการโมดูลไร้สาย',                addPrice: 0 },
        { key: 'wifi',  label: 'Wi-Fi + Bluetooth (M.2 2230) + Antenna', addPrice: 1800 },
        { key: '4g',    label: '4G LTE Full Netcom + SIM Slot',         addPrice: 3800 },
        { key: 'both',  label: 'Wi-Fi + 4G LTE (รวม 2 โมดูล)',           addPrice: 5200 },
      ],
      os: [
        { key: 'none',    label: 'ไม่ลง OS (ลูกค้าติดตั้งเอง)', addPrice: 0 },
        { key: 'win10',   label: 'Windows 10 IoT Enterprise',     addPrice: 4500, note: 'License แท้ + Activation' },
        { key: 'win11',   label: 'Windows 11 Pro',                addPrice: 4500, note: 'License แท้ + Activation' },
        { key: 'ubuntu',  label: 'Ubuntu 22.04 LTS',              addPrice: 0,    note: 'ฟรี — Long-term support' },
      ],
      tempRange: [
        { key: 'standard', label: 'อุณหภูมิใช้งาน 0 ~ 50°C',  addPrice: 0,    note: 'มาตรฐาน' },
        { key: 'wide',     label: 'Wide-Temp -40 ~ 70°C',     addPrice: 4500, note: 'สำหรับโรงงานหนัก/Outdoor' },
      ],
      powerInput: [
        { key: 'dc12',  label: 'DC 12V (3-pin Terminal Block)',  addPrice: 0, note: 'มาตรฐาน' },
        { key: 'dc936', label: 'Wide DC 9–36V Input',            addPrice: 1500, note: 'รองรับยานพาหนะ/UPS' },
      ],
      warranty: [
        { years: 1, label: 'รับประกัน 1 ปี', multiplier: 0     },
        { years: 2, label: 'รับประกัน 2 ปี', multiplier: 0.06  },
        { years: 3, label: 'รับประกัน 3 ปี', multiplier: 0.12  },
      ],
    },
    datasheetUrl: 'https://cesipc.com/wp-content/uploads/2025/08/EPC-W15X2A-EN.pdf',
    image: '/images/products/w15x2a/front.jpg',
    landingHref: '/epc-series#wide',
    popular: true,
  },
  'epc-w18x2a': {
    slug: 'epc-w18x2a', model: 'EPC-W18X2A', series: 'EPC Panel PC', category: 'Touch Panel PC',
    tagline: '18.5" IP65 Fanless Industrial Panel PC — Mid Wide Series',
    intro: 'EPC-W18X2A คอมพิวเตอร์อุตสาหกรรมแบบจอสัมผัสฝังตัวขนาด 18.5" 16:9 Full HD (350 cd/m²) — โครงสร้าง 6061 Aluminum Alloy แบบ Fanless, IP65 ด้านหน้า รองรับ Intel® Celeron® จนถึง 12th Gen Core™ i7 พร้อม SafeCore™, TPM 2.0 และ BlockCore™ Modular เหมาะกับ HMI ขนาดกลาง, Andon Board, Self-service Kiosk และ Control Room ที่ต้องการมองเห็นชัดในระยะไกล',
    highlights: [
      '18.5" Full HD (1920×1080) 350 cd/m² • Contrast 450:1',
      'P-CAP Touch 10 จุด • IP65 ด้านหน้า • 6H Hardness',
      'Fanless • อุณหภูมิทำงาน 0–50°C (Optional -40~70°C)',
      'CPU เลือกได้ Celeron® J1900/J6412 ถึง 12th Gen Core™ i7-1255U',
      'Dual Intel® I210 Gigabit LAN',
      '6× COM (4×RS-232 + 2×RS-485 DB9) • Dual Display HDMI+VGA',
      'Dual M.2 2280 NVMe + M.2 2230 Wi-Fi + Mini PCIe',
      'TPM 2.0 • SafeCore™ Power-loss Protection',
      'Wide DC Input 9–36V • โครงสร้าง 6061 Aluminum Alloy',
      'น้ำหนัก 8.1 kg • Compact 472 × 292 × 75 mm',
    ],
    specs: [{ label: 'Display', value: '18.5" 16:9 Full HD (1920×1080)' }, ...PANEL_COMMON_SPECS],
    specGroups: [
      {
        title: 'System Core',
        rows: [
          { label: 'CPU (Celeron)', value: 'Intel® Celeron® J1900 (2.0–2.42GHz) / J6412 (2.0–2.6GHz)' },
          { label: 'CPU (10th Gen)', value: 'Intel® Core™ i3-10110U / i5-10210U / i7-10710U' },
          { label: 'CPU (12th Gen)', value: 'Intel® Core™ i3-1215U / i5-1235U / i5-1240P / i7-1255U' },
          { label: 'Memory', value: '4–8GB DDR3L • 4–32GB DDR4 • 4–32GB DDR5 (ขึ้นกับรุ่น CPU)' },
          { label: 'Storage', value: 'mSATA / M.2 2280 NVMe SSD (สูงสุด 2 ชุด)' },
          { label: 'Cooling', value: 'Fanless (ระบายความร้อนผ่านครีบอลูมิเนียม)' },
          { label: 'OS Support', value: 'Windows 10 / 11 • Linux Ubuntu' },
        ],
      },
      {
        title: 'I/O Ports',
        rows: [
          { label: 'USB 2.0', value: '5× USB 2.0 (หรือ 2× USB 2.0 ขึ้นกับรุ่น CPU)' },
          { label: 'USB 3.0', value: '1× USB 3.0 (หรือ 4× USB 3.0 ขึ้นกับรุ่น CPU)' },
          { label: 'COM', value: '4× RS-232 + 2× RS-485 (DB9)' },
          { label: 'Display', value: '1× HDMI + 1× VGA — Dual Display' },
          { label: 'Audio', value: '1× Audio Out + 1× Mic In' },
          { label: 'Ethernet', value: '2× 10/100/1000 Mbps Intel® I210 LAN' },
          { label: 'Expansion', value: '1× Mini PCIe • Dual M.2 2280 NVMe • M.2 2230 Wi-Fi' },
        ],
      },
      {
        title: 'LCD Display & Touch',
        rows: [
          { label: 'Panel Size', value: '18.5"' },
          { label: 'Resolution', value: '1920×1080 (Full HD) 16:9' },
          { label: 'Brightness', value: '350 cd/m²' },
          { label: 'Contrast', value: '450:1' },
          { label: 'Backlight Life', value: '> 50,000 ชั่วโมง' },
          { label: 'Touch Panel', value: 'Multi-touch P-CAP 10-point • 6H Hardness' },
          { label: 'Transmittance', value: '85%' },
          { label: 'Touch Controller', value: 'USB' },
        ],
      },
      {
        title: 'Wireless Communication',
        rows: [
          { label: 'Wi-Fi / Bluetooth', value: 'Wi-Fi + BT (M.2 2230)' },
          { label: 'Cellular', value: '4G LTE Full Network (Optional)' },
        ],
      },
      {
        title: 'Power Supply',
        rows: [
          { label: 'DC Input', value: '12V DC standard (รองรับ Wide 9–36V Optional) ผ่าน 3-pin Pluggable Terminal Block' },
          { label: 'Booting', value: 'AT / ATX • Auto Power-on after Power Recovery' },
          { label: 'Protection', value: 'CESIPC SafeCore™ Power-loss Protection' },
        ],
      },
      {
        title: 'Mechanical',
        rows: [
          { label: 'Dimensions', value: '471.6 (W) × 291.9 (D) × 75.1 (H) mm' },
          { label: 'Cutout', value: '452.2 × 272.5 mm' },
          { label: 'Weight', value: '8.1 kg' },
          { label: 'Material', value: 'High-Strength 6061 Aluminum Alloy' },
          { label: 'Mounting', value: 'Wall Mount / VESA Mount / Panel Mount' },
        ],
      },
      {
        title: 'Environmental',
        rows: [
          { label: 'Operating Temp', value: '0 ~ 50°C (Optional -40 ~ 70°C)' },
          { label: 'Storage Temp', value: '-10 ~ 60°C' },
          { label: 'Front Protection', value: 'IP65' },
        ],
      },
      {
        title: 'Security & Services',
        rows: [
          { label: 'Hardware Security', value: 'TPM 2.0' },
          { label: 'ODM Support', value: 'BIOS / Boot Logo / OEM Customization' },
          { label: 'Warranty', value: '12 เดือน — ขยายเป็น 24/36 เดือนได้' },
        ],
      },
    ],
    certifications: [
      { code: 'CE', description: 'European Conformity (EN 55032 & EN 55035)' },
      { code: 'FCC', description: 'Federal Communications Commission (USA)' },
      { code: 'BIS', description: 'Bureau of Indian Standards' },
    ],
    applications: [
      'HMI / SCADA — สถานีควบคุมสายการผลิต',
      'MES Terminal — เก็บข้อมูลโรงงานแบบ Real-time',
      'Andon Board — แสดงสถานะสายการผลิต',
      'Self-service Kiosk ขนาดกลาง',
      'Control Room — Visualization Display',
      'Smart Logistics — Warehouse Display',
      'Energy & Power — Substation Monitoring',
    ],
    heroImages: [
      '/images/products/w18x2a/front.jpg',
      '/images/products/w18x2a/side-1.png',
      '/images/products/w18x2a/side-2.png',
      '/images/products/w18x2a/side-3.png',
      '/images/products/w18x2a/side-4.png',
      '/images/products/w18x2a/side-5.png',
      '/images/products/w18x2a/io-labels.png',
      '/images/products/w18x2a/dimensions-detail.png',
    ],
    productImages: [
      { src: '/images/products/w18x2a/dimensions-detail.png', alt: 'EPC-W18X2A Detailed Dimensions Drawing', caption: 'Dimensions: 471.6 × 291.9 × 75.1 mm • Cutout: 452.2 × 272.5 mm' },
      { src: '/images/products/w18x2a/io-labels.png', alt: 'EPC-W18X2A I/O Layout Diagram', caption: 'I/O Layout — COM, USB, HDMI, VGA, Dual LAN, Audio, Wi-Fi Antennas, DC In' },
    ],
    selectionTable: [
      { no: '1', model: 'EPC-W1862A', partNumber: 'C11.01.01.001', cpu: 'Intel® Celeron® J1900',     memory: '4GB',  storage: 'mSATA SSD 128GB' },
      { no: '2', model: 'EPC-W1872A', partNumber: 'C11.01.05.001', cpu: 'Intel® Celeron® J6412',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '3', model: 'EPC-W1892A', partNumber: 'C11.01.03.001', cpu: 'Intel® Core™ i3-10110U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '4', model: 'EPC-W1892A', partNumber: 'C11.01.03.002', cpu: 'Intel® Core™ i5-10210U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '5', model: 'EPC-W1892A', partNumber: 'C11.01.03.003', cpu: 'Intel® Core™ i7-10710U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '6', model: 'EPC-W1822A', partNumber: 'C11.01.04.001', cpu: 'Intel® Core™ i3-1215U',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '7', model: 'EPC-W1822A', partNumber: 'C11.01.04.002', cpu: 'Intel® Core™ i5-1235U',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '8', model: 'EPC-W1822A', partNumber: 'C11.01.04.003', cpu: 'Intel® Core™ i5-1240P',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '9', model: 'EPC-W1822A', partNumber: 'C11.01.04.004', cpu: 'Intel® Core™ i7-1255U',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
    ],
    configurator: {
      cpus: [
        { key: 'j1900',    label: 'Intel® Celeron® J1900',     cores: 4,  threads: 4,  freq: '2.0–2.4 GHz', cache: '2MB',   tdp: '10W', graphics: 'Intel® HD',          memorySupport: '4–8GB DDR3L',  storageSupport: '1× mSATA SSD',           baseModel: 'EPC-W1862A', basePrice: 33900 },
        { key: 'j6412',    label: 'Intel® Celeron® J6412',     cores: 4,  threads: 4,  freq: '2.0–2.6 GHz', cache: '1.5MB', tdp: '10W', graphics: 'Intel® UHD',         memorySupport: '4–16GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W1872A', basePrice: 39900 },
        { key: 'i3-10110u',label: 'Intel® Core™ i3-10110U',    cores: 2,  threads: 4,  freq: '2.1–4.1 GHz', cache: '4MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W1892A', basePrice: 48900 },
        { key: 'i5-10210u',label: 'Intel® Core™ i5-10210U',    cores: 4,  threads: 8,  freq: '1.6–4.2 GHz', cache: '6MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W1892A', basePrice: 56900 },
        { key: 'i7-10710u',label: 'Intel® Core™ i7-10710U',    cores: 6,  threads: 12, freq: '1.1–4.7 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W1892A', basePrice: 64900 },
        { key: 'i3-1215u', label: 'Intel® Core™ i3-1215U',     cores: 6,  threads: 8,  freq: '1.2–4.4 GHz', cache: '10MB',  tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1822A', basePrice: 59900 },
        { key: 'i5-1235u', label: 'Intel® Core™ i5-1235U',     cores: 10, threads: 12, freq: '1.3–4.4 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1822A', basePrice: 68900 },
        { key: 'i5-1240p', label: 'Intel® Core™ i5-1240P',     cores: 12, threads: 16, freq: '1.7–4.4 GHz', cache: '12MB',  tdp: '28W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1822A', basePrice: 75900 },
        { key: 'i7-1255u', label: 'Intel® Core™ i7-1255U',     cores: 10, threads: 12, freq: '1.7–4.7 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W1822A', basePrice: 80900 },
      ],
      ram: [
        { key: 'r4',  label: '4GB',  addPrice: 0,    note: 'รวมในราคาเริ่มต้น' },
        { key: 'r8',  label: '8GB',  addPrice: 1500 },
        { key: 'r16', label: '16GB', addPrice: 3500, note: 'แนะนำสำหรับ Gen10/Gen12' },
        { key: 'r32', label: '32GB', addPrice: 7500, note: 'รองรับเฉพาะ Gen10/Gen12' },
      ],
      storage: [
        { key: 's128',  label: 'SSD 128GB',  addPrice: 0,    note: 'รวมในราคาเริ่มต้น' },
        { key: 's256',  label: 'SSD 256GB',  addPrice: 1200 },
        { key: 's512',  label: 'SSD 512GB',  addPrice: 2800 },
        { key: 's1024', label: 'SSD 1TB',    addPrice: 5500 },
        { key: 's2048', label: 'SSD 2TB',    addPrice: 11500, note: 'รองรับเฉพาะรุ่นที่มี 2× M.2' },
      ],
      touch: [
        { key: 'pcap',     label: 'P-CAP 10-point Multi-touch', addPrice: 0, note: 'มาตรฐาน — กระจกเต็มหน้า 6H' },
        { key: 'resistive',label: 'Resistive 5-wire Touch',     addPrice: 0, note: 'เหมาะกับงานสวมถุงมือ' },
      ],
      wireless: [
        { key: 'none',  label: 'ไม่ต้องการโมดูลไร้สาย',                addPrice: 0 },
        { key: 'wifi',  label: 'Wi-Fi + Bluetooth (M.2 2230) + Antenna', addPrice: 1800 },
        { key: '4g',    label: '4G LTE Full Netcom + SIM Slot',         addPrice: 3800 },
        { key: 'both',  label: 'Wi-Fi + 4G LTE (รวม 2 โมดูล)',           addPrice: 5200 },
      ],
      os: [
        { key: 'none',    label: 'ไม่ลง OS (ลูกค้าติดตั้งเอง)', addPrice: 0 },
        { key: 'win10',   label: 'Windows 10 IoT Enterprise',     addPrice: 4500, note: 'License แท้ + Activation' },
        { key: 'win11',   label: 'Windows 11 Pro',                addPrice: 4500, note: 'License แท้ + Activation' },
        { key: 'ubuntu',  label: 'Ubuntu 22.04 LTS',              addPrice: 0,    note: 'ฟรี — Long-term support' },
      ],
      tempRange: [
        { key: 'standard', label: 'อุณหภูมิใช้งาน 0 ~ 50°C',  addPrice: 0,    note: 'มาตรฐาน' },
        { key: 'wide',     label: 'Wide-Temp -40 ~ 70°C',     addPrice: 4500, note: 'สำหรับโรงงานหนัก/Outdoor' },
      ],
      powerInput: [
        { key: 'dc12',  label: 'DC 12V (3-pin Terminal Block)',  addPrice: 0, note: 'มาตรฐาน' },
        { key: 'dc936', label: 'Wide DC 9–36V Input',            addPrice: 1500, note: 'รองรับยานพาหนะ/UPS' },
      ],
      warranty: [
        { years: 1, label: 'รับประกัน 1 ปี', multiplier: 0     },
        { years: 2, label: 'รับประกัน 2 ปี', multiplier: 0.06  },
        { years: 3, label: 'รับประกัน 3 ปี', multiplier: 0.12  },
      ],
    },
    datasheetUrl: 'https://cesipc.com/wp-content/uploads/2025/08/EPC-W18X2A-EN.pdf',
    image: '/images/products/w18x2a/front.jpg',
    landingHref: '/epc-series#wide',
  },
  'epc-w21x2a': {
    slug: 'epc-w21x2a', model: 'EPC-W21X2A', series: 'EPC Panel PC', category: 'Touch Panel PC',
    tagline: '21.5" IP65 Fanless Industrial Panel PC — Wide Series',
    intro: 'EPC-W21X2A คอมพิวเตอร์อุตสาหกรรมแบบจอสัมผัสฝังตัวขนาด 21.5" 16:9 Full HD (350 cd/m²) — ออกแบบมาตามมาตรฐานโรงงาน CESIPC ด้วยโครงสร้าง 6061 Aluminum Alloy แบบ Fanless, IP65 ด้านหน้า, รองรับโปรเซสเซอร์ Intel® Celeron® จนถึง 12th Gen Intel® Core™ i7 พร้อมระบบป้องกันไฟฟ้าตก SafeCore™, TPM 2.0 และสถาปัตยกรรมโมดูลาร์ BlockCore™ ของ CESIPC เหมาะสำหรับงาน HMI, SCADA, MES, Control Room, Andon Board และ Self-service Kiosk ที่ต้องการความเสถียรสูงตลอด 24/7',
    highlights: [
      '21.5" Full HD (1920×1080) 350 cd/m² • Contrast 450:1',
      'P-CAP Touch 10 จุด • IP65 ด้านหน้า • 6H Hardness',
      'Fanless • อุณหภูมิทำงาน 0–50°C (Optional -40~70°C)',
      'CPU เลือกได้ Celeron® J1900/J6412 ถึง 12th Gen Core™ i7-1255U',
      'Dual Intel® I210 Gigabit LAN',
      '6× COM (4×RS-232 + 2×RS-485 DB9) • Dual Display HDMI+VGA',
      'Dual M.2 2280 NVMe + M.2 2230 Wi-Fi + Mini PCIe',
      'TPM 2.0 • SafeCore™ Power-loss Protection',
      'Wide DC Input 9–36V • โครงสร้าง 6061 Aluminum Alloy',
      'BlockCore™ Modular Design — เปลี่ยน CPU/RAM ได้ตลอดอายุการใช้งาน',
    ],
    specs: [{ label: 'Display', value: '21.5" 16:9 Full HD (1920×1080)' }, ...PANEL_COMMON_SPECS],
    specGroups: [
      {
        title: 'System Core',
        rows: [
          { label: 'CPU (Celeron)', value: 'Intel® Celeron® J1900 (2.0–2.42GHz) / J6412 (2.0–2.6GHz)' },
          { label: 'CPU (10th Gen)', value: 'Intel® Core™ i3-10110U / i5-10210U / i7-10710U' },
          { label: 'CPU (12th Gen)', value: 'Intel® Core™ i3-1215U / i5-1235U / i5-1240P / i7-1255U' },
          { label: 'Memory', value: '4–8GB DDR3L • 4–32GB DDR4 • 4–32GB DDR5 (ขึ้นกับรุ่น CPU)' },
          { label: 'Storage', value: 'mSATA / M.2 2280 NVMe SSD (สูงสุด 2 ชุด)' },
          { label: 'Cooling', value: 'Fanless (ระบายความร้อนผ่านครีบอลูมิเนียม)' },
          { label: 'OS Support', value: 'Windows 10 / 11 • Linux Ubuntu' },
        ],
      },
      {
        title: 'I/O Ports',
        rows: [
          { label: 'USB 2.0', value: '5× USB 2.0 (หรือ 2× USB 2.0 ขึ้นกับรุ่น CPU)' },
          { label: 'USB 3.0', value: '1× USB 3.0 (หรือ 4× USB 3.0 ขึ้นกับรุ่น CPU)' },
          { label: 'COM', value: '4× RS-232 + 2× RS-485 (DB9)' },
          { label: 'Display', value: '1× HDMI + 1× VGA — Dual Display' },
          { label: 'Audio', value: '1× Audio Out + 1× Mic In' },
          { label: 'Ethernet', value: '2× 10/100/1000 Mbps Intel® I210 LAN' },
          { label: 'Expansion', value: '1× Mini PCIe • Dual M.2 2280 NVMe • M.2 2230 Wi-Fi' },
        ],
      },
      {
        title: 'LCD Display & Touch',
        rows: [
          { label: 'Panel Size', value: '21.5"' },
          { label: 'Resolution', value: '1920×1080 (Full HD) 16:9' },
          { label: 'Brightness', value: '350 cd/m²' },
          { label: 'Contrast', value: '450:1' },
          { label: 'Backlight Life', value: '> 50,000 ชั่วโมง' },
          { label: 'Touch Panel', value: 'Multi-touch P-CAP 10-point • 6H Hardness' },
          { label: 'Transmittance', value: '85%' },
          { label: 'Touch Controller', value: 'USB' },
        ],
      },
      {
        title: 'Wireless Communication',
        rows: [
          { label: 'Wi-Fi / Bluetooth', value: 'Wi-Fi + BT (M.2 2230)' },
          { label: 'Cellular', value: '4G LTE Full Network (Optional)' },
        ],
      },
      {
        title: 'Power Supply',
        rows: [
          { label: 'DC Input', value: '12V DC standard (รองรับ Wide 9–36V Optional) ผ่าน 3-pin Pluggable Terminal Block' },
          { label: 'Booting', value: 'AT / ATX • Auto Power-on after Power Recovery' },
          { label: 'Protection', value: 'CESIPC SafeCore™ Power-loss Protection' },
        ],
      },
      {
        title: 'Mechanical',
        rows: [
          { label: 'Dimensions', value: '534.6 (W) × 326.1 (D) × 75.1 (H) mm' },
          { label: 'Cutout', value: '516.6 × 308.1 mm' },
          { label: 'Weight', value: '10.1 kg' },
          { label: 'Material', value: 'High-Strength 6061 Aluminum Alloy' },
          { label: 'Mounting', value: 'Wall Mount / VESA Mount / Panel Mount (4-M4)' },
        ],
      },
      {
        title: 'Environmental',
        rows: [
          { label: 'Operating Temp', value: '0 ~ 50°C (Optional -40 ~ 70°C)' },
          { label: 'Storage Temp', value: '-10 ~ 60°C' },
          { label: 'Front Protection', value: 'IP65' },
        ],
      },
      {
        title: 'Security & Services',
        rows: [
          { label: 'Hardware Security', value: 'TPM 2.0' },
          { label: 'ODM Support', value: 'BIOS / Boot Logo / OEM Customization' },
          { label: 'Warranty', value: '12 เดือน — ขยายเป็น 24/36 เดือนได้' },
        ],
      },
    ],
    certifications: [
      { code: 'CE', description: 'European Conformity (EN 55032 & EN 55035)' },
      { code: 'FCC', description: 'Federal Communications Commission (USA)' },
      { code: 'BIS', description: 'Bureau of Indian Standards' },
    ],
    applications: [
      'HMI / SCADA — สถานีควบคุมสายการผลิต',
      'MES Terminal — เก็บข้อมูลโรงงานแบบ Real-time',
      'Food & Beverage — รองรับการล้างทำความสะอาด',
      'Chemical / Pharmaceutical — Anti-corrosion (Optional)',
      'Energy & Power — Substation Visualization',
      'Smart Logistics — Warehouse / Andon Board',
      'Self-service Kiosk',
      'Robotics & Machine Vision Interface',
    ],
    heroImages: [
      '/images/products/w21x2a/front.jpg',
      '/images/products/w21x2a/side-profile.jpg',
      '/images/products/w21x2a/side-io-rear.jpg',
      '/images/products/w21x2a/side-io-com.jpg',
      '/images/products/w21x2a/io-labels.png',
      '/images/products/w21x2a/dimensions-detail.png',
    ],
    productImages: [
      { src: '/images/products/w21x2a/dimensions-detail.png', alt: 'EPC-W21X2A Detailed Dimensions Drawing', caption: 'Dimensions: 534.6 × 326.1 × 75.1 mm • Cutout: 516.6 × 308.1 mm • Mounting Holes 4-M4' },
      { src: '/images/products/w21x2a/io-labels.png', alt: 'EPC-W21X2A I/O Layout Diagram', caption: 'I/O Layout — COM1–5, USB1–6, HDMI, VGA, Dual LAN, Audio, Wi-Fi Antennas, DC In' },
    ],
    selectionTable: [
      { no: '1', model: 'EPC-W2162A', partNumber: 'C11.01.01.001', cpu: 'Intel® Celeron® J1900',     memory: '4GB',  storage: 'mSATA SSD 128GB' },
      { no: '2', model: 'EPC-W2172A', partNumber: 'C11.01.05.001', cpu: 'Intel® Celeron® J6412',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '3', model: 'EPC-W2192A', partNumber: 'C11.01.03.001', cpu: 'Intel® Core™ i3-10110U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '4', model: 'EPC-W2192A', partNumber: 'C11.01.03.002', cpu: 'Intel® Core™ i5-10210U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '5', model: 'EPC-W2192A', partNumber: 'C11.01.03.003', cpu: 'Intel® Core™ i7-10710U',    memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '6', model: 'EPC-W2122A', partNumber: 'C11.01.04.001', cpu: 'Intel® Core™ i3-1215U',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '7', model: 'EPC-W2122A', partNumber: 'C11.01.04.002', cpu: 'Intel® Core™ i5-1235U',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
      { no: '8', model: 'EPC-W2122A', partNumber: 'C11.01.04.004', cpu: 'Intel® Core™ i7-1255U',     memory: '8GB',  storage: 'mSATA SSD 256GB' },
    ],
    configurator: {
      cpus: [
        { key: 'j1900',    label: 'Intel® Celeron® J1900',     cores: 4,  threads: 4,  freq: '2.0–2.4 GHz', cache: '2MB',   tdp: '10W', graphics: 'Intel® HD',          memorySupport: '4–8GB DDR3L',  storageSupport: '1× mSATA SSD',           baseModel: 'EPC-W2162A', basePrice: 35900 },
        { key: 'j6412',    label: 'Intel® Celeron® J6412',     cores: 4,  threads: 4,  freq: '2.0–2.6 GHz', cache: '1.5MB', tdp: '10W', graphics: 'Intel® UHD',         memorySupport: '4–16GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W2172A', basePrice: 41900 },
        { key: 'i3-10110u',label: 'Intel® Core™ i3-10110U',    cores: 2,  threads: 4,  freq: '2.1–4.1 GHz', cache: '4MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W2192A', basePrice: 51900 },
        { key: 'i5-10210u',label: 'Intel® Core™ i5-10210U',    cores: 4,  threads: 8,  freq: '1.6–4.2 GHz', cache: '6MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W2192A', basePrice: 59900 },
        { key: 'i7-10710u',label: 'Intel® Core™ i7-10710U',    cores: 6,  threads: 12, freq: '1.1–4.7 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W2192A', basePrice: 68900 },
        { key: 'i3-1215u', label: 'Intel® Core™ i3-1215U',     cores: 6,  threads: 8,  freq: '1.2–4.4 GHz', cache: '10MB',  tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W2122A', basePrice: 62900 },
        { key: 'i5-1235u', label: 'Intel® Core™ i5-1235U',     cores: 10, threads: 12, freq: '1.3–4.4 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W2122A', basePrice: 72900 },
        { key: 'i5-1240p', label: 'Intel® Core™ i5-1240P',     cores: 12, threads: 16, freq: '1.7–4.4 GHz', cache: '12MB',  tdp: '28W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W2122A', basePrice: 79900 },
        { key: 'i7-1255u', label: 'Intel® Core™ i7-1255U',     cores: 10, threads: 12, freq: '1.7–4.7 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W2122A', basePrice: 84900 },
      ],
      ram: [
        { key: 'r4',  label: '4GB',  addPrice: 0,    note: 'รวมในราคาเริ่มต้น' },
        { key: 'r8',  label: '8GB',  addPrice: 1500 },
        { key: 'r16', label: '16GB', addPrice: 3500, note: 'แนะนำสำหรับ Gen10/Gen12' },
        { key: 'r32', label: '32GB', addPrice: 7500, note: 'รองรับเฉพาะ Gen10/Gen12' },
      ],
      storage: [
        { key: 's128',  label: 'SSD 128GB',  addPrice: 0,    note: 'รวมในราคาเริ่มต้น' },
        { key: 's256',  label: 'SSD 256GB',  addPrice: 1200 },
        { key: 's512',  label: 'SSD 512GB',  addPrice: 2800 },
        { key: 's1024', label: 'SSD 1TB',    addPrice: 5500 },
        { key: 's2048', label: 'SSD 2TB',    addPrice: 11500, note: 'รองรับเฉพาะรุ่นที่มี 2× M.2' },
      ],
      touch: [
        { key: 'pcap',     label: 'P-CAP 10-point Multi-touch', addPrice: 0, note: 'มาตรฐาน — กระจกเต็มหน้า 6H' },
        { key: 'resistive',label: 'Resistive 5-wire Touch',     addPrice: 0, note: 'เหมาะกับงานสวมถุงมือ' },
      ],
      wireless: [
        { key: 'none',  label: 'ไม่ต้องการโมดูลไร้สาย',                addPrice: 0 },
        { key: 'wifi',  label: 'Wi-Fi + Bluetooth (M.2 2230) + Antenna', addPrice: 1800 },
        { key: '4g',    label: '4G LTE Full Netcom + SIM Slot',         addPrice: 3800 },
        { key: 'both',  label: 'Wi-Fi + 4G LTE (รวม 2 โมดูล)',           addPrice: 5200 },
      ],
      os: [
        { key: 'none',    label: 'ไม่ลง OS (ลูกค้าติดตั้งเอง)', addPrice: 0 },
        { key: 'win10',   label: 'Windows 10 IoT Enterprise',     addPrice: 4500, note: 'License แท้ + Activation' },
        { key: 'win11',   label: 'Windows 11 Pro',                addPrice: 4500, note: 'License แท้ + Activation' },
        { key: 'ubuntu',  label: 'Ubuntu 22.04 LTS',              addPrice: 0,    note: 'ฟรี — Long-term support' },
      ],
      tempRange: [
        { key: 'standard', label: 'อุณหภูมิใช้งาน 0 ~ 50°C',  addPrice: 0,    note: 'มาตรฐาน' },
        { key: 'wide',     label: 'Wide-Temp -40 ~ 70°C',     addPrice: 4500, note: 'สำหรับโรงงานหนัก/Outdoor' },
      ],
      powerInput: [
        { key: 'dc12',  label: 'DC 12V (3-pin Terminal Block)',  addPrice: 0, note: 'มาตรฐาน' },
        { key: 'dc936', label: 'Wide DC 9–36V Input',            addPrice: 1500, note: 'รองรับยานพาหนะ/UPS' },
      ],
      warranty: [
        { years: 1, label: 'รับประกัน 1 ปี', multiplier: 0     },
        { years: 2, label: 'รับประกัน 2 ปี', multiplier: 0.06  },
        { years: 3, label: 'รับประกัน 3 ปี', multiplier: 0.12  },
      ],
    },
    datasheetUrl: 'https://cesipc.com/wp-content/uploads/2025/08/EPC-W21X2A-EN.pdf',
    image: '/images/products/w21x2a/front.jpg',
    landingHref: '/epc-series#wide',
    popular: true,
  },
  'epc-w24x2a': {
    slug: 'epc-w24x2a', model: 'EPC-W24X2A', series: 'EPC Panel PC', category: 'Touch Panel PC',
    tagline: '23.6" IP65 Fanless Industrial Panel PC — Flagship Wide Series',
    intro: 'EPC-W24X2A คอมพิวเตอร์อุตสาหกรรมแบบจอสัมผัสฝังตัวขนาด 23.6" 16:9 Full HD — ออกแบบมาตามมาตรฐานโรงงาน CESIPC ด้วยโครงสร้าง 6061 Aluminum Alloy แบบ Fanless, IP65 ด้านหน้า, รองรับโปรเซสเซอร์ Intel® Celeron® จนถึง 12th Gen Intel® Core™ i7 พร้อมระบบป้องกันไฟฟ้าตก SafeCore™, TPM 2.0 และสถาปัตยกรรมโมดูลาร์ BlockCore™ ของ CESIPC เหมาะสำหรับงาน HMI, SCADA, MES, Control Room, Andon Board และ Self-service Kiosk ระดับพรีเมียมที่ต้องการความเสถียรสูงตลอด 24/7',
    highlights: [
      '23.6" Full HD (1920×1080) 350 cd/m²',
      'P-CAP Touch 10 จุด • IP65 ด้านหน้า • 6H',
      'Fanless • อุณหภูมิทำงาน 0–50°C (Optional -40~70°C)',
      'CPU เลือกได้ Celeron® J1900/J6412 ถึง 12th Gen Core™ i7',
      'Dual Intel® I210/I211 Gigabit LAN',
      '6× COM (4×RS-232 + 2×RS-485) • Dual Display HDMI+VGA',
      'Dual M.2 2280 NVMe + M.2 2230 Wi-Fi',
      'TPM 2.0 • SafeCore™ Power-loss Protection',
      'โครงสร้าง 6061 Aluminum Alloy • น้ำหนัก 12.1 kg',
      'BlockCore™ Modular Design — เปลี่ยน CPU/RAM ได้ตลอดอายุการใช้งาน',
    ],
    specs: [{ label: 'Display', value: '23.6" 16:9 Full HD (1920×1080)' }, ...PANEL_COMMON_SPECS],
    specGroups: [
      {
        title: 'System Core',
        rows: [
          { label: 'CPU (Celeron)', value: 'Intel® Celeron® J1900 (2.0–2.42GHz) / J6412 (2.0–2.6GHz)' },
          { label: 'CPU (10th Gen)', value: 'Intel® Core™ i3-10110U / i5-10210U / i7-10710U' },
          { label: 'CPU (12th Gen)', value: 'Intel® Core™ i3-1215U / i5-1235U / i5-1240P / i7-1255U' },
          { label: 'Memory', value: '4–8GB DDR3L • 4–32GB DDR4 • 4–32GB DDR5 (ขึ้นกับรุ่น CPU)' },
          { label: 'Storage', value: 'mSATA / M.2 2280 NVMe SSD (สูงสุด 2 ชุด)' },
          { label: 'Cooling', value: 'Fanless (ระบายความร้อนผ่านครีบอลูมิเนียม)' },
          { label: 'OS Support', value: 'Windows 10 / 11 • Linux Ubuntu' },
        ],
      },
      {
        title: 'I/O Ports',
        rows: [
          { label: 'USB 2.0', value: '5× USB 2.0 (หรือ 2× USB 2.0 ขึ้นกับรุ่น CPU)' },
          { label: 'USB 3.0', value: '1× USB 3.0 (หรือ 4× USB 3.0 ขึ้นกับรุ่น CPU)' },
          { label: 'COM', value: '4× RS-232 + 2× RS-485 (DB9)' },
          { label: 'Display', value: '1× HDMI + 1× VGA — Dual Display' },
          { label: 'Audio', value: '1× Audio Out + 1× Mic In' },
          { label: 'Ethernet', value: '2× 10/100/1000 Mbps Intel® I210/I211 LAN' },
          { label: 'Expansion', value: '1× Mini PCIe • Dual M.2 2280 NVMe • M.2 2230 Wi-Fi' },
        ],
      },
      {
        title: 'LCD Display & Touch',
        rows: [
          { label: 'Panel Size', value: '23.6"' },
          { label: 'Resolution', value: '1920×1080 (Full HD) 16:9' },
          { label: 'Brightness', value: '350 cd/m²' },
          { label: 'Contrast', value: '450:1' },
          { label: 'Backlight Life', value: '> 50,000 ชั่วโมง' },
          { label: 'Touch Panel', value: 'Multi-touch P-CAP 10-point • 6H Hardness' },
          { label: 'Transmittance', value: '85%' },
          { label: 'Touch Controller', value: 'USB' },
        ],
      },
      {
        title: 'Wireless Communication',
        rows: [
          { label: 'Wi-Fi / Bluetooth', value: 'Wi-Fi + BT (M.2 2230)' },
          { label: 'Cellular', value: '4G LTE Full Network (Optional)' },
        ],
      },
      {
        title: 'Power Supply',
        rows: [
          { label: 'DC Input', value: '12V DC (รองรับ 9–36V Wide Input — Optional) ผ่าน 3-pin Pluggable Terminal' },
          { label: 'Booting', value: 'AT / ATX • Auto Power-on after Power Recovery' },
          { label: 'Protection', value: 'CESIPC SafeCore™ Power-loss Protection' },
        ],
      },
      {
        title: 'Mechanical',
        rows: [
          { label: 'Dimensions', value: '589.3 (W) × 361.2 (D) × 75.1 (H) mm' },
          { label: 'Cutout', value: '562.7 × 338.4 mm' },
          { label: 'Weight', value: '12.1 kg' },
          { label: 'Material', value: 'High-Strength 6061 Aluminum Alloy' },
          { label: 'Mounting', value: 'Wall Mount / VESA Mount / Panel Mount' },
        ],
      },
      {
        title: 'Environmental',
        rows: [
          { label: 'Operating Temp', value: '0 ~ 50°C (Optional -40 ~ 70°C)' },
          { label: 'Storage Temp', value: '-10 ~ 60°C' },
          { label: 'Front Protection', value: 'IP65' },
        ],
      },
      {
        title: 'Security & Services',
        rows: [
          { label: 'Hardware Security', value: 'TPM 2.0' },
          { label: 'ODM Support', value: 'BIOS / Boot Logo / OEM Customization' },
          { label: 'Warranty', value: '12 เดือน — ขยายเป็น 24/36 เดือนได้' },
        ],
      },
    ],
    options: [
      {
        label: 'CPU',
        choices: [
          'Intel® Celeron® J1900 (Entry • 4-core 2.0GHz)',
          'Intel® Celeron® J6412 (Elkhart Lake • 4-core 2.0GHz)',
          'Intel® Core™ i3-10110U (10th Gen)',
          'Intel® Core™ i5-10210U (10th Gen)',
          'Intel® Core™ i7-10710U (10th Gen • 6-core)',
          'Intel® Core™ i3-1215U (12th Gen)',
          'Intel® Core™ i5-1235U (12th Gen)',
          'Intel® Core™ i5-1240P (12th Gen • Performance)',
          'Intel® Core™ i7-1255U (12th Gen • แนะนำ)',
        ],
      },
      {
        label: 'Memory (RAM)',
        choices: ['4GB', '8GB', '16GB', '32GB'],
        note: 'ชนิด DDR3L / DDR4 / DDR5 ขึ้นกับรุ่น CPU ที่เลือก',
      },
      {
        label: 'Storage (SSD)',
        choices: [
          'mSATA SSD 128GB',
          'mSATA SSD 256GB',
          'M.2 NVMe 256GB',
          'M.2 NVMe 512GB',
          'M.2 NVMe 1TB',
          'Dual SSD (RAID-0/1) — Optional',
        ],
      },
      {
        label: 'Wi-Fi / Bluetooth',
        choices: ['ไม่ติดตั้ง', 'Wi-Fi 5 + BT 5.0', 'Wi-Fi 6 + BT 5.2'],
      },
      {
        label: 'Cellular (4G LTE)',
        choices: ['ไม่ติดตั้ง', '4G LTE Module + SIM Slot'],
      },
      {
        label: 'Operating System',
        choices: [
          'ไม่ติดตั้ง OS',
          'Windows 10 IoT Enterprise LTSC',
          'Windows 11 Pro',
          'Ubuntu 22.04 LTS',
        ],
      },
      {
        label: 'Power Input',
        choices: ['12V DC (Standard)', '9–36V DC Wide Input (Optional)'],
      },
      {
        label: 'Operating Temperature',
        choices: ['0 ~ 50°C (Standard)', '-40 ~ 70°C (Wide-Temp Optional)'],
      },
      {
        label: 'Mounting',
        choices: ['VESA Mount', 'Panel Mount', 'Wall Mount', 'Stand (Optional)'],
      },
      {
        label: 'Warranty',
        choices: ['12 เดือน (Standard)', '24 เดือน', '36 เดือน'],
      },
    ],
    certifications: [
      { code: 'CE', description: 'European Conformity (EN 55032 & EN 55035)' },
      { code: 'FCC', description: 'Federal Communications Commission (USA)' },
      { code: 'BIS', description: 'Bureau of Indian Standards' },
      { code: 'CCC', description: 'China Compulsory Certification (S&E)' },
    ],
    applications: [
      'HMI / SCADA — สถานีควบคุมสายการผลิต',
      'MES Terminal — เก็บข้อมูลโรงงานแบบ Real-time',
      'Food & Beverage — รองรับการล้างทำความสะอาด',
      'Chemical / Pharmaceutical — Anti-corrosion (Optional)',
      'Energy & Power — Substation Visualization',
      'Smart Logistics — Warehouse / Andon Board',
      'Self-service Kiosk ขนาดใหญ่',
      'Robotics & Machine Vision Interface',
    ],
    heroImages: [
      '/images/products/epc-w24x2a.jpg',
      '/images/products/w24x2a/front.jpg',
      '/images/products/w24x2a/side-profile.jpg',
      '/images/products/w24x2a/side-io-rear.jpg',
      '/images/products/w24x2a/side-io-com.jpg',
      '/images/products/w24x2a/io-labels.png',
    ],
    productImages: [
      { src: '/images/products/w24x2a/dimensions.png', alt: 'EPC-W24X2A Dimensions Drawing', caption: 'Dimensions: 589.3 × 361.2 × 75.1 mm • Cutout: 562.7 × 338.4 mm' },
      { src: '/images/products/w24x2a/dimensions-detail.png', alt: 'EPC-W24X2A Detailed Dimensions Drawing', caption: 'แบบมิติละเอียด — Front / Side / Rear / Mounting Holes 4-M4' },
    ],
    gallery: [
      { src: '/images/products/w24x2a/app-mes-factory.jpg', alt: 'EPC-W24X2A — MES Factory Application', caption: 'MES Industry — Factory Application Case' },
      { src: '/images/products/w24x2a/app-medical.jpg', alt: 'EPC-W24X2A — Medical Tablet Application', caption: 'Medical Tablet PC Application' },
      { src: '/images/products/w24x2a/app-power.jpg', alt: 'EPC-W24X2A — Power & Energy Application', caption: 'Power & Energy Substation Visualization' },
    ],
    selectionTable: [
      { no: '1', model: 'EPC-W2462A', partNumber: 'C11.01.01.001', cpu: 'Intel® Celeron® J1900', memory: '4GB', storage: 'mSATA SSD 128GB' },
      { no: '2', model: 'EPC-W2472A', partNumber: 'C11.01.05.001', cpu: 'Intel® Celeron® J6412', memory: '8GB', storage: 'mSATA SSD 256GB' },
      { no: '3', model: 'EPC-W2492A', partNumber: 'C11.01.03.001', cpu: 'Intel® Core™ i3-10110U', memory: '8GB', storage: 'mSATA SSD 256GB' },
      { no: '4', model: 'EPC-W2492A', partNumber: 'C11.01.03.002', cpu: 'Intel® Core™ i5-10210U', memory: '8GB', storage: 'mSATA SSD 256GB' },
      { no: '5', model: 'EPC-W2492A', partNumber: 'C11.01.03.003', cpu: 'Intel® Core™ i7-10710U', memory: '8GB', storage: 'mSATA SSD 256GB' },
      { no: '6', model: 'EPC-W2422A', partNumber: 'C11.01.04.001', cpu: 'Intel® Core™ i3-1215U', memory: '8GB', storage: 'mSATA SSD 256GB' },
      { no: '7', model: 'EPC-W2422A', partNumber: 'C11.01.04.002', cpu: 'Intel® Core™ i5-1235U', memory: '8GB', storage: 'mSATA SSD 256GB' },
      { no: '8', model: 'EPC-W2422A', partNumber: 'C11.01.04.004', cpu: 'Intel® Core™ i7-1255U', memory: '8GB', storage: 'mSATA SSD 256GB' },
    ],
    configurator: {
      cpus: [
        { key: 'j1900',    label: 'Intel® Celeron® J1900',     cores: 4,  threads: 4,  freq: '2.0–2.4 GHz', cache: '2MB',   tdp: '10W', graphics: 'Intel® HD',          memorySupport: '4–8GB DDR3L',  storageSupport: '1× mSATA SSD',           baseModel: 'EPC-W2462A', basePrice: 38900 },
        { key: 'j6412',    label: 'Intel® Celeron® J6412',     cores: 4,  threads: 4,  freq: '2.0–2.6 GHz', cache: '1.5MB', tdp: '10W', graphics: 'Intel® UHD',         memorySupport: '4–16GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W2472A', basePrice: 45900 },
        { key: 'i3-10110u',label: 'Intel® Core™ i3-10110U',    cores: 2,  threads: 4,  freq: '2.1–4.1 GHz', cache: '4MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W2492A', basePrice: 56900 },
        { key: 'i5-10210u',label: 'Intel® Core™ i5-10210U',    cores: 4,  threads: 8,  freq: '1.6–4.2 GHz', cache: '6MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W2492A', basePrice: 64900 },
        { key: 'i7-10710u',label: 'Intel® Core™ i7-10710U',    cores: 4,  threads: 8,  freq: '1.8–4.9 GHz', cache: '8MB',   tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '4–32GB DDR4',  storageSupport: '1× mSATA / 1× M.2 SSD',  baseModel: 'EPC-W2492A', basePrice: 74900 },
        { key: 'i3-1215u', label: 'Intel® Core™ i3-1215U',     cores: 6,  threads: 8,  freq: '1.2–4.4 GHz', cache: '10MB',  tdp: '15W', graphics: 'Intel® UHD',         memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W2422A', basePrice: 68900 },
        { key: 'i5-1235u', label: 'Intel® Core™ i5-1235U',     cores: 10, threads: 12, freq: '1.3–4.4 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W2422A', basePrice: 79900 },
        { key: 'i7-1255u', label: 'Intel® Core™ i7-1255U',     cores: 10, threads: 12, freq: '1.1–4.7 GHz', cache: '12MB',  tdp: '15W', graphics: 'Intel® Iris® Xe',    memorySupport: '8–32GB DDR5',  storageSupport: '2× M.2 SSD',             baseModel: 'EPC-W2422A', basePrice: 92900 },
      ],
      ram: [
        { key: 'r4',  label: '4GB',  addPrice: 0,    note: 'รวมในราคาเริ่มต้น' },
        { key: 'r8',  label: '8GB',  addPrice: 1500 },
        { key: 'r16', label: '16GB', addPrice: 3500, note: 'แนะนำสำหรับ Gen10/Gen12' },
        { key: 'r32', label: '32GB', addPrice: 7500, note: 'รองรับเฉพาะ Gen10/Gen12' },
      ],
      storage: [
        { key: 's128',  label: 'SSD 128GB',  addPrice: 0,    note: 'รวมในราคาเริ่มต้น' },
        { key: 's256',  label: 'SSD 256GB',  addPrice: 1200 },
        { key: 's512',  label: 'SSD 512GB',  addPrice: 2800 },
        { key: 's1024', label: 'SSD 1TB',    addPrice: 5500 },
        { key: 's2048', label: 'SSD 2TB',    addPrice: 11500, note: 'รองรับเฉพาะรุ่นที่มี 2× M.2' },
      ],
      touch: [
        { key: 'pcap',     label: 'P-CAP 10-point Multi-touch', addPrice: 0, note: 'มาตรฐาน — กระจกเต็มหน้า' },
        { key: 'resistive',label: 'Resistive 5-wire Touch',     addPrice: 0, note: 'เหมาะกับงานสวมถุงมือ' },
      ],
      wireless: [
        { key: 'none',  label: 'ไม่ต้องการโมดูลไร้สาย',                addPrice: 0 },
        { key: 'wifi',  label: 'Wi-Fi: Intel® N6235 (2.4G/5G) + Antenna', addPrice: 1800 },
        { key: '4g',    label: '4G LTE Full Netcom + SIM Slot',         addPrice: 3800 },
        { key: 'both',  label: 'Wi-Fi + 4G LTE (รวม 2 โมดูล)',           addPrice: 5200 },
      ],
      os: [
        { key: 'none',    label: 'ไม่ลง OS (ลูกค้าติดตั้งเอง)', addPrice: 0 },
        { key: 'win10',   label: 'Windows 10 IoT Enterprise',     addPrice: 4500, note: 'License แท้ + Activation' },
        { key: 'win11',   label: 'Windows 11 Pro',                addPrice: 4500, note: 'License แท้ + Activation' },
        { key: 'ubuntu',  label: 'Ubuntu 22.04 LTS',              addPrice: 0,    note: 'ฟรี — Long-term support' },
      ],
      tempRange: [
        { key: 'standard', label: 'อุณหภูมิใช้งาน 0 ~ 50°C',  addPrice: 0,    note: 'มาตรฐาน' },
        { key: 'wide',     label: 'Wide-Temp -40 ~ 70°C',     addPrice: 4500, note: 'สำหรับโรงงานหนัก/Outdoor' },
      ],
      powerInput: [
        { key: 'dc12',  label: 'DC 12V (3-pin Terminal Block)',  addPrice: 0, note: 'มาตรฐาน' },
        { key: 'dc936', label: 'Wide DC 9–36V Input',            addPrice: 1500, note: 'รองรับยานพาหนะ/UPS' },
      ],
      warranty: [
        { years: 1, label: 'รับประกัน 1 ปี', multiplier: 0     },
        { years: 2, label: 'รับประกัน 2 ปี', multiplier: 0.06  },
        { years: 3, label: 'รับประกัน 3 ปี', multiplier: 0.12  },
      ],
    },
    datasheetUrl: 'https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_899307542dca4df6b763b3a52e2af574.pdf',
    image: '/images/products/epc-w24x2a.jpg',
    landingHref: '/epc-series#wide',
    popular: true,
  },
  'epc-10xa': {
    slug: 'epc-10xa', model: 'EPC-10XA', series: 'EPC Box', category: 'Box PC',
    tagline: 'Compact 200mm Box PC — Edge / POS',
    intro: 'EPC-10XA Box PC ขนาดเล็กเพียง 200mm — เหมาะกับ Edge Computing, POS, IoT Gateway และงานพื้นที่จำกัด',
    highlights: ['Compact 200mm', 'Fanless 24/7', 'ใช้ไฟ DC ประหยัด', 'ติดตั้ง DIN Rail / VESA'],
    specs: [{ label: 'Form Factor', value: '~200 × 150 × 50 mm' }, ...BOX_COMMON_SPECS],
    image: '/images/wix/0597a3_e66a5a6616b64254a920d2c6f05b93f8_48ed79f4.png',
    landingHref: '/epc-box-series#10xa',
  },
  'epc-20xa': {
    slug: 'epc-20xa', model: 'EPC-20XA', series: 'EPC Box', category: 'Box PC',
    tagline: 'Performance Box PC — ระบายความร้อนดีขึ้น 68%',
    intro: 'EPC-20XA Box PC สมรรถนะสูง — โครงสร้างระบายความร้อนใหม่ ดีขึ้น 68% รองรับ CPU แรงทำงาน 24/7 เสถียร',
    highlights: ['Cooling +68%', 'CPU ถึง i7/i9', 'PCIe / M.2 Expansion', 'รองรับงาน AI Inference เบา'],
    specs: [{ label: 'Form Factor', value: 'Mid-size Industrial Box' }, ...BOX_COMMON_SPECS],
    image: '/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png',
    landingHref: '/epc-box-series#20xa',
    popular: true,
  },
  'epc-30xa': {
    slug: 'epc-30xa', model: 'EPC-30XA', series: 'EPC Box', category: 'Box PC',
    tagline: 'Rack/Panel Mount 337mm — Low Profile',
    intro: 'EPC-30XA Box PC แบบ Low-profile ขนาด 337mm — ออกแบบให้ติดตั้งใน Rack/Panel ตู้คอนโทรลได้ลงตัว',
    highlights: ['Low Profile 337mm', 'Rack/Panel Mount', 'รองรับ I/O หลากหลาย', 'งานสายการผลิต/SCADA'],
    specs: [{ label: 'Form Factor', value: '337mm Rack/Panel Mount' }, ...BOX_COMMON_SPECS],
    image: '/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png',
    landingHref: '/epc-box-series#30xa',
  },
  'epc-40xa': {
    slug: 'epc-40xa', model: 'EPC-40XA', series: 'EPC Box', category: 'Box PC',
    tagline: 'Mission-Critical Flagship — ระบายความร้อน +168%',
    intro: 'EPC-40XA Box PC เรือธง — ระบายความร้อนดีขึ้น +168% รองรับงานหนัก Mission-Critical, AI Inference, Server-grade Edge',
    highlights: ['Cooling +168%', 'รองรับ GPU / Accelerator', 'Expansion เต็มรูปแบบ', 'Server-grade reliability'],
    specs: [{ label: 'Form Factor', value: 'Full-size Industrial Box' }, ...BOX_COMMON_SPECS],
    image: '/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png',
    landingHref: '/epc-box-series#40xa',
    popular: true,
  },
};

export const epcModelList = Object.values(epcModelDetails);

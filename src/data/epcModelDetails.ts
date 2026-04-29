// EPC Panel PC + EPC Box Series — static spec data for /shop/<model> detail pages
export type EpcModelSpec = { label: string; value: string };
export type EpcModelDetail = {
  slug: string;          // route slug, e.g. 'epc-w15x2a'
  model: string;         // display model, e.g. 'EPC-W15X2A'
  series: 'EPC Panel PC' | 'EPC Box';
  category: 'Touch Panel PC' | 'Box PC';
  tagline: string;
  intro: string;
  highlights: string[];
  specs: EpcModelSpec[];
  image: string;
  gallery?: string[];
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
    tagline: '13.3" Wide Touch Panel PC',
    intro: 'EPC-W13X2A คอมพิวเตอร์อุตสาหกรรมจอสัมผัสขนาด 13.3" 16:9 — ดีไซน์บางเฉียบ รองรับการติดตั้งแบบ Panel/VESA สำหรับงาน HMI, POS และ Kiosk ขนาดกะทัดรัด',
    highlights: ['จอ 13.3" Full HD', 'Multi-touch 10 จุด', 'Fanless / เงียบ', 'Wide DC Input 9–36V'],
    specs: [{ label: 'Display', value: '13.3" 16:9 Full HD (1920×1080)' }, ...PANEL_COMMON_SPECS],
    image: '/images/wix/0597a3_a24a2701c3274227be9a623a39fcad77_c5875973.png',
    landingHref: '/epc-series#wide',
  },
  'epc-w15x2a': {
    slug: 'epc-w15x2a', model: 'EPC-W15X2A', series: 'EPC Panel PC', category: 'Touch Panel PC',
    tagline: '15.6" Wide Touch Panel PC — รุ่นยอดนิยม',
    intro: 'EPC-W15X2A จอ 15.6" 16:9 Full HD ขนาดกำลังดี เหมาะกับงาน HMI โรงงาน, สถานีควบคุม, และ POS — ติดตั้งง่ายด้วย VESA/Panel Mount',
    highlights: ['จอ 15.6" Full HD', 'P-CAP Touch กระจกเต็มหน้า', 'CPU เลือกได้ถึง i7', 'IP65 ด้านหน้า (option)'],
    specs: [{ label: 'Display', value: '15.6" 16:9 Full HD (1920×1080)' }, ...PANEL_COMMON_SPECS],
    image: '/images/wix/0597a3_f72a672e77bc413a90eaa099e8bcfe0e_679aa82e.png',
    landingHref: '/epc-series#wide',
    popular: true,
  },
  'epc-w18x2a': {
    slug: 'epc-w18x2a', model: 'EPC-W18X2A', series: 'EPC Panel PC', category: 'Touch Panel PC',
    tagline: '18.5" Industrial Wide Display PC',
    intro: 'EPC-W18X2A จอ 18.5" 16:9 ใหญ่ มองเห็นชัดในระยะไกล เหมาะกับงานควบคุมสายการผลิต, Andon Board และ Self-service Kiosk',
    highlights: ['จอ 18.5" HD+', 'มุมมองกว้าง', 'รองรับ VESA 100', 'เหมาะกับ HMI ขนาดกลาง'],
    specs: [{ label: 'Display', value: '18.5" 16:9 HD+ (1366×768) — Full HD optional' }, ...PANEL_COMMON_SPECS],
    image: '/images/wix/0597a3_1afba5b0dac84a259a2dd29c1fda6909_57745515.png',
    landingHref: '/epc-series#wide',
  },
  'epc-w21x2a': {
    slug: 'epc-w21x2a', model: 'EPC-W21X2A', series: 'EPC Panel PC', category: 'Touch Panel PC',
    tagline: '21.5" Full HD Touch Panel PC — Flagship',
    intro: 'EPC-W21X2A จอใหญ่ 21.5" Full HD สำหรับงานควบคุมขนาดใหญ่, Dispatch, Visualization และ Kiosk premium',
    highlights: ['จอ 21.5" Full HD', 'P-CAP เกรดอุตสาหกรรม', 'CPU แรงระดับ Workstation', 'รองรับ Wall/VESA'],
    specs: [{ label: 'Display', value: '21.5" 16:9 Full HD (1920×1080)' }, ...PANEL_COMMON_SPECS],
    image: '/images/wix/0597a3_cfe6c90e6ba44ef3ba3a0aa5a698f32d_2b0c00e1.png',
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

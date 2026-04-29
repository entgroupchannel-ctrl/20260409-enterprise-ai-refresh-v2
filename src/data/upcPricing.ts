/**
 * ENT GROUP — UPC/EPC/CTN Series Price Matrix 2025
 * แหล่งข้อมูล: Internal Price List 2025 (THB, VAT excluded)
 * มาตรฐาน base config: 4GB RAM / 128GB SSD / 12V DC / รับประกัน 1 ปี
 */

export interface CpuOption {
  cpu: string;
  base: number;     // ราคา base พร้อม chassis (THB)
  premium: number;  // ค่าฟีเจอร์พิเศษของรุ่น (THB)
  total: number;    // รวมแล้ว = base + premium
}

export interface ModelPricing {
  model: string;
  category: string;
  chassis: 'SMALL' | 'LARGE';
  cpus: CpuOption[];
  /** ฟีเจอร์ที่ติดตัวรุ่น (รวมในราคาแล้ว) */
  includedFeatures?: string[];
}

/* ── ส่วนต่างราคาส่วนบุคคล (RAM/SSD/Warranty) ── */
export const RAM_UPGRADES: { gb: number; addPrice: number; label: string }[] = [
  { gb: 4, addPrice: 0, label: '4 GB (มาตรฐาน)' },
  { gb: 8, addPrice: 1200, label: '8 GB' },
  { gb: 16, addPrice: 3200, label: '16 GB' },
  { gb: 32, addPrice: 7500, label: '32 GB' },
];

export const SSD_UPGRADES: { gb: number; addPrice: number; label: string }[] = [
  { gb: 128, addPrice: 0, label: '128 GB SSD (มาตรฐาน)' },
  { gb: 256, addPrice: 1500, label: '256 GB SSD' },
  { gb: 512, addPrice: 3500, label: '512 GB SSD' },
  { gb: 1024, addPrice: 7500, label: '1 TB SSD' },
  { gb: 2048, addPrice: 15500, label: '2 TB SSD' },
];

export const WARRANTY_OPTIONS = [
  { years: 1, label: '1 ปี (มาตรฐาน)', multiplier: 0 },
  { years: 2, label: '2 ปี', multiplier: 0.10 },
  { years: 3, label: '3 ปี (Premium Care)', multiplier: 0.18 },
] as const;

/** ส่วนลดขั้นบันไดตามจำนวน */
export function tierDiscount(qty: number): { rate: number; label: string } {
  if (qty >= 50) return { rate: 0.15, label: 'ราคาโครงการ (50+ ชิ้น)' };
  if (qty >= 10) return { rate: 0.08, label: 'ราคาส่ง (10+ ชิ้น)' };
  if (qty >= 5) return { rate: 0.04, label: 'ราคาขายส่งย่อย (5+ ชิ้น)' };
  return { rate: 0, label: 'ราคาปกติ' };
}

/** Price matrix ทั้ง 16 รุ่น */
export const UPC_PRICING: Record<string, ModelPricing> = {
  'EPC-102B': {
    model: 'EPC-102B', category: 'Multi-LAN', chassis: 'SMALL',
    includedFeatures: ['4× Intel LAN', 'Smart Fan'],
    cpus: [
      { cpu: 'Celeron J6412', base: 18990, premium: 0, total: 18990 },
      { cpu: 'Celeron J1900', base: 19990, premium: 0, total: 19990 },
      { cpu: 'i3-10110U', base: 34990, premium: 0, total: 34990 },
      { cpu: 'i3-1215U', base: 34990, premium: 0, total: 34990 },
      { cpu: 'i5-1235U', base: 39990, premium: 0, total: 39990 },
      { cpu: 'i5-10210U', base: 41990, premium: 0, total: 41990 },
      { cpu: 'i7-10510U', base: 44990, premium: 0, total: 44990 },
      { cpu: 'i7-1250U', base: 44990, premium: 0, total: 44990 },
    ],
  },
  'CTN-102C': {
    model: 'CTN-102C', category: 'Dual HDMI', chassis: 'SMALL',
    includedFeatures: ['2× HDMI with EDID', 'Fanless'],
    cpus: [
      { cpu: 'Celeron J6412', base: 18990, premium: 0, total: 18990 },
      { cpu: 'Celeron J1900', base: 19990, premium: 0, total: 19990 },
      { cpu: 'i3-10110U', base: 34990, premium: 0, total: 34990 },
      { cpu: 'i3-1215U', base: 34990, premium: 0, total: 34990 },
      { cpu: 'i5-1235U', base: 39990, premium: 0, total: 39990 },
      { cpu: 'i5-10210U', base: 41990, premium: 0, total: 41990 },
      { cpu: 'i7-10510U', base: 44990, premium: 0, total: 44990 },
      { cpu: 'i7-1250U', base: 44990, premium: 0, total: 44990 },
    ],
  },
  'EPC-202B': {
    model: 'EPC-202B', category: 'Multi-COM', chassis: 'SMALL',
    includedFeatures: ['10× USB', '7× COM Port'],
    cpus: [
      { cpu: 'Celeron J6412', base: 18990, premium: 0, total: 18990 },
      { cpu: 'Celeron J1900', base: 19990, premium: 0, total: 19990 },
      { cpu: 'i3-10110U', base: 34990, premium: 0, total: 34990 },
      { cpu: 'i3-1215U', base: 34990, premium: 0, total: 34990 },
      { cpu: 'i5-1235U', base: 39990, premium: 0, total: 39990 },
      { cpu: 'i5-10210U', base: 41990, premium: 0, total: 41990 },
      { cpu: 'i7-10510U', base: 44990, premium: 0, total: 44990 },
      { cpu: 'i7-1250U', base: 44990, premium: 0, total: 44990 },
    ],
  },
  'EPC-207B': {
    model: 'EPC-207B', category: 'DB37 Multi-Serial', chassis: 'SMALL',
    includedFeatures: ['DB37 Multi-Serial Connector'],
    cpus: [
      { cpu: 'Celeron J6412', base: 18990, premium: 0, total: 18990 },
      { cpu: 'Celeron J1900', base: 19990, premium: 0, total: 19990 },
      { cpu: 'i3-10110U', base: 34990, premium: 0, total: 34990 },
      { cpu: 'i3-1215U', base: 34990, premium: 0, total: 34990 },
      { cpu: 'i5-1235U', base: 39990, premium: 0, total: 39990 },
      { cpu: 'i5-10210U', base: 41990, premium: 0, total: 41990 },
      { cpu: 'i7-10510U', base: 44990, premium: 0, total: 44990 },
      { cpu: 'i7-1250U', base: 44990, premium: 0, total: 44990 },
    ],
  },
  'EPC-309E': {
    model: 'EPC-309E', category: '4× Intel LAN', chassis: 'LARGE',
    includedFeatures: ['4× Intel LAN', 'Large chassis expandability'],
    cpus: [
      { cpu: 'Celeron J6412', base: 18990, premium: 0, total: 18990 },
      { cpu: 'Celeron J1900', base: 20990, premium: 0, total: 20990 },
      { cpu: 'i3-10110U', base: 35990, premium: 0, total: 35990 },
      { cpu: 'i3-1215U', base: 35990, premium: 0, total: 35990 },
      { cpu: 'i5-1235U', base: 40990, premium: 0, total: 40990 },
      { cpu: 'i5-10210U', base: 42990, premium: 0, total: 42990 },
      { cpu: 'i7-10510U', base: 45990, premium: 0, total: 45990 },
      { cpu: 'i7-1250U', base: 45990, premium: 0, total: 45990 },
    ],
  },
  'EPC-302B': {
    model: 'EPC-302B', category: 'Smart Fan • 5× LAN', chassis: 'LARGE',
    includedFeatures: ['5× LAN', 'Smart Fan'],
    cpus: [
      { cpu: 'i3-1215U', base: 35990, premium: 0, total: 35990 },
      { cpu: 'i5-1235U', base: 40990, premium: 0, total: 40990 },
      { cpu: 'i7-1250U', base: 45990, premium: 0, total: 45990 },
    ],
  },
  'UPC-302D': {
    model: 'UPC-302D', category: 'Multi-USB (9× USB)', chassis: 'LARGE',
    includedFeatures: ['9× USB', '2× LAN'],
    cpus: [
      { cpu: 'Celeron J6412', base: 18990, premium: 500, total: 19490 },
      { cpu: 'Celeron J1900', base: 20990, premium: 500, total: 21490 },
      { cpu: 'i3-10110U', base: 35990, premium: 500, total: 36490 },
      { cpu: 'i3-1215U', base: 35990, premium: 500, total: 36490 },
      { cpu: 'i5-1235U', base: 40990, premium: 500, total: 41490 },
      { cpu: 'i5-10210U', base: 42990, premium: 500, total: 43490 },
      { cpu: 'i7-10510U', base: 45990, premium: 500, total: 46490 },
      { cpu: 'i7-1250U', base: 45990, premium: 500, total: 46490 },
    ],
  },
  'UPC-108H': {
    model: 'UPC-108H', category: 'Battery Backup', chassis: 'SMALL',
    includedFeatures: ['4000mAh Battery Backup'],
    cpus: [
      { cpu: 'Celeron J6412', base: 18990, premium: 2000, total: 20990 },
      { cpu: 'Celeron J1900', base: 19990, premium: 2000, total: 21990 },
      { cpu: 'i3-7100U', base: 34990, premium: 2000, total: 36990 },
      { cpu: 'i3-1215U', base: 34990, premium: 2000, total: 36990 },
      { cpu: 'i5-7200U', base: 39990, premium: 2000, total: 41990 },
      { cpu: 'i5-1235U', base: 39990, premium: 2000, total: 41990 },
      { cpu: 'i7-7500U', base: 44990, premium: 2000, total: 46990 },
      { cpu: 'i7-1250U', base: 44990, premium: 2000, total: 46990 },
    ],
  },
  'UPC-206E': {
    model: 'UPC-206E', category: 'CAN Bus', chassis: 'SMALL',
    includedFeatures: ['CAN Bus Module'],
    cpus: [
      { cpu: 'Celeron J1900', base: 19990, premium: 1500, total: 21490 },
    ],
  },
  'UPC-206F': {
    model: 'UPC-206F', category: '4G / SIM + TF', chassis: 'SMALL',
    includedFeatures: ['SIM + TF Card Slot', '4G/5G LTE Module'],
    cpus: [
      { cpu: 'Celeron J1900', base: 19990, premium: 6900, total: 26890 },
    ],
  },
  'UPC-209B': {
    model: 'UPC-209B', category: 'GPIO / Modbus', chassis: 'SMALL',
    includedFeatures: ['8-in / 8-out GPIO', 'Modbus'],
    cpus: [
      { cpu: 'i3-10110U', base: 34990, premium: 1500, total: 36490 },
      { cpu: 'i5-10210U', base: 41990, premium: 1500, total: 43490 },
      { cpu: 'i7-10510U', base: 44990, premium: 1500, total: 46490 },
    ],
  },
  'UPC-309C': {
    model: 'UPC-309C', category: '4G IoT Gateway', chassis: 'LARGE',
    includedFeatures: ['SIM + TF Slot', '4G/5G LTE Module'],
    cpus: [
      { cpu: 'i3-10110U', base: 35990, premium: 6900, total: 42890 },
      { cpu: 'i5-10210U', base: 42990, premium: 6900, total: 49890 },
      { cpu: 'i7-10510U', base: 45990, premium: 6900, total: 52890 },
    ],
  },
  'UPC-309R': {
    model: 'UPC-309R', category: 'Redundant Power', chassis: 'LARGE',
    includedFeatures: ['Dual Redundant DC PSU', 'Warning Light'],
    cpus: [
      { cpu: 'i3-10110U', base: 35990, premium: 3000, total: 38990 },
      { cpu: 'i5-10210U', base: 42990, premium: 3000, total: 45990 },
      { cpu: 'i7-10510U', base: 45990, premium: 3000, total: 48990 },
    ],
  },
  'UPC-302F': {
    model: 'UPC-302F', category: '14× USB', chassis: 'LARGE',
    includedFeatures: ['14× USB Maximum Expansion'],
    cpus: [
      { cpu: 'Celeron J6412', base: 18990, premium: 1000, total: 19990 },
      { cpu: 'Celeron J1900', base: 20990, premium: 1000, total: 21990 },
      { cpu: 'i3-10110U', base: 35990, premium: 1000, total: 36990 },
      { cpu: 'i3-1215U', base: 35990, premium: 1000, total: 36990 },
      { cpu: 'i5-1235U', base: 40990, premium: 1000, total: 41990 },
      { cpu: 'i5-10210U', base: 42990, premium: 1000, total: 43990 },
      { cpu: 'i7-10510U', base: 45990, premium: 1000, total: 46990 },
      { cpu: 'i7-1250U', base: 45990, premium: 1000, total: 46990 },
    ],
  },
  'EPC-302E': {
    model: 'EPC-302E', category: '5× Intel LAN', chassis: 'LARGE',
    includedFeatures: ['5× Intel LAN'],
    cpus: [
      { cpu: 'Celeron J6412', base: 18990, premium: 1000, total: 19990 },
      { cpu: 'Celeron J1900', base: 20990, premium: 1000, total: 21990 },
      { cpu: 'i3-10110U', base: 35990, premium: 1000, total: 36990 },
      { cpu: 'i3-1215U', base: 35990, premium: 1000, total: 36990 },
      { cpu: 'i5-1235U', base: 40990, premium: 1000, total: 41990 },
      { cpu: 'i5-10210U', base: 42990, premium: 1000, total: 43990 },
      { cpu: 'i7-10510U', base: 45990, premium: 1000, total: 46990 },
      { cpu: 'i7-1250U', base: 45990, premium: 1000, total: 46990 },
    ],
  },
  'EPC-302A': {
    model: 'EPC-302A', category: '8×8 GPIO', chassis: 'LARGE',
    includedFeatures: ['8-in / 8-out GPIO'],
    cpus: [
      { cpu: 'Celeron J6412', base: 18990, premium: 0, total: 18990 },
      { cpu: 'Celeron J1900', base: 20990, premium: 0, total: 20990 },
      { cpu: 'i3-10110U', base: 35990, premium: 0, total: 35990 },
      { cpu: 'i3-1215U', base: 35990, premium: 0, total: 35990 },
      { cpu: 'i5-1235U', base: 40990, premium: 0, total: 40990 },
      { cpu: 'i5-10210U', base: 42990, premium: 0, total: 42990 },
      { cpu: 'i7-10510U', base: 45990, premium: 0, total: 45990 },
      { cpu: 'i7-1250U', base: 45990, premium: 0, total: 45990 },
    ],
  },
  /* ───────────── EPC Box Series — XA Family (CESIPC factory data) ───────────── */
  'EPC-10XA': {
    model: 'EPC-10XA', category: 'Compact Edge / IoT Gateway', chassis: 'SMALL',
    includedFeatures: ['2× Intel® I210 LAN', '3× COM (2×RS232 + 1×RS485)', 'Fanless 47mm', 'BlockCore™ Modular'],
    cpus: [
      { cpu: 'Celeron J1900', base: 19990, premium: 0, total: 19990 },
      { cpu: 'Celeron J6412', base: 22990, premium: 0, total: 22990 },
      { cpu: 'i3-10110U',     base: 33990, premium: 0, total: 33990 },
      { cpu: 'i5-10210U',     base: 39990, premium: 0, total: 39990 },
      { cpu: 'i7-10510U',     base: 44990, premium: 0, total: 44990 },
      { cpu: 'i3-1215U',      base: 36990, premium: 0, total: 36990 },
      { cpu: 'i5-1235U',      base: 42990, premium: 0, total: 42990 },
      { cpu: 'i7-1250U',      base: 47990, premium: 0, total: 47990 },
    ],
  },
  'EPC-20XA': {
    model: 'EPC-20XA', category: 'Performance Box • Cooling +68%', chassis: 'SMALL',
    includedFeatures: ['Cooling +68%', '2× Intel® I210 LAN', '3× COM (2×RS232 + 1×RS485)', 'Fanless 79.5mm'],
    cpus: [
      { cpu: 'Celeron J1900', base: 21990, premium: 0, total: 21990 },
      { cpu: 'Celeron J6412', base: 24990, premium: 0, total: 24990 },
      { cpu: 'i3-10110U',     base: 35990, premium: 0, total: 35990 },
      { cpu: 'i5-10210U',     base: 41990, premium: 0, total: 41990 },
      { cpu: 'i7-10510U',     base: 46990, premium: 0, total: 46990 },
      { cpu: 'i3-1215U',      base: 38990, premium: 0, total: 38990 },
      { cpu: 'i5-1235U',      base: 44990, premium: 0, total: 44990 },
      { cpu: 'i7-1250U',      base: 49990, premium: 0, total: 49990 },
    ],
  },
  'EPC-30XA': {
    model: 'EPC-30XA', category: 'Low-Profile Wide • 6× COM', chassis: 'LARGE',
    includedFeatures: ['Low Profile 47.5mm', '6× COM (4×RS232 + 2×RS485)', '2× Intel® I210 LAN', 'Rack/Panel Mount'],
    cpus: [
      { cpu: 'Celeron J1900', base: 24990, premium: 0, total: 24990 },
      { cpu: 'Celeron J6412', base: 27990, premium: 0, total: 27990 },
      { cpu: 'i3-10110U',     base: 38990, premium: 0, total: 38990 },
      { cpu: 'i5-10210U',     base: 44990, premium: 0, total: 44990 },
      { cpu: 'i7-10510U',     base: 49990, premium: 0, total: 49990 },
      { cpu: 'i3-1215U',      base: 41990, premium: 0, total: 41990 },
      { cpu: 'i5-1235U',      base: 47990, premium: 0, total: 47990 },
      { cpu: 'i7-1250U',      base: 52990, premium: 0, total: 52990 },
    ],
  },
  'EPC-40XA': {
    model: 'EPC-40XA', category: 'Flagship Mission-Critical • Cooling +168%', chassis: 'LARGE',
    includedFeatures: ['Cooling +168%', '6× COM (4×RS232 + 2×RS485)', '2× Intel® I210 LAN', 'Mini PCIe + Dual M.2'],
    cpus: [
      { cpu: 'Celeron J1900', base: 26990, premium: 0, total: 26990 },
      { cpu: 'Celeron J6412', base: 29990, premium: 0, total: 29990 },
      { cpu: 'i3-10110U',     base: 40990, premium: 0, total: 40990 },
      { cpu: 'i5-10210U',     base: 46990, premium: 0, total: 46990 },
      { cpu: 'i7-10510U',     base: 51990, premium: 0, total: 51990 },
      { cpu: 'i3-1215U',      base: 43990, premium: 0, total: 43990 },
      { cpu: 'i5-1235U',      base: 49990, premium: 0, total: 49990 },
      { cpu: 'i7-1250U',      base: 54990, premium: 0, total: 54990 },
    ],
  },
};

/** ค้นหาด้วย model id (case-insensitive, รองรับ 'epc-102b') */
export function findPricing(modelId: string | undefined | null): ModelPricing | null {
  if (!modelId) return null;
  const key = modelId.toUpperCase();
  return UPC_PRICING[key] ?? null;
}

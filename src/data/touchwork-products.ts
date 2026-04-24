// TouchWork Series — Indoor Touch Display catalog (12 core models, 35 SKUs)
// Partner-sourced products. Architecture variants: Monitor / ARM (Android) / X86 (Windows)

import DM080NF_ARM from "@/assets/touchwork/DM080NF-ARM.jpg";
import DM080NF_Monitor from "@/assets/touchwork/DM080NF-Monitor.jpg";
import DM080NF_X86 from "@/assets/touchwork/DM080NF-X86.jpg";
import DM080WG_ARM from "@/assets/touchwork/DM080WG-ARM.jpg";
import DM080WG_Monitor from "@/assets/touchwork/DM080WG-Monitor.jpg";
import DM101G_ARM from "@/assets/touchwork/DM101G-ARM.jpg";
import DM101G_Monitor from "@/assets/touchwork/DM101G-Monitor.jpg";
import DM101G_X86 from "@/assets/touchwork/DM101G-X86.jpg";
import DM104G_ARM from "@/assets/touchwork/DM104G-ARM.jpg";
import DM104G_Monitor from "@/assets/touchwork/DM104G-Monitor.jpg";
import DM104G_X86 from "@/assets/touchwork/DM104G-X86.jpg";
import DM121G_ARM from "@/assets/touchwork/DM121G-ARM.jpg";
import DM121G_Monitor from "@/assets/touchwork/DM121G-Monitor.jpg";
import DM121G_X86 from "@/assets/touchwork/DM121G-X86.jpg";
import DM15G_ARM from "@/assets/touchwork/DM15G-ARM.jpg";
import DM15G_Monitor from "@/assets/touchwork/DM15G-Monitor.jpg";
import DM15G_X86 from "@/assets/touchwork/DM15G-X86.jpg";
import DM156G_ARM from "@/assets/touchwork/DM156G-ARM.jpg";
import DM156G_Monitor from "@/assets/touchwork/DM156G-Monitor.jpg";
import DM156G_X86 from "@/assets/touchwork/DM156G-X86.jpg";
import DM17G_ARM from "@/assets/touchwork/DM17G-ARM.jpg";
import DM17G_Monitor from "@/assets/touchwork/DM17G-Monitor.jpg";
import DM17G_X86 from "@/assets/touchwork/DM17G-X86.jpg";
import DM19G_ARM from "@/assets/touchwork/DM19G-ARM.jpg";
import DM19G_Monitor from "@/assets/touchwork/DM19G-Monitor.jpg";
import DM19G_X86 from "@/assets/touchwork/DM19G-X86.jpg";
import DM215G_ARM from "@/assets/touchwork/DM215G-ARM.jpg";
import DM215G_Monitor from "@/assets/touchwork/DM215G-Monitor.jpg";
import DM215G_X86 from "@/assets/touchwork/DM215G-X86.jpg";
import GD133_ARM from "@/assets/touchwork/GD133-ARM.jpg";
import GD133_Monitor from "@/assets/touchwork/GD133-Monitor.jpg";
import GD133_X86 from "@/assets/touchwork/GD133-X86.jpg";
import JD185B_ARM from "@/assets/touchwork/JD185B-ARM.jpg";
import JD185B_Monitor from "@/assets/touchwork/JD185B-Monitor.jpg";
import JD185B_X86 from "@/assets/touchwork/JD185B-X86.jpg";
// New 2026 additions (4 models — sourced from TouchWo catalog)
import GD101E_Monitor from "@/assets/touchwork/products/gd101e-monitor.jpg";
import GD101E_ARM from "@/assets/touchwork/products/gd101e-arm.jpg";
import GD101E_X86 from "@/assets/touchwork/products/gd101e-x86.jpg";
import JD133_Monitor from "@/assets/touchwork/products/jd133-monitor.jpg";
import JD133_ARM from "@/assets/touchwork/products/jd133-arm.jpg";
import JD156B_Monitor from "@/assets/touchwork/products/jd156b-monitor.jpg";
import JD156B_ARM from "@/assets/touchwork/products/jd156b-arm.jpg";
import JD156B_X86 from "@/assets/touchwork/products/jd156b-x86.jpg";
import JD215B_Monitor from "@/assets/touchwork/products/jd215b-monitor.jpg";
import JD215B_ARM from "@/assets/touchwork/products/jd215b-arm.jpg";
import JD215B_X86 from "@/assets/touchwork/products/jd215b-x86.jpg";

export type TouchWorkArch = "Monitor" | "ARM" | "X86";

export interface TouchWorkVariant {
  arch: TouchWorkArch;
  image: string;
  os: string;
  cpuHint: string;
  description: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface CpuOption {
  cpu: string;
  gpu: string;
  memory: string;
  storage: string;
  network: string;
  os: string;
}

export interface DetailedSpecs {
  /** LCD Panel — เหมือนทุก variant ของรุ่นเดียวกัน */
  lcd: SpecRow[];
  /** Touch Panel */
  touch: SpecRow[];
  /** Dimension & Weight */
  dimension: SpecRow[];
  /** Operation Environment */
  environment: SpecRow[];
  /** Power Supply */
  power: SpecRow[];
  /** สิ่งที่อยู่ในกล่อง */
  delivery: string[];
  /** ตัวเลือก CPU สำหรับ Android (ARM variant) */
  androidOptions?: CpuOption[];
  /** ตัวเลือก CPU สำหรับ Windows (X86 variant) */
  windowsOptions?: CpuOption[];
}

export interface TouchWorkProduct {
  model: string;
  size: number; // inches
  resolution: string;
  ratio: string;
  touch: string;
  brightness: string;
  ipRating: string;
  mounting: string[];
  highlights: string[];
  variants: TouchWorkVariant[];
  specs: DetailedSpecs;
}

const archMeta: Record<TouchWorkArch, { os: string; cpuHint: string; description: string }> = {
  Monitor: {
    os: "Plug & Play (HDMI/VGA)",
    cpuHint: "ไม่มี CPU — ต่อใช้งานกับเครื่องคอมหลัก",
    description: "จอสัมผัสอุตสาหกรรม สำหรับต่อเข้ากับ PC/Mini PC ใช้งานเป็นหน้าจอแสดงผลรอง",
  },
  ARM: {
    os: "Android 11/13",
    cpuHint: "Rockchip RK3568 / RK3399",
    description: "Touch PC ระบบ Android พร้อมใช้งานทันที เหมาะกับแอป Kiosk, Self-Order, ตู้แสดงผล",
  },
  X86: {
    os: "Windows 10/11 รองรับ",
    cpuHint: "Intel Celeron / Core i3-i7",
    description: "Touch PC ระบบ Windows สำหรับงาน POS, ERP, ระบบจัดการร้านค้า, MES โรงงาน",
  },
};

function buildVariants(model: string, archs: TouchWorkArch[]): TouchWorkVariant[] {
  const imageMap: Record<string, Partial<Record<TouchWorkArch, string>>> = {
    DM080NF: { ARM: DM080NF_ARM, Monitor: DM080NF_Monitor, X86: DM080NF_X86 },
    DM080WG: { ARM: DM080WG_ARM, Monitor: DM080WG_Monitor },
    DM101G: { ARM: DM101G_ARM, Monitor: DM101G_Monitor, X86: DM101G_X86 },
    DM104G: { ARM: DM104G_ARM, Monitor: DM104G_Monitor, X86: DM104G_X86 },
    DM121G: { ARM: DM121G_ARM, Monitor: DM121G_Monitor, X86: DM121G_X86 },
    DM15G: { ARM: DM15G_ARM, Monitor: DM15G_Monitor, X86: DM15G_X86 },
    DM156G: { ARM: DM156G_ARM, Monitor: DM156G_Monitor, X86: DM156G_X86 },
    DM17G: { ARM: DM17G_ARM, Monitor: DM17G_Monitor, X86: DM17G_X86 },
    DM19G: { ARM: DM19G_ARM, Monitor: DM19G_Monitor, X86: DM19G_X86 },
    DM215G: { ARM: DM215G_ARM, Monitor: DM215G_Monitor, X86: DM215G_X86 },
    GD133: { ARM: GD133_ARM, Monitor: GD133_Monitor, X86: GD133_X86 },
    JD185B: { ARM: JD185B_ARM, Monitor: JD185B_Monitor, X86: JD185B_X86 },
    GD101E: { Monitor: GD101E_Monitor, ARM: GD101E_ARM, X86: GD101E_X86 },
    JD133: { Monitor: JD133_Monitor, ARM: JD133_ARM },
    JD156B: { Monitor: JD156B_Monitor, ARM: JD156B_ARM, X86: JD156B_X86 },
    JD215B: { Monitor: JD215B_Monitor, ARM: JD215B_ARM, X86: JD215B_X86 },
  };
  return archs.map((arch) => ({
    arch,
    image: imageMap[model]?.[arch] || "",
    ...archMeta[arch],
  }));
}

// ---- Spec derivation ------------------------------------------------------

interface RawProduct {
  model: string;
  size: number;
  resolution: string;
  ratio: string;
  touch: string;
  brightness: string;
  ipRating: string;
  mounting: string[];
  highlights: string[];
  archs: TouchWorkArch[];
  /** ข้อมูลขนาดเครื่องจริง (ถ้ามีจาก spec sheet) */
  dimensionMm?: string;
  /** ข้อมูลน้ำหนัก (kg) */
  netWeight?: string;
  grossWeight?: string;
  /** active area (mm) */
  activeArea?: string;
  /** ARM CPU options ที่ระบุเฉพาะ */
  androidOptions?: CpuOption[];
  /** X86 CPU options ที่ระบุเฉพาะ */
  windowsOptions?: CpuOption[];
}

const defaultAndroidOptions: CpuOption[] = [
  {
    cpu: "Rockchip RK3568",
    gpu: "ARM Mali-G52 2EE",
    memory: "2GB (เลือก 4GB ได้)",
    storage: "16GB / 32GB eMMC",
    network: "10/100M RJ45, Wi-Fi 802.11 a/b/g/n/ac",
    os: "Android 11",
  },
  {
    cpu: "Rockchip RK3588",
    gpu: "ARM Mali-G610",
    memory: "4GB (เลือก 8GB ได้)",
    storage: "64GB / 128GB eMMC",
    network: "1Gbps RJ45, Wi-Fi 802.11 a/b/g/n/ac",
    os: "Android 12",
  },
  {
    cpu: "Rockchip RK3576",
    gpu: "ARM Mali-G52",
    memory: "4GB (เลือก 8GB ได้)",
    storage: "32GB / 64GB eMMC",
    network: "1Gbps RJ45, Wi-Fi 802.11 a/b/g/n/ac",
    os: "Android 14",
  },
];

const defaultWindowsOptions: CpuOption[] = [
  {
    cpu: "Intel® Celeron® J6412",
    gpu: "Intel® UHD Graphics",
    memory: "DDR4-2666 SODIMM 8GB",
    storage: "mSATA 128GB",
    network: "Gigabit RJ45, Wi-Fi 802.11 a/b/g/n/ac",
    os: "Windows 10 Enterprise 2019 LTSC",
  },
  {
    cpu: "Intel® Core™ i5-8257U",
    gpu: "Intel® Iris® Plus Graphics 645",
    memory: "DDR4-2666 SODIMM 8GB",
    storage: "mSATA 256GB",
    network: "Gigabit RJ45, Wi-Fi 802.11 a/b/g/n/ac",
    os: "Windows 10 / 11 รองรับ",
  },
  {
    cpu: "Intel® Core™ i7-10510U",
    gpu: "Intel® UHD Graphics",
    memory: "DDR4-2666 SODIMM 8GB",
    storage: "mSATA 256GB",
    network: "Gigabit RJ45, Wi-Fi 802.11 a/b/g/n/ac",
    os: "Windows 10 / 11 รองรับ",
  },
];

function buildSpecs(p: RawProduct): DetailedSpecs {
  const lcd: SpecRow[] = [
    { label: "ขนาดหน้าจอ", value: `${p.size} นิ้ว` },
    { label: "ความละเอียด", value: p.resolution },
    { label: "อัตราส่วน", value: p.ratio },
    ...(p.activeArea ? [{ label: "พื้นที่แสดงผล (mm)", value: p.activeArea }] : []),
    { label: "สีที่แสดงผลได้", value: "16.7M" },
    { label: "ความสว่าง", value: `${p.brightness} (≥${p.brightness.replace(/\D/g, "")} cd/m²)` },
    { label: "Contrast Ratio", value: "1000:1" },
    { label: "มุมมอง H/V", value: "178° / 178°" },
    { label: "อายุ Backlight", value: "LED 30,000 ชม." },
    { label: "Refresh Rate", value: "60 Hz" },
  ];

  const touch: SpecRow[] = [
    { label: "เทคโนโลยี", value: "PCAP (Projected Capacitive)" },
    { label: "Response Time", value: "< 5 ms" },
    { label: "จำนวนจุดสัมผัส", value: "10 จุด (Multi-touch)" },
    { label: "ความแม่นยำขั้นต่ำ", value: "> 1.5 mm" },
    { label: "Scanning Frequency", value: "200 Hz" },
    { label: "Scanning Accuracy", value: "4096 × 4096" },
    { label: "กระแส/แรงดันใช้งาน", value: "180mA / DC +5V ±5%" },
    { label: "ความแข็งผิวหน้า", value: "Mohs Class 7 (Explosion-proof Glass)" },
  ];

  const dimension: SpecRow[] = [
    { label: "ขนาดเครื่อง (W×H×T)", value: p.dimensionMm || "ติดต่อทีมขายเพื่อขอแบบเต็ม" },
    { label: "ขนาดช่องฝัง (Embedded)", value: "ตามรุ่น — แจ้งทีมขาย" },
    { label: "น้ำหนักสุทธิ", value: p.netWeight || "ตามรุ่น" },
    { label: "น้ำหนักรวมหีบห่อ", value: p.grossWeight || "ตามรุ่น" },
    { label: "มาตรฐานป้องกัน", value: p.ipRating },
    { label: "รูปแบบติดตั้ง", value: p.mounting.join(" • ") },
  ];

  const environment: SpecRow[] = [
    { label: "อุณหภูมิใช้งาน", value: "0 °C – 50 °C" },
    { label: "ความชื้นใช้งาน", value: "10% – 80% RH" },
    { label: "อุณหภูมิเก็บรักษา", value: "−5 °C – 60 °C" },
    { label: "ความชื้นเก็บรักษา", value: "10% – 85% RH" },
  ];

  const power: SpecRow[] = [
    { label: "Power Input", value: "110–240V AC 50/60Hz" },
    { label: "Power Output", value: "DC 12V 3A" },
    { label: "Standby Power", value: "≤ 0.5W" },
    { label: "Power สูงสุด (Monitor)", value: "< 30W" },
    { label: "Power สูงสุด (Android)", value: "< 36W" },
    { label: "Power สูงสุด (Windows)", value: "< 48W" },
  ];

  const delivery = [
    "คู่มือการใช้งาน × 1",
    "อุปกรณ์ติดตั้ง (Bracket / Mount) × 1",
    "สาย AC Power × 1",
    ...(p.archs.includes("ARM") || p.archs.includes("X86") ? ["เสาอากาศ Wi-Fi × 1"] : []),
  ];

  return {
    lcd,
    touch,
    dimension,
    environment,
    power,
    delivery,
    androidOptions: p.archs.includes("ARM") ? (p.androidOptions || defaultAndroidOptions) : undefined,
    windowsOptions: p.archs.includes("X86") ? (p.windowsOptions || defaultWindowsOptions) : undefined,
  };
}

const rawProducts: RawProduct[] = [
  { model: "DM080NF", size: 8, resolution: "1024 × 768", ratio: "4:3", touch: "Capacitive 10-point", brightness: "300 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 75", "ฝัง Embedded", "ตั้งโต๊ะ"], highlights: ["จอเล็กกะทัดรัด", "เหมาะกับเครื่องคิดเงิน/Kiosk", "ใช้พื้นที่น้อย"], archs: ["Monitor", "ARM", "X86"] },
  { model: "DM080WG", size: 8, resolution: "1280 × 800", ratio: "16:10", touch: "Capacitive 10-point", brightness: "350 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 75", "ฝัง Embedded"], highlights: ["Widescreen 16:10", "ภาพคมชัด", "เหมาะกับโชว์รูมและ Smart Home"], archs: ["Monitor", "ARM"] },
  { model: "DM101G", size: 10.1, resolution: "1280 × 800", ratio: "16:10", touch: "Capacitive 10-point", brightness: "350 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 75", "ฝัง Embedded", "ตั้งโต๊ะ"], highlights: ["ขนาดยอดนิยม", "เหมาะกับ Self-Order ในร้านอาหาร", "ราคาเข้าถึงได้"], archs: ["Monitor", "ARM", "X86"] },
  { model: "DM104G", size: 10.4, resolution: "1024 × 768", ratio: "4:3", touch: "Capacitive 10-point", brightness: "350 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 75", "ฝัง Embedded"], highlights: ["จอ 4:3 คลาสสิก", "เหมาะกับสายการผลิต MES", "ทนทาน"], archs: ["Monitor", "ARM", "X86"] },
  { model: "DM121G", size: 12.1, resolution: "1024 × 768", ratio: "4:3", touch: "Capacitive 10-point", brightness: "400 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 75", "ฝัง Embedded"], highlights: ["แสดงผลคมชัด", "เหมาะกับ HMI โรงงาน", "ใช้งานยาวนาน 24/7"], archs: ["Monitor", "ARM", "X86"] },
  { model: "DM15G", size: 15, resolution: "1024 × 768", ratio: "4:3", touch: "Capacitive 10-point", brightness: "350 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 75/100", "ฝัง Embedded", "ตั้งโต๊ะ"], highlights: ["ขนาดมาตรฐานโรงงาน", "เหมาะกับเครื่องจักร", "ทนฝุ่นและความชื้น"], archs: ["Monitor", "ARM", "X86"] },
  { model: "DM156G", size: 15.6, resolution: "1920 × 1080", ratio: "16:9", touch: "Capacitive 10-point", brightness: "400 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 75/100", "ฝัง Embedded"], highlights: ["Full HD คมชัด", "ขนาด Widescreen ยอดนิยม", "เหมาะกับ POS และ Self-Service"], archs: ["Monitor", "ARM", "X86"] },
  { model: "DM17G", size: 17, resolution: "1280 × 1024", ratio: "5:4", touch: "Capacitive 10-point", brightness: "350 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 100", "ฝัง Embedded"], highlights: ["จอใหญ่อ่านง่าย", "เหมาะกับห้องควบคุม", "ทนทานต่อการใช้งานหนัก"], archs: ["Monitor", "ARM", "X86"] },
  { model: "DM19G", size: 19, resolution: "1280 × 1024", ratio: "5:4", touch: "Capacitive 10-point", brightness: "350 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 100", "ฝัง Embedded", "ตั้งโต๊ะ"], highlights: ["จอใหญ่ระดับ Workstation", "เหมาะกับ ERP และระบบจัดการ", "พื้นที่ทำงานกว้าง"], archs: ["Monitor", "ARM", "X86"] },
  { model: "DM215G", size: 21.5, resolution: "1920 × 1080", ratio: "16:9", touch: "Capacitive 10-point", brightness: "400 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 100", "ฝัง Embedded", "ตั้งโต๊ะ"], highlights: ["Full HD จอใหญ่", "เหมาะกับ Digital Signage และ Self-Order", "ดีไซน์ทันสมัย"], archs: ["Monitor", "ARM", "X86"] },
  { model: "GD133", size: 13.3, resolution: "1920 × 1080", ratio: "16:9", touch: "Capacitive 10-point", brightness: "250 nits", ipRating: "IP65 (หน้า)", mounting: ["Wall Mount (ติดผนังเฉพาะรุ่น)", "VESA 75"], highlights: ["ดีไซน์ติดผนังเฉพาะ", "Full HD บางเฉียบ", "เหมาะกับโรงแรม/ออฟฟิศ"], archs: ["Monitor", "ARM", "X86"], dimensionMm: "337.53 × 297.13 × 42.8 mm", activeArea: "239.4 × 165 mm", netWeight: "3.33 kg", grossWeight: "4.51 kg" },
  { model: "JD185B", size: 18.5, resolution: "1366 × 768", ratio: "16:9", touch: "Capacitive 10-point", brightness: "350 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 100", "ฝัง Embedded"], highlights: ["ขนาดกลางคุ้มค่า", "เหมาะกับ Kiosk ทั่วไป", "ดีไซน์เรียบร้อย"], archs: ["Monitor", "ARM", "X86"] },
  // ── New 2026 additions ──
  { model: "GD101E", size: 10.1, resolution: "1280 × 800", ratio: "16:10", touch: "Capacitive 10-point", brightness: "300 nits", ipRating: "IP65 (หน้า)", mounting: ["Wall Mount (ติดผนังเฉพาะรุ่น)", "VESA 75"], highlights: ["ดีไซน์ Wall-Mount Kiosk", "Aluminum Unibody", "Slim Bezel ทันสมัย"], archs: ["Monitor", "ARM", "X86"] },
  { model: "JD133", size: 13.3, resolution: "1920 × 1080", ratio: "16:9", touch: "Capacitive 10-point", brightness: "300 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 75", "ตั้งโต๊ะ"], highlights: ["Ultra-slim Die-cast Body", "Curved Streamlined Back", "เหมาะกับ Premium Self-Service"], archs: ["Monitor", "ARM"] },
  { model: "JD156B", size: 15.6, resolution: "1920 × 1080", ratio: "16:9", touch: "Capacitive 10-point", brightness: "300 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 75/100", "ตั้งโต๊ะ"], highlights: ["Ultra-slim Premium", "Optional LED Ring สำหรับ Branding", "เหมาะกับ POS/Self-Order"], archs: ["Monitor", "ARM", "X86"] },
  { model: "JD215B", size: 21.5, resolution: "1920 × 1080", ratio: "16:9", touch: "Capacitive 10-point", brightness: "300 nits", ipRating: "IP65 (หน้า)", mounting: ["VESA 100", "ตั้งโต๊ะ"], highlights: ["Full HD จอใหญ่ ราคาประหยัด", "Die-cast Unibody", "เหมาะกับ Digital Signage"], archs: ["Monitor", "ARM", "X86"] },
];

export const touchworkProducts: TouchWorkProduct[] = rawProducts.map((p) => ({
  model: p.model,
  size: p.size,
  resolution: p.resolution,
  ratio: p.ratio,
  touch: p.touch,
  brightness: p.brightness,
  ipRating: p.ipRating,
  mounting: p.mounting,
  highlights: p.highlights,
  variants: buildVariants(p.model, p.archs),
  specs: buildSpecs(p),
}));

export const sizeOptions = [8, 10.1, 10.4, 12.1, 13.3, 15, 15.6, 17, 18.5, 19, 21.5];
export const archOptions: TouchWorkArch[] = ["Monitor", "ARM", "X86"];

export function getTouchworkProduct(model: string): TouchWorkProduct | undefined {
  return touchworkProducts.find((p) => p.model.toLowerCase() === model.toLowerCase());
}

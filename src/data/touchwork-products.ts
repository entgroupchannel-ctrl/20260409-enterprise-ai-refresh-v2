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
  };
  return archs.map((arch) => ({
    arch,
    image: imageMap[model]?.[arch] || "",
    ...archMeta[arch],
  }));
}

export const touchworkProducts: TouchWorkProduct[] = [
  {
    model: "DM080NF",
    size: 8,
    resolution: "1024 × 768",
    ratio: "4:3",
    touch: "Capacitive 10-point",
    brightness: "300 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 75", "ฝัง Embedded", "ตั้งโต๊ะ"],
    highlights: ["จอเล็กกะทัดรัด", "เหมาะกับเครื่องคิดเงิน/Kiosk", "ใช้พื้นที่น้อย"],
    variants: buildVariants("DM080NF", ["Monitor", "ARM", "X86"]),
  },
  {
    model: "DM080WG",
    size: 8,
    resolution: "1280 × 800",
    ratio: "16:10",
    touch: "Capacitive 10-point",
    brightness: "350 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 75", "ฝัง Embedded"],
    highlights: ["Widescreen 16:10", "ภาพคมชัด", "เหมาะกับโชว์รูมและ Smart Home"],
    variants: buildVariants("DM080WG", ["Monitor", "ARM"]),
  },
  {
    model: "DM101G",
    size: 10.1,
    resolution: "1280 × 800",
    ratio: "16:10",
    touch: "Capacitive 10-point",
    brightness: "350 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 75", "ฝัง Embedded", "ตั้งโต๊ะ"],
    highlights: ["ขนาดยอดนิยม", "เหมาะกับ Self-Order ในร้านอาหาร", "ราคาเข้าถึงได้"],
    variants: buildVariants("DM101G", ["Monitor", "ARM", "X86"]),
  },
  {
    model: "DM104G",
    size: 10.4,
    resolution: "1024 × 768",
    ratio: "4:3",
    touch: "Capacitive 10-point",
    brightness: "350 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 75", "ฝัง Embedded"],
    highlights: ["จอ 4:3 คลาสสิก", "เหมาะกับสายการผลิต MES", "ทนทาน"],
    variants: buildVariants("DM104G", ["Monitor", "ARM", "X86"]),
  },
  {
    model: "DM121G",
    size: 12.1,
    resolution: "1024 × 768",
    ratio: "4:3",
    touch: "Capacitive 10-point",
    brightness: "400 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 75", "ฝัง Embedded"],
    highlights: ["แสดงผลคมชัด", "เหมาะกับ HMI โรงงาน", "ใช้งานยาวนาน 24/7"],
    variants: buildVariants("DM121G", ["Monitor", "ARM", "X86"]),
  },
  {
    model: "DM15G",
    size: 15,
    resolution: "1024 × 768",
    ratio: "4:3",
    touch: "Capacitive 10-point",
    brightness: "350 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 75/100", "ฝัง Embedded", "ตั้งโต๊ะ"],
    highlights: ["ขนาดมาตรฐานโรงงาน", "เหมาะกับเครื่องจักร", "ทนฝุ่นและความชื้น"],
    variants: buildVariants("DM15G", ["Monitor", "ARM", "X86"]),
  },
  {
    model: "DM156G",
    size: 15.6,
    resolution: "1920 × 1080",
    ratio: "16:9",
    touch: "Capacitive 10-point",
    brightness: "400 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 75/100", "ฝัง Embedded"],
    highlights: ["Full HD คมชัด", "ขนาด Widescreen ยอดนิยม", "เหมาะกับ POS และ Self-Service"],
    variants: buildVariants("DM156G", ["Monitor", "ARM", "X86"]),
  },
  {
    model: "DM17G",
    size: 17,
    resolution: "1280 × 1024",
    ratio: "5:4",
    touch: "Capacitive 10-point",
    brightness: "350 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 100", "ฝัง Embedded"],
    highlights: ["จอใหญ่อ่านง่าย", "เหมาะกับห้องควบคุม", "ทนทานต่อการใช้งานหนัก"],
    variants: buildVariants("DM17G", ["Monitor", "ARM", "X86"]),
  },
  {
    model: "DM19G",
    size: 19,
    resolution: "1280 × 1024",
    ratio: "5:4",
    touch: "Capacitive 10-point",
    brightness: "350 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 100", "ฝัง Embedded", "ตั้งโต๊ะ"],
    highlights: ["จอใหญ่ระดับ Workstation", "เหมาะกับ ERP และระบบจัดการ", "พื้นที่ทำงานกว้าง"],
    variants: buildVariants("DM19G", ["Monitor", "ARM", "X86"]),
  },
  {
    model: "DM215G",
    size: 21.5,
    resolution: "1920 × 1080",
    ratio: "16:9",
    touch: "Capacitive 10-point",
    brightness: "400 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 100", "ฝัง Embedded", "ตั้งโต๊ะ"],
    highlights: ["Full HD จอใหญ่", "เหมาะกับ Digital Signage และ Self-Order", "ดีไซน์ทันสมัย"],
    variants: buildVariants("DM215G", ["Monitor", "ARM", "X86"]),
  },
  {
    model: "GD133",
    size: 13.3,
    resolution: "1920 × 1080",
    ratio: "16:9",
    touch: "Capacitive 10-point",
    brightness: "400 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["Wall Mount (ติดผนังเฉพาะรุ่น)", "VESA 75"],
    highlights: ["ดีไซน์ติดผนังเฉพาะ", "Full HD บางเฉียบ", "เหมาะกับโรงแรม/ออฟฟิศ"],
    variants: buildVariants("GD133", ["Monitor", "ARM", "X86"]),
  },
  {
    model: "JD185B",
    size: 18.5,
    resolution: "1366 × 768",
    ratio: "16:9",
    touch: "Capacitive 10-point",
    brightness: "350 nits",
    ipRating: "IP65 (หน้า)",
    mounting: ["VESA 100", "ฝัง Embedded"],
    highlights: ["ขนาดกลางคุ้มค่า", "เหมาะกับ Kiosk ทั่วไป", "ดีไซน์เรียบร้อย"],
    variants: buildVariants("JD185B", ["Monitor", "ARM", "X86"]),
  },
];

export const sizeOptions = [8, 10.1, 10.4, 12.1, 13.3, 15, 15.6, 17, 18.5, 19, 21.5];
export const archOptions: TouchWorkArch[] = ["Monitor", "ARM", "X86"];

export function getTouchworkProduct(model: string): TouchWorkProduct | undefined {
  return touchworkProducts.find((p) => p.model.toLowerCase() === model.toLowerCase());
}

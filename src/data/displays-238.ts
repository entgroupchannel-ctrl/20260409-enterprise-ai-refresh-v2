/**
 * Touch Display 23.8" — Wall-Mounting Touch Kiosk series
 * เริ่มด้วย GD238C (Portrait 9:16) และ GD238C3 (Landscape 16:9)
 * รองรับการขยายรุ่นในอนาคตสำหรับขนาด 23.8"
 *
 * Types ใช้ร่วมกับ displays-32 เพื่อ Display32Detail ใช้ component เดียวกันได้
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";

// GD238C — Portrait 9:16 (ภาพต้นฉบับจาก touchwo.com)
import gdP1 from "@/assets/touchwo/gd238c/p-1a.jpg";
import gdP2 from "@/assets/touchwo/gd238c/p-2A.jpg";
import gdP3 from "@/assets/touchwo/gd238c/p-3.jpg";
import gdP4 from "@/assets/touchwo/gd238c/p-4-1.jpg";
import gdP5 from "@/assets/touchwo/gd238c/p-5.jpg";
import gdP6 from "@/assets/touchwo/gd238c/p-6.jpg";
import gdP7 from "@/assets/touchwo/gd238c/p-7.jpg";

// GD238C3 — Landscape 16:9 unique stills
import gdL1 from "@/assets/touchwo/gd238c/L-1.jpg";
import gdL2 from "@/assets/touchwo/gd238c/L-2.jpg";

// Shared scenes / lifestyle / install
import gdIO from "@/assets/touchwo/gd238c/io.jpg";
import gdInstall1 from "@/assets/touchwo/gd238c/install-1.jpg";
import gdInstall2 from "@/assets/touchwo/gd238c/install-2.jpg";
import gdInstall3 from "@/assets/touchwo/gd238c/install-3.jpg";
import gdPos1 from "@/assets/touchwo/gd238c/pos-1.jpg";
import gdPos2 from "@/assets/touchwo/gd238c/pos-2.jpg";
import gdDesign from "@/assets/touchwo/gd238c/design.png";

export type Display238Slug = "gd238c" | "gd238c3";

export { OS_BACKGROUNDS };
export type { OSKey };

/* ── Spec building blocks (shared between portrait/landscape) ── */
const COMMON_FEATURES = [
  "ขอบจอบาง 13mm — Ultra-small Bezel สไตล์ iPad-like",
  "Industrial-grade Power Supply — รองรับ 7×24H Stable Working",
  "30,000-hour Extended-life LED Backlight",
  "PCAP 10-point Touch + Mohs class 7 explosion-proof glass",
  "Pre-install Android 11/12 — รองรับ Square / Stripe / Clover / Shopify POS",
  "Rockchip ARM — เลือก RK3568 (cost-effective) หรือ RK3588 (high-performance)",
  "5GHz Wi-Fi + BLE 5.0 — เชื่อมต่อ POS / Printer ได้เสถียร",
  "ติดตั้งได้หลายแบบ: Wall-mount / Desktop / Floor (Optional Pre-drilled)",
];

const COMMON_HIGHLIGHTS = [
  { icon: "Maximize", title: "ขอบจอบาง 13mm", subtitle: "Ultra-small Bezel iPad-like" },
  { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs class 7 glass" },
  { icon: "Smartphone", title: "Square POS Ready", subtitle: "Android 11/12 + 5GHz Wi-Fi + BLE 5.0" },
  { icon: "ShieldCheck", title: "ทำงาน 24/7", subtitle: "อัตราซ่อม 2 ปี ≤ 1.5%" },
];

const COMMON_USECASES = ["Retail POS / Self-order", "Banking / Self-service", "Hospitality Check-in", "Wayfinding / Info Kiosk"];

const COMMON_VARIANT_ARM: Display32["variants"][number] = {
  key: "android",
  label: "Android (ARM) — Pre-installed",
  badge: "All-in-One — Rockchip RK3568 / RK3588",
  osBackground: "android",
  icon: "Smartphone",
  description:
    "All-in-One จอ 23.8\" PCAP พร้อม Rockchip ARM ภายใน — ติดตั้ง Android 11/12 จากโรงงาน เลือก CPU ได้ระหว่าง RK3568 (cost-effective) หรือ RK3588 (high-performance) รองรับ Square / Stripe / Clover / Shopify POS พร้อม 5GHz Wi-Fi + BLE 5.0",
  bestFor: "Retail POS / Self-order Kiosk / Wayfinding ที่ใช้ Android App",
  highlights: [
    "Rockchip RK3568 หรือ RK3588 (เลือกได้)",
    "Pre-install Android 11 / 12",
    "5GHz Wi-Fi + BLE 5.0 — รองรับ POS โดยตรง",
    "Power Consumption Android < 36W",
  ],
  cpu: "Rockchip RK3568 / RK3588",
  ram: "2–8GB LPDDR4",
  storage: "eMMC 16–128GB",
  accent: "secondary",
};

const COMMON_VARIANT_X86: Display32["variants"][number] = {
  key: "x86",
  label: "Windows / Linux (x86) — Optional",
  badge: "All-in-One — Intel x86",
  osBackground: "windows",
  icon: "Cpu",
  description:
    "ตัวเลือก All-in-One PC พร้อม Intel x86 ภายใน — ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน รองรับซอฟต์แวร์ POS / KIOSK / ERP เต็มรูปแบบ Power Consumption < 48W",
  bestFor: "Self-checkout / KIOSK ที่ใช้ซอฟต์แวร์ Windows-based",
  highlights: [
    "Intel x86 — Celeron / Core i5 / Core i7 (ตามลูกค้าระบุ)",
    "Pre-install Windows 10 / 11 / Linux",
    "Gigabit RJ45 + Wi-Fi 802.11ac",
    "Power Consumption x86 < 48W",
  ],
  cpu: "Intel Celeron / Core i5 / Core i7",
  ram: "4–16GB DDR4",
  storage: "SSD 128–512GB",
  accent: "primary",
};

const COMMON_PORTS = [
  "RJ45 × 1", "USB × 2", "HDMI in × 1", "Audio out × 1",
  "Power Socket × 1", "Wi-Fi Antenna × 1",
];

const COMMON_INCLUDED = { title: "Included in the Delivery", rows: [
  { label: "Manual / คู่มือ", value: "× 1" },
  { label: "Wi-Fi Antenna", value: "× 1" },
  { label: "Wall mount bracket", value: "× 1" },
  { label: "AC Power cable", value: "× 1" },
]};

const COMMON_TOUCH = { title: "Touch Panel", rows: [
  { label: "เทคโนโลยี", value: "PCAP (Capacitive)" },
  { label: "เวลาตอบสนอง", value: "< 5ms" },
  { label: "จำนวนจุดสัมผัส", value: "10 จุด standard" },
  { label: "Touch Recognition", value: "> 1.5mm" },
  { label: "Scanning Frequency", value: "200 Hz" },
  { label: "Scanning Accuracy", value: "4096 × 4096" },
  { label: "Working Voltage", value: "180mA / DC +5V ±5%" },
  { label: "ผิวหน้า", value: "Mohs class 7 explosion-proof glass" },
]};

const COMMON_ENV = { title: "Operation Environment", rows: [
  { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
  { label: "ความชื้นทำงาน", value: "10% - 80%" },
  { label: "อุณหภูมิเก็บรักษา", value: "-5°C - 60°C" },
  { label: "ความชื้นเก็บรักษา", value: "10% - 85%" },
]};

const COMMON_POWER = { title: "Power Supply", rows: [
  { label: "Power Input", value: "110-240V AC 50/60Hz" },
  { label: "Power Output", value: "DC 12V 4A" },
  { label: "Standby Power", value: "≤ 0.5W" },
  { label: "Overall Power", value: "Android < 36W / x86 < 48W" },
]};

const COMMON_USECASE_SCENARIOS = [
  { image: gdPos1,     title: "POS Self-order / Retail",     description: "ตู้คีออสก์แขวนผนังขนาด 23.8\" สำหรับสั่งอาหาร/จ่ายเงินในร้าน QSR และร้านค้าปลีก รองรับ Square / Stripe / Clover / Shopify POS โดยตรง พร้อม BLE 5.0 เชื่อม Card Reader / Receipt Printer" },
  { image: gdPos2,     title: "Banking / Mini-bank",          description: "จุดบริการสมาชิกธนาคารหรือ Mini-bank ในศูนย์การค้า ติดตั้งแบบแขวนผนังประหยัดพื้นที่ จอสัมผัส PCAP ตอบสนองไว เหมาะกับการกรอกข้อมูลและยืนยันตัวตน" },
  { image: gdInstall1, title: "Hospitality / Check-in",       description: "จุด Self check-in โรงแรม / รีสอร์ต / โรงพยาบาล แขวนผนังบริเวณล็อบบี้ ลดภาระ Front desk และเพิ่มประสบการณ์ลูกค้า" },
  { image: gdInstall2, title: "Wayfinding / Info Kiosk",      description: "ตู้ค้นหาข้อมูล/แผนที่ในศูนย์การค้า อาคารสำนักงาน หรือสถานที่ราชการ — UI เรียบง่ายไม่ต้องฝึกอบรม รองรับการใช้งานหนักในพื้นที่สาธารณะ" },
];

export const DISPLAYS_238: Record<Display238Slug, Display32> = {
  gd238c: {
    slug: "gd238c",
    modelCode: "GD238C",
    name: '23.8" GD238C Series — Wall Mounting Touch Kiosk (Portrait 9:16)',
    shortName: "GD238C (Portrait)",
    category: "Wall-Mounting 23.8\" Touch Kiosk",
    formFactor: "Wall Kiosk",
    tagline: "ตู้คีออสก์แขวนผนัง 23.8\" PCAP แนวตั้ง 9:16 — Square POS Ready / Android 11–12 / Mohs 7",
    description:
      "GD238C คือตู้คีออสก์แขวนผนังขนาด 23.8 นิ้ว PCAP 10-point Touch แนวตั้ง (Portrait 9:16) เหมาะกับงาน POS / Self-order / Wayfinding ที่ต้องการประหยัดพื้นที่ — ดีไซน์ Ultra-thin Bezel 13mm สไตล์ iPad-like พร้อม Industrial-grade Power Supply รองรับ 7×24H Stable Working — เลือก Configuration ได้: (1) Android (ARM) ติดตั้ง Android 11/12 พร้อม Rockchip RK3568 / RK3588 รองรับ Square / Stripe / Clover / Shopify POS โดยตรง, (2) Windows / Linux (x86) Optional ติดตั้งได้ทั้งแขวนผนัง วางโต๊ะ หรือยึดพื้น (Pre-drilled Optional)",
    highlights: COMMON_HIGHLIGHTS,
    features: COMMON_FEATURES,
    useCases: COMMON_USECASES,
    useCaseScenarios: COMMON_USECASE_SCENARIOS,
    gallery: [gdP1, gdP2, gdP3, gdP4, gdP5, gdP6, gdP7],
    ioImage: gdIO,
    installImages: [gdInstall1, gdInstall2, gdInstall3],
    featureImages: [gdDesign],
    dimensionDrawings: [],
    osSupport: ["android", "windows", "linux"],
    variants: [COMMON_VARIANT_ARM, COMMON_VARIANT_X86],
    cpuOptions: [
      {
        tier: "Entry",
        cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)",
        gpu: "ARM Mali-G52 2EE",
        ram: "LPDDR4 2–4GB",
        storage: "eMMC 16–32GB",
        targetUseCase: "Digital Signage, POS Self-order, Wayfinding ทั่วไป",
      },
      {
        tier: "High",
        cpu: "Rockchip RK3588 (Octa-core, 8nm)",
        gpu: "ARM Mali-G610 MP4",
        ram: "LPDDR4 4–8GB",
        storage: "eMMC 64–128GB",
        targetUseCase: "AI Vision, Multi-app POS, 4K Multimedia, Smart Retail",
      },
    ],
    datasheetUrl: "https://touchwo.com/wp-content/uploads/2024/11/GD238CARM23.8inch-Touch-Kiosk-TouchWo-SpecSheet.pdf",
    ports: COMMON_PORTS,
    specs: [
      { title: "Android System (ARM)", rows: [
        { label: "CPU (เลือกได้)", value: "Rockchip RK3568 / RK3588" },
        { label: "Graphic GPU", value: "ARM Mali-G52 2EE / Mali-G610 MP4" },
        { label: "หน่วยความจำ (RAM)", value: "LPDDR4 2 / 4 / 8 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "eMMC 16 / 32 / 64 / 128 GB" },
        { label: "เครือข่าย", value: "RJ45 + 5GHz Wi-Fi 802.11ac + BLE 5.0" },
        { label: "OS ที่ติดตั้งให้", value: "Android 11 / Android 12" },
      ]},
      { title: "PC System (Windows / Linux x86) — Optional", rows: [
        { label: "CPU (เลือกได้)", value: "Intel Celeron / Core i5 / Core i7" },
        { label: "หน่วยความจำ (RAM)", value: "DDR4 4 / 8 / 16 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "SSD 128 / 256 / 512 GB" },
        { label: "เครือข่าย", value: "Gigabit RJ45 + Wi-Fi 802.11ac" },
        { label: "OS ที่ติดตั้งให้", value: "Windows 10 / 11 / Linux (เลือกได้)" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "23.8 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "9 : 16 (Portrait)" },
        { label: "พื้นที่แสดงผล", value: "529 × 298.5 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "≥ 250 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "1000 : 1" },
        { label: "มุมมอง H/V", value: "178° / 178°" },
        { label: "อายุ Backlight", value: "LED 30,000 ชม." },
        { label: "Refresh Rate", value: "60 Hz" },
      ]},
      COMMON_TOUCH,
      COMMON_ENV,
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง (W×H×T)", value: "37.8 × 79.4 × 7.2 cm" },
        { label: "ขนาดกล่อง (W×H×T)", value: "52 × 95 × 22 cm" },
        { label: "น้ำหนักสุทธิ", value: "14 kg" },
        { label: "น้ำหนักรวม", value: "19 kg" },
      ]},
      COMMON_POWER,
      COMMON_INCLUDED,
    ],
    quick: {
      resolution: "1920×1080 FHD",
      brightness: "≥250 cd/m²",
      contrast: "1000:1",
      touch: "PCAP 10pt + Mohs 7",
      os: "Android 11/12 (Windows opt.)",
      formFactor: "Wall-Mount Portrait 9:16",
      dimensionCm: "37.8 × 79.4 × 7.2",
      weightKg: "14",
      power: "< 48W",
      install: "Wall / Desktop / Floor (Pre-drilled opt.)",
    },
  },
  gd238c3: {
    slug: "gd238c3",
    modelCode: "GD238C3",
    name: '23.8" GD238C3 Series — Wall Mounting Touch Kiosk (Landscape 16:9)',
    shortName: "GD238C3 (Landscape)",
    category: "Wall-Mounting 23.8\" Touch Kiosk",
    formFactor: "Wall Kiosk",
    tagline: "ตู้คีออสก์แขวนผนัง 23.8\" PCAP แนวนอน 16:9 — Square POS Ready / Android 11–12 / Mohs 7",
    description:
      "GD238C3 คือรุ่นแนวนอน (Landscape 16:9) ของตระกูล GD238 — ตู้คีออสก์แขวนผนังขนาด 23.8 นิ้ว PCAP 10-point Touch ดีไซน์ Ultra-thin Bezel 13mm สไตล์ iPad-like เหมาะกับงาน Conference Check-in, Reception, Wayfinding หรือ Digital Menu Board ขนาดเล็ก — ตัวเครื่องเดียวกับ GD238C เพียงสลับการวางจอเป็นแนวนอน รองรับ Configuration เดียวกัน: (1) Android (ARM) RK3568 / RK3588 พร้อม Square / Stripe / Clover / Shopify POS, (2) Windows / Linux (x86) Optional พร้อม Industrial-grade Power Supply รองรับ 7×24H",
    highlights: COMMON_HIGHLIGHTS,
    features: COMMON_FEATURES,
    useCases: ["Reception / Check-in", "Digital Menu Board", "Conference / Hot-desk", "Wayfinding / Info"],
    useCaseScenarios: COMMON_USECASE_SCENARIOS,
    gallery: [gdL1, gdL2, gdP3, gdP4, gdP5, gdP6, gdP7],
    ioImage: gdIO,
    installImages: [gdInstall1, gdInstall2, gdInstall3],
    featureImages: [gdDesign],
    dimensionDrawings: [],
    osSupport: ["android", "windows", "linux"],
    variants: [COMMON_VARIANT_ARM, COMMON_VARIANT_X86],
    cpuOptions: [
      {
        tier: "Entry",
        cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)",
        gpu: "ARM Mali-G52 2EE",
        ram: "LPDDR4 2–4GB",
        storage: "eMMC 16–32GB",
        targetUseCase: "Digital Signage, Reception, Wayfinding ทั่วไป",
      },
      {
        tier: "High",
        cpu: "Rockchip RK3588 (Octa-core, 8nm)",
        gpu: "ARM Mali-G610 MP4",
        ram: "LPDDR4 4–8GB",
        storage: "eMMC 64–128GB",
        targetUseCase: "Smart Reception, AI Vision, 4K Digital Menu",
      },
    ],
    datasheetUrl: "https://touchwo.com/wp-content/uploads/2024/11/GD238C3ARM23.8inch-Touch-Kiosk-TouchWo-SpecSheet.pdf",
    ports: COMMON_PORTS,
    specs: [
      { title: "Android System (ARM)", rows: [
        { label: "CPU (เลือกได้)", value: "Rockchip RK3568 / RK3588" },
        { label: "Graphic GPU", value: "ARM Mali-G52 2EE / Mali-G610 MP4" },
        { label: "หน่วยความจำ (RAM)", value: "LPDDR4 2 / 4 / 8 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "eMMC 16 / 32 / 64 / 128 GB" },
        { label: "เครือข่าย", value: "RJ45 + 5GHz Wi-Fi 802.11ac + BLE 5.0" },
        { label: "OS ที่ติดตั้งให้", value: "Android 11 / Android 12" },
      ]},
      { title: "PC System (Windows / Linux x86) — Optional", rows: [
        { label: "CPU (เลือกได้)", value: "Intel Celeron / Core i5 / Core i7" },
        { label: "หน่วยความจำ (RAM)", value: "DDR4 4 / 8 / 16 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "SSD 128 / 256 / 512 GB" },
        { label: "เครือข่าย", value: "Gigabit RJ45 + Wi-Fi 802.11ac" },
        { label: "OS ที่ติดตั้งให้", value: "Windows 10 / 11 / Linux (เลือกได้)" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "23.8 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9 (Landscape)" },
        { label: "พื้นที่แสดงผล", value: "529 × 298.5 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "≥ 250 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "1000 : 1" },
        { label: "มุมมอง H/V", value: "178° / 178°" },
        { label: "อายุ Backlight", value: "LED 30,000 ชม." },
        { label: "Refresh Rate", value: "60 Hz" },
      ]},
      COMMON_TOUCH,
      COMMON_ENV,
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง (W×H×D)", value: "37.8 × 92.7 × 90 cm" },
        { label: "ขนาดกล่อง (W×H×D)", value: "102.5 × 48 × 18.5 cm" },
        { label: "น้ำหนักสุทธิ", value: "15.7 kg" },
        { label: "น้ำหนักรวม", value: "19 kg" },
      ]},
      COMMON_POWER,
      COMMON_INCLUDED,
    ],
    quick: {
      resolution: "1920×1080 FHD",
      brightness: "≥250 cd/m²",
      contrast: "1000:1",
      touch: "PCAP 10pt + Mohs 7",
      os: "Android 11/12 (Windows opt.)",
      formFactor: "Wall-Mount Landscape 16:9",
      dimensionCm: "37.8 × 92.7 × 90",
      weightKg: "15.7",
      power: "< 48W",
      install: "Wall / Desktop / Floor (Pre-drilled opt.)",
    },
  },
};

export const DISPLAY_238_ORDER: Display238Slug[] = ["gd238c", "gd238c3"];

export const getDisplay238 = (slug: string): Display32 | undefined =>
  (DISPLAYS_238 as Record<string, Display32>)[slug];

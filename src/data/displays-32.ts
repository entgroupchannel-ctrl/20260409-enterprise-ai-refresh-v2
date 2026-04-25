// Master data for 32-inch Touch Display series (HD32, HR32 Monitor, HR32 Android, GD32C, KD32B)
// Sources: touchwo.com (scraped 2026-04) + Supabase Storage assets

const STORAGE = "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public";
const IMG = (model: string, name: string) =>
  `${STORAGE}/product-images/touchwo/${model}/${name}`;
const PDF = (name: string) => `${STORAGE}/datasheets/touchwo/${name}`;

// OS background wallpapers (replaces source-site branded icons)
import osWindows from "@/assets/touchwo/os-windows.jpg";
import osLinux from "@/assets/touchwo/os-linux.jpg";
import osAndroid from "@/assets/touchwo/os-android.jpg";

// Clean hero shots (logo/watermark removed)
import hd32HeroClean from "@/assets/touchwo/hd32-hero-clean.jpg";
import hr32HeroClean from "@/assets/touchwo/hr32-hero-clean.jpg";
import kd32bHeroClean from "@/assets/touchwo/kd32b-hero-clean.jpg";
// Clean gallery-02 replacements (TouchWo watermark removed)
import hd32Gallery02Clean from "@/assets/touchwo/hd32-gallery-02-clean.jpg";
import hr32Gallery02Clean from "@/assets/touchwo/hr32-gallery-02-clean.jpg";
import kd32bGallery02Clean from "@/assets/touchwo/kd32b-gallery-02-clean.jpg";
// Clean install images (TouchWo watermark removed → Android theme)
import hd32Install01Clean from "@/assets/touchwo/hd32-install-01-clean.jpg";
import hd32Install02Clean from "@/assets/touchwo/hd32-install-02-clean.jpg";
import hd32Install03Clean from "@/assets/touchwo/hd32-install-03-clean.jpg";
// Mechanical dimension drawings
import hr32DimFront from "@/assets/touchwo/hr32-dim-front.jpg";
import hr32DimBack from "@/assets/touchwo/hr32-dim-back.jpg";
import gd32cDimFront from "@/assets/touchwo/gd32c-dim-front.png";
import gd32cDimBack from "@/assets/touchwo/gd32c-dim-back.png";
import hd32DimBack1 from "@/assets/touchwo/hd32-dim-back-1.png";
import hd32DimMultiview from "@/assets/touchwo/hd32-dim-multiview.png";
import kd32bDim1 from "@/assets/touchwo/kd32b-dim-1.png";
import kd32bDim2 from "@/assets/touchwo/kd32b-dim-2.png";

// Use-case lifestyle scenes (AI-generated for inspiration)
import hd32UcRetail from "@/assets/touchwo/usecases/hd32-uc-retail.jpg";
import hd32UcHotel from "@/assets/touchwo/usecases/hd32-uc-hotel.jpg";
import hd32UcOffice from "@/assets/touchwo/usecases/hd32-uc-office.jpg";
import hd32UcPos from "@/assets/touchwo/usecases/hd32-uc-pos.jpg";
import hr32UcAirport from "@/assets/touchwo/usecases/hr32-uc-airport.jpg";
import hr32UcHospital from "@/assets/touchwo/usecases/hr32-uc-hospital.jpg";
import hr32UcEducation from "@/assets/touchwo/usecases/hr32-uc-education.jpg";
import hr32UcMall from "@/assets/touchwo/usecases/hr32-uc-mall.jpg";
import hr32aUcSignage from "@/assets/touchwo/usecases/hr32a-uc-signage.jpg";
import hr32aUcSelfservice from "@/assets/touchwo/usecases/hr32a-uc-selfservice.jpg";
import hr32aUcPos from "@/assets/touchwo/usecases/hr32a-uc-pos.jpg";
import hr32aUcMeeting from "@/assets/touchwo/usecases/hr32a-uc-meeting.jpg";
import gd32cUcRetail from "@/assets/touchwo/usecases/gd32c-uc-retail.jpg";
import gd32cUcBank from "@/assets/touchwo/usecases/gd32c-uc-bank.jpg";
import gd32cUcHotel from "@/assets/touchwo/usecases/gd32c-uc-hotel.jpg";
import gd32cUcMuseum from "@/assets/touchwo/usecases/gd32c-uc-museum.jpg";
import kd32bUcMall from "@/assets/touchwo/usecases/kd32b-uc-mall.jpg";
import kd32bUcBank from "@/assets/touchwo/usecases/kd32b-uc-bank.jpg";
import kd32bUcLogistics from "@/assets/touchwo/usecases/kd32b-uc-logistics.jpg";
import kd32bUcTransit from "@/assets/touchwo/usecases/kd32b-uc-transit.jpg";

export const OS_BACKGROUNDS = {
  windows: { src: osWindows, label: "Windows", subtitle: "x86 Intel/AMD รองรับ Windows 10/11 IoT" },
  linux:   { src: osLinux,   label: "Linux",   subtitle: "Ubuntu / Debian / Custom Distros" },
  android: { src: osAndroid, label: "Android", subtitle: "Android 9 / 11 / 12 (RK35xx)" },
} as const;
export type OSKey = keyof typeof OS_BACKGROUNDS;

export type Display32Slug = "hd32" | "hr32" | "hr32-android" | "gd32c" | "kd32b";

export interface SpecRow {
  label: string;
  value: string;
}

export interface SpecGroup {
  title: string;
  rows: SpecRow[];
}

export interface Display32 {
  slug: Display32Slug;
  modelCode: string;
  name: string;
  shortName: string;
  category: string;
  formFactor: "Monitor" | "All-in-One PC" | "Wall Kiosk" | "Floor Kiosk";
  tagline: string;
  description: string;
  highlights: { icon: string; title: string; subtitle?: string }[];
  features: string[];
  useCases: string[];
  /** Visual lifestyle scenarios with photo + short caption (4 scenes) */
  useCaseScenarios?: { image: string; title: string; description: string }[];
  gallery: string[];
  ioImage: string;
  installImages: string[];
  featureImages: string[];
  /** Optional mechanical/dimension drawings for "Dimensions" section */
  dimensionDrawings?: {
    image: string;
    title: string;
    caption: string;
    callouts?: { label: string; value: string }[];
  }[];
  osSupport: OSKey[];
  /** Optional CPU configurations available for AIO models */
  cpuOptions?: {
    tier: "Entry" | "Mid" | "High";
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    targetUseCase: string;
  }[];
  /** Optional configuration variants — สำหรับรุ่นเดียวกันที่เลือก OS/Hardware ได้หลายแบบ
   *  เช่น HR32: Touch-only Monitor / Windows PC / Android PC */
  variants?: {
    key: string;                 // unique slug e.g. "monitor", "windows", "android"
    label: string;               // "Touch Monitor" / "Windows PC" / "Android PC"
    badge: string;               // short tag e.g. "เฉพาะจอสัมผัส"
    osBackground?: OSKey | "none"; // background image key
    icon: string;                // lucide icon name
    description: string;
    bestFor: string;             // 1-line use case
    highlights: string[];        // 3-4 short bullets
    cpu?: string;                // optional CPU note
    ram?: string;
    storage?: string;
    targetSlug?: Display32Slug;  // optional link to dedicated detail page
    accent: "neutral" | "primary" | "secondary"; // visual accent
  }[];
  datasheetUrl: string;
  dimensionUrl?: string;
  specs: SpecGroup[];
  ports: string[];
  // Quick facts for comparison table
  quick: {
    resolution: string;
    brightness: string;
    contrast: string;
    touch: string;
    os: string;
    formFactor: string;
    dimensionCm: string;
    weightKg: string;
    power: string;
    install: string;
  };
}

// ───────────────────────────────────────────────────────────
// HR32 Series — Configuration Variants (shared between hr32 / hr32-android)
// แนวคิด: หน้าจอ 32" ตัวเดียวกัน — เลือก Configuration ได้ 3 แบบ
// (Touch-only Monitor / Windows-Linux PC / Android PC)
// ───────────────────────────────────────────────────────────
const HR32_VARIANTS: Display32["variants"] = [
  {
    key: "monitor",
    label: "HR32 — Touch Monitor",
    badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
    osBackground: "none",
    icon: "Monitor",
    description:
      "จอสัมผัส 32\" ล้วน ๆ — ต่อกับ External PC, Mini PC หรือ Media Player ผ่าน HDMI/DVI/VGA + USB Touch ใช้กับระบบ POS, Signage หรือสายการผลิตที่มีคอมพิวเตอร์อยู่แล้ว",
    bestFor: "ลูกค้ามี PC/Mini PC อยู่แล้ว ต้องการเฉพาะจอสัมผัสคุณภาพสูง",
    highlights: [
      "ไม่มี PC ในตัว — ต้นทุนต่ำกว่า ปรับเปลี่ยน PC ภายนอกได้อิสระ",
      "Input: HDMI / DVI / VGA + USB Touch",
      "Plug-and-play กับ Windows / Linux / macOS",
      "Power Consumption ต่ำสุดในซีรีส์ < 60W",
    ],
    targetSlug: "hr32",
    accent: "neutral",
  },
  {
    key: "windows",
    label: "HR32 — Windows / Linux PC",
    badge: "All-in-One PC (x86)",
    osBackground: "windows",
    icon: "Cpu",
    description:
      "All-in-One PC พร้อม Intel x86 ภายใน เลือกติดตั้ง Windows 10/11 IoT หรือ Linux Ubuntu/Debian จากโรงงาน รองรับซอฟต์แวร์ POS / ERP / Signage Player แบบ Native ที่ลูกค้าใช้อยู่แล้ว",
    bestFor: "Enterprise / POS / Signage ที่ใช้ซอฟต์แวร์ Windows-based",
    highlights: [
      "Intel Celeron / Core i3 / Core i5 (เลือกได้)",
      "RAM 4–16GB DDR4 + SSD 128–512GB",
      "Pre-install Windows 10/11 IoT หรือ Linux",
      "RJ45 + Wi-Fi 802.11ac + Bluetooth",
    ],
    cpu: "Intel Celeron / Core i3 / i5",
    ram: "4–16GB DDR4",
    storage: "SSD 128–512GB",
    targetSlug: "hr32",
    accent: "primary",
  },
  {
    key: "android",
    label: "HR32 — Android PC",
    badge: "All-in-One PC (ARM)",
    osBackground: "android",
    icon: "Smartphone",
    description:
      "All-in-One PC พร้อม Rockchip ARM ภายใน เลือก Android 9/11/12 จากโรงงาน — ประหยัดพลังงาน ราคาคุ้มค่ากว่า x86 เหมาะกับ Digital Signage, Self-service Kiosk และ POS ที่ใช้ App แบบ Android",
    bestFor: "Digital Signage / Self-service Kiosk ที่ใช้ Android App",
    highlights: [
      "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
      "RAM 2–8GB + eMMC 16–128GB",
      "Pre-install Android 9 / 11 / 12",
      "Wi-Fi 802.11ac + Ethernet — เปิด 24/7 ประหยัดไฟ",
    ],
    cpu: "Rockchip RK3568 / 3288 / 3588",
    ram: "2–8GB LPDDR4",
    storage: "eMMC 16–128GB",
    targetSlug: "hr32-android",
    accent: "secondary",
  },
];

// ───────────────────────────────────────────────────────────
// HD32 Series — Configuration Variants (Windows/Linux x86 vs Android ARM)
// ตัวเครื่อง 13mm bezel เหมือนกัน — ต่างที่ภายใน CPU + OS
// ───────────────────────────────────────────────────────────
const HD32_VARIANTS: Display32["variants"] = [
  {
    key: "x86",
    label: "HD32 — Windows / Linux PC",
    badge: "All-in-One PC (x86)",
    osBackground: "windows",
    icon: "Cpu",
    description:
      "All-in-One PC พร้อม Intel x86 ภายใน เลือก CPU ได้ 3 ระดับ — Celeron J6412 (Entry), Core i5-8th (Mid), Core i7-10th (High Performance) ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน รองรับซอฟต์แวร์ POS/ERP/Industrial HMI ที่ใช้กันทั่วไป",
    bestFor: "Enterprise / Industrial HMI / ระบบที่ใช้ซอฟต์แวร์ Windows-based",
    highlights: [
      "Intel Celeron J6412 / Core i5-8th / Core i7-10th (เลือกได้)",
      "RAM DDR4 4–16GB + SSD 128–512GB",
      "Pre-install Windows 10/11 หรือ Linux",
      "RJ45 + Wi-Fi 802.11ac + พอร์ตครบ HDMI/VGA/USB×4",
    ],
    cpu: "Intel Celeron / i5 / i7",
    ram: "4–16GB DDR4",
    storage: "SSD 128–512GB",
    accent: "primary",
  },
  // (HD32 มีหน้ารายละเอียดเดียว — ไม่ต้องตั้ง targetSlug ของ variant นี้)
  {
    key: "android",
    label: "HD32 — Android PC",
    badge: "All-in-One PC (ARM)",
    osBackground: "android",
    icon: "Smartphone",
    description:
      "All-in-One PC พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 / RK3288 / RK3588 ติดตั้ง Android 9/11/12 จากโรงงาน รองรับ Square / Stripe / Clover / Shopify POS พร้อม 5GHz Wi-Fi + BLE 5.0 ประหยัดพลังงานกว่า x86 (≤115W) เหมาะกับ Self-service Kiosk และ POS Android-based",
    bestFor: "Square POS / Self-service Kiosk / Digital Signage ที่ใช้ Android App",
    highlights: [
      "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
      "RAM 2–8GB + eMMC 16–128GB",
      "Pre-install Android 9 / 11 / 12",
      "5GHz Wi-Fi + BLE 5.0 — รองรับ Square POS โดยตรง",
    ],
    cpu: "Rockchip RK3568 / 3288 / 3588",
    ram: "2–8GB LPDDR4",
    storage: "eMMC 16–128GB",
    accent: "secondary",
  },
];

// ───────────────────────────────────────────────────────────
// KD32B Series — Floor Stand Kiosk Configuration Variants
// ตู้ตั้งพื้นโครงสร้างเดียวกัน — เลือก Configuration ได้ 3 แบบ
// (Monitor only / Windows-Linux PC / Android PC)
// ───────────────────────────────────────────────────────────
const KD32B_VARIANTS: Display32["variants"] = [
  {
    key: "monitor",
    label: "KD32B — Monitor Kiosk",
    badge: "ตู้คีออสก์ (ไม่มี PC ในตัว)",
    osBackground: "none",
    icon: "Monitor",
    description:
      "ตู้คีออสก์ตั้งพื้น 32\" เฉพาะจอสัมผัส — ต่อกับ External PC, Mini PC หรือ Media Player ที่มีอยู่ผ่าน HDMI + USB Touch ใต้จอมีช่องสำหรับ Printer / Scanner / NFC ที่เปลี่ยนหน้ากากปรับแต่งได้",
    bestFor: "ลูกค้ามี PC อยู่แล้ว ต้องการเฉพาะตู้คีออสก์ + จอสัมผัส",
    highlights: [
      "ไม่มี PC ในตัว — ต้นทุนต่ำกว่า เปลี่ยน PC ภายนอกได้อิสระ",
      "Input: HDMI + USB Touch (Plug-and-play)",
      "ใช้กับ Windows / Linux / macOS / Android Box",
      "Power Consumption ต่ำสุด < 60W",
    ],
    accent: "neutral",
  },
  {
    key: "x86",
    label: "KD32B — Windows / Linux PC",
    badge: "Floor Kiosk + AIO PC (x86)",
    osBackground: "windows",
    icon: "Cpu",
    description:
      "ตู้คีออสก์ตั้งพื้น 32\" พร้อม Intel x86 PC ภายใน เลือก Windows 10/11 IoT หรือ Linux จากโรงงาน รองรับซอฟต์แวร์ POS / ERP / Industrial HMI ที่ลูกค้าใช้อยู่ ไม่ต้องต่อ PC ภายนอก",
    bestFor: "Self-service Banking / POS / ระบบที่ใช้ซอฟต์แวร์ Windows-based",
    highlights: [
      "Intel Celeron / Core i3 / Core i5 (เลือกได้)",
      "RAM 4–16GB DDR4 + SSD 128–512GB",
      "Pre-install Windows 10/11 IoT หรือ Linux",
      "RJ45 + Wi-Fi 802.11ac + Bluetooth ภายในตู้",
    ],
    cpu: "Intel Celeron / Core i3 / i5",
    ram: "4–16GB DDR4",
    storage: "SSD 128–512GB",
    accent: "primary",
  },
  {
    key: "android",
    label: "KD32B — Android PC",
    badge: "Floor Kiosk + AIO PC (ARM)",
    osBackground: "android",
    icon: "Smartphone",
    description:
      "ตู้คีออสก์ตั้งพื้น 32\" พร้อม Rockchip ARM PC ภายใน เลือก Android 9/11/12 จากโรงงาน — ประหยัดพลังงานกว่า x86 (≤115W) เหมาะกับ Digital Signage, Self-service Kiosk และระบบ Wayfinding ที่ใช้ App แบบ Android",
    bestFor: "Wayfinding / Digital Signage / Self-service Kiosk ที่ใช้ Android App",
    highlights: [
      "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
      "RAM 2–8GB + eMMC 16–128GB",
      "Pre-install Android 9 / 11 / 12",
      "5GHz Wi-Fi + BLE 5.0 — รองรับ POS Android โดยตรง",
    ],
    cpu: "Rockchip RK3568 / 3288 / 3588",
    ram: "2–8GB LPDDR4",
    storage: "eMMC 16–128GB",
    accent: "secondary",
  },
];

export const DISPLAYS_32: Record<Display32Slug, Display32> = {
  hd32: {
    slug: "hd32",
    modelCode: "HD32",
    name: '32" HD32 Series — All-in-One Touch PC (Windows / Linux / Android)',
    shortName: "HD32 Series",
    category: "Configurable 32\" All-in-One Touch PC",
    formFactor: "All-in-One PC",
    tagline: "All-in-One Touch PC จอ 32\" — เลือก OS และ CPU ได้ Windows/Linux (x86) หรือ Android (ARM)",
    description:
      "HD32 คือซีรีส์ All-in-One Touch PC จอสัมผัส 32 นิ้ว ขอบจอบาง 13mm ตัวเครื่องเดียวกัน — เลือก Configuration ได้ 2 แบบ: (1) Windows/Linux PC พร้อม Intel x86 (Celeron J6412 / Core i5-8th / Core i7-10th) หรือ (2) Android PC พร้อม Rockchip ARM (RK3568 / RK3288 / RK3588) ติดตั้ง OS จากโรงงาน รองรับการติดตั้งแบบแขวนผนัง วางตั้งโต๊ะ และฝังเฟอร์นิเจอร์ — เหมาะสำหรับ POS Self-service, Square POS, Kiosk องค์กร, ระบบ Queue และห้องประชุม",
    highlights: [
      { icon: "Layers", title: "เลือก OS ได้ 2 แบบ", subtitle: "Windows/Linux หรือ Android" },
      { icon: "Cpu", title: "เลือก CPU ได้หลายระดับ", subtitle: "Intel x86 หรือ Rockchip ARM" },
      { icon: "Maximize", title: "ขอบจอบาง 13mm", subtitle: "Ultra-small Bezel" },
      { icon: "ShieldCheck", title: "ทำงาน 24/7", subtitle: "Industrial Grade" },
    ],
    features: [
      "Intel x86 PC ภายในตัวเครื่อง — เลือก Celeron / i5 / i7",
      "ติดตั้ง Windows 10 / 11 หรือ Linux จากโรงงาน",
      "RAM DDR4 4-16GB + mSATA SSD 128-512GB",
      "Industrial-grade Power Supply ทำงานต่อเนื่อง 24/7",
      "LCD อายุการใช้งานยาว 30,000 ชั่วโมง",
      "ติดตั้งแบบแขวนผนัง / ตั้งโต๊ะ / ฝังเฟอร์นิเจอร์",
      "ผิวหน้าจอกันน้ำ IP65 + Mohs class 7 explosion-proof glass",
    ],
    useCases: ["POS Self-service", "Kiosk องค์กร", "ระบบ Queue / Check-in", "ห้องประชุม"],
    useCaseScenarios: [
      { image: hd32UcRetail,  title: "ร้านค้าปลีก / Boutique", description: "วางบนเคาน์เตอร์ POS ช่วยลูกค้าเลือกสินค้า ค้นหาสต็อก และชำระเงินแบบ self-service ขอบจอบางช่วยให้ดูพรีเมียมเข้ากับร้านดีไซน์โมเดิร์น" },
      { image: hd32UcHotel,   title: "โรงแรม & รีสอร์ท",       description: "เคาน์เตอร์ Check-in/out อัตโนมัติ ลดคิวที่ Front desk รองรับการพิมพ์ใบเสร็จและสแกนเอกสารเชื่อมต่อผ่าน USB/COM ได้ทันที" },
      { image: hd32UcOffice,  title: "ห้องประชุม / สำนักงาน",  description: "จอ Touch สำหรับการนำเสนอ ระดมสมอง และจดบันทึกร่วมกัน FHD 1920×1080 พร้อม HDMI/VGA เชื่อม Notebook ได้หลากหลาย" },
      { image: hd32UcPos,     title: "POS Self-service",       description: "เครื่องสั่งอาหารด้วยตนเองสำหรับร้านอาหาร/QSR ลดภาระพนักงานและเพิ่มยอด upsell ผ่านเมนูภาพชัดบนหน้าจอ Touch ตอบสนองไว" },
    ],
    // Gallery: ย้ายรูป mechanical drawing (gallery-06, gallery-07) ออกไปไว้ section "Dimensions"
    gallery: [
      hd32HeroClean,
      hd32Gallery02Clean,
      ...["gallery-03.jpg","gallery-04.jpg",
      "gallery-05.jpg","gallery-08.jpg","gallery-09.webp"].map(n => IMG("hd32", n)),
    ],
    ioImage: IMG("hd32", "io-01.png"),
    installImages: [hd32Install01Clean, hd32Install02Clean, hd32Install03Clean],
    featureImages: [],
    dimensionDrawings: [
      {
        image: hd32DimBack1,
        title: "ด้านหลัง — โครงสร้าง VESA Mount",
        caption: "แบบทางวิศวกรรมด้านหลังของ HD32 แสดงรูยึด VESA mount มาตรฐาน 200 × 200 mm พร้อมสกรู 4-M8 สำหรับยึดกับ Wall Bracket หรือขาตั้งจอแบบ Industrial — ระยะจุดยึดวัดจากขอบบน 118.1 mm และจากขอบข้าง 270.7 mm สะดวกต่อการเดินสายและการระบายอากาศโดยรอบ",
        callouts: [
          { label: "ขนาดตัวเครื่อง (W × H)", value: "730.4 × 425.2 mm" },
          { label: "VESA Mount", value: "200 × 200 mm" },
          { label: "สกรูยึด", value: "4 × M8" },
          { label: "ระยะจุดยึดถึงขอบบน", value: "118.1 mm" },
        ],
      },
      {
        image: hd32DimMultiview,
        title: "มุมมองรอบตัวเครื่อง — Top / Front / Side / Bottom",
        caption: "แบบทางวิศวกรรมแสดงสัดส่วนรอบตัวเครื่อง HD32 — ขอบจอบาง 20.61 mm, ความหนาตัวเครื่อง 51.9 mm, พื้นที่แสดงผล 700.19 × 394.99 mm (32\" diagonal) พร้อมตำแหน่งช่อง I/O ด้านบน และช่องระบายอากาศด้านล่าง 140.7 / 60.3 mm — เหมาะสำหรับการออกแบบช่องฝัง/ตู้ Embed",
        callouts: [
          { label: "ความกว้างตัวเครื่อง", value: "741.4 mm" },
          { label: "ขอบจอ (Bezel)", value: "20.61 mm" },
          { label: "ความหนา (max)", value: "51.9 mm" },
          { label: "พื้นที่แสดงผล", value: "700.19 × 394.99 mm (32\")" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: HD32_VARIANTS,
    cpuOptions: [
      {
        tier: "Entry",
        cpu: "Intel Celeron® J6412 (4-core, Elkhart Lake)",
        gpu: "Intel® UHD Graphics",
        ram: "DDR4-2666 SODIMM 4GB",
        storage: "mSATA SSD 128GB",
        targetUseCase: "POS, Digital Signage, Self-service Kiosk งานทั่วไป",
      },
      {
        tier: "Mid",
        cpu: "Intel® Core™ i5-8th Gen",
        gpu: "Intel® Iris® Plus Graphics 645",
        ram: "DDR4-2666 SODIMM 8GB",
        storage: "mSATA SSD 256GB",
        targetUseCase: "ระบบ Queue / Check-in, Conference, ERP / CRM Front-end",
      },
      {
        tier: "High",
        cpu: "Intel® Core™ i7-10th Gen",
        gpu: "Intel® UHD Graphics",
        ram: "DDR4-2666 SODIMM 16GB",
        storage: "mSATA SSD 512GB",
        targetUseCase: "Industrial HMI, AI / Vision, Multi-tasking, Workstation",
      },
    ],
    datasheetUrl: "/datasheets/ENT-Datasheet-HD32.pdf",
    dimensionUrl: "/datasheets/ENT-Dimension-HD32.pdf",
    ports: ["RJ45 × 1", "USB × 4", "VGA × 1", "HDMI out × 1", "Audio in/out × 1", "Power Socket × 1"],
    specs: [
      { title: "PC System (Windows / Linux)", rows: [
        { label: "CPU (เลือกได้)", value: "Celeron J6412 / Core i5-8th / Core i7-10th" },
        { label: "Graphic GPU", value: "Intel UHD / Iris Plus 645 / UHD" },
        { label: "หน่วยความจำ (RAM)", value: "DDR4-2666 SODIMM 4 / 8 / 16 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "mSATA SSD 128 / 256 / 512 GB" },
        { label: "เครือข่าย", value: "10/100/1000M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "Audio", value: "HD Audio: ALC269" },
        { label: "OS ที่ติดตั้งให้", value: "Windows 10 / 11 / Linux (เลือกได้)" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "32 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "700.19 × 394.99 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "250 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "1200 : 1" },
        { label: "มุมมอง H/V", value: "178° / 178°" },
        { label: "อายุ Backlight", value: "LED 30,000 ชม." },
        { label: "Refresh Rate", value: "60 Hz" },
      ]},
      { title: "Touch Panel", rows: [
        { label: "เทคโนโลยี", value: "PCAP (Capacitive)" },
        { label: "เวลาตอบสนอง", value: "< 5ms" },
        { label: "จำนวนจุดสัมผัส", value: "10 จุด standard" },
        { label: "ความแม่นยำ", value: "4096 × 4096" },
        { label: "Scanning Frequency", value: "200 Hz" },
        { label: "ผิวหน้า", value: "Mohs class 7 explosion-proof glass" },
      ]},
      { title: "Environment & Power", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "ความชื้น", value: "0% - 90%" },
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Standby Power", value: "≤ 0.5W" },
        { label: "Overall Power", value: "< 140W" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง", value: "74.14 × 43.62 × 5.19 cm" },
        { label: "ขนาดกล่อง", value: "85 × 55 × 14 cm" },
        { label: "น้ำหนักสุทธิ", value: "11.3 kg" },
        { label: "น้ำหนักรวม", value: "16.7 kg" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 FHD",
      brightness: "250 cd/m²",
      contrast: "1200:1",
      touch: "PCAP 10pt",
      os: "Windows / Linux / Android (เลือกได้)",
      formFactor: "All-in-One PC",
      dimensionCm: "74.1 × 43.6 × 5.2",
      weightKg: "11.3",
      power: "< 140W",
      install: "Wall / Desk / Embed",
    },
  },
  hr32: {
    slug: "hr32",
    modelCode: "HR32",
    name: '32" HR32 Series — Touch Monitor / Windows PC / Android PC',
    shortName: "HR32 Series",
    category: "Configurable 32\" Touch Display",
    formFactor: "Monitor",
    tagline: "หน้าจอ 32\" แบบเดียวกัน — เลือก Configuration ได้ 3 แบบ: Touch-only / Windows / Android",
    description:
      "HR32 คือซีรีส์จอสัมผัส 32 นิ้ว ตัวเครื่อง Unibody อลูมิเนียมเลเซอร์คัตที่แชร์โครงสร้างเดียวกันทั้ง 3 รุ่น — สามารถเลือกได้ว่าจะเป็น (1) Touch Monitor เฉพาะจอสัมผัสที่ต่อกับ PC ภายนอก, (2) Windows/Linux PC แบบ All-in-One หรือ (3) Android PC แบบ All-in-One — โดยขนาดภายนอก, ระบบสัมผัส PCAP 10 จุด, ความสว่าง 300 nit และโครงสร้าง Vandal-Proof จะเหมือนกันทุกรุ่น ต่างกันที่ภายในเท่านั้น เหมือนการเลือกสเปก PC",
    highlights: [
      { icon: "Award", title: "4K-Ready Display", subtitle: "FHD พร้อมขยาย" },
      { icon: "Maximize", title: "Ultra-Slim Unibody", subtitle: "อลูมิเนียมเสริมเหล็ก" },
      { icon: "Hand", title: "Touch + Display Integrated", subtitle: "ระบบรวมเป็นชิ้นเดียว" },
      { icon: "ShieldCheck", title: "Vandal-Proof", subtitle: "ทนทานต่อการทุบทำลาย" },
    ],
    features: [
      "Industrial-grade Power Supply",
      "LCD อายุการใช้งาน 30,000 ชั่วโมง",
      "ติดตั้งแบบแขวนผนัง / ขาตั้ง Floor Stand",
      "ผิวหน้าจอ IP65 กันน้ำ",
      "โครงสร้าง Aluminum + Sheet Metal",
      "เคลือบกันรอย กันสนิม",
    ],
    useCases: ["พื้นที่สาธารณะ", "สถานีบริการตนเอง", "Education", "ห้างสรรพสินค้า"],
    useCaseScenarios: [
      { image: hr32UcAirport,   title: "สนามบิน / สถานีขนส่ง",  description: "จอความสว่างสูง อ่านง่ายแม้แสงแดดส่อง รองรับ Public Touch ใช้งานหนัก เหมาะกับจุดข้อมูลและเช็คเที่ยวบินแบบ 24/7" },
      { image: hr32UcHospital,  title: "โรงพยาบาล / คลินิก",    description: "ตู้รับบัตรคิวและลงทะเบียนผู้ป่วย ลดการสัมผัสกับเจ้าหน้าที่ Touch ทนน้ำกระเซ็นและเช็ดทำความสะอาดด้วยน้ำยาฆ่าเชื้อได้บ่อย" },
      { image: hr32UcEducation, title: "สถานศึกษา / ห้องสมุด", description: "สื่อการเรียนรู้แบบ Interactive สำหรับนักเรียน-นักศึกษา รองรับการสืบค้นหนังสือ ดูสื่อ Video และเล่นแอปพลิเคชันการศึกษาได้ลื่นไหล" },
      { image: hr32UcMall,      title: "ห้างสรรพสินค้า",        description: "ตู้แผนผังร้าน (Wayfinding) นำทางลูกค้าหาร้านค้าและโปรโมชั่น เพิ่มประสบการณ์ shopping ที่ทันสมัยและน่าจดจำ" },
    ],
    gallery: [hr32HeroClean, hr32Gallery02Clean, ...Array.from({length:5},(_,i)=>IMG("hr32",`gallery-0${i+3}.jpg`))],
    ioImage: IMG("hr32", "io-01.jpg"),
    installImages: [],
    featureImages: [],
    dimensionDrawings: [
      {
        image: hr32DimFront,
        title: "ด้านหน้า + ด้านข้าง",
        caption: "ขอบจอบางพิเศษ R6 ตัวเครื่องบางเพียง 28 mm — เหมาะกับงานติดตั้งฝังผนังหรือ Open Frame",
        callouts: [
          { label: "กว้าง × สูง (โครง)", value: "752 × 446 mm" },
          { label: "พื้นที่แสดงผล", value: "700 × 395 mm" },
          { label: "ความหนาขอบจอ", value: "26 mm" },
          { label: "ความหนาตัวเครื่อง", value: "28 mm (ขั้นต่ำ) / 72 mm (รวมการ์ด)" },
          { label: "มุมโค้งขอบ", value: "R6" },
        ],
      },
      {
        image: hr32DimBack,
        title: "ด้านหลัง — รูยึด VESA + ช่องระบายอากาศ",
        caption: "รองรับ VESA 400 × 200 พร้อมรูยึด M6 และรู Ø8 สำหรับขายึดเสริม ช่องระบายอากาศแนวนอน 2 แถว",
        callouts: [
          { label: "VESA Mounting", value: "400 × 200 mm" },
          { label: "รูเกลียวยึด", value: "4 × M6 (รับน้ำหนักหลัก)" },
          { label: "รูสำรอง", value: "6 × Ø8 (Bracket เสริม)" },
          { label: "ตำแหน่ง connector", value: "ด้านล่าง — ออกสาย 211 mm จากกลาง" },
          { label: "ระยะหลัง-รูยึด", value: "บน 109 / ล่าง 137 mm" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: HR32_VARIANTS,
    datasheetUrl: "/datasheets/ENT-Datasheet-HR32-Monitor.pdf",
    dimensionUrl: "/datasheets/ENT-Dimension-HR32-Monitor.pdf",
    ports: ["HDMI in × 1", "DVI × 1", "VGA × 1", "USB × 1", "Audio in/out × 1", "DC 12V × 1", "Power Socket × 1"],
    specs: [
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "32 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "700 × 395 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "300 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "1200 : 1" },
        { label: "มุมมอง H/V", value: "175° / 175°" },
        { label: "อายุ Backlight", value: "LED 30,000 ชม." },
      ]},
      { title: "Touch Panel", rows: [
        { label: "เทคโนโลยี", value: "PCAP (Capacitive)" },
        { label: "เวลาตอบสนอง", value: "< 5ms" },
        { label: "จำนวนจุดสัมผัส", value: "10 จุด" },
        { label: "ผิวหน้า", value: "Mohs class 7 glass" },
      ]},
      { title: "Environment & Power", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "ความชื้น", value: "10% - 80%" },
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 5A" },
        { label: "Power Consumption", value: "< 60W" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง", value: "75.2 × 44.6 × 6.0 cm" },
        { label: "ขนาดกล่อง", value: "85.5 × 55.2 × 14.5 cm" },
        { label: "น้ำหนักสุทธิ", value: "14.2 kg" },
        { label: "น้ำหนักรวม", value: "17.8 kg" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 FHD",
      brightness: "300 cd/m²",
      contrast: "1200:1",
      touch: "PCAP 10pt",
      os: "Touch-only / Windows / Android (เลือกได้)",
      formFactor: "Monitor (Unibody)",
      dimensionCm: "75.2 × 44.6 × 6.0",
      weightKg: "14.2",
      power: "< 60W",
      install: "Wall / Floor Stand",
    },
  },
  "hr32-android": {
    slug: "hr32-android",
    modelCode: "HR32-A",
    name: '32" Android Touch PC HR32',
    shortName: "HR32 Android PC",
    category: "ARM Touch Screen PC",
    formFactor: "All-in-One PC",
    tagline: "All-in-One Android PC 32\" — Touch + Display + Computer ในเครื่องเดียว",
    description:
      "All-in-One Android PC 32 นิ้ว มาพร้อม Rockchip RK3568/RK3288/RK3588 ให้เลือกตามงบ พร้อมระบบสัมผัส 10 จุด หน้าจอ FHD ความสว่าง 300 nit รองรับ Wi-Fi และ Ethernet เหมาะสำหรับ Digital Signage, Self-service, และระบบ POS",
    highlights: [
      { icon: "Cpu", title: "Rockchip RK3588", subtitle: "เลือกได้ 3 ระดับ CPU" },
      { icon: "MonitorSmartphone", title: "Android 9/11/12", subtitle: "OS หลายเวอร์ชัน" },
      { icon: "Maximize", title: "Unibody Design", subtitle: "อลูมิเนียมเสริมเหล็ก" },
      { icon: "ShieldCheck", title: "All-in-One", subtitle: "Touch + Display + PC" },
    ],
    features: [
      "All-in-One Touch + Display + Android PC",
      "เลือก CPU ได้: RK3568 / RK3288 / RK3588",
      "Memory 2-8GB, Storage 16-128GB eMMC",
      "Wi-Fi 802.11 a/b/g/n/ac + Ethernet",
      "ผิวหน้าจอ IP65 กันน้ำ",
      "LCD อายุการใช้งาน 30,000 ชั่วโมง",
    ],
    useCases: ["Digital Signage", "Self-service Kiosk", "POS System", "Smart Meeting Room"],
    useCaseScenarios: [
      { image: hr32aUcSignage,     title: "Digital Signage",       description: "ป้ายโฆษณาดิจิทัลหน้าร้าน เปิดใช้งานต่อเนื่อง 24/7 ผ่าน Android OS ในตัว ไม่ต้องต่อ PC แยก ประหยัดพื้นที่และค่าใช้จ่าย" },
      { image: hr32aUcSelfservice, title: "Self-service Kiosk",   description: "ตู้บริการตนเองสำหรับธนาคาร โรงพยาบาล หรือหน่วยงานราชการ Android เปิดเครื่องอัตโนมัติและรัน App แบบ Kiosk Mode ได้ทันที" },
      { image: hr32aUcPos,         title: "POS / Order Station",   description: "เครื่องรับออเดอร์สำหรับคาเฟ่และร้านอาหาร ใช้แอป POS บน Android ที่ลื่นไหล รองรับ Wi-Fi, Bluetooth, USB เชื่อมเครื่องพิมพ์ใบเสร็จและลิ้นชักเก็บเงิน" },
      { image: hr32aUcMeeting,     title: "Smart Meeting Room",   description: "แผงจองห้องประชุมหน้าประตู แสดงตารางจอง real-time จาก Google Calendar/Outlook ช่วยให้พนักงานบริหารห้องประชุมอย่างมีประสิทธิภาพ" },
    ],
    gallery: Array.from({length:7},(_,i)=>IMG("hr32-android",`gallery-0${i+1}.jpg`)),
    ioImage: IMG("hr32-android", "io-01.jpg"),
    installImages: [],
    featureImages: [],
    dimensionDrawings: [
      {
        image: hr32DimFront,
        title: "ด้านหน้า + ด้านข้าง",
        caption: "ขอบจอบางพิเศษ R6 ตัวเครื่องบางเพียง 28 mm — เหมาะกับงานติดตั้งฝังผนังหรือ Open Frame",
        callouts: [
          { label: "กว้าง × สูง (โครง)", value: "752 × 446 mm" },
          { label: "พื้นที่แสดงผล", value: "700 × 395 mm" },
          { label: "ความหนาขอบจอ", value: "26 mm" },
          { label: "ความหนาตัวเครื่อง", value: "28 mm (ขั้นต่ำ) / 72 mm (รวมการ์ด)" },
          { label: "มุมโค้งขอบ", value: "R6" },
        ],
      },
      {
        image: hr32DimBack,
        title: "ด้านหลัง — รูยึด VESA + ช่องระบายอากาศ",
        caption: "รองรับ VESA 400 × 200 พร้อมรูยึด M6 และรู Ø8 สำหรับขายึดเสริม ช่องระบายอากาศแนวนอน 2 แถว",
        callouts: [
          { label: "VESA Mounting", value: "400 × 200 mm" },
          { label: "รูเกลียวยึด", value: "4 × M6 (รับน้ำหนักหลัก)" },
          { label: "รูสำรอง", value: "6 × Ø8 (Bracket เสริม)" },
          { label: "ตำแหน่ง connector", value: "ด้านล่าง — ออกสาย 211 mm จากกลาง" },
          { label: "ระยะหลัง-รูยึด", value: "บน 109 / ล่าง 137 mm" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: HR32_VARIANTS,
    datasheetUrl: "/datasheets/ENT-Datasheet-HR32-ARM.pdf",
    dimensionUrl: "/datasheets/ENT-Dimension-HR32-ARM.pdf",
    ports: ["HDMI out × 1", "RJ45 × 1", "USB × 2", "Audio × 1", "TF/SD × 1", "Wi-Fi Antenna × 1", "DC 12V × 1", "Power Button × 1"],
    specs: [
      { title: "Android System (เลือก 1 ตัวเลือก)", rows: [
        { label: "ตัวเลือก 1 — CPU", value: "Rockchip RK3568 + Mali G52" },
        { label: "ตัวเลือก 1 — RAM/Storage/OS", value: "2GB (4GB opt) / 16GB (32GB opt) / Android 11" },
        { label: "ตัวเลือก 2 — CPU", value: "Rockchip RK3288 + Mali T864" },
        { label: "ตัวเลือก 2 — RAM/Storage/OS", value: "2GB / 16GB eMMC / Android 9" },
        { label: "ตัวเลือก 3 — CPU", value: "Rockchip RK3588 + Mali T864" },
        { label: "ตัวเลือก 3 — RAM/Storage/OS", value: "4GB (8GB opt) / 64-128GB / Android 12" },
        { label: "Network", value: "10/100M RJ45 + Wi-Fi 802.11 a/b/g/n/ac" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "32 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "พื้นที่แสดงผล", value: "700 × 395 mm" },
        { label: "ความสว่าง", value: "300 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "1200 : 1" },
        { label: "มุมมอง H/V", value: "175° / 175°" },
      ]},
      { title: "Touch Panel", rows: [
        { label: "เทคโนโลยี", value: "PCAP (Capacitive)" },
        { label: "เวลาตอบสนอง", value: "< 5ms" },
        { label: "จำนวนจุดสัมผัส", value: "10 จุด" },
      ]},
      { title: "Environment & Power", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 5A" },
        { label: "Power Consumption", value: "< 65W" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง", value: "75.2 × 44.6 × 6.0 cm" },
        { label: "น้ำหนักสุทธิ", value: "14.5 kg" },
        { label: "น้ำหนักรวม", value: "18.1 kg" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 FHD",
      brightness: "300 cd/m²",
      contrast: "1200:1",
      touch: "PCAP 10pt",
      os: "Android 9/11/12 (RK3568/3288/3588)",
      formFactor: "All-in-One PC",
      dimensionCm: "75.2 × 44.6 × 6.0",
      weightKg: "14.5",
      power: "< 65W",
      install: "Wall / Floor Stand",
    },
  },
  gd32c: {
    slug: "gd32c",
    modelCode: "GD32C",
    name: '32" Wall Mounting Touch Kiosk GD32C (ARM)',
    shortName: "GD32C Wall Kiosk",
    category: "Wall-mount Kiosk",
    formFactor: "Wall Kiosk",
    tagline: "Kiosk แขวนผนังแนวตั้ง 32 นิ้ว — รองรับ Android 11/12, Square POS",
    description:
      "ตู้คีออสก์ทัชสกรีน 32 นิ้ว แนวตั้ง สำหรับติดผนัง รองรับ Android 11/12 และ x86 มาพร้อม 5GHz Wi-Fi + BLE 5.0 รองรับ POS หลากระบบ Square / Stripe / Clover / Shopify ออกแบบขอบบาง 13mm",
    highlights: [
      { icon: "Maximize", title: "ขอบจอบาง 13mm", subtitle: "iPad-like Design" },
      { icon: "Smartphone", title: "Android 11/12", subtitle: "POS Ready" },
      { icon: "Cpu", title: "RK3568 / RK3588", subtitle: "เลือกชิป CPU ได้" },
      { icon: "ShieldCheck", title: "24/7 Stable", subtitle: "ใช้งานต่อเนื่อง" },
    ],
    features: [
      "Industrial-grade Power Supply",
      "LCD อายุการใช้งาน 30,000 ชั่วโมง",
      "รองรับ Peripheral หลากหลาย (Printer, Scanner)",
      "เจาะรูยึดพื้นล่วงหน้า (Optional)",
      "5GHz Wi-Fi + BLE 5.0",
      "รองรับ Square / Stripe / Clover / Shopify POS",
    ],
    useCases: ["ร้านค้าปลีก / POS", "ธนาคาร / สาขา", "Self-service Kiosk", "พิพิธภัณฑ์ / นิทรรศการ"],
    useCaseScenarios: [
      { image: gd32cUcRetail, title: "ร้านค้าปลีก / Brand Store", description: "ตู้แค็ตตาล็อกสินค้าติดผนัง ให้ลูกค้าค้นหารุ่น/สี/ขนาดที่ต้องการ ไม่ต้องรบกวนพนักงาน เพิ่มความเป็นมืออาชีพให้ Brand" },
      { image: gd32cUcBank,   title: "ธนาคาร / จุดให้บริการ",     description: "ตู้บัตรคิวและลงทะเบียนติดผนัง ประหยัดพื้นที่สาขา รองรับการแสดงผลแนวตั้งที่อ่านง่าย ลดเวลารอของลูกค้า" },
      { image: gd32cUcHotel,  title: "โรงแรม / Self Check-in",    description: "ติดข้างประตู Lobby สำหรับ Check-in อัตโนมัติ 24/7 รองรับการสแกน Passport/QR และพิมพ์ Key Card เชื่อมต่อ PMS ของโรงแรม" },
      { image: gd32cUcMuseum, title: "พิพิธภัณฑ์ / นิทรรศการ",    description: "ติดข้างผลงานศิลปะ แสดงข้อมูลภัณฑ์แบบ Interactive รองรับ Multi-language Touch Multi-touch ให้ผู้ชมโต้ตอบกับเนื้อหาได้ลึกซึ้ง" },
    ],
    // Gallery: เอารูป dimension drawings (เดิม gallery-06, 07) ออก ย้ายไป section "Dimensions"
    gallery: ["gallery-01.jpg","gallery-02.jpg","gallery-03.jpg","gallery-04.jpg","gallery-05.jpg","gallery-08.jpg"].map(n => IMG("gd32c", n)),
    ioImage: IMG("gd32c", "io-01.png"),
    installImages: ["install-01.jpg","install-02.jpg","install-03.jpg"].map(n => IMG("gd32c", n)),
    featureImages: [],
    dimensionDrawings: [
      {
        image: gd32cDimFront,
        title: "ด้านหน้า / ด้านข้าง / บน-ล่าง",
        caption: "แบบมาตรฐานทางวิศวกรรมของตู้คีออสก์ติดผนัง GD32C — แสดงสัดส่วนตัวเครื่องโดยรวม พื้นที่จอแสดงผล (ทแยงมุม 32 นิ้ว) ตำแหน่งกล้อง/เซ็นเซอร์ด้านบน และช่องสำหรับเครื่องพิมพ์ใบเสร็จ + เครื่องสแกนบาร์โค้ด/QR ใต้จอ ใช้สำหรับวางผังการติดตั้ง การเดินสายไฟ และเจาะช่องผนัง",
        callouts: [
          { label: "กว้าง × สูง (ตัวเครื่อง)", value: "470 × 1101.3 mm" },
          { label: "พื้นที่แสดงผล (Active Area)", value: "393.3 × 698.7 mm (32\")" },
          { label: "ความหนา", value: "57.5 mm (min) / 97.1 mm (max)" },
          { label: "ฐานล่าง (ช่องระบายอากาศ)", value: "240.6 mm" },
        ],
      },
      {
        image: gd32cDimBack,
        title: "ด้านหลัง — ตำแหน่งยึดผนัง VESA",
        caption: "มุมมองด้านหลังแสดงรูยึด VESA mount มาตรฐาน 200 × 200 mm พร้อมสกรู 4-M8 สำหรับยึดกับ Wall Bracket — เหมาะกับการติดตั้งในห้างสรรพสินค้า ธนาคาร หรือจุด Self-service ที่ต้องการความมั่นคงสูง ด้านล่างมีช่องเดินสายไฟและขั้วต่อ AC แบบฝัง",
        callouts: [
          { label: "VESA Mount", value: "200 × 200 mm" },
          { label: "สกรูยึด", value: "4 × M8" },
          { label: "ระยะจุดยึดถึงขอบบน", value: "404 mm" },
          { label: "การระบายอากาศ", value: "ช่องระบายรอบตัวเครื่อง + ฐานล่าง" },
        ],
      },
    ],
    osSupport: ["android", "windows"],
    datasheetUrl: "/datasheets/ENT-Datasheet-GD32C.pdf",
    dimensionUrl: "/datasheets/ENT-Dimension-GD32C.pdf",
    ports: ["RJ45", "USB", "HDMI", "Wi-Fi Antenna × 1", "AC Power"],
    specs: [
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "32 นิ้ว (แนวตั้ง 9:16)" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "พื้นที่แสดงผล", value: "698.7 × 393.3 mm" },
        { label: "ความสว่าง", value: "≥ 250 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "1000 : 1" },
        { label: "มุมมอง H/V", value: "178° / 178°" },
      ]},
      { title: "Touch Panel", rows: [
        { label: "เทคโนโลยี", value: "PCAP (Capacitive)" },
        { label: "เวลาตอบสนอง", value: "< 5ms" },
        { label: "จำนวนจุดสัมผัส", value: "10 จุด" },
        { label: "ผิวหน้า", value: "Mohs class 7 glass" },
      ]},
      { title: "Environment & Power", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 4A" },
        { label: "Power Consumption", value: "Android < 36W, x86 < 48W" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง", value: "47 × 96.8 × 7.7 cm (W×H×T)" },
        { label: "ขนาดกล่อง", value: "62 × 111 × 23 cm" },
        { label: "น้ำหนักสุทธิ", value: "18 kg" },
        { label: "น้ำหนักรวม", value: "28 kg" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 (Portrait)",
      brightness: "≥ 250 cd/m²",
      contrast: "1000:1",
      touch: "PCAP 10pt",
      os: "Android 11/12 หรือ x86",
      formFactor: "Wall Kiosk",
      dimensionCm: "47 × 96.8 × 7.7",
      weightKg: "18",
      power: "< 48W",
      install: "Wall mount",
    },
  },
  kd32b: {
    slug: "kd32b",
    modelCode: "KD32B",
    name: '32" KD32B Series — Floor Stand Kiosk (Monitor / Windows / Android)',
    shortName: "KD32B Series",
    category: "Configurable 32\" Floor Stand Kiosk",
    formFactor: "Floor Kiosk",
    tagline: "ตู้คีออสก์ตั้งพื้น 32\" — เลือก Configuration ได้ 3 แบบ: Monitor / Windows / Android",
    description:
      "KD32B คือซีรีส์ตู้คีออสก์ตั้งพื้น 32 นิ้วที่ใช้โครงสร้างเดียวกันทั้ง 3 รุ่น — สามารถเลือกได้ว่าจะเป็น (1) Monitor Kiosk เฉพาะตู้+จอสัมผัสที่ต่อกับ PC ภายนอก, (2) Windows/Linux PC แบบ All-in-One หรือ (3) Android PC แบบ All-in-One — ทุกรุ่นมีหน้ากากด้านหน้าแบบเปลี่ยนได้ (Replaceable Front Panel) ปรับแต่งตามแบรนด์ เพิ่ม Printer, Scanner, Fingerprint, NFC ได้อย่างรวดเร็ว ตัวตู้เหล็กพ่นสีอบ ทนทานสำหรับใช้งาน 24/7",
    highlights: [
      { icon: "Layers", title: "เลือก Configuration ได้ 3 แบบ", subtitle: "Monitor / Windows / Android" },
      { icon: "Hand", title: "10-Point Touch", subtitle: "PCAP Capacitive" },
      { icon: "Box", title: "Replaceable Front Panel", subtitle: "เปลี่ยนหน้ากากตามแบรนด์" },
      { icon: "ShieldCheck", title: "24/7 Industrial-grade", subtitle: "เหล็กพ่นสีอบ ทนทาน" },
    ],
    features: [
      "หน้ากากด้านหน้าเปลี่ยนได้ (Replaceable Front Panel)",
      "ติดตั้ง Printer / Scanner / Fingerprint ได้",
      "หน้าจอเอียง 45° ตามหลัก Ergonomic",
      "ฝาหลังล็อคได้ (Lockable Rear Panel)",
      "เหล็กพ่นสีอบ ทนสนิม-การสึกหรอ",
      "อายุ LCD 30,000 ชั่วโมง",
    ],
    useCases: ["Retail / ร้านค้า", "Banking / ธนาคาร", "Logistics", "พื้นที่สาธารณะ"],
    useCaseScenarios: [
      { image: kd32bUcMall,      title: "ห้างสรรพสินค้า / Wayfinding", description: "ตู้ตั้งพื้นทรงสูงโดดเด่นกลางห้าง ช่วยลูกค้านำทางหาร้านค้า โปรโมชั่น และอีเวนต์ พร้อมโฆษณาในตัวเพื่อเพิ่มรายได้" },
      { image: kd32bUcBank,      title: "ธนาคาร / สถาบันการเงิน",     description: "ตู้บริการตนเองตั้งพื้นในสาขา เปิดบัญชี กดบัตรคิว สมัครสินเชื่อ ทำงานแบบ Stand-alone ไม่ต้องติดผนัง เคลื่อนย้ายปรับวางได้สะดวก" },
      { image: kd32bUcLogistics, title: "Logistics / Warehouse",        description: "จุด Check-in ของ Driver และพนักงานขนส่ง ติดตามพัสดุ พิมพ์ใบรับสินค้า โครงสร้างแข็งแรงทนการใช้งานในพื้นที่ industrial" },
      { image: kd32bUcTransit,   title: "สถานีรถไฟฟ้า / Transit Hub",   description: "ตู้แผนที่และซื้อตั๋วโดยสาร ตั้งกลางชานชาลา ลูกค้าเข้าถึงได้รอบทิศทาง รองรับการใช้งานหนักของผู้โดยสารจำนวนมาก" },
    ],
    // Gallery: ย้ายรูป mechanical drawing (gallery-07) ออกไปไว้ section "Dimensions"
    gallery: [
      kd32bHeroClean,
      kd32bGallery02Clean,
      ...["gallery-03.jpg","gallery-04.jpg","gallery-05.jpg","gallery-06.jpg","gallery-08.jpg"].map(n => IMG("kd32b", n)),
      IMG("kd32b","gallery-09.webp"),
    ],
    ioImage: "",
    installImages: [],
    featureImages: [],
    dimensionDrawings: [
      {
        image: kd32bDim1,
        title: "มุมมองรอบตัว — ด้านหน้า / ข้าง / บน-ล่าง",
        caption: "แบบทางวิศวกรรมของตู้คีออสก์ตั้งพื้น KD32B แสดงสัดส่วนรอบทิศทาง: หน้าจอ 32 นิ้ว แนวตั้งเอียงตามหลัก Ergonomic 15° + ฐานล่างถ่วงน้ำหนัก ป้องกันล้ม — เหมาะกับการวางในธนาคาร, สนามบิน, ห้างสรรพสินค้า ใต้จอมีพื้นที่สำหรับ Printer / Scanner / NFC ขนาด 276 × 114 mm",
        callouts: [
          { label: "ความสูงรวม", value: "1688.1 mm" },
          { label: "หน้ากว้างตู้", value: "470 mm" },
          { label: "ความลึกฐาน", value: "290.1 mm (ฐาน) / 124.5 mm (ตัวเครื่อง)" },
          { label: "ความสูงจุดสัมผัส", value: "960.4 mm (จากพื้นถึงกึ่งกลางจอ)" },
        ],
      },
      {
        image: kd32bDim2,
        title: "มุมมองรายละเอียด — มุมเอียงและจุดติดตั้งอุปกรณ์",
        caption: "ภาพขยายแสดงมุมเอียงจอ 15° จากแนวตั้ง พร้อมมุมฐาน 75°/95° ที่คำนวณให้สมดุลรับน้ำหนักได้ดี — ระบุตำแหน่งลำโพง (音响) และมือจับเคลื่อนย้าย (把手) สำหรับติดตั้งและบำรุงรักษา ออกแบบให้สามารถเปลี่ยนหน้ากากด้านหน้า (Replaceable Front Panel) ได้ตามอัตลักษณ์แบรนด์",
        callouts: [
          { label: "มุมเอียงจอ", value: "15° (Ergonomic)" },
          { label: "มุมฐานยึด", value: "75° / 95°" },
          { label: "ความสูงช่องอุปกรณ์", value: "789.3 mm" },
          { label: "ความหนาตัวเครื่อง (max)", value: "55.3 mm" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: KD32B_VARIANTS,
    datasheetUrl: "/datasheets/ENT-Datasheet-KD32B.pdf",
    dimensionUrl: "/datasheets/ENT-Dimension-KD32B.pdf",
    ports: [],
    specs: [
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "32 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (4K Optional)" },
        { label: "พื้นที่แสดงผล", value: "698.4 × 392.85 mm" },
        { label: "ความสว่าง", value: "300 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "1200 : 1" },
        { label: "มุมมอง H/V", value: "175° / 175°" },
      ]},
      { title: "Touch Panel", rows: [
        { label: "เทคโนโลยี", value: "PCAP (Capacitive)" },
        { label: "เวลาตอบสนอง", value: "< 5ms" },
        { label: "จำนวนจุดสัมผัส", value: "10 จุด" },
        { label: "ผิวหน้า", value: "Mohs class 7 glass" },
      ]},
      { title: "Environment & Power", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 4A" },
        { label: "Power Consumption", value: "Android < 115W, x86 < 140W" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง", value: "47 × 168.8 × 47.0 cm (W×H×D)" },
        { label: "ขนาดกล่อง", value: "50 × 190 × 56 cm" },
        { label: "น้ำหนักสุทธิ", value: "23.3 kg" },
        { label: "น้ำหนักรวม", value: "36 kg" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 (4K opt.)",
      brightness: "300 cd/m²",
      contrast: "1200:1",
      touch: "PCAP 10pt",
      os: "Monitor / Windows / Android (เลือกได้)",
      formFactor: "Floor Kiosk",
      dimensionCm: "47 × 168.8 × 47.0",
      weightKg: "23.3",
      power: "< 140W",
      install: "Floor Stand",
    },
  },
};

export const DISPLAY_32_ORDER: Display32Slug[] = ["hd32", "hr32", "hr32-android", "gd32c", "kd32b"];

export const getDisplay32 = (slug: string): Display32 | undefined =>
  (DISPLAYS_32 as Record<string, Display32>)[slug];

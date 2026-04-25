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
  datasheetUrl: string;
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

export const DISPLAYS_32: Record<Display32Slug, Display32> = {
  hd32: {
    slug: "hd32",
    modelCode: "HD32",
    name: '32" Touch Monitor HD32',
    shortName: "HD32 Monitor",
    category: "VESA Mount Touch Monitor",
    formFactor: "Monitor",
    tagline: "จอสัมผัส 32 นิ้ว ขอบบาง 13mm — ออกแบบเรียบหรู ติดตั้งได้หลากหลาย",
    description:
      "จอสัมผัส Capacitive 10 จุด พร้อมพาแนล LCD อายุการใช้งาน 30,000 ชั่วโมง ขอบจอบางพิเศษ 13mm ออกแบบสไตล์ iPad รองรับการติดตั้งทั้งแบบแขวนผนัง วางตั้งโต๊ะ และฝังในเฟอร์นิเจอร์ เหมาะสำหรับร้านค้าปลีก โรงแรม และสำนักงาน",
    highlights: [
      { icon: "Maximize", title: "ขอบจอบาง 13mm", subtitle: "Ultra-small Bezel" },
      { icon: "Smartphone", title: "รองรับ Square POS", subtitle: "POS Compatibility" },
      { icon: "Layers", title: "ติดตั้งหลากหลาย", subtitle: "Wall / Desk / Embed" },
      { icon: "ShieldCheck", title: "ทำงาน 24/7", subtitle: "Industrial Grade" },
    ],
    features: [
      "Industrial-grade Power Supply",
      "LCD อายุการใช้งานยาว 30,000 ชั่วโมง",
      "ติดตั้งแบบแขวนผนัง / ตั้งโต๊ะ / ฝังเฟอร์นิเจอร์",
      "ผิวหน้าจอกันน้ำ IP65",
      "ทดสอบการทำงานต่อเนื่อง 24/7",
    ],
    useCases: ["Retail / ร้านค้าปลีก", "โรงแรม & ที่พัก", "สำนักงาน", "POS Self-service"],
    gallery: [
      hd32HeroClean,
      hd32Gallery02Clean,
      ...["gallery-03.jpg","gallery-04.jpg",
      "gallery-05.jpg","gallery-06.jpg","gallery-07.jpg","gallery-08.jpg","gallery-09.webp"].map(n => IMG("hd32", n)),
    ],
    ioImage: IMG("hd32", "io-01.png"),
    installImages: [hd32Install01Clean, hd32Install02Clean, hd32Install03Clean],
    featureImages: [],
    osSupport: [],
    datasheetUrl: PDF("HD32-Datasheet.pdf"),
    ports: ["HDMI in × 1", "USB × 1", "VGA × 1", "Audio in/out × 1", "Power Socket × 1"],
    specs: [
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
        { label: "จำนวนจุดสัมผัส", value: "10 จุด" },
        { label: "ความแม่นยำ", value: "4096 × 4096" },
        { label: "ผิวหน้า", value: "Mohs class 7 explosion-proof glass" },
      ]},
      { title: "Environment & Power", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "ความชื้น", value: "0% - 90%" },
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Consumption", value: "< 110W" },
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
      os: "—",
      formFactor: "Monitor",
      dimensionCm: "74.1 × 43.6 × 5.2",
      weightKg: "11.3",
      power: "< 110W",
      install: "Wall / Desk / Embed",
    },
  },
  hr32: {
    slug: "hr32",
    modelCode: "HR32",
    name: '32" Touch Monitor HR32',
    shortName: "HR32 Monitor",
    category: "VESA Mount Touch Monitor",
    formFactor: "Monitor",
    tagline: "Unibody Aluminum Design — โครงสร้างเหล็ก/อลูมิเนียม ทนทานแบบ Vandal-Proof",
    description:
      "จอสัมผัส 32 นิ้ว ตัวเครื่อง Unibody อลูมิเนียมตัดด้วยเลเซอร์ ทนทาน กันการทุบทำลาย รองรับ PCAP 10 จุด ตอบสนอง <5ms อ่านง่ายแม้แสงแดดส่อง เหมาะสำหรับสถานที่สาธารณะที่ใช้งานหนัก",
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
    osSupport: [],
    datasheetUrl: PDF("HR32-Datasheet.pdf"),
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
      os: "—",
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
    gallery: Array.from({length:7},(_,i)=>IMG("hr32-android",`gallery-0${i+1}.jpg`)),
    ioImage: IMG("hr32-android", "io-01.jpg"),
    installImages: [],
    featureImages: [],
    osSupport: ["android"],
    datasheetUrl: PDF("HR32-ANDROID-Datasheet.pdf"),
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
    gallery: Array.from({length:8},(_,i)=>IMG("gd32c",`gallery-0${i+1}.jpg`)),
    ioImage: IMG("gd32c", "io-01.png"),
    installImages: ["install-01.jpg","install-02.jpg","install-03.jpg"].map(n => IMG("gd32c", n)),
    featureImages: [],
    osSupport: ["android", "windows"],
    datasheetUrl: PDF("GD32C-Datasheet.pdf"),
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
    name: '32" Floor Stand Touch Kiosk KD32B',
    shortName: "KD32B Floor Kiosk",
    category: "Floor-standing Kiosk",
    formFactor: "Floor Kiosk",
    tagline: "ตู้คีออสก์ตั้งพื้น 32 นิ้ว — เปลี่ยนหน้ากากได้ ปรับแต่งตามธุรกิจ",
    description:
      "ตู้คีออสก์ตั้งพื้น 32 นิ้ว พร้อมหน้ากากด้านหน้าแบบเปลี่ยนได้ (Replaceable Front Panel) ปรับแต่งตามการใช้งาน เพิ่ม Printer, Scanner, Fingerprint ได้อย่างรวดเร็ว ตัวเครื่องเหล็กพ่นสีอบ ทนทานสำหรับใช้งาน 24/7",
    highlights: [
      { icon: "Hand", title: "10-Point Touch", subtitle: "PCAP Capacitive" },
      { icon: "Box", title: "One-piece Streamlined", subtitle: "ดีไซน์ชิ้นเดียวเรียบ" },
      { icon: "Award", title: "ATEX-certified", subtitle: "มาตรฐานความปลอดภัย" },
      { icon: "ShieldCheck", title: "Plug-and-play", subtitle: "ติดตั้งง่าย" },
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
    gallery: [kd32bHeroClean, kd32bGallery02Clean, ...Array.from({length:6},(_,i)=>IMG("kd32b",`gallery-0${i+3}.jpg`)), IMG("kd32b","gallery-09.webp")],
    ioImage: IMG("kd32b", "io-01.jpg"),
    installImages: [],
    featureImages: [],
    osSupport: ["android", "windows", "linux"],
    datasheetUrl: PDF("KD32B-Datasheet.pdf"),
    ports: ["RJ45 × 1", "USB 2.0 × 2", "Power Socket × 1"],
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
      os: "Android หรือ x86",
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

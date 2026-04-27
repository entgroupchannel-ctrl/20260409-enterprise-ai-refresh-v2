/**
 * Touch Display 21.5" Series — KD215B Floor Kiosk + GD215C Wall Mount Kiosk
 * แหล่งสเปก: touchwo.com
 *  - KD215B Monitor: https://touchwo.com/product/21-5-monitor-floor-stand-touch-kiosk-kd215b-2/
 *  - KD215B X86:     https://touchwo.com/product/21-5-monitor-floor-stand-touch-kiosk-kd215b/
 *  - KD215B Android: https://touchwo.com/product/21-5-android-floor-stand-touch-kiosk-kd215b/
 *  - GD215C Wall:    https://touchwo.com/product/21-5-wall-mounting-touch-kiosk-gd215c/
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";
import {
  KIOSK_PERIPHERALS,
  KIOSK_CUSTOMIZATION_OPTIONS,
  KIOSK_CUSTOMIZATION_LEAD_TIME,
} from "./kiosk-peripherals";

// Gallery — KD215B Floor Stand Kiosk (7 รูปจาก touchwo + 2 รูปติดโลโก้ ENT)
import kd215g1 from "@/assets/touchwo/kd215b/KD215-1-branded.jpg";
import kd215g2 from "@/assets/touchwo/kd215b/KD215-2-branded.jpg";
import kd215g3 from "@/assets/touchwo/kd215b/KD215-3.jpg";
import kd215g4 from "@/assets/touchwo/kd215b/KD215-4.jpg";
import kd215g5 from "@/assets/touchwo/kd215b/KD215-5.jpg";
import kd215g6 from "@/assets/touchwo/kd215b/KD215-6.jpg";
import kd215g7 from "@/assets/touchwo/kd215b/KD215-7.jpg";

// Feature highlight illustrations
import kd215Feat5 from "@/assets/touchwo/kd215b/feat-5-1.png";
import kd215Feat6 from "@/assets/touchwo/kd215b/feat-6.png";
import kd215Feat7 from "@/assets/touchwo/kd215b/feat-7.png";

// Gallery — GD215C Wall-Mount Kiosk (8 รูปจาก touchwo)
import gd215g1 from "@/assets/touchwo/gd215c/GD215-1A.jpg";
import gd215g2 from "@/assets/touchwo/gd215c/GD215-2A.jpg";
import gd215g3 from "@/assets/touchwo/gd215c/GD215-3.jpg";
import gd215g4a from "@/assets/touchwo/gd215c/GD215-4-v2.jpg";
import gd215g4b from "@/assets/touchwo/gd215c/GD215-4-v3.jpg";
import gd215g5 from "@/assets/touchwo/gd215c/GD215-5.jpg";
import gd215g6 from "@/assets/touchwo/gd215c/GD215-6.jpg";
import gd215g7 from "@/assets/touchwo/gd215c/GD215-7.jpg";

// GD215C feature & install images
import gd215Install1 from "@/assets/touchwo/gd215c/install-1.jpg";
import gd215Install2 from "@/assets/touchwo/gd215c/install-2.jpg";
import gd215Install3 from "@/assets/touchwo/gd215c/install-3.jpg";
import gd215Panel1 from "@/assets/touchwo/gd215c/panel-1.jpg";
import gd215Panel2 from "@/assets/touchwo/gd215c/panel-2.jpg";

// Use case scenarios — ใช้ภาพ Floor Kiosk จากซีรีส์ KD32B
import ucMall from "@/assets/touchwo/usecases/kd32b-uc-mall.jpg";
import ucBank from "@/assets/touchwo/usecases/kd32b-uc-bank.jpg";
import ucLogistics from "@/assets/touchwo/usecases/kd32b-uc-logistics.jpg";
import ucTransit from "@/assets/touchwo/usecases/kd32b-uc-transit.jpg";

export type Display215Slug = "kd215b" | "gd215c";

export { OS_BACKGROUNDS };
export type { OSKey };

const KD215B_SHARED_PANEL = [
  { title: "LCD Panel", rows: [
    { label: "ขนาดหน้าจอ", value: "21.5 นิ้ว" },
    { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
    { label: "อัตราส่วนภาพ", value: "16 : 9" },
    { label: "พื้นที่แสดงผล", value: "477.6 × 269.1 mm" },
    { label: "จำนวนสี", value: "16.7M" },
    { label: "ความสว่าง", value: "300 cd/m²" },
    { label: "อัตราส่วนความเปรียบต่าง", value: "1000 : 1" },
    { label: "มุมมอง H/V", value: "175° / 175°" },
    { label: "อายุ Backlight", value: "LED 30,000 ชม." },
    { label: "Refresh Rate", value: "60 Hz" },
  ]},
  { title: "Touch Panel", rows: [
    { label: "เทคโนโลยี", value: "PCAP (Capacitive)" },
    { label: "เวลาตอบสนอง", value: "< 5ms" },
    { label: "จำนวนจุดสัมผัส", value: "10 จุด standard" },
    { label: "Touch Recognition", value: "> 1.5mm" },
    { label: "Scanning Frequency", value: "200 Hz" },
    { label: "Scanning Accuracy", value: "4096 × 4096" },
    { label: "Working Voltage", value: "180mA / DC +5V ±5%" },
    { label: "ผิวหน้า", value: "Mohs class 7 explosion-proof glass" },
  ]},
  { title: "Operation Environment", rows: [
    { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
    { label: "ความชื้นทำงาน", value: "0% - 90%" },
    { label: "อุณหภูมิเก็บรักษา", value: "0°C - 60°C" },
    { label: "ความชื้นเก็บรักษา", value: "0% - 65%" },
  ]},
  { title: "Dimension & Weight", rows: [
    { label: "ขนาดเครื่อง (W×H×T)", value: "31.5 × 152.27 × 45.18 cm" },
    { label: "ขนาดกล่อง (W×H×T)", value: "46 × 158.5 × 54 cm" },
    { label: "น้ำหนักสุทธิ", value: "23 kg" },
    { label: "น้ำหนักรวม", value: "27.2 kg" },
  ]},
  { title: "Power Supply", rows: [
    { label: "Power Input", value: "110-240V AC 50/60Hz" },
    { label: "Power Output", value: "DC 12V 4A" },
    { label: "Standby Power", value: "≤ 0.5W" },
    { label: "Overall Power", value: "Android < 36W / X86 < 48W" },
  ]},
] as Display32["specs"];

const KD215B_SHARED_USECASES = [
  { image: ucMall,      title: "Retail / Mall Self-service",     description: "ตู้คีออสก์ตั้งพื้น 21.5\" จอใหญ่อ่านง่าย ติดตั้งในโถงห้างฯ / ร้านค้า — ค้นหาสินค้า ดูแผนที่ร้าน หรือเรียกพนักงาน เหมาะกับลูกค้าทุกวัย" },
  { image: ucBank,      title: "Banking / Self-service Branch",   description: "สาขาธนาคารดิจิทัล — ตู้คีออสก์จอใหญ่สำหรับสมัครบัตร เปิดบัญชี กดบัตรคิว หรือพิมพ์ใบ Statement พร้อมช่อง Built-in Printer / Scanner / RFID ปรับแต่งตามฟังก์ชันที่ต้องการ" },
  { image: ucLogistics, title: "Logistics / Warehouse Check-in",  description: "จุดลงทะเบียนคนขับรถ / รับ-ส่งพัสดุในคลังสินค้า — ตู้แข็งแรงทนทาน Powder-coated Steel chassis รองรับ 7×24H ใช้งานในสภาพแวดล้อมอุตสาหกรรม" },
  { image: ucTransit,   title: "Transit / Ticket Vending",        description: "จุดจำหน่ายตั๋วในสถานีรถไฟฟ้า / รถบัส / สนามบิน — Floor Stand แข็งแรง ขนาด 21.5\" จอใหญ่ดูตารางเวลาง่าย พร้อมเครื่องสแกน QR + Coin/Bill Acceptor (Optional)" },
];

const KD215B_SHARED_HIGHLIGHTS = [
  "Industrial-grade Power Supply — 7×24H Stable Working",
  "30,000-hour Extended-life LED Backlight",
  "Multiple peripheral configurations available — Printer / Scanner / RFID / Camera",
  "Optional pre-drilled holes for floor mounting",
  "Industry-First Replaceable Front Panel — เปลี่ยนหน้ากากปรับ Layout ได้",
  "Mohs class 7 explosion-proof glass + PCAP 10-point Touch",
  "45° Tilted Touchscreen — Ergonomic Operation",
  "Sleek Unibody Powder-coated Steel + Lockable Rear Panel",
];

const KD215B_SHARED_FEATURES_LIST = [
  "PCAP 10-point Touch — เวลาตอบสนอง < 5ms / ความแม่นยำ 4096×4096",
  "Mohs class 7 explosion-proof glass — กระจกกันระเบิดทนรอย",
  "Industrial-grade Power Supply — 7×24H Stable Working",
  "30,000-hour Extended-life LED Backlight",
  "ATEX-certified design (รองรับการใช้งานในพื้นที่อันตราย ตามคำขอ)",
  "Streamlined one-piece Sleek Unibody — Powder-coated steel",
  "Lockable rear panel + Key × 2 — สำหรับช่างบำรุงรักษา",
  "Plug-and-play — เสียบปลั๊กพร้อมใช้งาน",
];

const KD215B_INSTALL_CAPTIONS = [
  { title: "ตั้งพื้นแบบ Free-standing", description: "วางตู้บนพื้นปรับระดับ — ใช้กับโถงห้างสรรพสินค้า / ล็อบบี้ธนาคาร / ทางเข้าอาคาร" },
  { title: "ยึดพื้นแบบ Bolted Floor Mount", description: "Optional pre-drilled holes — ยึดด้วยน็อตยึดพื้นในจุดที่มีคนพลุกพล่านเพื่อความปลอดภัย" },
  { title: "ปรับแต่ง Front Panel", description: "ออกแบบหน้ากากด้านหน้าสำหรับติดตั้ง Printer / Scanner / RFID / Card Dispenser ตาม Use Case" },
];

// ============= GD215C — Wall Mounting Touch Kiosk =============

const GD215C_PANEL_SPECS = [
  { title: "LCD Panel", rows: [
    { label: "ขนาดหน้าจอ", value: "21.5 นิ้ว (Portrait 9:16)" },
    { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
    { label: "อัตราส่วนภาพ", value: "16 : 9 (ติดตั้งแนวตั้ง 9:16)" },
    { label: "พื้นที่แสดงผล", value: "477.6 × 269.1 mm" },
    { label: "Bezel", value: "Ultra-Slim 13 mm" },
    { label: "จำนวนสี", value: "16.7M" },
    { label: "ความสว่าง", value: "≥ 250 cd/m²" },
    { label: "อัตราส่วนความเปรียบต่าง", value: "1000 : 1" },
    { label: "มุมมอง H/V", value: "178° / 178°" },
    { label: "อายุ Backlight", value: "LED 30,000 ชม." },
    { label: "Refresh Rate", value: "60 Hz" },
  ]},
  { title: "Touch Panel", rows: [
    { label: "เทคโนโลยี", value: "PCAP (Capacitive)" },
    { label: "เวลาตอบสนอง", value: "< 5ms" },
    { label: "จำนวนจุดสัมผัส", value: "10 จุด standard" },
    { label: "Touch Recognition", value: "> 1.5mm" },
    { label: "Scanning Frequency", value: "200 Hz" },
    { label: "Scanning Accuracy", value: "4096 × 4096" },
    { label: "Working Voltage", value: "180mA / DC +5V ±5%" },
    { label: "ผิวหน้า", value: "Mohs class 7 explosion-proof glass" },
  ]},
  { title: "Android System (ARM)", rows: [
    { label: "CPU (เลือกได้)", value: "Rockchip RK3568 (Cost-effective) / RK3588 (High Performance)" },
    { label: "Graphic GPU", value: "ARM Mali-G52 2EE / Mali-G610 MP4" },
    { label: "หน่วยความจำ (RAM)", value: "RK3568: 4GB LPDDR4 / RK3588: 4GB (8GB optional) LPDDR4" },
    { label: "หน่วยเก็บข้อมูล", value: "RK3568: 32GB eMMC / RK3588: 64–128GB eMMC" },
    { label: "เครือข่าย", value: "Gigabit RJ45 + Wi-Fi 5GHz 802.11a/b/g/n/ac + BLE 5.0" },
    { label: "OS ที่ติดตั้งให้", value: "Android 11 (RK3568) / Android 12 (RK3588)" },
  ]},
  { title: "Operation Environment", rows: [
    { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
    { label: "ความชื้นทำงาน", value: "10% - 80%" },
    { label: "อุณหภูมิเก็บรักษา", value: "-5°C - 60°C" },
    { label: "ความชื้นเก็บรักษา", value: "10% - 85%" },
  ]},
  { title: "Dimension & Weight", rows: [
    { label: "ขนาดเครื่อง (W×H×T)", value: "32.8 × 72 × 7.2 cm" },
    { label: "ขนาดกล่อง (W×H×T)", value: "48 × 87 × 22 cm" },
    { label: "น้ำหนักสุทธิ", value: "11.6 kg" },
    { label: "น้ำหนักรวม", value: "16 kg" },
  ]},
  { title: "Power Supply", rows: [
    { label: "Power Input", value: "110-240V AC 50/60Hz" },
    { label: "Power Output", value: "DC 12V 4A" },
    { label: "Standby Power", value: "≤ 0.5W" },
    { label: "Overall Power", value: "Android < 36W / X86 < 48W" },
  ]},
  { title: "External Connectors", rows: [
    { label: "I/O", value: "RJ45 × 1, USB 2.0 × 2, Power Socket × 1" },
    { label: "Wireless", value: "Wi-Fi 5GHz 802.11ac + BLE 5.0" },
  ]},
  { title: "Included in the Delivery", rows: [
    { label: "Manual / คู่มือ", value: "× 1" },
    { label: "Wi-Fi Antenna", value: "× 1" },
    { label: "Wall Mount Bracket", value: "× 1" },
    { label: "AC Power cable", value: "× 1" },
  ]},
] as Display32["specs"];

const GD215C_USECASES = [
  { image: ucMall,      title: "Retail Self-Order / POS",      description: "ตู้สั่งอาหารหน้าร้าน — แขวนผนัง / ตั้งพื้น / วางบนเคาน์เตอร์ — ติดตั้งง่ายลด CAPEX 30% เมื่อเทียบกับตู้แบบตั้งพื้นเฉพาะทาง รองรับ Square POS / Stripe POS / Clover POS / Shopify POS" },
  { image: ucBank,      title: "Banking / Branch Self-service",  description: "สาขาธนาคาร / Wealth Management — Bezel 13mm บางพิเศษ ดีไซน์เหมือน iPad ใช้แทนพนักงานต้อนรับ ใช้กดบัตรคิว / สมัครผลิตภัณฑ์ / สำรวจความพึงพอใจ" },
  { image: ucLogistics, title: "Parcel Locker / Click & Collect", description: "จุดรับพัสดุอัตโนมัติในห้างฯ / อพาร์ตเมนต์ — แขวนผนังประหยัดพื้นที่ พร้อม Built-in Scanner + Printer สำหรับรับพัสดุด้วยตัวเอง 24 ชม." },
  { image: ucTransit,   title: "Public Self-service / Wayfinding", description: "จุดบริการสาธารณะในสถานีรถไฟ / สนามบิน / โรงพยาบาล — Wall Mount ติดตั้งสะดวก ความสว่าง 250 cd/m² อ่านง่ายในที่มีแสงแดด" },
];

const GD215C_FEATURES = [
  "Ultra-slim Bezel 13mm — ลด black edges กว่า 53% เทียบกับรุ่นเดิม ดีไซน์ iPad-like",
  "Versatile Installation — Wall-mounted / Floor-standing / Desktop ปรับใช้ได้ทั้ง 3 แบบ",
  "Square POS / Stripe POS / Clover POS / Shopify POS Compatible",
  "Android 11 (RK3568) หรือ Android 12 (RK3588) — เลือก Performance ตาม Budget",
  "5GHz Wi-Fi + BLE 5.0 — เชื่อมต่อ POS ปลอดภัย เสถียร",
  "Industrial-grade Power Supply — 7×24H Stable Working",
  "30,000-hour LED Backlight + 3.5 ปี Continuous Performance",
  "Low Maintenance — 2-year Repair Rate ต่ำเพียง 1.5%",
  "Mohs class 7 Explosion-proof Glass + PCAP 10-point Touch",
  "Multiple Peripherals — Printer / Scanner / NFC / Camera (Customizable)",
];

const GD215C_HIGHLIGHTS = [
  "Ultra-slim 13mm Bezel — iPad-like Modern Design",
  "Versatile Installation — Wall / Floor / Desktop",
  "Square / Stripe / Clover / Shopify POS Compatible",
  "Android 11 / 12 — Rockchip RK3568 / RK3588",
  "5GHz Wi-Fi + BLE 5.0 Secure POS Connectivity",
  "3.5-Year Continuous Performance — 24/7 Operation",
  "2-Year Repair Rate Only 1.5% — Low Maintenance",
  "Multiple Peripheral Modules Available",
];

const GD215C_INSTALL_CAPTIONS = [
  { title: "Wall Mount Installation", description: "ติดตั้งแบบแขวนผนัง — เหมาะกับร้านอาหาร / โถงธนาคาร / Reception อาคารสำนักงาน — ประหยัดพื้นที่ ดูทันสมัย" },
  { title: "Floor-Standing Setup", description: "ติดตั้งบนขาตั้งพื้น (Optional) — เหมาะกับ Self-order Kiosk หน้าร้านที่ไม่มีผนังให้แขวน" },
  { title: "Desktop Counter Mount", description: "วางบนเคาน์เตอร์ Reception — เหมาะกับ Sign-in / Visitor Management / Self Check-in โรงแรม" },
];

// ============= Combined Series Definition =============

export const DISPLAYS_215: Record<Display215Slug, Display32> = {
  kd215b: {
    slug: "kd215b",
    modelCode: "KD215B",
    name: '21.5" KD215B Series — Floor-Stand Touch Kiosk (Monitor / Windows / Android)',
    shortName: "KD215B (Floor Kiosk)",
    category: "Floor-Stand 21.5\" Touch Kiosk",
    formFactor: "Floor Kiosk",
    tagline: "ตู้คีออสก์ตั้งพื้น 21.5\" PCAP — เลือก Configuration ได้ 3 แบบ: Touch Monitor / Windows / Android",
    description:
      "KD215B คือตู้คีออสก์ตั้งพื้น (Floor Stand) ขนาด 21.5 นิ้ว FHD 1920×1080 PCAP 10-point — ตัวเครื่องเดียวกัน เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor เฉพาะจอ ต่อกับ PC ภายนอก, (2) Windows/Linux x86 (Celeron J6412 / Core i5-8th / Core i7-10th), (3) Android (RK3568 / RK3288 / RK3588) จุดเด่นคือ Industry-First Replaceable Front Panel — เปลี่ยนหน้ากากปรับแต่งให้รองรับ Printer / Scanner / Fingerprint / RFID ได้ในไม่กี่นาที พร้อม Sleek Unibody Powder-coated Steel, Lockable Rear Panel และ 45° Tilted Touchscreen ตามหลัก Ergonomic — เหมาะกับ Retail / Banking / Exhibition / Logistics / Public Self-service จัดส่งเร็วกว่าคู่แข่ง 7 วัน",
    highlights: [
      { icon: "Layers", title: "เลือก Configuration ได้ 3 แบบ", subtitle: "Monitor / Windows / Android" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs class 7 + < 5ms" },
      { icon: "ShieldCheck", title: "Industrial 7×24H", subtitle: "Lockable + Steel Chassis" },
      { icon: "Box", title: "Replaceable Front Panel", subtitle: "Industry-First Modular Design" },
    ],
    features: KD215B_SHARED_FEATURES_LIST,
    useCases: ["Retail Self-service", "Banking / Self-checkout", "Exhibition", "Public Self-service"],
    useCaseScenarios: KD215B_SHARED_USECASES,
    gallery: [kd215g1, kd215g2, kd215g3, kd215g4, kd215g5, kd215g6, kd215g7],
    galleryCaptions: [
      "มุมมอง 3/4 — ตู้คีออสก์ตั้งพื้น 21.5\" หน้าจอเอียง 45° ตามหลัก Ergonomic เหมาะกับงาน Retail Self-service พร้อม branding ENT บนตัวตู้",
      "มุมตรง — Configurable Front Panel พร้อม Thermal Printer และ RFID/QR Scanner สำหรับงานธนาคารและบริการตัวเอง พร้อมโลโก้แบรนด์",
      "ด้านหลัง — ฝาเหล็กพ่นสีล็อกได้ 3 ชั้น (Lockable Rear Panel) ออกแบบเพื่อการบำรุงรักษาที่ปลอดภัยและเข้าถึงสาย/PC ได้ง่าย",
      "มุมข้าง — โครงสร้าง Sleek Unibody Powder-coated Steel ทรงเพรียว พร้อมช่องระบายอากาศด้านข้างเพื่อใช้งานต่อเนื่อง 24/7",
      "รายละเอียดอุปกรณ์ในตัว — กล้องด้านบน, QR/Barcode Scanner, RFID Reader และ Thermal Printer 80mm พร้อมไฟแสดงสถานะ",
      "Top View — โครงสร้างฝาบนพร้อมช่องระบายอากาศและจุดติดตั้งกล้อง/Sensor เพิ่มเติมได้ตามความต้องการ",
      "Technical Drawing — แบบเทคนิคแสดงโครงสร้างภายใน, ตำแหน่งช่องระบายอากาศ และจุดติดตั้งอุปกรณ์ Add-on Module",
    ],
    ioImage: kd215g7,
    installImages: [kd215Feat5, kd215Feat6, kd215Feat7],
    installCaptions: KD215B_INSTALL_CAPTIONS,
    installSection: { eyebrow: "Installation & Customization", title: "การติดตั้งและปรับแต่งหน้ากาก" },
    featureImages: [],
    osSupport: ["windows", "linux", "android"],
    peripherals: KIOSK_PERIPHERALS,
    customizationLeadTime: KIOSK_CUSTOMIZATION_LEAD_TIME,
    customizationOptions: KIOSK_CUSTOMIZATION_OPTIONS,
    variants: [
      {
        key: "monitor",
        label: "KD215B — Monitor Kiosk",
        badge: "ตู้คีออสก์ (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "ตู้คีออสก์ตั้งพื้น 21.5\" เฉพาะจอสัมผัส PCAP — ต่อกับ External PC, Mini PC หรือ Media Player ผ่าน HDMI + USB Touch (Plug-and-play) ใต้จอมีช่อง Built-in สำหรับ Printer / Scanner / NFC ที่เปลี่ยนหน้ากากปรับแต่งได้",
        bestFor: "ลูกค้ามี PC อยู่แล้ว ต้องการเฉพาะตู้คีออสก์ + จอสัมผัส 21.5\"",
        highlights: [
          "ไม่มี PC ในตัว — ต้นทุนต่ำกว่า เปลี่ยน PC ภายนอกได้อิสระ",
          "Input: HDMI + USB Touch (Plug-and-play)",
          "Connectors: Power Socket × 1, USB 2.0 × 1",
          "Datasheet มาพร้อม Manual / Key × 2 / AC Power cable",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "KD215B — Windows / Linux PC",
        badge: "Floor Kiosk + AIO PC (x86)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "ตู้คีออสก์ตั้งพื้น 21.5\" พร้อม Intel x86 PC ภายใน เลือก CPU ได้ 3 ระดับ — Celeron J6412 (Entry), Core i5-8th (Mid), Core i7-10th (High Performance) ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน รองรับซอฟต์แวร์ POS / KIOSK / ERP ที่ลูกค้าใช้อยู่ ไม่ต้องต่อ PC ภายนอก",
        bestFor: "Self-checkout / Self-service Banking / KIOSK ที่ใช้ซอฟต์แวร์ Windows-based",
        highlights: [
          "Intel Celeron J6412 / Core i5-8th / Core i7-10th",
          "RAM DDR4-2666 SODIMM 4–16GB + mSATA SSD 128–512GB",
          "Pre-install Windows 10 / 11 หรือ Linux",
          "Gigabit RJ45 + Wi-Fi 802.11ac + USB 2.0 × 2",
        ],
        cpu: "Intel Celeron J6412 / i5-8th / i7-10th",
        ram: "4–16GB DDR4",
        storage: "mSATA 128–512GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "KD215B — Android PC",
        badge: "Floor Kiosk + AIO PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "ตู้คีออสก์ตั้งพื้น 21.5\" พร้อม Rockchip ARM PC ภายใน เลือกได้ 3 รุ่น — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) ประหยัดพลังงานกว่า x86 (< 36W) เหมาะกับ Digital Signage, Self-service Kiosk, POS Android-based",
        bestFor: "Retail Self-order / Banking / Wayfinding ที่ใช้ Android App",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2–4–8GB + eMMC 16–32–64–128GB",
          "Pre-install Android 9 / 11 / 12",
          "Wi-Fi 802.11ac + Gigabit RJ45 (RK3288/RK3588) — Power < 36W",
        ],
        cpu: "Rockchip RK3568 / RK3288 / RK3588",
        ram: "2–8GB LPDDR4",
        storage: "eMMC 16–128GB",
        accent: "secondary",
      },
    ],
    cpuOptions: [
      {
        tier: "Entry",
        cpu: "Intel Celeron® J6412 (4-core, Elkhart Lake)",
        gpu: "Intel® UHD Graphics",
        ram: "DDR4-2666 SODIMM 4GB",
        storage: "mSATA SSD 128GB",
        targetUseCase: "Retail Kiosk, Self-checkout, Wayfinding ทั่วไป",
      },
      {
        tier: "Mid",
        cpu: "Intel® Core™ i5 8th Gen",
        gpu: "Intel® Iris® Plus Graphics 645",
        ram: "DDR4-2666 SODIMM 8GB",
        storage: "mSATA SSD 256GB",
        targetUseCase: "Self-service Banking, ERP / POS ระดับสาขา",
      },
      {
        tier: "High",
        cpu: "Intel® Core™ i7 10th Gen",
        gpu: "Intel® UHD Graphics",
        ram: "DDR4-2666 SODIMM 16GB",
        storage: "mSATA SSD 512GB",
        targetUseCase: "AI Vision / Multi-tasking Workstation, Industrial HMI",
      },
      {
        tier: "Entry",
        cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)",
        gpu: "ARM Mali-G52 2EE",
        ram: "LPDDR4 4GB (4GB optional)",
        storage: "eMMC 32GB",
        targetUseCase: "Retail / POS Self-order (Android), Digital Signage",
      },
      {
        tier: "Mid",
        cpu: "Rockchip RK3288 (Quad-core ARM Cortex-A17)",
        gpu: "Mali-T864",
        ram: "LPDDR3 2GB",
        storage: "eMMC 16GB",
        targetUseCase: "Pre-install Android 9 — งาน Legacy POS App",
      },
      {
        tier: "High",
        cpu: "Rockchip RK3588 (Octa-core, 8nm)",
        gpu: "ARM Mali-G610 MP4",
        ram: "LPDDR4 4GB (8GB optional)",
        storage: "eMMC 64GB / 128GB",
        targetUseCase: "AI Vision, Multi-app POS, 4K Multimedia",
      },
    ],
    datasheetUrl: "/datasheets/KD215B-X86.pdf",
    ports: [
      "RJ45 × 1 (PC variants)",
      "USB 2.0 × 2 (PC variants) / × 1 (Monitor)",
      "Power Socket × 1",
      "Wi-Fi Antenna × 1 (Android/x86)",
    ],
    specs: [
      { title: "PC System (Windows / Linux x86)", rows: [
        { label: "CPU (เลือกได้)", value: "Intel Celeron® J6412 / Core™ i5-8th Gen / Core™ i7-10th Gen" },
        { label: "Graphic GPU", value: "Intel UHD / Iris Plus 645 / UHD" },
        { label: "Audio", value: "HD Audio: ALC269" },
        { label: "หน่วยความจำ (RAM)", value: "DDR4-2666 SODIMM 4 / 8 / 16 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "mSATA 128 / 256 / 512 GB" },
        { label: "เครือข่าย", value: "10/100/1000M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Windows 10 / 11 / Linux (เลือกได้)" },
      ]},
      { title: "Android System (ARM)", rows: [
        { label: "CPU (เลือกได้)", value: "Rockchip RK3568 / RK3288 / RK3588" },
        { label: "Graphic GPU", value: "ARM G52 2EE / Mali-T864 / Mali-G610" },
        { label: "หน่วยความจำ (RAM)", value: "RK3568 4GB (4GB opt) / RK3288 2GB / RK3588 4GB (8GB opt)" },
        { label: "หน่วยเก็บข้อมูล", value: "RK3568 32GB eMMC / RK3288 16GB eMMC / RK3588 64–128GB eMMC" },
        { label: "เครือข่าย", value: "10/100M RJ45 (RK3568) หรือ 100/1000M RJ45 (RK3288/RK3588) + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Android 11 (RK3568) / Android 9 (RK3288) / Android 12 (RK3588)" },
      ]},
      ...KD215B_SHARED_PANEL,
      { title: "External Connectors", rows: [
        { label: "Monitor variant", value: "Power Socket × 1, USB 2.0 × 1" },
        { label: "Windows/x86 variant", value: "RJ45 × 1, USB 2.0 × 2, Power Socket × 1" },
        { label: "Android variant", value: "RJ45 × 1, USB 2.0 × 2, Power Socket × 1" },
      ]},
      { title: "Included in the Delivery", rows: [
        { label: "Manual / คู่มือ", value: "× 1" },
        { label: "Wi-Fi Antenna (Android/x86)", value: "× 1" },
        { label: "Key (กุญแจฝาหลัง)", value: "× 2" },
        { label: "AC Power cable", value: "× 1" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 FHD",
      brightness: "300 cd/m²",
      contrast: "1000:1",
      touch: "PCAP 10pt + Mohs 7",
      os: "Monitor / Windows / Linux / Android",
      formFactor: "Floor Kiosk 21.5\"",
      dimensionCm: "31.5 × 152.27 × 45.18",
      weightKg: "23",
      power: "Android < 36W / x86 < 48W",
      install: "Floor Stand (Optional Bolt-down)",
    },
  },

  // ============= GD215C — 21.5" Wall Mounting Touch Kiosk =============
  gd215c: {
    slug: "gd215c",
    modelCode: "GD215C",
    name: '21.5" GD215C — Wall Mounting Touch Kiosk (Android)',
    shortName: "GD215C (Wall Kiosk)",
    category: "Wall-Mount 21.5\" Touch Kiosk",
    formFactor: "Wall Kiosk",
    tagline: "ตู้คีออสก์ขนาด 21.5\" Bezel 13mm — แขวนผนัง / ตั้งพื้น / วางเคาน์เตอร์ ติดตั้งได้ 3 แบบในเครื่องเดียว",
    description:
      "GD215C คือตู้คีออสก์ Wall-Mount ขนาด 21.5\" Portrait FHD 1920×1080 PCAP 10-point — ดีไซน์ Modern & Stylish แบบ iPad-like ด้วย Ultra-slim Bezel 13mm ลด black edges กว่า 53% เทียบรุ่นเดิม จุดเด่นคือ Versatile Installation — ติดตั้งได้ 3 แบบในเครื่องเดียว: แขวนผนัง / ตั้งพื้น / วางเคาน์เตอร์ ลด CAPEX ได้ถึง 30% เทียบกับการซื้อตู้แยกประเภท พร้อม Android 11 (RK3568) หรือ Android 12 (RK3588) ที่รองรับ Square POS / Stripe POS / Clover POS / Shopify POS แบบ Native — เชื่อมต่อด้วย 5GHz Wi-Fi + BLE 5.0 ปลอดภัย พิสูจน์ความทนทานด้วย 3.5 ปี Continuous Performance + อัตราซ่อม 2 ปี เพียง 1.5% เหมาะกับ Retail Self-Order / Banking / Parcel Locker / Healthcare Check-in / Public Self-Service",
    highlights: [
      { icon: "Layers", title: "Versatile 3-in-1 Install", subtitle: "Wall / Floor / Desktop" },
      { icon: "Sparkles", title: "Ultra-slim 13mm Bezel", subtitle: "iPad-like Modern Design" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs 7 + 5GHz Wi-Fi + BLE 5.0" },
      { icon: "ShieldCheck", title: "3.5-Year 24/7 Performance", subtitle: "2-yr Repair Rate Only 1.5%" },
    ],
    features: GD215C_FEATURES,
    useCases: ["Retail Self-Order", "Banking Self-service", "Parcel Locker", "Public Self-service"],
    useCaseScenarios: GD215C_USECASES,
    gallery: [gd215g1, gd215g2, gd215g3, gd215g4a, gd215g4b, gd215g5, gd215g6, gd215g7],
    ioImage: gd215g6,
    installImages: [gd215Install1, gd215Install2, gd215Install3],
    installCaptions: GD215C_INSTALL_CAPTIONS,
    installSection: { eyebrow: "Versatile Installation", title: "ติดตั้งได้ 3 แบบในเครื่องเดียว — Wall / Floor / Desktop" },
    featureImages: [gd215Panel1, gd215Panel2],
    osSupport: ["android"],
    peripherals: KIOSK_PERIPHERALS,
    customizationLeadTime: KIOSK_CUSTOMIZATION_LEAD_TIME,
    customizationOptions: KIOSK_CUSTOMIZATION_OPTIONS,
    variants: [
      {
        key: "rk3568",
        label: "GD215C — RK3568 (Cost-effective)",
        badge: "Wall Kiosk + Android 11",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "ตู้คีออสก์ Wall-Mount 21.5\" Portrait พร้อม Rockchip RK3568 (Quad-core ARM Cortex-A55) Android 11 — ตัวเลือกประหยัดงบสำหรับงาน POS / Self-Order / Wayfinding ทั่วไป รองรับ Square / Stripe / Clover / Shopify POS Native + 5GHz Wi-Fi + BLE 5.0",
        bestFor: "Retail POS / Self-order ที่ต้องการราคาคุ้มค่า + Performance พอเพียง",
        highlights: [
          "Rockchip RK3568 (Quad-core, ARM Cortex-A55)",
          "ARM Mali-G52 2EE GPU",
          "RAM 4GB LPDDR4 + eMMC 32GB",
          "Pre-install Android 11",
          "5GHz Wi-Fi 802.11ac + BLE 5.0 + Gigabit RJ45",
        ],
        cpu: "Rockchip RK3568",
        ram: "4GB LPDDR4",
        storage: "eMMC 32GB",
        accent: "secondary",
      },
      {
        key: "rk3588",
        label: "GD215C — RK3588 (High Performance)",
        badge: "Wall Kiosk + Android 12",
        osBackground: "android",
        icon: "Cpu",
        description:
          "ตู้คีออสก์ Wall-Mount 21.5\" Portrait พร้อม Rockchip RK3588 (Octa-core 8nm) Android 12 — รุ่น Top-tier สำหรับงาน AI Vision, Face Recognition, Multi-app POS ที่ต้องการประมวลผลเร็ว รองรับ 4K Decoding และ Multi-task ลื่นไหล",
        bestFor: "AI Vision / Face Recognition / Multi-app POS / 4K Digital Signage",
        highlights: [
          "Rockchip RK3588 (Octa-core 8nm)",
          "ARM Mali-G610 MP4 GPU",
          "RAM 4GB LPDDR4 (8GB optional) + eMMC 64–128GB",
          "Pre-install Android 12",
          "5GHz Wi-Fi 802.11ac + BLE 5.0 + Gigabit RJ45",
        ],
        cpu: "Rockchip RK3588",
        ram: "4–8GB LPDDR4",
        storage: "eMMC 64–128GB",
        accent: "primary",
      },
    ],
    cpuOptions: [
      {
        tier: "Entry",
        cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)",
        gpu: "ARM Mali-G52 2EE",
        ram: "LPDDR4 4GB",
        storage: "eMMC 32GB",
        targetUseCase: "Retail POS, Self-order, Wayfinding, Digital Signage",
      },
      {
        tier: "High",
        cpu: "Rockchip RK3588 (Octa-core, 8nm)",
        gpu: "ARM Mali-G610 MP4",
        ram: "LPDDR4 4GB (8GB optional)",
        storage: "eMMC 64GB / 128GB",
        targetUseCase: "AI Vision, Face Recognition, Multi-app POS, 4K Multimedia",
      },
    ],
    datasheetUrl: "/datasheets/GD215C-ARM.pdf",
    ports: [
      "RJ45 × 1 (Gigabit)",
      "USB 2.0 × 2",
      "Power Socket × 1",
      "Wi-Fi Antenna × 1 (5GHz 802.11ac)",
      "BLE 5.0 (built-in)",
    ],
    specs: GD215C_PANEL_SPECS,
    quick: {
      resolution: "1920×1080 FHD (Portrait)",
      brightness: "≥ 250 cd/m²",
      contrast: "1000:1",
      touch: "PCAP 10pt + Mohs 7",
      os: "Android 11 / Android 12",
      formFactor: "Wall Kiosk 21.5\" (3-in-1)",
      dimensionCm: "32.8 × 72 × 7.2",
      weightKg: "11.6",
      power: "Android < 36W",
      install: "Wall / Floor / Desktop",
    },
  },
};

export const DISPLAY_215_ORDER: Display215Slug[] = ["kd215b", "gd215c"];

export const getDisplay215 = (slug: string): Display32 | undefined =>
  (DISPLAYS_215 as Record<string, Display32>)[slug];

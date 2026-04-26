/**
 * Touch Display 15.6" — KD156B Floor-Stand Touch Kiosk
 * แหล่งสเปก: touchwo.com
 *  - Monitor:  https://touchwo.com/product/15-6-monitor-floor-stand-touch-kiosk-kd156b/
 *  - X86:      https://touchwo.com/product/15-6-x86-floor-stand-touch-kiosk-kd156b/
 *  - Android:  https://touchwo.com/product/15-6-android-floor-stand-touch-kiosk-kd156b/
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";
import {
  KIOSK_PERIPHERALS,
  KIOSK_CUSTOMIZATION_OPTIONS,
  KIOSK_CUSTOMIZATION_LEAD_TIME,
} from "./kiosk-peripherals";

// Gallery — KD156B Floor Stand Kiosk (8 รูปจาก touchwo)
import kd156g1 from "@/assets/touchwo/kd156b/KD156-1A.jpg";
import kd156g2 from "@/assets/touchwo/kd156b/KD156-2A.jpg";
import kd156g3 from "@/assets/touchwo/kd156b/KD156-3.jpg";
import kd156g4 from "@/assets/touchwo/kd156b/KD156-4.jpg";
import kd156g5 from "@/assets/touchwo/kd156b/KD156-5.jpg";
import kd156g6 from "@/assets/touchwo/kd156b/KD156-6.jpg";
import kd156g7 from "@/assets/touchwo/kd156b/KD156-7.jpg";
import kd156g8 from "@/assets/touchwo/kd156b/KD156-8.jpg";

// Feature highlight illustrations
import kd156Feat5 from "@/assets/touchwo/kd156b/feat-5-1.png";
import kd156Feat6 from "@/assets/touchwo/kd156b/feat-6.png";
import kd156Feat7 from "@/assets/touchwo/kd156b/feat-7.png";

// Use case scenarios — ใช้ภาพ Floor Kiosk จากซีรีส์ KD32B (Floor Stand เหมือนกัน)
import ucMall from "@/assets/touchwo/usecases/kd32b-uc-mall.jpg";
import ucBank from "@/assets/touchwo/usecases/kd32b-uc-bank.jpg";
import ucLogistics from "@/assets/touchwo/usecases/kd32b-uc-logistics.jpg";
import ucTransit from "@/assets/touchwo/usecases/kd32b-uc-transit.jpg";

export type Display156Slug = "kd156b";

export { OS_BACKGROUNDS };
export type { OSKey };

const KD156B_SHARED_PANEL = [
  { title: "LCD Panel", rows: [
    { label: "ขนาดหน้าจอ", value: "15.6 นิ้ว" },
    { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
    { label: "อัตราส่วนภาพ", value: "16 : 9" },
    { label: "พื้นที่แสดงผล", value: "344.16 × 193.59 mm" },
    { label: "จำนวนสี", value: "16.7M" },
    { label: "ความสว่าง", value: "250 cd/m²" },
    { label: "อัตราส่วนความเปรียบต่าง", value: "800 : 1" },
    { label: "มุมมอง H/V", value: "175° / 175°" },
    { label: "อายุ Backlight", value: "LED 15,000 ชม." },
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
    { label: "ความชื้นทำงาน", value: "0% - 80%" },
    { label: "อุณหภูมิเก็บรักษา", value: "-5°C - 60°C" },
    { label: "ความชื้นเก็บรักษา", value: "10% - 85%" },
  ]},
  { title: "Dimension & Weight", rows: [
    { label: "ขนาดเครื่อง (W×H×T)", value: "25.4 × 146.47 × 38 cm" },
    { label: "ขนาดกล่อง (W×H×T)", value: "33.5 × 160 × 48 cm" },
    { label: "น้ำหนักสุทธิ", value: "20.1 kg" },
    { label: "น้ำหนักรวม", value: "25.6 kg" },
  ]},
  { title: "Power Supply", rows: [
    { label: "Power Input", value: "110-240V AC 50/60Hz" },
    { label: "Power Output", value: "DC 12V 5A" },
    { label: "Standby Power", value: "≤ 0.5W" },
    { label: "Overall Power", value: "Android < 30W / X86 < 48W" },
  ]},
] as Display32["specs"];

const KD156B_SHARED_USECASES = [
  { image: ucMall,      title: "Retail / Mall Self-service",     description: "ตู้คีออสก์ตั้งพื้น 15.6\" ขนาดเล็กกะทัดรัด ติดตั้งในโถงห้างฯ / ร้านค้า — ค้นหาสินค้า ดูแผนที่ร้าน หรือเรียกพนักงาน ขนาดจอเหมาะมือ ใช้งานง่าย ไม่บดบังทัศนวิสัย" },
  { image: ucBank,      title: "Banking / Self-service Branch",   description: "สาขาธนาคารดิจิทัล — ตู้คีออสก์ขนาดพอดีมือสำหรับสมัครบัตร เปิดบัญชี กดบัตรคิว หรือพิมพ์ใบ Statement พร้อมช่อง Built-in Printer / Scanner / RFID ปรับแต่งตามฟังก์ชันที่ต้องการ" },
  { image: ucLogistics, title: "Logistics / Warehouse Check-in",  description: "จุดลงทะเบียนคนขับรถ / รับ-ส่งพัสดุในคลังสินค้า — ตู้แข็งแรงทนทาน เพดานเตี้ย IP-rated chassis รองรับ 7×24H ใช้งานในสภาพแวดล้อมอุตสาหกรรม" },
  { image: ucTransit,   title: "Transit / Ticket Vending",        description: "จุดจำหน่ายตั๋วในสถานีรถไฟฟ้า / รถบัส / สนามบิน — Floor Stand แข็งแรง ขนาด 15.6\" พอดีกับงานขายตั๋ว / Top-up บัตรโดยสาร พร้อมเครื่องสแกน QR + Coin/Bill Acceptor (Optional)" },
];

const KD156B_SHARED_HIGHLIGHTS = [
  "Industrial-grade Power Supply — 7×24H Stable Working",
  "30,000-hour Extended-life LED Backlight",
  "Multiple peripheral configurations available — Printer / Scanner / RFID / Camera",
  "Optional pre-drilled holes for floor mounting",
  "Interchangeable front panel — เปลี่ยนหน้ากากปรับ Layout ได้",
  "Mohs class 7 explosion-proof glass + PCAP 10-point Touch",
  "Sleek Unibody Design — Powder-coated steel chassis",
  "Lockable Rear Panel — Secure yet easy maintenance",
];

const KD156B_SHARED_FEATURES_LIST = [
  "PCAP 10-point Touch — เวลาตอบสนอง < 5ms / ความแม่นยำ 4096×4096",
  "Mohs class 7 explosion-proof glass — กระจกกันระเบิดทนรอย",
  "Industrial-grade Power Supply — 7×24H Stable Working",
  "30,000-hour Extended-life LED Backlight",
  "ATEX-certified design (รองรับการใช้งานในพื้นที่อันตราย ตามคำขอ)",
  "Streamlined one-piece Sleek Unibody — Powder-coated steel",
  "Lockable rear panel + Key × 2 — สำหรับช่างบำรุงรักษา",
  "Plug-and-play — เสียบปลั๊กพร้อมใช้งาน",
];

const KD156B_INSTALL_CAPTIONS = [
  { title: "ตั้งพื้นแบบ Free-standing", description: "วางตู้บนพื้นปรับระดับ — ใช้กับโถงห้างสรรพสินค้า / ล็อบบี้โรงพยาบาล / ทางเข้าอาคาร" },
  { title: "ยึดพื้นแบบ Bolted Floor Mount", description: "Optional pre-drilled holes — ยึดด้วยน็อตยึดพื้นในจุดที่มีคนพลุกพล่านเพื่อความปลอดภัย" },
  { title: "ปรับแต่ง Front Panel", description: "ออกแบบหน้ากากด้านหน้าสำหรับติดตั้ง Printer / Scanner / RFID / Card Dispenser ตาม Use Case" },
];

export const DISPLAYS_156: Record<Display156Slug, Display32> = {
  kd156b: {
    slug: "kd156b",
    modelCode: "KD156B",
    name: '15.6" KD156B Series — Floor-Stand Touch Kiosk (Monitor / Windows / Android)',
    shortName: "KD156B (Floor Kiosk)",
    category: "Floor-Stand 15.6\" Touch Kiosk",
    formFactor: "Floor Kiosk",
    tagline: "ตู้คีออสก์ตั้งพื้น 15.6\" PCAP — เลือก Configuration ได้ 3 แบบ: Touch Monitor / Windows / Android",
    description:
      "KD156B คือตู้คีออสก์ตั้งพื้น (Floor Stand) ขนาด 15.6 นิ้ว FHD 1920×1080 PCAP 10-point — ตัวเครื่องเดียวกัน เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor เฉพาะจอ ต่อกับ PC ภายนอก, (2) Windows/Linux x86 (Celeron J6412 / Core i5-8th / Core i7-10th), (3) Android (RK3568 / RK3288 / RK3588) จุดเด่นคือ Industry-First Replaceable Front Panel — เปลี่ยนหน้ากากปรับแต่งให้รองรับ Printer / Scanner / Fingerprint / RFID ได้ในไม่กี่นาที พร้อม Sleek Unibody Powder-coated Steel, Lockable Rear Panel และ 45° Tilted Touchscreen ตามหลัก Ergonomic — เหมาะกับ Retail / Banking / Logistics / Transit / Self-service Public Spaces จัดส่งเร็วกว่าคู่แข่ง 7 วัน",
    highlights: [
      { icon: "Layers", title: "เลือก Configuration ได้ 3 แบบ", subtitle: "Monitor / Windows / Android" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs class 7 + < 5ms" },
      { icon: "ShieldCheck", title: "Industrial 7×24H", subtitle: "Lockable + Steel Chassis" },
      { icon: "Box", title: "Replaceable Front Panel", subtitle: "Industry-First Modular Design" },
    ],
    features: KD156B_SHARED_FEATURES_LIST,
    useCases: ["Retail Self-service", "Banking / Self-checkout", "Logistics Check-in", "Transit Ticketing"],
    useCaseScenarios: KD156B_SHARED_USECASES,
    gallery: [kd156g1, kd156g2, kd156g3, kd156g4, kd156g5, kd156g6, kd156g7, kd156g8],
    ioImage: kd156g7,
    installImages: [kd156Feat5, kd156Feat6, kd156Feat7],
    installCaptions: KD156B_INSTALL_CAPTIONS,
    installSection: { eyebrow: "Installation & Customization", title: "การติดตั้งและปรับแต่งหน้ากาก" },
    featureImages: [],
    osSupport: ["windows", "linux", "android"],
    peripherals: KIOSK_PERIPHERALS,
    customizationLeadTime: KIOSK_CUSTOMIZATION_LEAD_TIME,
    customizationOptions: KIOSK_CUSTOMIZATION_OPTIONS,
    variants: [
      {
        key: "monitor",
        label: "KD156B — Monitor Kiosk",
        badge: "ตู้คีออสก์ (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "ตู้คีออสก์ตั้งพื้น 15.6\" เฉพาะจอสัมผัส PCAP — ต่อกับ External PC, Mini PC หรือ Media Player ผ่าน HDMI + USB Touch (Plug-and-play) ใต้จอมีช่อง Built-in สำหรับ Printer / Scanner / NFC ที่เปลี่ยนหน้ากากปรับแต่งได้",
        bestFor: "ลูกค้ามี PC อยู่แล้ว ต้องการเฉพาะตู้คีออสก์ + จอสัมผัส 15.6\"",
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
        label: "KD156B — Windows / Linux PC",
        badge: "Floor Kiosk + AIO PC (x86)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "ตู้คีออสก์ตั้งพื้น 15.6\" พร้อม Intel x86 PC ภายใน เลือก CPU ได้ 3 ระดับ — Celeron J6412 (Entry), Core i5-8th (Mid), Core i7-10th (High Performance) ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน รองรับซอฟต์แวร์ POS / KIOSK / ERP ที่ลูกค้าใช้อยู่ ไม่ต้องต่อ PC ภายนอก",
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
        label: "KD156B — Android PC",
        badge: "Floor Kiosk + AIO PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "ตู้คีออสก์ตั้งพื้น 15.6\" พร้อม Rockchip ARM PC ภายใน เลือกได้ 3 รุ่น — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) ประหยัดพลังงานกว่า x86 (< 30W) เหมาะกับ Digital Signage, Self-service Kiosk, POS Android-based",
        bestFor: "Retail Self-order / Banking / Wayfinding ที่ใช้ Android App",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2–4–8GB + eMMC 16–32–64–128GB",
          "Pre-install Android 9 / 11 / 12",
          "Wi-Fi 802.11ac + Gigabit RJ45 (RK3288/RK3588) — Power < 30W",
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
    datasheetUrl: "/datasheets/KD156B-ARM.pdf",
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
      ...KD156B_SHARED_PANEL,
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
      brightness: "250 cd/m²",
      contrast: "800:1",
      touch: "PCAP 10pt + Mohs 7",
      os: "Monitor / Windows / Linux / Android",
      formFactor: "Floor Kiosk 15.6\"",
      dimensionCm: "25.4 × 146.47 × 38",
      weightKg: "20.1",
      power: "Android < 30W / x86 < 48W",
      install: "Floor Stand (Optional Bolt-down)",
    },
  },
};

export const DISPLAY_156_ORDER: Display156Slug[] = ["kd156b"];

export const getDisplay156 = (slug: string): Display32 | undefined =>
  (DISPLAYS_156 as Record<string, Display32>)[slug];

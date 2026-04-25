/**
 * Touch Display 43" — Configurable AIO series
 * แยก group ออกจาก 32" เพื่อรองรับการขยายรุ่นในอนาคต (HD43, HR43, KD43B, etc.)
 *
 * Types ใช้ร่วมกับ displays-32 เพื่อ Display43Detail ใช้ component เดียวกันได้
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";

// HD43 — ภาพต้นฉบับจาก touchwo.com (ทั้ง 3 variants ใช้ตัวเครื่องดีไซน์เดียวกัน)
import hd43Mon1 from "@/assets/touchwo/hd43/mon-1.jpg";
import hd43Mon2 from "@/assets/touchwo/hd43/mon-2.jpg";
import hd43Mon3 from "@/assets/touchwo/hd43/mon-3.jpg";
import hd43Mon4 from "@/assets/touchwo/hd43/mon-4.jpg";
import hd43Mon5 from "@/assets/touchwo/hd43/mon-5.jpg";
import hd43Mon6 from "@/assets/touchwo/hd43/mon-6.jpg";
import hd43Mon7 from "@/assets/touchwo/hd43/mon-7.jpg";
import hd43X861 from "@/assets/touchwo/hd43/x86-1.jpg";
import hd43X862 from "@/assets/touchwo/hd43/x86-2.jpg";
import hd43Arm1 from "@/assets/touchwo/hd43/arm-1.jpg";
import hd43Arm2 from "@/assets/touchwo/hd43/arm-2.jpg";

// Use-case lifestyle scenes
import hd43UcRestaurant from "@/assets/touchwo/usecases/hd43-uc-restaurant.jpg";
import hd43UcMeeting from "@/assets/touchwo/usecases/hd43-uc-meeting.jpg";
import hd43UcSelforder from "@/assets/touchwo/usecases/hd43-uc-selforder.jpg";
import hd43UcReception from "@/assets/touchwo/usecases/hd43-uc-reception.jpg";

export type Display43Slug = "hd43";

export { OS_BACKGROUNDS };
export type { OSKey };

export const DISPLAYS_43: Record<Display43Slug, Display32> = {
  hd43: {
    slug: "hd43",
    modelCode: "HD43",
    name: '43" HD43 Series — Touch Monitor / Windows PC / Android PC',
    shortName: "HD43 Series",
    category: "Configurable 43\" Touch Display",
    formFactor: "Configurable AIO",
    tagline: "หน้าจอสัมผัส 43\" PCAP — เลือก Configuration ได้ 3 แบบ: Touch Monitor / Windows / Android",
    description:
      "HD43 คือซีรีส์จอสัมผัส PCAP 43 นิ้ว ขอบจอบาง 13mm สไตล์ iPad-like ตัวเครื่องเดียวกัน — เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor เฉพาะจอสัมผัสที่ต่อกับ PC ภายนอก, (2) Windows/Linux All-in-One PC พร้อม Intel x86 (Celeron J6412 / Core i5-8th / Core i7-10th), (3) Android All-in-One PC พร้อม Rockchip ARM (RK3568 / RK3288 / RK3588) รองรับ Square POS, Stripe POS, Clover POS, Shopify POS — ติดตั้งได้ทั้งแขวนผนัง วางตั้งโต๊ะ Floor Stand หรือฝังเฟอร์นิเจอร์ เหมาะกับงาน QSR Self-order, Digital Menu Board, Conference, Hotel Reception",
    highlights: [
      { icon: "Layers", title: "เลือก Configuration ได้ 3 แบบ", subtitle: "Monitor / Windows / Android" },
      { icon: "Maximize", title: "ขอบจอบาง 13mm", subtitle: "Ultra-small Bezel iPad-like" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs class 7 glass" },
      { icon: "ShieldCheck", title: "ทำงาน 24/7", subtitle: "อัตราซ่อม 2 ปี ≤ 1.5%" },
    ],
    features: [
      "ขอบจอบาง 13mm — ลดขอบดำ 53% สไตล์ iPad-like",
      "เลือก Configuration ได้ 3 แบบ: Touch-only / x86 / ARM",
      "Pre-install Windows 10/11 / Linux / Android 9/11/12",
      "รองรับ Square POS / Stripe POS / Clover POS / Shopify POS",
      "5GHz Wi-Fi + BLE 5.0 (รุ่น Android) เชื่อม POS เสถียร",
      "Industrial-grade Power Supply — 7×24H Stable Working",
      "ติดตั้งได้ Wall / Floor Stand / Desktop / Embedded",
      "ผิวหน้าจอกันน้ำ IP65 + Mohs class 7 explosion-proof glass",
    ],
    useCases: ["QSR Self-order", "Digital Menu Board", "Conference Room", "Hotel Reception"],
    useCaseScenarios: [
      { image: hd43UcRestaurant, title: "Digital Menu Board / QSR",   description: "จอเมนูดิจิทัลขนาด 43\" แขวนหลังเคาน์เตอร์ร้านอาหาร แสดงภาพอาหารคมชัด FHD เปลี่ยนเมนูตามช่วงเวลาได้แบบ Real-time ดึงดูดสายตาลูกค้าได้ดีกว่าเมนูพิมพ์" },
      { image: hd43UcSelforder,   title: "POS Self-order Kiosk",       description: "ตู้สั่งอาหารด้วยตนเองในร้าน QSR / Casual Dining ลดคิวที่เคาน์เตอร์ เพิ่มยอด upsell เฉลี่ย 20-30% ผ่านเมนูภาพชัดและ Recommend Combo อัตโนมัติ" },
      { image: hd43UcMeeting,     title: "Conference / Meeting Room", description: "จอสัมผัสในห้องประชุมขนาดกลาง 6-10 คน รองรับ Video Conference, Whiteboard, BYOD ผ่าน HDMI/USB-C เพิ่มประสิทธิภาพการทำงานทีมแบบ Hybrid" },
      { image: hd43UcReception,   title: "Hotel Reception / Concierge", description: "จุด Self check-in โรงแรม แสดงข้อมูลห้องพัก แผนที่ และ Concierge Services ลดภาระ Front desk และยกระดับประสบการณ์ลูกค้าระดับพรีเมียม" },
    ],
    gallery: [
      hd43Mon1, hd43Mon2, hd43X861, hd43X862, hd43Arm1, hd43Arm2,
      hd43Mon5, hd43Mon6, hd43Mon7,
    ],
    ioImage: hd43Mon6,
    installImages: [hd43Mon3, hd43Mon4, hd43Mon7],
    featureImages: [],
    dimensionDrawings: [],
    osSupport: ["windows", "linux", "android"],
    variants: [
      {
        key: "monitor",
        label: "HD43 — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 43\" PCAP ล้วน ๆ — ต่อกับ External PC, Mini PC หรือ Media Player ผ่าน HDMI + USB Touch ขอบจอบาง 13mm ความสว่าง 300 nit เหมาะกับ Digital Menu Board, Signage, Conference ที่มี PC อยู่แล้ว",
        bestFor: "ลูกค้ามี PC/Mini PC อยู่แล้ว ต้องการเฉพาะจอสัมผัส 43\"",
        highlights: [
          "ไม่มี PC ในตัว — ต้นทุนต่ำกว่า ปรับเปลี่ยน PC ภายนอกได้",
          "Input: HDMI + USB Touch (Plug-and-play)",
          "Brightness 300 cd/m² (สูงกว่ารุ่น AIO)",
          "Power Consumption ต่ำสุด < 110W",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "HD43 — Windows / Linux PC",
        badge: "All-in-One PC (x86)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 43\" พร้อม Intel x86 ภายใน เลือก CPU ได้ 3 ระดับ — Celeron J6412 (Entry), Core i5-8th (Mid), Core i7-10th (High) ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน รองรับซอฟต์แวร์ POS / ERP / Industrial HMI",
        bestFor: "Enterprise / POS / Conference ที่ใช้ซอฟต์แวร์ Windows-based",
        highlights: [
          "Intel Celeron J6412 / Core i5-8th / Core i7-10th",
          "RAM DDR4 4–16GB + mSATA SSD 128–512GB",
          "Pre-install Windows 10/11 หรือ Linux",
          "RJ45 Gigabit + Wi-Fi 802.11ac",
        ],
        cpu: "Intel Celeron / i5 / i7",
        ram: "4–16GB DDR4",
        storage: "SSD 128–512GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "HD43 — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 43\" พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 / RK3288 / RK3588 ติดตั้ง Android 9/11/12 จากโรงงาน รองรับ Square POS / Stripe POS / Clover POS / Shopify POS พร้อม 5GHz Wi-Fi + BLE 5.0 ประหยัดพลังงานกว่า x86",
        bestFor: "QSR Self-order / Digital Signage / POS ที่ใช้ Android App",
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
    ],
    cpuOptions: [
      {
        tier: "Entry",
        cpu: "Intel Celeron® J6412 (4-core, Elkhart Lake)",
        gpu: "Intel® UHD Graphics",
        ram: "DDR4-2666 SODIMM 4GB",
        storage: "mSATA SSD 128GB",
        targetUseCase: "Digital Menu Board, Signage, Self-service Kiosk งานทั่วไป",
      },
      {
        tier: "Mid",
        cpu: "Intel® Core™ i5-8th Gen",
        gpu: "Intel® Iris® Plus Graphics 645",
        ram: "DDR4-2666 SODIMM 8GB",
        storage: "mSATA SSD 256GB",
        targetUseCase: "Conference Room, POS Self-order, ERP / CRM Front-end",
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
    datasheetUrl: "/datasheets/ENT-Datasheet-HD43.pdf",
    dimensionUrl: "/datasheets/ENT-Dimension-HD43.pdf",
    ports: ["RJ45 × 1", "USB × 4", "VGA × 1", "HDMI out × 1", "Audio in/out × 1", "Power Socket × 1"],
    specs: [
      { title: "PC System (Windows / Linux x86)", rows: [
        { label: "CPU (เลือกได้)", value: "Celeron J6412 / Core i5-8th / Core i7-10th" },
        { label: "Graphic GPU", value: "Intel UHD / Iris Plus 645 / UHD" },
        { label: "หน่วยความจำ (RAM)", value: "DDR4-2666 SODIMM 4 / 8 / 16 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "mSATA SSD 128 / 256 / 512 GB" },
        { label: "เครือข่าย", value: "10/100/1000M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "Audio", value: "HD Audio: ALC269" },
        { label: "OS ที่ติดตั้งให้", value: "Windows 10 / 11 / Linux (เลือกได้)" },
      ]},
      { title: "Android System (ARM)", rows: [
        { label: "CPU (เลือกได้)", value: "Rockchip RK3568 / RK3288 / RK3588" },
        { label: "Graphic GPU", value: "ARM G52 2EE / Mali-T864 / Mali-G610" },
        { label: "หน่วยความจำ (RAM)", value: "2GB (4GB opt) / 2GB / 4GB (8GB opt)" },
        { label: "หน่วยเก็บข้อมูล", value: "eMMC 32GB / 16GB (32GB opt) / 64GB (128GB opt)" },
        { label: "เครือข่าย", value: "RJ45 + 5GHz Wi-Fi 802.11ac + BLE 5.0" },
        { label: "OS ที่ติดตั้งให้", value: "Android 11 / Android 9 / Android 12" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "43 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 FHD (4K Optional)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "944.07 × 532.27 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "250 cd/m² (Monitor 300)" },
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
        { label: "Overall Power", value: "Monitor < 110W / AIO < 140W" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง", value: "98.53 × 57.35 × 5.19 cm" },
        { label: "ขนาดกล่อง", value: "108.5 × 67.9 × 14 cm" },
        { label: "น้ำหนักสุทธิ", value: "17.6 kg" },
        { label: "น้ำหนักรวม", value: "25 kg" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 FHD (4K opt.)",
      brightness: "250-300 cd/m²",
      contrast: "1200:1",
      touch: "PCAP 10pt",
      os: "Monitor / Windows / Linux / Android (เลือกได้)",
      formFactor: "Configurable AIO",
      dimensionCm: "98.5 × 57.4 × 5.2",
      weightKg: "17.6",
      power: "< 140W",
      install: "Wall / Floor / Desk / Embed",
    },
  },
};

export const DISPLAY_43_ORDER: Display43Slug[] = ["hd43"];

export const getDisplay43 = (slug: string): Display32 | undefined =>
  (DISPLAYS_43 as Record<string, Display32>)[slug];

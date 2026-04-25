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

// HR43 — ภาพต้นฉบับจาก touchwo.com (3 variants: Monitor / x86 / Android)
import hr43Mon1 from "@/assets/touchwo/hr43/mon-1.jpg";
import hr43Mon2 from "@/assets/touchwo/hr43/mon-2.jpg";
import hr43Mon3 from "@/assets/touchwo/hr43/mon-3.jpg";
import hr43Mon4 from "@/assets/touchwo/hr43/mon-4.jpg";
import hr43Mon5 from "@/assets/touchwo/hr43/mon-5.jpg";
import hr43Mon6 from "@/assets/touchwo/hr43/mon-6.jpg";
import hr43Mon7 from "@/assets/touchwo/hr43/mon-7.jpg";
import hr43X861 from "@/assets/touchwo/hr43/x86-1.jpg";
import hr43X862 from "@/assets/touchwo/hr43/x86-2.jpg";
import hr43Arm1 from "@/assets/touchwo/hr43/arm-1.jpg";
import hr43Arm2 from "@/assets/touchwo/hr43/arm-2.jpg";

// KD43B — Floor-Stand Touch Kiosk (ภาพต้นฉบับจาก touchwo.com)
import kd43Mon1 from "@/assets/touchwo/kd43b/mon-1.jpg";
import kd43Mon2 from "@/assets/touchwo/kd43b/mon-2.jpg";
import kd43Mon3 from "@/assets/touchwo/kd43b/mon-3.jpg";
import kd43Mon4 from "@/assets/touchwo/kd43b/mon-4.jpg";
import kd43Mon5 from "@/assets/touchwo/kd43b/mon-5.jpg";
import kd43Mon6 from "@/assets/touchwo/kd43b/mon-6.jpg";
import kd43Mon7 from "@/assets/touchwo/kd43b/mon-7.jpg";
import kd43Arm1 from "@/assets/touchwo/kd43b/arm-1.jpg";
import kd43Arm2 from "@/assets/touchwo/kd43b/arm-2.jpg";
import kd43X861 from "@/assets/touchwo/kd43b/x86-1.jpg";
import kd43X862 from "@/assets/touchwo/kd43b/x86-2.jpg";

// Use-case lifestyle scenes
import hd43UcRestaurant from "@/assets/touchwo/usecases/hd43-uc-restaurant.jpg";
import hd43UcMeeting from "@/assets/touchwo/usecases/hd43-uc-meeting.jpg";
import hd43UcSelforder from "@/assets/touchwo/usecases/hd43-uc-selforder.jpg";
import hd43UcReception from "@/assets/touchwo/usecases/hd43-uc-reception.jpg";

export type Display43Slug = "hd43" | "hr43" | "kd43b";

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
  hr43: {
    slug: "hr43",
    modelCode: "HR43",
    name: '43" HR43 Series — Touch Monitor / Windows PC / Android PC',
    shortName: "HR43 Series",
    category: "Configurable 43\" Industrial Touch Display",
    formFactor: "Configurable AIO",
    tagline: "จอสัมผัส 43\" PCAP รุ่นอุตสาหกรรม IP65 + Mohs 7 — เลือก Configuration ได้ 3 แบบ",
    description:
      "HR43 คือซีรีส์จอสัมผัส PCAP 43 นิ้วระดับอุตสาหกรรม ตัวเครื่อง Aluminum Alloy + Sheet Metal พร้อม Laser-cut Backplate ผิวหน้ากันน้ำ IP65 และกระจกกันระเบิด Mohs class 7 — ตัวเครื่องเดียวกัน เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor เฉพาะจอสัมผัส, (2) Windows/Linux All-in-One PC พร้อม Intel OPS (i3-4th / i5-10th / i7-11th), (3) Android All-in-One PC พร้อม Rockchip ARM (RK3568 / RK3288 / RK3588) ติดตั้ง Android 9/11/12 — รองรับ 7×24H Stable Working พร้อม Industrial-grade Power Supply เหมาะกับ Public Self-service Kiosk, Education, Signage และงานสาธารณะที่ต้องการความทนทานสูง",
    highlights: [
      { icon: "Layers", title: "เลือก Configuration ได้ 3 แบบ", subtitle: "Monitor / Windows / Android" },
      { icon: "ShieldCheck", title: "IP65 + Mohs class 7", subtitle: "กันน้ำ-กันระเบิด รุ่นสาธารณะ" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "<5ms / Anti-glare" },
      { icon: "Award", title: "Aluminum + Laser-cut Backplate", subtitle: "30,000-hr LED Lifetime" },
    ],
    features: [
      "ดีไซน์ Unibody — Aluminum Alloy + Sheet Metal โครงสร้างแข็งแรง",
      "Laser-cut Backplate ผิวเรียบเนี้ยบ ทนการเสียดสีและการกัดกร่อน",
      "Surface IP65 Waterproof — กันน้ำ-ฝุ่นบริเวณหน้าจอ",
      "Mohs class 7 explosion-proof glass — กระจกกันระเบิด",
      "Industrial-grade Power Supply — รองรับ 7×24H Stable Working",
      "Plug-and-play พร้อม Auto-power Management",
      "ติดตั้งได้ทั้ง Wall mount / Floor stand / Mobile stand",
      "30,000-hour extended life LCD display",
    ],
    useCases: ["Public Self-service Kiosk", "Education", "Signage / Wayfinding", "Industrial HMI"],
    useCaseScenarios: [
      { image: hd43UcSelforder,   title: "Public Self-service Kiosk",  description: "ตู้บริการตนเองในพื้นที่สาธารณะ — โครงสร้าง Aluminum + IP65 + Mohs 7 ทนต่อการใช้งานหนัก ป้องกันการสัมผัสด้วยของแข็ง/ของมีคม เหมาะกับสนามบิน โรงพยาบาล และศาลากลาง" },
      { image: hd43UcReception,   title: "Education / Smart Classroom", description: "จอสัมผัสในห้องเรียนสมาร์ทคลาสรูม รองรับ Multi-touch 10 จุด สำหรับงานกลุ่ม Anti-glare ใช้งานต่อเนื่องได้ทั้งวันโดยไม่ปวดตา" },
      { image: hd43UcRestaurant,  title: "Outdoor-readable Signage",   description: "ป้ายดิจิทัลในพื้นที่กึ่งกลางแจ้ง ความสว่าง 300 nit + Anti-glare มองเห็นชัดแม้แสงสว่างจ้า เปิด 24/7 ด้วย Industrial-grade Power Supply" },
      { image: hd43UcMeeting,     title: "Industrial HMI / Control Room", description: "หน้าจอควบคุมเครื่องจักรในโรงงาน — โครงสร้างกันการกระแทกและฝุ่น รองรับการสวมถุงมือสัมผัสได้ (PCAP 10pt) ทำงานในอุณหภูมิ 0-50°C" },
    ],
    gallery: [
      hr43Mon1, hr43Mon2, hr43X861, hr43X862, hr43Arm1, hr43Arm2,
      hr43Mon5, hr43Mon6, hr43Mon7,
    ],
    ioImage: hr43Mon6,
    installImages: [hr43Mon3, hr43Mon4, hr43Mon7],
    featureImages: [],
    dimensionDrawings: [],
    osSupport: ["windows", "linux", "android"],
    variants: [
      {
        key: "monitor",
        label: "HR43 — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 43\" PCAP ระดับอุตสาหกรรม — ต่อกับ External PC, Mini PC หรือ Media Player ผ่าน HDMI / DVI / VGA + USB Touch โครงสร้าง Aluminum + IP65 + Mohs 7 เหมาะกับ Public Kiosk, Industrial HMI ที่มี PC อยู่แล้ว",
        bestFor: "ลูกค้ามี PC/Mini PC อยู่แล้ว ต้องการเฉพาะจอสัมผัสรุ่นทนทาน",
        highlights: [
          "Input: HDMI in + DVI + VGA + USB Touch",
          "Brightness 300 cd/m² + Anti-glare",
          "Power Consumption < 90W (ต่ำสุดในซีรีส์)",
          "Plug-and-play กับ Windows / Linux / macOS",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "HR43 — Windows / Linux PC",
        badge: "All-in-One PC (x86 OPS)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 43\" พร้อม Intel OPS ภายใน เลือก CPU ได้ 3 ระดับ — i3-4th Gen (Entry), i5-10th Gen (Mid), i7-11th Gen (High) ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน รองรับซอฟต์แวร์ POS / ERP / Industrial HMI / Signage Player",
        bestFor: "Public Kiosk / Industrial HMI ที่ใช้ซอฟต์แวร์ Windows-based",
        highlights: [
          "Intel OPS i3-4th / i5-10th / i7-11th (เลือกได้)",
          "Kingston RAM 4 / 8 / 16 GB + Seagate 128 / 256 / 512 GB",
          "Pre-install Windows 10 / 11 / Linux",
          "Gigabit RJ45 + Wi-Fi 802.11ac + ALC269 HD Audio",
        ],
        cpu: "Intel OPS i3-4th / i5-10th / i7-11th",
        ram: "4 / 8 / 16 GB",
        storage: "Seagate 128 / 256 / 512 GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "HR43 — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 43\" พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 / RK3288 / RK3588 ติดตั้ง Android 11 / 9 / 12 จากโรงงาน เหมาะกับ Self-service Kiosk และ Digital Signage ที่ต้องการความเสถียรและประหยัดพลังงาน (<95W)",
        bestFor: "Public Self-service Kiosk / Digital Signage ที่ใช้ Android App",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2GB (4GB opt) / 2GB / 4GB (8GB opt)",
          "eMMC 16GB (32GB opt) / 16GB / 64-128GB",
          "Pre-install Android 11 / 9 / 12 + 802.11ac Wi-Fi",
        ],
        cpu: "Rockchip RK3568 / 3288 / 3588",
        ram: "2–8GB",
        storage: "eMMC 16–128GB",
        accent: "secondary",
      },
    ],
    cpuOptions: [
      {
        tier: "Entry",
        cpu: "Intel® Core™ i3 (4th Gen, OPS)",
        gpu: "Intel® HD Graphics 4600",
        ram: "Kingston DDR-4GB",
        storage: "Seagate 128GB",
        targetUseCase: "Digital Signage / ตู้บริการตัวเองงานเบา",
      },
      {
        tier: "Mid",
        cpu: "Intel® Core™ i5 (10th Gen, OPS)",
        gpu: "Intel® UHD Graphics 630",
        ram: "Kingston DDR-8GB",
        storage: "Seagate 256GB",
        targetUseCase: "Public Kiosk, POS Self-order, Smart Classroom",
      },
      {
        tier: "High",
        cpu: "Intel® Core™ i7 (11th Gen, OPS)",
        gpu: "Intel® Iris® Xe Graphics",
        ram: "Kingston DDR-16GB",
        storage: "Seagate 512GB",
        targetUseCase: "Industrial HMI / AI Vision / Multi-tasking Workstation",
      },
    ],
    datasheetUrl: "https://touchwo.com/wp-content/uploads/2024/11/HR43-X86-TouchWo-SpecSheet.pdf",
    ports: [
      "Power Button × 1", "DC12V × 1", "HDMI out × 1", "Audio × 1",
      "RJ45 × 1", "TF/SD × 1", "USB × 2-4", "VGA × 1", "Wi-Fi Antenna × 1",
    ],
    specs: [
      { title: "PC System (Windows / Linux x86 — OPS)", rows: [
        { label: "CPU (เลือกได้)", value: "OPS i3-4th Gen / i5-10th Gen / i7-11th Gen" },
        { label: "Graphic GPU", value: "Intel HD 4600 / UHD 630 / Iris Xe" },
        { label: "Audio", value: "HD Audio: ALC269" },
        { label: "หน่วยความจำ (RAM)", value: "Kingston 4GB / 8GB / 16GB" },
        { label: "หน่วยเก็บข้อมูล", value: "Seagate 128GB / 256GB / 512GB" },
        { label: "เครือข่าย", value: "10/100/1000M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Windows 10 / 11 / Linux (เลือกได้)" },
      ]},
      { title: "Android System (ARM)", rows: [
        { label: "CPU (เลือกได้)", value: "Rockchip RK3568 / RK3288 / RK3588" },
        { label: "Graphic GPU", value: "ARM G52 2EE / Mali-T864 / Mali-G610" },
        { label: "หน่วยความจำ (RAM)", value: "2GB (4GB opt) / 2GB / 4GB (8GB opt)" },
        { label: "หน่วยเก็บข้อมูล", value: "eMMC 16GB (32GB opt) / 16GB / 64-128GB" },
        { label: "เครือข่าย", value: "10/100M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Android 11 / Android 9 / Android 12" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "43 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "943 × 531 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "300 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "1400 : 1" },
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
        { label: "ผิวหน้า", value: "Mohs class 7 explosion-proof glass + IP65" },
      ]},
      { title: "Operation Environment", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "ความชื้นทำงาน", value: "10% - 80%" },
        { label: "อุณหภูมิเก็บรักษา", value: "-5°C - 60°C" },
        { label: "ความชื้นเก็บรักษา", value: "10% - 85%" },
      ]},
      { title: "Power Supply", rows: [
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 5A" },
        { label: "Standby Power", value: "≤ 0.5W" },
        { label: "Overall Power", value: "Monitor < 90W / Android < 95W / x86 < 120W" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง", value: "99.5 × 58.3 × 6 cm" },
        { label: "ขนาดกล่อง", value: "109.5 × 69 × 14.5 cm" },
        { label: "น้ำหนักสุทธิ", value: "21.4 kg" },
        { label: "น้ำหนักรวม", value: "27.5 kg" },
      ]},
      { title: "Included in the Delivery", rows: [
        { label: "Manual / คู่มือ", value: "× 1" },
        { label: "Wall Mount Bracket", value: "× 1" },
        { label: "Wi-Fi Antenna", value: "× 1 (รุ่น AIO)" },
        { label: "USB & HDMI Cable", value: "× 1 (รุ่น Monitor)" },
        { label: "Power Cable", value: "× 1" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 FHD",
      brightness: "300 cd/m²",
      contrast: "1400:1",
      touch: "PCAP 10pt + Mohs 7",
      os: "Monitor / Windows / Linux / Android (เลือกได้)",
      formFactor: "Configurable AIO (Industrial)",
      dimensionCm: "99.5 × 58.3 × 6",
      weightKg: "21.4",
      power: "< 120W",
      install: "Wall / Floor / Mobile Stand",
    },
  },
};

export const DISPLAY_43_ORDER: Display43Slug[] = ["hd43", "hr43"];

export const getDisplay43 = (slug: string): Display32 | undefined =>
  (DISPLAYS_43 as Record<string, Display32>)[slug];

/**
 * Touch Display 27" — Configurable AIO + Wall-Mount Kiosk
 * แหล่งสเปก: touchwo.com (HD27 Series + GD27C Wall-Mount Kiosk)
 *  - HD27 Touch Monitor:  https://touchwo.com/product/27-touch-monitor-hd27/
 *  - HD27 Windows PC:     https://touchwo.com/product/27-touch-pc-hd27/
 *  - HD27 Android PC:     https://touchwo.com/product/27-android-touch-pc-hd27/
 *  - GD27C Wall Kiosk:    https://touchwo.com/product/27-wall-mounting-touch-kioskarm/
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";

// HD27 — ใช้ตัวเครื่องเดียวกันทั้ง 3 variants (Monitor/x86/Android)
import hd27Mon1 from "@/assets/touchwo/hd27/mon-1.jpg";
import hd27Mon2 from "@/assets/touchwo/hd27/mon-2.jpg";
import hd27Mon3 from "@/assets/touchwo/hd27/mon-3.jpg";
import hd27Mon4 from "@/assets/touchwo/hd27/mon-4.jpg";
import hd27Mon5 from "@/assets/touchwo/hd27/mon-5.jpg";
import hd27Mon6 from "@/assets/touchwo/hd27/mon-6.jpg";
import hd27Mon7 from "@/assets/touchwo/hd27/mon-7.jpg";
import hd27X861 from "@/assets/touchwo/hd27/x86-1.jpg";
import hd27X862 from "@/assets/touchwo/hd27/x86-2.png";
import hd27Arm1 from "@/assets/touchwo/hd27/arm-1.jpg";
import hd27Install1 from "@/assets/touchwo/hd27/install-1.jpg";
import hd27Install2 from "@/assets/touchwo/hd27/install-2.jpg";
import hd27Install3 from "@/assets/touchwo/hd27/install-3.jpg";
import hd27DimFront from "@/assets/touchwo/hd27/dim-front.png";
import hd27DimBack from "@/assets/touchwo/hd27/dim-back.png";
import hd27DimSides from "@/assets/touchwo/hd27/dim-sides.png";

// Use Case scenes — รูปการใช้งานจริง
import hd27UcPos from "@/assets/touchwo/usecases/hd27-uc-pos.jpg";
import hd27UcMeeting from "@/assets/touchwo/usecases/hd27-uc-meeting.jpg";
import hd27UcHealthcare from "@/assets/touchwo/usecases/hd27-uc-healthcare.jpg";
import hd27UcEducation from "@/assets/touchwo/usecases/hd27-uc-education.jpg";
import gd27UcRetail from "@/assets/touchwo/usecases/gd27c-uc-retail.jpg";
import gd27UcHealthcare from "@/assets/touchwo/usecases/gd27c-uc-healthcare.jpg";
import gd27UcBank from "@/assets/touchwo/usecases/gd27c-uc-bank.jpg";
import gd27UcWayfinding from "@/assets/touchwo/usecases/gd27c-uc-wayfinding.jpg";

// GD27C — Wall-Mounting Touch Kiosk (Portrait)
import gd27P1 from "@/assets/touchwo/gd27c/p-1.jpg";
import gd27P2 from "@/assets/touchwo/gd27c/p-2.jpg";
import gd27P3 from "@/assets/touchwo/gd27c/p-3.jpg";
import gd27P4 from "@/assets/touchwo/gd27c/p-4.jpg";
import gd27P5 from "@/assets/touchwo/gd27c/p-5.jpg";
import gd27P6 from "@/assets/touchwo/gd27c/p-6.jpg";
import gd27P7 from "@/assets/touchwo/gd27c/p-7.jpg";
import gd27Scene1 from "@/assets/touchwo/gd27c/scene-1.jpg";
import gd27Scene2 from "@/assets/touchwo/gd27c/scene-2.jpg";
import gd27Install1 from "@/assets/touchwo/gd27c/install-1.jpg";
import gd27Install2 from "@/assets/touchwo/gd27c/install-2.jpg";
import gd27Install3 from "@/assets/touchwo/gd27c/install-3.jpg";
import gd27DimFront from "@/assets/touchwo/gd27c/dim-front.png";
import gd27DimBack from "@/assets/touchwo/gd27c/dim-back.png";

export type Display27Slug = "hd27" | "gd27c";

export { OS_BACKGROUNDS };
export type { OSKey };

export const DISPLAYS_27: Record<Display27Slug, Display32> = {
  hd27: {
    slug: "hd27",
    modelCode: "HD27",
    name: '27" HD27 Series — Touch Monitor / Windows PC / Android PC',
    shortName: "HD27 Series",
    category: "Configurable 27\" Touch Display",
    formFactor: "Configurable AIO",
    tagline: "หน้าจอสัมผัส 27\" PCAP — เลือก Configuration ได้ 3 แบบ: Touch Monitor / Windows / Android",
    description:
      "HD27 คือซีรีส์จอสัมผัส PCAP 27 นิ้ว FHD 1920×1080 ตัวเครื่องเดียวกัน — เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor เฉพาะจอสัมผัสที่ต่อกับ PC ภายนอก, (2) Windows/Linux All-in-One PC พร้อม Intel x86 (Celeron J6412 / Core i5-8th / Core i7-10th), (3) Android All-in-One PC พร้อม Rockchip ARM (RK3568 / RK3288 / RK3588) ติดตั้ง Android 9/11/12 รองรับ Square POS / Stripe POS / Clover POS / Shopify POS — ขนาดเครื่อง 63.55×37.9×4.04 cm น้ำหนัก 6.5 kg เหมาะกับ Self-order Kiosk, POS, Conference, Education, Healthcare, Parcel Locker",
    highlights: [
      { icon: "Layers", title: "เลือก Configuration ได้ 3 แบบ", subtitle: "Monitor / Windows / Android" },
      { icon: "Maximize", title: "FHD 1920×1080", subtitle: "16:9 ความสว่าง 250-300 cd/m²" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs class 7 glass" },
      { icon: "ShieldCheck", title: "Industrial 7×24H", subtitle: "30,000-hr LED Backlight" },
    ],
    features: [
      "PCAP 10-point Touch — เวลาตอบสนอง < 5ms / ความแม่นยำ 4096×4096",
      "Mohs class 7 explosion-proof glass — กระจกกันระเบิด",
      "Pre-install Windows 10/11 / Linux / Android 9/11/12",
      "รองรับ Square POS / Stripe POS / Clover POS / Shopify POS",
      "5GHz Wi-Fi 802.11ac (รุ่น Android/x86)",
      "Industrial-grade Power Supply — 7×24H Stable Working",
      "ขอบจอบาง — ติดตั้งได้ Wall mount / Desktop / Floor Stand",
      "30,000-hour Extended-life LED Backlight",
    ],
    useCases: ["POS Self-order", "Conference / Meeting Room", "Healthcare", "Education / Lab"],
    useCaseScenarios: [
      { image: hd27UcPos,        title: "QSR / Self-order Counter",         description: "ตั้งบนเคาน์เตอร์ร้าน QSR / Cafe ขนาด 27\" PCAP 10-point ตอบสนองไว ลูกค้าสั่งและจ่ายเองได้ ลดคิวที่เคาน์เตอร์ เพิ่ม upsell เฉลี่ย 20-30% ผ่านเมนูภาพคมชัด FHD" },
      { image: hd27UcMeeting,    title: "Conference / Meeting Room",        description: "จอสัมผัสในห้องประชุม 4-8 คน รองรับ Video Conference, Interactive Whiteboard, BYOD ผ่าน HDMI/USB เพิ่มประสิทธิภาพการประชุมแบบ Hybrid" },
      { image: hd27UcHealthcare, title: "Healthcare / Clinical Workstation", description: "ติดตั้งบน Articulating Arm ที่ Nurse Station หรือห้องตรวจ — แสดง EMR / Patient Records / Diagnostic Imaging กระจก Mohs 7 ทำความสะอาดง่าย ทนน้ำยาฆ่าเชื้อ" },
      { image: hd27UcEducation,  title: "Education / Computer Lab",         description: "ห้องปฏิบัติการคอมพิวเตอร์ — All-in-One 27\" ลดสายและประหยัดพื้นที่บนโต๊ะ รองรับ Active Learning และ Touch UI สำหรับวิชา STEM / Design" },
    ],
    gallery: [
      hd27Mon1, hd27Mon2, hd27X861, hd27X862, hd27Arm1,
      hd27Mon5, hd27Mon7,
    ],
    ioImage: hd27Mon6,
    installImages: [hd27Install1, hd27Install2, hd27Install3],
    featureImages: [],
    dimensionDrawings: [
      {
        image: hd27DimFront,
        title: "Mechanical Dimension — Front, Side & Top View",
        caption: "แบบทางวิศวกรรม HD27 — ขนาดเครื่อง 635.5 × 379 × 40.4 mm จอภาพแสดงผล 599 × 337.5 mm (27\" diagonal) ขอบจอบาง 18.25–20.75 mm รัศมีมุม R10 มีช่องระบายอากาศด้านข้างซ้าย-ขวา และแถบ I/O บริเวณกึ่งกลางขอบล่าง",
        callouts: [
          { label: "ขนาดเครื่อง", value: "635.5 × 379 × 40.4 mm" },
          { label: "พื้นที่แสดงผล", value: "599 × 337.5 mm (27\")" },
          { label: "ความหนา", value: "40.4 mm (Slim Bezel)" },
          { label: "มุมโค้ง", value: "4-R10" },
        ],
      },
      {
        image: hd27DimBack,
        title: "Back View — VESA Mount Layout",
        caption: "ฝาหลัง HD27 รองรับการยึด VESA pattern 100 × 100 mm (สกรู 4-M4) สำหรับติดตั้งบน Wall Mount, Articulating Arm หรือ Floor Stand — ตำแหน่งจุดยึดอยู่กึ่งกลางตัวเครื่อง (offset 267.3 × 138.45 mm จากขอบ) มีช่องระบายความร้อนแบบ perforated รองรับการทำงานต่อเนื่อง 7×24 ชั่วโมง",
        callouts: [
          { label: "VESA Pattern", value: "100 × 100 mm" },
          { label: "Mount Screw", value: "4-M4" },
          { label: "การระบายความร้อน", value: "Perforated Vent — 7×24H" },
        ],
      },
      {
        image: hd27DimSides,
        title: "Top & Bottom View — I/O Layout",
        caption: "มุมมองด้านบนและด้านล่างของ HD27 — แสดงตำแหน่งพอร์ต I/O ทั้งหมดที่ขอบล่างของตัวเครื่อง (USB / Audio / VGA / HDMI / Power) จัดวางแบบ Recessed เพื่อรองรับการเดินสายแบบซ่อน (Cable Management) เหมาะกับงาน Wall-mount ที่ต้องการความเรียบร้อยของหน้าตัด",
        callouts: [
          { label: "ตำแหน่ง I/O", value: "Bottom Edge — Recessed" },
          { label: "พอร์ตหลัก", value: "HDMI / VGA / USB / Audio / DC12V" },
          { label: "Cable Management", value: "รองรับการเดินสายซ่อน" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: [
      {
        key: "monitor",
        label: "HD27 — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 27\" PCAP ล้วน ๆ — ต่อกับ External PC, Mini PC หรือ Media Player ผ่าน HDMI + USB Touch (Plug-and-play) ความสว่าง 250 cd/m² Power Consumption < 35W เหมาะกับ Digital Signage, POS, Reception ที่มี PC อยู่แล้ว",
        bestFor: "ลูกค้ามี PC/Mini PC อยู่แล้ว ต้องการเฉพาะจอสัมผัส 27\"",
        highlights: [
          "ไม่มี PC ในตัว — ต้นทุนต่ำกว่า ปรับเปลี่ยน PC ภายนอกได้",
          "Input: HDMI + USB Touch + VGA + Audio in/out",
          "Brightness 250 cd/m² / 60 Hz / 16.7M colors",
          "Power Consumption ต่ำสุด < 35W",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "HD27 — Windows / Linux PC",
        badge: "All-in-One PC (x86)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 27\" พร้อม Intel x86 ภายใน เลือก CPU ได้ 3 ระดับ — Celeron J6412 (Entry), Core i5-8th Gen (Mid), Core i7-10th Gen (High) ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน รองรับซอฟต์แวร์ POS / ERP / Industrial HMI / Conference",
        bestFor: "Enterprise / POS / Conference ที่ใช้ซอฟต์แวร์ Windows-based",
        highlights: [
          "Intel Celeron J6412 / Core i5-8th / Core i7-10th",
          "RAM DDR4-2666 SODIMM 4 / 8 / 16 GB",
          "Storage mSATA 128 / 256 / 512 GB",
          "RJ45 Gigabit + Wi-Fi 802.11a/b/g/n/ac",
        ],
        cpu: "Intel Celeron J6412 / i5-8th / i7-10th",
        ram: "4–16GB DDR4",
        storage: "mSATA 128–512GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "HD27 — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 27\" พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) รองรับ Square / Stripe / Clover / Shopify POS โดยตรง พร้อม Wi-Fi 802.11ac ความสว่างจอ 300 cd/m² (สูงกว่ารุ่น Monitor/x86)",
        bestFor: "POS Self-order / Digital Signage / POS ที่ใช้ Android App",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2–8GB + eMMC 16–128GB",
          "Pre-install Android 11 / Android 9 / Android 12",
          "Brightness 300 cd/m² (สูงกว่ารุ่น Monitor 250)",
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
        targetUseCase: "Digital Signage, POS, Self-service Kiosk งานทั่วไป",
      },
      {
        tier: "Mid",
        cpu: "Intel® Core™ i5 8th Gen",
        gpu: "Intel® Iris® Plus Graphics 645",
        ram: "DDR4-2666 SODIMM 8GB",
        storage: "mSATA SSD 256GB",
        targetUseCase: "Conference Room, POS Self-order, ERP / CRM Front-end",
      },
      {
        tier: "High",
        cpu: "Intel® Core™ i7 10th Gen",
        gpu: "Intel® UHD Graphics",
        ram: "DDR4-2666 SODIMM 16GB",
        storage: "mSATA SSD 512GB",
        targetUseCase: "Industrial HMI, Multi-tasking Workstation, Healthcare",
      },
      {
        tier: "Entry",
        cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)",
        gpu: "ARM Mali-G52 2EE",
        ram: "LPDDR4 2GB (4GB optional)",
        storage: "eMMC 32GB",
        targetUseCase: "POS Self-order (Android), Digital Signage, Wayfinding",
      },
      {
        tier: "Mid",
        cpu: "Rockchip RK3288 (Quad-core ARM Cortex-A17)",
        gpu: "Mali-T864",
        ram: "LPDDR3 2GB (4GB optional)",
        storage: "eMMC 16GB (32GB optional)",
        targetUseCase: "Pre-install Android 9 — งาน Legacy POS App ที่ต้องการ Android 9",
      },
      {
        tier: "High",
        cpu: "Rockchip RK3588 (Octa-core, 8nm)",
        gpu: "ARM Mali-G610 MP4",
        ram: "LPDDR4 4GB (8GB optional)",
        storage: "eMMC 64GB (128GB optional)",
        targetUseCase: "AI Vision, Multi-app POS, 4K Multimedia, Smart Retail",
      },
    ],
    datasheetUrl: "https://touchwo.com/product/27-touch-monitor-hd27/",
    ports: [
      "Audio in/out × 1", "USB × 1 (Monitor) / USB × 2 (Android)",
      "VGA × 1 (Monitor/x86)", "HDMI in/out × 1", "RJ45 × 1 (PC)",
      "TF Slot × 1 (Android)", "Power Socket × 1",
    ],
    specs: [
      { title: "PC System (Windows / Linux x86)", rows: [
        { label: "CPU (เลือกได้)", value: "Intel Celeron® J6412 / Core™ i5-8th Gen / Core™ i7-10th Gen" },
        { label: "Graphic GPU", value: "Intel UHD / Iris Plus 645 / UHD" },
        { label: "Audio", value: "HD Audio: ALC269" },
        { label: "หน่วยความจำ (RAM)", value: "DDR4-2666 SODIMM 4 / 8 / 16 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "mSATA SSD 128 / 256 / 512 GB" },
        { label: "เครือข่าย", value: "10/100/1000M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Windows 10 / 11 / Linux (เลือกได้)" },
      ]},
      { title: "Android System (ARM)", rows: [
        { label: "CPU (เลือกได้)", value: "Rockchip RK3568 / RK3288 / RK3588" },
        { label: "Graphic GPU", value: "ARM G52 2EE / Mali-T864 / Mali-G610" },
        { label: "หน่วยความจำ (RAM)", value: "RK3568 2GB (4GB opt) / RK3288 2GB (4GB opt) / RK3588 4GB (8GB opt)" },
        { label: "หน่วยเก็บข้อมูล", value: "RK3568 32GB eMMC / RK3288 16GB (32GB opt) / RK3588 64GB (128GB opt)" },
        { label: "เครือข่าย", value: "10/100M RJ45 (RK3568) หรือ 100/1000M RJ45 (RK3288/RK3588) + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Android 11 (RK3568) / Android 9 (RK3288) / Android 12 (RK3588)" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "27 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "599 × 337.5 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "250 cd/m² (Monitor/x86) / 300 cd/m² (Android)" },
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
      { title: "Operation Environment", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "ความชื้นทำงาน", value: "0% - 90%" },
        { label: "อุณหภูมิเก็บรักษา", value: "0°C - 60°C" },
        { label: "ความชื้นเก็บรักษา", value: "0% - 65%" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง (W×H×T)", value: "63.55 × 37.9 × 4.04 cm" },
        { label: "ขนาดกล่อง (W×H×T)", value: "79 × 54.5 × 18.5 cm" },
        { label: "น้ำหนักสุทธิ", value: "6.5 kg" },
        { label: "น้ำหนักรวม", value: "10.34 kg" },
      ]},
      { title: "Power Supply", rows: [
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 7A" },
        { label: "Standby Power", value: "≤ 0.5W" },
        { label: "Overall Power", value: "Monitor < 35W / Android < 45W" },
      ]},
      { title: "External Connectors", rows: [
        { label: "Monitor", value: "Audio in/out × 1, USB × 1, VGA × 1, HDMI in × 1, Power Socket × 1" },
        { label: "Windows/Linux PC", value: "+ RJ45, USB เพิ่ม, ตามรุ่น CPU" },
        { label: "Android PC", value: "RJ45 × 1, USB × 2, TF Slot × 1, HDMI out × 1, Audio in/out × 1, Power Socket × 1" },
      ]},
      { title: "Included in the Delivery", rows: [
        { label: "Manual / คู่มือ", value: "× 1" },
        { label: "Wall mount bracket", value: "× 1" },
        { label: "USB & HDMI cable (Monitor)", value: "× 1" },
        { label: "Wi-Fi Antenna (Android)", value: "× 1" },
        { label: "Power Adapter & cable", value: "× 1" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 FHD",
      brightness: "250-300 cd/m²",
      contrast: "1000:1",
      touch: "PCAP 10pt + Mohs 7",
      os: "Monitor / Windows / Linux / Android",
      formFactor: "Configurable AIO 27\"",
      dimensionCm: "63.55 × 37.9 × 4.04",
      weightKg: "6.5",
      power: "< 45W",
      install: "Wall / Desktop / Floor Stand",
    },
  },

  gd27c: {
    slug: "gd27c",
    modelCode: "GD27C",
    name: '27" GD27C Series — Wall Mounting Touch Kiosk',
    shortName: "GD27C (Wall Kiosk)",
    category: "Wall-Mounting 27\" Touch Kiosk",
    formFactor: "Wall Kiosk",
    tagline: "ตู้คีออสก์แขวนผนัง 27\" PCAP — Square POS Ready / Android 11–12 / Mohs 7",
    description:
      "GD27C คือตู้คีออสก์แขวนผนังขนาด 27 นิ้ว PCAP 10-point Touch ดีไซน์ Ultra-thin Bezel สไตล์ iPad-like พร้อม Industrial-grade Power Supply รองรับ 7×24H Stable Working — เลือก Configuration ได้: (1) Android (ARM) ติดตั้ง Android 11/12 พร้อม Rockchip RK3568 (cost-effective) หรือ RK3588 (high-performance) รองรับ Square / Stripe / Clover / Shopify POS โดยตรง, (2) Windows/Linux (x86) Optional — ติดตั้งได้ทั้งแขวนผนัง วางโต๊ะ หรือยึดพื้น เหมาะกับงาน POS / Self-order / Healthcare / Education / Public Self-service",
    highlights: [
      { icon: "Maximize", title: "ขอบจอบาง iPad-like", subtitle: "Ultra-thin Bezel สไตล์ Wall Kiosk" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs class 7 glass" },
      { icon: "Smartphone", title: "Square POS Ready", subtitle: "Android 11/12 + Wi-Fi 5GHz" },
      { icon: "ShieldCheck", title: "ทำงาน 24/7", subtitle: "Industrial Power Supply" },
    ],
    features: [
      "ขอบจอบาง — Ultra-thin Bezel สไตล์ iPad-like",
      "Industrial-grade Power Supply — รองรับ 7×24H Stable Working",
      "30,000-hour Extended-life LED Backlight",
      "PCAP 10-point Touch + Mohs class 7 explosion-proof glass",
      "Pre-install Android 11/12 — รองรับ Square / Stripe / Clover / Shopify POS",
      "Rockchip ARM — เลือก RK3568 (cost-effective) หรือ RK3588 (high-performance)",
      "5GHz Wi-Fi + BLE — เชื่อม POS / Printer ได้เสถียร",
      "ติดตั้งได้: Wall-mount / Desktop / Floor (Optional)",
    ],
    useCases: ["Retail POS / Self-order", "Healthcare Check-in", "Self-service Banking", "Mall Wayfinding"],
    useCaseScenarios: [
      { image: gd27UcRetail,      title: "Retail / Self-order Kiosk",          description: "ตู้คีออสก์แขวนผนังในร้านค้าปลีก / Showroom — ลูกค้าค้นหาสินค้า ดูสต็อก สั่งซื้อหรือเรียกพนักงานได้เอง รองรับ Square / Stripe / Clover / Shopify POS" },
      { image: gd27UcHealthcare,  title: "Healthcare / Self Check-in",         description: "จุดลงทะเบียนผู้ป่วยในล็อบบี้โรงพยาบาล — สแกนบัตร/QR กรอกอาการ และรับบัตรคิวอัตโนมัติ ลดเวลารอและภาระเจ้าหน้าที่ Front desk" },
      { image: gd27UcBank,        title: "Banking / Self-service Branch",       description: "สาขาธนาคารแบบ Digital — ทำธุรกรรมพื้นฐาน เปิดบัญชี รับบัตรคิว หรือปรึกษาเจ้าหน้าที่ผ่าน Video Banking ทรงสูงเทียบสายตา ใช้งานง่ายแบบ Stand-up" },
      { image: gd27UcWayfinding,  title: "Mall / Public Wayfinding",            description: "ป้ายนำทางในห้างสรรพสินค้า / สนามบิน / โรงพยาบาล — แสดงแผนที่อาคาร ค้นหาร้านค้า และเส้นทางเดินอย่างละเอียด รองรับ Multi-touch 10 จุดพร้อมกันหลายคน" },
    ],
    gallery: [gd27P1, gd27P2, gd27P3, gd27P4, gd27P5, gd27P6, gd27P7],
    ioImage: gd27DimFront,
    installImages: [gd27Install1, gd27Install2, gd27Install3],
    featureImages: [gd27Scene1, gd27Scene2],
    dimensionDrawings: [
      {
        image: gd27DimFront,
        title: "Mechanical Dimension — Front, Side & Top View",
        caption: "แบบทางวิศวกรรมตัวเครื่องคีออสก์แขวนผนัง 27\" GD27C — ขนาดภายนอก 413 × 867 mm พื้นที่แสดงผล Active Area 337.5 × 599 mm (จอ 27 นิ้ว 16:9), ความหนาตัวเครื่อง 52–75 mm พร้อม Bezel บางเพียง 16 mm รอบทุกด้าน ส่วนล่างเตรียมช่อง Built-in สำหรับเครื่องพิมพ์ใบเสร็จ (Receipt Printer), เครื่องสแกน QR Code 2D และจุดแสดงสถานะ ส่วนบนรองรับ Webcam + Microphone ด้านข้างมีปุ่ม PC Power Switch และเสาอากาศ Wi-Fi เหมาะสำหรับงาน Self-order, Self-checkout และ Self-service Banking ที่ต้องวางแผนช่องเปิดในผนัง/เคาน์เตอร์ก่อนติดตั้ง",
        callouts: [
          { label: "ขนาดเครื่อง (W × H)", value: "413 × 867 mm" },
          { label: "Active Area", value: "337.5 × 599 mm (27\")" },
          { label: "ความหนา (Depth)", value: "52 – 75 mm" },
          { label: "Bezel", value: "16 mm รอบทุกด้าน" },
          { label: "Built-in I/O", value: "Receipt Printer + QR Scanner + Webcam + Wi-Fi" },
        ],
      },
      {
        image: gd27DimBack,
        title: "Back View — VESA Mount Layout",
        caption: "แบบด้านหลังแสดงจุดยึดมาตรฐาน VESA 200 × 200 mm (สกรู 4-M8) — ออกแบบเฉพาะสำหรับ Wall Mount แบบฝังเรียบกับผนัง พร้อมช่องระบายอากาศ (Heat Vent) แนวยาวเพื่อรองรับการทำงานต่อเนื่อง 7×24H ระยะจากขอบบนถึงรู VESA ด้านบน 363.5 mm และระยะระหว่างรู VESA แนวตั้ง 200 mm ใช้สำหรับเลือก Wall Bracket / Floor Stand / Counter Stand ที่รองรับ VESA 200×200 และวางตำแหน่งช่องเดินสายไฟ/สาย LAN ก่อนหน้างานจริง",
        callouts: [
          { label: "VESA Pattern", value: "200 × 200 mm" },
          { label: "สกรูยึด", value: "4 × M8" },
          { label: "ระยะจาก Top", value: "363.5 mm" },
          { label: "ระยะระหว่างรู VESA", value: "200 mm (แนวตั้ง)" },
          { label: "การระบายความร้อน", value: "Heat Vent ทั้งด้านหลัง — รองรับ 7×24H" },
        ],
      },
    ],
    osSupport: ["android", "windows", "linux"],
    variants: [
      {
        key: "android",
        label: "Android (ARM) — Pre-installed",
        badge: "All-in-One — Rockchip RK3568 / RK3588",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One จอ 27\" PCAP พร้อม Rockchip ARM ภายใน — ติดตั้ง Android 11/12 จากโรงงาน เลือก CPU ได้ระหว่าง RK3568 (cost-effective) หรือ RK3588 (high-performance) รองรับ Square / Stripe / Clover / Shopify POS พร้อม 5GHz Wi-Fi + BLE",
        bestFor: "Retail POS / Self-order Kiosk / Healthcare / Public Self-service ที่ใช้ Android App",
        highlights: [
          "Rockchip RK3568 หรือ RK3588 (เลือกได้)",
          "Pre-install Android 11 / 12",
          "5GHz Wi-Fi + BLE — รองรับ POS โดยตรง",
          "Power Consumption Android < 36W",
        ],
        cpu: "Rockchip RK3568 / RK3588",
        ram: "2–8GB LPDDR4",
        storage: "eMMC 16–128GB",
        accent: "secondary",
      },
      {
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
      },
    ],
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
    datasheetUrl: "https://touchwo.com/product/27-wall-mounting-touch-kioskarm/",
    ports: [
      "RJ45 × 1", "USB × 2", "HDMI in × 1", "Audio out × 1",
      "Power Socket × 1", "Wi-Fi Antenna × 1",
    ],
    specs: [
      { title: "Android System (ARM)", rows: [
        { label: "CPU (เลือกได้)", value: "Rockchip RK3568 / RK3588" },
        { label: "Graphic GPU", value: "ARM Mali-G52 2EE / Mali-G610 MP4" },
        { label: "หน่วยความจำ (RAM)", value: "LPDDR4 2 / 4 / 8 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "eMMC 16 / 32 / 64 / 128 GB" },
        { label: "เครือข่าย", value: "RJ45 + 5GHz Wi-Fi 802.11ac + BLE" },
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
        { label: "ขนาดหน้าจอ", value: "27 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "599 × 337.5 mm" },
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
      { title: "Operation Environment", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "ความชื้นทำงาน", value: "10% - 80%" },
        { label: "อุณหภูมิเก็บรักษา", value: "-5°C - 60°C" },
        { label: "ความชื้นเก็บรักษา", value: "10% - 85%" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง (W×L×T)", value: "41.3 × 86.7 × 7.2 cm" },
        { label: "ขนาดกล่อง (W×L×T)", value: "56 × 102 × 22 cm" },
        { label: "น้ำหนักสุทธิ", value: "14 kg" },
        { label: "น้ำหนักรวม", value: "20.5 kg" },
      ]},
      { title: "Power Supply", rows: [
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 4A" },
        { label: "Standby Power", value: "≤ 0.5W" },
        { label: "Overall Power", value: "Android < 36W / x86 < 48W" },
      ]},
      { title: "Included in the Delivery", rows: [
        { label: "Manual / คู่มือ", value: "× 1" },
        { label: "Wi-Fi Antenna", value: "× 1" },
        { label: "Wall mount bracket", value: "× 1" },
        { label: "AC Power cable", value: "× 1" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 FHD",
      brightness: "≥250 cd/m²",
      contrast: "1000:1",
      touch: "PCAP 10pt + Mohs 7",
      os: "Android 11/12 (Windows opt.)",
      formFactor: "Wall-Mount Kiosk 27\"",
      dimensionCm: "41.3 × 86.7 × 7.2",
      weightKg: "14",
      power: "< 48W",
      install: "Wall / Desktop / Floor (opt.)",
    },
  },
};

export const DISPLAY_27_ORDER: Display27Slug[] = ["hd27", "gd27c"];

export const getDisplay27 = (slug: string): Display32 | undefined =>
  (DISPLAYS_27 as Record<string, Display32>)[slug];

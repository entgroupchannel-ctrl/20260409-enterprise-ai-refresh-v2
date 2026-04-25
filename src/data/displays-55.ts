/**
 * Touch Display 55" — HD55 Configurable AIO (Monitor / Windows / Android)
 * แหล่งสเปก: touchwo.com (HD55 Series)
 *  - HD55 Touch Monitor:  https://touchwo.com/product/55-touch-monitor-hd55/
 *  - HD55 Windows PC:     https://touchwo.com/product/55-touch-pc-hd55/
 *  - HD55 Android PC:     https://touchwo.com/product/55-android-touch-pc-hd55/
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";

import hd55P1 from "@/assets/touchwo/hd55/55-1A.jpg";
import hd55P2 from "@/assets/touchwo/hd55/55-2A.jpg";
import hd55P3 from "@/assets/touchwo/hd55/55-3.jpg";
import hd55P4 from "@/assets/touchwo/hd55/55-4.jpg";
import hd55P5 from "@/assets/touchwo/hd55/55-5A-1.jpg";
import hd55P6 from "@/assets/touchwo/hd55/55-6A.jpg";
import hd55P7 from "@/assets/touchwo/hd55/55-7A.jpg";
import hd55Hero from "@/assets/touchwo/hd55/1-7.png";
import hd55Io from "@/assets/touchwo/hd55/1-95.jpg";
import hd55Feat1 from "@/assets/touchwo/hd55/feat-1.png";
import hd55Feat2 from "@/assets/touchwo/hd55/feat-2.png";
import hd55Feat3 from "@/assets/touchwo/hd55/feat-3.png";
import hd55Feat4 from "@/assets/touchwo/hd55/feat-4.png";
import hd55Install1 from "@/assets/touchwo/hd55/install-1.jpg";
import hd55Install2 from "@/assets/touchwo/hd55/install-2.jpg";
import hd55Install3 from "@/assets/touchwo/hd55/install-3.jpg";
import hd55Pos1 from "@/assets/touchwo/hd55/pos-1.jpg";
import hd55Pos2 from "@/assets/touchwo/hd55/pos-2.png";

export type Display55Slug = "hd55";
export { OS_BACKGROUNDS };
export type { OSKey };

export const DISPLAYS_55: Record<Display55Slug, Display32> = {
  hd55: {
    slug: "hd55",
    modelCode: "HD55",
    name: '55" HD55 Series — Touch Monitor / Windows PC / Android PC',
    shortName: "HD55 Series",
    category: "Slim-Bezel 55\" Large-Format Touch Display",
    formFactor: "Configurable AIO",
    tagline: "จอสัมผัส 55\" PCAP FHD (4K Optional) — Ultra-slim 13mm Bezel (iPad-like) — เลือก 3 Configuration: Monitor / Windows / Android",
    description:
      "HD55 คือซีรีส์จอสัมผัสขนาดใหญ่ 55 นิ้ว FHD 1920×1080 (4K Optional) PCAP 10-point ดีไซน์ Ultra-slim 13mm Bezel ลด Black Edge กว่า 53% เมื่อเทียบกับรุ่นทั่วไป ให้ความรู้สึก iPad-like ตัวเครื่องบางเพียง 7.67cm น้ำหนักสุทธิ 30 kg — ผิวหน้ากระจก Mohs class 7 explosion-proof + IP65 waterproof, อายุ Backlight 30,000 ชม. รองรับการใช้งานต่อเนื่อง 3.5 ปี (24/7) อัตราซ่อม 2 ปีต่ำเพียง 1.5% เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor, (2) Windows/Linux All-in-One พร้อม Intel Celeron J6412 / Core i5-8Gen / i7-10Gen, (3) Android All-in-One พร้อม Rockchip RK3568 / RK3288 / RK3588 + Wi-Fi 5GHz + BLE 5.0 — รองรับ Square / Stripe / Clover / Shopify POS",
    highlights: [
      { icon: "Layers", title: "Ultra-slim 13mm Bezel", subtitle: "iPad-like Design / -53% Black Edge" },
      { icon: "Maximize", title: "55\" FHD 1920×1080", subtitle: "4K Optional / 16:9 / 300 cd/m² / 60 Hz" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs 7 + IP65 Surface" },
      { icon: "ShieldCheck", title: "3.5 Years 24/7", subtitle: "Repair Rate 1.5% / 30,000-hr LED" },
    ],
    features: [
      "Ultra-slim 13mm Bezel — ลด Black Edge กว่า 53% ดีไซน์ iPad-like ทันสมัย",
      "PCAP 10-point Touch — เวลาตอบสนอง < 5ms / Scanning 200Hz / Accuracy 4096×4096",
      "Mohs class 7 explosion-proof glass — ผิวหน้ากระจกกันระเบิด",
      "Surface IP65 waterproof — ทนน้ำสาดและฝุ่นที่ผิวหน้า",
      "ตัวเครื่องบางเพียง 7.67cm — น้ำหนักสุทธิ 30 kg",
      "Industrial-grade Power Supply — 7×24H Stable Working",
      "30,000-hour Extended-life LED Backlight — ใช้งาน 3.5 ปีต่อเนื่อง",
      "อัตราซ่อม 2 ปีต่ำเพียง 1.5% (Proven Reliability)",
      "Wi-Fi 5GHz 802.11ac + BLE 5.0 (Android) — เชื่อมต่อ POS เสถียร",
      "รองรับ Square POS / Stripe POS / Clover POS / Shopify POS",
      "Pre-install Windows 10/11 / Linux / Android 9/11/12",
      "ติดตั้งได้: Wall mount / Floor stand / Desktop / Embedded",
      "ความละเอียด 4K (3840×2160) เป็น Option เสริม",
    ],
    useCases: ["QSR / Self-order Counter", "Retail / POS Self-checkout", "Hotel / Lobby Self-service", "Smart Restaurant Menu"],
    useCaseScenarios: [],
    gallery: [
      hd55P1, hd55P2, hd55P3, hd55P4, hd55P5, hd55P6, hd55P7,
    ],
    ioImage: hd55Io,
    installImages: [hd55Install1, hd55Install2, hd55Install3],
    featureImages: [hd55Hero, hd55Pos1, hd55Pos2],
    dimensionDrawings: [
      {
        image: hd55P3,
        title: "Mechanical Dimension — Slim Profile",
        caption: "ตัวเครื่อง 55\" ดีไซน์ Ultra-slim — ขนาด 1264 × 734.8 × 76.7 mm (กว้าง × สูง × ลึก) Bezel เพียง 13mm Active Area 1213.6 × 684.4 mm น้ำหนักสุทธิ 30 kg — บางและเบาเหมาะกับงาน Embedded หรือ Wall Mount ในงานตกแต่งภายในที่ต้องการความเรียบหรู",
        callouts: [
          { label: "ขนาดเครื่อง", value: "1264 × 734.8 × 76.7 mm" },
          { label: "Active Area", value: "1213.6 × 684.4 mm" },
          { label: "Bezel", value: "13 mm (-53% vs ทั่วไป)" },
          { label: "น้ำหนักสุทธิ / รวม", value: "30 kg / 35 kg" },
        ],
      },
      {
        image: hd55Io,
        title: "I/O Layout — External Connectors",
        caption: "พอร์ตเชื่อมต่อด้านหลังตัวเครื่อง — รองรับครบทั้ง 3 Configuration: Monitor (HDMI in / VGA / USB / Audio), Windows PC (HDMI out / VGA / USB ×4 / RJ45 / Wi-Fi), Android (HDMI out / USB ×2 / RJ45 / TF Slot / Audio + BLE 5.0)",
        callouts: [
          { label: "Monitor", value: "HDMI in + VGA + USB + Audio" },
          { label: "Windows PC", value: "HDMI + VGA + USB×4 + RJ45 + Wi-Fi" },
          { label: "Android", value: "HDMI + USB×2 + RJ45 + TF + BLE 5.0" },
          { label: "Power", value: "110-240V AC 50/60Hz" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: [
      {
        key: "monitor",
        label: "HD55 — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 55\" PCAP ล้วน ๆ ดีไซน์ Slim Bezel 13mm — ต่อกับ External PC, OPS หรือ Media Player ผ่าน HDMI in + USB Touch (Plug-and-play) Power Consumption < 160W น้ำหนักสุทธิ 30 kg",
        bestFor: "ลูกค้ามี PC/OPS อยู่แล้ว ต้องการเฉพาะจอสัมผัสขนาดใหญ่ 55\" ดีไซน์บางทันสมัย",
        highlights: [
          "ไม่มี PC ในตัว — ปรับเปลี่ยน PC ภายนอกได้",
          "Input: HDMI in + USB + VGA + Audio in/out",
          "Brightness 300 cd/m² / 60 Hz / Contrast 1200:1",
          "Power Consumption < 160W",
          "น้ำหนักสุทธิ 30 kg / Bezel 13mm",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "HD55 — Windows / Linux PC",
        badge: "All-in-One PC (x86)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 55\" Slim Bezel พร้อม Intel x86 ภายใน เลือก CPU ได้ 3 ระดับ — Intel Celeron J6412 (Entry) / Core i5-8Gen (Mid) / Core i7-10Gen (High) — RAM DDR4 4-16GB + mSATA 128-512GB ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน",
        bestFor: "Retail / QSR / Hotel ที่ใช้ซอฟต์แวร์ Windows-based และต้องการดีไซน์จอใหญ่ 55\" บางทันสมัย",
        highlights: [
          "CPU: Intel Celeron J6412 / Core i5-8Gen / i7-10Gen",
          "RAM DDR4-2666 4 / 8 / 16 GB",
          "Storage mSATA 128 / 256 / 512 GB",
          "Gigabit RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Power Consumption < 230W",
        ],
        cpu: "Intel Celeron J6412 / Core i5-8Gen / i7-10Gen",
        ram: "4–16GB DDR4-2666",
        storage: "mSATA 128–512GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "HD55 — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 55\" Slim Bezel พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) พร้อม Wi-Fi 5GHz 802.11ac + BLE 5.0 รองรับ Square / Stripe / Clover / Shopify POS โดยตรง",
        bestFor: "POS Self-order / QSR / Retail / Hotel Self-service ที่ใช้ Android App",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2–8GB + eMMC 16–128GB",
          "Pre-install Android 11 / 9 / 12 (ตามรุ่น CPU)",
          "Wi-Fi 5GHz + BLE 5.0 (Secure POS Connectivity)",
          "Power Consumption < 160W",
        ],
        cpu: "Rockchip RK3568 / RK3288 / RK3588",
        ram: "2–8GB",
        storage: "eMMC 16–128GB",
        accent: "secondary",
      },
    ],
    cpuOptions: [
      { tier: "Entry", cpu: "Intel® Celeron® J6412 (Quad-core)", gpu: "Intel® UHD Graphics", ram: "DDR4 4GB", storage: "mSATA 128GB", targetUseCase: "POS / Self-order / Digital Signage งานทั่วไป — คุ้มค่าที่สุด" },
      { tier: "Mid", cpu: "Intel® Core™ i5 8th Gen", gpu: "Intel® Iris® Plus Graphics 645", ram: "DDR4 8GB", storage: "mSATA 256GB", targetUseCase: "Multi-app POS, ERP/CRM Front-end, Retail Self-checkout" },
      { tier: "High", cpu: "Intel® Core™ i7 10th Gen", gpu: "Intel® UHD Graphics", ram: "DDR4 16GB", storage: "mSATA 512GB", targetUseCase: "4K Multimedia, Smart Restaurant, AI Vision Retail" },
      { tier: "Entry", cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)", gpu: "ARM Mali-G52 2EE", ram: "LPDDR4 2GB (4GB optional)", storage: "eMMC 32GB", targetUseCase: "POS Self-order (Android 11), Wi-Fi 5GHz + BLE 5.0" },
      { tier: "Mid", cpu: "Rockchip RK3288 (Quad-core ARM Cortex-A17)", gpu: "ARM Mali-T864", ram: "LPDDR3 2GB (4GB optional)", storage: "eMMC 16GB (32GB optional)", targetUseCase: "Pre-install Android 9 — งาน Legacy POS App" },
      { tier: "High", cpu: "Rockchip RK3588 (Octa-core, 8nm)", gpu: "ARM Mali-G610", ram: "LPDDR4 4GB (8GB optional)", storage: "eMMC 64GB (128GB optional)", targetUseCase: "AI Vision, Multi-app POS, 4K Multimedia (Android 12)" },
    ],
    datasheetUrl: "https://touchwo.com/wp-content/uploads/2024/11/HD55-X86-TouchWo-SpecSheet.pdf",
    ports: [],
    specs: [
      { title: "Windows / Linux System (x86)", rows: [
        { label: "CPU (เลือกได้)", value: "Intel® Celeron® J6412 / Core™ i5-8Gen / i7-10Gen" },
        { label: "Graphic GPU", value: "Intel® UHD Graphics / Iris® Plus 645 / UHD Graphics" },
        { label: "Audio", value: "HD Audio: ALC269" },
        { label: "หน่วยความจำ (RAM)", value: "DDR4-2666 SODIMM 4 / 8 / 16 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "mSATA 128 / 256 / 512 GB" },
        { label: "เครือข่าย", value: "10/100/1000M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Windows 10 / 11 / Linux (เลือกได้)" },
      ]},
      { title: "Android System (ARM)", rows: [
        { label: "CPU (เลือกได้)", value: "Rockchip RK3568 / RK3288 / RK3588" },
        { label: "Graphic GPU", value: "ARM G52 2EE / Mali-T864 / Mali-G610" },
        { label: "หน่วยความจำ (RAM)", value: "RK3568 2GB (4GB opt) / RK3288 2GB (4GB opt) / RK3588 4GB (8GB opt)" },
        { label: "หน่วยเก็บข้อมูล", value: "RK3568 32GB / RK3288 16GB (32GB opt) / RK3588 64GB (128GB opt)" },
        { label: "เครือข่าย", value: "10/100M หรือ 100/1000M RJ45 + Wi-Fi 802.11a/b/g/n/ac (5GHz)" },
        { label: "OS ที่ติดตั้งให้", value: "Android 11 (RK3568) / Android 9 (RK3288) / Android 12 (RK3588)" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "55 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD) — 4K Optional" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "1213.6 × 684.4 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "300 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "1200:1" },
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
        { label: "ผิวหน้า", value: "Mohs class 7 explosion-proof glass + Surface IP65 waterproof" },
      ]},
      { title: "Operation Environment", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "ความชื้นทำงาน", value: "0% - 90%" },
        { label: "อุณหภูมิเก็บรักษา", value: "0°C - 60°C" },
        { label: "ความชื้นเก็บรักษา", value: "0% - 65%" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง (W×H×T)", value: "126.4 × 73.48 × 7.67 cm (Bezel 13mm)" },
        { label: "ขนาดกล่อง (W×H×T)", value: "136 × 89 × 17.3 cm" },
        { label: "น้ำหนักสุทธิ", value: "30 kg" },
        { label: "น้ำหนักรวม", value: "35 kg" },
      ]},
      { title: "Power Supply", rows: [
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Standby Power", value: "≤ 0.5W" },
        { label: "Overall Power", value: "Monitor < 160W / Windows < 230W / Android < 160W" },
      ]},
      { title: "Reliability", rows: [
        { label: "Continuous Performance", value: "3.5 ปี ออกแบบสำหรับ 24/7 Operation" },
        { label: "2-Year Repair Rate", value: "ต่ำเพียง 1.5%" },
      ]},
      { title: "External Connectors", rows: [
        { label: "Touch Monitor", value: "Power Socket × 1, HDMI in × 1, USB × 1, VGA × 1, Audio in/out × 1" },
        { label: "Windows / Linux PC", value: "Power Socket × 1, HDMI out × 1, VGA × 1, USB × 4, RJ45 × 1, Wi-Fi × 1, Audio in/out × 1" },
        { label: "Android PC", value: "Power Socket × 1, HDMI out × 1, USB × 2, RJ45 × 1, TF Slot × 1, Audio in/out × 1" },
      ]},
      { title: "Included in the Delivery", rows: [
        { label: "Manual / คู่มือ", value: "× 1" },
        { label: "Wall mount bracket", value: "× 1" },
        { label: "USB & HDMI cable (Monitor) / Wi-Fi Antenna (PC)", value: "× 1" },
        { label: "Power cable", value: "× 1" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 FHD (4K Optional)",
      brightness: "300 cd/m²",
      contrast: "1200:1",
      touch: "PCAP 10pt + Mohs 7 + IP65",
      os: "Monitor / Windows / Linux / Android",
      formFactor: "Slim-Bezel 13mm AIO 55\"",
      dimensionCm: "126.4 × 73.48 × 7.67",
      weightKg: "30",
      power: "< 230W",
      install: "Wall / Floor / Desktop / Embedded",
    },
  },
};

export const DISPLAY_55_ORDER: Display55Slug[] = ["hd55"];

export const getDisplay55 = (slug: string): Display32 | undefined =>
  DISPLAYS_55[slug as Display55Slug];

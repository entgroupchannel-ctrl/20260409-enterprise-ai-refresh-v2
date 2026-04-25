/**
 * Touch Display 65" — HR65 Configurable AIO (Monitor / Windows OPS / Android)
 * แหล่งสเปก: touchwo.com (HR65 Series)
 *  - HR65 Touch Monitor:  https://touchwo.com/product/elo-monitor-65-touch-monitor-hr65/
 *  - HR65 Windows PC:     https://touchwo.com/product/elo-monitor-65-touch-pc-hr65/
 *  - HR65 Android PC:     https://touchwo.com/product/65-android-touch-pc-hr65/
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";

import hr65P1 from "@/assets/touchwo/hr65/p-1.jpg";
import hr65P2 from "@/assets/touchwo/hr65/p-2.jpg";
import hr65P3 from "@/assets/touchwo/hr65/p-3.jpg";
import hr65P4 from "@/assets/touchwo/hr65/p-4.jpg";
import hr65P5 from "@/assets/touchwo/hr65/p-5.jpg";
import hr65P6 from "@/assets/touchwo/hr65/p-6.jpg";
import hr65P7 from "@/assets/touchwo/hr65/p-7.jpg";
import hr65Io from "@/assets/touchwo/hr65/io.jpg";
import hr65Install1 from "@/assets/touchwo/hr65/install-1.png";
import hr65Install2 from "@/assets/touchwo/hr65/install-2.png";
import hr65Feat1 from "@/assets/touchwo/hr65/feat-1.png";
import hr65Feat2 from "@/assets/touchwo/hr65/feat-2.png";
import hr65Feat3 from "@/assets/touchwo/hr65/feat-3.png";

import rz65Monitor from "@/assets/touchwo/rz65b/p-monitor.jpg";
import rz65Windows from "@/assets/touchwo/rz65b/p-windows.jpg";
import rz65Android from "@/assets/touchwo/rz65b/p-android.jpg";
import rz65P3 from "@/assets/touchwo/rz65b/p-3.jpg";
import rz65P4 from "@/assets/touchwo/rz65b/p-4.jpg";
import rz65P5 from "@/assets/touchwo/rz65b/p-5.jpg";
import rz65P6 from "@/assets/touchwo/rz65b/p-6.jpg";
import rz65P7 from "@/assets/touchwo/rz65b/p-7.jpg";
import rz65IoMonitor from "@/assets/touchwo/rz65b/io-monitor.jpg";
import rz65IoWindows from "@/assets/touchwo/rz65b/io-windows.jpg";
import rz65IoAndroid from "@/assets/touchwo/rz65b/io-android.jpg";
import rz65Feat1 from "@/assets/touchwo/rz65b/feat-1.png";
import rz65Feat2 from "@/assets/touchwo/rz65b/feat-2.png";
import rz65Feat3 from "@/assets/touchwo/rz65b/feat-3.png";
import rz65Feat4 from "@/assets/touchwo/rz65b/feat-4.png";

export type Display65Slug = "hr65" | "rz65b";
export { OS_BACKGROUNDS };
export type { OSKey };

export const DISPLAYS_65: Record<Display65Slug, Display32> = {
  hr65: {
    slug: "hr65",
    modelCode: "HR65",
    name: '65" HR65 Series — Touch Monitor / Windows OPS / Android PC',
    shortName: "HR65 Series",
    category: "Unibody 65\" Large-Format Touch Display",
    formFactor: "Configurable AIO",
    tagline: "จอสัมผัส 65\" PCAP FHD — Sleek Unibody Aluminum + Sheet-metal — เลือก 3 Configuration: Monitor / Windows OPS / Android",
    description:
      "HR65 คือซีรีส์จอสัมผัสขนาดใหญ่ 65 นิ้ว FHD 1920×1080 PCAP 10-point ดีไซน์ Sleek Unibody โครงสร้าง Aluminum Alloy + Sheet-metal พร้อม Laser-cut Backplate เคลือบสารกันสึก/กันสนิม ตัวเครื่องบางเพียง 6 cm น้ำหนัก 37.8–38.1 kg — Contrast สูงถึง 3000:1 ผิวหน้ากระจก Mohs class 7 explosion-proof + Anti-glare, อายุ Backlight 30,000 ชม. รองรับ 24/7 Operation อัตราการเสียต่ำ (Ultra-Low Failure Rate) เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor (HDMI in / DVI / VGA / USB), (2) Windows All-in-One พร้อม OPS — Intel Core i3-4Gen / i5-10Gen / i7-11Gen, (3) Android All-in-One พร้อม Rockchip RK3568 / RK3288 / RK3588 — Plug-and-play พร้อม Auto-power Management",
    highlights: [
      { icon: "Box", title: "Sleek Unibody Design", subtitle: "Aluminum Alloy + Sheet-metal / Laser-cut" },
      { icon: "Maximize", title: "65\" FHD 1920×1080", subtitle: "16:9 / 300 cd/m² / Contrast 3000:1" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "<5ms / Mohs 7 + Anti-glare" },
      { icon: "ShieldCheck", title: "Vandal-Proof Construction", subtitle: "Wear-resist + Corrosion-proof Coating" },
    ],
    features: [
      "Sleek Unibody Design — โครงสร้าง Aluminum Alloy + Sheet-metal ขึ้นรูปครั้งเดียว",
      "Laser-cut Backplate — ผิวหลังตัดเลเซอร์ละเอียด ดูเรียบหรู",
      "Wear-resistant + Corrosion-proof Coating — ทนการใช้งานหนัก",
      "Vandal-Proof Construction — กันการทำลายและการกระทบกระแทก",
      "PCAP 10-point Touch — เวลาตอบสนอง < 5ms / Anti-glare",
      "Contrast สูงถึง 3000:1 — สีคมชัดสมจริงกว่ามาตรฐาน",
      "Mohs class 7 explosion-proof glass",
      "ตัวเครื่องบางเพียง 6 cm — ดีไซน์ Slim Profile",
      "Industrial-grade Power Supply 7×24H Stable Working",
      "30,000-hour Extended-life LED Backlight",
      "Ultra-Low Failure Rate — Reliable Long-Term Performance",
      "Plug-and-play + Auto-power Management",
      "Pre-install Windows 10/11 / Linux / Android 9/11/12",
      "ติดตั้งได้: Wall mount / Floor stand / Mobile stand",
      "Windows OPS Architecture — เปลี่ยน OPS PC ได้ในอนาคต",
    ],
    useCases: ["Education / Smart Classroom", "Corporate Boardroom", "Public Self-Service Kiosk", "Digital Signage / Wayfinding"],
    useCaseScenarios: [],
    gallery: [hr65P1, hr65P2, hr65P3, hr65P4, hr65P5, hr65P6, hr65P7],
    ioImage: hr65Io,
    installImages: [hr65Install1, hr65Install2],
    featureImages: [hr65Feat1, hr65Feat2, hr65Feat3],
    dimensionDrawings: [
      {
        image: hr65P3,
        title: "Mechanical Dimension — Unibody Slim Profile",
        caption: "ตัวเครื่อง 65\" ดีไซน์ Unibody — ขนาด 1482 × 857 × 60 mm (กว้าง × สูง × ลึก) Active Area 1428 × 803 mm น้ำหนักสุทธิ 37.8 kg (Monitor) / 38.1 kg (PC/Android) — โครงสร้าง Aluminum Alloy + Sheet-metal ขึ้นรูปชิ้นเดียว ทนทาน Vandal-proof เหมาะกับงาน Public Self-service และ Education",
        callouts: [
          { label: "ขนาดเครื่อง", value: "1482 × 857 × 60 mm" },
          { label: "Active Area", value: "1428 × 803 mm" },
          { label: "Profile", value: "Slim 6 cm Unibody" },
          { label: "น้ำหนักสุทธิ / รวม", value: "37.8–38.1 kg / 47.8–48.1 kg" },
        ],
      },
      {
        image: hr65Io,
        title: "I/O Layout — External Connectors",
        caption: "พอร์ตเชื่อมต่อด้านหลัง — รองรับครบทั้ง 3 Configuration: Monitor (HDMI in / DVI / VGA / USB / Audio), Windows OPS (HDMI out / VGA / USB ×4 / RJ45 / Wi-Fi / MIC), Android (HDMI out / USB ×2 / RJ45 / TF/SD / Audio + Wi-Fi)",
        callouts: [
          { label: "Monitor", value: "HDMI in + DVI + VGA + USB + Audio" },
          { label: "Windows OPS", value: "HDMI + VGA + USB×4 + RJ45 + Wi-Fi + MIC" },
          { label: "Android", value: "HDMI + USB×2 + RJ45 + TF/SD + Audio + Wi-Fi" },
          { label: "Power", value: "110-240V AC / DC 12V 5A" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: [
      {
        key: "monitor",
        label: "HR65 — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 65\" PCAP ล้วน ๆ ดีไซน์ Unibody ทนทาน — ต่อกับ External PC, OPS หรือ Media Player ผ่าน HDMI in / DVI / VGA + USB Touch (Plug-and-play) Power Consumption < 110W น้ำหนักสุทธิ 37.8 kg พร้อม USB & HDMI cable",
        bestFor: "ลูกค้ามี PC/OPS อยู่แล้ว ต้องการเฉพาะจอสัมผัสขนาดใหญ่ 65\" ดีไซน์ Unibody กันทำลาย",
        highlights: [
          "ไม่มี PC ในตัว — ต่อ PC ภายนอกผ่าน HDMI in / DVI / VGA",
          "Brightness 300 cd/m² / 60 Hz / Contrast 3000:1",
          "PCAP 10-point Touch / Anti-glare",
          "Power Consumption < 110W",
          "น้ำหนักสุทธิ 37.8 kg / Profile 6 cm Unibody",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "HR65 — Windows / Linux PC (OPS)",
        badge: "All-in-One PC (OPS Architecture)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 65\" Unibody พร้อม OPS Slot ภายใน เลือก CPU ได้ 3 ระดับ — Intel Core i3 4-Gen (Entry) / Core i5 10-Gen (Mid) / Core i7 11-Gen (High) — RAM Kingston 4-16GB + Seagate SSD 128-512GB ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน เปลี่ยน OPS ได้ในอนาคต",
        bestFor: "ห้องประชุมขนาดใหญ่ / Smart Classroom / Boardroom ที่ต้องการอัปเกรด OPS PC ได้",
        highlights: [
          "OPS Architecture — เปลี่ยน OPS PC ได้ภายหลัง",
          "CPU: Intel Core i3-4Gen / i5-10Gen / i7-11Gen",
          "GPU: HD Graphics 4600 / UHD 630 / Iris® Xe",
          "RAM Kingston 4 / 8 / 16 GB",
          "Storage Seagate SSD 128 / 256 / 512 GB",
          "Gigabit RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Power Consumption < 140W",
        ],
        cpu: "Intel Core i3-4Gen / i5-10Gen / i7-11Gen (OPS)",
        ram: "4–16GB Kingston",
        storage: "Seagate SSD 128–512GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "HR65 — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 65\" Unibody พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) พร้อม Wi-Fi 802.11ac — เหมาะกับ Education App และ Public Self-service",
        bestFor: "Smart Classroom / Public Kiosk / Digital Signage ที่ใช้ Android App",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2–8GB + eMMC 16–128GB",
          "Pre-install Android 11 / 9 / 12 (ตามรุ่น CPU)",
          "10/100M RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Power Consumption < 115W (DC 12V 5A)",
        ],
        cpu: "Rockchip RK3568 / RK3288 / RK3588",
        ram: "2–8GB",
        storage: "eMMC 16–128GB",
        accent: "secondary",
      },
    ],
    cpuOptions: [
      { tier: "Entry", cpu: "Intel® Core™ i3 4th Gen (OPS)", gpu: "Intel® HD Graphics 4600", ram: "Kingston 4GB", storage: "Seagate SSD 128GB", targetUseCase: "ห้องประชุมขนาดเล็ก / Digital Signage งานทั่วไป" },
      { tier: "Mid", cpu: "Intel® Core™ i5 10th Gen (OPS)", gpu: "Intel® UHD Graphics 630", ram: "Kingston 8GB", storage: "Seagate SSD 256GB", targetUseCase: "Smart Classroom, Conference Room, Wireless Presentation" },
      { tier: "High", cpu: "Intel® Core™ i7 11th Gen (OPS)", gpu: "Intel® Iris® Xe Graphics", ram: "Kingston 16GB", storage: "Seagate SSD 512GB", targetUseCase: "Boardroom 4K, Video Conferencing, AI/Analytics Workloads" },
      { tier: "Entry", cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)", gpu: "ARM Mali-G52 2EE", ram: "LPDDR4 2GB (4GB optional)", storage: "eMMC 16GB (32GB optional)", targetUseCase: "Education App, Self-service Kiosk (Android 11)" },
      { tier: "Mid", cpu: "Rockchip RK3288 (Quad-core ARM Cortex-A17)", gpu: "ARM Mali-T864", ram: "LPDDR3 2GB", storage: "eMMC 16GB", targetUseCase: "Pre-install Android 9 — งาน Legacy App" },
      { tier: "High", cpu: "Rockchip RK3588 (Octa-core, 8nm)", gpu: "ARM Mali-G610", ram: "LPDDR4 4GB (8GB optional)", storage: "eMMC 64GB (128GB optional)", targetUseCase: "AI Vision, 4K Multimedia, Smart Whiteboard (Android 12)" },
    ],
    datasheetUrl: "https://touchwo.com/wp-content/uploads/2024/11/HR65-X86-TouchWo-SpecSheet.pdf",
    ports: [],
    specs: [
      { title: "Windows / Linux System (OPS)", rows: [
        { label: "CPU (เลือกได้)", value: "OPS — Intel® Core™ i3-4Gen / i5-10Gen / i7-11Gen" },
        { label: "Graphic GPU", value: "Intel® HD 4600 / UHD 630 / Iris® Xe" },
        { label: "Audio", value: "HD Audio: ALC269" },
        { label: "หน่วยความจำ (RAM)", value: "Kingston 4 / 8 / 16 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "Seagate SSD 128 / 256 / 512 GB" },
        { label: "เครือข่าย", value: "10/100/1000M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Windows 10 / 11 / Linux (เลือกได้)" },
      ]},
      { title: "Android System (ARM)", rows: [
        { label: "CPU (เลือกได้)", value: "Rockchip RK3568 / RK3288 / RK3588" },
        { label: "Graphic GPU", value: "ARM G52 2EE / Mali-T864 / Mali-G610" },
        { label: "หน่วยความจำ (RAM)", value: "RK3568 2GB (4GB opt) / RK3288 2GB / RK3588 4GB (8GB opt)" },
        { label: "หน่วยเก็บข้อมูล", value: "RK3568 16GB (32GB opt) / RK3288 16GB / RK3588 64GB (128GB opt)" },
        { label: "เครือข่าย", value: "10/100M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Android 11 (RK3568) / Android 9 (RK3288) / Android 12 (RK3588)" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "65 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "1428 × 803 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "300 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "3000:1" },
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
        { label: "ผิวหน้า", value: "Mohs class 7 explosion-proof glass + Anti-glare" },
      ]},
      { title: "Operation Environment", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "ความชื้นทำงาน", value: "10% - 80%" },
        { label: "อุณหภูมิเก็บรักษา", value: "-5°C - 60°C" },
        { label: "ความชื้นเก็บรักษา", value: "10% - 85%" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง (L×W×H)", value: "148.2 × 85.7 × 6.0 cm (Unibody)" },
        { label: "ขนาดกล่อง (L×W×H)", value: "154.5 × 92 × 15 cm" },
        { label: "น้ำหนักสุทธิ", value: "37.8 kg (Monitor) / 38.1 kg (PC/Android)" },
        { label: "น้ำหนักรวม", value: "47.8 kg (Monitor) / 48.1 kg (PC/Android)" },
      ]},
      { title: "Power Supply", rows: [
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 5A" },
        { label: "Standby Power", value: "≤ 0.5W" },
        { label: "Overall Power", value: "Monitor < 110W / Windows < 140W / Android < 115W" },
      ]},
      { title: "Construction & Reliability", rows: [
        { label: "Body Construction", value: "Aluminum Alloy + Sheet-metal Unibody" },
        { label: "Backplate", value: "Laser-cut + Wear/Corrosion-proof Coating" },
        { label: "Vandal Resistance", value: "Vandal-Proof Security Construction" },
        { label: "Continuous Performance", value: "ออกแบบสำหรับ 24/7 Operation" },
        { label: "Failure Rate", value: "Ultra-Low (Reliable Long-Term Performance)" },
      ]},
      { title: "External Connectors", rows: [
        { label: "Touch Monitor", value: "Power Socket × 1, DC12V × 1, HDMI in × 1, DVI × 1, VGA × 1, USB × 1, Audio in/out × 1" },
        { label: "Windows / Linux PC (OPS)", value: "Power Button × 1, DC12V × 1, HDMI out × 1, VGA × 1, USB × 4, RJ45 × 1, Wi-Fi × 1, MIC × 1" },
        { label: "Android PC", value: "Power Button × 1, DC12V × 1, HDMI out × 1, USB × 2, RJ45 × 1, TF/SD × 1, Audio × 1, Wi-Fi × 1" },
      ]},
      { title: "Included in the Delivery", rows: [
        { label: "Manual / คู่มือ", value: "× 1" },
        { label: "Wall mount bracket", value: "× 1" },
        { label: "USB & HDMI cable (Monitor) / Wi-Fi Antenna (PC)", value: "× 1" },
        { label: "Power cable", value: "× 1" },
      ]},
    ],
    quick: {
      resolution: "1920×1080 FHD",
      brightness: "300 cd/m²",
      contrast: "3000:1",
      touch: "PCAP 10pt + Mohs 7",
      os: "Monitor / Windows OPS / Linux / Android",
      formFactor: "Unibody 6 cm 65\"",
      dimensionCm: "148.2 × 85.7 × 6.0",
      weightKg: "37.8-38.1",
      power: "< 140W",
      install: "Wall / Floor / Mobile Stand",
    },
  },

  rz65b: {
    slug: "rz65b",
    modelCode: "RZ65B",
    name: '65" RZ65B Series — Touch Monitor / Windows OPS / Android PC',
    shortName: "RZ65B Series",
    category: "65\" 4K UHD Touch Display (Modular Smart Terminal)",
    formFactor: "Configurable AIO",
    tagline: "จอสัมผัส 65\" 4K UHD PCAP — Modular Plug-and-Play Design — เลือก 3 Configuration: Monitor / Windows OPS / Android",
    description:
      "RZ65B คือซีรีส์จอสัมผัสขนาด 65 นิ้ว ความละเอียด 4K UHD 3840×2160 พร้อมเทคโนโลยี PCAP 10-point — ออกแบบเป็น Modular Smart Terminal เปลี่ยนระหว่าง Monitor / Windows / Android ได้ง่ายแบบ Plug-and-Play พร้อม Embedded Tempered Glass ป้องกันหน้าจอ + Front-facing Speakers ส่งเสียงตรงสู่ผู้ใช้ — ผิวสัมผัส Mohs class 7 explosion-proof, Contrast 5000:1 สีคมชัด รองรับการติดตั้ง Wall-mount หรือ Floor-standing เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor ต่อ External PC, (2) Windows All-in-One พร้อม OPS — Intel Core i3-4Gen / i5-10Gen / i7-11Gen, (3) Android All-in-One พร้อม Rockchip RK3568 / RK3288 / RK3588",
    highlights: [
      { icon: "Maximize", title: "65\" 4K UHD 3840×2160", subtitle: "16:9 / 350 cd/m² / Contrast 5000:1" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs 7 + Tempered Glass" },
      { icon: "Box", title: "Modular Smart Terminal", subtitle: "Plug-and-Play เปลี่ยนระบบได้ง่าย" },
      { icon: "Volume2", title: "Front-Facing Speakers", subtitle: "เสียงคมชัดส่งตรงผู้ใช้" },
    ],
    features: [
      "Precise Touch Performance — เทคโนโลยี PCAP ความแม่นยำสูง < 1mm",
      "Seamless System Switching — สลับ Windows ↔ Android ได้ง่ายแบบ Modular",
      "Durable Glass Protection — Embedded Tempered Glass ป้องกันหน้าจอและเพิ่มความคมชัด",
      "Modular Smart Terminal — ดีไซน์ Plug-and-Play เปลี่ยนระบบได้สะดวก",
      "Precise & Natural Writing Experience — เขียนลื่นเหมือนจริง เหมาะกับ Note/Drawing/Presentation",
      "Front-Facing Speakers — ลำโพงด้านหน้าส่งเสียงตรงผู้ใช้ ไม่บิดเบือน",
      "Sleek Plug-and-Play Design — ดีไซน์เรียบหรู ติดตั้งง่าย",
      "PCAP 10-point Touch — Scanning Frequency 200Hz / Recognition > 1.5mm",
      "Mohs class 7 explosion-proof glass",
      "4K UHD 3840×2160 — ความละเอียดสูง 16.7M Colours",
      "Contrast 5000:1 — สีคมชัดสมจริง",
      "Backlight LED 50,000 ชั่วโมง — อายุการใช้งานยาวนาน",
      "Pre-install Windows 10/11 / Linux / Android 9/11/12",
      "ติดตั้งได้: Wall-mount / Floor-standing / Mobile Stand",
      "รองรับขนาดจอ 55\" - 110\" ในซีรีส์เดียวกัน",
    ],
    useCases: ["Education / Smart Classroom", "Healthcare", "Industrial", "Public Self-service Kiosk", "Restaurant / QSR", "Parcel Locker"],
    useCaseScenarios: [],
    gallery: [rz65Monitor, rz65Windows, rz65Android, rz65P3, rz65P4, rz65P5, rz65P6, rz65P7],
    ioImage: rz65IoMonitor,
    installImages: [rz65P5, rz65P6, rz65P7],
    featureImages: [rz65Feat1, rz65Feat2, rz65Feat3, rz65Feat4],
    dimensionDrawings: [
      {
        image: rz65P3,
        title: "Mechanical Dimension — 65\" 4K Modular Display",
        caption: "ตัวเครื่อง 65\" 4K UHD — ขนาด 1485 × 888 × 83 mm (กว้าง × สูง × ลึก) Active Area 1428.5 × 803.5 mm น้ำหนักสุทธิ 32 kg / รวม 38 kg — ดีไซน์ Modular Smart Terminal สามารถเปลี่ยน OPS PC หรือ Android Module ได้ง่ายแบบ Plug-and-Play",
        callouts: [
          { label: "ขนาดเครื่อง", value: "148.5 × 88.8 × 8.3 cm" },
          { label: "Active Area", value: "1428.5 × 803.5 mm" },
          { label: "น้ำหนักสุทธิ / รวม", value: "32 kg / 38 kg" },
          { label: "ขนาดกล่อง", value: "160.5 × 101 × 19.5 cm" },
        ],
      },
      {
        image: rz65IoMonitor,
        title: "I/O Layout — Touch Monitor",
        caption: "พอร์ต Touch Monitor: HDMI input, VGA, USB Touch output, PC Audio input, Audio output, RF",
        callouts: [
          { label: "Video Input", value: "HDMI × 1, VGA × 1" },
          { label: "Audio", value: "PC Audio in × 1, Audio out × 1" },
          { label: "Touch / USB", value: "Touch out × 1, USB × 1" },
          { label: "อื่น ๆ", value: "RF × 1" },
        ],
      },
      {
        image: rz65IoWindows,
        title: "I/O Layout — Windows OPS PC",
        caption: "พอร์ต Windows All-in-One PC พร้อม OPS Slot — รองรับ Intel Core i3/i5/i7 + RJ45 Gigabit + Wi-Fi 802.11a/b/g/n/ac",
        callouts: [
          { label: "Network", value: "RJ45 Gigabit + Wi-Fi" },
          { label: "Display Out", value: "HDMI / DisplayPort" },
          { label: "USB", value: "USB ×4 (USB 2.0/3.0)" },
          { label: "Audio", value: "MIC + Audio out" },
        ],
      },
      {
        image: rz65IoAndroid,
        title: "I/O Layout — Android PC",
        caption: "พอร์ต Android All-in-One: RJ45, Audio output, AV output, Coaxial output, RS232, HDMI output, USB ×2, Touch output",
        callouts: [
          { label: "Network", value: "RJ45 10/100M + Wi-Fi" },
          { label: "Video Out", value: "HDMI out × 1, AV out × 1" },
          { label: "USB / Touch", value: "USB × 2, Touch out × 1" },
          { label: "Serial / Audio", value: "RS232 × 1, Audio out × 1, Coaxial × 1" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: [
      {
        key: "monitor",
        label: "RZ65B — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 65\" 4K UHD PCAP ล้วน ๆ ดีไซน์ Modular — ต่อกับ External PC, OPS หรือ Media Player ผ่าน HDMI input + VGA + USB Touch (Plug-and-play) พร้อม Embedded Tempered Glass + Front-facing Speakers — Power Output DC 12V 5A น้ำหนักสุทธิ 32 kg มาพร้อม Wall mount bracket, Power & USB & HDMI cable, Remote control",
        bestFor: "ลูกค้ามี PC/OPS อยู่แล้ว ต้องการเฉพาะจอสัมผัสขนาดใหญ่ 65\" 4K UHD แบบ Modular",
        highlights: [
          "ไม่มี PC ในตัว — ต่อ PC ภายนอกผ่าน HDMI + VGA + USB Touch",
          "4K UHD 3840×2160 / 16:9 / Refresh 4K-30Hz",
          "Brightness 350 cd/m² / Contrast 5000:1",
          "PCAP 10-point Touch / Mohs 7 Tempered Glass",
          "Front-facing Speakers — เสียงตรงสู่ผู้ใช้",
          "น้ำหนักสุทธิ 32 kg / Profile 8.3 cm",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "RZ65B — Windows / Linux PC (OPS)",
        badge: "All-in-One PC (OPS Architecture)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 65\" 4K UHD พร้อม OPS Slot ภายใน เลือก CPU ได้ 3 ระดับ — Intel Core i3 4-Gen (Entry) / Core i5 10-Gen (Mid) / Core i7 11-Gen (High) — RAM Kingston 4-16GB + Seagate SSD 128-512GB ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน — ดีไซน์ Modular เปลี่ยน OPS ได้ในอนาคต พร้อม Refresh Rate 60Hz",
        bestFor: "ห้องประชุม / Smart Classroom / Boardroom 4K ที่ต้องการอัปเกรด OPS PC ได้",
        highlights: [
          "OPS Architecture — เปลี่ยน OPS PC ได้ภายหลัง",
          "CPU: Intel Core i3-4Gen / i5-10Gen / i7-11Gen",
          "GPU: HD Graphics 4600 / UHD 630 / Iris® Xe",
          "RAM Kingston 4 / 8 / 16 GB",
          "Storage Seagate SSD 128 / 256 / 512 GB",
          "Gigabit RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Refresh Rate 60Hz @ 4K UHD",
        ],
        cpu: "Intel Core i3-4Gen / i5-10Gen / i7-11Gen (OPS)",
        ram: "4–16GB Kingston",
        storage: "Seagate SSD 128–512GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "RZ65B — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 65\" 4K UHD พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) พร้อม Wi-Fi 802.11ac — เหมาะกับ Education App, Public Self-service และ Digital Signage 4K",
        bestFor: "Smart Classroom / Public Kiosk / Digital Signage 4K ที่ใช้ Android App",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2–8GB + eMMC 16–128GB",
          "Pre-install Android 11 / 9 / 12 (ตามรุ่น CPU)",
          "10/100M RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Refresh Rate 4K-30Hz",
          "Power Output DC 12V 5A",
        ],
        cpu: "Rockchip RK3568 / RK3288 / RK3588",
        ram: "2–8GB",
        storage: "eMMC 16–128GB",
        accent: "secondary",
      },
    ],
    cpuOptions: [
      { tier: "Entry", cpu: "Intel® Core™ i3 4th Gen (OPS)", gpu: "Intel® HD Graphics 4600", ram: "Kingston 4GB", storage: "Seagate SSD 128GB", targetUseCase: "ห้องประชุมขนาดเล็ก / Digital Signage งานทั่วไป" },
      { tier: "Mid", cpu: "Intel® Core™ i5 10th Gen (OPS)", gpu: "Intel® UHD Graphics 630", ram: "Kingston 8GB", storage: "Seagate SSD 256GB", targetUseCase: "Smart Classroom, Conference Room, Wireless Presentation" },
      { tier: "High", cpu: "Intel® Core™ i7 11th Gen (OPS)", gpu: "Intel® Iris® Xe Graphics", ram: "Kingston 16GB", storage: "Seagate SSD 512GB", targetUseCase: "Boardroom 4K, Video Conferencing, AI/Analytics Workloads" },
      { tier: "Entry", cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)", gpu: "ARM Mali-G52 2EE", ram: "LPDDR4 2GB (4GB optional)", storage: "eMMC 16GB (32GB optional)", targetUseCase: "Education App, Self-service Kiosk (Android 11)" },
      { tier: "Mid", cpu: "Rockchip RK3288 (Quad-core ARM Cortex-A17)", gpu: "ARM Mali-T864", ram: "LPDDR3 2GB", storage: "eMMC 16GB", targetUseCase: "Pre-install Android 9 — งาน Legacy App" },
      { tier: "High", cpu: "Rockchip RK3588 (Octa-core, 8nm)", gpu: "ARM Mali-G610", ram: "LPDDR4 4GB (8GB optional)", storage: "eMMC 64GB (128GB optional)", targetUseCase: "AI Vision, 4K Multimedia, Smart Whiteboard (Android 12)" },
    ],
    datasheetUrl: "https://touchwo.com/product/elo-monitor-65-touch-monitor-rz65b/",
    ports: [],
    specs: [
      { title: "Windows / Linux System (OPS)", rows: [
        { label: "CPU (เลือกได้)", value: "OPS — Intel® Core™ i3-4Gen / i5-10Gen / i7-11Gen" },
        { label: "Graphic GPU", value: "Intel® HD 4600 / UHD 630 / Iris® Xe" },
        { label: "Audio", value: "HD Audio: ALC269" },
        { label: "หน่วยความจำ (RAM)", value: "Kingston 4 / 8 / 16 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "Seagate SSD 128 / 256 / 512 GB" },
        { label: "เครือข่าย", value: "10/100/1000M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Windows 10 / 11 / Linux (เลือกได้)" },
      ]},
      { title: "Android System (ARM)", rows: [
        { label: "CPU (เลือกได้)", value: "Rockchip RK3568 / RK3288 / RK3588" },
        { label: "Graphic GPU", value: "ARM G52 2EE / Mali-T864 / Mali-G610" },
        { label: "หน่วยความจำ (RAM)", value: "RK3568 2GB (4GB opt) / RK3288 2GB / RK3588 4GB (8GB opt)" },
        { label: "หน่วยเก็บข้อมูล", value: "RK3568 16GB (32GB opt) / RK3288 16GB / RK3588 64GB (128GB opt)" },
        { label: "เครือข่าย", value: "10/100M RJ45 + Wi-Fi 802.11a/b/g/n/ac" },
        { label: "OS ที่ติดตั้งให้", value: "Android 11 (RK3568) / Android 9 (RK3288) / Android 12 (RK3588)" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "65 นิ้ว" },
        { label: "ความละเอียด", value: "3840 × 2160 (4K UHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "1428.5 × 803.5 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "350 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "5000:1" },
        { label: "มุมมอง H/V", value: "178° / 178°" },
        { label: "อายุ Backlight", value: "LED 50,000 ชม." },
        { label: "Refresh Rate", value: "Monitor / Android 4K-30Hz, Windows OPS 60Hz" },
      ]},
      { title: "Touch Panel", rows: [
        { label: "เทคโนโลยี", value: "PCAP (Capacitive)" },
        { label: "จำนวนจุดสัมผัส", value: "10 จุด standard" },
        { label: "Touch Recognition", value: "> 1.5mm" },
        { label: "Scanning Frequency", value: "200 Hz" },
        { label: "Scanning Accuracy", value: "4096 × 4096" },
        { label: "Working Voltage", value: "180mA / DC +5V ±5%" },
        { label: "ผิวหน้า", value: "Mohs class 7 explosion-proof glass + Embedded Tempered Glass" },
      ]},
      { title: "Operation Environment", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "ความชื้นทำงาน", value: "10% - 80%" },
        { label: "อุณหภูมิเก็บรักษา", value: "-5°C - 60°C" },
        { label: "ความชื้นเก็บรักษา", value: "10% - 85%" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง (L×W×H)", value: "148.5 × 88.8 × 8.3 cm" },
        { label: "ขนาดกล่อง (L×W×H)", value: "160.5 × 101 × 19.5 cm" },
        { label: "น้ำหนักสุทธิ", value: "32 kg" },
        { label: "น้ำหนักรวม", value: "38 kg" },
      ]},
      { title: "Power Supply", rows: [
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 5A" },
        { label: "Standby Power", value: "≤ 0.5W" },
      ]},
      { title: "Construction & Features", rows: [
        { label: "Design", value: "Modular Smart Terminal — Plug-and-Play" },
        { label: "Glass Protection", value: "Embedded Tempered Glass + Mohs 7" },
        { label: "Speakers", value: "Front-Facing Speakers (เสียงตรงสู่ผู้ใช้)" },
        { label: "System Switching", value: "เปลี่ยน Windows ↔ Android ได้ง่าย" },
        { label: "Series Range", value: "55\" - 110\" (RZ Series ขนาดอื่น)" },
      ]},
      { title: "External Connectors", rows: [
        { label: "Touch Monitor", value: "HDMI in × 1, VGA × 1, PC Audio in × 1, Audio out × 1, USB × 1, Touch out × 1, RF × 1" },
        { label: "Windows / Linux PC (OPS)", value: "HDMI out, VGA, USB × 4, RJ45 Gigabit, Wi-Fi, MIC, Audio out" },
        { label: "Android PC", value: "HDMI out × 1, USB × 2, RJ45 × 1, Audio out × 1, AV out × 1, Coaxial × 1, RS232 × 1, Touch out × 1" },
      ]},
      { title: "Included in the Delivery", rows: [
        { label: "Manual / คู่มือ", value: "× 1" },
        { label: "Wall mount bracket", value: "× 1" },
        { label: "Power & USB & HDMI cable (Monitor) / Wi-Fi Antenna + Power cable (PC/Android)", value: "× 1" },
        { label: "Remote control", value: "× 1" },
      ]},
    ],
    quick: {
      resolution: "3840×2160 4K UHD",
      brightness: "350 cd/m²",
      contrast: "5000:1",
      touch: "PCAP 10pt + Mohs 7",
      os: "Monitor / Windows OPS / Linux / Android",
      formFactor: "Modular 8.3 cm 65\"",
      dimensionCm: "148.5 × 88.8 × 8.3",
      weightKg: "32",
      power: "DC 12V 5A",
      install: "Wall / Floor / Mobile Stand",
    },
  },
};

export const DISPLAY_65_ORDER: Display65Slug[] = ["hr65", "rz65b"];

export const getDisplay65 = (slug: string): Display32 | undefined =>
  DISPLAYS_65[slug as Display65Slug];

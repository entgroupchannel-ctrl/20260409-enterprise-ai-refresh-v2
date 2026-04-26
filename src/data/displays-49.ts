/**
 * Touch Display 49" — HR49 Configurable AIO (Monitor / Windows / Android)
 * แหล่งสเปก: touchwo.com (HR49 Series)
 *  - HR49 Touch Monitor:  https://touchwo.com/product/elo-monitor-49-touch-monitor-hr49/
 *  - HR49 Windows PC:     https://touchwo.com/product/49-touch-pc-hr49/
 *  - HR49 Android PC:     https://touchwo.com/product/49-android-touch-pc-hr49/
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";

import hr49P1 from "@/assets/touchwo/hr49/p-1.jpg";
import hr49P2 from "@/assets/touchwo/hr49/p-2.jpg";
import hr49P3 from "@/assets/touchwo/hr49/p-3.jpg";
import hr49P4 from "@/assets/touchwo/hr49/p-4.jpg";
import hr49P5 from "@/assets/touchwo/hr49/p-5.jpg";
import hr49P6 from "@/assets/touchwo/hr49/p-6.jpg";
import hr49P7 from "@/assets/touchwo/hr49/p-7.jpg";
import hr49IoMonitor from "@/assets/touchwo/hr49/io-monitor.jpg";
import hr49IoX86Diagram from "@/assets/touchwo/hr49/io-x86.png";
import hr49IoMonitorDiagram from "@/assets/touchwo/hr49/io-monitor-diagram.png";
import hr49IoAndroidDiagram from "@/assets/touchwo/hr49/io-android.png";
import hr49DimFront from "@/assets/touchwo/hr49/dim-front.png";
import hr49DimBack from "@/assets/touchwo/hr49/dim-back.png";
import hr49Feat1 from "@/assets/touchwo/hr49/feat-1.png";
import hr49Feat2 from "@/assets/touchwo/hr49/feat-2.png";
import hr49Feat3 from "@/assets/touchwo/hr49/feat-3.png";
import hr49Feat4 from "@/assets/touchwo/hr49/feat-4.png";
import hr49InstallWall from "@/assets/touchwo/hr49/install-wall.jpg";
import hr49InstallFloor from "@/assets/touchwo/hr49/install-floor.jpg";
import hr49InstallMobile from "@/assets/touchwo/hr49/install-mobile.jpg";

import hr49UcWayfinding from "@/assets/touchwo/usecases/hr49-uc-wayfinding.jpg";
import hr49UcBoardroom from "@/assets/touchwo/usecases/hr49-uc-boardroom.jpg";
import hr49UcHotel from "@/assets/touchwo/usecases/hr49-uc-hotel.jpg";
import hr49UcQsr from "@/assets/touchwo/usecases/hr49-uc-qsr.jpg";

// HD49 — slim-bezel 13mm series (Monitor / Windows / Android)
import hd49Hero from "@/assets/touchwo/hd49/hero.png";
import hd49PMain from "@/assets/touchwo/hd49/p-main.jpg";
import hd49PFront from "@/assets/touchwo/hd49/p-front.jpg";
import hd49PPortrait from "@/assets/touchwo/hd49/p-portrait.jpg";
import hd49PSide from "@/assets/touchwo/hd49/p-side.jpg";
import hd49PLifestyle from "@/assets/touchwo/hd49/p-lifestyle.jpg";
import hd49P3 from "@/assets/touchwo/hd49/p-3.png";
import hd49Install1 from "@/assets/touchwo/hd49/install-1.jpg";
import hd49Install2 from "@/assets/touchwo/hd49/install-2.jpg";
import hd49Install3 from "@/assets/touchwo/hd49/install-3.jpg";
import hd49IoAndroid from "@/assets/touchwo/hd49/io-android.png";
import hd49IoWindows from "@/assets/touchwo/hd49/io-windows.png";
import hd49IoMonitor from "@/assets/touchwo/hd49/io-monitor.png";

export type Display49Slug = "hr49" | "hd49";
export { OS_BACKGROUNDS };
export type { OSKey };

export const DISPLAYS_49: Record<Display49Slug, Display32> = {
  hr49: {
    slug: "hr49",
    modelCode: "HR49",
    name: '49" HR49 Series — Touch Monitor / Windows PC / Android PC',
    shortName: "HR49 Series",
    category: "Configurable 49\" Large-Format Touch Display",
    formFactor: "Configurable AIO",
    tagline: "จอสัมผัส 49\" PCAP FHD — Sleek Unibody / IP65 Surface — เลือก 3 Configuration: Monitor / Windows / Android",
    description:
      "HR49 คือซีรีส์จอสัมผัส 49 นิ้ว FHD 1920×1080 PCAP 10-point ตัวเครื่องเดียวกัน — ใช้ดีไซน์ Sleek Unibody อะลูมิเนียมอัลลอยพร้อมแผ่นหลัง laser-cut, กระจกผิว Mohs class 7 explosion-proof, พื้นผิว IP65 waterproof, อายุ Backlight 30,000 ชม. สามารถเลือก Configuration ได้ 3 แบบ: (1) Touch Monitor เฉพาะจอสัมผัส (PCAP) ต่อกับ PC ภายนอก, (2) Windows/Linux All-in-One พร้อม OPS i3 4Gen / i5 10Gen / i7 11Gen, (3) Android All-in-One พร้อม Rockchip RK3568 / RK3288 / RK3588 — รองรับ Square / Stripe / Clover / Shopify POS — ขนาดเครื่อง 112.7×65.7×6 cm น้ำหนัก 25.9-26.2 kg เหมาะกับ Wayfinding, Conference, Self-order, Hotel Lobby, Digital Signage",
    highlights: [
      { icon: "Layers", title: "เลือก 3 Configuration", subtitle: "Monitor / Windows / Android" },
      { icon: "Maximize", title: "49\" FHD 1920×1080", subtitle: "16:9 / 300 cd/m² / 60 Hz" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs 7 + IP65 Surface" },
      { icon: "ShieldCheck", title: "Industrial 7×24H", subtitle: "30,000-hr LED Backlight" },
    ],
    features: [
      "PCAP 10-point Touch — เวลาตอบสนอง < 5ms / Scanning 200Hz / Accuracy 4096×4096",
      "Mohs class 7 explosion-proof glass — ผิวหน้ากระจกกันระเบิด",
      "Surface IP65 waterproof — ทนน้ำสาดและฝุ่นที่ผิวหน้า",
      "Sleek Unibody อะลูมิเนียมอัลลอย + laser-cut backplate ทนต่อการกระแทก/กัดกร่อน",
      "Industrial-grade Power Supply — 7×24H Stable Working",
      "30,000-hour Extended-life LED Backlight",
      "Pre-install Windows 10/11 / Linux / Android 9/11/12",
      "รองรับ Square POS / Stripe POS / Clover POS / Shopify POS (Android)",
      "Wi-Fi 802.11a/b/g/n/ac + RJ45 — เชื่อมต่อเสถียร",
      "ติดตั้งได้: Wall mount / Floor stand / Mobile stand",
    ],
    useCases: ["Mall / Public Wayfinding", "Conference / Boardroom", "Hotel Lobby Self-service", "QSR / Self-order Counter"],
    useCaseScenarios: [
      { image: hr49UcWayfinding, title: "Mall / Public Wayfinding",      description: "ป้ายนำทางในห้างสรรพสินค้า สนามบิน หรือโรงพยาบาลขนาดใหญ่ — แสดงแผนที่อาคารและค้นหาร้านค้า/แผนกได้ละเอียด ขนาด 49\" มองเห็นชัดจากระยะไกล รองรับ Multi-touch 10 จุดให้หลายคนใช้พร้อมกัน" },
      { image: hr49UcBoardroom,  title: "Conference / Boardroom",         description: "จอประชุมสัมผัส 49\" ในห้องประชุมระดับ Executive — รองรับ Video Conference, Interactive Whiteboard, BYOD ผ่าน HDMI/USB เพิ่มประสิทธิภาพการประชุม Hybrid และนำเสนอแบบ Real-time" },
      { image: hr49UcHotel,      title: "Hotel Lobby / Self Check-in",    description: "ตู้เช็คอินตัวเองในล็อบบี้โรงแรม — แขกสแกน Booking/QR เลือกห้องและรับคีย์การ์ดเองได้ ลดคิวที่ Front desk รองรับ 7×24H พร้อม Mohs 7 ทนการใช้งานหนัก" },
      { image: hr49UcQsr,        title: "QSR / Self-order Counter",       description: "ตู้สั่งอาหารตัวเองในร้าน QSR — เมนูภาพคมชัดบนจอใหญ่ 49\" เพิ่ม upsell 20-30% รองรับ Square / Clover / Shopify POS โดยตรง (Android) ลดคิวและเพิ่มความเร็วในการบริการ" },
    ],
    gallery: [
      hr49P1, hr49P2, hr49P3, hr49P4, hr49P5, hr49P6, hr49P7,
    ],
    ioImage: hr49IoMonitor,
    installImages: [hr49InstallWall, hr49InstallFloor, hr49InstallMobile],
    featureImages: [hr49Feat4],
    dimensionDrawings: [
      {
        image: hr49DimFront,
        title: "Mechanical Dimension — Front View",
        caption: "แบบทางวิศวกรรมด้านหน้าและด้านข้าง — ขนาดภายนอกเครื่อง 1127.2 × 657.4 mm พื้นที่แสดงผล Active Area 1075.8 × 606 mm ความหนาตัวเครื่องจริง 28 mm (ส่วนบาง) ถึง 72 mm (ส่วนกล่อง I/O) เหมาะสำหรับวางแผนช่องเปิดในเฟอร์นิเจอร์/ผนังก่อนติดตั้ง",
        callouts: [
          { label: "ขนาดเครื่อง", value: "1127.2 × 657.4 mm" },
          { label: "Active Area", value: "1075.8 × 606 mm" },
          { label: "ความหนา", value: "28 mm (ขอบ) / 72 mm (กล่อง I/O)" },
          { label: "ขอบจอ (Bezel)", value: "26 mm" },
        ],
      },
      {
        image: hr49DimBack,
        title: "Back View — VESA Mount Layout",
        caption: "แบบด้านหลังพร้อมจุดยึด VESA Mount มาตรฐาน 400 × 400 mm (สกรู 4-M6) — ใช้สำหรับเลือกขายึดผนัง / Floor Stand / Mobile Stand ที่รองรับ VESA 400×400 และวางตำแหน่งช่องเดินสายไฟ/สาย LAN ก่อนหน้างานจริง",
        callouts: [
          { label: "VESA Pattern", value: "400 × 400 mm" },
          { label: "สกรูยึด", value: "4 × M6" },
          { label: "ระยะจาก Top", value: "129.7 mm" },
          { label: "ระยะจาก Bottom", value: "147.7 mm" },
        ],
      },
      {
        image: hr49IoMonitorDiagram,
        title: "Product Diagram — HR49 Touch Monitor (I/O Layout)",
        caption: "เลย์เอาต์พอร์ตของรุ่น Touch Monitor (เฉพาะจอสัมผัส ไม่มี PC ในตัว) — รองรับการต่อกับ PC/OPS/Media Player ภายนอกผ่าน HDMI หรือ DVI/VGA พร้อม Audio in/out และ USB สำหรับสัญญาณ Touch",
        callouts: [
          { label: "Power", value: "Power Button + DC 12V" },
          { label: "Video In", value: "HDMI + DVI + VGA" },
          { label: "USB", value: "USB × 1 (Touch)" },
          { label: "Audio", value: "Audio in/out (3.5mm)" },
        ],
      },
      {
        image: hr49IoX86Diagram,
        title: "Product Diagram — HR49 Windows / Linux PC OPS (I/O Layout)",
        caption: "เลย์เอาต์พอร์ตของรุ่น All-in-One PC พร้อม OPS Intel x86 (i3-4Gen / i5-10Gen / i7-11Gen) — ครบทุก I/O หลักสำหรับ Enterprise: HDMI out, VGA, USB ×2, LAN RJ45 Gigabit, MIC และ Wi-Fi เหมาะกับงาน Conference / Wayfinding / Digital Signage",
        callouts: [
          { label: "Power", value: "Power Button + DC 12V" },
          { label: "Video Out", value: "HDMI + VGA" },
          { label: "USB", value: "USB × 2 (เพิ่มได้สูงสุด 4)" },
          { label: "Network", value: "LAN RJ45 + Wi-Fi" },
          { label: "Audio", value: "MIC in" },
        ],
      },
      {
        image: hr49IoAndroidDiagram,
        title: "Product Diagram — HR49 Android PC (I/O Layout)",
        caption: "เลย์เอาต์พอร์ตของรุ่น All-in-One Android (Rockchip RK3568 / RK3288 / RK3588) — มี TD/SD Card Slot สำหรับขยายพื้นที่จัดเก็บ พร้อม HDMI out, USB ×2, LAN RJ45, Audio และ Wi-Fi รองรับ Square / Stripe / Clover / Shopify POS",
        callouts: [
          { label: "Power", value: "Power Button + DC 12V" },
          { label: "Video Out", value: "HDMI" },
          { label: "USB", value: "USB × 2" },
          { label: "Network", value: "LAN RJ45 + Wi-Fi" },
          { label: "Storage", value: "TD/SD Card Slot" },
          { label: "Audio", value: "Audio (3.5mm)" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: [
      {
        key: "monitor",
        label: "HR49 — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 49\" PCAP ล้วน ๆ — ต่อกับ External PC, OPS หรือ Media Player ผ่าน HDMI in + USB Touch (Plug-and-play) ความสว่าง 300 cd/m² Power Consumption < 100W เหมาะกับ Digital Signage, Wayfinding, Reception ที่มี PC อยู่แล้ว",
        bestFor: "ลูกค้ามี PC/OPS อยู่แล้ว ต้องการเฉพาะจอสัมผัสขนาดใหญ่ 49\"",
        highlights: [
          "ไม่มี PC ในตัว — ปรับเปลี่ยน PC ภายนอกได้",
          "Input: HDMI in + USB Touch + DVI + VGA + Audio in/out",
          "Brightness 300 cd/m² / 60 Hz / 16.7M colors",
          "Power Consumption < 100W",
          "น้ำหนัก 25.9 kg (สุทธิ)",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "HR49 — Windows / Linux PC (OPS)",
        badge: "All-in-One PC (x86 OPS)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 49\" พร้อม OPS Intel x86 ภายใน เลือก CPU ได้ 3 ระดับ — i3 4th Gen (Entry) / i5 10th Gen (Mid) / i7 11th Gen (High) ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน รองรับซอฟต์แวร์ Wayfinding / Digital Signage CMS / Conference / ERP",
        bestFor: "Enterprise / Conference / Wayfinding ที่ใช้ซอฟต์แวร์ Windows-based",
        highlights: [
          "OPS: Intel® Core™ i3-4Gen / i5-10Gen / i7-11Gen",
          "RAM Kingston 4 / 8 / 16 GB",
          "Storage Seagate 128 / 256 / 512 GB",
          "Gigabit RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Power Consumption < 130W",
        ],
        cpu: "Intel Core i3-4Gen / i5-10Gen / i7-11Gen (OPS)",
        ram: "4–16GB Kingston",
        storage: "Seagate 128–512GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "HR49 — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 49\" พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) รองรับ Square / Stripe / Clover / Shopify POS โดยตรง พร้อม Wi-Fi 802.11ac",
        bestFor: "POS Self-order / Hotel Self-service / Wayfinding / Digital Signage ที่ใช้ Android App",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2–8GB + eMMC 16–128GB",
          "Pre-install Android 11 / 9 / 12 (ตามรุ่น CPU)",
          "Wi-Fi 802.11a/b/g/n/ac + RJ45",
          "Power Consumption < 105W",
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
        cpu: "Intel® Core™ i3 4th Gen (OPS)",
        gpu: "Intel® HD Graphics 4600",
        ram: "Kingston 4GB",
        storage: "Seagate 128GB",
        targetUseCase: "Digital Signage, Wayfinding, Self-service Kiosk งานทั่วไป",
      },
      {
        tier: "Mid",
        cpu: "Intel® Core™ i5 10th Gen (OPS)",
        gpu: "Intel® UHD Graphics 630",
        ram: "Kingston 8GB",
        storage: "Seagate 256GB",
        targetUseCase: "Conference Boardroom, Multi-app Wayfinding, ERP/CRM Front-end",
      },
      {
        tier: "High",
        cpu: "Intel® Core™ i7 11th Gen (OPS)",
        gpu: "Intel® Iris® Xe Graphics",
        ram: "Kingston 16GB",
        storage: "Seagate 512GB",
        targetUseCase: "Industrial HMI, 4K Multimedia, AI Video Wall, Healthcare",
      },
      {
        tier: "Entry",
        cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)",
        gpu: "ARM Mali-G52 2EE",
        ram: "LPDDR4 2GB (4GB optional)",
        storage: "eMMC 16GB (32GB optional)",
        targetUseCase: "POS Self-order (Android 11), Digital Signage, Wayfinding",
      },
      {
        tier: "Mid",
        cpu: "Rockchip RK3288 (Quad-core ARM Cortex-A17)",
        gpu: "ARM Mali-T864",
        ram: "LPDDR3 2GB",
        storage: "eMMC 16GB",
        targetUseCase: "Pre-install Android 9 — งาน Legacy POS App ที่ต้องการ Android 9",
      },
      {
        tier: "High",
        cpu: "Rockchip RK3588 (Octa-core, 8nm)",
        gpu: "ARM Mali-G610",
        ram: "LPDDR4 4GB (8GB optional)",
        storage: "eMMC 64GB (128GB optional)",
        targetUseCase: "AI Vision, Multi-app POS, 4K Multimedia, Smart Retail (Android 12)",
      },
    ],
    datasheetUrl: "https://touchwo.com/product/49-touch-pc-hr49/",
    ports: [],
    specs: [
      { title: "Windows / Linux System (OPS x86)", rows: [
        { label: "CPU (เลือกได้)", value: "OPS Intel® Core™ i3-4Gen / i5-10Gen / i7-11Gen" },
        { label: "Graphic GPU", value: "HD Graphics 4600 / UHD 630 / Iris Xe" },
        { label: "Audio", value: "HD Audio: ALC269" },
        { label: "หน่วยความจำ (RAM)", value: "Kingston 4 / 8 / 16 GB" },
        { label: "หน่วยเก็บข้อมูล", value: "Seagate 128 / 256 / 512 GB" },
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
        { label: "ขนาดหน้าจอ", value: "49 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "1076 × 606 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "300 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "3000:1 (Windows OPS) / 1400:1 (Android, Monitor)" },
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
        { label: "ผิวหน้า", value: "Mohs class 7 explosion-proof glass + Surface IP65 waterproof" },
      ]},
      { title: "Operation Environment", rows: [
        { label: "อุณหภูมิทำงาน", value: "0°C - 50°C" },
        { label: "ความชื้นทำงาน", value: "10% - 80%" },
        { label: "อุณหภูมิเก็บรักษา", value: "-5°C - 60°C" },
        { label: "ความชื้นเก็บรักษา", value: "10% - 85%" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง (L×W×H)", value: "112.7 × 65.7 × 6 cm" },
        { label: "ขนาดกล่อง (L×W×H)", value: "122.5 × 66.2 × 14.5 cm" },
        { label: "น้ำหนักสุทธิ", value: "25.9 kg (Monitor) / 26.2 kg (PC/Android)" },
        { label: "น้ำหนักรวม", value: "32.9 kg (Monitor) / 33.2 kg (PC/Android)" },
      ]},
      { title: "Power Supply", rows: [
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 5A" },
        { label: "Standby Power", value: "≤ 0.5W" },
        { label: "Overall Power", value: "Monitor < 100W / Android < 105W / Windows OPS < 130W" },
      ]},
      { title: "External Connectors", rows: [
        { label: "Touch Monitor", value: "Power Socket × 1, DC12V × 1, HDMI in × 1, Audio in/out × 1, DVI × 1, VGA × 1, USB × 1" },
        { label: "Windows / Linux PC (OPS)", value: "Power Button × 1, DC12V × 1, HDMI out × 1, MIC × 1, RJ45 × 1, Wi-Fi × 1, USB × 4, VGA × 1" },
        { label: "Android PC", value: "Power Button × 1, DC12V × 1, HDMI out × 1, Audio × 1, RJ45 × 1, TF/SD × 1, USB × 2, Wi-Fi × 1" },
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
      contrast: "1400-3000:1",
      touch: "PCAP 10pt + Mohs 7 + IP65",
      os: "Monitor / Windows / Linux / Android",
      formFactor: "Configurable AIO 49\"",
      dimensionCm: "112.7 × 65.7 × 6",
      weightKg: "25.9-26.2",
      power: "< 130W",
      install: "Wall / Floor / Mobile Stand",
    },
  },
  hd49: {
    slug: "hd49",
    modelCode: "HD49",
    name: '49" HD49 Series — Touch Monitor / Windows PC / Android PC',
    shortName: "HD49 Series",
    category: "Slim-Bezel 49\" Large-Format Touch Display",
    formFactor: "Configurable AIO",
    tagline: "จอสัมผัส 49\" PCAP FHD — Ultra-slim 13mm Bezel (iPad-like) — เลือก 3 Configuration: Monitor / Windows / Android",
    description:
      "HD49 คือซีรีส์จอสัมผัส 49 นิ้ว FHD 1920×1080 PCAP 10-point ดีไซน์ใหม่ Ultra-slim 13mm Bezel ลด Black Edge กว่า 53% เมื่อเทียบกับรุ่นทั่วไป ให้ความรู้สึก iPad-like ตัวเครื่องบางเพียง 5.7cm น้ำหนักเบา 23.8-24.1 kg — ผิวหน้ากระจก Mohs class 7 explosion-proof + IP65 waterproof, อายุ Backlight 30,000 ชม. รับประกันการใช้งานต่อเนื่อง 3.5 ปี (24/7) อัตราซ่อม 2 ปีต่ำเพียง 1.5% เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor, (2) Windows/Linux All-in-One พร้อม Intel Celeron J6412 / Core i5-8Gen / i7-10Gen, (3) Android All-in-One พร้อม Rockchip RK3568 / RK3288 / RK3588 + Wi-Fi 5GHz + BLE 5.0 — รองรับ Square / Stripe / Clover / Shopify POS",
    highlights: [
      { icon: "Layers", title: "Ultra-slim 13mm Bezel", subtitle: "iPad-like Design / -53% Black Edge" },
      { icon: "Maximize", title: "49\" FHD 1920×1080", subtitle: "16:9 / 300 cd/m² / 60 Hz / IPS 178°" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs 7 + IP65 Surface" },
      { icon: "ShieldCheck", title: "3.5 Years 24/7", subtitle: "Repair Rate 1.5% / 30,000-hr LED" },
    ],
    features: [
      "Ultra-slim 13mm Bezel — ลด Black Edge 53% ดีไซน์ iPad-like",
      "PCAP 10-point Touch — < 5ms / 200Hz / 4096×4096",
      "Mohs 7 + IP65 — ผิวกระจกกันระเบิด ทนน้ำสาด/ฝุ่น",
      "ตัวเครื่องบาง 5.7cm น้ำหนักเบา 23.8-24.1 kg",
      "Industrial PSU + LED 30,000 ชม. — ใช้งาน 24/7 ต่อเนื่อง 3.5 ปี",
      "Wi-Fi 5GHz 802.11ac + BLE 5.0 (Android) — เชื่อมต่อ POS เสถียร",
      "ติดตั้งได้หลากรูปแบบ: Wall / Floor / Desktop / Embedded",
    ],
    useCases: ["QSR / Self-order Counter", "Retail / POS Self-checkout", "Hotel / Lobby Self-service", "Smart Restaurant Menu"],
    useCaseScenarios: [
      { image: hr49UcQsr,        title: "QSR / Self-order Counter",       description: "ตู้สั่งอาหารตัวเองในร้าน QSR — เมนูภาพคมชัดบนจอใหญ่ 49\" ดีไซน์บางเพียง 13mm Bezel ดูทันสมัย เพิ่ม upsell 20-30% รองรับ Square / Clover / Shopify POS โดยตรง (Android) พร้อม BLE 5.0 + Wi-Fi 5GHz เชื่อมต่อ POS เสถียร" },
      { image: hr49UcHotel,      title: "Hotel Lobby / Self Check-in",    description: "ตู้เช็คอินตัวเองในล็อบบี้โรงแรม — ดีไซน์ Slim Bezel เข้ากับงานตกแต่งหรูหรา แขกสแกน QR Booking และรับคีย์การ์ดได้เอง รองรับ 7×24H พร้อมประกัน 3.5 ปี" },
      { image: hr49UcWayfinding, title: "Retail Wayfinding / Directory", description: "ป้ายนำทางในห้างฯ ร้านค้า ตัวเครื่องบางเพียง 5.7cm สามารถฝัง (Embedded) ในผนังได้ พร้อม Touch 10 จุด รองรับการใช้งานหลายคนพร้อมกัน" },
      { image: hr49UcBoardroom,  title: "Smart Restaurant / Showroom",   description: "แสดงเมนู/โปรโมชันในร้านอาหารหรือ Showroom — ภาพ FHD 300 cd/m² Contrast 1200:1 มุมมอง 178° ดูคมชัดทุกมุม Mohs 7 ทนการใช้งานหนัก" },
    ],
    gallery: [
      hd49PMain, hd49PFront, hd49PSide, hd49PPortrait, hd49Hero, hd49PLifestyle,
    ],
    ioImage: hd49PSide,
    installImages: [hd49Install1, hd49Install2, hd49Install3],
    featureImages: [hd49Hero],
    dimensionDrawings: [
      {
        image: hd49PSide,
        title: "Mechanical Dimension — Slim Profile",
        caption: "ตัวเครื่อง 49\" ดีไซน์ Ultra-slim — ขนาด 1127 × 657 × 57 mm (กว้าง × สูง × ลึก) Bezel เพียง 13mm Active Area 1076 × 606 mm น้ำหนัก 23.8 kg (Monitor) / 24.1 kg (PC/Android) — บางและเบาที่สุดในรุ่นเดียวกัน เหมาะกับการติดตั้งแบบ Embedded หรือ Wall Mount ในงานตกแต่งภายในที่ต้องการความเรียบหรู",
        callouts: [
          { label: "ขนาดเครื่อง", value: "1127 × 657 × 57 mm" },
          { label: "Active Area", value: "1076 × 606 mm" },
          { label: "Bezel", value: "13 mm (-53% vs ทั่วไป)" },
          { label: "น้ำหนัก", value: "23.8 / 24.1 kg" },
        ],
      },
      {
        image: hd49IoMonitor,
        title: "I/O Layout — Touch Monitor Configuration",
        caption: "พอร์ตเชื่อมต่อรุ่น Touch Monitor (จอสัมผัสล้วน ไม่มี PC ในตัว) — ออกแบบให้กระชับเรียบง่าย ใช้งานแบบ Plug-and-play กับ External PC / OPS / Media Player: USB สำหรับส่งสัญญาณ Touch (HID Class — ไม่ต้องลง Driver), HDMI + VGA รองรับการต่อสัญญาณภาพจากแหล่งหลากหลาย, Audio Out 3.5mm สำหรับลำโพงภายนอก, DC 12V กินไฟต่ำเหมาะกับ 24/7 Operation",
        callouts: [
          { label: "Touch Signal", value: "USB (HID Plug-and-play)" },
          { label: "Video Input", value: "HDMI + VGA (Dual Source)" },
          { label: "Audio Out", value: "3.5mm Stereo (ลำโพงภายนอก)" },
          { label: "Power", value: "DC 12V (Low-power < 100W)" },
          { label: "OS รองรับ", value: "Windows / Linux / macOS / Android" },
        ],
      },
      {
        image: hd49IoWindows,
        title: "I/O Layout — Windows OPS Configuration",
        caption: "พอร์ตเชื่อมต่อรุ่น Windows / Linux PC OPS — ครบทุกการใช้งานสำหรับองค์กร: HDMI out สำหรับต่อจอเสริม, VGA สำหรับอุปกรณ์รุ่นเก่า, USB ×4 สำหรับเครื่องพิมพ์ใบเสร็จ / Barcode Scanner / Cash Drawer, LAN RJ45 สำหรับเครือข่ายองค์กร พร้อม Audio Out + MIC In รองรับงาน Conference / Video Call ผ่าน Windows 10/11 หรือ Linux Ubuntu",
        callouts: [
          { label: "Display Out", value: "HDMI + VGA (Dual Display)" },
          { label: "USB", value: "USB 3.0 ×4 (Plug-and-play อุปกรณ์ POS)" },
          { label: "Network", value: "LAN RJ45 + Wi-Fi 5GHz + BT 5.0" },
          { label: "Audio", value: "Line Out + MIC In (3.5mm)" },
          { label: "Power", value: "DC 12V (External Adapter)" },
        ],
      },
      {
        image: hd49IoAndroid,
        title: "I/O Layout — Android Configuration",
        caption: "พอร์ตเชื่อมต่อรุ่น Android PC — ออกแบบให้กระชับสำหรับงาน Kiosk / Self-service: HDMI out สำหรับ Mirror จอ, USB ×2 สำหรับเครื่องอ่านบัตร / Printer, LAN RJ45 + Wi-Fi เสถียรสำหรับการเชื่อมต่อ Cloud POS, TF Card Slot สำหรับขยายพื้นที่จัดเก็บสื่อโฆษณา + Audio Out รองรับลำโพงภายนอก ทำงานบน Android 11/12 พร้อม BLE 5.0",
        callouts: [
          { label: "Display Out", value: "HDMI Out (Mirror / Extend)" },
          { label: "USB", value: "USB ×2 (POS / Reader / Printer)" },
          { label: "Network", value: "LAN RJ45 + Wi-Fi + BLE 5.0" },
          { label: "Storage", value: "TF Card Slot (ขยายได้สูงสุด 128GB)" },
          { label: "Power", value: "DC 12V (Low Power < 30W)" },
        ],
      },
      {
        image: hd49P3,
        title: "Size Lineup — เลือกขนาดได้ตามการใช้งาน",
        caption: "Interactive Display by ENT Group — HD Series มีให้เลือกครบ 8 ขนาด ตั้งแต่ 21.5\" สำหรับ POS / Self-order Counter ไปจนถึง 65\" สำหรับ Digital Signage / Wayfinding ขนาดใหญ่ ทุกรุ่นใช้แพลตฟอร์มเดียวกัน — Slim Bezel 13mm, PCAP 10-point Touch, Mohs 7 Glass — เปลี่ยนขนาดได้โดยไม่ต้องเปลี่ยนซอฟต์แวร์หรืออุปกรณ์เสริม รุ่น 49\" คือจุดสมดุลระหว่างพื้นที่แสดงผลกับต้นทุน เหมาะกับ Self-service Kiosk, Smart Menu Board และ Boardroom ขนาดกลาง",
        callouts: [
          { label: "ขนาดที่เลือกได้", value: "21.5\" / 23.8\" / 27\" / 32\" / 43\" / 49\" / 55\" / 65\"" },
          { label: "Touch Technology", value: "PCAP 10-point (เหมือนกันทุกขนาด)" },
          { label: "Bezel", value: "13 mm Slim (Unified Design)" },
          { label: "รุ่นนี้", value: "49\" — Smart Kiosk / Boardroom / Signage" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: [
      {
        key: "monitor",
        label: "HD49 — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 49\" PCAP ล้วน ๆ ดีไซน์ Slim Bezel 13mm — ต่อกับ External PC, OPS หรือ Media Player ผ่าน HDMI in + USB Touch (Plug-and-play) Power Consumption < 100W น้ำหนักเบาเพียง 23.8 kg",
        bestFor: "ลูกค้ามี PC/OPS อยู่แล้ว ต้องการเฉพาะจอสัมผัสขนาดใหญ่ 49\" ดีไซน์บางทันสมัย",
        highlights: [
          "ไม่มี PC ในตัว — ปรับเปลี่ยน PC ภายนอกได้",
          "Input: HDMI in + USB + VGA + Audio in/out",
          "Brightness 300 cd/m² / 60 Hz / Contrast 1200:1",
          "Power Consumption < 100W",
          "น้ำหนัก 23.8 kg (สุทธิ) / Bezel 13mm",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "HD49 — Windows / Linux PC",
        badge: "All-in-One PC (x86)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 49\" Slim Bezel พร้อม Intel x86 ภายใน เลือก CPU ได้ 3 ระดับ — Intel Celeron J6412 (Entry) / Core i5-8Gen (Mid) / Core i7-10Gen (High) — RAM DDR4 4-16GB + mSATA 128-512GB ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน",
        bestFor: "Retail / QSR / Hotel ที่ใช้ซอฟต์แวร์ Windows-based และต้องการดีไซน์บางทันสมัย",
        highlights: [
          "CPU: Intel Celeron J6412 / Core i5-8Gen / i7-10Gen",
          "RAM DDR4-2666 4 / 8 / 16 GB",
          "Storage mSATA 128 / 256 / 512 GB",
          "Gigabit RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Power Consumption < 130W",
        ],
        cpu: "Intel Celeron J6412 / Core i5-8Gen / i7-10Gen",
        ram: "4–16GB DDR4-2666",
        storage: "mSATA 128–512GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "HD49 — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 49\" Slim Bezel พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) พร้อม Wi-Fi 5GHz 802.11ac + BLE 5.0 รองรับ Square / Stripe / Clover / Shopify POS โดยตรง",
        bestFor: "POS Self-order / QSR / Retail / Hotel Self-service ที่ใช้ Android App",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2–8GB + eMMC 16–128GB",
          "Pre-install Android 11 / 9 / 12 (ตามรุ่น CPU)",
          "Wi-Fi 5GHz + BLE 5.0 (Secure POS Connectivity)",
          "Power Consumption < 130W",
        ],
        cpu: "Rockchip RK3568 / RK3288 / RK3588",
        ram: "2–8GB",
        storage: "eMMC 16–128GB",
        accent: "secondary",
      },
    ],
    cpuOptions: [
      {
        tier: "Entry",
        cpu: "Intel® Celeron® J6412 (Quad-core)",
        gpu: "Intel® UHD Graphics",
        ram: "DDR4 4GB",
        storage: "mSATA 128GB",
        targetUseCase: "POS / Self-order / Digital Signage งานทั่วไป — คุ้มค่าที่สุด",
      },
      {
        tier: "Mid",
        cpu: "Intel® Core™ i5 8th Gen",
        gpu: "Intel® Iris® Plus Graphics 645",
        ram: "DDR4 8GB",
        storage: "mSATA 256GB",
        targetUseCase: "Multi-app POS, ERP/CRM Front-end, Retail Self-checkout",
      },
      {
        tier: "High",
        cpu: "Intel® Core™ i7 10th Gen",
        gpu: "Intel® UHD Graphics",
        ram: "DDR4 16GB",
        storage: "mSATA 512GB",
        targetUseCase: "4K Multimedia, Smart Restaurant, AI Vision Retail",
      },
      {
        tier: "Entry",
        cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)",
        gpu: "ARM Mali-G52 2EE",
        ram: "LPDDR4 2GB (4GB optional)",
        storage: "eMMC 32GB",
        targetUseCase: "POS Self-order (Android 11), Wi-Fi 5GHz + BLE 5.0",
      },
      {
        tier: "Mid",
        cpu: "Rockchip RK3288 (Quad-core ARM Cortex-A17)",
        gpu: "ARM Mali-T864",
        ram: "LPDDR3 2GB (4GB optional)",
        storage: "eMMC 16GB (32GB optional)",
        targetUseCase: "Pre-install Android 9 — งาน Legacy POS App",
      },
      {
        tier: "High",
        cpu: "Rockchip RK3588 (Octa-core, 8nm)",
        gpu: "ARM Mali-G610",
        ram: "LPDDR4 4GB (8GB optional)",
        storage: "eMMC 64GB (128GB optional)",
        targetUseCase: "AI Vision, Multi-app POS, 4K Multimedia (Android 12)",
      },
    ],
    datasheetUrl: "https://touchwo.com/wp-content/uploads/2024/11/HD49-X86-TouchWo-SpecSheet.pdf",
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
        { label: "เครือข่าย", value: "10/100M หรือ 100/1000M RJ45 + Wi-Fi 802.11a/b/g/n/ac (5GHz) + BLE 5.0" },
        { label: "OS ที่ติดตั้งให้", value: "Android 11 (RK3568) / Android 9 (RK3288) / Android 12 (RK3588)" },
      ]},
      { title: "LCD Panel", rows: [
        { label: "ขนาดหน้าจอ", value: "49 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "1076 × 606 mm" },
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
        { label: "ขนาดเครื่อง (W×H×T)", value: "112.7 × 65.7 × 5.7 cm (Bezel 13mm)" },
        { label: "ขนาดกล่อง (W×H×T)", value: "127 × 79 × 18.3 cm" },
        { label: "น้ำหนักสุทธิ", value: "23.8 kg (Monitor) / 24.1 kg (PC/Android)" },
        { label: "น้ำหนักรวม", value: "30.3 kg (Monitor) / 30.6 kg (PC/Android)" },
      ]},
      { title: "Power Supply", rows: [
        { label: "Power Input", value: "100-240V AC 50/60Hz" },
        { label: "Standby Power", value: "≤ 0.5W" },
        { label: "Overall Power", value: "Monitor < 100W / Windows < 130W / Android < 130W" },
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
      resolution: "1920×1080 FHD",
      brightness: "300 cd/m²",
      contrast: "1200:1",
      touch: "PCAP 10pt + Mohs 7 + IP65",
      os: "Monitor / Windows / Linux / Android",
      formFactor: "Slim-Bezel 13mm AIO 49\"",
      dimensionCm: "112.7 × 65.7 × 5.7",
      weightKg: "23.8-24.1",
      power: "< 130W",
      install: "Wall / Floor / Desktop / Embedded",
    },
  },
};

export const DISPLAY_49_ORDER: Display49Slug[] = ["hr49", "hd49"];

export const getDisplay49 = (slug: string): Display32 | undefined =>
  (DISPLAYS_49 as Record<string, Display32>)[slug];

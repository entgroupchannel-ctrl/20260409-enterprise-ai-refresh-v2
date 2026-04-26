/**
 * Touch Display 98" — RZ98B Configurable AIO (Monitor / Windows OPS / Android)
 * แหล่งสเปก: touchwo.com (RZ98B Series)
 *  - RZ98B Touch Monitor:    https://touchwo.com/product/elo-monitor-98-touch-monitor-rz98b/
 *  - RZ98B Touch PC (x86):   https://touchwo.com/product/elo-monitor-98-touch-pc-rz98b/
 *  - RZ98B Android Touch PC: https://touchwo.com/product/elo-monitor-98-android-touch-pc-rz98b/
 *
 * โครงสร้างซีรีส์เดียวกับ RZ86B แต่ใช้ Panel 98" 4K UHD (Active 2157.9 × 1213.35 mm)
 * ขนาดเครื่อง 221.6 × 131.7 × 10.7 cm — น้ำหนักสุทธิ 88 kg / รวม 102 kg
 * Power: Windows OPS 720W / Monitor & Android < 640W
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";

import rz98Monitor from "@/assets/touchwo/rz98b/p-monitor.jpg";
import rz98Windows from "@/assets/touchwo/rz98b/p-windows.jpg";
import rz98Android from "@/assets/touchwo/rz98b/p-android.jpg";
import rz98P1 from "@/assets/touchwo/rz98b/p-1.jpg";
import rz98DimBack from "@/assets/touchwo/rz98b/p-7.jpg";
import rz98IoMonitor from "@/assets/touchwo/rz98b/dim-io-monitor.jpg";
import rz98IoPc from "@/assets/touchwo/rz98b/dim-io-pc.jpg";
import rz98IoAndroid from "@/assets/touchwo/rz98b/dim-io-android.jpg";
import rz98Io from "@/assets/touchwo/rz98b/io.jpg";
import rz98Feat1 from "@/assets/touchwo/rz98b/feat-1.png";
import rz98Feat2 from "@/assets/touchwo/rz98b/feat-2.png";
import rz98Feat3 from "@/assets/touchwo/rz98b/feat-3.png";
import rz98Feat4 from "@/assets/touchwo/rz98b/feat-4.png";
import rz98InstallFloor from "@/assets/touchwo/rz98b/install-floor.png";
import rz98InstallWall from "@/assets/touchwo/rz98b/install-wall.png";
import rz98InstallAcc from "@/assets/touchwo/rz98b/install-acc.png";

import rz98UcClassroom from "@/assets/touchwo/usecases/rz98b/uc-classroom.jpg";
import rz98UcBoardroom from "@/assets/touchwo/usecases/rz98b/uc-boardroom.jpg";
import rz98UcWayfinding from "@/assets/touchwo/usecases/rz98b/uc-wayfinding.jpg";
import rz98UcIndustrial from "@/assets/touchwo/usecases/rz98b/uc-industrial.jpg";
import rz98UcShowroom from "@/assets/touchwo/usecases/rz98b/uc-showroom.jpg";
import rz98UcHotel from "@/assets/touchwo/usecases/rz98b/uc-hotel.jpg";

export type Display98Slug = "rz98b";
export { OS_BACKGROUNDS };
export type { OSKey };

export const DISPLAYS_98: Record<Display98Slug, Display32> = {
  rz98b: {
    slug: "rz98b",
    modelCode: "RZ98B",
    name: '98" RZ98B Series — Touch Monitor / Windows OPS / Android PC',
    shortName: "RZ98B Series",
    category: "98\" 4K UHD Touch Display (Modular Smart Terminal)",
    formFactor: "Configurable AIO",
    tagline: "จอสัมผัสขนาดสุดยอด 98\" 4K UHD PCAP — Modular Plug-and-Play — เลือก 3 Configuration: Monitor / Windows OPS / Android",
    description:
      "RZ98B คือจอสัมผัสขนาดสุดยอด 98 นิ้ว ความละเอียด 4K UHD 3840×2160 พร้อมเทคโนโลยี PCAP 10-point — ออกแบบเป็น Modular Smart Terminal เปลี่ยนระหว่าง Monitor / Windows / Android ได้ง่ายแบบ Plug-and-Play พร้อม Embedded Tempered Glass + Front-Facing Speakers ให้เสียงคมชัดส่งตรงสู่ผู้ใช้ — ผิวสัมผัส Mohs class 7 explosion-proof, Contrast 5000:1 มุมมอง 178°/178° พื้นที่แสดงผล 2157.9 × 1213.35 mm — ตัวเครื่องบางเพียง 10.7 cm รองรับการติดตั้ง Wall-mount หรือ Floor-standing เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor ต่อ External PC, (2) Windows All-in-One พร้อม OPS — Intel Core i3-4Gen / i5-10Gen / i7-11Gen, (3) Android All-in-One พร้อม Rockchip RK3568 / RK3288 / RK3588",
    highlights: [
      { icon: "Maximize", title: "98\" 4K UHD 3840×2160", subtitle: "16:9 / 350 cd/m² / Contrast 5000:1" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "Mohs 7 + Tempered Glass" },
      { icon: "Box", title: "Modular Smart Terminal", subtitle: "Plug-and-Play เปลี่ยนระบบได้ง่าย" },
      { icon: "ShieldCheck", title: "IP65 Surface Waterproof", subtitle: "Industrial-grade Power 24/7" },
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
      "Industrial-grade Power Supply — รองรับ 7×24H Stable Working",
      "Surface IP65 Waterproof — กันน้ำ-ฝุ่นระดับอุตสาหกรรม",
      "Pre-install Windows 10/11 / Linux / Android 9/11/12",
      "ติดตั้งได้: Wall-mount / Floor-standing / Mobile Stand",
      "Ultra-Slim Metal Design — ตัวเครื่องบางเพียง 10.7 cm",
    ],
    useCases: ["Mega Auditorium 98\"", "Executive Boardroom", "Airport Wayfinding", "Industrial SCADA", "Premium Showroom", "Hotel Concierge"],
    useCaseScenarios: [
      {
        image: rz98UcClassroom,
        title: "Mega Auditorium / Lecture Hall — ห้องบรรยายขนาดใหญ่พิเศษ",
        description:
          "จอสัมผัส 4K UHD 98\" สำหรับ Auditorium 200+ ที่นั่ง — มองเห็นชัดทุกมุมห้องแม้นั่งหลังห้อง 30 เมตร PCAP 10-point รองรับการเขียนหลายมือพร้อมกัน Mohs 7 ทนการกดเขียนต่อเนื่อง เหมาะกับ Active Learning, TED-style Talk, ห้องบรรยายมหาวิทยาลัย",
      },
      {
        image: rz98UcBoardroom,
        title: "Executive Boardroom — ห้องประชุมผู้บริหารระดับสูง",
        description:
          "จอ 98\" 4K UHD แสดงผล Dashboard / Financial Charts / Video Conference ได้คมชัดในห้องประชุมขนาดใหญ่พิเศษ — รองรับ OPS PC Intel Core i7-11Gen + Wireless Presentation Front-facing Speaker เสียงตรงสู่โต๊ะประชุมยาว 6-8 เมตร Modular Design อัปเกรด PC ได้ในอนาคต",
      },
      {
        image: rz98UcWayfinding,
        title: "Airport / Mall Wayfinding — ตู้แผนที่นำทางขนาดใหญ่พิเศษ",
        description:
          "ตู้นำทางขนาดยักษ์ในสนามบินนานาชาติ ห้างสรรพสินค้า หรืออาคารราชการ — แผนที่ 4K UHD เห็นรายละเอียดชัดในระยะ 10-20 เมตร เลือกเส้นทาง พิมพ์ QR Code นำทาง ติดตั้งแบบ Wall-mount หรือ Floor-standing PCAP รองรับการใช้งานหนาแน่น 24/7",
      },
      {
        image: rz98UcIndustrial,
        title: "Industrial SCADA — Mega Control Room",
        description:
          "Dashboard ควบคุมโรงงานขนาดใหญ่ — แสดง KPI, OEE, Machine Status, Andon Board แบบ Real-time จอ 4K UHD 98\" เห็นข้อมูลละเอียดจากระยะไกลทั่วทั้ง Control Room Industrial Power 24/7 รองรับการสัมผัสด้วยถุงมือ",
      },
      {
        image: rz98UcShowroom,
        title: "Premium Showroom — Life-size Configurator",
        description:
          "จอ Configurator 98\" 4K UHD แสดงผลผลิตภัณฑ์พรีเมียม (รถยนต์, เรือยอชต์, อสังหาฯ) ในขนาดเสมือนจริง 1:1 — ลูกค้าเลือกสี รุ่น ออปชัน ดูภายใน-ภายนอก แบบ 360° Front-facing Speaker เสริมประสบการณ์ด้วยเสียงนำเสนอ",
      },
      {
        image: rz98UcHotel,
        title: "Hotel Lobby Concierge — Mega Digital Directory",
        description:
          "จอ 98\" Wall-mount ในล็อบบี้โรงแรมระดับ 5 ดาว — Directory ห้องอาหาร, สปา, Activities, Local Attractions พร้อม Map เห็นภาพชัดในระยะ 10-25 เมตร Mohs 7 ทนการสัมผัสต่อเนื่อง รองรับหลายภาษา (Multi-language UI)",
      },
    ],
    gallery: [rz98P1, rz98Monitor, rz98Windows, rz98Android],
    ioImage: rz98Io,
    installImages: [rz98InstallFloor, rz98InstallWall, rz98InstallAcc],
    featureImages: [rz98Feat1, rz98Feat2, rz98Feat3, rz98Feat4],
    dimensionDrawings: [
      {
        image: rz98DimBack,
        title: "Mechanical Dimension & VESA Mount — Rear View",
        caption: "แบบทางวิศวกรรมด้านหลังของ RZ98B ขนาด 98\" 4K UHD — ตัวเครื่อง 2216 × 1317 × 107 mm (กว้าง × สูง × ลึก) Active Area 2157.9 × 1213.35 mm พร้อมโครงสร้างเหล็กเสริมแกร่งรองรับน้ำหนัก 88 kg มาตรฐานยึด VESA 800 × 400 mm ใช้สกรู 4-M8 รองรับ Wall-mount, Floor Stand และ Mobile Stand งาน Heavy-duty",
        callouts: [
          { label: "ขนาดภายนอก (W×H×D)", value: "2216 × 1317 × 107 mm" },
          { label: "พื้นที่แสดงผล (Active Area)", value: "2157.9 × 1213.35 mm" },
          { label: "VESA Pattern / สกรู", value: "800 × 400 mm / 4-M8" },
          { label: "น้ำหนักสุทธิ / รวม", value: "88 kg / 102 kg" },
        ],
      },
      {
        image: rz98IoMonitor,
        title: "I/O Layout — Touch Monitor Variant",
        caption: "ผังพอร์ต I/O สำหรับรุ่น Touch Monitor (ไม่มี PC ในตัว) — ออกแบบให้ต่อกับ External PC, OPS หรือ Media Player ได้ง่าย รองรับสัญญาณภาพ HDMI / VGA / AV และส่งสัญญาณสัมผัสกลับผ่าน USB Touch (Plug-and-play)",
        callouts: [
          { label: "Video In", value: "HDMI, VGA, AV" },
          { label: "Touch Out", value: "USB ×1" },
          { label: "Audio", value: "Audio in/out (3.5mm)" },
          { label: "อื่น ๆ", value: "RF Antenna" },
        ],
      },
      {
        image: rz98IoPc,
        title: "I/O Layout — Windows OPS PC Variant",
        caption: "ผังพอร์ต I/O สำหรับรุ่น Windows / Linux OPS PC (All-in-One) — ครบครันด้วย LAN Gigabit, USB ×3, HDMI, VGA และ Wi-Fi 802.11ac เพื่อให้ติดตั้งใช้งานได้ทันทีในห้องประชุม Auditorium หรือ Wayfinding ขนาดใหญ่",
        callouts: [
          { label: "Network", value: "LAN RJ45 + Wi-Fi 802.11ac" },
          { label: "Video", value: "HDMI, VGA" },
          { label: "USB", value: "USB ×3" },
          { label: "Audio / Power", value: "Audio in/out + Power Button" },
        ],
      },
      {
        image: rz98IoAndroid,
        title: "I/O Layout — Android PC Variant",
        caption: "ผังพอร์ต I/O สำหรับรุ่น Android All-in-One PC (Rockchip RK3568 / RK3288 / RK3588) — รองรับการเชื่อมต่อแบบครบวงจรเช่นเดียวกับรุ่น Windows OPS เหมาะกับงาน Digital Signage, Self-service Kiosk และ Wayfinding ที่ต้องการความเสถียรสูง 7×24H",
        callouts: [
          { label: "Network", value: "LAN RJ45 + Wi-Fi 802.11ac" },
          { label: "Video", value: "HDMI, VGA" },
          { label: "USB", value: "USB ×3" },
          { label: "Audio / Power", value: "Audio in/out + Power Button" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: [
      {
        key: "monitor",
        label: "RZ98B — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 98\" 4K UHD PCAP ล้วน ๆ ดีไซน์ Modular — ต่อกับ External PC, OPS หรือ Media Player ผ่าน HDMI input + VGA + USB Touch (Plug-and-play) พร้อม Embedded Tempered Glass + Front-facing Speakers — Power Output DC 12V 5A น้ำหนักสุทธิ 88 kg มาพร้อม Wall mount bracket, Power & USB & HDMI cable, Remote control",
        bestFor: "ลูกค้ามี PC/OPS อยู่แล้ว ต้องการเฉพาะจอสัมผัสขนาดสุดยอด 98\" 4K UHD แบบ Modular",
        highlights: [
          "ไม่มี PC ในตัว — ต่อ PC ภายนอกผ่าน HDMI + VGA + USB Touch",
          "4K UHD 3840×2160 / 16:9 / Refresh 4K-30Hz",
          "Brightness 350 cd/m² / Contrast 5000:1",
          "PCAP 10-point Touch / Mohs 7 Tempered Glass",
          "Front-facing Speakers — เสียงตรงสู่ผู้ใช้",
          "น้ำหนักสุทธิ 88 kg / Profile 10.7 cm",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "RZ98B — Windows / Linux PC (OPS)",
        badge: "All-in-One PC (OPS Architecture)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 98\" 4K UHD พร้อม OPS Slot ภายใน เลือก CPU ได้ 3 ระดับ — Intel Core i3 4-Gen (Entry) / Core i5 10-Gen (Mid) / Core i7 11-Gen (High) — RAM Kingston 4-16GB + Seagate SSD 128-512GB ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน — ดีไซน์ Modular เปลี่ยน OPS ได้ในอนาคต พร้อม Refresh Rate 60Hz",
        bestFor: "Mega Auditorium / Executive Boardroom / Lecture Hall ขนาดใหญ่พิเศษที่ต้องการอัปเกรด OPS PC ได้",
        highlights: [
          "OPS Architecture — เปลี่ยน OPS PC ได้ภายหลัง",
          "CPU: Intel Core i3-4Gen / i5-10Gen / i7-11Gen",
          "GPU: HD Graphics 4600 / UHD 630 / Iris® Xe",
          "RAM Kingston 4 / 8 / 16 GB",
          "Storage Seagate SSD 128 / 256 / 512 GB",
          "Gigabit RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Overall Power Consumption 720W",
        ],
        cpu: "Intel Core i3-4Gen / i5-10Gen / i7-11Gen (OPS)",
        ram: "4–16GB Kingston",
        storage: "Seagate SSD 128–512GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "RZ98B — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 98\" 4K UHD พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) พร้อม Wi-Fi 802.11ac — เหมาะกับ Education App, Public Self-service และ Digital Signage 4K ขนาดสุดยอด",
        bestFor: "Mega Auditorium / Public Kiosk / Digital Signage 4K ที่ใช้ Android App ขนาดใหญ่พิเศษ",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2–8GB + eMMC 16–128GB",
          "Pre-install Android 11 / 9 / 12 (ตามรุ่น CPU)",
          "10/100M RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Refresh Rate 4K-30Hz",
          "Overall Power Consumption < 640W",
        ],
        cpu: "Rockchip RK3568 / RK3288 / RK3588",
        ram: "2–8GB",
        storage: "eMMC 16–128GB",
        accent: "secondary",
      },
    ],
    cpuOptions: [
      { tier: "Entry", cpu: "Intel® Core™ i3 4th Gen (OPS)", gpu: "Intel® HD Graphics 4600", ram: "Kingston 4GB", storage: "Seagate SSD 128GB", targetUseCase: "ห้องประชุมขนาดใหญ่พิเศษ / Digital Signage งานทั่วไป" },
      { tier: "Mid", cpu: "Intel® Core™ i5 10th Gen (OPS)", gpu: "Intel® UHD Graphics 630", ram: "Kingston 8GB", storage: "Seagate SSD 256GB", targetUseCase: "Mega Auditorium, Conference Room, Wireless Presentation" },
      { tier: "High", cpu: "Intel® Core™ i7 11th Gen (OPS)", gpu: "Intel® Iris® Xe Graphics", ram: "Kingston 16GB", storage: "Seagate SSD 512GB", targetUseCase: "Executive Boardroom 4K, Video Conferencing, AI/Analytics Workloads" },
      { tier: "Entry", cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)", gpu: "ARM Mali-G52 2EE", ram: "LPDDR4 2GB (4GB optional)", storage: "eMMC 16GB (32GB optional)", targetUseCase: "Education App, Self-service Kiosk (Android 11)" },
      { tier: "Mid", cpu: "Rockchip RK3288 (Quad-core ARM Cortex-A17)", gpu: "ARM Mali-T864", ram: "LPDDR3 2GB", storage: "eMMC 16GB", targetUseCase: "Pre-install Android 9 — งาน Legacy App" },
      { tier: "High", cpu: "Rockchip RK3588 (Octa-core, 8nm)", gpu: "ARM Mali-G610", ram: "LPDDR4 4GB (8GB optional)", storage: "eMMC 64GB (128GB optional)", targetUseCase: "AI Vision, 4K Multimedia, Smart Whiteboard (Android 12)" },
    ],
    datasheetUrl: "https://touchwo.com/wp-content/uploads/2024/11/RZ98B-Monitor-TouchWo-SpecSheet.pdf",
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
        { label: "ขนาดหน้าจอ", value: "98 นิ้ว" },
        { label: "ความละเอียด", value: "3840 × 2160 (4K UHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "2157.9 × 1213.35 mm" },
        { label: "จำนวนสี", value: "16.7M" },
        { label: "ความสว่าง", value: "350 cd/m²" },
        { label: "อัตราส่วนความเปรียบต่าง", value: "5000:1" },
        { label: "มุมมอง H/V", value: "178° / 178°" },
        { label: "อายุ Backlight", value: "LED 50,000 ชม." },
        { label: "Refresh Rate", value: "Monitor / Android 4K-30Hz, Windows OPS 60Hz" },
      ]},
      { title: "Touch Panel", rows: [
        { label: "เทคโนโลยี", value: "PCAP (Capacitive)" },
        { label: "Response Time", value: "< 5ms" },
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
        { label: "Surface Protection", value: "IP65 Waterproof" },
      ]},
      { title: "Dimension & Weight", rows: [
        { label: "ขนาดเครื่อง (L×W×H)", value: "221.6 × 131.7 × 10.7 cm" },
        { label: "ขนาดกล่อง (L×W×H)", value: "235.5 × 145.5 × 23.5 cm" },
        { label: "น้ำหนักสุทธิ", value: "88 kg" },
        { label: "น้ำหนักรวม", value: "102 kg" },
      ]},
      { title: "Power Supply", rows: [
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 5A" },
        { label: "Standby Power", value: "≤ 0.5W" },
        { label: "Overall Power Consumption", value: "Windows OPS 720W / Monitor & Android < 640W" },
      ]},
      { title: "Construction & Features", rows: [
        { label: "Design", value: "Modular Smart Terminal — Plug-and-Play / Ultra-Slim Metal" },
        { label: "Glass Protection", value: "Embedded Tempered Glass + Mohs 7" },
        { label: "Speakers", value: "Front-Facing Speakers (เสียงตรงสู่ผู้ใช้)" },
        { label: "System Switching", value: "เปลี่ยน Windows ↔ Android ได้ง่าย (Modular)" },
        { label: "Series Range", value: "55\" - 110\" (RZ Series ขนาดอื่น)" },
      ]},
      { title: "External Connectors", rows: [
        { label: "Touch Monitor", value: "HDMI in × 1, VGA × 1, PC Audio in × 1, Audio out × 1, USB × 1, Touch out × 1, RF × 1, AV in × 1" },
        { label: "Windows / Linux PC (OPS)", value: "HDMI out × 1, VGA × 1, USB × 6, RJ45 Gigabit, Wi-Fi, MIC × 1, Earphone × 1, PWM Power × 1" },
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
      formFactor: "Modular 10.7 cm 98\"",
      dimensionCm: "221.6 × 131.7 × 10.7",
      weightKg: "88",
      power: "DC 12V 5A",
      install: "Wall / Floor / Mobile Stand",
    },
  },
};

export const DISPLAY_98_ORDER: Display98Slug[] = ["rz98b"];

export const getDisplay98 = (slug: string): Display32 | undefined =>
  DISPLAYS_98[slug as Display98Slug];

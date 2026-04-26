/**
 * Touch Display 75" — RZ75B Configurable AIO (Monitor / Windows OPS / Android)
 * แหล่งสเปก: touchwo.com (RZ75B Series)
 *  - RZ75B Touch Monitor:   https://touchwo.com/product/elo-monitor-75-touch-monitor-rz75b/
 *  - RZ75B Touch PC (x86):  https://touchwo.com/product/elo-monitor-75-touch-pc-rz75b/
 *  - RZ75B Android Touch PC: https://touchwo.com/product/elo-monitor-75-android-touch-pc-rz75b/
 *
 * โครงสร้างซีรีส์เดียวกับ RZ65B แต่จอใหญ่ขึ้นเป็น 75" 4K UHD (Active 1649.6 × 927.9 mm)
 * ขนาดเครื่อง 170.8 × 101.3 × 8.3 cm — น้ำหนักสุทธิ 43 kg / รวม 53 kg
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";

import rz75Monitor from "@/assets/touchwo/rz75b/p-monitor.jpg";
import rz75Windows from "@/assets/touchwo/rz75b/p-windows.jpg";
import rz75Android from "@/assets/touchwo/rz75b/p-android.jpg";
import rz75P3 from "@/assets/touchwo/rz75b/p-3.jpg";
import rz75P4 from "@/assets/touchwo/rz75b/p-4.jpg";
import rz75P5 from "@/assets/touchwo/rz75b/p-5.jpg";
import rz75P6 from "@/assets/touchwo/rz75b/p-6.jpg";
import rz75P7 from "@/assets/touchwo/rz75b/p-7.jpg";
import rz75Io from "@/assets/touchwo/rz75b/io.jpg";
import rz75Feat1 from "@/assets/touchwo/rz75b/feat-1.png";
import rz75Feat2 from "@/assets/touchwo/rz75b/feat-2.png";
import rz75Feat3 from "@/assets/touchwo/rz75b/feat-3.png";
import rz75Feat4 from "@/assets/touchwo/rz75b/feat-4.png";
import rz75InstallFloor from "@/assets/touchwo/rz75b/install-floor.png";
import rz75InstallWall from "@/assets/touchwo/rz75b/install-wall.png";
import rz75InstallAcc from "@/assets/touchwo/rz75b/install-acc.png";

// RZ75B — Use Case lifestyle scenes
import rz75UcClassroom from "@/assets/touchwo/usecases/rz75b/uc-classroom.jpg";
import rz75UcBoardroom from "@/assets/touchwo/usecases/rz75b/uc-boardroom.jpg";
import rz75UcWayfinding from "@/assets/touchwo/usecases/rz75b/uc-wayfinding.jpg";
import rz75UcIndustrial from "@/assets/touchwo/usecases/rz75b/uc-industrial.jpg";
import rz75UcShowroom from "@/assets/touchwo/usecases/rz75b/uc-showroom.jpg";
import rz75UcHotel from "@/assets/touchwo/usecases/rz75b/uc-hotel.jpg";

export type Display75Slug = "rz75b";
export { OS_BACKGROUNDS };
export type { OSKey };

export const DISPLAYS_75: Record<Display75Slug, Display32> = {
  rz75b: {
    slug: "rz75b",
    modelCode: "RZ75B",
    name: '75" RZ75B Series — Touch Monitor / Windows OPS / Android PC',
    shortName: "RZ75B Series",
    category: "75\" 4K UHD Touch Display (Modular Smart Terminal)",
    formFactor: "Configurable AIO",
    tagline: "จอสัมผัสขนาดใหญ่ 75\" 4K UHD PCAP — Modular Plug-and-Play — เลือก 3 Configuration: Monitor / Windows OPS / Android",
    description:
      "RZ75B คือจอสัมผัสขนาดใหญ่ 75 นิ้ว ความละเอียด 4K UHD 3840×2160 พร้อมเทคโนโลยี PCAP 10-point — ออกแบบเป็น Modular Smart Terminal เปลี่ยนระหว่าง Monitor / Windows / Android ได้ง่ายแบบ Plug-and-Play พร้อม Embedded Tempered Glass + Front-Facing Speakers ให้เสียงคมชัดส่งตรงสู่ผู้ใช้ — ผิวสัมผัส Mohs class 7 explosion-proof, Contrast 5000:1 มุมมอง 178°/178° พื้นที่แสดงผล 1649.6 × 927.9 mm — ตัวเครื่องบางเพียง 8.3 cm รองรับการติดตั้ง Wall-mount หรือ Floor-standing เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor ต่อ External PC, (2) Windows All-in-One พร้อม OPS — Intel Core i3-4Gen / i5-10Gen / i7-11Gen, (3) Android All-in-One พร้อม Rockchip RK3568 / RK3288 / RK3588",
    highlights: [
      { icon: "Maximize", title: "75\" 4K UHD 3840×2160", subtitle: "16:9 / 350 cd/m² / Contrast 5000:1" },
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
      "Ultra-Slim Metal Design — ตัวเครื่องบางเพียง 8.3 cm",
    ],
    useCases: ["Smart Classroom 75\"", "Corporate Boardroom", "Airport Wayfinding", "Industrial SCADA", "Auto Showroom", "Hotel Concierge"],
    useCaseScenarios: [
      {
        image: rz75UcClassroom,
        title: "Smart Classroom — ห้องเรียนขนาดใหญ่",
        description:
          "จอสัมผัส 4K UHD 75\" เป็นกระดานดิจิทัลขนาดใหญ่ มองเห็นชัดทุกมุมห้องแม้นั่งหลังห้อง — PCAP 10-point รองรับการเขียนหลายมือพร้อมกัน Mohs 7 ทนการกดเขียนต่อเนื่อง เหมาะกับ Active Learning ห้องเรียนตั้งแต่ 30 ที่นั่งขึ้นไป",
      },
      {
        image: rz75UcBoardroom,
        title: "Corporate Boardroom — ห้องประชุมผู้บริหาร",
        description:
          "จอ 75\" 4K UHD แสดงผล Dashboard / Financial Charts / Video Conference ได้คมชัดในห้องประชุมขนาดใหญ่ — รองรับ OPS PC Intel Core i7-11Gen + Wireless Presentation Front-facing Speaker เสียงตรงสู่โต๊ะประชุม Modular Design อัปเกรด PC ได้ในอนาคต",
      },
      {
        image: rz75UcWayfinding,
        title: "Airport / Mall Wayfinding — ตู้แผนที่นำทาง",
        description:
          "ตู้นำทางขนาดใหญ่ในสนามบิน ห้างสรรพสินค้า หรืออาคารราชการ — แผนที่ 4K UHD เห็นรายละเอียดชัด เลือกเส้นทาง พิมพ์ QR Code นำทาง ติดตั้งแบบ Wall-mount ได้ทันที PCAP รองรับการใช้งานหนาแน่น 24/7",
      },
      {
        image: rz75UcIndustrial,
        title: "Industrial SCADA — Control Room ขนาดใหญ่",
        description:
          "Dashboard ควบคุมโรงงานขนาดใหญ่ — แสดง KPI, OEE, Machine Status, Andon Board แบบ Real-time จอ 4K UHD 75\" เห็นข้อมูลละเอียดจากระยะไกลทั่วทั้งห้องควบคุม Industrial Power 24/7 รองรับการสัมผัสด้วยถุงมือ",
      },
      {
        image: rz75UcShowroom,
        title: "Auto / Premium Showroom — Vehicle Configurator",
        description:
          "จอ Configurator 75\" 4K UHD แสดงผลรถ/ผลิตภัณฑ์พรีเมียมในขนาดเสมือนจริง — ลูกค้าเลือกสี รุ่น ออปชัน ดูภายใน-ภายนอก แบบ 360° Front-facing Speaker เสริมประสบการณ์ด้วยเสียงเครื่องยนต์/นำเสนอ ส่งเสริมการตัดสินใจซื้อ",
      },
      {
        image: rz75UcHotel,
        title: "Hotel Lobby Concierge — Digital Directory",
        description:
          "จอ 75\" Wall-mount ในล็อบบี้โรงแรม — Directory ห้องอาหาร, สปา, Activities, Local Attractions พร้อม Map เห็นภาพชัดในระยะ 5-10 เมตร Mohs 7 ทนการสัมผัสต่อเนื่อง รองรับหลายภาษา (Multi-language UI)",
      },
    ],
    gallery: [rz75Monitor, rz75Windows, rz75Android, rz75P3, rz75P4, rz75P5, rz75P6, rz75P7],
    ioImage: rz75Io,
    installImages: [rz75InstallFloor, rz75InstallWall, rz75InstallAcc],
    featureImages: [rz75Feat1, rz75Feat2, rz75Feat3, rz75Feat4],
    dimensionDrawings: [
      {
        image: rz75P3,
        title: "Mechanical Dimension — 75\" 4K Modular Display",
        caption: "ตัวเครื่อง 75\" 4K UHD — ขนาด 1708 × 1013 × 83 mm (กว้าง × สูง × ลึก) Active Area 1649.6 × 927.9 mm น้ำหนักสุทธิ 43 kg / รวม 53 kg — ดีไซน์ Modular Smart Terminal สามารถเปลี่ยน OPS PC หรือ Android Module ได้ง่ายแบบ Plug-and-Play",
        callouts: [
          { label: "ขนาดเครื่อง", value: "170.8 × 101.3 × 8.3 cm" },
          { label: "Active Area", value: "1649.6 × 927.9 mm" },
          { label: "น้ำหนักสุทธิ / รวม", value: "43 kg / 53 kg" },
          { label: "ขนาดกล่อง", value: "184.5 × 117.5 × 21.5 cm" },
        ],
      },
      {
        image: rz75Io,
        title: "I/O Layout — RZ75B Series",
        caption: "ผังพอร์ต I/O รวมของ RZ75B — ครอบคลุมทั้ง 3 Configuration (Monitor / Windows OPS / Android) — รองรับ HDMI, VGA, USB, RJ45, RS232, Audio, Touch out, AV out, Coaxial",
        callouts: [
          { label: "Video", value: "HDMI in/out, VGA, AV out, Coaxial" },
          { label: "USB / Touch", value: "USB ×6 (PC) / ×2 (Android), Touch out" },
          { label: "Network", value: "RJ45 Gigabit / 10-100M + Wi-Fi 802.11ac" },
          { label: "Serial / Audio", value: "RS232, MIC, Audio in/out, RF" },
        ],
      },
    ],
    osSupport: ["windows", "linux", "android"],
    variants: [
      {
        key: "monitor",
        label: "RZ75B — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 75\" 4K UHD PCAP ล้วน ๆ ดีไซน์ Modular — ต่อกับ External PC, OPS หรือ Media Player ผ่าน HDMI input + VGA + USB Touch (Plug-and-play) พร้อม Embedded Tempered Glass + Front-facing Speakers — Power Output DC 12V 5A น้ำหนักสุทธิ 43 kg มาพร้อม Wall mount bracket, Power & USB & HDMI cable, Remote control",
        bestFor: "ลูกค้ามี PC/OPS อยู่แล้ว ต้องการเฉพาะจอสัมผัสขนาดใหญ่ 75\" 4K UHD แบบ Modular",
        highlights: [
          "ไม่มี PC ในตัว — ต่อ PC ภายนอกผ่าน HDMI + VGA + USB Touch",
          "4K UHD 3840×2160 / 16:9 / Refresh 4K-30Hz",
          "Brightness 350 cd/m² / Contrast 5000:1",
          "PCAP 10-point Touch / Mohs 7 Tempered Glass",
          "Front-facing Speakers — เสียงตรงสู่ผู้ใช้",
          "น้ำหนักสุทธิ 43 kg / Profile 8.3 cm",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "RZ75B — Windows / Linux PC (OPS)",
        badge: "All-in-One PC (OPS Architecture)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 75\" 4K UHD พร้อม OPS Slot ภายใน เลือก CPU ได้ 3 ระดับ — Intel Core i3 4-Gen (Entry) / Core i5 10-Gen (Mid) / Core i7 11-Gen (High) — RAM Kingston 4-16GB + Seagate SSD 128-512GB ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน — ดีไซน์ Modular เปลี่ยน OPS ได้ในอนาคต พร้อม Refresh Rate 60Hz",
        bestFor: "ห้องประชุมขนาดใหญ่ / Smart Classroom / Boardroom 4K ที่ต้องการอัปเกรด OPS PC ได้",
        highlights: [
          "OPS Architecture — เปลี่ยน OPS PC ได้ภายหลัง",
          "CPU: Intel Core i3-4Gen / i5-10Gen / i7-11Gen",
          "GPU: HD Graphics 4600 / UHD 630 / Iris® Xe",
          "RAM Kingston 4 / 8 / 16 GB",
          "Storage Seagate SSD 128 / 256 / 512 GB",
          "Gigabit RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Overall Power Consumption < 380W",
        ],
        cpu: "Intel Core i3-4Gen / i5-10Gen / i7-11Gen (OPS)",
        ram: "4–16GB Kingston",
        storage: "Seagate SSD 128–512GB",
        accent: "primary",
      },
      {
        key: "android",
        label: "RZ75B — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 75\" 4K UHD พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) พร้อม Wi-Fi 802.11ac — เหมาะกับ Education App, Public Self-service และ Digital Signage 4K ขนาดใหญ่",
        bestFor: "Smart Classroom / Public Kiosk / Digital Signage 4K ที่ใช้ Android App ขนาดใหญ่",
        highlights: [
          "Rockchip RK3568 / RK3288 / RK3588 (เลือกได้)",
          "RAM 2–8GB + eMMC 16–128GB",
          "Pre-install Android 11 / 9 / 12 (ตามรุ่น CPU)",
          "10/100M RJ45 + Wi-Fi 802.11a/b/g/n/ac",
          "Refresh Rate 4K-30Hz",
          "Overall Power Consumption < 320W",
        ],
        cpu: "Rockchip RK3568 / RK3288 / RK3588",
        ram: "2–8GB",
        storage: "eMMC 16–128GB",
        accent: "secondary",
      },
    ],
    cpuOptions: [
      { tier: "Entry", cpu: "Intel® Core™ i3 4th Gen (OPS)", gpu: "Intel® HD Graphics 4600", ram: "Kingston 4GB", storage: "Seagate SSD 128GB", targetUseCase: "ห้องประชุมขนาดกลาง / Digital Signage งานทั่วไป" },
      { tier: "Mid", cpu: "Intel® Core™ i5 10th Gen (OPS)", gpu: "Intel® UHD Graphics 630", ram: "Kingston 8GB", storage: "Seagate SSD 256GB", targetUseCase: "Smart Classroom, Conference Room, Wireless Presentation" },
      { tier: "High", cpu: "Intel® Core™ i7 11th Gen (OPS)", gpu: "Intel® Iris® Xe Graphics", ram: "Kingston 16GB", storage: "Seagate SSD 512GB", targetUseCase: "Boardroom 4K, Video Conferencing, AI/Analytics Workloads" },
      { tier: "Entry", cpu: "Rockchip RK3568 (Quad-core ARM Cortex-A55)", gpu: "ARM Mali-G52 2EE", ram: "LPDDR4 2GB (4GB optional)", storage: "eMMC 16GB (32GB optional)", targetUseCase: "Education App, Self-service Kiosk (Android 11)" },
      { tier: "Mid", cpu: "Rockchip RK3288 (Quad-core ARM Cortex-A17)", gpu: "ARM Mali-T864", ram: "LPDDR3 2GB", storage: "eMMC 16GB", targetUseCase: "Pre-install Android 9 — งาน Legacy App" },
      { tier: "High", cpu: "Rockchip RK3588 (Octa-core, 8nm)", gpu: "ARM Mali-G610", ram: "LPDDR4 4GB (8GB optional)", storage: "eMMC 64GB (128GB optional)", targetUseCase: "AI Vision, 4K Multimedia, Smart Whiteboard (Android 12)" },
    ],
    datasheetUrl: "https://touchwo.com/product/elo-monitor-75-touch-pc-rz75b/",
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
        { label: "ขนาดหน้าจอ", value: "75 นิ้ว" },
        { label: "ความละเอียด", value: "3840 × 2160 (4K UHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "1649.6 × 927.9 mm" },
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
        { label: "ขนาดเครื่อง (L×W×H)", value: "170.8 × 101.3 × 8.3 cm" },
        { label: "ขนาดกล่อง (L×W×H)", value: "184.5 × 117.5 × 21.5 cm" },
        { label: "น้ำหนักสุทธิ", value: "43 kg" },
        { label: "น้ำหนักรวม", value: "53 kg" },
      ]},
      { title: "Power Supply", rows: [
        { label: "Power Input", value: "110-240V AC 50/60Hz" },
        { label: "Power Output", value: "DC 12V 5A" },
        { label: "Standby Power", value: "≤ 0.5W" },
        { label: "Overall Power Consumption", value: "Windows OPS PC < 380W / Monitor & Android < 320W" },
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
      formFactor: "Modular 8.3 cm 75\"",
      dimensionCm: "170.8 × 101.3 × 8.3",
      weightKg: "43",
      power: "DC 12V 5A",
      install: "Wall / Floor / Mobile Stand",
    },
  },
};

export const DISPLAY_75_ORDER: Display75Slug[] = ["rz75b"];

export const getDisplay75 = (slug: string): Display32 | undefined =>
  DISPLAYS_75[slug as Display75Slug];

/**
 * Touch Display 55" — HD55 + HR55 Configurable AIO (Monitor / Windows / Android)
 * แหล่งสเปก: touchwo.com (HD55 + HR55 Series)
 *  - HD55 Touch Monitor:  https://touchwo.com/product/55-touch-monitor-hd55/
 *  - HD55 Windows PC:     https://touchwo.com/product/55-touch-pc-hd55/
 *  - HD55 Android PC:     https://touchwo.com/product/55-android-touch-pc-hd55/
 *  - HR55 Touch Monitor:  https://touchwo.com/product/55-touch-monitor-hr55/
 *  - HR55 Windows PC:     https://touchwo.com/product/elo-monitor-55-touch-pc-hr55/
 *  - HR55 Android PC:     https://touchwo.com/product/55-android-touch-pc-hr55/
 */
import type { Display32, OSKey } from "./displays-32";
import { OS_BACKGROUNDS } from "./displays-32";

import hd55P1 from "@/assets/touchwo/hd55/55-1A.jpg";
import hd55P2 from "@/assets/touchwo/hd55/55-2A.jpg";
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
import hd55DimFront from "@/assets/touchwo/hd55/dim-front.png";
import hd55DimBack from "@/assets/touchwo/hd55/dim-back.png";

import hr55P1 from "@/assets/touchwo/hr55/p-1.jpg";
import hr55P2 from "@/assets/touchwo/hr55/p-2.jpg";
import hr55P4 from "@/assets/touchwo/hr55/p-4.jpg";
import hr55P5 from "@/assets/touchwo/hr55/p-5.jpg";
import hr55P6 from "@/assets/touchwo/hr55/p-6.jpg";
import hr55P7 from "@/assets/touchwo/hr55/p-7.jpg";
import hr55Io from "@/assets/touchwo/hr55/io.jpg";
import hr55Install1 from "@/assets/touchwo/hr55/install-1.png";
import hr55Install2 from "@/assets/touchwo/hr55/install-2.png";
import hr55Feat1 from "@/assets/touchwo/hr55/feat-1.png";
import hr55Feat2 from "@/assets/touchwo/hr55/feat-2.png";
import hr55Feat3 from "@/assets/touchwo/hr55/feat-3.png";

// Use case scenarios — HD55
import hd55UcQsr from "@/assets/touchwo/usecases/hd55/uc-qsr.jpg";
import hd55UcRetail from "@/assets/touchwo/usecases/hd55/uc-retail.jpg";
import hd55UcHotel from "@/assets/touchwo/usecases/hd55/uc-hotel.jpg";
import hd55UcCafe from "@/assets/touchwo/usecases/hd55/uc-cafe.jpg";
import hd55UcBank from "@/assets/touchwo/usecases/hd55/uc-bank.jpg";
import hd55UcWayfinding from "@/assets/touchwo/usecases/hd55/uc-wayfinding.jpg";

// Use case scenarios — HR55
import hr55UcClassroom from "@/assets/touchwo/usecases/hr55/uc-classroom.jpg";
import hr55UcBoardroom from "@/assets/touchwo/usecases/hr55/uc-boardroom.jpg";
import hr55UcAirport from "@/assets/touchwo/usecases/hr55/uc-airport.jpg";
import hr55UcHospital from "@/assets/touchwo/usecases/hr55/uc-hospital.jpg";
import hr55UcGovernment from "@/assets/touchwo/usecases/hr55/uc-government.jpg";
import hr55UcSignage from "@/assets/touchwo/usecases/hr55/uc-signage.jpg";
import hr55DimFront from "@/assets/touchwo/hr55/dim-front.png";
import hr55DimBack from "@/assets/touchwo/hr55/dim-back.png";

export type Display55Slug = "hd55" | "hr55";
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
    useCaseScenarios: [
      {
        image: hd55UcQsr,
        title: "QSR / Self-Order Kiosk — ตู้สั่งอาหารด้วยตนเอง",
        description:
          "ตู้สั่งอาหารแบบ Self-order สำหรับร้าน Fast Food / QSR — จอ 55\" Slim Bezel 13mm ดูทันสมัย ดึงดูดสายตา PCAP 10-point กดเร็ว แม่นยำ ลดเวลารอคิวหน้าเคาน์เตอร์ พร้อม Android Wi-Fi 5GHz + BLE 5.0 รองรับ Square / Stripe / Clover POS โดยตรง — เพิ่มยอด upsell เฉลี่ย 20-30% ต่อบิล",
      },
      {
        image: hd55UcRetail,
        title: "Luxury Retail — Digital Lookbook & Self-Checkout",
        description:
          "จอแสดงสินค้า / Digital Lookbook สำหรับร้านแฟชั่นพรีเมียม — Bezel เพียง 13mm ให้ความรู้สึก iPad-like กลมกลืนกับการตกแต่งร้านระดับ Hi-end ภาพคมชัด FHD (4K Optional) แสดงสินค้าได้น่าซื้อ พร้อมเชื่อมต่อระบบ POS / Inventory ลูกค้าค้นหาสินค้าได้เอง ลดภาระพนักงาน",
      },
      {
        image: hd55UcHotel,
        title: "Hotel Self Check-In — Lobby Concierge",
        description:
          "ตู้เช็คอินด้วยตนเองในล็อบบี้โรงแรม — ดีไซน์ Slim Bezel ทันสมัยเข้ากับการตกแต่ง Luxury Lobby แขกสามารถเช็คอิน เลือกห้อง รับ Key Card และเรียก Concierge Service ได้ผ่าน Android App — ลดความหนาแน่นที่ Front Desk รองรับการใช้งาน 24/7",
      },
      {
        image: hd55UcCafe,
        title: "Cafe Digital Menu Board — เมนูบอร์ดดิจิทัล",
        description:
          "จอเมนูดิจิทัลขนาดใหญ่ติดผนังเหนือเคาน์เตอร์ Cafe / Coffee Shop — แสดงรูปอาหารและเครื่องดื่มคมชัด FHD ปรับเปลี่ยนเมนูตามช่วงเวลาได้ทันที (Breakfast / Lunch / Happy Hour) ตัวเครื่องบางเพียง 7.67cm ติดตั้งสวยงาม Power Consumption < 160W ประหยัดค่าไฟ",
      },
      {
        image: hd55UcBank,
        title: "Bank Queue Management — ตู้บัตรคิวธนาคาร",
        description:
          "ตู้บัตรคิวและ Self-service Banking ในสาขาธนาคาร — ลูกค้ากดเลือกประเภทธุรกรรมเอง รับบัตรคิว และตรวจสอบเวลารอ จอ FHD 300 cd/m² อ่านชัดในแสงสว่างสูงของสาขา PCAP Mohs 7 ทนการใช้งานหนัก รองรับการใช้งาน 24/7",
      },
      {
        image: hd55UcWayfinding,
        title: "Museum / Gallery — Interactive Wayfinding",
        description:
          "จอ Interactive Wayfinding และ Exhibit ในพิพิธภัณฑ์ / Gallery / Showroom — ผู้เข้าชมแตะแผนที่ 3D เพื่อนำทาง หรือดูข้อมูลผลงานจัดแสดงแบบ Multimedia 4K Optional ดีไซน์ Slim Bezel ติดตั้ง Embedded กับผนังได้สวยงาม",
      },
    ],
    gallery: [
      hd55P1, hd55P2, hd55P4, hd55P5, hd55P6, hd55P7,
    ],
    ioImage: hd55Io,
    installImages: [hd55Install1, hd55Install2, hd55Install3],
    featureImages: [hd55Hero, hd55Pos1, hd55Pos2],
    dimensionDrawings: [
      {
        image: hd55DimFront,
        title: "Mechanical Dimension — Front / Side / Top View",
        caption: "แบบทางวิศวกรรมด้าน Front / Side / Top — ขนาดตัวเครื่องโดยรวม 1264 × 734.8 mm หน้าจอแสดงผล (Active Area) 1213.6 × 684.4 mm Bezel เพียง 25.2 mm รอบด้าน — มุมโค้ง R11 ตัวเครื่องบาง ​ขาตั้งพื้นมีพอร์ต I/O และปุ่มควบคุม ขอบล่างมีลำโพง + ช่องระบายความร้อน เหมาะกับงาน Wall mount / Embedded ที่ต้องการความเรียบหรู",
        callouts: [
          { label: "ขนาดเครื่อง (W×H)", value: "1264 × 734.8 mm" },
          { label: "Active Area", value: "1213.6 × 684.4 mm" },
          { label: "Bezel รอบด้าน", value: "25.2 mm" },
          { label: "มุมโค้ง", value: "4-R11 (Round Corner)" },
          { label: "ความหนาเครื่อง", value: "76.65 mm (รวมฐาน 93.19 mm)" },
        ],
      },
      {
        image: hd55DimBack,
        title: "VESA Mount Pattern — Rear View",
        caption: "แบบทางวิศวกรรม​ขาจับแบบ VESA Mouting — รองรับ VESA Mount มาตรฐาน 400 × 400 mm พร้อมจุดยึดเสริม 432 × 232.4 mm สำหรับ Bracket แบบพิเศษ ใช้น็อต M6 จำนวน 4 ตัว (4-M6) — ​ขาจับแบบ VESA Moutingมีช่องระบายความร้อนกว้างพร้อมโครงสร้างเหล็กรับน้ำหนัก รองรับการติดตั้งแบบ Wall mount / Floor stand / Mobile cart ตามมาตรฐานอุตสาหกรรม",
        callouts: [
          { label: "VESA Standard", value: "400 × 400 mm" },
          { label: "VESA Extended", value: "432 × 232.4 mm" },
          { label: "ขนาดน็อต", value: "M6 × 4 ตัว (4-M6)" },
          { label: "ติดตั้งได้", value: "Wall / Floor / Mobile / Embedded" },
        ],
      },
      {
        image: hd55Io,
        title: "I/O Layout — External Connectors",
        caption: "พอร์ตเชื่อมต่อ​ขาจับแบบ VESA Moutingตัวเครื่อง — รองรับครบทั้ง 3 Configuration: Monitor (HDMI in / VGA / USB / Audio), Windows PC (HDMI out / VGA / USB ×4 / RJ45 / Wi-Fi), Android (HDMI out / USB ×2 / RJ45 / TF Slot / Audio + BLE 5.0)",
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
  hr55: {
    slug: "hr55",
    modelCode: "HR55",
    name: '55" HR55 Series — Touch Monitor / Windows PC / Android PC',
    shortName: "HR55 Series",
    category: "Unibody 55\" Large-Format Touch Display",
    formFactor: "Configurable AIO",
    tagline: "จอสัมผัส 55\" PCAP FHD — Sleek Unibody Aluminum + Sheet-metal — เลือก 3 Configuration: Monitor / Windows OPS / Android",
    description:
      "HR55 คือซีรีส์จอสัมผัสขนาดใหญ่ 55 นิ้ว FHD 1920×1080 PCAP 10-point ดีไซน์ Sleek Unibody โครงสร้าง Aluminum Alloy + Sheet-metal พร้อม Laser-cut Backplate เคลือบสารกันสึก/กันสนิม ตัวเครื่องบางเพียง 6 cm น้ำหนัก 31.4–31.7 kg — Contrast สูงถึง 3000:1 ผิวหน้ากระจก Mohs class 7 explosion-proof + IP65 waterproof, อายุ Backlight 30,000 ชม. รองรับ 24/7 Operation อัตราการเสียต่ำ (Ultra-Low Failure Rate) เลือก Configuration ได้ 3 แบบ: (1) Touch Monitor (HDMI in / DVI / VGA / USB), (2) Windows All-in-One พร้อม OPS — Intel Core i3-4Gen / i5-10Gen / i7-11Gen, (3) Android All-in-One พร้อม Rockchip RK3568 / RK3288 / RK3588 — Plug-and-play พร้อม Auto-power Management",
    highlights: [
      { icon: "Box", title: "Sleek Unibody Design", subtitle: "Aluminum Alloy + Sheet-metal / Laser-cut" },
      { icon: "Maximize", title: "55\" FHD 1920×1080", subtitle: "16:9 / 300 cd/m² / Contrast 3000:1" },
      { icon: "Hand", title: "PCAP 10-Point Touch", subtitle: "<5ms / Mohs 7 + IP65" },
      { icon: "ShieldCheck", title: "Vandal-Proof Construction", subtitle: "Wear-resist + Corrosion-proof Coating" },
    ],
    features: [
      "Sleek Unibody Design — โครงสร้าง Aluminum Alloy + Sheet-metal ขึ้นรูปครั้งเดียว",
      "Laser-cut Backplate — ผิวหลังตัดเลเซอร์ละเอียด ดูเรียบหรู",
      "Wear-resistant + Corrosion-proof Coating — ทนการใช้งานหนัก",
      "Vandal-Proof Construction — กันการทำลายและการกระทบกระแทก",
      "PCAP 10-point Touch — เวลาตอบสนอง < 5ms / Anti-glare",
      "Contrast สูงถึง 3000:1 — สีคมชัดสมจริงกว่ามาตรฐาน",
      "Mohs class 7 explosion-proof glass + Surface IP65 waterproof",
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
    useCaseScenarios: [
      {
        image: hr55UcClassroom,
        title: "Smart Classroom — ห้องเรียนอัจฉริยะ",
        description:
          "Interactive Whiteboard สำหรับห้องเรียนยุคใหม่ — ครูเขียน อธิบาย และนำเสนอสื่อการสอนได้บนจอ 55\" PCAP 10-point Mohs 7 ทนการเขียนต่อเนื่อง โครงสร้าง Unibody Aluminum + Sheet-metal แข็งแรง รองรับการใช้งานหนักในโรงเรียน Pre-install Android 12 + แอปการศึกษาได้",
      },
      {
        image: hr55UcBoardroom,
        title: "Corporate Boardroom — ห้องประชุมผู้บริหาร",
        description:
          "จอประชุมระดับ Boardroom พร้อม OPS Slot รองรับ Intel Core i7-11Gen + Iris® Xe — แสดง Dashboard, BI Analytics, Video Conferencing คมชัด ติดตั้งบน Mobile Stand ย้ายระหว่างห้องประชุมได้ Wireless Presentation พร้อม MIC ในตัว เปลี่ยน OPS PC ได้ในอนาคต ไม่ต้องเปลี่ยนทั้งจอ",
      },
      {
        image: hr55UcAirport,
        title: "Airport Self-Service — ตู้เช็คอิน / Wayfinding สนามบิน",
        description:
          "ตู้บริการตนเองในสนามบิน — เช็คอินเที่ยวบิน, พิมพ์ Boarding Pass, ดูแผนที่อาคารผู้โดยสาร โครงสร้าง Unibody Vandal-proof + Mohs 7 ทนการใช้งานสาธารณะหนาแน่น 24/7 อายุ Backlight 30,000 ชม. รองรับการใช้งาน 3.5 ปีต่อเนื่องแบบ Industrial-grade",
      },
      {
        image: hr55UcHospital,
        title: "Healthcare — Nurse Station / EMR Display",
        description:
          "หน้าจอ EMR + Patient Vitals + Ward Map ที่สถานีพยาบาล — จอ 55\" Contrast 3000:1 อ่านกราฟ ECG / SpO2 / BP ชัดจากระยะไกล โครงสร้าง Unibody เคลือบกันสึก/กันสนิม ทำความสะอาดด้วยน้ำยาฆ่าเชื้อได้ รองรับการทำงาน 24/7 พร้อม Wi-Fi 5GHz เชื่อมต่อ HIS",
      },
      {
        image: hr55UcGovernment,
        title: "E-Government Kiosk — ตู้บริการประชาชน",
        description:
          "ตู้บริการ E-Government สำหรับสำนักงานเขต / ที่ทำการอำเภอ / ศาลากลาง — ประชาชนยื่นคำร้อง ต่อทะเบียน ขอเอกสารราชการได้ด้วยตนเอง โครงสร้าง Vandal-proof Security Construction ทนการใช้งานสาธารณะ Ultra-Low Failure Rate ลดภาระเจ้าหน้าที่ ลดเวลารอคิว",
      },
      {
        image: hr55UcSignage,
        title: "Public Digital Signage — ห้างฯ / สถานีรถไฟฟ้า",
        description:
          "Digital Signage + Wayfinding สำหรับห้างสรรพสินค้า / สถานีรถไฟฟ้า / Transit Hub — แสดงแผนที่ห้าง, โปรโมชั่น, ตารางรถ ตัวเครื่อง Unibody บาง 6 cm ติดตั้งใน Enclosure ทนต่อสภาพการใช้งานสาธารณะหนาแน่น Brightness 300 cd/m² อ่านชัดในแสงสว่างจ้า",
      },
    ],
    gallery: [
      hr55P1, hr55P2, hr55P4, hr55P5, hr55P6, hr55P7,
    ],
    ioImage: hr55Io,
    installImages: [hr55Install1, hr55Install2],
    featureImages: [hr55Feat1, hr55Feat2, hr55Feat3],
    dimensionDrawings: [
      {
        image: hr55DimFront,
        title: "Mechanical Dimension — Front / Side / Top View",
        caption: "แบบทางวิศวกรรมด้าน Front / Side / Top — ตัวเครื่อง 55\" ดีไซน์ Unibody Aluminum + Sheet-metal ขนาดหน้าจอแสดงผล (Active Area) 1213.6 × 684.4 mm Bezel 25.2 mm มุมโค้ง R11 — โครงสร้างขึ้นรูปชิ้นเดียว ด้านบนมีลำโพง + ช่องระบายความร้อน ​ขาตั้งพื้นมีพอร์ต I/O รองรับการติดตั้งแบบ Wall mount / Mobile stand เหมาะกับงาน Public Self-service ที่ต้องการความทนทาน Vandal-proof",
        callouts: [
          { label: "Active Area", value: "1213.6 × 684.4 mm" },
          { label: "Bezel รอบด้าน", value: "25.2 mm" },
          { label: "มุมโค้ง", value: "4-R11 (Round Corner)" },
          { label: "Construction", value: "Unibody Aluminum + Sheet-metal" },
          { label: "Profile", value: "Slim 6 cm Unibody" },
        ],
      },
      {
        image: hr55DimBack,
        title: "VESA Mount Pattern — Rear View",
        caption: "แบบทางวิศวกรรม​ขาจับแบบ VESA Mouting — รองรับ VESA Mount มาตรฐาน 400 × 400 mm พร้อมจุดยึดเสริม 432 × 232.4 mm สำหรับ Bracket แบบพิเศษ ใช้น็อต M6 จำนวน 4 ตัว (4-M6) — ​ขาจับแบบ VESA Mouting Laser-cut Backplate เคลือบกันสึก/กันสนิม พร้อมช่องระบายความร้อนและช่องใส่ OPS Slot รองรับการอัปเกรด PC ในอนาคต",
        callouts: [
          { label: "VESA Standard", value: "400 × 400 mm" },
          { label: "VESA Extended", value: "432 × 232.4 mm" },
          { label: "ขนาดน็อต", value: "M6 × 4 ตัว (4-M6)" },
          { label: "Backplate", value: "Laser-cut + Wear/Corrosion-proof" },
          { label: "PC Slot", value: "OPS Architecture (Upgradable)" },
        ],
      },
      {
        image: hr55Io,
        title: "I/O Layout — External Connectors",
        caption: "พอร์ตเชื่อมต่อ​ขาจับแบบ VESA Mouting — รองรับครบทั้ง 3 Configuration: Monitor (HDMI in / DVI / VGA / USB / Audio), Windows OPS (HDMI out / VGA / USB ×4 / RJ45 / Wi-Fi / MIC), Android (HDMI out / USB ×2 / RJ45 / TF/SD / Audio + Wi-Fi)",
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
        label: "HR55 — Touch Monitor",
        badge: "เฉพาะจอสัมผัส (ไม่มี PC ในตัว)",
        osBackground: "none",
        icon: "Monitor",
        description:
          "จอสัมผัส 55\" PCAP ล้วน ๆ ดีไซน์ Unibody ทนทาน — ต่อกับ External PC, OPS หรือ Media Player ผ่าน HDMI in / DVI / VGA + USB Touch (Plug-and-play) Power Consumption < 110W น้ำหนักสุทธิ 31.4 kg พร้อม USB & HDMI cable",
        bestFor: "ลูกค้ามี PC/OPS อยู่แล้ว ต้องการเฉพาะจอสัมผัสขนาดใหญ่ 55\" ดีไซน์ Unibody กันทำลาย",
        highlights: [
          "ไม่มี PC ในตัว — ต่อ PC ภายนอกผ่าน HDMI in / DVI / VGA",
          "Brightness 300 cd/m² / 60 Hz / Contrast 3000:1",
          "PCAP 10-point Touch / Anti-glare",
          "Power Consumption < 110W",
          "น้ำหนักสุทธิ 31.4 kg / Profile 6 cm Unibody",
        ],
        accent: "neutral",
      },
      {
        key: "x86",
        label: "HR55 — Windows / Linux PC (OPS)",
        badge: "All-in-One PC (OPS Architecture)",
        osBackground: "windows",
        icon: "Cpu",
        description:
          "All-in-One PC จอ 55\" Unibody พร้อม OPS Slot ภายใน เลือก CPU ได้ 3 ระดับ — Intel Core i3 4-Gen (Entry) / Core i5 10-Gen (Mid) / Core i7 11-Gen (High) — RAM Kingston 4-16GB + Seagate SSD 128-512GB ติดตั้ง Windows 10/11 หรือ Linux จากโรงงาน เปลี่ยน OPS ได้ในอนาคต",
        bestFor: "ห้องประชุม / Smart Classroom / Boardroom ที่ต้องการอัปเกรด OPS PC ได้",
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
        label: "HR55 — Android PC",
        badge: "All-in-One PC (ARM)",
        osBackground: "android",
        icon: "Smartphone",
        description:
          "All-in-One PC จอ 55\" Unibody พร้อม Rockchip ARM ภายใน เลือก CPU ได้ 3 ระดับ — RK3568 (Android 11) / RK3288 (Android 9) / RK3588 (Android 12) พร้อม Wi-Fi 802.11ac — เหมาะกับ Education App และ Public Self-service",
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
    datasheetUrl: "https://touchwo.com/wp-content/uploads/2024/11/HR55-X86-TouchWo-SpecSheet.pdf",
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
        { label: "ขนาดหน้าจอ", value: "55 นิ้ว" },
        { label: "ความละเอียด", value: "1920 × 1080 (FHD)" },
        { label: "อัตราส่วนภาพ", value: "16 : 9" },
        { label: "พื้นที่แสดงผล", value: "1211 × 652 mm" },
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
        { label: "ขนาดเครื่อง (L×W×H)", value: "136.3 × 73.4 × 6.0 cm (Unibody)" },
        { label: "ขนาดกล่อง (L×W×H)", value: "142 × 79 × 15 cm" },
        { label: "น้ำหนักสุทธิ", value: "31.4 kg (Monitor) / 31.7 kg (PC/Android)" },
        { label: "น้ำหนักรวม", value: "39.5 kg (Monitor) / 39.8 kg (PC/Android)" },
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
      formFactor: "Unibody 6 cm 55\"",
      dimensionCm: "136.3 × 73.4 × 6.0",
      weightKg: "31.4-31.7",
      power: "< 140W",
      install: "Wall / Floor / Mobile Stand",
    },
  },
};

export const DISPLAY_55_ORDER: Display55Slug[] = ["hd55", "hr55"];


export const getDisplay55 = (slug: string): Display32 | undefined =>
  DISPLAYS_55[slug as Display55Slug];

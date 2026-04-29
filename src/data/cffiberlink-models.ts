/**
 * CF Fiberlink Industrial Switch — Full Catalog
 * Source: Factory Excel "Management_type_industrial_switch_RTL_scheme_L2_layer..."
 * + รูปจาก https://cdnus.globalso.com/cffiberlink/
 *
 * 3 หมวด:
 *  - L2 (RTL Managed)         : สำหรับโครงการอุตสาหกรรมทั่วไป
 *  - L2+ (VTS L2+ Managed)    : โครงการใหญ่ Smart Grid / ปิโตรเคมี (self-healing เร็ว)
 *  - L3 10G Core              : Industrial 10G Core Switch
 */

export type CFFiberlinkCategory = "l2-rtl" | "l2-vts" | "l3-10g" | "cctv-poe" | "rack-poe";

/** Use case tag — แมปกับ Lucide icon ในหน้า component */
export type CFUseCase =
  | "cctv"        // กล้องวงจรปิด
  | "wifi-ap"     // Wireless AP
  | "factory"     // โรงงาน / PLC / SCADA
  | "rail"        // รถไฟฟ้า / ระบบราง
  | "traffic"     // Smart Traffic / ITS
  | "power"       // Smart Grid / Substation
  | "petrochem"   // ปิโตรเคมี / น้ำมัน
  | "mining"      // เหมือง
  | "marine"      // ท่าเรือ / Marine
  | "smart-city"  // Smart City Backbone
  | "campus"      // โรงเรียน / มหาวิทยาลัย
  | "hotel"       // โรงแรม / รีสอร์ท
  | "office"      // ออฟฟิศ / Enterprise
  | "smb"         // SMB / ร้านค้า
  | "green";      // พลังงานสะอาด / Solar

export interface CFFiberlinkModel {
  model: string;
  ports: string;
  switchingCapacity: string;
  packetRate: string;
  size: string;
  poe: boolean;
  badge?: string;
  image: string;
  /** Override use cases ต่อรุ่น (optional) — ถ้าไม่ใส่จะใช้ default ของ category */
  useCases?: CFUseCase[];
  /** PR Spotlight chips — แสดงบนการ์ดเป็นจุดขายเด่น (เช่น "One-Key CCTV", "Fiber 2km Built-in") */
  spotlight?: string[];
  /** ถ้า true จะถูกนำไปแสดงใน "รุ่นแนะนำเด่น" (Hero Picks Strip) */
  heroPick?: boolean;
  /** หัวข้อสั้น 1 บรรทัดสำหรับ Hero Card (เช่น "Flagship 10G L3 Core") */
  heroTitle?: string;
  /** คำอธิบายสั้นใน Hero Card */
  heroPitch?: string;
}

export interface CFFiberlinkCategoryDef {
  id: CFFiberlinkCategory;
  title: string;
  th: string;
  desc: string;
  software: string[];
  /** Use cases เริ่มต้นของหมวด — model ที่ไม่ใส่ useCases เองจะใช้ค่านี้ */
  defaultUseCases: CFUseCase[];
  models: CFFiberlinkModel[];
}

// Default representative images per port-class — local copy in /public/cffiberlink/
const IMG = {
  smallL2: "/cffiberlink/smallL2.jpg",
  smallPoE: "/cffiberlink/smallPoE.jpg",
  midL2: "/cffiberlink/midL2.jpg",
  rack: "/cffiberlink/rack.jpg",
  l3Core: "/cffiberlink/l3Core.jpg",
  l3Poe: "/cffiberlink/l3Poe.jpg",
  cctv24: "/cffiberlink/cctv24.jpg",
  cctv4: "/cffiberlink/cctv4.jpg",
  cctv8: "/cffiberlink/cctv8.jpg",
  cctv4g: "/cffiberlink/cctv4g.jpg",
  cctv27: "/cffiberlink/cctv27.jpg",
  cctv27b: "/cffiberlink/cctv27b.jpg",
  // Hero Picks — ภาพจริงของรุ่นเด่นจาก CDN ของโรงงาน
  heroYE1005D: "/cffiberlink/hero-ye1005d.jpg",
  heroPE204NT: "/cffiberlink/hero-pe204nt.jpg",
  heroPE208N: "/cffiberlink/hero-pe208n.jpg",
  heroHY2024M2: "/cffiberlink/hero-hy2024m2.jpg",
  heroHY4T1608S: "/cffiberlink/hero-hy4t1608s.jpg",
};

const SW_L2 = [
  "802.1Q VLAN, Port Mirroring, Port Isolation",
  "IGMP Snooping, DHCP Snooping, LLDP",
  "IP Source Guard, ARP Inspection, ACLs",
  "STP / RSTP / MSTP",
  "WEB / CLI / TELNET / SSH / SNMP",
  "Cable Diagnosis, Dual Firmware Backup",
  "ERPS G.8032 Ring (self-recovery <20ms)",
  "DDM SFP Diagnostics, CPU/Memory Monitor",
  "6KV Surge Protection, 6KV ESD",
];

const SW_L2_PLUS = [...SW_L2, "IPv4 / IPv6 Static Routing"];

const SW_L3 = [
  ...SW_L2,
  "L3 Routing — IPv4 / IPv6 Static",
  "Dynamic Routing — RIP, OSPF v1/v2",
];

export const cffiberlinkCatalog: CFFiberlinkCategoryDef[] = [
  // ───────────── L2 RTL Managed ─────────────
  {
    id: "l2-rtl",
    title: "L2 Managed (RTL)",
    th: "L2 จัดการได้ — โครงการอุตสาหกรรมทั่วไป",
    desc: "Switch L2 จัดการได้ ใช้ชิป Realtek แบบ Non-blocking — เหมาะกับงานโครงการอุตสาหกรรมทั่วไป รองรับ ERPS Ring < 20ms, 6KV Lightning, อุณหภูมิ -40~85°C",
    software: SW_L2,
    defaultUseCases: ["factory", "traffic", "rail", "mining"],
    models: [
      { model: "CF-HY2004G-SFP", ports: "4× GbE RJ45 + 2× SFP + 1× Console", switchingCapacity: "12 Gbps", packetRate: "8.93 Mpps", size: "172×144×54.5", poe: false, image: IMG.smallL2 },
      { model: "CF-HY2004GP-SFP", ports: "4× GbE PoE + 2× SFP + 1× Console", switchingCapacity: "12 Gbps", packetRate: "8.93 Mpps", size: "172×144×54.5", poe: true, badge: "PoE+", image: IMG.smallPoE },
      { model: "CF-HY2008G-SFP", ports: "8× GbE RJ45 + 2× SFP + 1× Console", switchingCapacity: "20 Gbps", packetRate: "14.88 Mpps", size: "172×144×54.5", poe: false, image: IMG.smallL2 },
      { model: "CF-HY2008GP-SFP", ports: "8× GbE PoE + 2× SFP + 1× Console", switchingCapacity: "20 Gbps", packetRate: "14.88 Mpps", size: "172×144×54.5", poe: true, badge: "PoE+", image: IMG.smallPoE },
      { model: "CF-HY4008G-SFP", ports: "8× GbE RJ45 + 4× SFP + 1× Console", switchingCapacity: "24 Gbps", packetRate: "17.86 Mpps", size: "172×144×54.5", poe: false, image: IMG.smallL2 },
      { model: "CF-HY4008GP-SFP", ports: "8× GbE PoE + 4× SFP + 1× Console", switchingCapacity: "24 Gbps", packetRate: "17.86 Mpps", size: "172×144×54.5", poe: true, badge: "PoE+", image: IMG.smallPoE },
      { model: "CF-HY8008G-SFP", ports: "8× GbE RJ45 + 8× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "172×144×54.5", poe: false, badge: "8 SFP", image: IMG.smallL2 },
      { model: "CF-HY8008GP-SFP", ports: "8× GbE PoE + 8× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "172×144×54.5", poe: true, badge: "8 SFP PoE", image: IMG.smallPoE },
      { model: "CF-HY4016G-SFP", ports: "16× GbE RJ45 + 4× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×148×69.5", poe: false, image: IMG.midL2 },
      { model: "CF-HY4016GP-SFP", ports: "16× GbE PoE + 4× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×148×69.5", poe: true, badge: "PoE+ 240W", image: IMG.smallPoE },
      { model: "CF-HY8016G-SFP", ports: "16× GbE RJ45 + 8× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×148×69.5", poe: false, image: IMG.midL2 },
      { model: "CF-HY8016GP-SFP", ports: "16× GbE PoE + 8× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×148×69.5", poe: true, badge: "PoE+", image: IMG.smallPoE },
      { model: "CF-HY1608G-SFP", ports: "8× GbE RJ45 + 16× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×148×69.5", poe: false, badge: "16 SFP", image: IMG.midL2 },
      { model: "CF-HY1608GP-SFP", ports: "8× GbE PoE + 16× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×148×69.5", poe: true, badge: "16 SFP PoE", image: IMG.smallPoE },
    ],
  },

  // ───────────── L2+ VTS Managed ─────────────
  {
    id: "l2-vts",
    title: "L2+ Managed (VTS)",
    th: "L2+ ขั้นสูง — Smart Grid / ปิโตรเคมี",
    desc: "Switch L2+ ใช้ใน Smart Grid, ปิโตรเคมี, โครงการขนาดใหญ่ — Sensitivity สูง, Self-healing เร็ว รองรับ IPv4/IPv6 Static Routing",
    software: SW_L2_PLUS,
    defaultUseCases: ["power", "petrochem", "rail", "green"],
    models: [
      { model: "CF-HY2004GV-SFP", ports: "4× GbE RJ45 + 2× SFP + 1× Console", switchingCapacity: "12 Gbps", packetRate: "8.93 Mpps", size: "172×144×54.5", poe: false, image: IMG.smallL2 },
      { model: "CF-HY2004GVP-SFP", ports: "4× GbE PoE + 2× SFP + 1× Console", switchingCapacity: "12 Gbps", packetRate: "8.93 Mpps", size: "172×144×54.5", poe: true, badge: "PoE+", image: IMG.smallPoE },
      { model: "CF-HY2008GV-SFP", ports: "8× GbE RJ45 + 2× SFP + 1× Console", switchingCapacity: "20 Gbps", packetRate: "14.88 Mpps", size: "172×144×54.5", poe: false, image: IMG.smallL2 },
      { model: "CF-HY2008GVP-SFP", ports: "8× GbE PoE + 2× SFP + 1× Console", switchingCapacity: "20 Gbps", packetRate: "14.88 Mpps", size: "172×144×54.5", poe: true, badge: "PoE+", image: IMG.smallPoE },
      { model: "CF-HY4008GV-SFP", ports: "8× GbE RJ45 + 4× SFP + 1× Console", switchingCapacity: "24 Gbps", packetRate: "17.86 Mpps", size: "172×144×54.5", poe: false, badge: "Bypass Optical", image: IMG.smallL2 },
      { model: "CF-HY4008GVP-SFP", ports: "8× GbE PoE + 4× SFP + 1× Console", switchingCapacity: "24 Gbps", packetRate: "17.86 Mpps", size: "172×144×54.5", poe: true, badge: "PoE+", image: IMG.smallPoE },
      { model: "CF-HY8008GV-SFP", ports: "8× GbE RJ45 + 8× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "172×144×54.5", poe: false, image: IMG.smallL2 },
      { model: "CF-HY8008GVP-SFP", ports: "8× GbE PoE + 8× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "172×144×54.5", poe: true, badge: "PoE+", image: IMG.smallPoE },
      { model: "CF-HY4016GV-SFP", ports: "16× GbE RJ45 + 4× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×142×69.5", poe: false, image: IMG.midL2 },
      { model: "CF-HY4016GVP-SFP", ports: "16× GbE PoE + 4× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×142×69.5", poe: true, badge: "PoE+ 240W", image: IMG.smallPoE },
      { model: "CF-HY8016GV-SFP", ports: "16× GbE RJ45 + 8× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×142×69.5", poe: false, image: IMG.midL2 },
      { model: "CF-HY8016GVP-SFP", ports: "16× GbE PoE + 8× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×142×69.5", poe: true, badge: "PoE+", image: IMG.smallPoE },
      { model: "CF-HY1608GV-SFP", ports: "8× GbE RJ45 + 16× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×142×69.5", poe: false, badge: "16 SFP", image: IMG.midL2 },
      { model: "CF-HY1608GVP-SFP", ports: "8× GbE PoE + 16× SFP + 1× Console", switchingCapacity: "32 Gbps", packetRate: "23.8 Mpps", size: "174×142×69.5", poe: true, badge: "16 SFP PoE", image: IMG.smallPoE },
      { model: "CF-HY4024GV-SFP", ports: "24× GbE RJ45 + 4× SFP + 1× Console", switchingCapacity: "56 Gbps", packetRate: "41.66 Mpps", size: "174×142×69.5", poe: false, badge: "24 พอร์ต", image: IMG.midL2 },
      { model: "CF-HY4024GVP-SFP", ports: "24× GbE PoE + 4× SFP + 1× Console", switchingCapacity: "56 Gbps", packetRate: "41.66 Mpps", size: "174×142×69.5", poe: true, badge: "24P PoE", image: IMG.smallPoE },
      { model: "CF-HY4C016G-SFP", ports: "16× GbE RJ45 + 4× SFP (4 Combo) — Rack", switchingCapacity: "48 Gbps", packetRate: "35.7 Mpps", size: "430×295×45 (Rack)", poe: false, badge: "Rack-mount", image: IMG.rack },
      { model: "CF-HY4C016GP-SFP", ports: "16× GbE PoE + 4× SFP (4 Combo) — Rack", switchingCapacity: "48 Gbps", packetRate: "35.7 Mpps", size: "430×295×45 (Rack)", poe: true, badge: "Rack PoE", image: IMG.rack },
      { model: "CF-HY4C024G-SFP", ports: "24× GbE RJ45 + 4× SFP (4 Combo) — Rack", switchingCapacity: "64 Gbps", packetRate: "47.6 Mpps", size: "430×295×45 (Rack)", poe: false, badge: "Rack 24P", image: IMG.rack },
      { model: "CF-HY4C024GP-SFP", ports: "24× GbE PoE + 4× SFP (4 Combo) — Rack", switchingCapacity: "64 Gbps", packetRate: "47.6 Mpps", size: "430×295×45 (Rack)", poe: true, badge: "Rack 24P PoE", image: IMG.rack },
    ],
  },

  // ───────────── L3 10G Core ─────────────
  {
    id: "l3-10g",
    title: "L3 10G Core",
    th: "Industrial 10G Core Switch — L3 Strong Layer",
    desc: "Industrial Grade 10G Core Switch (L3 Network Management) — รองรับ Dynamic Routing RIP/OSPF, IPv4/IPv6 Full Line-speed Forwarding เหมาะ Backbone โรงงาน / Smart City / รถไฟฟ้า",
    software: SW_L3,
    defaultUseCases: ["smart-city", "factory", "rail", "power"],
    models: [
      { model: "CF-HY4T8016G-SFP+", ports: "16× GbE RJ45 + 8× SFP + 4× 10G SFP+", switchingCapacity: "56 Gbps", packetRate: "41.6 Mpps", size: "430×295×45 (Rack)", poe: false, badge: "10G Uplink", image: IMG.l3Core },
      { model: "CF-HY4T8016GP-SFP+", ports: "16× GbE PoE + 8× SFP + 4× 10G SFP+", switchingCapacity: "56 Gbps", packetRate: "41.6 Mpps", size: "430×295×45 (Rack)", poe: true, badge: "10G PoE+", image: IMG.l3Poe },
      { model: "CF-HY4T8024G-SFP+", ports: "24× GbE RJ45 + 8× SFP + 4× 10G SFP+", switchingCapacity: "72 Gbps", packetRate: "53.6 Mpps", size: "430×295×45 (Rack)", poe: false, badge: "24P + 10G", image: IMG.l3Core },
      { model: "CF-HY4T8024GP-SFP+", ports: "24× GbE PoE + 8× SFP + 4× 10G SFP+", switchingCapacity: "72 Gbps", packetRate: "53.6 Mpps", size: "430×295×45 (Rack)", poe: true, badge: "24P PoE 10G", image: IMG.l3Poe },
      { model: "CF-HY4T024G-SFP+", ports: "24× GbE RJ45 + 4× 10G SFP+", switchingCapacity: "56 Gbps", packetRate: "41.7 Mpps", size: "430×295×45 (Rack)", poe: false, badge: "24P + 10G", image: IMG.l3Core },
      { model: "CF-HY4T024GP-SFP+", ports: "24× GbE PoE + 4× 10G SFP+", switchingCapacity: "56 Gbps", packetRate: "41.7 Mpps", size: "430×295×45 (Rack)", poe: true, badge: "24P PoE 10G", image: IMG.l3Poe },
      { model: "CF-HY4T1608S-SFP+", ports: "8× GbE RJ45 + 16× SFP + 4× 10G SFP+", switchingCapacity: "56 Gbps", packetRate: "41.7 Mpps", size: "430×295×45 (Rack)", poe: false, badge: "16 SFP + 10G", image: IMG.l3Core },
      { model: "CF-HY4T2408S-SFP+", ports: "24× SFP (8 Combo) + 4× 10G SFP+", switchingCapacity: "72 Gbps", packetRate: "53.6 Mpps", size: "430×295×45 (Rack)", poe: false, badge: "24 SFP + 10G", image: IMG.l3Core },
      { model: "CF-HY4T048G-SFP+", ports: "48× GbE RJ45 + 4× 10G SFP+", switchingCapacity: "104 Gbps", packetRate: "77.4 Mpps", size: "430×295×45 (Rack)", poe: false, badge: "48P + 10G", image: IMG.l3Core },
      { model: "CF-HY4T048GP-SFP+", ports: "48× GbE PoE + 4× 10G SFP+", switchingCapacity: "104 Gbps", packetRate: "77.4 Mpps", size: "430×295×45 (Rack)", poe: true, badge: "48P PoE 10G", image: IMG.l3Poe },
    ],
  },

  // ───────────── CCTV / Surveillance Unmanaged PoE ─────────────
  {
    id: "cctv-poe",
    title: "CCTV / Surveillance PoE",
    th: "PoE Switch สำหรับงานกล้องวงจรปิด",
    desc: "Unmanaged PoE Switch ออกแบบเฉพาะงานกล้อง IP / NVR / Wireless AP — Plug & Play, มี CCTV mode (port isolation), ป้องกันฟ้าผ่า ESD ใช้งานง่ายสำหรับช่างหน้างาน",
    software: [
      "Plug & Play — ไม่ต้อง config",
      "CCTV Mode — Port Isolation กันการชนของสัญญาณ",
      "IEEE 802.3af/at PoE+ (สูงสุด 30W/พอร์ต)",
      "Auto-detect อุปกรณ์ PoE / Non-PoE",
      "ป้องกันฟ้าผ่า 6KV, ESD Protection",
      "VLAN ป้องกัน Network Storm",
      "Status LED ต่อพอร์ตชัดเจน",
    ],
    defaultUseCases: ["cctv", "wifi-ap", "smb", "hotel"],
    models: [
      { model: "CF-PE204N", ports: "4× 100M PoE + 2× 100M Uplink", switchingCapacity: "1.2 Gbps", packetRate: "0.89 Mpps", size: "Desktop / Wall-mount", poe: true, badge: "4+2 PoE", image: IMG.cctv4 },
      { model: "CF-PE208N", ports: "8× 100M PoE + 2× 100M Uplink", switchingCapacity: "2.0 Gbps", packetRate: "1.49 Mpps", size: "Desktop / Wall-mount", poe: true, badge: "8+2 PoE 120W", image: IMG.cctv8 },
      { model: "CF-PE2421G", ports: "24× 100M PoE + 2× GbE Uplink + 1× SFP", switchingCapacity: "8.8 Gbps", packetRate: "6.55 Mpps", size: "Rack 1U", poe: true, badge: "24+2+1 PoE 400W", image: IMG.cctv24 },
      { model: "CF-PE204G", ports: "4× GbE PoE + 2× GbE Uplink", switchingCapacity: "12 Gbps", packetRate: "8.93 Mpps", size: "Desktop / Wall-mount", poe: true, badge: "4+2 GbE PoE", image: IMG.cctv4g },
      { model: "CF-SE2724G-A", ports: "24× GbE + 2× GbE Uplink + 1× SFP", switchingCapacity: "56 Gbps", packetRate: "41.6 Mpps", size: "Rack 1U", poe: false, badge: "27P CCTV", image: IMG.cctv27 },
      { model: "CF-SE2724G-B", ports: "24× GbE PoE + 2× GbE Uplink + 1× SFP", switchingCapacity: "56 Gbps", packetRate: "41.6 Mpps", size: "Rack 1U", poe: true, badge: "27P CCTV PoE", image: IMG.cctv27b },
    ],
  },

  // ───────────── Rack-mount L3 PoE Campus ─────────────
  {
    id: "rack-poe",
    title: "Rack L3 PoE Campus",
    th: "L3 Rack PoE — โรงแรม / โรงเรียน / ออฟฟิศ",
    desc: "L3 Managed PoE Switch ระดับ Campus — มี 10G Uplink, Dynamic Routing (RIP/OSPF), เหมาะ Access/Aggregation/Core ของโรงแรม โรงเรียน ออฟฟิศที่ต้องจ่ายไฟ AP/กล้อง จำนวนมาก",
    software: SW_L3,
    defaultUseCases: ["hotel", "campus", "office", "cctv"],
    models: [
      { model: "CF-S5328X-4X8S16P", ports: "16× GbE PoE + 8× SFP + 4× 10G SFP+", switchingCapacity: "168 Gbps", packetRate: "78 Mpps", size: "Rack 1U (440×220×44)", poe: true, badge: "Campus 10G PoE", image: IMG.l3Poe },
      { model: "CF-S5328X-4X24P", ports: "24× GbE PoE + 4× 10G SFP+", switchingCapacity: "128 Gbps", packetRate: "95 Mpps", size: "Rack 1U (440×220×44)", poe: true, badge: "24P PoE + 10G", image: IMG.l3Poe },
      { model: "CF-S5352X-4X48P", ports: "48× GbE PoE + 4× 10G SFP+", switchingCapacity: "176 Gbps", packetRate: "131 Mpps", size: "Rack 1U (440×300×44)", poe: true, badge: "48P PoE Campus", image: IMG.l3Poe },
      { model: "CF-S5328X-4X24G", ports: "24× GbE + 4× 10G SFP+ (Non-PoE)", switchingCapacity: "128 Gbps", packetRate: "95 Mpps", size: "Rack 1U (440×220×44)", poe: false, badge: "24P + 10G", image: IMG.rack },
    ],
  },
];

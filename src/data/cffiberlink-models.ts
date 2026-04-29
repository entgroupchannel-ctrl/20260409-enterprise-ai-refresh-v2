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

export type CFFiberlinkCategory = "l2-rtl" | "l2-vts" | "l3-10g";

export interface CFFiberlinkModel {
  model: string;
  ports: string;
  switchingCapacity: string;
  packetRate: string;
  size: string;
  poe: boolean;
  badge?: string;
  image: string;
}

export interface CFFiberlinkCategoryDef {
  id: CFFiberlinkCategory;
  title: string;
  th: string;
  desc: string;
  software: string[];
  models: CFFiberlinkModel[];
}

// Default representative images per port-class (จาก factory CDN)
const IMG = {
  smallL2: "https://cdnus.globalso.com/cffiberlink/4107.jpg",
  smallPoE: "https://cdnus.globalso.com/cffiberlink/afdsgn-tuya-tuya.jpg",
  midL2: "https://cdnus.globalso.com/cffiberlink/55c2d925462b78fdb39e499ae32255f.jpg",
  rack: "https://cdnus.globalso.com/cffiberlink/604b25fdafe0b0fe8dba3998bed93d0.jpg",
  l3Core: "https://cdnus.globalso.com/cffiberlink/4%E4%B8%87%E5%85%86%E5%85%8916%E5%8D%83%E5%85%86%E7%94%B58%E4%B8%AA%E5%8D%83%E5%85%86%E5%85%89-CF-HY4T8016G-SFP-2.jpg",
  l3Poe: "https://cdnus.globalso.com/cffiberlink/IMG_433110.jpg",
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
];

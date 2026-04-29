/**
 * Volktek Product Catalog (รุ่นจริงจากเว็บโรงงาน volktek.com)
 *
 * โครงสร้าง:
 * - category: หมวดหลัก 10 หมวด (ตรงกับ productCategories ใน Volktek.tsx)
 * - subCategory: หมวดย่อยใน catalog ของโรงงาน
 * - model: ชื่อรุ่น
 * - description: สเปคย่อ 1 บรรทัด
 * - image: path ใน /src/assets/volktek/products
 * - features: badge สั้นๆ
 * - sourceUrl: ลิงก์ไปหน้ารายละเอียดของโรงงาน
 *
 * Phase 1 (current): Layer 3 Industrial Ethernet Switches
 */

/** Detailed spec block — แสดงใน Product Detail Dialog (ไม่ใช่ทุกรุ่นที่มี) */
export type VolktekProductDetails = {
  /** Overview 1-2 ย่อหน้าจากเว็บโรงงาน */
  overview: string;
  /** จุดเด่น 3-5 ข้อ — แต่ละข้อ {title, desc} */
  highlights: { title: string; desc: string }[];
  /** ลิสต์พอร์ตและ interface */
  ports: string[];
  /** LED Panel labels (optional) */
  ledPanel?: string;
  power: {
    input: string;
    consumption: string;
    poeBudget?: string;
  };
  environment: {
    tempOperating: string;
    tempStorage: string;
    humidity: string;
    housing: string;
  };
  physical: {
    weight: string;
    dimension: string;
  };
  /** Datasheet PDF URL */
  datasheetUrl?: string;
};

export type VolktekProduct = {
  model: string;
  description: string;
  image: string;
  features: string[];
  sourceUrl: string;
  details?: VolktekProductDetails;
};

export type VolktekSubCategory = {
  id: string;
  title: string;
  blurb: string;
  products: VolktekProduct[];
};

export type VolktekCategory = {
  id: string;
  title: string;
  subCategories: VolktekSubCategory[];
};

import l3Managed8GT4XS from "@/assets/volktek/products/layer3/9561-8GT4XS-TSN.jpg";
import l3PoE8GP4XS from "@/assets/volktek/products/layer3/9561-8GP4XS-TSN.jpg";

/* ============================================================
 * Phase 1: Layer 3 Industrial Ethernet Switches
 * ============================================================ */
export const volktekLayer3: VolktekCategory = {
  id: "layer3",
  title: "Layer 3 Industrial Ethernet Switches",
  subCategories: [
    {
      id: "layer3-managed",
      title: "Layer 3 Managed Switches",
      blurb:
        "L3 Managed Switch รองรับ TSN, IEEE 1588v2, gPTP สำหรับงานอัตโนมัติที่ต้องการความแม่นยำเวลาสูง — ทนอุณหภูมิ -40~70°C, IP30",
      products: [
        {
          model: "9561-8GT4XS-TSN",
          description:
            "Layer 3 Industrial TSN Switch — 8x 10/100/1000BASE-T RJ45 + 4x 100M/1G/10G SFP+",
          image: l3Managed8GT4XS,
          features: ["TSN", "L3", "10G SFP+", "-40~70°C", "IP30", "HSR/PRP"],
          sourceUrl: "https://www.volktek.com/productdetail/9561-8gt4xs-tsn.html",
          details: {
            overview:
              "สวิตช์อุตสาหกรรม Layer 3 ที่ออกแบบมาเพื่อความเสถียรในสภาพแวดล้อมโรงงาน ให้พอร์ต 8x 10/100/1000Mbps RJ45 พร้อม Uplink 4x 100M/1G/10G SFP+ — รองรับ Time-Sensitive Networking (TSN) เต็มรูปแบบและ IEEE 1588v2 / 802.1AS-2020 (gPTP) สำหรับงาน Automation, SCADA, Smart Manufacturing ที่ต้องการการซิงค์เวลาแม่นยำระดับนาโนวินาที",
            highlights: [
              {
                title: "Precision Timing & TSN ครบชุด",
                desc: "รองรับ IEEE 802.1Qci/Qav/Qbv/Qbu, 802.1CB FRER, gPTP — ส่งข้อมูลแบบ deterministic เหมาะกับ Robot, PLC, Motion Control",
              },
              {
                title: "Redundancy ระดับ Sub-millisecond",
                desc: "G.8032, MRP (IEC-62439-2), HSR, PRP — กู้คืนเครือข่ายเร็ว ไม่กระทบสายการผลิต",
              },
              {
                title: "Network Security ครบ",
                desc: "802.1X, TACACS+, ACL, DHCP Snooping, ARP Inspection, BPDU/Root Guard, IP Source Guard",
              },
              {
                title: "Layer 3 Routing & QoS",
                desc: "Static Route, Inter-VLAN Routing, QinQ, IGMP Snooping, Storm Control, SPAN/RSPAN — ควบคุม bandwidth ละเอียด",
              },
            ],
            ports: [
              "8 x 10/100/1000BASE-T RJ45",
              "4 x 100M/1G/10G SFP+ Slots",
              "1 x RS232 Console Port",
              "1 x USB Port",
              "2 x pairs Dry Contact Digital Inputs (DI)",
              "1 x Alarm Relay Digital Output (DO)",
            ],
            ledPanel: "PWR, RPS, ALM, POST, 1000, 10G, LNK/ACT",
            power: {
              input: "Primary 12~48VDC + Redundant 12~48VDC (Dual Input)",
              consumption: "System: 19W",
            },
            environment: {
              tempOperating: "-40°C ~ 70°C (-40°F ~ 158°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: {
              weight: "1,590 g (3.51 lb)",
              dimension: "80 x 160 x 140.3 mm (W x H x D)",
            },
            datasheetUrl:
              "https://www.volktek.com/_i/assets/file/productdownload/ce45e139045fcc80f28ec219fa36ab04.pdf",
          },
        },
      ],
    },
    {
      id: "layer3-managed-poe",
      title: "Layer 3 Managed PoE++ Switches",
      blurb:
        "L3 Managed PoE++ (btPoE / 90W ต่อพอร์ต) — เหมาะกับกล้อง PTZ, AP กำลังสูง, จุดติดตั้งอุตสาหกรรมที่ต้องการ TSN ครบชุด",
      products: [
        {
          model: "9561-8GP4XS-TSN",
          description:
            "Layer 3 Industrial TSN PoE++ Switch — 8x 10/100/1000BASE-T btPoE RJ45 + 4x 100M/1G/10G SFP+",
          image: l3PoE8GP4XS,
          features: ["TSN", "L3", "btPoE 90W", "10G SFP+", "-40~70°C", "IP30"],
          sourceUrl: "https://www.volktek.com/productdetail/9561-8gp4xs-tsn.html",
          details: {
            overview:
              "สวิตช์อุตสาหกรรม Layer 3 TSN พร้อม btPoE (IEEE 802.3bt) จ่ายไฟสูงสุด 90W ต่อพอร์ต — เหมาะกับกล้อง PTZ ความละเอียดสูง, AP Wi-Fi 6/7, จอแสดงผลอุตสาหกรรม โดยไม่ต้องเดินไฟแยก รองรับ Power Budget รวม 360W และ Per-Port Monitoring/Scheduling เพื่อจัดการพลังงานแบบยืดหยุ่น",
            highlights: [
              {
                title: "btPoE 90W ต่อพอร์ต · 360W Total",
                desc: "IEEE 802.3af/at/bt — Auto Power Class Detection, Priority, Power Scheduling จ่ายไฟอุปกรณ์ปลายทางได้เต็มประสิทธิภาพ",
              },
              {
                title: "Precision Timing & TSN ครบชุด",
                desc: "IEEE 802.1Qci/Qav/Qbv/Qbu, 802.1CB FRER, 802.1AS-2020 gPTP, IEEE 1588v2 — งาน Automation ที่ต้องซิงค์เวลาแม่นยำ",
              },
              {
                title: "Redundancy & Reliability",
                desc: "G.8032, MRP, HSR, PRP — เครือข่ายไม่หยุด แม้สาย/อุปกรณ์ขาดหาย กู้คืนระดับมิลลิวินาที",
              },
              {
                title: "ทนอุตสาหกรรมหนัก",
                desc: "Aluminum IP30, ทนสั่นสะเทือน/กระแทก, อุณหภูมิ -40°C ~ 70°C — ติดตั้งในโรงงาน, สถานี, กลางแจ้ง",
              },
            ],
            ports: [
              "8 x 10/100/1000BASE-T btPoE RJ45 (90W per port)",
              "4 x 100M/1G/10G SFP+ Slots",
              "1 x RS232 Console Port",
              "1 x USB Port",
              "2 x pairs Dry Contact Digital Inputs (DI)",
              "1 x Alarm Relay Digital Output (DO)",
            ],
            ledPanel: "PWR, RPS, ALM, POST, 1000, 10G, LNK/ACT, PoE",
            power: {
              input: "Primary 48~57VDC + Redundant 48~57VDC (Dual Input)",
              consumption: "System: 19W",
              poeBudget: "PoE Power Budget: 360W (สูงสุด 90W ต่อพอร์ต)",
            },
            environment: {
              tempOperating: "-40°C ~ 70°C (-40°F ~ 158°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: {
              weight: "1,590 g (3.51 lb)",
              dimension: "80 x 160 x 140.3 mm (W x H x D)",
            },
            datasheetUrl:
              "https://www.volktek.com/_i/assets/file/productdownload/c4ff5692dd233f889ef4f756b2459979.pdf",
          },
        },
      ],
    },
  ],
};

/* ============================================================
 * Phase 3: Industrial PoE Switches (9 sub-categories, 27 รุ่น)
 * ============================================================ */
import poeIns8424P from "@/assets/volktek/products/poe/INS-8424P.jpg";
import poeHns8405P from "@/assets/volktek/products/poe/HNS-8405P.jpg";
import poeHns8415P from "@/assets/volktek/products/poe/HNS-8415P.jpg";
import poeIen8205P from "@/assets/volktek/products/poe/IEN-8205P-24V.jpg";
import poeIns8224P from "@/assets/volktek/products/poe/INS-8224P.jpg";
import poeIen8225P from "@/assets/volktek/products/poe/IEN-8225P-24V.jpg";
import poeIen8408P from "@/assets/volktek/products/poe/IEN-8408P-24V.jpg";
import poeIen8428P from "@/assets/volktek/products/poe/IEN-8428P.jpg";
import poeIen8428P24V from "@/assets/volktek/products/poe/IEN-8428P-24V.jpg";
import poe7160 from "@/assets/volktek/products/poe/7160-7GP1GT-24V-I.jpg";
import poeSen8415PL from "@/assets/volktek/products/poe/SEN-8415PL.jpg";
import poeSen8405PL from "@/assets/volktek/products/poe/SEN-8405PL-24V.jpg";
import poeSen8425PL from "@/assets/volktek/products/poe/SEN-8425PL-24V.jpg";
import poeSen8424PL from "@/assets/volktek/products/poe/SEN-8424PL.jpg";
import poeSen8428PL from "@/assets/volktek/products/poe/SEN-8428PL.jpg";
import poeSen8428PL24V from "@/assets/volktek/products/poe/SEN-8428PL-24V.jpg";
import poeIns8624P from "@/assets/volktek/products/poe/INS-8624P.jpg";
import poeIen8608PA from "@/assets/volktek/products/poe/IEN-8608PA.jpg";
import poeIen8608PA24V from "@/assets/volktek/products/poe/IEN-8608PA-24V.jpg";
import poeIen8648PA from "@/assets/volktek/products/poe/IEN-8648PA.jpg";
import poeIen8648PA24V from "@/assets/volktek/products/poe/IEN-8648PA-24V.jpg";
import poeHns8605P from "@/assets/volktek/products/poe/HNS-8605P.jpg";
import poeHns8615P from "@/assets/volktek/products/poe/HNS-8615P.jpg";
import poe9560 from "@/assets/volktek/products/poe/9560-16GP4XS-I.jpg";
import poe9005x16 from "@/assets/volktek/products/poe/9005-16GP2GS.jpg";
import poe9005x24 from "@/assets/volktek/products/poe/9005-24GP2GS.jpg";
import poe9060 from "@/assets/volktek/products/poe/9060-4GP2GS.jpg";
import poeSen9648PM from "@/assets/volktek/products/poe/SEN-9648PM-24V.jpg";
import poeSen9648PNema from "@/assets/volktek/products/poe/SEN-9648P-24V-SS-NEMA.jpg";
import poe9060Nema from "@/assets/volktek/products/poe/9060-4GP2GS-NEMA.jpg";
import poeSen9425PRW from "@/assets/volktek/products/poe/SEN-9425P-24V-RW.jpg";
import poeSen9428PRW from "@/assets/volktek/products/poe/SEN-9428P-24V-RW.jpg";
import poeSen9648PRW from "@/assets/volktek/products/poe/SEN-9648P-24V-RW.jpg";
import poeSen9425PSS from "@/assets/volktek/products/poe/SEN-9425P-24V-SS.jpg";
import poeSen9428PSS from "@/assets/volktek/products/poe/SEN-9428P-24V-SS.jpg";
import poeSen9648PSS from "@/assets/volktek/products/poe/SEN-9648P-24V-SS.jpg";

const detail = (id: number) => `https://www.volktek.com/productdetail_en.php?id=${id}`;

export const volktekIndustrialPoe: VolktekCategory = {
  id: "industrial-poe",
  title: "Industrial PoE Switches",
  subCategories: [
    {
      id: "poe-unmanaged-basic",
      title: "Unmanaged Basic PoE+",
      blurb: "PoE+ Unmanaged Switch สำหรับงานติดตั้งกล้อง/AP/IoT ขนาดเล็ก-กลาง — เสียบใช้ไม่ต้องตั้งค่า ทนสภาพอุตสาหกรรม",
      products: [
        { model: "INS-8424P", description: "4x 10/100/1000 PoE+ + 2x GbE SFP — Unmanaged Industrial Switch", image: poeIns8424P, features: ["PoE+", "4P+2 SFP", "Unmanaged"], sourceUrl: detail(1634) },
        { model: "HNS-8405P", description: "4x 10/100/1000 PoE+ + 1x GbE RJ45 — Unmanaged Hardened", image: poeHns8405P, features: ["PoE+", "Hardened", "5-port"], sourceUrl: detail(1626) },
        { model: "HNS-8415P", description: "4x PoE+ + 1x GbE RJ45 + 1x GbE SFP — Unmanaged Hardened", image: poeHns8415P, features: ["PoE+", "Hardened", "Fiber"], sourceUrl: detail(1627) },
        { model: "IEN-8205P-24V", description: "4x PoE+ + 1x GbE RJ45 — Unmanaged Hardened, 24V DC", image: poeIen8205P, features: ["PoE+", "24V DC", "Hardened"], sourceUrl: detail(1632) },
        { model: "INS-8224P", description: "4x PoE+ + 2x GbE SFP — Unmanaged Hardened", image: poeIns8224P, features: ["PoE+", "Fiber", "Hardened"], sourceUrl: detail(1631) },
        { model: "IEN-8225P-24V", description: "4x PoE+ + 1x GbE RJ45 + 2x GbE SFP — Unmanaged Hardened", image: poeIen8225P, features: ["PoE+", "Fiber", "24V DC"], sourceUrl: detail(1633) },
        { model: "IEN-8408P-24V", description: "8x 10/100/1000 PoE+ — Unmanaged Industrial, 24V DC", image: poeIen8408P, features: ["PoE+", "8-port", "24V DC"], sourceUrl: detail(75) },
        { model: "IEN-8428P", description: "8x PoE+ + 2x FX/GbE SFP — Unmanaged Industrial", image: poeIen8428P, features: ["PoE+", "Fiber", "8-port"], sourceUrl: detail(1129) },
        { model: "IEN-8428P-24V", description: "8x PoE+ + 2x FX/GbE SFP — Unmanaged Industrial, 24V DC", image: poeIen8428P24V, features: ["PoE+", "Fiber", "24V DC"], sourceUrl: detail(76) },
      ],
    },
    {
      id: "poe-unmanaged-premium",
      title: "Unmanaged Premium PoE+",
      blurb: "Premium Unmanaged PoE+ — ทนทานสูง อายุการใช้งานยาวนาน เหมาะกับโครงการขนาดใหญ่",
      products: [
        { model: "7160-7GP1GT-24V-I", description: "7x PoE+ + 1x GbE RJ45 — Premium Unmanaged Industrial", image: poe7160, features: ["PoE+", "7-port", "Premium"], sourceUrl: detail(1628) },
      ],
    },
    {
      id: "poe-lite-managed",
      title: "Lite Managed PoE+",
      blurb: "Lite Managed PoE+ — VLAN/QoS/SNMP เบื้องต้น ราคาคุ้มค่าสำหรับงาน SME",
      products: [
        { model: "SEN-8415PL", description: "4x PoE+ + 1x GbE RJ45 + 1x FX/GbE SFP — Lite Managed", image: poeSen8415PL, features: ["Lite Managed", "Fiber"], sourceUrl: detail(1608) },
        { model: "SEN-8405PL-24V", description: "4x PoE+ + 1x GbE RJ45 — Lite Managed, 24V DC", image: poeSen8405PL, features: ["Lite Managed", "24V DC"], sourceUrl: detail(1613) },
        { model: "SEN-8425PL-24V", description: "4x PoE+ + 1x GbE RJ45 + 2x FX/GbE SFP — Lite Managed", image: poeSen8425PL, features: ["Lite Managed", "Fiber", "24V DC"], sourceUrl: detail(1614) },
        { model: "SEN-8424PL", description: "4x PoE+ + 2x FX/GbE SFP — Lite Managed", image: poeSen8424PL, features: ["Lite Managed", "Fiber"], sourceUrl: detail(1609) },
        { model: "SEN-8428PL", description: "8x PoE+ + 2x FX/GbE SFP — Lite Managed", image: poeSen8428PL, features: ["Lite Managed", "8-port"], sourceUrl: detail(1611) },
        { model: "SEN-8428PL-24V", description: "8x PoE+ + 2x FX/GbE SFP — Lite Managed, 24V DC", image: poeSen8428PL24V, features: ["Lite Managed", "24V DC"], sourceUrl: detail(1612) },
      ],
    },
    {
      id: "poe-managed",
      title: "Managed PoE+",
      blurb: "Full Managed PoE+ — รองรับ Ring Protection, ACL, IGMP, 802.1X เหมาะกับโรงงานและเครือข่ายซับซ้อน",
      products: [
        { model: "INS-8624P", description: "4x PoE+ + 2x FX/GbE SFP — Managed Industrial", image: poeIns8624P, features: ["Managed", "Fiber"], sourceUrl: detail(1589) },
        { model: "IEN-8608PA", description: "8x PoE+ + Combo Console RJ45/USB — Managed Industrial", image: poeIen8608PA, features: ["Managed", "8-port", "Console"], sourceUrl: detail(1639) },
        { model: "IEN-8608PA-24V", description: "8x PoE+ + Combo Console — Managed, 24V DC", image: poeIen8608PA24V, features: ["Managed", "24V DC"], sourceUrl: detail(1640) },
        { model: "IEN-8648PA", description: "8x PoE+ + 4x GbE SFP + Console — Managed", image: poeIen8648PA, features: ["Managed", "Fiber", "8-port"], sourceUrl: detail(1590) },
        { model: "IEN-8648PA-24V", description: "8x PoE+ + 4x GbE SFP + Console — Managed, 24V DC", image: poeIen8648PA24V, features: ["Managed", "Fiber", "24V DC"], sourceUrl: detail(1642) },
        { model: "HNS-8605P", description: "4x PoE+ + 1x GbE RJ45 — Managed Hardened", image: poeHns8605P, features: ["Managed", "Hardened"], sourceUrl: detail(1629) },
        { model: "HNS-8615P", description: "4x PoE+ + 1x GbE RJ45 + 1x FX/GbE SFP — Managed Hardened", image: poeHns8615P, features: ["Managed", "Hardened", "Fiber"], sourceUrl: detail(1630) },
        { model: "9560-16GP4XS-I", description: "16x PoE+ + 4x 1G/10G SFP+ — Managed Industrial", image: poe9560, features: ["Managed", "16-port", "10G SFP+"], sourceUrl: detail(1615) },
        { model: "9005-16GP2GS", description: "16x PoE+ + 2x FX/GbE SFP — Managed Industrial", image: poe9005x16, features: ["Managed", "16-port"], sourceUrl: detail(1142) },
        { model: "9005-24GP2GS", description: "24x PoE+ + 2x FX/GbE SFP + Console — Managed Industrial", image: poe9005x24, features: ["Managed", "24-port", "Fiber"], sourceUrl: detail(110) },
      ],
    },
    {
      id: "poe-managed-pp",
      title: "Managed PoE++",
      blurb: "PoE++ (90W) สำหรับกล้อง PTZ, AP กำลังสูง, อุปกรณ์โหลดหนัก",
      products: [
        { model: "9060-4GP2GS", description: "4x PoE++ + 2x GbE SFP + 2x DI + Console — Managed Industrial", image: poe9060, features: ["PoE++ 90W", "Managed", "DI"], sourceUrl: detail(1678) },
      ],
    },
    {
      id: "poe-dnv-lr",
      title: "DNV & LR Certified PoE+",
      blurb: "ผ่านการรับรอง DNV / Lloyd's Register สำหรับงานทางทะเลและโรงงานบนเรือ",
      products: [
        { model: "SEN-9648PM-24V", description: "8x PoE+ + 4x GbE SFP — Managed, DNV Marine Approval", image: poeSen9648PM, features: ["DNV Marine", "Managed", "Fiber"], sourceUrl: detail(1654) },
      ],
    },
    {
      id: "poe-nema-ts2",
      title: "NEMA TS2 Certified PoE+",
      blurb: "ผ่าน NEMA TS2 สำหรับงานควบคุมไฟจราจรและระบบขนส่งอัจฉริยะ (ITS)",
      products: [
        { model: "SEN-9648P-24V-SS", description: "8x PoE+ + 4x GbE SFP — Managed, NEMA TS2 Approval", image: poeSen9648PNema, features: ["NEMA TS2", "Managed", "Fiber"], sourceUrl: detail(1708) },
        { model: "9060-4GP2GS (NEMA)", description: "4x PoE++ + 2x GbE SFP + DI + Console — Managed, NEMA TS2", image: poe9060Nema, features: ["NEMA TS2", "PoE++"], sourceUrl: detail(1707) },
      ],
    },
    {
      id: "poe-railway",
      title: "Railway Certified PoE+",
      blurb: "ผ่านมาตรฐานรถไฟ EN50155 / EN50121-4 สำหรับงานสถานีและขบวนรถไฟ",
      products: [
        { model: "SEN-9425P-24V-RW", description: "4x PoE+ + 1x GbE RJ45 + 2x GbE SFP — Unmanaged, Railway", image: poeSen9425PRW, features: ["Railway", "EN50155", "Fiber"], sourceUrl: detail(1650) },
        { model: "SEN-9428P-24V-RW", description: "8x PoE+ + 2x FX/GbE SFP — Unmanaged, Railway", image: poeSen9428PRW, features: ["Railway", "8-port"], sourceUrl: detail(1652) },
        { model: "SEN-9648P-24V-RW", description: "8x PoE+ + 4x GbE SFP — Managed, Railway", image: poeSen9648PRW, features: ["Railway", "Managed", "Fiber"], sourceUrl: detail(1645) },
      ],
    },
    {
      id: "poe-substation",
      title: "Substation Certified PoE+",
      blurb: "ผ่าน IEC 61850-3 / IEEE 1613 สำหรับสถานีไฟฟ้าและสภาพแวดล้อม EMI สูง",
      products: [
        { model: "SEN-9425P-24V-SS", description: "4x PoE+ + 1x GbE RJ45 + 2x GbE SFP — Unmanaged, Substation", image: poeSen9425PSS, features: ["Substation", "IEC 61850"], sourceUrl: detail(1651) },
        { model: "SEN-9428P-24V-SS", description: "8x PoE+ + 2x GbE SFP — Unmanaged, Substation", image: poeSen9428PSS, features: ["Substation", "8-port"], sourceUrl: detail(1653) },
        { model: "SEN-9648P-24V-SS", description: "8x PoE+ + 4x GbE SFP — Managed, Substation", image: poeSen9648PSS, features: ["Substation", "Managed"], sourceUrl: detail(1655) },
      ],
    },
  ],
};

/* ============================================================
 * Phase 4: Industrial Ethernet Switches (11 sub-categories, 43 รุ่น)
 * ============================================================ */
import ie_INS_801E from "@/assets/volktek/products/ie/INS-801E.jpg";
import ie_INS_802E from "@/assets/volktek/products/ie/INS-802E.jpg";
import ie_INS_806E from "@/assets/volktek/products/ie/INS-806E.jpg";
import ie_INS_8005E from "@/assets/volktek/products/ie/INS-8005E.jpg";
import ie_INS_8008E from "@/assets/volktek/products/ie/INS-8008E.jpg";
import ie_INS_8108E from "@/assets/volktek/products/ie/INS-8108E.jpg";
import ie_INS_8405E from "@/assets/volktek/products/ie/INS-8405E.jpg";
import ie_INS_8408E from "@/assets/volktek/products/ie/INS-8408E.jpg";
import ie_INS_8005A from "@/assets/volktek/products/ie/INS-8005A.jpg";
import ie_INS_8008A from "@/assets/volktek/products/ie/INS-8008A.jpg";
import ie_INS_8405A from "@/assets/volktek/products/ie/INS-8405A.jpg";
import ie_INS_8408A from "@/assets/volktek/products/ie/INS-8408A.jpg";
import ie_INS_840G from "@/assets/volktek/products/ie/INS-840G.jpg";
import ie_INS_8005M from "@/assets/volktek/products/ie/INS-8005M.jpg";
import ie_INS_8405M from "@/assets/volktek/products/ie/INS-8405M.jpg";
import ie_INS_8408AM from "@/assets/volktek/products/ie/INS-8408AM.jpg";
import ie_IEN_840GL from "@/assets/volktek/products/ie/IEN-840GL.jpg";
import ie_IEN_8415L from "@/assets/volktek/products/ie/IEN-8415L.jpg";
import ie_IEN_8424L from "@/assets/volktek/products/ie/IEN-8424L.jpg";
import ie_INS_8415 from "@/assets/volktek/products/ie/INS-8415.jpg";
import ie_INS_8615 from "@/assets/volktek/products/ie/INS-8615.jpg";
import ie_INS_8624 from "@/assets/volktek/products/ie/INS-8624.jpg";
import ie_IEN_8608A from "@/assets/volktek/products/ie/IEN-8608A.jpg";
import ie_IEN_8648A from "@/assets/volktek/products/ie/IEN-8648A.jpg";
import ie_9015_8GT_I from "@/assets/volktek/products/ie/9015-8GT-I.jpg";
import ie_9015_16GT_I from "@/assets/volktek/products/ie/9015-16GT-I.jpg";
import ie_9015_8GT2GS_I from "@/assets/volktek/products/ie/9015-8GT2GS-I.jpg";
import ie_9560_16GT4XS_I from "@/assets/volktek/products/ie/9560-16GT4XS-I.jpg";
import ie_7013_16T_I from "@/assets/volktek/products/ie/7013-16T-I.jpg";
import ie_7013_16GT_I from "@/assets/volktek/products/ie/7013-16GT-I.jpg";
import ie_7015_8GT2GS_I from "@/assets/volktek/products/ie/7015-8GT2GS-I.jpg";
import ie_IEN_9425_RW from "@/assets/volktek/products/ie/IEN-9425-RW.jpg";
import ie_IEN_9428_RW from "@/assets/volktek/products/ie/IEN-9428-RW.jpg";
import ie_IEN_9648_RW from "@/assets/volktek/products/ie/IEN-9648-RW.jpg";
import ie_IEN_9425_SS from "@/assets/volktek/products/ie/IEN-9425-SS.jpg";
import ie_IEN_9428_SS from "@/assets/volktek/products/ie/IEN-9428-SS.jpg";
import ie_IEN_9648_SS from "@/assets/volktek/products/ie/IEN-9648-SS.jpg";
import ie_IEN_9648M from "@/assets/volktek/products/ie/IEN-9648M.jpg";
import ie_IEN_9648M_NEMA from "@/assets/volktek/products/ie/IEN-9648M_nema-ts2.jpg";
import ie_IEN_9648_PN from "@/assets/volktek/products/ie/IEN-9648-PN.jpg";
import ie_IEN_8648A_EIP from "@/assets/volktek/products/ie/IEN-8648A-EIP.jpg";
import ie_7015_4U2T_T1L from "@/assets/volktek/products/ie/7015-4U2T-T1L.jpg";
import ie_8015_Series from "@/assets/volktek/products/ie/8015_Series.jpg";

export const volktekIndustrialEthernet: VolktekCategory = {
  id: "industrial-ethernet",
  title: "Industrial Ethernet Switches",
  subCategories: [
    {
      id: "ie-unmanaged-basic",
      title: "Unmanaged Basic",
      blurb: "Unmanaged Industrial Ethernet — เสียบใช้ ไม่ต้องตั้งค่า เหมาะกับงาน Field-level ขนาดเล็ก",
      products: [
        { model: "INS-801E", description: "5x 10/100BASE-TX — Unmanaged Industrial Switch", image: ie_INS_801E, features: ["Unmanaged", "5-port", "Fast Ethernet"], sourceUrl: detail(54) },
        { model: "INS-802E", description: "8x 10/100BASE-TX — Unmanaged Industrial Switch", image: ie_INS_802E, features: ["Unmanaged", "8-port", "Fast Ethernet"], sourceUrl: detail(55) },
        { model: "INS-806E", description: "4x 10/100BASE-TX + 2x 100BASE-FX — Unmanaged Industrial", image: ie_INS_806E, features: ["Unmanaged", "Fiber", "6-port"], sourceUrl: detail(57) },
        { model: "INS-8005E", description: "5x 10/100/1000BASE-T — Unmanaged Industrial Gigabit", image: ie_INS_8005E, features: ["Unmanaged", "5-port", "Gigabit"], sourceUrl: detail(58) },
        { model: "INS-8008E", description: "8x 10/100/1000BASE-T — Unmanaged Industrial Gigabit", image: ie_INS_8008E, features: ["Unmanaged", "8-port", "Gigabit"], sourceUrl: detail(59) },
        { model: "INS-8108E", description: "8x GbE + 1x 10G SFP+ — Unmanaged Industrial", image: ie_INS_8108E, features: ["Unmanaged", "10G SFP+", "8-port"], sourceUrl: detail(1731) },
        { model: "INS-8405E", description: "4x GbE + 1x GbE SFP — Unmanaged Industrial", image: ie_INS_8405E, features: ["Unmanaged", "Fiber", "5-port"], sourceUrl: detail(60) },
        { model: "INS-8408E", description: "8x GbE + 2x FX/GbE SFP — Unmanaged Industrial", image: ie_INS_8408E, features: ["Unmanaged", "Fiber", "10-port"], sourceUrl: detail(61) },
      ],
    },
    {
      id: "ie-unmanaged-premium",
      title: "Unmanaged Premium",
      blurb: "Premium Unmanaged Switch — ทนทานกว่ามาตรฐาน อายุการใช้งานยาวขึ้น เหมาะกับโครงการระยะยาว",
      products: [
        { model: "INS-8005A", description: "5x GbE — Premium Unmanaged Industrial Gigabit", image: ie_INS_8005A, features: ["Premium", "5-port", "Gigabit"], sourceUrl: detail(1622) },
        { model: "INS-8008A", description: "8x GbE — Premium Unmanaged Industrial Gigabit", image: ie_INS_8008A, features: ["Premium", "8-port", "Gigabit"], sourceUrl: detail(1623) },
        { model: "INS-8405A", description: "4x GbE + 1x GbE SFP — Premium Unmanaged Industrial", image: ie_INS_8405A, features: ["Premium", "Fiber", "5-port"], sourceUrl: detail(1624) },
        { model: "INS-8408A", description: "8x GbE + 2x FX/GbE SFP — Premium Unmanaged Industrial", image: ie_INS_8408A, features: ["Premium", "Fiber", "10-port"], sourceUrl: detail(1625) },
        { model: "INS-840G", description: "4x GbE + 1x GbE SFP + 1x GbE RJ45 — Premium Unmanaged", image: ie_INS_840G, features: ["Premium", "Fiber", "6-port"], sourceUrl: detail(1635) },
      ],
    },
    {
      id: "ie-lite-managed",
      title: "Lite Managed",
      blurb: "Lite Managed — VLAN/QoS/SNMP/IGMP เบื้องต้น ราคาคุ้มค่า",
      products: [
        { model: "INS-8005M", description: "5x GbE — Lite Managed Industrial Gigabit", image: ie_INS_8005M, features: ["Lite Managed", "5-port"], sourceUrl: detail(1591) },
        { model: "INS-8405M", description: "4x GbE + 1x GbE SFP — Lite Managed Industrial", image: ie_INS_8405M, features: ["Lite Managed", "Fiber"], sourceUrl: detail(1592) },
        { model: "INS-8408AM", description: "8x GbE + 2x FX/GbE SFP — Lite Managed Industrial", image: ie_INS_8408AM, features: ["Lite Managed", "Fiber", "10-port"], sourceUrl: detail(1593) },
        { model: "IEN-840GL", description: "4x GbE + 1x GbE SFP + 1x GbE RJ45 — Lite Managed", image: ie_IEN_840GL, features: ["Lite Managed", "Fiber"], sourceUrl: detail(1636) },
        { model: "IEN-8415L", description: "4x GbE + 1x GbE RJ45 + 1x FX/GbE SFP — Lite Managed", image: ie_IEN_8415L, features: ["Lite Managed", "Fiber"], sourceUrl: detail(1637) },
        { model: "IEN-8424L", description: "4x GbE + 2x FX/GbE SFP — Lite Managed", image: ie_IEN_8424L, features: ["Lite Managed", "Fiber"], sourceUrl: detail(1638) },
      ],
    },
    {
      id: "ie-managed",
      title: "Managed Switches",
      blurb: "Full Managed — Ring Protection, ACL, IGMP, 802.1X เหมาะกับเครือข่ายซับซ้อน",
      products: [
        { model: "INS-8415", description: "4x GbE + 1x GbE RJ45 + 1x FX/GbE SFP — Managed", image: ie_INS_8415, features: ["Managed", "Fiber"], sourceUrl: detail(1594) },
        { model: "INS-8615", description: "4x GbE + 1x GbE RJ45 + 1x FX/GbE SFP — Managed", image: ie_INS_8615, features: ["Managed", "Fiber"], sourceUrl: detail(1595) },
        { model: "INS-8624", description: "4x GbE + 2x FX/GbE SFP — Managed Industrial", image: ie_INS_8624, features: ["Managed", "Fiber"], sourceUrl: detail(1596) },
        { model: "IEN-8608A", description: "8x GbE + Combo Console — Managed Industrial", image: ie_IEN_8608A, features: ["Managed", "8-port", "Console"], sourceUrl: detail(1597) },
        { model: "IEN-8648A", description: "8x GbE + 4x GbE SFP + Console — Managed Industrial", image: ie_IEN_8648A, features: ["Managed", "Fiber", "12-port"], sourceUrl: detail(1598) },
        { model: "9015-8GT-I", description: "8x GbE — Managed Industrial Gigabit", image: ie_9015_8GT_I, features: ["Managed", "8-port", "Gigabit"], sourceUrl: detail(1656) },
        { model: "9015-16GT-I", description: "16x GbE — Managed Industrial Gigabit", image: ie_9015_16GT_I, features: ["Managed", "16-port", "Gigabit"], sourceUrl: detail(1657) },
        { model: "9015-8GT2GS-I", description: "8x GbE + 2x FX/GbE SFP — Managed Industrial", image: ie_9015_8GT2GS_I, features: ["Managed", "Fiber"], sourceUrl: detail(1658) },
        { model: "9560-16GT4XS-I", description: "16x GbE + 4x 1G/10G SFP+ — Managed Industrial", image: ie_9560_16GT4XS_I, features: ["Managed", "16-port", "10G SFP+"], sourceUrl: detail(1616) },
        { model: "7013-16T-I", description: "16x 10/100BASE-TX — Managed Industrial", image: ie_7013_16T_I, features: ["Managed", "16-port"], sourceUrl: detail(1641) },
        { model: "7013-16GT-I", description: "16x GbE — Managed Industrial Gigabit", image: ie_7013_16GT_I, features: ["Managed", "16-port", "Gigabit"], sourceUrl: detail(1643) },
        { model: "7015-8GT2GS-I", description: "8x GbE + 2x FX/GbE SFP — Managed Industrial", image: ie_7015_8GT2GS_I, features: ["Managed", "Fiber", "10-port"], sourceUrl: detail(1644) },
      ],
    },
    {
      id: "ie-dnv-lr",
      title: "DNV & LR Marine",
      blurb: "ผ่าน DNV / Lloyd's Register — สำหรับงานทางทะเลและเรือเดินสมุทร",
      products: [
        { model: "IEN-9648M", description: "8x GbE + 4x GbE SFP — Managed, DNV Marine Approval", image: ie_IEN_9648M, features: ["DNV Marine", "Managed", "Fiber"], sourceUrl: detail(1659) },
      ],
    },
    {
      id: "ie-nema-ts2",
      title: "NEMA TS2",
      blurb: "ผ่าน NEMA TS2 — สำหรับงานควบคุมไฟจราจรและ Intelligent Transportation System",
      products: [
        { model: "IEN-9648M (NEMA TS2)", description: "8x GbE + 4x GbE SFP — Managed, NEMA TS2", image: ie_IEN_9648M_NEMA, features: ["NEMA TS2", "Managed", "Fiber"], sourceUrl: detail(1709) },
      ],
    },
    {
      id: "ie-railway",
      title: "Railway Certified",
      blurb: "ผ่าน EN50155 / EN50121-4 — สำหรับสถานีและขบวนรถไฟ",
      products: [
        { model: "IEN-9425-RW", description: "4x GbE + 1x GbE RJ45 + 2x GbE SFP — Unmanaged, Railway", image: ie_IEN_9425_RW, features: ["Railway", "EN50155", "Fiber"], sourceUrl: detail(1646) },
        { model: "IEN-9428-RW", description: "8x GbE + 2x FX/GbE SFP — Unmanaged, Railway", image: ie_IEN_9428_RW, features: ["Railway", "EN50155", "Fiber"], sourceUrl: detail(1647) },
        { model: "IEN-9648-RW", description: "8x GbE + 4x GbE SFP — Managed, Railway", image: ie_IEN_9648_RW, features: ["Railway", "Managed", "Fiber"], sourceUrl: detail(1648) },
      ],
    },
    {
      id: "ie-substation",
      title: "Substation Certified",
      blurb: "ผ่าน IEC 61850-3 / IEEE 1613 — สำหรับสถานีไฟฟ้าและสภาพแวดล้อม EMI สูง",
      products: [
        { model: "IEN-9425-SS", description: "4x GbE + 1x GbE RJ45 + 2x GbE SFP — Unmanaged, Substation", image: ie_IEN_9425_SS, features: ["Substation", "IEC 61850"], sourceUrl: detail(1660) },
        { model: "IEN-9428-SS", description: "8x GbE + 2x FX/GbE SFP — Unmanaged, Substation", image: ie_IEN_9428_SS, features: ["Substation", "8-port"], sourceUrl: detail(1661) },
        { model: "IEN-9648-SS", description: "8x GbE + 4x GbE SFP — Managed, Substation", image: ie_IEN_9648_SS, features: ["Substation", "Managed", "Fiber"], sourceUrl: detail(1662) },
      ],
    },
    {
      id: "ie-profinet",
      title: "PROFINET Certified",
      blurb: "ผ่าน PROFINET — สำหรับระบบ Industrial Automation ที่ใช้โปรโตคอล PROFINET",
      products: [
        { model: "IEN-9648-PN", description: "8x GbE + 4x GbE SFP — Managed, PROFINET Certified", image: ie_IEN_9648_PN, features: ["PROFINET", "Managed", "Fiber"], sourceUrl: detail(1710) },
      ],
    },
    {
      id: "ie-ethernet-ip",
      title: "EtherNet/IP Certified",
      blurb: "ผ่าน EtherNet/IP (ODVA) — สำหรับระบบที่ใช้โปรโตคอล CIP",
      products: [
        { model: "IEN-8648A-EIP", description: "8x GbE + 4x GbE SFP — Managed, EtherNet/IP Certified", image: ie_IEN_8648A_EIP, features: ["EtherNet/IP", "Managed", "Fiber"], sourceUrl: detail(1711) },
      ],
    },
    {
      id: "ie-spe",
      title: "Single-Pair Ethernet (SPE)",
      blurb: "Long-Reach SPE — ลดสาย ลดต้นทุน เพิ่มความน่าเชื่อถือสำหรับ Field Network",
      products: [
        { model: "7015-4U2T-T1L", description: "4x 10BASE-T1L SPE + 2x GbE — Managed Industrial SPE", image: ie_7015_4U2T_T1L, features: ["SPE", "10BASE-T1L", "Managed"], sourceUrl: detail(1712) },
        { model: "8015 Series", description: "Industrial SPE Switch Series — Long-Reach Single-Pair Ethernet", image: ie_8015_Series, features: ["SPE", "Long-Reach", "Industrial"], sourceUrl: detail(1713) },
      ],
    },
  ],
};

/* ============================================================
 * Phase 5: Metro Ethernet Switches (2 sub-categories, 5 รุ่น)
 * ============================================================ */
import metro_MEN_6412 from "@/assets/volktek/products/metro/MEN-6412.jpg";
import metro_6500_24GS4XS from "@/assets/volktek/products/metro/6500-24GS4XS.jpg";
import metro_MEN_3406 from "@/assets/volktek/products/metro/MEN-3406.jpg";
import metro_MEN_3410 from "@/assets/volktek/products/metro/MEN-3410.jpg";
import metro_5100_24GT2GS from "@/assets/volktek/products/metro/5100-24GT2GS.jpg";

export const volktekMetroEthernet: VolktekCategory = {
  id: "metro-ethernet",
  title: "Metro Ethernet Switches",
  subCategories: [
    {
      id: "metro-aggregation",
      title: "1G / 10G Aggregation",
      blurb: "Aggregation Switch สำหรับ Service Provider และ Metro Network — รวม Traffic จาก Access Layer ขึ้น Core",
      products: [
        { model: "MEN-6412", description: "4x FX/GbE Combo RJ45/SFP + 4x FX/GbE SFP + 4x GbE SFP + Console — Managed Aggregation Switch", image: metro_MEN_6412, features: ["Managed", "Aggregation", "Fiber", "12-port"], sourceUrl: detail(68) },
        { model: "6500-24GS4XS", description: "20x FX/GbE SFP + 4x FE/GbE Combo RJ45/SFP + 4x GbE/10G SFP+ + Console — L2+ Managed Aggregation", image: metro_6500_24GS4XS, features: ["L2+ Managed", "10G SFP+", "28-port", "Fiber"], sourceUrl: detail(188) },
      ],
    },
    {
      id: "metro-access",
      title: "1G / 10G Access",
      blurb: "Access Switch สำหรับ Metro Edge — เชื่อมต่อปลายทางเข้าเครือข่าย Service Provider",
      products: [
        { model: "MEN-3406", description: "4x 10/100/1000 RJ45 + 2x FX/GbE SFP — Managed Access Switch", image: metro_MEN_3406, features: ["Managed", "Access", "Fiber", "6-port"], sourceUrl: detail(175) },
        { model: "MEN-3410", description: "8x 10/100/1000 RJ45 + 2x FX/GbE SFP + Console — Managed Access Switch", image: metro_MEN_3410, features: ["Managed", "Access", "Fiber", "10-port"], sourceUrl: detail(89) },
        { model: "5100-24GT2GS", description: "24x 10/100/1000 RJ45 + 2x FX/GbE SFP + Console — Managed Access Switch", image: metro_5100_24GT2GS, features: ["Managed", "24-port", "Fiber"], sourceUrl: detail(1141) },
      ],
    },
  ],
};

/* ============================================================
 * Phase 6: Media Converters (4 sub-categories, 14 รุ่น)
 * ============================================================ */
import mc_IMC_661P from "@/assets/volktek/products/mc/IMC-661P.jpg";
import mc_IMC_561P from "@/assets/volktek/products/mc/IMC-561P.jpg";
import mc_IMC_563P from "@/assets/volktek/products/mc/IMC-563P.jpg";
import mc_IMC_661 from "@/assets/volktek/products/mc/IMC-661.jpg";
import mc_IMC_561 from "@/assets/volktek/products/mc/IMC-561.jpg";
import mc_IMC_563 from "@/assets/volktek/products/mc/IMC-563.jpg";
import mc_HMC_652E from "@/assets/volktek/products/mc/HMC-652E.jpg";
import mc_HMC_672E from "@/assets/volktek/products/mc/HMC-672E.jpg";
import mc_NXF_742E from "@/assets/volktek/products/mc/NXF-742E.jpg";
import mc_NGF_763 from "@/assets/volktek/products/mc/NGF-763.jpg";
import mc_NGF_762E from "@/assets/volktek/products/mc/NGF-762E.jpg";
import mc_IRF_629 from "@/assets/volktek/products/mc/IRF-629.jpg";
import mc_IRF_631 from "@/assets/volktek/products/mc/IRF-631.jpg";
import mc_IMC_553 from "@/assets/volktek/products/mc/IMC-553.jpg";

export const volktekMediaConverter: VolktekCategory = {
  id: "media-converter",
  title: "Media Converters",
  subCategories: [
    {
      id: "mc-poe",
      title: "PoE+ Converters",
      blurb: "Media Converter รองรับ PoE+ — แปลง Copper ↔ Fiber พร้อมจ่ายไฟผ่านสาย LAN",
      products: [
        { model: "IMC-661P", description: "1x 10/100/1000 PoE+ + 1x FX/GbE SFP — Industrial Media Converter", image: mc_IMC_661P, features: ["PoE+", "Gigabit", "SFP"], sourceUrl: detail(1687) },
        { model: "IMC-561P", description: "1x 10/100/1000 PoE+ + 1x FX/GbE SFP — Hardened Media Converter", image: mc_IMC_561P, features: ["PoE+", "Hardened", "SFP"], sourceUrl: detail(1659) },
        { model: "IMC-563P", description: "1x 100/1000 PoE+ + 1x FX/GbE SFP — Industrial Mini Media Converter", image: mc_IMC_563P, features: ["PoE+", "Mini", "SFP"], sourceUrl: detail(1662) },
      ],
    },
    {
      id: "mc-copper-fiber",
      title: "Copper to Fiber",
      blurb: "Copper ↔ Fiber Converter — แปลงสัญญาณ RJ45 เป็น SFP/Fiber สำหรับขยายระยะทาง",
      products: [
        { model: "IMC-661", description: "1x 10/100/1000 RJ45 + 1x FX/GbE SFP — Industrial Media Converter", image: mc_IMC_661, features: ["Industrial", "Gigabit", "SFP"], sourceUrl: detail(1663) },
        { model: "IMC-561", description: "1x 10/100/1000 RJ45 + 1x FX/GbE SFP — Hardened Media Converter", image: mc_IMC_561, features: ["Hardened", "Gigabit", "SFP"], sourceUrl: detail(1660) },
        { model: "IMC-563", description: "1x 100/1000 RJ45 + 1x FX/GbE SFP — Industrial Media Converter", image: mc_IMC_563, features: ["Industrial", "Mini", "SFP"], sourceUrl: detail(1661) },
        { model: "HMC-652E", description: "1x 10/100 RJ45 + 1x FX Fiber — Hardened Media Converter", image: mc_HMC_652E, features: ["Hardened", "Fast Ethernet", "Fiber"], sourceUrl: detail(1664) },
        { model: "HMC-672E", description: "1x 10/100/1000 RJ45 + 1x FX/GbE Fiber — Hardened Media Converter", image: mc_HMC_672E, features: ["Hardened", "Gigabit", "Fiber"], sourceUrl: detail(1665) },
        { model: "NXF-742E", description: "1x 10/100 RJ45 + 1x 100FX Fiber — Media Converter", image: mc_NXF_742E, features: ["Fast Ethernet", "Fiber"], sourceUrl: detail(1641) },
        { model: "NGF-763", description: "1x 100/1000 RJ45 + 1x FX/GbE SFP — Media Converter", image: mc_NGF_763, features: ["Gigabit", "SFP"], sourceUrl: detail(1666) },
        { model: "NGF-762E", description: "1x 10/100/1000 RJ45 + 1x FX/GbE Fiber — Media Converter", image: mc_NGF_762E, features: ["Gigabit", "Fiber"], sourceUrl: detail(1667) },
      ],
    },
    {
      id: "mc-serial-fiber",
      title: "Serial to Fiber",
      blurb: "Serial ↔ Fiber Converter — แปลง RS-232/422/485 เป็น Fiber สำหรับงาน Industrial Automation",
      products: [
        { model: "IRF-629", description: "RS-422/485 to Fiber Converter — Industrial Serial Converter", image: mc_IRF_629, features: ["RS-422/485", "Fiber"], sourceUrl: detail(1669) },
        { model: "IRF-631", description: "RS-232 to Fiber Converter — Industrial Serial Converter", image: mc_IRF_631, features: ["RS-232", "Fiber"], sourceUrl: detail(1670) },
      ],
    },
    {
      id: "mc-spe",
      title: "SPE Converters",
      blurb: "Single-Pair Ethernet Converter — แปลง 10BASE-T ↔ 10BASE-T1L SPE สำหรับงาน Field Network",
      products: [
        { model: "IMC-553", description: "1x 10BASE-T1L SPE + 1x 10BASE-T — Unmanaged Industrial SPE Media Converter", image: mc_IMC_553, features: ["SPE", "10BASE-T1L", "Industrial"], sourceUrl: detail(1672) },
      ],
    },
  ],
};

/* ============================================================
 * Phase 7: EMS / NMS Software (2 sub-categories, 2 รุ่น)
 * ============================================================ */
import ems_LAMUNGAN from "@/assets/volktek/products/ems/LAMUNGAN.jpg";
import ems_INDY from "@/assets/volktek/products/ems/INDY.jpg";

export const volktekEmsNms: VolktekCategory = {
  id: "ems-nms",
  title: "EMS / NMS Software",
  subCategories: [
    {
      id: "ems-lamungan",
      title: "LAMUNGAN",
      blurb: "แพลตฟอร์มจัดการอุปกรณ์เครือข่ายแบบรวมศูนย์ — Wizard, Topology Map, Real-time Dashboard",
      products: [
        { model: "LAMUNGAN", description: "Element Management System สำหรับ Volktek Switches — Auto-discovery, Topology Map, Wizard Configuration, SNMP Trap, Real-time Dashboard", image: ems_LAMUNGAN, features: ["EMS", "Topology Map", "Wizard", "Multi-vendor"], sourceUrl: detail(1716) },
      ],
    },
    {
      id: "ems-indy",
      title: "INDY NMS",
      blurb: "Network Management System Software — บริหารจัดการเครือข่ายระดับองค์กรแบบครบวงจร",
      products: [
        { model: "INDY", description: "Network Management System Software — บริหารจัดการอุปกรณ์เครือข่ายแบบรวมศูนย์ พร้อม SNMP Monitoring และ Configuration Management", image: ems_INDY, features: ["NMS", "SNMP", "Enterprise"], sourceUrl: detail(1637) },
      ],
    },
  ],
};

/* ============================================================
 * Phase 8: SFP Modules (5 sub-categories, 7 รุ่น)
 * ============================================================ */
import sfp_FPM_107 from "@/assets/volktek/products/sfp/FPM-107.jpg";
import sfp_GBM_132TS from "@/assets/volktek/products/sfp/GBM-132TS.jpg";
import sfp_GBM_132RS from "@/assets/volktek/products/sfp/GBM-132RS.jpg";
import sfp_GBM_104 from "@/assets/volktek/products/sfp/GBM-104.jpg";
import sfp_GBM_123TS from "@/assets/volktek/products/sfp/GBM-123TS.jpg";
import sfp_GBM_123RS from "@/assets/volktek/products/sfp/GBM-123RS.jpg";
import sfp_GBM_162 from "@/assets/volktek/products/sfp/GBM-162.jpg";

export const volktekSfp: VolktekCategory = {
  id: "sfp",
  title: "SFP Modules",
  subCategories: [
    {
      id: "sfp-100base",
      title: "100BASE SFP",
      blurb: "100FX SFP Module — Duplex LC สำหรับ Fast Ethernet Fiber Link",
      products: [
        { model: "FPM-107", description: "100FX SFP Duplex LC — Fast Ethernet Fiber Module", image: sfp_FPM_107, features: ["100FX", "Duplex LC"], sourceUrl: detail(90) },
      ],
    },
    {
      id: "sfp-100base-bidi",
      title: "100BASE Bi-Di SFP",
      blurb: "100FX Bi-Directional SFP — Simplex LC ใช้สาย Fiber เส้นเดียว ส่ง-รับสองทาง",
      products: [
        { model: "GBM-132TS", description: "100FX Bi-Di SFP Simplex LC (TX) — Bi-Directional Fiber Module", image: sfp_GBM_132TS, features: ["100FX", "Bi-Di", "TX"], sourceUrl: detail(91) },
        { model: "GBM-132RS", description: "100FX Bi-Di SFP Simplex LC (RX) — Bi-Directional Fiber Module", image: sfp_GBM_132RS, features: ["100FX", "Bi-Di", "RX"], sourceUrl: detail(92) },
      ],
    },
    {
      id: "sfp-gigabit",
      title: "Gigabit SFP",
      blurb: "1.25G SFP Module — Duplex LC สำหรับ Gigabit Fiber Link",
      products: [
        { model: "GBM-104", description: "1.25G SFP Duplex LC — Gigabit Fiber Module", image: sfp_GBM_104, features: ["1.25G", "Duplex LC"], sourceUrl: detail(93) },
      ],
    },
    {
      id: "sfp-gigabit-bidi",
      title: "Gigabit Bi-Di SFP",
      blurb: "1.25G Bi-Directional SFP — Simplex LC ใช้สาย Fiber เส้นเดียวประหยัดต้นทุน",
      products: [
        { model: "GBM-123TS", description: "1.25G Bi-Di SFP Simplex LC (TX) — Bi-Directional Gigabit Module", image: sfp_GBM_123TS, features: ["1.25G", "Bi-Di", "TX"], sourceUrl: detail(94) },
        { model: "GBM-123RS", description: "1.25G Bi-Di SFP Simplex LC (RX) — Bi-Directional Gigabit Module", image: sfp_GBM_123RS, features: ["1.25G", "Bi-Di", "RX"], sourceUrl: detail(95) },
      ],
    },
    {
      id: "sfp-10g",
      title: "10G SFP+",
      blurb: "10G SFP+ Module — Duplex LC สำหรับ 10 Gigabit Fiber Uplink",
      products: [
        { model: "GBM-162", description: "10G SFP+ Duplex LC — 10 Gigabit Fiber Module", image: sfp_GBM_162, features: ["10G", "SFP+", "Duplex LC"], sourceUrl: detail(96) },
      ],
    },
  ],
};

/* ============================================================
 * Slug-based sourceUrl rewrite
 * เว็บ Volktek เปลี่ยนจาก productdetail_en.php?id=N เป็น slug pattern
 * productdetail/<lowercased-model>.html ซึ่งเสถียรกว่าและไม่ redirect ไป homepage
 * ============================================================ */
const modelToSlug = (model: string) =>
  model
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, "") // ตัดวงเล็บ เช่น "9060-4GP2GS (NEMA)" → "9060-4gp2gs"
    .trim();

const applySlugUrls = (cat: VolktekCategory): VolktekCategory => ({
  ...cat,
  subCategories: cat.subCategories.map((sub) => ({
    ...sub,
    products: sub.products.map((p) => ({
      ...p,
      sourceUrl: `https://www.volktek.com/productdetail/${modelToSlug(p.model)}.html`,
    })),
  })),
});

/* ============================================================
 * Master export — เพิ่ม category อื่นใน phase ถัดไป
 * ============================================================ */
export const volktekCatalog: VolktekCategory[] = [
  volktekLayer3,
  volktekIndustrialPoe,
  volktekIndustrialEthernet,
  volktekMetroEthernet,
  volktekMediaConverter,
  volktekEmsNms,
  volktekSfp,
  // Phase 9+: poe-injector, firewall, accessories
];


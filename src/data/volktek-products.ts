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
  /** ลิสต์พอร์ตและ interface (optional — Software products ไม่มีพอร์ต) */
  ports?: string[];
  /** LED Panel labels (optional) */
  ledPanel?: string;
  power?: {
    input: string;
    consumption: string;
    poeBudget?: string;
  };
  environment?: {
    tempOperating: string;
    tempStorage?: string;
    humidity?: string;
    housing: string;
  };
  physical?: {
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

// Phase 9: PoE Injectors / Splitters, Industrial Firewall, Accessories (Power Supply)
import imgIra90 from "@/assets/volktek/products/ira-90.jpg";
import imgIra160 from "@/assets/volktek/products/ira-160.jpg";
import imgSdr12048 from "@/assets/volktek/products/sdr-120-48.jpg";
import imgSdr24048 from "@/assets/volktek/products/sdr-240-48.jpg";
import imgSdr480p48 from "@/assets/volktek/products/sdr-480p-48.jpg";
import imgIpi432P60I from "@/assets/volktek/products/ipi-432p-60-i.jpg";
import imgIpi442P90I from "@/assets/volktek/products/ipi-442p-90-i.jpg";
import imgGpi421 from "@/assets/volktek/products/gpi-421.jpg";
import imgGpi431 from "@/assets/volktek/products/gpi-431.jpg";
import imgGpi441 from "@/assets/volktek/products/gpi-441.jpg";
import imgIps342P from "@/assets/volktek/products/ips-342p.jpg";
import imgFw31006GTI from "@/assets/volktek/products/fw-3100-6gt-i.jpg";

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
        {
          model: "INS-8424P",
          description: "4x 10/100/1000 PoE+ + 2x GbE SFP — Unmanaged Industrial Switch",
          image: poeIns8424P,
          features: ["PoE+", "4P+2 SFP", "Unmanaged"],
          sourceUrl: detail(1634),
          details: {
            overview:
              "INS-8424P เป็น Unmanaged Industrial Switch 4 พอร์ต 10/100/1000 PoE+ พร้อม Uplink 2 พอร์ต GbE SFP สำหรับงานเชื่อมต่อกล้อง CCTV และ Wireless AP — เสียบใช้ได้ทันทีไม่ต้องตั้งค่า รองรับการจ่ายไฟผ่านสาย LAN สูงสุด 30W ต่อพอร์ต ประหยัดต้นทุนเดินไฟแยก",
            highlights: [
              { title: "PoE+ 30W ต่อพอร์ต", desc: "IEEE 802.3af/at — รองรับกล้อง IP, AP, IoT ระยะ 100 เมตร โดยไม่ต้องเดินไฟแยก" },
              { title: "VLAN Passthru", desc: "ส่งผ่าน VLAN tagged frame โดยไม่ดรอป — ใช้ในเครือข่ายที่มี Managed Switch อื่นได้" },
              { title: "Industrial QoS", desc: "Priority สำหรับ EtherNet/IP, PROFINET, GOOSE — เหมาะกับงาน Automation" },
              { title: "Redundant Power + Alarm Relay", desc: "ระบบไฟสำรองคู่ + Relay แจ้งเตือนเมื่อไฟหลักดับ — ทำงานต่อเนื่องไม่ขาดตอน" },
              { title: "ทนสภาพอุตสาหกรรม", desc: "Operating temp -40°C~75°C, IP40 Aluminum Housing, DIN-Rail mount" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE RJ45)", "2 x GbE SFP Slots"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC", consumption: "System: 10W", poeBudget: "120W" },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP40 Protection)",
            },
            physical: { weight: "795 g (1.75 lb)", dimension: "57.3 x 175 x 126.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/ec61f05f3bd274200b786340463ad811.pdf",
          },
        },
        {
          model: "HNS-8405P",
          description: "4x 10/100/1000 PoE+ + 1x GbE RJ45 — Unmanaged Hardened",
          image: poeHns8405P,
          features: ["PoE+", "Hardened", "5-port"],
          sourceUrl: detail(1626),
          details: {
            overview:
              "HNS-8405P เป็น Unmanaged Hardened Switch 4 พอร์ต PoE+ พร้อม Uplink 1 พอร์ต Gigabit RJ45 — ออกแบบสำหรับติดตั้งในตู้ควบคุมและงานในร่มที่ไม่มีแอร์ (Hardened indoor) ใช้กล่อง Metal IP40 รองรับการเชื่อมต่อกล้อง CCTV / AP ขนาดเล็ก-กลาง ราคาเข้าถึงง่าย",
            highlights: [
              { title: "PoE+ 30W ต่อพอร์ต", desc: "IEEE 802.3af/at — Plug-n-Play ไม่ต้องตั้งค่าใด ๆ" },
              { title: "Metal IP40 Housing", desc: "ทนฝุ่น/ความชื้น เหมาะกับตู้ติดตั้งภาคสนาม" },
              { title: "VLAN Passthru", desc: "ส่งผ่าน VLAN tagged frame ได้แม้เป็น Unmanaged" },
              { title: "Redundant Power + Alarm Relay", desc: "รองรับไฟ Dual Input 48~57VDC + แจ้งเตือนไฟดับ" },
              { title: "งานในร่มทนทาน", desc: "Operating temp -10°C~60°C — เหมาะตู้ควบคุมโรงงาน, อาคาร" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE RJ45)", "1 x 10/100/1000BASE-T (RJ45 Uplink)"],
            ledPanel: "PWR, RPS, ALM, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC", consumption: "System: 9W (Total 130W ที่ PoE เต็มโหลด)", poeBudget: "120W (4 ports x 30W)" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "500 g (1.1 lb)", dimension: "31 x 136.3 x 105 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/8b5210b947d640169586e2e9a7f9a7f0.pdf",
          },
        },
        {
          model: "HNS-8415P",
          description: "4x PoE+ + 1x GbE RJ45 + 1x GbE SFP — Unmanaged Hardened",
          image: poeHns8415P,
          features: ["PoE+", "Hardened", "Fiber"],
          sourceUrl: detail(1627),
          details: {
            overview:
              "HNS-8415P เป็น Unmanaged Hardened Switch 4 พอร์ต PoE+ พร้อม Uplink 1 พอร์ต Gigabit RJ45 และ 1 พอร์ต GbE SFP สำหรับเชื่อม Fiber ระยะไกล — เหมาะสำหรับงานติดตั้งกล้อง CCTV ที่ระยะไกลกว่าสายทองแดง 100 เมตร เช่น คลังสินค้า, ลานจอด, สถานีไฟฟ้าย่อย",
            highlights: [
              { title: "PoE+ 30W ต่อพอร์ต", desc: "IEEE 802.3af/at — รองรับกล้อง PTZ และ AP" },
              { title: "GbE SFP Fiber Uplink", desc: "ขยายเครือข่ายระยะไกล (สูงสุด 80km ขึ้นกับ Module) — ปลอดสัญญาณรบกวน" },
              { title: "Surge Protection", desc: "ป้องกันไฟกระชากบนสาย LAN — เพิ่มความทนทานในงานภาคสนาม" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual Input 48~57VDC + Relay แจ้งเตือน" },
              { title: "Metal IP40 Hardened", desc: "ทำงาน -10°C~60°C, DIN-Rail mount" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE RJ45)", "1 x 10/100/1000BASE-T (RJ45)", "1 x GbE SFP Slot"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC", consumption: "System: 10W", poeBudget: "120W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "515 g (1.14 lb)", dimension: "31 x 136.3 x 105 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/fc5abc2ae5b9c4739a7d070c3126f186.pdf",
          },
        },
        {
          model: "IEN-8205P-24V",
          description: "4x PoE+ + 1x GbE RJ45 — Unmanaged Hardened, 24V DC",
          image: poeIen8205P,
          features: ["PoE+", "24V DC", "Hardened", "UL"],
          sourceUrl: detail(1632),
          details: {
            overview:
              "IEN-8205P-24V เป็น Premium Unmanaged Hardened Switch 4 พอร์ต PoE+ + 1 พอร์ต Gigabit RJ45 — รองรับช่วงไฟกว้าง 24~57VDC เหมาะกับโรงงานที่มี DC Bus 24V อยู่แล้วและงานติดตั้งกล้อง/AP ทั่วไป ผ่านการรับรอง UL สำหรับงานอุตสาหกรรม",
            highlights: [
              { title: "Wide Input Range 24~57VDC", desc: "ใช้กับ DC Bus โรงงาน 24V หรือ Power Adapter 48V ได้ทั้งคู่" },
              { title: "PoE+ 30W ต่อพอร์ต", desc: "IEEE 802.3af/at — Plug-n-Play" },
              { title: "Industrial QoS", desc: "Priority EtherNet/IP, PROFINET, GOOSE สำหรับงาน Automation" },
              { title: "LLDP Filtering", desc: "ป้องกัน device flapping จาก LLDP ที่ไม่ต้องการ" },
              { title: "UL Certified + Metal IP40", desc: "ผ่านมาตรฐาน UL -10°C~60°C" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE)", "1 x 10/100/1000BASE-T (RJ45)"],
            ledPanel: "PWR, PoE, 1000, LNK/ACT",
            power: { input: "Adapter / Terminal Block: 24~57VDC", consumption: "System: 13W", poeBudget: "120W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "750 g (1.7 lb)", dimension: "50 x 160 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/881841edb2ddb946a0f21ab3b39b70c4.pdf",
          },
        },
        {
          model: "INS-8224P",
          description: "4x PoE+ + 2x GbE SFP — Unmanaged Hardened",
          image: poeIns8224P,
          features: ["PoE+", "Fiber", "Hardened"],
          sourceUrl: detail(1631),
          details: {
            overview:
              "INS-8224P เป็น Unmanaged Hardened Switch 4 พอร์ต PoE+ พร้อม Uplink 2 พอร์ต GbE SFP สำหรับเชื่อมต่อ Fiber ระยะไกลและ Cascading กับสวิตช์อื่น — เหมาะกับงานติดตั้งกล้อง CCTV จำนวนมากที่ต้องการ Backbone Fiber",
            highlights: [
              { title: "Dual Fiber Uplink", desc: "2x GbE SFP — เชื่อมต่อ Backbone หรือ Ring ได้" },
              { title: "PoE+ 30W ต่อพอร์ต", desc: "รองรับกล้อง IP/PTZ, AP กำลังสูง" },
              { title: "VLAN Passthru", desc: "ส่งผ่าน VLAN ของ Managed Switch ปลายทาง" },
              { title: "Redundant Power + Surge Protection", desc: "Dual Input 48~57VDC + ป้องกันไฟกระชาก" },
              { title: "Metal IP40 Hardened", desc: "ทำงาน -10°C~60°C, DIN-Rail" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE RJ45)", "2 x GbE SFP Slots"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC", consumption: "System: 10W", poeBudget: "120W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "696 g (1.53 lb)", dimension: "50 x 160 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/4d07e2ee804641587a89d721f04c1db1.pdf",
          },
        },
        {
          model: "IEN-8225P-24V",
          description: "4x PoE+ + 1x GbE RJ45 + 2x GbE SFP — Unmanaged Hardened",
          image: poeIen8225P,
          features: ["PoE+", "Fiber", "24V DC", "UL"],
          sourceUrl: detail(1633),
          details: {
            overview:
              "IEN-8225P-24V เป็น Premium Unmanaged Hardened Switch 4 พอร์ต PoE+, 1 พอร์ต Gigabit RJ45 และ 2 พอร์ต GbE SFP Uplink — รองรับ DC 24~57V กว้างกว่ามาตรฐาน เหมาะกับงานติดตั้งกล้องในโรงงานและสภาพแวดล้อมที่ใช้ DC Bus",
            highlights: [
              { title: "7 พอร์ตรวม", desc: "4 PoE+ + 1 RJ45 + 2 SFP — ครอบคลุมทั้งกล้องและ Backbone" },
              { title: "Wide Input 24~57VDC", desc: "ใช้กับโรงงานที่มี DC Bus 24V หรือ Adapter 48V" },
              { title: "Industrial QoS", desc: "Priority EtherNet/IP, PROFINET, GOOSE" },
              { title: "LLDP Filtering + Surge Protection", desc: "ป้องกัน flap + ป้องกันไฟกระชาก" },
              { title: "UL Certified", desc: "ผ่านมาตรฐาน UL -10°C~60°C, Metal IP40" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE)", "1 x 10/100/1000BASE-T (RJ45)", "2 x GbE SFP Slots"],
            ledPanel: "PWR, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Adapter / Terminal Block: 24~57VDC", consumption: "System: 14W", poeBudget: "120W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "780 g (1.71 lb)", dimension: "50 x 160 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/a6ee9b5f350c8bbfe745e8d675c1dfbb.pdf",
          },
        },
        {
          model: "IEN-8408P-24V",
          description: "8x 10/100/1000 PoE+ — Unmanaged Industrial, 24V DC",
          image: poeIen8408P,
          features: ["PoE+", "8-port", "24V DC", "-40~75°C"],
          sourceUrl: detail(75),
          details: {
            overview:
              "IEN-8408P-24V เป็น Unmanaged Industrial Switch 8 พอร์ต PoE+ ทุกพอร์ต — ทนอุณหภูมิ -40°C~75°C สำหรับงานติดตั้งกลางแจ้ง/อุตสาหกรรมหนัก รองรับ DC Bus 24V กว้างถึง 57V — *Request by Project (สั่งทำตามโครงการ)*",
            highlights: [
              { title: "8 พอร์ต PoE+ เต็ม 30W", desc: "เชื่อมกล้อง/AP ได้ 8 จุดในตัวเดียว" },
              { title: "Wide Input 24~57VDC", desc: "ทำงานทั้ง 24V (PoE Budget 124W) และ 48V (PoE Budget 240W)" },
              { title: "Extreme Temperature -40~75°C", desc: "ติดตั้งกลางแจ้ง / Outdoor Cabinet ได้" },
              { title: "Industrial QoS", desc: "Priority EtherNet/IP, PROFINET, GOOSE + DIP Switch สำหรับ Storm Control" },
              { title: "Aluminum IP30 + Redundant Power", desc: "Dual Input + Alarm Relay + DIN-Rail" },
            ],
            ports: ["8 x 10/100/1000BASE-T PSE Ports"],
            ledPanel: "PWR, RPS, ALM, PoE, 1000, LNK/ACT",
            power: { input: "Primary 24~57VDC + Redundant 24~57VDC", consumption: "System: 12W", poeBudget: "124W @ 24VDC / 240W @ 48VDC" },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "920 g (2 lb)", dimension: "50 x 162 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/2875ccfb503b9296f5edc965136ddac2.pdf",
          },
        },
        {
          model: "IEN-8428P",
          description: "8x PoE+ + 2x FX/GbE SFP — Unmanaged Industrial",
          image: poeIen8428P,
          features: ["PoE+", "Fiber", "8-port", "-40~75°C"],
          sourceUrl: detail(1129),
          details: {
            overview:
              "IEN-8428P เป็น Unmanaged Industrial Switch 8 พอร์ต PoE+ พร้อม 2 พอร์ต FX/GbE Multi-rate SFP Uplink — รองรับทั้ง Fiber 100M และ 1G — สำหรับงานติดตั้งกล้องจำนวนมาก + Backbone Fiber ระยะไกล ทนอุณหภูมิ -40°C~75°C — *Request by Project*",
            highlights: [
              { title: "8 PoE+ + 2 Multi-rate SFP", desc: "เชื่อม Fiber 100M หรือ 1G ได้ในพอร์ตเดียวกัน" },
              { title: "PoE Budget 240W", desc: "จ่าย 30W ครบทุกพอร์ตได้พร้อมกัน" },
              { title: "EEE 802.3az", desc: "Energy Efficient Ethernet — ประหยัดพลังงาน" },
              { title: "Extreme Temperature -40~75°C", desc: "ติดตั้งกลางแจ้ง / Outdoor Cabinet" },
              { title: "Aluminum IP30 + Redundant Power", desc: "Dual Input 48~57VDC + Alarm Relay" },
            ],
            ports: ["8 x 10/100/1000BASE-T (PoE RJ45)", "2 x 100FX/GbE SFP Slots"],
            ledPanel: "PWR, RPS, ALM, POST, SFP, PoE, 1000M, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC", consumption: "System: 10W", poeBudget: "240W" },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "950 g (2.1 lb)", dimension: "50 x 162 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/78a677074502686e62c678ecad8b120a.pdf",
          },
        },
        {
          model: "IEN-8428P-24V",
          description: "8x PoE+ + 2x FX/GbE SFP — Unmanaged Industrial, 24V DC",
          image: poeIen8428P24V,
          features: ["PoE+", "Fiber", "24V DC", "-40~75°C"],
          sourceUrl: detail(76),
          details: {
            overview:
              "IEN-8428P-24V เป็น Unmanaged Industrial Switch 8 พอร์ต PoE+ + 2 พอร์ต FX/GbE Multi-rate SFP Uplink — รองรับช่วงไฟกว้าง 24~57VDC ใช้ได้ทั้ง DC Bus โรงงาน 24V และ Adapter 48V ทนอุณหภูมิ -40°C~75°C — *Request by Project*",
            highlights: [
              { title: "Wide Input 24~57VDC", desc: "PoE Budget 124W ที่ 24V / 240W ที่ 48V" },
              { title: "8 PoE+ + 2 Multi-rate SFP", desc: "เชื่อม Fiber 100M หรือ 1G + กล้องจำนวนมาก" },
              { title: "EEE 802.3az", desc: "Energy Efficient Ethernet" },
              { title: "Extreme Temperature -40~75°C", desc: "Outdoor Cabinet / โรงงานหนัก" },
              { title: "Aluminum IP30 + Redundant Power", desc: "Dual Input + Alarm Relay + DIN-Rail" },
            ],
            ports: ["8 x 10/100/1000BASE-T (PoE RJ45)", "2 x 100FX/GbE SFP Slots"],
            ledPanel: "PWR, RPS, ALM, POST, SFP, PoE, 1000M, LNK/ACT",
            power: { input: "Primary 24~57VDC + Redundant 24~57VDC", consumption: "System: 13W", poeBudget: "124W @ 24VDC / 240W @ 48VDC" },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "950 g (2.1 lb)", dimension: "50 x 162 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/791560d5e86f027bde67cf7c2d5f31f9.pdf",
          },
        },
      ],
    },
    {
      id: "poe-unmanaged-premium",
      title: "Unmanaged Premium PoE+",
      blurb: "Premium Unmanaged PoE+ — ทนทานสูง อายุการใช้งานยาวนาน เหมาะกับโครงการขนาดใหญ่",
      products: [
        {
          model: "7160-7GP1GT-24V-I",
          description: "7x PoE+ + 1x GbE RJ45 — Premium Unmanaged Industrial",
          image: poe7160,
          features: ["PoE+", "7-port", "Premium"],
          sourceUrl: detail(1628),
          details: {
            overview:
              "7160-7GP1GT-24V-I เป็น Premium Unmanaged Industrial Switch 7 พอร์ต Gigabit PoE+ + 1 พอร์ต Gigabit RJ45 Uplink — รองรับ IEEE 802.3at/af จ่ายไฟสูงสุด 30W/พอร์ต สำหรับ IP Camera, Wireless AP — มี Industrial QoS prioritize EtherNet/IP, PROFINET, GOOSE และ LLDP Filter ป้องกัน device flapping ทำงานช่วงไฟกว้าง 24~57VDC ในตัวถัง IP40 Metal",
            highlights: [
              { title: "7 PoE+ 30W/พอร์ต Plug & Play", desc: "IEEE 802.3af/at — เชื่อม IP Camera, Wireless AP ได้ทันที ไม่ต้องตั้งค่า" },
              { title: "Wide Input 24~57VDC", desc: "PoE Budget สูงสุด 210W @ 48VDC / 120W @ 24VDC ใช้ได้ทั้ง DC Bus โรงงานและ Adapter" },
              { title: "Industrial Protocol Priority (iQoS)", desc: "Prioritize EtherNet/IP, PROFINET, GOOSE สำหรับงาน Industrial Automation" },
              { title: "VLAN Passthru + Storm Control", desc: "ส่งต่อ VLAN-tagged frames ไม่ตก + ป้องกัน Network Congestion" },
              { title: "LLDP Filter + Green Ethernet (EEE)", desc: "ป้องกัน device flapping + IEEE 802.3az ประหยัดพลังงาน" },
              { title: "IP40 Metal + DIN-Rail", desc: "ทนอุณหภูมิ -10°C ~ 60°C + Redundant Power + Alarm Relay" },
            ],
            ports: ["7 x 10/100/1000BASE-T (PoE+ RJ45)", "1 x 10/100/1000BASE-T RJ45"],
            ledPanel: "PWR, 1000, LNK/ACT, PoE",
            power: { input: "24~57VDC (Wide Input)", consumption: "System: 17W", poeBudget: "210W @ 48VDC / 120W @ 24VDC" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "1,033 g (2.28 lb)", dimension: "50 x 160 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/4de59296735d177c330b9efa0d231d29.pdf",
          },
        },
      ],
    },
    {
      id: "poe-lite-managed",
      title: "Lite Managed PoE+",
      blurb: "Lite Managed PoE+ — VLAN/QoS/SNMP เบื้องต้น ราคาคุ้มค่าสำหรับงาน SME",
      products: [
        {
          model: "SEN-8415PL",
          description: "4x PoE+ + 1x GbE RJ45 + 1x FX/GbE SFP — Lite Managed",
          image: poeSen8415PL,
          features: ["Lite Managed", "Fiber"],
          sourceUrl: detail(1608),
          details: {
            overview:
              "SEN-8415PL เป็น Lite Managed Industrial Switch 4 พอร์ต Gigabit PoE+ + 1 พอร์ต Gigabit RJ45 + 1 พอร์ต FX/GbE Multi-rate SFP Uplink — สำหรับงาน Indoor Surveillance และ Wireless AP — มาพร้อม LAMUNGAN Platform (Wizard, Topology Map, Dashboard) ติดตั้งใน 3 ขั้นตอน 3 นาที — รองรับ Modbus TCP สำหรับเชื่อม HMI/Legacy Devices",
            highlights: [
              { title: "4 PoE+ 30W + Multi-rate SFP", desc: "เชื่อม Fiber 100M หรือ 1G ได้ในพอร์ตเดียว สำหรับ long-distance" },
              { title: "LAMUNGAN Management Platform", desc: "Wizard + Topology Map + Dashboard — ติดตั้งใน 3 ขั้นตอน 3 นาที" },
              { title: "PD Alive Check + PoE Scheduling", desc: "Reboot remote PD อัตโนมัติ + ตั้งเวลาจ่ายไฟประหยัดพลังงาน" },
              { title: "Modbus TCP + STP/RSTP", desc: "เชื่อม HMI / Legacy Devices + Network Redundancy" },
              { title: "QoS / VLAN / 802.1X", desc: "Class of Service, VLAN tagging, Port Authentication" },
              { title: "Metal IP40 + Redundant Power", desc: "Dual Input 48~57VDC + Alarm Relay + DIN-Rail, -10~60°C" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE+ RJ45)", "1 x 10/100/1000BASE-T RJ45", "1 x 100FX/GbE SFP"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC + Mini-DIN 48~57VDC", consumption: "System: 10W", poeBudget: "120W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "290 g (0.64 lb)", dimension: "31 x 136.3 x 105 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/7a82b2f6f078d17df9f0e83bd47c80ec.pdf",
          },
        },
        {
          model: "SEN-8405PL-24V",
          description: "4x PoE+ + 1x GbE RJ45 — Lite Managed, 24V DC",
          image: poeSen8405PL,
          features: ["Lite Managed", "24V DC"],
          sourceUrl: detail(1613),
          details: {
            overview:
              "SEN-8405PL-24V เป็น Lite Managed Industrial Switch 4 พอร์ต Gigabit PoE+ + 1 พอร์ต Gigabit RJ45 — รองรับช่วงไฟกว้าง 24~57VDC ใช้ได้ทั้ง DC Bus โรงงาน 24V และ Adapter 48V — มาพร้อม LAMUNGAN Platform — รองรับ Modbus TCP สำหรับเชื่อม HMI/Legacy Devices",
            highlights: [
              { title: "Wide Input 24~57VDC", desc: "ใช้ได้ทั้ง DC Bus โรงงาน 24V และ Adapter 48V โดยไม่ต้องเดินไฟใหม่" },
              { title: "4 PoE+ 30W/พอร์ต", desc: "PoE Budget 120W — เชื่อม IP Camera / Wireless AP / VoIP" },
              { title: "LAMUNGAN Management Platform", desc: "Wizard + Topology Map + Dashboard — ติดตั้งใน 3 นาที" },
              { title: "PD Alive Check + PoE Scheduling", desc: "Reboot remote PD อัตโนมัติ + ตั้งเวลาจ่ายไฟ" },
              { title: "QoS / VLAN / STP-RSTP / 802.1X", desc: "Network Optimization + Redundancy + Authentication" },
              { title: "Metal IP40 + DIN-Rail", desc: "ทนอุณหภูมิ -10~60°C + Redundant Power Input" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE+ RJ45)", "1 x 10/100/1000BASE-T (RJ45)"],
            ledPanel: "PWR, PoE, 1000, LNK/ACT",
            power: { input: "Terminal Block 24~57VDC + Mini-DIN 24~57VDC", consumption: "System: 14W", poeBudget: "120W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "465 g (1.03 lb)", dimension: "50 x 160 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/3027427f85a0361a10af6eedda83e774.pdf",
          },
        },
        {
          model: "SEN-8425PL-24V",
          description: "4x PoE+ + 1x GbE RJ45 + 2x FX/GbE SFP — Lite Managed",
          image: poeSen8425PL,
          features: ["Lite Managed", "Fiber", "24V DC"],
          sourceUrl: detail(1614),
          details: {
            overview:
              "SEN-8425PL-24V เป็น Lite Managed Industrial Switch 4 พอร์ต Gigabit PoE+ + 1 พอร์ต RJ45 + 2 พอร์ต FX/GbE Multi-rate SFP Uplink — สำหรับงาน Long-distance Connectivity และ Cascading — รองรับช่วงไฟกว้าง 24~57VDC พร้อม LAMUNGAN Platform",
            highlights: [
              { title: "4 PoE+ 30W + 2 Multi-rate SFP", desc: "Uplink Fiber 100M/1G สำหรับเชื่อมศูนย์ควบคุม + Cascading" },
              { title: "Wide Input 24~57VDC", desc: "ใช้ได้ทั้ง DC Bus 24V และ Adapter 48V — PoE Budget 120W" },
              { title: "LAMUNGAN Management Platform", desc: "Wizard + Topology Map + Dashboard — ติดตั้งใน 3 นาที" },
              { title: "PD Alive Check + PoE Scheduling", desc: "Reboot Remote PD + ตั้งเวลาจ่ายไฟอัตโนมัติ" },
              { title: "STP/RSTP + VLAN + 802.1X", desc: "Ring Redundancy + VLAN tagging + Port Authentication" },
              { title: "Metal IP40 + DIN-Rail", desc: "ทนอุณหภูมิ -10~60°C + Redundant Power" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE RJ45)", "1 x 10/100/1000BASE-T RJ45", "2 x 100FX/GbE SFP"],
            ledPanel: "PWR, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Terminal Block 24~57VDC + Mini-DIN 24~57VDC", consumption: "System: 14W", poeBudget: "120W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "500 g (1.10 lb)", dimension: "50 x 160 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/e849309ba36f711024eff1de2ca861d3.pdf",
          },
        },
        {
          model: "SEN-8424PL",
          description: "4x PoE+ + 2x FX/GbE SFP — Lite Managed",
          image: poeSen8424PL,
          features: ["Lite Managed", "Fiber"],
          sourceUrl: detail(1609),
          details: {
            overview:
              "SEN-8424PL เป็น Lite Managed Industrial Switch 4 พอร์ต Gigabit PoE+ + 2 พอร์ต FX/GbE Multi-rate SFP Uplink — สำหรับงาน Indoor Surveillance ที่ต้องเชื่อม Fiber ระยะไกล — มาพร้อม LAMUNGAN Platform, Redundant Power และ Alarm Relay",
            highlights: [
              { title: "4 PoE+ 30W + 2 Multi-rate SFP", desc: "Uplink Fiber 100M หรือ 1G — Long-distance + Cascading" },
              { title: "PoE Budget 120W", desc: "จ่าย 30W ครบทุก PoE Port ได้พร้อมกัน" },
              { title: "LAMUNGAN Management Platform", desc: "Wizard + Topology Map + Dashboard ใน 3 นาที" },
              { title: "PD Alive Check + PoE Scheduling", desc: "Auto-reboot Remote PD + ตั้งเวลาจ่ายไฟ" },
              { title: "STP/RSTP + VLAN + 802.1X", desc: "Ring Redundancy + Port Authentication" },
              { title: "Metal IP40 + Alarm Relay", desc: "Dual Input 48~57VDC + DIN-Rail, -10~60°C" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE RJ45)", "2 x 100FX/GbE SFP"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC + Mini-DIN 48~57VDC", consumption: "System: 10W", poeBudget: "120W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "696 g (1.53 lb)", dimension: "50 x 160 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/8a4cbf868e72e42f9b332fab83e1756b.pdf",
          },
        },
        {
          model: "SEN-8428PL",
          description: "8x PoE+ + 2x FX/GbE SFP — Lite Managed",
          image: poeSen8428PL,
          features: ["Lite Managed", "8-port"],
          sourceUrl: detail(1611),
          details: {
            overview:
              "SEN-8428PL เป็น Lite Managed Industrial Switch 8 พอร์ต Gigabit PoE+ + 2 พอร์ต FX/GbE Multi-rate SFP Uplink — สำหรับงาน Indoor Surveillance ขนาดกลาง-ใหญ่ — PoE Budget สูงถึง 240W จ่าย 30W ครบทุกพอร์ตพร้อมกัน — มาพร้อม LAMUNGAN Platform และ DIP Switch QoS",
            highlights: [
              { title: "8 PoE+ 30W ครบทุกพอร์ต", desc: "PoE Budget 240W — รองรับ IP Camera / AP จำนวนมากในตัวเดียว" },
              { title: "2 Multi-rate SFP Uplink", desc: "Fiber 100M หรือ 1G — Long-distance + Cascading" },
              { title: "DIP Switch QoS on Port #1&2", desc: "Categorize priority traffic ผ่าน DIP Switch ไม่ต้องเข้า Web UI" },
              { title: "LAMUNGAN Platform", desc: "Wizard + Topology Map + Dashboard — ติดตั้ง 3 นาที" },
              { title: "PD Alive Check + PoE Scheduling", desc: "Reboot Remote PD + ตั้งเวลาจ่ายไฟ" },
              { title: "Metal IP40 + Redundant Power", desc: "Dual Input 48~57VDC + Alarm Relay + DIN-Rail" },
            ],
            ports: ["8 x 10/100/1000BASE-T (PoE RJ45)", "2 x 100FX/GbE SFP"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC", consumption: "System: 10W", poeBudget: "240W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "970 g (2.21 lb)", dimension: "50 x 160 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/b66c35b68167ec570159e815bd8f9fbc.pdf",
          },
        },
        {
          model: "SEN-8428PL-24V",
          description: "8x PoE+ + 2x FX/GbE SFP — Lite Managed, 24V DC",
          image: poeSen8428PL24V,
          features: ["Lite Managed", "24V DC"],
          sourceUrl: detail(1612),
          details: {
            overview:
              "SEN-8428PL-24V เป็น Lite Managed Industrial Switch 8 พอร์ต Gigabit PoE+ + 2 พอร์ต FX/GbE Multi-rate SFP Uplink — รองรับช่วงไฟกว้าง 24~57VDC ใช้ได้ทั้ง DC Bus โรงงาน 24V และ Adapter 48V — UL Certified -10~60°C — มาพร้อม LAMUNGAN Platform และ DIP Switch QoS",
            highlights: [
              { title: "Wide Input 24~57VDC", desc: "PoE Budget 240W @ 48V / 120W @ 24V — ใช้ได้ทุก DC Source" },
              { title: "8 PoE+ 30W + 2 Multi-rate SFP", desc: "เชื่อม IP Camera/AP จำนวนมาก + Fiber Uplink" },
              { title: "DIP Switch QoS on Port #1&2", desc: "Priority Traffic + Storm Control ผ่าน DIP Switch" },
              { title: "LAMUNGAN Platform + UL Certified", desc: "Wizard + Topology Map + Dashboard — UL -10~60°C" },
              { title: "PD Alive Check + PoE Scheduling", desc: "Reboot Remote PD + ตั้งเวลาจ่ายไฟอัตโนมัติ" },
              { title: "Metal IP40 + Redundant Power", desc: "Dual Input + Alarm Relay + DIN-Rail" },
            ],
            ports: ["8 x 10/100/1000BASE-T (PoE RJ45)", "2 x 100FX/GbE SFP"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Primary 24~57VDC + Redundant 24~57VDC", consumption: "System: 13W", poeBudget: "240W @ 48V / 120W @ 24V" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F) — UL Certified",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "970 g (2.21 lb)", dimension: "50 x 160 x 120 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/4d38e67aa120cd8a338b22c88cf6b5fc.pdf",
          },
        },
      ],
    },
    {
      id: "poe-managed",
      title: "Managed PoE+",
      blurb: "Full Managed PoE+ — รองรับ Ring Protection, ACL, IGMP, 802.1X เหมาะกับโรงงานและเครือข่ายซับซ้อน",
      products: [
        {
          model: "INS-8624P",
          description: "4x PoE+ + 2x FX/GbE SFP — Managed Industrial",
          image: poeIns8624P,
          features: ["Managed", "Fiber"],
          sourceUrl: detail(1589),
          details: {
            overview:
              "INS-8624P เป็น Managed Industrial Switch 4 พอร์ต Gigabit PoE+ + 2 พอร์ต FX/GbE SFP Uplink — ออกแบบสำหรับงาน Indoor Surveillance และ Internet Access Point — รองรับ Topology Map, PD-Alive Check, PoE Scheduling, QoS และ Flow Control — Aluminum IP40 ทนอุณหภูมิ -40~75°C",
            highlights: [
              { title: "4 PoE+ 30W + 2 FX/GbE SFP", desc: "Gigabit PoE+ 30W ครบทุกพอร์ต + Fiber Uplink ระยะไกล" },
              { title: "Topology Map อัจฉริยะ", desc: "มองเห็นเครือข่ายแบบ Bird-eye View พร้อม Tri-color Status (เขียว/เหลือง/แดง)" },
              { title: "PD Alive Check + PoE Scheduling", desc: "Reboot อุปกรณ์ปลายทางอัตโนมัติ + ตั้งเวลาจ่ายไฟตามวัน/ชั่วโมง" },
              { title: "Cybersecurity Compliance", desc: "ป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต ปกป้องเครือข่ายจากภัยคุกคาม" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual 48~57VDC Input + Relay 1A@24VDC แจ้งเตือนเมื่อไฟตก" },
              { title: "Aluminum IP40 + Wide Temp", desc: "-40°C ~ 75°C — DIN-Rail Mount ทนสภาวะอุตสาหกรรม" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE RJ45)", "2 x GbE SFP Slots"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC (Terminal Block, Mini-DIN)", consumption: "System: 10W", poeBudget: "120W" },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP40 Protection)",
            },
            physical: { weight: "795 g (1.75 lb)", dimension: "57.3 x 175 x 126.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/1f3e4cce599316f73d3051afd9cfba10.pdf",
          },
        },
        {
          model: "IEN-8608PA",
          description: "8x PoE+ + Console RJ45 + USB — L2+ Managed Industrial",
          image: poeIen8608PA,
          features: ["L2+ Managed", "8-port", "Console", "USB"],
          sourceUrl: detail(1639),
          details: {
            overview:
              "IEN-8608PA เป็น L2+ Managed Industrial Switch 8 พอร์ต Gigabit PoE+ — มี Console RJ45 สำหรับ CLI Management และ USB Port สำหรับ Backup Config / Firmware Upgrade — รองรับ Xpress Ring, RSTP/MSTP, QoS, IEEE 1588v2 PTP — Aluminum IP40 ทนอุณหภูมิ -40~75°C",
            highlights: [
              { title: "8 PoE+ 30W + PoE Budget 240W", desc: "จ่าย 30W ครบทุกพอร์ตพร้อมกัน — รองรับ IP Camera/AP กำลังสูง" },
              { title: "Console RJ45 + USB Port", desc: "CLI Troubleshoot + Backup/Restore Config + Firmware Upgrade ผ่าน USB Flash" },
              { title: "Xpress Ring (ms-level Recovery)", desc: "Detect & Recover Link Failure ใน Millisecond — เหมาะกับ Surveillance Mission-critical" },
              { title: "Robust EMI/ESD Protection", desc: "ทน EMI, ESD, Power Surge, Over-voltage, Reverse Polarity" },
              { title: "Topology Map + SNMP/RMON", desc: "Bird-eye View Network + Remote Monitoring แบบ Real-time" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual 48~57VDC + Relay 1A@24VDC แจ้งเตือนไฟดับ" },
            ],
            ports: ["8 x 10/100/1000BASE-T (PoE RJ45)", "1 x RJ45 Console Port", "1 x USB Port"],
            ledPanel: "PWR, RPS, ALM, POST, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC (Terminal Block)", consumption: "System: 15W", poeBudget: "240W" },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP40 Protection)",
            },
            physical: { weight: "955 g (2.1 lb)", dimension: "57.3 x 175 x 126.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/36a6974c080458391700589f7e6cfac3.pdf",
          },
        },
        {
          model: "IEN-8608PA-24V",
          description: "8x PoE+ + Console + USB — L2+ Managed, Wide Input 24~57V",
          image: poeIen8608PA24V,
          features: ["L2+ Managed", "8-port", "24V DC", "USB"],
          sourceUrl: detail(1640),
          details: {
            overview:
              "IEN-8608PA-24V เป็น L2+ Managed Industrial Switch 8 พอร์ต Gigabit PoE+ รุ่น Wide Input 24~57VDC — เหมาะสำหรับ Factory Floor ที่ใช้ DC Bus 24V — Console + USB Port — Xpress Ring, IEEE 1588v2 PTP — Aluminum IP40 ทนอุณหภูมิ -40~75°C",
            highlights: [
              { title: "Wide Input 24~57VDC", desc: "PoE Budget 240W @ 48V / 124W @ 24V — เชื่อมต่อ DC Bus โรงงานได้โดยตรง" },
              { title: "8 PoE+ 30W ครบทุกพอร์ต", desc: "PSE 30W/Port — IP Camera, AP, IoT Devices" },
              { title: "Console RJ45 + USB", desc: "CLI Management + Backup Config + Firmware Upgrade" },
              { title: "Xpress Ring + RSTP/MSTP", desc: "Recover Link Failure ใน Millisecond" },
              { title: "Robust EMI/ESD Protection", desc: "ทน EMI, ESD, Power Surge, Over-voltage" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual Input + Relay Alarm + DIN-Rail" },
            ],
            ports: ["8 x 10/100/1000BASE-T (PoE RJ45)", "1 x RJ45 Console Port", "1 x USB Port"],
            ledPanel: "PWR, RPS, ALM, POST, PoE, 1000, LNK/ACT",
            power: { input: "Primary 24~57VDC + Redundant 24~57VDC (Terminal Block)", consumption: "System: 15W", poeBudget: "240W @ 48V DC / 124W @ 24V DC" },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP40 Protection)",
            },
            physical: { weight: "955 g (2.1 lb)", dimension: "57.3 x 175 x 126.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/f4786884cbc5eb0d103595693b720b6d.pdf",
          },
        },
        {
          model: "IEN-8648PA",
          description: "8x PoE+ + 4x GbE SFP + Console + USB — L2+ Managed",
          image: poeIen8648PA,
          features: ["L2+ Managed", "Fiber", "8-port", "USB"],
          sourceUrl: detail(1590),
          details: {
            overview:
              "IEN-8648PA เป็น L2+ Managed Industrial Switch 8 พอร์ต Gigabit PoE+ Downlink + 4 พอร์ต GbE SFP Uplink (2 สำหรับ Cascading + 2 สำหรับ Uplink ไป Control Center) — มี Console + USB — Xpress Ring + IEEE 1588v2 PTP — Aluminum IP40 -40~75°C",
            highlights: [
              { title: "8 PoE+ 30W + 4 GbE SFP Uplink", desc: "PoE Budget 240W + Fiber Cascading/Uplink ระยะไกล" },
              { title: "Console RJ45 + USB Port", desc: "CLI + Backup Config + Firmware Upgrade" },
              { title: "Xpress Ring (ms Recovery)", desc: "Recover Link Failure ใน Millisecond" },
              { title: "QinQ + VLAN + 802.1X", desc: "Layer-2+ Features ครบเซ็ตสำหรับเครือข่ายซับซ้อน" },
              { title: "PTP IEEE 1588v2", desc: "Time Synchronization สำหรับ Industrial Automation" },
              { title: "Aluminum IP40 + Wide Temp", desc: "-40°C ~ 75°C — Robust EMI/ESD Safeguard" },
            ],
            ports: ["8 x 10/100/1000BASE-T (PoE RJ45)", "4 x GbE SFP Slots", "1 x RJ45 Console Port", "1 x USB Port"],
            ledPanel: "PWR, RPS, ALM, POST, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC (Terminal Block)", consumption: "System: 18W", poeBudget: "240W" },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP40 Protection)",
            },
            physical: { weight: "1,005 g (2.22 lb)", dimension: "57.3 x 175 x 126.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/9512a57e270c60a7f5af7ce230f1c67f.pdf",
          },
        },
        {
          model: "IEN-8648PA-24V",
          description: "8x PoE+ + 4x GbE SFP + Console + USB — L2+ Managed, Wide Input 24~57V",
          image: poeIen8648PA24V,
          features: ["L2+ Managed", "Fiber", "24V DC", "USB"],
          sourceUrl: detail(1642),
          details: {
            overview:
              "IEN-8648PA-24V เป็น L2+ Managed Industrial Switch 8 พอร์ต Gigabit PoE+ + 4 พอร์ต GbE Multi-rate SFP Uplink รุ่น Wide Input 24~57VDC — เหมาะกับ Factory Floor — Console + USB — Xpress Ring/ERPS, PTP, TACACS+/RADIUS Security",
            highlights: [
              { title: "Wide Input 24~57VDC", desc: "PoE Budget 240W @ 48V / 120W @ 24V — DC Bus โรงงานเชื่อมตรงได้" },
              { title: "8 PoE+ 30W + 4 Multi-rate SFP", desc: "Fiber Uplink 100M/1G + Cascading ระยะไกล" },
              { title: "Console + USB Port", desc: "CLI + Backup/Restore Config + Firmware Upgrade ผ่าน USB Flash" },
              { title: "Loop-Free: RSTP/ERPS/Xpress Ring", desc: "Sub-millisecond Recovery — Mission-critical" },
              { title: "TACACS+ / RADIUS Security", desc: "ป้องกัน Cyberattack + Per-Port Connectivity Alarm" },
              { title: "Aluminum IP40 + Wide Temp", desc: "-40°C ~ 75°C — DIN-Rail + Redundant Power" },
            ],
            ports: ["8 x 10/100/1000BASE-T (PoE RJ45)", "4 x GbE SFP Slots", "1 x RJ45 Console Port", "1 x USB Port"],
            ledPanel: "PWR, RPS, ALM, POST, PoE, 1000, SFP, LNK/ACT",
            power: { input: "Primary 24~57VDC + Redundant 24~57VDC (Terminal Block)", consumption: "System: 18W", poeBudget: "240W @ 48VDC / 120W @ 24VDC" },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP40 Protection)",
            },
            physical: { weight: "1,005 g (2.22 lb)", dimension: "57.3 x 175 x 126.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/59d3f2e429138d2bad74cbad6c6f7c17.pdf",
          },
        },
        {
          model: "HNS-8605P",
          description: "4x PoE+ + 1x GbE RJ45 — Managed Hardened",
          image: poeHns8605P,
          features: ["Managed", "Hardened", "Compact"],
          sourceUrl: detail(1629),
          details: {
            overview:
              "HNS-8605P เป็น Managed Hardened Switch ขนาดกะทัดรัด 4 พอร์ต Gigabit PoE+ Uplink + 1 พอร์ต Gigabit RJ45 Downlink — สำหรับงาน Indoor Surveillance / Access Point — รองรับ Modbus TCP, Topology Map, PD-Alive Check, PoE Scheduling — Metal IP40 -10~60°C",
            highlights: [
              { title: "4 PoE+ 30W + 1 GbE RJ45", desc: "PoE Budget 120W — IP Camera/AP กำลังสูง" },
              { title: "Modbus TCP Support", desc: "เชื่อมต่อ Industrial Ethernet ได้โดยตรง" },
              { title: "Topology Map + PD Alive", desc: "Bird-eye View + Reboot อุปกรณ์ปลายทางอัตโนมัติ" },
              { title: "DIN-Rail PWR Adapter + Terminal Block", desc: "AC-to-DC Adapter เป็น Primary + 6-pin Terminal Block สำหรับ Dual Input" },
              { title: "Compact Size + Auto MDI/MDIX", desc: "ขนาด 31 x 136 x 105 mm — ติดตั้งง่าย" },
              { title: "Metal IP40 + Redundant Power", desc: "Dual 48~57VDC + Alarm Relay 1A@24VDC" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE RJ45)", "1 x 10/100/1000BASE-T (RJ45)"],
            ledPanel: "PWR, RPS, ALM, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC", consumption: "10W", poeBudget: "120W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "500 g (1.1 lb)", dimension: "31 x 136.3 x 105 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/20f79d236df03469cca338c3d4aed491.pdf",
          },
        },
        {
          model: "HNS-8615P",
          description: "4x PoE+ + 1x GbE RJ45 + 1x FX/GbE SFP — Managed Hardened",
          image: poeHns8615P,
          features: ["Managed", "Hardened", "Fiber", "Compact"],
          sourceUrl: detail(1630),
          details: {
            overview:
              "HNS-8615P เป็น Managed Hardened Switch กะทัดรัด 4 พอร์ต Gigabit PoE+ + 1 พอร์ต Gigabit RJ45 + 1 พอร์ต FX/GbE SFP Uplink — เพิ่ม Fiber Uplink ระยะไกลจาก HNS-8605P — Modbus TCP + Topology Map — Metal IP40 -10~60°C",
            highlights: [
              { title: "4 PoE+ 30W + 1 GbE RJ45 + 1 FX/GbE SFP", desc: "Copper + Fiber Uplink ครบในตัวเดียว" },
              { title: "PoE Budget 120W", desc: "30W ครบทุกพอร์ต — IP Camera/AP กำลังสูง" },
              { title: "Modbus TCP + IGMP Snooping", desc: "Industrial Ethernet + Multicast Optimization" },
              { title: "Topology Map + PD Alive + PoE Scheduling", desc: "จัดการ PD จาก Control Room ได้สะดวก" },
              { title: "Compact 31 x 136 x 105 mm", desc: "ขนาดเล็ก ติดตั้งง่าย เหมาะตู้แคบ" },
              { title: "Metal IP40 + Redundant Power", desc: "Dual 48~57VDC + Alarm Relay" },
            ],
            ports: ["4 x 10/100/1000BASE-T (PoE RJ45)", "1 x 10/100/1000BASE-T (RJ45)", "1 x FX/GbE SFP Slot"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC (Terminal Block, Mini-DIN)", consumption: "10W", poeBudget: "120W" },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP40 Protection)",
            },
            physical: { weight: "515 g (1.1 lb)", dimension: "31 x 136.3 x 105 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/08e052779ac88ac3ee7a37ad31de4e83.pdf",
          },
        },
        {
          model: "9560-16GP4XS-I",
          description: "16x PoE+ + 4x 1G/10G SFP+ — Managed Industrial",
          image: poe9560,
          features: ["Managed", "16-port", "10G SFP+", "Console", "USB"],
          sourceUrl: detail(1615),
          details: {
            overview:
              "9560-16GP4XS-I เป็น Managed Industrial Switch ระดับ Aggregation 16 พอร์ต Gigabit PoE+ + 4 พอร์ต 1G/10G SFP+ Uplink — รองรับ Multiple 10G Fiber Ring, ACL L2/L3/L4, IGMP Snooping, SNMP — Aluminum IP30 -40~70°C — Console RJ45 + USB + 2 Digital Input",
            highlights: [
              { title: "16 PoE+ 30W + 4 x 1G/10G SFP+", desc: "Aggregation Switch — รองรับ 10G Fiber Uplink ความเร็วสูง" },
              { title: "Multiple 10G Fiber Ring Ports", desc: "Redundant Fiber Ring + Auto Failover — Mission-critical" },
              { title: "ACL L2/L3/L4 (MAC/IP/Port)", desc: "Granular Traffic Control + Security Hardening" },
              { title: "IGMP Snooping + QinQ + 802.1X", desc: "Multicast Optimization + VLAN Stacking + Port Auth" },
              { title: "Console RJ45 + USB + 2 Digital Input", desc: "CLI + Firmware/Config + Dry Contact Sensor Input" },
              { title: "Aluminum IP30 + Wide Temp", desc: "-40°C ~ 70°C — DIN-Rail + Dual 48~57VDC + Relay 24VDC/1A" },
            ],
            ports: ["16 x 10/100/1000 (PoE RJ45)", "4 x 1G/10G SFP+", "1 x RS232 Console Port", "1 x USB Port", "2 x Digital Input (Dry Contact)"],
            ledPanel: "PWR, RPS, ALM, POST, 1000, 10G, LNK/ACT, PoE",
            power: { input: "Primary 48~57VDC + Redundant 48~57VDC", consumption: "System: 22W", poeBudget: "240W" },
            environment: {
              tempOperating: "-40°C ~ 70°C (-40°F ~ 158°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "1,800 g (3.97 lb)", dimension: "100 x 160 x 140 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/b1680cd726f93320210f988cee78ad5f.pdf",
          },
        },
        {
          model: "9005-16GP2GS",
          description: "16x PoE+ + 2x FX/GbE SFP — Managed High-Density (AC/DC)",
          image: poe9005x16,
          features: ["Managed", "16-port", "Rackmount", "Fanless"],
          sourceUrl: detail(1142),
          details: {
            overview:
              "9005-16GP2GS เป็น Managed High-Port Density Switch แบบ Rackmount 19\" 1U — 16 พอร์ต Gigabit PoE+ + 2 พอร์ต FX/GbE Multi-rate SFP Uplink — Fanless Design — เลือก AC (220V/110V) หรือ DC (48V) ตามรุ่นย่อย (A-C / A-H / D-I) — PoE Budget สูงสุด 480W (DC)",
            highlights: [
              { title: "16 PoE+ + 2 Multi-rate SFP", desc: "High-port Density — IP Camera ครอบคลุมทั้งชั้น" },
              { title: "Fanless Rackmount 19\"", desc: "ทำงานเงียบ + ไม่สะสมฝุ่น เหมาะ Surveillance Room" },
              { title: "Flexible Power: AC 220/110V หรือ DC 48V", desc: "PoE Budget 280-480W ตามรุ่นย่อย — DC version จ่ายได้สูงสุด 480W" },
              { title: "Loop-Free: RSTP / ERPS", desc: "Auto Backup Path + Sub-ms Recovery" },
              { title: "Topology Map + PD Alive + Scheduling", desc: "บริหาร PD Remote + Reboot อัตโนมัติ" },
              { title: "Cybersecurity: TACACS+ / RMON", desc: "ป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต + Remote Monitoring" },
            ],
            ports: ["16 x 10/100/1000BASE-T (PoE RJ45)", "2 x FX/GbE SFP", "1 x RJ45 Console Port"],
            ledPanel: "PWR, ALM, PoE, 1000, LNK/ACT",
            power: { input: "AC 100~240V 50/60Hz (A-C/A-H) หรือ DC 48~57V (D-I)", consumption: "System: 20W", poeBudget: "330W (220V AC) / 260W (110V AC) / 480W (48V DC)" },
            environment: {
              tempOperating: "0~50°C (A-C) / -10~60°C (A-H) / -40~70°C (D-I)",
              tempStorage: "-40°C ~ 70°C (-40°F ~ 158°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Rackmount 19\" 1U (IP30, Fanless)",
            },
            physical: { weight: "4,000 g (8.8 lb)", dimension: "440 x 44 x 284 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/911694b0e4fe4c0812da0156bafaee87.pdf",
          },
        },
        {
          model: "9005-24GP2GS",
          description: "24x PoE+ + 2x FX/GbE SFP + Console — Managed High-Density (AC/DC)",
          image: poe9005x24,
          features: ["Managed", "24-port", "Rackmount", "Fanless"],
          sourceUrl: detail(110),
          details: {
            overview:
              "9005-24GP2GS เป็น Managed High-Port Density Switch แบบ Rackmount 19\" 1U — 24 พอร์ต Gigabit PoE+ + 2 พอร์ต FX/GbE Multi-rate SFP Uplink + Console RJ45 — Fanless — เลือก AC (220V/110V) หรือ DC (48V) ตามรุ่นย่อย (A-C / A-H / D-I) — PoE Budget สูงสุด 685W (DC)",
            highlights: [
              { title: "24 PoE+ + 2 Multi-rate SFP", desc: "High-Port Density 24 ports — Surveillance ครอบคลุมหลายชั้น" },
              { title: "Fanless Rackmount 19\"", desc: "เงียบ + ไม่สะสมฝุ่น — Storage Room Friendly" },
              { title: "Flexible Power AC/DC", desc: "PoE Budget 280-685W ตามรุ่นย่อย — DC version จ่ายได้สูงสุด 685W" },
              { title: "Loop-Free RSTP / ERPS + 802.1X", desc: "Sub-ms Recovery + Port Authentication" },
              { title: "Topology Map + DDMI Fiber Monitoring", desc: "ตรวจสอบ Fiber: Temp/Voltage/TX-RX Power แบบ Real-time" },
              { title: "TACACS+ / RMON / QinQ", desc: "Cybersecurity + Remote Monitoring + VLAN Stacking" },
            ],
            ports: ["24 x 10/100/1000BASE-T (PoE RJ45)", "2 x FX/GbE SFP", "1 x RJ45 Console Port"],
            ledPanel: "PWR, ALM, PoE, 1000, LNK/ACT",
            power: { input: "AC 100~240V 50/60Hz (A-C/A-H) หรือ DC 48~57V (D-I)", consumption: "System: 20W", poeBudget: "330W (220V AC) / 260W (110V AC) / 685W (48V DC)" },
            environment: {
              tempOperating: "0~50°C (A-C) / -10~60°C (A-H) / -40~70°C (D-I)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Rackmount 19\" 1U (IP30, Fanless)",
            },
            physical: { weight: "4,000 g (8.8 lb)", dimension: "440 x 44 x 284 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/c6909f42eb3212f9c9b0aa0c7d3bbe7d.pdf",
          },
        },
      ],
    },
    {
      id: "poe-managed-pp",
      title: "Managed PoE++",
      blurb: "PoE++ (90W) สำหรับกล้อง PTZ, AP กำลังสูง, อุปกรณ์โหลดหนัก",
      products: [
        {
          model: "9060-4GP2GS",
          description: "4x PoE++ + 2x GbE SFP + 2x DI + Console — Managed Industrial",
          image: poe9060,
          features: ["PoE++ 90W", "Managed", "DI"],
          sourceUrl: detail(1678),
          details: {
            overview:
              "9060-4GP2GS เป็น L2+ Managed Industrial PoE++ Switch ประสิทธิภาพสูง 4 พอร์ต 10/100/1000 GbE PoE++ (IEEE 802.3bt Type 3/4) downlink + 2 พอร์ต GbE SFP uplink พร้อม Digital Input 2 ช่องสำหรับเชื่อมต่อเซนเซอร์ ออกแบบมาสำหรับงาน IP Surveillance, Smart Lighting และ Smart City ที่ต้องการกำลังไฟสูง 60W/90W ต่อพอร์ต พร้อม Perpetual PoE และ Fast PoE จ่ายไฟต่อเนื่องแม้ระบบรีบูต รองรับ Modbus TCP, Console RJ45 + USB Port สำหรับอัปเกรดเฟิร์มแวร์/บันทึก log ไฟล์ ทนอุณหภูมิ -40°C~75°C เคส Aluminum IP30",
            highlights: [
              { title: "PoE++ 60/90W ต่อพอร์ต (802.3bt)", desc: "4 พอร์ต PoE Type 3/4 รองรับกล้อง PTZ, AP กำลังสูง, Smart Lighting" },
              { title: "Power Budget 240W / 360W", desc: "เลือกได้ 2 รุ่นย่อย: 9060-4GP2GS-240W-I และ 9060-4GP2GS-360W-I" },
              { title: "Perpetual & Fast PoE", desc: "จ่ายไฟต่อเนื่องไม่ขาดตอนแม้สวิตช์รีสตาร์ท เหมาะกับกล้องกลางแจ้งและไฟส่องสว่าง" },
              { title: "Redundant Power + Alarm Relay", desc: "ไฟเข้าซ้ำซ้อน 48~57VDC + Relay 1A @ 24VDC แจ้งเตือนผ่าน Terminal Block" },
              { title: "Console RJ45 + USB", desc: "USB ใช้บันทึก config, log files และอัปเกรดเฟิร์มแวร์ ลดเวลา downtime" },
              { title: "Ring Protection", desc: "RSTP / ERPS / Xpress Ring กู้คืน sub-millisecond" },
              { title: "Cybersecurity", desc: "TACACS+, RADIUS, RMON, 802.1X Port Authentication" },
              { title: "Smart Topology Map", desc: "ค้นหาอุปกรณ์ third-party พร้อมแสดงสถานะ link แบบ tri-color" },
              { title: "Industrial Grade", desc: "-40°C~75°C, IP30 Aluminum, DIN-Rail, UL Listed (-40°C~60°C)" },
            ],
            ports: [
              "4 x 10/100/1000BASE-T (PoE RJ45, IEEE 802.3bt Type 3/4)",
              "2 x GbE SFP Slots (uplink, fiber long-distance)",
              "1 x RJ45 Console Port",
              "1 x USB Port (firmware/config/log)",
              "2 x Digital Input (Dry contacts)",
              "DIP Switch: Primary/Redundant Power Voltage Drop Alarm",
              "LED: PWR, RPS, ALM, POST, SFP, PoE, 1000M, LNK/ACT",
            ],
            power: {
              input: "Primary 48~57VDC + Redundant 48~57VDC (Terminal Block)",
              consumption: "System: 20W",
              poeBudget: "240W (9060-4GP2GS-240W-I) หรือ 360W (9060-4GP2GS-360W-I) — 60/90W ต่อพอร์ต",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection), DIN-Rail Mounting",
            },
            physical: {
              weight: "970 g (2.14 lb)",
              dimension: "50 x 161.5 x 119.9 mm (1.97 x 6.35 x 4.72 in)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/65dcd3520347dc3afb09b807697fb371.pdf",
          },
        },
      ],
    },
    {
      id: "poe-dnv-lr",
      title: "DNV & LR Certified PoE+",
      blurb: "ผ่านการรับรอง DNV / Lloyd's Register สำหรับงานทางทะเลและโรงงานบนเรือ",
      products: [
        {
          model: "SEN-9648PM-24V",
          description: "8x PoE+ + 4x GbE SFP — Managed, DNV Marine Approval",
          image: poeSen9648PM,
          features: ["DNV Marine", "Managed", "Fiber"],
          sourceUrl: detail(1654),
          details: {
            overview:
              "SEN-9648PM-24V เป็น L2 Managed Industrial PoE+ Switch 8 พอร์ต 10/100/1000 PoE+ downlink + 4 พอร์ต GbE SFP uplink ออกแบบเฉพาะสำหรับงาน Marine ที่ผ่านมาตรฐาน DNV Marine Approval และ Lloyd's Register Group Approval รองรับ Wide Input 24~57VDC เหมาะกับเรือที่มีระบบไฟหลากหลาย ทนการสั่นสะเทือน, การกระแทก, free-fall และอุณหภูมิ -40°C~75°C เคส Aluminum IP30 พร้อม Console RJ45 + USB Port สำหรับอัปเกรดเฟิร์มแวร์/บันทึก log files รองรับ EIP, PROFINET และ GOOSE packet prioritization สำหรับงานอุตสาหกรรม",
            highlights: [
              { title: "DNV Marine + LR Approval", desc: "ผ่าน DNV-CS-0339:2016, DNV-RU-SHIP-Pt4Ch9:2018, IEC-60945, IACS E10, LR ENV1/ENV2/ENV3" },
              { title: "PoE+ 30W ต่อพอร์ต (802.3at)", desc: "8 พอร์ต PSE จ่ายไฟอุปกรณ์ Marine surveillance/communication" },
              { title: "Power Budget 124W@24VDC / 240W@48VDC", desc: "ปรับได้ตามแรงดันไฟเข้าบนเรือ" },
              { title: "Wide Input 24~57VDC", desc: "เหมาะกับระบบไฟหลายระดับบนเรือโดยไม่ต้องติดตั้ง outlet เพิ่ม" },
              { title: "Redundant Power + Alarm Relay", desc: "ไฟเข้าซ้ำซ้อน + Relay 1A @ 24VDC แจ้งเตือนผ่าน Terminal Block" },
              { title: "Industrial Protocol Prioritization", desc: "EtherNet/IP, PROFINET, GOOSE packet ผ่าน QoS" },
              { title: "Console RJ45 + USB", desc: "USB ใช้บันทึก config, log files และอัปเกรดเฟิร์มแวร์ ลด downtime" },
              { title: "Smart Topology Map + Cybersecurity", desc: "ค้นหาอุปกรณ์ third-party + รองรับ TACACS+/RADIUS/802.1X" },
              { title: "ทนสภาพแวดล้อม Marine", desc: "Shock IEC 60068-2-27, Vibration IEC 60068-2-6, Free-fall IEC 60068-2-32" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (PoE RJ45, IEEE 802.3at)",
              "4 x GbE SFP Slots (uplink, fiber long-distance)",
              "1 x RJ45 Console Port",
              "1 x USB Port (firmware/config/log)",
              "DIP Switch: Primary/Redundant Power Voltage Drop Alarm",
              "LED: PWR, RPS, ALM, POST, PoE, 1000, LNK/ACT",
            ],
            power: {
              input: "Primary 24~57VDC + Redundant 24~57VDC (Terminal Block)",
              consumption: "System: 18W",
              poeBudget: "124W @ 24VDC หรือ 240W @ 48VDC (PoE+ 30W ต่อพอร์ต)",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F) — DNV Class D: -25°C ~ 70°C",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection), DIN-Rail Mounting",
            },
            physical: {
              weight: "955 g (2.1 lb)",
              dimension: "50 x 161.5 x 119.9 mm (1.97 x 6.35 x 4.72 in)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/b9dd4d9f2eafe4cd206c184ebd0783bb.pdf",
          },
        },
      ],
    },
    {
      id: "poe-nema-ts2",
      title: "NEMA TS2 Certified PoE+",
      blurb: "ผ่าน NEMA TS2 สำหรับงานควบคุมไฟจราจรและระบบขนส่งอัจฉริยะ (ITS)",
      products: [
        {
          model: "SEN-9648P-24V-SS",
          description: "8x PoE+ + 4x GbE SFP — Managed, NEMA TS2 Approval",
          image: poeSen9648PNema,
          features: ["NEMA TS2", "Managed", "Fiber"],
          sourceUrl: detail(1708),
          details: {
            overview:
              "SEN-9648P-24V-SS เป็น L2 Managed Industrial PoE+ Switch 8 พอร์ต 10/100/1000 PoE+ downlink + 4 พอร์ต GbE SFP uplink ออกแบบสำหรับงาน Substation และระบบจราจร ผ่านการรับรอง NEMA TS2 + IEEE 1613 + IEC 61850-3 รองรับ Wide Input 24~57VDC พร้อม Power Boost (DC-to-DC converter) ทนการสั่นสะเทือน, การกระแทก และอุณหภูมิ -40°C~75°C เคส Aluminum IP30 พร้อม Console RJ45 + USB Port สำหรับอัปเกรดเฟิร์มแวร์/บันทึก log files และจัดลำดับ EIP/PROFINET/GOOSE packets สำหรับงานอุตสาหกรรม",
            highlights: [
              { title: "NEMA TS2 + Substation Approval", desc: "ผ่าน NEMA TS2, IEEE 1613, IEC 61850-3 สำหรับสถานีไฟฟ้าและระบบจราจร" },
              { title: "PoE+ 30W ต่อพอร์ต (802.3at)", desc: "8 พอร์ต PSE จ่ายไฟกล้อง/AP ในตู้ควบคุมไฟจราจร" },
              { title: "Power Budget 124W@24VDC / 240W@48VDC", desc: "ปรับได้ตามแรงดันไฟเข้าในตู้ควบคุม" },
              { title: "Wide Input 24~57VDC + Power Boost", desc: "DC-to-DC converter รองรับอุปกรณ์ PoE+ กำลังสูงโดยไม่ต้องเพิ่มแหล่งไฟ" },
              { title: "Redundant Power + Alarm Relay", desc: "ไฟเข้าซ้ำซ้อน + Relay 1A @ 24VDC แจ้งเตือนผ่าน Terminal Block" },
              { title: "Industrial Protocol Prioritization", desc: "EtherNet/IP, PROFINET, GOOSE packet ผ่าน QoS" },
              { title: "Console RJ45 + USB", desc: "USB ใช้บันทึก config, log files และอัปเกรดเฟิร์มแวร์" },
              { title: "Smart Topology Map + Cybersecurity", desc: "ค้นหาอุปกรณ์ third-party + รองรับ TACACS+/RADIUS/802.1X" },
              { title: "Industrial Grade", desc: "-40°C~75°C, IP30 Aluminum, DIN-Rail, UL Listed (-40°C~60°C)" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (PoE RJ45, IEEE 802.3at)",
              "4 x GbE SFP Slots (uplink, fiber long-distance)",
              "1 x RJ45 Console Port",
              "1 x USB Port (firmware/config/log)",
              "DIP Switch: Primary/Redundant Power Voltage Drop Alarm",
              "LED: PWR, RPS, ALM, POST, SFP, PoE, 1000, LNK/ACT",
            ],
            power: {
              input: "Primary 24~57VDC + Redundant 24~57VDC (Terminal Block)",
              consumption: "System: 18W",
              poeBudget: "240W @ 48VDC หรือ 124W @ 24VDC (PoE+ 30W ต่อพอร์ต)",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F) — UL Listed: -40°C ~ 60°C",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection), DIN-Rail Mounting",
            },
            physical: {
              weight: "955 g (2.1 lb)",
              dimension: "50 x 161.5 x 119.9 mm (1.97 x 6.35 x 4.72 in)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/834aacb1fb520e393a4d4daac637de0a.pdf",
          },
        },
        {
          model: "9060-4GP2GS (NEMA)",
          description: "4x PoE++ + 2x GbE SFP + DI + Console — Managed, NEMA TS2",
          image: poe9060Nema,
          features: ["NEMA TS2", "PoE++"],
          sourceUrl: detail(1707),
          details: {
            overview:
              "9060-4GP2GS (NEMA TS2 Variant) เป็น L2+ Managed Industrial PoE++ Switch 4 พอร์ต 10/100/1000 PoE++ (IEEE 802.3bt Type 3/4) downlink + 2 พอร์ต GbE SFP uplink พร้อม Digital Input 2 ช่อง ออกแบบสำหรับงานควบคุมไฟจราจร, ITS และ Smart City ที่ต้องการกำลังไฟสูง 60W/90W ต่อพอร์ต ผ่านการรับรอง NEMA TS2 รองรับ Perpetual PoE และ Fast PoE จ่ายไฟต่อเนื่องแม้ระบบรีบูต รองรับ Modbus TCP, Console RJ45 + USB Port ทนอุณหภูมิ -40°C~75°C เคส Aluminum IP30",
            highlights: [
              { title: "NEMA TS2 Approval", desc: "ผ่านมาตรฐานสำหรับตู้ควบคุมไฟจราจร, ITS, Roadside Cabinet" },
              { title: "PoE++ 60/90W ต่อพอร์ต (802.3bt)", desc: "4 พอร์ต PoE Type 3/4 รองรับกล้อง PTZ, AP, Smart Lighting" },
              { title: "Power Budget 240W / 360W", desc: "เลือกได้ 2 รุ่นย่อย: 9060-4GP2GS-240W-I และ 9060-4GP2GS-360W-I" },
              { title: "Perpetual & Fast PoE", desc: "จ่ายไฟต่อเนื่องไม่ขาดตอนแม้สวิตช์รีสตาร์ท" },
              { title: "2 x Digital Input", desc: "เซนเซอร์เก็บข้อมูลสภาพแวดล้อมสำหรับ Smart City" },
              { title: "Redundant Power + Alarm Relay", desc: "ไฟเข้าซ้ำซ้อน 48~57VDC + Relay 1A @ 24VDC" },
              { title: "Console RJ45 + USB", desc: "USB ใช้บันทึก config, log files และอัปเกรดเฟิร์มแวร์" },
              { title: "Ring Protection + Cybersecurity", desc: "RSTP/ERPS/Xpress Ring + TACACS+/RADIUS/802.1X" },
              { title: "Industrial Grade", desc: "-40°C~75°C, IP30 Aluminum, DIN-Rail, UL Listed" },
            ],
            ports: [
              "4 x 10/100/1000BASE-T (PoE RJ45, IEEE 802.3bt Type 3/4)",
              "2 x GbE SFP Slots (uplink)",
              "1 x RJ45 Console Port",
              "1 x USB Port (firmware/config/log)",
              "2 x Digital Input (Dry contacts)",
              "DIP Switch: Primary/Redundant Power Voltage Drop Alarm",
              "LED: PWR, RPS, ALM, POST, SFP, PoE, 1000M, LNK/ACT",
            ],
            power: {
              input: "Primary 48~57VDC + Redundant 48~57VDC (Terminal Block)",
              consumption: "System: 20W",
              poeBudget: "240W (9060-4GP2GS-240W-I) หรือ 360W (9060-4GP2GS-360W-I) — 60/90W ต่อพอร์ต",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F) — UL Listed: -40°C ~ 60°C",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection), DIN-Rail Mounting",
            },
            physical: {
              weight: "970 g (2.14 lb)",
              dimension: "50 x 161.5 x 119.9 mm (1.97 x 6.35 x 4.72 in)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/05092d3fa3ca87ab73f0a3531dee6373.pdf",
          },
        },
      ],
    },
    {
      id: "poe-railway",
      title: "Railway Certified PoE+",
      blurb: "ผ่านมาตรฐานรถไฟ EN50155 / EN50121-4 สำหรับงานสถานีและขบวนรถไฟ",
      products: [
        {
          model: "SEN-9425P-24V-RW",
          description: "4x PoE+ + 1x GbE RJ45 + 2x GbE SFP — Unmanaged, Railway",
          image: poeSen9425PRW,
          features: ["Railway", "EN50155", "Fiber"],
          sourceUrl: detail(1650),
          details: {
            overview:
              "SEN-9425P-24V-RW เป็น Unmanaged Industrial PoE+ Switch 4 พอร์ต 10/100/1000 PoE+ downlink + 1 พอร์ต Gigabit RJ45 + 2 พอร์ต GbE SFP uplink ออกแบบเฉพาะสำหรับงาน Railway Surveillance/WAP ผ่านการรับรอง EN 50155, EN 50121-4, EN 61373 รองรับ Wide Input 24~57VDC พร้อม Power Boost (DC-to-DC converter) มี 4-pin mini-DIN ยึดแน่นป้องกันหลุดจากการสั่นสะเทือน เคส Aluminum IP30 ทนอุณหภูมิ -40°C~75°C รองรับ QoS จัดลำดับ EIP/PROFINET/GOOSE packets",
            highlights: [
              { title: "Railway Approval", desc: "ผ่าน EN 50155 (Rolling Stock), EN 50121-4 (EMC), EN 61373 (Vibration/Shock)" },
              { title: "PoE+ 30W ต่อพอร์ต (802.3at)", desc: "4 พอร์ต PSE จ่ายไฟกล้อง/AP ในขบวนรถไฟและสถานี" },
              { title: "Power Budget 120W", desc: "รองรับ PoE Plug & Play สำหรับอุปกรณ์โหลดสูง" },
              { title: "Wide Input 24~57VDC + Power Boost", desc: "DC-to-DC converter รองรับแหล่งจ่ายไฟหลายระดับบนรถไฟ" },
              { title: "4-pin mini-DIN Power Connector", desc: "ยึดแน่นป้องกันหลุดจากการสั่นสะเทือนระหว่างขบวนวิ่ง" },
              { title: "Industrial QoS", desc: "EtherNet/IP, PROFINET, GOOSE packet prioritization + Port #1 Priority" },
              { title: "Power Input Polarity Protection", desc: "ป้องกันการเสียหายจากต่อขั้วผิด" },
              { title: "Industrial Grade", desc: "-40°C~75°C, IP30 Aluminum, DIN-Rail / Wall / Rack-mount" },
            ],
            ports: [
              "4 x 10/100/1000BASE-T (PoE RJ45, IEEE 802.3at)",
              "1 x 10/100/1000BASE-T (RJ45, downlink)",
              "2 x GbE SFP Slots (uplink, fiber long-distance)",
              "LED: PWR, SFP, PoE, 1000, LNK/ACT",
            ],
            power: {
              input: "24~57VDC (Terminal Block + 4-pin mini-DIN)",
              consumption: "System: 14W",
              poeBudget: "120W (PoE+ 30W ต่อพอร์ต)",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection), DIN-Rail / Wall / Rack-mount",
            },
            physical: {
              weight: "869 g (1.92 lb)",
              dimension: "50 x 161.5 x 119.9 mm (1.97 x 6.35 x 4.72 in)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/7d3033ac84e62898651752bc4ec8108f.pdf",
          },
        },
        {
          model: "SEN-9428P-24V-RW",
          description: "8x PoE+ + 2x FX/GbE SFP — Unmanaged, Railway",
          image: poeSen9428PRW,
          features: ["Railway", "8-port"],
          sourceUrl: detail(1652),
          details: {
            overview:
              "SEN-9428P-24V-RW เป็น Unmanaged Industrial PoE+ Switch 8 พอร์ต 10/100/1000 PoE+ downlink + 2 พอร์ต FX/GbE SFP uplink ออกแบบสำหรับงาน Railway Surveillance/WAP ผ่านการรับรอง EN 50155, EN 50121-4, EN 61373 รองรับ Wide Input 24~57VDC แบบ Redundant พร้อม Alarm Relay บน Terminal Block 6-pin มี DIP Switch ปรับ QoS, Storm Control, Fiber Speed (100FX/1G) ทนการสั่นสะเทือน, EMI, Surge และ Reverse Polarity เคส Aluminum IP30 ทนอุณหภูมิ -40°C~75°C",
            highlights: [
              { title: "Railway Approval", desc: "ผ่าน EN 50155, EN 50121-4 (EMC), EN 61373 (Vibration/Shock)" },
              { title: "PoE+ 30W ต่อพอร์ต (802.3at)", desc: "8 พอร์ต PSE Plug & Play สำหรับกล้องและ AP บนรถไฟ" },
              { title: "Power Budget 124W@24VDC / 240W@48VDC", desc: "ปรับได้ตามแรงดันไฟเข้าในขบวนรถ" },
              { title: "Redundant Power + Alarm Relay", desc: "ไฟเข้าซ้ำซ้อน 24~57VDC + Relay 1A @ 24VDC ผ่าน 6-pin Terminal Block" },
              { title: "DIP Switch", desc: "ปรับ Power Alarm (PWR/RPS), Storm Control, Port QoS (P1/P2), Fiber 100FX (P9/P10)" },
              { title: "FX/GbE Dual SFP", desc: "ขยาย daisy chain แบบ fiber-based" },
              { title: "Industrial QoS", desc: "EtherNet/IP, PROFINET, GOOSE packet prioritization" },
              { title: "Robust EMC Protection", desc: "EMI, ESD, Surge, Over-voltage, Over-current, Reverse Polarity" },
              { title: "Industrial Grade", desc: "-40°C~75°C, IP30 Aluminum, DIN-Rail / Wall / Rack-mount" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (PoE RJ45, IEEE 802.3at)",
              "2 x FX/GbE SFP Slots (100FX หรือ 1G เลือกผ่าน DIP)",
              "DIP Switch: PWR/RPS Alarm, Storm Control, Port QoS, Fiber Speed",
              "LED: PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            ],
            power: {
              input: "Primary 24~57VDC + Redundant 24~57VDC (6-pin Terminal Block)",
              consumption: "System: 10W",
              poeBudget: "124W @ 24VDC หรือ 240W @ 48VDC (PoE+ 30W ต่อพอร์ต)",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection), DIN-Rail / Wall / Rack-mount",
            },
            physical: {
              weight: "930 g (2.1 lb)",
              dimension: "50 x 161.5 x 119.9 mm (1.97 x 6.35 x 4.72 in)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/6a479e167e218e47bcff4bb98f9ce934.pdf",
          },
        },
        {
          model: "SEN-9648P-24V-RW",
          description: "8x PoE+ + 4x GbE SFP — Managed, Railway",
          image: poeSen9648PRW,
          features: ["Railway", "Managed", "Fiber"],
          sourceUrl: detail(1645),
          details: {
            overview:
              "SEN-9648P-24V-RW เป็น L2 Managed Industrial PoE+ Switch 8 พอร์ต 10/100/1000 PoE+ downlink + 4 พอร์ต GbE SFP uplink ออกแบบเฉพาะสำหรับงาน Railway Surveillance/WAP ผ่านการรับรอง EN 50155, EN 50121-4, EN 61373 รองรับ Wide Input 24~57VDC แบบ Redundant พร้อม Console RJ45 + USB Port สำหรับอัปเกรดเฟิร์มแวร์/บันทึก log files รองรับ SNMP/RMON, Xpress Ring กู้คืน sub-millisecond, จัดลำดับ EIP/PROFINET/GOOSE packets, Smart Topology Map และ Cybersecurity (TACACS+/RADIUS/802.1X) ทนอุณหภูมิ -40°C~75°C เหมาะกับงานในอุโมงค์",
            highlights: [
              { title: "Railway Approval", desc: "ผ่าน EN 50155, EN 50121-4 (EMC), EN 61373 (Vibration/Shock)" },
              { title: "PoE+ 30W ต่อพอร์ต (802.3at)", desc: "8 พอร์ต PSE Plug & Play พร้อม PoE Scheduling รายชั่วโมง/รายสัปดาห์" },
              { title: "Power Budget 124W@24VDC / 240W@48VDC", desc: "ปรับได้ตามแรงดันไฟเข้าในขบวน" },
              { title: "Wide Input 24~57VDC Redundant", desc: "รองรับ SDR-240P-48 + SDR-240-24 พร้อมกัน" },
              { title: "Xpress Ring + RSTP/MSTP", desc: "Ring Protection กู้คืน sub-millisecond" },
              { title: "Console RJ45 + USB", desc: "USB ใช้บันทึก config, log files และอัปเกรดเฟิร์มแวร์" },
              { title: "Industrial Protocol Prioritization", desc: "EtherNet/IP, PROFINET, GOOSE packet ผ่าน QoS" },
              { title: "Smart Topology Map + Cybersecurity", desc: "ค้นหาอุปกรณ์ third-party + รองรับ TACACS+/RADIUS/802.1X/SNMP/RMON" },
              { title: "เหมาะกับงานในอุโมงค์", desc: "-40°C~75°C, IP30 Aluminum, ทนสั่น/กระแทก/free-fall" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (PoE RJ45, IEEE 802.3at)",
              "4 x GbE SFP Slots (uplink, fiber long-distance)",
              "1 x RJ45 Console Port",
              "1 x USB Port (firmware/config/log)",
              "DIP Switch: Primary/Redundant Power Voltage Drop Alarm",
              "LED: PWR, RPS, ALM, POST, SFP, PoE, 1000, LNK/ACT",
            ],
            power: {
              input: "Primary 24~57VDC + Redundant 24~57VDC (Terminal Block)",
              consumption: "System: 18W",
              poeBudget: "240W @ 48VDC หรือ 124W @ 24VDC (PoE+ 30W ต่อพอร์ต)",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection), DIN-Rail Mounting",
            },
            physical: {
              weight: "955 g (2.1 lb)",
              dimension: "50 x 161.5 x 119.9 mm (1.97 x 6.35 x 4.72 in)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/19a50c1dd79232be16ca3cb6ad9a9a7f.pdf",
          },
        },
      ],
    },
    {
      id: "poe-substation",
      title: "Substation Certified PoE+",
      blurb: "ผ่าน IEC 61850-3 / IEEE 1613 สำหรับสถานีไฟฟ้าและสภาพแวดล้อม EMI สูง",
      products: [
        {
          model: "SEN-9425P-24V-SS",
          description: "4x PoE+ + 1x GbE RJ45 + 2x GbE SFP — Unmanaged, Substation",
          image: poeSen9425PSS,
          features: ["Substation", "IEC 61850"],
          sourceUrl: detail(1651),
          details: {
            overview:
              "SEN-9425P-24V-SS เป็น Unmanaged Industrial PoE+ Switch 4 พอร์ต 10/100/1000 PoE+ downlink + 1 พอร์ต 10/100/1000 RJ45 + 2 พอร์ต GbE SFP uplink ออกแบบสำหรับงาน Substation โดยเฉพาะ ผ่านการรับรอง IEEE 1613 และ IEC 61850-3 รองรับ Wide Input 24~57VDC พร้อม Innovative Power Boost (DC-to-DC converter) สำหรับอุปกรณ์ PoE+ กำลังสูง มี Redundant Power 2 ทาง (Terminal Block + 4-pin mini-DIN ที่ยึดแน่นป้องกันหลุดจากแรงสั่น) จัดลำดับ EIP/PROFINET/GOOSE packets ทนการสั่นสะเทือน, การกระแทก, free fall และอุณหภูมิ -40°C~75°C เคส Aluminum IP30 ติดตั้งแบบ DIN-Rail",
            highlights: [
              { title: "Substation Approval", desc: "ผ่าน IEEE 1613 + IEC 61850-3 สำหรับสถานีไฟฟ้าและสภาพ EMI สูง" },
              { title: "4-Port PoE+ 30W/Port", desc: "IEEE 802.3af/at จ่ายไฟ PD แบบ Plug-and-Play รวม Power Budget 120W" },
              { title: "Wide Input 24~57VDC + Power Boost", desc: "DC-to-DC converter รองรับแหล่งจ่ายไฟหลากหลายในสถานีไฟฟ้า" },
              { title: "Redundant Power System", desc: "รองรับ 2 แหล่งจ่ายพร้อมกัน (Terminal Block + 4-pin mini-DIN) พร้อม Power Failure Alarm" },
              { title: "Industrial Protocol Priority", desc: "จัดลำดับ EIP (EtherNet/IP), PROFINET, GOOSE packets ด้วย QoS + Rate Limit" },
              { title: "GbE SFP Uplink x2", desc: "ส่งสัญญาณระยะไกลปลอดสัญญาณรบกวนไปยัง Control Center" },
              { title: "Wide Operating Temp -40°C~75°C", desc: "UL Certified -40°C~70°C ทนทุกสภาพอุตสาหกรรมหนัก" },
              { title: "Aluminum IP30 Housing", desc: "เคสอลูมิเนียมระบายความร้อนสูง ป้องกันเครื่องมือและอันตราย" },
              { title: "DIN-Rail Mount", desc: "ติดตั้งง่ายในตู้ควบคุม + รองรับ DIN-Rail Power Adapter (AC to DC)" },
            ],
            ports: [
              "4 x 10/100/1000BASE-T (PoE RJ45)",
              "1 x 10/100/1000BASE-T (RJ45)",
              "2 x GbE SFP Slots",
            ],
            power: {
              input: "24~57VDC (Terminal Block + 4-pin mini-DIN)",
              consumption: "System: 14W",
              poeBudget: "120W (30W/port)",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (UL: -40°C ~ 70°C)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30)",
            },
            physical: { weight: "869 g (1.9 lb)", dimension: "50 x 161.5 x 119.9 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/2a29a5f2c301509edf00d32d375dbfcb.pdf",
          },
        },
        {
          model: "SEN-9428P-24V-SS",
          description: "8x PoE+ + 2x GbE SFP — Unmanaged, Substation",
          image: poeSen9428PSS,
          features: ["Substation", "8-port"],
          sourceUrl: detail(1653),
          details: {
            overview:
              "SEN-9428P-24V-SS เป็น Unmanaged Industrial PoE+ Switch 8 พอร์ต 10/100/1000 PoE+ downlink + 2 พอร์ต FX/GbE SFP uplink ออกแบบให้ตรงตามข้อกำหนดด้านอุณหภูมิและสภาพแวดล้อมของงาน Surveillance และ WAP ในสถานีไฟฟ้า ผ่านการรับรอง IEEE 1613 + IEC 61850-3 รองรับ Wide Input 24~57VDC พร้อม Power Boost (DC-to-DC converter) มี DIP Switch สำหรับปรับ QoS, Broadcast Storm Control, Fiber Speed (100FX) และ Power Voltage Drop Alarm มี Redundant Power + Alarm Relay (1A @ 24VDC) PoE Budget สูงสุด 240W @ 48VDC จัดลำดับ EIP/PROFINET/GOOSE packets ทน -40°C~75°C เคส Aluminum IP30",
            highlights: [
              { title: "Substation Approval", desc: "ผ่าน IEEE 1613 + IEC 61850-3 สำหรับสถานีไฟฟ้าและงาน EMI สูง" },
              { title: "8-Port PoE+ 30W/Port", desc: "IEEE 802.3af/at จ่ายไฟ PD พร้อมกัน 8 อุปกรณ์ (Surveillance/WAP)" },
              { title: "Power Budget 240W@48V / 124W@24V", desc: "ปรับได้ตามแรงดันไฟเข้าในสถานีไฟฟ้า" },
              { title: "Wide Input 24~57VDC + Power Boost", desc: "DC-to-DC converter รองรับ PoE+ กำลังสูง" },
              { title: "Redundant Power + Alarm Relay", desc: "Primary + Redundant 24~57VDC พร้อม Relay Output 1A @ 24VDC แจ้งเตือนไฟดับ" },
              { title: "DIP Switch Configuration", desc: "ตั้งค่า QoS (P1/P2), Storm Control, Fiber Speed 100FX (P9/P10), Power Voltage Alarm" },
              { title: "Industrial Protocol Priority", desc: "จัดลำดับ EIP (EtherNet/IP), PROFINET, GOOSE packets" },
              { title: "Wide Operating Temp -40°C~75°C", desc: "ทนการสั่นสะเทือน, การกระแทก, free fall ในงานหนัก" },
              { title: "Flexible Mounting", desc: "DIN-Rail, Wall Mount หรือ Rack-mount เคส Aluminum IP30" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (PoE RJ45)",
              "2 x FX/GbE SFP Slots",
            ],
            power: {
              input: "Primary 24~57VDC + Redundant 24~57VDC (Terminal Block)",
              consumption: "System: 15W",
              poeBudget: "240W @ 48VDC หรือ 124W @ 24VDC",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30)",
            },
            physical: { weight: "930 g (2.1 lb)", dimension: "50 x 161.5 x 119.9 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/900d54f2cddcf135bf63b904c0de77af.pdf",
          },
        },
        {
          model: "SEN-9648P-24V-SS",
          description: "8x PoE+ + 4x GbE SFP — Managed, Substation",
          image: poeSen9648PSS,
          features: ["Substation", "Managed"],
          sourceUrl: detail(1655),
          details: {
            overview:
              "SEN-9648P-24V-SS เป็น L2 Managed Industrial PoE+ Switch 8 พอร์ต 10/100/1000 PoE+ downlink + 4 พอร์ต GbE SFP uplink ออกแบบสำหรับงาน Substation และระบบจราจร ผ่านการรับรอง NEMA TS2 + IEEE 1613 + IEC 61850-3 รองรับ Wide Input 24~57VDC พร้อม Power Boost (DC-to-DC converter) ทนการสั่นสะเทือน, การกระแทก และอุณหภูมิ -40°C~75°C เคส Aluminum IP30 พร้อม Console RJ45 + USB Port สำหรับอัปเกรดเฟิร์มแวร์/บันทึก log files และจัดลำดับ EIP/PROFINET/GOOSE packets สำหรับงานอุตสาหกรรม",
            highlights: [
              { title: "Substation + NEMA TS2 Approval", desc: "ผ่าน IEEE 1613 + IEC 61850-3 + NEMA TS2 สำหรับสถานีไฟฟ้าและระบบจราจร" },
              { title: "Wide Input 24~57VDC + Power Boost", desc: "DC-to-DC converter รองรับอุปกรณ์ PoE+ กำลังสูง" },
              { title: "L2 Managed Features", desc: "VLAN, QoS, IGMP Snooping, Link Aggregation, Port Security" },
              { title: "Power Budget 240W@48V / 124W@24V", desc: "ปรับได้ตามแรงดันไฟเข้าในสถานีไฟฟ้า" },
              { title: "Console + USB Port", desc: "RJ45 Console สำหรับ CLI + USB Port สำหรับอัปเกรดเฟิร์มแวร์/บันทึก log files" },
              { title: "GbE SFP Uplink x4", desc: "ส่งสัญญาณระยะไกล Ring/Cascading ไปยัง Control Center" },
              { title: "Industrial Protocol Priority", desc: "จัดลำดับ EIP/PROFINET/GOOSE packets สำหรับงานอุตสาหกรรม" },
              { title: "Wide Operating Temp -40°C~75°C", desc: "ทนการสั่นสะเทือน, การกระแทก, free fall" },
              { title: "Aluminum IP30 Housing", desc: "เคสอลูมิเนียมระบายความร้อนสูง รองรับ DIN-Rail" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (PoE RJ45)",
              "4 x GbE SFP Slots",
              "1 x RJ45 Console",
              "1 x USB Port",
            ],
            power: {
              input: "Primary 24~57VDC + Redundant 24~57VDC",
              consumption: "System: 19W",
              poeBudget: "240W @ 48VDC หรือ 124W @ 24VDC",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30)",
            },
            physical: { weight: "1.5 kg (3.3 lb)", dimension: "74 x 161.5 x 124.5 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/productdetail_en.php?id=1655",
          },
        },
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
// (removed) INS-8005M / INS-8405M / INS-8408AM — ไม่มีอยู่จริงในหน้า Lite Managed ของ Volktek
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
        {
          model: "INS-840G",
          description: "16x 10/100/1000BASE-T (RJ45) — Unmanaged Industrial Gigabit Switch",
          image: ie_INS_840G,
          features: ["Unmanaged", "16-port", "Gigabit", "Redundant Power"],
          sourceUrl: detail(1582),
          details: {
            overview:
              "INS-840G เป็น Unmanaged Industrial Switch 16 พอร์ต 10/100/1000 RJ45 สำหรับงาน Automation ที่เชื่อมต่อ Multi-axis Robot, PLC, HMI และ Legacy Device — Auto-negotiation ทุกพอร์ต ใช้ง่าย Plug & Play พร้อม Redundant Power System (Primary + Redundant 12~60VDC) มี Power Failure Alarm Relay, IEEE 802.3az Green Ethernet ลด consumption, IP40 Aluminum Housing ทน -40°C~75°C ติดตั้ง DIN-Rail",
            highlights: [
              { title: "16-Port Gigabit Density", desc: "16 พอร์ต 10/100/1000 RJ45 รองรับ Robot/PLC/HMI หลายตัวในเครือข่ายเดียว" },
              { title: "Redundant Power 12~60VDC", desc: "รับไฟ Primary + Redundant พร้อม Power Failure Alarm" },
              { title: "Robust EMC/ESD Protection", desc: "ทนทาน EMI, ESD, Power Surge, Over Voltage/Current, Reverse Polarity" },
              { title: "IEEE 802.3az Green Ethernet", desc: "ปรับ Power Consumption อัตโนมัติ ประหยัดพลังงาน" },
              { title: "Advanced QoS Support", desc: "จัดลำดับความสำคัญ Mission-critical Data Packet" },
              { title: "VLAN Passthru", desc: "ส่งต่อ VLAN packet ไม่ดัดแปลง ป้องกันข้อมูลสูญหาย" },
              { title: "Auto-Negotiation ทุกพอร์ต", desc: "เชื่อมต่อ PLC ที่ความเร็วต่างกันได้อัตโนมัติ" },
              { title: "IP40 Aluminum Housing", desc: "ทน -40°C~75°C, Vibration, Shock, Free Fall" },
              { title: "Alarm Relay 1A @ 24VDC", desc: "แจ้งเตือนสถานะระบบไปยังศูนย์ควบคุม" },
            ],
            ports: ["16 x 10/100/1000BASE-T (RJ45)"],
            ledPanel: "PWR, RPS, ALM, 1000, LNK/ACT",
            power: { input: "Primary 12~60VDC + Redundant 12~60VDC", consumption: "18W (12V/1A)" },
            environment: { tempOperating: "-40°C ~ 75°C", tempStorage: "-40°C ~ 85°C", humidity: "5~95% RH (non-condensing)", housing: "Aluminum (IP40)" },
            physical: { weight: "918 g", dimension: "57.3 x 175 x 126.4 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/de37e834c459c5a59f5a9772a392d253.pdf",
          },
        },
        {
          model: "INS-8005A",
          description: "5x 10/100BASE-TX (RJ45) — Unmanaged Industrial Switch",
          image: ie_INS_8005A,
          features: ["Unmanaged", "5-port", "Fast Ethernet", "UL Certified"],
          sourceUrl: detail(1596),
          details: {
            overview:
              "INS-8005A เป็น Unmanaged Industrial Switch 5 พอร์ต 10/100 RJ45 สำหรับงาน Field-level interconnect ขนาดเล็ก — Auto-negotiation, Auto MDI/MDI-X, Plug & Play, มี VLAN Passthru ส่งต่อ VLAN packet ไม่ดัดแปลง — IP40 Aluminum Housing ทน -40°C~75°C, Fanless, ติดตั้ง DIN-Rail หรือ Wall Mount, ผ่าน UL Certification",
            highlights: [
              { title: "5x 10/100 RJ45 Compact", desc: "ขนาดเล็ก เหมาะกับ Field Cabinet พื้นที่จำกัด" },
              { title: "Robust EMC/ESD Safeguard", desc: "ทนทาน EMI, ESD, Power Surge, Over Voltage/Current, Reverse Polarity" },
              { title: "Auto MDI/MDI-X", desc: "เชื่อมต่อ Switch หรือ Hub ได้โดยไม่ต้องสลับสาย" },
              { title: "VLAN Passthru", desc: "ส่งต่อ VLAN packet ไม่ดัดแปลง" },
              { title: "UL Certified", desc: "ผ่านมาตรฐาน UL สำหรับใช้งานในอุตสาหกรรม" },
              { title: "Fanless Design", desc: "ไม่มีพัดลม ลด Failure Point เพิ่มอายุการใช้งาน" },
              { title: "IP40 Aluminum Housing", desc: "ทน -40°C~75°C, Vibration, Shock" },
              { title: "Power Polarity Protection", desc: "ป้องกันต่อขั้วไฟผิด, Current Overload Protection" },
              { title: "DIN-Rail / Wall Mount", desc: "ยืดหยุ่นในการติดตั้งหลายรูปแบบ" },
            ],
            ports: ["5 x 10/100BASE-TX (RJ45)"],
            ledPanel: "PWR, 1000, LNK/ACT",
            power: { input: "12~48VDC, 0.2A max", consumption: "3W" },
            environment: { tempOperating: "-40°C ~ 75°C", tempStorage: "-40°C ~ 85°C", humidity: "5~95% RH (non-condensing)", housing: "Aluminum (IP40)" },
            physical: { weight: "180 g", dimension: "23.6 x 109.2 x 73.8 mm (DIN-Rail, Wall Mount)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/34e590d3d0354ab1983e42845aad615b.pdf",
          },
        },
        {
          model: "INS-8405A",
          description: "5x 10/100/1000BASE-T (RJ45) — Unmanaged Industrial Gigabit Switch",
          image: ie_INS_8405A,
          features: ["Unmanaged", "5-port", "Gigabit", "Fanless"],
          sourceUrl: detail(1597),
          details: {
            overview:
              "INS-8405A เป็น Unmanaged Industrial Gigabit Switch 5 พอร์ต 10/100/1000 RJ45 สำหรับงาน Automation — Auto-negotiation, มี Storm Control + Flow Control เพื่อจำกัด Traffic ที่มากเกิน, รองรับ IEEE 802.1p Class of Service, VLAN-aware ส่งต่อ VLAN tagged packet ไม่ดัดแปลง — IP40 Aluminum Housing ทน -40°C~75°C, Fanless, Plug & Play, ติดตั้ง DIN-Rail หรือ Wall Mount",
            highlights: [
              { title: "5-port Gigabit RJ45", desc: "ความเร็วเต็มทั้ง 5 พอร์ต รองรับ HMI/PLC ที่ต้องการ Bandwidth สูง" },
              { title: "Storm & Flow Control", desc: "จำกัด Broadcast Storm + ป้องกัน Buffer Overflow ระหว่างอุปกรณ์" },
              { title: "IEEE 802.1p CoS", desc: "จัดลำดับ Traffic Priority ตาม Class of Service" },
              { title: "Intelligent VLAN Forwarding", desc: "อ่าน Source/Destination ของ VLAN tagged packet ส่งต่อโดยไม่ดัดแปลง" },
              { title: "Fanless + Plug & Play", desc: "ไม่มีพัดลม เสียบใช้ทันที ไม่ต้องตั้งค่า" },
              { title: "Robust EMC/ESD", desc: "ทนทาน EMI, ESD, Surge, Over Voltage/Current, Reverse Polarity" },
              { title: "IP40 Aluminum Housing", desc: "ทน -40°C~75°C เหมาะ Outdoor Cabinet" },
              { title: "Auto MDI/MDI-X", desc: "เชื่อมต่อสาย Straight หรือ Crossover ได้อัตโนมัติ" },
              { title: "DIN-Rail / Wall Mount", desc: "ติดตั้งสองแบบเลือกตามพื้นที่" },
            ],
            ports: ["5 x 10/100/1000BASE-T (RJ45)"],
            ledPanel: "PWR, 1000, LNK/ACT",
            power: { input: "12~48VDC", consumption: "3W" },
            environment: { tempOperating: "-40°C ~ 75°C", tempStorage: "-40°C ~ 85°C", humidity: "5~95% RH (non-condensing)", housing: "Aluminum (IP40)" },
            physical: { weight: "183.4 g", dimension: "23.6 x 109.2 x 73.8 mm (DIN-Rail, Wall Mount)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/2a4c3a4f878689ed3aae892d1022654a.pdf",
          },
        },
        {
          model: "INS-8008A",
          description: "8x 10/100BASE-TX (RJ45) — Unmanaged Industrial Switch",
          image: ie_INS_8008A,
          features: ["Unmanaged", "8-port", "Fast Ethernet", "UL Certified"],
          sourceUrl: detail(1605),
          details: {
            overview:
              "INS-8008A เป็น Unmanaged Industrial Switch 8 พอร์ต 10/100 RJ45 สำหรับงาน Field-level interconnect — Auto-negotiation, Auto MDI/MDI-X, มี Broadcast Storm Control เพื่อ Monitor และจำกัด Traffic Storm — IP40 Metal Housing ทน -40°C~75°C, ติดตั้ง DIN-Rail, ผ่าน UL Certification",
            highlights: [
              { title: "8x 10/100 RJ45", desc: "เพิ่ม density จาก 5 พอร์ตเป็น 8 พอร์ต รองรับ Field Device หลายตัว" },
              { title: "Broadcast Storm Control", desc: "Monitor Broadcast packet rate และจำกัดเพื่อปกป้อง Performance" },
              { title: "ESD/Surge/Over-Voltage Protection", desc: "ปกป้องจาก Electrostatic Discharge และ Surge" },
              { title: "Auto MDI/MDI-X", desc: "เชื่อมต่อ Switch หรือ Hub ได้โดยไม่สนใจประเภทสาย" },
              { title: "Reverse Polarity Protection", desc: "ป้องกันต่อขั้วไฟผิด" },
              { title: "Compact Metal Housing", desc: "ขนาดกะทัดรัด 50 x 116 x 100 mm" },
              { title: "UL Certified", desc: "ผ่านมาตรฐาน UL อุตสาหกรรม" },
              { title: "IP40 Protection", desc: "ทน -40°C~75°C, Vibration, Shock, Free Fall" },
              { title: "DIN-Rail Mounting", desc: "ติดตั้งบน TH35 DIN Rail มาตรฐาน" },
            ],
            ports: ["8 x 10/100BASE-TX (RJ45)"],
            ledPanel: "PWR, 100, LNK/ACT",
            power: { input: "12~48VDC, 0.2A max", consumption: "3W" },
            environment: { tempOperating: "-40°C ~ 75°C", tempStorage: "-40°C ~ 85°C", humidity: "5~95% RH (non-condensing)", housing: "Metal (IP40)" },
            physical: { weight: "435 g", dimension: "50 x 116 x 100 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/b7e659e62b02a3f5953782457bdb4da6.pdf",
          },
        },
        {
          model: "INS-8408A",
          description: "8x 10/100/1000BASE-T (RJ45) — Unmanaged Industrial Gigabit with Redundant Power",
          image: ie_INS_8408A,
          features: ["Unmanaged", "8-port", "Gigabit", "Redundant Power", "EEE"],
          sourceUrl: detail(1610),
          details: {
            overview:
              "INS-8408A เป็น Unmanaged Industrial Gigabit Switch 8 พอร์ต 10/100/1000 RJ45 สำหรับงาน Automation — รองรับ Robot/PLC/HMI/Legacy Device — มี Redundant Power Input (Primary + RPS 9~57VDC), DIP Switch ตั้งค่า Per-port connectivity alarm, Power voltage drop alarm, Alarm Relay, IEEE 802.3az Green Ethernet ประหยัดพลังงาน, ESD 8KV/15KV + Surge 3KV/6KV ปกป้องระดับอุตสาหกรรม — IP40 Metal Housing ทน -40°C~75°C",
            highlights: [
              { title: "8-port Gigabit + Redundant Power", desc: "Primary + RPS 9~57VDC พร้อม Power voltage drop alarm" },
              { title: "DIP Switch Per-port Alarm", desc: "ตั้งค่าแจ้งเตือนสถานะการเชื่อมต่อแต่ละพอร์ต" },
              { title: "Alarm Relay 1A @ 24VDC", desc: "ส่งสัญญาณเตือนไปยัง PLC/SCADA" },
              { title: "Industrial-grade ESD/Surge", desc: "ESD 8KV/15KV, Surge 3KV/6KV (RJ45 Line to Ground)" },
              { title: "IEEE 802.3az Green Ethernet", desc: "ปรับ consumption อัตโนมัติเมื่อ link ว่าง" },
              { title: "Reverse Polarity + Overload Protection", desc: "ปกป้อง Hardware จากความผิดพลาดในการต่อไฟ" },
              { title: "IP40 Metal Housing", desc: "ทน -40°C~75°C เหมาะ Field Cabinet" },
              { title: "QoS / VLAN Passthru", desc: "จัดลำดับ Mission-critical packet + ส่งต่อ VLAN ไม่ดัดแปลง" },
              { title: "Auto-Negotiation ทุกพอร์ต", desc: "Plug & Play เชื่อมต่อ Robot/PLC ได้ทันที" },
            ],
            ports: ["8 x 10/100/1000BASE-T (RJ45)"],
            ledPanel: "PWR, RPS, ALM, 1000M, LNK/ACT",
            power: { input: "Primary 9~57VDC + Redundant 9~57VDC", consumption: "5W" },
            environment: { tempOperating: "-40°C ~ 75°C", tempStorage: "-40°C ~ 85°C", humidity: "5~95% RH (non-condensing)", housing: "Metal (IP40)" },
            physical: { weight: "480 g", dimension: "50 x 116 x 100 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/aa31c253a28428434b132b1e1604a473.pdf",
          },
        },
        {
          model: "7013-16T-I",
          description: "16x 10/100BASE-TX (RJ45) — Unmanaged Industrial Switch with 16KB Jumbo Frame",
          image: ie_7013_16T_I,
          features: ["Unmanaged", "16-port", "Fast Ethernet", "Jumbo Frame"],
          sourceUrl: detail(1681),
          details: {
            overview:
              "7013-16T-I เป็น Unmanaged Industrial Ethernet Switch 16 พอร์ต 10/100BASE-TX สำหรับงาน Industrial High-density — รองรับ 16KB Jumbo Frame ส่งข้อมูลแพ็คเกจขนาดใหญ่ได้มีประสิทธิภาพ, Full Duplex 200 Mbps ต่อพอร์ต, Auto MDI/MDI-X, Fanless silent operation, IP40 Aluminum Casing ทน -40°C~75°C, EMI/EMC Protection, ผ่าน UL + Burn-in Test 100% รับประกัน 5 ปี",
            highlights: [
              { title: "16-port High Density 10/100", desc: "เหมาะ Robot/Control Device จำนวนมากใน Application ซับซ้อน" },
              { title: "16KB Jumbo Frame", desc: "ส่งแพ็กเกจขนาดใหญ่ได้มีประสิทธิภาพ ลด overhead" },
              { title: "Full Duplex 200 Mbps/port", desc: "เหมาะกับการรับส่งไฟล์ขนาดใหญ่อย่างรวดเร็ว" },
              { title: "Fanless Silent Operation", desc: "ไม่มีเสียง เหมาะกับ Workspace ที่เงียบ" },
              { title: "Auto MDI/MDI-X + Auto-Negotiation", desc: "Plug & Play ไม่ต้องเลือกประเภทสาย" },
              { title: "Flow Control", desc: "ป้องกันอุปกรณ์ overwhelm ซึ่งกันและกัน" },
              { title: "Intelligent VLAN Forwarding", desc: "ส่งต่อ VLAN tagged packet โดยไม่ดัดแปลง" },
              { title: "IP40 Aluminum Compact", desc: "ทน -40°C~75°C, EMI/EMC Protection" },
              { title: "5-Year Warranty + 100% Burn-in", desc: "ผ่านการทดสอบทุกตัว รับประกัน 5 ปี" },
            ],
            ports: ["16 x 10/100BASE-TX (RJ45)"],
            ledPanel: "PWR, 100, LNK/ACT",
            power: { input: "12~48VDC", consumption: "10W" },
            environment: { tempOperating: "-40°C ~ 75°C", tempStorage: "-40°C ~ 85°C", humidity: "5~95% RH", housing: "Metal (IP40)" },
            physical: { weight: "900 g", dimension: "50 x 160 x 120 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/65587c33059e31ebe6a5193d1f8dc556.pdf",
          },
        },
        {
          model: "7013-16GT-I",
          description: "16x 10/100/1000BASE-T (RJ45) — Unmanaged Industrial Gigabit Switch",
          image: ie_7013_16GT_I,
          features: ["Unmanaged", "16-port", "Gigabit", "QoS"],
          sourceUrl: detail(1602),
          details: {
            overview:
              "7013-16GT-I เป็น Unmanaged Industrial Gigabit Switch 16 พอร์ต 10/100/1000 RJ45 สำหรับ Mission-critical Application — รองรับ Multi-axis Robot, PLC, HMI, Legacy Device — Auto-negotiation ทุกพอร์ต, IEEE 802.1p Class of Service, QoS feature สำหรับ Bandwidth จำกัด, EMC Protection ป้องกันฟ้าผ่าและ Static — IP40 Metal Housing ทน -40°C~75°C, ติดตั้ง DIN-Rail",
            highlights: [
              { title: "16-port Gigabit High Density", desc: "ทุกพอร์ต Gigabit รองรับ Application ซับซ้อนหลายอุปกรณ์" },
              { title: "Industrial-grade EMC Protection", desc: "ปกป้องจากฟ้าผ่า, Static Discharge ระหว่างอุปกรณ์ที่มีศักย์ต่างกัน" },
              { title: "Robust IP40 Hardened Housing", desc: "ทน -40°C~75°C สำหรับ Mission-critical" },
              { title: "Auto-Negotiation Link Speed", desc: "Balance ความเร็วระหว่าง Switch กับ PLC ที่ต่างกัน" },
              { title: "QoS for Limited Capacity Network", desc: "รับประกันให้ High-priority Application ทำงานได้" },
              { title: "IEEE 802.1p Class of Service", desc: "จัดลำดับ Traffic Priority ตามมาตรฐาน" },
              { title: "Reverse Polarity Protection", desc: "ป้องกันต่อขั้วไฟผิด" },
              { title: "Flow Control + VLAN Passthru", desc: "ป้องกัน Overflow + ส่งต่อ VLAN tagged ไม่ดัดแปลง" },
              { title: "DIN-Rail Mount", desc: "ติดตั้งง่าย น้ำหนัก 900g" },
            ],
            ports: ["16 x 10/100/1000BASE-T (RJ45)"],
            ledPanel: "PWR",
            power: { input: "Primary 12~48VDC", consumption: "15W" },
            environment: { tempOperating: "-40°C ~ 75°C", tempStorage: "-40°C ~ 85°C", humidity: "5~95% RH (non-condensing)", housing: "Metal (IP40)" },
            physical: { weight: "900 g (with RJ45 cap) / 880 g (without)", dimension: "50 x 160 x 120 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/dafa3eb8835b6d850859a8beb37785d3.pdf",
          },
        },
      ],
    },
    {
      id: "ie-unmanaged-premium",
      title: "Unmanaged Premium",
      blurb: "Premium Unmanaged Switch — ทนทานกว่ามาตรฐาน อายุการใช้งานยาวขึ้น เหมาะกับโครงการระยะยาว",
      products: [
        {
          model: "INS-801E",
          description: "5x 10/100 RJ45 — Premium Unmanaged Industrial Switch",
          image: ie_INS_801E,
          features: ["Premium", "5-port", "Fast Ethernet"],
          sourceUrl: detail(1598),
          details: {
            overview:
              "Premium Unmanaged Industrial Switch 5 พอร์ต 10/100Mbps — รองรับ Auto-negotiation, Flow & Storm Control, VLAN Pass-through และ Industrial QoS (EtherNet/IP, PROFINET, GOOSE) ตัวเครื่องอลูมิเนียม IP40 ทำงานช่วงอุณหภูมิ -40°C~75°C เหมาะกับ PLC, HMI และอุปกรณ์ Legacy ในสายการผลิต",
            highlights: [
              { title: "พอร์ตหลัก: 5 x 10/100BASE-TX", desc: "เชื่อมต่ออุปกรณ์อุตสาหกรรมได้หลากหลายในเครือข่ายเดียว" },
              { title: "Auto-negotiation ทุกพอร์ต", desc: "ตรวจจับความเร็วและ Duplex อัตโนมัติ ติดตั้งง่าย ไม่ต้องตั้งค่าเพิ่ม" },
              { title: "Flow & Storm Control", desc: "ควบคุม Traffic ป้องกัน Data Storm และ Buffer Overflow" },
              { title: "VLAN Pass-through / Passthru", desc: "ส่งต่อ VLAN Tag โดยไม่ดัดแปลง ป้องกัน Packet Loss" },
              { title: "Industrial QoS (iQoS)", desc: "จัดลำดับความสำคัญของ EtherNet/IP, PROFINET, GOOSE และ 802.1p Tag" },
              { title: "Operating Temp -40°C~75°C", desc: "ทนอุณหภูมิสุดขั้วในโรงงาน ผ่าน UL Approved Temperature Range" },
            ],
            ports: [
              "5 x 10/100BASE-TX (RJ45)",
            ],
            power: {
              input: "Primary inputs 12~48VDC Redundant inputs 12~48VDC",
              consumption: "3W (Max)",
            },
            environment: {
              tempOperating: "-40°C~75°C (-40°F~167°F)",
              housing: "Aluminum (IP40 protection)",
            },
            physical: {
              weight: "400 g (0.88 lb)",
              dimension: "57.3 x 131.2 x 100.9 mm (2.26 x 5.17 x 3.97 in) (DIN-Rail)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/f386be67b05341ba971fe1fcd72ce062.pdf",
          },
        },
        {
          model: "INS-806E",
          description: "8x 10/100 RJ45 — Premium Unmanaged Industrial Switch",
          image: ie_INS_806E,
          features: ["Premium", "8-port", "Fast Ethernet"],
          sourceUrl: detail(1600),
          details: {
            overview:
              "Premium Unmanaged Industrial Switch 8 พอร์ต 10/100Mbps — Auto-negotiation, iQoS สำหรับ EtherNet/IP/PROFINET/GOOSE และ Redundant Power 12~48VDC ตัวเครื่องอลูมิเนียม IP40 -40°C~75°C เหมาะสำหรับเครือข่ายโรงงานที่ต้องการเสถียรภาพระดับ Premium",
            highlights: [
              { title: "พอร์ตหลัก: 8 x 10/100BASE-TX", desc: "เชื่อมต่ออุปกรณ์อุตสาหกรรมได้หลากหลายในเครือข่ายเดียว" },
              { title: "Auto-negotiation ทุกพอร์ต", desc: "ตรวจจับความเร็วและ Duplex อัตโนมัติ ติดตั้งง่าย ไม่ต้องตั้งค่าเพิ่ม" },
              { title: "Flow & Storm Control", desc: "ควบคุม Traffic ป้องกัน Data Storm และ Buffer Overflow" },
              { title: "VLAN Pass-through / Passthru", desc: "ส่งต่อ VLAN Tag โดยไม่ดัดแปลง ป้องกัน Packet Loss" },
              { title: "Industrial QoS (iQoS)", desc: "จัดลำดับความสำคัญของ EtherNet/IP, PROFINET, GOOSE และ 802.1p Tag" },
              { title: "Operating Temp -40°C~75°C", desc: "ทนอุณหภูมิสุดขั้วในโรงงาน ผ่าน UL Approved Temperature Range" },
            ],
            ports: [
              "8 x 10/100BASE-TX (RJ45)",
            ],
            power: {
              input: "Primary input 12~48VDC Redundant input 12~48VDC",
              consumption: "3W",
            },
            environment: {
              tempOperating: "-40°C~75°C (-40°F~167°F)",
              housing: "Aluminum (IP40 protection)",
            },
            physical: {
              weight: "480 g (1.0 lb)",
              dimension: "57.3 x 131.2 x 100.9 mm (2.26 x 5.17 x 3.97 in) (DIN-Rail)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/96db6f5c2d52f91ef093458a47a784ee.pdf",
          },
        },
        {
          model: "INS-802E",
          description: "8x 10/100 RJ45 + 2x FX/GbE SFP — Premium Unmanaged Industrial",
          image: ie_INS_802E,
          features: ["Premium", "Fiber", "10-port"],
          sourceUrl: detail(1599),
          details: {
            overview:
              "Premium Unmanaged Industrial Switch 8 พอร์ต 10/100 RJ45 + 2 พอร์ต FX/GbE SFP — Dual Fiber Uplink, Redundant DC Input, Dry-contact Smart Alarm รองรับ iQoS และ VLAN Pass-through ตัวเครื่อง IP40 อลูมิเนียม -40°C~75°C เหมาะกับงาน Automation ที่ต้องเชื่อมต่อระยะไกลผ่าน Fiber",
            highlights: [
              { title: "พอร์ตหลัก: 8 x 10/100Base-TX (RJ45) + 2 x FX/GbE (SFP)", desc: "เชื่อมต่ออุปกรณ์อุตสาหกรรมได้หลากหลายในเครือข่ายเดียว" },
              { title: "Auto-negotiation ทุกพอร์ต", desc: "ตรวจจับความเร็วและ Duplex อัตโนมัติ ติดตั้งง่าย ไม่ต้องตั้งค่าเพิ่ม" },
              { title: "Flow & Storm Control", desc: "ควบคุม Traffic ป้องกัน Data Storm และ Buffer Overflow" },
              { title: "VLAN Pass-through / Passthru", desc: "ส่งต่อ VLAN Tag โดยไม่ดัดแปลง ป้องกัน Packet Loss" },
              { title: "Industrial QoS (iQoS)", desc: "จัดลำดับความสำคัญของ EtherNet/IP, PROFINET, GOOSE และ 802.1p Tag" },
              { title: "Operating Temp -40°C~75°C", desc: "ทนอุณหภูมิสุดขั้วในโรงงาน ผ่าน UL Approved Temperature Range" },
            ],
            ports: [
              "8 x 10/100Base-TX (RJ45)",
              "2 x FX/GbE (SFP)",
            ],
            power: {
              input: "Primary inputs: 12 ~ 48VDC Redundant inputs: 12 ~ 48VDC",
              consumption: "6W (Max)",
            },
            environment: {
              tempOperating: "-40°C to 75°C",
              housing: "Aluminum (IP40 protection)",
            },
            physical: {
              weight: "791 g (1.74 lb)",
              dimension: "57.3 x 175 x 126.4 mm (2.26 x 6.89 x 4.98 in) (DIN-Rail)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/57e96043c5007e79e1ce889c11ace67b.pdf",
          },
        },
        {
          model: "INS-8005E",
          description: "5x 10/100 RJ45 — Premium Unmanaged Industrial Switch",
          image: ie_INS_8005E,
          features: ["Premium", "5-port", "Fast Ethernet"],
          sourceUrl: detail(1591),
          details: {
            overview:
              "Premium Unmanaged Industrial Switch ขนาดกะทัดรัด 5 พอร์ต 10/100Mbps — รองรับ iQoS, VLAN Passthru, Flow Control ตัวเครื่อง IP40 อลูมิเนียม น้ำหนักเพียง 183 กรัม ติดตั้งได้ทั้ง DIN-Rail และ Wall Mount เหมาะกับงาน Robot, PLC และ HMI ในพื้นที่จำกัด",
            highlights: [
              { title: "พอร์ตหลัก: 5 x 10/100BASE-TX", desc: "เชื่อมต่ออุปกรณ์อุตสาหกรรมได้หลากหลายในเครือข่ายเดียว" },
              { title: "Auto-negotiation ทุกพอร์ต", desc: "ตรวจจับความเร็วและ Duplex อัตโนมัติ ติดตั้งง่าย ไม่ต้องตั้งค่าเพิ่ม" },
              { title: "Flow & Storm Control", desc: "ควบคุม Traffic ป้องกัน Data Storm และ Buffer Overflow" },
              { title: "VLAN Pass-through / Passthru", desc: "ส่งต่อ VLAN Tag โดยไม่ดัดแปลง ป้องกัน Packet Loss" },
              { title: "Industrial QoS (iQoS)", desc: "จัดลำดับความสำคัญของ EtherNet/IP, PROFINET, GOOSE และ 802.1p Tag" },
              { title: "Operating Temp -40°C~75°C", desc: "ทนอุณหภูมิสุดขั้วในโรงงาน ผ่าน UL Approved Temperature Range" },
            ],
            ports: [
              "5 x 10/100BASE-TX (RJ45)",
            ],
            power: {
              input: "12~48VDC",
              consumption: "3W",
            },
            environment: {
              tempOperating: "-40°C~75°C (-40°F~167°F)",
              housing: "Aluminum (IP40 Protection)",
            },
            physical: {
              weight: "183.4 g (0.4 lb)",
              dimension: "23.6 x 109.2 x 73.8 mm (0.93 x 4.3 x 2.90 in) (DIN-Rail, Wall Mount)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/74ff2e886f35e9e4547c406fcfe4429f.pdf",
          },
        },
        {
          model: "INS-8405E",
          description: "5x 10/100/1000 RJ45 — Premium Unmanaged Industrial Gigabit",
          image: ie_INS_8405E,
          features: ["Premium", "5-port", "Gigabit"],
          sourceUrl: detail(1586),
          details: {
            overview:
              "Premium Unmanaged Industrial Gigabit Switch 5 พอร์ต 10/100/1000Mbps แบบ Slim — iQoS รองรับ EtherNet/IP/PROFINET/GOOSE, VLAN Passthru, Flow Control ตัวเครื่อง IP40 อลูมิเนียม -40°C~75°C น้ำหนักเบาเพียง 160 กรัม เหมาะกับการเชื่อมต่อ Gigabit ในตู้ควบคุมขนาดเล็ก",
            highlights: [
              { title: "พอร์ตหลัก: 5 x 10/100/1000BASE-T", desc: "เชื่อมต่ออุปกรณ์อุตสาหกรรมได้หลากหลายในเครือข่ายเดียว" },
              { title: "Auto-negotiation ทุกพอร์ต", desc: "ตรวจจับความเร็วและ Duplex อัตโนมัติ ติดตั้งง่าย ไม่ต้องตั้งค่าเพิ่ม" },
              { title: "Industrial QoS (iQoS)", desc: "จัดลำดับความสำคัญของ EtherNet/IP, PROFINET, GOOSE และ 802.1p Tag" },
              { title: "Operating Temp -40°C~75°C", desc: "ทนอุณหภูมิสุดขั้วในโรงงาน ผ่าน UL Approved Temperature Range" },
            ],
            ports: [
              "5 x 10/100/1000BASE-T (RJ45)",
            ],
            power: {
              input: "Primary 12~48VDC + Redundant 12~48VDC",
              consumption: "—",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C",
              housing: "Aluminum (IP40 Protection)",
            },
            physical: {
              weight: "160 g (0.3 lb)",
              dimension: "23.6 x 109.2 x 73.8 mm (0.93 x 4.3 x 2.90 in) (DIN-Rail, Wall Mount)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/117d217331db85738265393db6de65a6.pdf",
          },
        },
        {
          model: "INS-8415",
          description: "5x 10/100/1000 RJ45 + 1x GbE SFP — Premium Unmanaged Industrial",
          image: ie_INS_8415,
          features: ["Premium", "Fiber", "6-port"],
          sourceUrl: detail(1604),
          details: {
            overview:
              "Premium Unmanaged Gigabit Industrial Switch 5 พอร์ต 10/100/1000 RJ45 + 1 พอร์ต GbE SFP — รองรับ Redundant Input 20~57VDC, Power Voltage Drop Alarm, iQoS, VLAN Passthru ตัวเครื่อง IP40 อลูมิเนียม เหมาะกับการเชื่อม Fiber ระยะไกลในเครือข่ายอุตสาหกรรม Gigabit",
            highlights: [
              { title: "พอร์ตหลัก: 5 x 10/100/1000BASE-T + 1 x GbE SFP Slot", desc: "เชื่อมต่ออุปกรณ์อุตสาหกรรมได้หลากหลายในเครือข่ายเดียว" },
              { title: "Auto-negotiation ทุกพอร์ต", desc: "ตรวจจับความเร็วและ Duplex อัตโนมัติ ติดตั้งง่าย ไม่ต้องตั้งค่าเพิ่ม" },
              { title: "Industrial QoS (iQoS)", desc: "จัดลำดับความสำคัญของ EtherNet/IP, PROFINET, GOOSE และ 802.1p Tag" },
              { title: "Redundant Power Input", desc: "รับไฟ Primary + Redundant ป้องกัน Downtime จาก Power Failure" },
              { title: "Operating Temp -40°C~75°C", desc: "ทนอุณหภูมิสุดขั้วในโรงงาน ผ่าน UL Approved Temperature Range" },
            ],
            ports: [
              "5 x 10/100/1000BASE-T (RJ45)",
              "1 x GbE SFP Slot",
            ],
            power: {
              input: "Primary: 20~57V DC Redundant: 20~57V DC",
              consumption: "—",
            },
            environment: {
              tempOperating: "-40°C~75°C (-40°F~167°F)",
              housing: "Metal (IP40 protection)",
            },
            physical: {
              weight: "510 g (1.12 lb)",
              dimension: "31 x 136.3 x 105 mm (1.22 x 5.37 x 4.13 in) (DIN-Rail, Wall Mount (Optional))",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/ac73f58678698b9959ddc13207c640bf.pdf",
          },
        },
        {
          model: "INS-8008E",
          description: "8x 10/100 RJ45 — Premium Unmanaged Industrial Switch",
          image: ie_INS_8008E,
          features: ["Premium", "8-port", "Fast Ethernet"],
          sourceUrl: detail(1592),
          details: {
            overview:
              "Premium Unmanaged Industrial Switch 8 พอร์ต 10/100Mbps — รองรับ Redundant Power 12~48VDC, iQoS (EtherNet/IP, PROFINET, GOOSE), VLAN Pass-through, Flow & Storm Control ตัวเครื่อง IP40 อลูมิเนียม -40°C~75°C เหมาะกับโรงงานที่ต้องการสวิตช์ Premium 8 พอร์ตทนทาน",
            highlights: [
              { title: "พอร์ตหลัก: 8 x 10/100BASE-TX", desc: "เชื่อมต่ออุปกรณ์อุตสาหกรรมได้หลากหลายในเครือข่ายเดียว" },
              { title: "Auto-negotiation ทุกพอร์ต", desc: "ตรวจจับความเร็วและ Duplex อัตโนมัติ ติดตั้งง่าย ไม่ต้องตั้งค่าเพิ่ม" },
              { title: "Flow & Storm Control", desc: "ควบคุม Traffic ป้องกัน Data Storm และ Buffer Overflow" },
              { title: "VLAN Pass-through / Passthru", desc: "ส่งต่อ VLAN Tag โดยไม่ดัดแปลง ป้องกัน Packet Loss" },
              { title: "Industrial QoS (iQoS)", desc: "จัดลำดับความสำคัญของ EtherNet/IP, PROFINET, GOOSE และ 802.1p Tag" },
              { title: "Operating Temp -40°C~75°C", desc: "ทนอุณหภูมิสุดขั้วในโรงงาน ผ่าน UL Approved Temperature Range" },
            ],
            ports: [
              "8 x 10/100BASE-TX (RJ45)",
            ],
            power: {
              input: "Primary input 12~48VDC Redundant input 12~48VDC",
              consumption: "5W",
            },
            environment: {
              tempOperating: "-40°C~75°C (-40°F~167°F)",
              housing: "Metal (IP40 protection)",
            },
            physical: {
              weight: "480 g (1.06 lb)",
              dimension: "50 x 116 x 100 mm (1.97 x 4.57x 3.93 in) (DIN-Rail)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/2142bbdc5bc8540221abc425c5f1ddc3.pdf",
          },
        },
        {
          model: "INS-8408E",
          description: "8x 10/100/1000 RJ45 — Premium Unmanaged Industrial Gigabit",
          image: ie_INS_8408E,
          features: ["Premium", "8-port", "Gigabit"],
          sourceUrl: detail(1585),
          details: {
            overview:
              "Premium Unmanaged Gigabit Industrial Switch 8 พอร์ต 10/100/1000Mbps — Redundant Power 12~48VDC, iQoS รองรับ EtherNet/IP/PROFINET/GOOSE, VLAN Pass-through ตัวเครื่อง IP40 อลูมิเนียม -40°C~75°C ผ่านมาตรฐาน UL เหมาะกับ PLC, HMI, Printer ในระบบ Automation",
            highlights: [
              { title: "พอร์ตหลัก: 8 x 10/100/1000BASE-T", desc: "เชื่อมต่ออุปกรณ์อุตสาหกรรมได้หลากหลายในเครือข่ายเดียว" },
              { title: "Flow & Storm Control", desc: "ควบคุม Traffic ป้องกัน Data Storm และ Buffer Overflow" },
              { title: "VLAN Pass-through / Passthru", desc: "ส่งต่อ VLAN Tag โดยไม่ดัดแปลง ป้องกัน Packet Loss" },
              { title: "Industrial QoS (iQoS)", desc: "จัดลำดับความสำคัญของ EtherNet/IP, PROFINET, GOOSE และ 802.1p Tag" },
              { title: "Redundant Power Input", desc: "รับไฟ Primary + Redundant ป้องกัน Downtime จาก Power Failure" },
              { title: "Operating Temp -40°C~75°C", desc: "ทนอุณหภูมิสุดขั้วในโรงงาน ผ่าน UL Approved Temperature Range" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (RJ45)",
            ],
            power: {
              input: "Primary input 12~48VDC Redundant input 12~48VDC",
              consumption: "5W",
            },
            environment: {
              tempOperating: "-40°C~75°C (-40°F~167°F)",
              housing: "Metal (IP40 protection)",
            },
            physical: {
              weight: "480 g (1.0 lb)",
              dimension: "50 x 116 x 100 mm (1.97 x 4.57x 3.93 in) (Stainless steel DIN-Rail)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/49a20b4106e78dfaa92cd06e584a729b.pdf",
          },
        },
        {
          model: "7015-8GT2GS-I",
          description: "8x 10/100/1000 RJ45 + 2x GbE SFP — Premium Unmanaged Industrial",
          image: ie_7015_8GT2GS_I,
          features: ["Premium", "Fiber", "10-port"],
          sourceUrl: detail(1601),
          details: {
            overview:
              "Premium Unmanaged Industrial Gigabit Switch 8 พอร์ต 10/100/1000 RJ45 + 2 พอร์ต GbE SFP — Redundant DC Input 24~48VDC, System Power 11W, รองรับ iQoS และ VLAN Passthru ตัวเครื่อง IP40 อลูมิเนียม -40°C~75°C เหมาะกับงานเชื่อม Fiber ระยะไกลที่ต้องการความเสถียรสูง",
            highlights: [
              { title: "พอร์ตหลัก: 8 x 10/100/1000BASE-T + 2 x GbE SFP Slots", desc: "เชื่อมต่ออุปกรณ์อุตสาหกรรมได้หลากหลายในเครือข่ายเดียว" },
              { title: "VLAN Pass-through / Passthru", desc: "ส่งต่อ VLAN Tag โดยไม่ดัดแปลง ป้องกัน Packet Loss" },
              { title: "Industrial QoS (iQoS)", desc: "จัดลำดับความสำคัญของ EtherNet/IP, PROFINET, GOOSE และ 802.1p Tag" },
              { title: "Operating Temp -40°C~75°C", desc: "ทนอุณหภูมิสุดขั้วในโรงงาน ผ่าน UL Approved Temperature Range" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (RJ45)",
              "2 x GbE SFP Slots",
            ],
            power: {
              input: "Primary inputs: 24~48VDC Redundant Inputs: 24~48VDC",
              consumption: "11W",
            },
            environment: {
              tempOperating: "-40°C~75°C (-40°F~167°F)",
              housing: "Metal (IP40 protection)",
            },
            physical: {
              weight: "550 g (1.2 lb)",
              dimension: "50 x 116 x 100 mm (1.97 x 4.57x 3.93 in) (DIN-Rail)",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/4c578b6ee0163c91020585245d3ca4d5.pdf",
          },
        },
        {
          model: "INS-8108E",
          description: "8x 10/100 RJ45 — Premium Unmanaged Industrial Switch",
          image: ie_INS_8108E,
          features: ["Premium", "8-port", "Fast Ethernet"],
          sourceUrl: detail(1603),
          details: {
            overview:
              "Premium Unmanaged Industrial Switch แบบ Slim 8 พอร์ต 10/100Mbps — น้ำหนักเบาเพียง 145 กรัม รองรับ iQoS, VLAN Passthru, Flow Control ตัวเครื่อง IP40 อลูมิเนียม -40°C~75°C เหมาะกับการติดตั้งในตู้ควบคุมขนาดเล็กที่ต้องการสวิตช์ระดับ Premium",
            highlights: [
              { title: "พอร์ตหลัก: 8 x 10/100Base-TX (RJ45)", desc: "เชื่อมต่ออุปกรณ์อุตสาหกรรมได้หลากหลายในเครือข่ายเดียว" },
              { title: "Auto-negotiation ทุกพอร์ต", desc: "ตรวจจับความเร็วและ Duplex อัตโนมัติ ติดตั้งง่าย ไม่ต้องตั้งค่าเพิ่ม" },
              { title: "Flow & Storm Control", desc: "ควบคุม Traffic ป้องกัน Data Storm และ Buffer Overflow" },
              { title: "VLAN Pass-through / Passthru", desc: "ส่งต่อ VLAN Tag โดยไม่ดัดแปลง ป้องกัน Packet Loss" },
              { title: "Industrial QoS (iQoS)", desc: "จัดลำดับความสำคัญของ EtherNet/IP, PROFINET, GOOSE และ 802.1p Tag" },
              { title: "Operating Temp -40°C~75°C", desc: "ทนอุณหภูมิสุดขั้วในโรงงาน ผ่าน UL Approved Temperature Range" },
            ],
            ports: [
              "8 x 10/100Base-TX (RJ45)",
            ],
            power: {
              input: "Primary 12~48VDC + Redundant 12~48VDC",
              consumption: "—",
            },
            environment: {
              tempOperating: "-40°C~75°C (-40°F~167°F)",
              housing: "Aluminum (IP40 Protection)",
            },
            physical: {
              weight: "145 g (0.32 lb)",
              dimension: "109.2 x 73.8 x 28.4 mm (4.3 x 2.9 x 1.12 in) (DIN-Rail, Wall Mount (optional))",
            },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/8432e3050d90633f1df611f40c27e6eb.pdf",
          },
        },
      ],
    },
    {
      id: "ie-lite-managed",
      title: "Lite Managed",
      blurb: "Lite Managed — VLAN/QoS/SNMP/IGMP เบื้องต้น พร้อม LAMUNGAN Platform (Wizard 3 ขั้นตอน 3 นาที + Topology Map + Dashboard)",
      products: [
        {
          model: "8015 Series",
          description: "8x GbE RJ45 (+ 2x FX/GbE SFP option) — Lite Managed Industrial Switch (8015-8GT-I / 8015-8GT2GS-I)",
          image: ie_8015_Series,
          features: ["Lite Managed", "8-port", "Fiber Option", "-40°C~75°C"],
          sourceUrl: detail(1583),
          details: {
            overview:
              "8015 Series เป็น Lite Managed Industrial Switch 8 พอร์ต Gigabit RJ45 — มี 2 รุ่นย่อย: 8015-8GT-I (Copper-only) และ 8015-8GT2GS-I (เพิ่ม 2 พอร์ต FX/GbE Multi-rate SFP สำหรับ Long-distance Uplink + Cascading) — มาพร้อม LAMUNGAN Platform (Wizard 3 ขั้นตอน 3 นาที + Topology Map + Dashboard) — รองรับ Modbus TCP เชื่อม PLC / HMI / Legacy Devices — ตัวเครื่อง Metal IP40 ทำงาน -40°C~75°C — UL Certified ถึง -40°C~70°C",
            highlights: [
              { title: "8x GbE + 2x SFP (รุ่น 8015-8GT2GS-I)", desc: "Multi-rate SFP รองรับทั้ง 100M/1G — Long-distance Fiber + Cascading" },
              { title: "LAMUNGAN Platform", desc: "Wizard ตั้งค่า 3 ขั้นตอน 3 นาที + Topology Map + Dashboard ดูสถานะ Real-time" },
              { title: "Modbus TCP + LLDP", desc: "เชื่อม PLC / HMI / Legacy ผ่าน Industrial Protocol โดยตรง" },
              { title: "Port Authentication 802.1X + QoS", desc: "เพิ่มความปลอดภัย + จัดลำดับความสำคัญแพ็กเก็ตอุตสาหกรรม" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual Input 24~48VDC + แจ้งเตือนไฟตกผ่าน Relay 1A @ 24VDC" },
              { title: "Metal IP40 + UL -40°C~70°C", desc: "ทำงานจริง -40°C~75°C — ทนสั่นสะเทือน, ESD, Surge สำหรับโรงงานหนัก" },
            ],
            ports: [
              "8015-8GT-I: 8 x 10/100/1000BASE-T (RJ45)",
              "8015-8GT2GS-I: 8 x 10/100/1000BASE-T + 2 x 100FX/GbE SFP",
            ],
            power: { input: "Primary inputs: 24~48VDC, Redundant inputs: 24~48VDC", consumption: "8GT2GS-I: Max. 11W / 8GT-I: Max. 10W (24VDC)" },
            environment: { tempOperating: "-40°C~75°C (-40°F~167°F)", tempStorage: "-40°C~85°C (-40°F~185°F)", humidity: "5~95% RH (non-condensing)", housing: "Metal (IP40 Protection)" },
            physical: { weight: "8GT-I: 500g / 8GT2GS-I: 550g", dimension: "50 x 116 x 100 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/49f3eb2113ba1b1cd93976962c3fb3f0.pdf",
          },
        },
        {
          model: "IEN-8415L",
          description: "5x GbE RJ45 + 1x FX/GbE SFP — Lite Managed Industrial Switch",
          image: ie_IEN_8415L,
          features: ["Lite Managed", "Fiber", "6-port"],
          sourceUrl: detail(1606),
          details: {
            overview:
              "IEN-8415L เป็น Lite Managed Industrial Switch 5 พอร์ต Gigabit RJ45 + 1 พอร์ต FX/GbE Multi-rate SFP Uplink — สำหรับ Long-distance Fast-speed Connectivity ผ่าน Fiber — มาพร้อม LAMUNGAN Platform (Wizard 3 ขั้นตอน + Topology Map + Dashboard) — รองรับ Modbus TCP เชื่อม PLC/HMI/Legacy — ตัวเครื่อง Metal IP40 ทำงาน -10°C~60°C",
            highlights: [
              { title: "5x GbE + 1x Multi-rate SFP", desc: "SFP Uplink รองรับทั้ง 100M และ 1G สำหรับ Long-distance Fiber" },
              { title: "LAMUNGAN Platform", desc: "Wizard ตั้งค่า 3 ขั้นตอน 3 นาที + Topology Map + Dashboard" },
              { title: "Modbus TCP + LLDP", desc: "เชื่อม PLC / HMI / Legacy ผ่าน Industrial Protocol โดยตรง" },
              { title: "Port Authentication 802.1X + QoS", desc: "ความปลอดภัย + Flow Control + Class of Service" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual Input 20~57VDC + แจ้งเตือนไฟตก" },
              { title: "Metal IP40 + Compact 31mm", desc: "DIN-Rail ขนาดเล็ก 31mm — เหมาะกับตู้คอนโทรลพื้นที่จำกัด" },
            ],
            ports: [
              "5 x 10/100/1000BASE-T (RJ45)",
              "1 x 100FX/GbE SFP Slot",
            ],
            power: { input: "Primary inputs: 20~57VDC, Redundant inputs: 20~57VDC", consumption: "10W (System)" },
            environment: { tempOperating: "-10°C~60°C (14°F~140°F)", tempStorage: "-40°C~85°C (-40°F~185°F)", humidity: "5~95% RH (non-condensing)", housing: "Metal (IP40 Protection)" },
            physical: { weight: "280 g (0.62 lb)", dimension: "31 x 136.3 x 105 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/49d62cb302c3eea3152751112bcff4d9.pdf",
          },
        },
        {
          model: "IEN-8424L",
          description: "4x GbE RJ45 + 2x FX/GbE SFP — Lite Managed Industrial Switch",
          image: ie_IEN_8424L,
          features: ["Lite Managed", "Fiber", "6-port"],
          sourceUrl: detail(1607),
          details: {
            overview:
              "IEN-8424L เป็น Lite Managed Industrial Switch 4 พอร์ต Gigabit RJ45 + 2 พอร์ต FX/GbE Multi-rate SFP Uplink — รองรับ Long-distance Fiber Connectivity และ Cascading Topology — มาพร้อม LAMUNGAN Platform — รองรับ Modbus TCP เชื่อม PLC/HMI/Legacy — ตัวเครื่อง Metal IP40 ทำงาน -10°C~60°C",
            highlights: [
              { title: "4x GbE + 2x Multi-rate SFP", desc: "Dual SFP Uplink รองรับ 100M/1G — Long-distance + Cascading" },
              { title: "LAMUNGAN Platform", desc: "Wizard 3 ขั้นตอน + Topology Map + Dashboard" },
              { title: "Modbus TCP + LLDP", desc: "เชื่อม PLC / HMI / Legacy ผ่าน Industrial Protocol" },
              { title: "Port Authentication 802.1X + QoS", desc: "Flow Control + Class of Service + EEE" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual Input 20~60VDC + แจ้งเตือนไฟตก 1A @ 24VDC" },
              { title: "Metal IP40 + DIN-Rail", desc: "ทนต่อสภาพแวดล้อมโรงงานทั่วไป — ESD, Surge Protection" },
            ],
            ports: [
              "4 x 10/100/1000BASE-T (RJ45)",
              "2 x 100FX/GbE SFP Slots",
            ],
            power: { input: "Primary inputs: 20~60VDC, Redundant inputs: 20~60VDC", consumption: "10W (System)" },
            environment: { tempOperating: "-10°C~60°C (14°F~140°F)", tempStorage: "-40°C~85°C (-40°F~185°F)", humidity: "5~95% RH (non-condensing)", housing: "Metal (IP40 Protection)" },
            physical: { weight: "430 g (0.95 lb)", dimension: "50 x 160 x 120 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/6de54a837c0df700daa96e564e5ca86d.pdf",
          },
        },
        {
          model: "IEN-840GL",
          description: "16x GbE RJ45 — High-Density Lite Managed Industrial Switch",
          image: ie_IEN_840GL,
          features: ["Lite Managed", "16-port", "High-Density"],
          sourceUrl: detail(1584),
          details: {
            overview:
              "IEN-840GL เป็น Lite Managed Industrial Switch 16 พอร์ต Gigabit RJ45 ความหนาแน่นพอร์ตสูง — สำหรับ Multi-axis Robots และ Peripherals (PLC, HMI, Printer) ในงาน Automation — มาพร้อม LAMUNGAN Platform — รองรับ Modbus TCP — ตัวเครื่อง Metal IP40 ทำงาน -10°C~60°C — UL Certified",
            highlights: [
              { title: "16x GbE RJ45 ความหนาแน่นสูง", desc: "เชื่อม Multi-axis Robots + PLC + HMI + Printer ในตัวเดียว" },
              { title: "LAMUNGAN Platform", desc: "Wizard 3 ขั้นตอน + Topology Map + Dashboard" },
              { title: "Modbus TCP + LLDP", desc: "ประหยัดต้นทุน — เชื่อม Legacy + Advanced Devices ผ่าน Protocol เดียว" },
              { title: "Port Authentication 802.1X + QoS", desc: "Flow Control + Class of Service + EEE" },
              { title: "Redundant Power + Alarm Relay + Reverse Polarity", desc: "Dual Input 12~60VDC + Reverse Polarity Protection" },
              { title: "Metal IP40 + UL Certified + Wall Mount", desc: "DIN-Rail หรือ Wall Mount (Optional) — UL Certified -10°C~60°C" },
            ],
            ports: [
              "16 x 10/100/1000BASE-T (RJ45)",
            ],
            power: { input: "Primary inputs: 12~60VDC, Redundant inputs: 12~60VDC", consumption: "18W (12V/1.5A)" },
            environment: { tempOperating: "-10°C~60°C (14°F~140°F)", tempStorage: "-40°C~85°C (-40°F~185°F)", humidity: "5~95% RH (non-condensing)", housing: "Metal (IP40 Protection)" },
            physical: { weight: "880 g (1.94 lb)", dimension: "50 x 160 x 120 mm (DIN-Rail / Wall Mount Optional)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/a96f1bb28cc732cc6c635f79abd94cf3.pdf",
          },
        },
      ],
    },
    {
      id: "ie-managed",
      title: "Managed Switches",
      blurb: "Full Managed — Ring Protection, ACL, IGMP, 802.1X เหมาะกับเครือข่ายซับซ้อน",
      products: [
        {
          model: "INS-8624",
          description: "4x 10/100/1000 RJ45 + 2x FX/GbE — Managed Industrial Switch",
          image: ie_INS_8624,
          features: ["Managed", "Fiber", "6-port"],
          sourceUrl: detail(1622),
          details: {
            overview:
              "Managed Industrial Switch 4 พอร์ต Gigabit RJ45 + 2 พอร์ต Multi-rate FX/GbE SFP Uplink — รองรับระยะไกลผ่านไฟเบอร์ปลอดสัญญาณรบกวน เหมาะกับ multi-axis robots, PLC, HMI และอุปกรณ์ Legacy ในงาน Automation — รองรับ Modbus TCP, Topology Map, Storm/Flow Control, QoS และ Cybersecurity — ตัวเครื่อง Aluminum IP40 ทำงาน -40°C~75°C พร้อม Redundant Power และ Alarm Relay",
            highlights: [
              { title: "พอร์ตหลัก: 4x GbE RJ45 + 2x FX/GbE SFP", desc: "SFP Multi-rate รองรับทั้ง 100M และ 1G สำหรับ Long-distance Fiber Uplink" },
              { title: "Topology Map", desc: "มองเห็นภาพรวมเครือข่าย รองรับอุปกรณ์ third-party ผ่าน LLDP" },
              { title: "Storm / Flow Control + QoS", desc: "จัดลำดับความสำคัญแพ็กเก็ตอุตสาหกรรม ป้องกัน Data Loss" },
              { title: "Modbus TCP", desc: "รวมอุปกรณ์ Industrial Ethernet ได้ง่าย เชื่อม HMI/Legacy โดยตรง" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual Input 20~57VDC + แจ้งเตือนเมื่อไฟตก ป้องกัน Downtime" },
              { title: "Aluminum IP40 + Operating -40°C~75°C", desc: "ทนสั่นสะเทือน ESD/EMI/Surge — เหมาะกับโรงงานหนัก" },
            ],
            ports: [
              "4 x 10/100/1000BASE-T (RJ45)",
              "2 x GbE SFP Slots (Multi-rate FX/GbE)",
            ],
            power: { input: "Primary inputs: 20~57VDC, Redundant inputs: 20~57VDC", consumption: "10W (System)" },
            environment: { tempOperating: "-40°C~75°C (-40°F~167°F)", housing: "Aluminum (IP40 Protection)" },
            physical: { weight: "795 g (1.75 lb)", dimension: "57.3 x 175 x 126.4 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/dcf787ffe84589542ae6d22ed9066e1f.pdf",
          },
        },
        {
          model: "IEN-8608A",
          description: "8x 10/100/1000 RJ45 — Managed Industrial Switch",
          image: ie_IEN_8608A,
          features: ["Managed", "8-port"],
          sourceUrl: detail(1624),
          details: {
            overview:
              "Managed Industrial Switch 8 พอร์ต Gigabit RJ45 — มี Console RJ45 สำหรับ CLI Management และ USB Port สำหรับ Firmware Upgrade / Backup Config / Download Log Files — รองรับ Modbus TCP, Topology Map, Storm/Flow Control, QoS — ตัวเครื่อง Aluminum IP40 ทนอุณหภูมิ -40°C~75°C พร้อม Redundant Power และ Alarm Relay",
            highlights: [
              { title: "พอร์ตหลัก: 8x 10/100/1000 RJ45", desc: "เชื่อม PLC, HMI, Printer และอุปกรณ์อุตสาหกรรมในเครือข่ายเดียว" },
              { title: "Console RJ45 + USB Port", desc: "CLI Management + Firmware Upgrade / Backup Config / Log Files" },
              { title: "Topology Map", desc: "ติดตามสถานะอุปกรณ์ในเครือข่ายแบบ Visual" },
              { title: "Modbus TCP", desc: "เชื่อม HMI/Legacy Devices ผ่าน Industrial Protocol โดยตรง" },
              { title: "Storm / Flow Control + QoS", desc: "จัดลำดับความสำคัญแพ็กเก็ตอุตสาหกรรม ป้องกัน Data Loss" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual Input + แจ้งเตือนไฟดับ — Aluminum IP40, -40°C~75°C" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (RJ45)",
              "1 x RJ45 Console Port",
              "1 x USB Port",
            ],
            power: { input: "Primary inputs: 12~60VDC, Redundant inputs: 12~60VDC", consumption: "12W (System)" },
            environment: { tempOperating: "-40°C~75°C (-40°F~167°F)", housing: "Aluminum (IP40 Protection)" },
            physical: { weight: "915 g (2.01 lb)", dimension: "57.3 x 175 x 126.4 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/8aaafb3fd11036a7281aa184b86fb33d.pdf",
          },
        },
        {
          model: "IEN-8648A",
          description: "8x 10/100/1000 RJ45 + 4x GbE SFP + 1x Console RJ45/USB — Managed Industrial Switch",
          image: ie_IEN_8648A,
          features: ["Managed", "Fiber", "12-port", "Console"],
          sourceUrl: detail(1625),
          details: {
            overview:
              "Managed Industrial Switch 8 พอร์ต Gigabit RJ45 Downlink + 4 พอร์ต GbE SFP Uplink — สำหรับ Long-distance Fiber และ Daisy Chain Topology — มี Console RJ45 + USB Port + รองรับ IEEE 1588v2 PTP, MSTP, QinQ — ตัวเครื่อง Aluminum IP40 ทำงาน -40°C~75°C พร้อม Redundant Power และ Alarm Relay",
            highlights: [
              { title: "พอร์ตหลัก: 8x GbE RJ45 + 4x GbE SFP", desc: "8 Downlink + 4 SFP Uplink — รองรับ Long-distance Fiber + Daisy Chain" },
              { title: "Console RJ45 + USB Port", desc: "CLI + Firmware Upgrade / Backup Config / Download Log Files" },
              { title: "IEEE 1588v2 PTP + MSTP + QinQ", desc: "Precision Timing + Multi-instance STP + VLAN Stacking สำหรับเครือข่ายซับซ้อน" },
              { title: "Topology Map", desc: "Visualize เครือข่าย + ตรวจ Cybersecurity Compliance" },
              { title: "Storm / Flow Control + QoS", desc: "จัดลำดับความสำคัญแพ็กเก็ตอุตสาหกรรม ป้องกัน Data Loss" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual Input 12~60VDC — Aluminum IP40, -40°C~75°C" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (RJ45)",
              "4 x GbE SFP Slots",
              "1 x RJ45 Console Port",
              "1 x USB Port",
            ],
            power: { input: "Primary inputs: 12~60VDC, Redundant inputs: 12~60VDC", consumption: "18W (System)" },
            environment: { tempOperating: "-40°C~75°C (-40°F~167°F)", housing: "Aluminum (IP40 Protection)" },
            physical: { weight: "1,005 g (2.21 lb)", dimension: "57.3 x 175 x 126.4 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/1e32b49068006bea793a9f6d89d5f939.pdf",
          },
        },
        {
          model: "9015-16GT-I",
          description: "16x 10/100/1000 RJ45 — Managed Industrial Gigabit",
          image: ie_9015_16GT_I,
          features: ["Managed", "16-port", "Gigabit"],
          sourceUrl: detail(1623),
          details: {
            overview:
              "Managed Industrial Switch 16 พอร์ต Gigabit RJ45 — สำหรับ Multi-axis Robots, PLC, HMI และ Printer ในงาน Automation — รองรับ Modbus TCP, Topology Map, Storm/Flow Control, QoS, QinQ และ 802.1X — ตัวเครื่อง Aluminum IP40 ทำงาน -40°C~75°C พร้อม Redundant Power และ Alarm Relay",
            highlights: [
              { title: "พอร์ตหลัก: 16x 10/100/1000 RJ45", desc: "ความหนาแน่นพอร์ตสูง — เชื่อม Multi-axis Robots / PLC / HMI ได้ในตัวเดียว" },
              { title: "Topology Map", desc: "ติดตามสถานะอุปกรณ์ third-party ผ่าน LLDP" },
              { title: "QinQ + 802.1X + MSTP", desc: "VLAN Stacking + Port Authentication + Multi-Spanning Tree" },
              { title: "Modbus TCP", desc: "เชื่อม HMI / Legacy Devices ผ่าน Industrial Protocol โดยตรง" },
              { title: "Storm / Flow Control + QoS", desc: "จัดลำดับความสำคัญแพ็กเก็ตอุตสาหกรรม" },
              { title: "Redundant Power + Alarm Relay", desc: "Dual Input 12~60VDC — Aluminum IP40, -40°C~75°C" },
            ],
            ports: [
              "16 x 10/100/1000BASE-T (RJ45)",
            ],
            power: { input: "Primary inputs: 12~60VDC, Redundant inputs: 12~60VDC", consumption: "18W (12V/1.5A)" },
            environment: { tempOperating: "-40°C~75°C (-40°F~167°F)", housing: "Aluminum (IP40 Protection)" },
            physical: { weight: "918 g (2.02 lb)", dimension: "57.3 x 175 x 126.4 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/59f5f7cf46084549c237b70f3ad670ef.pdf",
          },
        },
        {
          model: "INS-8615",
          description: "5x 10/100/1000 RJ45 + 1x FX/GbE SFP — Managed Industrial Switch",
          image: ie_INS_8615,
          features: ["Managed", "Fiber", "6-port"],
          sourceUrl: detail(1617),
          details: {
            overview:
              "Managed Industrial Switch 5 พอร์ต Gigabit RJ45 + 1 พอร์ต Multi-rate FX/GbE SFP Uplink — รองรับ Long-distance Fiber, Modbus TCP, Topology Map, Storm/Flow Control, QoS, EEE 802.3az — ตัวเครื่อง Metal IP40 ทำงาน -40°C~75°C พร้อม Redundant Power และ Alarm Relay",
            highlights: [
              { title: "พอร์ตหลัก: 5x GbE RJ45 + 1x FX/GbE SFP", desc: "SFP Multi-rate รองรับทั้ง 100M และ 1G สำหรับ Long-distance Fiber Uplink" },
              { title: "Topology Map", desc: "มองเห็นภาพรวมเครือข่ายและสถานะอุปกรณ์" },
              { title: "EEE 802.3az", desc: "Energy Efficient Ethernet ลดการใช้พลังงานเมื่อ traffic ต่ำ" },
              { title: "Modbus TCP + 802.1X", desc: "เชื่อม HMI/Legacy + Port Authentication" },
              { title: "Storm / Flow Control + QoS", desc: "จัดลำดับความสำคัญแพ็กเก็ตอุตสาหกรรม" },
              { title: "Metal IP40 + Operating -40°C~75°C", desc: "Redundant Power + Alarm Relay — Compact Form Factor" },
            ],
            ports: [
              "5 x 10/100/1000BASE-T (RJ45)",
              "1 x GbE SFP Slot (Multi-rate FX/GbE)",
            ],
            power: { input: "Primary inputs: 20~57VDC, Redundant inputs: 20~57VDC", consumption: "10W" },
            environment: { tempOperating: "-40°C~75°C (-40°F~167°F)", housing: "Metal (IP40 Protection)" },
            physical: { weight: "515 g (1.14 lb)", dimension: "31 x 136.3 x 105 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/dcd210871b0cc46e6aa127dc67c5f29f.pdf",
          },
        },
        {
          model: "9015-8GT-I",
          description: "8x 10/100/1000 RJ45 — Managed Industrial Gigabit",
          image: ie_9015_8GT_I,
          features: ["Managed", "8-port", "Gigabit"],
          sourceUrl: detail(1618),
          details: {
            overview:
              "Managed Industrial Switch 8 พอร์ต Gigabit RJ45 — รองรับ Modbus TCP, Topology Map, Storm/Flow Control, QoS, QinQ และ 802.1X — ตัวเครื่อง Metal IP40 ทำงาน -40°C~75°C พร้อม Redundant Power และ Alarm Relay — Compact Form Factor เหมาะกับตู้ควบคุมพื้นที่จำกัด",
            highlights: [
              { title: "พอร์ตหลัก: 8x 10/100/1000 RJ45", desc: "เชื่อม PLC, HMI, Printer และอุปกรณ์อุตสาหกรรมในเครือข่ายเดียว" },
              { title: "Topology Map", desc: "ติดตามสถานะอุปกรณ์ในเครือข่ายแบบ Visual" },
              { title: "QinQ + 802.1X", desc: "VLAN Stacking + Port Authentication" },
              { title: "Modbus TCP", desc: "เชื่อม HMI / Legacy Devices ผ่าน Industrial Protocol โดยตรง" },
              { title: "Storm / Flow Control + QoS", desc: "จัดลำดับความสำคัญแพ็กเก็ตอุตสาหกรรม" },
              { title: "Metal IP40 + Operating -40°C~75°C", desc: "Redundant Power + Alarm Relay — Compact 50x116x100mm" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (RJ45)",
            ],
            power: { input: "Primary inputs: 24~48VDC, Redundant inputs: 24~48VDC", consumption: "Max. 10W (24VDC @ 0.35A)" },
            environment: { tempOperating: "-40°C~75°C (-40°F~167°F)", housing: "Metal (IP40 Protection)" },
            physical: { weight: "550 g (1.2 lb)", dimension: "50 x 116 x 100 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/41c174f359c97c4c1cea53f8ae320f37.pdf",
          },
        },
        {
          model: "9015-8GT2GS-I",
          description: "8x 10/100/1000 RJ45 + 2x FX/GbE SFP — Managed Industrial",
          image: ie_9015_8GT2GS_I,
          features: ["Managed", "Fiber", "10-port"],
          sourceUrl: detail(1620),
          details: {
            overview:
              "Managed Industrial Switch 8 พอร์ต Gigabit RJ45 + 2 พอร์ต Multi-rate 100FX/GbE SFP Uplink — รองรับ Long-distance Fiber, Modbus TCP, Topology Map, Storm/Flow Control, QoS, QinQ, 802.1X — ตัวเครื่อง Metal IP40 ทำงาน -40°C~75°C พร้อม Redundant Power และ Alarm Relay",
            highlights: [
              { title: "พอร์ตหลัก: 8x GbE RJ45 + 2x 100FX/GbE SFP", desc: "SFP Multi-rate รองรับทั้ง 100M และ 1G สำหรับ Fiber Uplink/Cascading" },
              { title: "Topology Map", desc: "ติดตามสถานะอุปกรณ์ third-party ผ่าน LLDP" },
              { title: "QinQ + 802.1X + STP/RSTP", desc: "VLAN Stacking + Port Authentication + Network Redundancy" },
              { title: "Modbus TCP", desc: "เชื่อม HMI / Legacy Devices ผ่าน Industrial Protocol" },
              { title: "EEE 802.3az + QoS", desc: "Energy Efficient Ethernet + Class of Service สำหรับ Mission-critical" },
              { title: "Metal IP40 + Operating -40°C~75°C", desc: "Redundant Power + Alarm Relay — Compact 50x116x100mm" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (RJ45)",
              "2 x 100FX/Gigabit SFP Slots (Multi-rate)",
            ],
            power: { input: "Primary inputs: 24~48VDC, Redundant inputs: 24~48VDC", consumption: "Max. 11W (24VDC @ 0.4A)" },
            environment: { tempOperating: "-40°C~75°C (-40°F~167°F)", housing: "Metal (IP40 Protection)" },
            physical: { weight: "550 g (1.2 lb)", dimension: "50 x 116 x 100 mm (DIN-Rail)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/cb9e6b5612e3e44cf2d5a6f1db83b0a4.pdf",
          },
        },
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
        { model: "IEN-9648M (NEMA TS2)", description: "8x GbE + 4x GbE SFP — Managed, NEMA TS2 Approval", image: ie_IEN_9648M_NEMA, features: ["NEMA TS2", "Managed", "Fiber"], sourceUrl: detail(1709) },
        { model: "9560-16GT4XS-I", description: "16x 10/100/1000 RJ45 + 4x 1G/10G SFP+ — Managed, NEMA TS2 Approval", image: ie_9560_16GT4XS_I, features: ["NEMA TS2", "Managed", "16-port", "10G SFP+"], sourceUrl: detail(1616) },
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
        { model: "7015-4U2T-T1L", description: "4x 10BASE-T1L SPE + 2x GbE — Managed Industrial SPE", image: ie_7015_4U2T_T1L, features: ["SPE", "10BASE-T1L", "Managed"], sourceUrl: detail(1682) },
        // (moved) 8015 Series ย้ายไปอยู่ Lite Managed sub-category — ไม่ใช่ SPE
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
        {
          model: "MEN-6412",
          description: "4x FX/GbE Combo RJ45/SFP + 4x FX/GbE SFP + 4x GbE SFP + Console — Managed Aggregation Switch",
          image: metro_MEN_6412,
          features: ["Managed", "Aggregation", "Fiber", "12-port"],
          sourceUrl: detail(68),
          details: {
            overview:
              "MEN-6412 เป็น Hardened L2+ Managed Aggregation Switch สำหรับ Service Provider, Multiple System Operator (MSO) และ Enterprise — มี 4 พอร์ต FX/GbE Combo RJ45/SFP uplink + 4 พอร์ต FX/GbE SFP + 4 พอร์ต GbE SFP downlink รองรับงาน FTTX และเชื่อมต่อ Fiber ระยะไกลในพื้นที่ห่างไกล มี RJ45 Console Port + USB Port สำหรับอัปเกรดเฟิร์มแวร์, บันทึก config และ log files พร้อม Device Lock ป้องกันการขโมย ติดตั้งได้ทั้งใน Indoor และ Outdoor Cabinet โดยไม่ต้องใช้แอร์ (Operating -20°C~60°C) เพื่อลดต้นทุนค่าไฟ รุ่น MEN-6412C รองรับ AC Power Input โดยตรง",
            highlights: [
              { title: "12 Fiber Ports รวม Combo + SFP", desc: "4x Combo RJ45/SFP + 4x FX/GbE SFP + 4x GbE SFP — Aggregation รวม Traffic ขึ้น Core" },
              { title: "Multi-rate FX/GbE Combo", desc: "เลือกใช้ 100FX หรือ 1000BASE Fiber/Copper ได้ในพอร์ตเดียว — ยืดหยุ่นสูง" },
              { title: "Console + USB Port", desc: "RJ45 Console สำหรับ CLI + USB สำหรับ Firmware/Config/Log files ลด downtime" },
              { title: "Device Lock Anti-Theft", desc: "ล็อกอุปกรณ์กับเครือข่ายเฉพาะ — ขโมยไปก็ตั้งค่าใหม่ไม่ได้" },
              { title: "Ring Redundancy ครบชุด", desc: "STP, RSTP, MSTP, Xpress Ring, ERPS — Recovery ระดับ ms" },
              { title: "Enterprise Security", desc: "ACL, DHCP Snooping, ARP Inspection, IEEE 802.1X, Port Security" },
              { title: "QoS + Bandwidth Management", desc: "จัดลำดับความสำคัญ Traffic, จัดสรร Bandwidth ให้งาน Mission-critical" },
              { title: "SNMP v1/v2c/v3 + RMON", desc: "Real-time Traffic Analysis และจัดการระยะไกล" },
              { title: "Hardened -20°C~60°C", desc: "ติดตั้งในตู้กลางแจ้งโดยไม่ต้องใช้แอร์ — ลดต้นทุนค่าไฟ" },
            ],
            ports: [
              "4 x 100FX/GbE Combo (RJ45/SFP)",
              "4 x 100FX/GbE SFP Slots",
              "4 x GbE SFP Slots",
              "1 x RJ45 Console Port",
              "1 x USB Port",
            ],
            ledPanel: "PWR1, PWR2, POST, ALM, 1000, LNK/ACT",
            power: {
              input: "DC Jack 15V/4A Adapter | DC Terminal Block 48V Dual | Battery Terminal 12V | AC Inlet 100~240V (รุ่น MEN-6412C)",
              consumption: "System: 18W (max)",
            },
            environment: {
              tempOperating: "-20°C ~ 60°C (LVD: -20°C ~ 50°C)",
              tempStorage: "-40°C ~ 70°C (-40°F ~ 158°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30)",
            },
            physical: { weight: "1.25 kg (2.75 lb)", dimension: "268 x 44 x 128 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/085cedea9c81271ea7ffbea32dd39571.pdf",
          },
        },
        {
          model: "6500-24GS4XS",
          description: "20x FX/GbE SFP + 4x FE/GbE Combo RJ45/SFP + 4x GbE/10G SFP+ + Console — L2+ Managed Aggregation",
          image: metro_6500_24GS4XS,
          features: ["L2+ Managed", "10G SFP+", "28-port", "Fiber"],
          sourceUrl: detail(188),
          details: {
            overview:
              "6500-24GS4XS เป็น L2+ Managed Aggregation Switch ระดับ Service Provider — 20 พอร์ต FX/GbE SFP downlink + 4 พอร์ต FE/GbE Combo RJ45/SFP + 4 พอร์ต Multi-rate 1G/10G SFP+ uplink รองรับงาน FTTH, Work-from-home, Video Streaming และ Gaming ที่ต้องการ Bandwidth สูง มี Xpress Ring (Recovery <50ms), ERPS, Dual Homing, LACP สำหรับ Redundancy พร้อม Cable Test และ DDMI ตรวจสอบสายและ SFP, Console RJ45 + USB 2.0, Digital Input 2 คู่ + Alarm Relay 24VDC/1A รองรับทั้ง AC 100~240V และ DC 48V (รุ่น -AB มี Battery Charge Function) ติดตั้ง Rack-mount 1U เคส Metal IP30",
            highlights: [
              { title: "Multi-rate 1G/10G SFP+ Uplink x4", desc: "เลือก 1G หรือ 10G ได้ในพอร์ตเดียว — ลด CapEx, ขยายได้ในอนาคต" },
              { title: "20x FX/GbE SFP Downlink", desc: "รวม Fiber Access จำนวนมากขึ้น Aggregation — เหมาะ ISP/MSO" },
              { title: "Xpress Ring <50ms Recovery", desc: "Ring Protocol เฉพาะของ Volktek — รองรับ Video/Data ความสำคัญสูง" },
              { title: "Ring Redundancy ครบชุด", desc: "ERPS, Dual Homing, LACP, RSTP/MSTP — เครือข่ายไม่ขาดตอน" },
              { title: "Cable Test + DDMI", desc: "ตรวจสาย Copper และวิเคราะห์ Optical SFP ระยะไกล" },
              { title: "AC + DC Redundant Power", desc: "AC 100~240V + DC 48V พร้อมกัน — รุ่น -AB มี Battery Charge" },
              { title: "Digital I/O + Alarm Relay", desc: "2 Digital Input (Dry Contact) + Alarm Relay 24VDC/1A" },
              { title: "Enterprise Security", desc: "ACL, DHCP Snooping, ARP, IEEE 802.1X, Port Security" },
              { title: "Console + USB 2.0", desc: "RJ45 Console + USB สำหรับ Firmware/Config/Log files" },
            ],
            ports: [
              "20 x 100/1000 SFP Slots",
              "4 x 100/1000 Combo Ports (RJ45/SFP)",
              "4 x 1G/10G SFP+ Slots",
              "1 x RJ45 Console Port",
              "1 x USB 2.0 Port",
              "2 x Digital Input (Dry Contact) + Alarm Relay",
            ],
            ledPanel: "PWR1, PWR2, ALM, POST, 100/1000, 10G, LNK/ACT",
            power: {
              input: "AC 100~240V 50~60Hz + DC 48V (Dual Power)",
              consumption: "30W (รุ่น -A-C) / 50W (รุ่น -AB-C with Battery Charge)",
            },
            environment: {
              tempOperating: "0°C ~ 60°C (32°F ~ 140°F)",
              tempStorage: "-20°C ~ 70°C (-4°F ~ 158°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30) — 2 Cooling Fans",
            },
            physical: { weight: "3,890 g (8.77 lb)", dimension: "440 x 44 x 284.7 mm (1U Rack-mount)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/beaa0fe39679b8e4910a99cac3367653.pdf",
          },
        },
      ],
    },
    {
      id: "metro-access",
      title: "1G / 10G Access",
      blurb: "Access Switch สำหรับ Metro Edge — เชื่อมต่อปลายทางเข้าเครือข่าย Service Provider",
      products: [
        {
          model: "MEN-3406",
          description: "4x 10/100/1000 RJ45 + 2x FX/GbE SFP — Managed Access Switch",
          image: metro_MEN_3406,
          features: ["Managed", "Access", "Fiber", "6-port"],
          sourceUrl: detail(175),
          details: {
            overview:
              "MEN-3406 เป็น Managed Access Switch ขนาดเล็กสำหรับงาน Broadband Indoor Office — 4 พอร์ต 10/100/1000 RJ45 downlink + 2 พอร์ต FX/GbE SFP uplink รองรับ Triple-play (TV/Internet/Phone) แบบ Low Latency มี QoS จัดการ Bandwidth, Storm Control, Surge Protection (EMI/ESD/Over-voltage/Reverse Polarity) ออกแบบ Fanless เงียบและไร้ฝุ่นสะสม เหมาะติดตั้งใน Network Room/Cabinet มี Web GUI + CLI สำหรับจัดการ พร้อม Battery Backup ขนานกับ DC Jack (รุ่น MEN-3406B) เคส Metal IP30 ติดตั้ง DIN-Rail Operating 0°C~60°C",
            highlights: [
              { title: "4x GbE + 2x FX/GbE SFP", desc: "เชื่อมต่อ Office พร้อม Fiber Uplink ระยะไกล/Cascading" },
              { title: "Triple-play Ready", desc: "QoS จัดสรร Bandwidth สำหรับ TV, Internet, Phone แบบ Low Latency" },
              { title: "Fanless Silent Operation", desc: "ไม่มีพัดลม — เงียบ ไม่มีฝุ่นสะสม ลด Maintenance" },
              { title: "Battery Backup Option", desc: "รุ่น MEN-3406B มี Battery Charge — ทำงานต่อระหว่างไฟตก" },
              { title: "Surge & ESD Protection", desc: "ทน EMI/ESD/Power Surge/Over-voltage/Reverse Polarity" },
              { title: "Storm Control", desc: "จำกัด Broadcast/Multicast/Unknown Unicast traffic ป้องกัน LAN ล่ม" },
              { title: "SNMP v1/v2c/v3 + RMON", desc: "Real-time Traffic Analysis และจัดการระยะไกล" },
              { title: "EEE 802.3az", desc: "Energy Efficient Ethernet — ประหยัดพลังงาน" },
              { title: "DIN-Rail Mount IP30", desc: "เคส Metal เหมาะกับตู้ติดตั้ง" },
            ],
            ports: [
              "4 x 10/100/1000BASE-T (RJ45)",
              "2 x 100FX/GbE SFP Slots",
            ],
            ledPanel: "PWR, POST, 1000, LNK/ACT, SFP",
            power: {
              input: "MEN-3406: 12VDC/1A Adapter | MEN-3406B: 15VDC/2A + 12V Battery Backup (DC Jack)",
              consumption: "System: 6W",
            },
            environment: {
              tempOperating: "0°C ~ 60°C (32°F ~ 140°F)",
              tempStorage: "-20°C ~ 70°C (-4°F ~ 158°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30) — Fanless",
            },
            physical: { weight: "529 g (1.17 lb)", dimension: "50 x 115.8 x 99.6 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/8a975d29b32eebc54939397777fb2333.pdf",
          },
        },
        {
          model: "MEN-3410",
          description: "8x 10/100/1000 RJ45 + 2x FX/GbE SFP + Console — Managed Access Switch",
          image: metro_MEN_3410,
          features: ["Managed", "Access", "Fiber", "10-port"],
          sourceUrl: detail(89),
          details: {
            overview:
              "MEN-3410 เป็น Managed Access Switch 8 พอร์ต 10/100/1000 RJ45 downlink + 2 พอร์ต FX/GbE SFP uplink + 1 พอร์ต RJ45 Console สำหรับงาน Indoor Broadband Office — รองรับ Triple-play (TV/Internet/Phone) แบบ Low Latency และเข้ากันได้กับอุปกรณ์ของผู้ผลิตอื่น มี QoS, ACL, DHCP Snooping, ARP Inspection, IEEE 802.1X, Port Security, Industrial Ring (Recovery ระดับ ms) ออกแบบ Fanless เงียบไร้ฝุ่น พร้อม Redundant Power AC + DC Adapter + 12V Battery Backup เลือกได้หลายรุ่นย่อย (Internal AC/DC, Battery Charge) เคส Metal IP30 ติดตั้ง Rack-mount Operating 0°C~50°C",
            highlights: [
              { title: "8x GbE + 2x FX/GbE SFP + Console", desc: "เชื่อมต่อ Office จำนวนมากพร้อม Fiber Uplink และ CLI Management" },
              { title: "Redundant Power (AC + DC + Battery)", desc: "AC 100~240V หรือ 15V Adapter พร้อม 12V Battery Backup" },
              { title: "Industrial Ring Protocol", desc: "Recovery <50ms รองรับงาน Mission-critical" },
              { title: "Enterprise Security", desc: "ACL, DHCP Snooping, ARP Inspection, IEEE 802.1X, Port Security" },
              { title: "QoS + Bandwidth Management", desc: "จัดสรร Bandwidth ให้ Application สำคัญ" },
              { title: "SNMP v1/v2c/v3 + RMON", desc: "Real-time Traffic Analysis และจัดการระยะไกล" },
              { title: "Fanless Silent Operation", desc: "ไม่มีพัดลม — เงียบ ไม่มีฝุ่นสะสม" },
              { title: "EEE 802.3az + Link Aggregation", desc: "ประหยัดพลังงาน + รวม Bandwidth ได้" },
              { title: "Multiple SKU Options", desc: "MEN-3410/B/D/AB + MEN-3510/B — เลือก AC/DC/Battery ตามงาน" },
            ],
            ports: [
              "8 x 10/100/1000BASE-T (RJ45)",
              "2 x 100FX/GbE SFP Slots",
              "1 x RJ45 Console Port",
            ],
            ledPanel: "PWR, ALM, POST, 1000, LNK/ACT",
            power: {
              input: "Primary: AC 100~240V 50~60Hz หรือ 15VDC Adapter + Redundant: 12V Battery",
              consumption: "System: 10W",
            },
            environment: {
              tempOperating: "0°C ~ 50°C (32°F ~ 122°F)",
              tempStorage: "-20°C ~ 70°C (-4°F ~ 158°F)",
              humidity: "10 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30) — Fanless",
            },
            physical: { weight: "1.17 kg (2.58 lb)", dimension: "268 x 44 x 128 mm (1U Rack-mount)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/14ff9bcb42f313f1d6f7ff8a37cd7e2c.pdf",
          },
        },
        {
          model: "5100-24GT2GS",
          description: "24x 10/100/1000 RJ45 + 2x FX/GbE SFP + Console — Managed Access Switch",
          image: metro_5100_24GT2GS,
          features: ["Managed", "24-port", "Fiber"],
          sourceUrl: detail(1141),
          details: {
            overview:
              "5100-24GT2GS เป็น High Port Density Managed Access Switch 24 พอร์ต 10/100/1000 RJ45 + 2 พอร์ต FX/GbE Dual-rate SFP uplink + Console — ออกแบบสำหรับ Service Provider ที่มี Subscriber จำนวนมาก ARPU สูง รองรับ Switching Capacity 52Gbps Non-blocking, IGMP Snooping + MVR สำหรับ IPTV Multicast, Layer 2-4 ACL, DHCP Snooping, ARP Inspection, IEEE 802.1X, Port Security, MAC/Protocol-based VLAN + Q-in-Q (VLAN Stacking) และ Ring Redundancy (Dual Homing, LACP, RSTP) ออกแบบ Fanless มีให้เลือกทั้ง AC (รุ่น -A-C) และ DC -40°C~70°C Industrial Grade (รุ่น -D-I) เคส Metal IP30 ติดตั้ง 19\" Rack 1U",
            highlights: [
              { title: "24x GbE + 2x FX/GbE Dual-rate SFP", desc: "High Port Density สำหรับ Subscriber จำนวนมาก + Fiber Uplink" },
              { title: "52Gbps Non-blocking Switching", desc: "ลด Bottleneck — เพิ่ม Bandwidth ให้ Service Provider" },
              { title: "IPTV Multicast (IGMP Snooping + MVR)", desc: "ส่ง Multicast Stream ข้าม VLAN ใน L2 ลด Bandwidth ที่ใช้ซ้ำ" },
              { title: "Q-in-Q VLAN Stacking + MAC/Protocol VLAN", desc: "ISP จัดการ Subscriber แบบละเอียด มี Security เพิ่ม" },
              { title: "Layer 2-4 ACL", desc: "กรอง Packet ตาม TCP/UDP Port, Source/Destination IP" },
              { title: "Robust Security", desc: "DHCP Snooping, ARP Inspection, IEEE 802.1X, Port Security" },
              { title: "Ring Redundancy", desc: "Dual Homing, LACP, RSTP — เครือข่ายไม่ขาดตอน" },
              { title: "Dual Power Options", desc: "รุ่น -A-C: AC 100~240V | รุ่น -D-I: DC 48~57V Industrial -40°C~70°C" },
              { title: "Fanless 1U Rack-mount", desc: "เงียบ ไม่มีฝุ่นสะสม ลด Maintenance — เคส Metal IP30" },
            ],
            ports: [
              "24 x 10/100/1000BASE-T (RJ45)",
              "2 x FX/GbE SFP Slots (Dual-rate)",
              "1 x Console Port",
            ],
            power: {
              input: "5100-24GT2GS-A-C: AC 100~240V 50/60Hz | 5100-24GT2GS-D-I: DC 48~57V",
              consumption: "System: 20W",
            },
            environment: {
              tempOperating: "-A-C: 0°C ~ 50°C | -D-I: -40°C ~ 70°C (Industrial)",
              tempStorage: "-A-C: -20°C ~ 70°C | -D-I: -40°C ~ 85°C",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30) — Fanless",
            },
            physical: { weight: "4,000 g (8.8 lb)", dimension: "440 x 44 x 310 mm (19\" 1U Rack-mount)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/14ab453c520e78c48b74fe3e33eb3fcf.pdf",
          },
        },
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
        {
          model: "IMC-661P",
          description: "1x 10/100/1000 PoE+ + 1x FX/GbE SFP — Industrial Media Converter",
          image: mc_IMC_661P,
          features: ["PoE+", "Gigabit", "SFP"],
          sourceUrl: detail(1687),
          details: {
            overview:
              "IMC-661P เป็น Industrial Media Converter รุ่น Wide-Temp -40°C~75°C สำหรับแปลง Fiber → 10/100/1000 PoE+ ใช้เชื่อมต่อ Powered Device (กล้อง IP, Wireless AP, IoT) ที่ติดตั้งห่างไกลผ่าน Fiber พอร์ต RJ45 Multi-rate Auto-detect ความเร็วได้เอง พร้อม SFP slot รองรับโมดูลหลายระยะทาง — มี LFS (Link Fault Signaling) ตรวจ Optical Signal และ Faulty Link, Line LoopBack สำหรับ Diagnostic, Flow Control เคส Aluminum IP30 ระบายความร้อนสูง ทนการสั่นสะเทือน/Shock/Free Fall/EMI พร้อม Redundant Power 48~57VDC (DC-Jack + Terminal Block) และ Alarm Relay 1A@24VDC แจ้งเตือนเมื่อไฟตก เหมาะกับงาน Outdoor/Industrial extreme",
            highlights: [
              { title: "1x GbE PoE+ + 1x FX/GbE SFP", desc: "แปลง Fiber → Copper พร้อมจ่ายไฟ PoE+ 30W ให้ PD 1 ตัว — Plug & Play" },
              { title: "Wide-Temp -40°C~75°C", desc: "Industrial-grade Aluminum IP30 ระบายความร้อนสูง ทำงาน Outdoor extreme" },
              { title: "LFS (Link Fault Signaling)", desc: "ตรวจสอบ Optical Signal Strength + Faulty Link ทั้ง Copper และ Fiber" },
              { title: "Line LoopBack Diagnostic", desc: "วินิจฉัยปัญหา Link ระยะไกลโดยไม่ต้องไปหน้างาน" },
              { title: "Redundant Power 48~57VDC", desc: "DC-Jack + 6-pin Terminal Block พร้อม Power Voltage Drop Alarm" },
              { title: "Alarm Relay 1A@24VDC", desc: "แจ้งเตือนเมื่อ Primary/Redundant Power ขัดข้อง" },
              { title: "ESD + Surge Protection", desc: "ทนสัญญาณรบกวนแม่เหล็กไฟฟ้าและไฟกระชาก" },
              { title: "EEE 802.3az Energy Efficient", desc: "ประหยัดพลังงานเมื่อไม่มี Traffic" },
              { title: "DIN-Rail / Wall Mount", desc: "ติดตั้งได้สองแบบ — เคสบาง 49.6mm" },
            ],
            ports: ["1 x 10/100/1000BASE-T (PoE RJ45)", "1 x 100FX/GbE SFP Slot"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: {
              input: "Primary: 48~57VDC (4-pin DC-Jack) + Redundant: 48~57VDC (6-pin Terminal Block)",
              consumption: "System: 7W | with 1x PoE+ fully loaded: 40W",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "10 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "450 g (1 lb)", dimension: "49.6 x 120 x 100 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/b41551d06ac4bba52f30d102f9e4d6c8.pdf",
          },
        },
        {
          model: "IMC-561P",
          description: "1x 10/100/1000 PoE+ + 1x FX/GbE SFP — Hardened Media Converter",
          image: mc_IMC_561P,
          features: ["PoE+", "Hardened", "SFP"],
          sourceUrl: detail(1659),
          details: {
            overview:
              "IMC-561P เป็น Hardened Media Converter แปลง Fiber → 10/100/1000 PoE+ สำหรับงาน Indoor/In-cabinet ที่ต้องการจ่ายไฟ PoE+ 30W ให้กล้อง IP/AP ผ่าน Fiber ระยะไกล รองรับ RJ45 Multi-rate และ FX/GbE SFP Slot พร้อม LFS, Line LoopBack, Flow Control เคส Metal IP30 ระบายความร้อนสูง — มี DIP Switch ตั้งค่า Power Voltage Drop Alarm ของ Primary/Redundant Power, Alarm Relay 1A@24VDC, Operating -10°C~60°C เหมาะกับงานในตู้ Network Cabinet ติดตั้ง DIN-Rail",
            highlights: [
              { title: "1x GbE PoE+ + 1x FX/GbE SFP", desc: "แปลง Fiber → Copper PoE+ 30W ให้ PD 1 ตัว — Plug & Play" },
              { title: "Hardened -10°C~60°C", desc: "เคส Metal IP30 — เหมาะกับ Indoor/In-cabinet" },
              { title: "DIP Switch Voltage Drop Alarm", desc: "ตั้งค่าแจ้งเตือนเมื่อ Primary/Redundant Power ตก" },
              { title: "Redundant Power 48~57VDC", desc: "DC-Jack + 6-pin Terminal Block — ป้องกัน Polarity ผิด" },
              { title: "LFS + Line LoopBack", desc: "ตรวจ Optical Signal และ Diagnostic Link ระยะไกล" },
              { title: "ESD + Surge Protection", desc: "ทนไฟกระชากและสัญญาณรบกวน" },
              { title: "EEE 802.3az", desc: "Energy Efficient Ethernet — ประหยัดพลังงาน" },
              { title: "Alarm Relay 1A@24VDC", desc: "แจ้งเตือนทันทีเมื่อ Power ขัดข้อง" },
              { title: "DIN-Rail Mount", desc: "ติดตั้งง่าย เคสกะทัดรัด 50 x 116 x 100 mm" },
            ],
            ports: ["1 x 10/100/1000BASE-T (PoE RJ45)", "1 x 100FX/GbE SFP Slot"],
            ledPanel: "PWR, RPS, ALM, SFP, PoE, 1000, LNK/ACT",
            power: {
              input: "Primary: 48~57VDC (4-pin DC-Jack) + Redundant: 48~57VDC (6-pin Terminal Block)",
              consumption: "System: 7W | with 1x PoE+ fully loaded: 40W",
            },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30 Protection)",
            },
            physical: { weight: "385 g (0.85 lb)", dimension: "50 x 116 x 100 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/3237d964cbe4873b8dd24f4383066d3b.pdf",
          },
        },
        {
          model: "IMC-563P",
          description: "1x 100/1000 PoE+ + 1x FX/GbE SFP — Industrial Mini Media Converter",
          image: mc_IMC_563P,
          features: ["PoE+", "Mini", "SFP"],
          sourceUrl: detail(1662),
          details: {
            overview:
              "IMC-563P เป็น Industrial Mini Media Converter ขนาดฝ่ามือ (60.5 x 42.5 x 50 mm) แปลง Fiber → 100/1000 PoE+ ออกแบบให้ใส่ใน Outdoor IP Camera Enclosure (Bullet Camera) หรือพื้นที่จำกัด พร้อม Adapter ยึดติดกล้อง — มี Auto-MDI/MDIX และ Auto-negotiation ใช้งานได้ทันทีโดยไม่ต้องตั้งค่า, Surge + ESD Protection สำหรับงาน Outdoor extreme เคส Metal IP30 ระบายความร้อนสูง รับรอง UL Operating -40°C~75°C รองรับ Power Input 2 แบบ (DC-Jack 48VDC + Terminal Block 48~57VDC)",
            highlights: [
              { title: "Mini Size 60.5 x 42.5 x 50 mm", desc: "ใส่ใน Bullet Camera Enclosure ได้ — เหมาะกับพื้นที่จำกัด" },
              { title: "1x GbE PoE+ + 1x FX/GbE SFP", desc: "แปลง Fiber → 100/1000 PoE+ จ่ายไฟ <36W ให้ Camera/AP" },
              { title: "Wide-Temp -40°C~75°C UL", desc: "เคส Metal IP30 — รับรอง UL สำหรับงาน Outdoor extreme" },
              { title: "Auto-MDI/MDIX + Auto-negotiation", desc: "Plug & Play — ไม่ต้องตั้งค่า ใช้งานได้ทันที" },
              { title: "Surge + ESD Protection", desc: "ทนไฟกระชากและ EMI ระดับสูงในงานกลางแจ้ง" },
              { title: "Dual Power Input", desc: "Terminal Block 48~57VDC + DC-Jack 48VDC ติดตั้งได้ยืดหยุ่น" },
              { title: "DIN-Rail / Wall-Mount", desc: "ติดตั้งง่าย พร้อม Adapter ยึดติด Bullet Camera (option)" },
              { title: "Lightweight 185g", desc: "เบามาก เหมาะกับติดตั้งบนเสา/กล้อง" },
            ],
            ports: ["1 x 100/1000BASE-T (PoE RJ45)", "1 x FX/GbE SFP"],
            ledPanel: "PWR, Fiber, RJ45, ALM, L/A, 1000, 100",
            power: {
              input: "48~57VDC via Terminal Block | 48VDC via DC Jack",
              consumption: "<36W",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30 Protection) — UL Certified",
            },
            physical: { weight: "185 g (0.41 lb)", dimension: "60.5 x 42.5 x 50 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/9d8698b3c047172ac4ecfcb26a3cbefb.pdf",
          },
        },
      ],
    },
    {
      id: "mc-copper-fiber",
      title: "Copper to Fiber",
      blurb: "Copper ↔ Fiber Converter — แปลงสัญญาณ RJ45 เป็น SFP/Fiber สำหรับขยายระยะทาง",
      products: [
        {
          model: "IMC-661",
          description: "1x 10/100/1000 RJ45 + 1x FX/GbE SFP — Industrial Media Converter",
          image: mc_IMC_661,
          features: ["Industrial", "Gigabit", "SFP"],
          sourceUrl: detail(1663),
          details: {
            overview:
              "IMC-661 เป็น Industrial Media Converter รุ่น Wide-Temp -40°C~75°C แปลงสัญญาณ Copper (RJ45 10/100/1000) ↔ Fiber (FX/GbE SFP) สำหรับงานเชื่อมต่อ Network Center ระยะไกลด้วย Fiber พอร์ต RJ45 Multi-rate Auto-detect ความเร็ว เข้ากันได้กับอุปกรณ์ของผู้ผลิตอื่น พร้อม LFS (Link Fault Signaling) ตรวจสอบ Optical Signal และ Faulty Link, Line LoopBack สำหรับ Diagnostic, Flow Control เคส Aluminum IP30 ระบายความร้อนสูง ทนการสั่นสะเทือน/Shock/Free Fall/EMI พร้อม Redundant Power 20~57VDC (DC-Jack + Terminal Block), Polarity Protection, DIP Switch ตั้ง Voltage Drop Alarm และ Alarm Relay 1A@24VDC แจ้งเตือนเมื่อไฟตก เหมาะ Outdoor/Industrial extreme",
            highlights: [
              { title: "1x GbE RJ45 + 1x FX/GbE SFP", desc: "แปลง Copper ↔ Fiber Multi-rate รองรับ 100M/1G — เข้ากันได้กับอุปกรณ์ทุกค่าย" },
              { title: "Wide-Temp -40°C~75°C", desc: "Industrial-grade Aluminum IP30 ระบายความร้อนสูง สำหรับงาน Outdoor extreme" },
              { title: "Wide Voltage 20~57VDC", desc: "Redundant Power: DC-Jack + 6-pin Terminal Block — ครอบคลุม 24V/48V" },
              { title: "DIP Switch Voltage Drop Alarm", desc: "ตั้งค่าแจ้งเตือนเมื่อ Primary/Redundant Power ตก" },
              { title: "Alarm Relay 1A@24VDC", desc: "แจ้งเตือนทันทีเมื่อ Power ขัดข้อง — Mission-critical ready" },
              { title: "LFS + Line LoopBack", desc: "ตรวจ Optical Signal + Diagnostic Link จากระยะไกล" },
              { title: "ESD + Surge Protection", desc: "ทนสัญญาณรบกวนแม่เหล็กไฟฟ้า ไฟกระชาก Reverse Polarity" },
              { title: "EEE 802.3az Energy Efficient", desc: "ประหยัดพลังงานเมื่อไม่มี Traffic" },
              { title: "DIN-Rail Mount", desc: "ติดตั้งง่าย เคสบาง 49.6mm — Power Consumption เพียง 6W" },
            ],
            ports: ["1 x 10/100/1000BASE-T (RJ45)", "1 x 100FX/GbE SFP Slot"],
            ledPanel: "PWR, RPS, ALM, SFP, 1000, LNK/ACT",
            power: {
              input: "Primary: 20~57VDC (4-pin DC-Jack) + Redundant: 20~57VDC (6-pin Terminal Block)",
              consumption: "6W",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "486 g (1.07 lb)", dimension: "49.6 x 120 x 100 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/dbac0711dc2c73428d76367cc694a5d7.pdf",
          },
        },
        {
          model: "IMC-561",
          description: "1x 10/100/1000 RJ45 + 1x FX/GbE SFP — Hardened Media Converter",
          image: mc_IMC_561,
          features: ["Hardened", "Gigabit", "SFP"],
          sourceUrl: detail(1660),
          details: {
            overview:
              "IMC-561 เป็น Hardened Media Converter แปลง Copper (RJ45 10/100/1000) ↔ Fiber (FX/GbE SFP) สำหรับงาน Indoor/In-cabinet Operating -10°C~60°C เคส Metal IP30 ระบายความร้อนสูง รองรับ Multi-rate RJ45 Auto-detect — มี LFS, Line LoopBack, Flow Control, DIP Switch ตั้งค่า Power Voltage Drop Alarm พร้อม Redundant Power 20~57VDC (6-pin Terminal Block) มี Polarity Protection, Alarm Relay 1A@24VDC, ESD/Surge Protection ป้องกัน EMI/ไฟกระชาก/Reverse Polarity เหมาะกับงานในตู้ Network Cabinet ติดตั้ง DIN-Rail หรือ Wall Mount",
            highlights: [
              { title: "1x GbE RJ45 + 1x FX/GbE SFP", desc: "Multi-rate RJ45 + SFP — เข้ากันได้กับอุปกรณ์หลายค่าย" },
              { title: "Hardened -10°C~60°C", desc: "เคส Metal IP30 — เหมาะกับ Indoor/In-cabinet" },
              { title: "Wide Voltage 20~57VDC Redundant", desc: "6-pin Terminal Block 2 input — ครอบคลุม 24V/48V พร้อม Polarity Protection" },
              { title: "DIP Switch Voltage Drop Alarm", desc: "ตั้งค่าแจ้งเตือน Primary/Redundant Power ตก" },
              { title: "Alarm Relay 1A@24VDC", desc: "แจ้งเตือนทันทีเมื่อ Power ขัดข้อง" },
              { title: "LFS + Line LoopBack", desc: "ตรวจ Optical Signal + Diagnostic Link" },
              { title: "ESD + Surge Protection", desc: "ทน EMI ไฟกระชาก Over-voltage Over-current" },
              { title: "EEE 802.3az", desc: "Energy Efficient Ethernet — ประหยัดพลังงาน" },
              { title: "DIN-Rail / Wall Mount", desc: "ติดตั้งได้ 2 แบบ Power Consumption เพียง 5.5W" },
            ],
            ports: ["1 x 10/100/1000BASE-T (RJ45)", "1 x 100FX/GbE SFP Slot"],
            ledPanel: "PWR, RPS, ALM, SFP, 1000, LNK/ACT",
            power: {
              input: "Primary + Redundant: 20~57VDC via 6-pin Terminal Block",
              consumption: "5.5W",
            },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30 Protection)",
            },
            physical: { weight: "380 g (0.84 lb)", dimension: "50 x 116 x 100 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/386bf7cefc2f3c9f51b1fd0727e19a3d.pdf",
          },
        },
        {
          model: "IMC-563",
          description: "1x 100/1000 RJ45 + 1x FX/GbE SFP — Industrial Mini Media Converter",
          image: mc_IMC_563,
          features: ["Industrial", "Mini", "SFP"],
          sourceUrl: detail(1661),
          details: {
            overview:
              "IMC-563 เป็น Industrial Mini Media Converter ขนาดฝ่ามือ (60.5 x 42.5 x 50 mm) แปลง Copper (RJ45 100/1000) ↔ Fiber (FX/GbE SFP) สำหรับใส่ใน Outdoor IP Camera Enclosure (Bullet Camera) หรือพื้นที่จำกัด พร้อม Adapter ยึดติดกล้อง — มี Auto-MDI/MDIX และ Auto-negotiation ใช้งานทันทีโดยไม่ต้องตั้งค่า, Multi-rate SFP slot รองรับ 100/1000 Mbps เคส Metal IP30 ระบายความร้อนสูง รับรอง UL Operating -40°C~75°C รองรับ Wide Voltage 12~57VDC ติดตั้งได้ทั้ง Terminal Block และ DC-Jack",
            highlights: [
              { title: "Mini Size 60.5 x 42.5 x 50 mm", desc: "ใส่ใน Bullet Camera Enclosure ได้ — เหมาะกับพื้นที่จำกัด" },
              { title: "1x GbE RJ45 + 1x FX/GbE SFP", desc: "Multi-rate SFP รองรับ 100/1000 Mbps — Migration Fast → Gigabit ได้" },
              { title: "Wide-Temp -40°C~75°C UL", desc: "เคส Metal IP30 — รับรอง UL สำหรับงาน Outdoor extreme" },
              { title: "Auto-MDI/MDIX + Auto-negotiation", desc: "Plug & Play — ไม่ต้องตั้งค่า ใช้งานได้ทันที" },
              { title: "Wide Voltage 12~57VDC", desc: "Terminal Block 12~57VDC + DC-Jack 12VDC — ติดตั้งได้ยืดหยุ่น" },
              { title: "Surge + ESD Protection", desc: "ทนไฟกระชากและ EMI ระดับสูงในงานกลางแจ้ง" },
              { title: "DIN-Rail / Wall-Mount", desc: "ติดตั้งง่าย พร้อม Adapter ยึดติด Bullet Camera (option)" },
              { title: "Lightweight 185g, 6W", desc: "เบามาก ประหยัดพลังงาน เหมาะกับติดตั้งบนเสา/กล้อง" },
            ],
            ports: ["1 x 100/1000BASE-T (RJ45)", "1 x 100FX/GbE SFP Slot"],
            ledPanel: "PWR, Fiber, RJ45, ALM, L/A, 1000, 100",
            power: {
              input: "12~57VDC via Terminal Block | 12VDC via DC Jack",
              consumption: "<6W",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30 Protection) — UL Certified",
            },
            physical: { weight: "185 g (0.41 lb)", dimension: "60.5 x 42.5 x 50 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/243643499a89307fcd210ddfacc648c5.pdf",
          },
        },
        {
          model: "HMC-652E",
          description: "1x 10/100 RJ45 + 1x FX Fiber — Hardened Media Converter",
          image: mc_HMC_652E,
          features: ["Hardened", "Fast Ethernet", "Fiber"],
          sourceUrl: detail(1664),
          details: {
            overview:
              "HMC-652E เป็น Hardened Media Converter แปลง Copper (RJ45 10/100) ↔ Fiber (100BASE-FX) ราคาประหยัด ออกแบบ Compact Slim เหมาะกับงาน Mission-critical ที่มีพื้นที่จำกัด — รองรับ Auto-MDI/MDI-X, Auto-negotiation NWay บน RJ45, LFS (Link Fault Signaling) ตรวจ Optical Signal + Faulty Link, Local + Remote Loopback สำหรับ Diagnostic เคส Aluminum IP30 พร้อม DC-Jack แบบ Locking ป้องกันสายหลุดจากการสั่น Operating -10°C~60°C ติดตั้ง DIN-Rail หรือ Wall-Mount มีให้เลือก 3 รุ่นย่อย: Multi-mode 2km (ST/SC) และ Single-mode 30km (SC)",
            highlights: [
              { title: "1x 10/100 RJ45 + 1x 100FX Fiber", desc: "แปลง Copper ↔ Fiber 100Mbps — Transparent ไม่กระทบ Network Performance" },
              { title: "Hardened -10°C~60°C IP30", desc: "เคส Aluminum ทนทาน — เหมาะกับงาน Industrial/Mission-critical" },
              { title: "Auto-MDI/MDIX + Auto-negotiation", desc: "Plug & Play — ใช้งานได้ทันทีโดยไม่ต้องตั้งค่า" },
              { title: "LFS Link Fault Signaling", desc: "ตรวจ Optical Signal + Faulty Link ทั้ง Copper และ Fiber" },
              { title: "Local + Remote Loopback", desc: "ทดสอบและ Diagnose Link ได้ทั้งฝั่งใกล้และไกล" },
              { title: "DIP Switch LFS Toggle", desc: "เปิด/ปิด LFS ได้ง่ายๆ ผ่าน DIP Switch" },
              { title: "Locking DC Jack", desc: "ป้องกันสายไฟหลุดจากการสั่นสะเทือน" },
              { title: "Wall-Mount / DIN-Rail", desc: "ติดตั้งได้ 2 แบบ — Compact 73.8 x 109.2 x 27.4 mm" },
              { title: "3 รุ่นย่อย", desc: "Multi-mode 2km (ST/SC) + Single-mode 30km (SC)" },
            ],
            ports: ["1 x 10/100BASE-TX (RJ45)", "1 x 100BASE-FX (SC/ST)"],
            power: {
              input: "12VDC/1.5A via External Power Adapter",
              consumption: "1.8W",
            },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "158 g (0.35 lb)", dimension: "73.8 x 109.2 x 27.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/efd44d63e1530d29b424dfc118d36353.pdf",
          },
        },
        {
          model: "HMC-672E",
          description: "1x 10/100/1000 RJ45 + 1x FX/GbE Fiber — Hardened Media Converter",
          image: mc_HMC_672E,
          features: ["Hardened", "Gigabit", "Fiber"],
          sourceUrl: detail(1665),
          details: {
            overview:
              "HMC-672E เป็น Hardened Media Converter แปลง Copper (RJ45 10/100/1000) ↔ Fiber (100FX/1000Base-X) ราคาประหยัด รองรับ Auto-MDI/MDI-X, Auto-negotiation NWay บน RJ45 — Transparent Conversion ไม่กระทบ Network Performance พร้อม LFS, Local + Remote Loopback สำหรับ Diagnostic เคส Aluminum IP30 พร้อม DC-Jack แบบ Locking, DIP Switch 4 ตัว (LFS, LLB, RLB, SFP Speed) Operating -10°C~60°C ติดตั้ง DIN-Rail หรือ Wall-Mount เลือกได้ทั้งรุ่น SFP (HMC-672E + GBM-104/123) และรุ่นมี Fiber ติดมา (HMC-672E-MC 500m, HMC-672E-SC 10km)",
            highlights: [
              { title: "1x GbE RJ45 + 1x FX/GbE Fiber/SFP", desc: "แปลง Copper ↔ Fiber 100M/1G — รองรับ SFP module หลายระยะ" },
              { title: "Hardened -10°C~60°C IP30", desc: "เคส Aluminum ทนทาน — เหมาะ Industrial/Mission-critical" },
              { title: "Auto-MDI/MDIX + Auto-negotiation", desc: "Plug & Play — ใช้งานได้ทันที" },
              { title: "LFS Link Fault Signaling", desc: "ตรวจ Optical Signal + Faulty Link ทั้ง Copper และ Fiber" },
              { title: "Local + Remote Loopback", desc: "DIP Switch LLB/RLB สำหรับ Diagnostic Link" },
              { title: "SFP Speed DIP Switch", desc: "สลับ SFP ระหว่าง 100M และ 1G ได้ง่ายๆ" },
              { title: "Locking DC Jack", desc: "ป้องกันสายไฟหลุดจากการสั่นสะเทือน" },
              { title: "Wall-Mount / DIN-Rail", desc: "ติดตั้งได้ 2 แบบ — Compact 73.8 x 109.2 x 28.4 mm" },
              { title: "เลือก SFP หรือ Fiber Built-in", desc: "Fiber 500m (MC) / 10km (SC) หรือใส่ SFP module เอง" },
            ],
            ports: ["1 x 10/100/1000BASE-T (RJ45)", "1 x 100FX/1000BASE-X (SC/ST)"],
            ledPanel: "PWR, Fiber (1000, LNK/ACT), RJ45 (1000, LNK/ACT), ALM",
            power: {
              input: "12VDC/1A via External Power Adapter",
              consumption: "1.8W",
            },
            environment: {
              tempOperating: "-10°C ~ 60°C (14°F ~ 140°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "158 g (0.35 lb)", dimension: "73.8 x 109.2 x 28.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/8c228f9c0757de1666313612dddd6ea3.pdf",
          },
        },
        {
          model: "NXF-742E",
          description: "1x 10/100 RJ45 + 1x 100FX Fiber — Media Converter",
          image: mc_NXF_742E,
          features: ["Fast Ethernet", "Fiber"],
          sourceUrl: detail(1641),
          details: {
            overview:
              "NXF-742E เป็น Commercial Media Converter แปลง Copper (RJ45 10/100) ↔ Fiber (100FX) สำหรับงาน Office/Commercial ราคาประหยัด — Transparent Conversion ไม่กระทบ Network Performance รองรับ Auto-MDI/MDI-X, Auto-negotiation NWay บน RJ45, LFS, Remote Loopback (RLB) เคส Aluminum IP30 ติดตั้ง Wall-Mount, DIN-Rail (Optional) หรือ Chassis Compatible Operating 0°C~50°C มี DIP Switch 7 ตัวควบคุม NWay/Duplex/Speed/LFS/RLB มีให้เลือกหลายรุ่นย่อย: Multi-mode 2km (ST/SC), Single-mode 30/40/60/100km (SC), Single Fiber Bi-Di 20/40km (TS/RS)",
            highlights: [
              { title: "1x 10/100 RJ45 + 1x 100FX Fiber", desc: "แปลง Copper ↔ Fiber 100Mbps — Transparent ไม่กระทบ Performance" },
              { title: "Auto-MDI/MDIX + NWay Auto-negotiation", desc: "Plug & Play ใช้งานได้ทันที" },
              { title: "LFS + Remote Loopback", desc: "ตรวจ Optical Signal + Diagnose Link จากระยะไกล" },
              { title: "7-DIP Switch Configuration", desc: "ควบคุม NWay/TX DPX/TX SPD/FX DPX/LFS/RLB ได้จากด้านนอก" },
              { title: "Aluminum IP30 Casing", desc: "ทนทาน — เคสบาง 73.8 x 109.2 x 23.4 mm" },
              { title: "Wall-Mount / DIN-Rail / Chassis", desc: "ติดตั้งได้ 3 แบบ — Chassis-compatible สำหรับ in-rack" },
              { title: "Lightweight 138g, 1.92W", desc: "เบามาก ประหยัดพลังงาน" },
              { title: "10 รุ่นย่อยให้เลือก", desc: "MM 2km / SM 30/40/60/100km / Bi-Di 20/40km — เลือกระยะตามงาน" },
            ],
            ports: ["1 x 10/100BASE-TX (RJ45)", "1 x 100BASE-FX (SC/ST)"],
            ledPanel: "LNK/ACT, FDX/COL, LFS, Fiber (100, LNK/ACT), RJ45 (100, LNK/ACT)",
            power: {
              input: "12VDC via External Power Adapter",
              consumption: "1.92W",
            },
            environment: {
              tempOperating: "0°C ~ 50°C (32°F ~ 122°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "138 g (0.3 lb)", dimension: "73.8 x 109.2 x 23.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/b0f4e2e15e111723b1232e52ded362c0.pdf",
          },
        },
        {
          model: "NGF-763",
          description: "1x 100/1000 RJ45 + 1x FX/GbE SFP — Media Converter",
          image: mc_NGF_763,
          features: ["Gigabit", "SFP"],
          sourceUrl: detail(1666),
          details: {
            overview:
              "NGF-763 เป็น Mini Commercial Media Converter แปลง Copper (RJ45 100/1000) ↔ Fiber (100FX/1000BASE-X SFP) — เคส Metal IP30 Compact 86.2 x 23.4 x 59.4 mm สำหรับ Wall-Mount ในพื้นที่จำกัด รองรับ Auto-MDI/MDI-X, Auto-negotiation NWay บน RJ45 — Transparent Conversion ไม่กระทบ Network Performance รองรับ SFP module ระยะไกลสุด 80km (ขึ้นกับ SFP) Operating 0°C~50°C เหมาะกับงาน Commercial/Office ที่ต้องการ Fiber Uplink ความเร็ว Gigabit",
            highlights: [
              { title: "1x GbE RJ45 + 1x 100/1000 SFP", desc: "แปลง Copper ↔ Fiber 100M/1G — รองรับ SFP module หลายระยะ" },
              { title: "SFP สูงสุด 80km", desc: "เลือก SFP module ตามระยะที่ต้องการ — สูงสุด 80km" },
              { title: "Auto-MDI/MDIX + NWay", desc: "Plug & Play ใช้งานได้ทันที" },
              { title: "Mini Compact 86.2 x 23.4 x 59.4 mm", desc: "เล็กที่สุดในรุ่น — เหมาะกับ Wall-Mount ในพื้นที่จำกัด" },
              { title: "Metal IP30 Casing", desc: "ทนทาน — Operating 0°C~50°C เหมาะ Commercial" },
              { title: "Lightweight 180g, 1.6W", desc: "เบามาก ประหยัดพลังงาน" },
              { title: "Wall-Mount", desc: "ติดตั้งง่าย DC Jack มาตรฐาน" },
              { title: "Transparent Conversion", desc: "ไม่กระทบ Network Performance — Plug-and-Forget" },
            ],
            ports: ["1 x 100/1000BASE-T (RJ45)", "1 x 100/1000BASE-X (SFP)"],
            ledPanel: "PWR, 100, LNK/ACT, 1000",
            power: {
              input: "12VDC via DC Jack",
              consumption: "1.6W",
            },
            environment: {
              tempOperating: "0°C ~ 50°C (32°F ~ 122°F)",
              tempStorage: "-25°C ~ 70°C (-13°F ~ 158°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30 Protection)",
            },
            physical: { weight: "180 g (0.4 lb)", dimension: "86.2 x 23.4 x 59.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/00a90ada27da73345887c1ab49896cc7.pdf",
          },
        },
        {
          model: "NGF-762E",
          description: "1x 10/100/1000 RJ45 + 1x FX/GbE Fiber — Media Converter",
          image: mc_NGF_762E,
          features: ["Gigabit", "Fiber"],
          sourceUrl: detail(1667),
          details: {
            overview:
              "NGF-762E เป็น Commercial Media Converter แปลง Copper (RJ45 10/100/1000) ↔ Fiber (100FX/1000Base-X) สำหรับงาน Office/Commercial — Transparent Conversion ไม่กระทบ Network Performance รองรับ Auto-MDI/MDI-X, Auto-negotiation NWay บน RJ45, LFS, Local + Remote Loopback (LLB/RLB) เคส Aluminum IP30 พร้อม DC-Jack แบบ Locking, DIP Switch 4 ตัว (LFS, LLB, RLB, SFP Speed) Operating 0°C~50°C ติดตั้งได้ 3 แบบ: Wall-Mount, DIN-Rail (Optional), Chassis Compatible เลือกได้ทั้งรุ่น SFP (ใส่เอง) และรุ่นมี Fiber ติดมา (MC 500m, SC 10/20/40km)",
            highlights: [
              { title: "1x GbE RJ45 + 1x FX/GbE Fiber", desc: "แปลง Copper ↔ Fiber 100M/1G — Transparent ไม่กระทบ Performance" },
              { title: "Auto-MDI/MDIX + NWay", desc: "Plug & Play ใช้งานได้ทันที" },
              { title: "LFS + LLB/RLB Loopback", desc: "ตรวจ Optical Signal + Diagnose Link ทั้ง Local และ Remote" },
              { title: "SFP Speed DIP Switch", desc: "สลับ SFP ระหว่าง 100M และ 1G ได้ง่าย" },
              { title: "Aluminum IP30 + Locking DC Jack", desc: "ทนทาน + ป้องกันสายหลุดจากการสั่น" },
              { title: "Wall-Mount / DIN-Rail / Chassis", desc: "ติดตั้งได้ 3 แบบ — Chassis-compatible สำหรับ in-rack" },
              { title: "Lightweight 131g, 1.8W", desc: "เบามาก ประหยัดพลังงาน" },
              { title: "หลายรุ่นย่อย", desc: "SFP / MM 500m / SM 10/20/40km — เลือกระยะตามงาน" },
            ],
            ports: ["1 x 10/100/1000BASE-T (RJ45)", "1 x 100FX/1000BASE-X"],
            ledPanel: "PWR, Fiber (1000, LNK/ACT), RJ45 (1000, LNK/ACT), ALM",
            power: {
              input: "12VDC/1A via External Power Adapter",
              consumption: "1.8W",
            },
            environment: {
              tempOperating: "0°C ~ 50°C (32°F ~ 122°F)",
              tempStorage: "-20°C ~ 70°C (-4°F ~ 158°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "131 g (0.29 lb)", dimension: "73.8 x 23.4 x 109.2 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/dcc7f58badb8ecacba5c206d7b8d9331.pdf",
          },
        },
      ],
    },
    {
      id: "mc-serial-fiber",
      title: "Serial to Fiber",
      blurb: "Serial ↔ Fiber Converter — แปลง RS-232/422/485 เป็น Fiber สำหรับงาน Industrial Automation",
      products: [
        {
          model: "IRF-629",
          description: "RS-422/485 to Fiber Converter — Industrial Serial Converter",
          image: mc_IRF_629,
          features: ["RS-422/485", "Fiber"],
          sourceUrl: detail(1669),
          details: {
            overview:
              "IRF-629 เป็น Industrial Media Converter สำหรับแปลงสัญญาณ RS-422/485 → Fiber Optic เหมาะกับโรงงานที่มีอุปกรณ์ Legacy ใช้พอร์ต Serial ต้องการขยายระยะการสื่อสารผ่าน Fiber รองรับทั้ง Multi-mode (2 km) และ Single-mode (30/60/120 km) เลือก Connector ได้ทั้ง ST และ SC พร้อม DIP Switch ตั้งโหมด 2-wire/4-wire และ Terminator (TMR) ใช้งานง่ายไม่ต้องเปลี่ยนการตั้งค่าเดิมในระบบ ตัวเครื่อง Aluminum IP30 ขนาดมาตรฐานสำหรับติดตั้งในตู้ Rack หรือ DIN-Rail",
            highlights: [
              { title: "Extendable Optical Connectivity", desc: "ขยายระยะได้ถึง 2 km (Multi-mode) และ 120 km (Single-mode)" },
              { title: "RS-422/485 to Fiber", desc: "Terminal Block สำหรับเชื่อมต่ออุปกรณ์ Serial industrial" },
              { title: "DIP Switch 4-wire/2-wire", desc: "เลือกโหมดส่งข้อมูลและเปิด/ปิด Terminator (TMR) ได้ง่าย" },
              { title: "Space-Saving Design", desc: "ตัวเล็ก ติดตั้ง DIN-Rail หรือ Wall-Mount" },
              { title: "User-Friendly Monitoring", desc: "LED แสดงสถานะ PWR / LNK / RCV ตรวจสอบสถานะได้ทันที" },
              { title: "Wide Voltage Input", desc: "รับไฟ 9~32V DC ใช้กับแหล่งจ่ายไฟอุตสาหกรรมได้หลากหลาย" },
              { title: "Aluminum IP30 Housing", desc: "ทนสภาพแวดล้อมโรงงาน ป้องกันฝุ่นและของแข็งเข้าเครื่อง" },
              { title: "Plug-and-Play", desc: "ติดตั้งใช้งานทันทีโดยไม่ต้อง config ซับซ้อน" },
            ],
            ports: ["1 x Serial RS-422/485 (Terminal Block)", "1 x Fiber (ST/SC; Multi-mode / Single-mode)"],
            ledPanel: "PWR, LNK, RCV",
            power: { input: "9~32V DC", consumption: "2.4W" },
            environment: {
              tempOperating: "0°C ~ 50°C (32°F ~ 122°F)",
              tempStorage: "-20°C ~ 80°C (-4°F ~ 176°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "280 g (0.62 lb)", dimension: "90 x 109.2 x 28.4 mm (D x W x H)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/786113df8da2b2a3eaa6657948773b54.pdf",
          },
        },
        {
          model: "IRF-631",
          description: "RS-232 to Fiber Converter — Industrial Serial Converter",
          image: mc_IRF_631,
          features: ["RS-232", "Fiber"],
          sourceUrl: detail(1670),
          details: {
            overview:
              "IRF-631 เป็น Industrial Media Converter สำหรับแปลงสัญญาณ RS-232 → Fiber Optic ผ่าน Connector DB-9 Male เหมาะกับโรงงานที่ต้องการขยายระยะการสื่อสารของอุปกรณ์ Serial Legacy เช่น PLC, RTU, เครื่องจักรเก่า รองรับทั้ง Multi-mode (2 km) และ Single-mode (30/60/120 km) มาพร้อมปุ่มเลือกโหมด DTE/DCE และ LED แสดงสถานะการเชื่อมต่อแบบเรียลไทม์ ติดตั้งได้ทั้ง DIN-Rail และ Wall-Mount เคส Aluminum IP30 ทนทานต่อสภาพแวดล้อมอุตสาหกรรม",
            highlights: [
              { title: "Extendable Optical Connectivity", desc: "ขยายระยะได้ถึง 2 km (Multi-mode) และ 120 km (Single-mode)" },
              { title: "RS-232 DB-9 Male", desc: "เชื่อมต่ออุปกรณ์ Serial มาตรฐานได้โดยตรง" },
              { title: "DTE/DCE Push-button", desc: "ปุ่มเลือกโหมด DTE/DCE ใช้งานง่ายโดยไม่ต้องสลับสาย" },
              { title: "Space-Saving Design", desc: "ตัวเล็ก ติดตั้ง DIN-Rail หรือ Wall-Mount" },
              { title: "User-Friendly Monitoring", desc: "LED แสดงสถานะ PWR / LNK ตรวจสอบสถานะแบบ at-a-glance" },
              { title: "Wide Voltage Input", desc: "รับไฟ 9~32V DC ใช้กับแหล่งจ่ายไฟอุตสาหกรรมได้หลากหลาย" },
              { title: "Aluminum IP30 Housing", desc: "ทนสภาพแวดล้อมโรงงาน ป้องกันฝุ่นและของแข็งเข้าเครื่อง" },
              { title: "Plug-and-Play", desc: "ติดตั้งใช้งานทันทีโดยไม่ต้อง config ซับซ้อน" },
            ],
            ports: ["1 x Serial RS-232 (DB-9 Male)", "1 x Fiber (ST/SC; Multi-mode / Single-mode)"],
            ledPanel: "PWR, LNK",
            power: { input: "9~32V DC", consumption: "2.4W" },
            environment: {
              tempOperating: "0°C ~ 50°C (32°F ~ 122°F)",
              tempStorage: "-20°C ~ 80°C (-4°F ~ 176°F)",
              humidity: "10 ~ 90% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection)",
            },
            physical: { weight: "280 g (0.62 lb)", dimension: "90 x 109.2 x 28.4 mm (D x W x H)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/89c8e3b71e201b999350fc64783e688a.pdf",
          },
        },
      ],
    },
    {
      id: "mc-spe",
      title: "SPE Converters",
      blurb: "Single-Pair Ethernet Converter — แปลง 10BASE-T ↔ 10BASE-T1L SPE สำหรับงาน Field Network",
      products: [
        {
          model: "IMC-553",
          description: "1x 10BASE-T1L SPE + 1x 10BASE-T — Unmanaged Industrial SPE Media Converter",
          image: mc_IMC_553,
          features: ["SPE", "10BASE-T1L", "Industrial"],
          sourceUrl: detail(1672),
          details: {
            overview:
              "IMC-553 เป็น Unmanaged Industrial SPE Media Converter รุ่นใหม่ล่าสุดสำหรับเชื่อมต่อระบบ Industrial Automation เข้ากับ Single Pair Ethernet (SPE) ตามมาตรฐาน IEEE 802.3cg แปลง 10BASE-T1L ↔ 10BASE-T (RJ45) ส่งข้อมูล 10 Mbps ผ่าน Fieldbus Cable เดิมได้ไกลถึง 1,000 เมตร ลดความซับซ้อนของการเดินสาย ประหยัดต้นทุน และขยาย Industrial Ethernet เข้าสู่ Sensor / Actuator / Automation รุ่นใหม่ ตัวเครื่องเป็น Metal IP30 พร้อม Wide-Temp -40°C ~ 75°C ใช้งานในสภาพแวดล้อมรุนแรงได้ พร้อม DIP Switch สำหรับตั้งโหมด Auto / Master / Slave",
            highlights: [
              { title: "IEEE 802.3cg SPE Standard", desc: "10BASE-T1L รองรับ 10 Mbps ผ่านสายคู่เดียวยาวถึง 1,000 ม." },
              { title: "Reduced Wiring Complexity", desc: "ใช้สายคู่เดียว (Single Pair) ลดต้นทุนและความยุ่งยากในการเดินสาย" },
              { title: "Auto / Master / Slave (DIP)", desc: "DIP Switch ตั้งโหมดการทำงาน SPE ได้ตามอุปกรณ์ปลายทาง" },
              { title: "3-Pin Terminal Block (SPE)", desc: "ขั้วต่อแบบ Industrial ทนทานสำหรับ Field Network" },
              { title: "Wide-Temp -40 ~ 75°C", desc: "ทำงานในสภาพแวดล้อมอุตสาหกรรมรุนแรงได้" },
              { title: "Ruggedized Metal IP30", desc: "ทน Vibration / EMI / ESD / Power Surge / Reverse Polarity" },
              { title: "Compact + Lightweight", desc: "ตัวเล็ก 86.2 x 23.4 x 59.4 mm เหมาะติดตั้ง DIN-Rail หรือ Wall-Mount" },
              { title: "Wide Voltage 12~48VDC", desc: "รองรับแหล่งจ่ายไฟอุตสาหกรรมได้หลากหลายมาตรฐาน" },
            ],
            ports: ["1 x 10BASE-T (RJ45)", "1 x 10BASE-T1L SPE Port (3-pin Terminal Block)"],
            ledPanel: "System: PWR (G) | SPE: LNK/ACT (G/A) | 10BASE-T: 10 (G), LNK/ACT (G)",
            power: { input: "12~48VDC", consumption: "System: 3W" },
            environment: {
              tempOperating: "-40°C ~ 75°C (-40°F ~ 167°F)",
              tempStorage: "-40°C ~ 85°C (-40°F ~ 185°F)",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Metal (IP30 Protection)",
            },
            physical: { weight: "205.5 g (0.45 lb)", dimension: "86.2 x 23.4 x 59.4 mm (W x H x D)" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/239e8b96590e8c01e913492d25397f25.pdf",
          },
        },
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
        {
          model: "LAMUNGAN",
          description: "Element Management System สำหรับ Volktek Switches — Auto-discovery, Topology Map, Wizard Configuration, SNMP Trap, Real-time Dashboard",
          image: ems_LAMUNGAN,
          features: ["EMS", "Topology Map", "Wizard", "Multi-vendor"],
          sourceUrl: detail(1716),
          details: {
            overview:
              "LAMUNGAN เป็น Industrial Switch Management System ของ Volktek ที่ให้ผู้ดูแลระบบมอนิเตอร์สถานะเครือข่ายได้ทุกที่ทุกเวลา ระบบส่ง Real-time Alert + Push Notification และแสดง Topology Map แบบ Tri-color (เขียว=ปกติ, เหลือง=Warning, แดง=Critical) ทำให้วิศวกรหา Fault ได้เร็ว แตะที่ไอคอนเพื่อดูข้อมูลเชิงลึก หรือสั่งงานช่างหน้างานได้ทันที ทลายข้อจำกัดของการนั่ง Control Room — รองรับการจัดการ Lite-Managed Switch แบบไม่ต้องติดตั้ง Software เพิ่ม และเชื่อมกับกล้อง IP มาตรฐาน ONVIF ทุกยี่ห้อได้",
            highlights: [
              { title: "Tri-color Topology Map", desc: "แสดงสถานะ Network / Link / Port ด้วย 3 สี เห็นภาพรวมทั้งระบบทันที" },
              { title: "Real-time Traffic Alert", desc: "แจ้งเตือนทันทีเมื่อตรวจพบ Traffic ผิดปกติ" },
              { title: "Unified Dashboard", desc: "Monitoring + Utilization Metrics ครบในหน้าเดียว" },
              { title: "Link Change History", desc: "บันทึกประวัติการเปลี่ยนแปลง Link เพื่อ Diagnostic & Planning" },
              { title: "Setup Wizard", desc: "Step-by-step สำหรับมือใหม่ ตั้งค่า Lite-Managed Switch ได้รวดเร็ว" },
              { title: "ONVIF Camera Support", desc: "เชื่อมต่อกล้อง IP ONVIF ได้ทุกยี่ห้อ บริหารแบบรวมศูนย์" },
              { title: "Push Notification", desc: "แจ้งเตือนผ่านมือถือ ตอบสนอง Incident ได้ทุกที่" },
              { title: "No Software Install", desc: "ใช้ผ่าน Web Interface ไม่ต้องติดตั้งโปรแกรมเพิ่มที่เครื่องผู้ใช้" },
            ],
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/dbd4df5315ad074f3967857b5f98be39.pdf",
          },
        },
      ],
    },
    {
      id: "ems-indy",
      title: "INDY NMS",
      blurb: "Network Management System Software — บริหารจัดการเครือข่ายระดับองค์กรแบบครบวงจร",
      products: [
        {
          model: "INDY",
          description: "Network Management System Software — บริหารจัดการอุปกรณ์เครือข่ายแบบรวมศูนย์ พร้อม SNMP Monitoring และ Configuration Management",
          image: ems_INDY,
          features: ["NMS", "SNMP", "Enterprise"],
          sourceUrl: detail(1637),
          details: {
            overview:
              "INDY เป็น Windows-based NMS ที่ออกแบบให้ครอบคลุม FCAPS (Fault / Configuration / Accounting / Performance / Security) ครบวงจร พร้อม UI ใช้งานง่ายสำหรับการ Configuration Management และ Firmware Upgrade ในไม่กี่คลิก รองรับ Auto-discovery อุปกรณ์ Volktek อัตโนมัติ พร้อมรองรับ SNMP และ Modbus TCP สำหรับงาน Industrial Automation มี Topology Map, Real-time Event Notification, Email Alert และ Xpress Ring Technology สำหรับ Network Stability เหมาะกับโรงงาน, Substation, Surveillance และ Smart Building ระดับองค์กร",
            highlights: [
              { title: "FCAPS Coverage", desc: "Fault / Configuration / Accounting / Performance / Security ครบในเครื่องเดียว" },
              { title: "Auto-Discovery", desc: "ตรวจพบอุปกรณ์ Volktek + SNMP/Modbus TCP ใน subnet อัตโนมัติ" },
              { title: "SNMP + Modbus TCP", desc: "รองรับทั้ง IT (SNMP) และ OT (Modbus TCP) เชื่อมเครือข่ายอุตสาหกรรมและสำนักงาน" },
              { title: "Topology Map", desc: "แสดงโครงสร้างเครือข่ายเป็นภาพ เข้าใจง่าย" },
              { title: "Xpress Ring Technology", desc: "Fast Replacement สำหรับ Network Redundancy ระหว่าง Maintenance" },
              { title: "Real-time Event + Email Alert", desc: "แจ้งเตือนทันทีเมื่ออุปกรณ์ผิดปกติหรือ Disconnect" },
              { title: "Configurable Thresholds", desc: "กำหนด Threshold การใช้งาน Resource ได้ยืดหยุ่น" },
              { title: "Daily/Weekly Status Report", desc: "สร้างรายงานสถานะระบบอัตโนมัติเพื่อวิเคราะห์เชิงลึก" },
            ],
            ports: ["CPU: Intel Core i3 หรือสูงกว่า", "RAM: ขั้นต่ำ 8 GB (แนะนำ 16 GB)", "OS: Windows-based"],
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/d47dada46b3701aa5f6a73747b4d8d55.pdf",
          },
        },
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
        {
          model: "FPM-107",
          description: "100FX SFP Duplex LC — Fast Ethernet Fiber Module",
          image: sfp_FPM_107,
          features: ["100FX", "Duplex LC"],
          sourceUrl: detail(90),
          details: {
            overview:
              "FPM-107 เป็น 100BASE-FX SFP Transceiver Module แบบ Duplex LC รองรับทั้ง Multi-mode (2 km) และ Single-mode (30/60/100 km) ใช้กระแสไฟ 3.3V และมีรุ่น Wide-Temp (-40°C ~ 85°C) สำหรับงาน Industrial Hot-pluggable, Class 1 Laser และเป็น Industry-standard SFP สามารถใช้ร่วมกับสวิตช์/Media Converter ที่มี SFP Slot ได้ทุกค่ายที่รองรับ MSA",
            highlights: [
              { title: "Fast Ethernet 100FX", desc: "Compliant กับมาตรฐาน Fast Ethernet (100BASE-FX)" },
              { title: "Multi-mode 2km / Single-mode 30/60/100km", desc: "เลือกระยะส่งได้ตามความต้องการของโครงการ" },
              { title: "Duplex LC Connector", desc: "ขั้วต่อ LC มาตรฐาน Industry สำหรับ Patch Cord ทั่วไป" },
              { title: "Wide-Temp Option (-40~85°C)", desc: "รุ่น FPM-107I สำหรับงาน Industrial / Outdoor" },
              { title: "3.3V Single Supply + Hot Pluggable", desc: "เสียบเปลี่ยนขณะใช้งานได้โดยไม่ต้อง Reboot" },
              { title: "RoHS / Class 1 Laser", desc: "ปลอดภัยตามมาตรฐานสากล" },
              { title: "TTL Signal Detect", desc: "สัญญาณ Detect แบบ TTL เพื่อ Monitoring สถานะ Fiber" },
              { title: "Industry Standard SFP", desc: "ใช้ร่วมกับสวิตช์ที่รองรับ MSA SFP ได้หลากหลายยี่ห้อ" },
            ],
            ports: ["1 x 100BASE-FX SFP (Duplex LC)", "Wavelength: 1310nm (MM/SM 30-60km), 1550nm (SM 100km)"],
            power: { input: "3.3V Single Supply", consumption: "Low Power (Hot Pluggable)" },
            environment: {
              tempOperating: "Standard: 0°C ~ 70°C / Wide-Temp: -40°C ~ 85°C",
              housing: "Industry Standard SFP MSA",
            },
            physical: { weight: "≈ 25 g", dimension: "Standard SFP Form Factor" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/0efc22edb52d47cf63f96b20834f5951.pdf",
          },
        },
      ],
    },
    {
      id: "sfp-100base-bidi",
      title: "100BASE Bi-Di SFP",
      blurb: "100FX Bi-Directional SFP — Simplex LC ใช้สาย Fiber เส้นเดียว ส่ง-รับสองทาง",
      products: [
        {
          model: "GBM-132TS",
          description: "100FX Bi-Di SFP Simplex LC (TX) — Bi-Directional Fiber Module",
          image: sfp_GBM_132TS,
          features: ["100FX", "Bi-Di", "TX"],
          sourceUrl: detail(91),
          details: {
            overview:
              "GBM-132TS เป็น 100BASE-FX Bi-Directional SFP แบบ Single-mode Simplex LC ส่งข้อมูลด้วย Wavelength TX: 1310nm / RX: 1550nm ใช้คู่กับ GBM-132RS เพื่อรับ-ส่งสองทางบนสาย Fiber เส้นเดียว ระยะ 20 km ลดต้นทุนสาย Fiber ลงครึ่งหนึ่ง รองรับ SONET/SDH, IEEE 802.3ah 100Base-BX และ ITU-T G.985 class S มีรุ่น Wide-Temp (-40°C ~ 85°C) สำหรับงาน Industrial",
            highlights: [
              { title: "Bi-Directional Single Fiber", desc: "ใช้ Fiber เส้นเดียว — ลดสายและต้นทุนการเดินสาย Fiber ลงครึ่งหนึ่ง" },
              { title: "TX 1310nm / RX 1550nm", desc: "ใช้คู่กับ GBM-132RS (TX 1550 / RX 1310) เป็น Pair" },
              { title: "Single-mode 20km", desc: "เหมาะกับงาน Last Mile, Building-to-Building" },
              { title: "Simplex LC Connector", desc: "ขั้วต่อ Simplex LC มาตรฐาน Industry" },
              { title: "Compliant SONET/SDH + 802.3ah", desc: "ใช้กับเครือข่าย Telecom และ Carrier ได้" },
              { title: "Wide-Temp Option (GBM-132ITS)", desc: "รุ่น Industrial -40°C ~ 85°C สำหรับ Outdoor / Cabinet" },
              { title: "3.3V + Hot Pluggable", desc: "ประหยัดพลังงาน เสียบเปลี่ยนขณะใช้งานได้" },
              { title: "RoHS / Class 1 Laser", desc: "ปลอดภัยตามมาตรฐานสากล" },
            ],
            ports: ["1 x 100BASE-FX Bi-Di SFP (Simplex LC)", "TX: 1310nm / RX: 1550nm — Single-mode 20km"],
            power: { input: "3.3V Single Supply", consumption: "Low Power (Hot Pluggable)" },
            environment: {
              tempOperating: "Standard: 0°C ~ 70°C / Wide-Temp: -40°C ~ 85°C",
              housing: "Industry Standard SFP MSA",
            },
            physical: { weight: "≈ 25 g", dimension: "Standard SFP Form Factor" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/02b56d67f01c585317b669c639212921.pdf",
          },
        },
        {
          model: "GBM-132RS",
          description: "100FX Bi-Di SFP Simplex LC (RX) — Bi-Directional Fiber Module",
          image: sfp_GBM_132RS,
          features: ["100FX", "Bi-Di", "RX"],
          sourceUrl: detail(92),
          details: {
            overview:
              "GBM-132RS เป็น 100BASE-FX Bi-Directional SFP แบบ Single-mode Simplex LC คู่ตรงข้ามของ GBM-132TS — ส่ง TX: 1550nm / RX: 1310nm ระยะ 20 km บนสาย Fiber เส้นเดียว เหมาะกับงาน Last Mile ของ Service Provider, FTTx รองรับ SONET/SDH, IEEE 802.3ah 100Base-BX และ ITU-T G.985 class S มีรุ่น Wide-Temp (-40°C ~ 85°C) สำหรับงาน Industrial",
            highlights: [
              { title: "Bi-Directional Single Fiber", desc: "ใช้ Fiber เส้นเดียว — ลดสายและต้นทุนการเดินสาย Fiber" },
              { title: "TX 1550nm / RX 1310nm", desc: "ใช้คู่กับ GBM-132TS เป็น Pair (Wavelength คู่กลับด้าน)" },
              { title: "Single-mode 20km", desc: "เหมาะกับงาน Last Mile, FTTx, Carrier Network" },
              { title: "Simplex LC Connector", desc: "ขั้วต่อ Simplex LC มาตรฐาน Industry" },
              { title: "Compliant SONET/SDH + 802.3ah", desc: "ใช้กับเครือข่าย Telecom และ Carrier ได้" },
              { title: "Wide-Temp Option (GBM-132IRS)", desc: "รุ่น Industrial -40°C ~ 85°C สำหรับ Outdoor / Cabinet" },
              { title: "3.3V + Hot Pluggable", desc: "ประหยัดพลังงาน เสียบเปลี่ยนขณะใช้งานได้" },
              { title: "RoHS / Class 1 Laser", desc: "ปลอดภัยตามมาตรฐานสากล" },
            ],
            ports: ["1 x 100BASE-FX Bi-Di SFP (Simplex LC)", "TX: 1550nm / RX: 1310nm — Single-mode 20km"],
            power: { input: "3.3V Single Supply", consumption: "Low Power (Hot Pluggable)" },
            environment: {
              tempOperating: "Standard: 0°C ~ 70°C / Wide-Temp: -40°C ~ 85°C",
              housing: "Industry Standard SFP MSA",
            },
            physical: { weight: "≈ 25 g", dimension: "Standard SFP Form Factor" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/7d4823be48bb6213aa7bb3672a454f7c.pdf",
          },
        },
      ],
    },
    {
      id: "sfp-gigabit",
      title: "Gigabit SFP",
      blurb: "1.25G SFP Module — Duplex LC สำหรับ Gigabit Fiber Link",
      products: [
        {
          model: "GBM-104",
          description: "1.25G SFP Duplex LC — Gigabit Fiber Module",
          image: sfp_GBM_104,
          features: ["1.25G", "Duplex LC"],
          sourceUrl: detail(93),
          details: {
            overview:
              "GBM-104 เป็น 1.25 Gigabit SFP Transceiver แบบ Duplex LC รองรับทั้ง Multi-mode (550 m @ 850nm) และ Single-mode (10/20 km @ 1310nm) Compliant กับ IEEE 802.3z Gigabit Ethernet และ Fiber Channel 100-M5/M6-SN-I ทำงานที่ 3.3V พร้อม Hot Pluggable และมีรุ่น Wide-Temp (-40°C ~ 85°C) สำหรับงาน Industrial / Outdoor",
            highlights: [
              { title: "Gigabit 1000BASE-SX/LX", desc: "Compliant IEEE 802.3z Gigabit Ethernet" },
              { title: "MM 550m / SM 10km / 20km", desc: "เลือกระยะได้ตาม Application" },
              { title: "Duplex LC Connector", desc: "ขั้วต่อ LC มาตรฐาน Industry สำหรับ Patch Cord ทั่วไป" },
              { title: "Wide-Temp Option (GBM-104I)", desc: "รุ่น Industrial -40°C ~ 85°C สำหรับ Outdoor" },
              { title: "Fiber Channel Compliant", desc: "100-M5-SN-I / 100-M6-SN-I — ใช้กับ Storage Network ได้" },
              { title: "3.3V Single Supply", desc: "ประหยัดพลังงาน ใช้กับ SFP Slot มาตรฐาน" },
              { title: "Hot Pluggable", desc: "เสียบเปลี่ยนขณะใช้งานได้โดยไม่ต้อง Reboot" },
              { title: "RoHS / Class 1 Laser", desc: "ปลอดภัยตามมาตรฐานสากล" },
            ],
            ports: ["1 x 1000BASE-SX/LX SFP (Duplex LC)", "Wavelength: 850nm (MM 550m), 1310nm (SM 10/20km)"],
            power: { input: "3.3V Single Supply", consumption: "Low Power (Hot Pluggable)" },
            environment: {
              tempOperating: "Standard: 0°C ~ 70°C / Wide-Temp: -40°C ~ 85°C",
              housing: "Industry Standard SFP MSA",
            },
            physical: { weight: "≈ 25 g", dimension: "Standard SFP Form Factor" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/985b1b1dabd1b532a2f04fe58be7939d.pdf",
          },
        },
      ],
    },
    {
      id: "sfp-gigabit-bidi",
      title: "Gigabit Bi-Di SFP",
      blurb: "1.25G Bi-Directional SFP — Simplex LC ใช้สาย Fiber เส้นเดียวประหยัดต้นทุน",
      products: [
        {
          model: "GBM-123TS",
          description: "1.25G Bi-Di SFP Simplex LC (TX) — Bi-Directional Gigabit Module",
          image: sfp_GBM_123TS,
          features: ["1.25G", "Bi-Di", "TX"],
          sourceUrl: detail(94),
          details: {
            overview:
              "GBM-123TS เป็น 1.25 Gigabit Bi-Directional SFP แบบ Single-mode Simplex LC ส่ง TX: 1310nm / RX: 1550nm ระยะ 10 km บนสาย Fiber เส้นเดียว ใช้คู่กับ GBM-123RS เพื่อรับ-ส่งสองทาง ลดต้นทุนสาย Fiber ลงครึ่งหนึ่ง Compliant กับ IEEE 802.3z Gigabit Ethernet และ Fiber Channel 100-SM-LC-L มีรุ่น Wide-Temp (-40°C ~ 85°C) สำหรับงาน Industrial",
            highlights: [
              { title: "Bi-Directional Gigabit", desc: "ใช้ Fiber เส้นเดียว ส่งข้อมูล 1.25G ได้สองทาง" },
              { title: "TX 1310nm / RX 1550nm", desc: "ใช้คู่กับ GBM-123RS (Wavelength คู่กลับด้าน)" },
              { title: "Single-mode 10km", desc: "เหมาะกับงาน Building-to-Building, Campus, Last Mile" },
              { title: "Simplex LC Connector", desc: "ขั้วต่อ Simplex LC มาตรฐาน Industry" },
              { title: "IEEE 802.3z Compliant", desc: "Gigabit Ethernet มาตรฐานสากล" },
              { title: "Wide-Temp Option (GBM-123ITS)", desc: "รุ่น Industrial -40°C ~ 85°C สำหรับ Outdoor / Cabinet" },
              { title: "3.3V + Hot Pluggable", desc: "ประหยัดพลังงาน เสียบเปลี่ยนขณะใช้งานได้" },
              { title: "RoHS / Class 1 Laser", desc: "ปลอดภัยตามมาตรฐานสากล" },
            ],
            ports: ["1 x 1000BASE-LX Bi-Di SFP (Simplex LC)", "TX: 1310nm / RX: 1550nm — Single-mode 10km"],
            power: { input: "3.3V Single Supply", consumption: "Low Power (Hot Pluggable)" },
            environment: {
              tempOperating: "Standard: 0°C ~ 70°C / Wide-Temp: -40°C ~ 85°C",
              housing: "Industry Standard SFP MSA",
            },
            physical: { weight: "≈ 25 g", dimension: "Standard SFP Form Factor" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/69e813f3179f06b34241a0cf55cb9c87.pdf",
          },
        },
        {
          model: "GBM-123RS",
          description: "1.25G Bi-Di SFP Simplex LC (RX) — Bi-Directional Gigabit Module",
          image: sfp_GBM_123RS,
          features: ["1.25G", "Bi-Di", "RX"],
          sourceUrl: detail(95),
          details: {
            overview:
              "GBM-123RS เป็น 1.25 Gigabit Bi-Directional SFP คู่ตรงข้ามของ GBM-123TS — ส่ง TX: 1550nm / RX: 1310nm ระยะ 10 km Single-mode บนสาย Fiber เส้นเดียว Compliant กับ IEEE 802.3z Gigabit Ethernet และ Fiber Channel 100-SM-LC-L เหมาะกับงาน Last Mile, Carrier Network, FTTB / FTTH และมีรุ่น Wide-Temp (-40°C ~ 85°C) สำหรับงาน Industrial",
            highlights: [
              { title: "Bi-Directional Gigabit", desc: "ใช้ Fiber เส้นเดียว ส่งข้อมูล 1.25G ได้สองทาง" },
              { title: "TX 1550nm / RX 1310nm", desc: "ใช้คู่กับ GBM-123TS เป็น Pair" },
              { title: "Single-mode 10km", desc: "เหมาะกับงาน Building-to-Building, Carrier, FTTx" },
              { title: "Simplex LC Connector", desc: "ขั้วต่อ Simplex LC มาตรฐาน Industry" },
              { title: "IEEE 802.3z Compliant", desc: "Gigabit Ethernet มาตรฐานสากล" },
              { title: "Wide-Temp Option (GBM-123IRS)", desc: "รุ่น Industrial -40°C ~ 85°C สำหรับ Outdoor / Cabinet" },
              { title: "3.3V + Hot Pluggable", desc: "ประหยัดพลังงาน เสียบเปลี่ยนขณะใช้งานได้" },
              { title: "RoHS / Class 1 Laser", desc: "ปลอดภัยตามมาตรฐานสากล" },
            ],
            ports: ["1 x 1000BASE-LX Bi-Di SFP (Simplex LC)", "TX: 1550nm / RX: 1310nm — Single-mode 10km"],
            power: { input: "3.3V Single Supply", consumption: "Low Power (Hot Pluggable)" },
            environment: {
              tempOperating: "Standard: 0°C ~ 70°C / Wide-Temp: -40°C ~ 85°C",
              housing: "Industry Standard SFP MSA",
            },
            physical: { weight: "≈ 25 g", dimension: "Standard SFP Form Factor" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/69e813f3179f06b34241a0cf55cb9c87.pdf",
          },
        },
      ],
    },
    {
      id: "sfp-10g",
      title: "10G SFP+",
      blurb: "10G SFP+ Module — Duplex LC สำหรับ 10 Gigabit Fiber Uplink",
      products: [
        {
          model: "GBM-162",
          description: "10G SFP+ Duplex LC — 10 Gigabit Fiber Module",
          image: sfp_GBM_162,
          features: ["10G", "SFP+", "Duplex LC"],
          sourceUrl: detail(96),
          details: {
            overview:
              "GBM-162 เป็น 10 Gigabit SFP+ Transceiver แบบ Duplex LC ครอบคลุมระยะ 300 m (MM 850nm) / 10 km (SM 1310nm) / 40 km (SM 1550nm) / 80 km (SM 1550nm) พร้อม 2-wire Interface สำหรับ Diagnostic Monitoring (DDM) Compliant กับ IEEE 802.3ae 10GBase-ER, SFF8472 และ SFP+ MSA ใช้พลังงาน 3.3V Hot Pluggable เหมาะกับงาน 10G Backbone, Data Center Uplink, Metro Aggregation และ Long-Haul Fiber",
            highlights: [
              { title: "10 Gigabit SFP+", desc: "Compliant IEEE 802.3ae 10GBase-SR/LR/ER/ZR" },
              { title: "ระยะ 300m / 10km / 40km / 80km", desc: "เลือกได้ตามโครงการ — รองรับทั้ง MM และ SM" },
              { title: "DDM (Digital Diagnostic Monitor)", desc: "2-wire Interface สำหรับมอนิเตอร์ TX Power, RX Power, Temp" },
              { title: "Duplex LC Connector", desc: "ขั้วต่อ LC มาตรฐาน Industry" },
              { title: "EML / DFB Laser Transmitter", desc: "1550nm EML (40/80km) หรือ 1310nm DFB (10km) คุณภาพสูง" },
              { title: "SFP+ MSA Compliant", desc: "ใช้ร่วมกับ Switch/Router ที่รองรับ SFP+ ได้ทุกค่าย" },
              { title: "3.3V + Hot Pluggable", desc: "ประหยัดพลังงาน เสียบเปลี่ยนขณะใช้งานได้" },
              { title: "RoHS Compliant", desc: "ปลอดภัยตามมาตรฐานสากล" },
            ],
            ports: ["1 x 10GBASE-SR/LR/ER/ZR SFP+ (Duplex LC)", "Wavelength: 850nm (MM 300m), 1310nm (SM 10km), 1550nm (SM 40/80km)"],
            power: { input: "3.3V Single Supply", consumption: "Low Power (Hot Pluggable)" },
            environment: {
              tempOperating: "Standard: 0°C ~ 70°C / Wide-Temp: -40°C ~ 85°C",
              housing: "Industry Standard SFP+ MSA",
            },
            physical: { weight: "≈ 30 g", dimension: "Standard SFP+ Form Factor" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/0d1e1419c35a41fb4c9f44e49991d691.pdf",
          },
        },
      ],
    },
  ],
};

/* ============================================================
 * Phase 9: PoE Injectors / PoE Splitters
 * id ตรงกับ productCategories[].id ใน Volktek.tsx → "poe-injector"
 * ============================================================ */
export const volktekPoeInjector: VolktekCategory = {
  id: "poe-injector",
  title: "PoE Injectors / Splitters",
  subCategories: [
    {
      id: "poe-injectors",
      title: "PoE Injectors",
      blurb:
        "Power Injector สำหรับเพิ่มความสามารถจ่ายไฟ PoE/PoE+/PoE++ ให้กับอุปกรณ์ปลายทาง — มีทั้งรุ่น Industrial DIN-Rail (IPI series) สำหรับงานหนัก และรุ่น Desktop (GPI series) สำหรับงานทั่วไป",
      products: [
        {
          model: "IPI-432P-60-I",
          description: "60W PoE++ Industrial Power Injector — DIN-Rail, -40°C ~ 75°C",
          image: imgIpi432P60I,
          features: ["60W PoE++", "IEEE 802.3bt", "Industrial -40°C", "DIN-Rail", "IP30 Aluminum", "Redundant Power"],
          sourceUrl: detail(1671),
          details: {
            overview:
              "IPI-432P-60-I เป็น Single-Port PoE++ Industrial Power Injector ที่จ่ายไฟและข้อมูลให้ Powered Devices (PDs) ผ่านสาย Cat-5e/Cat-6 ด้วยความเร็ว 10/100/1000 Mbps และจ่ายไฟได้ถึง 60 Watts เหมาะกับ PoE Lighting System สำหรับ Smart Building และ IoT ทำงานแบบ Fanless ติดตั้งได้ทั้ง Ceiling และตู้ Outdoor มี LED แสดงปริมาณไฟที่ใช้และแจ้งเตือนเมื่อไฟเกินขีดปลอดภัย ตัวเครื่อง IP30 Aluminum housing ทนฝุ่นและการกระแทก ทำงานในช่วงอุณหภูมิกว้าง -40°C ~ 75°C พร้อม Redundant Power Supply และ Relay Alarm สำหรับแจ้งเตือนกรณีไฟดับ",
            highlights: [
              { title: "60W PoE++ (IEEE 802.3bt)", desc: "รองรับ 4PPoE Type 4 จ่ายไฟผ่าน 4-pair Cat-5e/Cat-6" },
              { title: "Industrial Wide-Temp", desc: "ทำงาน -40°C ~ 75°C — UL Certified ถึง 70°C" },
              { title: "Redundant Power + Relay Alarm", desc: "Dual 24~57V DC Terminal Block + แจ้งเตือนเมื่อไฟดับ" },
              { title: "Power Usage LED", desc: "แสดงระดับไฟ 15W / 30W / 60W และเตือนเมื่อเกินขีดปลอดภัย" },
              { title: "IP30 Aluminum Housing", desc: "Compact Fanless ติด DIN-Rail ในตู้อุตสาหกรรมได้" },
            ],
            ports: [
              "1 x 10/100/1000 Base-T RJ45 (Data In)",
              "1 x 10/100/1000 Base-T PSE Port (60W PoE Out)",
              "DIP Switch: PWR, RPS, NBT, RSV",
            ],
            ledPanel: "PWR, RPS, ALM, PoE, NBT, PoE Usage (15/30/60W)",
            power: { input: "Dual 24~57V DC, Terminal Block (Redundant)", consumption: "7W (System Only)", poeBudget: "60W" },
            environment: {
              tempOperating: "-40°C ~ 75°C (UL: -40°C ~ 70°C)",
              tempStorage: "-40°C ~ 85°C",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection), DIN-Rail",
            },
            physical: { weight: "385 g (0.85 lb)", dimension: "25 x 115.8 x 100 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/40038565ed93ccde31d659a1609ed9d3.pdf",
          },
        },
        {
          model: "IPI-442P-90-I",
          description: "90W PoE++ Industrial Power Injector — DIN-Rail, -40°C ~ 75°C",
          image: imgIpi442P90I,
          features: ["90W PoE++", "IEEE 802.3bt", "Industrial -40°C", "DIN-Rail", "IP30 Aluminum", "Redundant Power"],
          sourceUrl: detail(1656),
          details: {
            overview:
              "IPI-442P-90-I เป็น Single-Port PoE++ Industrial Power Injector รุ่นจ่ายไฟสูงสุด 90 Watts สำหรับ Powered Devices ที่ต้องการพลังงานสูง เช่น PTZ Camera, AP กำลังสูง, Smart Lighting และ IoT Edge Device รองรับการสื่อสาร 10/100/1000 Mbps พร้อม Redundant Power Supply, Relay Alarm และ LED แสดงระดับไฟใช้งาน 15W / 30W / 60W / 90W ทำงานในตู้อุตสาหกรรมได้ตั้งแต่ -40°C ~ 75°C ตัวเครื่อง IP30 Aluminum Fanless ติดตั้งบน DIN-Rail",
            highlights: [
              { title: "90W PoE++ (IEEE 802.3bt)", desc: "Type 4 4PPoE จ่ายไฟสูงสุดในตระกูล Industrial Injector" },
              { title: "Industrial Wide-Temp", desc: "ทำงาน -40°C ~ 75°C — UL Certified ถึง 70°C" },
              { title: "Redundant Power + Relay Alarm", desc: "Dual 24~57V DC + แจ้งเตือนผ่าน Relay 1A@24VDC" },
              { title: "Power Usage LED 4 ระดับ", desc: "แสดงไฟใช้งาน 15W / 30W / 60W / 90W ชัดเจน" },
              { title: "Fanless IP30 Aluminum", desc: "ทนฝุ่น/ความร้อน เงียบ ไม่มีพัดลม" },
            ],
            ports: [
              "1 x 10/100/1000 Base-T RJ45 (Data In)",
              "1 x 10/100/1000 Base-T PSE Port (90W PoE Out)",
              "DIP Switch: PWR, RPS, NBT, RSV",
            ],
            ledPanel: "PWR, RPS, ALM, PoE, NBT, PoE Usage (15/30/60/90W)",
            power: { input: "Dual 24~57V DC, Terminal Block (Redundant)", consumption: "9W (System Only)", poeBudget: "90W" },
            environment: {
              tempOperating: "-40°C ~ 75°C (UL: -40°C ~ 70°C)",
              tempStorage: "-40°C ~ 85°C",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection), DIN-Rail",
            },
            physical: { weight: "385 g (0.85 lb)", dimension: "25 x 115.8 x 100 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/f8d3d923a6c86837d9e465bef4196465.pdf",
          },
        },
        {
          model: "GPI-421",
          description: "30W PoE+ Power Injector (Desktop) — IEEE 802.3at",
          image: imgGpi421,
          features: ["30W PoE+", "IEEE 802.3at", "Desktop", "Fanless", "PD Detection"],
          sourceUrl: detail(182),
          details: {
            overview:
              "GPI-421 เป็น Single-Port 30W PoE+ Power Injector แบบ Desktop ราคาประหยัดสำหรับจ่ายไฟให้อุปกรณ์ในจุดที่ไม่มีไฟ PoE — เหมาะกับ Wireless AP, IP Camera แบบ PTZ, Video Phone ตัวเครื่อง Slide-in Installation มี LED แสดงสถานะ ทำงานที่ 0°C ~ 50°C จ่ายไฟผ่าน Internal Power Supply 100~240VAC",
            highlights: [
              { title: "30W PoE+ (IEEE 802.3at)", desc: "Backward compatible IEEE 802.3af / Legacy PoE" },
              { title: "10/100/1000 Mbps", desc: "รองรับ Gigabit Ethernet เต็มความเร็ว" },
              { title: "Auto Detect & Protect", desc: "ตรวจจับและปกป้อง Non-standard Ethernet Terminal" },
              { title: "Full-Range AC Input", desc: "100~240VAC, 50/60 Hz ใช้ได้ทั่วโลก" },
              { title: "Fanless Slide-in Design", desc: "เงียบ น้ำหนักเบา 350g ติดตั้งง่าย" },
            ],
            ports: ["1 x 10/100/1000 Mbps RJ45 (Data In)", "1 x 10/100/1000 Mbps RJ45 (30W PoE Out)"],
            ledPanel: "PWR, PoE",
            power: { input: "100~240VAC, 50/60 Hz (Internal PSU); Output 52V DC Max.", consumption: "—", poeBudget: "30W" },
            environment: { tempOperating: "0°C ~ 50°C", housing: "Plastic Desktop, Fanless" },
            physical: { weight: "350 g (0.77 lb)", dimension: "146 x 65 x 42 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/84ddc0322cd083ea1dc003603aec5018.pdf",
          },
        },
        {
          model: "GPI-431",
          description: "60W PoE++ Power Injector (Desktop) — 4-Pair PoE",
          image: imgGpi431,
          features: ["60W PoE++", "4-Pair", "Desktop", "Fanless", "PD Detection"],
          sourceUrl: detail(183),
          details: {
            overview:
              "GPI-431 เป็น Single-Port 60W Power Injector แบบ Desktop จ่ายไฟผ่านสาย 4-Pair (Power/Data) สำหรับ Powered Device รุ่นใหม่ เช่น Dome Surveillance Camera กำลังสูง, ระบบไฟ LED, Smart Kiosk รองรับ IEEE 802.3, 802.3u, 802.3ab, 802.3af, 802.3at มาตรฐานครบ พร้อม Internal Power Supply 100~240VAC ทำงานที่ 0°C ~ 40°C",
            highlights: [
              { title: "60W 4-Pair PoE", desc: "จ่ายไฟผ่านทั้ง 4 คู่สาย รองรับอุปกรณ์ใช้กระแสสูง" },
              { title: "10/100/1000 Mbps Gigabit", desc: "Compliant IEEE 802.3 / 802.3u / 802.3ab" },
              { title: "Auto PD Detection", desc: "ตรวจจับและจ่ายไฟตามชนิดอุปกรณ์อัตโนมัติ" },
              { title: "Full-Range AC Input", desc: "100~240VAC, 50/60 Hz Internal PSU" },
              { title: "Fanless Natural Cooling", desc: "เงียบ ไม่มีพัดลม เหมาะกับสภาพแวดล้อม Office" },
              { title: "CE / FCC Compliant", desc: "ผ่านมาตรฐานสากล" },
            ],
            ports: ["1 x 10/100/1000 Base-T RJ45 (Data In)", "1 x 10/100/1000 Base-T PSE Port (60W PoE Out)"],
            ledPanel: "Mode A, Mode B, Power",
            power: { input: "100~240VAC, 50/60 Hz (Internal PSU); Output 56V DC Max.", consumption: "—", poeBudget: "60W" },
            environment: { tempOperating: "0°C ~ 40°C", housing: "Plastic Desktop, Fanless" },
            physical: { weight: "530 g (1.17 lb)", dimension: "180 x 71 x 37 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/b2bd1d85a8eb209a8ae2f32fc0bc83b4.pdf",
          },
        },
        {
          model: "GPI-441",
          description: "90W PoE++ Power Injector (Desktop) — 4-Pair PoE",
          image: imgGpi441,
          features: ["90W PoE++", "4-Pair", "Desktop", "Fanless", "PD Detection"],
          sourceUrl: detail(184),
          details: {
            overview:
              "GPI-441 เป็น Single-Port 90W Power Injector แบบ Desktop รุ่นจ่ายไฟสูงสุดของตระกูล GPI สำหรับอุปกรณ์กำลังสูง เช่น Dome Camera พร้อม Heater, Smart Kiosk, ไฟ LED กลางแจ้ง รองรับ IEEE 802.3, 802.3u, 802.3ab, 802.3af, 802.3at เต็มมาตรฐาน Internal Power Supply 100~240VAC ใช้งานที่ 0°C ~ 40°C",
            highlights: [
              { title: "90W 4-Pair PoE", desc: "จ่ายไฟสูงสุดในตระกูล GPI Desktop Injector" },
              { title: "10/100/1000 Mbps Gigabit", desc: "รองรับ Gigabit Ethernet เต็มความเร็ว" },
              { title: "Auto PD Detection", desc: "ตรวจจับและจ่ายไฟตามชนิดอุปกรณ์อัตโนมัติ" },
              { title: "IEEE 802.3af/at Backward Compatible", desc: "ใช้กับ PoE/PoE+ Device รุ่นเก่าได้" },
              { title: "Full-Range AC Input", desc: "100~240VAC, 50/60 Hz Internal PSU" },
              { title: "Fanless Natural Cooling", desc: "เงียบ ไม่มีพัดลม CE/FCC Compliant" },
            ],
            ports: ["1 x 10/100/1000 Base-T RJ45 (Data In)", "1 x 10/100/1000 Base-T PSE Port (90W PoE Out)"],
            ledPanel: "Mode A, Mode B, Power",
            power: { input: "100~240VAC, 50/60 Hz (Internal PSU); Output 56V DC Max.", consumption: "—", poeBudget: "90W" },
            environment: { tempOperating: "0°C ~ 40°C", housing: "Plastic Desktop, Fanless" },
            physical: { weight: "530 g (1.17 lb)", dimension: "180 x 71 x 37 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/03f1440ddc2c65850a0ae2fbcc23d814.pdf",
          },
        },
      ],
    },
    {
      id: "poe-splitters",
      title: "PoE Splitters",
      blurb:
        "PoE Splitter สำหรับแยกพลังงานจากสาย PoE ออกเป็นไฟ DC ให้กับอุปกรณ์ที่ไม่รองรับ PoE — รุ่น Industrial รับ 802.3bt และจ่าย 24V DC",
      products: [
        {
          model: "IPS-342P",
          description: "1×10/100/1000 btPoE + 1×10/100/1000 RJ45 Industrial PoE Splitter",
          image: imgIps342P,
          features: ["btPoE Input", "24V DC Out", "Industrial -40°C", "DIN-Rail", "IP30 Aluminum", "Plug & Play"],
          sourceUrl: detail(1690),
          details: {
            overview:
              "IPS-342P เป็น Industrial PoE Splitter แบบ Unmanaged รับไฟ btPoE (IEEE 802.3bt Type 3/4) จาก PSE แล้วแยกเป็น 24V DC สำหรับจ่ายให้อุปกรณ์ที่ไม่รองรับ PoE เช่น IP Camera, Wireless AP, ไฟ LED, Building Automation และ Industrial Control System ตัวเครื่อง IP30 Aluminum รองรับ DIN-Rail/Wall Mount ทำงาน -40°C ~ 75°C ลดจำนวนสายและจุดจ่ายไฟในระบบ — Plug & Play ไม่ต้องตั้งค่า",
            highlights: [
              { title: "btPoE Input (802.3bt)", desc: "รับไฟสูงสุด Type 4 4PPoE — รองรับ PoE/PoE+/PoE++" },
              { title: "24V DC Output × 2", desc: "แยกเป็น 2 จุดจ่ายไฟ DC พร้อม Power Isolation" },
              { title: "Industrial Wide-Temp", desc: "-40°C ~ 75°C — UL Certified ถึง 60°C" },
              { title: "SCP / OLP Protection", desc: "ป้องกันลัดวงจรและกระแสเกิน — ทนต่อสภาพแวดล้อมจริง" },
              { title: "DIN-Rail / Wall Mount", desc: "เลือกติดตั้งได้สะดวกในตู้อุตสาหกรรม" },
              { title: "Powered by ADI", desc: "ชิป Analog Devices คุณภาพอุตสาหกรรม" },
            ],
            ports: [
              "1 x 10/100/1000 BASE-T btPoE (Power In + Data)",
              "1 x 10/100/1000 BASE-T RJ45 (Data Pass-through)",
              "DIP Switch: DC ON/OFF",
            ],
            ledPanel: "System: PWR, V1, V2 / Interface: 30W, 60W, 90W, 1000, LNK/ACT",
            power: { input: "Power input via PoE Port (802.3bt)", consumption: "6W (System Only)" },
            environment: {
              tempOperating: "-40°C ~ 75°C (UL: -40°C ~ 60°C)",
              tempStorage: "-40°C ~ 85°C",
              humidity: "5 ~ 95% RH (non-condensing)",
              housing: "Aluminum (IP30 Protection), DIN-Rail / Wall Mount",
            },
            physical: { weight: "262.2 g (0.64 lb)", dimension: "25 x 116 x 100 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/d3a6a1679223d974146aed2a3ad824f9.pdf",
          },
        },
      ],
    },
  ],
};

/* ============================================================
 * Phase 9: Network Security Appliances — Industrial Firewall
 * id ตรงกับ productCategories[].id ใน Volktek.tsx → "firewall"
 * ============================================================ */
export const volktekFirewall: VolktekCategory = {
  id: "firewall",
  title: "Network Security Appliances",
  subCategories: [
    {
      id: "industrial-firewall",
      title: "Industrial Firewall",
      blurb:
        "Industrial Control Firewall ออกแบบเฉพาะสำหรับ ICS/SCADA — รองรับ Modbus, DNP3, IEC-61850 พร้อม LAN Bypass, VPN, Anti-Virus, Deep Packet Inspection สำหรับ OT Network",
      products: [
        {
          model: "3100-6GT-I",
          description: "Managed 6×10/100/1000 RJ45 Industrial Firewall with LAN Bypass",
          image: imgFw31006GTI,
          features: ["1.8 Gbps FW", "200 Mbps VPN", "ICS/SCADA", "Modbus/DNP3/IEC-61850", "LAN Bypass", "Industrial -40°C", "Fanless"],
          sourceUrl: detail(1676),
          details: {
            overview:
              "3100-6GT-I เป็น Industrial Control Firewall ของ Volktek ที่ออกแบบเฉพาะสำหรับ Industrial Control System (ICS) และ SCADA — เหมาะกับโรงงานอัตโนมัติ, Manufacturing Plant, น้ำมันและก๊าซ, การไฟฟ้า/โทรคมนาคม/ประปา ออกแบบให้ทนต่ออุณหภูมิสุดขั้ว ความชื้น ฝุ่น และการสั่นสะเทือน มี Hardware Bypass ในตัว — เมื่อระบบ Firewall เสียหรือไฟดับ Network Traffic ยังส่งผ่านได้ทำให้ขยาย IT Security ไปสู่ OT Environment ได้อย่างปลอดภัย\n\nรองรับ Deep Packet Inspection สำหรับ Protocol อุตสาหกรรมโดยเฉพาะ เช่น Modbus, DNP3, IEC-61850 และ Citrix สามารถตรวจจับ Connection Packet, Traffic และ Isolate การโจมตีอันตรายได้",
            highlights: [
              { title: "1.8 Gbps Firewall Throughput", desc: "200,000 Sessions พร้อม OPC 480 Mbps / Anti-Virus 350 Mbps" },
              { title: "LAN Bypass (Hardware)", desc: "Network ไม่ขาด แม้ Firewall ดับ — สำคัญมากสำหรับ OT Mission-Critical" },
              { title: "ICS Protocol DPI", desc: "Modbus, DNP3, IEC-61850, OPC Intrusion Prevention, Citrix" },
              { title: "VPN 200 Mbps (IPsec AES)", desc: "เข้ารหัสการสื่อสารระหว่างไซต์ปลอดภัย" },
              { title: "Authentication & Allowlist", desc: "Application Allowlisting, Access Management, Anti-Virus" },
              { title: "Industrial Wide-Temp Fanless", desc: "-40°C ~ 75°C, IP30 Metal, DIN-Rail / Wall Mount" },
              { title: "Central Management", desc: "รองรับ CMS และ Cloud Management สำหรับหลายไซต์" },
            ],
            ports: [
              "6 x 10/100/1000 Base-T RJ45 (1 Fixed + 5 Custom)",
              "1 set LAN Bypass Port (LAN 3 & 4)",
              "2 x RS-232 Serial Console Port",
              "1 x VGA Port",
              "2 x USB 3.0",
              "64GB SATA DOM (SLC)",
            ],
            ledPanel: "PWR, SATA DOM, System, ByPass, LINK/ACT, 1000, 100",
            power: { input: "9~36V DC", consumption: "—" },
            environment: {
              tempOperating: "-40°C ~ 75°C",
              tempStorage: "-40°C ~ 85°C",
              humidity: "10 ~ 80% (non-condensing)",
              housing: "Metal (IP30 Protection), DIN-Rail / Wall Mount, Fanless",
            },
            physical: { weight: "1,310 g (2.89 lb)", dimension: "74.5 x 146 x 126 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/0d1b2d2181fdc9c715037f31524e45c0.pdf",
          },
        },
      ],
    },
  ],
};

/* ============================================================
 * Phase 9: Accessories — Power Supply (DIN-Rail & AC Adapter)
 * id ตรงกับ productCategories[].id ใน Volktek.tsx → "accessories"
 * ============================================================ */
export const volktekAccessories: VolktekCategory = {
  id: "accessories",
  title: "Accessories",
  subCategories: [
    {
      id: "power-supply",
      title: "Power Supply",
      blurb:
        "Industrial Power Supply สำหรับจ่ายไฟให้กับ Switch, AP, IP Camera และอุปกรณ์เครือข่าย — มีทั้งรุ่น AC Adapter (IRA series) สำหรับจ่ายโดยตรง และ DIN-Rail Power Supply (SDR series) สำหรับติดตู้อุตสาหกรรม",
      products: [
        {
          model: "IRA-90",
          description: "90W 48V AC to DC Industrial Power Adapter (4-pin mini-DIN)",
          image: imgIra90,
          features: ["90W", "48V DC", "AC Adapter", "Industrial -30°C", "Level VI Efficiency", "Fanless"],
          sourceUrl: detail(103),
          details: {
            overview:
              "IRA-90 เป็น 90W AC to DC 4-pin mini-DIN Industrial Power Adapter เข้ากันได้กับ PoE Switch ทำงานในอุณหภูมิ -30°C ~ 70°C สาย 120 cm จาก Adapter ถึง Connector — Class I มีระบบป้องกัน Short Circuit, Overload, Over-Voltage และ Over-Temperature ผ่านมาตรฐาน EISA 2007/DoE, NR Can, AU/NZ MEPS, EU ErP, CoC Version 5 — ระดับประสิทธิภาพพลังงานสูงสุด (Level VI)",
            highlights: [
              { title: "90W / 48V DC / 1.87A", desc: "Universal AC Input 90~264VAC, 47~63Hz" },
              { title: "Industrial -30°C ~ 70°C", desc: "ทนอุณหภูมิกว้าง เหมาะกับงาน Outdoor Cabinet" },
              { title: "Level VI Energy Efficiency", desc: "ระดับประสิทธิภาพสูงสุด ประหยัดไฟ" },
              { title: "Built-in PFC", desc: "Power Factor Controller — No-load < 0.15W" },
              { title: "4-Protection System", desc: "Short Circuit / Overload / Over-Voltage / Over-Temp" },
              { title: "3-Pole IE320-C14 AC Inlet", desc: "ใช้สาย AC มาตรฐานสากล" },
            ],
            ports: ["AC Inlet: IE320-C14 (3-pole)", "DC Output: 4-pin mini-DIN (120 cm cable)"],
            power: { input: "90~264 VAC / 127~370 VDC, 47~63 Hz; Output: 48V DC, 1.87A, 90W", consumption: "No-load < 0.15W" },
            environment: {
              tempOperating: "-30°C ~ 70°C",
              tempStorage: "-40°C ~ 85°C",
              humidity: "20 ~ 90% RH (non-condensing)",
              housing: "Fanless, Plastic Adapter Enclosure",
            },
            physical: { weight: "0.45 kg", dimension: "60 x 32 x 145 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/8b41a3af4f4f9d74d11f697e5fbc734d.pdf",
          },
        },
        {
          model: "IRA-160",
          description: "160W 48V AC to DC Industrial Power Adapter (4-pin mini-DIN)",
          image: imgIra160,
          features: ["160W", "48V DC", "AC Adapter", "Industrial -30°C", "Level VI Efficiency", "Fanless"],
          sourceUrl: detail(104),
          details: {
            overview:
              "IRA-160 เป็น 160W AC to DC 4-pin mini-DIN Industrial Power Adapter รุ่นกำลังสูงของตระกูล IRA สำหรับ PoE Switch ที่ต้องจ่ายไฟอุปกรณ์ปลายทางหลายตัว ทำงาน -30°C ~ 70°C สาย 120 cm — Class I มีระบบป้องกัน 4 ชั้นและ Built-in PFC ผ่านมาตรฐาน EISA 2007/DoE, EU ErP, CoC V5 ระดับ Level VI Efficiency",
            highlights: [
              { title: "160W / 48V DC / 3.34A", desc: "Universal AC Input 85~264VAC, 47~63Hz" },
              { title: "Industrial -30°C ~ 70°C", desc: "ทนอุณหภูมิกว้าง สำหรับงาน Industrial / Outdoor" },
              { title: "Level VI Energy Efficiency", desc: "ระดับประสิทธิภาพพลังงานสูงสุด" },
              { title: "Built-in PFC", desc: "Power Factor Controller — No-load < 0.15W" },
              { title: "Over-Temperature Auto-Detect", desc: "ตรวจจับ 90°C±10°C ภายในเครื่อง — ป้องกันความเสียหาย" },
              { title: "4-Protection System", desc: "Short Circuit / Overload / Over-Voltage / Over-Temp" },
            ],
            ports: ["AC Inlet: IE320-C14 (3-pole)", "DC Output: 4-pin mini-DIN (120 cm cable)"],
            power: { input: "85~264 VAC / 120~370 VDC, 47~63 Hz; Output: 48V DC, 3.34A, 160W", consumption: "No-load < 0.15W" },
            environment: {
              tempOperating: "-30°C ~ 70°C",
              tempStorage: "-20°C ~ 85°C",
              humidity: "20 ~ 90% RH (non-condensing)",
              housing: "Fanless, Plastic Adapter Enclosure",
            },
            physical: { weight: "0.66 kg", dimension: "72 x 35 x 175 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/38a2268b91cbc6528860d5378825e7fd.pdf",
          },
        },
        {
          model: "SDR-120-48",
          description: "120W 48V Single Output Industrial DIN-Rail Power Supply",
          image: imgSdr12048,
          features: ["120W", "48V DC", "DIN-Rail", "Industrial -25°C", "PFC > 0.93", "DC OK Relay"],
          sourceUrl: detail(105),
          details: {
            overview:
              "SDR-120-48 เป็น Industrial Power Supply 120W 48V 2.5A Single Output ใช้ Terminal Block จ่ายไฟให้ Ethernet Switch, WAP, Surveillance Camera ตัวเครื่องมี DIN-Rail Adapter ติดตั้ง In-Click ง่าย Passive Cooling พร้อมระบบป้องกัน Overload ทำงาน -25°C ~ 70°C — ใช้ในโรงงาน, Outdoor Cabinet ผ่าน UL 508, TUV EN60950-1, EN60204-1 และ DNV approved (Marine)",
            highlights: [
              { title: "120W / 48V DC / 2.5A", desc: "Peak Power 180W (3 sec.) Universal AC 88~264VAC" },
              { title: "Active PFC > 0.93", desc: "Power Factor สูง ประหยัดไฟ และเป็นมิตรกับ Grid" },
              { title: "DIN-Rail TS-35 Mount", desc: "ติด DIN-Rail 7.5 หรือ 15 ในตู้อุตสาหกรรม" },
              { title: "DC OK Relay Contact", desc: "แจ้งเตือนสถานะไฟ DC ออกผ่าน Relay" },
              { title: "DNV Approved", desc: "ผ่านมาตรฐาน Marine — ใช้บนเรือและงานชายฝั่งได้" },
              { title: "Heavy Industry EMC", desc: "EN61000-4 / EN55024 / SEMI F47 (Voltage Sag Immunity)" },
            ],
            ports: ["Input: AC Terminal Block (L/N/PE)", "Output: 48V DC Terminal Block (V+/V-)", "DC OK Relay Contact"],
            power: { input: "88~264 VAC / 124~370 VDC, 47~63 Hz; Output: 48V DC, 2.5A, 120W (Peak 180W)", consumption: "1.4A @ 115VAC, 0.7A @ 230VAC" },
            environment: {
              tempOperating: "-25°C ~ 70°C",
              tempStorage: "-40°C ~ 85°C",
              humidity: "20 ~ 90% RH (non-condensing)",
              housing: "Metal, Fanless, DIN-Rail TS-35 / 7.5 / 15",
            },
            physical: { weight: "0.67 kg", dimension: "40 x 125.2 x 113.5 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/a35f45c566174f99a71da3976e96d599.pdf",
          },
        },
        {
          model: "SDR-240-48",
          description: "240W 48V Single Output Industrial DIN-Rail Power Supply",
          image: imgSdr24048,
          features: ["240W", "48V DC", "DIN-Rail", "Industrial -25°C", "PFC > 0.93", "DC OK Relay", "DNV Approved"],
          sourceUrl: detail(106),
          details: {
            overview:
              "SDR-240-48 เป็น Industrial Power Supply 240W 48V 5A Single Output ใช้ Terminal Block จ่ายไฟให้ Ethernet Switch, WAP, IP Camera หลายตัวพร้อมกัน DIN-Rail In-Click พร้อม Passive Cooling และ Overload Protection ทำงาน -25°C ~ 70°C ผ่าน UL 508, TUV EN60950-1, DNV (Marine) และ SEMI F47 — เหมาะกับโรงงาน, Substation, Outdoor Cabinet",
            highlights: [
              { title: "240W / 48V DC / 5A", desc: "Peak Power 360W (3 sec.) Universal AC 88~264VAC" },
              { title: "Active PFC > 0.93", desc: "ประหยัดไฟและเป็นมิตรกับ Grid" },
              { title: "DIN-Rail TS-35 Mount", desc: "ติด DIN-Rail ในตู้อุตสาหกรรม" },
              { title: "DC OK Relay + 100% Burn-in", desc: "Built-in DC OK Relay Contact + 100% full load burn-in test" },
              { title: "DNV / Marine Certified", desc: "ใช้บนเรือและงานชายฝั่งได้" },
              { title: "Heavy Industry EMC + SEMI F47", desc: "ทนการรบกวนทางไฟฟ้าระดับ Heavy Industry" },
            ],
            ports: ["Input: AC Terminal Block (L/N/PE)", "Output: 48V DC Terminal Block (V+/V-)", "DC OK Relay Contact"],
            power: { input: "88~264 VAC / 124~370 VDC, 47~63 Hz; Output: 48V DC, 5A, 240W (Peak 360W)", consumption: "2.6A @ 115VAC, 1.3A @ 230VAC" },
            environment: {
              tempOperating: "-25°C ~ 70°C",
              tempStorage: "-40°C ~ 85°C",
              humidity: "20 ~ 90% RH (non-condensing)",
              housing: "Metal, Fanless, DIN-Rail TS-35 / 7.5 / 15",
            },
            physical: { weight: "1.03 kg", dimension: "63 x 125.2 x 113.5 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/2085935b7e85f298c8fafc94e557ffae.pdf",
          },
        },
        {
          model: "SDR-480P-48",
          description: "480W 48V Single Output Industrial DIN-Rail Power Supply with Parallel Function",
          image: imgSdr480p48,
          features: ["480W", "48V DC", "DIN-Rail", "Industrial -25°C", "PFC > 0.94", "Parallel Function", "DNV Approved"],
          sourceUrl: detail(107),
          details: {
            overview:
              "SDR-480P-48 เป็น Industrial Power Supply 480W 48V 10A Single Output รุ่นกำลังสูงสุดของตระกูล SDR — มี Built-in Parallel Function สำหรับต่อขนานเพิ่มกำลังหรือทำ Redundancy เหมาะกับงานที่ต้องการพลังงานสูง เช่น PoE Switch หลายตัว, ระบบ CCTV ขนาดใหญ่, Substation ทำงาน -25°C ~ 70°C ผ่าน UL 508, TUV EN60950-1, DNV และ SEMI F47",
            highlights: [
              { title: "480W / 48V DC / 10A", desc: "Peak Power 720W (3 sec.) สำหรับงานกำลังสูง" },
              { title: "Built-in Parallel Function", desc: "ต่อขนานเพิ่มกำลังหรือทำ Redundancy ได้" },
              { title: "Active PFC > 0.94", desc: "Power Factor สูงกว่ารุ่นเล็ก ประหยัดไฟดียิ่งขึ้น" },
              { title: "DC OK Relay + 100% Burn-in", desc: "Built-in DC OK Relay + Full Load Burn-in Test" },
              { title: "DNV / SEMI F47 Certified", desc: "ใช้บนเรือ, โรงงานเซมิคอนดักเตอร์ได้" },
              { title: "DIN-Rail TS-35 Mount", desc: "ติดตั้งในตู้อุตสาหกรรมได้สะดวก" },
            ],
            ports: ["Input: AC Terminal Block (L/N/PE)", "Output: 48V DC Terminal Block (V+/V-)", "DC OK Relay + Parallel Connector"],
            power: { input: "90~264 VAC / 127~370 VDC, 47~63 Hz; Output: 48V DC, 10A, 480W (Peak 720W)", consumption: "5A @ 115VAC, 2.5A @ 230VAC" },
            environment: {
              tempOperating: "-25°C ~ 70°C",
              tempStorage: "-40°C ~ 85°C",
              humidity: "20 ~ 95% RH (non-condensing)",
              housing: "Metal, Fanless, DIN-Rail TS-35 / 7.5 / 15",
            },
            physical: { weight: "1.6 kg", dimension: "85.5 x 125.2 x 128.5 mm" },
            datasheetUrl: "https://www.volktek.com/_i/assets/file/productdownload/06bc63aeb044a64829af1765a7835d8f.pdf",
          },
        },
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
].map(applySlugUrls);


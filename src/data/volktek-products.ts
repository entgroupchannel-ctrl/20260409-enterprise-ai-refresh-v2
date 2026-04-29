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
              poeBudget: "120W (30W/port)",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C (UL: -40°C ~ 70°C)",
              housing: "Aluminum (IP30)",
            },
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
              poeBudget: "240W @ 48VDC หรือ 124W @ 24VDC",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C",
              housing: "Aluminum (IP30)",
            },
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
              poeBudget: "240W @ 48VDC หรือ 124W @ 24VDC",
            },
            environment: {
              tempOperating: "-40°C ~ 75°C",
              housing: "Aluminum (IP30)",
            },
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
].map(applySlugUrls);


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

export type VolktekProduct = {
  model: string;
  description: string;
  image: string;
  features: string[];
  sourceUrl: string;
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
          sourceUrl: "https://www.volktek.com/productdetail_en.php?id=1726",
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
          sourceUrl: "https://www.volktek.com/productdetail_en.php?id=1725",
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
 * Master export — เพิ่ม category อื่นใน phase ถัดไป
 * ============================================================ */
export const volktekCatalog: VolktekCategory[] = [
  volktekLayer3,
  volktekIndustrialPoe,
  // Phase 4+: industrial-ethernet, metro-ethernet, media-converter, ...
];


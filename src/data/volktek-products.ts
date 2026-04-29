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
 * Master export — เพิ่ม category อื่นใน phase ถัดไป
 * ============================================================ */
export const volktekCatalog: VolktekCategory[] = [
  volktekLayer3,
  // Phase 2+: industrial-ethernet, industrial-poe, metro-ethernet, ...
];

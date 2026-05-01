/**
 * Mapping ระหว่าง Volktek Product Model → Real-World Solutions
 * ใช้ใน VolktekProductDialog เพื่อแสดง solutions ที่รุ่นนั้นเหมาะใช้งาน
 *
 * Source of truth: SOLUTIONS array ใน VolktekSolutions.tsx
 * ดึงออกมาเป็น data file เพื่อหลีกเลี่ยง circular import
 */

export type SolutionRef = {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
};

/** รายการ Solutions ทั้งหมด — ต้องตรงกับ SOLUTIONS ใน VolktekSolutions.tsx */
export const VOLKTEK_SOLUTIONS: (SolutionRef & { recommendedModels: string[] })[] = [
  {
    id: "corporations",
    title: "องค์กรขนาดใหญ่ (Corporations)",
    shortTitle: "องค์กร",
    category: "FTTBiz",
    recommendedModels: ["9561-8GT4XS-TSN", "9560-16GP4XS-I", "9005-24GP2GS", "MEN-6412"],
  },
  {
    id: "small-business",
    title: "ธุรกิจขนาดเล็ก-กลาง (SMB)",
    shortTitle: "SMB",
    category: "FTTBiz",
    recommendedModels: ["MEN-3410", "MEN-3406", "INS-8424P", "IEN-8408P-24V"],
  },
  {
    id: "convenience-stores",
    title: "ร้านสะดวกซื้อ",
    shortTitle: "ร้านสะดวกซื้อ",
    category: "FTTBiz",
    recommendedModels: ["MEN-3406", "INS-8424P", "IEN-8205P-24V", "HNS-8405P"],
  },
  {
    id: "high-rise",
    title: "อาคารสูง / High-Rise Apartments",
    shortTitle: "อาคารสูง",
    category: "FTTB",
    recommendedModels: ["9005-24GP2GS", "9005-16GP2GS", "MEN-6412", "INS-8624P"],
  },
  {
    id: "property-developers",
    title: "นักพัฒนาอสังหาฯ",
    shortTitle: "Property Dev",
    category: "FTTB",
    recommendedModels: ["MEN-6412", "9005-24GP2GS", "INS-8624P", "MEN-3410"],
  },
  {
    id: "villas",
    title: "บ้านเดี่ยว / Villas",
    shortTitle: "บ้านเดี่ยว",
    category: "FTTB",
    recommendedModels: ["MEN-3406", "INS-840G", "INS-8005A", "INS-8405A"],
  },
  {
    id: "townhouses",
    title: "ทาวน์เฮาส์",
    shortTitle: "ทาวน์เฮาส์",
    category: "FTTB",
    recommendedModels: ["MEN-3410", "MEN-3406", "IEN-8225P-24V", "INS-8424P"],
  },
  {
    id: "condos",
    title: "คอนโดมิเนียม",
    shortTitle: "คอนโด",
    category: "FTTH",
    recommendedModels: ["MEN-6412", "9005-16GP2GS", "INS-8624P", "MEN-3410"],
  },
];

/** หา solutions ที่ใช้ model นี้ */
export function getSolutionsForModel(model: string): SolutionRef[] {
  return VOLKTEK_SOLUTIONS.filter((s) => s.recommendedModels.includes(model)).map(
    ({ id, title, shortTitle, category }) => ({ id, title, shortTitle, category }),
  );
}

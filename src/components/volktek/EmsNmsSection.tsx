import { Activity } from "lucide-react";
import VolktekCategorySection from "@/components/volktek/VolktekCategorySection";
import { volktekEmsNms } from "@/data/volktek-products";

/**
 * Phase 7 — EMS / NMS Software (รุ่นจริงจากโรงงาน Volktek)
 * 2 sub-categories, 2 products
 */
const EmsNmsSection = () => (
  <VolktekCategorySection
    category={volktekEmsNms}
    icon={Activity}
    phaseLabel="Phase 7"
    anchorId="ems-nms-detail"
  />
);

export default EmsNmsSection;

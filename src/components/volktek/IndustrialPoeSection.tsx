import { Zap } from "lucide-react";
import VolktekCategorySection from "@/components/volktek/VolktekCategorySection";
import { volktekIndustrialPoe } from "@/data/volktek-products";

/**
 * Phase 3 — Industrial PoE Switches (รุ่นจริงจากโรงงาน Volktek)
 * 9 sub-categories, 27 products
 */
const IndustrialPoeSection = () => (
  <VolktekCategorySection
    category={volktekIndustrialPoe}
    icon={Zap}
    phaseLabel="Phase 3"
    anchorId="industrial-poe-detail"
  />
);

export default IndustrialPoeSection;

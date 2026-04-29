import { Radio } from "lucide-react";
import VolktekCategorySection from "@/components/volktek/VolktekCategorySection";
import { volktekSfp } from "@/data/volktek-products";

/**
 * Phase 8 — SFP Modules (รุ่นจริงจากโรงงาน Volktek)
 * 5 sub-categories, 7 products
 */
const SfpSection = () => (
  <VolktekCategorySection
    category={volktekSfp}
    icon={Radio}
    phaseLabel="Phase 8"
    anchorId="sfp-detail"
  />
);

export default SfpSection;

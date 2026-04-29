import { Cable } from "lucide-react";
import VolktekCategorySection from "@/components/volktek/VolktekCategorySection";
import { volktekMediaConverter } from "@/data/volktek-products";

/**
 * Phase 6 — Media Converters (รุ่นจริงจากโรงงาน Volktek)
 * 4 sub-categories, 14 products
 */
const MediaConverterSection = () => (
  <VolktekCategorySection
    category={volktekMediaConverter}
    icon={Cable}
    phaseLabel="Phase 6"
    anchorId="media-converter-detail"
  />
);

export default MediaConverterSection;

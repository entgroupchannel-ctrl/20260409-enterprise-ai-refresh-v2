import { Globe } from "lucide-react";
import VolktekCategorySection from "@/components/volktek/VolktekCategorySection";
import { volktekMetroEthernet } from "@/data/volktek-products";

/**
 * Phase 5 — Metro Ethernet Switches (รุ่นจริงจากโรงงาน Volktek)
 * 2 sub-categories, 5 products
 */
const MetroEthernetSection = () => (
  <VolktekCategorySection
    category={volktekMetroEthernet}
    icon={Globe}
    phaseLabel="Phase 5"
    anchorId="metro-ethernet-detail"
  />
);

export default MetroEthernetSection;

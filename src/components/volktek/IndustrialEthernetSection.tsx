import { Network } from "lucide-react";
import VolktekCategorySection from "@/components/volktek/VolktekCategorySection";
import { volktekIndustrialEthernet } from "@/data/volktek-products";

/**
 * Phase 4 — Industrial Ethernet Switches (รุ่นจริงจากโรงงาน Volktek)
 * 11 sub-categories, 43 products
 */
const IndustrialEthernetSection = () => (
  <VolktekCategorySection
    category={volktekIndustrialEthernet}
    icon={Network}
    phaseLabel="Phase 4"
    anchorId="industrial-ethernet-detail"
  />
);

export default IndustrialEthernetSection;

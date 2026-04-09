import HeroSection from "@/components/HeroSection";
import EdgeAISection from "@/components/EdgeAISection";
import SoftwareSection from "@/components/SoftwareSection";
import ProductHighlights from "@/components/ProductHighlights";
import ProductBanners from "@/components/ProductBanners";
import ProductSections from "@/components/ProductSections";
import ProductLineup from "@/components/ProductLineup";
import PromoBanners from "@/components/PromoBanners";
import CaseStudiesSection from "@/components/CaseStudiesSection";

import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="ENT Group — Mini PC, Panel PC, Industrial Computer ประเทศไทย"
        description="ผู้นำเข้าและจำหน่าย Mini PC, Panel PC, Rugged Tablet, Industrial Computer จากโรงงานโดยตรง บริการครบวงจรสำหรับโรงงาน สำนักงาน และงานโครงการทั่วประเทศไทย"
        path="/"
      />
      <HeroSection />
      <EdgeAISection />
      <ProductHighlights />
      <ProductBanners />
      <ProductSections />
      <ProductLineup />
      <SoftwareSection />
      <CaseStudiesSection />
      <PlatformInviteBanner />
      <PromoBanners />
      <Footer />
    </div>
  );
};

export default Index;

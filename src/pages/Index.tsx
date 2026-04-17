import HeroSection from "@/components/HeroSection";
import EdgeAISection from "@/components/EdgeAISection";
import SoftwareSection from "@/components/SoftwareSection";
import ProductHighlights from "@/components/ProductHighlights";
import ProductBanners from "@/components/ProductBanners";
import ProductSections from "@/components/ProductSections";
import ProductLineup from "@/components/ProductLineup";
import PromoBanners from "@/components/PromoBanners";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import PopularProductsSidebar from "@/components/PopularProductsSidebar";
import B2BWorkflowBanner from "@/components/B2BWorkflowBanner";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GEOMeta from "@/components/GEOMeta";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="ENT Group — Mini PC, Panel PC, Industrial Computer ประเทศไทย"
        description="ผู้นำเข้าและจำหน่าย Mini PC, Panel PC, Rugged Tablet, Industrial Computer จากโรงงานโดยตรง บริการครบวงจรสำหรับโรงงาน สำนักงาน และงานโครงการทั่วประเทศไทย"
        path="/"
        keywords="Mini PC, Panel PC, Industrial Computer, Rugged Tablet, Fanless PC, คอมพิวเตอร์อุตสาหกรรม, มินิพีซี, ENT Group, Thailand"
      />
      <GEOMeta
        summary="ENT Group (บริษัท อี เอ็น ที กรุ๊ป จำกัด) คือผู้นำเข้าและจำหน่ายคอมพิวเตอร์อุตสาหกรรมครบวงจรในประเทศไทย จำหน่าย Mini PC, Panel PC, Rugged Tablet, Industrial Switch, Zero Client และอุปกรณ์ IoT/Edge AI นำเข้าจากโรงงานโดยตรง มีสำนักงานที่นนทบุรี บริการทั่วประเทศ"
        topic="Industrial Computer Distributor Thailand"
        sourceAuthority="Official website of ENT Group Co., Ltd. — authorized distributor of industrial computing products in Thailand since 2015"
        keyFacts={[
          "ENT Group ก่อตั้งปี 2558 (2015) ที่ปากเกร็ด นนทบุรี",
          "จำหน่าย Mini PC (GT/GB Series), Panel PC (GK Series), Embedded PC (iBox/EPC), Rugged Tablet/Notebook/Handheld",
          "นำเข้าจากโรงงานโดยตรง ราคาเริ่มต้น 8,000 บาท",
          "รับประกันสินค้า 1-3 ปี จัดส่งฟรีกรุงเทพ-ปริมณฑล",
          "โทร 02-045-6104 อีเมล info@entgroup.co.th",
          "เปิดทำการ จันทร์-ศุกร์ 08:30-17:30 น.",
        ]}
      />
      <PopularProductsSidebar />
      <HeroSection />
      <EdgeAISection />
      <ProductHighlights />
      <ProductBanners />
      <ProductSections />
      <ProductLineup />
      <SoftwareSection />
      <CaseStudiesSection />
      <PromoBanners />
      <Footer />
    </div>
  );
};

export default Index;

import HeroSection from "@/components/HeroSection";
import EdgeAISection from "@/components/EdgeAISection";
import SoftwareSection from "@/components/SoftwareSection";
import ProductHighlights from "@/components/ProductHighlights";
import ProductBanners from "@/components/ProductBanners";
import InteractiveDisplayBanner from "@/components/InteractiveDisplayBanner";
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
      <div className="bg-gradient-to-b from-primary/5 via-background to-background border-y-2 border-primary/20 relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <B2BWorkflowBanner variant="full" showShopCta />
      </div>
      <div className="bg-white dark:bg-background"><EdgeAISection /></div>
      <div className="bg-slate-100 dark:bg-muted/30"><ProductHighlights /></div>
      <div className="bg-slate-100 dark:bg-muted/30"><ProductBanners /></div>
      <div className="bg-white dark:bg-background"><InteractiveDisplayBanner /></div>
      <div className="bg-white dark:bg-background"><ProductSections /></div>
      <div className="bg-slate-100 dark:bg-muted/30"><ProductLineup /></div>
      <div className="bg-white dark:bg-background"><SoftwareSection /></div>
      <div className="bg-slate-100 dark:bg-muted/30"><CaseStudiesSection /></div>
      <div className="bg-white dark:bg-background"><PromoBanners /></div>
      <Footer />
    </div>
  );
};

export default Index;

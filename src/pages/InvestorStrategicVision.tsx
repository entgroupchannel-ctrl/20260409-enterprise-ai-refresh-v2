import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StrategicVisionTabs from "@/components/investors/StrategicVisionTabs";

const StrategicVision = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="ทิศทางเชิงกลยุทธ์ | ENT Group Investor Relations"
        description="วิสัยทัศน์ จุดยืน SWOT และกลยุทธ์การแข่งขันของ ENT Group ในตลาด Industrial Computer ของประเทศไทย"
        path="/investors/strategic-vision"
      />
      <SiteNavbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
        <Link to="/" className="hover:text-primary">หน้าแรก</Link>
        <ArrowRight className="w-3 h-3" />
        <Link to="/investors" className="hover:text-primary">Investor Relations</Link>
        <ArrowRight className="w-3 h-3" />
        <span className="text-foreground font-medium">Strategic Vision</span>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              <Compass className="w-3.5 h-3.5 mr-1.5" /> Strategic Vision 2026–2028
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              สนามที่เราเลือกเล่น<br />
              <span className="text-primary">คือสนามที่เราจะชนะ</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              ENT Group ไม่ได้พยายามเป็นทุกอย่างให้ทุกคน เราเลือกจุดยืนชัดเจน — เป็น
              <span className="text-foreground font-semibold"> Industrial Computer Partner อันดับหนึ่งของ SME ไทย</span>
            </p>
          </div>
        </div>
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 bottom-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </section>

      {/* Tabs */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-6xl">
          <StrategicVisionTabs />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">ร่วมเดินทางไปกับเรา</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            เราเปิดรับ Strategic Partners ที่เห็นโอกาสในตลาด Industrial Computer ของไทย และต้องการเป็นส่วนหนึ่งในการสร้าง Thai Champion
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/investors">
              <Button size="lg" className="gap-2">
                สนใจร่วมเป็น Partner <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/about-us">
              <Button size="lg" variant="outline">รู้จัก ENT Group เพิ่มเติม</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StrategicVision;

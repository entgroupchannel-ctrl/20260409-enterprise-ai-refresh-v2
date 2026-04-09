import { Link } from "react-router-dom";
import { ArrowLeft, Building2, FileText, Phone, TrendingDown, ShieldCheck, Headphones, Layers, Truck, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Footer from "@/components/Footer";
import QuoteDialog from "@/components/QuoteDialog";
import { useState, useEffect, useRef } from "react";
import heroImg from "@/assets/corporate-hero-v2.jpg";
import factoryImg from "@/assets/corporate-factory.jpg";

const tiers = [
  { qty: "5–9 เครื่อง", discount: "ส่วนลดพิเศษ", icon: Layers, highlight: false },
  { qty: "10–49 เครื่อง", discount: "ส่วนลด + จัดส่งฟรี", icon: Truck, highlight: false },
  { qty: "50–99 เครื่อง", discount: "ราคาโปรเจกต์ + On-site", icon: Building2, highlight: true },
  { qty: "100+ เครื่อง", discount: "ราคา OEM/ODM พิเศษ", icon: Award, highlight: false },
];

const benefits = [
  { icon: TrendingDown, title: "ส่วนลดตามจำนวน", desc: "ยิ่งซื้อมาก ยิ่งประหยัด ด้วยโครงสร้างราคาแบบขั้นบันได" },
  { icon: ShieldCheck, title: "รับประกันขยาย", desc: "ขยายการรับประกันได้สูงสุด 3 ปี สำหรับโครงการขนาดใหญ่" },
  { icon: Headphones, title: "Account Manager เฉพาะ", desc: "มีผู้ดูแลบัญชีประจำ พร้อมช่องทางติดต่อเร่งด่วน" },
  { icon: FileText, title: "เอกสารครบถ้วน", desc: "ใบเสนอราคา ใบกำกับภาษี หนังสือค้ำประกัน ครบจบในที่เดียว" },
];

const steps = [
  { step: 1, title: "ติดต่อทีมขาย", desc: "แจ้งรายการสินค้า จำนวน และ Timeline ที่ต้องการ" },
  { step: 2, title: "รับใบเสนอราคา", desc: "ทีมงานจัดทำใบเสนอราคาพิเศษภายใน 1 วันทำการ" },
  { step: 3, title: "อนุมัติและสั่งซื้อ", desc: "อนุมัติ PO พร้อมเงื่อนไขการชำระเงินที่ยืดหยุ่น" },
  { step: 4, title: "จัดส่งและติดตั้ง", desc: "จัดส่งพร้อมทีมวิศวกรติดตั้ง On-site (ถ้าต้องการ)" },
];


const stats = [
  { value: "8,000+", label: "ลูกค้าองค์กร" },
  { value: "10+", label: "ปีประสบการณ์" },
  { value: "50+", label: "แบรนด์พาร์ทเนอร์" },
  { value: "24 ชม.", label: "ตอบกลับเร็ว" },
];

/* Intersection Observer hook for scroll animations */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const CorporatePricing = () => {
  const [showQuote, setShowQuote] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="ราคาองค์กร & Volume Discount — ENT Group"
        description="เงื่อนไขราคาพิเศษสำหรับองค์กร โรงงาน และโครงการขนาดใหญ่ ส่วนลดตามจำนวน พร้อมบริการ Account Manager เฉพาะ"
        path="/corporate-pricing"
      />

      {/* ─── HERO ─── */}
      <section className="relative h-[420px] md:h-[520px] overflow-hidden">
        <img
          src={heroImg}
          alt="Corporate partnership"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out ${heroLoaded ? "scale-100" : "scale-110"}`}
          width={1920}
          height={768}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="relative h-full flex items-center">
          <div className="container max-w-7xl mx-auto px-6">
            <div className={`max-w-2xl transition-all duration-1000 ease-out ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm text-xs px-3 py-1">
                B2B Enterprise Program
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                ราคาองค์กร &<br />Volume Discount
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-8 max-w-lg">
                เงื่อนไขพิเศษสำหรับลูกค้าองค์กร โรงงาน และโครงการภาครัฐ — ส่วนลดตามปริมาณ พร้อมทีมดูแลเฉพาะ
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => setShowQuote(true)}
                  className="text-base px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg"
                >
                  <FileText className="w-5 h-5 mr-2" /> ขอใบเสนอราคาองค์กร
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="text-base px-8 bg-foreground text-background hover:bg-foreground/90 font-bold shadow-lg border-0"
                >
                  <Link to="/contact">
                    <Phone className="w-5 h-5 mr-2" /> ติดต่อทีมขาย
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Back navigation */}
        <div className="absolute top-4 left-0 right-0">
          <div className="container max-w-7xl mx-auto px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-foreground text-background">
        <div className="container max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 100}>
                <div className="text-2xl md:text-3xl font-bold text-primary">{s.value}</div>
                <div className="text-xs md:text-sm opacity-70 mt-1">{s.label}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VOLUME TIERS ─── */}
      <section className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">Volume Discount</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">โครงสร้างส่วนลดตามจำนวน</h2>
            <p className="text-muted-foreground mt-2">ราคาพิเศษสำหรับการสั่งซื้อจำนวนมาก</p>
          </div>
        </AnimatedSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {tiers.map((t, i) => (
            <AnimatedSection key={t.qty} delay={i * 120}>
              <Card className={`text-center border-border/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${t.highlight ? "ring-2 ring-primary shadow-lg relative" : ""}`}>
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-[10px]">แนะนำ</Badge>
                  </div>
                )}
                <CardContent className="p-6 pt-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <t.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-lg font-bold text-foreground mb-2">{t.qty}</div>
                  <p className="text-sm text-muted-foreground">{t.discount}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          * ส่วนลดและเงื่อนไขขึ้นอยู่กับรุ่นสินค้าและโปรโมชันปัจจุบัน กรุณาติดต่อทีมขายเพื่อรับใบเสนอราคาที่แม่นยำ
        </p>
      </section>

      {/* ─── BENEFITS ─── */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">Enterprise Benefits</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">สิทธิพิเศษลูกค้าองค์กร</h2>
            </div>
          </AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {benefits.map((b, i) => (
              <AnimatedSection key={b.title} delay={i * 100}>
                <Card className="border-border/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                      <b.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT SHOWCASE ─── */}
      <section className="relative py-16 overflow-hidden">
        <img src={factoryImg} alt="Industrial application" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative container max-w-5xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">สินค้าครอบคลุมทุกอุตสาหกรรม</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Panel PC, Rugged Tablet, Mini PC Firewall, Industrial Notebook และอีกมากมาย — ทุกรุ่นรองรับราคาองค์กร
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {["Panel PC / AIO", "Rugged Tablet", "Rugged Notebook", "Mini PC", "Firewall", "Handheld PDA", "Smart Display"].map((cat) => (
                <Badge key={cat} className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-3 py-1.5">
                  {cat}
                </Badge>
              ))}
            </div>
            <Button
              size="lg"
              onClick={() => setShowQuote(true)}
              className="text-base px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              <FileText className="w-5 h-5 mr-2" /> ขอใบเสนอราคาทันที
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="container mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">How It Works</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">ขั้นตอนการขอใบเสนอราคาองค์กร</h2>
          </div>
        </AnimatedSection>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-border" />
          {steps.map((s, i) => (
            <AnimatedSection key={s.step} delay={i * 150}>
              <div className="text-center space-y-3 relative">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold relative z-10 shadow-md">
                  {s.step}
                </div>
                <h3 className="font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>



      {/* ─── FINAL CTA ─── */}
      <section className="bg-foreground text-background py-16">
        <div className="container max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">พร้อมเริ่มต้นโปรเจกต์ของคุณ?</h2>
            <p className="opacity-70 mb-8">ทีมขายของเราพร้อมให้คำปรึกษา และจัดทำใบเสนอราคาพิเศษภายใน 1 วันทำการ</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => setShowQuote(true)}
                className="text-base px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              >
                <FileText className="w-5 h-5 mr-2" /> ขอใบเสนอราคาองค์กร
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 border-background/30 text-background hover:bg-background/10 text-slate-600"
                asChild
              >
                <Link to="/contact">
                  <Phone className="w-5 h-5 mr-2" /> ติดต่อทีมขาย
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <QuoteDialog
        open={showQuote}
        onClose={() => setShowQuote(false)}
        productCategory="Corporate / Volume Order"
      />

      <Footer />
    </div>
  );
};

export default CorporatePricing;

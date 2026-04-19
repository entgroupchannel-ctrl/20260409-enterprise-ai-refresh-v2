import { Link } from "react-router-dom";
import { ArrowRight, Target, Compass, Layers, Shield, Rocket, Building2, TrendingUp, CheckCircle2, Factory, Store, Stethoscope } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const StrategicVision = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="ทิศทางเชิงกลยุทธ์ | ENT Group Investor Relations"
        description="วิสัยทัศน์และจุดยืนของ ENT Group ในตลาด Industrial Computer ของประเทศไทย — สนามที่เราเลือกครอง และเส้นทางสู่การเป็นผู้นำของ SME ไทย"
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 md:py-28">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              <Compass className="w-3.5 h-3.5 mr-1.5" /> Strategic Vision 2026–2028
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              สนามที่เราเลือกเล่น<br />
              <span className="text-primary">คือสนามที่เราจะชนะ</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              ENT Group ไม่ได้พยายามเป็นทุกอย่างให้ทุกคน เราเลือกจุดยืนชัดเจน — เป็น
              <span className="text-foreground font-semibold"> Industrial Computer Partner อันดับหนึ่งของ SME ไทย </span>
              ด้วยความเร็ว ความใกล้ชิด และราคาที่เข้าถึงได้จริง
            </p>
          </div>
        </div>
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 bottom-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </section>

      {/* Our Position */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3"><Target className="w-3.5 h-3.5 mr-1.5" />จุดยืนของเรา</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">"The Thai Champion" Narrative</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              อุตสาหกรรมไทย โดยคนไทย เพื่อคนไทย — ไม่ต้องรอ HQ ต่างประเทศ 7 วัน เราแก้ปัญหาให้คุณวันนี้
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Rocket, title: "ความเร็ว", desc: "ตอบกลับใบเสนอราคาภายใน 24 ชม. แก้ปัญหาเทคนิคใน 2 ชม. ไม่ใช่ 2 สัปดาห์" },
              { icon: Shield, title: "ดูแลใกล้ชิดทุกบัญชี", desc: "ลูกค้าทุกรายมี Sales Account Manager เฉพาะ พร้อมทีมเทคนิคภาษาไทย รองรับเข้าหน้างานทั่วประเทศ" },
              { icon: TrendingUp, title: "ราคาที่จับต้องได้", desc: "ต้นทุนต่ำกว่าแบรนด์โกลบอล 30–40% ด้วยคุณภาพ Industrial-grade เทียบเท่า" },
            ].map((item) => (
              <Card key={item.title} className="border-border/60 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Battlegrounds We Win */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 text-primary border-primary/30">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 3 สนามที่เราจะครอง
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">เลือกชนะในสนามที่เราถนัด</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                num: "01",
                title: "SME & โรงงานขนาดกลาง (100–500 คน)",
                desc: "ตลาด SME ไทยมีกว่า 3.2 ล้านกิจการ ต้องการ Industrial PC ที่ราคาคุ้มและบริการรวดเร็ว — เราเหมาะที่สุดเพราะ overhead ต่ำ รับ order เล็กได้ ขั้นตอนสั้น",
                stat: "3.2M+ SMEs",
              },
              {
                num: "02",
                title: "Custom Solution + After-sales ใกล้ชิด",
                desc: "ลูกค้าโทรหาเราโดยตรง ไม่ต้องผ่าน call center ต่างประเทศ ปัญหาเทคนิคแก้ใน 2 ชั่วโมง ไม่ใช่ RMA 4 สัปดาห์",
                stat: "2hr Response SLA",
              },
              {
                num: "03",
                title: "Mid-tier Pricing สำหรับงานที่ต้องการคุณภาพคุ้มราคา",
                desc: "ไม่ใช่ทุกงานต้องการแบรนด์ระดับโลก สำหรับโรงงาน ร้านค้าปลีก และคลินิกที่ต้องการ 'ของดีใช้ได้จริง' — เราชนะขาด",
                stat: "30–40% lower TCO",
              },
            ].map((b) => (
              <Card key={b.num} className="border-border/60">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-6">
                    <div className="text-5xl md:text-6xl font-bold text-primary/20 leading-none">{b.num}</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl">{b.title}</h3>
                        <Badge variant="secondary" className="text-xs">{b.stat}</Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vertical Focus */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3"><Layers className="w-3.5 h-3.5 mr-1.5" />Niche Domination</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">3 Vertical ที่เราจะเป็นที่ 1</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              แทนที่จะสู้ทุกตลาด เราเลือก 3 อุตสาหกรรมเป้าหมาย รวมมูลค่าตลาดกว่า 10,000 ล้านบาท/ปี
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Factory, title: "Food & Beverage Manufacturing", market: "~5,000 ลบ./ปี", desc: "80,000+ โรงงานอาหาร/เครื่องดื่ม ต้องการ automation, MES, Traceability" },
              { icon: Store, title: "Retail Chain ระดับกลาง", market: "~3,000 ลบ./ปี", desc: "ร้านสะดวกซื้อรอง ร้านอาหารเชน ต้องการ POS, Kiosk, Digital Signage ราคาคุ้ม" },
              { icon: Stethoscope, title: "Medical & Private Clinic", market: "~2,000 ลบ./ปี", desc: "รพ.เอกชน คลินิก ต้องการ Medical PC + Tablet ที่ผ่านมาตรฐาน" },
            ].map((v) => (
              <Card key={v.title} className="border-border/60 hover:border-primary/30 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <v.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{v.title}</h3>
                  <Badge variant="outline" className="text-xs mb-3">{v.market}</Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-lg bg-primary/5 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground mb-1">รวมมูลค่าตลาดเป้าหมาย</p>
            <p className="text-3xl md:text-4xl font-bold text-primary">10,000+ ลบ./ปี</p>
            <p className="text-sm text-muted-foreground mt-2">เป้าหมาย 3 ปี: ส่วนแบ่ง 1% = 100 ลบ./ปี (5 เท่าของรายได้ปัจจุบัน)</p>
          </div>
        </div>
      </section>

      {/* Moat */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 text-primary border-primary/30">
              <Building2 className="w-3.5 h-3.5 mr-1.5" /> Our Moat
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">B2B Platform คือคูเมืองของเรา</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ในขณะที่คู่แข่งระดับโลกใหญ่เกินกว่าจะปรับตัวเร็ว เราสร้างแพลตฟอร์ม RFQ → Quote → PO → Invoice + AI Assistant ที่ทำงานครบวงจร
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "End-to-end B2B Workflow", desc: "ลูกค้าขอใบเสนอราคา รับ PO ออกใบกำกับภาษี และติดตามการจัดส่ง — ทุกอย่างในที่เดียว" },
              { title: "AI-powered Sales Assistant", desc: "ระบบช่วยเลือกสินค้าและเก็บ Lead 24/7 ลด workload ทีมขาย เพิ่ม conversion rate" },
              { title: "Affiliate & Partner Network", desc: "เครือข่ายตัวแทนและ System Integrator ขยายการเข้าถึงลูกค้าโดยไม่เพิ่มต้นทุนคงที่" },
              { title: "Direct Factory Sourcing", desc: "นำเข้าจากโรงงาน Tier-1 Taiwan/China โดยตรง ตัดคนกลาง ส่งต่อความคุ้มค่าให้ลูกค้า" },
            ].map((m) => (
              <Card key={m.title} className="border-border/60">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> {m.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-7">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">90-Day Action Plan</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">เส้นทาง 3 เดือนข้างหน้า</h2>
          </div>

          <div className="space-y-4">
            {[
              { month: "เดือนที่ 1", title: "Market Research", items: ["สำรวจลูกค้า ENT 20 ราย", "Gap price analysis 10 รุ่นหลัก", "สัมภาษณ์ System Integrator 5 ราย"] },
              { month: "เดือนที่ 2", title: "Positioning Refinement", items: ["เลือก 2 vertical หลัก", "Case study 5 เรื่อง", "Landing page แยก vertical"] },
              { month: "เดือนที่ 3", title: "Market Activation", items: ["สัมมนาออนไลน์ 'Industrial PC for Thai SME'", "Referral program สำหรับลูกค้าเก่า", "เปิดตารางเปรียบเทียบสเปก/ราคาแบบโปร่งใส"] },
            ].map((phase, i) => (
              <Card key={phase.month} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-primary font-semibold mb-1">{phase.month}</p>
                      <h3 className="font-bold text-lg mb-3">{phase.title}</h3>
                      <ul className="space-y-1.5">
                        {phase.items.map((item) => (
                          <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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

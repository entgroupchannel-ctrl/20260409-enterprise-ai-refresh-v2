import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  CheckCircle2,
  Sparkles,
  Target,
  HandshakeIcon,
  ShieldCheck,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/contexts/I18nContext";

const TIERS = [
  {
    name: "Bronze",
    color: "from-amber-700 to-amber-900",
    leadFee: 200,
    saleRate: 2,
    minSales: "0–500K",
    perks: ["Per-lead ฿200", "Per-sale 2%", "Marketing kit พื้นฐาน"],
  },
  {
    name: "Silver",
    color: "from-slate-400 to-slate-600",
    leadFee: 300,
    saleRate: 3,
    minSales: "500K–1.5M",
    perks: ["Per-lead ฿300", "Per-sale 3%", "Co-branded materials", "Sales support"],
  },
  {
    name: "Gold",
    color: "from-yellow-400 to-yellow-600",
    leadFee: 500,
    saleRate: 4,
    minSales: "1.5M–3M",
    perks: ["Per-lead ฿500", "Per-sale 4%", "Dedicated account manager", "Quarterly bonus"],
  },
  {
    name: "Platinum",
    color: "from-violet-500 to-fuchsia-600",
    leadFee: 800,
    saleRate: 5,
    minSales: "3M+",
    perks: ["Per-lead ฿800", "Per-sale 5%", "Strategic partnership", "ข้อตกลงพิเศษรายกรณี"],
  },
];

const Affiliate = () => {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [leadsPerMonth, setLeadsPerMonth] = useState(5);
  const [avgDealSize, setAvgDealSize] = useState(150000);
  const [closeRate, setCloseRate] = useState(15);
  const [tierIdx, setTierIdx] = useState(0);

  const tier = TIERS[tierIdx];
  const qualifiedLeads = leadsPerMonth;
  const closedDeals = (qualifiedLeads * closeRate) / 100;
  const leadIncome = qualifiedLeads * tier.leadFee;
  const saleIncome = closedDeals * avgDealSize * (tier.saleRate / 100);
  const monthlyTotal = leadIncome + saleIncome;
  const yearlyTotal = monthlyTotal * 12;

  const fmt = (n: number) =>
    new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={isEn ? "Affiliate Program — Earn with B2B Industrial Sales" : "โปรแกรม Affiliate — สร้างรายได้จากการแนะนำลูกค้า B2B"}
        description={
          isEn
            ? "Join ENT Group's Affiliate Program. Earn per-lead + per-sale commission promoting industrial PCs to Thai businesses."
            : "เข้าร่วมโปรแกรม Affiliate กับ ENT Group รับค่าตอบแทนทั้งต่อ Lead และต่อยอดขาย โปรโมตคอมพิวเตอร์อุตสาหกรรมให้ธุรกิจไทย"
        }
        path="/affiliate"
      />
      <SiteNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 pt-24 pb-20">
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="container max-w-6xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles size={14} />
              {isEn ? "For Thai Industrial Sales Pros" : "สำหรับมืออาชีพสายอุตสาหกรรมไทย"}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {isEn ? (
                <>Earn <span className="text-primary">฿50K–฿500K/month</span> referring B2B clients</>
              ) : (
                <>สร้างรายได้ <span className="text-primary">฿50,000–฿500,000/เดือน</span> ด้วยการแนะนำลูกค้า B2B</>
              )}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {isEn
                ? "Per-lead + per-sale commission. Promote industrial PCs, edge AI, and rugged devices to Thai businesses. Built for engineers, sales pros, and B2B influencers."
                : "รับค่าตอบแทนทั้งต่อ Lead ที่ผ่านเกณฑ์ และต่อยอดขายที่ปิดได้ — โปรโมตคอมพิวเตอร์อุตสาหกรรม Edge AI และอุปกรณ์ Rugged สำหรับวิศวกร นักขาย B2B และอินฟลูเอนเซอร์สายเทค"}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/affiliate/apply">
                  {isEn ? "Apply Now" : "สมัครเข้าร่วม"} <ArrowRight size={16} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#calculator">{isEn ? "Calculate Earnings" : "คำนวณรายได้"}</a>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
              {[
                { label: isEn ? "Per-lead" : "ต่อ Lead", value: "฿500–1,500" },
                { label: isEn ? "Per-sale" : "ต่อยอดขาย", value: "3–10%" },
                { label: isEn ? "Top earner/yr" : "Top earner/ปี", value: "฿6M+" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-bold text-primary">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isEn ? "Why partner with ENT Group" : "ทำไมต้องเป็น Affiliate กับ ENT Group"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isEn
                ? "Industrial computing is a high-margin, recurring B2B market with deal sizes from ฿50K to ฿5M+"
                : "ตลาดคอมพิวเตอร์อุตสาหกรรมเป็นตลาด B2B มาร์จินสูง ดีลซ้ำ ขนาดดีล ฿50,000 ถึง ฿5 ล้าน+"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: DollarSign,
                title: isEn ? "Dual Income Stream" : "รายได้สองทาง",
                desc: isEn
                  ? "Earn ฿200–800 per qualified lead, plus 2–5% commission on closed sales. Paid even if the deal closes months later."
                  : "รับ ฿200–800 ต่อ Lead ที่ผ่านเกณฑ์ บวกค่าคอม 2–5% จากยอดขายที่ปิดได้ จ่ายแม้ดีลจะใช้เวลาหลายเดือน",
              },
              {
                icon: Target,
                title: isEn ? "B2B Deal Sizes" : "ขนาดดีล B2B",
                desc: isEn
                  ? "Typical deal ฿100K–300K. A closed referral can mean ฿2,000–15,000 in commission depending on tier and deal size."
                  : "ดีลทั่วไป ฿100,000–300,000 — แนะนำลูกค้า 1 รายที่ปิดได้อาจรับค่าคอม ฿2,000–15,000 ขึ้นกับระดับและขนาดดีล",
              },
              {
                icon: HandshakeIcon,
                title: isEn ? "We Close, You Earn" : "เราปิดดีล คุณรับเงิน",
                desc: isEn
                  ? "Our sales team handles RFQs, technical specs, and negotiation. You focus on referring — we do the heavy lifting."
                  : "ทีมขายของเราดูแลใบเสนอราคา สเปกเทคนิค และการเจรจา คุณแค่แนะนำ — เราจัดการที่เหลือ",
              },
              {
                icon: TrendingUp,
                title: isEn ? "Repeat Business" : "โอกาสซื้อซ้ำ",
                desc: isEn
                  ? "B2B clients often buy again — warranty, expansions, or repairs may qualify for follow-up commission per program terms."
                  : "ลูกค้า B2B มักซื้อซ้ำ — ต่อประกัน ขยายระบบ หรือซ่อมบำรุง อาจมีสิทธิ์รับค่าคอมต่อเนื่องตามเงื่อนไขโปรแกรม",
              },
              {
                icon: Award,
                title: isEn ? "Tier Progression" : "ระดับสมาชิก",
                desc: isEn
                  ? "Bronze → Silver → Gold → Platinum. Higher tiers unlock better rates and dedicated support based on performance."
                  : "Bronze → Silver → Gold → Platinum — ระดับสูงขึ้นเมื่อทำผลงานถึงเกณฑ์ ได้อัตราที่ดีขึ้นและทีมซัพพอร์ตเฉพาะ",
              },
              {
                icon: ShieldCheck,
                title: isEn ? "Transparent Tracking" : "ระบบติดตามโปร่งใส",
                desc: isEn
                  ? "Real-time dashboard. Track every click, lead, deal, and payout. Monthly payouts via PromptPay or bank transfer."
                  : "Dashboard แบบ Real-time ติดตามทุก Click, Lead, ดีล และค่าคอมฯ จ่ายรายเดือนผ่าน PromptPay หรือโอนธนาคาร",
              },
            ].map((b) => (
              <Card key={b.title} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <b.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isEn ? "Commission Tiers" : "ระดับค่าตอบแทน"}
            </h2>
            <p className="text-muted-foreground">
              {isEn
                ? "Tier is based on rolling 12-month sales attributed to you"
                : "ระดับคำนวณจากยอดขายที่แนะนำได้ใน 12 เดือนล่าสุด"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((t) => (
              <Card key={t.name} className="relative overflow-hidden border-border/50">
                <div className={`h-1.5 bg-gradient-to-r ${t.color}`} />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold">{t.name}</h3>
                    <Award className="text-muted-foreground" size={18} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">
                    {isEn ? "Annual sales: " : "ยอดขาย/ปี: "}฿{t.minSales}
                  </p>
                  <div className="space-y-1 mb-5">
                    <div className="text-3xl font-bold text-primary">{t.saleRate}%</div>
                    <div className="text-xs text-muted-foreground">
                      {isEn ? "per closed sale" : "ของยอดขายที่ปิด"}
                    </div>
                  </div>
                  <div className="text-sm font-semibold mb-3">
                    + ฿{fmt(t.leadFee)} {isEn ? "per lead" : "ต่อ Lead"}
                  </div>
                  <ul className="space-y-2">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-20">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isEn ? "Earnings Calculator" : "คำนวณรายได้ของคุณ"}
            </h2>
            <p className="text-muted-foreground">
              {isEn ? "Estimate based on your network and deal flow" : "ประมาณการจากเครือข่ายและจำนวนดีลของคุณ"}
            </p>
          </div>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{isEn ? "Tier" : "ระดับ"}</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {TIERS.map((t, i) => (
                        <button
                          key={t.name}
                          onClick={() => setTierIdx(i)}
                          className={`px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                            tierIdx === i
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/70 text-muted-foreground"
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-sm font-medium">
                        {isEn ? "Qualified leads / month" : "Lead ที่ผ่านเกณฑ์ / เดือน"}
                      </Label>
                      <span className="text-sm font-semibold text-primary">{leadsPerMonth}</span>
                    </div>
                    <Slider
                      value={[leadsPerMonth]}
                      onValueChange={([v]) => setLeadsPerMonth(v)}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-sm font-medium">
                        {isEn ? "Avg deal size (฿)" : "ขนาดดีลเฉลี่ย (฿)"}
                      </Label>
                      <span className="text-sm font-semibold text-primary">฿{fmt(avgDealSize)}</span>
                    </div>
                    <Slider
                      value={[avgDealSize]}
                      onValueChange={([v]) => setAvgDealSize(v)}
                      min={50000}
                      max={500000}
                      step={10000}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-sm font-medium">{isEn ? "Close rate (%)" : "อัตราปิดดีล (%)"}</Label>
                      <span className="text-sm font-semibold text-primary">{closeRate}%</span>
                    </div>
                    <Slider
                      value={[closeRate]}
                      onValueChange={([v]) => setCloseRate(v)}
                      min={5}
                      max={30}
                      step={1}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {isEn ? "Lead income / mo" : "รายได้จาก Lead / เดือน"}
                      </div>
                      <div className="text-2xl font-bold">฿{fmt(leadIncome)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {isEn ? "Sale commission / mo" : "ค่าคอมยอดขาย / เดือน"}
                      </div>
                      <div className="text-2xl font-bold">฿{fmt(saleIncome)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ({fmt(closedDeals)} {isEn ? "deals × " : "ดีล × "}฿{fmt(avgDealSize)} × {tier.saleRate}%)
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {isEn ? "Total monthly" : "รวมต่อเดือน"}
                      </div>
                      <div className="text-4xl font-bold text-primary">฿{fmt(monthlyTotal)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        {isEn ? "Annual potential" : "ศักยภาพต่อปี"}
                      </div>
                      <div className="text-2xl font-bold">฿{fmt(yearlyTotal)}</div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed pt-2">
                      {isEn
                        ? "* Estimates only. Actual earnings depend on lead quality, close rate, and program terms. Monthly sales volume per affiliate is capped at ฿3,000,000."
                        : "* เป็นการประมาณการเท่านั้น รายได้จริงขึ้นกับคุณภาพ Lead อัตราปิดดีล และเงื่อนไขโปรแกรม ยอดขายต่อเดือนต่อ Affiliate จำกัดสูงสุด ฿3,000,000"}
                    </p>
                  </div>
                  <Button className="w-full mt-6" asChild>
                    <Link to="/affiliate/apply">
                      {isEn ? "Start Earning" : "เริ่มสมัครเลย"} <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isEn ? "How it works" : "ขั้นตอนการทำงาน"}
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: isEn ? "Apply" : "สมัคร",
                desc: isEn ? "Fill 5-step application. Approval in 3–5 business days." : "กรอกแบบฟอร์ม 5 ขั้นตอน อนุมัติใน 3–5 วันทำการ",
              },
              {
                step: "02",
                title: isEn ? "Get tracking link" : "รับลิงก์ติดตาม",
                desc: isEn ? "Unique referral link + marketing kit + dashboard access." : "ลิงก์เฉพาะตัว + ชุดการตลาด + เข้าใช้ Dashboard",
              },
              {
                step: "03",
                title: isEn ? "Refer & promote" : "แนะนำ & โปรโมต",
                desc: isEn ? "Share with your network. We handle quotes & negotiation." : "แชร์กับเครือข่าย เราจัดการใบเสนอราคา & เจรจา",
              },
              {
                step: "04",
                title: isEn ? "Get paid monthly" : "รับเงินรายเดือน",
                desc: isEn ? "PromptPay or bank transfer on the 5th of each month." : "PromptPay หรือโอนธนาคาร ทุกวันที่ 5 ของเดือน",
              },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-5xl font-bold text-primary/20 mb-2">{s.step}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isEn ? "Frequently asked questions" : "คำถามที่พบบ่อย"}
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: isEn ? "Who is this for?" : "เหมาะกับใคร?",
                a: isEn
                  ? "Engineers, system integrators, IT consultants, sales pros, and B2B influencers with networks in manufacturing, logistics, retail, or smart city sectors."
                  : "วิศวกร System Integrator ที่ปรึกษา IT นักขาย และอินฟลูเอนเซอร์ B2B ที่มีเครือข่ายในอุตสาหกรรมการผลิต โลจิสติกส์ ค้าปลีก หรือสมาร์ทซิตี้",
              },
              {
                q: isEn ? "What counts as a 'qualified lead'?" : "Lead ที่ผ่านเกณฑ์คืออะไร?",
                a: isEn
                  ? "A lead is qualified when: (1) decision-maker confirmed, (2) budget ≥ ฿50K confirmed, (3) RFQ submitted, (4) timeline within 6 months."
                  : "Lead ผ่านเกณฑ์เมื่อ: (1) ยืนยันผู้มีอำนาจตัดสินใจ (2) งบประมาณ ≥ ฿50,000 (3) ส่งใบขอเสนอราคา (4) ระยะเวลาภายใน 6 เดือน",
              },
              {
                q: isEn ? "When do I get paid?" : "จ่ายเงินเมื่อไหร่?",
                a: isEn
                  ? "Lead fees: paid the month after qualification. Sale commission: paid the month after the customer pays our invoice. Monthly payout on the 5th."
                  : "ค่า Lead: จ่ายเดือนถัดจากที่ผ่านเกณฑ์ — ค่าคอมยอดขาย: จ่ายเดือนถัดจากที่ลูกค้าชำระบิล — ตัดจ่ายทุกวันที่ 5 ของเดือน",
              },
              {
                q: isEn ? "How is attribution tracked?" : "ระบบติดตาม attribution อย่างไร?",
                a: isEn
                  ? "Cookie attribution lasts 90 days. We also track via referral code at form submission. First-touch wins."
                  : "Cookie อยู่ 90 วัน + ระบุ Referral Code ตอนกรอกฟอร์ม โดยใช้ระบบ First-touch (ใครแนะนำก่อนได้ก่อน)",
              },
              {
                q: isEn ? "Can I promote competing brands?" : "โปรโมตแบรนด์คู่แข่งได้ไหม?",
                a: isEn
                  ? "Yes, but Gold/Platinum tier requires exclusivity in industrial PC category."
                  : "ได้ — ยกเว้นระดับ Gold/Platinum ต้องเลือกเป็น Exclusive ในหมวด Industrial PC",
              },
              {
                q: isEn ? "Is there an exclusivity requirement?" : "มีข้อบังคับ Exclusive ไหม?",
                a: isEn
                  ? "Bronze/Silver: no. Gold: must not actively promote direct competitors. Platinum: full exclusivity in industrial PC category."
                  : "Bronze/Silver: ไม่มี — Gold: ห้ามโปรโมตคู่แข่งโดยตรง — Platinum: Exclusive เต็มรูปแบบในหมวด Industrial PC",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container max-w-3xl mx-auto px-6 text-center">
          <Users className="mx-auto text-primary mb-4" size={40} />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isEn ? "Ready to start earning?" : "พร้อมเริ่มสร้างรายได้แล้วหรือยัง?"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isEn
              ? "Join 50+ Thai sales pros earning monthly commission with ENT Group"
              : "เข้าร่วมกับมืออาชีพไทย 50+ คนที่กำลังสร้างรายได้รายเดือนกับ ENT Group"}
          </p>
          <Button size="lg" asChild>
            <Link to="/affiliate/apply">
              {isEn ? "Apply Now — Free" : "สมัครเลย — ฟรี"} <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Affiliate;

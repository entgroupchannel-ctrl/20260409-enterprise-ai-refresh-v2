import {
  Target, Layers, Shield, Rocket, Building2, TrendingUp,
  CheckCircle2, Factory, Store, Stethoscope, Swords, AlertTriangle, Lightbulb,
  Zap, Globe, Lock, Recycle, Leaf, RefreshCw, Award, Users, HandCoins, ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Props {
  /** When true, premium tabs (SWOT, landscape, strategy, ESG) are blurred behind an unlock CTA */
  locked?: boolean;
  /** Called when user clicks unlock button on a locked tab */
  onUnlockRequest?: () => void;
}

/**
 * Reusable Strategic Vision Tabs
 * Used by both /investors (inline) and /investors/strategic-vision (standalone sub-page)
 */
const StrategicVisionTabs = ({ locked = false, onUnlockRequest }: Props = {}) => {
  const LockedOverlay = ({ label }: { label: string }) => (
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
      <div
        className="max-w-md w-full text-center rounded-2xl px-6 py-8 shadow-2xl backdrop-blur-md"
        style={{
          background: "linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(18,37,68,0.92) 100%)",
          border: "1px solid rgba(201,169,97,0.4)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: "rgba(201,169,97,0.15)", border: "1px solid rgba(201,169,97,0.35)" }}
        >
          <Lock size={18} style={{ color: "#C9A961" }} />
        </div>
        <h4 className="text-base md:text-lg font-bold mb-1.5" style={{ color: "#FFFFFF" }}>
          เนื้อหา {label} จะเปิดเมื่อแอดมินอนุมัติ
        </h4>
        <p className="text-xs leading-relaxed mb-5" style={{ color: "#94A3B8" }}>
          กรอกข้อมูลติดต่อสั้นๆ — ทีมงานจะตรวจสอบและอนุมัติสิทธิ์การเข้าถึงให้ภายใน 24 ชั่วโมง
        </p>
        {onUnlockRequest && (
          <Button
            onClick={onUnlockRequest}
            className="h-10 px-6 text-xs font-bold hover:scale-[1.02] transition-transform"
            style={{ backgroundColor: "#C9A961", color: "#0A1628" }}
          >
            <Lock size={12} className="mr-1.5" /> ขอสิทธิ์เข้าถึง
          </Button>
        )}
      </div>
    </div>
  );

  const lockedWrap = (label: string, children: React.ReactNode) =>
    locked ? (
      <div className="relative">
        <div className="blur-[6px] select-none pointer-events-none opacity-60" aria-hidden>
          {children}
        </div>
        <LockedOverlay label={label} />
      </div>
    ) : (
      <>{children}</>
    );

  const triggerClass =
    "py-3 px-2 rounded-lg text-[13px] md:text-sm font-semibold transition-all " +
    "text-slate-300 hover:text-white hover:bg-white/5 " +
    "data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#C9A961] data-[state=active]:to-[#B8924A] " +
    "data-[state=active]:text-[#0A1628] data-[state=active]:shadow-[0_4px_14px_rgba(201,169,97,0.45)] " +
    "data-[state=active]:scale-[1.02]";

  return (
    <Tabs defaultValue="vision" className="w-full">
      {/* Helper hint above the tab bar */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A961]/50" />
        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#C9A961]">
          เลือกหัวข้อเพื่อดูรายละเอียด
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A961]/50" />
      </div>

      <div
        className="rounded-2xl p-2 mb-8 shadow-[0_10px_30px_-10px_rgba(10,22,40,0.35)] border border-[#C9A961]/30"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #122544 100%)" }}
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto bg-transparent gap-1 p-0">
          <TabsTrigger value="vision" className={triggerClass}><Target className="w-4 h-4 mr-1.5" />Vision</TabsTrigger>
          <TabsTrigger value="swot" className={triggerClass}><Layers className="w-4 h-4 mr-1.5" />SWOT</TabsTrigger>
          <TabsTrigger value="landscape" className={triggerClass}><Swords className="w-4 h-4 mr-1.5" />ภาพการแข่งขัน</TabsTrigger>
          <TabsTrigger value="strategy" className={triggerClass}><Lightbulb className="w-4 h-4 mr-1.5" />กลยุทธ์</TabsTrigger>
          <TabsTrigger value="esg" className={triggerClass}><Leaf className="w-4 h-4 mr-1.5" />ESG</TabsTrigger>
        </TabsList>
      </div>

      {/* ─── TAB 1: VISION ─── */}
      <TabsContent value="vision" className="space-y-12 mt-6">
        {lockedWrap("Vision", (<>

        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">"The Thai Champion" Narrative</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              อุตสาหกรรมไทย โดยคนไทย เพื่อคนไทย — ระบบดูแลใกล้ชิด แก้ปัญหารวดเร็ว
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

        <div>
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 text-primary border-primary/30">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 3 สนามที่เราจะครอง
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold">เลือกชนะในสนามที่เราถนัด</h2>
          </div>
          <div className="space-y-4">
            {[
              { num: "01", title: "SME & โรงงานขนาดกลาง (100–500 คน)", desc: "ตลาด SME ไทยมีกว่า 3.2 ล้านกิจการ ต้องการ Industrial PC ที่ราคาคุ้มและบริการรวดเร็ว", stat: "3.2M+ SMEs" },
              { num: "02", title: "Custom Solution + After-sales ใกล้ชิด", desc: "Sales Account Manager ดูแลโดยตรง ปัญหาเทคนิคแก้ใน 2 ชั่วโมง ไม่ต้องผ่านศูนย์ต่างประเทศ", stat: "2hr Response SLA" },
              { num: "03", title: "Mid-tier Pricing สำหรับงานคุ้มค่า", desc: "สำหรับโรงงาน ร้านค้าปลีก คลินิก ที่ต้องการ 'ของดีใช้ได้จริง' โดยไม่ต้องจ่าย brand premium", stat: "30–40% lower TCO" },
            ].map((b) => (
              <Card key={b.num} className="border-border/60">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div
                      className="text-5xl font-extrabold leading-none tracking-tight"
                      style={{
                        background: "linear-gradient(135deg, #C9A961 0%, #8B6F2E 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {b.num}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{b.title}</h3>
                        <Badge variant="secondary" className="text-xs">{b.stat}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">3 Vertical ที่เราจะเป็นที่ 1</h2>
            <p className="text-muted-foreground">รวมมูลค่าตลาดเป้าหมายกว่า 10,000 ล้านบาท/ปี</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Factory, title: "Food & Beverage Manufacturing", market: "~5,000 ลบ./ปี", desc: "80,000+ โรงงานอาหาร/เครื่องดื่ม ต้องการ automation, MES, Traceability" },
              { icon: Store, title: "Retail Chain ระดับกลาง", market: "~3,000 ลบ./ปี", desc: "ร้านสะดวกซื้อรอง ร้านอาหารเชน ต้องการ POS, Kiosk, Digital Signage" },
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
          <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground mb-1">เป้าหมาย 3 ปี</p>
            <p className="text-3xl md:text-4xl font-bold text-primary">100 ลบ./ปี</p>
            <p className="text-sm text-muted-foreground mt-2">ส่วนแบ่งตลาด 1% = 5 เท่าของรายได้ปัจจุบัน</p>
          </div>
        </div>
        </>))}
      </TabsContent>


      {/* ─── TAB 2: SWOT ─── */}
      <TabsContent value="swot" className="space-y-6 mt-6">
        {lockedWrap("SWOT", (<>

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">SWOT Analysis</h2>
          <p className="text-muted-foreground">การประเมินตนเองในตลาด Industrial Computer ไทย (~4,550 ลบ.)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-lg">💪 Strengths — จุดแข็ง</h3>
              </div>
              <ul className="space-y-2.5 text-sm">
                {[
                  "B2B Digital Platform ครบลูป (RFQ→Quote→PO→Invoice) + AI Assistant",
                  "ฐานลูกค้าสะสม 13 ปี · 8,000+ องค์กร · 4,275 active contacts",
                  "Product Range 600+ SKU ใน 6 series",
                  "นำเข้าตรงจากโรงงาน ต้นทุนต่ำกว่า distributor หลายชั้น",
                  "ตัดสินใจเร็ว · Quote ใน 2 ชม. ไม่ต้องรอ HQ",
                  "ทีมไทย 100% เข้าใจวัฒนธรรม B2B ไทย",
                  "ครอบคลุม Vertical หลากหลาย (Factory, Medical, POS, Kiosk, Edge AI)",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg">🌟 Opportunities — โอกาส</h3>
              </div>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Automation Investment ของไทย 150,000 ลบ. โต 8–12% YoY",
                  "Smart Factory Initiative มูลค่า 100,000 ลบ.",
                  "Edge AI Boom · NVIDIA Jetson เติบโต 30%+",
                  "SME ไทย 3.2 ล้านกิจการที่แบรนด์โกลบอลไม่คุ้มดูแล",
                  "EV Manufacturing ขยายตัวในไทย",
                  "Medical Digitalization ของกระทรวงสาธารณสุข",
                  "ขยาย ASEAN ผ่าน Platform (VN, ID, KH, LA)",
                  "SaaS Tool (CRM/RFQ) ขายให้ SME → recurring revenue",
                ].map((o) => (
                  <li key={o} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{o}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="pt-4">
          <p className="text-center text-sm text-muted-foreground mb-4">
            เพื่อความโปร่งใส เรายังประเมินจุดที่ต้องพัฒนาและความเสี่ยงไว้ด้วย
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <Collapsible>
              <Card className="border-l-4 border-l-orange-500">
                <CollapsibleTrigger className="w-full text-left">
                  <CardContent className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <h3 className="font-bold text-lg">😰 Weaknesses — จุดอ่อน</h3>
                    </div>
                    <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="px-6 pb-6 pt-0">
                    <ul className="space-y-2.5 text-sm">
                      {[
                        "ขนาดธุรกิจเล็ก ทุนจดทะเบียนจำกัด → เข้า tender ใหญ่ยาก",
                        "ยังไม่มี certifications ระดับ enterprise (ISO 27001 ฯลฯ)",
                        "Brand recognition ต่ำกว่าแบรนด์โกลบอล",
                        "ยังไม่มี R&D ของตัวเอง (พึ่ง OEM)",
                        "ทีมขายจำกัด ครอบคลุมไม่ทั่วทุกจังหวัด",
                        "เงินทุนหมุนเวียนจำกัด → สต๊อกจำกัด",
                        "Single-person risk ในการบริหาร",
                      ].map((w) => (
                        <li key={w} className="flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5">▸</span>
                          <span className="text-muted-foreground">{w}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible>
              <Card className="border-l-4 border-l-red-500">
                <CollapsibleTrigger className="w-full text-left">
                  <CardContent className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="font-bold text-lg">⚠️ Threats — อุปสรรค</h3>
                    </div>
                    <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="px-6 pb-6 pt-0">
                    <ul className="space-y-2.5 text-sm">
                      {[
                        "แบรนด์โกลบอลกำลังหันมาเล่น sector-driven · จะแย่ง vertical SME",
                        "Thai Distributor รายใหญ่ (อายุ 18+ ปี) มี brand premium แข็งแกร่ง",
                        "China direct sellers บน Shopee/Lazada ราคาต่ำกว่า 40–60%",
                        "Geopolitical risk · Tariff · Supply chain disruption",
                        "Component shortage (ชิป) lead time ยาว",
                        "ค่าเงินบาทผันผวน → ต้นทุนนำเข้าไม่แน่นอน",
                        "ลูกค้าหันไป Cloud/SaaS แทน local PC",
                        "PDPA/Cybersecurity compliance requirement สูงขึ้น",
                      ].map((t) => (
                        <li key={t} className="flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">▸</span>
                          <span className="text-muted-foreground">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </div>
        </>))}
      </TabsContent>


      {/* ─── TAB 3: COMPETITIVE LANDSCAPE ─── */}
      <TabsContent value="landscape" className="space-y-8 mt-6">
        {lockedWrap("ภาพการแข่งขัน", (<>

        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">ภาพการแข่งขันในตลาดไทย</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ตลาด Industrial PC ไทยมีมูลค่า ~4,550 ล้านบาท · แบ่งคู่แข่งเป็น 3 Tier
          </p>
        </div>

        <div className="space-y-5">
          {[
            { tier: "Tier 1", label: "Global Giants", icon: Globe, color: "text-purple-600", bg: "bg-purple-500/10",
              desc: "แบรนด์ระดับโลกที่มีตัวแทนในไทย — แข็งแกร่งด้าน brand, certifications, ecosystem",
              enttake: "ENT ไม่แข่งโดยตรง · เน้น SME ที่ไม่ต้องการจ่าย brand premium · ต้นทุนต่ำกว่า 50–70%" },
            { tier: "Tier 2", label: "Thai Distributors", icon: Building2, color: "text-amber-600", bg: "bg-amber-500/10",
              desc: "บริษัทไทยนำเข้าแบรนด์ไต้หวัน/ญี่ปุ่น (อายุ 15–20 ปี) — คู่แข่งใกล้เคียงที่สุด",
              enttake: "ENT ชนะด้วย B2B Platform + AI Assistant ที่ Tier 2 ส่วนใหญ่ยังใช้ Excel + email · ความเร็วในการ quote" },
            { tier: "Tier 3", label: "China Direct Sellers", icon: Zap, color: "text-rose-600", bg: "bg-rose-500/10",
              desc: "ผู้ขายตรงจากจีนผ่าน Shopee/Lazada/Alibaba — ราคาต่ำกว่า 40–60% แต่ไม่มี support",
              enttake: "ENT ป้องกันด้วย TCO storytelling · warranty 1–3 ปี · installation + support ครบ" },
          ].map((c) => (
            <Card key={c.tier} className="border-border/60">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    <c.icon className={`w-6 h-6 ${c.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{c.tier}</Badge>
                      <h3 className="font-bold text-lg">{c.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{c.desc}</p>
                    <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                      <p className="text-xs font-semibold text-primary mb-1">จุดยืน ENT:</p>
                      <p className="text-sm text-foreground leading-relaxed">{c.enttake}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6 md:p-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> ENT Sweet Spot
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs md:text-sm">
              <div></div>
              <div className="text-center font-semibold p-2">SME</div>
              <div className="text-center font-semibold p-2">Mid-market</div>

              <div className="font-semibold p-2 flex items-center">Premium</div>
              <div className="p-3 bg-muted/50 rounded text-center text-muted-foreground">—</div>
              <div className="p-3 bg-muted/50 rounded text-center text-muted-foreground">Tier 1/2</div>

              <div className="font-semibold p-2 flex items-center">Mid-price</div>
              <div className="p-3 bg-primary text-primary-foreground rounded text-center font-bold">ENT ★★★★★</div>
              <div className="p-3 bg-primary/70 text-primary-foreground rounded text-center font-bold">ENT ★★★</div>

              <div className="font-semibold p-2 flex items-center">Low-price</div>
              <div className="p-3 bg-muted/50 rounded text-center text-muted-foreground">Tier 3</div>
              <div className="p-3 bg-muted/50 rounded text-center text-muted-foreground">—</div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              <strong className="text-foreground">ENT Sweet Spot:</strong> SME + Mid-market · Mid-price segment
            </p>
          </CardContent>
        </Card>
        </>))}
      </TabsContent>


      {/* ─── TAB 4: STRATEGY ─── */}
      <TabsContent value="strategy" className="space-y-8 mt-6">
        {lockedWrap("กลยุทธ์", (<>

        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Strategic Roadmap</h2>
          <p className="text-muted-foreground">แผนกลยุทธ์ระยะสั้น–ยาว เพื่อสร้าง moat และขยายธุรกิจ</p>
        </div>

        <div>
          <Badge className="mb-4 bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20">🥇 ระยะสั้น (6 เดือน)</Badge>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Moat ด้วย Platform", desc: "ขยาย B2B Portal · เพิ่ม Multi-user, Approval workflow, Budget tracking · เป้า 80% quote ผ่าน portal" },
              { title: "Vertical Domination", desc: "โฟกัส 2 vertical (F&B Manufacturing, Chain Retail) · case study 5 เรื่อง · landing page เฉพาะ" },
              { title: "Price Transparency", desc: "เปิดหน้า 'Same Function, Half Price' · TCO calculator 5 ปี · แข่งตรงในกลุ่ม SME" },
            ].map((s) => (
              <Card key={s.title} className="border-border/60">
                <CardContent className="p-5">
                  <h4 className="font-bold mb-2">{s.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Badge className="mb-4 bg-blue-500/10 text-blue-700 border-blue-500/30 hover:bg-blue-500/20">🥈 ระยะกลาง (12–18 เดือน)</Badge>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "ISO Certifications", desc: "ISO 9001:2015 (~200K, 6 เดือน) + ISO 27001 (~500K, 12 เดือน) · เปิดประตูสู่ enterprise tender" },
              { title: "Exclusive Partnership", desc: "เลือก 1 แบรนด์ไต้หวันที่ยังไม่มีตัวแทนในไทย · ขอ exclusive distributorship" },
              { title: "Private Label Expansion", desc: "ขยาย ENT-branded products 3–5 รุ่น · ต้นทุนต่ำ margin สูง brand building" },
            ].map((s) => (
              <Card key={s.title} className="border-border/60">
                <CardContent className="p-5">
                  <h4 className="font-bold mb-2">{s.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Badge className="mb-4 bg-purple-500/10 text-purple-700 border-purple-500/30 hover:bg-purple-500/20">🥉 ระยะยาว (2–3 ปี)</Badge>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "SaaS Pivot", desc: "ขายเครื่องมือ CRM/RFQ ให้ SME อื่น · subscription · recurring revenue · จาก 'IPC vendor' → 'B2B Platform company'" },
              { title: "ASEAN Expansion", desc: "ใช้ Platform export · Vietnam, Indonesia, Cambodia · ลูกค้า SME ขาด service เหมือนไทย" },
              { title: "M&A Optionality", desc: "Acquire คู่แข่งเล็กเพื่อขยายฐานลูกค้า · หรือเป็น exit target ให้ผู้เล่นระดับโลก" },
            ].map((s) => (
              <Card key={s.title} className="border-border/60">
                <CardContent className="p-5">
                  <h4 className="font-bold mb-2">{s.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 flex items-start gap-4">
            <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-1">รายละเอียดเชิงลึกเพิ่มเติม</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Financial projection · Cap table · Use of funds · Head-to-head competitor analysis · Risk register
                จะเปิดเผยหลังการลงนาม NDA และยืนยันคุณสมบัติผู้ลงทุน
              </p>
            </div>
          </CardContent>
        </Card>
        </>))}
      </TabsContent>


      {/* ─── TAB 5: ESG / CIRCULAR IT ─── */}
      <TabsContent value="esg" className="space-y-10 mt-6">
        {lockedWrap("ESG", (<>

        <div className="text-center mb-2">
          <Badge className="mb-3 bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20">
            <Leaf className="w-3.5 h-3.5 mr-1.5" /> ESG Strategy 2026–2028
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">ENT Circular IT Solutions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ระบบเศรษฐกิจหมุนเวียนสำหรับอุปกรณ์ไอทีอุตสาหกรรม — แก้ปัญหา E-waste พร้อมสร้างมูลค่าเพิ่ม และยึดโยงลูกค้าระยะยาว
          </p>
        </div>

        <Card className="border-l-4 border-l-green-500 bg-green-500/5">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-green-600" /> จุดเปลี่ยนสำคัญ: จากขายอย่างเดียว → ระบบหมุนเวียนครบวงจร
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Industrial PC ราคา 100,000 บาท เมื่อใช้งาน 3 ปี ยังมีมูลค่าตลาด 70–80% แต่ลูกค้าไม่รู้จะขายให้ใคร กลัวข้อมูลรั่ว
              ส่วนเราเองก็ปล่อยโอกาสและความสัมพันธ์หลุดลอยไป — <span className="text-foreground font-semibold">Circular IT แก้ทั้งสองฝั่ง</span>
            </p>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">3 เสาหลักของระบบหมุนเวียน</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: HandCoins, title: "Trade-in Program", color: "text-blue-600", bg: "bg-blue-500/10",
                desc: "ทำสัญญา Trade-in ล่วงหน้า 3 ปีตั้งแต่วันแรกที่ขาย รับซื้อคืน 30–50% ของราคาใหม่ พร้อมลบข้อมูลตามมาตรฐาน NIST" },
              { icon: RefreshCw, title: "Refurbishment", color: "text-purple-600", bg: "bg-purple-500/10",
                desc: "ปรับปรุงสภาพในศูนย์ ENT Refurbish · เปลี่ยนชิ้นส่วนสึกหรอ · ทดสอบมาตรฐานอุตสาหกรรม · รับประกัน 1 ปีเหมือนของใหม่" },
              { icon: Store, title: "Remarketing", color: "text-green-600", bg: "bg-green-500/10",
                desc: "จำหน่าย Refurbished IPC ในราคา 50–60% ของใหม่ ผ่าน B2B Platform · เจาะ SME รายเล็กที่งบจำกัด" },
            ].map((p) => (
              <Card key={p.title} className="border-border/60 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${p.bg} flex items-center justify-center mb-4`}>
                    <p.icon className={`w-6 h-6 ${p.color}`} />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{p.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">สิ่งที่ลูกค้าได้รับเพิ่ม</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <Card className="border-border/60">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Carbon Credit Certificate</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ทุกครั้งที่ Trade-in อุปกรณ์เก่า ลูกค้าได้รับใบรับรอง CO₂ Reduction นำไปใช้รายงาน ESG/SET ESG Rating ได้
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">ESG Score Boost + Cost Saving</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ปลดสินทรัพย์ตายตัว (ของเก่าค้างคลัง) → เป็นเงินสดทันที · พร้อมเพิ่มคะแนน ESG ด้านสิ่งแวดล้อมให้บริษัท
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-bold text-center mb-2">โมเดล Win-Win-Win</h3>
          <p className="text-center text-sm text-muted-foreground mb-6">ทุกฝ่ายได้ประโยชน์ในระบบเดียว</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Building2, title: "ลูกค้าองค์กร", desc: "ได้เงินคืน · ลด E-waste · เพิ่ม ESG Score · ไม่ต้องกังวลเรื่องข้อมูล" },
              { icon: Users, title: "SME รายเล็ก", desc: "เข้าถึง Industrial PC คุณภาพในราคาครึ่งหนึ่ง · พร้อมรับประกัน 1 ปี" },
              { icon: Leaf, title: "สิ่งแวดล้อม", desc: "ลด E-waste · ยืดอายุการใช้งานอุปกรณ์ · ลดการขุดทรัพยากรใหม่" },
            ].map((w) => (
              <Card key={w.title} className="border-border/60 bg-gradient-to-br from-background to-green-500/5">
                <CardContent className="p-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                    <w.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-bold mb-2">{w.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6">Roadmap การ Implement</h3>
          <div className="space-y-3">
            {[
              { phase: "Phase 1", time: "Q1–Q2 2026", title: "Pilot Trade-in Program", desc: "เริ่มกับลูกค้าเก่า Top 100 · ตั้งศูนย์ Refurbish ขนาดเล็ก · พัฒนาระบบ Trade-in บน B2B Portal" },
              { phase: "Phase 2", time: "Q3–Q4 2026", title: "Refurbish Center + Certification", desc: "ขอ ISO 14001 (Environmental) · ออก Carbon Credit Certificate · ขยายลูกค้าเป็น 500 ราย" },
              { phase: "Phase 3", time: "2027", title: "Remarketing Marketplace", desc: "เปิดหน้า Refurbished IPC บน Platform · เจาะตลาด SME · ขยายไปยังกลุ่มอุปกรณ์อื่น (Server, Network)" },
              { phase: "Phase 4", time: "2028", title: "Scale + ASEAN", desc: "ขยายโมเดลไปยัง Vietnam/Indonesia · ร่วมมือกับ EPR Compliance · เป้า 30% รายได้จาก Circular Economy" },
            ].map((r) => (
              <Card key={r.phase} className="border-l-4 border-l-green-500">
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Badge variant="secondary" className="text-xs">{r.phase}</Badge>
                    <Badge variant="outline" className="text-xs">{r.time}</Badge>
                    <h4 className="font-bold">{r.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "30%", label: "รายได้จาก Circular ใน 3 ปี" },
            { value: "1,000+", label: "ตันลด E-waste ต่อปี" },
            { value: "70–80%", label: "Customer Retention หลัง Trade-in" },
            { value: "ISO 14001", label: "ภายในปี 2026" },
          ].map((t) => (
            <Card key={t.label} className="bg-primary/5 border-primary/20">
              <CardContent className="p-5 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary mb-1">{t.value}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-6 flex items-start gap-4">
            <Recycle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-1">รองรับ SME Green Productivity Loan + ESG Investment</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                โครงการนี้ออกแบบให้สอดคล้องกับสินเชื่อ SME Green Productivity ของธนาคารพัฒนาวิสาหกิจฯ
                และเปิดรับ ESG-focused Strategic Investors ที่เห็นโอกาสในตลาด Circular Economy ของไทย
              </p>
            </div>
          </CardContent>
        </Card>
        </>))}
      </TabsContent>

    </Tabs>
  );
};

export default StrategicVisionTabs;

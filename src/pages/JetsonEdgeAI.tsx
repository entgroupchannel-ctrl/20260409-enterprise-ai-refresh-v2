import { Link } from "react-router-dom";
import { Cpu, Package, CircuitBoard, Server, Monitor, HardDrive, ArrowRight, Zap, ShieldCheck, Layers, Sparkles, Award, Globe, CheckCircle2 } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { jetsonProducts, jetsonCategories, type JetsonCategory } from "@/data/jetson-products";
import catModulesImg from "@/assets/jetson-cat-modules.jpg";
import catDevkitsImg from "@/assets/jetson-cat-devkits.jpg";
import catCarrierImg from "@/assets/jetson-cat-carrier.jpg";
import catIpcImg from "@/assets/jetson-cat-ipc.jpg";
import catDevSystemsImg from "@/assets/jetson-cat-devsystems.jpg";
import catTaiwanImg from "@/assets/jetson-cat-taiwan.jpg";
import catEdgeImg from "@/assets/jetson-cat-edge.jpg";

const ICONS: Record<string, typeof Cpu> = { Cpu, Package, CircuitBoard, Server, Monitor, HardDrive };
const CATEGORY_IMAGES: Record<JetsonCategory, string> = {
  modules: catModulesImg,
  devkits: catDevkitsImg,
  "carrier-boards": catCarrierImg,
  "embedded-systems": catIpcImg,
  "dev-systems": catDevSystemsImg,
  "taiwan-ipc": catTaiwanImg,
  "edge-computers": catEdgeImg,
};

const performanceTiers = [
  { name: "Nano", tops: 67, color: "from-emerald-500 to-emerald-300", label: "Entry — IoT, Smart Camera" },
  { name: "Orin NX", tops: 157, color: "from-cyan-500 to-cyan-300", label: "Mid — Robotics, Vision AI" },
  { name: "AGX Orin", tops: 275, color: "from-blue-500 to-blue-300", label: "Flagship — Autonomous Machines" },
  { name: "Thor T4000", tops: 1200, color: "from-violet-500 to-violet-300", label: "Next-gen — Humanoid Robots" },
  { name: "Thor T5000", tops: 2070, color: "from-fuchsia-500 to-fuchsia-300", label: "Blackwell — AV & Generative AI" },
];

const useCases = [
  { icon: Zap, title: "Smart Manufacturing", desc: "ตรวจสอบคุณภาพสินค้าด้วย Computer Vision แบบเรียลไทม์" },
  { icon: ShieldCheck, title: "Smart Surveillance", desc: "วิเคราะห์วิดีโอ AI หลายกล้องพร้อมกัน บนเครื่อง Edge" },
  { icon: Layers, title: "Autonomous Robots", desc: "ขับเคลื่อนหุ่นยนต์เคลื่อนที่อัตโนมัติ AGV/AMR" },
  { icon: Sparkles, title: "Generative AI Edge", desc: "รัน LLM และ Vision Models ที่ Edge โดยไม่ต้องส่งคลาวด์" },
];

const JetsonEdgeAI = () => {
  const featured = jetsonProducts.filter((p) => p.badge || p.priceTHB !== null).slice(0, 6);
  const categoryCounts = (jetsonProducts as Array<{ category: JetsonCategory }>).reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const maxTops = Math.max(...performanceTiers.map((t) => t.tops));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "NVIDIA Jetson Edge AI Solutions Thailand",
    description: "ENT Group — NVIDIA Jetson authorized partner ในประเทศไทย โมดูล AI, Developer Kits, Industrial PC ครบทุกซีรีส์",
    url: "https://www.entgroup.co.th/jetson",
    publisher: { "@type": "Organization", name: "ENT Group" },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="NVIDIA Jetson Edge AI Solutions Thailand"
        description="ตัวแทน NVIDIA Jetson ในประเทศไทย — โมดูล AI, Developer Kits, Industrial PC ตั้งแต่ Nano (67 TOPS) ถึง Thor (2070 TFLOPS) สำหรับ Smart Factory, Robotics, Vision AI"
        path="/jetson"
        keywords="NVIDIA Jetson, Edge AI Thailand, Jetson Orin, Jetson Thor, AGX Orin, Industrial AI, ENT Group"
        jsonLd={jsonLd}
      />
      <SiteNavbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#0d1430] to-[#0a0e27] text-white">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, hsl(168 80% 45% / 0.4), transparent 50%), radial-gradient(circle at 80% 70%, hsl(140 80% 50% / 0.3), transparent 50%)",
        }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="container max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm mb-6">
                <Award size={14} className="text-emerald-400" />
                <span className="text-xs font-semibold tracking-wider text-emerald-300">NVIDIA AUTHORIZED PARTNER — THAILAND</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
                Edge AI ที่ขับเคลื่อนด้วย<br />
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  NVIDIA Jetson
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed max-w-xl">
                ครบทุกซีรีส์ ตั้งแต่ <strong className="text-white">Nano 67 TOPS</strong> จนถึง <strong className="text-white">Thor 2070 TFLOPS</strong> — โมดูล, Developer Kits, Industrial PC พร้อมบริการครบวงจรในประเทศไทย
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/shop?category=jetson" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0a0e27] font-bold transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.8)]">
                  ดูสินค้าทั้งหมด <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold transition-all backdrop-blur-sm">
                  ปรึกษาผู้เชี่ยวชาญ
                </Link>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-white">{jetsonProducts.length}+</div>
                  <div className="text-xs text-white/60 mt-1">รุ่นสินค้า</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400">2070</div>
                  <div className="text-xs text-white/60 mt-1">TFLOPS สูงสุด</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">7</div>
                  <div className="text-xs text-white/60 mt-1">หมวดสินค้า</div>
                </div>
              </div>
            </div>

            {/* Performance ladder visualization */}
            <div className="relative">
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Zap size={18} className="text-emerald-400" />
                  <h3 className="text-sm font-semibold tracking-wider text-white/80">PERFORMANCE LADDER</h3>
                </div>
                <div className="space-y-3">
                  {performanceTiers.map((tier) => (
                    <div key={tier.name}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-sm font-bold text-white">{tier.name}</span>
                        <span className="text-xs font-mono text-white/60">{tier.tops.toLocaleString()} {tier.tops > 300 ? "TFLOPS" : "TOPS"}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${tier.color}`}
                          style={{ width: `${(tier.tops / maxTops) * 100}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-white/50 mt-1">{tier.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Product Categories</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">7 หมวดสินค้า ครอบคลุมทุกความต้องการ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">เลือกประเภทที่เหมาะกับโปรเจคของคุณ — ตั้งแต่โมดูลฝังตัวจนถึงเครื่อง AI พร้อมใช้งาน</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {(Object.entries(jetsonCategories) as Array<[JetsonCategory, typeof jetsonCategories[JetsonCategory]]>).map(([key, cat]) => {
              const Icon = ICONS[cat.icon] || Cpu;
              return (
                <Link
                  key={key}
                  to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.3)] transition-all overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-bold text-base mb-1">{cat.nameTH}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{cat.descriptionTH}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-primary font-bold">{categoryCounts[key] || 0} รุ่น</span>
                      <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">Featured</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">รุ่นยอดนิยม &amp; รุ่นใหม่ล่าสุด</h2>
            </div>
            <Link to="/shop?category=jetson" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
              ดูทั้งหมด <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <Link
                key={p.id}
                to={`/shop/${p.id}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all"
              >
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = "/product-placeholder.svg"; }}
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {p.badgeTH && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500 text-white">
                      {p.badgeTH}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base leading-tight mb-1 line-clamp-1">{p.nameTH}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.subtitleTH}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.highlightsTH.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-primary/10 text-primary">{h}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    {p.priceTHB ? (
                      <span className="text-lg font-bold text-foreground">฿{p.priceTHB.toLocaleString()}</span>
                    ) : (
                      <span className="text-sm font-semibold text-primary">สอบถามราคา</span>
                    )}
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Use Cases</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">นำไปใช้งานได้หลากหลาย</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ENT ── */}
      <section className="py-20 bg-gradient-to-br from-[#0a0e27] to-[#0d1430] text-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-emerald-400">Why ENT Group</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-6">พันธมิตร NVIDIA ที่คุณวางใจได้</h2>
              <div className="space-y-4">
                {[
                  { title: "Authorized Partner", desc: "ตัวแทนจำหน่ายอย่างเป็นทางการในประเทศไทย พร้อมรับประกันแท้" },
                  { title: "Stock พร้อมส่ง", desc: "สินค้ายอดนิยมมีในสต็อก ส่งภายใน 1-3 วันทำการ" },
                  { title: "Technical Support", desc: "ทีมวิศวกรไทย ให้คำปรึกษาตั้งแต่ออกแบบจนถึงติดตั้ง" },
                  { title: "B2B Procurement", desc: "ระบบจัดซื้อออนไลน์ครบวงจร — RFQ, ใบเสนอราคา, ใบกำกับภาษี" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md p-8">
              <Globe className="text-emerald-400 mb-4" size={32} />
              <h3 className="text-2xl font-bold mb-3">พร้อมเริ่มโปรเจค Edge AI?</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                ทีมงาน ENT Group ยินดีให้คำปรึกษาตั้งแต่การเลือกโมดูลที่เหมาะสม จนถึงการ deploy ระบบจริง
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0a0e27] font-bold transition-all">
                  ปรึกษาฟรี <ArrowRight size={16} />
                </Link>
                <Link to="/shop?category=jetson" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 hover:bg-white/5 font-semibold transition-all">
                  ดูแคตตาล็อก
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JetsonEdgeAI;

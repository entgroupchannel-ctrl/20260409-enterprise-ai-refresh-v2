import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Cpu, Package, CircuitBoard, Server, Monitor, HardDrive,
  ArrowRight, ChevronLeft, ChevronRight, Sparkles, Award,
  ShieldCheck, Truck, Headphones, Wrench, BadgeCheck, Globe,
  Building2, GraduationCap, Network, Factory, BrainCircuit,
  CheckCircle2, FileCheck, RotateCcw, Hash, Flame,
  ShoppingBag, PhoneCall,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import B2BWorkflowBanner from "@/components/B2BWorkflowBanner";
import SEOHead from "@/components/SEOHead";
import { jetsonProducts, jetsonCategories, type JetsonCategory } from "@/data/jetson-products";

import heroImg from "@/assets/jetson-hero-ai.jpg";
import aiReadyImg from "@/assets/jetson-ai-ready.jpg";
import bgGov from "@/assets/jetson-banner-government.jpg";
import bgEdu from "@/assets/jetson-banner-education.jpg";
import bgInt from "@/assets/jetson-banner-integrator.jpg";
import bgFac from "@/assets/jetson-banner-factory.jpg";
import bgGen from "@/assets/jetson-banner-genai.jpg";

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

// ── Hero slider items (links go to real product pages or filtered shop) ──
const SHOP_JETSON = "/shop?series=Jetson%20Series";
const slides = [
  { id: "ipc-thor", image: "/images/jetson-slider/slide-thor-ipc.jpg", badge: "NEW", title: "Jetson Thor IPC 28F1", desc: "2070 TFLOPS — คอมพิวเตอร์อุตสาหกรรม AI รุ่นใหม่", href: "/shop/ipc-thor-28f1" },
  { id: "carrier-y-c28", image: "/images/jetson-slider/slide-carrier-y-c28.jpg", badge: "NEW", title: "Carrier Board Y-C28 สำหรับ Jetson Thor", desc: "128GB Memory — พร้อมสำหรับ Embodied AI", href: `${SHOP_JETSON}&q=carrier` },
  { id: "thor-devkit", image: "/images/jetson-slider/slide-thor-devkit.jpg", badge: "NEW", title: "ชุดพัฒนา Jetson Thor", desc: "2070 TFLOPS — สำหรับหุ่นยนต์และยานยนต์อัตโนมัติ", href: "/shop/jetson-thor-devkit" },
  { id: "orin-nano-super", image: "/images/jetson-slider/slide-orin-nano-super.jpg", badge: "ขายดี", title: "ชุดพัฒนา Orin Nano Super", desc: "67 TOPS Super Mode — เริ่มต้น Edge AI ที่ดีที่สุด", href: "/shop/orin-nano-super-devkit" },
  { id: "ipc-11f1e2", image: "/images/jetson-slider/slide-ipc-11f1e2.jpg", badge: "POPULAR", title: "IPC 11F1E2 คอมพิวเตอร์อุตสาหกรรม", desc: "Orin NX/Nano — ไร้พัดลม, GbE คู่, RS232/485", href: "/shop/ipc-11f1e2" },
  { id: "lineup", image: "/images/jetson-slider/slide-lineup.jpg", badge: "75+ รุ่น", title: "สินค้า NVIDIA Jetson ครบทุกซีรีส์", desc: "โมดูล, Carrier Board, IPC, ชุดพัฒนา", href: SHOP_JETSON },
];

// ── Industry solutions ──
const industries = [
  { tag: "หน่วยงานราชการ", icon: Building2, image: bgGov, title: "AI Server สำหรับหน่วยงานราชการ", desc: "ประมวลผลในประเทศ ไม่ต้องส่งข้อมูลขึ้น Cloud — รองรับ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)", chips: ["DGX Spark — 1 PFLOP, 128 GB", "Jetson AGX Thor — 2,070 TFLOPS", "Jetson AGX Orin 64GB — 275 TOPS", "IPC 28F1E4 — Rack-mount"], cta: "ขอใบเสนอราคา" },
  { tag: "การศึกษา", icon: GraduationCap, image: bgEdu, title: "เริ่มต้นสอน AI ในห้องเรียน", desc: "Dev Kit พร้อมใช้ เปิดกล่องเขียน AI ได้เลย — เหมาะสำหรับโครงงาน, Senior Project, วิจัย", chips: ["Orin Nano 4GB — ฿22,900", "Orin Nano 8GB — ฿25,900", "Y-C18-DEV — ฿38,900"], cta: "สั่งซื้อสำหรับห้องเรียน" },
  { tag: "ผู้รับเหมาระบบ", icon: Network, image: bgInt, title: "เพิ่มมูลค่าโซลูชันของคุณ", desc: "ฝัง AI เข้าไปในผลิตภัณฑ์และโครงการของคุณ — ราคาพิเศษสำหรับ SI/Reseller สั่งซื้อจำนวนมาก", chips: ["Orin NX 16GB — Module", "IPC 18F1E1 — ฿46,900", "Carrier Y-C18 — Custom Design", "T201S — Edge AI"], cta: "สมัครเป็นพาร์ทเนอร์" },
  { tag: "โรงงานอัจฉริยะ", icon: Factory, image: bgFac, title: "ตรวจสอบคุณภาพด้วย AI", desc: "AI Vision ตรวจจับชิ้นงานเสียบนสายพานได้ทันที — Fanless, ทนฝุ่น, ติดตั้งง่ายบน DIN Rail", chips: ["IPC 18F1E1 — ฿46,900", "T201S 4GB — ฿42,900", "Orin NX + Y-C18 — Bundle", "IPC 17F1 — Multi-cam"], cta: "ปรึกษาทีมวิศวกรฟรี" },
  { tag: "Generative AI", icon: BrainCircuit, image: bgGen, title: "รัน LLM บนโต๊ะทำงาน", desc: "Jetson AGX Thor รัน Qwen3 32B, Cosmos ได้บนเครื่องเดียว — 128 GB, 2,070 TFLOPS, Blackwell", chips: ["DGX Spark — Desktop AI", "AGX Thor Dev Kit — Physical AI", "Orin Nano Super — GenAI Entry"], cta: "สั่งจอง" },
];

// ── Why ENT cards ──
const whyCards = [
  { icon: Award, title: "ผู้เชี่ยวชาญ NVIDIA Jetson ตัวจริง", desc: "ทีมวิศวกรของเราผ่านการอบรมและรับรองจาก NVIDIA โดยตรง พร้อมให้คำปรึกษาเรื่อง Edge AI ตั้งแต่เลือก Module ไปจนถึงออกแบบ Solution", stat: "65+", statLabel: "สินค้าในระบบ" },
  { icon: BadgeCheck, title: "สินค้าแท้ รับประกันจากผู้ผลิต", desc: "นำเข้าจากผู้ผลิตโดยตรง ผ่านช่องทางที่ได้รับอนุญาตจาก NVIDIA มั่นใจได้ว่าได้รับสินค้าแท้ 100% พร้อมรับประกันเต็มรูปแบบจากโรงงาน", stat: "100%", statLabel: "สินค้าแท้" },
  { icon: Headphones, title: "ซัพพอร์ตภาษาไทย ตอบไว", desc: "ไม่ต้องรอคำตอบจากต่างประเทศ ทีมขายและวิศวกรอยู่ในไทย พร้อมตอบภายในวันเดียวกัน", stat: "< 24 ชม.", statLabel: "ตอบกลับ" },
  { icon: Truck, title: "สต็อกในไทย พร้อมส่ง 3-5 วัน", desc: "สินค้ายอดนิยมมีสต็อกพร้อมส่งจากไทย กรณีสินค้าพิเศษ สั่งตรงจากโรงงานภายใน 15-30 วัน", stat: "3-5 วัน", statLabel: "จัดส่ง (มีสต็อก)" },
  { icon: ShieldCheck, title: "รับประกัน 1 ปี + ประกันเพิ่มได้", desc: "สินค้าทุกชิ้นรับประกัน 1 ปีเต็ม ต้องการความมั่นใจเพิ่ม? เลือกประกันปีที่ 2-3 ได้", stat: "1-3 ปี", statLabel: "รับประกัน" },
  { icon: Wrench, title: "บริการหลังการขาย ดูแลตลอด", desc: "มีทีมช่วยตั้งค่า Flash OS ติดตั้ง JetPack SDK แก้ปัญหาทางเทคนิค และให้คำปรึกษาเรื่องอัปเกรด", stat: "ตลอดอายุใช้งาน", statLabel: "ดูแลหลังขาย" },
];

// ── 5-step process ──
const steps = [
  { title: "ปรึกษาฟรี", desc: "บอกเราเรื่องโปรเจกต์ของคุณ เราช่วยเลือกสินค้าที่เหมาะที่สุด" },
  { title: "เสนอราคา", desc: "ราคาพิเศษสำหรับโครงการ พร้อม SSD, ประกันเพิ่ม และ option อื่นๆ" },
  { title: "จัดส่งรวดเร็ว", desc: "สต็อกไทย 3-5 วัน | สั่งจากโรงงาน 15-30 วัน" },
  { title: "ช่วยตั้งค่า", desc: "ทีมวิศวกรช่วย Flash OS, ติดตั้ง JetPack SDK, ทดสอบฮาร์ดแวร์" },
  { title: "ดูแลหลังขาย", desc: "ประกัน 1-3 ปี + ซัพพอร์ตทางเทคนิค + คำปรึกษาเรื่องอัปเกรด" },
];

// ── Trust badges ──
const trustBadges = [
  { num: "100%", title: "สินค้าแท้", desc: "นำเข้าจากโรงงานผู้ผลิตโดยตรง" },
  { num: "NVIDIA", title: "Authorized Channel", desc: "ช่องทางจำหน่ายที่ได้รับอนุญาต" },
  { num: "75+", title: "รุ่นสินค้า", desc: "ครบทุก Jetson Series" },
  { num: "40+", title: "ประเทศ", desc: "เครือข่ายผู้ผลิตที่ส่งออกทั่วโลก" },
];

// ── Authenticity guarantees ──
const guarantees = [
  { icon: BadgeCheck, title: "สินค้าแท้ 100%", desc: "นำเข้าจากโรงงานผู้ผลิตโดยตรง ผ่านช่องทางที่ NVIDIA อนุญาต" },
  { icon: RotateCcw, title: "เปลี่ยนสินค้าได้", desc: "หากสินค้ามีปัญหาจากโรงงาน เปลี่ยนใหม่ให้ทันที" },
  { icon: FileCheck, title: "ใบรับประกันครบ", desc: "ใบรับประกัน ใบกำกับภาษี และเอกสารนำเข้าครบถ้วน" },
  { icon: Hash, title: "Serial Number ตรวจสอบได้", desc: "สินค้าทุกชิ้นมี Serial Number ที่ตรวจสอบกับ NVIDIA ได้" },
];

const NV_GREEN = "#76B900";

const JetsonEdgeAI = () => {
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState<"all" | "modules" | "devkits" | "embedded-systems">("all");

  const featured = jetsonProducts
    .filter((p) => (tab === "all" ? p.badge || p.priceTHB !== null : p.category === tab))
    .slice(0, 6);

  const categoryCounts = (jetsonProducts as Array<{ category: JetsonCategory }>).reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const visibleSlides = 3;
  const maxSlide = Math.max(0, slides.length - visibleSlides);
  const goPrev = () => setSlide((s) => Math.max(0, s - 1));
  const goNext = () => setSlide((s) => Math.min(maxSlide, s + 1));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "NVIDIA Jetson Edge AI Solutions Thailand",
    description: "ENT Group — NVIDIA Jetson authorized partner ในประเทศไทย โมดูล AI, Developer Kits, Industrial PC ครบทุกซีรีส์",
    url: "https://www.entgroup.co.th/nvidia-jetson",
    publisher: { "@type": "Organization", name: "ENT Group" },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="NVIDIA Jetson Edge AI Solutions Thailand | ENT Group"
        description="ตัวแทน NVIDIA Jetson ในประเทศไทย — โมดูล AI, Developer Kits, Industrial PC ตั้งแต่ Nano (67 TOPS) ถึง Thor (2070 TFLOPS) สำหรับ Smart Factory, Robotics, Vision AI"
        path="/nvidia-jetson"
        keywords="NVIDIA Jetson, Edge AI Thailand, Jetson Orin, Jetson Thor, AGX Orin, Industrial AI, ENT Group"
        jsonLd={jsonLd}
      />
      <SiteNavbar />

      {/* ── PROMO BAR (marquee) ── */}
      <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 text-white overflow-hidden border-b border-white/10">
        <div className="relative flex items-center gap-3 py-2.5 text-xs sm:text-sm font-semibold">
          <div className="flex shrink-0 items-center gap-2 px-4 border-r border-white/30">
            <Flame size={14} className="animate-pulse" />
            <span className="hidden sm:inline tracking-wider uppercase text-[11px]">Hot Deals</span>
          </div>
          <div className="flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="flex gap-12 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, dup) => (
                <div key={dup} className="flex shrink-0 gap-12" aria-hidden={dup === 1}>
                  {[
                    { text: "🔥 โปรโมชั่นพิเศษ ลดสูงสุด 15% ถึง 30 เม.ย. 2569", cta: "ดูสินค้าเลย", href: "/shop?series=Jetson%20Series" },
                    { text: "🎁 ซื้อ Orin Nano Super Devkit แถม SSD 256GB ฟรี", cta: "สั่งซื้อ", href: "/shop/orin-nano-super-devkit" },
                    { text: "🚀 Jetson Thor IPC พร้อมส่ง — จองล็อตแรกรับส่วนลดพิเศษ", cta: "จองเลย", href: "/shop/ipc-thor-28f1" },
                    { text: "🎓 ส่วนลดพิเศษสำหรับสถาบันการศึกษา & หน่วยงานราชการ", cta: "ขอใบเสนอราคา", href: "/contact" },
                    { text: "🤝 SI/Reseller รับราคาพิเศษเมื่อสั่งซื้อจำนวนมาก", cta: "สมัครพาร์ทเนอร์", href: "/partner" },
                  ].map((p, idx) => (
                    <span key={`${dup}-${idx}`} className="inline-flex items-center gap-2 shrink-0">
                      <span>{p.text}</span>
                      <Link to={p.href} className="inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline font-bold">
                        {p.cta} <ArrowRight size={12} />
                      </Link>
                      <span className="text-white/50">•</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Link
            to="/shop?series=Jetson%20Series"
            className="hidden md:inline-flex shrink-0 items-center gap-1.5 px-4 py-1 mr-3 rounded-full bg-white text-rose-600 hover:bg-white/90 text-xs font-bold transition-colors shadow-md"
          >
            🛒 Shop Jetson <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#0d1430] to-[#0a0e27] text-white">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, hsl(85 80% 45% / 0.4), transparent 50%), radial-gradient(circle at 80% 70%, hsl(140 80% 50% / 0.25), transparent 50%)",
        }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="container max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#76B900]/10 border border-[#76B900]/30 backdrop-blur-sm mb-6">
                <Award size={14} style={{ color: NV_GREEN }} />
                <span className="text-xs font-semibold tracking-wider" style={{ color: "#a3e635" }}>
                  NVIDIA Jetson Partner — ตัวแทนจำหน่ายในประเทศไทย
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.1] mb-6">
                โซลูชัน Edge AI<br />
                <span className="bg-gradient-to-r from-[#76B900] via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  สำหรับประเทศไทย
                </span>
              </h1>
              <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
                อีเอ็นที กรุ๊ป พันธมิตรธุรกิจที่คุณไว้วางใจ ขอนำเสนอ <strong className="text-white">โมดูล, ชุดพัฒนา และคอมพิวเตอร์อุตสาหกรรม</strong> — ขับเคลื่อนด้วยแพลตฟอร์ม NVIDIA Jetson
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/shop?series=Jetson%20Series" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-[0_0_30px_-5px_rgba(118,185,0,0.6)] hover:shadow-[0_0_40px_-5px_rgba(118,185,0,0.9)]" style={{ background: NV_GREEN, color: "#0a0e27" }}>
                  ดูสินค้าทั้งหมด <ArrowRight size={16} />
                </Link>
                <Link to="/nvidia-jetson/recommend" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold transition-all backdrop-blur-sm">
                  <Sparkles size={16} /> ตัวช่วยเลือกรุ่น
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 text-white/90 font-semibold transition-all">
                  ติดต่อทีมวิศวกร
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-[#76B900]/30 via-transparent to-cyan-400/20 blur-3xl rounded-full" />
              <img
                src={heroImg}
                alt="AI powered by NVIDIA Jetson"
                width={1280}
                height={960}
                className="relative w-full rounded-2xl border border-white/10 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SUB-NAVIGATION (Quick Links) ── */}
      <section className="sticky top-16 z-30 bg-gradient-to-r from-[#0a0e27] via-[#0d1230] to-[#0a0e27] backdrop-blur-md border-y border-[#76B900]/20 shadow-lg shadow-[#76B900]/5">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-[#76B900] font-bold tracking-widest uppercase shrink-0 mr-3">
              <Flame size={13} className="animate-pulse" /> เมนูลัด
            </span>
            {[
              { label: "แคตตาล็อกสินค้า", icon: Package, href: "/nvidia-jetson/products", primary: true },
              { label: "Shop NVIDIA Jetson", icon: ShoppingBag, href: "/shop?series=Jetson%20Series" },
              { label: "ตัวช่วยเลือกรุ่น", icon: Sparkles, href: "/nvidia-jetson/recommend" },
              { label: "AI Models (NGC)", icon: BrainCircuit, href: "/nvidia-jetson/ai-ready" },
              { label: "GPU Server", icon: Server, href: "/nvidia-jetson/gpu-server" },
              { label: "Pro Graphics Card", icon: Monitor, href: "/nvidia-jetson/professional-gpu" },
              { label: "Solutions", icon: Factory, href: "/nvidia-jetson/solutions" },
              { label: "Case Studies", icon: Award, href: "/nvidia-jetson/case-studies" },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`group shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                    link.primary
                      ? "bg-[#76B900] text-[#0a0e27] hover:bg-[#8ad400] shadow-md shadow-[#76B900]/30 hover:shadow-lg hover:shadow-[#76B900]/50"
                      : link.accent
                      ? "bg-white text-[#0a0e27] hover:bg-[#76B900] shadow-md"
                      : "bg-white/5 text-white/85 hover:bg-[#76B900]/15 hover:text-[#76B900] border border-white/10 hover:border-[#76B900]/40"
                  }`}
                >
                  <Icon size={14} className="transition-transform group-hover:scale-110" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SLIDER ── */}
      <section className="bg-gradient-to-b from-[#0a0e27] to-background py-12 border-t border-white/5">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">รุ่นเด่นล่าสุด</h2>
            <div className="flex gap-2">
              <button onClick={goPrev} disabled={slide === 0} className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition">
                <ChevronLeft size={18} />
              </button>
              <button onClick={goNext} disabled={slide >= maxSlide} className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out gap-5" style={{ transform: `translateX(calc(-${slide} * (100% / 3 + 0px)))` }}>
              {slides.map((s) => (
                <Link
                  key={s.id}
                  to={s.href}
                  className="group relative shrink-0 w-[calc((100%-2.5rem)/3)] aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0d1430] to-[#1a1f3a]"
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/70 to-transparent z-10" />
                  <div className="absolute inset-x-0 bottom-0 p-5 z-20">
                    <span className="inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded mb-2" style={{ background: NV_GREEN, color: "#0a0e27" }}>
                      {s.badge}
                    </span>
                    <h3 className="text-white font-bold text-base mb-1">{s.title}</h3>
                    <p className="text-white/70 text-xs leading-snug">{s.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BUSINESS SOLUTIONS ── */}
      <section className="py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: NV_GREEN }}>Solutions</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">โซลูชันสำหรับธุรกิจของคุณ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">แต่ละอุตสาหกรรมมีความต้องการเฉพาะ — เราเลือกโซลูชันให้คุณตรงเป้าหมาย</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {industries.map(({ tag, icon: Icon, image, title, desc, chips, cta }) => (
              <article key={title} className="group relative rounded-2xl overflow-hidden border border-border hover:border-[#76B900]/50 hover:shadow-[0_20px_60px_-15px_rgba(118,185,0,0.4)] transition-all">
                <div className="relative h-56 overflow-hidden">
                  <img src={image} alt={title} loading="lazy" width={1280} height={768} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/40 to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                    <Icon size={14} style={{ color: NV_GREEN }} />
                    {tag}
                  </div>
                </div>
                <div className="p-6 bg-card">
                  <h3 className="text-xl font-bold mb-2 leading-snug">{title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {chips.map((c) => (
                      <span key={c} className="text-[11px] font-medium px-2 py-1 rounded-md bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/20">{c}</span>
                    ))}
                  </div>
                  <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-[#76B900] transition-colors">
                    {cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: NV_GREEN }}>Product Categories</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">หมวดหมู่สินค้า</h2>
            <p className="text-muted-foreground">สำรวจผลิตภัณฑ์ NVIDIA Jetson ทั้งหมดของเรา</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {(Object.entries(jetsonCategories) as Array<[JetsonCategory, typeof jetsonCategories[JetsonCategory]]>).map(([key, cat]) => {
              const Icon = ICONS[cat.icon] || Cpu;
              const bgImg = CATEGORY_IMAGES[key];
              return (
                <Link
                  key={key}
                  to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className="group relative rounded-2xl border border-border bg-card hover:border-[#76B900]/60 hover:shadow-[0_12px_40px_-8px_rgba(118,185,0,0.45)] transition-all overflow-hidden h-64"
                >
                  <img src={bgImg} alt={cat.nameTH} loading="lazy" width={1024} height={768} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#76B900]/10" />
                  <div className="relative h-full p-5 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[#76B900]/15 backdrop-blur-md border border-[#76B900]/40 flex items-center justify-center group-hover:bg-[#76B900] transition-all shadow-[0_0_20px_-5px_rgba(118,185,0,0.6)]" style={{ color: NV_GREEN }}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-[#76B900]/20 text-[#a3e635] border border-[#76B900]/30">
                        {categoryCounts[key] || 0} รุ่น
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white mb-1 drop-shadow-lg">{cat.nameTH}</h3>
                      <p className="text-[11px] text-white/75 leading-relaxed mb-3 line-clamp-2">{cat.descriptionTH}</p>
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#a3e635] group-hover:gap-2 transition-all">
                        ดูสินค้า <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED with TABS ── */}
      <section className="py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: NV_GREEN }}>Featured</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-3">สินค้าแนะนำ</h2>
            <p className="text-muted-foreground">สินค้าขายดีจากทุกหมวดหมู่</p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 rounded-xl bg-muted border border-border">
              {[
                { k: "all", l: "ทั้งหมด" },
                { k: "modules", l: "Modules" },
                { k: "devkits", l: "Dev Kits" },
                { k: "embedded-systems", l: "IPC" },
              ].map(({ k, l }) => (
                <button
                  key={k}
                  onClick={() => setTab(k as typeof tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === k ? "shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                  style={tab === k ? { background: NV_GREEN, color: "#0a0e27" } : undefined}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <Link
                key={p.id}
                to={`/shop/${p.id}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-[#76B900]/40 hover:shadow-xl transition-all"
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
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full text-white" style={{ background: NV_GREEN, color: "#0a0e27" }}>
                      {p.badgeTH}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base leading-tight mb-1 line-clamp-1">{p.nameTH}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.subtitleTH}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.highlightsTH.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900]">{h}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    {p.priceTHB ? (
                      <span className="text-lg font-bold text-foreground">฿{p.priceTHB.toLocaleString()}</span>
                    ) : (
                      <span className="text-sm font-semibold" style={{ color: NV_GREEN }}>สอบถามราคา</span>
                    )}
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-[#76B900] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/shop?series=Jetson%20Series" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-[#76B900] text-[#76B900] font-bold hover:bg-[#76B900] hover:text-[#0a0e27] transition-all">
              เปรียบเทียบสินค้าทั้งหมด <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── AI READY BANNER ── */}
      <section className="relative py-20 overflow-hidden">
        <img src={aiReadyImg} alt="" loading="lazy" width={1600} height={640} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e27] via-[#0a0e27]/85 to-[#0a0e27]/40" />
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl text-white">
            <Sparkles className="mb-4" size={32} style={{ color: NV_GREEN }} />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">ซื้อ Jetson ใช้ AI ได้ทันที</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              NVIDIA NGC มี AI Model สำเร็จรูปฟรีกว่า 100+ ตัว — Computer Vision, Speech, Robotics, GenAI — โหลดแล้วรันบน Jetson ได้เลย
            </p>
            <a href="https://catalog.ngc.nvidia.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all" style={{ background: NV_GREEN, color: "#0a0e27" }}>
              ดู AI Models <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── WHY ENT (6 cards) ── */}
      <section className="py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: NV_GREEN }}>Why ENT Group</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-4">ทำไมต้องซื้อกับ ENT Group?</h2>
            <p className="text-muted-foreground">เราไม่ได้แค่ขายสินค้า แต่ดูแลคุณตั้งแต่เลือกซื้อจนหลังการขาย</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyCards.map(({ icon: Icon, title, desc, stat, statLabel }) => (
              <div key={title} className="p-6 rounded-2xl bg-card border border-border hover:border-[#76B900]/40 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#76B900]/10 flex items-center justify-center mb-4" style={{ color: NV_GREEN }}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{desc}</p>
                <div className="pt-4 border-t border-border flex items-baseline gap-2">
                  <span className="text-2xl font-bold" style={{ color: NV_GREEN }}>{stat}</span>
                  <span className="text-xs text-muted-foreground">{statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5-STEP PROCESS ── */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">เราดูแลคุณทุกขั้นตอน</h2>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#76B900]/40 to-transparent" />
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
              {steps.map((s, i) => (
                <div key={s.title} className="text-center">
                  <div className="relative mx-auto w-14 h-14 rounded-full flex items-center justify-center font-bold text-white mb-4 shadow-[0_8px_24px_-6px_rgba(118,185,0,0.5)]" style={{ background: NV_GREEN, color: "#0a0e27" }}>
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-base mb-2">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES + GUARANTEES ── */}
      <section className="py-20 bg-gradient-to-br from-[#0a0e27] via-[#0d1430] to-[#0a0e27] text-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {trustBadges.map((b) => (
              <div key={b.title} className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: NV_GREEN }}>{b.num}</div>
                <div className="font-bold text-white mb-1">{b.title}</div>
                <div className="text-xs text-white/60">{b.desc}</div>
              </div>
            ))}
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">มั่นใจได้ — สินค้าแท้ทุกชิ้น</h2>
            <p className="text-white/60 max-w-2xl mx-auto">สินค้าทุกชิ้นมาพร้อมความมั่นใจทั้งด้านแหล่งที่มา เอกสาร และบริการหลังการขาย</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {guarantees.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white/[0.06] transition">
                <Icon className="mb-3" size={24} style={{ color: NV_GREEN }} />
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-all shadow-[0_0_30px_-5px_rgba(118,185,0,0.5)] hover:shadow-[0_0_40px_-5px_rgba(118,185,0,0.8)]" style={{ background: NV_GREEN, color: "#0a0e27" }}>
              <CheckCircle2 size={18} /> ปรึกษาฟรีวันนี้
            </Link>
          </div>
        </div>
      </section>

      <B2BWorkflowBanner showShopCta />
      <Footer />
    </div>
  );
};

export default JetsonEdgeAI;

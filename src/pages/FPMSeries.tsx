import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Monitor, Shield, Sun, Cpu, Layers, ScanLine, Download,
  CheckCircle2, Factory, Wrench, Boxes, Truck, ThermometerSun,
  Zap, Sparkles, Maximize, ArrowRight, Settings, Radio, Building2,
} from "lucide-react";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import AddToCartButton from "@/components/AddToCartButton";
import FooterCompact from "@/components/FooterCompact";
import MiniNavbar from "@/components/MiniNavbar";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import smartDisplayHero from "@/assets/smart-display-hero.jpg";

/* ─── Data ─── */
// Image map: รุ่น → ภาพ (ใช้ภาพจริงจาก cesipc.com)
const IMG_10 = "/images/fpm/products/fpm-1002s-10inch.jpg";
const IMG_15K = "/images/fpm/products/fpm-1502k-15-6inch.jpg";
const IMG_17 = "/images/fpm/products/fpm-1702k-17-3inch.jpg";
const IMG_RFID = "/images/fpm/products/fpm-1502b-rfid.jpg";

const fpmTouchMonitors = [
  { no: 1, model: "FPM-0801A", size: '8"', resolution: "1024x768", ratio: "4:3", touch: "Resistive", brightness: 300, price: "10,990", image: IMG_10, slug: "fpm-0801a" },
  { no: 2, model: "FPM-0802A", size: '8"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "12,990", image: IMG_10, slug: "fpm-0802a" },
  { no: 3, model: "FPM-1001A", size: '10"', resolution: "1024x768", ratio: "4:3", touch: "Resistive", brightness: 300, price: "12,990", image: IMG_10, slug: "fpm-1001a" },
  { no: 4, model: "FPM-1002A", size: '10"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "14,990", image: IMG_10, slug: "fpm-1002a" },
  { no: 5, model: "FPM-1202A", size: '12"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "15,990", image: IMG_10, slug: "fpm-1202a" },
  { no: 6, model: "FPM-1501A", size: '15"', resolution: "1024x768", ratio: "4:3", touch: "Resistive", brightness: 300, price: "17,990", image: IMG_RFID, slug: "fpm-1501a" },
  { no: 7, model: "FPM-1502A", size: '15"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "19,990", image: IMG_RFID, slug: "fpm-1502a" },
  { no: 8, model: "FPM-1702A", size: '17"', resolution: "1280x1024", ratio: "5:4", touch: "Capacitive", brightness: 300, price: "21,990", image: IMG_17, slug: "fpm-1702a" },
  { no: 9, model: "FPM-1902A", size: '19"', resolution: "1280x1024", ratio: "5:4", touch: "Capacitive", brightness: 300, price: "21,990", image: IMG_17, slug: "fpm-1902a" },
  { no: 10, model: "FPM-1502K", size: '16"', resolution: "1920x1080", ratio: "16:9", touch: "Capacitive", brightness: 300, price: "19,990", image: IMG_15K, slug: "fpm-1502k" },
  { no: 11, model: "FPM-2102K", size: '21.5"', resolution: "1920x1080", ratio: "16:9", touch: "Capacitive", brightness: 300, price: "24,990", image: IMG_17, slug: "fpm-2102k" },
  { no: 12, model: "FPM-2402KA", size: '24"', resolution: "1920x1080", ratio: "16:9", touch: "Capacitive", brightness: 300, price: "Call", image: IMG_17, slug: "fpm-2402ka" },
];

// Product Showcase — 6 highlight models (จาก cesipc.com landing)
const productShowcase = [
  { model: "FPM-1002S", size: '10"', label: "10-inch Industrial", image: IMG_10, slug: "fpm-1002a" },
  { model: "FPM-1202C", size: '12"', label: "12-inch Industrial", image: IMG_10, slug: "fpm-1202a" },
  { model: "FPM-1502B-RFID", size: '15"', label: "15-inch RFID Edition", image: IMG_RFID, slug: "fpm-1502a", badge: "RFID" },
  { model: "FPM-1502K", size: '15.6"', label: "15.6-inch Wide", image: IMG_15K, slug: "fpm-1502k" },
  { model: "FPM-1702K", size: '17.3"', label: "17.3-inch Industrial", image: IMG_17, slug: "fpm-1702a" },
  { model: "FPM-2102K", size: '21.5"', label: "21.5-inch Wide", image: IMG_17, slug: "fpm-2102k" },
];

// Lifestyle / Real-world installation gallery
const lifestyleGallery = [
  { src: "/images/fpm/lifestyle/install-1.jpg", caption: "ติดตั้งบน Arm Mount ในสายการผลิต" },
  { src: "/images/fpm/lifestyle/install-2.jpg", caption: "Embedded Cabinet ในห้องคอนโทรล" },
  { src: "/images/fpm/lifestyle/install-3.jpg", caption: "ใช้งาน RFID อ่าน Tag คลังสินค้า" },
  { src: "/images/fpm/lifestyle/install-4.jpg", caption: "หน้าจอ HMI สำหรับ CNC" },
  { src: "/images/fpm/lifestyle/install-5.jpg", caption: "ติดตั้ง VESA บนผนัง" },
];

const fpmDatasheets = [
  { model: "FPM-0801A", href: null, note: "ติดต่อสอบถาม" },
  { model: "FPM-100XA", href: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_5d760f5082bb435aaa29a55ab6298a02.pdf" },
  { model: "FPM-150XA", href: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_69e01e1d7ddb4da6a215f9b617bf7bd4.pdf" },
  { model: "FPM-1202A", href: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_a3754cf13eaa40b09346e93fdb46c16a.pdf" },
  { model: "FPM-1702A", href: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_8753cbe1d9c5428b8b55f81c9b98ee3a.pdf" },
  { model: "FPM-1902A", href: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_2e25c9d6f2974be5bcfbcf356f82f568.pdf" },
  { model: "FPM-2102K", href: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_ccc895a9d8314d8396843387d8120e18.pdf" },
  { model: "FPM-2402KA", href: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_21234f29c0c045f380e17e101ce14e17.pdf" },
];

const sizeMatrix = [
  { size: "8\"", ratios: ["4:3"], models: 2 },
  { size: "10\"", ratios: ["4:3"], models: 2 },
  { size: "12\"", ratios: ["4:3"], models: 1 },
  { size: "15\"", ratios: ["4:3"], models: 2 },
  { size: "16\"", ratios: ["16:9"], models: 1 },
  { size: "17\"", ratios: ["5:4"], models: 1 },
  { size: "19\"", ratios: ["5:4"], models: 1 },
  { size: "21.5\"", ratios: ["16:9"], models: 1 },
  { size: "24\"", ratios: ["16:9"], models: 1 },
];

const useCases = [
  { icon: Factory, title: "Factory Automation", desc: "หน้าจอ HMI สำหรับสายการผลิต ทนฝุ่น น้ำมัน ความชื้น", image: "/images/wix/0597a3_bcb05795214544aaaa6de89e36e1240d_1e304dda.jpg" },
  { icon: Wrench, title: "CNC & Machine Control", desc: "เปลี่ยนเครื่องจักรเดิมให้ควบคุมด้วยระบบสัมผัส", image: "/images/wix/0597a3_5296e6c18d9c46eda07b3c9a4747484d_d08efd28.jpg" },
  { icon: Boxes, title: "Smart Warehouse", desc: "รุ่น FPM-1502A-RFID อ่าน/เขียน Tag สำหรับ Traceability", image: "/images/wix/0597a3_772cb29089e6441683f42be27f12dd10_b821819c.jpg" },
  { icon: Truck, title: "Logistics & Production Line", desc: "สแกนบาร์โค้ด ติดตามสินค้า บนสายพานลำเลียง", image: "/images/wix/0597a3_c12a57b72528451194c0e554b3a7876e_95272f86.jpg" },
  { icon: Building2, title: "Military & Big Data", desc: "ระบบควบคุมที่ต้องการความเสถียร 24/7 ในห้องคอนโทรล", image: "/images/wix/0597a3_8d732a24969b4605a70e4c8b1f199a4d_b06ddd94.jpg" },
  { icon: Radio, title: "Customizable Interface", desc: "Aviation Connector, RFID, RS-232/485 ตามสเปกลูกค้า", image: "/images/wix/005637_c40ca1d586a44b1ca9fc90cf2c49af6a_b4610452.jpg" },
];

const features = [
  { icon: Shield, title: "IP65 Front Panel", desc: "ทนน้ำกระเซ็น ฝุ่น เหมาะกับสภาพแวดล้อมโรงงาน" },
  { icon: ThermometerSun, title: "Wide Temperature", desc: "-40°C ถึง +80°C ทำงานได้ทั้งห้องเย็นและเตาอบ" },
  { icon: Sparkles, title: "Optical Bonding", desc: "ลด Glare กระจกเสริมแรง เห็นชัดทุกมุมมอง" },
  { icon: Zap, title: "Low 0.5% Failure Rate", desc: "อัตราเสียต่อปีเพียง 0.5% — ออกแบบมาเพื่อใช้งาน 24/7" },
  { icon: Settings, title: "Flexible Customization", desc: "เพิ่ม RFID, ปรับพอร์ต, หรือตู้ตามแบบลูกค้า" },
  { icon: Maximize, title: "VESA 75/100", desc: "ติดตั้งบน Arm, ฝังตู้, หรือยึดผนังได้มาตรฐาน" },
];

const FPMSeries = () => {
  const [filterTouch, setFilterTouch] = useState<"all" | "Capacitive" | "Resistive">("all");

  const filtered = fpmTouchMonitors.filter(m =>
    filterTouch === "all" || m.touch === filterTouch
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title='FPM Series — Industrial Touch Monitor 8"–24" | IP65, Wide-Temp'
        description="จอภาพสัมผัสเกรดอุตสาหกรรม FPM Series ขนาด 8 ถึง 24 นิ้ว IP65, Optical Bonding, Wide Temperature -40°C ถึง 80°C สำหรับ HMI, CNC, Factory Automation, Smart Warehouse"
        path="/fpm-series"
      />
      <ProductJsonLd
        collectionName="FPM Series Industrial Touch Monitor"
        collectionDescription="Industrial Touch Monitor 8-24 inch with IP65, Optical Bonding, Wide Temperature"
        collectionUrl="/fpm-series"
        products={fpmTouchMonitors.map(m => ({
          name: m.model,
          price: m.price,
          description: `${m.size} ${m.resolution} ${m.touch} Touch`,
          category: "Industrial Touch Monitor"
        }))}
      />
      <BreadcrumbJsonLd items={[
        { name: "สินค้า", path: "/products" },
        { name: "Smart Display", path: "/smart-display" },
        { name: "FPM Series", path: "/fpm-series" }
      ]} />

      <MiniNavbar />

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={smartDisplayHero} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">หน้าหลัก</Link>
            <span>/</span>
            <Link to="/smart-display" className="hover:text-primary">Smart Display</Link>
            <span>/</span>
            <span className="text-foreground font-semibold">FPM Series</span>
          </nav>

          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
                  Industrial Grade
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase border border-amber-500/30">
                  IP65 + Wide-Temp
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase border border-emerald-500/30">
                  12 รุ่น พร้อมส่ง
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-foreground leading-tight mb-4">
                FPM Series
                <span className="block text-xl md:text-2xl lg:text-3xl text-primary font-bold mt-2">
                  Industrial Touch Monitor 8"–24"
                </span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                <span className="font-bold text-foreground">Full-Size Matrix, Hardcore Vision —</span>{" "}
                จอภาพสัมผัสเกรดอุตสาหกรรมครบทุกขนาด ตั้งแต่ 8 ถึง 24 นิ้ว ครอบคลุม 4:3, 16:9 และ 5:4
                ทนต่อฝุ่น น้ำมัน และอุณหภูมิสุดขั้ว เพื่อใช้งาน HMI, CNC, Factory Automation, Smart Warehouse
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { num: "12", label: "รุ่น" },
                  { num: "8-24\"", label: "ขนาด" },
                  { num: "IP65", label: "กันน้ำ" },
                  { num: "0.5%", label: "Failure/yr" },
                ].map((s) => (
                  <div key={s.label} className="border border-border rounded-lg p-3 bg-card/50 backdrop-blur">
                    <div className="text-2xl font-display font-black text-primary">{s.num}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="#models" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition shadow-lg shadow-primary/20">
                  ดูตารางราคาทั้ง 12 รุ่น <ArrowRight size={16} />
                </a>
                <a href="#size-matrix" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card font-bold text-foreground hover:bg-muted transition">
                  <Maximize size={16} /> เลือกขนาดที่ใช่
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
                <img
                  src="/images/wix/0597a3_7ae90fd5a4fd425d9cc9efad0a31c636_44990981.png"
                  alt="FPM Series Industrial Touch Monitor"
                  className="w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Why Industrial Grade — Feature Grid ═══ */}
      <section className="py-16 border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
              Why FPM Series
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              ทำไมต้อง <span className="text-primary">เกรดอุตสาหกรรม</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ไม่ใช่จอ Consumer ทั่วไป — ออกแบบมาเพื่อทำงาน 24/7 ในสภาพแวดล้อมที่โหดที่สุด
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="group p-6 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Product Showcase — 6 Highlight Models ═══ */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
              Product Lineup
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              รุ่นเด่น <span className="text-primary">6 รุ่นยอดนิยม</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              จาก 10" ถึง 21.5" — ครอบคลุมทุกการใช้งาน HMI, Smart Warehouse, CNC Control
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {productShowcase.map((p) => (
              <Link
                key={p.model}
                to={`/fpm-series/${p.slug}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden flex items-center justify-center p-6">
                  <img
                    src={p.image}
                    alt={`${p.model} ${p.label}`}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {p.badge && (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      {p.badge}
                    </span>
                  )}
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-wider">
                    {p.size}
                  </span>
                </div>
                <div className="p-4 border-t border-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{p.label}</div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">{p.model}</h3>
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Lifestyle / Real-world Showcase ═══ */}
      <section className="py-16 border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
              Real Installation
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              ภาพจาก <span className="text-primary">การติดตั้งจริง</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ดูบรรยากาศการใช้งาน FPM Series ในโรงงานและสถานที่จริง
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {lifestyleGallery.map((g, i) => (
              <figure
                key={i}
                className={`group relative rounded-xl overflow-hidden border border-border bg-card ${
                  i === 0 ? "col-span-2 row-span-2 md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <div className={`${i === 0 ? "aspect-square lg:aspect-auto lg:h-full" : "aspect-[3/2]"} overflow-hidden`}>
                  <img
                    src={g.src}
                    alt={g.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Size Matrix ═══ */}
      <section id="size-matrix" className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
              Size Matrix
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              เลือกขนาดที่ <span className="text-primary">เหมาะกับงาน</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              จาก 8 นิ้วสำหรับงาน Embedded ถึง 24 นิ้วสำหรับห้องคอนโทรล — ครอบคลุมทุก Aspect Ratio
            </p>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {sizeMatrix.map((s) => (
              <a
                key={s.size}
                href="#models"
                className="group p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all text-center"
              >
                <div className="text-3xl font-display font-black text-foreground group-hover:text-primary transition-colors">
                  {s.size}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {s.ratios.join(", ")}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-primary font-bold mt-2">
                  {s.models} รุ่น
                </div>
              </a>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <img
                src="/images/wix/0597a3_171a07409e364dd4b23631e28628341f_839b524c.png"
                alt="Wide Screen & Square Screen options"
                className="w-full object-contain"
              />
              <div className="p-4 border-t border-border">
                <h4 className="font-bold text-foreground text-sm mb-1">Wide & Square Screen</h4>
                <p className="text-xs text-muted-foreground">เลือก 4:3, 5:4 สำหรับงาน HMI หรือ 16:9 สำหรับการแสดงผลกว้าง</p>
              </div>
            </div>
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <img
                src="/images/wix/0597a3_2b37f8b836bf40e983200b7d2c7eec55_d29d91f9.png"
                alt="FPM size options 8-24 inch"
                className="w-full object-contain"
              />
              <div className="p-4 border-t border-border">
                <h4 className="font-bold text-foreground text-sm mb-1">เปรียบเทียบขนาดจริง</h4>
                <p className="text-xs text-muted-foreground">ดูสัดส่วนขนาดจอทั้ง 9 ขนาดในแบบที่จับต้องได้</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Easy Connection ═══ */}
      <section className="py-16 border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border overflow-hidden bg-card p-6">
              <img
                src="/images/wix/0597a3_bd712d6f658443bbb2190fda091ee8b1_de7fec1c.png"
                alt="Industrial Grade Computer + Touch Screen"
                className="w-full object-contain rounded-lg mb-4"
              />
              <h3 className="font-bold text-foreground mb-2">Industrial PC + Touch Monitor</h3>
              <p className="text-sm text-muted-foreground">
                ส่งมอบประสบการณ์ที่แข็งแกร่ง กับการเลือกใช้ Industrial PC ร่วมกับหน้าจอ Touch Screen เกรดอุตสาหกรรม
              </p>
            </div>
            <div className="rounded-xl border border-border overflow-hidden bg-card p-6">
              <img
                src="/images/wix/0597a3_099390617863452cb42bc0e2eeca3ab2_45701297.png"
                alt="Easy connection USB + HDMI"
                className="w-full object-contain rounded-lg mb-4"
              />
              <h3 className="font-bold text-foreground mb-2">Plug & Play</h3>
              <p className="text-sm text-muted-foreground">
                เพียงเสียบสายไฟ USB และ HDMI — เปลี่ยนระบบการทำงานเดิมเป็นแบบสัมผัส พร้อมใช้งานทันที
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Use Cases ═══ */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
              Use Cases
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              ใช้งานจริงใน <span className="text-primary">โรงงานและธุรกิจ</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((u, i) => {
              const Icon = u.icon;
              return (
                <div key={i} className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img src={u.image} alt={u.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-primary" />
                      <h3 className="font-bold text-foreground text-sm">{u.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{u.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Models / Pricing Table ═══ */}
      <section id="models" className="py-16 border-b border-border bg-muted/20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
              All 12 Models
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              ตารางรุ่นและ <span className="text-primary">ราคา</span>
            </h2>
            <p className="text-muted-foreground">เริ่มต้น <span className="font-bold text-primary">฿10,990</span> — ราคาก่อน VAT, ส่งฟรีกรุงเทพ-ปริมณฑล</p>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {(["all", "Capacitive", "Resistive"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterTouch(t)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  filterTouch === t
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {t === "all" ? "ทั้งหมด" : t === "Capacitive" ? "Capacitive (มือเปล่า)" : "Resistive (ปากกา/ถุงมือ)"}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">#</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">รุ่น</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">ขนาด</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">ความละเอียด</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">อัตราส่วน</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Touch</th>
                    <th className="text-right p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">ราคา (฿)</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.no} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-muted-foreground">{item.no}</td>
                      <td className="p-3 font-bold text-foreground">{item.model}</td>
                      <td className="p-3 text-foreground font-semibold">{item.size}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{item.resolution}</td>
                      <td className="p-3 text-muted-foreground hidden lg:table-cell">{item.ratio}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.touch === "Capacitive"
                            ? "bg-primary/10 text-primary border border-primary/30"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        }`}>
                          {item.touch}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-primary text-base">{item.price}</td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex gap-1 justify-end">
                          <AddToCartButton
                            productModel={item.model}
                            productName={`FPM ${item.size} Touch Monitor`}
                            productDescription={`${item.size} ${item.resolution} ${item.touch} ${item.brightness}nits`}
                            size="sm"
                            variant="outline"
                          />
                          <QuoteRequestButton productModel={item.model} productName={item.model} size="sm" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <PriceDisclaimer />
        </div>
      </section>

      {/* ═══ FPM17 Special + Mounting ═══ */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
              Featured & Installation
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              FPM17 Special Edition + <span className="text-primary">VESA Mounting</span>
            </h2>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <img
              src="/images/wix/0597a3_c6e92eb018a04ed78ef653433323ccc4_23264789.png"
              alt="FPM17 Special Edition"
              className="w-full object-contain"
            />
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <img
              src="/images/wix/0597a3_5bbc918177214812816fca9cac808de6_3497905f.png"
              alt="VESA Mounting options"
              className="w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* ═══ Datasheets ═══ */}
      <section className="py-16 border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
              Documentation
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3 flex items-center justify-center gap-3">
              <Download size={28} className="text-primary" />
              ดาวน์โหลด <span className="text-primary">Datasheet</span>
            </h2>
            <p className="text-muted-foreground">เอกสารข้อมูลทางเทคนิคสำหรับวิศวกรและฝ่ายจัดซื้อ</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {fpmDatasheets.map((d) => (
              d.href ? (
                <a
                  key={d.model}
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Download size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground text-sm">{d.model}</div>
                    <div className="text-[11px] text-muted-foreground">PDF Datasheet</div>
                  </div>
                </a>
              ) : (
                <div key={d.model} className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-border bg-card/50 opacity-70">
                  <div className="w-10 h-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                    <Download size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-muted-foreground text-sm">{d.model}</div>
                    <div className="text-[11px] text-muted-foreground italic">{d.note}</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Cross-link to Smart Display ═══ */}
      <section className="py-12 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/smart-display"
            className="group flex items-center gap-4 p-6 rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/40 hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Monitor size={24} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">มองหาจอ Signage / KIOSK?</div>
              <h3 className="text-lg md:text-xl font-display font-bold text-foreground">
                ดู Smart Display, Digital Signage และตู้ KIOSK สำเร็จรูป →
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Indoor / Outdoor Display, Stainless IP69K, Food Grade — ครบจบในที่เดียว
              </p>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" size={24} />
          </Link>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            ต้องการ Customize หรือ <span className="text-primary">สั่งจำนวนมาก</span>?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            FPM Series รองรับการปรับแต่ง RFID, Aviation Connector, ตู้ Custom — ทีมวิศวกรของเราพร้อมให้คำปรึกษา
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact-us" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition shadow-lg">
              ขอใบเสนอราคา <ArrowRight size={16} />
            </Link>
            <Link to="/about-us" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card font-bold text-foreground hover:bg-muted transition">
              <CheckCircle2 size={16} /> เกี่ยวกับ ENT Group
            </Link>
          </div>
        </div>
      </section>

      <FooterCompact />
    </div>
  );
};

export default FPMSeries;

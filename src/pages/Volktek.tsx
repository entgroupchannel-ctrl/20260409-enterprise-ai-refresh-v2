import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Shield, Zap, Network, Server, ThermometerSun, Globe, FileText, Youtube, ThumbsUp, Play, MapPin, Cpu, Layers, Radio, Cable, Activity, Wifi } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import CartBadge from "@/components/CartBadge";
import ShareButtons from "@/components/ShareButtons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import volktekCertifications from "@/assets/volktek-certifications.png";
import FooterCompact from "@/components/FooterCompact";
import B2BPlatformInterfaceShowcase from "@/components/B2BPlatformInterfaceShowcase";
import MiniNavbar from "@/components/MiniNavbar";
import Layer3Section from "@/components/volktek/Layer3Section";
import IndustrialPoeSection from "@/components/volktek/IndustrialPoeSection";
import IndustrialEthernetSection from "@/components/volktek/IndustrialEthernetSection";

// Official assets from volktek.com
import heroSpe from "@/assets/volktek/hero-spe.png";
import heroBtPoe from "@/assets/volktek/hero-bt-poe.png";
import heroFactory from "@/assets/volktek/hero-factory-automation.jpg";
import heroLamungan from "@/assets/volktek/hero-lamungan.gif";
import heroNms from "@/assets/volktek/hero-nms.png";
import heroMadeInTaiwan from "@/assets/volktek/hero-made-in-taiwan.jpg";
import heroPartner from "@/assets/volktek/hero-partner.png";
import catLayer3 from "@/assets/volktek/cat-layer3.jpg";
import catIndustrialEthernet from "@/assets/volktek/cat-industrial-ethernet.jpg";
import catIndustrialPoe from "@/assets/volktek/cat-industrial-poe.jpg";
import catMetroEthernet from "@/assets/volktek/cat-metro-ethernet.jpg";
import catMediaConverter from "@/assets/volktek/cat-media-converter.jpg";
import catEmsNms from "@/assets/volktek/cat-ems-nms.png";
import catSfp from "@/assets/volktek/cat-sfp.jpg";
import catPoeInjector from "@/assets/volktek/cat-poe-injector.jpg";
import catFirewall from "@/assets/volktek/cat-firewall.jpg";
import catAccessories from "@/assets/volktek/cat-accessories.jpg";

// Hero rotator — official Volktek banners
const heroSlides = [
  {
    image: heroSpe,
    badge: "Long-Reach SPE",
    title: "Connectivity Made Simple",
    desc: "โซลูชั่น Single-Pair Ethernet ระยะไกล — ลดสาย ลดต้นทุน เพิ่มความน่าเชื่อถือ",
  },
  {
    image: heroBtPoe,
    badge: "BT PoE",
    title: "High-Power PoE for High-Performance Network",
    desc: "PoE++ จ่ายไฟ 90W ต่อพอร์ต รองรับกล้อง PTZ, AP Wi-Fi 6/7, อุปกรณ์ IoT",
  },
  {
    image: heroFactory,
    badge: "Factory Automation",
    title: "Optimizing Connectivity",
    desc: "Advantage Redefined — Excellence through Factory Automation",
  },
  {
    image: heroLamungan,
    badge: "LAMUNGAN Platform",
    title: "Easy to manage with Wizard, Topology Map and Dashboard",
    desc: "แพลตฟอร์มจัดการเครือข่ายแบบรวมศูนย์ ตั้งค่าง่ายผ่าน Web UI",
  },
  {
    image: heroNms,
    badge: "Network Management",
    title: "Manage & Monitor Entire Network",
    desc: "ดูแลอุปกรณ์หลากหลายประเภทและการเชื่อมต่อระหว่างกันในที่เดียว",
  },
];

// 10 Product Categories — based on actual volktek.com catalog
const productCategories = [
  {
    id: "layer3",
    icon: Layers,
    title: "Layer 3 Industrial Switches",
    desc: "L3 Managed Switches และ L3 Managed PoE++ สำหรับเครือข่ายอุตสาหกรรมขั้นสูงที่ต้องการ Routing",
    image: catLayer3,
    items: ["Layer 3 Managed Switches", "Layer 3 Managed PoE++ Switches"],
    href: "https://www.volktek.com/product_en.php?id=663",
  },
  {
    id: "industrial-ethernet",
    icon: Network,
    title: "Industrial Ethernet Switches",
    desc: "ครอบคลุม Unmanaged, Lite Managed, Managed และ DNV/LR Certified สำหรับงานทางทะเล",
    image: catIndustrialEthernet,
    items: ["Unmanaged Basic / Premium", "Lite Managed", "Managed Switches", "DNV & LR Certified"],
    href: "https://www.volktek.com/product_en.php?id=52",
  },
  {
    id: "industrial-poe",
    icon: Zap,
    title: "Industrial PoE Switches",
    desc: "PoE+, PoE++, BT PoE — จ่ายไฟผ่านสาย LAN ให้กล้อง IP, AP, IP Phone, อุปกรณ์ IoT",
    image: catIndustrialPoe,
    items: ["Unmanaged PoE+", "Lite Managed PoE+", "Managed PoE+", "Managed PoE++"],
    href: "https://www.volktek.com/product_en.php?id=51",
  },
  {
    id: "metro-ethernet",
    icon: Globe,
    title: "Metro Ethernet Switches",
    desc: "1G / 10G Aggregation และ Access Switches สำหรับ Service Provider และ Metro Network",
    image: catMetroEthernet,
    items: ["1G / 10G Aggregation", "1G / 10G Access Switches"],
    href: "https://www.volktek.com/product_en.php?id=50",
  },
  {
    id: "media-converter",
    icon: Cable,
    title: "Media Converters",
    desc: "แปลง Copper ↔ Fiber, Serial ↔ Fiber, SPE Converters พร้อมรุ่น PoE+",
    image: catMediaConverter,
    items: ["Copper to Fiber", "PoE+ Converters", "Serial to Fiber", "SPE Converters"],
    href: "https://www.volktek.com/product_en.php?id=56",
  },
  {
    id: "ems-nms",
    icon: Activity,
    title: "EMS / NMS Software",
    desc: "LAMUNGAN และ INDY — แพลตฟอร์มจัดการอุปกรณ์เครือข่ายแบบรวมศูนย์",
    image: catEmsNms,
    items: ["LAMUNGAN Management", "INDY NMS"],
    href: "https://www.volktek.com/product_en.php?id=609",
  },
  {
    id: "sfp",
    icon: Radio,
    title: "SFP Modules",
    desc: "100BASE, Gigabit, 10G SFP+ ทั้งแบบ Standard และ Bi-Di รองรับระยะหลายแบบ",
    image: catSfp,
    items: ["100BASE / 100BASE Bi-Di", "Gigabit / Gigabit Bi-Di", "10G SFP+"],
    href: "https://www.volktek.com/product_en.php?id=73",
  },
  {
    id: "poe-injector",
    icon: Wifi,
    title: "PoE Injectors / Splitters",
    desc: "PoE Injector สำหรับเพิ่มความสามารถจ่ายไฟ และ Splitter สำหรับอุปกรณ์ที่ไม่รองรับ PoE",
    image: catPoeInjector,
    items: ["PoE Injectors", "PoE Splitters"],
    href: "https://www.volktek.com/product_en.php?id=108",
  },
  {
    id: "firewall",
    icon: Shield,
    title: "Network Security Appliances",
    desc: "Industrial Firewall — ปกป้องเครือข่าย OT/ICS จากภัยคุกคามไซเบอร์",
    image: catFirewall,
    items: ["Industrial Firewall"],
    href: "https://www.volktek.com/product_en.php?id=672",
  },
  {
    id: "accessories",
    icon: Cpu,
    title: "Accessories",
    desc: "Industrial Power Supply DIN-Rail, อุปกรณ์เสริมสำหรับติดตั้งระบบเครือข่ายอุตสาหกรรม",
    image: catAccessories,
    items: ["Power Supply DIN-Rail"],
    href: "https://www.volktek.com/product_en.php?id=100",
  },
];

const features = [
  {
    icon: Shield,
    title: "Industrial Grade EMC",
    desc: "ป้องกันไฟกระชาก ESD ตามมาตรฐาน EN61000-6-2/6-4 อินพุตไฟคู่เพื่อความน่าเชื่อถือ",
  },
  {
    icon: ThermometerSun,
    title: "Robust Performance",
    desc: "ตัวเรือน IP30 ทนแรงสั่นสะเทือน กระแทก ความชื้น อุณหภูมิ -40°C ถึง 75°C",
  },
  {
    icon: Zap,
    title: "Power Isolation",
    desc: "แยกวงจรป้องกันไฟกระชากและ ESD ปกป้องวงจรภายในจากความผันผวนพลังงาน",
  },
  {
    icon: Network,
    title: "Xpress Ring & ERPS",
    desc: "กู้คืนเครือข่ายระดับมิลลิวินาที รับประกันการส่งข้อมูลแบบ Real-time ต่อเนื่อง",
  },
  {
    icon: Server,
    title: "SNMP Monitoring",
    desc: "แจ้งเตือนผู้ดูแลระบบเมื่อเกิดความผิดปกติ ลดเวลาหยุดทำงาน",
  },
  {
    icon: Globe,
    title: "Certified Worldwide",
    desc: "DNV/GL, ISO, FCC, CE, VCCI — ได้รับการรับรองจากหน่วยงานระดับสากล",
  },
];

const Volktek = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  // Auto rotate hero
  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[slideIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="Volktek Industrial Ethernet Switch" description="Volktek Industrial Ethernet Switch Managed/Unmanaged PoE สำหรับโรงงาน ระบบกล้องวงจรปิด และโครงข่ายอุตสาหกรรม" path="/volktek" />
      <ProductJsonLd
        collectionName="Volktek Industrial Ethernet Switch"
        collectionDescription="Volktek Industrial Ethernet Switch Managed/Unmanaged PoE สำหรับโรงงานและระบบกล้องวงจรปิด"
        collectionUrl="/volktek"
        products={productCategories.map(c => ({ name: c.title, description: c.desc, category: "Industrial Ethernet Switch" }))}
      />
      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "Volktek", path: "/volktek" }]} />
      <MiniNavbar />

      {/* Hero Rotator — Official Volktek Banners */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="container max-w-7xl mx-auto px-4 py-6 relative z-10">
          <div className="card-surface overflow-hidden mb-8 relative group">
            <div className="relative aspect-[21/9] sm:aspect-[21/8] bg-muted overflow-hidden">
              {heroSlides.map((s, i) => (
                <img
                  key={i}
                  src={s.image}
                  alt={s.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    i === slideIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-2 backdrop-blur-sm">{slide.badge}</Badge>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground mb-2 leading-tight max-w-3xl">
                  {slide.title}
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl line-clamp-2">{slide.desc}</p>
              </div>
              {/* Slide indicators */}
              <div className="absolute top-4 right-4 flex gap-1.5 bg-background/60 backdrop-blur-sm rounded-full px-2 py-1">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slideIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">Official Partner · ตัวแทนจำหน่ายในประเทศไทย</Badge>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
                Volktek <span className="text-gradient">Industrial Ethernet</span>
              </h1>
              <p className="text-muted-foreground max-w-3xl leading-relaxed">
                Volktek ก่อตั้งในปี 1994 จากไต้หวัน ผู้เชี่ยวชาญด้านออกแบบและผลิตอุปกรณ์เครือข่ายอุตสาหกรรมคุณภาพสูง รองรับ Ethernet ทั้งรุ่นปัจจุบันและ Next Generation สำหรับ Metro, Surveillance และ Industrial Automation — ได้รับการรับรอง DNV/GL, ISO, FCC, CE, VCCI
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button variant="outline" size="sm" asChild>
                <a href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_888cab8832d1411582ecb607c1719677.pdf" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Datasheet
                </a>
              </Button>
              <QuoteRequestButton productModel="Volktek Switch" productName="Volktek Industrial Switch" size="sm" />
              <AddToCartButton productModel="Volktek Switch" productName="Volktek Industrial Switch" productDescription="สวิตช์อุตสาหกรรม Volktek" size="sm" variant="outline" />
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-10 space-y-16">
        {/* Made in Taiwan — Factory Credibility */}
        <section className="card-surface overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-video md:aspect-auto md:min-h-[320px]">
              <img src={heroMadeInTaiwan} alt="Volktek — Made in Taiwan" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-primary mb-3">
                <MapPin className="w-3.5 h-3.5" /> Made in Taiwan · Since 1994
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3 leading-tight">
                ผู้นำด้านการออกแบบและผลิต <span className="text-gradient">เครือข่ายอุตสาหกรรม</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Volktek เป็น ODM/OEM ระดับโลก ออกแบบและผลิตอุปกรณ์เครือข่ายในไต้หวัน ส่งออกกว่า 60 ประเทศ
                ด้วยประสบการณ์กว่า 30 ปี เราพัฒนาเทคโนโลยีและบริการระดับมืออาชีพเพื่อตอบโจทย์
                Mission-Critical Network ในทุกอุตสาหกรรม
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="border-primary/30">30+ Years</Badge>
                <Badge variant="outline" className="border-primary/30">60+ Countries</Badge>
                <Badge variant="outline" className="border-primary/30">ODM / OEM</Badge>
                <Badge variant="outline" className="border-primary/30">Mission-Critical</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Headline */}
        <section className="card-surface p-8 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-relaxed">
            ผลิตภัณฑ์ Volktek Ethernet ได้รับการรับรองระดับสากลสำหรับการใช้งานในอุตสาหกรรมและเชิงพาณิชย์ และสอดคล้องกับมาตรฐานตลาดเพื่อความปลอดภัยและการทำงานที่แม่นยำ
          </h2>
          <img src={volktekCertifications} alt="Volktek Certifications - Profinet, Modbus, CE, FCC, RoHS, DNV GL" className="w-full max-w-4xl mx-auto h-auto" />
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">Product Features & Benefits</h2>
          <p className="text-muted-foreground text-center mb-8">Powering Next Generation Automation Network Solutions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="card-surface p-5">
                <f.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product Categories — 10 หมวดจริงตาม Volktek catalog */}
        <section>
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">Product Catalog</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              10 หมวดผลิตภัณฑ์ <span className="text-gradient">Volktek</span>
            </h2>
            <p className="text-muted-foreground text-sm">ครอบคลุมทุกความต้องการของเครือข่ายอุตสาหกรรม</p>
          </div>

          {/* Quick Nav */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {productCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="shrink-0 px-3 py-2 rounded-lg text-xs font-medium bg-secondary/50 text-foreground/70 border border-border hover:border-primary/30 hover:text-foreground transition-all flex items-center gap-1.5">
                <cat.icon className="w-3.5 h-3.5" />
                {cat.title}
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {productCategories.map((cat) => (
              <div key={cat.id} id={cat.id} className="card-surface overflow-hidden scroll-mt-24 group hover:border-primary/30 transition-colors">
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                  <img src={cat.image} alt={cat.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <div className="w-9 h-9 rounded-lg bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center">
                      <cat.icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-display font-bold text-foreground mb-1.5">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{cat.desc}</p>
                  <ul className="space-y-1 mb-4">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-foreground/80">
                        <span className="text-primary shrink-0 mt-0.5">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <AddToCartButton productModel={cat.title} productName={`Volktek ${cat.title}`} productDescription={cat.desc} size="sm" variant="outline" iconOnly />
                    <QuoteRequestButton productModel={cat.title} productName={`Volktek ${cat.title}`} size="sm" variant="outline" iconOnly />
                    <Button variant="ghost" size="sm" asChild className="ml-auto text-xs">
                      <a href={cat.href} target="_blank" rel="noopener noreferrer">
                        Datasheet <ArrowRight className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 1 — Layer 3 detailed catalog (รุ่นจริงจากโรงงาน) */}
        <Layer3Section />

        {/* Phase 3 — Industrial PoE Switches detailed catalog */}
        <IndustrialPoeSection />

        {/* Phase 4 — Industrial Ethernet Switches detailed catalog */}
        <IndustrialEthernetSection />

        {/* LAMUNGAN Platform — EMS spotlight */}
        <section className="card-surface overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-3 relative bg-muted aspect-video md:aspect-auto md:min-h-[360px]">
              <img src={heroLamungan} alt="LAMUNGAN Management Platform" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">EMS Spotlight</span>
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                LAMUNGAN <span className="text-gradient">Management Platform</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                แพลตฟอร์มบริหารจัดการอุปกรณ์เครือข่ายแบบรวมศูนย์ ตั้งค่าง่ายผ่าน Wizard
                พร้อม Topology Map และ Dashboard แบบ Real-time
              </p>
              <ul className="space-y-1.5 text-xs text-foreground/80 mb-5">
                <li className="flex items-start gap-2"><span className="text-primary shrink-0">■</span> Auto-discovery & Topology Map</li>
                <li className="flex items-start gap-2"><span className="text-primary shrink-0">■</span> Wizard-based Configuration</li>
                <li className="flex items-start gap-2"><span className="text-primary shrink-0">■</span> SNMP Trap & Real-time Dashboard</li>
                <li className="flex items-start gap-2"><span className="text-primary shrink-0">■</span> Multi-vendor Support</li>
              </ul>
              <Button variant="outline" size="sm" asChild className="self-start">
                <a href="https://www.volktek.com/productdetail_en.php?id=1716" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> เรียนรู้เพิ่มเติม
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Factory Automation Use Case */}
        <section className="card-surface overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Use Case</span>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">Factory Automation</h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                PLC และ RTU สื่อสารกับเครื่องจักร เซ็นเซอร์ และอุปกรณ์ปลายทาง จากนั้นส่งข้อมูลไปยังระบบ SCADA ผ่านสวิตช์เครือข่ายอุตสาหกรรม Volktek
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary shrink-0">■</span> ทำงานที่อุณหภูมิวิกฤต -40°C ถึง 75°C</li>
                <li className="flex items-start gap-2"><span className="text-primary shrink-0">■</span> ป้องกัน ESD + EMI/EMC Certified</li>
                <li className="flex items-start gap-2"><span className="text-primary shrink-0">■</span> ทนทานสำหรับ Mission-Critical Applications</li>
                <li className="flex items-start gap-2"><span className="text-primary shrink-0">■</span> SNMP Monitoring แจ้งเตือนเมื่อฮาร์ดแวร์ผิดปกติ</li>
                <li className="flex items-start gap-2"><span className="text-primary shrink-0">■</span> รวมเข้ากับ SCADA แบบกระจายขนาดใหญ่ได้</li>
              </ul>
            </div>
            <div className="relative bg-muted aspect-video md:aspect-auto md:min-h-[360px]">
              <img src={heroFactory} alt="Factory Automation" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Partner CTA */}
        <section className="card-surface overflow-hidden relative">
          <div className="absolute inset-0">
            <img src={heroPartner} alt="" loading="lazy" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          </div>
          <div className="relative p-8 md:p-12 text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">Partner with us</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              สนใจผลิตภัณฑ์ <span className="text-gradient">Volktek</span>?
            </h2>
            <p className="text-muted-foreground mb-6">
              ปรึกษาผู้เชี่ยวชาญของ ENT Group เพื่อเลือกสวิตช์ที่เหมาะกับเครือข่ายของคุณ — สนับสนุนทั้ง Distributor และ System Integrator
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" asChild>
                <a href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_888cab8832d1411582ecb607c1719677.pdf" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1.5" /> ดาวน์โหลด Catalog
                </a>
              </Button>
              <QuoteRequestButton productModel="Volktek Switch" productName="Volktek Industrial Switch" />
            </div>
          </div>
        </section>

        {/* YouTube */}
        <section className="py-4">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">Media</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              วิดีโอ<span className="text-gradient">แนะนำ Volktek</span>
            </h2>
          </div>
          <div className="card-surface rounded-xl overflow-hidden max-w-2xl mx-auto">
            <div className="relative aspect-video">
              <iframe
                src="https://www.youtube.com/embed/6Y6eEitc-yQ"
                title="Volktek Industrial Switch — รีวิวและแนะนำ"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"></iframe>
            </div>
            <div className="p-4 flex items-center justify-between">
              <a
                href="https://youtu.be/6Y6eEitc-yQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
                <Youtube size={16} /> ดูบน YouTube
              </a>
              <ShareButtons url="https://youtu.be/6Y6eEitc-yQ" title="Volktek Industrial Switch — รีวิวและแนะนำ" compact />
            </div>
          </div>
        </section>
      </div>
      <B2BPlatformInterfaceShowcase />
      <FooterCompact />
    </div>
  );
};

export default Volktek;

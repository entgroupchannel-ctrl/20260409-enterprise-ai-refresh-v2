import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useState, useEffect } from "react";
import { LineQRDialog } from "@/components/LineQRDialog";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Sun, Shield, Monitor, Cpu, Phone, MessageCircle,
  Download, Smartphone, Settings, Wifi, Eye, Layers, Store, BadgePercent, Printer, ScanLine, FileText,
  Filter, Star, Building2, Maximize, Lightbulb, Headphones
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo-entgroup.avif";
import smartDisplayHero from "@/assets/smart-display-hero.jpg";
import FooterCompact from "@/components/FooterCompact";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import kioskVisitor from "@/assets/kiosk-usecase-visitor.jpg";
import kioskQueue from "@/assets/kiosk-usecase-queue.jpg";
import kioskWayfinding from "@/assets/kiosk-usecase-wayfinding.jpg";
import kioskSelforder from "@/assets/kiosk-usecase-selforder.jpg";
import kioskBrand from "@/assets/kiosk-usecase-brand.jpg";
import kioskCheckin from "@/assets/kiosk-usecase-checkin.jpg";

/* ─── Data ─── */

const categories = [
  {
    id: "indoor",
    label: "Indoor Display",
    desc: "จอ Digital Signage สำหรับภายในอาคาร",
    icon: Monitor,
  },
  {
    id: "outdoor",
    label: "Outdoor Monitor",
    desc: "จอภาพความสว่างสูงสำหรับภายนอกอาคาร",
    icon: Sun,
  },
  {
    id: "kiosk",
    label: "ตู้ KIOSK สำเร็จรูป",
    desc: "ตู้คีออสก์พร้อมใช้งาน ราคาประหยัด",
    icon: Store,
  },
  {
    id: "window",
    label: "Window Display",
    desc: "จอติดหน้าต่างร้าน ความสว่างสูง",
    icon: Eye,
  },
];

const indoorProducts = [
  {
    model: "BD-3501",
    size: '35"',
    type: "Stretched Bar",
    image: "/images/wix/0597a3_313720b25f424d3db0e3e72bb247409d_5584058a.png",
  },
  {
    model: "BD-4380",
    size: '43"',
    type: "Standing Kiosk",
    image: "/images/wix/0597a3_89ddd2e3de8b4610bd0e08f02dbf25d6_e76ae3d8.png",
  },
  {
    model: "BD-4950",
    size: '49"',
    type: "Standing Display",
    image: "/images/wix/0597a3_7e5919f1202f4f68b8f09e8748a01268_04d68d10.png",
  },
  {
    model: "BD-5840",
    size: '58"',
    type: "Wall Mount",
    image: "/images/wix/0597a3_95ac9a51630d4527b072e7c6d119d91f_27fbd50a.png",
  },
  {
    model: "BD-6500",
    size: '65"',
    type: "Standing Kiosk",
    image: "/images/wix/0597a3_fb0e2421e09647fc82601aeea6e6da06_3c23ea2e.png",
  },
  {
    model: "BD-7500",
    size: '75"',
    type: "Premium Display",
    image: "/images/wix/0597a3_3799af0b54e6400f88264f0f184dd65b_ff6d12d5.png",
  },
];

const fpmTouchMonitors = [
  { no: 1, model: "FPM-0801A", config: '8"/1024x768/300nits/Resistive', price: "10,990" },
  { no: 2, model: "FPM-0802A", config: '8"/1024x768/300nits/Capacitive', price: "12,990" },
  { no: 3, model: "FPM-1001A", config: '10"/1024x768/300nits/Resistive', price: "12,990" },
  { no: 4, model: "FPM-1002A", config: '10"/1024x768/300nits/Capacitive', price: "14,990" },
  { no: 5, model: "FPM-1202A", config: '12"/1024x768/300nits/Capacitive', price: "15,990" },
  { no: 6, model: "FPM-1501A", config: '15"/1024x768/300nits/Resistive', price: "17,990" },
  { no: 7, model: "FPM-1502A", config: '15"/1024x768/300nits/Capacitive', price: "19,990" },
  { no: 8, model: "FPM-1702A", config: '17"/1280x1024/300nits/Capacitive', price: "21,990" },
  { no: 9, model: "FPM-1902A", config: '19"/1280x1024/300nits/Capacitive', price: "21,990" },
  { no: 10, model: "FPM-1502K", config: '16"/1920x1080/300nits/Capacitive', price: "19,990" },
  { no: 11, model: "FPM-2102K", config: '21.5"/1920x1080/300nits/Capacitive', price: "24,990" },
  { no: 12, model: "FPM-2402KA", config: '24"/1920x1080/300nits/Capacitive', price: "Call" },
];

const fpmDatasheets = [
  { model: "FPM-0801A", href: "/datasheets/005637_5e44d2b9d7cc48fa9c409252e62d861d.pdf" },
  { model: "FPM-100XA", href: "/datasheets/005637_5d760f5082bb435aaa29a55ab6298a02.pdf" },
  { model: "FPM-150XA", href: "/datasheets/005637_69e01e1d7ddb4da6a215f9b617bf7bd4.pdf" },
  { model: "FPM-1202A", href: "/datasheets/005637_a3754cf13eaa40b09346e93fdb46c16a.pdf" },
  { model: "FPM-1702A", href: "/datasheets/005637_8753cbe1d9c5428b8b55f81c9b98ee3a.pdf" },
  { model: "FPM-1902A", href: "/datasheets/005637_2e25c9d6f2974be5bcfbcf356f82f568.pdf" },
  { model: "FPM-2102K", href: "/datasheets/005637_ccc895a9d8314d8396843387d8120e18.pdf" },
  { model: "FPM-2402KA", href: "/datasheets/005637_21234f29c0c045f380e17e101ce14e17.pdf" },
];

const outdoorFeatures = [
  { icon: Sun, title: "ความสว่าง 1000–1600 Nits", desc: "มองเห็นชัดแม้กลางแดดจ้า" },
  { icon: Shield, title: "ทนทุกสภาพอากาศ", desc: "ทนฝุ่น ความชื้น อากาศร้อน-เย็น" },
  { icon: Monitor, title: "หลายขนาดให้เลือก", desc: '12", 17", 19", 21", 27", 32"' },
  { icon: Cpu, title: "Windows / Android", desc: "เลือกระบบปฏิบัติการตามโครงการ" },
  { icon: Settings, title: "Custom Enclosure", desc: "ออกแบบตู้ติดตั้งพร้อม AirFlow" },
  { icon: Wifi, title: "Digital Signage Software", desc: "ซอฟต์แวร์จัดการเนื้อหาฟรี" },
];

const outdoorSizes = [
  { size: '12"', nits: "1200 Nits", datasheet: "/datasheets/0597a3_c2427ebf71c7451892c5d778e30790f9.pdf" },
  { size: '17"', nits: "1500 Nits", datasheet: "/datasheets/0597a3_070123590de942e983e56575061e0db0.pdf" },
  { size: '19"', nits: "1500 Nits", datasheet: "/datasheets/0597a3_a5ce046763ff4e62a63afc6a3cd1db38.pdf" },
  { size: '19"', nits: "1600 Nits", datasheet: "/datasheets/0597a3_899aaffbc58843598a2c0ddb4d5abfdf.pdf" },
];

const softwareFeatures = [
  { title: "Device Management", desc: "จัดการรายการอุปกรณ์ ดูสถานะออนไลน์/ออฟไลน์ ตั้งเวลา ปรับความสว่าง อัพเดตเฟิร์มแวร์", icon: Smartphone },
  { title: "Program Management", desc: "สร้าง แก้ไข พรีวิว และเผยแพร่โปรแกรมแสดงผลได้ทุกประเภทอุปกรณ์ พร้อม GPS fixed point play", icon: Layers },
  { title: "Material & Statistics", desc: "อัพโหลดวิดีโอ ภาพ เอกสาร เพลง พร้อมนับจำนวนและระยะเวลาเล่น", icon: Eye },
  { title: "Settings & Roles", desc: "จัดการบัญชีผู้ใช้ กำหนดสิทธิ์ Sub-user และ Role management", icon: Settings },
];

const applications = [
  "Retail Store", "Shopping Mall", "Restaurant & Hotel",
  "Airport & Subway", "Exhibition Hall", "Education",
  "Elevator Display", "Medical", "Wayfinding",
];

const priceLists = [
  { label: "Indoor Digital Signage", href: "/datasheets/0597a3_aaa0993f63084600adb415fd5f58673e.pdf" },
  { label: "Outdoor Monitor", href: "/datasheets/0597a3_250d37f715ad465b843b65ec5d9d0cf6.pdf" },
  { label: "Window Display", href: "/datasheets/0597a3_cd6650ceecb94accbcd7e107a26d4115.pdf" },
  { label: "Stretched Bar Display", href: "/datasheets/0597a3_3c78cb1f6a254f3c894eb284bc62bfb8.pdf" },
  { label: "Product Overview", href: "/datasheets/0597a3_681d6ced6320463492e916e4374cacde.pdf" },
  { label: "Outdoor Datasheet", href: "/datasheets/0597a3_8c98e268cc4543a58132ccad12e6f343.pdf" },
];

/* ─── Component ─── */

const SmartDisplay = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get("tab");
    return tab === "kiosk" || tab === "outdoor" ? tab : "indoor";
  });
  const [showLineQR, setShowLineQR] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [videoTab, setVideoTab] = useState("smart-display");
  const [podcastTab, setPodcastTab] = useState("smart-display");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="Smart Display, KIOSK & Digital Signage" description="จอ Smart Display, ตู้ KIOSK สำเร็จรูป และ Digital Signage สำหรับร้านค้า โรงแรม โรงพยาบาล สำนักงาน พร้อมซอฟต์แวร์ครบวงจร" path="/smart-display" />
      <ProductJsonLd
        collectionName="Smart Display, KIOSK & Digital Signage"
        collectionDescription="จอ Smart Display, ตู้ KIOSK สำเร็จรูป และ Digital Signage สำหรับร้านค้า โรงแรม โรงพยาบาล สำนักงาน"
        collectionUrl="/smart-display"
        products={fpmTouchMonitors.map(m => ({ name: m.model, price: m.price, description: m.config, category: "Smart Display & Touch Monitor" }))}      />

      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "Smart Display", path: "/smart-display" }]} />
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="ENT GROUP" className="h-8 w-auto" />
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-semibold text-foreground">Smart Display</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/" className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} /> กลับหน้าแรก
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={smartDisplayHero} alt="" className="w-full h-full object-cover" width={1920} height={900} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>
        <div className="relative z-10 container max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
              Digital Signage • Outdoor • Indoor
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black mb-6 leading-tight text-white">
              จอภาพ <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--accent))]">Smart Display</span>
              <br />
              <span className="text-2xl md:text-3xl font-bold text-white/70">สำหรับติดตั้งภายนอกและภายในอาคาร</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg">
              จอภาพ LCD ความสว่างสูง สำหรับ Digital Signage, Kiosk, ป้ายโฆษณา
              และงานแสดงผลทุกรูปแบบ พร้อมซอฟต์แวร์จัดการเนื้อหาฟรี
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                <FileText size={16} className="inline mr-1" /> ดูสินค้าทั้งหมด →
              </a>
              <a href="#downloads" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors">
                <Download size={18} /> ดาวน์โหลด Price List
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs - Sticky */}
      <div className="sticky top-[57px] z-40 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container max-w-7xl mx-auto py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-sm font-bold text-foreground whitespace-nowrap flex items-center gap-1"><Filter size={14} className="text-primary" /> เลือกหมวดสินค้า:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === cat.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-8" id="products">
        <div className="container max-w-7xl mx-auto">

          {/* Indoor Products */}
          {activeTab === "indoor" && (
            <div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {indoorProducts.map((p) => (
                  <div key={p.model} className="card-surface p-6 hover:border-primary/30 transition-all hover:-translate-y-1 group">
                    <div className="bg-secondary/30 rounded-xl p-4 mb-4 flex items-center justify-center h-64 overflow-hidden">
                      <img src={p.image} alt={p.model} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-foreground">{p.model}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{p.size}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{p.type}</p>
                    <button
                      onClick={() => setQuoteOpen(true)}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <FileText size={14} /> ขอใบเสนอราคา
                    </button>
                  </div>
                ))}
              </div>

              {/* Indoor gallery */}
              <div className="mt-10 grid md:grid-cols-2 gap-6">
                <div className="card-surface overflow-hidden">
                  <img src="/images/wix/0597a3_9b7b3b7aebd74c67b4ba73ce8cd35d2f_f62f3e54.png" alt="Indoor signage installation" className="w-full object-cover" loading="lazy" />
                </div>
                <div className="card-surface overflow-hidden">
                  <img src="/images/wix/0597a3_57760701aff84e30b2efd1cdda15df62_45ac4be2.png" alt="Display showcase" className="w-full object-cover" loading="lazy" />
                </div>
              </div>

              {/* Industrial Touch Monitor — FPM Series */}
              <div className="mt-16">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Touch Only</span>
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-xs font-bold">เกรดอุตสาหกรรม</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                  Industrial Touch Monitor — <span className="text-primary">FPM Series</span>
                </h3>
                <p className="text-muted-foreground max-w-3xl mb-3">
                  จอภาพสัมผัสเกรดอุตสาหกรรม IP65 สำหรับงาน HMI, CNC, Factory Automation, ระบบทหาร และ Big Data — เชื่อมต่อ USB + HDMI กับคอมพิวเตอร์ที่มีอยู่ เปลี่ยนเป็นระบบสัมผัสได้ทันที
                </p>
                <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Monitor size={14} className="text-primary" /> ขนาด 8"–24"</span>
                  <span className="inline-flex items-center gap-1.5"><ScanLine size={14} className="text-primary" /> Capacitive / Resistive Touch</span>
                  <span className="inline-flex items-center gap-1.5"><Shield size={14} className="text-primary" /> IP65 Front Panel</span>
                  <span className="inline-flex items-center gap-1.5"><Layers size={14} className="text-primary" /> Wide & Square Screen</span>
                  <span className="inline-flex items-center gap-1.5"><Sun size={14} className="text-primary" /> สูงสุด 1000 Nits</span>
                  <span className="inline-flex items-center gap-1.5"><Cpu size={14} className="text-primary" /> ทำงาน 24/7</span>
                </div>

                {/* Product hero image */}
                <div className="card-surface overflow-hidden rounded-xl mb-6">
                  <img
                    src="/images/wix/0597a3_7ae90fd5a4fd425d9cc9efad0a31c636_44990981.png"
                    alt="FPM Series Industrial Touch Monitor"
                    className="w-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Wide / Square screen comparison */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="card-surface overflow-hidden rounded-xl">
                    <img
                      src="/images/wix/0597a3_171a07409e364dd4b23631e28628341f_839b524c.png"
                      alt="Wide Screen & Square Screen options"
                      className="w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="card-surface overflow-hidden rounded-xl">
                    <img
                      src="/images/wix/0597a3_2b37f8b836bf40e983200b7d2c7eec55_d29d91f9.png"
                      alt="FPM size options 8-24 inch"
                      className="w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Connection & usage info */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="card-surface p-6 rounded-xl">
                    <img
                      src="/images/wix/0597a3_bd712d6f658443bbb2190fda091ee8b1_de7fec1c.png"
                      alt="Industrial Grade Computer + Touch Screen"
                      className="w-full object-contain rounded-lg mb-4"
                      loading="lazy"
                    />
                    <p className="text-sm text-muted-foreground">ส่งมอบประสบการณ์ที่แข็งแกร่ง กับการเลือกใช้ Industrial Grade Computer ร่วมกับหน้าจอ Touch Screen เกรดอุตสาหกรรม</p>
                  </div>
                  <div className="card-surface p-6 rounded-xl">
                    <img
                      src="/images/wix/0597a3_099390617863452cb42bc0e2eeca3ab2_45701297.png"
                      alt="Easy connection USB + HDMI"
                      className="w-full object-contain rounded-lg mb-4"
                      loading="lazy"
                    />
                    <p className="text-sm text-muted-foreground">เพียงเสียบสายไฟ USB และ HDMI — เปลี่ยนระบบการทำงานเป็นแบบสัมผัส พร้อมใช้งานทันที</p>
                  </div>
                </div>

                {/* FPM17 Special Edition */}
                <div className="card-surface overflow-hidden rounded-xl mb-6">
                  <img
                    src="/images/wix/0597a3_c6e92eb018a04ed78ef653433323ccc4_23264789.png"
                    alt="FPM17 Special Edition"
                    className="w-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Mounting options */}
                <div className="card-surface overflow-hidden rounded-xl mb-8">
                  <img
                    src="/images/wix/0597a3_5bbc918177214812816fca9cac808de6_3497905f.png"
                    alt="VESA Mounting options"
                    className="w-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Price table */}
                <div className="card-surface overflow-hidden rounded-xl">
                  <div className="p-4 border-b border-border bg-secondary/30">
                    <h4 className="font-bold text-foreground">ราคา FPM Touch Monitor — เริ่มต้น ฿10,990</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/20">
                          <th className="text-left p-3 font-semibold text-muted-foreground">#</th>
                          <th className="text-left p-3 font-semibold text-muted-foreground">รุ่น</th>
                          <th className="text-left p-3 font-semibold text-muted-foreground">สเปค</th>
                          <th className="text-right p-3 font-semibold text-muted-foreground">ราคา (฿)</th>
                          <th className="p-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {fpmTouchMonitors.map((item) => (
                          <tr key={item.no} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                            <td className="p-3 text-muted-foreground">{item.no}</td>
                            <td className="p-3 font-semibold text-foreground">{item.model}</td>
                            <td className="p-3 text-muted-foreground">{item.config}</td>
                            <td className="p-3 text-right font-bold text-primary">{item.price}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setQuoteOpen(true)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                              >
                                <FileText size={12} /> ขอราคา
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <PriceDisclaimer />

                {/* Datasheet downloads */}
                <div className="mt-6">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2"><Download size={16} /> ดาวน์โหลด Datasheet</h4>
                  <div className="flex flex-wrap gap-2">
                    {fpmDatasheets.map((d) => (
                      <a
                        key={d.model}
                        href={d.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/30 transition-all"
                      >
                        <Download size={12} /> {d.model}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Gallery — all images from original page */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "/images/wix/0597a3_bcb05795214544aaaa6de89e36e1240d_1e304dda.jpg",
                    "/images/wix/0597a3_5296e6c18d9c46eda07b3c9a4747484d_d08efd28.jpg",
                    "/images/wix/0597a3_772cb29089e6441683f42be27f12dd10_b821819c.jpg",
                    "/images/wix/0597a3_c12a57b72528451194c0e554b3a7876e_95272f86.jpg",
                    "/images/wix/0597a3_8d732a24969b4605a70e4c8b1f199a4d_b06ddd94.jpg",
                    "/images/wix/005637_c40ca1d586a44b1ca9fc90cf2c49af6a_b4610452.jpg",
                    "/images/wix/005637_6ba3b2af125d4948b5d9d6c626135c1f_ddf0f886.jpg",
                    "/images/wix/005637_54259d2f8cf04757bfbf7bbabb983500_8e5061a6.jpg",
                  ].map((src, i) => (
                    <div key={i} className="card-surface overflow-hidden rounded-xl">
                      <img src={src} alt={`FPM installation ${i + 1}`} className="w-full h-44 object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Outdoor Products */}
          {activeTab === "outdoor" && (
            <div>
              <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                    Outdoor Monitor <span className="text-primary">1000–1600 Nits</span>
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> จอภาพสำหรับการติดตั้งภายนอกอาคาร ชนิดความสว่างสูง</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> ทนต่อสภาพการใช้งานที่รุนแรง เช่น ฝุ่นละออง อากาศเย็นและร้อน</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> ออกแบบกล่อง/ตู้สำหรับบรรจุตัวเครื่องจากโรงงาน</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> ทดสอบการป้องกันน้ำ ความเย็น ความร้อน จากโรงงาน</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> รับประกันสินค้า 1 ปี นับจากวันส่งมอบ</li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <img
                    src="/images/wix/0597a3_4b83ca4062e04f0285200f3eba338ebc_8fa8824b.png"
                    alt="Outdoor Monitor 1600 Nits"
                    className="max-h-[380px] object-contain drop-shadow-xl"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Outdoor sizes */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
               {outdoorSizes.map((s, i) => (
                  <div key={i} className="card-surface p-5 text-center hover:border-primary/30 transition-all">
                    <p className="text-3xl font-display font-black text-primary mb-1">{s.size}</p>
                    <p className="text-sm font-semibold text-foreground mb-1">{s.nits}</p>
                    <a href={s.datasheet} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                      <Download size={12} /> Datasheet
                    </a>
                    <button
                      onClick={() => setQuoteOpen(true)}
                      className="mt-2 w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <FileText size={12} /> ขอใบเสนอราคา
                    </button>
                  </div>
                ))}
              </div>

              {/* Outdoor features */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {outdoorFeatures.map((f) => (
                  <div key={f.title} className="card-surface p-5 hover:border-primary/30 transition-all">
                    <f.icon className="text-primary mb-3" size={28} />
                    <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* Outdoor gallery */}
              <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  "/images/wix/0597a3_09107d93b37144b597c62754cfe22bac_349ed40f.png",
                  "/images/wix/0597a3_cbd05c66b29942b393b882bb251d7fed_061a04c5.png",
                  "/images/wix/0597a3_95b559fdaf034da198a13c529db0f19c_1fb10246.png",
                  "/images/wix/0597a3_188fc06bcf174134abd6ddfa24735bae_e3cf114d.png",
                  "/images/wix/0597a3_940c7a65cd59495980fe0a7d6fce64da_16e24e8a.png",
                ].map((src, i) => (
                  <div key={i} className="card-surface overflow-hidden rounded-xl">
                    <img src={src} alt={`Outdoor installation ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KIOSK สำเร็จรูป */}
          {activeTab === "kiosk" && (
            <div>
              {/* Hero Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--primary)/0.12)] via-background to-[hsl(var(--destructive)/0.08)] border-2 border-primary/20 p-8 md:p-12 mb-10">
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive text-destructive-foreground text-sm font-bold animate-pulse shadow-lg">
                    <BadgePercent size={18} /> ประหยัดกว่าทั่วไป 15–30%
                  </span>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-4">
                      KIOSK สำเร็จรูป — พร้อมใช้งานทันที
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-black text-foreground mb-4 leading-tight">
                      ตู้คีออสอินทัชสกรีน
                      <br />
                      <span className="text-primary">สวยงาม ทันสมัย แข็งแกร่ง</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      ผลิตภัณฑ์ตู้คีออสก์ที่กำหนดค่าได้หรือผลิตตามที่ลูกค้าต้องการ มีความหลากหลายเพื่อตอบสนองความต้องการเฉพาะ
                      ผ่านการทดสอบภาคสนามแล้ว ออกแบบและผลิตอย่างเชี่ยวชาญ
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {["ร้านอาหาร", "โรงพยาบาล", "ธนาคาร", "ค้าปลีก", "อีเวนต์", "ราชการ", "โรงแรม", "สนามบิน"].map((t) => (
                        <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{t}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setQuoteOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
                      >
                        <FileText size={18} /> ขอใบเสนอราคา KIOSK
                      </button>
                      <button
                        onClick={() => setShowLineQR(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-bold hover:bg-secondary transition-colors"
                      >
                        <MessageCircle size={18} /> สอบถามทาง LINE
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src="/images/wix/0597a3_f8734b5a7dd9417bb93b82c09df3eccd_307dc478.png"
                      alt="KIOSK สำเร็จรูป"
                      className="max-h-[400px] object-contain drop-shadow-2xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Use Cases — 6 กลุ่มงาน */}
              <div className="mb-10">
                <h3 className="text-2xl font-display font-bold text-foreground mb-2 text-center">ใช้ได้กับทุกธุรกิจ</h3>
                <p className="text-muted-foreground text-center text-sm mb-6">KIOSK ของเราถูกนำไปใช้จริงในหลากหลายอุตสาหกรรม</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { image: kioskVisitor, title: "Visitor Management", desc: "ระบบลงทะเบียนผู้มาติดต่อ ถ่ายภาพ พิมพ์บัตร — สำนักงาน อาคารสูง โรงงาน", color: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30" },
                    { image: kioskQueue, title: "Queue Management", desc: "ระบบจัดคิวอัจฉริยะ ลดเวลารอคอย — โรงพยาบาล ธนาคาร สำนักงานราชการ", color: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30" },
                    { image: kioskWayfinding, title: "Wayfinding & Directory", desc: "แผนที่นำทาง ค้นหาข้อมูลสถานที่ — ห้างสรรพสินค้า สนามบิน มหาวิทยาลัย", color: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/30" },
                    { image: kioskSelforder, title: "Self-Order & Payment", desc: "สั่งอาหาร เลือกเมนู ชำระเงิน — ร้านอาหาร QSR ฟู้ดคอร์ท คาเฟ่", color: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30" },
                    { image: kioskBrand, title: "Brand & Promotion", desc: "จอโฆษณาแบบอินเทอร์แอคทีฟ — ค้าปลีก งานอีเวนต์ โชว์รูม", color: "bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900/30" },
                    { image: kioskCheckin, title: "Document & Check-in", desc: "เช็คอิน ลงทะเบียน กรอกเอกสาร — โรงแรม คลินิก สัมมนา", color: "bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/30" },
                  ].map((uc) => (
                    <div key={uc.title} className={`rounded-xl overflow-hidden border ${uc.color} hover:shadow-md transition-shadow`}>
                      <div className="aspect-[3/2] overflow-hidden">
                        <img src={uc.image} alt={uc.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-foreground text-sm mb-1">{uc.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{uc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Kiosk Photo Gallery */}
              <div className="mb-10">
                <h3 className="text-2xl font-display font-bold text-foreground mb-2 text-center">ผลงานจริงจากโรงงาน</h3>
                <p className="text-muted-foreground text-center text-sm mb-6">ตู้ KIOSK ที่ออกแบบและผลิตให้ลูกค้าในหลากหลายอุตสาหกรรม</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "/images/wix/005637_92bc43868f714520858954cac48e4dab_1181fa53.jpg",
                    "/images/wix/005637_b26918d72c2b4ef0a47a5b77d05407e1_61fcc6f8.jpg",
                    "/images/wix/005637_3273fb00d2994fb8b60e033e95139fd4_4d050247.jpg",
                    "/images/wix/005637_795624203e2d469282900aab60a78bc3_31040573.jpg",
                  ].map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden bg-secondary/30 border border-border aspect-[4/3]">
                      <img src={img} alt={`KIOSK ผลงานจริง ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Case Photos from Source */}
              <div className="mb-10">
                <h3 className="text-2xl font-display font-bold text-foreground mb-2 text-center">ตัวอย่างการใช้งานจริง</h3>
                <p className="text-muted-foreground text-center text-sm mb-6">KIOSK ถูกนำไปใช้งานจริงในหลากหลายสถานที่</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { image: "/images/wix/005637_e66f056de7634648bb47150eec24ea4c_d9a4434c.jpg", title: "Visitor Management", desc: "ระบบลงทะเบียนผู้มาติดต่อ ถ่ายภาพ พิมพ์บัตร" },
                    { image: "/images/wix/005637_c1f3742fc7e04f11aa6d39170e38dee1_678b50e1.jpg", title: "Queue Management", desc: "ระบบจัดคิวอัจฉริยะ โรงพยาบาล ธนาคาร สำนักงาน" },
                    { image: "/images/wix/005637_ea5bf2db35064644ac58160f3b84a6d0_000e8ad0.jpg", title: "Wayfinding & Directory", desc: "แผนที่นำทาง ค้นหาข้อมูลสถานที่" },
                    { image: "/images/wix/005637_c9a89ea001f5437aa6c52df854db3ba7_255f173b.jpg", title: "Self-Order & Payment", desc: "สั่งอาหาร เลือกเมนู ชำระเงิน" },
                    { image: "/images/wix/005637_7a76d52860b5470ea47dfc44ff6606a6_75c4c7b3.jpg", title: "Brand & Promotion", desc: "จอโฆษณาแบบอินเทอร์แอคทีฟ งานอีเวนต์" },
                    { image: "/images/wix/005637_fcb8f39e5ea542a0969d58555633398a_cae31891.jpg", title: "Document Check-in", desc: "เช็คอิน ลงทะเบียน กรอกเอกสาร" },
                  ].map((uc) => (
                    <div key={uc.title} className="card-surface overflow-hidden hover:border-primary/30 transition-all group">
                      <div className="aspect-[3/2] overflow-hidden">
                        <img src={uc.image} alt={uc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-foreground text-sm mb-1">{uc.title}</h4>
                        <p className="text-xs text-muted-foreground">{uc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kiosk models grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { image: "/images/wix/0597a3_4295297952794823a3e94770fb57311e_f87bca04.png", title: "KIOSK แบบตั้งพื้น", desc: "สั่งอาหาร / ระบบคิว / เช็คอิน" },
                  { image: "/images/wix/0597a3_368c91b7891d4e4980b92344c420a299_a2e025e6.png", title: "KIOSK ขนาดกะทัดรัด", desc: "Counter Top / ตู้ข้อมูล" },
                  { image: "/images/wix/0597a3_9fe176a2fb7f4d809a385fe9d650a8a3_ed6826fb.png", title: "KIOSK Premium", desc: "จอใหญ่ / ดีไซน์หรู / สองหน้า" },
                  { image: "/images/wix/0597a3_923cc29817714f80b57ba97aba096dac_40bc8e7b.png", title: "KIOSK แบบติดผนัง", desc: "ประหยัดพื้นที่ / Self-service" },
                ].map((k) => (
                  <div key={k.title} className="card-surface p-5 hover:border-primary/30 transition-all hover:-translate-y-1 group">
                    <div className="relative bg-secondary/30 rounded-xl p-4 mb-4 flex items-center justify-center h-52 overflow-hidden">
                        item={{ id: k.title.toLowerCase().replace(/\s+/g, "-"), name: k.title, category: "Smart Display KIOSK", image: k.image, href: "/smart-display", specs: k.desc }}
                        className="absolute top-2 right-2 z-10"
                      />
                      <img src={k.image} alt={k.title} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{k.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{k.desc}</p>
                    <button
                      onClick={() => setQuoteOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <FileText size={14} /> ขอใบเสนอราคา
                    </button>
                  </div>
                ))}
              </div>

              {/* Why Kiosk — จุดเด่น */}
              <div className="mb-10">
                <h3 className="text-2xl font-display font-bold text-foreground mb-6 text-center">ข้อดีของ KIOSK จาก ENT Group</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: Shield, title: "Secure", desc: "คุณสมบัติป้องกันการงัดแงะ ไม่ต้องใช้สกรูหรือหมุดย้ำ ล็อคกุญแจแบบเด้งหรือแบบเขาควาย" },
                    { icon: Layers, title: "Stability", desc: "โครงสร้างเหล็กเคลือบสีฝุ่นทนทาน กันฝุ่น กันน้ำ IP65 วางกับพื้นมั่นคง" },
                    { icon: Wifi, title: "Reliability", desc: "รองรับการใช้งาน 24/7 ต่อเนื่อง มีพัดลมระบายความร้อน อายุการใช้งานยาวนาน" },
                    { icon: Settings, title: "ปรับแต่งได้", desc: "เลือกขนาดหน้าจอ สี โลโก้ และอุปกรณ์เสริมตามที่ต้องการ ผลิตตามออเดอร์ได้" },
                    { icon: Printer, title: "เสริมอุปกรณ์", desc: "ช่อง Thermal Printer, Scanner, NFC, กล้อง ติดตั้งภายในตู้ได้ทั้งหมด" },
                    { icon: BadgePercent, title: "ราคาโรงงาน", desc: "นำเข้าจากโรงงานโดยตรง ราคาประหยัดกว่าทั่วไป 15–30% มีรับประกัน" },
                  ].map((f) => (
                    <div key={f.title} className="card-surface p-5 hover:border-primary/30 transition-all">
                      <f.icon className="text-primary mb-3" size={28} />
                      <h4 className="font-bold text-foreground mb-1 text-sm">{f.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features Strip */}
              <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 mb-10">
                <h3 className="text-sm font-bold text-foreground mb-4">ข้อดีของการใช้ Kiosk จาก ENT Group</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "รองรับการติดตั้งภายในและภายนอกอาคาร",
                    "กันฝุ่น / กันน้ำ / ปลอดภัย ติดตั้งง่าย",
                    "โครงสร้างเหล็กพร้อมการเคลือบสีฝุ่นทนทาน",
                    "รูนำภายในเพื่อสลักลงเมื่อจำเป็น",
                    "คุณสมบัติป้องกันการงัดแงะ ไม่ต้องใช้สกรู",
                    "บำรุงรักษาง่ายด้วยส่วนประกอบที่สลับง่าย",
                  ].map((feat) => (
                    <div key={feat} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span className="text-sm text-foreground">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Spotlight — KIOSK-GK2101 */}
              <div className="card-surface p-6 md:p-10 mb-10 border-primary/20">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-4">
                      <Star size={14} className="inline mr-1" /> รุ่นขายดี
                    </span>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                      KIOSK-GK2101
                    </h3>
                    <div className="space-y-2 mb-6">
                      {[
                        "วัสดุ: สแตนเลสสตีล & เหล็ก",
                        "มาตรฐาน IP65 กันฝุ่นกันน้ำ",
                        "กุญแจแบบเด้ง หรือแบบเขาควาย",
                        "พัดลมระบายความร้อนในตัว",
                        "ช่อง Thermal Printer / Scanner",
                        "ติดตั้ง: วางกับพื้น",
                        "ขนาดกล่อง: 700 × 1350 × 700 mm",
                        "ขนาด Panel: 60 × 554 × 355 mm",
                      ].map((spec) => (
                        <div key={spec} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">✓</span>
                          <span className="text-sm text-foreground">{spec}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="/datasheets/005637_c6b7eb42862948ed879384daee436d8c.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Download size={16} /> GK2101 KIOSK PDF
                      </a>
                      <a
                        href="/datasheets/005637_33c47e04de224db8b4d9675ec04c8030.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors"
                      >
                        <Download size={16} /> Datasheet
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <img
                      src="/images/wix/005637_bf1ac53c95244bfc9806b0757ab39272_604a8d91.png"
                      alt="KIOSK-GK2101 ด้านหน้า"
                      className="max-h-[400px] object-contain drop-shadow-xl"
                      loading="lazy"
                    />
                    <img
                      src="/images/wix/005637_b48ec7c382e549ad853ae993207d740e_4c97c30b.png"
                      alt="KIOSK-GK2101 ด้านหลัง"
                      className="max-h-[400px] object-contain drop-shadow-xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* KIOSK Model Product Gallery */}
              <div className="mb-10">
                <h3 className="text-2xl font-display font-bold text-foreground mb-2 text-center">KIOSK รุ่นพร้อมจำหน่าย</h3>
                <p className="text-muted-foreground text-center text-sm mb-6">เลือกขนาดและสไตล์ที่เหมาะกับธุรกิจของคุณ</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { image: "/images/wix/005637_5e95b495af4c440f9b14b562ea433c3f_357f0b6a.jpg", title: "KIO-215VRT", desc: "Visitor Management Kiosk — จอ 21.5\" ตั้งพื้น" },
                    { image: "/images/wix/005637_8df769ac52f944c3a1670d2abe60f468_0ca8a233.jpg", title: "KIO-190", desc: "Queue & Self-Service Kiosk — จอ 19\" สไตล์บาง" },
                    { image: "/images/wix/005637_3a8d730e167e49768b023123fd3984bd_6e4a2f47.jpg", title: "KIOSK Custom", desc: "สั่งผลิตตามความต้องการ — ทุกขนาด ทุกสไตล์" },
                  ].map((k) => (
                    <div key={k.title} className="card-surface overflow-hidden group hover:border-primary/30 transition-all">
                      <div className="bg-secondary/30 flex items-center justify-center h-72 overflow-hidden">
                        <img src={k.image} alt={k.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 p-4" loading="lazy" />
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-foreground mb-1">{k.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{k.desc}</p>
                        <button
                          onClick={() => setQuoteOpen(true)}
                          className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
                        >
                          <FileText size={14} /> ขอใบเสนอราคา
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Touch Screen Sizes */}
              <div className="card-surface p-6 md:p-10 mb-10">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                      Touch Screen Monitor <span className="text-primary">5"–65"</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      เลือกขนาดจอภาพหน้าจอสัมผัสตั้งแต่ 5" ถึง 65" ติดตั้งได้ทั้งผนัง โต๊ะ และแบบฝัง
                      รองรับ Capacitive Touch 10 จุด กันน้ำ ใช้ได้แม้สวมถุงมือ
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      ออกแบบให้เข้ากับตัวเครื่อง ระบายความร้อนได้ดี มีความปลอดภัยและทนทาน
                    </p>
                    <p className="text-muted-foreground text-sm mb-6">
                      รองรับ Android, Linux และ Windows — ปรับแต่ง OS ตามโครงการและงบประมาณได้
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["7\"", "8\"", "10\"", "15.6\"", "21.5\"", "23.8\"", "32\"", "43\"", "55\"", "65\""].map((s) => (
                        <span key={s} className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src="/images/wix/0597a3_841bc593914c47cfa538b4dd7b57a27e_dad76eaa.png"
                      alt="Kiosk enclosures"
                      className="max-h-[350px] object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Installation Types */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Indoor", desc: "ติดตั้งภายในอาคาร", Icon: Building2 },
                  { label: "Outdoor", desc: "ติดตั้งภายนอกอาคาร IP65", Icon: Sun },
                  { label: "Floor Standing", desc: "ตั้งพื้น พร้อมล็อค", Icon: Maximize },
                  { label: "Wall Mounting", desc: "ติดผนัง ประหยัดพื้นที่", Icon: Monitor },
                ].map((t) => (
                  <div key={t.label} className="card-surface p-5 text-center hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center"><t.Icon size={24} className="text-primary" /></div>
                    <h4 className="font-bold text-foreground text-sm mb-1">{t.label}</h4>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                ))}
              </div>

              {/* Installation Gallery */}
              <div className="mb-10">
                <h3 className="text-xl font-display font-bold text-foreground mb-4 text-center">ภาพตัวอย่างการติดตั้ง</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "/images/wix/005637_d6d438173a884b35819d4af4c11b8eab_3e876f9d.jpg",
                    "/images/wix/005637_b94be3cae5d74c24bf620dfd192c2738_d7874fbe.jpg",
                  ].map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-border">
                      <img src={img} alt={`ตัวอย่างการติดตั้ง ${i + 1}`} className="w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Case Study */}
              <div className="card-surface overflow-hidden border-primary/20 mb-10">
                <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 md:p-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-4">
                    <Smartphone size={14} className="inline mr-1" /> Case Study — ระบบคิวอัจฉริยะ
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-4">
                    โรงพยาบาลติดตั้ง KIOSK ระบบคิว ผลลัพธ์เกินคาด
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {[
                      { value: "45%", label: "เวลารอคิวลดลง" },
                      { value: "60%", label: "ความพึงพอใจเพิ่มขึ้น" },
                      { value: "0", label: "การแซงคิว" },
                      { value: "24/7", label: "ทำงานต่อเนื่อง" },
                    ].map((s) => (
                      <div key={s.label} className="bg-background/80 rounded-xl p-4 text-center">
                        <p className="text-2xl font-display font-black text-primary">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    เชื่อมต่อกับระบบ HIS ของโรงพยาบาล วางไว้ที่ล็อบบี้ ห้องตรวจ และแผนกต่างๆ
                    ปัจจุบันกลายเป็นต้นแบบการจัดการระบบคิวที่มีประสิทธิภาพ
                  </p>
                </div>
              </div>

              {/* Final CTA */}
              <div className="text-center p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
                  สนใจ KIOSK สำเร็จรูป?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  บอกเราว่าคุณต้องการใช้งานแบบไหน ทีมงานจะแนะนำรุ่นที่เหมาะสมที่สุดและเสนอราคาพิเศษให้
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setQuoteOpen(true)}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
                  >
                    <FileText size={20} /> ขอใบเสนอราคา KIOSK
                  </button>
                  <a href="tel:020456104" className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-border text-foreground font-bold hover:bg-secondary transition-colors">
                    <Phone size={18} /> 02-045-6104
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Window Display */}
          {activeTab === "window" && (
            <div>
              <div className="card-surface overflow-hidden mb-8">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                      High Brightness LCD <span className="text-primary">Window Display</span>
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      ตกแต่งร้านของคุณให้โดดเด่นกว่าใคร ด้วยหน้าจอขนาดต่างๆ ไม่ซ้ำแบบใคร
                      มีให้เลือกแบบแสดงผลทั่วไปหรือแบบหน้าจอสัมผัส
                    </p>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Digital signage is the ideal product for digitally showcasing your content.
                      Find out how easy it is to create impactful messages that will get results.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {applications.map((app) => (
                        <span key={app} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{app}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => setQuoteOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      <FileText size={16} /> ขอใบเสนอราคา
                    </button>
                  </div>
                  <div className="bg-secondary/30 p-6 flex items-center justify-center">
                    <img
                      src="/images/wix/0597a3_25107590998d467abb1b5b0f603701f3_2f9ce164.png"
                      alt="Window Display"
                      className="max-h-[350px] object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Window product images */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="card-surface overflow-hidden">
                  <img src="/images/wix/0597a3_ed1ec55afde14b989d99ef11c84769a1_7823dc4c.png" alt="Window display 1" className="w-full object-contain p-4" loading="lazy" />
                </div>
                <div className="card-surface overflow-hidden">
                  <img src="/images/wix/0597a3_e63651de999c48969d065ffa5606abab_89cf81f3.png" alt="Window display 2" className="w-full object-contain p-4" loading="lazy" />
                </div>
              </div>

              {/* Stretched bar gallery */}
              <div className="mt-8 card-surface overflow-hidden">
                <img
                  src="/images/wix/0597a3_394e2528ac014a72a46412c83b1d9acb_e7c706ab.png"
                  alt="Stretched bar display range"
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Windows OS Option */}
      <section className="section-padding bg-surface/50">
        <div className="container max-w-7xl mx-auto">
          <div className="card-surface overflow-hidden p-6 md:p-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                  <Lightbulb size={14} className="inline mr-1" /> ทางเลือกเพิ่มเติม
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  เปลี่ยนเป็น <span className="text-primary">Windows 10 Pro</span> ได้
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  กรณีที่ไม่ต้องการใช้ Android OS ที่มากับหน้าจอ สามารถเปลี่ยนเป็น Windows 10 Pro OEM
                  เพื่อเข้ากันได้กับโครงการ โดยเลือกประสิทธิภาพ CPU ได้ เช่น Core i3/i5/i7
                  ทำให้โครงการมีความยืดหยุ่นสูง
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src="/images/wix/0597a3_75d6d2e9ade74554add617fef3ccca16_387324f9.png"
                  alt="Windows 10 Pro option"
                  className="max-h-[260px] object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Signage Software */}
      <section className="section-padding">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Software</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Digital Signage <span className="text-gradient">Management Software</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              ซอฟต์แวร์จัดการเนื้อหาฟรี รองรับการจัดการอุปกรณ์ โปรแกรม และสื่อจากศูนย์กลาง
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {softwareFeatures.map((f) => (
              <div key={f.title} className="card-surface p-5 hover:border-primary/30 transition-all">
                <f.icon className="text-primary mb-3" size={28} />
                <h3 className="font-bold text-foreground mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Software screenshots */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card-surface overflow-hidden md:col-span-2">
              <img src="/images/wix/0597a3_4231366e9f4b4e59bc95d622fcf5e76c_810ad320.png" alt="Digital Signage System" className="w-full object-cover" loading="lazy" />
            </div>
            <div className="space-y-4">
              <div className="card-surface overflow-hidden">
                <img src="/images/wix/0597a3_78e2fe344d5b46a4a0484f6c52ab9df7_fb969f91.png" alt="Software dashboard" className="w-full object-cover" loading="lazy" />
              </div>
              <div className="card-surface overflow-hidden">
                <img src="/images/wix/0597a3_ef72e14aac964a4591a8217c825dc8f2_d797cdb4.png" alt="Software device management" className="w-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="section-padding bg-surface/50" id="downloads">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Downloads</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              ดาวน์โหลด <span className="text-gradient">Price List & Datasheet</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {priceLists.map((p) => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-surface p-5 flex items-center gap-4 hover:border-primary/30 transition-all group"
              >
                <Download className="text-primary shrink-0 group-hover:scale-110 transition-transform" size={24} />
                <div>
                  <p className="font-bold text-foreground text-sm">{p.label}</p>
                  <p className="text-xs text-muted-foreground">PDF Download</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videos */}
      <section className="section-padding">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Video Gallery</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              วิดีโอ <span className="text-gradient">Smart Display & KIOSK</span>
            </h2>
          </div>

          {/* Video Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {[
              { key: "smart-display", label: "Smart Display & KIOSK" },
              { key: "fpm", label: "FPM Touch Monitor" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setVideoTab(t.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  videoTab === t.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                {t.label}
              </button>
            ))}
          </div>

          {videoTab === "smart-display" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { id: "V2kmwDhKWko", title: "Smart Display Demo 1" },
                { id: "WLGJY0Qsmlo", title: "Smart Display Demo 2" },
                { id: "7vHHYtEinoI", title: "Smart Display Demo 3" },
                { id: "kuBRO1LFtdo", title: "Smart Display Demo 4" },
              ].map((v) => (
                <div key={v.id} className="card-surface rounded-xl overflow-hidden">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${v.id}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {videoTab === "fpm" && (
            <div className="max-w-2xl mx-auto">
              <div className="card-surface rounded-xl overflow-hidden">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/gz9E7ls-QwQ"
                    title="FPM Touch Monitor"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Podcast */}
      <section className="section-padding">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 flex items-center justify-center gap-1"><Headphones size={14} /> Podcast</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              พอดแคสต์ <span className="text-gradient">Smart Display & FPM</span>
            </h2>
          </div>

          {/* Podcast Sub-tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {[
              { key: "smart-display", label: "Smart Display" },
              { key: "fpm", label: "FPM Monitor" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setPodcastTab(t.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  podcastTab === t.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                {t.label}
              </button>
            ))}
          </div>

          {podcastTab === "smart-display" && (
            <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                { src: "/podcasts/smart-display-intro.wav", title: "Intro Smart Display Podcast" },
                { src: "/podcasts/outdoor-monitor-clip1.wav", title: "Outdoor Monitor Clip 1" },
                { src: "/podcasts/outdoor-monitor-clip2.wav", title: "Outdoor Monitor Clip 2" },
                { src: "/podcasts/software-digital-signage.wav", title: "Software Digital Signage" },
              ].map((p) => (
                <div key={p.src} className="card-surface rounded-xl p-4 flex flex-col gap-2">
                  <p className="font-semibold text-sm text-foreground">{p.title}</p>
                  <audio controls preload="none" className="w-full h-10">
                    <source src={p.src} type="audio/wav" />
                  </audio>
                </div>
              ))}
            </div>
          )}

          {podcastTab === "fpm" && (
            <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                { src: "/podcasts/fpm-series-intro.wav", title: "Podcast Intro FPM Series" },
                { src: "/podcasts/fpm-intro.wav", title: "Podcast FPM Monitor" },
                { src: "/podcasts/fpm-promotion.wav", title: "Promotion How to buy FPM Series" },
                { src: "/podcasts/fpm-how-to-buy.wav", title: "How to buy FPM Series" },
              ].map((p) => (
                <div key={p.src} className="card-surface rounded-xl p-4 flex flex-col gap-2">
                  <p className="font-semibold text-sm text-foreground">{p.title}</p>
                  <audio controls preload="none" className="w-full h-10">
                    <source src={p.src} type="audio/wav" />
                  </audio>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="section-padding">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            สนใจสินค้า? <span className="text-gradient">ติดต่อเราเลย</span>
          </h2>
          <p className="text-muted-foreground mb-8">แอดมินพร้อมช่วยเหลือในการออกแบบตู้สำหรับติดตั้ง ระบบ AirFlow และเลือกจอภาพที่เหมาะสม</p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button onClick={() => setQuoteOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
              ขอใบเสนอราคา
            </button>
            <a href="tel:020456104" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-colors">
              <Phone size={18} /> 02-045-6104
            </a>
            <button onClick={() => setShowLineQR(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(142,70%,45%)] text-white font-bold hover:opacity-90 transition-opacity cursor-pointer">
              <MessageCircle size={18} /> Line @entgroup
            </button>
          </div>
        </div>
      </section>



      {/* LINE QR Dialog */}
      <LineQRDialog open={showLineQR} onClose={() => setShowLineQR(false)} />
      <FooterCompact />
    </div>
  );
};


export default SmartDisplay;

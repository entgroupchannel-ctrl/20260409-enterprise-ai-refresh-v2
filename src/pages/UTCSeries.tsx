import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Monitor, Cpu, Shield, Zap, Wind, Layers, Wrench, Maximize,
  Download, ExternalLink, ChevronDown, Factory, Building2, Stethoscope,
  ShoppingCart, Truck, Square, RectangleHorizontal, Settings, Award
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo-entgroup.avif";
import FooterCompact from "@/components/FooterCompact";
import PriceDisclaimer from "@/components/PriceDisclaimer";


/* ───── Features ───── */
const features = [
  {
    icon: Layers,
    title: "Modular Design",
    subtitle: "iDoor Technology",
    desc: "ออกแบบแบบโมดูลาร์ด้วยเทคโนโลยี iDoor อัปเกรดและปรับแต่ง I/O ได้ตามต้องการ เพิ่มความเสถียรและยืดอายุการใช้งาน",
  },
  {
    icon: Wrench,
    title: "Easy Maintenance",
    subtitle: "Separate Core Design",
    desc: "การออกแบบแกนแยกช่วยให้บำรุงรักษาง่าย แยกบอร์ดหลักออกจากโมดูลการทำงาน ลดต้นทุนซ่อมบำรุง",
  },
  {
    icon: Maximize,
    title: "Multi-Size Touch",
    subtitle: "8\" – 24\" Display",
    desc: "หน้าจอสัมผัสหลายขนาด 8, 10, 12, 15, 17, 19, 21 และ 24 นิ้ว ทั้งแบบ Square (4:3) และ Wide (16:9)",
  },
  {
    icon: Settings,
    title: "Customize I/O",
    subtitle: "Flexible Interfaces",
    desc: "รองรับ I/O ที่ปรับแต่งได้อย่างรวดเร็ว — พอร์ตหลายเครือข่าย, หลายอนุกรม, หลาย USB ตอบทุกความต้องการเฉพาะ",
  },
  {
    icon: Wind,
    title: "Fanless Cooling",
    subtitle: "Aluminum Alloy Die-Cast",
    desc: "โครงอลูมิเนียมหล่อขึ้นรูป ระบายความร้อนด้วยทองแดง+อลูมิเนียม ทำงานเงียบสนิท ไม่มีพัดลม ไม่ดูดฝุ่น",
  },
  {
    icon: Zap,
    title: "Future Upgrade",
    subtitle: "Platform Compatibility",
    desc: "เปลี่ยนโมดูล CPU ได้ง่าย รองรับ Celeron, Core i3/i5/i7 Gen 7-10 ติดตามเทคโนโลยีได้ตลอดอายุการใช้งาน",
  },
];

/* ───── Use Cases ───── */
const useCases = [
  { icon: Factory, title: "โรงงานอุตสาหกรรม", desc: "ควบคุมสายการผลิต, SCADA, HMI" },
  { icon: Building2, title: "สำนักงาน & POS", desc: "ร้านค้า, Reception, Kiosk" },
  { icon: Stethoscope, title: "การแพทย์", desc: "อุปกรณ์ทางการแพทย์, Lab System" },
  { icon: ShoppingCart, title: "ค้าปลีก", desc: "ร้านอาหาร, Self-service Terminal" },
  { icon: Truck, title: "ขนส่ง & โลจิสติกส์", desc: "คลังสินค้า, Warehouse Management" },
  { icon: Monitor, title: "Digital Signage", desc: "จอแสดงข้อมูล, Information Board" },
];

/* ───── Square Screen Models ───── */
const squareModels = [
  { size: '8"', model: "UTC-S0882A", config: "J1900/4G/128G SSD/12V", price: "สอบถาม", pdf: "/datasheets/005637_57d3188cb2a843d884970a6dd99b0396.pdf" },
  { size: '10"', model: "UTC-S1062A", config: "J1900/4G/128G SSD/12V", price: "25,990", pdf: "/datasheets/005637_fb7f8a0c568247ada4d28b077f3814f1.pdf" },
  { size: '10"', model: "UTC-S1082A", config: "i3-7100U/4G/128G SSD/12V", price: "29,990", pdf: "/datasheets/005637_66d7a552b93d47268ddd328a5c8d9484.pdf" },
  { size: '10"', model: "UTC-S1082A", config: "i5-7200U/4G/128G SSD/12V", price: "31,990", pdf: "/datasheets/005637_66d7a552b93d47268ddd328a5c8d9484.pdf" },
  { size: '10"', model: "UTC-S1092A", config: "i3-10110U/4G/128G SSD/12V", price: "29,990", pdf: "/datasheets/005637_aed21c24f835474fbfb8ec4059456d47.pdf" },
  { size: '10"', model: "UTC-S1092A", config: "i5-10210U/4G/128G SSD/12V", price: "31,990", pdf: "/datasheets/005637_aed21c24f835474fbfb8ec4059456d47.pdf" },
  { size: '12"', model: "UTC-S1262A", config: "J1900/4G/128G SSD/12V", price: "26,990", pdf: "/datasheets/005637_fb1f7509a7c44cc98f76ab9dc8e927da.pdf" },
  { size: '12"', model: "UTC-S1282A", config: "i3-7100U/4G/128G SSD/12V", price: "30,990", pdf: "/datasheets/005637_b4742ee298a44589a246988004c15fba.pdf" },
  { size: '12"', model: "UTC-S1282A", config: "i5-7200U/4G/128G SSD/12V", price: "31,990", pdf: "/datasheets/005637_b4742ee298a44589a246988004c15fba.pdf" },
  { size: '12"', model: "UTC-S1282A", config: "i7-7500U/4G/128G SSD/12V", price: "35,990", pdf: "/datasheets/005637_b4742ee298a44589a246988004c15fba.pdf" },
  { size: '15"', model: "UTC-S158XA", config: "i3~i7 / J1900", price: "สอบถาม", pdf: "/datasheets/005637_1e87da8cebb646939ac3e88ea38504b3.pdf" },
  { size: '17"', model: "UTC-S1782A", config: "i3~i7-7th Gen", price: "สอบถาม", pdf: "/datasheets/0597a3_c64a61f491344b86a58ee4f6247cce01.pdf" },
  { size: '19"', model: "UTC-S1982A", config: "i3~i7-7th Gen", price: "สอบถาม", pdf: "/datasheets/005637_914056a5c0814c1b92f30a2d4543b43f.pdf" },
];

const squareJ6412Models = [
  { size: '10"', model: "UTC-S1072A", config: "J6412/4G/128G SSD", price: "สอบถาม", pdf: "/datasheets/0597a3_73e7d0dc234344cf86045e7d236e8964.pdf" },
  { size: '12"', model: "UTC-S1272A", config: "J6412/4G/128G SSD", price: "สอบถาม", pdf: "/datasheets/0597a3_d2f46ee1e9224cf08b4d0aae8f2ea959.pdf" },
  { size: '15"', model: "UTC-S1572A", config: "J6412/4G/128G SSD", price: "สอบถาม", pdf: "/datasheets/0597a3_50057bf3cbd645439154efb566da4857.pdf" },
  { size: '19"', model: "UTC-S1972A", config: "J6412/4G/128G SSD", price: "สอบถาม", pdf: "/datasheets/0597a3_4564bb41a0fe46c9b26751fbb5ba5813.pdf" },
];

/* ───── Wide Screen Models ───── */
const wideModels = [
  { size: '15"', model: "UTC-W1562A", config: "J1900/4G/128G SSD/12V", price: "30,990", pdf: "/datasheets/005637_d7a35909dad34445a0f68b9516b6d214.pdf" },
  { size: '15"', model: "UTC-W1582A", config: "i3-7100U/4G/128G SSD/12V", price: "33,990", pdf: "/datasheets/005637_d7a35909dad34445a0f68b9516b6d214.pdf" },
  { size: '15"', model: "UTC-W1582A", config: "i5-7200U/4G/128G SSD/12V", price: "35,990", pdf: "/datasheets/005637_d7a35909dad34445a0f68b9516b6d214.pdf" },
  { size: '15"', model: "UTC-W1582A", config: "i7-7500U/4G/128G SSD/12V", price: "37,990", pdf: "/datasheets/005637_d7a35909dad34445a0f68b9516b6d214.pdf" },
  { size: '15"', model: "UTC-W1592A", config: "i3-10110U/4G/128G SSD/12V", price: "33,990", pdf: "/datasheets/005637_811c11595cdd4595bb47d0942404d9e7.pdf" },
  { size: '15"', model: "UTC-W1592A", config: "i5-10210U/4G/128G SSD/12V", price: "35,990", pdf: "/datasheets/005637_811c11595cdd4595bb47d0942404d9e7.pdf" },
  { size: '15"', model: "UTC-W1592A", config: "i7-10510U/4G/128G SSD/12V", price: "37,990", pdf: "/datasheets/005637_811c11595cdd4595bb47d0942404d9e7.pdf" },
  { size: '17"', model: "UTC-W1762A", config: "J1900/4G/128G SSD/12V", price: "31,990", pdf: "/datasheets/005637_e35ae5c2fd1f4851a476394e577a358e.pdf" },
  { size: '17"', model: "UTC-W1782A", config: "i3-7100U/4G/128G SSD/12V", price: "สอบถาม", pdf: "/datasheets/005637_e35ae5c2fd1f4851a476394e577a358e.pdf" },
  { size: '17"', model: "UTC-W1782A", config: "i5-7200U/4G/128G SSD/12V", price: "สอบถาม", pdf: "/datasheets/005637_e35ae5c2fd1f4851a476394e577a358e.pdf" },
  { size: '21"', model: "UTC-W2182A", config: "i3~i7-7th Gen", price: "สอบถาม", pdf: "/datasheets/005637_64b29e520d1d4299a0397058b5599c1d.pdf" },
  { size: '24"', model: "UTC-W2482B", config: "i3~i7-7th Gen", price: "สอบถาม", pdf: "/datasheets/005637_fb0b70229f6d4eea9442c2924e077b1c.pdf" },
];

const wideJ6412Models = [
  { size: '15"', model: "UTC-W1572A", config: "J6412/4G/128G SSD", price: "สอบถาม", pdf: "/datasheets/0597a3_aef7669fe0864b8ea2d2204f0e05fd7e.pdf" },
  { size: '19"', model: "UTC-W1972A", config: "J6412/4G/128G SSD", price: "สอบถาม", pdf: "/datasheets/0597a3_66a196a4a8214b4ead9760f0af1ce520.pdf" },
  { size: '21"', model: "UTC-2172A", config: "J6412/4G/128G SSD", price: "สอบถาม", pdf: "/datasheets/0597a3_4d6f79cef0a3435abc360c7ab17cce1d.pdf" },
];

/* ───── Windows Options ───── */
const windowsOptions = [
  { name: "Windows 10 Pro OEM", price: "฿3,950" },
  { name: "Windows 11 Pro OEM", price: "฿4,590" },
  { name: "Windows 10 IOT", price: "฿3,950" },
  { name: "Windows 11 IOT", price: "฿4,590" },
  { name: "Upgrade WiFi ABGN/AC → WiFi 6", price: "สอบถาม" },
  { name: "4G SIM Card Module", price: "สอบถาม" },
  { name: "5G SIM Card Module", price: "สอบถาม" },
  { name: "ซื้อประกันเพิ่ม ปีที่ 2", price: "15%" },
  { name: "ซื้อประกันเพิ่ม ปีที่ 3", price: "20%" },
];

/* ───── Price Table Component ───── */
const PriceTable = ({ title, icon: Icon, models, subTitle }: {
  title: string;
  icon: React.ElementType;
  models: typeof squareModels;
  subTitle?: string;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="card-surface rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Icon className="text-primary" size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-foreground">{title}</h3>
            {subTitle && <p className="text-xs text-primary/70">{subTitle}</p>}
          </div>
        </div>
        <ChevronDown className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} size={18} />
      </button>

      <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${open ? "max-h-[2000px]" : "max-h-0"}`}>
        <div className="px-5 pb-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ขนาด</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">รุ่น</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">สเปก</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ราคา (฿)</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">PDF</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-3 font-medium text-foreground whitespace-nowrap">{m.size}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-primary">{m.model}</span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">{m.config}</td>
                    <td className="py-3 px-3 text-right font-bold text-foreground whitespace-nowrap">
                      {m.price === "สอบถาม" ? (
                        <span className="text-xs text-muted-foreground">สอบถาม</span>
                      ) : (
                        <>฿{m.price}</>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <a
                        href={m.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-primary/10 text-primary transition-colors"
                        title={`Download ${m.model} Datasheet`}
                      >
                        <Download size={14} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───── Main Page ───── */
const UTCSeries = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="UTC Series — Open Frame Touch Monitor" description="UTC Series จอสัมผัสอุตสาหกรรมแบบ Open Frame 8-19 นิ้ว สำหรับฝังใน KIOSK ตู้จำหน่ายสินค้า เครื่องจ่ายเงิน และงานอุตสาหกรรม" path="/utc-series" />
      <ProductJsonLd
        collectionName="UTC Series Open Frame Touch Monitor"
        collectionDescription="จอสัมผัสอุตสาหกรรมแบบ Open Frame 8-19 นิ้ว สำหรับฝังใน KIOSK ตู้จำหน่ายสินค้า"
        collectionUrl="/utc-series"
        products={[...squareModels, ...wideModels].map(m => ({ name: m.model, price: m.price, description: `${m.size} ${m.config}`, category: "Open Frame Touch Monitor" }))}      />

      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "UTC Series", path: "/utc-series" }]} />
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm font-medium hidden sm:inline">กลับหน้าหลัก</span>
            </Link>
            <div className="w-px h-6 bg-border" />
            <img src={logo} alt="ENT GROUP" className="h-7 w-auto dark:invert" />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container max-w-7xl mx-auto px-6 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                  Industrial Panel PC
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-border text-muted-foreground">
                  CE | ISO9001
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4">
                UTC<span className="text-primary"> Series</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                Industrial Panel PC with Touch Screen ออกแบบเพื่ออุตสาหกรรม
                ด้วยเทคโนโลยี <span className="text-foreground font-semibold">Modular Design</span> และ <span className="text-foreground font-semibold">iDoor</span> —
                เปลี่ยนโมดูลได้ อัปเกรดง่าย บำรุงรักษาสะดวก
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {["Touch Screen 8\"–24\"", "Fanless Design", "Modular CPU", "IP65 Front"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="#price-list" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                  ดูราคาสินค้า <ChevronDown size={16} />
                </a>
                <a
                  href="/datasheets/0597a3_91d82f50189a421e97ce9b88530df22c.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
                >
                  <Download size={16} /> ดาวน์โหลดวารสาร
                </a>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl" />
              <img
                src="/images/wix/0597a3_1045620b437c41d6ae8a1f76c791ca01_782dc747.png"
                alt="UTC Series Industrial Panel PC"
                className="relative w-full max-w-lg mx-auto drop-shadow-xl"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Key Features</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              ทำไมต้อง <span className="text-primary">UTC Series</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              เทคโนโลยี iDoor + Modular Design ทำให้ UTC Series เป็น Panel PC ที่ยืดหยุ่นและบำรุงรักษาง่ายที่สุด
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card-surface rounded-xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <f.icon className="text-primary" size={22} />
                </div>
                <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-primary/70 font-medium mb-2">{f.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Screen Type Comparison ─── */}
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Display Options</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              เลือกหน้าจอ<span className="text-primary">ที่เหมาะกับงาน</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Square */}
            <div className="card-surface rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Square className="text-primary" size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Square Screen (4:3 / 5:4)</h3>
                      <p className="text-xs text-primary/70 font-medium">หน้าจอสี่เหลี่ยมจตุรัส</p>
                    </div>
                  </div>
                </div>
                <img
                  src="/images/wix/0597a3_48b4b6dd4b0844f1996977be9733e597_a37ce2a5.png"
                  alt="UTC Square Screen Models"
                  className="w-full rounded-lg mb-4"
                  loading="lazy"
                />
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> พื้นที่แนวตั้งมาก — เหมาะกับ List, Portrait</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> ประหยัดพื้นที่แนวนอน — พื้นที่จำกัด</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> เสถียรในการแสดงผล — Legacy & Industrial</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> ขนาด: 8", 10", 12", 15", 17", 19"</li>
                </ul>
              </div>
            </div>

            {/* Wide */}
            <div className="card-surface rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <RectangleHorizontal className="text-primary" size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Wide Screen (16:9)</h3>
                      <p className="text-xs text-primary/70 font-medium">หน้าจอสี่เหลี่ยมผืนผ้า</p>
                    </div>
                  </div>
                </div>
                <img
                  src="/images/wix/0597a3_52951cbca38c439f8abc10f9e94fa03f_b157e1d3.png"
                  alt="UTC Wide Screen Models"
                  className="w-full rounded-lg mb-4"
                  loading="lazy"
                />
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> พื้นที่แสดงผลกว้างขวาง — ข้อมูลหลายชุดพร้อมกัน</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> ลดการเปลี่ยนหน้าจอ — เพิ่มประสิทธิภาพ</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> ดีไซน์ทันสมัย — เข้ากับสถาปัตยกรรม</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> ขนาด: 15", 17", 19", 21", 24"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Multi-Display */}
          <div className="mt-8 card-surface rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="text-primary" size={22} />
              <div>
                <h3 className="text-lg font-bold text-foreground">รองรับ Multi-Display สูงสุด 3 จอ</h3>
                <p className="text-xs text-muted-foreground">Duplex Mode & Extend Mode</p>
              </div>
            </div>
            <img
              src="/images/wix/0597a3_48fd1fb952d44775b7bbc10381cd8233_354919d7.png"
              alt="UTC Multi-Display Setup"
              className="w-full rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ─── Use Cases ─── */}
      <section className="py-16 bg-secondary/30">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Applications</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">เหมาะกับ<span className="text-primary">ทุกอุตสาหกรรม</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {useCases.map((uc) => (
              <div key={uc.title} className="card-surface rounded-xl p-5 text-center hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                  <uc.icon className="text-primary" size={20} />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-1">{uc.title}</h4>
                <p className="text-[11px] text-muted-foreground">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Price Lists ─── */}
      <section id="price-list" className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Price List</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              ราคา<span className="text-primary">สินค้า</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
              ราคารวม 4G RAM + 128G SSD + ระบบปฏิบัติการ Linux · สั่ง Windows เพิ่มได้ · ราคาอาจเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า
            </p>
          </div>

          <Tabs defaultValue="square" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
              <TabsTrigger value="square" className="gap-2">
                <Square size={14} /> Square Screen
              </TabsTrigger>
              <TabsTrigger value="wide" className="gap-2">
                <RectangleHorizontal size={14} /> Wide Screen
              </TabsTrigger>
            </TabsList>

            <TabsContent value="square" className="space-y-5">
              <PriceTable
                title="Square Screen — Standard Platform"
                icon={Square}
                models={squareModels}
                subTitle="Celeron J1900 / Core i3-i7 7th Gen / 10th Gen"
              />
              <PriceTable
                title="Square Screen — J6412 Processor"
                icon={Cpu}
                models={squareJ6412Models}
                subTitle="Intel Celeron J6412 (New Platform)"
              />
            </TabsContent>

            <TabsContent value="wide" className="space-y-5">
              <PriceTable
                title="Wide Screen — Standard Platform"
                icon={RectangleHorizontal}
                models={wideModels}
                subTitle="Celeron J1900 / Core i3-i7 7th Gen / 10th Gen"
              />
              <PriceTable
                title="Wide Screen — J6412 Processor"
                icon={Cpu}
                models={wideJ6412Models}
                subTitle="Intel Celeron J6412 (New Platform)"
              />
            </TabsContent>
          </Tabs>

          {/* Windows & Options */}
          <div className="mt-10 card-surface rounded-xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Settings className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Windows License & Options</h3>
                  <p className="text-xs text-muted-foreground">อัปเกรดเพิ่มเติมได้ตามต้องการ</p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ลำดับ</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">รายการ</th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ราคา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {windowsOptions.map((opt, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="py-3 px-3 text-muted-foreground">{i + 1}</td>
                        <td className="py-3 px-3 font-medium text-foreground">{opt.name}</td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">{opt.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <PriceDisclaimer />
        </div>
      </section>

      {/* ─── Installation Gallery ─── */}
      <section className="py-16 bg-secondary/30">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Gallery</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              ภาพ<span className="text-primary">ติดตั้งจริง</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">งานติดตั้ง Panel PC สำหรับ Production Line — โรงงานของเรารับ OEM ให้กับแบรนด์ชั้นนำ</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "/images/wix/0597a3_98785635fe784fe19c00ad392cf400ae_f8a92212.png",
              "/images/wix/0597a3_31959a006ae24444b3586333342351a0_2ce47a9b.png",
              "/images/wix/0597a3_93fd8e4c6cb946f19e12c55129b5bdac_b0080fff.png",
              "/images/wix/0597a3_5a42fd39caf242459aba8cca293d0946_c83115bc.png",
            ].map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden card-surface">
                <img src={src} alt={`UTC Installation ${i + 1}`} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              "/images/wix/005637_58cf41453af344fc81b03346959943d4_c745bf12.jpg",
              "/images/wix/005637_c321f3ef6f554ba39151d5416e6ae1bd_6e02619b.jpg",
              "/images/wix/005637_3f34740280de4be0ae521c5e00a002a9_3e45e999.jpg",
            ].map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden card-surface">
                <img src={src} alt={`UTC Factory ${i + 1}`} className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Downloads & Certificates ─── */}
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Downloads</span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              เอกสาร<span className="text-primary">ดาวน์โหลด</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <a
              href="/datasheets/0597a3_91d82f50189a421e97ce9b88530df22c.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface rounded-xl p-5 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Download className="text-primary" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">UTC Series Catalog</h4>
                  <p className="text-xs text-muted-foreground">วารสารสินค้า UTC Series ฉบับเต็ม</p>
                </div>
              </div>
            </a>

            <a
              href="/datasheets/0597a3_2a650be4cb524d18ba2a439fe81eaaf7.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface rounded-xl p-5 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Download className="text-primary" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Technology Guide</h4>
                  <p className="text-xs text-muted-foreground">คู่มือเทคโนโลยี iDoor & Modular</p>
                </div>
              </div>
            </a>

            <a
              href="/datasheets/0597a3_b86ee419c0294b45b787de0c21876dc4.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface rounded-xl p-5 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Download className="text-primary" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Multi-Display Datasheet</h4>
                  <p className="text-xs text-muted-foreground">รายละเอียดระบบแสดงผลหลายจอ</p>
                </div>
              </div>
            </a>

            <a
              href="/datasheets/0597a3_a3d623f8d63d4b66a03bfc2621d41795.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface rounded-xl p-5 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Award className="text-primary" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">CE Certificate</h4>
                  <p className="text-xs text-muted-foreground">ใบรับรอง CE Certification</p>
                </div>
              </div>
            </a>

            <a
              href="/datasheets/0597a3_57b8d6f11f5e44549d532c1d9c0135ad.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface rounded-xl p-5 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Award className="text-primary" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">ISO 9001 Certificate</h4>
                  <p className="text-xs text-muted-foreground">ใบรับรอง ISO 9001</p>
                </div>
              </div>
            </a>

            <Link
              to="/quote?category=UTC+Series"
              className="card-surface rounded-xl p-5 hover:border-primary/30 transition-all group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ShoppingCart className="text-primary" size={18} />
              </div>
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">ขอใบเสนอราคา</h4>
                <p className="text-xs text-muted-foreground">รับใบเสนอราคาภายใน 24 ชม.</p>
              </div>
            </Link>

            <Link
              to="/"
              className="card-surface rounded-xl p-5 hover:border-primary/30 transition-all group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ArrowLeft className="text-primary" size={18} />
              </div>
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">กลับหน้าหลัก</h4>
                <p className="text-xs text-muted-foreground">ดูสินค้าหมวดอื่นๆ</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <FooterCompact />
    </div>
  );
};


export default UTCSeries;

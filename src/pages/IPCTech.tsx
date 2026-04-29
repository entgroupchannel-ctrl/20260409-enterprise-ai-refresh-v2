import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Cpu,
  ThermometerSun,
  Zap,
  Layers,
  Settings2,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Factory,
  Truck,
  Train,
  HardHat,
  Microscope,
  Box,
  FileText,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import GEOMeta from "@/components/GEOMeta";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MiniNavbar from "@/components/MiniNavbar";
import FooterCompact from "@/components/FooterCompact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import QuoteRequestButton from "@/components/QuoteRequestButton";

import logo from "@/assets/ipctech/logo.jpg";
import headquarters from "@/assets/ipctech/headquarters.jpg";
import catMotherboard from "@/assets/ipctech/cat-motherboard.jpg";
import catMiniPC from "@/assets/ipctech/cat-minipc.jpg";
import catPanelPC from "@/assets/ipctech/cat-panelpc.jpg";
import catMonitor from "@/assets/ipctech/cat-monitor.jpg";
import catRackmount from "@/assets/ipctech/cat-rackmount.jpg";
import catCustom from "@/assets/ipctech/cat-custom.jpg";

import qyB4000 from "@/assets/ipctech/qy-b4000.jpg";
import qyB5300 from "@/assets/ipctech/qy-b5300.jpg";
import qyB5700 from "@/assets/ipctech/qy-b5700.jpg";
import qyB6100 from "@/assets/ipctech/qy-b6100.jpg";
import qyU3500 from "@/assets/ipctech/qy-u3500.jpg";
import qyP8000 from "@/assets/ipctech/qy-p8000.jpg";
import qyP5000 from "@/assets/ipctech/qy-p5000.jpg";
import qyP5000Rack from "@/assets/ipctech/qy-p5000-rack.jpg";
import qyP6000Vehicle from "@/assets/ipctech/qy-p6000-vehicle.jpg";
import qyF5000 from "@/assets/ipctech/qy-f5000.jpg";

const categories = [
  {
    id: "motherboard",
    title: "Industrial Mother Board",
    th: "เมนบอร์ดอุตสาหกรรม",
    desc: "Mini-ITX อุตสาหกรรม รองรับ J1900 ถึง 12th Gen Intel CPU พร้อม I/O หลากหลาย ป้องกันไฟกระชาก/ไฟฟ้าสถิต",
    image: catMotherboard,
    bullets: ["Support J1900 → 12th Gen", "Rich I/O (RS-232/485, USB, RJ-45)", "Customizable specifications"],
  },
  {
    id: "minipc",
    title: "Industrial Mini PC",
    th: "มินิพีซีอุตสาหกรรม Fanless",
    desc: "ดีไซน์ Fanless ทนทาน เหมาะกับงานระบบราง อุตสาหกรรม Automation ที่ต้องการความเสถียร 24/7",
    image: catMiniPC,
    bullets: ["24/7 Stable & Reliable", "Flexible Expansion", "Small Size, High Performance"],
  },
  {
    id: "panelpc",
    title: "Industrial Panel PC",
    th: "พาเนลพีซีอุตสาหกรรม",
    desc: "หน้าจอสัมผัส Capacitive/Resistive ติดตั้งฝัง/ติดผนัง/แร็ค มาตรฐาน IP65 กันน้ำกันฝุ่น",
    image: catPanelPC,
    bullets: ["7 → 32 inch coverage", "IP65 Water Proof", "Embedded / Wall / Rack mount"],
  },
  {
    id: "monitor",
    title: "Industrial Monitor",
    th: "จอภาพอุตสาหกรรม",
    desc: "รองรับ HDMI/VGA หรือ DVI/VGA, USB หรือ RS-232 Touch ติดตั้งได้หลายแบบ",
    image: catMonitor,
    bullets: ["7 → 32 inch coverage", "Capacitive / Resistive Touch", "Multi-mount options"],
  },
  {
    id: "rackmount",
    title: "Industrial Computer (Rackmount)",
    th: "คอมพิวเตอร์อุตสาหกรรมแบบแร็ค",
    desc: "3U/3.3U/3.5U/4U รองรับ Mini-ITX/Micro-ATX/ATX, ขยาย PCIe ได้สูง รองรับ CPU desktop 2nd – 14th Gen",
    image: catRackmount,
    bullets: ["Support 2nd → 14th desktop CPU", "Flexible configuration", "Quick integration"],
  },
  {
    id: "custom",
    title: "Customized / ODM/OEM",
    th: "บริการสั่งผลิตเฉพาะงาน",
    desc: "บริการ ODM/OEM ครบวงจร ออกแบบ ผลิต รับรองมาตรฐาน ตามความต้องการของแต่ละอุตสาหกรรม",
    image: catCustom,
    bullets: ["Industry Solutions", "System Integration", "Includes Certification"],
  },
];

const featuredProducts = [
  {
    code: "QY-B5700",
    title: "Best-Seller Industrial Mini PC",
    desc: "Intel Core 6/7/8/10th-i3/i5/i7 · Fanless · ทนทานสูง สเปคยอดนิยมที่สุด",
    image: qyB5700,
    badge: "BEST SELLER",
    tags: ["Fanless", "8 USB", "6 COM"],
  },
  {
    code: "QY-B5300",
    title: "Compact Industrial Mini PC",
    desc: "ขนาดกะทัดรัด รองรับ J1900 ถึง 12th Gen · 2 HDMI · 4 USB · 2 RS-232",
    image: qyB5300,
    badge: "HOT",
    tags: ["Compact", "Fanless"],
  },
  {
    code: "QY-B4000",
    title: "Android Industrial PC (RK3568)",
    desc: "ARM Quad-core Cortex-A55 2.0 GHz · ระบบ Android สำหรับงาน Kiosk / Signage",
    image: qyB4000,
    badge: "ANDROID",
    tags: ["Android", "ARM", "Low Power"],
  },
  {
    code: "QY-B6100",
    title: "High-Gen Desktop CPU PC",
    desc: "Intel Q670 chipset · รองรับ Core 12/13/14 Gen i3/i5/i7/i9 · 7 USB · 6 COM",
    image: qyB6100,
    badge: "HIGH-PERF",
    tags: ["12th–14th Gen", "Desktop CPU"],
  },
  {
    code: "QY-U3500",
    title: "U-Series Rackmount Industrial Computer",
    desc: "Rackmount ขยาย PCIe/PCI ได้มาก รองรับ GPU & การ์ดเสริมสำหรับงาน Industry 4.0",
    image: qyU3500,
    badge: "RACKMOUNT",
    tags: ["3U/4U", "GPU Ready", "−30~70°C"],
  },
  {
    code: "QY-P8000 Series",
    title: "Industrial Panel PC (Heavy-Duty)",
    desc: "พาเนลพีซีระดับงานหนัก หน้าจอสัมผัส รองรับการขยาย I/O และโมดูลเพิ่มเติม",
    image: qyP8000,
    badge: "PANEL",
    tags: ["Touch", "Expandable", "Industrial"],
  },
  {
    code: "QY-P5000 Series",
    title: "Industrial Panel PC (Standard)",
    desc: "พาเนลพีซี multi-size ติดตั้งหลายแบบ พร้อมจอสัมผัส Capacitive/Resistive",
    image: qyP5000,
    badge: "PANEL",
    tags: ["7\"–32\"", "IP65"],
  },
  {
    code: "QY-P6000-Vehicle",
    title: "Vehicle-Mounted Panel PC",
    desc: "พาเนลพีซีติดตั้งในรถ Forklift / รถบรรทุก ทนสั่นสะเทือน DC 9-36V Wide Voltage",
    image: qyP6000Vehicle,
    badge: "VEHICLE",
    tags: ["DC 9-36V", "Forklift", "Logistics"],
  },
  {
    code: "QY-P5000-Rack",
    title: "Rack-Mount Panel PC",
    desc: "Panel PC แบบแร็ค สำหรับห้องควบคุม Server room โรงงาน",
    image: qyP5000Rack,
    badge: "RACK",
    tags: ["Rack-Mount", "Control Room"],
  },
  {
    code: "QY-F5000 Series",
    title: "Industrial Touch Monitor",
    desc: "จอสัมผัสอุตสาหกรรม 7\"–32\" รองรับ HDMI/VGA/DVI · ติดตั้งได้หลายรูปแบบ",
    image: qyF5000,
    badge: "MONITOR",
    tags: ["Touch", "HDMI/VGA", "−30~70°C"],
  },
];

const advantages = [
  { icon: ThermometerSun, title: "−30°C ถึง 70°C", desc: "ทนสภาพอากาศสุดขั้ว เหมาะกับโรงงาน คลังสินค้า กลางแจ้ง" },
  { icon: ShieldCheck, title: "IP65 / Anti-Surge", desc: "กันน้ำกันฝุ่น ป้องกันไฟกระชาก/ไฟฟ้าสถิต/พัลส์" },
  { icon: Zap, title: "Fanless 24/7", desc: "ไม่มีพัดลม เสถียรภาพสูง ทำงานต่อเนื่องตลอดเวลา" },
  { icon: Cpu, title: "J1900 → 14th Gen", desc: "ครอบคลุม CPU ตั้งแต่ low-power จนถึง desktop รุ่นล่าสุด" },
  { icon: Layers, title: "Rich Expansion", desc: "PCIe / PCI / Mini-PCIe / M.2 พร้อมรองรับ 4G/5G/WiFi" },
  { icon: Settings2, title: "ODM/OEM", desc: "บริการสั่งผลิตเฉพาะงาน ออกแบบและรับรองมาตรฐานครบวงจร" },
];

const industries = [
  { icon: Factory, label: "Factory Automation" },
  { icon: Train, label: "Railway / Transit" },
  { icon: Truck, label: "Logistics / Forklift" },
  { icon: HardHat, label: "Smart Factory 4.0" },
  { icon: Microscope, label: "Lab / Inspection" },
  { icon: Box, label: "Warehouse / Kiosk" },
];

const offices = [
  { city: "Beijing", label: "IPCTECH-Bei Jing", note: "Pearl River Moore International Building" },
  { city: "Zhengzhou", label: "IPCTECH-Zheng Zhou", note: "Zhongwu Science & Technology Park" },
  { city: "Shenzhen", label: "IPCTECH-Shen Zhen", note: "R & D Center · Baoan District" },
  { city: "Shanghai", label: "IPCTECH-Shang Hai", note: "Jiuting Center, Songjiang" },
  { city: "Thailand", label: "IPCTECH-Thailand", note: "Sriracha, Chonburi · 81/4 M.7", highlight: true },
];

export default function IPCTech() {
  const breadcrumbs = useMemo(
    () => [
      { name: "หน้าแรก", url: "https://www.entgroup.co.th/" },
      { name: "พันธมิตร", url: "https://www.entgroup.co.th/partners" },
      { name: "IPCTECH", url: "https://www.entgroup.co.th/partners/ipctech" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="IPCTECH × ENT Group — Industrial PC, Panel PC, Mini PC ครบไลน์"
        description="IPCTECH ผู้ผลิต Industrial Computer ครบวงจร — Mother Board, Mini PC, Panel PC, Touch Monitor, Rackmount จัดจำหน่ายในไทยโดย ENT Group · IP65 Fanless −30~70°C ODM/OEM"
        path="/partners/ipctech"
        keywords="IPCTECH, QYIPC, Industrial PC, Industrial Panel PC, Industrial Mini PC, Fanless PC, Rugged Computer, ENT Group"
      />
      <GEOMeta
        summary="IPCTECH (启阳科技 / qyipc.com) คือผู้ผลิต Industrial Computer Solution ครอบคลุม Mother Board, Mini PC, Panel PC, Industrial Monitor และ Rackmount Industrial Computer มีสำนักงานในจีน 4 แห่ง (Beijing, Zhengzhou, Shenzhen R&D, Shanghai) และไทย (Sriracha, Chonburi) จัดจำหน่ายในประเทศไทยโดย ENT Group"
        topic="IPCTECH Industrial Computer Distributor in Thailand"
        sourceAuthority="Official ENT Group partner page for IPCTECH — authorized industrial computing distributor in Thailand"
        keyFacts={[
          "IPCTECH สโลแกน: Technology-oriented and Service-oriented",
          "หมวดสินค้าหลัก: Mother Board, Mini PC, Panel PC, Monitor, Rackmount, Customized ODM/OEM",
          "Mini PC รุ่นเด่น: QY-B4000 (Android), QY-B5300, QY-B5700 (best seller), QY-B6100 (12-14th Gen)",
          "Panel PC: QY-P5000, P5000-Android, P8000-DC, P6000-Vehicle, P5000-Rack ขนาด 7\"–32\" IP65",
          "อุณหภูมิทำงาน −30°C ถึง 70°C, ดีไซน์ Fanless, รองรับ ODM/OEM",
          "ตัวแทนในไทย: ENT Group · เว็บ entgroup.co.th",
        ]}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <MiniNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> กลับหน้าแรก
          </Link>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 mb-5 shadow-sm">
                <img src={logo} alt="IPCTECH logo" className="h-9 w-auto object-contain" />
                <span className="text-xs text-muted-foreground font-medium">
                  Authorized Partner · ENT Group Thailand
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-display font-extrabold leading-tight mb-4">
                IPCTECH <span className="text-primary">Industrial Computer</span>
                <br />
                Solutions ครบวงจร
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-2">
                <span className="italic">"Technology-oriented and Service-oriented"</span>
              </p>
              <p className="text-sm md:text-base text-muted-foreground mb-7 leading-relaxed">
                ผู้ผลิต Industrial PC ครบไลน์ — Mother Board, Mini PC, Panel PC, Touch Monitor และ Rackmount
                Computer พร้อมบริการ ODM/OEM · ดีไซน์ Fanless ทนอุณหภูมิ −30°C ถึง 70°C · IP65
                เหมาะกับงานโรงงาน ระบบราง โลจิสติกส์ และ Industry 4.0
              </p>

              <div className="flex flex-wrap gap-3">
                <QuoteRequestButton
                  productName="IPCTECH Industrial PC"
                  size="lg"
                  className="shadow-md"
                />
                <Button asChild variant="outline" size="lg">
                  <a href="#products">
                    <Box className="mr-2" size={18} /> ดูสินค้าทั้งหมด
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {["FCC", "CE", "CCC", "IP65", "Fanless", "−30~70°C"].map((b) => (
                  <Badge key={b} variant="secondary" className="font-mono text-[11px]">
                    {b}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-2xl" />
              <img
                src={headquarters}
                alt="IPCTECH Headquarters Building"
                className="relative w-full h-auto rounded-2xl shadow-2xl border border-border object-cover aspect-[4/3]"
                loading="eager"
              />
              <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur border border-border rounded-lg px-3 py-2 text-xs">
                <div className="font-bold">IPCTECH HQ · 启阳科技</div>
                <div className="text-muted-foreground">Industrial Computing Manufacturer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-12 md:py-16 bg-card/30 border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">จุดเด่นของ IPCTECH</h2>
            <p className="text-sm text-muted-foreground">เทคโนโลยีอุตสาหกรรมที่พิสูจน์แล้วในงานจริง</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {advantages.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.title}
                  className="bg-background border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon size={22} />
                  </div>
                  <div className="font-bold text-sm md:text-base mb-1">{a.title}</div>
                  <div className="text-xs md:text-sm text-muted-foreground leading-relaxed">{a.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">หมวดสินค้า IPCTECH</h2>
            <p className="text-sm text-muted-foreground">6 กลุ่มผลิตภัณฑ์ครอบคลุมทุกความต้องการอุตสาหกรรม</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((c) => (
              <div
                key={c.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/40 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-[11px] uppercase tracking-wider text-primary font-bold mb-1">
                    {c.title}
                  </div>
                  <div className="font-display font-bold text-base mb-2">{c.th}</div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed flex-1">{c.desc}</p>
                  <ul className="space-y-1">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 size={13} className="text-primary mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-12 md:py-16 bg-card/30 border-y border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-1">รุ่นแนะนำ — Featured Models</h2>
              <p className="text-sm text-muted-foreground">รุ่นยอดนิยมที่ลูกค้าโรงงานในไทยเลือกใช้</p>
            </div>
            <Badge variant="outline" className="text-xs">
              ทั้งหมด {featuredProducts.length} รุ่น
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {featuredProducts.map((p) => (
              <div
                key={p.code}
                className="group bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative aspect-square bg-gradient-to-br from-muted/40 to-muted/10">
                  <img
                    src={p.image}
                    alt={`${p.code} — ${p.title}`}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <Badge className="absolute top-2 left-2 text-[9px] font-mono px-1.5 py-0 h-5">
                    {p.badge}
                  </Badge>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="font-mono text-[11px] text-primary font-bold mb-0.5">{p.code}</div>
                  <div className="font-bold text-xs leading-snug mb-1.5">{p.title}</div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-2 flex-1">{p.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <QuoteRequestButton
                    productName={`IPCTECH ${p.code} — ${p.title}`}
                    size="sm"
                    className="w-full text-xs h-8"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">อุตสาหกรรมที่เลือกใช้</h2>
            <p className="text-sm text-muted-foreground">
              IPCTECH ถูกใช้งานใน 6 กลุ่มอุตสาหกรรมหลักทั่วโลก
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <div
                  key={ind.label}
                  className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Icon size={26} className="mx-auto mb-2 text-primary" />
                  <div className="text-[11px] md:text-xs font-medium leading-tight">{ind.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global presence */}
      <section className="py-12 md:py-16 bg-card/30 border-y border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">เครือข่ายทั่วโลก</h2>
            <p className="text-sm text-muted-foreground">
              5 สำนักงานใน 2 ประเทศ — รวมประเทศไทย
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {offices.map((o) => (
              <div
                key={o.city}
                className={`rounded-xl p-4 border transition-all ${
                  o.highlight
                    ? "bg-primary/10 border-primary/40 shadow-md"
                    : "bg-background border-border"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <MapPin size={15} className={o.highlight ? "text-primary" : "text-muted-foreground"} />
                  <div className="font-bold text-sm">{o.city}</div>
                  {o.highlight && (
                    <Badge variant="default" className="text-[9px] px-1.5 py-0 h-4 ml-auto">
                      🇹🇭 LOCAL
                    </Badge>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground font-medium mb-1">{o.label}</div>
                <div className="text-[11px] text-muted-foreground leading-snug">{o.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ENT × IPCTECH + CTA */}
      <section className="py-14 md:py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-primary/10 via-card to-background border border-primary/30 rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="text-center mb-8">
              <Badge className="mb-3">Authorized Distributor</Badge>
              <h2 className="text-2xl md:text-4xl font-display font-extrabold mb-3">
                ทำไมต้องซื้อ IPCTECH ผ่าน <span className="text-primary">ENT Group</span>?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                เราเป็นพันธมิตรอย่างเป็นทางการของ IPCTECH ในประเทศไทย — รับประกันสินค้าของแท้
                บริการหลังการขายในประเทศ และทีมวิศวกรท้องถิ่นช่วยออกแบบโซลูชัน
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {[
                { icon: ShieldCheck, t: "สินค้าของแท้ 100%", d: "นำเข้าตรงจากโรงงาน รับประกันคุณภาพ" },
                { icon: HardHat, t: "ทีมไทยพร้อมซัพพอร์ต", d: "วิศวกรในไทยตอบเร็ว ติดตั้ง/ทดสอบในพื้นที่" },
                { icon: FileText, t: "ใบเสนอราคาภายใน 24 ชม.", d: "ราคาดีที่สุด พร้อมเอกสารใบกำกับภาษีครบถ้วน" },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.t} className="bg-background border border-border rounded-xl p-5 text-center">
                    <Icon size={28} className="mx-auto mb-2 text-primary" />
                    <div className="font-bold text-sm mb-1">{b.t}</div>
                    <div className="text-xs text-muted-foreground">{b.d}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <QuoteRequestButton
                productName="IPCTECH Industrial PC — ขอใบเสนอราคา"
                size="lg"
                className="shadow-md"
              />
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  <Phone className="mr-2" size={18} /> ติดต่อทีมขาย
                </Link>
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-border grid sm:grid-cols-3 gap-4 text-xs text-muted-foreground text-center">
              <div className="flex items-center gap-2 justify-center">
                <Phone size={14} className="text-primary" /> 02-045-6104
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Mail size={14} className="text-primary" /> info@entgroup.co.th
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Globe size={14} className="text-primary" /> www.entgroup.co.th
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterCompact />
    </div>
  );
}

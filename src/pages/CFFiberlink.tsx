import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import {
  ExternalLink,
  Shield,
  Zap,
  Network,
  Server,
  ThermometerSun,
  Globe,
  Factory,
  Train,
  Camera,
  TrafficCone,
  Ship,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import FooterCompact from "@/components/FooterCompact";
import MiniNavbar from "@/components/MiniNavbar";
import { cffiberlinkCatalog, type CFFiberlinkModel, type CFFiberlinkCategoryDef } from "@/data/cffiberlink-models";

/**
 * CF Fiberlink — Authorized Partner page (TH)
 * Source: https://www.cffiberlink.com/
 * Manufacturer: Huizhou Changfei Optoelectronics (est. 2009)
 * รุ่นที่คัดเลือกสำหรับตลาดไทย — เน้น Industrial Managed / PoE / L3 / Cloud-Managed
 */

// ───────────── Product Categories ─────────────
const productCategories = [
  {
    id: "industrial-managed",
    title: "Industrial Managed Switch",
    th: "สวิตช์อุตสาหกรรมแบบจัดการได้",
    desc: "L2/L2+/L3 รองรับ ERPS Ring <20ms, VLAN, ACL/QoS, IP40, อุณหภูมิ -40~85°C เหมาะระบบราง โรงไฟฟ้า ปิโตรเคมี",
    icon: Factory,
    image: "https://cdnus.globalso.com/cffiberlink/Industrial-Managed-Switch.jpg",
  },
  {
    id: "industrial-poe",
    title: "Industrial PoE Switch",
    th: "สวิตช์ PoE สำหรับงานอุตสาหกรรม",
    desc: "PoE/PoE+ IEEE802.3af/at 30W ต่อพอร์ต PoE Self-healing เหมาะกล้อง CCTV, AP, IP Phone กลางแจ้งและในโรงงาน",
    icon: Camera,
    image: "https://cdnus.globalso.com/cffiberlink/PoE1.jpg",
  },
  {
    id: "cloud-managed",
    title: "Cloud Managed Switch",
    th: "สวิตช์จัดการผ่านคลาวด์",
    desc: "บริหารผ่านเว็บ/มือถือจากศูนย์กลาง รองรับหลาย Site เห็น CPU/Memory/Port Status แบบเรียลไทม์",
    icon: Globe,
    image: "https://cdnus.globalso.com/cffiberlink/%E4%BA%91%E7%AE%A1%E7%90%86%E5%B7%A5%E4%B8%9A%E7%BA%A7%E9%A6%96%E9%A1%B55.jpg",
  },
  {
    id: "enterprise",
    title: "Managed Enterprise Switch",
    th: "สวิตช์องค์กรระดับ Enterprise",
    desc: "L2/L3 Cloud-Managed สำหรับสำนักงาน อาคาร โรงแรม โรงพยาบาล รองรับ 10G Uplink",
    icon: Server,
    image: "https://cdnus.globalso.com/cffiberlink/%E4%BA%91%E7%AE%A1%E7%90%86%E4%BC%81%E4%B8%9A%E7%BA%A7%E9%A6%96%E9%A1%B52.jpg",
  },
  {
    id: "unmanaged",
    title: "Unmanaged Industrial Switch",
    th: "สวิตช์อุตสาหกรรม Plug & Play",
    desc: "ติดตั้งง่าย ใช้งานทันที DIN-Rail Fanless ทนสภาพแวดล้อมโรงงาน ไม่ต้องตั้งค่า",
    icon: Zap,
    image: "https://cdnus.globalso.com/cffiberlink/%E9%9D%9E%E7%BD%91%E7%AE%A1.jpg",
  },
];

// ───────────── Featured Models for Thailand ─────────────
const featuredModels = [
  // Industrial Managed
  {
    cat: "industrial-managed",
    model: "CF-HY4T8016G-SFP",
    name: "28-port 10G Uplink L3 Managed Industrial",
    spec: "16× GbE RJ45 + 8× SFP + 4× 10G SFP+",
    use: "Backbone โรงงาน / Smart City / รถไฟฟ้า",
    image: "https://cdnus.globalso.com/cffiberlink/4%E4%B8%87%E5%85%86%E5%85%8916%E5%8D%83%E5%85%86%E7%94%B58%E4%B8%AA%E5%8D%83%E5%85%86%E5%85%89-CF-HY4T8016G-SFP-2.jpg",
    badge: "L3 / 10G",
  },
  {
    cat: "industrial-managed",
    model: "CF-HY4T1608S-SFP",
    name: "Full Gigabit 16 Optical 8 Electrical L3",
    spec: "16× SFP + 8× GbE + 4× 10G SFP+ / 6KV Lightning",
    use: "Smart Grid / โรงไฟฟ้า / สถานีสูบน้ำ",
    image: "https://cdnus.globalso.com/cffiberlink/604b25fdafe0b0fe8dba3998bed93d0.jpg",
    badge: "Lightning Protect",
  },
  {
    cat: "industrial-managed",
    model: "CF-HY4008GV-SFP",
    name: "12-port L2+ Managed Industrial",
    spec: "8× GbE + 4× SFP / Bypass Optical / IPv4 Static Route",
    use: "ตู้ควบคุมโรงงาน / Substation",
    image: "https://cdnus.globalso.com/cffiberlink/4107.jpg",
    badge: "L2+",
  },
  {
    cat: "industrial-managed",
    model: "CFW-HY2008G-SFP",
    name: "10-port L2 WEB Managed Gigabit",
    spec: "8× GbE + 2× SFP / WEB GUI / Bypass",
    use: "งาน ITS / ตู้ริมถนน",
    image: "https://cdnus.globalso.com/cffiberlink/1105.jpg",
    badge: "WEB Managed",
  },
  {
    cat: "industrial-managed",
    model: "CFW-HY2024M-2",
    name: "6-port WEB Managed Multimode Dual Fiber",
    spec: "4× GbE + 2× 100/1000 SC Multimode",
    use: "Edge ตู้สวิตช์ขนาดเล็ก",
    image: "https://cdnus.globalso.com/cffiberlink/55c2d925462b78fdb39e499ae32255f.jpg",
    badge: "Compact",
  },
  // PoE
  {
    cat: "industrial-poe",
    model: "CF-HY4016GP-SFP",
    name: "20-port L2 Managed Industrial PoE",
    spec: "16× GbE PoE+ (240W) + 4× SFP / 30W ต่อพอร์ต",
    use: "ระบบกล้อง CCTV เมือง / โรงงาน",
    image: "https://cdnus.globalso.com/cffiberlink/afdsgn-tuya-tuya.jpg",
    badge: "PoE+ 240W",
  },
  {
    cat: "industrial-poe",
    model: "AI PoE 27-port",
    name: "27-port 10/100/1000M PoE Switch",
    spec: "AI PoE Self-healing / Metal Body",
    use: "Wireless City / Surveillance",
    image: "https://cdnus.globalso.com/cffiberlink/IMG_3772.jpg",
    badge: "AI PoE",
  },
  // Unmanaged
  {
    cat: "unmanaged",
    model: "CF-5P-100",
    name: "5-port 10/100M Industrial Ethernet Switch",
    spec: "Fanless / DIN-Rail / Wide Temp",
    use: "PLC / Sensor Network",
    image: "https://cdnus.globalso.com/cffiberlink/4102463c28550c4957093c1152bf171.jpg",
    badge: "Plug & Play",
  },
  {
    cat: "unmanaged",
    model: "CF-10P-100-PoE",
    name: "10-port 10/100M Ethernet Switch (8 PoE + 2)",
    spec: "8× PoE + 2× Uplink",
    use: "งาน CCTV ขนาดเล็ก",
    image: "https://cdnus.globalso.com/cffiberlink/8dfe75d0299f4e25f01248d019fe5da.jpg",
    badge: "8+2 PoE",
  },
];

const features = [
  { icon: ThermometerSun, title: "Wide Temp -40~85°C", desc: "ทำงานในสภาพอากาศสุดขั้ว ไม่กลัวร้อน หนาว ฝุ่น" },
  { icon: Shield, title: "IP40 + 6KV Lightning", desc: "ป้องกันฟ้าผ่า + EMC4 EMI ป้องกันไฟกระชาก" },
  { icon: Network, title: "ERPS Ring < 20ms", desc: "Ring Protocol ความเร็วระดับมิลลิวินาที ป้องกันเครือข่ายล่ม" },
  { icon: Server, title: "Dual Power Redundancy", desc: "ไฟสำรองคู่ AC+DC พร้อม PoE Self-healing" },
  { icon: Cpu, title: "MTBF สูงสุด 35 ปี", desc: "อายุการใช้งานยาวนาน รับประกัน 5 ปี" },
  { icon: Globe, title: "OEM/ODM Service", desc: "สั่งผลิตตามสเปก ปรับแต่งฟังก์ชันได้" },
];

const industries = [
  { icon: TrafficCone, label: "Smart Traffic / ITS", desc: "สัญญาณไฟจราจร ANPR กล้องตรวจจับความเร็ว" },
  { icon: Camera, label: "Safe City / CCTV", desc: "ระบบกล้องวงจรปิดเมือง โรงเรียน หน่วยราชการ" },
  { icon: Factory, label: "Smart Manufacturing", desc: "PLC / SCADA / MES ในโรงงาน 24/7" },
  { icon: Zap, label: "Smart Grid / Power", desc: "Substation / โรงไฟฟ้า / Solar Farm" },
  { icon: Train, label: "Rail Transit", desc: "รถไฟฟ้า / สถานี / ระบบสัญญาณ" },
  { icon: Ship, label: "Marine & Petrochemical", desc: "ท่าเรือ ปิโตรเคมี เหมือง" },
];

const allCatalogModels: CFFiberlinkModel[] = cffiberlinkCatalog.flatMap((c) => c.models);

const CFFiberlink = () => {
  const [selected, setSelected] = useState<{ model: CFFiberlinkModel; cat: CFFiberlinkCategoryDef } | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="CF Fiberlink Industrial Switch — Authorized Partner ประเทศไทย"
        description="CF Fiberlink — ผู้ผลิต Industrial Ethernet Switch / PoE / L3 Managed / Cloud Managed ตั้งแต่ปี 2009 รองรับ ERPS Ring <20ms, IP40, -40~85°C สำหรับงานอุตสาหกรรม Smart City และระบบราง"
        path="/partners/cffiberlink"
      />
      <ProductJsonLd
        collectionName="CF Fiberlink Industrial Ethernet Switch"
        collectionDescription="CF Fiberlink Industrial Managed / PoE / Cloud Switch สำหรับงานอุตสาหกรรม Smart City และระบบราง"
        collectionUrl="/partners/cffiberlink"
        products={allCatalogModels.map((m) => ({
          name: `CF Fiberlink ${m.model}`,
          description: `${m.ports} — Switching ${m.switchingCapacity}, ${m.packetRate}`,
          category: "Industrial Ethernet Switch",
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "พาร์ทเนอร์", path: "/partner" },
          { name: "CF Fiberlink", path: "/partners/cffiberlink" },
        ]}
      />
      <MiniNavbar />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                Authorized Partner — Thailand
              </Badge>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
                CF Fiberlink <span className="text-gradient">Industrial Switch</span>
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed mb-4">
                ผู้ผลิต Optical Communication ระดับโลกจาก Huizhou Changfei (ก่อตั้งปี 2009) — ผู้นำ Industrial Ethernet Switch, PoE, Cloud-Managed และ SFP Module ที่ใช้งานจริงใน Smart Grid, Rail Transit, Safe City กว่า <strong className="text-foreground">100 ประเทศ / 360+ ตัวแทน</strong>
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                <Badge variant="outline" className="text-xs">-40~85°C</Badge>
                <Badge variant="outline" className="text-xs">IP40</Badge>
                <Badge variant="outline" className="text-xs">6KV Lightning</Badge>
                <Badge variant="outline" className="text-xs">ERPS &lt;20ms</Badge>
                <Badge variant="outline" className="text-xs">MTBF 35Y</Badge>
                <Badge variant="outline" className="text-xs">รับประกัน 5 ปี</Badge>
              </div>
              <div className="flex gap-3">
                <QuoteRequestButton
                  productModel="CF Fiberlink Switch"
                  productName="CF Fiberlink Industrial Switch"
                  size="default"
                />
                <Button variant="outline" asChild>
                  <a href="https://www.cffiberlink.com/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1.5" /> เว็บโรงงาน
                  </a>
                </Button>
              </div>
            </div>
            <div className="card-surface overflow-hidden">
              <img
                src="https://cdnus.globalso.com/cffiberlink/24a9ade4dba0ceeaebcc388cc5bd9e81.jpg"
                alt="CF Fiberlink Industrial Switch Lineup"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-10 space-y-14">
        {/* Features */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">
            ทำไมต้อง <span className="text-gradient">CF Fiberlink</span>
          </h2>
          <p className="text-muted-foreground text-center mb-6 text-sm">
            จุดเด่นทางเทคนิคที่ทำให้ใช้งานในสภาพแวดล้อมสุดโหดได้
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <div key={i} className="card-surface p-4">
                <f.icon className="w-7 h-7 text-primary mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">หมวดสินค้าที่นำเสนอในไทย</h2>
          <p className="text-muted-foreground text-sm mb-5">
            คัดเลือกจาก Catalog โรงงาน — เน้น 5 หมวดที่ตอบโจทย์ตลาดไทยมากที่สุด
          </p>
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
            {productCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="shrink-0 px-3 py-2 rounded-lg text-xs font-medium bg-secondary/50 text-foreground/70 border border-border hover:border-primary/30 transition-all"
              >
                {cat.title}
              </a>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productCategories.map((cat) => (
              <div
                key={cat.id}
                id={cat.id}
                className="card-surface overflow-hidden scroll-mt-24 group hover:border-primary/40 transition-all"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <cat.icon className="w-4 h-4 text-primary" />
                    <h3 className="font-display font-bold text-foreground">{cat.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{cat.th}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Full Catalog by Category */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            แค็ตตาล็อก<span className="text-gradient">รุ่นทั้งหมด</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            ดึงสเปกจริงจากโรงงาน — แบ่งเป็น 3 หมวดตามระดับ Layer (L2 / L2+ / L3 10G) — คลิกที่รุ่นเพื่อดูสเปกและขอใบเสนอราคา
          </p>

          <div className="space-y-10">
            {cffiberlinkCatalog.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                  <h3 className="text-lg font-display font-bold text-foreground">{cat.title}</h3>
                  <Badge variant="outline" className="text-[10px]">{cat.models.length} รุ่น</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{cat.desc}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {cat.models.map((m) => (
                    <button
                      key={m.model}
                      type="button"
                      onClick={() => setSelected({ model: m, cat })}
                      className="card-surface overflow-hidden flex flex-col text-left hover:border-primary/50 hover:-translate-y-0.5 transition-all"
                    >
                      <div className="aspect-square overflow-hidden bg-muted relative">
                        <img
                          src={m.image}
                          alt={`CF Fiberlink ${m.model}`}
                          className="w-full h-full object-contain p-2"
                          loading="lazy"
                        />
                        {m.badge && (
                          <Badge className="absolute top-1.5 left-1.5 bg-primary/90 text-primary-foreground text-[9px] px-1.5 py-0">
                            {m.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="p-2.5 flex flex-col flex-1">
                        <p className="font-mono text-[11px] text-foreground font-semibold leading-tight mb-1">{m.model}</p>
                        <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">{m.ports}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section className="card-surface p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">
            อุตสาหกรรมที่ใช้งานจริง
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            สวิตช์ CF Fiberlink ใช้งานทั่วโลกในงาน Mission-Critical
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {industries.map((ind, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                  <ind.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{ind.label}</h3>
                  <p className="text-xs text-muted-foreground">{ind.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="card-surface p-8 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            สนใจ CF Fiberlink Industrial Switch?
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            ทีมวิศวกร ENT Group พร้อมประเมินสเปก เสนอราคา และสนับสนุนหลังการขายในประเทศไทย
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <QuoteRequestButton
              productModel="CF Fiberlink Switch"
              productName="CF Fiberlink Industrial Switch"
            />
            <Button variant="outline" asChild>
              <a href="https://www.cffiberlink.com/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1.5" /> ดู Catalog เต็ม
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className="text-[10px]">{selected.cat.title}</Badge>
                  {selected.model.poe && <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-[10px]">PoE+</Badge>}
                  {selected.model.badge && <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px]">{selected.model.badge}</Badge>}
                </div>
                <DialogTitle className="font-mono text-lg">CF Fiberlink {selected.model.model}</DialogTitle>
                <DialogDescription className="text-sm">{selected.cat.th}</DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-5 mt-2">
                <div className="bg-muted rounded-lg overflow-hidden aspect-square">
                  <img
                    src={selected.model.image}
                    alt={`CF Fiberlink ${selected.model.model}`}
                    className="w-full h-full object-contain p-3"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">พอร์ต</p>
                    <p className="text-sm text-foreground font-medium">{selected.model.ports}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-0.5">Switching Capacity</p>
                      <p className="text-sm font-semibold text-foreground">{selected.model.switchingCapacity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-0.5">Packet Forwarding</p>
                      <p className="text-sm font-semibold text-foreground">{selected.model.packetRate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-0.5">ขนาด (mm)</p>
                    <p className="text-sm text-foreground">{selected.model.size}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="outline" className="text-[10px]">-40~85°C</Badge>
                    <Badge variant="outline" className="text-[10px]">6KV Lightning</Badge>
                    <Badge variant="outline" className="text-[10px]">ERPS &lt;20ms</Badge>
                    <Badge variant="outline" className="text-[10px]">รับประกัน 5 ปี</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Software Features</p>
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                  {selected.cat.software.map((s, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex gap-2 flex-wrap">
                <QuoteRequestButton
                  productModel={selected.model.model}
                  productName={`CF Fiberlink ${selected.model.model}`}
                  size="sm"
                />
                <AddToCartButton
                  productModel={selected.model.model}
                  productName={`CF Fiberlink ${selected.model.model}`}
                  productDescription={`${selected.model.ports} — ${selected.model.switchingCapacity}, ${selected.model.packetRate}`}
                  size="sm"
                  variant="outline"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <FooterCompact />
    </div>
  );
};

export default CFFiberlink;

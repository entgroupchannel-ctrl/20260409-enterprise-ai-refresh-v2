import { useState, useEffect } from "react";
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
  ShoppingBag,
  Wifi,
  Pickaxe,
  Building2,
  GraduationCap,
  Hotel,
  Store,
  Leaf,
  FlaskConical,
  Building,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FooterCompact from "@/components/FooterCompact";
import MiniNavbar from "@/components/MiniNavbar";
import { cffiberlinkCatalog, type CFFiberlinkModel, type CFFiberlinkCategoryDef, type CFUseCase } from "@/data/cffiberlink-models";

// แมป use case → icon + label สั้น (ภาษาไทย) สำหรับแสดงในการ์ด
const USE_CASE_META: Record<CFUseCase, { icon: LucideIcon; label: string }> = {
  cctv:         { icon: Camera,         label: "CCTV" },
  "wifi-ap":    { icon: Wifi,           label: "WiFi AP" },
  factory:      { icon: Factory,        label: "โรงงาน" },
  rail:         { icon: Train,          label: "ระบบราง" },
  traffic:      { icon: TrafficCone,    label: "ITS" },
  power:        { icon: Zap,            label: "Smart Grid" },
  petrochem:    { icon: FlaskConical,   label: "ปิโตรเคมี" },
  mining:       { icon: Pickaxe,        label: "เหมือง" },
  marine:       { icon: Ship,           label: "Marine" },
  "smart-city": { icon: Building2,      label: "Smart City" },
  campus:       { icon: GraduationCap,  label: "โรงเรียน" },
  hotel:        { icon: Hotel,          label: "โรงแรม" },
  office:       { icon: Building,      label: "ออฟฟิศ" },
  smb:          { icon: Store,          label: "SMB" },
  green:        { icon: Leaf,           label: "Solar/Green" },
};

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


const features = [
  { icon: ThermometerSun, title: "Wide Temp -40~85°C", desc: "ทำงานในสภาพอากาศสุดขั้ว ไม่กลัวร้อน หนาว ฝุ่น" },
  { icon: Shield, title: "IP40 + 6KV Lightning", desc: "ป้องกันฟ้าผ่า + EMC4 EMI ป้องกันไฟกระชาก" },
  { icon: Network, title: "ERPS Ring < 20ms", desc: "Ring Protocol ความเร็วระดับมิลลิวินาที ป้องกันเครือข่ายล่ม" },
  { icon: Server, title: "Dual Power Redundancy", desc: "ไฟสำรองคู่ AC+DC พร้อม PoE Self-healing" },
  { icon: Cpu, title: "MTBF สูงสุด 35 ปี", desc: "อายุการใช้งานยาวนาน รับประกัน 2 ปี จากโรงงาน" },
  { icon: Globe, title: "OEM/ODM Service", desc: "สั่งผลิตตามสเปก ปรับแต่งฟังก์ชันได้" },
];

const industries: Array<{
  icon: LucideIcon;
  label: string;
  desc: string;
  image: string;
  detail: string;
  recommended: string[]; // model codes ที่แนะนำสำหรับงานนี้
}> = [
  {
    icon: TrafficCone,
    label: "Smart Traffic / ITS",
    desc: "สัญญาณไฟจราจร ANPR กล้องตรวจจับความเร็ว",
    image: "/cffiberlink/industry-traffic.jpg",
    detail: "ติดตั้งในตู้ริมถนนที่ร้อน 60°C+ — ต้องการ ERPS Ring เพื่อกันไฟเบอร์ขาด, PoE จ่ายไฟกล้อง ANPR และ 6KV กันฟ้าผ่า",
    recommended: ["CF-HY2008GP-SFP", "CF-HY4008GP-SFP", "CF-HY2004GP-SFP"],
  },
  {
    icon: Camera,
    label: "Safe City / CCTV",
    desc: "ระบบกล้องวงจรปิดเมือง โรงเรียน หน่วยราชการ",
    image: "/cffiberlink/industry-cctv.jpg",
    detail: "Aggregation จากกล้อง IP หลายร้อยตัว ส่งกลับศูนย์ควบคุมผ่าน 10G Uplink — ใช้ PoE Switch หน้างาน + Core L3 ที่ห้อง NOC",
    recommended: ["CF-PE2421G", "CF-SE2724G-B", "CF-HY4T8024GP-SFP+"],
  },
  {
    icon: Factory,
    label: "Smart Manufacturing",
    desc: "PLC / SCADA / MES ในโรงงาน 24/7",
    image: "/cffiberlink/industry-factory.jpg",
    detail: "เครือข่าย OT ที่ห้ามล่ม — ERPS <20ms self-healing, DIN-Rail mount ในตู้คอนโทรล, รองรับ Modbus/Profinet ผ่าน VLAN แยก",
    recommended: ["CF-HY8008G-SFP", "CF-HY4016G-SFP", "CF-HY4T8016G-SFP+"],
  },
  {
    icon: Zap,
    label: "Smart Grid / Power",
    desc: "Substation / โรงไฟฟ้า / Solar Farm",
    image: "/cffiberlink/industry-power.jpg",
    detail: "L2+ ขั้นสูง ทนสนามแม่เหล็กไฟฟ้าสูงใน Substation — IPv4/IPv6 routing สำหรับ Solar Inverter หลายพันตัว",
    recommended: ["CF-HY4008GV-SFP", "CF-HY8016GV-SFP", "CF-HY4024GV-SFP"],
  },
  {
    icon: Train,
    label: "Rail Transit",
    desc: "รถไฟฟ้า / สถานี / ระบบสัญญาณ",
    image: "/cffiberlink/industry-rail.jpg",
    detail: "ระบบสื่อสารระหว่างขบวน-สถานี-ศูนย์ควบคุม — ทนสั่นสะเทือน, redundant power, ERPS Ring backbone ตามแนวราง",
    recommended: ["CF-HY4T8016GP-SFP+", "CF-HY8016GVP-SFP", "CF-HY4C024GP-SFP"],
  },
  {
    icon: Ship,
    label: "Marine & Petrochemical",
    desc: "ท่าเรือ ปิโตรเคมี เหมือง",
    image: "/cffiberlink/industry-marine.jpg",
    detail: "ทนเค็ม ทนไอกรด ทนฝุ่นเหมือง — L2+ VTS รองรับ Bypass Optical กันไฟดับ, ใช้ใน Loading Arm และ Pipeline Monitoring",
    recommended: ["CF-HY4008GVP-SFP", "CF-HY2008GVP-SFP", "CF-HY8008GVP-SFP"],
  },
];

const allCatalogModels: CFFiberlinkModel[] = cffiberlinkCatalog.flatMap((c) => c.models);

/** ⭐ รุ่นแนะนำเด่น (Hero Picks) — ดึงจาก catalog ตาม heroPick: true พร้อม cat ของรุ่นนั้น */
const heroPicks: Array<{ model: CFFiberlinkModel; cat: CFFiberlinkCategoryDef }> = cffiberlinkCatalog.flatMap((c) =>
  c.models.filter((m) => m.heroPick).map((m) => ({ model: m, cat: c }))
);

type PortFilter = "all" | "1-8" | "9-16" | "17-24" | "25+";
type PoeFilter = "all" | "poe" | "no-poe";
type FormFilter = "all" | "din" | "rack";

const getPortCount = (ports: string): number => {
  const matches = ports.match(/(\d+)\s*[×x]/g) || [];
  let sum = 0;
  for (const t of matches) sum += parseInt(t, 10) || 0;
  return sum;
};

const isRack = (size: string) => /rack/i.test(size);

const CFFiberlink = () => {
  const [selected, setSelected] = useState<{ model: CFFiberlinkModel; cat: CFFiberlinkCategoryDef } | null>(null);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  // Reset active image เมื่อเปลี่ยนรุ่น
  useEffect(() => {
    if (selected) setActiveImg(selected.model.image);
  }, [selected?.model.model]);
  const [portFilter, setPortFilter] = useState<PortFilter>("all");
  const [poeFilter, setPoeFilter] = useState<PoeFilter>("all");
  const [formFilter, setFormFilter] = useState<FormFilter>("all");

  const filterModel = (m: CFFiberlinkModel): boolean => {
    if (poeFilter === "poe" && !m.poe) return false;
    if (poeFilter === "no-poe" && m.poe) return false;
    if (formFilter === "rack" && !isRack(m.size)) return false;
    if (formFilter === "din" && isRack(m.size)) return false;
    if (portFilter !== "all") {
      const n = getPortCount(m.ports);
      if (portFilter === "1-8" && !(n >= 1 && n <= 8)) return false;
      if (portFilter === "9-16" && !(n >= 9 && n <= 16)) return false;
      if (portFilter === "17-24" && !(n >= 17 && n <= 24)) return false;
      if (portFilter === "25+" && !(n >= 25)) return false;
    }
    return true;
  };

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
                <Badge variant="outline" className="text-xs">รับประกัน 2 ปี จากโรงงาน</Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <QuoteRequestButton
                  productModel="CF Fiberlink Switch"
                  productName="CF Fiberlink Industrial Switch"
                  size="default"
                />
                <Button variant="outline" asChild>
                  <Link to="/shop">
                    <ShoppingBag className="w-4 h-4 mr-1.5" /> เลือกซื้อสินค้าอื่นในร้าน
                  </Link>
                </Button>
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

        {/* ⭐ Hero Picks Strip — รุ่นแนะนำเด่นที่เลือกมาให้ลูกค้าตัดสินใจง่ายขึ้น */}
        {heroPicks.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">
                  ⭐ <span className="text-gradient">รุ่นแนะนำเด่น</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  คัดมาให้แล้ว — ครอบคลุมทุกการใช้งานหลัก ตั้งแต่ Entry ไปจนถึง Flagship
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                คลิกการ์ดเพื่อดูสเปกเต็ม + ขอใบเสนอราคา
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {heroPicks.map(({ model: m, cat }) => (
                <button
                  key={m.model}
                  type="button"
                  onClick={() => setSelected({ model: m, cat })}
                  className="group relative card-surface overflow-hidden flex flex-col text-left ring-2 ring-primary/30 hover:ring-primary hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  {/* Top ribbon */}
                  <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground text-[10px] font-bold tracking-wide uppercase px-2 py-1 text-center shadow">
                    ⭐ Pick · {cat.title}
                  </div>

                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-secondary/40 pt-6">
                    <img
                      src={m.image}
                      alt={`CF Fiberlink ${m.model} — ${m.heroTitle ?? ""}`}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <div>
                      <p className="text-xs text-primary font-bold mb-0.5">{m.heroTitle ?? m.badge}</p>
                      <p className="font-mono text-sm text-foreground font-bold leading-tight break-all">
                        {m.model}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                      {m.heroPitch ?? m.ports}
                    </p>

                    {/* Spotlight chips */}
                    {m.spotlight && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {m.spotlight.slice(0, 4).map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center text-[10px] font-semibold text-primary bg-primary/10 border border-primary/30 rounded px-1.5 py-0.5"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/50 mt-1">
                      <span className="font-mono">{m.switchingCapacity}</span>
                      <span className="text-primary font-semibold group-hover:underline">
                        ดูสเปก →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Full Catalog by Category */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            แค็ตตาล็อก<span className="text-gradient">รุ่นทั้งหมด</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            ดึงสเปกจริงจากโรงงาน — แบ่งเป็น 3 หมวดตามระดับ Layer (L2 / L2+ / L3 10G) — คลิกที่รุ่นเพื่อดูสเปกและขอใบเสนอราคา
          </p>

          <Tabs defaultValue={cffiberlinkCatalog[0].id} className="w-full">
            <TabsList className="w-full h-auto flex-wrap justify-start gap-2 bg-transparent p-0 mb-2">
              {cffiberlinkCatalog.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="text-xs md:text-sm gap-2 px-4 py-2.5 rounded-lg border-2 border-border bg-card text-foreground/70 font-semibold shadow-sm hover:border-primary/50 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all"
                >
                  {cat.title}
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-background/20 text-current border-current/30">{cat.models.length}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {cffiberlinkCatalog.map((cat) => {
              const filtered = cat.models.filter(filterModel);
              const portChips: { v: PortFilter; label: string }[] = [
                { v: "all", label: "ทุกขนาด" },
                { v: "1-8", label: "1-8 พอร์ต" },
                { v: "9-16", label: "9-16 พอร์ต" },
                { v: "17-24", label: "17-24 พอร์ต" },
                { v: "25+", label: "25+ พอร์ต" },
              ];
              const poeChips: { v: PoeFilter; label: string }[] = [
                { v: "all", label: "ทั้งหมด" },
                { v: "poe", label: "PoE" },
                { v: "no-poe", label: "Non-PoE" },
              ];
              const formChips: { v: FormFilter; label: string }[] = [
                { v: "all", label: "ทุกแบบ" },
                { v: "din", label: "DIN-Rail" },
                { v: "rack", label: "Rack 1U" },
              ];
              return (
              <TabsContent key={cat.id} value={cat.id} className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">{cat.desc}</p>

                {/* Chip Filters */}
                <div className="flex flex-col gap-2 mb-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground mr-1 min-w-[60px]">จำนวนพอร์ต:</span>
                    {portChips.map((c) => (
                      <button
                        key={c.v}
                        type="button"
                        onClick={() => setPortFilter(c.v)}
                        className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                          portFilter === c.v
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground/70 border-border hover:border-primary/50"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground mr-1 min-w-[60px]">PoE:</span>
                    {poeChips.map((c) => (
                      <button
                        key={c.v}
                        type="button"
                        onClick={() => setPoeFilter(c.v)}
                        className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                          poeFilter === c.v
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground/70 border-border hover:border-primary/50"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                    <span className="text-[11px] font-semibold text-muted-foreground mx-1 ml-3 min-w-[55px]">รูปแบบ:</span>
                    {formChips.map((c) => (
                      <button
                        key={c.v}
                        type="button"
                        onClick={() => setFormFilter(c.v)}
                        className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                          formFilter === c.v
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground/70 border-border hover:border-primary/50"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                    <span className="text-[11px] text-muted-foreground ml-auto">
                      แสดง {filtered.length}/{cat.models.length} รุ่น
                    </span>
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    ไม่พบรุ่นที่ตรงกับเงื่อนไข — ลองปรับ filter
                  </p>
                ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filtered.map((m) => {
                    const useCases = (m.useCases && m.useCases.length > 0 ? m.useCases : cat.defaultUseCases).slice(0, 4);
                    return (
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
                          <Badge className="absolute top-1.5 left-1.5 bg-primary/90 text-primary-foreground text-[9px] px-1.5 py-0 leading-tight">
                            {m.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="p-2 flex flex-col flex-1 gap-1">
                        <p className="font-mono text-xs text-foreground font-semibold leading-tight break-all">{m.model}</p>
                        <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">{m.ports}</p>
                        {/* Spotlight chips — จุดขาย PR เด่นของรุ่นนี้ (เฉพาะรุ่นที่มี) */}
                        {m.spotlight && m.spotlight.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {m.spotlight.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded px-1 py-0.5 leading-tight"
                              >
                                ⭐ {s}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Use case icons — บอกลูกค้าว่ารุ่นนี้เหมาะกับงานไหน */}
                        <div className="flex flex-wrap gap-1 mt-auto pt-1 border-t border-border/40">
                          {useCases.map((uc) => {
                            const meta = USE_CASE_META[uc];
                            const Icon = meta.icon;
                            return (
                              <span
                                key={uc}
                                title={meta.label}
                                className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground bg-secondary/50 rounded px-1 py-0.5"
                              >
                                <Icon className="w-2.5 h-2.5" />
                                <span className="hidden sm:inline">{meta.label}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </button>
                    );
                  })}
                </div>
                )}
              </TabsContent>
              );
            })}
          </Tabs>
        </section>

        {/* Industries */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-1">
            อุตสาหกรรมที่ใช้งานจริง
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            สวิตช์ CF Fiberlink ใช้งานทั่วโลกในงาน Mission-Critical — แต่ละอุตสาหกรรมแนะนำรุ่นที่เหมาะสมที่สุด
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((ind, i) => (
              <article
                key={i}
                className="card-surface overflow-hidden flex flex-col hover:border-primary/40 hover:-translate-y-0.5 transition-all"
              >
                <div className="aspect-video overflow-hidden bg-muted relative">
                  <img
                    src={ind.image}
                    alt={ind.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={1024}
                    height={640}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary text-primary-foreground shrink-0 shadow-lg">
                      <ind.icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display font-bold text-base text-foreground drop-shadow-sm">{ind.label}</h3>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{ind.detail}</p>
                  <div className="mt-auto">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1.5">รุ่นที่แนะนำ</p>
                    <div className="flex flex-wrap gap-1">
                      {ind.recommended.map((code) => {
                        const found = cffiberlinkCatalog
                          .flatMap((c) => c.models.map((m) => ({ m, cat: c })))
                          .find((x) => x.m.model === code);
                        if (!found) return null;
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => setSelected({ model: found.m, cat: found.cat })}
                            className="font-mono text-[10px] px-2 py-1 rounded border border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>
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
              <Link to="/shop">
                <ShoppingBag className="w-4 h-4 mr-1.5" /> ดูสินค้าทั้งหมดในร้าน
              </Link>
            </Button>
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
          {selected && (() => {
            const catModels = selected.cat.models;
            const idx = catModels.findIndex((m) => m.model === selected.model.model);
            const prev = idx > 0 ? catModels[idx - 1] : catModels[catModels.length - 1];
            const next = idx < catModels.length - 1 ? catModels[idx + 1] : catModels[0];
            // Related: รุ่นอื่นๆ ในหมวดเดียวกัน (สูงสุด 6 ตัว ไม่รวมตัวปัจจุบัน)
            const related = catModels.filter((m) => m.model !== selected.model.model).slice(0, 6);
            return (
            <>
              {/* Prev / Next navigator */}
              <div className="flex items-center justify-between gap-2 -mt-2 mb-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelected({ model: prev, cat: selected.cat })}
                  disabled={catModels.length < 2}
                  className="gap-1 h-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">รุ่นก่อนหน้า</span>
                  <span className="font-mono text-[10px] text-muted-foreground hidden md:inline">{prev.model}</span>
                </Button>
                <span className="text-[11px] text-muted-foreground">
                  {idx + 1} / {catModels.length} ใน {selected.cat.title}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelected({ model: next, cat: selected.cat })}
                  disabled={catModels.length < 2}
                  className="gap-1 h-8"
                >
                  <span className="font-mono text-[10px] text-muted-foreground hidden md:inline">{next.model}</span>
                  <span className="hidden sm:inline">รุ่นถัดไป</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

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
                    <Badge variant="outline" className="text-[10px]">รับประกัน 2 ปี จากโรงงาน</Badge>
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

              {/* Related / You may also like */}
              {related.length > 0 && (
                <div className="mt-6 border-t border-border pt-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold text-foreground">สินค้าที่เกี่ยวข้อง · คุณอาจชอบ</h4>
                    <span className="text-[10px] text-muted-foreground ml-auto">ในหมวด {selected.cat.title}</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {related.map((m) => (
                      <button
                        key={m.model}
                        type="button"
                        onClick={() => setSelected({ model: m, cat: selected.cat })}
                        className="group text-left card-surface p-2 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                      >
                        <div className="aspect-square bg-muted rounded overflow-hidden mb-1.5">
                          <img
                            src={m.image}
                            alt={m.model}
                            loading="lazy"
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="font-mono text-[10px] font-semibold text-foreground truncate">{m.model}</p>
                        <p className="text-[9px] text-muted-foreground truncate">{m.ports}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <FooterCompact />
    </div>
  );
};

export default CFFiberlink;

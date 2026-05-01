import { useState } from "react";
import { Layers, Network, Zap, Globe, Cable, Activity, Radio, Wifi, Shield, Cpu, ArrowRight, Eye, Filter, X, Camera, Ship, Sun, Factory, Antenna, Car, Building2, Thermometer } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import VolktekProductDialog from "@/components/volktek/VolktekProductDialog";
import {
  volktekLayer3,
  volktekIndustrialPoe,
  volktekIndustrialEthernet,
  volktekMetroEthernet,
  volktekMediaConverter,
  volktekEmsNms,
  volktekSfp,
  type VolktekCategory,
  type VolktekProduct,
  type VolktekSubCategory,
} from "@/data/volktek-products";
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

type TabMeta = {
  id: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  desc: string;
  image: string;
  category?: VolktekCategory;
  externalHref: string;
  /** กลุ่มการใช้งานที่เหมาะสม (เฉพาะหมวด) */
  useCases: string[];
  /** คุณสมบัติเด่นของหมวดนี้ (เช่น TSN, PoE++, 10G SFP+) */
  keyFeatures: string[];
};

const TABS: TabMeta[] = [
  {
    id: "layer3",
    title: "Layer 3 Industrial Switches",
    shortTitle: "Layer 3",
    icon: Layers,
    desc: "L3 Managed Switches รองรับ Routing, TSN สำหรับเครือข่ายอุตสาหกรรมขั้นสูง",
    image: catLayer3,
    category: volktekLayer3,
    externalHref: "https://www.volktek.com/product_en.php?id=663",
    useCases: ["Smart Factory", "SCADA / PLC", "Robot & Motion Control"],
    keyFeatures: ["TSN", "L3 Routing", "10G SFP+", "HSR/PRP", "-40~70°C"],
  },
  {
    id: "industrial-ethernet",
    title: "Industrial Ethernet Switches",
    shortTitle: "Industrial Ethernet",
    icon: Network,
    desc: "Unmanaged, Lite Managed, Managed และ DNV/LR Certified สำหรับงานทางทะเล",
    image: catIndustrialEthernet,
    category: volktekIndustrialEthernet,
    externalHref: "https://www.volktek.com/product_en.php?id=52",
    useCases: ["โรงงาน / Automation", "Marine & Offshore", "Substation"],
    keyFeatures: ["DIN-Rail", "DNV/LR", "Redundant Power", "IP30/IP40"],
  },
  {
    id: "industrial-poe",
    title: "Industrial PoE Switches",
    shortTitle: "Industrial PoE",
    icon: Zap,
    desc: "PoE+, PoE++, BT PoE — จ่ายไฟผ่านสาย LAN ให้กล้อง IP, AP, IoT",
    image: catIndustrialPoe,
    category: volktekIndustrialPoe,
    externalHref: "https://www.volktek.com/product_en.php?id=51",
    useCases: ["IP Camera / CCTV", "Wi-Fi AP", "IoT Sensor", "Smart City"],
    keyFeatures: ["PoE+ 30W", "PoE++ 60W", "BT PoE 90W", "DI/DO", "Fiber Uplink"],
  },
  {
    id: "metro-ethernet",
    title: "Metro Ethernet Switches",
    shortTitle: "Metro Ethernet",
    icon: Globe,
    desc: "1G / 10G Aggregation และ Access Switches สำหรับ Service Provider",
    image: catMetroEthernet,
    category: volktekMetroEthernet,
    externalHref: "https://www.volktek.com/product_en.php?id=50",
    useCases: ["ISP / Service Provider", "Carrier Network", "FTTx / FTTH"],
    keyFeatures: ["10G SFP+", "Aggregation", "Q-in-Q", "MPLS-Ready"],
  },
  {
    id: "media-converter",
    title: "Media Converters",
    shortTitle: "Media Converter",
    icon: Cable,
    desc: "แปลง Copper ↔ Fiber, Serial ↔ Fiber, SPE Converters พร้อมรุ่น PoE+",
    image: catMediaConverter,
    category: volktekMediaConverter,
    externalHref: "https://www.volktek.com/product_en.php?id=56",
    useCases: ["ขยายระยะสาย LAN", "เชื่อม Fiber ↔ Copper", "Serial over Fiber"],
    keyFeatures: ["Gigabit", "PoE+", "SFP", "SPE 10BASE-T1L"],
  },
  {
    id: "ems-nms",
    title: "EMS / NMS Software",
    shortTitle: "EMS / NMS",
    icon: Activity,
    desc: "LAMUNGAN และ INDY — แพลตฟอร์มจัดการอุปกรณ์เครือข่ายแบบรวมศูนย์",
    image: catEmsNms,
    category: volktekEmsNms,
    externalHref: "https://www.volktek.com/product_en.php?id=609",
    useCases: ["Network Monitoring", "Centralized Config", "Bulk Firmware Update"],
    keyFeatures: ["LAMUNGAN", "INDY", "SNMP", "Topology Map"],
  },
  {
    id: "sfp",
    title: "SFP Modules",
    shortTitle: "SFP Modules",
    icon: Radio,
    desc: "100BASE, Gigabit, 10G SFP+ ทั้ง Standard และ Bi-Di รองรับหลายระยะ",
    image: catSfp,
    category: volktekSfp,
    externalHref: "https://www.volktek.com/product_en.php?id=73",
    useCases: ["Fiber Uplink", "Long-distance Link", "WDM / Bi-Di"],
    keyFeatures: ["100BASE-FX", "1G SFP", "10G SFP+", "Bi-Di / Single-Strand"],
  },
  {
    id: "poe-injector",
    title: "PoE Injectors / Splitters",
    shortTitle: "PoE Injectors",
    icon: Wifi,
    desc: "PoE Injector เพิ่มความสามารถจ่ายไฟ และ Splitter สำหรับอุปกรณ์ที่ไม่รองรับ PoE",
    image: catPoeInjector,
    externalHref: "https://www.volktek.com/product_en.php?id=108",
    useCases: ["เพิ่ม PoE ให้ Switch เดิม", "ใช้กับอุปกรณ์ที่ไม่รองรับ PoE"],
    keyFeatures: ["PoE Injector", "PoE Splitter", "Single / Multi-port"],
  },
  {
    id: "firewall",
    title: "Network Security Appliances",
    shortTitle: "Security",
    icon: Shield,
    desc: "Industrial Firewall — ปกป้องเครือข่าย OT/ICS จากภัยคุกคามไซเบอร์",
    image: catFirewall,
    externalHref: "https://www.volktek.com/product_en.php?id=672",
    useCases: ["OT / ICS Security", "Network Segmentation", "Zero Trust"],
    keyFeatures: ["Industrial Firewall", "VPN", "DPI", "DIN-Rail"],
  },
  {
    id: "accessories",
    title: "Accessories",
    shortTitle: "Accessories",
    icon: Cpu,
    desc: "Industrial Power Supply DIN-Rail และอุปกรณ์เสริมสำหรับติดตั้ง",
    image: catAccessories,
    externalHref: "https://www.volktek.com/product_en.php?id=100",
    useCases: ["จ่ายไฟ DIN-Rail", "อุปกรณ์เสริมติดตั้ง"],
    keyFeatures: ["Industrial PSU", "DIN-Rail Mount", "Redundancy"],
  },
];

const totalModels = (cat?: VolktekCategory) =>
  cat ? cat.subCategories.reduce((n, s) => n + s.products.length, 0) : 0;

/* ============================================================
 * Quick Filters — ตัวกรองสั้นๆ หลังเลือกหมวด
 * ============================================================ */
type FilterKey = "poe" | "temp" | "ports" | "fiber" | "managed";
type FilterOption = { id: string; label: string };

const FILTER_GROUPS: { key: FilterKey; label: string; options: FilterOption[] }[] = [
  {
    key: "poe",
    label: "PoE",
    options: [
      { id: "any-poe", label: "มี PoE" },
      { id: "poe-plus", label: "PoE+ 30W" },
      { id: "poe-plus-plus", label: "PoE++ 60W+" },
    ],
  },
  {
    key: "temp",
    label: "อุณหภูมิ",
    options: [
      { id: "industrial", label: "Industrial -40°C" },
      { id: "wide", label: "Wide -20°C" },
    ],
  },
  {
    key: "ports",
    label: "พอร์ต",
    options: [
      { id: "small", label: "≤ 8 พอร์ต" },
      { id: "medium", label: "9–16 พอร์ต" },
      { id: "large", label: "17+ พอร์ต" },
    ],
  },
  {
    key: "fiber",
    label: "ไฟเบอร์",
    options: [
      { id: "sfp", label: "SFP" },
      { id: "sfp-plus", label: "10G SFP+" },
    ],
  },
  {
    key: "managed",
    label: "การจัดการ",
    options: [
      { id: "managed", label: "Managed" },
      { id: "unmanaged", label: "Unmanaged" },
    ],
  },
];

/** ดึงข้อความรวมจาก product สำหรับ match filter */
function productHaystack(p: VolktekProduct): string {
  return [
    p.model,
    p.description,
    ...(p.features ?? []),
    p.details?.environment?.tempOperating ?? "",
    p.details?.environment?.housing ?? "",
    ...(p.details?.ports ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

/** นับจำนวนพอร์ตจาก description/features (รวมตัวเลขที่อยู่ก่อน "x" หรือ "port") */
function extractPortCount(p: VolktekProduct): number {
  const text = `${p.description} ${(p.features ?? []).join(" ")} ${(p.details?.ports ?? []).join(" ")}`;
  let total = 0;
  const matches = text.matchAll(/(\d+)\s*[xX]\s*(?:10\/100\/1000|1000|100|10G|GbE|Gigabit|SFP|RJ45|BASE)/g);
  for (const m of matches) total += parseInt(m[1], 10);
  if (total === 0) {
    // fallback: หาเลขใน model "8GT4XS" → 8+4=12
    const modelMatches = p.model.matchAll(/(\d+)(GT|GP|XS|GS|T)/gi);
    for (const m of modelMatches) total += parseInt(m[1], 10);
  }
  return total;
}

function matchesFilter(p: VolktekProduct, active: Partial<Record<FilterKey, string>>): boolean {
  const hay = productHaystack(p);

  if (active.poe) {
    const hasPoe = /poe/.test(hay);
    if (active.poe === "any-poe" && !hasPoe) return false;
    if (active.poe === "poe-plus" && !/poe\+|802\.3at|30w/.test(hay)) return false;
    if (active.poe === "poe-plus-plus" && !/poe\+\+|bt poe|802\.3bt|60w|90w/.test(hay)) return false;
  }

  if (active.temp) {
    const tempStr = (p.details?.environment?.tempOperating ?? "").toLowerCase();
    const allTemp = `${tempStr} ${hay}`;
    if (active.temp === "industrial" && !/-40/.test(allTemp)) return false;
    if (active.temp === "wide" && !/-20|-40/.test(allTemp)) return false;
  }

  if (active.ports) {
    const n = extractPortCount(p);
    if (active.ports === "small" && !(n > 0 && n <= 8)) return false;
    if (active.ports === "medium" && !(n >= 9 && n <= 16)) return false;
    if (active.ports === "large" && !(n >= 17)) return false;
  }

  if (active.fiber) {
    if (active.fiber === "sfp" && !/sfp|fiber|fx/.test(hay)) return false;
    if (active.fiber === "sfp-plus" && !/sfp\+|10g/.test(hay)) return false;
  }

  if (active.managed) {
    const isManaged = /managed/.test(hay) && !/unmanaged/.test(hay);
    const isUnmanaged = /unmanaged/.test(hay);
    if (active.managed === "managed" && !isManaged) return false;
    if (active.managed === "unmanaged" && !isUnmanaged) return false;
  }

  return true;
}

/* ============================================================
 * Compatibility Icons + Temperature Stripe
 * ============================================================ */

type CompatIcon = { id: string; label: string; icon: LucideIcon };

/** อนุมานอุปกรณ์/งานที่รุ่นนี้รองรับ จาก description + features + details */
function getCompatibilityIcons(p: VolktekProduct): CompatIcon[] {
  const hay = productHaystack(p);
  const housing = (p.details?.environment?.housing ?? "").toLowerCase();
  const tempStr = (p.details?.environment?.tempOperating ?? "").toLowerCase();
  const out: CompatIcon[] = [];

  // PoE — สำหรับกล้อง CCTV / AP / IP Phone
  if (/poe/.test(hay)) {
    out.push({ id: "cctv", label: "รองรับกล้อง CCTV / IP Camera (PoE)", icon: Camera });
    out.push({ id: "wifi-ap", label: "จ่ายไฟ Wi-Fi Access Point (PoE)", icon: Wifi });
  }

  // Industrial / Factory — DIN-rail housing หรือทนอุณหภูมิอุตสาหกรรม
  if (/-40/.test(`${tempStr} ${hay}`) || /din.?rail|industrial|ip30|ip40/.test(`${housing} ${hay}`)) {
    out.push({ id: "factory", label: "งานโรงงาน / Industrial Automation", icon: Factory });
  }

  // Outdoor — IP65/IP67 หรือกล่องทนน้ำ
  if (/ip6[5-9]|outdoor|weatherproof|ip54/.test(`${housing} ${hay}`)) {
    out.push({ id: "outdoor", label: "ติดตั้งกลางแจ้ง / Outdoor", icon: Sun });
  }

  // Marine / Ship — EN50155 / E-Mark / IEC 60945 หรือ marine certified
  if (/marine|en\s?50155|iec\s?60945|ship|onboard|รถไฟ|train/.test(hay)) {
    out.push({ id: "marine", label: "งานเรือ / ระบบขนส่ง (Marine / Rail)", icon: Ship });
  }

  // Transportation / Vehicle
  if (/automotive|vehicle|in.?vehicle|transportation|en\s?50155/.test(hay)) {
    out.push({ id: "vehicle", label: "งานยานยนต์ / Transportation", icon: Car });
  }

  // Telecom / ISP — Metro Ethernet, Carrier
  if (/metro|carrier|telecom|isp|ftt|epon|gpon/.test(hay)) {
    out.push({ id: "telecom", label: "งาน Telecom / ISP / FTTx", icon: Antenna });
  }

  // Building / Smart Building / Hospitality
  if (/hotel|building|condo|residential|commercial|enterprise/.test(hay)) {
    out.push({ id: "building", label: "งานอาคาร / Enterprise / Hospitality", icon: Building2 });
  }

  // จำกัดที่ 5 icons เพื่อกันการ์ดล้น
  return out.slice(0, 5);
}

type TempStripe = {
  /** Tailwind classes สำหรับ background gradient */
  bg: string;
  label: string;
  range: string;
};

/** อ่านช่วงอุณหภูมิและแมปเป็นแถบสี (ใช้ semantic-friendly utility classes) */
function getTempStripe(p: VolktekProduct): TempStripe | null {
  const tempStr = (p.details?.environment?.tempOperating ?? "").toLowerCase();
  const fallback = productHaystack(p);
  const all = `${tempStr} ${fallback}`;

  // Industrial Extreme: -40°C
  if (/-40/.test(all)) {
    return {
      bg: "bg-gradient-to-r from-blue-600 via-emerald-500 to-red-600",
      label: "Industrial Extreme",
      range: "-40°C ถึง 75°C",
    };
  }
  // Wide: -20°C / -10°C
  if (/-20|-10/.test(all)) {
    return {
      bg: "bg-gradient-to-r from-sky-500 via-emerald-500 to-orange-500",
      label: "Wide Temperature",
      range: "-20°C ถึง 70°C",
    };
  }
  // Standard / Commercial: 0°C
  if (/0\s?°?c|0\s?to|commercial/.test(all) || tempStr.length > 0) {
    return {
      bg: "bg-gradient-to-r from-emerald-400 to-amber-400",
      label: "Standard",
      range: "0°C ถึง 50°C",
    };
  }
  return null;
}

const VolktekMegaCatalog = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [activeSub, setActiveSub] = useState<Record<string, string>>({});
  const [activeFilters, setActiveFilters] = useState<Record<string, Partial<Record<FilterKey, string>>>>({});
  const [selected, setSelected] = useState<{
    product: VolktekProduct;
    sub: VolktekSubCategory;
    catTitle: string;
  } | null>(null);

  const openProduct = (product: VolktekProduct, sub: VolktekSubCategory, catTitle: string) =>
    setSelected({ product, sub, catTitle });

  const toggleFilter = (tabId: string, key: FilterKey, optionId: string) => {
    setActiveFilters((prev) => {
      const tabFilters = { ...(prev[tabId] ?? {}) };
      if (tabFilters[key] === optionId) delete tabFilters[key];
      else tabFilters[key] = optionId;
      return { ...prev, [tabId]: tabFilters };
    });
  };

  const clearFilters = (tabId: string) => {
    setActiveFilters((prev) => ({ ...prev, [tabId]: {} }));
  };


  return (
    <section id="catalog" className="scroll-mt-24">
      <div className="text-center mb-6">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">
          Product Catalog
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          เลือกหมวด <span className="text-gradient">Volktek</span>
        </h2>
        <p className="text-muted-foreground text-sm">
          10 หมวดผลิตภัณฑ์ครอบคลุมทุกความต้องการของเครือข่ายอุตสาหกรรม
        </p>
      </div>

      {/* Recommendation hint bar */}
      <div className="mb-4 flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
          <ArrowRight className="w-3.5 h-3.5" />
          ไม่แน่ใจเลือกหมวดไหน? ใช้ <span className="font-bold underline">Switch Finder</span> ด้านบน หรือเริ่มจาก Industrial PoE / Layer 3
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Compact text-based pill tabs — max 2 rows, dark surface, with tooltip hints */}
        <TooltipProvider delayDuration={150}>
          <TabsList className="h-auto p-2 md:p-2.5 bg-foreground/95 dark:bg-background/80 border border-foreground/90 dark:border-border rounded-2xl grid grid-cols-3 sm:grid-cols-5 gap-1.5 md:gap-2 mb-6 w-full shadow-lg">
            {TABS.map((t) => {
              const count = totalModels(t.category);
              const isActive = activeTab === t.id;
              return (
                <Tooltip key={t.id}>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value={t.id}
                      className={`group relative h-auto py-2 px-2.5 md:px-3 rounded-xl border transition-all duration-200 flex items-center justify-center gap-1.5 md:gap-2 ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                          : "bg-transparent text-background dark:text-foreground border-transparent hover:bg-background/10 dark:hover:bg-foreground/5 hover:border-primary/40"
                      }`}
                      aria-label={t.title}
                    >
                      <t.icon
                        className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 ${
                          isActive ? "text-primary-foreground" : "text-primary"
                        }`}
                      />
                      <span className="text-[11px] md:text-xs font-bold leading-none truncate">
                        {t.shortTitle}
                      </span>
                      {count > 0 && (
                        <span
                          className={`hidden md:inline-flex text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? "bg-primary-foreground/25 text-primary-foreground"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[280px] text-xs p-3">
                    <div className="font-bold text-sm mb-2 flex items-center gap-1.5">
                      <t.icon className="w-3.5 h-3.5 text-primary" />
                      {t.title}
                    </div>

                    <div className="mb-2">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        เหมาะกับ
                      </div>
                      <ul className="space-y-0.5">
                        {t.useCases.map((u) => (
                          <li key={u} className="text-[11px] leading-tight flex gap-1.5">
                            <span className="text-primary">▸</span>
                            <span>{u}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-1">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        คุณสมบัติเด่น
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {t.keyFeatures.map((f) => (
                          <span
                            key={f}
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {count > 0 && (
                      <div className="mt-2 pt-2 border-t border-border text-[10px] font-mono text-primary">
                        มี {count} รุ่นในหมวดนี้
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TabsList>
        </TooltipProvider>

        {TABS.map((t) => {
          const cat = t.category;
          const subActive = activeSub[t.id] ?? cat?.subCategories[0]?.id;

          return (
            <TabsContent key={t.id} value={t.id} className="mt-0">
              <div className="card-surface p-5 md:p-7 bg-slate-200">
                {/* Category header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-5 border-b border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <t.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-display font-bold text-foreground leading-tight">
                        {t.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                {cat ? (
                  <div>
                    {/* Sub-category tabs */}
                    {cat.subCategories.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {cat.subCategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setActiveSub({ ...activeSub, [t.id]: sub.id })}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                              subActive === sub.id
                                ? "bg-primary/10 border-primary/40 text-primary"
                                : "bg-secondary/40 border-border text-foreground/70 hover:border-primary/30"
                            }`}
                          >
                            {sub.title}
                            <span className="ml-1.5 text-[10px] opacity-70 font-mono">
                              ({sub.products.length})
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Quick Filters */}
                    {(() => {
                      const tabFilters = activeFilters[t.id] ?? {};
                      const filterCount = Object.keys(tabFilters).length;
                      return (
                        <div className="mb-5 p-3 md:p-3.5 rounded-xl border border-border bg-muted/30">
                          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <Filter className="w-3.5 h-3.5 text-primary" />
                              <span className="text-xs font-semibold text-foreground">
                                กรองด่วน
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                เลือกเงื่อนไขเพื่อหารุ่นที่ตรง
                              </span>
                            </div>
                            {filterCount > 0 && (
                              <button
                                onClick={() => clearFilters(t.id)}
                                className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1"
                              >
                                <X className="w-3 h-3" /> ล้างตัวกรอง ({filterCount})
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {FILTER_GROUPS.map((g) => (
                              <div key={g.key} className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-0.5">
                                  {g.label}:
                                </span>
                                {g.options.map((o) => {
                                  const isActive = tabFilters[g.key] === o.id;
                                  return (
                                    <button
                                      key={o.id}
                                      onClick={() => toggleFilter(t.id, g.key, o.id)}
                                      className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-colors ${
                                        isActive
                                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                          : "bg-background/60 text-foreground/70 border-border hover:border-primary/40 hover:text-foreground"
                                      }`}
                                    >
                                      {o.label}
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {cat.subCategories.map((sub) =>
                      sub.id === subActive ? (
                        <div key={sub.id}>
                          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                            {sub.blurb}
                          </p>

                          {(() => {
                            const tabFilters = activeFilters[t.id] ?? {};
                            const filtered = sub.products.filter((p) => matchesFilter(p, tabFilters));
                            if (filtered.length === 0) {
                              return (
                                <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border bg-background/30">
                                  <Filter className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                                  <p className="text-sm font-semibold text-foreground mb-1">
                                    ไม่พบรุ่นที่ตรงกับตัวกรอง
                                  </p>
                                  <p className="text-xs text-muted-foreground mb-3">
                                    ลองล้างตัวกรองหรือเปลี่ยนเงื่อนไข
                                  </p>
                                  <Button variant="outline" size="sm" onClick={() => clearFilters(t.id)}>
                                    <X className="w-3.5 h-3.5 mr-1.5" /> ล้างตัวกรอง
                                  </Button>
                                </div>
                              );
                            }
                            return (
                              <>
                                {Object.keys(tabFilters).length > 0 && (
                                  <p className="text-[11px] text-muted-foreground mb-3 font-mono">
                                    แสดง {filtered.length} จาก {sub.products.length} รุ่น
                                  </p>
                                )}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                  {filtered.map((p) => {
                                    const compatIcons = getCompatibilityIcons(p);
                                    const tempStripe = getTempStripe(p);
                                    return (
                              <div
                                key={p.model}
                                className="rounded-xl border border-border bg-background/40 overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all group flex flex-col"
                              >
                                {/* Temperature stripe */}
                                {tempStripe && (
                                  <TooltipProvider delayDuration={150}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          className={`h-1.5 w-full ${tempStripe.bg} cursor-help`}
                                          aria-label={`${tempStripe.label} — ${tempStripe.range}`}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent side="top" className="text-xs">
                                        <div className="flex items-center gap-1.5">
                                          <Thermometer className="w-3 h-3" />
                                          <span className="font-bold">{tempStripe.label}</span>
                                        </div>
                                        <div className="text-[10px] opacity-80 mt-0.5">{tempStripe.range}</div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                <button
                                  type="button"
                                  onClick={() => openProduct(p, sub, t.title)}
                                  className="text-left flex-1 flex flex-col cursor-pointer"
                                  aria-label={`ดูรายละเอียด ${p.model}`}
                                >
                                  <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden relative">
                                    <img
                                      src={p.image}
                                      alt={p.model}
                                      loading="lazy"
                                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {p.details && (
                                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground shadow-sm">
                                        <Eye className="w-2.5 h-2.5" /> Detail
                                      </span>
                                    )}
                                    {/* Compatibility icons (overlay bottom-left) */}
                                    {compatIcons.length > 0 && (
                                      <TooltipProvider delayDuration={150}>
                                        <div className="absolute bottom-1.5 left-1.5 flex flex-wrap gap-1 max-w-[80%]">
                                          {compatIcons.map((c) => {
                                            const Icon = c.icon;
                                            return (
                                              <Tooltip key={c.id}>
                                                <TooltipTrigger asChild>
                                                  <span
                                                    className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-background/90 backdrop-blur border border-border shadow-sm text-foreground/80 hover:text-primary hover:border-primary/40 transition-colors"
                                                    aria-label={c.label}
                                                  >
                                                    <Icon className="w-3 h-3" />
                                                  </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="text-xs">
                                                  {c.label}
                                                </TooltipContent>
                                              </Tooltip>
                                            );
                                          })}
                                        </div>
                                      </TooltipProvider>
                                    )}
                                  </div>
                                  <div className="p-4 flex-1 flex flex-col">
                                    <div className="font-mono text-sm font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                                      {p.model}
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                                      {p.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                                      {p.features.map((f) => (
                                        <span
                                          key={f}
                                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20"
                                        >
                                          {f}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </button>

                                <div className="flex gap-1.5 px-4 pb-4 pt-3 border-t border-border">
                                  <AddToCartButton
                                    productModel={p.model}
                                    productName={`Volktek ${p.model}`}
                                    productDescription={p.description}
                                    size="sm"
                                    variant="outline"
                                    iconOnly
                                  />
                                  <QuoteRequestButton
                                    productModel={p.model}
                                    productName={`Volktek ${p.model}`}
                                    size="sm"
                                    variant="outline"
                                    iconOnly
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openProduct(p, sub, t.title)}
                                    className="ml-auto text-xs h-8"
                                  >
                                    ดูรายละเอียด <ArrowRight className="w-3 h-3 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            );
                            })}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  // Coming soon placeholder
                  <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border bg-background/30">
                    <t.icon className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                    <h4 className="text-base font-semibold text-foreground mb-1.5">
                      รายละเอียดรุ่นกำลังจะมา
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4 leading-relaxed">
                      ทีมงานกำลังเตรียมข้อมูลรุ่นในหมวดนี้ — สอบถามราคาและสเปคจากทีมเราได้ทันที
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <QuoteRequestButton
                        productModel={t.title}
                        productName={`Volktek ${t.title}`}
                        size="sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Product Detail Dialog */}
      <VolktekProductDialog
        product={selected?.product ?? null}
        subCategory={selected?.sub ?? null}
        categoryTitle={selected?.catTitle ?? ""}
        onClose={() => setSelected(null)}
        onSelect={(p) =>
          selected && setSelected({ ...selected, product: p })
        }
      />
    </section>
  );
};

export default VolktekMegaCatalog;

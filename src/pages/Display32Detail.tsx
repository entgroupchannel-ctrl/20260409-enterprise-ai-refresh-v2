import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useSearchParams, Navigate, Link } from "react-router-dom";
import {
  ArrowLeft, Download, Monitor, Cpu, Smartphone, Maximize, ShieldCheck,
  Layers, Box, MonitorSmartphone, Hand, Award, CheckCircle2, Plug,
  Ruler, Package, Settings2, Info, Sparkles, Star, Link2, Wrench,
  Briefcase, GitCompare, Printer, Puzzle, Clock, ShoppingCart,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MiniNavbar from "@/components/MiniNavbar";
import FooterCompact from "@/components/FooterCompact";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductGallery from "@/components/ProductGallery";
import ProductGalleryPortrait from "@/components/ProductGalleryPortrait";
import { X, ChevronLeft, ChevronRight, Lightbulb, Sun } from "lucide-react";
import sizeRoadmapImg from "@/assets/touchwo/size-roadmap.png";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import { DatasheetButton, hasDatasheet } from "@/components/datasheet/DatasheetButton";
import { DISPLAYS_32, DISPLAY_32_ORDER, OS_BACKGROUNDS, type Display32, type Display32Slug, type OSKey } from "@/data/displays-32";
import { DISPLAYS_43, DISPLAY_43_ORDER } from "@/data/displays-43";
import { DISPLAYS_238, DISPLAY_238_ORDER } from "@/data/displays-238";
import { DISPLAYS_27, DISPLAY_27_ORDER } from "@/data/displays-27";
import { DISPLAYS_49, DISPLAY_49_ORDER } from "@/data/displays-49";
import { DISPLAYS_55, DISPLAY_55_ORDER } from "@/data/displays-55";
import { DISPLAYS_65, DISPLAY_65_ORDER } from "@/data/displays-65";
import { DISPLAYS_75, DISPLAY_75_ORDER } from "@/data/displays-75";
import { DISPLAYS_85, DISPLAY_85_ORDER } from "@/data/displays-85";
import { DISPLAYS_86, DISPLAY_86_ORDER } from "@/data/displays-86";
import { DISPLAYS_98, DISPLAY_98_ORDER } from "@/data/displays-98";
import { DISPLAYS_156, DISPLAY_156_ORDER } from "@/data/displays-156";
import { DISPLAYS_215, DISPLAY_215_ORDER } from "@/data/displays-215";
import YouMayAlsoLike, { type SuggestedDisplay } from "@/components/displays/YouMayAlsoLike";

type GroupSize = 32 | 43 | 238 | 27 | 49 | 55 | 65 | 75 | 85 | 86 | 98 | 156 | 215;
const GROUPS: Record<GroupSize, {
  data: Record<string, Display32>;
  order: string[];
  basePath: string;
  defaultModel: string;
  label: string; // เช่น "Touch Display 32\""
  parentLink: string; // ลิงก์ "ดูรุ่นอื่น..."
}> = {
  32: {
    data: DISPLAYS_32 as Record<string, Display32>,
    order: DISPLAY_32_ORDER as unknown as string[],
    basePath: "/products/displays-32",
    defaultModel: "hd32",
    label: 'Touch Display 32"',
    parentLink: "/interactive-display",
  },
  43: {
    data: DISPLAYS_43 as Record<string, Display32>,
    order: DISPLAY_43_ORDER as unknown as string[],
    basePath: "/products/displays-43",
    defaultModel: "hd43",
    label: 'Touch Display 43"',
    parentLink: "/interactive-display",
  },
  238: {
    data: DISPLAYS_238 as Record<string, Display32>,
    order: DISPLAY_238_ORDER as unknown as string[],
    basePath: "/products/displays-23.8",
    defaultModel: "gd238c",
    label: 'Touch Display 23.8"',
    parentLink: "/interactive-display",
  },
  27: {
    data: DISPLAYS_27 as Record<string, Display32>,
    order: DISPLAY_27_ORDER as unknown as string[],
    basePath: "/products/displays-27",
    defaultModel: "hd27",
    label: 'Touch Display 27"',
    parentLink: "/interactive-display",
  },
  49: {
    data: DISPLAYS_49 as Record<string, Display32>,
    order: DISPLAY_49_ORDER as unknown as string[],
    basePath: "/products/displays-49",
    defaultModel: "hr49",
    label: 'Touch Display 49"',
    parentLink: "/interactive-display",
  },
  55: {
    data: DISPLAYS_55 as Record<string, Display32>,
    order: DISPLAY_55_ORDER as unknown as string[],
    basePath: "/products/displays-55",
    defaultModel: "hd55",
    label: 'Touch Display 55"',
    parentLink: "/interactive-display",
  },
  65: {
    data: DISPLAYS_65 as Record<string, Display32>,
    order: DISPLAY_65_ORDER as unknown as string[],
    basePath: "/products/displays-65",
    defaultModel: "hr65",
    label: 'Touch Display 65"',
    parentLink: "/interactive-display",
  },
  75: {
    data: DISPLAYS_75 as Record<string, Display32>,
    order: DISPLAY_75_ORDER as unknown as string[],
    basePath: "/products/displays-75",
    defaultModel: "rz75b",
    label: 'Touch Display 75"',
    parentLink: "/interactive-display",
  },
  85: {
    data: DISPLAYS_85 as Record<string, Display32>,
    order: DISPLAY_85_ORDER as unknown as string[],
    basePath: "/products/displays-85",
    defaultModel: "rz85b",
    label: 'Touch Display 85"',
    parentLink: "/interactive-display",
  },
  86: {
    data: DISPLAYS_86 as Record<string, Display32>,
    order: DISPLAY_86_ORDER as unknown as string[],
    basePath: "/products/displays-86",
    defaultModel: "rz86b",
    label: 'Touch Display 86"',
    parentLink: "/interactive-display",
  },
  98: {
    data: DISPLAYS_98 as Record<string, Display32>,
    order: DISPLAY_98_ORDER as unknown as string[],
    basePath: "/products/displays-98",
    defaultModel: "rz98b",
    label: 'Touch Display 98"',
    parentLink: "/interactive-display",
  },
  156: {
    data: DISPLAYS_156 as Record<string, Display32>,
    order: DISPLAY_156_ORDER as unknown as string[],
    basePath: "/products/displays-15.6",
    defaultModel: "kd156b",
    label: 'Touch Kiosk 15.6"',
    parentLink: "/interactive-display",
  },
  215: {
    data: DISPLAYS_215 as Record<string, Display32>,
    order: DISPLAY_215_ORDER as unknown as string[],
    basePath: "/products/displays-21.5",
    defaultModel: "kd215b",
    label: 'Touch Kiosk 21.5"',
    parentLink: "/interactive-display",
  },
};

const ICONS: Record<string, any> = {
  Monitor, Cpu, Smartphone, Maximize, ShieldCheck, Layers, Box,
  MonitorSmartphone, Hand, Award,
};

const ALL_SECTIONS = [
  { id: "overview",       label: "ภาพรวม",          icon: Info },
  { id: "configurations", label: "Configurations", icon: Layers },
  { id: "highlights",     label: "ไฮไลต์",           icon: Sparkles },
  { id: "features",       label: "Feature",         icon: Star },
  { id: "cpu",            label: "CPU Options",     icon: Cpu },
  { id: "peripherals",    label: "Peripherals",     icon: Printer },
  { id: "customization",  label: "Customization",   icon: Puzzle },
  { id: "specs",          label: "สเปก",             icon: Settings2 },
  { id: "dimensions",     label: "ขนาด/ติดตั้ง",     icon: Ruler },
  { id: "io",             label: "I/O Ports",       icon: Link2 },
  { id: "install",        label: "การติดตั้ง",       icon: Wrench },
  { id: "use-cases",      label: "Use Cases",       icon: Briefcase },
  { id: "compare",        label: "เปรียบเทียบ",      icon: GitCompare },
  { id: "download",       label: "Datasheet",       icon: Download },
];

// กลุ่มสินค้าที่ไม่แสดง Datasheet (ซ่อนแหล่งที่มา OEM)
const HIDE_DATASHEET_GROUPS: GroupSize[] = [156, 215];

// กลุ่ม KIOSK ที่มีรุ่นย่อย Monitor / Windows-x86 / Android — แสดงตารางเปรียบเทียบ Variant
const KIOSK_GROUP_SIZES: GroupSize[] = [156, 215, 238];

interface Props { groupSize?: GroupSize }
const Display32Detail = ({ groupSize = 32 }: Props) => {
  const group = GROUPS[groupSize];
  const { model } = useParams<{ model?: string }>();
  const [params, setParams] = useSearchParams();
  const rawRequested = (model ?? params.get("model") ?? group.defaultModel) as string;
  // Backward-compat: รวม HR32 Android เข้ากับ HR32 Series แล้ว
  const requested = (rawRequested === "hr32-android" ? "hr32" : rawRequested);
  const product = group.data[requested];

  const [activeSection, setActiveSection] = useState("overview");
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const hideDatasheet = HIDE_DATASHEET_GROUPS.includes(groupSize);
  const shopSlug =
    groupSize === 156 ? "displays-15.6" :
    groupSize === 215 ? "displays-21.5" :
    groupSize === 32 ? "displays-32" :
    groupSize === 43 ? "displays-43" : null;
  const SECTIONS = useMemo(
    () => ALL_SECTIONS.filter(s => {
      if (s.id === "dimensions") return (product?.dimensionDrawings?.length ?? 0) > 0;
      if (s.id === "configurations") return (product?.variants?.length ?? 0) > 0;
      if (s.id === "cpu") return (product?.cpuOptions?.length ?? 0) > 0;
      if (s.id === "peripherals") return (product?.peripherals?.length ?? 0) > 0;
      if (s.id === "customization") return (product?.customizationOptions?.length ?? 0) > 0;
      if (s.id === "io") return !!product?.ioImage && (product?.ports?.length ?? 0) > 0;
      if (s.id === "download") return !hideDatasheet;
      return true;
    }),
    [product, hideDatasheet]
  );

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: [0, 0.2, 0.5] }
    );
    SECTIONS.forEach(s => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [requested]);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const switchModel = (s: string) => {
    setParams({ model: s });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // สร้างรายการ "รุ่นที่คุณอาจชอบ" — เลือก default model จากแต่ละขนาดในตระกูล Interactive Display
  const suggestions = useMemo<SuggestedDisplay[]>(() => {
    const sizeMap: Record<number, string> = {
      156: '15.6"', 215: '21.5"', 238: '23.8"', 27: '27"', 32: '32"',
      43: '43"', 49: '49"', 55: '55"', 65: '65"', 75: '75"',
      85: '85"', 86: '86"', 98: '98"',
    };
    const out: SuggestedDisplay[] = [];
    (Object.keys(GROUPS) as unknown as GroupSize[]).forEach((g) => {
      const size = Number(g) as GroupSize;
      if (size === groupSize) return;
      const cfg = GROUPS[size];
      const p = cfg.data[cfg.defaultModel];
      if (!p) return;
      out.push({
        sizeLabel: sizeMap[size] ?? `${size}"`,
        sizeNumeric: size,
        href: `${cfg.basePath}?model=${cfg.defaultModel}`,
        product: p,
        formFactor: p.formFactor,
      });
    });
    return out;
  }, [groupSize]);

  if (!product) return <Navigate to={group.basePath} replace />;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.name} | จอสัมผัส ${groupSize} นิ้ว — ENT Group`}
        description={product.tagline}
        path={`${group.basePath}?model=${product.slug}`}
      />
      <BreadcrumbJsonLd items={[
        { name: group.label, path: group.basePath },
        { name: product.shortName, path: `${group.basePath}?model=${product.slug}` },
      ]}/>

      <MiniNavbar />

      {/* Breadcrumb + Series Nav (สอดคล้องกับ TouchWork Series) */}
      <section className="border-b border-border">
        <div className="container max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition">หน้าหลัก</Link>
            <span>/</span>
            <Link to={group.parentLink} className="hover:text-primary transition">{group.label}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{product.modelCode}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-stretch gap-3">
            <Link
              to={group.parentLink}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all text-sm font-bold shrink-0"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              ดูรุ่นอื่นใน {group.label} ทั้งหมด
              <Monitor size={14} className="opacity-60" />
            </Link>

            {/* B2B Platform mini-banner — กระตุ้นให้เพิ่มลงตะกร้า/ขอใบเสนอราคา */}
            {(() => {
              const shopSlug =
                groupSize === 156 ? "displays-15.6" :
                groupSize === 215 ? "displays-21.5" :
                groupSize === 32 ? "displays-32" :
                groupSize === 43 ? "displays-43" : null;
              const hasShop = shopSlug !== null;
              const linkTo = hasShop ? `/shop/${shopSlug}` : "/request-quote";
              const ctaLabel = hasShop ? "หยิบใส่ตะกร้า" : "ขอใบเสนอราคา";
              const description = hasShop
                ? "สั่งซื้อออนไลน์ผ่าน Shop → แอดมินช่วยปรับสเปก/ใบเสนอราคาให้จนลงตัว"
                : "เพิ่มสินค้าหลายรายการ → ขอใบเสนอราคารวม รับส่วนลดองค์กร";
              return (
                <Link
                  to={linkTo}
                  className="group relative flex-1 min-w-0 hidden md:flex items-center gap-3 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/50 hover:from-primary/15 transition-all"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/15 text-primary shrink-0">
                    <Briefcase size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                      <Sparkles size={11} />
                      B2B Platform
                    </div>
                    <p className="text-xs text-foreground/80 leading-tight truncate">
                      {description}
                    </p>
                  </div>
                  <div className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold shrink-0 group-hover:gap-2 transition-all">
                    {ctaLabel}
                    <ArrowLeft size={12} className="rotate-180" />
                  </div>
                </Link>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Top bar with model tabs */}
      <div className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto px-6 py-3">
          {/* Model tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {group.order.map((s) => {
              const m = group.data[s];
              const active = s === requested;
              return (
                <button
                  key={s}
                  onClick={() => switchModel(s)}
                  className={`shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all border ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span className="font-bold">{m.modelCode}</span>
                  <span className="hidden sm:inline ml-1.5 opacity-80">· {m.formFactor}</span>
                </button>
              );
            })}
            {/* Accessories cross-link — filtered by current screen size */}
            <Link
              to={`/accessories?size=${groupSize === 238 ? "23.8" : groupSize === 156 ? "15.6" : groupSize === 215 ? "21.5" : groupSize}`}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all border border-dashed border-primary/40 text-primary hover:bg-primary/10 hover:border-primary"
            >
              <Package className="h-3.5 w-3.5" />
              <span className="font-bold">Accessories</span>
              <span className="hidden sm:inline opacity-80">· ขาตั้ง / ขายึด</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky section nav (TouchWork-style chips) */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="container max-w-7xl mx-auto px-6 py-2">
          <div className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-lg">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="container max-w-7xl mx-auto px-6 py-8 space-y-16">
        {/* Hero / Overview */}
        <section
          id="overview"
          ref={el => (sectionRefs.current.overview = el)}
          className={`grid grid-cols-1 ${
            product.formFactor.includes("Kiosk")
              ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
              : "lg:grid-cols-2"
          } gap-8 items-start scroll-mt-32`}
        >
          <div className="rounded-2xl border border-border bg-card p-4">
            {product.formFactor.includes("Kiosk") ? (
              <ProductGalleryPortrait
                images={product.gallery}
                alt={product.name}
                captions={product.galleryCaptions}
                onImageClick={(i) => setLightbox({ images: product.gallery, index: i })}
              />
            ) : (
              <ProductGallery
                images={product.gallery}
                alt={product.name}
                captions={product.galleryCaptions}
                onImageClick={(i) => setLightbox({ images: product.gallery, index: i })}
              />
            )}
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">{product.modelCode}</Badge>
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant="outline">{product.formFactor}</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.tagline}</p>
            <p className="text-base leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <QuickStat label="ความละเอียด" value={product.quick.resolution} />
              <QuickStat label="ความสว่าง" value={product.quick.brightness} />
              <QuickStat label="Touch" value={product.quick.touch} />
              <QuickStat label="ติดตั้ง" value={product.quick.install} />
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <QuoteRequestButton
                productName={product.name}

              />
              {shopSlug && (
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20">
                  <Link to={`/shop/${shopSlug}`}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    หยิบใส่ตะกร้า
                  </Link>
                </Button>
              )}
              {!hideDatasheet && (
                hasDatasheet(product.modelCode) ? (
                  <DatasheetButton
                    productModel={product.modelCode}
                    variant="default"
                    size="default"
                    fullWidth={false}
                  />
                ) : (
                  <Button variant="outline" asChild>
                    <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" /> Datasheet
                    </a>
                  </Button>
                )
              )}
              {product.dimensionUrl && (
                <Button variant="outline" asChild>
                  <a href={product.dimensionUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" /> Dimension Drawing
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section
          id="highlights"
          ref={el => (sectionRefs.current.highlights = el)}
          className="scroll-mt-32"
        >
          <SectionTitle eyebrow="Highlights" title="จุดเด่นของรุ่นนี้" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.highlights.map((h, i) => {
              const Icon = ICONS[h.icon] ?? Monitor;
              return (
                <div key={i} className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-semibold text-sm">{h.title}</div>
                  {h.subtitle && <div className="text-xs text-muted-foreground mt-1">{h.subtitle}</div>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Configurations — สำหรับซีรีส์ที่หน้าจอเดียวกันแต่เลือก OS/Hardware ได้หลายแบบ (HR32) */}
        {product.variants && product.variants.length > 0 && (
          <section
            id="configurations"
            ref={el => (sectionRefs.current.configurations = el)}
            className="scroll-mt-32"
          >
            <SectionTitle
              eyebrow="Configurations"
              title={`หน้าจอ ${params.size || "98"}" แบบเดียวกัน — เลือก Configuration ได้ 3 แบบ`}
            />
            <p className="text-sm text-muted-foreground mb-6 -mt-2 max-w-3xl">
              โครงสร้างภายนอก (ขนาด, น้ำหนัก, ระบบสัมผัส PCAP 10 จุด, จอ FHD 300 nit, Vandal-Proof) เหมือนกันทั้ง 3 รุ่น —
              ต่างกันที่ <strong>ภายใน</strong> เท่านั้น เลือกได้เหมือนเลือกสเปก PC: จะใช้เป็นแค่จอสัมผัส, หรือเพิ่ม Windows/Linux PC, หรือเพิ่ม Android PC ก็ได้
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {product.variants.map((v) => {
                const VIcon = ICONS[v.icon] ?? Monitor;
                const isCurrent = v.targetSlug === product.slug;
                const accentClass =
                  v.accent === "primary"
                    ? "ring-2 ring-primary/40 shadow-lg"
                    : v.accent === "secondary"
                      ? "ring-1 ring-secondary"
                      : "";
                const headerClass =
                  v.accent === "primary"
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                    : v.accent === "secondary"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground";
                const bgImage = v.osBackground && v.osBackground !== "none"
                  ? OS_BACKGROUNDS[v.osBackground as OSKey]?.src
                  : undefined;
                return (
                  <div
                    key={v.key}
                    className={`relative rounded-2xl border bg-card overflow-hidden flex flex-col ${accentClass}`}
                  >
                    {isCurrent && (
                      <div className="absolute top-3 right-3 z-10 text-[10px] font-bold uppercase tracking-wider bg-foreground text-background px-2 py-1 rounded-full">
                        กำลังดูอยู่
                      </div>
                    )}
                    <div className={`relative px-5 py-5 border-b overflow-hidden ${headerClass}`}>
                      {bgImage && (
                        <>
                          <img
                            src={bgImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-25"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />
                        </>
                      )}
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-9 w-9 rounded-lg bg-background/20 backdrop-blur flex items-center justify-center">
                            <VIcon className="h-5 w-5" />
                          </div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
                            {v.badge}
                          </div>
                        </div>
                        <div className="font-bold text-lg leading-tight">{v.label}</div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-sm leading-relaxed mb-4">{v.description}</p>
                      <div className="rounded-lg bg-muted/40 px-3 py-2 mb-4">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">เหมาะกับ</div>
                        <div className="text-xs font-medium mt-0.5">{v.bestFor}</div>
                      </div>
                      {(v.cpu || v.ram || v.storage) && (
                        <dl className="grid grid-cols-3 gap-1 mb-4 text-[11px]">
                          {v.cpu && (
                            <div className="rounded border border-border/60 px-2 py-1.5">
                              <dt className="text-muted-foreground">CPU</dt>
                              <dd className="font-semibold leading-tight mt-0.5 truncate" title={v.cpu}>{v.cpu}</dd>
                            </div>
                          )}
                          {v.ram && (
                            <div className="rounded border border-border/60 px-2 py-1.5">
                              <dt className="text-muted-foreground">RAM</dt>
                              <dd className="font-semibold leading-tight mt-0.5">{v.ram}</dd>
                            </div>
                          )}
                          {v.storage && (
                            <div className="rounded border border-border/60 px-2 py-1.5">
                              <dt className="text-muted-foreground">Storage</dt>
                              <dd className="font-semibold leading-tight mt-0.5">{v.storage}</dd>
                            </div>
                          )}
                        </dl>
                      )}
                      <ul className="space-y-1.5 mb-5 flex-1">
                        {v.highlights.map((h, hi) => (
                          <li key={hi} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="leading-snug">{h}</span>
                          </li>
                        ))}
                      </ul>
                      {v.targetSlug && !isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => switchModel(v.targetSlug as Display32Slug)}
                        >
                          ดูสเปก {v.label.split("—")[1]?.trim() ?? "รุ่นนี้"}
                        </Button>
                      )}
                      {isCurrent && (
                        <div className="text-center text-[11px] text-muted-foreground py-2">
                          ↓ เลื่อนลงเพื่อดูสเปกฉบับเต็ม
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-foreground/80 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>คำแนะนำ:</strong> ถ้ามี PC อยู่แล้ว เลือก <em>Touch Monitor</em> ประหยัดที่สุด —
                ถ้าใช้ซอฟต์แวร์ Windows-based ที่มีอยู่ เลือก <em>Windows PC</em> —
                ถ้าทำ Digital Signage / Self-service ที่ใช้ Android App เลือก <em>Android PC</em> ราคาคุ้มค่ากว่า
              </span>
            </div>
          </section>
        )}

        {/* Features */}
        <section
          id="features"
          ref={el => (sectionRefs.current.features = el)}
          className="scroll-mt-32"
        >
          <SectionTitle eyebrow="Features" title="คุณสมบัติเด่น" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <ul className="space-y-3">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
            {product.osSupport.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  ระบบปฏิบัติการที่รองรับ
                </div>
                <div className={`grid gap-3 ${product.osSupport.length === 1 ? "grid-cols-1" : product.osSupport.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
                  {product.osSupport.map((os) => {
                    const meta = OS_BACKGROUNDS[os];
                    return (
                      <div
                        key={os}
                        className="relative rounded-xl overflow-hidden border border-border group hover:shadow-lg transition-shadow"
                      >
                        <img
                          src={meta.src}
                          alt={`${meta.label} OS background`}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          width={1280}
                          height={800}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <div className="font-bold text-lg leading-tight">{meta.label}</div>
                          <div className="text-[11px] opacity-90 mt-0.5 leading-snug">{meta.subtitle}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Compact info chips — moved out of features list to keep it concise */}
                <div className="space-y-2.5 pt-2">
                  <div className="rounded-lg border border-border bg-card px-3 py-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Pre-installed OS
                    </div>
                    <div className="text-xs font-medium leading-snug">
                      Windows 10 / 11 · Linux Ubuntu · Android 9 / 11 / 12 (เลือกได้จากโรงงาน)
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-card px-3 py-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      POS Software รองรับ
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Square POS", "Stripe POS", "Clover POS", "Shopify POS"].map((p) => (
                        <span key={p} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <div className="text-xs">
                      <span className="font-semibold">Proven Reliability:</span>{" "}
                      <span className="text-muted-foreground">อัตราซ่อม 2 ปีต่ำเพียง 1.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CPU Configurations — for AIO PC models with multiple CPU tiers */}
        {product.cpuOptions && product.cpuOptions.length > 0 && (
          <section
            id="cpu"
            ref={el => (sectionRefs.current.cpu = el)}
            className="scroll-mt-32"
          >
            <SectionTitle
              eyebrow={product.variants && product.variants.length > 0 ? "CPU Options · Windows/Linux Variant" : "CPU Configurations"}
              title={product.variants && product.variants.length > 0
                ? "เลือก CPU ได้ 3 ระดับ (สำหรับรุ่น Windows / Linux)"
                : "เลือก CPU ได้ 3 ระดับตามความต้องการ"}
            />
            <p className="text-sm text-muted-foreground mb-6 -mt-2">
              {product.variants && product.variants.length > 0
                ? "สเปก CPU ด้านล่างใช้กับรุ่น Windows/Linux (x86) — ถ้าเลือกรุ่น Android (ARM) จะใช้ Rockchip RK3568/3288/3588 แทน (ดูรายละเอียดในหัวข้อ Configurations ด้านบน)"
                : "รุ่นเดียวกัน — ปรับสเปก PC ภายในให้เหมาะกับงาน ตั้งแต่ POS ทั่วไป จนถึงงาน Industrial / AI Workstation"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {product.cpuOptions.map((opt, i) => {
                const tierColor =
                  opt.tier === "Entry"
                    ? "bg-muted text-muted-foreground border-border"
                    : opt.tier === "Mid"
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary";
                const ringColor = opt.tier === "High" ? "ring-2 ring-primary/40 shadow-lg" : "";
                return (
                  <div
                    key={i}
                    className={`relative rounded-2xl border bg-card overflow-hidden flex flex-col ${ringColor}`}
                  >
                    {opt.tier === "Mid" && (
                      <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        Recommended
                      </div>
                    )}
                    <div className={`px-5 py-4 border-b ${tierColor}`}>
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
                        {opt.tier === "Entry" ? "Entry Level" : opt.tier === "Mid" ? "Mid Range" : "High Performance"}
                      </div>
                      <div className="font-bold text-base mt-1 leading-tight">{opt.cpu}</div>
                    </div>
                    <dl className="divide-y divide-border/60 text-sm flex-1">
                      <div className="px-5 py-3 grid grid-cols-3 gap-2">
                        <dt className="text-muted-foreground col-span-1 flex items-center gap-1.5">
                          <Cpu className="h-3.5 w-3.5" /> GPU
                        </dt>
                        <dd className="font-medium col-span-2">{opt.gpu}</dd>
                      </div>
                      <div className="px-5 py-3 grid grid-cols-3 gap-2">
                        <dt className="text-muted-foreground col-span-1">RAM</dt>
                        <dd className="font-medium col-span-2">{opt.ram}</dd>
                      </div>
                      <div className="px-5 py-3 grid grid-cols-3 gap-2">
                        <dt className="text-muted-foreground col-span-1">Storage</dt>
                        <dd className="font-medium col-span-2">{opt.storage}</dd>
                      </div>
                      <div className="px-5 py-3">
                        <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">เหมาะกับงาน</dt>
                        <dd className="text-sm leading-relaxed">{opt.targetUseCase}</dd>
                      </div>
                    </dl>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              * ทุกรุ่นมาพร้อม Network 10/100/1000M RJ45 + Wi-Fi 802.11ac และเลือกติดตั้ง Windows 10/11 หรือ Linux จากโรงงานได้ตามต้องการ
            </p>
          </section>
        )}

        {/* Built-in Peripherals — printer / scanner / RFID etc. */}
        {product.peripherals && product.peripherals.length > 0 && (
          <section
            id="peripherals"
            ref={el => (sectionRefs.current.peripherals = el)}
            className="scroll-mt-32"
          >
            <SectionTitle
              eyebrow="Built-in Peripherals"
              title="อุปกรณ์ต่อพ่วงในตัวเครื่อง"
            />
            <p className="text-sm text-muted-foreground mb-6 -mt-2">
              ตัวเครื่องมาพร้อม Thermal Printer, Barcode Scanner และ RFID Card Reader ติดตั้งจากโรงงาน — พร้อมใช้งาน POS / จองคิว / สมาชิก ทันทีไม่ต้องต่ออุปกรณ์ภายนอก
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {product.peripherals.map((p, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col group hover:shadow-lg hover:border-primary/40 transition-all">
                  <div className="h-36 bg-gradient-to-br from-muted/40 to-muted/10 flex items-center justify-center p-4 border-b border-border">
                    <img
                      src={p.image}
                      alt={`${p.name} ${p.model}`}
                      className="max-h-24 max-w-[60%] object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <Printer className="h-4 w-4 text-primary" />
                      <h3 className="font-bold text-base">{p.name}</h3>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3 font-mono">
                      Model: <span className="text-foreground font-semibold">{p.model}</span>
                    </div>
                    {p.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.description}</p>
                    )}
                    <dl className="divide-y divide-border/60 text-xs mt-auto border-t border-border/60">
                      {p.specs.map((s) => (
                        <div key={s.label} className="grid grid-cols-5 gap-2 py-1.5">
                          <dt className="col-span-2 text-muted-foreground">{s.label}</dt>
                          <dd className="col-span-3 font-medium">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Customization Options — add-on modules */}
        {product.customizationOptions && product.customizationOptions.length > 0 && (
          <section
            id="customization"
            ref={el => (sectionRefs.current.customization = el)}
            className="scroll-mt-32"
          >
            <SectionTitle
              eyebrow="Customization"
              title="ปรับแต่งตามการใช้งานของคุณ"
            />
            <p className="text-sm text-muted-foreground mb-4 -mt-2">
              เพิ่มโมดูลเสริมตามลักษณะธุรกิจ — Fingerprint, Face Camera, NFC Payment, 4G LTE, Battery UPS และอื่น ๆ ทีมวิศวกรของเรารับออกแบบและประกอบให้จากโรงงาน
            </p>
            {product.customizationLeadTime && (
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
                <Clock className="h-3.5 w-3.5" />
                {product.customizationLeadTime}
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {product.customizationOptions.map((opt, i) => (
                <div
                  key={i}
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="h-44 sm:h-48 bg-gradient-to-br from-muted/30 to-background flex items-center justify-center p-4 border-b border-border/60">
                    <img
                      src={opt.image}
                      alt={opt.name}
                      className="max-h-40 sm:max-h-44 max-w-[88%] object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <div className="font-semibold text-sm text-foreground">{opt.name}</div>
                    {opt.description && (
                      <div className="text-[11px] text-muted-foreground mt-1 leading-snug line-clamp-2">{opt.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 text-center">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                ต้องการปรับแต่งตามสเปกของคุณ?
              </h3>
              <p className="text-sm text-muted-foreground mt-2 mb-5 max-w-xl mx-auto">
                ทีมวิศวกรพร้อมออกแบบ Configuration เฉพาะธุรกิจของคุณ — ระบุโมดูลที่ต้องการแล้วขอใบเสนอราคาได้ทันที
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <QuoteRequestButton
                  productModel={product.modelCode}
                  productName={`${product.name} — ปรับแต่ง`}
                  variant="default"
                  size="lg"
                  className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow text-base px-10"
                />
                {shopSlug && (
                  <Button asChild size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground text-base px-8">
                    <Link to={`/shop/${shopSlug}`}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      หยิบใส่ตะกร้า
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Specs */}
        <section
          id="specs"
          ref={el => (sectionRefs.current.specs = el)}
          className="scroll-mt-32"
        >
          <SectionTitle eyebrow="Specifications" title="สเปกฉบับเต็ม" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {product.specs.map((g, gi) => (
              <div key={gi} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">{g.title}</h3>
                </div>
                <dl className="divide-y divide-border/60">
                  {g.rows.map((r) => (
                    <div key={r.label} className="grid grid-cols-5 gap-2 px-4 py-2.5 text-sm hover:bg-muted/30">
                      <dt className="col-span-2 text-muted-foreground">{r.label}</dt>
                      <dd className="col-span-3 font-medium">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* Dimensions / Mechanical Drawing */}
        {product.dimensionDrawings && product.dimensionDrawings.length > 0 && (
          <section
            id="dimensions"
            ref={el => (sectionRefs.current.dimensions = el)}
            className="scroll-mt-32"
          >
            <SectionTitle eyebrow="Dimensions" title="ขนาดและการติดตั้งทางวิศวกรรม" />
            <p className="text-sm text-muted-foreground -mt-2 mb-6 max-w-2xl">
              แบบทางวิศวกรรมจากผู้ผลิต — ใช้สำหรับวางแผนพื้นที่ติดตั้ง เลือกขายึด VESA และเดินสายไฟ/สาย LAN ก่อนหน้างานจริง
            </p>
            <div className="space-y-8">
              {product.dimensionDrawings.map((d, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-6 rounded-2xl border border-border bg-card p-4 sm:p-6"
                >
                  <button
                    type="button"
                    onClick={() => setLightbox({ images: product.dimensionDrawings!.map(x => x.image), index: i })}
                    className="rounded-xl bg-white p-3 sm:p-4 border border-border/60 cursor-zoom-in hover:border-primary/40 transition-colors"
                  >
                    <img
                      src={d.image}
                      alt={`${product.modelCode} — ${d.title}`}
                      className="w-full h-auto object-contain max-h-[420px] mx-auto"
                      loading="lazy"
                    />
                  </button>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                        <Ruler className="h-3.5 w-3.5" /> Drawing {i + 1}
                      </div>
                      <h3 className="text-lg font-bold">{d.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{d.caption}</p>
                    </div>
                    {d.callouts && (
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {d.callouts.map((c, j) => (
                          <div key={j} className="rounded-lg border border-border/60 bg-background/50 p-3">
                            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{c.label}</dt>
                            <dd className="text-sm font-bold text-foreground mt-0.5">{c.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-foreground/80 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  ทุกค่าตามมาตรฐานโรงงาน (หน่วย mm) — ENT Group มีบริการสำรวจหน้างานและจัดทำแบบติดตั้ง (Shop Drawing) ก่อนส่งมอบทุกโครงการ
                </span>
              </div>
            </div>
          </section>
        )}

        {/* I/O */}
        {product.ioImage && product.ports.length > 0 && (
        <section
          id="io"
          ref={el => (sectionRefs.current.io = el)}
          className="scroll-mt-32"
        >
          <SectionTitle eyebrow="Interface I/O" title="พอร์ตเชื่อมต่อ" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4">
              <button
                onClick={() => setLightbox({ images: [product.ioImage], index: 0 })}
                className="block w-full"
              >
                <img src={product.ioImage} alt={`${product.modelCode} I/O`} className="w-full h-auto object-contain rounded-lg" loading="lazy" />
              </button>
            </div>
            <div className="lg:col-span-2 space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <Plug className="h-4 w-4 text-primary" /> รายการพอร์ต
              </h3>
              {product.ports.map((p, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary/70 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Installation */}
        <section
          id="install"
          ref={el => (sectionRefs.current.install = el)}
          className="scroll-mt-32"
        >
          <SectionTitle
            eyebrow={product.installSection?.eyebrow ?? "Installation"}
            title={product.installSection?.title ?? "ตัวเลือกการติดตั้ง"}
          />
          {product.installImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.installImages.map((src, i) => {
                const cap = product.installCaptions?.[i];
                return (
                  <button
                    key={i}
                    onClick={() => setLightbox({ images: product.installImages, index: i })}
                    className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow text-left flex flex-col"
                  >
                    <img src={src} alt={cap?.title ?? `${product.modelCode} install ${i+1}`} className="w-full aspect-square object-cover" loading="lazy" />
                    <div className="px-3 py-2.5 space-y-1">
                      <div className="text-sm font-semibold text-foreground">
                        {cap?.title ?? (i === 0 ? "​ขาจับแบบ VESA Mouting" : i === 1 ? "​ขาตั้งพื้น" : i === 2 ? "แบบ Drawing" : `ขั้นตอน ${i+1}`)}
                      </div>
                      {cap?.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">{cap.description}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
              รูปแบบการติดตั้ง: <span className="font-semibold text-foreground">{product.quick.install}</span> — ติดต่อทีมงานเพื่อขอคำแนะนำการติดตั้งเฉพาะหน้างาน
            </div>
          )}
        </section>

        {/* Use cases */}
        <section
          id="use-cases"
          ref={el => (sectionRefs.current["use-cases"] = el)}
          className="scroll-mt-32"
        >
          <SectionTitle eyebrow="Use Cases" title="เหมาะสำหรับการใช้งาน" />

          {product.useCaseScenarios && product.useCaseScenarios.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {product.useCaseScenarios.map((sc, i) => (
                  <article
                    key={i}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={sc.image}
                        alt={sc.title}
                        loading="lazy"
                        width={1024}
                        height={768}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-semibold text-foreground tracking-wide">
                        {String(i + 1).padStart(2, "0")} · USE CASE
                      </div>
                      <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold text-lg sm:text-xl drop-shadow">
                        {sc.title}
                      </h3>
                    </div>
                    <div className="p-4 sm:p-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {sc.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {product.useCases.map((u, i) => (
                  <Badge key={i} variant="secondary" className="text-xs py-1.5 px-3">{u}</Badge>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {product.useCases.map((u, i) => (
                <Badge key={i} variant="secondary" className="text-sm py-2 px-4">{u}</Badge>
              ))}
            </div>
          )}
        </section>

        {/* Versatile Sizes Roadmap — แสดงเฉพาะกลุ่ม 55" */}
        {groupSize === 55 && (
          <section className="scroll-mt-32">
            <SectionTitle eyebrow="Size Roadmap" title="Versatile Options, Tailored for You" />
            <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
              <div className="grid lg:grid-cols-5 gap-0">
                {/* Image */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-950 p-6 sm:p-8 flex items-center justify-center">
                  <img
                    src={sizeRoadmapImg}
                    alt='Touch Display size roadmap — 32" to 85" with Windows desktop background'
                    loading="lazy"
                    className="w-full h-auto object-contain"
                    width={1280}
                    height={853}
                  />
                </div>
                {/* Copy */}
                <div className="lg:col-span-2 p-6 sm:p-10 flex flex-col justify-center">
                  <p className="text-sm text-muted-foreground mb-4">เลือกขนาดได้ตามการใช้งาน</p>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 leading-tight">
                    7 ขนาดมาตรฐาน <span className="text-primary">32" – 85"</span>
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <Maximize className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">
                        <strong>Available in sizes from 32″ to 85″</strong> — รองรับทุกสภาพแวดล้อมการติดตั้ง ตั้งแต่หน้าเคาน์เตอร์เล็กไปจนถึง Boardroom ขนาดใหญ่
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">
                        <strong>Ideal for a wide range of applications</strong> — ตั้งแต่ห้องเรียน Smart Classroom, Retail / POS, ห้องประชุมองค์กร ไปจนถึง Public Signage
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Layers className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">
                        <strong>Multiple system options</strong> — เลือกระบบได้ทั้ง Touch Monitor, Windows x86 (J6412/i5/i7) และ Android (RK3568/3288/3588) ตามความเหมาะสมของแต่ละ Use Case
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Sun className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">
                        <strong>Anti-glare technology</strong> — ผิวหน้ากระจกตัดแสงสะท้อน ใช้งานสัมผัสได้แม่นยำแม้ในพื้นที่แสงจ้า เช่น ใกล้หน้าต่าง หรือใต้ Spotlight
                      </span>
                    </li>
                  </ul>
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      * ขนาดที่นำเสนอ: 32" / 43" / 49" / 55" / 65" / 75" / 85" — ติดต่อทีมขายเพื่อสอบถามรุ่น 75" / 85" สำหรับโครงการขนาดใหญ่
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Variant Comparison — เฉพาะกลุ่ม KIOSK ที่มี Monitor / x86 / Android ในรุ่นเดียว */}
        {KIOSK_GROUP_SIZES.includes(groupSize) && product.variants && product.variants.length >= 2 && (
          <section className="scroll-mt-32">
            <SectionTitle
              eyebrow="Variant Comparison"
              title={`เลือก Configuration: ${product.modelCode}`}
              subtitle="เปรียบเทียบสเปกระหว่างรุ่นย่อย Monitor / Windows-x86 / Android — ตัวเครื่องเดียวกัน เลือกตามซอฟต์แวร์และงบประมาณ"
            />
            <VariantComparisonTable variants={product.variants} />
          </section>
        )}

        {/* Comparison */}
        <section
          id="compare"
          ref={el => (sectionRefs.current.compare = el)}
          className="scroll-mt-32"
        >
          <SectionTitle eyebrow="Comparison" title={`เปรียบเทียบรุ่นในหมวด ${groupSize} นิ้ว`} />
          <ComparisonTable activeSlug={requested} onSwitch={switchModel} data={group.data} order={group.order} />
        </section>

        {/* Datasheet CTA — ซ่อนสำหรับกลุ่มที่ไม่ต้องการเปิดเผยแหล่งที่มา */}
        {!hideDatasheet && (
        <section
          id="download"
          ref={el => (sectionRefs.current.download = el)}
          className="scroll-mt-32"
        >
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">สนใจ {product.modelCode}?</h2>
            <p className="text-muted-foreground mb-6">
              ดาวน์โหลดเอกสารฉบับเต็มสำหรับฝ่ายจัดซื้อและทีมวิศวกร
              {product.dimensionUrl && " — มีทั้ง Datasheet และแบบเขียนทางวิศวกรรม (Mechanical Dimension)"}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" /> ดาวน์โหลด Datasheet (PDF)
                </a>
              </Button>
              {product.dimensionUrl && (
                <Button asChild size="lg" variant="secondary">
                  <a href={product.dimensionUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" /> ดาวน์โหลด Mechanical Dimension (PDF)
                  </a>
                </Button>
              )}
              <QuoteRequestButton
                productName={product.name}
              />
            </div>
            {product.dimensionUrl && (
              <p className="text-xs text-muted-foreground mt-4">
                Datasheet — สเปกฉบับเต็ม 4 หน้า  ·  Mechanical Dimension — แบบเขียน A3 ความละเอียดสูง พร้อม Legend และหน่วย mm
              </p>
            )}
          </div>
        </section>
        )}
      </main>

      <YouMayAlsoLike
        currentSizeNumeric={groupSize}
        candidates={suggestions}
        browseAllHref="/interactive-display"
      />

      <FooterCompact />


      {lightbox && (
        <SimpleLightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

const SectionTitle = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <div className="mb-6">
    <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">{eyebrow}</div>
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
    {subtitle && <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{subtitle}</p>}
  </div>
);

const QuickStat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-border bg-card px-3 py-2.5">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="text-sm font-semibold mt-0.5 leading-tight">{value}</div>
  </div>
);

type Variant = NonNullable<Display32["variants"]>[number];

const VARIANT_ICONS: Record<string, typeof Monitor> = {
  monitor: Monitor,
  x86: Cpu,
  android: Smartphone,
};

const VariantComparisonTable = ({ variants }: { variants: Variant[] }) => {
  const [activeKey, setActiveKey] = useState<string>(variants[0]?.key ?? "");
  const active = variants.find(v => v.key === activeKey) ?? variants[0];

  const rows: { label: string; get: (v: Variant) => string | undefined }[] = [
    { label: "Form Factor / Badge", get: v => v.badge },
    { label: "CPU", get: v => v.cpu ?? "—" },
    { label: "RAM", get: v => v.ram ?? "—" },
    { label: "Storage", get: v => v.storage ?? "—" },
    { label: "ระบบปฏิบัติการ", get: v => {
        if (v.osBackground === "windows") return "Windows 10 / 11 / Linux";
        if (v.osBackground === "android") return "Android (เลือกได้)";
        return "ไม่มี OS (ต่อ PC ภายนอก)";
      } },
    { label: "เหมาะกับ", get: v => v.bestFor },
  ];

  return (
    <div className="space-y-6">
      {/* Selector chips */}
      <div className="flex flex-wrap gap-2">
        {variants.map(v => {
          const Icon = VARIANT_ICONS[v.key] ?? Layers;
          const isActive = v.key === active.key;
          return (
            <button
              key={v.key}
              onClick={() => setActiveKey(v.key)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <Icon className="h-4 w-4" />
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Active variant detail */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-5">
        <div className="flex items-start gap-3 mb-3">
          <Badge variant="secondary">{active.badge}</Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{active.description}</p>
        {active.highlights && active.highlights.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {active.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="text-left px-4 py-3 font-semibold w-44">รายการ</th>
              {variants.map(v => {
                const Icon = VARIANT_ICONS[v.key] ?? Layers;
                const isActive = v.key === active.key;
                return (
                  <th key={v.key} className={`text-left px-4 py-3 font-semibold ${isActive ? "bg-primary/10 text-primary" : ""}`}>
                    <button onClick={() => setActiveKey(v.key)} className="text-left hover:underline">
                      <div className="flex items-center gap-2 font-bold">
                        <Icon className="h-4 w-4" />
                        {v.key === "monitor" ? "Monitor" : v.key === "x86" ? "Windows / x86" : v.key === "android" ? "Android" : v.label}
                      </div>
                      <div className="text-[11px] font-normal opacity-70 mt-0.5">{v.badge}</div>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border/60 hover:bg-muted/20 align-top">
                <td className="px-4 py-2.5 text-muted-foreground font-medium">{r.label}</td>
                {variants.map(v => {
                  const isActive = v.key === active.key;
                  return (
                    <td key={v.key} className={`px-4 py-2.5 ${isActive ? "bg-primary/5 font-semibold" : ""}`}>
                      {r.get(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ComparisonTable = ({ activeSlug, onSwitch, data, order }: { activeSlug: string; onSwitch: (s: string) => void; data: Record<string, Display32>; order: string[] }) => {
  const rows: { label: string; key: keyof Display32["quick"] }[] = [
    { label: "Form Factor", key: "formFactor" },
    { label: "ความละเอียด", key: "resolution" },
    { label: "ความสว่าง", key: "brightness" },
    { label: "Contrast", key: "contrast" },
    { label: "ระบบสัมผัส", key: "touch" },
    { label: "ระบบปฏิบัติการ", key: "os" },
    { label: "ขนาด (cm)", key: "dimensionCm" },
    { label: "น้ำหนัก", key: "weightKg" },
    { label: "Power", key: "power" },
    { label: "ติดตั้ง", key: "install" },
  ];
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm min-w-[760px]">
        <thead>
          <tr className="bg-muted/40 border-b border-border">
            <th className="text-left px-4 py-3 font-semibold w-44">รายการ</th>
            {order.map(s => {
              const m = data[s];
              const active = s === activeSlug;
              return (
                <th key={s} className={`text-left px-4 py-3 font-semibold ${active ? "bg-primary/10 text-primary" : ""}`}>
                  <button onClick={() => onSwitch(s)} className="text-left hover:underline">
                    <div className="font-bold">{m.modelCode}</div>
                    <div className="text-[11px] font-normal opacity-70">{m.formFactor}</div>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.key} className="border-b border-border/60 hover:bg-muted/20">
              <td className="px-4 py-2.5 text-muted-foreground font-medium">{r.label}</td>
              {order.map(s => {
                const active = s === activeSlug;
                return (
                  <td key={s} className={`px-4 py-2.5 ${active ? "bg-primary/5 font-semibold" : ""}`}>
                    {data[s].quick[r.key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SimpleLightbox = ({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) => {
  const [idx, setIdx] = useState(startIndex);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-background border border-border hover:bg-muted z-10">
        <X className="h-5 w-5" />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
            className="absolute left-4 p-2 rounded-full bg-background border border-border hover:bg-muted z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
            className="absolute right-4 p-2 rounded-full bg-background border border-border hover:bg-muted z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      <img
        src={images[idx]}
        alt={`zoom-${idx}`}
        className="max-h-[90vh] max-w-[92vw] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 border border-border text-xs">
          {idx + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default Display32Detail;

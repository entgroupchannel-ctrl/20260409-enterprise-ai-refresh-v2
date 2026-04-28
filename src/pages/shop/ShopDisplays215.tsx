import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronRight, Monitor, Cpu, Smartphone, Layers, Hand, ShieldCheck, Box,
  Check, Minus, Plus, ShoppingCart, FileText, Phone, MessageCircle, Sparkles,
  Wand2, Wifi, MemoryStick, HardDrive, Zap, ArrowRight, BadgeCheck,
  ZoomIn, X, ChevronLeft, Pause, Play, Disc,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { savePendingQuote } from "@/hooks/usePendingQuote";
import { DISPLAYS_215 } from "@/data/displays-215";
import LineQRButton from "@/components/LineQRButton";
import RelatedKioskModels from "@/components/shop/RelatedKioskModels";
import UseCaseGallery from "@/components/shop/UseCaseGallery";
import ucRetail215 from "@/assets/shop/usecases/kd215-retail.jpg";
import ucBanking215 from "@/assets/shop/usecases/kd215-banking.jpg";
import ucExhibition215 from "@/assets/shop/usecases/kd215-exhibition.jpg";
import ucPublic215 from "@/assets/shop/usecases/kd215-public.jpg";

const USE_CASE_GALLERY = [
  { image: ucRetail215, title: "Retail Self-service", caption: "เปลี่ยนหน้าร้านให้ลูกค้าเลือกสินค้าและชำระเงินเองได้ — ประสบการณ์ทันสมัย เพิ่ม conversion" },
  { image: ucBanking215, title: "Banking / Self-checkout", caption: "ตู้บริการเปิดบัญชี สมัครสินเชื่อ ตรวจสอบยอด — ลดเวลารอคิวในสาขา" },
  { image: ucExhibition215, title: "Exhibition / Museum", caption: "จุด Interactive ในงานนิทรรศการ พิพิธภัณฑ์ — ดึงดูดผู้เข้าชมและบอกเล่าเรื่องราว" },
  { image: ucPublic215, title: "Public Self-service", caption: "บริการข้อมูลในสนามบิน ศาลากลาง โรงพยาบาล — ลูกค้าหาข้อมูลได้ตลอด 24 ชม." },
];

/* ------------------------------------------------------------------ */
/*  Source product (single model: KD215B with 3 configurations)       */
/* ------------------------------------------------------------------ */
const PRODUCT = DISPLAYS_215.kd215b;

/* Estimated indicative prices per variant (THB, 1 unit).
 * สูตร: USD × 35 × 2.3 × 1.07 (VAT/import) + 10,000 (shipping) → ลงท้าย 990
 * KD215B Windows Entry (J6412/4GB/128GB Ubuntu): $708 → ~70,990
 */
const VARIANT_BASE_PRICE: Record<string, number> = {
  monitor: 27990,
  x86: 70990,
  android: 48990,
};

/* CPU tier delta */
const CPU_TIER_DELTA: Record<string, number> = {
  Entry: 0,
  Mid: 18000,
  High: 38000,
};

/* Upgrade options (compact selectable add-ons) */
const RAM_OPTIONS_X86 = [
  { label: "4GB", delta: 0 },
  { label: "8GB", delta: 1500 },
  { label: "16GB", delta: 3500 },
];
const RAM_OPTIONS_ARM = [
  { label: "2GB", delta: 0 },
  { label: "4GB", delta: 800 },
  { label: "8GB", delta: 2200 },
];
const SSD_OPTIONS_X86 = [
  { label: "128GB", delta: 0 },
  { label: "256GB", delta: 1200 },
  { label: "512GB", delta: 3500 },
];
const SSD_OPTIONS_ARM = [
  { label: "16GB", delta: 0 },
  { label: "32GB", delta: 600 },
  { label: "64GB", delta: 1500 },
  { label: "128GB", delta: 2800 },
];
const WIFI_OPTIONS = [
  { label: "Wi-Fi 5 (AC)", delta: 0 },
  { label: "Wi-Fi 6 (AX)", delta: 1200 },
  { label: "+ 4G LTE", delta: 3500 },
];

/* OS options per variant family */
const OS_OPTIONS_X86 = [
  { label: "Windows 10 Pro", delta: 0 },
  { label: "Windows 11 Pro", delta: 1500 },
  { label: "Windows 10 IoT Enterprise", delta: 4500 },
  { label: "Windows 11 IoT Enterprise", delta: 5500 },
  { label: "Ubuntu Linux 22.04 LTS", delta: -2500 },
  { label: "ไม่ลง OS (No OS)", delta: -3500 },
];
const OS_OPTIONS_ARM = [
  { label: "Android 11", delta: 0 },
  { label: "Android 12", delta: 600 },
  { label: "Android 13", delta: 1200 },
  { label: "Android 14", delta: 1800 },
  { label: "Linux (Debian/Ubuntu ARM)", delta: 800 },
];

/* Add-on peripherals — ดึงภาพจริงจากหน้าสินค้า /products/displays-21.5 */
const ADDON_PRICE_MAP: Record<string, number> = {
  "Fingerprint Sensor": 3500,
  "Metal Keyboard": 4200,
  "Card Dispenser": 8500,
  "Payment Terminal": 6500,
  "Camera": 2500,
  "NFC Payment": 2200,
  "4G LTE": 3800,
  "Battery UPS": 4200,
};
const ADDON_OPTIONS = (PRODUCT.customizationOptions ?? []).map((o) => ({
  key: o.name,
  label: o.name,
  price: ADDON_PRICE_MAP[o.name] ?? 2500,
  image: o.image,
}));

const ICON_MAP = {
  Monitor, Cpu, Smartphone, Layers, Hand, ShieldCheck, Box,
} as const;

const fmt = (n: number) => n.toLocaleString("th-TH");

function tierMultiplier(qty: number) {
  if (qty >= 50) return 0.8;
  if (qty >= 10) return 0.86;
  if (qty >= 5) return 0.93;
  return 1;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ShopDisplays215() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [variantKey, setVariantKey] = useState<string>(PRODUCT.variants?.[0]?.key ?? "monitor");
  const [cpuTierIdx, setCpuTierIdx] = useState<number>(0);
  const [ramIdx, setRamIdx] = useState(0);
  const [ssdIdx, setSsdIdx] = useState(0);
  const [wifiIdx, setWifiIdx] = useState(0);
  const [osIdx, setOsIdx] = useState(0);
  const [addons, setAddons] = useState<string[]>([]);
  const [qty, setQty] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  /* Slideshow state */
  const [slideIdx, setSlideIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const variant = useMemo(
    () => PRODUCT.variants?.find((v) => v.key === variantKey) ?? PRODUCT.variants?.[0],
    [variantKey],
  );

  const cpuTiers = useMemo(() => {
    const all = PRODUCT.cpuOptions ?? [];
    if (variantKey === "x86") return all.filter((c) => /Intel|Core|Celeron/i.test(c.cpu));
    if (variantKey === "android") return all.filter((c) => /Rockchip|RK/i.test(c.cpu));
    return [];
  }, [variantKey]);

  const cpuTier = cpuTiers[cpuTierIdx];
  const isPC = variantKey === "x86" || variantKey === "android";
  const ramOptions = variantKey === "x86" ? RAM_OPTIONS_X86 : RAM_OPTIONS_ARM;
  const ssdOptions = variantKey === "x86" ? SSD_OPTIONS_X86 : SSD_OPTIONS_ARM;
  const osOptions = variantKey === "x86" ? OS_OPTIONS_X86 : variantKey === "android" ? OS_OPTIONS_ARM : [];

  /* Reset selections when variant changes */
  useEffect(() => {
    setCpuTierIdx(0); setRamIdx(0); setSsdIdx(0); setWifiIdx(0); setOsIdx(0);
  }, [variantKey]);

  /* Auto-rotate slideshow */
  useEffect(() => {
    if (!autoplay || zoomOpen) return;
    slideTimer.current = setInterval(() => {
      setSlideIdx((i) => (i + 1) % PRODUCT.gallery.length);
    }, 4000);
    return () => { if (slideTimer.current) clearInterval(slideTimer.current); };
  }, [autoplay, zoomOpen]);

  /* Keyboard nav for zoom */
  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
      if (e.key === "ArrowRight") setSlideIdx((i) => (i + 1) % PRODUCT.gallery.length);
      if (e.key === "ArrowLeft") setSlideIdx((i) => (i - 1 + PRODUCT.gallery.length) % PRODUCT.gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen]);

  const pricing = useMemo(() => {
    const base = VARIANT_BASE_PRICE[variantKey] ?? 0;
    const cpuDelta = cpuTier ? CPU_TIER_DELTA[cpuTier.tier] ?? 0 : 0;
    const ramDelta = isPC ? (ramOptions[ramIdx]?.delta ?? 0) : 0;
    const ssdDelta = isPC ? (ssdOptions[ssdIdx]?.delta ?? 0) : 0;
    const wifiDelta = isPC ? (WIFI_OPTIONS[wifiIdx]?.delta ?? 0) : 0;
    const osDelta = isPC ? (osOptions[osIdx]?.delta ?? 0) : 0;
    const addonsTotal = addons.reduce((s, k) => s + (ADDON_OPTIONS.find(a => a.key === k)?.price ?? 0), 0);
    const unit = Math.max(0, base + cpuDelta + ramDelta + ssdDelta + wifiDelta + osDelta + addonsTotal);
    const tier = tierMultiplier(qty);
    const tierUnit = Math.round(unit * tier);
    const total = tierUnit * qty;
    const savings = (unit - tierUnit) * qty;
    return { unit, tierUnit, total, savings, addonsTotal, tierPct: Math.round((1 - tier) * 100) };
  }, [variantKey, cpuTier, ramIdx, ssdIdx, wifiIdx, osIdx, addons, qty, isPC, ramOptions, ssdOptions, osOptions]);

  const buildConfigSummary = () => {
    const parts: string[] = [variant?.label ?? PRODUCT.name];
    if (cpuTier) {
      parts.push(`CPU: ${cpuTier.cpu}`);
      if (isPC) {
        parts.push(`RAM: ${ramOptions[ramIdx].label}`);
        parts.push(`SSD: ${ssdOptions[ssdIdx].label}`);
        parts.push(`Wi-Fi: ${WIFI_OPTIONS[wifiIdx].label}`);
        if (osOptions[osIdx]) parts.push(`OS: ${osOptions[osIdx].label}`);
      }
    }
    if (addons.length) {
      const list = addons.map(k => ADDON_OPTIONS.find(a => a.key === k)?.label).filter(Boolean).join(", ");
      parts.push(`อุปกรณ์เสริม: ${list}`);
    }
    return parts.join(" • ");
  };

  const buildModelSku = () =>
    `${PRODUCT.modelCode}-${variantKey.toUpperCase()}${cpuTier ? `-${cpuTier.tier}` : ""}${
      isPC ? `-${ramOptions[ramIdx].label}-${ssdOptions[ssdIdx].label}` : ""
    }`;

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "กรุณาเข้าสู่ระบบ", description: "เข้าสู่ระบบเพื่อบันทึกสินค้าลงตะกร้าและขอใบเสนอราคา" });
      navigate("/login?redirect=/shop/displays-21.5");
      return;
    }
    setSubmitting(true);
    await addToCart({
      model: buildModelSku(),
      name: variant?.label ?? PRODUCT.name,
      description: buildConfigSummary(),
      quantity: qty,
      price: pricing.tierUnit,
      configuration: {
        variant: variant?.key,
        variantLabel: variant?.label,
        cpu: cpuTier?.cpu,
        ram: isPC ? ramOptions[ramIdx].label : cpuTier?.ram,
        storage: isPC ? ssdOptions[ssdIdx].label : cpuTier?.storage,
        wifi: isPC ? WIFI_OPTIONS[wifiIdx].label : undefined,
        os: isPC ? osOptions[osIdx]?.label : undefined,
        addons,
        tier: cpuTier?.tier,
      },
    });
    setSubmitting(false);
    toast({ title: "เพิ่มลงตะกร้าแล้ว", description: `${variant?.label} × ${qty} ชิ้น` });
  };

  const handleQuickQuote = () => {
    const product = {
      model: buildModelSku(),
      description: buildConfigSummary(),
      qty,
      unit_price: pricing.tierUnit,
      discount_percent: 0,
      line_total: pricing.total,
    };
    savePendingQuote({
      customer_name: "", customer_email: "", customer_phone: null, customer_company: null,
      notes: `รุ่น: ${variant?.label}\nสเปก: ${buildConfigSummary()}\nจำนวน: ${qty} ชิ้น`,
      products: [product],
    });
    navigate(user ? "/my-account/quotes/new" : "/login?redirect=/my-account/quotes/new");
  };

  const toggleAddon = (key: string) => {
    setAddons((prev) => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const VariantIcon = (variant?.icon && ICON_MAP[variant.icon as keyof typeof ICON_MAP]) || Monitor;
  const gallery = PRODUCT.gallery;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Shop — KD215B Floor-Stand Touch Kiosk 21.5" | ENT Group</title>
        <meta
          name="description"
          content="เลือกซื้อตู้คีออสก์ตั้งพื้น 21.5 นิ้ว KD215B — เลือก CPU/RAM/SSD/Wi-Fi/อุปกรณ์เสริมได้ครบ พร้อมขอใบเสนอราคาออนไลน์"
        />
        <link rel="canonical" href="https://www.entgroup.co.th/shop/displays-21.5" />
      </Helmet>

      <SiteNavbar />

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-4 text-xs text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground">หน้าแรก</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products/displays-21.5" className="hover:text-foreground">Display 21.5"</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">{PRODUCT.modelCode}</span>
      </nav>

      {/* HERO — compact 2-column */}
      <section className="container mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-6 items-start">
          {/* ── Portrait Slideshow ── */}
          <div className="space-y-2 lg:sticky lg:top-20">
            <div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-b from-muted/40 to-muted/10 border group cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            >
              {gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${PRODUCT.modelCode} ${i + 1}`}
                  className={cn(
                    "absolute inset-0 w-full h-full object-contain transition-opacity duration-700",
                    i === slideIdx ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}

              {/* Zoom hint */}
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded-full p-1.5 border opacity-0 group-hover:opacity-100 transition">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Counter */}
              <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] bg-background/80 backdrop-blur">
                {slideIdx + 1} / {gallery.length}
              </Badge>

              {/* Nav arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); setSlideIdx((slideIdx - 1 + gallery.length) % gallery.length); }}
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur rounded-full p-1.5 border opacity-0 group-hover:opacity-100 transition hover:bg-background"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setSlideIdx((slideIdx + 1) % gallery.length); }}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur rounded-full p-1.5 border opacity-0 group-hover:opacity-100 transition hover:bg-background"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={(e) => { e.stopPropagation(); setAutoplay(!autoplay); }}
                className="absolute bottom-2 right-2 bg-background/80 backdrop-blur rounded-full p-1.5 border hover:bg-background"
                aria-label={autoplay ? "Pause" : "Play"}
              >
                {autoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Progress dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSlideIdx(i); }}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === slideIdx ? "w-5 bg-primary" : "w-1.5 bg-foreground/30 hover:bg-foreground/60",
                    )}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-8 gap-1">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIdx(i)}
                  className={cn(
                    "aspect-square rounded-md overflow-hidden bg-muted/30 border transition-all",
                    i === slideIdx ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50",
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Info + Configurator ── */}
          <div className="space-y-3">
            <div>
              <Badge variant="secondary" className="mb-2 text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> {PRODUCT.category}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{PRODUCT.shortName}</h1>
              <p className="text-muted-foreground mt-1.5 text-sm md:text-base">{PRODUCT.tagline}</p>
            </div>

            {/* Quick Specs (จากหน้าสินค้า) — compact 4-col */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 rounded-lg border bg-muted/20">
              <QuickSpec label="หน้าจอ" value={'21.5" FHD'} />
              <QuickSpec label="Touch" value="PCAP 10pt" />
              <QuickSpec label="กระจก" value="Mohs 7" />
              <QuickSpec label="Response" value="< 5ms" />
              <QuickSpec label="ความสว่าง" value="300 cd/m²" />
              <QuickSpec label="น้ำหนัก" value="23 kg" />
              <QuickSpec label="ติดตั้ง" value="Floor Stand" />
              <QuickSpec label="ใช้งาน" value="7×24H" />
            </div>

            {/* Highlights — 2x2 compact */}
            <div className="grid grid-cols-2 gap-2">
              {PRODUCT.highlights.map((h, i) => {
                const Icon = ICON_MAP[h.icon as keyof typeof ICON_MAP] ?? Sparkles;
                return (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-primary/5 border border-primary/10">
                    <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight">{h.title}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{h.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Configurator Card */}
            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">ปรับแต่งสเปก</h3>
                </div>

                {/* Variant: 3-col compact */}
                <div className="grid grid-cols-3 gap-2">
                  {PRODUCT.variants?.map((v) => {
                    const VIcon = ICON_MAP[v.icon as keyof typeof ICON_MAP] ?? Monitor;
                    const active = v.key === variantKey;
                    return (
                      <button
                        key={v.key}
                        onClick={() => setVariantKey(v.key)}
                        className={cn(
                          "text-left p-2.5 rounded-lg border transition-all",
                          active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:border-primary/50",
                        )}
                      >
                        <VIcon className={cn("w-5 h-5 mb-1", active ? "text-primary" : "text-muted-foreground")} />
                        <p className="font-semibold text-sm leading-tight">{v.key === "monitor" ? "Monitor" : v.key === "x86" ? "Windows/Linux" : "Android"}</p>
                        <p className="text-xs text-primary font-bold mt-0.5">฿{fmt(VARIANT_BASE_PRICE[v.key] ?? 0)}</p>
                      </button>
                    );
                  })}
                </div>

                {/* CPU tier (PC only) */}
                {cpuTiers.length > 0 && (
                  <ConfigBlock icon={Cpu} label="ระดับ CPU">
                    <div className="grid grid-cols-3 gap-1.5">
                      {cpuTiers.map((c, i) => {
                        const active = i === cpuTierIdx;
                        const delta = CPU_TIER_DELTA[c.tier] ?? 0;
                        return (
                          <button
                            key={i}
                            onClick={() => setCpuTierIdx(i)}
                            className={cn(
                              "p-2 rounded-md border text-xs transition-all text-left",
                              active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                            )}
                          >
                            <p className="font-bold text-sm">{c.tier}</p>
                            <p className="text-muted-foreground line-clamp-1 text-xs">{c.cpu.split("(")[0].trim()}</p>
                            {delta > 0 && <p className="text-primary font-medium text-xs">+฿{fmt(delta)}</p>}
                          </button>
                        );
                      })}
                    </div>
                  </ConfigBlock>
                )}

                {/* RAM / SSD / Wi-Fi / OS (PC only) */}
                {isPC && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <ConfigBlock icon={MemoryStick} label="RAM">
                        <ChipRow
                          options={ramOptions}
                          activeIdx={ramIdx}
                          onSelect={setRamIdx}
                        />
                      </ConfigBlock>
                      <ConfigBlock icon={HardDrive} label="SSD/Storage">
                        <ChipRow
                          options={ssdOptions}
                          activeIdx={ssdIdx}
                          onSelect={setSsdIdx}
                        />
                      </ConfigBlock>
                    </div>
                    <ConfigBlock icon={Wifi} label="Wireless">
                      <ChipRow
                        options={WIFI_OPTIONS}
                        activeIdx={wifiIdx}
                        onSelect={setWifiIdx}
                      />
                    </ConfigBlock>
                    <ConfigBlock icon={Disc} label={variantKey === "x86" ? "ระบบปฏิบัติการ (OS)" : "Android / OS Version"}>
                      <ChipRow
                        options={osOptions}
                        activeIdx={osIdx}
                        onSelect={setOsIdx}
                      />
                    </ConfigBlock>
                  </>
                )}

                {/* Add-on peripherals — visual cards with images */}
                <ConfigBlock icon={Box} label="อุปกรณ์เสริม (เลือกได้หลายรายการ)">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ADDON_OPTIONS.map((a) => {
                      const active = addons.includes(a.key);
                      return (
                        <button
                          key={a.key}
                          onClick={() => toggleAddon(a.key)}
                          className={cn(
                            "relative text-left rounded-lg border-2 overflow-hidden transition-all bg-card hover:shadow-md",
                            active
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-border hover:border-primary/50",
                          )}
                        >
                          <div className="aspect-[4/3] bg-muted/30 overflow-hidden">
                            <img
                              src={a.image}
                              alt={a.label}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {active && (
                            <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full p-1 shadow">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          <div className="p-1.5">
                            <p className="text-xs font-semibold leading-tight line-clamp-1">{a.label}</p>
                            <p className="text-xs text-primary font-bold mt-0.5">+฿{fmt(a.price)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ConfigBlock>

                <Separator />

                {/* Quantity */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">จำนวน</span>
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <Input
                    type="number"
                    value={qty}
                    min={1}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center font-bold w-16 h-8 text-sm"
                  />
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setQty(qty + 1)}>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                  <div className="flex gap-1 ml-1">
                    {[5, 10, 50].map((n) => (
                      <Button key={n} size="sm" variant="outline" className="h-8 px-2.5 text-xs" onClick={() => setQty(n)}>
                        {n}
                      </Button>
                    ))}
                  </div>
                  {qty >= 5 && (
                    <Badge variant="secondary" className="ml-auto text-xs">ลด {pricing.tierPct}%</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground -mt-1">💡 5+ ลด 7% • 10+ ลด 14% • 50+ ลด 20%</p>

                {/* Price summary */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ราคาเริ่มต้น / ชิ้น</span>
                    <span>฿{fmt(pricing.unit)}</span>
                  </div>
                  {qty >= 5 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>ราคาส่ง × {qty}</span>
                      <span>฿{fmt(pricing.tierUnit)} / ชิ้น</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg text-primary pt-1.5 border-t border-primary/20">
                    <span>ยอดรวม</span>
                    <span>฿{fmt(pricing.total)}</span>
                  </div>
                  {pricing.savings > 0 && (
                    <p className="text-xs text-green-600 text-center">💰 ประหยัด ฿{fmt(pricing.savings)}</p>
                  )}
                </div>

                {/* Actions — compact, ไม่ยืดเต็มแถว */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleAddToCart} disabled={submitting} className="h-9 px-3">
                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                    เพิ่มลงตะกร้า
                  </Button>
                  <Button size="sm" onClick={handleQuickQuote} className="h-9 px-3">
                    <FileText className="w-4 h-4 mr-1.5" />
                    ขอใบเสนอราคา
                  </Button>
                  <LineQRButton className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                    <MessageCircle className="w-4 h-4" /> เพิ่มเพื่อน LINE
                  </LineQRButton>
                </div>
                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground flex-wrap pt-1">
                  <a href="tel:020456104" className="flex items-center gap-1 hover:text-primary">
                    <Phone className="w-3.5 h-3.5" /> 02-045-6104
                  </a>
                  <span>•</span>
                  <a href="tel:0957391053" className="flex items-center gap-1 hover:text-primary">
                    <Phone className="w-3.5 h-3.5" /> 095-739-1053
                  </a>
                  <span>•</span>
                  <Link to="/products/displays-21.5?model=kd215b" className="flex items-center gap-1 hover:text-primary">
                    <ArrowRight className="w-3.5 h-3.5" /> สเปกเต็ม
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* USE CASES — inspirational image gallery */}
      <UseCaseGallery items={USE_CASE_GALLERY} />

      {/* ── Zoom Lightbox ── */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setZoomOpen(false)}
        >
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 bg-background border rounded-full p-2 hover:bg-muted z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSlideIdx((slideIdx - 1 + gallery.length) % gallery.length); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background border rounded-full p-2 hover:bg-muted z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSlideIdx((slideIdx + 1) % gallery.length); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background border rounded-full p-2 hover:bg-muted z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <img
            src={gallery[slideIdx]}
            alt={`${PRODUCT.modelCode} zoomed`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <Badge variant="secondary" className="absolute bottom-4 left-1/2 -translate-x-1/2">
            {slideIdx + 1} / {gallery.length}
          </Badge>
        </div>
      )}

      <RelatedKioskModels currentSlug="displays-21.5" />
      <Footer />
    </div>
  );
}

/* ── Sub-components ── */
function QuickSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold leading-tight">{value}</p>
    </div>
  );
}

function ConfigBlock({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function ChipRow({
  options, activeIdx, onSelect,
}: {
  options: { label: string; delta: number }[];
  activeIdx: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o, i) => {
        const active = i === activeIdx;
        const sign = o.delta > 0 ? "+" : o.delta < 0 ? "−" : "";
        const absDelta = Math.abs(o.delta);
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={cn(
              "px-2.5 py-1.5 rounded-full border text-xs transition-all flex items-center gap-1",
              active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50",
            )}
          >
            {o.label}
            {o.delta !== 0 && (
              <span className={cn(active ? "opacity-80" : o.delta < 0 ? "text-green-600" : "text-primary")}>
                {sign}฿{absDelta.toLocaleString("th-TH")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

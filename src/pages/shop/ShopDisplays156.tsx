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
import { DISPLAYS_156 } from "@/data/displays-156";

/* ------------------------------------------------------------------ */
/*  Source product (single model: KD156B with 3 configurations)       */
/* ------------------------------------------------------------------ */
const PRODUCT = DISPLAYS_156.kd156b;

/* Estimated indicative prices per variant (THB, 1 unit). */
const VARIANT_BASE_PRICE: Record<string, number> = {
  monitor: 22990,
  x86: 68990,
  android: 42990,
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

/* Add-on peripherals (with images) */
const ADDON_OPTIONS = [
  { key: "printer",     label: "Thermal Printer",    price: 4500, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&h=200&fit=crop" },
  { key: "scanner",     label: "Barcode/QR Scanner", price: 3200, image: "https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=300&h=200&fit=crop" },
  { key: "rfid",        label: "RFID Reader",        price: 2800, image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&h=200&fit=crop" },
  { key: "fingerprint", label: "Fingerprint",        price: 3500, image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=300&h=200&fit=crop" },
  { key: "camera",      label: "Camera + e-KYC",     price: 2500, image: "https://images.unsplash.com/photo-1606986628253-49a4cb3a32a4?w=300&h=200&fit=crop" },
  { key: "nfc",         label: "NFC Payment",        price: 2200, image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=300&h=200&fit=crop" },
  { key: "dispenser",   label: "Card Dispenser",     price: 8500, image: "https://images.unsplash.com/photo-1580508174046-170816f65662?w=300&h=200&fit=crop" },
  { key: "ups",         label: "Battery UPS",        price: 4200, image: "https://images.unsplash.com/photo-1601132359864-c974e79890ac?w=300&h=200&fit=crop" },
];

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
export default function ShopDisplays156() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [variantKey, setVariantKey] = useState<string>(PRODUCT.variants?.[0]?.key ?? "monitor");
  const [cpuTierIdx, setCpuTierIdx] = useState<number>(0);
  const [ramIdx, setRamIdx] = useState(0);
  const [ssdIdx, setSsdIdx] = useState(0);
  const [wifiIdx, setWifiIdx] = useState(0);
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

  /* Reset selections when variant changes */
  useEffect(() => {
    setCpuTierIdx(0); setRamIdx(0); setSsdIdx(0); setWifiIdx(0);
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
    const addonsTotal = addons.reduce((s, k) => s + (ADDON_OPTIONS.find(a => a.key === k)?.price ?? 0), 0);
    const unit = base + cpuDelta + ramDelta + ssdDelta + wifiDelta + addonsTotal;
    const tier = tierMultiplier(qty);
    const tierUnit = Math.round(unit * tier);
    const total = tierUnit * qty;
    const savings = (unit - tierUnit) * qty;
    return { unit, tierUnit, total, savings, addonsTotal, tierPct: Math.round((1 - tier) * 100) };
  }, [variantKey, cpuTier, ramIdx, ssdIdx, wifiIdx, addons, qty, isPC, ramOptions, ssdOptions]);

  const buildConfigSummary = () => {
    const parts: string[] = [variant?.label ?? PRODUCT.name];
    if (cpuTier) {
      parts.push(`CPU: ${cpuTier.cpu}`);
      if (isPC) {
        parts.push(`RAM: ${ramOptions[ramIdx].label}`);
        parts.push(`SSD: ${ssdOptions[ssdIdx].label}`);
        parts.push(`Wi-Fi: ${WIFI_OPTIONS[wifiIdx].label}`);
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
      navigate("/login?redirect=/shop/displays-15.6");
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
        <title>Shop — KD156B Floor-Stand Touch Kiosk 15.6" | ENT Group</title>
        <meta
          name="description"
          content="เลือกซื้อตู้คีออสก์ตั้งพื้น 15.6 นิ้ว KD156B — เลือก CPU/RAM/SSD/Wi-Fi/อุปกรณ์เสริมได้ครบ พร้อมขอใบเสนอราคาออนไลน์"
        />
        <link rel="canonical" href="https://www.entgroup.co.th/shop/displays-15.6" />
      </Helmet>

      <SiteNavbar />

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-4 text-xs text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground">หน้าแรก</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products/displays-15.6" className="hover:text-foreground">Display 15.6"</Link>
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
              <Badge variant="secondary" className="mb-1.5 text-[10px]">
                <Sparkles className="w-3 h-3 mr-1" /> {PRODUCT.category}
              </Badge>
              <h1 className="text-xl md:text-2xl font-bold leading-tight">{PRODUCT.shortName}</h1>
              <p className="text-muted-foreground mt-1 text-xs md:text-sm">{PRODUCT.tagline}</p>
            </div>

            {/* Quick Specs (จากหน้าสินค้า) — compact 4-col */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 p-2 rounded-lg border bg-muted/20">
              <QuickSpec label="หน้าจอ" value={'15.6" FHD'} />
              <QuickSpec label="Touch" value="PCAP 10pt" />
              <QuickSpec label="กระจก" value="Mohs 7" />
              <QuickSpec label="Response" value="< 5ms" />
              <QuickSpec label="ความสว่าง" value="250 cd/m²" />
              <QuickSpec label="น้ำหนัก" value="20.1 kg" />
              <QuickSpec label="ติดตั้ง" value="Floor Stand" />
              <QuickSpec label="ใช้งาน" value="7×24H" />
            </div>

            {/* Highlights — 2x2 compact */}
            <div className="grid grid-cols-2 gap-1.5">
              {PRODUCT.highlights.map((h, i) => {
                const Icon = ICON_MAP[h.icon as keyof typeof ICON_MAP] ?? Sparkles;
                return (
                  <div key={i} className="flex items-start gap-1.5 p-1.5 rounded-md bg-primary/5 border border-primary/10">
                    <Icon className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold leading-tight truncate">{h.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight truncate">{h.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Configurator Card */}
            <Card className="border-primary/20">
              <CardContent className="p-3 space-y-3">
                <div className="flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-primary" />
                  <h3 className="font-bold text-xs uppercase tracking-wider">ปรับแต่งสเปก</h3>
                </div>

                {/* Variant: 3-col compact */}
                <div className="grid grid-cols-3 gap-1.5">
                  {PRODUCT.variants?.map((v) => {
                    const VIcon = ICON_MAP[v.icon as keyof typeof ICON_MAP] ?? Monitor;
                    const active = v.key === variantKey;
                    return (
                      <button
                        key={v.key}
                        onClick={() => setVariantKey(v.key)}
                        className={cn(
                          "text-left p-2 rounded-lg border transition-all",
                          active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:border-primary/50",
                        )}
                      >
                        <VIcon className={cn("w-4 h-4 mb-1", active ? "text-primary" : "text-muted-foreground")} />
                        <p className="font-semibold text-[11px] leading-tight">{v.key === "monitor" ? "Monitor" : v.key === "x86" ? "Windows/Linux" : "Android"}</p>
                        <p className="text-[10px] text-primary font-bold mt-0.5">฿{fmt(VARIANT_BASE_PRICE[v.key] ?? 0)}</p>
                      </button>
                    );
                  })}
                </div>

                {/* CPU tier (PC only) */}
                {cpuTiers.length > 0 && (
                  <ConfigBlock icon={Cpu} label="ระดับ CPU">
                    <div className="grid grid-cols-3 gap-1">
                      {cpuTiers.map((c, i) => {
                        const active = i === cpuTierIdx;
                        const delta = CPU_TIER_DELTA[c.tier] ?? 0;
                        return (
                          <button
                            key={i}
                            onClick={() => setCpuTierIdx(i)}
                            className={cn(
                              "p-1.5 rounded-md border text-[10px] transition-all text-left",
                              active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                            )}
                          >
                            <p className="font-bold text-[11px]">{c.tier}</p>
                            <p className="text-muted-foreground line-clamp-1">{c.cpu.split("(")[0].trim()}</p>
                            {delta > 0 && <p className="text-primary font-medium">+฿{fmt(delta)}</p>}
                          </button>
                        );
                      })}
                    </div>
                  </ConfigBlock>
                )}

                {/* RAM / SSD / Wi-Fi (PC only) */}
                {isPC && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
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
                  </>
                )}

                {/* Add-on peripherals */}
                <ConfigBlock icon={Box} label="อุปกรณ์เสริม (เลือกได้หลายรายการ)">
                  <div className="flex flex-wrap gap-1">
                    {ADDON_OPTIONS.map((a) => {
                      const active = addons.includes(a.key);
                      return (
                        <button
                          key={a.key}
                          onClick={() => toggleAddon(a.key)}
                          className={cn(
                            "px-2 py-1 rounded-full border text-[10px] transition-all flex items-center gap-1",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/50",
                          )}
                        >
                          {active && <Check className="w-2.5 h-2.5" />}
                          {a.label}
                          <span className={cn("opacity-80", active ? "" : "text-primary")}>+฿{fmt(a.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </ConfigBlock>

                <Separator />

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0">จำนวน</span>
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    value={qty}
                    min={1}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center font-bold w-14 h-7 text-sm"
                  />
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(qty + 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                  <div className="flex gap-1 ml-1">
                    {[5, 10, 50].map((n) => (
                      <Button key={n} size="sm" variant="outline" className="h-7 px-2 text-[10px]" onClick={() => setQty(n)}>
                        {n}
                      </Button>
                    ))}
                  </div>
                  {qty >= 5 && (
                    <Badge variant="secondary" className="ml-auto text-[10px]">ลด {pricing.tierPct}%</Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground -mt-1">💡 5+ ลด 7% • 10+ ลด 14% • 50+ ลด 20%</p>

                {/* Price summary */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">ราคาเริ่มต้น / ชิ้น</span>
                    <span>฿{fmt(pricing.unit)}</span>
                  </div>
                  {qty >= 5 && (
                    <div className="flex justify-between text-[11px] text-green-600">
                      <span>ราคาส่ง × {qty}</span>
                      <span>฿{fmt(pricing.tierUnit)} / ชิ้น</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base text-primary pt-1 border-t border-primary/20">
                    <span>ยอดรวม</span>
                    <span>฿{fmt(pricing.total)}</span>
                  </div>
                  {pricing.savings > 0 && (
                    <p className="text-[10px] text-green-600 text-center">💰 ประหยัด ฿{fmt(pricing.savings)}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-1.5">
                  <Button size="sm" variant="outline" onClick={handleAddToCart} disabled={submitting}>
                    <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                    เพิ่มลงตะกร้า
                  </Button>
                  <Button size="sm" onClick={handleQuickQuote}>
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    ขอใบเสนอราคา
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                  <a href="tel:0959244966" className="flex items-center gap-1 hover:text-primary">
                    <Phone className="w-3 h-3" /> 095-924-4966
                  </a>
                  <span>•</span>
                  <Link to="/contact" className="flex items-center gap-1 hover:text-primary">
                    <MessageCircle className="w-3 h-3" /> สอบถามแอดมิน
                  </Link>
                  <span>•</span>
                  <Link to={`/products/${PRODUCT.slug ?? "displays-15.6"}`} className="flex items-center gap-1 hover:text-primary">
                    <ArrowRight className="w-3 h-3" /> สเปกเต็ม
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* USE CASES — compact strip */}
      <section className="container mx-auto px-4 pb-8">
        <h2 className="text-sm font-bold mb-2 uppercase tracking-wider text-muted-foreground">ใช้งานเหมาะกับ</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PRODUCT.useCases.map((uc, i) => (
            <div key={i} className="flex items-center gap-1.5 p-2 rounded-md border bg-muted/20">
              <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
              <p className="text-xs">{uc}</p>
            </div>
          ))}
        </div>
      </section>

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

      <Footer />
    </div>
  );
}

/* ── Sub-components ── */
function QuickSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-[11px] font-semibold leading-tight">{value}</p>
    </div>
  );
}

function ConfigBlock({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="w-3 h-3" />
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
    <div className="flex flex-wrap gap-1">
      {options.map((o, i) => {
        const active = i === activeIdx;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={cn(
              "px-2 py-1 rounded-full border text-[10px] transition-all flex items-center gap-1",
              active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50",
            )}
          >
            {o.label}
            {o.delta > 0 && (
              <span className={cn(active ? "opacity-80" : "text-primary")}>+฿{(o.delta).toLocaleString("th-TH")}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

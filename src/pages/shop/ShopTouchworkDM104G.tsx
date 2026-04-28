import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight, Cpu, Smartphone, Monitor as MonitorIcon, Layers, ShieldCheck, Box,
  Check, Minus, Plus, ShoppingCart, FileText, Phone, MessageCircle, Sparkles,
  Wand2, MemoryStick, HardDrive, ArrowRight,
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
import LineQRButton from "@/components/LineQRButton";
import RelatedKioskModels from "@/components/shop/RelatedKioskModels";
import B2BPlatformBanner from "@/components/shop/B2BPlatformBanner";
import ShopKioskSEO from "@/components/shop/ShopKioskSEO";

import DM104G_Monitor from "@/assets/touchwork/DM104G-Monitor.jpg";
import DM104G_ARM from "@/assets/touchwork/DM104G-ARM.jpg";
import DM104G_X86 from "@/assets/touchwork/DM104G-X86.jpg";
import g_mon_01 from "@/assets/touchwork/gallery/DM104G-Monitor/01.jpg";
import g_mon_02 from "@/assets/touchwork/gallery/DM104G-Monitor/02.jpg";
import g_mon_03 from "@/assets/touchwork/gallery/DM104G-Monitor/03.jpg";
import g_mon_04 from "@/assets/touchwork/gallery/DM104G-Monitor/04.jpg";
import g_mon_05 from "@/assets/touchwork/gallery/DM104G-Monitor/05.jpg";
import g_mon_06 from "@/assets/touchwork/gallery/DM104G-Monitor/06.jpg";
import g_mon_07 from "@/assets/touchwork/gallery/DM104G-Monitor/07.jpg";
import g_arm_01 from "@/assets/touchwork/gallery/DM104G-ARM/01.jpg";
import g_arm_02 from "@/assets/touchwork/gallery/DM104G-ARM/02.jpg";
import g_arm_03 from "@/assets/touchwork/gallery/DM104G-ARM/03.jpg";
import g_arm_04 from "@/assets/touchwork/gallery/DM104G-ARM/04.jpg";
import g_arm_05 from "@/assets/touchwork/gallery/DM104G-ARM/05.jpg";
import g_arm_06 from "@/assets/touchwork/gallery/DM104G-ARM/06.jpg";
import g_arm_07 from "@/assets/touchwork/gallery/DM104G-ARM/07.jpg";
import g_x86_01 from "@/assets/touchwork/gallery/DM104G-X86/01.jpg";
import g_x86_02 from "@/assets/touchwork/gallery/DM104G-X86/02.jpg";
import g_x86_03 from "@/assets/touchwork/gallery/DM104G-X86/03.jpg";
import g_x86_04 from "@/assets/touchwork/gallery/DM104G-X86/04.jpg";
import g_x86_05 from "@/assets/touchwork/gallery/DM104G-X86/05.jpg";
import g_x86_06 from "@/assets/touchwork/gallery/DM104G-X86/06.jpg";
import g_x86_07 from "@/assets/touchwork/gallery/DM104G-X86/07.jpg";

/* ------------------------------------------------------------------ */
/*  DM104G — 10.4" Industrial Touch PC / Monitor (Touchwork series)   */
/*  Specs verified from /touchwork/dm104g:                            */
/*  - 10.4" 4:3, 1024 × 768 (TN a-Si)                                 */
/*  - PCAP 10-point, ≥250 cd/m², ≥1000:1                              */
/*  - Backlight 30,000 hr, VESA 75 + Embedded, IP65 (front)           */
/*  Indicative prices (THB / 1 unit, base config):                    */
/*  - Monitor: 13,990 / ARM (Android): 18,990                         */
/*  - X86 (Windows): 19,990 (CPU Model — แจ้งแอดมินขอราคา)             */
/* ------------------------------------------------------------------ */

const VARIANT_BASE_PRICE: Record<string, number> = {
  monitor: 13990,
  arm: 18990,
  x86: 19990,
};

const VARIANT_GALLERIES: Record<string, string[]> = {
  monitor: [DM104G_Monitor, g_mon_01, g_mon_02, g_mon_03, g_mon_04, g_mon_05, g_mon_06, g_mon_07],
  arm: [DM104G_ARM, g_arm_01, g_arm_02, g_arm_03, g_arm_04, g_arm_05, g_arm_06, g_arm_07],
  x86: [DM104G_X86, g_x86_01, g_x86_02, g_x86_03, g_x86_04, g_x86_05, g_x86_06, g_x86_07],
};

const SHOP_VARIANTS = [
  {
    key: "monitor",
    title: "Monitor — Plug & Play",
    badge: "จอสัมผัสเปล่า HDMI/VGA สำหรับต่อกับ PC/Mini PC",
    icon: "Monitor" as const,
  },
  {
    key: "arm",
    title: "Android (ARM)",
    badge: "Rockchip RK3568 / RK3399 — Android 11/12 พร้อมใช้งาน",
    icon: "Smartphone" as const,
  },
  {
    key: "x86",
    title: "Windows (Intel x86)",
    badge: "Intel Celeron / Core i3-i7 — Windows 10/11 หรือ Linux",
    icon: "Cpu" as const,
  },
];

/* ── Architecture-specific options ── */
const RAM_OPTIONS_ARM = [
  { label: "2GB LPDDR4", delta: 0 },
  { label: "4GB LPDDR4", delta: 1500 },
];
const RAM_OPTIONS_X86 = [
  { label: "4GB DDR4", delta: 0 },
  { label: "8GB DDR4", delta: 2800 },
  { label: "16GB DDR4", delta: 5600 },
];
const STORAGE_OPTIONS_ARM = [
  { label: "eMMC 16GB", delta: 0 },
  { label: "eMMC 32GB", delta: 1200 },
  { label: "eMMC 64GB", delta: 2400 },
];
const STORAGE_OPTIONS_X86 = [
  { label: "SSD 128GB", delta: 0 },
  { label: "SSD 256GB", delta: 2200 },
  { label: "SSD 512GB", delta: 4800 },
];
const OS_OPTIONS_ARM = [
  { label: "Android 11", delta: 0 },
  { label: "Android 12", delta: 0 },
];
const OS_OPTIONS_X86 = [
  { label: "Windows 10 Pro OEM", delta: 0 },
  { label: "Windows 11 Pro OEM", delta: 0 },
  { label: "Ubuntu Linux", delta: 0 },
];

const INSTALL_OPTIONS = [
  { label: "VESA 75 (มาตรฐาน)", delta: 0 },
  { label: "Embedded (ฝัง Panel)", delta: 800 },
];

const ADDON_OPTIONS = [
  { key: "wifi", label: "Wi-Fi 6 + BT 5.2", price: 1200 },
  { key: "lte", label: "4G LTE Module", price: 3800 },
  { key: "rs232", label: "RS-232 Serial Port", price: 800 },
  { key: "speaker", label: "External Speaker Set", price: 900 },
];

const ICON_MAP = {
  Cpu, Smartphone, Monitor: MonitorIcon, Layers, ShieldCheck, Box, Sparkles,
} as const;

const fmt = (n: number) => n.toLocaleString("th-TH");

function tierMultiplier(qty: number) {
  if (qty >= 50) return 0.8;
  if (qty >= 10) return 0.86;
  if (qty >= 5) return 0.93;
  return 1;
}

export default function ShopTouchworkDM104G() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [variantKey, setVariantKey] = useState<string>(SHOP_VARIANTS[0].key);
  const [ramIdx, setRamIdx] = useState(0);
  const [storageIdx, setStorageIdx] = useState(0);
  const [osIdx, setOsIdx] = useState(0);
  const [installIdx, setInstallIdx] = useState(0);
  const [addons, setAddons] = useState<string[]>([]);
  const [qty, setQty] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  const [slideIdx, setSlideIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const isMonitor = variantKey === "monitor";
  const isX86 = variantKey === "x86";
  const ramOptions = isX86 ? RAM_OPTIONS_X86 : RAM_OPTIONS_ARM;
  const storageOptions = isX86 ? STORAGE_OPTIONS_X86 : STORAGE_OPTIONS_ARM;
  const osOptions = isX86 ? OS_OPTIONS_X86 : OS_OPTIONS_ARM;

  const gallery = VARIANT_GALLERIES[variantKey] ?? VARIANT_GALLERIES.monitor;

  useEffect(() => {
    setRamIdx(0); setStorageIdx(0); setOsIdx(0); setSlideIdx(0);
  }, [variantKey]);

  useEffect(() => {
    if (!autoplay || zoomOpen) return;
    slideTimer.current = setInterval(() => {
      setSlideIdx((i) => (i + 1) % gallery.length);
    }, 4000);
    return () => { if (slideTimer.current) clearInterval(slideTimer.current); };
  }, [autoplay, zoomOpen, gallery.length]);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
      if (e.key === "ArrowRight") setSlideIdx((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft") setSlideIdx((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen, gallery.length]);

  const pricing = useMemo(() => {
    const base = VARIANT_BASE_PRICE[variantKey] ?? 0;
    let unit = base;
    if (!isMonitor) {
      unit += ramOptions[ramIdx]?.delta ?? 0;
      unit += storageOptions[storageIdx]?.delta ?? 0;
      unit += osOptions[osIdx]?.delta ?? 0;
    }
    unit += INSTALL_OPTIONS[installIdx]?.delta ?? 0;
    const addonsTotal = addons.reduce((s, k) => s + (ADDON_OPTIONS.find(a => a.key === k)?.price ?? 0), 0);
    unit = Math.max(0, unit + addonsTotal);
    const tier = tierMultiplier(qty);
    const tierUnit = Math.round(unit * tier);
    const total = tierUnit * qty;
    const savings = (unit - tierUnit) * qty;
    return { unit, tierUnit, total, savings, tierPct: Math.round((1 - tier) * 100) };
  }, [variantKey, ramIdx, storageIdx, osIdx, installIdx, addons, qty, isMonitor, ramOptions, storageOptions, osOptions]);

  const variantLabel = SHOP_VARIANTS.find(v => v.key === variantKey)?.title ?? "DM104G";

  const buildConfigSummary = () => {
    const parts: string[] = [`DM104G — ${variantLabel}`];
    if (!isMonitor) {
      parts.push(`RAM: ${ramOptions[ramIdx].label}`);
      parts.push(`Storage: ${storageOptions[storageIdx].label}`);
      parts.push(`OS: ${osOptions[osIdx].label}`);
    } else {
      parts.push("Plug & Play (HDMI/VGA) — ไม่มี CPU/OS");
    }
    parts.push(`ติดตั้ง: ${INSTALL_OPTIONS[installIdx].label}`);
    if (addons.length) {
      const list = addons.map(k => ADDON_OPTIONS.find(a => a.key === k)?.label).filter(Boolean).join(", ");
      parts.push(`อุปกรณ์เสริม: ${list}`);
    }
    if (isX86) parts.push("⚠ CPU Model: ไม่ได้ระบุ — รอแอดมินยืนยันตามรุ่น Intel ที่ลูกค้าต้องการ");
    return parts.join(" • ");
  };

  const buildModelSku = () => {
    const head = `DM104G-${variantKey.toUpperCase()}`;
    if (isMonitor) return head;
    return `${head}-${ramOptions[ramIdx].label.replace(/\s/g, "")}-${storageOptions[storageIdx].label.replace(/\s/g, "")}`;
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "กรุณาเข้าสู่ระบบ", description: "เข้าสู่ระบบเพื่อบันทึกสินค้าลงตะกร้าและขอใบเสนอราคา" });
      navigate("/login?redirect=/shop/dm104g");
      return;
    }
    setSubmitting(true);
    await addToCart({
      model: buildModelSku(),
      name: `DM104G — ${variantLabel}`,
      description: buildConfigSummary(),
      quantity: qty,
      price: pricing.tierUnit,
      configuration: {
        variant: variantKey,
        variantLabel,
        cpu: variantLabel,
        ram: isMonitor ? "—" : ramOptions[ramIdx].label,
        storage: isMonitor ? "—" : storageOptions[storageIdx].label,
        os: isMonitor ? "—" : osOptions[osIdx].label,
        install: INSTALL_OPTIONS[installIdx].label,
        addons,
      },
    });
    setSubmitting(false);
    toast({ title: "เพิ่มลงตะกร้าแล้ว", description: `${variantLabel} × ${qty} ชิ้น` });
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
      notes: `รุ่น: DM104G — ${variantLabel}\nสเปก: ${buildConfigSummary()}\nจำนวน: ${qty} ชิ้น`,
      products: [product],
    });
    navigate(user ? "/my-account/quotes/new" : "/login?redirect=/my-account/quotes/new");
  };

  const toggleAddon = (key: string) => {
    setAddons((prev) => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopKioskSEO
        slug="dm104g"
        modelCode="DM104G"
        shortName='Industrial Touch PC 10.4" 4:3 (PCAP, IP65 Front)'
        sizeInch={10.4}
        image={DM104G_Monitor}
        resolution="1024×768 (4:3)"
        brightness="≥ 250 cd/m²"
        touch="PCAP 10pt"
        useCases={["HMI โรงงาน / MES", "POS / Counter", "Self-Order Kiosk", "อุปกรณ์ควบคุมเครื่องจักร"]}
        variants={[
          { key: "monitor", label: "Monitor (Plug & Play HDMI/VGA)", price: VARIANT_BASE_PRICE.monitor, description: "จอสัมผัสเปล่า — ต่อกับ PC/Mini PC" },
          { key: "arm", label: "Android — RK3568 / RK3399", price: VARIANT_BASE_PRICE.arm, description: "Touch PC ระบบ Android พร้อมใช้งาน" },
          { key: "x86", label: "Windows (Intel x86)", price: VARIANT_BASE_PRICE.x86, description: "Touch PC x86 รองรับ Windows / Linux — กรณีไม่มี CPU Model ให้ระบุ ให้แจ้งแอดมินขอราคาเป็นกรณี" },
        ]}
      />

      <SiteNavbar />

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-4 text-xs text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground">หน้าแรก</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/touchwork/dm104g" className="hover:text-foreground">TouchWork</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">DM104G</span>
      </nav>

      {/* HERO — 2-column */}
      <section className="container mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-6 items-start">
          {/* Slideshow (4:3 frame to match panel ratio) */}
          <div className="space-y-2 lg:sticky lg:top-20">
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-muted/40 to-muted/10 border group cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            >
              {gallery.map((img, i) => (
                <img
                  key={img + i}
                  src={img}
                  alt={`DM104G ${variantLabel} ${i + 1}`}
                  className={cn(
                    "absolute inset-0 w-full h-full object-contain transition-opacity duration-700",
                    i === slideIdx ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}

              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded-full p-1.5 border opacity-0 group-hover:opacity-100 transition">
                <ZoomIn className="w-4 h-4" />
              </div>
              <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] bg-background/80 backdrop-blur">
                {slideIdx + 1} / {gallery.length}
              </Badge>

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
              <button
                onClick={(e) => { e.stopPropagation(); setAutoplay(!autoplay); }}
                className="absolute bottom-2 right-2 bg-background/80 backdrop-blur rounded-full p-1.5 border hover:bg-background"
                aria-label={autoplay ? "Pause" : "Play"}
              >
                {autoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

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

            <div className="grid grid-cols-8 gap-1">
              {gallery.map((img, i) => (
                <button
                  key={img + i}
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

          {/* Info + Configurator */}
          <div className="space-y-3">
            <div>
              <Badge variant="secondary" className="mb-2 text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> TouchWork Series
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                DM104G — Industrial Touch PC 10.4″ 4:3 (PCAP, IP65 Front)
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm md:text-base">
                จอสัมผัสอุตสาหกรรม 10.4″ 4:3 คลาสสิก — Backlight 30,000 ชม. เหมาะกับสายการผลิต MES • เลือกได้ทั้ง Monitor, Android และ Windows
              </p>
            </div>

            {/* Quick Specs (จาก /touchwork/dm104g) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 rounded-lg border bg-muted/20">
              <QuickSpec label="หน้าจอ" value='10.4" 4:3' />
              <QuickSpec label="ความละเอียด" value="1024 × 768" />
              <QuickSpec label="Touch" value="PCAP 10pt" />
              <QuickSpec label="ชนิดจอ" value="TN (a-Si)" />
              <QuickSpec label="ความสว่าง" value="≥250 cd/m²" />
              <QuickSpec label="Contrast" value="≥1000:1" />
              <QuickSpec label="Backlight" value="30,000 hr" />
              <QuickSpec label="VESA / IP" value="VESA 75 / IP65" />
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: "Sparkles" as const, title: "จอ 4:3 คลาสสิก 10.4″", subtitle: "เหมาะกับสายการผลิต MES" },
                { icon: "ShieldCheck" as const, title: "Backlight อายุ 30,000 ชม.", subtitle: "ใช้งาน 24/7 ในโรงงาน" },
                { icon: "Layers" as const, title: "VESA 75 + Embedded", subtitle: "ติดตั้งได้ 2 รูปแบบ" },
                { icon: "Box" as const, title: "Contrast ≥1000:1 + IP65", subtitle: "คมชัด ทนฝุ่นและความชื้น" },
              ].map((h, i) => {
                const Icon = ICON_MAP[h.icon] ?? Sparkles;
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

            {/* Configurator */}
            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">ปรับแต่งสเปก</h3>
                </div>

                {/* Variant: 3-col */}
                <div className="grid grid-cols-3 gap-2">
                  {SHOP_VARIANTS.map((v) => {
                    const VIcon = ICON_MAP[v.icon as keyof typeof ICON_MAP] ?? Cpu;
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
                        <p className="font-semibold text-sm leading-tight">{v.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{v.badge}</p>
                        <p className="text-xs text-primary font-bold mt-1">฿{fmt(VARIANT_BASE_PRICE[v.key] ?? 0)}</p>
                      </button>
                    );
                  })}
                </div>
                {isX86 && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-500 -mt-2">
                    💡 รุ่น Windows (Intel x86) — กรณีไม่ได้ระบุ CPU Model กรุณาแจ้งความต้องการกับแอดมินเพื่อรับใบเสนอราคาเป็นกรณีไป
                  </p>
                )}
                {isMonitor && (
                  <p className="text-[11px] text-muted-foreground -mt-2">
                    💡 Monitor variant: เป็นจอสัมผัสเปล่า ต่อกับ PC/Mini PC ผ่าน HDMI หรือ VGA — ไม่มี CPU/RAM/OS
                  </p>
                )}

                {/* RAM / Storage / OS — only for ARM/X86 */}
                {!isMonitor && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <ConfigBlock icon={MemoryStick} label="RAM">
                        <ChipRow options={ramOptions} activeIdx={ramIdx} onSelect={setRamIdx} />
                      </ConfigBlock>
                      <ConfigBlock icon={HardDrive} label={isX86 ? "Storage (SSD)" : "Storage (eMMC)"}>
                        <ChipRow options={storageOptions} activeIdx={storageIdx} onSelect={setStorageIdx} />
                      </ConfigBlock>
                    </div>
                    <ConfigBlock icon={Disc} label={isX86 ? "ระบบปฏิบัติการ (OS)" : "Android / OS Version"}>
                      <ChipRow options={osOptions} activeIdx={osIdx} onSelect={setOsIdx} />
                    </ConfigBlock>
                  </>
                )}

                <ConfigBlock icon={Layers} label="รูปแบบติดตั้ง (VESA / Embedded)">
                  <ChipRow options={INSTALL_OPTIONS} activeIdx={installIdx} onSelect={setInstallIdx} />
                </ConfigBlock>

                <ConfigBlock icon={Box} label="อุปกรณ์เสริม (เลือกได้หลายรายการ)">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ADDON_OPTIONS.map((a) => {
                      const active = addons.includes(a.key);
                      return (
                        <button
                          key={a.key}
                          onClick={() => toggleAddon(a.key)}
                          className={cn(
                            "relative text-left rounded-lg border-2 p-2 transition-all bg-card hover:shadow-md",
                            active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50",
                          )}
                        >
                          {active && (
                            <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          <p className="text-xs font-semibold leading-tight line-clamp-2">{a.label}</p>
                          <p className="text-xs text-primary font-bold mt-0.5">+฿{fmt(a.price)}</p>
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
                  <Link to="/touchwork/dm104g" className="flex items-center gap-1 hover:text-primary">
                    <ArrowRight className="w-3.5 h-3.5" /> สเปกเต็ม
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Zoom Lightbox */}
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
            alt="DM104G zoomed"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <Badge variant="secondary" className="absolute bottom-4 left-1/2 -translate-x-1/2">
            {slideIdx + 1} / {gallery.length}
          </Badge>
        </div>
      )}

      <B2BPlatformBanner />
      <RelatedKioskModels currentSlug="dm104g" />
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
              active ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/30" : "border-border hover:border-primary/50",
            )}
          >
            <span className="font-medium">{o.label}</span>
            {o.delta !== 0 && (
              <span className={cn("font-semibold", o.delta < 0 ? "text-green-600" : "text-primary")}>
                {sign}฿{absDelta.toLocaleString("th-TH")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

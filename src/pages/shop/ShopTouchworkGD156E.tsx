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

import GD156_Monitor from "@/assets/touchwork/GD156-Monitor.jpg";
import GD156_ARM from "@/assets/touchwork/GD156-ARM.jpg";
import GD156_X86 from "@/assets/touchwork/GD156-X86.jpg";
import g_mon_01 from "@/assets/touchwork/gallery/GD156-Monitor/01.jpg";
import g_mon_02 from "@/assets/touchwork/gallery/GD156-Monitor/02.jpg";
import g_mon_03 from "@/assets/touchwork/gallery/GD156-Monitor/03.jpg";
import g_mon_04 from "@/assets/touchwork/gallery/GD156-Monitor/04.jpg";
import g_mon_05 from "@/assets/touchwork/gallery/GD156-Monitor/05.jpg";
import g_mon_06 from "@/assets/touchwork/gallery/GD156-Monitor/06.jpg";
import g_arm_01 from "@/assets/touchwork/gallery/GD156-ARM/01.jpg";
import g_arm_02 from "@/assets/touchwork/gallery/GD156-ARM/02.jpg";
import g_arm_03 from "@/assets/touchwork/gallery/GD156-ARM/03.jpg";
import g_arm_04 from "@/assets/touchwork/gallery/GD156-ARM/04.jpg";
import g_arm_05 from "@/assets/touchwork/gallery/GD156-ARM/05.jpg";
import g_arm_06 from "@/assets/touchwork/gallery/GD156-ARM/06.jpg";
import g_arm_07 from "@/assets/touchwork/gallery/GD156-ARM/07.jpg";
import g_x86_01 from "@/assets/touchwork/gallery/GD156-X86/windows-desktop-01.jpg";
import g_x86_02 from "@/assets/touchwork/gallery/GD156-X86/windows-desktop-02.jpg";
import g_x86_03 from "@/assets/touchwork/gallery/GD156-X86/windows-desktop-03.jpg";
import g_x86_04 from "@/assets/touchwork/gallery/GD156-X86/windows-desktop-04.jpg";
import g_x86_05 from "@/assets/touchwork/gallery/GD156-X86/windows-desktop-05.jpg";
import g_x86_06 from "@/assets/touchwork/gallery/GD156-X86/windows-desktop-06.jpg";
import g_x86_07 from "@/assets/touchwork/gallery/GD156-X86/windows-desktop-07.jpg";
import g_x86_08 from "@/assets/touchwork/gallery/GD156-X86/windows-desktop-08.jpg";

/* ------------------------------------------------------------------ */
/*  GD156E — 15.6" Industrial Wall-Mount Touch Kiosk (Touchwork)      */
/*  Specs verified จาก touchwo.com (GD156E ARM + Monitor):            */
/*   - 15.6" 16:9, 1920×1080 Full HD, 16.7M colors                    */
/*   - Active area 345.2 × 194.6 mm                                   */
/*   - Brightness ≥250 cd/m², Contrast 1000:1, View 178°/178°         */
/*   - Backlight LED 30,000 hrs, Refresh 60 Hz                        */
/*   - PCAP 10-pt, scan 200Hz, 4096×4096, >1.5mm recognition          */
/*   - Surface: Mohs 7 explosion-proof glass                          */
/*   - Dimension: 37.56(W)×33.38(L)×4.83(T) cm                        */
/*   - Net 4.1 KG / Gross 5.6 KG (Pkg 69.2×34.7×15.5 cm)              */
/*   - Power: AC 110-240V 50/60Hz → DC 12V 5A; Standby ≤0.5W          */
/*           Monitor <30W / Android <36W / X86 <60W                   */
/*   - Op Temp 0–50°C, Humidity 10–80%                                */
/*   - In box: Manual ×1, AC cable ×1, Wall mount bracket ×1,         */
/*             WiFi antenna ×1 (ARM/X86)                              */
/*   - External: Monitor → HDMI ×1, USB 2.0 ×2, Power ×1              */
/*               ARM/X86 → RJ45 ×1, USB 2.0 ×2, Power ×1              */
/*   - ARM CPU options: RK3568 / RK3399 / RK3588                      */
/*   - Compatible: SCADA, cameras, card reader, 4G, fingerprint       */
/*  ราคา: ติดต่อสอบถาม (รอเจ้าของระบบแจ้งราคา)                          */
/* ------------------------------------------------------------------ */

const VARIANT_BASE_PRICE: Record<string, number> = {
  monitor: 0,
  arm: 0,
  x86: 0,
};

const VARIANT_GALLERIES: Record<string, string[]> = {
  monitor: [g_mon_01, g_mon_02, g_mon_03, g_mon_04, g_mon_05, g_mon_06],
  arm: [g_arm_01, g_arm_02, g_arm_03, g_arm_04, g_arm_05, g_arm_06, g_arm_07],
  x86: [g_x86_01, g_x86_02, g_x86_03, g_x86_04, g_x86_05, g_x86_06, g_x86_07, g_x86_08],
};

const SHOP_VARIANTS = [
  {
    key: "monitor",
    title: "Monitor — Plug & Play",
    badge: "จอสัมผัสเปล่า HDMI สำหรับต่อกับ PC/Mini PC",
    icon: "Monitor" as const,
  },
  {
    key: "arm",
    title: "Android (ARM)",
    badge: "Rockchip RK3568 / RK3399 / RK3588 — Android 9/11/12",
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
  { label: "4GB LPDDR4", delta: 0 },
  { label: "8GB LPDDR4", delta: 0 },
];
const RAM_OPTIONS_X86 = [
  { label: "4GB DDR4", delta: 0 },
  { label: "8GB DDR4", delta: 0 },
  { label: "16GB DDR4", delta: 0 },
];
const STORAGE_OPTIONS_ARM = [
  { label: "eMMC 32GB", delta: 0 },
  { label: "eMMC 64GB", delta: 0 },
  { label: "eMMC 128GB", delta: 0 },
];
const STORAGE_OPTIONS_X86 = [
  { label: "SSD 128GB", delta: 0 },
  { label: "SSD 256GB", delta: 0 },
  { label: "SSD 512GB", delta: 0 },
];
const OS_OPTIONS_ARM = [
  { label: "Android 9 (RK3399)", delta: 0 },
  { label: "Android 11 (RK3568)", delta: 0 },
  { label: "Android 12 (RK3588)", delta: 0 },
];
const OS_OPTIONS_X86 = [
  { label: "Windows 10 Pro OEM", delta: 0 },
  { label: "Windows 11 Pro OEM", delta: 0 },
  { label: "Ubuntu Linux", delta: 0 },
];

const INSTALL_OPTIONS = [
  { label: "Wall-Mount (มาตรฐาน)", delta: 0 },
  { label: "Desktop Stand (ตั้งโต๊ะ)", delta: 0 },
  { label: "Embedded (ฝัง Panel)", delta: 0 },
  { label: "Floor Mount", delta: 0 },
];

const ADDON_OPTIONS = [
  { key: "wifi", label: "Wi-Fi 6 + BT 5.2", price: 0 },
  { key: "lte", label: "4G LTE Module", price: 0 },
  { key: "rs232", label: "RS-232/422/485 Serial", price: 0 },
  { key: "camera", label: "Camera Module", price: 0 },
  { key: "card", label: "ID Card Reader", price: 0 },
  { key: "fp", label: "Fingerprint Scanner", price: 0 },
];

const ICON_MAP = {
  Cpu, Smartphone, Monitor: MonitorIcon, Layers, ShieldCheck, Box, Sparkles,
} as const;

const fmt = (n: number) => n.toLocaleString("th-TH");

const GALLERY_CACHE_BUSTER = "gd156e-gallery-20260428-v1";
const withGalleryCacheBuster = (src: string) => `${src}${src.includes("?") ? "&" : "?"}v=${GALLERY_CACHE_BUSTER}`;

function tierMultiplier(qty: number) {
  if (qty >= 50) return 0.8;
  if (qty >= 10) return 0.86;
  if (qty >= 5) return 0.93;
  return 1;
}

export default function ShopTouchworkGD156E() {
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

  const gallery = useMemo(
    () => (VARIANT_GALLERIES[variantKey] ?? VARIANT_GALLERIES.monitor).map(withGalleryCacheBuster),
    [variantKey],
  );

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

  const variantLabel = SHOP_VARIANTS.find(v => v.key === variantKey)?.title ?? "GD156E";

  const buildConfigSummary = () => {
    const parts: string[] = [`GD156E — ${variantLabel}`];
    if (!isMonitor) {
      parts.push(`RAM: ${ramOptions[ramIdx].label}`);
      parts.push(`Storage: ${storageOptions[storageIdx].label}`);
      parts.push(`OS: ${osOptions[osIdx].label}`);
    } else {
      parts.push("Plug & Play (HDMI) — ไม่มี CPU/OS");
    }
    parts.push(`ติดตั้ง: ${INSTALL_OPTIONS[installIdx].label}`);
    if (addons.length) {
      const list = addons.map(k => ADDON_OPTIONS.find(a => a.key === k)?.label).filter(Boolean).join(", ");
      parts.push(`อุปกรณ์เสริม: ${list}`);
    }
    parts.push("⚠ ราคา: รอแอดมินยืนยัน");
    return parts.join(" • ");
  };

  const buildModelSku = () => {
    const head = `GD156E-${variantKey.toUpperCase()}`;
    if (isMonitor) return head;
    return `${head}-${ramOptions[ramIdx].label.replace(/\s/g, "")}-${storageOptions[storageIdx].label.replace(/\s/g, "")}`;
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "กรุณาเข้าสู่ระบบ", description: "เข้าสู่ระบบเพื่อบันทึกสินค้าลงตะกร้าและขอใบเสนอราคา" });
      navigate("/login?redirect=/shop/gd156e");
      return;
    }
    setSubmitting(true);
    await addToCart({
      model: buildModelSku(),
      name: `GD156E — ${variantLabel}`,
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
      notes: `รุ่น: GD156E — ${variantLabel}\nสเปก: ${buildConfigSummary()}\nจำนวน: ${qty} ชิ้น`,
      products: [product],
    });
    navigate(user ? "/my-account/quotes/new" : "/login?redirect=/my-account/quotes/new");
  };

  const toggleAddon = (key: string) => {
    setAddons((prev) => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const heroImage = variantKey === "arm" ? GD156_ARM : variantKey === "x86" ? GD156_X86 : GD156_Monitor;

  return (
    <div className="min-h-screen bg-background">
      <ShopKioskSEO
        slug="gd156e"
        modelCode="GD156E"
        shortName='Industrial Wall-Mount Touch Kiosk 15.6" 16:9 Full HD (PCAP 10pt, Mohs 7, SCADA Compatible)'
        sizeInch={15.6}
        image={heroImage}
        resolution="1920×1080 (16:9)"
        brightness="≥ 250 cd/m²"
        touch="Capacitive 10pt"
        useCases={[
          "Wall-Mount Self-Service Kiosk (SCADA)",
          "Industrial HMI / Automation Panel",
          "POS — Square / Stripe / Clover / Shopify",
          "Hospital / Hotel / Smart Building",
        ]}
        variants={[
          { key: "monitor", label: "Monitor (Plug & Play HDMI)", price: VARIANT_BASE_PRICE.monitor, description: "จอสัมผัสเปล่า — ต่อกับ PC/Mini PC" },
          { key: "arm", label: "Android — RK3568 / RK3399 / RK3588", price: VARIANT_BASE_PRICE.arm, description: "Touch PC ระบบ Android 9/11/12" },
          { key: "x86", label: "Windows (Intel x86)", price: VARIANT_BASE_PRICE.x86, description: "Touch PC x86 รองรับ Windows / Linux" },
        ]}
      />

      <SiteNavbar />

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-4 text-xs text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground">หน้าแรก</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop/gd156" className="hover:text-foreground">TouchWork GD156</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">GD156E</span>
      </nav>

      {/* HERO — 2-column */}
      <section className="container mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-6 items-start">
          {/* Slideshow */}
          <div className="space-y-2 lg:sticky lg:top-20">
            <div
              className="relative aspect-[5/4] rounded-2xl overflow-hidden bg-gradient-to-b from-muted/40 to-muted/10 border group cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            >
              {gallery.map((img, i) => (
                <img
                  key={img + i}
                  src={img}
                  alt={`GD156E ${variantLabel} ${i + 1}`}
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
                GD156E — Industrial Wall-Mount Touch Kiosk 15.6″ Full HD (SCADA Compatible)
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm md:text-base">
                จอสัมผัสอุตสาหกรรม 15.6″ Full HD (1920×1080) — รองรับพอร์ต Serial และ USB ใช้งานร่วมกับซอฟต์แวร์ SCADA • ต่อกล้อง, Card Reader, 4G Module ได้ • PCAP 10-pt ผิวแก้ว Mohs 7 กันระเบิด • LED 30,000 ชม. ประหยัดพลังงาน • RAM/SSD ความเร็วสูงเพิ่มประสิทธิภาพ 50% • Cooling 3D ระดับอุตสาหกรรม • เลือกได้ Monitor, Android และ Windows
              </p>
            </div>

            {/* Quick Specs (verified จาก touchwo.com — GD156E) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 rounded-lg border bg-muted/20">
              <QuickSpec label="หน้าจอ" value='15.6" 16:9' />
              <QuickSpec label="ความละเอียด" value="1920 × 1080" />
              <QuickSpec label="Active Area" value="345.2 × 194.6 mm" />
              <QuickSpec label="ความสว่าง" value="≥250 cd/m²" />
              <QuickSpec label="Contrast" value="1000:1" />
              <QuickSpec label="มุมมอง" value="178°/178°" />
              <QuickSpec label="Backlight" value="LED 30,000 hr" />
              <QuickSpec label="Refresh" value="60 Hz" />
              <QuickSpec label="Touch" value="PCAP 10pt" />
              <QuickSpec label="Surface" value="Mohs 7 Glass" />
              <QuickSpec label="ความหนา" value="48.3 mm" />
              <QuickSpec label="ขนาดเครื่อง" value="375.6 × 333.8 mm" />
              <QuickSpec label="น้ำหนักสุทธิ" value="4.1 kg" />
              <QuickSpec label="ไฟเลี้ยง" value="DC 12V 5A" />
              <QuickSpec label="ติดตั้ง" value="Wall / Floor / Embed" />
              <QuickSpec label="SCADA" value="รองรับ" />
            </div>

            {/* Highlights — 4 features จากต้นฉบับ */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: "ShieldCheck" as const, title: "Industrial-grade Power Supply", subtitle: "แหล่งจ่ายไฟอุตสาหกรรม เสถียรสำหรับงานหนัก" },
                { icon: "Sparkles" as const, title: "30,000-hour LED Display", subtitle: "อายุการใช้งานยาวนาน ทำงาน 7×24 ชม." },
                { icon: "Layers" as const, title: "Multiple Peripheral Configs", subtitle: "Camera / Card Reader / 4G / Fingerprint" },
                { icon: "Box" as const, title: "Easy Wall / Floor Mount", subtitle: "ติดผนัง ตั้งพื้น หรือฝัง Panel" },
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
                        <p className="text-xs text-amber-600 dark:text-amber-500 font-bold mt-1">ติดต่อสอบถามราคา</p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-500 -mt-2">
                  💡 GD156E เป็นรุ่นใหม่ — ราคายังไม่ประกาศ กรุณาขอใบเสนอราคาจากแอดมิน
                </p>
                {isMonitor && (
                  <p className="text-[11px] text-muted-foreground -mt-2">
                    💡 Monitor variant: เป็นจอสัมผัสเปล่า ต่อกับ PC/Mini PC ผ่าน HDMI — ไม่มี CPU/RAM/OS
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

                <ConfigBlock icon={Layers} label="รูปแบบติดตั้ง (Wall / Floor / Desktop / Embedded)">
                  <ChipRow options={INSTALL_OPTIONS} activeIdx={installIdx} onSelect={setInstallIdx} />
                </ConfigBlock>

                <ConfigBlock icon={Box} label="อุปกรณ์เสริม (เลือกได้หลายรายการ)">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                          <p className="text-[10px] text-muted-foreground mt-0.5">สอบถามราคา</p>
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
                <p className="text-xs text-muted-foreground -mt-1">💡 5+ ลด 7% • 10+ ลด 14% • 50+ ลด 20% (ใช้คำนวณเมื่อแอดมินกำหนดราคา)</p>

                {/* Price summary */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ราคา / ชิ้น</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-500">ติดต่อสอบถาม</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-amber-700 dark:text-amber-500 pt-1.5 border-t border-amber-500/20">
                    <span>จำนวน × {qty} ชิ้น</span>
                    <span>รอใบเสนอราคา</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center">📋 กดขอใบเสนอราคา หรือเพิ่มเพื่อน LINE @entgroup เพื่อสอบถาม</p>
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
                  <Link to="/shop/gd156" className="flex items-center gap-1 hover:text-primary">
                    <ArrowRight className="w-3.5 h-3.5" /> เปรียบเทียบกับ GD156
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industrial Touch Superiority */}
      <section className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold">Industrial Touch Superiority</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Precision Touch • HD Visibility • Ironclad Reliability</p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span><b>10-point capacitive touch</b> — รับสัมผัสพร้อมกัน 10 จุด แม่นยำ ไม่มีจุดบอด เหมาะกับงานอุตสาหกรรมที่ซับซ้อน</span></li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span><b>15.6″ Full HD LED-backlit display</b> — สีคมชัด ประหยัดพลังงาน รองรับ HMI แบบ mirrored และ multi-screen</span></li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span><b>48-hour burn-in & industrial testing</b> — ทดสอบ ESD, vibration, high-voltage และ panel integrity ก่อนส่งทุกเครื่อง</span></li>
            </ul>

            <Separator />

            <div>
              <h3 className="font-bold mb-2">Industrial Excellence in Three Key Features</h3>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded-md border bg-muted/10">
                  <p className="font-semibold mb-1">Extensive I/O Compatibility</p>
                  <p className="text-muted-foreground text-xs">Serial RS-232/422/485 และ USB ปรับแต่งได้ ใช้งานร่วมกับ SCADA และระบบ Automation</p>
                </div>
                <div className="p-3 rounded-md border bg-muted/10">
                  <p className="font-semibold mb-1">Enhanced Performance & Storage</p>
                  <p className="text-muted-foreground text-xs">RAM ความเร็วสูงและ SSD เกรดอุตสาหกรรม ทำงานเร็วขึ้นถึง 50% เก็บข้อมูลเสถียร</p>
                </div>
                <div className="p-3 rounded-md border bg-muted/10">
                  <p className="font-semibold mb-1">Advanced 3D Cooling</p>
                  <p className="text-muted-foreground text-xs">Chassis ระบายความร้อนแบบหลายช่อง รักษาเสถียรภาพภายใต้โหลดหนัก</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-bold mb-2">Flexible & Durable Solutions</h3>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded-md border bg-muted/10">
                  <p className="font-semibold mb-1">Versatile Peripheral Support</p>
                  <p className="text-muted-foreground text-xs">รองรับกล้อง, ID Card Reader, 4G Module, Fingerprint Scanner และอื่นๆ</p>
                </div>
                <div className="p-3 rounded-md border bg-muted/10">
                  <p className="font-semibold mb-1">Durable Touch Panel</p>
                  <p className="text-muted-foreground text-xs">15.6″ flat, กระจกกันระเบิด Mohs 7 สัมผัสแม่นยำ ตอบสนองรวดเร็ว</p>
                </div>
                <div className="p-3 rounded-md border bg-muted/10">
                  <p className="font-semibold mb-1">Customizable Design</p>
                  <p className="text-muted-foreground text-xs">เปลี่ยนสี, พิมพ์โลโก้, ข้อความ ตามแบรนด์ของคุณ</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Full Spec Sheet (verified จาก touchwo.com — GD156E) */}
      <section className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-bold">สเปกเต็ม (Specification — ตรงตามผู้ผลิต GD156E)</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-sm">
              <SpecGroup title="LCD Panel">
                <SpecRow k="Screen Diagonal" v="15.6 inch" />
                <SpecRow k="Physical Resolution" v="1920 × 1080 (Full HD)" />
                <SpecRow k="Aspect Ratio" v="16 : 9" />
                <SpecRow k="Active Screen Size" v="345.2 × 194.6 mm" />
                <SpecRow k="Colours Displayed" v="16.7M" />
                <SpecRow k="Brightness" v="≥ 250 cd/m²" />
                <SpecRow k="Contrast" v="1000 : 1" />
                <SpecRow k="Viewing Angle (H/V)" v="178° / 178°" />
                <SpecRow k="Backlight Lifetime" v="LED 30,000 hours" />
                <SpecRow k="Refresh Rate" v="60 Hz" />
              </SpecGroup>

              <SpecGroup title="Touch Panel">
                <SpecRow k="Touch Technology" v="PCAP (Projected Capacitive)" />
                <SpecRow k="Response Time" v="< 5 ms" />
                <SpecRow k="Touch Points" v="10 points standard" />
                <SpecRow k="Effective Recognition" v="> 1.5 mm" />
                <SpecRow k="Scanning Frequency" v="200 Hz" />
                <SpecRow k="Scanning Accuracy" v="4096 × 4096" />
                <SpecRow k="Working Current/Voltage" v="180 mA / DC +5V ±5%" />
                <SpecRow k="Surface Hardness" v="Mohs 7 explosion-proof glass" />
              </SpecGroup>

              <SpecGroup title="Android System (ARM variant)">
                <SpecRow k="CPU Options" v="Rockchip RK3568 / RK3399 / RK3588" />
                <SpecRow k="GPU" v="ARM G52 2EE / Mali-T864 / Mali-G610" />
                <SpecRow k="Memory" v="2GB (4G opt.) / 4GB / 4GB (8G opt.)" />
                <SpecRow k="Storage" v="32GB / 64GB / 64-128GB eMMC" />
                <SpecRow k="Network" v="10/100M หรือ 100/1000M RJ45 + Wi-Fi a/b/g/n/ac" />
                <SpecRow k="Pre-installed OS" v="Android 11 / Android 9 / Android 12" />
              </SpecGroup>

              <SpecGroup title="Operation Environment">
                <SpecRow k="Operation Temperature" v="0 °C – 50 °C" />
                <SpecRow k="Operation Humidity" v="10 % – 80 %" />
                <SpecRow k="Storage Temperature" v="−5 °C – 60 °C" />
                <SpecRow k="Storage Humidity" v="10 % – 85 %" />
              </SpecGroup>

              <SpecGroup title="Dimension & Weight">
                <SpecRow k="Machine (W×L×T)" v="37.56 × 33.38 × 4.83 cm" />
                <SpecRow k="Package (W×L×T)" v="69.2 × 34.7 × 15.5 cm" />
                <SpecRow k="Net Weight" v="4.1 kg" />
                <SpecRow k="Gross Weight" v="5.6 kg" />
              </SpecGroup>

              <SpecGroup title="Power Supply">
                <SpecRow k="Power Input" v="110 – 240 V AC, 50/60 Hz" />
                <SpecRow k="Power Output" v="DC 12 V 5 A" />
                <SpecRow k="Standby Consumption" v="≤ 0.5 W" />
                <SpecRow k="Overall Consumption" v="Monitor < 30W / Android < 36W / X86 < 60W" />
              </SpecGroup>

              <SpecGroup title="In the Box">
                <SpecRow k="Manual" v="× 1" />
                <SpecRow k="AC Power Cable" v="× 1" />
                <SpecRow k="Wall Mount Bracket" v="× 1" />
                <SpecRow k="WiFi Antenna (ARM/X86)" v="× 1" />
              </SpecGroup>

              <SpecGroup title="External Connectors">
                <SpecRow k="Monitor Variant" v="HDMI ×1, USB 2.0 ×2, Power ×1" />
                <SpecRow k="ARM / X86 Variant" v="RJ45 ×1, USB 2.0 ×2, Power ×1" />
                <SpecRow k="Optional I/O" v="RS-232/422/485, 4G LTE, Camera, Card Reader" />
              </SpecGroup>
            </div>

            <div className="mt-4 p-3 rounded-md border bg-muted/20 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">หมายเหตุ Architecture (GD156E):</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li><b>Monitor</b> — จอสัมผัสเปล่า HDMI, ไม่มีบอร์ด CPU (ต่อกับ PC/Mini PC ภายนอก)</li>
                <li><b>ARM (Android)</b> — Rockchip RK3568 / RK3399 / RK3588, รองรับ Android 9/11/12, Wi-Fi + Bluetooth + RJ45</li>
                <li><b>X86 (Windows)</b> — Intel Celeron / Core i3-i7, รองรับ Windows 10/11 หรือ Linux — กรุณาแจ้งแอดมินเพื่อรับใบเสนอราคาตามรุ่น CPU</li>
                <li>Compatible: SCADA Software, Square POS / Stripe POS / Clover POS / Shopify POS</li>
                <li><b>ราคา GD156E</b> — รุ่นใหม่ ราคายังไม่ประกาศ กรุณาขอใบเสนอราคา</li>
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <a
                href="https://touchwo.com/wp-content/uploads/2024/11/GD156EARM-15.6inch-Touch-Kiosk-TouchWo-SpecSheet.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border hover:border-primary hover:text-primary"
              >
                <FileText className="w-3.5 h-3.5" /> Spec Sheet — GD156E ARM (PDF)
              </a>
              <a
                href="https://touchwo.com/wp-content/uploads/2024/11/GD156EMonitor-15.6inch-Touch-Kiosk-TouchWo-SpecSheet.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border hover:border-primary hover:text-primary"
              >
                <FileText className="w-3.5 h-3.5" /> Spec Sheet — GD156E Monitor (PDF)
              </a>
            </div>
          </CardContent>
        </Card>
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
            alt="GD156E zoomed"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <Badge variant="secondary" className="absolute bottom-4 left-1/2 -translate-x-1/2">
            {slideIdx + 1} / {gallery.length}
          </Badge>
        </div>
      )}

      <B2BPlatformBanner />
      <RelatedKioskModels currentSlug="gd156e" />
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

function SpecGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1 py-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-primary">{title}</h3>
      <dl className="divide-y divide-border/50">{children}</dl>
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 py-1.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronRight, Monitor, Cpu, Smartphone, Layers, Hand, ShieldCheck, Box,
  Check, Minus, Plus, ShoppingCart, FileText, Phone, MessageCircle, Sparkles,
  Wand2, Wifi, MemoryStick, HardDrive, Zap, ArrowRight, BadgeCheck,
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

/* Estimated indicative prices per variant (THB, 1 unit). Used for the
   quote estimator only — the official price is confirmed by sales. */
const VARIANT_BASE_PRICE: Record<string, number> = {
  monitor: 22990,   // จอเปล่า (ไม่มี PC ในตัว) — ปรับลดลงจาก 28,900
  x86: 68990,       // Windows/Linux x86 base = J6412 Entry (อิงราคาประเมิน)
  android: 42990,   // Android (RK3568 Entry)
};

/* CPU tier delta (THB) — relative to the variant base
   x86: J6412 → i5-8th → i7-10th (สเปกสูงขึ้น ราคาขึ้นตาม)
   android: RK3568 → RK3288 → RK3588 */
const CPU_TIER_DELTA: Record<string, number> = {
  Entry: 0,
  Mid: 18000,    // +18,000 (i5-8th / RK3288)
  High: 38000,   // +38,000 (i7-10th / RK3588 octa-core)
};

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
  const [qty, setQty] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  const variant = useMemo(
    () => PRODUCT.variants?.find((v) => v.key === variantKey) ?? PRODUCT.variants?.[0],
    [variantKey],
  );

  /* CPU tiers filtered to current variant family (x86 vs android) */
  const cpuTiers = useMemo(() => {
    const all = PRODUCT.cpuOptions ?? [];
    if (variantKey === "x86") return all.filter((c) => /Intel|Core|Celeron/i.test(c.cpu));
    if (variantKey === "android") return all.filter((c) => /Rockchip|RK/i.test(c.cpu));
    return [];
  }, [variantKey]);

  const cpuTier = cpuTiers[cpuTierIdx];

  const pricing = useMemo(() => {
    const base = VARIANT_BASE_PRICE[variantKey] ?? 0;
    const cpuDelta = cpuTier ? CPU_TIER_DELTA[cpuTier.tier] ?? 0 : 0;
    const unit = base + cpuDelta;
    const tier = tierMultiplier(qty);
    const tierUnit = Math.round(unit * tier);
    const total = tierUnit * qty;
    const savings = (unit - tierUnit) * qty;
    return { unit, tierUnit, total, savings, cpuDelta, tierPct: Math.round((1 - tier) * 100) };
  }, [variantKey, cpuTier, qty]);

  const buildConfigSummary = () => {
    const parts: string[] = [];
    parts.push(variant?.label ?? PRODUCT.name);
    if (cpuTier) {
      parts.push(`CPU: ${cpuTier.cpu}`);
      parts.push(`RAM: ${cpuTier.ram}`);
      parts.push(`Storage: ${cpuTier.storage}`);
    }
    return parts.join(" • ");
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "กรุณาเข้าสู่ระบบ",
        description: "เข้าสู่ระบบเพื่อบันทึกสินค้าลงตะกร้าและขอใบเสนอราคา",
      });
      navigate("/login?redirect=/shop/displays-15.6");
      return;
    }
    setSubmitting(true);
    await addToCart({
      model: `${PRODUCT.modelCode}-${variantKey.toUpperCase()}${cpuTier ? `-${cpuTier.tier}` : ""}`,
      name: variant?.label ?? PRODUCT.name,
      description: buildConfigSummary(),
      quantity: qty,
      price: pricing.tierUnit,
      configuration: {
        variant: variant?.key,
        variantLabel: variant?.label,
        cpu: cpuTier?.cpu,
        ram: cpuTier?.ram,
        storage: cpuTier?.storage,
        tier: cpuTier?.tier,
      },
    });
    setSubmitting(false);
    toast({
      title: "เพิ่มลงตะกร้าแล้ว",
      description: `${variant?.label} × ${qty} ชิ้น`,
    });
  };

  const handleQuickQuote = () => {
    const product = {
      model: `${PRODUCT.modelCode}-${variantKey.toUpperCase()}${cpuTier ? `-${cpuTier.tier}` : ""}`,
      description: buildConfigSummary(),
      qty,
      unit_price: pricing.tierUnit,
      discount_percent: 0,
      line_total: pricing.total,
    };
    savePendingQuote({
      customer_name: "",
      customer_email: "",
      customer_phone: null,
      customer_company: null,
      notes: `รุ่น: ${variant?.label}\nสเปก: ${buildConfigSummary()}\nจำนวน: ${qty} ชิ้น`,
      products: [product],
    });
    if (!user) {
      navigate("/login?redirect=/my-account/quotes/new");
    } else {
      navigate("/my-account/quotes/new");
    }
  };

  const VariantIcon = (variant?.icon && ICON_MAP[variant.icon as keyof typeof ICON_MAP]) || Monitor;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Shop — KD156B Floor-Stand Touch Kiosk 15.6" | ENT Group</title>
        <meta
          name="description"
          content="เลือกซื้อตู้คีออสก์ตั้งพื้น 15.6 นิ้ว KD156B — มี 3 Configuration: Touch Monitor / Windows x86 / Android เลือก CPU, RAM, Storage และขอใบเสนอราคาออนไลน์"
        />
        <link rel="canonical" href="https://www.entgroup.co.th/shop/displays-15.6" />
      </Helmet>

      <SiteNavbar />

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground flex items-center gap-1.5">
        <Link to="/" className="hover:text-foreground">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products/displays-15.6" className="hover:text-foreground">Display 15.6"</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">{PRODUCT.modelCode}</span>
      </nav>

      {/* HERO */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted/30 border">
              <img
                src={PRODUCT.gallery[0]}
                alt={PRODUCT.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PRODUCT.gallery.slice(1, 5).map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted/30 border">
                  <img src={img} alt={`${PRODUCT.modelCode} ${i + 2}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Info + Configurator */}
          <div className="space-y-5">
            <div>
              <Badge variant="secondary" className="mb-2">
                <Sparkles className="w-3 h-3 mr-1" /> {PRODUCT.category}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {PRODUCT.shortName}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">{PRODUCT.tagline}</p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-2">
              {PRODUCT.highlights.map((h, i) => {
                const Icon = ICON_MAP[h.icon as keyof typeof ICON_MAP] ?? Sparkles;
                return (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/40 border">
                    <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold leading-tight">{h.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">{h.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Variant Selector */}
            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">เลือก Configuration</h3>
                </div>
                <div className="grid gap-2">
                  {PRODUCT.variants?.map((v) => {
                    const VIcon = ICON_MAP[v.icon as keyof typeof ICON_MAP] ?? Monitor;
                    const active = v.key === variantKey;
                    return (
                      <button
                        key={v.key}
                        onClick={() => { setVariantKey(v.key); setCpuTierIdx(0); }}
                        className={cn(
                          "text-left p-3 rounded-lg border transition-all",
                          active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:border-primary/50",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg shrink-0", active ? "bg-primary text-primary-foreground" : "bg-muted")}>
                            <VIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm">{v.label}</p>
                              {active && <Check className="w-4 h-4 text-primary shrink-0" />}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{v.badge}</p>
                            <p className="text-xs mt-1.5 text-foreground/80 line-clamp-2">{v.bestFor}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[10px] text-muted-foreground uppercase">เริ่มต้น</p>
                            <p className="text-sm font-bold text-primary">฿{fmt(VARIANT_BASE_PRICE[v.key] ?? 0)}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* CPU Tier (only for x86 / android) */}
                {cpuTiers.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">เลือกระดับ CPU</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {cpuTiers.map((c, i) => {
                          const active = i === cpuTierIdx;
                          const delta = CPU_TIER_DELTA[c.tier] ?? 0;
                          return (
                            <button
                              key={i}
                              onClick={() => setCpuTierIdx(i)}
                              className={cn(
                                "text-left p-2.5 rounded-md border text-xs transition-all",
                                active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                              )}
                            >
                              <p className="font-bold">{c.tier}</p>
                              <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{c.cpu.split("(")[0].trim()}</p>
                              {delta > 0 && (
                                <p className="text-[10px] text-primary mt-1">+฿{fmt(delta)}</p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {cpuTier && (
                        <div className="bg-muted/40 rounded-md p-2.5 text-[11px] space-y-1">
                          <SpecLine icon={MemoryStick} label="RAM" value={cpuTier.ram} />
                          <SpecLine icon={HardDrive} label="Storage" value={cpuTier.storage} />
                          <SpecLine icon={Wifi} label="GPU" value={cpuTier.gpu} />
                          <p className="text-[10px] text-muted-foreground pt-1 border-t mt-1">
                            <BadgeCheck className="w-3 h-3 inline mr-0.5 text-primary" />
                            เหมาะกับ: {cpuTier.targetUseCase}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator />

                {/* Quantity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">จำนวน</span>
                    {qty >= 5 && (
                      <Badge variant="secondary" className="text-[10px]">ส่วนลด {pricing.tierPct}%</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => setQty(Math.max(1, qty - 1))}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={qty}
                      min={1}
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center font-bold w-20"
                    />
                    <Button size="icon" variant="outline" onClick={() => setQty(qty + 1)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                    <div className="ml-auto flex gap-1">
                      {[5, 10, 50].map((n) => (
                        <Button key={n} size="sm" variant="outline" className="h-9 text-xs" onClick={() => setQty(n)}>
                          {n}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    💡 5+ ชิ้น ลด 7% • 10+ ลด 14% • 50+ ลด 20%
                  </p>
                </div>

                {/* Price summary */}
                <div className="bg-muted/40 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">ราคาเริ่มต้น / ชิ้น</span>
                    <span>฿{fmt(pricing.unit)}</span>
                  </div>
                  {qty >= 5 && (
                    <div className="flex justify-between text-xs text-green-600">
                      <span>ราคาส่ง × {qty}</span>
                      <span>฿{fmt(pricing.tierUnit)} / ชิ้น</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base text-primary">
                    <span>ยอดรวม (โดยประมาณ)</span>
                    <span>฿{fmt(pricing.total)}</span>
                  </div>
                  {pricing.savings > 0 && (
                    <p className="text-[11px] text-green-600 text-center">💰 ประหยัด ฿{fmt(pricing.savings)}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground text-center pt-1 border-t">
                    * ราคาประเมินเบื้องต้น — ยืนยันราคาสุดท้ายในใบเสนอราคา
                  </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAddToCart}
                    disabled={submitting}
                    className="w-full"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                    เพิ่มลงตะกร้า
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleQuickQuote}
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-1.5" />
                    ขอใบเสนอราคา
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground pt-1">
                  <a href="tel:0959244966" className="flex items-center gap-1 hover:text-primary">
                    <Phone className="w-3 h-3" /> 095-924-4966
                  </a>
                  <span>•</span>
                  <Link to="/contact" className="flex items-center gap-1 hover:text-primary">
                    <MessageCircle className="w-3 h-3" /> สอบถามแอดมิน
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <VariantIcon className="w-5 h-5 text-primary" />
          จุดเด่น {variant?.label}
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {variant?.highlights?.map((h, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg border bg-muted/20">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm">{h}</p>
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">ใช้งานเหมาะกับ</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRODUCT.useCases.map((uc, i) => (
            <Card key={i} className="bg-muted/20">
              <CardContent className="p-3 text-center">
                <Zap className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-sm font-medium">{uc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* QUICK SPECS */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">สเปกโดยย่อ</h2>
        <Card>
          <CardContent className="p-4 grid sm:grid-cols-2 gap-2">
            {PRODUCT.quick && Object.entries(PRODUCT.quick).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                <span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1").trim()}</span>
                <span className="font-medium text-right">{String(v)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="text-center mt-4">
          <Button variant="outline" asChild>
            <Link to="/products/displays-15.6">
              ดูสเปกแบบเต็ม <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SpecLine({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3 h-3 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import SiteNavbar from '@/components/SiteNavbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { savePendingQuote } from '@/hooks/usePendingQuote';
import {
  ArrowLeft, Package, FileText, ShoppingCart, Sparkles, Check, ExternalLink, Phone,
  ShieldCheck, Settings2, Image as ImageIcon, Ruler, Cable, ListChecks, Download, Factory,
  Cpu, MemoryStick, HardDrive, Wifi, MonitorCog, Thermometer, Zap, Wrench, Plus, MessageCircle, Gift, TrendingDown, ChevronDown,
} from 'lucide-react';
import LineQRButton from '@/components/LineQRButton';
import ProductImageGalleryZoom from '@/components/shop/ProductImageGalleryZoom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { epcModelDetails, epcModelList, type EpcModelDetail } from '@/data/epcModelDetails';

interface Props {
  slug: keyof typeof epcModelDetails | string;
}

export default function ShopEpcDetailBase({ slug }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const detail: EpcModelDetail | undefined = epcModelDetails[slug];
  const cfg = detail?.configurator;
  const fmt = (n: number) => n.toLocaleString('th-TH');

  // Configurator state (only used when cfg present) — hooks must run unconditionally
  const [cpuKey, setCpuKey] = useState<string>(cfg?.cpus[0]?.key ?? '');
  const [ramKey, setRamKey] = useState<string>(cfg?.ram[0]?.key ?? '');
  const [storageKey, setStorageKey] = useState<string>(cfg?.storage[0]?.key ?? '');
  const [touchKey, setTouchKey] = useState<string>(cfg?.touch[0]?.key ?? '');
  const [wirelessKey, setWirelessKey] = useState<string>(cfg?.wireless[0]?.key ?? '');
  const [osKey, setOsKey] = useState<string>(cfg?.os[0]?.key ?? '');
  const [tempKey, setTempKey] = useState<string>(cfg?.tempRange[0]?.key ?? '');
  const [powerKey, setPowerKey] = useState<string>(cfg?.powerInput[0]?.key ?? '');
  const [warrantyYears, setWarrantyYears] = useState<1 | 2 | 3>(1);

  const related = useMemo(
    () => epcModelList.filter((d) => d.series === detail?.series && d.slug !== slug).slice(0, 4),
    [detail?.series, slug]
  );

  if (!detail) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteNavbar />
        <div className="container max-w-7xl mx-auto px-4 py-20 text-center flex-1">
          <h1 className="text-2xl font-bold mb-2">ไม่พบรุ่นสินค้า</h1>
          <Button onClick={() => navigate('/shop')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> กลับไปหน้า Shop
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const seriesParam = detail.series === 'EPC Panel PC' ? 'EPC+Panel+PC' : 'EPC+Box';

  // ── Configurator price calculation (only meaningful when cfg present) ──
  const cpuOpt      = cfg?.cpus.find((c) => c.key === cpuKey)         ?? cfg?.cpus[0];
  const ramOpt      = cfg?.ram.find((r) => r.key === ramKey)          ?? cfg?.ram[0];
  const storageOpt  = cfg?.storage.find((s) => s.key === storageKey)  ?? cfg?.storage[0];
  const touchOpt    = cfg?.touch.find((t) => t.key === touchKey)      ?? cfg?.touch[0];
  const wirelessOpt = cfg?.wireless.find((w) => w.key === wirelessKey)?? cfg?.wireless[0];
  const osOpt       = cfg?.os.find((o) => o.key === osKey)            ?? cfg?.os[0];
  const tempOpt     = cfg?.tempRange.find((t) => t.key === tempKey)   ?? cfg?.tempRange[0];
  const powerOpt    = cfg?.powerInput.find((p) => p.key === powerKey) ?? cfg?.powerInput[0];
  const warrantyOpt = cfg?.warranty.find((w) => w.years === warrantyYears) ?? cfg?.warranty[0];

  const baseUnit = (cpuOpt?.basePrice ?? 0)
    + (ramOpt?.addPrice ?? 0)
    + (storageOpt?.addPrice ?? 0)
    + (touchOpt?.addPrice ?? 0)
    + (wirelessOpt?.addPrice ?? 0)
    + (osOpt?.addPrice ?? 0)
    + (tempOpt?.addPrice ?? 0)
    + (powerOpt?.addPrice ?? 0);
  const warrantyCost = Math.round(baseUnit * (warrantyOpt?.multiplier ?? 0));
  const tierRate  = qty >= 50 ? 0.08 : qty >= 10 ? 0.05 : qty >= 5 ? 0.03 : 0;
  const tierLabel = qty >= 50 ? 'สั่ง 50+ ชิ้น' : qty >= 10 ? 'สั่ง 10+ ชิ้น' : qty >= 5 ? 'สั่ง 5+ ชิ้น' : '';
  const unitBefore = baseUnit + warrantyCost;
  const unitAfter  = Math.round(unitBefore * (1 - tierRate));
  const totalPrice = unitAfter * qty;
  const savings    = (unitBefore - unitAfter) * qty;

  const buildDescription = () => {
    if (!cfg || !cpuOpt) return `${detail.model} — ${detail.tagline}`;
    const parts: string[] = [
      detail.model,
      cpuOpt.label,
      `RAM ${ramOpt?.label}`,
      storageOpt?.label,
      `จอ ${touchOpt?.label}`,
    ];
    if (wirelessOpt && wirelessOpt.key !== 'none') parts.push(wirelessOpt.label);
    if (osOpt && osOpt.key !== 'none') parts.push(`OS: ${osOpt.label}`);
    if (tempOpt && tempOpt.key !== 'standard') parts.push(tempOpt.label);
    if (powerOpt && powerOpt.key !== 'dc12') parts.push(powerOpt.label);
    parts.push(warrantyOpt?.label ?? 'รับประกัน 1 ปี');
    return parts.filter(Boolean).join(' • ');
  };

  const handleQuickQuote = () => {
    savePendingQuote({
      customer_name: '', customer_email: user?.email ?? '', customer_phone: null, customer_company: null,
      notes: cfg
        ? `รุ่น ${detail.model} ตามสเปก: ${buildDescription()}`
        : `รุ่น ${detail.model} (${detail.series}) — กรุณาระบุสเปก CPU/RAM/SSD ที่ต้องการ`,
      products: [{
        model: detail.model, description: buildDescription(), qty,
        unit_price: cfg ? unitAfter : 0, discount_percent: 0,
        line_total: cfg ? totalPrice : 0,
      }],
    });
    toast({
      title: 'พร้อมส่งคำขอใบเสนอราคา',
      description: cfg ? `${detail.model} × ${qty} ชิ้น • ฿${fmt(totalPrice)}` : `${detail.model} × ${qty} ชิ้น`,
    });
    navigate('/request-quote?action=continue');
  };

  const handleAddToCart = async () => {
    if (!user) {
      savePendingQuote({
        customer_name: '', customer_email: '', customer_phone: null, customer_company: null,
        notes: cfg ? `กำหนดสเปก: ${buildDescription()}` : `สนใจ ${detail.model} (${detail.series})`,
        products: [{
          model: detail.model, description: buildDescription(), qty,
          unit_price: cfg ? unitAfter : 0, discount_percent: 0,
          line_total: cfg ? totalPrice : 0,
        }],
      });
      toast({ title: 'บันทึกรายการแล้ว', description: 'กรุณาเข้าสู่ระบบเพื่อเพิ่มลงตะกร้า' });
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setAdding(true);
    try {
      await addToCart({
        model: detail.model,
        name: `${detail.model} — ${detail.series}`,
        description: buildDescription(),
        quantity: qty,
        price: cfg ? unitAfter : 0,
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`${detail.model} — ${detail.tagline} | ENT Group`}
        description={detail.intro.slice(0, 155)}
        path={`/shop/${detail.slug}`}
      />
      <SiteNavbar />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 py-3 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>›</span>
          <Link to={`/shop?series=${seriesParam}`} className="hover:text-primary">{detail.series}</Link>
          <span>›</span>
          <span className="text-foreground font-medium">{detail.model}</span>
          <div className="ml-auto flex gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 gap-1.5">
              <Link to={detail.landingHref}>
                <ExternalLink className="w-3.5 h-3.5" />
                หน้ารายละเอียดซีรีส์
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            {(() => {
              const heroImages = (detail.heroImages && detail.heroImages.length > 0)
                ? detail.heroImages
                : [detail.image, ...(detail.productImages?.map((p) => p.src) ?? [])]
                    .filter((src, i, arr) => !!src && arr.indexOf(src) === i);
              return (
                <ProductImageGalleryZoom
                  images={heroImages}
                  alt={detail.model}
                  enableZoom
                />
              );
            })()}
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{detail.series}</Badge>
              {detail.popular && <Badge className="bg-primary/10 text-primary border-primary/20">ยอดนิยม</Badge>}
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{detail.model}</h1>
              <p className="text-lg text-muted-foreground mt-1">{detail.tagline}</p>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{detail.intro}</p>

            <ul className="grid grid-cols-2 gap-2">
              {detail.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <Separator />

            {/* RFQ CTA / Quick price preview */}
            {cfg && cpuOpt ? (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">เริ่มต้นที่</p>
                      <p className="text-3xl font-bold text-primary">฿{fmt(cfg.cpus[0].basePrice)}</p>
                      <p className="text-[11px] text-muted-foreground">ราคายังไม่รวม VAT 7% • กำหนดสเปกด้านล่าง</p>
                    </div>
                    <Button size="lg" onClick={() => document.getElementById('w24x2a-configurator')?.scrollIntoView({ behavior: 'smooth' })}>
                      <Wrench className="w-4 h-4 mr-2" /> กำหนดสเปก
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-foreground">ขอใบเสนอราคา (RFQ)</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    รุ่นนี้กำหนดสเปก CPU / RAM / Storage / I/O ได้ตามต้องการ — ทีมงานจะติดต่อกลับภายใน 1 วันทำการ
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">จำนวน</label>
                    <input
                      type="number" min={1} value={qty}
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
                      className="w-20 h-9 px-2 rounded-md border border-border bg-background text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button onClick={handleQuickQuote} className="gap-2">
                      <FileText className="w-4 h-4" /> ขอใบเสนอราคา
                    </Button>
                    <Button onClick={handleAddToCart} variant="outline" disabled={adding} className="gap-2">
                      <ShoppingCart className="w-4 h-4" /> {adding ? 'กำลังเพิ่ม…' : 'เพิ่มลงตะกร้า'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button asChild size="sm" variant="ghost" className="gap-1.5 text-xs">
                      <a href="tel:+66818268468"><Phone className="w-3.5 h-3.5" /> 081-826-8468</a>
                    </Button>
                    <LineQRButton className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md hover:bg-muted">
                      💬 LINE
                    </LineQRButton>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* CONFIGURATOR — only when cfg present (W24X2A) */}
      {cfg && cpuOpt && (
        <section id="w24x2a-configurator" className="container max-w-7xl mx-auto px-4 py-6 lg:py-10 scroll-mt-20">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">ปรับแต่งสเปก</h2>
              <p className="text-sm text-muted-foreground">เลือก CPU / RAM / Storage / Wireless / OS / อุณหภูมิ / Power / รับประกัน — คำนวณราคาตามสเปกจริง</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Left: build sheet */}
            <Card className="lg:col-span-2">
              <CardContent className="p-5 space-y-5">
                {/* CPU */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Cpu className="w-4 h-4 text-primary" /> CPU / Processor
                    <Badge variant="outline" className="text-[10px] ml-auto">{cfg.cpus.length} ตัวเลือก</Badge>
                  </div>
                  <Select value={cpuKey} onValueChange={setCpuKey}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {cfg.cpus.map((c) => {
                        const diff = c.basePrice - cfg.cpus[0].basePrice;
                        return (
                          <SelectItem key={c.key} value={c.key}>
                            <span className="flex items-center justify-between gap-3 w-full">
                              <span>{c.label}</span>
                              <span className="text-xs text-muted-foreground">฿{fmt(c.basePrice)}{diff > 0 ? ` (+฿${fmt(diff)})` : ''}</span>
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {cpuOpt && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-[11px]">
                      <div className="px-2 py-1 rounded bg-muted/40"><span className="text-muted-foreground">Cores/Threads:</span> <span className="font-medium">{cpuOpt.cores}/{cpuOpt.threads}</span></div>
                      <div className="px-2 py-1 rounded bg-muted/40"><span className="text-muted-foreground">Freq:</span> <span className="font-medium">{cpuOpt.freq}</span></div>
                      <div className="px-2 py-1 rounded bg-muted/40"><span className="text-muted-foreground">Cache:</span> <span className="font-medium">{cpuOpt.cache}</span></div>
                      <div className="px-2 py-1 rounded bg-muted/40"><span className="text-muted-foreground">TDP:</span> <span className="font-medium">{cpuOpt.tdp}</span></div>
                      <div className="px-2 py-1 rounded bg-muted/40 col-span-2"><span className="text-muted-foreground">GPU:</span> <span className="font-medium">{cpuOpt.graphics}</span></div>
                      <div className="px-2 py-1 rounded bg-muted/40 col-span-2"><span className="text-muted-foreground">Factory Model:</span> <span className="font-medium">{cpuOpt.baseModel}</span></div>
                    </div>
                  )}
                </div>

                {/* RAM + Storage */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold"><MemoryStick className="w-4 h-4 text-primary" /> RAM</div>
                    <p className="text-[11px] text-muted-foreground">{cpuOpt.memorySupport}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cfg.ram.map((r) => (
                        <button key={r.key} type="button" onClick={() => setRamKey(r.key)}
                          className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                            ramKey === r.key ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-background border-border hover:border-primary/50 text-foreground')}>
                          {r.label}{r.addPrice > 0 && <span className={cn('ml-1.5', ramKey === r.key ? 'opacity-90' : 'text-muted-foreground')}>+฿{fmt(r.addPrice)}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold"><HardDrive className="w-4 h-4 text-primary" /> Storage</div>
                    <p className="text-[11px] text-muted-foreground">{cpuOpt.storageSupport}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cfg.storage.map((s) => (
                        <button key={s.key} type="button" onClick={() => setStorageKey(s.key)}
                          className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                            storageKey === s.key ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-background border-border hover:border-primary/50 text-foreground')}>
                          {s.label}{s.addPrice > 0 && <span className={cn('ml-1.5', storageKey === s.key ? 'opacity-90' : 'text-muted-foreground')}>+฿{fmt(s.addPrice)}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Touch + Wireless */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold"><Settings2 className="w-4 h-4 text-primary" /> ชนิดจอสัมผัส</div>
                    <div className="space-y-1">
                      {cfg.touch.map((t) => (
                        <button key={t.key} type="button" onClick={() => setTouchKey(t.key)}
                          className={cn('w-full text-left p-2.5 rounded-md border text-xs transition-all',
                            touchKey === t.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5">
                              {touchKey === t.key && <Check className="w-3 h-3 text-primary" />}
                              {t.label}
                            </span>
                            <span className="font-medium text-muted-foreground">{t.addPrice === 0 ? 'รวม' : `+฿${fmt(t.addPrice)}`}</span>
                          </div>
                          {t.note && <p className="text-[10px] text-muted-foreground mt-0.5">{t.note}</p>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold"><Wifi className="w-4 h-4 text-primary" /> Wireless / 4G</div>
                    <div className="space-y-1">
                      {cfg.wireless.map((w) => (
                        <button key={w.key} type="button" onClick={() => setWirelessKey(w.key)}
                          className={cn('w-full text-left p-2.5 rounded-md border text-xs transition-all',
                            wirelessKey === w.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5">
                              {wirelessKey === w.key && <Check className="w-3 h-3 text-primary" />}
                              {w.label}
                            </span>
                            <span className="font-medium text-muted-foreground">{w.addPrice === 0 ? 'ฟรี' : `+฿${fmt(w.addPrice)}`}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* OS + Temp */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold"><MonitorCog className="w-4 h-4 text-primary" /> ระบบปฏิบัติการ</div>
                    <div className="space-y-1">
                      {cfg.os.map((o) => (
                        <button key={o.key} type="button" onClick={() => setOsKey(o.key)}
                          className={cn('w-full text-left p-2.5 rounded-md border text-xs transition-all',
                            osKey === o.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5">
                              {osKey === o.key && <Check className="w-3 h-3 text-primary" />}
                              {o.label}
                            </span>
                            <span className="font-medium text-muted-foreground">{o.addPrice === 0 ? 'ฟรี' : `+฿${fmt(o.addPrice)}`}</span>
                          </div>
                          {o.note && <p className="text-[10px] text-muted-foreground mt-0.5">{o.note}</p>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold"><Thermometer className="w-4 h-4 text-primary" /> ช่วงอุณหภูมิใช้งาน</div>
                    <div className="space-y-1">
                      {cfg.tempRange.map((t) => (
                        <button key={t.key} type="button" onClick={() => setTempKey(t.key)}
                          className={cn('w-full text-left p-2.5 rounded-md border text-xs transition-all',
                            tempKey === t.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5">
                              {tempKey === t.key && <Check className="w-3 h-3 text-primary" />}
                              {t.label}
                            </span>
                            <span className="font-medium text-muted-foreground">{t.addPrice === 0 ? 'รวม' : `+฿${fmt(t.addPrice)}`}</span>
                          </div>
                          {t.note && <p className="text-[10px] text-muted-foreground mt-0.5">{t.note}</p>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Power + Warranty + Qty */}
                <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold"><Zap className="w-4 h-4 text-primary" /> Power Input</div>
                    <div className="space-y-1">
                      {cfg.powerInput.map((p) => (
                        <button key={p.key} type="button" onClick={() => setPowerKey(p.key)}
                          className={cn('w-full text-left p-2 rounded-md border text-[11px] transition-all',
                            powerKey === p.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                          <div className="flex items-center justify-between gap-2">
                            <span>{p.label}</span>
                            <span className="font-medium text-muted-foreground">{p.addPrice === 0 ? 'รวม' : `+฿${fmt(p.addPrice)}`}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="w-4 h-4 text-primary" /> รับประกัน</div>
                    <div className="space-y-1">
                      {cfg.warranty.map((w) => {
                        const cost = Math.round(baseUnit * w.multiplier);
                        return (
                          <button key={w.years} type="button" onClick={() => setWarrantyYears(w.years)}
                            className={cn('w-full flex items-center justify-between px-2 py-1.5 rounded-md border text-xs transition-all',
                              warrantyYears === w.years ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                            <span>{w.label}</span>
                            <span className="font-medium">{cost === 0 ? 'รวม' : `+฿${fmt(cost)}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="w-4 h-4 text-primary" /> จำนวน</div>
                    <div className="flex items-center border border-border rounded-md w-fit">
                      <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 hover:bg-muted text-sm font-bold">−</button>
                      <input type="number" min={1} value={qty}
                        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center text-sm font-semibold bg-transparent outline-none" />
                      <button type="button" onClick={() => setQty(qty + 1)} className="px-3 py-1.5 hover:bg-muted text-sm font-bold">+</button>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {[5, 10, 50].map((q) => (
                        <button key={q} type="button" onClick={() => setQty(q)}
                          className={cn('text-[11px] px-2 py-1 rounded border transition-all',
                            qty === q ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50')}>
                          {q}+
                        </button>
                      ))}
                    </div>
                    {tierRate > 0 && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> {tierLabel} — ลด {(tierRate * 100).toFixed(0)}%
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: sticky price summary + contact */}
            <div className="lg:sticky lg:top-20 lg:self-start space-y-3">
              <Card className="border-primary/30 shadow-md">
                <CardContent className="p-5 space-y-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">สรุปราคา</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground truncate pr-2">{cpuOpt.label}</span><span>฿{fmt(cpuOpt.basePrice)}</span></div>
                    {ramOpt && ramOpt.addPrice > 0 && <div className="flex justify-between"><span className="text-muted-foreground">+ RAM {ramOpt.label}</span><span>฿{fmt(ramOpt.addPrice)}</span></div>}
                    {storageOpt && storageOpt.addPrice > 0 && <div className="flex justify-between"><span className="text-muted-foreground">+ {storageOpt.label}</span><span>฿{fmt(storageOpt.addPrice)}</span></div>}
                    {wirelessOpt && wirelessOpt.addPrice > 0 && <div className="flex justify-between"><span className="text-muted-foreground truncate pr-2">+ {wirelessOpt.label}</span><span>฿{fmt(wirelessOpt.addPrice)}</span></div>}
                    {osOpt && osOpt.addPrice > 0 && <div className="flex justify-between"><span className="text-muted-foreground truncate pr-2">+ {osOpt.label}</span><span>฿{fmt(osOpt.addPrice)}</span></div>}
                    {tempOpt && tempOpt.addPrice > 0 && <div className="flex justify-between"><span className="text-muted-foreground truncate pr-2">+ {tempOpt.label}</span><span>฿{fmt(tempOpt.addPrice)}</span></div>}
                    {powerOpt && powerOpt.addPrice > 0 && <div className="flex justify-between"><span className="text-muted-foreground truncate pr-2">+ {powerOpt.label}</span><span>฿{fmt(powerOpt.addPrice)}</span></div>}
                    {warrantyCost > 0 && <div className="flex justify-between"><span className="text-muted-foreground">+ {warrantyOpt?.label}</span><span>฿{fmt(warrantyCost)}</span></div>}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ราคา/ชิ้น</span>
                    <span className="font-semibold">฿{fmt(unitAfter)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-primary border-t border-border pt-2">
                    <span>รวม × {qty}</span>
                    <span>฿{fmt(totalPrice)}</span>
                  </div>
                  {savings > 0 && (
                    <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 font-medium">💰 ประหยัด ฿{fmt(savings)}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground text-center">ราคายังไม่รวม VAT 7%</p>
                  <div className="space-y-2 pt-2">
                    <Button onClick={handleAddToCart} disabled={adding} variant="outline" className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {adding ? 'กำลังเพิ่ม...' : 'เพิ่มลงตะกร้า'}
                    </Button>
                    <Button onClick={handleQuickQuote} className="w-full">
                      <FileText className="w-4 h-4 mr-2" /> ขอใบเสนอราคาเลย
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* PR Banner: สอบถามโปรโมชั่น (เหมือนหน้า /shop/upc/epc-102b) */}
              <Card className="border-amber-400/40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 shadow-sm">
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                      <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-foreground">สอบถามโปรโมชั่นพิเศษ</div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        ส่วนลด • ของแถม • ข้อเสนอพิเศษสำหรับโครงการ — ติดต่อทีมแอดมินได้เลย
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1">
                    <a href="tel:020456104" className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-background/80 border border-border hover:border-primary/50 text-xs font-medium transition-colors">
                      <Phone className="w-3.5 h-3.5 text-primary" /> 02-045-6104
                    </a>
                    <a href="tel:0957391053" className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-background/80 border border-border hover:border-primary/50 text-xs font-medium transition-colors">
                      <Phone className="w-3.5 h-3.5 text-primary" /> 095-739-1053
                    </a>
                    <LineQRButton className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md text-xs font-semibold border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                      <MessageCircle className="w-4 h-4" /> เพิ่มเพื่อน LINE @entgroup
                    </LineQRButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Certifications & Datasheet bar */}
      {(detail.certifications?.length || detail.datasheetUrl) && (
        <section className="container max-w-7xl mx-auto px-4 pt-2 pb-4">
          <Card className="bg-muted/30">
            <CardContent className="p-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              {detail.certifications && detail.certifications.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Certifications:</span>
                  </div>
                  {detail.certifications.map((c) => (
                    <Badge key={c.code} variant="outline" className="border-primary/30 text-foreground" title={c.description}>
                      {c.code}
                    </Badge>
                  ))}
                </div>
              )}
              {detail.datasheetUrl && (
                <Button asChild size="sm" variant="outline" className="ml-auto gap-1.5">
                  <a href={detail.datasheetUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-3.5 h-3.5" /> Datasheet (PDF)
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Product Images & Sizes */}
      {detail.productImages && detail.productImages.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Product Images & Sizes</h2>
              <p className="text-sm text-muted-foreground">มิติและตำแหน่ง I/O ของตัวเครื่องตามแบบโรงงาน</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {detail.productImages.map((img, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="bg-white p-4 flex items-center justify-center min-h-[200px]">
                  <img src={img.src} alt={img.alt} loading="lazy" className="max-w-full max-h-[280px] object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                {img.caption && (
                  <CardContent className="p-3 text-xs text-muted-foreground border-t border-border">{img.caption}</CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Specs */}
      <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <details className="group">
          <summary className="flex items-start gap-3 mb-4 cursor-pointer list-none select-none">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-foreground">Specifications</h2>
                <Badge variant="outline" className="text-[10px]">คลิกเพื่อดูสเปกโรงงานทั้งหมด</Badge>
              </div>
              <p className="text-sm text-muted-foreground">ข้อมูลตามสเปกโรงงาน — กำหนดได้ตามความต้องการ (ดูตัวเลือกที่ปรับแต่งได้ด้านบน)</p>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180 mt-2" />
          </summary>

          {detail.specGroups && detail.specGroups.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {detail.specGroups.map((g) => (
                <Card key={g.title}>
                  <CardContent className="p-0">
                    <div className="px-4 py-3 border-b border-border bg-muted/40">
                      <h3 className="text-sm font-bold text-foreground">{g.title}</h3>
                    </div>
                    <dl className="divide-y divide-border">
                      {g.rows.map((s) => (
                        <div key={s.label} className="grid grid-cols-3 gap-3 p-3 text-sm">
                          <dt className="text-muted-foreground col-span-1">{s.label}</dt>
                          <dd className="col-span-2 font-medium">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <dl className="divide-y divide-border">
                  {detail.specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-3 gap-3 p-3 text-sm">
                      <dt className="text-muted-foreground col-span-1">{s.label}</dt>
                      <dd className="col-span-2 font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}
        </details>
      </section>

      {/* Configurable Options */}
      {detail.options && detail.options.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">ตัวเลือกที่ปรับแต่งได้</h2>
              <p className="text-sm text-muted-foreground">เลือกสเปกที่ต้องการ แล้วระบุในใบขอใบเสนอราคา (RFQ)</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {detail.options.map((opt) => (
              <Card key={opt.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-foreground">{opt.label}</h3>
                    <Badge variant="secondary" className="text-[10px]">{opt.choices.length} ตัวเลือก</Badge>
                  </div>
                  {opt.note && <p className="text-xs text-muted-foreground mb-2">{opt.note}</p>}
                  <ul className="space-y-1.5">
                    {opt.choices.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 text-primary mt-1 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Selection Table */}
      {detail.selectionTable && detail.selectionTable.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Product Selection Guide</h2>
              <p className="text-sm text-muted-foreground">รหัสสินค้าตามรุ่น CPU — ใช้อ้างอิงเวลาขอใบเสนอราคา</p>
            </div>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-semibold w-10">#</th>
                    <th className="px-3 py-2 font-semibold">Model</th>
                    <th className="px-3 py-2 font-semibold">Part Number</th>
                    <th className="px-3 py-2 font-semibold">CPU</th>
                    <th className="px-3 py-2 font-semibold">RAM</th>
                    <th className="px-3 py-2 font-semibold">Storage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {detail.selectionTable.map((r) => (
                    <tr key={r.partNumber} className="hover:bg-muted/30">
                      <td className="px-3 py-2 text-muted-foreground">{r.no}</td>
                      <td className="px-3 py-2 font-medium">{r.model}</td>
                      <td className="px-3 py-2 font-mono text-xs">{r.partNumber}</td>
                      <td className="px-3 py-2">{r.cpu}</td>
                      <td className="px-3 py-2">{r.memory}</td>
                      <td className="px-3 py-2">{r.storage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Applications */}
      {detail.applications && detail.applications.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Factory className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Applications</h2>
              <p className="text-sm text-muted-foreground">อุตสาหกรรมและการใช้งานที่เหมาะสม</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {detail.applications.map((a) => (
              <Card key={a} className="p-3 flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">{a}</span>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Industries & Applications (S-Series only) — Visual showcase */}
      {typeof slug === 'string' && slug.startsWith('epc-s') && (
        <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Factory className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Industries & Real-World Applications</h2>
              <p className="text-sm text-muted-foreground">
                ตัวอย่างการนำ Panel PC ไปใช้งานในอุตสาหกรรมไทย — พร้อม Total Solution จาก ENT Group
              </p>
            </div>
          </div>

          {/* ENT Differentiation Badges */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <Card className="p-4 border-primary/30 bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Exclusive Authorized Partner</div>
                  <div className="text-xs text-muted-foreground mt-0.5">ตัวแทนจำหน่ายอย่างเป็นทางการเพียงรายเดียวในประเทศไทย</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-primary/30 bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Local Service & Support</div>
                  <div className="text-xs text-muted-foreground mt-0.5">ทีมวิศวกรไทย ดูแลตลอดอายุการใช้งาน รับประกันถึงหน้างาน</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-primary/30 bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Total Solution</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Hardware + Software + System Integration ครบวงจรในที่เดียว</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Industry showcase grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                src: '/images/applications/smart-factory.jpg',
                title: 'Smart Factory & Production Line',
                subtitle: 'HMI ข้างเครื่องจักร · SCADA · MES Dashboard',
                desc: 'ติดตั้งบนแขนสแตนเลสข้างเครื่อง CNC, Robot, Conveyor — ติดตาม OEE, Production KPI แบบเรียลไทม์',
              },
              {
                src: '/images/applications/food-pharma.jpg',
                title: 'Food, Beverage & Pharma',
                subtitle: 'IP65 Wash-down · Batch Control · Recipe Management',
                desc: 'หน้าจอกันน้ำกันฝุ่น IP65 รองรับการล้างทำความสะอาดแรงดันสูง เหมาะสำหรับโรงงานอาหารและยา',
              },
              {
                src: '/images/applications/logistics-wms.jpg',
                title: 'Logistics & Warehouse (WMS)',
                subtitle: 'Packing Station · Barcode · Inventory Tracking',
                desc: 'ใช้คู่กับ Barcode Scanner ที่ Packing Station — บริหารสต็อก, Order Picking, Shipping ครบจบในจอเดียว',
              },
              {
                src: '/images/applications/energy-utilities.jpg',
                title: 'Energy, Oil & Gas, Utilities',
                subtitle: 'Substation · Control Room · Grid Monitoring',
                desc: 'ทนทานในสภาพแวดล้อมหนัก รองรับการมอนิเตอร์ Power Grid, Solar Farm, Substation 24/7',
              },
            ].map((item) => (
              <Card key={item.title} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted overflow-hidden relative">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-base font-bold text-foreground drop-shadow-sm">{item.title}</div>
                    <div className="text-xs text-foreground/80 mt-0.5">{item.subtitle}</div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <Card className="mt-6 p-4 lg:p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-foreground">ต้องการคำปรึกษาเฉพาะอุตสาหกรรมของคุณ?</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    ทีมวิศวกร ENT Group พร้อมออกแบบระบบ HMI/SCADA/WMS ให้ตรงโจทย์โรงงานคุณ
                  </div>
                </div>
              </div>
              <LineQRButton className="inline-flex items-center gap-2 rounded-md bg-[#06C755] hover:bg-[#05b34a] text-white px-4 py-2 text-sm font-medium shadow-sm transition-colors shrink-0">
                <MessageCircle className="w-4 h-4" />
                ปรึกษา LINE @entgroup
              </LineQRButton>
            </div>
          </Card>
        </section>
      )}

      {/* Gallery */}
      {detail.gallery && detail.gallery.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Gallery</h2>
              <p className="text-sm text-muted-foreground">ภาพสินค้าและการใช้งานจริงในอุตสาหกรรม</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {detail.gallery.map((g, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  <img src={g.src} alt={g.alt} loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                {g.caption && <CardContent className="p-2 text-xs text-muted-foreground">{g.caption}</CardContent>}
              </Card>
            ))}
          </div>
        </section>
      )}


      {/* Related */}
      {related.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">รุ่นอื่นใน {detail.series}</h2>
              <p className="text-sm text-muted-foreground">รุ่นในตระกูลเดียวกันที่อาจเหมาะกับคุณ</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((r) => (
              <Link key={r.slug} to={`/shop/${r.slug}`} className="group">
                <Card className="h-full hover:border-primary transition-all hover:shadow-md">
                  <div className="aspect-[4/3] bg-muted rounded-t-lg overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={r.image} alt={r.model}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/product-placeholder.svg'; }}
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="font-bold text-sm">{r.model}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.tagline}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

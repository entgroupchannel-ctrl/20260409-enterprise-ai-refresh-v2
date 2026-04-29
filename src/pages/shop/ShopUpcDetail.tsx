import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import SiteNavbar from '@/components/SiteNavbar';
import Footer from '@/components/Footer';
import {
  Cpu, MemoryStick, HardDrive, ShieldCheck, Sparkles, TrendingDown, Check,
  ShoppingCart, FileText, ChevronLeft, ChevronRight, ZoomIn, Wifi, Signal,
  MonitorCog, Wrench, Plus, ArrowLeft, Package, Award, Cable, Phone, MessageCircle, Gift,
} from 'lucide-react';
import LineQRButton from '@/components/LineQRButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { savePendingQuote } from '@/hooks/usePendingQuote';
import { cn } from '@/lib/utils';
import {
  findPricing, RAM_UPGRADES, SSD_UPGRADES, WARRANTY_OPTIONS, tierDiscount,
} from '@/data/upcPricing';
import { upcSeriesDetails } from '@/data/upcSeriesDetails';
import { upcDimensionImages } from '@/data/upcDimensionImages';

const fmt = (n: number) => n.toLocaleString('th-TH');

/* ── Add-on Catalog ── */
type AddOnId = 'wifi-bt' | '4g-lte' | 'os-win11' | 'os-ubuntu';
const ADDONS: { id: AddOnId; label: string; price: number; group: 'wireless' | 'os'; icon: React.ElementType; desc: string }[] = [
  { id: 'wifi-bt', label: 'Wi-Fi 6 + Bluetooth 5.2 Module', price: 1500, group: 'wireless', icon: Wifi, desc: 'รองรับ Dual-band 2.4/5GHz + BT 5.2' },
  { id: '4g-lte', label: '4G LTE Module + SIM Slot', price: 3500, group: 'wireless', icon: Signal, desc: 'รองรับ Nano-SIM, Cat.4 ความเร็ว 150Mbps' },
  { id: 'os-win11', label: 'Windows 11 Pro Pre-installed', price: 4500, group: 'os', icon: MonitorCog, desc: 'License แท้ + Activation พร้อมใช้' },
  { id: 'os-ubuntu', label: 'Ubuntu 22.04 LTS Pre-installed', price: 0, group: 'os', icon: MonitorCog, desc: 'ฟรี — Long-term support ถึง 2027' },
];

/* ── Sub-components ── */
function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children, sub }: { active: boolean; onClick: () => void; children: React.ReactNode; sub?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
        active
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-background border-border hover:border-primary/50 text-foreground'
      )}
    >
      {children}
      {sub && <span className={cn('ml-1.5', active ? 'opacity-90' : 'text-muted-foreground')}>{sub}</span>}
    </button>
  );
}

export default function ShopUpcDetail({ modelOverride }: { modelOverride?: string } = {}) {
  const { model: modelParam } = useParams<{ model: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();

  // Allow wrapper pages (e.g. /shop/epc-10xa) to force a model without URL param
  const effectiveParam = modelOverride ?? modelParam ?? '';
  // Normalize: route uses lowercase (e.g. "epc-102b"), pricing uses uppercase ("EPC-102B")
  const modelKey = useMemo(() => effectiveParam.toUpperCase(), [effectiveParam]);
  const detailKey = useMemo(() => effectiveParam.toLowerCase(), [effectiveParam]);

  const pricing = useMemo(() => findPricing(modelKey), [modelKey]);
  const detail = upcSeriesDetails[detailKey];
  const dimensionImgs = upcDimensionImages[detailKey] ?? [];

  /* ── Configurator state ── */
  const [cpuKey, setCpuKey] = useState<string>(pricing?.cpus[0]?.cpu ?? '');
  const [ramGb, setRamGb] = useState<number>(4);
  const [ssdGb, setSsdGb] = useState<number>(128);
  const [warrantyYears, setWarrantyYears] = useState<1 | 2 | 3>(1);
  const [qty, setQty] = useState<number>(1);
  const [addons, setAddons] = useState<Set<AddOnId>>(new Set(['os-ubuntu']));
  const [adding, setAdding] = useState(false);

  /* ── Gallery state ── */
  const galleryImages = useMemo(() => {
    const main = detail?.gallery ?? [];
    return [...main, ...dimensionImgs];
  }, [detail, dimensionImgs]);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => { setActiveImg(0); }, [effectiveParam]);
  // Auto rotate gallery
  useEffect(() => {
    if (lightbox || galleryImages.length <= 1) return;
    const t = setInterval(() => setActiveImg((i) => (i + 1) % galleryImages.length), 4000);
    return () => clearInterval(t);
  }, [lightbox, galleryImages.length]);

  /* ── 404 if model not found in pricing ── */
  if (!pricing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteNavbar />
        <div className="container mx-auto px-4 py-20 text-center flex-1">
          <h1 className="text-2xl font-bold mb-2">ไม่พบรุ่นสินค้า</h1>
          <p className="text-muted-foreground mb-6">รุ่น "{effectiveParam}" ไม่อยู่ในรายการที่กำหนดสเปกได้</p>
          <Button onClick={() => navigate('/shop?series=UPC+Series')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> กลับไปหน้า Shop
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const cpu = pricing.cpus.find((c) => c.cpu === cpuKey) ?? pricing.cpus[0];
  const ram = RAM_UPGRADES.find((r) => r.gb === ramGb) ?? RAM_UPGRADES[0];
  const ssd = SSD_UPGRADES.find((s) => s.gb === ssdGb) ?? SSD_UPGRADES[0];
  const warranty = WARRANTY_OPTIONS.find((w) => w.years === warrantyYears) ?? WARRANTY_OPTIONS[0];

  const baseUnit = cpu.total + ram.addPrice + ssd.addPrice;
  const warrantyCost = Math.round(baseUnit * warranty.multiplier);
  const addonsCost = ADDONS.filter((a) => addons.has(a.id)).reduce((s, a) => s + a.price, 0);
  const unitBeforeDiscount = baseUnit + warrantyCost + addonsCost;
  const tier = tierDiscount(qty);
  const unitAfterDiscount = Math.round(unitBeforeDiscount * (1 - tier.rate));
  const total = unitAfterDiscount * qty;
  const savings = (unitBeforeDiscount - unitAfterDiscount) * qty;

  const toggleAddon = (id: AddOnId) => {
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        // Mutually exclusive OS group
        const target = ADDONS.find((a) => a.id === id);
        if (target?.group === 'os') {
          ADDONS.filter((a) => a.group === 'os').forEach((a) => next.delete(a.id));
        }
        next.add(id);
      }
      return next;
    });
  };

  const buildDescription = () => {
    const selectedAddons = ADDONS.filter((a) => addons.has(a.id)).map((a) => a.label);
    const parts: string[] = [
      pricing.model,
      cpu.cpu,
      `${ram.gb}GB RAM`,
      `${ssd.gb >= 1024 ? `${ssd.gb / 1024}TB` : `${ssd.gb}GB`} SSD`,
      `รับประกัน ${warranty.label}`,
    ];
    if (selectedAddons.length) parts.push(`Add-ons: ${selectedAddons.join(' / ')}`);
    if (pricing.includedFeatures?.length) parts.push(`Built-in: ${pricing.includedFeatures.join(' / ')}`);
    return parts.join(' • ');
  };

  const handleAddToCart = async () => {
    if (!user) {
      savePendingQuote({
        customer_name: '', customer_email: '', customer_phone: null, customer_company: null,
        notes: `กำหนดสเปก: ${buildDescription()}`,
        products: [{ model: pricing.model, description: buildDescription(), qty, unit_price: unitAfterDiscount, discount_percent: 0, line_total: total }],
      });
      toast({ title: 'บันทึกการกำหนดสเปกแล้ว', description: 'กรุณาเข้าสู่ระบบเพื่อเพิ่มลงตะกร้า' });
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setAdding(true);
    try {
      await addToCart({
        model: pricing.model,
        name: `${pricing.model} — ${pricing.category}`,
        description: buildDescription(),
        quantity: qty,
        price: unitAfterDiscount,
      });
    } finally {
      setAdding(false);
    }
  };

  const handleQuickQuote = () => {
    savePendingQuote({
      customer_name: '', customer_email: user?.email ?? '', customer_phone: null, customer_company: null,
      notes: `รุ่น ${pricing.model} ตามสเปก: ${buildDescription()}`,
      products: [{ model: pricing.model, description: buildDescription(), qty, unit_price: unitAfterDiscount, discount_percent: 0, line_total: total }],
    });
    toast({ title: 'พร้อมส่งคำขอใบเสนอราคา', description: `${pricing.model} × ${qty} ชิ้น • ฿${fmt(total)}` });
    navigate('/request-quote?action=continue');
  };

  /* ── Related models (same series tag) ── */
  const tag = pricing.model.split('-')[0]; // EPC, UPC, CTN
  const related = Object.values(upcSeriesDetails)
    .filter((d) => d.id.toUpperCase().startsWith(tag) && d.id !== detailKey)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`${pricing.model} — ${pricing.category} Industrial PC`}
        description={detail?.intro?.slice(0, 155) ?? `${pricing.model} ${pricing.category} Industrial PC จาก ENT Group — กำหนดสเปก CPU/RAM/SSD ได้ตามต้องการ`}
        path={`/shop/upc/${detailKey}`}
      />
      <SiteNavbar />

      {/* Breadcrumb */}
      {(() => {
        // Resolve correct series filter based on model prefix (EPC/UPC/CTN)
        const prefix = pricing.model.split('-')[0]?.toUpperCase() || 'UPC';
        const seriesParam = `${prefix}+Series`;
        const storeHref = `/shop?series=${seriesParam}&q=${encodeURIComponent(pricing.model)}`;
        return (
          <div className="border-b border-border bg-muted/30">
            <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
              <Link to="/shop" className="hover:text-primary">Shop</Link>
              <span>›</span>
              <Link to={`/shop?series=${seriesParam}`} className="hover:text-primary">{prefix} Series</Link>
              <span>›</span>
              <span className="text-foreground font-medium">{pricing.model}</span>
              <div className="ml-auto">
                <Button asChild size="sm" variant="outline" className="h-8 gap-1.5">
                  <Link to={storeHref}>
                    <Package className="w-3.5 h-3.5" />
                    ดูในร้านค้า
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* HERO */}
      <section className="container mx-auto px-4 py-6 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div
              className="relative aspect-[4/3] bg-muted rounded-xl overflow-hidden border border-border group cursor-zoom-in"
              onClick={() => setLightbox(true)}
            >
              {galleryImages[activeImg] ? (
                <img
                  src={galleryImages[activeImg]}
                  alt={`${pricing.model} ${activeImg + 1}`}
                  className="w-full h-full object-contain transition-opacity duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/product-placeholder.svg'; }}
                />
              ) : (
                <img src="/product-placeholder.svg" alt={pricing.model} className="w-full h-full object-contain" />
              )}
              <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5" /> คลิกเพื่อขยาย
              </div>
              {/* Indicators */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        i === activeImg ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {galleryImages.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      'aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-all',
                      i === activeImg ? 'border-primary' : 'border-transparent hover:border-border'
                    )}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/product-placeholder.svg'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="default">{tag} Series</Badge>
              <Badge variant="outline">{pricing.category}</Badge>
              <Badge variant="secondary"><Award className="w-3 h-3 mr-1" />รับประกัน 1 ปี (เพิ่มได้)</Badge>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{pricing.model}</h1>
            <p className="text-lg text-muted-foreground">{pricing.category} Industrial PC</p>
            {detail?.intro && <p className="text-sm text-muted-foreground leading-relaxed">{detail.intro}</p>}

            {pricing.includedFeatures && (
              <div className="flex flex-wrap gap-1.5">
                {pricing.includedFeatures.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-medium">
                    <Check className="w-3 h-3" /> {f}
                  </span>
                ))}
              </div>
            )}

            {/* Quick price preview */}
            <Card className="bg-primary/5 border-primary/30">
              <CardContent className="p-4 flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">เริ่มต้นที่</p>
                  <p className="text-3xl font-bold text-primary">฿{fmt(pricing.cpus[0].total)}</p>
                  <p className="text-xs text-muted-foreground">ราคายังไม่รวม VAT 7% • กำหนดสเปกด้านล่าง</p>
                </div>
                <Button size="lg" onClick={() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Wrench className="w-4 h-4 mr-2" /> กำหนดสเปก
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CONFIGURATOR + PRICE — 2 cols */}
      <section id="configurator" className="container mx-auto px-4 py-6 lg:py-10 scroll-mt-20">
        <SectionHeader icon={Wrench} title="ปรับแต่งสเปก" subtitle="คำนวณราคาตามสเปกจริง — เพิ่มลงตะกร้าหรือขอใบเสนอราคาได้ทันที" />

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left: Configurator (2 cols) */}
          <Card className="lg:col-span-2">
            <CardContent className="p-5 space-y-5">
              {/* CPU */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Cpu className="w-4 h-4 text-primary" /> CPU / Processor
                  <Badge variant="outline" className="text-[10px] ml-auto">{pricing.cpus.length} options</Badge>
                </div>
                <Select value={cpuKey} onValueChange={setCpuKey}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {pricing.cpus.map((c) => {
                      const diff = c.total - pricing.cpus[0].total;
                      return (
                        <SelectItem key={c.cpu} value={c.cpu}>
                          <span className="flex items-center justify-between gap-3 w-full">
                            <span>{c.cpu}</span>
                            <span className="text-xs text-muted-foreground">฿{fmt(c.total)}{diff > 0 ? ` (+฿${fmt(diff)})` : ''}</span>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* RAM + SSD */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><MemoryStick className="w-4 h-4 text-primary" /> RAM</div>
                  <div className="flex flex-wrap gap-1.5">
                    {RAM_UPGRADES.map((r) => (
                      <Chip key={r.gb} active={ramGb === r.gb} onClick={() => setRamGb(r.gb)} sub={r.addPrice > 0 ? `+${fmt(r.addPrice)}` : undefined}>
                        {r.gb}GB
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><HardDrive className="w-4 h-4 text-primary" /> SSD</div>
                  <div className="flex flex-wrap gap-1.5">
                    {SSD_UPGRADES.map((s) => (
                      <Chip key={s.gb} active={ssdGb === s.gb} onClick={() => setSsdGb(s.gb)} sub={s.addPrice > 0 ? `+${fmt(s.addPrice)}` : undefined}>
                        {s.gb >= 1024 ? `${s.gb / 1024}TB` : `${s.gb}GB`}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Plus className="w-4 h-4 text-primary" /> Add-ons & Optional Modules
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {ADDONS.map((a) => {
                    const Icon = a.icon;
                    const active = addons.has(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAddon(a.id)}
                        className={cn(
                          'text-left p-3 rounded-lg border transition-all',
                          active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0">
                            <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
                            <div className="min-w-0">
                              <p className="text-sm font-medium leading-tight">{a.label}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{a.desc}</p>
                            </div>
                          </div>
                          <span className={cn('text-xs font-semibold whitespace-nowrap', active ? 'text-primary' : 'text-muted-foreground')}>
                            {a.price === 0 ? 'ฟรี' : `+฿${fmt(a.price)}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  * เลือก OS ได้เพียง 1 อย่าง • Wi-Fi/4G เลือกพร้อมกันได้
                </p>
              </div>

              {/* Warranty + Qty */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="w-4 h-4 text-primary" /> รับประกัน</div>
                  <div className="space-y-1">
                    {WARRANTY_OPTIONS.map((w) => {
                      const cost = Math.round(baseUnit * w.multiplier);
                      return (
                        <button
                          key={w.years}
                          type="button"
                          onClick={() => setWarrantyYears(w.years)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-md border text-xs transition-all',
                            warrantyYears === w.years ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                          )}
                        >
                          <span className="flex items-center gap-1.5">
                            {warrantyYears === w.years && <Check className="w-3 h-3 text-primary" />}
                            {w.label}
                          </span>
                          <span className="font-medium">{cost === 0 ? 'รวมแล้ว' : `+฿${fmt(cost)}`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="w-4 h-4 text-primary" /> จำนวน</div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-border rounded-md">
                      <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 hover:bg-muted text-sm font-bold">−</button>
                      <input type="number" min={1} value={qty}
                        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center text-sm font-semibold bg-transparent outline-none" />
                      <button type="button" onClick={() => setQty(qty + 1)} className="px-3 py-1.5 hover:bg-muted text-sm font-bold">+</button>
                    </div>
                    <div className="flex gap-1">
                      {[5, 10, 50].map((q) => (
                        <button key={q} type="button" onClick={() => setQty(q)}
                          className={cn('text-[11px] px-2 py-1.5 rounded border transition-all',
                            qty === q ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50')}>
                          {q}+
                        </button>
                      ))}
                    </div>
                  </div>
                  {tier.rate > 0 && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> {tier.label} — ลด {(tier.rate * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Sticky Price Summary */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <Card className="border-primary/30 shadow-md">
              <CardContent className="p-5 space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">สรุปราคา</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground truncate pr-2">{cpu.cpu}</span><span>฿{fmt(cpu.total)}</span></div>
                  {ram.addPrice > 0 && <div className="flex justify-between"><span className="text-muted-foreground">+ RAM {ram.gb}GB</span><span>฿{fmt(ram.addPrice)}</span></div>}
                  {ssd.addPrice > 0 && <div className="flex justify-between"><span className="text-muted-foreground">+ SSD {ssd.gb >= 1024 ? `${ssd.gb / 1024}TB` : `${ssd.gb}GB`}</span><span>฿{fmt(ssd.addPrice)}</span></div>}
                  {warrantyCost > 0 && <div className="flex justify-between"><span className="text-muted-foreground">+ {warranty.label}</span><span>฿{fmt(warrantyCost)}</span></div>}
                  {ADDONS.filter((a) => addons.has(a.id) && a.price > 0).map((a) => (
                    <div key={a.id} className="flex justify-between"><span className="text-muted-foreground truncate pr-2">+ {a.label}</span><span>฿{fmt(a.price)}</span></div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ราคา/ชิ้น</span>
                  <span className="font-semibold">฿{fmt(unitAfterDiscount)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-primary border-t border-border pt-2">
                  <span>รวม × {qty}</span>
                  <span>฿{fmt(total)}</span>
                </div>
                {savings > 0 && (
                  <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 font-medium">
                    💰 ประหยัด ฿{fmt(savings)}
                  </p>
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

            {/* PR Banner: สอบถามโปรโมชั่น */}
            <Card className="mt-3 border-amber-400/40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 shadow-sm">
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

      {/* I/O & Built-in Features */}
      {pricing.includedFeatures && (
        <section className="container mx-auto px-4 py-6 lg:py-10">
          <SectionHeader icon={Cable} title="Built-in I/O & Connectivity" subtitle="ฟีเจอร์ที่ติดตัวรุ่นนี้ — รวมในราคาแล้ว" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pricing.includedFeatures.map((f) => (
              <Card key={f} className="bg-emerald-500/5 border-emerald-500/30">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="font-medium text-foreground">{f}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Full Specifications */}
      {detail?.specs && (
        <section className="container mx-auto px-4 py-6 lg:py-10">
          <SectionHeader icon={Package} title="ข้อมูลจำเพาะทั้งหมด" subtitle="Specifications สมบูรณ์ตามจริงจากผู้ผลิต" />
          <div className="grid md:grid-cols-2 gap-4">
            {detail.specs.map((group) => (
              <Card key={group.title}>
                <CardContent className="p-5">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-3">{group.title}</h3>
                  <dl className="space-y-2">
                    {group.rows.map((r) => (
                      <div key={r.label} className="grid grid-cols-3 gap-3 text-sm border-b border-border last:border-0 pb-2 last:pb-0">
                        <dt className="text-muted-foreground col-span-1">{r.label}</dt>
                        <dd className="col-span-2 font-medium">{r.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Selection Guide */}
      {detail?.selection && detail.selection.length > 0 && (
        <section className="container mx-auto px-4 py-6 lg:py-10">
          <SectionHeader icon={FileText} title="Selection Guide / Part Numbers" subtitle="รหัสสินค้าและสเปกพร้อมจัดส่ง" />
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Part Number</th>
                    <th className="text-left p-3 font-semibold">CPU</th>
                    <th className="text-left p-3 font-semibold">Memory</th>
                    <th className="text-left p-3 font-semibold">Storage</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.selection.map((s) => (
                    <tr key={s.partNumber} className="border-t border-border">
                      <td className="p-3 font-mono text-xs">{s.partNumber}</td>
                      <td className="p-3">{s.cpu}</td>
                      <td className="p-3">{s.memory}</td>
                      <td className="p-3">{s.storage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 py-6 lg:py-10">
          <SectionHeader icon={Sparkles} title={`รุ่นอื่นใน ${tag} Series`} subtitle="สินค้าในตระกูลเดียวกันที่อาจเหมาะกับคุณ" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {related.map((r) => {
              const rPricing = findPricing(r.id.toUpperCase());
              return (
                <Link key={r.id} to={`/shop/upc/${r.id}`} className="group">
                  <Card className="h-full hover:border-primary transition-all hover:shadow-md">
                    <div className="aspect-[4/3] bg-muted rounded-t-lg overflow-hidden flex items-center justify-center p-2">
                      <img src={r.gallery[0]} alt={r.id} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" onError={(e) => { (e.target as HTMLImageElement).src = '/product-placeholder.svg'; }} />
                    </div>
                    <CardContent className="p-3">
                      <p className="font-bold text-sm">{r.id.toUpperCase()}</p>
                      {rPricing && <p className="text-xs text-muted-foreground mt-0.5">{rPricing.category}</p>}
                      {rPricing && <p className="text-xs text-primary font-semibold mt-1">เริ่ม ฿{fmt(rPricing.cpus[0].total)}</p>}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(false); }} className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl">×</button>
          {galleryImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + galleryImages.length) % galleryImages.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % galleryImages.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          <img src={galleryImages[activeImg]} alt={pricing.model} className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">{activeImg + 1} / {galleryImages.length}</div>
        </div>
      )}

      <Footer />
    </div>
  );
}

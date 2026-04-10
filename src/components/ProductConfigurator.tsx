import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Cpu, HardDrive, Wifi, Smartphone, Monitor, Shield, ShoppingCart, Share2, ChevronRight, Check, Zap, Package,
} from 'lucide-react';

/* ── Types ── */
interface Product {
  id: string;
  sku: string;
  slug: string;
  model: string;
  series: string;
  name: string;
  description: string | null;
  category: string | null;
  cpu: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  storage_type: string | null;
  has_wifi: boolean;
  has_4g: boolean;
  os: string | null;
  unit_price: number;
  unit_price_vat: number | null;
  image_url: string | null;
  thumbnail_url: string | null;
  gallery_urls: string[] | null;
  stock_status: string;
  tags: string[] | null;
}

interface ConfigState {
  cpu: string | null;
  ram: number | null;
  storage: number | null;
  storageType: string | null;
  wifi: boolean;
  bt: boolean;
  lte: boolean;
  os: string | null;
  warranty: 1 | 2 | 3;
}

interface Props {
  product: Product;
}

/* ── Warranty Calc ── */
function calcWarranty(basePrice: number, years: 1 | 2 | 3) {
  if (years === 1) return { cost: 0, pct: 0, breakdown: { y2: 0, y3: 0 } };
  if (years === 2) {
    const y2 = basePrice * 0.15;
    return { cost: y2, pct: 15, breakdown: { y2, y3: 0 } };
  }
  const y2 = basePrice * 0.15;
  const y3 = basePrice * 0.25;
  return { cost: y2 + y3, pct: 40, breakdown: { y2, y3 } };
}

/* ── Connectivity price map ── */
const ADDON_PRICES = { wifi: 500, bt: 200, lte: 2500 } as const;
const OS_ADJUST: Record<string, number> = { none: -1000, win11: 500 };

export default function ProductConfigurator({ product }: Props) {
  const navigate = useNavigate();
  const [variants, setVariants] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Config state — initialized from the current product
  const [config, setConfig] = useState<ConfigState>({
    cpu: product.cpu,
    ram: product.ram_gb,
    storage: product.storage_gb,
    storageType: product.storage_type,
    wifi: product.has_wifi,
    bt: false,
    lte: product.has_4g,
    os: product.os,
    warranty: 1,
  });

  // Load all variants of same model
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('model', product.model)
        .eq('is_active', true)
        .order('unit_price', { ascending: true });
      setVariants((data as unknown as Product[]) || []);
      setLoading(false);
    })();
  }, [product.model]);

  // Extract distinct options from variants
  const options = useMemo(() => {
    const src = variants.length > 0 ? variants : [product];
    return {
      cpus: [...new Set(src.map(v => v.cpu).filter(Boolean))] as string[],
      rams: [...new Set(src.map(v => v.ram_gb).filter(Boolean))].sort((a, b) => a! - b!) as number[],
      storages: [...new Set(src.map(v => v.storage_gb).filter(Boolean))].sort((a, b) => a! - b!) as number[],
      storageTypes: [...new Set(src.map(v => v.storage_type).filter(Boolean))] as string[],
      osOptions: [...new Set(src.map(v => v.os).filter(Boolean))] as string[],
    };
  }, [variants, product]);

  // Find matching variant or fallback to base product
  const matchedVariant = useMemo(() => {
    if (variants.length === 0) return product;
    // Try exact match
    const exact = variants.find(v =>
      v.cpu === config.cpu &&
      v.ram_gb === config.ram &&
      v.storage_gb === config.storage
    );
    if (exact) return exact;
    // Partial match priority: cpu > ram > storage
    const byCpuRam = variants.find(v => v.cpu === config.cpu && v.ram_gb === config.ram);
    if (byCpuRam) return byCpuRam;
    const byCpu = variants.find(v => v.cpu === config.cpu);
    if (byCpu) return byCpu;
    return product;
  }, [variants, config.cpu, config.ram, config.storage, product]);

  // Price calculation
  const pricing = useMemo(() => {
    const base = matchedVariant.unit_price;
    let addons = 0;

    // Connectivity addons (only charge if product doesn't already have it)
    if (config.wifi && !matchedVariant.has_wifi) addons += ADDON_PRICES.wifi;
    if (config.bt) addons += ADDON_PRICES.bt;
    if (config.lte && !matchedVariant.has_4g) addons += ADDON_PRICES.lte;

    // OS adjustment
    const osKey = config.os === null ? 'none' : config.os?.toLowerCase().includes('win 11') ? 'win11' : undefined;
    const matchedOs = matchedVariant.os;
    if (osKey && config.os !== matchedOs) {
      addons += OS_ADJUST[osKey] || 0;
    }

    const warranty = calcWarranty(base, config.warranty);
    const total = base + addons + warranty.cost;
    return { base, addons, warranty, total };
  }, [matchedVariant, config]);

  const set = <K extends keyof ConfigState>(key: K, val: ConfigState[K]) =>
    setConfig(prev => ({ ...prev, [key]: val }));

  // Navigate to matched variant slug
  const handleVariantNav = (v: Product) => {
    if (v.slug !== product.slug) {
      navigate(`/products/${v.slug}`, { replace: true });
    }
  };

  // Gallery
  const images = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean) as string[];
  const [imgIdx, setImgIdx] = useState(0);

  const handleAddToQuote = () => navigate(`/request-quote?product=${matchedVariant.model}`);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">หน้าแรก</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigate(-1)} className="hover:text-foreground transition-colors">{product.series}</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{product.model}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8">
          {/* Left Column — Product Image + Info */}
          <div className="space-y-6">
            {/* Hero Image */}
            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-0">
                <div className="aspect-[4/3] flex items-center justify-center p-8">
                  {images.length > 0 ? (
                    <img
                      src={images[imgIdx]}
                      alt={product.model}
                      className="max-w-full max-h-full object-contain drop-shadow-lg transition-all duration-300"
                    />
                  ) : (
                    <Package className="w-32 h-32 text-muted-foreground/15" />
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 px-4 pb-4 justify-center">
                    {images.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-14 h-14 rounded-lg border-2 overflow-hidden transition-all ${
                          imgIdx === i ? 'border-primary ring-2 ring-primary/20' : 'border-border opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Title & Badges */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{product.series}</Badge>
                {product.has_wifi && <Badge variant="outline" className="text-xs"><Wifi className="w-3 h-3 mr-1" />WiFi</Badge>}
                {product.has_4g && <Badge variant="outline" className="text-xs"><Smartphone className="w-3 h-3 mr-1" />4G</Badge>}
                <Badge
                  variant={product.stock_status === 'available' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {product.stock_status === 'available' ? '✓ พร้อมส่ง' : 'สอบถามสต๊อก'}
                </Badge>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{product.model}</h1>
              <p className="text-muted-foreground mt-1">{product.name}</p>
            </div>

            {/* Base Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.cpu && <SpecChip icon={Cpu} label="CPU" value={product.cpu} />}
              {product.ram_gb && <SpecChip icon={HardDrive} label="RAM" value={`${product.ram_gb} GB`} />}
              {product.storage_gb && <SpecChip icon={HardDrive} label="Storage" value={`${product.storage_gb} GB ${product.storage_type || ''}`} />}
              {product.os && <SpecChip icon={Monitor} label="OS" value={product.os} />}
            </div>

            {/* Description */}
            {product.description && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">รายละเอียด</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column — Configurator */}
          <div className="space-y-4">
            <Card className="sticky top-16 shadow-xl border-primary/10">
              <CardContent className="p-5 space-y-5">
                <div className="text-center pb-3 border-b">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">กำหนดค่าสินค้า</p>
                  <h2 className="text-lg font-bold">🎨 Product Configurator</h2>
                </div>

                {loading ? (
                  <div className="py-8 flex justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* CPU */}
                    {options.cpus.length > 1 && (
                      <ConfigSection icon={Cpu} title="CPU">
                        <div className="grid gap-1.5">
                          {options.cpus.map(cpu => (
                            <OptionBtn
                              key={cpu}
                              label={cpu}
                              active={config.cpu === cpu}
                              onClick={() => set('cpu', cpu)}
                            />
                          ))}
                        </div>
                      </ConfigSection>
                    )}

                    {/* RAM */}
                    {options.rams.length > 1 && (
                      <ConfigSection icon={HardDrive} title="RAM">
                        <div className="flex gap-2 flex-wrap">
                          {options.rams.map(ram => (
                            <OptionChip
                              key={ram}
                              label={`${ram} GB`}
                              active={config.ram === ram}
                              onClick={() => set('ram', ram)}
                            />
                          ))}
                        </div>
                      </ConfigSection>
                    )}

                    {/* Storage */}
                    {options.storages.length > 1 && (
                      <ConfigSection icon={HardDrive} title="Storage">
                        <div className="flex gap-2 flex-wrap">
                          {options.storages.map(s => (
                            <OptionChip
                              key={s}
                              label={`${s} GB`}
                              active={config.storage === s}
                              onClick={() => set('storage', s)}
                            />
                          ))}
                        </div>
                      </ConfigSection>
                    )}

                    {/* Connectivity */}
                    <ConfigSection icon={Wifi} title="Connectivity">
                      <div className="grid grid-cols-3 gap-2">
                        <ToggleChip
                          label="WiFi 6"
                          sublabel={`+฿${ADDON_PRICES.wifi.toLocaleString()}`}
                          active={config.wifi}
                          included={matchedVariant.has_wifi}
                          onClick={() => set('wifi', !config.wifi)}
                        />
                        <ToggleChip
                          label="Bluetooth"
                          sublabel={`+฿${ADDON_PRICES.bt.toLocaleString()}`}
                          active={config.bt}
                          onClick={() => set('bt', !config.bt)}
                        />
                        <ToggleChip
                          label="4G LTE"
                          sublabel={`+฿${ADDON_PRICES.lte.toLocaleString()}`}
                          active={config.lte}
                          included={matchedVariant.has_4g}
                          onClick={() => set('lte', !config.lte)}
                        />
                      </div>
                    </ConfigSection>

                    {/* OS */}
                    {options.osOptions.length > 0 && (
                      <ConfigSection icon={Monitor} title="ระบบปฏิบัติการ">
                        <div className="grid gap-1.5">
                          <OptionBtn
                            label="No OS (-฿1,000)"
                            active={config.os === null}
                            onClick={() => set('os', null)}
                          />
                          {options.osOptions.map(os => (
                            <OptionBtn
                              key={os}
                              label={os}
                              active={config.os === os}
                              onClick={() => set('os', os)}
                            />
                          ))}
                        </div>
                      </ConfigSection>
                    )}

                    {/* Warranty */}
                    <ConfigSection icon={Shield} title="รับประกัน">
                      <div className="space-y-2">
                        {([1, 2, 3] as const).map(yr => {
                          const w = calcWarranty(pricing.base, yr);
                          return (
                            <button
                              key={yr}
                              onClick={() => set('warranty', yr)}
                              className={`w-full text-left rounded-xl p-3 border-2 transition-all ${
                                config.warranty === yr
                                  ? 'border-primary bg-primary/5 shadow-sm'
                                  : 'border-border hover:border-primary/30'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    config.warranty === yr ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                                  }`}>
                                    {config.warranty === yr && <Check className="w-3 h-3 text-primary-foreground" />}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-sm">
                                      {yr} ปี
                                      {yr === 1 && ' (Standard)'}
                                      {yr === 2 && ' (Extended)'}
                                      {yr === 3 && ' (Maximum)'}
                                    </span>
                                    {yr === 3 && <span className="ml-1.5 text-xs">🏆</span>}
                                  </div>
                                </div>
                                <span className={`text-sm font-bold ${w.cost === 0 ? 'text-green-600' : 'text-primary'}`}>
                                  {w.cost === 0 ? 'ฟรี' : `+฿${w.cost.toLocaleString()}`}
                                </span>
                              </div>
                              {yr > 1 && (
                                <div className="mt-1.5 ml-7 text-[11px] text-muted-foreground space-y-0.5">
                                  <div>ปีที่ 1: ฟรี ✅</div>
                                  <div>ปีที่ 2: +฿{w.breakdown.y2.toLocaleString()} (15%)</div>
                                  {yr === 3 && <div>ปีที่ 3: +฿{w.breakdown.y3.toLocaleString()} (25%)</div>}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </ConfigSection>

                    <Separator />

                    {/* Price Summary */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ราคาฐาน ({matchedVariant.sku})</span>
                        <span>฿{pricing.base.toLocaleString()}</span>
                      </div>
                      {pricing.addons !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">อุปกรณ์เสริม</span>
                          <span className={pricing.addons < 0 ? 'text-green-600' : ''}>
                            {pricing.addons >= 0 ? '+' : ''}฿{pricing.addons.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {pricing.warranty.cost > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ประกัน {config.warranty} ปี (+{pricing.warranty.pct}%)</span>
                          <span>+฿{pricing.warranty.cost.toLocaleString()}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="font-semibold">รวมทั้งสิ้น</span>
                        <span className="text-2xl font-bold text-primary">
                          ฿{pricing.total.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground text-right">ราคายังไม่รวม VAT 7%</p>
                    </div>

                    {/* CTA */}
                    <Button onClick={handleAddToQuote} size="lg" className="w-full text-base font-semibold">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      ขอใบเสนอราคา
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-Components ── */

function SpecChip({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 border">
      <Icon className="w-4 h-4 text-primary shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function ConfigSection({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      {children}
    </div>
  );
}

function OptionBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-all ${
        active
          ? 'border-primary bg-primary/5 font-medium'
          : 'border-border hover:border-primary/30 text-muted-foreground'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
          active ? 'border-primary bg-primary' : 'border-muted-foreground/30'
        }`}>
          {active && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
        </div>
        {label}
      </div>
    </button>
  );
}

function OptionChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border hover:border-primary/40 text-muted-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function ToggleChip({ label, sublabel, active, included, onClick }: {
  label: string;
  sublabel: string;
  active: boolean;
  included?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg border text-center transition-all ${
        active
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/30'
      }`}
    >
      <div className="text-xs font-medium">{label}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">
        {included && active ? 'รวมแล้ว' : sublabel}
      </div>
    </button>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Microchip, MemoryStick, Wifi, Smartphone, Bluetooth, ShieldCheck,
  Wand2, PackagePlus, Check, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  sku: string;
  slug: string;
  model: string;
  series: string | null;
  name: string;
  cpu: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  storage_type: string | null;
  has_wifi: boolean;
  has_4g: boolean;
  os: string | null;
  unit_price: number;
  thumbnail_url: string | null;
  stock_status: string | null;
}

interface ConfigState {
  cpu: string | null;
  ram: number | null;
  storage: number | null;
  storageType: string | null;
  bluetooth: boolean;
  warranty: 1 | 2 | 3;
}

export interface AddonSummary {
  label: string;
  price: number;
}

interface Props {
  product: Product;
  quantity: number;
  onConfigChange?: (config: {
    matchedVariant: Product;
    finalPrice: number;
    addons: AddonSummary[];
  }) => void;
}

const ADDON_PRICES = {
  bluetooth: 200,
} as const;

function calcWarranty(basePrice: number, years: 1 | 2 | 3) {
  if (years === 1) return { cost: 0, label: '1 ปี (Standard)' };
  if (years === 2) return { cost: Math.round(basePrice * 0.15), label: '2 ปี' };
  return { cost: Math.round(basePrice * 0.40), label: '3 ปี (Premium)' };
}

function getTierPrice(basePrice: number, qty: number): number {
  if (qty >= 50) return Math.round(basePrice * 0.80);
  if (qty >= 10) return Math.round(basePrice * 0.86);
  if (qty >= 5) return Math.round(basePrice * 0.93);
  return basePrice;
}

const fmt = (n: number) => n.toLocaleString('th-TH');

export default function ShopProductConfigurator({ product, quantity, onConfigChange }: Props) {
  const navigate = useNavigate();
  const [variants, setVariants] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [config, setConfig] = useState<ConfigState>({
    cpu: product.cpu,
    ram: product.ram_gb,
    storage: product.storage_gb,
    storageType: product.storage_type,
    bluetooth: false,
    warranty: 1,
  });

  // Load all variants of same model
  useEffect(() => {
    (async () => {
      setLoading(true);
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

  // Extract distinct options
  const options = useMemo(() => {
    const src = variants.length > 0 ? variants : [product];
    return {
      cpus: [...new Set(src.map(v => v.cpu).filter(Boolean))] as string[],
      rams: [...new Set(src.map(v => v.ram_gb).filter(Boolean))].sort((a, b) => a! - b!) as number[],
      storages: [...new Set(src.map(v => v.storage_gb).filter(Boolean))].sort((a, b) => a! - b!) as number[],
    };
  }, [variants, product]);

  // Find matching variant
  const matchedVariant = useMemo(() => {
    if (variants.length === 0) return product;
    const exact = variants.find(v =>
      v.cpu === config.cpu &&
      v.ram_gb === config.ram &&
      v.storage_gb === config.storage
    );
    if (exact) return exact;
    const byCpuRam = variants.find(v => v.cpu === config.cpu && v.ram_gb === config.ram);
    if (byCpuRam) return byCpuRam;
    const byCpu = variants.find(v => v.cpu === config.cpu);
    return byCpu || product;
  }, [variants, config.cpu, config.ram, config.storage, product]);

  // Sync URL when variant changes (in-place, no full reload)
  useEffect(() => {
    if (matchedVariant.slug !== product.slug && !loading) {
      navigate(`/shop/${matchedVariant.slug}`, { replace: true });
    }
  }, [matchedVariant.slug, product.slug, loading, navigate]);

  // Pricing breakdown
  const pricing = useMemo(() => {
    const base = matchedVariant.unit_price;
    const addons: AddonSummary[] = [];
    let addonsTotal = 0;

    if (config.bluetooth) {
      addons.push({ label: 'Bluetooth Module', price: ADDON_PRICES.bluetooth });
      addonsTotal += ADDON_PRICES.bluetooth;
    }

    const warranty = calcWarranty(base, config.warranty);
    if (warranty.cost > 0) {
      addons.push({ label: `รับประกัน ${warranty.label}`, price: warranty.cost });
    }

    const subtotal = base + addonsTotal + warranty.cost;
    const tierPrice = getTierPrice(subtotal, quantity);
    const total = tierPrice * quantity;
    const savings = (subtotal - tierPrice) * quantity;

    return { base, addons, addonsTotal, warranty, subtotal, tierPrice, total, savings };
  }, [matchedVariant, config, quantity]);

  // Notify parent
  useEffect(() => {
    onConfigChange?.({
      matchedVariant,
      finalPrice: pricing.subtotal,
      addons: pricing.addons,
    });
  }, [matchedVariant, pricing.subtotal, pricing.addons.length]);

  const set = <K extends keyof ConfigState>(key: K, val: ConfigState[K]) =>
    setConfig(prev => ({ ...prev, [key]: val }));

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const hasMultipleVariants = variants.length > 1;

  return (
    <Card className="border-primary/20">
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">ปรับสเปก</p>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-primary" />
              เลือก variant ที่ต้องการ
            </h3>
          </div>
          {hasMultipleVariants && (
            <Badge variant="outline" className="text-xs">
              {variants.length} variants
            </Badge>
          )}
        </div>

        {/* CPU Selection — Dropdown */}
        {options.cpus.length > 1 && (
          <ConfigSection icon={Microchip} title="CPU">
            <Select value={config.cpu || ''} onValueChange={(v) => set('cpu', v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือก CPU" />
              </SelectTrigger>
              <SelectContent>
                {options.cpus.map(cpu => {
                  const variant = variants.find(v => v.cpu === cpu);
                  const baseVariant = variants[0];
                  const priceDiff = variant && baseVariant ? variant.unit_price - baseVariant.unit_price : 0;
                  return (
                    <SelectItem key={cpu} value={cpu}>
                      <span className="flex items-center justify-between w-full gap-3">
                        <span>{cpu}</span>
                        {priceDiff !== 0 && (
                          <span className={cn('text-xs', priceDiff > 0 ? 'text-muted-foreground' : 'text-green-600')}>
                            {priceDiff > 0 ? '+' : ''}฿{fmt(priceDiff)}
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </ConfigSection>
        )}

        {/* RAM Selection */}
        {options.rams.length > 1 && (
          <ConfigSection icon={MemoryStick} title="RAM">
            <div className="flex gap-2 flex-wrap">
              {options.rams.map(ram => (
                <ChipButton
                  key={ram}
                  active={config.ram === ram}
                  onClick={() => set('ram', ram)}
                >
                  {ram} GB
                </ChipButton>
              ))}
            </div>
          </ConfigSection>
        )}

        {/* Storage */}
        {options.storages.length > 1 && (
          <ConfigSection icon={MemoryStick} title="Storage">
            <div className="flex gap-2 flex-wrap">
              {options.storages.map(storage => (
                <ChipButton
                  key={storage}
                  active={config.storage === storage}
                  onClick={() => set('storage', storage)}
                >
                  {storage >= 1024 ? `${storage / 1024} TB` : `${storage} GB`}
                </ChipButton>
              ))}
            </div>
          </ConfigSection>
        )}

        <Separator />

        {/* Add-ons */}
        <ConfigSection icon={PackagePlus} title="อุปกรณ์เสริม (Optional)">
          <div className="space-y-1.5">
            <AddonRow
              icon={Wifi}
              label="WiFi"
              included={matchedVariant.has_wifi}
              checked={matchedVariant.has_wifi}
              disabled
            />
            <AddonRow
              icon={Smartphone}
              label="4G LTE"
              included={matchedVariant.has_4g}
              checked={matchedVariant.has_4g}
              disabled
            />
            <AddonRow
              icon={Bluetooth}
              label="Bluetooth Module"
              price={ADDON_PRICES.bluetooth}
              checked={config.bluetooth}
              onChange={(v) => set('bluetooth', v)}
            />
          </div>
        </ConfigSection>

        {/* Warranty */}
        <ConfigSection icon={ShieldCheck} title="การรับประกัน">
          <div className="space-y-1.5">
            {([1, 2, 3] as const).map(years => {
              const w = calcWarranty(matchedVariant.unit_price, years);
              return (
                <button
                  key={years}
                  onClick={() => set('warranty', years)}
                  className={cn(
                    'w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-sm',
                    config.warranty === years
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {config.warranty === years && <Check className="w-4 h-4 text-primary" />}
                    {w.label}
                  </span>
                  <span className="text-xs">
                    {w.cost === 0 ? 'รวมในราคา' : `+฿${fmt(w.cost)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </ConfigSection>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2 bg-muted/30 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ราคา {matchedVariant.sku}</span>
            <span>฿{fmt(pricing.base)}</span>
          </div>
          {pricing.addons.map((a, i) => (
            <div key={i} className="flex justify-between text-xs text-muted-foreground">
              <span>+ {a.label}</span>
              <span>+฿{fmt(a.price)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>รวม / ชิ้น</span>
            <span>฿{fmt(pricing.subtotal)}</span>
          </div>
          {quantity >= 5 && (
            <div className="flex justify-between text-xs text-green-600">
              <span>ราคาส่ง ({quantity} ชิ้น)</span>
              <span>฿{fmt(pricing.tierPrice)} × {quantity}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-primary pt-1 border-t">
            <span>ยอดรวม</span>
            <span>฿{fmt(pricing.total)}</span>
          </div>
          {pricing.savings > 0 && (
            <p className="text-xs text-center text-green-600">
              💰 ประหยัด ฿{fmt(pricing.savings)}
            </p>
          )}
        </div>

        {/* Custom Build CTA */}
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground text-center mb-2">
            ไม่เจอสเปกที่ต้องการ?
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              const el = document.getElementById('rfq-form');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5" />
            🎯 ขอ Custom Build
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Sub-components ── */
function ConfigSection({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon className="w-3 h-3" />
        {title}
      </div>
      {children}
    </div>
  );
}

function ChipButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm border transition-all',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background border-border hover:border-primary/50'
      )}
    >
      {children}
    </button>
  );
}

function AddonRow({ icon: Icon, label, price, checked, onChange, disabled, included }: {
  icon: React.ElementType;
  label: string;
  price?: number;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  included?: boolean;
}) {
  return (
    <label className={cn(
      'flex items-center justify-between p-2 rounded-lg border text-sm transition-all',
      disabled ? 'bg-muted/30 border-border/50 cursor-default' : 'border-border hover:border-primary/50 cursor-pointer'
    )}>
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="w-4 h-4 accent-primary"
        />
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className={disabled ? 'text-muted-foreground' : ''}>{label}</span>
      </span>
      <span className="text-xs">
        {included ? <span className="text-green-600">✓ รวมแล้ว</span> : price ? `+฿${fmt(price)}` : ''}
      </span>
    </label>
  );
}

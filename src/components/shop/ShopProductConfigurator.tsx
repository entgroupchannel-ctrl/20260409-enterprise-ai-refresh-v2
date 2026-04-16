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
  Microchip, MemoryStick, HardDrive, Wifi, Smartphone, Bluetooth, ShieldCheck,
  Wand2, PackagePlus, Check, Monitor,
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
  wifi: string;
  os: string;
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
    selectedConfig: { ram: number | null; storage: number | null; wifi: string; os: string };
  }) => void;
}

/* ── Standard options available on nearly all models ── */
const STANDARD_RAMS = [4, 8, 16];
const STANDARD_STORAGES = [128, 256, 512];
const WIFI_OPTIONS = [
  { value: 'wifi5', label: 'WiFi 5 (AC)' },
  { value: 'wifi6', label: 'WiFi 6 (AX)' },
];
const OS_OPTIONS = [
  { value: 'win10pro', label: 'Windows 10 Pro OEM' },
  { value: 'win11pro', label: 'Windows 11 Pro OEM' },
  { value: 'win10iot', label: 'Windows 10 IoT Enterprise' },
  { value: 'win11iot', label: 'Windows 11 IoT Enterprise' },
  { value: 'ubuntu', label: 'Ubuntu Linux' },
];

const ADDON_CONTACT_LABEL = 'สอบถามแอดมิน';

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
    ram: product.ram_gb || 8,
    storage: product.storage_gb || 256,
    storageType: product.storage_type,
    wifi: 'wifi5',
    os: 'win10pro',
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

  // Merge DB options with standard defaults
  const options = useMemo(() => {
    const src = variants.length > 0 ? variants : [product];
    const dbRams = src.map(v => v.ram_gb).filter(Boolean) as number[];
    const dbStorages = src.map(v => v.storage_gb).filter(Boolean) as number[];
    return {
      cpus: [...new Set(src.map(v => v.cpu).filter(Boolean))] as string[],
      rams: [...new Set([...STANDARD_RAMS, ...dbRams])].sort((a, b) => a - b),
      storages: [...new Set([...STANDARD_STORAGES, ...dbStorages])].sort((a, b) => a - b),
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

  // Sync URL when variant changes
  useEffect(() => {
    if (matchedVariant.slug !== product.slug && !loading) {
      navigate(`/shop/${matchedVariant.slug}`, { replace: true });
    }
  }, [matchedVariant.slug, product.slug, loading, navigate]);

  // Pricing breakdown
  const pricing = useMemo(() => {
    const base = matchedVariant.unit_price;
    const addons: AddonSummary[] = [];

    const warranty = calcWarranty(base, config.warranty);
    if (warranty.cost > 0) {
      addons.push({ label: `รับประกัน ${warranty.label}`, price: warranty.cost });
    }

    const subtotal = base + warranty.cost;
    const tierPrice = getTierPrice(subtotal, quantity);
    const total = tierPrice * quantity;
    const savings = (subtotal - tierPrice) * quantity;

    return { base, addons, addonsTotal: 0, warranty, subtotal, tierPrice, total, savings };
  }, [matchedVariant, config, quantity]);

  // Notify parent
  useEffect(() => {
    onConfigChange?.({
      matchedVariant,
      finalPrice: pricing.subtotal,
      addons: pricing.addons,
      selectedConfig: {
        ram: config.ram,
        storage: config.storage,
        wifi: config.wifi,
        os: config.os,
      },
    });
  }, [matchedVariant, pricing.subtotal, pricing.addons.length, config.ram, config.storage, config.wifi, config.os]);

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
  const osLabel = OS_OPTIONS.find(o => o.value === config.os)?.label || config.os;
  const wifiLabel = WIFI_OPTIONS.find(o => o.value === config.wifi)?.label || config.wifi;

  return (
    <Card className="border-primary/20">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">ปรับแต่งสเปก</p>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-primary" />
              เลือกสเปกที่ต้องการ
            </h3>
          </div>
          {hasMultipleVariants && (
            <Badge variant="outline" className="text-xs">
              {variants.length} variants
            </Badge>
          )}
        </div>

        {/* CPU — only show if multiple */}
        {options.cpus.length > 1 && (
          <ConfigSection icon={Microchip} title="CPU / Processor">
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

        {/* RAM */}
        <ConfigSection icon={MemoryStick} title="RAM (หน่วยความจำ)">
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

        {/* Storage / SSD */}
        <ConfigSection icon={HardDrive} title="SSD (พื้นที่จัดเก็บ)">
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

        {/* WiFi */}
        <ConfigSection icon={Wifi} title="WiFi">
          <div className="flex gap-2 flex-wrap">
            {WIFI_OPTIONS.map(opt => (
              <ChipButton
                key={opt.value}
                active={config.wifi === opt.value}
                onClick={() => set('wifi', opt.value)}
              >
                {opt.label}
                {opt.value === 'wifi6' && (
                  <span className="text-[10px] ml-1 opacity-70">+฿{fmt(ADDON_PRICES.wifi6_upgrade)}</span>
                )}
              </ChipButton>
            ))}
          </div>
        </ConfigSection>

        {/* OS */}
        <ConfigSection icon={Monitor} title="ระบบปฏิบัติการ (OS)">
          <Select value={config.os} onValueChange={(v) => set('os', v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="เลือก OS" />
            </SelectTrigger>
            <SelectContent>
              {OS_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ConfigSection>

        <Separator />

        {/* Add-ons */}
        <ConfigSection icon={PackagePlus} title="อุปกรณ์เสริม">
          <div className="space-y-1.5">
            <AddonRow
              icon={Smartphone}
              label="4G LTE Module"
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

        {/* Config Summary */}
        <div className="bg-muted/30 rounded-lg p-3 space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">สรุปสเปกที่เลือก</p>
          <SummaryRow label="RAM" value={`${config.ram} GB`} />
          <SummaryRow label="SSD" value={config.storage ? (config.storage >= 1024 ? `${config.storage / 1024} TB` : `${config.storage} GB`) : '-'} />
          <SummaryRow label="WiFi" value={wifiLabel} />
          <SummaryRow label="OS" value={osLabel} />
          {config.bluetooth && <SummaryRow label="Bluetooth" value="✓" />}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 bg-muted/30 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ราคาเริ่มต้น {matchedVariant.sku}</span>
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
        'px-3 py-1.5 rounded-full text-sm border transition-all flex items-center',
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

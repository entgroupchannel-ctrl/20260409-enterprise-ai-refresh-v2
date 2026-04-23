import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, MemoryStick, HardDrive, ShieldCheck, PackagePlus, Wand2, Check, ShoppingCart, FileText, Sparkles, TrendingDown } from 'lucide-react';
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
  type ModelPricing,
} from '@/data/upcPricing';

interface Props {
  productId: string;
  productName: string;
  highlight?: string;
  /** เรียกหลังกดปุ่มแล้ว เพื่อให้ parent ปิด Dialog ได้ */
  onActionComplete?: () => void;
}

const fmt = (n: number) => n.toLocaleString('th-TH');

/* ── Sub-components ── */
function Section({ icon: Icon, title, children, hint }: { icon: React.ElementType; title: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Icon className="w-3.5 h-3.5" />
          {title}
        </div>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
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

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-medium', accent && 'text-primary')}>{value}</span>
    </div>
  );
}

export default function UpcConfigurator({ productId, productName, highlight, onActionComplete }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const pricing: ModelPricing | null = useMemo(() => findPricing(productId), [productId]);

  // Default config — เลือก CPU ตัวแรก (ถูกที่สุด)
  const [cpuKey, setCpuKey] = useState<string>(pricing?.cpus[0]?.cpu ?? '');
  const [ramGb, setRamGb] = useState<number>(4);
  const [ssdGb, setSsdGb] = useState<number>(128);
  const [warrantyYears, setWarrantyYears] = useState<1 | 2 | 3>(1);
  const [qty, setQty] = useState<number>(1);
  const [adding, setAdding] = useState(false);

  const calc = useMemo(() => {
    if (!pricing) return null;
    const cpu = pricing.cpus.find((c) => c.cpu === cpuKey) ?? pricing.cpus[0];
    const ram = RAM_UPGRADES.find((r) => r.gb === ramGb) ?? RAM_UPGRADES[0];
    const ssd = SSD_UPGRADES.find((s) => s.gb === ssdGb) ?? SSD_UPGRADES[0];
    const warranty = WARRANTY_OPTIONS.find((w) => w.years === warrantyYears) ?? WARRANTY_OPTIONS[0];

    const baseUnit = cpu.total + ram.addPrice + ssd.addPrice;
    const warrantyCost = Math.round(baseUnit * warranty.multiplier);
    const unitBeforeDiscount = baseUnit + warrantyCost;

    const tier = tierDiscount(qty);
    const unitAfterDiscount = Math.round(unitBeforeDiscount * (1 - tier.rate));
    const total = unitAfterDiscount * qty;
    const savings = (unitBeforeDiscount - unitAfterDiscount) * qty;

    return {
      cpu, ram, ssd, warranty,
      baseUnit, warrantyCost, unitBeforeDiscount,
      tier, unitAfterDiscount, total, savings,
    };
  }, [pricing, cpuKey, ramGb, ssdGb, warrantyYears, qty]);

  if (!pricing || !calc) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          ยังไม่มีตารางราคาสำหรับรุ่นนี้ — กรุณาขอใบเสนอราคาเพื่อสอบถามราคาพิเศษ
        </CardContent>
      </Card>
    );
  }

  // สร้าง description ที่อธิบาย config ครบถ้วน
  const buildDescription = () => {
    const parts: string[] = [
      productName,
      calc.cpu.cpu,
      calc.ram.label.replace(' (มาตรฐาน)', ''),
      calc.ssd.label.replace(' (มาตรฐาน)', ''),
      `รับประกัน ${calc.warranty.label}`,
    ];
    if (pricing.includedFeatures?.length) {
      parts.push(`Features: ${pricing.includedFeatures.join(' / ')}`);
    }
    return parts.join(' • ');
  };

  const handleAddToCart = async () => {
    if (!user) {
      // Guest → save pending then go to login (เหมือน flow ของ QuoteRequestButton)
      savePendingQuote({
        customer_name: '',
        customer_email: '',
        customer_phone: null,
        customer_company: null,
        notes: `กำหนดสเปก: ${buildDescription()}`,
        products: [{
          model: pricing.model,
          description: buildDescription(),
          qty,
          unit_price: calc.unitAfterDiscount,
          discount_percent: 0,
          line_total: calc.total,
        }],
      });
      toast({
        title: 'บันทึกการกำหนดสเปกแล้ว',
        description: 'กรุณาเข้าสู่ระบบเพื่อเพิ่มลงตะกร้าและขอใบเสนอราคา',
      });
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + '?action=continue'));
      return;
    }
    setAdding(true);
    try {
      await addToCart({
        model: pricing.model,
        name: `${productName}${highlight ? ` — ${highlight}` : ''}`,
        description: buildDescription(),
        quantity: qty,
        price: calc.unitAfterDiscount,
      });
      onActionComplete?.();
    } finally {
      setAdding(false);
    }
  };

  const handleQuickQuote = () => {
    // เก็บ config ลง localStorage แล้วพาไปหน้า request-quote (จะถูก pre-fill โดย flow ที่มีอยู่)
    savePendingQuote({
      customer_name: '',
      customer_email: user?.email ?? '',
      customer_phone: null,
      customer_company: null,
      notes: `รุ่น ${pricing.model} ตามสเปก: ${buildDescription()}`,
      products: [{
        model: pricing.model,
        description: buildDescription(),
        qty,
        unit_price: calc.unitAfterDiscount,
        discount_percent: 0,
        line_total: calc.total,
      }],
    });
    toast({
      title: 'พร้อมส่งคำขอใบเสนอราคา',
      description: `${pricing.model} × ${qty} ชิ้น • รวม ฿${fmt(calc.total)}`,
    });
    onActionComplete?.();
    navigate('/request-quote?action=continue');
  };

  return (
    <Card className="border-primary/30 shadow-sm">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">ปรับแต่งสเปก</p>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-primary" />
              คำนวณราคาตามสเปกจริง
            </h3>
          </div>
          <Badge variant="outline" className="text-[10px]">
            {pricing.cpus.length} CPU options
          </Badge>
        </div>

        {/* CPU */}
        <Section icon={Cpu} title="CPU / Processor" hint="ราคารวม chassis">
          <Select value={cpuKey} onValueChange={setCpuKey}>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pricing.cpus.map((c) => {
                const diff = c.total - pricing.cpus[0].total;
                return (
                  <SelectItem key={c.cpu} value={c.cpu}>
                    <span className="flex items-center justify-between gap-3 w-full">
                      <span>{c.cpu}</span>
                      <span className="text-xs text-muted-foreground">
                        ฿{fmt(c.total)}{diff > 0 ? ` (+฿${fmt(diff)})` : ''}
                      </span>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </Section>

        {/* RAM */}
        <Section icon={MemoryStick} title="RAM (หน่วยความจำ)">
          <div className="flex flex-wrap gap-1.5">
            {RAM_UPGRADES.map((r) => (
              <Chip key={r.gb} active={ramGb === r.gb} onClick={() => setRamGb(r.gb)}
                sub={r.addPrice > 0 ? `+฿${fmt(r.addPrice)}` : undefined}>
                {r.gb} GB
              </Chip>
            ))}
          </div>
        </Section>

        {/* SSD */}
        <Section icon={HardDrive} title="SSD (พื้นที่จัดเก็บ)">
          <div className="flex flex-wrap gap-1.5">
            {SSD_UPGRADES.map((s) => (
              <Chip key={s.gb} active={ssdGb === s.gb} onClick={() => setSsdGb(s.gb)}
                sub={s.addPrice > 0 ? `+฿${fmt(s.addPrice)}` : undefined}>
                {s.gb >= 1024 ? `${s.gb / 1024} TB` : `${s.gb} GB`}
              </Chip>
            ))}
          </div>
        </Section>

        {/* Warranty */}
        <Section icon={ShieldCheck} title="การรับประกัน">
          <div className="space-y-1.5">
            {WARRANTY_OPTIONS.map((w) => {
              const cost = Math.round(calc.baseUnit * w.multiplier);
              return (
                <button
                  key={w.years}
                  type="button"
                  onClick={() => setWarrantyYears(w.years)}
                  className={cn(
                    'w-full flex items-center justify-between p-2.5 rounded-lg border text-sm transition-all',
                    warrantyYears === w.years
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {warrantyYears === w.years && <Check className="w-4 h-4 text-primary" />}
                    {w.label}
                  </span>
                  <span className="text-xs font-medium">
                    {cost === 0 ? 'รวมในราคา' : `+฿${fmt(cost)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Included Features (informational) */}
        {pricing.includedFeatures && pricing.includedFeatures.length > 0 && (
          <Section icon={PackagePlus} title="ฟีเจอร์ที่ติดตัวรุ่น" hint="รวมในราคาแล้ว">
            <div className="flex flex-wrap gap-1.5">
              {pricing.includedFeatures.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-medium">
                  <Check className="w-3 h-3" /> {f}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Quantity */}
        <Section icon={Sparkles} title="จำนวน" hint="ส่วนลดตามจำนวน">
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-md">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 hover:bg-muted text-sm font-bold">−</button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 text-center text-sm font-semibold bg-transparent outline-none"
              />
              <button type="button" onClick={() => setQty(qty + 1)} className="px-3 py-1.5 hover:bg-muted text-sm font-bold">+</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[5, 10, 50].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQty(q)}
                  className={cn(
                    'text-[11px] px-2 py-1 rounded border transition-all',
                    qty === q ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50'
                  )}
                >
                  {q}+
                </button>
              ))}
            </div>
          </div>
          {calc.tier.rate > 0 && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" />
              {calc.tier.label} — ลด {(calc.tier.rate * 100).toFixed(0)}%
            </p>
          )}
        </Section>

        <Separator />

        {/* Price Breakdown */}
        <div className="bg-muted/40 rounded-lg p-3 space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">สรุปราคา</p>
          <SummaryRow label={`${calc.cpu.cpu} + chassis`} value={`฿${fmt(calc.cpu.total)}`} />
          {calc.ram.addPrice > 0 && <SummaryRow label={`+ RAM ${calc.ram.gb} GB`} value={`฿${fmt(calc.ram.addPrice)}`} />}
          {calc.ssd.addPrice > 0 && <SummaryRow label={`+ SSD ${calc.ssd.gb >= 1024 ? `${calc.ssd.gb / 1024} TB` : `${calc.ssd.gb} GB`}`} value={`฿${fmt(calc.ssd.addPrice)}`} />}
          {calc.warrantyCost > 0 && <SummaryRow label={`+ ${calc.warranty.label}`} value={`฿${fmt(calc.warrantyCost)}`} />}
          <Separator className="my-1.5" />
          <SummaryRow label="ราคาต่อชิ้น (ก่อนส่วนลด)" value={`฿${fmt(calc.unitBeforeDiscount)}`} />
          {calc.tier.rate > 0 && (
            <SummaryRow label={`ราคาต่อชิ้น (${calc.tier.label})`} value={`฿${fmt(calc.unitAfterDiscount)}`} accent />
          )}
          <div className="flex justify-between text-base font-bold text-primary pt-2 border-t border-border">
            <span>รวมทั้งสิ้น × {qty}</span>
            <span>฿{fmt(calc.total)}</span>
          </div>
          {calc.savings > 0 && (
            <p className="text-[11px] text-center text-emerald-600 dark:text-emerald-400 font-medium">
              💰 ประหยัด ฿{fmt(calc.savings)} จากราคาปกติ
            </p>
          )}
          <p className="text-[10px] text-muted-foreground text-center pt-1">
            ราคายังไม่รวม VAT 7% • อ้างอิงราคา 2025 • ราคาสุดท้ายตามใบเสนอราคา
          </p>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleAddToCart} disabled={adding} variant="outline" size="sm">
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            {adding ? 'กำลังเพิ่ม...' : 'เพิ่มลงตะกร้า'}
          </Button>
          <Button onClick={handleQuickQuote} size="sm" className="shadow-sm">
            <FileText className="w-4 h-4 mr-1.5" />
            ขอใบเสนอราคาเลย
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          ตะกร้า = รวมหลายรุ่นในใบเสนอราคาเดียว • ขอใบเสนอราคาเลย = ส่งเฉพาะรุ่นนี้
        </p>
      </CardContent>
    </Card>
  );
}

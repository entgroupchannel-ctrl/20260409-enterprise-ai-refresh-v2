import { useMemo, useState, useEffect } from "react";
import { Monitor, Cpu, MemoryStick, HardDrive, Wifi, Smartphone, ShieldCheck, CheckCircle2, Sparkles, Info, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { TouchWorkArch, TouchWorkProduct } from "@/data/touchwork-products";

export interface ConfiguratorSelection {
  screen: string;
  cpu: string;
  ram: string;
  ssd: string;
  wifi: string;
  os: string;
  warranty: string;
}

interface Props {
  product: TouchWorkProduct;
  arch: TouchWorkArch;
  sku: string;
  productName: string;
  basePrice?: number;
}

// ---- Option presets per architecture --------------------------------------

const RAM_OPTIONS_ARM = ["2 GB", "4 GB", "8 GB"];
const RAM_OPTIONS_X86 = ["4 GB DDR4", "8 GB DDR4", "16 GB DDR4", "32 GB DDR4"];
const SSD_OPTIONS_ARM = ["16 GB eMMC", "32 GB eMMC", "64 GB eMMC", "128 GB eMMC"];
const SSD_OPTIONS_X86 = ["64 GB SSD", "128 GB SSD", "256 GB SSD", "512 GB SSD", "1 TB SSD"];
const WIFI_OPTIONS = ["LAN เท่านั้น", "Wi-Fi 5 + Bluetooth 4.2", "Wi-Fi 6 + Bluetooth 5.2", "Wi-Fi 6 + 4G LTE"];
const WARRANTY_OPTIONS = ["1 ปี (มาตรฐาน)", "2 ปี (+ฟรี on-site 1 ครั้ง)", "3 ปี (พรีเมียม)"];

const OS_OPTIONS_ARM = ["Android 11", "Android 12", "Android 13", "Linux Ubuntu 22.04"];
const OS_OPTIONS_X86 = ["Windows 10 Pro", "Windows 11 Pro", "Windows 10 IoT Enterprise LTSC", "Windows 11 IoT Enterprise", "Linux Ubuntu 22.04"];
const OS_OPTIONS_MONITOR = ["ไม่มี OS (Plug & Play HDMI/VGA)"];

const CPU_OPTIONS_ARM = [
  "Rockchip RK3568 (Quad-core A55)",
  "Rockchip RK3576 (Octa-core A72/A53)",
  "Rockchip RK3588 (Octa-core A76/A55)",
];
const CPU_OPTIONS_X86 = [
  "Intel Celeron J4125 (Quad-core)",
  "Intel Core i3-1115G4",
  "Intel Core i5-1135G7",
  "Intel Core i7-1165G7",
];
const CPU_OPTIONS_MONITOR = ["ไม่ใช้ — เป็นจอแสดงผล"];

function getOptionsForArch(arch: TouchWorkArch) {
  if (arch === "ARM") {
    return {
      cpu: CPU_OPTIONS_ARM,
      ram: RAM_OPTIONS_ARM,
      ssd: SSD_OPTIONS_ARM,
      os: OS_OPTIONS_ARM,
    };
  }
  if (arch === "X86") {
    return {
      cpu: CPU_OPTIONS_X86,
      ram: RAM_OPTIONS_X86,
      ssd: SSD_OPTIONS_X86,
      os: OS_OPTIONS_X86,
    };
  }
  return {
    cpu: CPU_OPTIONS_MONITOR,
    ram: ["ไม่ใช้"],
    ssd: ["ไม่ใช้"],
    os: OS_OPTIONS_MONITOR,
  };
}

export default function ProductConfigurator({ product, arch, sku, productName, basePrice }: Props) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  const opts = useMemo(() => getOptionsForArch(arch), [arch]);
  const screenLabel = `${product.size}″ — ${product.resolution} (${product.ratio})`;

  const [selection, setSelection] = useState<ConfiguratorSelection>(() => ({
    screen: screenLabel,
    cpu: opts.cpu[0],
    ram: opts.ram[0],
    ssd: opts.ssd[0],
    wifi: WIFI_OPTIONS[1],
    os: opts.os[0],
    warranty: WARRANTY_OPTIONS[0],
  }));

  // Reset config when arch changes
  useMemo(() => {
    setSelection({
      screen: screenLabel,
      cpu: opts.cpu[0],
      ram: opts.ram[0],
      ssd: opts.ssd[0],
      wifi: WIFI_OPTIONS[1],
      os: opts.os[0],
      warranty: WARRANTY_OPTIONS[0],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arch]);

  const update = <K extends keyof ConfiguratorSelection>(key: K, value: ConfiguratorSelection[K]) =>
    setSelection((s) => ({ ...s, [key]: value }));

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      const summary = `${arch} • ${selection.cpu} • ${selection.ram} • ${selection.ssd} • ${selection.os} • ${selection.warranty}`;
      await addToCart({
        model: sku,
        name: `${productName} (Custom)`,
        description: summary,
        quantity: 1,
        price: basePrice,
        configuration: { ...selection, arch, baseModel: product.model, basePrice },
      });
      toast({
        title: "เพิ่มสเปกที่ปรับแต่งเข้าตะกร้าแล้ว",
        description: "แอดมินจะส่งใบเสนอราคาให้ภายใน 4 ชม.",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="container max-w-7xl mx-auto px-6 py-8 border-t border-border/40">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">ปรับแต่งสเปก</span>
          </div>
          <h2 className="text-2xl font-bold">เลือกสเปกที่ใช่ — แล้วใส่ตะกร้า</h2>
          <p className="text-sm text-muted-foreground mt-1">
            เลือกสเปกตามการใช้งานจริง · ทีมงานจะส่งใบเสนอราคาภายใน <strong>4 ชั่วโมง</strong>
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5"><Info className="h-3 w-3" /> ราคาอ้างอิงต้องสอบถาม</Badge>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* 3-column minimal grid */}
        <div className="grid md:grid-cols-3 gap-px bg-border/60">
          {/* COL 1 — Display + CPU */}
          <div className="bg-card p-5 space-y-5">
            <FieldHeader icon={Monitor} title="หน้าจอ" />
            <div className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5">
              <div className="text-xs text-muted-foreground">ขนาด & ความละเอียด</div>
              <div className="text-sm font-semibold mt-0.5">{screenLabel}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">ระบบสัมผัส: {product.touch}</div>
            </div>

            <FieldHeader icon={Cpu} title="CPU / Processor" />
            <Select value={selection.cpu} onValueChange={(v) => update("cpu", v)} disabled={arch === "Monitor"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {opts.cpu.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* COL 2 — RAM + SSD + WiFi */}
          <div className="bg-card p-5 space-y-5">
            <FieldHeader icon={MemoryStick} title="หน่วยความจำ (RAM)" />
            <RadioGroup
              value={selection.ram}
              onValueChange={(v) => update("ram", v)}
              className="grid grid-cols-2 gap-2"
              disabled={arch === "Monitor"}
            >
              {opts.ram.map((o) => (
                <label
                  key={o}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer text-sm transition-all ${
                    selection.ram === o ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:border-primary/40"
                  } ${arch === "Monitor" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <RadioGroupItem value={o} id={`ram-${o}`} className="sr-only" />
                  <span className="font-medium">{o}</span>
                </label>
              ))}
            </RadioGroup>

            <FieldHeader icon={HardDrive} title="พื้นที่จัดเก็บ (Storage)" />
            <Select value={selection.ssd} onValueChange={(v) => update("ssd", v)} disabled={arch === "Monitor"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {opts.ssd.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>

            <FieldHeader icon={Wifi} title="การเชื่อมต่อ" />
            <Select value={selection.wifi} onValueChange={(v) => update("wifi", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WIFI_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* COL 3 — OS + Warranty */}
          <div className="bg-card p-5 space-y-5">
            <FieldHeader icon={Smartphone} title="ระบบปฏิบัติการ (OS)" />
            <RadioGroup
              value={selection.os}
              onValueChange={(v) => update("os", v)}
              className="grid gap-2"
            >
              {opts.os.map((o) => (
                <label
                  key={o}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer text-sm transition-all ${
                    selection.os === o ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border hover:border-primary/40"
                  }`}
                >
                  <RadioGroupItem value={o} id={`os-${o}`} className="sr-only" />
                  {selection.os === o ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-border shrink-0" />
                  )}
                  <span className="font-medium">{o}</span>
                </label>
              ))}
            </RadioGroup>

            <FieldHeader icon={ShieldCheck} title="การรับประกัน" />
            <Select value={selection.warranty} onValueChange={(v) => update("warranty", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WARRANTY_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary + CTA */}
        <div className="border-t border-border bg-muted/20 p-5">
          <div className="flex items-start gap-4 flex-wrap justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">สรุปสเปกที่เลือก</div>
              <div className="flex flex-wrap gap-1.5">
                <SummaryChip>{arch}</SummaryChip>
                <SummaryChip>{selection.cpu}</SummaryChip>
                <SummaryChip>{selection.ram}</SummaryChip>
                <SummaryChip>{selection.ssd}</SummaryChip>
                <SummaryChip>{selection.wifi}</SummaryChip>
                <SummaryChip>{selection.os}</SummaryChip>
                <SummaryChip>{selection.warranty}</SummaryChip>
              </div>
            </div>
            <div className="shrink-0 text-right">
              {basePrice ? (
                <div className="mb-2">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">ราคาเริ่มต้น</div>
                  <div className="text-xl font-bold text-primary leading-tight">฿{basePrice.toLocaleString("en-US")}</div>
                  <div className="text-[10px] text-muted-foreground">+ ปรับตามสเปก</div>
                </div>
              ) : null}
              <Button size="lg" onClick={handleAdd} disabled={adding}>
                {adding ? "กำลังเพิ่ม..." : "เพิ่มสเปกนี้เข้าตะกร้า"}
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1.5">
            <Info className="h-3 w-3" />
            ราคาขึ้นอยู่กับสเปกที่เลือก — แอดมินจะตอบกลับใบเสนอราคาภายใน 4 ชั่วโมง (เวลาทำการ)
          </p>
        </div>
      </div>
    </section>
  );
}

function FieldHeader({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3.5 w-3.5" /> {title}
    </Label>
  );
}

function SummaryChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-card border border-border text-xs font-medium">
      {children}
    </span>
  );
}

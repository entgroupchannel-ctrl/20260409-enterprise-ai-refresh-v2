import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import SiteNavbar from '@/components/SiteNavbar';
import Footer from '@/components/Footer';
import {
  Cpu, MemoryStick, HardDrive, ShieldCheck, Sparkles, Check,
  FileText, ChevronLeft, ChevronRight, ZoomIn, MonitorCog, Wrench,
  ArrowLeft, Package, Award, Cable, Phone, MessageCircle, Gift,
  Server, Thermometer, Zap, Settings2,
} from 'lucide-react';
import LineQRButton from '@/components/LineQRButton';
import QuoteRequestButton from '@/components/QuoteRequestButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import qyU4000Hero from '@/assets/ipctech/qy-u4000-hero.jpg';
import qyU4000Dimensions from '@/assets/ipctech/qy-u4000-dimensions.jpg';
import qyU4000RealFront from '@/assets/ipctech/qy-u4000-real-front-rack.jpg';
import qyU4000RealRearIO from '@/assets/ipctech/qy-u4000-real-rear-io.jpg';
import qyU4000RealTowerFront from '@/assets/ipctech/qy-u4000-real-tower-front.jpg';
import qyU4000RealRearCloseup from '@/assets/ipctech/qy-u4000-real-rear-closeup.jpg';
import qyU4000RealDoorOpen from '@/assets/ipctech/qy-u4000-real-door-open.jpg';
import qyU4000RealRearFull from '@/assets/ipctech/qy-u4000-real-rear-full.jpg';
import useCctvCity from '@/assets/ipctech/usecase-cctv-city.jpg';
import useItsTraffic from '@/assets/ipctech/usecase-its-traffic.jpg';
import useScadaPower from '@/assets/ipctech/usecase-scada-power.jpg';
import useRailEdge from '@/assets/ipctech/usecase-rail-edge.jpg';
import qyB5700 from '@/assets/ipctech/qy-b5700.jpg';
import qyP8000 from '@/assets/ipctech/qy-p8000.jpg';
import qyU3500 from '@/assets/ipctech/qy-u3500.jpg';
import qyP5000Rack from '@/assets/ipctech/qy-p5000-rack.jpg';

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

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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
    </button>
  );
}

/* ── QY-U4000 Data (จากไฟล์ datasheet ที่ parse แล้ว) ── */
const MODEL = 'QY-U4000';
const CATEGORY = '4U Industrial Computer (Government Spec)';

const GALLERY = [
  qyU4000Hero,
  qyU4000RealFront,
  qyU4000RealTowerFront,
  qyU4000RealRearIO,
  qyU4000RealRearCloseup,
  qyU4000RealRearFull,
  qyU4000RealDoorOpen,
  qyU4000Dimensions,
];

const INTRO =
  'QY-U4000 คือคอมพิวเตอร์อุตสาหกรรมระดับเรือธงจาก IPCTECH สำหรับงานโครงการภาครัฐและงานวางสเปกราชการโดยเฉพาะ ' +
  'ออกแบบเป็น 4U Rackmount มาตรฐานตู้ 19" รองรับ CPU Intel Desktop ตั้งแต่ Gen 4 ถึง Gen 14 ' +
  'พร้อมตัวเลือกเมนบอร์ดถึง 9 รุ่น และทำงานต่อเนื่อง 24/7 ในช่วงอุณหภูมิ −30°C ถึง 70°C';

const INCLUDED_FEATURES = [
  '4U Rackmount 19"',
  'Anti-Static / Anti-Surge',
  'Dual Intel LAN',
  'RS-232/422/485',
  '−30 ~ 70°C Operating',
  '24/7 Operation Ready',
];

const CPU_OPTIONS = [
  { id: 'celeron-g', label: 'Intel Celeron / Pentium (Gen 4–10)', desc: 'งานควบคุม / Kiosk / POS' },
  { id: 'i3', label: 'Intel Core i3 (Gen 4–14)', desc: 'งาน Office / ระบบ CCTV ขนาดเล็ก' },
  { id: 'i5', label: 'Intel Core i5 (Gen 4–14)', desc: 'แนะนำสำหรับงานราชการทั่วไป' },
  { id: 'i7', label: 'Intel Core i7 (Gen 4–14)', desc: 'งาน Server / GPU / ITS' },
  { id: 'i9', label: 'Intel Core i9 (Gen 10–14)', desc: 'งาน AI / Capture Card / High-load' },
];

const CHIPSET_OPTIONS = ['H81', 'B85', 'H110', 'Z390', 'Q170', 'H470', 'Q470', 'H610', 'Q670'];

const RAM_OPTIONS = [
  { gb: 4, label: '4 GB' },
  { gb: 8, label: '8 GB' },
  { gb: 16, label: '16 GB' },
  { gb: 32, label: '32 GB' },
  { gb: 64, label: '64 GB' },
];

const SSD_OPTIONS = [
  { gb: 128, label: '128 GB SSD' },
  { gb: 256, label: '256 GB SSD' },
  { gb: 512, label: '512 GB SSD' },
  { gb: 1024, label: '1 TB NVMe' },
  { gb: 2048, label: '2 TB NVMe' },
];

const PSU_OPTIONS = ['300W', '500W', '700W', '1000W', '1300W'];

const OS_OPTIONS = ['Windows 10 Pro', 'Windows 11 Pro', 'Windows 10 IoT Enterprise', 'Ubuntu 22.04 LTS', 'No OS'];

const SPECS: { title: string; rows: { label: string; value: string }[] }[] = [
  {
    title: 'Form Factor',
    rows: [
      { label: 'Chassis', value: '4U Rackmount 19"' },
      { label: 'Dimensions', value: '481 × 445 × 173 mm' },
      { label: 'Material', value: 'Cold-rolled Steel + Aluminum Front Panel' },
      { label: 'Mounting', value: 'Desktop / 19" Standard Rack' },
      { label: 'Color', value: 'Black (Custom RAL on request)' },
    ],
  },
  {
    title: 'Processor & Mainboard',
    rows: [
      { label: 'CPU Support', value: 'Intel Desktop Gen 4 → Gen 14' },
      { label: 'Series', value: 'Celeron / Pentium / i3 / i5 / i7 / i9' },
      { label: 'Chipsets', value: 'H81 / B85 / H110 / Z390 / Q170 / H470 / Q470 / H610 / Q670' },
      { label: 'Mainboard', value: 'ATX / Micro-ATX / Mini-ITX (เลือกได้ 9 รุ่น)' },
      { label: 'BIOS', value: 'AMI UEFI พร้อม Watchdog Timer' },
    ],
  },
  {
    title: 'Memory & Storage',
    rows: [
      { label: 'Memory Type', value: 'DDR3 / DDR4 / DDR5 (ตามเมนบอร์ด)' },
      { label: 'Memory Slots', value: 'สูงสุด 4 slots' },
      { label: 'Max Memory', value: 'สูงสุด 64 GB' },
      { label: 'Storage', value: 'M.2 NVMe + SATA 3.0 (รองรับ Hot-Swap option)' },
      { label: 'Storage Bays', value: '2.5"/3.5" SATA bays + M.2 slot' },
    ],
  },
  {
    title: 'Expansion',
    rows: [
      { label: 'PCIe', value: '1× PCIe x16 + 2× PCIe x4 / x1' },
      { label: 'PCI', value: 'สูงสุด 4 ช่อง (ตามเมนบอร์ด)' },
      { label: 'Use Case', value: 'GPU / Capture Card / Industrial I/O Card' },
    ],
  },
  {
    title: 'I/O & Connectivity',
    rows: [
      { label: 'Serial', value: 'RS-232 / RS-422 / RS-485 สูงสุด 6 ช่อง' },
      { label: 'USB', value: 'USB 3.2 Gen 1 + USB 2.0' },
      { label: 'LAN', value: 'Dual Intel LAN (1 GbE / 2.5 GbE)' },
      { label: 'Display', value: 'DP + HDMI + DVI + VGA' },
      { label: 'Audio', value: 'Mic-in / Line-out (HD Audio)' },
      { label: 'Wireless', value: 'Optional WiFi 6 + Bluetooth 5.2 / 4G LTE / 5G NR' },
    ],
  },
  {
    title: 'Power & Environment',
    rows: [
      { label: 'Power Supply', value: 'ATX 300W / 500W / 700W / 1000W / 1300W' },
      { label: 'Power Features', value: 'Auto-Start, Remote Power On/Off' },
      { label: 'Operating Temp', value: '−30°C ถึง 70°C' },
      { label: 'Storage Temp', value: '−40°C ถึง 85°C' },
      { label: 'Humidity', value: '5% ~ 95% RH (ไม่กลั่นเป็นหยดน้ำ)' },
      { label: 'Protection', value: 'Anti-Static · Anti-Pulse · Anti-Surge · Anti-Radiation' },
      { label: 'Operation', value: '24/7 Continuous' },
    ],
  },
  {
    title: 'Compliance & OS',
    rows: [
      { label: 'OS Support', value: 'Windows 7 / 10 / 11 / IoT Enterprise · Linux (Ubuntu / CentOS)' },
      { label: 'Certifications', value: 'CE / FCC / RoHS' },
      { label: 'Warranty', value: '1 ปีมาตรฐาน (ขยายได้ถึง 3 ปี)' },
      { label: 'Support', value: 'ODM/OEM · Custom Label · Custom BIOS' },
    ],
  },
];

const FLAGSHIP_PROJECTS = [
  {
    img: useCctvCity,
    tag: 'CCTV City / Safe City',
    title: 'ศูนย์ควบคุมกล้องวงจรปิดระดับเมือง',
    desc: 'ทำหน้าที่เป็น NVR / VMS ระดับองค์กร รองรับกล้อง IP หลายร้อยตัวพร้อมกัน บันทึก 24/7 พร้อม Hot-Swap Storage',
    metrics: ['256+ Channels', '24/7 Recording', 'Dual PSU 800W'],
  },
  {
    img: useItsTraffic,
    tag: 'ITS / ANPR',
    title: 'ระบบจราจรอัจฉริยะ & อ่านป้ายทะเบียน',
    desc: 'ติดตั้งใน Roadside Cabinet ตาม TOR กรมทางหลวง / ทางพิเศษ ทำงานต่อเนื่องในอุณหภูมิ −30 ~ 70°C ป้องกันไฟกระชาก',
    metrics: ['−30~70°C', 'Anti-Surge', 'RS-232/485'],
  },
  {
    img: useScadaPower,
    tag: 'SCADA / Utility',
    title: 'สถานีไฟฟ้า & ระบบประปา',
    desc: 'รัน SCADA/HMI สำหรับการไฟฟ้า / การประปา รองรับการ์ด I/O อุตสาหกรรมผ่าน PCIe / PCI หลายช่อง',
    metrics: ['PCIe x16', '4× PCI Slots', '24/7 Operation'],
  },
  {
    img: useRailEdge,
    tag: 'Rail / Transit',
    title: 'ระบบรถไฟฟ้า BTS / MRT / SRT',
    desc: 'Edge Server ติดตั้งในห้อง Server ของสถานี รองรับงาน AFC, PIS, CCTV และระบบสัญญาณ พร้อม Custom BIOS ตามมาตรฐาน',
    metrics: ['Custom BIOS', 'Dual LAN', '19" Rack'],
  },
];

const USE_CASES = [
  { icon: Server, label: 'ศูนย์ข้อมูลราชการ', desc: 'Server room / Data center ภาครัฐ' },
  { icon: ShieldCheck, label: 'ระบบ CCTV เมือง', desc: 'NVR / VMS รองรับกล้องจำนวนมาก' },
  { icon: Settings2, label: 'ระบบจราจรอัจฉริยะ (ITS)', desc: 'ANPR / Traffic Control' },
  { icon: Zap, label: 'สถานีไฟฟ้า / น้ำประปา', desc: 'SCADA / Industrial Control' },
  { icon: Thermometer, label: 'ห้องควบคุมโรงงาน', desc: 'MES / HMI 24/7' },
  { icon: Cable, label: 'ระบบรถไฟฟ้า / รถไฟ', desc: 'Edge Server บนสถานี' },
  { icon: ShieldCheck, label: 'Defense / Security', desc: 'งานความมั่นคง รองรับ Custom BIOS' },
  { icon: Sparkles, label: 'Smart City', desc: 'IoT Gateway / Edge AI' },
];

const RELATED = [
  { id: 'qy-b5700', title: 'Industrial Motherboard ATX', img: qyB5700 },
  { id: 'qy-p8000', title: 'Panel PC 21.5" Industrial', img: qyP8000 },
  { id: 'qy-u3500', title: '3U Industrial Computer', img: qyU3500 },
  { id: 'qy-p5000', title: '1U Rackmount Server', img: qyP5000Rack },
];

export default function ShopIpctechQyU4000() {
  const [cpuKey, setCpuKey] = useState<string>(CPU_OPTIONS[2].id); // i5 default
  const [chipset, setChipset] = useState<string>('Q670');
  const [ramGb, setRamGb] = useState<number>(8);
  const [ssdGb, setSsdGb] = useState<number>(512);
  const [psu, setPsu] = useState<string>('500W');
  const [osKey, setOsKey] = useState<string>(OS_OPTIONS[1]);
  const [warrantyYears, setWarrantyYears] = useState<1 | 2 | 3>(1);
  const [qty, setQty] = useState<number>(1);

  /* Gallery */
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  useEffect(() => {
    if (lightbox || GALLERY.length <= 1) return;
    const t = setInterval(() => setActiveImg((i) => (i + 1) % GALLERY.length), 4000);
    return () => clearInterval(t);
  }, [lightbox]);

  const cpu = useMemo(() => CPU_OPTIONS.find((c) => c.id === cpuKey) ?? CPU_OPTIONS[0], [cpuKey]);

  const buildSpecSummary = () => {
    return [
      MODEL,
      cpu.label,
      `Chipset ${chipset}`,
      `${ramGb}GB RAM`,
      `${ssdGb >= 1024 ? `${ssdGb / 1024}TB` : `${ssdGb}GB`} Storage`,
      `PSU ${psu}`,
      osKey,
      `รับประกัน ${warrantyYears} ปี`,
      `จำนวน ${qty} ชุด`,
    ].join(' • ');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`${MODEL} — ${CATEGORY} | IPCTECH × ENT Group`}
        description={`${MODEL} 4U Industrial Computer สำหรับงานโครงการภาครัฐ — รองรับ Intel Gen 4–14, เมนบอร์ด 9 รุ่น, −30~70°C, ปรับแต่งตาม TOR ราชการได้`}
        path={`/shop/ipctech/${MODEL.toLowerCase()}`}
      />
      <SiteNavbar />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 py-3 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>›</span>
          <Link to="/partners/ipctech" className="hover:text-primary">IPCTECH</Link>
          <span>›</span>
          <span className="text-foreground font-medium">{MODEL}</span>
          <div className="ml-auto">
            <Button asChild size="sm" variant="outline" className="h-8 gap-1.5">
              <Link to="/partners/ipctech">
                <ArrowLeft className="w-3.5 h-3.5" />
                กลับหน้า IPCTECH
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Gallery */}
          <div className="space-y-3 lg:col-span-2 lg:max-w-[460px] w-full">
            <div
              className="relative aspect-[4/3] bg-muted rounded-xl overflow-hidden border border-border group cursor-zoom-in"
              onClick={() => setLightbox(true)}
            >
              <img
                src={GALLERY[activeImg]}
                alt={`${MODEL} ${activeImg + 1}`}
                className="w-full h-full object-contain transition-opacity duration-500"
                onError={(e) => { (e.target as HTMLImageElement).src = '/product-placeholder.svg'; }}
              />
              <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5" /> คลิกเพื่อขยาย
              </div>
              {GALLERY.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {GALLERY.map((_, i) => (
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
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-bold tracking-wider uppercase text-[10px]">
                ★ NEW LAUNCH
              </Badge>
            </div>
            {GALLERY.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {GALLERY.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      'aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-all',
                      i === activeImg ? 'border-primary' : 'border-transparent hover:border-border'
                    )}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4 lg:col-span-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="default">IPCTECH</Badge>
              <Badge variant="outline">{CATEGORY}</Badge>
              <Badge variant="secondary"><Award className="w-3 h-3 mr-1" />Government Spec</Badge>
              <Badge variant="secondary"><ShieldCheck className="w-3 h-3 mr-1" />รับประกัน 1 ปี (เพิ่มได้)</Badge>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{MODEL}</h1>
            <p className="text-lg text-muted-foreground">4U Industrial Computer · งานโครงการภาครัฐ / TOR ราชการ</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{INTRO}</p>

            <div className="flex flex-wrap gap-1.5">
              {INCLUDED_FEATURES.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-medium">
                  <Check className="w-3 h-3" /> {f}
                </span>
              ))}
            </div>

            {/* Quote-only CTA */}
            <Card className="bg-primary/5 border-primary/30">
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">ราคาตามสเปก</p>
                  <p className="text-xl font-bold text-foreground">ขอใบเสนอราคา</p>
                  <p className="text-xs text-muted-foreground">ปรับแต่งสเปกตาม TOR ได้ทุกข้อกำหนด · ออกใบเสนอราคาในนามนิติบุคคล</p>
                </div>
                <Button size="lg" onClick={() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Wrench className="w-4 h-4 mr-2" /> เลือกสเปก
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CONFIGURATOR + CTA — 2 cols */}
      <section id="configurator" className="container max-w-7xl mx-auto px-4 py-6 lg:py-10 scroll-mt-20">
        <SectionHeader icon={Wrench} title="ปรับแต่งสเปก" subtitle="เลือกสเปกตาม TOR ของโครงการ — ทีมงานจะออกใบเสนอราคาให้ภายใน 1 วันทำการ" />

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left: Configurator (2 cols) */}
          <Card className="lg:col-span-2">
            <CardContent className="p-5 space-y-5">
              {/* CPU */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Cpu className="w-4 h-4 text-primary" /> CPU / Processor
                  <Badge variant="outline" className="text-[10px] ml-auto">{CPU_OPTIONS.length} options</Badge>
                </div>
                <Select value={cpuKey} onValueChange={setCpuKey}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CPU_OPTIONS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <span className="flex flex-col text-left">
                          <span className="font-medium">{c.label}</span>
                          <span className="text-[11px] text-muted-foreground">{c.desc}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chipset */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Settings2 className="w-4 h-4 text-primary" /> Mainboard / Chipset
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CHIPSET_OPTIONS.map((ch) => (
                    <Chip key={ch} active={chipset === ch} onClick={() => setChipset(ch)}>{ch}</Chip>
                  ))}
                </div>
              </div>

              {/* RAM + SSD */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><MemoryStick className="w-4 h-4 text-primary" /> RAM</div>
                  <div className="flex flex-wrap gap-1.5">
                    {RAM_OPTIONS.map((r) => (
                      <Chip key={r.gb} active={ramGb === r.gb} onClick={() => setRamGb(r.gb)}>{r.label}</Chip>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><HardDrive className="w-4 h-4 text-primary" /> Storage</div>
                  <div className="flex flex-wrap gap-1.5">
                    {SSD_OPTIONS.map((s) => (
                      <Chip key={s.gb} active={ssdGb === s.gb} onClick={() => setSsdGb(s.gb)}>{s.label}</Chip>
                    ))}
                  </div>
                </div>
              </div>

              {/* PSU + OS */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><Zap className="w-4 h-4 text-primary" /> Power Supply</div>
                  <div className="flex flex-wrap gap-1.5">
                    {PSU_OPTIONS.map((p) => (
                      <Chip key={p} active={psu === p} onClick={() => setPsu(p)}>{p}</Chip>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><MonitorCog className="w-4 h-4 text-primary" /> ระบบปฏิบัติการ</div>
                  <Select value={osKey} onValueChange={setOsKey}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {OS_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Warranty + Qty */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="w-4 h-4 text-primary" /> รับประกัน</div>
                  <div className="space-y-1">
                    {([1, 2, 3] as const).map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setWarrantyYears(y)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-md border text-xs transition-all',
                          warrantyYears === y ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {warrantyYears === y && <Check className="w-3 h-3 text-primary" />}
                          {y === 1 ? '1 ปี (Standard)' : y === 2 ? '2 ปี' : '3 ปี (Premium)'}
                        </span>
                        <span className="font-medium text-muted-foreground">
                          {y === 1 ? 'รวมแล้ว' : 'สอบถามแอดมิน'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="w-4 h-4 text-primary" /> จำนวน (ชุด)</div>
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
                  <p className="text-[11px] text-muted-foreground">รองรับโครงการขนาดใหญ่ — ส่วนลดตามจำนวน สอบถามแอดมิน</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Sticky Quote Summary */}
          <div className="lg:sticky lg:top-20 lg:self-start space-y-3">
            <Card className="border-primary/30 shadow-md">
              <CardContent className="p-5 space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">สรุปสเปกที่เลือก</div>
                <div className="space-y-1.5 text-xs">
                  <Row label="CPU" value={cpu.label} />
                  <Row label="Chipset" value={chipset} />
                  <Row label="RAM" value={`${ramGb} GB`} />
                  <Row label="Storage" value={ssdGb >= 1024 ? `${ssdGb / 1024} TB` : `${ssdGb} GB`} />
                  <Row label="PSU" value={psu} />
                  <Row label="OS" value={osKey} />
                  <Row label="รับประกัน" value={`${warrantyYears} ปี`} />
                  <Row label="จำนวน" value={`${qty} ชุด`} />
                </div>
                <Separator />
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">ราคา</p>
                  <p className="text-base font-bold text-foreground">ขอใบเสนอราคาตามสเปก</p>
                  <p className="text-[10px] text-muted-foreground mt-1">ทีมงานติดต่อกลับภายใน 1 วันทำการ</p>
                </div>
                <div className="space-y-2 pt-1">
                  <QuoteRequestButton
                    productName={`IPCTECH ${MODEL} — ${buildSpecSummary()}`}
                    size="lg"
                    className="w-full"
                  />
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/partners/ipctech">
                      <FileText className="w-4 h-4 mr-2" /> ดูรุ่นอื่นของ IPCTECH
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PR Banner */}
            <Card className="border-amber-400/40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 shadow-sm">
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-start gap-2">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-foreground">ปรึกษาเขียน TOR / วางสเปก</div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      ทีมวิศวกรช่วยเขียนสเปกราชการให้ตรงตามระเบียบพัสดุ — ฟรีไม่มีค่าใช้จ่าย
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

      {/* Built-in Features */}
      <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <SectionHeader icon={Cable} title="คุณสมบัติเด่น" subtitle="ฟีเจอร์มาตรฐานที่ติดตัวรุ่นนี้" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INCLUDED_FEATURES.map((f) => (
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

      {/* Full Specifications */}
      <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <SectionHeader icon={Package} title="ข้อมูลจำเพาะทั้งหมด" subtitle="Specifications สมบูรณ์ตาม datasheet ผู้ผลิต IPCTECH" />
        <div className="grid md:grid-cols-2 gap-4">
          {SPECS.map((group) => (
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

      {/* Use Cases — Flagship Government Projects */}
      <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <SectionHeader icon={Sparkles} title="เหมาะกับงานโครงการภาครัฐ" subtitle="ตัวอย่างการใช้งานจริงในโครงการราชการและรัฐวิสาหกิจ" />

        {/* Flagship project cards with imagery */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {FLAGSHIP_PROJECTS.map((p) => (
            <Card key={p.title} className="overflow-hidden group hover:border-primary/60 hover:shadow-lg transition-all">
              <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  width={1280}
                  height={720}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur text-primary-foreground text-[10px] uppercase tracking-wider">
                  {p.tag}
                </Badge>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-base drop-shadow-md">{p.title}</h3>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.metrics.map((m) => (
                    <span key={m} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-semibold">
                      <Check className="w-3 h-3" /> {m}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compact use-case grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {USE_CASES.map((u) => {
            const Icon = u.icon;
            return (
              <Card key={u.label} className="hover:border-primary/50 transition-all">
                <CardContent className="p-4 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-semibold text-sm">{u.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">{u.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ENT Group Trust Block */}
        <Card className="mt-8 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            <div className="grid lg:grid-cols-5 gap-6 items-center">
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary text-primary-foreground"><ShieldCheck className="w-3 h-3 mr-1" />ENT GROUP</Badge>
                  <Badge variant="outline">พันธมิตรธุรกิจที่คุณไว้วางใจ</Badge>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  ทำไมโครงการภาครัฐ <span className="text-primary">เลือก ENT Group</span> เป็นผู้ส่งมอบ
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ENT Group เป็นตัวแทนจำหน่ายอย่างเป็นทางการของ IPCTECH ในประเทศไทย — ส่งมอบ QY-U4000 ให้กับโครงการราชการ
                  รัฐวิสาหกิจ และผู้รับเหมาระบบ ครอบคลุมทั้งงาน CCTV เมือง, ITS, SCADA และระบบรถไฟฟ้า ตามมาตรฐาน TOR
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
                  {[
                    { icon: FileText, t: 'เขียน TOR / วางสเปกฟรี', d: 'ทีมวิศวกรช่วยเขียนสเปกตามระเบียบพัสดุ' },
                    { icon: Award, t: 'รับประกันสูงสุด 3 ปี', d: 'เคลมในไทย ไม่ต้องส่งกลับโรงงาน' },
                    { icon: Wrench, t: 'Custom BIOS / Custom Label', d: 'ปรับแต่งตามมาตรฐานเฉพาะหน่วยงาน' },
                    { icon: Phone, t: 'ทีมซัพพอร์ตในไทย 24/7', d: 'On-site service สำหรับโครงการขนาดใหญ่' },
                  ].map((b) => (
                    <div key={b.t} className="flex items-start gap-2.5 p-2.5 rounded-md bg-background/60 border border-border">
                      <div className="w-8 h-8 rounded-md bg-primary/15 flex items-center justify-center shrink-0">
                        <b.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight">{b.t}</p>
                        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{b.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-lg bg-background/70 border border-border">
                    <p className="text-2xl font-bold text-primary">15+</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">ปี ในวงการ</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/70 border border-border">
                    <p className="text-2xl font-bold text-primary">500+</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">โครงการ</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/70 border border-border">
                    <p className="text-2xl font-bold text-primary">24/7</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">ซัพพอร์ตไทย</p>
                  </div>
                </div>
                <QuoteRequestButton
                  productName={`IPCTECH ${MODEL} — ขอใบเสนอราคาโครงการภาครัฐ`}
                  size="lg"
                  className="w-full"
                />
                <Button asChild variant="outline" className="w-full">
                  <Link to="/partners/ipctech">
                    <ArrowLeft className="w-4 h-4 mr-2" /> ดูสินค้า IPCTECH ทั้งหมด
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Related IPCTECH */}
      <section className="container max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <SectionHeader icon={Sparkles} title="รุ่นอื่นของ IPCTECH" subtitle="สินค้าในตระกูลเดียวกันจากพันธมิตร IPCTECH" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RELATED.map((r) => (
            <Link key={r.id} to="/partners/ipctech" className="group">
              <Card className="h-full hover:border-primary transition-all hover:shadow-md">
                <div className="aspect-[4/3] bg-muted rounded-t-lg overflow-hidden flex items-center justify-center p-2">
                  <img src={r.img} alt={r.id} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                <CardContent className="p-3">
                  <p className="font-bold text-sm uppercase">{r.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.title}</p>
                  <p className="text-xs text-primary font-semibold mt-1">ขอใบเสนอราคา →</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(false); }} className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl">×</button>
          {GALLERY.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + GALLERY.length) % GALLERY.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % GALLERY.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          <img src={GALLERY[activeImg]} alt={MODEL} className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">{activeImg + 1} / {GALLERY.length}</div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-right truncate">{value}</span>
    </div>
  );
}

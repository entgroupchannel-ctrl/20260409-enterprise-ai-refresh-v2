import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Cpu, Wifi, Monitor, Usb, ThermometerSun, Wind,
  Shield, Zap, HardDrive, Network, ChevronDown, ExternalLink,
  Factory, Building2, Truck, Stethoscope, Server, MonitorSmartphone,
  FileText, DollarSign, Plug
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FooterCompact from "@/components/FooterCompact";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import { LineQRDialog } from "@/components/LineQRDialog";
import GBPriceList from "@/components/GBPriceList";

/* ───── Product Data ───── */
const models = [
  {
    id: "gb1000",
    name: "GB1000",
    tagline: "Ultra-Compact Champion",
    description: "ขนาดเล็กที่สุดในซีรีส์ เพียง 21×18×5.2 cm เล็กกว่า GB5000 ถึง 60% แต่ยังคงประสิทธิภาพ Industrial Grade เป็น Gateway Product สำหรับเข้าสู่โลก Industrial Computing",
    badge: "NEW",
    image: "/images/wix/0597a3_8f5ea734fd4e41de8db85394a03f50bf_f19d04ba.png",
    portImage: "/images/wix/0597a3_0573ad6ed4564cb6bceda0c8b4b63124_710a5847.png",
    highlights: [
      { icon: Monitor, text: "21×18×5.2 cm", sub: "Ultra-Compact" },
      { icon: Wind, text: "Fanless", sub: "0 dB Silent" },
      { icon: Usb, text: "6x COM", sub: "RS232/422/485" },
      { icon: Network, text: "2x LAN", sub: "Gigabit" },
    ],
    features: [
      "ขนาดเล็กที่สุด เพียง 21×18×5.2 cm (เล็กกว่า GB5000 ถึง 60%)",
      "Fanless Silent — ไร้เสียงรบกวน, ไม่มีชิ้นส่วนเคลื่อนไหว",
      "6x COM Ports สำหรับอุปกรณ์อุตสาหกรรม",
      "Dual Display — HDMI + VGA",
      "4x USB Ports",
      "DIN Rail / Wall Mount ติดตั้งได้หลากหลาย",
      "Aluminum Alloy Shell วัสดุคุณภาพ",
    ],
    useCases: [
      { icon: Building2, title: "Office & SME", desc: "POS, Kiosk, Reception Desk, Conference Room" },
      { icon: Factory, title: "Small Factory", desc: "Machine Control, QC Station, Barcode Scanner" },
      { icon: Truck, title: "Transportation", desc: "In-vehicle PC, Fleet Management, GPS Navigation" },
      { icon: Stethoscope, title: "Healthcare", desc: "Medical Equipment, Lab Data, Clean Room" },
    ],
    specs: {
      left: [
        { cat: "Platform", rows: [["CPU", "Intel Celeron / Core i"], ["Chipset", "Intel Bay Trail / Broadwell"]] },
        { cat: "Memory & Storage", rows: [["RAM", "DDR3L SO-DIMM, Max 8GB"], ["Storage", "1x mSATA + 1x 2.5\" SATA"]] },
        { cat: "Display", rows: [["Output", "1x HDMI + 1x VGA"], ["Resolution", "1920×1080"]] },
      ],
      right: [
        { cat: "I/O Ports", rows: [["COM", "6x RS232 (2x RS422/RS485)"], ["USB", "4x USB (2.0/3.0)"], ["LAN", "2x Gigabit Ethernet"]] },
        { cat: "Power & Env", rows: [["Power", "DC 12V"], ["Temp", "-20°C ~ +60°C"], ["Size", "210×180×52 mm"], ["Mounting", "DIN Rail / Wall Mount"]] },
      ],
    },
    pricing: [
      { cpu: "Celeron J1900", ram: "4GB", storage: "128GB SSD", price: "สอบถามราคาพิเศษ" },
      { cpu: "Celeron J1900", ram: "8GB", storage: "256GB SSD", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i3", ram: "8GB", storage: "256GB SSD", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i5", ram: "8GB", storage: "512GB SSD", price: "สอบถามราคาพิเศษ" },
    ],
  },
  {
    id: "gb2000",
    name: "GB2000",
    tagline: "Network Professional",
    description: "เครือข่ายความเร็วสูง 2.5G LAN พร้อม Legacy I/O ครบครัน PS/2, GPIO, LPT รองรับ 3G/4G Module เหมาะสำหรับธุรกิจที่ต้องการอัปเกรดระบบเก่าให้ทันสมัย",
    image: "/images/wix/0597a3_b7d3859e0bcf4d2eaeb80e45384e91dc_d4e6442f.jpg",
    portImage: "/images/wix/0597a3_79cf8621f41a4181bec353e60cb515b6_16bcc3af.png",
    highlights: [
      { icon: Network, text: "2x 2.5G LAN", sub: "Intel i225V" },
      { icon: Usb, text: "6x COM", sub: "RS422/RS485" },
      { icon: Zap, text: "GPIO", sub: "7in + 7out" },
      { icon: Wifi, text: "3G/4G Ready", sub: "SIM Slot" },
    ],
    features: [
      "2x Intel i225V 2.5 Gigabit LAN — เร็วกว่า Gigabit 2.5 เท่า",
      "6x COM + GPIO (7in/7out) + LPT + PS/2",
      "3G/4G Module Ready พร้อม SIM Slot",
      "Fanless -20°C ~ +60°C, Aluminum Alloy Shell",
      "Compact Size ~22×18×6 cm",
      "Watchdog, AWAL, RTC, WOL",
    ],
    useCases: [
      { icon: Factory, title: "Factory Automation", desc: "PLC, SCADA, Sensor Networks, Motor Control" },
      { icon: Server, title: "Edge Computing", desc: "Network Gateway, IoT Hub, Data Processing" },
      { icon: Truck, title: "Remote Sites", desc: "4G Management, Remote Monitor" },
      { icon: Building2, title: "Legacy Upgrade", desc: "PS/2, LPT, COM Legacy Support" },
    ],
    specs: {
      left: [
        { cat: "Platform", rows: [["CPU", "Intel Celeron / Core i"], ["Chipset", "Intel SoC"]] },
        { cat: "Memory & Storage", rows: [["RAM", "DDR4 SO-DIMM, Max 16GB"], ["Storage", "1x M.2 + 1x 2.5\" SATA"]] },
        { cat: "Display", rows: [["Output", "1x HDMI + 1x VGA"], ["Resolution", "4K@30Hz (HDMI)"]] },
      ],
      right: [
        { cat: "I/O Ports", rows: [["COM", "6x RS232 (4x RS422/RS485)"], ["USB", "6x USB"], ["LAN", "2x Intel i225V 2.5GbE"], ["GPIO", "7 input + 7 output"], ["Other", "PS/2, LPT Port"]] },
        { cat: "Power & Env", rows: [["Power", "DC 9-36V"], ["Temp", "-20°C ~ +60°C"], ["Size", "~220×180×60 mm"], ["Wireless", "3G/4G Module Ready"]] },
      ],
    },
    pricing: [
      { cpu: "Celeron", ram: "4GB", storage: "128GB SSD", price: "สอบถามราคาพิเศษ" },
      { cpu: "Celeron", ram: "8GB", storage: "256GB SSD", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i3", ram: "8GB", storage: "256GB SSD", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i5", ram: "16GB", storage: "512GB SSD", price: "สอบถามราคาพิเศษ" },
    ],
  },
  {
    id: "gb4000v1",
    name: "GB4000 v1",
    tagline: "Legacy Max — 12 COM",
    description: "รุ่น v1 สำหรับงานที่ต้องการ COM ports จำนวนมากถึง 12 ช่อง (6x DB9 + 6x RS232 Terminal) รองรับ CPU Gen 4-13 เหมาะสำหรับระบบ SCADA, BMS และระบบควบคุมอุตสาหกรรมขนาดใหญ่",
    badge: "Best Seller",
    image: "/images/wix/0597a3_95c69a88c2ba459e88ffef869f27fb02_e12a03c2.png",
    portImage: "/images/wix/0597a3_508c69f5680e4666ac1d0e89ad4263e7_46a30306.png",
    highlights: [
      { icon: Usb, text: "12x COM", sub: "6x DB9 + 6x Terminal" },
      { icon: Cpu, text: "Gen 4-13", sub: "Intel Core i3/i5/i7" },
      { icon: HardDrive, text: "Max 64GB", sub: "DDR4 SO-DIMM" },
      { icon: ThermometerSun, text: "-20~+60°C", sub: "Wide Temp" },
    ],
    features: [
      "12x COM Ports (6x DB9 COM + 6x RS232 Terminal Phoenix)",
      "4 ports รองรับ RS422/RS485",
      "CPU: Intel Gen 4 ถึง Gen 13 (Raptor Lake)",
      "DDR4 Max 64GB, 2x M.2 NVMe + 1x SATA",
      "Display: 1x HDMI + 1x VGA",
      "Fanless Aluminum Alloy Shell",
      "ประกัน 1 ปี (เพิ่มได้สูงสุด 3 ปี)",
      "อัตราเสียหาย < 1%, ทำงาน 24/7",
    ],
    useCases: [
      { icon: Factory, title: "SCADA / BMS", desc: "ระบบควบคุมอาคาร, โรงงานขนาดใหญ่" },
      { icon: Server, title: "Legacy Integration", desc: "COM 12 ช่อง สำหรับอุปกรณ์เก่า" },
      { icon: Shield, title: "24/7 Mission Critical", desc: "อัตราเสียหาย < 1%" },
      { icon: Building2, title: "Building Management", desc: "ระบบจัดการอาคารอัตโนมัติ" },
    ],
    specs: {
      left: [
        { cat: "Platform", rows: [["CPU", "Intel Core i3/i5/i7 Gen 4-13"], ["Chipset", "Intel H/Q Series"], ["CPU Support", "Haswell → Skylake → Kaby Lake → Kaby Lake-R → Comet Lake → Tiger Lake → Alder Lake → Raptor Lake"]] },
        { cat: "Memory & Storage", rows: [["RAM", "DDR4 SO-DIMM, Max 64GB"], ["Storage", "2x M.2 NVMe + 1x 2.5\" SATA"]] },
        { cat: "Display", rows: [["Output", "1x HDMI + 1x VGA"], ["Resolution", "4K@30Hz"]] },
      ],
      right: [
        { cat: "I/O Ports", rows: [["COM", "12x (6x DB9 + 6x Terminal Phoenix)"], ["RS422/RS485", "4 ports รองรับ"], ["USB", "6x USB"], ["LAN", "2x Gigabit Ethernet"]] },
        { cat: "Power & Env", rows: [["Power", "DC 9-36V"], ["Temp", "-20°C ~ +60°C"], ["Design", "Fanless Aluminum Alloy"]] },
      ],
    },
    pricing: [
      { cpu: "Core i3 Gen 10", ram: "8GB", storage: "256GB NVMe", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i5 Gen 10", ram: "16GB", storage: "512GB NVMe", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i7 Gen 10", ram: "32GB", storage: "512GB NVMe", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i5 Gen 12", ram: "16GB", storage: "512GB NVMe", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i7 Gen 13", ram: "32GB", storage: "1TB NVMe", price: "สอบถามราคาพิเศษ" },
    ],
    datasheet: "/datasheets/0597a3_7976e083702b4dbdaa44aa305ccacd6a.pdf",
  },
  {
    id: "gb4000v2",
    name: "GB4000 v2",
    tagline: "USB Max — 10 USB",
    description: "รุ่น v2 สำหรับงานที่ต้องการ USB ports จำนวนมากถึง 10 ช่อง พร้อม 6x COM และ Dual HDMI Display รองรับ CPU Gen 4-13 เหมาะสำหรับงานที่ต้องการความยืดหยุ่นในการเชื่อมต่ออุปกรณ์ทันสมัย",
    badge: "NEW v2",
    image: "/images/wix/0597a3_6ee79905a67f4623be10cf8545d60eca_5b79f36c.png",
    portImage: "/images/wix/0597a3_13a26c72c6974b4bac0169597fd0483d_bcf77370.png",
    highlights: [
      { icon: Usb, text: "10x USB", sub: "USB 3.0 / 2.0" },
      { icon: Usb, text: "6x COM", sub: "4x RS422/RS485" },
      { icon: Monitor, text: "2x HDMI", sub: "Dual Display" },
      { icon: Cpu, text: "Gen 4-13", sub: "Intel Core i3/i5/i7" },
    ],
    features: [
      "10x USB Ports (USB 3.0 / 2.0)",
      "6x DB9 COM (4 ports รองรับ RS422/RS485)",
      "Dual HDMI Display — 2x HDMI output",
      "CPU: Intel Gen 4 ถึง Gen 13 (Raptor Lake)",
      "DDR4 Max 64GB, 2x M.2 NVMe + 1x SATA",
      "Fanless Aluminum Alloy Shell",
      "ประกัน 1 ปี (เพิ่มได้สูงสุด 3 ปี)",
      "อัตราเสียหาย < 1%, ทำงาน 24/7",
    ],
    useCases: [
      { icon: MonitorSmartphone, title: "USB Heavy Workload", desc: "เชื่อมต่ออุปกรณ์ USB หลายตัวพร้อมกัน" },
      { icon: Factory, title: "Industry 4.0", desc: "อุปกรณ์ทันสมัยผ่าน USB" },
      { icon: Monitor, title: "Dual Screen", desc: "การแสดงผล 2 จอผ่าน HDMI" },
      { icon: Shield, title: "24/7 Mission Critical", desc: "อัตราเสียหาย < 1%" },
    ],
    specs: {
      left: [
        { cat: "Platform", rows: [["CPU", "Intel Core i3/i5/i7 Gen 4-13"], ["Chipset", "Intel H/Q Series"], ["CPU Support", "Haswell → Skylake → Kaby Lake → Kaby Lake-R → Comet Lake → Tiger Lake → Alder Lake → Raptor Lake"]] },
        { cat: "Memory & Storage", rows: [["RAM", "DDR4 SO-DIMM, Max 64GB"], ["Storage", "2x M.2 NVMe + 1x 2.5\" SATA"]] },
        { cat: "Display", rows: [["Output", "2x HDMI"], ["Resolution", "4K@30Hz"]] },
      ],
      right: [
        { cat: "I/O Ports", rows: [["COM", "6x DB9 COM"], ["RS422/RS485", "4 ports รองรับ"], ["USB", "10x USB (3.0/2.0)"], ["LAN", "2x Gigabit Ethernet"]] },
        { cat: "Power & Env", rows: [["Power", "DC 9-36V"], ["Temp", "-20°C ~ +60°C"], ["Design", "Fanless Aluminum Alloy"]] },
      ],
    },
    pricing: [
      { cpu: "Core i3 Gen 10", ram: "8GB", storage: "256GB NVMe", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i5 Gen 10", ram: "16GB", storage: "512GB NVMe", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i7 Gen 10", ram: "32GB", storage: "512GB NVMe", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i5 Gen 12", ram: "16GB", storage: "512GB NVMe", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i7 Gen 13", ram: "32GB", storage: "1TB NVMe", price: "สอบถามราคาพิเศษ" },
    ],
    datasheet: "/datasheets/0597a3_bd71d5140b9b4a94845ab18c67c3d4c4.pdf",
  },
  {
    id: "gb5000",
    name: "GB5000",
    tagline: "Premium Performance",
    description: "ประสิทธิภาพสูงสุดด้วย Intel Core i7-13650HX (14 cores, 20 threads), DDR5 64GB, 4x HDMI 2.0 4K@60Hz และ 4x 2.5G LAN รองรับ 5G Module",
    badge: "Premium",
    image: "/images/wix/0597a3_84464f31e83d47a982b5ee3b559db400_8ab46d63.png",
    portImage: "/images/wix/0597a3_b27a4d1466524aa88d306288b92a6f13_0c2cf8d6.png",
    highlights: [
      { icon: Cpu, text: "i7-13650HX", sub: "14C / 20T" },
      { icon: Monitor, text: "4x HDMI 2.0", sub: "4K@60Hz" },
      { icon: Network, text: "4x 2.5G LAN", sub: "Intel i226V" },
      { icon: HardDrive, text: "DDR5 64GB", sub: "2x M.2 NVMe" },
    ],
    features: [
      "Intel Core i7-13650HX — 14 cores, 20 threads",
      "DDR5 RAM สูงสุด 64GB",
      "4x HDMI 2.0 (4K@60Hz) — Multi-Display 4 จอพร้อมกัน",
      "4x Intel i226V 2.5G LAN — เร็วกว่า Gigabit 2.5 เท่า",
      "6x COM (4x RS422/RS485) + 8x USB",
      "5G Module Ready + Dual Power Input 9-36V",
      "Fanless Design, Aluminum Alloy Shell",
      "Dustproof, Fin Heat Dissipation",
    ],
    useCases: [
      { icon: Monitor, title: "Digital Signage", desc: "4 จอ 4K@60Hz พร้อมกัน" },
      { icon: Factory, title: "Control Room", desc: "SCADA, Multi-monitor Dashboard" },
      { icon: Server, title: "Edge AI", desc: "ประมวลผลหนักที่ขอบ" },
      { icon: Shield, title: "Enterprise 24/7", desc: "อัตราเสียหาย < 1%" },
    ],
    specs: {
      left: [
        { cat: "Platform", rows: [["CPU", "Intel Core i7-13650HX (14C/20T)"], ["Chipset", "Intel HM770"]] },
        { cat: "Memory & Storage", rows: [["RAM", "DDR5 SO-DIMM, Max 64GB"], ["Storage", "2x M.2 NVMe + 1x 2.5\" SATA"]] },
        { cat: "Display", rows: [["Output", "4x HDMI 2.0"], ["Resolution", "4K@60Hz × 4 จอ"]] },
      ],
      right: [
        { cat: "I/O Ports", rows: [["COM", "6x RS232 (4x RS422/RS485)"], ["USB", "8x USB (3.0/2.0)"], ["LAN", "4x Intel i226V 2.5GbE"]] },
        { cat: "Power & Env", rows: [["Power", "DC 9-36V (Dual Input)"], ["Temp", "-20°C ~ +60°C"], ["Wireless", "5G Module Ready"], ["Design", "Dustproof, Fin Heat Dissipation"]] },
      ],
    },
    pricing: [
      { cpu: "Core i5-13500H", ram: "16GB DDR5", storage: "512GB NVMe", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i7-13650HX", ram: "32GB DDR5", storage: "512GB NVMe", price: "สอบถามราคาพิเศษ" },
      { cpu: "Core i7-13650HX", ram: "64GB DDR5", storage: "1TB NVMe", price: "สอบถามราคาพิเศษ" },
    ],
  },
];

const comparisonRows = [
  { label: "ขนาด", values: ["21×18×5.2 cm", "~22×18×6 cm", "Standard", "Standard", "Large"] },
  { label: "CPU", values: ["Celeron/Core i", "Celeron/Core i", "Gen 4-13", "Gen 4-13", "i7-13650HX"] },
  { label: "RAM สูงสุด", values: ["8GB DDR3L", "16GB DDR4", "64GB DDR4", "64GB DDR4", "64GB DDR5"] },
  { label: "LAN", values: ["2x GbE", "2x 2.5GbE", "2x GbE", "2x GbE", "4x 2.5GbE"] },
  { label: "COM Ports", values: ["6", "6", "12", "6", "6"] },
  { label: "USB Ports", values: ["4", "6", "6", "10", "8"] },
  { label: "Display", values: ["HDMI+VGA", "HDMI+VGA", "HDMI+VGA", "2x HDMI", "4x HDMI 2.0"] },
  { label: "GPIO", values: ["—", "7in+7out", "—", "—", "—"] },
  { label: "4G/5G", values: ["—", "3G/4G", "—", "—", "5G Ready"] },
  { label: "Wide Temp", values: ["✓", "✓", "✓", "✓", "✓"] },
  { label: "เหมาะสำหรับ", values: ["SME, พื้นที่จำกัด", "Network, Legacy", "COM เยอะ, SCADA", "USB เยอะ, Dual HDMI", "Multi-Display, AI"] },
];

/* ───── Collapsible Section ───── */
const CollapsibleSpec = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left">
        <span className="font-semibold text-sm">{title}</span>
        <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-[3000px]" : "max-h-0"}`}>{children}</div>
    </div>
  );
};

/* ───── Model Card ───── */
const ModelCard = ({ model, isActive, onClick }: { model: typeof models[0]; isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 text-center ${
      isActive ? "border-primary bg-primary/5 shadow-lg scale-[1.02]" : "border-border bg-card hover:border-primary/30 hover:-translate-y-1"
    }`}
  >
    {model.badge && (
      <span className={`absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        model.badge === "Premium" ? "bg-amber-500 text-white"
        : model.badge === "Best Seller" ? "bg-destructive text-destructive-foreground"
        : "bg-primary text-primary-foreground"
      }`}>{model.badge}</span>
    )}
    <img src={model.image} alt={model.name} className="w-20 h-20 object-contain mb-2" loading="lazy" />
    <h3 className="text-base font-black text-foreground">{model.name}</h3>
    <p className="text-[10px] text-primary font-medium">{model.tagline}</p>
  </button>
);

/* ───── Main Page ───── */
const GBSeries = () => {
  const [activeModel, setActiveModel] = useState(0);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [showLineQR, setShowLineQR] = useState(false);
  const [compareFilter, setCompareFilter] = useState<number[]>(models.map((_, i) => i));
  const current = models[activeModel];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="GB Series — Compact Mini PC สำนักงาน" description="GB Series Mini PC ขนาดกะทัดรัด รองรับ Intel N100 ถึง Core i7 สำหรับสำนักงาน Digital Signage และ Thin Client ราคาจากโรงงาน" path="/gb-series" />
      <ProductJsonLd
        collectionName="GB Series Compact Mini PC"
        collectionDescription="GB Series Mini PC ขนาดกะทัดรัด รองรับ Intel N100 ถึง Core i7 สำหรับสำนักงาน Digital Signage และ Thin Client"
        collectionUrl="/gb-series"
        products={models.map(m => ({ name: m.name, description: m.tagline, category: "Compact Mini PC" }))}      />

      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "GB Series", path: "/gb-series" }]} />
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> หน้าแรก
          </Link>
          <h1 className="text-sm font-bold">GB Series Industrial PC</h1>
          <button
            onClick={() => setQuoteOpen(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            ขอใบเสนอราคา
          >
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="container max-w-7xl mx-auto px-6 py-16 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Industrial Grade Computer</span>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-4">
              GB<span className="text-gradient"> SERIES</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-2">ซีรีส์คอมพิวเตอร์อุตสาหกรรมครบครัน ตอบโจทย์ทุกความต้องการ</p>
            <p className="text-primary font-semibold">"5 รุ่น 5 สไตล์ — 1 มาตรฐานคุณภาพเดียวกัน"</p>
          </div>

          {/* Model Selector */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {models.map((m, i) => (
              <ModelCard key={m.id} model={m} isActive={i === activeModel} onClick={() => setActiveModel(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Active Model Detail */}
      <section className="border-t border-border">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <h2 className="text-4xl font-black text-foreground">{current.name}</h2>
                <span className="text-sm text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">{current.tagline}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{current.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {current.highlights.map((h) => (
                  <div key={h.text} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                    <h.icon className="text-primary shrink-0" size={20} />
                    <div>
                      <div className="text-sm font-bold text-foreground">{h.text}</div>
                      <div className="text-[11px] text-muted-foreground">{h.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <ul className="space-y-2 mb-6">
                {current.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span> {f}

                  </li>
                ))}
              </ul>

              <button
                onClick={() => setQuoteOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
              >
                <FileText size={18} /> ขอใบเสนอราคา {current.name}

              </button>
            </div>

            <div className="flex justify-center">
              <img src={current.image} alt={current.name} className="max-w-sm w-full object-contain drop-shadow-2xl" loading="lazy" />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pricing" className="space-y-6">
            <TabsList className="w-full justify-start bg-secondary/30 p-1 h-auto flex-wrap">
              <TabsTrigger value="pricing" className="text-xs sm:text-sm"><DollarSign size={14} className="mr-1 inline" /> ราคา</TabsTrigger>
              <TabsTrigger value="usecases" className="text-xs sm:text-sm"><Factory size={14} className="mr-1 inline" /> การใช้งาน</TabsTrigger>
              <TabsTrigger value="specs" className="text-xs sm:text-sm"><FileText size={14} className="mr-1 inline" /> Specifications</TabsTrigger>
              <TabsTrigger value="ports" className="text-xs sm:text-sm"><Plug size={14} className="mr-1 inline" /> Ports & I/O</TabsTrigger>
            </TabsList>

            <TabsContent value="pricing">
              <div className="card-surface overflow-hidden">
                <div className="p-4 bg-primary/5 border-b border-border">
                  <h3 className="font-bold text-foreground">ราคา {current.name}</h3>
                  <p className="text-xs text-muted-foreground">ราคาไม่รวม VAT • สอบถามราคาพิเศษสำหรับโปรเจกต์</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">CPU</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">RAM</th>
                        <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Storage</th>
                        <th className="px-4 py-3 text-right font-semibold text-muted-foreground">ราคา</th>
                        <th className="px-4 py-3 text-center font-semibold text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {current.pricing.map((p, i) => (
                        <tr key={i} className="hover:bg-secondary/20">
                          <td className="px-4 py-3 font-medium text-foreground">{p.cpu}</td>
                          <td className="px-4 py-3 text-foreground">{p.ram}</td>
                          <td className="px-4 py-3 text-foreground">{p.storage}</td>
                          <td className="px-4 py-3 text-right font-bold text-primary">{p.price}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setQuoteOpen(true)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                              ขอราคา
                            >
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-secondary/20 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <Zap size={14} className="inline mr-1 text-primary" /> สามารถ Customize สเปกได้ตามต้องการ • Windows License เพิ่มเติมได้ • ประกัน 1 ปี (ซื้อเพิ่มสูงสุด 3 ปี)
                  </p>
                  <PriceDisclaimer />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usecases">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {current.useCases.map((uc) => (
                  <div key={uc.title} className="card-surface p-5 text-center">
                    <uc.icon className="mx-auto text-primary mb-3" size={28} />
                    <h4 className="font-bold text-foreground mb-1">{uc.title}</h4>
                    <p className="text-xs text-muted-foreground">{uc.desc}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="specs">
              <div className="card-surface overflow-hidden">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  {[current.specs.left, current.specs.right].map((col, ci) => (
                    <div key={ci} className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-border">
                          {col.map((section) => (
                            <>
                              <tr key={section.cat}

                                <td colSpan={2} className="px-4 py-2 bg-secondary/40 font-bold text-xs uppercase tracking-wider text-primary">{section.cat}</td>
                              </tr>
                              {section.rows.map(([label, value]) => (
                                <tr key={label} className="hover:bg-secondary/20">
                                  <td className="px-4 py-2 font-medium text-muted-foreground w-1/3">{label}</td>
                                  <td className="px-4 py-2 text-foreground">{value}</td>
                                </tr>
                              ))}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ports">
              <div className="card-surface p-4">
                <img src={current.portImage} alt={`${current.name} Ports`} className="w-full max-w-4xl mx-auto object-contain rounded-lg" loading="lazy" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* GB4000 v1 vs v2 Comparison */}
      <section className="border-t border-border bg-secondary/10">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <CollapsibleSpec title="⚔️ เปรียบเทียบ GB4000 v1 vs v2 — เหมือนหรือต่างกันอย่างไร?" defaultOpen={true}

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-border bg-card">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-primary">v1</span> Legacy Max — 12 COM
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ 12x COM Ports (6x DB9 + 6x RS232 Terminal)</li>
                    <li>✓ 6x USB</li>
                    <li>✓ 1x HDMI + 1x VGA</li>
                    <li className="font-semibold text-foreground">เหมาะ: งาน SCADA, BMS, Legacy หลายอุปกรณ์</li>
                  </ul>
                  <a href="/datasheets/0597a3_7976e083702b4dbdaa44aa305ccacd6a.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline">
                    <ExternalLink size={12} /> ดาวน์โหลด Datasheet v1
                  </a>
                </div>
                <div className="p-5 rounded-xl border border-primary/30 bg-primary/5">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-primary">v2</span> USB Max — 10 USB
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold">NEW</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ 10x USB Ports</li>
                    <li>✓ 6x COM (DB9)</li>
                    <li>✓ 2x HDMI (Dual Display)</li>
                    <li className="font-semibold text-foreground">เหมาะ: งาน USB เยอะ, อุปกรณ์ทันสมัย, Dual Screen</li>
                  </ul>
                  <a href="/datasheets/0597a3_bd71d5140b9b4a94845ab18c67c3d4c4.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline">
                    <ExternalLink size={12} /> ดาวน์โหลด Datasheet v2
                  </a>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <h5 className="font-bold text-sm text-foreground mb-2">คุณสมบัติที่เหมือนกันทั้ง 2 รุ่น</h5>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <p>✓ CPU: Intel Gen 4 ถึง Gen 13 (Raptor Lake)</p>
                  <p>✓ RAM: DDR4 Max 64GB</p>
                  <p>✓ Storage: 2x M.2 NVMe + 1x SATA</p>
                  <p>✓ Fanless Design, -20°C ~ +60°C</p>
                  <p>✓ Aluminum Alloy Shell</p>
                  <p>✓ 24/7 Operation, อัตราเสียหาย {"<"} 1%</p>
                  <p>✓ ประกัน 1 ปี (ซื้อเพิ่มสูงสุด 3 ปี)</p>
                  <p>✓ 2x LAN, DC 9-36V</p>
                </div>
              </div>
            </div>
          </CollapsibleSpec>
        </div>
      </section>

      {/* Full Comparison Table with Filter */}
      <section className="border-t border-border bg-secondary/20">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <CollapsibleSpec title="เปรียบเทียบทุกรุ่น GB Series (5 รุ่น)" defaultOpen={true}

            <div className="p-4 space-y-4">
              {/* Model Filter Chips */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-muted-foreground mr-1">เลือกรุ่นที่ต้องการเปรียบเทียบ:</span>
                {models.map((m, i) => {
                  const isActive = compareFilter.includes(i);
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setCompareFilter(prev => {
                          if (prev.includes(i)) {
                            if (prev.length <= 2) return prev; // ต้องเลือกอย่างน้อย 2 รุ่น
                            return prev.filter(x => x !== i);
                          }
                          return [...prev, i];
                        });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card text-muted-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {m.name}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCompareFilter(models.map((_, i) => i))}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-primary hover:bg-primary/10 border border-primary/30 transition-colors">
                  เลือกทั้งหมด
                >
                </button>
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Feature</th>
                      {compareFilter.sort((a, b) => a - b).map((idx) => (
                        <th key={models[idx].id} className="px-4 py-3 text-center font-bold text-foreground whitespace-nowrap">{models[idx].name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {comparisonRows.map((row) => (
                      <tr key={row.label} className="hover:bg-secondary/20">
                        <td className="px-4 py-2.5 font-medium text-muted-foreground">{row.label}</td>
                        {compareFilter.sort((a, b) => a - b).map((idx) => (
                          <td key={idx} className="px-4 py-2.5 text-center text-foreground text-xs">{row.values[idx]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CollapsibleSpec>
        </div>
      </section>

      {/* Price List */}
      <GBPriceList onRequestQuote={(product) => setQuoteOpen(true)} />

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-display font-bold mb-3">
            พร้อมเริ่มต้น<span className="text-gradient">แล้วหรือยัง?</span>
          </h2>
          <p className="text-muted-foreground mb-8">ปรึกษาผู้เชี่ยวชาญของเราเพื่อหาโซลูชันที่เหมาะสมกับธุรกิจของคุณ</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setQuoteOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
            >
              <FileText size={18} /> ขอใบเสนอราคา
            </button>
            <button
              onClick={() => setShowLineQR(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[hsl(142,70%,45%)] text-white font-bold text-lg hover:opacity-90 transition-opacity"
            >
              LINE @entgroup
            </button>
            <a
              href="/datasheets/0597a3_7775cf506c644020a3239be2ef131caa.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-secondary/50 transition-colors"
            >
              <ExternalLink size={18} /> ดาวน์โหลดภาพรวมผลิตภัณฑ์
            </a>
          </div>
        </div>
      </section>

      <FooterCompact />
      <LineQRDialog open={showLineQR} onClose={() => setShowLineQR(false)} />
    </div>
  );
};

export default GBSeries;

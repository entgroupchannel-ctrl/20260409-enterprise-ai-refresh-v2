/* Phase 1 — Premium Lucide icons */
import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Shield, Wind, Monitor, Cpu, Zap, Factory,
  Phone, MessageCircle, ChevronLeft, ChevronRight, Settings, Wifi, Flame, Fan, Snowflake, DollarSign, FileText, Star, Package, Search as SearchIcon, ClipboardList, CheckCircle,
  HardDrive, MemoryStick, Layers, RectangleHorizontal, Square
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo-entgroup.avif";
import FooterCompact from "@/components/FooterCompact";
import { LineQRDialog } from "@/components/LineQRDialog";
import gty121Front from "@/assets/gty121-front.jpg";
import gty121Rear from "@/assets/gty121-rear.png";
import gty156Side from "@/assets/gty156-side.jpg";
import gty156Front from "@/assets/gty156-front.png";
import gty156Rear from "@/assets/gty156-rear.png";
import panelpcWideLineup from "@/assets/panelpc-wide-lineup.png";
import panelpcSquareLineup from "@/assets/panelpc-square-lineup.png";
import industryFactory from "@/assets/industry-factory.jpg";
import industryHospital from "@/assets/industry-hospital.jpg";
import industryKiosk from "@/assets/industry-kiosk.jpg";
import industryWarehouse from "@/assets/industry-warehouse.jpg";
import industryBuilding from "@/assets/industry-building.jpg";
import industryFood from "@/assets/industry-food.jpg";
import gtgSeries from "@/assets/gtg-series.png";

/* ─── Data ─── */

const features = [
  { icon: Shield, title: "IP65 กันน้ำกันฝุ่น", desc: "ตัวเครื่องอะลูมิเนียมอัลลอย มาตรฐาน IP65 ทนทานต่อฝุ่น ความชื้น แรงสั่นสะเทือน" },
  { icon: Wind, title: "Fanless / Fan Design", desc: "รุ่น GTY ระบายความร้อนแบบ Fanless ไม่มีเสียง รุ่น GTG มีพัดลมช่วยระบาย" },
  { icon: Monitor, title: "หน้าจอสัมผัส 10 จุด", desc: "Capacitive Touchscreen ความสว่าง 300 cd/m² ความละเอียด 1920×1080" },
  { icon: Cpu, title: "CPU Intel® หลายรุ่น", desc: "Celeron J1900, J6412 ไปจนถึง Core i3/i5/i7 Gen 6–10 รองรับ RAM สูงสุด 64GB" },
  { icon: Zap, title: "พอร์ตเชื่อมต่อครบ", desc: "USB3.0, USB2.0, RS232, GbE LAN, HDMI, VGA, Audio, WiFi/BT" },
  { icon: Factory, title: "ใช้งานได้หลากหลาย", desc: "MES, ERP, PLM, ESOP, HMI, SCADA — เหมาะสำหรับ Smart Factory" },
];

const stats = [
  { value: "13", label: "รุ่น", sub: "ขนาดหน้าจอ" },
  { value: "11", label: "แบบ", sub: "ตัวเลือก CPU" },
  { value: "IP65", label: "", sub: "กันน้ำกันฝุ่น" },
  { value: "24/7", label: "", sub: "ทำงานต่อเนื่อง" },
  { value: "1", label: "ปี", sub: "รับประกัน" },
];

// All prices from XLSX: [4GB+64/128SSD, 8GB+128SSD, 8GB+256SSD]
// For Core i series the columns are [4GB+128SSD, 8GB+128SSD, 8GB+256SSD]
const priceData: Record<string, Record<string, [number, number, number]>> = {
  j1900: {
    GTY101T: [24900, 28900, 31900], GTY104T: [24900, 28900, 31900],
    GTY121T: [26900, 31900, 34900], GTY133T: [0, 0, 0],
    GTY150T: [25900, 29900, 32900], GTY156T: [25900, 29900, 32900],
    GTY170T: [25900, 29900, 32900], GTY185T: [26900, 31900, 34900],
    GTY190T: [26900, 31900, 34900], GTY215T: [26900, 31900, 34900],
    GTG238T: [28900, 32900, 35900], GTG270T: [33900, 37900, 40900],
    GTG320T: [35900, 39900, 42900],
  },
  j6412: {
    GTY101T: [34900, 39900, 42900], GTY104T: [35900, 40900, 43900],
    GTY121T: [34900, 39900, 42900], GTY133T: [0, 0, 0],
    GTY150T: [35900, 40900, 43900], GTY156T: [35900, 40900, 43900],
    GTY170T: [36900, 40900, 43900], GTY185T: [36900, 41900, 44900],
    GTY190T: [35900, 40900, 43900], GTY215T: [36900, 41900, 44900],
    GTG238T: [37900, 42900, 45900], GTG270T: [45900, 49900, 52900],
    GTG320T: [45900, 50900, 53900],
  },
  "i3-6100u": {
    GTY101T: [28900, 30900, 33900], GTY104T: [28900, 31900, 34900],
    GTY121T: [27900, 30900, 33900], GTY133T: [0, 0, 0],
    GTY150T: [28900, 31900, 34900], GTY156T: [28900, 31900, 34900],
    GTY170T: [29900, 31900, 35900], GTY185T: [29900, 32900, 35900],
    GTY190T: [28900, 30900, 33900], GTY215T: [30900, 32900, 35900],
    GTG238T: [30900, 32900, 36900], GTG270T: [37900, 40900, 43900],
    GTG320T: [39900, 41900, 44900],
  },
  "i5-6300u": {
    GTY101T: [30900, 32900, 35900], GTY104T: [30900, 33900, 36900],
    GTY121T: [30900, 32900, 35900], GTY133T: [0, 0, 0],
    GTY150T: [30900, 33900, 36900], GTY156T: [30900, 33900, 36900],
    GTY170T: [31900, 33900, 37900], GTY185T: [31900, 34900, 37900],
    GTY190T: [30900, 32900, 35900], GTY215T: [31900, 34900, 37900],
    GTG238T: [32900, 34900, 37900], GTG270T: [39900, 42900, 45900],
    GTG320T: [41900, 43900, 47900],
  },
  "i7-6500u": {
    GTY101T: [33900, 36900, 39900], GTY104T: [34900, 37900, 40900],
    GTY121T: [33900, 36900, 39900], GTY133T: [0, 0, 0],
    GTY150T: [35900, 37900, 40900], GTY156T: [35900, 37900, 40900],
    GTY170T: [35900, 37900, 40900], GTY185T: [35900, 37900, 40900],
    GTY190T: [34900, 36900, 39900], GTY215T: [36900, 38900, 41900],
    GTG238T: [36900, 38900, 41900], GTG270T: [44900, 46900, 49900],
    GTG320T: [45900, 48900, 51900],
  },
  "i3-8145u": {
    GTY101T: [33900, 38900, 41900], GTY104T: [33900, 38900, 41900],
    GTY121T: [32900, 37900, 40900], GTY133T: [0, 0, 0],
    GTY150T: [33900, 38900, 41900], GTY156T: [33900, 38900, 41900],
    GTY170T: [34900, 39900, 42900], GTY185T: [34900, 39900, 42900],
    GTY190T: [33900, 38900, 41900], GTY215T: [34900, 39900, 42900],
    GTG238T: [35900, 39900, 42900], GTG270T: [43900, 47900, 51900],
    GTG320T: [44900, 49900, 52900],
  },
  "i5-8350u": {
    GTY101T: [38900, 43900, 46900], GTY104T: [39900, 44900, 47900],
    GTY121T: [38900, 43900, 46900], GTY133T: [0, 0, 0],
    GTY150T: [39900, 44900, 47900], GTY156T: [39900, 44900, 47900],
    GTY170T: [39900, 44900, 47900], GTY185T: [40900, 45900, 48900],
    GTY190T: [38900, 43900, 46900], GTY215T: [40900, 45900, 48900],
    GTG238T: [40900, 45900, 48900], GTG270T: [48900, 53900, 56900],
    GTG320T: [49900, 54900, 57900],
  },
  "i7-8650u": {
    GTY101T: [41900, 46900, 49900], GTY104T: [41900, 46900, 49900],
    GTY121T: [41900, 46900, 49900], GTY133T: [0, 0, 0],
    GTY150T: [41900, 46900, 49900], GTY156T: [41900, 46900, 49900],
    GTY170T: [42900, 47900, 50900], GTY185T: [43900, 48900, 51900],
    GTY190T: [41900, 46900, 49900], GTY215T: [43900, 48900, 51900],
    GTG238T: [43900, 48900, 51900], GTG270T: [51900, 56900, 59900],
    GTG320T: [52900, 57900, 60900],
  },
  "i3-10110u": {
    GTY101T: [38900, 43900, 46900], GTY104T: [39900, 44900, 47900],
    GTY121T: [38900, 43900, 46900], GTY133T: [0, 0, 0],
    GTY150T: [39900, 44900, 47900], GTY156T: [39900, 44900, 47900],
    GTY170T: [39900, 44900, 47900], GTY185T: [40900, 45900, 48900],
    GTY190T: [41900, 46900, 49900], GTY215T: [40900, 45900, 48900],
    GTG238T: [40900, 45900, 48900], GTG270T: [48900, 53900, 56900],
    GTG320T: [49900, 54900, 57900],
  },
  "i5-10310u": {
    GTY101T: [44900, 49900, 52900], GTY104T: [44900, 49900, 52900],
    GTY121T: [43900, 48900, 51900], GTY133T: [0, 0, 0],
    GTY150T: [44900, 49900, 52900], GTY156T: [44900, 49900, 52900],
    GTY170T: [45900, 50900, 53900], GTY185T: [45900, 50900, 53900],
    GTY190T: [44900, 49900, 52900], GTY215T: [45900, 50900, 53900],
    GTG238T: [46900, 51900, 54900], GTG270T: [53900, 58900, 61900],
    GTG320T: [55900, 60900, 63900],
  },
  "i7-1065g7": {
    GTY101T: [44900, 49900, 52900], GTY104T: [44900, 49900, 52900],
    GTY121T: [43900, 48900, 51900], GTY133T: [0, 0, 0],
    GTY150T: [44900, 49900, 52900], GTY156T: [44900, 49900, 52900],
    GTY170T: [45900, 50900, 53900], GTY185T: [45900, 50900, 53900],
    GTY190T: [44900, 49900, 52900], GTY215T: [45900, 50900, 53900],
    GTG238T: [46900, 51900, 54900], GTG270T: [53900, 58900, 61900],
    GTG320T: [55900, 60900, 63900],
  },
};

type PanelModel = {
  id: string; name: string; screen: string; resolution: string;
  cooling: "FANLESS" | "FAN"; series: "GTY" | "GTG";
  highlight?: string; popular?: boolean;
};

const panelModels: PanelModel[] = [
  { id: "GTY101T", name: "GTY101T", screen: '10.1"', resolution: "FHD 1920×1080", cooling: "FANLESS", series: "GTY", highlight: "ขนาดกะทัดรัด พกพาได้" },
  { id: "GTY104T", name: "GTY104T", screen: '10.4"', resolution: "XGA 1024×768", cooling: "FANLESS", series: "GTY", highlight: "จอสี่เหลี่ยม สำหรับงาน HMI" },
  { id: "GTY121T", name: "GTY121T", screen: '12.1"', resolution: "XGA 1024×768", cooling: "FANLESS", series: "GTY", highlight: "ขนาดมาตรฐาน ใช้งานง่าย" },
  { id: "GTY133T", name: "GTY133T", screen: '13.3"', resolution: "FHD 1920×1080", cooling: "FANLESS", series: "GTY", highlight: "Full HD จอกว้าง บางเบา" },
  { id: "GTY150T", name: "GTY150T", screen: '15"', resolution: "XGA 1024×768", cooling: "FANLESS", series: "GTY", highlight: "ยอดนิยม สำหรับงานโรงงาน" },
  { id: "GTY156T", name: "GTY156T", screen: '15.6"', resolution: "FHD 1920×1080", cooling: "FANLESS", series: "GTY", highlight: "Full HD ราคาคุ้มค่าที่สุด", popular: true },
  { id: "GTY170T", name: "GTY170T", screen: '17"', resolution: "SXGA 1280×1024", cooling: "FANLESS", series: "GTY", highlight: "จอใหญ่ สัดส่วน 5:4 มองชัด" },
  { id: "GTY185T", name: "GTY185T", screen: '18.5"', resolution: "FHD 1920×1080", cooling: "FANLESS", series: "GTY", highlight: "Wide Screen จอกว้าง" },
  { id: "GTY190T", name: "GTY190T", screen: '19"', resolution: "SXGA 1280×1024", cooling: "FANLESS", series: "GTY", highlight: "สัดส่วน 5:4 สำหรับงาน SCADA" },
  { id: "GTY215T", name: "GTY215T", screen: '21.5"', resolution: "FHD 1920×1080", cooling: "FANLESS", series: "GTY", highlight: "จอใหญ่ Full HD สำหรับ KIOSK" },
  { id: "GTG238T", name: "GTG238T", screen: '23.8"', resolution: "FHD 1920×1080", cooling: "FAN", series: "GTG", highlight: "จอใหญ่ Built-in FAN" },
  { id: "GTG270T", name: "GTG270T", screen: '27"', resolution: "FHD 1920×1080", cooling: "FAN", series: "GTG", highlight: "จอยักษ์ 27 นิ้ว Built-in FAN" },
  { id: "GTG320T", name: "GTG320T", screen: '32"', resolution: "FHD 1920×1080", cooling: "FAN", series: "GTG", highlight: "จอใหญ่สุด 32 นิ้ว Built-in FAN" },
];

const cpuTabs = [
  { id: "j1900", label: "Celeron J1900", group: "Celeron", cols: ["4GB+64SSD", "8GB+128GB", "8GB+256GB ★"] },
  { id: "j6412", label: "Celeron J6412", group: "Celeron", cols: ["4GB+128SSD", "8GB+128GB", "8GB+256GB ★"] },
  { id: "i3-6100u", label: "i3-6100U", group: "Gen 6", cols: ["4GB+128SSD", "8GB+128GB", "8GB+256GB ★"] },
  { id: "i5-6300u", label: "i5-6300U", group: "Gen 6", cols: ["4GB+128SSD", "8GB+128GB", "8GB+256GB ★"] },
  { id: "i7-6500u", label: "i7-6500U", group: "Gen 6", cols: ["4GB+128SSD", "8GB+128GB", "8GB+256GB ★"] },
  { id: "i3-8145u", label: "i3-8145U", group: "Gen 8", cols: ["4GB+128SSD", "8GB+128GB", "8GB+256GB ★"] },
  { id: "i5-8350u", label: "i5-8350U", group: "Gen 8", cols: ["4GB+128SSD", "8GB+128GB", "8GB+256GB ★"] },
  { id: "i7-8650u", label: "i7-8650U", group: "Gen 8", cols: ["4GB+128SSD", "8GB+128GB", "8GB+256GB ★"] },
  { id: "i3-10110u", label: "i3-10110U", group: "Gen 10", cols: ["4GB+128SSD", "8GB+128GB", "8GB+256GB ★"] },
  { id: "i5-10310u", label: "i5-10310U", group: "Gen 10", cols: ["4GB+128SSD", "8GB+128GB", "8GB+256GB ★"] },
  { id: "i7-1065g7", label: "i7-1065G7", group: "Gen 10", cols: ["4GB+128SSD", "8GB+128GB", "8GB+256GB ★"] },
];

const cpuGroups = ["Celeron", "Gen 6", "Gen 8", "Gen 10"];

const specs = [
  { label: "CPU", value: "Intel Celeron J1900 / J6412 / Core i3/i5/i7 Gen 6–10" },
  { label: "RAM", value: "DDR3L / DDR4 SODIMM สูงสุด 64GB" },
  { label: "Storage", value: "M.2 SSD / mSATA / 2.5\" SATA3" },
  { label: "Display", value: "10.1\"–32\" Capacitive Touch 10 จุด" },
  { label: "Resolution", value: "XGA / SXGA / Full HD 1920×1080" },
  { label: "Brightness", value: "300 cd/m²" },
  { label: "I/O Ports", value: "USB3.0 ×2, USB2.0 ×4, RS232 ×2–4, GbE LAN ×2" },
  { label: "Display Out", value: "HDMI + VGA" },
  { label: "Audio", value: "Line-out, Mic-in, Speaker 2W ×2" },
  { label: "WiFi/BT", value: "802.11ac + Bluetooth 4.2 (Optional)" },
  { label: "Power", value: "DC 12V–24V (Wide Voltage)" },
  { label: "OS", value: "Windows 10 / 11 Pro (OEM แถมฟรี)" },
  { label: "Temp", value: "0°C ~ 60°C (Operating)" },
  { label: "Protection", value: "IP65 Front Panel" },
  { label: "Mount", value: "VESA 75/100, Panel Mount, Desktop Stand" },
];

const addons = [
  { icon: Wifi, name: "4G/LTE Module", desc: "เพิ่มซิมการ์ด เชื่อมต่ออินเตอร์เน็ตได้ทุกที่", price: "Call" },
  { icon: HardDrive, name: "SSD/HDD เพิ่มเติม", desc: "อัปเกรด Storage ตามต้องการ", price: "สอบถาม" },
  { icon: MemoryStick, name: "RAM เพิ่มเติม", desc: "อัปเกรด RAM สูงสุด 64GB", price: "สอบถาม" },
  { icon: Layers, name: "COM RS422/RS485", desc: "เพิ่มพอร์ต Serial สำหรับอุปกรณ์อุตสาหกรรม", price: "900" },
  { icon: Settings, name: "Wide Voltage 9-36V", desc: "รองรับแรงดันไฟฟ้ากว้าง สำหรับงานยานยนต์", price: "1,900" },
  { icon: Monitor, name: "Upgrade WiFi 6", desc: "อัปเกรดเป็น WiFi 6 ความเร็วสูง", price: "900" },
];

const whyUs = [
  { title: "รับประกันที่แตกต่าง", desc: "ซื้อประกันเพิ่มได้สูงสุด 3 ปี เสียในช่วงแรกเปลี่ยนตัวใหม่ทันที" },
  { title: "เรามีช่าง ซ่อมได้", desc: "ทีมช่างผู้เชี่ยวชาญพร้อมซ่อมบำรุง ไม่ต้องส่งกลับโรงงาน" },
  { title: "แอดมินคอยปรึกษา", desc: "ช่วยเลือกสินค้าที่เหมาะกับการใช้งาน ภายใต้งบประมาณของคุณ" },
  { title: "เครดิตเทอมสำหรับองค์กร", desc: "รองรับเงื่อนไขการชำระเงินขององค์กร ทั้งภาครัฐและเอกชน" },
  { title: "ช่องทางติดต่อหลากหลาย", desc: "โทร, LINE, อีเมล — เราไม่ทิ้งคุณ พร้อมตอบทุกคำถาม" },
  { title: "ทดสอบก่อนส่งมอบ", desc: "สินค้าผ่านการทดสอบทั้งจากโรงงานและที่ออฟฟิศก่อนนำส่งถึงมือคุณ" },
];

const ITEMS_PER_PAGE = 7;

const fmt = (n: number) => n.toLocaleString();

/* ─── Component ─── */

const PanelPC = () => {
  const [showLineQR, setShowLineQR] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [activeCpu, setActiveCpu] = useState("j1900");
  const [coolingFilter, setCoolingFilter] = useState<"all" | "FANLESS" | "FAN">("all");
  const [sizeFilter, setSizeFilter] = useState<"all" | "small" | "medium" | "large">("all");
  const [page, setPage] = useState(1);
  const [displayType, setDisplayType] = useState<"wide" | "square">("wide");

  const filtered = panelModels.filter((m) => {
    if (coolingFilter !== "all" && m.cooling !== coolingFilter) return false;
    const size = parseFloat(m.screen);
    if (sizeFilter === "small" && size > 12.1) return false;
    if (sizeFilter === "medium" && (size < 13 || size > 19)) return false;
    if (sizeFilter === "large" && size < 21) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const currentTab = cpuTabs.find((t) => t.id === activeCpu)!;
  const cpuPrices = priceData[activeCpu] || {};

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="GTY/GTG Panel PC — จอสัมผัสอุตสาหกรรม" description="GTY/GTG Panel PC จอสัมผัสอุตสาหกรรม 8-21 นิ้ว เลือก CPU ได้ Fanless IP65 สำหรับโรงงาน POS SCADA HMI" path="/panel-pc-gtg" />
      <ProductJsonLd
        collectionName="GTY/GTG Panel PC จอสัมผัสอุตสาหกรรม"

        collectionDescription="Panel PC จอสัมผัสอุตสาหกรรม 8-21 นิ้ว Fanless IP65 สำหรับโรงงาน POS SCADA HMI"

        collectionUrl="/panel-pc-gtg"

        products={panelModels.map(m => ({ name: m.name, description: `${m.screen} ${m.resolution}`, category: "Industrial Panel PC" }))}      />

      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "Panel PC GTG", path: "/panel-pc-gtg" }]} />
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="ENT GROUP" className="h-8 w-auto" />
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-semibold text-foreground">GTY/GTG Panel PC</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/" className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} /> กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
                Industrial Grade • IP65 • 24/7
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-black mb-6 tracking-tight leading-tight">
                Industrial <span className="text-gradient">Panel PC</span>
                <br />
                <span className="text-2xl md:text-3xl font-bold text-muted-foreground">สำหรับโรงงาน อุตสาหกรรม</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
                คอมพิวเตอร์แบบ Panel PC ระดับอุตสาหกรรม รองรับ CPU Intel® ตั้งแต่ Celeron จนถึง Core i7
                หน้าจอสัมผัส 10.1"–32" พร้อมตัวเครื่องอะลูมิเนียม IP65
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <a href="#pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                  <ClipboardList size={16} className="inline mr-1" />ดูราคาสินค้า →
                </a>
                <a href="#specs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-colors">
                  <SearchIcon size={16} className="inline mr-1" />ดูสเปค
                </a>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span>✓ รับประกัน 1 ปี (ซื้อเพิ่มได้สูงสุด 3 ปี)</span>
                <span>✓ OEM/ODM</span>
                <span>✓ ส่งทั่วไทย</span>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={gty156Side}
                alt="GTY156T Industrial Panel PC"
                className="max-h-[420px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.sub}>

                <div className="text-3xl md:text-4xl font-display font-black text-primary">
                  {s.value}<span className="text-lg font-semibold text-foreground ml-1">{s.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase with real images */}
      <section className="section-padding">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Design</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              ออกแบบมาเพื่อ<span className="text-gradient">โรงงานอุตสาหกรรม</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              ตัวเครื่องอะลูมิเนียมอัลลอยทั้งตัว ครีบระบายความร้อนแบบ Fanless ทนทาน สวยงาม ใช้งานได้ 24/7
            </p>
          </div>

          {/* Product Image Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card-surface p-4 flex flex-col items-center gap-3 relative">
              <img src={gty121Front} alt="GTY121T ด้านหน้า — จอสัมผัส Windows 11" className="w-full max-h-[280px] object-contain rounded-lg" loading="lazy" />
              <div className="text-center">
                <p className="font-bold text-foreground text-sm">GTY121T — ด้านหน้า</p>
                <p className="text-xs text-muted-foreground">จอสัมผัส 12.1" XGA พร้อม Windows 11</p>
              </div>
            </div>
            <div className="card-surface p-4 flex flex-col items-center gap-3 justify-end relative">
              <div className="flex-1 flex items-end">
                <img src={gty156Front} alt="GTY156T — มุมเอียง แสดงครีบระบายความร้อน Fanless" className="w-full max-h-[280px] object-contain rounded-lg" loading="lazy" />
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground text-sm">GTY156T — มุมเอียง</p>
                <p className="text-xs text-muted-foreground">15.6" FHD พร้อมครีบระบายความร้อน Fanless</p>
              </div>
            </div>
            <div className="card-surface p-4 flex flex-col items-center gap-3">
              <img src={gty156Side} alt="GTY156T — ด้านข้าง แสดงความบาง" className="w-full max-h-[280px] object-contain rounded-lg" loading="lazy" />
              <div className="text-center">
                <p className="font-bold text-foreground text-sm">GTY156T — ด้านข้าง</p>
                <p className="text-xs text-muted-foreground">ดีไซน์บาง สวยงาม พร้อมติดตั้ง Panel Mount</p>
              </div>
            </div>
          </div>

          {/* I/O Port images */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-surface p-4 flex flex-col items-center gap-3">
              <img src={gty121Rear} alt="GTY121T ด้านหลัง — พอร์ต I/O" className="w-full object-contain rounded-lg" loading="lazy" />
              <div className="text-center">
                <p className="font-bold text-foreground text-sm">GTY121T — พอร์ต I/O ด้านหลัง</p>
                <p className="text-xs text-muted-foreground">HDMI, VGA, USB3.0, LAN ×2, RS232 ×2, Audio</p>
              </div>
            </div>
            <div className="card-surface p-4 flex flex-col items-center gap-3">
              <img src={gty156Rear} alt="GTY156T ด้านหลัง — พอร์ต I/O" className="w-full object-contain rounded-lg" loading="lazy" />
              <div className="text-center">
                <p className="font-bold text-foreground text-sm">GTY156T — พอร์ต I/O ด้านหลัง</p>
                <p className="text-xs text-muted-foreground">HDMI, VGA, USB3.0 ×2, USB2.0 ×2, LAN ×2, RS232, Audio</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wide vs Square Display Selection */}
      <section className="section-padding bg-secondary/20">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Display Options</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              เลือกสัดส่วนหน้าจอ<span className="text-gradient">ที่เหมาะกับงาน</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              มีทั้งจอ Widescreen (16:9) สำหรับแสดงข้อมูลกว้าง และจอ Square (4:3 / 5:4) สำหรับงาน HMI, SCADA แบบดั้งเดิม
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setDisplayType("wide")}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all ${
                displayType === "wide"
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                  : "border-border bg-background hover:border-primary/30"
              }`}>
              <RectangleHorizontal size={28} className={displayType === "wide" ? "text-primary" : "text-muted-foreground"} />
              <div className="text-left">
                <p className={`font-bold ${displayType === "wide" ? "text-primary" : "text-foreground"}`}>Widescreen (16:9)</p>
                <p className="text-xs text-muted-foreground">13.3" / 15.6" / 18.5" / 21.5" / 23.8" / 27" / 32"</p>
              </div>
            </button>
            <button
              onClick={() => setDisplayType("square")}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all ${
                displayType === "square"
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                  : "border-border bg-background hover:border-primary/30"
              }`}>
              <Square size={28} className={displayType === "square" ? "text-primary" : "text-muted-foreground"} />
              <div className="text-left">
                <p className={`font-bold ${displayType === "square" ? "text-primary" : "text-foreground"}`}>Square (4:3 / 5:4)</p>
                <p className="text-xs text-muted-foreground">10.1" / 10.4" / 12.1" / 15" / 17" / 19"</p>
              </div>
            </button>
          </div>

          {/* Lineup Image */}
          <div className="card-surface p-6 md:p-10 text-center">
            <img
              src={displayType === "wide" ? panelpcWideLineup : panelpcSquareLineup}
              alt={`Panel PC ${displayType === "wide" ? "Widescreen" : "Square"} Lineup`}
              className="max-h-[350px] mx-auto object-contain mb-6"

              loading="lazy"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {displayType === "wide" ? (
                <>
                  {[
                    { size: '13.3"', res: "FHD 1920×1080", use: "บางเบา สำหรับ Embedded" },
                    { size: '15.6"', res: "FHD 1920×1080", use: "ยอดนิยม ราคาคุ้มที่สุด" },
                    { size: '18.5"', res: "FHD 1920×1080", use: "จอกว้าง แสดงข้อมูลเยอะ" },
                    { size: '21.5"–32"', res: "FHD 1920×1080", use: "KIOSK / Digital Signage" },
                  ].map((d) => (
                    <div key={d.size} className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-lg font-bold text-primary">{d.size}</p>
                      <p className="text-[11px] text-muted-foreground">{d.res}</p>
                      <p className="text-xs font-medium text-foreground mt-1">{d.use}</p>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { size: '10.1"', res: "FHD 1920×1080", use: "กะทัดรัด พกพาได้" },
                    { size: '10.4" / 12.1"', res: "XGA 1024×768", use: "มาตรฐาน HMI งานโรงงาน" },
                    { size: '15"', res: "XGA 1024×768", use: "ขนาดยอดนิยม สำหรับโรงงาน" },
                    { size: '17" / 19"', res: "SXGA 1280×1024", use: "จอใหญ่ สำหรับ SCADA" },
                  ].map((d) => (
                    <div key={d.size} className="p-3 rounded-xl bg-secondary/50">
                      <p className="text-lg font-bold text-primary">{d.size}</p>
                      <p className="text-[11px] text-muted-foreground">{d.res}</p>
                      <p className="text-xs font-medium text-foreground mt-1">{d.use}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Application Banners */}
      <section className="section-padding">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Applications</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              นำไปใช้งาน<span className="text-gradient">ได้หลากหลายอุตสาหกรรม</span>
            </h2>
            <p className="text-muted-foreground mt-4">Panel PC สำหรับทุกประเภทธุรกิจและอุตสาหกรรม</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: industryFactory, title: "Smart Factory", desc: "MES, ERP, PLM, ESOP — ควบคุมไลน์ผลิตแบบเรียลไทม์", tags: ["MES", "ERP", "HMI"], rec: "แนะนำ: 15\"–21.5\"" },
              { img: industryHospital, title: "โรงพยาบาล / การแพทย์", desc: "ระบบ HIS, จุดลงทะเบียนผู้ป่วย, ห้องปฏิบัติการ", tags: ["HIS", "EMR", "Lab"], rec: "แนะนำ: 15.6\"–23.8\"" },
              { img: industryKiosk, title: "Kiosk / Self-Service", desc: "ตู้สั่งอาหาร ตู้จำหน่ายตั๋ว ตู้ลงทะเบียน", tags: ["POS", "Kiosk", "Signage"], rec: "แนะนำ: 21.5\"–32\"" },
              { img: industryWarehouse, title: "คลังสินค้า / โลจิสติกส์", desc: "WMS, ระบบจัดการสต๊อก, Barcode Scanner", tags: ["WMS", "Barcode", "Logistics"], rec: "แนะนำ: 10.1\"–15.6\"" },
              { img: industryBuilding, title: "Building Automation", desc: "HVAC, ระบบพลังงาน, Access Control, BMS", tags: ["BMS", "HVAC", "IoT"], rec: "แนะนำ: 15\"–21.5\"" },
              { img: industryFood, title: "อุตสาหกรรมอาหาร", desc: "QC ไลน์ผลิต, ชั่งน้ำหนัก, ควบคุมอุณหภูมิ", tags: ["QC", "HACCP", "SCADA"], rec: "แนะนำ: 12.1\"–17\"" },
            ].map((item) => (
              <div key={item.title} className="card-surface overflow-hidden group hover:border-primary/30 transition-all hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={800} height={512} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{tag}</span>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-primary">{item.rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
import gtgSeries from "@/assets/gtg-series.png";
import FooterCompact from "@/components/FooterCompact";

      <section className="section-padding bg-surface/50">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Features</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              ทำไมต้องเลือก <span className="text-gradient">Industrial Panel PC</span> by ENTGROUP?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((f) => (
              <div key={f.title} className="card-surface p-6 hover:border-primary/30 transition-all hover:-translate-y-1">
                <f.icon className="text-primary mb-4" size={32} />
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
          {/* Windows 11 Free */}
          <div className="card-surface p-6 flex flex-col md:flex-row items-center gap-6 border-primary/20">
            <img src="https://gty-gtg-panelpc.lovable.app/assets/windows11-free-DTTOmS84.png" alt="Windows 11 OEM ฟรี" className="h-20 object-contain" />
            <div>
              <h3 className="text-lg font-bold text-foreground">แถมฟรี! Windows 10/11 OEM License</h3>
              <p className="text-sm text-muted-foreground">มาพร้อมทุกเครื่อง ไม่ต้องซื้อ License เพิ่ม</p>
            </div>
          </div>
        </div>
      </section>

      {/* GTG Series Banner */}
      <section className="section-padding">
        <div className="container max-w-7xl mx-auto">
          <div className="card-surface overflow-hidden p-6 md:p-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold mb-4">
                  <Flame size={14} className="inline mr-1" />GTG Series — Built-in FAN
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  GTG 23.8" / 27" / 32"
                </h3>
                <p className="text-muted-foreground mb-4">
                  หน้าจอใหญ่ ผลิตจากโลหะ Metal Sheet พร้อมพัดลมระบายความร้อนในตัว รองรับ CPU ประสิทธิภาพสูง
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• The rear cover is made of <strong className="text-foreground">sheet metal</strong></li>
                  <li>• Built-in <strong className="text-foreground">cooling FAN</strong> for high performance CPU</li>
                  <li>• Full HD 1920×1080 ทุกขนาด</li>
                  <li>• เริ่มต้น <strong className="text-primary text-lg">฿28,900</strong></li>
                </ul>
              </div>
              <div className="flex justify-center">
                <img src={gtgSeries} alt="GTG Panel PC" className="max-h-[300px] object-contain" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Table */}
      <section className="section-padding bg-surface/50" id="pricing">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Products & Pricing</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              รุ่นสินค้า & <span className="text-gradient">ตารางราคา</span>
            </h2>
            <p className="text-muted-foreground mt-4">13 รุ่น × 11 CPU — เลือกหน้าจอ เลือก CPU ดูราคาได้เลย</p>
          </div>

          {/* CPU Group Tabs */}
          <div className="space-y-3 mb-6">
            {cpuGroups.map((group) => (
              <div key={group} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground min-w-[60px]">{group}</span>
                {cpuTabs.filter((t) => t.group === group).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveCpu(tab.id); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeCpu === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {([["all", "ทั้งหมด"], ["FANLESS", "FANLESS"], ["FAN", "FAN (GTG)"]] as const).map(([val, label]) => (
              <button key={val} onClick={() => { setCoolingFilter(val); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${coolingFilter === val ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>

                {label}
              </button>
            ))}
            <span className="text-muted-foreground mx-1">|</span>
            {([["all", "ทุกขนาด"], ["small", "เล็ก (10–12\")"], ["medium", "กลาง (13–19\")"], ["large", "ใหญ่ (21–32\")"]] as const).map(([val, label]) => (
              <button key={val} onClick={() => { setSizeFilter(val); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${sizeFilter === val ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}>

                {label}
              </button>
            ))}
          </div>

          {/* Price heading */}
          <div className="text-center mb-4">
            <p className="text-sm font-semibold text-foreground"><DollarSign size={16} className="inline mr-1 text-primary" />ราคาขายปลีก (บาท) — Intel® {currentTab.label}</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-3 text-muted-foreground font-medium">รุ่น</th>
                  <th className="text-center p-3 text-muted-foreground font-medium">หน้าจอ</th>
                  <th className="text-center p-3 text-muted-foreground font-medium">ระบาย</th>
                  {currentTab.cols.map((col) => (
                    <th key={col} className="text-center p-3 text-muted-foreground font-medium whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((m) => {
                  const prices = cpuPrices[m.id] || [0, 0, 0];
                  return (
                    <tr key={m.id} className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${m.popular ? "bg-primary/5" : ""}`}>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono">{m.series}</span>
                          <div>
                            <span className="font-semibold text-foreground">{m.name}</span>
                            {m.popular && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-bold"><Star size={10} className="inline" /></span>}>

                            <p className="text-[11px] text-muted-foreground">{m.highlight}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3 font-medium text-foreground whitespace-nowrap">
                        {m.screen}<br /><span className="text-[10px] text-muted-foreground">{m.resolution}</span>
                      </td>
                      <td className="text-center p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${m.cooling === "FANLESS" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-orange-500/10 text-orange-600 dark:text-orange-400"}`}>

                          {m.cooling === "FANLESS" ? "FANLESS" : "FAN"}
                        </span>
                      </td>
                      {prices.map((p, i) => (
                        <td key={i} className="text-center p-3 font-semibold whitespace-nowrap">
                          {p === 0 ? (
                            <span className="text-muted-foreground text-xs"><Phone size={12} className="inline mr-0.5" />สอบถาม</span>
                          ) : (
                            <span className="text-primary">฿{fmt(p)}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="p-2 rounded-lg bg-secondary text-foreground disabled:opacity-30 hover:bg-secondary/80 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-muted-foreground">หน้า {page}/{totalPages} — แสดง {paged.length} จาก {filtered.length} รุ่น</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg bg-secondary text-foreground disabled:opacity-30 hover:bg-secondary/80 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Notes */}
          <div className="mt-6 text-xs text-muted-foreground space-y-1 text-center">
            <p><CheckCircle size={12} className="inline mr-1 text-emerald-500" />ราคารวม Windows 10 OEM + WiFi ยังไม่รวม VAT & ค่าขนส่ง</p>
            <p><Phone size={12} className="inline mr-0.5" />สอบถามราคาพิเศษสำหรับการสั่งซื้อจำนวนมาก</p>
            <p>* ทุกรุ่นรองรับ DDR3L / DDR4 SODIMM สูงสุด 64GB | หน้าจอสัมผัส Capacitive 10 จุด</p>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="section-padding" id="specs">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Specifications</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">สเปค<span className="text-gradient">มาตรฐานทุกรุ่น</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
            {specs.map((s) => (
              <div key={s.label} className="card-surface p-4 flex gap-3">
                <span className="text-xs font-bold text-primary whitespace-nowrap min-w-[70px]">{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons with prices */}
      <section className="section-padding bg-surface/50">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Add-ons</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">อุปกรณ์<span className="text-gradient">เสริม</span></h2>
            <p className="text-muted-foreground mt-4">เพิ่มความสามารถให้เครื่องตามความต้องการ</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((a) => (
              <div key={a.name} className="card-surface p-5 flex items-start gap-4 hover:border-primary/30 transition-all">
                <a.icon className="text-primary shrink-0 mt-0.5" size={24} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-foreground text-sm">{a.name}</h3>
                    <span className="text-xs font-semibold text-primary">฿{a.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section-padding">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Why ENT Group</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">ทำไมต้อง<span className="text-gradient">ซื้อกับเรา?</span></h2>
            <p className="text-muted-foreground mt-4">เราไม่ได้แค่ขายสินค้า แต่ดูแลคุณตั้งแต่เลือกซื้อจนหลังการขาย</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUs.map((w) => (
              <div key={w.title} className="card-surface p-5 hover:border-primary/30 transition-all">
                <h3 className="font-bold text-foreground mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="section-padding bg-surface/50">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            สนใจสินค้า? <span className="text-gradient">ติดต่อเราเลย</span>
          </h2>
          <p className="text-muted-foreground mb-2">รองรับโครงการขนาดเล็ก กลาง ใหญ่ — อยากได้ TOR แจ้งได้</p>
          <p className="text-muted-foreground mb-8">รับใบเสนอราคาพิเศษสำหรับออเดอร์จำนวนมาก พร้อม OEM/ODM</p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button onClick={() => setQuoteOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
              ขอใบเสนอราคา
            </button>
            <a href="tel:020456104" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-colors">
              <Phone size={18} /> 02-045-6104
            </a>
            <button onClick={() => setShowLineQR(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(142,70%,45%)] text-white font-bold hover:opacity-90 transition-opacity cursor-pointer">
              <MessageCircle size={18} /> Line @entgroup
            </button>
          </div>

          {/* LINE QR Dialog */}
          <LineQRDialog open={showLineQR} onClose={() => setShowLineQR(false)} />
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            {[{ label: "Sample", time: "3–5 วัน" }, { label: "50 ชิ้น", time: "10–15 วัน" }, { label: "100+", time: "15–30 วัน" }].map((lt) => (
              <div key={lt.label} className="card-surface p-4 text-center">
                <p className="text-sm font-semibold text-foreground flex items-center justify-center gap-1"><Package size={14} className="text-primary" />{lt.label}</p>
                <p className="text-xs text-muted-foreground">{lt.time}</p>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>* สินค้าส่งตรงจากโรงงาน ระยะเวลาขนส่ง 15 วันหลัง Order</p>
            <p>* มีสต๊อกบางส่วนในประเทศไทย</p>
          </div>
        </div>
      </section>

      {/* External link */}
      <section className="section-padding">
        <div className="container max-w-7xl mx-auto text-center">
          <a href="https://gty-gtg-panelpc.lovable.app" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity">
            <ExternalLink size={20} /> ดูเว็บไซต์ Panel PC เต็มรูปแบบ
          </a>
        </div>
      </section>
      <FooterCompact />
    </div>
  );
};

export default PanelPC;


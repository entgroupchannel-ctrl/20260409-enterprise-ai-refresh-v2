import SEOHead from "@/components/SEOHead";
import AddToCartButton from "@/components/AddToCartButton";
import ChatNowButton from "@/components/shop/ChatNowButton";
import CartBadge from "@/components/CartBadge";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import LineQRButton from "@/components/LineQRButton";
import B2BCTABanner from "@/components/B2BCTABanner";
import B2BWorkflowBanner from "@/components/B2BWorkflowBanner";
import B2BMarketingShowcase from "@/components/B2BMarketingShowcase";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useState, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Cpu, Thermometer, Wind, Shield, Zap, Server, Factory, Building, Home, Monitor, Download, Play, Filter, X, Search, FileText, Headphones, ChevronDown, Code, Phone, Star, Quote, Target, Palette, Plug, AlertTriangle, Ruler, DollarSign, Wrench, Package, Flame, Fan, Lightbulb, BarChart3, Battery, Bot, Radio, ThermometerSun, Laptop, CircuitBoard, LogIn, LogOut, UserRound, MessageSquare } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { LineQRDialog } from "@/components/LineQRDialog";
import ThemeToggle from "@/components/ThemeToggle";
import ShareButtons from "@/components/ShareButtons";
import logo from "@/assets/logo-entgroup.avif";
import gt4500CpuOptions from "@/assets/gt4500-cpu-options.png";
import gtSeriesHero from "@/assets/gt-series-hero-lineup.jpg";
import gtSeriesHeroBg from "@/assets/gt-series-hero-bg.jpg";
import gt1000Banner from "@/assets/gt1000-banner.jpg";
import gt2000Banner from "@/assets/gt2000-banner.jpg";
import gt3000Banner from "@/assets/gt3000-banner.jpg";
import gt4000Banner from "@/assets/gt4000-banner.jpg";
import gt5000Banner from "@/assets/gt5000-banner.jpg";
import gt6000Banner from "@/assets/gt6000-banner.jpg";
import gt7000Banner from "@/assets/gt7000-banner.jpg";
import gt8000Banner from "@/assets/gt8000-banner.jpg";
import gt9000Banner from "@/assets/gt9000-banner.jpg";
import gt4500Banner from "@/assets/gt4500-banner.jpg";
import gt1000Product from "@/assets/gt1000-product.jpg";
import gt1200Product from "@/assets/gt1200-product.jpg";
import gt1400Product from "@/assets/gt1400-product.jpg";
import gt2000Product from "@/assets/gt2000-product.jpg";
import gt3000Product from "@/assets/gt3000-product.jpg";
import gt4000Product from "@/assets/gt4000-product.jpg";
import gt4500Product from "@/assets/gt4500-product.jpg";
import gt5000Product from "@/assets/gt5000-product.jpg";
import gt6000Product from "@/assets/gt6000-product.jpg";
import gt7000Product from "@/assets/gt7000-product.jpg";
import gt8000Product from "@/assets/gt8000-product.jpg";
import gt9000Product from "@/assets/gt9000-product.jpg";
import gt3000CpuOptions from "@/assets/gt3000-cpu-options.png";
import gtColorfulProducts from "@/assets/gt-colorful-products.png";
import usecaseFactory from "@/assets/usecase-factory.jpg";
import usecaseAutomation from "@/assets/usecase-automation.jpg";
import usecaseIot from "@/assets/usecase-iot.jpg";
import usecaseKiosk from "@/assets/usecase-kiosk.jpg";
import usecaseHmi from "@/assets/usecase-hmi.jpg";
import usecaseBus from "@/assets/usecase-bus.jpg";
import usecaseTrain from "@/assets/usecase-train.jpg";
import usecaseQueue from "@/assets/usecase-queue.jpg";
import usecaseControl from "@/assets/usecase-control.jpg";
import usecaseBranding from "@/assets/usecase-branding.jpg";
import FooterCompact from "@/components/FooterCompact";
import MiniNavbar from "@/components/MiniNavbar";
import ProductFeatures from "@/components/ProductFeatures";

const features = [
  { icon: Thermometer, title: "ทนความร้อนสูง", desc: "ทำงานได้ในอุณหภูมิ 0–60°C อย่างต่อเนื่อง" },
  { icon: Wind, title: "Fanless Design", desc: "เงียบ 0 เดซิเบล ไม่มีพัดลม ไม่ดูดฝุ่น" },
  { icon: Shield, title: "ทนฝุ่น ทนสั่นสะเทือน", desc: "โครงอลูมิเนียมแข็งแรง ทนทุกสภาพแวดล้อม" },
  { icon: Zap, title: "ประหยัดพลังงาน", desc: "ใช้ไฟเพียง 15–65W ทำงาน 24/7 ต่อเนื่อง" },
];

const useCases = [
  { icon: Factory, label: "โรงงาน" },
  { icon: Building, label: "ออฟฟิศ" },
  { icon: Monitor, label: "Outdoor" },
  { icon: Home, label: "บ้าน" },
];

const gtModels = [
  {
    name: "GT1000",
    tagline: "จุดเริ่มต้นที่คุ้มค่า",
    cpu: "Intel Celeron N2920 / N3520",
    ram: "4–8 GB DDR3L",
    storage: "SSD 128–256 GB",
    ports: "USB 6, COM 2, LAN 2, VGA+HDMI",
    size: "ขนาดเล็กกระทัดรัด",
    image: gt1000Product,
    tab: "gt1000",
    highlight: "เริ่มต้น",
    price: "15,990",
  },
  {
    name: "GT1200",
    tagline: "คอมแพกต์ ดีไซน์ใหม่",
    cpu: "Intel i3-6157U / i5 / i7",
    ram: "DDR3L–DDR4 สูงสุด 64GB",
    storage: "M.2 SSD + SATA",
    ports: "USB 6, COM 2, LAN 2, HDMI",
    size: "TDP 28W Fanless",
    image: gt1200Product,
    tab: "gt1200",
    highlight: "NEW!",
    badge: true,
    price: "สอบถาม",
  },
  {
    name: "GT1300",
    tagline: "3 HDMI · 6 COM · GPIO · 2.5G",
    cpu: "i5-8400H / i7-8750H / i5-9400H / i7-9750H / i5-10200H / i7-10750H",
    ram: "DDR4 สูงสุด 64GB",
    storage: "M-SATA + M.2 NVMe + SATA",
    ports: "USB 6, COM 6, LAN 2 (2.5G), HDMI×3, GPIO",
    size: "3 HDMI + GPIO + 9–36V",
    image: "/images/gt1300/main.jpg",
    tab: "gt1300",
    highlight: "NEW!",
    badge: true,
    price: "สอบถาม",
  },
  {
    name: "GT1400",
    tagline: "2.5G LAN · 6 COM · GPIO · 5G",
    cpu: "Celeron J4125/J6412 / i5/i7 Gen 8–11",
    ram: "DDR4 สูงสุด 64GB",
    storage: "M.2 SATA + M.2 NVMe + SATA",
    ports: "USB 6, COM 6, LAN 2 (2.5G), HDMI, GPIO",
    size: "2.5G LAN + 5G + GPIO + 9–36V",
    image: "/images/gt1400/main.jpg",
    tab: "gt1400",
    highlight: "NEW!",
    badge: true,
    price: "28,990",
  },
  {
    name: "GT2000",
    tagline: "ยอดนิยม 8 USB + 4 COM",
    cpu: "Intel Celeron 1037U / Core i5-3317U",
    ram: "4 GB DDR3L",
    storage: "SSD 256 GB",
    ports: "USB 8 (4×3.0+4×2.0), COM 4, LAN 2, VGA+HDMI",
    size: "23.4×15×4.8 cm / 1.5 kg",
    image: gt2000Product,
    tab: "gt2000",
    highlight: "ยอดนิยม",
    price: "15,990",
  },
  {
    name: "GT3000",
    tagline: "6 COM หลากหลาย CPU",
    cpu: "Celeron 1007U / Core i3 / i5 / i7",
    ram: "4 GB DDR3L",
    storage: "SSD 128 GB",
    ports: "USB 6, COM 6, LAN 2, VGA+HDMI",
    size: "15×21.7×5.2 cm / 1.289 kg",
    image: gt3000Product,
    tab: "gt3000",
    highlight: "6 COM",
    price: "สอบถาม",
  },
  {
    name: "GT4000",
    tagline: "GPIO พร้อมใช้ VESA Mount",
    cpu: "Intel Core i3 / i5-4200U / i7-4500U",
    ram: "4–8 GB DDR3L",
    storage: "SSD 128–256 GB",
    ports: "USB 8, COM 6, LAN 2, VGA+HDMI, GPIO",
    size: "17.7×21.7×5.2 cm / 1.516 kg",
    image: gt4000Product,
    tab: "gt4000",
    highlight: "GPIO",
    price: "24,990",
  },
  {
    name: "GT4500",
    tagline: "DDR4 + SIM 4G/5G มาตรฐานใหม่",
    cpu: "Intel Core i3-6006U / i5-7260U / i5-8250U / i7-8550U",
    ram: "4–8 GB DDR4",
    storage: "SSD 256 GB",
    ports: "USB 8 (4×3.0+4×2.0), COM 6, LAN 2, VGA+HDMI, SIM",
    size: "21.2×15.5×4.5 cm / 2.5 kg",
    image: gt4500Product,
    tab: "gt4500",
    highlight: "DDR4 + 4G",
    price: "21,900",
  },
  {
    name: "GT5000",
    tagline: "GPIO + SIM IoT Ready",
    cpu: "Intel Core i5-4200U / i7-4500U",
    ram: "4–8 GB DDR3L",
    storage: "SSD 128 GB – 1 TB",
    ports: "USB 8, COM 6 (RS232/RS485/RS422), LAN 2, GPIO, SIM slot",
    size: "GPIO + SIM + RS485",
    image: gt5000Product,
    tab: "gt5000",
    highlight: "IoT Ready",
    price: "19,490",
  },
  {
    name: "GT6000",
    tagline: "ดีไซน์ใหม่ Intel Core i3",
    cpu: "Intel Core i3-5005U",
    ram: "4–8 GB DDR3L",
    storage: "SSD 128 GB – 1 TB",
    ports: "USB 6, COM 6, LAN 2, VGA+HDMI",
    size: "Fanless สีดำสวยงาม",
    image: gt6000Product,
    tab: "gt6000",
    highlight: "ดีไซน์ใหม่",
    price: "สอบถาม",
  },
  {
    name: "GT7000",
    tagline: "คำตอบทุกปัญหาโรงงาน",
    cpu: "Intel Core i3 / i5 / i7 (DDR4)",
    ram: "4–32 GB DDR4",
    storage: "SSD 256 GB – 1 TB",
    ports: "USB 6, COM 6 (RS232/422/485), LAN 2",
    size: "23×17.5×5 cm / 2.5 kg",
    image: gt7000Product,
    tab: "gt7000",
    highlight: "DDR4",
    price: "สอบถาม",
  },
  {
    name: "GT8000",
    tagline: "Ice Lake Gen 10 สเปคแรง",
    cpu: "Intel Core i5-1035G1 / i7-10710U",
    ram: "4–32 GB DDR4",
    storage: "SSD 128 GB – 2 TB",
    ports: "USB 8, COM 6, LAN 2, HDMI+DP",
    size: "Intel Gen 10 Ice Lake",
    image: gt8000Product,
    tab: "gt8000",
    highlight: "มีพัดลม",
    price: "สอบถาม",
  },
  {
    name: "GT9000",
    tagline: "3 HDMI 6 COM SIM 4G NVMe",
    cpu: "Intel i5-10200H / i7-10750H / i5-1235U / i7-1255U",
    ram: "DDR4/DDR5 สูงสุด 32GB",
    storage: "M-SATA + 2.5\" SATA + M.2 NVMe",
    ports: "USB 8, COM 6 (RS232/422/485), LAN 2, HDMI×3",
    size: "Triple HDMI + SIM 4G + Dual-Band WiFi",
    image: gt9000Product,
    tab: "gt9000",
    highlight: "Triple Display",
    price: "25,290",
  },
];

const galleryImages = [
  "/images/wix/005637_a5ffaad568e84e3daa9498a03f79410a_b932b160.jpg",
  "/images/wix/005637_138dfbf84a364703b08266d6f7726ee3_49a10f60.jpg",
  "/images/wix/005637_3873554c607047d7baa9d4ab166ebf16_02ba9a48.jpg",
  "/images/wix/005637_3ecd1c202310457a9ae75096734cec22_3c989195.jpg",
  "/images/wix/005637_46e268297fcb4d51bf53ff1995af7bda_6a011393.jpg",
];

const modelTabs = [
  { id: "overview", label: "รุ่นทั้งหมด" },
  { id: "gt1000", label: "GT1000" },
  { id: "gt2000", label: "GT2000" },
  { id: "gt3000", label: "GT3000" },
  { id: "gt4000", label: "GT4000" },
  { id: "gt5000", label: "GT5000" },
  { id: "gt6000", label: "GT6000" },
  { id: "gt7000", label: "GT7000" },
  { id: "gt8000", label: "GT8000" },
  { id: "gt9000", label: "GT9000" },
  { id: "gt4500", label: "GT4500" },
  { id: "gt1400", label: "GT1400" },
  { id: "gt1300", label: "GT1300" },
  { id: "gt1200", label: "GT1200" },
];

const comparisonRows = [
  { name: "GT1000", tagline: "เริ่มต้นคุ้มค่า", cpu: "Celeron N2920/N3520", ram: "DDR3L 4–8GB", com: 2, usb: 6, lan: 2, gpio: false, sim: true, display: "VGA+HDMI", price: "15,990", cat: "entry", gen: "Gen 4", fanless: true },
  { name: "GT1200", tagline: "คอมแพกต์ ดีไซน์ใหม่", cpu: "i3-6157U / i5 / i7", ram: "DDR3L–DDR4 64GB", com: 2, usb: 6, lan: 2, gpio: false, sim: true, display: "VGA+HDMI", price: "สอบถาม", cat: "premium", gen: "Gen 6–8", fanless: true },
  { name: "GT1400", tagline: "10-way GPIO + Remote Switch", cpu: "Celeron J6412 / i5-8265U / i7-10510U / i7-1165G7", ram: "DDR4/DDR5 64GB", com: 6, usb: 6, lan: 2, gpio: true, sim: true, display: "HDMI", price: "28,990", cat: "premium", gen: "Gen 8–11", fanless: true },
  { name: "GT2000", tagline: "ยอดนิยม 8 USB", cpu: "Celeron 1037U / i5-3317U", ram: "DDR3L 4GB", com: 4, usb: 8, lan: 2, gpio: false, sim: false, display: "VGA+HDMI", price: "15,990", cat: "entry", gen: "Gen 3", fanless: true },
  { name: "GT3000", tagline: "6 COM หลากหลาย CPU", cpu: "Celeron / i3 / i5 / i7", ram: "DDR3L 4GB", com: 6, usb: 6, lan: 2, gpio: false, sim: false, display: "VGA+HDMI", price: "สอบถาม", cat: "standard", gen: "Gen 3–4", fanless: true },
  { name: "GT4000", tagline: "GPIO + VESA Mount", cpu: "i3 / i5-4200U / i7-4500U", ram: "DDR3L 4–8GB", com: 6, usb: 8, lan: 2, gpio: true, sim: true, display: "VGA+HDMI", price: "24,990", cat: "standard", gen: "Gen 4", fanless: true },
  { name: "GT4500", tagline: "DDR4 + SIM 4G/5G", cpu: "i3-6006U / i5-7260U / i5-8250U / i7-8550U", ram: "DDR4 4–8GB", com: 6, usb: 8, lan: 2, gpio: false, sim: true, display: "VGA+HDMI", price: "21,900", cat: "standard", gen: "Gen 6–8", fanless: true },
  { name: "GT5000", tagline: "GPIO + SIM IoT Ready", cpu: "i5-4200U / i7-4500U", ram: "DDR3L 4–8GB", com: 6, usb: 8, lan: 2, gpio: true, sim: true, display: "VGA+HDMI", price: "19,490", cat: "standard", gen: "Gen 4", fanless: true },
  { name: "GT6000", tagline: "Triple Display DDR4", cpu: "Core i3/i5/i7 Gen 8–10", ram: "DDR4 สูงสุด 64GB", com: 2, usb: 6, lan: 2, gpio: false, sim: false, display: "HDMI×2+DP", price: "สอบถาม", cat: "standard", gen: "Gen 8–10", fanless: true },
  { name: "GT7000", tagline: "DDR4 GPIO SIM ทนทุกโรงงาน", cpu: "i3 / i5 / i7 (DDR4)", ram: "DDR4 4–32GB", com: 6, usb: 6, lan: 2, gpio: true, sim: true, display: "VGA+HDMI", price: "สอบถาม", cat: "high", gen: "Gen 6–8", fanless: true },
  { name: "GT8000", tagline: "Dual HDMI + SIM 4G", cpu: "i5-1035G1 / i7-10710U", ram: "DDR4 สูงสุด 64GB", com: 2, usb: 6, lan: 2, gpio: false, sim: true, display: "HDMI×2", price: "สอบถาม", cat: "high", gen: "Gen 10", fanless: false },
  { name: "GT9000", tagline: "3 HDMI 6 COM SIM 4G", cpu: "i5-10200H / i7-10750H / i5-1235U / i7-1255U", ram: "DDR4/DDR5 32GB", com: 6, usb: 8, lan: 2, gpio: true, sim: true, display: "HDMI×3", price: "25,290", cat: "high", gen: "Gen 10–12", fanless: true },
  { name: "GT1300", tagline: "3 HDMI · 6 COM · GPIO", cpu: "i5-8400H / i7-8750H / i5-10200H / i7-10750H", ram: "DDR4 64GB", com: 6, usb: 6, lan: 2, gpio: true, sim: false, display: "HDMI×3", price: "สอบถาม", cat: "high", gen: "Gen 8–10", fanless: true },
];

const comOptions = [2, 4, 6];
const genOptions = ["Gen 3", "Gen 4", "Gen 6–8", "Gen 8–10", "Gen 10", "Gen 10–12", "Gen 8–13"];

const ComparisonTable = ({ handleTabChange }: { handleTabChange: (tab: string) => void }) => {
  const [filterCom, setFilterCom] = useState<number | null>(null);
  const [filterGpio, setFilterGpio] = useState<boolean | null>(null);
  const [filterSim, setFilterSim] = useState<boolean | null>(null);
  const [filterGen, setFilterGen] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const hasActiveFilter = filterCom !== null || filterGpio !== null || filterSim !== null || filterGen !== null || searchText.length > 0;

  const clearFilters = () => {
    setFilterCom(null);
    setFilterGpio(null);
    setFilterSim(null);
    setFilterGen(null);
    setSearchText("");
  };

  const filtered = comparisonRows.filter((row) => {
    if (filterCom !== null && row.com < filterCom) return false;
    if (filterGpio === true && !row.gpio) return false;
    if (filterSim === true && !row.sim) return false;
    if (filterGen !== null && !row.gen.includes(filterGen.replace("Gen ", ""))) return false;
    if (searchText.length > 0) {
      const q = searchText.toLowerCase();
      if (!row.name.toLowerCase().includes(q) && !row.cpu.toLowerCase().includes(q) && !row.tagline.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Quick Compare</span>
        <h3 className="text-2xl md:text-3xl font-display font-bold">
          เปรียบเทียบ<span className="text-gradient">ทุกรุ่น</span>
        </h3>
        <p className="text-muted-foreground mt-2 text-sm max-w-xl mx-auto">
          กรองตามคุณสมบัติที่ต้องการ — เลือกรุ่นที่ตรงกับงานของคุณ
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card-surface rounded-2xl p-4 md:p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-primary" />
          <span className="text-sm font-bold text-foreground">กรองสเปก</span>
          {hasActiveFilter && (
            <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <X size={14} /> ล้างตัวกรอง
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="col-span-2 md:col-span-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">ค้นหา</label>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="รุ่น, CPU..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* COM Filter */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">COM ขั้นต่ำ</label>
            <div className="flex gap-1">
              {comOptions.map((n) => (
                <button
                  key={n}
                  onClick={() => setFilterCom(filterCom === n ? null : n)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    filterCom === n
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-background border border-border text-muted-foreground hover:border-primary/40"
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* GPIO Filter */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">GPIO</label>
            <button
              onClick={() => setFilterGpio(filterGpio === true ? null : true)}
              className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                filterGpio === true
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                  : "bg-background border border-border text-muted-foreground hover:border-primary/40"
              }`}>
              {filterGpio === true ? "✓ มี GPIO" : "มี GPIO"}
            </button>
          </div>

          {/* SIM Filter */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">SIM / 4G-5G</label>
            <button
              onClick={() => setFilterSim(filterSim === true ? null : true)}
              className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                filterSim === true
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                  : "bg-background border border-border text-muted-foreground hover:border-primary/40"
              }`}>
              {filterSim === true ? "✓ รองรับ SIM" : "รองรับ SIM"}
            </button>
          </div>

          {/* CPU Gen Filter */}
          <div className="col-span-2 md:col-span-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">CPU Generation</label>
            <select
              value={filterGen || ""}
              onChange={(e) => setFilterGen(e.target.value || null)}
              className="w-full py-2 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">ทั้งหมด</option>
              {genOptions.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter summary */}
        {hasActiveFilter && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">แสดง</span>
            <span className="text-xs font-bold text-primary">{filtered.length}</span>
            <span className="text-xs text-muted-foreground">จาก {comparisonRows.length} รุ่น</span>
          </div>
        )}
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {[
          { color: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", label: "เริ่มต้น / คุ้มค่า" },
          { color: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30", label: "มาตรฐาน / ยอดนิยม" },
          { color: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30", label: "สเปกสูง / งานหนัก" },
          { color: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30", label: "Premium / ล่าสุด" },
        ].map((cat) => (
          <span key={cat.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cat.color}`}>

            {cat.label}
          </span>
        ))}
      </div>

      <div className="card-surface overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-bold text-foreground sticky left-0 bg-muted/50 min-w-[100px]">รุ่น</th>
                <th className="text-left p-4 font-bold text-foreground min-w-[120px]">จุดเด่น</th>
                <th className="text-left p-4 font-bold text-foreground min-w-[180px]">CPU</th>
                <th className="text-left p-4 font-bold text-foreground min-w-[100px]">RAM</th>
                <th className="text-center p-4 font-bold text-foreground">ระบายความร้อน</th>
                <th className="text-center p-4 font-bold text-foreground">COM</th>
                <th className="text-center p-4 font-bold text-foreground">USB</th>
                <th className="text-center p-4 font-bold text-foreground">LAN</th>
                <th className="text-center p-4 font-bold text-foreground">GPIO</th>
                <th className="text-center p-4 font-bold text-foreground">SIM</th>
                <th className="text-center p-4 font-bold text-foreground">Display</th>
                <th className="text-right p-4 font-bold text-foreground min-w-[110px]">เริ่มต้น (฿)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-12 text-center">
                    <div className="text-muted-foreground">
                      <Filter size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="font-semibold">ไม่พบรุ่นที่ตรงกับตัวกรอง</p>
                      <p className="text-xs mt-1">ลองปรับเงื่อนไขหรือ<button onClick={clearFilters} className="text-primary underline ml-1">ล้างตัวกรอง</button></p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((row) => {
                const catStyle = row.cat === "entry"
                  ? "bg-emerald-500/5 hover:bg-emerald-500/10"
                  : row.cat === "standard"
                  ? "bg-blue-500/5 hover:bg-blue-500/10"
                  : row.cat === "high"
                  ? "bg-amber-500/5 hover:bg-amber-500/10"
                  : "bg-purple-500/5 hover:bg-purple-500/10";
                const catBadge = row.cat === "entry"
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : row.cat === "standard"
                  ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                  : row.cat === "high"
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  : "bg-purple-500/20 text-purple-600 dark:text-purple-400";
                return (
                  <tr
                    key={row.name}
                    className={`border-b border-border/50 transition-colors cursor-pointer ${catStyle}`}
                    onClick={() => handleTabChange(row.name.toLowerCase())}>
                    <td className="p-4 sticky left-0 font-bold text-foreground" style={{ background: 'inherit' }}>

                      <div className="flex flex-col gap-1">
                        <span className="text-base">{row.name}</span>
                        <span className={`inline-block w-fit px-2 py-0.5 rounded-full text-[10px] font-bold ${catBadge}`}>

                          {row.gen}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-muted-foreground leading-tight block">{row.tagline}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-foreground font-mono leading-tight block">{row.cpu}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-muted-foreground">{row.ram}</span>
                    </td>
                    <td className="p-4 text-center">
                      {row.fanless ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          <Wind size={12} /> Fanless
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/30">
                          <Fan size={12} className="inline mr-0.5" />มีพัดลม
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        row.com >= 8 ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
                        row.com >= 6 ? "bg-blue-500/20 text-blue-600 dark:text-blue-400" :
                        "bg-muted text-muted-foreground"
                      }`}>{row.com}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        row.usb >= 8 ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
                        "bg-muted text-muted-foreground"
                      }`}>{row.usb}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        row.lan >= 4 ? "bg-purple-500/20 text-purple-600 dark:text-purple-400" :
                        "bg-muted text-muted-foreground"
                      }`}>{row.lan}</span>
                    </td>
                    <td className="p-4 text-center">
                      {row.gpio ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.sim ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-xs text-muted-foreground">{row.display}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`font-bold text-sm ${row.price === "สอบถาม" ? "text-muted-foreground" : "text-primary"}`}>

                        {row.price === "สอบถาม" ? "สอบถาม" : `฿${row.price}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Decision Helper */}
        <div className="p-6 bg-muted/30 border-t border-border">
          <h4 className="font-bold text-foreground mb-4 text-sm"><Target size={16} className="inline mr-1.5 text-primary" />เลือกรุ่นไหนดี?</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">งบจำกัด / งานเบา</div>
              <div className="text-xs text-muted-foreground">GT1000 หรือ GT2000 — Celeron ประหยัด เพียงพอสำหรับ POS, Signage, ระบบคิว</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">ต้องการ COM เยอะ / IoT</div>
              <div className="text-xs text-muted-foreground">GT3000–GT5000 — 6 COM + GPIO/SIM เหมาะเชื่อมเซ็นเซอร์ PLC หลายตัว</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400">สเปกแรง / งานหนัก</div>
              <div className="text-xs text-muted-foreground">GT7000–GT9000 — DDR4/DDR5 + i5/i7 Gen 10–12 สำหรับ SCADA, AI Edge, Vision</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400">เน็ตเวิร์ก / ดีไซน์ใหม่</div>
              <div className="text-xs text-muted-foreground">GT1400 — 4 LAN + DDR5 สำหรับ Firewall, Router หรืองาน Network Appliance</div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        <AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายโดยตรงเพื่อยืนยันราคาที่ถูกต้อง โทร. 095-739-1053 · Line: @entgroup
      </p>
    </div>
  );
};

const GTSeries = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showLineQR, setShowLineQR] = useState(false);
  const toggleSelect = useCallback((name: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }, []);
  const [gt1200PricePage, setGt1200PricePage] = useState(0);
  const [gt6000PricePage, setGt6000PricePage] = useState(0);
  const [gt9000PricePage, setGt9000PricePage] = useState(0);
  const [gt1400PricePage, setGt1400PricePage] = useState(0);
  const [gt3000PricePage, setGt3000PricePage] = useState(0);

  const useCasesGrid = (
    <div className="space-y-6">
      {/* Custom Branding Section */}
      <div className="card-surface rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-display font-bold text-foreground mb-2"><Palette size={18} className="inline mr-1.5 text-primary" />เพิ่มสีสันสดใส ด้วยการทำสีใหม่ให้กับสินค้าของคุณ</h3>
          <p className="text-muted-foreground">สร้างภาพลักษณ์องค์กร — พนักงานภูมิใจที่ได้ใช้ผลิตภัณฑ์ระดับโลก ออกแบบเครื่องให้เข้ากับแบรนด์ของคุณได้อย่างลงตัว</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {galleryImages.map((img, i) => (
              <div key={i} className="overflow-hidden rounded-lg aspect-square">
                <img src={img} alt={`GT Series สีสัน ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="card-surface rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-display font-bold text-foreground mb-2"><Factory size={18} className="inline mr-1.5 text-primary" />ตัวอย่าง<span className="text-primary">การใช้งาน</span></h3>
          <p className="text-muted-foreground">รองรับได้หลากหลายกิจกรรม — โรงงานอุตสาหกรรม, Factory Automation, IOT, KIOSK, HMI, Digital Signage, Queue System, รถโดยสาร, รถไฟฟ้า, ตู้คอนโทรล</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 divide-x divide-y divide-border">
          {[
            { img: usecaseFactory, title: "โรงงานอุตสาหกรรม", desc: "ควบคุมไลน์ผลิต ทนฝุ่น ทนร้อน 24/7" },
            { img: usecaseAutomation, title: "Factory Automation", desc: "เชื่อมต่ออุปกรณ์ PLC, SCADA, HMI" },
            { img: usecaseIot, title: "IoT Gateway", desc: "รวบรวมข้อมูลเซ็นเซอร์ ส่งขึ้น Cloud" },
            { img: usecaseKiosk, title: "KIOSK & Signage", desc: "ตู้บริการอัตโนมัติ ป้ายดิจิทัล" },
            { img: usecaseHmi, title: "HMI Controller", desc: "จอสั่งงานเครื่องจักร แม่นยำ" },
            { img: usecaseBus, title: "รถโดยสาร", desc: "ระบบแสดงผลและจัดการเส้นทาง" },
            { img: usecaseTrain, title: "รถไฟฟ้า", desc: "ระบบสารสนเทศผู้โดยสาร" },
            { img: usecaseQueue, title: "Queue System", desc: "ระบบคิวอัตโนมัติ คลินิก ธนาคาร" },
            { img: usecaseControl, title: "ตู้คอนโทรล", desc: "ติดตั้งในตู้ MDB, ควบคุมระบบ" },
            { img: usecaseBranding, title: "Custom Branding", desc: "ทำสี สกรีนโลโก้ ตามแบรนด์คุณ" },
          ].map((item, i) => (
            <div key={i} className="group overflow-hidden hover:bg-secondary/40 transition-colors">
              <div className="aspect-square overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" width={640} height={640}/>
              </div>
              <div className="p-3 text-center">
                <p className="text-xs font-bold text-foreground mb-1">{item.title}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    window.scrollTo({ top: document.getElementById("models")?.offsetTop ? document.getElementById("models")!.offsetTop - 80 : 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="GT Series — Industrial Fanless Mini PC 12 รุ่น" description="GT Series คอมพิวเตอร์อุตสาหกรรม Fanless ทนร้อน ทนฝุ่น 12 รุ่น รองรับ Intel N100 ถึง Core i7 สำหรับโรงงาน IoT Edge Computing ประเทศไทย" path="/gt-series" />
      <ProductJsonLd
        collectionName="GT Series Industrial Fanless Mini PC"

        collectionDescription="คอมพิวเตอร์อุตสาหกรรม Fanless 12 รุ่น รองรับ Intel Celeron ถึง Core i7 สำหรับโรงงาน IoT Edge Computing"

        collectionUrl="/gt-series"

        products={gtModels.map(m => ({ name: m.name, price: m.price, image: typeof m.image === 'string' ? m.image : undefined, description: m.tagline, category: "Industrial Fanless Mini PC" }))}      />

      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "GT Series", path: "/gt-series" }]} />
      <MiniNavbar />

      {/* Hero — Bold Industrial */}
      <section className="relative overflow-hidden min-h-[480px] md:min-h-[560px] flex items-center">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={gtSeriesHeroBg}
            alt="Industrial factory production line with fanless computers"
            className="w-full h-full object-cover"
            width={1920}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 container max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 max-w-[40px] bg-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Industrial Fanless Computer</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[0.9] text-white">
              GT <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--accent))]">SERIES</span>
            </h1>

            {/* Tagline keywords */}
            <div className="flex flex-wrap gap-3">
              {[
                { word: "ถึก", Icon: Shield },
                { word: "ทน", Icon: Flame },
                { word: "แกร่ง", Icon: Wrench },
                { word: "แข็งแรง", Icon: Zap },
              ].map((item) => (
                <span
                  key={item.word}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-base tracking-wide">
                  <item.Icon size={18} className="text-primary" />
                  {item.word}
                </span>
              ))}
            </div>

            <p className="text-white/70 leading-relaxed max-w-lg text-sm md:text-base">
              คอมพิวเตอร์อุตสาหกรรม Fanless ขนาดกะทัดรัด โครงอลูมิเนียมหนาทั้งตัว
              ครีบระบายความร้อนถี่ๆ — ทนฝุ่น ทนสั่นสะเทือน ทำงาน 24/7 ไม่มีสะดุด
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-2.5 md:p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="text-xl md:text-2xl font-black text-primary">13+</div>
                <div className="text-[10px] md:text-xs text-white/50 mt-1">รุ่นให้เลือก</div>
              </div>
              <div className="text-center p-2.5 md:p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="text-xl md:text-2xl font-black text-primary">0°</div>
                <div className="text-[10px] md:text-xs text-white/50 mt-1">เสียงรบกวน</div>
              </div>
              <div className="text-center p-2.5 md:p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="text-xl md:text-2xl font-black text-primary">24/7</div>
                <div className="text-[10px] md:text-xs text-white/50 mt-1">ทำงานต่อเนื่อง</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleTabChange("overview")}
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/25">
                ดูรุ่นทั้งหมด <ArrowLeft size={16} className="rotate-180" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("comparison");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center justify-center gap-2 px-5 md:px-6 py-3 md:py-3.5 rounded-full border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all group">
                <Filter size={16} />
                <span>เปรียบเทียบสเปก</span>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold tracking-wide uppercase group-hover:bg-white/25 transition-colors">Smart Filter</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Feature Strip */}
      <section className="py-8 bg-surface/50 border-y border-border">
        <div className="container max-w-7xl mx-auto px-6">
          {/* Features + Use Cases in one row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
                <f.icon className="text-primary shrink-0" size={18} />
                <div>
                  <div className="text-xs font-bold text-foreground leading-tight">{f.title}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight hidden sm:block">{f.desc}</div>
                </div>
              </div>
            ))}
            {useCases.map((uc) => (
              <div key={uc.label} className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
                <uc.icon className="text-primary shrink-0" size={18} />
                <span className="text-xs font-bold text-foreground">{uc.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models Section with Tabs */}
      <section className="section-padding" id="models">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">All Models</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              รุ่น<span className="text-gradient">ทั้งหมด</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              เลือกรุ่นที่เหมาะกับงานของคุณ — ตั้งแต่รุ่นเริ่มต้นจนถึง Top Performance
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {modelTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
                }`}>
                {tab.label}
                {tab.id === "gt1400" && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary-foreground/20 text-[10px]">NEW</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab: Overview - All Models Grid */}
          {activeTab === "overview" && (
            <div className="space-y-16">
              {/* Model Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gtModels.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => model.tab ? handleTabChange(model.tab) : undefined}
                    className={`group card-surface overflow-hidden hover:border-primary/30 transition-all hover:-translate-y-1 text-left cursor-pointer ${selectedProducts.has(model.name) ? "ring-2 ring-primary border-primary/50" : ""}`}>
                    <ModelCard model={model} selected={selectedProducts.has(model.name)} onToggleSelect={toggleSelect} />
                  </button>
                ))}
              </div>

              {/* Use Cases & Branding */}
              {useCasesGrid}

              {/* Comparison Table */}
              <div id="comparison">
                <ComparisonTable handleTabChange={handleTabChange} />
              </div>
            </div>
          )}

          {/* Tab: GT1000 Detail */}
          {activeTab === "gt1000" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img
                  src={gt1000Banner}
                  alt="GT1000 Industrial PC"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    Best Seller · Fanless · 2 LAN · 2 COM
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">1000</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    รุ่นเริ่มต้น คุ้มค่า — เล็กแต่แกร่ง ทำงาน 24/7
                  </p>
                </div>
              </div>

              {/* Product Gallery + Key Info */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      Best Seller
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">1000</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Industrial Mini PC เกรดอุตสาหกรรม โครง Brushed Aluminum Alloy สีดำ ดีไซน์พรีเมียม
                      ระบบ Fanless เงียบสนิท 0 เดซิเบล ทำงานต่อเนื่อง 24 ชั่วโมง ไม่มีพัดลม ไม่ดูดฝุ่น
                      ทนอุณหภูมิ 0–60°C เหมาะกับทุกสภาพแวดล้อมอุตสาหกรรม
                    </p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    พร้อม <strong className="text-foreground">2× Gigabit LAN + 2× RS232 COM + SIM Card Slot</strong> รองรับ 3G/4G Module,
                    ติดตั้ง mSATA SSD + 2.5" SATA HDD พร้อมกัน, แสดงผล VGA + HDMI Dual Display,
                    Built-in WiFi/Bluetooth พร้อมเสาอากาศคู่ภายนอก, ยึดติดผนังได้ (Wall Mount)
                  </p>

                  {/* Key Features from Factory */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Cpu, title: "CPU", desc: "Intel Celeron N2920 / N3520", sub: "Quad-Core, TDP 7.5W" },
                      { icon: Server, title: "RAM & Storage", desc: "DDR3L 4–8 GB", sub: "mSATA SSD + 2.5\" SATA HDD" },
                      { icon: Shield, title: "2 LAN · 2 COM", desc: "Gigabit Ethernet × 2", sub: "RS232 × 2 + SIM Slot" },
                      { icon: Wind, title: "Fanless 24/7", desc: "เงียบ 0 dB ไม่มีพัดลม", sub: "โครงอลูมิเนียมระบายความร้อน" },
                      { icon: Monitor, title: "Dual Display", desc: "VGA + HDMI พร้อมกัน", sub: "รองรับ 2 จอพร้อมกัน" },
                      { icon: Zap, title: "Low Power", desc: "12V DC-IN ประหยัดไฟ", sub: "USB 6 (2×3.0 + 4×2.0)" },
                    ].map((f) => (
                      <div key={f.title} className="card-surface p-4">
                        <f.icon className="text-primary mb-2" size={20} />
                        <div className="font-bold text-foreground text-sm">{f.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{f.desc}</div>
                        <div className="text-[11px] text-muted-foreground/70 mt-0.5">{f.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Use Cases */}
                  <div className="card-surface p-5">
                    <h4 className="font-bold text-foreground mb-3 text-sm">รองรับงานหลากหลาย</h4>
                    <div className="flex flex-wrap gap-2">
                      {["โรงงานอุตสาหกรรม", "Factory Automation", "IOT Gateway", "KIOSK", "HMI", "Digital Signage", "Queue System", "ATM/Bank", "Transportation", "ตู้คอนโทรล", "โรงเรียน/มหาวิทยาลัย", "Telecom"].map((uc) => (
                        <span key={uc} className="px-3 py-1 rounded-full bg-secondary/50 text-muted-foreground text-xs border border-border">
                          {uc}
                        </span>
                      ))}
                  </div>

                  {/* Quick Quote CTA */}
                  <div className="card-surface p-5 bg-primary/5 border-primary/20 flex flex-col gap-4">
                    <div>
                      <p className="font-bold text-sm text-foreground">สนใจ GT1000?</p>
                      <p className="text-xs text-muted-foreground">ขอใบเสนอราคาตอนนี้</p>
                    </div>
                    <div className="flex gap-2">
                      <QuoteRequestButton
                        productModel="GT1000"
                        productName="Intel Celeron N2920 Industrial Mini PC"
                        size="sm"
                        className="flex-1"
                      />
                      <LineQRButton className="flex-1 h-9 text-sm">
                        <MessageSquare className="w-4 h-4" /> LINE @entgroup
                      </LineQRButton>
                    </div>
                  </div>
                </div>
                </div>

                {/* Product Images Gallery — ภาพจริงจากโรงงาน */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden rounded-xl bg-muted/30">
                    <img
                      src="/images/wezhan/5874413.jpg"
                      alt="GT1000 ด้านหน้า — 2 LAN, HDMI, VGA, MIC, SPK"
                      className="w-full object-contain p-2"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/wezhan/5874414.jpg", alt: "GT1000 ด้านหลัง — USB, COM ports" },
                      { src: "/images/wezhan/5874418.jpg", alt: "GT1000 ด้านข้าง — ครีบระบายความร้อน" },
                      { src: "/images/wezhan/5874416.jpg", alt: "GT1000 ด้านล่าง — VESA Mount" },
                      { src: "/images/wezhan/5874419.jpg", alt: "GT1000 ภายใน — Mainboard + WiFi" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden rounded-lg bg-muted/30">
                        <img src={img.src} alt={img.alt} className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spec Table — ข้อมูลจริงจากโรงงาน */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground">GT1000 Specifications</h3>
                  <p className="text-xs text-muted-foreground mt-1">ข้อมูลจาก Manufacturer · Intel Bay Trail Platform</p>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  {/* Left Column */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {[
                          { cat: "General", items: [
                            { label: "CPU", value: "Intel Pentium N3520 / Celeron N2920 Quad-Core" },
                            { label: "FSB / Process", value: "100MHz / 22nm" },
                            { label: "L3 Cache", value: "2 MB Integrated" },
                            { label: "Chipset", value: "Intel BTY SOC" },
                            { label: "BIOS", value: "AMI BIOS, ACPI, Auto Power On" },
                          ]},
                          { cat: "Memory & Storage", items: [
                            { label: "Memory", value: "1× SO-DIMM DDR3L, 4/8GB 1333MHz" },
                            { label: "Storage", value: "mSATA SSD + SATA HDD (Optional)" },
                          ]},
                          { cat: "Display & Audio", items: [
                            { label: "GPU", value: "Intel HD Graphics (Integrated)" },
                            { label: "Output", value: "VGA + HDMI (Dual Sync)" },
                            { label: "Audio", value: "ALC662 HD Audio, 6CH" },
                          ]},
                        ].map((section) => (
                          <>
                            <tr key={section.cat} className="bg-secondary/40">
                              <td colSpan={2} className="p-3 font-bold text-foreground text-xs tracking-widest uppercase">{section.cat}</td>
                            </tr>
                            {section.items.map((spec) => (
                              <tr key={spec.label} className="hover:bg-secondary/30 transition-colors">
                                <td className="p-3 font-semibold text-foreground w-[120px] whitespace-nowrap text-xs">{spec.label}</td>
                                <td className="p-3 text-muted-foreground text-xs whitespace-pre-line">{spec.value}</td>
                              </tr>
                            ))}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Right Column */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {[
                          { cat: "I/O Ports", items: [
                            { label: "USB", value: "2× USB 3.0 + 4× USB 2.0" },
                            { label: "COM", value: "2× RS232/422/485 (BIOS Switch)" },
                            { label: "LAN", value: "2× Intel i211 GbE" },
                            { label: "SIM", value: "Micro SIM (Push, ด้านข้าง)" },
                            { label: "Internal", value: "mSATA + SATA + mini PCIe ×2" },
                          ]},
                          { cat: "Network", items: [
                            { label: "WiFi/BT", value: "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม" },
                          ]},
                          { cat: "Power & Environment", items: [
                            { label: "Power", value: "DC 12V/5A (10W), AC 100–240V" },
                            { label: "Temp", value: "-10°C ~ 60°C" },
                            { label: "Humidity", value: "10–90% Non-condensing" },
                          ]},
                          { cat: "Physical", items: [
                            { label: "Size", value: "175 × 125 × 37 mm" },
                            { label: "Weight", value: "0.85 kg (Net) / 1.5 kg (Gross)" },
                            { label: "Mount", value: "VESA 100×100 / Wall" },
                            { label: "OS", value: "Win 7/8/10 / Linux" },
                          ]},
                        ].map((section) => (
                          <>
                            <tr key={section.cat} className="bg-secondary/40">
                              <td colSpan={2} className="p-3 font-bold text-foreground text-xs tracking-widest uppercase">{section.cat}</td>
                            </tr>
                            {section.items.map((spec) => (
                              <tr key={spec.label} className="hover:bg-secondary/30 transition-colors">
                                <td className="p-3 font-semibold text-foreground w-[120px] whitespace-nowrap text-xs">{spec.label}</td>
                                <td className="p-3 text-muted-foreground text-xs whitespace-pre-line">{spec.value}</td>
                              </tr>
                            ))}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Port Diagrams */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <img
                    src="/images/wix/3e5003_d438441c66734588bf92c3cb77e08aae_c34db0a8.jpg"
                    alt="GT1000 Connectivity Diagram"
                    className="w-full rounded-lg"/>
                </div>
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <img
                    src="/images/wix/0597a3_813ed70f44da4e72b1f8d881cd8b30d9_e508c44a.png"
                    alt="GT1000 Port Layout"
                    className="w-full rounded-lg"/>
                </div>
              </div>

              {/* GT1000 Price Table */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground">GT1000 Price List</h3>
                  <p className="text-xs text-muted-foreground mt-1"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายเพื่อยืนยันราคา โทร. 095-739-1053 · Line: @entgroup</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                     <thead>
                       <tr className="bg-secondary/50">
                         <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                         <th className="text-left p-3 font-semibold text-foreground min-w-[280px]">Configuration</th>
                         <th className="text-right p-3 font-semibold text-foreground">ราคา</th>
                         <th className="text-left p-3 font-semibold text-foreground">หมายเหตุ</th>
                         <th className="p-3 w-20"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                       {[
                         { model: "N2920", config: "RAM DDR3L 4GB + SSD 128GB + WiFi", price: "15,990", remark: "" },
                         { model: "N2920", config: "RAM DDR3L 8GB + SSD 128GB + WiFi", price: "16,990", remark: "" },
                         { model: "N2920", config: "RAM 4GB / SSD 128GB / 4G Module (Long Antenna)", price: "18,990", remark: "รองรับ SIM 4G LTE" },
                         { model: "N2920", config: "RAM 4GB / SSD 128GB / 4G / Windows 10 Pro", price: "21,990", remark: "รวม Windows 10 Pro OEM" },
                         { model: "N2920", config: "RAM DDR3L 8GB + SSD 256GB + WiFi", price: "18,990", remark: "รวม Windows 10 Pro OEM" },
                         { model: "N3520", config: "RAM DDR3L 4GB + SSD 128GB + WiFi", price: "17,990", remark: "CPU เร็วกว่า" },
                         { model: "N3520", config: "RAM DDR3L 8GB + SSD 128GB + WiFi", price: "18,990", remark: "" },
                         { model: "N3520", config: "RAM 4GB / SSD 128GB / 4G Module (Long Antenna)", price: "21,990", remark: "รองรับ SIM 4G LTE" },
                       ].map((item, i) => {
                         const specLabel = `GT1000 ${item.model} ${item.config}`;
                         return (
                         <tr key={i} className="hover:bg-secondary/30 transition-colors">
                           <td className="p-3 text-foreground font-medium font-mono">{item.model}</td>
                           <td className="p-3 text-muted-foreground">{item.config}</td>
                           <td className="p-3 text-right font-bold text-primary whitespace-nowrap">฿{item.price}</td>
                           <td className="p-3 text-xs text-muted-foreground">{item.remark}</td>
                           <td className="p-3">
                             <div className="inline-flex items-center gap-1">
                               <AddToCartButton productModel="GT1000" productName={specLabel} iconOnly variant="outline" />
                               <QuoteRequestButton productModel="GT1000" productName={specLabel} iconOnly variant="outline" />
                               <ChatNowButton productModel="GT1000" productName={specLabel} />
                             </div>
                           </td>
                         </tr>
                         );
                       })}
                     </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-border text-center">
                </div>
              </div>

              {/* Product Gallery — จากโรงงาน */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <h4 className="font-bold text-foreground mb-3 text-sm"><CircuitBoard size={16} className="inline mr-1 text-primary" />Mainboard และการติดตั้ง</h4>
                  <img src="/images/gt1000/ports-front.jpg" alt="GT1000 Mainboard และการติดตั้ง" className="w-full rounded-lg"/>
                </div>
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <h4 className="font-bold text-foreground mb-3 text-sm"><Plug size={16} className="inline mr-1 text-primary" />Ports — ด้านหลัง</h4>
                  <img src="/images/gt1000/ports-rear.jpg" alt="GT1000 Ports ด้านหลัง" className="w-full rounded-lg"/>
                </div>
              </div>

              {/* Product Angles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { src: "/images/gt1000/product-angle1.jpg", alt: "GT1000 มุมด้านหน้า" },
                  { src: "/images/gt1000/product-angle2.jpg", alt: "GT1000 มุมเอียง" },
                  { src: "/images/gt1000/side-view.jpg", alt: "GT1000 ด้านข้าง — ครีบระบายความร้อน" },
                  { src: "/images/gt1000/bottom-view.jpg", alt: "GT1000 ด้านล่าง — VESA Mount" },
                ].map((img, i) => (
                  <div key={i} className="card-surface overflow-hidden rounded-xl">
                    <img src={img.src} alt={img.alt} className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"/>
                  </div>
                ))}
              </div>

              {/* Podcast Section */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT1000</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Episode 1 — Introduction */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/40 border border-border">
                      <div className="shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">GT1000 Introduction</p>
                        <p className="text-xs text-muted-foreground mt-0.5">แนะนำ GT1000 — Mini PC สำหรับงานอุตสาหกรรม</p>
                        <audio controls className="w-full mt-3 h-10" preload="metadata">
                          <source src="/audio/GT1000_introduction.wav" type="audio/wav" />
                          เบราว์เซอร์ของคุณไม่รองรับการเล่นเสียง
                        </audio>
                        <div className="mt-3">
                          <ShareButtons url={window.location.origin + "/gt-series?tab=gt1000"} title="GT1000 Podcast — ENT GROUP" />
                        </div>
                      </div>
                    </div>
                    {/* Episode 2 — Detail Specification */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/40 border border-border">
                      <div className="shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">GT1000 Detail Specification</p>
                        <p className="text-xs text-muted-foreground mt-0.5">สเปกเจาะลึก GT1000 — CPU, RAM, Port, ขนาด</p>
                        <audio controls className="w-full mt-3 h-10" preload="metadata">
                          <source src="/audio/GT1000_Detail_Specification.wav" type="audio/wav" />
                          เบราว์เซอร์ของคุณไม่รองรับการเล่นเสียง
                        </audio>
                        <div className="mt-3">
                          <ShareButtons url={window.location.origin + "/gt-series?tab=gt1000"} title="GT1000 Detail Spec Podcast — ENT GROUP" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Section — YouTube */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎬 วิดีโอ GT1000</h3>
                </div>
                <div className="p-5 space-y-6">
                  {/* Intro Video — Hero */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-2">GT1000 Intro</h4>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                      <iframe
                        src="https://www.youtube.com/embed/7wE6fxMpJB4"

                        title="GT1000 Intro"

                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"></iframe>
                    </div>
                    <div className="mt-3">
                      <ShareButtons url="https://youtu.be/7wE6fxMpJB4" title="GT1000 Intro — ENT GROUP" />
                    </div>
                  </div>

                  {/* Other Videos — Grid */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-3">🎥 วิดีโอเพิ่มเติม</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { id: "YRDo5EkmpRw", title: "GT1000 รีวิวเจาะลึก" },
                        { id: "DLJ2eghWoMQ", title: "GT1000 Short" },
                        { id: "HQnWY8T7pDM", title: "GT1000 สาธิตการใช้งาน" },
                      ].map((video) => (
                        <div key={video.id} className="space-y-2">
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${video.id}`}
                              title={video.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full"></iframe>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground font-medium">{video.title}</p>
                            <ShareButtons url={`https://youtu.be/${video.id}`} title={`${video.title} — ENT GROUP`} compact />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* YouTube Channel CTA */}
                  <a
                    href="https://www.youtube.com/@ENTGROUP-TH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors group">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                      <Play className="text-white ml-0.5" size={18} fill="white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">ENT GROUP — YouTube Channel</p>
                      <p className="text-xs text-muted-foreground">กดติดตามเพื่อรับวิดีโอสินค้าใหม่ รีวิว และเทคนิคการใช้งาน</p>
                    </div>
                    <span className="shrink-0 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold group-hover:bg-red-700 transition-colors">
                      Subscribe
                    </span>
                  </a>
                </div>
              </div>

              {/* Factory Application Image */}
              <div className="card-surface overflow-hidden rounded-xl">
                <img src="/images/gt1000/factory-app.avif" alt="GT1000 Factory Application" className="w-full h-auto rounded-xl"/>
              </div>

              {/* Datasheet CTA */}
              <div className="text-center">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT1000.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> ดาวน์โหลด Datasheet GT1000
                </a>
              </div>
            </div>
          )}

          {/* Tab: GT2000 Detail */}
          {activeTab === "gt2000" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img
                  src={gt2000Banner}
                  alt="GT2000 Industrial PC"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    Best Seller · 8 USB · 4 COM
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">2000</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    ยอดนิยม 8 USB + 4 COM — พร้อมรองรับ Windows XP
                  </p>
                </div>
              </div>

              {/* Description + Product Image */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      Best Seller · 8 USB · 4 COM
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">2000</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Industrial PC คือเครื่องคอมพิวเตอร์เกรดอุตสาหกรรมขนาดเล็ก ที่ถูกออกแบบมาเพื่อรองรับการทำงาน
                      ในสภาวะแวดล้อมที่มีอุณหภูมิสูง ฝุ่นละอองหนาแน่น โดยออกแบบให้มีการระบายความร้อนได้ดีและทนความร้อนได้สูง
                      จึงเป็นเหตุผลที่ทำให้ GT2000 ทำงานได้อย่างมีประสิทธิภาพเหมาะสมกับงานอุตสาหกรรมทุกประเภทในปัจจุบัน
                    </p>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-primary">
                    <h4 className="font-bold text-foreground mb-2">🔇 Fanless Design — Silent Workhorse</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      GT2000 ใช้ระบบ Fanless Design เงียบ 0 เดซิเบล โดยใช้โครงสร้าง Full Aluminum Alloy สีดำแบบ brushed finish
                      ทำหน้าที่เป็น heatsink ขนาดใหญ่ ระบายความร้อนแบบ passive cooling ไม่มีพัดลม ทำงานได้ 24 ชั่วโมงต่อเนื่อง
                      ทนอุณหภูมิ 0-60°C เหมาะสำหรับสภาพแวดล้อมโรงงานที่มีฝุ่นละออง เพราะไม่มีการดูดอากาศ
                    </p>
                  </div>

                  {/* Key Specs Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-surface p-4 text-center">
                      <Cpu className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">CPU</div>
                      <div className="text-xs text-muted-foreground mt-1">Intel Celeron 1037U / Core i5-3317U</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Server className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">RAM & Storage</div>
                      <div className="text-xs text-muted-foreground mt-1">DDR3L 4–8 GB / SSD 128–512 GB</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Shield className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">8 USB + 4 COM</div>
                      <div className="text-xs text-muted-foreground mt-1">USB 3.0×4 + 2.0×4, RS232×4</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Wind className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">15W TDP</div>
                      <div className="text-xs text-muted-foreground mt-1">Fanless 0 dB ทำงาน 24/7</div>
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden rounded-xl">
                    <div className="relative w-full aspect-video">
                      <iframe
                        src="https://www.youtube.com/embed/Z4hTYAIDs2s"

                        title="GT2000 สาธิตการใช้งาน"

                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"></iframe>
                    </div>
                    <div className="p-3">
                      <ShareButtons url="https://youtu.be/Z4hTYAIDs2s" title="GT2000 สาธิตการใช้งาน — ENT GROUP" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      "/images/wix/005637_58feaede6057451aa5fd7afe6ec6f880_87e3b32b.jpg",
                      "/images/wix/005637_ab944bafb9764a7c9fec363c2e2c8ef5_2db86367.jpg",
                      "/images/wix/005637_bade0d66426d44dea1328e1b2eb149b1_eef91dfa.jpg",
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden">
                        <img src={img} alt={`GT2000 มุมมอง ${i + 2}`} className="w-full object-cover hover:scale-105 transition-transform duration-300"/>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "/images/wix/005637_9a8e5e98c73b46a8981bfbd6ef8f682c_b918e0a4.jpg",
                      "/images/wix/005637_78842837709848ea983945436f0822ee_591fff34.jpg",
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden">
                        <img src={img} alt={`GT2000 ติดตั้งจริง ${i + 1}`} className="w-full object-cover hover:scale-105 transition-transform duration-300"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chassis Cooling Technology */}
              <div className="card-surface p-6 md:p-8">
                <h4 className="text-xl font-display font-bold text-foreground mb-4">
                  <ThermometerSun size={18} className="inline mr-1 text-primary" />Chassis Cooling Technology
                </h4>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      GT2000 ใช้เทคโนโลยี Chassis Cooling ที่โดดเด่น โดยตัวเครื่องทั้งหมดทำหน้าที่เป็น heatsink ยักษ์
                      ด้วยครีบระบายความร้อนอลูมิเนียมที่ออกแบบมาพิเศษ ทำให้ความร้อนกระจายออกจากพื้นผิวทั้งหมดอย่างมีประสิทธิภาพ
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2"><span className="text-primary font-bold">✓</span> เงียบสนิท 0 เดซิเบล — ไม่มีพัดลม</li>
                      <li className="flex items-start gap-2"><span className="text-primary font-bold">✓</span> โครงสร้างอลูมิเนียมแข็งแรงทนทาน</li>
                      <li className="flex items-start gap-2"><span className="text-primary font-bold">✓</span> ประหยัดไฟเพียง 15W ทำงาน 24/7</li>
                      <li className="flex items-start gap-2"><span className="text-primary font-bold">✓</span> ไม่ดูดอากาศ ปลอดฝุ่น เหมาะกับโรงงาน</li>
                      <li className="flex items-start gap-2"><span className="text-primary font-bold">✓</span> ไม่มีชิ้นส่วนเคลื่อนไหว = เสถียรสูง</li>
                    </ul>
                  </div>
                  <div className="card-surface overflow-hidden">
                    <img
                      src="/images/wix/3e5003_6bf58ba61ae245ea82f96cb2171fb9b7_16926587.jpg"
                      alt="GT2000 Chassis Cooling"
                      className="w-full rounded-lg"/>
                  </div>
                </div>
              </div>

              {/* CPU Detail */}
              <div className="card-surface p-6 md:p-8">
                <h4 className="text-xl font-display font-bold text-foreground mb-4">
                  <Cpu size={18} className="inline mr-1 text-primary" />CPU — Intel Celeron 1037U
                </h4>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src="/images/wix/0597a3_2f4f2a02ac1542fb8ce44f6b78f5c5f9_98c59f5e.png"
                      alt="GT2000 CPU Detail"
                      className="w-full"/>
                  </div>
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Intel Celeron 1037U (22nm Ivy Bridge) แบบ dual-core 2 threads ความเร็ว 1.8GHz
                      พร้อม Intel Ivy Bridge Graphics Controller รองรับความละเอียด 1920×1080 HD
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      ออกแบบมาเพื่องานอุตสาหกรรมที่ต้องการความเสถียรสูง ประหยัดไฟเพียง 15W ทำงาน 24 ชั่วโมงต่อเนื่อง
                      เหมาะสำหรับการควบคุมเครื่องจักร ระบบ monitoring และ<strong className="text-foreground"> รองรับ Windows XP</strong> ที่หายากในยุคปัจจุบัน
                    </p>
                  </div>
                </div>
              </div>

              {/* I/O Port Diagram */}
              <div className="card-surface p-6 md:p-8">
                <h4 className="text-xl font-display font-bold text-foreground mb-4">
                  <Plug size={18} className="inline mr-1 text-primary" />I/O Port — ครบครันสำหรับงานอุตสาหกรรม
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src="/images/wix/0597a3_126df8ab2d554a9a8b4a6074fe4f7647_c1e10423.png"
                      alt="GT2000 I/O Ports Front"
                      className="w-full rounded-lg"/>
                  </div>
                  <div>
                    <img
                      src="/images/wix/0597a3_dac94b90d7444622918e2fe4f69de597_c78e860e.png"
                      alt="GT2000 I/O Ports Rear"
                      className="w-full rounded-lg"/>
                  </div>
                </div>
                <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {[
                    { label: "USB 8 ports", desc: "4× USB 3.0 + 4× USB 2.0 — barcode, camera, external storage" },
                    { label: "Dual Display", desc: "HDMI + VGA — 2 หน้าจอสำหรับ control room & monitoring" },
                    { label: "2 Gigabit LAN", desc: "แยกเครือข่ายระบบผลิตและ office เพิ่มความปลอดภัย" },
                    { label: "4 RS232 COM Port", desc: "เชื่อมต่อเครื่องจักรเก่า PLC และ sensors" },
                    { label: "Audio Port", desc: "สำหรับระบบแจ้งเตือน" },
                    { label: "ขนาดกะทัดรัด", desc: "23.4×15×4.8 cm น้ำหนัก 1.5 kg — wall mount ได้" },
                  ].map((item, i) => (
                    <div key={i} className="card-surface p-3">
                      <div className="font-bold text-foreground mb-1">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Port Diagram Full */}
              <div className="card-surface p-4 overflow-hidden">
                <img
                  src="/images/wix/0597a3_4843a18b6dfe4330bd22479aadd69b1d_771d3c49.png"
                  alt="GT2000 Full Port Diagram"
                  className="w-full max-w-2xl mx-auto rounded-lg"/>
              </div>

              {/* OS Support */}
              <div className="card-surface p-6 md:p-8">
                <h4 className="text-xl font-display font-bold text-foreground mb-4">
                  <Laptop size={18} className="inline mr-1 text-primary" />รองรับ OS หลากหลาย — รวมถึง Windows XP!
                </h4>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      GT2000 รองรับระบบปฏิบัติการหลากหลาย ตั้งแต่ Windows 7, 8, 10, Linux และที่เด่นที่สุดคือ
                      <strong className="text-foreground"> Windows XP</strong> ซึ่งหายากมากในยุคปัจจุบัน
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      จุดเด่นนี้ทำให้ GT2000 เป็นตัวเลือกเฉพาะสำหรับโรงงานที่ยังใช้เครื่องจักรเก่าหรือซอฟต์แวร์ legacy
                      ที่ต้องการ XP เป็นพิเศษ ให้ความยืดหยุ่นในการใช้งานและขยายอายุการใช้งานของระบบเดิมได้อย่างมีประสิทธิภาพ
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src="/images/wix/0597a3_b5efadfa0e7b40619c90fec704966b11_8fec62ed.png"
                      alt="GT2000 OS Support"
                      className="w-full"/>
                  </div>
                </div>
              </div>

              {/* Dimension */}
              <div className="card-surface p-6 text-center">
                <h4 className="text-lg font-display font-bold text-foreground mb-4"><Ruler size={18} className="inline mr-1 text-primary" />ขนาดกะทัดรัด</h4>
                <p className="text-muted-foreground mb-4">
                  เพียง 23.4 × 15 × 4.8 cm น้ำหนัก 1.5 kg — ประมาณขนาดหนังสือเล่มใหญ่ ประหยัดพื้นที่ติดตั้ง wall mount ได้ เคลื่อนย้ายสะดวก
                </p>
                <img
                  src="/images/wix/0597a3_46573ca6a9a644e29b30118c4f839098_da7c5153.png"
                  alt="GT2000 Dimensions"
                  className="max-w-sm mx-auto rounded-lg"/>
              </div>

              {/* Spec Summary */}
              <div className="card-surface overflow-hidden">
                <div className="p-4 overflow-hidden">
                  <img
                    src="/images/wix/0597a3_8cc69bc674294dc9907277ccf8235ad1_e11caf5f.png"
                    alt="GT2000 Spec Summary"
                    className="w-full max-w-xl mx-auto rounded-lg"/>
                </div>
              </div>

              {/* GT2000 Price Table */}
              <div className="card-surface overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground"><DollarSign size={18} className="inline mr-1 text-primary" />GT2000 Price List</h3>
                  <p className="text-xs text-muted-foreground mt-1"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายเพื่อยืนยันราคา โทร. 095-739-1053 · Line: @entgroup</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                       <tr className="bg-secondary/50">
                         <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                         <th className="text-left p-3 font-semibold text-foreground">Configuration</th>
                         <th className="text-right p-3 font-semibold text-foreground">ราคา</th>
                         <th className="p-3 w-20"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                       {[
                         { cpu: "Celeron 1037U", config: "RAM DDR3L 4GB + SSD 128GB + WIFI", price: "16,990" },
                         { cpu: "Celeron 1037U", config: "RAM DDR3L 4GB + SSD 256GB + WIFI", price: "15,990" },
                         { cpu: "Celeron 1037U", config: "RAM DDR3L 8GB + SSD 128GB + WIFI", price: "15,990" },
                         { cpu: "Celeron 1037U", config: "RAM DDR3L 8GB + SSD 256GB + WIFI", price: "16,990" },
                         { cpu: "Core i5-3317U", config: "RAM DDR3L 4GB + SSD 128GB + WIFI", price: "18,990" },
                         { cpu: "Core i5-3317U", config: "RAM DDR3L 4GB + SSD 256GB + WIFI", price: "19,990" },
                         { cpu: "Core i5-3317U", config: "RAM DDR3L 4GB + SSD 512GB + WIFI", price: "21,990" },
                         { cpu: "Core i5-3317U", config: "RAM DDR3L 8GB + SSD 128GB + WIFI", price: "18,990" },
                       ].map((item, i) => {
                         const specLabel = `GT2000 ${item.cpu} ${item.config}`;
                         return (
                         <tr key={i} className="hover:bg-secondary/30 transition-colors">
                           <td className="p-3 text-foreground font-medium">{item.cpu}</td>
                           <td className="p-3 text-muted-foreground">{item.config}</td>
                           <td className="p-3 text-right font-bold text-primary">฿{item.price}</td>
                           <td className="p-3">
                             <div className="inline-flex items-center gap-1">
                               <AddToCartButton productModel="GT2000" productName={specLabel} iconOnly variant="outline" />
                               <QuoteRequestButton productModel="GT2000" productName={specLabel} iconOnly variant="outline" />
                               <ChatNowButton productModel="GT2000" productName={specLabel} />
                             </div>
                           </td>
                         </tr>
                         );
                       })}
                     </tbody>
                   </table>
                </div>
                <div className="p-4 border-t border-border text-center">
                </div>
              </div>

              {/* Podcast Section */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT2000 Introduction</h3>
                </div>
                <div className="p-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { file: "GT2000_Intro.wav", label: "GT2000 Introduction", desc: "แนะนำ GT2000 — Industrial PC ยอดนิยม 8 USB + 4 COM" },
                      { file: "GT2000_Detail.wav", label: "GT2000 Detail", desc: "รายละเอียดเชิงลึก GT2000 — สเปค การใช้งาน จุดเด่น" },
                    ].map((p) => (
                      <div key={p.file} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/40 border border-border">
                        <div className="shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground">{p.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                          <audio controls className="w-full mt-3 h-10" preload="metadata">
                            <source src={`/audio/${p.file}`} type="audio/wav" />
                            เบราว์เซอร์ของคุณไม่รองรับการเล่นเสียง
                          </audio>
                          <div className="mt-3">
                            <ShareButtons url={window.location.origin + "/gt-series?tab=gt2000"} title={`Podcast ${p.label} — ENT GROUP`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Section — YouTube */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎬 วิดีโอ GT2000</h3>
                </div>
                <div className="p-5 space-y-6">
                  {/* Intro Video — Hero */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-2">GT2000 Intro</h4>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                      <iframe
                        src="https://www.youtube.com/embed/XLhFAF_8Da4"

                        title="GT2000 Intro"

                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"></iframe>
                    </div>
                    <div className="mt-3">
                      <ShareButtons url="https://youtu.be/XLhFAF_8Da4" title="GT2000 Intro — ENT GROUP" />
                    </div>
                  </div>

                  {/* Other Videos — Grid */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-3">🎥 วิดีโอเพิ่มเติม</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { id: "uc0Qj3DcNuQ", title: "GT2000 รีวิวเจาะลึก" },
                        { id: "ifkzyVY9Z-g", title: "การเลือกซื้อ GT Series" },
                        { id: "Z4hTYAIDs2s", title: "GT2000 สาธิตการใช้งาน" },
                      ].map((video) => (
                        <div key={video.id} className="space-y-2">
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${video.id}`}
                              title={video.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full"></iframe>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground font-medium">{video.title}</p>
                            <ShareButtons url={`https://youtu.be/${video.id}`} title={`${video.title} — ENT GROUP`} compact />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* YouTube Channel CTA */}
                  <a
                    href="https://www.youtube.com/@ENTGROUP-TH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors group">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                      <Play className="text-white ml-0.5" size={18} fill="white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">ENT GROUP — YouTube Channel</p>
                      <p className="text-xs text-muted-foreground">กดติดตามเพื่อรับวิดีโอสินค้าใหม่ รีวิว และเทคนิคการใช้งาน</p>
                    </div>
                    <span className="shrink-0 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold group-hover:bg-red-700 transition-colors">
                      Subscribe
                    </span>
                  </a>
                </div>
              </div>

              {/* Datasheet CTA */}
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT2000_Celeron.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> Datasheet GT2000 Celeron
                </a>
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT2000_i5.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-surface-hover transition-colors">
                  <Download size={16} /> Datasheet GT2000 Core i5
                </a>
              </div>
            </div>
          )}

          {/* Tab: GT3000 Detail */}
          {activeTab === "gt3000" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img
                  src={gt3000Banner}
                  alt="GT3000 Industrial PC"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    6 COM · Multi CPU · Fanless
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">3000</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    6 COM หลากหลาย CPU — เลือกสเปกให้ตรงงาน
                  </p>
                </div>
              </div>

              {/* Description + Product Images */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      6 COM · Multi CPU · Fanless
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">3000</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Industrial Mini PC โครง Brushed Aluminum Alloy สีดำ ระบบ Fanless เงียบสนิท ทำงานต่อเนื่อง 24 ชม.
                      พร้อม <strong className="text-foreground">2× RS232 COM Port</strong> รองรับ mSATA SSD + 2.5" SATA HDD พร้อมกัน,
                      แสดงผล VGA + HDMI Dual Display, Built-in WiFi/Bluetooth พร้อมเสาอากาศคู่, ยึดผนังได้
                    </p>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-primary">
                    <h4 className="font-bold text-foreground mb-2"><Cpu size={16} className="inline mr-1 text-primary" />เลือก CPU ได้หลากหลายรุ่น</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      รองรับตั้งแต่ Celeron สำหรับงานเบา ไปจนถึง Core i3/i5/i7 สำหรับงานหนัก —
                      เลือก CPU ให้สอดคล้องกับกิจกรรมเพื่อเสถียรภาพสูงสุด
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Cpu, title: "CPU", desc: "Gen i3 / i5 / i7 / Celeron", sub: "หลากหลาย CPU ให้เลือก" },
                      { icon: Server, title: "RAM & Storage", desc: "DDR3L 4 GB", sub: "mSATA SSD + 2.5\" SATA HDD" },
                      { icon: Shield, title: "2 COM · 6 USB", desc: "RS232 × 2 + USB 6 ports", sub: "2 LAN Gigabit, VGA+HDMI" },
                      { icon: Wind, title: "Fanless 24/7", desc: "เงียบ 0 dB ไม่มีพัดลม", sub: "อลูมิเนียมระบายความร้อน" },
                      { icon: Monitor, title: "Dual Display", desc: "VGA + HDMI พร้อมกัน", sub: "MIC + SPK Audio" },
                      { icon: Zap, title: "Compact", desc: "15 × 21.7 × 5.2 cm", sub: "1.289 kg · Wall Mount" },
                    ].map((f) => (
                      <div key={f.title} className="card-surface p-4">
                        <f.icon className="text-primary mb-2" size={20} />
                        <div className="font-bold text-foreground text-sm">{f.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{f.desc}</div>
                        <div className="text-[11px] text-muted-foreground/70 mt-0.5">{f.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Use Cases */}
                  <div className="card-surface p-5">
                    <h4 className="font-bold text-foreground mb-3 text-sm">รองรับงานหลากหลาย</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Bank ATM", "Factory Automation", "Digital Signage", "Robot Control", "Transportation", "Telecom", "KIOSK", "PLC Control"].map((uc) => (
                        <span key={uc} className="px-3 py-1 rounded-full bg-secondary/50 text-muted-foreground text-xs border border-border">
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Images — ภาพจริงจากโรงงาน */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden rounded-xl bg-muted/30">
                    <img
                      src="/images/wezhan/5874079.jpg"
                      alt="GT3000 ด้านหน้า — USB3.0, LAN, VGA, HDMI, COM"
                      className="w-full object-contain p-2"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/wezhan/5874078.jpg", alt: "GT3000 ด้านหลัง — USB, COM ports" },
                      { src: "/images/wezhan/5874077.jpg", alt: "GT3000 ด้านข้าง — ครีบระบายความร้อน" },
                      { src: "/images/wezhan/5874075.jpg", alt: "GT3000 มุมบน — Heatsink" },
                      { src: "/images/wezhan/5874080.jpg", alt: "GT3000 ภายใน — Mainboard" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden rounded-lg bg-muted/30">
                        <img src={img.src} alt={img.alt} className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spec Table — 2 คอลัมน์ */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground">GT3000 Specifications</h3>
                  <p className="text-xs text-muted-foreground mt-1">ข้อมูลจาก Manufacturer</p>
                </div>
                <div className="grid md:grid-cols-2 md:divide-x divide-border">
                  {/* Left Column */}
                  <div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        <tr className="bg-secondary/40"><td colSpan={2} className="p-3 font-bold text-foreground text-xs tracking-widest uppercase">General</td></tr>
                        {[
                          { label: "CPU", value: "Gen i3 / i5 / i7 / Celeron" },
                          { label: "Chipset", value: "Intel SOC" },
                          { label: "Memory", value: "1× SO-DIMM DDR3L, 4–8GB" },
                          { label: "Storage", value: "mSATA SSD + 2.5\" SATA HDD" },
                        ].map((s) => (
                          <tr key={s.label} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-2.5 pl-3 font-semibold text-foreground w-[110px] text-xs">{s.label}</td>
                            <td className="p-2.5 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                        <tr className="bg-secondary/40"><td colSpan={2} className="p-3 font-bold text-foreground text-xs tracking-widest uppercase">I/O Ports</td></tr>
                        {[
                          { label: "COM", value: "2× RS232 (DB9)" },
                          { label: "USB", value: "2× USB 3.0 + 4× USB 2.0" },
                          { label: "LAN", value: "2× Gigabit Ethernet" },
                          { label: "Display", value: "VGA + HDMI Dual Display" },
                          { label: "Audio", value: "MIC + SPK (3.5mm)" },
                          { label: "WiFi/BT", value: "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม" },
                        ].map((s) => (
                          <tr key={s.label} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-2.5 pl-3 font-semibold text-foreground w-[110px] text-xs">{s.label}</td>
                            <td className="p-2.5 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Right Column */}
                  <div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        <tr className="bg-secondary/40"><td colSpan={2} className="p-3 font-bold text-foreground text-xs tracking-widest uppercase">Power & Environment</td></tr>
                        {[
                          { label: "Power", value: "DC 12V" },
                          { label: "Cooling", value: "Fanless Aluminum Heatsink" },
                          { label: "Temp", value: "0°C ~ 60°C" },
                          { label: "Mounting", value: "Wall Mount (Screws)" },
                        ].map((s) => (
                          <tr key={s.label} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-2.5 pl-3 font-semibold text-foreground w-[110px] text-xs">{s.label}</td>
                            <td className="p-2.5 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                        <tr className="bg-secondary/40"><td colSpan={2} className="p-3 font-bold text-foreground text-xs tracking-widest uppercase">Dimension</td></tr>
                        {[
                          { label: "Size", value: "150 × 217 × 52 mm" },
                          { label: "Weight", value: "1.289 kg" },
                          { label: "OS", value: "Win 7 / 8 / 10 / Linux" },
                        ].map((s) => (
                          <tr key={s.label} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-2.5 pl-3 font-semibold text-foreground w-[110px] text-xs">{s.label}</td>
                            <td className="p-2.5 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Port Diagrams */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <img
                    src={gt3000CpuOptions}
                    alt="GT3000 CPU Options — Celeron, Core i3, i5, i7"
                    className="w-full rounded-lg"/>
                </div>
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <img
                    src="/images/wix/3e5003_fadd401364de4b7d9e31669c96695798_a2019e77.jpg"
                    alt="GT3000 Connectivity"
                    className="w-full rounded-lg"/>
                </div>
              </div>

              {/* Heatsink Design */}
              <div className="card-surface p-6 md:p-8 rounded-2xl">
                <h4 className="text-xl font-display font-bold text-foreground mb-4">
                  <ThermometerSun size={18} className="inline mr-1 text-primary" />Heatsink = ตัวเครื่อง — ออกแบบมาเพื่อโรงงาน
                </h4>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      GT3000 รองรับการทำงานในสภาพแวดล้อมที่คอมพิวเตอร์ทั่วไปไม่สามารถทำงานได้
                      เนื่องจากตัวเครื่องได้รับการออกแบบให้มีความทนทานเป็นพิเศษ มีครีบระบายความร้อนและไม่มีพัดลม
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2"><span className="text-primary font-bold">✓</span> ป้องกันฝุ่นละออง สารเคมี แมลง เข้าสู่ตัวเครื่อง</li>
                      <li className="flex items-start gap-2"><span className="text-primary font-bold">✓</span> Heatsink คือตัวเครื่อง — ระบายความร้อนจากทุกพื้นผิว</li>
                      <li className="flex items-start gap-2"><span className="text-primary font-bold">✓</span> ไม่มีชิ้นส่วนเคลื่อนไหว = เสถียรสูง ทำงาน 24/7</li>
                      <li className="flex items-start gap-2"><span className="text-primary font-bold">✓</span> ทนอุณหภูมิ 0-60°C อย่างต่อเนื่อง</li>
                    </ul>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-muted/30">
                    <img
                      src="/images/wezhan/5874076.jpg"
                      alt="GT3000 Heatsink Side View"
                      className="w-full"/>
                  </div>
                </div>
              </div>

              {/* Real-world Photos */}
              <div>
                <h3 className="text-lg font-display font-bold text-foreground mb-4">ภาพการติดตั้งจริง</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "/images/wix/005637_e654106986614352bf4e71dcddee89f6_c57ab580.jpg",
                    "/images/wix/005637_df6c79b56ee140a58a0eac288558f5b8_29f99a33.jpg",
                    "/images/wix/005637_1174e23efc0b4aa6953f47d889694eca_3bb1b5fe.jpg",
                    "/images/wix/005637_60e2fe696a194526af7db7f90b6ac4bd_a0b45c95.jpg",
                  ].map((img, i) => (
                    <div key={i} className="card-surface overflow-hidden aspect-square rounded-xl">
                      <img src={img} alt={`GT3000 ติดตั้งจริง ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Podcast Section */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT3000</h3>
                </div>
                <div className="p-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                      <p className="text-sm font-bold text-foreground">GT3000 Introduction</p>
                      <p className="text-xs text-muted-foreground mt-0.5">แนะนำ GT3000 — Industrial Mini PC 6 COM</p>
                      <audio controls className="w-full mt-3 h-10" preload="metadata">
                        <source src="/audio/GT3000_Intro.wav" type="audio/wav" />
                      </audio>
                      <div className="mt-2">
                        <ShareButtons url={window.location.origin + "/gt-series?tab=gt3000"} title="GT3000 Podcast Intro — ENT GROUP" compact />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                      <p className="text-sm font-bold text-foreground">GT3000 News Talk</p>
                      <p className="text-xs text-muted-foreground mt-0.5">พูดคุยข่าวสารและอัปเดต GT3000</p>
                      <audio controls className="w-full mt-3 h-10" preload="metadata">
                        <source src="/audio/GT3000_News_talk.wav" type="audio/wav" />
                      </audio>
                      <div className="mt-2">
                        <ShareButtons url={window.location.origin + "/gt-series?tab=gt3000"} title="GT3000 News Talk Podcast — ENT GROUP" compact />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Section — YouTube */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎬 วิดีโอ GT3000</h3>
                </div>
                <div className="p-5 space-y-6">
                  {/* Intro Video — Hero */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-2">GT3000 Intro</h4>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                      <iframe
                        src="https://www.youtube.com/embed/31SEStppvKw"

                        title="GT3000 Intro"

                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"></iframe>
                    </div>
                    <div className="mt-3">
                      <ShareButtons url="https://youtu.be/31SEStppvKw" title="GT3000 Intro — ENT GROUP" />
                    </div>
                  </div>

                  {/* Other Videos — Grid */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-3">🎥 วิดีโอเพิ่มเติม</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { id: "aQ5z_JJzALo", title: "GT3000 รีวิวเจาะลึก" },
                        { id: "FV7oo7GHp9Q", title: "GT3000 สาธิตการใช้งาน" },
                        { id: "ifkzyVY9Z-g", title: "การเลือกซื้อ GT Series" },
                      ].map((video) => (
                        <div key={video.id} className="space-y-2">
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${video.id}`}
                              title={video.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full"></iframe>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground font-medium">{video.title}</p>
                            <ShareButtons url={`https://youtu.be/${video.id}`} title={`${video.title} — ENT GROUP`} compact />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* YouTube Channel CTA */}
                  <a
                    href="https://www.youtube.com/@ENTGROUP-TH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors group">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                      <Play className="text-white ml-0.5" size={18} fill="white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">ENT GROUP — YouTube Channel</p>
                      <p className="text-xs text-muted-foreground">กดติดตามเพื่อรับวิดีโอสินค้าใหม่ รีวิว และเทคนิคการใช้งาน</p>
                    </div>
                    <span className="shrink-0 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold group-hover:bg-red-700 transition-colors">
                      Subscribe
                    </span>
                  </a>
                </div>
              </div>

              {/* Price List */}
              {(() => {
                const gt3000Prices = [
                  { model: "2955U", config: "Celeron 2955U DDR3L 4GB/SSD128GB/WIFI", price: "฿11,990" },
                  { model: "", config: "Celeron 2955U DDR3L 8GB/SSD128GB/WIFI", price: "฿12,290" },
                  { model: "i5-4200U", config: "i5-4200U RAM DDR3L 4GB/SSD128GB/WIFI", price: "฿17,790" },
                  { model: "", config: "i5-4200U RAM DDR3L 8GB/SSD128GB/WIFI", price: "฿18,090" },
                  { model: "i3-7110U", config: "i3-7110U RAM DDR4 4GB/SSD128GB/WIFI", price: "฿15,090" },
                  { model: "", config: "i3-7110U RAM DDR4 8GB/SSD128GB/WIFI", price: "฿15,490" },
                  { model: "i3-8140U", config: "i3-8140U RAM DDR4 4GB/SSD128GB/WIFI", price: "฿17,190" },
                  { model: "", config: "i3-8140U RAM DDR4 8GB/SSD128GB/WIFI", price: "฿17,790" },
                  { model: "i5-8260U", config: "i5-8260U RAM DDR4 4GB/SSD128GB/WIFI", price: "฿19,590" },
                  { model: "", config: "i5-8260U RAM DDR4 8GB/SSD128GB/WIFI", price: "฿19,990" },
                  { model: "i5-1235U", config: "i5-1235U RAM DDR4 8GB/SSD256GB/WIFI", price: "฿26,900" },
                  { model: "", config: "i5-1235U RAM DDR4 16GB/SSD256GB/WIFI", price: "฿28,900" },
                  { model: "i5-1335U", config: "i5-1335U RAM DDR4 8GB/SSD256GB/WIFI", price: "฿28,900" },
                  { model: "", config: "i5-1335U RAM DDR4 16GB/SSD256GB/WIFI", price: "฿30,900" },
                  { model: "i7-1260P", config: "i7-1260P RAM DDR4 8GB/SSD256GB/WIFI", price: "฿32,900" },
                  { model: "", config: "i7-1260P RAM DDR4 16GB/SSD256GB/WIFI", price: "฿34,900" },
                  { model: "i7-1355U", config: "i7-1355U RAM DDR4 8GB/SSD256GB/WIFI", price: "฿34,900" },
                  { model: "", config: "i7-1355U RAM DDR4 16GB/SSD256GB/WIFI", price: "฿36,900" },
                ];
                const perPage = 9;
                const totalPages = Math.ceil(gt3000Prices.length / perPage);
                const pageItems = gt3000Prices.slice(gt3000PricePage * perPage, (gt3000PricePage + 1) * perPage);

                return (
                  <div className="card-surface rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-border bg-primary/5">
                      <h3 className="text-lg font-display font-bold text-foreground"><DollarSign size={18} className="inline mr-1 text-primary" />GT3000 Industrial PC Price List</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                           <tr className="border-b border-border bg-muted/30">
                             <th className="text-left p-3 font-bold text-foreground">Model</th>
                             <th className="text-left p-3 font-bold text-foreground">Configuration</th>
                             <th className="text-right p-3 font-bold text-foreground">Price List</th>
                             <th className="p-3 w-20"></th>
                           </tr>
                         </thead>
                         <tbody>
                           {pageItems.map((row, i) => {
                             const specLabel = `GT3000 ${row.model} ${row.config}`.trim();
                             return (
                             <tr key={i} className={`border-b border-border/50 ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                               <td className="p-3 font-bold text-foreground">{row.model}</td>
                               <td className="p-3 text-muted-foreground">{row.config}</td>
                               <td className="p-3 text-right font-bold text-primary">{row.price}</td>
                               <td className="p-3">
                                 <div className="inline-flex items-center gap-1">
                                   <AddToCartButton productModel="GT3000" productName={specLabel} iconOnly variant="outline" />
                                   <QuoteRequestButton productModel="GT3000" productName={specLabel} iconOnly variant="outline" />
                                   <ChatNowButton productModel="GT3000" productName={specLabel} />
                                 </div>
                               </td>
                             </tr>
                             );
                           })}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        หน้า {gt3000PricePage + 1} / {totalPages}
                      </span>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, p) => (
                          <button
                            key={p}
                            onClick={() => setGt3000PricePage(p)}
                            className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                              p === gt3000PricePage
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                            }`}>
                            {p + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 text-xs text-muted-foreground bg-muted/10 border-t border-border">
                      <AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายโดยตรงเพื่อยืนยันราคาที่ถูกต้อง โทร. 095-739-1053 · Line: @entgroup
                    </div>
                    <div className="p-4 border-t border-border text-center">
                    </div>
                  </div>
                );
              })()}

              {/* Use Cases */}
              {useCasesGrid}

              {/* Datasheet CTA */}
              <div className="text-center">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT3000.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> ดาวน์โหลด Datasheet GT3000
                </a>
              </div>
            </div>
          )}

          {/* Tab: GT4000 Detail */}
          {activeTab === "gt4000" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img src={gt4000Banner} alt="GT4000 Industrial PC" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    6 COM · 8 USB · GPIO · VESA Mount
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">4000</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    GPIO พร้อมใช้ VESA Mount — ควบคุมระบบอัตโนมัติ
                  </p>
                </div>
              </div>

              {/* Description + Product Images */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      6 COM · 8 USB · GPIO · VESA
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">4000</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Industrial Mini PC โครง Brushed Aluminum Alloy สีดำ ระบบ Fanless เงียบสนิท ทำงานต่อเนื่อง 24 ชม.
                      พร้อม <strong className="text-foreground">6× RS232 COM + 8× USB + GPIO + SIM 4G</strong>,
                      VGA + HDMI Dual Display, Built-in WiFi/Bluetooth เสาอากาศคู่, VESA Mount / Wall Mount
                    </p>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-primary">
                    <h4 className="font-bold text-foreground mb-2"><Factory size={16} className="inline mr-1 text-primary" />ออกแบบมาเพื่อโรงงานโดยเฉพาะ</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      ทนทานต่อสภาพแวดล้อมที่เต็มไปด้วยน้ำมัน ฝุ่นละออง และความร้อน รองรับ VESA Mounting
                      บนรถกอล์ฟ โฟคลิฟท์ หรือตู้คอนเทนเนอร์ — สมบูรณ์แบบสำหรับขยายไลน์ผลิต
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Cpu, title: "CPU", desc: "Intel Core i3 / i5-4200U / i7-4500U", sub: "Haswell Gen 4, TDP 15W" },
                      { icon: Server, title: "RAM & Storage", desc: "DDR3L 4–8 GB", sub: "mSATA SSD + 2.5\" SATA HDD" },
                      { icon: Shield, title: "6 COM · 8 USB · GPIO", desc: "RS232×6 + USB 3.0×2 + USB 2.0×6", sub: "2 LAN Gigabit + SIM 4G" },
                      { icon: Wind, title: "Fanless + VESA", desc: "เงียบ 0 dB ติดตั้งได้ทุกที่", sub: "อลูมิเนียมระบายความร้อน" },
                      { icon: Monitor, title: "Dual Display", desc: "VGA + HDMI พร้อมกัน", sub: "MIC + SPK Audio" },
                      { icon: Zap, title: "Compact", desc: "17.7 × 21.7 × 5.2 cm", sub: "1.516 kg · Wall/VESA Mount" },
                    ].map((f) => (
                      <div key={f.title} className="card-surface p-4">
                        <f.icon className="text-primary mb-2" size={20} />
                        <div className="font-bold text-foreground text-sm">{f.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{f.desc}</div>
                        <div className="text-[11px] text-muted-foreground/70 mt-0.5">{f.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Use Cases */}
                  <div className="card-surface p-5">
                    <h4 className="font-bold text-foreground mb-3 text-sm">รองรับงานหลากหลาย</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Scada", "IOT", "Factory Automation", "KIOSK", "Control Cabinet", "ระบบเครื่องชั่ง", "ควบคุมเครื่องจักร", "Bank ATM"].map((uc) => (
                        <span key={uc} className="px-3 py-1 rounded-full bg-secondary/50 text-muted-foreground text-xs border border-border">
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Images — ภาพจริงจากโรงงาน */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden rounded-xl bg-muted/30">
                    <img
                      src="/images/gt4000/front.jpg"
                      alt="GT4000 ด้านหน้า — 6 COM, USB, LAN, VGA, HDMI"
                      className="w-full object-contain p-2"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/gt4000/rear.jpg", alt: "GT4000 ด้านหลัง — USB, COM ports" },
                      { src: "/images/gt4000/side.jpg", alt: "GT4000 ด้านข้าง — ครีบระบายความร้อน" },
                      { src: "/images/gt4000/angle.jpg", alt: "GT4000 มุมเอียง — ภาพรวม" },
                      { src: "/images/gt4000/mainboard.jpg", alt: "GT4000 ภายใน — Mainboard" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden rounded-lg bg-muted/30">
                        <img src={img.src} alt={img.alt} className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spec Table — 2 คอลัมน์ */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground">GT4000 Specifications</h3>
                  <p className="text-xs text-muted-foreground mt-1">ข้อมูลจาก Manufacturer</p>
                </div>
                <div className="grid md:grid-cols-2 md:divide-x divide-border">
                  <div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        <tr className="bg-secondary/40"><td colSpan={2} className="p-3 font-bold text-foreground text-xs tracking-widest uppercase">General</td></tr>
                        {[
                          { label: "CPU", value: "i3 / i5-4200U / i7-4500U" },
                          { label: "Chipset", value: "Intel Haswell SoC" },
                          { label: "Memory", value: "1× SO-DIMM DDR3L, 4–8GB" },
                          { label: "Storage", value: "mSATA SSD + 2.5\" SATA HDD" },
                        ].map((s) => (
                          <tr key={s.label} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-2.5 pl-3 font-semibold text-foreground w-[110px] text-xs">{s.label}</td>
                            <td className="p-2.5 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                        <tr className="bg-secondary/40"><td colSpan={2} className="p-3 font-bold text-foreground text-xs tracking-widest uppercase">I/O Ports</td></tr>
                        {[
                          { label: "COM", value: "6× RS232 (DB9)" },
                          { label: "USB", value: "2× USB 3.0 + 6× USB 2.0" },
                          { label: "LAN", value: "2× Gigabit Ethernet" },
                          { label: "Display", value: "VGA + HDMI Dual Display" },
                          { label: "Audio", value: "MIC + SPK (3.5mm)" },
                          { label: "GPIO", value: "GPIO Header พร้อมใช้" },
                          { label: "SIM", value: "SIM Slot รองรับ 3G/4G" },
                        ].map((s) => (
                          <tr key={s.label} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-2.5 pl-3 font-semibold text-foreground w-[110px] text-xs">{s.label}</td>
                            <td className="p-2.5 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        <tr className="bg-secondary/40"><td colSpan={2} className="p-3 font-bold text-foreground text-xs tracking-widest uppercase">Power & Environment</td></tr>
                        {[
                          { label: "Power", value: "DC 12V / 5A" },
                          { label: "Cooling", value: "Fanless Aluminum Heatsink" },
                          { label: "Temp", value: "0°C ~ 60°C" },
                          { label: "WiFi/BT", value: "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม" },
                          { label: "Mounting", value: "VESA 100×100 / Wall Mount" },
                        ].map((s) => (
                          <tr key={s.label} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-2.5 pl-3 font-semibold text-foreground w-[110px] text-xs">{s.label}</td>
                            <td className="p-2.5 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                        <tr className="bg-secondary/40"><td colSpan={2} className="p-3 font-bold text-foreground text-xs tracking-widest uppercase">Dimension</td></tr>
                        {[
                          { label: "Size", value: "177 × 217 × 52 mm" },
                          { label: "Weight", value: "1.516 kg" },
                          { label: "OS", value: "Win 7 / 8 / 10 / Linux" },
                        ].map((s) => (
                          <tr key={s.label} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-2.5 pl-3 font-semibold text-foreground w-[110px] text-xs">{s.label}</td>
                            <td className="p-2.5 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Port Diagrams */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <img
                    src="/images/wix/3e5003_a4726520b0df4492b73e8646990df9ce_c6843bc4.jpg"
                    alt="GT4000 Port Overview"
                    className="w-full rounded-lg"/>
                </div>
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <img
                    src="/images/wix/3e5003_91111c3b2ffb41c39bb2978c36ccd01c_4c9424b9.jpg"
                    alt="GT4000 Port Detail"
                    className="w-full rounded-lg"/>
                </div>
              </div>

              {/* GT4000 Price Table */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground">GT4000 Price List</h3>
                  <p className="text-xs text-muted-foreground mt-1"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายเพื่อยืนยันราคา โทร. 095-739-1053 · Line: @entgroup</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                       <tr className="bg-secondary/50">
                         <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                         <th className="text-left p-3 font-semibold text-foreground">RAM</th>
                         <th className="text-left p-3 font-semibold text-foreground">SSD</th>
                         <th className="text-right p-3 font-semibold text-foreground">ราคา</th>
                         <th className="p-3 w-20"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                       {[
                         { cpu: "Core i5-4200U", ram: "4GB", ssd: "128GB", price: "24,990" },
                         { cpu: "Core i5-4200U", ram: "4GB", ssd: "256GB", price: "25,990" },
                         { cpu: "Core i5-4200U", ram: "8GB", ssd: "128GB", price: "26,990" },
                         { cpu: "Core i5-4200U", ram: "8GB", ssd: "256GB", price: "27,990" },
                         { cpu: "Core i7-4500U", ram: "4GB", ssd: "128GB", price: "28,990" },
                         { cpu: "Core i7-4500U", ram: "4GB", ssd: "256GB", price: "29,990" },
                         { cpu: "Core i7-4500U", ram: "8GB", ssd: "128GB", price: "30,990" },
                         { cpu: "Core i7-4500U", ram: "8GB", ssd: "256GB", price: "31,990" },
                       ].map((item, i) => {
                         const specLabel = `GT4000 ${item.cpu} / ${item.ram} / ${item.ssd}`;
                         return (
                         <tr key={i} className="hover:bg-secondary/30 transition-colors">
                           <td className="p-3 text-foreground font-medium font-mono">{item.cpu}</td>
                           <td className="p-3 text-muted-foreground">{item.ram}</td>
                           <td className="p-3 text-muted-foreground">{item.ssd}</td>
                           <td className="p-3 text-right font-bold text-primary whitespace-nowrap">฿{item.price}</td>
                           <td className="p-3">
                             <div className="inline-flex items-center gap-1">
                               <AddToCartButton productModel="GT4000" productName={specLabel} iconOnly variant="outline" />
                               <QuoteRequestButton productModel="GT4000" productName={specLabel} iconOnly variant="outline" />
                               <ChatNowButton productModel="GT4000" productName={specLabel} />
                             </div>
                           </td>
                         </tr>
                         );
                       })}
                     </tbody>
                   </table>
                </div>
                <div className="p-4 border-t border-border text-center">
                </div>
              </div>

              {/* Real-world Photos */}
              <div>
                <h3 className="text-lg font-display font-bold text-foreground mb-4">ภาพการติดตั้งจริง</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    "/images/wix/0597a3_4ac1380d49e3423594426528de05c9e6_2e5889bb.jpg",
                    "/images/wix/0597a3_d40df020f64b4972bea62c0df74acb6f_2ec36557.jpg",
                    "/images/wix/3e5003_b5289681b81a4e0dbb4e6bd6e3668f69_e45727bb.jpg",
                  ].map((img, i) => (
                    <div key={i} className="card-surface overflow-hidden rounded-xl aspect-video">
                      <img src={img} alt={`GT4000 ติดตั้งจริง ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Section */}
              {useCasesGrid}

              {/* Intro Video */}
              <div className="card-surface overflow-hidden rounded-xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">วิดีโอ GT4000</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/o221BRlwyFc"

                    title="GT4000 Intro"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"></iframe>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">GT4000 Introduction</span>
                  <ShareButtons url="https://youtu.be/o221BRlwyFc" title="GT4000 Introduction" compact />
                </div>
              </div>

              {/* More Videos */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "s4GaMFaS-NY", label: "GT4000 รายละเอียด" },
                  { id: "7wE6fxMpJB4", label: "ภาพรวม GT Series" },
                  { id: "ztwNgf60xvM", label: "GT Series เพิ่มเติม" },
                ].map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden rounded-xl">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"></iframe>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{v.label}</span>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.label} compact />
                    </div>
                  </div>
                ))}
              </div>

              {/* Podcast */}
              <div className="card-surface rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT4000</h3>
                </div>
                <div className="grid md:grid-cols-1 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                    <p className="text-sm font-bold text-foreground mb-1">GT4000 Introduction</p>
                    <audio controls className="w-full mt-2 h-10" preload="metadata">
                      <source src="/audio/GT4000_Intro.wav" type="audio/wav" />
                    </audio>
                    <div className="mt-2">
                      <ShareButtons url={`${window.location.origin}/gt-series?tab=gt4000`} title="Podcast GT4000 Intro" compact />
                    </div>
                  </div>
                </div>
              </div>

              {/* Datasheet CTA */}
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT4000_i5.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> Datasheet GT4000 Core i5
                </a>
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT4000_i7.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary/50 transition-colors">
                  <Download size={16} /> Datasheet GT4000 Core i7
                </a>
              </div>
            </div>
          )}

          {/* Tab: GT5000 Detail */}
          {activeTab === "gt5000" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img
                  src={gt5000Banner}
                  alt="GT5000 Industrial PC"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    GPIO · SIM Slot · IoT Ready
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">5000</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    GPIO + SIM IoT Ready — เชื่อมต่อทุกที่ ไร้ขีดจำกัด
                  </p>
                </div>
              </div>

              {/* Description + Product Image */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      GPIO · SIM Slot · RS485/RS422 · IoT Ready
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">5000</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Industrial PC คือเครื่องคอมพิวเตอร์เกรดอุตสาหกรรมขนาดเล็ก ที่ถูกออกแบบมาเพื่อรองรับการทำงาน
                      ในสภาวะแวดล้อมที่มีอุณหภูมิสูง ฝุ่นละอองหนาแน่น โดยออกแบบให้มีการระบายความร้อนได้ดีและทนความร้อนได้สูง
                      จึงเป็นเหตุผลที่ทำให้ GT5000 ทำงานได้อย่างมีประสิทธิภาพเหมาะสมกับงานอุตสาหกรรมทุกประเภท
                    </p>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-primary">
                    <h4 className="font-bold text-foreground mb-2"><Radio size={16} className="inline mr-1 text-primary" />GPIO + SIM + RS485/RS422 — IoT Ready</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      GT5000 มีพอร์ต GPIO และ RS232 × 6 ช่อง พิเศษยิ่งกว่านั้น COM1 + COM2 สามารถตั้งค่าเป็น RS485/RS422 ได้
                      พร้อมช่อง Micro SIM with PUSH function สำหรับเชื่อมต่อ 4G/5G ทำให้พร้อมสำหรับงาน IoT ทันที
                    </p>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-secondary">
                    <h4 className="font-bold text-foreground mb-2"><Zap size={16} className="inline mr-1 text-primary" />GPIO คืออะไร?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      GPIO (General Purpose Input/Output) คือพอร์ตเอนกประสงค์ที่สามารถควบคุมให้เป็น "1" หรือ "0" ได้ตามใจชอบ
                      โดยควบคุมแต่ละ PIN เหมือนไมโครคอนโทรลเลอร์ นำไปต่อยอดได้หลากหลาย เช่น ควบคุมการเปิด/ปิดอุปกรณ์
                      ต่อกับจอ LCD, relay, sensor โดยตรง
                    </p>
                  </div>

                  {/* Key Specs Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-surface p-4 text-center">
                      <Cpu className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">CPU</div>
                      <div className="text-xs text-muted-foreground mt-1">Intel Core i5-4200U / i7-4500U</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Server className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">RAM & Storage</div>
                      <div className="text-xs text-muted-foreground mt-1">DDR3L 4–8 GB / SSD 128 GB – 1 TB</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Shield className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">6 COM + GPIO + SIM</div>
                      <div className="text-xs text-muted-foreground mt-1">RS232/RS485/RS422, Micro SIM</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Wind className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">Fanless 24/7</div>
                      <div className="text-xs text-muted-foreground mt-1">เงียบ 0 dB ทนอุณหภูมิ 0-60°C</div>
                    </div>
                  </div>
                </div>

                {/* Product Images — Factory */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden rounded-xl bg-muted/30">
                    <img
                      src="/images/gt5000/main.jpg"
                      alt="GT5000 ภาพหลัก — ด้านหน้า"
                      className="w-full object-contain p-2"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/gt5000/front.jpg", alt: "GT5000 ด้านหน้า — พอร์ต COM, USB" },
                      { src: "/images/gt5000/rear.jpg", alt: "GT5000 ด้านหลัง — LAN, HDMI, VGA" },
                      { src: "/images/gt5000/side.jpg", alt: "GT5000 ด้านข้าง — ครีบระบายความร้อน" },
                      { src: "/images/gt5000/angle.jpg", alt: "GT5000 มุมเอียง — ภาพรวม" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden rounded-lg bg-muted/30">
                        <img src={img.src} alt={img.alt} className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Factory Gallery — Internal & Bottom */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { src: "/images/gt5000/internal.jpg", alt: "GT5000 ภายใน — Mainboard" },
                  { src: "/images/gt5000/bottom.jpg", alt: "GT5000 ด้านล่าง — VESA Mount" },
                  { src: "/images/gt5000/spec.jpg", alt: "GT5000 Spec Overview" },
                ].map((img, i) => (
                  <div key={i} className="card-surface overflow-hidden rounded-lg bg-muted/30">
                    <img src={img.src} alt={img.alt} className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                  </div>
                ))}
              </div>


              {/* GT5000 Specifications */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card-surface rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-border bg-primary/5">
                    <h3 className="text-lg font-display font-bold text-foreground"><FileText size={18} className="inline mr-1 text-primary" />GT5000 Specifications</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {[
                          { label: "CPU", value: "Intel Core i5-4200U (1.6–2.6GHz, 2C/4T)\nIntel Core i7-4500U (1.8–3.0GHz, 2C/4T)" },
                          { label: "TDP", value: "17W" },
                          { label: "Chipset", value: "Intel Haswell" },
                          { label: "BIOS", value: "AMI 5.6.5" },
                          { label: "Memory", value: "1× SO-DIMM DDR3L, 2/4/8GB\nDDR3-L/-RS 1333/1600" },
                          { label: "OS", value: "Windows 7/8/10/Linux" },
                          { label: "Audio", value: "ALC662 HD Audio\n(Line-in, Line-out, Mic-in)" },
                          { label: "Network", value: "Intel i211 Gigabit LAN\n10/100/1000 Mbps Base-T" },
                          { label: "Video", value: "Intel HD Graphics 4400" },
                          { label: "M-SATA", value: "1× M-SATA3.0 SSD\n6Gb/s, 8–1TB (Optional)" },
                          { label: "SATA", value: "1× SATA3.0 HDD/SSD\n6Gb/s, 320G–2TB (Optional)" },
                          { label: "WiFi/BT", value: "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม" },
                          { label: "COM", value: "6× RS232 (3 line)\nCOM1/COM2 → RS485/RS422" },
                          { label: "USB", value: "4× USB2.0 + 4× USB3.0" },
                          { label: "Display", value: "1× VGA + 1× HDMI" },
                          { label: "GPIO", value: "1× GPIO" },
                          { label: "LAN", value: "2× RJ45 Gigabit LAN" },
                          { label: "4G Module", value: "1× mini PCIe-full (USB bus)\nสำหรับ 4G Module" },
                          { label: "SIM", value: "1× Micro SIM (PUSH)" },
                          { label: "Audio I/O", value: "1× MIC + 1× SPK" },
                        ].map((s, i) => (
                          <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : ""}>

                            <td className="p-3 font-bold text-foreground w-1/3 align-top">{s.label}</td>
                            <td className="p-3 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card-surface rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-border bg-primary/5">
                    <h3 className="text-lg font-display font-bold text-foreground"><Zap size={18} className="inline mr-1 text-primary" />Power & Dimensions</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {[
                          { label: "Power Input", value: "DC 100–240V AC / 50–60Hz" },
                          { label: "Power Output", value: "12V-3A-5A" },
                          { label: "Operating Temp", value: "0 ~ +60°C" },
                          { label: "Storage Temp", value: "-20 ~ +70°C" },
                          { label: "Humidity", value: "0–90% (non-condensing)" },
                          { label: "Functions", value: "Auto Power On\nWake-On-LAN\nPXE Boot" },
                          { label: "Dimensions", value: "230 × 175 × 50 mm" },
                          { label: "Weight", value: "Net 1.8 kg / Gross 2.5 kg" },
                          { label: "Shell", value: "Aluminum Alloy — Black" },
                          { label: "Cooling", value: "Fanless (Passive)" },
                          { label: "Switch", value: "1× Power On/Off" },
                          { label: "Package", value: "1× Mini PC\n1× Power Adapter\n1× Power Cord\n1× Screws Bag" },
                        ].map((s, i) => (
                          <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : ""}>

                            <td className="p-3 font-bold text-foreground w-1/3 align-top">{s.label}</td>
                            <td className="p-3 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>


              {/* ═══════ GT5000 GPIO Deep Dive ═══════ */}
              <div className="space-y-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-12">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(56,189,148,0.15) 20px, rgba(56,189,148,0.15) 21px)" }} />
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-widest mb-6">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      INDUSTRIAL GRADE — LINUX READY
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-display font-black text-white leading-tight">
                      8-Channel GPIO<br />
                      <span className="text-emerald-400">Fully Programmable</span><br />
                      I/O Control
                    </h3>
                    <p className="mt-4 text-slate-300 max-w-xl leading-relaxed">
                      เข้าถึงฮาร์ดแวร์โดยตรงผ่าน I/O Port Register —
                      ควบคุม Output แบบ High/Low และอ่าน Input แบบ Real-time
                      ออกแบบมาสำหรับ Embedded Linux ที่ต้องการ Zero-latency Response
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                      <a href="#gpio-register-map" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-colors">
                        <FileText size={16} /> ดู Register Map
                      </a>
                      <a href="#gpio-code" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-500 text-slate-200 text-sm font-bold hover:bg-slate-700 transition-colors">
                        <Code size={16} /> ดูตัวอย่าง Code
                      </a>
                    </div>
                  </div>
                </div>

                {/* GPIO Use Cases */}
                <div className="card-surface rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-border bg-primary/5">
                    <h3 className="text-lg font-display font-bold text-foreground"><Plug size={18} className="inline mr-1 text-primary" />GPIO นำไปใช้ทำอะไรได้บ้าง?</h3>
                    <p className="text-xs text-muted-foreground mt-1">8 ช่องสัญญาณ Digital I/O สำหรับงานอุตสาหกรรมและ IoT</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                    {[
                      { icon: Factory, title: "ควบคุมเครื่องจักร", desc: "สั่งเปิด/ปิด Relay, Solenoid Valve, Motor Driver ผ่าน Digital Output โดยตรง" },
                      { icon: AlertTriangle, title: "ระบบแจ้งเตือน", desc: "ต่อ Tower Light, Buzzer, LED Indicator แสดงสถานะเครื่องจักรแบบ Real-time" },
                      { icon: Radio, title: "อ่านค่า Sensor", desc: "รับสัญญาณ Digital จาก Proximity Sensor, Limit Switch, Photo Electric" },
                      { icon: Shield, title: "Access Control", desc: "ควบคุม Magnetic Lock, อ่าน Door Sensor, Emergency Button" },
                      { icon: ThermometerSun, title: "Smart Farm / IoT", desc: "เปิด/ปิดปั๊มน้ำ พัดลม ระบบรดน้ำอัตโนมัติ ตามค่า Sensor" },
                      { icon: BarChart3, title: "Production Counter", desc: "นับจำนวนชิ้นงานจาก Sensor แล้วส่งข้อมูลเข้าระบบ MES/ERP" },
                      { icon: Battery, title: "UPS / Power Monitor", desc: "ตรวจจับสถานะไฟฟ้า สั่ง Shutdown อัตโนมัติเมื่อไฟดับ" },
                      { icon: Bot, title: "Robot & Automation", desc: "Handshake กับ PLC, Robot Controller ผ่าน Digital I/O ไม่ต้องใช้ fieldbus ราคาแพง" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50">
                        {typeof item.icon === "string" ? <span className="text-2xl">{item.icon}</span> : <item.icon size={24} className="text-primary" />}

                        <h4 className="font-bold text-foreground text-sm mt-2">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Register Map Table */}
                <div id="gpio-register-map" className="card-surface rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-border bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-display font-bold text-foreground"><FileText size={18} className="inline mr-1 text-primary" />GPIO Register Map</h3>
                        <p className="text-xs text-muted-foreground mt-1">INDUSTRIAL IPC — LINUX EDITION</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-display font-black text-foreground">8</span>
                        <span className="text-xs text-muted-foreground block">CHANNELS</span>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-secondary/50">
                          <th className="text-left p-3 font-mono font-semibold text-foreground">CHANNEL</th>
                          <th className="text-left p-3 font-mono font-semibold text-foreground">REGISTER</th>
                          <th className="text-left p-3 font-mono font-semibold text-foreground">HIGH MASK</th>
                          <th className="text-left p-3 font-mono font-semibold text-foreground">LOW MASK</th>
                          <th className="text-center p-3 font-mono font-semibold text-foreground">TYPE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border font-mono">
                        {[
                          { ch: "GPIO0", reg: "0xA00", high: "0x01", low: "0xFE", type: "Output" },
                          { ch: "GPIO1", reg: "0xA00", high: "0x04", low: "0xFB", type: "Output" },
                          { ch: "GPIO2", reg: "0xA01", high: "0x08", low: "0xF7", type: "Output" },
                          { ch: "GPIO3", reg: "0xA03", high: "0x10", low: "0xEF", type: "Input" },
                          { ch: "GPIO4", reg: "0xA04", high: "0x02", low: "0xFD", type: "Output" },
                          { ch: "GPIO5", reg: "0xA04", high: "0x04", low: "0xFB", type: "Input" },
                          { ch: "GPIO6", reg: "0xA02", high: "0x40", low: "0xBF", type: "Output" },
                          { ch: "GPIO7", reg: "0xA02", high: "0x80", low: "0x7F", type: "Input" },
                        ].map((g, i) => (
                          <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : ""}>

                            <td className="p-3 font-bold text-primary">{g.ch}</td>
                            <td className="p-3 text-muted-foreground">{g.reg}</td>
                            <td className="p-3 text-muted-foreground">{g.high}</td>
                            <td className="p-3 text-muted-foreground">{g.low}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${g.type === "Output" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"}`}>

                                {g.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Code Example */}
                <div id="gpio-code" className="card-surface rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-border bg-primary/5">
                    <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                      <Code size={20} className="text-primary" /> ตัวอย่าง C Code — GPIO Control
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">ใช้ inb_p / outb_p เข้าถึง I/O Port Register โดยตรงบน Linux</p>
                  </div>
                  <div className="bg-slate-900 p-5 overflow-x-auto">
                    <pre className="text-sm font-mono leading-relaxed text-slate-100">
                      <code className="text-slate-100">
{`#include <sys/io.h>
#include <stdio.h>

// ─── ขอสิทธิ์เข้าถึง I/O Port ───
ioperm(0xA00, 0x10, 1);

// ─── GPIO0 Output (Register 0xA00) ───
unsigned char iodata8;

iodata8 = inb_p(0xA00);                    // อ่านค่าปัจจุบัน
outb_p((iodata8 & 0xFE) | 0x01, 0xA00);   // Set HIGH
outb_p((iodata8 & 0xFE) | 0x00, 0xA00);   // Set LOW

// ─── GPIO3 Input (Register 0xA03) ───
iodata8 = inb_p(0xA03);
int gpio3_state = (iodata8 >> 4) & 0x01;   // อ่านสถานะ
printf("GPIO3 = %s\\n", gpio3_state ? "HIGH" : "LOW");

// ─── ตัวอย่าง: สั่งเปิด Relay + อ่าน Sensor ───
outb_p((inb_p(0xA04) & 0xFD) | 0x02, 0xA04);  // GPIO4 → Relay ON
int sensor = (inb_p(0xA04) >> 2) & 0x01;       // GPIO5 → อ่าน Sensor`}
                      </code>
                    </pre>
                  </div>
                  <div className="p-4 bg-muted/30 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <Lightbulb size={14} className="inline mr-1 text-amber-500" /> <strong>หมายเหตุ:</strong> ต้องรันด้วย <code className="bg-muted px-1 rounded">sudo</code> หรือตั้งค่า capabilities —
                      SDK เต็มรูปแบบมีให้จากโรงงาน สนใจติดต่อทีมขายเพื่อรับไฟล์ SDK
                    </p>
                  </div>
                </div>

                {/* Signal Visualizer */}
                <div className="card-surface rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-border bg-primary/5">
                    <h3 className="text-lg font-display font-bold text-foreground"><BarChart3 size={18} className="inline mr-1 text-primary" />GPIO Signal Overview</h3>
                    <p className="text-xs text-muted-foreground mt-1">แผนผังสถานะสัญญาณ GPIO ทั้ง 8 ช่อง</p>
                  </div>
                  <div className="p-5 space-y-3">
                    {[
                      { ch: "GPIO0", reg: "0xA00", type: "OUT", level: 95 },
                      { ch: "GPIO1", reg: "0xA00", type: "OUT", level: 85 },
                      { ch: "GPIO2", reg: "0xA01", type: "OUT", level: 100 },
                      { ch: "GPIO3", reg: "0xA03", type: "IN", level: 70 },
                      { ch: "GPIO4", reg: "0xA04", type: "OUT", level: 90 },
                      { ch: "GPIO5", reg: "0xA04", type: "IN", level: 60 },
                      { ch: "GPIO6", reg: "0xA02", type: "OUT", level: 80 },
                      { ch: "GPIO7", reg: "0xA02", type: "IN", level: 50 },
                    ].map((g, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-primary w-16">{g.ch}</span>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${g.type === "OUT" ? "bg-emerald-500" : "bg-amber-400"}`}
                            style={{ width: `${g.level}%` }}
                          />
                        </div>
                        <span className={`text-xs font-mono w-10 text-right ${g.type === "OUT" ? "text-emerald-500" : "text-amber-500"}`}>

                          {g.type}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground w-14 text-right">{g.reg}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SDK CTA */}
                <div className="card-surface rounded-2xl overflow-hidden bg-gradient-to-r from-primary/5 to-emerald-500/5 p-6 lg:p-8 text-center">
                  <h3 className="text-xl font-display font-bold text-foreground">🛠️ ต้องการ GPIO SDK สำหรับพัฒนาต่อยอด?</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
                    เรามี SDK จากโรงงานพร้อม Source Code, Library และเอกสาร API ครบชุด
                    รองรับ C/C++ บน Linux — ติดต่อทีมขายเพื่อรับไฟล์
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mt-5">
                    <a href="tel:0957391053" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted transition-colors">
                      <Phone size={16} /> โทรสอบถาม
                    </a>
                  </div>
                </div>
              </div>

              <div className="card-surface overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground"><DollarSign size={18} className="inline mr-1 text-primary" />GT5000 Price List</h3>
                  <p className="text-xs text-muted-foreground mt-1"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายเพื่อยืนยันราคา โทร. 095-739-1053 · Line: @entgroup</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                       <tr className="bg-secondary/50">
                         <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                         <th className="text-left p-3 font-semibold text-foreground">Configuration</th>
                         <th className="text-right p-3 font-semibold text-foreground">ราคา</th>
                         <th className="text-left p-3 font-semibold text-foreground">หมายเหตุ</th>
                         <th className="p-3 w-20"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                       {[
                         { cpu: "i5-4200U", config: "RAM 4GB + SSD 128GB + WIFI", price: "19,490", remark: "" },
                         { cpu: "i5-4200U", config: "RAM 4GB + SSD 256GB + WIFI", price: "20,090", remark: "" },
                         { cpu: "i5-4200U", config: "RAM 8GB + SSD 128GB + WIFI", price: "19,790", remark: "" },
                         { cpu: "i5-4200U", config: "RAM 8GB + SSD 128GB + WIFI", price: "22,690", remark: "รวม WIN 10 OEM + AC 5G WIFI" },
                         { cpu: "i5-4200U", config: "RAM 8GB + SSD 256GB + WIFI", price: "20,490", remark: "" },
                         { cpu: "i5-4200U", config: "RAM 8GB + SSD 512GB + WIFI", price: "22,090", remark: "" },
                         { cpu: "i5-4200U", config: "RAM 8GB + SSD 1TB + WIFI", price: "28,690", remark: "" },
                         { cpu: "i7-4500U", config: "RAM 4GB + SSD 128GB + WIFI", price: "22,090", remark: "" },
                         { cpu: "i7-4500U", config: "RAM 4GB + SSD 256GB + WIFI", price: "22,690", remark: "" },
                         { cpu: "i7-4500U", config: "RAM 8GB + SSD 128GB + WIFI", price: "22,690", remark: "" },
                         { cpu: "i7-4500U", config: "RAM 8GB + SSD 256GB + WIFI", price: "23,390", remark: "" },
                         { cpu: "i7-4500U", config: "RAM 8GB + SSD 256GB + 1TB SSD + WIFI", price: "28,590", remark: "" },
                         { cpu: "i7-4500U", config: "RAM 8GB + SSD 512GB + WIFI", price: "24,690", remark: "" },
                       ].map((item, i) => {
                         const specLabel = `GT5000 ${item.cpu} ${item.config}`;
                         return (
                         <tr key={i} className="hover:bg-secondary/30 transition-colors">
                           <td className="p-3 text-foreground font-medium">{item.cpu}</td>
                           <td className="p-3 text-muted-foreground">{item.config}</td>
                           <td className="p-3 text-right font-bold text-primary">฿{item.price}</td>
                           <td className="p-3 text-xs text-muted-foreground">{item.remark}</td>
                           <td className="p-3">
                             <div className="inline-flex items-center gap-1">
                               <AddToCartButton productModel="GT5000" productName={specLabel} iconOnly variant="outline" />
                               <QuoteRequestButton productModel="GT5000" productName={specLabel} iconOnly variant="outline" />
                               <ChatNowButton productModel="GT5000" productName={specLabel} />
                             </div>
                           </td>
                         </tr>
                         );
                       })}
                    </tbody>
                   </table>
                </div>
                <div className="p-4 border-t border-border text-center">
                </div>
              </div>

              {useCasesGrid}

              {/* Intro Video */}
              <div className="card-surface overflow-hidden rounded-xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">วิดีโอ GT5000</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/AfWfNNtEG74"

                    title="GT5000 Intro"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"></iframe>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">GT5000 Introduction</span>
                  <ShareButtons url="https://youtu.be/AfWfNNtEG74" title="GT5000 Introduction" compact />
                </div>
              </div>

              {/* More Videos */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "Vow9kJBFyWk", label: "GT5000 รายละเอียด" },
                  { id: "ifkzyVY9Z-g", label: "ภาพรวม GT Series" },
                  { id: "mUdgKEBxWF4", label: "GT5000 เพิ่มเติม" },
                ].map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden rounded-xl">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"></iframe>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{v.label}</span>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.label} compact />
                    </div>
                  </div>
                ))}
              </div>

              {/* Podcast */}
              <div className="card-surface rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT5000</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { file: "GT5000_Intro.wav", label: "GT5000 Introduction" },
                    { file: "GT5000_Port_Specification.wav", label: "GT5000 Port Specification" },
                    { file: "GT5000_Sale_Scenario.wav", label: "GT5000 Sale Scenario" },
                  ].map((p) => (
                    <div key={p.file} className="p-4 rounded-xl bg-secondary/40 border border-border">
                      <p className="text-sm font-bold text-foreground mb-1">{p.label}</p>
                      <audio controls className="w-full mt-2 h-10" preload="metadata">
                        <source src={`/audio/${p.file}`} type="audio/wav" />
                      </audio>
                      <div className="mt-2">
                        <ShareButtons url={`${window.location.origin}/gt-series?tab=gt5000`} title={`Podcast ${p.label}`} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datasheet CTA */}
              <div className="text-center">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-muted text-muted-foreground font-semibold cursor-not-allowed opacity-60">
                  <Download size={16} /> Datasheet GT5000 — กำลังจัดทำ
                </span>
              </div>
            </div>
          )}

          {/* Tab: GT6000 Detail */}
          {activeTab === "gt6000" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img
                  src={gt6000Banner}
                  alt="GT6000 Industrial PC"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    ดีไซน์ใหม่ · Intel Core i3 · Fanless
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">6000</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    ดีไซน์ใหม่ สวยทุกมุม — สำหรับร้านค้าและบริการ
                  </p>
                </div>
              </div>

              {/* Description + Product */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      Gen 8/10 · DDR4 64GB · Triple Display · NVMe
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">6000</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Industrial Mini PC โครง Brushed Aluminum Alloy สีดำ ระบบ Fanless เงียบสนิท ทำงานต่อเนื่อง 24 ชม.
                      รองรับ DDR4 สูงสุด 64GB, Triple Display (HDMI 2.0 + HDMI 1.4 + DP 1.2),
                      พร้อม M.2 NVMe SSD + mSATA + 2.5" SATA HDD
                    </p>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-primary">
                    <h4 className="font-bold text-foreground mb-2"><Factory size={16} className="inline mr-1 text-primary" />ออกแบบมาเพื่อโรงงานโดยเฉพาะ</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      ทนทานต่อสภาพแวดล้อมที่เต็มไปด้วยน้ำมัน ฝุ่นละออง และความร้อน
                      รองรับ VESA Mounting บนรถกอล์ฟ โฟคลิฟท์ หรือตู้คอนเทนเนอร์ — สมบูรณ์แบบสำหรับขยายไลน์ผลิต
                    </p>
                  </div>

                  {/* Key Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-surface p-4 text-center">
                      <Cpu className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">CPU</div>
                      <div className="text-xs text-muted-foreground mt-1">Core i3/i5/i7 Gen 8–10</div>
                      <div className="text-xs text-muted-foreground">Celeron / Pentium ได้</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Server className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">RAM & Storage</div>
                      <div className="text-xs text-muted-foreground mt-1">DDR4 สูงสุด 64 GB</div>
                      <div className="text-xs text-muted-foreground">NVMe + mSATA + SATA</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Monitor className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">Triple Display</div>
                      <div className="text-xs text-muted-foreground mt-1">HDMI 2.0 + HDMI 1.4 + DP 1.2</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Wind className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">Fanless 24/7</div>
                      <div className="text-xs text-muted-foreground mt-1">เงียบ 0 dB · 2 COM · 2 LAN</div>
                    </div>
                  </div>
                </div>

                {/* Product Images — Factory */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden rounded-xl bg-muted/30">
                    <img
                      src="/images/gt6000/main.jpg"
                      alt="GT6000 ภาพหลัก — ด้านหน้า"
                      className="w-full object-contain p-2"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/gt6000/front.jpg", alt: "GT6000 ด้านหน้า" },
                      { src: "/images/gt6000/top.jpg", alt: "GT6000 ด้านบน" },
                      { src: "/images/gt6000/angle.jpg", alt: "GT6000 มุมเอียง" },
                      { src: "/images/gt6000/rear.jpg", alt: "GT6000 ด้านหลัง — พอร์ต" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden rounded-lg bg-muted/30">
                        <img src={img.src} alt={img.alt} className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Port Connectivity — Factory Images */}
              <div className="card-surface p-6 md:p-8">
                <h4 className="text-xl font-display font-bold text-foreground mb-4">
                  <Plug size={18} className="inline mr-1 text-primary" />Port Connectivity — ครบจบในเครื่องเดียว
                </h4>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <img src="/images/gt6000/ports1.jpg" alt="GT6000 พอร์ตด้านหน้า" className="w-full rounded-lg"/>
                  <img src="/images/gt6000/ports2.jpg" alt="GT6000 พอร์ตด้านหลัง" className="w-full rounded-lg"/>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {[
                    { label: "2 COM Port", desc: "RS232 × 2 สำหรับเชื่อมต่ออุปกรณ์อุตสาหกรรม" },
                    { label: "Triple Display", desc: "HDMI 2.0 + HDMI 1.4 + DP 1.2 — 3 หน้าจอพร้อมกัน" },
                    { label: "DDR4 สูงสุด 64GB", desc: "2 × DDR4 RAM Slot รองรับงานหนัก" },
                    { label: "USB 6 ports", desc: "USB 3.0 + USB 2.0 เชื่อมต่อ barcode, camera" },
                    { label: "NVMe + SATA", desc: "M.2 NVMe 2280 + mSATA + 2.5\" SATA HDD" },
                    { label: "2 Gigabit LAN", desc: "แยกเครือข่ายระบบผลิตและ office" },
                  ].map((item, i) => (
                    <div key={i} className="card-surface p-3">
                      <div className="font-bold text-foreground mb-1">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factory Gallery */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { src: "/images/gt6000/detail.jpg", alt: "GT6000 ภาพรวมพร้อม Spec" },
                  { src: "/images/gt6000/internal.jpg", alt: "GT6000 ภายใน — Mainboard" },
                  { src: "/images/gt6000/bottom.jpg", alt: "GT6000 ด้านล่าง — VESA Mount" },
                ].map((img, i) => (
                  <div key={i} className="card-surface overflow-hidden rounded-lg bg-muted/30">
                    <img src={img.src} alt={img.alt} className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                  </div>
                ))}
              </div>

              {/* More Factory Images */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { src: "/images/gt6000/side1.jpg", alt: "GT6000 ด้านข้าง 1" },
                  { src: "/images/gt6000/side2.jpg", alt: "GT6000 ด้านข้าง 2" },
                  { src: "/images/gt6000/side3.jpg", alt: "GT6000 ด้านข้าง — ครีบระบายความร้อน" },
                  { src: "/images/gt6000/spec-overview.jpg", alt: "GT6000 Spec Overview" },
                ].map((img, i) => (
                  <div key={i} className="card-surface overflow-hidden rounded-lg bg-muted/30">
                    <img src={img.src} alt={img.alt} className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                  </div>
                ))}
              </div>

              {/* Spec Table — Full Detail */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground">GT6000 Full Specifications</h3>
                  <p className="text-xs text-muted-foreground mt-1">ข้อมูลจาก Manufacturer — Brushed Full Aluminum Alloy Case, Fanless Design</p>
                </div>
                <div className="grid md:grid-cols-2 md:divide-x divide-border">
                  <div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {[
                          ["ตัวเครื่อง", "Brushed Full Aluminum Alloy\nFanless 0 dB · ทำงาน 24/7"],
                          ["CPU (Gen 8)", "Celeron 5205U\nPentium 5405U / 6405U\nCore i3-8145U\nCore i5-8265U / 8365U / 8269U\nCore i7-8565U / 8569U"],
                          ["CPU (Gen 10)", "Core i3-10110U\nCore i5-10210U / 10310U\nCore i7-10510U / 10610U / 10710U"],
                          ["RAM", "2 × DDR4 SO-DIMM Slot\nสูงสุด 64 GB"],
                          ["Storage", "M.2 NVMe 2280 SSD\n+ mSATA SSD\n+ 2.5\" SATA 3.0 HDD\n(ใส่ได้พร้อมกัน 3 ตัว)"],
                        ].map(([k, v], i) => (
                          <tr key={i}><td className="p-3 font-medium text-foreground w-1/3 align-top">{k}</td><td className="p-3 text-muted-foreground whitespace-pre-line">{v}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {[
                          ["Display", "HDMI 2.0 (4K@60Hz)\nHDMI 1.4 (4K@30Hz)\nDP 1.2 (4K@60Hz)\nรองรับ 3 จอพร้อมกัน"],
                          ["COM", "2 × RS232 (RS485/RS422 ตั้งค่าผ่าน BIOS)"],
                          ["USB", "USB 3.0 × 4\nUSB 2.0 × 2"],
                          ["LAN", "2 × Gigabit Ethernet RJ45 (10/100/1000 Mbps)"],
                          ["WiFi/BT", "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม"],
                          ["Audio", "MIC In + SPK Out (Line Out)"],
                          ["Power", "DC 12V / 19V Adapter"],
                          ["Mounting", "VESA 75×75 / 100×100 / Wall Mount / DIN Rail"],
                          ["OS", "Windows 10 / 11 / Linux"],
                        ].map(([k, v], i) => (
                          <tr key={i}><td className="p-3 font-medium text-foreground w-1/3 align-top">{k}</td><td className="p-3 text-muted-foreground whitespace-pre-line">{v}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* GT6000 Price List */}
              {(() => {
                const gt6000Prices = [
                  { cpu: "Pentium 6405U", ram: "4 GB", storage: "SSD 128GB", price: "15,490" },
                  { cpu: "Pentium 6405U", ram: "4 GB", storage: "SSD 256GB", price: "15,900" },
                  { cpu: "Pentium 6405U", ram: "8 GB", storage: "SSD 128GB", price: "16,900" },
                  { cpu: "Pentium 6405U", ram: "8 GB", storage: "SSD 256GB", price: "17,900" },
                  { cpu: "i3-8145U", ram: "4 GB", storage: "SSD 128GB", price: "18,590" },
                  { cpu: "i3-8145U", ram: "4 GB", storage: "SSD 256GB", price: "19,990" },
                  { cpu: "i3-8145U", ram: "8 GB", storage: "SSD 128GB", price: "20,190" },
                  { cpu: "i3-8145U", ram: "8 GB", storage: "SSD 256GB", price: "21,990" },
                  { cpu: "i5-8250U", ram: "4 GB", storage: "SSD 128GB", price: "22,900" },
                  { cpu: "i5-8250U", ram: "4 GB", storage: "SSD 256GB", price: "23,590" },
                  { cpu: "i5-8250U", ram: "8 GB", storage: "SSD 128GB", price: "23,900" },
                  { cpu: "i5-8250U", ram: "8 GB", storage: "SSD 256GB", price: "24,900" },
                  { cpu: "i7-8557U", ram: "4 GB", storage: "SSD 128GB", price: "26,590" },
                  { cpu: "i7-8557U", ram: "4 GB", storage: "SSD 256GB", price: "26,590" },
                  { cpu: "i7-8557U", ram: "8 GB", storage: "SSD 128GB", price: "27,590" },
                  { cpu: "i7-8557U", ram: "8 GB", storage: "SSD 256GB", price: "28,590" },
                ];
                const perPage = 8;
                const totalPages = Math.ceil(gt6000Prices.length / perPage);
                const pageItems = gt6000Prices.slice(gt6000PricePage * perPage, (gt6000PricePage + 1) * perPage);

                return (
                  <div className="card-surface overflow-hidden">
                    <div className="p-5 border-b border-border">
                      <h3 className="text-lg font-display font-bold text-foreground"><DollarSign size={18} className="inline mr-1 text-primary" />GT6000 Price List</h3>
                      <p className="text-xs text-muted-foreground mt-1"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายเพื่อยืนยันราคา โทร. 095-739-1053 · Line: @entgroup</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                           <tr className="bg-secondary/50">
                             <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                             <th className="text-left p-3 font-semibold text-foreground">RAM</th>
                             <th className="text-left p-3 font-semibold text-foreground">Storage</th>
                             <th className="text-right p-3 font-semibold text-foreground">ราคา</th>
                             <th className="p-3 w-20"></th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-border">
                           {pageItems.map((item, i) => {
                             const specLabel = `GT6000 ${item.cpu} / ${item.ram} / ${item.storage}`;
                             return (
                             <tr key={i} className="hover:bg-secondary/30 transition-colors">
                               <td className="p-3 text-foreground font-medium">{item.cpu}</td>
                               <td className="p-3 text-muted-foreground">{item.ram}</td>
                               <td className="p-3 text-muted-foreground">{item.storage}</td>
                               <td className="p-3 text-right font-bold text-primary">฿{item.price}</td>
                               <td className="p-3">
                                 <div className="inline-flex items-center gap-1">
                                   <AddToCartButton productModel="GT6000" productName={specLabel} iconOnly variant="outline" />
                                   <QuoteRequestButton productModel="GT6000" productName={specLabel} iconOnly variant="outline" />
                                   <ChatNowButton productModel="GT6000" productName={specLabel} />
                                 </div>
                               </td>
                             </tr>
                             );
                           })}
                         </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        หน้า {gt6000PricePage + 1} / {totalPages}
                      </span>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, p) => (
                          <button
                            key={p}
                            onClick={() => setGt6000PricePage(p)}
                            className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                              p === gt6000PricePage
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                            }`}>
                            {p + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border-t border-border text-center">
                    </div>
                  </div>
                );
              })()}

              {useCasesGrid}

              {/* Intro Video */}
              <div className="card-surface overflow-hidden rounded-xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">วิดีโอ GT6000</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/AfWfNNtEG74"

                    title="GT6000 Intro"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"></iframe>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">GT6000 Introduction</span>
                  <ShareButtons url="https://youtu.be/AfWfNNtEG74" title="GT6000 Introduction" compact />
                </div>
              </div>

              {/* More Videos */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "-xIpN8g8OkA", label: "GT6000 รายละเอียด" },
                  { id: "gB7vAOpxEqo", label: "GT6000 เพิ่มเติม" },
                  { id: "31SEStppvKw", label: "GT Series Overview" },
                ].map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden rounded-xl">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"></iframe>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{v.label}</span>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.label} compact />
                    </div>
                  </div>
                ))}
              </div>

              {/* Podcast */}
              <div className="card-surface rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT6000</h3>
                </div>
                <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                  <p className="text-sm font-bold text-foreground mb-1">GT6000 Introduction</p>
                  <audio controls className="w-full mt-2 h-10" preload="metadata">
                    <source src="/audio/GT6000_Intro.wav" type="audio/wav" />
                  </audio>
                  <div className="mt-2">
                    <ShareButtons url={`${window.location.origin}/gt-series?tab=gt6000`} title="Podcast GT6000 Intro" compact />
                  </div>
                </div>
              </div>

              {/* Datasheet CTA */}
              <div className="text-center">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT6000.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> ดาวน์โหลด Datasheet GT6000
                </a>
              </div>
            </div>
          )}

          {/* Tab: GT7000 Detail */}
          {activeTab === "gt7000" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img
                  src={gt7000Banner}
                  alt="GT7000 Industrial PC"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    DDR4 · 6 COM · 70°C · Aluminium Alloy
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">7000</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    คำตอบทุกปัญหาโรงงาน — ทนทาน แกร่ง ไว้ใจได้
                  </p>
                </div>
              </div>

              {/* Description + Product */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      6 COM RS485 · GPIO · SIM 4G · DDR4
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">7000</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Industrial Mini PC โครง Brushed Aluminum Alloy ระบบ Fanless เงียบสนิท
                      พร้อม 6 COM (COM1/COM2 รองรับ RS485), Micro SIM 4G, VGA+HDMI Dual Display
                      ทำงานต่อเนื่อง 24/7 ทนอุณหภูมิสูงถึง 70°C
                    </p>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-primary">
                    <h4 className="font-bold text-foreground mb-2"><DollarSign size={16} className="inline mr-1 text-primary" />ประหยัดต้นทุนระยะยาว</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• ประหยัดไฟด้วยการกินไฟเพียง 15W</li>
                      <li>• ระบบ Watch dog ป้องกันการค้าง</li>
                      <li>• อัพเกรด SSD และ RAM ได้ในอนาคต</li>
                    </ul>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-secondary">
                    <h4 className="font-bold text-foreground mb-2"><Wrench size={16} className="inline mr-1 text-primary" />พร้อมใช้งานอุตสาหกรรม</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 6 COM Port รองรับ RS232/422/485</li>
                      <li>• Micro SIM รองรับ 3G/4G Module</li>
                      <li>• LAN Gigabit 2 พอร์ต</li>
                      <li>• mSATA SSD + 2.5" SATA HDD</li>
                    </ul>
                  </div>

                  {/* Key Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-surface p-4 text-center">
                      <Cpu className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">CPU</div>
                      <div className="text-xs text-muted-foreground mt-1">Intel Core i3 / i5 / i7 (DDR4)</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Server className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">RAM & Storage</div>
                      <div className="text-xs text-muted-foreground mt-1">DDR4 4–32 GB / mSATA + SATA</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Shield className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">6 COM + SIM 4G</div>
                      <div className="text-xs text-muted-foreground mt-1">RS232/RS485 + Micro SIM</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Thermometer className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">ทนร้อน 70°C</div>
                      <div className="text-xs text-muted-foreground mt-1">Fanless 24/7 · VGA+HDMI</div>
                    </div>
                  </div>
                </div>

                {/* Product Images — Factory */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden rounded-xl bg-muted/30">
                    <img
                      src="/images/gt7000/main.jpg"
                      alt="GT7000 ภาพหลัก"
                      className="w-full object-contain p-2"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/gt7000/front.jpg", alt: "GT7000 ด้านหน้า — พอร์ต COM" },
                      { src: "/images/gt7000/side.jpg", alt: "GT7000 ด้านข้าง — ครีบระบายความร้อน" },
                      { src: "/images/gt7000/angle.jpg", alt: "GT7000 มุมเอียง" },
                      { src: "/images/gt7000/rear.jpg", alt: "GT7000 ด้านหลัง" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden rounded-lg bg-muted/30">
                        <img src={img.src} alt={img.alt} className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature Highlights — 2 คอลัมน์ จาก Wix */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface overflow-hidden rounded-xl">
                  <img src="/images/gt7000-wix/cost-saving.png" alt="GT7000 ประหยัดต้นทุนระยะยาว" className="w-full h-auto rounded-xl"/>
                </div>
                <div className="card-surface overflow-hidden rounded-xl">
                  <img src="/images/gt7000-wix/ports-overview.png" alt="GT7000 พอร์ตครบครัน พร้อมใช้งานอุตสาหกรรม" className="w-full h-auto rounded-xl"/>
                </div>
              </div>

              {/* Compact + Heatsink — 2 คอลัมน์ */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface overflow-hidden rounded-xl p-4">
                  <h4 className="font-bold text-foreground mb-3 text-sm"><Package size={16} className="inline mr-1 text-primary" />กะทัดรัด แต่แกร่ง</h4>
                  <img src="/images/gt7000-wix/compact-design.png" alt="GT7000 Compact Design" className="w-full rounded-lg"/>
                  <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                    <li>• ขนาดเล็กเท่ากล่องรองเท้า 23×17.5×5 ซม.</li>
                    <li>• ติดตั้งง่าย ประหยัดพื้นที่</li>
                    <li>• พอร์ตครบครัน รองรับการเชื่อมต่อทุกระบบ</li>
                  </ul>
                </div>
                <div className="card-surface overflow-hidden rounded-xl p-4">
                  <h4 className="font-bold text-foreground mb-3 text-sm"><Flame size={16} className="inline mr-1 text-primary" />ครีบระบายความร้อนพิเศษ</h4>
                  <img src="/images/gt7000-wix/heatsink.png" alt="GT7000 Heatsink Design" className="w-full rounded-lg"/>
                  <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                    <li>• ไม่ต้องใช้พัดลม — เงียบสนิท 0 dB</li>
                    <li>• ทนความร้อนสูงถึง 70°C</li>
                    <li>• ป้องกันฝุ่นเข้าเครื่องขั้นสูง</li>
                  </ul>
                </div>
              </div>

              {/* Spec Detail + Use Case — 2 คอลัมน์ */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface overflow-hidden rounded-xl">
                  <img src="/images/gt7000-wix/spec-detail.png" alt="GT7000 Specifications Detail" className="w-full h-auto rounded-xl"/>
                </div>
                <div className="card-surface overflow-hidden rounded-xl">
                  <img src="/images/gt7000-wix/use-case.png" alt="GT7000 Use Case Applications" className="w-full h-auto rounded-xl"/>
                </div>
              </div>

              {/* Application Gallery — Full Width */}
              <div className="card-surface overflow-hidden rounded-xl">
                <img src="/images/gt7000-wix/factory-app.jpg" alt="GT7000 Factory Automation Application" className="w-full h-auto rounded-xl"/>
              </div>

              {/* Port Connectivity */}
              <div className="card-surface p-6 md:p-8">
                <h4 className="text-xl font-display font-bold text-foreground mb-4">
                  <Plug size={18} className="inline mr-1 text-primary" />Port Connectivity — ครบจบในเครื่องเดียว
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {[
                    { label: "6 COM Port", desc: "RS232 × 6 — COM1/COM2 ตั้งค่าเป็น RS485 ได้" },
                    { label: "Micro SIM 4G", desc: "รองรับ 3G/4G Module เชื่อมต่อไร้สาย" },
                    { label: "Dual Display", desc: "VGA + HDMI — 2 หน้าจอพร้อมกัน" },
                    { label: "USB 6 ports", desc: "USB 3.0 + USB 2.0 เชื่อมต่ออุปกรณ์" },
                    { label: "mSATA + SATA", desc: "mSATA SSD + 2.5\" SATA 3.0 HDD/SSD" },
                    { label: "2 Gigabit LAN", desc: "Dual Gigabit Ethernet แยกเครือข่าย" },
                  ].map((item, i) => (
                    <div key={i} className="card-surface p-3">
                      <div className="font-bold text-foreground mb-1">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Scenarios — 2 คอลัมน์ */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card-surface overflow-hidden rounded-xl">
                  <img src="/images/gt7000-wix/app-restaurant.jpg" alt="GT7000 Restaurant & POS Application" className="w-full h-48 object-cover"/>
                  <div className="p-5">
                    <h4 className="font-bold text-foreground mb-3">🍽️ ระบบร้านอาหาร & POS</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• จัดการออเดอร์และสต๊อกสินค้า</li>
                      <li>• เชื่อมต่อระบบจอทัชสกรีนสั่งอาหาร</li>
                      <li>• ทำงานต่อเนื่อง 24 ชม. ไม่สะดุด</li>
                    </ul>
                  </div>
                </div>
                <div className="card-surface overflow-hidden rounded-xl">
                  <div className="grid grid-cols-2 gap-1">
                    <img src="/images/gt7000-wix/install1.jpg" alt="GT7000 Installation 1" className="w-full h-24 object-cover"/>
                    <img src="/images/gt7000-wix/install2.jpg" alt="GT7000 Installation 2" className="w-full h-24 object-cover"/>
                    <img src="/images/gt7000-wix/install3.jpg" alt="GT7000 Installation 3" className="w-full h-24 object-cover"/>
                    <img src="/images/gt7000-wix/install4.jpg" alt="GT7000 Installation 4" className="w-full h-24 object-cover"/>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-foreground mb-3"><Factory size={16} className="inline mr-1 text-primary" />ระบบโรงงานอัตโนมัติ</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• ควบคุมแขนกลและระบบผลิตอัตโนมัติ</li>
                      <li>• เก็บข้อมูลการผลิตแบบเรียลไทม์</li>
                      <li>• เชื่อมต่อ SCADA ได้อย่างเสถียร</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Spec Table — 2 คอลัมน์ */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground"><FileText size={18} className="inline mr-1 text-primary" />GT7000 Specifications</h3>
                </div>
                <div className="grid md:grid-cols-2 md:divide-x divide-border">
                  <div className="divide-y divide-border">
                    {[
                      ["CPU", "Intel Core i3 / i5 / i7 (DDR4)\nTDP 15W ประหยัดไฟ"],
                      ["RAM", "DDR4 SO-DIMM สูงสุด 32GB"],
                      ["Storage", "mSATA SSD + 2.5\" SATA 3.0 HDD/SSD"],
                      ["Display", "VGA + HDMI (Dual Display)"],
                      ["COM", "6× RS232 (COM1/COM2 → RS422/RS485)"],
                      ["LAN", "2× Gigabit Ethernet RJ45"],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 p-3 bg-secondary/30 text-xs font-semibold text-foreground">{label}</div>
                        <div className="w-2/3 p-3 text-xs text-muted-foreground whitespace-pre-line">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      ["USB", "USB 3.0 + USB 2.0 (รวม 6 พอร์ต)"],
                      ["SIM", "Micro SIM 3G/4G Module"],
                      ["WiFi/BT", "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม"],
                      ["Cooling", "Fanless — เงียบ 0 dB ทน 70°C"],
                      ["Size / Weight", "230 × 175 × 50mm / 2.5kg"],
                      ["Mounting", "VESA / Wall Mount / Desktop"],
                      ["Functions", "Watchdog, Wake On LAN, RTC"],
                      ["OS", "Windows 10/11, Linux"],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 p-3 bg-secondary/30 text-xs font-semibold text-foreground">{label}</div>
                        <div className="w-2/3 p-3 text-xs text-muted-foreground whitespace-pre-line">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* GT7000 Price List */}
              <div className="card-surface overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground"><DollarSign size={18} className="inline mr-1 text-primary" />GT7000 Price List</h3>
                  <p className="text-xs text-muted-foreground mt-1"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายเพื่อยืนยันราคา โทร. 095-739-1053 · Line: @entgroup</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                       <tr className="bg-secondary/50">
                         <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                         <th className="text-left p-3 font-semibold text-foreground">Configuration</th>
                         <th className="text-right p-3 font-semibold text-foreground">ราคา</th>
                         <th className="p-3 w-20"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                       {[
                         { cpu: "i3-7100U", config: "RAM DDR4 4GB + SSD 128GB + WIFI", price: "15,190" },
                         { cpu: "i3-7100U", config: "RAM DDR4 4GB + SSD 256GB + WIFI", price: "16,690" },
                         { cpu: "i3-7100U", config: "RAM DDR4 8GB + SSD 128GB + WIFI", price: "16,590" },
                         { cpu: "i3-7100U", config: "RAM DDR4 8GB + SSD 256GB + WIFI", price: "17,190" },
                         { cpu: "i3-7100U", config: "RAM DDR4 8GB + SSD 128GB + WIFI + 4G + RS485", price: "19,190" },
                         { cpu: "i5-7267U", config: "RAM DDR4 4GB + SSD 128GB + WIFI", price: "20,290" },
                         { cpu: "i5-7267U", config: "RAM DDR4 4GB + SSD 256GB + WIFI", price: "20,790" },
                         { cpu: "i5-7267U", config: "RAM DDR4 8GB + SSD 128GB + WIFI", price: "20,890" },
                         { cpu: "i5-7267U", config: "RAM DDR4 8GB + SSD 256GB + WIFI", price: "21,390" },
                         { cpu: "i5-7267U", config: "RAM DDR4 8GB + SSD 256GB + 4G Module", price: "23,890" },
                         { cpu: "i5-8250U", config: "RAM DDR4 4GB + SSD 128GB + WIFI", price: "21,090" },
                         { cpu: "i5-8250U", config: "RAM DDR4 4GB + SSD 256GB + WIFI", price: "21,690" },
                         { cpu: "i5-8250U", config: "RAM DDR4 4GB + SSD 512GB + WIFI", price: "22,790" },
                         { cpu: "i5-8250U", config: "RAM DDR4 8GB + SSD 128GB + WIFI", price: "21,490" },
                         { cpu: "i5-8250U", config: "RAM DDR4 8GB + SSD 256GB + WIFI", price: "22,190" },
                         { cpu: "i5-8250U", config: "RAM DDR4 8GB + SSD 256GB + 4G Module", price: "24,690" },
                         { cpu: "i5-8250U", config: "RAM DDR4 8GB + SSD 1TB + WIFI", price: "25,490" },
                         { cpu: "i5-8250U", config: "RAM DDR4 16GB + SSD 256GB + WIFI", price: "23,090" },
                         { cpu: "i5-8250U", config: "RAM DDR4 16GB + SSD 1TB + WIFI", price: "26,590" },
                         { cpu: "i7-7510U", config: "RAM DDR4 4GB + SSD 128GB + WIFI", price: "22,590" },
                       ].map((item, i) => {
                         const specLabel = `GT7000 ${item.cpu} ${item.config}`;
                         return (
                         <tr key={i} className="hover:bg-secondary/30 transition-colors">
                           <td className="p-3 text-foreground font-medium">{item.cpu}</td>
                           <td className="p-3 text-muted-foreground">{item.config}</td>
                           <td className="p-3 text-right font-bold text-primary">฿{item.price}</td>
                           <td className="p-3">
                             <div className="inline-flex items-center gap-1">
                               <AddToCartButton productModel="GT7000" productName={specLabel} iconOnly variant="outline" />
                               <QuoteRequestButton productModel="GT7000" productName={specLabel} iconOnly variant="outline" />
                               <ChatNowButton productModel="GT7000" productName={specLabel} />
                             </div>
                           </td>
                         </tr>
                         );
                       })}
                     </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground text-center py-3 border-t border-border"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายโดยตรงเพื่อยืนยันราคาที่ถูกต้อง โทร. 095-739-1053 · Line: @entgroup</p>
                <div className="p-4 border-t border-border text-center">
                </div>
              </div>

              {useCasesGrid}

              {/* Intro Video */}
              <div className="card-surface overflow-hidden rounded-xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">วิดีโอ GT7000</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/glN3-DBdwpc"

                    title="GT7000 Intro"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"></iframe>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">GT7000 Introduction</span>
                  <ShareButtons url="https://youtu.be/glN3-DBdwpc" title="GT7000 Introduction" compact />
                </div>
              </div>

              {/* More Videos */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "tRz9gNncIm0", label: "GT7000 รายละเอียด" },
                  { id: "ifkzyVY9Z-g", label: "ภาพรวม GT Series" },
                  { id: "31SEStppvKw", label: "GT Series Overview" },
                ].map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden rounded-xl">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"></iframe>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{v.label}</span>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.label} compact />
                    </div>
                  </div>
                ))}
              </div>

              {/* Podcast */}
              <div className="card-surface rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT7000</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { file: "GT7000_Intro.wav", label: "GT7000 Introduction" },
                    { file: "GT7000_Detail.wav", label: "GT7000 Detail" },
                  ].map((p) => (
                    <div key={p.file} className="p-4 rounded-xl bg-secondary/40 border border-border">
                      <p className="text-sm font-bold text-foreground mb-1">{p.label}</p>
                      <audio controls className="w-full mt-2 h-10" preload="metadata">
                        <source src={`/audio/${p.file}`} type="audio/wav" />
                      </audio>
                      <div className="mt-2">
                        <ShareButtons url={`${window.location.origin}/gt-series?tab=gt7000`} title={`Podcast ${p.label}`} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datasheet CTA */}
              <div className="text-center">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT7000.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> ดาวน์โหลด Datasheet GT7000
                </a>
              </div>
            </div>
          )}

          {/* Tab: GT8000 Detail */}
          {activeTab === "gt8000" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img
                  src={gt8000Banner}
                  alt="GT8000 Industrial PC"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                   <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-amber-500/30">
                    Intel Ice Lake Gen 10 · Active Cooling · <Fan size={12} className="inline mr-0.5" />มีพัดลม
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">8000</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    Ice Lake Gen 10 — พลังประมวลผลสูงสุดใน GT Series
                  </p>
                </div>
              </div>

              {/* Description + Product */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                     <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      DDR4 64GB · Dual HDMI · SIM 4G · Active Cooling
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">8000</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Industrial Mini PC โครง Brushed Aluminum Alloy พร้อมระบบพัดลมระบายความร้อน
                      รองรับ DDR4 สูงสุด 64GB, Dual HDMI Display, Micro SIM 4G Module
                      พร้อม mSATA SSD + 2.5" SATA HDD — ครบทุกการเชื่อมต่อ
                    </p>
                  </div>

                  {/* Fan Notice */}
                  <div className="rounded-xl p-5 border-2 border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-start gap-3">
                      <Fan size={24} className="text-amber-500" />
                      <div>
                        <h4 className="font-bold text-foreground mb-1 flex items-center gap-2">
                          รุ่นเดียวใน GT Series ที่ใช้ระบบพัดลม
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">Active Cooling</span>
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          GT8000 ใช้ CPU Intel Gen 10 (Ice Lake / Comet Lake) ที่มี TDP สูงถึง 15–25W 
                          ซึ่งต้องการระบบระบายความร้อนแบบ Active Cooling (พัดลม) เพื่อรักษาประสิทธิภาพสูงสุดอย่างต่อเนื่อง 
                          — ต่างจากรุ่นอื่นใน GT Series ที่เป็น Fanless ทั้งหมด
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">TDP 15–25W</span>
                          <span className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">ต้องการพัดลมช่วยระบายความร้อน</span>
                          <span className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">เหมาะกับงานประมวลผลหนัก</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-primary">
                    <h4 className="font-bold text-foreground mb-2"><Fan size={16} className="inline mr-1 text-primary" />ทำไมต้องมีพัดลม?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      CPU Intel Gen 10 ให้ประสิทธิภาพสูงกว่ารุ่น Celeron/Gen 4 หลายเท่า แต่แลกมาด้วยความร้อนที่มากขึ้น 
                      GT8000 จึงใช้พัดลมขนาดเล็กที่ทำงานเงียบ เพื่อรองรับงาน SCADA, AI Edge, Multi-tasking หนักๆ ได้อย่างเสถียร
                    </p>
                  </div>

                  {/* Key Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-surface p-4 text-center">
                      <Cpu className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">CPU</div>
                      <div className="text-xs text-muted-foreground mt-1">Intel Core i5/i7 Gen 10</div>
                      <div className="text-xs text-muted-foreground">Ice Lake / Comet Lake</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Server className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">RAM & Storage</div>
                      <div className="text-xs text-muted-foreground mt-1">DDR4 สูงสุด 64 GB</div>
                      <div className="text-xs text-muted-foreground">mSATA + 2.5" SATA</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Monitor className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">Dual HDMI + SIM</div>
                      <div className="text-xs text-muted-foreground mt-1">2× HDMI + Micro SIM 4G</div>
                    </div>
                    <div className="card-surface p-4 text-center border-2 border-amber-500/30">
                      <Wind className="mx-auto text-amber-500 mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">Active Cooling</div>
                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-semibold">มีพัดลม (TDP 15–25W)</div>
                      <div className="text-xs text-muted-foreground">รุ่นเดียวที่ไม่ใช่ Fanless</div>
                    </div>
                  </div>
                </div>

                {/* Product Images — Factory */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden rounded-xl bg-muted/30">
                    <img
                      src="/images/gt8000/main.jpg"
                      alt="GT8000 ภาพหลัก"
                      className="w-full object-contain p-2"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/gt8000/front.jpg", alt: "GT8000 ด้านหน้า" },
                      { src: "/images/gt8000/side.jpg", alt: "GT8000 ด้านข้าง" },
                      { src: "/images/gt8000/angle.jpg", alt: "GT8000 มุมเอียง" },
                      { src: "/images/gt8000/internal.jpg", alt: "GT8000 ภายใน — Mainboard" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden rounded-lg bg-muted/30">
                        <img src={img.src} alt={img.alt} className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Factory Gallery — Bottom */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="card-surface overflow-hidden rounded-lg bg-muted/30">
                  <img src="/images/gt8000/bottom.jpg" alt="GT8000 ด้านล่าง — VESA Mount" className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300 p-1"/>
                </div>
              </div>

              {/* Port Connectivity */}
              <div className="card-surface p-6 md:p-8">
                <h4 className="text-xl font-display font-bold text-foreground mb-4">
                  <Plug size={18} className="inline mr-1 text-primary" />Port Connectivity — ครบจบในเครื่องเดียว
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {[
                    { label: "2 COM Port", desc: "RS232 × 2 สำหรับเชื่อมต่ออุปกรณ์อุตสาหกรรม" },
                    { label: "Dual HDMI", desc: "2× HDMI Display — 2 หน้าจอพร้อมกัน" },
                    { label: "Micro SIM 4G", desc: "PUSH function รองรับ 4G Module" },
                    { label: "DDR4 สูงสุด 64GB", desc: "2 × DDR4 RAM Slot รองรับงานหนัก" },
                    { label: "mSATA + SATA", desc: "mSATA SSD + 2.5\" SATA 3.0 HDD/SSD" },
                    { label: "2 Gigabit LAN", desc: "Dual Gigabit Ethernet แยกเครือข่าย" },
                  ].map((item, i) => (
                    <div key={i} className="card-surface p-3">
                      <div className="font-bold text-foreground mb-1">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spec Table — 2 คอลัมน์ */}
              <div className="card-surface overflow-hidden rounded-2xl">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground">GT8000 Specifications</h3>
                  <p className="text-xs text-muted-foreground mt-1">ข้อมูลจาก Manufacturer</p>
                </div>
                <div className="grid md:grid-cols-2 md:divide-x divide-border">
                  <div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {[
                          ["CPU", "Intel Core i5-1035G1 / i7-10710U (Gen 10)"],
                          ["RAM", "2 × DDR4 Slot, สูงสุด 64 GB"],
                          ["Storage", "mSATA SSD + 2.5\" SATA 3.0 HDD/SSD"],
                          ["Display", "2× HDMI (Dual Display)"],
                          ["COM", "2 × RS232"],
                        ].map(([k, v], i) => (
                          <tr key={i}><td className="p-3 font-medium text-foreground w-1/3">{k}</td><td className="p-3 text-muted-foreground">{v}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {[
                          ["LAN", "2 × Gigabit Ethernet RJ45"],
                          ["SIM", "Micro SIM 4G (PUSH function)"],
                          ["WiFi/BT", "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม"],
                          ["Cooling", "Active Cooling (พัดลม) — TDP 15–25W"],
                          ["Mounting", "VESA / Wall Mount"],
                        ].map(([k, v], i) => (
                          <tr key={i}><td className="p-3 font-medium text-foreground w-1/3">{k}</td><td className="p-3 text-muted-foreground">{v}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* GT8000 Price List */}
              <div className="card-surface overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground"><DollarSign size={18} className="inline mr-1 text-primary" />GT8000 Price List</h3>
                  <p className="text-xs text-muted-foreground mt-1"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายเพื่อยืนยันราคา โทร. 095-739-1053 · Line: @entgroup</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                       <tr className="bg-secondary/50">
                         <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                         <th className="text-left p-3 font-semibold text-foreground">RAM</th>
                         <th className="text-left p-3 font-semibold text-foreground">Storage</th>
                         <th className="text-center p-3 font-semibold text-foreground">WiFi</th>
                         <th className="text-right p-3 font-semibold text-foreground">ราคา</th>
                         <th className="p-3 w-20"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                       {[
                         { cpu: "i5-1035 G1", ram: "4 GB", storage: "128 GB", wifi: true, price: "23,990" },
                         { cpu: "i7-1065 G7", ram: "4 GB", storage: "128 GB", wifi: true, price: "24,990" },
                         { cpu: "i5-1035 G1", ram: "4 GB", storage: "256 GB", wifi: true, price: "25,900" },
                         { cpu: "i7-1065 G7", ram: "4 GB", storage: "256 GB", wifi: true, price: "26,900" },
                         { cpu: "i5-1035 G1", ram: "8 GB", storage: "128 GB", wifi: true, price: "27,990" },
                         { cpu: "i7-1065 G7", ram: "8 GB", storage: "128 GB", wifi: true, price: "28,990" },
                         { cpu: "i5-1035 G1", ram: "8 GB", storage: "256 GB", wifi: true, price: "29,900" },
                         { cpu: "i7-1065 G7", ram: "8 GB", storage: "256 GB", wifi: true, price: "30,900" },
                       ].map((item, i) => {
                         const specLabel = `GT8000 ${item.cpu} / ${item.ram} / ${item.storage}`;
                         return (
                         <tr key={i} className="hover:bg-secondary/30 transition-colors">
                           <td className="p-3 text-foreground font-medium">{item.cpu}</td>
                           <td className="p-3 text-muted-foreground">{item.ram}</td>
                           <td className="p-3 text-muted-foreground">{item.storage}</td>
                           <td className="p-3 text-center text-muted-foreground">{item.wifi ? "✓" : "—"}</td>
                           <td className="p-3 text-right font-bold text-primary">฿{item.price}</td>
                           <td className="p-3">
                             <div className="inline-flex items-center gap-1">
                               <AddToCartButton productModel="GT8000" productName={specLabel} iconOnly variant="outline" />
                               <QuoteRequestButton productModel="GT8000" productName={specLabel} iconOnly variant="outline" />
                               <ChatNowButton productModel="GT8000" productName={specLabel} />
                             </div>
                           </td>
                         </tr>
                         );
                       })}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-muted/20 border-t border-border">
                  <p className="text-xs text-muted-foreground"><strong>หมายเหตุ:</strong></p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-0.5 list-disc list-inside">
                    <li>ราคาทุกรุ่นรวม WiFi Module แล้ว</li>
                    <li>รุ่น 8GB RAM เหมาะสำหรับงานหนัก และ Multitasking</li>
                    <li>SSD 256GB ให้พื้นที่เก็บข้อมูลเพิ่มขึ้น 2 เท่า</li>
                    <li>CPU i7-1065 G7 ให้ประสิทธิภาพสูงกว่า i5 ถึง 20%</li>
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground text-center py-3 border-t border-border"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายโดยตรงเพื่อยืนยันราคาที่ถูกต้อง โทร. 095-739-1053 · Line: @entgroup</p>
                <div className="p-4 border-t border-border text-center">
                </div>
              </div>

              {useCasesGrid}

              {/* Intro Video */}
              <div className="card-surface overflow-hidden rounded-xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">วิดีโอ GT8000</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/eODzBXj4w4Q"

                    title="GT8000 Intro"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"></iframe>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">GT8000 Introduction</span>
                  <ShareButtons url="https://youtu.be/eODzBXj4w4Q" title="GT8000 Introduction" compact />
                </div>
              </div>

              {/* More Videos */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: "31SEStppvKw", label: "GT Series Overview" },
                  { id: "ifkzyVY9Z-g", label: "ภาพรวม GT Series" },
                  { id: "DLJ2eghWoMQ", label: "GT8000 เพิ่มเติม" },
                  { id: "7wE6fxMpJB4", label: "GT Series รวม" },
                ].map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden rounded-xl">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"></iframe>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{v.label}</span>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.label} compact />
                    </div>
                  </div>
                ))}
              </div>

              {/* Podcast */}
              <div className="card-surface rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT8000</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { file: "GT8000_Intro.wav", label: "GT8000 Introduction" },
                    { file: "GT8000_How_to_buy.wav", label: "GT8000 How to Buy" },
                  ].map((p) => (
                    <div key={p.file} className="p-4 rounded-xl bg-secondary/40 border border-border">
                      <p className="text-sm font-bold text-foreground mb-1">{p.label}</p>
                      <audio controls className="w-full mt-2 h-10" preload="metadata">
                        <source src={`/audio/${p.file}`} type="audio/wav" />
                      </audio>
                      <div className="mt-2">
                        <ShareButtons url={`${window.location.origin}/gt-series?tab=gt8000`} title={`Podcast ${p.label}`} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datasheet CTA */}
              <div className="text-center">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT8000.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> ดาวน์โหลด Datasheet GT8000
                </a>
              </div>
            </div>
          )}

          {/* Tab: GT9000 Detail */}
          {activeTab === "gt9000" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img
                  src={gt9000Banner}
                  alt="GT9000 Industrial PC"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    3 HDMI · 6 COM · NVMe · SIM 4G · Dual-Band WiFi
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">9000</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    Triple HDMI Display · 6 COM RS232/422/485 — เรือธงสำหรับงานหนักระดับสูงสุด
                  </p>
                </div>
              </div>

              {/* Description + Factory Gallery */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      Triple HDMI · 6 COM · M-SATA + SATA + NVMe · SIM 4G
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">9000</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      GT9000 ตัวเครื่องสีดำผลิตจากอลูมิเนียมอัลลอยด์ขัดเงา (Brushed Full Aluminum Alloy)
                      ปราศจากพัดลมระบายอากาศ ทำงานเงียบ 24 ชั่วโมงต่อเนื่อง รองรับ 4G Module พร้อมช่อง SIM Card,
                      Dual-Band WiFi พร้อมเสาอากาศภายนอก, 6 COM Port (RS232/RS422/RS485) และ Triple Display
                      ผ่าน 3× HDMI 1.4 แสดงผล 3 จอพร้อมกัน ติดตั้ง M-SATA SSD + 2.5" SATA HDD + M.2 2280 NVMe ได้พร้อมกัน
                    </p>
                  </div>

                  <ProductFeatures features={[
                    "Brushed Full Aluminum Alloy — โครงอลูมิเนียมขัดเงาสีดำ",
                    "Fanless 24 ชม. — ไร้พัดลม เงียบสนิท ไม่ดูดฝุ่น",
                    "Full-height 4G Module + SIM Card Slot",
                    "Dual-Band WiFi + เสาอากาศภายนอก",
                    "6× RS232/RS422/RS485 COM Port",
                    "M-SATA SSD + 2.5\" SATA HDD + M.2 2280 NVMe พร้อมกัน",
                    "3× HDMI 1.4 Triple Display — 3 จอพร้อมกัน",
                    "Wall Mount ด้วยสกรูยาว (Optional)",
                  ]} />

                  {/* Key Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-surface p-4 text-center">
                      <Cpu className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">CPU</div>
                      <div className="text-xs text-muted-foreground mt-1">i5-10200H / i7-10750H / i5-1235U / i7-1255U</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Server className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">RAM & Storage</div>
                      <div className="text-xs text-muted-foreground mt-1">DDR4/DDR5 สูงสุด 32GB / M-SATA + SATA + NVMe</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Monitor className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">3× HDMI 1.4</div>
                      <div className="text-xs text-muted-foreground mt-1">Triple Display — แสดงผล 3 จอพร้อมกัน</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Shield className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">6 COM + SIM 4G</div>
                      <div className="text-xs text-muted-foreground mt-1">RS232/RS422/RS485 + 4G Module + WiFi</div>
                    </div>
                  </div>
                </div>

                {/* Factory Gallery */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden">
                    <img src="/images/gt9000/main.jpg" alt="GT9000 ภาพหลัก" className="w-full object-contain p-4" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/gt9000/front.jpg", alt: "GT9000 ด้านหน้า" },
                      { src: "/images/gt9000/side.jpg", alt: "GT9000 ด้านข้าง" },
                      { src: "/images/gt9000/angle.jpg", alt: "GT9000 มุมเฉียง" },
                      { src: "/images/gt9000/motherboard.png", alt: "GT9000 เมนบอร์ด" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden">
                        <img src={img.src} alt={img.alt} className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spec 2 คอลัมน์ */}
              <div className="card-surface overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground"><FileText size={18} className="inline mr-1 text-primary" />GT9000 Specifications</h3>
                </div>
                <div className="grid md:grid-cols-2 md:divide-x divide-border">
                  <div className="divide-y divide-border">
                    {[
                      ["CPU", "1. Intel Core i5-9300H 4C/8T 2.4–4.1GHz 8MB TDP 45W\n2. Intel Core i7-9750H 6C/12T 2.6–4.5GHz 12MB TDP 45W\n3. Intel Core i5-10200H 4C/8T 2.4–4.1GHz 8MB TDP 45W\n4. Intel Core i7-10870H 8C/16T 2.2–5.0GHz 16MB TDP 45W"],
                      ["TDP", "45W"],
                      ["Chipset", "Intel SOC"],
                      ["BIOS", "AMI BIOS, ACPI supported"],
                      ["RAM", "2× DDR4 SO-DIMM สูงสุด 64GB"],
                      ["Storage", "1× M-SATA SSD\n1× 2.5\" SATA HDD/SSD\n1× M.2 2280 NVMe SSD"],
                      ["Display Output", "3× HDMI 1.4 (Triple Display พร้อมกัน)"],
                      ["COM Port", "6× RS232/RS422/RS485 (ตั้งค่าผ่าน BIOS)"],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 p-3 bg-secondary/30 text-xs font-semibold text-foreground">{label}</div>
                        <div className="w-2/3 p-3 text-xs text-muted-foreground whitespace-pre-line">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      ["USB", "USB 3.0 × 4 + USB 2.0 × 4 (รวม 8 พอร์ต)"],
                      ["LAN", "2× Intel i211 Gigabit RJ45"],
                      ["WiFi/BT", "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม"],
                      ["4G/LTE", "Full-height Mini PCIe 4G Module + Micro SIM Slot"],
                      ["Audio", "MIC-IN + SPK-OUT (Line Out)"],
                      ["Power", "DC 19V Adapter"],
                      ["Cooling", "Fanless — ระบายความร้อนผ่านอลูมิเนียม Heatsink"],
                      ["Temp Range", "0°C ~ 60°C (Operating)"],
                      ["Mounting", "Desktop / VESA / Wall Mount (Optional)"],
                      ["OS Support", "Windows 10/11, Linux"],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 p-3 bg-secondary/30 text-xs font-semibold text-foreground">{label}</div>
                        <div className="w-2/3 p-3 text-xs text-muted-foreground whitespace-pre-line">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Wix Detail Images — Overview & Spec Diagrams */}
              <div className="card-surface p-4 overflow-hidden">
                <img
                  src="/images/wix/0597a3_b68e0174e2b54d39b0bdf80ae71118e5_dbbc6602.png"
                  alt="GT9000 Product Overview"
                  className="w-full rounded-lg"/>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "/images/wix/0597a3_ecdc35b7d41e4cfba1afa5d11300df17_1c556fc5.png",
                  "/images/wix/0597a3_77a9c0395f984fde811028a4f0fbc5e4_64748b8e.png",
                  "/images/wix/0597a3_c5d446300d3a4d9caabc33cad2911b4b_5ecb9f30.png",
                  "/images/wix/0597a3_ffb33e04d1384bdab5c17647bd479b85_26d908b0.png",
                  "/images/wix/0597a3_d3041b42178d4c10bece0b7ffb8f31e3_127d8428.png",
                  "/images/wix/0597a3_2c101c21f03f4d63b1df69669f310210_55ddd23b.png",
                  "/images/wix/0597a3_ee8b5d5430dd45118bfc9310fb269418_4aa5d391.png",
                  "/images/wix/0597a3_06cf1a8db43c4bc9b3e45e421c5f38ca_5e6a02a5.png",
                  "/images/wix/0597a3_e8bf65042cdb49c7badf9b1dc833e3a2_8e4d6d12.png",
                  "/images/wix/0597a3_901ca65b5c4149a1b6037ff17888889b_cec5e6be.png",
                  "/images/wix/0597a3_d89ddcc7673d4492ad64911fb4825364_6535d1f1.png",
                ].map((img, i) => (
                  <div key={i} className="card-surface p-3 overflow-hidden">
                    <img src={img} alt={`GT9000 Detail ${i + 1}`} className="w-full rounded-lg"/>
                  </div>
                ))}
              </div>

              {/* Real-world Photos */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "/images/wix/005637_11c4dd2fbe1048448d0663de7ae71804_852cd386.jpg",
                  "/images/wix/005637_a31039453194460c8956f5a8e49a635c_a1bef204.jpg",
                  "/images/wix/005637_a643b2c6b5c14278bff7f4af495805a3_f8e08654.jpg",
                  "/images/wix/005637_bf02ab6305244e028d18bbb27984eb3c_fbcfe5d0.jpg",
                ].map((img, i) => (
                  <div key={i} className="card-surface overflow-hidden">
                    <img src={img} alt={`GT9000 ใช้งานจริง ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                  </div>
                ))}
              </div>

              {/* GT9000 Price Table */}
              {(() => {
                const gt9000Prices = [
                  { cpu: "i5-10200H", config: "RAM 4GB + SSD 128GB + WIFI", price: "25,290" },
                  { cpu: "i5-10200H", config: "RAM 4GB + SSD 256GB + WIFI", price: "26,090" },
                  { cpu: "i5-10200H", config: "RAM 8GB + SSD 128GB + WIFI", price: "25,890" },
                  { cpu: "i5-10200H", config: "RAM 8GB + SSD 256GB + WIFI", price: "26,490" },
                  { cpu: "i5-10200H", config: "RAM 16GB + SSD 256GB + WIFI", price: "27,690" },
                  { cpu: "i5-10200H", config: "RAM 8GB + SSD 512GB + HDD 500GB + WIFI", price: "26,490" },
                  { cpu: "i7-10750H", config: "RAM 4GB + SSD 128GB + WIFI", price: "27,690" },
                  { cpu: "i7-10750H", config: "RAM 8GB + SSD 128GB + WIFI", price: "28,190" },
                  { cpu: "i7-10750H", config: "RAM 8GB + SSD 256GB + WIFI", price: "28,790" },
                  { cpu: "i7-10750H", config: "RAM 16GB + SSD 512GB + WIFI", price: "31,390" },
                  { cpu: "i7-10750H", config: "RAM 32GB + SSD 512GB + WIFI", price: "33,790" },
                  { cpu: "i5-1235U", config: "RAM DDR5 8GB + SSD 128GB + WIFI", price: "29,790" },
                  { cpu: "i5-1235U", config: "RAM DDR5 8GB + SSD 256GB + WIFI", price: "30,490" },
                  { cpu: "i5-1235U", config: "RAM DDR5 16GB + SSD 128GB + WIFI", price: "31,690" },
                  { cpu: "i5-1235U", config: "RAM DDR5 16GB + SSD 256GB + WIFI", price: "32,290" },
                  { cpu: "i7-1255U", config: "RAM DDR5 8GB + SSD 128GB + WIFI", price: "33,190" },
                  { cpu: "i7-1255U", config: "RAM DDR5 8GB + SSD 256GB + WIFI", price: "33,790" },
                  { cpu: "i7-1255U", config: "RAM DDR5 8GB + SSD 256GB + 2TB HDD + WIFI + Win10", price: "42,290" },
                  { cpu: "i7-1255U", config: "RAM DDR5 32GB + SSD 256GB + 2TB SSD + WIFI + Win10", price: "48,190" },
                ];
                const perPage = 10;
                const totalPages = Math.ceil(gt9000Prices.length / perPage);
                return (
                  <Collapsible defaultOpen>
                    <div className="card-surface overflow-hidden">
                      <CollapsibleTrigger className="w-full p-5 border-b border-border flex items-center justify-between hover:bg-secondary/30 transition-colors">
                        <div>
                          <h3 className="text-lg font-display font-bold text-foreground text-left"><DollarSign size={18} className="inline mr-1 text-primary" />GT9000 Price List</h3>
                          <p className="text-xs text-muted-foreground mt-1 text-left"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายเพื่อยืนยันราคา · {gt9000Prices.length} รายการ</p>
                        </div>
                        <ChevronDown size={20} className="text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {(() => {
                          const start = gt9000PricePage * perPage;
                          const paged = gt9000Prices.slice(start, start + perPage);
                          return (
                            <>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                     <tr className="bg-secondary/50">
                                       <th className="text-left p-3 font-semibold text-foreground">#</th>
                                       <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                                       <th className="text-left p-3 font-semibold text-foreground">Configuration</th>
                                       <th className="text-right p-3 font-semibold text-foreground">ราคา</th>
                                       <th className="p-3 w-20"></th>
                                     </tr>
                                   </thead>
                                   <tbody className="divide-y divide-border">
                                     {paged.map((item, i) => {
                                       const specLabel = `GT9000 ${item.cpu} ${item.config}`;
                                       return (
                                       <tr key={start + i} className="hover:bg-secondary/30 transition-colors">
                                         <td className="p-3 text-muted-foreground">{start + i + 1}</td>
                                         <td className="p-3 text-foreground font-medium">{item.cpu}</td>
                                         <td className="p-3 text-muted-foreground">{item.config}</td>
                                         <td className="p-3 text-right font-bold text-primary">฿{item.price}</td>
                                         <td className="p-3">
                                           <div className="inline-flex items-center gap-1">
                                             <AddToCartButton productModel="GT9000" productName={specLabel} iconOnly variant="outline" />
                                             <QuoteRequestButton productModel="GT9000" productName={specLabel} iconOnly variant="outline" />
                                             <ChatNowButton productModel="GT9000" productName={specLabel} />
                                           </div>
                                         </td>
                                       </tr>
                                       );
                                     })}
                                   </tbody>
                                </table>
                              </div>
                              {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 p-4 border-t border-border">
                                  <button onClick={() => setGt9000PricePage(Math.max(0, gt9000PricePage - 1))} disabled={gt9000PricePage === 0} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-secondary/50 disabled:opacity-40 transition-colors">ก่อนหน้า</button>
                                  {Array.from({ length: totalPages }, (_, idx) => (
                                    <button key={idx} onClick={() => setGt9000PricePage(idx)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${idx === gt9000PricePage ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50 text-muted-foreground"}`}>{idx + 1}</button>
                                  ))}
                                  <button onClick={() => setGt9000PricePage(Math.min(totalPages - 1, gt9000PricePage + 1))} disabled={gt9000PricePage === totalPages - 1} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-secondary/50 disabled:opacity-40 transition-colors">ถัดไป</button>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })()}
              <div className="text-center">
              </div>

              {useCasesGrid}

              {/* Intro Video */}
              <div className="card-surface overflow-hidden rounded-xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">วิดีโอ GT9000</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/nxapqTEi1lU"

                    title="GT9000 Intro"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"></iframe>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">GT9000 Introduction</span>
                  <ShareButtons url="https://youtu.be/nxapqTEi1lU" title="GT9000 Introduction" compact />
                </div>
              </div>

              {/* More Videos */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "fSbOW_cXRiI", label: "GT9000 รายละเอียด" },
                  { id: "VYBpiL0S2Js", label: "GT9000 เพิ่มเติม" },
                  { id: "vxiR-8eO820", label: "GT9000 Overview" },
                ].map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden rounded-xl">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"></iframe>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{v.label}</span>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.label} compact />
                    </div>
                  </div>
                ))}
              </div>

              {/* Podcast */}
              <div className="card-surface rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT9000</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { file: "GT9000_Intro.wav", label: "GT9000 Introduction" },
                    { file: "GT9000_Detail.wav", label: "GT9000 Detail" },
                    { file: "GT9000_Scenario.wav", label: "GT9000 Scenario" },
                  ].map((p) => (
                    <div key={p.file} className="p-4 rounded-xl bg-secondary/40 border border-border">
                      <p className="text-sm font-bold text-foreground mb-1">{p.label}</p>
                      <audio controls className="w-full mt-2 h-10" preload="metadata">
                        <source src={`/audio/${p.file}`} type="audio/wav" />
                      </audio>
                      <div className="mt-2">
                        <ShareButtons url={`${window.location.origin}/gt-series?tab=gt9000`} title={`Podcast ${p.label}`} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datasheet CTAs */}
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT9000_Gen12.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> Datasheet GT9000 (Gen 12)
                </a>
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT9000_Gen10.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary/50 transition-colors">
                  <Download size={16} /> Datasheet GT9000 (Gen 10)
                </a>
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT9000_extra.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary/50 transition-colors">
                  <Download size={16} /> GT9000 Product Overview
                </a>
              </div>
            </div>
          )}

          {/* Tab: GT4500 Detail */}
          {activeTab === "gt4500" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img
                  src={gt4500Banner}
                  alt="GT4500 Industrial PC"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    DDR4 · SIM 4G/5G · 75°C · Fanless
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">4500</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    มาตรฐานใหม่แห่งความทนทาน — เพื่ออุตสาหกรรมไทย
                  </p>
                </div>
              </div>

              {/* Description + Product Image */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      DDR4 · SIM 4G/5G · RS485 · 75°C · Auto Power On
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">4500</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      GT4500 คือคำตอบสำหรับผู้ประกอบการที่มองหาคอมพิวเตอร์อุตสาหกรรมที่เชื่อถือได้ ด้วยการออกแบบที่เน้นความทนทานพิเศษ
                      พร้อมประสิทธิภาพที่ตอบโจทย์การใช้งานในสภาพแวดล้อมที่ท้าทาย ไม่ว่าจะเป็นสายการผลิต คลังสินค้า หรือพื้นที่ควบคุมเครื่องจักร
                    </p>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-primary">
                    <h4 className="font-bold text-foreground mb-2"><ThermometerSun size={16} className="inline mr-1 text-primary" />ทนทานเหนือระดับ -20° ถึง +75°C</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      ทำงานได้ในอุณหภูมิ -20° ถึง +75°C และความชื้นสูงถึง 90% ด้วยครีบระบายความร้อนอลูมิเนียมขนาดใหญ่
                      ระบบ Passive Cooling ไม่ใช้พัดลม เงียบ 0 dB ทำงานต่อเนื่อง 24 ชั่วโมงไม่มีปัญหาความร้อนสะสม
                    </p>
                  </div>

                  {/* Key Specs Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-surface p-4 text-center">
                      <Cpu className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">CPU 4 ตัวเลือก</div>
                      <div className="text-xs text-muted-foreground mt-1">i3-6006U / i5-7260U / i5-8250U / i7-8550U</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Server className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">RAM DDR4 + SSD</div>
                      <div className="text-xs text-muted-foreground mt-1">4 GB DDR4 / SSD 256 GB</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Shield className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">6 COM + 8 USB</div>
                      <div className="text-xs text-muted-foreground mt-1">RS232×6 (COM1-2 เป็น RS485/422 ได้), LAN 2</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Zap className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">SIM 4G/5G Ready</div>
                      <div className="text-xs text-muted-foreground mt-1">Micro SIM Push slot, WiFi Optional</div>
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden">
                    <img
                      src="/images/wix/0597a3_aea4cee9a1cb431b90886aa5b64e1f96_60f4ae42.png"
                      alt="GT4500 Front"
                      className="w-full object-contain p-4"/>
                  </div>
                  <div className="card-surface overflow-hidden">
                    <img
                      src="/images/wix/0597a3_2901e68aa51b482697a1d4c4fa9fc320_8f38391a.png"
                      alt="GT4500 Rear Ports"
                      className="w-full object-contain p-4"/>
                  </div>
                </div>
              </div>

              {/* Why GT4500 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card-surface p-6">
                  <h4 className="text-lg font-display font-bold text-foreground mb-4"><Zap size={18} className="inline mr-1 text-primary" />ประหยัดต้นทุนค่าไฟ</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• กินไฟเพียง <strong className="text-foreground">15W</strong> แม้ทำงาน 24 ชั่วโมง</li>
                    <li>• คิดเป็นค่าไฟเพียง <strong className="text-foreground">2.5 บาทต่อวัน</strong> (75 บาท/เดือน)</li>
                    <li>• ประหยัดค่าไฟได้มากกว่า <strong className="text-foreground">5,000 บาท/ปี</strong> เทียบกับ PC ทั่วไป</li>
                    <li>• ประหยัดกว่า 60% เมื่อเทียบกับคอมพิวเตอร์ทั่วไป</li>
                  </ul>
                </div>
                <div className="card-surface p-6">
                  <h4 className="text-lg font-display font-bold text-foreground mb-4"><Wrench size={18} className="inline mr-1 text-primary" />ดูแลง่าย ลดภาระ IT</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong className="text-foreground">Auto Power On</strong> — กลับมาทำงานอัตโนมัติหลังไฟดับ</li>
                    <li>• <strong className="text-foreground">Watchdog Timer</strong> — ตรวจจับและแก้ไขระบบค้างอัตโนมัติ</li>
                    <li>• <strong className="text-foreground">Wake-on-LAN</strong> — IT ดูแลระยะไกลได้ ลดการเดินทาง</li>
                    <li>• อัพเกรดง่ายทั้ง RAM และ Storage</li>
                  </ul>
                </div>
              </div>

              {/* CPU Options Visual */}
              <div className="card-surface p-4 overflow-hidden">
                <h4 className="text-lg font-display font-bold text-foreground mb-4 px-2"><Cpu size={18} className="inline mr-1 text-primary" />เลือก CPU ได้ถึง 4 รุ่น — จ่ายตามความต้องการ</h4>
                <img
                  src={gt4500CpuOptions}
                  alt="GT4500 CPU Options"
                  className="w-full rounded-lg"/>
              </div>

              {/* Software Compatibility */}
              <div className="card-surface p-6 md:p-8">
                <h4 className="text-xl font-display font-bold text-foreground mb-4">
                  <Laptop size={18} className="inline mr-1 text-primary" />รองรับซอฟต์แวร์หลากหลาย
                </h4>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      รองรับ Windows 7/8/10 และ Linux ทำให้ใช้งานได้ทั้งซอฟต์แวร์อุตสาหกรรมและโปรแกรมทั่วไป:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Microsoft Office, PDF Reader</li>
                      <li>• PLC Programming, SCADA</li>
                      <li>• CAD/CAM ออกแบบเขียนแบบ</li>
                      <li>• ระบบจัดการฐานข้อมูลและ ERP</li>
                      <li>• มัลติมีเดียสำหรับงานนำเสนอและฝึกอบรม</li>
                    </ul>
                  </div>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src="/images/wix/0597a3_840c03acd28147a89285de218f3a0a25_25c7410d.png"
                      alt="GT4500 Software"
                      className="w-full"/>
                  </div>
                </div>
              </div>

              {/* Cooling System */}
              <div className="card-surface p-4 overflow-hidden">
                <h4 className="text-lg font-display font-bold text-foreground mb-4 px-2">🔇 ระบบระบายความร้อน Passive Cooling</h4>
                <p className="text-sm text-muted-foreground mb-4 px-2 leading-relaxed">
                  ครีบระบายความร้อนอลูมิเนียมขนาดใหญ่ออกแบบอย่างพิถีพิถัน กระจายความร้อนได้ทั่วถึงและรวดเร็ว
                  ไม่ใช้พัดลม ไม่มีเสียงรบกวน ป้องกันฝุ่นเข้าตัวเครื่อง
                </p>
                <img
                  src="/images/wix/3e5003_5146d29438c1469084384085311877b6_98f6e0e9.jpg"
                  alt="GT4500 Heatsink"
                  className="w-full rounded-lg"/>
              </div>

              {/* Port Diagram */}
              <div className="card-surface p-4 overflow-hidden">
                <h4 className="text-lg font-display font-bold text-foreground mb-4 px-2"><Plug size={18} className="inline mr-1 text-primary" />พอร์ตเชื่อมต่อครบครัน</h4>
                <img
                  src="/images/wix/3e5003_fa1b7c0241e1439796bca055fb8c927d_880a3b61.jpg"
                  alt="GT4500 Port Layout"
                  className="w-full rounded-lg mb-4"/>
                <div className="grid md:grid-cols-3 gap-4 px-2">
                  <div className="text-sm">
                    <h5 className="font-bold text-foreground mb-1">พอร์ตสื่อสาร</h5>
                    <p className="text-muted-foreground">RS232 × 6 พอร์ต<br/>COM1/COM2 ตั้งค่าเป็น RS485/RS422 ผ่าน BIOS</p>
                  </div>
                  <div className="text-sm">
                    <h5 className="font-bold text-foreground mb-1">USB & แสดงผล</h5>
                    <p className="text-muted-foreground">USB 3.0 × 4 + USB 2.0 × 4<br/>HDMI + VGA Dual Display</p>
                  </div>
                  <div className="text-sm">
                    <h5 className="font-bold text-foreground mb-1">เครือข่าย & เสียง</h5>
                    <p className="text-muted-foreground">LAN × 2 (Gigabit)<br/>MIC + SPK, WiFi Optional</p>
                  </div>
                </div>
              </div>

              {/* Dimension */}
              <div className="card-surface p-6 text-center">
                <h4 className="text-lg font-display font-bold text-foreground mb-4"><Ruler size={18} className="inline mr-1 text-primary" />ขนาดกะทัดรัด เล็กกว่า IPC ทั่วไป 40%</h4>
                <p className="text-muted-foreground mb-4">
                  เพียง 21.2 × 15.5 × 4.5 cm น้ำหนัก 2.5 kg — ติดตั้งในตู้ควบคุม บนแขนยึด หรือใน AGV/โฟล์คลิฟท์ได้สะดวก
                </p>
                <div className="grid md:grid-cols-2 gap-4 items-center">
                  <img
                    src="/images/wix/3e5003_b7535d8168ab4f7d8d657a3eef999b12_d9722688.jpg"
                    alt="GT4500 Dimensions"
                    className="rounded-lg w-full"/>
                  <img
                    src="/images/wix/0597a3_c6c89af9190c48b992640615c77efcee_341c4637.png"
                    alt="GT4500 VESA Mount"
                    className="rounded-lg w-full"/>
                </div>
              </div>

              {/* GT4500 Price Table */}
              <div className="card-surface overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground"><DollarSign size={18} className="inline mr-1 text-primary" />GT4500 Price List</h3>
                  <p className="text-sm text-muted-foreground mt-1">ทุกรุ่นมาพร้อม RAM 8GB + SSD 256GB มาตรฐาน</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                        <th className="text-left p-3 font-semibold text-foreground">RAM / SSD</th>
                        <th className="text-left p-3 font-semibold text-foreground">จุดเด่น</th>
                        <th className="text-right p-3 font-semibold text-foreground">ราคา (฿)</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { cpu: "Intel Core i3-6006U", spec: "8GB DDR4 + SSD 256GB", highlight: "ประหยัด เปิด 24 ชม.", price: "21,900", tag: "" },
                        { cpu: "Intel Core i5-7260U", spec: "8GB DDR4 + SSD 256GB", highlight: "คุ้มค่าที่สุด มัลติทาสก์ดี", price: "22,900", tag: "ยอดนิยม" },
                        { cpu: "Intel Core i5-8250U", spec: "8GB DDR4 + SSD 256GB", highlight: "Gen 8 แรงขึ้น 40%", price: "23,900", tag: "" },
                        { cpu: "Intel Core i7-8550U", spec: "8GB DDR4 + SSD 256GB", highlight: "ท็อปสุด วิเคราะห์ข้อมูลหนัก", price: "25,900", tag: "" },
                      ].map((item, i) => {
                        const specLabel = `GT4500 ${item.cpu} / ${item.spec}`;
                        return (
                        <tr key={i} className={`hover:bg-muted/30 transition-colors ${item.tag ? "bg-primary/5" : ""}`}>
                          <td className="p-3 font-medium text-foreground">
                            {item.cpu}
                            {item.tag && <span className="ml-2 text-xs text-primary font-bold">{item.tag}</span>}
                          </td>
                          <td className="p-3 text-muted-foreground">{item.spec}</td>
                          <td className="p-3 text-muted-foreground text-xs">{item.highlight}</td>
                          <td className="p-3 text-right font-bold text-primary">฿{item.price}</td>
                          <td className="p-3">
                            <div className="inline-flex items-center gap-1">
                              <AddToCartButton productModel="GT4500" productName={specLabel} iconOnly variant="outline" />
                              <QuoteRequestButton productModel="GT4500" productName={specLabel} iconOnly variant="outline" />
                              <ChatNowButton productModel="GT4500" productName={specLabel} />
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-3 border-t border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground">
                    <AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลงได้โดยไม่ต้องแจ้งล่วงหน้า กรุณาติดต่อฝ่ายขายเพื่อยืนยันราคาและโปรโมชันล่าสุด
                  </p>
                </div>
              </div>

              {/* Options Table */}
              <div className="card-surface overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground">Windows License / Options</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground">Windows 10 Pro OEM</td><td className="p-3 text-right font-bold text-foreground">฿3,950</td></tr>
                      <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground">Windows 11 Pro OEM</td><td className="p-3 text-right font-bold text-foreground">฿4,590</td></tr>
                      <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground">Windows 10 IoT</td><td className="p-3 text-right font-bold text-foreground">฿3,950</td></tr>
                      <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground">Windows 11 IoT</td><td className="p-3 text-right font-bold text-foreground">฿4,590</td></tr>
                      <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground">WiFi Module / WiFi 6</td><td className="p-3 text-right font-bold text-foreground">สอบถาม</td></tr>
                      <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground">4G / 5G SIM Module</td><td className="p-3 text-right font-bold text-foreground">สอบถาม</td></tr>
                      <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground">ประกันเพิ่มปีที่ 2 / 3</td><td className="p-3 text-right font-bold text-foreground">+15% / +20%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="text-center">
              </div>

              {/* Gallery */}
              <div className="card-surface p-6">
                <h4 className="text-lg font-display font-bold text-foreground mb-4">📸 ภาพตัวอย่างการใช้งานจริง</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "/images/wix/005637_af317d79eacd469f9157d4820cb459cc_c3405b78.jpg",
                    "/images/wix/005637_e650889eede347d0a8d30c6a7e32287e_9e1760d8.jpg",
                    "/images/wix/005637_37d8da415dab4f7494a6b4801687e3e1_96815db5.jpg",
                    "/images/wix/005637_5734e20385dd4e4db9c42a9ab159a87c_0162feec.jpg",
                    "/images/wix/005637_e1b5f354431c46b58dc7d1e0e0c6ee53_c427c674.jpg",
                    "/images/wix/005637_d766ad09992e48559be58df3a9bc4ab7_8e0f74de.jpg",
                    "/images/wix/005637_37a9f940aea64c389e66a1e46f2cd2e3_0d2d74e1.jpg",
                    "/images/wix/005637_6c42aac9d6d747d08022f03a3979e64c_b8b5eee1.jpg",
                  ].map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`GT4500 การใช้งานจริง ${idx + 1}`}
                      className="w-full h-auto rounded-lg hover:scale-105 transition-transform duration-300"/>
                  ))}
                </div>
              </div>


              {useCasesGrid}

              {/* Intro Video */}
              <div className="card-surface overflow-hidden rounded-xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">วิดีโอ GT4500</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/ou3yHel3ijU"

                    title="GT4500 Intro"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"></iframe>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">GT4500 Introduction</span>
                  <ShareButtons url="https://youtu.be/ou3yHel3ijU" title="GT4500 Introduction" compact />
                </div>
              </div>

              {/* More Videos */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: "oXJho2icWAo", label: "GT4500 รายละเอียด" },
                  { id: "7wE6fxMpJB4", label: "ภาพรวม GT Series" },
                  { id: "31SEStppvKw", label: "GT Series Overview" },
                  { id: "ifkzyVY9Z-g", label: "การเลือกซื้อ GT Series" },
                ].map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden rounded-xl">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"></iframe>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{v.label}</span>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.label} compact />
                    </div>
                  </div>
                ))}
              </div>

              {/* Datasheet CTA */}
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT4500.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> ดาวน์โหลด Datasheet GT4500
                </a>
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT4500_extra.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-surface-hover transition-colors">
                  <Download size={16} /> วารสาร / Journal GT4500
                </a>
              </div>
            </div>
          )}

          {/* Tab: GT1400 Detail */}
          {activeTab === "gt1400" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img src="/images/gt1400/main.jpg" alt="GT1400 Industrial PC" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    2.5G LAN · 6 COM · GPIO · SIM 4G/5G · 9–36V
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">1400</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    2× Intel 2.5G LAN · 6 COM · GPIO · SIM 5G — Industrial IoT Powerhouse
                  </p>
                </div>
              </div>

              {/* Description + Factory Gallery */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      Celeron / Gen 8 / Gen 10 / Gen 11 · 2.5G LAN · 6 COM · GPIO · 5G
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">1400</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      GT1400 คอมพิวเตอร์อุตสาหกรรมรุ่นใหม่ รองรับ CPU 9 รุ่นตั้งแต่ Celeron J4125 ถึง i7-1165G7
                      พร้อม 2× Intel i225V 2.5G LAN, 6 COM Port (2× RS232/422/485 + 4× Expanded RS232),
                      GPIO 10 ช่อง, รองรับ 4G/5G Module, ไฟ 9–36V กว้าง เหมาะกับงาน Automation, Robotics,
                      Maritime, Surveillance และ Smart City
                    </p>
                  </div>

                  <ProductFeatures features={[
                    "Intel Celeron J4125/J6412 หรือ Gen 8/10/11 Core i3/i5/i7",
                    "2× Intel i225V 2.5G LAN (รองรับขยายเป็น 4 LAN)",
                    "2× RS232/RS422/RS485 COM + 4× Expanded RS232 COM",
                    "10-way GPIO + Remote Switch",
                    "M.2 3042/3052 สำหรับ 3G/4G/5G Module + SIM Slot",
                    "Fanless Aluminum Alloy — เงียบสนิท 24 ชม.",
                    "ไฟเข้า 9–36V กว้าง (4-pin Phoenix Terminal)",
                    "AWAL, Wake On LAN, Watchdog, RTC",
                    "ขนาด 300×155×50mm / 1.8kg",
                  ]} />

                  {/* Key Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-surface p-4 text-center">
                      <Cpu className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">CPU 9 รุ่น</div>
                      <div className="text-xs text-muted-foreground mt-1">J4125 / J6412 / i5-8260U / i5-8365U / i7-8565U / i5-10210U / i7-10510U / i5-1135G7 / i7-1165G7</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Server className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">RAM & Storage</div>
                      <div className="text-xs text-muted-foreground mt-1">DDR4 สูงสุด 64GB / M.2 SATA + M.2 NVMe + SATA HDD</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Monitor className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">2× 2.5G LAN</div>
                      <div className="text-xs text-muted-foreground mt-1">Intel i225V + ขยายได้ถึง 4 LAN</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Shield className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">6 COM + GPIO</div>
                      <div className="text-xs text-muted-foreground mt-1">RS232/422/485 + 10-way GPIO + 5G</div>
                    </div>
                  </div>
                </div>

                {/* Factory Gallery */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden">
                    <img src="/images/gt1400/main.jpg" alt="GT1400 ภาพหลัก" className="w-full object-contain p-4" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/gt1400/front.jpg", alt: "GT1400 ด้านหน้า" },
                      { src: "/images/gt1400/rear.jpg", alt: "GT1400 ด้านหลัง" },
                      { src: "/images/gt1400/side.jpg", alt: "GT1400 ด้านข้าง" },
                      { src: "/images/gt1400/internal.jpg", alt: "GT1400 ภายใน" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden">
                        <img src={img.src} alt={img.alt} className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ports & Dimension — 2 คอลัมน์ */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface p-4 overflow-hidden">
                  <h4 className="font-bold text-foreground mb-3 px-2 text-sm"><Plug size={16} className="inline mr-1 text-primary" />Ports & Connectivity</h4>
                  <img src="/images/gt1400/ports.png" alt="GT1400 Ports Layout" className="w-full rounded-lg"/>
                </div>
                <div className="card-surface p-4 overflow-hidden">
                  <h4 className="font-bold text-foreground mb-3 px-2 text-sm"><Ruler size={16} className="inline mr-1 text-primary" />Dimension Drawing</h4>
                  <img src="/images/gt1400/dimension.png" alt="GT1400 Dimension" className="w-full rounded-lg"/>
                </div>
              </div>

              {/* Spec 2 คอลัมน์ */}
              <div className="card-surface overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground"><FileText size={18} className="inline mr-1 text-primary" />GT1400 Specifications</h3>
                </div>
                <div className="grid md:grid-cols-2 md:divide-x divide-border">
                  <div className="divide-y divide-border">
                    {[
                      ["CPU", "1. Celeron J4125 4C/4T 2.0–2.7GHz TDP 10W\n2. Celeron J6412 4C/4T 2.0–2.6GHz TDP 10W\n3. i5-8260U 4C/8T 1.6–3.9GHz TDP 15W\n4. i5-8365U 4C/8T 1.6–4.1GHz TDP 15W\n5. i7-8565U 4C/8T 1.8–4.6GHz TDP 15W\n6. i5-10210U 2C/6T 1.6–4.2GHz TDP 15W\n7. i7-10510U 4C/8T 1.8–4.9GHz TDP 15W\n8. i5-1135G7 4C/8T 2.4–4.2GHz TDP 12W\n9. i7-1165G7 4C/8T 2.8–4.7GHz TDP 12W"],
                      ["Chipset", "SOC"],
                      ["Memory", "J4125/J6412: 1× SO-DIMM DDR4 (สูงสุด 32GB)\nGen 8/10/11: 2× SO-DIMM DDR4 (สูงสุด 64GB)"],
                      ["M.2 SSD", "1× M.2 SATA 2242/2260/2280\n1× M.2 SATA/NVMe 2280"],
                      ["SATA", "1× SATA 3.0 (6Gb/s) สำหรับ HDD/SSD"],
                      ["Display", "1× HDMI 1.4"],
                      ["LAN", "2× Intel i225V 2.5G RJ45\n(ขยายได้ถึง 4 LAN)"],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 p-3 bg-secondary/30 text-xs font-semibold text-foreground">{label}</div>
                        <div className="w-2/3 p-3 text-xs text-muted-foreground whitespace-pre-line">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      ["COM", "2× RS232/RS422/RS485\n4× Expanded RS232"],
                      ["USB", "J4125/J6412: 4× USB 3.0 + 2× USB 2.0\nGen 8/10/11: 2× USB 3.0 + 4× USB 2.0"],
                      ["EXT IO", "4-way 3-wire COM + 10-way GPIO + Remote Switch"],
                      ["WiFi/BT", "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม\nM.2 3042/3052 3G/4G/5G + SIM Slot"],
                      ["Power", "9V–36V DC (4-pin Phoenix Terminal)"],
                      ["Temp Range", "-20°C ~ +60°C (Operating)"],
                      ["Size / Weight", "300 × 155 × 50mm / 1.8kg"],
                      ["Functions", "AWAL, Wake On LAN, Watchdog, RTC, ATX"],
                      ["OS", "Windows 10/11, WES 10, Linux"],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 p-3 bg-secondary/30 text-xs font-semibold text-foreground">{label}</div>
                        <div className="w-2/3 p-3 text-xs text-muted-foreground whitespace-pre-line">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              {(() => {
                const gt1400Prices = [
                  { cpu: "i5-8305G", config: "DDR4 RAM 4GB + SSD 128GB + WIFI", price: "28,990" },
                  { cpu: "i5-8305G", config: "DDR4 RAM 8GB + SSD 128GB + WIFI", price: "29,190" },
                  { cpu: "i5-8305G", config: "DDR4 RAM 4GB + SSD 256GB + WIFI", price: "29,590" },
                  { cpu: "i5-8305G", config: "DDR4 RAM 8GB + SSD 256GB + WIFI", price: "29,990" },
                  { cpu: "i7-12650HX", config: "DDR5 RAM 8GB + SSD 128GB + WIFI", price: "34,690" },
                  { cpu: "i7-12650HX", config: "DDR5 RAM 8GB + SSD 256GB + WIFI", price: "35,290" },
                  { cpu: "i7-12650HX", config: "DDR5 RAM 16GB + SSD 128GB + WIFI", price: "36,490" },
                  { cpu: "i7-12650HX", config: "DDR5 RAM 16GB + SSD 256GB + WIFI", price: "36,990" },
                  { cpu: "i7-13650HX", config: "DDR5 RAM 8GB + SSD 128GB + WIFI", price: "37,790" },
                  { cpu: "i7-13650HX", config: "DDR5 RAM 8GB + SSD 256GB + WIFI", price: "38,390" },
                  { cpu: "i7-13650HX", config: "DDR5 RAM 16GB + SSD 128GB + WIFI", price: "39,590" },
                  { cpu: "i7-13650HX", config: "DDR5 RAM 16GB + SSD 256GB + WIFI", price: "39,990" },
                ];
                const perPage = 6;
                const totalPages = Math.ceil(gt1400Prices.length / perPage);
                const start = gt1400PricePage * perPage;
                const paged = gt1400Prices.slice(start, start + perPage);
                return (
                  <Collapsible defaultOpen>
                    <div className="card-surface overflow-hidden">
                      <CollapsibleTrigger className="w-full p-5 border-b border-border flex items-center justify-between hover:bg-secondary/30 transition-colors">
                        <div>
                          <h3 className="text-lg font-display font-bold text-foreground text-left"><DollarSign size={18} className="inline mr-1 text-primary" />GT1400 Price List</h3>
                          <p className="text-xs text-muted-foreground mt-1 text-left"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายเพื่อยืนยันราคา · {gt1400Prices.length} รายการ</p>
                        </div>
                        <ChevronDown size={20} className="text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-secondary/50">
                                <th className="text-left p-3 font-semibold text-foreground">#</th>
                                <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                                <th className="text-left p-3 font-semibold text-foreground">Configuration</th>
                                <th className="text-right p-3 font-semibold text-foreground">ราคา</th>
                                <th className="p-3"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {paged.map((item, i) => {
                                const specLabel = `GT1400 ${item.cpu} / ${item.config}`;
                                return (
                                <tr key={start + i} className="hover:bg-secondary/30 transition-colors">
                                  <td className="p-3 text-muted-foreground">{start + i + 1}</td>
                                  <td className="p-3 text-foreground font-medium">{item.cpu}</td>
                                  <td className="p-3 text-muted-foreground">{item.config}</td>
                                  <td className="p-3 text-right font-bold text-primary">฿{item.price}</td>
                                  <td className="p-3">
                                    <div className="inline-flex items-center gap-1">
                                      <AddToCartButton productModel="GT1400" productName={specLabel} iconOnly variant="outline" />
                                      <QuoteRequestButton productModel="GT1400" productName={specLabel} iconOnly variant="outline" />
                                      <ChatNowButton productModel="GT1400" productName={specLabel} />
                                    </div>
                                  </td>
                                </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2 p-4 border-t border-border">
                            <button onClick={() => setGt1400PricePage(Math.max(0, gt1400PricePage - 1))} disabled={gt1400PricePage === 0} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-secondary/50 disabled:opacity-40 transition-colors">ก่อนหน้า</button>
                            {Array.from({ length: totalPages }, (_, idx) => (
                              <button key={idx} onClick={() => setGt1400PricePage(idx)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${idx === gt1400PricePage ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50 text-muted-foreground"}`}>{idx + 1}</button>
                            ))}
                            <button onClick={() => setGt1400PricePage(Math.min(totalPages - 1, gt1400PricePage + 1))} disabled={gt1400PricePage === totalPages - 1} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-secondary/50 disabled:opacity-40 transition-colors">ถัดไป</button>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground text-center py-3 border-t border-border"><AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลง กรุณาติดต่อพนักงานขายโดยตรงเพื่อยืนยันราคาที่ถูกต้อง โทร. 095-739-1053 · Line: @entgroup</p>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })()}
              <div className="text-center">
              </div>



              {useCasesGrid}

              {/* Intro Video */}
              <div className="card-surface overflow-hidden rounded-xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">วิดีโอ GT1400</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/ocai7eLpMOY"

                    title="GT1400 Intro"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"></iframe>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">GT1400 Introduction</span>
                  <ShareButtons url="https://youtu.be/ocai7eLpMOY" title="GT1400 Introduction" compact />
                </div>
              </div>

              {/* More Videos */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "NlbRjOgq2t0", label: "GT1400 รายละเอียด" },
                  { id: "QKdn1jAn_EM", label: "GT1400 เพิ่มเติม" },
                  { id: "Hhf8zX6ID68", label: "GT1400 Overview" },
                ].map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden rounded-xl">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"></iframe>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{v.label}</span>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.label} compact />
                    </div>
                  </div>
                ))}
              </div>

              {/* Podcast */}
              <div className="card-surface rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT1400</h3>
                </div>
                <div className="p-4 rounded-xl bg-secondary/40 border border-border">
                  <p className="text-sm font-bold text-foreground mb-1">GT1400 Introduction</p>
                  <audio controls className="w-full mt-2 h-10" preload="metadata">
                    <source src="/audio/GT1400_Intro.wav" type="audio/wav" />
                  </audio>
                  <div className="mt-2">
                    <ShareButtons url={`${window.location.origin}/gt-series?tab=gt1400`} title="Podcast GT1400 Intro" compact />
                  </div>
                </div>
              </div>

              {/* Datasheet CTA */}
              <div className="text-center">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT1400.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> ดาวน์โหลด Datasheet GT1400
                </a>
              </div>
            </div>
          )}

          {/* Tab: GT1300 Detail */}
          {activeTab === "gt1300" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img src="/images/gt1300/main.jpg" alt="GT1300 Industrial PC" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    3× HDMI · 6 COM · GPIO · 2.5G LAN · 9–36V
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">1300</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    3× HDMI Triple Display · 6 COM · GPIO — H-Series สำหรับงานหนัก
                  </p>
                </div>
              </div>

              {/* Description + Factory Gallery */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      Gen 8/9/10 H-Series · 3 HDMI · 6 COM · GPIO · 2.5G LAN
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">1300</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      GT1300 คอมพิวเตอร์อุตสาหกรรมระดับสูง รองรับ CPU H-Series Gen 8/9/10 (TDP 45W)
                      พร้อม 3× HDMI 1.4 Triple Display, 6 COM Port (2 ตัวเปลี่ยนเป็น RS422/RS485 ผ่าน BIOS),
                      GPIO 14 ช่อง (7 IN / 7 OUT), 2× Intel i225V 2.5G LAN,
                      ไฟเข้า 9–36V กว้าง เหมาะสำหรับ Industrial Robotics, Factory Automation, Surveillance
                    </p>
                  </div>

                  <ProductFeatures features={[
                    "Intel Gen 8/9/10 H-Series i5/i7 CPU (TDP 45W)",
                    "2× Intel i225V 2.5G LAN",
                    "6× DB9 COM (2× เปลี่ยนเป็น RS422/RS485 ผ่าน BIOS)",
                    "3× HDMI 1.4 Triple Display พร้อมกัน",
                    "GPIO 14 ช่อง (7 IN + 7 OUT)",
                    "2× DDR4 SO-DIMM สูงสุด 64GB",
                    "M-SATA + M.2 NVMe + SATA HDD พร้อมกัน",
                    "Fanless Aluminum Alloy — เงียบ 24 ชม.",
                    "ไฟ 9–36V (3-pin Phoenix Terminal) + ATX/AT",
                    "AWAL, Wake On LAN, Watchdog, RTC",
                  ]} />

                  <div className="p-4 border-t border-border text-center">
                  </div>

                  {/* Key Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-surface p-4 text-center">
                      <Cpu className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">CPU H-Series</div>
                      <div className="text-xs text-muted-foreground mt-1">i5-8400H / i7-8750H / i5-9400H / i7-9750H / i5-10200H / i7-10750H</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Server className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">RAM & Storage</div>
                      <div className="text-xs text-muted-foreground mt-1">2× DDR4 สูงสุด 64GB / M-SATA + NVMe + SATA</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Monitor className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">3× HDMI 1.4</div>
                      <div className="text-xs text-muted-foreground mt-1">Triple Display — แสดงผล 3 จอพร้อมกัน</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Shield className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">6 COM + GPIO</div>
                      <div className="text-xs text-muted-foreground mt-1">RS232/422/485 + GPIO 14ch + 2.5G LAN</div>
                    </div>
                  </div>
                </div>

                {/* Factory Gallery */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden">
                    <img src="/images/gt1300/main.jpg" alt="GT1300 ภาพหลัก" className="w-full object-contain p-4" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/gt1300/angle2.jpg", alt: "GT1300 ด้านหน้า" },
                      { src: "/images/gt1300/angle3.jpg", alt: "GT1300 ด้านบน" },
                      { src: "/images/gt1300/angle4.jpg", alt: "GT1300 ด้านล่าง" },
                      { src: "/images/gt1300/internal.jpg", alt: "GT1300 ภายใน" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden">
                        <img src={img.src} alt={img.alt} className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature Highlights + Ports — 2 คอลัมน์ */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface overflow-hidden rounded-xl">
                  <img src="/images/gt1300/feature-hdmi.png" alt="GT1300 Support 3x HDMI Triple Display" className="w-full h-auto rounded-xl"/>
                </div>
                <div className="card-surface overflow-hidden rounded-xl">
                  <img src="/images/gt1300/feature-dustproof.png" alt="GT1300 Industrial-Grade Dust-Proof and Corrosion-Resistant" className="w-full h-auto rounded-xl"/>
                </div>
              </div>

              {/* Ports Detail — 2 คอลัมน์ */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <h4 className="font-bold text-foreground mb-3 text-sm"><Plug size={16} className="inline mr-1 text-primary" />Ports — ด้านหน้า</h4>
                  <img src="/images/gt1300/ports-detail1.jpg" alt="GT1300 Ports ด้านหน้า" className="w-full rounded-lg"/>
                </div>
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <h4 className="font-bold text-foreground mb-3 text-sm"><Plug size={16} className="inline mr-1 text-primary" />Ports — ด้านหลัง</h4>
                  <img src="/images/gt1300/ports-detail2.jpg" alt="GT1300 Ports ด้านหลัง" className="w-full rounded-lg"/>
                </div>
              </div>

              {/* Dimension Drawing */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <h4 className="font-bold text-foreground mb-3 text-sm"><Ruler size={16} className="inline mr-1 text-primary" />Dimension Drawing</h4>
                  <img src="/images/gt1300/dimension.jpg" alt="GT1300 Dimension" className="w-full rounded-lg"/>
                </div>
              </div>

              {/* Spec 2 คอลัมน์ */}
              <div className="card-surface overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground"><FileText size={18} className="inline mr-1 text-primary" />GT1300 Specifications</h3>
                </div>
                <div className="grid md:grid-cols-2 md:divide-x divide-border">
                  <div className="divide-y divide-border">
                    {[
                      ["CPU", "1. i5-8400H 4C/8T 2.5–4.2GHz 8MB TDP 45W\n2. i7-8750H 6C/12T 2.2–4.1GHz 9MB TDP 45W\n3. i5-9400H 4C/8T 2.5–4.3GHz 8MB TDP 45W\n4. i7-9750H 6C/12T 2.6–4.5GHz 12MB TDP 45W\n5. i5-10200H 4C/8T 2.4–4.1GHz 8MB TDP 45W\n6. i7-10750H 6C/12T 4.8–5.0GHz 12MB TDP 45W"],
                      ["Chipset", "SOC"],
                      ["Memory", "2× SO-DIMM DDR4 สูงสุด 64GB"],
                      ["M-SATA", "1× M-SATA 3.0 (6Gb/s)"],
                      ["M.2 SSD", "1× M.2 NVMe 2280"],
                      ["SATA", "1× SATA 3.0 (6Gb/s) สำหรับ HDD/SSD"],
                      ["Display", "3× HDMI 1.4 (Triple Display)"],
                      ["LAN", "2× Intel i225V 2.5G RJ45"],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 p-3 bg-secondary/30 text-xs font-semibold text-foreground">{label}</div>
                        <div className="w-2/3 p-3 text-xs text-muted-foreground whitespace-pre-line">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      ["COM", "6× DB9 COM\n(2× รองรับ RS232/RS422/RS485 ผ่าน BIOS)"],
                      ["USB", "4× USB 2.0 + 2× USB 3.0"],
                      ["GPIO", "1× GPIO (7 IN + 7 OUT)"],
                      ["WiFi/BT", "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม\nMini PCIe 3G/4G + SIM Slot"],
                      ["Power", "9V–36V DC (3-pin Phoenix Terminal)\n+ 2-pin Phoenix + ATX/AT Switch"],
                      ["Audio", "1× MIC + 1× SPK"],
                      ["Temp Range", "-20°C ~ +60°C (Operating)"],
                      ["Size / Weight", "240 × 150 × 65mm / 2kg"],
                      ["Functions", "AWAL, Wake On LAN, Watchdog, RTC"],
                      ["OS", "Windows 10/11, WES 10, Linux"],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 p-3 bg-secondary/30 text-xs font-semibold text-foreground">{label}</div>
                        <div className="w-2/3 p-3 text-xs text-muted-foreground whitespace-pre-line">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Datasheet CTA */}
              <div className="text-center">
                <a
                  href="http://www.greenthinpc.com/productinfo/954397.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <ExternalLink size={16} /> ดูข้อมูลเพิ่มเติม GT1300 (Manufacturer)
                </a>
              </div>

              {useCasesGrid}

              {/* Intro Video */}
              <div className="card-surface overflow-hidden rounded-xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">วิดีโอ GT1300</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/ocai7eLpMOY"

                    title="GT1300 Intro"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"></iframe>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">GT1300 Introduction</span>
                  <ShareButtons url="https://youtu.be/ocai7eLpMOY" title="GT1300 Introduction" compact />
                </div>
              </div>

              {/* More Videos */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "7wE6fxMpJB4", label: "ภาพรวม GT Series" },
                  { id: "31SEStppvKw", label: "GT Series Overview" },
                  { id: "lh3lgfVCwUQ", label: "GT1300 เพิ่มเติม" },
                ].map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden rounded-xl">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"></iframe>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{v.label}</span>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.label} compact />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: GT1200 Detail */}
          {activeTab === "gt1200" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Banner */}
              <div className="card-surface overflow-hidden rounded-2xl relative min-h-[220px] md:min-h-[300px] flex items-center">
                <img src="/images/gt1200/main.jpg" alt="GT1200 Industrial PC" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 p-8 md:p-12">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 backdrop-blur-sm border border-primary/30">
                    Dual LAN · 2 COM · VGA+HDMI · SIM 4G · TDP 28W
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    GT<span className="text-primary">1200</span>
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                    Dual LAN Compact Fanless IPC — คอมแพกต์ ประหยัดพลังงาน
                  </p>
                </div>
              </div>

              {/* Description + Factory Gallery */}
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                      Gen 4/6/7/8/10 · Dual LAN · VGA+HDMI · SIM 4G
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      GT<span className="text-gradient">1200</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      GT1200 คอมพิวเตอร์อุตสาหกรรมขนาดกะทัดรัด รองรับ CPU ตั้งแต่ Gen 4 ถึง Gen 10
                      ตัวเครื่องอลูมิเนียมอัลลอยด์ระบายความร้อนแบบ Fanless ทำงาน 24 ชม.
                      พร้อม Dual LAN, 2 COM RS232, VGA+HDMI Dual Display, SIM 4G/WiFi
                      เหมาะกับงาน KIOSK, Digital Signage, Factory Automation, IoT
                    </p>
                  </div>

                  <ProductFeatures features={[
                    "Intel Gen 4/6/7/8/10 Core i3/i5/i7 CPU (Onboard)",
                    "2× RJ45 Intel Gigabit LAN + 2× DB9 RS232 COM",
                    "VGA + HDMI 1.4 Dual Display พร้อมกัน",
                    "SIM Card Slot สำหรับ 3G/4G WiFi",
                    "Fanless Aluminum Alloy — เงียบสนิท 24 ชม.",
                    "TDP เพียง 28W ประหยัดพลังงาน",
                    "AWAL, Wake On LAN, Watchdog, RTC",
                    "Wall Mount ได้ — ขนาดเล็กเพียง 193.9×127×57.2mm",
                  ]} />

                  {/* Key Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-surface p-4 text-center">
                      <Cpu className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">CPU</div>
                      <div className="text-xs text-muted-foreground mt-1">i3-6157U / i5-4278U / i5-7287U / i7-4578U</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Server className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">RAM</div>
                      <div className="text-xs text-muted-foreground mt-1">DDR3L / DDR4 สูงสุด 64GB</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Monitor className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">Dual Display</div>
                      <div className="text-xs text-muted-foreground mt-1">VGA + HDMI 1.4 — 2 จอพร้อมกัน</div>
                    </div>
                    <div className="card-surface p-4 text-center">
                      <Shield className="mx-auto text-primary mb-2" size={24} />
                      <div className="font-bold text-foreground text-sm">2 LAN + 2 COM</div>
                      <div className="text-xs text-muted-foreground mt-1">Realtek Gigabit + RS232 + SIM 4G</div>
                    </div>
                  </div>
                </div>

                {/* Factory Gallery */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="card-surface overflow-hidden">
                    <img src="/images/gt1200/main.jpg" alt="GT1200 ภาพหลัก" className="w-full object-contain p-4" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { src: "/images/gt1200/front.jpg", alt: "GT1200 ด้านหน้า" },
                      { src: "/images/gt1200/side.jpg", alt: "GT1200 ด้านข้าง" },
                      { src: "/images/gt1200/top.jpg", alt: "GT1200 ด้านบน" },
                      { src: "/images/gt1200/internal.jpg", alt: "GT1200 ภายใน" },
                    ].map((img, i) => (
                      <div key={i} className="card-surface overflow-hidden">
                        <img src={img.src} alt={img.alt} className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ports & Dimension — 2 คอลัมน์ */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <h4 className="font-bold text-foreground mb-3 text-sm"><Plug size={16} className="inline mr-1 text-primary" />Ports — ด้านหน้า</h4>
                  <img src="/images/gt1200/ports-front.jpg" alt="GT1200 Ports ด้านหน้า" className="w-full rounded-lg"/>
                </div>
                <div className="card-surface p-4 overflow-hidden rounded-xl">
                  <h4 className="font-bold text-foreground mb-3 text-sm"><Plug size={16} className="inline mr-1 text-primary" />Ports — ด้านหลัง</h4>
                  <img src="/images/gt1200/ports-rear.jpg" alt="GT1200 Ports ด้านหลัง" className="w-full rounded-lg"/>
                </div>
              </div>

              {/* Spec 2 คอลัมน์ */}
              <div className="card-surface overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-foreground"><FileText size={18} className="inline mr-1 text-primary" />GT1200 Specifications</h3>
                </div>
                <div className="grid md:grid-cols-2 md:divide-x divide-border">
                  <div className="divide-y divide-border">
                    {[
                      ["CPU", "1. Intel Core i3-6157U 2.4GHz 2C/4T 3MB TDP 28W\n2. Intel Core i5-4278U 2.6–3.1GHz 2C/4T 3MB TDP 28W\n3. Intel Core i5-7287U 3.3–3.7GHz 2C/4T 4MB TDP 28W\n4. Intel Core i7-4578U 3.0–3.5GHz 2C/4T 4MB TDP 28W"],
                      ["TDP", "28W"],
                      ["Chipset", "Intel Sunrise Point-LP / Skylake-U"],
                      ["Memory", "Gen 4: 1× SO-DIMM DDR3L (4–8GB)\nGen 6/7/8: 1× SO-DIMM DDR4 (4–32GB)\nGen 8/10: 2× SO-DIMM DDR4 (สูงสุด 64GB)"],
                      ["SSD", "Gen 4: M-SATA 3.0 (6Gb/s)\nGen 6/7/8/10: M.2 NVMe/NGFF 2280"],
                      ["SATA", "1× SATA 3.0 สำหรับ HDD/SSD (6Gb/s)"],
                      ["Display", "1× VGA + 1× HDMI 1.4 (Dual Display)"],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 p-3 bg-secondary/30 text-xs font-semibold text-foreground">{label}</div>
                        <div className="w-2/3 p-3 text-xs text-muted-foreground whitespace-pre-line">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      ["LAN", "2× Realtek RTL8111 Gigabit (10/100/1000Mbps)"],
                      ["COM", "2× DB9 RS232"],
                      ["USB", "4× USB 2.0 + 4× USB 3.0"],
                      ["WiFi/BT", "Built-in Dual Antenna\nWiFi 5 (802.11ac) — ฟรีมาพร้อมเครื่อง\nWiFi 6 (802.11ax) — Option เสริม\nBluetooth — Option เสริม\nMini PCIe 3G/4G + SIM Slot"],
                      ["Audio", "1× MIC + 1× SPK"],
                      ["Power", "DC 12V–19V (แนะนำ 12V/5A)"],
                      ["Temp Range", "-20°C ~ +60°C (Operating)"],
                      ["Size / Weight", "193.9 × 127 × 57.2mm / 1kg"],
                      ["Functions", "AWAL, Wake On LAN, Watchdog, RTC"],
                      ["OS", "Windows 7/8/10/11, Linux"],
                    ].map(([label, value], i) => (
                      <div key={i} className="flex">
                        <div className="w-1/3 p-3 bg-secondary/30 text-xs font-semibold text-foreground">{label}</div>
                        <div className="w-2/3 p-3 text-xs text-muted-foreground whitespace-pre-line">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dimension Drawings */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card-surface p-4 overflow-hidden">
                  <img src="/images/gt1200/dimension1.jpg" alt="GT1200 Dimension Front" className="w-full rounded-lg"/>
                </div>
                <div className="card-surface p-4 overflow-hidden">
                  <img src="/images/gt1200/dimension2.jpg" alt="GT1200 Dimension Side" className="w-full rounded-lg"/>
                </div>
              </div>

              {/* GT1200 Price Table — Paginated */}
              {(() => {
                const gt1200Prices = [
                  { cpu: "i3-6157U (DDR4)", ram: "4 GB", ssd: "128 GB", price: "13,390" },
                  { cpu: "i3-6157U (DDR4)", ram: "4 GB", ssd: "256 GB", price: "14,390" },
                  { cpu: "i3-6157U (DDR4)", ram: "8 GB", ssd: "128 GB", price: "13,690" },
                  { cpu: "i3-6157U (DDR4)", ram: "8 GB", ssd: "256 GB", price: "14,590" },
                  { cpu: "i3-6157U (DDR4)", ram: "16 GB", ssd: "256 GB", price: "Call" },
                  { cpu: "i3-6157U (DDR4)", ram: "8 GB", ssd: "512 GB", price: "Call" },
                  { cpu: "i5-4278U (DDR3L)", ram: "4 GB", ssd: "128 GB", price: "14,690" },
                  { cpu: "i5-4278U (DDR3L)", ram: "4 GB", ssd: "256 GB", price: "15,390" },
                  { cpu: "i5-4278U (DDR3L)", ram: "8 GB", ssd: "128 GB", price: "14,890" },
                  { cpu: "i5-4278U (DDR3L)", ram: "8 GB", ssd: "256 GB", price: "15,590" },
                  { cpu: "i5-4278U (DDR3L)", ram: "8 GB", ssd: "512 GB", price: "18,090" },
                  { cpu: "i5-4278U (DDR3L)", ram: "8 GB", ssd: "2 TB", price: "24,790" },
                  { cpu: "i5-7287U (DDR4)", ram: "4 GB", ssd: "128 GB", price: "16,090" },
                  { cpu: "i5-7287U (DDR4)", ram: "4 GB", ssd: "256 GB", price: "16,990" },
                  { cpu: "i5-7287U (DDR4)", ram: "8 GB", ssd: "128 GB", price: "16,590" },
                  { cpu: "i7-4578U (DDR3L)", ram: "4 GB", ssd: "128 GB", price: "15,790" },
                  { cpu: "i7-4578U (DDR3L)", ram: "4 GB", ssd: "256 GB", price: "16,490" },
                  { cpu: "i7-4578U (DDR3L)", ram: "8 GB", ssd: "128 GB", price: "15,990" },
                  { cpu: "i7-4578U (DDR3L)", ram: "8 GB", ssd: "256 GB", price: "16,890" },
                  { cpu: "i7-4578U (DDR3L)", ram: "8 GB", ssd: "512 GB", price: "18,890" },
                ];
                const perPage = 10;
                const totalPages = Math.ceil(gt1200Prices.length / perPage);
                const pageItems = gt1200Prices.slice(gt1200PricePage * perPage, (gt1200PricePage + 1) * perPage);

                return (
                  <div className="card-surface overflow-hidden">
                    <div className="p-5 border-b border-border">
                      <h3 className="text-lg font-display font-bold text-foreground"><DollarSign size={18} className="inline mr-1 text-primary" />GT1200 Price List</h3>
                      <p className="text-sm text-muted-foreground mt-1">เลือก CPU / RAM / SSD ที่เหมาะกับงาน — ทุกรุ่นพร้อม WiFi ({gt1200Prices.length} รายการ)</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                           <tr className="bg-muted/50">
                             <th className="text-left p-3 font-semibold text-foreground">CPU</th>
                             <th className="text-left p-3 font-semibold text-foreground">RAM</th>
                             <th className="text-left p-3 font-semibold text-foreground">SSD</th>
                             <th className="text-right p-3 font-semibold text-foreground">ราคา (฿)</th>
                             <th className="text-center p-3 font-semibold text-foreground">สั่งซื้อ</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-border">
                           {pageItems.map((item, i) => {
                             const specLabel = `GT1200 ${item.cpu} / ${item.ram} / ${item.ssd}`;
                             return (
                             <tr key={i} className="hover:bg-muted/30 transition-colors">
                               <td className="p-3 font-medium text-foreground">{item.cpu}</td>
                               <td className="p-3 text-muted-foreground">{item.ram}</td>
                               <td className="p-3 text-muted-foreground">{item.ssd}</td>
                               <td className="p-3 text-right font-bold text-primary">{item.price === "Call" ? "Call" : `฿${item.price}`}</td>
                               <td className="p-3 text-center whitespace-nowrap">
                                 <div className="inline-flex items-center gap-1">
                                   <AddToCartButton productModel="GT1200" productName={specLabel} iconOnly variant="outline" />
                                   <QuoteRequestButton productModel="GT1200" productName={specLabel} iconOnly variant="outline" />
                                   <ChatNowButton productModel="GT1200" productName={specLabel} />
                                 </div>
                               </td>
                             </tr>
                             );
                           })}
                         </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        หน้า {gt1200PricePage + 1} / {totalPages}
                      </span>
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, p) => (
                          <button
                            key={p}
                            onClick={() => setGt1200PricePage(p)}
                            className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                              p === gt1200PricePage
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                            }`}>
                            {p + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="px-5 py-3 border-t border-border bg-muted/30">
                      <p className="text-xs text-muted-foreground">
                        <AlertTriangle size={14} className="inline mr-1 text-amber-500" /> ราคาอาจมีการเปลี่ยนแปลงได้โดยไม่ต้องแจ้งล่วงหน้า กรุณาติดต่อฝ่ายขายเพื่อยืนยันราคาและโปรโมชันล่าสุด
                      </p>
                    </div>
                  </div>
                );
              })()}
              <div className="text-center">
              </div>

              {useCasesGrid}

              {/* Intro Video */}
              <div className="card-surface overflow-hidden rounded-xl">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Play className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">วิดีโอ GT1200</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/S-plrWGzUl8"

                    title="GT1200 Intro"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"></iframe>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">GT1200 Introduction</span>
                  <ShareButtons url="https://youtu.be/S-plrWGzUl8" title="GT1200 Introduction" compact />
                </div>
              </div>

              {/* More Videos */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "AHqLg4snV9g", label: "GT1200 รายละเอียด" },
                  { id: "BeBLhDEHGm0", label: "GT1200 เพิ่มเติม" },
                  { id: "oaO5iOhTw9E", label: "GT1200 Overview" },
                ].map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden rounded-xl">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"></iframe>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">{v.label}</span>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.label} compact />
                    </div>
                  </div>
                ))}
              </div>

              {/* Podcast */}
              <div className="card-surface rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones className="text-primary" size={20} />
                  <h3 className="text-lg font-display font-bold text-foreground">🎙️ Podcast — GT1200</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { file: "GT1200_Intro.wav", label: "GT1200 Introduction" },
                    { file: "GT1200_Detail.wav", label: "GT1200 Detail" },
                  ].map((p) => (
                    <div key={p.file} className="p-4 rounded-xl bg-secondary/40 border border-border">
                      <p className="text-sm font-bold text-foreground mb-1">{p.label}</p>
                      <audio controls className="w-full mt-2 h-10" preload="metadata">
                        <source src={`/audio/${p.file}`} type="audio/wav" />
                      </audio>
                      <div className="mt-2">
                        <ShareButtons url={`${window.location.origin}/gt-series?tab=gt1200`} title={`Podcast ${p.label}`} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datasheet CTA */}
              <div className="text-center">
                <a
                  href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/GT1200.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  <Download size={16} /> ดาวน์โหลด Datasheet GT1200
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Windows Options */}
      <section className="section-padding bg-surface/50">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Windows & <span className="text-gradient">Options</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">เพิ่มเติมได้ตามต้องการ</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Windows License */}
            <div className="card-surface overflow-hidden">
              <div className="p-3 border-b border-border bg-primary/5">
                <h3 className="text-sm font-display font-bold text-foreground"><Laptop size={16} className="inline mr-1 text-primary" />Windows License</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { name: "Windows 10 Pro OEM", price: "฿3,950" },
                  { name: "Windows 11 Pro OEM", price: "฿4,590" },
                  { name: "Windows 10 IoT", price: "฿3,950" },
                  { name: "Windows 11 IoT", price: "฿4,590" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center px-3 py-2 hover:bg-secondary/30 transition-colors">
                    <span className="text-xs text-foreground">{item.name}</span>
                    <span className="text-xs font-bold text-primary">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Hardware Options */}
            <div className="card-surface overflow-hidden">
              <div className="p-3 border-b border-border bg-primary/5">
                <h3 className="text-sm font-display font-bold text-foreground"><Wrench size={16} className="inline mr-1 text-primary" />Hardware Options</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { name: "Upgrade WiFi AC → WiFi 6 (802.11ax)", price: "Call" },
                  { name: "Bluetooth Module", price: "Call" },
                  { name: "4G LTE SIM Module", price: "Call" },
                  { name: "5G SIM Module", price: "Call" },
                  { name: "ซื้อประกันเพิ่ม ปีที่ 2", price: "+15%" },
                  { name: "ซื้อประกันเพิ่ม ปีที่ 3", price: "+20%" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center px-3 py-2 hover:bg-secondary/30 transition-colors">
                    <span className="text-xs text-foreground">{item.name}</span>
                    <span className="text-xs font-bold text-primary">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* GT Series Banner */}
      <section className="section-padding bg-surface/50">
        <div className="container max-w-7xl mx-auto">
          <div className="card-surface overflow-hidden">
            <img
              src="/images/wix/3e5003_9a0970ee1f4f4d9aa2f4f3fef18faeb5_b40f0eb8.jpg"
              alt="GT Series รวม"
              className="w-full h-auto"/>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container max-w-3xl mx-auto text-center">
          <Cpu className="mx-auto mb-4 text-primary" size={40} />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            สนใจ GT Series?<span className="text-gradient"> ปรึกษาเรา</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            ให้ทีมผู้เชี่ยวชาญช่วยเลือกรุ่นที่เหมาะกับงานของคุณ
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <QuoteRequestButton
              productModel="GT Series"
              productName="Mini PC Industrial Computer"
              size="lg"
              className="px-8 py-4 text-lg font-bold"
            />
            <button
              onClick={() => setShowLineQR(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[hsl(142,70%,45%)] text-white font-bold text-lg hover:opacity-90 transition-opacity">
              LINE @entgroup
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-bold text-lg hover:bg-surface-hover transition-colors">
              <ArrowLeft size={18} /> กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="section-padding">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Customer Reviews</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              ลูกค้าพูดถึง<span className="text-gradient"> GT Series</span>
            </h2>
            <p className="text-muted-foreground mt-3">เสียงจากผู้ใช้งานจริงในหลากหลายอุตสาหกรรม</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                stars: 5,
                text: "ใช้ GT3000 ติดตั้งในตู้คอนโทรลโรงงานมา 3 ปี ทำงาน 24/7 ไม่เคยดับ ไม่มีพัดลมจึงไม่ดูดฝุ่น แก้ปัญหาเครื่องพังจากฝุ่นเหล็กได้หมด ประหยัดค่าซ่อมไปมาก",
                role: "ผู้จัดการฝ่ายวิศวกรรม",
                industry: "โรงงานเหล็กและโลหะ",
              },
              {
                stars: 5,
                text: "GT6000 ใช้เป็นเครื่อง Kiosk ให้บริการลูกค้าหน้าร้าน เปิดทิ้งไว้ทั้งวัน ไม่มีเสียงรบกวน ลูกค้าชม ว่าระบบลื่นไหล ทีมช่างก็ชอบที่ติดตั้งง่ายใช้เวลาไม่ถึงชั่วโมง",
                role: "ผู้จัดการสาขา",
                industry: "ธุรกิจค้าปลีก",
              },
              {
                stars: 5,
                text: "เลือก GT9000 สำหรับงาน AI Vision Inspection บนไลน์ผลิต ประมวลผลภาพเร็วมาก ทนความร้อนในโรงงานได้ดี ไม่ต้องติดแอร์เพิ่ม ลดต้นทุนได้เยอะ",
                role: "วิศวกร AI",
                industry: "โรงงานอิเล็กทรอนิกส์",
              },
              {
                stars: 4,
                text: "ติดตั้ง GT2000 จำนวน 20 เครื่องเป็นระบบ Thin Client ทดแทนเดสก์ท็อป ประหยัดไฟลดลง 60% ดูแลง่ายมาก ปัญหาเครื่องค้างแทบไม่มี ทีม IT ทำงานสบายขึ้นเยอะ",
                role: "CTO",
                industry: "บริษัทซอฟต์แวร์",
              },
              {
                stars: 5,
                text: "GT4500 ใช้ในห้อง Server ควบคุมระบบ Building Automation ทนร้อน ทนเย็น เสียบปุ๊บทำงานปั๊บ เสถียรมาก ลดเวลา Downtime จากเดิมเดือนละ 2-3 ครั้ง เหลือ 0 ครั้ง",
                role: "Facility Manager",
                industry: "อาคารสำนักงาน",
              },
            ].map((review, i) => (
              <div key={i} className="card-surface p-6 relative group hover:border-primary/30 transition-colors">
                <Quote className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors" size={40} />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s < review.stars ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{review.text}"</p>
                <div className="border-t border-border pt-3">
                  <p className="text-sm font-semibold text-foreground">{review.role}</p>
                  <p className="text-xs text-muted-foreground">{review.industry}</p>
                </div>
              </div>
            ))}
          </div>

          {/* PDPA Disclaimer */}
          <div className="mt-8 p-5 rounded-xl border border-primary/20 bg-primary/5 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground"><FileText size={14} className="inline mr-1 text-primary" />หมายเหตุ:</span> ด้วยข้อบังคับตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) เราไม่สามารถเปิดเผยชื่อ-นามสกุล หรือข้อมูลที่ระบุตัวตนของลูกค้าได้
              คำชมเหล่านี้เป็น <span className="font-semibold text-foreground">คำรีวิวจริง</span> ที่ได้รับจากลูกค้าผู้ใช้งานจริง ผ่านการทำงานหนักและบริการอย่างจริงใจของทีมเรา
            </p>
          </div>
        </div>
      </section>
      <B2BMarketingShowcase variant="muted" />
      <B2BCTABanner variant="compact" />
      <FooterCompact />
      <LineQRDialog open={showLineQR} onClose={() => setShowLineQR(false)} />
    </div>
  );
};

/* M

      <FooterCompact />odel Card Component */
const ModelCard = ({ model, onQuote, selected, onToggleSelect }: { model: typeof gtModels[0]; onQuote?: (name: string) => void; selected?: boolean; onToggleSelect?: (name: string) => void }) => (
  <>
    <div className="relative bg-secondary/50 p-6 flex items-center justify-center min-h-[200px]">
      {onToggleSelect && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSelect(model.name); }}
          className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm rounded p-0.5">
          <Checkbox checked={selected} className="h-5 w-5" />
        </button>
      )}
      {model.badge ? (
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold border border-primary/20 animate-pulse">
          {model.highlight}
        </span>
      ) : (
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-[11px] font-medium border border-border">
          {model.highlight}
        </span>
      )}
      <img
        src={model.image}
        alt={model.name}
        className="max-h-[160px] object-contain group-hover:scale-105 transition-transform duration-300"/>
    </div>
    <div className="p-5">
      <h3 className="text-xl font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
        {model.name}
        {model.tab && <span className="text-xs text-primary font-normal">ดูรายละเอียด →</span>}
        {!model.tab && <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}

      </h3>
      <p className="text-xs font-semibold text-primary mb-3">"{model.tagline}"</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <Cpu size={14} className="text-primary mt-0.5 shrink-0" />
          <span className="text-muted-foreground">{model.cpu}</span>
        </div>
        <div className="flex items-start gap-2">
          <Server size={14} className="text-primary mt-0.5 shrink-0" />
          <span className="text-muted-foreground">RAM {model.ram} / {model.storage}</span>
        </div>
        <div className="flex items-start gap-2">
          <Zap size={14} className="text-primary mt-0.5 shrink-0" />
          <span className="text-muted-foreground">{model.ports}</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          {model.price ? (
            <div>
              <span className="text-sm text-muted-foreground">เริ่มต้น </span>
              <span className="font-bold text-foreground">{model.price.startsWith("สอบถาม") ? model.price : `฿${model.price}`}</span>
            </div>
          ) : <div />}
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <QuoteRequestButton
            productModel={model.name}
            productName={`${model.name} — ${model.tagline}`}
            size="sm"
            className="flex-1"
          />
          <AddToCartButton
            productModel={model.name}
            productName={`${model.name} — ${model.tagline}`}
            productDescription={`CPU: ${model.cpu} | RAM: ${model.ram} | Storage: ${model.storage} | Ports: ${model.ports}`}
            estimatedPrice={model.price && !model.price.startsWith("สอบถาม") ? Number(model.price.replace(/,/g, '')) : undefined}
            size="sm"
            variant="outline"
            iconOnly
          />
          <ChatNowButton
            productModel={model.name}
            productName={`${model.name} — ${model.tagline}`}
          />
        </div>
      </div>
    </div>
  </>
);

export default GTSeries;


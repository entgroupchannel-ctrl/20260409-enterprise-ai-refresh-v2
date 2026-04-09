import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Cpu, Thermometer, Shield, Usb, Wifi, Download, Search,
  FileText, ChevronRight, Layers, HardDrive, Monitor, Zap, Box,
  Factory, Stethoscope, Truck, ScanLine, Tv, Warehouse, Sparkles,
  SlidersHorizontal, ArrowUpDown, LayoutGrid, Flame, Globe, Radio, Car, Eye, Pointer,
  Play, ThumbsUp, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FooterCompact from "@/components/FooterCompact";
import B2BCTABanner from "@/components/B2BCTABanner";
import ShareButtons from "@/components/ShareButtons";
import IBoxProductCard from "@/components/ibox/IBoxProductCard";
import IBoxProductFilter, { type IBoxFilterState, defaultFilters, portFilters } from "@/components/ibox/IBoxProductFilter";
import ActiveFilterChips from "@/components/ibox/ActiveFilterChips";
import { iboxProducts } from "@/data/ibox-products";
import bannerIBox from "@/assets/banner-ibox-series.jpg";
import usecaseAutomation from "@/assets/ibox-usecase-automation.jpg";
import usecaseMedical from "@/assets/ibox-usecase-medical.jpg";
import usecaseLogistics from "@/assets/ibox-usecase-logistics.jpg";
import usecaseWarehouse from "@/assets/ibox-usecase-warehouse.jpg";
import usecaseVision from "@/assets/ibox-usecase-vision.jpg";
import usecaseSignage from "@/assets/ibox-usecase-signage.jpg";

/* ═══════ Product Data ═══════ */
const iboxModels = [
  {
    id: "ibox-501",
    name: "iBox-501",
    cpu: "Intel Celeron Haswell 2980U Dual Core 1.6GHz",
    ram: "4 GB (ปรับแต่งได้)",
    storage: "SSD 128 GB (ปรับแต่งได้)",
    material: "High-quality All Aluminum",
    os: "Windows 7/8/10, Linux",
    image: "/images/wix/0597a3_f038b57570074d0ab2559ba322f4bc66_fcfaecb9.png",
    datasheet: "/datasheets/3e5003_b0548d5e72e7462280dccc86e8c7cb2a.pdf",
  },
  {
    id: "ibox-502",
    name: "iBox-502",
    cpu: "Intel Celeron Kaby Lake R 3867U Dual Core 1.8GHz",
    ram: "4 GB (ปรับแต่งได้)",
    storage: "SSD 128 GB (ปรับแต่งได้)",
    material: "High-quality All Aluminum",
    os: "Windows 7/8/10, Linux",
    image: "/images/wix/0597a3_9a7f36ff7ec74fe9a0948c574d3a11e7_2eb0b7ec.png",
    datasheet: "/datasheets/3e5003_1e76bd9247c54a28bb0c630fae6dcad8.pdf",
  },
  {
    id: "ibox-601",
    name: "iBox-601",
    cpu: "Intel Core 6th Gen Skylake",
    ram: "4 GB (ปรับแต่งได้)",
    storage: "SSD 128 GB (ปรับแต่งได้)",
    material: "High-quality All Aluminum",
    os: "Windows 7/8/10, Linux",
    image: "/images/wix/0597a3_d29508368a6a4e8f818fddbf462bc218_962966db.png",
    datasheet: "/datasheets/3e5003_36bb8c0aa3a44ae9a6ccec667b54005e.pdf",
  },
  {
    id: "ibox-602",
    name: "iBox-602",
    cpu: "Intel Core 6th Gen Skylake",
    ram: "4 GB (ปรับแต่งได้)",
    storage: "SSD 128 GB (ปรับแต่งได้)",
    material: "High-quality All Aluminum",
    os: "Windows 7/8/10, Linux",
    image: "/images/wix/0597a3_58cd008689cf4744a2bd3ef684f1c79a_49b41a8f.png",
    datasheet: "/datasheets/3e5003_9289dac0610049208615e01b2f80c682.pdf",
  },
  {
    id: "ibox-603",
    name: "iBox-603",
    cpu: "Intel Core 6th Gen Skylake",
    ram: "4 GB (ปรับแต่งได้)",
    storage: "SSD 128 GB (ปรับแต่งได้)",
    material: "High-quality Pure Aluminum",
    os: "Windows 7/8/10, Linux",
    image: "/images/wix/0597a3_6683a1156b064f5f9b0cd7ad4ec1ae1b_052daa0e.png",
    datasheet: "/datasheets/3e5003_86c393dde53a43c8adaf43cb3ce70ef1.pdf",
  },
  {
    id: "ibox-701",
    name: "iBox-701",
    cpu: "Intel Core i5-7200U",
    ram: "4 GB (ปรับแต่งได้)",
    storage: "SSD 128 GB (ปรับแต่งได้)",
    material: "High-quality All Aluminum",
    os: "Windows 7/8/10, Linux",
    image: "/images/wix/0597a3_d29cb490908741ba9094eef2a7ea3904_356a710c.png",
    datasheet: "/datasheets/3e5003_bf46946caa4445628a239edbc4fd34f8.pdf",
  },
  {
    id: "ibox-801",
    name: "iBox-801",
    cpu: "Intel Celeron / Core i5-8265U / Core i7-8565U",
    ram: "8 GB (ปรับแต่งได้)",
    storage: "SSD 256 GB (ปรับแต่งได้)",
    material: "High-quality All Aluminum",
    os: "Windows 10, Linux",
    image: "/images/wix/0597a3_d29508368a6a4e8f818fddbf462bc218_962966db.png",
    datasheet: "/datasheets/3e5003_5ba59ebf63494b12a4a8a0a6bb151b82.pdf",
  },
];

const highlights = [
  { icon: Thermometer, title: "ทนอุณหภูมิ -20°C ถึง 60°C", desc: "ออกแบบให้ทำงานได้ในสภาพแวดล้อมที่มีอุณหภูมิสูงหรือต่ำ" },
  { icon: Zap, title: "Fanless — ไร้พัดลม", desc: "ครีบระบายความร้อนอะลูมิเนียม ไม่มีพัดลม ลดปัญหาฝุ่นและเสียง" },
  { icon: Layers, title: "PCI Express Expansion", desc: "เพิ่มการ์ดได้ รองรับการขยายระบบผ่าน PCI Express" },
  { icon: Usb, title: "USB มากถึง 8 ช่อง", desc: "เชื่อมต่ออุปกรณ์ต่อพ่วงได้หลากหลายพร้อมกัน" },
  { icon: Wifi, title: "รองรับ SIM 3G/4G", desc: "เชื่อมต่อเครือข่ายมือถือได้ (Optional)" },
  { icon: Shield, title: "Body อะลูมิเนียมเกรดสูง", desc: "แข็งแรง ทนทาน น้ำหนักเบา ระบายความร้อนได้ดีเยี่ยม" },
];

const features = [
  "Auto Power On — เปิดเครื่องอัตโนมัติเมื่อมีไฟเข้า",
  "Timing Boot — ตั้งเวลาเปิดเครื่องล่วงหน้า",
  "PXE Boot — เปิดเครื่องผ่านระบบเครือข่าย",
  "Watchdog Timer — ตรวจสอบความผิดปกติอัตโนมัติ",
  "รองรับ Windows 7/8/10 และ Linux",
  "รับประกันสินค้า 1 ปี (Carry-in)",
];

const useCasesData = [
  {
    title: "Industrial Automation",
    desc: "ควบคุมระบบ PLC, SCADA และ HMI บนสายการผลิต ทนฝุ่นและความร้อนในโรงงาน",
    icon: Factory,
    image: usecaseAutomation,
  },
  {
    title: "Medical & Healthcare",
    desc: "ระบบ EMR, มอนิเตอร์สัญญาณชีพ และเวชระเบียนอิเล็กทรอนิกส์ในโรงพยาบาล",
    icon: Stethoscope,
    image: usecaseMedical,
  },
  {
    title: "Logistics & Transportation",
    desc: "ศูนย์ควบคุมการขนส่ง ติดตามยานพาหนะ บริหารเส้นทางแบบ Real-time",
    icon: Truck,
    image: usecaseLogistics,
  },
  {
    title: "Warehouse Management",
    desc: "ระบบจัดการคลังสินค้า สแกนบาร์โค้ด ตรวจนับสต็อกอัตโนมัติ",
    icon: Warehouse,
    image: usecaseWarehouse,
  },
  {
    title: "Machine Vision",
    desc: "ตรวจสอบคุณภาพชิ้นงานบนสายพาน ด้วยกล้องอุตสาหกรรมและ AI",
    icon: ScanLine,
    image: usecaseVision,
  },
  {
    title: "Digital Signage",
    desc: "ป้ายโฆษณาดิจิทัลในห้าง ร้านค้า สนามบิน แสดงผลต่อเนื่อง 24/7",
    icon: Tv,
    image: usecaseSignage,
  },
];

/* ═══════ Component ═══════ */
const IBoxSeries = () => {
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filters, setFilters] = useState<IBoxFilterState>({ ...defaultFilters });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...iboxProducts];

    // Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.nameTH.includes(search) ||
          p.id.toLowerCase().includes(s) ||
          p.specs.cpu.toLowerCase().includes(s)
      );
    }

    // Category
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // CPU Gen
    if (filters.cpuGen !== "all") {
      result = result.filter((p) => {
        if (filters.cpuGen === "ARM") {
          return p.specs.cpuGen?.includes("ARM") || p.specs.cpu.toLowerCase().includes("arm");
        }
        return p.specs.cpuGen === filters.cpuGen;
      });
    }

    // COM Ports
    if (filters.comPorts !== "all") {
      const pf = portFilters.comPorts.find((x) => x.id === filters.comPorts);
      if (pf) result = result.filter((p) => (p.specs.comPorts ?? 0) >= pf.min && (p.specs.comPorts ?? 0) <= pf.max);
    }

    // LAN Ports
    if (filters.lanPorts !== "all") {
      const pf = portFilters.lanPorts.find((x) => x.id === filters.lanPorts);
      if (pf) result = result.filter((p) => (p.specs.lanPorts ?? 0) >= pf.min && (p.specs.lanPorts ?? 0) <= pf.max);
    }

    // PoE / PCIe
    if (filters.poe === true) result = result.filter((p) => p.specs.poe);
    if (filters.pcie === true) result = result.filter((p) => p.specs.pcie);

    // Form Factor
    if (filters.formFactor !== "all") result = result.filter((p) => p.formFactor === filters.formFactor);

    // Performance
    if (filters.performance !== "all") result = result.filter((p) => p.performance === filters.performance);

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [search, filters, sortBy]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="iBox Series — Embedded Fanless Industrial PC" description="iBox Series คอมพิวเตอร์อุตสาหกรรมแบบ Fanless ขนาดกะทัดรัด รองรับ Intel N-Series ถึง Core i7 สำหรับ Edge Computing, IoT Gateway, Digital Signage" path="/ibox-series" />
      <ProductJsonLd
        collectionName="iBox Series Embedded Fanless Industrial PC"
        >
        collectionDescription="iBox Series คอมพิวเตอร์อุตสาหกรรม Fanless ขนาดกะทัดรัด สำหรับ Edge Computing, IoT Gateway, Digital Signage"
        collectionUrl="/ibox-series"
        products={iboxProducts.map(m => ({ name: m.name, image: m.image, description: m.specs.cpu, category: "Embedded Fanless Industrial PC" }))}
      />
      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "iBox Series", path: "/ibox-series" }]} />

      {/* Banner */}
      >
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={bannerIBox} alt="iBox Series — Industrial Mini PC" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container max-w-7xl mx-auto px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-3">
              <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">iBox Series</h1>
            <p className="text-sm md:text-base text-white/80">Industrial Mini PC — คอมพิวเตอร์เกรดอุตสาหกรรม Fanless</p>
          </div>
        </div>
      </div>

      {/* Sticky Category Tabs */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 inline-flex items-center gap-1"><Pointer size={12} /> เลือกหมวดสินค้า:</span>
            {[
              { id: "all", name: "ทั้งหมด", icon: LayoutGrid },
              { id: "AI Edge Computing", name: "AI Edge / GPU", icon: Flame },
              { id: "Embedded Box PC", name: "Embedded Box PC", icon: Factory },
              { id: "Gateway", name: "Gateway / DIN Rail", icon: Globe },
              { id: "PoE & Multi-LAN", name: "PoE & Multi-LAN", icon: Radio },
              { id: "Vehicle & Special", name: "Vehicle & Special", icon: Car },
              { id: "Machine Vision", name: "Machine Vision", icon: Eye },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilters({ ...filters, category: cat.id })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  filters.category === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                <cat.icon className="w-3.5 h-3.5" />
                {cat.name}
                >
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          >
          <IBoxProductFilter
            filters={filters}
            >
            onFilterChange={setFilters}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
            resultCount={filteredProducts.length}
            allProducts={iboxProducts}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Quick Filters */}
            >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground shrink-0 inline-flex items-center gap-1"><Zap size={12} className="text-primary" /> Quick:</span>
              {[
                { label: "PoE", active: filters.poe === true, toggle: () => setFilters({ ...filters, poe: filters.poe === true ? null : true }) },
                { label: "PCIe", active: filters.pcie === true, toggle: () => setFilters({ ...filters, pcie: filters.pcie === true ? null : true }) },
                { label: "Fanless", active: filters.formFactor === "fanless", toggle: () => setFilters({ ...filters, formFactor: filters.formFactor === "fanless" ? "all" : "fanless" }) },
                { label: "AI GPU", active: filters.category === "AI Edge Computing", toggle: () => setFilters({ ...filters, category: filters.category === "AI Edge Computing" ? "all" : "AI Edge Computing" }) },
                { label: "High-perf", active: filters.performance === "high", toggle: () => setFilters({ ...filters, performance: filters.performance === "high" ? "all" : "high" }) },
              ].map((qf) => (
                <button
                  key={qf.label}
                  onClick={qf.toggle}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    qf.active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      >
                      : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                  {qf.label}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="card-surface p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาสินค้า... (ชื่อ, รุ่น, CPU)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    >
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setIsMobileFilterOpen(true)}
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">ยอดนิยม</SelectItem>
                      <SelectItem value="newest">ใหม่ล่าสุด</SelectItem>
                      <SelectItem value="name">ชื่อ A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterChips filters={filters} onFilterChange={setFilters} />

            {/* Product Grid */}
            >
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <IBoxProductCard
                    key={product.id}
                    >
                    product={product}
                    selectedProducts={selectedProducts}
                    toggleSelect={toggleSelect}
                    onQuote={setQuoteProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="card-surface p-12 text-center">
                <ScanLine className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">ไม่พบสินค้า</h3>
                <p className="text-sm text-muted-foreground mb-4">ลองปรับตัวกรองหรือคำค้นหาใหม่</p>
                <Button variant="outline" onClick={() => { setSearch(""); setFilters({ ...defaultFilters }); }}>
                  ล้างตัวกรองทั้งหมด
                </Button>
              </div>
            )}

            {/* Legacy iBox Models */}
            <section>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground text-center mb-2">
                รุ่นสินค้า iBox Series (Legacy)
                >
              </h2>
              <p className="text-center text-sm text-muted-foreground mb-8">
                เลือกรุ่นที่เหมาะกับงานของคุณ — RAM และ SSD สามารถปรับแต่งได้
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {iboxModels.map((model) => (
                  <div key={model.id} className={`card-surface overflow-hidden group transition-all ${selectedProducts.has(model.name) ? "ring-2 ring-primary border-primary/50" : "hover:border-primary/30"}`}>
                    <div className="relative bg-secondary/30 p-6 flex items-center justify-center h-52">
                      <button onClick={() => toggleSelect(model.name)} className="absolute top-3 left-3 z-10">
                        <Checkbox checked={selectedProducts.has(model.name)} className="h-5 w-5" />
                      </button>
                        item={{
                          id: model.id,
                          name: model.name,
                          category: "iBox Series",
                          image: model.image,
                          href: "/ibox-series",
                          specs: model.cpu,
                        }}
                        className="absolute top-3 right-3"
                      />
                      <img
                        src={model.image}
                        alt={model.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        >
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-foreground text-lg">{model.name}</h3>
                        <Badge variant="secondary" className="text-xs">Fanless</Badge>
                      </div>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <p><span className="font-medium text-foreground">CPU:</span> {model.cpu}</p>
                        <p><span className="font-medium text-foreground">RAM:</span> {model.ram}</p>
                        <p><span className="font-medium text-foreground">Storage:</span> {model.storage}</p>
                        <p><span className="font-medium text-foreground">วัสดุ:</span> {model.material}</p>
                        <p><span className="font-medium text-foreground">OS:</span> {model.os}</p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <a href={model.datasheet} target="_blank" rel="noopener noreferrer">
                            <Download className="w-3.5 h-3.5 mr-1" /> Datasheet
                          </a>
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => setQuoteProduct(model.name)}>
                          <FileText className="w-3.5 h-3.5 mr-1" /> ขอราคา
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Features Strip */}
            <section className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">ฟีเจอร์มาตรฐาน iBox Series</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2">
                    <ChevronRight size={14} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground">{feat}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Use Cases */}
            <section>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground text-center mb-2">
                เหมาะสำหรับงาน
              </h2>
              <p className="text-center text-sm text-muted-foreground mb-8">
                ใช้โปรแกรมได้หลากหลาย ในสำนักงาน โรงงานอุตสาหกรรม โรงเรียน ทั้งการพรีเซนต์งาน การเรียนการสอน และความบันเทิง
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {useCasesData.map((uc) => (
                  <div key={uc.title} className="group card-surface overflow-hidden hover:border-primary/30 transition-all">
                    <div className="relative h-44 overflow-hidden">
                      <img src={uc.image} alt={uc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/90 flex items-center justify-center">
                          <uc.icon className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <h3 className="text-sm font-bold text-white">{uc.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground leading-relaxed">{uc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>


            {/* CTA */}
            <div className="card-surface p-8 text-center">
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">สนใจ iBox Series?</h2>
              <p className="text-muted-foreground mb-6">ปรึกษาผู้เชี่ยวชาญเพื่อเลือกรุ่นและสเปกที่เหมาะกับงานของคุณ</p>
              <Button size="lg" onClick={() => setQuoteProduct("iBox Series")}>
                <FileText className="w-4 h-4 mr-2" /> ขอใบเสนอราคา
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── YouTube Section ─── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <Play className="w-5 h-5 text-destructive" /> วิดีโอรีวิว & สาธิต iBox Series
            </h2>
            <p className="text-xs text-muted-foreground mt-1">ดูการทำงานจริงของ Fanless Industrial PC — กด Like & Share!</p>
          </div>
          <a href="https://www.youtube.com/@entgroup" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full text-xs font-bold hover:bg-destructive/90 transition-colors shrink-0">
            <ThumbsUp className="w-3 h-3" /> Subscribe
          </a>
        </div>

        {/* Featured video */}
        <div className="card-surface rounded-xl overflow-hidden mb-4">
          <div className="relative w-full pb-[56.25%] max-h-[420px]">
            <iframe src="https://www.youtube.com/embed/TU80kmBXrYM" title="iBox Series — Fanless Industrial PC Review" className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          <div className="p-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-foreground">รีวิว iBox Series — Fanless Industrial PC สำหรับโรงงาน</p>
              <p className="text-xs text-muted-foreground mt-0.5">ดูการติดตั้ง การใช้งาน และการเปรียบเทียบสเปคแต่ละรุ่น</p>
            </div>
            <ShareButtons url="https://youtu.be/TU80kmBXrYM" title="iBox Series Review" compact />
          </div>
        </div>

        {/* Supporting videos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: "gA7_xB_O-GY", title: "สาธิตการเชื่อมต่อ iBox กับระบบ IoT" },
            { id: "e7tVqdC0mmM", title: "ทดสอบความทนทาน Fanless PC ในโรงงาน" },
            { id: "kxyjRKH5K-o", title: "เปรียบเทียบ iBox รุ่นต่างๆ สำหรับ Edge AI" },
          ].map((v) => (
            <div key={v.id} className="card-surface rounded-xl overflow-hidden group">
              <div className="relative w-full pb-[56.25%]">
                <iframe src={`https://www.youtube.com/embed/${v.id}`} title={v.title} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <p className="font-semibold text-xs text-foreground line-clamp-1">{v.title}</p>
                <ShareButtons url={`https://youtu.be/${v.id}`} title={v.title} compact />
              </div>
            </div>
          ))}
        </div>

        {/* Channel CTA */}
        <div className="mt-4 text-center">
          <a href="https://www.youtube.com/@entgroup" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-destructive text-destructive-foreground font-bold text-sm hover:bg-destructive/90 transition-colors">
            <Play className="w-4 h-4" /> ดูวิดีโอทั้งหมดบน YouTube <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
      <B2BCTABanner variant="compact" />
      <FooterCompact />
    </div>
  );
};

export default IBoxSeries;

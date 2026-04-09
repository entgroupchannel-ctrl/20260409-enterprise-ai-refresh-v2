import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, Droplets, Battery, Smartphone, Monitor,
  Download, ChevronRight, Wifi, FileText, Search,
  ShoppingCart, X, SlidersHorizontal, ArrowUpDown, Play, ThumbsUp, Share2, Flame,
} from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import PriceDisclaimer from "@/components/PriceDisclaimer";
import TabletProductFilter, {
  type TabletFilterState,
  defaultTabletFilters,
  TabletActiveFilterChips,
} from "@/components/tablet/TabletProductFilter";
import tabletHero from "@/assets/tablet-hero.jpg";
import relatedNotebook from "@/assets/related-rugged-notebook.jpg";
import relatedHandheld from "@/assets/related-rugged-handheld.jpg";
import relatedAio from "@/assets/related-aio-pc.jpg";

/* ═══════ Product Data — 15 models ═══════ */
type TabletProduct = {
  id: string;
  model: string;
  name: string;
  os: "Windows" | "Android";
  size: string;
  cpu: string;
  ram: string;
  display: string;
  highlights: string[];
  image: string;
  price?: string;
  badge?: string;
  productUrl: string;
};

const tablets: TabletProduct[] = [
  // ── Windows (9) ──
  {
    id: "f9e", model: "F9E", name: "Elite Mini PC F9E", os: "Windows",
    size: '10.1"', cpu: "Intel i5-1235U Max 4.4GHz", ram: "16GB LPDDR4x / 256GB",
    display: "10.1\" 1200×1920 FHD",
    highlights: ["Intel i5 Processor", "FHD Display"],
    image: "/images/rugged/f9e-C3MseYpo.png",
    badge: "Best Seller",
    productUrl: "/images/rugged/f9e",
  },
  {
    id: "f9a", model: "F9A", name: "Professional Tablet F9A", os: "Windows",
    size: '10.1"', cpu: "Intel Alder Lake-N100 up to 3.4GHz", ram: "8GB/16GB / 128GB/256GB",
    display: "10.1\" 800×1280 HD or 1920×1200 FHD",
    highlights: ["Long Battery Life", "10-Point Multi-Touch"],
    image: "/images/rugged/f9a-_j8J-x2I.jpg",
    price: "฿27,990",
    productUrl: "/images/rugged/f9a",
  },
  {
    id: "f7g", model: "F7G", name: "แท็บเล็ตอึดทนทาน F7G ขนาด 10.1 นิ้ว", os: "Windows",
    size: '10.1"', cpu: "Intel Gemini Lake N4120", ram: "8GB LPDDR4 / 128GB eMMC",
    display: "10.1\" 1920×1200 FHD IPS",
    highlights: ["หน้าจอ FHD IPS 1920×1200", "IP67 กันน้ำ ทนตก 1.5 เมตร"],
    image: "/images/rugged/f7g-DidJ5UAD.png",
    price: "฿22,990",
    productUrl: "/images/rugged/f7g",
  },
  {
    id: "f7n", model: "F7N", name: "Essential Tablet F7N", os: "Windows",
    size: '10.1"', cpu: "Intel Gemini lake N4100", ram: "4GB / 64GB",
    display: "10.1\" 800×1280 HD",
    highlights: ["Affordable", "Long Battery"],
    image: "/images/rugged/f7-series-main-DzoEL2Ov.png",
    price: "฿19,990",
    productUrl: "/images/rugged/f7n",
  },
  {
    id: "f8ct", model: "F8CT", name: "แท็บเล็ตอึดทนทาน IP67 ขนาด 8 นิ้ว F8CT", os: "Windows",
    size: '8"', cpu: "Intel Cherry Trail x5-Z8350 Quad-Core", ram: "4GB / 64GB eMMC",
    display: "8\" 800×1280 IPS (300 ANSI)",
    highlights: ["หน้าจอ IPS HD 8 นิ้ว 300 ANSI", "IP67 กันน้ำ กันฝุ่น"],
    image: "/images/rugged/f8ct-CetUjj-d.png",
    price: "฿21,990",
    productUrl: "/images/rugged/f8ct",
  },
  {
    id: "f10", model: "F10", name: "All-in-One Touch PC F10", os: "Windows",
    size: '10.1"', cpu: "Intel Celeron N5100", ram: "8GB LPDDR4 / 128GB",
    display: "10.1\" 1920×1200",
    highlights: ["FHD Display", "Dual HDMI"],
    image: "/images/rugged/f10-8McJcNcK.jpg",
    price: "฿17,990",
    productUrl: "/images/rugged/f10",
  },
  {
    id: "w109u", model: "W109U", name: "แท็บเล็ทอึดทนทานระดับอุตสาหกรรม W109U", os: "Windows",
    size: '10.95"', cpu: "Intel i5-1235U / i7-1255U (10-core)", ram: "16GB-48GB / 256GB-2TB",
    display: "10.95\" 1920×1200 IPS",
    highlights: ["IPS 10.95\" ป้องกันรอยขีดข่วน", "IP68 กันน้ำ กันฝุ่น ทนทานสูงสุด"],
    image: "/images/rugged/w109u-main-C8XbCmqD.png",
    productUrl: "/images/rugged/w109u",
  },
  {
    id: "w10y", model: "W10Y", name: "แท็บเล็ตอุตสาหกรรมทนทาน W10Y", os: "Windows",
    size: '10"', cpu: "Intel Core i5-10210Y", ram: "8GB / 16GB / 128GB / 256GB",
    display: "10\" 1920×1200 IPS 700cd/㎡",
    highlights: ["IPS 10\" ความสว่าง 700cd/㎡", "IP68 กันน้ำ กันฝุ่น"],
    image: "/images/rugged/w10y-main-woE420pE.png",
    productUrl: "/images/rugged/w10y",
  },
  {
    id: "w10n", model: "W10N", name: "แท็บเล็ตอุตสาหกรรมทนทาน W10N ราคาคุ้มค่า", os: "Windows",
    size: '10"', cpu: "Intel Celeron N5100 (1.1-2.8GHz)", ram: "8GB / 128GB",
    display: "10\" 1280×800 IPS 700cd/㎡",
    highlights: ["IPS 10\" รองรับมือเปียก/ถุงมือ", "IP68 กันน้ำ กันฝุ่น"],
    image: "/images/rugged/w10n-main-DJomacwZ.png",
    productUrl: "/images/rugged/w10n",
  },
  // ── Android (7) ──
  {
    id: "em-t195", model: "EM-T195", name: "EM-T195 Rugged Tablet", os: "Android",
    size: '10.1"', cpu: "MediaTek MT6833 Dimensity 5G Octa-Core", ram: "4GB-8GB / 64GB-256GB",
    display: "10.1\" 1920×1200 FHD IPS",
    highlights: ["5G Ready", "IP65", "Barcode Scanner", "650g", "9500mAh"],
    image: "/images/rugged/front-TlZtwxwQ.png",
    price: "฿21,900",
    badge: "HOT",
    productUrl: "/rugged-tablet/em-t195",
  },
  {
    id: "f9r", model: "F9R", name: "Android Powerhouse F9R", os: "Android",
    size: '10.1"', cpu: "RK3588 Octa-Core (4×A76 + 4×A55)", ram: "8GB / 128GB",
    display: "10.1\" 1200×1920 IPS 600 nits",
    highlights: ["Octa-Core Power", "Bright 600 nits"],
    image: "/images/rugged/f9r-V3GyP6IL.jpg",
    price: "฿23,990",
    productUrl: "/images/rugged/f9r",
  },
  {
    id: "f7r", model: "F7R", name: "Android Tablet F7R", os: "Android",
    size: '10.1"', cpu: "RK3399 Hexa-Core (2×A72 + 4×A53)", ram: "4GB / 64GB",
    display: "10.1\" 800×1280 IPS",
    highlights: ["Massive Battery", "Hexa-Core CPU"],
    image: "/images/rugged/f7-series-main-DzoEL2Ov.png",
    price: "฿18,990",
    productUrl: "/images/rugged/f7r",
  },
  {
    id: "f8r", model: "F8R", name: "Compact Android F8R", os: "Android",
    size: '8"', cpu: "Rockchip RK3566 Cortex A55 Quad-Core", ram: "2GB/4GB / 32GB/64GB",
    display: "8\" 1280×800 IPS 300ANSI",
    highlights: ["Compact Size", "Quad-Core"],
    image: "/images/rugged/f8r-main-CXDYaSDl.png",
    price: "฿13,990",
    productUrl: "/images/rugged/f8r",
  },
  {
    id: "f12r", model: "F12R", name: "Android AiO F12R", os: "Android",
    size: '11.6"', cpu: "RK3399", ram: "4GB / 64GB",
    display: "11.6\" 1366×768 IPS",
    highlights: ["Large Screen", "VESA Mount"],
    image: "/images/rugged/f12r-A9I7xqWg.jpg",
    price: "฿12,990",
    productUrl: "/images/rugged/f12r",
  },
  {
    id: "a10st", model: "A10ST", name: "Rugged Tablet A10ST (Android 13)", os: "Android",
    size: '10"', cpu: "MTK8781 Octa-Core 2.2GHz", ram: "8GB / 12GB / 128GB / 256GB",
    display: "10\" 1920×1200 IPS 700cd/㎡",
    highlights: ["IP68 Protection", "MTK8781 Octa-Core"],
    image: "/images/rugged/a10st-13-CjHhtG0m.jpg",
    productUrl: "/images/rugged/a10st-13",
  },
  {
    id: "a109t", model: "A109T", name: "Ultra-Slim Tablet A109T", os: "Android",
    size: '10"', cpu: "MT6789V Octa-Core", ram: "8GB / 128GB",
    display: "10\" 700cd/㎡ IPS",
    highlights: ["IP68 Rated", "Android 14"],
    image: "/images/rugged/a109t-product-main-BDvMNhIR.png",
    productUrl: "/images/rugged/a109t",
  },
];

const features = [
  { icon: Shield, title: "ทนทานระดับอุตสาหกรรม", desc: "ผ่านมาตรฐาน MIL-STD-810G ทนการตกกระแทก สั่นสะเทือน อุณหภูมิสุดขั้ว" },
  { icon: Droplets, title: "กันน้ำ กันฝุ่น IP65-IP68", desc: "มาตรฐาน IP65-IP68 ปกป้องจากฝุ่น น้ำ สารเคมี ใช้งานในทุกสภาพแวดล้อม" },
  { icon: Battery, title: "แบตเตอรี่อึดทนนาน", desc: "แบตเตอรี่สูงสุด 6,000 mAh ถอดเปลี่ยนได้ ใช้งานต่อเนื่องยาวนาน" },
  { icon: Smartphone, title: "หน้าจอสัมผัสคุณภาพสูง", desc: "IPS Full HD รองรับมัลติทัช ใช้งานได้แม้ใส่ถุงมือ ความสว่างสูง" },
  { icon: Monitor, title: 'หลากหลายขนาด 8"-12"', desc: 'เลือกได้ตั้งแต่ 8 นิ้วกะทัดรัด จนถึง 11.6 นิ้วสำหรับงานภาคสนาม' },
  { icon: Wifi, title: "เชื่อมต่อครบครัน", desc: "WiFi, Bluetooth, 4G LTE, NFC, สแกนลายนิ้วมือ, กล้องคู่ ตามรุ่น" },
];

const downloads = [
  { name: "Gole Product Overview", url: "/datasheets/0597a3_67de374f10ce40cbb6008623c5212a03.pdf" },
  { name: "Rugged Knowledge", url: "/datasheets/0597a3_990b58aea85c404f923495453e23b027.pdf" },
  { name: "วารสาร Rugged", url: "/datasheets/0597a3_064a791320d74e85957143c869a8c0fd.pdf" },
  { name: "TPC-1062A Datasheet", url: "/datasheets/0597a3_70c1f8faf9cd4eadb93ffb5479aa6854.pdf" },
  { name: "TPC-1082A Datasheet", url: "/datasheets/0597a3_288240e733304dba8334ca07cdc411cf.pdf" },
  { name: "Gole F9A Overview", url: "/datasheets/0597a3_3a33965f742b4034b974ef56aab56170.pdf" },
];

/* ═══════ Helper: parse price to number ═══════ */
function parsePrice(price?: string): number | null {
  if (!price) return null;
  const n = parseInt(price.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? null : n;
}

/* ═══════ Product Card ═══════ */
const TabletCard = ({
  product, onQuote, selected, onToggleSelect,
}: {
  product: TabletProduct;
  onQuote: (name: string) => void;
  selected: boolean;
  onToggleSelect: (name: string) => void;
}) => (
  <div className={`card-surface overflow-hidden group transition-all ${selected ? "ring-2 ring-primary border-primary/50" : "hover:border-primary/30"}`}>
    <Link to={`/rugged-tablet/${product.id}`} className="relative bg-secondary/30 p-4 flex items-center justify-center h-52 cursor-pointer">
      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelect(product.model); }} className="absolute top-3 left-3 z-10">
        <Checkbox checked={selected} className="h-5 w-5" />
      </button>
      <Badge className={`absolute top-3 left-12 text-[10px] ${product.os === "Windows" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-green-500/20 text-green-400 border-green-500/30"}`}>
        {product.os}
      </Badge>
      {product.badge && (
        <Badge className="absolute bottom-3 left-3 bg-primary text-primary-foreground text-[10px]">{product.badge}</Badge>
      )}
      >
      <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
    </Link>
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">{product.model}</p>
          <h3 className="font-display font-bold text-foreground text-sm leading-tight">{product.name}</h3>
        </div>
        <Badge variant="secondary" className="text-xs shrink-0">{product.size}</Badge>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>{product.display}</p>
        <p>{product.cpu}</p>
        <p>{product.ram}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {product.highlights.map((h) => (
          <span key={h} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-foreground/70">{h}</span>
        ))}
        >
      </div>
      {product.price && (
        <p className="text-base font-bold text-primary">{product.price}</p>
      )}
      >
      <div className="flex flex-wrap gap-2 pt-1">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link to={`/rugged-tablet/${product.id}`}>
            <Monitor className="w-3.5 h-3.5 mr-1.5" /> ดูสเปก
          </Link>
        </Button>
        <Button size="sm" className="flex-1" onClick={() => onQuote(product.model)}>
          <FileText className="w-3.5 h-3.5 mr-1.5" /> ขอราคา
        </Button>
      </div>
    </div>
  </div>
);

/* ═══════ Main Component ═══════ */
const RuggedTablet = () => {
  const [filters, setFilters] = useState<TabletFilterState>({ ...defaultTabletFilters });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showMultiQuote, setShowMultiQuote] = useState(false);

  const filtered = useMemo(() => {
    let result = [...tablets];

    // Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(s) || p.model.toLowerCase().includes(s) || p.cpu.toLowerCase().includes(s)
      );
    }

    // OS
    if (filters.os !== "all") result = result.filter((p) => p.os === filters.os);

    // Screen Size
    if (filters.screenSize !== "all") result = result.filter((p) => p.size === filters.screenSize);

    // CPU Brand
    if (filters.cpuBrand !== "all") {
      result = result.filter((p) => {
        const cpu = p.cpu.toLowerCase();
        if (filters.cpuBrand === "Intel") return cpu.includes("intel");
        if (filters.cpuBrand === "Rockchip") return cpu.includes("rk") || cpu.includes("rockchip");
        if (filters.cpuBrand === "MTK") return cpu.includes("mt") || cpu.includes("mtk");
        return true;
      });
    }

    // Price Range
    if (filters.priceRange !== "all") {
      result = result.filter((p) => {
        const price = parsePrice(p.price);
        switch (filters.priceRange) {
          case "under20k": return price !== null && price < 20000;
          case "20k-25k": return price !== null && price >= 20000 && price <= 25000;
          case "over25k": return price !== null && price > 25000;
          case "contact": return price === null;
          default: return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (parsePrice(a.price) ?? 999999) - (parsePrice(b.price) ?? 999999));
        break;
      case "price-high":
        result.sort((a, b) => (parsePrice(b.price) ?? 0) - (parsePrice(a.price) ?? 0));
        break;
      case "name":
        result.sort((a, b) => a.model.localeCompare(b.model));
        break;
    }

    return result;
  }, [search, filters, sortBy]);

  const toggleSelect = useCallback((model: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(model)) next.delete(model);
      else next.add(model);
      return next;
    });
  }, []);

  const clearSelection = () => setSelectedProducts(new Set());

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Rugged Tablet กันน้ำ กันกระแทก — 15 รุ่น"
        description="Rugged Tablet ทนทาน กันน้ำ IP65-IP68 กันกระแทก MIL-STD-810G สำหรับงานภาคสนาม ทหาร โลจิสติกส์ — Windows & Android 15 รุ่น"
        path="/rugged-tablet"
      />
      <ProductJsonLd
        collectionName="Rugged Tablet กันน้ำ กันกระแทก"
        collectionDescription="Rugged Tablet ทนทาน กันน้ำ IP65-IP68 กันกระแทก MIL-STD-810G — 15 รุ่น Windows & Android"
        collectionUrl="/rugged-tablet"
        products={tablets.filter((t) => t.price).map((t) => ({ name: t.name, price: t.price, category: "Rugged Tablet" }))}
      />
      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "Rugged Tablet", path: "/rugged-tablet" }]} />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden min-h-[420px] md:min-h-[480px]">
        <div className="absolute inset-0">
          <img src={tabletHero} alt="Rugged Tablet ใช้งานในโรงงาน" className="w-full h-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <div className="container max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-10 h-10 text-primary" />
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Rugged & Industrial Grade</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-foreground">
            Rugged <span className="text-primary">Tablet</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-2">
            แท็บเล็ตสำหรับงานภาคสนาม คลังสินค้า โรงงาน และการใช้งานกลางแจ้ง
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-xl mb-8">ถึก ทน แกร่ง แข็งแรง — ผ่านมาตรฐาน IP65-IP68 ทนทานต่อการตกกระแทก</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {[
              { icon: Shield, value: "IP65-IP68", label: "กันน้ำกันฝุ่น" },
              { icon: Monitor, value: `${tablets.length} รุ่น`, label: "ให้เลือก" },
              { icon: Wifi, value: "Win & Android", label: "ระบบปฏิบัติการ" },
              { icon: Battery, value: "8,000mAh+", label: "แบตเตอรี่" },
            ].map((s) => (
              <div key={s.label} className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 text-center">
                <s.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
            >
          </div>
        </div>
      </div>

      {/* ── Sticky Bar: Back + Quick Filters ── */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Back to Home row */}
          <div className="flex items-center justify-between py-1.5 border-b border-border/50">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> กลับหน้าหลัก
            </Link>
            <span className="text-[10px] text-muted-foreground">Rugged Tablet — {tablets.length} รุ่น</span>
          </div>
          {/* Quick Filters row */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">เลือก:</span>
            {[
              { id: "all", label: `ทั้งหมด` },
              { id: "Windows", label: `Windows` },
              { id: "Android", label: `Android` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilters({ ...filters, os: tab.id })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  filters.os === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                >
                {tab.label}
                <span className={`text-[10px] font-mono ${filters.os === tab.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  ({tab.id === "all" ? tablets.length : tablets.filter((t) => t.os === tab.id).length})
                </span>
              </button>
            ))}
            >
            <div className="w-px h-5 bg-border mx-1 shrink-0" />
            {/* Quick filter pills */}
            {[
              { label: '8"', active: filters.screenSize === '8"', toggle: () => setFilters({ ...filters, screenSize: filters.screenSize === '8"' ? "all" : '8"' }) },
              { label: '10"+', active: filters.screenSize === '10"' || filters.screenSize === '10.1"', toggle: () => setFilters({ ...filters, screenSize: filters.screenSize === '10.1"' ? "all" : '10.1"' }) },
              { label: "Intel", active: filters.cpuBrand === "Intel", toggle: () => setFilters({ ...filters, cpuBrand: filters.cpuBrand === "Intel" ? "all" : "Intel" }) },
              { label: "< ฿20k", active: filters.priceRange === "under20k", toggle: () => setFilters({ ...filters, priceRange: filters.priceRange === "under20k" ? "all" : "under20k" }) },
            ].map((qf) => (
              <button
                key={qf.label}
                onClick={qf.toggle}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border shrink-0 ${
                  qf.active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
                >
                {qf.label}
              </button>
            ))}
            >
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <TabletProductFilter
            filters={filters}
            onFilterChange={setFilters}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
            resultCount={filtered.length}
            allProducts={tablets}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Toolbar */}
            <div className="card-surface p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหา... (ชื่อ, รุ่น, CPU)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setIsMobileFilterOpen(true)}>
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">ยอดนิยม</SelectItem>
                      <SelectItem value="price-low">ราคาต่ำ → สูง</SelectItem>
                      <SelectItem value="price-high">ราคาสูง → ต่ำ</SelectItem>
                      <SelectItem value="name">ชื่อ A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            <TabletActiveFilterChips filters={filters} onFilterChange={setFilters} />

            {/* Product Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <TabletCard
                    key={p.id}
                    product={p}
                    onQuote={setQuoteProduct}
                    selected={selectedProducts.has(p.model)}
                    onToggleSelect={toggleSelect}
                  />
                ))}
                >
              </div>
            ) : (
              <div className="card-surface p-12 text-center">
                <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">ไม่พบสินค้า</h3>
                <p className="text-sm text-muted-foreground mb-4">ลองปรับตัวกรองหรือคำค้นหาใหม่</p>
                <Button variant="outline" onClick={() => { setSearch(""); setFilters({ ...defaultTabletFilters }); }}>
                  ล้างตัวกรองทั้งหมด
                </Button>
              </div>
            )}

            {/* Features */}
            <section id="features">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">คุณสมบัติเด่น</h2>
              <p className="text-muted-foreground text-center mb-8">ทนทาน ยืดหยุ่น พร้อมลุยทุกสถานการณ์</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((f, i) => (
                  <div key={i} className="card-surface p-5">
                    <f.icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
                >
              </div>
            </section>

            {/* Related Categories */}
            <section className="space-y-3">
              <h2 className="text-lg font-display font-bold text-foreground mb-2">หมวดหมู่ที่เกี่ยวข้อง</h2>
              {[
                { to: "/rugged-notebook", title: "Rugged Notebook", desc: "โน้ตบุ๊คทนทานมาตรฐานทหาร MIL-STD-810G/H — 10 รุ่น", gradient: "Notebook", image: relatedNotebook },
                { to: "/handheld", title: "Rugged Handheld & PDA", desc: "เครื่องพกพาและ PDA มาตรฐานอุตสาหกรรม — 16 รุ่น", gradient: "Handheld & PDA", image: relatedHandheld },
                { to: "/aio", title: "All-in-One Industrial PC", desc: "คอมพิวเตอร์ All-in-One จอสัมผัสอุตสาหกรรม — 15 รุ่น", gradient: "Industrial PC", image: relatedAio },
              ].map((cat) => (
                <Link key={cat.to} to={cat.to} className="card-surface overflow-hidden flex items-stretch group hover:border-primary/30 transition-all">
                  <div className="w-28 sm:w-36 shrink-0 relative">
                    <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width={768} height={512} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-display font-bold text-foreground">
                        {cat.title.replace(cat.gradient, "")} <span className="text-gradient">{cat.gradient}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">{cat.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                  </div>
                </Link>
              ))}
              >
            </section>

            {/* Downloads */}
            <section id="downloads">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">Downloads</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {downloads.map((dl, i) => (
                  <a key={i} href={dl.url} target="_blank" rel="noopener noreferrer" className="card-surface p-4 flex items-center gap-3 hover:border-primary/30 transition-all group">
                    <Download className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{dl.name}</p>
                      <p className="text-xs text-muted-foreground">PDF</p>
                    </div>
                  </a>
                ))}
                >
              </div>
            </section>

            <PriceDisclaimer />

            {/* ── YouTube Media Center ── */}
            <section className="space-y-6">
              <div className="text-center">
                <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">📺 Media Center</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  วิดีโอ <span className="text-primary">Rugged Tablet</span>
                </h2>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">ชมการใช้งานจริง รีวิว และทดสอบความทนทานของ Rugged Tablet — กดไลค์และแชร์ได้เลย!</p>
              </div>

              {/* Featured Video */}
              <div className="card-surface rounded-2xl overflow-hidden">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/4b5kFnaEEN4"
                    title="Rugged Tablet — Featured Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <p className="font-bold text-foreground text-sm">Rugged Tablet — ทดสอบความทนทาน</p>
                  <ShareButtons url="https://youtu.be/4b5kFnaEEN4" title="Rugged Tablet — ทดสอบความทนทาน" compact />
                </div>
              </div>

              {/* Video Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: "82JfH_pZtL4", title: "Rugged Tablet ใช้งานคลังสินค้า" },
                  { id: "csZIKK8w2w0", title: "รีวิว Rugged Tablet กันน้ำ IP67" },
                  { id: "KHJreZIfRag", title: "Rugged Tablet สำหรับงานภาคสนาม" },
                  { id: "NGzozqZHdGQ", title: "ทดสอบ Drop Test แท็บเล็ตทนทาน" },
                  { id: "TAQF_h4pBRg", title: "Rugged Tablet ในงานอุตสาหกรรม" },
                  { id: "1qA8rVTsWx0", title: "เปรียบเทียบ Rugged Tablet รุ่นยอดนิยม" },
                  { id: "wWgkc51GW_I", title: "Rugged Tablet สำหรับงานโลจิสติกส์" },
                ].map((v) => (
                  <div key={v.id} className="card-surface rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${v.id}`}
                        >
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground text-xs line-clamp-1">{v.title}</p>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.title} compact />
                    </div>
                  </div>
                ))}
                >
              </div>

              <div className="text-center">
                <a
                  href="https://www.youtube.com/playlist?list=PLnaSAPIEkz1frFK93ge_0MUHXJ1P3edE9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-sm transition-colors shadow-lg hover:shadow-xl"
                >
                  <Play className="w-4 h-4" /> ดูวิดีโอทั้งหมดบน YouTube
                </a>
              </div>
            </section>

            {/* CTA */}
            <div className="card-surface p-8 text-center">
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">สนใจ Rugged Tablet?</h2>
              <p className="text-muted-foreground mb-6">ปรึกษาผู้เชี่ยวชาญเพื่อเลือก Rugged Tablet ที่เหมาะกับงานของคุณ</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" asChild>
                  <Link to="/contact">ติดต่อเรา</Link>
                </Button>
                <Button onClick={() => setQuoteProduct("Rugged Tablet")}>
                  <FileText className="w-3.5 h-3.5 mr-1.5" /> ขอใบเสนอราคา
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Selection Bar */}
      {selectedProducts.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground rounded-full shadow-2xl px-6 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold text-sm">{selectedProducts.size} รุ่น</span>
          </div>
          <Button size="sm" variant="secondary" className="rounded-full font-bold" onClick={() => setShowMultiQuote(true)}>
            <FileText className="w-4 h-4 mr-1.5" /> ขอใบเสนอราคารวม
          </Button>
          <button onClick={clearSelection} className="p-1 hover:bg-primary-foreground/20 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      >
      <B2BCTABanner variant="compact" />
      <FooterCompact />
    </div>
  );
};

export default RuggedTablet;

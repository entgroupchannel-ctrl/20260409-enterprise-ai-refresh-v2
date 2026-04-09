import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, Cpu, Monitor, Laptop, Sparkles, Search,
  SlidersHorizontal, ArrowUpDown, FileText, ShoppingCart, X,
  Play, ThumbsUp, Share2, ExternalLink,
} from "lucide-react";
import { ChevronRight } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import relatedTablet from "@/assets/related-rugged-tablet.jpg";
import relatedHandheld from "@/assets/related-rugged-handheld.jpg";
import relatedAio from "@/assets/related-aio-pc.jpg";
import notebookHero from "@/assets/notebook-hero.jpg";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import FooterCompact from "@/components/FooterCompact";
import B2BCTABanner from "@/components/B2BCTABanner";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ruggedNotebooks, type RuggedNotebook } from "@/data/rugged-notebook-products";
import NotebookProductFilter, {
  type NotebookFilterState,
  defaultNotebookFilters,
  NotebookActiveFilterChips,
} from "@/components/notebook/NotebookProductFilter";

const stats = [
  { icon: Shield, value: "MIL-STD", label: "มาตรฐานทหาร" },
  { icon: Monitor, value: "10 รุ่น", label: "ให้เลือก" },
  { icon: Cpu, value: "Intel AI", label: "Ultra 5/7/i5/i7" },
  { icon: Sparkles, value: "IP65-IP67", label: "กันน้ำกันฝุ่น" },
];

function parsePrice(price?: string): number | null {
  if (!price) return null;
  const n = parseInt(price.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? null : n;
}

const RuggedNotebookPage = () => {
  const [filters, setFilters] = useState<NotebookFilterState>({ ...defaultNotebookFilters });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showMultiQuote, setShowMultiQuote] = useState(false);

  const filtered = useMemo(() => {
    let result = [...ruggedNotebooks];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) => p.model.toLowerCase().includes(s) || p.title.toLowerCase().includes(s) || p.cpu.toLowerCase().includes(s)
      );
    }

    if (filters.os !== "all") result = result.filter((p) => p.os === filters.os);
    if (filters.screenSize !== "all") result = result.filter((p) => p.screenSize === filters.screenSize);

    if (filters.cpuBrand !== "all") {
      result = result.filter((p) => {
        const cpu = p.cpu.toLowerCase();
        if (filters.cpuBrand === "Ultra") return cpu.includes("ultra");
        if (filters.cpuBrand === "i7") return cpu.includes("i7");
        if (filters.cpuBrand === "i5") return cpu.includes("i5");
        return true;
      });
    }

    if (filters.protection !== "all") {
      result = result.filter((p) => p.protection.includes(filters.protection));
    }

    if (filters.priceRange !== "all") {
      result = result.filter((p) => {
        const price = parsePrice(p.priceStart);
        switch (filters.priceRange) {
          case "under50k": return price !== null && price < 50000;
          case "50k-80k": return price !== null && price >= 50000 && price <= 80000;
          case "over80k": return price !== null && price > 80000;
          case "contact": return price === null;
          default: return true;
        }
      });
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (parsePrice(a.priceStart) ?? 999999) - (parsePrice(b.priceStart) ?? 999999));
        break;
      case "price-high":
        result.sort((a, b) => (parsePrice(b.priceStart) ?? 0) - (parsePrice(a.priceStart) ?? 0));
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEOHead
        title="Rugged Notebook — โน้ตบุ๊กมาตรฐานทหาร MIL-STD"

        description="โน้ตบุ๊คทนทานเกรดทหาร MIL-STD-810G/H กันน้ำ IP65-IP67 Intel AI, Core i5/i7 สำหรับงานภาคสนาม โรงงาน โลจิสติกส์ จำหน่ายโดย ENT Group"

        path="/rugged-notebook"
      />
      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/" }, { name: "Rugged Notebook", path: "/rugged-notebook" }]} />
      <ProductJsonLd
        products={ruggedNotebooks.map((p) => ({
          name: `${p.model} — ${p.title}`,
          price: p.priceStart?.replace(/[฿,]/g, "") || undefined,
          description: `${p.title} | ${p.protection}`,
          image: p.image,
          brand: "ENT Group",
          category: "Rugged Notebook",
        }))}
        collectionName="Rugged Notebook"

        collectionDescription="โน้ตบุ๊คทนทานเกรดทหาร MIL-STD กันน้ำ กันกระแทก"

        collectionUrl="/rugged-notebook"
      />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden min-h-[420px] md:min-h-[480px]">
        <div className="absolute inset-0">
          <img src={notebookHero} alt="Rugged Notebook ใช้งานภาคสนาม" className="w-full h-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft size={16} /> หน้าแรก
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Laptop className="w-10 h-10 text-primary" />
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">MIL-STD-810G/H</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-foreground">Rugged Notebook</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-2">
            โน้ตบุ๊กมาตรฐานทหาร ทนทานสุดขั้ว สำหรับงานภาคสนามและสภาพแวดล้อมที่ท้าทาย
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-xl mb-8">ถึก ทน แกร่ง แข็งแรง — พร้อมใช้งานทุกสภาพภูมิอากาศ</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {stats.map((s) => (
              <div key={s.label} className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 text-center">
                <s.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sticky Bar: Back + Quick Filters ─── */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-1.5 border-b border-border/50">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> กลับหน้าหลัก
            </Link>
            <span className="text-[10px] text-muted-foreground">Rugged Notebook — {ruggedNotebooks.length} รุ่น</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">เลือก:</span>
            {[
              { id: "all", label: "ทั้งหมด" },
              { id: "Windows", label: "Windows" },
              { id: "Linux", label: "Linux" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilters({ ...filters, os: tab.id })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  filters.os === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted hover:bg-muted/80 text-foreground"
                }`}>
                {tab.label}
                <span className={`text-[10px] font-mono ${filters.os === tab.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}

                  ({tab.id === "all" ? ruggedNotebooks.length : ruggedNotebooks.filter((p) => p.os === tab.id).length})
                </span>
              </button>
            ))}
            <div className="w-px h-5 bg-border mx-1 shrink-0" />
            {[
              { label: "AI (Ultra)", active: filters.cpuBrand === "Ultra", toggle: () => setFilters({ ...filters, cpuBrand: filters.cpuBrand === "Ultra" ? "all" : "Ultra" }) },
              { label: "IP67", active: filters.protection === "IP67", toggle: () => setFilters({ ...filters, protection: filters.protection === "IP67" ? "all" : "IP67" }) },
              { label: '15.6"', active: filters.screenSize === '15.6"', toggle: () => setFilters({ ...filters, screenSize: filters.screenSize === '15.6"' ? "all" : '15.6"' }) },
              { label: "< ฿50k", active: filters.priceRange === "under50k", toggle: () => setFilters({ ...filters, priceRange: filters.priceRange === "under50k" ? "all" : "under50k" }) },
            ].map((qf) => (
              <button
                key={qf.label}
                onClick={qf.toggle}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border shrink-0 ${
                  qf.active ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}>
                {qf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Layout ─── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <NotebookProductFilter
            filters={filters}
            onFilterChange={setFilters}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
            resultCount={filtered.length}
            allProducts={ruggedNotebooks}
          />

          <div className="flex-1 min-w-0 space-y-6">
            {/* Toolbar */}
            <div className="card-surface p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="ค้นหา... (ชื่อ, รุ่น, CPU)" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
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

            <NotebookActiveFilterChips filters={filters} onFilterChange={setFilters} />

            {/* Product Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((nb) => (
                  <NotebookCard key={nb.id} product={nb} selected={selectedProducts.has(nb.model)} onToggleSelect={toggleSelect} />
                ))}
              </div>
            ) : (
              <div className="card-surface p-12 text-center">
                <Laptop className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">ไม่พบสินค้า</h3>
                <p className="text-sm text-muted-foreground mb-4">ลองปรับตัวกรองหรือคำค้นหาใหม่</p>
                <Button variant="outline" onClick={() => { setSearch(""); setFilters({ ...defaultNotebookFilters }); }}

                  ล้างตัวกรองทั้งหมด
                </Button>
              </div>
            )}

            <PriceDisclaimer />
          </div>
        </div>
      </div>

      {/* ─── Media Center ─── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <Play className="w-5 h-5 text-destructive" /> วิดีโอรีวิว & ทดสอบ
            </h2>
            <p className="text-xs text-muted-foreground mt-1">ดูการทดสอบความทนทานจริง — กด Like & Share ให้กำลังใจทีมงาน!</p>
          </div>
          <a href="https://youtu.be/Zu5rGL96Qu8" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full text-xs font-bold hover:bg-destructive/90 transition-colors shrink-0">
            <ThumbsUp className="w-3 h-3" /> Subscribe
          </a>
        </div>

        {/* YouTube — 2-column compact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { id: "Zu5rGL96Qu8", title: "รีวิว Rugged Notebook — ทดสอบการใช้งานจริง" },
            { id: "vMInVhSNhn0", title: "ทดสอบความทนทาน Rugged Notebook" },
            { id: "ZxbNjUT0_i0", title: "Rugged Notebook ใช้งานภาคสนาม" },
            { id: "Q1KmwMqmZjY", title: "รีวิว Rugged Notebook สำหรับอุตสาหกรรม" },
          ].map((v) => (
            <div key={v.id} className="card-surface rounded-xl overflow-hidden">
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

        {/* Facebook Reels — compact row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-full bg-[hsl(221,44%,41%)] flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">f</span>
          </div>
          <h3 className="text-sm font-bold text-foreground">Facebook Reels</h3>
          <a href="https://www.facebook.com/entgroup.th" target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 bg-[hsl(221,44%,41%)] text-white px-3 py-1 rounded-full text-[10px] font-bold hover:opacity-90 transition-opacity">
            <ExternalLink className="w-3 h-3" /> Follow
          </a>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { url: "https://www.facebook.com/share/r/1FV2EVYxGG/", title: "ทดสอบกันกระแทก" },
            { url: "https://www.facebook.com/share/r/1DbdJEFLba/", title: "ใช้งานภาคสนาม" },
            { url: "https://www.facebook.com/share/r/1C91atFocu/", title: "กันน้ำ IP65" },
          ].map((reel) => (
            <a key={reel.url} href={reel.url} target="_blank" rel="noopener noreferrer" className="card-surface rounded-lg p-3 flex items-center gap-2.5 hover:border-primary/30 transition-colors group">
              <div className="w-9 h-9 rounded-full bg-[hsl(221,44%,41%)]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 text-[hsl(221,44%,41%)] fill-[hsl(221,44%,41%)]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground line-clamp-1">{reel.title}</p>
                <p className="text-[10px] text-muted-foreground">Facebook Reel</p>
              </div>
            </a>
          ))}
        </div>
      </section>


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
      {/* Related Categories */}
      <section className="max-w-7xl mx-auto px-4 pb-10 space-y-3">
        <h2 className="text-lg font-display font-bold text-foreground mb-2">หมวดหมู่ที่เกี่ยวข้อง</h2>
        {[
          { to: "/rugged-tablet", title: "Rugged Tablet", desc: "แท็บเล็ตทนทาน กันน้ำ IP65-IP68 กันกระแทก — 16 รุ่น", gradient: "Tablet", image: relatedTablet },
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
      </section>
      <B2BCTABanner variant="compact" />
      <FooterCompact />
    </div>
  );
};

/* ───── Card ───── */
const NotebookCard = ({ product, selected, onToggleSelect }: { product: RuggedNotebook; selected: boolean; onToggleSelect: (m: string) => void }) => {
  const [selectedCfg, setSelectedCfg] = useState(0);
  const cfg = product.configs[selectedCfg];

  return (
    <div className={`group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${selected ? "ring-2 ring-primary border-primary/50" : "hover:border-primary/30"}`}>

      {/* Image */}
      <Link to={`/rugged-notebook/${product.id}`} className="relative bg-gradient-to-b from-muted/30 to-transparent p-6 flex items-center justify-center min-h-[200px]">
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelect(product.model); }} className="absolute top-3 left-3 z-10">
          <Checkbox checked={selected} className="h-5 w-5" />
        </button>
        <Badge className="absolute top-3 left-12 bg-primary/90 text-primary-foreground text-[10px]">
          {product.os}
        </Badge>
        <img src={product.image} alt={product.model} className="max-h-[180px] object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-mono text-muted-foreground tracking-wider mb-1">{product.model}</p>
        <Link to={`/rugged-notebook/${product.id}`}>

          <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2 hover:text-primary transition-colors">{product.title}</h3>
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.badges.map((b) => (
            <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/50 text-accent-foreground font-medium">{b}</span>
          ))}
        </div>

        <div className="text-xs text-muted-foreground space-y-1 mb-3">
          <p><span className="font-medium text-foreground">CPU:</span> {product.cpu}</p>
          <p><span className="font-medium text-foreground">Protection:</span> {product.protection}</p>
          <p><span className="font-medium text-foreground">Memory:</span> {product.memory}</p>
        </div>

        {product.configs.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-semibold text-muted-foreground">เลือกคอนฟิก:</p>
            {product.configs.map((c, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setSelectedCfg(i); }}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                  i === selectedCfg ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
                }`}>
                <div className="font-bold">{c.label}</div>
                <div className="text-muted-foreground">{c.cpu}</div>
                <div className="text-muted-foreground">{c.ram}</div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <div>
            {cfg ? (
              <span className="text-lg font-extrabold text-primary">{cfg.price}</span>
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">สอบถามราคา</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuggedNotebookPage;


import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Monitor, Cpu, Box, Layers, FileText, ChevronRight, Zap, Shield, Hand } from "lucide-react";
import aioHero from "@/assets/aio-hero.jpg";
import relatedTablet from "@/assets/related-rugged-tablet.jpg";
import relatedHandheld from "@/assets/related-rugged-handheld.jpg";
import relatedNotebook from "@/assets/related-rugged-notebook.jpg";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import FooterCompact from "@/components/FooterCompact";
import B2BCTABanner from "@/components/B2BCTABanner";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { aioProducts, categoryLabels, type AIOCategory, type AIOOS } from "@/data/aio-products";

/* ── Filter Tabs ── */
const osFilters: { label: string; value: AIOOS | "all" }[] = [
  { label: "ทั้งหมด", value: "all" },
  { label: "Windows", value: "Windows" },
  { label: "Android", value: "Android" },
  { label: "Linux", value: "Linux" },
];

const catFilters: { label: string; value: AIOCategory | "all"; icon: typeof Monitor }[] = [
  { label: "ทั้งหมด", value: "all", icon: Layers },
  { label: "Box PC", value: "box-pc", icon: Box },
  { label: "AIO Desktop", value: "aio-desktop", icon: Monitor },
  { label: "Panel PC", value: "panel-pc", icon: Cpu },
];

/* ── Product Card ── */
const AIOCard = ({
  product,
  onQuote,
  selected,
  onToggleSelect,
}: {
  product: (typeof aioProducts)[0];
  onQuote: (name: string) => void;
  selected: boolean;
  onToggleSelect: (name: string) => void;
}) => (
  <div
    className={`card-surface overflow-hidden group transition-all ${
      selected ? "ring-2 ring-primary border-primary/50" : "hover:border-primary/30"
    }`}
    >
    {/* Image */}
    <div className="relative bg-secondary/30 p-4 flex items-center justify-center h-52">
        item={{
          id: product.id,
          name: product.model,
          category: "All-in-One PC",
          image: product.image,
          href: `/aio`,
          specs: product.title,
        }}
        className="absolute top-3 right-3"
        >
      />
      <button
        onClick={() => onToggleSelect(product.model)}
        className="absolute top-3 left-3 z-10"
        >
        <Checkbox checked={selected} className="h-5 w-5" />
      </button>
      <Link to={`/aio/${product.id}`} className="flex items-center justify-center w-full h-full">
        <img
          src={product.image}
          alt={product.model}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          loading="lazy"
          >
        />
      </Link>
    </div>

    {/* Info */}
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {product.os.map((o) => (
          <Badge
            key={o}
            >
            variant="outline"
            className={`text-[10px] ${
              o === "Windows"
                ? "border-blue-500/30 text-blue-500"
                : o === "Android"
                ? "border-green-500/30 text-green-500"
                : "border-orange-500/30 text-orange-500"
            }`}
            {o}
          </Badge>
        ))}
        <Badge variant="secondary" className="text-[10px]">
          {product.screenSize}
          >
        </Badge>
      </div>

      <h3 className="font-display font-bold text-foreground text-sm">{product.model}</h3>
      <p className="text-xs font-medium text-foreground/80">{product.title}</p>

      <ul className="space-y-1">
        {[product.cpu, `${product.ram} / ${product.storage}`, product.mount, ...product.highlights.slice(-1)].map(
          (line, i) => (
            <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
              <ChevronRight size={10} className="text-primary/50 mt-0.5 shrink-0" />
              {line}
              >
            </li>
          )
        )}
      </ul>

      <div className="flex gap-2 pt-1">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link to={`/aio/${product.id}`}>
            <Monitor className="w-3.5 h-3.5 mr-1.5" /> ดูรายละเอียด
          </Link>
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onQuote(product.model)}
          >
          <FileText className="w-3.5 h-3.5 mr-1.5" /> สอบถามราคา
        </Button>
      </div>
    </div>
  </div>
);

/* ══════════ Main Page ══════════ */
const AllInOnePC = () => {
  const [osFilter, setOsFilter] = useState<AIOOS | "all">("all");
  const [catFilter, setCatFilter] = useState<AIOCategory | "all">("all");
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((name: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const filtered = aioProducts.filter((p) => {
    if (osFilter !== "all" && !p.os.includes(osFilter)) return false;
    if (catFilter !== "all" && p.category !== catFilter) return false;
    return true;
  });

  const stats = {
    total: aioProducts.length,
    windows: aioProducts.filter((p) => p.os.includes("Windows")).length,
    android: aioProducts.filter((p) => p.os.includes("Android")).length,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="All-in-One PC อุตสาหกรรม — Box PC, Panel PC, AIO Desktop"
        >
        description="คอมพิวเตอร์ All-in-One สำหรับอุตสาหกรรม จอสัมผัส ประหยัดพื้นที่ VESA/Panel Mount — 15 รุ่น Windows & Android"
        path="/aio"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "สินค้า", path: "/products" },
          { name: "All-in-One PC", path: "/aio" },
        ]}
        >
      />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={aioHero} alt="All-in-One PC ในโรงงานอุตสาหกรรม" className="w-full h-full object-cover" width={1920} height={640} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>
        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </Link>

          <div className="max-w-2xl">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Industrial Grade — Touch & Panel Mount</Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              All-in-One <span className="text-gradient">Industrial PC</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              คอมพิวเตอร์ All-in-One สำหรับอุตสาหกรรม ออกแบบมาเพื่อประหยัดพื้นที่และเพิ่มประสิทธิภาพ
              พร้อมจอสัมผัสคุณภาพสูง รองรับ VESA / Panel Mount ใช้งานได้ 24/7
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button size="sm" onClick={() => setQuoteProduct("All-in-One PC")}>
                <FileText className="w-3.5 h-3.5 mr-1.5" /> ขอใบเสนอราคา
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href="#products">ดูสินค้าทั้งหมด →</a>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Monitor, value: `${stats.total} รุ่น`, label: "ให้เลือก" },
                { icon: Hand, value: "Touch", label: "หน้าจอสัมผัส" },
                { icon: Shield, value: "IP65", label: "กันน้ำกันฝุ่น" },
                { icon: Zap, value: "24/7", label: "ทำงานต่อเนื่อง" },
              ].map((s) => (
                <div key={s.label} className="bg-background/60 backdrop-blur-sm border border-border rounded-xl p-3 text-center">
                  <s.icon className="w-5 h-5 mx-auto mb-1.5 text-primary" />
                  <p className="text-sm font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Bar: Back + Quick Filters ── */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-1.5 border-b border-border/50">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> กลับหน้าหลัก
            </Link>
            <span className="text-[10px] text-muted-foreground">All-in-One PC — {aioProducts.length} รุ่น</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 py-2">
            {/* OS filter */}
            >
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {osFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setOsFilter(f.value)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    osFilter === f.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                  }`}
                  {f.label}
                </button>
              ))}
            </div>
            {/* Category filter */}
            <div className="flex gap-1 overflow-x-auto scrollbar-hide sm:ml-auto">
              {catFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setCatFilter(f.value)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    catFilter === f.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                  }`}
                  <f.icon size={12} />
                  {f.label}
                  >
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="container max-w-7xl mx-auto px-4 py-10">
        <p className="text-sm text-muted-foreground mb-6">
          แสดง {filtered.length} จาก {aioProducts.length} รุ่น
          {selectedProducts.size > 0 && (
            <span className="ml-3 text-primary font-medium">
              เลือกแล้ว {selectedProducts.size} รุ่น —{" "}
              >
              <button
                className="underline hover:no-underline"
                onClick={() => {
                  setQuoteProduct(Array.from(selectedProducts).join(", "));
                }}
                >
                ขอใบเสนอราคารวม
              </button>
            </span>
          )}
        </p>

        {/* Group by category */}
        {(catFilter === "all"
          ? (["box-pc", "aio-desktop", "panel-pc"] as AIOCategory[])
          : [catFilter]
        ).map((cat) => {
          const items = filtered.filter((p) => p.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mb-12">
              <h2 className="text-xl font-display font-bold text-foreground mb-1">
                {categoryLabels[cat]}
                >
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {cat === "box-pc" && "Box PC อุตสาหกรรม จอสัมผัส พร้อมติดตั้ง VESA / Desktop / Wall Mount"}
                >
                {cat === "aio-desktop" && "All-in-One PC จอสัมผัส สำหรับโต๊ะทำงานและติดผนัง"}
                {cat === "panel-pc" && "Panel PC อุตสาหกรรม สำหรับฝังตู้คอนโทรล Panel Mount / VESA"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((p) => (
                  <AIOCard
                    key={p.id}
                    >
                    product={p}
                    onQuote={setQuoteProduct}
                    selected={selectedProducts.has(p.model)}
                    onToggleSelect={toggleSelect}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Monitor className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">ไม่พบสินค้าที่ตรงกับตัวกรอง</p>
            <Button
              variant="outline"
              >
              size="sm"
              className="mt-3"
              onClick={() => {
                setOsFilter("all");
                setCatFilter("all");
              }}
              >
              รีเซ็ตตัวกรอง
            </Button>
          </div>
        )}

        <PriceDisclaimer />
      </div>

      {/* Related Categories */}
      <section className="container max-w-7xl mx-auto px-4 pb-10 space-y-3">
        <h2 className="text-lg font-display font-bold text-foreground mb-2">หมวดหมู่ที่เกี่ยวข้อง</h2>
        {[
          { to: "/rugged-tablet", title: "Rugged Tablet", desc: "แท็บเล็ตทนทาน กันน้ำ IP65-IP68 กันกระแทก — 16 รุ่น", gradient: "Tablet", image: relatedTablet },
          { to: "/handheld", title: "Rugged Handheld & PDA", desc: "เครื่องพกพาและ PDA มาตรฐานอุตสาหกรรม — 16 รุ่น", gradient: "Handheld & PDA", image: relatedHandheld },
          { to: "/rugged-notebook", title: "Rugged Notebook", desc: "โน้ตบุ๊คทนทานมาตรฐานทหาร MIL-STD-810G/H — 10 รุ่น", gradient: "Notebook", image: relatedNotebook },
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

      {/* Quote Dialog */}
      >
    </div>
  );
};

export default AllInOnePC;

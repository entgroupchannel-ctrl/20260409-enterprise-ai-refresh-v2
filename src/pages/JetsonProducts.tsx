import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search, Heart, Share2, FileText, ArrowLeft,
  Cpu, Package, CircuitBoard, Server, Monitor, HardDrive,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import JetsonCTABar from "@/components/JetsonCTABar";
import B2BWorkflowBanner from "@/components/B2BWorkflowBanner";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  jetsonProducts, jetsonCategories, type JetsonCategory, type JetsonProduct,
} from "@/data/jetson-products";

const NV = "#76B900";

const ICONS: Record<string, any> = {
  Cpu, Package, CircuitBoard, Server, Monitor, HardDrive,
};

type FilterCat = "all" | JetsonCategory;

const PAGE_SIZE = 12;

export default function JetsonProducts() {
  const [filter, setFilter] = useState<FilterCat>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = jetsonProducts;
    if (filter !== "all") list = list.filter((p) => p.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.nameTH.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.subtitleTH.toLowerCase().includes(q) ||
        p.descriptionTH.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const onFilter = (f: FilterCat) => { setFilter(f); setPage(1); };
  const onQuery = (v: string) => { setQuery(v); setPage(1); };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>NVIDIA Jetson — แคตตาล็อกผลิตภัณฑ์ทั้งหมด | ENT Group</title>
        <meta name="description" content="เรียกดูแคตตาล็อกผลิตภัณฑ์ NVIDIA Jetson ทั้งหมด — โมดูล, ชุดพัฒนา, Carrier Board, IPC, ระบบพัฒนา AI พร้อมราคาและสเปกครบ" />
        <link rel="canonical" href="https://www.entgroup.co.th/nvidia-jetson/products" />
        <meta name="ai:topic" content="NVIDIA Jetson Product Catalog" />
        <meta name="ai:summary" content="แคตตาล็อก NVIDIA Jetson ครบทุกหมวด: Modules (SoM), Developer Kits, Carrier Boards, Embedded IPC, Edge Computers — มีราคาและสเปก" />
        <meta name="ai:key_facts" content="Jetson Modules | Developer Kits | Carrier Boards | Embedded IPC | Edge Computers | Taiwan IPC" />
      </Helmet>

      <SiteNavbar />

      {/* Header */}
      <section className="border-b bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-6 py-10">
          <Link to="/nvidia-jetson" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> กลับ NVIDIA Jetson
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">NVIDIA Jetson</h1>
          <p className="text-muted-foreground">เรียกดูแคตตาล็อกผลิตภัณฑ์ NVIDIA Jetson ทั้งหมด</p>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="container max-w-7xl mx-auto px-6 py-6 space-y-4">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาสินค้า..."
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="pl-10 h-12 rounded-full"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2">
          <CategoryPill label="ทั้งหมด" active={filter === "all"} onClick={() => onFilter("all")} count={jetsonProducts.length} />
          {(Object.entries(jetsonCategories) as [JetsonCategory, typeof jetsonCategories[JetsonCategory]][]).map(([key, cat]) => {
            const count = jetsonProducts.filter((p) => p.category === key).length;
            const Icon = ICONS[cat.icon] || Cpu;
            return (
              <CategoryPill
                key={key}
                label={cat.nameTH}
                icon={Icon}
                active={filter === key}
                onClick={() => onFilter(key)}
                count={count}
              />
            );
          })}
        </div>
      </section>

      {/* Product Grid */}
      <section className="container max-w-7xl mx-auto px-6 pb-10">
        {paged.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            ไม่พบสินค้าที่ตรงกับการค้นหา
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paged.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 mt-8">
            <PageBtn disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              ก่อนหน้า
            </PageBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <PageBtn key={n} active={n === currentPage} onClick={() => setPage(n)}>
                {n}
              </PageBtn>
            ))}
            <PageBtn disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
              ถัดไป
            </PageBtn>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-4">
          แสดง {paged.length} จาก {filtered.length} รายการ
        </p>
      </section>

      <B2BWorkflowBanner showShopCta />
      <JetsonCTABar message="สนใจรุ่นไหนเป็นพิเศษ? เราพร้อมเสนอราคา" />
      <Footer />
    </div>
  );
}

/* ─── Sub-components ─── */
function CategoryPill({
  label, icon: Icon, active, onClick, count,
}: { label: string; icon?: any; active?: boolean; onClick: () => void; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        active
          ? "border-transparent text-white shadow-md"
          : "border-border bg-background hover:border-primary/50 text-foreground"
      }`}
      style={active ? { background: NV } : {}}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
      {count !== undefined && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-muted"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ProductCard({ p }: { p: JetsonProduct }) {
  const href = `/shop?category=jetson&q=${encodeURIComponent(p.name)}`;
  const quoteHref = `/quote?product=${p.id}`;
  const hasPrice = p.priceTHB && p.priceTHB > 0;

  return (
    <div className="group rounded-xl border bg-card hover:shadow-xl hover:border-primary/30 transition-all overflow-hidden flex flex-col">
      {/* Image */}
      <Link to={href} className="relative block bg-muted/30 aspect-[4/3] overflow-hidden">
        {p.badgeTH && (
          <span
            className="absolute top-3 right-3 z-10 text-xs font-bold px-2.5 py-1 rounded-full text-white shadow"
            style={{ background: NV }}
          >
            {p.badgeTH}
          </span>
        )}
        <div className="absolute top-3 left-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 rounded-full bg-background/90 backdrop-blur flex items-center justify-center hover:bg-background shadow" aria-label="Save">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-background/90 backdrop-blur flex items-center justify-center hover:bg-background shadow" aria-label="Share">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <img
          src={p.image}
          alt={p.nameTH}
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = "/product-placeholder.svg"; }}
        />
      </Link>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <Link to={href}>
          <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {p.nameTH}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.subtitleTH}</p>

        {/* Highlights */}
        <ul className="space-y-1 mb-4 text-xs text-muted-foreground">
          {p.highlightsTH.slice(0, 3).map((h, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: NV }} />
              <span className="line-clamp-1">{h}</span>
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="mt-auto">
          {hasPrice ? (
            <div className="mb-3">
              <span className="text-lg font-bold" style={{ color: NV }}>
                ฿{p.priceTHB!.toLocaleString("th-TH")}
              </span>
            </div>
          ) : (
            <div className="mb-3 text-sm text-muted-foreground">สอบถามราคา</div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <AddToCartButton
              productModel={p.name}
              productName={p.nameTH}
              productDescription={p.subtitleTH}
              estimatedPrice={hasPrice ? p.priceTHB! : undefined}
              variant="default"
              size="sm"
              className="w-full [&>button]:w-full [&>button]:px-2"
            />
            <QuoteRequestButton
              productModel={p.name}
              productName={p.nameTH}
              productImage={p.image}
              variant="outline"
              size="sm"
              fullWidth
              className="px-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PageBtn({
  children, active, disabled, onClick,
}: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`min-w-[36px] h-9 px-3 rounded-md text-sm font-medium transition-all ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : active
          ? "text-white shadow"
          : "border bg-background hover:border-primary/50"
      }`}
      style={active ? { background: NV } : {}}
    >
      {children}
    </button>
  );
}

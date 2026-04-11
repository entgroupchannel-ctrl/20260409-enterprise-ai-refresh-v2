import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import AddToCartButton from '@/components/AddToCartButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchCheck, LayoutGrid, List, SlidersHorizontal, X, FileSearch, ChevronLeft, ChevronRight, CircleCheckBig, ShieldCheck, Landmark, HeadsetIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import SiteNavbar from '@/components/SiteNavbar';

interface Product {
  id: string; sku: string; model: string; series: string | null; name: string; description: string | null;
  category: string | null; cpu: string | null; ram_gb: number | null; storage_gb: number | null;
  storage_type: string | null; unit_price: number; unit_price_vat: number | null;
  image_url: string | null; thumbnail_url: string | null; gallery_urls: string[] | null;
  stock_status: string | null; is_active: boolean; slug: string; tags: string[] | null; is_featured: boolean;
  variant_count?: number;
  starting_price?: number;
}

const ITEMS_PER_PAGE = 12;
const COMPARE_KEY = 'shopCompareList';

function fmt(n: number) { return n.toLocaleString('th-TH'); }

function getCompareList(): string[] {
  try { return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]'); } catch { return []; }
}
function setCompareList(slugs: string[]) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(slugs.slice(0, 4)));
}

const ShopStorefront = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [seriesFilter, setSeriesFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [compareList, setCompareListState] = useState<string[]>(getCompareList());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, sku, model, series, name, description, category, cpu, ram_gb, storage_gb, storage_type, unit_price, unit_price_vat, image_url, thumbnail_url, gallery_urls, stock_status, is_active, slug, tags, is_featured')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Dynamic filter options
  const filterOptions = useMemo(() => {
    const series = [...new Set(products.map(p => p.series).filter(Boolean))] as string[];
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))] as string[];
    return { series, categories };
  }, [products]);

  // Filtered & sorted products
  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.model.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    if (seriesFilter.length > 0) result = result.filter(p => p.series && seriesFilter.includes(p.series));
    if (categoryFilter.length > 0) result = result.filter(p => p.category && categoryFilter.includes(p.category));

    if (sortBy === 'price_asc') result.sort((a, b) => a.unit_price - b.unit_price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.unit_price - a.unit_price);
    else result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

    return result;
  }, [products, search, seriesFilter, categoryFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleCompare = (slug: string) => {
    let list = [...compareList];
    if (list.includes(slug)) list = list.filter(s => s !== slug);
    else if (list.length < 4) list.push(slug);
    setCompareListState(list);
    setCompareList(list);
  };

  const toggleSeriesFilter = (s: string) => {
    setSeriesFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    setPage(1);
  };
  const toggleCategoryFilter = (c: string) => {
    setCategoryFilter(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <SEOHead title="Shop — Industrial PC, Panel PC, Mini PC | ENT Group" description="เลือกซื้อ Industrial PC, Panel PC, Mini PC คุณภาพสูงจาก ENT Group ราคาส่ง พร้อมบริการ B2B" path="/shop" />

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">🏭 Industrial PC & Panel PC Solutions</h1>
          <p className="text-muted-foreground text-sm">Trusted by 500+ enterprises • ISO 9001 • Made for Thailand</p>

          {/* Search bar */}
          <div className="mt-4 flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <SearchCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสินค้า... (Model, SKU, สเปก)"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40"><SelectValue placeholder="เรียงตาม" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">แนะนำ</SelectItem>
                <SelectItem value="price_asc">ราคา ต่ำ→สูง</SelectItem>
                <SelectItem value="price_desc">ราคา สูง→ต่ำ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0 space-y-5">
            <div>
              <h3 className="font-semibold text-sm mb-2">Series</h3>
              <div className="space-y-1.5">
                {filterOptions.series.map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={seriesFilter.includes(s)} onCheckedChange={() => toggleSeriesFilter(s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Category</h3>
              <div className="space-y-1.5">
                {filterOptions.categories.map(c => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={categoryFilter.includes(c)} onCheckedChange={() => toggleCategoryFilter(c)} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            {(seriesFilter.length > 0 || categoryFilter.length > 0) && (
              <Button variant="ghost" size="sm" onClick={() => { setSeriesFilter([]); setCategoryFilter([]); }}>
                <X className="w-3 h-3 mr-1" /> ล้างตัวกรอง
              </Button>
            )}
          </aside>

          {/* Mobile filter toggle */}
          <div className="lg:hidden fixed bottom-20 left-4 z-30">
            <Button size="sm" variant="secondary" onClick={() => setShowFilters(!showFilters)} className="shadow-lg">
              <SlidersHorizontal className="w-4 h-4 mr-1" /> ตัวกรอง
            </Button>
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {/* View mode + count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                แสดง {paged.length} จาก {filtered.length} สินค้า
              </p>
              <div className="flex gap-1">
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse"><CardContent className="p-4 h-72" /></Card>
                ))}
              </div>
            ) : paged.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">ไม่พบสินค้าที่ตรงกับเงื่อนไข</div>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {paged.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    viewMode={viewMode}
                    isComparing={compareList.includes(p.slug)}
                    onToggleCompare={() => toggleCompare(p.slug)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button key={i + 1} variant={page === i + 1 ? 'default' : 'outline'} size="sm" className="w-8" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </Button>
                )).slice(Math.max(0, page - 3), page + 2)}
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-12 rounded-xl bg-muted/50 border border-border p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div className="flex flex-col items-center gap-2"><CircleCheckBig className="w-6 h-6 text-primary" /><span>ISO 9001 Certified</span></div>
            <div className="flex flex-col items-center gap-2"><ShieldCheck className="w-6 h-6 text-primary" /><span>รับประกัน 1-3 ปี</span></div>
            <div className="flex flex-col items-center gap-2"><Landmark className="w-6 h-6 text-primary" /><span>500+ Enterprise Customers</span></div>
            <div className="flex flex-col items-center gap-2"><HeadsetIcon className="w-6 h-6 text-primary" /><span>ซัพพอร์ตภาษาไทย</span></div>
          </div>
        </div>
      </div>

      {/* Floating compare button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Link to={`/shop/compare?products=${compareList.join(',')}`}>
            <Button size="lg" className="shadow-xl gap-2">
              เปรียบเทียบ ({compareList.length})
            </Button>
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
};

/* ── Product Card ── */
function ProductCard({ product: p, viewMode, isComparing, onToggleCompare }: {
  product: Product; viewMode: 'grid' | 'list'; isComparing: boolean; onToggleCompare: () => void;
}) {
  const tierHint = Math.round(p.unit_price * 0.93);
  const img = p.thumbnail_url || p.image_url || '/placeholder.svg';

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow border-border">
        <CardContent className="p-3 flex gap-4">
          <Link to={`/shop/${p.slug}`} className="flex-shrink-0 w-28 h-28 bg-muted rounded-lg overflow-hidden">
            <img src={img} alt={p.model} className="w-full h-full object-contain" />
          </Link>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <Link to={`/shop/${p.slug}`} className="font-semibold text-sm hover:text-primary transition-colors">{p.model} — {p.name}</Link>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.cpu} / {p.ram_gb}GB / {p.storage_gb}GB {p.storage_type}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary">฿{fmt(p.unit_price)}</span>
                <span className="text-xs text-muted-foreground ml-2">฿{fmt(tierHint)} for 5+ units</span>
              </div>
              <div className="flex items-center gap-2">
                <AddToCartButton productModel={p.model} productName={p.name} estimatedPrice={p.unit_price} size="sm" variant="outline" />
                <Link to={`/shop/${p.slug}#rfq-form`}><Button size="sm" variant="secondary"><FileSearch className="w-3.5 h-3.5 mr-1" />RFQ</Button></Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all border-border relative">
      <CardContent className="p-0">
        {/* Compare checkbox */}
        <label className="absolute top-2 left-2 z-10 flex items-center gap-1.5 cursor-pointer bg-background/80 backdrop-blur rounded-md px-2 py-1 text-[10px]">
          <Checkbox checked={isComparing} onCheckedChange={onToggleCompare} className="h-3.5 w-3.5" />
          เทียบ
        </label>

        {/* Badges */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          {p.is_featured && <Badge className="text-[10px] bg-primary text-primary-foreground">Hot</Badge>}
          {p.stock_status === 'available' && <Badge variant="outline" className="text-[10px] border-green-500 text-green-600 dark:text-green-400">In Stock</Badge>}
        </div>

        <Link to={`/shop/${p.slug}`}>
          <div className="aspect-square bg-muted overflow-hidden rounded-t-xl">
            <img src={img} alt={p.model} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
          </div>
        </Link>

        <div className="p-3 space-y-2">
          <Link to={`/shop/${p.slug}`} className="block">
            <p className="font-semibold text-sm truncate hover:text-primary transition-colors">{p.model}</p>
            <p className="text-xs text-muted-foreground truncate">{p.cpu} / {p.ram_gb}GB / {p.storage_gb}GB</p>
          </Link>
          <div>
            <span className="text-lg font-bold text-primary">฿{fmt(p.unit_price)}</span>
            <p className="text-[10px] text-muted-foreground">฿{fmt(tierHint)} for 5+ units</p>
          </div>
          <div className="flex gap-2 pt-1">
            <Link to={`/shop/${p.slug}#rfq-form`} className="flex-1">
              <Button size="sm" variant="secondary" className="w-full text-xs"><FileSearch className="w-3.5 h-3.5 mr-1" />RFQ</Button>
            </Link>
            <AddToCartButton productModel={p.model} productName={p.name} estimatedPrice={p.unit_price} size="sm" className="flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShopStorefront;

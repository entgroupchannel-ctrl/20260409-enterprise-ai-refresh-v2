import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import AddToCartButton from '@/components/AddToCartButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SearchCheck, LayoutGrid, List, SlidersHorizontal, X, FileSearch, ChevronLeft, ChevronRight, CircleCheckBig, ShieldCheck, Landmark, HeadsetIcon, DollarSign, Cpu, MemoryStick, HardDrive, Package, Tag } from 'lucide-react';
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

const ITEMS_PER_PAGE = 16;
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

  // NEW filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [cpuFilter, setCpuFilter] = useState<string[]>([]);
  const [ramFilter, setRamFilter] = useState<number[]>([]);
  const [storageFilter, setStorageFilter] = useState<number[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, sku, model, series, name, description, category, cpu, ram_gb, storage_gb, storage_type, unit_price, unit_price_vat, image_url, thumbnail_url, gallery_urls, stock_status, is_active, slug, tags, is_featured')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data) {
        const productIds = data.map(p => p.id);
        if (productIds.length > 0) {
          const { data: variants } = await supabase
            .from('product_variants')
            .select('product_id, unit_price')
            .in('product_id', productIds)
            .eq('is_active', true);

          const variantCounts: Record<string, number> = {};
          const minPriceByProduct: Record<string, number> = {};
          (variants || []).forEach((v) => {
            variantCounts[v.product_id] = (variantCounts[v.product_id] || 0) + 1;
            if (!minPriceByProduct[v.product_id] || v.unit_price < minPriceByProduct[v.product_id]) {
              minPriceByProduct[v.product_id] = v.unit_price;
            }
          });

          const enriched = data.map(p => ({
            ...p,
            variant_count: variantCounts[p.id] || 0,
            starting_price: minPriceByProduct[p.id] || p.unit_price,
          }));
          setProducts(enriched as Product[]);
        } else {
          setProducts(data as Product[]);
        }
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Dynamic filter options
  const filterOptions = useMemo(() => {
    const series = [...new Set(products.map(p => p.series).filter(Boolean))] as string[];
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))] as string[];

    const cpus = [...new Set(
      products
        .map(p => p.cpu?.split(/[\s-]/)[0])
        .filter(Boolean)
    )] as string[];

    const rams = [...new Set(
      products.map(p => p.ram_gb).filter((r): r is number => r !== null && r > 0)
    )].sort((a, b) => a - b);

    const storages = [...new Set(
      products.map(p => p.storage_gb).filter((s): s is number => s !== null && s > 0)
    )].sort((a, b) => a - b);

    const prices = products.map(p => p.unit_price).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
    const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 200000;

    return { series, categories, cpus, rams, storages, minPrice, maxPrice };
  }, [products]);

  // Initialize price range when products load
  useEffect(() => {
    if (filterOptions.maxPrice > 0) {
      setPriceRange([filterOptions.minPrice, filterOptions.maxPrice]);
    }
  }, [filterOptions.minPrice, filterOptions.maxPrice]);

  // Filtered & sorted products
  const filtered = useMemo(() => {
    let result = [...products];

    // Enhanced search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.model.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.cpu && p.cpu.toLowerCase().includes(q)) ||
        (p.storage_type && p.storage_type.toLowerCase().includes(q)) ||
        (p.series && p.series.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (seriesFilter.length > 0) result = result.filter(p => p.series && seriesFilter.includes(p.series));
    if (categoryFilter.length > 0) result = result.filter(p => p.category && categoryFilter.includes(p.category));

    // Price range filter
    result = result.filter(p =>
      p.unit_price >= priceRange[0] && p.unit_price <= priceRange[1]
    );

    // CPU filter
    if (cpuFilter.length > 0) {
      result = result.filter(p =>
        p.cpu && cpuFilter.some(c => p.cpu!.toLowerCase().includes(c.toLowerCase()))
      );
    }

    // RAM filter
    if (ramFilter.length > 0) {
      result = result.filter(p => p.ram_gb && ramFilter.includes(p.ram_gb));
    }

    // Storage filter
    if (storageFilter.length > 0) {
      result = result.filter(p => p.storage_gb && storageFilter.includes(p.storage_gb));
    }

    if (sortBy === 'price_asc') result.sort((a, b) => a.unit_price - b.unit_price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.unit_price - a.unit_price);
    else result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

    return result;
  }, [products, search, seriesFilter, categoryFilter, sortBy, priceRange, cpuFilter, ramFilter, storageFilter]);

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
  const toggleCpuFilter = (cpu: string) => {
    setCpuFilter(prev => prev.includes(cpu) ? prev.filter(x => x !== cpu) : [...prev, cpu]);
    setPage(1);
  };
  const toggleRamFilter = (ram: number) => {
    setRamFilter(prev => prev.includes(ram) ? prev.filter(x => x !== ram) : [...prev, ram]);
    setPage(1);
  };
  const toggleStorageFilter = (storage: number) => {
    setStorageFilter(prev => prev.includes(storage) ? prev.filter(x => x !== storage) : [...prev, storage]);
    setPage(1);
  };
  const clearAllFilters = () => {
    setSeriesFilter([]);
    setCategoryFilter([]);
    setCpuFilter([]);
    setRamFilter([]);
    setStorageFilter([]);
    setPriceRange([filterOptions.minPrice, filterOptions.maxPrice]);
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters = seriesFilter.length > 0 || categoryFilter.length > 0 || cpuFilter.length > 0 ||
    ramFilter.length > 0 || storageFilter.length > 0 || search;

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <SEOHead title="Shop — Industrial PC, Panel PC, Mini PC | ENT Group" description="เลือกซื้อ Industrial PC, Panel PC, Mini PC คุณภาพสูงจาก ENT Group ราคาส่ง พร้อมบริการ B2B" path="/shop" />

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Industrial PC & Panel PC Solutions</h1>
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
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4" />
                    ตัวกรอง
                  </CardTitle>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-xs">
                      ล้าง
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">

                  {/* Price Range */}
                  <div>
                    <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" /> ช่วงราคา (฿)
                    </Label>
                    <div className="px-1">
                      <Slider
                        min={filterOptions.minPrice}
                        max={filterOptions.maxPrice}
                        step={1000}
                        value={priceRange}
                        onValueChange={(v) => { setPriceRange(v as [number, number]); setPage(1); }}
                        className="my-3"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>฿{priceRange[0].toLocaleString()}</span>
                        <span>฿{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Series */}
                  {filterOptions.series.length > 0 && (
                    <div>
                      <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" /> Series
                      </Label>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {filterOptions.series.map(s => (
                          <label key={s} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent p-1 rounded">
                            <input
                              type="checkbox"
                              checked={seriesFilter.includes(s)}
                              onChange={() => toggleSeriesFilter(s)}
                              className="w-3.5 h-3.5 accent-primary"
                            />
                            <span>{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* CPU */}
                  {filterOptions.cpus.length > 0 && (
                    <div>
                      <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" /> CPU
                      </Label>
                      <div className="space-y-1.5">
                        {filterOptions.cpus.map(c => (
                          <label key={c} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent p-1 rounded">
                            <input
                              type="checkbox"
                              checked={cpuFilter.includes(c)}
                              onChange={() => toggleCpuFilter(c)}
                              className="w-3.5 h-3.5 accent-primary"
                            />
                            <span>{c}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* RAM */}
                  {filterOptions.rams.length > 0 && (
                    <div>
                      <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                        <MemoryStick className="w-3.5 h-3.5" /> RAM
                      </Label>
                      <div className="flex flex-wrap gap-1.5">
                        {filterOptions.rams.map(r => (
                          <button
                            key={r}
                            onClick={() => toggleRamFilter(r)}
                            className={cn(
                              'px-2.5 py-1 text-xs rounded border transition-colors',
                              ramFilter.includes(r)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background border-border hover:border-primary'
                            )}
                          >
                            {r}GB
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Storage */}
                  {filterOptions.storages.length > 0 && (
                    <div>
                      <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5" /> Storage
                      </Label>
                      <div className="flex flex-wrap gap-1.5">
                        {filterOptions.storages.map(s => (
                          <button
                            key={s}
                            onClick={() => toggleStorageFilter(s)}
                            className={cn(
                              'px-2.5 py-1 text-xs rounded border transition-colors',
                              storageFilter.includes(s)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background border-border hover:border-primary'
                            )}
                          >
                            {s >= 1000 ? `${s / 1000}TB` : `${s}GB`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Category */}
                  {filterOptions.categories.length > 0 && (
                    <div>
                      <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> หมวดหมู่
                      </Label>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {filterOptions.categories.map(c => (
                          <label key={c} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent p-1 rounded">
                            <input
                              type="checkbox"
                              checked={categoryFilter.includes(c)}
                              onChange={() => toggleCategoryFilter(c)}
                              className="w-3.5 h-3.5 accent-primary"
                            />
                            <span className="truncate">{c}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Result count */}
              <Card>
                <CardContent className="pt-4 text-center text-sm">
                  <p className="text-muted-foreground">พบ</p>
                  <p className="text-2xl font-bold text-primary">{filtered.length}</p>
                  <p className="text-xs text-muted-foreground">รายการ</p>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Mobile filter toggle */}
          <div className="lg:hidden fixed bottom-20 left-4 z-30">
            <Button size="sm" variant="secondary" onClick={() => setShowFilters(!showFilters)} className="shadow-lg">
              <SlidersHorizontal className="w-4 h-4 mr-1" /> ตัวกรอง
            </Button>
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {/* Active filter chips */}
            {(cpuFilter.length > 0 || ramFilter.length > 0 || storageFilter.length > 0) && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {cpuFilter.map(c => (
                  <Badge key={`cpu-${c}`} variant="secondary" className="text-xs gap-1">
                    <Cpu className="w-3 h-3" /> {c}
                    <button onClick={() => toggleCpuFilter(c)} className="hover:text-destructive ml-0.5">×</button>
                  </Badge>
                ))}
                {ramFilter.map(r => (
                  <Badge key={`ram-${r}`} variant="secondary" className="text-xs gap-1">
                    <MemoryStick className="w-3 h-3" /> {r}GB
                    <button onClick={() => toggleRamFilter(r)} className="hover:text-destructive ml-0.5">×</button>
                  </Badge>
                ))}
                {storageFilter.map(s => (
                  <Badge key={`storage-${s}`} variant="secondary" className="text-xs gap-1">
                    <HardDrive className="w-3 h-3" /> {s >= 1000 ? `${s / 1000}TB` : `${s}GB`}
                    <button onClick={() => toggleStorageFilter(s)} className="hover:text-destructive ml-0.5">×</button>
                  </Badge>
                ))}
              </div>
            )}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse"><CardContent className="p-4 h-72" /></Card>
                ))}
              </div>
            ) : paged.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">ไม่พบสินค้าที่ตรงกับเงื่อนไข</div>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
                {(p.variant_count || 0) > 1 && <p className="text-[10px] text-muted-foreground">เริ่มต้น</p>}
                <span className="text-lg font-bold text-primary">฿{fmt(p.starting_price || p.unit_price)}</span>
                {(p.variant_count || 0) > 1 && (
                  <Badge variant="secondary" className="text-[9px] ml-1">{p.variant_count} specs</Badge>
                )}
                <span className="text-xs text-muted-foreground ml-2">฿{fmt(tierHint)} for 5+</span>
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
          <div className="aspect-square bg-white rounded-t-xl overflow-hidden border-b border-border group-hover:border-primary/50 transition-colors">
            <img src={img} alt={p.model} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          </div>
        </Link>

        <div className="p-3 space-y-2">
          <Link to={`/shop/${p.slug}`} className="block">
            <p className="font-semibold text-sm truncate hover:text-primary transition-colors">{p.model}</p>
            <p className="text-xs text-muted-foreground truncate">{p.cpu} / {p.ram_gb}GB / {p.storage_gb}GB</p>
          </Link>
          <div>
            {(p.variant_count || 0) > 1 && <p className="text-[10px] text-muted-foreground">เริ่มต้น</p>}
            <span className="text-lg font-bold text-primary">฿{fmt(p.starting_price || p.unit_price)}</span>
            {(p.variant_count || 0) > 1 && (
              <Badge variant="secondary" className="text-[9px] ml-1">{p.variant_count} specs</Badge>
            )}
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

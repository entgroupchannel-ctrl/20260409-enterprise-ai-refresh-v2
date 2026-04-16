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
  warranty_months?: number;
  warranty_type?: string;
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

const seriesNavItems = [
  { id: 'GT Series', label: 'GT Series', icon: '🏭', sub: 'Industrial Fanless', link: '/gt-series' },
  { id: 'GB Series', label: 'GB Series', icon: '⚡', sub: 'Performance PC', link: '/gb-series' },
  { id: 'GK Series', label: 'GK Series', icon: '🖥️', sub: 'Panel PC', link: '/gk-series' },
  { id: 'EPC Series', label: 'EPC Series', icon: '📦', sub: 'Box PC', link: '/epc-box-series' },
  { id: 'iBox Series', label: 'iBox Series', icon: '🔧', sub: 'Embedded PC', link: '/ibox-series' },
  { id: 'Mini PC', label: 'Mini PC', icon: '💻', sub: 'Compact Desktop', link: '/mini-pc' },
  { id: 'Rugged', label: 'Rugged', icon: '🔒', sub: 'IP65/67 Tablet', link: '/rugged-tablet' },
  { id: 'Firewall', label: 'Firewall', icon: '🛡️', sub: 'Multi-LAN Router', link: '/minipc-firewall' },
];

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
        .select('id, sku, model, series, name, description, category, cpu, ram_gb, storage_gb, storage_type, unit_price, unit_price_vat, image_url, thumbnail_url, gallery_urls, stock_status, is_active, slug, tags, is_featured, warranty_months, warranty_type')
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

          // Query product_files for primary images (covers products uploaded via FileManagerModal)
          const { data: productFiles, error: pfError } = await supabase
            .from('product_files')
            .select('product_id, file_url, is_primary, display_order')
            .in('product_id', productIds)
            .eq('file_type', 'image')
            .order('display_order', { ascending: true });

          if (pfError) console.warn('[Shop] product_files query error:', pfError.message);

          // Build map: product_id → best image URL (prefer is_primary, then first by display_order)
          const fileImgByProduct: Record<string, string> = {};
          (productFiles || []).forEach((f) => {
            const existing = fileImgByProduct[f.product_id];
            if (!existing || f.is_primary) {
              fileImgByProduct[f.product_id] = f.file_url;
            }
          });

          // Series-level fallback images
          const seriesFallback: Record<string, string> = {
            'GT Series':   '/images/gt1000/product-angle1.jpg',
            'GK Series':   '/product-placeholder.svg',
            'GB Series':   '/product-placeholder.svg',
            'GTY Series':  '/images/panelpc/gty156-front.png',
            'GTG Series':  '/images/panelpc/gtg-series.png',
            'Smart Display': '/product-placeholder.svg',
            'Mini PC':     '/product-placeholder.svg',
            'Firewall':    '/product-placeholder.svg',
            'Rugged':      '/product-placeholder.svg',
            'iBox Series': '/images/products/ibox-007-main.png',
            'EPC Series':  '/images/wix/0597a3_e66a5a6616b64254a920d2c6f05b93f8_48ed79f4.png',
            'UTC Series':  '/product-placeholder.svg',
            'AIO':         '/product-placeholder.svg',
          };

          // Model-specific image overrides for products whose DB image_url points to missing files
          const SB = 'https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/product-images/gt-series';
          const modelImageMap: Record<string, string> = {
            // GTY Series
            'gty121t-base': '/images/panelpc/gty121-front.jpg',
            'gty150t-base': '/images/panelpc/gty156-front.png',
            'gty156t-base': '/images/panelpc/gty156-front.png',
            'gty185t-base': '/images/panelpc/gty156-front.png',
            'gty215t-base': '/images/panelpc/gty156-front.png',
            // GK Series — base variants with broken /images/wix/gk* paths
            'gk1501': `${SB}/gk1506-primary.jpg`,
            'gk1501-base': `${SB}/gk1506-primary.jpg`,
            'gk1506-base': `${SB}/gk1506-primary.jpg`,
            'gk2101-base': `${SB}/gk2101-primary.png`,
            // GT Series — variants with NULL image_url
            'gt1100-4gb-128gb-wifi-4g': `${SB}/gt1000-primary.jpg`,
            'gt194-v2': `${SB}/gt1000-primary.jpg`,
            'gt196-i38140u-8gb-128gb-wifi-4g': `${SB}/gt1000-primary.jpg`,
            'gt5000': `${SB}/gt4500-primary.jpg`,
            'gt670-i36157u-4gb-128gb-wifi-4g-v3': `${SB}/gt6000-primary.jpg`,
            'gt710-2gb': `${SB}/gt7000-primary.jpg`,
            'gt770-i58250u-8gb-256gb-wifi': `${SB}/gt7000-primary.jpg`,
            'gt790-256gb-wifi-4g': `${SB}/gt7000-primary.jpg`,
            'gt7900-i77920hq-16gb-256gb-wifi-4g-v2': `${SB}/gt7000-primary.jpg`,
            'gt850-i74650u-4gb-256gb-wifi-4g': `${SB}/gt8000-primary.jpg`,
            'gt980-i710710u-64gb-wifi-4g': `${SB}/gt9000-primary.jpg`,
            'gt990-i77820hk-16gb-256gb-wifi-4g': `${SB}/gt9000-primary.jpg`,
          };

          const enriched = data.map(p => {
            const fileImg = fileImgByProduct[p.id];
            const modelOverride = modelImageMap[p.sku];
            const dbImg = p.thumbnail_url || p.image_url;
            const fallback = (p.series && seriesFallback[p.series]) || '/product-placeholder.svg';
            // Use model override if available, otherwise use DB image
            const bestImg = modelOverride || fileImg || dbImg || fallback;
            return {
              ...p,
              variant_count: variantCounts[p.id] || 0,
              starting_price: minPriceByProduct[p.id] || p.unit_price,
              thumbnail_url: bestImg,
              image_url: modelOverride || fileImg || p.image_url || fallback,
            };
          });
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
    const cpus = [...new Set(products.map(p => p.cpu?.split(/[\s-]/)[0]).filter(Boolean))] as string[];
    const rams = [...new Set(products.map(p => p.ram_gb).filter((r): r is number => r !== null && r > 0))].sort((a, b) => a - b);
    const storages = [...new Set(products.map(p => p.storage_gb).filter((s): s is number => s !== null && s > 0))].sort((a, b) => a - b);
    const prices = products.map(p => p.unit_price).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
    const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 200000;
    return { series, categories, cpus, rams, storages, minPrice, maxPrice };
  }, [products]);

  useEffect(() => {
    if (filterOptions.maxPrice > 0) {
      setPriceRange([filterOptions.minPrice, filterOptions.maxPrice]);
    }
  }, [filterOptions.minPrice, filterOptions.maxPrice]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.model.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)) ||
        (p.cpu && p.cpu.toLowerCase().includes(q)) || (p.storage_type && p.storage_type.toLowerCase().includes(q)) ||
        (p.series && p.series.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q))
      );
    }
    if (seriesFilter.length > 0) result = result.filter(p => p.series && seriesFilter.includes(p.series));
    if (categoryFilter.length > 0) result = result.filter(p => p.category && categoryFilter.includes(p.category));
    result = result.filter(p => p.unit_price >= priceRange[0] && p.unit_price <= priceRange[1]);
    if (cpuFilter.length > 0) result = result.filter(p => p.cpu && cpuFilter.some(c => p.cpu!.toLowerCase().includes(c.toLowerCase())));
    if (ramFilter.length > 0) result = result.filter(p => p.ram_gb && ramFilter.includes(p.ram_gb));
    if (storageFilter.length > 0) result = result.filter(p => p.storage_gb && storageFilter.includes(p.storage_gb));
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

  const toggleSeriesFilter = (s: string) => { setSeriesFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]); setPage(1); };
  const toggleCategoryFilter = (c: string) => { setCategoryFilter(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]); setPage(1); };
  const toggleCpuFilter = (cpu: string) => { setCpuFilter(prev => prev.includes(cpu) ? prev.filter(x => x !== cpu) : [...prev, cpu]); setPage(1); };
  const toggleRamFilter = (ram: number) => { setRamFilter(prev => prev.includes(ram) ? prev.filter(x => x !== ram) : [...prev, ram]); setPage(1); };
  const toggleStorageFilter = (storage: number) => { setStorageFilter(prev => prev.includes(storage) ? prev.filter(x => x !== storage) : [...prev, storage]); setPage(1); };
  const clearAllFilters = () => {
    setSeriesFilter([]); setCategoryFilter([]); setCpuFilter([]); setRamFilter([]); setStorageFilter([]);
    setPriceRange([filterOptions.minPrice, filterOptions.maxPrice]); setSearch(''); setPage(1);
  };

  const hasActiveFilters = seriesFilter.length > 0 || categoryFilter.length > 0 || cpuFilter.length > 0 ||
    ramFilter.length > 0 || storageFilter.length > 0 || search;

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <SEOHead title="Shop — Industrial PC, Panel PC, Mini PC | ENT Group" description="เลือกซื้อ Industrial PC, Panel PC, Mini PC คุณภาพสูงจาก ENT Group ราคาส่ง พร้อมบริการ B2B" path="/shop" />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden min-h-[300px] md:min-h-[380px] flex items-center bg-gradient-to-br from-background via-background to-primary/5 border-b border-border">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative container max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Left: Text */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="h-px w-10 bg-primary" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">B2B Industrial Computing</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                สินค้า<span className="text-primary">ทั้งหมด</span>
              </h1>
              <p className="text-muted-foreground max-w-lg text-sm md:text-base">
                Industrial PC, Panel PC, Mini PC คุณภาพสูง — Fanless, ทนความร้อน, ทำงาน 24/7
                รับประกัน 1–3 ปี บริการหลังขายภาษาไทย
              </p>

              {/* Quick stats */}
              <div className="flex gap-6 justify-center lg:justify-start text-center">
                {[
                  { n: `${products.length}+`, label: 'สินค้า' },
                  { n: '500+', label: 'ลูกค้า' },
                  { n: '24/7', label: 'ซัพพอร์ต' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-primary">{s.n}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Search bar */}
              <div className="flex gap-2 max-w-md mx-auto lg:mx-0">
                <div className="relative flex-1">
                  <SearchCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหา Model, SKU, CPU..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="pl-9 h-11"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36 h-11"><SelectValue placeholder="เรียงตาม" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">แนะนำ</SelectItem>
                    <SelectItem value="price_asc">ราคา ต่ำ→สูง</SelectItem>
                    <SelectItem value="price_desc">ราคา สูง→ต่ำ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right: Series quick-nav pills */}
            <div className="flex-shrink-0 w-full lg:w-80">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 text-center lg:text-left">เลือกตาม Series</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {seriesNavItems.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSeriesFilter([s.id]); setPage(1); }}
                    className={cn(
                      'flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all hover:-translate-y-0.5',
                      seriesFilter.includes(s.id)
                        ? 'bg-primary/10 border-primary/50 text-primary'
                        : 'bg-card border-border hover:border-primary/30 hover:bg-muted/50'
                    )}
                  >
                    <span className="text-lg">{s.icon}</span>
                    <div>
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-muted-foreground">{s.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Series Filter Bar ── */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
            <Button
              variant={seriesFilter.length === 0 ? 'default' : 'ghost'}
              size="sm"
              className="shrink-0 h-8 text-xs"
              onClick={() => { setSeriesFilter([]); setPage(1); }}
            >
              ทั้งหมด ({products.length})
            </Button>
            {filterOptions.series.map(s => {
              const nav = seriesNavItems.find(n => n.id === s);
              return (
                <Button
                  key={s}
                  variant={seriesFilter.includes(s) ? 'default' : 'ghost'}
                  size="sm"
                  className="shrink-0 h-8 text-xs gap-1.5"
                  onClick={() => { toggleSeriesFilter(s); setPage(1); }}
                >
                  {nav?.icon} {s}
                  <Badge variant="secondary" className="text-[9px] ml-0.5 h-4 px-1">
                    {products.filter(p => p.series === s).length}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-4">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4" /> ตัวกรอง
                  </CardTitle>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 text-xs">ล้าง</Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Range */}
                  <div>
                    <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> ช่วงราคา (฿)</Label>
                    <div className="px-1">
                      <Slider min={filterOptions.minPrice} max={filterOptions.maxPrice} step={1000} value={priceRange} onValueChange={(v) => { setPriceRange(v as [number, number]); setPage(1); }} className="my-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>฿{priceRange[0].toLocaleString()}</span>
                        <span>฿{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* CPU */}
                  {filterOptions.cpus.length > 0 && (
                    <div>
                      <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> CPU</Label>
                      <div className="space-y-1.5">
                        {filterOptions.cpus.map(c => (
                          <label key={c} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent p-1 rounded">
                            <input type="checkbox" checked={cpuFilter.includes(c)} onChange={() => toggleCpuFilter(c)} className="w-3.5 h-3.5 accent-primary" />
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
                      <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5"><MemoryStick className="w-3.5 h-3.5" /> RAM</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {filterOptions.rams.map(r => (
                          <button key={r} onClick={() => toggleRamFilter(r)} className={cn('px-2.5 py-1 text-xs rounded border transition-colors', ramFilter.includes(r) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary')}>
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
                      <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" /> Storage</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {filterOptions.storages.map(s => (
                          <button key={s} onClick={() => toggleStorageFilter(s)} className={cn('px-2.5 py-1 text-xs rounded border transition-colors', storageFilter.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary')}>
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
                      <Label className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> หมวดหมู่</Label>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {filterOptions.categories.map(c => (
                          <label key={c} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-accent p-1 rounded">
                            <input type="checkbox" checked={categoryFilter.includes(c)} onChange={() => toggleCategoryFilter(c)} className="w-3.5 h-3.5 accent-primary" />
                            <span className="truncate">{c}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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
              <p className="text-sm text-muted-foreground">แสดง {paged.length} จาก {filtered.length} สินค้า</p>
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

        {/* ── Series Showcase Links ── */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary/5 to-background border border-border p-8">
          <h2 className="text-xl font-bold mb-2 text-center">เลือกดูตาม Product Line</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">แต่ละ Series มีสเปก Use Case และราคาที่แตกต่างกัน เลือกดูรายละเอียดได้เลย</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {seriesNavItems.map(s => (
              <Link key={s.link} to={s.link}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-1 transition-all text-center group">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="text-xs font-bold group-hover:text-primary transition-colors">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">{s.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-8 rounded-xl bg-muted/50 border border-border p-6">
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
            <Button size="lg" className="shadow-xl gap-2">เปรียบเทียบ ({compareList.length})</Button>
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
};

/* ── Product Card — Upgraded ── */
function ProductCard({ product: p, viewMode, isComparing, onToggleCompare }: {
  product: Product; viewMode: 'grid' | 'list'; isComparing: boolean; onToggleCompare: () => void;
}) {
  const [imgSrc, setImgSrc] = useState<string>(p.thumbnail_url || p.image_url || '/placeholder.svg');
  const displayPrice = p.starting_price || p.unit_price;
  const bulkHint = Math.round(displayPrice * 0.93);

  const isNew = p.tags?.some(t => t.toLowerCase().includes('new'));
  const isHot = p.is_featured;
  const isSale = p.tags?.some(t => t.toLowerCase().includes('sale') || t.toLowerCase().includes('promo'));

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-md hover:border-primary/30 transition-all border-border">
        <CardContent className="p-0">
          <div className="flex gap-0">
            <Link to={`/shop/${p.slug}`} className="w-32 md:w-44 shrink-0 bg-white dark:bg-zinc-900 rounded-l-xl overflow-hidden border-r border-border">
              <img
                src={imgSrc}
                alt={p.model}
                className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                style={{ aspectRatio: '1/1' }}
                onError={() => setImgSrc('/placeholder.svg')}
              />
            </Link>
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
              <div className="space-y-1">
                <div className="flex items-start gap-2 flex-wrap">
                  <Link to={`/shop/${p.slug}`}>
                    <h3 className="font-bold text-base hover:text-primary transition-colors">{p.model}</h3>
                  </Link>
                  {isNew && <Badge className="text-[10px] bg-emerald-500 text-white">NEW</Badge>}
                  {isHot && <Badge className="text-[10px] bg-primary text-primary-foreground">HOT</Badge>}
                  {isSale && <Badge className="text-[10px] bg-red-500 text-white">SALE</Badge>}
                </div>
                {p.name && p.name !== p.model && <p className="text-sm text-muted-foreground">{p.name}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.cpu && <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded"><Cpu className="w-2.5 h-2.5" /> {p.cpu}</span>}
                  {p.ram_gb && <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded"><MemoryStick className="w-2.5 h-2.5" /> {p.ram_gb}GB RAM</span>}
                  {p.storage_gb && <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded"><HardDrive className="w-2.5 h-2.5" /> {p.storage_gb >= 1000 ? `${p.storage_gb / 1000}TB` : `${p.storage_gb}GB`} {p.storage_type}</span>}
                  {(p.variant_count || 0) > 1 && <span className="text-[10px] bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">{p.variant_count} สเปก</span>}
                </div>
              </div>
              <div className="flex items-end justify-between gap-3 mt-3">
                <div>
                  {(p.variant_count || 0) > 1 && <p className="text-[10px] text-muted-foreground">เริ่มต้น</p>}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-primary">฿{fmt(displayPrice)}</span>
                    <span className="text-xs text-muted-foreground line-through">฿{fmt(Math.round(displayPrice * 1.07))}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">฿{fmt(bulkHint)} สำหรับ 5+ ชิ้น</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/shop/${p.slug}#rfq-form`}>
                    <Button size="sm" variant="outline" className="text-xs"><FileSearch className="w-3.5 h-3.5 mr-1" /> RFQ</Button>
                  </Link>
                  <Link to={`/shop/${p.slug}`}>
                    <Button size="sm" className="text-xs">ดูสเปก</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid card
  return (
    <Card className="group hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-200 border-border relative overflow-hidden">
      <CardContent className="p-0">
        <label className="absolute top-2 left-2 z-10 flex items-center gap-1 cursor-pointer bg-background/85 backdrop-blur rounded-md px-1.5 py-1 text-[10px]">
          <Checkbox checked={isComparing} onCheckedChange={onToggleCompare} className="h-3 w-3" />
          เทียบ
        </label>

        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          {isNew && <Badge className="text-[10px] bg-emerald-500 text-white shadow-sm">NEW</Badge>}
          {isHot && <Badge className="text-[10px] bg-primary text-primary-foreground shadow-sm">HOT</Badge>}
          {isSale && <Badge className="text-[10px] bg-red-500 text-white shadow-sm">SALE</Badge>}
          {p.stock_status === 'available' && (
            <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-600 bg-background/80 shadow-sm">In Stock</Badge>
          )}
        </div>

        <Link to={`/shop/${p.slug}`}>
          <div className="bg-white dark:bg-zinc-900 rounded-t-xl overflow-hidden border-b border-border/50 aspect-[4/3]">
            <img
              src={imgSrc}
              alt={p.model}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={() => setImgSrc('/placeholder.svg')}
            />
          </div>
        </Link>

        <div className="p-3 space-y-2">
          <div>
            <div className="flex items-start justify-between gap-1">
              <Link to={`/shop/${p.slug}`}>
                <h3 className="font-bold text-sm hover:text-primary transition-colors leading-tight">{p.model}</h3>
              </Link>
              {p.series && <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded shrink-0 font-mono">{p.series}</span>}
            </div>
            {p.name && p.name !== p.model && <p className="text-[10px] text-muted-foreground truncate mt-0.5">{p.name}</p>}
          </div>

          {/* Spec mini-pills */}
          <div className="flex flex-wrap gap-1">
            {p.cpu && <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded flex items-center gap-0.5"><Cpu className="w-2 h-2" /> {p.cpu.split(' ').slice(0, 3).join(' ')}</span>}
            {p.ram_gb && <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded">{p.ram_gb}GB</span>}
            {p.storage_gb && <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded">{p.storage_gb >= 1000 ? `${p.storage_gb / 1000}TB` : `${p.storage_gb}GB`}</span>}
            {(p.variant_count || 0) > 1 && <span className="text-[9px] bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">{p.variant_count} specs</span>}
          </div>

          {/* Price */}
          <div className="border-t border-border/50 pt-2">
            {(p.variant_count || 0) > 1 && <p className="text-[9px] text-muted-foreground">เริ่มต้น</p>}
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-primary">฿{fmt(displayPrice)}</span>
              <span className="text-[10px] text-muted-foreground">+VAT</span>
            </div>
            <p className="text-[10px] text-muted-foreground">฿{fmt(bulkHint)}/ชิ้น สำหรับ 5+</p>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-1.5 pt-0.5">
            <Link to={`/shop/${p.slug}#rfq-form`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full text-xs h-8"><FileSearch className="w-3 h-3 mr-1" /> RFQ</Button>
            </Link>
            <Link to={`/shop/${p.slug}`} className="flex-1">
              <Button size="sm" className="w-full text-xs h-8">ดูรายละเอียด</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShopStorefront;

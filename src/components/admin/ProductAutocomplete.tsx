import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Search, Loader2, X, Package, Cpu, HardDrive, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductData {
  id: string;
  sku: string;
  model: string;
  series: string | null;
  name: string;
  description: string | null;
  category: string | null;
  cpu: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  storage_type: string | null;
  has_wifi: boolean | null;
  has_4g: boolean | null;
  os: string | null;
  unit_price: number;
  image_url: string | null;
  thumbnail_url: string | null;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelectProduct: (product: ProductData) => void;
  className?: string;
  placeholder?: string;
}

const PAGE_SIZE = 20;
const SELECT_COLS =
  'id, sku, model, series, name, description, category, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, os, unit_price, image_url, thumbnail_url';

export default function ProductAutocomplete({
  value, onChange, onSelectProduct, className, placeholder,
}: Props) {
  const [results, setResults] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [mode, setMode] = useState<'browse' | 'search'>('browse');
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lastQueryRef = useRef<string>('');

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchPage = useCallback(async (
    query: string,
    pageIndex: number,
    append: boolean,
  ) => {
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      let q = supabase
        .from('products')
        .select(SELECT_COLS)
        .eq('is_active', true);

      if (query && query.length >= 2) {
        q = q.or(
          `name.ilike.%${query}%,sku.ilike.%${query}%,model.ilike.%${query}%,series.ilike.%${query}%,cpu.ilike.%${query}%`,
        );
      }

      const { data, error } = await q
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('name', { ascending: true })
        .range(from, to);

      if (error) throw error;
      const rows = (data as ProductData[]) || [];

      setResults((prev) => (append ? [...prev, ...rows] : rows));
      setHasMore(rows.length === PAGE_SIZE);
      setPage(pageIndex);
    } catch (e) {
      console.error('ProductAutocomplete fetch error:', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Open / focus → load initial browse list (only once unless mode changes)
  const handleOpen = async () => {
    setOpen(true);
    if (results.length === 0 && !loading) {
      setMode('browse');
      lastQueryRef.current = '';
      await fetchPage('', 0, false);
    }
  };

  // Search with debounce when value changes
  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length >= 2) {
      const timer = setTimeout(() => {
        setMode('search');
        lastQueryRef.current = trimmed;
        fetchPage(trimmed, 0, false);
        setOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
    if (trimmed.length === 0 && mode === 'search') {
      // Reverted to browse
      setMode('browse');
      lastQueryRef.current = '';
      fetchPage('', 0, false);
    }
  }, [value, fetchPage, mode]);

  // Infinite scroll within the dropdown
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (loadingMore || loading || !hasMore) return;
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
      fetchPage(lastQueryRef.current, page + 1, true);
    }
  };

  const loadMore = () => {
    if (loadingMore || loading || !hasMore) return;
    fetchPage(lastQueryRef.current, page + 1, true);
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', {
      style: 'currency', currency: 'THB', minimumFractionDigits: 0,
    }).format(n);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder || 'พิมพ์ชื่อสินค้า / SKU / รุ่น (หรือคลิกเพื่อดูรายชื่อทั้งหมด)'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleOpen}
          className="pl-9 pr-9 h-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
        {!loading && value && (
          <button
            type="button"
            onClick={() => { onChange(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg overflow-hidden">
          <div className="px-3 py-2 bg-muted/50 border-b text-xs text-muted-foreground flex items-center justify-between">
            <span>
              {mode === 'search'
                ? `ผลการค้นหา "${lastQueryRef.current}"`
                : 'รายการสินค้าทั้งหมดในระบบ'}
            </span>
            <span>{results.length} รายการ{hasMore ? '+' : ''}</span>
          </div>

          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-96 overflow-y-auto"
          >
            {results.length === 0 && !loading && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                ไม่พบสินค้า
              </div>
            )}

            {results.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelectProduct(p);
                  setOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-accent border-b last:border-b-0 transition-colors"
              >
                <div className="flex items-start gap-2">
                  {p.thumbnail_url || p.image_url ? (
                    <img
                      src={p.thumbnail_url || p.image_url || ''}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded border flex-shrink-0"/>
                  ) : (
                    <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm truncate">{p.name}</p>
                      <span className="text-sm font-bold text-primary whitespace-nowrap">
                        {formatCurrency(p.unit_price)}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">{p.sku}</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {p.cpu && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5">
                          <Cpu className="w-2.5 h-2.5" />
                          {p.cpu.split(' ').slice(0, 2).join(' ')}
                        </Badge>
                      )}
                      {p.ram_gb && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{p.ram_gb}GB</Badge>
                      )}
                      {p.storage_gb && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5">
                          <HardDrive className="w-2.5 h-2.5" />
                          {p.storage_gb}GB
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {loadingMore && (
              <div className="px-3 py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                กำลังโหลดเพิ่ม...
              </div>
            )}

            {!loadingMore && hasMore && results.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={loadMore}
                className="w-full h-9 rounded-none border-t text-xs text-primary"
              >
                <ChevronDown className="w-3.5 h-3.5 mr-1" />
                โหลดเพิ่มอีก {PAGE_SIZE} รายการ
              </Button>
            )}

            {!hasMore && results.length > 0 && (
              <div className="px-3 py-2 text-center text-[10px] text-muted-foreground border-t">
                แสดงครบทุกรายการแล้ว
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

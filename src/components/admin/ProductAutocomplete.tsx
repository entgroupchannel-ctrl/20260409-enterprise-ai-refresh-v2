import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Search, Loader2, X, Package, Cpu, HardDrive } from 'lucide-react';
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

export default function ProductAutocomplete({ 
  value, onChange, onSelectProduct, className, placeholder 
}: Props) {
  const [results, setResults] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Prefetch first 8 on focus (when no search)
  const loadInitial = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('products')
        .select('id, sku, model, series, name, description, category, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, os, unit_price, image_url, thumbnail_url')
        .eq('is_active', true)
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('name', { ascending: true })
        .limit(8);
      setResults((data as ProductData[]) || []);
    } catch (e) {
      console.error('loadInitial error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Search with debounce when value changes
  useEffect(() => {
    if (!value || value.length < 2) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('products')
          .select('id, sku, model, series, name, description, category, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, os, unit_price, image_url, thumbnail_url')
          .eq('is_active', true)
          .or(`name.ilike.%${value}%,sku.ilike.%${value}%,model.ilike.%${value}%,series.ilike.%${value}%,cpu.ilike.%${value}%`)
          .order('name', { ascending: true })
          .limit(8);
        setResults((data as ProductData[]) || []);
        setOpen(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(n);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder || 'พิมพ์ชื่อสินค้า / SKU / รุ่น (หรือคลิกเพื่อดูรายชื่อ)'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={async () => {
            if (results.length > 0) { setOpen(true); return; }
            await loadInitial();
            setOpen(true);
          }}
          className="pl-9 pr-9 h-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
        {!loading && value && (
          <button
            type="button"
            onClick={() => { onChange(''); setResults([]); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg">
          {!value && (
            <div className="px-3 py-2 bg-muted/50 border-b text-xs text-muted-foreground">
              แสดง 8 รายการแรก — พิมพ์เพื่อค้นหาเฉพาะเจาะจง
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
                  <img src={p.thumbnail_url || p.image_url || ''} alt={p.name}
                    className="w-10 h-10 object-cover rounded border flex-shrink-0" />
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
        </Card>
      )}
    </div>
  );
}

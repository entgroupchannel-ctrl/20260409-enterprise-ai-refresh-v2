import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Package,
  Loader2,
  Plus,
  Cpu,
  HardDrive,
  Wifi,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface PickedProduct {
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (product: PickedProduct) => void;
}

const PAGE_SIZE = 24;

export default function ProductPickerDialog({ open, onOpenChange, onSelect }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<PickedProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Smart page numbers with ellipsis
  const pageNumbers = (current: number, total: number): number[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [1];
    if (current > 3) pages.push(-1);
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push(-1);
    if (!pages.includes(total)) pages.push(total);
    return pages;
  };

  // Load categories once when dialog opens
  const loadCategories = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true)
        .not('category', 'is', null);

      if (data) {
        const cats = Array.from(
          new Set(data.map((p: any) => p.category).filter(Boolean) as string[])
        ).sort();
        setCategories(cats);
      }
    } catch (e) {
      console.error('loadCategories error:', e);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('id, sku, model, series, name, description, category, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, os, unit_price, image_url, thumbnail_url',
          { count: 'exact' })
        .eq('is_active', true);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,sku.ilike.%${search}%,model.ilike.%${search}%,series.ilike.%${search}%,cpu.ilike.%${search}%`
        );
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await query
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('name', { ascending: true })
        .range(from, to);

      if (error) throw error;

      setProducts((data || []) as PickedProduct[]);
      setTotalCount(count || 0);
    } catch (e: any) {
      toast({ title: 'โหลดสินค้าไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Load categories once when dialog opens
  useEffect(() => {
    if (!open) return;
    loadCategories();
  }, [open]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  // Reload data when page/filters change
  useEffect(() => {
    if (!open) return;
    loadData();
  }, [open, page, search, selectedCategory]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setPage(1);
      setSearch('');
      setSelectedCategory('all');
    }
  }, [open]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(n);

  const buildSpecText = (p: PickedProduct): string => {
    const parts: string[] = [];
    if (p.cpu) parts.push(`CPU: ${p.cpu}`);
    if (p.ram_gb) parts.push(`RAM: ${p.ram_gb}GB`);
    if (p.storage_gb) parts.push(`Storage: ${p.storage_gb}GB ${p.storage_type || ''}`.trim());
    if (p.has_wifi || p.has_4g) {
      const net: string[] = [];
      if (p.has_wifi) net.push('WiFi');
      if (p.has_4g) net.push('4G');
      parts.push(`Network: ${net.join(' + ')}`);
    }
    if (p.os) parts.push(`OS: ${p.os}`);
    return parts.join('\n');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            เลือกสินค้าจากคลัง
          </DialogTitle>
          <DialogDescription>
            เลือกหมวดหมู่และค้นหาสินค้าที่ต้องการเพิ่มในใบเสนอราคา
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 flex-wrap flex-shrink-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา: ชื่อ, รุ่น, SKU, CPU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="เลือกหมวดหมู่" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto space-y-4 -mx-1 px-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>ไม่พบสินค้า</p>
                <p className="text-xs mt-1">
                  {search ? 'ลองเปลี่ยนคำค้นหา' : 'ไม่มีสินค้าในหมวดนี้'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {products.map((p) => (
                <Card
                  key={p.id}
                  className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                  onClick={() => {
                    const spec = buildSpecText(p);
                    onSelect({
                      ...p,
                      description: spec || p.description || '',
                    });
                    onOpenChange(false);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      {p.thumbnail_url || p.image_url ? (
                        <img
                          src={p.thumbnail_url || p.image_url || ''}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded border bg-white"
                         loading="lazy" decoding="async"/>
                      ) : (
                        <div className="w-16 h-16 rounded border bg-muted flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{p.sku}</p>

                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          {p.cpu && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5">
                              <Cpu className="w-2.5 h-2.5" />
                              {p.cpu.split(' ').slice(0, 2).join(' ')}
                            </Badge>
                          )}
                          {p.ram_gb && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                              {p.ram_gb}GB
                            </Badge>
                          )}
                          {p.storage_gb && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5">
                              <HardDrive className="w-2.5 h-2.5" />
                              {p.storage_gb}GB
                            </Badge>
                          )}
                          {p.has_wifi && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                              <Wifi className="w-2.5 h-2.5" />
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-1.5">
                          <span className="font-bold text-primary text-sm">
                            {formatCurrency(p.unit_price)}
                          </span>
                          <Plus className="w-3.5 h-3.5 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pagination footer */}
        {!loading && totalCount > 0 && (
          <div className="flex items-center justify-between border-t pt-3 flex-wrap gap-2 flex-shrink-0">
            <p className="text-xs text-muted-foreground">
              แสดง {((page - 1) * PAGE_SIZE) + 1}-{Math.min(page * PAGE_SIZE, totalCount)} จาก {totalCount.toLocaleString()} รายการ
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {pageNumbers(page, totalPages).map((n, i) =>
                  n === -1 ? (
                    <span key={`dot-${i}`} className="px-1 text-muted-foreground">…</span>
                  ) : (
                    <Button
                      key={n}
                      variant={page === n ? 'default' : 'outline'}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

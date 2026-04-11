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

export default function ProductPickerDialog({ open, onOpenChange, onSelect }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<PickedProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (!open) return;
    loadData();
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, sku, model, series, name, description, category, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, os, unit_price, image_url, thumbnail_url')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      const productList = (data || []) as PickedProduct[];
      setProducts(productList);

      const cats = Array.from(
        new Set(productList.map((p) => p.category).filter(Boolean) as string[])
      ).sort();
      setCategories(cats);
    } catch (e: any) {
      toast({ title: 'โหลดสินค้าไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s) ||
        p.model.toLowerCase().includes(s) ||
        (p.series || '').toLowerCase().includes(s) ||
        (p.cpu || '').toLowerCase().includes(s)
      );
    }
    return true;
  });

  const grouped = filtered.reduce((acc, p) => {
    const key = p.series || p.category || 'อื่นๆ';
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {} as Record<string, PickedProduct[]>);

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
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            เลือกสินค้าจากคลัง
          </DialogTitle>
          <DialogDescription>
            เลือกหมวดหมู่และค้นหาสินค้าที่ต้องการเพิ่มในใบเสนอราคา
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 flex-wrap">
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

        <div className="flex-1 overflow-y-auto space-y-4 -mx-1 px-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
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
            Object.entries(grouped).map(([groupName, items]) => (
              <div key={groupName}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
                  {groupName} ({items.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map((p) => (
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
                            />
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
              </div>
            ))
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          พบ {filtered.length} สินค้า • คลิกเพื่อเพิ่มในใบเสนอราคา
        </p>
      </DialogContent>
    </Dialog>
  );
}

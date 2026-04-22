import { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search, Loader2, Package, AlertTriangle, Edit2, BarChart3,
} from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  model: string;
  category: string | null;
  series: string | null;
  unit_price: number;
  buy_price: number | null;
  stock_quantity: number | null;
  stock_status: string | null;
  min_stock_level: number | null;
  reorder_point: number | null;
  is_active: boolean | null;
  image_url: string | null;
  thumbnail_url: string | null;
}

const STOCK_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  available: { label: 'มีสต๊อค', cls: 'bg-green-100 text-green-700 border-green-300' },
  low_stock: { label: 'สต๊อคต่ำ', cls: 'bg-amber-100 text-amber-700 border-amber-300' },
  out_of_stock: { label: 'หมดสต๊อค', cls: 'bg-red-100 text-red-700 border-red-300' },
  pre_order: { label: 'สั่งจอง', cls: 'bg-blue-100 text-blue-700 border-blue-300' },
  discontinued: { label: 'เลิกจำหน่าย', cls: 'bg-gray-100 text-gray-500 border-gray-300' },
};

function getAutoStatus(qty: number, reorderPoint: number | null): string {
  if (qty <= 0) return 'out_of_stock';
  if (reorderPoint && qty <= reorderPoint) return 'low_stock';
  if (qty <= 5) return 'low_stock';
  return 'available';
}

const PAGE_SIZE = 50;

export default function AdminInventory() {
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Stock update dialog
  const [updateProduct, setUpdateProduct] = useState<Product | null>(null);
  const [newQty, setNewQty] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { loadData(); }, [debouncedSearch, statusFilter, page]);

  const loadData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('id, sku, name, model, category, series, unit_price, buy_price, stock_quantity, stock_status, min_stock_level, reorder_point, is_active, image_url, thumbnail_url', { count: 'exact' })
        .eq('is_active', true);

      if (statusFilter !== 'all') {
        query = query.eq('stock_status', statusFilter);
      }

      if (debouncedSearch) {
        query = query.or(
          `sku.ilike.%${debouncedSearch}%,name.ilike.%${debouncedSearch}%,model.ilike.%${debouncedSearch}%,series.ilike.%${debouncedSearch}%`
        );
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await query
        .order('name', { ascending: true })
        .range(from, to);

      if (error) throw error;
      setProducts((data as Product[]) || []);
      setTotalCount(count || 0);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!updateProduct) return;
    setSaving(true);
    try {
      const newStatus = getAutoStatus(newQty, updateProduct.reorder_point);
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newQty, stock_status: newStatus })
        .eq('id', updateProduct.id);

      if (error) throw error;

      toast({ title: 'อัพเดทสต๊อกสำเร็จ', description: `${updateProduct.name} → ${newQty} ชิ้น` });
      setUpdateProduct(null);
      loadData();
    } catch (e: any) {
      toast({ title: 'อัพเดทไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const openStockDialog = (p: Product) => {
    setUpdateProduct(p);
    setNewQty(p.stock_quantity ?? 0);
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  // Stats
  const totalProducts = totalCount;
  const totalValue = products.reduce((s, p) => s + (p.unit_price * (p.stock_quantity ?? 0)), 0);
  const lowStockCount = products.filter(p => p.stock_status === 'low_stock').length;
  const outOfStockCount = products.filter(p => p.stock_status === 'out_of_stock' || (p.stock_quantity ?? 0) <= 0).length;
  const watchList = products.filter(p => (p.stock_quantity ?? 0) <= (p.reorder_point ?? 5));

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <AdminLayout>
      <AdminPageLayout
        title="คลังสินค้า (Inventory)"
        description={`สินค้าทั้งหมด ${totalCount.toLocaleString()} รายการ`}
      >
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              รายงานคลัง
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="w-4 h-4" />
              รายการสินค้า ({totalCount})
            </TabsTrigger>
          </TabsList>

          {/* ── Reports Tab ── */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">สินค้าทั้งหมด</p>
                      <p className="text-2xl font-bold">{totalProducts.toLocaleString()}</p>
                    </div>
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">มูลค่าสต๊อค (ราคาขาย)</p>
                      <p className="text-2xl font-bold">฿{formatCurrency(totalValue)}</p>
                    </div>
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">สินค้าใกล้หมด</p>
                      <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">หมดสต๊อค</p>
                      <p className="text-2xl font-bold text-destructive">{outOfStockCount}</p>
                    </div>
                    <Package className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Watch list */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  สินค้าที่ต้องเฝ้าระวัง
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {watchList.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    ไม่มีสินค้าที่ต้องเฝ้าระวัง
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>ชื่อสินค้า</TableHead>
                        <TableHead className="text-center">สต๊อค</TableHead>
                        <TableHead className="text-center">Reorder Point</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {watchList.map((p) => {
                        const info = STOCK_STATUS_MAP[p.stock_status || 'available'] || STOCK_STATUS_MAP.available;
                        return (
                          <TableRow key={p.id}>
                            <TableCell className="font-mono text-sm">{p.sku}</TableCell>
                            <TableCell className="text-sm max-w-[250px] truncate">{p.name}</TableCell>
                            <TableCell className="text-center font-bold">{p.stock_quantity ?? 0}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{p.reorder_point ?? '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${info.cls}`}>{info.label}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => openStockDialog(p)}>
                                <Edit2 className="w-3 h-3 mr-1" />
                                อัพเดท
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Inventory Tab ── */}
          <TabsContent value="inventory" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-3 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="ค้นหา: SKU, ชื่อ, รุ่น, ซีรี่ส์..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="สถานะสต๊อค" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="available">มีสต๊อค</SelectItem>
                      <SelectItem value="low_stock">สต๊อคต่ำ</SelectItem>
                      <SelectItem value="out_of_stock">หมดสต๊อค</SelectItem>
                      <SelectItem value="pre_order">สั่งจอง</SelectItem>
                      <SelectItem value="discontinued">เลิกจำหน่าย</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Product table */}
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>ไม่พบสินค้า</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]" />
                        <TableHead>SKU / ชื่อ</TableHead>
                        <TableHead>ซีรี่ส์</TableHead>
                        <TableHead className="text-right">ราคาขาย</TableHead>
                        <TableHead className="text-center">สต๊อค</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((p) => {
                        const info = STOCK_STATUS_MAP[p.stock_status || 'available'] || STOCK_STATUS_MAP.available;
                        const qty = p.stock_quantity ?? 0;
                        return (
                          <TableRow key={p.id}>
                            <TableCell>
                              {(p.thumbnail_url || p.image_url) ? (
                                <img
                                  src={p.thumbnail_url || p.image_url || ''}
                                  alt={p.name}
                                  className="w-10 h-10 object-contain rounded border"
                                 loading="lazy" decoding="async"/>
                              ) : (
                                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                  <Package className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-mono text-xs text-muted-foreground">{p.sku}</div>
                              <div className="text-sm font-medium truncate max-w-[280px]">{p.name}</div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{p.series || '-'}</TableCell>
                            <TableCell className="text-right font-mono text-sm">
                              ฿{formatCurrency(p.unit_price)}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`font-bold text-lg ${qty <= 0 ? 'text-destructive' : qty <= 5 ? 'text-amber-600' : ''}`}>
                                {qty}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${info.cls}`}>{info.label}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => openStockDialog(p)}>
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  หน้า {page} / {totalPages} • รวม {totalCount.toLocaleString()} รายการ
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                    ก่อนหน้า
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
                    ถัดไป
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Stock Update Dialog */}
        <Dialog open={!!updateProduct} onOpenChange={(open) => { if (!open) setUpdateProduct(null); }}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>อัพเดทสต๊อกสินค้า</DialogTitle>
              <DialogDescription>
                ปรับปรุงจำนวนสต๊อก "{updateProduct?.name}"
              </DialogDescription>
            </DialogHeader>
            {updateProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">SKU:</span>
                    <div className="font-mono font-medium">{updateProduct.sku}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">สต๊อกปัจจุบัน:</span>
                    <div className="font-medium">{updateProduct.stock_quantity ?? 0} ชิ้น</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-stock">จำนวนสต๊อกใหม่</Label>
                  <Input
                    id="new-stock"
                    type="number"
                    min="0"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    สถานะใหม่: {STOCK_STATUS_MAP[getAutoStatus(newQty, updateProduct.reorder_point)]?.label}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setUpdateProduct(null)}>ยกเลิก</Button>
              <Button onClick={handleUpdateStock} disabled={saving}>
                {saving ? 'กำลังบันทึก...' : 'อัพเดทสต๊อก'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageLayout>
    </AdminLayout>
  );
}

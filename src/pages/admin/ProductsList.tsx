import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Package, Upload, Search, CheckCircle, XCircle, Download, Trash2,
  MoreVertical, FolderOpen, Eye, ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react';
import FileManagerModal from '@/components/admin/FileManagerModal';

interface Product {
  id: string;
  sku: string;
  model: string;
  series: string | null;
  name: string;
  category: string | null;
  unit_price: number;
  stock_status: string | null;
  is_active: boolean;
  image_url: string | null;
  thumbnail_url: string | null;
  slug: string;
}

const PER_PAGE_OPTIONS = [20, 50, 100, 200];

export default function ProductsList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // File manager
  const [fileProduct, setFileProduct] = useState<Product | null>(null);

  // Distinct values for filters
  const [seriesList, setSeriesList] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);

  // Load filter options once
  useEffect(() => {
    (async () => {
      const [s, c] = await Promise.all([
        supabase.from('products').select('series').not('series', 'is', null),
        supabase.from('products').select('category').not('category', 'is', null),
      ]);
      if (s.data) setSeriesList([...new Set(s.data.map((r: any) => r.series as string))].sort());
      if (c.data) setCategoryList([...new Set(c.data.map((r: any) => r.category as string))].sort());
    })();
  }, []);

  // Load products (server-side pagination + filtering)
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Build count query
      let countQ = supabase.from('products').select('*', { count: 'exact', head: true });
      let dataQ = supabase.from('products')
        .select('id, sku, model, series, name, category, unit_price, stock_status, is_active, image_url, thumbnail_url, slug')
        .order('created_at', { ascending: false });

      // Apply filters to both
      if (search) {
        const like = `%${search}%`;
        countQ = countQ.or(`model.ilike.${like},name.ilike.${like},sku.ilike.${like}`);
        dataQ = dataQ.or(`model.ilike.${like},name.ilike.${like},sku.ilike.${like}`);
      }
      if (seriesFilter !== 'all') {
        countQ = countQ.eq('series', seriesFilter);
        dataQ = dataQ.eq('series', seriesFilter);
      }
      if (categoryFilter !== 'all') {
        countQ = countQ.eq('category', categoryFilter);
        dataQ = dataQ.eq('category', categoryFilter);
      }
      if (statusFilter === 'active') {
        countQ = countQ.eq('is_active', true);
        dataQ = dataQ.eq('is_active', true);
      } else if (statusFilter === 'inactive') {
        countQ = countQ.eq('is_active', false);
        dataQ = dataQ.eq('is_active', false);
      }

      const from = (page - 1) * perPage;
      dataQ = dataQ.range(from, from + perPage - 1);

      const [countRes, dataRes] = await Promise.all([countQ, dataQ]);
      setTotalCount(countRes.count || 0);
      setProducts((dataRes.data as any) || []);
    } catch (error: any) {
      toast({ title: 'โหลดสินค้าไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, seriesFilter, categoryFilter, statusFilter]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, seriesFilter, categoryFilter, statusFilter, perPage]);

  const totalPages = Math.ceil(totalCount / perPage);

  // Bulk ops
  const allSelected = products.length > 0 && selectedIds.size === products.length;
  const someSelected = selectedIds.size > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const bulkUpdate = async (update: Record<string, any>, label: string) => {
    try {
      const { error } = await supabase.from('products').update(update as any).in('id', [...selectedIds]);
      if (error) throw error;
      toast({ title: `${label} ${selectedIds.size} รายการ สำเร็จ` });
      setSelectedIds(new Set());
      loadProducts();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    }
  };

  const bulkDelete = async () => {
    if (!confirm(`ต้องการลบ ${selectedIds.size} รายการ?`)) return;
    try {
      const { error } = await supabase.from('products').delete().in('id', [...selectedIds]);
      if (error) throw error;
      toast({ title: `ลบ ${selectedIds.size} รายการ สำเร็จ` });
      setSelectedIds(new Set());
      loadProducts();
    } catch (error: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: error.message, variant: 'destructive' });
    }
  };

  const exportCSV = () => {
    const selected = products.filter(p => selectedIds.has(p.id));
    const rows = [
      ['SKU', 'Model', 'Name', 'Series', 'Category', 'Price', 'Status'].join(','),
      ...selected.map(p => [p.sku, p.model, `"${p.name}"`, p.series, p.category, p.unit_price, p.is_active ? 'Active' : 'Inactive'].join(',')),
    ].join('\n');
    const blob = new Blob(['\ufeff' + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-4 overflow-auto max-h-[calc(100vh-4rem)] pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">คลังสินค้า</h1>
            <p className="text-sm text-muted-foreground mt-0.5">จัดการสินค้าทั้งหมด {totalCount.toLocaleString()} รายการ</p>
          </div>
          <Button onClick={() => navigate('/admin/products/import')}>
            <Upload className="w-4 h-4 mr-2" />Import
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา SKU, Model, ชื่อ..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={seriesFilter} onValueChange={setSeriesFilter}>
            <SelectTrigger><SelectValue placeholder="Series" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุก Series</SelectItem>
              {seriesList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger><SelectValue placeholder="หมวดหมู่" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
              {categoryList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="สถานะ" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {someSelected && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
              <span className="text-sm font-medium">เลือกแล้ว {selectedIds.size} รายการ</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => bulkUpdate({ is_active: true }, 'เปิดใช้งาน')}>
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />เปิดใช้งาน
              </Button>
              <Button size="sm" variant="outline" onClick={() => bulkUpdate({ is_active: false }, 'ปิดใช้งาน')}>
                <XCircle className="w-3.5 h-3.5 mr-1.5" />ปิดใช้งาน
              </Button>
              <Button size="sm" variant="outline" onClick={exportCSV}>
                <Download className="w-3.5 h-3.5 mr-1.5" />Export
              </Button>
              <Button size="sm" variant="destructive" onClick={bulkDelete}>
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />ลบ
              </Button>
            </div>
          </div>
        )}

        {/* Per-page & info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">แสดง</span>
            <Select value={perPage.toString()} onValueChange={(v) => setPerPage(parseInt(v))}>
              <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PER_PAGE_OPTIONS.map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">รายการต่อหน้า</span>
          </div>
          <span className="text-muted-foreground">
            {totalCount > 0 && `${((page - 1) * perPage) + 1}-${Math.min(page * perPage, totalCount)} จาก ${totalCount.toLocaleString()}`}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 border rounded-lg">
            <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-medium">ไม่พบสินค้า</p>
            <p className="text-sm text-muted-foreground mt-1">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="w-12">รูป</TableHead>
                  <TableHead>SKU / Model</TableHead>
                  <TableHead className="hidden lg:table-cell">ชื่อสินค้า</TableHead>
                  <TableHead className="hidden md:table-cell">Series</TableHead>
                  <TableHead className="text-right">ราคา</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right w-24">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-accent/50" onClick={() => navigate(`/products/${p.slug}`)}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(p.id)}
                        onCheckedChange={() => toggleSelect(p.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="w-9 h-9 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {(p.thumbnail_url || p.image_url) ? (
                          <img src={p.thumbnail_url || p.image_url!} alt="" className="w-full h-full object-contain"  loading="lazy" decoding="async"/>
                        ) : (
                          <Package className="w-3.5 h-3.5 text-muted-foreground/40" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{p.model}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{p.sku}</div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[200px] truncate text-sm text-muted-foreground">
                      {p.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{p.series || '-'}</TableCell>
                    <TableCell className="text-right text-sm font-medium tabular-nums">
                      ฿{p.unit_price?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.is_active ? 'default' : 'secondary'} className="text-[10px]">
                        {p.is_active ? 'Active' : 'Off'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-0.5">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFileProduct(p)} title="จัดการไฟล์">
                          <FolderOpen className="w-3.5 h-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="w-3.5 h-3.5" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/products/${p.slug}`)}>
                              <Eye className="w-3.5 h-3.5 mr-2" />ดูรายละเอียด
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFileProduct(p)}>
                              <FolderOpen className="w-3.5 h-3.5 mr-2" />จัดการไฟล์
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                await supabase.from('products').update({ is_active: !p.is_active } as any).eq('id', p.id);
                                loadProducts();
                              }}
                            >
                              {p.is_active ? <XCircle className="w-3.5 h-3.5 mr-2" /> : <CheckCircle className="w-3.5 h-3.5 mr-2" />}
                              {p.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              หน้า {page} จาก {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
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
                    className="w-8"
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </Button>
                )
              )}
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* File Manager */}
      <FileManagerModal
        open={!!fileProduct}
        onOpenChange={(open) => { if (!open) setFileProduct(null); }}
        product={fileProduct}
      />
    </AdminLayout>
  );
}

/** Generate page numbers with ellipsis (-1) */
function pageNumbers(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: number[] = [1];
  if (current > 3) pages.push(-1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push(-1);
  if (!pages.includes(total)) pages.push(total);
  return pages;
}

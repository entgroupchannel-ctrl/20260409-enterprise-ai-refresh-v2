import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/layouts/AdminLayout';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, Upload, Plus, Eye, Pencil, ToggleLeft, ToggleRight } from 'lucide-react';

interface Product {
  id: string;
  product_code: string | null;
  sku: string;
  model: string;
  series: string | null;
  name: string;
  category: string | null;
  unit_price: number;
  unit_price_vat: number | null;
  stock_status: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  image_url: string | null;
  created_at: string;
}

const stockStatusLabels: Record<string, string> = {
  available: 'พร้อมขาย',
  low_stock: 'ใกล้หมด',
  out_of_stock: 'หมดสต๊อก',
  discontinued: 'ยกเลิก',
};

const stockStatusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  low_stock: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  out_of_stock: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  discontinued: 'bg-muted text-muted-foreground',
};

export default function ProductsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, product_code, sku, model, series, name, category, unit_price, unit_price_vat, stock_status, stock_quantity, is_active, is_featured, image_url, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts((data as any) || []);
    } catch (error: any) {
      toast({ title: 'โหลดสินค้าไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active } as any)
        .eq('id', product.id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
      toast({ title: product.is_active ? 'ปิดการใช้งานสินค้า' : 'เปิดการใช้งานสินค้า' });
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    }
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { active: 0, inactive: 0 };
    products.forEach(p => {
      if (p.is_active) counts.active++;
      else counts.inactive++;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (statusFilter === 'active') result = result.filter(p => p.is_active);
    else if (statusFilter === 'inactive') result = result.filter(p => !p.is_active);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.model.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.product_code || '').toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'oldest') result = [...result].reverse();
    else if (sortBy === 'price_high') result = [...result].sort((a, b) => b.unit_price - a.unit_price);
    else if (sortBy === 'price_low') result = [...result].sort((a, b) => a.unit_price - b.unit_price);

    return result;
  }, [products, statusFilter, searchQuery, sortBy]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="คลังสินค้า"
        description={`จัดการสินค้าทั้งหมด ${products.length} รายการ`}
        searchPlaceholder="ค้นหารุ่น, ชื่อสินค้า, SKU..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterOptions={[
          { value: 'newest', label: 'ล่าสุด → เก่าสุด' },
          { value: 'oldest', label: 'เก่าสุด → ล่าสุด' },
          { value: 'price_high', label: 'ราคาสูง → ต่ำ' },
          { value: 'price_low', label: 'ราคาต่ำ → สูง' },
        ]}
        filterValue={sortBy}
        onFilterChange={setSortBy}
        statsTabs={[
          { label: 'ทั้งหมด', value: 'all', count: products.length },
          { label: 'ใช้งาน', value: 'active', count: statusCounts.active },
          { label: 'ปิดการใช้งาน', value: 'inactive', count: statusCounts.inactive },
        ]}
        activeTab={statusFilter}
        onTabChange={setStatusFilter}
        resultsCount={filteredProducts.length}
        actionButton={{
          label: 'Import Excel',
          icon: <Upload className="w-4 h-4 mr-2" />,
          onClick: () => navigate('/admin/products/import'),
        }}
      >
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title="ไม่พบสินค้า"
            description={products.length === 0
              ? 'ยังไม่มีสินค้าในระบบ เริ่มต้นด้วยการ Import จาก Excel'
              : 'ไม่พบสินค้าที่ตรงกับเงื่อนไข'
            }
            action={products.length === 0 ? { label: 'Import จาก Excel', onClick: () => navigate('/admin/products/import') } : undefined}
          />
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">รูป</TableHead>
                  <TableHead>รุ่น</TableHead>
                  <TableHead className="hidden lg:table-cell">ชื่อสินค้า</TableHead>
                  <TableHead className="hidden md:table-cell">หมวดหมู่</TableHead>
                  <TableHead className="text-right">ราคา</TableHead>
                  <TableHead className="hidden sm:table-cell">สต๊อก</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right w-24">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.model} className="w-full h-full object-contain" />
                        ) : (
                          <Package className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{product.model}</div>
                      <div className="text-xs text-muted-foreground">{product.sku}</div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate text-sm">
                      {product.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {product.category || '-'}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      ฿{product.unit_price?.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className={stockStatusColors[product.stock_status || 'available'] || ''}>
                        {stockStatusLabels[product.stock_status || 'available'] || product.stock_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'ใช้งาน' : 'ปิด'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleActive(product)}
                          title={product.is_active ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'}
                        >
                          {product.is_active ? <ToggleRight className="w-4 h-4 text-primary" /> : <ToggleLeft className="w-4 h-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AdminPageLayout>
    </AdminLayout>
  );
}

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import SpecComparisonTable from '@/components/shop/SpecComparisonTable';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trash2 } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import ShopActivityPanel from '@/components/shop/ShopActivityPanel';

interface Product {
  id: string; slug: string; model: string; name: string; thumbnail_url: string | null;
  cpu: string | null; ram_gb: number | null; storage_gb: number | null; storage_type: string | null;
  has_wifi: boolean; has_4g: boolean; os: string | null; form_factor: string | null;
  unit_price: number; stock_status: string | null;
}

const COMPARE_KEY = 'shopCompareList';

const ShopCompare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const slugsParam = searchParams.get('products') || '';
  const slugs = slugsParam.split(',').filter(Boolean);

  useEffect(() => {
    if (slugs.length === 0) { setLoading(false); return; }
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('id, slug, model, name, thumbnail_url, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, os, form_factor, unit_price, stock_status')
        .in('slug', slugs)
        .eq('is_active', true);
      setProducts((data || []) as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, [slugsParam]);

  const handleRemove = (slug: string) => {
    const newSlugs = slugs.filter(s => s !== slug);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(newSlugs));
    setSearchParams(newSlugs.length > 0 ? { products: newSlugs.join(',') } : {});
  };

  const clearAll = () => {
    localStorage.setItem(COMPARE_KEY, '[]');
    setSearchParams({});
    setProducts([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <SEOHead title="เปรียบเทียบสินค้า | ENT Group" description="เปรียบเทียบสเปก Industrial PC หลายรุ่นพร้อมกัน" path="/shop/compare" />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground flex items-center gap-1">
        <Link to="/" className="hover:text-primary">หน้าแรก</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">เปรียบเทียบ</span>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">เปรียบเทียบสินค้า ({products.length} รุ่น)</h1>
          {products.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <Trash2 className="w-4 h-4 mr-1" /> ล้างทั้งหมด
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-muted-foreground">ยังไม่ได้เลือกสินค้าสำหรับเปรียบเทียบ</p>
            <Link to="/shop"><Button>ไปเลือกสินค้า</Button></Link>
          </div>
        ) : (
          <SpecComparisonTable products={products} onRemove={handleRemove} />
        )}
      </div>

      <ShopActivityPanel />
      <Footer />
    </div>
  );
};

export default ShopCompare;

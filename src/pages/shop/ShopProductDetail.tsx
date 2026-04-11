import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import ProductImageGalleryZoom from '@/components/shop/ProductImageGalleryZoom';
import TierPricingTable from '@/components/shop/TierPricingTable';
import SupplierInfoCard from '@/components/shop/SupplierInfoCard';
import QuickRFQForm from '@/components/shop/QuickRFQForm';
import RelatedProducts, { addToRecentlyViewed } from '@/components/shop/RelatedProducts';
import ReviewsSection from '@/components/shop/ReviewsSection';
import AddToCartButton from '@/components/AddToCartButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ChevronRight, Minus, Plus, Star, MessageSquare } from 'lucide-react';

interface Product {
  id: string; sku: string; slug: string; model: string; series: string | null; name: string;
  description: string | null; category: string | null; cpu: string | null; ram_gb: number | null;
  storage_gb: number | null; storage_type: string | null; has_wifi: boolean; has_4g: boolean;
  os: string | null; form_factor: string | null; unit_price: number; unit_price_vat: number | null;
  image_url: string | null; thumbnail_url: string | null; gallery_urls: string[] | null;
  stock_status: string | null; tags: string[] | null; is_featured: boolean;
}

function fmt(n: number) { return n.toLocaleString('th-TH'); }

const specFields = [
  { key: 'cpu', label: 'CPU' },
  { key: 'ram_gb', label: 'RAM', suffix: ' GB DDR4' },
  { key: 'storage_gb', label: 'Storage', suffix: '' },
  { key: 'storage_type', label: 'Storage Type' },
  { key: 'has_wifi', label: 'WiFi', boolean: true },
  { key: 'has_4g', label: '4G LTE', boolean: true },
  { key: 'os', label: 'ระบบปฏิบัติการ' },
  { key: 'form_factor', label: 'Form Factor' },
  { key: 'sku', label: 'SKU' },
];

const ShopProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (data) {
        setProduct(data as Product);
        addToRecentlyViewed({
          id: data.id,
          slug: data.slug,
          model: data.model,
          thumbnail_url: data.thumbnail_url,
          unit_price: data.unit_price,
        });
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">ไม่พบสินค้า</p>
          <Link to="/shop"><Button variant="outline">กลับหน้า Shop</Button></Link>
        </div>
      </div>
    );
  }

  const images = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean) as string[];
  const activeTierPrice = qty >= 10 ? Math.round(product.unit_price * 0.86) : qty >= 5 ? Math.round(product.unit_price * 0.93) : product.unit_price;
  const totalPrice = activeTierPrice * qty;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.model} — ${product.name} | ENT Group`}
        description={`${product.model} ${product.cpu || ''} ${product.ram_gb || ''}GB RAM — ราคา ฿${fmt(product.unit_price)} จาก ENT Group ผู้นำด้าน Industrial PC`}
        path={`/shop/${product.slug}`}
      />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground flex items-center gap-1 flex-wrap">
        <Link to="/" className="hover:text-primary">หน้าแรก</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        {product.series && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span>{product.series}</span>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">{product.model}</span>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Top section: Gallery + Info */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Gallery */}
          <ProductImageGalleryZoom images={images} alt={product.model} />

          {/* Product info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {product.is_featured && <Badge className="bg-primary text-primary-foreground text-[10px]">Hot</Badge>}
                {product.stock_status === 'available' && <Badge variant="outline" className="text-[10px] border-green-500 text-green-600 dark:text-green-400">In Stock</Badge>}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{product.model}</h1>
              <p className="text-muted-foreground mt-1">{product.name}</p>
              {product.description && <p className="text-sm text-muted-foreground mt-2">{product.description}</p>}
            </div>

            <Separator />

            {/* Tier Pricing */}
            <TierPricingTable basePrice={product.unit_price} selectedQuantity={qty} />

            {/* Quantity + Total */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">จำนวน:</span>
                <div className="flex items-center border border-border rounded-md">
                  <button className="px-3 py-1.5 hover:bg-muted transition-colors" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="w-4 h-4" /></button>
                  <Input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-8 text-center border-0 focus-visible:ring-0"
                  />
                  <button className="px-3 py-1.5 hover:bg-muted transition-colors" onClick={() => setQty(qty + 1)}><Plus className="w-4 h-4" /></button>
                </div>
                <span className="text-sm text-muted-foreground">= <span className="text-lg font-bold text-primary">฿{fmt(totalPrice)}</span></span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <AddToCartButton
                  productModel={product.model}
                  productName={product.name}
                  estimatedPrice={product.unit_price}
                  size="lg"
                  className="flex-1"
                />
                <a href="#rfq-form" className="flex-1">
                  <Button size="lg" variant="secondary" className="w-full">📋 ขอใบเสนอราคา B2B</Button>
                </a>
              </div>
            </div>

            <Separator />

            {/* Supplier Info */}
            <SupplierInfoCard />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="specs" className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="specs">สเปก</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="specs">
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {specFields.map((sf, i) => {
                    const val = (product as any)[sf.key];
                    if (val === null || val === undefined) return null;
                    return (
                      <tr key={sf.key} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                        <td className="px-4 py-2.5 font-medium text-muted-foreground w-40">{sf.label}</td>
                        <td className="px-4 py-2.5">
                          {sf.boolean !== undefined
                            ? (val ? '✅' : '❌')
                            : `${val}${sf.suffix || ''}`
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsSection />
          </TabsContent>
        </Tabs>

        {/* RFQ Form */}
        <div className="mb-8">
          <QuickRFQForm product={product} defaultQuantity={qty} />
        </div>

        {/* Related */}
        <RelatedProducts
          currentProductId={product.id}
          series={product.series}
          category={product.category}
        />
      </div>

      <Footer />
    </div>
  );
};

export default ShopProductDetail;

import { useState, useEffect, useRef } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Minus, Plus, Cpu, MemoryStick, HardDrive, Wifi, Signal, Monitor, Settings, ShieldCheck } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';

interface Product {
  id: string; sku: string; slug: string; model: string; series: string | null; name: string;
  description: string | null; category: string | null; cpu: string | null; ram_gb: number | null;
  storage_gb: number | null; storage_type: string | null; has_wifi: boolean; has_4g: boolean;
  os: string | null; form_factor: string | null; unit_price: number; unit_price_vat: number | null;
  image_url: string | null; thumbnail_url: string | null; gallery_urls: string[] | null;
  stock_status: string | null; tags: string[] | null; is_featured: boolean;
}

function fmt(n: number) { return n.toLocaleString('th-TH'); }

function SpecRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

const ShopProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
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

  // Sticky CTA observer
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [product]);

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

  // Spec chips for hero
  const specChips: { icon: React.ReactNode; label: string }[] = [];
  if (product.cpu) specChips.push({ icon: <Cpu className="w-3.5 h-3.5 text-primary" />, label: product.cpu });
  if (product.ram_gb) specChips.push({ icon: <MemoryStick className="w-3.5 h-3.5 text-primary" />, label: `${product.ram_gb}GB RAM` });
  if (product.storage_gb) specChips.push({ icon: <HardDrive className="w-3.5 h-3.5 text-primary" />, label: `${product.storage_gb}GB ${product.storage_type || ''}`.trim() });
  if (product.has_wifi) specChips.push({ icon: <Wifi className="w-3.5 h-3.5 text-primary" />, label: 'WiFi' });
  if (product.has_4g) specChips.push({ icon: <Signal className="w-3.5 h-3.5 text-primary" />, label: '4G LTE' });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.model} — ${product.name} | ENT Group`}
        description={`${product.model} ${product.cpu || ''} ${product.ram_gb || ''}GB RAM — ราคา ฿${fmt(product.unit_price)} จาก ENT Group ผู้นำด้าน Industrial PC`}
        path={`/shop/${product.slug}`}
      />

      {/* Navbar */}
      <SiteNavbar />

      {/* Sticky Breadcrumb */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-2 text-sm text-muted-foreground flex items-center gap-1 flex-wrap">
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
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Top section: Gallery + Info */}
        <div ref={heroRef} className="grid lg:grid-cols-2 gap-8 mb-8 pt-4">
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
            </div>

            {/* Spec chips */}
            {specChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {specChips.map((chip, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full text-sm">
                    {chip.icon}
                    <span>{chip.label}</span>
                  </div>
                ))}
              </div>
            )}

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

        {/* Tabs — specs, description, warranty, reviews */}
        <Tabs defaultValue="specs" className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="specs">สเปกเทคนิค</TabsTrigger>
            <TabsTrigger value="description">รายละเอียดสินค้า</TabsTrigger>
            <TabsTrigger value="warranty">การรับประกัน</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Specs — grouped cards */}
          <TabsContent value="specs">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Performance */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-0 text-sm">
                  <SpecRow label="CPU" value={product.cpu} />
                  <SpecRow label="RAM" value={product.ram_gb ? `${product.ram_gb}GB DDR4` : null} />
                  <SpecRow label="Storage" value={product.storage_gb ? `${product.storage_gb}GB ${product.storage_type || ''}`.trim() : null} />
                </CardContent>
              </Card>

              {/* Connectivity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-primary" />
                    Connectivity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-0 text-sm">
                  <SpecRow label="WiFi" value={product.has_wifi ? '✅ Built-in' : '❌ ไม่มี'} />
                  <SpecRow label="4G LTE" value={product.has_4g ? '✅ Built-in' : '❌ ไม่มี'} />
                </CardContent>
              </Card>

              {/* System */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-0 text-sm">
                  <SpecRow label="OS" value={product.os} />
                  <SpecRow label="Form Factor" value={product.form_factor} />
                  <SpecRow label="SKU" value={product.sku} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Description */}
          <TabsContent value="description">
            <Card>
              <CardContent className="p-6 prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-sm leading-relaxed">
                {product.description || 'ยังไม่มีรายละเอียดสินค้า'}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Warranty */}
          <TabsContent value="warranty">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">รับประกันสินค้า 1 ปี</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      สินค้าทุกชิ้นรับประกันจากผู้ผลิตและ ENT Group 
                      ครอบคลุมความเสียหายจากการผลิต ไม่รวมความเสียหายจากการใช้งานผิดวิธี
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Monitor className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">บริการหลังการขาย</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ทีมช่างเทคนิคพร้อมดูแลตลอดอายุการใช้งาน 
                      มีอะไหล่สำรองและบริการซ่อมนอกสถานที่
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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

      {/* Mobile sticky CTA bar */}
      {showSticky && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 z-40 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">ราคาเริ่มต้น</p>
              <p className="text-lg font-bold text-primary">฿{fmt(product.unit_price)}</p>
            </div>
            <Button asChild size="sm">
              <a href="#rfq-form">📋 ขอใบเสนอราคา</a>
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ShopProductDetail;

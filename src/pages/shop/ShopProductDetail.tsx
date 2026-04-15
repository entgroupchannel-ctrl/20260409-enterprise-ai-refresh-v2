import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import ProductImageGalleryZoom from '@/components/shop/ProductImageGalleryZoom';
import ShopProductConfigurator, { type AddonSummary } from '@/components/shop/ShopProductConfigurator';
import TierPricingTable from '@/components/shop/TierPricingTable';
import QuickRFQForm from '@/components/shop/QuickRFQForm';
import RelatedProducts, { addToRecentlyViewed } from '@/components/shop/RelatedProducts';
import AddToCartButton from '@/components/AddToCartButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  ChevronRight, Minus, Plus, Microchip, MemoryStick, CircuitBoard, Wifi, Antenna,
  ShieldCheck, Truck, Clock, FileText, Phone, MessageCircle, CheckCircle2,
  Package, Award, Headphones, ReceiptText, Factory, Building2, Warehouse, Server,
  Zap, ThermometerSun, Droplets, Monitor,
} from 'lucide-react';
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

const USE_CASES = [
  { icon: Factory, label: 'โรงงานอุตสาหกรรม', desc: 'ควบคุมไลน์ผลิต 24/7' },
  { icon: Building2, label: 'ธุรกิจค้าปลีก POS', desc: 'ระบบขายหน้าร้าน' },
  { icon: Warehouse, label: 'คลังสินค้า', desc: 'จัดการสต๊อก WMS' },
  { icon: Server, label: 'ระบบ Edge Computing', desc: 'ประมวลผลข้อมูล IoT' },
  { icon: Monitor, label: 'Digital Signage', desc: 'แสดงผลหน้าจอ 24 ชม.' },
  { icon: ThermometerSun, label: 'สภาพแวดล้อมรุนแรง', desc: 'ทนร้อน ฝุ่น ความชื้น' },
];

const PRODUCT_HIGHLIGHTS = [
  { icon: Zap, text: 'Fanless — ไม่มีพัดลม เงียบ ไม่มีฝุ่นเข้า' },
  { icon: ThermometerSun, text: 'ทำงานได้ -10°C ถึง 50°C' },
  { icon: Droplets, text: 'ป้องกันฝุ่นและน้ำ (IP-rated)' },
  { icon: Zap, text: 'กินไฟต่ำ 10-25W เหมาะงาน 24/7' },
];

const ShopProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [configuredVariant, setConfiguredVariant] = useState<Product | null>(null);
  const [configPrice, setConfigPrice] = useState(0);
  const [configAddons, setConfigAddons] = useState<AddonSummary[]>([]);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products').select('*').eq('slug', slug).eq('is_active', true).maybeSingle();
      if (data) {
        setProduct(data as Product);
        addToRecentlyViewed({ id: data.id, slug: data.slug, model: data.model, thumbnail_url: data.thumbnail_url, unit_price: data.unit_price });
        const { data: variants } = await supabase
          .from('product_variants').select('*').eq('product_id', data.id).eq('is_active', true).order('unit_price', { ascending: true });
        if (variants && variants.length > 0) {
          const defaultV = variants.find((v) => v.is_default) || variants[0];
          if (defaultV) {
            setConfiguredVariant({ ...data, sku: defaultV.sku, cpu: defaultV.cpu, ram_gb: defaultV.ram_gb, storage_gb: defaultV.storage_gb, storage_type: defaultV.storage_type, has_wifi: defaultV.has_wifi ?? false, has_4g: defaultV.has_4g ?? false, os: defaultV.os, unit_price: defaultV.unit_price, unit_price_vat: defaultV.unit_price_vat } as Product);
            setConfigPrice(defaultV.unit_price);
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0 });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [product]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-lg font-semibold">ไม่พบสินค้า</p>
        <Link to="/shop"><Button variant="outline">กลับหน้า Shop</Button></Link>
      </div>
    </div>
  );

  const images = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean) as string[];
  const displayVariant = configuredVariant || product;
  const displayPrice = configPrice || product.unit_price;
  const activeTierPrice = qty >= 10 ? Math.round(displayPrice * 0.86) : qty >= 5 ? Math.round(displayPrice * 0.93) : displayPrice;
  const totalPrice = activeTierPrice * qty;

  const inlineSpecs: { icon: React.ElementType; label: string; value: string }[] = [];
  if (displayVariant.cpu) inlineSpecs.push({ icon: Microchip, label: 'CPU', value: displayVariant.cpu });
  if (displayVariant.ram_gb) inlineSpecs.push({ icon: MemoryStick, label: 'RAM', value: `${displayVariant.ram_gb}GB` });
  if (displayVariant.storage_gb) inlineSpecs.push({ icon: CircuitBoard, label: 'Storage', value: `${displayVariant.storage_gb}GB ${displayVariant.storage_type || 'SSD'}` });
  if (displayVariant.has_wifi) inlineSpecs.push({ icon: Wifi, label: 'WiFi', value: 'Built-in' });
  if (displayVariant.has_4g) inlineSpecs.push({ icon: Antenna, label: '4G', value: 'LTE SIM' });
  if (displayVariant.os) inlineSpecs.push({ icon: Package, label: 'OS', value: displayVariant.os });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.model} — ${product.name} | ENT Group`}
        description={`${product.model} ${product.cpu || ''} ${product.ram_gb || ''}GB RAM — ราคา ฿${fmt(product.unit_price)} จาก ENT Group ผู้นำด้าน Industrial PC`}
        path={`/shop/${product.slug}`}
      />
      <SiteNavbar />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/20">
        <div className="container max-w-7xl mx-auto px-4 py-2 text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">หน้าแรก</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          {product.series && (<><ChevronRight className="w-3 h-3" /><span>{product.series}</span></>)}
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{product.model}</span>
        </div>
      </div>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <div ref={heroRef} className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Gallery */}
          <div className="lg:col-span-4">
            <ProductImageGalleryZoom images={images} alt={product.model} />
            {/* Product highlights — under gallery */}
            <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">จุดเด่น</p>
              {PRODUCT_HIGHLIGHTS.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                  <h.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{h.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER: Product Info + Price + Actions */}
          <div className="lg:col-span-5 space-y-4">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {product.stock_status === 'available' && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] gap-1">
                    <CheckCircle2 className="w-3 h-3" /> In Stock
                  </Badge>
                )}
                {product.is_featured && <Badge variant="secondary" className="text-[10px]">แนะนำ</Badge>}
                <span className="text-[10px] text-muted-foreground font-mono">SKU: {displayVariant.sku}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">{product.model}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{product.name}</p>
            </div>

            {/* Inline specs */}
            {inlineSpecs.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {inlineSpecs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 px-2.5 rounded-md bg-muted/40 border border-border/60">
                    <spec.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-muted-foreground block leading-none">{spec.label}</span>
                      <span className="text-xs font-medium text-foreground truncate block">{spec.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            {/* Price + Volume */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-primary">฿{fmt(displayPrice)}</span>
                <span className="text-xs text-muted-foreground">/ ชิ้น (ก่อน VAT)</span>
              </div>
              <TierPricingTable basePrice={displayPrice} selectedQuantity={qty} />
            </div>

            <Separator />

            {/* Quantity + Actions */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium whitespace-nowrap">จำนวน:</span>
                <div className="flex items-center border border-border rounded-md bg-background">
                  <button className="px-2.5 py-1.5 hover:bg-muted transition-colors" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="w-3.5 h-3.5" /></button>
                  <Input type="number" min={1} value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-14 h-8 text-center border-0 focus-visible:ring-0 text-sm" />
                  <button className="px-2.5 py-1.5 hover:bg-muted transition-colors" onClick={() => setQty(qty + 1)}><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <span className="text-sm">
                  = <span className="text-lg font-bold text-primary">฿{fmt(totalPrice)}</span>
                </span>
              </div>
              <div className="flex gap-2">
                <AddToCartButton productModel={displayVariant.model} productName={displayVariant.name} estimatedPrice={displayPrice} size="default" className="flex-1" />
                <a href="#rfq-form" className="flex-1">
                  <Button variant="default" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    <FileText className="w-4 h-4 mr-1.5" /> ขอใบเสนอราคา
                  </Button>
                </a>
              </div>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-1">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> รับประกัน 1-3 ปี</span>
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-primary" /> จัดส่งทั่วไทย</span>
              <span className="flex items-center gap-1"><ReceiptText className="w-3.5 h-3.5 text-primary" /> ใบกำกับภาษี</span>
              <span className="flex items-center gap-1"><Headphones className="w-3.5 h-3.5 text-primary" /> ซัพพอร์ตภาษาไทย</span>
            </div>
          </div>

          {/* RIGHT: Supplier + RFQ Sidebar — sticky */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-20 space-y-4">
              <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold">ENT Group Co., Ltd.</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9px]">Verified</Badge>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ตอบใน 4 ชม.</span>
                  <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> 3-5 วันทำการ</span>
                  <span className="flex items-center gap-1"><Package className="w-3 h-3" /> MOQ: 1 ชิ้น</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> ISO 9001</span>
                </div>
                <Separator />
                <div className="flex gap-1.5">
                  <a href="tel:021234567" className="flex-1 flex items-center justify-center gap-1 text-[10px] py-1.5 rounded border border-border hover:bg-muted/50 transition-colors">
                    <Phone className="w-3 h-3 text-primary" /> โทร
                  </a>
                  <a href="https://line.me/ti/p/@entgroup" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1 text-[10px] py-1.5 rounded border border-border hover:bg-muted/50 transition-colors">
                    <MessageCircle className="w-3 h-3 text-green-500" /> LINE
                  </a>
                </div>
              </div>

              <a href="#rfq-form">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" size="sm">
                  <FileText className="w-4 h-4 mr-1.5" /> ขอใบเสนอราคา B2B
                </Button>
              </a>

              {/* Use cases mini */}
              <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">เหมาะสำหรับ</p>
                <div className="flex flex-wrap gap-1.5">
                  {USE_CASES.slice(0, 4).map((uc, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-muted/60 rounded-full px-2 py-0.5 text-foreground">
                      <uc.icon className="w-3 h-3 text-primary" /> {uc.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ CONFIGURATOR — FULL WIDTH, ALWAYS VISIBLE ═══════════ */}
      <div className="border-t border-border bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Configurator */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Microchip className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">ปรับแต่งสเปกตามต้องการ</h2>
                  <p className="text-xs text-muted-foreground">เลือก CPU, RAM, Storage, อุปกรณ์เสริมก่อนขอใบเสนอราคา</p>
                </div>
              </div>
              <ShopProductConfigurator
                product={product}
                quantity={qty}
                onConfigChange={({ matchedVariant, finalPrice, addons }) => {
                  setConfiguredVariant(matchedVariant as Product);
                  setConfigPrice(finalPrice);
                  setConfigAddons(addons);
                }}
              />
            </div>

            {/* Right: Specs + Description stacked */}
            <div className="space-y-6">
              {/* Technical Specs */}
              <div>
                <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <CircuitBoard className="w-4 h-4 text-primary" /> สเปกเทคนิค
                </h2>
                <div className="rounded-lg border border-border overflow-hidden bg-card">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { label: 'Model', value: product.model },
                        { label: 'SKU', value: displayVariant.sku },
                        { label: 'Series', value: product.series },
                        { label: 'CPU', value: displayVariant.cpu },
                        { label: 'RAM', value: displayVariant.ram_gb ? `${displayVariant.ram_gb}GB DDR4` : null },
                        { label: 'Storage', value: displayVariant.storage_gb ? `${displayVariant.storage_gb}GB ${displayVariant.storage_type || ''}`.trim() : null },
                        { label: 'WiFi', value: displayVariant.has_wifi ? '✅ Built-in' : '❌' },
                        { label: '4G LTE', value: displayVariant.has_4g ? '✅ Built-in' : '❌' },
                        { label: 'OS', value: displayVariant.os },
                        { label: 'Form Factor', value: product.form_factor },
                        { label: 'รับประกัน', value: '12 เดือน (ขยายได้ถึง 3 ปี)' },
                      ].filter(r => r.value).map((row, i) => (
                        <tr key={row.label} className={i % 2 === 0 ? 'bg-muted/20' : ''}>
                          <td className="px-4 py-2 font-medium text-muted-foreground w-2/5">{row.label}</td>
                          <td className="px-4 py-2 text-foreground">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product Description */}
              {product.description && (
                <div>
                  <h2 className="text-base font-bold text-foreground mb-3">รายละเอียดสินค้า</h2>
                  <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-sm leading-relaxed rounded-lg border border-border bg-card p-4">
                    {product.description}
                  </div>
                </div>
              )}

              {/* Warranty + After-sales */}
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> การรับประกันและบริการ
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground mb-0.5">รับประกัน 1 ปี</p>
                    <p className="text-xs">ครอบคลุมความเสียหายจากการผลิต ขยายเป็น 3 ปีได้</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-0.5">บริการหลังการขาย</p>
                    <p className="text-xs">ทีมช่างเทคนิคพร้อมดูแล มีอะไหล่สำรองและบริการซ่อมนอกสถานที่</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ USE CASES — FULL WIDTH ═══════════ */}
      <div className="bg-muted/20 border-y border-border">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-lg font-bold text-foreground mb-1">สินค้านี้เหมาะกับงาน</h2>
          <p className="text-xs text-muted-foreground mb-5">{product.model} ถูกออกแบบมาเพื่อการใช้งานระดับอุตสาหกรรมที่ต้องการความเสถียร</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {USE_CASES.map((uc, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-3 text-center space-y-1.5 hover:shadow-md hover:border-primary/30 transition-all">
                <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                  <uc.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground">{uc.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ B2B PLATFORM FEATURES ═══════════ */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-amber-500/5">
        <div className="container max-w-7xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-foreground">ทำไมองค์กรถึงเลือก ENT Group</h2>
            <p className="text-sm text-muted-foreground mt-1">แพลตฟอร์มจัดซื้อ B2B ครบวงจร — ตั้งแต่สั่งซื้อจนถึงหลังการขาย</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FileText, title: 'สร้างใบเสนอราคาออนไลน์', desc: 'ขอใบเสนอราคาผ่านเว็บ ได้รับภายใน 4 ชม. พร้อมเปรียบเทียบราคา', color: 'text-primary' },
              { icon: MessageCircle, title: 'ต่อรองราคาแบบโปร่งใส', desc: 'ระบบต่อรองราคาอัตโนมัติ มี Revision History ทุกรอบ', color: 'text-emerald-600 dark:text-emerald-400' },
              { icon: Truck, title: 'จัดส่งทั่วไทย ติดตามได้', desc: 'จัดส่งฟรี* พร้อมระบบแจ้งเตือนอัตโนมัติ', color: 'text-amber-600 dark:text-amber-400' },
              { icon: ShieldCheck, title: 'รับประกัน 1-3 ปี + ซ่อมด่วน', desc: 'ศูนย์บริการในไทย อะไหล่พร้อม ซ่อมนอกสถานที่', color: 'text-rose-600 dark:text-rose-400' },
            ].map((feat, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${feat.color}`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ HOW TO ORDER — STEP BANNER ═══════════ */}
      <div className="bg-muted/20 border-y border-border">
        <div className="container max-w-7xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-foreground">ขั้นตอนง่ายๆ ในการขอใบเสนอราคา</h2>
            <p className="text-sm text-muted-foreground mt-1">เลือกสินค้า → หยิบใส่ตะกร้า → กดขอใบเสนอราคา — ระบบจะจัดเตรียมเอกสารให้ภายใน 4 ชม.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                icon: Package,
                title: 'เลือกสินค้า & ปรับสเปก',
                desc: 'เลือก CPU, RAM, SSD, OS ที่ต้องการ ระบบจะคำนวณราคาอัตโนมัติ',
                color: 'bg-primary/10 text-primary',
              },
              {
                step: '02',
                icon: ShoppingCart,
                title: 'หยิบใส่ตะกร้า',
                desc: 'เพิ่มสินค้าหลายรายการในตะกร้า เลือกจำนวน ได้ราคาส่ง',
                color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
              },
              {
                step: '03',
                icon: FileText,
                title: 'ส่งคำขอใบเสนอราคา',
                desc: 'กดปุ่ม "ขอใบเสนอราคา" ในตะกร้า ทีมขายจะจัดเตรียมเอกสาร',
                color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              },
              {
                step: '04',
                icon: CheckCircle2,
                title: 'รับใบเสนอราคา & ต่อรอง',
                desc: 'รับเอกสารผ่านอีเมลและระบบ ต่อรองราคาได้ ส่ง PO เมื่อพร้อม',
                color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
              },
            ].map((s, i) => (
              <div key={i} className="relative rounded-xl border border-border bg-card p-5 space-y-3 hover:shadow-md transition-shadow group">
                {/* Step number */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-muted-foreground/20 group-hover:text-primary/20 transition-colors">{s.step}</span>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                {/* Connector arrow — except last */}
                {i < 3 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6 gap-3">
            <Link to="/shop">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Package className="w-4 h-4" /> ดูสินค้าทั้งหมด
              </Button>
            </Link>
            <Link to="/cart">
              <Button size="sm" className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white">
                <ShoppingCart className="w-4 h-4" /> ไปที่ตะกร้า
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <div className="container max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground">ลูกค้าองค์กรที่ไว้วางใจ</h2>
          <p className="text-sm text-muted-foreground mt-1">กว่า 500 องค์กรเลือกใช้โซลูชัน Industrial PC จาก ENT Group</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: 'คุณสมชาย ว.', company: 'บจก. เอ็นจิเนียริ่ง โซลูชัน', quote: 'สั่งซื้อ GT Series ไป 50 เครื่อง ทีมงาน ENT ดูแลตั้งแต่ให้คำปรึกษาจนถึงติดตั้ง ตอบเร็วมากครับ ใบเสนอราคามาภายในชั่วโมง', rating: 5 },
            { name: 'คุณวิภา ศ.', company: 'หน่วยงานราชการ', quote: 'ใช้ Rugged Tablet ในภาคสนาม ทนทาน IP65 ใช้งานจริงในสภาพอากาศร้อนชื้น รับประกัน 3 ปี อุ่นใจมาก', rating: 5 },
            { name: 'คุณพิทักษ์ จ.', company: 'โรงงานอุตสาหกรรมอาหาร', quote: 'GB4000 ใช้ในไลน์ผลิต 24/7 ไม่มีพัดลม ทำงานเสถียรมาก ราคาขายส่งจาก ENT คุ้มค่ากว่าที่อื่น', rating: 5 },
          ].map((review, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3 hover:shadow-sm transition-shadow">
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <span key={j} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed italic">"{review.quote}"</p>
              <div className="pt-1 border-t border-border">
                <p className="text-xs font-semibold text-foreground">{review.name}</p>
                <p className="text-[11px] text-muted-foreground">{review.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ RFQ FORM ═══════════ */}
      <div id="rfq-form" className="bg-muted/10 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <QuickRFQForm
              product={configuredVariant || product}
              defaultQuantity={qty}
              configAddons={configAddons}
              finalUnitPrice={configPrice}
            />
          </div>
        </div>
      </div>

      {/* ═══════════ STATS STRIP ═══════════ */}
      <div className="bg-muted/30 border-y border-border">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: '15+', label: 'ปีประสบการณ์' },
              { value: '500+', label: 'ลูกค้าองค์กร' },
              { value: '4 ชม.', label: 'ตอบกลับเฉลี่ย' },
              { value: '99.5%', label: 'ความพึงพอใจ' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ RELATED ═══════════ */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <RelatedProducts currentProductId={product.id} series={product.series} category={product.category} />
      </div>

      {/* Mobile sticky CTA */}
      {showSticky && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border px-4 py-2.5 z-40 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground">{product.model}</p>
              <p className="text-base font-bold text-primary">฿{fmt(displayPrice)}</p>
            </div>
            <AddToCartButton productModel={displayVariant.model} productName={displayVariant.name} estimatedPrice={displayPrice} size="sm" />
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
              <a href="#rfq-form"><FileText className="w-3.5 h-3.5 mr-1" /> RFQ</a>
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ShopProductDetail;

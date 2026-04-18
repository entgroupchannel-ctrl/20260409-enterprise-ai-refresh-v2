import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, ShoppingBag, Lock, LogIn, UserPlus, Check, Package } from 'lucide-react';
import { getRelatedCatalogProducts, searchCatalogProducts, type CatalogProduct } from '@/lib/product-catalog';
import { savePendingQuote, getPendingQuote, clearPendingQuote, type PendingQuoteData } from '@/hooks/usePendingQuote';
import { getAttributionFields, createAffiliateLead } from '@/lib/affiliate-attribution';
import ContactFormPanel from './quote-dialog/ContactFormPanel';
import ProductSearchPanel from './quote-dialog/ProductSearchPanel';
import SelectedProductsPanel from './quote-dialog/SelectedProductsPanel';

interface QuoteProduct {
  model: string;
  description: string;
  qty: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  specs?: string;
}

interface QuoteRequestButtonProps {
  productModel?: string;
  productName?: string;
  productImage?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export default function QuoteRequestButton({
  productModel, productName, productImage,
  variant = 'default', size = 'default', fullWidth = false, className = '', iconOnly = false,
}: QuoteRequestButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [phase, setPhase] = useState<'product-selection' | 'full-form'>('product-selection');
  const [showDialog, setShowDialog] = useState(false);
  const [showAuthGuard, setShowAuthGuard] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '', customer_email: user?.email || '',
    customer_phone: '', customer_company: '', notes: '',
  });
  const [products, setProducts] = useState<QuoteProduct[]>([]);

  const relatedProducts = useMemo(() => {
    if (!productModel) return [];
    return getRelatedCatalogProducts(productModel, 6);
  }, [productModel]);

  useEffect(() => {
    if (phase === 'full-form' && user) loadUserProfile();
  }, [phase, user]);

  useEffect(() => {
    if (user && showAuthGuard) {
      setShowAuthGuard(false);
      setPhase('full-form');
      setShowDialog(true);
    }
  }, [user, showAuthGuard]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (user && params.get('action') === 'continue') {
      const pending = getPendingQuote();
      if (pending && pending.products.length > 0) {
        setProducts(pending.products);
        clearPendingQuote();
        setPhase('full-form');
        setShowDialog(true);
        toast({
          title: 'ยินดีต้อนรับ!',
          description: `คุณมี ${pending.products.length} รายการรอดำเนินการ — เพิ่มสินค้าหรือส่งคำขอได้เลย`,
        });
        window.history.replaceState({}, '', location.pathname);
      }
    }
  }, [user, location.search]);

  const loadUserProfile = async () => {
    if (!user) return;
    setLoadingProfile(true);
    try {
      const { data: userData } = await supabase.from('users').select('full_name, phone, company, email').eq('id', user.id).maybeSingle();
      const { data: profileData } = await supabase.from('user_profiles').select('contact_name, contact_phone, company_name, contact_email').eq('user_id', user.id).maybeSingle();
      setFormData((prev) => ({
        ...prev,
        customer_name: prev.customer_name || profileData?.contact_name || userData?.full_name || '',
        customer_email: prev.customer_email || profileData?.contact_email || userData?.email || user.email || '',
        customer_phone: prev.customer_phone || profileData?.contact_phone || userData?.phone || '',
        customer_company: prev.customer_company || profileData?.company_name || userData?.company || '',
      }));
    } catch (error) { console.error('Error loading profile:', error); }
    finally { setLoadingProfile(false); }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /** Build a QuoteProduct from a CatalogProduct */
  const catalogToQuoteProduct = useCallback((product: CatalogProduct, qty = 1): QuoteProduct => {
    const priceNum = product.price ? parseFloat(product.price.replace(/[^\d.]/g, '')) || 0 : 0;
    return {
      model: product.model, description: product.name,
      qty, unit_price: priceNum, discount_percent: 0, line_total: priceNum * qty,
      specs: '',
    };
  }, []);

  /** Auto-add the clicked product and open dialog */
  const handleQuickRequest = () => {
    if (productModel) {
      setFormData((prev) => ({ ...prev, customer_email: user?.email || prev.customer_email }));

      // Find product in catalog or build from props
      const catalogProducts = searchCatalogProducts(productModel, 1);
      const catalogMatch = catalogProducts.find((p) => p.model === productModel);

      const primaryProduct: QuoteProduct = catalogMatch
        ? catalogToQuoteProduct(catalogMatch)
        : {
            model: productModel,
            description: productName || productModel,
            qty: 1, unit_price: 0, discount_percent: 0, line_total: 0, specs: '',
          };

      // Set products with primary product pre-added
      setProducts([primaryProduct]);

      if (user) {
        setPhase('full-form');
        setShowDialog(true);
      } else {
        // Guest: show auth guard directly with product preview
        setShowDialog(false);
        setShowAuthGuard(true);
      }
    } else {
      navigate('/request-quote');
    }
  };

  const handleAddProduct = (product: CatalogProduct) => {
    if (products.find((p) => p.model === product.model)) {
      toast({ title: 'เพิ่มแล้ว', description: `${product.model} อยู่ในรายการแล้ว` });
      return;
    }

    const newProduct = catalogToQuoteProduct(product);

    if (phase === 'product-selection' && !user) {
      setProducts((prev) => [...prev, newProduct]);
      setShowDialog(false);
      setShowAuthGuard(true);
      return;
    }

    if (phase === 'product-selection' && user) {
      setProducts((prev) => [...prev, newProduct]);
      setPhase('full-form');
      return;
    }

    setProducts((prev) => [...prev, newProduct]);
    toast({ title: 'เพิ่มสินค้าแล้ว', description: product.model });
  };

  const handleRemoveProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQty = (index: number, qty: number) => {
    setProducts((prev) => prev.map((p, i) => i === index ? { ...p, qty: Math.max(1, qty), line_total: p.unit_price * Math.max(1, qty) } : p));
  };

  const handleUpdateSpecs = (index: number, specs: string) => {
    setProducts((prev) => prev.map((p, i) => i === index ? { ...p, specs } : p));
  };

  const buildQuoteData = (): PendingQuoteData => ({
    customer_name: formData.customer_name,
    customer_email: formData.customer_email,
    customer_phone: formData.customer_phone || null,
    customer_company: formData.customer_company || null,
    notes: formData.notes || null,
    products,
  });

  const handleSubmit = async () => {
    if (!formData.customer_name || !formData.customer_email) {
      toast({ title: 'กรุณากรอกข้อมูลให้ครบ', description: 'ชื่อและอีเมลเป็นข้อมูลที่จำเป็น', variant: 'destructive' });
      return;
    }
    if (products.length === 0) {
      toast({ title: 'กรุณาเลือกสินค้า', description: 'ต้องมีสินค้าอย่างน้อย 1 รายการ', variant: 'destructive' });
      return;
    }
    await submitQuote();
  };

  const submitQuote = async (quoteData?: PendingQuoteData) => {
    const dataToSubmit = quoteData || buildQuoteData();
    setSubmitting(true);
    try {
      // Build notes with per-product specs
      const specNotes = dataToSubmit.products
        .filter((p: any) => p.specs)
        .map((p: any) => `[${p.model}] ${p.specs}`)
        .join('\n');
      const combinedNotes = [dataToSubmit.notes, specNotes].filter(Boolean).join('\n---\n');

      const { data, error } = await (supabase.from as any)('quote_requests')
        .insert({
          quote_number: '',
          customer_name: dataToSubmit.customer_name,
          customer_email: dataToSubmit.customer_email,
          customer_phone: dataToSubmit.customer_phone,
          customer_company: dataToSubmit.customer_company,
          notes: combinedNotes || null,
          products: dataToSubmit.products,
          status: 'pending',
          subtotal: 0, vat_amount: 0, grand_total: 0,
          ...getAttributionFields(),
        }).select().single();
      if (error) throw error;
      await createAffiliateLead({
        source_type: 'quote_request',
        source_id: data.id,
        customer_name: dataToSubmit.customer_name,
        customer_email: dataToSubmit.customer_email,
        customer_company: dataToSubmit.customer_company || null,
      });
      toast({
        title: 'ส่งคำขอสำเร็จ',
        description: `เลขที่ ${data.quote_number} — ${dataToSubmit.products.length} รายการ — เราจะติดต่อกลับภายใน 24 ชม.`,
      });
      setShowDialog(false);
      setShowAuthGuard(false);
      setProducts([]);
      setPhase('product-selection');
      setFormData({ customer_name: '', customer_email: user?.email || '', customer_phone: '', customer_company: '', notes: '' });
      if (user) setTimeout(() => navigate('/my-quotes'), 1500);
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  const handleAuthRedirect = (path: '/login' | '/register') => {
    const quoteData = buildQuoteData();
    savePendingQuote(quoteData);
    setShowAuthGuard(false);
    // Use current page + action=continue so the button can restore products after login
    const returnUrl = `${location.pathname}${location.search ? location.search + '&' : '?'}action=continue`;
    navigate(`${path}?redirect=${encodeURIComponent(returnUrl)}`);
  };

  const selectedModels = products.map((p) => p.model);
  const canSubmit = !!formData.customer_name && !!formData.customer_email && products.length > 0;

  return (
    <>
      <Button variant={variant} size={iconOnly ? 'icon' : size} className={`${fullWidth ? 'w-full' : ''} ${className}`} onClick={handleQuickRequest} title="ขอใบเสนอราคา">
        <FileText className={iconOnly ? "w-4 h-4" : "w-4 h-4 mr-2"} />
        {!iconOnly && 'ขอใบเสนอราคา'}
      </Button>

      {/* Main Quote Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) setPhase('product-selection');
      }}>
        {phase === 'product-selection' ? (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                ขอใบเสนอราคา
              </DialogTitle>
              <DialogDescription>เริ่มต้นด้วยการเลือกสินค้าที่คุณสนใจ</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              <ProductSearchPanel
                selectedModels={selectedModels}
                relatedProducts={relatedProducts}
                onAddProduct={handleAddProduct}
                compact
              />
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                ขอใบเสนอราคา
                {productModel && (
                  <span className="text-xs font-normal text-muted-foreground ml-2">— {productModel}</span>
                )}
              </DialogTitle>
              <DialogDescription>กรอกข้อมูล กำหนดจำนวน/สเปก และเพิ่มสินค้าอื่นได้ตามต้องการ</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[65vh]">
                <div className="md:col-span-3">
                  <ContactFormPanel formData={formData} onChange={handleFormChange} loading={loadingProfile} emailDisabled={!!user} />
                </div>
                <div className="md:col-span-5">
                  <ProductSearchPanel selectedModels={selectedModels} relatedProducts={relatedProducts} onAddProduct={handleAddProduct} />
                </div>
                <div className="md:col-span-4">
                  <SelectedProductsPanel
                    products={products}
                    onUpdateQty={handleUpdateQty}
                    onUpdateSpecs={handleUpdateSpecs}
                    onRemove={handleRemoveProduct}
                    onClearAll={() => setProducts([])}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    canSubmit={canSubmit}
                    primaryModel={productModel}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-between items-center pt-4 border-t border-border md:hidden">
              <button type="button" className="text-sm text-primary hover:underline font-medium" onClick={() => { setShowDialog(false); navigate('/request-quote'); }}>
                กรอกฟอร์มแบบเต็ม
              </button>
              <Button onClick={handleSubmit} disabled={submitting || !canSubmit} size="sm">
                {submitting ? 'กำลังส่ง...' : `ส่งคำขอ (${products.length})`}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Auth Guard Dialog */}
      <Dialog open={showAuthGuard} onOpenChange={setShowAuthGuard}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              ยืนยันตัวตนเพื่อดำเนินการต่อ
            </DialogTitle>
            <DialogDescription>
              เพื่อความสะดวกในการติดตามและจัดการคำสั่งซื้อ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium mb-3 text-primary">คุณได้เลือก:</p>
              <div className="space-y-2">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{product.model}</p>
                      <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                      {product.unit_price > 0 && (
                        <p className="text-sm font-semibold text-primary mt-0.5">
                          ฿{product.unit_price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => handleAuthRedirect('/login')} className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                เข้าสู่ระบบ
              </Button>
              <Button onClick={() => handleAuthRedirect('/register')} variant="outline" className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                สมัครสมาชิก
              </Button>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground">
                💡 หลังเข้าสู่ระบบแล้ว คุณสามารถ:
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  <span>กำหนดสเปกและจำนวนสินค้าได้</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  <span>เพิ่มสินค้าอื่นๆ ได้อีกหลายรายการ</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3 h-3 text-primary" />
                  <span>ติดตามสถานะใบเสนอราคาได้ทันที</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground w-full text-center">
              การสร้างบัญชีช่วยให้คุณติดตามสถานะใบเสนอราคา จัดการคำสั่งซื้อ และดูประวัติการสั่งซื้อได้
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

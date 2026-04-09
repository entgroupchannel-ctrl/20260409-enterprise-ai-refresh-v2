import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, ShoppingBag, Lock, LogIn, UserPlus, AlertTriangle, Info } from 'lucide-react';
import { getRelatedCatalogProducts, type CatalogProduct } from '@/lib/product-catalog';
import { savePendingQuote, type PendingQuoteData } from '@/hooks/usePendingQuote';
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
}

interface QuoteRequestButtonProps {
  productModel?: string;
  productName?: string;
  productImage?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function QuoteRequestButton({
  productModel, productName, productImage,
  variant = 'default', size = 'default', fullWidth = false, className = '',
}: QuoteRequestButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showDialog, setShowDialog] = useState(false);
  const [showAuthGuard, setShowAuthGuard] = useState(false);
  const [pendingQuote, setPendingQuote] = useState<PendingQuoteData | null>(null);
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
    if (showDialog && user) loadUserProfile();
  }, [showDialog, user]);

  useEffect(() => {
    if (showDialog && productModel && products.length === 0) {
      setProducts([{
        model: productModel, description: productName || '',
        qty: 1, unit_price: 0, discount_percent: 0, line_total: 0,
      }]);
    }
  }, [showDialog, productModel]);

  // Auto-submit pending quote when user logs in while component is mounted
  useEffect(() => {
    if (user && pendingQuote) {
      toast({ title: 'กำลังส่งคำขอใบเสนอราคา...', description: 'กรุณารอสักครู่' });
      submitQuote(pendingQuote);
    }
  }, [user, pendingQuote]);

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

  const handleQuickRequest = () => {
    if (productModel) {
      setFormData((prev) => ({ ...prev, customer_email: user?.email || prev.customer_email }));
      setProducts([]);
      setShowDialog(true);
    } else {
      navigate('/request-quote');
    }
  };

  const handleAddProduct = (product: CatalogProduct) => {
    if (products.find((p) => p.model === product.model)) {
      toast({ title: 'เพิ่มแล้ว', description: `${product.model} อยู่ในรายการแล้ว` });
      return;
    }
    setProducts((prev) => [...prev, {
      model: product.model, description: product.name,
      qty: 1, unit_price: 0, discount_percent: 0, line_total: 0,
    }]);
    toast({ title: 'เพิ่มสินค้าแล้ว', description: product.model });
  };

  const handleRemoveProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQty = (index: number, qty: number) => {
    setProducts((prev) => prev.map((p, i) => i === index ? { ...p, qty: Math.max(1, qty) } : p));
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

    // Auth Guard: if not logged in, prompt login/register
    if (!user) {
      const quoteData = buildQuoteData();
      setPendingQuote(quoteData);
      setShowDialog(false);
      setShowAuthGuard(true);
      return;
    }

    await submitQuote();
  };

  const submitQuote = async (quoteData?: PendingQuoteData) => {
    const dataToSubmit = quoteData || buildQuoteData();
    setSubmitting(true);
    try {
      const { data, error } = await (supabase.from as any)('quote_requests')
        .insert({
          quote_number: '',
          customer_name: dataToSubmit.customer_name,
          customer_email: dataToSubmit.customer_email,
          customer_phone: dataToSubmit.customer_phone,
          customer_company: dataToSubmit.customer_company,
          notes: dataToSubmit.notes,
          products: dataToSubmit.products,
          status: 'pending',
          subtotal: 0, vat_amount: 0, grand_total: 0,
        }).select().single();
      if (error) throw error;
      toast({
        title: 'ส่งคำขอสำเร็จ',
        description: `เลขที่ ${data.quote_number} — ${dataToSubmit.products.length} รายการ — เราจะติดต่อกลับภายใน 24 ชม.`,
      });
      setShowDialog(false);
      setShowAuthGuard(false);
      setProducts([]);
      setPendingQuote(null);
      setFormData({ customer_name: '', customer_email: user?.email || '', customer_phone: '', customer_company: '', notes: '' });
      if (user) setTimeout(() => navigate('/my-quotes'), 1500);
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  const handleAuthRedirect = (path: '/login' | '/register') => {
    if (pendingQuote) {
      savePendingQuote(pendingQuote);
    }
    setShowAuthGuard(false);
    navigate(`${path}?redirect=/my-quotes`);
  };

  const handleSubmitAnonymous = async () => {
    setShowAuthGuard(false);
    await submitQuote(pendingQuote || undefined);
  };

  const selectedModels = products.map((p) => p.model);
  const canSubmit = !!formData.customer_name && !!formData.customer_email && products.length > 0;

  return (
    <>
      <Button variant={variant} size={size} className={`${fullWidth ? 'w-full' : ''} ${className}`} onClick={handleQuickRequest}>
        <FileText className="w-4 h-4 mr-2" />
        ขอใบเสนอราคา
      </Button>

      {/* Main Quote Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              ขอใบเสนอราคา
            </DialogTitle>
            <DialogDescription>ค้นหาและเลือกสินค้า กรอกข้อมูล แล้วส่งคำขอ</DialogDescription>
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
                <SelectedProductsPanel products={products} onUpdateQty={handleUpdateQty} onRemove={handleRemoveProduct} onClearAll={() => setProducts([])} onSubmit={handleSubmit} submitting={submitting} canSubmit={canSubmit} />
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
      </Dialog>

      {/* Auth Guard Dialog */}
      <Dialog open={showAuthGuard} onOpenChange={setShowAuthGuard}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              กรุณาเข้าสู่ระบบก่อนส่งคำขอ
            </DialogTitle>
            <DialogDescription>
              เพื่อติดตามสถานะใบเสนอราคาและจัดการคำสั่งซื้อของคุณ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Summary */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium">ข้อมูลที่จะส่ง:</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>📧 อีเมล: {pendingQuote?.customer_email}</p>
                <p>👤 ชื่อ: {pendingQuote?.customer_name}</p>
                <p>📦 สินค้า: {pendingQuote?.products?.length || 0} รายการ</p>
                {pendingQuote?.customer_company && <p>🏢 บริษัท: {pendingQuote.customer_company}</p>}
              </div>
            </div>

            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  ข้อมูลจะถูกบันทึกไว้ และส่งอัตโนมัติหลังจากที่คุณเข้าสู่ระบบหรือสมัครสมาชิก
                </p>
              </div>
            </div>

            {/* Actions */}
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">หรือ</span>
              </div>
            </div>

            <Button onClick={handleSubmitAnonymous} variant="ghost" className="w-full text-muted-foreground" disabled={submitting}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              ส่งแบบไม่ login (ไม่แนะนำ - ไม่สามารถติดตามสถานะได้)
            </Button>
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

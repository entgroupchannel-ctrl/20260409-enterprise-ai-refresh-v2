import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Send, Loader2, Package, Plus, Minus, X, Check, ShoppingBag } from 'lucide-react';
import { getRelatedCatalogProducts, type CatalogProduct } from '@/lib/product-catalog';

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
  productModel,
  productName,
  productImage,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  className = '',
}: QuoteRequestButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: user?.email || '',
    customer_phone: '',
    customer_company: '',
    notes: '',
  });

  const [products, setProducts] = useState<QuoteProduct[]>([]);

  // Related products for upselling
  const relatedProducts = useMemo(() => {
    if (!productModel) return [];
    return getRelatedCatalogProducts(productModel, 3);
  }, [productModel]);

  // Auto-fill from user profile when dialog opens
  useEffect(() => {
    if (showDialog && user) {
      loadUserProfile();
    }
  }, [showDialog, user]);

  // Initialize products when dialog opens
  useEffect(() => {
    if (showDialog && productModel && products.length === 0) {
      setProducts([{
        model: productModel,
        description: productName || '',
        qty: 1,
        unit_price: 0,
        discount_percent: 0,
        line_total: 0,
      }]);
    }
  }, [showDialog, productModel]);

  const loadUserProfile = async () => {
    if (!user) return;
    setLoadingProfile(true);
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, phone, company, email')
        .eq('id', user.id)
        .maybeSingle();

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('contact_name, contact_phone, company_name, contact_email')
        .eq('user_id', user.id)
        .maybeSingle();

      setFormData((prev) => ({
        ...prev,
        customer_name: prev.customer_name || profileData?.contact_name || userData?.full_name || '',
        customer_email: prev.customer_email || profileData?.contact_email || userData?.email || user.email || '',
        customer_phone: prev.customer_phone || profileData?.contact_phone || userData?.phone || '',
        customer_company: prev.customer_company || profileData?.company_name || userData?.company || '',
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickRequest = () => {
    if (productModel) {
      setFormData((prev) => ({ ...prev, customer_email: user?.email || prev.customer_email }));
      setProducts([]);  // Reset so useEffect reinitializes
      setShowDialog(true);
    } else {
      navigate('/request-quote');
    }
  };

  /* ── Product list management ── */
  const handleAddRelatedProduct = (product: CatalogProduct) => {
    const exists = products.find((p) => p.model === product.model);
    if (exists) {
      toast({ title: 'เพิ่มแล้ว', description: `${product.model} อยู่ในรายการแล้ว` });
      return;
    }
    setProducts((prev) => [...prev, {
      model: product.model,
      description: product.name,
      qty: 1,
      unit_price: 0,
      discount_percent: 0,
      line_total: 0,
    }]);
    toast({ title: 'เพิ่มสินค้าแล้ว', description: `${product.model}` });
  };

  const handleRemoveProduct = (index: number) => {
    if (products.length <= 1) {
      toast({ title: 'ไม่สามารถลบได้', description: 'ต้องมีสินค้าอย่างน้อย 1 รายการ', variant: 'destructive' });
      return;
    }
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQty = (index: number, qty: number) => {
    setProducts((prev) => prev.map((p, i) => i === index ? { ...p, qty: Math.max(1, qty) } : p));
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!formData.customer_name || !formData.customer_email) {
      toast({ title: 'กรุณากรอกข้อมูลให้ครบ', description: 'ชื่อและอีเมลเป็นข้อมูลที่จำเป็น', variant: 'destructive' });
      return;
    }
    if (products.length === 0) {
      toast({ title: 'กรุณาเลือกสินค้า', description: 'ต้องมีสินค้าอย่างน้อย 1 รายการ', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await (supabase.from as any)('quote_requests')
        .insert({
          quote_number: '',
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone || null,
          customer_company: formData.customer_company || null,
          notes: formData.notes || null,
          products: products,
          status: 'pending',
          subtotal: 0,
          vat_amount: 0,
          grand_total: 0,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'ส่งคำขอสำเร็จ',
        description: `เลขที่ ${data.quote_number} — ${products.length} รายการ — เราจะติดต่อกลับภายใน 24 ชม.`,
      });

      setShowDialog(false);
      setProducts([]);
      setFormData({
        customer_name: '',
        customer_email: user?.email || '',
        customer_phone: '',
        customer_company: '',
        notes: '',
      });

      if (user) {
        setTimeout(() => navigate('/my-quotes'), 1500);
      }
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${fullWidth ? 'w-full' : ''} ${className}`}
        onClick={handleQuickRequest}
      >
        <FileText className="w-4 h-4 mr-2" />
        ขอใบเสนอราคา
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>ขอใบเสนอราคา</DialogTitle>
            <DialogDescription>กรอกข้อมูลและเลือกสินค้าที่ต้องการ</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* Customer Info */}
            {loadingProfile ? (
              <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">กำลังโหลดข้อมูล...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-foreground">ข้อมูลติดต่อ</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label>ชื่อ-นามสกุล <span className="text-destructive">*</span></Label>
                    <Input value={formData.customer_name} onChange={(e) => handleFormChange('customer_name', e.target.value)} placeholder="สมชาย ใจดี" required />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>อีเมล <span className="text-destructive">*</span></Label>
                    <Input type="email" value={formData.customer_email} onChange={(e) => handleFormChange('customer_email', e.target.value)} placeholder="example@email.com" required disabled={!!user} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>เบอร์โทร</Label>
                    <Input value={formData.customer_phone} onChange={(e) => handleFormChange('customer_phone', e.target.value)} placeholder="081-234-5678" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>บริษัท</Label>
                    <Input value={formData.customer_company} onChange={(e) => handleFormChange('customer_company', e.target.value)} placeholder="บริษัท ABC จำกัด" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>หมายเหตุ</Label>
                    <Textarea value={formData.notes} onChange={(e) => handleFormChange('notes', e.target.value)} placeholder="ระบุความต้องการเพิ่มเติม..." rows={2} />
                  </div>
                </div>
              </div>
            )}

            {/* Selected Products */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">สินค้าที่เลือก ({products.length})</h3>
              </div>

              <div className="space-y-2">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{product.model}</p>
                      {product.description && (
                        <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-1">
                      <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQty(index, product.qty - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input type="number" min="1" value={product.qty} onChange={(e) => handleUpdateQty(index, parseInt(e.target.value) || 1)} className="w-14 h-7 text-center text-sm" />
                      <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQty(index, product.qty + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {products.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveProduct(index)}>
                        <X className="w-3 h-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Products - Upselling */}
            {relatedProducts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">สินค้าที่เกี่ยวข้อง</h3>
                </div>

                <div className="space-y-2">
                  {relatedProducts.map((rp) => {
                    const isAdded = products.some((p) => p.model === rp.model);
                    return (
                      <div key={rp.model} className="flex items-center gap-3 p-2.5 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        {rp.image ? (
                          <img src={rp.image} alt={rp.model} className="w-10 h-10 object-contain rounded border border-border bg-background" />
                        ) : (
                          <div className="w-10 h-10 rounded border border-border bg-background flex items-center justify-center">
                            <Package className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{rp.model}</p>
                          <p className="text-xs text-muted-foreground truncate">{rp.name}</p>
                          {rp.price && (
                            <p className="text-xs text-primary font-semibold">{rp.price}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant={isAdded ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => !isAdded && handleAddRelatedProduct(rp)}
                          disabled={isAdded}
                          className="shrink-0"
                        >
                          {isAdded ? (
                            <><Check className="w-3 h-3 mr-1" /> เพิ่มแล้ว</>
                          ) : (
                            <><Plus className="w-3 h-3 mr-1" /> เพิ่ม</>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-between items-center pt-4 border-t border-border">
            <button
              type="button"
              className="text-sm text-primary hover:underline font-medium"
              onClick={() => { setShowDialog(false); navigate('/request-quote'); }}
            >
              กรอกฟอร์มแบบเต็ม
            </button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} disabled={submitting}>
                ยกเลิก
              </Button>
              <Button onClick={handleSubmit} disabled={submitting || products.length === 0}>
                <Send className="w-4 h-4 mr-2" />
                {submitting ? 'กำลังส่ง...' : `ส่งคำขอ (${products.length} รายการ)`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// src/pages/customer/QuoteRequestForm.tsx
// Auto-fills from user profile when logged in, compact layout

import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Trash2, Send, ArrowLeft, CheckCircle2, Building, User, Package } from 'lucide-react';
import { getPendingQuote, clearPendingQuote } from '@/hooks/usePendingQuote';

interface ProductItem {
  model: string;
  description: string;
  qty: number;
}

const CompactField = memo(({ label, value, onChange, type = 'text', placeholder = '', required = false, disabled = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean; disabled?: boolean;
}) => (
  <div className="space-y-1">
    <Label className="text-[11px] text-muted-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
    <Input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled} className="h-8 text-sm" />
  </div>
));
CompactField.displayName = 'CompactField';

export default function QuoteRequestForm() {
  const { user, profile: authProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const submitGuard = useRef(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_company: '',
    customer_address: '',
    customer_tax_id: '',
    customer_line: '',
    notes: '',
  });

  const [products, setProducts] = useState<ProductItem[]>([
    { model: '', description: '', qty: 1 },
  ]);

  // Auto-fill from user_profiles when logged in
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: profile } = await (supabase.from as any)('user_profiles')
        .select('*').eq('user_id', user.id).maybeSingle();

      if (profile) {
        setFormData({
          customer_name: profile.contact_name || authProfile?.full_name || '',
          customer_email: profile.contact_email || user.email || '',
          customer_phone: profile.contact_phone || '',
          customer_company: profile.company_name || '',
          customer_address: profile.billing_address || '',
          customer_tax_id: profile.company_tax_id || '',
          customer_line: profile.contact_line || '',
          notes: '',
        });
        setProfileLoaded(true);
      } else {
        setFormData(prev => ({
          ...prev,
          customer_name: authProfile?.full_name || '',
          customer_email: user.email || '',
          customer_phone: authProfile?.phone || '',
          customer_company: authProfile?.company || '',
        }));
      }
    })();
  }, [user, authProfile]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (index: number, field: keyof ProductItem, value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const addProduct = () => setProducts([...products, { model: '', description: '', qty: 1 }]);

  const removeProduct = (index: number) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitGuard.current || submitting) return;
    if (!formData.customer_name || !formData.customer_email) {
      toast({ title: 'กรุณากรอกชื่อและอีเมล', variant: 'destructive' });
      return;
    }
    const validProducts = products.filter(p => p.model.trim());
    if (validProducts.length === 0) {
      toast({ title: 'กรุณาระบุสินค้าอย่างน้อย 1 รายการ', variant: 'destructive' });
      return;
    }

    submitGuard.current = true;
    setSubmitting(true);
    try {
      const insertPayload = {
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone || null,
          customer_company: formData.customer_company || null,
          customer_address: formData.customer_address || null,
          customer_tax_id: formData.customer_tax_id || null,
          customer_line: formData.customer_line || null,
          notes: formData.notes || null,
          products: validProducts.map(p => ({
            model: p.model, description: p.description, qty: p.qty,
            unit_price: 0, discount_percent: 0, line_total: 0,
          })),
          status: 'pending',
          subtotal: 0,
          vat_amount: 0,
          grand_total: 0,
          created_by: user?.id || null,
        };
      const { data, error } = await (supabase.from('quote_requests') as any)
        .insert([insertPayload])
        .select().single();

      if (error) throw error;
      toast({ title: 'ส่งคำขอสำเร็จ', description: `เลขที่ ${data.quote_number}` });
      navigate(user ? '/my-quotes' : '/');
    } catch (error: any) {
      submitGuard.current = false;
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <h1 className="text-sm font-semibold">ขอใบเสนอราคา</h1>
          <div className="w-16" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left: Customer info */}
          <div className="space-y-4">
            {/* Profile summary (logged in) */}
            {isLoggedIn && profileLoaded && (
              <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs text-primary">ดึงข้อมูลจากโปรไฟล์แล้ว</span>
              </div>
            )}

            <Card>
              <CardContent className="pt-4 pb-3 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Building className="w-3 h-3" /> ข้อมูลบริษัท
                </p>
                <CompactField label="บริษัท" value={formData.customer_company} onChange={v => handleFormChange('customer_company', v)} placeholder="บริษัท ABC จำกัด" />
                <CompactField label="เลขผู้เสียภาษี" value={formData.customer_tax_id} onChange={v => handleFormChange('customer_tax_id', v)} placeholder="0105XXXXXXXXX" />
                <CompactField label="ที่อยู่" value={formData.customer_address} onChange={v => handleFormChange('customer_address', v)} placeholder="123 ถ.สุขุมวิท..." />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 pb-3 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" /> ผู้ติดต่อ
                </p>
                <CompactField label="ชื่อ-นามสกุล" value={formData.customer_name} onChange={v => handleFormChange('customer_name', v)} placeholder="สมชาย ใจดี" required />
                <div className="grid grid-cols-2 gap-2">
                  <CompactField label="อีเมล" value={formData.customer_email} onChange={v => handleFormChange('customer_email', v)} type="email" placeholder="email@..." required />
                  <CompactField label="โทรศัพท์" value={formData.customer_phone} onChange={v => handleFormChange('customer_phone', v)} placeholder="081-XXX-XXXX" />
                </div>
                <CompactField label="LINE ID" value={formData.customer_line} onChange={v => handleFormChange('customer_line', v)} placeholder="@lineid" />
              </CardContent>
            </Card>
          </div>

          {/* Center + Right: Products + Notes + Submit */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Package className="w-3 h-3" /> รายการสินค้า
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={addProduct} className="h-7 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> เพิ่ม
                  </Button>
                </div>

                <div className="space-y-2">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] text-muted-foreground font-medium px-1">
                    <span className="col-span-1">#</span>
                    <span className="col-span-4">รุ่น/Model *</span>
                    <span className="col-span-5">รายละเอียด</span>
                    <span className="col-span-1 text-center">จำนวน</span>
                    <span className="col-span-1" />
                  </div>

                  {products.map((product, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <span className="col-span-1 text-xs text-muted-foreground text-center">{index + 1}</span>
                      <div className="col-span-4">
                        <Input
                          value={product.model}
                          onChange={e => handleProductChange(index, 'model', e.target.value)}
                          placeholder="GT-156"
                          className="h-8 text-sm"
                          required
                        />
                      </div>
                      <div className="col-span-5">
                        <Input
                          value={product.description}
                          onChange={e => handleProductChange(index, 'description', e.target.value)}
                          placeholder="รายละเอียดเพิ่มเติม..."
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          min="1"
                          value={product.qty}
                          onChange={e => handleProductChange(index, 'qty', parseInt(e.target.value) || 1)}
                          className="h-8 text-sm text-center px-1"
                          required
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        {products.length > 1 && (
                          <button type="button" onClick={() => removeProduct(index)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardContent className="pt-4 pb-3 space-y-2">
                <Label className="text-[11px] text-muted-foreground">หมายเหตุเพิ่มเติม</Label>
                <Textarea
                  value={formData.notes}
                  onChange={e => handleFormChange('notes', e.target.value)}
                  placeholder="งบประมาณ, ระยะเวลา, ความต้องการพิเศษ..."
                  rows={2}
                  className="text-sm"
                />
              </CardContent>
            </Card>

            {/* Submit bar */}
            <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
              <div className="text-xs text-muted-foreground">
                {products.filter(p => p.model.trim()).length} รายการสินค้า
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => navigate(-1)} disabled={submitting}>ยกเลิก</Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  {submitting ? 'กำลังส่ง...' : 'ส่งคำขอใบเสนอราคา'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

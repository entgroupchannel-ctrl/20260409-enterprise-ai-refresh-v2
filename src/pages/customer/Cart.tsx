import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';
import B2BWorkflowBanner from '@/components/B2BWorkflowBanner';
import SiteNavbar from '@/components/SiteNavbar';
import Footer from '@/components/Footer';

export default function Cart() {
  const { items, loading, count, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleCreateQuote = async () => {
    if (!user || items.length === 0) return;

    // Check user profile
    const { data: profile } = await (supabase.from as any)('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile || !profile.company_name) {
      toast({ title: 'กรุณากรอกข้อมูลโปรไฟล์ก่อน', description: 'ระบบต้องการข้อมูลบริษัทเพื่อสร้างใบเสนอราคา' });
      navigate('/profile');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await (supabase.from as any)('quote_requests')
        .insert({
          quote_number: '',
          customer_name: profile.contact_name || user.email,
          customer_email: profile.contact_email || user.email,
          customer_phone: profile.contact_phone || null,
          customer_company: profile.company_name || null,
          customer_address: profile.billing_address || null,
          customer_tax_id: profile.company_tax_id || null,
          customer_line: profile.contact_line || null,
          products: items.map(item => ({
            model: item.product_model,
            description: item.product_description || item.product_name || '',
            qty: item.quantity,
            unit_price: item.estimated_price || 0,
            discount_percent: 0,
            line_total: (item.estimated_price || 0) * item.quantity,
          })),
          status: 'pending',
          subtotal: 0,
          vat_amount: 0,
          grand_total: 0,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      await clearCart();
      toast({ title: 'สร้างใบเสนอราคาสำเร็จ', description: `เลขที่ ${data.quote_number}` });
      navigate('/my-quotes');
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead title="ตะกร้าของฉัน | ENT Group" description="ตะกร้าสินค้าสำหรับขอใบเสนอราคา" />
      <div className="min-h-screen bg-background flex flex-col">
        <SiteNavbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} className="mr-1" /> กลับ
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart size={24} /> ตะกร้าของฉัน
            </h1>
          </div>

          {items.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-16">
                <ShoppingCart size={48} className="text-muted-foreground" />
                <p className="text-muted-foreground">ยังไม่มีสินค้าในตะกร้า</p>
                <Button onClick={() => navigate('/gt-series')}>เลือกสินค้า</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <Card key={item.id}>
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{item.product_model}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.product_name || item.product_description || '-'}</p>
                      {item.estimated_price && (
                        <p className="text-xs text-primary mt-1">฿{item.estimated_price.toLocaleString()}</p>
                      )}
                    </div>

                    <div className="flex items-center border border-border rounded-md">
                      <button className="px-2 py-1 hover:bg-muted transition-colors" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-medium min-w-[2.5rem] text-center">{item.quantity}</span>
                      <button className="px-2 py-1 hover:bg-muted transition-colors" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeItem(item.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-muted/50">
                <CardContent className="py-4">
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span>รวม {items.length} รายการ ({count} ชิ้น)</span>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={clearCart}>ล้างตะกร้า</Button>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => navigate('/gt-series')}>
                      เลือกสินค้าเพิ่ม
                    </Button>
                    <Button className="flex-1" onClick={handleCreateQuote} disabled={submitting}>
                      <FileText size={16} className="mr-2" />
                      {submitting ? 'กำลังสร้าง...' : 'สร้างใบเสนอราคา'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground text-center">
                หรือ <Link to="/request-quote" className="text-primary hover:underline">กรอกฟอร์มแบบเต็ม</Link>
              </p>
            </div>
          )}
        </main>
        <B2BWorkflowBanner variant="compact" />
        <Footer />
      </div>
    </>
  );
}

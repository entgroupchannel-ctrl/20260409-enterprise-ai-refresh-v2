import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNavbar from '@/components/SiteNavbar';
import MiniFooter from '@/components/MiniFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function RegisterProductForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const [productId, setProductId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  useEffect(() => {
    supabase
      .from('products')
      .select('id, sku, name, model')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setProducts(data || []));
  }, []);

  const handleSubmit = async () => {
    if (!serialNumber.trim()) { toast({ title: 'กรุณาใส่ Serial Number', variant: 'destructive' }); return; }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('กรุณาเข้าสู่ระบบ');

      const { data: profile } = await supabase
        .from('users')
        .select('full_name, email, phone, company')
        .eq('id', user.id)
        .maybeSingle();

      const product = products.find(p => p.id === productId);

      const { error } = await (supabase as any)
        .from('registered_products')
        .insert({
          product_id: productId || null,
          product_name_snapshot: product?.name || serialNumber,
          product_sku_snapshot: product?.sku || null,
          serial_number: serialNumber.trim(),
          customer_id: user.id,
          customer_email: user.email || '',
          customer_name: profile?.full_name || user.email || '',
          customer_phone: profile?.phone || null,
          customer_company: profile?.company || null,
          purchase_date: purchaseDate || null,
          warranty_start_date: purchaseDate || new Date().toISOString().slice(0, 10),
          warranty_months: 12,
          warranty_type: 'carry_in',
          source: 'customer',
          status: 'pending_verification',
          customer_notes: customerNotes.trim() || null,
          registered_by: user.id,
        });

      if (error) {
        if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
          toast({ title: 'Serial number นี้ลงทะเบียนแล้ว', variant: 'destructive' });
        } else throw error;
        return;
      }

      setSuccess(true);
    } catch (e: any) {
      toast({ title: 'ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteNavbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">ส่งคำขอลงทะเบียนแล้ว</h2>
            <p className="text-muted-foreground mb-6">รอ admin อนุมัติ — จะแจ้งเตือนเมื่อดำเนินการเรียบร้อย</p>
            <Button onClick={() => navigate('/my/products')}>ดูสินค้าของฉัน</Button>
          </div>
        </main>
        <MiniFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNavbar />
      <main className="flex-1 max-w-lg mx-auto px-4 py-8 w-full">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/my/products')}><ArrowLeft className="w-4 h-4 mr-1" /> กลับ</Button>
          <h1 className="text-xl font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> ลงทะเบียนสินค้า</h1>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">กรอกข้อมูล Serial Number</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>สินค้า (ถ้าทราบ)</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger><SelectValue placeholder="เลือกสินค้า (ไม่บังคับ)" /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Serial Number <span className="text-destructive">*</span></Label>
              <Input value={serialNumber} onChange={e => setSerialNumber(e.target.value)} placeholder="เช่น SN-A001-2024" className="font-mono" />
            </div>
            <div>
              <Label>วันที่ซื้อ</Label>
              <Input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />
            </div>
            <div>
              <Label>หมายเหตุ</Label>
              <Textarea value={customerNotes} onChange={e => setCustomerNotes(e.target.value)} rows={2} placeholder="ข้อมูลเพิ่มเติม..." />
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              ส่งคำขอลงทะเบียน
            </Button>
            <p className="text-xs text-muted-foreground text-center">หลังส่งคำขอ admin จะตรวจสอบและอนุมัติให้</p>
          </CardContent>
        </Card>
      </main>
      <MiniFooter />
    </div>
  );
}

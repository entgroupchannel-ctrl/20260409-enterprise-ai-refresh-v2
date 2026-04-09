import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';

interface ProductLine {
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export default function AdminQuoteCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    tax_id: '',
  });

  const [products, setProducts] = useState<ProductLine[]>([
    { name: '', description: '', quantity: 1, unit_price: 0, total: 0 },
  ]);

  const [terms, setTerms] = useState({
    payment: 'เงินสด / โอน / เช็ค',
    delivery: 'จัดส่งฟรีกรุงเทพและปริมณฑล',
    warranty: 'รับประกัน 1 ปี',
    notes: '',
    internal_notes: '',
    valid_days: 30,
    discount_percent: 0,
    vat_percent: 7,
  });

  const updateProduct = (index: number, field: keyof ProductLine, value: string | number) => {
    const updated = [...products];
    (updated[index] as any)[field] = value;
    if (field === 'quantity' || field === 'unit_price') {
      updated[index].total = updated[index].quantity * updated[index].unit_price;
    }
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', description: '', quantity: 1, unit_price: 0, total: 0 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length <= 1) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  const subtotal = products.reduce((sum, p) => sum + p.total, 0);
  const discountAmount = subtotal * (terms.discount_percent / 100);
  const afterDiscount = subtotal - discountAmount;
  const vatAmount = afterDiscount * (terms.vat_percent / 100);
  const grandTotal = afterDiscount + vatAmount;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

  const handleSave = async () => {
    if (!customer.name || !customer.email) {
      toast({ title: 'กรุณากรอกข้อมูลลูกค้า', description: 'ชื่อและอีเมลจำเป็นต้องกรอก', variant: 'destructive' });
      return;
    }

    if (products.some(p => !p.name || p.unit_price <= 0)) {
      toast({ title: 'กรุณากรอกข้อมูลสินค้า', description: 'ชื่อสินค้าและราคาจำเป็นต้องกรอก', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + terms.valid_days);

      const { data, error } = await supabase
        .from('quote_requests')
        .insert({
          quote_number: '', // trigger will generate
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone || null,
          customer_company: customer.company || null,
          customer_address: customer.address || null,
          customer_tax_id: customer.tax_id || null,
          products: products as any,
          subtotal,
          discount_percent: terms.discount_percent,
          discount_amount: discountAmount,
          vat_percent: terms.vat_percent,
          vat_amount: vatAmount,
          grand_total: grandTotal,
          payment_terms: terms.payment,
          delivery_terms: terms.delivery,
          warranty_terms: terms.warranty,
          notes: terms.notes || null,
          internal_notes: terms.internal_notes || null,
          valid_until: validUntil.toISOString().split('T')[0],
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      toast({ title: 'สร้างใบเสนอราคาสำเร็จ', description: `เลขที่ ${data.quote_number}` });
      navigate(`/admin/quotes/${data.id}`);
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/quotes')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">สร้างใบเสนอราคาใหม่</h1>
            <p className="text-sm text-muted-foreground">กรอกข้อมูลลูกค้าและรายการสินค้า</p>
          </div>
        </div>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ข้อมูลลูกค้า</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>ชื่อ-นามสกุล *</Label>
                <Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="ชื่อลูกค้า" />
              </div>
              <div>
                <Label>อีเมล *</Label>
                <Input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div>
                <Label>เบอร์โทร</Label>
                <Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="0xx-xxx-xxxx" />
              </div>
              <div>
                <Label>บริษัท</Label>
                <Input value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} placeholder="ชื่อบริษัท" />
              </div>
              <div className="md:col-span-2">
                <Label>ที่อยู่</Label>
                <Textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="ที่อยู่สำหรับออกใบเสนอราคา" rows={2} />
              </div>
              <div>
                <Label>เลขประจำตัวผู้เสียภาษี</Label>
                <Input value={customer.tax_id} onChange={(e) => setCustomer({ ...customer, tax_id: e.target.value })} placeholder="เลข 13 หลัก" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">รายการสินค้า</CardTitle>
            <Button size="sm" variant="outline" onClick={addProduct}>
              <Plus className="w-4 h-4 mr-1" /> เพิ่มรายการ
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {products.map((product, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end p-3 border rounded-lg">
                <div className="col-span-12 md:col-span-4">
                  <Label>ชื่อสินค้า *</Label>
                  <Input value={product.name} onChange={(e) => updateProduct(index, 'name', e.target.value)} placeholder="รุ่นสินค้า" />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <Label>รายละเอียด</Label>
                  <Input value={product.description} onChange={(e) => updateProduct(index, 'description', e.target.value)} placeholder="สเปก/หมายเหตุ" />
                </div>
                <div className="col-span-4 md:col-span-1">
                  <Label>จำนวน</Label>
                  <Input type="number" min={1} value={product.quantity} onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)} />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Label>ราคา/หน่วย</Label>
                  <Input type="number" min={0} value={product.unit_price} onChange={(e) => updateProduct(index, 'unit_price', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="col-span-3 md:col-span-1 text-right">
                  <Label>รวม</Label>
                  <p className="font-semibold text-sm py-2">{formatCurrency(product.total)}</p>
                </div>
                <div className="col-span-1">
                  <Button size="icon" variant="ghost" onClick={() => removeProduct(index)} disabled={products.length <= 1} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Separator />

            <div className="flex flex-col items-end gap-2 text-sm">
              <div className="flex items-center gap-8">
                <span className="text-muted-foreground">ยอดรวม</span>
                <span className="font-medium w-28 text-right">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">ส่วนลด</span>
                <Input type="number" min={0} max={100} value={terms.discount_percent} onChange={(e) => setTerms({ ...terms, discount_percent: parseFloat(e.target.value) || 0 })} className="w-16 h-8 text-center" />
                <span className="text-muted-foreground">%</span>
                <span className="font-medium w-28 text-right text-destructive">-{formatCurrency(discountAmount)}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">VAT</span>
                <Input type="number" min={0} max={100} value={terms.vat_percent} onChange={(e) => setTerms({ ...terms, vat_percent: parseFloat(e.target.value) || 0 })} className="w-16 h-8 text-center" />
                <span className="text-muted-foreground">%</span>
                <span className="font-medium w-28 text-right">{formatCurrency(vatAmount)}</span>
              </div>
              <Separator className="w-full max-w-xs" />
              <div className="flex items-center gap-8 text-lg">
                <span className="font-semibold">ยอดรวมสุทธิ</span>
                <span className="font-bold text-primary w-28 text-right">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">เงื่อนไข</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>เงื่อนไขการชำระเงิน</Label>
                <Input value={terms.payment} onChange={(e) => setTerms({ ...terms, payment: e.target.value })} />
              </div>
              <div>
                <Label>เงื่อนไขการจัดส่ง</Label>
                <Input value={terms.delivery} onChange={(e) => setTerms({ ...terms, delivery: e.target.value })} />
              </div>
              <div>
                <Label>การรับประกัน</Label>
                <Input value={terms.warranty} onChange={(e) => setTerms({ ...terms, warranty: e.target.value })} />
              </div>
              <div>
                <Label>ใบเสนอราคามีอายุ (วัน)</Label>
                <Input type="number" min={1} value={terms.valid_days} onChange={(e) => setTerms({ ...terms, valid_days: parseInt(e.target.value) || 30 })} />
              </div>
              <div className="md:col-span-2">
                <Label>หมายเหตุถึงลูกค้า</Label>
                <Textarea value={terms.notes} onChange={(e) => setTerms({ ...terms, notes: e.target.value })} placeholder="หมายเหตุที่จะแสดงในใบเสนอราคา" rows={2} />
              </div>
              <div className="md:col-span-2">
                <Label>โน้ตภายใน (ไม่แสดงให้ลูกค้า)</Label>
                <Textarea value={terms.internal_notes} onChange={(e) => setTerms({ ...terms, internal_notes: e.target.value })} placeholder="โน้ตสำหรับทีมงาน" rows={2} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pb-8">
          <Button variant="outline" onClick={() => navigate('/admin/quotes')}>ยกเลิก</Button>
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'กำลังบันทึก...' : 'บันทึกใบเสนอราคา'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Save, Percent } from 'lucide-react';

/* ── Dropdown Options ── */
const PAYMENT_OPTIONS = [
  'เงินสด / โอน / เช็ค',
  'เครดิต 30 วัน',
  'เครดิต 45 วัน',
  'เครดิต 60 วัน',
  'มัดจำ 50% ที่เหลือจ่ายก่อนส่งของ',
  'ชำระเต็มจำนวนก่อนส่งของ',
];

const DELIVERY_OPTIONS = [
  'จัดส่งฟรีกรุงเทพและปริมณฑล',
  'จัดส่งฟรีทั่วประเทศ',
  'รับหน้าร้าน',
  'จัดส่งภายใน 3-5 วันทำการ',
  'จัดส่งภายใน 7-14 วันทำการ',
  'จัดส่งภายใน 30 วันทำการ',
  'นัดหมายติดตั้งหน้างาน',
];

const WARRANTY_OPTIONS = [
  'รับประกัน 1 ปี',
  'รับประกัน 2 ปี',
  'รับประกัน 3 ปี',
  'รับประกัน 5 ปี',
  'ไม่มีการรับประกัน',
  'ตามเงื่อนไขผู้ผลิต',
];

const VALID_DAYS_OPTIONS = [
  { value: 7, label: '7 วัน' },
  { value: 15, label: '15 วัน' },
  { value: 30, label: '30 วัน' },
  { value: 45, label: '45 วัน' },
  { value: 60, label: '60 วัน' },
  { value: 90, label: '90 วัน' },
];

/* ── Types ── */
interface ProductLine {
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  line_total: number;
}

function calcLine(p: ProductLine): ProductLine {
  const gross = p.quantity * p.unit_price;
  const disc = gross * (p.discount_percent / 100);
  return { ...p, discount_amount: disc, line_total: gross - disc };
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
    line_id: '',
  });

  const [products, setProducts] = useState<ProductLine[]>([
    { name: '', description: '', quantity: 1, unit_price: 0, discount_percent: 0, discount_amount: 0, line_total: 0 },
  ]);

  const [terms, setTerms] = useState({
    payment: PAYMENT_OPTIONS[0],
    delivery: DELIVERY_OPTIONS[0],
    warranty: WARRANTY_OPTIONS[0],
    notes: '',
    internal_notes: '',
    valid_days: 30,
    discount_percent: 0,
    vat_percent: 7,
    withholding_tax: false,
    withholding_percent: 3,
  });

  /* ── Product helpers ── */
  const updateProduct = (index: number, field: keyof ProductLine, value: string | number) => {
    const updated = [...products];
    (updated[index] as any)[field] = value;
    updated[index] = calcLine(updated[index]);
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { name: '', description: '', quantity: 1, unit_price: 0, discount_percent: 0, discount_amount: 0, line_total: 0 },
    ]);
  };

  const removeProduct = (index: number) => {
    if (products.length <= 1) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  /* ── Calculations ── */
  const itemDiscountTotal = products.reduce((sum, p) => sum + p.discount_amount, 0);
  const subtotalBeforeDiscount = products.reduce((sum, p) => sum + p.quantity * p.unit_price, 0);
  const subtotalAfterItemDiscount = products.reduce((sum, p) => sum + p.line_total, 0);

  const overallDiscountAmount = subtotalAfterItemDiscount * (terms.discount_percent / 100);
  const afterAllDiscount = subtotalAfterItemDiscount - overallDiscountAmount;

  const vatAmount = afterAllDiscount * (terms.vat_percent / 100);
  const withholdingAmount = terms.withholding_tax ? afterAllDiscount * (terms.withholding_percent / 100) : 0;
  const grandTotal = afterAllDiscount + vatAmount - withholdingAmount;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(amount);

  /* ── Save ── */
  const handleSave = async () => {
    if (!customer.name || !customer.email) {
      toast({ title: 'กรุณากรอกข้อมูลลูกค้า', description: 'ชื่อและอีเมลจำเป็นต้องกรอก', variant: 'destructive' });
      return;
    }
    if (products.some((p) => !p.name || p.unit_price <= 0)) {
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
          quote_number: '',
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone || null,
          customer_company: customer.company || null,
          customer_address: customer.address || null,
          customer_tax_id: customer.tax_id || null,
          customer_line: customer.line_id || null,
          products: products as any,
          subtotal: subtotalAfterItemDiscount,
          discount_percent: terms.discount_percent,
          discount_amount: overallDiscountAmount + itemDiscountTotal,
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
          metadata: {
            withholding_tax: terms.withholding_tax,
            withholding_percent: terms.withholding_tax ? terms.withholding_percent : 0,
            withholding_amount: withholdingAmount,
            item_discount_total: itemDiscountTotal,
          } as any,
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
        {/* Header */}
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
              <div>
                <Label>LINE ID</Label>
                <Input value={customer.line_id} onChange={(e) => setCustomer({ ...customer, line_id: e.target.value })} placeholder="@line_id" />
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
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-12 md:col-span-5">
                    <Label>ชื่อสินค้า *</Label>
                    <Input value={product.name} onChange={(e) => updateProduct(index, 'name', e.target.value)} placeholder="รุ่นสินค้า" />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Label>รายละเอียด</Label>
                    <Input value={product.description} onChange={(e) => updateProduct(index, 'description', e.target.value)} placeholder="สเปก/หมายเหตุ" />
                  </div>
                  <div className="col-span-12 md:col-span-1 flex justify-end">
                    <Button size="icon" variant="ghost" onClick={() => removeProduct(index)} disabled={products.length <= 1} className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-3 md:col-span-2">
                    <Label>จำนวน</Label>
                    <Input type="number" min={1} value={product.quantity} onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="col-span-4 md:col-span-3">
                    <Label>ราคา/หน่วย (฿)</Label>
                    <Input type="number" min={0} value={product.unit_price} onChange={(e) => updateProduct(index, 'unit_price', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <Label className="flex items-center gap-1">
                      <Percent className="w-3 h-3" /> ส่วนลด
                    </Label>
                    <Input type="number" min={0} max={100} value={product.discount_percent} onChange={(e) => updateProduct(index, 'discount_percent', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-2 md:col-span-2 text-right">
                    {product.discount_amount > 0 && (
                      <p className="text-xs text-destructive mb-1">-{formatCurrency(product.discount_amount)}</p>
                    )}
                    <p className="font-semibold text-sm">{formatCurrency(product.line_total)}</p>
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            {/* Pricing Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">สรุปยอด</h4>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ยอดรวมก่อนส่วนลด</span>
                <span>{formatCurrency(subtotalBeforeDiscount)}</span>
              </div>

              {itemDiscountTotal > 0 && (
                <div className="flex justify-between text-sm text-destructive">
                  <span>ส่วนลดรายรายการ</span>
                  <span>-{formatCurrency(itemDiscountTotal)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ยอดหลังส่วนลดรายการ</span>
                <span>{formatCurrency(subtotalAfterItemDiscount)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">ส่วนลดรวม</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={terms.discount_percent}
                    onChange={(e) => setTerms({ ...terms, discount_percent: parseFloat(e.target.value) || 0 })}
                    className="w-16 h-7 text-center text-xs"
                  />
                  <span className="text-muted-foreground text-xs">%</span>
                </div>
                {overallDiscountAmount > 0 && (
                  <span className="text-destructive">-{formatCurrency(overallDiscountAmount)}</span>
                )}
              </div>

              {(itemDiscountTotal > 0 || overallDiscountAmount > 0) && (
                <>
                  <Separator />
                  <div className="flex justify-between text-sm font-medium">
                    <span>ยอดหลังหักส่วนลดทั้งหมด</span>
                    <span>{formatCurrency(afterAllDiscount)}</span>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">VAT</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={terms.vat_percent}
                    onChange={(e) => setTerms({ ...terms, vat_percent: parseFloat(e.target.value) || 0 })}
                    className="w-16 h-7 text-center text-xs"
                  />
                  <span className="text-muted-foreground text-xs">%</span>
                </div>
                <span>{formatCurrency(vatAmount)}</span>
              </div>

              {/* Withholding Tax */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={terms.withholding_tax}
                    onCheckedChange={(checked) => setTerms({ ...terms, withholding_tax: checked })}
                  />
                  <span className="text-muted-foreground">หัก ณ ที่จ่าย</span>
                  {terms.withholding_tax && (
                    <>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={terms.withholding_percent}
                        onChange={(e) => setTerms({ ...terms, withholding_percent: parseFloat(e.target.value) || 0 })}
                        className="w-16 h-7 text-center text-xs"
                      />
                      <span className="text-muted-foreground text-xs">%</span>
                    </>
                  )}
                </div>
                {terms.withholding_tax && withholdingAmount > 0 && (
                  <span className="text-destructive">-{formatCurrency(withholdingAmount)}</span>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between text-lg pt-1">
                <span className="font-bold">ยอดรวมสุทธิ</span>
                <span className="font-bold text-primary">{formatCurrency(grandTotal)}</span>
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
                <Select value={terms.payment} onValueChange={(v) => setTerms({ ...terms, payment: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>เงื่อนไขการจัดส่ง</Label>
                <Select value={terms.delivery} onValueChange={(v) => setTerms({ ...terms, delivery: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DELIVERY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>การรับประกัน</Label>
                <Select value={terms.warranty} onValueChange={(v) => setTerms({ ...terms, warranty: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WARRANTY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>ใบเสนอราคามีอายุ</Label>
                <Select value={String(terms.valid_days)} onValueChange={(v) => setTerms({ ...terms, valid_days: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VALID_DAYS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

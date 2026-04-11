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
import {
  ArrowLeft, Plus, Trash2, Save, Percent, User, FileText,
  CreditCard, Truck, ShieldCheck, Package, Search, Check, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductPickerDialog from '@/components/admin/ProductPickerDialog';
import CustomerAutocomplete from '@/components/admin/CustomerAutocomplete';
import type { PickedProduct } from '@/components/admin/ProductPickerDialog';
import type { ContactData } from '@/components/admin/CustomerAutocomplete';

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

/* ── Types ── */
interface ProductLine {
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  discount_percent: number;
  discount_amount: number;
  line_total: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  tax_id: string;
  line_id: string;
  branch_type: 'head_office' | 'branch';
  branch_code: string;
  branch_name: string;
  position: string;
}

interface PaymentMethods {
  cash: boolean;
  transfer: boolean;
  cheque: boolean;
  credit: boolean;
  credit_days: number;
  deposit_required: boolean;
  deposit_percent: number;
}

/* ── Helpers ── */
function calcLine(p: ProductLine): ProductLine {
  const gross = p.quantity * p.unit_price;
  let discountAmount = 0;
  let discountPercent = 0;

  if (p.discount_type === 'percent') {
    discountPercent = Math.min(100, Math.max(0, p.discount_value));
    discountAmount = gross * (discountPercent / 100);
  } else {
    discountAmount = Math.min(gross, Math.max(0, p.discount_value));
    discountPercent = gross > 0 ? (discountAmount / gross) * 100 : 0;
  }

  return {
    ...p,
    discount_percent: discountPercent,
    discount_amount: discountAmount,
    line_total: gross - discountAmount,
  };
}

function DiscountToggle({
  type,
  onTypeChange,
  className,
}: {
  type: 'percent' | 'fixed';
  onTypeChange: (t: 'percent' | 'fixed') => void;
  className?: string;
}) {
  return (
    <div className={cn('flex border-l border-input', className)}>
      <button
        type="button"
        onClick={() => onTypeChange('percent')}
        className={cn(
          'px-2 text-xs font-medium transition-colors',
          type === 'percent'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/70 text-muted-foreground'
        )}
        title="ส่วนลดแบบเปอร์เซ็นต์"
      >
        %
      </button>
      <button
        type="button"
        onClick={() => onTypeChange('fixed')}
        className={cn(
          'px-2 text-xs font-medium transition-colors border-l border-input',
          type === 'fixed'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/70 text-muted-foreground'
        )}
        title="ส่วนลดเป็นบาท"
      >
        ฿
      </button>
    </div>
  );
}

const validateTaxId = (taxId: string): { valid: boolean; message?: string } => {
  if (!taxId) return { valid: true };
  const clean = taxId.replace(/[-\s]/g, '');
  if (clean.length !== 13) {
    return { valid: false, message: `ต้องมี 13 หลัก (ปัจจุบัน ${clean.length})` };
  }
  if (!/^\d{13}$/.test(clean)) {
    return { valid: false, message: 'ต้องเป็นตัวเลขเท่านั้น' };
  }
  return { valid: true };
};

const buildPaymentTermsString = (m: PaymentMethods): string => {
  const parts: string[] = [];
  if (m.cash) parts.push('เงินสด');
  if (m.transfer) parts.push('โอนเงิน');
  if (m.cheque) parts.push('เช็ค');
  if (m.credit) parts.push(`เครดิต ${m.credit_days} วัน`);
  if (parts.length === 0) return 'ตามตกลง';
  let result = parts.join(' / ');
  if (m.deposit_required) {
    result = `มัดจำ ${m.deposit_percent}% ที่เหลือ${result}`;
  }
  return result;
};

/* ── Component ── */
export default function AdminQuoteCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '', email: '', phone: '', company: '', address: '',
    tax_id: '', line_id: '',
    branch_type: 'head_office', branch_code: '', branch_name: '', position: '',
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({
    cash: false, transfer: true, cheque: false, credit: false,
    credit_days: 30, deposit_required: false, deposit_percent: 50,
  });

  const emptyProduct: ProductLine = {
    name: '', description: '', quantity: 1, unit_price: 0,
    discount_type: 'percent', discount_value: 0, discount_percent: 0,
    discount_amount: 0, line_total: 0,
  };

  const [products, setProducts] = useState<ProductLine[]>([{ ...emptyProduct }]);

  const [terms, setTerms] = useState({
    delivery: DELIVERY_OPTIONS[0],
    warranty: WARRANTY_OPTIONS[0],
    notes: '',
    internal_notes: '',
    valid_days: 30,
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: 0,
    discount_percent: 0,
    vat_percent: 7,
    withholding_tax: false,
    withholding_percent: 3,
  });

  const taxIdValidation = validateTaxId(customer.tax_id);

  /* ── Product helpers ── */
  const updateProduct = (index: number, field: keyof ProductLine, value: string | number) => {
    const updated = [...products];
    (updated[index] as any)[field] = value;
    if (['quantity', 'unit_price', 'discount_type', 'discount_value'].includes(field)) {
      updated[index] = calcLine(updated[index]);
    }
    setProducts(updated);
  };

  const addProduct = () => setProducts([...products, { ...emptyProduct }]);

  const removeProduct = (index: number) => {
    if (products.length <= 1) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  /* ── Handlers ── */
  const handleCustomerSelect = (data: ContactData) => {
    setCustomer({
      name: data.contact_name || '',
      email: data.email || '',
      phone: data.mobile_phone || data.office_phone || '',
      company: data.company_name || '',
      address: data.address || '',
      tax_id: data.tax_id || '',
      line_id: data.line_id || '',
      branch_type: (data.branch_type as 'head_office' | 'branch') || 'head_office',
      branch_code: data.branch_code || '',
      branch_name: data.branch_name || '',
      position: data.contact_position || '',
    });
    toast({ title: '✅ โหลดข้อมูลลูกค้าสำเร็จ', description: data.company_name || data.contact_name || '' });
  };

  const handleProductPick = (product: PickedProduct) => {
    const newProduct: ProductLine = {
      name: product.name,
      description: product.description || '',
      quantity: 1,
      unit_price: product.unit_price,
      discount_type: 'percent',
      discount_value: 0, discount_percent: 0, discount_amount: 0,
      line_total: product.unit_price,
    };
    if (products.length === 1 && !products[0].name && products[0].unit_price === 0) {
      setProducts([calcLine(newProduct)]);
    } else {
      setProducts([...products, calcLine(newProduct)]);
    }
    toast({ title: '✅ เพิ่มสินค้าแล้ว', description: product.name });
  };

  /* ── Calculations ── */
  const itemDiscountTotal = products.reduce((sum, p) => sum + p.discount_amount, 0);
  const subtotalBeforeDiscount = products.reduce((sum, p) => sum + p.quantity * p.unit_price, 0);
  const subtotalAfterItemDiscount = products.reduce((sum, p) => sum + p.line_total, 0);

  let overallDiscountAmount = 0;
  let overallDiscountPercent = 0;

  if (terms.discount_type === 'percent') {
    overallDiscountPercent = Math.min(100, Math.max(0, terms.discount_value));
    overallDiscountAmount = subtotalAfterItemDiscount * (overallDiscountPercent / 100);
  } else {
    overallDiscountAmount = Math.min(subtotalAfterItemDiscount, Math.max(0, terms.discount_value));
    overallDiscountPercent = subtotalAfterItemDiscount > 0
      ? (overallDiscountAmount / subtotalAfterItemDiscount) * 100 : 0;
  }

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
    if (customer.tax_id && !taxIdValidation.valid) {
      toast({ title: 'Tax ID ไม่ถูกต้อง', description: taxIdValidation.message, variant: 'destructive' });
      return;
    }
    if (!paymentMethods.cash && !paymentMethods.transfer && !paymentMethods.cheque && !paymentMethods.credit) {
      toast({ title: 'กรุณาเลือกวิธีการชำระเงิน', description: 'ต้องเลือกอย่างน้อย 1 วิธี', variant: 'destructive' });
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
          customer_tax_id: customer.tax_id.replace(/[-\s]/g, '') || null,
          customer_line: customer.line_id || null,
          products: products.map((p) => ({
            name: p.name, description: p.description,
            quantity: p.quantity, unit_price: p.unit_price,
            discount_type: p.discount_type, discount_value: p.discount_value,
            discount_percent: p.discount_percent, discount_amount: p.discount_amount,
            line_total: p.line_total,
          })) as any,
          subtotal: subtotalAfterItemDiscount,
          discount_percent: overallDiscountPercent,
          discount_amount: overallDiscountAmount + itemDiscountTotal,
          vat_percent: terms.vat_percent,
          vat_amount: vatAmount,
          grand_total: grandTotal,
          payment_terms: buildPaymentTermsString(paymentMethods),
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
            discount_type: terms.discount_type,
            discount_value: terms.discount_value,
            payment_methods: paymentMethods,
            customer_branch: {
              type: customer.branch_type,
              code: customer.branch_code,
              name: customer.branch_name,
            },
            customer_position: customer.position,
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
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/quotes')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">สร้างใบเสนอราคาใหม่</h1>
            <p className="text-sm text-muted-foreground">กรอกข้อมูลลูกค้าและรายการสินค้า</p>
          </div>
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </div>

        {/* ═══ Customer + Terms — 2 columns ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                ข้อมูลลูกค้า
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs flex items-center gap-1.5 mb-1">
                  <Search className="w-3 h-3" />
                  ค้นหาจากฐานข้อมูลลูกค้า
                </Label>
                <CustomerAutocomplete onSelect={handleCustomerSelect} />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">ชื่อ-นามสกุล *</Label>
                  <Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="ชื่อผู้ติดต่อ" className="h-9" />
                </div>
                <div>
                  <Label className="text-xs">ตำแหน่ง</Label>
                  <Input value={customer.position} onChange={(e) => setCustomer({ ...customer, position: e.target.value })} placeholder="เช่น ผู้จัดการฝ่ายจัดซื้อ" className="h-9" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">บริษัท</Label>
                  <Input value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} placeholder="ชื่อบริษัท / องค์กร" className="h-9" />
                </div>
                <div>
                  <Label className="text-xs">อีเมล *</Label>
                  <Input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} placeholder="email@example.com" className="h-9" />
                </div>
                <div>
                  <Label className="text-xs">เบอร์โทร</Label>
                  <Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="0xx-xxx-xxxx" className="h-9" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">LINE ID</Label>
                  <Input value={customer.line_id} onChange={(e) => setCustomer({ ...customer, line_id: e.target.value })} placeholder="@line_id" className="h-9" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">ที่อยู่ออกใบเสนอราคา</Label>
                  <Textarea value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="ที่อยู่บริษัท..." rows={3} className="text-sm resize-none" />
                </div>
              </div>

              <Separator />

              {/* Tax ID with validation */}
              <div>
                <Label className="text-xs">เลขประจำตัวผู้เสียภาษี (13 หลัก)</Label>
                <div className="relative">
                  <Input
                    value={customer.tax_id}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^\d-]/g, '');
                      setCustomer({ ...customer, tax_id: clean });
                    }}
                    placeholder="0-0000-00000-00-0"
                    maxLength={17}
                    className={cn(
                      'h-9 font-mono pr-8',
                      customer.tax_id && !taxIdValidation.valid && 'border-destructive focus-visible:ring-destructive'
                    )}
                  />
                  {customer.tax_id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {taxIdValidation.valid ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
                {customer.tax_id && !taxIdValidation.valid && (
                  <p className="text-xs text-destructive mt-1">{taxIdValidation.message}</p>
                )}
              </div>

              {/* Branch */}
              <div>
                <Label className="text-xs">สำนักงาน/สาขา</Label>
                <div className="flex items-center gap-4 h-9">
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="radio" checked={customer.branch_type === 'head_office'} onChange={() => setCustomer({ ...customer, branch_type: 'head_office', branch_code: '', branch_name: '' })} />
                    สำนักงานใหญ่
                  </label>
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="radio" checked={customer.branch_type === 'branch'} onChange={() => setCustomer({ ...customer, branch_type: 'branch' })} />
                    สาขา
                  </label>
                </div>
                {customer.branch_type === 'branch' && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Input value={customer.branch_code} onChange={(e) => setCustomer({ ...customer, branch_code: e.target.value })} placeholder="รหัส" className="h-9 col-span-1" />
                    <Input value={customer.branch_name} onChange={(e) => setCustomer({ ...customer, branch_name: e.target.value })} placeholder="ชื่อสาขา" className="h-9 col-span-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* RIGHT: Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                เงื่อนไข
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Payment Methods */}
              <div>
                <Label className="text-xs flex items-center gap-1.5 mb-2">
                  <CreditCard className="w-3 h-3" />
                  วิธีการชำระเงิน (เลือกได้หลายอย่าง)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'cash' as const, label: '💵 เงินสด' },
                    { key: 'transfer' as const, label: '🏦 โอนเงิน' },
                    { key: 'cheque' as const, label: '📝 เช็ค' },
                    { key: 'credit' as const, label: '📅 เครดิต' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 text-sm border rounded-md p-2 cursor-pointer hover:bg-accent has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                      <input
                        type="checkbox"
                        checked={paymentMethods[key]}
                        onChange={(e) => setPaymentMethods({ ...paymentMethods, [key]: e.target.checked })}
                      />
                      {label}
                    </label>
                  ))}
                </div>

                {paymentMethods.credit && (
                  <div className="mt-2 flex items-center gap-2">
                    <Label className="text-xs">เครดิต</Label>
                    <Select value={paymentMethods.credit_days.toString()} onValueChange={(v) => setPaymentMethods({ ...paymentMethods, credit_days: parseInt(v) })}>
                      <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[7, 15, 30, 45, 60, 90].map((d) => (
                          <SelectItem key={d} value={d.toString()}>{d} วัน</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <Switch checked={paymentMethods.deposit_required} onCheckedChange={(v) => setPaymentMethods({ ...paymentMethods, deposit_required: v })} />
                  <Label className="text-xs">มีมัดจำก่อน</Label>
                  {paymentMethods.deposit_required && (
                    <>
                      <Input type="number" min={1} max={100} value={paymentMethods.deposit_percent} onChange={(e) => setPaymentMethods({ ...paymentMethods, deposit_percent: parseInt(e.target.value) || 50 })} className="h-7 w-16 text-xs" />
                      <span className="text-xs">%</span>
                    </>
                  )}
                </div>

                <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground">
                  ตัวอย่าง: {buildPaymentTermsString(paymentMethods)}
                </div>
              </div>

              <Separator />

              {/* Delivery */}
              <div>
                <Label className="text-xs flex items-center gap-1.5 mb-1">
                  <Truck className="w-3 h-3 text-blue-600" />
                  การจัดส่ง
                </Label>
                <Select value={terms.delivery} onValueChange={(v) => setTerms({ ...terms, delivery: v })}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DELIVERY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Warranty */}
              <div>
                <Label className="text-xs flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3 h-3 text-purple-600" />
                  การรับประกัน
                </Label>
                <Select value={terms.warranty} onValueChange={(v) => setTerms({ ...terms, warranty: v })}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WARRANTY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* VAT + WHT + Validity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">VAT %</Label>
                  <Input type="number" value={terms.vat_percent} onChange={(e) => setTerms({ ...terms, vat_percent: parseFloat(e.target.value) || 0 })} className="h-9" />
                </div>
                <div>
                  <Label className="text-xs">ใบเสนอราคามีผล (วัน)</Label>
                  <Input type="number" value={terms.valid_days} onChange={(e) => setTerms({ ...terms, valid_days: parseInt(e.target.value) || 30 })} className="h-9" />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Switch checked={terms.withholding_tax} onCheckedChange={(v) => setTerms({ ...terms, withholding_tax: v })} />
                  <Label className="text-xs">หัก ณ ที่จ่าย</Label>
                  {terms.withholding_tax && (
                    <>
                      <Input type="number" value={terms.withholding_percent} onChange={(e) => setTerms({ ...terms, withholding_percent: parseFloat(e.target.value) || 3 })} className="h-7 w-16 text-xs" />
                      <span className="text-xs">%</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ Products (full width) ═══ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              รายการสินค้า
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="default" onClick={() => setShowProductPicker(true)}>
                <Package className="w-4 h-4 mr-1" />
                เลือกจากคลัง
              </Button>
              <Button size="sm" variant="outline" onClick={addProduct}>
                <Plus className="w-4 h-4 mr-1" />
                เพิ่มเอง
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {products.map((product, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">รายการ #{index + 1}</span>
                  <Button size="icon" variant="ghost" onClick={() => removeProduct(index)} disabled={products.length <= 1} className="text-destructive h-7 w-7">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Name + Description side by side */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="md:col-span-2">
                    <Label className="text-xs">ชื่อสินค้า *</Label>
                    <Input value={product.name} onChange={(e) => updateProduct(index, 'name', e.target.value)} placeholder="รุ่นสินค้า" className="h-9" />
                  </div>
                  <div className="md:col-span-3">
                    <Label className="text-xs">รายละเอียด / สเปค</Label>
                    <Textarea
                      value={product.description}
                      onChange={(e) => updateProduct(index, 'description', e.target.value)}
                      placeholder={"CPU: Intel Core i7\nRAM: 16GB\nStorage: 512GB SSD\n..."}
                      rows={6}
                      className="text-sm font-mono resize-y min-h-[140px]"
                    />
                  </div>
                </div>

                {/* Quantity + Price + Discount */}
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-3 md:col-span-2">
                    <Label className="text-xs">จำนวน</Label>
                    <Input type="number" min={1} value={product.quantity} onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)} className="h-9" />
                  </div>
                  <div className="col-span-4 md:col-span-3">
                    <Label className="text-xs">ราคา/หน่วย (฿)</Label>
                    <Input type="number" min={0} value={product.unit_price} onChange={(e) => updateProduct(index, 'unit_price', parseFloat(e.target.value) || 0)} className="h-9" />
                  </div>
                  <div className="col-span-3 md:col-span-3">
                    <Label className="text-xs flex items-center gap-1">
                      <Percent className="w-3 h-3" /> ส่วนลด
                    </Label>
                    <div className="flex border border-input rounded-md overflow-hidden h-9">
                      <Input
                        type="number" min={0}
                        max={product.discount_type === 'percent' ? 100 : undefined}
                        value={product.discount_value || ''}
                        onChange={(e) => updateProduct(index, 'discount_value', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="border-0 rounded-none text-right pr-1 focus-visible:ring-0 h-full"
                      />
                      <DiscountToggle type={product.discount_type} onTypeChange={(t) => updateProduct(index, 'discount_type', t as any)} />
                    </div>
                    {product.discount_amount > 0 && product.discount_type === 'fixed' && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">≈ {product.discount_percent.toFixed(1)}%</p>
                    )}
                    {product.discount_amount > 0 && product.discount_type === 'percent' && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">= -{formatCurrency(product.discount_amount)}</p>
                    )}
                  </div>
                  <div className="col-span-2 md:col-span-4 text-right">
                    <Label className="text-xs">ยอดรวม</Label>
                    <p className="font-bold text-lg text-primary h-9 flex items-center justify-end">
                      {formatCurrency(product.line_total)}
                    </p>
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
                  <div className="flex border border-input rounded-md overflow-hidden h-7">
                    <Input
                      type="number" min={0}
                      max={terms.discount_type === 'percent' ? 100 : undefined}
                      value={terms.discount_value || ''}
                      onChange={(e) => setTerms({ ...terms, discount_value: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-20 h-7 border-0 rounded-none text-right pr-1 text-xs focus-visible:ring-0"
                    />
                    <DiscountToggle type={terms.discount_type} onTypeChange={(t) => setTerms({ ...terms, discount_type: t })} />
                  </div>
                </div>
                {overallDiscountAmount > 0 && (
                  <span className="text-destructive">
                    -{formatCurrency(overallDiscountAmount)}
                    {terms.discount_type === 'fixed' && (
                      <span className="text-[10px] text-muted-foreground ml-1">({overallDiscountPercent.toFixed(1)}%)</span>
                    )}
                  </span>
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
                  <Input type="number" min={0} max={100} value={terms.vat_percent} onChange={(e) => setTerms({ ...terms, vat_percent: parseFloat(e.target.value) || 0 })} className="w-16 h-7 text-center text-xs" />
                  <span className="text-muted-foreground text-xs">%</span>
                </div>
                <span>{formatCurrency(vatAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <Switch checked={terms.withholding_tax} onCheckedChange={(checked) => setTerms({ ...terms, withholding_tax: checked })} />
                  <span className="text-muted-foreground">หัก ณ ที่จ่าย</span>
                  {terms.withholding_tax && (
                    <>
                      <Input type="number" min={0} max={100} value={terms.withholding_percent} onChange={(e) => setTerms({ ...terms, withholding_percent: parseFloat(e.target.value) || 0 })} className="w-16 h-7 text-center text-xs" />
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

        {/* ═══ Notes — moved to bottom ═══ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              หมายเหตุ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs flex items-center gap-1.5">📄 หมายเหตุที่ลูกค้าเห็น</Label>
              <Textarea value={terms.notes} onChange={(e) => setTerms({ ...terms, notes: e.target.value })} placeholder="เงื่อนไขเพิ่มเติมที่ลูกค้าจะเห็นในใบเสนอราคา..." rows={3} className="text-sm" />
            </div>
            <div className="border-l-4 border-amber-400 pl-3 bg-amber-50 dark:bg-amber-900/10 p-3 rounded">
              <Label className="text-xs flex items-center gap-1.5">🔒 หมายเหตุภายใน (ลูกค้าไม่เห็น)</Label>
              <Textarea value={terms.internal_notes} onChange={(e) => setTerms({ ...terms, internal_notes: e.target.value })} placeholder="โน้ตภายในสำหรับทีม เช่น margin, strategy, ประวัติลูกค้า..." rows={3} className="text-sm bg-background" />
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

      {/* Product Picker Dialog */}
      <ProductPickerDialog
        open={showProductPicker}
        onOpenChange={setShowProductPicker}
        onSelect={handleProductPick}
      />
    </AdminLayout>
  );
}

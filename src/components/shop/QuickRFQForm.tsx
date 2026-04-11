import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { savePendingQuote } from '@/hooks/usePendingQuote';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Loader2, FileText, ChevronDown, ChevronUp, Phone, MessageCircle, Mail } from 'lucide-react';

interface QuickRFQFormProps {
  product: { model: string; name: string; unit_price: number; slug: string };
  defaultQuantity?: number;
  onSubmit?: () => void;
}

const paymentTermsOptions = [
  { value: 'cash', label: 'เงินสด / โอนก่อนส่งของ' },
  { value: 'credit_30', label: 'เครดิต 30 วัน' },
  { value: 'credit_60', label: 'เครดิต 60 วัน' },
  { value: 'tbd', label: 'ตกลงภายหลัง' },
];

function getTierPrice(basePrice: number, qty: number): number {
  if (qty >= 10) return Math.round(basePrice * 0.86);
  if (qty >= 5) return Math.round(basePrice * 0.93);
  return basePrice;
}

export default function QuickRFQForm({ product, defaultQuantity = 1, onSubmit }: QuickRFQFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [form, setForm] = useState({
    quantity: defaultQuantity,
    customer_name: '',
    customer_company: '',
    customer_email: '',
    customer_phone: '',
    customer_line: '',
    shipping_address: '',
    payment_terms: 'cash',
    needs_tax_invoice: false,
    tax_id: '',
    notes: '',
  });

  // Auto-fill from user profile
  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from('users')
        .select('full_name, email, phone, company')
        .eq('id', user.id)
        .maybeSingle();
      if (data) {
        setForm(prev => ({
          ...prev,
          customer_name: prev.customer_name || data.full_name || '',
          customer_email: prev.customer_email || data.email || user.email || '',
          customer_phone: prev.customer_phone || data.phone || '',
          customer_company: prev.customer_company || data.company || '',
        }));
      }
    };
    loadProfile();
  }, [user]);

  // Sync defaultQuantity changes
  useEffect(() => {
    setForm(prev => ({ ...prev, quantity: defaultQuantity }));
  }, [defaultQuantity]);

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const tierPrice = getTierPrice(product.unit_price, form.quantity);
  const totalEstimate = tierPrice * form.quantity;
  const savings = (product.unit_price - tierPrice) * form.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_email || !form.customer_phone || !form.customer_company) {
      toast({ title: 'กรุณากรอกข้อมูลที่จำเป็น', variant: 'destructive' });
      return;
    }

    if (!user) {
      savePendingQuote({
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        customer_company: form.customer_company,
        notes: form.notes || null,
        products: [{
          model: product.model,
          description: product.name,
          qty: form.quantity,
          unit_price: 0,
          discount_percent: 0,
          line_total: 0,
        }],
      });
      navigate('/login?action=continue');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await (supabase.from as any)('quote_requests')
        .insert({
          quote_number: '',
          customer_name: form.customer_name,
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
          customer_company: form.customer_company,
          customer_address: form.shipping_address || null,
          customer_tax_id: form.needs_tax_invoice ? form.tax_id : null,
          customer_line: form.customer_line || null,
          notes: form.notes || null,
          payment_terms: paymentTermsOptions.find(o => o.value === form.payment_terms)?.label || form.payment_terms,
          products: [{
            model: product.model,
            description: product.name,
            qty: form.quantity,
            unit_price: 0,
            discount_percent: 0,
            line_total: 0,
          }],
          metadata: { source: 'shop_rfq', needs_tax_invoice: form.needs_tax_invoice },
          status: 'pending',
        })
        .select()
        .single();
      if (error) throw error;
      toast({ title: 'ส่งคำขอใบเสนอราคาเรียบร้อย!', description: `เลขที่: ${data.quote_number}` });
      onSubmit?.();
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20" id="rfq-form">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          ขอใบเสนอราคา B2B
        </CardTitle>

        {/* Trust bar */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1">⏱️ <strong>ตอบกลับใน 4 ชม.</strong></span>
          <span className="flex items-center gap-1">🔒 ข้อมูลปลอดภัย</span>
          <span className="flex items-center gap-1">💯 ไม่มีค่าใช้จ่าย</span>
          <span className="flex items-center gap-1">🚫 ไม่สแปม</span>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product info + live price preview */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <span className="font-medium">{product.model}</span> — {product.name}
            <div className="flex items-center gap-3 mt-2">
              <Label className="text-xs">จำนวน:</Label>
              <Input
                type="number"
                min={1}
                value={form.quantity}
                onChange={e => set('quantity', parseInt(e.target.value) || 1)}
                className="w-24 h-8"
              />
              <span className="text-xs text-muted-foreground">ชิ้น</span>
            </div>
          </div>

          {/* Live price preview */}
          {product.unit_price > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ราคาประมาณการ:</span>
                <div className="text-right">
                  {savings > 0 && (
                    <p className="text-xs text-muted-foreground line-through">
                      ฿{(product.unit_price * form.quantity).toLocaleString('th-TH')}
                    </p>
                  )}
                  <p className="text-lg font-bold text-primary">
                    ฿{totalEstimate.toLocaleString('th-TH')}
                  </p>
                  {savings > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      ประหยัด ฿{savings.toLocaleString('th-TH')}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                *ราคาสุดท้ายขึ้นอยู่กับการเจรจา / ปริมาณสั่งซื้อ / โปรโมชั่น
              </p>
            </div>
          )}

          {/* Core fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">ชื่อ-นามสกุล *</Label>
              <Input value={form.customer_name} onChange={e => set('customer_name', e.target.value)} required />
            </div>
            <div>
              <Label className="text-xs">บริษัท *</Label>
              <Input value={form.customer_company} onChange={e => set('customer_company', e.target.value)} required />
            </div>
            <div>
              <Label className="text-xs">อีเมล *</Label>
              <Input type="email" value={form.customer_email} onChange={e => set('customer_email', e.target.value)} required />
            </div>
            <div>
              <Label className="text-xs">โทรศัพท์ *</Label>
              <Input value={form.customer_phone} onChange={e => set('customer_phone', e.target.value)} required />
            </div>
          </div>

          {/* Progressive disclosure toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvanced ? 'ซ่อน' : 'เพิ่ม'}ข้อมูลเพิ่มเติม (LINE, ที่อยู่, ใบกำกับภาษี)
          </button>

          {showAdvanced && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">LINE ID</Label>
                  <Input value={form.customer_line} onChange={e => set('customer_line', e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">เงื่อนไขชำระเงิน</Label>
                  <Select value={form.payment_terms} onValueChange={v => set('payment_terms', v)}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {paymentTermsOptions.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs">ปลายทางจัดส่ง</Label>
                <Input value={form.shipping_address} onChange={e => set('shipping_address', e.target.value)} placeholder="ที่อยู่จัดส่ง" />
              </div>

              {/* Tax invoice */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="tax-invoice"
                  checked={form.needs_tax_invoice}
                  onCheckedChange={v => set('needs_tax_invoice', !!v)}
                />
                <Label htmlFor="tax-invoice" className="text-xs cursor-pointer">ต้องการใบกำกับภาษี</Label>
              </div>
              {form.needs_tax_invoice && (
                <div>
                  <Label className="text-xs">เลขผู้เสียภาษี</Label>
                  <Input value={form.tax_id} onChange={e => set('tax_id', e.target.value)} />
                </div>
              )}

              <div>
                <Label className="text-xs">ข้อความเพิ่มเติม</Label>
                <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} size="lg" className="w-full text-base font-semibold">
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
            {loading ? 'กำลังส่ง...' : 'ส่งคำขอใบเสนอราคา'}
          </Button>

          {/* Alternative contacts */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground mb-3">
              หรือติดต่อทีมขายโดยตรง
            </p>
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <a
                href="tel:+6621234567"
                className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition"
              >
                <Phone className="w-4 h-4 text-primary" /> 02-123-4567
              </a>
              <a
                href="https://line.me/ti/p/@entgroup"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition"
              >
                <MessageCircle className="w-4 h-4 text-green-600" /> @entgroup
              </a>
              <a
                href="mailto:sales@entgroup.co.th"
                className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition"
              >
                <Mail className="w-4 h-4 text-blue-600" /> Email
              </a>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

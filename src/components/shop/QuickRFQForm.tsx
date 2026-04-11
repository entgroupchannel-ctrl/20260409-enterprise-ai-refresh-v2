import { useState } from 'react';
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
import { Send, Loader2, FileText } from 'lucide-react';

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

export default function QuickRFQForm({ product, defaultQuantity = 1, onSubmit }: QuickRFQFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const set = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product info */}
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

          {/* Contact */}
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {loading ? 'กำลังส่ง...' : 'ส่งคำขอใบเสนอราคา'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">⏱️ ตอบกลับภายใน 4 ชั่วโมงทำการ</p>
        </form>
      </CardContent>
    </Card>
  );
}

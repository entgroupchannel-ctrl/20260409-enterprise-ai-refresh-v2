import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Send } from 'lucide-react';

const countries = ['China', 'Taiwan', 'Japan', 'South Korea', 'USA', 'Germany', 'Thailand', 'Vietnam', 'Other'];
const businessTypes = [
  { value: 'manufacturer', label: 'ผู้ผลิต (Manufacturer)' },
  { value: 'distributor', label: 'ผู้จัดจำหน่าย (Distributor)' },
  { value: 'reseller', label: 'ตัวแทน (Reseller)' },
  { value: 'oem', label: 'OEM' },
];
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD', 'THB'];

interface FormData {
  company_name: string;
  company_name_en: string;
  business_type: string;
  registration_number: string;
  year_established: string;
  country: string;
  contact_name: string;
  contact_position: string;
  email: string;
  phone: string;
  mobile: string;
  fax: string;
  website: string;
  line_id: string;
  wechat_id: string;
  address: string;
  city: string;
  state_province: string;
  postal_code: string;
  bank_name: string;
  bank_address: string;
  bank_account_number: string;
  bank_account_name: string;
  swift_code: string;
  iban: string;
  bank_country: string;
  intermediary_bank: string;
  intermediary_swift: string;
  main_products: string;
  certifications: string;
  payment_terms: string;
  lead_time_days: string;
  minimum_order_amount: string;
  currency: string;
  notes: string;
}

const initial: FormData = {
  company_name: '', company_name_en: '', business_type: '', registration_number: '',
  year_established: '', country: 'China', contact_name: '', contact_position: '',
  email: '', phone: '', mobile: '', fax: '', website: '', line_id: '', wechat_id: '',
  address: '', city: '', state_province: '', postal_code: '',
  bank_name: '', bank_address: '', bank_account_number: '', bank_account_name: '',
  swift_code: '', iban: '', bank_country: '', intermediary_bank: '', intermediary_swift: '',
  main_products: '', certifications: '', payment_terms: '', lead_time_days: '',
  minimum_order_amount: '', currency: 'USD', notes: '',
};

interface Props {
  onSaved?: () => void;
}

export default function SupplierRegistrationForm({ onSaved }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormData>(initial);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof FormData, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const save = async (submitForApproval: boolean) => {
    if (!form.company_name.trim()) {
      toast({ title: 'กรุณากรอกชื่อบริษัท', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      company_name: form.company_name,
      company_name_en: form.company_name_en || null,
      business_type: form.business_type || null,
      registration_number: form.registration_number || null,
      year_established: form.year_established ? parseInt(form.year_established) : null,
      country: form.country || null,
      contact_name: form.contact_name || null,
      contact_position: form.contact_position || null,
      email: form.email || null,
      phone: form.phone || null,
      mobile: form.mobile || null,
      fax: form.fax || null,
      website: form.website || null,
      line_id: form.line_id || null,
      wechat_id: form.wechat_id || null,
      address: form.address || null,
      city: form.city || null,
      state_province: form.state_province || null,
      postal_code: form.postal_code || null,
      bank_name: form.bank_name || null,
      bank_address: form.bank_address || null,
      bank_account_number: form.bank_account_number || null,
      bank_account_name: form.bank_account_name || null,
      swift_code: form.swift_code || null,
      iban: form.iban || null,
      bank_country: form.bank_country || null,
      intermediary_bank: form.intermediary_bank || null,
      intermediary_swift: form.intermediary_swift || null,
      main_products: form.main_products ? form.main_products.split(',').map(s => s.trim()).filter(Boolean) : null,
      certifications: form.certifications ? form.certifications.split(',').map(s => s.trim()).filter(Boolean) : null,
      payment_terms: form.payment_terms || null,
      lead_time_days: form.lead_time_days ? parseInt(form.lead_time_days) : null,
      minimum_order_amount: form.minimum_order_amount ? parseFloat(form.minimum_order_amount) : null,
      currency: form.currency,
      notes: form.notes || null,
      status: submitForApproval ? 'pending' : 'draft',
    };
    const { error } = await supabase.from('suppliers').insert(payload as any);
    if (error) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: submitForApproval ? 'ส่งรออนุมัติแล้ว' : 'บันทึกร่างแล้ว' });
      setForm(initial);
      onSaved?.();
    }
    setSaving(false);
  };

  const Field = ({ label, k, type = 'text', placeholder = '' }: { label: string; k: keyof FormData; type?: string; placeholder?: string }) => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input type={type} placeholder={placeholder} value={form[k]} onChange={e => set(k, e.target.value)} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Company Info */}
      <Card>
        <CardHeader><CardTitle className="text-base">ข้อมูลบริษัท</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="ชื่อบริษัท *" k="company_name" />
          <Field label="ชื่อบริษัท (EN)" k="company_name_en" />
          <div className="space-y-1">
            <Label className="text-xs">ประเภทธุรกิจ</Label>
            <Select value={form.business_type} onValueChange={v => set('business_type', v)}>
              <SelectTrigger><SelectValue placeholder="เลือก..." /></SelectTrigger>
              <SelectContent>
                {businessTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Field label="เลขทะเบียนบริษัท" k="registration_number" />
          <Field label="ปีที่ก่อตั้ง" k="year_established" type="number" />
          <div className="space-y-1">
            <Label className="text-xs">ประเทศ</Label>
            <Select value={form.country} onValueChange={v => set('country', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader><CardTitle className="text-base">ผู้ติดต่อ</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="ชื่อผู้ติดต่อ" k="contact_name" />
          <Field label="ตำแหน่ง" k="contact_position" />
          <Field label="อีเมล" k="email" type="email" />
          <Field label="โทรศัพท์" k="phone" />
          <Field label="มือถือ" k="mobile" />
          <Field label="แฟกซ์" k="fax" />
          <Field label="เว็บไซต์" k="website" placeholder="https://" />
          <Field label="LINE ID" k="line_id" />
          <Field label="WeChat ID" k="wechat_id" />
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader><CardTitle className="text-base">ที่อยู่</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <Label className="text-xs">ที่อยู่</Label>
            <Textarea value={form.address} onChange={e => set('address', e.target.value)} rows={2} />
          </div>
          <Field label="เมือง / City" k="city" />
          <Field label="รัฐ / จังหวัด" k="state_province" />
          <Field label="รหัสไปรษณีย์" k="postal_code" />
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader><CardTitle className="text-base">ข้อมูลธนาคาร (สำหรับโอนเงิน)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="ชื่อธนาคาร" k="bank_name" />
          <Field label="ที่อยู่ธนาคาร" k="bank_address" />
          <Field label="เลขบัญชี" k="bank_account_number" />
          <Field label="ชื่อบัญชี" k="bank_account_name" />
          <Field label="SWIFT Code" k="swift_code" />
          <Field label="IBAN" k="iban" />
          <Field label="ประเทศธนาคาร" k="bank_country" />
          <Field label="Intermediary Bank" k="intermediary_bank" />
          <Field label="Intermediary SWIFT" k="intermediary_swift" />
        </CardContent>
      </Card>

      {/* Products & Terms */}
      <Card>
        <CardHeader><CardTitle className="text-base">สินค้าและเงื่อนไข</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">สินค้าหลัก (คั่นด้วย ,)</Label>
            <Input value={form.main_products} onChange={e => set('main_products', e.target.value)} placeholder="Industrial PC, Panel PC, Box PC" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">ใบรับรอง (คั่นด้วย ,)</Label>
            <Input value={form.certifications} onChange={e => set('certifications', e.target.value)} placeholder="ISO 9001, CE, FCC" />
          </div>
          <Field label="เงื่อนไขชำระเงิน" k="payment_terms" placeholder="T/T 30 days" />
          <Field label="Lead Time (วัน)" k="lead_time_days" type="number" />
          <Field label="ยอดสั่งซื้อขั้นต่ำ" k="minimum_order_amount" type="number" />
          <div className="space-y-1">
            <Label className="text-xs">สกุลเงิน</Label>
            <Select value={form.currency} onValueChange={v => set('currency', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 space-y-1">
            <Label className="text-xs">หมายเหตุ</Label>
            <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => save(false)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          บันทึกร่าง
        </Button>
        <Button onClick={() => save(true)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
          ส่งรออนุมัติ
        </Button>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Save } from 'lucide-react';

interface ContactFormData {
  contact_type: 'customer' | 'supplier' | 'both';
  entity_type: 'individual' | 'juristic';
  company_name: string;
  contact_code: string;
  business_location: string;
  address: string;
  postal_code: string;
  tax_id: string;
  branch_code: string;
  branch_type: 'head_office' | 'branch' | '';
  branch_name: string;
  contact_name: string;
  contact_position: string;
  email: string;
  mobile_phone: string;
  office_phone: string;
  fax: string;
  line_id: string;
  credit_days: number;
  notes: string;
  is_active: boolean;
}

const empty: ContactFormData = {
  contact_type: 'customer',
  entity_type: 'juristic',
  company_name: '',
  contact_code: '',
  business_location: '',
  address: '',
  postal_code: '',
  tax_id: '',
  branch_code: '',
  branch_type: 'head_office',
  branch_name: '',
  contact_name: '',
  contact_position: '',
  email: '',
  mobile_phone: '',
  office_phone: '',
  fax: '',
  line_id: '',
  credit_days: 0,
  notes: '',
  is_active: true,
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: any;
  onSuccess?: () => void;
}

export default function ContactFormDialog({ open, onOpenChange, contact, onSuccess }: Props) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const isEdit = !!contact;

  const [data, setData] = useState<ContactFormData>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) {
      setData({
        ...empty,
        ...contact,
        branch_type: contact.branch_type || 'head_office',
        credit_days: contact.credit_days || 0,
      });
    } else {
      setData(empty);
    }
  }, [contact, open]);

  const taxIdValid = !data.tax_id || /^\d{13}$/.test(data.tax_id.replace(/[-\s]/g, ''));

  const handleSave = async () => {
    if (!data.company_name.trim()) {
      toast({ title: 'กรุณากรอกชื่อบริษัท', variant: 'destructive' });
      return;
    }

    if (data.tax_id && !taxIdValid) {
      toast({ title: 'Tax ID ไม่ถูกต้อง', description: 'ต้องเป็น 13 หลัก', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        contact_type: data.contact_type,
        entity_type: data.entity_type,
        company_name: data.company_name,
        tax_id: data.tax_id ? data.tax_id.replace(/[-\s]/g, '') : null,
        contact_code: data.contact_code || null,
        business_location: data.business_location || null,
        address: data.address || null,
        postal_code: data.postal_code || null,
        branch_code: data.branch_code || null,
        branch_type: data.branch_type || null,
        branch_name: data.branch_type === 'branch' ? data.branch_name : null,
        contact_name: data.contact_name || null,
        contact_position: data.contact_position || null,
        email: data.email || null,
        mobile_phone: data.mobile_phone || null,
        office_phone: data.office_phone || null,
        fax: data.fax || null,
        line_id: data.line_id || null,
        credit_days: data.credit_days,
        notes: data.notes || null,
        is_active: data.is_active,
      };

      if (isEdit) {
        const { error } = await (supabase as any).from('contacts')
          .update({ ...payload, updated_by: profile?.id })
          .eq('id', contact.id);
        if (error) throw error;
        toast({ title: '✅ บันทึกการแก้ไขสำเร็จ' });
      } else {
        const { error } = await (supabase as any).from('contacts')
          .insert({
            ...payload,
            created_by: profile?.id,
            imported_from: 'manual',
          });
        if (error) throw error;
        toast({ title: '✅ เพิ่มรายชื่อใหม่สำเร็จ' });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof ContactFormData, value: any) => {
    setData({ ...data, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? '✏️ แก้ไขรายชื่อ' : '+ เพิ่มรายชื่อใหม่'}</DialogTitle>
          <DialogDescription>
            {isEdit ? data.company_name : 'กรอกข้อมูลลูกค้าหรือผู้จำหน่าย'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-2">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="basic">ข้อมูลหลัก</TabsTrigger>
            <TabsTrigger value="contact">ผู้ติดต่อ</TabsTrigger>
            <TabsTrigger value="address">ที่อยู่</TabsTrigger>
            <TabsTrigger value="business">ธุรกิจ</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>ประเภทรายชื่อ *</Label>
                <Select value={data.contact_type} onValueChange={(v: any) => update('contact_type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">ลูกค้า</SelectItem>
                    <SelectItem value="supplier">ผู้จำหน่าย</SelectItem>
                    <SelectItem value="both">ลูกค้า + ผู้จำหน่าย</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>ประเภทผู้ติดต่อ *</Label>
                <Select value={data.entity_type} onValueChange={(v: any) => update('entity_type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="juristic">นิติบุคคล</SelectItem>
                    <SelectItem value="individual">บุคคลธรรมดา</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>ชื่อ{data.entity_type === 'juristic' ? 'บริษัท' : '-นามสกุล'} *</Label>
                <Input
                  value={data.company_name}
                  onChange={(e) => update('company_name', e.target.value)}
                  placeholder={data.entity_type === 'juristic' ? 'บริษัท ABC จำกัด' : 'นาย / นาง / นางสาว'}
                />
              </div>
              <div>
                <Label>รหัสผู้ติดต่อ</Label>
                <Input
                  value={data.contact_code}
                  onChange={(e) => update('contact_code', e.target.value)}
                  placeholder="(optional)"
                />
              </div>
              <div>
                <Label>เลขประจำตัวผู้เสียภาษี (13 หลัก)</Label>
                <Input
                  value={data.tax_id}
                  onChange={(e) => update('tax_id', e.target.value.replace(/[^\d-]/g, ''))}
                  placeholder="0000000000000"
                  maxLength={17}
                  className={data.tax_id && !taxIdValid ? 'border-destructive' : ''}
                />
              </div>
              {data.entity_type === 'juristic' && (
                <div className="col-span-2">
                  <Label>สำนักงาน/สาขา</Label>
                  <div className="flex items-center gap-4 h-10">
                    <label className="flex items-center gap-2">
                      <input type="radio"
                        checked={data.branch_type === 'head_office'}
                        onChange={() => update('branch_type', 'head_office')}
                      />
                      สำนักงานใหญ่
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio"
                        checked={data.branch_type === 'branch'}
                        onChange={() => update('branch_type', 'branch')}
                      />
                      สาขา
                    </label>
                  </div>
                  {data.branch_type === 'branch' && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Input
                        value={data.branch_code}
                        onChange={(e) => update('branch_code', e.target.value)}
                        placeholder="รหัสสาขา"
                      />
                      <Input
                        value={data.branch_name}
                        onChange={(e) => update('branch_name', e.target.value)}
                        placeholder="ชื่อสาขา"
                        className="col-span-2"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>ชื่อผู้ติดต่อ</Label>
                <Input value={data.contact_name} onChange={(e) => update('contact_name', e.target.value)} />
              </div>
              <div>
                <Label>ตำแหน่ง</Label>
                <Input value={data.contact_position} onChange={(e) => update('contact_position', e.target.value)} placeholder="เช่น ผู้จัดการฝ่ายจัดซื้อ" />
              </div>
              <div>
                <Label>อีเมล</Label>
                <Input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} />
              </div>
              <div>
                <Label>LINE ID</Label>
                <Input value={data.line_id} onChange={(e) => update('line_id', e.target.value)} placeholder="@line_id" />
              </div>
              <div>
                <Label>เบอร์มือถือ</Label>
                <Input value={data.mobile_phone} onChange={(e) => update('mobile_phone', e.target.value)} />
              </div>
              <div>
                <Label>เบอร์สำนักงาน</Label>
                <Input value={data.office_phone} onChange={(e) => update('office_phone', e.target.value)} />
              </div>
              <div>
                <Label>แฟกซ์</Label>
                <Input value={data.fax} onChange={(e) => update('fax', e.target.value)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="address" className="space-y-3">
            <div>
              <Label>ที่อยู่เต็ม</Label>
              <Textarea value={data.address} onChange={(e) => update('address', e.target.value)} rows={4} placeholder="เลขที่ ซอย ถนน ตำบล อำเภอ จังหวัด" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>รหัสไปรษณีย์</Label>
                <Input value={data.postal_code} onChange={(e) => update('postal_code', e.target.value)} maxLength={5} />
              </div>
              <div>
                <Label>ที่ตั้งธุรกิจ</Label>
                <Input value={data.business_location} onChange={(e) => update('business_location', e.target.value)} placeholder="ไทย / ต่างประเทศ" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-3">
            <div>
              <Label>เครดิต (วัน)</Label>
              <Input type="number" min={0} value={data.credit_days} onChange={(e) => update('credit_days', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>หมายเหตุ (ภายใน)</Label>
              <Textarea value={data.notes} onChange={(e) => update('notes', e.target.value)} rows={3} placeholder="หมายเหตุภายใน — ลูกค้าจะไม่เห็น" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={data.is_active} onCheckedChange={(v) => update('is_active', v)} />
              <Label>เปิดใช้งาน</Label>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มรายชื่อ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

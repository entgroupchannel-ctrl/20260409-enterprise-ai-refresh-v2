import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface CustomerInfo {
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_company: string | null;
  customer_address: string | null;
  customer_tax_id: string | null;
  customer_line: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  quoteId: string;
  initialValues: CustomerInfo;
  onSaved: () => void;
}

export default function EditCustomerInfoDialog({
  open,
  onClose,
  quoteId,
  initialValues,
  onSaved,
}: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<CustomerInfo>(initialValues);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
    }
  }, [open, initialValues]);

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!values.customer_name.trim()) {
      toast({ title: 'กรุณากรอกชื่อลูกค้า', variant: 'destructive' });
      return;
    }
    if (!values.customer_email.trim()) {
      toast({ title: 'กรุณากรอกอีเมล', variant: 'destructive' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.customer_email)) {
      toast({ title: 'รูปแบบอีเมลไม่ถูกต้อง', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({
          customer_name: values.customer_name.trim(),
          customer_email: values.customer_email.trim(),
          customer_phone: values.customer_phone?.trim() || null,
          customer_company: values.customer_company?.trim() || null,
          customer_address: values.customer_address?.trim() || null,
          customer_tax_id: values.customer_tax_id?.trim() || null,
          customer_line: values.customer_line?.trim() || null,
        })
        .eq('id', quoteId);

      if (error) throw error;

      toast({ title: '✅ บันทึกสำเร็จ', description: 'อัปเดตข้อมูลลูกค้าแล้ว' });
      onSaved();
      onClose();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>✏️ แก้ไขข้อมูลลูกค้า</DialogTitle>
          <DialogDescription>อัปเดตข้อมูลลูกค้าสำหรับใบเสนอราคานี้</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="customer_name" className="text-sm">
              ชื่อ-นามสกุล <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customer_name"
              value={values.customer_name}
              onChange={(e) => handleChange('customer_name', e.target.value)}
              placeholder="สมชาย ใจดี"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customer_company" className="text-sm">บริษัท</Label>
            <Input
              id="customer_company"
              value={values.customer_company || ''}
              onChange={(e) => handleChange('customer_company', e.target.value)}
              placeholder="บริษัท ABC จำกัด"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customer_tax_id" className="text-sm">เลขประจำตัวผู้เสียภาษี</Label>
            <Input
              id="customer_tax_id"
              value={values.customer_tax_id || ''}
              onChange={(e) => handleChange('customer_tax_id', e.target.value)}
              placeholder="0105XXXXXXXXX"
              className="font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customer_address" className="text-sm">ที่อยู่</Label>
            <Textarea
              id="customer_address"
              value={values.customer_address || ''}
              onChange={(e) => handleChange('customer_address', e.target.value)}
              placeholder="เลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
              rows={3}
              className="resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="customer_email" className="text-sm">
                อีเมล <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer_email"
                type="email"
                value={values.customer_email}
                onChange={(e) => handleChange('customer_email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="customer_phone" className="text-sm">โทรศัพท์</Label>
              <Input
                id="customer_phone"
                value={values.customer_phone || ''}
                onChange={(e) => handleChange('customer_phone', e.target.value)}
                placeholder="081-XXX-XXXX"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customer_line" className="text-sm">LINE ID</Label>
            <Input
              id="customer_line"
              value={values.customer_line || ''}
              onChange={(e) => handleChange('customer_line', e.target.value)}
              placeholder="@lineid"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={saving}>ยกเลิก</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />กำลังบันทึก...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />บันทึก</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

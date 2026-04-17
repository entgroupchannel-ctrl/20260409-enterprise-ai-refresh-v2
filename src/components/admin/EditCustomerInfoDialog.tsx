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
import { Loader2, Save, Users, UserCircle, Download } from 'lucide-react';
import CustomerAutocomplete, { type ContactData } from './CustomerAutocomplete';
import { Separator } from '@/components/ui/separator';

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
  customerUserId?: string | null;
  initialValues: CustomerInfo;
  onSaved: () => void;
}

interface ProfileSnapshot {
  contact_name: string | null;
  contact_phone: string | null;
  company_name: string | null;
  company_tax_id: string | null;
  company_address: string | null;
  contact_line: string | null;
  contact_email: string | null;
  billing_address: string | null;
  billing_district: string | null;
  billing_city: string | null;
  billing_province: string | null;
  billing_postal_code: string | null;
}

function composeAddress(p: ProfileSnapshot): string {
  // Prefer billing_* (structured invoice address)
  const billingParts = [
    p.billing_address,
    p.billing_district,
    p.billing_city,
    p.billing_province,
    p.billing_postal_code,
  ].filter((s) => s && s.trim());
  const billing = billingParts.join(' ').trim();
  if (billing) return billing;
  // Fallback: free-text company_address
  return (p.company_address || '').trim();
}

export default function EditCustomerInfoDialog({
  open,
  onClose,
  quoteId,
  customerUserId,
  initialValues,
  onSaved,
}: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<CustomerInfo>(initialValues);
  const [profile, setProfile] = useState<ProfileSnapshot | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Only reset when dialog opens (not when parent re-renders initialValues)
  useEffect(() => {
    if (open) {
      setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Load customer's saved profile (billing address etc.) when dialog opens
  useEffect(() => {
    if (!open || !customerUserId) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    setLoadingProfile(true);
    (async () => {
      const { data } = await (supabase as any)
        .from('user_profiles')
        .select('contact_name, contact_phone, company_name, company_tax_id, company_address, contact_line, contact_email, billing_address, billing_district, billing_city, billing_province, billing_postal_code')
        .eq('user_id', customerUserId)
        .maybeSingle();
      if (!cancelled) {
        setProfile(data || null);
        setLoadingProfile(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, customerUserId]);

  const profileAddress = profile ? composeAddress(profile) : '';
  const hasNewerAddress = !!profileAddress && profileAddress !== (values.customer_address || '').trim();

  const handlePullFromProfile = () => {
    if (!profile) return;
    setValues((prev) => ({
      customer_name: profile.contact_name || prev.customer_name,
      customer_email: profile.contact_email || prev.customer_email,
      customer_phone: profile.contact_phone || prev.customer_phone,
      customer_company: profile.company_name || prev.customer_company,
      customer_address: profileAddress || prev.customer_address,
      customer_tax_id: profile.company_tax_id || prev.customer_tax_id,
      customer_line: profile.contact_line || prev.customer_line,
    }));
    toast({ title: '✅ ดึงจากโปรไฟล์ลูกค้าแล้ว', description: profile.company_name || profile.contact_name || '' });
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectContact = (c: ContactData) => {
    setValues({
      customer_name: c.contact_name || c.company_name,
      customer_email: c.email || '',
      customer_phone: c.mobile_phone || c.office_phone || null,
      customer_company: c.company_name || null,
      customer_address: c.address || null,
      customer_tax_id: c.tax_id || null,
      customer_line: c.line_id || null,
    });
    toast({ title: '✅ ดึงข้อมูลแล้ว', description: c.company_name });
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
          {customerUserId && (
            <div className="space-y-2 rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <UserCircle className="w-3.5 h-3.5" /> โปรไฟล์ลูกค้าที่บันทึกในระบบ
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={handlePullFromProfile}
                  disabled={loadingProfile || !profile}
                >
                  {loadingProfile ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3 mr-1" />
                  )}
                  ดึงข้อมูลจากโปรไฟล์
                </Button>
              </div>
              {loadingProfile ? (
                <p className="text-[11px] text-muted-foreground">กำลังโหลดโปรไฟล์...</p>
              ) : profile ? (
                <div className="text-[11px] text-muted-foreground space-y-0.5">
                  {profile.company_name && <div>🏢 {profile.company_name}</div>}
                  {profileAddress ? (
                    <div>📍 {profileAddress}</div>
                  ) : (
                    <div className="italic">ลูกค้ายังไม่ได้บันทึกที่อยู่ในโปรไฟล์</div>
                  )}
                  {hasNewerAddress && (
                    <div className="mt-1.5 rounded bg-amber-500/10 border border-amber-500/30 px-2 py-1 text-amber-700 dark:text-amber-400">
                      ⚠️ ที่อยู่ในโปรไฟล์ลูกค้าต่างจากในใบเสนอราคา — กด "ดึงข้อมูลจากโปรไฟล์" เพื่ออัปเดต
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground italic">ลูกค้ายังไม่ได้สร้างโปรไฟล์</p>
              )}
            </div>
          )}

          <div className="space-y-1.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
            <Label className="text-xs flex items-center gap-1.5 text-primary">
              <Users className="w-3.5 h-3.5" /> ดึงจากรายชื่อลูกค้าในระบบ (Contacts)
            </Label>
            <CustomerAutocomplete onSelect={handleSelectContact} typeFilter="customer" />
            <p className="text-[11px] text-muted-foreground">
              ค้นหาด้วยชื่อบริษัท / ผู้ติดต่อ / Tax ID / อีเมล หรือคลิกเพื่อดูทั้งหมด — ระบบจะกรอกฟอร์มให้อัตโนมัติ
            </p>
          </div>

          <Separator />

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

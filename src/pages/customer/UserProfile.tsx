import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Building, MapPin, Truck, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';

interface ProfileData {
  company_name: string;
  company_tax_id: string;
  company_address: string;
  company_phone: string;
  contact_name: string;
  contact_position: string;
  contact_phone: string;
  contact_email: string;
  contact_line: string;
  billing_address: string;
  billing_district: string;
  billing_city: string;
  billing_province: string;
  billing_postal_code: string;
  billing_country: string;
  shipping_same_as_billing: boolean;
  shipping_address: string;
  shipping_district: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  shipping_country: string;
  payment_terms: string;
  delivery_method: string;
  notes: string;
}

const emptyProfile: ProfileData = {
  company_name: '', company_tax_id: '', company_address: '', company_phone: '',
  contact_name: '', contact_position: '', contact_phone: '', contact_email: '', contact_line: '',
  billing_address: '', billing_district: '', billing_city: '', billing_province: '', billing_postal_code: '', billing_country: 'ไทย',
  shipping_same_as_billing: true,
  shipping_address: '', shipping_district: '', shipping_city: '', shipping_province: '', shipping_postal_code: '', shipping_country: 'ไทย',
  payment_terms: '', delivery_method: '', notes: '',
};

export default function UserProfile() {
  const { user, profile: authProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await (supabase.from as any)('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setForm(prev => {
          const merged = { ...prev };
          Object.keys(prev).forEach(k => {
            if (data[k] !== undefined && data[k] !== null) (merged as any)[k] = data[k];
          });
          return merged;
        });
      } else {
        // Pre-fill from auth profile
        setForm(prev => ({
          ...prev,
          contact_name: authProfile?.full_name || '',
          contact_email: user.email || '',
          contact_phone: authProfile?.phone || '',
          company_name: authProfile?.company || '',
        }));
      }
      setLoading(false);
    })();
  }, [user, authProfile]);

  const update = (field: keyof ProfileData, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await (supabase.from as any)('user_profiles')
        .upsert({ user_id: user.id, ...form, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
        .select()
        .single();
      if (error) throw error;
      toast({ title: 'บันทึกสำเร็จ' });
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const Field = ({ label, field, type = 'text', placeholder = '' }: { label: string; field: keyof ProfileData; type?: string; placeholder?: string }) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={(form[field] as string) || ''} onChange={e => update(field, e.target.value)} placeholder={placeholder} />
    </div>
  );

  return (
    <>
      <SEOHead title="โปรไฟล์ของฉัน | ENT Group" description="จัดการข้อมูลบริษัทและที่อยู่" />
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} className="mr-1" /> กลับ
            </Button>
            <h1 className="text-2xl font-bold">โปรไฟล์ของฉัน</h1>
          </div>

          <Tabs defaultValue="company">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="company" className="text-xs"><Building size={14} className="mr-1" /> บริษัท</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs"><User size={14} className="mr-1" /> ผู้ติดต่อ</TabsTrigger>
              <TabsTrigger value="billing" className="text-xs"><MapPin size={14} className="mr-1" /> ที่อยู่</TabsTrigger>
              <TabsTrigger value="shipping" className="text-xs"><Truck size={14} className="mr-1" /> จัดส่ง</TabsTrigger>
            </TabsList>

            <TabsContent value="company">
              <Card>
                <CardHeader><CardTitle className="text-lg">ข้อมูลบริษัท</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="ชื่อบริษัท *" field="company_name" placeholder="บริษัท ABC จำกัด" />
                    <Field label="เลขผู้เสียภาษี" field="company_tax_id" placeholder="0105XXXXXXXXX" />
                  </div>
                  <Field label="ที่อยู่บริษัท" field="company_address" placeholder="123 ถ.สุขุมวิท..." />
                  <Field label="โทรศัพท์บริษัท" field="company_phone" placeholder="02-XXX-XXXX" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader><CardTitle className="text-lg">ข้อมูลผู้ติดต่อ</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="ชื่อ-นามสกุล" field="contact_name" placeholder="สมชาย ใจดี" />
                    <Field label="ตำแหน่ง" field="contact_position" placeholder="ผู้จัดการฝ่ายจัดซื้อ" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="โทรศัพท์" field="contact_phone" placeholder="081-XXX-XXXX" />
                    <Field label="อีเมล" field="contact_email" type="email" placeholder="example@email.com" />
                    <Field label="LINE ID" field="contact_line" placeholder="@lineid" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader><CardTitle className="text-lg">ที่อยู่สำหรับออกใบกำกับภาษี</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Field label="ที่อยู่" field="billing_address" placeholder="123 ถ.สุขุมวิท..." />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Field label="แขวง/ตำบล" field="billing_district" />
                    <Field label="เขต/อำเภอ" field="billing_city" />
                    <Field label="จังหวัด" field="billing_province" />
                    <Field label="รหัสไปรษณีย์" field="billing_postal_code" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    ที่อยู่จัดส่ง
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-normal">เหมือนที่อยู่ออกบิล</Label>
                      <Switch checked={form.shipping_same_as_billing} onCheckedChange={v => update('shipping_same_as_billing', v)} />
                    </div>
                  </CardTitle>
                </CardHeader>
                {!form.shipping_same_as_billing && (
                  <CardContent className="space-y-4">
                    <Field label="ที่อยู่จัดส่ง" field="shipping_address" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Field label="แขวง/ตำบล" field="shipping_district" />
                      <Field label="เขต/อำเภอ" field="shipping_city" />
                      <Field label="จังหวัด" field="shipping_province" />
                      <Field label="รหัสไปรษณีย์" field="shipping_postal_code" />
                    </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => navigate(-1)}>ยกเลิก</Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save size={16} className="mr-2" />
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

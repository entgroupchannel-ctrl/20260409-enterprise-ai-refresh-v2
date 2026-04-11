import { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Building2, Globe, FileText, Banknote, ImageIcon, Save,
  Upload, AlertCircle, Loader2
} from 'lucide-react';

interface CompanySettings {
  id: string;
  name_th: string;
  address_th: string | null;
  name_en: string | null;
  address_en: string | null;
  tax_id: string | null;
  vat_registered: boolean;
  branch_type: 'head_office' | 'branch';
  branch_code: string | null;
  branch_name: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  website: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  bank_branch: string | null;
  promptpay_id: string | null;
  logo_url: string | null;
  letterhead_url: string | null;
  default_payment_terms: string | null;
  default_delivery_terms: string | null;
  default_warranty_terms: string | null;
  default_quote_validity_days: number;
  default_vat_percent: number;
}

export default function AdminCompanySettings() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  const isSuperAdmin = profile?.role === 'admin';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any).from('company_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings || !isSuperAdmin) return;

    setSaving(true);
    try {
      const { error } = await (supabase as any).from('company_settings')
        .update({ ...settings, updated_by: profile?.id })
        .eq('id', settings.id);

      if (error) throw error;

      toast({ title: '✅ บันทึกสำเร็จ', description: 'ข้อมูลบริษัทถูกอัปเดตแล้ว' });
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!settings) return;

    setUploadingLogo(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(fileName);

      setSettings({ ...settings, logo_url: publicUrl });
      toast({ title: '✅ อัปโหลด Logo สำเร็จ' });
    } catch (e: any) {
      toast({ title: 'อัปโหลดไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const update = (field: keyof CompanySettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p>ไม่พบข้อมูลบริษัท</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              ข้อมูลบริษัท
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              ข้อมูลที่จะแสดงบนใบเสนอราคา ใบกำกับภาษี และเอกสารทั้งหมด
            </p>
          </div>

          {isSuperAdmin && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              บันทึก
            </Button>
          )}
        </div>

        {!isSuperAdmin && (
          <Card className="border-amber-300 bg-amber-50 dark:bg-amber-900/10">
            <CardContent className="p-3 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>เฉพาะ Super Admin เท่านั้นที่สามารถแก้ไขข้อมูลนี้ได้</span>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="general">
          <TabsList className="w-full justify-start flex-wrap">
            <TabsTrigger value="general">
              <Building2 className="w-4 h-4 mr-1.5" />
              ข้อมูลทั่วไป
            </TabsTrigger>
            <TabsTrigger value="english">
              <Globe className="w-4 h-4 mr-1.5" />
              English Info
            </TabsTrigger>
            <TabsTrigger value="banking">
              <Banknote className="w-4 h-4 mr-1.5" />
              ธนาคาร
            </TabsTrigger>
            <TabsTrigger value="branding">
              <ImageIcon className="w-4 h-4 mr-1.5" />
              Logo & Branding
            </TabsTrigger>
            <TabsTrigger value="defaults">
              <FileText className="w-4 h-4 mr-1.5" />
              ค่าเริ่มต้นเอกสาร
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: General Info */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ข้อมูลธุรกิจ (ภาษาไทย)</CardTitle>
                <CardDescription>ใช้สำหรับการออกเอกสารภาษาไทย</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>ชื่อธุรกิจ *</Label>
                  <Input
                    value={settings.name_th}
                    onChange={(e) => update('name_th', e.target.value)}
                    disabled={!isSuperAdmin}
                  />
                </div>

                <div>
                  <Label>ที่อยู่</Label>
                  <Textarea
                    value={settings.address_th || ''}
                    onChange={(e) => update('address_th', e.target.value)}
                    disabled={!isSuperAdmin}
                    rows={3}
                    placeholder="เลขที่ 70/5 หมู่บ้าน เมโทร บิซทาวน์..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>เลขประจำตัวผู้เสียภาษี</Label>
                    <Input
                      value={settings.tax_id || ''}
                      onChange={(e) => update('tax_id', e.target.value)}
                      disabled={!isSuperAdmin}
                      placeholder="0135558013167"
                    />
                  </div>

                  <div>
                    <Label>สถานะ VAT</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Switch
                        checked={settings.vat_registered}
                        onCheckedChange={(v) => update('vat_registered', v)}
                        disabled={!isSuperAdmin}
                      />
                      <span className="text-sm">
                        {settings.vat_registered ? 'จดทะเบียน VAT แล้ว' : 'ยังไม่จด VAT'}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>สำนักงาน/สาขา</Label>
                    <div className="flex items-center gap-4 h-10">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={settings.branch_type === 'head_office'}
                          onChange={() => update('branch_type', 'head_office')}
                          disabled={!isSuperAdmin}
                        />
                        สำนักงานใหญ่
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          checked={settings.branch_type === 'branch'}
                          onChange={() => update('branch_type', 'branch')}
                          disabled={!isSuperAdmin}
                        />
                        สาขา
                      </label>
                    </div>
                  </div>

                  {settings.branch_type === 'branch' && (
                    <>
                      <div>
                        <Label>รหัสสาขา</Label>
                        <Input
                          value={settings.branch_code || ''}
                          onChange={(e) => update('branch_code', e.target.value)}
                          disabled={!isSuperAdmin}
                          placeholder="00001"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>ชื่อสาขา</Label>
                        <Input
                          value={settings.branch_name || ''}
                          onChange={(e) => update('branch_name', e.target.value)}
                          disabled={!isSuperAdmin}
                        />
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>เบอร์โทรศัพท์</Label>
                    <Input
                      value={settings.phone || ''}
                      onChange={(e) => update('phone', e.target.value)}
                      disabled={!isSuperAdmin}
                    />
                  </div>
                  <div>
                    <Label>แฟกซ์</Label>
                    <Input
                      value={settings.fax || ''}
                      onChange={(e) => update('fax', e.target.value)}
                      disabled={!isSuperAdmin}
                    />
                  </div>
                  <div>
                    <Label>อีเมล</Label>
                    <Input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => update('email', e.target.value)}
                      disabled={!isSuperAdmin}
                    />
                  </div>
                  <div>
                    <Label>เว็บไซต์</Label>
                    <Input
                      value={settings.website || ''}
                      onChange={(e) => update('website', e.target.value)}
                      disabled={!isSuperAdmin}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: English Info */}
          <TabsContent value="english">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">English Information</CardTitle>
                <CardDescription>For international customers and English documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Business Name (English)</Label>
                  <Input
                    value={settings.name_en || ''}
                    onChange={(e) => update('name_en', e.target.value)}
                    disabled={!isSuperAdmin}
                    placeholder="ENT Group Co., Ltd."
                  />
                </div>
                <div>
                  <Label>Address (English)</Label>
                  <Textarea
                    value={settings.address_en || ''}
                    onChange={(e) => update('address_en', e.target.value)}
                    disabled={!isSuperAdmin}
                    rows={3}
                    placeholder="70/5 Metro Biz Town Chaengwattana 2..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Banking */}
          <TabsContent value="banking">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ข้อมูลธนาคาร</CardTitle>
                <CardDescription>สำหรับแสดงบนใบเสนอราคาและใบแจ้งหนี้</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>ธนาคาร</Label>
                    <Input
                      value={settings.bank_name || ''}
                      onChange={(e) => update('bank_name', e.target.value)}
                      disabled={!isSuperAdmin}
                      placeholder="ธนาคารกสิกรไทย"
                    />
                  </div>
                  <div>
                    <Label>สาขา</Label>
                    <Input
                      value={settings.bank_branch || ''}
                      onChange={(e) => update('bank_branch', e.target.value)}
                      disabled={!isSuperAdmin}
                    />
                  </div>
                  <div>
                    <Label>เลขที่บัญชี</Label>
                    <Input
                      value={settings.bank_account_number || ''}
                      onChange={(e) => update('bank_account_number', e.target.value)}
                      disabled={!isSuperAdmin}
                      placeholder="xxx-x-xxxxx-x"
                    />
                  </div>
                  <div>
                    <Label>ชื่อบัญชี</Label>
                    <Input
                      value={settings.bank_account_name || ''}
                      onChange={(e) => update('bank_account_name', e.target.value)}
                      disabled={!isSuperAdmin}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>PromptPay ID</Label>
                    <Input
                      value={settings.promptpay_id || ''}
                      onChange={(e) => update('promptpay_id', e.target.value)}
                      disabled={!isSuperAdmin}
                      placeholder="0xxxxxxxxx หรือ Tax ID"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: Branding */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Logo และ Branding</CardTitle>
                <CardDescription>ภาพที่ใช้บนเอกสารและเว็บไซต์</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Logo บริษัท</Label>
                  <div className="mt-2 flex items-start gap-4">
                    {settings.logo_url ? (
                      <img
                        src={settings.logo_url}
                        alt="Logo"
                        className="w-32 h-32 object-contain border rounded-lg bg-white p-2"
                      />
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}

                    {isSuperAdmin && (
                      <div className="space-y-2">
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/png,image/jpeg,image/svg+xml,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLogoUpload(file);
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                          disabled={uploadingLogo}
                        >
                          {uploadingLogo ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          อัปโหลด Logo
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPEG, SVG, WebP (max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: Document Defaults */}
          <TabsContent value="defaults">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ค่าเริ่มต้นเอกสาร</CardTitle>
                <CardDescription>ค่าเริ่มต้นที่จะใช้เมื่อสร้างเอกสารใหม่</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>VAT % เริ่มต้น</Label>
                    <Input
                      type="number"
                      value={settings.default_vat_percent}
                      onChange={(e) => update('default_vat_percent', parseFloat(e.target.value) || 0)}
                      disabled={!isSuperAdmin}
                    />
                  </div>
                  <div>
                    <Label>อายุใบเสนอราคา (วัน)</Label>
                    <Input
                      type="number"
                      value={settings.default_quote_validity_days}
                      onChange={(e) => update('default_quote_validity_days', parseInt(e.target.value) || 30)}
                      disabled={!isSuperAdmin}
                    />
                  </div>
                </div>
                <div>
                  <Label>เงื่อนไขการชำระเงิน (ค่าเริ่มต้น)</Label>
                  <Textarea
                    value={settings.default_payment_terms || ''}
                    onChange={(e) => update('default_payment_terms', e.target.value)}
                    disabled={!isSuperAdmin}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>เงื่อนไขการจัดส่ง (ค่าเริ่มต้น)</Label>
                  <Textarea
                    value={settings.default_delivery_terms || ''}
                    onChange={(e) => update('default_delivery_terms', e.target.value)}
                    disabled={!isSuperAdmin}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>เงื่อนไขการรับประกัน (ค่าเริ่มต้น)</Label>
                  <Textarea
                    value={settings.default_warranty_terms || ''}
                    onChange={(e) => update('default_warranty_terms', e.target.value)}
                    disabled={!isSuperAdmin}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

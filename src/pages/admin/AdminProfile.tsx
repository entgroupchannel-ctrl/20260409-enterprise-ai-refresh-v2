import { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  User, FileSignature, ImageIcon, KeyRound, Save, Upload,
  Loader2, AlertCircle
} from 'lucide-react';

interface ProfileData {
  full_name: string;
  email: string;
  phone: string | null;
  position: string | null;
  department: string | null;
  employee_code: string | null;
  line_id: string | null;
  bio: string | null;
  avatar_url: string | null;
  signature_url: string | null;
  show_signature_on_quotes: boolean;
  show_signature_on_orders: boolean;
}

export default function AdminProfile() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [data, setData] = useState<ProfileData | null>(null);
  const [passwords, setPasswords] = useState({ current: '', new_password: '', confirm: '' });
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (user?.id) loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data: row, error } = await (supabase as any).from('users')
        .select('full_name, email, phone, position, department, employee_code, line_id, bio, avatar_url, signature_url, show_signature_on_quotes, show_signature_on_orders')
        .eq('id', user!.id)
        .maybeSingle();

      if (error) throw error;
      setData(row || {
        full_name: '', email: user!.email || '', phone: null, position: null,
        department: null, employee_code: null, line_id: null, bio: null,
        avatar_url: null, signature_url: null,
        show_signature_on_quotes: true, show_signature_on_orders: true,
      });
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data || !user) return;
    setSaving(true);
    try {
      const { error } = await (supabase as any).from('users')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          position: data.position,
          department: data.department,
          employee_code: data.employee_code,
          line_id: data.line_id,
          bio: data.bio,
          avatar_url: data.avatar_url,
          signature_url: data.signature_url,
          show_signature_on_quotes: data.show_signature_on_quotes,
          show_signature_on_orders: data.show_signature_on_orders,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast({ title: '✅ บันทึกสำเร็จ' });
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSignatureUpload = async (file: File) => {
    if (!user || !data) return;
    setUploadingSig(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}/signature-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from('signatures')
        .upload(fileName, file, { upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('signatures')
        .getPublicUrl(fileName);

      setData({ ...data, signature_url: publicUrl });
      toast({ title: '✅ อัปโหลดลายเซ็นสำเร็จ' });
    } catch (e: any) {
      toast({ title: 'อัปโหลดไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setUploadingSig(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user || !data) return;
    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setData({ ...data, avatar_url: publicUrl });
      toast({ title: '✅ อัปโหลดรูปโปรไฟล์สำเร็จ' });
    } catch (e: any) {
      toast({ title: 'อัปโหลดไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new_password !== passwords.confirm) {
      toast({ title: 'รหัสผ่านไม่ตรงกัน', variant: 'destructive' });
      return;
    }
    if (passwords.new_password.length < 6) {
      toast({ title: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', variant: 'destructive' });
      return;
    }
    setChangingPw(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new_password });
      if (error) throw error;
      toast({ title: '✅ เปลี่ยนรหัสผ่านสำเร็จ' });
      setPasswords({ current: '', new_password: '', confirm: '' });
    } catch (e: any) {
      toast({ title: 'เปลี่ยนรหัสผ่านไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setChangingPw(false);
    }
  };

  const update = (field: keyof ProfileData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
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

  if (!data) {
    return (
      <AdminLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p>ไม่พบข้อมูลโปรไฟล์</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              ข้อมูลส่วนตัว
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              จัดการข้อมูลส่วนตัว ลายเซ็น และรหัสผ่าน
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            บันทึก
          </Button>
        </div>

        <Tabs defaultValue="personal">
          <TabsList className="w-full justify-start flex-wrap">
            <TabsTrigger value="personal">
              <User className="w-4 h-4 mr-1.5" />
              ข้อมูลส่วนตัว
            </TabsTrigger>
            <TabsTrigger value="signature">
              <FileSignature className="w-4 h-4 mr-1.5" />
              ลายเซ็น
            </TabsTrigger>
            <TabsTrigger value="avatar">
              <ImageIcon className="w-4 h-4 mr-1.5" />
              Avatar
            </TabsTrigger>
            <TabsTrigger value="password">
              <KeyRound className="w-4 h-4 mr-1.5" />
              เปลี่ยนรหัสผ่าน
            </TabsTrigger>
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ข้อมูลทั่วไป</CardTitle>
                <CardDescription>ข้อมูลที่ใช้แสดงบนเอกสารและระบบ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>ชื่อ-นามสกุล</Label>
                    <Input value={data.full_name || ''} onChange={(e) => update('full_name', e.target.value)} />
                  </div>
                  <div>
                    <Label>อีเมล</Label>
                    <Input value={data.email} disabled className="bg-muted" />
                  </div>
                  <div>
                    <Label>เบอร์โทร</Label>
                    <Input value={data.phone || ''} onChange={(e) => update('phone', e.target.value)} />
                  </div>
                  <div>
                    <Label>LINE ID</Label>
                    <Input value={data.line_id || ''} onChange={(e) => update('line_id', e.target.value)} />
                  </div>
                  <div>
                    <Label>ตำแหน่ง</Label>
                    <Input value={data.position || ''} onChange={(e) => update('position', e.target.value)} placeholder="เช่น Sales Manager" />
                  </div>
                  <div>
                    <Label>แผนก</Label>
                    <Input value={data.department || ''} onChange={(e) => update('department', e.target.value)} />
                  </div>
                  <div>
                    <Label>รหัสพนักงาน</Label>
                    <Input value={data.employee_code || ''} onChange={(e) => update('employee_code', e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signature */}
          <TabsContent value="signature">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ลายเซ็นอิเล็กทรอนิกส์</CardTitle>
                <CardDescription>ลายเซ็นที่จะแสดงบนใบเสนอราคาและเอกสาร</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>ลายเซ็นปัจจุบัน</Label>
                  {data.signature_url ? (
                    <div className="border rounded-lg bg-white p-4 mt-2">
                      <img
                        src={data.signature_url}
                        alt="Signature"
                        className="max-h-32 mx-auto"
                       loading="lazy" decoding="async"/>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        ขนาดที่แนะนำ: 400×140 px (PNG พื้นหลังโปร่งใส)
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground mt-2">
                      <FileSignature className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">ยังไม่มีลายเซ็น</p>
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="file"
                    id="sig-upload"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleSignatureUpload(file);
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('sig-upload')?.click()}
                    disabled={uploadingSig}
                  >
                    {uploadingSig ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    อัปโหลดลายเซ็นใหม่
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPEG, WebP (max 1MB)</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={data.show_signature_on_quotes}
                      onCheckedChange={(v) => update('show_signature_on_quotes', v)}
                    />
                    <Label className="text-sm">แสดงลายเซ็นบนใบเสนอราคา</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={data.show_signature_on_orders}
                      onCheckedChange={(v) => update('show_signature_on_orders', v)}
                    />
                    <Label className="text-sm">แสดงลายเซ็นบน Sale Order</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avatar */}
          <TabsContent value="avatar">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">รูปโปรไฟล์</CardTitle>
                <CardDescription>รูปที่ใช้แสดงในระบบ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  {data.avatar_url ? (
                    <img
                      src={data.avatar_url}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border"
                     loading="lazy" decoding="async"/>
                  ) : (
                    <div className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center text-muted-foreground">
                      <User className="w-8 h-8" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={uploadingAvatar}
                    >
                      {uploadingAvatar ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      อัปโหลดรูปใหม่
                    </Button>
                    <p className="text-xs text-muted-foreground">PNG, JPEG, WebP (max 2MB)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">เปลี่ยนรหัสผ่าน</CardTitle>
                <CardDescription>ตั้งรหัสผ่านใหม่สำหรับบัญชีนี้</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div>
                  <Label>รหัสผ่านใหม่</Label>
                  <Input
                    type="password"
                    value={passwords.new_password}
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                  />
                </div>
                <div>
                  <Label>ยืนยันรหัสผ่านใหม่</Label>
                  <Input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>
                <Button onClick={handleChangePassword} disabled={changingPw || !passwords.new_password}>
                  {changingPw ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <KeyRound className="w-4 h-4 mr-2" />}
                  เปลี่ยนรหัสผ่าน
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

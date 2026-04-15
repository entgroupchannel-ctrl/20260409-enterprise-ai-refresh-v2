import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, UserPlus, Save, Loader2, Info,
} from 'lucide-react';
import { ROLE_DESCRIPTIONS, type UserRole } from '@/types/auth';

export default function AdminEmployeeNew() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<string>('sales');

  const isSuperAdmin = profile?.role === 'super_admin';

  if (!isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">เฉพาะ super_admin เท่านั้น</p>
              <Button className="mt-4" onClick={() => navigate('/admin/employees')}>
                กลับ
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const handleCreate = async () => {
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      toast({ 
        title: 'กรุณากรอกข้อมูลให้ครบ', 
        description: 'อีเมล รหัสผ่าน และชื่อ',
        variant: 'destructive' 
      });
      return;
    }
    
    if (password.length < 8) {
      toast({ 
        title: 'รหัสผ่านสั้นเกินไป', 
        description: 'ต้องมีอย่างน้อย 8 ตัวอักษร',
        variant: 'destructive' 
      });
      return;
    }
    
    setSaving(true);
    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim() || null,
          },
        },
      });
      
      if (authErr) throw authErr;
      if (!authData.user) throw new Error('ไม่สามารถสร้างบัญชีได้');
      
      // Update role (signup creates as 'member' by default)
      if (role !== 'member') {
        const { error: roleErr } = await (supabase as any)
          .from('users')
          .update({ role })
          .eq('id', authData.user.id);
        
        if (roleErr) throw roleErr;
      }
      
      // Phase 8.0: Create staff_details row (non-fatal if fails)
      if (role !== 'member') {
        try {
          await (supabase as any)
            .from('staff_details')
            .insert({ user_id: authData.user.id });
        } catch (detailsErr) {
          console.warn('Failed to create staff_details:', detailsErr);
        }
      }
      
      toast({
        title: '✅ สร้างบัญชีสำเร็จ',
        description: `${email} — role: ${role}`,
      });
      
      navigate(`/admin/employees/${authData.user.id}`);
    } catch (e: any) {
      toast({
        title: 'สร้างบัญชีไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/employees')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับ
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              เพิ่มพนักงานใหม่
            </h1>
            <p className="text-xs text-muted-foreground">
              สร้างบัญชีพนักงานพร้อม role
            </p>
          </div>
        </div>

        {/* Info */}
        <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="pt-4 pb-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <p>• บัญชีจะใช้งานได้หลังยืนยันอีเมล (Supabase ส่งลิงก์ไปที่อีเมล)</p>
              <p>• รหัสผ่านชั่วคราวจะต้องเปลี่ยนในการเข้าสู่ระบบครั้งแรก</p>
              <p>• สามารถแก้ไข role ได้ภายหลังในหน้ารายละเอียด</p>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ข้อมูลบัญชี</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">อีเมล *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employee@company.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password">รหัสผ่านชั่วคราว *</Label>
              <Input
                id="password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 8 ตัวอักษร"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                ต้องส่งให้พนักงานเพื่อเข้าสู่ระบบครั้งแรก
              </p>
            </div>
            
            <div>
              <Label htmlFor="full_name">ชื่อ-นามสกุล *</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ชื่อจริง นามสกุล"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">เบอร์โทร</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812345678"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>บทบาท *</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="member">Member (ลูกค้า)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {ROLE_DESCRIPTIONS[role as UserRole]}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/employees')}>
            ยกเลิก
          </Button>
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> กำลังสร้าง...</>
            ) : (
              <><Save className="w-4 h-4 mr-1.5" /> สร้างบัญชี</>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

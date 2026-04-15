import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, User, Shield, Activity, Save, Lock, Mail,
  Loader2, Clock, AlertTriangle,
} from 'lucide-react';
import { ROLE_LABELS, ROLE_COLORS, ROLE_DESCRIPTIONS, type UserRole } from '@/types/auth';
import PermissionMatrix from '@/components/admin/PermissionMatrix';
import ActivityTimeline from '@/components/admin/ActivityTimeline';

interface Employee {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export default function AdminEmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState(true);

  const isSuperAdmin = profile?.role === 'super_admin';
  const isSelf = profile?.id === id;

  useEffect(() => {
    if (id) loadEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEmployee = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('staff_members')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) {
        toast({ title: 'ไม่พบพนักงาน', variant: 'destructive' });
        navigate('/admin/employees');
        return;
      }
      
      setEmployee(data as Employee);
      setFullName(data.full_name || '');
      setPhone(data.phone || '');
      setRole(data.role);
      setIsActive(data.is_active);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !employee) return;
    if (!isSuperAdmin && !isSelf) {
      toast({ title: 'ไม่มีสิทธิ์', variant: 'destructive' });
      return;
    }
    
    setSaving(true);
    try {
      const updates: any = {
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
      };
      
      if (isSuperAdmin) {
        updates.role = role;
        updates.is_active = isActive;
      }
      
      const { error } = await (supabase as any)
        .from('users')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({ title: '✅ บันทึกแล้ว' });
      await loadEmployee();
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return 'ไม่เคย';
    return new Date(iso).toLocaleString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!employee) return null;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/employees')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              กลับ
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                {employee.full_name || '(ไม่มีชื่อ)'}
              </h1>
              <p className="text-xs text-muted-foreground">{employee.email}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={ROLE_COLORS[employee.role as UserRole] || 'bg-gray-100'}
          >
            {ROLE_LABELS[employee.role as UserRole] || employee.role}
          </Badge>
        </div>

        {isSelf && (
          <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                คุณกำลังดูข้อมูลของตนเอง — สามารถแก้ไขชื่อและเบอร์โทรได้
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-1.5" />
              โปรไฟล์
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Shield className="w-4 h-4 mr-1.5" />
              สิทธิ์
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="w-4 h-4 mr-1.5" />
              กิจกรรม
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">ข้อมูลส่วนตัว</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>อีเมล</Label>
                    <div className="flex items-center gap-2 mt-1 p-2 rounded bg-muted/30 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {employee.email}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="full_name">ชื่อ-นามสกุล</Label>
                    <Input
                      id="full_name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isSuperAdmin && !isSelf}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">เบอร์โทร</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isSuperAdmin && !isSelf}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Last login</Label>
                    <div className="flex items-center gap-2 mt-1 p-2 rounded bg-muted/30 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {formatDate(employee.last_login)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Role & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  บทบาทและสถานะ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isSuperAdmin && (
                  <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      เฉพาะ super_admin เท่านั้นที่แก้ไข role ได้
                    </p>
                  </div>
                )}
                
                <div>
                  <Label>บทบาท</Label>
                  <Select value={role} onValueChange={setRole} disabled={!isSuperAdmin}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ROLE_DESCRIPTIONS[role as UserRole]}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>สถานะบัญชี</Label>
                    <p className="text-xs text-muted-foreground">
                      ปิดใช้งาน = ไม่สามารถเข้าสู่ระบบได้
                    </p>
                  </div>
                  <Switch 
                    checked={isActive} 
                    onCheckedChange={setIsActive}
                    disabled={!isSuperAdmin || isSelf}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Save button */}
            {(isSuperAdmin || isSelf) && (
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> กำลังบันทึก...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-1.5" /> บันทึก</>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <PermissionMatrix
              userId={employee.id}
              userName={employee.full_name || employee.email}
              readOnly={!isSuperAdmin}
              onUpdate={loadEmployee}
            />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <ActivityTimeline userId={employee.id} limit={30} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

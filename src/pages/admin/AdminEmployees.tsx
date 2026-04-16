import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Users, Search, Plus, Lock, Eye, UserCog,
  Clock, Mail, Loader2, Shield,
} from 'lucide-react';
import { ROLE_LABELS, ROLE_COLORS, type UserRole } from '@/types/auth';

interface Employee {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export default function AdminEmployees() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const isSuperAdmin = profile?.role === 'super_admin';

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('staff_members')
        .select('id, email, full_name, phone, role, is_active, last_login, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setEmployees((data as Employee[]) || []);
    } catch (e: any) {
      toast({
        title: 'โหลดข้อมูลไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!isSuperAdmin) {
      toast({
        title: 'ไม่มีสิทธิ์',
        description: 'เฉพาะ super_admin เท่านั้นที่สามารถเปลี่ยน role ได้',
        variant: 'destructive',
      });
      return;
    }

    const oldRole = employees.find(e => e.id === userId)?.role;
    
    try {
      const { error } = await (supabase as any)
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;

      // Create staff_details when promoting to staff role
      if (oldRole === 'member' && newRole !== 'member') {
        try {
          await (supabase as any)
            .from('staff_details')
            .upsert({ user_id: userId }, { onConflict: 'user_id' });
        } catch { /* trigger handles constraint */ }
      }
      
      toast({
        title: '✅ เปลี่ยน role สำเร็จ',
        description: `เป็น ${ROLE_LABELS[newRole as UserRole]}`,
      });
      
      setEmployees(prev => prev.map(e => 
        e.id === userId ? { ...e, role: newRole } : e
      ));
    } catch (e: any) {
      toast({
        title: 'ไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (userId: string, active: boolean) => {
    if (!isSuperAdmin) return;
    try {
      const { error } = await (supabase as any)
        .from('users')
        .update({ is_active: active })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({ 
        title: active ? '✅ เปิดใช้งานแล้ว' : '⛔ ปิดใช้งานแล้ว' 
      });
      
      setEmployees(prev => prev.map(e => 
        e.id === userId ? { ...e, is_active: active } : e
      ));
    } catch (e: any) {
      toast({ title: 'ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const filtered = employees.filter(e => {
    const matchSearch = !search ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.phone || '').includes(search);
    
    const matchRole = filterRole === 'all' || e.role === filterRole;
    const matchStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && e.is_active) ||
      (filterStatus === 'inactive' && !e.is_active);
    
    return matchSearch && matchRole && matchStatus;
  });

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.is_active).length,
    byRole: employees.reduce((acc, e) => {
      acc[e.role] = (acc[e.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const formatLastLogin = (iso: string | null) => {
    if (!iso) return 'ไม่เคย';
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} วันที่แล้ว`;
    return new Date(iso).toLocaleDateString('th-TH');
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              จัดการพนักงาน
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              จัดการบัญชีพนักงาน บทบาท และสิทธิ์การเข้าถึง
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/employees/roles')}>
              <Shield className="w-4 h-4 mr-1.5" />
              ดูบทบาทและสิทธิ์
            </Button>
            {isSuperAdmin && (
              <Button onClick={() => navigate('/admin/employees/new')}>
                <Plus className="w-4 h-4 mr-1.5" />
                เพิ่มพนักงาน
              </Button>
            )}
          </div>
        </div>

        {!isSuperAdmin && (
          <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                คุณเข้าใช้งานในโหมด <strong>อ่านอย่างเดียว</strong> — เฉพาะ super_admin เท่านั้นที่แก้ไขได้
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">พนักงานทั้งหมด</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-muted-foreground">เปิดใช้งาน</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-red-600">
                {stats.byRole.super_admin || 0}
              </div>
              <div className="text-xs text-muted-foreground">Super Admin</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-purple-600">
                {stats.byRole.admin || 0}
              </div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาด้วยชื่อ อีเมล หรือเบอร์โทร..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="บทบาท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">บทบาททั้งหมด</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                  <SelectItem value="active">เปิดใช้งาน</SelectItem>
                  <SelectItem value="inactive">ปิดใช้งาน</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee list */}
        {loading ? (
          <Card>
            <CardContent className="py-16 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">ไม่พบพนักงาน</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((e) => (
              <Card key={e.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Avatar + Info */}
                    <div 
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/admin/employees/${e.id}`)}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {(e.full_name || e.email)[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm truncate">
                            {e.full_name || '(ไม่มีชื่อ)'}
                          </p>
                          <Badge 
                            variant="outline" 
                            className={ROLE_COLORS[e.role as UserRole] || 'bg-gray-100'}
                          >
                            {ROLE_LABELS[e.role as UserRole] || e.role}
                          </Badge>
                          {!e.is_active && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                              ปิดใช้งาน
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {e.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatLastLogin(e.last_login)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isSuperAdmin ? (
                        <>
                          <Select
                            value={e.role}
                            onValueChange={(v) => handleRoleChange(e.id, v)}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs">
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
                          <Switch
                            checked={e.is_active}
                            onCheckedChange={(v) => handleToggleActive(e.id, v)}
                          />
                        </>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/employees/${e.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          ดู
                        </Button>
                      )}
                      {isSuperAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/employees/${e.id}`)}
                        >
                          <UserCog className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

import { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Shield, Users, Search, UserCog, Lock, Eye, Pencil, Trash2,
  FileText, ShoppingCart, BarChart3, Settings, AlertTriangle,
} from 'lucide-react';
import { formatShortDateTime } from '@/lib/format';

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const roleBadge: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  admin: { label: 'Super Admin', variant: 'destructive' },
  sales: { label: 'Sales', variant: 'default' },
  member: { label: 'สมาชิก', variant: 'secondary' },
};

const permissionModules = [
  { key: 'quotes', label: 'ใบเสนอราคา', icon: FileText, desc: 'ดู สร้าง แก้ไข อนุมัติใบเสนอราคา' },
  { key: 'contacts', label: 'ผู้ติดต่อ / CRM', icon: Users, desc: 'จัดการรายชื่อลูกค้าและ Lead' },
  { key: 'documents', label: 'เอกสาร', icon: FileText, desc: 'อัปโหลด ลบ จัดการเอกสาร' },
  { key: 'analytics', label: 'รายงาน / สถิติ', icon: BarChart3, desc: 'ดูรายงานรายได้และสถิติ' },
  { key: 'users', label: 'จัดการผู้ใช้', icon: UserCog, desc: 'เปลี่ยนสิทธิ์และบทบาทผู้ใช้' },
  { key: 'settings', label: 'ตั้งค่าระบบ', icon: Settings, desc: 'กำหนดค่าระบบทั่วไป' },
];

export default function AdminPermissions() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const isSuperAdmin = profile?.role === 'admin';

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, is_active, last_login, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading users:', error);
    } else {
      setUsers((data || []) as UserRow[]);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!isSuperAdmin) {
      toast({ title: 'ไม่มีสิทธิ์', description: 'เฉพาะ Super Admin เท่านั้น', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'บันทึกแล้ว', description: `เปลี่ยนบทบาทเป็น ${roleBadge[newRole]?.label || newRole}` });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleToggleActive = async (userId: string, active: boolean) => {
    if (!isSuperAdmin) return;
    const { error } = await supabase.from('users').update({ is_active: active }).eq('id', userId);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: active } : u));
      toast({ title: active ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานแล้ว' });
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name || '').toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> กำหนดสิทธิ์แอดมิน
            </h1>
            <p className="text-sm text-muted-foreground mt-1">จัดการบทบาทและสิทธิ์การเข้าถึงของผู้ใช้ในระบบ</p>
          </div>
          {!isSuperAdmin && (
            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
              <Lock className="w-3 h-3 mr-1" /> อ่านอย่างเดียว
            </Badge>
          )}
        </div>

        {/* Permission Modules Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">โมดูลสิทธิ์ที่รองรับ</CardTitle>
            <CardDescription>ระบบสิทธิ์แบบละเอียด (Granular Permissions) — พร้อมใช้งานในอนาคต</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {permissionModules.map(mod => {
                const Icon = mod.icon;
                return (
                  <div key={mod.key} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20">
                    <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{mod.label}</p>
                      <p className="text-xs text-muted-foreground">{mod.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                ระบบสิทธิ์แบบละเอียดจะเปิดใช้งานในเวอร์ชันถัดไป ปัจจุบันใช้ระบบบทบาท (Role-based)
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* User List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" /> รายชื่อผู้ใช้ ({filtered.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาชื่อ / อีเมล..."
                    className="pl-8 w-52"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="member">สมาชิก</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">กำลังโหลด...</p>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ผู้ใช้</TableHead>
                      <TableHead>บทบาท</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>เข้าใช้ล่าสุด</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{user.full_name || '-'}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isSuperAdmin && user.id !== profile?.id ? (
                            <Select
                              value={user.role}
                              onValueChange={v => handleRoleChange(user.id, v)}
                            >
                              <SelectTrigger className="w-28 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Super Admin</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="member">สมาชิก</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant={roleBadge[user.role]?.variant || 'outline'}>
                              {roleBadge[user.role]?.label || user.role}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {isSuperAdmin && user.id !== profile?.id ? (
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={user.is_active}
                                onCheckedChange={v => handleToggleActive(user.id, v)}
                              />
                              <span className="text-xs">{user.is_active ? 'ใช้งาน' : 'ปิด'}</span>
                            </div>
                          ) : (
                            <Badge variant={user.is_active ? 'default' : 'outline'}>
                              {user.is_active ? 'ใช้งาน' : 'ปิด'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {user.last_login ? formatShortDateTime(user.last_login) : 'ยังไม่เคย'}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.id === profile?.id && (
                            <Badge variant="outline" className="text-xs">ตัวคุณเอง</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

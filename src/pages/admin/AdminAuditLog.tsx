import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Shield, Search, Download, Loader2, ArrowLeft, Lock } from 'lucide-react';

interface AuditEntry {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  actor_role: string | null;
  action: string;
  target_user_id: string | null;
  target_email: string | null;
  table_name: string | null;
  old_value: any;
  new_value: any;
  ip_address: string | null;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  role_changed: '🛡 เปลี่ยน Role',
  user_activated: '✅ เปิดใช้งาน',
  user_deactivated: '⛔ ปิดใช้งาน',
  permission_override_added: '🔑 เพิ่ม Override',
  permission_override_updated: '🔑 เปลี่ยน Override',
  permission_override_removed: '🔑 ลบ Override',
  user_created: '👤 สร้าง User',
  user_deleted: '🗑 ลบ User',
  login_success: '🔓 Login สำเร็จ',
  login_failed: '🔒 Login ล้มเหลว',
  password_changed: '🔑 เปลี่ยนรหัสผ่าน',
  settings_changed: '⚙️ เปลี่ยนการตั้งค่า',
};

export default function AdminAuditLog() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const isSuperAdmin = profile?.role === 'super_admin';

  useEffect(() => {
    if (isSuperAdmin) loadLogs();
  }, [isSuperAdmin]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      setLogs((data as AuditEntry[]) || []);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(l => {
    const matchSearch = !search ||
      l.actor_email?.toLowerCase().includes(search.toLowerCase()) ||
      l.target_email?.toLowerCase().includes(search.toLowerCase()) ||
      l.action.includes(search.toLowerCase());
    const matchAction = filterAction === 'all' || l.action === filterAction;
    return matchSearch && matchAction;
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Actor Email', 'Actor Role', 'Action', 'Target Email', 'Old Value', 'New Value', 'IP'];
    const rows = filtered.map(l => [
      new Date(l.created_at).toISOString(), l.actor_email || '', l.actor_role || '',
      l.action, l.target_email || '',
      JSON.stringify(l.old_value || {}), JSON.stringify(l.new_value || {}), l.ip_address || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: '✅ Export สำเร็จ', description: `${filtered.length} รายการ` });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const renderDetail = (entry: AuditEntry) => {
    if (entry.action === 'role_changed') {
      return (
        <span className="text-xs">
          {entry.old_value?.role} → <strong className="text-purple-700">{entry.new_value?.role}</strong>
        </span>
      );
    }
    if (entry.action.startsWith('permission_override')) {
      const val = entry.new_value || entry.old_value;
      return (
        <span className="text-xs"><strong>{val?.module}</strong>: {val?.permission}</span>
      );
    }
    return null;
  };

  if (!isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto p-6">
          <Card className="border-red-300 bg-red-50">
            <CardContent className="pt-6 text-center">
              <Lock className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <p className="font-semibold text-red-900">ไม่มีสิทธิ์เข้าถึง</p>
              <p className="text-sm text-red-700 mt-1">เฉพาะ super_admin เท่านั้นที่สามารถดู Audit Log ได้</p>
              <Button className="mt-4" onClick={() => navigate('/admin/dashboard')}>กลับหน้า Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                ประวัติการเปลี่ยนแปลงระบบ
              </h1>
              <p className="text-xs text-muted-foreground">Audit trail สำหรับการเปลี่ยนแปลง role, permissions, และ login</p>
            </div>
          </div>
          {filtered.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-1.5" /> Export CSV ({filtered.length})
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="ค้นหาอีเมล หรือ action..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger><SelectValue placeholder="Action ทั้งหมด" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Action ทั้งหมด</SelectItem>
                {Object.entries(ACTION_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filtered.length} รายการ</span>
          <span>แสดง 200 รายการล่าสุด</span>
        </div>

        {loading ? (
          <Card><CardContent className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></CardContent></Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">ไม่มีประวัติการเปลี่ยนแปลง</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((l) => (
              <Card key={l.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{ACTION_LABELS[l.action] || l.action}</Badge>
                        <span className="text-[10px] text-muted-foreground">{formatDate(l.created_at)}</span>
                      </div>
                      {l.actor_email && (
                        <p className="text-xs">
                          <span className="text-muted-foreground">โดย:</span> <strong>{l.actor_email}</strong>
                          {l.actor_role && <Badge variant="outline" className="ml-1 text-[10px]">{l.actor_role}</Badge>}
                        </p>
                      )}
                      {l.target_email && l.target_email !== l.actor_email && (
                        <p className="text-xs"><span className="text-muted-foreground">เป้าหมาย:</span> {l.target_email}</p>
                      )}
                      <div>{renderDetail(l)}</div>
                      {l.ip_address && <p className="text-[10px] text-muted-foreground">IP: {l.ip_address}</p>}
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

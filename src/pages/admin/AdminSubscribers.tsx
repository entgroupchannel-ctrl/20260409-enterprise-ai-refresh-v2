import { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Search, Mail, UserCheck, UserX, Download, RefreshCw, Eye,
} from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
  is_active: boolean;
  unsubscribed_at: string | null;
  notes: string | null;
}

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selected, setSelected] = useState<Subscriber | null>(null);
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setSubscribers(data as Subscriber[]);
    setLoading(false);
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const filtered = subscribers.filter((s) => {
    const matchSearch = s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ? true : filter === 'active' ? s.is_active : !s.is_active;
    return matchSearch && matchFilter;
  });

  const activeCount = subscribers.filter((s) => s.is_active).length;
  const inactiveCount = subscribers.filter((s) => !s.is_active).length;

  const toggleStatus = async (sub: Subscriber) => {
    const newActive = !sub.is_active;
    const { error } = await supabase
      .from('subscribers')
      .update({
        is_active: newActive,
        unsubscribed_at: newActive ? null : new Date().toISOString(),
      } as any)
      .eq('id', sub.id);
    if (error) {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' });
    } else {
      toast({ title: newActive ? 'เปิดใช้งานแล้ว' : 'ยกเลิกการสมัครแล้ว' });
      fetchSubscribers();
      if (selected?.id === sub.id) setSelected({ ...sub, is_active: newActive });
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase
      .from('subscribers')
      .update({ notes: noteText } as any)
      .eq('id', selected.id);
    if (!error) {
      toast({ title: 'บันทึกโน้ตสำเร็จ' });
      fetchSubscribers();
      setSelected({ ...selected, notes: noteText });
    }
    setSaving(false);
  };

  const exportCSV = () => {
    const rows = [
      ['Email', 'Source', 'Status', 'Subscribed At', 'Notes'],
      ...filtered.map((s) => [
        s.email,
        s.source || '',
        s.is_active ? 'Active' : 'Inactive',
        new Date(s.created_at).toLocaleString('th-TH'),
        (s.notes || '').replace(/,/g, ' '),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminPageLayout title="📧 สมาชิกรับข่าวสาร" description="จัดการรายชื่ออีเมลที่สมัครรับข่าวสาร">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter('all')}>
          <CardContent className="p-4 flex items-center gap-3">
            <Mail className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{subscribers.length}</p>
              <p className="text-xs text-muted-foreground">ทั้งหมด</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-green-500 transition-colors" onClick={() => setFilter('active')}>
          <CardContent className="p-4 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-xs text-muted-foreground">สมาชิกที่ใช้งาน</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-red-500 transition-colors" onClick={() => setFilter('inactive')}>
          <CardContent className="p-4 flex items-center gap-3">
            <UserX className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{inactiveCount}</p>
              <p className="text-xs text-muted-foreground">ยกเลิกแล้ว</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="mb-4">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาอีเมล..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchSubscribers}>
              <RefreshCw className="w-4 h-4 mr-1" /> รีเฟรช
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>อีเมล</TableHead>
                <TableHead>แหล่งที่มา</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่สมัคร</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    กำลังโหลด...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((sub) => (
                  <TableRow key={sub.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelected(sub); setNoteText(sub.notes || ''); }}>
                    <TableCell className="font-medium">{sub.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{sub.source || 'website'}</Badge>
                    </TableCell>
                    <TableCell>
                      {sub.is_active ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(sub.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(sub); setNoteText(sub.notes || ''); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>รายละเอียดสมาชิก</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">อีเมล</p>
                <p className="font-medium">{selected.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">แหล่งที่มา</p>
                  <p className="text-sm">{selected.source || 'website'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">สถานะ</p>
                  {selected.is_active ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">วันที่สมัคร</p>
                <p className="text-sm">{new Date(selected.created_at).toLocaleString('th-TH')}</p>
              </div>
              {selected.unsubscribed_at && (
                <div>
                  <p className="text-sm text-muted-foreground">วันที่ยกเลิก</p>
                  <p className="text-sm text-red-500">{new Date(selected.unsubscribed_at).toLocaleString('th-TH')}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">บันทึก (Notes)</p>
                <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="เพิ่มบันทึกเกี่ยวกับสมาชิก..." rows={3} />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            {selected && (
              <>
                <Button variant={selected.is_active ? 'destructive' : 'default'} size="sm" onClick={() => toggleStatus(selected)}>
                  {selected.is_active ? <><UserX className="w-4 h-4 mr-1" /> ยกเลิก</> : <><UserCheck className="w-4 h-4 mr-1" /> เปิดใช้งาน</>}
                </Button>
                <Button size="sm" onClick={saveNotes} disabled={saving}>
                  บันทึกโน้ต
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
};

export default AdminSubscribers;

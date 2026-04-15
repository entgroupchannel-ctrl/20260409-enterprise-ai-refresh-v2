import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Search, Loader2, Mail, Phone, Building2, MessageCircle,
  Eye, CheckCircle, Clock, Star, ArrowUpDown, ExternalLink,
} from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: string;
  priority: string | null;
  source: string | null;
  lead_score: number | null;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: 'ใหม่', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  read: { label: 'อ่านแล้ว', color: 'bg-muted text-muted-foreground border-border' },
  in_progress: { label: 'กำลังดำเนินการ', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  replied: { label: 'ตอบกลับแล้ว', color: 'bg-green-100 text-green-700 border-green-200' },
  converted: { label: 'เปิดงานแล้ว', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  closed: { label: 'ปิดแล้ว', color: 'bg-muted text-muted-foreground border-border' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'ต่ำ', color: 'text-muted-foreground' },
  normal: { label: 'ปกติ', color: 'text-foreground' },
  high: { label: 'สูง', color: 'text-orange-600' },
  urgent: { label: 'เร่งด่วน', color: 'text-destructive' },
};

export default function ContactSubmissionsList() {
  const { toast } = useToast();
  const { profile } = useAuth();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [stats, setStats] = useState({ total: 0, new_count: 0, in_progress: 0, replied: 0 });

  useEffect(() => { loadSubmissions(); loadStats(); }, [statusFilter]);

  const loadStats = async () => {
    try {
      const [totalRes, newRes, progressRes, repliedRes] = await Promise.all([
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'replied'),
      ]);
      setStats({
        total: totalRes.count || 0,
        new_count: newRes.count || 0,
        in_progress: progressRes.count || 0,
        replied: repliedRes.count || 0,
      });
    } catch (e) {
      console.error('loadStats error:', e);
    }
  };

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase.from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      let filtered = (data as Submission[]) || [];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(sub =>
          sub.name.toLowerCase().includes(s) ||
          sub.email.toLowerCase().includes(s) ||
          (sub.company || '').toLowerCase().includes(s) ||
          sub.message.toLowerCase().includes(s)
        );
      }
      setSubmissions(filtered);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => loadSubmissions(), 300);
    return () => clearTimeout(t);
  }, [search]);

  const updateSubmissionStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const { error } = await supabase.from('contact_submissions')
        .update({
          status: newStatus,
          notes: adminNotes || null,
          assigned_to: profile?.id || null,
        } as any)
        .eq('id', id);
      if (error) throw error;
      toast({ title: '✅ อัปเดตสถานะเรียบร้อย' });
      loadSubmissions();
      loadStats();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, status: newStatus, notes: adminNotes } : null);
      }
    } catch (e: any) {
      toast({ title: 'อัปเดตไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updatePriority = async (id: string, priority: string) => {
    try {
      const { error } = await supabase.from('contact_submissions')
        .update({ priority } as any)
        .eq('id', id);
      if (error) throw error;
      toast({ title: '✅ อัปเดตความสำคัญเรียบร้อย' });
      loadSubmissions();
    } catch (e: any) {
      toast({ title: 'อัปเดตไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const openDetail = (sub: Submission) => {
    setSelectedSubmission(sub);
    setAdminNotes(sub.notes || '');
    // Auto-mark as read
    if (sub.status === 'new') {
      updateSubmissionStatus(sub.id, 'read');
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  const timeSince = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ชม.ที่แล้ว`;
    const days = Math.floor(hrs / 24);
    return `${days} วันที่แล้ว`;
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">ทั้งหมด</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="p-3">
            <p className="text-xs text-blue-600">ใหม่ (รอดำเนินการ)</p>
            <p className="text-2xl font-bold text-blue-700">{stats.new_count}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-yellow-600">กำลังดำเนินการ</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.in_progress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-green-600">ตอบกลับแล้ว</p>
            <p className="text-2xl font-bold text-green-700">{stats.replied}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา: ชื่อ / อีเมล / บริษัท / ข้อความ"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="new">ใหม่</SelectItem>
              <SelectItem value="read">อ่านแล้ว</SelectItem>
              <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
              <SelectItem value="replied">ตอบกลับแล้ว</SelectItem>
              <SelectItem value="converted">เปิดงานแล้ว</SelectItem>
              <SelectItem value="closed">ปิดแล้ว</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>ไม่พบข้อความจากลูกค้า</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ชื่อ / บริษัท</TableHead>
                  <TableHead>อีเมล / โทรศัพท์</TableHead>
                  <TableHead>ข้อความ</TableHead>
                  <TableHead>ความสำคัญ</TableHead>
                  <TableHead>วันที่</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => {
                  const sc = statusConfig[sub.status] || statusConfig.new;
                  const pc = priorityConfig[sub.priority || 'normal'] || priorityConfig.normal;
                  return (
                    <TableRow
                      key={sub.id}
                      className={`cursor-pointer hover:bg-muted/50 ${sub.status === 'new' ? 'bg-blue-50/30 dark:bg-blue-950/10' : ''}`}
                      onClick={() => openDetail(sub)}
                    >
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${sc.color}`}>
                          {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className={`text-sm ${sub.status === 'new' ? 'font-bold' : 'font-medium'}`}>
                          {sub.name}
                        </p>
                        {sub.company && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {sub.company}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-xs">{sub.email}</p>
                        {sub.phone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {sub.phone}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground line-clamp-2 max-w-[250px]">
                          {sub.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium ${pc.color}`}>
                          {pc.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {timeSince(sub.created_at)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(v) => !v && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  ข้อความจาก {selectedSubmission.name}
                </DialogTitle>
                <DialogDescription>
                  ส่งเมื่อ {formatDate(selectedSubmission.created_at)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Contact Info */}
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h4 className="text-sm font-semibold">ข้อมูลผู้ติดต่อ</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">ชื่อ:</span>{' '}
                        <span className="font-medium">{selectedSubmission.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">อีเมล:</span>{' '}
                        <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">
                          {selectedSubmission.email}
                        </a>
                      </div>
                      {selectedSubmission.phone && (
                        <div>
                          <span className="text-muted-foreground">โทรศัพท์:</span>{' '}
                          <a href={`tel:${selectedSubmission.phone}`} className="text-primary hover:underline">
                            {selectedSubmission.phone}
                          </a>
                        </div>
                      )}
                      {selectedSubmission.company && (
                        <div>
                          <span className="text-muted-foreground">บริษัท:</span>{' '}
                          <span className="font-medium">{selectedSubmission.company}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Message */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold mb-2">ข้อความ</h4>
                    <p className="text-sm whitespace-pre-wrap bg-muted/50 rounded-lg p-3 border">
                      {selectedSubmission.message}
                    </p>
                  </CardContent>
                </Card>

                {/* Admin Actions */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h4 className="text-sm font-semibold">จัดการ</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">สถานะ</Label>
                        <Select
                          value={selectedSubmission.status}
                          onValueChange={(v) => updateSubmissionStatus(selectedSubmission.id, v)}
                          disabled={updatingStatus}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">ใหม่</SelectItem>
                            <SelectItem value="read">อ่านแล้ว</SelectItem>
                            <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
                            <SelectItem value="replied">ตอบกลับแล้ว</SelectItem>
                            <SelectItem value="converted">เปิดงานแล้ว</SelectItem>
                            <SelectItem value="closed">ปิดแล้ว</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">ความสำคัญ</Label>
                        <Select
                          value={selectedSubmission.priority || 'normal'}
                          onValueChange={(v) => updatePriority(selectedSubmission.id, v)}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">ต่ำ</SelectItem>
                            <SelectItem value="normal">ปกติ</SelectItem>
                            <SelectItem value="high">สูง</SelectItem>
                            <SelectItem value="urgent">เร่งด่วน</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">บันทึกภายใน</Label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={3}
                        placeholder="บันทึกเพิ่มเติม เช่น ติดต่อกลับแล้ว, รอข้อมูลเพิ่ม..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateSubmissionStatus(selectedSubmission.id, selectedSubmission.status)}
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                        บันทึก
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`mailto:${selectedSubmission.email}`, '_blank')}
                      >
                        <Mail className="w-3.5 h-3.5 mr-1" /> ตอบกลับอีเมล
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

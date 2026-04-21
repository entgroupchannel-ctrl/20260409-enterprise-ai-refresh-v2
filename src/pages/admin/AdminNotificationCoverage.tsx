import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ShieldCheck, AlertTriangle, XCircle, Mail, Bell, UserCheck, Search, ExternalLink, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Notification & Email Coverage Dashboard (Phase 2 — DB-driven)
 * ----------------------------------------------------------------
 * อ่านจริงจาก:
 *   - notification_events       (registry — เปิด/ปิดต่อ event ต่อ channel)
 *   - notification_dispatch_log (กิจกรรม in-app 7 วันล่าสุด)
 *   - email_send_log            (กิจกรรม email 7 วันล่าสุด ตาม template)
 *
 * Status = "ทำงานจริง" ถ้ามี dispatch สำเร็จในช่วง 7 วัน หรือ "ตั้งค่าเปิด"
 * ตาม registry และยังไม่มีกิจกรรม
 */

type ChannelKey = 'customer_email' | 'customer_in_app' | 'admin_email' | 'admin_in_app';
type CoverageStatus = 'live' | 'configured' | 'disabled' | 'na';
type Priority = 'P1' | 'P2' | 'P3';

interface EventRow {
  event_key: string;
  category: string;
  display_name: string | null;
  description: string | null;
  priority: Priority;
  notify_customer_email: boolean;
  notify_customer_in_app: boolean;
  notify_admin_email: boolean;
  notify_admin_in_app: boolean;
  email_template: string | null;
  is_critical: boolean;
  is_active: boolean;
}

interface DispatchStat {
  delivered: number;
  skipped: number;
  failed: number;
  total: number;
  lastAt: string | null;
}

const CHANNEL_META: Record<ChannelKey, { label: string; icon: any }> = {
  customer_email: { label: 'ลูกค้า (Email)', icon: Mail },
  customer_in_app: { label: 'ลูกค้า (In-app)', icon: UserCheck },
  admin_in_app: { label: 'แอดมิน (In-app)', icon: Bell },
  admin_email: { label: 'แอดมิน (Email)', icon: Mail },
};

const STATUS_META: Record<CoverageStatus, { label: string; icon: any; className: string }> = {
  live: { label: 'ทำงาน', icon: ShieldCheck, className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' },
  configured: { label: 'เปิดไว้', icon: AlertTriangle, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200' },
  disabled: { label: 'ปิด', icon: XCircle, className: 'bg-muted text-muted-foreground border-border' },
  na: { label: '—', icon: () => null, className: 'bg-muted text-muted-foreground border-border' },
};

function priorityBadge(p: Priority) {
  const cls = p === 'P1' ? 'border-red-300 text-red-700' : p === 'P2' ? 'border-yellow-300 text-yellow-700' : 'border-border';
  return <Badge variant="outline" className={cls}>{p}</Badge>;
}

function channelStatus(enabled: boolean, hasActivity: boolean): CoverageStatus {
  if (!enabled) return 'na';
  return hasActivity ? 'live' : 'configured';
}

function ChannelCell({ status }: { status: CoverageStatus }) {
  const meta = STATUS_META[status];
  if (status === 'na') return <TableCell className="text-center text-muted-foreground">—</TableCell>;
  const Icon = meta.icon;
  return (
    <TableCell className="text-center">
      <Badge variant="outline" className={`${meta.className} gap-1`}>
        <Icon className="w-3 h-3" />
        {meta.label}
      </Badge>
    </TableCell>
  );
}

function SummaryCard({ label, value, className = '' }: { label: string; value: number; className?: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`text-2xl font-bold ${className}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

export default function AdminNotificationCoverage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'live' | 'configured' | 'disabled' | 'P1'>('all');
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<EventRow[]>([]);
  const [inAppStats, setInAppStats] = useState<Record<string, DispatchStat>>({});
  const [emailStats, setEmailStats] = useState<Record<string, { sent: number; failed: number }>>({});
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    try {
      const [evRes, dispRes, mailRes] = await Promise.all([
        (supabase as any).from('notification_events').select('*').order('category').order('event_key'),
        (supabase as any)
          .from('notification_dispatch_log')
          .select('event_key, customer_in_app_status, admin_in_app_status, customer_email_status, admin_email_status, created_at')
          .gte('created_at', since)
          .limit(5000),
        (supabase as any)
          .from('email_send_log')
          .select('template_name, status, message_id, created_at')
          .gte('created_at', since)
          .limit(5000),
      ]);

      if (evRes.error) throw evRes.error;
      setEvents((evRes.data as EventRow[]) || []);

      // dispatch stats
      const dispMap: Record<string, DispatchStat> = {};
      (dispRes.data || []).forEach((r: any) => {
        const k = r.event_key;
        if (!dispMap[k]) dispMap[k] = { delivered: 0, skipped: 0, failed: 0, total: 0, lastAt: null };
        const s = dispMap[k];
        s.total++;
        if (!s.lastAt || new Date(r.created_at) > new Date(s.lastAt)) s.lastAt = r.created_at;
        const statuses = [r.customer_in_app_status, r.admin_in_app_status, r.customer_email_status, r.admin_email_status].filter(Boolean);
        if (statuses.includes('delivered') || statuses.includes('sent')) s.delivered++;
        else if (statuses.includes('failed')) s.failed++;
        else s.skipped++;
      });
      setInAppStats(dispMap);

      // email stats (dedup by message_id)
      const latest = new Map<string, any>();
      (mailRes.data || []).forEach((r: any) => {
        const key = r.message_id || `${r.template_name}-${r.created_at}`;
        const cur = latest.get(key);
        if (!cur || new Date(r.created_at) > new Date(cur.created_at)) latest.set(key, r);
      });
      const eStats: Record<string, { sent: number; failed: number }> = {};
      latest.forEach((r) => {
        const k = r.template_name || 'unknown';
        if (!eStats[k]) eStats[k] = { sent: 0, failed: 0 };
        if (r.status === 'sent') eStats[k].sent++;
        else if (['failed', 'dlq', 'bounced'].includes(r.status)) eStats[k].failed++;
      });
      setEmailStats(eStats);
    } catch (e: any) {
      console.error('[AdminNotificationCoverage] load failed:', e);
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e?.message || 'ลองใหม่อีกครั้ง', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleChannel = async (eventKey: string, channel: ChannelKey, value: boolean) => {
    const prev = events;
    setEvents((cur) => cur.map((e) => (e.event_key === eventKey ? { ...e, [`notify_${channel}`]: value } as EventRow : e)));
    const { error } = await (supabase as any)
      .from('notification_events')
      .update({ [`notify_${channel}`]: value })
      .eq('event_key', eventKey);
    if (error) {
      console.error('toggleChannel failed:', error);
      setEvents(prev);
      toast({ title: 'อัปเดตไม่สำเร็จ', description: error.message, variant: 'destructive' });
    }
  };

  const toggleActive = async (eventKey: string, value: boolean) => {
    const prev = events;
    setEvents((cur) => cur.map((e) => (e.event_key === eventKey ? { ...e, is_active: value } : e)));
    const { error } = await (supabase as any).from('notification_events').update({ is_active: value }).eq('event_key', eventKey);
    if (error) {
      setEvents(prev);
      toast({ title: 'อัปเดตไม่สำเร็จ', description: error.message, variant: 'destructive' });
    }
  };

  const categories = useMemo(() => Array.from(new Set(events.map((e) => e.category))).sort(), [events]);

  const enriched = useMemo(() => {
    return events.map((e) => {
      const disp = inAppStats[e.event_key];
      const mail = e.email_template ? emailStats[e.email_template] : undefined;
      const hasInApp = (disp?.delivered ?? 0) > 0;
      const hasEmail = (mail?.sent ?? 0) > 0;
      const channels = {
        customer_email: channelStatus(e.notify_customer_email, hasEmail),
        customer_in_app: channelStatus(e.notify_customer_in_app, hasInApp),
        admin_email: channelStatus(e.notify_admin_email, hasEmail),
        admin_in_app: channelStatus(e.notify_admin_in_app, hasInApp),
      };
      const enabledList = Object.values(channels).filter((s) => s !== 'na');
      let overall: CoverageStatus = 'disabled';
      if (!e.is_active) overall = 'disabled';
      else if (enabledList.length === 0) overall = 'disabled';
      else if (enabledList.some((s) => s === 'live')) overall = 'live';
      else overall = 'configured';
      return { event: e, channels, dispatch: disp, email: mail, overall };
    });
  }, [events, inAppStats, emailStats]);

  const filtered = useMemo(() => {
    return enriched.filter((row) => {
      if (category !== 'all' && row.event.category !== category) return false;
      if (filter === 'P1' && row.event.priority !== 'P1') return false;
      if (['live', 'configured', 'disabled'].includes(filter) && row.overall !== filter) return false;
      if (search) {
        const hay = `${row.event.event_key} ${row.event.display_name ?? ''} ${row.event.description ?? ''}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [enriched, filter, category, search]);

  const summary = useMemo(() => {
    const s = { total: enriched.length, live: 0, configured: 0, disabled: 0, p1Pending: 0 };
    enriched.forEach((row) => {
      s[row.overall]++;
      if (row.event.priority === 'P1' && row.overall !== 'live') s.p1Pending++;
    });
    return s;
  }, [enriched]);

  return (
    <AdminLayout>
      <div className="space-y-6 admin-content-area">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <div>
              <h1 className="text-2xl font-bold">แผนที่การแจ้งเตือน (Coverage Map)</h1>
              <p className="text-sm text-muted-foreground">
                อ่านจาก registry จริง ({events.length} events) — สถิติย้อนหลัง 7 วัน
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadAll} disabled={loading}>
              <Activity className="w-4 h-4 mr-1" /> รีเฟรช
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/email-log')}>
              <ExternalLink className="w-4 h-4 mr-1" /> ดู Email Log
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <SummaryCard label="ทั้งหมด" value={summary.total} />
          <SummaryCard label="ทำงานจริง" value={summary.live} className="text-green-700" />
          <SummaryCard label="เปิดรอใช้" value={summary.configured} className="text-blue-700" />
          <SummaryCard label="ปิด" value={summary.disabled} className="text-muted-foreground" />
          <SummaryCard label="P1 ยังไม่ active" value={summary.p1Pending} className="text-red-700" />
        </div>

        <Card>
          <CardContent className="pt-6 space-y-3">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="live">ทำงานจริง</TabsTrigger>
                <TabsTrigger value="configured">เปิดรอใช้</TabsTrigger>
                <TabsTrigger value="disabled">ปิด</TabsTrigger>
                <TabsTrigger value="P1">P1 เท่านั้น</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="sm:w-64"><SelectValue placeholder="หมวดหมู่" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="ค้นหา event_key / ชื่อ..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">รายการ Event ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead className="text-center">P</TableHead>
                  <TableHead className="text-center">เปิด</TableHead>
                  <TableHead className="text-center">ลูกค้า Email</TableHead>
                  <TableHead className="text-center">ลูกค้า In-app</TableHead>
                  <TableHead className="text-center">แอดมิน In-app</TableHead>
                  <TableHead className="text-center">แอดมิน Email</TableHead>
                  <TableHead className="text-center">Dispatch 7d</TableHead>
                  <TableHead className="text-center">Email 7d</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">กำลังโหลด...</TableCell></TableRow>
                )}
                {!loading && filtered.map((row) => {
                  const e = row.event;
                  return (
                    <TableRow key={e.event_key}>
                      <TableCell className="max-w-xs">
                        <div className="font-medium text-sm">{e.display_name || e.event_key}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{e.event_key}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {e.category}{e.is_critical && <span className="ml-2 text-red-600">• critical</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{priorityBadge(e.priority)}</TableCell>
                      <TableCell className="text-center">
                        <Switch checked={e.is_active} onCheckedChange={(v) => toggleActive(e.event_key, v)} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch checked={e.notify_customer_email} onCheckedChange={(v) => toggleChannel(e.event_key, 'customer_email', v)} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch checked={e.notify_customer_in_app} onCheckedChange={(v) => toggleChannel(e.event_key, 'customer_in_app', v)} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch checked={e.notify_admin_in_app} onCheckedChange={(v) => toggleChannel(e.event_key, 'admin_in_app', v)} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch checked={e.notify_admin_email} onCheckedChange={(v) => toggleChannel(e.event_key, 'admin_email', v)} />
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {row.dispatch ? (
                          <span>
                            <span className="text-green-700 font-medium">{row.dispatch.delivered}</span>
                            {' / '}
                            <span className="text-muted-foreground">{row.dispatch.skipped}</span>
                            {row.dispatch.failed > 0 && <> / <span className="text-red-700">{row.dispatch.failed}</span></>}
                          </span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {row.email ? (
                          <span>
                            <span className="text-green-700 font-medium">{row.email.sent}</span>
                            {' / '}
                            <span className="text-red-700">{row.email.failed}</span>
                          </span>
                        ) : e.email_template ? <span className="text-muted-foreground">0 / 0</span> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!loading && filtered.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">ไม่พบรายการ</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-2">คำอธิบาย</div>
            <div className="flex flex-wrap gap-2 text-xs items-center">
              <Badge variant="outline" className={STATUS_META.live.className}>ทำงาน — มี dispatch สำเร็จใน 7 วัน</Badge>
              <Badge variant="outline" className={STATUS_META.configured.className}>เปิดรอใช้ — ตั้งค่าเปิดแต่ยังไม่มี activity</Badge>
              <Badge variant="outline" className={STATUS_META.disabled.className}>ปิด — registry ปิดทุก channel หรือปิด event</Badge>
              <span className="text-muted-foreground ml-2">P1 = critical • P2 = important • P3 = nice-to-have</span>
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              Dispatch: <span className="text-green-700">delivered</span> / <span>skipped (preference)</span> / <span className="text-red-700">failed</span>
              {' • '}Email stats จาก email_send_log (dedup ตาม message_id)
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

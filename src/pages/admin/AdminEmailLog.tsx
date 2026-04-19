import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Mail, RefreshCw, AlertCircle, CheckCircle2, XCircle, Ban, Search } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

type EmailLogRow = {
  id: string;
  template_name: string;
  recipient_email: string;
  subject: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
  related_id: string | null;
  related_type: string | null;
  sales_id?: string | null;
  sales_name?: string | null;
};

const RANGE_PRESETS = [
  { value: '24h', label: '24 ชั่วโมง', hours: 24 },
  { value: '7d', label: '7 วัน', hours: 24 * 7 },
  { value: '30d', label: '30 วัน', hours: 24 * 30 },
  { value: '90d', label: '90 วัน', hours: 24 * 90 },
];

const STATUS_META: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary' | 'outline'; className: string }> = {
  sent: { label: 'ส่งสำเร็จ', variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  pending: { label: 'รอส่ง', variant: 'secondary', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  failed: { label: 'ล้มเหลว', variant: 'destructive', className: '' },
  dlq: { label: 'ล้มเหลวถาวร', variant: 'destructive', className: '' },
  suppressed: { label: 'ระงับ', variant: 'outline', className: 'bg-yellow-100 text-yellow-800' },
  bounced: { label: 'ตีกลับ', variant: 'destructive', className: '' },
  complained: { label: 'ร้องเรียน', variant: 'destructive', className: '' },
};

export default function AdminEmailLog() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<EmailLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [salesFilter, setSalesFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    const preset = RANGE_PRESETS.find((p) => p.value === range) || RANGE_PRESETS[1];
    const since = new Date(Date.now() - preset.hours * 3600 * 1000).toISOString();

    const { data, error } = await supabase
      .from('email_send_log')
      .select('id, template_name, recipient_email, subject, status, error_message, created_at, related_id, related_type')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('[AdminEmailLog] load error:', error);
      setRows([]);
      setLoading(false);
      return;
    }

    const baseRows = (data || []) as EmailLogRow[];

    // Group related_ids by type for batched lookups
    const quoteIds = new Set<string>();
    const invoiceIds = new Set<string>();
    const saleOrderIds = new Set<string>();
    for (const r of baseRows) {
      if (!r.related_id) continue;
      if (r.related_type === 'quote') quoteIds.add(r.related_id);
      else if (r.related_type === 'invoice') invoiceIds.add(r.related_id);
      else if (r.related_type === 'sale_order') saleOrderIds.add(r.related_id);
    }

    const [quotesRes, invoicesRes, saleOrdersRes] = await Promise.all([
      quoteIds.size
        ? supabase.from('quote_requests').select('id, assigned_to, created_by').in('id', Array.from(quoteIds))
        : Promise.resolve({ data: [] as any[] }),
      invoiceIds.size
        ? supabase.from('invoices').select('id, created_by, quote_id').in('id', Array.from(invoiceIds))
        : Promise.resolve({ data: [] as any[] }),
      saleOrderIds.size
        ? (supabase as any).from('sale_orders').select('id, created_by').in('id', Array.from(saleOrderIds))
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const ownerByQuote = new Map<string, string | null>();
    (quotesRes.data || []).forEach((q: any) => ownerByQuote.set(q.id, q.assigned_to || q.created_by || null));
    const ownerByInvoice = new Map<string, string | null>();
    const invoiceQuoteIds = new Set<string>();
    (invoicesRes.data || []).forEach((i: any) => {
      ownerByInvoice.set(i.id, i.created_by || null);
      if (i.quote_id) invoiceQuoteIds.add(i.quote_id);
    });
    // For invoices missing owner, fall back to their parent quote's assigned_to
    if (invoiceQuoteIds.size) {
      const { data: qExtra } = await supabase
        .from('quote_requests').select('id, assigned_to').in('id', Array.from(invoiceQuoteIds));
      (qExtra || []).forEach((q: any) => {
        if (q.assigned_to && !ownerByQuote.has(q.id)) ownerByQuote.set(q.id, q.assigned_to);
      });
      (invoicesRes.data || []).forEach((i: any) => {
        if (!ownerByInvoice.get(i.id) && i.quote_id) {
          const fallback = ownerByQuote.get(i.quote_id);
          if (fallback) ownerByInvoice.set(i.id, fallback);
        }
      });
    }
    const ownerBySaleOrder = new Map<string, string | null>();
    (saleOrdersRes.data || []).forEach((s: any) => ownerBySaleOrder.set(s.id, s.created_by || null));

    // Collect all sales user ids and fetch their names
    const allSalesIds = new Set<string>();
    const enriched = baseRows.map((r) => {
      let sid: string | null = null;
      if (r.related_id) {
        if (r.related_type === 'quote') sid = ownerByQuote.get(r.related_id) || null;
        else if (r.related_type === 'invoice') sid = ownerByInvoice.get(r.related_id) || null;
        else if (r.related_type === 'sale_order') sid = ownerBySaleOrder.get(r.related_id) || null;
      }
      if (sid) allSalesIds.add(sid);
      return { ...r, sales_id: sid } as EmailLogRow;
    });

    const nameById = new Map<string, string>();
    if (allSalesIds.size) {
      const { data: usersData } = await supabase
        .from('users').select('id, full_name').in('id', Array.from(allSalesIds));
      (usersData || []).forEach((u: any) => nameById.set(u.id, u.full_name || ''));
    }

    setRows(enriched.map((r) => ({ ...r, sales_name: r.sales_id ? nameById.get(r.sales_id) || null : null })));
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [range]);

  // Each row is one send event (no message_id in this schema — id is unique per send)
  const deduped = useMemo(() => rows, [rows]);

  const templateOptions = useMemo(() => {
    const set = new Set<string>();
    deduped.forEach((r) => set.add(r.template_name));
    return Array.from(set).sort();
  }, [deduped]);

  const filtered = useMemo(() => {
    return deduped.filter((r) => {
      if (templateFilter !== 'all' && r.template_name !== templateFilter) return false;
      if (statusFilter !== 'all') {
        if (statusFilter === 'failed' && !['failed', 'dlq', 'bounced', 'complained'].includes(r.status)) return false;
        if (statusFilter !== 'failed' && r.status !== statusFilter) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const hay = `${r.recipient_email} ${r.subject || ''} ${r.template_name}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [deduped, templateFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const s = { total: deduped.length, sent: 0, failed: 0, suppressed: 0, pending: 0 };
    for (const r of deduped) {
      if (r.status === 'sent') s.sent++;
      else if (['failed', 'dlq', 'bounced', 'complained'].includes(r.status)) s.failed++;
      else if (r.status === 'suppressed') s.suppressed++;
      else if (r.status === 'pending') s.pending++;
    }
    return s;
  }, [deduped]);

  const statusBadge = (status: string) => {
    const meta = STATUS_META[status] || { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={meta.variant} className={meta.className}>{meta.label}</Badge>;
  };

  return (
    <div className="admin-content-area p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6" /> Email Log
            </h1>
            <p className="text-sm text-muted-foreground">รายงานการส่งอีเมลทั้งหมดของระบบ</p>
          </div>
        </div>
        <Button variant="outline" onClick={loadLogs} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          รีเฟรช
        </Button>
      </div>

      {/* Range tabs */}
      <Tabs value={range} onValueChange={setRange}>
        <TabsList>
          {RANGE_PRESETS.map((p) => (
            <TabsTrigger key={p.value} value={p.value}>{p.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">ทั้งหมด</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-600" />ส่งสำเร็จ</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{stats.sent}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-1"><XCircle className="w-4 h-4 text-destructive" />ล้มเหลว</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">{stats.failed}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-1"><Ban className="w-4 h-4 text-yellow-600" />ระงับ</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-yellow-600">{stats.suppressed}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-1"><AlertCircle className="w-4 h-4 text-blue-600" />รอส่ง</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-blue-600">{stats.pending}</div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา (อีเมล / หัวเรื่อง / template)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={templateFilter} onValueChange={setTemplateFilter}>
            <SelectTrigger><SelectValue placeholder="Template ทั้งหมด" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Template ทั้งหมด</SelectItem>
              {templateOptions.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="สถานะทั้งหมด" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">สถานะทั้งหมด</SelectItem>
              <SelectItem value="sent">ส่งสำเร็จ</SelectItem>
              <SelectItem value="failed">ล้มเหลว / ตีกลับ</SelectItem>
              <SelectItem value="suppressed">ถูกระงับ</SelectItem>
              <SelectItem value="pending">รอส่ง</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle className="text-base">รายการอีเมล ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เวลา</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>ผู้รับ</TableHead>
                  <TableHead>หัวเรื่อง</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>หมายเหตุ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">กำลังโหลด...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">ไม่มีข้อมูลในช่วงเวลานี้</TableCell></TableRow>
                ) : (
                  filtered.slice(0, 200).map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {format(new Date(r.created_at), 'dd MMM yy HH:mm', { locale: th })}
                      </TableCell>
                      <TableCell className="text-xs font-mono">{r.template_name}</TableCell>
                      <TableCell className="text-sm">{r.recipient_email}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{r.subject || '-'}</TableCell>
                      <TableCell>{statusBadge(r.status)}</TableCell>
                      <TableCell className="text-xs text-destructive max-w-xs truncate" title={r.error_message || ''}>
                        {r.error_message || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {filtered.length > 200 && (
              <p className="text-xs text-muted-foreground text-center mt-2">แสดง 200 รายการแรก จาก {filtered.length} รายการ</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

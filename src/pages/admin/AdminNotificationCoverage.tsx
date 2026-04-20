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
import { ArrowLeft, ShieldCheck, AlertTriangle, XCircle, Mail, Bell, UserCheck, Search, ExternalLink } from 'lucide-react';

/**
 * Notification & Email Coverage Checklist
 * ----------------------------------------
 * แสดงแผนที่ว่า "business event ใดบ้าง" ที่ระบบควรแจ้งเตือน
 * และในแต่ละ event นั้น hook ไว้ครบ 3 ชั้นหรือยัง:
 *   1. customer  — auto-reply / status email ส่งให้ลูกค้า
 *   2. inApp     — notification bell ในระบบ admin
 *   3. adminEmail — อีเมลแจ้งทีมงาน (notifyAdminsByEmail)
 *
 * ใช้ตรวจ coverage ก่อน go-live หรือเช็คหลังเพิ่ม flow ใหม่
 */

type Channel = 'customer' | 'inApp' | 'adminEmail';
type Status = 'done' | 'partial' | 'missing' | 'na';

interface CoverageItem {
  id: string;
  category: string;
  event: string;
  trigger: string;          // ไฟล์/ตำแหน่งที่ trigger
  priority: 'P1' | 'P2' | 'P3';
  channels: Record<Channel, Status>;
  templateName?: string;    // template ที่ใช้ (สำหรับ join กับ email_send_log)
  notes?: string;
}

const CATEGORIES = [
  'RFQ / ใบเสนอราคา',
  'PO / ใบสั่งซื้อ',
  'Invoice / ใบแจ้งหนี้',
  'Payment / การชำระเงิน',
  'Receipt / ใบเสร็จ',
  'Repair / แจ้งซ่อม',
  'Auth / สมาชิก',
  'Contact / ติดต่อ',
  'Affiliate / Partner',
  'Cart / ตะกร้า',
];

// ─────────────────────────────────────────────────────────
// Coverage data — ปรับให้ตรงกับ state จริงในโค้ด
// ─────────────────────────────────────────────────────────
const ITEMS: CoverageItem[] = [
  // RFQ
  { id: 'rfq-customer-receive', category: 'RFQ / ใบเสนอราคา', event: 'ลูกค้าส่ง RFQ — แจ้งลูกค้ารับเรื่อง', trigger: 'QuickRFQForm.tsx, QuoteRequestForm.tsx, QuoteDialog.tsx', priority: 'P1', templateName: 'quote-received-invite', channels: { customer: 'done', inApp: 'na', adminEmail: 'na' } },
  { id: 'rfq-admin-inapp', category: 'RFQ / ใบเสนอราคา', event: 'ลูกค้าส่ง RFQ — แจ้งทีมขายใน in-app', trigger: 'QuoteRequestForm.tsx (notifyAdmins)', priority: 'P1', channels: { customer: 'na', inApp: 'done', adminEmail: 'na' } },
  { id: 'rfq-admin-email', category: 'RFQ / ใบเสนอราคา', event: 'ลูกค้าส่ง RFQ — ส่งอีเมลทีมขาย', trigger: 'QuoteRequestForm.tsx (notifyAdminsByEmail)', priority: 'P1', channels: { customer: 'na', inApp: 'na', adminEmail: 'done' } },
  { id: 'quote-sent', category: 'RFQ / ใบเสนอราคา', event: 'แอดมินส่งใบเสนอราคาให้ลูกค้า', trigger: 'AdminQuoteDetail.tsx → handleSendQuote', priority: 'P1', templateName: 'quote-sent', channels: { customer: 'done', inApp: 'done', adminEmail: 'na' } },
  { id: 'quote-revised', category: 'RFQ / ใบเสนอราคา', event: 'ส่งใบเสนอราคาฉบับแก้ไข', trigger: 'AdminQuoteDetail.tsx', priority: 'P2', channels: { customer: 'partial', inApp: 'done', adminEmail: 'missing' }, notes: 'ควรเพิ่ม email เปรียบเทียบเวอร์ชัน' },

  // PO
  { id: 'po-uploaded-customer', category: 'PO / ใบสั่งซื้อ', event: 'ลูกค้าอัปโหลด PO — ยืนยันรับเรื่อง', trigger: 'POUploadForm.tsx (sendQuoteStatusEmail)', priority: 'P1', channels: { customer: 'done', inApp: 'na', adminEmail: 'na' } },
  { id: 'po-uploaded-admin', category: 'PO / ใบสั่งซื้อ', event: 'ลูกค้าอัปโหลด PO — แจ้งทีมขาย', trigger: 'POUploadForm.tsx (notifyAdmins + notifyAdminsByEmail)', priority: 'P1', channels: { customer: 'na', inApp: 'done', adminEmail: 'done' } },
  { id: 'po-approved', category: 'PO / ใบสั่งซื้อ', event: 'แอดมินอนุมัติ PO', trigger: 'AdminQuoteDetail.tsx → handleApprove', priority: 'P1', channels: { customer: 'done', inApp: 'done', adminEmail: 'na' } },
  { id: 'po-rejected', category: 'PO / ใบสั่งซื้อ', event: 'แอดมินปฏิเสธ PO (พร้อมเหตุผล)', trigger: 'AdminQuoteDetail.tsx → handleReject', priority: 'P1', channels: { customer: 'done', inApp: 'done', adminEmail: 'na' } },

  // Invoice
  { id: 'invoice-created', category: 'Invoice / ใบแจ้งหนี้', event: 'แอดมินออกใบแจ้งหนี้จาก SO', trigger: 'CreateInvoiceFromSODialog.tsx', priority: 'P1', templateName: 'invoice-created', channels: { customer: 'done', inApp: 'done', adminEmail: 'na' } },
  { id: 'invoice-sent', category: 'Invoice / ใบแจ้งหนี้', event: 'ส่ง invoice ให้ลูกค้า', trigger: 'AdminInvoiceDetail.tsx', priority: 'P1', channels: { customer: 'done', inApp: 'done', adminEmail: 'na' } },
  { id: 'invoice-overdue', category: 'Invoice / ใบแจ้งหนี้', event: 'แจ้งเตือน invoice เกินกำหนด', trigger: 'pg_cron (อัตโนมัติ)', priority: 'P2', channels: { customer: 'missing', inApp: 'missing', adminEmail: 'missing' }, notes: 'ยังไม่มี job แจ้ง overdue' },

  // Payment
  { id: 'payment-slip-uploaded', category: 'Payment / การชำระเงิน', event: 'ลูกค้าอัปสลิป — แจ้งแอดมิน', trigger: 'UploadPaymentSlipDialog.tsx', priority: 'P1', channels: { customer: 'done', inApp: 'done', adminEmail: 'partial' }, notes: 'ตรวจว่ามี notifyAdminsByEmail หรือไม่' },
  { id: 'payment-confirmed', category: 'Payment / การชำระเงิน', event: 'แอดมินยืนยันการชำระ', trigger: 'ConfirmPaymentDialog.tsx', priority: 'P1', templateName: 'payment-confirmed', channels: { customer: 'done', inApp: 'done', adminEmail: 'na' } },

  // Receipt
  { id: 'receipt-issued', category: 'Receipt / ใบเสร็จ', event: 'ออกใบเสร็จ', trigger: 'CreateReceiptDialog.tsx', priority: 'P2', channels: { customer: 'done', inApp: 'done', adminEmail: 'na' } },

  // Repair
  { id: 'repair-customer', category: 'Repair / แจ้งซ่อม', event: 'ลูกค้าแจ้งซ่อม — ยืนยันรับเรื่อง', trigger: 'RequestRepairForm.tsx (sendQuoteStatusEmail)', priority: 'P1', channels: { customer: 'done', inApp: 'na', adminEmail: 'na' } },
  { id: 'repair-admin', category: 'Repair / แจ้งซ่อม', event: 'ลูกค้าแจ้งซ่อม — แจ้งทีมช่าง', trigger: 'RequestRepairForm.tsx (notifyAdmins + notifyAdminsByEmail)', priority: 'P1', channels: { customer: 'na', inApp: 'done', adminEmail: 'done' } },
  { id: 'repair-status', category: 'Repair / แจ้งซ่อม', event: 'อัปเดตสถานะงานซ่อม (รับ/ซ่อมเสร็จ/ส่งคืน)', trigger: 'AdminRepairDetail.tsx', priority: 'P2', channels: { customer: 'missing', inApp: 'missing', adminEmail: 'missing' }, notes: 'ยังไม่ wire' },

  // Auth
  { id: 'auth-signup', category: 'Auth / สมาชิก', event: 'ยืนยันอีเมลสมัครสมาชิก', trigger: 'auth-email-hook', priority: 'P1', channels: { customer: 'done', inApp: 'na', adminEmail: 'na' } },
  { id: 'auth-reset', category: 'Auth / สมาชิก', event: 'รีเซ็ตรหัสผ่าน', trigger: 'auth-email-hook', priority: 'P1', channels: { customer: 'done', inApp: 'na', adminEmail: 'na' } },

  // Contact
  { id: 'contact-customer', category: 'Contact / ติดต่อ', event: 'ฟอร์มติดต่อ — auto-reply ลูกค้า', trigger: 'ContactUs.tsx (sendAutoReplyEmail)', priority: 'P1', templateName: 'contact-confirmation', channels: { customer: 'done', inApp: 'na', adminEmail: 'na' } },
  { id: 'contact-admin', category: 'Contact / ติดต่อ', event: 'ฟอร์มติดต่อ — แจ้งแอดมิน', trigger: 'ContactUs.tsx (notifyAdmins)', priority: 'P1', channels: { customer: 'na', inApp: 'done', adminEmail: 'partial' }, notes: 'ตรวจว่ามี notifyAdminsByEmail หรือไม่' },

  // Affiliate / Partner
  { id: 'partner-applied', category: 'Affiliate / Partner', event: 'สมัคร Partner — ยืนยันรับใบสมัคร', trigger: 'PartnerApply', priority: 'P2', templateName: 'partner-application-received', channels: { customer: 'done', inApp: 'partial', adminEmail: 'partial' } },
  { id: 'affiliate-approved', category: 'Affiliate / Partner', event: 'อนุมัติ affiliate', trigger: 'AdminAffiliateApplications', priority: 'P2', channels: { customer: 'partial', inApp: 'partial', adminEmail: 'na' } },
  { id: 'affiliate-payout', category: 'Affiliate / Partner', event: 'จ่าย commission', trigger: 'AdminAffiliatePayouts', priority: 'P3', channels: { customer: 'missing', inApp: 'missing', adminEmail: 'missing' } },

  // Cart
  { id: 'cart-abandoned', category: 'Cart / ตะกร้า', event: 'แจ้งตะกร้าค้าง', trigger: 'pg_cron → cart-abandoned template', priority: 'P3', templateName: 'cart-abandoned', channels: { customer: 'partial', inApp: 'na', adminEmail: 'na' }, notes: 'มี template แต่ตรวจ cron ว่าเปิดใช้' },
  { id: 'liked-reminder', category: 'Cart / ตะกร้า', event: 'แจ้งสินค้าที่ถูกใจ', trigger: 'cron → liked-reminder', priority: 'P3', templateName: 'liked-reminder', channels: { customer: 'partial', inApp: 'na', adminEmail: 'na' } },
];

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const STATUS_META: Record<Status, { label: string; icon: any; className: string }> = {
  done: { label: 'พร้อมใช้', icon: ShieldCheck, className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' },
  partial: { label: 'บางส่วน', icon: AlertTriangle, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200' },
  missing: { label: 'ยังไม่ทำ', icon: XCircle, className: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200' },
  na: { label: '—', icon: () => null, className: 'bg-muted text-muted-foreground border-border' },
};

const CHANNEL_META: Record<Channel, { label: string; icon: any }> = {
  customer: { label: 'ลูกค้า (Email)', icon: UserCheck },
  inApp: { label: 'แอดมิน (In-app)', icon: Bell },
  adminEmail: { label: 'แอดมิน (Email)', icon: Mail },
};

function rowOverallStatus(item: CoverageItem): Status {
  const channels = Object.values(item.channels).filter((s) => s !== 'na');
  if (channels.length === 0) return 'na';
  if (channels.every((s) => s === 'done')) return 'done';
  if (channels.some((s) => s === 'missing')) return channels.some((s) => s === 'done') ? 'partial' : 'missing';
  return 'partial';
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export default function AdminNotificationCoverage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | Status | 'P1'>('all');
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sendStats, setSendStats] = useState<Record<string, { sent: number; failed: number }>>({});
  const [loadingStats, setLoadingStats] = useState(true);

  // โหลดสถิติ 7 วันจาก email_send_log (group by template_name) — dedup by message_id
  useEffect(() => {
    const load = async () => {
      try {
        const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
        const { data, error } = await (supabase as any)
          .from('email_send_log')
          .select('template_name, status, message_id, created_at')
          .gte('created_at', since)
          .limit(5000);
        if (error) throw error;
        // dedup latest per message_id
        const latest = new Map<string, any>();
        (data || []).forEach((r: any) => {
          const key = r.message_id || `${r.template_name}-${r.created_at}`;
          const cur = latest.get(key);
          if (!cur || new Date(r.created_at) > new Date(cur.created_at)) latest.set(key, r);
        });
        const stats: Record<string, { sent: number; failed: number }> = {};
        latest.forEach((r) => {
          const k = r.template_name || 'unknown';
          if (!stats[k]) stats[k] = { sent: 0, failed: 0 };
          if (r.status === 'sent') stats[k].sent++;
          else if (['failed', 'dlq', 'bounced'].includes(r.status)) stats[k].failed++;
        });
        setSendStats(stats);
      } catch (e) {
        console.warn('[AdminNotificationCoverage] load stats failed:', e);
      } finally {
        setLoadingStats(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return ITEMS.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (filter === 'P1' && item.priority !== 'P1') return false;
      if (['done', 'partial', 'missing'].includes(filter)) {
        if (rowOverallStatus(item) !== filter) return false;
      }
      if (search) {
        const hay = `${item.event} ${item.trigger} ${item.notes ?? ''}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [filter, category, search]);

  const summary = useMemo(() => {
    const s = { total: ITEMS.length, done: 0, partial: 0, missing: 0, p1Pending: 0 };
    ITEMS.forEach((item) => {
      const st = rowOverallStatus(item);
      if (st === 'done') s.done++;
      else if (st === 'partial') s.partial++;
      else if (st === 'missing') s.missing++;
      if (item.priority === 'P1' && st !== 'done' && st !== 'na') s.p1Pending++;
    });
    return s;
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 admin-content-area">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <div>
              <h1 className="text-2xl font-bold">แผนที่การแจ้งเตือน (Coverage Map)</h1>
              <p className="text-sm text-muted-foreground">ตรวจว่าระบบแจ้งเตือน/อีเมลแต่ละ event ทำครบหรือยัง</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/email-log')}>
            <ExternalLink className="w-4 h-4 mr-1" /> ดู Log การส่งจริง
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <SummaryCard label="ทั้งหมด" value={summary.total} />
          <SummaryCard label="พร้อมใช้" value={summary.done} className="text-green-700" />
          <SummaryCard label="บางส่วน" value={summary.partial} className="text-yellow-700" />
          <SummaryCard label="ยังไม่ทำ" value={summary.missing} className="text-red-700" />
          <SummaryCard label="P1 ค้าง" value={summary.p1Pending} className="text-red-700" />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="done">พร้อมใช้</TabsTrigger>
                <TabsTrigger value="partial">บางส่วน</TabsTrigger>
                <TabsTrigger value="missing">ยังไม่ทำ</TabsTrigger>
                <TabsTrigger value="P1">P1 เท่านั้น</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="sm:w-64"><SelectValue placeholder="หมวดหมู่" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="ค้นหา event / ไฟล์..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">รายการ Event ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">ลูกค้า</TableHead>
                  <TableHead className="text-center">Admin In-app</TableHead>
                  <TableHead className="text-center">Admin Email</TableHead>
                  <TableHead className="text-center">7 วัน (sent/fail)</TableHead>
                  <TableHead>Trigger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const stats = item.templateName ? sendStats[item.templateName] : undefined;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="max-w-xs">
                        <div className="font-medium text-sm">{item.event}</div>
                        {item.notes && <div className="text-xs text-muted-foreground mt-0.5">{item.notes}</div>}
                      </TableCell>
                      <TableCell><span className="text-xs text-muted-foreground">{item.category}</span></TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={item.priority === 'P1' ? 'border-red-300 text-red-700' : item.priority === 'P2' ? 'border-yellow-300 text-yellow-700' : 'border-border'}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <ChannelCell status={item.channels.customer} />
                      <ChannelCell status={item.channels.inApp} />
                      <ChannelCell status={item.channels.adminEmail} />
                      <TableCell className="text-center text-xs">
                        {loadingStats ? '…' : stats ? (
                          <span><span className="text-green-700 font-medium">{stats.sent}</span> / <span className="text-red-700">{stats.failed}</span></span>
                        ) : item.templateName ? <span className="text-muted-foreground">0 / 0</span> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground max-w-xs truncate" title={item.trigger}>{item.trigger}</TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">ไม่พบรายการ</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-2">คำอธิบาย</div>
            <div className="flex flex-wrap gap-2 text-xs">
              {(Object.keys(STATUS_META) as Status[]).filter((s) => s !== 'na').map((s) => (
                <Badge key={s} variant="outline" className={STATUS_META[s].className}>{STATUS_META[s].label}</Badge>
              ))}
              <span className="text-muted-foreground ml-2">P1 = critical, P2 = important, P3 = nice-to-have</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
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

function ChannelCell({ status }: { status: Status }) {
  const meta = STATUS_META[status];
  if (status === 'na') {
    return <TableCell className="text-center text-muted-foreground">—</TableCell>;
  }
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

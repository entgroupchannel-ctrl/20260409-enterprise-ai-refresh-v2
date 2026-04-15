import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  TrendingUp, TrendingDown, DollarSign, FileText, Users, Package,
  ShoppingCart, Wrench, BarChart3, Target, Clock, AlertTriangle,
  CheckCircle, RefreshCw, Download, Star,
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, startOfYear } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  QuoteStatusDonut,
  RevenueTrendLine,
  WinLossDonut,
  TopCustomersBar,
  ArApGroupedBar,
  RepairStatusBar,
  SupplierPoBar,
} from '@/components/admin/AdminReportsCharts';

const fmt = (n: number, decimals = 0) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const fmtTHB = (n: number) => `฿${fmt(n)}`;
const fmtUSD = (n: number) => `$${fmt(n, 2)}`;
const pct = (a: number, b: number) => b === 0 ? '0%' : `${Math.round((a / b) * 100)}%`;

type Period = '7d' | '30d' | '90d' | 'ytd' | '1y';
const periodLabel: Record<Period, string> = {
  '7d': '7 วัน', '30d': '30 วัน', '90d': '90 วัน', ytd: 'ปีนี้', '1y': '12 เดือน',
};

const getPeriodRange = (period: Period): { from: Date; to: Date } => {
  const to = new Date();
  const from =
    period === '7d'  ? new Date(Date.now() - 7  * 86400000) :
    period === '30d' ? new Date(Date.now() - 30 * 86400000) :
    period === '90d' ? new Date(Date.now() - 90 * 86400000) :
    period === 'ytd' ? startOfYear(to) :
                       subMonths(to, 12);
  return { from, to };
};

const MetricCard = ({
  label, value, sub, icon: Icon, trend, color = 'blue',
}: {
  label: string; value: string; sub?: string; icon: any; trend?: number; color?: string;
}) => {
  const colors: Record<string, string> = {
    blue:   'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
    green:  'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
    amber:  'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
    red:    'text-red-600 bg-red-50 dark:bg-red-950/30',
    purple: 'text-violet-600 bg-violet-50 dark:bg-violet-950/30',
  };
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between mb-2">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <p className="text-2xl font-semibold tabular-nums mt-1">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {sub && <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
};

const SectionHeader = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-4">
    <h2 className="text-base font-semibold">{title}</h2>
    <p className="text-xs text-muted-foreground">{sub}</p>
  </div>
);

export default function AdminReports() {
  const { profile, isAdmin, isSuperAdmin, isAccountant, isSales } = useAuth();
  const canFinance   = isAccountant || isAdmin || isSuperAdmin;
  const canExec      = isAdmin || isSuperAdmin;
  const canSales     = isSales || isAdmin || isSuperAdmin;

  const [period, setPeriod] = useState<Period>('30d');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(canExec ? 'executive' : canSales ? 'sales' : 'finance');

  // ── Data State ────────────────────────────────────────────────────────
  const [execData, setExecData] = useState<any>({});
  const [salesData, setSalesData] = useState<any>({});
  const [financeData, setFinanceData] = useState<any>({});
  const [opsData, setOpsData] = useState<any>({});
  const [revenueTrend, setRevenueTrend] = useState<{ month: string; revenue: number }[]>([]);
  const [arApMonthly, setArApMonthly] = useState<{ month: string; ar: number; ap: number }[]>([]);
  const [supplierPoData, setSupplierPoData] = useState<{ name: string; value: number }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const { from, to } = getPeriodRange(period);
    const fromISO = from.toISOString();
    const toISO   = to.toISOString();

    await Promise.all([
      canExec    && loadExecData(fromISO, toISO),
      canSales   && loadSalesData(fromISO, toISO),
      canFinance && loadFinanceData(fromISO, toISO),
      (canSales || canFinance) && loadOpsData(fromISO, toISO),
    ].filter(Boolean));

    setLoading(false);
  }, [period, canExec, canSales, canFinance]);

  useEffect(() => { load(); }, [load]);

  // ── Executive Data ────────────────────────────────────────────────────
  const loadExecData = async (from: string, to: string) => {
    const [quoteRes, invoiceRes, payRes, poRes, supplierRes, customerRes] = await Promise.all([
      supabase.from('quote_requests').select('status, grand_total, created_at, assigned_to').is('deleted_at', null),
      supabase.from('invoices').select('status, grand_total, invoice_date, due_date, vat_amount').is('deleted_at', null).gte('invoice_date', from).lte('invoice_date', to),
      supabase.from('payment_records').select('amount, verification_status, created_at').eq('verification_status', 'verified').gte('created_at', from).lte('created_at', to),
      supabase.from('purchase_orders').select('grand_total, status, currency').is('deleted_at', null).gte('created_at', from).lte('created_at', to),
      supabase.from('suppliers').select('id, status').is('deleted_at', null),
      supabase.from('quote_requests').select('customer_email').is('deleted_at', null).gte('created_at', from).lte('created_at', to),
    ]);

    const quotes = (quoteRes.data ?? []) as any[];
    const invoices = (invoiceRes.data ?? []) as any[];
    const payments = (payRes.data ?? []) as any[];
    const pos = (poRes.data ?? []) as any[];

    const totalRevenue   = payments.reduce((s, p) => s + (p.amount ?? 0), 0);
    const pendingInv     = invoices.filter(i => i.status === 'pending' || i.status === 'sent');
    const pendingAR      = pendingInv.reduce((s, i) => s + (i.grand_total ?? 0), 0);
    const overdueInv     = invoices.filter(i => i.due_date && new Date(i.due_date) < new Date() && i.status !== 'paid');
    const poSpend        = pos.filter(p => p.currency === 'USD' || !p.currency).reduce((s, p) => s + (p.grand_total ?? 0), 0);

    const activeQuotes   = quotes.filter(q => !['completed','cancelled','rejected'].includes(q.status));
    const wonQuotes      = quotes.filter(q => q.status === 'completed');
    const totalClosed    = quotes.filter(q => ['completed','rejected','cancelled'].includes(q.status));
    const winRate        = totalClosed.length === 0 ? 0 : Math.round((wonQuotes.length / totalClosed.length) * 100);

    const statusBreakdown: Record<string, number> = {};
    for (const q of quotes) {
      statusBreakdown[q.status] = (statusBreakdown[q.status] ?? 0) + 1;
    }

    // Revenue trend by month
    const revenueByMonth: Record<string, number> = {};
    for (const p of payments) {
      const month = p.created_at.slice(0, 7);
      revenueByMonth[month] = (revenueByMonth[month] ?? 0) + (p.amount ?? 0);
    }
    const revTrend = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([month, revenue]) => ({
        month: new Date(month + '-01').toLocaleDateString('th-TH', { month: 'short', year: '2-digit' }),
        revenue: Math.round(revenue),
      }));
    setRevenueTrend(revTrend);

    setExecData({
      totalRevenue, pendingAR, poSpend,
      activeQuotes: activeQuotes.length,
      winRate,
      totalQuotes: quotes.length,
      overdueCount: overdueInv.length,
      overdueAmount: overdueInv.reduce((s, i) => s + (i.grand_total ?? 0), 0),
      approvedSuppliers: (supplierRes.data ?? []).filter((s: any) => s.status === 'approved').length,
      newCustomers: (customerRes.data ?? []).length,
      statusBreakdown,
      recentInvoices: invoices.slice(0, 8),
    });
  };

  // ── Sales Data ────────────────────────────────────────────────────────
  const loadSalesData = async (from: string, to: string) => {
    const [quoteRes, msgRes] = await Promise.all([
      supabase.from('quote_requests').select('id, status, grand_total, created_at, customer_name, customer_company, assigned_to, quote_number').is('deleted_at', null).gte('created_at', from).lte('created_at', to).order('created_at', { ascending: false }),
      supabase.from('quote_messages').select('quote_id, created_at').gte('created_at', from).lte('created_at', to),
    ]);

    const quotes = (quoteRes.data ?? []) as any[];
    const msgs   = (msgRes.data ?? []) as any[];

    const wonQuotes  = quotes.filter(q => q.status === 'completed');
    const lostQuotes = quotes.filter(q => ['rejected','cancelled'].includes(q.status));
    const totalValue = wonQuotes.reduce((s, q) => s + (q.grand_total ?? 0), 0);
    const avgDealSize = wonQuotes.length === 0 ? 0 : totalValue / wonQuotes.length;

    // By status breakdown
    const byStatus: Record<string, { count: number; value: number }> = {};
    for (const q of quotes) {
      if (!byStatus[q.status]) byStatus[q.status] = { count: 0, value: 0 };
      byStatus[q.status].count++;
      byStatus[q.status].value += q.grand_total ?? 0;
    }

    // Top customers
    const custMap: Record<string, { name: string; company: string; count: number; value: number }> = {};
    for (const q of wonQuotes) {
      const key = q.customer_email ?? q.customer_name;
      if (!custMap[key]) custMap[key] = { name: q.customer_name, company: q.customer_company, count: 0, value: 0 };
      custMap[key].count++;
      custMap[key].value += q.grand_total ?? 0;
    }
    const topCustomers = Object.values(custMap).sort((a, b) => b.value - a.value).slice(0, 8);

    // Chat activity
    const chatActive = new Set(msgs.map((m: any) => m.quote_id)).size;

    setSalesData({
      totalQuotes: quotes.length,
      wonQuotes: wonQuotes.length,
      lostQuotes: lostQuotes.length,
      totalValue,
      avgDealSize,
      winRate: quotes.length === 0 ? 0 : Math.round((wonQuotes.length / quotes.length) * 100),
      byStatus,
      topCustomers,
      chatActive,
      recentQuotes: quotes.slice(0, 10),
    });
  };

  // ── Finance Data ──────────────────────────────────────────────────────
  const loadFinanceData = async (from: string, to: string) => {
    const [invRes, payRes, trRes, poRes] = await Promise.all([
      supabase.from('invoices').select('id, invoice_number, status, grand_total, due_date, invoice_date, customer_name, customer_company, vat_amount').is('deleted_at', null).order('invoice_date', { ascending: false }),
      supabase.from('payment_records').select('amount, verification_status, created_at, payment_method').gte('created_at', from).lte('created_at', to),
      supabase.from('international_transfer_requests').select('amount, currency, status, amount_thb, transfer_fee, bank_fee, other_fee, created_at').gte('created_at', from).lte('created_at', to),
      supabase.from('purchase_orders').select('grand_total, currency, status').is('deleted_at', null).gte('created_at', from).lte('created_at', to),
    ]);

    const invoices = (invRes.data ?? []) as any[];
    const payments = (payRes.data ?? []) as any[];
    const transfers = (trRes.data ?? []) as any[];
    const pos = (poRes.data ?? []) as any[];

    const verified = payments.filter(p => p.verification_status === 'verified');
    const totalReceived = verified.reduce((s, p) => s + (p.amount ?? 0), 0);
    const overdueInv = invoices.filter(i => i.due_date && new Date(i.due_date) < new Date() && !['paid','cancelled'].includes(i.status));
    const pendingInv = invoices.filter(i => ['sent','pending'].includes(i.status) && !(i.due_date && new Date(i.due_date) < new Date()));
    const totalAR = [...overdueInv, ...pendingInv].reduce((s, i) => s + (i.grand_total ?? 0), 0);
    const transferred = transfers.filter(t => t.status === 'transferred');
    const totalPaidUSD = transferred.reduce((s, t) => s + (t.amount ?? 0), 0);
    const totalFees = transfers.reduce((s, t) => s + ((t.transfer_fee ?? 0) + (t.bank_fee ?? 0) + (t.other_fee ?? 0)), 0);
    const totalAP = pos.filter(p => !['received','cancelled'].includes(p.status)).reduce((s, p) => s + (p.grand_total ?? 0), 0);

    // AR/AP monthly
    const arByMonth: Record<string, number> = {};
    for (const inv of invoices) {
      if (!inv.invoice_date) continue;
      const m = inv.invoice_date.slice(0, 7);
      if (!['paid', 'cancelled'].includes(inv.status)) {
        arByMonth[m] = (arByMonth[m] ?? 0) + (inv.grand_total ?? 0);
      }
    }
    const apByMonth: Record<string, number> = {};
    for (const po of pos) {
      if (!po.created_at) continue;
      const m = po.created_at.slice(0, 7);
      apByMonth[m] = (apByMonth[m] ?? 0) + (po.grand_total ?? 0) * 35;
    }
    const allMonths = [...new Set([...Object.keys(arByMonth), ...Object.keys(apByMonth)])].sort().slice(-8);
    setArApMonthly(allMonths.map(m => ({
      month: new Date(m + '-01').toLocaleDateString('th-TH', { month: 'short', year: '2-digit' }),
      ar: Math.round(arByMonth[m] ?? 0),
      ap: Math.round(apByMonth[m] ?? 0),
    })));

    setFinanceData({
      totalReceived, totalAR, totalPaidUSD, totalFees, totalAP,
      overdueInv: overdueInv.slice(0, 10),
      overdueCount: overdueInv.length,
      overdueAmount: overdueInv.reduce((s, i) => s + (i.grand_total ?? 0), 0),
      pendingTransfers: transfers.filter(t => ['pending','approved'].includes(t.status)).length,
      transferredCount: transferred.length,
      recentPayments: payments.slice(0, 8),
      allInvoices: invoices.slice(0, 12),
    });
  };

  // ── Operations Data ───────────────────────────────────────────────────
  const loadOpsData = async (from: string, to: string) => {
    const [poRes, supplierRes, repairRes, productRes] = await Promise.all([
      supabase.from('purchase_orders').select('id, po_number, status, grand_total, currency, supplier_id, expected_delivery, order_date').is('deleted_at', null).order('created_at', { ascending: false }),
      supabase.from('suppliers').select('id, company_name, supplier_code, status, quality_rating, is_preferred').is('deleted_at', null).eq('status', 'approved').order('quality_rating', { ascending: false }),
      supabase.from('repair_orders').select('id, status, grand_total, is_chargeable, created_at, completed_date').is('deleted_at', null).gte('created_at', from).lte('created_at', to),
      supabase.from('products').select('id, model, category, buy_price, sell_price').eq('is_active', true),
    ]);

    const pos = (poRes.data ?? []) as any[];
    const suppliers = (supplierRes.data ?? []) as any[];
    const repairs = (repairRes.data ?? []) as any[];

    const overduePos = pos.filter(p => p.expected_delivery && new Date(p.expected_delivery) < new Date() && !['received','cancelled'].includes(p.status));
    const activePos  = pos.filter(p => !['received','cancelled'].includes(p.status));
    const repairByStatus: Record<string, number> = {};
    for (const r of repairs) repairByStatus[r.status] = (repairByStatus[r.status] ?? 0) + 1;

    const completedRepairs = repairs.filter(r => r.completed_date && r.created_at);
    const avgRepairDays = completedRepairs.length === 0 ? 0 :
      Math.round(completedRepairs.reduce((s, r) => {
        return s + (new Date(r.completed_date).getTime() - new Date(r.created_at).getTime()) / 86400000;
      }, 0) / completedRepairs.length);

    // Supplier PO value
    const { data: supplierNames } = await supabase
      .from('suppliers')
      .select('id, company_name')
      .is('deleted_at', null);
    const snMap: Record<string, string> = {};
    for (const s of supplierNames ?? []) snMap[s.id] = s.company_name;
    const poBySupplier: Record<string, number> = {};
    for (const po of pos) {
      if (!po.supplier_id) continue;
      poBySupplier[po.supplier_id] = (poBySupplier[po.supplier_id] ?? 0) + (po.grand_total ?? 0);
    }
    const spData = Object.entries(poBySupplier)
      .map(([id, value]) => ({ name: snMap[id] ?? 'Unknown', value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    setSupplierPoData(spData);

    setOpsData({
      activePos: activePos.length,
      overduePos: overduePos.slice(0, 8),
      overduePoCount: overduePos.length,
      topSuppliers: suppliers.slice(0, 8),
      repairByStatus,
      totalRepairs: repairs.length,
      avgRepairDays,
      chargeableRepairs: repairs.filter(r => r.is_chargeable).length,
      productCount: (productRes.data ?? []).length,
      recentPos: pos.slice(0, 10),
    });
  };

  const statusColors: Record<string, string> = {
    pending:     'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    quote_sent:  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    in_review:   'bg-purple-100 text-purple-800',
    po_uploaded: 'bg-indigo-100 text-indigo-800',
    completed:   'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled:   'bg-red-100 text-red-800',
    rejected:    'bg-red-100 text-red-800',
    sent:        'bg-blue-100 text-blue-800',
    paid:        'bg-green-100 text-green-800',
    draft:       'bg-muted text-muted-foreground',
    approved:    'bg-blue-100 text-blue-800',
    transferred: 'bg-green-100 text-green-800',
    received:    'bg-green-100 text-green-800',
    confirmed:   'bg-blue-100 text-blue-800',
  };
  const StatusBadge = ({ status }: { status: string }) => (
    <Badge className={`text-xs ${statusColors[status] ?? 'bg-muted text-muted-foreground'}`}>
      {status}
    </Badge>
  );

  const periodTabs = (Object.keys(periodLabel) as Period[]).map(p => ({ value: p, label: periodLabel[p] }));

  return (
    <AdminLayout>
      <div className="admin-content-area space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold">รายงาน</h1>
            <p className="text-sm text-muted-foreground">Business Intelligence — B2B System</p>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={period} onValueChange={v => setPeriod(v as Period)}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodTabs.map(p => (
                  <SelectItem key={p.value} value={p.value} className="text-xs">{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={load} disabled={loading}>
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
          </div>
        </div>

        {/* Period badge */}
        <div className="text-xs text-muted-foreground">
          ช่วงเวลา: <span className="font-medium text-foreground">{periodLabel[period]}</span>
          {' '}({format(getPeriodRange(period).from, 'dd MMM yy', { locale: th })} – {format(new Date(), 'dd MMM yy', { locale: th })})
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-auto flex-wrap">
            {canExec    && <TabsTrigger value="executive" className="text-xs gap-1.5"><BarChart3 className="w-3.5 h-3.5" />Executive</TabsTrigger>}
            {canSales   && <TabsTrigger value="sales"     className="text-xs gap-1.5"><Target className="w-3.5 h-3.5" />ฝ่ายขาย</TabsTrigger>}
            {canFinance && <TabsTrigger value="finance"   className="text-xs gap-1.5"><DollarSign className="w-3.5 h-3.5" />การเงิน</TabsTrigger>}
            {(canSales || canFinance) && <TabsTrigger value="ops" className="text-xs gap-1.5"><Package className="w-3.5 h-3.5" />Operations</TabsTrigger>}
          </TabsList>

          {/* ══════════════════════════════════════════════════════
              TAB 1 — EXECUTIVE DASHBOARD
          ══════════════════════════════════════════════════════ */}
          {canExec && (
            <TabsContent value="executive" className="space-y-6 mt-4">
              <SectionHeader title="Executive Dashboard" sub="ภาพรวมธุรกิจสำหรับผู้บริหาร" />

              {/* KPI row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="รายรับ (THB)" value={fmtTHB(execData.totalRevenue ?? 0)} icon={DollarSign} color="green" sub={`ช่วง ${periodLabel[period]}`} />
                <MetricCard label="AR ค้างรับ"   value={fmtTHB(execData.pendingAR ?? 0)}    icon={Clock}       color="amber" sub={`${execData.overdueCount ?? 0} Invoice เลยกำหนด`} />
                <MetricCard label="Quote active"  value={String(execData.activeQuotes ?? 0)} icon={FileText}    color="blue"  sub="กำลังดำเนินการ" />
                <MetricCard label="Win Rate"      value={`${execData.winRate ?? 0}%`}        icon={Target}      color="purple" sub={`${execData.totalQuotes ?? 0} Quote ทั้งหมด`} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="จ่าย Supplier (USD)" value={fmtUSD(execData.poSpend ?? 0)}          icon={ShoppingCart} color="blue"  />
                <MetricCard label="Supplier อนุมัติ"    value={String(execData.approvedSuppliers ?? 0)} icon={Users}       color="green" />
                <MetricCard label="ลูกค้าใหม่"          value={String(execData.newCustomers ?? 0)}      icon={Users}       color="purple" sub={`ช่วง ${periodLabel[period]}`} />
                <MetricCard label="Invoice เลยกำหนด"   value={`${execData.overdueCount ?? 0} รายการ`} icon={AlertTriangle} color="red" sub={fmtTHB(execData.overdueAmount ?? 0)} />
              </div>

              {/* Quote status + Revenue trend charts */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quote Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuoteStatusDonut statusBreakdown={execData.statusBreakdown ?? {}} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RevenueTrendLine data={revenueTrend} />
                  </CardContent>
                </Card>
              </div>

              {/* Invoice table */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Invoice ล่าสุด</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">เลข Invoice</TableHead>
                        <TableHead className="text-xs">ลูกค้า</TableHead>
                        <TableHead className="text-xs text-right">ยอด</TableHead>
                        <TableHead className="text-xs">สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(execData.recentInvoices ?? []).map((inv: any) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                          <TableCell className="text-xs">{inv.customer_name}</TableCell>
                          <TableCell className="text-xs text-right tabular-nums">{fmtTHB(inv.grand_total ?? 0)}</TableCell>
                          <TableCell><StatusBadge status={inv.status} /></TableCell>
                        </TableRow>
                      ))}
                      {(execData.recentInvoices ?? []).length === 0 && (
                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground text-xs py-6">ไม่มีข้อมูล</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ══════════════════════════════════════════════════════
              TAB 2 — SALES
          ══════════════════════════════════════════════════════ */}
          {canSales && (
            <TabsContent value="sales" className="space-y-6 mt-4">
              <SectionHeader title="รายงานฝ่ายขาย" sub="Pipeline, Performance, และลูกค้า" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="Quote ทั้งหมด"  value={String(salesData.totalQuotes ?? 0)} icon={FileText}  color="blue"   sub={`ช่วง ${periodLabel[period]}`} />
                <MetricCard label="Win Rate"       value={`${salesData.winRate ?? 0}%`}       icon={Target}    color="green"  sub={`ปิดได้ ${salesData.wonQuotes ?? 0} รายการ`} />
                <MetricCard label="ยอดขายรวม"     value={fmtTHB(salesData.totalValue ?? 0)}  icon={DollarSign} color="green" />
                <MetricCard label="ขนาด Deal เฉลี่ย" value={fmtTHB(salesData.avgDealSize ?? 0)} icon={TrendingUp} color="purple" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="Quote ปิดแล้ว" value={String(salesData.wonQuotes ?? 0)}  icon={CheckCircle}    color="green" />
                <MetricCard label="Quote ไม่สำเร็จ" value={String(salesData.lostQuotes ?? 0)} icon={TrendingDown}  color="red"   />
                <MetricCard label="Chat active"   value={String(salesData.chatActive ?? 0)} icon={FileText}       color="blue"  sub="Quote ที่มีการสนทนา" />
                <MetricCard label="สินค้า active"  value={String(opsData.productCount ?? 0)} icon={Package}        color="amber" />
              </div>

              {/* Pipeline table + Top customers */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quote ล่าสุด</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">เลข</TableHead>
                          <TableHead className="text-xs">ลูกค้า</TableHead>
                          <TableHead className="text-xs text-right">ยอด</TableHead>
                          <TableHead className="text-xs">สถานะ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(salesData.recentQuotes ?? []).map((q: any) => (
                          <TableRow key={q.id}>
                            <TableCell className="font-mono text-xs">{q.quote_number}</TableCell>
                            <TableCell>
                              <div className="text-xs font-medium leading-tight">{q.customer_name}</div>
                              {q.customer_company && <div className="text-[10px] text-muted-foreground">{q.customer_company}</div>}
                            </TableCell>
                            <TableCell className="text-xs text-right tabular-nums">{q.grand_total ? fmtTHB(q.grand_total) : '—'}</TableCell>
                            <TableCell><StatusBadge status={q.status} /></TableCell>
                          </TableRow>
                        ))}
                        {(salesData.recentQuotes ?? []).length === 0 && (
                          <TableRow><TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">ไม่มีข้อมูล</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Win / Loss Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WinLossDonut
                      won={salesData.wonQuotes ?? 0}
                      lost={salesData.lostQuotes ?? 0}
                      active={(salesData.totalQuotes ?? 0) - (salesData.wonQuotes ?? 0) - (salesData.lostQuotes ?? 0)}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Top ลูกค้า</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TopCustomersBar customers={salesData.topCustomers ?? []} />
                  </CardContent>
                </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* ══════════════════════════════════════════════════════
              TAB 3 — FINANCE
          ══════════════════════════════════════════════════════ */}
          {canFinance && (
            <TabsContent value="finance" className="space-y-6 mt-4">
              <SectionHeader title="รายงานการเงิน" sub="รายรับ-รายจ่าย, AR/AP, และโอนเงินต่างประเทศ" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="รับชำระแล้ว (THB)"  value={fmtTHB(financeData.totalReceived ?? 0)}   icon={DollarSign}    color="green" sub={`ช่วง ${periodLabel[period]}`} />
                <MetricCard label="AR ค้างรับ"          value={fmtTHB(financeData.totalAR ?? 0)}        icon={Clock}         color="amber" sub="ยังไม่ชำระ" />
                <MetricCard label="Invoice เลยกำหนด"   value={`${financeData.overdueCount ?? 0} ใบ`}   icon={AlertTriangle}  color="red"   sub={fmtTHB(financeData.overdueAmount ?? 0)} />
                <MetricCard label="AP ค้างจ่าย (USD)"  value={fmtUSD(financeData.totalAP ?? 0)}        icon={ShoppingCart}  color="purple" sub="PO ยังไม่รับของ" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="โอนต่างประเทศแล้ว" value={fmtUSD(financeData.totalPaidUSD ?? 0)}   icon={TrendingUp}  color="blue"   sub={`${financeData.transferredCount ?? 0} รายการ`} />
                <MetricCard label="ค่าธรรมเนียมรวม"   value={fmtTHB(financeData.totalFees ?? 0)}     icon={DollarSign}  color="amber"  />
                <MetricCard label="รออนุมัติโอน"       value={String(financeData.pendingTransfers ?? 0)} icon={Clock}    color="red"    />
                <MetricCard label="Net Position"        value={fmtTHB((financeData.totalReceived ?? 0) - (financeData.totalAR ?? 0))} icon={BarChart3} color="green" />
              </div>

              {/* AR vs AP chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">AR vs AP รายเดือน</CardTitle>
                </CardHeader>
                <CardContent>
                  <ArApGroupedBar data={arApMonthly} />
                </CardContent>
              </Card>

              {/* Overdue invoices + All invoices */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Invoice เลยกำหนดชำระ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Invoice</TableHead>
                          <TableHead className="text-xs">ลูกค้า</TableHead>
                          <TableHead className="text-xs">ครบกำหนด</TableHead>
                          <TableHead className="text-xs text-right">ยอด</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(financeData.overdueInv ?? []).map((inv: any) => (
                          <TableRow key={inv.id} className="bg-red-50/30 dark:bg-red-950/10">
                            <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                            <TableCell className="text-xs">{inv.customer_name}</TableCell>
                            <TableCell className="text-xs text-red-600 font-medium">
                              {inv.due_date ? format(new Date(inv.due_date), 'dd MMM yy', { locale: th }) : '—'}
                            </TableCell>
                            <TableCell className="text-xs text-right tabular-nums font-medium">{fmtTHB(inv.grand_total ?? 0)}</TableCell>
                          </TableRow>
                        ))}
                        {(financeData.overdueInv ?? []).length === 0 && (
                          <TableRow><TableCell colSpan={4} className="text-center text-xs text-emerald-600 py-6">✓ ไม่มี Invoice เลยกำหนด</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Invoice ทั้งหมด</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Invoice</TableHead>
                          <TableHead className="text-xs">ลูกค้า</TableHead>
                          <TableHead className="text-xs text-right">ยอด</TableHead>
                          <TableHead className="text-xs">สถานะ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(financeData.allInvoices ?? []).map((inv: any) => (
                          <TableRow key={inv.id}>
                            <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                            <TableCell className="text-xs">{inv.customer_name}</TableCell>
                            <TableCell className="text-xs text-right tabular-nums">{fmtTHB(inv.grand_total ?? 0)}</TableCell>
                            <TableCell><StatusBadge status={inv.status} /></TableCell>
                          </TableRow>
                        ))}
                        {(financeData.allInvoices ?? []).length === 0 && (
                          <TableRow><TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">ไม่มีข้อมูล</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* ══════════════════════════════════════════════════════
              TAB 4 — OPERATIONS
          ══════════════════════════════════════════════════════ */}
          {(canSales || canFinance) && (
            <TabsContent value="ops" className="space-y-6 mt-4">
              <SectionHeader title="รายงาน Operations" sub="PO, Supplier, สินค้า, และงานซ่อม" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="PO active"      value={String(opsData.activePos ?? 0)}      icon={ShoppingCart} color="blue"  />
                <MetricCard label="PO เลยกำหนด"    value={String(opsData.overduePoCount ?? 0)} icon={AlertTriangle} color="red" sub="ยังไม่รับของ" />
                <MetricCard label="Repair orders"  value={String(opsData.totalRepairs ?? 0)}   icon={Wrench}       color="amber" sub={`ช่วง ${periodLabel[period]}`} />
                <MetricCard label="เฉลี่ย repair"  value={`${opsData.avgRepairDays ?? 0} วัน`} icon={Clock}        color="purple" sub="จนเสร็จ" />
              </div>

              {/* PO overdue + Supplier scorecard */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      PO เลยกำหนดส่ง
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">PO Number</TableHead>
                          <TableHead className="text-xs">กำหนดส่ง</TableHead>
                          <TableHead className="text-xs text-right">ยอด (USD)</TableHead>
                          <TableHead className="text-xs">สถานะ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(opsData.overduePos ?? []).map((po: any) => (
                          <TableRow key={po.id} className="bg-red-50/30 dark:bg-red-950/10">
                            <TableCell className="font-mono text-xs">{po.po_number}</TableCell>
                            <TableCell className="text-xs text-red-600 font-medium">
                              {po.expected_delivery ? format(new Date(po.expected_delivery), 'dd MMM yy', { locale: th }) : '—'}
                            </TableCell>
                            <TableCell className="text-xs text-right tabular-nums">{po.grand_total ? fmtUSD(po.grand_total) : '—'}</TableCell>
                            <TableCell><StatusBadge status={po.status} /></TableCell>
                          </TableRow>
                        ))}
                        {(opsData.overduePos ?? []).length === 0 && (
                          <TableRow><TableCell colSpan={4} className="text-center text-xs text-emerald-600 py-6">✓ ไม่มี PO เลยกำหนด</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      Supplier Scorecard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2.5">
                      {(opsData.topSuppliers ?? []).map((s: any, i: number) => (
                        <div key={s.id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{s.company_name}</p>
                              {s.supplier_code && <p className="text-[10px] text-muted-foreground font-mono">{s.supplier_code}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {s.is_preferred && <Badge className="text-[10px] bg-amber-100 text-amber-800 px-1.5">Preferred</Badge>}
                            {s.quality_rating != null && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="text-xs font-semibold">{s.quality_rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {(opsData.topSuppliers ?? []).length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">ไม่มีข้อมูล Supplier</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Repair + Supplier charts */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Wrench className="w-4 h-4" /> Repair Orders ตาม Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RepairStatusBar repairByStatus={opsData.repairByStatus ?? {}} />
                    <div className="mt-3 pt-3 border-t flex gap-4 text-xs text-muted-foreground">
                      <span>Chargeable: <strong>{opsData.chargeableRepairs ?? 0}</strong> รายการ</span>
                      <span>เฉลี่ย: <strong>{opsData.avgRepairDays ?? 0} วัน</strong> จนเสร็จ</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Package className="w-4 h-4" /> ยอด PO ต่อ Supplier (USD)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SupplierPoBar suppliers={supplierPoData} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
}

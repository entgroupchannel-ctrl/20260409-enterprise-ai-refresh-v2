import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search, Plus, Loader2, Receipt, Trash2, Timer, AlertCircle,
  LayoutGrid, List as ListIcon, Rows3,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';
import CreateInvoiceFromSODialog, { type InvoiceSource } from '@/components/admin/CreateInvoiceFromSODialog';
import SelectQuoteForInvoiceDialog from '@/components/admin/SelectQuoteForInvoiceDialog';
import InvoiceTimeline from '@/components/admin/InvoiceTimeline';
import InvoiceActionsMenu from '@/components/admin/InvoiceActionsMenu';
import ShareInvoiceDialog from '@/components/admin/ShareInvoiceDialog';
import InvoicePrintPreviewDialog from '@/components/admin/InvoicePrintPreviewDialog';
import ListPagination from '@/components/admin/ListPagination';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_company: string | null;
  customer_email: string | null;
  invoice_date: string;
  due_date: string | null;
  invoice_type: string;
  status: string;
  grand_total: number;
  sale_order_id: string | null;
  created_at: string;
}

export default function AdminInvoicesList() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at_desc');
  const [showQuotePicker, setShowQuotePicker] = useState(false);
  const [invoiceSource, setInvoiceSource] = useState<InvoiceSource | null>(null);
  const [availableQuoteCount, setAvailableQuoteCount] = useState(0);

  // Soft delete state
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Share + Download state
  const [shareInvoice, setShareInvoice] = useState<Invoice | null>(null);
  const [downloadInvoice, setDownloadInvoice] = useState<any>(null);
  const [downloadItems, setDownloadItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<'list' | 'table' | 'grid'>(() => {
    if (typeof window === 'undefined') return 'list';
    const v = localStorage.getItem('admin_invoices_view');
    return (v === 'grid' || v === 'table' || v === 'list') ? v : 'list';
  });
  useEffect(() => { localStorage.setItem('admin_invoices_view', viewMode); }, [viewMode]);
  useEffect(() => { setPage(1); }, [search, statusFilter, sortBy, pageSize]);

  const handleDownload = async (inv: Invoice) => {
    try {
      const { data: full } = await (supabase as any).from('invoices').select('*').eq('id', inv.id).maybeSingle();
      const { data: items } = await (supabase as any).from('invoice_items').select('*').eq('invoice_id', inv.id).order('display_order', { ascending: true });
      if (!full) return;
      setDownloadItems(items || []);
      setDownloadInvoice(full);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const loadInvoices = async () => {
    setLoading(true);
    try {
      let query = (supabase as any)
        .from('invoices')
        .select(
          'id, invoice_number, customer_name, customer_company, customer_email, invoice_date, due_date, invoice_type, status, grand_total, sale_order_id, created_at'
        )
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (search.trim()) {
        const s = search.trim();
        query = query.or(`invoice_number.ilike.%${s}%,customer_name.ilike.%${s}%,customer_company.ilike.%${s}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setInvoices((data as Invoice[]) || []);
    } catch (e: any) {
      toast({ title: 'โหลดรายการไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableQuoteCount = async () => {
    try {
      const { count, error } = await (supabase as any)
        .from('quote_requests')
        .select('id', { count: 'exact', head: true })
        .in('status', ['po_approved', 'completed'])
        .eq('has_invoice', false);

      if (error) throw error;
      setAvailableQuoteCount(count || 0);
    } catch (e) {
      console.error('Failed to load available quote count:', e);
    }
  };

  useEffect(() => {
    loadInvoices();
    loadAvailableQuoteCount();
  }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      loadInvoices();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSoftDelete = async () => {
    if (!deletingInvoice) return;
    setDeleting(true);
    try {
      const { data, error } = await (supabase as any).rpc('soft_delete_invoice', {
        p_invoice_id: deletingInvoice.id,
        p_reason: deleteReason.trim() || null,
      });
      if (error) throw error;

      toast({
        title: '🗑️ ย้ายไปถังขยะแล้ว',
        description: (data as any)?.message || `${deletingInvoice.invoice_number} ถูกย้ายไปถังขยะ`,
      });

      setDeletingInvoice(null);
      setDeleteReason('');
      await loadInvoices();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(n);

  // Compute status counts
  const now = new Date();
  const statusCounts = {
    all: invoices.length,
    draft: invoices.filter((i) => i.status === 'draft').length,
    sent: invoices.filter((i) =>
      (i.status === 'sent' || i.status === 'partially_paid') &&
      !(i.due_date && new Date(i.due_date) < now)
    ).length,
    overdue: invoices.filter((i) =>
      i.status !== 'paid' &&
      i.status !== 'cancelled' &&
      i.due_date && new Date(i.due_date) < now
    ).length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    cancelled: invoices.filter((i) => i.status === 'cancelled').length,
  };

  // Client-side filter
  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'draft') return inv.status === 'draft';
    if (statusFilter === 'sent') {
      return (inv.status === 'sent' || inv.status === 'partially_paid') &&
        !(inv.due_date && new Date(inv.due_date) < now);
    }
    if (statusFilter === 'overdue') {
      return inv.status !== 'paid' && inv.status !== 'cancelled' &&
        inv.due_date && new Date(inv.due_date) < now;
    }
    if (statusFilter === 'paid') return inv.status === 'paid';
    if (statusFilter === 'cancelled') return inv.status === 'cancelled';
    return true;
  });

  // Sort
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    switch (sortBy) {
      case 'created_at_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'amount_desc':
        return (b.grand_total || 0) - (a.grand_total || 0);
      case 'amount_asc':
        return (a.grand_total || 0) - (b.grand_total || 0);
      case 'invoice_number_desc':
        return b.invoice_number.localeCompare(a.invoice_number);
      case 'invoice_number_asc':
        return a.invoice_number.localeCompare(b.invoice_number);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ใบวางบิล</h1>
            <p className="text-muted-foreground mt-1">จัดการและติดตามสถานะใบวางบิล</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/trash?tab=invoices">
                <Trash2 className="w-4 h-4 mr-2" />
                ถังขยะ
              </Link>
            </Button>
            <Button
              onClick={() => setShowQuotePicker(true)}
              disabled={availableQuoteCount === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              สร้างใบวางบิล
              {availableQuoteCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
                  {availableQuoteCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="ค้นหาเลขที่, ลูกค้า, บริษัท..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="เรียงตาม" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at_desc">ล่าสุด → เก่าสุด</SelectItem>
                    <SelectItem value="created_at_asc">เก่าสุด → ล่าสุด</SelectItem>
                    <SelectItem value="amount_desc">ยอด สูง → ต่ำ</SelectItem>
                    <SelectItem value="amount_asc">ยอด ต่ำ → สูง</SelectItem>
                    <SelectItem value="invoice_number_desc">เลขที่ ล่าสุด</SelectItem>
                    <SelectItem value="invoice_number_asc">เลขที่ เก่าสุด</SelectItem>
                  </SelectContent>
                </Select>
                <div className="inline-flex rounded-md border bg-background p-0.5 shrink-0">
                  <Button type="button" variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm"
                    className="h-8 px-2" onClick={() => setViewMode('list')} title="มุมมองรายการ" aria-label="มุมมองรายการ">
                    <ListIcon className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm"
                    className="h-8 px-2" onClick={() => setViewMode('table')} title="มุมมองตาราง (กะทัดรัด)" aria-label="มุมมองตาราง">
                    <Rows3 className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm"
                    className="h-8 px-2" onClick={() => setViewMode('grid')} title="มุมมองกริด" aria-label="มุมมองกริด">
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="all" className="gap-2">
                    ทั้งหมด <Badge variant="secondary">{statusCounts.all}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="gap-2">
                    ฉบับร่าง <Badge variant="secondary">{statusCounts.draft}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="gap-2">
                    รอชำระ <Badge variant="secondary">{statusCounts.sent}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="overdue" className="gap-2">
                    เกินกำหนด <Badge variant="destructive">{statusCounts.overdue}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="paid" className="gap-2">
                    ชำระแล้ว <Badge variant="secondary">{statusCounts.paid}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="cancelled" className="gap-2">
                    ยกเลิก <Badge variant="secondary">{statusCounts.cancelled}</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Result count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            พบ {sortedInvoices.length} รายการ
            {search && ` จากการค้นหา "${search}"`}
          </span>
        </div>

        {/* Invoice Cards */}
        {sortedInvoices.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">ยังไม่มีใบวางบิล</p>
                <p className="text-xs mt-1">
                  คลิกปุ่ม "สร้างใบวางบิล" เพื่อสร้างจากใบเสนอราคา
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {(() => {
              const totalAmount = sortedInvoices.reduce((s, i) => s + (i.grand_total || 0), 0);
              const startIdx = (page - 1) * pageSize;
              const pageItems = sortedInvoices.slice(startIdx, startIdx + pageSize);
              const pageAmount = pageItems.reduce((s, i) => s + (i.grand_total || 0), 0);
              return (
                <>
                  {viewMode === 'table' ? (
                    <Card>
                      <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr className="border-b">
                              <th className="text-left font-medium px-3 py-2 whitespace-nowrap">วันที่</th>
                              <th className="text-left font-medium px-3 py-2 whitespace-nowrap">เลขที่เอกสาร</th>
                              <th className="text-left font-medium px-3 py-2">ลูกค้า / อีเมล</th>
                              <th className="text-left font-medium px-3 py-2 whitespace-nowrap">ครบกำหนด</th>
                              <th className="text-right font-medium px-3 py-2 whitespace-nowrap">ยอดรวม</th>
                              <th className="text-left font-medium px-3 py-2 whitespace-nowrap">สถานะ</th>
                              <th className="w-10 px-2 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {pageItems.map((inv) => {
                              const isOverdue = !!(inv.due_date && inv.status !== 'paid' && inv.status !== 'cancelled' && new Date(inv.due_date) < now);
                              return (
                                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/40 cursor-pointer"
                                    onClick={() => navigate(`/admin/invoices/${inv.id}`)}>
                                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                                    {new Date(inv.invoice_date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap font-mono text-primary font-medium">
                                    <span className="inline-flex items-center gap-1.5">
                                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                                      {inv.invoice_number}
                                      {isOverdue && <AlertCircle className="w-3 h-3 text-destructive" />}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 min-w-[220px]">
                                    <div className="truncate max-w-[320px] text-foreground">{inv.customer_company || inv.customer_name}</div>
                                    {inv.customer_email && (
                                      <div className="truncate max-w-[320px] text-xs text-muted-foreground">{inv.customer_email}</div>
                                    )}
                                  </td>
                                  <td className={`px-3 py-2 whitespace-nowrap text-xs ${isOverdue ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                                    {inv.due_date ? new Date(inv.due_date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-right font-semibold">{formatCurrency(inv.grand_total)}</td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    {isOverdue ? (
                                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">เกินกำหนด</Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{inv.status}</Badge>
                                    )}
                                  </td>
                                  <td className="px-2 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                    <InvoiceActionsMenu
                                      invoiceId={inv.id}
                                      invoiceNumber={inv.invoice_number}
                                      status={inv.status}
                                      onDelete={() => setDeletingInvoice(inv)}
                                      onDownload={() => handleDownload(inv)}
                                      onShare={() => setShareInvoice(inv)}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  ) : (
                  <div className={viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'
                    : 'space-y-3'}>
                    {pageItems.map((inv) => {
                      const isOverdue = inv.due_date &&
                        inv.status !== 'paid' &&
                        inv.status !== 'cancelled' &&
                        new Date(inv.due_date) < now;

                      if (viewMode === 'grid') {
                        return (
                          <Card key={inv.id} className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/admin/invoices/${inv.id}`)}>
                            <CardContent className="p-3 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-sm font-mono truncate">{inv.invoice_number}</span>
                                    {isOverdue && <AlertCircle className="w-3 h-3 text-destructive shrink-0" />}
                                  </div>
                                  <p className="text-xs text-foreground truncate mt-0.5">{inv.customer_company || inv.customer_name}</p>
                                  {inv.customer_email && (
                                    <p className="text-[11px] text-muted-foreground truncate">{inv.customer_email}</p>
                                  )}
                                </div>
                                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                                  <InvoiceActionsMenu
                                    invoiceId={inv.id}
                                    invoiceNumber={inv.invoice_number}
                                    status={inv.status}
                                    onDelete={() => setDeletingInvoice(inv)}
                                    onDownload={() => handleDownload(inv)}
                                    onShare={() => setShareInvoice(inv)}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                {isOverdue ? (
                                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">เกินกำหนด</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{inv.status}</Badge>
                                )}
                                <span className="text-sm font-bold text-primary">{formatCurrency(inv.grand_total)}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Timer className="w-3 h-3" />
                                  {formatRelativeTime(inv.invoice_date)}
                                </span>
                                {inv.due_date && (
                                  <span className={isOverdue ? 'text-destructive font-semibold' : ''}>
                                    {new Date(inv.due_date).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }

                      return (
                        <Card
                          key={inv.id}
                          className="hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => navigate(`/admin/invoices/${inv.id}`)}
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="font-semibold text-lg font-mono">{inv.invoice_number}</span>
                                  {isOverdue && (
                                    <Badge variant="destructive" className="gap-1">
                                      <AlertCircle className="w-3 h-3" /> เกินกำหนด
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-[10px]">
                                    {inv.invoice_type === 'full' ? 'เต็มจำนวน' :
                                     inv.invoice_type === 'downpayment' ? 'มัดจำ' :
                                     inv.invoice_type === 'installment' ? 'งวดแบ่ง' :
                                     inv.invoice_type === 'final' ? 'ส่วนที่เหลือ' : inv.invoice_type}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                  <span className="text-foreground">{inv.customer_company || inv.customer_name}</span>
                                  {inv.customer_email && (
                                    <span className="text-muted-foreground">{inv.customer_email}</span>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <div className="flex flex-wrap items-center gap-3 text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                      <Timer className="w-3 h-3" />
                                      ออก: {formatRelativeTime(inv.invoice_date)}
                                    </span>
                                    {inv.due_date && (
                                      <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                                        ครบกำหนด: {new Date(inv.due_date).toLocaleDateString('th-TH', {
                                          year: 'numeric', month: 'short', day: 'numeric',
                                        })}
                                      </span>
                                    )}
                                  </div>
                                  <InvoiceTimeline currentStatus={isOverdue ? 'overdue' : inv.status} />
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-xs text-muted-foreground mb-1">ยอดรวม</div>
                                  <div className="text-xl font-bold text-primary">
                                    {formatCurrency(inv.grand_total)}
                                  </div>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <InvoiceActionsMenu
                                    invoiceId={inv.id}
                                    invoiceNumber={inv.invoice_number}
                                    status={inv.status}
                                    onDelete={() => setDeletingInvoice(inv)}
                                    onDownload={() => handleDownload(inv)}
                                    onShare={() => setShareInvoice(inv)}
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  )}

                  <ListPagination
                    page={page}
                    pageSize={pageSize}
                    totalItems={sortedInvoices.length}
                    totalAmount={totalAmount}
                    pageAmount={pageAmount}
                    formatCurrency={formatCurrency}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    itemLabel="ใบวางบิล"
                  />
                </>
              );
            })()}
          </>
        )}
      </div>

      {/* Existing dialogs */}
      <SelectQuoteForInvoiceDialog
        open={showQuotePicker}
        onOpenChange={setShowQuotePicker}
        onSelect={(source) => setInvoiceSource(source)}
      />
      <CreateInvoiceFromSODialog
        open={!!invoiceSource}
        onOpenChange={(v) => {
          if (!v) {
            setInvoiceSource(null);
            loadInvoices();
            loadAvailableQuoteCount();
          }
        }}
        source={invoiceSource}
      />

      {/* Soft Delete Dialog */}
      <AlertDialog
        open={!!deletingInvoice}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingInvoice(null);
            setDeleteReason('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              ย้ายใบวางบิลไปถังขยะ?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  ใบวางบิล <strong className="font-mono">{deletingInvoice?.invoice_number}</strong> จะถูกย้ายไปถังขยะ
                </p>

                {deletingInvoice && (
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ลูกค้า:</span>
                      <span>{deletingInvoice.customer_company || deletingInvoice.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ยอดรวม:</span>
                      <span className="font-semibold">{formatCurrency(deletingInvoice.grand_total)}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">เหตุผล (ไม่บังคับ)</label>
                  <Textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="เช่น: สร้างผิด, ลูกค้าขอยกเลิก..."
                    rows={2}
                    className="text-sm"
                  />
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <span className="text-blue-600">💡</span>
                  <p className="text-xs">
                    ไม่ใช่การลบถาวร — สามารถกู้คืนได้จากถังขยะ
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSoftDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'กำลังย้าย...' : '🗑️ ย้ายไปถังขยะ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share dialog */}
      <ShareInvoiceDialog
        open={!!shareInvoice}
        onOpenChange={(v) => !v && setShareInvoice(null)}
        invoiceId={shareInvoice?.id || null}
        invoiceNumber={shareInvoice?.invoice_number || null}
      />

      {/* Download (auto-PDF) preview */}
      {downloadInvoice && (
        <InvoicePrintPreviewDialog
          open={!!downloadInvoice}
          onOpenChange={(v) => { if (!v) { setDownloadInvoice(null); setDownloadItems([]); } }}
          invoice={downloadInvoice}
          items={downloadItems}
        />
      )}
    </AdminLayout>
  );
}

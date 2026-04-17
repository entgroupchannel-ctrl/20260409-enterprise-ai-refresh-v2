import { useEffect, useState } from 'react';
import QuoteTimeline from '@/components/quotes/QuoteTimeline';
import QuoteStatusDropdown from '@/components/admin/QuoteStatusDropdown';
import QuoteActionsMenu from '@/components/admin/QuoteActionsMenu';
import CreateInvoiceFromSODialog from '@/components/admin/CreateInvoiceFromSODialog';
import type { InvoiceSource } from '@/components/admin/CreateInvoiceFromSODialog';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  SearchCheck,
  CircleCheckBig,
  FileSearch,
  ShieldAlert,
  Timer,
  Trash2,
  Upload,
  LayoutGrid,
  List as ListIcon,
  Rows3,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';
import ImportQuotePDFDialog from '@/components/admin/ImportQuotePDFDialog';
import PrintPreviewDialog from '@/components/admin/PrintPreviewDialog';
import ShareQuoteDialog from '@/components/admin/ShareQuoteDialog';
import ListPagination from '@/components/admin/ListPagination';

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_company: string | null;
  status: string;
  grand_total: number | null;
  created_at: string;
  sent_at: string | null;
  po_uploaded_at: string | null;
  sla_breached: boolean | null;
  sla_po_review_due: string | null;
  assigned_to: string | null;
}

export default function AdminQuotesList() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at_desc');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Soft delete state
  const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Invoice dialog state
  const [invoiceSource, setInvoiceSource] = useState<InvoiceSource | null>(null);

  // Import PDF dialog
  const [importOpen, setImportOpen] = useState(false);

  // Download PDF state
  const [downloadQuote, setDownloadQuote] = useState<any>(null);
  const [downloadRevision, setDownloadRevision] = useState<any>(null);

  // Share state
  const [shareTarget, setShareTarget] = useState<{ id: string; number: string } | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // View mode (list = current detail rows, table = compact rows, grid = card grid)
  const [viewMode, setViewMode] = useState<'list' | 'table' | 'grid'>(() => {
    if (typeof window === 'undefined') return 'list';
    const v = localStorage.getItem('admin_quotes_view');
    return (v === 'grid' || v === 'table' || v === 'list') ? v : 'list';
  });
  useEffect(() => {
    localStorage.setItem('admin_quotes_view', viewMode);
  }, [viewMode]);

  useEffect(() => {
    loadQuotes();
    const urlStatus = searchParams.get('status');
    if (urlStatus) setStatusFilter(urlStatus);
  }, [searchParams]);

  useEffect(() => {
    filterAndSortQuotes();
  }, [quotes, searchQuery, statusFilter, sortBy]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, sortBy, pageSize]);

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setQuotes((data as Quote[]) || []);
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortQuotes = () => {
    let result = [...quotes];
    if (statusFilter !== 'all') result = result.filter((q) => q.status === statusFilter);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (q) =>
          q.quote_number.toLowerCase().includes(query) ||
          q.customer_name.toLowerCase().includes(query) ||
          q.customer_email.toLowerCase().includes(query) ||
          q.customer_company?.toLowerCase().includes(query)
      );
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'created_at_desc': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_at_asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'amount_desc': return (b.grand_total || 0) - (a.grand_total || 0);
        case 'amount_asc': return (a.grand_total || 0) - (b.grand_total || 0);
        case 'quote_number_desc': return b.quote_number.localeCompare(a.quote_number);
        case 'quote_number_asc': return a.quote_number.localeCompare(b.quote_number);
        default: return 0;
      }
    });
    setFilteredQuotes(result);
  };

  const handleSoftDelete = async () => {
    if (!deletingQuote) return;
    setDeleting(true);
    try {
      const { data, error } = await supabase.rpc('soft_delete_quote' as any, {
        p_quote_id: deletingQuote.id,
        p_reason: deleteReason || null,
      });
      if (error) throw error;
      toast({
        title: '🗑️ ย้ายไปถังขยะแล้ว',
        description: (data as any)?.message || `${deletingQuote.quote_number} ถูกย้ายไปถังขยะ`,
      });
      setDeletingQuote(null);
      setDeleteReason('');
      await loadQuotes();
    } catch (error: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async (quoteId: string) => {
    try {
      // Load full quote
      const { data: src, error: e1 } = await (supabase as any)
        .from('quote_requests')
        .select('*')
        .eq('id', quoteId)
        .maybeSingle();
      if (e1 || !src) throw e1 || new Error('ไม่พบใบเสนอราคาต้นฉบับ');

      // Try to load latest revision for products/amounts
      const { data: rev } = await (supabase as any)
        .from('quote_revisions')
        .select('subtotal, vat_amount, grand_total, products, discount_amount, discount_percent, vat_percent')
        .eq('quote_id', quoteId)
        .order('revision_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Strip identifiers and status fields
      const {
        id, quote_number, created_at, updated_at, sent_at, po_uploaded_at,
        po_approved_at, completed_at, deleted_at, deleted_by, delete_reason,
        sla_breached, sla_po_review_due, sla_response_due, assigned_to,
        po_file_url, po_file_name, po_uploaded_by, customer_response,
        approved_at, approved_by, ...rest
      } = src;

      const insertPayload: any = {
        ...rest,
        status: 'pending',
        products: rev?.products ?? src.products ?? [],
        subtotal: rev?.subtotal ?? src.subtotal ?? 0,
        vat_amount: rev?.vat_amount ?? src.vat_amount ?? 0,
        grand_total: rev?.grand_total ?? src.grand_total ?? 0,
        discount_amount: rev?.discount_amount ?? src.discount_amount ?? 0,
        discount_percent: rev?.discount_percent ?? src.discount_percent ?? 0,
        vat_percent: rev?.vat_percent ?? src.vat_percent ?? 7,
        notes: src.notes ? `[สร้างซ้ำจาก ${src.quote_number}] ${src.notes}` : `[สร้างซ้ำจาก ${src.quote_number}]`,
      };

      const { data: created, error: e2 } = await (supabase as any)
        .from('quote_requests')
        .insert(insertPayload)
        .select('id, quote_number')
        .single();
      if (e2) throw e2;

      toast({
        title: '✅ สร้างซ้ำสำเร็จ',
        description: `สร้าง ${created.quote_number} จาก ${src.quote_number} แล้ว`,
      });
      navigate(`/admin/quotes/${created.id}?mode=edit`);
    } catch (error: any) {
      toast({ title: 'สร้างซ้ำไม่สำเร็จ', description: error.message, variant: 'destructive' });
    }
  };

  const handleDownload = async (quoteId: string) => {
    try {
      const { data: q, error: qe } = await (supabase as any)
        .from('quote_requests')
        .select('*')
        .eq('id', quoteId)
        .maybeSingle();
      if (qe || !q) throw qe || new Error('ไม่พบใบเสนอราคา');

      const { data: rev } = await (supabase as any)
        .from('quote_revisions')
        .select('*')
        .eq('quote_id', quoteId)
        .order('revision_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fallback revision built from quote_requests if no revision exists
      const revision = rev || {
        revision_number: 1,
        products: q.products || [],
        free_items: q.free_items || [],
        subtotal: q.subtotal || 0,
        discount_amount: q.discount_amount || 0,
        discount_percent: q.discount_percent || 0,
        vat_amount: q.vat_amount || 0,
        vat_percent: q.vat_percent || 7,
        grand_total: q.grand_total || 0,
        notes: q.notes,
        payment_terms: q.payment_terms,
        delivery_terms: q.delivery_terms,
        warranty_terms: q.warranty_terms,
        valid_until: q.valid_until,
        created_by: q.assigned_to,
      };

      setDownloadQuote(q);
      setDownloadRevision(revision);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

  const handleQuoteAction = async (action: string, quoteId: string) => {
    if (action === 'create_invoice') {
      const q = quotes.find((x: any) => x.id === quoteId) as any;
      if (!q) {
        toast({ title: 'ไม่พบใบเสนอราคา', variant: 'destructive' });
        return;
      }

      // Load latest revision for amounts + products
      try {
        const { data: revData } = await (supabase as any)
          .from('quote_revisions')
          .select('subtotal, vat_amount, grand_total, products')
          .eq('quote_id', quoteId)
          .order('revision_number', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Fallback to quote_requests data if no revision
        const subtotal = revData?.subtotal ?? q.subtotal ?? 0;
        const vatAmount = revData?.vat_amount ?? q.vat_amount ?? 0;
        const grandTotal = revData?.grand_total ?? q.grand_total ?? 0;
        const products = revData?.products ?? q.products ?? [];

        // Try to find branch info from contacts table (by tax_id match)
        let branchType: string | null = null;
        let branchCode: string | null = null;
        let branchName: string | null = null;

        if (q.customer_tax_id) {
          try {
            const { data: contactData } = await (supabase as any)
              .from('contacts')
              .select('branch_type, branch_code, branch_name')
              .eq('tax_id', q.customer_tax_id)
              .limit(1)
              .maybeSingle();
            
            if (contactData) {
              branchType = contactData.branch_type || null;
              branchCode = contactData.branch_code || null;
              branchName = contactData.branch_name || null;
            }
          } catch (e) {
            console.warn('Contact branch lookup failed:', e);
          }
        }

        setInvoiceSource({
          type: 'quote',
          quote: {
            id: q.id,
            quote_number: q.quote_number || '',
            customer_name: q.customer_name,
            customer_company: q.customer_company,
            customer_address: q.customer_address || null,
            customer_email: q.customer_email,
            customer_phone: q.customer_phone || null,
            customer_tax_id: q.customer_tax_id || null,
            customer_branch_type: branchType,
            customer_branch_code: branchCode,
            customer_branch_name: branchName,
            payment_terms: q.payment_terms || null,
            notes: q.notes || null,
            subtotal,
            vat_amount: vatAmount,
            grand_total: grandTotal,
            products,
          },
        });
      } catch (e: any) {
        toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
      }
    }
  };

  const calculateSLATime = (dueDate: string | null) => {
    if (!dueDate) return null;
    const diff = new Date(dueDate).getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (diff < 0) return { text: 'เกินกำหนด', isOverdue: true, isUrgent: false };
    const isUrgent = hours < 12;
    if (hours < 1) return { text: `${minutes} นาที`, isOverdue: false, isUrgent: true };
    return { text: `${hours} ชม.`, isOverdue: false, isUrgent };
  };

  const getStatusCounts = () => ({
    all: quotes.length,
    pending: quotes.filter((q) => q.status === 'pending').length,
    quote_sent: quotes.filter((q) => q.status === 'quote_sent').length,
    po_uploaded: quotes.filter((q) => q.status === 'po_uploaded').length,
    po_approved: quotes.filter((q) => q.status === 'po_approved').length,
    completed: quotes.filter((q) => q.status === 'completed').length,
  });

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ใบเสนอราคา</h1>
            <p className="text-muted-foreground mt-1">จัดการและติดตามสถานะใบเสนอราคา</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/quotes/trash">
                <Trash2 className="w-4 h-4 mr-2" />
                ถังขยะ
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              นำเข้า PDF
            </Button>
            <Button onClick={() => navigate('/admin/quotes/new')}>
              <FileSearch className="w-4 h-4 mr-2" />
              สร้างใบเสนอราคา
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <SearchCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="ค้นหาเลขที่, ชื่อ, อีเมล, บริษัท..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    <SelectItem value="amount_desc">ราคา สูง → ต่ำ</SelectItem>
                    <SelectItem value="amount_asc">ราคา ต่ำ → สูง</SelectItem>
                    <SelectItem value="quote_number_desc">เลขที่ ล่าสุด</SelectItem>
                    <SelectItem value="quote_number_asc">เลขที่ เก่าสุด</SelectItem>
                  </SelectContent>
                </Select>
                <div className="inline-flex rounded-md border bg-background p-0.5 shrink-0">
                  <Button
                    type="button"
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setViewMode('list')}
                    aria-label="มุมมองรายการ"
                    title="มุมมองรายการ"
                  >
                    <ListIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setViewMode('table')}
                    aria-label="มุมมองตาราง"
                    title="มุมมองตาราง (กะทัดรัด)"
                  >
                    <Rows3 className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setViewMode('grid')}
                    aria-label="มุมมองกริด"
                    title="มุมมองกริด"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="all" className="gap-2">ทั้งหมด <Badge variant="secondary">{statusCounts.all}</Badge></TabsTrigger>
                  <TabsTrigger value="pending" className="gap-2">รอตอบ <Badge variant="secondary">{statusCounts.pending}</Badge></TabsTrigger>
                  <TabsTrigger value="quote_sent" className="gap-2">รอลูกค้า <Badge variant="secondary">{statusCounts.quote_sent}</Badge></TabsTrigger>
                  <TabsTrigger value="po_uploaded" className="gap-2">รอตรวจ PO <Badge variant="destructive">{statusCounts.po_uploaded}</Badge></TabsTrigger>
                  <TabsTrigger value="po_approved" className="gap-2">อนุมัติแล้ว <Badge variant="secondary">{statusCounts.po_approved}</Badge></TabsTrigger>
                  <TabsTrigger value="completed" className="gap-2">สำเร็จ <Badge variant="secondary">{statusCounts.completed}</Badge></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {(() => {
          const totalAmount = filteredQuotes.reduce((sum, q) => sum + (q.grand_total || 0), 0);
          const startIdx = (page - 1) * pageSize;
          const pageItems = filteredQuotes.slice(startIdx, startIdx + pageSize);
          const pageAmount = pageItems.reduce((sum, q) => sum + (q.grand_total || 0), 0);
          return (
            <>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>พบ {filteredQuotes.length} รายการ{searchQuery && ` จากการค้นหา "${searchQuery}"`}</span>
              </div>

              {viewMode === 'table' ? (
                <Card>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                        <tr className="border-b">
                          <th className="text-left font-medium px-3 py-2 whitespace-nowrap">วันที่</th>
                          <th className="text-left font-medium px-3 py-2 whitespace-nowrap">เลขที่เอกสาร</th>
                          <th className="text-left font-medium px-3 py-2">ลูกค้า / อีเมล</th>
                          <th className="text-right font-medium px-3 py-2 whitespace-nowrap">ยอดรวม</th>
                          <th className="text-left font-medium px-3 py-2 whitespace-nowrap">สถานะ</th>
                          <th className="w-10 px-2 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageItems.map((quote) => {
                          const slaTime = quote.status === 'po_uploaded' ? calculateSLATime(quote.sla_po_review_due) : null;
                          return (
                            <tr
                              key={quote.id}
                              className="border-b last:border-0 hover:bg-muted/40 cursor-pointer"
                              onClick={() => navigate(`/admin/quotes/${quote.id}`)}
                            >
                              <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                                {new Date(quote.created_at).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap font-mono text-primary font-medium">
                                <span className="inline-flex items-center gap-1.5">
                                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                                  {quote.quote_number}
                                  {quote.sla_breached && <ShieldAlert className="w-3 h-3 text-destructive" />}
                                </span>
                              </td>
                              <td className="px-3 py-2 min-w-[220px]">
                                <div className="truncate max-w-[320px] text-foreground">
                                  {quote.customer_company || quote.customer_name}
                                </div>
                                <div className="truncate max-w-[320px] text-xs text-muted-foreground">
                                  {quote.customer_email}
                                </div>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-right font-semibold">
                                {formatCurrency(quote.grand_total || 0)}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <StatusBadge status={quote.status} className="text-[11px] px-2 py-0" />
                                  {slaTime && (
                                    <span className={`text-[11px] flex items-center gap-1 font-medium ${slaTime.isOverdue ? 'text-destructive' : slaTime.isUrgent ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                      <Timer className="w-3 h-3" />{slaTime.text}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-2 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                <QuoteActionsMenu
                                  quoteId={quote.id}
                                  quoteNumber={quote.quote_number}
                                  status={quote.status}
                                  onDelete={() => setDeletingQuote(quote)}
                                  onDuplicate={() => handleDuplicate(quote.id)}
                                  onCopy={() => handleDownload(quote.id)}
                                  onShare={() => setShareTarget({ id: quote.id, number: quote.quote_number })}
                                />
                              </td>
                            </tr>
                          );
                        })}
                        {pageItems.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-3 py-12 text-center text-muted-foreground">
                              <FileSearch className="w-12 h-12 mx-auto mb-3 opacity-30" />
                              <p className="text-sm">ไม่พบใบเสนอราคา</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'
                : 'space-y-3'}>
                {pageItems.map((quote) => {
                  const slaTime = quote.status === 'po_uploaded' ? calculateSLATime(quote.sla_po_review_due) : null;

                  if (viewMode === 'grid') {
                    return (
                      <Card
                        key={quote.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/admin/quotes/${quote.id}`)}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-sm truncate">{quote.quote_number}</span>
                                {quote.sla_breached && (
                                  <ShieldAlert className="w-3 h-3 text-destructive shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-foreground truncate mt-0.5">
                                {quote.customer_company || quote.customer_name}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {quote.customer_email}
                              </p>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                              <QuoteActionsMenu
                                quoteId={quote.id}
                                quoteNumber={quote.quote_number}
                                status={quote.status}
                                onDelete={() => setDeletingQuote(quote)}
                                onDuplicate={() => handleDuplicate(quote.id)}
                                onCopy={() => handleDownload(quote.id)}
                                onShare={() => setShareTarget({ id: quote.id, number: quote.quote_number })}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <StatusBadge status={quote.status} className="text-[10px] px-1.5 py-0" />
                            <span className="text-sm font-bold text-primary">
                              {formatCurrency(quote.grand_total || 0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {formatRelativeTime(quote.created_at)}
                            </span>
                            {slaTime && (
                              <span className={`flex items-center gap-1 font-medium ${slaTime.isOverdue ? 'text-destructive' : slaTime.isUrgent ? 'text-orange-600' : ''}`}>
                                <ShieldAlert className="w-3 h-3" /> {slaTime.text}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }

                  return (
                    <Card key={quote.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/admin/quotes/${quote.id}`)}>
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-semibold text-lg">{quote.quote_number}</span>
                              {quote.sla_breached && (
                                <Badge variant="destructive" className="gap-1">
                                  <ShieldAlert className="w-3 h-3" /> SLA เกิน
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                              <span className="text-foreground">{quote.customer_company || quote.customer_name}</span>
                              <span className="text-muted-foreground">{quote.customer_email}</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <StatusBadge status={quote.status} />
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <Timer className="w-3 h-3" />
                                  {formatRelativeTime(quote.created_at)}
                                </span>
                                {slaTime && (
                                  <span className={`flex items-center gap-1 font-medium ${slaTime.isOverdue ? 'text-destructive' : slaTime.isUrgent ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                    <ShieldAlert className="w-3 h-3" /> SLA: {slaTime.text}
                                  </span>
                                )}
                              </div>
                              <QuoteTimeline currentStatus={quote.status} />
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground mb-1">ยอดรวม</div>
                              <div className="text-xl font-bold text-primary">{formatCurrency(quote.grand_total || 0)}</div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className="min-w-[220px]">
                              <QuoteStatusDropdown
                                quoteId={quote.id}
                                currentStatus={quote.status}
                                onStatusChange={() => loadQuotes()}
                                onAction={handleQuoteAction}
                              />
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <QuoteActionsMenu
                                quoteId={quote.id}
                                quoteNumber={quote.quote_number}
                                status={quote.status}
                                onDelete={() => setDeletingQuote(quote)}
                                onDuplicate={() => handleDuplicate(quote.id)}
                                onCopy={() => handleDownload(quote.id)}
                                onShare={() => setShareTarget({ id: quote.id, number: quote.quote_number })}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {filteredQuotes.length === 0 && (
                  <Card className={viewMode === 'grid' ? 'col-span-full' : ''}>
                    <CardContent className="p-12">
                      <div className="text-center text-muted-foreground">
                        <FileSearch className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium mb-2">ไม่พบใบเสนอราคา</p>
                        <p className="text-sm">{searchQuery ? 'ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรอง' : 'ยังไม่มีใบเสนอราคาในระบบ'}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {filteredQuotes.length > 0 && (
                <ListPagination
                  page={page}
                  pageSize={pageSize}
                  totalItems={filteredQuotes.length}
                  totalAmount={totalAmount}
                  pageAmount={pageAmount}
                  formatCurrency={formatCurrency}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                  itemLabel="ใบเสนอราคา"
                />
              )}
            </>
          );
        })()}
      </div>

      {/* Soft Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingQuote}
        onOpenChange={(v) => { if (!v) { setDeletingQuote(null); setDeleteReason(''); } }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              ย้ายใบเสนอราคาไปถังขยะ
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  คุณกำลังจะย้าย <strong>{deletingQuote?.quote_number}</strong> ไปถังขยะ
                </p>

                {deletingQuote && (
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ลูกค้า:</span>
                      <span>{deletingQuote.customer_company || deletingQuote.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ยอดรวม:</span>
                      <span className="font-semibold">
                        {formatCurrency(deletingQuote.grand_total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">สถานะ:</span>
                      <span>{deletingQuote.status}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">เหตุผลการลบ (ไม่บังคับ)</label>
                  <Textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="เช่น: ลูกค้ายกเลิก, สร้างผิด, ทดสอบระบบ..."
                    rows={2}
                    className="text-sm"
                  />
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <span className="text-blue-600">💡</span>
                  <p className="text-xs">
                    ไม่ใช่การลบถาวร — สามารถกู้คืนได้จากถังขยะ
                    <br />
                    <span className="text-muted-foreground">(ลูกค้าจะไม่เห็นใบเสนอราคานี้อีกต่อไป)</span>
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
              {deleting ? 'กำลังลบ...' : '🗑️ ย้ายไปถังขยะ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Invoice from Quote Dialog */}
      <CreateInvoiceFromSODialog
        open={!!invoiceSource}
        onOpenChange={(v) => !v && setInvoiceSource(null)}
        source={invoiceSource}
      />

      {/* Import Quote from PDF */}
      <ImportQuotePDFDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={loadQuotes}
      />

      {/* Auto-download PDF */}
      {downloadQuote && downloadRevision && (
        <PrintPreviewDialog
          open={!!downloadQuote}
          onOpenChange={(v) => { if (!v) { setDownloadQuote(null); setDownloadRevision(null); } }}
          quote={downloadQuote}
          revision={downloadRevision}
          autoDownload
        />
      )}

      {/* Share quote dialog */}
      <ShareQuoteDialog
        open={!!shareTarget}
        onOpenChange={(v) => { if (!v) setShareTarget(null); }}
        quoteId={shareTarget?.id ?? null}
        quoteNumber={shareTarget?.number ?? null}
      />
    </AdminLayout>
  );
}

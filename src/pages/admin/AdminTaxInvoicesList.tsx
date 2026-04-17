import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2, FileText, Trash2, Plus } from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';
import TaxInvoiceTimeline from '@/components/admin/TaxInvoiceTimeline';
import TaxInvoiceActionsMenu from '@/components/admin/TaxInvoiceActionsMenu';
import SelectInvoiceForTaxInvoiceDialog from '@/components/admin/SelectInvoiceForTaxInvoiceDialog';
import CreateTaxInvoiceFromInvoiceDialog from '@/components/admin/CreateTaxInvoiceFromInvoiceDialog';
import CreateCreditNoteDialog from '@/components/admin/CreateCreditNoteDialog';
import ShareTaxInvoiceDialog from '@/components/admin/ShareTaxInvoiceDialog';
import ListPagination from '@/components/admin/ListPagination';

interface TaxInvoice {
  id: string;
  tax_invoice_number: string;
  customer_name: string;
  customer_company: string | null;
  tax_invoice_date: string;
  status: string;
  grand_total: number;
  invoice_id: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'รอดำเนินการ', cls: 'bg-blue-50 text-blue-700 border-blue-300' },
  paid: { label: 'ชำระแล้ว', cls: 'bg-green-50 text-green-700 border-green-300' },
  partially_paid: { label: 'ชำระบางส่วน', cls: 'bg-amber-50 text-amber-700 border-amber-300' },
  cancelled: { label: 'ยกเลิก', cls: 'bg-gray-50 text-gray-500 border-gray-300 line-through' },
};

export default function AdminTaxInvoicesList() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [taxInvoices, setTaxInvoices] = useState<TaxInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingTax, setDeletingTax] = useState<TaxInvoice | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);
  const [showInvoicePicker, setShowInvoicePicker] = useState(false);
  const [createFromInvoiceId, setCreateFromInvoiceId] = useState<string | null>(null);
  const [creatingCNFor, setCreatingCNFor] = useState<string | null>(null);
  const [shareTarget, setShareTarget] = useState<{ id: string; number: string } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const loadData = async () => {
    setLoading(true);
    try {
      let query = (supabase as any)
        .from('tax_invoices')
        .select('id, tax_invoice_number, customer_name, customer_company, tax_invoice_date, status, grand_total, invoice_id, created_at')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (search.trim()) {
        const s = search.trim();
        query = query.or(`tax_invoice_number.ilike.%${s}%,customer_name.ilike.%${s}%,customer_company.ilike.%${s}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTaxInvoices((data as TaxInvoice[]) || []);
    } catch (e: any) {
      toast({ title: 'โหลดรายการไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableCount = async () => {
    try {
      const [payRes, taxRes] = await Promise.all([
        (supabase as any)
          .from('payment_records')
          .select('id')
          .eq('verification_status', 'verified'),
        (supabase as any)
          .from('tax_invoices')
          .select('payment_record_id')
          .is('deleted_at', null)
          .not('payment_record_id', 'is', null),
      ]);

      if (payRes.error) throw payRes.error;
      if (taxRes.error) throw taxRes.error;

      const usedPaymentIds = new Set(
        (taxRes.data || []).map((t: any) => t.payment_record_id)
      );
      const available = (payRes.data || []).filter(
        (p: any) => !usedPaymentIds.has(p.id)
      );

      setAvailableCount(available.length);
    } catch (e) {
      console.error('Failed to load available count:', e);
    }
  };

  useEffect(() => { loadData(); loadAvailableCount(); }, []);

  useEffect(() => {
    const timer = setTimeout(loadData, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSoftDelete = async () => {
    if (!deletingTax) return;
    setDeleting(true);
    try {
      const { data, error } = await (supabase as any).rpc('soft_delete_tax_invoice', {
        p_tax_invoice_id: deletingTax.id,
        p_reason: deleteReason.trim() || null,
      });
      if (error) throw error;

      toast({
        title: '🗑️ ย้ายไปถังขยะแล้ว',
        description: (data as any)?.message || `${deletingTax.tax_invoice_number} ถูกย้าย`,
      });
      setDeletingTax(null);
      setDeleteReason('');
      await loadData();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = statusFilter === 'all'
    ? taxInvoices
    : taxInvoices.filter((t) => t.status === statusFilter);

  const statusCounts = taxInvoices.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0 }).format(n);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold">ใบกำกับภาษี</h1>
            <Badge variant="outline" className="ml-2">{taxInvoices.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/trash?tab=tax-invoices">
                <Trash2 className="w-4 h-4 mr-2" />
                ถังขยะ
              </Link>
            </Button>
            <Button
              onClick={() => setShowInvoicePicker(true)}
              disabled={availableCount === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              สร้างใบกำกับภาษี
              {availableCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
                  {availableCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filter tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all">ทั้งหมด ({taxInvoices.length})</TabsTrigger>
            <TabsTrigger value="pending">รอดำเนินการ ({statusCounts.pending || 0})</TabsTrigger>
            <TabsTrigger value="paid">ชำระแล้ว ({statusCounts.paid || 0})</TabsTrigger>
            <TabsTrigger value="partially_paid">บางส่วน ({statusCounts.partially_paid || 0})</TabsTrigger>
            <TabsTrigger value="cancelled">ยกเลิก ({statusCounts.cancelled || 0})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาเลขที่, ชื่อลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>ไม่พบใบกำกับภาษี</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((tx) => {
              const statusInfo = STATUS_LABELS[tx.status] || { label: tx.status, cls: '' };
              return (
                <Card
                  key={tx.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/admin/tax-invoices/${tx.id}`)}
                >
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-semibold text-sm">{tx.tax_invoice_number}</span>
                          <Badge variant="outline" className={`text-xs ${statusInfo.cls}`}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <TaxInvoiceTimeline currentStatus={tx.status} />
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {tx.customer_company || tx.customer_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(tx.tax_invoice_date).toLocaleDateString('th-TH')} • {formatRelativeTime(tx.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <p className="font-bold text-primary">฿{formatCurrency(tx.grand_total)}</p>
                        <div onClick={(e) => e.stopPropagation()}>
                          <TaxInvoiceActionsMenu
                            taxInvoiceId={tx.id}
                            taxInvoiceNumber={tx.tax_invoice_number}
                            status={tx.status}
                            onDelete={() => setDeletingTax(tx)}
                            onShare={() => setShareTarget({ id: tx.id, number: tx.tax_invoice_number })}
                            onCreateCreditNote={() => setCreatingCNFor(tx.id)}
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
      </div>

      <AlertDialog
        open={!!deletingTax}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTax(null);
            setDeleteReason('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-700">
              <Trash2 className="w-5 h-5" />
              ย้ายใบกำกับภาษีไปถังขยะ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              ใบกำกับภาษี <span className="font-mono font-semibold">{deletingTax?.tax_invoice_number}</span> จะถูกย้ายไปถังขยะ
              สามารถกู้คืนได้ที่เมนู "ถังขยะ"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-semibold">เหตุผล (ไม่บังคับ)</label>
            <Textarea
              placeholder="เช่น: ออกผิด, ลูกค้าขอยกเลิก..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows={2}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSoftDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? 'กำลังย้าย...' : 'ย้ายถังขยะ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Select Invoice → Create Tax Invoice */}
      <SelectInvoiceForTaxInvoiceDialog
        open={showInvoicePicker}
        onOpenChange={setShowInvoicePicker}
        onSelectInvoice={(invoiceId) => {
          setCreateFromInvoiceId(invoiceId);
        }}
      />

      <CreateTaxInvoiceFromInvoiceDialog
        open={!!createFromInvoiceId}
        onOpenChange={(open) => {
          if (!open) setCreateFromInvoiceId(null);
        }}
        invoiceId={createFromInvoiceId}
        onSuccess={() => {
          setCreateFromInvoiceId(null);
          loadData();
          loadAvailableCount();
        }}
      />

      {creatingCNFor && (
        <CreateCreditNoteDialog
          open={!!creatingCNFor}
          onOpenChange={(open) => !open && setCreatingCNFor(null)}
          taxInvoiceId={creatingCNFor}
          onSuccess={() => {
            setCreatingCNFor(null);
            loadData();
          }}
        />
      )}

      <ShareTaxInvoiceDialog
        open={!!shareTarget}
        onOpenChange={(v) => { if (!v) setShareTarget(null); }}
        taxInvoiceId={shareTarget?.id ?? null}
        taxInvoiceNumber={shareTarget?.number ?? null}
      />
    </AdminLayout>
  );
}

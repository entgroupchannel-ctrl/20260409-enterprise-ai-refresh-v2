import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Trash2, ArrowLeft, RotateCcw, AlertTriangle, Search,
  Building2, Calendar, User, FileText, Receipt, Loader2,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';
import { displayDocNumber } from '@/lib/document-numbers';

type TabKey = 'quotes' | 'invoices' | 'tax-invoices' | 'receipts';

interface DeletedQuote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_company: string | null;
  grand_total: number;
  status: string;
  created_at: string;
  deleted_at: string;
  deleted_by: string | null;
  delete_reason: string | null;
}

interface DeletedInvoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_company: string | null;
  grand_total: number;
  status: string;
  invoice_type: string;
  created_at: string;
  deleted_at: string;
  deleted_by: string | null;
  delete_reason: string | null;
}

interface DeletedTaxInvoice {
  id: string;
  tax_invoice_number: string;
  customer_name: string;
  customer_company: string | null;
  grand_total: number;
  status: string;
  created_at: string;
  deleted_at: string;
  deleted_by: string | null;
  delete_reason: string | null;
}

interface DeletedReceipt {
  id: string;
  receipt_number: string;
  customer_name: string;
  customer_company: string | null;
  amount: number;
  receipt_date: string;
  payment_method: string | null;
  created_at: string;
  deleted_at: string;
  deleted_by: string | null;
  delete_reason: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  full: 'เต็มจำนวน',
  downpayment: 'มัดจำ',
  installment: 'งวดแบ่ง',
  final: 'ส่วนที่เหลือ',
};

export default function AdminTrash() {
  const { toast } = useToast();
  const { profile, isSuperAdmin } = useAuth() as any;
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'quotes';

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [quotes, setQuotes] = useState<DeletedQuote[]>([]);
  const [invoices, setInvoices] = useState<DeletedInvoice[]>([]);
  const [taxInvoices, setTaxInvoices] = useState<DeletedTaxInvoice[]>([]);
  const [receipts, setReceipts] = useState<DeletedReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [permQuoteTarget, setPermQuoteTarget] = useState<DeletedQuote | null>(null);
  const [permInvoiceTarget, setPermInvoiceTarget] = useState<DeletedInvoice | null>(null);
  const [permTaxTarget, setPermTaxTarget] = useState<DeletedTaxInvoice | null>(null);
  const [permReceiptTarget, setPermReceiptTarget] = useState<DeletedReceipt | null>(null);
  const [showEmptyTrash, setShowEmptyTrash] = useState<TabKey | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => { loadTrash(); }, []);

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  const loadTrash = async () => {
    setLoading(true);
    try {
      const [qRes, iRes, txRes, rcpRes] = await Promise.all([
        supabase
          .from('quote_requests')
          .select('id, quote_number, customer_name, customer_email, customer_company, grand_total, status, created_at, deleted_at, deleted_by, delete_reason')
          .not('deleted_at', 'is', null)
          .order('deleted_at', { ascending: false }),
        (supabase as any)
          .from('invoices')
          .select('id, invoice_number, customer_name, customer_company, grand_total, status, invoice_type, created_at, deleted_at, deleted_by, delete_reason')
          .not('deleted_at', 'is', null)
          .order('deleted_at', { ascending: false }),
        (supabase as any)
          .from('tax_invoices')
          .select('id, tax_invoice_number, customer_name, customer_company, grand_total, status, created_at, deleted_at, deleted_by, delete_reason')
          .not('deleted_at', 'is', null)
          .order('deleted_at', { ascending: false }),
        (supabase as any)
          .from('receipts')
          .select('id, receipt_number, customer_name, customer_company, amount, receipt_date, payment_method, created_at, deleted_at, deleted_by, delete_reason')
          .not('deleted_at', 'is', null)
          .order('deleted_at', { ascending: false }),
      ]);
      if (qRes.error) throw qRes.error;
      if (iRes.error) throw iRes.error;
      if (txRes.error) throw txRes.error;
      if (rcpRes.error) throw rcpRes.error;
      setQuotes((qRes.data as DeletedQuote[]) || []);
      setInvoices((iRes.data as DeletedInvoice[]) || []);
      setTaxInvoices((txRes.data as DeletedTaxInvoice[]) || []);
      setReceipts((rcpRes.data as DeletedReceipt[]) || []);
    } catch (error: any) {
      toast({ title: 'โหลดถังขยะไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Quote handlers
  const handleRestoreQuote = async (id: string) => {
    setRestoringId(id);
    try {
      const { data, error } = await supabase.rpc('restore_quote' as any, { p_quote_id: id });
      if (error) throw error;
      toast({ title: '↩️ กู้คืนสำเร็จ', description: (data as any)?.message });
      await loadTrash();
    } catch (e: any) {
      toast({ title: 'กู้คืนไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally { setRestoringId(null); }
  };

  const handlePermDeleteQuote = async () => {
    if (!permQuoteTarget) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('permanent_delete_quote' as any, {
        p_quote_id: permQuoteTarget.id,
      });
      if (error) throw error;
      toast({ title: '🗑️ ลบถาวรแล้ว', description: (data as any)?.message });
      setPermQuoteTarget(null);
      await loadTrash();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally { setProcessing(false); }
  };

  // Invoice handlers
  const handleRestoreInvoice = async (id: string) => {
    setRestoringId(id);
    try {
      const { data, error } = await (supabase as any).rpc('restore_invoice', { p_invoice_id: id });
      if (error) throw error;
      toast({ title: '↩️ กู้คืนสำเร็จ', description: (data as any)?.message });
      await loadTrash();
    } catch (e: any) {
      toast({ title: 'กู้คืนไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally { setRestoringId(null); }
  };

  const handlePermDeleteInvoice = async () => {
    if (!permInvoiceTarget) return;
    setProcessing(true);
    try {
      const { data, error } = await (supabase as any).rpc('permanent_delete_invoice', {
        p_invoice_id: permInvoiceTarget.id,
      });
      if (error) throw error;
      toast({ title: '🗑️ ลบถาวรแล้ว', description: (data as any)?.message });
      setPermInvoiceTarget(null);
      await loadTrash();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally { setProcessing(false); }
  };

  // Tax invoice handlers
  const handleRestoreTax = async (id: string) => {
    setRestoringId(id);
    try {
      const { data, error } = await (supabase as any).rpc('restore_tax_invoice', { p_tax_invoice_id: id });
      if (error) throw error;
      toast({ title: '↩️ กู้คืนสำเร็จ', description: (data as any)?.message });
      await loadTrash();
    } catch (e: any) {
      toast({ title: 'กู้คืนไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally { setRestoringId(null); }
  };

  const handlePermDeleteTax = async () => {
    if (!permTaxTarget) return;
    setProcessing(true);
    try {
      const { data, error } = await (supabase as any).rpc('permanent_delete_tax_invoice', {
        p_tax_invoice_id: permTaxTarget.id,
      });
      if (error) throw error;
      toast({ title: '🗑️ ลบถาวรแล้ว', description: (data as any)?.message });
      setPermTaxTarget(null);
      await loadTrash();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally { setProcessing(false); }
  };

  // Receipt handlers
  const handleRestoreReceipt = async (id: string) => {
    setRestoringId(id);
    try {
      const { data, error } = await (supabase as any).rpc('restore_receipt', { p_receipt_id: id });
      if (error) throw error;
      toast({ title: '↩️ กู้คืนสำเร็จ', description: (data as any)?.message });
      await loadTrash();
    } catch (e: any) {
      toast({ title: 'กู้คืนไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally { setRestoringId(null); }
  };

  const handlePermDeleteReceipt = async () => {
    if (!permReceiptTarget) return;
    setProcessing(true);
    try {
      const { data, error } = await (supabase as any).rpc('permanent_delete_receipt', {
        p_receipt_id: permReceiptTarget.id,
      });
      if (error) throw error;
      toast({ title: '🗑️ ลบถาวรแล้ว', description: (data as any)?.message });
      setPermReceiptTarget(null);
      await loadTrash();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally { setProcessing(false); }
  };

  const handleEmptyTrash = async () => {
    if (!showEmptyTrash) return;
    setProcessing(true);
    try {
      const rpcName =
        showEmptyTrash === 'quotes' ? 'empty_quote_trash' :
        showEmptyTrash === 'invoices' ? 'empty_invoice_trash' :
        showEmptyTrash === 'tax-invoices' ? 'empty_tax_invoice_trash' :
        'empty_receipt_trash';
      const { data, error } = await (supabase as any).rpc(rpcName);
      if (error) throw error;
      toast({ title: '✅ ล้างถังขยะแล้ว', description: (data as any)?.message });
      setShowEmptyTrash(null);
      await loadTrash();
    } catch (e: any) {
      toast({ title: 'ล้างไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally { setProcessing(false); }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(n);

  // Filters
  const filteredQuotes = quotes.filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      q.quote_number.toLowerCase().includes(s) ||
      q.customer_name.toLowerCase().includes(s) ||
      (q.customer_company || '').toLowerCase().includes(s) ||
      q.customer_email.toLowerCase().includes(s)
    );
  });

  const filteredInvoices = invoices.filter((inv) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      inv.invoice_number.toLowerCase().includes(s) ||
      inv.customer_name.toLowerCase().includes(s) ||
      (inv.customer_company || '').toLowerCase().includes(s)
    );
  });

  const filteredTaxInvoices = taxInvoices.filter((t) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      t.tax_invoice_number.toLowerCase().includes(s) ||
      t.customer_name.toLowerCase().includes(s) ||
      (t.customer_company || '').toLowerCase().includes(s)
    );
  });

  const filteredReceipts = receipts.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.receipt_number.toLowerCase().includes(s) ||
      r.customer_name.toLowerCase().includes(s) ||
      (r.customer_company || '').toLowerCase().includes(s)
    );
  });

  const activeItems =
    activeTab === 'quotes' ? quotes :
    activeTab === 'invoices' ? invoices :
    activeTab === 'tax-invoices' ? taxInvoices :
    receipts;
  const totalCount = quotes.length + invoices.length + taxInvoices.length + receipts.length;

  const emptyTrashLabel =
    activeTab === 'quotes' ? 'ใบเสนอราคา' :
    activeTab === 'invoices' ? 'ใบวางบิล' :
    activeTab === 'tax-invoices' ? 'ใบกำกับภาษี' :
    'ใบเสร็จ';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <Link
              to="/admin/quotes"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3 h-3" /> กลับ
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-muted-foreground" />
              ถังขยะ
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              ใบเสนอราคา {quotes.length} • ใบวางบิล {invoices.length} • ใบกำกับภาษี {taxInvoices.length} • ใบเสร็จ {receipts.length}
            </p>
          </div>

          {isSuperAdmin && activeItems.length > 0 && (
            <Button variant="destructive" onClick={() => setShowEmptyTrash(activeTab)}>
              <Trash2 className="w-4 h-4 mr-2" />
              ล้าง{emptyTrashLabel}ทั้งหมด
            </Button>
          )}
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCount}</p>
                <p className="text-sm text-muted-foreground">รายการในถังขยะ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        {totalCount > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา: เลขที่ / ชื่อลูกค้า / บริษัท..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="quotes" className="gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              ใบเสนอราคา ({quotes.length})
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              ใบวางบิล ({invoices.length})
            </TabsTrigger>
            <TabsTrigger value="tax-invoices" className="gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              ใบกำกับภาษี
              {taxInvoices.length > 0 && <Badge variant="secondary">{taxInvoices.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="receipts" className="gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              ใบเสร็จ
              {receipts.length > 0 && <Badge variant="secondary">{receipts.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredQuotes.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground">
                  <Trash2 className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">
                    {search ? 'ไม่พบรายการที่ค้นหา' : 'ไม่มีใบเสนอราคาในถังขยะ'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredQuotes.map((quote) => (
                  <Card key={quote.id} className="border-muted-foreground/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-muted-foreground line-through">
                              {displayDocNumber(quote.quote_number)}
                            </span>
                            <Badge variant="outline" className="text-[10px]">{quote.status}</Badge>
                          </div>
                          <div className="text-sm space-y-0.5">
                            <p className="flex items-center gap-1.5 text-muted-foreground">
                              <Building2 className="w-3.5 h-3.5" />
                              {quote.customer_company || quote.customer_name}
                            </p>
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <User className="w-3 h-3" />
                              {quote.customer_email}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              สร้าง: {formatRelativeTime(quote.created_at)}
                            </span>
                            <span className="flex items-center gap-1 text-destructive">
                              <Trash2 className="w-3 h-3" />
                              ลบเมื่อ: {formatRelativeTime(quote.deleted_at)}
                            </span>
                          </div>
                          {quote.delete_reason && (
                            <div className="text-xs bg-muted/50 rounded p-2 mt-2 italic">
                              💬 เหตุผล: {quote.delete_reason}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[140px]">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">ยอดรวม</p>
                            <p className="text-lg font-bold text-muted-foreground">
                              {formatCurrency(quote.grand_total || 0)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestoreQuote(quote.id)}
                              disabled={restoringId === quote.id}
                            >
                              {restoringId === quote.id ? (
                                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1.5" />
                              ) : (
                                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              กู้คืน
                            </Button>
                            {isSuperAdmin && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => setPermQuoteTarget(quote)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredInvoices.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground">
                  <Trash2 className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">
                    {search ? 'ไม่พบรายการที่ค้นหา' : 'ไม่มีใบวางบิลในถังขยะ'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredInvoices.map((inv) => (
                  <Card key={inv.id} className="border-muted-foreground/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-muted-foreground line-through">
                              {displayDocNumber(inv.invoice_number)}
                            </span>
                            <Badge variant="outline" className="text-[10px]">{inv.status}</Badge>
                            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700">
                              {TYPE_LABELS[inv.invoice_type] || inv.invoice_type}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-0.5">
                            <p className="flex items-center gap-1.5 text-muted-foreground">
                              <Building2 className="w-3.5 h-3.5" />
                              {inv.customer_company || inv.customer_name}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              สร้าง: {formatRelativeTime(inv.created_at)}
                            </span>
                            <span className="flex items-center gap-1 text-destructive">
                              <Trash2 className="w-3 h-3" />
                              ลบเมื่อ: {formatRelativeTime(inv.deleted_at)}
                            </span>
                          </div>
                          {inv.delete_reason && (
                            <div className="text-xs bg-muted/50 rounded p-2 mt-2 italic">
                              💬 เหตุผล: {inv.delete_reason}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[140px]">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">ยอดรวม</p>
                            <p className="text-lg font-bold text-muted-foreground">
                              {formatCurrency(inv.grand_total || 0)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestoreInvoice(inv.id)}
                              disabled={restoringId === inv.id}
                            >
                              {restoringId === inv.id ? (
                                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1.5" />
                              ) : (
                                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              กู้คืน
                            </Button>
                            {isSuperAdmin && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => setPermInvoiceTarget(inv)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tax Invoices Tab */}
          <TabsContent value="tax-invoices" className="space-y-3 mt-4">
            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredTaxInvoices.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">ไม่มีใบกำกับภาษีในถังขยะ</p>
                </CardContent>
              </Card>
            ) : (
              filteredTaxInvoices.map((t) => (
                <Card key={t.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono font-semibold text-sm line-through text-muted-foreground">{displayDocNumber(t.tax_invoice_number)}</span>
                          <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                        </div>
                        <p className="text-sm font-medium">{t.customer_name}</p>
                        {t.customer_company && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {t.customer_company}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            ลบเมื่อ: {formatRelativeTime(t.deleted_at)}
                          </span>
                        </div>
                        {t.delete_reason && (
                          <p className="text-xs italic mt-1 text-muted-foreground">
                            เหตุผล: {t.delete_reason}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-primary">{formatCurrency(t.grand_total)}</div>
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-400 text-blue-700 hover:bg-blue-50"
                            onClick={() => handleRestoreTax(t.id)}
                            disabled={restoringId === t.id}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            กู้คืน
                          </Button>
                          {isSuperAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-400 text-red-700 hover:bg-red-50"
                              onClick={() => setPermTaxTarget(t)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Receipts Tab */}
          <TabsContent value="receipts" className="space-y-3 mt-4">
            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredReceipts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Receipt className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">ไม่มีใบเสร็จในถังขยะ</p>
                </CardContent>
              </Card>
            ) : (
              filteredReceipts.map((r) => (
                <Card key={r.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono font-semibold text-sm">{displayDocNumber(r.receipt_number)}</span>
                          {r.payment_method && (
                            <Badge variant="outline" className="text-[10px]">
                              {r.payment_method === 'bank_transfer' ? 'โอน' : r.payment_method}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{r.customer_name}</p>
                        {r.customer_company && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {r.customer_company}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            ลบเมื่อ: {formatRelativeTime(r.deleted_at)}
                          </span>
                        </div>
                        {r.delete_reason && (
                          <p className="text-xs italic mt-1 text-muted-foreground">
                            เหตุผล: {r.delete_reason}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-primary">{formatCurrency(r.amount)}</div>
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-400 text-blue-700 hover:bg-blue-50"
                            onClick={() => handleRestoreReceipt(r.id)}
                            disabled={restoringId === r.id}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            กู้คืน
                          </Button>
                          {isSuperAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-400 text-red-700 hover:bg-red-50"
                              onClick={() => setPermReceiptTarget(r)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Permanent Delete Quote Dialog */}
      <AlertDialog
        open={!!permQuoteTarget}
        onOpenChange={(v) => !v && setPermQuoteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              ลบถาวร — ไม่สามารถย้อนกลับได้!
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  คุณกำลังจะลบ <strong>{permQuoteTarget?.quote_number}</strong> ถาวร
                </p>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg space-y-1 text-sm">
                  <p className="font-medium text-destructive">⚠️ จะลบข้อมูลต่อไปนี้ถาวร:</p>
                  <ul className="list-disc list-inside text-xs space-y-0.5">
                    <li>ใบเสนอราคา + revisions ทั้งหมด</li>
                    <li>ข้อความ chat / negotiations</li>
                    <li>ไฟล์แนบ (PO, attachments)</li>
                    <li>Activity log ทั้งหมด</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermDeleteQuote}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? 'กำลังลบ...' : '🗑️ ลบถาวร'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Invoice Dialog */}
      <AlertDialog
        open={!!permInvoiceTarget}
        onOpenChange={(v) => !v && setPermInvoiceTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              ลบถาวร — ไม่สามารถย้อนกลับได้!
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  คุณกำลังจะลบ <strong>{permInvoiceTarget?.invoice_number}</strong> ถาวร
                </p>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg space-y-1 text-sm">
                  <p className="font-medium text-destructive">⚠️ จะลบข้อมูลต่อไปนี้ถาวร:</p>
                  <ul className="list-disc list-inside text-xs space-y-0.5">
                    <li>ใบวางบิล + รายการสินค้าทั้งหมด</li>
                    <li>ไม่สามารถกู้คืนได้</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermDeleteInvoice}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? 'กำลังลบ...' : '🗑️ ลบถาวร'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Tax Invoice Dialog */}
      <AlertDialog open={!!permTaxTarget} onOpenChange={(open) => !open && setPermTaxTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-700">ลบถาวร?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  คุณกำลังจะลบ <strong>{permTaxTarget?.tax_invoice_number}</strong> ถาวรออกจากระบบ
                </p>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
                  <p className="text-destructive">
                    ⚠️ ใบกำกับภาษีเป็นเอกสารตามกฎหมาย ควรตรวจสอบให้แน่ใจก่อน
                  </p>
                  <p className="text-xs mt-1">การกระทำนี้ <strong className="text-red-600">ไม่สามารถกู้คืนได้</strong></p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handlePermDeleteTax}
              disabled={processing}
            >
              {processing ? 'กำลังลบ...' : 'ลบถาวร'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Receipt Dialog */}
      <AlertDialog open={!!permReceiptTarget} onOpenChange={(open) => !open && setPermReceiptTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-700">ลบถาวร?</AlertDialogTitle>
            <AlertDialogDescription>
              คุณกำลังจะลบ <strong>{permReceiptTarget?.receipt_number}</strong> ถาวรออกจากระบบ
              <br />
              การกระทำนี้ <strong className="text-red-600">ไม่สามารถกู้คืนได้</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handlePermDeleteReceipt}
              disabled={processing}
            >
              {processing ? 'กำลังลบ...' : 'ลบถาวร'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty Trash Dialog */}
      <AlertDialog open={!!showEmptyTrash} onOpenChange={(v) => !v && setShowEmptyTrash(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              ล้างถังขยะ{
                showEmptyTrash === 'quotes' ? 'ใบเสนอราคา' :
                showEmptyTrash === 'invoices' ? 'ใบวางบิล' :
                showEmptyTrash === 'tax-invoices' ? 'ใบกำกับภาษี' :
                'ใบเสร็จ'
              }ทั้งหมด?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  จะลบ <strong>{
                    showEmptyTrash === 'quotes' ? quotes.length :
                    showEmptyTrash === 'invoices' ? invoices.length :
                    showEmptyTrash === 'tax-invoices' ? taxInvoices.length :
                    receipts.length
                  }</strong>{' '}
                  {
                    showEmptyTrash === 'quotes' ? 'ใบเสนอราคา' :
                    showEmptyTrash === 'invoices' ? 'ใบวางบิล' :
                    showEmptyTrash === 'tax-invoices' ? 'ใบกำกับภาษี' :
                    'ใบเสร็จ'
                  }ในถังขยะถาวร
                </p>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-xs text-destructive">
                    ⚠️ ข้อมูลทั้งหมดจะหายไปถาวร — ไม่สามารถย้อนกลับได้
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmptyTrash}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? 'กำลังลบ...' : '🗑️ ล้างทั้งหมด'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

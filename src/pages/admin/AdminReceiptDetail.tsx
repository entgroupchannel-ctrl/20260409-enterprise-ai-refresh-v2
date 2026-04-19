import { useState, useEffect } from 'react';
import DocumentNotesEditor from '@/components/shared/DocumentNotesEditor';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { createNotification, sendQuoteStatusEmail } from '@/lib/notifications';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, Receipt, Printer, Loader2, Building2, Calendar, Link as LinkIcon, CreditCard, Trash2, FileText, Share2,
} from 'lucide-react';
import ReceiptPrintPreviewDialog from '@/components/admin/ReceiptPrintPreviewDialog';
import ShareReceiptDialog from '@/components/admin/ShareReceiptDialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminReceiptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<any>(null);
  const [sourceInvoice, setSourceInvoice] = useState<any>(null);
  const [sourceTaxInvoice, setSourceTaxInvoice] = useState<any>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [totals, setTotals] = useState({ subtotal: 0, vat_amount: 0, grand_total: 0 });

  useEffect(() => { if (id) loadData(); }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: rcpData, error: rcpErr } = await (supabase as any)
        .from('receipts')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

      if (rcpErr) throw rcpErr;
      setReceipt(rcpData);

      // Load items from source
      const sourceId = rcpData?.tax_invoice_id || rcpData?.invoice_id;
      const itemsTable = rcpData?.tax_invoice_id ? 'tax_invoice_items' : 'invoice_items';
      const fkColumn = rcpData?.tax_invoice_id ? 'tax_invoice_id' : 'invoice_id';
      const sourceTable = rcpData?.tax_invoice_id ? 'tax_invoices' : 'invoices';

      if (sourceId) {
        const [srcRes, itemsRes] = await Promise.all([
          (supabase as any).from(sourceTable).select('subtotal, vat_amount, grand_total').eq('id', sourceId).maybeSingle(),
          (supabase as any).from(itemsTable).select('*').eq(fkColumn, sourceId).order('display_order'),
        ]);
        if (srcRes.data && itemsRes.data) {
          const sourceTotal = Number(srcRes.data.grand_total || 0);
          const ratio = sourceTotal > 0 ? rcpData.amount / sourceTotal : 1;
          setItems(
            (itemsRes.data || []).map((it: any) => ({
              ...it,
              line_total: Number(it.line_total || 0) * ratio,
              discount_amount: Number(it.discount_amount || 0) * ratio,
            }))
          );
          setTotals({
            subtotal: Number(srcRes.data.subtotal || 0) * ratio,
            vat_amount: Number(srcRes.data.vat_amount || 0) * ratio,
            grand_total: rcpData.amount,
          });
        }
      }

      if (rcpData?.invoice_id) {
        const { data: inv } = await (supabase as any)
          .from('invoices')
          .select('id, invoice_number')
          .eq('id', rcpData.invoice_id)
          .maybeSingle();
        setSourceInvoice(inv);
      }
      if (rcpData?.tax_invoice_id) {
        const { data: tx } = await (supabase as any)
          .from('tax_invoices')
          .select('id, tax_invoice_number')
          .eq('id', rcpData.tax_invoice_id)
          .maybeSingle();
        setSourceTaxInvoice(tx);
      }
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!receipt) return;
    setDeleting(true);
    const reason = deleteReason.trim() || 'ยกเลิกโดยผู้ดูแลระบบ';
    try {
      const { data, error } = await (supabase as any).rpc('soft_delete_receipt', {
        p_receipt_id: receipt.id,
        p_reason: deleteReason.trim() || null,
      });
      if (error) throw error;

      // Notify customer (in-app + email) — fire-and-forget
      if (receipt.customer_id) {
        createNotification({
          userId: receipt.customer_id,
          type: 'receipt_cancelled',
          title: `ใบเสร็จ ${receipt.receipt_number} ถูกยกเลิก`,
          message: `เหตุผล: ${reason}`,
          priority: 'high',
          actionUrl: `/my-account/receipts/${receipt.id}`,
          actionLabel: 'ดูรายละเอียด',
          linkType: 'receipt',
          linkId: receipt.id,
        });
      }
      if (receipt.customer_email) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        sendQuoteStatusEmail({
          recipientEmail: receipt.customer_email,
          customerName: receipt.customer_name || receipt.customer_company || undefined,
          invoiceNumber: receipt.receipt_number,
          status: 'cancelled',
          amount: receipt.amount ? String(receipt.amount) : undefined,
          viewUrl: origin ? `${origin}/my-account/receipts/${receipt.id}` : undefined,
          note: `ใบเสร็จรับเงินถูกยกเลิกโดยผู้ดูแลระบบ — เหตุผล: ${reason}`,
          relatedType: 'receipt',
          relatedId: receipt.id,
        });
      }

      toast({
        title: '🗑️ ย้ายไปถังขยะแล้ว',
        description: receipt.customer_email
          ? 'แจ้งเตือนลูกค้าทางอีเมลและในระบบเรียบร้อย'
          : (data as any)?.message,
      });
      navigate('/admin/receipts');
    } catch (e: any) {
      toast({ title: 'ย้ายไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setDeleteReason('');
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(n);

  const formatDate = (s: string | null) =>
    s ? new Date(s).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!receipt) {
    return (
      <AdminLayout>
        <div className="py-16 text-center text-muted-foreground">
          <Receipt className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>ไม่พบใบเสร็จรับเงิน</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/receipts')}>
            กลับ
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/receipts')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับ
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-red-400 text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              ย้ายถังขยะ
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)}>
              <Share2 className="w-4 h-4 mr-1.5" />
              แชร์ลิงก์
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPrintDialog(true)}>
              <Printer className="w-4 h-4 mr-1.5" />
              พิมพ์ / PDF
            </Button>
          </div>
        </div>

        <ShareReceiptDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          receiptId={receipt?.id || null}
          receiptNumber={receipt?.receipt_number || null}
        />

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Receipt className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl font-bold font-mono">{receipt.receipt_number}</h1>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  ออกแล้ว
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">จำนวนเงิน</div>
                <div className="text-3xl font-bold text-primary">{formatCurrency(receipt.amount)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                ผู้จ่ายเงิน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-semibold">{receipt.customer_name}</p>
              {receipt.customer_company && (
                <p className="text-muted-foreground">{receipt.customer_company}</p>
              )}
              {receipt.customer_tax_id && (
                <p className="text-xs font-mono">เลขผู้เสียภาษี: {receipt.customer_tax_id}</p>
              )}
              {receipt.customer_address && (
                <p className="text-xs text-muted-foreground mt-2">{receipt.customer_address}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                วันที่ & อ้างอิง
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">วันที่ออก:</span>
                <span>{formatDate(receipt.receipt_date)}</span>
              </div>
              {receipt.payment_method && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">วิธีชำระ:</span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    {receipt.payment_method === 'bank_transfer' ? 'โอนผ่านธนาคาร' : receipt.payment_method}
                  </span>
                </div>
              )}
              {sourceTaxInvoice && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">อ้างอิงใบกำกับภาษี</p>
                  <Link
                    to={`/admin/tax-invoices/${sourceTaxInvoice.id}`}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span className="font-mono">{sourceTaxInvoice.tax_invoice_number}</span>
                  </Link>
                </div>
              )}
              {sourceInvoice && (
                <div className={sourceTaxInvoice ? '' : 'pt-2 border-t'}>
                  <p className="text-xs text-muted-foreground mb-1">อ้างอิงใบวางบิล</p>
                  <Link
                    to={`/admin/invoices/${sourceInvoice.id}`}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span className="font-mono">{sourceInvoice.invoice_number}</span>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {items.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                รายการสินค้า ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-2 w-12">#</th>
                      <th className="text-left p-2">รายการ</th>
                      <th className="text-center p-2 w-16">จำนวน</th>
                      <th className="text-right p-2 w-24">ราคา/หน่วย</th>
                      <th className="text-right p-2 w-28">รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, idx: number) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2 align-top">{idx + 1}</td>
                        <td className="p-2 align-top">
                          <p className="font-medium">{item.product_name}</p>
                          {item.product_description && (
                            <p className="text-xs text-muted-foreground whitespace-pre-line">{item.product_description}</p>
                          )}
                        </td>
                        <td className="p-2 text-center align-top">{item.quantity} {item.unit || ''}</td>
                        <td className="p-2 text-right align-top">{formatCurrency(item.unit_price)}</td>
                        <td className="p-2 text-right align-top font-semibold">{formatCurrency(item.line_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2">
                      <td colSpan={4} className="p-2 text-right font-semibold">ยอดรวม:</td>
                      <td className="p-2 text-right font-semibold">{formatCurrency(totals.subtotal)}</td>
                    </tr>
                    {totals.vat_amount > 0 && (
                      <tr>
                        <td colSpan={4} className="p-2 text-right">VAT 7%:</td>
                        <td className="p-2 text-right">{formatCurrency(totals.vat_amount)}</td>
                      </tr>
                    )}
                    <tr className="border-t">
                      <td colSpan={4} className="p-2 text-right font-bold">จำนวนเงินที่รับ:</td>
                      <td className="p-2 text-right font-bold text-green-700">{formatCurrency(totals.grand_total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes — editable with draft save */}
        <DocumentNotesEditor
          table="receipts"
          id={receipt.id}
          initialNotes={receipt.notes}
          showInternalNotes={false}
        />
        
      </div>

      <ReceiptPrintPreviewDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        receipt={receipt}
        invoiceNumber={sourceInvoice?.invoice_number}
        taxInvoiceNumber={sourceTaxInvoice?.tax_invoice_number}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setDeleteReason('');
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-700">
              <Trash2 className="w-5 h-5" />
              ย้ายใบเสร็จไปถังขยะ?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <p>
                  ใบเสร็จ <span className="font-mono font-semibold text-foreground">{receipt?.receipt_number}</span>
                  {' '}จะถูกย้ายไปถังขยะ — สามารถกู้คืนได้ที่{' '}
                  <Link to="/admin/trash?tab=receipts" className="text-blue-600 underline">ถังขยะ</Link>
                </p>
                {receipt?.customer_email ? (
                  <p className="text-orange-700">
                    📧 ระบบจะส่งอีเมลแจ้งลูกค้า ({receipt.customer_email}) และสร้างการแจ้งเตือนในระบบโดยอัตโนมัติ
                  </p>
                ) : (
                  <p className="text-muted-foreground">ลูกค้าจะไม่ได้รับการแจ้งเตือน (ไม่มีอีเมลในระบบ)</p>
                )}
              </div>
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
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              {deleting ? 'กำลังย้าย...' : 'ย้ายถังขยะ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

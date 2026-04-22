import { useState, useEffect } from 'react';
import DocumentNotesEditor from '@/components/shared/DocumentNotesEditor';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { dispatchNotification } from '@/lib/notifications';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, FileText, Printer, Loader2, Building2, Calendar, Receipt,
  Link as LinkIcon, Trash2,
} from 'lucide-react';
import TaxInvoicePrintPreviewDialog from '@/components/admin/TaxInvoicePrintPreviewDialog';
import CreateReceiptDialog from '@/components/admin/CreateReceiptDialog';
import CreateCreditNoteDialog from '@/components/admin/CreateCreditNoteDialog';
import { FileMinus } from 'lucide-react';

export default function AdminTaxInvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [taxInvoice, setTaxInvoice] = useState<any>(null);
  const [linkedPayment, setLinkedPayment] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [sourceInvoice, setSourceInvoice] = useState<any>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showCreateReceipt, setShowCreateReceipt] = useState(false);
  const [showCreateCN, setShowCreateCN] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [txRes, itemsRes] = await Promise.all([
        (supabase as any).from('tax_invoices').select('*').eq('id', id).is('deleted_at', null).maybeSingle(),
        (supabase as any).from('tax_invoice_items').select('*').eq('tax_invoice_id', id).order('display_order'),
      ]);

      if (txRes.error) throw txRes.error;
      if (itemsRes.error) throw itemsRes.error;

      setTaxInvoice(txRes.data);
      setItems(itemsRes.data || []);

      if (txRes.data?.invoice_id) {
        const { data: invData } = await (supabase as any)
          .from('invoices')
          .select('id, invoice_number, status')
          .eq('id', txRes.data.invoice_id)
          .maybeSingle();
        setSourceInvoice(invData);
      }

      // Load linked payment record
      if (txRes.data?.payment_record_id) {
        const { data: payData } = await (supabase as any)
          .from('payment_records')
          .select('id, amount, payment_date, payment_method, bank_name, reference_number')
          .eq('id', txRes.data.payment_record_id)
          .maybeSingle();
        setLinkedPayment(payData);
      }
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!taxInvoice) return;
    setDeleting(true);
    const reason = deleteReason.trim() || 'ยกเลิกโดยผู้ดูแลระบบ';
    try {
      const { data, error } = await (supabase as any).rpc('soft_delete_tax_invoice', {
        p_tax_invoice_id: taxInvoice.id,
        p_reason: deleteReason.trim() || null,
      });
      if (error) throw error;

      // 🔔 Notify customer (in-app + email) — fire-and-forget
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      await dispatchNotification({
        eventKey: 'tax_invoice.cancelled',
        recipientRole: 'customer',
        recipientUserId: taxInvoice.customer_id || null,
        recipientEmail: taxInvoice.customer_email || null,
        title: `ใบกำกับภาษี ${taxInvoice.tax_invoice_number} ถูกยกเลิก`,
        message: `เหตุผล: ${reason}`,
        priority: 'high',
        actionUrl: `/my-account/tax-invoices/${taxInvoice.id}`,
        actionLabel: 'ดูรายละเอียด',
        linkType: 'tax_invoice',
        linkId: taxInvoice.id,
        entityType: 'tax_invoice',
        entityId: taxInvoice.id,
        customerName: taxInvoice.customer_name || taxInvoice.customer_company || undefined,
        invoiceNumber: taxInvoice.tax_invoice_number,
        amount: taxInvoice.grand_total ? String(taxInvoice.grand_total) : undefined,
        viewUrl: origin ? `${origin}/my-account/tax-invoices/${taxInvoice.id}` : undefined,
        note: `ใบกำกับภาษีถูกยกเลิกโดยผู้ดูแลระบบ — เหตุผล: ${reason}`,
        status: 'cancelled',
      });

      toast({
        title: '🗑️ ย้ายไปถังขยะแล้ว',
        description: taxInvoice.customer_email
          ? 'แจ้งเตือนลูกค้าทางอีเมลและในระบบเรียบร้อย'
          : (data as any)?.message,
      });
      navigate('/admin/tax-invoices');
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

  const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    pending: { label: 'รอดำเนินการ', cls: 'bg-blue-50 text-blue-700 border-blue-300' },
    paid: { label: 'ชำระแล้ว', cls: 'bg-green-50 text-green-700 border-green-300' },
    partially_paid: { label: 'ชำระบางส่วน', cls: 'bg-amber-50 text-amber-700 border-amber-300' },
    cancelled: { label: 'ยกเลิก', cls: 'bg-gray-50 text-gray-500 border-gray-300 line-through' },
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!taxInvoice) {
    return (
      <AdminLayout>
        <div className="py-16 text-center text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>ไม่พบใบกำกับภาษีนี้</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/tax-invoices')}>
            กลับ
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const statusInfo = STATUS_LABELS[taxInvoice.status] || { label: taxInvoice.status, cls: '' };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/tax-invoices')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับ
          </Button>
          <div className="flex items-center gap-2">
            {taxInvoice.status !== 'paid' && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-400 text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                ย้ายถังขยะ
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="border-green-400 text-green-700 hover:bg-green-50"
              onClick={() => setShowCreateReceipt(true)}
            >
              <Receipt className="w-4 h-4 mr-1.5" />
              สร้างใบเสร็จ
            </Button>
            {taxInvoice.status !== 'cancelled' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateCN(true)}
              >
                <FileMinus className="w-4 h-4 mr-1.5" />
                สร้างใบลดหนี้
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowPrintDialog(true)}>
              <Printer className="w-4 h-4 mr-1.5" />
              พิมพ์ / PDF
            </Button>
          </div>
        </div>

        {/* Main card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-6 h-6 text-purple-600" />
                  <h1 className="text-2xl font-bold font-mono">{taxInvoice.tax_invoice_number}</h1>
                </div>
                <Badge variant="outline" className={statusInfo.cls}>{statusInfo.label}</Badge>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">ยอดรวม</div>
                <div className="text-2xl font-bold text-primary">{formatCurrency(taxInvoice.grand_total)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer + Dates grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                ลูกค้า
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-semibold">{taxInvoice.customer_name}</p>
              {taxInvoice.customer_company && (
                <p className="text-muted-foreground">{taxInvoice.customer_company}</p>
              )}
              {taxInvoice.customer_tax_id && (
                <p className="text-xs font-mono">เลขผู้เสียภาษี: {taxInvoice.customer_tax_id}</p>
              )}
              {taxInvoice.customer_branch_code && (
                <p className="text-xs">
                  สาขา: {taxInvoice.customer_branch_code}
                  {taxInvoice.customer_branch_name && ` (${taxInvoice.customer_branch_name})`}
                </p>
              )}
              {taxInvoice.customer_address && (
                <p className="text-xs text-muted-foreground mt-2">{taxInvoice.customer_address}</p>
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
                <span>{formatDate(taxInvoice.tax_invoice_date)}</span>
              </div>
              {sourceInvoice && (
                <div className="pt-2 border-t">
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
              {linkedPayment && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">การชำระเงินที่ผูก</p>
                  <div className="text-sm">
                    <p className="font-semibold text-primary">{formatCurrency(linkedPayment.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(linkedPayment.payment_date).toLocaleDateString('th-TH')}
                      {linkedPayment.bank_name && ` • ${linkedPayment.bank_name}`}
                    </p>
                    {linkedPayment.reference_number && (
                      <p className="text-xs font-mono">อ้างอิง: {linkedPayment.reference_number}</p>
                    )}
                  </div>
                </div>
              )}
              {taxInvoice.delivery_date && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">วันที่จัดส่ง</p>
                  <p>{formatDate(taxInvoice.delivery_date)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              รายการสินค้า ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">ไม่มีรายการสินค้า</p>
            ) : (
              <div className="space-y-2">
                {items.map((it: any) => (
                  <div key={it.id} className="flex justify-between items-start p-3 border rounded">
                    <div className="flex-1">
                      <p className="font-semibold">{it.product_name}</p>
                      {it.product_description && (
                        <p className="text-xs text-muted-foreground">{it.product_description}</p>
                      )}
                      <p className="text-xs mt-1">
                        จำนวน: {it.quantity} {it.unit} • ราคา/หน่วย: {formatCurrency(it.unit_price)}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">{formatCurrency(it.line_total)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="max-w-md ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">มูลค่าสินค้า/บริการ:</span>
                <span>{formatCurrency(taxInvoice.subtotal)}</span>
              </div>
              {(taxInvoice.discount_amount || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ส่วนลด:</span>
                  <span>-{formatCurrency(taxInvoice.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ภาษีมูลค่าเพิ่ม 7%:</span>
                <span>{formatCurrency(taxInvoice.vat_amount)}</span>
              </div>
              {(taxInvoice.withholding_tax_amount || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">หัก ณ ที่จ่าย:</span>
                  <span>-{formatCurrency(taxInvoice.withholding_tax_amount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t font-bold text-base">
                <span>รวมทั้งสิ้น:</span>
                <span className="text-primary">{formatCurrency(taxInvoice.grand_total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery info */}
        {(taxInvoice.delivery_address || taxInvoice.delivery_method || taxInvoice.tracking_number) && (
          <Card>
            <CardContent className="pt-4 space-y-1 text-sm">
              <p className="text-xs font-semibold text-muted-foreground mb-2">ข้อมูลการจัดส่ง</p>
              {taxInvoice.delivery_address && <p>ที่อยู่: {taxInvoice.delivery_address}</p>}
              {taxInvoice.delivery_method && <p>วิธี: {taxInvoice.delivery_method}</p>}
              {taxInvoice.tracking_number && <p>Tracking: <span className="font-mono">{taxInvoice.tracking_number}</span></p>}
            </CardContent>
          </Card>
        )}

        {/* Notes — editable with draft save */}
        <DocumentNotesEditor
          table="tax_invoices"
          id={taxInvoice.id}
          initialNotes={taxInvoice.notes}
          initialInternalNotes={taxInvoice.internal_notes ?? null}
          showInternalNotes
        />
      </div>

      <TaxInvoicePrintPreviewDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        taxInvoice={taxInvoice}
        items={items}
        invoiceNumber={sourceInvoice?.invoice_number}
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
              ย้ายใบกำกับภาษีไปถังขยะ?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <p>
                  เลขที่ <span className="font-mono font-semibold text-foreground">{taxInvoice?.tax_invoice_number}</span>
                  {taxInvoice?.customer_name && <> — {taxInvoice.customer_name}</>}
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>เอกสารจะถูกซ่อนจากรายการหลัก แต่ยังกู้คืนได้ภายใน 30 วันที่ <Link to="/admin/trash?tab=tax-invoices" className="text-blue-600 underline">ถังขยะ</Link></li>
                  <li>เลขที่เอกสารเดิมจะถูกปลดล็อก เพื่อนำกลับมาใช้สร้างใบใหม่ได้</li>
                  {taxInvoice?.customer_email ? (
                    <li className="text-orange-700">
                      📧 ระบบจะส่งอีเมลแจ้งลูกค้า ({taxInvoice.customer_email}) และสร้างการแจ้งเตือนในระบบโดยอัตโนมัติ
                    </li>
                  ) : (
                    <li>ลูกค้าจะไม่ได้รับการแจ้งเตือน (ไม่มีอีเมลในระบบ)</li>
                  )}
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              เหตุผลการลบ <span className="text-muted-foreground font-normal">(ไม่บังคับ แต่แนะนำเพื่อตรวจสอบย้อนหลัง)</span>
            </label>
            <Textarea
              placeholder="เช่น: ออกผิดเลข, ลูกค้าขอยกเลิก, ข้อมูลที่อยู่ผิด..."
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

      {taxInvoice && (
        <CreateReceiptDialog
          open={showCreateReceipt}
          onOpenChange={setShowCreateReceipt}
          taxInvoiceId={taxInvoice.id}
        />
      )}

      <CreateCreditNoteDialog
        open={showCreateCN}
        onOpenChange={setShowCreateCN}
        taxInvoiceId={id!}
        onSuccess={() => loadData()}
      />
    </AdminLayout>
  );
}

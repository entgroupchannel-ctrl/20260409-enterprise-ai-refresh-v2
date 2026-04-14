import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, Loader2, Printer, Send, CircleCheckBig, Ban, FileText,
  User, Calendar, Receipt, Save, Lock, MessageSquare,
  Clock, Banknote, ExternalLink, Mail,
} from 'lucide-react';
import InvoicePrintPreviewDialog from '@/components/admin/InvoicePrintPreviewDialog';

type InvoiceRow = any;
type InvoiceItem = any;

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  draft: { label: 'ฉบับร่าง', cls: 'bg-gray-100 text-gray-700 border-gray-300' },
  sent: { label: 'ส่งแล้ว', cls: 'bg-blue-100 text-blue-700 border-blue-300' },
  partially_paid: { label: 'ชำระบางส่วน', cls: 'bg-amber-100 text-amber-700 border-amber-300' },
  paid: { label: 'ชำระแล้ว', cls: 'bg-green-100 text-green-700 border-green-300' },
  overdue: { label: 'เกินกำหนด', cls: 'bg-red-100 text-red-700 border-red-300' },
  cancelled: { label: 'ยกเลิก', cls: 'bg-gray-100 text-gray-500 border-gray-300 line-through' },
};

const TYPE_LABELS: Record<string, string> = {
  full: 'เต็มจำนวน',
  downpayment: 'มัดจำ',
  installment: 'งวดแบ่ง',
  final: 'ส่วนที่เหลือ',
};

export default function AdminInvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [invoice, setInvoice] = useState<InvoiceRow | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [paymentRecords, setPaymentRecords] = useState<any[]>([]);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editInternalNotes, setEditInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [invRes, itemsRes, paymentRes] = await Promise.all([
        (supabase as any).from('invoices').select('*').eq('id', id).maybeSingle(),
        (supabase as any).from('invoice_items').select('*').eq('invoice_id', id).order('display_order'),
        (supabase as any).from('payment_records').select('*').eq('invoice_id', id).order('created_at', { ascending: false }),
      ]);

      if (invRes.error) throw invRes.error;
      if (!invRes.data) {
        toast({ title: 'ไม่พบใบวางบิล', variant: 'destructive' });
        navigate('/admin/invoices');
        return;
      }

      setInvoice(invRes.data);
      setEditNotes(invRes.data.notes || '');
      setEditInternalNotes(invRes.data.internal_notes || '');
      setItems(itemsRes.data || []);
      setPaymentRecords(paymentRes.data || []);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStatus = async (newStatus: string, extra: Record<string, any> = {}) => {
    if (!invoice) return;
    setUpdating(true);
    try {
      const payload: any = { status: newStatus, ...extra };
      const { error } = await (supabase as any)
        .from('invoices')
        .update(payload)
        .eq('id', invoice.id);
      if (error) throw error;
      
      toast({
        title: '✅ อัปเดตสถานะสำเร็จ',
        description: `เปลี่ยนเป็น "${STATUS_LABELS[newStatus]?.label || newStatus}"`,
      });
      await loadData();
    } catch (e: any) {
      toast({ title: 'ไม่สามารถอัปเดต', description: e.message, variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const handleSend = () => updateStatus('sent');
  const handleMarkPaid = () => updateStatus('paid');
  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast({ title: 'กรุณาระบุเหตุผล', variant: 'destructive' });
      return;
    }
    updateStatus('cancelled', {
      cancelled_at: new Date().toISOString(),
      cancel_reason: cancelReason,
    });
    setCancelReason('');
  };

  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  const handleSaveNotes = async () => {
    if (!invoice) return;
    setSavingNotes(true);
    try {
      const { error } = await (supabase as any)
        .from('invoices')
        .update({
          notes: editNotes || null,
          internal_notes: editInternalNotes || null,
        })
        .eq('id', invoice.id);

      if (error) throw error;

      toast({ title: '✅ บันทึกหมายเหตุสำเร็จ' });
      setInvoice({
        ...invoice,
        notes: editNotes || null,
        internal_notes: editInternalNotes || null,
      });
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSavingNotes(false);
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

  if (!invoice) return null;

  const statusInfo = STATUS_LABELS[invoice.status] || { label: invoice.status, cls: '' };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
        {/* Back + Header actions */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/invoices')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับ
          </Button>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1.5" />
              พิมพ์ / PDF
            </Button>
            {invoice.status === 'draft' && (
              <Button size="sm" onClick={handleSend} disabled={updating}>
                <Send className="w-4 h-4 mr-1.5" />
                ส่งให้ลูกค้า
              </Button>
            )}
            {(invoice.status === 'sent' || invoice.status === 'partially_paid') && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleMarkPaid} 
                disabled={updating} 
                className="border-green-600 text-green-700 hover:bg-green-50"
                title="ใช้เมื่อได้รับเงินแล้วแต่ลูกค้าไม่ได้ส่งสลิปผ่านระบบ"
              >
                <CircleCheckBig className="w-4 h-4 mr-1.5" />
                ยืนยันชำระเอง
              </Button>
            )}
            {invoice.status !== 'cancelled' && invoice.status !== 'paid' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <Ban className="w-4 h-4 mr-1.5" />
                    ยกเลิก
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ยกเลิกใบวางบิลนี้?</AlertDialogTitle>
                    <AlertDialogDescription>
                      การยกเลิกจะทำให้ invoice เป็นโมฆะ กรุณาระบุเหตุผล
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Textarea
                    placeholder="เหตุผลการยกเลิก..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
                      ยืนยันยกเลิก
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Main header card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Receipt className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl font-bold font-mono">{invoice.invoice_number}</h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`${statusInfo.cls}`}>{statusInfo.label}</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    {TYPE_LABELS[invoice.invoice_type] || invoice.invoice_type}
                    {invoice.invoice_type === 'downpayment' && invoice.downpayment_percent != null && 
                      ` ${invoice.downpayment_percent}%`}
                    {invoice.invoice_type === 'installment' && invoice.installment_number != null &&
                      ` งวด ${invoice.installment_number}/${invoice.installment_total}`}
                  </Badge>
                </div>
                {invoice.cancelled_at && invoice.cancel_reason && (
                  <div className="mt-2 text-xs text-red-600">
                    ❌ ยกเลิกเมื่อ {formatDate(invoice.cancelled_at)} — เหตุผล: {invoice.cancel_reason}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">จำนวนเงินรวม</div>
                <div className="text-3xl font-bold text-primary">{formatCurrency(invoice.grand_total)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two columns: Customer | Dates & Meta */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4" /> ลูกค้า
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="font-semibold">{invoice.customer_name}</div>
              {invoice.customer_company && <div className="text-muted-foreground">{invoice.customer_company}</div>}
              {invoice.customer_address && (
                <div className="text-xs whitespace-pre-line">{invoice.customer_address}</div>
              )}
              {invoice.customer_tax_id && (
                <div className="text-xs">
                  เลขประจำตัวผู้เสียภาษี: <span className="font-mono">{invoice.customer_tax_id}</span>
                  {invoice.customer_branch_type === 'head_office' && ' (สำนักงานใหญ่)'}
                  {invoice.customer_branch_type === 'branch' && invoice.customer_branch_name &&
                    ` (สาขา ${invoice.customer_branch_name})`}
                </div>
              )}
              {invoice.customer_phone && <div className="text-xs">โทร: {invoice.customer_phone}</div>}
              {invoice.customer_email && <div className="text-xs">{invoice.customer_email}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" /> วันที่ & เงื่อนไข
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">วันที่ออก:</span>
                <span>{formatDate(invoice.invoice_date)}</span>
              </div>
              {invoice.due_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ครบกำหนด:</span>
                  <span className={
                    invoice.status !== 'paid' && invoice.status !== 'cancelled' &&
                    new Date(invoice.due_date) < new Date() ? 'text-red-600 font-semibold' : ''
                  }>
                    {formatDate(invoice.due_date)}
                  </span>
                </div>
              )}
              {invoice.payment_terms && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เงื่อนไขชำระ:</span>
                  <span>{invoice.payment_terms}</span>
                </div>
              )}
              {invoice.quote_id && (
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">ใบเสนอราคา:</span>
                  <Link to={`/admin/quotes/${invoice.quote_id}`} className="text-blue-600 hover:underline text-xs">
                    ดูใบเสนอราคา →
                  </Link>
                </div>
              )}
              {invoice.sale_order_id && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sale Order:</span>
                  <span className="text-xs">มี SO linked</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Items - card based (matches Quote pattern) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" /> รายการสินค้า ({items.length} รายการ)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-sm">ไม่มีรายการสินค้า</p>
            ) : (
              <div className="space-y-3">
                {items.map((item: any) => {
                  const hasDiscount = (item.discount_amount || 0) > 0;
                  const discountPercent = hasDiscount && item.unit_price > 0
                    ? Math.round(((item.discount_amount || 0) / (item.unit_price * (item.quantity || 1))) * 1000) / 10
                    : 0;

                  return (
                    <div
                      key={item.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground">{item.product_name || 'N/A'}</h4>
                          {item.product_description && (
                            <p className="text-sm text-muted-foreground">{item.product_description}</p>
                          )}
                          {item.sku && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              SKU: <span className="font-mono">{item.sku}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4 shrink-0">
                          <p className="font-semibold text-primary">{formatCurrency(item.line_total || 0)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span>จำนวน: {item.quantity || 0} {item.unit || ''}</span>
                        <span>ราคา/หน่วย: {formatCurrency(item.unit_price || 0)}</span>
                        {hasDiscount && (
                          <span className="text-green-600 dark:text-green-400">
                            ส่วนลด {discountPercent > 0 ? `${discountPercent}%` : formatCurrency(item.discount_amount)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="max-w-sm ml-auto space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">รวมเป็นเงิน:</span>
                <span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {(invoice.discount_amount || 0) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>ส่วนลด:</span>
                  <span className="font-mono">-{formatCurrency(invoice.discount_amount)}</span>
                </div>
              )}
              {(invoice.vat_amount || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT {invoice.vat_percent || 7}%:</span>
                  <span className="font-mono">{formatCurrency(invoice.vat_amount)}</span>
                </div>
              )}
              {(invoice.withholding_tax_amount || 0) > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>หัก ณ ที่จ่าย {invoice.withholding_tax_percent || 3}%:</span>
                  <span className="font-mono">-{formatCurrency(invoice.withholding_tax_amount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>รวมทั้งสิ้น:</span>
                <span className="text-primary">{formatCurrency(invoice.grand_total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Editor — Customer + Internal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              หมายเหตุ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-notes" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3" />
                หมายเหตุสำหรับลูกค้า
                <span className="text-[10px] font-normal">(แสดงในใบวางบิลที่พิมพ์)</span>
              </Label>
              <Textarea
                id="invoice-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="เช่น: ขอบคุณที่ใช้บริการ, รายละเอียดเงื่อนไขเพิ่มเติม..."
                rows={3}
                className="text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-internal-notes" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-600" />
                หมายเหตุภายใน
                <span className="text-[10px] font-normal text-amber-700">(เห็นเฉพาะทีมงาน — ไม่แสดงในใบที่พิมพ์)</span>
              </Label>
              <Textarea
                id="invoice-internal-notes"
                value={editInternalNotes}
                onChange={(e) => setEditInternalNotes(e.target.value)}
                placeholder="บันทึกภายใน: ติดต่อลูกค้าทาง LINE, ลูกค้าขอแบ่งจ่าย, ฯลฯ"
                rows={3}
                className="text-sm resize-none border-amber-200 focus-visible:ring-amber-400 bg-amber-50/30"
              />
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSaveNotes}
                disabled={
                  savingNotes ||
                  (editNotes === (invoice.notes || '') &&
                    editInternalNotes === (invoice.internal_notes || ''))
                }
              >
                <Save className="w-4 h-4 mr-1.5" />
                {savingNotes ? 'กำลังบันทึก...' : 'บันทึกหมายเหตุ'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <InvoicePrintPreviewDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        invoice={invoice}
        items={items}
      />
    </AdminLayout>
  );
}

import { useEffect, useState, useRef } from 'react';
import DocumentDraftBadge from '@/components/shared/DocumentDraftBadge';
import DocumentNotesEditor from '@/components/shared/DocumentNotesEditor';
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
import { createNotification, sendQuoteStatusEmail } from '@/lib/notifications';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, Loader2, Printer, Send, CircleCheckBig, Ban, FileText,
  User, Calendar, Receipt, Save, Lock, MessageSquare,
  Clock, Banknote, ExternalLink, Mail, UserPlus, AlertCircle,
  Trash2, RotateCcw, ShieldCheck, DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import InvoicePrintPreviewDialog from '@/components/admin/InvoicePrintPreviewDialog';
import ConfirmPaymentDialog from '@/components/admin/ConfirmPaymentDialog';
import VerifyPaymentDialog from '@/components/admin/VerifyPaymentDialog';
import CreateTaxInvoiceFromInvoiceDialog from '@/components/admin/CreateTaxInvoiceFromInvoiceDialog';
import CreateReceiptDialog from '@/components/admin/CreateReceiptDialog';
import InvoiceShareActivity from '@/components/admin/InvoiceShareActivity';

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
  const [showConfirmPayment, setShowConfirmPayment] = useState(false);
  const [linkingCustomer, setLinkingCustomer] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editInternalNotes, setEditInternalNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [savedInternalNotes, setSavedInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesLastSaved, setNotesLastSaved] = useState<Date | null>(null);
  const notesIsDirty = editNotes !== savedNotes || editInternalNotes !== savedInternalNotes;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState<any>(null);
  const [showCreateTaxInvoice, setShowCreateTaxInvoice] = useState(false);
  const [showCreateReceipt, setShowCreateReceipt] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [invRes, itemsRes, paymentRes] = await Promise.all([
        (supabase as any).from('invoices').select('*').eq('id', id).is('deleted_at', null).maybeSingle(),
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
      setSavedNotes(invRes.data.notes || '');
      setSavedInternalNotes(invRes.data.internal_notes || '');
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
  const handleMarkPaid = () => setShowConfirmPayment(true);
  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast({ title: 'กรุณาระบุเหตุผล', variant: 'destructive' });
      return;
    }
    const reason = cancelReason.trim();
    await updateStatus('cancelled', {
      cancelled_at: new Date().toISOString(),
      cancel_reason: reason,
    });
    setCancelReason('');

    // Notify customer (in-app + email) — fire-and-forget
    if (invoice?.customer_id) {
      createNotification({
        userId: invoice.customer_id,
        type: 'invoice_cancelled',
        title: `ใบวางบิล ${invoice.invoice_number} ถูกยกเลิก`,
        message: `เหตุผล: ${reason}`,
        priority: 'high',
        actionUrl: `/my-invoices/${invoice.id}`,
        actionLabel: 'ดูรายละเอียด',
        linkType: 'invoice',
        linkId: invoice.id,
      });
    }
    if (invoice?.customer_email) {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      sendQuoteStatusEmail({
        recipientEmail: invoice.customer_email,
        customerName: invoice.customer_name || invoice.customer_company || undefined,
        invoiceNumber: invoice.invoice_number,
        status: 'cancelled',
        amount: invoice.grand_total ? String(invoice.grand_total) : undefined,
        viewUrl: origin ? `${origin}/my-invoices/${invoice.id}` : undefined,
        note: `ใบวางบิลถูกยกเลิกโดยผู้ดูแลระบบ — เหตุผล: ${reason}`,
        relatedType: 'invoice',
        relatedId: invoice.id,
      });
    }
  };

  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  const handleDelete = async () => {
    if (!invoice) return;
    if (!deleteConfirmed) {
      toast({ title: 'กรุณายืนยัน', description: 'ติ๊กช่องยืนยันก่อนย้ายไปถังขยะ', variant: 'destructive' });
      return;
    }
    if (!deleteReason.trim()) {
      toast({ title: 'กรุณาระบุเหตุผล', description: 'ต้องระบุเหตุผล', variant: 'destructive' });
      return;
    }

    setUpdating(true);
    try {
      const { data, error } = await (supabase as any).rpc('soft_delete_invoice', {
        p_invoice_id: invoice.id,
        p_reason: deleteReason,
      });

      if (error) throw error;

      toast({
        title: '🗑 ย้ายไปถังขยะแล้ว',
        description:
          `${invoice.invoice_number} อยู่ในถังขยะ — เลขเอกสารถูกปลดล็อกให้ใช้สร้างใบใหม่ได้ทันที`,
      });

      navigate('/admin/trash?tab=invoices');
    } catch (e: any) {
      toast({ title: 'ย้ายไปถังขยะไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setUpdating(false);
      setShowDeleteDialog(false);
      setDeleteReason('');
      setDeleteConfirmed(false);
    }
  };

  const handleRestore = async () => {
    if (!invoice) return;
    setUpdating(true);
    try {
      const { error } = await (supabase as any)
        .from('invoices')
        .update({ status: 'draft', cancelled_at: null, cancel_reason: null })
        .eq('id', invoice.id);
      if (error) throw error;
      toast({ title: '✅ คืนสถานะสำเร็จ', description: `${invoice.invoice_number} กลับเป็น draft แล้ว` });
      await loadData();
    } catch (e: any) {
      toast({ title: 'คืนสถานะไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setUpdating(false);
      setShowRestoreDialog(false);
    }
  };

  const handleLinkCustomer = async () => {
    if (!invoice) return;
    if (!invoice.customer_email) {
      toast({
        title: 'ไม่สามารถเชื่อมได้',
        description: 'ไม่มี customer_email ใน invoice นี้',
        variant: 'destructive',
      });
      return;
    }

    setLinkingCustomer(true);
    try {
      const { data: userData, error: userError } = await (supabase as any)
        .from('users')
        .select('id, email')
        .eq('email', invoice.customer_email.toLowerCase().trim())
        .maybeSingle();

      if (userError) throw userError;

      if (!userData) {
        toast({
          title: 'ไม่พบ user ในระบบ',
          description: `ลูกค้า ${invoice.customer_email} ยังไม่ได้สมัครสมาชิก`,
          variant: 'destructive',
        });
        return;
      }

      const { error: updateError } = await (supabase as any)
        .from('invoices')
        .update({ customer_id: userData.id })
        .eq('id', invoice.id);

      if (updateError) throw updateError;

      toast({
        title: '✅ เชื่อมลูกค้าสำเร็จ',
        description: `ลูกค้า ${userData.email} สามารถเห็นใบวางบิลนี้ได้แล้ว`,
      });

      await loadData();
    } catch (e: any) {
      toast({
        title: 'เชื่อมไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLinkingCustomer(false);
    }
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

  const hasPayments = paymentRecords.length > 0;
  const canDelete = invoice.status !== 'paid' && invoice.status !== 'partially_paid' && !hasPayments;
  const canCancel = invoice.status === 'sent' || invoice.status === 'overdue';
  const canRestore = invoice.status === 'cancelled' && !hasPayments;
  const statusInfo = STATUS_LABELS[invoice.status] || { label: invoice.status, cls: '' };

  const totalVerified = paymentRecords
    .filter((p: any) => p.verification_status === 'verified')
    .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

  const totalPending = paymentRecords
    .filter((p: any) => p.verification_status === 'pending')
    .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

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
              <Button size="sm" onClick={handleSend} disabled={updating || items.length === 0}>
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
            
            {(invoice.status === 'paid' || invoice.status === 'partially_paid') && (
              <Button
                size="sm"
                variant="outline"
                className="border-purple-400 text-purple-700 hover:bg-purple-50"
                onClick={() => setShowCreateTaxInvoice(true)}
              >
                <FileText className="w-4 h-4 mr-1.5" />
                สร้างใบกำกับภาษี
              </Button>
            )}

            {(invoice.status === 'paid' || invoice.status === 'partially_paid') && (
              <Button
                size="sm"
                variant="outline"
                className="border-green-400 text-green-700 hover:bg-green-50"
                onClick={() => setShowCreateReceipt(true)}
              >
                <Receipt className="w-4 h-4 mr-1.5" />
                สร้างใบเสร็จ
              </Button>
            )}
            
            {/* Cancel — only when sent/overdue */}
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-orange-400 text-orange-700 hover:bg-orange-50">
                    <Ban className="w-4 h-4 mr-1.5" />
                    ยกเลิก
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <Ban className="w-5 h-5 text-orange-600" />
                      ยกเลิกใบวางบิลนี้?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      ใบวางบิล <span className="font-mono font-semibold">{invoice.invoice_number}</span> จะถูกทำเครื่องหมายเป็นโมฆะ
                      (ข้อมูลยังเก็บอยู่ในระบบและ audit trail) — ลูกค้าจะเห็นสถานะเป็น "ยกเลิก"
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="cancel-reason" className="text-sm font-semibold">
                      เหตุผลการยกเลิก <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="cancel-reason"
                      placeholder="เช่น: ลูกค้าขอยกเลิก, ราคาไม่ตรง, ออกซ้ำ..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setCancelReason('')}>ปิด</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleCancel} 
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={!cancelReason.trim()}
                    >
                      ยืนยันยกเลิก
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Restore — only for cancelled without payments */}
            {canRestore && (
              <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-blue-400 text-blue-700 hover:bg-blue-50">
                    <RotateCcw className="w-4 h-4 mr-1.5" />
                    คืนสถานะ
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 text-blue-600" />
                      คืนสถานะใบวางบิลนี้?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      ใบวางบิล <span className="font-mono font-semibold">{invoice.invoice_number}</span> จะกลับไปเป็น <strong>draft</strong> และสามารถแก้ไข/ส่งใหม่ได้
                      <br /><br />
                      เหตุผลยกเลิกเดิม: <em>{invoice.cancel_reason || '-'}</em>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ปิด</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleRestore} 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={updating}
                    >
                      คืนสถานะ
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Delete — any status without payment */}
            {canDelete && (
              <AlertDialog open={showDeleteDialog} onOpenChange={(open) => {
                setShowDeleteDialog(open);
                if (!open) { setDeleteReason(''); setDeleteConfirmed(false); }
              }}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-red-500 text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    ย้ายถังขยะ
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-700">
                      <Trash2 className="w-5 h-5" />
                      ย้ายใบวางบิลไปถังขยะ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      ใบวางบิล <span className="font-mono font-semibold">{invoice.invoice_number}</span> จะถูกย้ายไป
                      <strong> ถังขยะ</strong> — สามารถกู้คืนได้ที่เมนู "ถังขยะ"
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <div className="space-y-3">
                    <div className="text-xs space-y-1 p-3 bg-muted/50 rounded border">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Status: {STATUS_LABELS[invoice.status]?.label || invoice.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Payment records: {paymentRecords.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Items: {items.length} รายการ (จะถูกลบทั้งหมด)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delete-reason" className="text-sm font-semibold">
                        เหตุผลการลบ <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="delete-reason"
                        placeholder="เช่น: สร้างผิด, duplicate, ข้อมูลต้นทางเสียหาย..."
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
                      <Checkbox
                        id="delete-confirm"
                        checked={deleteConfirmed}
                        onCheckedChange={(checked) => setDeleteConfirmed(checked === true)}
                      />
                      <label 
                        htmlFor="delete-confirm" 
                        className="text-xs text-red-800 cursor-pointer leading-relaxed"
                      >
                        ฉันเข้าใจว่าใบวางบิลจะถูกย้ายไปถังขยะ และลูกค้าจะมองไม่เห็น
                      </label>
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={(e) => { e.preventDefault(); handleDelete(); }}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={!deleteConfirmed || !deleteReason.trim() || updating}
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      {updating ? 'กำลังย้าย...' : 'ย้ายถังขยะ'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* ⚠️ Unlinked Customer Warning */}
        {!invoice.customer_id && invoice.status !== 'draft' && invoice.status !== 'cancelled' && (
          <Card className="border-orange-300 bg-orange-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900">
                    ⚠️ ใบวางบิลนี้ยังไม่ได้เชื่อมกับบัญชีลูกค้า
                  </h3>
                  <p className="text-sm text-orange-700 mt-0.5">
                    ลูกค้าจะยังไม่เห็นใบวางบิลนี้ในหน้า "ใบวางบิลของฉัน" 
                    (เกิดจาก quote เก่าที่ไม่มี user account เชื่อมโยง)
                  </p>
                  {invoice.customer_email && (
                    <p className="text-xs text-orange-700 mt-1">
                      Email: <span className="font-mono">{invoice.customer_email}</span>
                    </p>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 border-orange-600 text-orange-700 hover:bg-orange-100"
                    onClick={handleLinkCustomer}
                    disabled={linkingCustomer || !invoice.customer_email}
                  >
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    {linkingCustomer ? 'กำลังเชื่อม...' : 'เชื่อมกับบัญชีลูกค้า'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Flow Banner */}
        {invoice.status === 'sent' && paymentRecords.length === 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">
                    📨 ส่งใบวางบิลให้ลูกค้าแล้ว
                  </h3>
                  <p className="text-sm text-blue-700 mt-0.5">
                    กำลังรอลูกค้าชำระเงินและอัปโหลดสลิปผ่านระบบ — 
                    หรือคลิก <span className="font-semibold">"ยืนยันชำระเอง"</span> 
                    ถ้าได้รับเงินนอกระบบแล้ว
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentRecords.length > 0 && paymentRecords.some((p) => p.verification_status === 'pending') && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">
                    🕑 ลูกค้าส่งสลิปการชำระเงินแล้ว ({paymentRecords.filter((p) => p.verification_status === 'pending').length} รายการ)
                  </h3>
                  <p className="text-sm text-amber-700 mt-0.5">
                    กรุณาตรวจสอบสลิปด้านล่างและยืนยันการชำระ
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Phase 8.1: Payment Progress + Slips (2-column) */}
        {paymentRecords.length > 0 && invoice && (
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  สถานะการชำระเงิน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ยอดใบวางบิล:</span>
                  <span className="font-mono font-semibold">
                    ฿{Number(invoice.grand_total).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-green-700 dark:text-green-400">
                  <span>✅ Verified:</span>
                  <span className="font-mono">
                    ฿{totalVerified.toLocaleString()}
                  </span>
                </div>
                {totalPending > 0 && (
                  <div className="flex justify-between text-amber-700 dark:text-amber-400">
                    <span>⏳ Pending:</span>
                    <span className="font-mono">
                      ฿{totalPending.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className={cn(
                      "h-full transition-all",
                      totalVerified >= Number(invoice.grand_total) ? "bg-green-500" :
                      totalVerified + totalPending >= Number(invoice.grand_total) ? "bg-amber-500" :
                      "bg-blue-500"
                    )}
                    style={{
                      width: `${Math.min(100, (totalVerified / Number(invoice.grand_total)) * 100)}%`
                    }}
                  />
                </div>
                {totalVerified > Number(invoice.grand_total) + 0.01 && (
                  <div className="text-xs text-destructive flex items-start gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>
                      Verified เกินยอดใบวางบิล ฿
                      {(totalVerified - Number(invoice.grand_total)).toLocaleString()}
                      {' '}— อาจมีสลิปซ้ำ ควรตรวจสอบและ reject
                    </span>
                  </div>
                )}
                {totalVerified < Number(invoice.grand_total) - 0.01 && totalPending === 0 && (
                  <div className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>
                      ยังขาดอีก ฿{(Number(invoice.grand_total) - totalVerified).toLocaleString()}
                    </span>
                  </div>
                )}
                {Math.abs(totalVerified - Number(invoice.grand_total)) < 0.01 && (
                  <div className="text-xs text-green-700 dark:text-green-400 flex items-start gap-1 mt-1">
                    <span>✅ ชำระครบยอดใบวางบิลแล้ว</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  สลิปการชำระเงินจากลูกค้า ({paymentRecords.length} รายการ)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {paymentRecords.map((pr: any) => {
                    const statusMap: Record<string, { label: string; cls: string }> = {
                      pending: { label: 'รอตรวจสอบ', cls: 'bg-amber-50 text-amber-700 border-amber-300' },
                      verified: { label: 'ยืนยันแล้ว', cls: 'bg-green-50 text-green-700 border-green-300' },
                      rejected: { label: 'ปฏิเสธ', cls: 'bg-red-50 text-red-700 border-red-300' },
                    };
                    const info = statusMap[pr.verification_status] || statusMap.pending;

                    return (
                      <div
                        key={pr.id}
                        className={`p-3 border rounded-lg ${info.cls}`}
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant="outline" className={info.cls}>
                                {info.label}
                              </Badge>
                              <span className="text-xs">
                                วันที่โอน: {new Date(pr.payment_date).toLocaleDateString('th-TH', {
                                  year: 'numeric', month: 'short', day: 'numeric',
                                })}
                              </span>
                              {pr.payment_method && (
                                <span className="text-xs text-muted-foreground">
                                  • {pr.payment_method === 'bank_transfer' ? 'โอนผ่านธนาคาร' : pr.payment_method}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              ⏱ ส่งเข้าระบบ: {new Date(pr.proof_uploaded_at || pr.created_at).toLocaleString('th-TH', {
                                year: 'numeric', month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </p>
                            {pr.bank_name && (
                              <p className="text-xs">
                                โอนเข้า: {pr.bank_name} {pr.bank_account && `(${pr.bank_account})`}
                              </p>
                            )}
                            {pr.reference_number && (
                              <p className="text-xs">
                                อ้างอิง: <span className="font-mono">{pr.reference_number}</span>
                              </p>
                            )}
                            {pr.notes && (
                              <p className="text-xs italic mt-1">{pr.notes}</p>
                            )}
                            {pr.proof_url && (
                              <a
                                href="#"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  const { data } = await (supabase as any).storage
                                    .from('payment-slips')
                                    .createSignedUrl(pr.proof_url, 3600);
                                  if (data?.signedUrl) {
                                    window.open(data.signedUrl, '_blank');
                                  }
                                }}
                              >
                                <ExternalLink className="w-3 h-3" />
                                ดูสลิป
                              </a>
                            )}
                          </div>
                          <div className="text-right shrink-0 flex flex-col items-end gap-1">
                            <div className="font-bold text-base">
                              {formatCurrency(pr.amount)}
                            </div>
                            {pr.verified_at && (
                              <div className="text-[10px]">
                                ยืนยัน: {new Date(pr.verified_at).toLocaleDateString('th-TH')}
                              </div>
                            )}
                            {pr.verification_status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-1 h-7 text-xs border-blue-400 text-blue-700 hover:bg-blue-50"
                                onClick={() => setVerifyingPayment(pr)}
                              >
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                ตรวจสอบ
                              </Button>
                            )}
                            {pr.verification_status === 'rejected' && pr.rejection_reason && (
                              <div className="mt-1 text-[10px] text-red-700 max-w-[200px] text-right">
                                ❌ {pr.rejection_reason}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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

        {/* Notes Editor — using reusable DocumentNotesEditor */}
        <DocumentNotesEditor
          table="invoices"
          id={invoice.id}
          initialNotes={invoice.notes}
          initialInternalNotes={invoice.internal_notes}
          showInternalNotes
          onSaved={loadData}
        />



        <InvoiceShareActivity invoiceId={invoice.id} />
      </div>

      <InvoicePrintPreviewDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        invoice={invoice}
        items={items}
      />

      {/* Confirm Payment Dialog — requires proof attachment */}
      {invoice && (
        <ConfirmPaymentDialog
          open={showConfirmPayment}
          onOpenChange={setShowConfirmPayment}
          invoiceId={invoice.id}
          invoiceNumber={invoice.invoice_number}
          grandTotal={invoice.grand_total || 0}
          onSuccess={() => loadData()}
        />
      )}

      {/* Verify Payment Dialog — for customer-uploaded slips */}
      {invoice && (
      <VerifyPaymentDialog
          open={!!verifyingPayment}
          onOpenChange={(open) => !open && setVerifyingPayment(null)}
          payment={verifyingPayment}
          invoiceNumber={invoice.invoice_number}
          grandTotal={invoice.grand_total || 0}
          otherVerifiedTotal={
            paymentRecords
              .filter((p: any) => 
                p.verification_status === 'verified' && 
                p.id !== verifyingPayment?.id
              )
              .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)
          }
          onSuccess={() => loadData()}
        />
      )}

      {/* Create Tax Invoice Dialog */}
      {invoice && (
        <CreateTaxInvoiceFromInvoiceDialog
          open={showCreateTaxInvoice}
          onOpenChange={setShowCreateTaxInvoice}
          invoiceId={invoice.id}
        />
      )}

      {/* Create Receipt Dialog */}
      {invoice && (
        <CreateReceiptDialog
          open={showCreateReceipt}
          onOpenChange={setShowCreateReceipt}
          invoiceId={invoice.id}
        />
      )}
    </AdminLayout>
  );
}

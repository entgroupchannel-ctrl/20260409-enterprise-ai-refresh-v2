import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowLeft, FileText, Printer, Loader2, Building2, Calendar,
  Link as LinkIcon, Ban, AlertCircle,
} from 'lucide-react';
import CreditNotePrintPreviewDialog from '@/components/admin/CreditNotePrintPreviewDialog';
import VoidCreditNoteDialog from '@/components/admin/VoidCreditNoteDialog';
import DocumentNotesEditor from '@/components/shared/DocumentNotesEditor';

const REASON_LABELS: Record<string, string> = {
  return: 'สินค้าคืน',
  damaged: 'ของเสียหาย',
  price_correction: 'ปรับปรุงราคา',
  quantity_error: 'จำนวนผิดพลาด',
  additional_discount: 'ส่วนลดเพิ่มเติม',
  service_cancelled: 'ยกเลิกบริการ',
  other: 'อื่นๆ',
};

const ADJUSTMENT_LABELS: Record<string, string> = {
  payment: '💰 ลดการชำระเงิน (refund)',
  invoice: '📄 ลดยอดใบวางบิล (discount)',
  both: '🔄 ทั้งสอง',
};

export default function AdminCreditNoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [creditNote, setCreditNote] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [originalTI, setOriginalTI] = useState<any>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showVoidDialog, setShowVoidDialog] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [cnRes, itemsRes] = await Promise.all([
        (supabase as any).from('credit_notes').select('*').eq('id', id).maybeSingle(),
        (supabase as any).from('credit_note_items').select('*').eq('credit_note_id', id).order('display_order'),
      ]);

      if (cnRes.error) throw cnRes.error;
      if (itemsRes.error) throw itemsRes.error;

      setCreditNote(cnRes.data);
      setItems(itemsRes.data || []);

      if (cnRes.data?.original_tax_invoice_id) {
        const { data: tiData } = await (supabase as any)
          .from('tax_invoices')
          .select('id, tax_invoice_number, status')
          .eq('id', cnRes.data.original_tax_invoice_id)
          .maybeSingle();
        setOriginalTI(tiData);
      }
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
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

  if (!creditNote) {
    return (
      <AdminLayout>
        <div className="py-16 text-center text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>ไม่พบใบลดหนี้นี้</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/credit-notes')}>
            กลับ
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const isVoided = creditNote.status === 'voided';
  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/credit-notes')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับ
          </Button>
          <div className="flex items-center gap-2">
            {!isVoided && isSuperAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-400 text-red-700 hover:bg-red-50"
                onClick={() => setShowVoidDialog(true)}
              >
                <Ban className="w-4 h-4 mr-1.5" />
                ยกเลิก CN
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowPrintDialog(true)}>
              <Printer className="w-4 h-4 mr-1.5" />
              พิมพ์ / PDF
            </Button>
          </div>
        </div>

        {/* Voided banner */}
        {isVoided && (
          <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-red-700">ใบลดหนี้นี้ถูกยกเลิกแล้ว</p>
              {creditNote.void_reason && (
                <p className="text-muted-foreground mt-1">เหตุผล: {creditNote.void_reason}</p>
              )}
              {creditNote.voided_at && (
                <p className="text-xs text-muted-foreground mt-1">
                  ยกเลิกเมื่อ: {formatDate(creditNote.voided_at)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-6 h-6 text-red-600" />
                  <h1 className="text-2xl font-bold font-mono">{creditNote.credit_note_number}</h1>
                </div>
                <Badge
                  variant="outline"
                  className={isVoided
                    ? 'bg-gray-50 text-gray-500 border-gray-300 line-through'
                    : 'bg-green-50 text-green-700 border-green-300'
                  }
                >
                  {isVoided ? 'ยกเลิก' : 'ใช้งาน'}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">ยอดลดหนี้</div>
                <div className="text-2xl font-bold text-red-600">-{formatCurrency(creditNote.grand_total)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reason */}
        <Card className="border-red-200 bg-red-50/30 dark:bg-red-900/10">
          <CardContent className="pt-4 space-y-1">
            <p className="text-sm font-semibold">
              เหตุผล: {REASON_LABELS[creditNote.reason_code] || creditNote.reason_code}
            </p>
            <p className="text-sm text-muted-foreground">{creditNote.reason_detail}</p>
            <p className="text-xs text-muted-foreground mt-2">
              ผลกระทบ: {ADJUSTMENT_LABELS[creditNote.adjustment_target] || creditNote.adjustment_target}
            </p>
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
              <p className="font-semibold">{creditNote.customer_name}</p>
              {creditNote.customer_company && (
                <p className="text-muted-foreground">{creditNote.customer_company}</p>
              )}
              {creditNote.customer_tax_id && (
                <p className="text-xs font-mono">เลขผู้เสียภาษี: {creditNote.customer_tax_id}</p>
              )}
              {creditNote.customer_address && (
                <p className="text-xs text-muted-foreground mt-2">{creditNote.customer_address}</p>
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
                <span>{formatDate(creditNote.credit_note_date)}</span>
              </div>
              {originalTI && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">อ้างอิงใบกำกับภาษี</p>
                  <Link
                    to={`/admin/tax-invoices/${originalTI.id}`}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span className="font-mono">{originalTI.tax_invoice_number}</span>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              รายการที่ลดหนี้ ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">ไม่มีรายการ</p>
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
                    <p className="font-semibold text-red-600">-{formatCurrency(it.line_total)}</p>
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
                <span>{formatCurrency(creditNote.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ภาษีมูลค่าเพิ่ม 7%:</span>
                <span>{formatCurrency(creditNote.vat_amount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-base">
                <span>ยอดลดหนี้รวม:</span>
                <span className="text-red-600">-{formatCurrency(creditNote.grand_total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <DocumentNotesEditor
          table="credit_notes"
          id={creditNote.id}
          initialNotes={creditNote.notes}
          showInternalNotes={false}
        />
      </div>

      <CreditNotePrintPreviewDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        creditNote={creditNote}
        items={items}
        originalTaxInvoiceNumber={originalTI?.tax_invoice_number}
      />

      <VoidCreditNoteDialog
        open={showVoidDialog}
        onOpenChange={setShowVoidDialog}
        creditNoteId={creditNote.id}
        creditNoteNumber={creditNote.credit_note_number}
        onSuccess={loadData}
      />
    </AdminLayout>
  );
}

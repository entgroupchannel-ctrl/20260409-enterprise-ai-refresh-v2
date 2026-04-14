import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, Loader2, Printer, Receipt, User, Calendar,
  CreditCard, Building2, FileText, AlertCircle, CircleCheckBig,
  Banknote, Clock, Upload, RefreshCw, Hourglass, CheckCircle2,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import InvoicePrintPreviewDialog from '@/components/admin/InvoicePrintPreviewDialog';
import UploadPaymentSlipDialog from '@/components/customer/UploadPaymentSlipDialog';

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  draft: { label: 'ร่าง', cls: 'bg-gray-100 text-gray-700 border-gray-300' },
  sent: { label: 'รอชำระ', cls: 'bg-blue-100 text-blue-700 border-blue-300' },
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

export default function MyInvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showUploadSlip, setShowUploadSlip] = useState(false);
  const [paymentRecords, setPaymentRecords] = useState<any[]>([]);

  // Compute payment UI state based on payment records
  const getPaymentUIState = (): 'none' | 'pending' | 'rejected' | 'verified-partial' | 'verified-full' => {
    if (paymentRecords.length === 0) return 'none';

    const sorted = [...paymentRecords].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const hasPending = paymentRecords.some((r) => r.verification_status === 'pending');
    const hasVerified = paymentRecords.some((r) => r.verification_status === 'verified');
    const latest = sorted[0];

    if (latest.verification_status === 'rejected' && !hasPending) return 'rejected';
    if (hasPending) return 'pending';
    if (hasVerified) {
      return invoice?.status === 'paid' ? 'verified-full' : 'verified-partial';
    }
    return 'none';
  };

  const paymentUIState = getPaymentUIState();
  const pendingCount = paymentRecords.filter((r) => r.verification_status === 'pending').length;
  const verifiedTotal = paymentRecords
    .filter((r) => r.verification_status === 'verified')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const latestRejected = paymentRecords
    .filter((r) => r.verification_status === 'rejected')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  const loadData = async () => {
    if (!id || !user) return;
    setLoading(true);
    try {
      const [invRes, itemsRes, bankRes, paymentRes] = await Promise.all([
        (supabase as any).from('invoices').select('*').eq('id', id).eq('customer_id', user?.id).is('deleted_at', null).maybeSingle(),
        (supabase as any).from('invoice_items').select('*').eq('invoice_id', id).order('display_order'),
        (supabase as any).from('company_bank_accounts').select('*').eq('is_active', true).order('display_order'),
        (supabase as any).from('payment_records').select('*').eq('invoice_id', id).order('created_at', { ascending: false }),
      ]);

      if (invRes.error) throw invRes.error;
      if (!invRes.data) {
        toast({ title: 'ไม่พบใบวางบิล หรือไม่มีสิทธิ์ดู', variant: 'destructive' });
        navigate('/my-invoices');
        return;
      }

      setInvoice(invRes.data);
      setItems(itemsRes.data || []);
      setBankAccounts(bankRes.data || []);
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
  }, [id, user]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(n);

  const formatDate = (s: string | null) =>
    s ? new Date(s).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';

  const isOverdue = invoice?.due_date &&
    invoice.status !== 'paid' &&
    invoice.status !== 'cancelled' &&
    new Date(invoice.due_date) < new Date();

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) return null;

  const effectiveStatus = isOverdue ? 'overdue' : invoice.status;
  const statusInfo = STATUS_LABELS[effectiveStatus] || STATUS_LABELS.draft;

  return (
    <>
      <SEOHead
        title={`${invoice.invoice_number} | ใบวางบิลของฉัน`}
        description="รายละเอียดใบวางบิล"
      />
      <div className="container mx-auto p-4 md:p-6 max-w-5xl space-y-4">
        {/* Header actions */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-invoices')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับ
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setShowPrintDialog(true)}>
              <Printer className="w-4 h-4 mr-1.5" />
              พิมพ์ / PDF
            </Button>
            {/* Upload slip button — state-aware */}
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <>
                {paymentUIState === 'none' && (
                  <Button size="sm" onClick={() => setShowUploadSlip(true)}>
                    <Upload className="w-4 h-4 mr-1.5" />
                    อัปโหลดสลิปการโอน
                  </Button>
                )}
                {paymentUIState === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-400 text-amber-700 hover:bg-amber-50"
                    onClick={() => setShowUploadSlip(true)}
                  >
                    <Hourglass className="w-4 h-4 mr-1.5" />
                    ส่งสลิปเพิ่มเติม
                  </Button>
                )}
                {paymentUIState === 'rejected' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-400 text-red-700 hover:bg-red-50"
                    onClick={() => setShowUploadSlip(true)}
                  >
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                    ส่งสลิปใหม่
                  </Button>
                )}
                {paymentUIState === 'verified-partial' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-400 text-blue-700 hover:bg-blue-50"
                    onClick={() => setShowUploadSlip(true)}
                  >
                    <Upload className="w-4 h-4 mr-1.5" />
                    ส่งสลิปเพิ่มเติม
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Overdue Alert */}
        {isOverdue && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900">เกินกำหนดชำระแล้ว</h3>
                  <p className="text-sm text-red-700 mt-0.5">
                    ใบวางบิลนี้ครบกำหนดชำระเมื่อ {formatDate(invoice.due_date)} กรุณาติดต่อชำระเงินโดยเร็ว
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Status Alert — prominent feedback */}
        {paymentUIState === 'pending' && (
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Hourglass className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">
                    ส่งสลิปการชำระเงินแล้ว — รอตรวจสอบ
                  </h3>
                  <p className="text-sm text-amber-800 mt-0.5">
                    แอดมินกำลังตรวจสอบสลิปของคุณ ({pendingCount} รายการ)
                    {verifiedTotal > 0 && (
                      <> — ยืนยันแล้ว {formatCurrency(verifiedTotal)}</>
                    )}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    💡 หากมีข้อมูลเพิ่มเติมสามารถ "ส่งสลิปเพิ่มเติม" ได้
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentUIState === 'rejected' && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">
                    สลิปการชำระเงินถูกปฏิเสธ
                  </h3>
                  {latestRejected?.rejection_reason && (
                    <p className="text-sm text-red-800 mt-0.5">
                      <strong>เหตุผล:</strong> {latestRejected.rejection_reason}
                    </p>
                  )}
                  <p className="text-xs text-red-700 mt-1">
                    💡 กรุณาตรวจสอบและส่งสลิปใหม่อีกครั้ง
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentUIState === 'verified-partial' && (
          <Card className="border-blue-300 bg-blue-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">
                    ชำระบางส่วนแล้ว
                  </h3>
                  <p className="text-sm text-blue-800 mt-0.5">
                    ยืนยันแล้ว {formatCurrency(verifiedTotal)} / {formatCurrency(invoice.grand_total)}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    💡 คงเหลือ {formatCurrency((invoice.grand_total || 0) - verifiedTotal)} สามารถส่งสลิปเพิ่มเติมได้
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentUIState === 'verified-full' && invoice.status === 'paid' && (
          <Card className="border-green-300 bg-green-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900">
                    ชำระเงินครบถ้วนแล้ว
                  </h3>
                  <p className="text-sm text-green-800 mt-0.5">
                    ยอดรวม {formatCurrency(invoice.grand_total)} — ขอบคุณสำหรับการชำระเงิน
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl font-bold font-mono">{invoice.invoice_number}</h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={statusInfo.cls}>
                    {statusInfo.label}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    {TYPE_LABELS[invoice.invoice_type] || invoice.invoice_type}
                    {invoice.invoice_type === 'downpayment' && invoice.downpayment_percent != null &&
                      ` ${invoice.downpayment_percent}%`}
                    {invoice.invoice_type === 'installment' && invoice.installment_number != null &&
                      ` ${invoice.installment_number}/${invoice.installment_total}`}
                  </Badge>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-muted-foreground">จำนวนเงินที่ต้องชำระ</div>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(invoice.grand_total)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer + Dates Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4" /> ออกในนาม
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="font-semibold">{invoice.customer_name}</div>
              {invoice.customer_company && (
                <div className="text-muted-foreground">{invoice.customer_company}</div>
              )}
              {invoice.customer_address && (
                <div className="text-xs whitespace-pre-line text-muted-foreground">
                  {invoice.customer_address}
                </div>
              )}
              {invoice.customer_tax_id && (
                <div className="text-xs">
                  เลขประจำตัวผู้เสียภาษี: <span className="font-mono">{invoice.customer_tax_id}</span>
                </div>
              )}
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
                  <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                    {formatDate(invoice.due_date)}
                  </span>
                </div>
              )}
              {invoice.payment_terms && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">เงื่อนไขชำระ:</span>
                  <span className="text-right text-xs">{invoice.payment_terms}</span>
                </div>
              )}
              {invoice.quote_id && (
                <div className="pt-2 border-t mt-2">
                  <Link
                    to={`/my-quotes/${invoice.quote_id}`}
                    className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> ดูใบเสนอราคาที่เกี่ยวข้อง →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Items - card based */}
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
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-4 border border-border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{item.product_name || 'N/A'}</h4>
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
                    </div>
                  </div>
                ))}
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

        {/* Notes */}
        {invoice.notes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">หมายเหตุ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">{invoice.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Payment Records */}
        {paymentRecords.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Banknote className="w-4 h-4" />
                ประวัติการชำระเงิน ({paymentRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {paymentRecords.map((pr: any) => {
                  const statusMap: Record<string, { label: string; cls: string; Icon: any }> = {
                    pending: { label: 'รอตรวจสอบ', cls: 'bg-amber-50 text-amber-700 border-amber-300', Icon: Clock },
                    verified: { label: 'ยืนยันแล้ว', cls: 'bg-green-50 text-green-700 border-green-300', Icon: CircleCheckBig },
                    rejected: { label: 'ปฏิเสธ', cls: 'bg-red-50 text-red-700 border-red-300', Icon: AlertCircle },
                  };
                  const info = statusMap[pr.verification_status] || statusMap.pending;
                  const IconCmp = info.Icon;

                  return (
                    <div
                      key={pr.id}
                      className={`p-3 border rounded-lg ${info.cls}`}
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <IconCmp className="w-4 h-4" />
                            <span className="font-semibold text-sm">{info.label}</span>
                            <span className="text-xs">
                              {new Date(pr.payment_date).toLocaleDateString('th-TH', {
                                year: 'numeric', month: 'short', day: 'numeric',
                              })}
                            </span>
                          </div>
                          {pr.bank_name && (
                            <p className="text-xs">
                              โอนเข้า: {pr.bank_name} {pr.bank_account && `(${pr.bank_account})`}
                            </p>
                          )}
                          {pr.reference_number && (
                            <p className="text-xs">อ้างอิง: <span className="font-mono">{pr.reference_number}</span></p>
                          )}
                          {pr.notes && (
                            <p className="text-xs mt-1 italic">{pr.notes}</p>
                          )}
                          {pr.rejection_reason && (
                            <p className="text-xs mt-1 font-semibold">
                              เหตุผลปฏิเสธ: {pr.rejection_reason}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-sm">
                            {formatCurrency(pr.amount)}
                          </div>
                          {pr.verified_at && (
                            <div className="text-[10px]">
                              ยืนยัน: {new Date(pr.verified_at).toLocaleDateString('th-TH')}
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
        )}

        {/* Bank Accounts */}
        {bankAccounts.length > 0 && invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-900">
                <CreditCard className="w-4 h-4" /> วิธีการชำระเงิน — โอนเข้าบัญชี
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bankAccounts.map((bank: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 text-sm p-3 rounded border ${
                    bank.is_default ? 'border-blue-400 bg-white' : 'border-gray-200 bg-white'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      {bank.bank_name}
                      {bank.branch && (
                        <span className="text-xs text-muted-foreground font-normal">({bank.branch})</span>
                      )}
                      {bank.is_default && (
                        <Badge variant="outline" className="text-[10px] bg-blue-100 text-blue-700">⭐ บัญชีหลัก</Badge>
                      )}
                    </div>
                    <div className="text-xs mt-1">
                      เลขบัญชี: <span className="font-mono font-semibold">{bank.account_number}</span>
                    </div>
                    <div className="text-xs">ชื่อบัญชี: {bank.account_name}</div>
                  </div>
                </div>
              ))}
              <div className="text-xs text-blue-700 mt-2 p-2 bg-blue-100 rounded">
                {paymentUIState === 'none' && (
                  <>💡 หลังโอนเงินแล้ว กรุณากดปุ่ม "อัปโหลดสลิปการโอน" ด้านบนเพื่อแจ้งชำระเงิน</>
                )}
                {paymentUIState === 'pending' && (
                  <>⏱ สลิปของคุณอยู่ระหว่างการตรวจสอบ</>
                )}
                {paymentUIState === 'rejected' && (
                  <>⚠️ สลิปล่าสุดถูกปฏิเสธ กรุณาส่งใหม่</>
                )}
                {(paymentUIState === 'verified-partial' || paymentUIState === 'verified-full') && (
                  <>✅ ระบบได้รับการชำระเงินของคุณแล้ว</>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <InvoicePrintPreviewDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        invoice={invoice}
        items={items}
      />

      {invoice && (
        <UploadPaymentSlipDialog
          open={showUploadSlip}
          onOpenChange={setShowUploadSlip}
          invoiceId={invoice.id}
          invoiceNumber={invoice.invoice_number}
          grandTotal={invoice.grand_total || 0}
          existingPendingCount={pendingCount}
          onSuccess={() => loadData()}
        />
      )}
    </>
  );
}

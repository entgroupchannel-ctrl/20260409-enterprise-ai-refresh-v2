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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, Loader2, Printer, Send, CircleCheckBig, Ban, FileText,
  User, Calendar, CreditCard, Building2, Receipt,
} from 'lucide-react';
import InvoicePDFTemplate from '@/components/admin/InvoicePDFTemplate';

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
  const [company, setCompany] = useState<any>(null);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [invRes, itemsRes, companyRes, bankRes] = await Promise.all([
        (supabase as any).from('invoices').select('*').eq('id', id).maybeSingle(),
        (supabase as any).from('invoice_items').select('*').eq('invoice_id', id).order('display_order'),
        (supabase as any).from('company_settings').select('*').limit(1).maybeSingle(),
        (supabase as any).from('company_bank_accounts').select('*').eq('is_active', true).order('display_order'),
      ]);

      if (invRes.error) throw invRes.error;
      if (!invRes.data) {
        toast({ title: 'ไม่พบใบวางบิล', variant: 'destructive' });
        navigate('/admin/invoices');
        return;
      }

      setInvoice(invRes.data);
      setItems(itemsRes.data || []);
      setCompany(companyRes.data);
      setBankAccounts(bankRes.data || []);
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
    setShowPrint(true);
    setTimeout(() => window.print(), 200);
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
      {/* Print-only view */}
      {showPrint && (
        <div className="print:block hidden fixed inset-0 z-50 bg-white overflow-auto">
          <InvoicePDFTemplate
            invoice={invoice}
            items={items}
            company={company ? {
              name: company.name_th,
              name_en: company.name_en,
              address: company.address_th,
              phone: company.phone,
              email: company.email,
              tax_id: company.tax_id,
              branch_type: company.branch_type,
              branch_code: company.branch_code,
              logo_url: company.logo_url,
            } : null}
            bankAccounts={bankAccounts}
          />
        </div>
      )}

      {/* Normal view (hidden when printing) */}
      <div className="print:hidden max-w-5xl mx-auto p-4 md:p-6 space-y-4">
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
              <Button size="sm" onClick={handleMarkPaid} disabled={updating} className="bg-green-600 hover:bg-green-700">
                <CircleCheckBig className="w-4 h-4 mr-1.5" />
                บันทึกชำระแล้ว
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

        {/* Items table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" /> รายการสินค้า ({items.length} รายการ)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b">
                  <tr>
                    <th className="text-left py-2 w-10">#</th>
                    <th className="text-left py-2">รายการ</th>
                    <th className="text-center py-2 w-20">จำนวน</th>
                    <th className="text-right py-2 w-28">ราคา/หน่วย</th>
                    <th className="text-right py-2 w-28">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, idx: number) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-2.5 text-muted-foreground">{idx + 1}</td>
                      <td className="py-2.5">
                        <div className="font-medium">{item.product_name}</div>
                        {item.sku && <div className="text-[10px] text-muted-foreground">SKU: {item.sku}</div>}
                        {item.product_description && (
                          <div className="text-xs text-muted-foreground">{item.product_description}</div>
                        )}
                      </td>
                      <td className="py-2.5 text-center">{item.quantity} {item.unit}</td>
                      <td className="py-2.5 text-right font-mono">{formatCurrency(item.unit_price)}</td>
                      <td className="py-2.5 text-right font-mono font-semibold">{formatCurrency(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

        {/* Bank accounts */}
        {bankAccounts.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> ช่องทางการชำระเงิน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bankAccounts.map((bank: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <Building2 className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold">{bank.bank_name} {bank.branch && <span className="text-muted-foreground font-normal">({bank.branch})</span>}</div>
                    <div className="text-xs">เลขบัญชี: <span className="font-mono">{bank.account_number}</span></div>
                    <div className="text-xs">ชื่อบัญชี: {bank.account_name}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

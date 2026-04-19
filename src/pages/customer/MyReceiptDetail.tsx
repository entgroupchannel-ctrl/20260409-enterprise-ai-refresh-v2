import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight, Receipt, Printer, Loader2, Building2, Calendar,
  Link as LinkIcon, CreditCard, FileText,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import ReceiptPrintPreviewDialog from '@/components/admin/ReceiptPrintPreviewDialog';

export default function MyReceiptDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<any>(null);
  const [sourceInvoice, setSourceInvoice] = useState<any>(null);
  const [sourceTaxInvoice, setSourceTaxInvoice] = useState<any>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [totals, setTotals] = useState({ subtotal: 0, vat_amount: 0, grand_total: 0 });

  useEffect(() => {
    if (id && user) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Fetch by id only — rely on RLS to enforce access (owner customer or staff).
      // This allows admins/staff to open the same link from notification emails,
      // and avoids false "not found" when customer_id on the receipt doesn't exactly
      // match the logged-in user (e.g. receipt issued to a related company contact).
      const { data: rcp, error } = await (supabase as any)
        .from('receipts')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;

      if (!rcp) {
        // Don't redirect — show inline message so users coming from email links
        // understand what happened (deleted/voided or no access).
        setReceipt(null);
        return;
      }

      setReceipt(rcp);

      // Load items from source
      const sourceId = rcp?.tax_invoice_id || rcp?.invoice_id;
      const itemsTable = rcp?.tax_invoice_id ? 'tax_invoice_items' : 'invoice_items';
      const fkColumn = rcp?.tax_invoice_id ? 'tax_invoice_id' : 'invoice_id';
      const sourceTable = rcp?.tax_invoice_id ? 'tax_invoices' : 'invoices';

      if (sourceId) {
        const [srcRes, itemsRes] = await Promise.all([
          (supabase as any).from(sourceTable).select('subtotal, vat_amount, grand_total').eq('id', sourceId).maybeSingle(),
          (supabase as any).from(itemsTable).select('*').eq(fkColumn, sourceId).order('display_order'),
        ]);
        if (srcRes.data && itemsRes.data) {
          const sourceTotal = Number(srcRes.data.grand_total || 0);
          const ratio = sourceTotal > 0 ? rcp.amount / sourceTotal : 1;
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
            grand_total: rcp.amount,
          });
        }
      }

      // Load references
      if (rcp.invoice_id) {
        const { data: inv } = await (supabase as any)
          .from('invoices')
          .select('id, invoice_number')
          .eq('id', rcp.invoice_id)
          .maybeSingle();
        setSourceInvoice(inv);
      }
      if (rcp.tax_invoice_id) {
        const { data: tx } = await (supabase as any)
          .from('tax_invoices')
          .select('id, tax_invoice_number')
          .eq('id', rcp.tax_invoice_id)
          .maybeSingle();
        setSourceTaxInvoice(tx);
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
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <CustomerLayout title="ไม่พบใบเสร็จ">
        <SEOHead title="ไม่พบใบเสร็จ" description="ใบเสร็จนี้ไม่พบในระบบ" />
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Receipt className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold">ไม่พบใบเสร็จนี้</h1>
            <p className="text-sm text-muted-foreground">
              ใบเสร็จอาจถูกยกเลิก/ลบ หรือมีการออกเลขใหม่ทดแทน
              กรุณาตรวจสอบรายการใบเสร็จล่าสุดของคุณ
            </p>
          </div>
          <Button onClick={() => navigate('/my-receipts')}>
            ดูใบเสร็จทั้งหมด
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title={receipt.receipt_number}>
      <SEOHead title={`ใบเสร็จ ${receipt.receipt_number}`} description="รายละเอียดใบเสร็จรับเงิน" />
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/my-receipts" className="hover:text-foreground transition-colors">ใบเสร็จรับเงิน</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{receipt.receipt_number}</span>
        </div>

        <div className="flex items-center justify-end">
          <Button variant="outline" size="sm" onClick={() => setShowPrintDialog(true)}>
            <Printer className="w-4 h-4 mr-1.5" />
            พิมพ์ / PDF
          </Button>
        </div>

          {/* Main card */}
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

          {/* Customer + Reference grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  ออกในนาม
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
                      to={`/my-tax-invoices/${sourceTaxInvoice.id}`}
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
                      to={`/my-invoices/${sourceInvoice.id}`}
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

          {/* Notes */}
          {receipt.notes && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-1">หมายเหตุ</p>
                <p className="text-sm whitespace-pre-wrap">{receipt.notes}</p>
              </CardContent>
            </Card>
          )}
      </div>

      <ReceiptPrintPreviewDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        receipt={receipt}
        invoiceNumber={sourceInvoice?.invoice_number}
        taxInvoiceNumber={sourceTaxInvoice?.tax_invoice_number}
        customerMode
      />
    </CustomerLayout>
  );
}

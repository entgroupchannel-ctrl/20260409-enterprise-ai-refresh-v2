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
  ChevronRight, FileText, Printer, Loader2, Building2, Calendar, Receipt, Link as LinkIcon,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import TaxInvoicePrintPreviewDialog from '@/components/admin/TaxInvoicePrintPreviewDialog';

export default function MyTaxInvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [taxInvoice, setTaxInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [sourceInvoice, setSourceInvoice] = useState<any>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  useEffect(() => {
    if (id && user) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [txRes, itemsRes] = await Promise.all([
        (supabase as any)
          .from('tax_invoices')
          .select('*')
          .eq('id', id)
          .eq('customer_id', user?.id)
          .is('deleted_at', null)
          .maybeSingle(),
        (supabase as any)
          .from('tax_invoice_items')
          .select('*')
          .eq('tax_invoice_id', id)
          .order('display_order'),
      ]);

      if (txRes.error) throw txRes.error;
      if (itemsRes.error) throw itemsRes.error;

      if (!txRes.data) {
        toast({
          title: 'ไม่พบใบกำกับภาษี',
          description: 'อาจถูกลบหรือคุณไม่มีสิทธิ์เข้าถึง',
          variant: 'destructive',
        });
        navigate('/my-tax-invoices');
        return;
      }

      setTaxInvoice(txRes.data);
      setItems(itemsRes.data || []);

      if (txRes.data.invoice_id) {
        const { data: invData } = await (supabase as any)
          .from('invoices')
          .select('id, invoice_number')
          .eq('id', txRes.data.invoice_id)
          .maybeSingle();
        setSourceInvoice(invData);
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

  const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    pending: { label: 'รอดำเนินการ', cls: 'bg-blue-50 text-blue-700 border-blue-300' },
    paid: { label: 'ชำระแล้ว', cls: 'bg-green-50 text-green-700 border-green-300' },
    partially_paid: { label: 'ชำระบางส่วน', cls: 'bg-amber-50 text-amber-700 border-amber-300' },
    cancelled: { label: 'ยกเลิก', cls: 'bg-gray-50 text-gray-500 border-gray-300 line-through' },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!taxInvoice) return null;

  const statusInfo = STATUS_LABELS[taxInvoice.status] || { label: taxInvoice.status, cls: '' };

  return (
    <CustomerLayout title={taxInvoice.tax_invoice_number}>
      <SEOHead title={`ใบกำกับภาษี ${taxInvoice.tax_invoice_number}`} description="รายละเอียดใบกำกับภาษี" />
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/my-tax-invoices" className="hover:text-foreground transition-colors">ใบกำกับภาษี</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{taxInvoice.tax_invoice_number}</span>
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
                    <FileText className="w-6 h-6 text-primary" />
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
                  ออกในนาม
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
                      to={`/my-invoices/${sourceInvoice.id}`}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span className="font-mono">{sourceInvoice.invoice_number}</span>
                    </Link>
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
                {taxInvoice.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ส่วนลด:</span>
                    <span>-{formatCurrency(taxInvoice.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ภาษีมูลค่าเพิ่ม 7%:</span>
                  <span>{formatCurrency(taxInvoice.vat_amount)}</span>
                </div>
                {taxInvoice.withholding_tax_amount > 0 && (
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

          {/* Notes */}
          {taxInvoice.notes && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-1">หมายเหตุ</p>
                <p className="text-sm whitespace-pre-wrap">{taxInvoice.notes}</p>
              </CardContent>
            </Card>
          )}
      </div>

      <TaxInvoicePrintPreviewDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        taxInvoice={taxInvoice}
        items={items}
        invoiceNumber={sourceInvoice?.invoice_number}
        customerMode
      />
    </CustomerLayout>
  );
}

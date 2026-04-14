import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Receipt, Printer, Loader2, Building2, Calendar,
  Link as LinkIcon, CreditCard,
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

  useEffect(() => {
    if (id && user) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: rcp, error } = await (supabase as any)
        .from('receipts')
        .select('*')
        .eq('id', id)
        .eq('customer_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (!rcp) {
        toast({
          title: 'ไม่พบใบเสร็จ',
          description: 'อาจถูกลบหรือคุณไม่มีสิทธิ์เข้าถึง',
          variant: 'destructive',
        });
        navigate('/my-receipts');
        return;
      }

      setReceipt(rcp);

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

  if (!receipt) return null;

  return (
    <>
      <SEOHead title={`ใบเสร็จ ${receipt.receipt_number}`} />
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => navigate('/my-receipts')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              กลับ
            </Button>
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
      </div>

      {/* Reuse admin print dialog */}
      <ReceiptPrintPreviewDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        receipt={receipt}
        invoiceNumber={sourceInvoice?.invoice_number}
        taxInvoiceNumber={sourceTaxInvoice?.tax_invoice_number}
      />
    </>
  );
}

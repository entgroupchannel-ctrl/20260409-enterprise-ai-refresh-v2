import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Receipt, Loader2, BadgeCheck, Landmark, BarChart3 } from 'lucide-react';

interface SaleOrder {
  id: string;
  so_number: string;
  quote_id: string;
  subtotal: number | null;
  vat_amount: number | null;
  grand_total: number | null;
  products: any;
}

export interface QuoteSource {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_company: string | null;
  customer_address: string | null;
  customer_email: string;
  customer_phone: string | null;
  customer_tax_id: string | null;
  customer_branch_type: string | null;
  customer_branch_code: string | null;
  customer_branch_name: string | null;
  payment_terms: string | null;
  notes: string | null;
  subtotal: number;
  vat_amount: number | null;
  grand_total: number;
  products: any;
}

export type InvoiceSource =
  | { type: 'sale_order'; saleOrder: SaleOrder }
  | { type: 'quote'; quote: QuoteSource };

interface QuoteData {
  user_id: string | null;
  customer_name: string;
  customer_company: string | null;
  customer_address: string | null;
  customer_email: string;
  customer_phone: string | null;
  customer_tax_id: string | null;
  customer_branch_type: string | null;
  customer_branch_code: string | null;
  customer_branch_name: string | null;
  payment_terms: string | null;
  notes: string | null;
}

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: InvoiceSource | null;
  /** @deprecated Use source instead */
  saleOrder?: SaleOrder | null;
}

type InvoiceType = 'full' | 'downpayment' | 'installment';

export default function CreateInvoiceFromSODialog({
  open,
  onOpenChange,
  source: sourceProp,
  saleOrder: saleOrderLegacy,
}: CreateInvoiceDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  // Backward compat: if legacy saleOrder prop is passed, wrap it
  const source: InvoiceSource | null = useMemo(
    () => sourceProp ?? (saleOrderLegacy ? { type: 'sale_order', saleOrder: saleOrderLegacy } : null),
    [sourceProp, saleOrderLegacy]
  );

  // Form state
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('full');
  const [downpaymentPercent, setDownpaymentPercent] = useState(30);
  const [installmentTotal, setInstallmentTotal] = useState(2);
  const [paymentTerms, setPaymentTerms] = useState('30 วัน');
  const [dueDateOffset, setDueDateOffset] = useState(30);
  const [notes, setNotes] = useState('');

  // Derived values from source
  const sourceLabel = source?.type === 'sale_order'
    ? source.saleOrder.so_number
    : source?.type === 'quote'
    ? source.quote.quote_number
    : '';

  const baseProducts = source?.type === 'sale_order'
    ? source.saleOrder.products
    : source?.type === 'quote'
    ? source.quote.products
    : [];

  // Compute subtotal from products as a robust fallback (in case header totals were not propagated)
  const computedSubtotalFromProducts = (() => {
    const arr = Array.isArray(baseProducts) ? baseProducts : [];
    return arr.reduce((sum: number, p: any) => {
      const qty = Number(p.qty ?? p.quantity) || 0;
      const unit = Number(p.unit_price ?? p.unitPrice) || 0;
      const itemDiscPct = Number(p.discount_percent ?? p.discountPercent) || 0;
      const itemDiscAmt = Number(p.discount_amount) || 0;
      const gross = qty * unit;
      const disc = itemDiscAmt > 0 ? itemDiscAmt : gross * (itemDiscPct / 100);
      const computed = gross - disc;
      const lineTotal = computed > 0 ? computed : (Number(p.line_total) || 0);
      return sum + lineTotal;
    }, 0);
  })();

  const sourceSubtotal = source?.type === 'sale_order'
    ? Number(source.saleOrder.subtotal) || 0
    : source?.type === 'quote'
    ? Number(source.quote.subtotal) || 0
    : 0;

  const sourceVat = source?.type === 'sale_order'
    ? Number(source.saleOrder.vat_amount) || 0
    : source?.type === 'quote'
    ? Number(source.quote.vat_amount) || 0
    : 0;

  const sourceTotal = source?.type === 'sale_order'
    ? Number(source.saleOrder.grand_total) || 0
    : source?.type === 'quote'
    ? Number(source.quote.grand_total) || 0
    : 0;

  // If header totals are zero but we have line items, recompute (subtotal + 7% VAT)
  const baseSubtotal = sourceSubtotal > 0 ? sourceSubtotal : computedSubtotalFromProducts;
  const baseVat = sourceVat > 0
    ? sourceVat
    : Math.round(baseSubtotal * 0.07 * 100) / 100;
  const baseTotal = sourceTotal > 0
    ? sourceTotal
    : Math.round((baseSubtotal + baseVat) * 100) / 100;

  const loadQuoteFromDirect = async (q: QuoteSource) => {
    let userId: string | null = null;
    try {
      const { data: qData } = await (supabase as any)
        .from('quote_requests')
        .select('created_by')
        .eq('id', q.id)
        .maybeSingle();
      userId = qData?.created_by || null;
    } catch (e) {
      console.warn('Failed to load user_id:', e);
    }
    setQuote({
      user_id: userId,
      customer_name: q.customer_name,
      customer_company: q.customer_company,
      customer_address: q.customer_address,
      customer_email: q.customer_email,
      customer_phone: q.customer_phone,
      customer_tax_id: q.customer_tax_id,
      customer_branch_type: q.customer_branch_type,
      customer_branch_code: q.customer_branch_code,
      customer_branch_name: q.customer_branch_name,
      payment_terms: q.payment_terms,
      notes: q.notes,
    });
    if (q.payment_terms) setPaymentTerms(q.payment_terms);
  };

  useEffect(() => {
    if (!open) {
      setInvoiceType('full');
      setDownpaymentPercent(30);
      setInstallmentTotal(2);
      setNotes('');
      setQuote(null);
      return;
    }

    if (source?.type === 'sale_order') {
      loadQuoteFromSO();
    } else if (source?.type === 'quote') {
      loadQuoteFromDirect(source.quote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, source]);

  const loadQuoteFromSO = async () => {
    if (source?.type !== 'sale_order') return;
    setLoadingQuote(true);
    try {
      const { data, error } = await (supabase as any)
        .from('quote_requests')
        .select(
          'created_by, customer_name, customer_company, customer_address, customer_email, customer_phone, customer_tax_id, payment_terms, notes'
        )
        .eq('id', source.saleOrder.quote_id)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setQuote({
          user_id: data.created_by || null,
          customer_name: data.customer_name,
          customer_company: data.customer_company,
          customer_address: data.customer_address,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          customer_tax_id: data.customer_tax_id,
          customer_branch_type: null,
          customer_branch_code: null,
          customer_branch_name: null,
          payment_terms: data.payment_terms,
          notes: data.notes,
        });
      }
      if (data?.payment_terms) setPaymentTerms(data.payment_terms);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoadingQuote(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(n);

  const calcInvoiceAmount = (): { subtotal: number; vat: number; total: number; ratio: number } => {
    if (invoiceType === 'full') {
      return { subtotal: baseSubtotal, vat: baseVat, total: baseTotal, ratio: 1 };
    }
    if (invoiceType === 'downpayment') {
      const ratio = downpaymentPercent / 100;
      return {
        subtotal: baseSubtotal * ratio,
        vat: baseVat * ratio,
        total: baseTotal * ratio,
        ratio,
      };
    }
    const ratio = 1 / installmentTotal;
    return {
      subtotal: baseSubtotal * ratio,
      vat: baseVat * ratio,
      total: baseTotal * ratio,
      ratio,
    };
  };

  const amounts = calcInvoiceAmount();

  const calcDueDate = (): string => {
    const d = new Date();
    d.setDate(d.getDate() + dueDateOffset);
    return d.toISOString().split('T')[0];
  };

  const handleCreate = async () => {
    if (!source || !quote) return;
    setLoading(true);
    try {
      const saleOrderId = source.type === 'sale_order' ? source.saleOrder.id : null;
      const quoteId = source.type === 'sale_order'
        ? source.saleOrder.quote_id
        : source.quote.id;

      const invoicePayload: any = {
        sale_order_id: saleOrderId,
        quote_id: quoteId,
        customer_id: quote.user_id || null,
        customer_name: quote.customer_name,
        customer_company: quote.customer_company,
        customer_address: quote.customer_address,
        customer_email: quote.customer_email,
        customer_phone: quote.customer_phone,
        customer_tax_id: quote.customer_tax_id,
        customer_branch_type: quote.customer_branch_type,
        customer_branch_code: quote.customer_branch_code,
        customer_branch_name: quote.customer_branch_name,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: calcDueDate(),
        payment_terms: paymentTerms,
        subtotal: Math.round(amounts.subtotal * 100) / 100,
        vat_percent: 7,
        vat_amount: Math.round(amounts.vat * 100) / 100,
        grand_total: Math.round(amounts.total * 100) / 100,
        invoice_type: invoiceType,
        status: 'draft',
        notes: notes || null,
      };

      if (invoiceType === 'downpayment') {
        invoicePayload.downpayment_percent = downpaymentPercent;
      } else if (invoiceType === 'installment') {
        invoicePayload.installment_number = 1;
        invoicePayload.installment_total = installmentTotal;
      }

      const { data: invoice, error: invErr } = await (supabase as any)
        .from('invoices')
        .insert(invoicePayload)
        .select()
        .single();

      if (invErr) throw invErr;

      const products = Array.isArray(baseProducts) ? baseProducts : [];
      if (products.length > 0) {
        const items = products.map((p: any, idx: number) => ({
          invoice_id: invoice.id,
          product_id: p.id || null,
          product_name: p.name || p.model || 'ไม่ระบุ',
          product_description: p.description || null,
          sku: p.sku || null,
          quantity: p.qty || p.quantity || 1,
          unit: p.unit || 'ชิ้น',
          unit_price: Math.round((p.unit_price || 0) * amounts.ratio * 100) / 100,
          line_total: Math.round((p.line_total || 0) * amounts.ratio * 100) / 100,
          display_order: idx,
        }));

        const { error: itemsErr } = await (supabase as any)
          .from('invoice_items')
          .insert(items);
        if (itemsErr) throw itemsErr;
      }

      // 🔔 Notify customer (in-app + email)
      const customerUserId = (quote as any)?.user_id || (quote as any)?.created_by;
      if (customerUserId || quote?.customer_email) {
        import('@/lib/notifications').then(({ createNotification, sendQuoteStatusEmail }) => {
          if (customerUserId) {
            createNotification({
              userId: customerUserId,
              type: 'invoice_created',
              title: 'ออกใบวางบิลใหม่',
              message: `ใบวางบิล ${invoice.invoice_number} ยอดรวม ${formatCurrency(invoice.grand_total)} บาท`,
              priority: 'high',
              actionUrl: `/my-account/invoices/${invoice.id}`,
              actionLabel: 'ดูใบวางบิล',
              linkType: 'invoice',
              linkId: invoice.id,
            });
          }
          if (quote?.customer_email) {
            sendQuoteStatusEmail({
              recipientEmail: quote.customer_email,
              customerName: quote.customer_name,
              status: 'invoice_created',
              invoiceNumber: invoice.invoice_number,
              amount: formatCurrency(invoice.grand_total),
              viewUrl: `https://www.entgroup.co.th/my-account/invoices/${invoice.id}`,
            });
          }
        });
      }

      toast({
        title: '✅ สร้างใบวางบิลสำเร็จ',
        description: `${invoice.invoice_number} • ${formatCurrency(invoice.grand_total)}`,
      });

      onOpenChange(false);
      navigate('/admin/invoices');
    } catch (e: any) {
      toast({ title: 'สร้างใบวางบิลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!source) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            สร้างใบวางบิล
          </DialogTitle>
          <DialogDescription>
            {source.type === 'sale_order' && `จาก Sale Order ${sourceLabel}`}
            {source.type === 'quote' && `จากใบเสนอราคา ${sourceLabel}`}
            {' • รวม '}
            {formatCurrency(baseTotal)}
          </DialogDescription>
        </DialogHeader>

        {loadingQuote ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Customer info preview */}
            {quote && (
              <Card className="bg-muted/30">
                <CardContent className="pt-4 text-sm space-y-1">
                  <p className="font-semibold">{quote.customer_name}</p>
                  {quote.customer_company && (
                    <p className="text-muted-foreground">{quote.customer_company}</p>
                  )}
                  {quote.customer_tax_id && (
                    <p className="text-xs text-muted-foreground">
                      Tax ID: {quote.customer_tax_id}
                      {quote.customer_branch_type === 'head_office' && ' (สำนักงานใหญ่)'}
                      {quote.customer_branch_type === 'branch' && quote.customer_branch_name &&
                        ` (สาขา ${quote.customer_branch_name})`}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Invoice type selector */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">ประเภทใบวางบิล</Label>
              <RadioGroup value={invoiceType} onValueChange={(v) => setInvoiceType(v as InvoiceType)}>
                <div className="space-y-2">
                  <Card className="cursor-pointer hover:border-primary" onClick={() => setInvoiceType('full')}>
                    <CardContent className="pt-4 pb-4 flex items-center gap-3">
                      <RadioGroupItem value="full" id="t-full" />
                      <Label htmlFor="t-full" className="cursor-pointer flex-1">
                        <p className="font-medium flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-primary" /> เต็มจำนวน</p>
                        <p className="text-xs text-muted-foreground">วางบิลครั้งเดียว ครบทั้งหมด</p>
                      </Label>
                      <span className="text-sm font-bold text-primary">
                        {formatCurrency(baseTotal)}
                      </span>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:border-primary" onClick={() => setInvoiceType('downpayment')}>
                    <CardContent className="pt-4 pb-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="downpayment" id="t-down" />
                        <Label htmlFor="t-down" className="cursor-pointer flex-1">
                          <p className="font-medium flex items-center gap-1.5"><Landmark className="w-4 h-4 text-primary" /> มัดจำ</p>
                          <p className="text-xs text-muted-foreground">วางบิลมัดจำ % ของยอดรวม</p>
                        </Label>
                      </div>
                      {invoiceType === 'downpayment' && (
                        <div className="ml-7 flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={downpaymentPercent}
                            onChange={(e) => setDownpaymentPercent(Number(e.target.value))}
                            className="w-20 h-8"
                          />
                          <span className="text-sm">% =</span>
                          <span className="text-sm font-bold text-primary">
                            {formatCurrency(baseTotal * downpaymentPercent / 100)}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:border-primary" onClick={() => setInvoiceType('installment')}>
                    <CardContent className="pt-4 pb-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="installment" id="t-inst" />
                        <Label htmlFor="t-inst" className="cursor-pointer flex-1">
                          <p className="font-medium flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-primary" /> แบ่งจ่าย</p>
                          <p className="text-xs text-muted-foreground">แบ่งเป็น N งวดเท่า ๆ กัน (สร้างงวดที่ 1)</p>
                        </Label>
                      </div>
                      {invoiceType === 'installment' && (
                        <div className="ml-7 flex items-center gap-2">
                          <span className="text-sm">แบ่ง</span>
                          <Input
                            type="number"
                            min="2"
                            max="12"
                            value={installmentTotal}
                            onChange={(e) => setInstallmentTotal(Number(e.target.value))}
                            className="w-16 h-8"
                          />
                          <span className="text-sm">งวด • งวดที่ 1 =</span>
                          <span className="text-sm font-bold text-primary">
                            {formatCurrency(baseTotal / installmentTotal)}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Payment terms + due date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">เงื่อนไขชำระ</Label>
                <Input
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="เช่น 30 วัน"
                />
              </div>
              <div>
                <Label className="text-xs">ครบกำหนดใน (วัน)</Label>
                <Input
                  type="number"
                  min="1"
                  value={dueDateOffset}
                  onChange={(e) => setDueDateOffset(Number(e.target.value))}
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  ครบกำหนด: {new Date(calcDueDate()).toLocaleDateString('th-TH')}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-xs">หมายเหตุ (ถ้ามี)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="หมายเหตุเพิ่มเติม..."
              />
            </div>

            {/* Summary */}
            <Card className="bg-primary/5 border-primary/30">
              <CardContent className="pt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>ยอดก่อน VAT:</span>
                  <span className="font-mono">{formatCurrency(amounts.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT 7%:</span>
                  <span className="font-mono">{formatCurrency(amounts.vat)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>รวมทั้งสิ้น:</span>
                  <span className="text-primary">{formatCurrency(amounts.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            ยกเลิก
          </Button>
          <Button onClick={handleCreate} disabled={loading || loadingQuote || !quote}>
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />กำลังสร้าง...</>
            ) : (
              <><Receipt className="w-4 h-4 mr-2" />สร้างใบวางบิล</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

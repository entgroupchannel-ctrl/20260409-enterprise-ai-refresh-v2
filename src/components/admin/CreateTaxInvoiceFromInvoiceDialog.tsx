import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string | null;
  onSuccess?: (taxInvoiceId: string) => void;
}

export default function CreateTaxInvoiceFromInvoiceDialog({
  open, onOpenChange, invoiceId, onSuccess,
}: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [existingTaxInvoices, setExistingTaxInvoices] = useState<any[]>([]);
  const [verifiedPayments, setVerifiedPayments] = useState<any[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');

  const [taxInvoiceDate, setTaxInvoiceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open || !invoiceId) return;
    loadInvoice();
  }, [open, invoiceId]);

  useEffect(() => {
    if (!open) {
      setInvoice(null);
      setItems([]);
      setExistingTaxInvoices([]);
      setVerifiedPayments([]);
      setSelectedPaymentId('');
      setDeliveryAddress('');
      setDeliveryDate('');
      setDeliveryMethod('');
      setTrackingNumber('');
      setNotes('');
      setTaxInvoiceDate(new Date().toISOString().split('T')[0]);
    }
  }, [open]);

  const loadInvoice = async () => {
    if (!invoiceId) return;
    setLoading(true);
    try {
      const [invRes, itemsRes, taxRes, payRes] = await Promise.all([
        (supabase as any).from('invoices').select('*').eq('id', invoiceId).maybeSingle(),
        (supabase as any).from('invoice_items').select('*').eq('invoice_id', invoiceId).order('display_order'),
        (supabase as any).from('tax_invoices')
          .select('id, tax_invoice_number, tax_invoice_date, grand_total, payment_record_id')
          .eq('invoice_id', invoiceId)
          .is('deleted_at', null)
          .order('created_at', { ascending: false }),
        (supabase as any).from('payment_records')
          .select('id, amount, payment_date, payment_method, bank_name, reference_number, verification_status')
          .eq('invoice_id', invoiceId)
          .eq('verification_status', 'verified')
          .order('payment_date', { ascending: false }),
      ]);

      if (invRes.error) throw invRes.error;
      if (itemsRes.error) throw itemsRes.error;
      if (taxRes.error) throw taxRes.error;
      if (payRes.error) throw payRes.error;

      setInvoice(invRes.data);
      setItems(itemsRes.data || []);
      setExistingTaxInvoices(taxRes.data || []);
      setVerifiedPayments(payRes.data || []);

      // Auto-select first unused payment
      const usedPaymentIds = new Set(
        (taxRes.data || [])
          .filter((t: any) => t.payment_record_id)
          .map((t: any) => t.payment_record_id)
      );
      const unused = (payRes.data || []).find((p: any) => !usedPaymentIds.has(p.id));
      if (unused) setSelectedPaymentId(unused.id);

      if (invRes.data?.customer_address) {
        setDeliveryAddress(invRes.data.customer_address);
      }
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!invoice || !user?.id) return;

    if (!selectedPaymentId) {
      toast({
        title: 'กรุณาเลือกการชำระเงิน',
        description: 'ต้องเลือก verified payment ที่ยังไม่ได้ออกใบกำกับภาษี',
        variant: 'destructive',
      });
      return;
    }

    const selectedPayment = verifiedPayments.find((p) => p.id === selectedPaymentId);
    if (!selectedPayment) return;

    if (items.length === 0) {
      toast({
        title: 'ไม่สามารถสร้าง',
        description: 'ใบวางบิลต้นทางไม่มีรายการสินค้า',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Calculate proportional amounts based on payment / invoice ratio
      const paymentRatio = selectedPayment.amount / invoice.grand_total;
      const proportionalSubtotal = (invoice.subtotal || 0) * paymentRatio;
      const proportionalDiscount = (invoice.discount_amount || 0) * paymentRatio;
      const proportionalVat = (invoice.vat_amount || 0) * paymentRatio;
      const proportionalWHT = (invoice.withholding_tax_amount || 0) * paymentRatio;

      const taxInvoicePayload = {
        invoice_id: invoice.id,
        sale_order_id: invoice.sale_order_id,
        payment_record_id: selectedPaymentId,
        customer_id: invoice.customer_id,
        customer_name: invoice.customer_name,
        customer_company: invoice.customer_company,
        customer_address: invoice.customer_address,
        customer_tax_id: invoice.customer_tax_id,
        customer_branch_type: invoice.customer_branch_type,
        customer_branch_code: invoice.customer_branch_code,
        customer_branch_name: invoice.customer_branch_name,
        tax_invoice_date: taxInvoiceDate,
        subtotal: Math.round(proportionalSubtotal * 100) / 100,
        discount_amount: Math.round(proportionalDiscount * 100) / 100,
        vat_amount: Math.round(proportionalVat * 100) / 100,
        withholding_tax_amount: Math.round(proportionalWHT * 100) / 100,
        grand_total: selectedPayment.amount,
        status: 'pending',
        delivery_address: deliveryAddress || null,
        delivery_date: deliveryDate || null,
        delivery_method: deliveryMethod || null,
        tracking_number: trackingNumber || null,
        notes: notes || null,
        created_by: user.id,
      };

      const { data: taxInv, error: txErr } = await (supabase as any)
        .from('tax_invoices')
        .insert(taxInvoicePayload)
        .select()
        .single();

      if (txErr) {
        if (txErr.code === '23505' && txErr.message.includes('payment')) {
          throw new Error('Payment นี้ถูกใช้สร้างใบกำกับภาษีไปแล้ว');
        }
        throw txErr;
      }

      const txItems = items.map((it: any, idx: number) => ({
        tax_invoice_id: taxInv.id,
        product_id: it.product_id || null,
        product_name: it.product_name || 'ไม่ระบุ',
        product_description: it.product_description || null,
        sku: it.sku || null,
        quantity: it.quantity || 1,
        unit: it.unit || 'ชิ้น',
        unit_price: it.unit_price || 0,
        discount_percent: it.discount_percent || 0,
        discount_amount: (it.discount_amount || 0) * paymentRatio,
        line_total: (it.line_total || 0) * paymentRatio,
        display_order: idx,
      }));

      const { error: itemsErr } = await (supabase as any)
        .from('tax_invoice_items')
        .insert(txItems);

      if (itemsErr) {
        await (supabase as any).from('tax_invoices').delete().eq('id', taxInv.id);
        throw itemsErr;
      }

      toast({
        title: '✅ สร้างใบกำกับภาษีสำเร็จ',
        description: `${taxInv.tax_invoice_number} • ฿${formatCurrency(taxInv.grand_total)}`,
      });

      onOpenChange(false);
      if (onSuccess) {
        onSuccess(taxInv.id);
      } else {
        navigate(`/admin/tax-invoices/${taxInv.id}`);
      }
    } catch (e: any) {
      toast({ title: 'สร้างไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(n);

  // Compute available payments
  const usedPaymentIds = new Set(
    existingTaxInvoices
      .filter((t: any) => t.payment_record_id)
      .map((t: any) => t.payment_record_id)
  );
  const availablePayments = verifiedPayments.filter((p) => !usedPaymentIds.has(p.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            สร้างใบกำกับภาษี
          </DialogTitle>
          <DialogDescription>
            {invoice && `จากใบวางบิล ${invoice.invoice_number}`}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !invoice ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>ไม่พบข้อมูลใบวางบิล</p>
          </div>
        ) : verifiedPayments.length === 0 ? (
          <div className="py-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
            <p className="font-semibold">ยังไม่มีการชำระเงินที่ verified</p>
            <p className="text-xs text-muted-foreground mt-1">
              ต้องมี payment record ที่ verified แล้วก่อนสร้างใบกำกับภาษี
            </p>
          </div>
        ) : availablePayments.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="font-semibold">ออกใบกำกับภาษีครบทุก payment แล้ว</p>
            <p className="text-xs text-muted-foreground mt-1">
              {existingTaxInvoices.length} ใบกำกับภาษี
            </p>
            <ul className="text-xs mt-3 space-y-1">
              {existingTaxInvoices.map((t: any) => (
                <li key={t.id} className="font-mono">
                  • {t.tax_invoice_number} • ฿{formatCurrency(t.grand_total)}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Existing tax invoices info */}
            {existingTaxInvoices.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900">
                      มีใบกำกับภาษีอยู่แล้ว ({existingTaxInvoices.length})
                    </p>
                    <ul className="text-xs text-blue-800 mt-1 space-y-0.5">
                      {existingTaxInvoices.map((t: any) => (
                        <li key={t.id} className="font-mono">
                          • {t.tax_invoice_number} • ฿{formatCurrency(t.grand_total)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Customer summary */}
            <Card className="bg-muted/40">
              <CardContent className="pt-4 pb-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ลูกค้า:</span>
                  <span className="font-medium">{invoice.customer_company || invoice.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ยอดใบวางบิล:</span>
                  <span className="font-bold text-primary">฿{formatCurrency(invoice.grand_total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Select payment */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                เลือกการชำระเงิน <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                1 payment = 1 ใบกำกับภาษี (กฎหมายไทย — ม.78)
              </p>
              <RadioGroup value={selectedPaymentId} onValueChange={setSelectedPaymentId}>
                <div className="space-y-2">
                  {availablePayments.map((p: any) => (
                    <Card key={p.id} className="cursor-pointer hover:bg-muted/30">
                      <CardContent className="pt-3 pb-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <RadioGroupItem value={p.id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-base text-primary">
                                ฿{formatCurrency(p.amount)}
                              </span>
                              <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-300">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(p.payment_date).toLocaleDateString('th-TH')} • {p.payment_method || 'โอน'}
                              {p.bank_name && ` • ${p.bank_name}`}
                            </p>
                            {p.reference_number && (
                              <p className="text-xs font-mono mt-0.5">
                                อ้างอิง: {p.reference_number}
                              </p>
                            )}
                          </div>
                        </label>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="tax-date">วันที่ออกใบกำกับภาษี *</Label>
              <Input
                id="tax-date"
                type="date"
                value={taxInvoiceDate}
                onChange={(e) => setTaxInvoiceDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Delivery info */}
            <div className="space-y-3 p-3 bg-muted/20 rounded">
              <Label className="text-sm font-semibold">ข้อมูลการจัดส่ง (ถ้ามี)</Label>
              <div className="space-y-2">
                <Label htmlFor="delivery-addr" className="text-xs">ที่อยู่จัดส่ง</Label>
                <Textarea
                  id="delivery-addr"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={2}
                  placeholder="ถ้าไม่ระบุจะใช้ที่อยู่ลูกค้า"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="delivery-date" className="text-xs">วันที่จัดส่ง</Label>
                  <Input
                    id="delivery-date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="delivery-method" className="text-xs">วิธีจัดส่ง</Label>
                  <Input
                    id="delivery-method"
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    placeholder="เช่น Kerry, ขนส่งเอง"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tracking" className="text-xs">เลข Tracking</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="tax-notes">หมายเหตุ</Label>
              <Textarea
                id="tax-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="หมายเหตุภายในหรือบนเอกสาร..."
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading || submitting || !invoice || items.length === 0 || !selectedPaymentId || availablePayments.length === 0}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                กำลังสร้าง...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-1.5" />
                สร้างใบกำกับภาษี
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

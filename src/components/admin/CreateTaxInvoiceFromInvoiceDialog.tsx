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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [creating, setCreating] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [existingTaxInvoices, setExistingTaxInvoices] = useState<any[]>([]);
  const [verifiedPayments, setVerifiedPayments] = useState<any[]>([]);

  const [taxInvoiceDate, setTaxInvoiceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryContact, setDeliveryContact] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  useEffect(() => {
    if (!open || !invoiceId) return;
    loadData();
  }, [open, invoiceId]);

  useEffect(() => {
    if (!open) {
      setInvoice(null);
      setExistingTaxInvoices([]);
      setVerifiedPayments([]);
      setDeliveryAddress('');
      setDeliveryDate('');
      setDeliveryContact('');
      setDeliveryNotes('');
      setTaxInvoiceDate(new Date().toISOString().split('T')[0]);
    }
  }, [open]);

  const loadData = async () => {
    if (!invoiceId) return;
    setLoading(true);
    try {
      const [invRes, taxRes, payRes] = await Promise.all([
        (supabase as any).from('invoices').select('*').eq('id', invoiceId).maybeSingle(),
        (supabase as any).from('tax_invoices')
          .select('id, tax_invoice_number, tax_invoice_date, grand_total')
          .eq('invoice_id', invoiceId)
          .is('deleted_at', null),
        (supabase as any).from('payment_records')
          .select('*')
          .eq('invoice_id', invoiceId)
          .eq('verification_status', 'verified')
          .order('payment_date', { ascending: true }),
      ]);

      if (invRes.error) throw invRes.error;
      setInvoice(invRes.data);
      setExistingTaxInvoices(taxRes.data || []);
      setVerifiedPayments(payRes.data || []);

      if (invRes.data?.customer_address) {
        setDeliveryAddress(invRes.data.customer_address);
      }

      setTaxInvoiceDate(new Date().toISOString().split('T')[0]);
    } catch (e: any) {
      toast({
        title: 'โหลดข้อมูลไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Phase 8.1: Compute totals
  const verifiedTotal = verifiedPayments.reduce(
    (sum, p) => sum + Number(p.amount || 0), 0
  );
  const invoiceTotal = Number(invoice?.grand_total || 0);
  const hasExistingTaxInvoice = existingTaxInvoices.length > 0;
  const isBalanced = Math.abs(verifiedTotal - invoiceTotal) < 0.01;
  const isOverpaid = verifiedTotal > invoiceTotal + 0.01;
  const isUnderpaid = verifiedTotal < invoiceTotal - 0.01;

  const handleCreate = async () => {
    if (!invoice || !user?.id) return;

    if (hasExistingTaxInvoice) {
      toast({
        title: 'มีใบกำกับภาษีอยู่แล้ว',
        description: 'ใบวางบิลนี้มีใบกำกับภาษีออกแล้ว',
        variant: 'destructive',
      });
      return;
    }

    if (verifiedPayments.length === 0) {
      toast({
        title: 'ยังไม่มีการชำระเงินที่ verified',
        variant: 'destructive',
      });
      return;
    }

    if (isUnderpaid) {
      const confirmed = window.confirm(
        `⚠️ ยอดที่ verified ยังไม่ครบ\n\n` +
        `ยอดใบวางบิล: ฿${invoiceTotal.toLocaleString()}\n` +
        `Verified: ฿${verifiedTotal.toLocaleString()}\n` +
        `ขาด: ฿${(invoiceTotal - verifiedTotal).toLocaleString()}\n\n` +
        `ใบกำกับภาษีจะออกยอดเต็ม ฿${invoiceTotal.toLocaleString()}\n` +
        `ตามใบวางบิล (ลูกค้าต้องโอนส่วนที่เหลือเพิ่ม)\n\n` +
        `ต้องการสร้างใบกำกับภาษีต่อหรือไม่?`
      );
      if (!confirmed) return;
    }

    if (isOverpaid) {
      const confirmed = window.confirm(
        `⚠️ Verified เกินยอดใบวางบิล\n\n` +
        `ยอดใบวางบิล: ฿${invoiceTotal.toLocaleString()}\n` +
        `Verified: ฿${verifiedTotal.toLocaleString()}\n` +
        `เกิน: ฿${(verifiedTotal - invoiceTotal).toLocaleString()}\n\n` +
        `อาจมีสลิปซ้ำซ้อน — ควร reject สลิปที่ซ้ำก่อน\n` +
        `ใบกำกับภาษีจะออกยอด ฿${invoiceTotal.toLocaleString()} เท่าเดิม\n\n` +
        `ต้องการสร้างต่อหรือไม่?`
      );
      if (!confirmed) return;
    }

    setCreating(true);
    try {
      // Phase 8.1: 1 tax invoice per invoice, ยอดเต็ม
      const payload: any = {
        invoice_id: invoice.id,
        sale_order_id: invoice.sale_order_id,
        payment_record_id: null,
        customer_id: invoice.customer_id,
        customer_name: invoice.customer_name,
        customer_company: invoice.customer_company,
        customer_address: invoice.customer_address,
        customer_tax_id: invoice.customer_tax_id,
        customer_branch_type: invoice.customer_branch_type,
        customer_branch_code: invoice.customer_branch_code,
        customer_branch_name: invoice.customer_branch_name,
        customer_email: invoice.customer_email,
        tax_invoice_date: taxInvoiceDate,
        subtotal: invoice.subtotal || 0,
        discount_amount: invoice.discount_amount || 0,
        vat_amount: invoice.vat_amount || 0,
        withholding_tax_amount: invoice.withholding_tax_amount || 0,
        grand_total: invoiceTotal,
        status: 'pending',
        delivery_address: deliveryAddress || null,
        delivery_date: deliveryDate || null,
        delivery_contact: deliveryContact || null,
        delivery_notes: deliveryNotes || null,
        created_by: user.id,
      };

      const { data: taxInv, error: taxErr } = await (supabase as any)
        .from('tax_invoices')
        .insert(payload)
        .select('id, tax_invoice_number')
        .single();

      if (taxErr) {
        if (taxErr.code === '23505') {
          throw new Error('ใบวางบิลนี้มีใบกำกับภาษีอยู่แล้ว');
        }
        throw taxErr;
      }

      // Phase 8.1: Link ALL verified payments to this tax invoice
      if (verifiedPayments.length > 0) {
        const paymentIds = verifiedPayments.map((p) => p.id);
        await (supabase as any)
          .from('payment_records')
          .update({ tax_invoice_id: taxInv.id })
          .in('id', paymentIds);
      }

      // Copy invoice items to tax invoice items (full amount)
      const { data: items } = await (supabase as any)
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoice.id)
        .order('display_order');

      if (items && items.length > 0) {
        const taxItems = items.map((it: any, idx: number) => ({
          tax_invoice_id: taxInv.id,
          product_id: it.product_id || null,
          product_name: it.product_name || 'ไม่ระบุ',
          product_description: it.product_description || null,
          sku: it.sku || null,
          quantity: it.quantity || 1,
          unit: it.unit || 'ชิ้น',
          unit_price: it.unit_price || 0,
          discount_percent: it.discount_percent || 0,
          discount_amount: it.discount_amount || 0,
          line_total: it.line_total || 0,
          display_order: idx,
        }));

        await (supabase as any).from('tax_invoice_items').insert(taxItems);
      }

      toast({
        title: '✅ สร้างใบกำกับภาษีสำเร็จ',
        description: `${taxInv.tax_invoice_number} — ฿${formatCurrency(invoiceTotal)}`,
      });

      onOpenChange(false);
      if (onSuccess) {
        onSuccess(taxInv.id);
      } else {
        navigate(`/admin/tax-invoices/${taxInv.id}`);
      }
    } catch (e: any) {
      toast({
        title: 'สร้างไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(n);

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
        ) : hasExistingTaxInvoice ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="font-semibold">มีใบกำกับภาษีอยู่แล้ว</p>
            <p className="text-xs text-muted-foreground mt-1">
              ใบวางบิลนี้สร้างใบกำกับภาษีแล้ว
            </p>
            <ul className="text-xs mt-3 space-y-1">
              {existingTaxInvoices.map((t: any) => (
                <li key={t.id} className="font-mono">
                  • {t.tax_invoice_number} • ฿{formatCurrency(t.grand_total)}
                </li>
              ))}
            </ul>
          </div>
        ) : verifiedPayments.length === 0 ? (
          <div className="py-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
            <p className="font-semibold">ยังไม่มีการชำระเงินที่ verified</p>
            <p className="text-xs text-muted-foreground mt-1">
              ต้องมี payment record ที่ verified แล้วก่อนสร้างใบกำกับภาษี
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Invoice amount */}
            <Card className="bg-muted/40">
              <CardContent className="pt-4 pb-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ลูกค้า:</span>
                  <span className="font-medium">
                    {invoice.customer_company || invoice.customer_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ยอดใบวางบิล:</span>
                  <span className="font-bold text-primary">
                    ฿{formatCurrency(invoiceTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Verified ({verifiedPayments.length} payment{verifiedPayments.length > 1 ? 's' : ''}):
                  </span>
                  <span className={cn(
                    "font-bold",
                    isBalanced ? "text-green-600" :
                    isOverpaid ? "text-destructive" : "text-amber-600"
                  )}>
                    ฿{formatCurrency(verifiedTotal)}
                  </span>
                </div>
                {!isBalanced && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {isOverpaid ? 'เกิน:' : 'ขาด:'}
                    </span>
                    <span className={isOverpaid ? 'text-destructive' : 'text-amber-600'}>
                      {isOverpaid ? '+' : '-'}฿{formatCurrency(Math.abs(verifiedTotal - invoiceTotal))}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Warning if unbalanced */}
            {isOverpaid && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-300">
                      ⚠️ Verified เกินยอดใบวางบิล
                    </p>
                    <p className="text-xs text-red-800 dark:text-red-400 mt-1">
                      อาจมีสลิปซ้ำซ้อน ควร reject สลิปที่ซ้ำก่อนสร้างใบกำกับภาษี
                      ใบกำกับภาษีจะออกยอด ฿{formatCurrency(invoiceTotal)} ตามใบวางบิล
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isUnderpaid && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-300">
                      ⏳ Partial Payment
                    </p>
                    <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">
                      ลูกค้ายังโอนไม่ครบ ใบกำกับภาษีจะออกยอด
                      ฿{formatCurrency(invoiceTotal)} เต็มตามใบวางบิล
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isBalanced && (
              <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <p className="font-semibold text-green-900 dark:text-green-300">
                    ยอดตรงกับใบวางบิล — พร้อมออกใบกำกับภาษี
                  </p>
                </div>
              </div>
            )}

            {/* Payment records list (all verified) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                สลิปการชำระเงินที่แนบ ({verifiedPayments.length})
              </Label>
              <p className="text-xs text-muted-foreground">
                ℹ️ ทุกสลิปจะผูกเข้ากับใบกำกับภาษีนี้ทั้งหมด
              </p>
              <div className="space-y-2">
                {verifiedPayments.map((p: any, idx: number) => (
                  <Card key={p.id}>
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-primary">
                              ฿{formatCurrency(p.amount)}
                            </span>
                            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-300">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(p.payment_date).toLocaleDateString('th-TH')}
                            {p.bank_name && ` • ${p.bank_name}`}
                            {p.payment_method && ` • ${p.payment_method}`}
                          </p>
                          {p.reference_number && (
                            <p className="text-xs font-mono mt-0.5">
                              อ้างอิง: {p.reference_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                  <Label htmlFor="delivery-contact" className="text-xs">ผู้รับ</Label>
                  <Input
                    id="delivery-contact"
                    value={deliveryContact}
                    onChange={(e) => setDeliveryContact(e.target.value)}
                    placeholder="ชื่อผู้รับ"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="delivery-notes" className="text-xs">หมายเหตุ</Label>
                <Textarea
                  id="delivery-notes"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={creating}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleCreate}
            disabled={creating || loading || !invoice || hasExistingTaxInvoice || verifiedPayments.length === 0}
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                กำลังสร้าง...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                สร้างใบกำกับภาษี ฿{formatCurrency(invoiceTotal)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

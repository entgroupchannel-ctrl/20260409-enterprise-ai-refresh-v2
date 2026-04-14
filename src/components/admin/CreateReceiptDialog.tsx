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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Receipt, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId?: string | null;
  taxInvoiceId?: string | null;
  onSuccess?: (receiptId: string) => void;
}

export default function CreateReceiptDialog({
  open, onOpenChange, invoiceId, taxInvoiceId, onSuccess,
}: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [source, setSource] = useState<any>(null);
  const [verifiedPayments, setVerifiedPayments] = useState<any[]>([]);
  const [existingReceipts, setExistingReceipts] = useState<any[]>([]);

  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');
  const [receiptDate, setReceiptDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open) return;
    if (!invoiceId && !taxInvoiceId) return;
    loadSource();
  }, [open, invoiceId, taxInvoiceId]);

  useEffect(() => {
    if (!open) {
      setSource(null);
      setVerifiedPayments([]);
      setExistingReceipts([]);
      setSelectedPaymentId('');
      setNotes('');
      setReceiptDate(new Date().toISOString().split('T')[0]);
    }
  }, [open]);

  const loadSource = async () => {
    setLoading(true);
    try {
      let invoiceData: any = null;
      let taxInvoiceData: any = null;
      let targetInvoiceId = invoiceId;

      if (taxInvoiceId) {
        const { data: tx, error: txErr } = await (supabase as any)
          .from('tax_invoices')
          .select('*')
          .eq('id', taxInvoiceId)
          .maybeSingle();
        if (txErr) throw txErr;
        taxInvoiceData = tx;
        targetInvoiceId = tx?.invoice_id;
      }

      if (targetInvoiceId) {
        const { data: inv, error: invErr } = await (supabase as any)
          .from('invoices')
          .select('*')
          .eq('id', targetInvoiceId)
          .maybeSingle();
        if (invErr) throw invErr;
        invoiceData = inv;
      }

      setSource({ invoice: invoiceData, taxInvoice: taxInvoiceData });

      if (targetInvoiceId) {
        const [payRes, rcpRes] = await Promise.all([
          (supabase as any)
            .from('payment_records')
            .select('id, amount, payment_date, payment_method, bank_name, reference_number, verification_status')
            .eq('invoice_id', targetInvoiceId)
            .eq('verification_status', 'verified')
            .order('payment_date', { ascending: false }),
          (supabase as any)
            .from('receipts')
            .select('id, receipt_number, payment_record_id, amount, receipt_date')
            .or(`invoice_id.eq.${targetInvoiceId}${taxInvoiceId ? `,tax_invoice_id.eq.${taxInvoiceId}` : ''}`)
            .order('created_at', { ascending: false }),
        ]);

        if (payRes.error) throw payRes.error;
        if (rcpRes.error) throw rcpRes.error;

        setVerifiedPayments(payRes.data || []);
        setExistingReceipts(rcpRes.data || []);

        const usedPaymentIds = new Set((rcpRes.data || []).map((r: any) => r.payment_record_id));
        const unused = (payRes.data || []).find((p: any) => !usedPaymentIds.has(p.id));
        if (unused) setSelectedPaymentId(unused.id);
      }
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!user?.id || !source?.invoice) return;

    if (!selectedPaymentId) {
      toast({
        title: 'กรุณาเลือกการชำระเงิน',
        description: 'ต้องเลือก payment record ที่ verified แล้ว',
        variant: 'destructive',
      });
      return;
    }

    const selectedPayment = verifiedPayments.find((p) => p.id === selectedPaymentId);
    if (!selectedPayment) return;

    setSubmitting(true);
    try {
      const inv = source.invoice;
      const tx = source.taxInvoice;
      const customerSource = tx || inv;

      const payload = {
        payment_record_id: selectedPaymentId,
        invoice_id: inv.id,
        tax_invoice_id: tx?.id || null,
        customer_id: customerSource.customer_id,
        customer_name: customerSource.customer_name,
        customer_company: customerSource.customer_company,
        customer_address: customerSource.customer_address,
        customer_tax_id: customerSource.customer_tax_id,
        receipt_date: receiptDate,
        amount: selectedPayment.amount,
        payment_method: selectedPayment.payment_method,
        notes: notes || null,
        created_by: user.id,
      };

      const { data: receipt, error } = await (supabase as any)
        .from('receipts')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '✅ สร้างใบเสร็จรับเงินสำเร็จ',
        description: `${receipt.receipt_number} • ฿${formatCurrency(receipt.amount)}`,
      });

      onOpenChange(false);
      if (onSuccess) {
        onSuccess(receipt.id);
      } else {
        navigate(`/admin/receipts/${receipt.id}`);
      }
    } catch (e: any) {
      toast({ title: 'สร้างไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(n);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

  const usedPaymentIds = new Set(existingReceipts.map((r: any) => r.payment_record_id));
  const availablePayments = verifiedPayments.filter((p) => !usedPaymentIds.has(p.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            สร้างใบเสร็จรับเงิน
          </DialogTitle>
          <DialogDescription>
            {source?.taxInvoice && `จากใบกำกับภาษี ${source.taxInvoice.tax_invoice_number}`}
            {!source?.taxInvoice && source?.invoice && `จากใบวางบิล ${source.invoice.invoice_number}`}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !source?.invoice ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>ไม่พบข้อมูล</p>
          </div>
        ) : verifiedPayments.length === 0 ? (
          <div className="py-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
            <p className="font-semibold">ยังไม่มีการชำระเงินที่ verified</p>
            <p className="text-xs text-muted-foreground mt-1">
              ต้องมี payment record ที่ verified แล้วก่อนสร้างใบเสร็จ
            </p>
          </div>
        ) : availablePayments.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="font-semibold">ออกใบเสร็จครบทุก payment แล้ว</p>
            <p className="text-xs text-muted-foreground mt-1">
              {existingReceipts.length} ใบเสร็จ
            </p>
            <ul className="text-xs mt-3 space-y-1">
              {existingReceipts.map((r: any) => (
                <li key={r.id} className="font-mono">
                  • {r.receipt_number} • ฿{formatCurrency(r.amount)} • {formatDate(r.receipt_date)}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            {existingReceipts.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">
                      มีใบเสร็จอยู่แล้ว ({existingReceipts.length})
                    </p>
                    <ul className="text-xs text-amber-800 mt-1 space-y-0.5">
                      {existingReceipts.map((r: any) => (
                        <li key={r.id} className="font-mono">
                          • {r.receipt_number} • ฿{formatCurrency(r.amount)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <Card className="bg-muted/40">
              <CardContent className="pt-4 pb-4 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ผู้จ่ายเงิน:</span>
                  <span className="font-medium">
                    {(source.taxInvoice || source.invoice).customer_company || (source.taxInvoice || source.invoice).customer_name}
                  </span>
                </div>
                {(source.taxInvoice || source.invoice).customer_tax_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">เลขผู้เสียภาษี:</span>
                    <span className="font-mono text-xs">{(source.taxInvoice || source.invoice).customer_tax_id}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                เลือกการชำระเงิน <span className="text-red-500">*</span>
              </Label>
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
                              <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(p.payment_date)} • {p.payment_method || 'โอน'}
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

            <div className="space-y-2">
              <Label htmlFor="receipt-date">วันที่ออกใบเสร็จ *</Label>
              <Input
                id="receipt-date"
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt-notes">หมายเหตุ</Label>
              <Textarea
                id="receipt-notes"
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
            disabled={loading || submitting || !selectedPaymentId || availablePayments.length === 0}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                กำลังสร้าง...
              </>
            ) : (
              <>
                <Receipt className="w-4 h-4 mr-1.5" />
                สร้างใบเสร็จ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

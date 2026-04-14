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
  const [creating, setCreating] = useState(false);
  const [source, setSource] = useState<any>(null);
  const [verifiedPayments, setVerifiedPayments] = useState<any[]>([]);
  const [existingReceipt, setExistingReceipt] = useState<any>(null);

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
      setExistingReceipt(null);
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
      let targetTaxInvoiceId = taxInvoiceId;

      // If we have taxInvoiceId, load it
      if (targetTaxInvoiceId) {
        const { data: tx, error: txErr } = await (supabase as any)
          .from('tax_invoices')
          .select('*')
          .eq('id', targetTaxInvoiceId)
          .maybeSingle();
        if (txErr) throw txErr;
        taxInvoiceData = tx;
        targetInvoiceId = tx?.invoice_id;
      }

      // If we only have invoiceId, try to find the tax invoice
      if (!targetTaxInvoiceId && targetInvoiceId) {
        const { data: txList } = await (supabase as any)
          .from('tax_invoices')
          .select('*')
          .eq('invoice_id', targetInvoiceId)
          .is('deleted_at', null)
          .limit(1)
          .maybeSingle();
        if (txList) {
          taxInvoiceData = txList;
          targetTaxInvoiceId = txList.id;
        }
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

      // Load verified payments
      if (targetInvoiceId) {
        const { data: payData } = await (supabase as any)
          .from('payment_records')
          .select('id, amount, payment_date, payment_method, bank_name, reference_number')
          .eq('invoice_id', targetInvoiceId)
          .eq('verification_status', 'verified')
          .order('payment_date', { ascending: true });
        setVerifiedPayments(payData || []);
      }

      // Phase 8.1: Check if receipt already exists for this tax_invoice
      if (targetTaxInvoiceId) {
        const { data: existingReceiptRes } = await (supabase as any)
          .from('receipts')
          .select('id, receipt_number, amount, receipt_date')
          .eq('tax_invoice_id', targetTaxInvoiceId)
          .is('deleted_at', null)
          .maybeSingle();
        setExistingReceipt(existingReceiptRes);
      }
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!user?.id || !source?.invoice) {
      toast({ title: 'ไม่พบข้อมูล', variant: 'destructive' });
      return;
    }

    const taxInvoice = source.taxInvoice;
    const invoice = source.invoice;

    if (!taxInvoice) {
      toast({
        title: 'ไม่พบใบกำกับภาษี',
        description: 'ต้องสร้างใบกำกับภาษีก่อนสร้างใบเสร็จ',
        variant: 'destructive',
      });
      return;
    }

    if (existingReceipt) {
      toast({
        title: 'มีใบเสร็จอยู่แล้ว',
        description: `ใบกำกับภาษีนี้มีใบเสร็จ ${existingReceipt.receipt_number} แล้ว`,
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      // Phase 8.1: Receipt uses full tax_invoice amount
      const firstPayment = verifiedPayments[0] || null;

      const payload = {
        tax_invoice_id: taxInvoice.id,
        invoice_id: invoice.id,
        payment_record_id: firstPayment?.id || null,
        customer_id: invoice.customer_id,
        customer_name: invoice.customer_name,
        customer_company: invoice.customer_company,
        customer_address: invoice.customer_address,
        customer_tax_id: invoice.customer_tax_id,
        receipt_date: receiptDate,
        amount: Number(taxInvoice.grand_total),
        payment_method: firstPayment?.payment_method || 'bank_transfer',
        notes: notes || null,
        created_by: user.id,
      };

      const { data: newReceipt, error } = await (supabase as any)
        .from('receipts')
        .insert(payload)
        .select('id, receipt_number')
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('ใบกำกับภาษีนี้มีใบเสร็จอยู่แล้ว');
        }
        throw error;
      }

      toast({
        title: '✅ สร้างใบเสร็จสำเร็จ',
        description: `${newReceipt.receipt_number} — ฿${formatCurrency(Number(taxInvoice.grand_total))}`,
      });

      onOpenChange(false);
      if (onSuccess) {
        onSuccess(newReceipt.id);
      } else {
        navigate(`/admin/receipts/${newReceipt.id}`);
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

  const taxInvoice = source?.taxInvoice;
  const invoice = source?.invoice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            สร้างใบเสร็จรับเงิน
          </DialogTitle>
          <DialogDescription>
            {taxInvoice && `จากใบกำกับภาษี ${taxInvoice.tax_invoice_number}`}
            {!taxInvoice && invoice && `จากใบวางบิล ${invoice.invoice_number}`}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !invoice ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>ไม่พบข้อมูล</p>
          </div>
        ) : !taxInvoice ? (
          <div className="py-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
            <p className="font-semibold">ยังไม่มีใบกำกับภาษี</p>
            <p className="text-xs text-muted-foreground mt-1">
              ต้องสร้างใบกำกับภาษีก่อนจึงจะออกใบเสร็จได้
            </p>
          </div>
        ) : existingReceipt ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="font-semibold">มีใบเสร็จอยู่แล้ว</p>
            <p className="text-xs text-muted-foreground mt-1">
              ใบกำกับภาษีนี้สร้างใบเสร็จแล้ว
            </p>
            <p className="text-xs font-mono mt-2">
              • {existingReceipt.receipt_number} • ฿{formatCurrency(existingReceipt.amount)}
            </p>
          </div>
        ) : verifiedPayments.length === 0 ? (
          <div className="py-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
            <p className="font-semibold">ยังไม่มีการชำระเงินที่ verified</p>
            <p className="text-xs text-muted-foreground mt-1">
              ต้องมี payment record ที่ verified แล้วก่อนสร้างใบเสร็จ
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Customer info */}
            <Card className="bg-muted/40">
              <CardContent className="pt-4 pb-4 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ผู้จ่ายเงิน:</span>
                  <span className="font-medium">
                    {(taxInvoice || invoice).customer_company || (taxInvoice || invoice).customer_name}
                  </span>
                </div>
                {(taxInvoice || invoice).customer_tax_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">เลขผู้เสียภาษี:</span>
                    <span className="font-mono text-xs">{(taxInvoice || invoice).customer_tax_id}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info card */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded text-xs">
              <p className="font-semibold text-blue-900 dark:text-blue-300">
                ℹ️ ใบเสร็จจะออกยอดเต็ม ฿{formatCurrency(Number(taxInvoice?.grand_total || 0))}
              </p>
              <p className="text-blue-800 dark:text-blue-400 mt-1">
                ตามใบกำกับภาษี {taxInvoice?.tax_invoice_number}
              </p>
            </div>

            {/* Verified payments summary */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                สลิปการชำระเงิน ({verifiedPayments.length})
              </Label>
              <div className="space-y-1">
                {verifiedPayments.map((p: any, idx: number) => (
                  <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-300">
                        #{idx + 1}
                      </Badge>
                      <span>{new Date(p.payment_date).toLocaleDateString('th-TH')}</span>
                      {p.bank_name && <span className="text-muted-foreground">• {p.bank_name}</span>}
                    </div>
                    <span className="font-bold text-green-700">฿{formatCurrency(p.amount)}</span>
                  </div>
                ))}
              </div>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading || creating || !taxInvoice || !!existingReceipt || verifiedPayments.length === 0}
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                กำลังสร้าง...
              </>
            ) : (
              <>
                <Receipt className="w-4 h-4 mr-1.5" />
                สร้างใบเสร็จ ฿{formatCurrency(Number(taxInvoice?.grand_total || 0))}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

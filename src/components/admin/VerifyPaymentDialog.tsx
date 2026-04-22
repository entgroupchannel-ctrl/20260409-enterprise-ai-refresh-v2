import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  ShieldCheck, XCircle, ExternalLink, Loader2, AlertCircle, CheckCircle2,
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method: string | null;
  bank_name: string | null;
  bank_account: string | null;
  reference_number: string | null;
  notes: string | null;
  proof_url: string | null;
  proof_uploaded_at?: string | null;
  verification_status: string;
  created_at: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentRecord | null;
  invoiceNumber: string;
  grandTotal: number;
  otherVerifiedTotal?: number;
  onSuccess?: () => void;
}

type Mode = 'view' | 'reject';

export default function VerifyPaymentDialog({
  open,
  onOpenChange,
  payment,
  invoiceNumber,
  grandTotal,
  otherVerifiedTotal = 0,
  onSuccess,
}: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<Mode>('view');
  const [rejectionReason, setRejectionReason] = useState('');
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (!open || !payment?.proof_url) {
      setSignedUrl(null);
      return;
    }

    const loadSignedUrl = async () => {
      setLoadingImage(true);
      try {
        const { data, error } = await (supabase as any).storage
          .from('payment-slips')
          .createSignedUrl(payment.proof_url, 3600);
        if (error) {
          console.error('[VerifyPaymentDialog] createSignedUrl error:', error, 'path=', payment.proof_url);
        }
        if (data?.signedUrl) {
          setSignedUrl(data.signedUrl);
        } else {
          setSignedUrl(null);
        }
      } catch (e) {
        console.error('[VerifyPaymentDialog] Failed to load signed URL:', e);
        setSignedUrl(null);
      } finally {
        setLoadingImage(false);
      }
    };

    loadSignedUrl();
  }, [open, payment?.proof_url]);

  useEffect(() => {
    if (!open) {
      setMode('view');
      setRejectionReason('');
    }
  }, [open]);

  const handleApprove = async () => {
    if (!payment || !user?.id) return;

    // Phase 8.1: Warn if verifying will exceed invoice total
    const newVerifiedTotal = otherVerifiedTotal + Number(payment.amount);
    if (newVerifiedTotal > grandTotal + 0.01) {
      const excess = newVerifiedTotal - grandTotal;
      const confirmed = window.confirm(
        `⚠️ การยอมรับจะทำให้ยอด verified เกินใบวางบิล\n\n` +
        `ยอดใบวางบิล: ฿${grandTotal.toLocaleString()}\n` +
        `Verified เดิม: ฿${otherVerifiedTotal.toLocaleString()}\n` +
        `+ สลิปนี้: ฿${Number(payment.amount).toLocaleString()}\n` +
        `= รวมใหม่: ฿${newVerifiedTotal.toLocaleString()}\n\n` +
        `เกินยอด: ฿${excess.toLocaleString()}\n\n` +
        `กรณีนี้ควรเกิดเมื่อ:\n` +
        `• ลูกค้าส่งสลิปซ้ำ (ควร reject อันที่ซ้ำ)\n` +
        `• เป็น partial payment ที่ผิดพลาด\n\n` +
        `ต้องการดำเนินการต่อหรือไม่?`
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from('payment_records')
        .update({
          verification_status: 'verified',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          rejection_reason: null,
        })
        .eq('id', payment.id);

      if (error) throw error;

      toast({
        title: '✅ ยืนยันการชำระเงินสำเร็จ',
        description: `อนุมัติสลิป ฿${formatCurrency(payment.amount)} แล้ว`,
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      toast({
        title: 'ยืนยันไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!payment || !user?.id) return;

    if (!rejectionReason.trim()) {
      toast({
        title: 'กรุณาระบุเหตุผล',
        description: 'ต้องระบุเหตุผลสำหรับการปฏิเสธสลิป',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from('payment_records')
        .update({
          verification_status: 'rejected',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          rejection_reason: rejectionReason.trim(),
        })
        .eq('id', payment.id);

      if (error) throw error;

      toast({
        title: '❌ ปฏิเสธสลิปแล้ว',
        description: 'ลูกค้าจะเห็นเหตุผลและสามารถอัปโหลดสลิปใหม่ได้',
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      toast({
        title: 'ปฏิเสธไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatDateTime = (s: string) =>
    new Date(s).toLocaleString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  if (!payment) return null;

  const isExactMatch = Math.abs(payment.amount - grandTotal) < 0.01;
  const isPartial = payment.amount < grandTotal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            ตรวจสอบสลิปการชำระเงิน
          </DialogTitle>
          <DialogDescription>
            {invoiceNumber} • ยอดใบวางบิล: ฿{formatCurrency(grandTotal)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Slip image */}
          <div className="border rounded-lg overflow-hidden bg-muted/30">
            {loadingImage ? (
              <div className="p-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : signedUrl ? (
              <div className="relative">
                <img
                  src={signedUrl}
                  alt="Payment slip"
                  className="w-full max-h-96 object-contain"
                  onError={(e) = loading="lazy" decoding="async"> {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-background/90"
                  onClick={() => window.open(signedUrl, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  เปิดเต็มจอ
                </Button>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">ไม่มีไฟล์สลิป</p>
              </div>
            )}
          </div>

          {/* Payment details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">จำนวนเงินที่โอน</Label>
              <div className="font-bold text-xl text-primary">
                ฿{formatCurrency(payment.amount)}
              </div>
              {isExactMatch ? (
                <Badge className="bg-green-50 text-green-700 border-green-300">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  ตรงกับยอดใบวางบิล
                </Badge>
              ) : isPartial ? (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  ชำระบางส่วน (ขาด ฿{formatCurrency(grandTotal - payment.amount)})
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  เกินยอด ฿{formatCurrency(payment.amount - grandTotal)}
                </Badge>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">วันที่โอน (ตามลูกค้าระบุ)</Label>
              <div className="font-semibold">{formatDate(payment.payment_date)}</div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">เวลาส่งสลิปเข้าระบบ</Label>
              <div className="text-sm font-mono">
                {payment.proof_uploaded_at
                  ? formatDateTime(payment.proof_uploaded_at)
                  : formatDateTime(payment.created_at)}
              </div>
            </div>

            {payment.bank_name && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">ธนาคารปลายทาง</Label>
                <div>{payment.bank_name} {payment.bank_account && `(${payment.bank_account})`}</div>
              </div>
            )}

            {payment.reference_number && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">เลขอ้างอิง</Label>
                <div className="font-mono text-xs">{payment.reference_number}</div>
              </div>
            )}
          </div>

          {payment.notes && (
            <div className="p-3 bg-muted/40 rounded text-xs italic">
              <span className="font-semibold not-italic">หมายเหตุจากลูกค้า:</span> {payment.notes}
            </div>
          )}

          {/* Reject mode: reason input */}
          {mode === 'reject' && (
            <div className="space-y-2 p-3 bg-red-50 border border-red-200 rounded">
              <Label htmlFor="reject-reason" className="text-sm font-semibold text-red-800">
                เหตุผลการปฏิเสธ <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reject-reason"
                placeholder="เช่น: ยอดเงินไม่ตรง, สลิปไม่ชัด, วันที่ไม่ถูกต้อง, เลขอ้างอิงซ้ำ..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="bg-background"
              />
              <p className="text-xs text-red-700">
                ลูกค้าจะเห็นเหตุผลนี้และสามารถอัปโหลดสลิปใหม่ได้
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {mode === 'view' ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                ปิด
              </Button>
              <Button
                variant="outline"
                onClick={() => setMode('reject')}
                disabled={submitting}
                className="border-red-400 text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                ปฏิเสธ
              </Button>
              <Button
                onClick={handleApprove}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    กำลังยืนยัน...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    ยืนยันการชำระ
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => { setMode('view'); setRejectionReason(''); }}
                disabled={submitting}
              >
                กลับ
              </Button>
              <Button
                onClick={handleReject}
                disabled={submitting || !rejectionReason.trim()}
                variant="destructive"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    กำลังปฏิเสธ...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1.5" />
                    ยืนยันการปฏิเสธ
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

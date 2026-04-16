import { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Upload, Loader2, ImageIcon, X, CircleCheckBig, AlertCircle, ShieldCheck,
} from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceNumber: string;
  grandTotal: number;
  onSuccess?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'โอนผ่านธนาคาร' },
  { value: 'cash', label: 'เงินสด' },
  { value: 'cheque', label: 'เช็ค' },
  { value: 'other', label: 'อื่นๆ' },
];

export default function ConfirmPaymentDialog({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber,
  grandTotal,
  onSuccess,
}: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [amount, setAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<string>('bank_transfer');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Prefill amount + reset on open
  useEffect(() => {
    if (open) {
      setAmount(String(grandTotal || ''));
    }
  }, [open, grandTotal]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      setAmount('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('bank_transfer');
      setReferenceNumber('');
      setNotes('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleFileSelect = (f: File | null) => {
    if (!f) return;

    if (!ALLOWED_TYPES.includes(f.type)) {
      toast({
        title: 'ไฟล์ไม่รองรับ',
        description: 'รองรับเฉพาะ JPG, PNG, WEBP หรือ PDF',
        variant: 'destructive',
      });
      return;
    }

    if (f.size > MAX_FILE_SIZE) {
      toast({
        title: 'ไฟล์ใหญ่เกินไป',
        description: 'ขนาดไฟล์ต้องไม่เกิน 5 MB',
        variant: 'destructive',
      });
      return;
    }

    setFile(f);

    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({ title: 'กรุณาเข้าสู่ระบบ', variant: 'destructive' });
      return;
    }
    if (!file) {
      toast({ 
        title: 'ต้องแนบไฟล์หลักฐาน', 
        description: 'กรุณาแนบสลิปโอนเงิน ใบเสร็จ หรือหลักฐานการรับเงิน',
        variant: 'destructive',
      });
      return;
    }
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast({ title: 'กรุณาระบุจำนวนเงิน', variant: 'destructive' });
      return;
    }
    if (!paymentDate) {
      toast({ title: 'กรุณาระบุวันที่ได้รับเงิน', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${invoiceId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await (supabase as any).storage
        .from('payment-slips')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 2. Insert payment_record — status = verified (admin self-verification)
      const nowIso = new Date().toISOString();
      const payload: any = {
        invoice_id: invoiceId,
        amount: amountNum,
        payment_date: paymentDate,
        payment_method: paymentMethod,
        reference_number: referenceNumber || null,
        notes: notes || 'ยืนยันโดยแอดมิน (manual confirmation)',
        proof_url: fileName,
        proof_uploaded_at: nowIso,
        verification_status: 'verified',
        verified_by: user.id,
        verified_at: nowIso,
        created_by: user.id,
      };

      const { error: insertError } = await (supabase as any)
        .from('payment_records')
        .insert(payload);

      if (insertError) {
        // Cleanup uploaded file if insert failed
        await (supabase as any).storage.from('payment-slips').remove([fileName]);
        throw insertError;
      }

      // 3. Update invoice status → paid
      const { error: statusError } = await (supabase as any)
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', invoiceId);

      if (statusError) {
        // Don't rollback payment_record — it's legitimate audit data
        console.error('Failed to update invoice status:', statusError);
        toast({
          title: 'บันทึก payment แล้ว แต่อัปเดตสถานะไม่สำเร็จ',
          description: statusError.message,
          variant: 'destructive',
        });
        return;
      }

      // Notify customer about payment confirmation
      const { data: invData } = await (supabase as any)
        .from('invoices')
        .select('customer_id, customer_name, customer_email')
        .eq('id', invoiceId)
        .maybeSingle();

      if (invData?.customer_id) {
        import('@/lib/notifications').then(({ createNotification, sendTransactionalEmail }) => {
          createNotification({
            userId: invData.customer_id,
            type: 'payment_confirmed',
            title: 'ยืนยันการชำระเงินเรียบร้อย',
            message: `การชำระเงินสำหรับ ${invoiceNumber} ได้รับการยืนยันแล้ว`,
            priority: 'high',
            actionUrl: `/my-account/invoices/${invoiceId}`,
            actionLabel: 'ดูใบแจ้งหนี้',
            linkType: 'invoice',
            linkId: invoiceId,
          });
          if (invData.customer_email) {
            sendTransactionalEmail({
              templateName: 'payment-confirmed',
              recipientEmail: invData.customer_email,
              idempotencyKey: `payment-confirmed-${invoiceId}`,
              templateData: {
                customerName: invData.customer_name,
                invoiceNumber,
              },
            });
          }
        });
      }

      toast({
        title: '✅ ยืนยันการชำระเงินสำเร็จ',
        description: `${invoiceNumber} เปลี่ยนสถานะเป็น "ชำระแล้ว"`,
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

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            ยืนยันการชำระเงิน
          </DialogTitle>
          <DialogDescription>
            {invoiceNumber} • ยอด: ฿{formatCurrency(grandTotal)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning notice */}
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              <strong>จำเป็น:</strong> แนบหลักฐานการได้รับเงิน (สลิปโอน ใบเสร็จ ใบนำฝาก หรือ screenshot) 
              เพื่อใช้ในการตรวจสอบภายหลัง
            </p>
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              แนบไฟล์หลักฐาน <span className="text-red-500">*</span>
            </Label>

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">คลิกเพื่อเลือกไฟล์</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WEBP หรือ PDF (สูงสุด 5 MB)
                </p>
              </div>
            ) : (
              <div className="relative border border-border rounded-lg overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain bg-gray-50" />
                ) : (
                  <div className="p-4 flex items-center gap-3 bg-muted/40">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-7 w-7 p-0"
                  onClick={handleRemoveFile}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            />
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="confirm-amount" className="text-sm font-semibold">
                จำนวนเงิน (บาท) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirm-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-date" className="text-sm font-semibold">
                วันที่ได้รับเงิน <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirm-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Payment method */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">วิธีรับเงิน</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reference number */}
          <div className="space-y-2">
            <Label htmlFor="confirm-reference" className="text-sm font-semibold">
              เลขอ้างอิง (ถ้ามี)
            </Label>
            <Input
              id="confirm-reference"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="เช่น เลขอ้างอิงการโอน, เลขเช็ค"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="confirm-notes" className="text-sm font-semibold">
              หมายเหตุ (ถ้ามี)
            </Label>
            <Textarea
              id="confirm-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น รับเงินสดจากลูกค้า, โอนผ่าน LINE แจ้ง..."
              rows={2}
            />
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 p-3 rounded border border-green-200">
            <CircleCheckBig className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              หลังจากยืนยันแล้ว ใบวางบิลจะเปลี่ยนสถานะเป็น <strong>"ชำระแล้ว"</strong> 
              และจะมีบันทึก audit trail ว่าคุณเป็นผู้ยืนยัน
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            ยกเลิก
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || !file}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

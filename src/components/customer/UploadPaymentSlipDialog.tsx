import { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  Upload, Loader2, ImageIcon, X, CircleCheckBig, AlertCircle, Banknote, Hourglass,
  FileCheck, TriangleAlert,
} from 'lucide-react';

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  branch: string | null;
  is_default: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceNumber: string;
  grandTotal: number;
  existingPendingCount?: number;
  existingVerifiedTotal?: number;
  existingPendingTotal?: number;
  onSuccess?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export default function UploadPaymentSlipDialog({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber,
  grandTotal,
  existingPendingCount,
  existingVerifiedTotal = 0,
  existingPendingTotal = 0,
  onSuccess,
}: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');

  // Overpayment confirm dialog
  const [overpaymentDialog, setOverpaymentDialog] = useState(false);
  const [overpaymentInfo, setOverpaymentInfo] = useState<{
    newTotal: number;
    overpayBy: number;
  } | null>(null);

  const [amount, setAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bankAccountId, setBankAccountId] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);

  // Load bank accounts + prefill amount
  useEffect(() => {
    if (!open) return;

    const loadBanks = async () => {
      setLoadingBanks(true);
      try {
        const { data, error } = await (supabase as any)
          .from('company_bank_accounts')
          .select('id, bank_name, account_number, account_name, branch, is_default')
          .eq('is_active', true)
          .order('display_order');
        if (error) throw error;
        setBankAccounts(data || []);
        const defaultBank = data?.find((b: any) => b.is_default);
        if (defaultBank) setBankAccountId(defaultBank.id);
        else if (data?.length) setBankAccountId(data[0].id);
      } catch (e: any) {
        toast({
          title: 'โหลดบัญชีธนาคารไม่สำเร็จ',
          description: e.message,
          variant: 'destructive',
        });
      } finally {
        setLoadingBanks(false);
      }
    };
    loadBanks();

    // Prefill amount with grand_total
    setAmount(String(grandTotal || ''));
  }, [open, grandTotal, toast]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreviewUrl('');
      setFileError('');
      setAmount('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setReferenceNumber('');
      setNotes('');
      setOverpaymentDialog(false);
      setOverpaymentInfo(null);
    }
  }, [open]);

  const handleFileSelect = (f: File | null) => {
    if (!f) return;
    setFileError('');

    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError('รองรับเฉพาะไฟล์ JPG, PNG, WEBP หรือ PDF เท่านั้น');
      return;
    }

    if (f.size > MAX_FILE_SIZE) {
      setFileError(`ไฟล์ขนาด ${(f.size / 1024 / 1024).toFixed(1)} MB เกินขีดจำกัด 5 MB`);
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
      setFileError('กรุณาเลือกไฟล์สลิปก่อนส่ง');
      return;
    }
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast({ title: 'กรุณาระบุจำนวนเงิน', variant: 'destructive' });
      return;
    }
    if (!paymentDate) {
      toast({ title: 'กรุณาระบุวันที่โอน', variant: 'destructive' });
      return;
    }

    // Phase 8.1: Warn on overpayment — use themed AlertDialog
    const newTotal = existingVerifiedTotal + existingPendingTotal + amountNum;
    if (newTotal > grandTotal + 0.01) {
      setOverpaymentInfo({ newTotal, overpayBy: newTotal - grandTotal });
      setOverpaymentDialog(true);
      return;
    }

    await doSubmit(amountNum);
  };

  const doSubmit = async (amountNum: number) => {
    if (!user?.id || !file) return;

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

      // 2. Get selected bank info (denormalized)
      const selectedBank = bankAccounts.find((b) => b.id === bankAccountId);

      // 3. Insert payment_record
      const payload: any = {
        invoice_id: invoiceId,
        amount: amountNum,
        payment_date: paymentDate,
        payment_method: 'bank_transfer',
        bank_name: selectedBank?.bank_name || null,
        bank_account: selectedBank?.account_number || null,
        reference_number: referenceNumber || null,
        notes: notes || null,
        proof_url: fileName,
        proof_uploaded_at: new Date().toISOString(),
        verification_status: 'pending',
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

      // 🔔 Notify all admins (in-app + email) — fire-and-forget via dispatcher
      import('@/lib/notifications').then(({ dispatchNotification }) => {
        const amountStr = new Intl.NumberFormat('th-TH', {
          minimumFractionDigits: 2, maximumFractionDigits: 2,
        }).format(amountNum);

        dispatchNotification({
          eventKey: 'payment.slip_uploaded',
          recipientRole: 'admin',
          title: 'ลูกค้าส่งสลิปการชำระเงินใหม่',
          message: `${invoiceNumber} • ฿${amountStr} • รอการตรวจสอบ`,
          priority: 'high',
          actionUrl: `/admin/invoices/${invoiceId}`,
          actionLabel: 'ตรวจสอบสลิป',
          linkType: 'invoice',
          linkId: invoiceId,
          entityType: 'invoice',
          entityId: invoiceId,
          quoteNumber: invoiceNumber,
          invoiceNumber,
          amount: amountStr,
          viewUrl: `https://www.entgroup.co.th/admin/invoices/${invoiceId}`,
          note: notes || undefined,
        });
      });

      toast({
        title: '✅ ส่งสลิปสำเร็จ',
        description: 'ทีมงานกำลังตรวจสอบการชำระเงินของคุณ',
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      toast({
        title: 'ส่งสลิปไม่สำเร็จ',
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
    <>
      {/* Overpayment confirmation AlertDialog */}
      <AlertDialog open={overpaymentDialog} onOpenChange={setOverpaymentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
              <TriangleAlert className="w-5 h-5" />
              ยอดชำระเกินใบวางบิล
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">ยอดรวมทั้งหมดจะเกินยอดในใบวางบิล กรุณาตรวจสอบก่อนยืนยัน</p>
                <div className="rounded-lg border bg-muted/40 p-3 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ยอดใบวางบิล</span>
                    <span>฿{formatCurrency(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>โอนแล้ว (verified + pending)</span>
                    <span>฿{formatCurrency(existingVerifiedTotal + existingPendingTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ยอดที่กำลังส่ง</span>
                    <span>฿{formatCurrency(parseFloat(amount) || 0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1.5 mt-1">
                    <span>รวมใหม่ทั้งหมด</span>
                    <span className="text-amber-600">฿{formatCurrency(overpaymentInfo?.newTotal ?? 0)}</span>
                  </div>
                </div>
                <p className="text-amber-700 dark:text-amber-400 font-medium">
                  เกินยอด ฿{formatCurrency(overpaymentInfo?.overpayBy ?? 0)} — ต้องการส่งต่อหรือไม่?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOverpaymentDialog(false)}>
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => {
                setOverpaymentDialog(false);
                doSubmit(parseFloat(amount));
              }}
            >
              ยืนยัน ส่งสลิป
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            อัปโหลดสลิปการโอนเงิน
          </DialogTitle>
          <DialogDescription>
            {invoiceNumber} • ยอดที่ต้องชำระ: ฿{formatCurrency(grandTotal)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Phase 8.1: Payment progress display */}
          {(existingVerifiedTotal > 0 || existingPendingTotal > 0) && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded text-xs space-y-1">
              <p className="font-semibold text-blue-900 dark:text-blue-300">
                📊 สถานะการชำระเงิน
              </p>
              <div className="flex justify-between text-blue-800 dark:text-blue-400">
                <span>ยอดใบวางบิล:</span>
                <span className="font-mono">฿{grandTotal.toLocaleString()}</span>
              </div>
              {existingVerifiedTotal > 0 && (
                <div className="flex justify-between text-green-700 dark:text-green-400">
                  <span>โอนแล้ว (verified):</span>
                  <span className="font-mono">฿{existingVerifiedTotal.toLocaleString()}</span>
                </div>
              )}
              {existingPendingTotal > 0 && (
                <div className="flex justify-between text-amber-700 dark:text-amber-400">
                  <span>รอตรวจสอบ (pending):</span>
                  <span className="font-mono">฿{existingPendingTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-1 border-t border-blue-300 dark:border-blue-700">
                <span>คงเหลือ:</span>
                <span className="font-mono">
                  ฿{Math.max(0, grandTotal - existingVerifiedTotal - existingPendingTotal).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Warning if pending exists */}
          {existingPendingCount && existingPendingCount > 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg">
              <div className="flex items-start gap-2">
                <Hourglass className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 text-sm">
                    คุณมีสลิปรอตรวจสอบอยู่แล้ว ({existingPendingCount} รายการ)
                  </p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    หากต้องการส่งสลิปเพิ่มเติม (เช่น การชำระแบ่งจ่าย) สามารถดำเนินการต่อได้
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    หากต้องการยกเลิกสลิปเก่า กรุณาติดต่อแอดมิน
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* File upload */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              ภาพสลิป <span className="text-destructive">*</span>
            </Label>

            {!file ? (
              <div
                onClick={() => { fileInputRef.current?.click(); setFileError(''); }}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  fileError
                    ? 'border-destructive bg-destructive/5 hover:bg-destructive/10'
                    : 'border-border hover:border-primary hover:bg-muted/40'
                }`}
              >
                <Upload className={`w-8 h-8 mx-auto mb-2 ${fileError ? 'text-destructive' : 'text-muted-foreground'}`} />
                <p className="text-sm font-medium">คลิกเพื่อเลือกไฟล์</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WEBP หรือ PDF (สูงสุด 5 MB)
                </p>
              </div>
            ) : (
              <div className="relative border border-green-300 dark:border-green-700 rounded-lg overflow-hidden ring-1 ring-green-200 dark:ring-green-800">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain bg-muted/30"  loading="lazy" decoding="async"/>
                ) : (
                  <div className="p-4 flex items-center gap-3 bg-muted/40">
                    <FileCheck className="w-8 h-8 text-green-600" />
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
            {fileError && (
              <p className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {fileError}
              </p>
            )}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">
                จำนวนเงิน (บาท) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-date" className="text-sm font-semibold">
                วันที่โอน <span className="text-destructive">*</span>
              </Label>
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Bank account */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">โอนเข้าบัญชี</Label>
            {loadingBanks ? (
              <div className="h-10 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังโหลด...
              </div>
            ) : bankAccounts.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-amber-600 p-2 bg-amber-50 rounded border border-amber-200">
                <AlertCircle className="w-4 h-4" />
                ยังไม่มีบัญชีธนาคารในระบบ
              </div>
            ) : (
              <Select value={bankAccountId} onValueChange={setBankAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกบัญชี" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.bank_name} — {bank.account_number}
                      {bank.is_default && ' ⭐'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Reference number */}
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-sm font-semibold">
              เลขอ้างอิงการโอน (ถ้ามี)
            </Label>
            <Input
              id="reference"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="เช่น เลขอ้างอิงในแอป"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-semibold">
              หมายเหตุ (ถ้ามี)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ข้อมูลเพิ่มเติม..."
              rows={2}
            />
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 p-3 rounded border border-blue-200">
            <CircleCheckBig className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              หลังจากอัปโหลด ทีมงานจะตรวจสอบและยืนยันการชำระเงินภายใน 1-2 วันทำการ
              คุณจะเห็นสถานะอัปเดตในหน้าใบวางบิลนี้
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !file}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                กำลังส่ง...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-1.5" />
                ส่งสลิป
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

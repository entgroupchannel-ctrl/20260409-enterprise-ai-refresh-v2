import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle2, Gift } from 'lucide-react';

interface AcceptQuoteDialogProps {
  quoteId: string;
  quoteNumber: string;
  grandTotal: number;
  freeItems?: any[];
  validUntil?: string | null;
  currentRevisionId?: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

export default function AcceptQuoteDialog({
  quoteId,
  quoteNumber,
  grandTotal,
  freeItems = [],
  validUntil,
  currentRevisionId,
  open,
  onClose,
  onSuccess,
}: AcceptQuoteDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleAccept = async () => {
    if (!accepted) {
      toast({ title: 'กรุณายอมรับเงื่อนไข', variant: 'destructive' });
      return;
    }

    setProcessing(true);
    try {
      await supabase.from('quote_requests').update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        accepted_by: user?.id || null,
      } as any).eq('id', quoteId);

      // Update current revision by ID (not by status filter)
      if (currentRevisionId) {
        await (supabase.from as any)('quote_revisions')
          .update({ status: 'accepted', responded_at: new Date().toISOString() })
          .eq('id', currentRevisionId);

        // Supersede any other 'sent' revisions
        await (supabase.from as any)('quote_revisions')
          .update({ status: 'superseded' })
          .eq('quote_id', quoteId)
          .eq('status', 'sent')
          .neq('id', currentRevisionId);
      }

      // Send chat message
      await supabase.from('quote_messages').insert({
        quote_id: quoteId,
        sender_name: user?.email || 'ลูกค้า',
        sender_role: 'customer',
        content: '✅ ยอมรับใบเสนอราคาแล้ว — พร้อมอัปโหลด PO',
        message_type: 'status_change',
      });

      toast({
        title: 'ยอมรับราคาสำเร็จ',
        description: 'ขั้นตอนต่อไป: อัปโหลดใบสั่งซื้อ (PO)',
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            ยืนยันยอมรับราคา
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>คุณกำลังยอมรับใบเสนอราคา <strong>{quoteNumber}</strong></p>

              <div className="bg-muted rounded-lg p-3 space-y-1">
                <div className="flex justify-between font-bold text-foreground">
                  <span>ยอดรวมทั้งสิ้น</span>
                  <span className="text-primary">{formatCurrency(grandTotal)}</span>
                </div>
                {freeItems.length > 0 && (
                  <div className="flex items-center gap-1 text-amber-600 text-xs">
                    <Gift className="w-3 h-3" />
                    + ของแถม {freeItems.length} รายการ
                  </div>
                )}
                {validUntil && (
                  <p className="text-xs text-muted-foreground">ใช้ได้ถึง: {validUntil}</p>
                )}
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="accept-terms"
                  checked={accepted}
                  onCheckedChange={(v) => setAccepted(!!v)}
                />
                <Label htmlFor="accept-terms" className="text-sm cursor-pointer leading-tight">
                  ยืนยันว่าข้าพเจ้าได้ตรวจสอบรายการสินค้า ราคา และเงื่อนไขแล้ว ยอมรับใบเสนอราคานี้
                </Label>
              </div>

              <p className="text-xs text-muted-foreground">
                หลังจากยอมรับ คุณจะสามารถอัปโหลดใบสั่งซื้อ (PO) ได้ในหน้าถัดไป
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept} disabled={processing || !accepted}>
            {processing ? 'กำลังดำเนินการ...' : '✅ ยืนยันยอมรับ'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

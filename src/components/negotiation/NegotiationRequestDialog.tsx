import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Send, MessageSquare } from 'lucide-react';

interface NegotiationRequestDialogProps {
  quoteId: string;
  currentRevisionId?: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NegotiationRequestDialog({
  quoteId,
  currentRevisionId,
  open,
  onClose,
  onSuccess,
}: NegotiationRequestDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const [requestTypes, setRequestTypes] = useState<Record<string, boolean>>({
    discount: false,
    free_items: false,
    spec_change: false,
    payment_terms: false,
    other: false,
  });

  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [freeItemsText, setFreeItemsText] = useState('');
  const [specChangeText, setSpecChangeText] = useState('');
  const [paymentTermsText, setPaymentTermsText] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const toggleType = (type: string) => {
    setRequestTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const getRequestType = () => {
    const active = Object.entries(requestTypes).filter(([_, v]) => v).map(([k]) => k);
    return active.length > 0 ? active[0] : 'other';
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({ title: 'กรุณาระบุข้อความ', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      // Build free items array from text
      const requestedFreeItems = freeItemsText.trim()
        ? [{ description: freeItemsText, qty: 1 }]
        : [];

      // Build full message
      const parts: string[] = [];
      if (requestTypes.discount) {
        if (discountPercent) parts.push(`ขอลดราคา ${discountPercent}%`);
        if (discountAmount) parts.push(`ขอลดเหลือ ฿${discountAmount}`);
      }
      if (requestTypes.free_items) parts.push(`ขอของแถม: ${freeItemsText}`);
      if (requestTypes.spec_change) parts.push(`ขอเปลี่ยนสเปก: ${specChangeText}`);
      if (requestTypes.payment_terms) parts.push(`ขอเปลี่ยนเงื่อนไข: ${paymentTermsText}`);
      parts.push(message);

      const fullMessage = parts.join('\n');

      // Insert negotiation request
      await (supabase.from as any)('quote_negotiation_requests').insert({
        quote_id: quoteId,
        revision_id: currentRevisionId || null,
        requested_by: user?.id || null,
        requested_by_role: 'customer',
        request_type: getRequestType(),
        requested_discount_percent: discountPercent ? parseFloat(discountPercent) : null,
        requested_discount_amount: discountAmount ? parseFloat(discountAmount) : null,
        requested_free_items: requestedFreeItems,
        message: fullMessage,
        status: 'pending',
      });

      // Read current negotiation_count then increment
      const { data: currentQuote } = await supabase
        .from('quote_requests')
        .select('negotiation_count')
        .eq('id', quoteId)
        .single();

      const currentCount = (currentQuote as any)?.negotiation_count || 0;

      // Update quote status to negotiating
      await supabase.from('quote_requests').update({
        status: 'negotiating',
        negotiation_count: currentCount + 1,
      } as any).eq('id', quoteId);

      // Send chat message
      await supabase.from('quote_messages').insert({
        quote_id: quoteId,
        sender_name: user?.email || 'ลูกค้า',
        sender_role: 'customer',
        content: `💬 ขอต่อรองราคา — ${fullMessage}`,
        message_type: 'negotiation',
      });

      toast({ title: 'ส่งคำขอต่อรองสำเร็จ', description: 'ทีมขายจะตอบกลับโดยเร็ว' });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            ขอต่อรองราคา
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">คุณต้องการขออะไรจากเรา? (เลือกได้หลายข้อ)</p>

          {/* Discount */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={requestTypes.discount}
                onCheckedChange={() => toggleType('discount')}
                id="req-discount"
              />
              <Label htmlFor="req-discount" className="text-sm font-medium cursor-pointer">ขอลดราคา</Label>
            </div>
            {requestTypes.discount && (
              <div className="ml-6 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">ลด (%)</Label>
                  <Input
                    type="number"
                    placeholder="เช่น 10"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">หรือเหลือ (บาท)</Label>
                  <Input
                    type="number"
                    placeholder="เช่น 100000"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Free items */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={requestTypes.free_items}
                onCheckedChange={() => toggleType('free_items')}
                id="req-free"
              />
              <Label htmlFor="req-free" className="text-sm font-medium cursor-pointer">ขอของแถม</Label>
            </div>
            {requestTypes.free_items && (
              <Input
                className="ml-6"
                placeholder="เช่น เมาส์ 5 ตัว, keyboard 2 ชุด"
                value={freeItemsText}
                onChange={(e) => setFreeItemsText(e.target.value)}
              />
            )}
          </div>

          {/* Spec change */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={requestTypes.spec_change}
                onCheckedChange={() => toggleType('spec_change')}
                id="req-spec"
              />
              <Label htmlFor="req-spec" className="text-sm font-medium cursor-pointer">ขอเปลี่ยนสเปก</Label>
            </div>
            {requestTypes.spec_change && (
              <Input
                className="ml-6"
                placeholder="เช่น อัปเกรดเป็น RAM 16GB"
                value={specChangeText}
                onChange={(e) => setSpecChangeText(e.target.value)}
              />
            )}
          </div>

          {/* Payment terms */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={requestTypes.payment_terms}
                onCheckedChange={() => toggleType('payment_terms')}
                id="req-payment"
              />
              <Label htmlFor="req-payment" className="text-sm font-medium cursor-pointer">ขอเปลี่ยนเงื่อนไขชำระเงิน</Label>
            </div>
            {requestTypes.payment_terms && (
              <Input
                className="ml-6"
                placeholder="เช่น Credit 60 วัน"
                value={paymentTermsText}
                onChange={(e) => setPaymentTermsText(e.target.value)}
              />
            )}
          </div>

          <Textarea
            placeholder="ข้อความเพิ่มเติม (จำเป็น) *"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={sending}>ยกเลิก</Button>
          <Button onClick={handleSubmit} disabled={sending || !message.trim()}>
            <Send className="w-4 h-4 mr-1" />
            {sending ? 'กำลังส่ง...' : 'ส่งคำขอต่อรอง'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

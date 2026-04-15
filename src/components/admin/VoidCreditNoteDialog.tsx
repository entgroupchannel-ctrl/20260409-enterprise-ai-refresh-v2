import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditNoteId: string;
  creditNoteNumber: string;
  onSuccess?: () => void;
}

export default function VoidCreditNoteDialog({
  open, onOpenChange, creditNoteId, creditNoteNumber, onSuccess
}: Props) {
  const { toast } = useToast();
  const [voidReason, setVoidReason] = useState('');
  const [saving, setSaving] = useState(false);

  const handleVoid = async () => {
    if (!voidReason.trim()) {
      toast({ title: 'กรุณาระบุเหตุผลการยกเลิก', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role !== 'super_admin') {
        throw new Error('เฉพาะ super_admin เท่านั้นที่สามารถยกเลิกใบลดหนี้ได้');
      }

      const { error } = await (supabase as any)
        .from('credit_notes')
        .update({
          status: 'voided',
          voided_at: new Date().toISOString(),
          voided_by: user.id,
          void_reason: voidReason.trim(),
        })
        .eq('id', creditNoteId);

      if (error) throw error;

      toast({ title: '✅ ยกเลิกใบลดหนี้แล้ว' });
      onOpenChange(false);
      setVoidReason('');
      if (onSuccess) onSuccess();
    } catch (e: any) {
      toast({ title: 'ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ยกเลิกใบลดหนี้ {creditNoteNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm">
              การยกเลิกไม่สามารถกลับคืนได้ ใบลดหนี้จะยังคงอยู่ในระบบแต่จะไม่มีผลทางบัญชี
              <br/>เฉพาะ <strong>super_admin</strong> เท่านั้น
            </p>
          </div>
          <div>
            <Label>เหตุผลการยกเลิก <span className="text-destructive">*</span></Label>
            <Textarea
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              placeholder="ระบุเหตุผลอย่างชัดเจน"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>ปิด</Button>
          <Button variant="destructive" onClick={handleVoid} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            ยืนยันยกเลิก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

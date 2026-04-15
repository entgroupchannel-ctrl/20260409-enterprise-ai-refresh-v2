import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrationId: string;
  serialNumber: string;
  onSuccess?: () => void;
}

export default function VoidRegistrationDialog({ open, onOpenChange, registrationId, serialNumber, onSuccess }: Props) {
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const handleVoid = async () => {
    if (!reason.trim()) { toast({ title: 'กรุณาระบุเหตุผล', variant: 'destructive' }); return; }

    setSaving(true);
    try {
      const { data, error } = await (supabase as any).rpc('void_registered_product', {
        p_id: registrationId,
        p_reason: reason.trim(),
      });

      if (error) throw error;
      if (data && !data.success) {
        toast({ title: 'ไม่สำเร็จ', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: '✅ ยกเลิกการลงทะเบียนสำเร็จ' });
      setReason('');
      onOpenChange(false);
      onSuccess?.();
    } catch (e: any) {
      toast({ title: 'ผิดพลาด', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            ยกเลิกการลงทะเบียน
          </DialogTitle>
          <DialogDescription>
            ยกเลิกการลงทะเบียน SN: <strong className="font-mono">{serialNumber}</strong> — การกระทำนี้ไม่สามารถย้อนกลับได้
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Label>เหตุผล <span className="text-destructive">*</span></Label>
          <Textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="ระบุเหตุผลที่ต้องยกเลิก..." />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>ปิด</Button>
          <Button variant="destructive" onClick={handleVoid} disabled={saving || !reason.trim()}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            ยืนยันยกเลิก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Props {
  repairOrder: any;
  onUpdated: () => void;
}

export default function RepairDiagnosisForm({ repairOrder, onUpdated }: Props) {
  const { toast } = useToast();
  const [diagnosis, setDiagnosis] = useState(repairOrder.diagnosis || '');
  const [rootCause, setRootCause] = useState(repairOrder.root_cause || '');
  const [saving, setSaving] = useState(false);

  const saveDiagnosis = async () => {
    setSaving(true);
    const { error } = await (supabase as any)
      .from('repair_orders')
      .update({ diagnosis, root_cause: rootCause, updated_at: new Date().toISOString() })
      .eq('id', repairOrder.id);
    if (error) {
      toast({ title: 'บันทึกล้มเหลว', variant: 'destructive' });
    } else {
      toast({ title: 'บันทึกการวินิจฉัยแล้ว' });
      onUpdated();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>ผลการวินิจฉัย</Label>
        <Textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={3} placeholder="อธิบายผลการตรวจสอบ..." />
      </div>
      <div>
        <Label>สาเหตุ</Label>
        <Textarea value={rootCause} onChange={e => setRootCause(e.target.value)} rows={2} placeholder="สาเหตุหลักของปัญหา..." />
      </div>
      <Button onClick={saveDiagnosis} disabled={saving} size="sm">
        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
        บันทึกการวินิจฉัย
      </Button>
    </div>
  );
}

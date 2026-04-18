import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Video } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Props { supplierId: string }

const CHECKLIST = [
  { key: 'company_intro_done',     label: 'Company intro & ownership verified' },
  { key: 'live_factory_tour_done', label: 'Live factory tour (workers visible)' },
  { key: 'qc_area_shown',          label: 'QC / testing area shown' },
  { key: 'warehouse_shown',        label: 'Warehouse with inventory shown' },
  { key: 'tech_questions_passed',  label: 'Technical questions answered' },
  { key: 'commercial_discussed',   label: 'Pricing & payment terms discussed' },
];

export default function SupplierVideoCallLog({ supplierId }: Props) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calls, setCalls] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    call_date: '', duration_minutes: '', participants: '',
    overall_assessment: '', red_flags: '', notes: '',
    company_intro_done: false, live_factory_tour_done: false, qc_area_shown: false,
    warehouse_shown: false, tech_questions_passed: false, commercial_discussed: false,
    decision: '',
  });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('supplier_video_calls')
      .select('*').eq('supplier_id', supplierId).order('call_date', { ascending: false });
    setCalls(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [supplierId]);

  const save = async () => {
    if (!form.call_date) { toast.error('กรุณาระบุวันที่'); return; }
    setSaving(true);
    const payload: any = {
      supplier_id: supplierId,
      conducted_by: profile?.id ?? null,
      call_date: form.call_date,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      participants: form.participants || null,
      overall_assessment: form.overall_assessment || null,
      red_flags: form.red_flags || null,
      notes: form.notes || null,
      decision: form.decision || null,
      ...Object.fromEntries(CHECKLIST.map(c => [c.key, !!form[c.key]])),
    };
    const { error } = await supabase.from('supplier_video_calls').insert(payload);
    if (error) toast.error('บันทึกล้มเหลว: ' + error.message);
    else {
      toast.success('บันทึก Video Call แล้ว');
      setForm({
        call_date: '', duration_minutes: '', participants: '',
        overall_assessment: '', red_flags: '', notes: '',
        company_intro_done: false, live_factory_tour_done: false, qc_area_shown: false,
        warehouse_shown: false, tech_questions_passed: false, commercial_discussed: false,
        decision: '',
      });
      load();
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  const f = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Video className="w-4 h-4" /> บันทึก Video Call ใหม่</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">วันที่</Label>
              <Input type="date" value={form.call_date} onChange={e => f('call_date', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">ระยะเวลา (นาที)</Label>
              <Input type="number" value={form.duration_minutes} onChange={e => f('duration_minutes', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">ผู้เข้าร่วม</Label>
              <Input value={form.participants} onChange={e => f('participants', e.target.value)} placeholder="Sales / Engineer / Owner" />
            </div>
          </div>

          <div>
            <Label className="text-xs">Checklist</Label>
            <div className="grid md:grid-cols-2 gap-2 mt-1">
              {CHECKLIST.map(c => (
                <label key={c.key} className="flex items-center gap-2 text-sm border rounded p-2">
                  <input type="checkbox" checked={!!form[c.key]} onChange={e => f(c.key, e.target.checked)} />
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">การประเมินรวม</Label>
            <Textarea rows={2} value={form.overall_assessment} onChange={e => f('overall_assessment', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Red Flags ที่พบ</Label>
            <Textarea rows={2} value={form.red_flags} onChange={e => f('red_flags', e.target.value)} placeholder="คั่นด้วย ;" />
          </div>
          <div>
            <Label className="text-xs">Decision</Label>
            <Input value={form.decision} onChange={e => f('decision', e.target.value)} placeholder="proceed / request more info / disqualify" />
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={e => f('notes', e.target.value)} />
          </div>

          <div className="flex justify-end">
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
              บันทึก
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">ประวัติ Video Calls ({calls.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {calls.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">ยังไม่มี video call</p>
          ) : calls.map(c => {
            const passed = CHECKLIST.filter(k => c[k.key]).length;
            return (
              <div key={c.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{format(new Date(c.call_date), 'dd MMM yyyy')}</span>
                    {c.duration_minutes && <Badge variant="outline">{c.duration_minutes} นาที</Badge>}
                    <Badge variant="outline">{passed}/{CHECKLIST.length} checklist</Badge>
                  </div>
                  {c.decision && <Badge>{c.decision}</Badge>}
                </div>
                {c.overall_assessment && <p className="text-xs text-muted-foreground">{c.overall_assessment}</p>}
                {c.red_flags && <p className="text-xs text-destructive mt-1">⚠ {c.red_flags}</p>}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

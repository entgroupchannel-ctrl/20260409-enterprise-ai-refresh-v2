import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Props { supplierId: string }

const DIMENSIONS = [
  { key: 'response_speed_score',   label: 'Response speed',         hint: '<24h=5, 48-72h=3, >5d=1' },
  { key: 'manufacturer_proof_score', label: 'Manufacturer proof',  hint: 'License + photos' },
  { key: 'experience_score',       label: 'Experience',             hint: '10y+=5, 5-10=3, <5=1' },
  { key: 'certifications_score',   label: 'Certifications',         hint: 'ISO + product certs' },
  { key: 'export_experience_score', label: 'Export experience',    hint: '30+ countries=5' },
  { key: 'oem_flexibility_score',  label: 'OEM flexibility',        hint: 'HW+SW=5, label=1' },
  { key: 'communication_score',    label: 'Communication',          hint: 'EN + technical depth' },
  { key: 'docs_quality_score',     label: 'Photos & docs',          hint: 'Quality + detail' },
] as const;

export default function SupplierScoringMatrix({ supplierId }: Props) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('supplier_scores')
        .select('*').eq('supplier_id', supplierId)
        .order('created_at', { ascending: false });
      setHistory(data ?? []);
      setLoading(false);
    })();
  }, [supplierId]);

  const setScore = (key: string, val: number) => setScores({ ...scores, [key]: val });

  const filledCount = Object.keys(scores).filter(k => scores[k] != null).length;
  const avg = filledCount > 0
    ? (Object.values(scores).reduce((s, v) => s + (v || 0), 0) / filledCount)
    : 0;

  const save = async () => {
    if (filledCount < DIMENSIONS.length) {
      toast.error('กรุณาให้คะแนนครบทั้ง 8 ข้อ');
      return;
    }
    setSaving(true);
    const payload: any = {
      supplier_id: supplierId,
      scored_by: profile?.id ?? null,
      notes: notes || null,
      ...scores,
    };
    const { error } = await supabase.from('supplier_scores').insert(payload);
    if (error) toast.error('บันทึกล้มเหลว: ' + error.message);
    else {
      toast.success('บันทึกคะแนนแล้ว');
      setScores({}); setNotes('');
      const { data } = await supabase.from('supplier_scores')
        .select('*').eq('supplier_id', supplierId).order('created_at', { ascending: false });
      setHistory(data ?? []);
    }
    setSaving(false);
  };

  const passThreshold = avg >= 3.5;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-4 h-4" /> Scoring Matrix (8 มิติ)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {DIMENSIONS.map(dim => (
              <div key={dim.key} className="grid grid-cols-12 gap-2 items-center py-2 border-b last:border-0">
                <div className="col-span-5">
                  <p className="text-sm font-medium">{dim.label}</p>
                  <p className="text-[11px] text-muted-foreground">{dim.hint}</p>
                </div>
                <div className="col-span-7 flex gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setScore(dim.key, n)}
                      className={`flex-1 h-9 rounded border text-sm font-semibold transition ${
                        scores[dim.key] === n
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filledCount > 0 && (
            <div className={`rounded-lg border p-3 flex items-center justify-between ${passThreshold ? 'bg-accent/30 border-accent' : 'bg-muted border-border'}`}>
              <div>
                <p className="text-xs text-muted-foreground">คะแนนเฉลี่ย ({filledCount}/8)</p>
                <p className="text-2xl font-bold">{avg.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ 5</span></p>
              </div>
              <div>
                {passThreshold ? (
                  <Badge className="bg-primary text-primary-foreground"><CheckCircle2 className="w-3 h-3 mr-1" />ผ่าน Threshold (≥3.5)</Badge>
                ) : (
                  <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />ต่ำกว่า Threshold</Badge>
                )}
              </div>
            </div>
          )}

          <div>
            <Label className="text-xs">หมายเหตุประกอบการให้คะแนน</Label>
            <Textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <div className="flex justify-end">
            <Button onClick={save} disabled={saving || filledCount < DIMENSIONS.length}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
              บันทึกคะแนน
            </Button>
          </div>
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">ประวัติการให้คะแนน ({history.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {history.map(h => (
              <div key={h.id} className="flex items-center justify-between text-sm border-b last:border-0 py-2">
                <div>
                  <p className="font-medium">เฉลี่ย {Number(h.average_score).toFixed(2)} / 5</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(h.created_at), 'dd MMM yyyy HH:mm')}</p>
                </div>
                <Badge variant={Number(h.average_score) >= 3.5 ? 'default' : 'outline'}>
                  {Number(h.average_score) >= 3.5 ? 'ผ่าน' : 'ไม่ผ่าน'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

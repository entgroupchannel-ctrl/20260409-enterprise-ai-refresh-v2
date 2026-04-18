import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Package, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Props { supplierId: string }

const SAMPLE_CHECKLIST = [
  { key: 'arrived_intact', label: 'ถึงปลายทางสมบูรณ์' },
  { key: 'matches_specs',  label: 'ตรงตาม datasheet' },
  { key: 'quality_acceptable', label: 'คุณภาพยอมรับได้' },
  { key: 'docs_complete',  label: 'เอกสาร/manual ครบ' },
  { key: 'thai_compatible', label: 'เหมาะกับตลาดไทย' },
  { key: 'burn_in_passed', label: 'ผ่าน burn-in 72h' },
];

export default function SupplierSamplePilotPanel({ supplierId }: Props) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [samples, setSamples] = useState<any[]>([]);
  const [pilots, setPilots] = useState<any[]>([]);

  const [sampleForm, setSampleForm] = useState<any>({
    product_model: '', quantity: '', shipping_method: '', tracking_number: '',
    received_date: '', evaluation_score: '', notes: '',
    arrived_intact: false, matches_specs: false, quality_acceptable: false,
    docs_complete: false, thai_compatible: false, burn_in_passed: false,
    decision: '',
  });

  const [pilotForm, setPilotForm] = useState<any>({
    po_reference: '', quantity: '', total_value_usd: '',
    delivery_on_time: false, quality_consistent: false, support_responsive: false,
    sell_through_rate: '', customer_feedback: '', overall_outcome: '', notes: '',
  });

  const load = async () => {
    setLoading(true);
    const [sRes, pRes] = await Promise.all([
      supabase.from('supplier_sample_evaluations').select('*').eq('supplier_id', supplierId).order('created_at', { ascending: false }),
      supabase.from('supplier_pilot_reviews').select('*').eq('supplier_id', supplierId).order('created_at', { ascending: false }),
    ]);
    setSamples(sRes.data ?? []);
    setPilots(pRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [supplierId]);

  const saveSample = async () => {
    if (!sampleForm.product_model) { toast.error('กรุณากรอก product model'); return; }
    const payload: any = {
      supplier_id: supplierId,
      evaluated_by: profile?.id ?? null,
      product_model: sampleForm.product_model,
      quantity: sampleForm.quantity ? Number(sampleForm.quantity) : null,
      shipping_method: sampleForm.shipping_method || null,
      tracking_number: sampleForm.tracking_number || null,
      received_date: sampleForm.received_date || null,
      evaluation_score: sampleForm.evaluation_score ? Number(sampleForm.evaluation_score) : null,
      notes: sampleForm.notes || null,
      decision: sampleForm.decision || null,
      ...Object.fromEntries(SAMPLE_CHECKLIST.map(c => [c.key, !!sampleForm[c.key]])),
    };
    const { error } = await supabase.from('supplier_sample_evaluations').insert(payload);
    if (error) toast.error('บันทึกล้มเหลว: ' + error.message);
    else {
      toast.success('บันทึก sample evaluation แล้ว');
      setSampleForm({
        product_model: '', quantity: '', shipping_method: '', tracking_number: '',
        received_date: '', evaluation_score: '', notes: '',
        arrived_intact: false, matches_specs: false, quality_acceptable: false,
        docs_complete: false, thai_compatible: false, burn_in_passed: false, decision: '',
      });
      load();
    }
  };

  const savePilot = async () => {
    const payload: any = {
      supplier_id: supplierId,
      reviewed_by: profile?.id ?? null,
      po_reference: pilotForm.po_reference || null,
      quantity: pilotForm.quantity ? Number(pilotForm.quantity) : null,
      total_value_usd: pilotForm.total_value_usd ? Number(pilotForm.total_value_usd) : null,
      delivery_on_time: !!pilotForm.delivery_on_time,
      quality_consistent: !!pilotForm.quality_consistent,
      support_responsive: !!pilotForm.support_responsive,
      sell_through_rate: pilotForm.sell_through_rate ? Number(pilotForm.sell_through_rate) : null,
      customer_feedback: pilotForm.customer_feedback || null,
      overall_outcome: pilotForm.overall_outcome || null,
      notes: pilotForm.notes || null,
    };
    const { error } = await supabase.from('supplier_pilot_reviews').insert(payload);
    if (error) toast.error('บันทึกล้มเหลว: ' + error.message);
    else {
      toast.success('บันทึก pilot review แล้ว');
      setPilotForm({
        po_reference: '', quantity: '', total_value_usd: '',
        delivery_on_time: false, quality_consistent: false, support_responsive: false,
        sell_through_rate: '', customer_feedback: '', overall_outcome: '', notes: '',
      });
      load();
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <Tabs defaultValue="samples">
      <TabsList>
        <TabsTrigger value="samples"><Package className="w-3 h-3 mr-1" />Sample ({samples.length})</TabsTrigger>
        <TabsTrigger value="pilots"><Truck className="w-3 h-3 mr-1" />Pilot ({pilots.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="samples" className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Sample Evaluation ใหม่</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <div><Label className="text-xs">Product model</Label><Input value={sampleForm.product_model} onChange={e => setSampleForm({...sampleForm, product_model: e.target.value})} /></div>
              <div><Label className="text-xs">จำนวน</Label><Input type="number" value={sampleForm.quantity} onChange={e => setSampleForm({...sampleForm, quantity: e.target.value})} /></div>
              <div><Label className="text-xs">วันที่ได้รับ</Label><Input type="date" value={sampleForm.received_date} onChange={e => setSampleForm({...sampleForm, received_date: e.target.value})} /></div>
              <div><Label className="text-xs">วิธีจัดส่ง</Label><Input value={sampleForm.shipping_method} onChange={e => setSampleForm({...sampleForm, shipping_method: e.target.value})} placeholder="DHL / FedEx" /></div>
              <div><Label className="text-xs">Tracking</Label><Input value={sampleForm.tracking_number} onChange={e => setSampleForm({...sampleForm, tracking_number: e.target.value})} /></div>
              <div><Label className="text-xs">คะแนน (1-5)</Label><Input type="number" min="1" max="5" step="0.1" value={sampleForm.evaluation_score} onChange={e => setSampleForm({...sampleForm, evaluation_score: e.target.value})} /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {SAMPLE_CHECKLIST.map(c => (
                <label key={c.key} className="flex items-center gap-2 text-sm border rounded p-2">
                  <input type="checkbox" checked={!!sampleForm[c.key]} onChange={e => setSampleForm({...sampleForm, [c.key]: e.target.checked})} />
                  {c.label}
                </label>
              ))}
            </div>
            <div><Label className="text-xs">Decision</Label><Input value={sampleForm.decision} onChange={e => setSampleForm({...sampleForm, decision: e.target.value})} placeholder="proceed to pilot / hold / disqualify" /></div>
            <div><Label className="text-xs">Notes</Label><Textarea rows={2} value={sampleForm.notes} onChange={e => setSampleForm({...sampleForm, notes: e.target.value})} /></div>
            <div className="flex justify-end"><Button onClick={saveSample}><Save className="w-4 h-4 mr-1" />บันทึก</Button></div>
          </CardContent>
        </Card>
        <div className="space-y-2">
          {samples.map(s => (
            <Card key={s.id}><CardContent className="pt-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-medium text-sm">{s.product_model} × {s.quantity ?? '?'}</p>
                  <p className="text-xs text-muted-foreground">{s.received_date && format(new Date(s.received_date), 'dd MMM yy')} · {SAMPLE_CHECKLIST.filter(c => s[c.key]).length}/{SAMPLE_CHECKLIST.length} pass</p>
                </div>
                <div className="flex items-center gap-2">
                  {s.evaluation_score && <Badge>★ {s.evaluation_score}</Badge>}
                  {s.decision && <Badge variant="outline">{s.decision}</Badge>}
                </div>
              </div>
            </CardContent></Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="pilots" className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Pilot Review ใหม่ (90 วัน)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <div><Label className="text-xs">PO Reference</Label><Input value={pilotForm.po_reference} onChange={e => setPilotForm({...pilotForm, po_reference: e.target.value})} /></div>
              <div><Label className="text-xs">จำนวน</Label><Input type="number" value={pilotForm.quantity} onChange={e => setPilotForm({...pilotForm, quantity: e.target.value})} /></div>
              <div><Label className="text-xs">มูลค่า (USD)</Label><Input type="number" value={pilotForm.total_value_usd} onChange={e => setPilotForm({...pilotForm, total_value_usd: e.target.value})} /></div>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {[
                { key: 'delivery_on_time', label: 'จัดส่งตรงเวลา' },
                { key: 'quality_consistent', label: 'คุณภาพคงที่' },
                { key: 'support_responsive', label: 'Support รวดเร็ว' },
              ].map(c => (
                <label key={c.key} className="flex items-center gap-2 text-sm border rounded p-2">
                  <input type="checkbox" checked={!!pilotForm[c.key]} onChange={e => setPilotForm({...pilotForm, [c.key]: e.target.checked})} />
                  {c.label}
                </label>
              ))}
            </div>
            <div><Label className="text-xs">Sell-through rate (%)</Label><Input type="number" value={pilotForm.sell_through_rate} onChange={e => setPilotForm({...pilotForm, sell_through_rate: e.target.value})} /></div>
            <div><Label className="text-xs">Customer feedback</Label><Textarea rows={2} value={pilotForm.customer_feedback} onChange={e => setPilotForm({...pilotForm, customer_feedback: e.target.value})} /></div>
            <div><Label className="text-xs">Overall outcome</Label><Input value={pilotForm.overall_outcome} onChange={e => setPilotForm({...pilotForm, overall_outcome: e.target.value})} placeholder="promote to partner / extend pilot / drop" /></div>
            <div><Label className="text-xs">Notes</Label><Textarea rows={2} value={pilotForm.notes} onChange={e => setPilotForm({...pilotForm, notes: e.target.value})} /></div>
            <div className="flex justify-end"><Button onClick={savePilot}><Save className="w-4 h-4 mr-1" />บันทึก</Button></div>
          </CardContent>
        </Card>
        <div className="space-y-2">
          {pilots.map(p => (
            <Card key={p.id}><CardContent className="pt-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-medium text-sm">{p.po_reference || '(no PO)'} × {p.quantity ?? '?'}</p>
                  <p className="text-xs text-muted-foreground">USD {Number(p.total_value_usd ?? 0).toLocaleString()} · sell-through {p.sell_through_rate ?? '—'}%</p>
                </div>
                {p.overall_outcome && <Badge>{p.overall_outcome}</Badge>}
              </div>
            </CardContent></Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

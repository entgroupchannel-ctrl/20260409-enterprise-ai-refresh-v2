import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Props { supplierId: string }

const FACTORY_TYPES = [
  { value: 'manufacturer', label: 'Manufacturer (own factory)' },
  { value: 'trading',      label: 'Trading company' },
  { value: 'hybrid',       label: 'Manufacturer + Trader' },
];
const REVENUE_RANGES = [
  { value: 'under_1m',   label: '< $1M' },
  { value: '1m_5m',      label: '$1M – $5M' },
  { value: '5m_20m',     label: '$5M – $20M' },
  { value: 'over_20m',   label: '$20M+' },
];

export default function SupplierPrequalForm({ supplierId }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({
    factory_type: '', established_year: '', total_employees: '', production_employees: '',
    rd_employees: '', monthly_capacity: '', annual_revenue_range: '',
    export_markets: '', export_revenue_percent: '', certifications: '',
    oem_capability: '', moq_first_order: '', sample_policy: '',
    business_license_url: '', factory_photos_count: '', datasheets_provided: false,
    notes: '',
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: row } = await supabase.from('supplier_qualifications')
        .select('*').eq('supplier_id', supplierId).maybeSingle();
      if (row) setData({ ...data, ...row });
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierId]);

  const save = async () => {
    setSaving(true);
    const payload: any = {
      supplier_id: supplierId,
      factory_type: data.factory_type || null,
      established_year: data.established_year ? Number(data.established_year) : null,
      total_employees: data.total_employees ? Number(data.total_employees) : null,
      production_employees: data.production_employees ? Number(data.production_employees) : null,
      rd_employees: data.rd_employees ? Number(data.rd_employees) : null,
      monthly_capacity: data.monthly_capacity || null,
      annual_revenue_range: data.annual_revenue_range || null,
      export_markets: data.export_markets || null,
      export_revenue_percent: data.export_revenue_percent ? Number(data.export_revenue_percent) : null,
      certifications: data.certifications || null,
      oem_capability: data.oem_capability || null,
      moq_first_order: data.moq_first_order || null,
      sample_policy: data.sample_policy || null,
      business_license_url: data.business_license_url || null,
      factory_photos_count: data.factory_photos_count ? Number(data.factory_photos_count) : null,
      datasheets_provided: !!data.datasheets_provided,
      notes: data.notes || null,
    };
    const { error } = await supabase.from('supplier_qualifications')
      .upsert(payload, { onConflict: 'supplier_id' });
    if (error) toast.error('บันทึกล้มเหลว: ' + error.message);
    else toast.success('บันทึก Pre-qualification แล้ว');
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  const f = (k: string, v: any) => setData({ ...data, [k]: v });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4" /> Pre-qualification (10 คำถาม)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">1. Factory type</Label>
            <Select value={data.factory_type} onValueChange={v => f('factory_type', v)}>
              <SelectTrigger><SelectValue placeholder="เลือก..." /></SelectTrigger>
              <SelectContent>
                {FACTORY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">2. Established year</Label>
            <Input type="number" value={data.established_year} onChange={e => f('established_year', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">3a. Total employees</Label>
            <Input type="number" value={data.total_employees} onChange={e => f('total_employees', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">3b. Production</Label>
              <Input type="number" value={data.production_employees} onChange={e => f('production_employees', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">3c. R&amp;D</Label>
              <Input type="number" value={data.rd_employees} onChange={e => f('rd_employees', e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-xs">4. Monthly capacity</Label>
            <Input value={data.monthly_capacity} onChange={e => f('monthly_capacity', e.target.value)} placeholder="e.g. 10,000 units/month" />
          </div>
          <div>
            <Label className="text-xs">5. Annual revenue (USD)</Label>
            <Select value={data.annual_revenue_range} onValueChange={v => f('annual_revenue_range', v)}>
              <SelectTrigger><SelectValue placeholder="เลือก..." /></SelectTrigger>
              <SelectContent>
                {REVENUE_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">6a. Export markets</Label>
            <Input value={data.export_markets} onChange={e => f('export_markets', e.target.value)} placeholder="e.g. USA, EU, SEA" />
          </div>
          <div>
            <Label className="text-xs">6b. Export % of revenue</Label>
            <Input type="number" value={data.export_revenue_percent} onChange={e => f('export_revenue_percent', e.target.value)} placeholder="0-100" />
          </div>
        </div>

        <div>
          <Label className="text-xs">7. Certifications</Label>
          <Textarea rows={2} value={data.certifications} onChange={e => f('certifications', e.target.value)} placeholder="ISO 9001, CE, FCC, RoHS..." />
        </div>
        <div>
          <Label className="text-xs">8. OEM/ODM capability</Label>
          <Textarea rows={2} value={data.oem_capability} onChange={e => f('oem_capability', e.target.value)} placeholder="Brand label / hardware mod / custom firmware..." />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">9. MOQ (first order)</Label>
            <Input value={data.moq_first_order} onChange={e => f('moq_first_order', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">10. Sample policy</Label>
            <Input value={data.sample_policy} onChange={e => f('sample_policy', e.target.value)} placeholder="Free / charged / who pays shipping" />
          </div>
        </div>

        <div className="border-t pt-3 grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Label className="text-xs">Business license URL</Label>
            <Input value={data.business_license_url} onChange={e => f('business_license_url', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label className="text-xs">Factory photos count</Label>
            <Input type="number" value={data.factory_photos_count} onChange={e => f('factory_photos_count', e.target.value)} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!data.datasheets_provided} onChange={e => f('datasheets_provided', e.target.checked)} />
          ส่ง datasheets ของ flagship products แล้ว
        </label>
        <div>
          <Label className="text-xs">หมายเหตุ</Label>
          <Textarea rows={2} value={data.notes} onChange={e => f('notes', e.target.value)} />
        </div>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
            บันทึก
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

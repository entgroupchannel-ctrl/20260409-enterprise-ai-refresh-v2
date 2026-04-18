import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus, Edit2, Trash2, ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';

const STAGES = [
  'discovery', 'pre_qualified', 'video_call', 'sample', 'pilot', 'partner', 'follow_up',
];
const LANGS = [
  { value: 'en', label: 'English' },
  { value: 'cn', label: '中文' },
  { value: 'th', label: 'ไทย' },
];

export default function AdminSupplierTemplates() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const blank = { name: '', stage: 'discovery', language: 'en', subject: '', body: '', is_active: true };
  const [form, setForm] = useState<any>(blank);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('supplier_outreach_templates').select('*').order('stage').order('language');
    setList(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (t: any) => { setEditing(t); setForm({ ...t }); setOpen(true); };

  const save = async () => {
    if (!form.name?.trim() || !form.body?.trim()) { toast.error('กรุณากรอกชื่อและเนื้อหา'); return; }
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from('supplier_outreach_templates').update({
        name: form.name, stage: form.stage, language: form.language,
        subject: form.subject || null, body: form.body, is_active: !!form.is_active,
      } as any).eq('id', editing.id);
      if (error) toast.error('บันทึกล้มเหลว: ' + error.message);
      else { toast.success('อัปเดตแล้ว'); setOpen(false); load(); }
    } else {
      const { error } = await supabase.from('supplier_outreach_templates').insert({
        name: form.name, stage: form.stage, language: form.language,
        subject: form.subject || null, body: form.body, is_active: !!form.is_active,
      } as any);
      if (error) toast.error('สร้างล้มเหลว: ' + error.message);
      else { toast.success('สร้าง template แล้ว'); setOpen(false); load(); }
    }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm('ลบ template นี้?')) return;
    await supabase.from('supplier_outreach_templates').delete().eq('id', id);
    toast.success('ลบแล้ว'); load();
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-4 admin-content-area">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/suppliers')}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <h1 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> Outreach Templates</h1>
          </div>
          <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" /> สร้างใหม่</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground col-span-2 text-center py-12">ยังไม่มี template</p>
            ) : list.map(t => (
              <Card key={t.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm">{t.name}</CardTitle>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-[10px]">{t.stage}</Badge>
                        <Badge variant="outline" className="text-[10px]">{t.language?.toUpperCase()}</Badge>
                        {!t.is_active && <Badge variant="outline" className="text-[10px]">inactive</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => openEdit(t)}><Edit2 className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => del(t.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {t.subject && <p className="text-xs font-medium mb-1">{t.subject}</p>}
                  <p className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-wrap">{t.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? 'แก้ไข Template' : 'สร้าง Template ใหม่'}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label className="text-xs">ชื่อ</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Stage</Label>
                  <Select value={form.stage} onValueChange={v => setForm({...form, stage: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">ภาษา</Label>
                  <Select value={form.language} onValueChange={v => setForm({...form, language: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{LANGS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label className="text-xs">หัวข้อ</Label><Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
              <div>
                <Label className="text-xs">เนื้อหา (ใช้ <code>{'{supplier_name}'}</code> เป็น placeholder ได้)</Label>
                <Textarea rows={14} className="font-mono text-xs" value={form.body} onChange={e => setForm({...form, body: e.target.value})} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                Active
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
              <Button onClick={save} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

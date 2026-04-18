import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Copy, Mail, MessageCircle, Phone, Video } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Props { supplierId: string; supplierName?: string }

const CHANNELS = [
  { value: 'email',    label: 'Email',    Icon: Mail },
  { value: 'wechat',   label: 'WeChat',   Icon: MessageCircle },
  { value: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
  { value: 'phone',    label: 'Phone',    Icon: Phone },
  { value: 'video',    label: 'Video',    Icon: Video },
];

export default function SupplierOutreachLog({ supplierId, supplierName }: Props) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [channel, setChannel] = useState('email');
  const [templateId, setTemplateId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [responseReceived, setResponseReceived] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [logRes, tplRes] = await Promise.all([
        supabase.from('supplier_outreach_log').select('*').eq('supplier_id', supplierId).order('sent_at', { ascending: false }),
        supabase.from('supplier_outreach_templates').select('*').eq('is_active', true).order('name'),
      ]);
      setLogs(logRes.data ?? []);
      setTemplates(tplRes.data ?? []);
      setLoading(false);
    })();
  }, [supplierId]);

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const tpl = templates.find(t => t.id === id);
    if (!tpl) return;
    const replace = (s: string) => (s || '').replace(/\{supplier_name\}/g, supplierName || '[Supplier]');
    setSubject(replace(tpl.subject || ''));
    setBody(replace(tpl.body || ''));
  };

  const copyBody = () => {
    navigator.clipboard.writeText(body);
    toast.success('คัดลอกเนื้อหาแล้ว');
  };

  const log = async () => {
    if (!body.trim()) { toast.error('กรุณากรอกเนื้อหา'); return; }
    setSaving(true);
    const { error } = await supabase.from('supplier_outreach_log').insert({
      supplier_id: supplierId,
      sent_by: profile?.id ?? null,
      channel, template_id: templateId || null,
      subject: subject || null, body,
      response_received: responseReceived,
    } as any);
    if (error) toast.error('บันทึกล้มเหลว: ' + error.message);
    else {
      toast.success('บันทึก outreach แล้ว');
      setSubject(''); setBody(''); setTemplateId(''); setResponseReceived(false);
      const { data } = await supabase.from('supplier_outreach_log').select('*').eq('supplier_id', supplierId).order('sent_at', { ascending: false });
      setLogs(data ?? []);
    }
    setSaving(false);
  };

  const markResponded = async (id: string) => {
    await supabase.from('supplier_outreach_log').update({
      response_received: true, response_at: new Date().toISOString(),
    } as any).eq('id', id);
    const { data } = await supabase.from('supplier_outreach_log').select('*').eq('supplier_id', supplierId).order('sent_at', { ascending: false });
    setLogs(data ?? []);
    toast.success('อัปเดตแล้ว');
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Send className="w-4 h-4" /> ส่ง Outreach ใหม่</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">ช่องทาง</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CHANNELS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">เลือก Template</Label>
              <Select value={templateId} onValueChange={applyTemplate}>
                <SelectTrigger><SelectValue placeholder="(ไม่ใช้ template)" /></SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} {t.language && <span className="text-muted-foreground">({t.language.toUpperCase()})</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">หัวข้อ</Label>
            <Input value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">เนื้อหา</Label>
            <Textarea rows={10} value={body} onChange={e => setBody(e.target.value)} className="font-mono text-xs" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={responseReceived} onChange={e => setResponseReceived(e.target.checked)} />
            ได้รับการตอบกลับแล้ว
          </label>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={copyBody} disabled={!body}><Copy className="w-4 h-4 mr-1" /> คัดลอก</Button>
            <Button onClick={log} disabled={saving || !body.trim()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Send className="w-4 h-4 mr-1" />}
              บันทึก Log
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">ประวัติการติดต่อ ({logs.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">ยังไม่มี outreach</p>
          ) : logs.map(l => {
            const Ch = CHANNELS.find(c => c.value === l.channel);
            const Icon = Ch?.Icon ?? Mail;
            return (
              <div key={l.id} className="border rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{l.subject || '(ไม่มีหัวข้อ)'}</span>
                    {l.response_received ? (
                      <Badge className="bg-primary text-primary-foreground">ตอบแล้ว</Badge>
                    ) : (
                      <Badge variant="outline">รอตอบ</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{format(new Date(l.sent_at), 'dd MMM yy HH:mm')}</span>
                    {!l.response_received && (
                      <Button size="sm" variant="ghost" onClick={() => markResponded(l.id)}>มาร์คว่าตอบแล้ว</Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">{l.body}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

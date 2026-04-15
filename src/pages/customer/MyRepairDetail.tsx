import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SiteNavbar from '@/components/SiteNavbar';
import FooterCompact from '@/components/FooterCompact';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RepairStatusBadge from '@/components/admin/RepairStatusBadge';
import RepairStatusTimeline from '@/components/admin/RepairStatusTimeline';
import RepairPartsTable from '@/components/admin/RepairPartsTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function MyRepairDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ro, setRo] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [roRes, histRes, partsRes] = await Promise.all([
      (supabase as any).from('repair_orders').select('*').eq('id', id).maybeSingle(),
      (supabase as any).from('repair_order_history').select('*').eq('repair_order_id', id).order('created_at', { ascending: false }),
      (supabase as any).from('repair_order_parts').select('*').eq('repair_order_id', id).order('sort_order'),
    ]);
    setRo(roRes.data);
    setHistory(histRes.data || []);
    setParts(partsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [id]);

  const respond = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !rejectReason.trim()) {
      toast({ title: 'กรุณาระบุเหตุผล', variant: 'destructive' });
      return;
    }
    setResponding(true);
    try {
      const { data } = await (supabase as any).rpc('customer_respond_to_repair_quote', {
        p_repair_order_id: id,
        p_action: action,
        p_reason: action === 'reject' ? rejectReason : null,
      });
      if (data?.success) {
        toast({ title: action === 'approve' ? 'อนุมัติเรียบร้อย' : 'ปฏิเสธเรียบร้อย' });
        setRejectOpen(false);
        loadData();
      } else {
        toast({ title: 'ไม่สำเร็จ', description: data?.error, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    }
    setResponding(false);
  };

  if (loading) return <div className="min-h-screen bg-background"><SiteNavbar /><div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div></div>;
  if (!ro) return <div className="min-h-screen bg-background"><SiteNavbar /><div className="text-center py-12">ไม่พบข้อมูล</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="container max-w-3xl py-8 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/my/repairs')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono">{ro.repair_order_number}</h1>
              <RepairStatusBadge status={ro.status} />
            </div>
          </div>
        </div>

        <Card><CardContent className="pt-4"><RepairStatusTimeline currentStatus={ro.status} isChargeable={ro.is_chargeable} /></CardContent></Card>

        {/* Device */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">สินค้า</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>{ro.product_name}</p>
            {ro.serial_number && <p className="text-muted-foreground">S/N: {ro.serial_number}</p>}
          </CardContent>
        </Card>

        {/* Issue */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">อาการเสีย</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p className="whitespace-pre-wrap">{ro.issue_description}</p>
          </CardContent>
        </Card>

        {/* Diagnosis */}
        {ro.diagnosis && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">ผลการวินิจฉัย</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>{ro.diagnosis}</p>
              {ro.root_cause && <p className="text-muted-foreground">สาเหตุ: {ro.root_cause}</p>}
            </CardContent>
          </Card>
        )}

        {/* Quote (when status = quoted) */}
        {ro.is_chargeable && ro.grand_total > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">ใบเสนอราคาซ่อม</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {ro.customer_quote_message && <p className="text-sm bg-muted/50 rounded p-2">{ro.customer_quote_message}</p>}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>ค่าแรง</span><span>฿{Number(ro.labor_cost).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>ค่าชิ้นส่วน</span><span>฿{Number(ro.parts_cost).toLocaleString()}</span></div>
                {Number(ro.additional_cost) > 0 && <div className="flex justify-between"><span>เพิ่มเติม</span><span>฿{Number(ro.additional_cost).toLocaleString()}</span></div>}
                {Number(ro.discount_amount) > 0 && <div className="flex justify-between text-destructive"><span>ส่วนลด</span><span>-฿{Number(ro.discount_amount).toLocaleString()}</span></div>}
                <div className="flex justify-between"><span>VAT {ro.vat_percent}%</span><span>฿{Number(ro.vat_amount).toLocaleString()}</span></div>
                <div className="flex justify-between font-bold border-t pt-1"><span>รวมทั้งสิ้น</span><span>฿{Number(ro.grand_total).toLocaleString()}</span></div>
              </div>
              {parts.length > 0 && <RepairPartsTable parts={parts.map(p => ({ ...p, unit_price: Number(p.unit_price) }))} onChange={() => {}} readOnly />}

              {ro.status === 'quoted' && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => respond('approve')} disabled={responding} className="flex-1">✅ อนุมัติ</Button>
                  <Button variant="destructive" onClick={() => setRejectOpen(true)} disabled={responding} className="flex-1">❌ ปฏิเสธ</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Rejection reason */}
        {ro.customer_reject_reason && (
          <Card>
            <CardContent className="p-4 text-sm">
              <p className="text-destructive font-medium">เหตุผลที่ปฏิเสธ:</p>
              <p>{ro.customer_reject_reason}</p>
            </CardContent>
          </Card>
        )}

        {/* History */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">ประวัติ</CardTitle></CardHeader>
          <CardContent>
            {history.length === 0 ? <p className="text-sm text-muted-foreground">ยังไม่มีประวัติ</p> : (
              <div className="space-y-2">
                {history.map(h => (
                  <div key={h.id} className="flex items-start gap-3 text-sm border-b pb-2 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      {h.to_status && <RepairStatusBadge status={h.to_status} size="sm" />}
                      {h.notes && <p className="text-muted-foreground text-xs mt-0.5">{h.notes}</p>}
                      <p className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString('th-TH')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <FooterCompact />

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>ปฏิเสธใบเสนอราคา</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>เหตุผล *</Label>
              <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="กรุณาระบุเหตุผลที่ปฏิเสธ..." />
            </div>
            <Button variant="destructive" onClick={() => respond('reject')} disabled={responding} className="w-full">
              {responding && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              ยืนยันปฏิเสธ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

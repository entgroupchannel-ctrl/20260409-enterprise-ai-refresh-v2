import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, FileText, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import RepairStatusBadge from '@/components/admin/RepairStatusBadge';
import RepairStatusTimeline from '@/components/admin/RepairStatusTimeline';
import RepairDiagnosisForm from '@/components/admin/RepairDiagnosisForm';
import RepairQuoteForm from '@/components/admin/RepairQuoteForm';
import RepairPartsTable from '@/components/admin/RepairPartsTable';
import WarrantyStatusBadge from '@/components/admin/WarrantyStatusBadge';
import { Badge } from '@/components/ui/badge';

function mapWarrantyStatus(ws: string): 'active' | 'expired' | 'void' | 'not_registered' {
  if (ws === 'in_warranty' || ws === 'extended_warranty') return 'active';
  if (ws === 'out_warranty') return 'expired';
  if (ws === 'void') return 'void';
  return 'not_registered';
}

export default function AdminRepairOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [ro, setRo] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [repairActions, setRepairActions] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

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
    if (roRes.data) {
      setRepairActions(roRes.data.repair_actions || '');
      setAdminNotes(roRes.data.admin_notes || '');
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [id]);

  const transition = async (newStatus: string, notes?: string) => {
    setTransitioning(true);
    try {
      const { data } = await (supabase as any).rpc('validate_repair_status_transition', {
        p_repair_order_id: id,
        p_new_status: newStatus,
        p_actor_id: profile?.id,
        p_notes: notes || null,
      });
      if (data && !data.success) {
        toast({ title: 'ไม่สามารถเปลี่ยนสถานะ', description: data.error, variant: 'destructive' });
      } else {
        toast({ title: `เปลี่ยนสถานะเป็น ${newStatus} แล้ว` });
        loadData();
      }
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    }
    setTransitioning(false);
  };

  const saveNotes = async () => {
    await (supabase as any).from('repair_orders').update({
      repair_actions: repairActions,
      admin_notes: adminNotes,
      updated_at: new Date().toISOString(),
    }).eq('id', id);
    toast({ title: 'บันทึกแล้ว' });
  };

  const generateInvoice = async () => {
    setTransitioning(true);
    try {
      const { data } = await (supabase as any).rpc('generate_invoice_from_repair_order', {
        p_repair_order_id: id,
      });
      if (data?.success) {
        toast({ title: `สร้าง Invoice ${data.invoice_number} แล้ว` });
        loadData();
      } else {
        toast({ title: 'ไม่สามารถสร้าง Invoice', description: data?.error, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    }
    setTransitioning(false);
  };

  if (loading) return <AdminLayout><div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div></AdminLayout>;
  if (!ro) return <AdminLayout><div className="text-center py-12">ไม่พบข้อมูล</div></AdminLayout>;

  const status = ro.status;

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/repairs')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold font-mono">{ro.repair_order_number}</h1>
              <RepairStatusBadge status={status} />
              {ro.priority !== 'normal' && <Badge variant="outline">{ro.priority}</Badge>}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <Card>
          <CardContent className="pt-4">
            <RepairStatusTimeline currentStatus={status} isChargeable={ro.is_chargeable} />
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {status === 'pending' && (
            <>
              <Button onClick={() => transition('received', 'รับเครื่องแล้ว')} disabled={transitioning}>📦 รับเครื่อง</Button>
              <Button variant="destructive" onClick={() => transition('cancelled', 'ยกเลิก')} disabled={transitioning}>ยกเลิก</Button>
            </>
          )}
          {status === 'received' && (
            <>
              <Button onClick={() => transition('diagnosing', 'เริ่มวิเคราะห์')} disabled={transitioning}>🔍 เริ่มวิเคราะห์</Button>
              <Button variant="destructive" onClick={() => transition('cancelled')} disabled={transitioning}>ยกเลิก</Button>
            </>
          )}
          {status === 'diagnosing' && !ro.is_chargeable && (
            <Button onClick={() => transition('repairing', 'ในประกัน — เริ่มซ่อมทันที')} disabled={transitioning}>🔧 เริ่มซ่อม (ในประกัน)</Button>
          )}
          {status === 'diagnosing' && ro.is_chargeable && (
            <Button onClick={() => setShowQuoteForm(true)} disabled={transitioning}>💰 ส่งใบเสนอราคา</Button>
          )}
          {status === 'diagnosing' && (
            <Button variant="destructive" onClick={() => transition('cancelled')} disabled={transitioning}>ยกเลิก</Button>
          )}
          {status === 'approved' && (
            <Button onClick={() => transition('repairing', 'เริ่มซ่อม')} disabled={transitioning}>🔧 เริ่มซ่อม</Button>
          )}
          {status === 'repairing' && (
            <>
              <Button onClick={() => transition('done', 'ซ่อมเสร็จ')} disabled={transitioning}>🎉 ซ่อมเสร็จ</Button>
              {ro.is_chargeable && <Button variant="outline" onClick={() => setShowQuoteForm(true)}>Re-quote (พบปัญหาเพิ่ม)</Button>}
            </>
          )}
          {status === 'done' && (
            <>
              <Button onClick={() => transition('delivered', 'ส่งคืนลูกค้า')} disabled={transitioning}>📤 ส่งคืนลูกค้า</Button>
              {ro.is_chargeable && !ro.invoice_id && (
                <Button variant="outline" onClick={generateInvoice} disabled={transitioning}>
                  <FileText className="w-4 h-4 mr-1" /> สร้าง Invoice
                </Button>
              )}
            </>
          )}
          {status === 'delivered' && ro.is_chargeable && !ro.invoice_id && (
            <Button variant="outline" onClick={generateInvoice} disabled={transitioning}>
              <FileText className="w-4 h-4 mr-1" /> สร้าง Invoice
            </Button>
          )}
          {status === 'quoted' && (
            <Button variant="destructive" onClick={() => transition('cancelled')} disabled={transitioning}>ยกเลิก</Button>
          )}
        </div>

        {/* Device & Customer */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">ข้อมูลสินค้า</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">สินค้า:</span> {ro.product_name}</p>
              {ro.product_sku && <p><span className="text-muted-foreground">SKU:</span> {ro.product_sku}</p>}
              {ro.serial_number && <p><span className="text-muted-foreground">S/N:</span> {ro.serial_number}</p>}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-muted-foreground text-xs">ประกัน:</span>
                <WarrantyStatusBadge status={mapWarrantyStatus(ro.warranty_status)} size="sm" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">ข้อมูลลูกค้า</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">ชื่อ:</span> {ro.customer_name}</p>
              {ro.customer_email && <p><span className="text-muted-foreground">อีเมล:</span> {ro.customer_email}</p>}
              {ro.customer_phone && <p><span className="text-muted-foreground">โทร:</span> {ro.customer_phone}</p>}
              {ro.customer_company && <p><span className="text-muted-foreground">บริษัท:</span> {ro.customer_company}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Issue */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">อาการเสีย</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <Badge variant="outline" className="mb-2">{ro.issue_category}</Badge>
            <p className="whitespace-pre-wrap">{ro.issue_description}</p>
          </CardContent>
        </Card>

        {/* Diagnosis */}
        {['received', 'diagnosing'].includes(status) && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">การวินิจฉัย</CardTitle></CardHeader>
            <CardContent>
              <RepairDiagnosisForm repairOrder={ro} onUpdated={loadData} />
            </CardContent>
          </Card>
        )}
        {ro.diagnosis && !['received', 'diagnosing'].includes(status) && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">ผลการวินิจฉัย</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><span className="text-muted-foreground">วินิจฉัย:</span> {ro.diagnosis}</p>
              {ro.root_cause && <p><span className="text-muted-foreground">สาเหตุ:</span> {ro.root_cause}</p>}
            </CardContent>
          </Card>
        )}

        {/* Quote form */}
        {showQuoteForm && ro.is_chargeable && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">ใบเสนอราคาซ่อม</CardTitle></CardHeader>
            <CardContent>
              <RepairQuoteForm repairOrder={ro} onUpdated={() => { setShowQuoteForm(false); loadData(); }} />
            </CardContent>
          </Card>
        )}

        {/* Cost summary (read-only, when already quoted) */}
        {ro.is_chargeable && ro.grand_total > 0 && !showQuoteForm && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">ค่าใช้จ่าย</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>ค่าแรง</span><span>฿{Number(ro.labor_cost).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>ค่าชิ้นส่วน</span><span>฿{Number(ro.parts_cost).toLocaleString()}</span></div>
                {Number(ro.additional_cost) > 0 && <div className="flex justify-between"><span>ค่าบริการเพิ่มเติม</span><span>฿{Number(ro.additional_cost).toLocaleString()}</span></div>}
                {Number(ro.discount_amount) > 0 && <div className="flex justify-between text-destructive"><span>ส่วนลด</span><span>-฿{Number(ro.discount_amount).toLocaleString()}</span></div>}
                <div className="flex justify-between"><span>VAT {ro.vat_percent}%</span><span>฿{Number(ro.vat_amount).toLocaleString()}</span></div>
                <div className="flex justify-between font-bold border-t pt-1"><span>รวมทั้งสิ้น</span><span>฿{Number(ro.grand_total).toLocaleString()}</span></div>
              </div>
              {parts.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">ชิ้นส่วน:</p>
                  <RepairPartsTable parts={parts.map(p => ({ ...p, unit_price: Number(p.unit_price) }))} onChange={() => {}} readOnly />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Repair log + notes */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">บันทึกการซ่อม</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>สิ่งที่ดำเนินการ</Label>
              <Textarea value={repairActions} onChange={e => setRepairActions(e.target.value)} rows={3} />
            </div>
            <div>
              <Label>หมายเหตุ Admin</Label>
              <Textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={2} />
            </div>
            <Button size="sm" onClick={saveNotes}>บันทึก</Button>
          </CardContent>
        </Card>

        {/* Invoice link */}
        {ro.invoice_id && (
          <Card>
            <CardContent className="p-4">
              <Button variant="link" onClick={() => navigate(`/admin/invoices/${ro.invoice_id}`)}>
                <FileText className="w-4 h-4 mr-1" /> ดูใบวางบิล
              </Button>
            </CardContent>
          </Card>
        )}

        {/* History */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">ประวัติการดำเนินการ</CardTitle></CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">ยังไม่มีประวัติ</p>
            ) : (
              <div className="space-y-2">
                {history.map(h => (
                  <div key={h.id} className="flex items-start gap-3 text-sm border-b pb-2 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium">
                        {h.from_status && <><RepairStatusBadge status={h.from_status} size="sm" /> → </>}
                        <RepairStatusBadge status={h.to_status} size="sm" />
                      </p>
                      {h.notes && <p className="text-muted-foreground text-xs mt-0.5">{h.notes}</p>}
                      <p className="text-xs text-muted-foreground">
                        {h.actor_name || 'ระบบ'} • {new Date(h.created_at).toLocaleString('th-TH')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Trash2, Loader2, FileText, ExternalLink, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import WarrantyStatusBadge from '@/components/admin/WarrantyStatusBadge';
import VoidRegistrationDialog from '@/components/admin/VoidRegistrationDialog';

function computeStatus(endDate: string | null, status: string): 'active' | 'expiring' | 'expired' | 'void' | 'pending_verification' {
  if (status === 'void') return 'void';
  if (status === 'pending_verification') return 'pending_verification';
  if (!endDate) return 'active';
  const days = Math.floor((new Date(endDate).getTime() - Date.now()) / 86400000);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring';
  return 'active';
}

export default function AdminRegisteredProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voidOpen, setVoidOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from('registered_products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    setItem(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [id]);

  const handleDelete = async () => {
    if (!confirm('ลบรายการนี้? (soft delete)')) return;
    setDeleting(true);
    const { data, error } = await (supabase as any).rpc('soft_delete_registered_product', { p_id: id });
    if (error || (data && !data.success)) {
      toast({ title: 'ไม่สำเร็จ', description: error?.message || data?.error, variant: 'destructive' });
    } else {
      toast({ title: '✅ ลบสำเร็จ' });
      navigate('/admin/registered-products');
    }
    setDeleting(false);
  };

  const handleApprove = async () => {
    const { error } = await (supabase as any)
      .from('registered_products')
      .update({ status: 'active' })
      .eq('id', id);
    if (error) { toast({ title: 'ผิดพลาด', description: error.message, variant: 'destructive' }); }
    else { toast({ title: '✅ อนุมัติเรียบร้อย' }); loadData(); }
  };

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div></AdminLayout>;
  if (!item) return <AdminLayout><div className="text-center py-20 text-muted-foreground">ไม่พบรายการ</div></AdminLayout>;

  const ws = computeStatus(item.warranty_end_date, item.status);
  const dr = item.warranty_end_date ? Math.floor((new Date(item.warranty_end_date).getTime() - Date.now()) / 86400000) : undefined;
  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/registered-products')}><ArrowLeft className="w-4 h-4 mr-1" /> กลับ</Button>
          <h1 className="text-xl font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> {item.registration_number}</h1>
          <WarrantyStatusBadge status={ws} daysRemaining={dr} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">ข้อมูลสินค้า</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">ชื่อสินค้า</span><span className="font-medium">{item.product_name_snapshot}</span></div>
              {item.product_sku_snapshot && <div className="flex justify-between"><span className="text-muted-foreground">SKU</span><span className="font-mono">{item.product_sku_snapshot}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Serial Number</span><span className="font-mono font-semibold">{item.serial_number}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">แหล่งที่มา</span><span className="capitalize">{item.source}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">ข้อมูลลูกค้า</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">ชื่อ</span><span>{item.customer_name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{item.customer_email}</span></div>
              {item.customer_phone && <div className="flex justify-between"><span className="text-muted-foreground">เบอร์โทร</span><span>{item.customer_phone}</span></div>}
              {item.customer_company && <div className="flex justify-between"><span className="text-muted-foreground">บริษัท</span><span>{item.customer_company}</span></div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">ข้อมูลประกัน</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">เริ่ม</span><span>{item.warranty_start_date ? new Date(item.warranty_start_date).toLocaleDateString('th-TH') : '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">สิ้นสุด</span><span>{item.warranty_end_date ? new Date(item.warranty_end_date).toLocaleDateString('th-TH') : '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">ระยะ</span><span>{item.warranty_months} เดือน</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">ประเภท</span><span>{item.warranty_type === 'on_site' ? 'On-site' : 'Carry-in'}</span></div>
              {item.warranty_terms && <div><span className="text-muted-foreground block mb-1">เงื่อนไข</span><p className="text-xs bg-muted/50 p-2 rounded">{item.warranty_terms}</p></div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">เอกสารอ้างอิง</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {item.invoice_id && (
                <Link to={`/admin/invoices/${item.invoice_id}`} className="flex items-center gap-1.5 text-primary hover:underline">
                  <FileText className="w-3.5 h-3.5" /> ใบวางบิล <ExternalLink className="w-3 h-3" />
                </Link>
              )}
              {item.purchase_date && <div className="flex justify-between"><span className="text-muted-foreground">วันที่ซื้อ</span><span>{new Date(item.purchase_date).toLocaleDateString('th-TH')}</span></div>}
              {item.proof_url && <a href={item.proof_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">ดูหลักฐาน</a>}
              {item.admin_notes && <div><span className="text-muted-foreground block mb-1">หมายเหตุ</span><p className="text-xs">{item.admin_notes}</p></div>}
            </CardContent>
          </Card>
        </div>

        {/* Repair action */}
        <Card>
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm">ประวัติซ่อม / แจ้งซ่อม</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/repairs?sn=${item.serial_number}`)}>
              <Wrench className="w-3.5 h-3.5 mr-1" /> แจ้งซ่อม
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          {item.status === 'pending_verification' && (
            <Button onClick={handleApprove} variant="default">✅ อนุมัติ</Button>
          )}
          {isSuperAdmin && item.status !== 'void' && (
            <Button variant="destructive" onClick={() => setVoidOpen(true)}>ยกเลิกการลงทะเบียน</Button>
          )}
          <Button variant="outline" className="text-destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
            ลบ
          </Button>
        </div>

        {item.status === 'void' && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="py-4">
              <p className="text-sm font-medium text-destructive">ยกเลิกแล้ว</p>
              <p className="text-xs text-muted-foreground mt-1">เหตุผล: {item.void_reason}</p>
              {item.voided_at && <p className="text-xs text-muted-foreground">เมื่อ: {new Date(item.voided_at).toLocaleString('th-TH')}</p>}
            </CardContent>
          </Card>
        )}
      </div>

      <VoidRegistrationDialog
        open={voidOpen}
        onOpenChange={setVoidOpen}
        registrationId={item.id}
        serialNumber={item.serial_number}
        onSuccess={loadData}
      />
    </AdminLayout>
  );
}

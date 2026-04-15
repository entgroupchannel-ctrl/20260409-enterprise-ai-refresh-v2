import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SiteNavbar from '@/components/SiteNavbar';
import MiniFooter from '@/components/MiniFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Loader2, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WarrantyStatusBadge from '@/components/admin/WarrantyStatusBadge';

function computeStatus(endDate: string | null, status: string): 'active' | 'expiring' | 'expired' | 'void' | 'pending_verification' {
  if (status === 'void') return 'void';
  if (status === 'pending_verification') return 'pending_verification';
  if (!endDate) return 'active';
  const days = Math.floor((new Date(endDate).getTime() - Date.now()) / 86400000);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring';
  return 'active';
}

export default function MyProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from('registered_products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setItem(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="min-h-screen flex flex-col bg-background"><SiteNavbar /><main className="flex-1 flex justify-center items-center"><Loader2 className="w-6 h-6 animate-spin" /></main><MiniFooter /></div>;
  if (!item) return <div className="min-h-screen flex flex-col bg-background"><SiteNavbar /><main className="flex-1 flex justify-center items-center text-muted-foreground">ไม่พบรายการ</main><MiniFooter /></div>;

  const ws = computeStatus(item.warranty_end_date, item.status);
  const dr = item.warranty_end_date ? Math.floor((new Date(item.warranty_end_date).getTime() - Date.now()) / 86400000) : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNavbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 space-y-6 w-full">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/my/products')}><ArrowLeft className="w-4 h-4 mr-1" /> กลับ</Button>
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
        </div>

        {item.status === 'pending_verification' && (
          <Card className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="py-4 text-sm text-blue-700 dark:text-blue-400">
              รอ admin อนุมัติการลงทะเบียน — จะแจ้งเตือนเมื่อดำเนินการเรียบร้อย
            </CardContent>
          </Card>
        )}

        {/* Phase 9.2 placeholder */}
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Wrench className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-medium">ขอซ่อม / แจ้งปัญหา</p>
            <p className="text-xs mt-1">เร็วๆ นี้</p>
            <Button variant="outline" className="mt-3" disabled>ขอซ่อม</Button>
          </CardContent>
        </Card>
      </main>
      <MiniFooter />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteNavbar from '@/components/SiteNavbar';
import FooterCompact from '@/components/FooterCompact';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Plus, Loader2, ArrowLeft, Shield } from 'lucide-react';
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

export default function MyProducts() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from('registered_products')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}><ArrowLeft className="w-4 h-4 mr-1" /> กลับ</Button>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-primary" /> สินค้าของฉัน</h1>
        </div>

        <div className="flex justify-end mb-4">
          <Button onClick={() => navigate('/my/products/register')}><Plus className="w-4 h-4 mr-1.5" /> ลงทะเบียนสินค้าใหม่</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium text-muted-foreground">ยังไม่มีสินค้าที่ลงทะเบียน</p>
              <p className="text-sm text-muted-foreground mt-1">ลงทะเบียน Serial Number เพื่อติดตามประกัน</p>
              <Button className="mt-4" onClick={() => navigate('/my/products/register')}><Plus className="w-4 h-4 mr-1.5" /> ลงทะเบียนสินค้า</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => {
              const ws = computeStatus(item.warranty_end_date, item.status);
              const dr = item.warranty_end_date ? Math.floor((new Date(item.warranty_end_date).getTime() - Date.now()) / 86400000) : undefined;
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/my/products/${item.id}`)}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{item.product_name_snapshot}</p>
                        <p className="font-mono text-xs text-muted-foreground mt-0.5">SN: {item.serial_number}</p>
                      </div>
                      <WarrantyStatusBadge status={ws} daysRemaining={dr} size="sm" />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>เริ่ม: {item.warranty_start_date ? new Date(item.warranty_start_date).toLocaleDateString('th-TH') : '-'}</p>
                      <p>สิ้นสุด: {item.warranty_end_date ? new Date(item.warranty_end_date).toLocaleDateString('th-TH') : '-'}</p>
                      <p>{item.warranty_months} เดือน · {item.warranty_type === 'on_site' ? 'On-site' : 'Carry-in'}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <FooterCompact />
    </div>
  );
}

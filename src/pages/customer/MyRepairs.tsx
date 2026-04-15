import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNavbar from '@/components/SiteNavbar';
import MiniFooter from '@/components/MiniFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Plus, Wrench } from 'lucide-react';
import RepairStatusBadge from '@/components/admin/RepairStatusBadge';
import { Badge } from '@/components/ui/badge';

export default function MyRepairs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      let q = (supabase as any)
        .from('repair_orders')
        .select('*')
        .eq('customer_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (filter === 'active') q = q.in('status', ['pending', 'received', 'diagnosing', 'quoted', 'approved', 'repairing', 'done']);
      else if (filter === 'completed') q = q.eq('status', 'delivered');

      const { data } = await q;
      setOrders(data || []);
      setLoading(false);
    };
    load();
  }, [user, filter]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNavbar />
      <main className="flex-1 container max-w-3xl py-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">ใบสั่งซ่อมของฉัน</h1>
          </div>
          <Button onClick={() => navigate('/my/repairs/new')}>
            <Plus className="w-4 h-4 mr-1" /> แจ้งซ่อม
          </Button>
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="active">กำลังดำเนินการ</TabsTrigger>
            <TabsTrigger value="completed">เสร็จสิ้น</TabsTrigger>
            <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground min-h-[60vh] flex items-center justify-center">ไม่พบใบสั่งซ่อม</div>
        ) : (
          <div className="grid gap-3">
            {orders.map(o => (
              <Card key={o.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/my/repairs/${o.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-sm">{o.repair_order_number}</span>
                        <RepairStatusBadge status={o.status} size="sm" />
                      </div>
                      <p className="text-sm">{o.product_name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{o.issue_description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{new Date(o.created_at).toLocaleDateString('th-TH')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <MiniFooter />
    </div>
  );
}

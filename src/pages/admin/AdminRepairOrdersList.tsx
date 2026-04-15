import { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Loader2, Wrench } from 'lucide-react';
import RepairStatusBadge from '@/components/admin/RepairStatusBadge';
import CreateRepairOrderDialog from '@/components/admin/CreateRepairOrderDialog';
import { Badge } from '@/components/ui/badge';

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminRepairOrdersList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    let q = (supabase as any)
      .from('repair_orders')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (filter === 'active') q = q.in('status', ['pending', 'received', 'diagnosing', 'quoted', 'approved', 'repairing', 'done']);
    else if (filter === 'completed') q = q.eq('status', 'delivered');
    else if (filter === 'cancelled') q = q.in('status', ['cancelled', 'rejected']);

    const { data } = await q;
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, [filter]);

  const filtered = orders.filter(o => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.repair_order_number?.toLowerCase().includes(s) ||
      o.serial_number?.toLowerCase().includes(s) ||
      o.customer_name?.toLowerCase().includes(s) ||
      o.product_name?.toLowerCase().includes(s)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">ใบสั่งซ่อม</h1>
            <Badge variant="secondary">{orders.length}</Badge>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> สร้างใบสั่งซ่อม
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="active">กำลังดำเนินการ</TabsTrigger>
              <TabsTrigger value="completed">เสร็จสิ้น</TabsTrigger>
              <TabsTrigger value="cancelled">ยกเลิก/ปฏิเสธ</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหา RO, S/N, ลูกค้า..." className="pl-8" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">ไม่พบใบสั่งซ่อม</div>
        ) : (
          <div className="grid gap-3">
            {filtered.map(o => (
              <Card key={o.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/admin/repairs/${o.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-semibold text-sm">{o.repair_order_number}</span>
                        <RepairStatusBadge status={o.status} size="sm" />
                        {o.priority !== 'normal' && (
                          <Badge variant="outline" className={PRIORITY_COLORS[o.priority] || ''}>{o.priority}</Badge>
                        )}
                        {!o.is_chargeable && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400">ในประกัน</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium">{o.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.customer_name} {o.serial_number ? `• S/N: ${o.serial_number}` : ''}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{o.issue_description}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground shrink-0">
                      <p>{new Date(o.created_at).toLocaleDateString('th-TH')}</p>
                      {o.is_chargeable && o.grand_total > 0 && (
                        <p className="font-semibold text-sm text-foreground mt-1">฿{Number(o.grand_total).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateRepairOrderDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={loadOrders} />
    </AdminLayout>
  );
}

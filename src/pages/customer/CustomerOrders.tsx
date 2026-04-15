import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CustomerLayout from '@/layouts/CustomerLayout';
import { 
  Package, RefreshCw, Calendar, TrendingUp, Truck,
  CheckCircle, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface SaleOrder {
  id: string;
  so_number: string;
  status: string;
  created_at: string;
  expected_delivery_date: string | null;
  tracking_number: string | null;
  shipping_provider: string | null;
  quote: {
    quote_number: string;
    grand_total: number;
    customer_name: string;
  };
}

const statusLabels: Record<string, { text: string; color: string; icon: any }> = {
  confirmed: { text: 'ยืนยันแล้ว', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle },
  preparing: { text: 'กำลังจัดเตรียม', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  ready_to_ship: { text: 'พร้อมจัดส่ง', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Package },
  shipped: { text: 'จัดส่งแล้ว', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400', icon: Truck },
  delivered: { text: 'ส่งมอบแล้ว', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  completed: { text: 'เสร็จสมบูรณ์', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: CheckCircle },
};

const statusProgress: Record<string, number> = {
  confirmed: 1, preparing: 2, ready_to_ship: 3, shipped: 4, delivered: 5, completed: 5,
};

export default function CustomerOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: quotes, error: qErr } = await supabase
        .from('quote_requests')
        .select('id, quote_number, customer_name, grand_total')
        .eq('customer_email', user.email);
      if (qErr) throw qErr;

      const quoteIds = quotes?.map(q => q.id) || [];
      if (quoteIds.length === 0) { setOrders([]); setLoading(false); return; }

      const { data, error } = await supabase
        .from('sale_orders')
        .select('*')
        .in('quote_id', quoteIds)
        .order('created_at', { ascending: false });
      if (error) throw error;

      setOrders((data || []).map(o => {
        const q = quotes?.find(qq => qq.id === o.quote_id);
        return { ...o, quote: q || { quote_number: 'N/A', grand_total: 0, customer_name: '' } };
      }));
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const fmt = (n: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(n);

  const inProgress = orders.filter(o => ['confirmed', 'preparing', 'ready_to_ship', 'shipped'].includes(o.status));
  const completed = orders.filter(o => ['delivered', 'completed'].includes(o.status));

  if (loading) {
    return (
      <CustomerLayout title="คำสั่งซื้อของฉัน">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </CustomerLayout>
    );
  }

  const OrderCard = ({ order, dim = false }: { order: SaleOrder; dim?: boolean }) => {
    const info = statusLabels[order.status] || statusLabels.confirmed;
    const progress = statusProgress[order.status] || 1;
    const Icon = info.icon;

    return (
      <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${dim ? 'opacity-75' : ''}`} onClick={() => navigate(`/my-orders/${order.id}`)}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">{order.so_number}</h3>
                <Badge className={info.color}><Icon className="w-3 h-3 mr-1" />{info.text}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">จากใบเสนอราคา {order.quote.quote_number}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{fmt(order.quote.grand_total)}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), 'dd MMM yyyy', { locale: th })}</p>
            </div>
          </div>

          {!dim && (
            <>
              <div className="flex items-center justify-between mt-4">
                {[1, 2, 3, 4, 5].map(step => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${progress >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {progress >= step ? '✓' : step}
                    </div>
                    {step < 5 && <div className={`flex-1 h-1 mx-2 rounded ${progress >= step + 1 ? 'bg-primary' : 'bg-muted'}`} />}
                  </div>
                ))}
              </div>

              {order.tracking_number && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">ผู้ให้บริการ: <strong>{order.shipping_provider}</strong></p>
                  <p className="text-sm text-muted-foreground">เลข Tracking: <strong>{order.tracking_number}</strong></p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <CustomerLayout title="คำสั่งซื้อของฉัน">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">คำสั่งซื้อของฉัน</h1>
          <p className="text-muted-foreground mt-1">ติดตามสถานะคำสั่งซื้อและการจัดส่ง</p>
        </div>
        <Button onClick={loadOrders} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />รีเฟรช
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-blue-600 dark:text-blue-400 font-medium">ทั้งหมด</p><p className="text-3xl font-bold text-blue-800 dark:text-blue-200">{orders.length}</p></div>
              <Package className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">กำลังดำเนินการ</p><p className="text-3xl font-bold text-yellow-800 dark:text-yellow-200">{inProgress.length}</p></div>
              <TrendingUp className="w-12 h-12 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-green-600 dark:text-green-400 font-medium">เสร็จสมบูรณ์</p><p className="text-3xl font-bold text-green-800 dark:text-green-200">{completed.length}</p></div>
              <Calendar className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {inProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">กำลังดำเนินการ ({inProgress.length})</h2>
          <div className="space-y-4">{inProgress.map(o => <OrderCard key={o.id} order={o} />)}</div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">เสร็จสมบูรณ์</h2>
          <div className="space-y-4">{completed.map(o => <OrderCard key={o.id} order={o} dim />)}</div>
        </div>
      )}

      {orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-20 h-20 text-muted-foreground mb-4 opacity-30" />
            <h3 className="text-lg font-semibold mb-2">ยังไม่มีคำสั่งซื้อ</h3>
            <p className="text-sm text-muted-foreground mb-6">เมื่อมีการสร้างคำสั่งซื้อจะแสดงที่นี่</p>
            <Button onClick={() => navigate('/my-quotes')}>ดูใบเสนอราคา</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

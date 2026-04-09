import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  FileText,
  Search,
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  User,
  Send,
  Eye,
} from 'lucide-react';
import { formatShortDateTime } from '@/lib/format';

interface SaleOrder {
  id: string;
  so_number: string;
  quote_id: string;
  status: string;
  created_at: string;
  created_by: string | null;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  expected_delivery_date: string | null;
  products: any[];
  subtotal: number;
  vat_amount: number;
  grand_total: number;
  production_notes: string | null;
  shipping_address: string | null;
  shipping_method: string | null;
  tracking_number: string | null;
  internal_notes: string | null;
  customer_notes: string | null;
  // joined
  quote_number?: string;
  customer_name?: string;
  customer_company?: string;
  customer_email?: string;
  customer_phone?: string;
  assigned_to_name?: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', icon: FileText },
  confirmed: { label: 'ยืนยันแล้ว', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: CheckCircle2 },
  in_production: { label: 'กำลังจัดเตรียม', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Package },
  ready_to_ship: { label: 'พร้อมจัดส่ง', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', icon: Package },
  shipped: { label: 'จัดส่งแล้ว', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300', icon: Truck },
  delivered: { label: 'ส่งมอบแล้ว', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle2 },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: FileText },
};

const timelineSteps = [
  { key: 'confirmed', label: 'ยืนยันแล้ว', icon: CheckCircle2 },
  { key: 'in_production', label: 'กำลังจัดเตรียม', icon: Package },
  { key: 'shipped', label: 'จัดส่งแล้ว', icon: Truck },
  { key: 'delivered', label: 'ส่งมอบแล้ว', icon: MapPin },
];

const statusOrder = ['draft', 'confirmed', 'in_production', 'ready_to_ship', 'shipped', 'delivered'];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(amount);

export default function AdminSaleOrders() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('id'));
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState(false);

  // Shipping form state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingProvider, setShippingProvider] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await (supabase.from as any)('sale_orders')
        .select('*, quote_requests(quote_number, customer_name, customer_company, customer_email, customer_phone, assigned_to)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((o: any) => ({
        ...o,
        quote_number: o.quote_requests?.quote_number,
        customer_name: o.quote_requests?.customer_name,
        customer_company: o.quote_requests?.customer_company,
        customer_email: o.quote_requests?.customer_email,
        customer_phone: o.quote_requests?.customer_phone,
      }));
      setOrders(mapped);

      // Auto-select first or from URL
      if (mapped.length > 0 && !selectedId) {
        setSelectedId(mapped[0].id);
      }
    } catch (error: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const selected = orders.find((o) => o.id === selectedId) || null;

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return o.so_number.toLowerCase().includes(q) || (o.customer_name || '').toLowerCase().includes(q);
    }
    return true;
  });

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAdvanceStatus = async (nextStatus: string) => {
    if (!selected) return;
    setProcessing(true);
    try {
      const updates: any = { status: nextStatus };
      if (nextStatus === 'confirmed') updates.confirmed_at = new Date().toISOString();
      if (nextStatus === 'shipped') {
        updates.shipped_at = new Date().toISOString();
        if (trackingNumber) updates.tracking_number = trackingNumber;
      }
      if (nextStatus === 'delivered') updates.delivered_at = new Date().toISOString();

      const { error } = await (supabase.from as any)('sale_orders').update(updates).eq('id', selected.id);
      if (error) throw error;

      toast({ title: 'อัปเดตสถานะสำเร็จ' });
      await loadOrders();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const getNextAction = (status: string) => {
    const map: Record<string, { label: string; next: string; icon: any }> = {
      draft: { label: 'ยืนยัน SO', next: 'confirmed', icon: CheckCircle2 },
      confirmed: { label: 'เริ่มจัดเตรียม', next: 'in_production', icon: Package },
      in_production: { label: 'พร้อมจัดส่ง', next: 'ready_to_ship', icon: Package },
      ready_to_ship: { label: 'บันทึกการจัดส่ง', next: 'shipped', icon: Truck },
      shipped: { label: 'บันทึกการส่งมอบ', next: 'delivered', icon: CheckCircle2 },
    };
    return map[status] || null;
  };

  const getTimelineIndex = (status: string) => {
    const idx = timelineSteps.findIndex((s) => s.key === status);
    if (status === 'ready_to_ship') return 1; // between in_production and shipped
    if (status === 'delivered') return timelineSteps.length;
    return idx;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        </div>
      </AdminLayout>
    );
  }

  const tabs = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'confirmed', label: `ยืนยันแล้ว (${statusCounts.confirmed || 0})` },
    { key: 'in_production', label: `กำลังจัดเตรียม (${statusCounts.in_production || 0})` },
    { key: 'shipped', label: `จัดส่งแล้ว (${statusCounts.shipped || 0})` },
    { key: 'delivered', label: `ส่งมอบแล้ว (${statusCounts.delivered || 0})` },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-4 border-b border-border overflow-x-auto pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                statusFilter === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 justify-end">
          <div className="relative w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Order List */}
          <div className="lg:col-span-2 space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">ไม่มีรายการ</div>
            ) : (
              filteredOrders.map((order) => {
                const conf = statusConfig[order.status] || statusConfig.draft;
                const isActive = order.id === selectedId;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedId(order.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-semibold text-foreground">{order.so_number}</span>
                      <Badge className={conf.color}>{conf.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.customer_name} · {order.customer_company || '-'}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{formatShortDateTime(order.created_at)}</span>
                      <span className="font-semibold text-primary">{formatCurrency(order.grand_total || 0)}</span>
                    </div>
                    {order.created_by && (
                      <p className="text-xs text-muted-foreground mt-1">{order.created_by}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Detail */}
          <div className="lg:col-span-3 space-y-6">
            {!selected ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                เลือกรายการเพื่อดูรายละเอียด
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selected.so_number}</h2>
                    <p className="text-sm text-muted-foreground">
                      จาก PO:{' '}
                      <button
                        onClick={() => navigate(`/admin/quotes/${selected.quote_id}`)}
                        className="text-primary hover:underline"
                      >
                        {selected.quote_number || '—'}
                      </button>
                    </p>
                  </div>
                  <Badge className={statusConfig[selected.status]?.color || ''}>
                    {statusConfig[selected.status]?.label || selected.status}
                  </Badge>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between px-4">
                  {timelineSteps.map((step, i) => {
                    const currentIdx = getTimelineIndex(selected.status);
                    const isCompleted = i < currentIdx;
                    const isCurrent = i === currentIdx;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1 relative">
                        {i > 0 && (
                          <div
                            className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                              isCompleted || isCurrent ? 'bg-primary' : 'bg-border'
                            }`}
                          />
                        )}
                        <div
                          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? 'bg-primary text-primary-foreground'
                              : isCurrent
                              ? 'bg-primary/20 text-primary border-2 border-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] mt-1 text-center ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Customer Info */}
                <Card>
                  <CardContent className="pt-5 pb-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{selected.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{selected.customer_company || ''}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{selected.customer_email}</span>
                        {selected.customer_phone && <span>{selected.customer_phone}</span>}
                      </div>
                      {selected.created_by && (
                        <p className="text-xs text-muted-foreground">Sale: {selected.created_by}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Products */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">รายการสินค้า</h3>
                  <Card>
                    <CardContent className="pt-4 pb-3">
                      <div className="space-y-3">
                        {selected.products.map((p: any, i: number) => (
                          <div key={i} className="flex items-start justify-between">
                            <div className="flex gap-3">
                              <span className="text-sm text-muted-foreground">{i + 1}.</span>
                              <div>
                                <p className="text-sm font-medium text-foreground">{p.model || p.name || 'N/A'}</p>
                                {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <p className="text-xs text-muted-foreground">{p.qty} เครื่อง</p>
                              <p className="text-sm font-semibold text-primary">{formatCurrency(p.line_total || p.unit_price * p.qty || 0)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-3" />

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>รวม</span>
                          <span className="text-foreground">{formatCurrency(selected.subtotal || 0)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-foreground">
                          <span>ยอดรวม</span>
                          <span className="text-primary">{formatCurrency(selected.grand_total || 0)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Shipping Info */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">ข้อมูลจัดส่ง</h3>
                  <Card>
                    <CardContent className="pt-4 pb-3 space-y-3">
                      {selected.shipping_address && (
                        <div>
                          <Label className="text-xs text-muted-foreground">ที่อยู่จัดส่ง</Label>
                          <p className="text-sm text-foreground">{selected.shipping_address}</p>
                        </div>
                      )}
                      {selected.expected_delivery_date && (
                        <div>
                          <Label className="text-xs text-muted-foreground">วันที่คาดว่าจะส่ง</Label>
                          <p className="text-sm text-foreground">{selected.expected_delivery_date}</p>
                        </div>
                      )}
                      {selected.tracking_number && (
                        <div>
                          <Label className="text-xs text-muted-foreground">เลข Tracking</Label>
                          <p className="text-sm text-foreground font-mono">{selected.tracking_number}</p>
                        </div>
                      )}

                      {/* Shipping form - show when ready_to_ship */}
                      {selected.status === 'ready_to_ship' && (
                        <div className="pt-2 space-y-3 border-t border-border">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">ผู้ให้บริการขนส่ง</Label>
                              <Input
                                placeholder="Kerry, Flash, ไปรษณีย์..."
                                value={shippingProvider}
                                onChange={(e) => setShippingProvider(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">เลข Tracking</Label>
                              <Input
                                placeholder="TH1234567890"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Notes */}
                {(selected.production_notes || selected.internal_notes) && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">หมายเหตุ</h3>
                    <Card>
                      <CardContent className="pt-4 pb-3 space-y-2 text-sm text-foreground">
                        {selected.production_notes && <p>🏭 {selected.production_notes}</p>}
                        {selected.internal_notes && <p>📝 {selected.internal_notes}</p>}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Action Button */}
                {(() => {
                  const action = getNextAction(selected.status);
                  if (!action) return null;
                  const Icon = action.icon;
                  return (
                    <Button
                      onClick={() => handleAdvanceStatus(action.next)}
                      disabled={processing}
                      size="lg"
                      className="w-full"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {processing ? 'กำลังดำเนินการ...' : action.label}
                    </Button>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

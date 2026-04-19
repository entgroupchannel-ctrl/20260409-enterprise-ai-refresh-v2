import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { EmptyState } from '@/components/admin/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

const SHIPPING_PROVIDERS = [
  'Kerry Express',
  'Flash Express',
  'J&T Express',
  'ไปรษณีย์ไทย (Thailand Post)',
  'EMS',
  'DHL',
  'FedEx',
  'SCG Express',
  'Ninja Van',
  'Best Express',
  'Lalamove',
  'Grab Express',
  'รถบริษัท',
];
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  ShoppingCart,
  ArrowLeft,
  Save,
  Copy,
  XCircle,
  Clock,
  User,
  Calendar,
  Plus,
  Receipt,
} from 'lucide-react';
import SelectQuoteForSODialog from '@/components/admin/SelectQuoteForSODialog';
import CreateInvoiceFromSODialog from '@/components/admin/CreateInvoiceFromSODialog';
import CreateSaleOrderDialog from '@/components/admin/CreateSaleOrderDialog';
import { formatShortDateTime } from '@/lib/format';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

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
  completed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  expected_delivery_date: string | null;
  actual_delivery_date: string | null;
  standard_lead_time_days: number;
  products: any[];
  subtotal: number;
  vat_amount: number;
  grand_total: number;
  production_notes: string | null;
  delivery_notes: string | null;
  shipping_address: string | null;
  shipping_method: string | null;
  shipping_provider: string | null;
  tracking_number: string | null;
  internal_notes: string | null;
  customer_notes: string | null;
  sale_person_name: string | null;
  sale_person_email: string | null;
  quote_number?: string;
  customer_name?: string;
  customer_company?: string;
  customer_email?: string;
  customer_phone?: string;
}

const timelineSteps = [
  { key: 'confirmed', label: 'ยืนยันแล้ว', icon: CheckCircle2 },
  { key: 'preparing', label: 'กำลังจัดเตรียม', icon: Package },
  { key: 'ready_to_ship', label: 'พร้อมจัดส่ง', icon: Package },
  { key: 'shipped', label: 'จัดส่งแล้ว', icon: Truck },
  { key: 'delivered', label: 'ส่งมอบแล้ว', icon: MapPin },
];

const statusOrder = ['confirmed', 'preparing', 'in_production', 'ready_to_ship', 'shipped', 'delivered', 'completed'];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(amount);

export default function AdminSaleOrders() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const { toast } = useToast();

  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(routeId || null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [processing, setProcessing] = useState(false);

  // Shipping dialog
  const [showShippingDialog, setShowShippingDialog] = useState(false);
  const [shippingProvider, setShippingProvider] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippedAt, setShippedAt] = useState('');

  // Cancel dialog
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Create SO flow
  const [showQuoteSelector, setShowQuoteSelector] = useState(false);
  const [selectedQuoteForSO, setSelectedQuoteForSO] = useState<any>(null);
  const [invoiceDialogSO, setInvoiceDialogSO] = useState<any>(null);

  useEffect(() => { loadOrders(); }, []);
  useEffect(() => { if (routeId) setSelectedId(routeId); }, [routeId]);

  const loadOrders = async () => {
    try {
      const { data, error } = await (supabase.from as any)('sale_orders')
        .select('*, quote_requests(quote_number, customer_name, customer_company, customer_email, customer_phone)')
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

  const filteredOrders = orders
    .filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          o.so_number.toLowerCase().includes(q) ||
          (o.customer_name || '').toLowerCase().includes(q) ||
          (o.customer_company || '').toLowerCase().includes(q) ||
          (o.customer_email || '').toLowerCase().includes(q) ||
          (o.tracking_number || '').toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'amount_high': return (b.grand_total || 0) - (a.grand_total || 0);
        case 'amount_low': return (a.grand_total || 0) - (b.grand_total || 0);
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
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
      if (nextStatus === 'delivered') updates.delivered_at = new Date().toISOString();
      if (nextStatus === 'completed') updates.completed_at = new Date().toISOString();

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

  const handleShipOrder = async () => {
    if (!selected || !shippingProvider || !trackingNumber) {
      toast({ title: 'กรุณากรอกข้อมูลขนส่ง', variant: 'destructive' });
      return;
    }
    setProcessing(true);
    try {
      const { error } = await (supabase.from as any)('sale_orders').update({
        status: 'shipped',
        shipping_provider: shippingProvider,
        tracking_number: trackingNumber,
        shipped_at: shippedAt || new Date().toISOString(),
      }).eq('id', selected.id);
      if (error) throw error;

      toast({ title: 'บันทึกการจัดส่งสำเร็จ' });
      setShowShippingDialog(false);
      setShippingProvider('');
      setTrackingNumber('');
      setShippedAt('');
      await loadOrders();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selected || !cancelReason) {
      toast({ title: 'กรุณาระบุเหตุผลการยกเลิก', variant: 'destructive' });
      return;
    }
    setProcessing(true);
    try {
      const { error } = await (supabase.from as any)('sale_orders').update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancel_reason: cancelReason,
      }).eq('id', selected.id);
      if (error) throw error;

      toast({ title: 'ยกเลิก SO สำเร็จ' });
      setShowCancelDialog(false);
      setCancelReason('');
      await loadOrders();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const getTimelineIndex = (status: string) => {
    if (status === 'in_production') return 1; // same as preparing
    const idx = timelineSteps.findIndex((s) => s.key === status);
    if (status === 'completed') return timelineSteps.length;
    return idx;
  };

  const getNextAction = (status: string) => {
    const map: Record<string, { label: string; next: string; icon: any }> = {
      draft: { label: 'ยืนยัน SO', next: 'confirmed', icon: CheckCircle2 },
      confirmed: { label: 'เริ่มจัดเตรียม', next: 'preparing', icon: Package },
      preparing: { label: 'พร้อมจัดส่ง', next: 'ready_to_ship', icon: Package },
      in_production: { label: 'พร้อมจัดส่ง', next: 'ready_to_ship', icon: Package },
      ready_to_ship: { label: 'บันทึกการจัดส่ง', next: 'shipping_dialog', icon: Truck },
      shipped: { label: 'ยืนยันส่งมอบแล้ว', next: 'delivered', icon: CheckCircle2 },
      delivered: { label: 'เสร็จสมบูรณ์', next: 'completed', icon: CheckCircle2 },
    };
    return map[status] || null;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'คัดลอกแล้ว' });
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

  return (
    <AdminLayout>
      <AdminPageLayout
        title="ยอดขาย / Sales Orders"
        description="จัดการคำสั่งขายและติดตามสถานะการจัดส่ง"
        actionButton={{
          label: 'สร้าง Sale Order',
          icon: <Plus className="w-4 h-4 mr-1.5" />,
          onClick: () => setShowQuoteSelector(true),
        }}
        searchPlaceholder="ค้นหาเลข SO, ชื่อ, อีเมล, Tracking..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterOptions={[
          { value: 'newest', label: 'ล่าสุด → เก่าสุด' },
          { value: 'oldest', label: 'เก่าสุด → ล่าสุด' },
          { value: 'amount_high', label: 'ยอดสูง → ต่ำ' },
          { value: 'amount_low', label: 'ยอดต่ำ → สูง' },
        ]}
        filterValue={sortBy}
        onFilterChange={setSortBy}
        statsTabs={[
          { label: 'ทั้งหมด', value: 'all', count: orders.length },
          { label: 'ยืนยันแล้ว', value: 'confirmed', count: statusCounts.confirmed || 0 },
          { label: 'กำลังจัดเตรียม', value: 'preparing', count: (statusCounts.preparing || 0) + (statusCounts.in_production || 0) },
          { label: 'พร้อมจัดส่ง', value: 'ready_to_ship', count: statusCounts.ready_to_ship || 0 },
          { label: 'จัดส่งแล้ว', value: 'shipped', count: statusCounts.shipped || 0 },
          { label: 'ส่งมอบแล้ว', value: 'delivered', count: statusCounts.delivered || 0 },
          { label: 'เสร็จสมบูรณ์', value: 'completed', count: statusCounts.completed || 0 },
        ]}
        activeTab={statusFilter}
        onTabChange={setStatusFilter}
        resultsCount={filteredOrders.length}
      >
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="ไม่พบคำสั่งขาย"
            description="ยังไม่มี Sales Order ในระบบ หรือลองเปลี่ยนตัวกรอง"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Order List */}
            <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {filteredOrders.map((order) => {
                const isActive = order.id === selectedId;
                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedId(order.id);
                      navigate(`/admin/sale-orders/${order.id}`, { replace: true });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-semibold text-foreground">{order.so_number}</span>
                      <StatusBadge status={order.status} type="so" />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.customer_name} · {order.customer_company || '-'}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{formatShortDateTime(order.created_at)}</span>
                      <span className="font-semibold text-primary">{formatCurrency(order.grand_total || 0)}</span>
                    </div>
                    {order.tracking_number && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        📦 {order.tracking_number}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: Detail */}
            <div className="lg:col-span-3 space-y-6">
              {!selected ? (
                <Card>
                  <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                    เลือกรายการเพื่อดูรายละเอียด
                  </CardContent>
                </Card>
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
                    <StatusBadge status={selected.status} type="so" />
                  </div>

                  {/* Timeline */}
                  {selected.status !== 'cancelled' && (
                    <Card>
                      <CardContent className="pt-6 pb-4">
                        <div className="flex items-center justify-between px-2">
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
                      </CardContent>
                    </Card>
                  )}

                  {/* Cancelled notice */}
                  {selected.status === 'cancelled' && (
                    <Card className="border-destructive/50 bg-destructive/5">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2 text-destructive mb-2">
                          <XCircle className="w-5 h-5" />
                          <span className="font-semibold">ยกเลิกแล้ว</span>
                        </div>
                        {selected.cancel_reason && (
                          <p className="text-sm text-muted-foreground">เหตุผล: {selected.cancel_reason}</p>
                        )}
                        {selected.cancelled_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            เมื่อ {format(new Date(selected.cancelled_at), 'dd MMM yyyy HH:mm', { locale: th })}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left detail */}
                    <div className="xl:col-span-2 space-y-6">
                      {/* Customer Info */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">ข้อมูลลูกค้า</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                          <p className="font-semibold text-foreground">{selected.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{selected.customer_company || ''}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{selected.customer_email}</span>
                            {selected.customer_phone && <span>{selected.customer_phone}</span>}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Products */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">รายการสินค้า</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selected.products.map((p: any, i: number) => (
                              <div key={i} className="flex items-start justify-between">
                                <div className="flex gap-3">
                                  <span className="text-sm text-muted-foreground">{i + 1}.</span>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{p.model || p.name || 'N/A'}</p>
                                    {p.description && <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>}
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
                            {selected.vat_amount > 0 && (
                              <div className="flex justify-between text-muted-foreground">
                                <span>VAT 7%</span>
                                <span className="text-foreground">{formatCurrency(selected.vat_amount || 0)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold text-foreground">
                              <span>ยอดรวม</span>
                              <span className="text-primary">{formatCurrency(selected.grand_total || 0)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Shipping Info */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">ข้อมูลการจัดส่ง</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selected.shipping_address && (
                            <div>
                              <Label className="text-xs text-muted-foreground">ที่อยู่จัดส่ง</Label>
                              <p className="text-sm text-foreground">{selected.shipping_address}</p>
                            </div>
                          )}
                          {selected.expected_delivery_date && (
                            <div>
                              <Label className="text-xs text-muted-foreground">วันที่คาดว่าจะส่ง</Label>
                              <p className="text-sm text-foreground">
                                {format(new Date(selected.expected_delivery_date), 'dd MMM yyyy', { locale: th })}
                              </p>
                            </div>
                          )}
                          {selected.shipping_provider && (
                            <div>
                              <Label className="text-xs text-muted-foreground">ผู้ให้บริการขนส่ง</Label>
                              <p className="text-sm text-foreground">{selected.shipping_provider}</p>
                            </div>
                          )}
                          {selected.tracking_number && (
                            <div>
                              <Label className="text-xs text-muted-foreground">เลข Tracking</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-foreground">
                                  {selected.tracking_number}
                                </code>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(selected.tracking_number!)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                          {selected.shipped_at && (
                            <div>
                              <Label className="text-xs text-muted-foreground">วันที่จัดส่ง</Label>
                              <p className="text-sm text-foreground">
                                {format(new Date(selected.shipped_at), 'dd MMM yyyy HH:mm', { locale: th })}
                              </p>
                            </div>
                          )}
                          {selected.delivered_at && (
                            <div>
                              <Label className="text-xs text-muted-foreground">วันที่ส่งมอบ</Label>
                              <p className="text-sm text-foreground">
                                {format(new Date(selected.delivered_at), 'dd MMM yyyy HH:mm', { locale: th })}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Notes */}
                      {(selected.production_notes || selected.delivery_notes || selected.internal_notes) && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">หมายเหตุ</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm text-foreground">
                            {selected.production_notes && <p>🏭 ผลิต: {selected.production_notes}</p>}
                            {selected.delivery_notes && <p>🚚 จัดส่ง: {selected.delivery_notes}</p>}
                            {selected.internal_notes && <p>📝 ภายใน: {selected.internal_notes}</p>}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-6">
                      {/* Quick Info */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">ข้อมูลรวดเร็ว</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <Label className="text-xs text-muted-foreground">Sale Person</Label>
                              <p className="font-medium text-foreground">{selected.sale_person_name || selected.created_by || '-'}</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <Label className="text-xs text-muted-foreground">วันที่คาดว่าจะส่ง</Label>
                              <p className="font-medium text-foreground">
                                {selected.expected_delivery_date
                                  ? format(new Date(selected.expected_delivery_date), 'dd MMM yyyy', { locale: th })
                                  : '-'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <Label className="text-xs text-muted-foreground">ระยะเวลามาตรฐาน</Label>
                              <p className="font-medium text-foreground">{selected.standard_lead_time_days || 7} วัน</p>
                            </div>
                          </div>
                          <Separator />
                          <div>
                            <Label className="text-xs text-muted-foreground">วันที่สร้าง SO</Label>
                            <p className="text-foreground">
                              {format(new Date(selected.created_at), 'dd MMM yyyy HH:mm', { locale: th })}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Actions */}
                      {selected.status !== 'cancelled' && selected.status !== 'completed' && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">การดำเนินการ</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {(() => {
                              const action = getNextAction(selected.status);
                              if (!action) return null;
                              const Icon = action.icon;
                              if (action.next === 'shipping_dialog') {
                                return (
                                  <Button
                                    className="w-full"
                                    onClick={() => setShowShippingDialog(true)}
                                    disabled={processing}
                                  >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {action.label}
                                  </Button>
                                );
                              }
                              return (
                                <Button
                                  className="w-full"
                                  onClick={() => handleAdvanceStatus(action.next)}
                                  disabled={processing}
                                >
                                  <Icon className="w-4 h-4 mr-2" />
                                  {processing ? 'กำลังดำเนินการ...' : action.label}
                                </Button>
                              );
                            })()}

                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setInvoiceDialogSO(selected)}
                            >
                              <Receipt className="w-4 h-4 mr-2" />
                              สร้างใบวางบิล
                            </Button>

                            <Separator />

                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => navigate(`/admin/quotes/${selected.quote_id}`)}
                            >
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              ดูใบเสนอราคา
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={() => setShowCancelDialog(true)}
                              disabled={processing}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              ยกเลิก SO
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </AdminPageLayout>

      {/* Shipping Dialog */}
      <Dialog open={showShippingDialog} onOpenChange={setShowShippingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>บันทึกข้อมูลการจัดส่ง</DialogTitle>
            <DialogDescription>กรอกข้อมูลผู้ให้บริการขนส่งและเลข Tracking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>ผู้ให้บริการขนส่ง *</Label>
              <Select
                value={SHIPPING_PROVIDERS.includes(shippingProvider) ? shippingProvider : (shippingProvider ? '__other__' : '')}
                onValueChange={(v) => setShippingProvider(v === '__other__' ? '' : v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="เลือกผู้ให้บริการขนส่ง..." />
                </SelectTrigger>
                <SelectContent>
                  {SHIPPING_PROVIDERS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                  <SelectItem value="__other__">อื่นๆ (ระบุเอง)</SelectItem>
                </SelectContent>
              </Select>
              {!SHIPPING_PROVIDERS.includes(shippingProvider) && (
                <Input
                  value={shippingProvider}
                  onChange={(e) => setShippingProvider(e.target.value)}
                  placeholder="ระบุชื่อผู้ให้บริการขนส่ง..."
                  className="mt-2"
                />
              )}
            </div>
            <div>
              <Label>เลข Tracking *</Label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="TH1234567890"
                className="mt-1"
              />
            </div>
            <div>
              <Label>วันที่จัดส่ง</Label>
              <Input
                type="datetime-local"
                value={shippedAt}
                onChange={(e) => setShippedAt(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">หากไม่ระบุจะใช้เวลาปัจจุบัน</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShippingDialog(false)}>ยกเลิก</Button>
            <Button onClick={handleShipOrder} disabled={processing || !shippingProvider || !trackingNumber}>
              {processing ? 'กำลังบันทึก...' : 'บันทึกการจัดส่ง'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยกเลิก Sales Order</DialogTitle>
            <DialogDescription>กรุณาระบุเหตุผลในการยกเลิก {selected?.so_number}</DialogDescription>
          </DialogHeader>
          <div>
            <Label>เหตุผล *</Label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="ระบุเหตุผลการยกเลิก..."
              rows={3}
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>ปิด</Button>
            <Button variant="destructive" onClick={handleCancelOrder} disabled={processing || !cancelReason}>
              {processing ? 'กำลังยกเลิก...' : 'ยืนยันยกเลิก'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SelectQuoteForSODialog
        open={showQuoteSelector}
        onOpenChange={setShowQuoteSelector}
        onSelect={(quote) => setSelectedQuoteForSO(quote)}
      />

      {selectedQuoteForSO && (
        <CreateSaleOrderDialog
          open={!!selectedQuoteForSO}
          onOpenChange={(v) => !v && setSelectedQuoteForSO(null)}
          quote={selectedQuoteForSO}
          onSuccess={() => {
            const qn = selectedQuoteForSO.quote_number;
            setSelectedQuoteForSO(null);
            loadOrders();
            toast({
              title: '✅ สร้าง Sale Order สำเร็จ',
              description: `จากใบเสนอราคา ${qn}`,
            });
          }}
        />
      )}

      <CreateInvoiceFromSODialog
        open={!!invoiceDialogSO}
        onOpenChange={(v) => !v && setInvoiceDialogSO(null)}
        saleOrder={invoiceDialogSO}
      />
    </AdminLayout>
  );
}

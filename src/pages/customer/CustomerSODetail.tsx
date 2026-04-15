import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CustomerLayout from '@/layouts/CustomerLayout';
import SEOHead from '@/components/SEOHead';
import {
  ArrowLeft, CheckCircle2, Copy, MapPin, Package, Truck,
  Calendar, FileText, Loader2, ChevronRight, Building2,
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const timelineSteps = [
  { key: 'confirmed', label: 'ยืนยันแล้ว', icon: CheckCircle2 },
  { key: 'preparing', label: 'กำลังจัดเตรียม', icon: Package },
  { key: 'ready_to_ship', label: 'พร้อมจัดส่ง', icon: Package },
  { key: 'shipped', label: 'จัดส่งแล้ว', icon: Truck },
  { key: 'delivered', label: 'ส่งมอบแล้ว', icon: MapPin },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(amount);

export default function CustomerSODetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [so, setSo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadSO();
  }, [id]);

  const loadSO = async () => {
    try {
      const { data, error } = await (supabase.from as any)('sale_orders')
        .select('*, quote_requests(quote_number, customer_name, customer_company)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setSo({
        ...data,
        quote_number: data.quote_requests?.quote_number,
        customer_name: data.quote_requests?.customer_name,
        customer_company: data.quote_requests?.customer_company,
      });
    } catch (error: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getTimelineIndex = (status: string) => {
    if (status === 'in_production') return 1;
    const idx = timelineSteps.findIndex((s) => s.key === status);
    if (status === 'completed') return timelineSteps.length;
    return idx;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'คัดลอกแล้ว' });
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </CustomerLayout>
    );
  }

  if (!so) {
    return (
      <CustomerLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <FileText className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">ไม่พบข้อมูล Sales Order</p>
          <Button variant="outline" onClick={() => navigate('/my-account/orders')}>
            กลับรายการ
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <SEOHead title={`${so.so_number} | ใบสั่งขาย`} description={`รายละเอียดใบสั่งขาย ${so.so_number}`} />

      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/my-account/orders" className="hover:text-primary transition-colors">
            คำสั่งซื้อ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{so.so_number}</span>
        </div>

        {/* Header Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">{so.so_number}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-3.5 h-3.5" />
                  <span>ใบเสนอราคา: {so.quote_number || '-'}</span>
                </div>
                {so.customer_company && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{so.customer_company}</span>
                  </div>
                )}
              </div>
              <StatusBadge status={so.status} type="so" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Timeline */}
            {so.status !== 'cancelled' && (
              <div className="flex items-center justify-between px-4 py-2">
                {timelineSteps.map((step, i) => {
                  const currentIdx = getTimelineIndex(so.status);
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
                        className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-primary text-primary-foreground'
                            : isCurrent
                            ? 'bg-primary/20 text-primary border-2 border-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] mt-1.5 text-center leading-tight ${
                        isCurrent ? 'text-primary font-semibold' : 'text-muted-foreground'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              ข้อมูลการจัดส่ง
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">วันที่คาดว่าจะได้รับ</Label>
                <p className="font-medium text-foreground">
                  {so.expected_delivery_date
                    ? format(new Date(so.expected_delivery_date), 'dd MMM yyyy', { locale: th })
                    : '-'}
                </p>
              </div>

              {so.shipping_provider && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">ผู้ให้บริการขนส่ง</Label>
                  <p className="font-medium text-foreground">{so.shipping_provider}</p>
                </div>
              )}

              {so.tracking_number && (
                <div className="col-span-full space-y-1">
                  <Label className="text-xs text-muted-foreground">เลข Tracking</Label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <code className="text-sm font-mono bg-muted px-3 py-1.5 rounded-md text-foreground">
                      {so.tracking_number}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => copyToClipboard(so.tracking_number)}
                    >
                      <Copy className="w-3 h-3 mr-1.5" />
                      คัดลอก
                    </Button>
                  </div>
                </div>
              )}

              {so.shipped_at && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">วันที่จัดส่ง</Label>
                  <p className="font-medium text-foreground">
                    {format(new Date(so.shipped_at), 'dd MMM yyyy HH:mm', { locale: th })}
                  </p>
                </div>
              )}

              {so.delivered_at && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">วันที่ส่งมอบ</Label>
                  <p className="font-medium text-foreground">
                    {format(new Date(so.delivered_at), 'dd MMM yyyy HH:mm', { locale: th })}
                  </p>
                </div>
              )}

              {!so.tracking_number && !so.shipped_at && !so.shipping_provider && !so.expected_delivery_date && (
                <div className="col-span-full text-center py-4 text-muted-foreground text-sm">
                  ยังไม่มีข้อมูลการจัดส่ง
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              รายการสินค้า
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {so.products?.map((p: any, i: number) => (
                <div key={i} className="flex items-start justify-between py-2 border-b border-border last:border-0">
                  <div className="flex gap-3 min-w-0">
                    <span className="text-sm text-muted-foreground font-mono w-6 shrink-0">{i + 1}.</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{p.model || p.name}</p>
                      {p.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{p.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs text-muted-foreground">{p.qty} เครื่อง</p>
                    <p className="text-sm font-semibold text-primary tabular-nums">
                      {formatCurrency(p.line_total || p.unit_price * p.qty || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground">ยอดรวม</span>
              <span className="text-lg font-bold text-primary tabular-nums">
                {formatCurrency(so.grand_total || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {so.notes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">หมายเหตุ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{so.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </CustomerLayout>
  );
}

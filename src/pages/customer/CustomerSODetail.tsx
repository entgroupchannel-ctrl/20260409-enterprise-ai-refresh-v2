import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle2, Copy, MapPin, Package, Truck } from 'lucide-react';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!so) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">ไม่พบข้อมูล Sales Order</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับ
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{so.so_number}</CardTitle>
                <CardDescription>ใบเสนอราคา: {so.quote_number}</CardDescription>
              </div>
              <StatusBadge status={so.status} type="so" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Timeline */}
            {so.status !== 'cancelled' && (
              <div className="flex items-center justify-between px-2">
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
            )}

            <Separator />

            {/* Delivery Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">ข้อมูลการจัดส่ง</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">วันที่คาดว่าจะได้รับ</Label>
                  <p className="font-medium text-foreground">
                    {so.expected_delivery_date
                      ? format(new Date(so.expected_delivery_date), 'dd MMM yyyy', { locale: th })
                      : '-'}
                  </p>
                </div>

                {so.shipping_provider && (
                  <div>
                    <Label className="text-xs text-muted-foreground">ผู้ให้บริการ</Label>
                    <p className="font-medium text-foreground">{so.shipping_provider}</p>
                  </div>
                )}

                {so.tracking_number && (
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">เลข Tracking</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-foreground">
                        {so.tracking_number}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(so.tracking_number)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {so.shipped_at && (
                  <div>
                    <Label className="text-xs text-muted-foreground">วันที่จัดส่ง</Label>
                    <p className="font-medium text-foreground">
                      {format(new Date(so.shipped_at), 'dd MMM yyyy HH:mm', { locale: th })}
                    </p>
                  </div>
                )}

                {so.delivered_at && (
                  <div>
                    <Label className="text-xs text-muted-foreground">วันที่ส่งมอบ</Label>
                    <p className="font-medium text-foreground">
                      {format(new Date(so.delivered_at), 'dd MMM yyyy HH:mm', { locale: th })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Products */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">รายการสินค้า</h3>
              <div className="space-y-3">
                {so.products.map((p: any, i: number) => (
                  <div key={i} className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <span className="text-sm text-muted-foreground">{i + 1}.</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.model || p.name}</p>
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
              <div className="flex justify-between font-bold text-foreground">
                <span>ยอดรวม</span>
                <span className="text-primary">{formatCurrency(so.grand_total || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

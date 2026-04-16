import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, CalendarDays } from 'lucide-react';
import { addDays, format } from 'date-fns';

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_company?: string | null;
  customer_address: string | null;
  products: any[];
  subtotal: number;
  vat_amount: number;
  grand_total: number;
}

interface CreateSaleOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote;
  onSuccess: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

export default function CreateSaleOrderDialog({ open, onOpenChange, quote, onSuccess }: CreateSaleOrderDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [expectedDelivery, setExpectedDelivery] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [leadTimeDays, setLeadTimeDays] = useState(7);
  const [shippingAddress, setShippingAddress] = useState(quote.customer_address || '');
  const [shippingMethod, setShippingMethod] = useState('delivery');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [productionNotes, setProductionNotes] = useState('');

  const handleLeadTimeChange = (days: number) => {
    setLeadTimeDays(days);
    setExpectedDelivery(format(addDays(new Date(), days), 'yyyy-MM-dd'));
  };

  const handleCreate = async () => {
    if (!expectedDelivery) {
      toast({ title: 'กรุณาระบุวันที่คาดว่าจะส่ง', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get sale person info
      let salePersonName = 'Admin';
      let salePersonEmail = user?.email || '';
      if (user) {
        const { data: userData } = await supabase.from('users').select('full_name, email').eq('id', user.id).maybeSingle();
        if (userData?.full_name) salePersonName = userData.full_name;
        if (userData?.email) salePersonEmail = userData.email;
      }

      const { data: soData, error: soError } = await (supabase.from as any)('sale_orders')
        .insert({
          quote_id: quote.id,
          products: quote.products,
          subtotal: quote.subtotal,
          vat_amount: quote.vat_amount,
          grand_total: quote.grand_total,
          shipping_address: shippingAddress,
          shipping_method: shippingMethod,
          expected_delivery_date: expectedDelivery,
          standard_lead_time_days: leadTimeDays,
          delivery_notes: deliveryNotes,
          production_notes: productionNotes,
          sale_person_name: salePersonName,
          sale_person_email: salePersonEmail,
          created_by: user?.email || 'admin',
          status: 'confirmed',
        })
        .select()
        .single();

      if (soError) throw soError;

      // Update quote status
      await supabase
        .from('quote_requests')
        .update({
          has_sale_order: true,
          so_created_at: new Date().toISOString(),
          status: 'completed',
          completed_at: new Date().toISOString(),
        } as any)
        .eq('id', quote.id);

      // System message
      await supabase.from('quote_messages').insert({
        quote_id: quote.id,
        sender_role: 'system',
        sender_name: 'System',
        content: `✅ สร้าง Sale Order ${soData.so_number} เรียบร้อยแล้ว — กระบวนการขายเสร็จสิ้น`,
        message_type: 'status_change',
      });

      // Notify customer
      if (quote.created_by) {
        import('@/lib/notifications').then(({ createNotification }) => {
          createNotification({
            userId: quote.created_by!,
            type: 'sale_order_created',
            title: 'สร้าง Sale Order แล้ว',
            message: `Sale Order ${soData.so_number} สำหรับ ${quote.quote_number} ถูกสร้างเรียบร้อย`,
            priority: 'high',
            actionUrl: `/my-account/orders`,
            actionLabel: 'ดู Sale Order',
            linkType: 'sale_order',
            linkId: soData.id,
          });
        });
      }

      toast({ title: 'สร้าง Sale Order สำเร็จ', description: `เลขที่: ${soData.so_number}` });
      onOpenChange(false);
      onSuccess();
      navigate(`/admin/sale-orders/${soData.id}`);
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>สร้าง Sales Order</DialogTitle>
          <DialogDescription>สร้าง SO จากใบเสนอราคา {quote.quote_number}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* SO Number Auto */}
          <div>
            <Label>เลขที่ Sales Order</Label>
            <Input value="SO-YYYY-XXXX (สร้างอัตโนมัติ)" disabled className="mt-1 bg-muted" />
          </div>

          {/* Expected Delivery */}
          <div>
            <Label>วันที่คาดว่าจะจัดส่ง *</Label>
            <Input
              type="date"
              value={expectedDelivery}
              onChange={(e) => setExpectedDelivery(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ระยะเวลามาตรฐาน: {leadTimeDays} วัน (ปรับเปลี่ยนได้)
            </p>
          </div>

          {/* Lead Time */}
          <div>
            <Label>ระยะเวลามาตรฐาน (วัน)</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                value={leadTimeDays}
                onChange={(e) => handleLeadTimeChange(parseInt(e.target.value) || 7)}
                min={1}
                className="w-24"
              />
              <Button
                type="button"
                variant="link"
                size="sm"
                className="px-0 h-auto"
                onClick={() => handleLeadTimeChange(7)}
              >
                <CalendarDays className="w-3 h-3 mr-1" />
                ใช้ค่ามาตรฐาน (7 วัน)
              </Button>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <Label>ที่อยู่จัดส่ง *</Label>
            <Textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} rows={3} placeholder="กรอกที่อยู่จัดส่งสินค้า" className="mt-1" />
            {quote.customer_address && shippingAddress !== quote.customer_address && (
              <Button variant="link" size="sm" className="px-0 h-auto mt-1" onClick={() => setShippingAddress(quote.customer_address || '')}>
                ใช้ที่อยู่จากใบเสนอราคา
              </Button>
            )}
          </div>

          {/* Shipping Method */}
          <div>
            <Label>วิธีการจัดส่ง</Label>
            <Select value={shippingMethod} onValueChange={setShippingMethod}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">ลูกค้ามารับเอง</SelectItem>
                <SelectItem value="delivery">จัดส่งถึงที่</SelectItem>
                <SelectItem value="transport">ขนส่ง</SelectItem>
                <SelectItem value="other">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delivery Notes */}
          <div>
            <Label>หมายเหตุการจัดส่ง</Label>
            <Textarea value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} rows={2} placeholder="ข้อมูลเพิ่มเติมเกี่ยวกับการจัดส่ง..." className="mt-1" />
          </div>

          {/* Production Notes */}
          <div>
            <Label>หมายเหตุการผลิต</Label>
            <Textarea value={productionNotes} onChange={(e) => setProductionNotes(e.target.value)} rows={2} placeholder="ข้อมูลเพิ่มเติมสำหรับทีมผลิต..." className="mt-1" />
          </div>

          {/* Quote Summary */}
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm font-semibold mb-2 text-foreground">สรุปคำสั่งซื้อ</p>
            <div className="space-y-1 text-sm text-foreground">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ลูกค้า:</span>
                <span>{quote.customer_name}</span>
              </div>
              {quote.customer_company && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">บริษัท:</span>
                  <span>{quote.customer_company}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">จำนวนสินค้า:</span>
                <span>{quote.products.length} รายการ</span>
              </div>
              <Separator className="my-2" />
              {quote.products.slice(0, 5).map((p: any, i: number) => (
                <div key={i} className="text-xs text-muted-foreground">• {p.model || p.name} x{p.qty}</div>
              ))}
              {quote.products.length > 5 && <div className="text-xs text-muted-foreground">• +{quote.products.length - 5} รายการ</div>}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-foreground">
                <span>ยอดรวม:</span>
                <span className="text-primary">{formatCurrency(quote.grand_total)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>ยกเลิก</Button>
          <Button onClick={handleCreate} disabled={loading || !expectedDelivery}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            {loading ? 'กำลังสร้าง...' : 'สร้าง Sales Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

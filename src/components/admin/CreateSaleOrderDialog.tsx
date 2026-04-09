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
import { FileText, Loader2 } from 'lucide-react';

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
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
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [shippingAddress, setShippingAddress] = useState(quote.customer_address || '');
  const [shippingMethod, setShippingMethod] = useState('delivery');
  const [productionNotes, setProductionNotes] = useState('');

  const handleCreate = async () => {
    if (!expectedDelivery) {
      toast({ title: 'กรุณาระบุวันที่คาดว่าจะส่ง', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

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
          production_notes: productionNotes,
          created_by: user?.email || 'admin',
          status: 'confirmed',
        })
        .select()
        .single();

      if (soError) throw soError;

      // Update quote
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
          <DialogTitle>สร้าง Sale Order</DialogTitle>
          <DialogDescription>สร้าง Sale Order จากใบเสนอราคา {quote.quote_number}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <Label>วันที่คาดว่าจะส่งสินค้า *</Label>
            <Input type="date" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label>ที่อยู่จัดส่ง *</Label>
            <Textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} rows={3} placeholder="กรอกที่อยู่จัดส่งสินค้า" className="mt-1" />
            {quote.customer_address && shippingAddress !== quote.customer_address && (
              <Button variant="link" size="sm" className="px-0 h-auto mt-1" onClick={() => setShippingAddress(quote.customer_address || '')}>
                ใช้ที่อยู่จากใบเสนอราคา
              </Button>
            )}
          </div>

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

          <div>
            <Label>หมายเหตุการผลิต</Label>
            <Textarea value={productionNotes} onChange={(e) => setProductionNotes(e.target.value)} rows={3} placeholder="ข้อมูลเพิ่มเติมสำหรับทีมผลิต..." className="mt-1" />
          </div>

          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm font-semibold mb-2 text-foreground">รายการสินค้า</p>
            <div className="space-y-1 text-sm text-foreground">
              {quote.products.slice(0, 5).map((p: any, i: number) => (
                <div key={i}>• {p.model || p.name} x{p.qty}</div>
              ))}
              {quote.products.length > 5 && <div className="text-muted-foreground">• +{quote.products.length - 5} รายการ</div>}
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-foreground">
              <span>ยอดรวม:</span>
              <span className="text-primary">{formatCurrency(quote.grand_total)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>ยกเลิก</Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            {loading ? 'กำลังสร้าง...' : 'สร้าง Sale Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import RepairPartsTable, { type RepairPart } from './RepairPartsTable';

interface Props {
  repairOrder: any;
  onUpdated: () => void;
}

export default function RepairQuoteForm({ repairOrder, onUpdated }: Props) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [laborCost, setLaborCost] = useState(repairOrder.labor_cost || 0);
  const [additionalCost, setAdditionalCost] = useState(repairOrder.additional_cost || 0);
  const [discountAmount, setDiscountAmount] = useState(repairOrder.discount_amount || 0);
  const [message, setMessage] = useState(repairOrder.customer_quote_message || '');
  const [parts, setParts] = useState<RepairPart[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingParts, setLoadingParts] = useState(true);

  useEffect(() => {
    loadParts();
  }, [repairOrder.id]);

  const loadParts = async () => {
    setLoadingParts(true);
    const { data } = await (supabase as any)
      .from('repair_order_parts')
      .select('*')
      .eq('repair_order_id', repairOrder.id)
      .order('sort_order');
    if (data) {
      setParts(data.map((p: any) => ({
        id: p.id,
        part_name: p.part_name,
        part_sku: p.part_sku || '',
        part_description: p.part_description || '',
        quantity: p.quantity,
        unit_price: Number(p.unit_price),
        product_id: p.product_id,
      })));
    }
    setLoadingParts(false);
  };

  const partsTotal = parts.reduce((s, p) => s + p.quantity * p.unit_price, 0);
  const laborWHT = Math.round(laborCost * 3 / 100 * 100) / 100;
  const partsVAT = Math.round((partsTotal + additionalCost) * 7 / 100 * 100) / 100;
  const subtotalBeforeTax = laborCost + partsTotal + additionalCost - discountAmount;
  const grandTotal = Math.round((subtotalBeforeTax + partsVAT - laborWHT) * 100) / 100;

  const handleSubmitQuote = async () => {
    setSaving(true);
    try {
      // Delete old parts, insert new
      await (supabase as any).from('repair_order_parts').delete().eq('repair_order_id', repairOrder.id);
      if (parts.length > 0) {
        const partsToInsert = parts.map((p, i) => ({
          repair_order_id: repairOrder.id,
          part_name: p.part_name,
          part_sku: p.part_sku || null,
          part_description: p.part_description || null,
          quantity: p.quantity,
          unit_price: p.unit_price,
          product_id: p.product_id || null,
          sort_order: i,
        }));
        await (supabase as any).from('repair_order_parts').insert(partsToInsert);
      }

      // Update RO costs
      await (supabase as any).from('repair_orders').update({
        labor_cost: laborCost,
        additional_cost: additionalCost,
        discount_amount: discountAmount,
        customer_quote_message: message,
        updated_at: new Date().toISOString(),
      }).eq('id', repairOrder.id);

      // Transition to quoted
      const { data } = await (supabase as any).rpc('validate_repair_status_transition', {
        p_repair_order_id: repairOrder.id,
        p_new_status: 'quoted',
        p_actor_id: profile?.id,
        p_notes: 'ส่งใบเสนอราคาให้ลูกค้า',
      });
      if (data && !data.success) throw new Error(data.error);

      toast({ title: 'ส่งใบเสนอราคาให้ลูกค้าแล้ว' });
      onUpdated();
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>ค่าแรง (฿)</Label>
          <Input type="number" min={0} value={laborCost || ''} onChange={e => setLaborCost(parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <Label>ค่าบริการเพิ่มเติม (฿)</Label>
          <Input type="number" min={0} value={additionalCost || ''} onChange={e => setAdditionalCost(parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <div>
        <Label className="mb-2 block">ชิ้นส่วน</Label>
        {loadingParts ? <p className="text-sm text-muted-foreground">กำลังโหลด...</p> : (
          <RepairPartsTable parts={parts} onChange={setParts} />
        )}
      </div>

      <div>
        <Label>ส่วนลด (฿)</Label>
        <Input type="number" min={0} value={discountAmount || ''} onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)} />
      </div>

      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
        <div className="flex justify-between"><span>ค่าแรง</span><span>฿{laborCost.toLocaleString()}</span></div>
        {laborWHT > 0 && <div className="flex justify-between text-orange-600 dark:text-orange-400"><span>หัก ณ ที่จ่าย 3% (ค่าแรง)</span><span>-฿{laborWHT.toLocaleString()}</span></div>}
        <div className="flex justify-between"><span>ค่าชิ้นส่วน</span><span>฿{partsTotal.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>ค่าบริการเพิ่มเติม</span><span>฿{additionalCost.toLocaleString()}</span></div>
        {discountAmount > 0 && <div className="flex justify-between text-destructive"><span>ส่วนลด</span><span>-฿{discountAmount.toLocaleString()}</span></div>}
        {partsVAT > 0 && <div className="flex justify-between"><span>VAT 7% (อะไหล่+บริการ)</span><span>฿{partsVAT.toLocaleString()}</span></div>}
        <div className="flex justify-between font-bold text-base border-t pt-1"><span>รวมทั้งสิ้น</span><span>฿{grandTotal.toLocaleString()}</span></div>
      </div>

      <div>
        <Label>ข้อความถึงลูกค้า</Label>
        <Textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="อธิบายรายละเอียดค่าใช้จ่ายให้ลูกค้า..." />
      </div>

      <Button onClick={handleSubmitQuote} disabled={saving} className="w-full">
        {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        ส่งใบเสนอราคาให้ลูกค้า
      </Button>
    </div>
  );
}

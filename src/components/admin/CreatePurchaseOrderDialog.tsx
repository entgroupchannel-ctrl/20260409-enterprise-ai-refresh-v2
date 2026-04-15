import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Send, Loader2 } from 'lucide-react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD', 'THB'];

interface Supplier { id: string; company_name: string; currency: string | null; }

interface LineItem {
  product_name: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId?: string | null;
  onSaved?: () => void;
}

export default function CreatePurchaseOrderDialog({ open, onOpenChange, editId, onSaved }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [saving, setSaving] = useState(false);

  const [supplierId, setSupplierId] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState<LineItem[]>([{ product_name: '', description: '', quantity: 1, unit_price: 0 }]);
  const [shippingCost, setShippingCost] = useState(0);
  const [otherCost, setOtherCost] = useState(0);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const grandTotal = subtotal + shippingCost + otherCost;

  useEffect(() => {
    if (!open) return;
    supabase.from('suppliers').select('id, company_name, currency')
      .eq('status', 'approved').is('deleted_at', null)
      .then(({ data }) => setSuppliers((data as Supplier[]) || []));
  }, [open]);

  useEffect(() => {
    if (!editId || !open) return;
    supabase.from('purchase_orders').select('*').eq('id', editId).single()
      .then(({ data }) => {
        if (!data) return;
        const d = data as any;
        setSupplierId(d.supplier_id);
        setCurrency(d.currency || 'USD');
        setItems(d.items?.length ? d.items : [{ product_name: '', description: '', quantity: 1, unit_price: 0 }]);
        setShippingCost(d.shipping_cost || 0);
        setOtherCost(d.other_cost || 0);
        setOrderDate(d.order_date || '');
        setExpectedDelivery(d.expected_delivery || '');
        setNotes(d.notes || '');
      });
  }, [editId, open]);

  // Auto-set currency from supplier
  useEffect(() => {
    const sup = suppliers.find(s => s.id === supplierId);
    if (sup?.currency) setCurrency(sup.currency);
  }, [supplierId, suppliers]);

  const resetForm = () => {
    setSupplierId(''); setCurrency('USD');
    setItems([{ product_name: '', description: '', quantity: 1, unit_price: 0 }]);
    setShippingCost(0); setOtherCost(0);
    setOrderDate(new Date().toISOString().split('T')[0]);
    setExpectedDelivery(''); setNotes('');
  };

  const addItem = () => setItems(prev => [...prev, { product_name: '', description: '', quantity: 1, unit_price: 0 }]);

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (status: 'draft' | 'sent') => {
    if (!supplierId) { toast.error('กรุณาเลือก Supplier'); return; }
    if (items.every(i => !i.product_name.trim())) { toast.error('กรุณาเพิ่มรายการสินค้า'); return; }

    setSaving(true);
    try {
      const payload = {
        supplier_id: supplierId,
        items: items.filter(i => i.product_name.trim()) as unknown as import('@/integrations/supabase/types').Json,
        subtotal,
        shipping_cost: shippingCost || null,
        other_cost: otherCost || null,
        grand_total: grandTotal,
        currency,
        order_date: orderDate || null,
        expected_delivery: expectedDelivery || null,
        notes: notes || null,
        status,
      };

      if (editId) {
        const { error } = await supabase.from('purchase_orders').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('purchase_orders').insert(payload);
        if (error) throw error;
      }

      toast.success(status === 'draft' ? 'บันทึกร่างแล้ว' : 'ส่ง PO แล้ว');
      resetForm();
      onOpenChange(false);
      onSaved?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editId ? 'แก้ไขใบสั่งซื้อ' : 'สร้างใบสั่งซื้อ (PO)'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Supplier + Currency + Dates */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Supplier *</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger className="h-9"><SelectValue placeholder="เลือก Supplier" /></SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.company_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">สกุลเงิน</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">วันที่สั่ง</Label>
              <Input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="h-9" />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">กำหนดส่ง</Label>
            <Input type="date" value={expectedDelivery} onChange={e => setExpectedDelivery(e.target.value)} className="h-9 w-48" />
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">รายการสินค้า</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-3 h-3 mr-1" />เพิ่มรายการ
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">ชื่อสินค้า</TableHead>
                  <TableHead className="w-[25%]">รายละเอียด</TableHead>
                  <TableHead className="w-[12%] text-right">จำนวน</TableHead>
                  <TableHead className="w-[15%] text-right">ราคา/หน่วย</TableHead>
                  <TableHead className="w-[13%] text-right">รวม</TableHead>
                  <TableHead className="w-[5%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="p-1">
                      <Input value={item.product_name} onChange={e => updateItem(idx, 'product_name', e.target.value)} className="h-8 text-xs" placeholder="ชื่อสินค้า" />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} className="h-8 text-xs" placeholder="รายละเอียด" />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input type="number" min={1} value={item.quantity || ''} onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)} className="h-8 text-xs text-right" />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input type="number" min={0} step="0.01" value={item.unit_price || ''} onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value) || 0)} className="h-8 text-xs text-right" />
                    </TableCell>
                    <TableCell className="p-1 text-right font-mono text-xs">
                      {fmt(item.quantity * item.unit_price)}
                    </TableCell>
                    <TableCell className="p-1">
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(idx)} disabled={items.length <= 1}>
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Costs Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">ค่าขนส่ง</Label>
              <Input type="number" min={0} step="0.01" value={shippingCost || ''} onChange={e => setShippingCost(parseFloat(e.target.value) || 0)} className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">ค่าใช้จ่ายอื่น</Label>
              <Input type="number" min={0} step="0.01" value={otherCost || ''} onChange={e => setOtherCost(parseFloat(e.target.value) || 0)} className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <Input value={notes} onChange={e => setNotes(e.target.value)} className="h-9" placeholder="หมายเหตุ" />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 space-y-1">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-mono">{fmt(subtotal)}</span></div>
            {shippingCost > 0 && <div className="flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span className="font-mono">{fmt(shippingCost)}</span></div>}
            {otherCost > 0 && <div className="flex justify-between text-sm text-muted-foreground"><span>Other</span><span className="font-mono">{fmt(otherCost)}</span></div>}
            <div className="flex justify-between font-bold text-base border-t pt-1">
              <span>Grand Total ({currency})</span>
              <span>{fmt(grandTotal)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
              บันทึกร่าง
            </Button>
            <Button onClick={() => handleSave('sent')} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
              ส่ง PO
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  RadioGroup, RadioGroupItem 
} from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxInvoiceId: string;
  onSuccess?: () => void;
}

interface ItemSelection {
  selected: boolean;
  mode: 'qty' | 'amount';
  qty: string;
  amount: string;
}

const REASON_CODES = [
  { value: 'return', label: 'สินค้าคืน' },
  { value: 'damaged', label: 'ของเสียหาย' },
  { value: 'price_correction', label: 'ปรับปรุงราคา' },
  { value: 'quantity_error', label: 'จำนวนผิดพลาด' },
  { value: 'additional_discount', label: 'ส่วนลดเพิ่มเติม' },
  { value: 'service_cancelled', label: 'ยกเลิกบริการ' },
  { value: 'other', label: 'อื่นๆ' },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('th-TH', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(n);

export default function CreateCreditNoteDialog({
  open,
  onOpenChange,
  taxInvoiceId,
  onSuccess,
}: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [taxInvoice, setTaxInvoice] = useState<any>(null);
  const [taxInvoiceItems, setTaxInvoiceItems] = useState<any[]>([]);
  const [existingCN, setExistingCN] = useState<any>(null);
  
  const [reasonCode, setReasonCode] = useState<string>('');
  const [reasonDetail, setReasonDetail] = useState('');
  const [adjustmentTarget, setAdjustmentTarget] = useState<'payment' | 'invoice' | 'both'>('both');
  const [selectedItems, setSelectedItems] = useState<Record<string, ItemSelection>>({});
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open || !taxInvoiceId) return;
    
    const load = async () => {
      setLoading(true);
      try {
        const { data: ti } = await (supabase as any)
          .from('tax_invoices')
          .select('*')
          .eq('id', taxInvoiceId)
          .maybeSingle();
        
        if (!ti) throw new Error('ไม่พบใบกำกับภาษี');
        setTaxInvoice(ti);
        
        const { data: items } = await (supabase as any)
          .from('tax_invoice_items')
          .select('*')
          .eq('tax_invoice_id', taxInvoiceId)
          .order('display_order', { ascending: true });
        
        setTaxInvoiceItems(items || []);
        
        const selMap: Record<string, ItemSelection> = {};
        (items || []).forEach((it: any) => {
          selMap[it.id] = { selected: false, mode: 'qty', qty: '', amount: '' };
        });
        setSelectedItems(selMap);
        
        const { data: existing } = await (supabase as any)
          .from('credit_notes')
          .select('id, credit_note_number, status')
          .eq('original_tax_invoice_id', taxInvoiceId)
          .eq('status', 'issued')
          .is('deleted_at', null)
          .maybeSingle();
        
        setExistingCN(existing);
      } catch (e: any) {
        toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [open, taxInvoiceId]);

  useEffect(() => {
    if (!open) {
      setReasonCode('');
      setReasonDetail('');
      setAdjustmentTarget('both');
      setSelectedItems({});
      setNotes('');
      setExistingCN(null);
    }
  }, [open]);

  const getItemLineTotal = (item: any, sel: ItemSelection): number => {
    if (!sel.selected) return 0;
    if (sel.mode === 'amount') {
      const amt = parseFloat(sel.amount) || 0;
      return Math.min(amt, Number(item.line_total || item.quantity * item.unit_price));
    }
    const qty = parseFloat(sel.qty) || 0;
    return qty * Number(item.unit_price || 0);
  };

  const selectedSubtotal = taxInvoiceItems.reduce((sum, item) => {
    const sel = selectedItems[item.id];
    if (!sel?.selected) return sum;
    return sum + getItemLineTotal(item, sel);
  }, 0);
  
  const vatPercent = Number(taxInvoice?.vat_amount || 0) > 0 && Number(taxInvoice?.subtotal || 0) > 0
    ? (Number(taxInvoice.vat_amount) / Number(taxInvoice.subtotal)) * 100
    : 7;
  const vatAmount = selectedSubtotal * (vatPercent / 100);
  const grandTotal = selectedSubtotal + vatAmount;

  const hasSelectedItems = Object.entries(selectedItems).some(([id, s]) => {
    if (!s.selected) return false;
    if (s.mode === 'amount') return (parseFloat(s.amount) || 0) > 0;
    return (parseFloat(s.qty) || 0) > 0;
  });

  const handleSubmit = async () => {
    if (!reasonCode) {
      toast({ title: 'กรุณาเลือกเหตุผล', variant: 'destructive' });
      return;
    }
    if (!reasonDetail.trim()) {
      toast({ title: 'กรุณาระบุรายละเอียดเหตุผล', variant: 'destructive' });
      return;
    }
    if (!hasSelectedItems) {
      toast({ title: 'กรุณาเลือกรายการสินค้าที่จะลด', variant: 'destructive' });
      return;
    }
    if (grandTotal > Number(taxInvoice.grand_total)) {
      toast({ 
        title: 'ยอดรวมเกินใบกำกับภาษีต้นฉบับ', 
        description: `สูงสุด: ฿${formatCurrency(Number(taxInvoice.grand_total))}`,
        variant: 'destructive' 
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const { data: cn, error: cnError } = await (supabase as any)
        .from('credit_notes')
        .insert({
          credit_note_number: '',
          original_tax_invoice_id: taxInvoiceId,
          original_invoice_id: taxInvoice.invoice_id,
          customer_id: taxInvoice.customer_id,
          customer_name: taxInvoice.customer_name,
          customer_company: taxInvoice.customer_company,
          customer_address: taxInvoice.customer_address,
          customer_tax_id: taxInvoice.customer_tax_id,
          customer_branch_type: taxInvoice.customer_branch_type,
          customer_branch_code: taxInvoice.customer_branch_code,
          customer_branch_name: taxInvoice.customer_branch_name,
          credit_note_date: new Date().toISOString().slice(0, 10),
          reason_code: reasonCode,
          reason_detail: reasonDetail.trim(),
          subtotal: selectedSubtotal,
          vat_percent: vatPercent,
          vat_amount: vatAmount,
          grand_total: grandTotal,
          adjustment_target: adjustmentTarget,
          status: 'issued',
          notes: notes.trim() || null,
          created_by: authUser.id,
        })
        .select('id, credit_note_number')
        .single();

      if (cnError) throw cnError;

      const itemsToInsert = taxInvoiceItems
        .filter(item => {
          const sel = selectedItems[item.id];
          if (!sel?.selected) return false;
          if (sel.mode === 'amount') return (parseFloat(sel.amount) || 0) > 0;
          return (parseFloat(sel.qty) || 0) > 0;
        })
        .map((item, idx) => {
          const sel = selectedItems[item.id];
          if (sel.mode === 'amount') {
            const amt = parseFloat(sel.amount) || 0;
            return {
              credit_note_id: cn.id,
              original_item_id: item.id,
              product_id: item.product_id,
              product_name: item.product_name,
              product_description: item.product_description,
              sku: item.sku,
              quantity: 1,
              unit: 'รายการ',
              unit_price: amt,
              line_total: amt,
              display_order: idx,
            };
          }
          const qty = parseFloat(sel.qty) || 0;
          return {
            credit_note_id: cn.id,
            original_item_id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_description: item.product_description,
            sku: item.sku,
            quantity: qty,
            unit: item.unit,
            unit_price: Number(item.unit_price),
            line_total: qty * Number(item.unit_price),
            display_order: idx,
          };
        });

      const { error: itemsError } = await (supabase as any)
        .from('credit_note_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // 🔔 Notify customer (in-app + email)
      const cnAmount = formatCurrency(grandTotal);
      const customerId = taxInvoice.customer_id;
      const customerEmailAddr = (taxInvoice as any).customer_email;
      if (customerId || customerEmailAddr) {
        import('@/lib/notifications').then(({ createNotification, sendQuoteStatusEmail }) => {
          if (customerId) {
            createNotification({
              userId: customerId,
              type: 'credit_note_created',
              title: 'ออกใบลดหนี้ใหม่',
              message: `ใบลดหนี้ ${cn.credit_note_number} ยอดลด ${cnAmount} บาท (เหตุผล: ${reasonDetail.trim()})`,
              priority: 'high',
              actionUrl: `/my-account/documents`,
              actionLabel: 'ดูเอกสาร',
              linkType: 'credit_note',
              linkId: cn.id,
            });
          }
          if (customerEmailAddr) {
            sendQuoteStatusEmail({
              recipientEmail: customerEmailAddr,
              customerName: taxInvoice.customer_name,
              status: 'credit_note_created',
              invoiceNumber: cn.credit_note_number,
              amount: cnAmount,
              note: reasonDetail.trim(),
              viewUrl: `https://www.entgroup.co.th/my-account/documents`,
            });
          }
        });
      }

      toast({
        title: '✅ สร้างใบลดหนี้สำเร็จ',
        description: cn.credit_note_number,
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
      navigate(`/admin/credit-notes/${cn.id}`);
    } catch (e: any) {
      toast({ title: 'ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (existingCN) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ใบกำกับภาษีนี้มีใบลดหนี้แล้ว</DialogTitle>
          </DialogHeader>
          <div className="flex items-start gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p>ใบกำกับภาษีนี้ได้ออกใบลดหนี้ <strong>{existingCN.credit_note_number}</strong> ไปแล้ว</p>
              <p className="text-muted-foreground mt-1">
                สามารถออก CN ได้เพียง 1 ใบต่อใบกำกับภาษี หากต้องการออกใหม่ โปรด void ใบเดิมก่อน
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>ปิด</Button>
            <Button onClick={() => {
              onOpenChange(false);
              navigate(`/admin/credit-notes/${existingCN.id}`);
            }}>
              ดูใบเดิม
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>สร้างใบลดหนี้ (Credit Note)</DialogTitle>
          <p className="text-sm text-muted-foreground">
            อ้างอิงใบกำกับภาษี: {taxInvoice?.tax_invoice_number}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>เหตุผล <span className="text-destructive">*</span></Label>
            <Select value={reasonCode} onValueChange={setReasonCode}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกเหตุผล" />
              </SelectTrigger>
              <SelectContent>
                {REASON_CODES.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>รายละเอียดเหตุผล <span className="text-destructive">*</span></Label>
            <Textarea
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              placeholder="อธิบายเหตุผลอย่างชัดเจน (ตามกฎหมาย)"
              rows={3}
            />
          </div>

          <div>
            <Label>รายการสินค้าที่จะลด <span className="text-destructive">*</span></Label>
            <div className="border rounded-lg divide-y">
              {taxInvoiceItems.map(item => {
                const sel = selectedItems[item.id] || { selected: false, mode: 'qty' as const, qty: '', amount: '' };
                const maxQty = Number(item.quantity);
                const maxAmount = Number(item.line_total || maxQty * Number(item.unit_price));
                return (
                  <div key={item.id} className="p-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={sel.selected}
                        onCheckedChange={(v) => {
                          setSelectedItems(prev => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], selected: !!v }
                          }));
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.product_name}</div>
                        <div className="text-xs text-muted-foreground">
                          ฿{formatCurrency(Number(item.unit_price))} / {item.unit} 
                          — เดิม {maxQty} {item.unit} (รวม ฿{formatCurrency(maxAmount)})
                        </div>
                      </div>
                    </div>

                    {sel.selected && (
                      <div className="ml-9 space-y-2">
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                            <input
                              type="radio"
                              name={`mode-${item.id}`}
                              checked={sel.mode === 'qty'}
                              onChange={() => setSelectedItems(prev => ({
                                ...prev,
                                [item.id]: { ...prev[item.id], mode: 'qty', amount: '' }
                              }))}
                              className="accent-primary"
                            />
                            ลดจำนวน
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                            <input
                              type="radio"
                              name={`mode-${item.id}`}
                              checked={sel.mode === 'amount'}
                              onChange={() => setSelectedItems(prev => ({
                                ...prev,
                                [item.id]: { ...prev[item.id], mode: 'amount', qty: '' }
                              }))}
                              className="accent-primary"
                            />
                            ลดจำนวนเงิน
                          </label>
                        </div>

                        {sel.mode === 'qty' ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max={maxQty}
                              step="0.01"
                              value={sel.qty}
                              placeholder={`สูงสุด ${maxQty}`}
                              onChange={(e) => {
                                const raw = e.target.value;
                                if (raw === '') {
                                  setSelectedItems(prev => ({
                                    ...prev,
                                    [item.id]: { ...prev[item.id], qty: '' }
                                  }));
                                  return;
                                }
                                const v = parseFloat(raw);
                                if (!isNaN(v)) {
                                  setSelectedItems(prev => ({
                                    ...prev,
                                    [item.id]: { ...prev[item.id], qty: String(Math.min(maxQty, Math.max(0, v))) }
                                  }));
                                }
                              }}
                              className="w-32"
                            />
                            <span className="text-xs text-muted-foreground">{item.unit}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max={maxAmount}
                              step="0.01"
                              value={sel.amount}
                              placeholder={`สูงสุด ${formatCurrency(maxAmount)}`}
                              onChange={(e) => {
                                const raw = e.target.value;
                                if (raw === '') {
                                  setSelectedItems(prev => ({
                                    ...prev,
                                    [item.id]: { ...prev[item.id], amount: '' }
                                  }));
                                  return;
                                }
                                const v = parseFloat(raw);
                                if (!isNaN(v)) {
                                  setSelectedItems(prev => ({
                                    ...prev,
                                    [item.id]: { ...prev[item.id], amount: String(Math.min(maxAmount, Math.max(0, v))) }
                                  }));
                                }
                              }}
                              className="w-40"
                            />
                            <span className="text-xs text-muted-foreground">บาท</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {hasSelectedItems && (
            <div className="p-3 bg-muted/30 rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ยอดก่อน VAT:</span>
                <span className="font-mono">฿{formatCurrency(selectedSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT {vatPercent.toFixed(0)}%:</span>
                <span className="font-mono">฿{formatCurrency(vatAmount)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t font-semibold">
                <span>ยอดรวม (ลดหนี้):</span>
                <span className="font-mono text-destructive">-฿{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          )}

          <div>
            <Label>ผลกระทบต่อเอกสาร</Label>
            <RadioGroup value={adjustmentTarget} onValueChange={(v: any) => setAdjustmentTarget(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="payment" id="r-payment" />
                <Label htmlFor="r-payment" className="font-normal cursor-pointer">
                  💰 ลดการชำระเงิน (refund)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="invoice" id="r-invoice" />
                <Label htmlFor="r-invoice" className="font-normal cursor-pointer">
                  📄 ลดยอดใบวางบิล (discount)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="r-both" />
                <Label htmlFor="r-both" className="font-normal cursor-pointer">
                  🔄 ทั้งสอง
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>หมายเหตุ (ไม่บังคับ)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="บันทึกภายในหรือข้อมูลเพิ่มเติม"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
          <Button onClick={handleSubmit} disabled={saving || !hasSelectedItems}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            สร้างใบลดหนี้
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

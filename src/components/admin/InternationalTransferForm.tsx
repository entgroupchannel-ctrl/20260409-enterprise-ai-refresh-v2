import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, Send, RefreshCw, ChevronDown, Loader2 } from 'lucide-react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD'] as const;
type Currency = typeof CURRENCIES[number];

interface Supplier {
  id: string; company_name: string;
  bank_name: string | null; bank_address: string | null;
  bank_account_number: string | null; bank_account_name: string | null;
  swift_code: string | null; iban: string | null;
  intermediary_bank: string | null; intermediary_swift: string | null;
  currency: string | null;
}
interface PO { id: string; po_number: string; grand_total: number | null; currency: string | null; status: string; pi_number?: string | null; }
interface Props { editId?: string | null; onSaved?: () => void; }

export default function InternationalTransferForm({ editId, onSaved }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pos, setPos] = useState<PO[]>([]);
  const [saving, setSaving] = useState(false);
  const [fetchingRate, setFetchingRate] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [showFees, setShowFees] = useState(false);

  const [supplierId, setSupplierId] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [iban, setIban] = useState('');
  const [intermediaryBank, setIntermediaryBank] = useState('');
  const [intermediarySwift, setIntermediarySwift] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [amountThb, setAmountThb] = useState<number>(0);
  const [selectedPoIds, setSelectedPoIds] = useState<string[]>([]);
  const [invoiceRef, setInvoiceRef] = useState('');
  const [purpose, setPurpose] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [priority, setPriority] = useState('normal');
  const [transferFee, setTransferFee] = useState<number>(0);
  const [bankFee, setBankFee] = useState<number>(0);
  const [otherFee, setOtherFee] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const totalFee = transferFee + bankFee + otherFee;
  const totalCostThb = amountThb + totalFee;
  const selectedSupplier = suppliers.find(s => s.id === supplierId);
  const poTotal = pos.filter(p => selectedPoIds.includes(p.id)).reduce((s, p) => s + (p.grand_total || 0), 0);
  const fmt = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  useEffect(() => {
    supabase.from('suppliers').select('*').eq('status', 'approved').is('deleted_at', null)
      .then(({ data }) => setSuppliers((data as Supplier[]) || []));
  }, []);

  useEffect(() => {
    if (!selectedSupplier) return;
    setBankName(selectedSupplier.bank_name || '');
    setBankAddress(selectedSupplier.bank_address || '');
    setBankAccount(selectedSupplier.bank_account_number || '');
    setBankAccountName(selectedSupplier.bank_account_name || '');
    setSwiftCode(selectedSupplier.swift_code || '');
    setIban(selectedSupplier.iban || '');
    setIntermediaryBank(selectedSupplier.intermediary_bank || '');
    setIntermediarySwift(selectedSupplier.intermediary_swift || '');
    if (selectedSupplier.currency) setCurrency(selectedSupplier.currency as Currency);
    supabase.from('purchase_orders').select('id, po_number, grand_total, currency, status, pi_number')
      .eq('supplier_id', selectedSupplier.id).is('deleted_at', null)
      .then(({ data }) => setPos((data as PO[]) || []));
  }, [supplierId]);

  useEffect(() => { setAmountThb(amount * exchangeRate); }, [amount, exchangeRate]);

  useEffect(() => {
    if (!editId) return;
    supabase.from('international_transfer_requests').select('*').eq('id', editId).single()
      .then(({ data }) => {
        if (!data) return;
        const d = data as any;
        setSupplierId(d.supplier_id); setBankName(d.bank_name || '');
        setBankAddress(d.bank_address || ''); setBankAccount(d.bank_account_number || '');
        setBankAccountName(d.bank_account_name || ''); setSwiftCode(d.swift_code || '');
        setIban(d.iban || ''); setIntermediaryBank(d.intermediary_bank || '');
        setIntermediarySwift(d.intermediary_swift || '');
        setAmount(d.amount || 0); setCurrency(d.currency || 'USD');
        setExchangeRate(d.exchange_rate || 0); setInvoiceRef(d.invoice_reference || '');
        setPurpose(d.purpose || ''); setDueDate(d.due_date || '');
        setTransferDate(d.requested_transfer_date || ''); setPriority(d.priority || 'normal');
        setTransferFee(d.transfer_fee || 0); setBankFee(d.bank_fee || 0);
        setOtherFee(d.other_fee || 0); setNotes(d.notes || '');
        setSelectedPoIds(d.purchase_order_ids || []);
      });
  }, [editId]);

  const fetchRate = useCallback(async () => {
    setFetchingRate(true);
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
      const json = await res.json();
      const rate = json.rates?.THB;
      if (rate) { setExchangeRate(rate); toast.success(`${currency}/THB = ${rate.toFixed(4)}`); }
      else toast.error('ไม่พบอัตราแลกเปลี่ยน');
    } catch { toast.error('ดึงอัตราแลกเปลี่ยนไม่ได้ กรุณากรอกเอง'); }
    finally { setFetchingRate(false); }
  }, [currency]);

  const handleSave = async (status: 'draft' | 'pending') => {
    if (!supplierId) { toast.error('กรุณาเลือก Supplier'); return; }
    if (!amount || amount <= 0) { toast.error('กรุณาระบุจำนวนเงิน'); return; }
    if (!purpose.trim()) { toast.error('กรุณาระบุวัตถุประสงค์'); return; }
    setSaving(true);
    try {
      const payload = {
        supplier_id: supplierId, supplier_name: selectedSupplier?.company_name || '',
        bank_name: bankName, bank_address: bankAddress, bank_account_number: bankAccount,
        bank_account_name: bankAccountName, swift_code: swiftCode,
        iban: iban || null, intermediary_bank: intermediaryBank || null,
        intermediary_swift: intermediarySwift || null,
        amount, currency, exchange_rate: exchangeRate || null, amount_thb: amountThb || null,
        purchase_order_ids: selectedPoIds.length > 0 ? selectedPoIds : null,
        invoice_reference: invoiceRef || null, purpose,
        due_date: dueDate || null, requested_transfer_date: transferDate || null, priority,
        transfer_fee: transferFee || null, bank_fee: bankFee || null, other_fee: otherFee || null,
        total_fee: totalFee || null, total_cost_thb: totalCostThb || null,
        notes: notes || null, status,
      };
      let transferId = editId;
      if (editId) {
        const { error } = await supabase.from('international_transfer_requests').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('international_transfer_requests').insert(payload).select('id').single();
        if (error) throw error;
        transferId = data.id;
      }
      if (files.length > 0 && transferId) {
        for (const file of files) {
          const path = `${supplierId}/${transferId}/${Date.now()}_${file.name}`;
          const { error: upErr } = await supabase.storage.from('supplier-documents').upload(path, file);
          if (upErr) { toast.error(`อัปโหลด ${file.name} ล้มเหลว`); continue; }
          const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
          await supabase.from('supplier_documents').insert({
            supplier_id: supplierId, transfer_request_id: transferId,
            document_type: 'proforma_invoice', title: file.name,
            file_name: file.name, file_url: urlData.publicUrl, file_size: file.size,
            uploaded_by: (await supabase.auth.getUser()).data.user?.id || null,
          });
        }
      }
      toast.success(status === 'draft' ? 'บันทึกร่างแล้ว' : 'ส่งอนุมัติแล้ว');
      onSaved?.();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const Hdr = ({ title }: { title: string }) => (
    <p className="text-sm font-semibold text-foreground border-b pb-1">{title}</p>
  );

  return (
    <Card>
      <CardContent className="pt-6 space-y-5">
        {/* ── Row 1: Supplier + Amount ── */}
        <div className="space-y-3">
          <Hdr title="Supplier & จำนวนเงิน" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Supplier *</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger className="h-9"><SelectValue placeholder="เลือก Supplier..." /></SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.company_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">จำนวนเงิน *</Label>
              <Input type="number" min={0} step="0.01" value={amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">สกุลเงิน</Label>
              <Select value={currency} onValueChange={v => setCurrency(v as Currency)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          {/* Exchange rate row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">อัตราแลกเปลี่ยน (THB)</Label>
              <div className="flex gap-1">
                <Input type="number" min={0} step="0.0001" value={exchangeRate || ''} onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)} className="h-9" />
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={fetchRate} disabled={fetchingRate}>
                  <RefreshCw className={`h-3.5 w-3.5 ${fetchingRate ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <div className="flex items-end pb-1">
              <div className="px-3 py-1.5 rounded-md bg-muted text-sm">
                เทียบเท่า <span className="font-bold">฿{fmt(amountThb)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">วันที่โอน</Label>
              <Input type="date" value={transferDate} onChange={e => setTransferDate(e.target.value)} className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Bank (collapsed — auto-filled) ── */}
        {supplierId && (
          <Collapsible open={showBank} onOpenChange={setShowBank}>
            <CollapsibleTrigger className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
              <ChevronDown className={`w-3 h-3 transition-transform ${showBank ? 'rotate-180' : ''}`} />
              Bank: {bankName || '—'} • SWIFT: {swiftCode || '—'} • A/C: {bankAccount || '—'}
              {!showBank && ' (คลิกเพื่อแก้ไข)'}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1"><Label className="text-xs">Bank Name</Label><Input value={bankName} onChange={e => setBankName(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">Account No.</Label><Input value={bankAccount} onChange={e => setBankAccount(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">SWIFT</Label><Input value={swiftCode} onChange={e => setSwiftCode(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">Account Name</Label><Input value={bankAccountName} onChange={e => setBankAccountName(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">Bank Address</Label><Input value={bankAddress} onChange={e => setBankAddress(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">IBAN</Label><Input value={iban} onChange={e => setIban(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">Intermediary Bank</Label><Input value={intermediaryBank} onChange={e => setIntermediaryBank(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">Intermediary SWIFT</Label><Input value={intermediarySwift} onChange={e => setIntermediarySwift(e.target.value)} className="h-9" /></div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* ── PO Reference + Purpose ── */}
        <div className="space-y-3">
          <Hdr title="อ้างอิงและวัตถุประสงค์" />
          {pos.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 p-2 rounded-md bg-muted/30">
                {pos.map(po => (
                  <label key={po.id} className="flex items-center gap-1.5 text-xs cursor-pointer px-2 py-1 rounded hover:bg-muted">
                    <Checkbox checked={selectedPoIds.includes(po.id)}
                      onCheckedChange={checked => setSelectedPoIds(prev => checked ? [...prev, po.id] : prev.filter(x => x !== po.id))} />
                    <span className="font-mono">{po.po_number}</span>
                    {po.pi_number && <span className="text-muted-foreground">PI: {po.pi_number}</span>}
                    <Badge variant="outline" className="text-[10px] h-4">{fmt(po.grand_total || 0)}</Badge>
                  </label>
                ))}
                {selectedPoIds.length > 0 && (
                  <span className="text-xs text-muted-foreground ml-auto self-center">
                    รวม PO: <span className="font-bold">{fmt(poTotal)}</span>
                  </span>
                )}
              </div>
              {selectedPoIds.length > 0 && amount > 0 && Math.abs(amount - poTotal) > 0.01 && (
                <div className="text-xs text-destructive bg-destructive/10 px-3 py-1.5 rounded-md">
                  ⚠️ ยอดโอน ({fmt(amount)} {currency}) ไม่ตรงกับยอด PO ({fmt(poTotal)} {currency}) — ต่างกัน {fmt(Math.abs(amount - poTotal))}
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">วัตถุประสงค์ *</Label>
              <Textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={2} className="resize-none" placeholder="ชำระค่าสินค้า PI-2026-001" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Invoice Reference</Label>
              <Input value={invoiceRef} onChange={e => setInvoiceRef(e.target.value)} className="h-9" placeholder="PI-2026-001" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">วันครบกำหนด</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-9" />
            </div>
          </div>
        </div>

        {/* ── Fees (collapsed) ── */}
        <Collapsible open={showFees} onOpenChange={setShowFees}>
          <CollapsibleTrigger className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
            <ChevronDown className={`w-3 h-3 transition-transform ${showFees ? 'rotate-180' : ''}`} />
            ค่าธรรมเนียม {totalFee > 0 ? `(฿${fmt(totalFee)})` : '(คลิกเพิ่ม)'}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-xs">ค่าโอน (THB)</Label><Input type="number" min={0} value={transferFee || ''} onChange={e => setTransferFee(parseFloat(e.target.value) || 0)} className="h-9" /></div>
              <div className="space-y-1"><Label className="text-xs">ค่าธนาคาร (THB)</Label><Input type="number" min={0} value={bankFee || ''} onChange={e => setBankFee(parseFloat(e.target.value) || 0)} className="h-9" /></div>
              <div className="space-y-1"><Label className="text-xs">อื่นๆ (THB)</Label><Input type="number" min={0} value={otherFee || ''} onChange={e => setOtherFee(parseFloat(e.target.value) || 0)} className="h-9" /></div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ── Total Summary ── */}
        {amount > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
            <span>ยอดโอน ฿{fmt(amountThb)} + ค่าธรรมเนียม ฿{fmt(totalFee)}</span>
            <span className="text-base font-bold">Total: ฿{fmt(totalCostThb)}</span>
          </div>
        )}

        {/* ── Upload + Notes ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">แนบเอกสาร</Label>
            <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
              onChange={e => setFiles(Array.from(e.target.files || []))} className="h-9" />
            {files.length > 0 && <p className="text-xs text-muted-foreground">{files.length} ไฟล์</p>}
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">หมายเหตุ</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} className="h-9" />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 justify-end pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => handleSave('draft')} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            บันทึกร่าง
          </Button>
          <Button size="sm" onClick={() => handleSave('pending')} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
            ส่งอนุมัติ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

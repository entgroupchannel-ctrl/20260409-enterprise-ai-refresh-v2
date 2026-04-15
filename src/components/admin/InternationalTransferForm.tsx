import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, Send, RefreshCw, Upload, Building2, Banknote, ArrowRightLeft, FileText, Info, Receipt, Paperclip } from 'lucide-react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD'] as const;
type Currency = typeof CURRENCIES[number];

interface Supplier {
  id: string;
  company_name: string;
  bank_name: string | null;
  bank_address: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  swift_code: string | null;
  iban: string | null;
  intermediary_bank: string | null;
  intermediary_swift: string | null;
  currency: string | null;
}

interface PO {
  id: string;
  po_number: string;
  grand_total: number | null;
  currency: string | null;
  status: string;
}

interface Props {
  editId?: string | null;
  onSaved?: () => void;
}

export default function InternationalTransferForm({ editId, onSaved }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pos, setPos] = useState<PO[]>([]);
  const [saving, setSaving] = useState(false);
  const [fetchingRate, setFetchingRate] = useState(false);

  // Form state
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

  // Load suppliers
  useEffect(() => {
    supabase.from('suppliers').select('*').eq('status', 'approved').is('deleted_at', null)
      .then(({ data }) => setSuppliers((data as Supplier[]) || []));
  }, []);

  // Auto-fill bank when supplier changes
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

    // Load POs for this supplier
    supabase.from('purchase_orders').select('id, po_number, grand_total, currency, status')
      .eq('supplier_id', selectedSupplier.id).is('deleted_at', null)
      .then(({ data }) => setPos((data as PO[]) || []));
  }, [supplierId]);

  // Auto-calc THB
  useEffect(() => {
    setAmountThb(amount * exchangeRate);
  }, [amount, exchangeRate]);

  // Load edit data
  useEffect(() => {
    if (!editId) return;
    supabase.from('international_transfer_requests').select('*').eq('id', editId).single()
      .then(({ data }) => {
        if (!data) return;
        const d = data as any;
        setSupplierId(d.supplier_id);
        setBankName(d.bank_name || '');
        setBankAddress(d.bank_address || '');
        setBankAccount(d.bank_account_number || '');
        setBankAccountName(d.bank_account_name || '');
        setSwiftCode(d.swift_code || '');
        setIban(d.iban || '');
        setIntermediaryBank(d.intermediary_bank || '');
        setIntermediarySwift(d.intermediary_swift || '');
        setAmount(d.amount || 0);
        setCurrency(d.currency || 'USD');
        setExchangeRate(d.exchange_rate || 0);
        setInvoiceRef(d.invoice_reference || '');
        setPurpose(d.purpose || '');
        setDueDate(d.due_date || '');
        setTransferDate(d.requested_transfer_date || '');
        setPriority(d.priority || 'normal');
        setTransferFee(d.transfer_fee || 0);
        setBankFee(d.bank_fee || 0);
        setOtherFee(d.other_fee || 0);
        setNotes(d.notes || '');
        setSelectedPoIds(d.purchase_order_ids || []);
      });
  }, [editId]);

  const fetchRate = useCallback(async () => {
    setFetchingRate(true);
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
      const json = await res.json();
      const rate = json.rates?.THB;
      if (rate) {
        setExchangeRate(rate);
        toast.success(`อัตราแลกเปลี่ยน ${currency}/THB = ${rate.toFixed(4)}`);
      } else {
        toast.error('ไม่พบอัตราแลกเปลี่ยน');
      }
    } catch {
      toast.error('ไม่สามารถดึงอัตราแลกเปลี่ยนได้ กรุณากรอกเอง');
    } finally {
      setFetchingRate(false);
    }
  }, [currency]);

  const handleSave = async (status: 'draft' | 'pending') => {
    if (!supplierId) { toast.error('กรุณาเลือก Supplier'); return; }
    if (!amount || amount <= 0) { toast.error('กรุณาระบุจำนวนเงิน'); return; }
    if (!purpose.trim()) { toast.error('กรุณาระบุวัตถุประสงค์'); return; }

    setSaving(true);
    try {
      const payload = {
        supplier_id: supplierId,
        supplier_name: selectedSupplier?.company_name || '',
        bank_name: bankName,
        bank_address: bankAddress,
        bank_account_number: bankAccount,
        bank_account_name: bankAccountName,
        swift_code: swiftCode,
        iban: iban || null,
        intermediary_bank: intermediaryBank || null,
        intermediary_swift: intermediarySwift || null,
        amount,
        currency,
        exchange_rate: exchangeRate || null,
        amount_thb: amountThb || null,
        purchase_order_ids: selectedPoIds.length > 0 ? selectedPoIds : null,
        invoice_reference: invoiceRef || null,
        purpose,
        due_date: dueDate || null,
        requested_transfer_date: transferDate || null,
        priority,
        transfer_fee: transferFee || null,
        bank_fee: bankFee || null,
        other_fee: otherFee || null,
        total_fee: totalFee || null,
        total_cost_thb: totalCostThb || null,
        notes: notes || null,
        status,
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

      // Upload files
      if (files.length > 0 && transferId) {
        for (const file of files) {
          const path = `${supplierId}/${transferId}/${Date.now()}_${file.name}`;
          const { error: upErr } = await supabase.storage.from('supplier-documents').upload(path, file);
          if (upErr) { toast.error(`อัปโหลด ${file.name} ล้มเหลว`); continue; }
          const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
          await supabase.from('supplier_documents').insert({
            supplier_id: supplierId,
            transfer_request_id: transferId,
            document_type: 'proforma_invoice',
            title: file.name,
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_size: file.size,
            uploaded_by: (await supabase.auth.getUser()).data.user?.id || null,
          });
        }
      }

      toast.success(status === 'draft' ? 'บันทึกร่างแล้ว' : 'ส่งอนุมัติแล้ว');
      onSaved?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Section 1 — Supplier */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4" />Supplier</CardTitle></CardHeader>
        <CardContent>
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger><SelectValue placeholder="เลือก Supplier ที่อนุมัติแล้ว" /></SelectTrigger>
            <SelectContent>
              {suppliers.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.company_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Section 2 — Bank */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Banknote className="h-4 w-4" />Bank Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Bank Name *</Label><Input value={bankName} onChange={e => setBankName(e.target.value)} /></div>
            <div><Label>Bank Address</Label><Input value={bankAddress} onChange={e => setBankAddress(e.target.value)} /></div>
            <div><Label>Account Number *</Label><Input value={bankAccount} onChange={e => setBankAccount(e.target.value)} /></div>
            <div><Label>Account Name</Label><Input value={bankAccountName} onChange={e => setBankAccountName(e.target.value)} /></div>
            <div><Label>SWIFT Code *</Label><Input value={swiftCode} onChange={e => setSwiftCode(e.target.value)} /></div>
            <div><Label>IBAN</Label><Input value={iban} onChange={e => setIban(e.target.value)} /></div>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">Intermediary Bank (ถ้ามี)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Intermediary Bank</Label><Input value={intermediaryBank} onChange={e => setIntermediaryBank(e.target.value)} /></div>
            <div><Label>Intermediary SWIFT</Label><Input value={intermediarySwift} onChange={e => setIntermediarySwift(e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3 — Transfer Amount */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><ArrowRightLeft className="h-4 w-4" />จำนวนเงินที่โอน</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>จำนวนเงิน *</Label>
              <Input type="number" min={0} step="0.01" value={amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>สกุลเงิน</Label>
              <Select value={currency} onValueChange={v => setCurrency(v as Currency)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>อัตราแลกเปลี่ยน (THB)</Label>
              <div className="flex gap-2">
                <Input type="number" min={0} step="0.0001" value={exchangeRate || ''} onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)} />
                <Button variant="outline" size="icon" onClick={fetchRate} disabled={fetchingRate} title="ดึงอัตราแลกเปลี่ยนอัตโนมัติ">
                  <RefreshCw className={`h-4 w-4 ${fetchingRate ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">จำนวนเงิน THB:</span>
            <span className="text-lg font-bold">฿{fmt(amountThb)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Section 4 — PO Reference */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4" />อ้างอิง PO / Invoice</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {pos.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pos.map(po => (
                <label key={po.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Checkbox
                    checked={selectedPoIds.includes(po.id)}
                    onCheckedChange={checked => {
                      setSelectedPoIds(prev => checked ? [...prev, po.id] : prev.filter(x => x !== po.id));
                    }}
                  />
                  <span className="font-mono text-sm">{po.po_number}</span>
                  <Badge variant="outline">{po.currency}</Badge>
                  <span className="ml-auto font-mono text-sm">{fmt(po.grand_total || 0)}</span>
                </label>
              ))}
              {selectedPoIds.length > 0 && (
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">รวม PO ที่เลือก ({selectedPoIds.length})</span>
                  <span className="font-bold">{fmt(poTotal)}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{supplierId ? 'ไม่พบ PO สำหรับ Supplier นี้' : 'เลือก Supplier ก่อน'}</p>
          )}
          <div><Label>Invoice Reference</Label><Input placeholder="เลขที่ Invoice / PI อ้างอิง" value={invoiceRef} onChange={e => setInvoiceRef(e.target.value)} /></div>
        </CardContent>
      </Card>

      {/* Section 5 — Details */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Info className="h-4 w-4" />รายละเอียด</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>วัตถุประสงค์ *</Label><Textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="เช่น ชำระค่าสินค้า PI-2026-001" /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>วันครบกำหนด</Label><Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
            <div><Label>วันที่ต้องการโอน</Label><Input type="date" value={transferDate} onChange={e => setTransferDate(e.target.value)} /></div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6 — Fees */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Receipt className="h-4 w-4" />ค่าธรรมเนียม</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>ค่าโอน (THB)</Label><Input type="number" min={0} step="0.01" value={transferFee || ''} onChange={e => setTransferFee(parseFloat(e.target.value) || 0)} /></div>
            <div><Label>ค่าธรรมเนียมธนาคาร (THB)</Label><Input type="number" min={0} step="0.01" value={bankFee || ''} onChange={e => setBankFee(parseFloat(e.target.value) || 0)} /></div>
            <div><Label>อื่นๆ (THB)</Label><Input type="number" min={0} step="0.01" value={otherFee || ''} onChange={e => setOtherFee(parseFloat(e.target.value) || 0)} /></div>
          </div>
          <Separator />
          <div className="space-y-2 p-3 rounded-lg bg-muted/50">
            <div className="flex justify-between text-sm"><span>ค่าธรรมเนียมรวม</span><span>฿{fmt(totalFee)}</span></div>
            <div className="flex justify-between text-sm"><span>ยอดโอน THB</span><span>฿{fmt(amountThb)}</span></div>
            <Separator />
            <div className="flex justify-between font-bold"><span>Total Cost THB</span><span className="text-lg">฿{fmt(totalCostThb)}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Section 7 — Documents */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Paperclip className="h-4 w-4" />เอกสารแนบ</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
            onChange={e => setFiles(Array.from(e.target.files || []))}
          />
          {files.length > 0 && (
            <div className="text-xs text-muted-foreground">{files.length} ไฟล์เลือกแล้ว</div>
          )}
          <div><Label>หมายเหตุ</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="หมายเหตุเพิ่มเติม..." /></div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />บันทึกร่าง
        </Button>
        <Button onClick={() => handleSave('pending')} disabled={saving}>
          <Send className="h-4 w-4 mr-2" />ส่งอนุมัติ
        </Button>
      </div>
    </div>
  );
}

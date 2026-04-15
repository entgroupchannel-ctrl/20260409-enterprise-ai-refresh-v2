import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import {
  Save, Send, RefreshCw, ChevronDown, Loader2, Plus, X,
  FileText, Package, DollarSign, Calendar, AlertTriangle,
  Upload, Sparkles, CheckCircle2, XCircle,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const DOC_TYPES = [
  { value: 'proforma_invoice',   label: 'PI'    },
  { value: 'commercial_invoice', label: 'CI'    },
  { value: 'air_waybill',        label: 'AWB'   },
  { value: 'packing_list',       label: 'PL'    },
  { value: 'certificate',        label: 'Cert'  },
  { value: 'other',              label: 'อื่นๆ' },
] as const;
type DocType = typeof DOC_TYPES[number]['value'];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD'] as const;
type Currency = typeof CURRENCIES[number];

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface Supplier {
  id: string; company_name: string;
  bank_name: string | null; bank_address: string | null;
  bank_account_number: string | null; bank_account_name: string | null;
  swift_code: string | null; iban: string | null;
  intermediary_bank: string | null; intermediary_swift: string | null;
  currency: string | null;
}

interface POItem {
  model?: string; description?: string; quantity?: number;
  unit_price?: number; total?: number; color?: string; hs_code?: string;
}

interface PO {
  id: string;
  po_number: string;
  pi_number: string | null;
  ci_number: string | null;
  order_date: string | null;
  expected_delivery: string | null;
  grand_total: number | null;
  subtotal: number | null;
  shipping_cost: number | null;
  handling_fee: number | null;
  currency: string | null;
  status: string;
  items: POItem[] | any;
  payment_terms: string | null;
  price_terms: string | null;
  loading_port: string | null;
  destination: string | null;
}

interface AttachedFile { file: File; type: DocType; }

interface ParsedPI {
  fileName: string;
  status: 'parsing' | 'done' | 'error';
  error?: string;
  data?: {
    pi_number?: string; supplier_name?: string;
    items?: { model?: string; description?: string; color?: string; qty?: number; unit_price?: number; amount?: number; hs_code?: string }[];
    shipping_cost?: number; handling_fee?: number; grand_total?: number; currency?: string;
    price_terms?: string; payment_terms?: string; delivery_days?: string;
    loading_port?: string; destination?: string;
    bank_name?: string; swift_code?: string; account_number?: string; account_name?: string;
  };
}

interface Props { editId?: string | null; onSaved?: () => void; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const POStatusBadge = ({ status }: { status: string }) => {
  const cfg: Record<string, { label: string; cls: string }> = {
    draft:     { label: 'ร่าง',        cls: 'bg-muted text-muted-foreground' },
    confirmed: { label: 'ยืนยันแล้ว',  cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    shipped:   { label: 'จัดส่งแล้ว',  cls: 'bg-purple-100 text-purple-800' },
    received:  { label: 'รับแล้ว',     cls: 'bg-green-100 text-green-800' },
    cancelled: { label: 'ยกเลิก',     cls: 'bg-red-100 text-red-800' },
  };
  const c = cfg[status] ?? { label: status, cls: 'bg-muted' };
  return <Badge className={`text-[10px] ${c.cls}`}>{c.label}</Badge>;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function InternationalTransferForm({ editId, onSaved }: Props) {
  const [suppliers,    setSuppliers]    = useState<Supplier[]>([]);
  const [pos,          setPos]          = useState<PO[]>([]);
  const [saving,       setSaving]       = useState(false);
  const [fetchingRate, setFetchingRate] = useState(false);
  const [showBank,     setShowBank]     = useState(false);
  const [showFees,     setShowFees]     = useState(false);

  // Form fields
  const [supplierId,        setSupplierId]        = useState('');
  const [bankName,          setBankName]          = useState('');
  const [bankAddress,       setBankAddress]       = useState('');
  const [bankAccount,       setBankAccount]       = useState('');
  const [bankAccountName,   setBankAccountName]   = useState('');
  const [swiftCode,         setSwiftCode]         = useState('');
  const [iban,              setIban]              = useState('');
  const [intermediaryBank,  setIntermediaryBank]  = useState('');
  const [intermediarySwift, setIntermediarySwift] = useState('');
  const [amount,            setAmount]            = useState<number>(0);
  const [currency,          setCurrency]          = useState<Currency>('USD');
  const [exchangeRate,      setExchangeRate]      = useState<number>(0);
  const [amountThb,         setAmountThb]         = useState<number>(0);
  const [selectedPoIds,     setSelectedPoIds]     = useState<string[]>([]);
  const [invoiceRef,        setInvoiceRef]        = useState('');
  const [purpose,           setPurpose]           = useState('');
  const [dueDate,           setDueDate]           = useState('');
  const [transferDate,      setTransferDate]      = useState('');
  const [priority,          setPriority]          = useState('normal');
  const [transferFee,       setTransferFee]       = useState<number>(0);
  const [bankFee,           setBankFee]           = useState<number>(0);
  const [otherFee,          setOtherFee]          = useState<number>(0);
  const [notes,             setNotes]             = useState('');
  const [attachedFiles,     setAttachedFiles]     = useState<AttachedFile[]>([]);
  const [newFileType,       setNewFileType]       = useState<DocType>('proforma_invoice');
  const [parsedPIs,         setParsedPIs]         = useState<ParsedPI[]>([]);
  const [piMerged,          setPiMerged]          = useState(false);
  // Derived
  const totalFee      = transferFee + bankFee + otherFee;
  const totalCostThb  = amountThb + totalFee;
  const selectedSupplier = suppliers.find(s => s.id === supplierId);
  const selectedPos   = pos.filter(p => selectedPoIds.includes(p.id));
  const poTotal       = selectedPos.reduce((s, p) => s + (p.grand_total ?? 0), 0);
  const amountDiff    = Math.abs(amount - poTotal);

  // ── Load suppliers ──
  useEffect(() => {
    supabase.from('suppliers')
      .select('id,company_name,bank_name,bank_address,bank_account_number,bank_account_name,swift_code,iban,intermediary_bank,intermediary_swift,currency')
      .eq('status', 'approved').is('deleted_at', null)
      .then(({ data }) => setSuppliers((data as Supplier[]) ?? []));
  }, []);

  // ── Auto-fill bank + load POs when supplier changes ──
  useEffect(() => {
    if (!selectedSupplier) return;
    setBankName(selectedSupplier.bank_name ?? '');
    setBankAddress(selectedSupplier.bank_address ?? '');
    setBankAccount(selectedSupplier.bank_account_number ?? '');
    setBankAccountName(selectedSupplier.bank_account_name ?? '');
    setSwiftCode(selectedSupplier.swift_code ?? '');
    setIban(selectedSupplier.iban ?? '');
    setIntermediaryBank(selectedSupplier.intermediary_bank ?? '');
    setIntermediarySwift(selectedSupplier.intermediary_swift ?? '');
    if (selectedSupplier.currency) setCurrency(selectedSupplier.currency as Currency);

    supabase.from('purchase_orders')
      .select('id,po_number,pi_number,ci_number,order_date,expected_delivery,grand_total,subtotal,shipping_cost,handling_fee,currency,status,items,payment_terms,price_terms,loading_port,destination')
      .eq('supplier_id', selectedSupplier.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .then(({ data }) => setPos((data as PO[]) ?? []));
  }, [supplierId]);

  // ── Exchange rate calc ──
  useEffect(() => { setAmountThb(amount * exchangeRate); }, [amount, exchangeRate]);

  // ── Load for edit ──
  useEffect(() => {
    if (!editId) return;
    supabase.from('international_transfer_requests').select('*').eq('id', editId).single()
      .then(({ data }) => {
        if (!data) return;
        const d = data as any;
        setSupplierId(d.supplier_id);
        setBankName(d.bank_name ?? ''); setBankAddress(d.bank_address ?? '');
        setBankAccount(d.bank_account_number ?? ''); setBankAccountName(d.bank_account_name ?? '');
        setSwiftCode(d.swift_code ?? ''); setIban(d.iban ?? '');
        setIntermediaryBank(d.intermediary_bank ?? ''); setIntermediarySwift(d.intermediary_swift ?? '');
        setAmount(d.amount ?? 0); setCurrency(d.currency ?? 'USD');
        setExchangeRate(d.exchange_rate ?? 0); setInvoiceRef(d.invoice_reference ?? '');
        setPurpose(d.purpose ?? ''); setDueDate(d.due_date ?? '');
        setTransferDate(d.requested_transfer_date ?? ''); setPriority(d.priority ?? 'normal');
        setTransferFee(d.transfer_fee ?? 0); setBankFee(d.bank_fee ?? 0);
        setOtherFee(d.other_fee ?? 0); setNotes(d.notes ?? '');
        setSelectedPoIds(d.purchase_order_ids ?? []);
      });
  }, [editId]);

  // ── Auto-fill amount & purpose from selected POs ──
  const togglePo = (poId: string, checked: boolean) => {
    setSelectedPoIds(prev => {
      const next = checked ? [...prev, poId] : prev.filter(id => id !== poId);
      // Auto-fill amount from PO total (ถ้ายังไม่ได้กรอกเอง)
      const newSelected = pos.filter(p => next.includes(p.id));
      const newTotal = newSelected.reduce((s, p) => s + (p.grand_total ?? 0), 0);
      if (newTotal > 0) setAmount(newTotal);
      // Auto-fill purpose & invoice ref จาก PI ของ PO แรก
      if (checked) {
        const po = pos.find(p => p.id === poId);
        if (po) {
          if (po.pi_number && !invoiceRef) setInvoiceRef(po.pi_number);
          if (!purpose) setPurpose(`ชำระค่าสินค้า${po.pi_number ? ` PI: ${po.pi_number}` : ''} — ${po.po_number}`);
        }
      }
      return next;
    });
  };

  // ── Fetch exchange rate ──
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

  // ── PI Upload & Parse ──
  const handlePIUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    // Add to attached files as PI type
    setAttachedFiles(prev => [...prev, ...newFiles.map(f => ({ file: f, type: 'proforma_invoice' as DocType }))]);
    // Start parsing each file
    const newParsed: ParsedPI[] = newFiles.map(f => ({ fileName: f.name, status: 'parsing' as const }));
    setParsedPIs(prev => [...prev, ...newParsed]);
    setPiMerged(false);

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // strip data:...;base64,
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const { data, error } = await supabase.functions.invoke('parse-pi-document', {
          body: { file_base64: base64, media_type: file.type || 'application/pdf' },
        });

        if (error || !data?.success) {
          setParsedPIs(prev => prev.map(p => p.fileName === file.name ? { ...p, status: 'error', error: error?.message || data?.error || 'Parse failed' } : p));
          continue;
        }

        setParsedPIs(prev => prev.map(p => p.fileName === file.name ? { ...p, status: 'done', data: data.data } : p));
      } catch (err: any) {
        setParsedPIs(prev => prev.map(p => p.fileName === file.name ? { ...p, status: 'error', error: err.message } : p));
      }
    }
  }, []);

  // ── Merge all parsed PI data into form ──
  const mergeParsedPIs = useCallback(() => {
    const successPIs = parsedPIs.filter(p => p.status === 'done' && p.data);
    if (successPIs.length === 0) { toast.error('ไม่มีข้อมูล PI ที่อ่านได้'); return; }

    // Merge: use first PI for bank/supplier info, sum amounts
    const first = successPIs[0].data!;
    // Bank info (if not already filled)
    if (first.bank_name && !bankName) setBankName(first.bank_name);
    if (first.swift_code && !swiftCode) setSwiftCode(first.swift_code);
    if (first.account_number && !bankAccount) setBankAccount(first.account_number);
    if (first.account_name && !bankAccountName) setBankAccountName(first.account_name);

    // Currency
    if (first.currency) setCurrency(first.currency as Currency);

    // Amount: sum grand_total from all PIs
    const totalAmount = successPIs.reduce((sum, pi) => sum + (pi.data?.grand_total ?? 0), 0);
    if (totalAmount > 0) setAmount(totalAmount);

    // Invoice reference: join all PI numbers
    const piNumbers = successPIs.map(p => p.data?.pi_number).filter(Boolean);
    if (piNumbers.length > 0) setInvoiceRef(piNumbers.join(', '));

    // Purpose
    if (!purpose && piNumbers.length > 0) {
      setPurpose(`ชำระค่าสินค้า PI: ${piNumbers.join(', ')}`);
    }

    setPiMerged(true);
    toast.success(`รวมข้อมูลจาก ${successPIs.length} PI แล้ว`);
  }, [parsedPIs, bankName, swiftCode, bankAccount, bankAccountName, purpose]);

  // ── Save ──
  const handleSave = async (status: 'draft' | 'pending') => {
    if (!supplierId)          { toast.error('กรุณาเลือก Supplier'); return; }
    if (!amount || amount <= 0) { toast.error('กรุณาระบุจำนวนเงิน'); return; }
    if (!purpose.trim())      { toast.error('กรุณาระบุวัตถุประสงค์'); return; }
    setSaving(true);
    try {
      const payload = {
        supplier_id: supplierId, supplier_name: selectedSupplier?.company_name ?? '',
        bank_name: bankName, bank_address: bankAddress,
        bank_account_number: bankAccount, bank_account_name: bankAccountName,
        swift_code: swiftCode, iban: iban || null,
        intermediary_bank: intermediaryBank || null, intermediary_swift: intermediarySwift || null,
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
      // Upload attached files
      if (attachedFiles.length > 0 && transferId) {
        const userId = (await supabase.auth.getUser()).data.user?.id ?? null;
        for (const af of attachedFiles) {
          const path = `${supplierId}/${transferId}/${Date.now()}_${af.file.name}`;
          const { error: upErr } = await supabase.storage.from('supplier-documents').upload(path, af.file);
          if (upErr) { toast.error(`อัปโหลด ${af.file.name} ล้มเหลว`); continue; }
          const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
          await supabase.from('supplier_documents').insert({
            supplier_id: supplierId, transfer_request_id: transferId,
            document_type: af.type, title: af.file.name,
            file_name: af.file.name, file_url: urlData.publicUrl, file_size: af.file.size,
            uploaded_by: userId,
          });
        }
      }
      toast.success(status === 'draft' ? 'บันทึกร่างแล้ว' : 'ส่งอนุมัติแล้ว');
      onSaved?.();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const Hdr = ({ title }: { title: string }) => (
    <p className="text-sm font-semibold text-foreground border-b pb-1 mb-1">{title}</p>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">

        {/* ══ SECTION 0: อัปโหลด PI ══ */}
        <div className="space-y-3">
          <Hdr title="อัปโหลด PI (PDF/รูป) — อ่านรายการอัตโนมัติ" />
          <div className="flex gap-2 items-center">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-lg p-4 transition-colors bg-primary/5">
                <Upload className="w-5 h-5 text-primary" />
                <span className="text-sm text-primary font-medium">เลือกไฟล์ PI (รองรับหลายไฟล์)</span>
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                multiple
                className="hidden"
                onChange={e => { handlePIUpload(e.target.files); e.target.value = ''; }}
              />
            </label>
          </div>

          {/* Parsed PI results */}
          {parsedPIs.length > 0 && (
            <div className="space-y-2">
              {parsedPIs.map((pi, idx) => (
                <div key={idx} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    {pi.status === 'parsing' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                    {pi.status === 'done' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    {pi.status === 'error' && <XCircle className="w-4 h-4 text-destructive" />}
                    <span className="text-sm font-medium truncate flex-1">{pi.fileName}</span>
                    {pi.status === 'done' && pi.data?.pi_number && (
                      <Badge variant="outline" className="font-mono text-xs">PI: {pi.data.pi_number}</Badge>
                    )}
                    {pi.status === 'done' && pi.data?.grand_total != null && (
                      <span className="text-sm font-bold tabular-nums">
                        {pi.data.currency || 'USD'} {fmt(pi.data.grand_total)}
                      </span>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0"
                      onClick={() => setParsedPIs(prev => prev.filter((_, i) => i !== idx))}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  {pi.status === 'error' && (
                    <p className="text-xs text-destructive">{pi.error}</p>
                  )}
                  {pi.status === 'done' && pi.data?.items && pi.data.items.length > 0 && (
                    <div className="bg-muted/40 rounded-md p-2 space-y-0.5">
                      {pi.data.items.slice(0, 6).map((item, iIdx) => (
                        <div key={iIdx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <Package className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="font-mono font-medium truncate max-w-[180px]">
                              {item.model || item.description || `Item ${iIdx + 1}`}
                            </span>
                            {item.color && <span className="text-muted-foreground">({item.color})</span>}
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-2">
                            <span className="text-muted-foreground">
                              {item.qty ?? 0} × {fmt(item.unit_price ?? 0)}
                            </span>
                            <span className="font-semibold tabular-nums">
                              {fmt(item.amount ?? (item.qty ?? 0) * (item.unit_price ?? 0))}
                            </span>
                          </div>
                        </div>
                      ))}
                      {pi.data.items.length > 6 && (
                        <p className="text-[11px] text-muted-foreground pl-5">
                          +{pi.data.items.length - 6} รายการเพิ่มเติม
                        </p>
                      )}
                    </div>
                  )}
                  {pi.status === 'done' && pi.data && (
                    <div className="flex gap-3 text-[11px] text-muted-foreground flex-wrap">
                      {pi.data.bank_name && <span>🏦 {pi.data.bank_name}</span>}
                      {pi.data.swift_code && <span>SWIFT: {pi.data.swift_code}</span>}
                      {pi.data.payment_terms && <span>💳 {pi.data.payment_terms}</span>}
                      {pi.data.price_terms && <span>📦 {pi.data.price_terms}</span>}
                    </div>
                  )}
                </div>
              ))}

              {/* Merge button */}
              {parsedPIs.some(p => p.status === 'done') && (
                <Button
                  variant={piMerged ? 'outline' : 'default'}
                  size="sm"
                  className="w-full gap-2"
                  onClick={mergeParsedPIs}
                >
                  <Sparkles className="w-4 h-4" />
                  {piMerged ? '✅ รวมข้อมูลแล้ว — กดอีกครั้งเพื่ออัปเดต' : `รวมข้อมูลจาก ${parsedPIs.filter(p => p.status === 'done').length} PI ลงฟอร์ม`}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* ══ SECTION 1: Supplier & Amount ══ */}
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
              <Input type="number" min={0} step="0.01"
                value={amount || ''}
                onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">สกุลเงิน</Label>
              <Select value={currency} onValueChange={v => setCurrency(v as Currency)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">อัตราแลกเปลี่ยน (THB)</Label>
              <div className="flex gap-1">
                <Input type="number" min={0} step="0.0001"
                  value={exchangeRate || ''}
                  onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)}
                  className="h-9" />
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={fetchRate} disabled={fetchingRate}>
                  <RefreshCw className={`h-3.5 w-3.5 ${fetchingRate ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <div className="flex items-end pb-1">
              <div className="px-3 py-1.5 rounded-md bg-muted text-sm w-full text-center">
                ≈ <span className="font-bold">฿{fmt(amountThb)}</span>
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
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="normal">🔵 Normal</SelectItem>
                  <SelectItem value="high">🟡 High</SelectItem>
                  <SelectItem value="urgent">🔴 Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ══ SECTION 2: Bank (collapsed, auto-filled) ══ */}
        {supplierId && (
          <Collapsible open={showBank} onOpenChange={setShowBank}>
            <CollapsibleTrigger className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer w-full text-left">
              <ChevronDown className={`w-3 h-3 transition-transform shrink-0 ${showBank ? 'rotate-180' : ''}`} />
              <span className="font-medium">ข้อมูลธนาคาร:</span>
              <span className="text-muted-foreground truncate">
                {bankName || '—'} • SWIFT: {swiftCode || '—'} • A/C: {bankAccount || '—'}
              </span>
              {!showBank && <span className="ml-auto shrink-0 text-muted-foreground">(คลิกแก้ไข)</span>}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1"><Label className="text-xs">Bank Name</Label><Input value={bankName} onChange={e => setBankName(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">Account No.</Label><Input value={bankAccount} onChange={e => setBankAccount(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">SWIFT / BIC</Label><Input value={swiftCode} onChange={e => setSwiftCode(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">Account Name</Label><Input value={bankAccountName} onChange={e => setBankAccountName(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">Bank Address</Label><Input value={bankAddress} onChange={e => setBankAddress(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">IBAN</Label><Input value={iban} onChange={e => setIban(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">Intermediary Bank</Label><Input value={intermediaryBank} onChange={e => setIntermediaryBank(e.target.value)} className="h-9" /></div>
                <div className="space-y-1"><Label className="text-xs">Intermediary SWIFT</Label><Input value={intermediarySwift} onChange={e => setIntermediarySwift(e.target.value)} className="h-9" /></div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* ══ SECTION 3: ใบสั่งซื้อ — REDESIGNED ══ */}
        {supplierId && (
          <div className="space-y-3">
            <Hdr title="ใบสั่งซื้อที่เกี่ยวข้อง" />

            {pos.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm border rounded-lg">
                ไม่พบใบสั่งซื้อสำหรับ Supplier นี้
              </div>
            ) : (
              <div className="space-y-2">
                {pos.map(po => {
                  const isSelected = selectedPoIds.includes(po.id);
                  const items: POItem[] = Array.isArray(po.items) ? po.items : [];
                  const isOverdue = po.expected_delivery
                    && new Date(po.expected_delivery) < new Date()
                    && po.status !== 'received';

                  return (
                    <div
                      key={po.id}
                      className={`rounded-lg border-2 transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/40'
                      }`}
                      onClick={() => togglePo(po.id, !isSelected)}
                    >
                      {/* PO Header row */}
                      <div className="flex items-start gap-3 p-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={checked => togglePo(po.id, !!checked)}
                          onClick={e => e.stopPropagation()}
                          className="mt-0.5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          {/* Row 1: PO + PI + CI + Status */}
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className="font-mono text-sm font-bold">{po.po_number}</span>
                            {po.pi_number && (
                              <Badge className="font-mono text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                PI: {po.pi_number}
                              </Badge>
                            )}
                            {po.ci_number && (
                              <Badge variant="outline" className="font-mono text-xs">
                                CI: {po.ci_number}
                              </Badge>
                            )}
                            <POStatusBadge status={po.status} />
                            {isOverdue && (
                              <Badge className="bg-red-100 text-red-700 text-[10px] gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" /> เลยกำหนด
                              </Badge>
                            )}
                          </div>

                          {/* Row 2: Dates + Terms */}
                          <div className="flex gap-4 text-[11px] text-muted-foreground flex-wrap mb-2">
                            {po.order_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                วันสั่ง: {new Date(po.order_date).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })}
                              </span>
                            )}
                            {po.expected_delivery && (
                              <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                                <Calendar className="w-3 h-3" />
                                กำหนดส่ง: {new Date(po.expected_delivery).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' })}
                              </span>
                            )}
                            {po.payment_terms && <span>💳 {po.payment_terms}</span>}
                            {po.price_terms  && <span>📦 {po.price_terms}</span>}
                            {po.loading_port && <span>🚢 {po.loading_port}</span>}
                          </div>

                          {/* Row 3: รายการสินค้า */}
                          {items.length > 0 && (
                            <div className="bg-muted/40 rounded-md p-2 mb-2 space-y-0.5">
                              {items.slice(0, 5).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Package className="w-3 h-3 text-muted-foreground shrink-0" />
                                    <span className="font-mono font-medium truncate max-w-[120px]">
                                      {item.model || item.description || `Item ${idx + 1}`}
                                    </span>
                                    {item.color && <span className="text-muted-foreground">({item.color})</span>}
                                    {item.hs_code && (
                                      <span className="text-muted-foreground font-mono text-[10px]">
                                        HS: {item.hs_code}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0 ml-2">
                                    <span className="text-muted-foreground">
                                      {item.quantity ?? 0} × {fmt(item.unit_price ?? 0)}
                                    </span>
                                    <span className="font-semibold tabular-nums">
                                      {po.currency} {fmt(item.total ?? (item.quantity ?? 0) * (item.unit_price ?? 0))}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {items.length > 5 && (
                                <p className="text-[11px] text-muted-foreground pl-5">
                                  +{items.length - 5} รายการเพิ่มเติม
                                </p>
                              )}
                            </div>
                          )}

                          {/* Row 4: ยอดเงิน */}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-3 text-[11px] text-muted-foreground">
                              {po.subtotal != null && po.subtotal !== po.grand_total && (
                                <span>Subtotal: {po.currency} {fmt(po.subtotal)}</span>
                              )}
                              {(po.shipping_cost ?? 0) > 0 && (
                                <span>Shipping: {po.currency} {fmt(po.shipping_cost!)}</span>
                              )}
                              {(po.handling_fee ?? 0) > 0 && (
                                <span>Handling: {po.currency} {fmt(po.handling_fee!)}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="font-bold text-sm tabular-nums">
                                {po.currency} {fmt(po.grand_total ?? 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Selected POs summary */}
                {selectedPoIds.length > 0 && (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1.5">
                    <p className="text-xs font-semibold text-primary">
                      ✅ เลือก {selectedPoIds.length} ใบสั่งซื้อ
                    </p>
                    {selectedPos.map(po => (
                      <div key={po.id} className="flex justify-between text-xs">
                        <span className="font-mono">
                          {po.po_number}
                          {po.pi_number && <span className="text-muted-foreground ml-2">(PI: {po.pi_number})</span>}
                        </span>
                        <span className="tabular-nums font-medium">
                          {po.currency} {fmt(po.grand_total ?? 0)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-1.5 flex justify-between text-sm font-bold">
                      <span>รวมยอด PO</span>
                      <span className="tabular-nums">{selectedPos[0]?.currency ?? currency} {fmt(poTotal)}</span>
                    </div>
                    {amount > 0 && amountDiff > 0.01 && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded px-2 py-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        ยอดโอน ({fmt(amount)} {currency}) ≠ ยอด PO ({fmt(poTotal)}) ต่างกัน {fmt(amountDiff)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ SECTION 4: วัตถุประสงค์ & Reference ══ */}
        <div className="space-y-3">
          <Hdr title="วัตถุประสงค์ & อ้างอิง" />
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">วัตถุประสงค์ *</Label>
              <Textarea
                value={purpose} onChange={e => setPurpose(e.target.value)}
                rows={2} className="resize-none"
                placeholder="ชำระค่าสินค้า PI: GTA20260409001 — PO-2026-0001" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Invoice Reference (PI Number)</Label>
              <Input value={invoiceRef} onChange={e => setInvoiceRef(e.target.value)} className="h-9" placeholder="GTA20260409001" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">วันครบกำหนด</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-9" />
            </div>
          </div>
        </div>

        {/* ══ SECTION 5: ค่าธรรมเนียม ══ */}
        <Collapsible open={showFees} onOpenChange={setShowFees}>
          <CollapsibleTrigger className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
            <ChevronDown className={`w-3 h-3 transition-transform ${showFees ? 'rotate-180' : ''}`} />
            ค่าธรรมเนียม {totalFee > 0 ? `(฿${fmt(totalFee)})` : '(คลิกเพิ่ม)'}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">ค่าโอน (THB)</Label>
                <Input type="number" min={0} value={transferFee || ''} onChange={e => setTransferFee(parseFloat(e.target.value) || 0)} className="h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">ค่าธนาคาร (THB)</Label>
                <Input type="number" min={0} value={bankFee || ''} onChange={e => setBankFee(parseFloat(e.target.value) || 0)} className="h-9" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">อื่นๆ (THB)</Label>
                <Input type="number" min={0} value={otherFee || ''} onChange={e => setOtherFee(parseFloat(e.target.value) || 0)} className="h-9" />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ══ Total Summary ══ */}
        {amount > 0 && (
          <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ยอดโอน ({currency})</span>
              <span className="font-medium tabular-nums">{currency} {fmt(amount)}</span>
            </div>
            {exchangeRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">เทียบเป็น THB (@ {exchangeRate})</span>
                <span className="font-medium tabular-nums">฿{fmt(amountThb)}</span>
              </div>
            )}
            {totalFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ค่าธรรมเนียมรวม</span>
                <span className="font-medium tabular-nums">฿{fmt(totalFee)}</span>
              </div>
            )}
            <div className="border-t pt-1.5 flex justify-between text-base font-bold">
              <span>รวมทั้งหมด (THB)</span>
              <span className="tabular-nums">฿{fmt(totalCostThb)}</span>
            </div>
          </div>
        )}

        {/* ══ SECTION 6: แนบเอกสาร ══ */}
        <div className="space-y-3">
          <Hdr title="แนบเอกสาร" />
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) { setAttachedFiles(prev => [...prev, { file: f, type: newFileType }]); e.target.value = ''; }
                }} className="h-9" />
            </div>
            <Select value={newFileType} onValueChange={v => setNewFileType(v as DocType)}>
              <SelectTrigger className="w-[90px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{DOC_TYPES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {attachedFiles.length > 0 && (
            <div className="space-y-1">
              {attachedFiles.map((af, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs p-1.5 rounded bg-muted/40">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate">{af.file.name}</span>
                  <Badge variant="outline" className="text-[10px] h-5">{DOC_TYPES.find(d => d.value === af.type)?.label}</Badge>
                  <Select value={af.type} onValueChange={v => setAttachedFiles(prev => prev.map((f, i) => i === idx ? { ...f, type: v as DocType } : f))}>
                    <SelectTrigger className="w-[70px] h-6 text-[10px]"><SelectValue /></SelectTrigger>
                    <SelectContent>{DOC_TYPES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">หมายเหตุ</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} className="h-9" placeholder="หมายเหตุเพิ่มเติม" />
          </div>
        </div>

        {/* ══ Actions ══ */}
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

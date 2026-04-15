import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Send, Loader2, ChevronDown, X, FileText, FileSearch, AlertTriangle } from 'lucide-react';

const PO_DOC_TYPES = [
  { value: 'proforma_invoice', label: 'PI' },
  { value: 'commercial_invoice', label: 'CI' },
  { value: 'air_waybill', label: 'AWB' },
  { value: 'packing_list', label: 'PL' },
  { value: 'certificate', label: 'Cert' },
  { value: 'other', label: 'อื่นๆ' },
] as const;
type PODocType = typeof PO_DOC_TYPES[number]['value'];
interface POAttachedFile { file: File; type: PODocType; }

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD', 'THB'];
const PRICE_TERMS = ['Ex-works', 'FOB', 'CIF', 'DDP', 'DAP', 'FCA'];
const PAYMENT_TERMS_OPTIONS = ['TT 100%', 'TT 30/70', 'TT 50/50', 'L/C', 'D/P', 'D/A'];
const SHIPPING_METHODS = ['DHL', 'UPS', 'FedEx', 'Sea Freight', 'Air Freight', 'Other'];

interface Supplier {
  id: string; company_name: string; currency: string | null;
  default_price_terms: string | null; default_payment_terms: string | null;
  default_delivery_days: string | null;
}

interface LineItem {
  model: string;
  description: string;
  color: string;
  hs_code: string;
  quantity: number;
  unit_price: number;
  product_id?: string;
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
  const [showTerms, setShowTerms] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [parsingPI, setParsingPI] = useState(false);
  const [piParseResult, setPiParseResult] = useState<'success' | 'error' | null>(null);
  const [piSupplierWarning, setPiSupplierWarning] = useState('');
  const piFileRef = useRef<HTMLInputElement>(null);

  const [supplierId, setSupplierId] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [piNumber, setPiNumber] = useState('');
  const [ciNumber, setCiNumber] = useState('');
  const [priceTerms, setPriceTerms] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('CHINA');
  const [loadingPort, setLoadingPort] = useState('');
  const [destination, setDestination] = useState('Thailand');
  const [shippingMethod, setShippingMethod] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ model: '', description: '', color: '', hs_code: '', quantity: 1, unit_price: 0 }]);
  const [shippingCost, setShippingCost] = useState(0);
  const [handlingFee, setHandlingFee] = useState(0);
  const [otherCost, setOtherCost] = useState(0);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [poFiles, setPoFiles] = useState<POAttachedFile[]>([]);
  const [newPoFileType, setNewPoFileType] = useState<PODocType>('proforma_invoice');

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const grandTotal = subtotal + shippingCost + handlingFee + otherCost;

  useEffect(() => {
    if (!open) return;
    supabase.from('suppliers').select('id, company_name, currency, default_price_terms, default_payment_terms, default_delivery_days')
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
        setPiNumber(d.pi_number || '');
        setCiNumber(d.ci_number || '');
        setPriceTerms(d.price_terms || '');
        setPaymentTerms(d.payment_terms || '');
        setDeliveryDays(d.delivery_days || '');
        setCountryOfOrigin(d.country_of_origin || 'CHINA');
        setLoadingPort(d.loading_port || '');
        setDestination(d.destination || 'Thailand');
        setShippingMethod(d.shipping_method || '');
        setTrackingNumber(d.tracking_number || '');
        setCarrier(d.carrier || '');
        const rawItems = d.items as any[];
        if (rawItems?.length) {
          setItems(rawItems.map((it: any) => ({
            model: it.model || it.product_name || '',
            description: it.description || '',
            color: it.color || '',
            hs_code: it.hs_code || '',
            quantity: it.quantity || it.qty || 1,
            unit_price: it.unit_price || 0,
            product_id: it.product_id || undefined,
          })));
        }
        setShippingCost(d.shipping_cost || 0);
        setHandlingFee(d.handling_fee || 0);
        setOtherCost(d.other_cost || 0);
        setOrderDate(d.order_date || '');
        setExpectedDelivery(d.expected_delivery || '');
        setNotes(d.notes || '');
        if (d.price_terms || d.payment_terms || d.delivery_days) setShowTerms(true);
        if (d.shipping_method || d.tracking_number) setShowShipping(true);
      });
  }, [editId, open]);

  // Auto-set currency + terms from supplier
  useEffect(() => {
    const sup = suppliers.find(s => s.id === supplierId);
    if (!sup) return;
    if (sup.currency) setCurrency(sup.currency);
    if (sup.default_price_terms && !priceTerms) setPriceTerms(sup.default_price_terms);
    if (sup.default_payment_terms && !paymentTerms) setPaymentTerms(sup.default_payment_terms);
    if (sup.default_delivery_days && !deliveryDays) setDeliveryDays(sup.default_delivery_days);
  }, [supplierId, suppliers]);

  const resetForm = () => {
    setSupplierId(''); setCurrency('USD'); setPiNumber(''); setCiNumber('');
    setPriceTerms(''); setPaymentTerms(''); setDeliveryDays('');
    setCountryOfOrigin('CHINA'); setLoadingPort(''); setDestination('Thailand');
    setShippingMethod(''); setTrackingNumber(''); setCarrier('');
    setItems([{ model: '', description: '', color: '', hs_code: '', quantity: 1, unit_price: 0 }]);
    setShippingCost(0); setHandlingFee(0); setOtherCost(0);
    setOrderDate(new Date().toISOString().split('T')[0]);
    setExpectedDelivery(''); setNotes('');
    setShowTerms(false); setShowShipping(false);
    setPoFiles([]); setNewPoFileType('proforma_invoice');
    setPiParseResult(null); setPiSupplierWarning('');
  };

  // ========== PI PDF Parser (Anthropic API direct) ==========
  const handleParsePI = async (file: File) => {
    setParsingPI(true);
    setPiParseResult(null);
    setPiSupplierWarning('');
    try {
      const base64 = await fileToBase64(file);
      const mediaType = file.type === 'application/pdf'
        ? 'application/pdf'
        : file.type.startsWith('image/') ? file.type : 'application/pdf';

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'document',
                source: { type: 'base64', media_type: mediaType, data: base64 },
              },
              {
                type: 'text',
                text: `Extract this Proforma Invoice into JSON. Return ONLY valid JSON, no markdown, no backticks:\n{\n  "pi_number": "",\n  "supplier_name": "",\n  "items": [{ "model": "", "description": "", "color": "", "qty": 0, "unit_price": 0, "amount": 0, "hs_code": "" }],\n  "shipping_cost": 0,\n  "handling_fee": 0,\n  "grand_total": 0,\n  "currency": "USD",\n  "price_terms": "",\n  "payment_terms": "",\n  "delivery_days": "",\n  "loading_port": "",\n  "destination": "",\n  "bank_name": "",\n  "swift_code": "",\n  "account_number": "",\n  "account_name": ""\n}`,
              },
            ],
          }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      const clean = text.replace(/```json\s*|```\s*/g, '').trim();
      const d = JSON.parse(clean);

      // Auto-fill form
      if (d.pi_number) setPiNumber(d.pi_number);
      if (d.currency) setCurrency(d.currency);
      if (d.price_terms) { setPriceTerms(d.price_terms); setShowTerms(true); }
      if (d.payment_terms) { setPaymentTerms(d.payment_terms); setShowTerms(true); }
      if (d.delivery_days) { setDeliveryDays(d.delivery_days); setShowTerms(true); }
      if (d.loading_port) { setLoadingPort(d.loading_port); setShowTerms(true); }
      if (d.shipping_cost) setShippingCost(d.shipping_cost);
      if (d.handling_fee) setHandlingFee(d.handling_fee);

      if (d.items?.length) {
        setItems(d.items.map((it: any) => ({
          model: it.model || '',
          description: it.description || '',
          color: it.color || '',
          hs_code: it.hs_code || '',
          quantity: it.qty || it.quantity || 1,
          unit_price: it.unit_price || 0,
        })));
      }

      // Auto-match supplier
      if (d.supplier_name && suppliers.length > 0) {
        const nameLC = d.supplier_name.toLowerCase();
        const match = suppliers.find(s => s.company_name.toLowerCase().includes(nameLC) || nameLC.includes(s.company_name.toLowerCase()));
        if (match) {
          setSupplierId(match.id);
        } else {
          setPiSupplierWarning(`Supplier "${d.supplier_name}" ไม่ตรงกับในระบบ — กรุณาเลือกเอง`);
        }
      }

      // Also add the PI file as an attachment
      setPoFiles(prev => [...prev, { file, type: 'proforma_invoice' }]);

      setPiParseResult('success');
      toast.success('อ่าน PI สำเร็จ — ตรวจสอบข้อมูลด้านล่าง');
    } catch (err: any) {
      console.error('PI parse error:', err);
      setPiParseResult('error');
      toast.error('อ่าน PI ล้มเหลว: ' + (err.message || 'Unknown error'));
    } finally {
      setParsingPI(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // strip data:...;base64,
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const addItem = () => setItems(prev => [...prev, { model: '', description: '', color: '', hs_code: '', quantity: 1, unit_price: 0 }]);

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (status: 'draft' | 'sent') => {
    if (!supplierId) { toast.error('กรุณาเลือก Supplier'); return; }
    if (items.every(i => !i.model.trim())) { toast.error('กรุณาเพิ่มรายการสินค้า'); return; }

    setSaving(true);
    try {
      const cleanItems = items.filter(i => i.model.trim()).map(i => ({
        model: i.model, description: i.description, color: i.color,
        hs_code: i.hs_code, qty: i.quantity, unit_price: i.unit_price,
        total: i.quantity * i.unit_price,
        ...(i.product_id ? { product_id: i.product_id } : {}),
      }));

      const payload = {
        supplier_id: supplierId,
        items: cleanItems as unknown as import('@/integrations/supabase/types').Json,
        subtotal,
        shipping_cost: shippingCost || null,
        handling_fee: handlingFee || null,
        other_cost: otherCost || null,
        grand_total: grandTotal,
        currency,
        order_date: orderDate || null,
        expected_delivery: expectedDelivery || null,
        notes: notes || null,
        status,
        pi_number: piNumber || null,
        ci_number: ciNumber || null,
        price_terms: priceTerms || null,
        payment_terms: paymentTerms || null,
        delivery_days: deliveryDays || null,
        shipping_method: shippingMethod || null,
        tracking_number: trackingNumber || null,
        carrier: carrier || null,
        country_of_origin: countryOfOrigin || null,
        loading_port: loadingPort || null,
        destination: destination || null,
      };

      let poId = editId;
      if (editId) {
        const { error } = await supabase.from('purchase_orders').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { data: insertData, error } = await supabase.from('purchase_orders').insert(payload).select('id').single();
        if (error) throw error;
        poId = insertData.id;
      }

      // Upload attached files
      if (poFiles.length > 0 && poId) {
        const userId = (await supabase.auth.getUser()).data.user?.id || null;
        for (const af of poFiles) {
          const path = `${supplierId}/${poId}/${Date.now()}_${af.file.name}`;
          const { error: upErr } = await supabase.storage.from('supplier-documents').upload(path, af.file);
          if (upErr) { toast.error(`อัปโหลด ${af.file.name} ล้มเหลว`); continue; }
          const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
          await supabase.from('supplier_documents').insert({
            supplier_id: supplierId, purchase_order_id: poId,
            document_type: af.type, title: af.file.name,
            file_name: af.file.name, file_url: urlData.publicUrl, file_size: af.file.size,
            uploaded_by: userId,
          });
        }
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editId ? 'แก้ไขใบสั่งซื้อ' : 'สร้างใบสั่งซื้อ (PO)'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* PI Parser */}
          {!editId && (
            <div className="p-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button" variant="outline" size="sm"
                  onClick={() => piFileRef.current?.click()}
                  disabled={parsingPI}
                >
                  {parsingPI ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <FileSearch className="w-4 h-4 mr-1" />}
                  {parsingPI ? 'กำลังอ่านเอกสาร...' : '📄 อ่านจาก PI'}
                </Button>
                <input
                  ref={piFileRef} type="file" className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleParsePI(f);
                    e.target.value = '';
                  }}
                />
                <span className="text-xs text-muted-foreground">อัปโหลด PI (PDF/รูป) แล้วระบบจะอ่านข้อมูลอัตโนมัติ</span>
              </div>
              {piParseResult === 'success' && (
                <div className="text-xs text-green-600 bg-green-500/10 px-3 py-1.5 rounded-md">
                  ✅ อ่านสำเร็จ! ตรวจสอบข้อมูลด้านล่าง
                </div>
              )}
              {piParseResult === 'error' && (
                <div className="text-xs text-destructive bg-destructive/10 px-3 py-1.5 rounded-md">
                  ❌ อ่านไม่สำเร็จ — กรุณากรอกข้อมูลเอง
                </div>
              )}
              {piSupplierWarning && (
                <div className="text-xs text-yellow-700 bg-yellow-500/10 px-3 py-1.5 rounded-md flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {piSupplierWarning}
                </div>
              )}
            </div>
          )}

          {/* Supplier + PI + Currency + Dates */}
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
              <Label className="text-xs text-muted-foreground">PI Number</Label>
              <Input value={piNumber} onChange={e => setPiNumber(e.target.value)} className="h-9" placeholder="GTA20260409001" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CI Number</Label>
              <Input value={ciNumber} onChange={e => setCiNumber(e.target.value)} className="h-9" placeholder="GTA20260409001" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">กำหนดส่ง</Label>
              <Input type="date" value={expectedDelivery} onChange={e => setExpectedDelivery(e.target.value)} className="h-9" />
            </div>
          </div>

          {/* Terms (collapsible) */}
          <Collapsible open={showTerms} onOpenChange={setShowTerms}>
            <CollapsibleTrigger className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
              <ChevronDown className={`w-3 h-3 transition-transform ${showTerms ? 'rotate-180' : ''}`} />
              เงื่อนไขการค้า {priceTerms && `(${priceTerms})`} {paymentTerms && `• ${paymentTerms}`}
              {!showTerms && !priceTerms && ' (คลิกเพิ่ม)'}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Price Terms</Label>
                  <Select value={priceTerms} onValueChange={setPriceTerms}>
                    <SelectTrigger className="h-9"><SelectValue placeholder="เลือก..." /></SelectTrigger>
                    <SelectContent>{PRICE_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Payment Terms</Label>
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger className="h-9"><SelectValue placeholder="เลือก..." /></SelectTrigger>
                    <SelectContent>{PAYMENT_TERMS_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Delivery Days</Label>
                  <Input value={deliveryDays} onChange={e => setDeliveryDays(e.target.value)} className="h-9" placeholder="5-7 working days" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Country of Origin</Label>
                  <Input value={countryOfOrigin} onChange={e => setCountryOfOrigin(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Loading Port</Label>
                  <Input value={loadingPort} onChange={e => setLoadingPort(e.target.value)} className="h-9" placeholder="Shenzhen, CHINA" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Destination</Label>
                  <Input value={destination} onChange={e => setDestination(e.target.value)} className="h-9" />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">รายการสินค้า</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-3 h-3 mr-1" />เพิ่มรายการ
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">Model</TableHead>
                    <TableHead className="min-w-[140px]">รายละเอียด</TableHead>
                    <TableHead className="min-w-[60px]">สี</TableHead>
                    <TableHead className="min-w-[100px]">HS Code</TableHead>
                    <TableHead className="w-[80px] text-right">จำนวน</TableHead>
                    <TableHead className="w-[100px] text-right">ราคา/หน่วย</TableHead>
                    <TableHead className="w-[100px] text-right">รวม</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="p-1">
                        <Input value={item.model} onChange={e => updateItem(idx, 'model', e.target.value)} className="h-8 text-xs" placeholder="GT9000" />
                      </TableCell>
                      <TableCell className="p-1">
                        <Input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} className="h-8 text-xs" placeholder="รายละเอียด" />
                      </TableCell>
                      <TableCell className="p-1">
                        <Input value={item.color} onChange={e => updateItem(idx, 'color', e.target.value)} className="h-8 text-xs" placeholder="Black" />
                      </TableCell>
                      <TableCell className="p-1">
                        <Input value={item.hs_code} onChange={e => updateItem(idx, 'hs_code', e.target.value)} className="h-8 text-xs font-mono" placeholder="8471414000" />
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
          </div>

          {/* Shipping (collapsible) */}
          <Collapsible open={showShipping} onOpenChange={setShowShipping}>
            <CollapsibleTrigger className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
              <ChevronDown className={`w-3 h-3 transition-transform ${showShipping ? 'rotate-180' : ''}`} />
              ข้อมูลขนส่ง {carrier && `(${carrier})`} {trackingNumber && `• ${trackingNumber}`}
              {!showShipping && !carrier && ' (คลิกเพิ่ม)'}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Shipping Method</Label>
                  <Select value={shippingMethod} onValueChange={setShippingMethod}>
                    <SelectTrigger className="h-9"><SelectValue placeholder="เลือก..." /></SelectTrigger>
                    <SelectContent>{SHIPPING_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Carrier</Label>
                  <Input value={carrier} onChange={e => setCarrier(e.target.value)} className="h-9" placeholder="UPS, DHL" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tracking / AWB</Label>
                  <Input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="h-9" placeholder="V041 4866 123" />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Costs Summary */}
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">ค่าขนส่ง</Label>
              <Input type="number" min={0} step="0.01" value={shippingCost || ''} onChange={e => setShippingCost(parseFloat(e.target.value) || 0)} className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Handling Fee</Label>
              <Input type="number" min={0} step="0.01" value={handlingFee || ''} onChange={e => setHandlingFee(parseFloat(e.target.value) || 0)} className="h-9" />
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
            {handlingFee > 0 && <div className="flex justify-between text-sm text-muted-foreground"><span>Handling Fee</span><span className="font-mono">{fmt(handlingFee)}</span></div>}
            {otherCost > 0 && <div className="flex justify-between text-sm text-muted-foreground"><span>Other</span><span className="font-mono">{fmt(otherCost)}</span></div>}
            <div className="flex justify-between font-bold text-base border-t pt-1">
              <span>Grand Total ({currency})</span>
              <span>{fmt(grandTotal)}</span>
            </div>
          </div>

          {/* Document Attachments */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">แนบเอกสาร</Label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) { setPoFiles(prev => [...prev, { file: f, type: newPoFileType }]); e.target.value = ''; }
                  }} className="h-9" />
              </div>
              <Select value={newPoFileType} onValueChange={v => setNewPoFileType(v as PODocType)}>
                <SelectTrigger className="w-[100px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{PO_DOC_TYPES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {poFiles.length > 0 && (
              <div className="space-y-1">
                {poFiles.map((af, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs p-1.5 rounded bg-muted/40">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="flex-1 truncate">{af.file.name}</span>
                    <Badge variant="outline" className="text-[10px] h-5">{PO_DOC_TYPES.find(d => d.value === af.type)?.label}</Badge>
                    <Select value={af.type} onValueChange={v => setPoFiles(prev => prev.map((f, i) => i === idx ? { ...f, type: v as PODocType } : f))}>
                      <SelectTrigger className="w-[80px] h-6 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>{PO_DOC_TYPES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => setPoFiles(prev => prev.filter((_, i) => i !== idx))}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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

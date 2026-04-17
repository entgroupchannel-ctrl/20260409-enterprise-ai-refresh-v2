import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, Loader2, Sparkles, Trash2, Plus, AlertCircle } from 'lucide-react';

interface ImportedItem {
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  line_total: number;
}

interface ImportedQuote {
  quote_number: string;
  quote_date: string;
  valid_until: string;
  customer_name: string;
  customer_company: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_tax_id: string;
  customer_branch_type: string;
  customer_branch_code: string;
  customer_branch_name: string;
  items: ImportedItem[];
  subtotal: number;
  discount_amount: number;
  discount_percent: number;
  vat_percent: number;
  vat_amount: number;
  withholding_percent: number;
  withholding_amount: number;
  grand_total: number;
  payment_terms: string;
  delivery_terms: string;
  warranty_terms: string;
  notes: string;
}

const emptyQuote: ImportedQuote = {
  quote_number: '', quote_date: '', valid_until: '',
  customer_name: '', customer_company: '', customer_email: '', customer_phone: '',
  customer_address: '', customer_tax_id: '',
  customer_branch_type: 'head_office', customer_branch_code: '', customer_branch_name: '',
  items: [],
  subtotal: 0, discount_amount: 0, discount_percent: 0,
  vat_percent: 7, vat_amount: 0,
  withholding_percent: 0, withholding_amount: 0,
  grand_total: 0,
  payment_terms: '', delivery_terms: '', warranty_terms: '', notes: '',
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported?: () => void;
}

export default function ImportQuotePDFDialog({ open, onOpenChange, onImported }: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<ImportedQuote>(emptyQuote);
  const [storagePath, setStoragePath] = useState<string | null>(null);

  const reset = () => {
    setStep('upload');
    setFile(null);
    setData(emptyQuote);
    setStoragePath(null);
    setParsing(false);
    setSaving(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      toast({ title: 'รองรับเฉพาะไฟล์ PDF', variant: 'destructive' });
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast({ title: 'ไฟล์ใหญ่เกิน 20MB', variant: 'destructive' });
      return;
    }
    setFile(f);
  };

  const handleParse = async () => {
    if (!file) return;
    setParsing(true);
    try {
      // 1) Upload to storage
      const safeName = file.name.replace(/[^\w.-]/g, '_').slice(0, 80);
      const path = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage.from('quote-imports').upload(path, file, {
        contentType: 'application/pdf',
        upsert: false,
      });
      if (upErr) throw new Error(`อัปโหลดไฟล์ล้มเหลว: ${upErr.message}`);
      setStoragePath(path);

      // 2) Send to AI
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      const file_base64 = btoa(binary);

      const { data: result, error } = await supabase.functions.invoke('parse-quote-pdf', {
        body: { file_base64, media_type: 'application/pdf' },
      });
      if (error) throw new Error(error.message);
      if (result?.error) throw new Error(result.error);
      if (!result?.success || !result?.data) throw new Error('AI ไม่ส่งข้อมูลกลับ');

      // 3) Normalize numbers
      const d = result.data as Partial<ImportedQuote>;
      const items: ImportedItem[] = (d.items || []).map((it: any) => ({
        name: String(it.name || ''),
        description: String(it.description || ''),
        quantity: Number(it.quantity) || 0,
        unit_price: Number(it.unit_price) || 0,
        discount_percent: Number(it.discount_percent) || 0,
        discount_amount: Number(it.discount_amount) || 0,
        line_total: Number(it.line_total) || (Number(it.quantity) || 0) * (Number(it.unit_price) || 0),
      }));
      setData({
        ...emptyQuote,
        ...d,
        items,
        subtotal: Number(d.subtotal) || 0,
        discount_amount: Number(d.discount_amount) || 0,
        discount_percent: Number(d.discount_percent) || 0,
        vat_percent: Number(d.vat_percent) || 7,
        vat_amount: Number(d.vat_amount) || 0,
        withholding_percent: Number(d.withholding_percent) || 0,
        withholding_amount: Number(d.withholding_amount) || 0,
        grand_total: Number(d.grand_total) || 0,
        customer_branch_type: d.customer_branch_type || 'head_office',
      } as ImportedQuote);
      setStep('preview');
      toast({ title: 'AI อ่านข้อมูลสำเร็จ', description: 'กรุณาตรวจสอบและแก้ไขก่อนบันทึก' });
    } catch (e: any) {
      console.error(e);
      toast({ title: 'นำเข้า PDF ล้มเหลว', description: e.message, variant: 'destructive' });
    } finally {
      setParsing(false);
    }
  };

  const updateItem = (idx: number, patch: Partial<ImportedItem>) => {
    setData((prev) => {
      const items = [...prev.items];
      const next = { ...items[idx], ...patch };
      next.line_total = (Number(next.quantity) || 0) * (Number(next.unit_price) || 0) - (Number(next.discount_amount) || 0);
      items[idx] = next;
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setData((p) => ({
      ...p,
      items: [...p.items, { name: '', description: '', quantity: 1, unit_price: 0, discount_percent: 0, discount_amount: 0, line_total: 0 }],
    }));
  };

  const removeItem = (idx: number) => {
    setData((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
  };

  const recompute = () => {
    setData((p) => {
      const subtotal = p.items.reduce((s, it) => s + (Number(it.line_total) || 0), 0);
      const afterDiscount = subtotal - (Number(p.discount_amount) || 0);
      const vat_amount = afterDiscount * (Number(p.vat_percent) || 0) / 100;
      const withholding_amount = afterDiscount * (Number(p.withholding_percent) || 0) / 100;
      const grand_total = afterDiscount + vat_amount - withholding_amount;
      return { ...p, subtotal, vat_amount, withholding_amount, grand_total };
    });
  };

  const handleSave = async () => {
    if (!data.customer_name) {
      toast({ title: 'กรุณากรอกชื่อลูกค้า', variant: 'destructive' });
      return;
    }
    if (data.items.length === 0) {
      toast({ title: 'ต้องมีอย่างน้อย 1 รายการสินค้า', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const validUntil = data.valid_until || (() => {
        const d = new Date(); d.setDate(d.getDate() + 30);
        return d.toISOString().slice(0, 10);
      })();

      const { data: row, error } = await supabase
        .from('quote_requests')
        .insert({
          quote_number: data.quote_number || '',
          customer_name: data.customer_name,
          customer_email: data.customer_email || '',
          customer_phone: data.customer_phone || null,
          customer_company: data.customer_company || null,
          customer_address: data.customer_address || null,
          customer_tax_id: (data.customer_tax_id || '').replace(/[-\s]/g, '') || null,
          products: data.items.map((it) => ({
            name: it.name,
            description: it.description,
            quantity: it.quantity,
            unit_price: it.unit_price,
            discount_percent: it.discount_percent,
            discount_amount: it.discount_amount,
            line_total: it.line_total,
          })) as any,
          subtotal: data.subtotal,
          discount_percent: data.discount_percent,
          discount_amount: data.discount_amount,
          vat_percent: data.vat_percent,
          vat_amount: data.vat_amount,
          grand_total: data.grand_total,
          payment_terms: data.payment_terms || null,
          delivery_terms: data.delivery_terms || null,
          warranty_terms: data.warranty_terms || null,
          notes: data.notes || null,
          valid_until: validUntil,
          status: 'pending',
          metadata: {
            imported_from_pdf: true,
            imported_at: new Date().toISOString(),
            source_file: file?.name,
            storage_path: storagePath,
            original_quote_number: data.quote_number,
            withholding_percent: data.withholding_percent,
            withholding_amount: data.withholding_amount,
            customer_branch: {
              type: data.customer_branch_type,
              code: data.customer_branch_code,
              name: data.customer_branch_name,
            },
          } as any,
        })
        .select()
        .single();

      if (error) throw error;

      toast({ title: 'นำเข้าใบเสนอราคาสำเร็จ', description: `เลขที่ ${row.quote_number}` });
      onImported?.();
      handleClose(false);
      navigate(`/admin/quotes/${row.id}`);
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            นำเข้าใบเสนอราคาจาก PDF
          </DialogTitle>
          <DialogDescription>
            อัปโหลดไฟล์ PDF ใบเสนอราคา ระบบจะใช้ AI อ่านและแตกข้อมูลให้อัตโนมัติ คุณสามารถตรวจสอบและแก้ไขก่อนบันทึกเข้าสู่ระบบ
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <Card className="border-dashed border-2">
              <CardContent className="p-8 text-center space-y-4">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">เลือกไฟล์ PDF ใบเสนอราคา</p>
                  <p className="text-xs text-muted-foreground mt-1">รองรับไฟล์ขนาดไม่เกิน 20MB</p>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="max-w-sm mx-auto"
                />
                {file && (
                  <div className="flex items-center justify-center gap-2 text-sm text-foreground bg-muted/50 rounded-md p-3 max-w-md mx-auto">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                AI จะพยายามอ่านข้อมูลลูกค้า รายการสินค้า ราคา และเงื่อนไขจากเอกสาร — กรุณาตรวจสอบความถูกต้องก่อนบันทึก
                ผลลัพธ์อาจคลาดเคลื่อนสำหรับ PDF ที่เป็นรูปสแกนคุณภาพต่ำ
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)} disabled={parsing}>ยกเลิก</Button>
              <Button onClick={handleParse} disabled={!file || parsing}>
                {parsing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />AI กำลังอ่านเอกสาร...</> : <><Sparkles className="w-4 h-4 mr-2" />อ่านด้วย AI</>}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            {/* Quote header */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">ข้อมูลใบเสนอราคา</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">เลขที่ใบเสนอราคา (เดิม)</Label>
                    <Input value={data.quote_number} onChange={(e) => setData({ ...data, quote_number: e.target.value })} className="h-9" placeholder="ปล่อยว่างเพื่อให้ระบบสร้างใหม่" />
                  </div>
                  <div>
                    <Label className="text-xs">วันที่เอกสาร</Label>
                    <Input type="date" value={data.quote_date} onChange={(e) => setData({ ...data, quote_date: e.target.value })} className="h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">มีผลถึง</Label>
                    <Input type="date" value={data.valid_until} onChange={(e) => setData({ ...data, valid_until: e.target.value })} className="h-9" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">ข้อมูลลูกค้า</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">ชื่อผู้ติดต่อ *</Label>
                    <Input value={data.customer_name} onChange={(e) => setData({ ...data, customer_name: e.target.value })} className="h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">บริษัท</Label>
                    <Input value={data.customer_company} onChange={(e) => setData({ ...data, customer_company: e.target.value })} className="h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">อีเมล</Label>
                    <Input value={data.customer_email} onChange={(e) => setData({ ...data, customer_email: e.target.value })} className="h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">โทรศัพท์</Label>
                    <Input value={data.customer_phone} onChange={(e) => setData({ ...data, customer_phone: e.target.value })} className="h-9" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">ที่อยู่</Label>
                    <Textarea value={data.customer_address} onChange={(e) => setData({ ...data, customer_address: e.target.value })} rows={2} />
                  </div>
                  <div>
                    <Label className="text-xs">เลขประจำตัวผู้เสียภาษี</Label>
                    <Input value={data.customer_tax_id} onChange={(e) => setData({ ...data, customer_tax_id: e.target.value })} className="h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">สาขา</Label>
                    <Input value={data.customer_branch_name} onChange={(e) => setData({ ...data, customer_branch_name: e.target.value })} className="h-9" placeholder="เช่น สำนักงานใหญ่" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">รายการสินค้า ({data.items.length})</h3>
                  <Button size="sm" variant="outline" onClick={addItem}><Plus className="w-3 h-3 mr-1" />เพิ่มรายการ</Button>
                </div>
                <div className="space-y-2">
                  {data.items.map((it, idx) => (
                    <div key={idx} className="border border-border rounded-md p-3 space-y-2 bg-muted/20">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-muted-foreground w-6 mt-2">#{idx + 1}</span>
                        <div className="flex-1 grid grid-cols-12 gap-2">
                          <div className="col-span-12">
                            <Input value={it.name} onChange={(e) => updateItem(idx, { name: e.target.value })} placeholder="ชื่อสินค้า / โมเดล" className="h-9 font-medium" />
                          </div>
                          <div className="col-span-12">
                            <Label className="text-[10px]">รายละเอียด / สเปก</Label>
                            <Textarea
                              value={it.description}
                              onChange={(e) => updateItem(idx, { description: e.target.value })}
                              placeholder="รายละเอียด / สเปก (รองรับข้อความยาว เลื่อนดูได้)"
                              rows={5}
                              className="text-xs leading-relaxed font-mono min-h-[120px] max-h-[320px] resize-y overflow-auto whitespace-pre-wrap"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-[10px]">จำนวน</Label>
                            <Input type="number" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} className="h-8" />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-[10px]">ราคาต่อหน่วย</Label>
                            <Input type="number" value={it.unit_price} onChange={(e) => updateItem(idx, { unit_price: Number(e.target.value) })} className="h-8" />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-[10px]">ส่วนลด (บาท)</Label>
                            <Input type="number" value={it.discount_amount} onChange={(e) => updateItem(idx, { discount_amount: Number(e.target.value) })} className="h-8" />
                          </div>
                          <div className="col-span-4">
                            <Label className="text-[10px]">ยอดรวม</Label>
                            <Input type="number" value={it.line_total} onChange={(e) => updateItem(idx, { line_total: Number(e.target.value) })} className="h-8 font-medium" />
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => removeItem(idx)} className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {data.items.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-6">ยังไม่มีรายการสินค้า — กดเพิ่มรายการ</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Totals */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">สรุปยอด</h3>
                  <Button size="sm" variant="outline" onClick={recompute}>คำนวณใหม่จากรายการ</Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">ยอดก่อน VAT (Subtotal)</Label>
                    <Input type="number" value={data.subtotal} onChange={(e) => setData({ ...data, subtotal: Number(e.target.value) })} className="h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">ส่วนลดรวม (บาท)</Label>
                    <Input type="number" value={data.discount_amount} onChange={(e) => setData({ ...data, discount_amount: Number(e.target.value) })} className="h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">VAT (%)</Label>
                    <Input type="number" value={data.vat_percent} onChange={(e) => setData({ ...data, vat_percent: Number(e.target.value) })} className="h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">VAT (บาท)</Label>
                    <Input type="number" value={data.vat_amount} onChange={(e) => setData({ ...data, vat_amount: Number(e.target.value) })} className="h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">หัก ณ ที่จ่าย (%)</Label>
                    <Input type="number" value={data.withholding_percent} onChange={(e) => setData({ ...data, withholding_percent: Number(e.target.value) })} className="h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">หัก ณ ที่จ่าย (บาท)</Label>
                    <Input type="number" value={data.withholding_amount} onChange={(e) => setData({ ...data, withholding_amount: Number(e.target.value) })} className="h-9" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">ยอดรวมสุทธิ</Label>
                  <Input
                    type="number"
                    value={data.grand_total}
                    onChange={(e) => setData({ ...data, grand_total: Number(e.target.value) })}
                    className="h-11 max-w-xs text-right text-lg font-bold"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">≈ {fmt(data.grand_total)} บาท</p>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">เงื่อนไขและหมายเหตุ</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-xs">เงื่อนไขการชำระเงิน</Label>
                    <Textarea value={data.payment_terms} onChange={(e) => setData({ ...data, payment_terms: e.target.value })} rows={2} />
                  </div>
                  <div>
                    <Label className="text-xs">เงื่อนไขการส่งมอบ</Label>
                    <Textarea value={data.delivery_terms} onChange={(e) => setData({ ...data, delivery_terms: e.target.value })} rows={2} />
                  </div>
                  <div>
                    <Label className="text-xs">การรับประกัน</Label>
                    <Textarea value={data.warranty_terms} onChange={(e) => setData({ ...data, warranty_terms: e.target.value })} rows={2} />
                  </div>
                  <div>
                    <Label className="text-xs">หมายเหตุ</Label>
                    <Textarea value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} rows={2} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('upload')} disabled={saving}>ย้อนกลับ</Button>
              <Button variant="outline" onClick={() => handleClose(false)} disabled={saving}>ยกเลิก</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />กำลังบันทึก...</> : 'บันทึกเข้าระบบ'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preFill?: {
    productId?: string;
    productName?: string;
    productSku?: string;
    warrantyMonths?: number;
    warrantyType?: 'carry_in' | 'on_site';
    warrantyTerms?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerCompany?: string;
    customerId?: string;
    invoiceId?: string;
    warrantyStartDate?: string;
  };
  onSuccess?: () => void;
}

export default function RegisterProductDialog({ open, onOpenChange, preFill, onSuccess }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const [productId, setProductId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [warrantyStartDate, setWarrantyStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [warrantyMonths, setWarrantyMonths] = useState(12);
  const [warrantyType, setWarrantyType] = useState<'carry_in' | 'on_site'>('carry_in');
  const [warrantyTerms, setWarrantyTerms] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (!open) return;
    supabase
      .from('products')
      .select('id, sku, name, model, warranty_months, warranty_type, warranty_terms')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setProducts(data || []));

    if (preFill) {
      if (preFill.productId) setProductId(preFill.productId);
      if (preFill.customerEmail) setCustomerEmail(preFill.customerEmail);
      if (preFill.customerName) setCustomerName(preFill.customerName);
      if (preFill.customerPhone) setCustomerPhone(preFill.customerPhone);
      if (preFill.customerCompany) setCustomerCompany(preFill.customerCompany);
      if (preFill.warrantyMonths) setWarrantyMonths(preFill.warrantyMonths);
      if (preFill.warrantyType) setWarrantyType(preFill.warrantyType);
      if (preFill.warrantyTerms) setWarrantyTerms(preFill.warrantyTerms);
      if (preFill.warrantyStartDate) setWarrantyStartDate(preFill.warrantyStartDate);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSerialNumber('');
      setCustomerEmail('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerCompany('');
      setAdminNotes('');
      setProductId('');
    }
  }, [open]);

  const handleProductChange = (id: string) => {
    setProductId(id);
    const p = products.find(x => x.id === id);
    if (p) {
      setWarrantyMonths(p.warranty_months || 12);
      setWarrantyType(p.warranty_type || 'carry_in');
      setWarrantyTerms(p.warranty_terms || '');
    }
  };

  const handleSubmit = async () => {
    if (!serialNumber.trim()) { toast({ title: 'กรุณาใส่ Serial Number', variant: 'destructive' }); return; }
    if (!customerEmail.trim() || !customerName.trim()) { toast({ title: 'กรุณาใส่ข้อมูลลูกค้า', variant: 'destructive' }); return; }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const product = products.find(p => p.id === productId);

      const { error } = await (supabase as any)
        .from('registered_products')
        .insert({
          product_id: productId || null,
          product_name_snapshot: product?.name || serialNumber,
          product_sku_snapshot: product?.sku || null,
          serial_number: serialNumber.trim(),
          customer_id: preFill?.customerId || null,
          customer_email: customerEmail.trim().toLowerCase(),
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim() || null,
          customer_company: customerCompany.trim() || null,
          warranty_start_date: warrantyStartDate,
          warranty_months: warrantyMonths,
          warranty_type: warrantyType,
          warranty_terms: warrantyTerms.trim() || null,
          source: 'admin',
          invoice_id: preFill?.invoiceId || null,
          status: 'active',
          admin_notes: adminNotes.trim() || null,
          registered_by: user?.id,
        });

      if (error) {
        if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
          toast({ title: 'Serial number นี้ลงทะเบียนแล้ว', description: serialNumber, variant: 'destructive' });
        } else throw error;
        return;
      }

      toast({ title: '✅ ลงทะเบียนสำเร็จ' });
      onOpenChange(false);
      onSuccess?.();
    } catch (e: any) {
      toast({ title: 'ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ลงทะเบียนสินค้า</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>สินค้า <span className="text-destructive">*</span></Label>
            <Select value={productId} onValueChange={handleProductChange}>
              <SelectTrigger><SelectValue placeholder="เลือกสินค้า" /></SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Serial Number <span className="text-destructive">*</span></Label>
            <Input value={serialNumber} onChange={e => setSerialNumber(e.target.value)} placeholder="เช่น SN-A001-2024" className="font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>ชื่อลูกค้า <span className="text-destructive">*</span></Label><Input value={customerName} onChange={e => setCustomerName(e.target.value)} /></div>
            <div><Label>Email <span className="text-destructive">*</span></Label><Input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} /></div>
            <div><Label>เบอร์โทร</Label><Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} /></div>
            <div><Label>บริษัท</Label><Input value={customerCompany} onChange={e => setCustomerCompany(e.target.value)} /></div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">ข้อมูลประกัน</p>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>วันเริ่มรับประกัน</Label><Input type="date" value={warrantyStartDate} onChange={e => setWarrantyStartDate(e.target.value)} /></div>
              <div><Label>ระยะ (เดือน)</Label><Input type="number" min="1" value={warrantyMonths} onChange={e => setWarrantyMonths(parseInt(e.target.value) || 12)} /></div>
            </div>
            <div>
              <Label>ประเภท</Label>
              <Select value={warrantyType} onValueChange={(v: any) => setWarrantyType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="carry_in">Carry-in (ลูกค้านำมาส่ง)</SelectItem>
                  <SelectItem value="on_site">On-site (ช่างไปที่ลูกค้า)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>เงื่อนไข</Label><Textarea value={warrantyTerms} onChange={e => setWarrantyTerms(e.target.value)} rows={2} placeholder="รับประกัน 1 ปี ไม่รวมของสิ้นเปลือง..." /></div>
          </div>
          <div><Label>หมายเหตุ (admin only)</Label><Textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={2} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            ลงทะเบียน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

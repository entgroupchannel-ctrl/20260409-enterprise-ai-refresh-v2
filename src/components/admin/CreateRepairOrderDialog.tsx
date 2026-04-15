import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';

const ISSUE_CATEGORIES = [
  { value: 'power', label: 'ไฟฟ้า / เปิดไม่ติด' },
  { value: 'display', label: 'จอแสดงผล' },
  { value: 'network', label: 'เครือข่าย' },
  { value: 'storage', label: 'จัดเก็บข้อมูล' },
  { value: 'performance', label: 'ประสิทธิภาพ' },
  { value: 'hardware', label: 'ฮาร์ดแวร์' },
  { value: 'software', label: 'ซอฟต์แวร์' },
  { value: 'physical_damage', label: 'ความเสียหายทางกายภาพ' },
  { value: 'other', label: 'อื่นๆ' },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  prefillSerial?: string;
  prefillRegisteredProductId?: string;
}

export default function CreateRepairOrderDialog({ open, onOpenChange, onCreated, prefillSerial, prefillRegisteredProductId }: Props) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [snSearch, setSnSearch] = useState(prefillSerial || '');
  const [searching, setSearching] = useState(false);
  const [snResult, setSnResult] = useState<any>(null);

  const [form, setForm] = useState({
    product_name: '',
    product_sku: '',
    serial_number: prefillSerial || '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_company: '',
    issue_category: 'other',
    issue_description: '',
    priority: 'normal',
    registered_product_id: prefillRegisteredProductId || null as string | null,
    customer_id: null as string | null,
    product_id: null as string | null,
    warranty_status: 'unknown',
    is_chargeable: true,
  });

  const searchSN = async () => {
    if (!snSearch.trim()) return;
    setSearching(true);
    try {
      // Search registered products
      const { data } = await (supabase as any)
        .from('registered_products')
        .select('*')
        .eq('serial_number', snSearch.trim())
        .is('deleted_at', null)
        .maybeSingle();

      if (data) {
        // Check warranty
        const { data: warrantyData } = await (supabase as any).rpc('check_warranty_status', { p_serial_number: snSearch.trim() });
        const ws = warrantyData || {};
        const warrantyStatus = ws.warranty_status || 'unknown';
        const isChargeable = !['in_warranty', 'extended_warranty'].includes(warrantyStatus);

        setSnResult(data);
        setForm(prev => ({
          ...prev,
          product_name: data.product_name || '',
          product_sku: data.product_sku || '',
          serial_number: data.serial_number || '',
          customer_name: data.customer_name || '',
          customer_email: data.customer_email || '',
          customer_phone: data.customer_phone || '',
          customer_company: data.customer_company || '',
          registered_product_id: data.id,
          customer_id: data.customer_id,
          product_id: data.product_id,
          warranty_status: warrantyStatus,
          is_chargeable: isChargeable,
        }));
        toast({ title: warrantyStatus === 'in_warranty' ? '✅ ในประกัน — ซ่อมฟรี' : '⚠️ นอกประกัน — เสียค่าใช้จ่าย' });
      } else {
        setSnResult(null);
        setForm(prev => ({
          ...prev,
          warranty_status: 'not_registered',
          is_chargeable: true,
          registered_product_id: null,
        }));
        toast({ title: 'ไม่พบ S/N ในระบบ', description: 'กรอกข้อมูลสินค้าด้วยตนเอง', variant: 'destructive' });
      }
    } catch { }
    setSearching(false);
  };

  const handleSubmit = async () => {
    if (!form.product_name || !form.issue_description || !form.customer_name) {
      toast({ title: 'กรุณากรอกข้อมูลให้ครบ', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const { error } = await (supabase as any).from('repair_orders').insert({
        product_name: form.product_name,
        product_sku: form.product_sku || null,
        serial_number: form.serial_number || null,
        customer_name: form.customer_name,
        customer_email: form.customer_email || null,
        customer_phone: form.customer_phone || null,
        customer_company: form.customer_company || null,
        customer_id: form.customer_id,
        product_id: form.product_id,
        registered_product_id: form.registered_product_id,
        issue_category: form.issue_category,
        issue_description: form.issue_description,
        priority: form.priority,
        warranty_status: form.warranty_status,
        is_chargeable: form.is_chargeable,
        status: 'pending',
        created_by: profile?.id,
      });
      if (error) throw error;
      toast({ title: 'สร้างใบสั่งซ่อมสำเร็จ' });
      onOpenChange(false);
      onCreated?.();
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>สร้างใบสั่งซ่อม</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* SN Search */}
          <div>
            <Label>ค้นหา S/N</Label>
            <div className="flex gap-2">
              <Input value={snSearch} onChange={e => setSnSearch(e.target.value)} placeholder="กรอก Serial Number" onKeyDown={e => e.key === 'Enter' && searchSN()} />
              <Button variant="outline" size="icon" onClick={searchSN} disabled={searching}>
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            {snResult && <p className="text-xs text-green-600 mt-1">พบ: {snResult.product_name} — {form.warranty_status === 'in_warranty' ? 'ในประกัน' : 'นอกประกัน'}</p>}
          </div>

          {/* Product info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>ชื่อสินค้า *</Label>
              <Input value={form.product_name} onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))} />
            </div>
            <div>
              <Label>SKU</Label>
              <Input value={form.product_sku} onChange={e => setForm(f => ({ ...f, product_sku: e.target.value }))} />
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>ชื่อลูกค้า *</Label>
              <Input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} />
            </div>
            <div>
              <Label>อีเมล</Label>
              <Input value={form.customer_email} onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))} />
            </div>
            <div>
              <Label>โทรศัพท์</Label>
              <Input value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))} />
            </div>
            <div>
              <Label>บริษัท</Label>
              <Input value={form.customer_company} onChange={e => setForm(f => ({ ...f, customer_company: e.target.value }))} />
            </div>
          </div>

          {/* Issue */}
          <div>
            <Label>หมวดหมู่ปัญหา</Label>
            <Select value={form.issue_category} onValueChange={v => setForm(f => ({ ...f, issue_category: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ISSUE_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>รายละเอียดอาการ *</Label>
            <Textarea value={form.issue_description} onChange={e => setForm(f => ({ ...f, issue_description: e.target.value }))} rows={3} />
          </div>

          {/* Priority */}
          <div>
            <Label>ลำดับความเร่งด่วน</Label>
            <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">ต่ำ</SelectItem>
                <SelectItem value="normal">ปกติ</SelectItem>
                <SelectItem value="high">สูง</SelectItem>
                <SelectItem value="urgent">เร่งด่วน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            สร้างใบสั่งซ่อม
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

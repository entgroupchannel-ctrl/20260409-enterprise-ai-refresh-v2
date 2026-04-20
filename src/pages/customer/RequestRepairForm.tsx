import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wrench } from 'lucide-react';

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

export default function RequestRepairForm() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [issueCategory, setIssueCategory] = useState('other');
  const [issueDescription, setIssueDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await (supabase as any)
        .from('registered_products')
        .select('id, serial_number, product_name, product_sku')
        .eq('customer_id', user.id)
        .is('deleted_at', null)
        .neq('status', 'void');
      setMyProducts(data || []);
    };
    load();
  }, [user]);

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    const p = myProducts.find(x => x.id === id);
    if (p) {
      setSerialNumber(p.serial_number || '');
      setProductName(p.product_name || '');
    }
  };

  const handleSubmit = async () => {
    if (!productName || !issueDescription) {
      toast({ title: 'กรุณากรอกข้อมูลให้ครบ', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const customerName = profile?.full_name || user?.email || '';
      const customerEmail = user?.email || '';
      const { data: ro, error } = await (supabase as any).from('repair_orders').insert({
        product_name: productName,
        serial_number: serialNumber || null,
        registered_product_id: selectedProductId || null,
        customer_id: user?.id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: profile?.phone || null,
        customer_company: profile?.company || null,
        issue_category: issueCategory,
        issue_description: issueDescription,
        status: 'pending',
        created_by: user?.id,
      }).select().single();
      if (error) throw error;

      // 3-layer notification (fire-and-forget)
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const repairNumber = ro?.repair_order_number || ro?.id;
      import('@/lib/notifications').then(({ notifyAdmins, notifyAdminsByEmail, sendQuoteStatusEmail }) => {
        notifyAdmins({
          type: 'new_repair_request',
          title: 'มีคำขอแจ้งซ่อมใหม่',
          message: `${customerName} — ${productName}`,
          priority: 'high',
          actionUrl: `/admin/repairs/${ro?.id}`,
          actionLabel: 'ดูรายละเอียด',
          linkType: 'repair',
          linkId: ro?.id,
        });
        notifyAdminsByEmail({
          subject: `[Repair] แจ้งซ่อมใหม่ ${repairNumber}`,
          status: 'new_repair_request',
          customerName,
          quoteNumber: repairNumber,
          note: issueDescription,
          viewUrl: `${origin}/admin/repairs/${ro?.id}`,
        });
        if (customerEmail) {
          sendQuoteStatusEmail({
            recipientEmail: customerEmail,
            customerName,
            quoteNumber: repairNumber,
            status: 'repair_received',
            viewUrl: `${origin}/my/repairs`,
            note: 'เราได้รับคำขอแจ้งซ่อมของคุณแล้ว ทีมช่างจะติดต่อกลับโดยเร็วที่สุด',
          });
        }
      });

      toast({ title: 'แจ้งซ่อมสำเร็จ', description: 'ทีมงานจะติดต่อกลับเร็วๆ นี้' });
      navigate('/my/repairs');
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <CustomerLayout title="แจ้งซ่อม">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">แจ้งซ่อม</h1>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">ข้อมูลสินค้า</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {myProducts.length > 0 && (
              <div>
                <Label>เลือกจากสินค้าที่ลงทะเบียน</Label>
                <Select value={selectedProductId} onValueChange={handleProductSelect}>
                  <SelectTrigger><SelectValue placeholder="เลือกสินค้า..." /></SelectTrigger>
                  <SelectContent>
                    {myProducts.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.product_name} — S/N: {p.serial_number}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>ชื่อสินค้า *</Label>
              <Input value={productName} onChange={e => setProductName(e.target.value)} />
            </div>
            <div>
              <Label>Serial Number</Label>
              <Input value={serialNumber} onChange={e => setSerialNumber(e.target.value)} placeholder="หมายเลข S/N (ถ้ามี)" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">อาการเสีย</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>หมวดหมู่</Label>
              <Select value={issueCategory} onValueChange={setIssueCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ISSUE_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>รายละเอียดอาการ *</Label>
              <Textarea value={issueDescription} onChange={e => setIssueDescription(e.target.value)} rows={4} placeholder="อธิบายอาการเสียโดยละเอียด..." />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSubmit} disabled={saving} className="w-full" size="lg">
          {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          ส่งแจ้งซ่อม
        </Button>
      </div>
    </CustomerLayout>
  );
}

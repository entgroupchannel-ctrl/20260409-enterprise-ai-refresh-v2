import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNavbar from '@/components/SiteNavbar';
import MiniFooter from '@/components/MiniFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Wrench } from 'lucide-react';

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
      const { error } = await (supabase as any).from('repair_orders').insert({
        product_name: productName,
        serial_number: serialNumber || null,
        registered_product_id: selectedProductId || null,
        customer_id: user?.id,
        customer_name: profile?.full_name || user?.email || '',
        customer_email: user?.email || '',
        customer_phone: profile?.phone || null,
        customer_company: profile?.company || null,
        issue_category: issueCategory,
        issue_description: issueDescription,
        status: 'pending',
        created_by: user?.id,
      });
      if (error) throw error;
      toast({ title: 'แจ้งซ่อมสำเร็จ', description: 'ทีมงานจะติดต่อกลับเร็วๆ นี้' });
      navigate('/my/repairs');
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="container max-w-lg py-8 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/my/repairs')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">แจ้งซ่อม</h1>
          </div>
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
      <FooterCompact />
    </div>
  );
}

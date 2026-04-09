// src/pages/customer/QuoteRequestForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Trash2, Send } from 'lucide-react';

interface ProductItem {
  model: string;
  description: string;
  qty: number;
}

export default function QuoteRequestForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: user?.email || '',
    customer_phone: '',
    customer_company: '',
    customer_address: '',
    customer_tax_id: '',
    notes: '',
  });

  const [products, setProducts] = useState<ProductItem[]>([
    { model: '', description: '', qty: 1 },
  ]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (index: number, field: keyof ProductItem, value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { model: '', description: '', qty: 1 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length === 1) {
      toast({
        title: 'ไม่สามารถลบได้',
        description: 'ต้องมีอย่างน้อย 1 รายการ',
        variant: 'destructive',
      });
      return;
    }
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customer_name || !formData.customer_email) {
      toast({
        title: 'กรุณากรอกข้อมูลให้ครบ',
        description: 'ชื่อและอีเมลเป็นข้อมูลที่จำเป็น',
        variant: 'destructive',
      });
      return;
    }

    const hasValidProduct = products.some((p) => p.model.trim() !== '' && p.qty > 0);
    if (!hasValidProduct) {
      toast({
        title: 'กรุณาระบุรายการสินค้า',
        description: 'ต้องมีอย่างน้อย 1 รายการที่ระบุรุ่นและจำนวน',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .insert({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          customer_company: formData.customer_company,
          customer_address: formData.customer_address,
          customer_tax_id: formData.customer_tax_id,
          notes: formData.notes,
          products: products
            .filter((p) => p.model.trim() !== '')
            .map((p) => ({
              model: p.model,
              description: p.description,
              qty: p.qty,
              unit_price: 0,
              discount_percent: 0,
              line_total: 0,
            })),
          status: 'pending',
          subtotal: 0,
          vat_amount: 0,
          grand_total: 0,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'ส่งคำขอสำเร็จ',
        description: `เลขที่ ${data.quote_number} - เราจะติดต่อกลับภายใน 24 ชั่วโมง`,
      });

      // Redirect to my quotes or success page
      if (user) {
        navigate('/my-quotes');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ขอใบเสนอราคา</h1>
          <p className="text-gray-600">
            กรอกข้อมูลของท่านและรายการสินค้าที่ต้องการ เราจะติดต่อกลับภายใน 24 ชั่วโมง
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลติดต่อ</CardTitle>
              <CardDescription>กรอกข้อมูลของท่านเพื่อให้เราติดต่อกลับ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.customer_name}
                    onChange={(e) => handleFormChange('customer_name', e.target.value)}
                    placeholder="เช่น สมชาย ใจดี"
                    required
                  />
                </div>
                <div>
                  <Label>
                    อีเมล <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => handleFormChange('customer_email', e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div>
                  <Label>เบอร์โทรศัพท์</Label>
                  <Input
                    value={formData.customer_phone}
                    onChange={(e) => handleFormChange('customer_phone', e.target.value)}
                    placeholder="081-234-5678"
                  />
                </div>
                <div>
                  <Label>บริษัท/ห้างร้าน</Label>
                  <Input
                    value={formData.customer_company}
                    onChange={(e) => handleFormChange('customer_company', e.target.value)}
                    placeholder="บริษัท ABC จำกัด"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>ที่อยู่</Label>
                  <Textarea
                    value={formData.customer_address}
                    onChange={(e) => handleFormChange('customer_address', e.target.value)}
                    placeholder="123 ถนน... ตำบล... อำเภอ... จังหวัด... 10000"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>เลขประจำตัวผู้เสียภาษี</Label>
                  <Input
                    value={formData.customer_tax_id}
                    onChange={(e) => handleFormChange('customer_tax_id', e.target.value)}
                    placeholder="0000000000000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>รายการสินค้า</CardTitle>
                  <CardDescription>ระบุรุ่นและจำนวนสินค้าที่ต้องการ</CardDescription>
                </div>
                <Button type="button" onClick={addProduct} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มรายการ
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {products.map((product, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">รายการที่ {index + 1}</span>
                    {products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">
                        รุ่น/Model <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={product.model}
                        onChange={(e) => handleProductChange(index, 'model', e.target.value)}
                        placeholder="GT-156"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-xs">รายละเอียด</Label>
                      <Input
                        value={product.description}
                        onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                        placeholder="รายละเอียดเพิ่มเติม..."
                      />
                    </div>
                    <div>
                      <Label className="text-xs">
                        จำนวน <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={product.qty}
                        onChange={(e) =>
                          handleProductChange(index, 'qty', parseInt(e.target.value) || 1)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>หมายเหตุเพิ่มเติม</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="ระบุความต้องการเพิ่มเติม เช่น งบประมาณ, ระยะเวลาที่ต้องการ..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              disabled={submitting}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={submitting} size="lg">
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'กำลังส่ง...' : 'ส่งคำขอใบเสนอราคา'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

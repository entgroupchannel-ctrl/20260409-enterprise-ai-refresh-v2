import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Send } from 'lucide-react';

interface QuoteRequestButtonProps {
  productModel?: string;
  productName?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function QuoteRequestButton({
  productModel,
  productName,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  className = '',
}: QuoteRequestButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: user?.email || '',
    customer_phone: '',
    customer_company: '',
    qty: 1,
    notes: '',
  });

  const handleFormChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickRequest = () => {
    if (productModel) {
      setFormData((prev) => ({ ...prev, customer_email: user?.email || prev.customer_email }));
      setShowDialog(true);
    } else {
      navigate('/request-quote');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.customer_email) {
      toast({
        title: 'กรุณากรอกข้อมูลให้ครบ',
        description: 'ชื่อและอีเมลเป็นข้อมูลที่จำเป็น',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await (supabase.from as any)('quote_requests')
        .insert({
          quote_number: '',
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone || null,
          customer_company: formData.customer_company || null,
          notes: formData.notes || null,
          products: [
            {
              model: productModel || '',
              description: productName || '',
              qty: formData.qty,
              unit_price: 0,
              discount_percent: 0,
              line_total: 0,
            },
          ],
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
        description: `เลขที่ ${data.quote_number} — เราจะติดต่อกลับภายใน 24 ชม.`,
      });

      setShowDialog(false);
      setFormData({
        customer_name: '',
        customer_email: user?.email || '',
        customer_phone: '',
        customer_company: '',
        qty: 1,
        notes: '',
      });

      if (user) {
        setTimeout(() => navigate('/my-quotes'), 1500);
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
    <>
      <Button
        variant={variant}
        size={size}
        className={`${fullWidth ? 'w-full' : ''} ${className}`}
        onClick={handleQuickRequest}
      >
        <FileText className="w-4 h-4 mr-2" />
        ขอใบเสนอราคา
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ขอใบเสนอราคา</DialogTitle>
            <DialogDescription>
              {productModel && (
                <span className="font-semibold text-primary">
                  {productModel}{productName ? ` — ${productName}` : ''}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>ชื่อ-นามสกุล <span className="text-destructive">*</span></Label>
              <Input
                value={formData.customer_name}
                onChange={(e) => handleFormChange('customer_name', e.target.value)}
                placeholder="สมชาย ใจดี"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>อีเมล <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                value={formData.customer_email}
                onChange={(e) => handleFormChange('customer_email', e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>เบอร์โทร</Label>
                <Input
                  value={formData.customer_phone}
                  onChange={(e) => handleFormChange('customer_phone', e.target.value)}
                  placeholder="081-234-5678"
                />
              </div>
              <div className="space-y-1.5">
                <Label>บริษัท</Label>
                <Input
                  value={formData.customer_company}
                  onChange={(e) => handleFormChange('customer_company', e.target.value)}
                  placeholder="บริษัท ABC จำกัด"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>จำนวน <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                min="1"
                value={formData.qty}
                onChange={(e) => handleFormChange('qty', parseInt(e.target.value) || 1)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>หมายเหตุ</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="ระบุความต้องการเพิ่มเติม..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} disabled={submitting}>
                ยกเลิก
              </Button>
              <Button type="submit" disabled={submitting}>
                <Send className="w-4 h-4 mr-2" />
                {submitting ? 'กำลังส่ง...' : 'ส่งคำขอ'}
              </Button>
            </div>
          </form>

          <div className="pt-3 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              หรือ{' '}
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => { setShowDialog(false); navigate('/request-quote'); }}
              >
                กรอกฟอร์มแบบเต็ม
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

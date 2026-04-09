import { useState, useEffect } from 'react';
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
import { FileText, Send, Loader2, Package } from 'lucide-react';

interface QuoteRequestButtonProps {
  productModel?: string;
  productName?: string;
  productImage?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function QuoteRequestButton({
  productModel,
  productName,
  productImage,
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
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: user?.email || '',
    customer_phone: '',
    customer_company: '',
    qty: 1,
    notes: '',
  });

  // Auto-fill from user profile when dialog opens
  useEffect(() => {
    if (showDialog && user) {
      loadUserProfile();
    }
  }, [showDialog, user]);

  const loadUserProfile = async () => {
    if (!user) return;
    setLoadingProfile(true);
    try {
      // Fetch from users table
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, phone, company, email')
        .eq('id', user.id)
        .maybeSingle();

      // Fetch from user_profiles table
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('contact_name, contact_phone, company_name, contact_email')
        .eq('user_id', user.id)
        .maybeSingle();

      setFormData((prev) => ({
        ...prev,
        customer_name: prev.customer_name || profileData?.contact_name || userData?.full_name || '',
        customer_email: prev.customer_email || profileData?.contact_email || userData?.email || user.email || '',
        customer_phone: prev.customer_phone || profileData?.contact_phone || userData?.phone || '',
        customer_company: prev.customer_company || profileData?.company_name || userData?.company || '',
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

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
            <DialogDescription asChild>
              <div>
                {productModel && (
                  <div className="flex items-center gap-3 mt-2 p-3 rounded-lg border border-border bg-muted/30">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productModel}
                        className="w-14 h-14 object-contain rounded-md border border-border bg-background"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-md border border-border bg-background flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{productModel}</p>
                      {productName && (
                        <p className="text-xs text-muted-foreground truncate">{productName}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {loadingProfile ? (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">กำลังโหลดข้อมูล...</span>
            </div>
          ) : (
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
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => handleFormChange('qty', Math.max(1, formData.qty - 1))}
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={formData.qty}
                    onChange={(e) => handleFormChange('qty', parseInt(e.target.value) || 1)}
                    className="text-center"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => handleFormChange('qty', formData.qty + 1)}
                  >
                    +
                  </Button>
                </div>
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
          )}

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

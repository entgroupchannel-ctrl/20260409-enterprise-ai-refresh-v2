import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getPendingQuote } from '@/hooks/usePendingQuote';
import { PendingItemsBanner } from '@/components/PendingItemsBanner';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    full_name: '', phone: '', company: '',
  });
  const [loading, setLoading] = useState(false);
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'รหัสผ่านไม่ตรงกัน', description: 'กรุณาตรวจสอบรหัสผ่านอีกครั้ง', variant: 'destructive' });
      return;
    }
    if (formData.password.length < 6) {
      toast({ title: 'รหัสผ่านสั้นเกินไป', description: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.full_name, formData.phone, formData.company);
      
      // Notify admins about new registration
      import('@/lib/notifications').then(({ notifyAdmins }) => {
        notifyAdmins({
          type: 'new_member',
          title: 'สมาชิกใหม่สมัครเข้าระบบ',
          message: `${formData.full_name || formData.email} (${formData.company || 'ไม่ระบุบริษัท'})`,
          priority: 'normal',
          actionUrl: '/admin/customers',
          actionLabel: 'ดูรายชื่อลูกค้า',
        });
      });

      toast({ title: 'สมัครสมาชิกสำเร็จ!', description: 'กำลังนำคุณไปยังหน้า Login...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'กรุณาลองใหม่อีกครั้ง';
      toast({ title: 'สมัครสมาชิกไม่สำเร็จ', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">สมัครสมาชิก</CardTitle>
          <CardDescription className="text-center">สร้างบัญชีเพื่อเข้าใช้งานระบบ</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <PendingItemsBanner />
            <div className="space-y-2">
              <Label htmlFor="full_name">ชื่อ-นามสกุล <span className="text-destructive">*</span></Label>
              <Input id="full_name" placeholder="สมชาย ใจดี" value={formData.full_name} onChange={(e) => updateField('full_name', e.target.value)} required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">เบอร์โทร</Label>
              <Input id="phone" type="tel" placeholder="081-234-5678" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">บริษัท</Label>
              <Input id="company" placeholder="บริษัท ABC จำกัด" value={formData.company} onChange={(e) => updateField('company', e.target.value)} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน <span className="text-destructive">*</span></Label>
              <Input id="password" type="password" placeholder="อย่างน้อย 6 ตัวอักษร" value={formData.password} onChange={(e) => updateField('password', e.target.value)} required disabled={loading} minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน <span className="text-destructive">*</span></Label>
              <Input id="confirmPassword" type="password" placeholder="พิมพ์รหัสผ่านอีกครั้ง" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required disabled={loading} minLength={6} />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />กำลังสมัครสมาชิก...</>) : 'สมัครสมาชิก'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              มีบัญชีอยู่แล้ว?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">เข้าสู่ระบบ</Link>
            </div>
            <div className="text-sm text-center">
              <Link to="/" className="text-muted-foreground hover:text-foreground">← กลับหน้าแรก</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

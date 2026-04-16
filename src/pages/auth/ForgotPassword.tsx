import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast({
        title: 'ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว',
        description: 'กรุณาตรวจสอบอีเมลของคุณ (รวมถึงโฟลเดอร์ Spam)',
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่';
      toast({ title: 'ส่งอีเมลไม่สำเร็จ', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">ลืมรหัสผ่าน</CardTitle>
          <CardDescription className="text-center">
            กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้
          </CardDescription>
        </CardHeader>

        {sent ? (
          <CardContent className="space-y-4 text-center py-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <MailCheck className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">ตรวจสอบอีเมลของคุณ</p>
              <p className="text-sm text-muted-foreground">
                เราได้ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่<br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-xs text-muted-foreground pt-2">
                ลิงก์จะใช้งานได้ 1 ชั่วโมง — หากไม่พบ กรุณาตรวจสอบโฟลเดอร์ Spam
              </p>
            </div>
            <div className="pt-2">
              <Link to="/login" className="text-sm text-primary hover:underline">← กลับไปเข้าสู่ระบบ</Link>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />กำลังส่ง...</>
                ) : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
              </Button>
              <div className="text-sm text-center">
                <Link to="/login" className="text-muted-foreground hover:text-foreground">
                  ← กลับไปเข้าสู่ระบบ
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}

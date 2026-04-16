import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Supabase auto-creates a recovery session from the URL hash on load.
  // We just verify a session exists before allowing password update.
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      // Give Supabase a moment to parse the URL hash
      await new Promise((r) => setTimeout(r, 300));
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setValidSession(!!data.session);
    };
    check();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setValidSession(true);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: 'รหัสผ่านสั้นเกินไป', description: 'ต้องมีอย่างน้อย 6 ตัวอักษร', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'รหัสผ่านไม่ตรงกัน', description: 'กรุณายืนยันรหัสผ่านให้ตรงกัน', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      toast({ title: 'ตั้งรหัสผ่านใหม่สำเร็จ', description: 'กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่' });
      // Sign out the recovery session so user must log in fresh
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'ไม่สามารถเปลี่ยนรหัสผ่านได้';
      toast({ title: 'เปลี่ยนรหัสผ่านไม่สำเร็จ', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">ตั้งรหัสผ่านใหม่</CardTitle>
          <CardDescription className="text-center">
            กรุณากรอกรหัสผ่านใหม่ของคุณ
          </CardDescription>
        </CardHeader>

        {validSession === null ? (
          <CardContent className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </CardContent>
        ) : validSession === false ? (
          <CardContent className="space-y-4 text-center py-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-destructive" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">ลิงก์ไม่ถูกต้องหรือหมดอายุ</p>
              <p className="text-sm text-muted-foreground">
                ลิงก์รีเซ็ตรหัสผ่านอาจหมดอายุแล้ว (ใช้ได้ 1 ชั่วโมง) กรุณาขอลิงก์ใหม่
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/forgot-password">
                <Button className="w-full">ขอลิงก์ใหม่</Button>
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                ← กลับไปเข้าสู่ระบบ
              </Link>
            </div>
          </CardContent>
        ) : done ? (
          <CardContent className="space-y-4 text-center py-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">ตั้งรหัสผ่านใหม่สำเร็จ</p>
              <p className="text-sm text-muted-foreground">กำลังนำคุณกลับไปหน้าเข้าสู่ระบบ...</p>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่านใหม่</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">อย่างน้อย 6 ตัวอักษร</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">ยืนยันรหัสผ่านใหม่</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />กำลังบันทึก...</>
                ) : 'บันทึกรหัสผ่านใหม่'}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}

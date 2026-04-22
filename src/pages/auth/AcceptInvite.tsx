import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserPlus, CheckCircle, XCircle, Building2 } from 'lucide-react';
import logo from '@/assets/logo-entgroup.avif';
import { ROLE_LABELS, type UserRole } from '@/types/auth';

interface Invitation {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
  expires_at: string;
}

export default function AcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (token) loadInvitation(token);
  }, [token]);

  const loadInvitation = async (t: string) => {
    try {
      const { data, error: err } = await (supabase as any)
        .from('employee_invitations')
        .select('id, email, role, full_name, expires_at')
        .eq('token', t)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (err) throw err;
      if (!data) {
        setError('ลิงก์เชิญไม่ถูกต้อง หมดอายุ หรือถูกใช้ไปแล้ว');
        return;
      }
      setInvitation(data);
      setFullName(data.full_name || '');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!invitation) return;
    if (!password || password.length < 8) {
      toast({ title: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'รหัสผ่านไม่ตรงกัน', variant: 'destructive' });
      return;
    }
    if (!fullName.trim()) {
      toast({ title: 'กรุณากรอกชื่อ-นามสกุล', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      // 1. Sign up
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: invitation.email,
        password,
        options: { data: { full_name: fullName.trim() } },
      });

      if (authErr) throw authErr;
      if (!authData.user) throw new Error('ไม่สามารถสร้างบัญชีได้');

      // 2. Update role
      if (invitation.role !== 'member') {
        const { error: roleErr } = await (supabase as any)
          .from('users')
          .update({ role: invitation.role })
          .eq('id', authData.user.id);
        if (roleErr) throw roleErr;
      }

      // 3. Create staff_details
      if (invitation.role !== 'member') {
        try {
          await (supabase as any)
            .from('staff_details')
            .insert({ user_id: authData.user.id });
        } catch { /* ignore */ }
      }

      // 4. Mark invitation as accepted
      await (supabase as any)
        .from('employee_invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invitation.id);

      setAccepted(true);
      toast({ title: '✅ เข้าร่วมทีมสำเร็จ!' });
    } catch (e: any) {
      // Handle existing user case
      if (e.message?.includes('already registered') || e.message?.includes('already been registered')) {
        toast({
          title: 'อีเมลนี้ลงทะเบียนแล้ว',
          description: 'กรุณาเข้าสู่ระบบด้วยอีเมลนี้',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'เกิดข้อผิดพลาด', description: e.message, variant: 'destructive' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h2 className="text-xl font-bold">ลิงก์ไม่ถูกต้อง</h2>
            <p className="text-muted-foreground text-sm">{error || 'ลิงก์เชิญไม่ถูกต้อง หมดอายุ หรือถูกใช้ไปแล้ว'}</p>
            <Button onClick={() => navigate('/login')}>ไปหน้าเข้าสู่ระบบ</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold">เข้าร่วมทีมสำเร็จ! 🎉</h2>
            <p className="text-muted-foreground text-sm">
              บัญชีของคุณถูกสร้างเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              เข้าสู่ระบบ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysLeft = Math.ceil((new Date(invitation.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <img src={logo} alt="ENT GROUP" className="h-10 w-auto"  loading="lazy" decoding="async"/>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">คำเชิญเข้าร่วมทีม</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            คุณได้รับเชิญให้เข้าร่วมระบบ ENT GROUP
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Invite info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">อีเมล</span>
              <span className="font-medium">{invitation.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ตำแหน่ง</span>
              <Badge variant="outline">{ROLE_LABELS[invitation.role as UserRole] || invitation.role}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">หมดอายุใน</span>
              <span className="text-xs">{daysLeft} วัน</span>
            </div>
          </div>

          {/* Signup form */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="inv-name">ชื่อ-นามสกุล *</Label>
              <Input
                id="inv-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ชื่อจริง นามสกุล"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="inv-password">ตั้งรหัสผ่าน *</Label>
              <Input
                id="inv-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 8 ตัวอักษร"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="inv-confirm">ยืนยันรหัสผ่าน *</Label>
              <Input
                id="inv-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                className="mt-1"
              />
            </div>
          </div>

          <Button onClick={handleAccept} disabled={saving} className="w-full" size="lg">
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> กำลังสร้างบัญชี...</>
            ) : (
              <><UserPlus className="w-4 h-4 mr-1.5" /> ยอมรับคำเชิญและสร้างบัญชี</>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            มีบัญชีอยู่แล้ว?{' '}
            <button onClick={() => navigate('/login')} className="text-primary hover:underline">
              เข้าสู่ระบบ
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

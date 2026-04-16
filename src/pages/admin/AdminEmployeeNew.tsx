import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, UserPlus, Save, Loader2, Info, Search, UserCheck,
  Link as LinkIcon, Copy, CheckCircle, Send,
} from 'lucide-react';
import { ROLE_DESCRIPTIONS, type UserRole } from '@/types/auth';

type Mode = 'invite' | 'new' | 'existing';

export default function AdminEmployeeNew() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<Mode>('invite');

  // Invite link fields
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('sales');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // New account fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<string>('sales');

  // Existing account lookup
  const [searchEmail, setSearchEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<{ id: string; email: string; full_name: string | null; role: string } | null>(null);
  const [existingRole, setExistingRole] = useState<string>('sales');

  const isSuperAdmin = profile?.role === 'super_admin';

  if (!isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">เฉพาะ super_admin เท่านั้น</p>
              <Button className="mt-4" onClick={() => navigate('/admin/employees')}>กลับ</Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  // ── Invite Link ──
  const handleCreateInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({ title: 'กรุณากรอกอีเมล', variant: 'destructive' });
      return;
    }
    setSaving(true);
    setGeneratedLink(null);
    try {
      const { data, error } = await (supabase as any)
        .from('employee_invitations')
        .insert({
          email: inviteEmail.trim().toLowerCase(),
          role: inviteRole,
          full_name: inviteName.trim() || null,
          invited_by: profile?.id,
        })
        .select('token')
        .single();

      if (error) throw error;
      const link = `https://www.entgroup.co.th/invite/${data.token}`;
      setGeneratedLink(link);
      toast({ title: '✅ สร้างลิงก์เชิญสำเร็จ' });
    } catch (e: any) {
      toast({ title: 'สร้างไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast({ title: 'คัดลอกลิงก์แล้ว' });
    setTimeout(() => setCopied(false), 3000);
  };

  // ── Search existing ──
  const handleSearchUser = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    setFoundUser(null);
    try {
      const { data, error } = await (supabase as any)
        .from('users')
        .select('id, email, full_name, role')
        .eq('email', searchEmail.trim().toLowerCase())
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        toast({ title: 'ไม่พบบัญชี', description: `ไม่มีอีเมล ${searchEmail} ในระบบ`, variant: 'destructive' });
        return;
      }
      setFoundUser(data);
      setExistingRole(data.role === 'member' ? 'sales' : data.role);
    } catch (e: any) {
      toast({ title: 'ค้นหาไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSearching(false);
    }
  };

  const handlePromoteExisting = async () => {
    if (!foundUser) return;
    setSaving(true);
    try {
      const { error: roleErr } = await (supabase as any)
        .from('users').update({ role: existingRole }).eq('id', foundUser.id);
      if (roleErr) throw roleErr;
      if (existingRole !== 'member') {
        try { await (supabase as any).from('staff_details').insert({ user_id: foundUser.id }); } catch { /* */ }
      }
      toast({ title: '✅ เลื่อนตำแหน่งสำเร็จ', description: `${foundUser.email} → ${existingRole}` });
      navigate(`/admin/employees/${foundUser.id}`);
    } catch (e: any) {
      toast({ title: 'ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // ── Create new ──
  const handleCreate = async () => {
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      toast({ title: 'กรุณากรอกข้อมูลให้ครบ', description: 'อีเมล รหัสผ่าน และชื่อ', variant: 'destructive' });
      return;
    }
    if (password.length < 8) {
      toast({ title: 'รหัสผ่านสั้นเกินไป', description: 'ต้องมีอย่างน้อย 8 ตัวอักษร', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: email.trim(), password: password.trim(),
        options: { data: { full_name: fullName.trim(), phone: phone.trim() || null } },
      });
      if (authErr) throw authErr;
      if (!authData.user) throw new Error('ไม่สามารถสร้างบัญชีได้');
      if (role !== 'member') {
        const { error: roleErr } = await (supabase as any).from('users').update({ role }).eq('id', authData.user.id);
        if (roleErr) throw roleErr;
      }
      if (role !== 'member') {
        try { await (supabase as any).from('staff_details').insert({ user_id: authData.user.id }); } catch { /* */ }
      }
      toast({ title: '✅ สร้างบัญชีสำเร็จ', description: `${email} — role: ${role}` });
      navigate(`/admin/employees/${authData.user.id}`);
    } catch (e: any) {
      toast({ title: 'สร้างบัญชีไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const roleOptions = (
    <>
      <SelectItem value="admin">Admin</SelectItem>
      <SelectItem value="sales">Sales</SelectItem>
      <SelectItem value="accountant">Accountant</SelectItem>
      <SelectItem value="warehouse">Warehouse</SelectItem>
      <SelectItem value="viewer">Viewer</SelectItem>
    </>
  );

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/employees')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              เพิ่มพนักงานใหม่
            </h1>
            <p className="text-xs text-muted-foreground">
              เชิญด้วยลิงก์ สร้างบัญชี หรือเลื่อนตำแหน่งบัญชีเดิม
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 flex-wrap">
          <Button variant={mode === 'invite' ? 'default' : 'outline'} size="sm" onClick={() => setMode('invite')}>
            <Send className="w-4 h-4 mr-1.5" /> ส่งลิงก์เชิญ
          </Button>
          <Button variant={mode === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setMode('new')}>
            <UserPlus className="w-4 h-4 mr-1.5" /> สร้างบัญชีใหม่
          </Button>
          <Button variant={mode === 'existing' ? 'default' : 'outline'} size="sm" onClick={() => setMode('existing')}>
            <UserCheck className="w-4 h-4 mr-1.5" /> เลื่อนตำแหน่ง
          </Button>
        </div>

        {/* ════════════ INVITE LINK MODE ════════════ */}
        {mode === 'invite' && (
          <>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4 pb-4 flex items-start gap-3">
                <LinkIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-medium text-foreground">วิธีที่สะดวกที่สุด</p>
                  <p className="text-muted-foreground">สร้างลิงก์เชิญแล้วส่งให้พนักงาน — เค้าแค่กดลิงก์ ตั้งรหัสผ่าน ก็เข้าระบบได้เลย</p>
                  <p className="text-muted-foreground">ลิงก์มีอายุ 7 วัน และใช้ได้ครั้งเดียว</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Send className="w-4 h-4" /> สร้างลิงก์เชิญ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="invite-email">อีเมลพนักงาน *</Label>
                  <Input id="invite-email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="employee@company.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="invite-name">ชื่อ-นามสกุล (ไม่บังคับ)</Label>
                  <Input id="invite-name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="ชื่อจริง นามสกุล" className="mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">ถ้ากรอกไว้จะ pre-fill ให้ในหน้าลงทะเบียน</p>
                </div>
                <div>
                  <Label>บทบาท *</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{roleOptions}</SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">{ROLE_DESCRIPTIONS[inviteRole as UserRole]}</p>
                </div>

                <Button onClick={handleCreateInvite} disabled={saving} className="w-full">
                  {saving ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> กำลังสร้าง...</> : <><LinkIcon className="w-4 h-4 mr-1.5" /> สร้างลิงก์เชิญ</>}
                </Button>

                {generatedLink && (
                  <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <p className="text-sm font-medium">สร้างลิงก์สำเร็จ!</p>
                    </div>
                    <div className="flex gap-2">
                      <Input value={generatedLink} readOnly className="text-xs font-mono" />
                      <Button variant="outline" size="sm" onClick={handleCopyLink} className="shrink-0">
                        {copied ? <><CheckCircle className="w-4 h-4 mr-1" /> คัดลอกแล้ว</> : <><Copy className="w-4 h-4 mr-1" /> คัดลอก</>}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ส่งลิงก์นี้ให้พนักงานทางอีเมล, LINE หรือช่องทางอื่น
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* ════════════ EXISTING MODE ════════════ */}
        {mode === 'existing' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ค้นหาบัญชีที่มีอยู่</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search-email">อีเมลของบัญชี</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="search-email" type="email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} placeholder="employee@company.com" onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()} />
                  <Button onClick={handleSearchUser} disabled={searching} variant="outline">
                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              {foundUser && (
                <Card className="border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                  <CardContent className="pt-4 pb-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{(foundUser.full_name || foundUser.email)[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{foundUser.full_name || '(ไม่มีชื่อ)'}</p>
                        <p className="text-xs text-muted-foreground">{foundUser.email}</p>
                        <p className="text-xs text-muted-foreground">Role ปัจจุบัน: <strong>{foundUser.role}</strong></p>
                      </div>
                    </div>
                    <div>
                      <Label>เปลี่ยนเป็นบทบาท</Label>
                      <Select value={existingRole} onValueChange={setExistingRole}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>{roleOptions}</SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">{ROLE_DESCRIPTIONS[existingRole as UserRole]}</p>
                    </div>
                    <Button onClick={handlePromoteExisting} disabled={saving} className="w-full">
                      {saving ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> กำลังอัปเดต...</> : <><UserCheck className="w-4 h-4 mr-1.5" /> เลื่อนตำแหน่งเป็น {existingRole}</>}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {/* ════════════ NEW ACCOUNT MODE ════════════ */}
        {mode === 'new' && (
          <>
            <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
              <CardContent className="pt-4 pb-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                  <p>• บัญชีจะใช้งานได้หลังยืนยันอีเมล</p>
                  <p>• หากบัญชีมีอยู่แล้ว ให้ใช้แท็บ "เลื่อนตำแหน่ง" แทน</p>
                  <p>• แนะนำใช้ "ส่งลิงก์เชิญ" เพื่อความสะดวก</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">ข้อมูลบัญชี</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">อีเมล *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="employee@company.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="password">รหัสผ่านชั่วคราว *</Label>
                  <Input id="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="อย่างน้อย 8 ตัวอักษร" className="mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">ต้องส่งให้พนักงานเพื่อเข้าสู่ระบบครั้งแรก</p>
                </div>
                <div>
                  <Label htmlFor="full_name">ชื่อ-นามสกุล *</Label>
                  <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="ชื่อจริง นามสกุล" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">เบอร์โทร</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0812345678" className="mt-1" />
                </div>
                <div>
                  <Label>บทบาท *</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roleOptions}
                      <SelectItem value="member">Member (ลูกค้า)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">{ROLE_DESCRIPTIONS[role as UserRole]}</p>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate('/admin/employees')}>ยกเลิก</Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> กำลังสร้าง...</> : <><Save className="w-4 h-4 mr-1.5" /> สร้างบัญชี</>}
              </Button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

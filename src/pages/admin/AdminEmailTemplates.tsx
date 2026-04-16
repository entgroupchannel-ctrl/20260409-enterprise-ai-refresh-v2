import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Eye, Send, Save, Palette, Type, RotateCcw } from 'lucide-react';

interface EmailTemplate {
  id: string;
  template_type: string;
  subject: string | null;
  heading: string | null;
  body_text: string | null;
  button_text: string | null;
  footer_text: string | null;
  primary_color: string | null;
  logo_url: string | null;
  site_name: string | null;
  font_family: string | null;
  is_active: boolean | null;
  updated_at: string;
}

const TEMPLATE_LABELS: Record<string, { label: string; desc: string }> = {
  signup: { label: 'สมัครสมาชิก', desc: 'อีเมลยืนยันการสมัครสมาชิกใหม่' },
  recovery: { label: 'รีเซ็ตรหัสผ่าน', desc: 'อีเมลสำหรับตั้งรหัสผ่านใหม่' },
  magiclink: { label: 'Magic Link', desc: 'ลิงก์เข้าสู่ระบบแบบไม่ต้องใช้รหัสผ่าน' },
  invite: { label: 'เชิญสมาชิก', desc: 'อีเมลเชิญเข้าร่วมทีม' },
  email_change: { label: 'เปลี่ยนอีเมล', desc: 'ยืนยันการเปลี่ยนแปลงอีเมล' },
  reauthentication: { label: 'ยืนยันตัวตน', desc: 'รหัส OTP สำหรับยืนยันตัวตน' },
};

const DEFAULT_VALUES: Record<string, Partial<EmailTemplate>> = {
  signup: { subject: 'ยืนยันอีเมลของคุณ', heading: 'ยืนยันอีเมลของคุณ', body_text: 'ขอบคุณที่สมัครสมาชิก ENT Group — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร กรุณายืนยันอีเมลของคุณโดยคลิกปุ่มด้านล่าง:', button_text: 'ยืนยันอีเมล', footer_text: 'หากคุณไม่ได้สร้างบัญชีนี้ สามารถเพิกเฉยอีเมลฉบับนี้ได้' },
  recovery: { subject: 'รีเซ็ตรหัสผ่าน', heading: 'รีเซ็ตรหัสผ่าน', body_text: 'เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชี ENT Group ของคุณ คลิกปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่', button_text: 'รีเซ็ตรหัสผ่าน', footer_text: 'หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน สามารถเพิกเฉยอีเมลฉบับนี้ได้' },
  magiclink: { subject: 'ลิงก์เข้าสู่ระบบ', heading: 'ลิงก์เข้าสู่ระบบของคุณ', body_text: 'คลิกปุ่มด้านล่างเพื่อเข้าสู่ระบบ ENT Group ลิงก์นี้จะหมดอายุในไม่ช้า', button_text: 'เข้าสู่ระบบ', footer_text: 'หากคุณไม่ได้ขอลิงก์นี้ สามารถเพิกเฉยอีเมลฉบับนี้ได้' },
  invite: { subject: 'คุณได้รับเชิญเข้าร่วม', heading: 'คุณได้รับเชิญเข้าร่วมทีม', body_text: 'คุณได้รับเชิญเข้าร่วม ENT Group คลิกปุ่มด้านล่างเพื่อยอมรับคำเชิญและสร้างบัญชีของคุณ', button_text: 'ยอมรับคำเชิญ', footer_text: 'หากคุณไม่ได้คาดหวังคำเชิญนี้ สามารถเพิกเฉยอีเมลฉบับนี้ได้' },
  email_change: { subject: 'ยืนยันการเปลี่ยนอีเมล', heading: 'ยืนยันการเปลี่ยนอีเมล', body_text: 'คุณขอเปลี่ยนอีเมลสำหรับ ENT Group คลิกปุ่มด้านล่างเพื่อยืนยันการเปลี่ยนแปลง:', button_text: 'ยืนยันการเปลี่ยนอีเมล', footer_text: 'หากคุณไม่ได้ขอเปลี่ยนอีเมล กรุณาตรวจสอบความปลอดภัยบัญชีของคุณทันที' },
  reauthentication: { subject: 'รหัสยืนยันตัวตน', heading: 'ยืนยันตัวตนของคุณ', body_text: 'ใช้รหัสด้านล่างเพื่อยืนยันตัวตนของคุณ:', button_text: '', footer_text: 'รหัสนี้จะหมดอายุในไม่ช้า หากคุณไม่ได้ขอรหัสนี้ สามารถเพิกเฉยอีเมลฉบับนี้ได้' },
};

export default function AdminEmailTemplates() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  const [editForm, setEditForm] = useState<Partial<EmailTemplate>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    const t = templates.find(t => t.template_type === activeTab);
    if (t) {
      setEditForm({ ...t });
    }
  }, [activeTab, templates]);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_template_settings')
      .select('*')
      .order('template_type');
    if (error) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } else {
      setTemplates((data as any) || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('email_template_settings')
      .update({
        subject: editForm.subject,
        heading: editForm.heading,
        body_text: editForm.body_text,
        button_text: editForm.button_text,
        footer_text: editForm.footer_text,
        primary_color: editForm.primary_color,
        logo_url: editForm.logo_url,
        site_name: editForm.site_name,
        is_active: editForm.is_active,
      } as any)
      .eq('template_type', activeTab);

    if (error) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'บันทึกสำเร็จ', description: `อัปเดตเทมเพลต "${TEMPLATE_LABELS[activeTab]?.label}" เรียบร้อย` });
      fetchTemplates();
    }
    setSaving(false);
  };

  const handleReset = () => {
    const defaults = DEFAULT_VALUES[activeTab];
    if (defaults) {
      setEditForm(prev => ({ ...prev, ...defaults, primary_color: '#0fa888', site_name: 'ENT Group' }));
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) return;
    setSendingTest(true);
    try {
      // For signup/magiclink types, use Supabase Auth OTP to trigger the auth-email-hook
      if (activeTab === 'signup' || activeTab === 'magiclink') {
        const { error } = await supabase.auth.signInWithOtp({
          email: testEmail,
          options: { shouldCreateUser: false },
        });
        if (error && error.message !== 'Signups not allowed for otp') {
          // If user doesn't exist, try resend signup confirmation
          const { error: resendErr } = await supabase.auth.resend({
            type: 'signup',
            email: testEmail,
          });
          if (resendErr) {
            toast({ title: 'ส่งไม่สำเร็จ', description: resendErr.message, variant: 'destructive' });
            setSendingTest(false);
            return;
          }
        }
        toast({ title: 'ส่งสำเร็จ ✓', description: `ส่งอีเมลทดสอบไปยัง ${testEmail} แล้ว กรุณาตรวจสอบกล่องจดหมาย` });
      } else if (activeTab === 'recovery') {
        const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) {
          toast({ title: 'ส่งไม่สำเร็จ', description: error.message, variant: 'destructive' });
          setSendingTest(false);
          return;
        }
        toast({ title: 'ส่งสำเร็จ ✓', description: `ส่งอีเมลรีเซ็ตรหัสผ่านไปยัง ${testEmail} แล้ว` });
      } else {
        toast({ title: 'ไม่รองรับ', description: `ประเภท "${activeTab}" ไม่สามารถส่งทดสอบโดยตรงได้ ใช้ได้เฉพาะ Signup และ Recovery`, variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'ส่งไม่สำเร็จ', description: err?.message || 'เกิดข้อผิดพลาด', variant: 'destructive' });
    }
    setSendingTest(false);
  };

  const fetchPreview = async (type?: string) => {
    setPreviewLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('auth-email-hook/preview', {
        body: { type: type || activeTab },
      });
      if (error) {
        // If invoke returns error, try reading as text
        setPreviewHtml('<p style="padding:20px;color:red;">ไม่สามารถโหลด Preview ได้</p>');
      } else if (typeof data === 'string') {
        setPreviewHtml(data);
      } else {
        setPreviewHtml('<p style="padding:20px;color:red;">ไม่สามารถโหลด Preview ได้</p>');
      }
    } catch {
      setPreviewHtml('<p style="padding:20px;color:red;">ไม่สามารถโหลด Preview ได้</p>');
    }
    setPreviewLoading(false);
  };

  // Fetch preview when tab changes or after save
  useEffect(() => {
    fetchPreview();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl admin-content-area">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              จัดการเทมเพลตอีเมล
            </h1>
            <p className="text-sm text-muted-foreground">ปรับแต่งข้อความ สี และรูปแบบอีเมลอัตโนมัติ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Template List & Editor */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap h-auto gap-1">
                {Object.entries(TEMPLATE_LABELS).map(([key, { label }]) => {
                  const t = templates.find(t => t.template_type === key);
                  return (
                    <TabsTrigger key={key} value={key} className="text-xs relative">
                      {label}
                      {t?.is_active === false && (
                        <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">ปิด</Badge>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.keys(TEMPLATE_LABELS).map(key => (
                <TabsContent key={key} value={key}>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{TEMPLATE_LABELS[key].label}</CardTitle>
                          <CardDescription>{TEMPLATE_LABELS[key].desc}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="active-switch" className="text-xs text-muted-foreground">เปิดใช้งาน</Label>
                          <Switch
                            id="active-switch"
                            checked={editForm.is_active ?? true}
                            onCheckedChange={v => setEditForm(p => ({ ...p, is_active: v }))}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">หัวข้ออีเมล (Subject)</Label>
                          <Input
                            value={editForm.subject || ''}
                            onChange={e => setEditForm(p => ({ ...p, subject: e.target.value }))}
                            placeholder="หัวข้ออีเมล"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">หัวข้อหลัก (Heading)</Label>
                          <Input
                            value={editForm.heading || ''}
                            onChange={e => setEditForm(p => ({ ...p, heading: e.target.value }))}
                            placeholder="หัวข้อหลักในอีเมล"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">เนื้อหาหลัก (Body)</Label>
                        <Textarea
                          value={editForm.body_text || ''}
                          onChange={e => setEditForm(p => ({ ...p, body_text: e.target.value }))}
                          placeholder="เนื้อหาอีเมล"
                          rows={3}
                        />
                      </div>

                      {key !== 'reauthentication' && (
                        <div>
                          <Label className="text-xs">ข้อความปุ่ม (Button)</Label>
                          <Input
                            value={editForm.button_text || ''}
                            onChange={e => setEditForm(p => ({ ...p, button_text: e.target.value }))}
                            placeholder="ข้อความบนปุ่ม"
                          />
                        </div>
                      )}

                      <div>
                        <Label className="text-xs">ข้อความท้าย (Footer)</Label>
                        <Textarea
                          value={editForm.footer_text || ''}
                          onChange={e => setEditForm(p => ({ ...p, footer_text: e.target.value }))}
                          placeholder="ข้อความท้ายอีเมล"
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSave} disabled={saving} className="flex-1">
                          <Save className="w-4 h-4 mr-1" />
                          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                          <RotateCcw className="w-4 h-4 mr-1" /> รีเซ็ต
                        </Button>
                        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Eye className="w-4 h-4 mr-1" /> ดูตัวอย่าง
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>ตัวอย่างอีเมล — {TEMPLATE_LABELS[key].label}</DialogTitle>
                            </DialogHeader>
                            {previewLoading ? (
                              <div className="flex items-center justify-center p-8 text-muted-foreground">กำลังโหลด...</div>
                            ) : (
                              <iframe
                                srcDoc={previewHtml}
                                className="w-full border-0"
                                style={{ minHeight: '500px' }}
                                title="Email Preview"
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Right - Global Settings & Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="w-4 h-4" /> ตั้งค่าแบรนด์
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">ชื่อเว็บไซต์</Label>
                  <Input
                    value={editForm.site_name || ''}
                    onChange={e => setEditForm(p => ({ ...p, site_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-xs">สีหลัก</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editForm.primary_color || '#0fa888'}
                      onChange={e => setEditForm(p => ({ ...p, primary_color: e.target.value }))}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={editForm.primary_color || '#0fa888'}
                      onChange={e => setEditForm(p => ({ ...p, primary_color: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">URL โลโก้</Label>
                  <Input
                    value={editForm.logo_url || ''}
                    onChange={e => setEditForm(p => ({ ...p, logo_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Send className="w-4 h-4" /> ส่งอีเมลทดสอบ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">อีเมลปลายทาง</Label>
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={e => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                </div>
                <Button
                  onClick={handleSendTest}
                  disabled={!testEmail || sendingTest}
                  className="w-full"
                  variant="outline"
                >
                  <Send className="w-4 h-4 mr-1" />
                  {sendingTest ? 'กำลังส่ง...' : 'ส่งทดสอบ'}
                </Button>
                <p className="text-[11px] text-muted-foreground">
                  * การเปลี่ยนแปลงจะมีผลหลังบันทึก และ deploy edge function ใหม่
                </p>
              </CardContent>
            </Card>

            {/* Live Preview Mini */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4" /> ตัวอย่างสด
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden">
                {previewLoading ? (
                  <div className="flex items-center justify-center p-8 text-muted-foreground">กำลังโหลด...</div>
                ) : (
                  <div className="transform scale-[0.5] origin-top-left w-[200%] pointer-events-none">
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full border-0"
                      style={{ minHeight: '800px' }}
                      title="Email Preview Mini"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

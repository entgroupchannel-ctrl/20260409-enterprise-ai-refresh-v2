-- Create email template settings table
CREATE TABLE public.email_template_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_type TEXT NOT NULL UNIQUE,
  subject TEXT,
  heading TEXT,
  body_text TEXT,
  button_text TEXT,
  footer_text TEXT,
  primary_color TEXT DEFAULT '#0fa888',
  logo_url TEXT,
  site_name TEXT DEFAULT 'ENT Group',
  font_family TEXT DEFAULT '''IBM Plex Sans Thai'', Arial, sans-serif',
  is_active BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_template_settings ENABLE ROW LEVEL SECURITY;

-- Only super admins can read
CREATE POLICY "Super admins can view email templates"
ON public.email_template_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Only super admins can update
CREATE POLICY "Super admins can update email templates"
ON public.email_template_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Only super admins can insert
CREATE POLICY "Super admins can insert email templates"
ON public.email_template_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Trigger for updated_at
CREATE TRIGGER update_email_template_settings_updated_at
BEFORE UPDATE ON public.email_template_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default templates
INSERT INTO public.email_template_settings (template_type, subject, heading, body_text, button_text, footer_text) VALUES
('signup', 'ยืนยันอีเมลของคุณ', 'ยืนยันอีเมลของคุณ', 'ขอบคุณที่สมัครสมาชิก ENT Group — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร กรุณายืนยันอีเมลของคุณโดยคลิกปุ่มด้านล่าง:', 'ยืนยันอีเมล', 'หากคุณไม่ได้สร้างบัญชีนี้ สามารถเพิกเฉยอีเมลฉบับนี้ได้'),
('recovery', 'รีเซ็ตรหัสผ่าน', 'รีเซ็ตรหัสผ่าน', 'เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชี ENT Group ของคุณ คลิกปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่', 'รีเซ็ตรหัสผ่าน', 'หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน สามารถเพิกเฉยอีเมลฉบับนี้ได้ รหัสผ่านของคุณจะไม่ถูกเปลี่ยน'),
('magiclink', 'ลิงก์เข้าสู่ระบบ', 'ลิงก์เข้าสู่ระบบของคุณ', 'คลิกปุ่มด้านล่างเพื่อเข้าสู่ระบบ ENT Group ลิงก์นี้จะหมดอายุในไม่ช้า', 'เข้าสู่ระบบ', 'หากคุณไม่ได้ขอลิงก์นี้ สามารถเพิกเฉยอีเมลฉบับนี้ได้'),
('invite', 'คุณได้รับเชิญเข้าร่วม', 'คุณได้รับเชิญเข้าร่วมทีม', 'คุณได้รับเชิญเข้าร่วม ENT Group คลิกปุ่มด้านล่างเพื่อยอมรับคำเชิญและสร้างบัญชีของคุณ', 'ยอมรับคำเชิญ', 'หากคุณไม่ได้คาดหวังคำเชิญนี้ สามารถเพิกเฉยอีเมลฉบับนี้ได้'),
('email_change', 'ยืนยันการเปลี่ยนอีเมล', 'ยืนยันการเปลี่ยนอีเมล', 'คุณขอเปลี่ยนอีเมลสำหรับ ENT Group คลิกปุ่มด้านล่างเพื่อยืนยันการเปลี่ยนแปลง:', 'ยืนยันการเปลี่ยนอีเมล', 'หากคุณไม่ได้ขอเปลี่ยนอีเมล กรุณาตรวจสอบความปลอดภัยบัญชีของคุณทันที'),
('reauthentication', 'รหัสยืนยันตัวตน', 'ยืนยันตัวตนของคุณ', 'ใช้รหัสด้านล่างเพื่อยืนยันตัวตนของคุณ:', '', 'รหัสนี้จะหมดอายุในไม่ช้า หากคุณไม่ได้ขอรหัสนี้ สามารถเพิกเฉยอีเมลฉบับนี้ได้')
ON CONFLICT (template_type) DO NOTHING;
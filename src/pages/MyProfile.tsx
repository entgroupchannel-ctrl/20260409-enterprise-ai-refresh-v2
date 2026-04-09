import { useState, useEffect } from "react";
import { User, Building2, Save, Loader2, CheckCircle, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  full_name: string;
  phone: string;
  line_id: string;
  whatsapp: string;
  company_name: string;
  company_position: string;
  company_address: string;
  tax_id: string;
}

const emptyProfile: ProfileData = {
  full_name: "", phone: "", line_id: "", whatsapp: "",
  company_name: "", company_position: "", company_address: "", tax_id: "",
};

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

const MyProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await (supabase.from as any)("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (data) {
          setProfile({
            full_name: data.full_name || user.user_metadata?.full_name || "",
            phone: data.phone || "",
            line_id: data.line_id || "",
            whatsapp: data.whatsapp || "",
            company_name: data.company_name || "",
            company_position: data.company_position || "",
            company_address: data.company_address || "",
            tax_id: data.tax_id || "",
          });
        } else {
          setProfile({
            ...emptyProfile,
            full_name: user.user_metadata?.full_name || "",
          });
        }
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await (supabase.from as any)("profiles").upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast({ title: "บันทึกโปรไฟล์สำเร็จ", description: "ข้อมูลของคุณถูกอัปเดตแล้ว" });
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword.length < 6) {
      toast({ title: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", variant: "destructive" });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "รหัสผ่านไม่ตรงกัน", variant: "destructive" });
      return;
    }
    setPwLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
      if (error) throw error;
      toast({ title: "เปลี่ยนรหัสผ่านสำเร็จ" });
      setPasswords({ newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setPwLoading(false);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <div className="card-surface rounded-xl p-5">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
          <User size={16} className="text-primary" /> ข้อมูลส่วนตัว
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">ชื่อ-นามสกุล</label>
            <input
              value={profile.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              className={inputClass}
              placeholder="ชื่อ นามสกุล"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">อีเมล</label>
            <input value={user?.email || ""} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">โทรศัพท์</label>
            <input
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={inputClass}
              placeholder="08x-xxx-xxxx"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">LINE ID</label>
            <input
              value={profile.line_id}
              onChange={(e) => handleChange("line_id", e.target.value)}
              className={inputClass}
              placeholder="@line_id"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">WhatsApp</label>
            <input
              value={profile.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              className={inputClass}
              placeholder="+66xxxxxxxxx"
            />
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="card-surface rounded-xl p-5">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
          <Building2 size={16} className="text-primary" /> ข้อมูลบริษัท
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">ชื่อบริษัท</label>
            <input
              value={profile.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
              className={inputClass}
              placeholder="บริษัท xxx จำกัด"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">ตำแหน่ง</label>
            <input
              value={profile.company_position}
              onChange={(e) => handleChange("company_position", e.target.value)}
              className={inputClass}
              placeholder="เช่น ผู้จัดการฝ่ายจัดซื้อ"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-foreground mb-1">ที่อยู่สำหรับออกเอกสาร</label>
            <textarea
              value={profile.company_address}
              onChange={(e) => handleChange("company_address", e.target.value)}
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="ที่อยู่ สำหรับออกใบเสนอราคา / ใบกำกับภาษี"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">เลขประจำตัวผู้เสียภาษี</label>
            <input
              value={profile.tax_id}
              onChange={(e) => handleChange("tax_id", e.target.value)}
              className={inputClass}
              placeholder="0-xxxx-xxxxx-xx-x"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
      </button>

      {/* Change Password */}
      <div className="card-surface rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <KeyRound size={16} className="text-primary" /> เปลี่ยนรหัสผ่าน
          </h2>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-xs text-primary hover:underline"
            >
              เปลี่ยนรหัสผ่าน
            </button>
          )}
        </div>
        {showPasswordForm && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">รหัสผ่านใหม่</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                className={inputClass}
                placeholder="อย่างน้อย 6 ตัวอักษร"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                className={inputClass}
                placeholder="พิมพ์รหัสผ่านอีกครั้ง"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleChangePassword}
                disabled={pwLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {pwLoading ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                ยืนยัน
              </button>
              <button
                onClick={() => { setShowPasswordForm(false); setPasswords({ newPassword: "", confirmPassword: "" }); }}
                className="px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;

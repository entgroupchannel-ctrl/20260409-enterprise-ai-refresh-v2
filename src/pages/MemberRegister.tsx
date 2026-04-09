import { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus, Mail, Lock, Eye, EyeOff, Building2, Phone, MapPin,
  ArrowLeft, Briefcase, Factory, Camera, Sparkles, Loader2, Rocket, ArrowRight,
} from "lucide-react";
import FooterCompact from "@/components/FooterCompact";

const industries = [
  "เลือกอุตสาหกรรม",
  "อุตสาหกรรมการผลิต",
  "สาธารณสุข/การแพทย์",
  "การศึกษา",
  "การเงินและธนาคาร",
  "ภาครัฐ",
  "สื่อและบันเทิง",
  "ก่อสร้างและสถาปัตยกรรม",
  "เทคโนโลยีสารสนเทศ",
  "พลังงาน",
  "วิจัยและพัฒนา",
  "อื่นๆ",
];

const MemberRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cardPreview, setCardPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    position: "",
    phone: "",
    industry: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

  // Save business card to DB (called after successful scan + signup)
  const saveBusinessCard = useCallback(async (userId: string, file: File, info: Record<string, string>) => {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const filePath = `${userId}/${Date.now()}.${ext}`;
      
      const { error: uploadErr } = await supabase.storage
        .from('business-cards')
        .upload(filePath, file, { contentType: file.type });
      
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from('business-cards')
        .getPublicUrl(filePath);

      await supabase.from('business_cards').insert({
        user_id: userId,
        image_url: filePath,
        extracted_data: info,
        name: info.name || null,
        email: info.email || null,
        phone: info.phone || null,
        company: info.company || null,
        position: info.position || null,
        address: info.address || null,
      });
    } catch (err) {
      console.error('Failed to save business card:', err);
    }
  }, []);

  // Business card scan
  const scannedFileRef = useRef<File | null>(null);
  const scannedInfoRef = useRef<Record<string, string>>({});

  const handleCardScan = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setCardPreview(previewUrl);
    scannedFileRef.current = file;

    setScanning(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("scan-business-card", {
        body: { image: base64 },
      });

      if (error) throw error;

      const info = data?.data || {};
      scannedInfoRef.current = info;
      setForm((prev) => ({
        ...prev,
        name: info.name || prev.name,
        email: info.email || prev.email,
        phone: info.phone || prev.phone,
        company: info.company || prev.company,
        position: info.position || prev.position,
        address: info.address || prev.address,
      }));

      toast({ title: "สแกนนามบัตรสำเร็จ!", description: "ข้อมูลถูกเติมให้อัตโนมัติแล้ว" });
    } catch (err: any) {
      toast({ title: "สแกนไม่สำเร็จ", description: err.message || "กรุณาลองใหม่", variant: "destructive" });
    } finally {
      setScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "รหัสผ่านไม่ตรงกัน", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
            company: form.company,
            position: form.position,
            phone: form.phone,
            industry: form.industry,
            address: form.address,
          },
        },
      });

      if (error) throw error;

      // Save business card to DB if scanned
      if (scannedFileRef.current && signUpData?.user?.id) {
        await saveBusinessCard(signUpData.user.id, scannedFileRef.current, scannedInfoRef.current);
      }

      toast({
        title: "สมัครสมาชิกสำเร็จ!",
        description: "กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี",
      });
      navigate("/admin-login");
    } catch (err: any) {
      const msg = err.message || "";
      let title = "สมัครสมาชิกไม่สำเร็จ";
      let description = msg;

      if (msg.includes("rate limit") || msg.includes("email rate") || msg.includes("429")) {
        title = "ส่งอีเมลบ่อยเกินไป";
        description = "ระบบส่งอีเมลยืนยันได้จำกัด กรุณารอ 1-2 นาทีแล้วลองใหม่อีกครั้ง";
      } else if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("User already registered")) {
        title = "อีเมลนี้ถูกใช้แล้ว";
        description = "อีเมลนี้เคยสมัครสมาชิกแล้ว กรุณาเข้าสู่ระบบ หรือใช้อีเมลอื่น";
      } else if (msg.includes("valid email") || msg.includes("invalid")) {
        title = "อีเมลไม่ถูกต้อง";
        description = "กรุณาตรวจสอบรูปแบบอีเมลแล้วลองใหม่";
      } else if (msg.includes("Password") && msg.includes("short")) {
        title = "รหัสผ่านสั้นเกินไป";
        description = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
      }

      toast({ title, description, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin-login` },
    });
    if (error) {
      toast({ title: "สมัครไม่สำเร็จ", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container max-w-lg mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-primary mb-6 hover:underline">
            <ArrowLeft size={12} /> กลับหน้าหลัก
          </Link>

          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <UserPlus size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            สมัครสมาชิก
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            สมัครสมาชิก ENT Group เพื่อรับสิทธิ์ดูราคา บริการพิเศษ และอื่นๆ
          </p>

          {/* Platform Tour Banner */}
          <Link to="/platform" className="inline-block w-full max-w-md mx-auto">
            <div className="rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors p-4 text-left">
              <p className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                <Rocket size={16} className="text-primary" /> 6 ขั้นตอนง่ายๆ จากเลือกสินค้าถึงรับของ
              </p>
              <p className="text-xs text-muted-foreground">
                ระบบออกแบบมาเพื่อลูกค้าองค์กร ลดขั้นตอนยุ่งยาก ทีมขายคอยช่วยเหลือทุกขั้นตอน
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-2">
                ดูขั้นตอนการใช้งาน <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16 px-4">
        <div className="container max-w-lg mx-auto">
          <div className="card-surface rounded-2xl p-6 md:p-8 space-y-6">
            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full py-3 text-sm font-medium rounded-xl border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              สมัครด้วย Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">หรือกรอกแบบฟอร์ม</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Business Card Scan */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCardScan}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={scanning}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 hover:border-primary/50 transition-all disabled:opacity-50"
              >
                {scanning ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    กำลังอ่านนามบัตร...
                  </>
                ) : (
                  <>
                    <Camera size={16} />
                    <Sparkles size={14} />
                    ถ่ายรูป / อัปโหลดนามบัตร — เติมข้อมูลอัตโนมัติ
                  </>
                )}
              </button>

              {/* Card Preview */}
              {cardPreview && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-border bg-muted/30">
                  <img
                    src={cardPreview}
                    alt="นามบัตรที่อัปโหลด"
                    className="w-full h-auto max-h-48 object-contain"
                  />
                  {scanning && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <Loader2 size={18} className="animate-spin" />
                        กำลังวิเคราะห์นามบัตร...
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setCardPreview(null)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Section */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Mail size={14} className="text-primary" /> บัญชี
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      ชื่อ-นามสกุล <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="ชื่อ-นามสกุล"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      อีเมล <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@company.com"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        รหัสผ่าน <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={form.password}
                          onChange={handleChange}
                          placeholder="อย่างน้อย 6 ตัว"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        ยืนยันรหัสผ่าน <span className="text-destructive">*</span>
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="ยืนยันรหัสผ่าน"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Section */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Building2 size={14} className="text-primary" /> ข้อมูลธุรกิจ
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">บริษัท</label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="ชื่อบริษัท / หน่วยงาน"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">ตำแหน่ง</label>
                      <input
                        type="text"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        placeholder="ตำแหน่งงาน"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">เบอร์โทรศัพท์</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="08x-xxx-xxxx"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">อุตสาหกรรม</label>
                      <select
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        {industries.map((ind) => (
                          <option key={ind} value={ind === "เลือกอุตสาหกรรม" ? "" : ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">ที่อยู่</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="ที่อยู่สำหรับจัดส่งเอกสาร / ใบเสนอราคา"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <UserPlus size={16} /> {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-xs text-muted-foreground">
              มีบัญชีอยู่แล้ว?{" "}
              <Link to="/admin-login" className="text-primary hover:underline font-medium">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>
      </section>

      <FooterCompact />
    </div>
  );
};

export default MemberRegister;
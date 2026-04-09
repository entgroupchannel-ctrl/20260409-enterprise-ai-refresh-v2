import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Send, Loader2, Code2, Cloud, Calendar, Wallet, AlertTriangle, FileText } from "lucide-react";

const budgetOptions = [
  { value: "under-50k", label: "ต่ำกว่า 50,000 บาท" },
  { value: "50k-150k", label: "50,000 – 150,000 บาท" },
  { value: "150k-500k", label: "150,000 – 500,000 บาท" },
  { value: "500k-1m", label: "500,000 – 1,000,000 บาท" },
  { value: "above-1m", label: "มากกว่า 1,000,000 บาท" },
  { value: "negotiable", label: "ยังไม่แน่ใจ / เจรจาได้" },
];

const timelineOptions = [
  { value: "urgent", label: "ด่วน (ภายใน 1 เดือน)" },
  { value: "1-3months", label: "1 – 3 เดือน" },
  { value: "3-6months", label: "3 – 6 เดือน" },
  { value: "6months+", label: "มากกว่า 6 เดือน" },
  { value: "flexible", label: "ยืดหยุ่นได้" },
];

interface SoftwareInquiryDialogProps {
  children: React.ReactNode;
}

const SoftwareInquiryDialog = ({ children }: SoftwareInquiryDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    line_id: "",
    service_type: "" as "saas" | "custom" | "",
    budget_range: "",
    timeline: "",
    current_problems: "",
    requirements: "",
    subscribe: true,
  });

  // Auto-fill from user profile when dialog opens
  useEffect(() => {
    if (open && user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.user_metadata?.full_name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.user_metadata?.phone || "",
        company: prev.company || user.user_metadata?.company || "",
      }));
    }
  }, [open, user]);

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.service_type) {
      toast.error("กรุณากรอกชื่อ อีเมล และเลือกประเภทบริการ");
      return;
    }
    setSubmitting(true);

    // Calculate simple lead score
    let score = 0;
    if (form.company) score += 20;
    if (form.phone) score += 15;
    if (form.line_id) score += 10;
    if (form.email) score += 10;
    if (form.budget_range && form.budget_range !== "negotiable") score += 15;
    if (form.timeline && form.timeline !== "flexible") score += 10;
    if (form.current_problems && form.current_problems.length > 30) score += 15;
    if (form.requirements && form.requirements.length > 20) score += 10;

    const { error } = await (supabase.from as any)("software_inquiries").insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      line_id: form.line_id,
      service_type: form.service_type,
      budget_range: form.budget_range,
      timeline: form.timeline,
      current_problems: form.current_problems,
      requirements: form.requirements,
      user_id: user?.id || null,
      lead_score: score,
    });

    // Subscribe to newsletter if opted in
    if (!error && form.subscribe && form.email) {
      await (supabase.from as any)("subscribers").insert({
        email: form.email,
        name: form.name || null,
        source: "software_inquiry",
      }).then(() => {});
    }

    setSubmitting(false);

    if (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      console.error(error);
    } else {
      toast.success("ส่งข้อมูลเรียบร้อย! ทีมงานจะติดต่อกลับโดยเร็ว");
      setOpen(false);
      setForm({
        name: "", email: "", phone: "", company: "", line_id: "",
        service_type: "", budget_range: "", timeline: "",
        current_problems: "", requirements: "", subscribe: true,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
            <Code2 size={20} className="text-primary" />
            สอบถามบริการซอฟต์แวร์
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            บอกเราเกี่ยวกับโปรเจกต์ของคุณ เพื่อให้เราเสนอโซลูชันที่เหมาะสมที่สุด
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Service Type */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              ประเภทบริการที่สนใจ <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField("service_type", "saas")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                  form.service_type === "saas"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/30 text-muted-foreground"
                }`}
              >
                <Cloud size={24} />
                <span className="text-sm font-semibold">SaaS</span>
                <span className="text-[11px] leading-tight">ใช้บริการรายเดือน/ปี<br />ไม่ต้องดูแลเซิร์ฟเวอร์</span>
              </button>
              <button
                type="button"
                onClick={() => updateField("service_type", "custom")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                  form.service_type === "custom"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/30 text-muted-foreground"
                }`}
              >
                <Code2 size={24} />
                <span className="text-sm font-semibold">พัฒนาเฉพาะ</span>
                <span className="text-[11px] leading-tight">ออกแบบ+พัฒนาให้<br />เป็นเจ้าของระบบเอง</span>
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                ชื่อ-นามสกุล <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                placeholder="ชื่อของคุณ"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                อีเมล <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                placeholder="email@company.com"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">เบอร์โทร</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                placeholder="08x-xxx-xxxx"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">บริษัท / องค์กร</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                placeholder="ชื่อบริษัท"
              />
            </div>
          </div>

          {/* LINE ID */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">LINE ID</label>
            <input
              type="text"
              value={form.line_id}
              onChange={(e) => updateField("line_id", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none"
              placeholder="@line_id"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-1">
              <Wallet size={12} /> งบประมาณ
            </label>
            <div className="flex flex-wrap gap-2">
              {budgetOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("budget_range", opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    form.budget_range === opt.value
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block flex items-center gap-1">
              <Calendar size={12} /> ระยะเวลาที่ต้องการ
            </label>
            <div className="flex flex-wrap gap-2">
              {timelineOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("timeline", opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    form.timeline === opt.value
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Current Problems */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
              <AlertTriangle size={12} /> ปัญหาที่พบในปัจจุบัน
            </label>
            <textarea
              value={form.current_problems}
              onChange={(e) => updateField("current_problems", e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none resize-none"
              placeholder="เช่น ใช้ Excel จัดการข้อมูลลูกค้า ไม่มีระบบติดตามงาน ข้อมูลกระจัดกระจาย..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
              <FileText size={12} /> ความต้องการเพิ่มเติม
            </label>
            <textarea
              value={form.requirements}
              onChange={(e) => updateField("requirements", e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none resize-none"
              placeholder="เช่น อยากได้ระบบจัดการสต็อก + ขายหน้าร้าน + รายงานยอดขาย"
            />
          </div>

          {/* Subscribe checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.subscribe}
              onChange={(e) => setForm((prev) => ({ ...prev, subscribe: e.target.checked }))}
              className="rounded border-border text-primary focus:ring-primary/30 w-4 h-4"
            />
            <span className="text-xs text-muted-foreground">สมัครรับข่าวสาร โปรโมชั่น และอัปเดตจาก ENT Group</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> กำลังส่ง...</>
            ) : (
              <><Send size={16} /> ส่งข้อมูลสอบถาม</>
            )}
          </button>

          <p className="text-[11px] text-muted-foreground text-center">
            ข้อมูลของคุณจะถูกเก็บเป็นความลับ ทีมงานจะติดต่อกลับภายใน 24 ชม.
          </p>

          {!user && (
            <div className="text-center rounded-lg bg-muted/50 border border-border p-3">
              <p className="text-xs text-muted-foreground mb-1">
                <Link to="/member-register" onClick={() => setOpen(false)} className="text-primary font-semibold hover:underline">สมัครสมาชิก</Link>
                {" "}หรือ{" "}
                <Link to="/admin-login" onClick={() => setOpen(false)} className="text-primary font-semibold hover:underline">เข้าสู่ระบบ</Link>
              </p>
              <p className="text-[11px] text-muted-foreground">เพื่อประสานงานกับแอดมินและติดตามสถานะงานของคุณได้</p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SoftwareInquiryDialog;

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Code2 } from "lucide-react";

const budgetOptions = [
  { value: "", label: "— เลือก —" },
  { value: "under-50k", label: "ต่ำกว่า 50,000 บาท" },
  { value: "50k-150k", label: "50,000 – 150,000 บาท" },
  { value: "150k-500k", label: "150,000 – 500,000 บาท" },
  { value: "500k-1m", label: "500,000 – 1,000,000 บาท" },
  { value: "above-1m", label: "มากกว่า 1,000,000 บาท" },
  { value: "negotiable", label: "ยังไม่แน่ใจ / เจรจาได้" },
];

const timelineOptions = [
  { value: "", label: "— เลือก —" },
  { value: "urgent", label: "ด่วน (ภายใน 1 เดือน)" },
  { value: "1-3months", label: "1 – 3 เดือน" },
  { value: "3-6months", label: "3 – 6 เดือน" },
  { value: "6months+", label: "มากกว่า 6 เดือน" },
  { value: "flexible", label: "ยืดหยุ่นได้" },
];

const sourceOptions = [
  { value: "", label: "— เลือก —" },
  { value: "phone", label: "โทรศัพท์" },
  { value: "walk_in", label: "Walk-in" },
  { value: "line", label: "Line" },
  { value: "email", label: "Email" },
  { value: "exhibition", label: "งานแสดงสินค้า" },
  { value: "referral", label: "แนะนำจากลูกค้า" },
  { value: "website", label: "เว็บไซต์" },
  { value: "other", label: "อื่นๆ" },
];

const priorityOptions = [
  { value: "low", label: "ต่ำ" },
  { value: "medium", label: "ปกติ" },
  { value: "high", label: "สูง" },
  { value: "urgent", label: "เร่งด่วน" },
];

interface AddSoftwareInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const inputClass = "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none";
const labelClass = "text-xs font-medium text-muted-foreground mb-1 block";

const AddSoftwareInquiryDialog = ({ open, onOpenChange, onSuccess }: AddSoftwareInquiryDialogProps) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    line_id: "",
    service_type: "",
    budget_range: "",
    timeline: "",
    current_problems: "",
    requirements: "",
    source: "",
    priority: "medium",
    notes: "",
  });

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () =>
    setForm({
      name: "", email: "", phone: "", company: "", line_id: "",
      service_type: "", budget_range: "", timeline: "",
      current_problems: "", requirements: "", source: "", priority: "medium", notes: "",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.service_type) {
      toast.error("กรุณากรอกชื่อ อีเมล และเลือกประเภทบริการ");
      return;
    }
    setSubmitting(true);

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
      phone: form.phone || null,
      company: form.company || null,
      line_id: form.line_id || null,
      service_type: form.service_type,
      budget_range: form.budget_range || null,
      timeline: form.timeline || null,
      current_problems: form.current_problems || null,
      requirements: form.requirements || null,
      source: form.source || null,
      priority: form.priority,
      notes: form.notes || null,
      status: "new",
      created_by: user?.id || null,
      lead_score: score,
    });

    setSubmitting(false);

    if (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      console.error(error);
    } else {
      toast.success("เพิ่มข้อมูลสอบถามซอฟต์แวร์เรียบร้อย");
      resetForm();
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Code2 size={20} className="text-primary" />
            เพิ่มสอบถามซอฟต์แวร์
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Service Type */}
          <div>
            <label className={labelClass}>
              ประเภทบริการ <span className="text-destructive">*</span>
            </label>
            <select value={form.service_type} onChange={(e) => updateField("service_type", e.target.value)} className={inputClass} required>
              <option value="">— เลือกประเภทบริการ —</option>
              <option value="saas">SaaS / ระบบสำเร็จรูป</option>
              <option value="custom">พัฒนาซอฟต์แวร์เฉพาะ</option>
            </select>
          </div>

          {/* Contact Info - 2 columns */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>ชื่อ-นามสกุล <span className="text-destructive">*</span></label>
              <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} className={inputClass} placeholder="ชื่อลูกค้า" required />
            </div>
            <div>
              <label className={labelClass}>อีเมล <span className="text-destructive">*</span></label>
              <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} placeholder="email@company.com" required />
            </div>
            <div>
              <label className={labelClass}>เบอร์โทร</label>
              <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} placeholder="08x-xxx-xxxx" />
            </div>
            <div>
              <label className={labelClass}>บริษัท / องค์กร</label>
              <input type="text" value={form.company} onChange={(e) => updateField("company", e.target.value)} className={inputClass} placeholder="ชื่อบริษัท" />
            </div>
            <div>
              <label className={labelClass}>LINE ID</label>
              <input type="text" value={form.line_id} onChange={(e) => updateField("line_id", e.target.value)} className={inputClass} placeholder="@line_id" />
            </div>
            <div>
              <label className={labelClass}>แหล่งที่มา</label>
              <select value={form.source} onChange={(e) => updateField("source", e.target.value)} className={inputClass}>
                {sourceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Budget & Timeline - 2 columns */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>งบประมาณ</label>
              <select value={form.budget_range} onChange={(e) => updateField("budget_range", e.target.value)} className={inputClass}>
                {budgetOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>ระยะเวลาที่ต้องการ</label>
              <select value={form.timeline} onChange={(e) => updateField("timeline", e.target.value)} className={inputClass}>
                {timelineOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>ความเร่งด่วน</label>
              <select value={form.priority} onChange={(e) => updateField("priority", e.target.value)} className={inputClass}>
                {priorityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Textareas - full width */}
          <div>
            <label className={labelClass}>ปัญหา / ความต้องการปัจจุบัน</label>
            <textarea value={form.current_problems} onChange={(e) => updateField("current_problems", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="เช่น ใช้ Excel จัดการข้อมูลลูกค้า ไม่มีระบบติดตามงาน..." />
          </div>
          <div>
            <label className={labelClass}>รายละเอียดเพิ่มเติม</label>
            <textarea value={form.requirements} onChange={(e) => updateField("requirements", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="เช่น อยากได้ระบบจัดการสต็อก + ขายหน้าร้าน + รายงานยอดขาย" />
          </div>
          <div>
            <label className={labelClass}>บันทึกภายใน (Admin)</label>
            <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="บันทึกสำหรับทีมงาน..." />
          </div>

          {/* Footer */}
          <DialogFooter className="gap-2 pt-2">
            <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
              ยกเลิก
            </button>
            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> กำลังบันทึก...</> : "บันทึก"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSoftwareInquiryDialog;

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ChevronUp, X } from "lucide-react";

interface AddContactFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const AddContactForm = ({ onSuccess, onClose }: AddContactFormProps) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", message: "", phone: "", company: "",
    line_id: "", whatsapp: "", callback_time: "", category: "",
    source: "", priority: "normal", notes: "",
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const reset = () =>
    setForm({ name: "", email: "", message: "", phone: "", company: "",
      line_id: "", whatsapp: "", callback_time: "", category: "",
      source: "", priority: "normal", notes: "" });

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("กรุณากรอกชื่อ, อีเมล และข้อความ");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      phone: form.phone.trim() || null,
      company: form.company.trim() || null,
      line_id: form.line_id.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      callback_time: form.callback_time.trim() || null,
      category: form.category || null,
      source: form.source || null,
      priority: form.priority || "normal",
      notes: form.notes.trim() || null,
      status: "new",
      created_by: user?.id || null,
    });
    setSaving(false);
    if (error) {
      toast.error("บันทึกไม่สำเร็จ: " + error.message);
      return;
    }
    toast.success("เพิ่มข้อมูลติดต่อเรียบร้อย");
    reset();
    onSuccess();
    onClose();
  };

  return (
    <div className="card-surface rounded-xl p-5 mb-4 border border-border animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">เพิ่มข้อมูลติดต่อใหม่</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">ชื่อ-นามสกุล <span className="text-destructive">*</span></Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="ชื่อ นามสกุล" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">อีเมล <span className="text-destructive">*</span></Label>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@example.com" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">โทรศัพท์</Label>
          <Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0xx-xxx-xxxx" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">บริษัท</Label>
          <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="ชื่อบริษัท" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">LINE ID</Label>
          <Input value={form.line_id} onChange={(e) => set("line_id", e.target.value)} placeholder="@lineid" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">WhatsApp</Label>
          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+66xxxxxxxxx" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">เวลาที่สะดวกติดต่อกลับ</Label>
          <Input value={form.callback_time} onChange={(e) => set("callback_time", e.target.value)} placeholder="เช่น จ-ศ 9:00-17:00" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">หมวดหมู่</Label>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="เลือกหมวดหมู่" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="สอบถามสินค้า">สอบถามสินค้า</SelectItem>
              <SelectItem value="ขอใบเสนอราคา">ขอใบเสนอราคา</SelectItem>
              <SelectItem value="บริการหลังการขาย">บริการหลังการขาย</SelectItem>
              <SelectItem value="ร่วมงาน/ตัวแทนจำหน่าย">ร่วมงาน/ตัวแทนจำหน่าย</SelectItem>
              <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">แหล่งที่มา</Label>
          <Select value={form.source} onValueChange={(v) => set("source", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="เลือกแหล่งที่มา" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">โทรศัพท์</SelectItem>
              <SelectItem value="walkin">Walk-in</SelectItem>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="web_form">เว็บฟอร์ม</SelectItem>
              <SelectItem value="other">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">ความเร่งด่วน</Label>
          <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">ต่ำ</SelectItem>
              <SelectItem value="normal">ปกติ</SelectItem>
              <SelectItem value="high">สูง</SelectItem>
              <SelectItem value="urgent">เร่งด่วน</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">ข้อความ/รายละเอียด <span className="text-destructive">*</span></Label>
          <Textarea value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="รายละเอียดการติดต่อ" rows={2} className="text-sm" />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">บันทึกภายใน (Admin)</Label>
          <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="โน้ตสำหรับทีมงาน" rows={2} className="text-sm" />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-accent transition-colors">
          ยกเลิก
        </button>
        <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>
    </div>
  );
};

export default AddContactForm;

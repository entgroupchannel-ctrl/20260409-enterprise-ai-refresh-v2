import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, Mail } from "lucide-react";

interface PartnerInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RECIPIENT = "mkt@entgroup.co.th";

export default function PartnerInquiryDialog({ open, onOpenChange }: PartnerInquiryDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", category: "", message: "",
  });

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.company.trim()) {
      toast({ title: "กรุณากรอกข้อมูลให้ครบ", description: "ชื่อ / อีเมล / บริษัท", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Save to contact_submissions (รับเข้าระบบ)
      const message = `[PARTNER INQUIRY]\nบริษัท/โรงงาน: ${form.company}\nหมวดสินค้า: ${form.category || "-"}\nโทร: ${form.phone || "-"}\n\nรายละเอียด:\n${form.message || "(ไม่ระบุ)"}`;

      const { error: insertError } = await (supabase.from as any)("contact_submissions").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        company: form.company,
        message,
        source: "partner_inquiry",
        priority: "high",
      });
      if (insertError) throw insertError;

      // 2. Notify admins + ส่งอีเมลไปยัง mkt@entgroup.co.th
      import("@/lib/notifications").then(({ notifyAdmins, sendAutoReplyEmail }) => {
        notifyAdmins({
          type: "new_contact",
          title: "🤝 ใบสมัครพันธมิตรใหม่",
          message: `${form.name} จาก ${form.company} (${form.email})`,
          priority: "high",
          actionUrl: "/admin/contacts",
          actionLabel: "ดูรายละเอียด",
        });
        // ส่งอีเมลแจ้ง mkt@entgroup.co.th
        sendAutoReplyEmail({
          type: "contact",
          recipientEmail: RECIPIENT,
          recipientName: "ทีมการตลาด",
        });
        // ส่งอีเมลตอบกลับลูกค้า
        sendAutoReplyEmail({
          type: "contact",
          recipientEmail: form.email,
          recipientName: form.name,
        });
      });

      toast({
        title: "✅ ส่งใบสมัครเรียบร้อย",
        description: "ทีมงานจะติดต่อกลับภายใน 7 วันทำการ",
      });
      setForm({ name: "", email: "", phone: "", company: "", category: "", message: "" });
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            สมัครเป็นพันธมิตร ENT Group
          </DialogTitle>
          <DialogDescription>
            กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับภายใน 7 วันทำการ — ส่งตรงถึงทีมการตลาด ({RECIPIENT})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>ชื่อ-นามสกุล <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="สมชาย ใจดี" />
            </div>
            <div className="space-y-1.5">
              <Label>อีเมล <span className="text-destructive">*</span></Label>
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@company.com" />
            </div>
            <div className="space-y-1.5">
              <Label>เบอร์โทร</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="08x-xxx-xxxx" />
            </div>
            <div className="space-y-1.5">
              <Label>บริษัท / โรงงาน <span className="text-destructive">*</span></Label>
              <Input value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="บริษัท ABC จำกัด" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>หมวดสินค้า / บริการที่นำเสนอ</Label>
              <Input
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="เช่น Industrial PC, Sensor, Power Supply, Cable..."
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>รายละเอียดเพิ่มเติม</Label>
              <Textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={4}
                placeholder="แนะนำบริษัท ผลิตภัณฑ์ จุดเด่น กำลังการผลิต ใบรับรอง ฯลฯ"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              ส่งใบสมัคร
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

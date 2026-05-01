import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ClipboardCheck, Loader2, Send, CheckCircle2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAttributionFields, createAffiliateLead } from "@/lib/affiliate-attribution";

interface Props {
  triggerLabel?: string;
  triggerVariant?: "default" | "outline" | "secondary";
  triggerSize?: "sm" | "default" | "lg";
  triggerClassName?: string;
}

const PROJECT_TYPES = [
  "โรงงาน / Factory Automation",
  "อาคาร / สำนักงาน",
  "คอนโด / FTTB",
  "CCTV / Surveillance",
  "Outdoor / Smart City",
  "Marine / ทางทะเล",
  "Substation / Energy",
  "อื่นๆ",
];

const TIMELINE_OPTIONS = [
  "ภายใน 1 เดือน",
  "1-3 เดือน",
  "3-6 เดือน",
  "ยังไม่กำหนด",
];

const BUDGET_OPTIONS = [
  "< 100,000 บาท",
  "100,000 - 500,000 บาท",
  "500,000 - 1,000,000 บาท",
  "> 1,000,000 บาท",
  "ยังไม่กำหนด",
];

const SiteSurveyDialog = ({
  triggerLabel = "ลงทะเบียนให้ทีมเข้าสำรวจโครงการ",
  triggerVariant = "default",
  triggerSize = "default",
  triggerClassName,
}: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectName: "",
    projectAddress: "",
    projectType: "",
    deviceCount: "",
    timeline: "",
    budget: "",
    requirements: "",
    preferredDate: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.projectType) {
      toast({ title: "กรุณากรอกข้อมูลที่จำเป็น", description: "ชื่อ, อีเมล, เบอร์โทร และประเภทโครงการ", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const message = [
        `📋 ลงทะเบียนขอให้ทีมเข้าสำรวจโครงการ (Volktek)`,
        ``,
        `▸ ชื่อโครงการ: ${form.projectName || "-"}`,
        `▸ สถานที่: ${form.projectAddress || "-"}`,
        `▸ ประเภทโครงการ: ${form.projectType}`,
        `▸ จำนวนอุปกรณ์โดยประมาณ: ${form.deviceCount || "-"}`,
        `▸ ระยะเวลาที่ต้องการเริ่ม: ${form.timeline || "-"}`,
        `▸ งบประมาณโดยประมาณ: ${form.budget || "-"}`,
        `▸ วันที่สะดวกให้เข้าสำรวจ: ${form.preferredDate || "-"}`,
        ``,
        `📝 ความต้องการเพิ่มเติม:`,
        form.requirements || "-",
      ].join("\n");

      const { error } = await (supabase.from as any)("contact_submissions").insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company || null,
        message,
        source: "volktek_site_survey",
        priority: "high",
        ...getAttributionFields(),
      });
      if (error) throw error;

      // Note: ไม่ใช้ .select() เพราะ RLS อนุญาต INSERT แบบ anonymous
      // แต่ SELECT จำกัดเฉพาะ admin/sales — การเรียก RETURNING จะทำให้ fail
      // affiliate lead จะไม่ link source_id แต่ข้อมูลลูกค้าครบถ้วนยังบันทึกไว้
      try {
        await createAffiliateLead({
          source_type: "contact_submission",
          source_id: null as any,
          customer_name: form.name,
          customer_email: form.email,
          customer_company: form.company || null,
        });
      } catch {
        // affiliate tracking is best-effort
      }

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      import("@/lib/notifications").then(({ dispatchNotification, sendAutoReplyEmail }) => {
        dispatchNotification({
          eventKey: "contact.submitted",
          recipientRole: "admin",
          title: "🔍 มีคำขอเข้าสำรวจโครงการใหม่ (Volktek)",
          message: `${form.name} (${form.company || "-"}) — ${form.projectType} · ${form.projectName || "ไม่ระบุชื่อโครงการ"}`,
          priority: "high",
          actionUrl: "/admin/contacts",
          actionLabel: "ดูรายละเอียด",
          linkType: "contact",
          entityType: "contact",
          customerName: form.name,
          viewUrl: `${origin}/admin/contacts`,
        });
        sendAutoReplyEmail({
          type: "contact",
          recipientEmail: form.email,
          recipientName: form.name,
        });
      });

      setSubmitted(true);
      toast({ title: "ส่งคำขอเรียบร้อย!", description: "ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง" });
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setForm({
      name: "", company: "", email: "", phone: "",
      projectName: "", projectAddress: "", projectType: "",
      deviceCount: "", timeline: "", budget: "",
      requirements: "", preferredDate: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTimeout(reset, 300); }}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize} className={triggerClassName}>
          <ClipboardCheck className="w-4 h-4 mr-1.5" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            <DialogTitle className="text-xl">ส่งคำขอเรียบร้อย!</DialogTitle>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              ขอบคุณที่ให้ความสนใจ — ทีมวิศวกรของ ENT Group จะติดต่อกลับภายใน 24 ชั่วโมง
              เพื่อนัดหมายเข้าสำรวจหน้างานและจัดทำ Solution ที่เหมาะสมที่สุดสำหรับโครงการของคุณ
            </p>
            <Button onClick={() => setOpen(false)}>ปิดหน้าต่าง</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <MapPin className="w-5 h-5 text-primary" />
                ลงทะเบียนให้ทีมเข้าสำรวจโครงการ
              </DialogTitle>
              <DialogDescription>
                กรอกข้อมูลด้านล่าง ทีมวิศวกรของเราจะติดต่อกลับเพื่อนัดเข้าสำรวจหน้างานและออกแบบ Solution ฟรี
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {/* Contact info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ss-name">ชื่อ-นามสกุล <span className="text-destructive">*</span></Label>
                  <Input id="ss-name" value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="ชื่อ-นามสกุล" />
                </div>
                <div>
                  <Label htmlFor="ss-company">บริษัท / หน่วยงาน</Label>
                  <Input id="ss-company" value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="ชื่อบริษัท" />
                </div>
                <div>
                  <Label htmlFor="ss-email">อีเมล <span className="text-destructive">*</span></Label>
                  <Input id="ss-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="email@company.com" />
                </div>
                <div>
                  <Label htmlFor="ss-phone">เบอร์โทรศัพท์ <span className="text-destructive">*</span></Label>
                  <Input id="ss-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} required placeholder="08x-xxx-xxxx" />
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <h4 className="text-sm font-bold text-primary">📋 ข้อมูลโครงการ</h4>

                {/* Q1: Project name + address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="ss-pname">1. ชื่อโครงการ</Label>
                    <Input id="ss-pname" value={form.projectName} onChange={(e) => update("projectName", e.target.value)} placeholder="เช่น โรงงาน A, คอนโด B" />
                  </div>
                  <div>
                    <Label htmlFor="ss-paddr">2. สถานที่ตั้งโครงการ</Label>
                    <Input id="ss-paddr" value={form.projectAddress} onChange={(e) => update("projectAddress", e.target.value)} placeholder="จังหวัด / เขต / อำเภอ" />
                  </div>
                </div>

                {/* Q3: Project type */}
                <div>
                  <Label>3. ประเภทโครงการ <span className="text-destructive">*</span></Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1.5">
                    {PROJECT_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update("projectType", t)}
                        className={`text-xs px-2 py-2 rounded-lg border transition-all text-left ${
                          form.projectType === t
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border bg-background hover:border-primary/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q4: Scale */}
                <div>
                  <Label htmlFor="ss-count">4. จำนวนอุปกรณ์โดยประมาณ (Switch / Camera / AP)</Label>
                  <Input id="ss-count" value={form.deviceCount} onChange={(e) => update("deviceCount", e.target.value)} placeholder="เช่น Switch 10 ตัว, IP Camera 50 ตัว" />
                </div>

                {/* Q5: Timeline */}
                <div>
                  <Label>5. ระยะเวลาที่ต้องการเริ่มโครงการ</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1.5">
                    {TIMELINE_OPTIONS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update("timeline", t)}
                        className={`text-xs px-2 py-2 rounded-lg border transition-all ${
                          form.timeline === t
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border bg-background hover:border-primary/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q6: Budget */}
                <div>
                  <Label>6. งบประมาณโดยประมาณ</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1.5">
                    {BUDGET_OPTIONS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => update("budget", b)}
                        className={`text-xs px-2 py-2 rounded-lg border transition-all ${
                          form.budget === b
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border bg-background hover:border-primary/40"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred date + extra requirements */}
                <div>
                  <Label htmlFor="ss-date">วันที่สะดวกให้ทีมเข้าสำรวจ (ถ้ามี)</Label>
                  <Input id="ss-date" type="date" value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="ss-req">ความต้องการเพิ่มเติม / รายละเอียดงาน</Label>
                  <Textarea
                    id="ss-req"
                    value={form.requirements}
                    onChange={(e) => update("requirements", e.target.value)}
                    placeholder="เช่น ต้องการ PoE++, อุณหภูมิหน้างาน, ระยะ Fiber, มาตรฐานพิเศษ ฯลฯ"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="sm:flex-1">
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={loading} className="sm:flex-1">
                  {loading ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> กำลังส่ง...</> : <><Send className="w-4 h-4 mr-1.5" /> ส่งคำขอสำรวจโครงการ</>}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SiteSurveyDialog;

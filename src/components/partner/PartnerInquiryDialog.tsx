import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, Mail, ScanLine, Camera, X } from "lucide-react";

interface PartnerInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RECIPIENT = "mkt@entgroup.co.th";

export default function PartnerInquiryDialog({ open, onOpenChange }: PartnerInquiryDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cardPreview, setCardPreview] = useState<string | null>(null);
  const [extractedCardData, setExtractedCardData] = useState<Record<string, string> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", category: "", message: "",
  });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setCardPreview(base64);
      setScanning(true);
      try {
        const { data, error } = await supabase.functions.invoke("scan-business-card", { body: { image: base64 } });
        if (error) throw error;
        const extracted = (data as any)?.data || {};
        setExtractedCardData(extracted);
        setForm((prev) => ({
          ...prev,
          name: extracted.name || prev.name,
          email: extracted.email || prev.email,
          phone: extracted.phone || prev.phone,
          company: extracted.company || prev.company,
        }));
        toast({ title: "✅ สแกนนามบัตรสำเร็จ", description: "ระบบกรอกข้อมูลให้แล้ว — ตรวจสอบความถูกต้องก่อนส่ง" });
      } catch (err: any) {
        toast({ title: "สแกนไม่สำเร็จ", description: err.message || "กรุณากรอกข้อมูลด้วยตนเอง", variant: "destructive" });
      } finally {
        setScanning(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const removeCard = () => {
    setCardPreview(null);
    setExtractedCardData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.company.trim()) {
      toast({ title: "กรุณากรอกข้อมูลให้ครบ", description: "ชื่อ / อีเมล / บริษัท", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const message = `[PARTNER INQUIRY]\nบริษัท/โรงงาน: ${form.company}\nหมวดสินค้า: ${form.category || "-"}\nโทร: ${form.phone || "-"}\n\nรายละเอียด:\n${form.message || "(ไม่ระบุ)"}${extractedCardData ? `\n\n--- ข้อมูลจากนามบัตร ---\n${JSON.stringify(extractedCardData, null, 2)}` : ""}`;

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

      import("@/lib/notifications").then(({ notifyAdmins, sendAutoReplyEmail }) => {
        notifyAdmins({
          type: "new_contact",
          title: "🤝 ใบสมัครพันธมิตรใหม่",
          message: `${form.name} จาก ${form.company} (${form.email})`,
          priority: "high",
          actionUrl: "/admin/contacts",
          actionLabel: "ดูรายละเอียด",
        });
        sendAutoReplyEmail({ type: "contact", recipientEmail: RECIPIENT, recipientName: "ทีมการตลาด" });
        sendAutoReplyEmail({ type: "contact", recipientEmail: form.email, recipientName: form.name });
      });

      toast({ title: "✅ ส่งใบสมัครเรียบร้อย", description: "ทีมงานจะติดต่อกลับภายใน 7 วันทำการ" });
      setForm({ name: "", email: "", phone: "", company: "", category: "", message: "" });
      removeCard();
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
          {/* Business Card Scanner */}
          <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleCardUpload}
            />
            {!cardPreview ? (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                  <ScanLine className="w-4 h-4" />
                  📇 สแกนนามบัตร — กรอกฟอร์มอัตโนมัติ
                </div>
                <p className="text-xs text-muted-foreground">
                  ถ่ายรูปหรืออัปโหลดนามบัตร ระบบ AI จะดึงข้อมูลให้ทันที
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={scanning}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  เลือกรูปนามบัตร
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img src={cardPreview} alt="นามบัตร" className="w-full h-auto max-h-40 object-contain bg-white" />
                  {scanning && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        กำลังอ่านนามบัตร...
                      </div>
                    </div>
                  )}
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={removeCard} disabled={scanning}>
                  <X className="w-3.5 h-3.5 mr-1" />
                  ลบ / อัปโหลดใหม่
                </Button>
              </div>
            )}
          </div>

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
            <Button type="submit" disabled={loading || scanning}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              ส่งใบสมัคร
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

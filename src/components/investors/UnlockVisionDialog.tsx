import { useState } from "react";
import { z } from "zod";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  full_name: z.string().trim().min(2, "กรุณากรอกชื่อ-สกุล").max(100),
  position: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง").max(255),
  phone: z.string().trim().min(6, "กรุณากรอกเบอร์โทร").max(30),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUnlocked: () => void;
}

export default function UnlockVisionDialog({ open, onOpenChange, onUnlocked }: Props) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", position: "", email: "", phone: "" });

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "กรุณาตรวจสอบข้อมูล", description: parsed.error.errors[0]?.message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("investor_inquiries").insert({
        full_name: parsed.data.full_name,
        position: parsed.data.position || null,
        email: parsed.data.email,
        phone: parsed.data.phone,
        source: "investors_unlock_dialog",
      });
      if (error) throw error;
      try { localStorage.setItem("investor_unlocked_at", new Date().toISOString()); } catch {}
      toast({
        title: "ปลดล็อกเรียบร้อย ✓",
        description: "เราได้ส่งลิงก์ฉบับเต็มไปยังอีเมลของท่านแล้ว และเปิดให้ดูได้ทันทีในหน้านี้",
      });
      onUnlocked();
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err?.message ?? "กรุณาลองใหม่", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: "rgba(201, 169, 97, 0.12)" }}>
            <Lock size={20} style={{ color: "#C9A961" }} />
          </div>
          <DialogTitle className="text-xl font-display">ขอข้อมูลติดต่อสั้นๆ ก่อนเปิดดู</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            ENT Group เปิดเผยข้อมูลเชิงลึกแบบทยอยส่ง — กรอกข้อมูลด้านล่างเพื่อปลดล็อก
            <strong> Strategic Vision</strong> ทันที และเราจะส่งลิงก์ฉบับเต็มไปยังอีเมลของท่าน
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <Label htmlFor="u_name" className="text-xs font-semibold mb-1.5 block">
              ชื่อ-สกุล <span className="text-destructive">*</span>
            </Label>
            <Input id="u_name" required value={form.full_name} onChange={e => update("full_name", e.target.value)} placeholder="คุณสมชาย ใจดี" />
          </div>
          <div>
            <Label htmlFor="u_pos" className="text-xs font-semibold mb-1.5 block">ตำแหน่ง / บทบาท</Label>
            <Input id="u_pos" value={form.position} onChange={e => update("position", e.target.value)} placeholder="Managing Partner / CIO" />
          </div>
          <div>
            <Label htmlFor="u_email" className="text-xs font-semibold mb-1.5 block">
              อีเมล <span className="text-destructive">*</span>
            </Label>
            <Input id="u_email" type="email" required value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@company.com" />
          </div>
          <div>
            <Label htmlFor="u_phone" className="text-xs font-semibold mb-1.5 block">
              เบอร์โทร <span className="text-destructive">*</span>
            </Label>
            <Input id="u_phone" type="tel" required value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="08x-xxx-xxxx" />
          </div>

          <div className="flex items-start gap-2 p-3 rounded-md" style={{ backgroundColor: "rgba(201, 169, 97, 0.06)", border: "1px solid rgba(201, 169, 97, 0.2)" }}>
            <CheckCircle2 size={14} style={{ color: "#C9A961" }} className="mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              ข้อมูลของท่านจะถูกเก็บเป็นความลับ ใช้เพื่อการติดต่อกลับและส่งเอกสารเฉพาะกลุ่มเท่านั้น
            </p>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 text-sm font-bold"
            style={{ backgroundColor: "#0A1628", color: "#C9A961" }}
          >
            {submitting ? <><Loader2 size={16} className="mr-2 animate-spin" /> กำลังส่ง...</> : "ปลดล็อก & ส่งลิงก์ไปอีเมล"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

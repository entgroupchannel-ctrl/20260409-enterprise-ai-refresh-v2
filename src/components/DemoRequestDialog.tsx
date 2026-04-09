import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Play, Send, Loader2, CheckCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const schema = z.object({
  name: z.string().trim().min(1, "กรุณากรอกชื่อ").max(100),
  organization: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง").max(255).optional().or(z.literal("")),
  line_id: z.string().trim().max(50).optional(),
  apps_to_test: z.string().trim().max(500).optional(),
  budget_info: z.string().trim().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface DemoRequestDialogProps {
  children: React.ReactNode;
}

const DemoRequestDialog = ({ children }: DemoRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trialStart, setTrialStart] = useState<Date>();
  const [trialEnd, setTrialEnd] = useState<Date>();
  const { user } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("demo_requests" as any).insert({
        name: data.name,
        organization: data.organization || null,
        phone: data.phone || null,
        email: data.email || null,
        line_id: data.line_id || null,
        apps_to_test: data.apps_to_test || null,
        budget_info: data.budget_info || null,
        trial_start: trialStart ? format(trialStart, "yyyy-MM-dd") : null,
        trial_end: trialEnd ? format(trialEnd, "yyyy-MM-dd") : null,
        user_id: user?.id || null,
      } as any);

      if (error) throw error;

      toast.success("ส่งคำขอทดลองใช้เรียบร้อยแล้ว!", {
        description: "ทีมงานจะติดต่อกลับภายใน 1 วันทำการ",
      });
      reset();
      setTrialStart(undefined);
      setTrialEnd(undefined);
      setOpen(false);
    } catch (err) {
      console.error("Demo request error:", err);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Play size={18} className="text-primary" />
            ขอทดลองใช้ vCloudPoint ฟรี 30 วัน
          </DialogTitle>
          <DialogDescription>
            กรอกข้อมูลเบื้องต้น ทีมวิศวกรจะติดต่อเพื่อติดตั้งให้ฟรี
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="demo-name">ชื่อ-นามสกุล <span className="text-destructive">*</span></Label>
            <Input id="demo-name" placeholder="ชื่อ นามสกุล" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Organization */}
          <div className="space-y-1.5">
            <Label htmlFor="demo-org">หน่วยงาน / บริษัท</Label>
            <Input id="demo-org" placeholder="ชื่อบริษัทหรือหน่วยงาน" {...register("organization")} />
          </div>

          {/* Trial dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>วันเริ่มยืม</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !trialStart && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {trialStart ? format(trialStart, "dd/MM/yyyy") : "เลือกวัน"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={trialStart} onSelect={setTrialStart} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>วันสิ้นสุด</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !trialEnd && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {trialEnd ? format(trialEnd, "dd/MM/yyyy") : "เลือกวัน"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={trialEnd} onSelect={setTrialEnd} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Apps to test */}
          <div className="space-y-1.5">
            <Label htmlFor="demo-apps">แอปพลิเคชันที่ต้องการทดสอบ</Label>
            <Textarea id="demo-apps" placeholder="เช่น Microsoft Office, Google Chrome, ERP, โปรแกรมบัญชี ฯลฯ" rows={2} {...register("apps_to_test")} />
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <Label htmlFor="demo-budget">งบประมาณ</Label>
            <Input id="demo-budget" placeholder="เช่น 50,000 - 100,000 บาท / ยังไม่มีงบประมาณ" {...register("budget_info")} />
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="demo-phone">เบอร์โทร</Label>
              <Input id="demo-phone" type="tel" placeholder="08x-xxx-xxxx" {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="demo-email">อีเมล</Label>
              <Input id="demo-email" type="email" placeholder="email@company.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="demo-line">LINE ID</Label>
            <Input id="demo-line" placeholder="@line-id" {...register("line_id")} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            ส่งคำขอทดลองใช้ฟรี
          </Button>

          {user ? (
            <p className="text-xs text-muted-foreground text-center">
              <CheckCircle className="inline w-3.5 h-3.5 text-green-500 mr-1" /> ล็อกอินแล้ว — คุณสามารถตรวจสอบสถานะคำขอได้ที่เมนู "คำขอของฉัน"
            </p>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span><Lightbulb className="inline w-3.5 h-3.5 text-amber-500 mr-1" /> ยังไม่ได้เป็นสมาชิก?</span>
              <Link
                to="/member-register"
                className="text-primary font-semibold hover:underline"
                onClick={() => setOpen(false)}
              >
                สมัครสมาชิก
              </Link>
              <span>เพื่อติดตามสถานะคำขอย้อนหลัง</span>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DemoRequestDialog;

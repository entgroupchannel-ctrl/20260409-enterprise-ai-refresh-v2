import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  FileText,
  Headphones,
  ArrowRight,
  LogIn,
  LayoutGrid,
  ShoppingBag,
} from "lucide-react";

const STORAGE_KEY = "ent_welcome_dialog_seen_v1";
const AUTO_CLOSE_SECONDS = 5;

const BENEFITS = [
  { icon: FileText, title: "ขอใบเสนอราคาออนไลน์", desc: "สร้าง/ติดตามใบเสนอราคาได้ทันที" },
  { icon: ShieldCheck, title: "ราคาพิเศษสำหรับองค์กร", desc: "ส่วนลดและเครดิตเทอมสำหรับ B2B" },
  { icon: Truck, title: "ติดตามสถานะคำสั่งซื้อ", desc: "ตั้งแต่สั่ง จัดส่ง จนถึงรับประกัน" },
  { icon: Headphones, title: "ทีมขายดูแลเฉพาะคุณ", desc: "ตอบกลับภายใน 2 ชั่วโมงทำการ" },
];

export default function WelcomeDialog() {
  const [open, setOpen] = useState(false);
  const [seconds, setSeconds] = useState(AUTO_CLOSE_SECONDS);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (seen) return;
      // Show after a tiny delay so it doesn't fight initial paint
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    } catch {
      // ignore
    }
  }, []);

  // Mark seen as soon as we decide to show
  useEffect(() => {
    if (open) {
      try {
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      } catch {
        /* ignore */
      }
    }
  }, [open]);

  // Countdown auto-close
  useEffect(() => {
    if (!open) return;
    setSeconds(AUTO_CLOSE_SECONDS);
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setOpen(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-primary/20">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-6 sm:p-8">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_60%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/15 backdrop-blur-sm text-xs font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              ยินดีต้อนรับสู่ ENT Group
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              B2B Industrial Platform
            </h2>
            <p className="mt-2 text-sm sm:text-base text-primary-foreground/90 max-w-lg">
              แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร — สมัครสมาชิกฟรี เพื่อเข้าถึงราคาพิเศษและบริการเฉพาะองค์กร
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-6 sm:p-8 pt-5 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:border-primary/30 transition-colors"
              >
                <div className="shrink-0 h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground">{title}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1" onClick={() => setOpen(false)}>
              <Link to="/register">
                สมัครสมาชิกฟรี <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              <Link to="/login">
                <LogIn className="h-4 w-4" /> เข้าสู่ระบบ
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button asChild variant="ghost" size="sm" onClick={() => setOpen(false)}>
              <Link to="/platform">
                <LayoutGrid className="h-4 w-4" /> ดู Platform Tour
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" onClick={() => setOpen(false)}>
              <Link to="/shop">
                <ShoppingBag className="h-4 w-4" /> เข้าสู่ร้านค้า
              </Link>
            </Button>
          </div>

          {/* Auto-close countdown */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>หน้าต่างนี้จะปิดใน {seconds} วินาที</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="underline-offset-2 hover:underline hover:text-foreground transition-colors"
            >
              ปิดเลย
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

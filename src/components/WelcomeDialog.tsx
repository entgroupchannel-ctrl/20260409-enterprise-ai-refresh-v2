import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Pause,
  Mail,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import welcomeBg from "@/assets/welcome-callcenter.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/** Storage keys */
const STORAGE_PREFIX = "ent_welcome_dialog_v2:";
const GLOBAL_KEY = `${STORAGE_PREFIX}__global__`;

/** Timing */
const AUTO_CLOSE_SECONDS = 15;       // default visible time (longer for reading)
const TICK_MS = 100;                  // smooth countdown tick
const FADE_OUT_MS = 600;              // gentle fade-out
const INITIAL_DELAY_MS = 1500;        // wait for page to settle
const SCROLL_SUPPRESS_PX = 200;       // don't interrupt active readers
const PATH_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;  // 7 days per path
const GLOBAL_COOLDOWN_MS = 30 * 60 * 1000;          // 30 minutes across pages

const BENEFITS = [
  { icon: FileText, title: "ขอใบเสนอราคาออนไลน์", desc: "สร้าง/ติดตามใบเสนอราคาได้ทันที" },
  { icon: ShieldCheck, title: "ราคาพิเศษสำหรับองค์กร", desc: "ส่วนลดและเครดิตเทอมสำหรับ B2B" },
  { icon: Truck, title: "ติดตามสถานะคำสั่งซื้อ", desc: "ตั้งแต่สั่ง จัดส่ง จนถึงรับประกัน" },
  { icon: Headphones, title: "ทีมขายดูแลเฉพาะคุณ", desc: "ตอบกลับภายใน 2 ชั่วโมงทำการ" },
];

/** Bypass dialog entirely on these route prefixes (internal/auth/admin) */
const BYPASS_PREFIXES = [
  "/admin", "/dashboard", "/profile", "/notifications", "/cart",
  "/my-account", "/my-quotes", "/my-orders", "/my-invoices",
  "/my-tax-invoices", "/my-receipts", "/my-documents", "/my-repairs", "/my",
  "/login", "/register", "/forgot-password", "/reset-password", "/invite",
  "/affiliate/dashboard", "/partner/portal", "/debug-test",
  "/q/share", "/inv/share", "/tx/share", "/rcp/share",
  "/unsubscribe",
];

const isBypassPath = (p: string) => BYPASS_PREFIXES.some((pre) => p === pre || p.startsWith(pre + "/"));

/** Detect logged-in users via Supabase localStorage tokens */
const isLoggedIn = (): boolean => {
  try {
    return Object.keys(localStorage).some(
      (k) => k.includes("auth-token") || (k.startsWith("sb-") && k.includes("-auth-")),
    );
  } catch {
    return false;
  }
};

export default function WelcomeDialog() {
  const location = useLocation();
  const pathKey = useMemo(() => `${STORAGE_PREFIX}${location.pathname}`, [location.pathname]);

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [remainingMs, setRemainingMs] = useState(AUTO_CLOSE_SECONDS * 1000);
  const totalMsRef = useRef(AUTO_CLOSE_SECONDS * 1000);
  const closeTimerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Newsletter subscribe state
  const [subEmail, setSubEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = subEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "อีเมลไม่ถูกต้อง", description: "กรุณากรอกอีเมลที่ถูกต้อง", variant: "destructive" });
      return;
    }
    setSubLoading(true);
    try {
      const { error } = await supabase
        .from("subscribers")
        .insert({ email, source: "welcome_dialog", is_active: true } as any);
      // Ignore unique-violation as success (already subscribed)
      if (error && !String(error.message).toLowerCase().includes("duplicate")) {
        throw error;
      }
      setSubSuccess(true);
      setSubEmail("");
      toast({ title: "สมัครรับข่าวสารสำเร็จ 🎉", description: "ขอบคุณที่ติดตาม ENT Group" });
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message ?? "ลองใหม่อีกครั้ง", variant: "destructive" });
    } finally {
      setSubLoading(false);
    }
  };

  /** Decide whether to show on route change (cooldowns + force/reset query) */
  useEffect(() => {
    setOpen(false);
    setClosing(false);

    // Parse query for QA hooks
    const params = new URLSearchParams(window.location.search);
    const welcomeParam = params.get("welcome");
    const isForce = welcomeParam === "1";
    const isReset = welcomeParam === "reset";

    // Reset clears all welcome dialog keys then forces show
    if (isReset) {
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith(STORAGE_PREFIX))
          .forEach((k) => localStorage.removeItem(k));
      } catch { /* ignore */ }
    }

    // Bypass for internal routes & logged-in users — but allow QA force/reset to override
    if (!isForce && !isReset) {
      if (isBypassPath(location.pathname)) return;
      if (isLoggedIn()) return;
    }

    // Cooldown checks (skipped when force/reset)
    if (!isForce && !isReset) {
      try {
        const now = Date.now();
        const seenPath = localStorage.getItem(pathKey);
        if (seenPath) {
          const t = Date.parse(seenPath);
          if (!isNaN(t) && now - t < PATH_COOLDOWN_MS) return;
        }
        const seenGlobal = localStorage.getItem(GLOBAL_KEY);
        if (seenGlobal) {
          const t = Date.parse(seenGlobal);
          if (!isNaN(t) && now - t < GLOBAL_COOLDOWN_MS) return;
        }
      } catch {
        /* ignore */
      }
    }

    const t = window.setTimeout(() => {
      // Don't interrupt active readers (skip if they've already scrolled)
      if (!isForce && !isReset && window.scrollY > SCROLL_SUPPRESS_PX) return;
      setOpen(true);
    }, INITIAL_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [location.pathname, pathKey]);

  /** Mark as seen as soon as it shows */
  useEffect(() => {
    if (!open) return;
    try {
      const now = new Date().toISOString();
      localStorage.setItem(pathKey, now);
      localStorage.setItem(GLOBAL_KEY, now);
    } catch {
      /* ignore */
    }
    // reset countdown each time it opens
    totalMsRef.current = AUTO_CLOSE_SECONDS * 1000;
    setRemainingMs(AUTO_CLOSE_SECONDS * 1000);
    setPaused(false);
  }, [open, pathKey]);

  /** Countdown loop with pause support + smooth fade-out at 0 */
  useEffect(() => {
    if (!open || closing) return;
    if (paused) return;

    const id = window.setInterval(() => {
      setRemainingMs((ms) => {
        const next = ms - TICK_MS;
        if (next <= 0) {
          window.clearInterval(id);
          // gentle fade-out
          setClosing(true);
          if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
          closeTimerRef.current = window.setTimeout(() => {
            setOpen(false);
            setClosing(false);
          }, FADE_OUT_MS);
          return 0;
        }
        return next;
      });
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [open, paused, closing]);

  /** Cleanup pending close timer on unmount */
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, FADE_OUT_MS);
  };

  const handleMouseEnter = () => {
    setPaused(true);
    // grant extra reading time when user re-engages: top up to full 15s if low
    setRemainingMs((ms) => (ms < 8000 ? 15000 : ms));
    totalMsRef.current = Math.max(totalMsRef.current, 15000);
  };

  const handleMouseLeave = () => setPaused(false);

  // Circular countdown geometry
  const SIZE = 36;
  const STROKE = 3;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const progress = Math.max(0, Math.min(1, remainingMs / totalMsRef.current));
  const dashOffset = C * (1 - progress);
  const secondsLeft = Math.ceil(remainingMs / 1000);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent
        className={[
          "max-w-2xl p-0 overflow-hidden border-primary/20",
          "transition-all duration-500 ease-out",
          closing ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100",
        ].join(" ")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={handleMouseEnter}
        onBlurCapture={handleMouseLeave}
      >
        {/* Header — Call Center hero */}
        <div className="relative text-primary-foreground p-6 sm:p-8 min-h-[220px] sm:min-h-[260px] overflow-hidden">
          {/* Background photo */}
          <img
            src={welcomeBg}
            alt="ทีม Call Center ENT Group ยินดีต้อนรับ"
            width={1280}
            height={640}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Brand color overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top_right,_white,_transparent_60%)]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/20 backdrop-blur-sm text-xs font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              ยินดีต้อนรับสู่ ENT Group
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight drop-shadow-sm">
              B2B Industrial Platform
            </h2>
            <p className="mt-2 text-sm sm:text-base text-primary-foreground/95 max-w-lg drop-shadow-sm">
              แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร — ทีมงานพร้อมดูแลคุณตลอดการใช้งาน
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
            <Button asChild className="flex-1" onClick={handleClose}>
              <Link to="/register">
                สมัครสมาชิกฟรี <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1" onClick={handleClose}>
              <Link to="/login">
                <LogIn className="h-4 w-4" /> เข้าสู่ระบบ
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button asChild variant="ghost" size="sm" onClick={handleClose}>
              <Link to="/platform">
                <LayoutGrid className="h-4 w-4" /> ดู Platform Tour
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" onClick={handleClose}>
              <Link to="/shop">
                <ShoppingBag className="h-4 w-4" /> เข้าสู่ร้านค้า
              </Link>
            </Button>
          </div>

          {/* Newsletter subscribe */}
          <div className="mt-5 p-3.5 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">รับข่าวสารและโปรโมชั่นพิเศษ</div>
                <div className="text-[11px] text-muted-foreground">สินค้าใหม่ ส่วนลดองค์กร และข่าวอุตสาหกรรม</div>
              </div>
            </div>
            {subSuccess ? (
              <div className="flex items-center gap-2 text-sm text-primary font-medium py-1.5">
                <CheckCircle2 className="h-4 w-4" />
                สมัครเรียบร้อยแล้ว ขอบคุณค่ะ
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="your@email.com"
                  maxLength={255}
                  disabled={subLoading}
                  className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                />
                <Button type="submit" size="sm" disabled={subLoading} className="h-9 px-4">
                  {subLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "สมัคร"}
                </Button>
              </form>
            )}
          </div>

          {/* Circular countdown footer */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <div className="relative" style={{ width: SIZE, height: SIZE }} aria-hidden="true">
                <svg width={SIZE} height={SIZE} className="-rotate-90">
                  <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    stroke="hsl(var(--muted))"
                    strokeWidth={STROKE}
                    fill="none"
                  />
                  <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    stroke="hsl(var(--primary))"
                    strokeWidth={STROKE}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={dashOffset}
                    style={{ transition: `stroke-dashoffset ${TICK_MS}ms linear` }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-foreground tabular-nums">
                  {paused ? <Pause className="h-3 w-3 text-muted-foreground" /> : secondsLeft}
                </div>
              </div>
              <span>
                {paused
                  ? "หยุดชั่วคราว — เลื่อนเมาส์ออกเพื่อเริ่มนับต่อ"
                  : `จะปิดอัตโนมัติใน ${secondsLeft} วินาที`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-muted-foreground underline-offset-2 hover:underline hover:text-foreground transition-colors"
            >
              ปิดเลย
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

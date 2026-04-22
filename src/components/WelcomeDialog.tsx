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
          "max-w-3xl p-0 overflow-hidden border-primary/20",
          "sm:max-h-[92vh] max-h-[90vh] overflow-y-auto",
          "transition-all duration-500 ease-out",
          closing ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100",
          "[&>button.absolute]:hidden",
        ].join(" ")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={handleMouseEnter}
        onBlurCapture={handleMouseLeave}
      >
        {/* Prominent close button — top right, always visible */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="ปิด"
          className="absolute right-3 top-3 z-20 h-8 w-8 rounded-full bg-background/90 hover:bg-background border border-border shadow-md flex items-center justify-center text-foreground hover:text-primary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-[42%_58%] grid-cols-1">
          {/* LEFT: Hero — compact on mobile, full-height on desktop */}
          <div className="relative text-primary-foreground p-5 md:p-6 min-h-[140px] md:min-h-[440px] overflow-hidden">
            <img
              src={welcomeBg}
              alt="ทีม Call Center ENT Group ยินดีต้อนรับ"
              width={1280}
              height={640}
              className="absolute inset-0 w-full h-full object-cover object-center"
             loading="lazy" decoding="async"/>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-primary/50 mix-blend-multiply" />
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top_right,_white,_transparent_60%)]" />

            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-foreground/20 backdrop-blur-sm text-[11px] font-medium mb-2.5">
                <Sparkles className="h-3 w-3" />
                ยินดีต้อนรับ
              </div>
              <h2 className="text-xl md:text-2xl font-bold leading-tight drop-shadow-sm">
                B2B Industrial Platform
              </h2>
              <p className="mt-1.5 text-xs md:text-sm text-primary-foreground/95 drop-shadow-sm leading-relaxed">
                แพลตฟอร์มจัดซื้ออุตสาหกรรมครบวงจร — ทีมงานพร้อมดูแลคุณ
              </p>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="p-5 md:p-6 flex flex-col gap-3.5">
            {/* Benefits — compact 2-col always */}
            <div className="grid grid-cols-2 gap-2">
              {BENEFITS.map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="flex items-center gap-2 p-2 rounded-md border bg-card/50"
                >
                  <div className="shrink-0 h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-[11.5px] font-medium text-foreground leading-tight">{title}</div>
                </div>
              ))}
            </div>

            {/* CTAs — primary row */}
            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1 h-9" onClick={handleClose}>
                <Link to="/register">
                  สมัครฟรี <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1 h-9" onClick={handleClose}>
                <Link to="/login">
                  <LogIn className="h-3.5 w-3.5" /> เข้าสู่ระบบ
                </Link>
              </Button>
            </div>

            {/* Secondary links — inline */}
            <div className="flex items-center justify-center gap-4 text-xs">
              <Link to="/platform" onClick={handleClose} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                <LayoutGrid className="h-3.5 w-3.5" /> Platform Tour
              </Link>
              <span className="text-border">·</span>
              <Link to="/shop" onClick={handleClose} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                <ShoppingBag className="h-3.5 w-3.5" /> ร้านค้า
              </Link>
            </div>

            {/* Newsletter — compact */}
            <div className="p-2.5 rounded-md border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <div className="text-xs font-semibold text-foreground">รับข่าวสาร & โปรโมชั่น</div>
              </div>
              {subSuccess ? (
                <div className="flex items-center gap-1.5 text-xs text-primary font-medium py-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  สมัครเรียบร้อยแล้ว
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder="your@email.com"
                    maxLength={255}
                    disabled={subLoading}
                    className="flex-1 h-8 px-2.5 rounded-md border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                  />
                  <Button type="submit" size="sm" disabled={subLoading} className="h-8 px-3 text-xs">
                    {subLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "สมัคร"}
                  </Button>
                </form>
              )}
            </div>

            {/* Countdown footer */}
            <div className="flex items-center justify-between gap-2 mt-auto pt-1">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground min-w-0">
                <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }} aria-hidden="true">
                  <svg width={SIZE} height={SIZE} className="-rotate-90">
                    <circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="hsl(var(--muted))" strokeWidth={STROKE} fill="none" />
                    <circle
                      cx={SIZE / 2} cy={SIZE / 2} r={R}
                      stroke="hsl(var(--primary))" strokeWidth={STROKE} fill="none" strokeLinecap="round"
                      strokeDasharray={C} strokeDashoffset={dashOffset}
                      style={{ transition: `stroke-dashoffset ${TICK_MS}ms linear` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-foreground tabular-nums">
                    {paused ? <Pause className="h-3 w-3 text-muted-foreground" /> : secondsLeft}
                  </div>
                </div>
                <span className="truncate">
                  {paused ? "หยุดชั่วคราว" : `ปิดใน ${secondsLeft}s`}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-medium text-muted-foreground hover:text-primary underline-offset-2 hover:underline transition-colors shrink-0"
              >
                ปิดเลย
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

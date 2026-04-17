import { Link } from "react-router-dom";
import { FileSearch, ShieldCheck, Clock, ArrowRight, Sparkles } from "lucide-react";

interface RFQCTABannerProps {
  className?: string;
  /** compact = thinner version for sidebars/inline. full = full-width section */
  variant?: "full" | "compact";
}

const trustItems = [
  { icon: ShieldCheck, label: "ผู้ขายตรวจสอบแล้ว" },
  { icon: Clock, label: "ตอบกลับภายใน 4 ชม." },
  { icon: Sparkles, label: "ฟรี ไม่มีค่าใช้จ่าย" },
];

const RFQCTABanner = ({ className = "", variant = "full" }: RFQCTABannerProps) => {
  if (variant === "compact") {
    return (
      <div className={`rounded-xl border border-border bg-gradient-to-br from-primary/5 via-card to-secondary/30 p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FileSearch className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">ขอใบเสนอราคา (RFQ)</p>
            <p className="text-xs text-muted-foreground mt-0.5">ยังไม่เจอรุ่นที่ใช่? ให้ทีมเราหาให้</p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            ขอเลย <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="relative max-w-5xl mx-auto rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-secondary/30 p-6 sm:p-8 overflow-hidden">
        {/* decorative blob */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
          {/* Icon badge */}
          <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <FileSearch className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" /> Request for Quotation
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              ยังไม่เจอรุ่นที่ใช่? ให้ทีมผู้เชี่ยวชาญหาให้
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              บอกความต้องการของคุณ — ทีมจัดซื้อจะจับคู่สินค้าจากซัพพลายเออร์ที่ผ่านการตรวจสอบและส่งใบเสนอราคาให้คุณภายใน 4 ชั่วโมง
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-3">
              {trustItems.map((t) => (
                <span key={t.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <t.icon className="w-3.5 h-3.5 text-primary" />
                  {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
            >
              ขอใบเสนอราคา <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg border border-border bg-card text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors whitespace-nowrap"
            >
              เลือกจากแคตตาล็อก
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RFQCTABanner;

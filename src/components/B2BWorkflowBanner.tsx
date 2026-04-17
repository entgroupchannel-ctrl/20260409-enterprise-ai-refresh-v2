import { ChevronRight, Headphones, ShoppingCart, FileText, ReceiptText, Clock } from "lucide-react";
import b2bWorkflowImage from "@/assets/b2b-quote-workflow.jpg";

interface B2BWorkflowBannerProps {
  /** compact = smaller height, no headline. full = with headline */
  variant?: "full" | "compact";
  className?: string;
}

const steps = [
  { icon: Headphones, label: "ทีมแอดมินดูแล" },
  { icon: ShoppingCart, label: "หยิบใส่ตะกร้า" },
  { icon: FileText, label: "ใบเสนอราคา PDF" },
  { icon: ReceiptText, label: "รับ PO / สลิป" },
];

const B2BWorkflowBanner = ({ variant = "full", className = "" }: B2BWorkflowBannerProps) => {
  return (
    <section className={`container mx-auto px-4 ${variant === "full" ? "py-10" : "py-6"} ${className}`}>
      {variant === "full" && (
        <div className="text-center mb-5 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" /> B2B Procurement · ภายใน 4 ชม.
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            ขั้นตอนง่ายๆ ในการขอใบเสนอราคา
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            เลือกสินค้า → หยิบใส่ตะกร้า → กดขอใบเสนอราคา — ทีมเตรียมเอกสารให้ภายใน 4 ชั่วโมง
          </p>
        </div>
      )}

      <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-card to-secondary/20 shadow-sm">
        <img
          src={b2bWorkflowImage}
          alt="ขั้นตอนการขอใบเสนอราคาแบบ B2B"
          className={`w-full object-cover ${variant === "compact" ? "max-h-[260px]" : "max-h-[380px]"}`}
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/85 to-transparent p-3 sm:p-5">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
            {steps.map((s, i) => (
              <span key={s.label} className="flex items-center gap-1.5 sm:gap-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/80 backdrop-blur border border-border">
                  <s.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span>{s.label}</span>
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BWorkflowBanner;

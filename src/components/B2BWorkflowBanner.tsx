import { ChevronRight, Headphones, ShoppingCart, FileText, ReceiptText, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import b2bWorkflowImage from "@/assets/b2b-quote-workflow.jpg";

interface B2BWorkflowBannerProps {
  /** compact = smaller height, no headline. full = with headline */
  variant?: "full" | "compact";
  className?: string;
  /** show CTA button to /shop */
  showShopCta?: boolean;
}

const steps = [
  { icon: Headphones, label: "ทีมแอดมินดูแล" },
  { icon: ShoppingCart, label: "หยิบใส่ตะกร้า" },
  { icon: FileText, label: "ใบเสนอราคา PDF" },
  { icon: ReceiptText, label: "รับ PO / สลิป" },
];

const B2BWorkflowBanner = ({ variant = "full", className = "", showShopCta = false }: B2BWorkflowBannerProps) => {
  return (
    <section className={`container mx-auto px-4 ${variant === "full" ? "py-10" : "py-6"} ${className}`}>
      {variant === "full" && (
        <div className="text-center mb-6 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
            <Clock className="w-3.5 h-3.5" /> B2B Industrial Platform · ใบเสนอราคาภายใน 4 ชม.
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
            แพลตฟอร์มจัดซื้อ <span className="text-primary">B2B ครบวงจร</span> สำหรับองค์กร
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            เลือกสินค้า → หยิบใส่ตะกร้า → กดขอใบเสนอราคา — ทีมเตรียมเอกสาร PDF พร้อมตราประทับให้ภายใน 4 ชั่วโมง
          </p>
          {showShopCta && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                เริ่มเลือกสินค้าที่ Shop <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary/30 bg-background text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                ปรึกษาแอดมิน
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-card to-secondary/20 shadow-sm">
        <img
          src={b2bWorkflowImage}
          alt="ขั้นตอนการขอใบเสนอราคาแบบ B2B"
          className={`w-full object-cover ${variant === "compact" ? "max-h-[260px]" : "max-h-[380px]"}`}/>
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

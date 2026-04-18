import { Link } from "react-router-dom";
import { FileText, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";

interface JetsonCTABarProps {
  /** Optional product model to pre-fill quote dialog */
  primaryHref?: string;
  /** Short label for the lead message */
  message?: string;
}

/**
 * JetsonCTABar — แถบ CTA สำหรับหน้าตระกูล /nvidia-jetson
 * ใช้วางในส่วนกลาง/ท้ายหน้า เพื่อให้ผู้ชมขอใบเสนอราคา หรือไปยังหน้า Shop ได้ทันที
 */
export default function JetsonCTABar({
  primaryHref = "/request-quote",
  message = "สนใจ NVIDIA Jetson หรือโซลูชัน Edge AI?",
}: JetsonCTABarProps) {
  return (
    <section className="container max-w-7xl mx-auto px-4 my-10">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-emerald-500/10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
          <div className="flex items-start gap-3 flex-1">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">{message}</h3>
              <p className="text-sm text-muted-foreground">
                ทีมวิศวกรของเราพร้อมให้คำปรึกษา + ใบเสนอราคา ภายใน 24 ชม.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to={primaryHref}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <FileText size={16} /> ขอใบเสนอราคา
            </Link>
            <Link
              to="/shop?series=Jetson"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-primary/30 text-foreground hover:bg-primary/5 font-semibold transition-colors"
            >
              <ShoppingBag size={16} /> ไปที่ร้านค้า <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

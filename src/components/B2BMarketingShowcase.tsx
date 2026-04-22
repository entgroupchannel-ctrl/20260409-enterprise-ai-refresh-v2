import { Search, ShoppingCart, FileText, ClipboardCheck, Truck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import img1 from "@/assets/b2b-marketing-1-browse.jpg";
import img2 from "@/assets/b2b-marketing-2-cart.jpg";
import img3 from "@/assets/b2b-marketing-3-quote.jpg";
import img4 from "@/assets/b2b-marketing-4-approve.jpg";
import img5 from "@/assets/b2b-marketing-5-delivery.jpg";

const STEPS = [
  { n: "01", icon: Search, title: "เลือกดูสินค้า", desc: "Catalog 200+ รุ่น พร้อมสเปก ราคา และ Datasheet PDF", image: img1, accent: "from-blue-500/15 to-primary/10" },
  { n: "02", icon: ShoppingCart, title: "หยิบใส่ตะกร้า", desc: "เพิ่มสินค้าที่สนใจ จัดกลุ่ม สร้างรายการขอใบเสนอราคา", image: img2, accent: "from-orange-500/15 to-amber-500/10" },
  { n: "03", icon: FileText, title: "รับใบเสนอราคา", desc: "ทีมขายตรวจสอบและจัดทำเอกสาร PDF ภายใน 4 ชั่วโมง", image: img3, accent: "from-emerald-500/15 to-teal-500/10" },
  { n: "04", icon: ClipboardCheck, title: "อนุมัติ & ส่ง PO", desc: "ยืนยันออเดอร์ผ่านระบบ แนบ PO/สลิป รับใบกำกับภาษี", image: img4, accent: "from-violet-500/15 to-indigo-500/10" },
  { n: "05", icon: Truck, title: "รับสินค้า", desc: "จัดส่งทั่วประเทศ พร้อมติดตามสถานะและรับประกันสินค้า", image: img5, accent: "from-rose-500/15 to-pink-500/10" },
];

interface Props {
  /** show heading section */
  showHeading?: boolean;
  /** background variant */
  variant?: "default" | "muted";
  className?: string;
}

const B2BMarketingShowcase = ({ showHeading = true, variant = "default", className = "" }: Props) => {
  return (
    <section className={`${variant === "muted" ? "bg-muted/30 border-y" : ""} ${className}`}>
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 lg:min-h-[calc(100vh-4rem)] lg:flex lg:flex-col lg:justify-center">
        {showHeading && (
          <div className="text-center mb-4 md:mb-6 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
              B2B Procurement Workflow
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1.5">
              ขั้นตอนการสั่งซื้อแบบ B2B ที่<span className="text-primary">เข้าใจง่าย</span>
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              จากเลือกสินค้าจนถึงรับของ — ทุกขั้นตอนชัดเจน มีทีมขายดูแลตลอด
            </p>
          </div>
        )}

        {/* Compact 3x2 grid — fits one viewport on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {STEPS.map(({ n, icon: Icon, title, desc, image, accent }) => (
            <div
              key={n}
              className="group relative rounded-xl overflow-hidden border bg-card hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${accent}`}>
                <img
                  src={image}
                  alt={`ขั้นตอน ${n}: ${title}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 decoding="async"/>
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-background/90 backdrop-blur-sm border border-border text-primary font-black text-[11px] shadow">
                    {n}
                  </span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground shadow">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 md:p-3.5 flex-1">
                <h3 className="font-bold text-sm md:text-base mb-0.5 leading-tight">{title}</h3>
                <p className="text-[11px] md:text-xs text-muted-foreground leading-snug line-clamp-2">{desc}</p>
              </div>
            </div>
          ))}

          {/* CTA card — same compact size */}
          <div className="group relative rounded-xl overflow-hidden border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 flex flex-col justify-center items-center text-center hover:border-primary hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm md:text-base mb-1">เริ่มขั้นตอนแรก</h3>
            <p className="text-[11px] md:text-xs text-muted-foreground mb-3 leading-snug">
              เลือกดูสินค้ากว่า 200+ รุ่น หรือปรึกษาทีมแอดมินก่อน
            </p>
            <div className="flex flex-col sm:flex-row gap-1.5 w-full">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                เลือกสินค้า <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-border bg-background text-xs font-semibold hover:border-primary/40 hover:text-primary transition-colors"
              >
                ปรึกษาแอดมิน
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BMarketingShowcase;

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
      <div className="container max-w-7xl mx-auto px-6 py-16 md:py-20">
        {showHeading && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              B2B Procurement Workflow
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              ขั้นตอนการสั่งซื้อแบบ B2B ที่<span className="text-primary">เข้าใจง่าย</span>
            </h2>
            <p className="text-muted-foreground">
              จากเลือกสินค้าจนถึงรับของ — ทุกขั้นตอนชัดเจน มีทีมขายดูแลตลอด
            </p>
          </div>
        )}

        {/* Featured (first card spans larger on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map(({ n, icon: Icon, title, desc, image, accent }, idx) => (
            <div
              key={n}
              className={`group relative rounded-2xl overflow-hidden border bg-card hover:shadow-xl hover:border-primary/40 transition-all duration-300 ${
                idx === 0 ? "lg:col-span-1 md:col-span-2 lg:row-span-1" : ""
              }`}
            >
              {/* Image */}
              <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${accent}`}>
                <img
                  src={image}
                  alt={`ขั้นตอน ${n}: ${title}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Step number badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border text-primary font-black text-sm shadow-md">
                    {n}
                  </span>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground shadow-md">
                    <Icon className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1.5 leading-tight">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}

          {/* CTA card */}
          <div className="group relative rounded-2xl overflow-hidden border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 flex flex-col justify-center items-center text-center hover:border-primary hover:shadow-xl transition-all">
            <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">เริ่มขั้นตอนแรก</h3>
            <p className="text-sm text-muted-foreground mb-5">
              เลือกดูสินค้ากว่า 200+ รุ่น หรือปรึกษาทีมแอดมินก่อน
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                เลือกสินค้า <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-semibold hover:border-primary/40 hover:text-primary transition-colors"
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

import { Search, ShoppingCart, FileText, ClipboardCheck, Truck, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import img1 from "@/assets/b2b-step-1-browse.jpg";
import img2 from "@/assets/b2b-step-2-cart.jpg";
import img3 from "@/assets/b2b-step-3-quote.jpg";
import img4 from "@/assets/b2b-step-4-approve.jpg";
import img5 from "@/assets/b2b-step-5-delivery.jpg";

const STEPS = [
  {
    n: "01",
    icon: Search,
    title: "เลือกดูสินค้าจาก Catalog",
    desc: "ค้นหาสินค้ากว่า 200+ รุ่น พร้อมสเปก ราคา และเอกสารเทคนิค ผ่านหน้า Shop ที่ใช้งานง่าย",
    image: img1,
    accent: "from-blue-500/20 via-indigo-500/10",
    badge: "Catalog & Search",
  },
  {
    n: "02",
    icon: ShoppingCart,
    title: "หยิบใส่ตะกร้า & ขอใบเสนอราคา",
    desc: "เพิ่มสินค้าที่สนใจลงตะกร้า ปรับจำนวน แล้วกด 'ขอใบเสนอราคา' ทีมขายรับเรื่องทันที",
    image: img2,
    accent: "from-orange-500/20 via-amber-500/10",
    badge: "Smart Cart",
  },
  {
    n: "03",
    icon: FileText,
    title: "รับใบเสนอราคา PDF",
    desc: "ทีมขายตรวจสอบและจัดทำใบเสนอราคา PDF พร้อมตราประทับ ส่งกลับภายใน 4 ชั่วโมง",
    image: img3,
    accent: "from-emerald-500/20 via-teal-500/10",
    badge: "Quote PDF",
  },
  {
    n: "04",
    icon: ClipboardCheck,
    title: "อนุมัติ & แนบ PO/สลิป",
    desc: "ยืนยันการสั่งซื้อในระบบ อัปโหลด PO หรือสลิปโอนเงิน ติดตามสถานะอนุมัติแบบ Real-time",
    image: img4,
    accent: "from-violet-500/20 via-purple-500/10",
    badge: "Approval Flow",
  },
  {
    n: "05",
    icon: Truck,
    title: "ติดตามการจัดส่ง",
    desc: "ดูสถานะคำสั่งซื้อตั้งแต่จัดเตรียม → จัดส่ง → ส่งถึง พร้อมเลขพัสดุและการรับประกัน",
    image: img5,
    accent: "from-rose-500/20 via-pink-500/10",
    badge: "Order Tracking",
  },
];

const B2BPlatformInterfaceShowcase = () => {
  return (
    <section className="bg-gradient-to-b from-background via-muted/20 to-background border-y">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 lg:min-h-[calc(100vh-4rem)] lg:flex lg:flex-col lg:justify-center">
        {/* Heading — compact */}
        <div className="text-center mb-4 md:mb-6 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" /> Inside the B2B Platform
          </span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1.5 leading-tight">
            ดูตัวอย่าง<span className="text-primary">หน้าจอจริง</span> ในแต่ละขั้นตอน
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            ระบบ B2B Procurement ครบวงจร — จากเลือกสินค้าจนรับของ ผ่านหน้าเว็บที่ใช้งานง่าย
          </p>
        </div>

        {/* 5 steps — single row on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-3">
          {STEPS.map(({ n, icon: Icon, title, desc, image, accent, badge }) => (
            <div
              key={n}
              className="group relative rounded-xl overflow-hidden border bg-card hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${accent} to-background`}>
                <img
                  src={image}
                  alt={`ขั้นตอน ${n}: ${title}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-background/95 backdrop-blur-sm border text-primary font-black text-[10px] shadow">
                    {n}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/95 backdrop-blur-sm text-primary-foreground text-[8px] font-bold uppercase tracking-wider shadow hidden sm:inline-flex">
                    {badge}
                  </span>
                </div>
              </div>

              {/* Content — compact */}
              <div className="p-2.5 flex-1 flex flex-col">
                <div className="flex items-start gap-1.5 mb-1">
                  <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <h3 className="font-bold text-xs md:text-sm leading-tight flex-1">{title}</h3>
                </div>
                <p className="text-[10px] md:text-[11px] text-muted-foreground leading-snug line-clamp-2">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — compact */}
        <div className="mt-4 md:mt-5 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs md:text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            เริ่มเลือกสินค้าที่ Shop <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-background text-xs md:text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            ปรึกษาทีมแอดมิน
          </Link>
        </div>
      </div>
    </section>
  );
};

export default B2BPlatformInterfaceShowcase;


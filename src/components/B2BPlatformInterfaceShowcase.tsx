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
    <section className="section-padding bg-gradient-to-b from-background via-muted/20 to-background border-y">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Inside the B2B Platform
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
            ดูตัวอย่าง<span className="text-primary">หน้าจอจริง</span> ในแต่ละขั้นตอน
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            ระบบ B2B Procurement ของ ENT Group ออกแบบให้ลูกค้าทำงานได้ครบทุกขั้นตอน
            ตั้งแต่เลือกสินค้าจนถึงรับของ — ผ่านหน้าเว็บที่ใช้งานง่าย
          </p>
        </div>

        {/* Featured first step — large card */}
        <div className="grid lg:grid-cols-5 gap-4 md:gap-6 mb-4 md:mb-6">
          {STEPS.slice(0, 1).map(({ n, icon: Icon, title, desc, image, accent, badge }) => (
            <div
              key={n}
              className="lg:col-span-3 group relative rounded-2xl overflow-hidden border bg-card hover:shadow-2xl hover:border-primary/40 transition-all duration-500"
            >
              <div className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${accent} to-background`}>
                <img
                  src={image}
                  alt={`ขั้นตอน ${n}: ${title}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-background/95 backdrop-blur-sm border text-primary font-black text-sm shadow-lg">
                    {n}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary/95 backdrop-blur-sm text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow">
                    {badge}
                  </span>
                </div>
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg mb-1 leading-tight">{title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Step 02 — tall sidebar card */}
          {STEPS.slice(1, 2).map(({ n, icon: Icon, title, desc, image, accent, badge }) => (
            <div
              key={n}
              className="lg:col-span-2 group relative rounded-2xl overflow-hidden border bg-card hover:shadow-2xl hover:border-primary/40 transition-all duration-500"
            >
              <div className={`relative aspect-[4/3] lg:aspect-auto lg:h-[60%] overflow-hidden bg-gradient-to-br ${accent} to-background`}>
                <img
                  src={image}
                  alt={`ขั้นตอน ${n}: ${title}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-background/95 backdrop-blur-sm border text-primary font-black text-sm shadow-lg">
                    {n}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary/95 backdrop-blur-sm text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow">
                    {badge}
                  </span>
                </div>
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg mb-1 leading-tight">{title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 3 steps */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {STEPS.slice(2).map(({ n, icon: Icon, title, desc, image, accent, badge }) => (
            <div
              key={n}
              className="group relative rounded-2xl overflow-hidden border bg-card hover:shadow-xl hover:border-primary/40 transition-all duration-500 flex flex-col"
            >
              <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${accent} to-background`}>
                <img
                  src={image}
                  alt={`ขั้นตอน ${n}: ${title}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-background/95 backdrop-blur-sm border text-primary font-black text-xs shadow-lg">
                    {n}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/95 backdrop-blur-sm text-primary-foreground text-[9px] font-bold uppercase tracking-wider shadow">
                    {badge}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base mb-1 leading-tight">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            เริ่มเลือกสินค้าที่ Shop <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-background text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            ปรึกษาทีมแอดมิน
          </Link>
        </div>
      </div>
    </section>
  );
};

export default B2BPlatformInterfaceShowcase;

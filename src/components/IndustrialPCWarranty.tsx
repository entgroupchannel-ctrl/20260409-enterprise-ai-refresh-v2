import { ShieldCheck, RotateCcw, Clock } from "lucide-react";
import warrantyImg from "@/assets/ads/industrialpc-ad-1-warranty.jpg";
import warrantyExtendImg from "@/assets/ads/industrialpc-ad-5-warranty-extend.jpg";

/** Shared warranty/trust block สำหรับหน้า Industrial PC ทุกตระกูล */
const IndustrialPCWarranty = ({ compact = false }: { compact?: boolean }) => {
  return (
    <section className={`relative overflow-hidden border-y border-border bg-gradient-to-br from-primary/5 via-background to-primary/5 ${compact ? "py-10" : "py-14"}`}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          {/* Left: image collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg aspect-square bg-card">
              <img src={warrantyImg} alt="รับประกันสินค้า ENT Group" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg aspect-square bg-card mt-6">
              <img src={warrantyExtendImg} alt="ขยายระยะเวลารับประกัน" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>

          {/* Right: content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-primary border border-primary/30 bg-primary/10 mb-3">
              <ShieldCheck size={12} /> ENT GROUP WARRANTY
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              สินค้าทุกชิ้น มาพร้อม <span className="text-primary">การรับประกันแบบมืออาชีพ</span>
            </h2>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              เราเชื่อมั่นในคุณภาพสินค้า Industrial PC ของเรา จึงมอบการรับประกัน 1–3 ปี
              พร้อมบริการ Onsite และอะไหล่สำรองสำหรับลูกค้า B2B
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, title: "รับประกัน 1–3 ปี", desc: "เริ่มตั้งแต่วันรับสินค้า" },
                { icon: RotateCcw, title: "ขยายเวลาได้", desc: "Extended warranty สูงสุด 5 ปี" },
                { icon: Clock, title: "บริการเร็ว", desc: "ตอบกลับภายใน 24 ชม." },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="card-surface p-4 rounded-xl border border-border">
                    <Icon className="w-5 h-5 text-primary mb-2" />
                    <div className="font-bold text-foreground text-sm">{b.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{b.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustrialPCWarranty;

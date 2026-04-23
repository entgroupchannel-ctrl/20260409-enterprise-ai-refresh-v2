import { Badge } from "@/components/ui/badge";
import { Factory, Warehouse, HardHat, Stethoscope, Building2, Store } from "lucide-react";
import img1 from "@/assets/use-cases/01-smart-factory.jpg";
import img2 from "@/assets/use-cases/02-warehouse-logistics.jpg";
import img3 from "@/assets/use-cases/03-field-engineer.jpg";
import img4 from "@/assets/use-cases/04-medical-healthcare.jpg";
import img5 from "@/assets/use-cases/05-smart-city.jpg";
import img6 from "@/assets/use-cases/06-retail-pos.jpg";

const cases = [
  {
    image: img1,
    icon: Factory,
    tag: "Smart Factory",
    title: "ควบคุมไลน์ผลิตแบบเรียลไทม์",
    desc: "Panel PC + Edge AI ติดหน้าเครื่อง CNC แสดง OEE / Production Dashboard ลด downtime ได้สูงสุด 40%",
    accent: "from-orange-500/20 to-amber-500/5",
  },
  {
    image: img2,
    icon: Warehouse,
    tag: "Warehouse & Logistics",
    title: "WMS + Barcode รวดเร็วทันใจ",
    desc: "Rugged Handheld สแกนพาเลทกลางคลังร้อน-เย็น เชื่อม WMS ตรงไม่หลุดสัญญาณ ลดงานเอกสาร 60%",
    accent: "from-blue-500/20 to-cyan-500/5",
  },
  {
    image: img3,
    icon: HardHat,
    tag: "Field Engineering",
    title: "ทำงานกลางฝน-โรงกลั่นได้สบาย",
    desc: "Rugged Tablet มาตรฐาน IP67 + MIL-STD-810H วิศวกรภาคสนามใช้ได้ทุกสภาพอากาศ ไม่กลัวพัง",
    accent: "from-slate-500/20 to-zinc-500/5",
  },
  {
    image: img4,
    icon: Stethoscope,
    tag: "Medical & Healthcare",
    title: "ห้องผ่าตัด-ICU ระดับ Medical Grade",
    desc: "Medical Panel PC ผ่าน EN60601-1 ใช้กับ PACS / EMR ในห้องผ่าตัด ทำความสะอาดได้ ปลอดเชื้อ",
    accent: "from-emerald-500/20 to-teal-500/5",
  },
  {
    image: img5,
    icon: Building2,
    tag: "Smart City & Surveillance",
    title: "ศูนย์ควบคุม CCTV หลายร้อยกล้อง",
    desc: "Industrial Mini PC + AI Inference วิเคราะห์ภาพจราจร / License Plate / Crowd Analytics 24/7",
    accent: "from-violet-500/20 to-indigo-500/5",
  },
  {
    image: img6,
    icon: Store,
    tag: "Retail & F&B POS",
    title: "POS / Self-Order Kiosk เสถียร 24/7",
    desc: "Touch Panel PC ทนการใช้งานหนักหน้าร้าน Fanless ไม่มีพัดลม ฝุ่นเข้าไม่ได้ อายุการใช้งาน 5+ ปี",
    accent: "from-rose-500/20 to-pink-500/5",
  },
];

const UpcUseCases = () => {
  return (
    <section className="py-14 md:py-16 bg-muted/30 border-y border-border">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="outline" className="mb-3 text-primary border-primary/30">
            Real-World Use Cases
          </Badge>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            งานหนักแค่ไหน <span className="text-primary">ENT Group</span> ทำให้เป็นเรื่องง่าย
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            6 อุตสาหกรรมที่ไว้ใจ Industrial Computer จาก ENT Group ในการขับเคลื่อนงานที่ยากที่สุด
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {cases.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.tag}
                className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={c.image}
                    alt={`${c.tag} — ${c.title}`}
                    width={1536}
                    height={1024}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${c.accent} mix-blend-overlay opacity-70`} />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm border border-border">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">{c.tag}</span>
                  </div>
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-display font-bold text-base md:text-lg mb-1.5 leading-tight group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcUseCases;

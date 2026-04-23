import { Badge } from "@/components/ui/badge";
import { Cctv, Cog, MonitorSmartphone, Plane, TrafficCone, Server, ArrowRight, Cpu } from "lucide-react";
import img1 from "@/assets/use-cases/01-highway-ai.jpg";
import img2 from "@/assets/use-cases/02-factory-automation.jpg";
import img3 from "@/assets/use-cases/03-traffic-signage.jpg";
import img4 from "@/assets/use-cases/04-airport-fids.jpg";
import img5 from "@/assets/use-cases/05-smart-intersection.jpg";
import img6 from "@/assets/use-cases/06-edge-ai-telecom.jpg";

type RecModel = { name: string; why: string };

const cases: Array<{
  image: string;
  icon: typeof Cctv;
  tag: string;
  title: string;
  desc: string;
  accent: string;
  models: RecModel[];
}> = [
  {
    image: img1,
    icon: Cctv,
    tag: "ITS Highway AI",
    title: "AI ตรวจจับรถ-ป้ายทะเบียน บนทางหลวง",
    desc: "Multi-LAN รับ IP Camera หลายตัวพร้อมกัน + Intel Gen 12 ประมวลผล LPR / Vehicle Counting แบบ Edge ลด Bandwidth ขึ้น Cloud",
    accent: "from-blue-500/20 to-cyan-500/5",
    models: [
      { name: "EPC-302E", why: "5× Intel LAN รับกล้องหลายตัว" },
      { name: "EPC-309E", why: "4× LAN + Edge AI Inference" },
    ],
  },
  {
    image: img2,
    icon: Cog,
    tag: "Factory Automation",
    title: "ควบคุมเครื่องจักรในไลน์ผลิต",
    desc: "DI/DO + Modbus เชื่อม PLC, Sensor และ Actuator + GPIO 12V/24V — Fanless ทนฝุ่น/น้ำมันในโรงงาน 24/7",
    accent: "from-orange-500/20 to-amber-500/5",
    models: [
      { name: "UPC-209B", why: "DI/DO + MOD BUS" },
      { name: "EPC-302A", why: "GPIO 12V/24V คุม Sensor" },
    ],
  },
  {
    image: img3,
    icon: TrafficCone,
    tag: "Smart VMS Signage",
    title: "ป้ายจราจรอัจฉริยะ (VMS) ริมทาง",
    desc: "Wide-temp -40~80°C ทนแดด/ฝนในตู้ริมทาง + 4G/SIM อัปเดตข้อความสดจากศูนย์ พร้อม Watchdog ป้องกันเครื่องค้าง",
    accent: "from-violet-500/20 to-indigo-500/5",
    models: [
      { name: "UPC-309C", why: "4G + SIM สำหรับ Outdoor" },
      { name: "UPC-309R", why: "Redundant DC ห้ามดับ" },
    ],
  },
  {
    image: img4,
    icon: Plane,
    tag: "Airport FIDS",
    title: "ป้ายแสดงตารางบินสนามบิน",
    desc: "Dual HDMI + EDID Emulation รองรับ Display Wall และ Digital Signage — Fanless ฝังหลังจอ ใช้งานต่อเนื่องไม่มีเสียง ไม่มีพัดลมเสีย",
    accent: "from-sky-500/20 to-blue-500/5",
    models: [
      { name: "CTN-102C", why: "2× HDMI + EDID Signage" },
      { name: "EPC-102B", why: "Fanless + Smart Fan สำรอง" },
    ],
  },
  {
    image: img5,
    icon: MonitorSmartphone,
    tag: "Smart Intersection",
    title: "ตู้ควบคุมไฟจราจร & CCTV",
    desc: "Industrial-grade ทนสภาพแวดล้อมในตู้ริมถนน + Multi-COM Port เชื่อมตู้ Signal Controller + Wide Voltage 9–36V",
    accent: "from-emerald-500/20 to-teal-500/5",
    models: [
      { name: "EPC-202B", why: "8× COM Port คุมตู้ Signal" },
      { name: "EPC-309E", why: "4× LAN + AI License Plate" },
    ],
  },
  {
    image: img6,
    icon: Server,
    tag: "Edge AI / Telecom",
    title: "Edge Server ในตู้สื่อสาร 5G",
    desc: "Intel Gen 12 ประสิทธิภาพสูง + Multi-LAN สำหรับ MEC (Multi-access Edge Computing) — ติดตั้งใน Base Station ใกล้ผู้ใช้ ลด Latency",
    accent: "from-slate-500/20 to-zinc-500/5",
    models: [
      { name: "EPC-302E", why: "5× Intel LAN Network Appliance" },
      { name: "UPC-302D", why: "Multi-USB + 2× LAN" },
    ],
  },
];

const scrollToModel = (_name: string) => {
  const el = document.getElementById("models");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

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
            6 อุตสาหกรรมที่ไว้ใจ Industrial Computer จาก ENT Group ในการขับเคลื่อนงานที่ยากที่สุด — พร้อมรุ่นแนะนำสำหรับแต่ละงาน
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {cases.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.tag}
                className="group relative rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col"
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
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-base md:text-lg mb-1.5 leading-tight group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4">{c.desc}</p>

                  <div className="mt-auto pt-3 border-t border-border/70">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Cpu className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        รุ่นแนะนำ
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {c.models.map((m) => (
                        <button
                          key={m.name}
                          type="button"
                          onClick={() => scrollToModel(m.name)}
                          className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md bg-secondary/50 hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all text-left group/btn"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Badge className="text-[10px] bg-primary text-primary-foreground border-0 shrink-0 font-mono">
                              {m.name}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground truncate">{m.why}</span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-muted-foreground group-hover/btn:text-primary group-hover/btn:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
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

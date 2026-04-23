import { Shield, Droplets, HardHat, Zap, TrendingDown } from "lucide-react";
import img01 from "@/assets/rugged-story/01-milspec.png";
import img02 from "@/assets/rugged-story/02-waterproof.png";
import img03 from "@/assets/rugged-story/03-fieldwork.png";
import img04 from "@/assets/rugged-story/04-droptest.png";
import img05 from "@/assets/rugged-story/05-comparison.png";

const stories = [
  {
    image: img01,
    icon: Shield,
    tag: "MIL-STD-810H",
    titleTH: "โน้ตบุ๊กเกรดทหาร",
    titleEN: "Military Grade",
    desc: "ผ่านมาตรฐานทหารสหรัฐฯ ทดสอบความทนทาน 29 ด้าน — ฝุ่น ความชื้น แรงสั่นสะเทือน อุณหภูมิสุดขั้ว",
    accent: "from-orange-500/20 to-amber-500/5",
  },
  {
    image: img02,
    icon: Droplets,
    tag: "IP65 / IP67",
    titleTH: "กันน้ำ กันฝุ่น ทุกสภาพอากาศ",
    titleEN: "Weatherproof",
    desc: "ฝนตก พายุ หรือฝุ่นในโรงงาน ใช้งานได้ต่อเนื่อง ไม่ต้องห่วงว่าเครื่องจะพัง",
    accent: "from-blue-500/20 to-cyan-500/5",
  },
  {
    image: img03,
    icon: HardHat,
    tag: "Field Engineer",
    titleTH: "ใช้งานภาคสนามไม่กลัวพัง",
    titleEN: "Built for the Field",
    desc: "วิศวกรภาคสนาม โรงงาน เหมือง โลจิสติกส์ — เครื่องเดียวจบทุกหน้างาน Intel Core i7 + SSD",
    accent: "from-orange-500/20 to-red-500/5",
  },
  {
    image: img04,
    icon: Zap,
    tag: "Drop Test 1.5m",
    titleTH: "ทนกระแทก ตกแล้วยังใช้ได้",
    titleEN: "Shock Resistant",
    desc: "ทดสอบการตกจากความสูง 1.5 เมตรลงพื้นคอนกรีต ยังคงใช้งานได้ปกติ — ไม่ใช่แค่ทน แต่พร้อมลุย",
    accent: "from-slate-500/20 to-zinc-500/5",
  },
  {
    image: img05,
    icon: TrendingDown,
    tag: "5 Year ROI",
    titleTH: "ลงทุนครั้งเดียว ใช้ยาว 5 ปี+",
    titleEN: "Long-term Value",
    desc: "เลิกซื้อโน้ตบุ๊กบ่อยๆ — Rugged Notebook คุ้มกว่าระยะยาว ลด Downtime ลดค่าซ่อม",
    accent: "from-emerald-500/20 to-teal-500/5",
  },
];

const RuggedStorySection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-xs font-mono text-primary tracking-[0.2em] mb-2">WHY RUGGED ?</p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
          ทำไมต้อง <span className="text-primary">Rugged Notebook</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          5 เหตุผลที่ทีมวิศวกร โรงงาน และธุรกิจระดับองค์กรเลือกใช้
        </p>
      </div>

      <div className="space-y-6">
        {stories.map((s, i) => {
          const Icon = s.icon;
          const reverse = i % 2 === 1;
          return (
            <div
              key={s.tag}
              className={`group relative grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-all duration-500 ${
                reverse ? "md:[direction:rtl]" : ""
              }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden bg-muted">
                <img
                  src={s.image}
                  alt={s.titleTH}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} mix-blend-overlay opacity-60`} />
              </div>

              {/* Text */}
              <div className="p-6 md:p-10 flex flex-col justify-center [direction:ltr]">
                <div className="inline-flex items-center gap-2 mb-4 self-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-primary px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                    {s.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider mb-1">
                  {s.titleEN}
                </p>
                <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-3 leading-tight">
                  {s.titleTH}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
                <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground/60 font-mono">
                  <span className="w-8 h-px bg-primary/40" />
                  0{i + 1} / 05
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RuggedStorySection;

import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Cpu, Zap, Sun } from "lucide-react";
import nbMaster from "@/assets/ads/rugged-nb-master.png";
import nbDrop from "@/assets/ads/rugged-nb-drop.png";
import nbLineup from "@/assets/ads/rugged-nb-lineup.png";
import nbX14A from "@/assets/ads/rugged-nb-x14a.png";
import nbX14M from "@/assets/ads/rugged-nb-x14m.png";
import nbX15A from "@/assets/ads/rugged-nb-x15a.png";

const MODELS = [
  {
    img: nbX14A,
    to: "/rugged-notebook/em-x14a",
    tag: "PORTABLE i7",
    title: "EM-X14A",
    caption: '14" Intel i7 + Thunderbolt 4 — Hot-Swap Battery, 1000 nits',
  },
  {
    img: nbX14M,
    to: "/rugged-notebook/em-x14m",
    tag: "AI PC",
    title: "EM-X14M",
    caption: "Intel Core Ultra + Arc GPU + NPU — AI PC ตัวแรกของวงการ Rugged",
  },
  {
    img: nbX15A,
    to: "/rugged-notebook/em-x15a",
    tag: "BIG SCREEN",
    title: "EM-X15A",
    caption: '15.6" FHD 1000 nits — IP65, Hot-Swap, Drop 1.5m สำหรับ CAD/SCADA',
  },
];

const RuggedNotebookShowcase = () => {
  return (
    <section className="relative py-12 bg-gradient-to-b from-background via-primary/5 to-background border-y border-border overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-3">
            <Sparkles className="w-3 h-3" /> Rugged Notebook Showcase
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-foreground leading-tight">
            โน้ตบุ๊กเกรดทหาร <span className="text-primary">พร้อมลุยทุกหน้างาน</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base">
            MIL-STD-810H · IP65 · Drop 1.5m — เลือกตัวที่ใช่จาก 3 รุ่นเด่น สำหรับวิศวกร / ภาคสนาม / Smart Factory
          </p>
        </div>

        {/* Bento Layout: 3 ภาพ 2 แถว — ประหยัดพื้นที่แต่ดูพรีเมียม */}
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-6">
          {/* Row 1: Master ใหญ่ 2/3 + Drop 1/3 */}
          <div className="md:col-span-2 relative rounded-3xl overflow-hidden border border-border shadow-2xl group bg-card">
            <img
              src={nbMaster}
              alt="Rugged Notebook โน้ตบุ๊กเกรดทหาร MIL-STD-810H IP65 Drop 1.5m"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/95 via-background/50 to-transparent">
              <div className="text-[10px] font-bold tracking-widest text-primary">FLAGSHIP LINEUP</div>
              <div className="text-base md:text-xl font-display font-bold text-foreground">
                Intel Core i7 · ROI 5 ปีขึ้นไป
              </div>
              <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                ออกแบบมาเพื่อภาคสนาม โรงงาน และวิศวกรที่ต้องการเครื่องคู่ใจในทุกสภาพแวดล้อม
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl group bg-card">
            <img
              src={nbDrop}
              alt="Drop Test 1.5m, MIL-STD-810H, IP65"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/95 via-background/50 to-transparent">
              <div className="text-[10px] font-bold tracking-widest text-primary">DROP 1.5M</div>
              <div className="text-sm font-display font-bold text-foreground leading-tight">
                ตกได้ ตกแล้วยังใช้ได้
              </div>
            </div>
          </div>

          {/* Row 2: Lineup เต็มความกว้าง */}
          <div className="md:col-span-3 relative rounded-3xl overflow-hidden border border-border shadow-2xl group bg-card">
            <img
              src={nbLineup}
              alt="เลือกรุ่นที่ใช่ — Rugged Notebook 3 รุ่นเด่น EM-X14A, EM-X14M, EM-X15A"
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-background/90 via-background/30 to-transparent">
              <div className="text-[10px] font-bold tracking-widest text-primary">CHOOSE YOUR FIT</div>
              <div className="text-sm md:text-base font-display font-bold text-foreground">
                3 รุ่นเด่น — เลือกตัวที่ใช่สำหรับงานของคุณ
              </div>
            </div>
          </div>
        </div>

        {/* รุ่นเด่น — Compact text links (ไม่มีภาพ ประหยัดพื้นที่) */}
        <div className="grid md:grid-cols-3 gap-3 max-w-5xl mx-auto">
          {MODELS.map((m) => (
            <Link
              key={m.title}
              to={m.to}
              className="group relative p-4 rounded-2xl border border-border bg-card hover:border-primary/60 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold tracking-widest text-primary">{m.tag}</div>
                  <div className="font-display font-black text-foreground text-base md:text-lg">
                    {m.title}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.caption}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick benefits */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {[
            { icon: Shield, text: "MIL-STD-810H + IP65" },
            { icon: Cpu, text: "Intel i7 / Core Ultra + NPU" },
            { icon: Sun, text: "1000 nits Sunlight Readable" },
            { icon: Zap, text: "Hot-Swap Battery / Drop 1.5m" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border"
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs md:text-sm font-medium text-foreground">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RuggedNotebookShowcase;

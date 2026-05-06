import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Factory, Monitor, Droplets, Cpu, Tv2, Sparkles, TrendingDown, Zap } from "lucide-react";
import economyMaster from "@/assets/ads/economy2026-hero-v2.png";
import imgFirewall from "@/assets/hero-firewall.jpg";
import imgPanelPC from "@/assets/product-panel-pc.jpg";
import imgVCloud from "@/assets/product-vcloudpoint.jpg";
import imgWaterproof from "@/assets/waterproof-pc-banner.jpg";
import imgJetson from "@/assets/ads/jetson-privateai.jpg";
import imgKiosk from "@/assets/kiosk-banner.jpg";

const solutions = [
  { icon: ShieldCheck, img: imgFirewall, label: "Firewall SME", desc: "หยุด Ransomware ตั้งแต่ขอบเครือข่าย", to: "/mini-pc-firewall", accent: "from-emerald-500/30 to-emerald-500/5" },
  { icon: Factory, img: imgPanelPC, label: "Panel PC โรงงาน", desc: "ทัชสกรีน IP65 ทนฝุ่นทนน้ำ", to: "/panel-pc-gtg", accent: "from-sky-500/30 to-sky-500/5" },
  { icon: Monitor, img: imgVCloud, label: "vCloudPoint", desc: "ลด PC 70% รวมศูนย์ง่าย", to: "/vcloudpoint", accent: "from-violet-500/30 to-violet-500/5" },
  { icon: Droplets, img: imgWaterproof, label: "Waterproof PC", desc: "IP69K ล้างน้ำได้ ครัว/อาหาร", to: "/waterproof-pc", accent: "from-cyan-500/30 to-cyan-500/5" },
  { icon: Cpu, img: imgJetson, label: "Jetson AI", desc: "Edge AI สำหรับ Vision/IoT", to: "/jetson-ai", accent: "from-amber-500/30 to-amber-500/5" },
  { icon: Tv2, img: imgKiosk, label: "KIOSK Self-Service", desc: "ลดคิว ลดต้นทุนแรงงาน", to: "/interactive-display", accent: "from-rose-500/30 to-rose-500/5" },
];

const Economy2026Banner = () => {
  return (
    <section className="relative overflow-hidden bg-[#05080f] py-14 md:py-20">
      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.15),transparent_60%)]" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Header + Hero (กระชับ — 2 คอลัมน์) */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center mb-8 md:mb-10">
          {/* ซ้าย: ข้อความ */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary">Economy 2026 Edition</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white leading-tight">
              6 โซลูชันรับ <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">เศรษฐกิจไทย 2026</span>
            </h2>
            <p className="text-white/70 mt-3 text-sm md:text-base max-w-2xl mx-auto lg:mx-0">
              ลดต้นทุน • หยุดภัยไซเบอร์ • เพิ่ม Productivity — ครบในที่เดียวจาก ENT Group
            </p>

            {/* benefit chips */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-5">
              {[
                { icon: TrendingDown, text: "ลดต้นทุน IT" },
                { icon: ShieldCheck, text: "หยุด Ransomware" },
                { icon: Zap, text: "เพิ่ม Productivity" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.text} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs">
                    <Icon className="w-3 h-3 text-primary" />
                    {c.text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ขวา: ภาพย่อ */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] group max-w-md mx-auto lg:max-w-none lg:ml-auto">
              <img
                src={economyMaster}
                alt="6 โซลูชันรับเศรษฐกิจไทย 2026 — ENT Group"
                className="w-full h-auto group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#05080f]/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-[10px] font-bold tracking-widest uppercase text-primary-foreground">
                <Sparkles className="w-3 h-3" /> 2026
              </div>
            </div>
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {solutions.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.label}
                to={s.to}
                className="group relative rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/50 hover:bg-white/[0.06] transition-all backdrop-blur-sm overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#05080f]">
                  <img
                    src={s.img}
                    alt={s.label}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] via-[#05080f]/30 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="absolute top-2 left-2 w-9 h-9 rounded-xl bg-primary/90 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Icon className="w-4.5 h-4.5 text-primary-foreground" />
                  </div>
                </div>
                {/* Text */}
                <div className="relative z-10 p-3 md:p-4">
                  <div className="font-display font-bold text-white text-sm md:text-base mb-1">{s.label}</div>
                  <div className="text-[11px] md:text-xs text-white/60 leading-snug mb-2.5">{s.desc}</div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:gap-2 transition-all">
                    ดูรายละเอียด <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Strip */}
        <div className="mt-8 md:mt-10 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-sm p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="text-white font-display font-bold text-lg md:text-xl">ปรึกษาวิศวกรไทยฟรี</div>
            <div className="text-white/60 text-xs md:text-sm mt-0.5">ออกแบบโซลูชันรับเศรษฐกิจ 2026 ให้ธุรกิจคุณ — ตอบกลับใน 24 ชม.</div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            >
              ติดต่อทีมงาน <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:020456104"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white border border-white/20 font-bold text-sm hover:bg-white/15 transition-colors"
            >
              02-045-6104
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Economy2026Banner;

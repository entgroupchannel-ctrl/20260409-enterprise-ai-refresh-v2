import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Cpu, Droplets, Monitor, Boxes, Box } from "lucide-react";
import heroStones from "@/assets/m4-avengers-hero-stones.jpg";
import imgCaptainGTG from "@/assets/ads/m4-avengers-1-captain-gtg.jpg";
import imgGuardianWP from "@/assets/ads/m4-avengers-4-guardian-outdoor.jpg";
import imgDefenderGK from "@/assets/ads/m4-avengers-2-defender-gk.jpg";
import imgStrategistUPC from "@/assets/ads/m4-avengers-5-strategist-epc.jpg";
import imgScoutEPC from "@/assets/ads/m4-avengers-3-scout-touchwork.jpg";

/**
 * Industrial Avengers — Homepage banner
 * นำเสนอ 5 ฮีโร่ Industrial PC ที่มีจำหน่ายอยู่แล้ว ลิงก์ไปหน้าสินค้าจริง
 */
const heroes = [
  {
    code: "GTG",
    name: "Captain GTG",
    title: "Panel PC GTG/GTY",
    desc: "Panel PC จอใหญ่ ทนงานหนัก",
    href: "/panel-pc-gtg",
    icon: Monitor,
    img: imgCaptainGTG,
    accent: "blue",
    glow: "shadow-[0_0_40px_-8px_rgba(59,130,246,0.6)]",
    border: "border-blue-500/40",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  {
    code: "WP",
    name: "Guardian Waterproof",
    title: "Waterproof PC IP69K",
    desc: "ทนน้ำ ทนฝุ่น ทนแรงฉีดน้ำ",
    href: "/waterproof-pc",
    icon: Droplets,
    img: imgGuardianWP,
    accent: "cyan",
    glow: "shadow-[0_0_40px_-8px_rgba(34,211,238,0.6)]",
    border: "border-cyan-500/40",
    badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  },
  {
    code: "GK",
    name: "Defender GK",
    title: "GK Series Panel PC",
    desc: "Panel PC ครบไลน์ สั่งง่าย",
    href: "/gk-series",
    icon: Cpu,
    img: imgDefenderGK,
    accent: "emerald",
    glow: "shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)]",
    border: "border-emerald-500/40",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  {
    code: "UPC",
    name: "Strategist UPC",
    title: "UPC Series — LEGO Modular",
    desc: "ต่อขยายได้ ปรับได้ตามงาน",
    href: "/upc-series",
    icon: Boxes,
    img: imgStrategistUPC,
    accent: "amber",
    glow: "shadow-[0_0_40px_-8px_rgba(245,158,11,0.6)]",
    border: "border-amber-500/40",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  {
    code: "EPC",
    name: "Scout EPC",
    title: "EPC Panel PC Series",
    desc: "Edge Panel PC จิ๋วแต่แจ๋ว",
    href: "/epc-series",
    icon: Box,
    img: imgScoutEPC,
    accent: "violet",
    glow: "shadow-[0_0_40px_-8px_rgba(139,92,246,0.6)]",
    border: "border-violet-500/40",
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  },
];

const IndustrialAvengersBanner = () => {
  return (
    <section className="relative overflow-hidden bg-[#05080f]">
      {/* Background hero image */}
      <div className="absolute inset-0">
        <img
          src={heroStones}
          alt="Industrial Avengers — 5 Infinity Stones"
          className="w-full h-full object-cover opacity-60"
          loading="lazy"
          width={1920}
          height={832}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05080f]/80 via-[#05080f]/40 to-[#05080f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080f] via-transparent to-[#05080f]/50" />
      </div>

      <div className="relative container max-w-7xl mx-auto px-4 py-16 md:py-20">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-cyan-300 border border-cyan-400/30 bg-cyan-500/10 mb-4">
            <Sparkles size={12} /> INDUSTRIAL AVENGERS — 5 INFINITY STONES
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight mb-3">
            รวมพลัง <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-violet-300">5 ฮีโร่อุตสาหกรรม</span>
            <br className="hidden md:block" /> สู่โรงงานอัจฉริยะของคุณ
          </h2>
          <p className="text-white/70 md:text-lg max-w-2xl">
            Panel PC · Waterproof · GK · UPC · EPC — ครอบคลุมทุก Use Case ในไลน์ผลิต
            มีจำหน่ายแล้ววันนี้ที่ ENT Group พร้อมส่ง รับประกัน 1–3 ปี
          </p>
        </div>

        {/* 5 Hero Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {heroes.map((h) => {
            const Icon = h.icon;
            return (
              <Link
                key={h.code}
                to={h.href}
                className={`group relative rounded-2xl p-5 bg-white/[0.04] backdrop-blur-md border ${h.border} hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300 ${h.glow} hover:shadow-[0_0_50px_-4px_rgba(255,255,255,0.15)]`}
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${h.border} ${h.badge} mb-3`}>
                  <Icon size={20} />
                </div>
                <div className="text-[10px] font-bold tracking-widest text-white/50 mb-1">
                  {h.code} STONE
                </div>
                <h3 className="font-display font-bold text-white text-base leading-tight mb-1">
                  {h.name}
                </h3>
                <p className="text-xs text-white/70 mb-1 leading-snug">{h.title}</p>
                <p className="text-[11px] text-white/50 leading-snug">{h.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-white/90 group-hover:gap-2 group-hover:text-white transition-all">
                  ดูรายละเอียด <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
          <Link
            to="/mini-pc"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-[#05080f] font-bold text-sm hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-[0_0_30px_-4px_rgba(34,211,238,0.5)]"
          >
            <Sparkles size={16} /> ดูทั้งหมด 5 ฮีโร่ใน M4 Series
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-all"
          >
            ปรึกษาทีมวิศวกร <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IndustrialAvengersBanner;

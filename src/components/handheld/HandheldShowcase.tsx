import { Sparkles, Battery, ShieldCheck, ScanLine, Droplets, Tablet, Smartphone } from "lucide-react";
import imgMaster from "@/assets/ads/handheld-master.png";
import imgBattery from "@/assets/ads/handheld-battery.png";
import imgDrop from "@/assets/ads/handheld-drop.png";
import imgScan from "@/assets/ads/handheld-scan.png";
import imgWaterproof from "@/assets/ads/handheld-waterproof.png";
import imgTablet from "@/assets/ads/handheld-tablet.png";

const TOP = [
  {
    img: imgMaster,
    icon: Smartphone,
    tag: "FULL LINEUP",
    title: "Rugged Handheld ครบทุกขนาด",
    caption: "สมาร์ทโฟน · PDA · Tablet 8\"–10.1\" รองรับ Android & Windows",
  },
  {
    img: imgBattery,
    icon: Battery,
    tag: "HOT-SWAP BATTERY",
    title: "แบตอึด ใช้ทั้งวัน",
    caption: "ถอดเปลี่ยนได้ Hot-Swap · ใช้ต่อเนื่อง 12+ ชม. ไม่ต้องชาร์จระหว่างกะ",
  },
  {
    img: imgDrop,
    icon: ShieldCheck,
    tag: "MIL-STD-810G",
    title: "กันกระแทก ตกได้ 1.5 เมตร",
    caption: "ผ่านมาตรฐานทหาร MIL-STD-810G ตกแล้วยังใช้ได้ทันที",
  },
];

const BOTTOM = [
  {
    img: imgScan,
    icon: ScanLine,
    tag: "ALL-IN-ONE SCAN",
    title: "สแกนบาร์โค้ด & RFID ในเครื่องเดียว",
    caption: "2D Scanner · NFC · UHF RFID — ลดเครื่องซ้ำซ้อน เพิ่มความเร็วในการทำงาน",
  },
  {
    img: imgWaterproof,
    icon: Droplets,
    tag: "IP68 WATERPROOF",
    title: "กันน้ำ ใช้งานในฝนได้",
    caption: "หน้าจอสัมผัสได้แม้เปียก ทนละอองน้ำ-ฝุ่นโรงงานเต็มรูปแบบ",
  },
  {
    img: imgTablet,
    icon: Tablet,
    tag: "RUGGED TABLET",
    title: "Rugged Tablet ทนทุกสภาพ",
    caption: "IP65–IP68 · MIL-STD-810G · กันน้ำ กันกระแทก สำหรับงานหน้างาน",
  },
];

const Card = ({ item }: { item: typeof TOP[number] }) => {
  const Icon = item.icon;
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#05080f]">
        <img
          src={item.img}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-2 left-2 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/90 backdrop-blur-md border border-white/20 shadow-lg">
          <Icon className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      <div className="p-4">
        <div className="text-[10px] font-bold tracking-widest text-primary mb-1">{item.tag}</div>
        <div className="font-display font-bold text-foreground text-sm md:text-base leading-tight">
          {item.title}
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-snug">{item.caption}</p>
      </div>
    </div>
  );
};

const HandheldShowcase = () => {
  return (
    <section className="relative py-12 bg-gradient-to-b from-background via-primary/5 to-background border-y border-border overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-3">
            <Sparkles className="w-3 h-3" /> Rugged Handheld Showcase
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-foreground leading-tight">
            แข็งแกร่งทุกหน้างาน <span className="text-primary">พร้อมลุยทุกสภาพ</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base">
            IP65–IP68 · MIL-STD-810G · Hot-Swap Battery · 2D/NFC/UHF RFID — ครบในเครื่องเดียว
          </p>
        </div>

        {/* Top: 3 ภาพ */}
        <div className="grid md:grid-cols-3 gap-4 mb-4 max-w-6xl mx-auto">
          {TOP.map((item) => (
            <Card key={item.title} item={item} />
          ))}
        </div>

        {/* Bottom: 3 ภาพ */}
        <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {BOTTOM.map((item) => (
            <Card key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HandheldShowcase;

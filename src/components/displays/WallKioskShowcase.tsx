import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Monitor, Shield, Zap, Layers } from "lucide-react";
import wallkioskMaster from "@/assets/ads/wallkiosk-master.png";
import wallkiosk156 from "@/assets/ads/wallkiosk-156.png";
import wallkiosk215 from "@/assets/ads/wallkiosk-215.png";
import wallkiosk238 from "@/assets/ads/wallkiosk-238.png";
import wallkiosk32 from "@/assets/ads/wallkiosk-32.png";
import wallkioskLineup from "@/assets/ads/wallkiosk-lineup.png";

type SizeKey = 156 | 215 | 238 | 32;

const SIZE_MAP: Record<SizeKey, {
  label: string;
  image: string;
  to: string;
  tag: string;
  caption: string;
}> = {
  156: {
    label: '15.6"',
    image: wallkiosk156,
    to: "/products/displays-15.6",
    tag: "COMPACT & SMART",
    caption: "เริ่มต้นง่าย ติดตั้งไว — เหมาะ Self Check-in",
  },
  215: {
    label: '21.5"',
    image: wallkiosk215,
    to: "/products/displays-21.5",
    tag: "BEST VALUE",
    caption: "GD215C Portrait — FHD PCAP 10-touch + Android",
  },
  238: {
    label: '23.8"',
    image: wallkiosk238,
    to: "/products/displays-23.8",
    tag: "PORTRAIT 9:16",
    caption: "ขอบจอบาง 13mm สไตล์ iPad — Square POS Ready",
  },
  32: {
    label: '32"',
    image: wallkiosk32,
    to: "/products/displays-32",
    tag: "PREMIUM",
    caption: "GD32C — Mohs 7 กระจกกันรอย เหมาะ Banking / Brand Store",
  },
};

const ORDER: SizeKey[] = [156, 215, 238, 32];

interface Props {
  currentSize: SizeKey;
}

const WallKioskShowcase = ({ currentSize }: Props) => {
  const others = ORDER.filter((s) => s !== currentSize);

  return (
    <section className="relative py-12 -mx-6 px-6 bg-gradient-to-b from-background via-primary/5 to-background border-y border-border overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-3">
            <Sparkles className="w-3 h-3" /> Wall Mount Touch Kiosk
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-foreground leading-tight">
            ตู้คีออสก์แขวนผนัง <span className="text-primary">15.6" – 32"</span> เลือกขนาดที่ใช่
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base">
            จอสัมผัส PCAP 10 จุด + Android POS Ready — เหมาะ Self Check-in, POS, Queue, Brand Store, Banking
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl mb-6 group bg-card max-w-3xl mx-auto">
          <img
            src={wallkioskMaster}
            alt='Wall Mount Touch Kiosk ครบทุกขนาด 15.6" - 32"'
            className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
            loading="lazy"
          />
          <div
            className="absolute bottom-[3%] right-[2%] w-[14%] h-[10%] rounded-md backdrop-blur-md"
            style={{ background: "linear-gradient(135deg, rgba(180,180,180,0.55), rgba(140,140,140,0.35))" }}
            aria-hidden
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6 max-w-5xl mx-auto">
          {others.map((s) => {
            const it = SIZE_MAP[s];
            return (
              <Link
                key={s}
                to={it.to}
                className="group relative rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all bg-card"
              >
                <div className="overflow-hidden">
                  <img
                    src={it.image}
                    alt={`Wall Kiosk ${it.label} - ${it.caption}`}
                    className="w-full h-auto group-hover:scale-[1.05] transition-transform duration-700"
                    loading="lazy"
                  />
                  <div
                    className="absolute bottom-[10%] right-[3%] w-[18%] h-[10%] rounded-md backdrop-blur-md"
                    style={{ background: "linear-gradient(135deg, rgba(30,30,30,0.55), rgba(15,15,15,0.4))" }}
                    aria-hidden
                  />
                </div>
                <div className="p-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest text-primary">{it.tag}</div>
                      <div className="font-display font-bold text-foreground text-sm md:text-base">
                        Wall Kiosk {it.label}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{it.caption}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl group bg-card max-w-3xl mx-auto">
          <img
            src={wallkioskLineup}
            alt='Wall Mount Touch Kiosk - PCAP 10-touch / Android POS Ready / Industrial 24/7'
            className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
            loading="lazy"
          />
          <div
            className="absolute bottom-[3%] right-[2%] w-[14%] h-[10%] rounded-md backdrop-blur-md"
            style={{ background: "linear-gradient(135deg, rgba(120,90,60,0.55), rgba(80,60,40,0.4))" }}
            aria-hidden
          />
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Monitor, text: "PCAP 10-point Touch" },
            { icon: Layers, text: "Android RK3568 / RK3588" },
            { icon: Shield, text: "Mohs 7 / Industrial 24/7" },
            { icon: Zap, text: "Square / Stripe POS Ready" },
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

export default WallKioskShowcase;

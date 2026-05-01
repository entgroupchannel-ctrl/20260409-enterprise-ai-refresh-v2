import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import ad01 from "@/assets/ads/volktek-ad-01-launch-hero-light.jpg";
import ad02 from "@/assets/ads/volktek-ad-02-metro-ethernet-light.jpg";
import ad03 from "@/assets/ads/volktek-ad-03-industrial-rugged-light.jpg";
import ad04 from "@/assets/ads/volktek-ad-04-poe-switch.jpg";
import ad05 from "@/assets/ads/volktek-ad-05-full-lineup-light.jpg";

/**
 * Marketing Strip — โชว์ภาพแอด 5 ภาพในรูปแบบ scrollable gallery
 * ใช้บนหน้า /volktek เพื่อเสริม visual storytelling
 */

const ADS = [
  { src: ad01, alt: "เปิดตัวเว็บไซต์ใหม่ ENT Group × Volktek Networks", caption: "เปิดตัวเว็บไซต์ใหม่" },
  { src: ad02, alt: "Layer 3 Metro Ethernet — Volktek MEN-6412", caption: "Layer 3 Metro Ethernet" },
  { src: ad03, alt: "Industrial Switch ทนทุกสภาพแวดล้อม", caption: "Industrial Rugged Series" },
  { src: ad04, alt: "PoE+ Switch จ่ายไฟและส่งข้อมูลสายเดียว", caption: "PoE+ All-in-One" },
  { src: ad05, alt: "โซลูชันเครือข่าย Volktek ครบวงจร", caption: "Complete Network Solutions" },
];

export default function VolktekMarketingStrip() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + ADS.length) % ADS.length);
  const next = () => setActive((i) => (i + 1) % ADS.length);

  return (
    <section className="card-surface overflow-hidden">
      <div className="p-6 md:p-8 border-b border-border">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-primary mb-2">
              <Sparkles size={12} /> Featured Campaigns
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              เปิดตัว <span className="text-gradient">Volktek Networks</span> ที่ ENT Group
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              5 แคมเปญสื่อสารหลักของ Volktek ในประเทศไทย — Layer 3, Industrial, PoE+, SFP / Media Converter พร้อมจำหน่ายและบริการครบวงจร
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="ก่อนหน้า"
              className="h-9 w-9 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-muted-foreground tabular-nums min-w-[3ch] text-center">
              {active + 1}/{ADS.length}
            </span>
            <button
              onClick={next}
              aria-label="ถัดไป"
              className="h-9 w-9 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Featured large image */}
      <div className="relative bg-muted aspect-square sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        {ADS.map((ad, i) => (
          <img
            key={ad.src}
            src={ad.src}
            alt={ad.alt}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              i === active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        ))}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border text-xs font-semibold text-foreground shadow-sm">
            {ADS[active].caption}
          </span>
        </div>
      </div>

      {/* Thumbnail row */}
      <div className="p-4 md:p-6 bg-muted/30 border-t border-border">
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {ADS.map((ad, i) => (
            <button
              key={ad.src}
              onClick={() => setActive(i)}
              aria-label={`ดู ${ad.caption}`}
              className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                i === active
                  ? "border-primary shadow-md scale-[1.02]"
                  : "border-transparent hover:border-primary/40 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={ad.src}
                alt={ad.alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

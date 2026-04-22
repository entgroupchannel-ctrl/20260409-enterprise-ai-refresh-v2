import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import thaiPattern from "@/assets/thai-suphannahong-pattern.png";
import edgeAi1 from "@/assets/edge-ai-hero-1.jpg";
import edgeAi2 from "@/assets/edge-ai-hero-2.jpg";
import edgeAi3 from "@/assets/edge-ai-hero-3.jpg";

const slides = [
  { src: edgeAi1, alt: "NVIDIA Jetson Module กับหุ่นยนต์ AI — ENT GROUP", caption: "โมดูล NVIDIA Jetson พร้อมระบบ AI อัจฉริยะ" },
  { src: edgeAi2, alt: "Edge AI ในโรงงานอุตสาหกรรม — ENT GROUP", caption: "ระบบ Edge AI สำหรับโรงงานอัตโนมัติ" },
  { src: edgeAi3, alt: "AI Command Center กับ NVIDIA Jetson — ENT GROUP", caption: "ศูนย์ควบคุม AI อัจฉริยะครบวงจร" },
];

const EdgeAISection = () => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isHovered, next]);

  return (
    <section className="section-padding relative overflow-hidden" id="edge-ai">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] dark:opacity-[0.08]"
        style={{
          backgroundImage: `url(${thaiPattern})`,
          backgroundSize: "420px",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-[hsl(40,55%,55%)]/[0.03] pointer-events-none" />

      <div className="container max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">
              NVIDIA Jetson Partner
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
              โซลูชัน Edge AI <span className="text-gradient">สำหรับประเทศไทย</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              อีเอ็นที กรุ๊ป พันธมิตรธุรกิจที่คุณไว้วางใจขอนำเสนอ โมดูล, ชุดพัฒนา และคอมพิวเตอร์อุตสาหกรรม — ขับเคลื่อนด้วยแพลตฟอร์ม NVIDIA Jetson
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/nvidia-jetson"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                ดูหน้า NVIDIA Jetson <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop?category=jetson"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-surface-hover transition-colors"
              >
                ดูสินค้าทั้งหมด
              </Link>
            </div>
          </div>

          <div
            className="relative group"

            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="card-surface rounded-2xl overflow-hidden relative aspect-[4/3]"

              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchMove={(e) => {
                touchEndX.current = e.touches[0].clientX;
              }}
              onTouchEnd={() => {
                const diff = touchStartX.current - touchEndX.current;
                if (Math.abs(diff) > 50) {
                  diff > 0 ? next() : prev();
                }
              }}>
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: i === current ? 1 : 0,
                    transform: i === current ? "scale(1)" : "scale(1.05)",
                  }}>
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={1024}
                    height={768}
                   decoding="async"/>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-10">
                    <p className="text-white text-sm font-medium">{slide.caption}</p>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 border border-border/50 flex items-center justify-center text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background"
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 border border-border/50 flex items-center justify-center text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background"
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EdgeAISection;


import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Display32 } from "@/data/displays-32";

export interface SuggestedDisplay {
  /** ขนาดจอเป็นนิ้ว เช่น "27"" / "32"" */
  sizeLabel: string;
  /** ขนาดเชิงตัวเลขเพื่อคำนวณ "ระยะห่าง" จาก current group */
  sizeNumeric: number;
  /** Path สำหรับ Link เช่น /products/displays-27?model=hd27 */
  href: string;
  product: Display32;
  /** Tag สั้นๆ เช่น "Wall Kiosk", "Touch Display" */
  formFactor?: string;
}

interface YouMayAlsoLikeProps {
  /** ขนาดจอปัจจุบัน (เช่น 238 = 23.8") */
  currentSizeNumeric: number;
  /** ตัวเลือกในกลุ่มเดียวกันที่ "ไม่ใช่" รุ่นปัจจุบัน เพื่อแนะนำ */
  candidates: SuggestedDisplay[];
  /** จำนวนรุ่นที่จะแสดง (default 4) */
  limit?: number;
  /** Link ไปยังหน้าเปรียบเทียบทั้งหมด */
  browseAllHref?: string;
  /** หัวเรื่อง (default "รุ่นที่คุณอาจชอบ") */
  title?: string;
  /** คำบรรยายใต้หัวเรื่อง */
  subtitle?: string;
}

export default function YouMayAlsoLike({
  currentSizeNumeric,
  candidates,
  limit = 4,
  browseAllHref = "/interactive-display",
  title = "รุ่นที่คุณอาจชอบ",
  subtitle = "เลือกขนาดอื่นในตระกูล Interactive Display — เปรียบเทียบสเปก ราคา และการใช้งานได้ทันที",
}: YouMayAlsoLikeProps) {
  // เรียงตาม "ระยะห่าง" จากขนาดปัจจุบัน → ใกล้สุดก่อน
  const sorted = [...candidates]
    .filter((c) => c.sizeNumeric !== currentSizeNumeric)
    .sort(
      (a, b) =>
        Math.abs(a.sizeNumeric - currentSizeNumeric) -
        Math.abs(b.sizeNumeric - currentSizeNumeric),
    )
    .slice(0, limit);

  if (sorted.length === 0) return null;

  return (
    <section
      aria-labelledby="you-may-also-like-heading"
      className="border-t border-border bg-gradient-to-b from-secondary/20 via-background to-background py-16 md:py-20"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-wider uppercase">
                Recommended for you
              </span>
            </div>
            <h2
              id="you-may-also-like-heading"
              className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground"
            >
              {title}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">{subtitle}</p>
          </div>
          <Button asChild variant="ghost" className="self-start md:self-end shrink-0">
            <Link to={browseAllHref}>
              ดูทุกขนาด <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {sorted.map((s) => {
            const cover = s.product.gallery?.[0];
            return (
              <Link
                key={s.href}
                to={s.href}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                {/* Cover image */}
                <div className="relative aspect-square overflow-hidden bg-secondary/30">
                  {cover ? (
                    <img
                      src={cover}
                      alt={s.product.shortName || s.product.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <Maximize2 className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground font-semibold">
                      {s.sizeLabel}
                    </Badge>
                  </div>
                  {s.formFactor && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        {s.formFactor}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col p-4">
                  <p className="text-xs font-mono text-primary font-semibold mb-1">
                    {s.product.modelCode}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
                    {s.product.shortName || s.product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {s.product.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                    ดูรายละเอียด <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

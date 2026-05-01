import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import ad01 from "@/assets/ads/volktek-ad-01-launch-hero-light.jpg";
import ad02 from "@/assets/ads/volktek-ad-02-metro-ethernet-light.jpg";
import ad03 from "@/assets/ads/volktek-ad-03-industrial-rugged-light.jpg";
import ad04 from "@/assets/ads/volktek-ad-04-poe-switch.jpg";
import ad05 from "@/assets/ads/volktek-ad-05-full-lineup-light.jpg";
import {
  volktekLayer3,
  volktekIndustrialPoe,
  volktekIndustrialEthernet,
  volktekMetroEthernet,
  volktekMediaConverter,
  type VolktekProduct,
  type VolktekCategory,
  type VolktekSubCategory,
} from "@/data/volktek-products";
import VolktekProductDialog from "@/components/volktek/VolktekProductDialog";

/**
 * Marketing Strip — โชว์ภาพแอด 5 ภาพ + Featured Products 8 รุ่นเด่น
 * ใช้บนหน้า /volktek เพื่อเสริม visual storytelling + สินค้าไฮไลต์
 */

const ADS = [
  { src: ad01, alt: "เปิดตัวเว็บไซต์ใหม่ ENT Group × Volktek Networks", caption: "เปิดตัวเว็บไซต์ใหม่" },
  { src: ad02, alt: "Layer 3 Metro Ethernet — Volktek MEN-6412", caption: "Layer 3 Metro Ethernet" },
  { src: ad03, alt: "Industrial Switch ทนทุกสภาพแวดล้อม", caption: "Industrial Rugged Series" },
  { src: ad04, alt: "PoE+ Switch จ่ายไฟและส่งข้อมูลสายเดียว", caption: "PoE+ All-in-One" },
  { src: ad05, alt: "โซลูชันเครือข่าย Volktek ครบวงจร", caption: "Complete Network Solutions" },
];

/** Helper หา product + subCategory + categoryTitle จาก model */
function findProductWithCtx(
  cat: VolktekCategory,
  model: string,
): { product: VolktekProduct; subCategory: VolktekSubCategory; categoryTitle: string } | undefined {
  for (const sub of cat.subCategories) {
    const p = sub.products.find((x) => x.model === model);
    if (p) return { product: p, subCategory: sub, categoryTitle: cat.title };
  }
  return undefined;
}

/** 8 รุ่นเด่นจาก 5 หมวดหลัก — เลือกให้ครอบคลุมทุก use-case */
const FEATURED_PICKS: { category: string; model: string; tag: string; cat: VolktekCategory }[] = [
  { category: "Layer 3", model: "9561-8GT4XS-TSN", tag: "TSN Flagship", cat: volktekLayer3 },
  { category: "Industrial PoE", model: "9560-16GP4XS-I", tag: "16-Port 10G", cat: volktekIndustrialPoe },
  { category: "Industrial PoE", model: "INS-8624P", tag: "Managed Fiber", cat: volktekIndustrialPoe },
  { category: "Industrial PoE", model: "SEN-9648PM-24V", tag: "DNV Marine", cat: volktekIndustrialPoe },
  { category: "Industrial Ethernet", model: "INS-840G", tag: "Unmanaged 16-Port", cat: volktekIndustrialEthernet },
  { category: "Metro Ethernet", model: "MEN-6412", tag: "Aggregation", cat: volktekMetroEthernet },
  { category: "Metro Ethernet", model: "6500-24GS4XS", tag: "L2+ 10G", cat: volktekMetroEthernet },
  { category: "Media Converter", model: "IMC-661P", tag: "PoE+ Gigabit", cat: volktekMediaConverter },
];

const FEATURED = FEATURED_PICKS.map((pick) => {
  const ctx = findProductWithCtx(pick.cat, pick.model);
  return ctx ? { ...pick, ...ctx } : null;
}).filter((x): x is {
  category: string;
  model: string;
  tag: string;
  cat: VolktekCategory;
  product: VolktekProduct;
  subCategory: VolktekSubCategory;
  categoryTitle: string;
} => x !== null);

export default function VolktekMarketingStrip() {
  const [active, setActive] = useState(0);
  const [dialogState, setDialogState] = useState<{
    product: VolktekProduct;
    subCategory: VolktekSubCategory;
    categoryTitle: string;
  } | null>(null);

  const prev = () => setActive((i) => (i - 1 + ADS.length) % ADS.length);
  const next = () => setActive((i) => (i + 1) % ADS.length);

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openProduct = (
    product: VolktekProduct,
    subCategory: VolktekSubCategory,
    categoryTitle: string,
  ) => {
    setDialogState({ product, subCategory, categoryTitle });
  };

  const selectFromDialog = (p: VolktekProduct) => {
    if (!dialogState) return;
    const next = dialogState.subCategory.products.find((x) => x.model === p.model);
    if (next) setDialogState({ ...dialogState, product: next });
  };

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

      {/* Two-column layout: Campaign Image (left, 2/3) + Featured Products (right, 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Left column: Campaign image — กว้าง 2/3 */}
        <div className="lg:col-span-2 flex flex-col border-b lg:border-b-0 lg:border-r border-border">
          <div className="relative bg-muted aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9] overflow-hidden flex-1">
            {ADS.map((ad, i) => (
              <img
                key={ad.src}
                src={ad.src}
                alt={ad.alt}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                  i === active ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              />
            ))}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm border border-border text-[11px] font-semibold text-foreground shadow-sm">
                {ADS[active].caption}
              </span>
            </div>
          </div>

          {/* Thumbnail row */}
          <div className="px-3 py-2.5 md:px-4 md:py-3 bg-muted/30 border-t border-border">
            <div className="grid grid-cols-5 gap-1.5 md:gap-2 max-w-md mx-auto">
              {ADS.map((ad, i) => (
                <button
                  key={ad.src}
                  onClick={() => setActive(i)}
                  aria-label={`ดู ${ad.caption}`}
                  className={`group relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                    i === active
                      ? "border-primary shadow-sm scale-[1.04]"
                      : "border-transparent hover:border-primary/40 opacity-60 hover:opacity-100"
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
        </div>

        {/* Right column: Featured Products — กว้าง 1/3 compact list */}
        <div className="lg:col-span-1 p-3 md:p-4 bg-muted/20 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-2.5 gap-2">
            <div className="min-w-0">
              <span className="text-[9px] font-semibold tracking-widest uppercase text-primary block">
                Top Picks
              </span>
              <h3 className="text-xs md:text-sm font-display font-bold text-foreground truncate">
                รุ่นเด่น {FEATURED.length} รุ่น
              </h3>
            </div>
            <button
              onClick={scrollToCatalog}
              className="text-[10px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5 shrink-0"
            >
              ดูทั้งหมด <ArrowRight size={10} />
            </button>
          </div>

          {/* Compact list — รุ่นเด่นเป็นแถวเล็ก ไม่ดันความสูงคอลัมน์ซ้าย */}
          <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-1.5 max-h-[460px] lg:max-h-none">
            {FEATURED.map((f) => (
              <button
                key={f.model}
                onClick={() => openProduct(f.product, f.subCategory, f.categoryTitle)}
                className="group w-full text-left rounded-md border border-border bg-background hover:border-primary/50 hover:shadow-sm transition-all flex items-center gap-2 p-1.5"
                aria-label={`ดูรายละเอียด ${f.model}`}
              >
                <div className="w-11 h-11 shrink-0 bg-muted/40 rounded overflow-hidden relative">
                  <img
                    src={f.product.image}
                    alt={f.model}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded bg-primary/15 text-primary border border-primary/25 truncate">
                      {f.tag}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] md:text-[11px] font-bold text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                    {f.model}
                  </div>
                  <div className="text-[9px] text-muted-foreground leading-tight truncate">
                    {f.category}
                  </div>
                </div>
                <ArrowRight size={11} className="text-muted-foreground group-hover:text-primary shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <VolktekProductDialog
        product={dialogState?.product ?? null}
        subCategory={dialogState?.subCategory ?? null}
        categoryTitle={dialogState?.categoryTitle ?? ""}
        onClose={() => setDialogState(null)}
        onSelect={selectFromDialog}
      />
    </section>
  );
}

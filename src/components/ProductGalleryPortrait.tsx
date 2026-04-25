import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ZoomIn } from "lucide-react";

interface ProductGalleryPortraitProps {
  images: string[];
  alt: string;
  autoPlayInterval?: number;
  onImageClick?: (index: number) => void;
}

/**
 * Portrait-oriented gallery for tall kiosk products (e.g. GD32C, KD32B).
 * Layout: vertical thumbnail rail on the left + tall hero image on the right.
 * On mobile, thumbnails collapse into a horizontal scroll strip below.
 */
const ProductGalleryPortrait = ({
  images,
  alt,
  autoPlayInterval = 5000,
  onImageClick,
}: ProductGalleryPortraitProps) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [paused, next, autoPlayInterval, images.length]);

  // Keep active thumbnail in view
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const active = rail.querySelector<HTMLButtonElement>(
      `[data-idx="${current}"]`
    );
    if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [current]);

  if (images.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Vertical thumbnail rail (desktop) */}
        <div className="hidden sm:flex flex-col items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={prev}
            className="w-16 h-7 rounded-md border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            aria-label="Previous"
          >
            <ChevronUp size={14} />
          </button>

          <div
            ref={railRef}
            className="flex flex-col gap-2 max-h-[460px] overflow-y-auto scrollbar-hide py-1"
          >
            {images.map((img, i) => (
              <button
                key={i}
                data-idx={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`w-16 h-20 rounded-lg overflow-hidden border-2 bg-white transition-all duration-200 shrink-0 ${
                  i === current
                    ? "border-primary ring-2 ring-primary/25 shadow-md"
                    : "border-border/60 opacity-70 hover:opacity-100 hover:border-primary/40"
                }`}
                aria-label={`Slide ${i + 1}`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="w-16 h-7 rounded-md border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            aria-label="Next"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Hero image — portrait aspect, tall stage */}
        <div className="relative flex-1 group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-muted/40 to-background flex items-center justify-center min-h-[420px] sm:min-h-[520px] aspect-[4/5] sm:aspect-auto">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${alt} - ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 m-auto max-h-[95%] max-w-[88%] object-contain transition-opacity duration-500 ${
                  i === current ? "opacity-100" : "opacity-0 pointer-events-none"
                } ${onImageClick ? "cursor-zoom-in" : ""}`}
                onClick={onImageClick ? () => onImageClick(current) : undefined}
              />
            ))}

            {/* Index badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium text-muted-foreground">
              {current + 1} <span className="opacity-60">/ {images.length}</span>
            </div>

            {/* Zoom hint */}
            {onImageClick && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium text-muted-foreground inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={12} /> ซูม
              </div>
            )}

            {/* Side nav arrows */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-lg"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-lg"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Progress dots (bottom) */}
          <div className="flex gap-1.5 justify-center mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile horizontal thumbnail strip */}
      <div className="sm:hidden flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`shrink-0 w-14 h-16 rounded-lg overflow-hidden border-2 bg-white transition-all ${
              i === current
                ? "border-primary ring-2 ring-primary/25"
                : "border-border/60 opacity-70"
            }`}
            aria-label={`Slide ${i + 1}`}
          >
            <img src={img} alt="" className="w-full h-full object-contain p-1" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGalleryPortrait;

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  autoPlayInterval?: number;
}

const ProductGallery = ({ images, alt, autoPlayInterval = 4000 }: ProductGalleryProps) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [paused, next, autoPlayInterval, images.length]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return <img src={images[0]} alt={alt} className="max-h-[240px] object-contain mx-auto" loading="lazy" />;
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-xl bg-background/30 flex items-center justify-center min-h-[200px]">
        <img
          src={images[current]}
          alt={`${alt} - ${current + 1}`}
          className="max-h-[240px] object-contain transition-opacity duration-500"
          loading="lazy"
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          aria-label="Previous"
        >
          <ChevronLeft size={16} className="text-foreground" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          aria-label="Next"
        >
          <ChevronRight size={16} className="text-foreground" />
        </button>
      </div>

      <div className="flex gap-2 mt-3 justify-center items-center">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              i === current
                ? "border-primary ring-2 ring-primary/30 scale-105"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-contain bg-background/50 p-0.5" loading="lazy" />
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 justify-center mt-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;

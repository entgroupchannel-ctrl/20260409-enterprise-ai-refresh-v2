import { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageGalleryZoomProps {
  images: string[];
  alt: string;
  enableZoom?: boolean;
}

export default function ProductImageGalleryZoom({ images, alt, enableZoom = true }: ProductImageGalleryZoomProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [erroredImages, setErroredImages] = useState<Set<number>>(new Set());
  const mainRef = useRef<HTMLDivElement>(null);

  const validImages = images.filter(Boolean);
  if (validImages.length === 0) validImages.push('/placeholder.svg');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom || !mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, [enableZoom]);

  const prev = () => setActiveIndex(i => (i - 1 + validImages.length) % validImages.length);
  const next = () => setActiveIndex(i => (i + 1) % validImages.length);

  const isCurrentErrored = erroredImages.has(activeIndex);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        ref={mainRef}
        className="relative aspect-square bg-muted rounded-xl overflow-hidden cursor-crosshair group border border-border"
        onMouseEnter={() => enableZoom && !isCurrentErrored && setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        {isCurrentErrored ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <Package className="w-16 h-16 mb-3 opacity-30" />
            <p className="text-sm font-medium">รูปสินค้ากำลังจัดเตรียม</p>
            <p className="text-xs opacity-60 mt-1">Product image coming soon</p>
          </div>
        ) : (
          <img
            src={validImages[activeIndex]}
            alt={`${alt} - ${activeIndex + 1}`}
            className={cn(
              "w-full h-full object-contain transition-transform duration-200",
              isZooming && "scale-[2.5]"
            )}
            style={isZooming ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
            draggable={false}
            onError={() => {
              setErroredImages(prev => new Set(prev).add(activeIndex));
              setIsZooming(false);
            }}
          />
        )}

        {/* Nav arrows */}
        {validImages.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md" aria-label="Previous">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md" aria-label="Next">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter */}
        {!isCurrentErrored && (
          <div className="absolute bottom-2 right-2 bg-background/70 backdrop-blur text-xs px-2 py-0.5 rounded-full text-muted-foreground">
            {activeIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {validImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                i === activeIndex ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/50"
              )}
            >
              {erroredImages.has(i) ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Package className="w-5 h-5 text-muted-foreground/40" />
                </div>
              ) : (
                <img
                  src={src}
                  alt={`${alt} thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => setErroredImages(prev => new Set(prev).add(i))}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import { X, Download, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
  images: string[];
  alt: string;
  /** Optional filename prefix used when downloading (e.g. "DM101G-Monitor"). */
  downloadPrefix?: string;
  /** Render prop: receives an onOpen(index) handler — wrap your trigger element. */
  children: (open: (index: number) => void) => React.ReactNode;
}

/**
 * Click-to-zoom lightbox with download button.
 * Use as a render-prop: <ImageLightbox images={imgs}>{(open) => <img onClick={() => open(0)} />}</ImageLightbox>
 */
export default function ImageLightbox({ images, alt, downloadPrefix = "image", children }: ImageLightboxProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const open = useCallback((i: number) => setOpenIdx(i), []);
  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx, close, next, prev]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (openIdx === null) return;
    const url = images[openIdx];
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${downloadPrefix}-${String(openIdx + 1).padStart(2, "0")}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(url, "_blank", "noopener");
    }
  };

  return (
    <>
      {children(open)}
      {openIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-150"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} - ขยายภาพ`}
        >
          {/* Top toolbar */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium shadow-lg"
              aria-label="ดาวน์โหลดภาพ"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">ดาวน์โหลด</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors shadow-lg"
              aria-label="ปิด"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-muted/80 backdrop-blur text-sm font-medium text-muted-foreground z-10">
              {openIdx + 1} / {images.length}
            </div>
          )}

          {/* Prev/Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background border border-border shadow-lg transition-all hover:scale-105 z-10"
                aria-label="ภาพก่อนหน้า"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background border border-border shadow-lg transition-all hover:scale-105 z-10"
                aria-label="ภาพถัดไป"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={images[openIdx]}
            alt={`${alt} - ${openIdx + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </>
  );
}

/** Small badge shown on hover indicating the image is clickable. */
export function ZoomHintBadge({ className }: { className?: string }) {
  return (
    <div className={cn(
      "absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm",
      className
    )}>
      <ZoomIn className="w-3 h-3" />
      คลิกเพื่อขยาย
    </div>
  );
}

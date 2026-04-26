import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Maximize2 } from "lucide-react";
import kioskBanner from "@/assets/banners/home-kiosk-banner.jpg";
import largeDisplayBanner from "@/assets/banners/home-largedisplay-banner.jpg";

/**
 * Interactive Display & KIOSK Banner — Home page
 * เชื่อมไป /interactive-display และรุ่นย่อย (15.6", 21.5", 23.8", 27"–98")
 */
const InteractiveDisplayBanner = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            Interactive Touch Display
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            จอสัมผัสอุตสาหกรรม & ตู้ KIOSK สำเร็จรูป
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            ตั้งแต่ตู้ KIOSK 15.6" – 23.8" สำหรับงานบริการตัวเอง ไปจนถึงจอใหญ่ 27" – 98" สำหรับห้องประชุม / Control Room
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {/* KIOSK Banner */}
          <Link
            to="/interactive-display"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={kioskBanner}
                alt="ตู้ KIOSK จอสัมผัส 15.6 - 23.8 นิ้ว สำหรับร้านอาหาร ห้างฯ ธนาคาร"
                width={1600}
                height={896}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden" />

              {/* Content overlay */}
              <div className="relative h-full flex flex-col justify-between p-6 md:p-8 z-10 max-w-md">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-3">
                    <Monitor className="h-3 w-3" /> KIOSK Series
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                    ตู้ KIOSK สำเร็จรูป
                    <span className="block text-primary text-lg md:text-xl mt-1">15.6" / 21.5" / 23.8"</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    Floor-stand & Wall mount — รองรับ Windows / Android เปลี่ยนหน้ากาก ใส่ Printer / Scanner / NFC ได้
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/products/displays-15.6"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background/80 backdrop-blur text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    15.6" Floor
                  </Link>
                  <Link
                    to="/products/displays-21.5"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background/80 backdrop-blur text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    21.5" Floor / Wall
                  </Link>
                  <Link
                    to="/products/displays-23.8"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background/80 backdrop-blur text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    23.8" Wall Mount
                  </Link>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold ml-auto group-hover:gap-2 transition-all">
                    ดูทั้งหมด <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Large Display Banner */}
          <Link
            to="/interactive-display#products"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={largeDisplayBanner}
                alt="จอสัมผัสขนาดใหญ่ 27 - 98 นิ้ว สำหรับห้องประชุม ห้องเรียน Control Room"
                width={1600}
                height={896}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden" />

              {/* Content overlay (right-aligned on desktop) */}
              <div className="relative h-full flex flex-col justify-between p-6 md:p-8 z-10 max-w-md ml-auto lg:text-right lg:items-end">
                <div className="lg:ml-auto">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-3">
                    <Maximize2 className="h-3 w-3" /> Large Format
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                    จอทัชสกรีนขนาดใหญ่
                    <span className="block text-primary text-lg md:text-xl mt-1">27" – 98" 4K UHD</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    IR Touch 10–20 จุด สำหรับห้องประชุม Smart Classroom และ Control Room — Android / OPS PC
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    to="/products/displays-32"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background/80 backdrop-blur text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    32"
                  </Link>
                  <Link
                    to="/products/displays-27"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background/80 backdrop-blur text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    27"
                  </Link>
                  <Link
                    to="/products/displays-55"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background/80 backdrop-blur text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    55" – 75"
                  </Link>
                  <Link
                    to="/products/displays-86"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background/80 backdrop-blur text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    86" – 98"
                  </Link>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold group-hover:gap-2 transition-all">
                    ดูทั้งหมด <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDisplayBanner;

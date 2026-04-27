import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Maximize2 } from "lucide-react";
import kioskBanner from "@/assets/banners/home-kiosk-banner.jpg";
import largeDisplayBanner from "@/assets/banners/home-largedisplay-banner.jpg";

/**
 * Interactive Display & KIOSK Banner — Home page
 * เชื่อมไป /interactive-display และรุ่นย่อย (15.6", 21.5", 23.8", 27"–98")
 */

type ChipLink = { label: string; href: string };

interface BannerCardProps {
  image: string;
  alt: string;
  badgeIcon: React.ReactNode;
  badgeLabel: string;
  title: string;
  highlight: string;
  description: string;
  chips: ChipLink[];
  primaryHref: string;
  side: "left" | "right";
}

const BannerCard = ({
  image, alt, badgeIcon, badgeLabel, title, highlight, description, chips, primaryHref, side,
}: BannerCardProps) => {
  const isRight = side === "right";
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all">
      <div className="relative aspect-[16/9] overflow-hidden">
        {/* Background image */}
        <img
          src={image}
          alt={alt}
          width={1600}
          height={896}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient overlay — opposite side of content */}
        <div
          className={`absolute inset-0 ${
            isRight
              ? "bg-gradient-to-l from-background/95 via-background/60 to-transparent"
              : "bg-gradient-to-r from-background/95 via-background/60 to-transparent"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden" />

        {/* Full-card click target — sits below chip buttons */}
        <Link
          to={primaryHref}
          aria-label={title}
          className="absolute inset-0 z-0"
        />

        {/* Content overlay */}
        <div
          className={`relative h-full flex flex-col justify-between p-6 md:p-8 max-w-md pointer-events-none ${
            isRight ? "ml-auto lg:text-right lg:items-end" : ""
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-3">
              {badgeIcon} {badgeLabel}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold leading-tight">
              {title}
              <span className="block text-primary text-lg md:text-xl mt-1">{highlight}</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
          </div>

          <div
            className={`mt-4 flex flex-wrap gap-2 pointer-events-auto ${
              isRight ? "lg:justify-end" : ""
            }`}
          >
            {chips.map(c => (
              <Link
                key={c.href}
                to={c.href}
                className="relative z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background/80 backdrop-blur text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
              >
                {c.label}
              </Link>
            ))}
            <Link
              to={primaryHref}
              className={`relative z-10 inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold group-hover:gap-2 transition-all ${
                isRight ? "" : "ml-auto"
              }`}
            >
              ดูทั้งหมด <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          <BannerCard
            image={kioskBanner}
            alt="ตู้ KIOSK จอสัมผัส 15.6 - 23.8 นิ้ว สำหรับร้านอาหาร ห้างฯ ธนาคาร"
            badgeIcon={<Monitor className="h-3 w-3" />}
            badgeLabel="KIOSK Series"
            title="ตู้ KIOSK สำเร็จรูป"
            highlight={'15.6" / 21.5" / 23.8"'}
            description="Floor-stand & Wall mount — รองรับ Windows / Android เปลี่ยนหน้ากาก ใส่ Printer / Scanner / NFC ได้"
            primaryHref="/interactive-display"
            side="left"
            chips={[
              { label: '21.5" Floor / Wall', href: "/products/displays-21.5" },
              { label: '23.8" Wall Mount', href: "/products/displays-23.8" },
              { label: '32" Floor Kiosk', href: "/products/displays-32?model=kd32b" },
            ]}
          />
          <BannerCard
            image={largeDisplayBanner}
            alt="จอสัมผัสขนาดใหญ่ 27 - 98 นิ้ว สำหรับห้องประชุม ห้องเรียน Control Room"
            badgeIcon={<Maximize2 className="h-3 w-3" />}
            badgeLabel="Large Format"
            title="จอทัชสกรีนขนาดใหญ่"
            highlight={'27" – 98" 4K UHD'}
            description="IR Touch 10–20 จุด สำหรับห้องประชุม Smart Classroom และ Control Room — Android / OPS PC"
            primaryHref="/interactive-display"
            side="right"
            chips={[
              { label: '27" – 32"', href: "/products/displays-27" },
              { label: '43" – 55"', href: "/products/displays-55" },
              { label: '65" – 75"', href: "/products/displays-75" },
              { label: '86" – 98"', href: "/products/displays-86" },
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default InteractiveDisplayBanner;

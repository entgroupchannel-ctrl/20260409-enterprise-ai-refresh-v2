import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Maximize2, ShoppingBag, Tag, Frame } from "lucide-react";
import kioskBanner from "@/assets/banners/home-kiosk-banner.jpg";
import largeDisplayBanner from "@/assets/banners/home-largedisplay-banner.jpg";
import { SHOP_STATIC_COMPARE_PRODUCTS } from "@/data/shop-static-products";
import wallKioskHero from "@/assets/ads/wallkiosk-hero.jpg";
import wallKiosk156 from "@/assets/ads/wallkiosk-156.jpg";
import wallKiosk215 from "@/assets/ads/wallkiosk-215.jpg";
import wallKiosk238 from "@/assets/ads/wallkiosk-238.jpg";
import wallKiosk32 from "@/assets/ads/wallkiosk-32.jpg";
import wallKioskAndroid from "@/assets/ads/wallkiosk-android.jpg";

// สินค้าใน /shop ที่ตรงกับหัวข้อ (Touch Kiosk + Indoor Display ขนาดใหญ่)
const SHOP_MATCHED_SLUGS = [
  "gd215c", "gd238c3", "gd27c", "gd32c",
  "jd156b", "jd185b", "jd215b", "gd133",
];

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
    <section className="py-10 md:py-14 px-4 md:px-8">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
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
              { label: '15.6" Floor', href: "/products/displays-15.6" },
              { label: '21.5" Floor / Wall', href: "/products/displays-21.5" },
              { label: '23.8" Wall Mount', href: "/products/displays-23.8" },
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

        {/* CTA: ไปหน้า /shop */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            ดูทั้งหมดใน /shop พร้อมราคา
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-muted-foreground">
            เลือกสเปก Monitor / Android / Windows — มีราคาแสดงชัดเจน
          </p>
        </div>

        {/* สินค้าจาก /shop ที่ตรงกับหัวข้อ */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
            รุ่นแนะนำใน Shop ที่ตรงหัวข้อนี้
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
            {SHOP_MATCHED_SLUGS.map((slug) => {
              const p = SHOP_STATIC_COMPARE_PRODUCTS.find((x) => x.slug === slug);
              if (!p) return null;
              return (
                <Link
                  key={p.id}
                  to={`/shop/${p.slug}`}
                  className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    {p.thumbnail_url && (
                      <img
                        src={p.thumbnail_url}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <span className="absolute top-1 left-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-background/90 border border-border">
                      {p.model}
                    </span>
                  </div>
                  <div className="p-2">
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" /> เริ่มต้น
                    </div>
                    <div className="text-xs md:text-sm font-bold text-primary leading-tight">
                      ฿{p.unit_price.toLocaleString("th-TH")}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Wall Mount Touch Kiosk Showcase — 15.6" – 32" */}
        <div className="mt-10 relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-2">
                <Frame className="h-3 w-3" /> Wall Mount Series
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Wall Mount Touch Kiosk
                <span className="block text-primary text-base md:text-lg mt-1 font-semibold">
                  ตู้คีออสก์แขวนผนัง 15.6" – 32" เลือกขนาดที่ใช่
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                ติดผนังประหยัดพื้นที่ — ร้านอาหาร / ธนาคาร / Reception / Wayfinding รองรับ Android & Windows พร้อมใช้งาน
              </p>
            </div>
            <Link
              to="/products/displays-21.5"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all whitespace-nowrap"
            >
              ดูรายละเอียดซีรีส์ 21.5" <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Layout: ซ้ายภาพใหญ่ / ขวากลุ่มภาพรอง */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4">
            {/* Hero image — full lineup (ซ้าย) */}
            <Link
              to="/products/displays-21.5"
              className="group relative block overflow-hidden rounded-xl border border-border bg-card hover:border-primary hover:shadow-xl transition-all lg:col-span-3"
            >
              <div className="relative h-full min-h-[260px] overflow-hidden bg-muted">
                <img
                  src={wallKioskHero}
                  alt="Wall Mount Touch Kiosk ครบทุกขนาด 15.6, 21.5, 23.8, 32 นิ้ว"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-4">
                  <div className="text-sm md:text-base font-bold text-foreground">ครบทุกขนาด 15.6" – 32"</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">Self Check-in • POS / Queue • Brand Store • Banking</div>
                </div>
              </div>
            </Link>

            {/* กลุ่มภาพรอง (ขวา) */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 lg:col-span-2 content-start">
              {[
                { src: wallKiosk156, alt: 'Wall Kiosk 15.6"', caption: '15.6"', sub: "Compact & Smart", href: "/products/displays-15.6" },
                { src: wallKiosk215, alt: 'Wall Kiosk 21.5" GD215C', caption: '21.5"', sub: "GD215C Portrait", href: "/products/displays-21.5" },
                { src: wallKiosk238, alt: 'Wall Kiosk 23.8" Portrait', caption: '23.8"', sub: "Portrait 9:16", href: "/products/displays-23.8" },
                { src: wallKiosk32, alt: 'Wall Kiosk 32" GD32C', caption: '32"', sub: "ระดับพรีเมียม", href: "/products/displays-21.5" },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.href}
                  className="group relative block overflow-hidden rounded-lg border border-border bg-card hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-foreground shadow">
                      {item.caption}
                    </span>
                  </div>
                  <div className="px-2 py-1.5">
                    <div className="text-[11px] font-semibold text-foreground line-clamp-1">{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDisplayBanner;

import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Cpu, MonitorSmartphone, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SHOP_STATIC_COMPARE_PRODUCTS } from "@/data/shop-static-products";

// คัดสินค้า /shop มาแสดงหน้าแรก 4 แถว × 4 คอลัมน์ = 16 รายการเด่น
// ครอบคลุมทั้ง Touch Kiosk, Industrial Touch PC, Indoor Display
const FEATURED_SLUGS = [
  // แถว 1 — Touch Kiosk เด่น
  "gd215c", "gd238c3", "gd32c", "gd27c",
  // แถว 2 — Indoor Display Touch PC (รุ่นใหม่ JD-series)
  "jd133", "jd156b", "jd185b", "jd215b",
  // แถว 3 — Industrial Touch PC ขนาดยอดนิยม
  "dm101g", "dm121g", "dm156g", "dm215g",
  // แถว 4 — รุ่นเล็ก / เฉพาะทาง
  "dm080nf", "dm080wg", "dm15g", "gd133",
];

function fmt(n: number) {
  return n.toLocaleString("th-TH");
}

const ShopHighlightsGrid = () => {
  const items = FEATURED_SLUGS
    .map((slug) => SHOP_STATIC_COMPARE_PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section
      id="shop-highlights"
      aria-labelledby="shop-highlights-title"
      className="py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <Badge variant="secondary" className="mb-3 gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              สั่งซื้อออนไลน์ได้ทันที
            </Badge>
            <h2
              id="shop-highlights-title"
              className="text-2xl md:text-4xl font-bold tracking-tight"
            >
              สินค้าแนะนำจาก <span className="text-primary">/shop</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Industrial Touch PC, Touch Kiosk และ Indoor Display
              พร้อมเลือกสเปก Monitor / Android / Windows — มีราคาแสดงชัดเจน คลิกเพื่อดูสเปกและสั่งซื้อ
            </p>
          </div>

          <Button asChild variant="outline" className="self-start md:self-end">
            <Link to="/shop" className="gap-2">
              ดูสินค้าทั้งหมดใน Shop
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Grid: 4 แถว × 4 คอลัมน์ บน desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map((p) => (
            <Link
              key={p.id}
              to={`/shop/${p.slug}`}
              className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-200"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                {p.thumbnail_url ? (
                  <img
                    src={p.thumbnail_url}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <MonitorSmartphone className="w-10 h-10" />
                  </div>
                )}
                <Badge
                  variant="secondary"
                  className="absolute top-2 left-2 text-[10px] font-mono"
                >
                  {p.model}
                </Badge>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col p-3 md:p-4">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {p.name}
                </h3>

                {p.cpu && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-1 flex items-center gap-1">
                    <Cpu className="w-3 h-3 shrink-0" />
                    {p.cpu}
                  </p>
                )}

                <div className="mt-auto pt-3 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" /> เริ่มต้น
                    </div>
                    <div className="text-base md:text-lg font-bold text-primary">
                      ฿{fmt(p.unit_price)}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    ดูสินค้า
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/shop">
              เปิดดู Shop ทั้งหมด ({SHOP_STATIC_COMPARE_PRODUCTS.length}+ รุ่น)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShopHighlightsGrid;

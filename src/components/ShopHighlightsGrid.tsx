import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Cpu, MonitorSmartphone, Tag, Truck, ShieldCheck, Flame, Sparkles, FileText, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SHOP_STATIC_COMPARE_PRODUCTS } from "@/data/shop-static-products";

function fmt(n: number) {
  return n.toLocaleString("th-TH");
}

// สุ่มลำดับสินค้าแบบเสถียรต่อวัน (เปลี่ยนทุกวัน แต่คงที่ภายในวันเดียว เพื่อไม่ให้ layout กระโดดทุก render)
function shuffleStable<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ShopHighlightsGrid = () => {
  const items = useMemo(() => {
    // สุ่มใหม่ทุกครั้งที่เข้าหน้า (ใช้ timestamp + random เป็น seed)
    const seed = Date.now() + Math.floor(Math.random() * 100000);
    return shuffleStable(SHOP_STATIC_COMPARE_PRODUCTS, seed);
  }, []);

  return (
    <section
      id="shop-highlights"
      aria-labelledby="shop-highlights-title"
      className="py-12 md:py-16 px-4 md:px-8"
    >
      <div className="container max-w-7xl mx-auto">
        {/* Promo Ribbon — กระตุ้นการขาย */}
        <div className="mb-8 rounded-2xl overflow-hidden border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 shadow-md">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="flex items-center gap-3 px-5 py-4 bg-primary text-primary-foreground md:w-auto">
              <Flame className="w-6 h-6 shrink-0" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider opacity-90">โปรโมชันพิเศษ</div>
                <div className="text-lg font-bold leading-tight">สินค้าพร้อมส่งทุกรุ่น</div>
              </div>
            </div>
            <div className="flex-1 flex flex-wrap items-center justify-center md:justify-around gap-x-6 gap-y-2 px-5 py-3 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <Truck className="w-4 h-4 text-primary" />
                <span><strong>ส่งฟรี</strong> กรุงเทพ-ปริมณฑล</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>รับประกัน <strong>1-3 ปี</strong></span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>ราคา <strong>โรงงานโดยตรง</strong></span>
              </div>
              <Link
                to="/request-quote"
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              >
                <Tag className="w-4 h-4 text-primary" />
                <span>ขอใบเสนอราคา <strong>ภายใน 4 ชม.</strong></span>
              </Link>
              <Button asChild size="sm" className="gap-1.5 h-8">
                <Link to="/request-quote">
                  <FileText className="w-3.5 h-3.5" />
                  ขอใบเสนอราคา
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
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

        {/* Grid: 5 คอลัมน์บน desktop ประหยัดพื้นที่ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
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
                {(() => {
                  // ป้ายโปรสุ่ม เสถียรต่อ slug
                  let h = 0;
                  for (let i = 0; i < p.slug.length; i++) h = (h * 33 + p.slug.charCodeAt(i)) >>> 0;
                  const tags = [
                    { label: "🔥 ขายดี", cls: "bg-red-500 text-white" },
                    { label: "🛡 ทนทาน", cls: "bg-blue-600 text-white" },
                    { label: "💰 ประหยัด", cls: "bg-emerald-600 text-white" },
                  ];
                  const t = tags[h % tags.length];
                  return (
                    <span
                      className={`absolute top-2 right-2 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-md animate-pulse ${t.cls}`}
                    >
                      {t.label}
                    </span>
                  );
                })()}
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col p-2.5 md:p-3">
                <h3 className="text-xs md:text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {p.name}
                </h3>

                {p.cpu && (
                  <p className="mt-1.5 text-[10px] md:text-xs text-muted-foreground line-clamp-1 flex items-center gap-1">
                    <Cpu className="w-3 h-3 shrink-0" />
                    {p.cpu}
                  </p>
                )}

                {/* Rating สุ่ม 3-5 ดาว (เสถียรต่อ slug) */}
                {(() => {
                  let h = 0;
                  for (let i = 0; i < p.slug.length; i++) h = (h * 31 + p.slug.charCodeAt(i)) >>> 0;
                  const rating = 3 + (h % 3); // 3, 4, หรือ 5
                  return (
                    <div className="mt-1.5 flex items-center gap-0.5" aria-label={`เรตติ้ง ${rating} จาก 5 ดาว`}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/40"}`}
                        />
                      ))}
                      <span className="ml-1 text-[10px] text-muted-foreground">({rating}.0)</span>
                    </div>
                  );
                })()}

                <div className="mt-auto pt-2 flex items-end justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" /> เริ่มต้น
                    </div>
                    <div className="text-sm md:text-base font-bold text-primary">
                      ฿{fmt(p.unit_price)}
                    </div>
                  </div>
                </div>

                {/* ปุ่ม action: ขอใบเสนอราคา + หยิบใส่ตะกร้า */}
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <span
                    className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md border border-border bg-background text-[10px] md:text-xs font-medium text-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors"
                    title="ขอใบเสนอราคา"
                  >
                    <FileText className="w-3 h-3" />
                    <span className="hidden sm:inline">ใบเสนอราคา</span>
                    <span className="sm:hidden">QT</span>
                  </span>
                  <span
                    className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-primary text-primary-foreground text-[10px] md:text-xs font-medium hover:bg-primary/90 transition-colors"
                    title="หยิบใส่ตะกร้า"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span className="hidden sm:inline">ใส่ตะกร้า</span>
                    <span className="sm:hidden">+</span>
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

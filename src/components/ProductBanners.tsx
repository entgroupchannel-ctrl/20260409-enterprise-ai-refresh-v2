import { Flame, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import kioskBanner from "@/assets/kiosk-banner.jpg";
import volktekHero from "@/assets/ads/volktek-ad-01-launch-hero.jpg";

const productBanners = [
  {
    title: "Panel PC จอสัมผัสอุตสาหกรรม",
    description: "จอสัมผัส Capacitive สำหรับโรงงาน POS และงานบริการ",
    productImage: "/images/wix/0597a3_f2ee4bdde8a64cbc970eb9f33c141b3d_168e09fa.png",
    links: [
      { label: "ดูราคาสินค้า", href: "/panel-pc-gtg" },
      { label: "GK Series", href: "/gk-series" },
    ],
  },
  {
    title: "Rugged Devices ทนทานทุกสภาพ",
    description: "แท็บเล็ตและโน้ตบุ๊กเกรดทหาร MIL-STD-810G",
    productImage: "/images/rugged/f9a-_j8J-x2I.jpg",
    links: [
      { label: "Rugged Tablet", href: "/rugged-tablet" },
      { label: "Rugged Notebook", href: "/rugged-notebook" },
      { label: "Handheld", href: "/handheld" },
    ],
  },
  {
    title: "iBox Industrial PC",
    description: "คอมพิวเตอร์อุตสาหกรรม Fanless สำหรับงานโครงการ",
    productImage: "https://rugged-ipc.lovable.app/assets/ibox-601-gt-pro-main-DGne0Wqp.png",
    hot: true,
    links: [
      { label: "ดูสินค้า", href: "/ibox-series" },
      { label: "ติดต่อฝ่ายขาย", href: "/contact" },
    ],
  },
  {
    title: "ตู้ KIOSK สำเร็จรูป",
    description: "พร้อม Windows 11 ประหยัดกว่าตลาด 15-30%",
    backgroundImage: kioskBanner,
    links: [
      { label: "ดู KIOSK", href: "/interactive-display" },
      { label: "15.6\" Kiosk", href: "/products/displays-15.6" },
    ],
  },
];

const ProductBanners = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productBanners.map((banner) => (
            <div
              key={banner.title}
              className={`group relative card-surface rounded-xl overflow-hidden flex flex-col ${
                banner.hot ? "ring-1 ring-primary/30" : ""
              }`}
            >
              {banner.hot && (
                <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider">
                  <Flame size={10} /> Hot
                </span>
              )}

              {banner.backgroundImage ? (
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={banner.backgroundImage}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>
              ) : (
                <div className="h-44 flex items-center justify-center bg-secondary/20 overflow-hidden p-4">
                  <img
                    src={banner.productImage}
                    alt={banner.title}
                    className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-500"/>
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-foreground mb-1 leading-tight">{banner.title}</h3>
                {banner.description && (
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                    {banner.description}
                  </p>
                )}
                <div className="mt-auto flex flex-wrap gap-2">
                  {banner.links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        banner.hot
                          ? "border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                      }`}
                    >
                      {link.label} <ArrowRight size={11} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Volktek Networks — Featured split banner */}
        <Link
          to="/volktek"
          className="group relative mt-4 block overflow-hidden rounded-xl border border-primary/20 bg-[#0a0a1a] shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
            {/* Image */}
            <div className="relative h-56 md:h-auto overflow-hidden">
              <img
                src={volktekHero}
                alt="Volktek Networks Industrial Switch — เปิดตัวที่ ENT Group"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a1a] md:via-[#0a0a1a]/40" />
              <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                <Sparkles size={10} /> New Brand
              </span>
            </div>

            {/* Content */}
            <div className="relative p-6 md:p-8 flex flex-col justify-center text-white">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300 mb-2">
                Volktek Networks · Taiwan
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                Industrial Network Switch <span className="text-indigo-400">มาใหม่!</span>
              </h3>
              <p className="text-sm text-white/70 mb-4 leading-relaxed">
                L3 Metro Ethernet · Industrial DIN-rail · PoE+ · SFP / Media Converter — ครบไลน์สำหรับโรงงาน Smart City และ Data Center
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {["Layer 3", "PoE+ 30W", "-40°C ~ 75°C", "EMS Software"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/80"
                  >
                    <Zap size={10} className="text-indigo-400" /> {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold group-hover:bg-primary/90 transition-colors">
                  ดูสินค้า Volktek <ArrowRight size={12} />
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-white/80 text-xs font-medium">
                  ขอใบเสนอราคา
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default ProductBanners;


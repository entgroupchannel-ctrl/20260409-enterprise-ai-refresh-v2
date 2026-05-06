import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Apple-style minimal thumbnail row showcasing the 5 GB Series models.
 * Placed near the bottom of the homepage (before Footer).
 */
const models = [
  { id: "gb1000", name: "GB1000", tagline: "Ultra-Compact", img: "/images/wix/0597a3_8f5ea734fd4e41de8db85394a03f50bf_f19d04ba.png", badge: "NEW" },
  { id: "gb2000", name: "GB2000", tagline: "Network Pro", img: "/images/wix/0597a3_b7d3859e0bcf4d2eaeb80e45384e91dc_d4e6442f.jpg" },
  { id: "gb4000v1", name: "GB4000 v1", tagline: "Versatile", img: "/images/wix/0597a3_95c69a88c2ba459e88ffef869f27fb02_e12a03c2.png" },
  { id: "gb4000v2", name: "GB4000 v2", tagline: "Enhanced", img: "/images/wix/0597a3_6ee79905a67f4623be10cf8545d60eca_5b79f36c.png" },
  { id: "gb5000", name: "GB5000", tagline: "Flagship", img: "/images/wix/0597a3_84464f31e83d47a982b5ee3b559db400_8ab46d63.png" },
];

const GBSeriesLineupBanner = () => {
  return (
    <section className="relative bg-background py-16 md:py-20 border-t border-border">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground mb-3">
            GB Series
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Industrial Mini PC · 5 รุ่น 5 สไตล์ — เลือกรุ่นที่ใช่สำหรับงานคุณ
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-6 mb-10">
          {models.map((m) => (
            <Link
              key={m.id}
              to="/gb-series"
              className="group flex flex-col items-center text-center pt-3 pb-2"
            >
              <div className="relative w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src={m.img}
                  alt={m.name}
                  className="h-24 md:h-32 w-auto object-contain drop-shadow-md"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 text-sm md:text-base font-semibold text-foreground/85 group-hover:text-foreground transition-colors">
                {m.name}
              </div>
              {m.badge ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary mt-0.5">
                  {m.badge}
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground mt-0.5">{m.tagline}</span>
              )}
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            to="/gb-series"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            ดูทั้งหมด GB Series <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GBSeriesLineupBanner;

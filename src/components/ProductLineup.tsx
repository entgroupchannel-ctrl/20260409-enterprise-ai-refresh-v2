import { useRef, useState, useEffect } from "react";
import {
  BarChart3, Search, ChevronLeft, ChevronRight,
  Cpu, Monitor, Server, Shield, TabletSmartphone, Tv, Wifi, Box,
} from "lucide-react";
import { Link } from "react-router-dom";

import imgGT from "@/assets/product-gt-series.jpg";
import imgPanel from "@/assets/product-panel-pc.jpg";
import imgIBox from "@/assets/product-ibox-series.jpg";
import imgEPC from "@/assets/product-epc.jpg";
import imgRugged from "@/assets/product-rugged.jpg";
import imgSmart from "@/assets/product-smart-display.jpg";
import imgFirewall from "@/assets/product-firewall.jpg";

const lineupCategories = [
  {
    title: "GT Series — Mini PC",
    subtitle: "Fanless Industrial Computer",
    icon: Cpu,
    href: "/gt-series",
    image: imgGT,
    models: [
      { name: "GT1000", href: "/gt-series" },
      { name: "GT1200 / GT1400", href: "/gt-series", badge: "ราคาใหม่!" },
      { name: "GT2000", href: "/gt-series" },
      { name: "GT3000", href: "/gt-series" },
      { name: "GT5000", href: "/gt-series" },
      { name: "GT7000", href: "/gt-series" },
      { name: "GT9000", href: "/gt-series" },
    ],
    cta: [
      { label: "เปรียบเทียบรุ่น", href: "/gt-series", icon: BarChart3, primary: true },
      { label: "ช่วยเลือกรุ่น", href: "/product-advisor", icon: Search, primary: false },
    ],
  },
  {
    title: "Panel PC จอสัมผัส",
    subtitle: "Industrial Touch Panel",
    icon: Monitor,
    href: "/panel-pc-gtg",
    image: imgPanel,
    models: [
      { name: "FPM Touch Monitor", href: "/panel-pc-gtg" },
      { name: "UTC Series", href: "/utc-series" },
      { name: "GTP Series", href: "/panel-pc-gtg" },
      { name: "GK Series", href: "/gk-series" },
      { name: "GTC Series", href: "/panel-pc-gtg" },
      { name: "SPC Series", href: "/panel-pc-gtg" },
    ],
    cta: [
      { label: "เปรียบเทียบซีรีส์", href: "/panel-pc-gtg", icon: BarChart3, primary: true },
      { label: "ดู UTC Series", href: "/utc-series", icon: Search, primary: false },
    ],
  },
  {
    title: "iBox Series",
    subtitle: "Embedded Fanless Box PC",
    icon: Server,
    href: "/ibox-series",
    image: imgIBox,
    models: [
      { name: "AI Edge / GPU", href: "/ibox-series" },
      { name: "Embedded Box", href: "/ibox-series" },
      { name: "Gateway / DIN Rail", href: "/ibox-series" },
      { name: "PoE Multi-LAN", href: "/ibox-series" },
    ],
    cta: [
      { label: "ดูทั้งหมด", href: "/ibox-series", icon: BarChart3, primary: true },
    ],
  },
  {
    title: "EPC Box Series",
    subtitle: "Compact Industrial PC",
    icon: Box,
    href: "/epc-box-series",
    image: imgEPC,
    models: [
      { name: "EPC-30XA", href: "/epc-box-series" },
      { name: "EPC-T40XX", href: "/epc-box-series" },
      { name: "EPC Series", href: "/epc-series" },
    ],
    cta: [
      { label: "ดูทั้งหมด", href: "/epc-box-series", icon: BarChart3, primary: true },
    ],
  },
  {
    title: "Rugged Devices",
    subtitle: "Tablet · Notebook · Handheld",
    icon: TabletSmartphone,
    href: "/rugged-tablet",
    image: imgRugged,
    models: [
      { name: "Rugged Tablet", href: "/rugged-tablet" },
      { name: "Rugged Notebook", href: "/rugged-notebook" },
      { name: "Handheld PDA", href: "/handheld" },
    ],
    cta: [
      { label: "Tablet", href: "/rugged-tablet", icon: BarChart3, primary: true },
      { label: "Notebook", href: "/rugged-notebook", icon: Search, primary: false },
    ],
  },
  {
    title: "Smart Display & Kiosk",
    subtitle: "Digital Signage · Outdoor",
    icon: Tv,
    href: "/smart-display",
    image: imgSmart,
    models: [
      { name: "Indoor", href: "/smart-display" },
      { name: "Outdoor", href: "/smart-display?tab=outdoor" },
      { name: "KIOSK", href: "/smart-display?tab=kiosk" },
    ],
    cta: [
      { label: "ดูทั้งหมด", href: "/smart-display", icon: BarChart3, primary: true },
    ],
  },
  {
    title: "Mini PC Firewall",
    subtitle: "Network Security Appliance",
    icon: Shield,
    href: "/minipc-firewall",
    image: imgFirewall,
    models: [
      { name: "GT194L", href: "/minipc-firewall" },
      { name: "GT196L", href: "/minipc-firewall" },
      { name: "IPC068", href: "/minipc-firewall" },
    ],
    cta: [
      { label: "ดูทั้งหมด", href: "/minipc-firewall", icon: BarChart3, primary: true },
    ],
  },
];

const ProductLineup = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 340;
    el.scrollBy({ left: dir === "left" ? -cardWidth - 20 : cardWidth + 20, behavior: "smooth" });
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-surface/50">
      <div className="container max-w-7xl mx-auto">
        {/* Header + Nav arrows */}
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">
              Product Finder
            </span>
            <h2 className="text-2xl md:text-4xl font-display font-bold">
              เลือกรุ่น<span className="text-gradient">ที่ใช่</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-xl">
              เปรียบเทียบสเปก เลือกรุ่นที่เหมาะกับงาน พร้อมเครื่องมือช่วยตัดสินใจ
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
              aria-label="เลื่อนไปทางซ้าย"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
              aria-label="เลื่อนไปทางขวา"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4"
        >
          {lineupCategories.map((cat) => (
            <div
              key={cat.title}
              className="card-surface rounded-xl overflow-hidden snap-start shrink-0 w-[320px] sm:w-[340px] flex flex-col"
            >
              {/* Image banner */}
              <Link to={cat.href} className="relative h-36 overflow-hidden block group">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute bottom-3 left-4 z-10">
                  <div className="flex items-center gap-2 mb-0.5">
                    <cat.icon size={16} className="text-primary" />
                    <h3 className="text-base font-display font-bold text-foreground">{cat.title}</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{cat.subtitle} · {cat.models.length} หมวด</p>
                </div>
              </Link>

              <div className="p-4 flex flex-col flex-1">
                {/* CTAs */}
              >
                <div className="flex gap-2 mb-3">
                  {cat.cta.map((c) => (
                    <Link
                      key={c.label}
                      to={c.href}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        c.primary
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-primary/30 text-primary hover:bg-primary/10"
                      }`}
                    >
                      <c.icon size={13} /> {c.label}
                    >
                    </Link>
                  ))}
                </div>

                {/* Model chips */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {cat.models.map((model) => (
                    <Link
                      key={model.name}
                      to={model.href}
                      className="relative inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      {model.name}
                      {"badge" in model && (model as any).badge && (
                        <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-primary text-primary-foreground leading-none">
                          {(model as any).badge}
                        >
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile bottom arrows */}
        <div className="flex sm:hidden items-center justify-end gap-2 mt-3">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-30 disabled:pointer-events-none"
            aria-label="เลื่อนไปทางซ้าย"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-30 disabled:pointer-events-none"
            aria-label="เลื่อนไปทางขวา"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductLineup;

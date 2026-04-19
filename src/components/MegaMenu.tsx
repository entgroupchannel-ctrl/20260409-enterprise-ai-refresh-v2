import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Cpu, Monitor, Shield, Tablet, Wifi, Server, Box, Layers,
  Factory, Zap, ChevronRight, ArrowRight, Sparkles, Tv, Sun,
  Droplets, UtensilsCrossed, Headset, ShieldCheck, Users, Handshake
} from "lucide-react";

import imgGT from "@/assets/gt-series-mega-menu.jpg";
import imgFirewall from "@/assets/product-firewall.jpg";
import imgSmart from "@/assets/product-smart-display.jpg";
import imgRugged from "@/assets/product-rugged.jpg";
import imgVCloud from "@/assets/product-vcloudpoint.jpg";
import imgJetson from "@/assets/jetson-mega-menu.jpg";

import bannerIndustrial from "@/assets/banner-industrial.jpg";
import bannerNetwork from "@/assets/banner-network.jpg";
import bannerDisplay from "@/assets/banner-display.jpg";
import bannerRugged from "@/assets/banner-rugged.jpg";
import bannerSolution from "@/assets/banner-solution.jpg";

/* ═══════ Menu Data ═══════ */
const menuCategories = [
  {
    id: "industrial",
    label: "Industrial PC",
    tagline: "คอมพิวเตอร์เกรดอุตสาหกรรม",
    icon: Cpu,
    featured: {
      title: "GT Series",
      desc: "Mini PC Fanless ถึก ทน แกร่ง — 12 รุ่น ครอบคลุมทุกงาน",
      href: "/gt-series",
      badge: "Best Seller",
      image: imgGT,
    },
    columns: [
      {
        heading: "Mini PC — Fanless",
        links: [
          { label: "GT Series — 12 รุ่น", href: "/gt-series", hot: true },
          { label: "GB Series — Compact", href: "/gb-series" },
          { label: "iBox Series", href: "/ibox-series" },
          { label: "EPC Box Series", href: "/epc-box-series" },
        ],
      },
      {
        heading: "Panel PC & Display",
        links: [
          { label: "GK Series — Panel PC", href: "/gk-series", hot: true },
          { label: "Panel PC GTG/GTY", href: "/panel-pc-gtg" },
          { label: "EPC Panel PC Series", href: "/epc-series" },
          { label: "Waterproof PC IP69K", href: "/waterproof-pc" },
          { label: "UTC Series", href: "/utc-series" },
        ],
      },
      {
        heading: "All-in-One PC",
        links: [
          { label: "All-in-One PC — ดูทั้งหมด", href: "/aio", hot: true },
          { label: "H10PRO — 10\" Android", href: "/aio/h10pro" },
          { label: "EM-P21A — 21.5\" Panel", href: "/aio/em-p21a" },
          { label: "F15 — 15\" AIO", href: "/aio/f15" },
          { label: "Panel PC — Cabinet", href: "/cabinets" },
        ],
      },
    ],
  },
  {
    id: "network",
    label: "Network & Security",
    tagline: "ระบบเครือข่ายและความปลอดภัย",
    icon: Shield,
    featured: {
      title: "Mini PC Firewall",
      desc: "pfSense / OPNsense Ready — Fanless 2.5G/10G พร้อม Smart Filter",
      href: "/minipc-firewall",
      badge: "Smart Filter",
      image: imgFirewall,
    },
    columns: [
      {
        heading: "Firewall & Router",
        links: [
          { label: "Mini PC Firewall — 10 รุ่น", href: "/minipc-firewall", hot: true },
          { label: "GT194L — 2.5G Best Seller", href: "/minipc-firewall" },
          { label: "IPC068 — N100 Fanless", href: "/minipc-firewall" },
          { label: "IPC090 — Xeon 10G SFP+", href: "/minipc-firewall" },
        ],
      },
      {
        heading: "Industrial Switch",
        links: [
          { label: "Volktek — Managed Switch", href: "/volktek" },
          { label: "Unmanaged Switch", href: "/volktek" },
          { label: "PoE Switch", href: "/volktek" },
        ],
      },
      {
        heading: "Network Appliance",
        links: [
          { label: "iBox Gateway / DIN Rail", href: "/ibox-series", hot: true },
          { label: "iBox PoE & Multi-LAN", href: "/ibox-series" },
          { label: "Edge AI Computing", href: "/ibox-series" },
        ],
      },
    ],
  },
  {
    id: "jetson",
    label: "NVIDIA Jetson",
    tagline: "Edge AI & GPU Computing — Authorized Partner",
    icon: Sparkles,
    featured: {
      title: "NVIDIA Jetson Orin & Thor",
      desc: "โมดูล AI Edge ตั้งแต่ Nano (67 TOPS) ถึง Thor (2070 TFLOPS) พร้อม NGC Models 25+ ตัว",
      href: "/nvidia-jetson",
      badge: "Edge AI",
      image: imgJetson,
    },
    columns: [
      {
        heading: "เริ่มต้นที่นี่",
        links: [
          { label: "แนะนำ NVIDIA Jetson", href: "/nvidia-jetson", hot: true },
          { label: "📦 แคตตาล็อกผลิตภัณฑ์", href: "/nvidia-jetson/products", hot: true },
          { label: "Jetson Modules (SoM)", href: "/nvidia-jetson/products?cat=modules" },
          { label: "Developer Kits", href: "/nvidia-jetson/products?cat=devkits" },
          { label: "Embedded IPC / Edge AI", href: "/nvidia-jetson/products?cat=embedded-systems" },
          { label: "GPU Server & Workstation", href: "/nvidia-jetson/gpu-server" },
          { label: "Professional Graphics Card", href: "/nvidia-jetson/professional-gpu" },
        ],
      },
      {
        heading: "โซลูชัน & ตัวอย่างใช้งาน",
        links: [
          { label: "✦ Solutions — ดูทั้งหมด", href: "/nvidia-jetson/solutions", hot: true },
          { label: "Smart Manufacturing AI", href: "/nvidia-jetson/solutions#industrial" },
          { label: "Smart Surveillance / CCTV", href: "/nvidia-jetson/solutions#security" },
          { label: "Robot / Drone / Medical", href: "/nvidia-jetson/solutions#drone" },
          { label: "Case Studies", href: "/nvidia-jetson/case-studies" },
        ],
      },
      {
        heading: "หาเครื่องมือ & ปรึกษา",
        links: [
          { label: "✦ ตัวช่วยเลือกรุ่น (Wizard)", href: "/nvidia-jetson/recommend", hot: true },
          { label: "AI Models สำเร็จรูป (NGC)", href: "/nvidia-jetson/ai-ready" },
        ],
      },
    ],
  },
  {
    id: "display",
    label: "Smart Display",
    tagline: "จอแสดงผลอุตสาหกรรม & KIOSK",
    icon: Tv,
    featured: {
      title: "Smart Display & KIOSK",
      desc: "จอ Digital Signage Indoor/Outdoor ความสว่างสูง พร้อมซอฟต์แวร์จัดการเนื้อหาฟรี",
      href: "/smart-display",
      badge: "Signage",
      image: imgSmart,
    },
    columns: [
      {
        heading: "Indoor Display",
        links: [
          { label: "Digital Signage 35\"–75\"", href: "/smart-display", hot: true },
          { label: "Stretched Bar Display", href: "/smart-display" },
          { label: "Standing Kiosk", href: "/smart-display?tab=kiosk" },
        ],
      },
      {
        heading: "Outdoor Monitor",
        links: [
          { label: "Outdoor 12\"–32\" (1500 Nits)", href: "/smart-display?tab=outdoor", hot: true },
          { label: "Window Display", href: "/smart-display" },
        ],
      },
      {
        heading: "Industrial Grade",
        links: [
          { label: "Stainless Steel IP69K", href: "/smart-display" },
          { label: "Food Grade Display", href: "/smart-display" },
          { label: "Touch Monitor FPM Series", href: "/smart-display" },
        ],
      },
    ],
  },
  {
    id: "rugged",
    label: "Rugged Device",
    tagline: "อุปกรณ์ทนทานเกรดทหาร",
    icon: Tablet,
    featured: {
      title: "Rugged Tablet & Notebook",
      desc: "กันน้ำ กันกระแทก MIL-STD-810G/H — Windows & Android สำหรับภาคสนามและโลจิสติกส์",
      href: "/rugged-tablet",
      badge: "MIL-STD",
      image: imgRugged,
    },
    columns: [
      {
        heading: "Handheld & PDA",
        links: [
          { label: "W65G — Windows Handheld", href: "/handheld/w65g" },
          { label: "A55GT — 5G Android IP68", href: "/handheld/a55gt", hot: true },
          { label: "P40AT — PDA Scanner", href: "/handheld/p40at" },
          { label: "EM-P2 Pro — 5G Phone", href: "/handheld/em-p2-pro" },
          { label: "ดูทั้งหมด →", href: "/handheld", hot: true },
        ],
      },
      {
        heading: "Rugged Tablet",
        links: [
          { label: "F9E Elite — i5 Gen 12", href: "/rugged-tablet", hot: true },
          { label: "W109U — i5/i7 IP68", href: "/rugged-tablet" },
          { label: "F9A — Alder Lake N100", href: "/rugged-tablet" },
          { label: "A109T — Android 14", href: "/rugged-tablet" },
        ],
      },
      {
        heading: "Rugged Notebook",
        links: [
          { label: "EM-X15M — AI PC i7", href: "/rugged-notebook", hot: true },
          { label: "EM-X14A — 14\" Compact", href: "/rugged-notebook" },
          { label: "EM-X14M — 2-in-1 Tablet PC", href: "/rugged-notebook" },
          { label: "ดูทั้งหมด →", href: "/rugged-notebook", hot: true },
        ],
      },
    ],
  },
  {
    id: "solution",
    label: "Solutions",
    tagline: "โซลูชันครบวงจร",
    icon: Layers,
    featured: {
      title: "vCloudPoint",
      desc: "1 เครื่อง PC รองรับ 30 คน — ลดต้นทุน 60% ประหยัดไฟ 80%",
      href: "/vcloudpoint",
      badge: "Zero Client",
      image: imgVCloud,
    },
    columns: [
      {
        heading: "Shared Computing",
        links: [
          { label: "vCloudPoint Zero Client", href: "/vcloudpoint", hot: true },
          { label: "S100 — Entry Level", href: "/vcloudpoint" },
          { label: "A1 — Performance", href: "/vcloudpoint" },
          { label: "vMatrix Manager", href: "/vcloudpoint" },
        ],
      },
      {
        heading: "Mini PC สำนักงาน",
        links: [
          { label: "Mini PC — Office & SME", href: "/mini-pc", hot: true },
          { label: "ตารางราคา Mini PC", href: "/mini-pc" },
          { label: "Mini PC Firewall", href: "/minipc-firewall" },
        ],
      },
      {
        heading: "เครื่องมือ & บริการ",
        links: [
          { label: "🛒 Shop — สั่งซื้อออนไลน์", href: "/shop", hot: true },
          { label: "✦ ช่วยเลือกสินค้าที่ใช่", href: "/product-advisor", hot: true },
          { label: "ขอใบเสนอราคา", href: "/request-quote" },
          { label: "โปรโมชั่น", href: "/promotions" },
          { label: "เกี่ยวกับเรา", href: "/about-us" },
        ],
      },
      {
        heading: "B2B & ความรู้",
        links: [
          { label: "กรณีศึกษาลูกค้า", href: "/case-studies", hot: true },
          
          { label: "บทความเทคนิค", href: "/blog" },
        ],
      },
    ],
  },
];

const b2bBanners: Record<string, { icon: typeof Headset; title: string; desc: string }> = {
  industrial: { icon: Headset, title: "ผู้เชี่ยวชาญช่วยเลือกสเปก", desc: "ทีมวิศวกรพร้อมให้คำปรึกษา เลือกรุ่นที่ตรงกับ TOR" },
  network: { icon: ShieldCheck, title: "รับประกันหลังการขาย", desc: "ซ่อม เปลี่ยน ดูแลอย่างมืออาชีพ 1–3 ปี" },
  display: { icon: Users, title: "ลูกค้าองค์กรชั้นนำไว้วางใจ", desc: "หน่วยงานรัฐ โรงงาน โรงพยาบาล ใช้สินค้าของเรา" },
  rugged: { icon: Handshake, title: "B2B ราคาพิเศษสำหรับโครงการ", desc: "สั่งซื้อจำนวนมาก ราคาดีกว่า พร้อมเทรนนิ่ง" },
  solution: { icon: Headset, title: "ทดลองฟรี 30 วัน", desc: "ลองก่อนตัดสินใจ ไม่มีค่าใช้จ่าย มีทีมติดตั้งให้" },
  jetson: { icon: Sparkles, title: "Authorized NVIDIA Partner", desc: "ทีมวิศวกร AI พร้อมให้คำปรึกษาและทดสอบ POC ฟรี" },
};

const promoBanners: Record<string, { image: string; title: string; desc: string; href: string }> = {
  industrial: { image: bannerIndustrial, title: "Mini PC Fanless เกรดอุตสาหกรรม", desc: "ถึก ทน แกร่ง — 12 รุ่นครอบคลุมทุกงาน", href: "/gt-series" },
  network: { image: bannerNetwork, title: "Firewall & Network Security", desc: "pfSense / OPNsense Ready — ปกป้องเครือข่ายของคุณ", href: "/minipc-firewall" },
  display: { image: bannerDisplay, title: "Smart Display & Digital Signage", desc: "จอ Indoor/Outdoor ความสว่างสูง พร้อมซอฟต์แวร์ฟรี", href: "/smart-display" },
  rugged: { image: bannerRugged, title: "Rugged Tablet & Notebook", desc: "กันน้ำ กันกระแทก MIL-STD — สำหรับภาคสนาม", href: "/rugged-tablet" },
  solution: { image: bannerSolution, title: "vCloudPoint Zero Client", desc: "1 เครื่อง PC รองรับ 30 คน — ลดต้นทุน 60%", href: "/vcloudpoint" },
};

/* ═══════ Component ═══════ */
const MegaMenu = ({
  onNavigate,
}: {
  onNavigate?: () => void;
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(id);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
  };

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = menuCategories.find((c) => c.id === activeMenu);

  return (
    <div ref={menuRef} className="relative">
      {/* Nav items */}
      <div className="flex items-center gap-0.5 flex-nowrap">
        {menuCategories.map((cat) => (
          <button
            key={cat.id}
            onMouseEnter={() => handleEnter(cat.id)}
            onClick={() => setActiveMenu(activeMenu === cat.id ? null : cat.id)}
            className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeMenu === cat.id
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Mega dropdown overlay */}
      {active && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 ${
            active.columns.length >= 4 ? "w-[min(1180px,95vw)]" : "w-[min(900px,90vw)]"
          }`}
          onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
          onMouseLeave={handleLeave}>
          {/* Panel */}
          <div className="rounded-xl bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-[hsl(220,20%,13%)] dark:via-[hsl(220,18%,10%)] dark:to-[hsl(220,20%,8%)] border border-gray-200 dark:border-white/10 shadow-2xl animate-fade-in overflow-y-auto max-h-[80vh]">
            <div className="p-5">
              {/* Category header */}
              <div className="flex items-center gap-2 mb-4">
                <active.icon size={16} className="text-primary" />
                <h3 className="text-foreground font-bold text-sm">{active.label}</h3>
                <span className="text-muted-foreground text-xs">— {active.tagline}</span>
              </div>

              <div className="grid grid-cols-12 gap-5">
                {/* Featured card — left (compact) */}
                <div className="col-span-3">
                  <Link
                    to={active.featured.href}
                    onClick={() => { setActiveMenu(null); onNavigate?.(); }}
                    className="group block rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-4 hover:border-primary/40 transition-all duration-300 h-full">
                    <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                      {active.featured.badge}
                    </span>
                    {active.featured.image && (
                      <div className="flex justify-center my-3">
                        <img
                          src={active.featured.image}
                          alt={active.featured.title}
                          className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <h4 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {active.featured.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                      {active.featured.desc}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-1.5 transition-all">
                      ดูเพิ่มเติม <ArrowRight size={11} />
                    </span>
                  </Link>
                </div>

                {/* Product columns — right */}
                <div className={`col-span-9 grid gap-4 ${active.columns.length >= 4 ? "grid-cols-4" : "grid-cols-3"}`}>

                  {active.columns.map((col) => (
                    <div key={col.heading}>

                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">
                        {col.heading}
                      </h5>
                      <ul className="space-y-0.5">
                        {col.links.map((link) => (
                          <li key={link.href + link.label}>

                            <Link
                              to={link.href}
                              onClick={() => { setActiveMenu(null); onNavigate?.(); }}
                              className="group flex items-center gap-1.5 py-1.5 px-2 -mx-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                              <ChevronRight size={10} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
                              <span className="text-xs font-medium">{link.label}</span>
                              {link.hot && (
                                <span className="px-1 py-0.5 rounded text-[7px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                                  Hot
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* B2B Banner — fills empty column space */}
                  {active.columns.length < 3 && b2bBanners[active.id] && (() => {
                    const banner = b2bBanners[active.id];
                    const BannerIcon = banner.icon;
                    return (
                      <Link
                        to="/about-us"
                        onClick={() => { setActiveMenu(null); onNavigate?.(); }}
                        className="group col-span-1 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/15 p-3 flex flex-col justify-center hover:border-primary/30 transition-all">
                        <BannerIcon size={18} className="text-primary mb-2" />
                        <p className="text-xs font-bold text-foreground mb-1">{banner.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{banner.desc}</p>
                        <span className="text-[10px] text-primary font-semibold group-hover:underline flex items-center gap-1">
                          เกี่ยวกับเรา <ArrowRight size={9} />
                        </span>
                      </Link>
                    );
                  })()}
                </div>
              </div>

              {/* Category-specific Image Banner */}
              {promoBanners[active.id] && (() => {
                const promo = promoBanners[active.id];
                return (
                  <Link
                    to={promo.href}
                    onClick={() => { setActiveMenu(null); onNavigate?.(); }}
                    className="group mt-4 block rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 relative h-24">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between h-full px-5">
                      <div>
                        <p className="text-sm font-bold text-white">{promo.title}</p>
                        <p className="text-[11px] text-white/70 mt-0.5">{promo.desc}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs text-white font-semibold group-hover:underline flex items-center gap-1 bg-primary/80 px-3 py-1.5 rounded-lg">
                        ดูสินค้า <ArrowRight size={11} />
                      </span>
                    </div>
                  </Link>
                );
              })()}

              {/* Bottom quick links */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] text-gray-400 dark:text-white/25">
                  <span className="flex items-center gap-1"><Factory size={10} /> แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร</span>
                  <span className="flex items-center gap-1"><Zap size={10} /> รับประกัน 1–3 ปี</span>
                  <span className="flex items-center gap-1"><Server size={10} /> สต๊อกพร้อมส่งในไทย</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════ Mobile Mega Menu ═══════ */
export const MobileMegaMenu = ({ onNavigate }: { onNavigate?: () => void }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      {menuCategories.map((cat) => (
        <div key={cat.id}>

          <button
            onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
            className="w-full flex items-center justify-between py-3 px-2 text-foreground font-medium rounded-lg hover:bg-secondary/50 transition-colors">
            <span className="flex items-center gap-2">
              <cat.icon size={16} className="text-primary" />
              {cat.label}
            </span>
            <ChevronRight
              size={14}
              className={`text-muted-foreground transition-transform duration-200 ${expanded === cat.id ? "rotate-90" : ""}`}
            />
          </button>
          {expanded === cat.id && (
            <div className="pl-6 pb-3 space-y-1 animate-fade-in">
              {/* Featured */}
              <Link
                to={cat.featured.href}
                onClick={onNavigate}
                className="block p-3 rounded-lg bg-primary/10 border border-primary/20 mb-2">
                <span className="text-[9px] font-bold uppercase text-primary">{cat.featured.badge}</span>
                <p className="text-sm font-bold text-foreground">{cat.featured.title}</p>
                <p className="text-xs text-muted-foreground">{cat.featured.desc}</p>
              </Link>
              {cat.columns.map((col) =>
                col.links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={onNavigate}
                    className="flex items-center gap-2 py-2 px-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/50 transition-colors">
                    <ChevronRight size={10} className="text-primary/50" />
                    {link.label}
                    {link.hot && (
                      <span className="px-1 py-0.5 rounded text-[7px] font-bold bg-red-500/20 text-red-400">Hot</span>
                    )}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      ))}
      <Link
        to="/promotions"
        onClick={onNavigate}
        className="flex items-center gap-2 py-3 px-2 text-foreground font-medium rounded-lg hover:bg-secondary/50">
        <Sparkles size={16} className="text-primary" />
        โปรโมชั่น
      </Link>
    </div>
  );
};

export default MegaMenu;


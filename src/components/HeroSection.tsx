import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import MegaMenu, { MobileMegaMenu } from "@/components/MegaMenu";
import heroIndustrial from "@/assets/hero-industrial.jpg";
import logo from "@/assets/logo-entgroup.avif";

const searchIndex = [
  { keywords: ["mini pc", "มินิพีซี", "สำนักงาน", "office", "thin client"], label: "Mini PC สำนักงาน", href: "/mini-pc" },
  { keywords: ["gt", "gt series", "industrial pc", "โรงงาน", "fanless", "ทนร้อน", "ทนฝุ่น", "อุตสาหกรรม"], label: "GT Series — Industrial Mini PC", href: "/gt-series" },
  { keywords: ["gb", "gb series", "compact", "คอมแพค"], label: "GB Series — Compact PC", href: "/gb-series" },
  { keywords: ["epc", "epc box", "embedded"], label: "EPC Box Series", href: "/epc-box-series" },
  { keywords: ["epc series"], label: "EPC Series", href: "/epc-series" },
  { keywords: ["gk", "gk series", "kiosk", "panel pc"], label: "GK Series — Industrial Panel PC", href: "/gk-series" },
  { keywords: ["panel pc", "touch screen", "จอสัมผัส", "หน้าจอ"], label: "Panel PC GTG Touch", href: "/panel-pc-gtg" },
  { keywords: ["tablet", "rugged tablet", "แท็บเล็ต", "กันน้ำ", "ทนทาน"], label: "Rugged Tablet", href: "/rugged-tablet" },
  { keywords: ["handheld", "pda", "มือถือ", "สแกน"], label: "Rugged Handheld", href: "/handheld" },
  { keywords: ["firewall", "network", "เครือข่าย", "ไฟร์วอลล์", "vpn", "pfsense", "opnsense"], label: "Mini PC Firewall", href: "/minipc-firewall" },
  { keywords: ["volktek", "switch", "สวิตช์", "industrial switch", "โรงงาน"], label: "Volktek Industrial Switch", href: "/volktek" },
  { keywords: ["vcloudpoint", "zero client", "thin client", "ประหยัด"], label: "vCloudPoint Zero Client", href: "/vcloudpoint" },
  { keywords: ["smart display", "digital signage", "ป้ายดิจิตอล"], label: "Smart Display", href: "/smart-display" },
  { keywords: ["utc", "utc series", "all-in-one"], label: "UTC Series — AIO Touch PC", href: "/utc-series" },
  { keywords: ["waterproof", "กันน้ำ", "สแตนเลส", "stainless", "food"], label: "Waterproof PC", href: "/waterproof-pc" },
  { keywords: ["ibox", "embedded", "fanless"], label: "iBox Fanless PC", href: "/ibox-series" },
  { keywords: ["notebook", "laptop", "โน้ตบุ๊ค", "rugged notebook"], label: "Rugged Notebook", href: "/rugged-notebook" },
  { keywords: ["aio", "all in one", "ออลอินวัน"], label: "All-in-One PC", href: "/aio" },
  { keywords: ["โปรโมชั่น", "promotion", "ลดราคา", "sale"], label: "โปรโมชั่นพิเศษ", href: "/promotions" },
  { keywords: ["pos", "ร้านค้า", "ขายของ"], label: "Panel PC สำหรับ POS ร้านค้า", href: "/panel-pc-gtg" },
];

const searchTags = [
  { label: "Mini PC สำนักงาน", href: "/mini-pc" },
  { label: "Industrial PC ทนร้อนทนฝุ่น", href: "/gt-series" },
  { label: "Panel PC จอสัมผัสโรงงาน", href: "/panel-pc-gtg" },
  { label: "Firewall สำหรับ SME", href: "/minipc-firewall" },
  { label: "Zero Client ประหยัดพลังงาน", href: "/vcloudpoint" },
  { label: "Rugged Tablet กันน้ำกันกระแทก", href: "/rugged-tablet" },
];

const navLinks = [
  { label: "โปรโมชั่น", href: "/promotions" },
  { label: "ติดต่อเรา", href: "/contact" },
];

const heroStats = [
  { value: "8,000+", label: "ลูกค้าองค์กร" },
  { value: "13+", label: "ปีประสบการณ์" },
  { value: "> 600 SKU", label: "รายการสินค้า" },
  { value: "OEM", label: "ราคาจากผู้ผลิตโดยตรง" },
];

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(true);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setTagsExpanded(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim().length >= 1
    ? searchIndex
        .filter((item) => {
          const q = searchQuery.toLowerCase();
          return item.label.toLowerCase().includes(q) || item.keywords.some((keyword) => keyword.includes(q));
        })
        .slice(0, 8)
    : [];

  const handleSearch = () => {
    if (searchResults.length > 0) {
      navigate(searchResults[0].href);
      setSearchQuery("");
      setSearchOpen(false);
      return;
    }

    if (searchQuery.trim()) {
      navigate(`/contact?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setSearchOpen(false);
  };

  return (
    <section className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0">
        <img
          src={heroIndustrial}
          alt="Industrial Computing Production Line"
          className="w-full h-full object-cover"

          width={1920}
          height={900}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-black/40" />
      </div>

      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="ENT GROUP" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <MegaMenu />
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-6 bg-white/10 mx-1" />
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-30 bg-card border-b border-border p-6 animate-fade-in max-h-[80vh] overflow-y-auto">
          <MobileMegaMenu onNavigate={() => setMobileMenuOpen(false)} />
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <ThemeToggle />
          </div>
        </div>
      )}

      <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 lg:px-20">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 py-16 md:py-0">
          <div className="max-w-2xl">
            <p className="text-sm md:text-base text-primary font-semibold tracking-widest uppercase mb-4 animate-fade-up">
              B2B Industrial Platform — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร
            </p>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[1.1] mb-6 animate-fade-up text-white"
              style={{ animationDelay: "0.1s" }}>
            >
              โซลูชัน <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--accent))]">Industrial Computing</span>
              <br />
              สำหรับประเทศไทย
            </h1>

            <p
              className="text-lg md:text-xl text-white/70 max-w-xl mb-10 animate-fade-up leading-relaxed"
              style={{ animationDelay: "0.2s" }}>
            >
              พันธมิตรธุรกิจที่คุณไว้วางใจ — Mini PC, Panel PC, Rugged Device และซอฟต์แวร์ครบวงจร สำหรับงานโรงงาน งานประมูล และงานโครงการ
            </p>

            <div ref={searchRef} className="relative max-w-xl mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
                <Search className="ml-4 text-white/50" size={20} />
                <input
                  type="text"
                  placeholder="บอกความต้องการ เช่น Mini PC โรงงาน, Firewall SME..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}>
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-white/40 outline-none text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-6 py-4 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  ค้นเลย
                </button>
              </div>

              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                  {searchResults.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        navigate(item.href);
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}>
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary/10 transition-colors border-b border-border/50 last:border-0"
                    >
                      <Search size={14} className="text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: "0.35s" }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                ปรึกษาผู้เชี่ยวชาญ
              </Link>
              <Link
                to="/promotions"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/80 text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                ดูโปรโมชั่น
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 mt-12 animate-fade-up" style={{ animationDelay: "0.5s" }}>
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-display font-black text-primary">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 transition-all duration-500 ease-in-out ${tagsExpanded ? "translate-x-0" : "translate-x-[calc(100%-28px)]"}`}>
            <button
              type="button"
              onClick={() => setTagsExpanded((prev) => !prev)}
              className="flex items-center justify-center w-7 shrink-0 rounded-l-xl bg-white/10 backdrop-blur-md border border-r-0 border-white/15 text-white/50 hover:text-white hover:bg-white/20 transition-colors"

              title="สินค้ายอดนิยม"
            >
              <ChevronDown size={14} className={`transition-transform duration-300 ${tagsExpanded ? "rotate-90" : "-rotate-90"}`} />
            </button>
            <div className="flex flex-col gap-2 p-3 rounded-l-xl bg-black/40 backdrop-blur-xl border border-r-0 border-white/10">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-white/40">สินค้ายอดนิยม</p>
              {searchTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => navigate(tag.href)}
                  className="text-left px-3 py-2 rounded-lg bg-white/5 text-white/80 text-xs border border-white/10 hover:bg-white/15 hover:border-white/25 hover:text-white transition-all whitespace-nowrap"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:hidden animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {searchTags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => navigate(tag.href)}
                className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all backdrop-blur-sm"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-8 animate-bounce">
        <a href="#products" className="text-white/40 hover:text-white/70 transition-colors" aria-label="Scroll to products">
          <ChevronDown size={28} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;


import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown, LogIn, UserCircle, LayoutDashboard, LogOut, FileText, Plus, User, Tag, Mail, ShoppingCart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CartBadge from "@/components/CartBadge";
import ThemeToggle from "@/components/ThemeToggle";
import MegaMenu, { MobileMegaMenu } from "@/components/MegaMenu";
import { useAuth } from "@/hooks/useAuth";
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
  { keywords: ["firewall", "network", "เครือข่าย", "ไฟร์วอลล์", "vpn", "pfsense", "opnsense"], label: "Mini PC Firewall", href: "/mini-pc-firewall" },
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
  { label: "Firewall สำหรับ SME", href: "/mini-pc-firewall" },
  { label: "Zero Client ประหยัดพลังงาน", href: "/vcloudpoint" },
  { label: "Rugged Tablet กันน้ำกันกระแทก", href: "/rugged-tablet" },
];

const navLinks = [
  { label: "โปรโมชั่น", href: "/promotions", icon: Tag, hint: "ดูโปรโมชั่น & ส่วนลดล่าสุด" },
  { label: "ติดต่อเรา", href: "/contact", icon: Mail, hint: "สอบถาม / ขอใบเสนอราคา / ติดต่อทีมขาย" },
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
  const { user, profile, signOut, loading: authLoading } = useAuth();

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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-300 via-slate-500 to-slate-800 dark:from-slate-600 dark:via-slate-800 dark:to-slate-950" />
        <img
          src={heroIndustrial}
          alt="Industrial Computing Production Line"
          className="w-full h-full object-cover mix-blend-overlay opacity-70"
          width={1920}
          height={900}
        />
        {/* Top stays light to keep logo visible; darkens toward bottom-right for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/55" />
      </div>

      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="ENT GROUP" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <div className="[&_button]:!text-white/90 [&_button:hover]:!text-white [&_button]:[text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
            <MegaMenu />
          </div>
          <TooltipProvider delayDuration={150}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Tooltip key={link.label}>
                  <TooltipTrigger asChild>
                    <Link
                      to={link.href}
                      aria-label={link.label}
                      className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                    >
                      <Icon size={18} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p className="font-medium">{link.label}</p>
                    <p className="text-muted-foreground text-[10px]">{link.hint}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/request-quote"
                  aria-label="ขอใบเสนอราคา"
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  <FileText size={18} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p className="font-medium">ขอใบเสนอราคา</p>
                <p className="text-muted-foreground text-[10px]">ทีมขายตอบกลับภายใน 24 ชม.</p>
              </TooltipContent>
            </Tooltip>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex"><ThemeToggle /></span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">สลับโหมด สว่าง / มืด</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex"><CartBadge className="text-white/70 hover:text-white transition-colors p-2" /></span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">ตะกร้าใบเสนอราคา</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {!authLoading && (
            user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                  <UserCircle size={18} />
                  <span className="max-w-[100px] truncate">{profile?.full_name || user.email?.split('@')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {(profile?.role === 'admin' || profile?.role === 'sales') && (
                    <>
                      <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors rounded-t-lg">
                        <LayoutDashboard size={16} /> แดชบอร์ด
                      </Link>
                      <Link to="/admin/quotes" className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <FileText size={16} /> จัดการใบเสนอราคา
                      </Link>
                    </>
                  )}
                  {profile?.role === 'member' && (
                    <>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors rounded-t-lg">
                        <User size={16} /> โปรไฟล์ของฉัน
                      </Link>
                      <Link to="/cart" className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <FileText size={16} /> ตะกร้าสินค้า
                      </Link>
                      <Link to="/my-quotes" className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <FileText size={16} /> ใบเสนอราคาของฉัน
                      </Link>
                      <Link to="/request-quote" className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <Plus size={16} /> ขอใบเสนอราคาใหม่
                      </Link>
                    </>
                  )}
                  <div className="border-t border-border" />
                  <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors w-full text-left rounded-b-lg">
                    <LogOut size={16} /> ออกจากระบบ
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary/80 hover:bg-primary transition-colors">
                <LogIn size={16} /> เข้าสู่ระบบ
              </Link>
            )
          )}
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
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <ShoppingCart size={18} /> เลือกซื้อสินค้า
          </Link>
          <MobileMegaMenu onNavigate={() => setMobileMenuOpen(false)} />
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <ThemeToggle />
            {!authLoading && (
              user ? (
                <div className="flex flex-col gap-2 flex-1">
                  {(profile?.role === 'admin' || profile?.role === 'sales') && (
                    <>
                      <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <LayoutDashboard size={16} /> แดชบอร์ด
                      </Link>
                      <Link to="/admin/quotes" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <FileText size={16} /> จัดการใบเสนอราคา
                      </Link>
                    </>
                  )}
                  {profile?.role === 'member' && (
                    <>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <User size={16} /> โปรไฟล์ของฉัน
                      </Link>
                      <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <FileText size={16} /> ตะกร้าสินค้า
                      </Link>
                      <Link to="/my-quotes" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <FileText size={16} /> ใบเสนอราคาของฉัน
                      </Link>
                      <Link to="/request-quote" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <Plus size={16} /> ขอใบเสนอราคาใหม่
                      </Link>
                    </>
                  )}
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-muted transition-colors">
                    <LogOut size={16} /> ออกจากระบบ
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <LogIn size={16} /> เข้าสู่ระบบ
                </Link>
              )
            )}
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
              โซลูชัน <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--accent))]">Industrial Computing</span>
              <br />
              สำหรับประเทศไทย
            </h1>

            <p
              className="text-lg md:text-xl text-white/70 max-w-xl mb-10 animate-fade-up leading-relaxed"
              style={{ animationDelay: "0.2s" }}>
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
                  }}
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
                      }}
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
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                เลือกซื้อสินค้า
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/80 text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
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


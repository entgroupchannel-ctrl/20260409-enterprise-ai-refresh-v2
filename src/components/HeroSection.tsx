import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown, UserPlus, LogOut, User, LogIn, FileText, Heart, Shield, FolderOpen, Bell, Bot } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import QuoteCartButton from "@/components/QuoteCartButton";
import AIChatWidget from "@/components/AIChatWidget";
import MegaMenu, { MobileMegaMenu } from "@/components/MegaMenu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/hooks/useWishlist";
import heroIndustrial from "@/assets/hero-industrial.jpg";
import logo from "@/assets/logo-entgroup.avif";

const searchIndex = [
  { keywords: ["mini pc", "มินิพีซี", "สำนักงาน", "office", "thin client"], label: "Mini PC สำนักงาน", href: "/mini-pc" },
  { keywords: ["gt", "gt series", "industrial pc", "โรงงาน", "fanless", "ทนร้อน", "ทนฝุ่น", "อุตสาหกรรม"], label: "GT Series — Industrial Mini PC", href: "/gt-series" },
  { keywords: ["gb", "gb series", "compact", "คอมแพค"], label: "GB Series — Compact PC", href: "/gb-series" },
  { keywords: ["epc", "epc box", "embedded"], label: "EPC Box Series", href: "/epc-box-series" },
  { keywords: ["epc series"], label: "EPC Series", href: "/epc-series" },
  { keywords: ["panel pc", "gk", "จอสัมผัส", "touch", "หน้าจอ", "touchscreen"], label: "GK Series — Panel PC", href: "/gk-series" },
  { keywords: ["gtg", "gty", "panel pc gtg", "stainless", "ip65"], label: "Panel PC GTG/GTY", href: "/panel-pc-gtg" },
  { keywords: ["utc", "utc series"], label: "UTC Series", href: "/utc-series" },
  { keywords: ["firewall", "ไฟร์วอลล์", "network security", "pfsense", "opnsense", "sme"], label: "Mini PC Firewall", href: "/minipc-firewall" },
  { keywords: ["smart display", "kiosk", "คีออส", "digital signage", "จอโฆษณา", "monitor"], label: "Smart Display & KIOSK", href: "/smart-display" },
  { keywords: ["rugged", "tablet", "แท็บเล็ต", "notebook", "ทหาร", "กันน้ำ", "กันกระแทก", "ภาคสนาม", "vehicle"], label: "Rugged Tablet / Notebook", href: "/rugged-tablet" },
  { keywords: ["volktek", "switch", "เครือข่าย", "network", "สวิตช์"], label: "Volktek Industrial Switch", href: "/volktek" },
  { keywords: ["vcloudpoint", "zero client", "thin client", "ประหยัดพลังงาน"], label: "vCloudPoint Zero Client", href: "/vcloudpoint" },
  { keywords: ["waterproof", "ip69k", "กันน้ำ", "ล้างน้ำ", "อาหาร", "food"], label: "Waterproof PC IP69K", href: "/waterproof-pc" },
  { keywords: ["โปรโมชั่น", "promotion", "ลดราคา", "sale"], label: "โปรโมชั่น", href: "/promotions" },
  { keywords: ["ติดต่อ", "contact", "สอบถาม", "โทร"], label: "ติดต่อเรา", href: "/contact" },
  { keywords: ["ใบเสนอราคา", "quote", "ขอราคา"], label: "ขอใบเสนอราคา", href: "/quote" },
  { keywords: ["gt1000"], label: "GT1000 — Entry Level", href: "/gt-series?tab=GT1000" },
  { keywords: ["gt1400", "gpio"], label: "GT1400 — GPIO + 2.5G LAN", href: "/gt-series?tab=GT1400" },
  { keywords: ["gt4500"], label: "GT4500 — DDR4 + SIM 4G/5G", href: "/gt-series?tab=GT4500" },
  { keywords: ["gt7000"], label: "GT7000 — คำตอบทุกปัญหาโรงงาน", href: "/gt-series?tab=GT7000" },
  { keywords: ["gt9000"], label: "GT9000 — 3 HDMI 6 COM NVMe", href: "/gt-series?tab=GT9000" },
  { keywords: ["gb1000"], label: "GB1000 — Ultra-Compact", href: "/gb-series" },
  { keywords: ["gb5000"], label: "GB5000 — Premium Performance", href: "/gb-series" },
  { keywords: ["pos", "ร้านค้า", "ขายของ"], label: "Panel PC สำหรับ POS ร้านค้า", href: "/panel-pc-gtg" },
];

const searchTags = [
  { label: "Mini PC สำนักงาน", href: "/mini-pc" },
  { label: "Industrial PC ทนร้อนทนฝุ่น", href: "/gt-series" },
  { label: "Panel PC จอสัมผัสโรงงาน", href: "/panel-pc-gtg" },
  { label: "Firewall สำหรับ SME", href: "/minipc-firewall" },
  { label: "Zero Client ประหยัดพลังงาน", href: "/vcloudpoint" },
  { label: "Rugged Tablet กันน้ำกันกระแทก", href: "/rugged-tablet" },
  { label: "Industrial Switch เครือข่ายโรงงาน", href: "/volktek" },
  { label: "Touch Screen POS ร้านค้า", href: "/panel-pc-gtg" },
  { label: "Rugged Notebook สำหรับภาคสนาม", href: "/rugged-tablet" },
  { label: "Vehicle Tablet ติดรถขนส่ง", href: "/rugged-tablet" },
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin, isSuperAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { count: wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(true);

  // Auto-collapse tags after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setTagsExpanded(false), 10000);
    return () => clearTimeout(timer);
  }, []);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic
  const searchResults = searchQuery.trim().length >= 1
    ? searchIndex.filter((item) => {
        const q = searchQuery.toLowerCase();
        return item.label.toLowerCase().includes(q) || item.keywords.some((k) => k.includes(q));
      }).slice(0, 8)
    : [];

  const handleSearch = () => {
    if (searchResults.length > 0) {
      navigate(searchResults[0].href);
      setSearchQuery("");
      setSearchOpen(false);
    } else if (searchQuery.trim()) {
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
    <>
    <section className="relative min-h-screen flex flex-col">
      {/* Full-bleed background image */}
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

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="ENT GROUP" className="h-10 w-auto" />
        </a>
        <div className="hidden md:flex items-center gap-2">
          <MegaMenu />
          {navLinks.map((l) =>
            l.href.startsWith("/") ? (
              <Link key={l.label} to={l.href} className="px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                {l.label}
              </a>
            )
          )}
          <div className="w-px h-6 bg-white/10 mx-1" />
          <QuoteCartButton />
          <ThemeToggle />
          <button
            onClick={() => setAiChatOpen(true)}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
            aria-label="AI Assistant"
            title="AI ผู้เชี่ยวชาญ"
          >
            <Bot size={18} />
          </button>
          <Link
            to="/wishlist"
            className="relative p-2.5 rounded-lg text-white/70 hover:text-red-400 hover:bg-white/10 transition-colors"
            title="สินค้าที่ถูกใจ"
          >
            <Heart size={20} className={wishlistCount > 0 ? "fill-red-400 text-red-400" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="บัญชีผู้ใช้"
            >
              <User size={20} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-card border border-border shadow-xl py-1 z-50 animate-fade-in">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border truncate">
                      <span>{user.email}</span>
                      {isAdmin && (
                        <span className="ml-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                          <Shield size={9} /> {isSuperAdmin ? "Super Admin" : "Admin"}
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-medium hover:bg-primary/5 transition-colors"
                      >
                        <Shield size={14} /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/my-account"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User size={14} /> บัญชีของฉัน
                    </Link>
                    <Link
                      to="/my-account/quotes"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <FileText size={14} /> ใบเสนอราคา
                    </Link>
                    <Link
                      to="/my-account/documents"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <FolderOpen size={14} /> ศูนย์เอกสาร
                    </Link>
                    <button
                      onClick={async () => { setUserMenuOpen(false); await signOut(); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut size={14} /> ออกจากระบบ
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/admin-login"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LogIn size={14} /> เข้าสู่ระบบ
                    </Link>
                    <Link
                      to="/member-register"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <UserPlus size={14} /> สมัครสมาชิก
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-30 bg-card border-b border-border p-6 animate-fade-in max-h-[80vh] overflow-y-auto">
          <MobileMegaMenu onNavigate={() => setMobileMenuOpen(false)} />
          <div className="flex flex-col mt-4 gap-2 pt-4 border-t border-border">
            {user ? (
              <>
                <div className="px-3 py-2 text-xs text-muted-foreground truncate flex items-center gap-2">
                  <User size={12} /> {user.email}
                  {isAdmin && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                      <Shield size={8} /> {isSuperAdmin ? "Super Admin" : "Admin"}
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold border border-primary/20"
                  >
                    <Shield size={14} /> Admin Dashboard
                  </Link>
                )}
                <div className="flex gap-2">
                  <Link
                    to="/my-account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    <User size={14} /> บัญชีของฉัน
                  </Link>
                  <Link
                    to="/my-account/quotes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    <FileText size={14} /> ใบเสนอราคา
                  </Link>
                  <button
                    onClick={async () => { setMobileMenuOpen(false); await signOut(); }}
                    className="flex-1 text-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
                  >
                    ออกจากระบบ
                  </button>
                </div>
                <div className="flex justify-center gap-2 pt-1">
                  <QuoteCartButton />
                  <ThemeToggle />
                  <button
                    onClick={() => { setMobileMenuOpen(false); setAiChatOpen(true); }}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
                    aria-label="AI Assistant"
                  >
                    <Bot size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <QuoteCartButton />
                <ThemeToggle />
                <button
                  onClick={() => { setMobileMenuOpen(false); setAiChatOpen(true); }}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
                  aria-label="AI Assistant"
                >
                  <Bot size={18} />
                </button>
                <Link
                  to="/admin-login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-3 py-2.5 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/member-register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Content — two-column layout */}
      <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 lg:px-20">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 py-16 md:py-0">
          {/* Left: Headline + Search + CTA */}
          <div className="max-w-2xl">
            <p className="text-sm md:text-base text-primary font-semibold tracking-widest uppercase mb-4 animate-fade-up">
              B2B Industrial Platform — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[1.1] mb-6 animate-fade-up text-white" style={{ animationDelay: "0.1s" }}>
              โซลูชัน{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--accent))]">
                Industrial Computing
              </span>
              <br />
              สำหรับประเทศไทย
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 animate-fade-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
              พันธมิตรธุรกิจที่คุณไว้วางใจ — Mini PC, Panel PC, Rugged Device
              และซอฟต์แวร์ครบวงจร สำหรับงานโรงงาน งานประมูล และงานโครงการ
            </p>

            {/* Search */}
            <div ref={searchRef} className="relative max-w-xl mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
                <Search className="ml-4 text-white/50" size={20} />
                <input
                  type="text"
                  placeholder="บอกความต้องการ เช่น Mini PC โรงงาน, Firewall SME..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-white/40 outline-none text-sm md:text-base"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-4 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  ค้นเลย
                </button>
              </div>

              {/* Autocomplete dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                  {searchResults.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { navigate(item.href); setSearchQuery(""); setSearchOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary/10 transition-colors border-b border-border/50 last:border-0"
                    >
                      <Search size={14} className="text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: "0.35s" }}>
              <Link
                to="/product-advisor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <Search size={16} /> ช่วยเลือกสินค้าที่ใช่
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/80 text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                ปรึกษาผู้เชี่ยวชาญ
              </Link>
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-8 mt-12 animate-fade-up" style={{ animationDelay: "0.5s" }}>
              {heroStats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl md:text-3xl font-display font-black text-primary">{s.value}</p>
                  <p className="text-xs text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Search Tags — collapsible, fixed to right edge */}
          <div className={`hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 transition-all duration-500 ease-in-out ${tagsExpanded ? "translate-x-0" : "translate-x-[calc(100%-28px)]"}`}>
            <button
              onClick={() => setTagsExpanded(!tagsExpanded)}
              className="flex items-center justify-center w-7 shrink-0 rounded-l-xl bg-white/10 backdrop-blur-md border border-r-0 border-white/15 text-white/50 hover:text-white hover:bg-white/20 transition-colors"
              title="สินค้ายอดนิยม"
            >
              <ChevronDown size={14} className={`transition-transform duration-300 ${tagsExpanded ? "rotate-90" : "-rotate-90"}`} />
            </button>
            <div className="flex flex-col gap-2 p-3 rounded-l-xl bg-black/40 backdrop-blur-xl border border-r-0 border-white/10">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-white/40">สินค้ายอดนิยม</p>
              {searchTags.slice(0, 6).map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => navigate(tag.href)}
                  className="text-left px-3 py-2 rounded-lg bg-white/5 text-white/80 text-xs border border-white/10 hover:bg-white/15 hover:border-white/25 hover:text-white transition-all whitespace-nowrap"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: Tags inline */}
          <div className="flex flex-wrap gap-2 lg:hidden animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {searchTags.slice(0, 6).map((tag) => (
              <button
                key={tag.label}
                onClick={() => navigate(tag.href)}
                className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all backdrop-blur-sm"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8 animate-bounce">
        <a href="#products" className="text-white/40 hover:text-white/70 transition-colors">
          <ChevronDown size={28} />
        </a>
      </div>

    </section>
    {aiChatOpen && <AIChatWidget open={aiChatOpen} onClose={() => setAiChatOpen(false)} />}
    </>
  );
};

export default HeroSection;

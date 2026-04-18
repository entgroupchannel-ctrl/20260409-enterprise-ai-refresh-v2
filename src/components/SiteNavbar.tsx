import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogIn, UserCircle, ChevronDown, LayoutDashboard, FileText, Plus, User, LogOut, ShoppingBag, Sparkles, Tag, Mail } from 'lucide-react';
import CartBadge from '@/components/CartBadge';
import ThemeToggle from '@/components/ThemeToggle';
import MegaMenu, { MobileMegaMenu } from '@/components/MegaMenu';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import logo from '@/assets/logo-entgroup.avif';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Shop สินค้า', href: '/shop', icon: ShoppingBag, highlight: true, hint: 'เลือกชมสินค้าทั้งหมด — Industrial PC, Mini PC, Rugged' },
  { label: 'โปรโมชั่น', href: '/promotions', icon: Tag, hint: 'ดูโปรโมชั่น & ส่วนลดล่าสุด' },
  { label: 'ติดต่อเรา', href: '/contact', icon: Mail, hint: 'สอบถาม / ขอใบเสนอราคา / ติดต่อทีมขาย' },
];

export default function SiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut, loading: authLoading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 flex items-center gap-3 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="ENT GROUP" className="h-8 w-auto" />
        </Link>

        {/* Desktop nav — MegaMenu ชิดซ้ายติดโลโก้, icon group ชิดขวา */}
        <div className="hidden md:flex items-center flex-1 min-w-0 gap-1">
          <div className="flex items-center min-w-0 mr-auto pl-6 lg:pl-10">
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
                      className={cn(
                        "p-2 rounded-lg transition-colors flex items-center justify-center",
                        'highlight' in link && link.highlight
                          ? "text-primary hover:bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
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
                  className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
                >
                  <FileText size={18} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p className="font-medium">ขอใบเสนอราคา</p>
                <p className="text-muted-foreground text-[10px]">กรอกฟอร์มเพื่อรับใบเสนอราคาภายใน 24 ชม.</p>
              </TooltipContent>
            </Tooltip>
            <div className="w-px h-6 bg-border mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex"><ThemeToggle /></span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">สลับโหมด สว่าง / มืด</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex"><CartBadge className="text-muted-foreground hover:text-foreground transition-colors p-2" /></span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">ตะกร้าใบเสนอราคา</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {authLoading ? (
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <LogIn size={16} /> เข้าสู่ระบบ
            </Link>
          ) : (
            user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
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
                      <Link to="/affiliate" className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <Sparkles size={16} /> สร้างรายได้ (Affiliate)
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
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <LogIn size={16} /> เข้าสู่ระบบ
              </Link>
            )
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-1 ml-auto">
          <Link
            to="/request-quote"
            aria-label="ขอใบเสนอราคา"
            title="ขอใบเสนอราคา"
            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
          >
            <FileText size={18} />
          </Link>
          <ThemeToggle />
          <CartBadge className="text-muted-foreground hover:text-foreground transition-colors p-2" />
          {!user && (
            <Link
              to="/login"
              aria-label="เข้าสู่ระบบ"
              title="เข้าสู่ระบบ"
              className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
            >
              <LogIn size={18} />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="text-foreground p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border p-4 bg-card animate-fade-in max-h-[80vh] overflow-y-auto">
          <MobileMegaMenu onNavigate={() => setMobileMenuOpen(false)} />
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
            {!authLoading && (
              user ? (
                <>
                  {(profile?.role === 'admin' || profile?.role === 'sales') && (
                    <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                      <LayoutDashboard size={16} /> แดชบอร์ด
                    </Link>
                  )}
                  {profile?.role === 'member' && (
                    <Link to="/my-quotes" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                      <FileText size={16} /> ใบเสนอราคาของฉัน
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-muted transition-colors text-left">
                    <LogOut size={16} /> ออกจากระบบ
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors justify-center">
                  <LogIn size={16} /> เข้าสู่ระบบ
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogIn, UserCircle, ChevronDown, LayoutDashboard, FileText, Plus, User, LogOut, ShoppingBag, Sparkles, Tag, Mail } from 'lucide-react';
import CartBadge from '@/components/CartBadge';
import ThemeToggle from '@/components/ThemeToggle';
import MegaMenu, { MobileMegaMenu } from '@/components/MegaMenu';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo-entgroup.avif';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Shop', href: '/shop', icon: ShoppingBag, highlight: true },
  { label: 'โปรโมชั่น', href: '/promotions', icon: Tag },
  { label: 'ติดต่อเรา', href: '/contact', icon: Mail },
];

export default function SiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut, loading: authLoading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="ENT GROUP" className="h-8 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <MegaMenu />
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                'highlight' in link && link.highlight
                  ? "text-primary hover:bg-primary/10 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {'icon' in link && link.icon ? (
                <span className="flex items-center gap-1.5">
                  <link.icon size={16} />
                  {link.label}
                </span>
              ) : link.label}
            </Link>
          ))}
          <div className="w-px h-6 bg-border mx-1" />
          <ThemeToggle />
          <CartBadge className="text-muted-foreground hover:text-foreground transition-colors p-2" />
          {!authLoading && (
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
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <CartBadge className="text-muted-foreground hover:text-foreground transition-colors p-2" />
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

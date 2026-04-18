import { Link } from 'react-router-dom';
import { LogIn, UserCircle, FileText, LogOut } from 'lucide-react';
import CartBadge from '@/components/CartBadge';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * MiniNavbar — แถบบนแบบเบา: โลโก้ + icon (Quote / Theme / Cart / Login)
 * ไม่มี MegaMenu สำหรับหน้าที่ต้องการ navbar กระชับ
 */
export default function MiniNavbar() {
  const { user, profile, signOut, loading: authLoading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 flex items-center gap-3 h-14">

        <div className="flex items-center gap-1 ml-auto">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/request-quote"
                  aria-label="ขอใบเสนอราคา"
                  className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                >
                  <FileText size={18} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">ขอใบเสนอราคา</TooltipContent>
            </Tooltip>
            <ThemeToggle />
            <CartBadge className="text-muted-foreground hover:text-foreground transition-colors p-2" />
          </TooltipProvider>

          {authLoading ? (
            <Link
              to="/login"
              aria-label="เข้าสู่ระบบ"
              className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors md:hidden"
            >
              <LogIn size={18} />
            </Link>
          ) : user ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <UserCircle size={18} />
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors w-full text-left rounded-lg"
                >
                  <LogOut size={16} /> ออกจากระบบ
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <LogIn size={16} /> เข้าสู่ระบบ
              </Link>
              <Link
                to="/login"
                aria-label="เข้าสู่ระบบ"
                className="md:hidden p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
              >
                <LogIn size={18} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationBell from '@/components/notifications/NotificationBell';
import MiniFooter from '@/components/MiniFooter';
import CustomerChat from '@/components/chat/CustomerChat';
import {
  FileSearch, ShoppingBag, UserRound, PackageCheck, Receipt,
  FileText, FileArchive, Shield, Wrench, Home, LogOut, Sparkles,
} from 'lucide-react';

const menuItems = [
  { key: 'dashboard', label: 'แดชบอร์ด', icon: Home, path: '/dashboard' },
  { key: 'quotes', label: 'ใบเสนอราคา', icon: FileSearch, path: '/dashboard' },
  { key: 'orders', label: 'คำสั่งซื้อ', icon: PackageCheck, path: '/my-orders' },
  { key: 'invoices', label: 'ใบวางบิล', icon: Receipt, path: '/my-invoices' },
  { key: 'tax-invoices', label: 'ใบกำกับภาษี', icon: FileText, path: '/my-tax-invoices' },
  { key: 'receipts', label: 'ใบเสร็จรับเงิน', icon: Receipt, path: '/my-receipts' },
  { key: 'documents', label: 'เอกสารบริษัท', icon: FileArchive, path: '/my-documents' },
  { key: 'my-products', label: 'สินค้าของฉัน', icon: Shield, path: '/my/products' },
  { key: 'my-repairs', label: 'แจ้งซ่อม', icon: Wrench, path: '/my/repairs' },
  { key: 'cart', label: 'ตะกร้าสินค้า', icon: ShoppingBag, path: '/dashboard?tab=cart' },
  { key: 'affiliate', label: 'สร้างรายได้ (Affiliate)', icon: Sparkles, path: '/affiliate' },
  { key: 'profile', label: 'โปรไฟล์', icon: UserRound, path: '/dashboard?tab=profile' },
];

interface CustomerLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function CustomerLayout({ children, title }: CustomerLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    const base = path.split('?')[0];
    if (base === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(base);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-card border-b border-border sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />หน้าแรก
            </Button>
            <div className="h-6 w-px bg-border" />
            {title && <h1 className="text-sm font-semibold hidden sm:block">{title}</h1>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
            <ThemeToggle />
            {user?.id && <NotificationBell userId={user.id} />}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-1" /> ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — desktop */}
        <aside className="w-56 shrink-0 border-r border-border bg-card hidden md:block">
          <nav className="p-3 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-20 flex">
          {[menuItems[0], menuItems[7], menuItems[8], menuItems[6], menuItems[10]].map(item => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-colors ${
                isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-5xl mx-auto p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>

      <MiniFooter />
      {user && <CustomerChat mode="widget" />}
    </div>
  );
}

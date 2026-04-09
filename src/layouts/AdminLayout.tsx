import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  FileText,
  Users,
  FileArchive,
  LogOut,
  User,
  Bell,
  Shield,
  ShoppingCart,
  ClipboardList,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';
import LangToggle from '@/components/LangToggle';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  useEffect(() => {
    const loadPendingCount = async () => {
      try {
        const { count } = await supabase
          .from('po_change_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending');
        setPendingRequestsCount(count || 0);
      } catch {}
    };

    loadPendingCount();
    const interval = setInterval(loadPendingCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'ใบเสนอราคา', icon: FileText, path: '/admin/quotes' },
    { label: 'ยอดขาย / Order', icon: ShoppingCart, path: '/admin/sale-orders' },
    { label: 'คำขอ', icon: ClipboardList, path: '/admin/requests', badge: true },
    { label: 'ผู้ติดต่อ', icon: Users, path: '/admin/contacts' },
    { label: 'เอกสาร', icon: FileArchive, path: '/admin/documents' },
    { label: 'สิทธิ์', icon: Shield, path: '/admin/permissions' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">ENT</span>
                </div>
                <span className="font-semibold text-lg hidden sm:inline">Admin Panel</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button variant={isActive ? 'secondary' : 'ghost'} className="gap-2">
                        <Icon className="w-4 h-4" />
                        {item.label}
                        {item.badge && pendingRequestsCount > 0 && (
                          <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs">
                            {pendingRequestsCount}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <LangToggle variant="compact" />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/admin/requests')}
              >
                <Bell className="w-5 h-5" />
                {pendingRequestsCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                    {pendingRequestsCount}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">{profile?.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {profile?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'พนักงานขาย'}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    ข้อมูลส่วนตัว
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="md:hidden border-t">
          <nav className="flex items-center overflow-x-auto px-4 py-2 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button variant={isActive ? 'secondary' : 'ghost'} size="sm" className="gap-2 whitespace-nowrap">
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {item.badge && pendingRequestsCount > 0 && (
                      <Badge variant="destructive" className="ml-1 px-1 py-0 text-[10px]">
                        {pendingRequestsCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NotificationCenter } from '@/components/quotes';
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
  Building2,
  FileText,
  Users,
  FileArchive,
  LogOut,
  User,
  Shield,
  ShoppingCart,
  ClipboardList,
  Package,
  Briefcase,
  ShieldCheck,
  Settings,
  ChevronDown,
  Trash2,
  Database,
  Upload,
  Receipt,
  Menu as MenuIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';
import LangToggle from '@/components/LangToggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface NavItem {
  label: string;
  icon: any;
  path: string;
  badge?: 'requests' | 'approvals';
}

interface NavGroup {
  label: string;
  icon: any;
  items: NavItem[];
  adminOnly?: boolean;
}

const standaloneItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
];

const navGroups: NavGroup[] = [
  {
    label: 'ขาย',
    icon: Briefcase,
    items: [
      { label: 'ใบเสนอราคา', icon: FileText, path: '/admin/quotes' },
      { label: 'ยอดขาย / SO', icon: ShoppingCart, path: '/admin/sale-orders' },
      { label: 'ใบวางบิล', icon: Receipt, path: '/admin/invoices' },
      { label: 'ใบกำกับภาษี', icon: FileText, path: '/admin/tax-invoices' },
      { label: 'ถังขยะ', icon: Trash2, path: '/admin/trash' },
    ],
  },
  {
    label: 'สินค้า',
    icon: Package,
    items: [
      { label: 'คลังสินค้า', icon: Package, path: '/admin/products' },
      { label: 'นำเข้าสินค้า', icon: Upload, path: '/admin/products/import' },
      { label: 'Product Migration', icon: Database, path: '/admin/product-migration' },
    ],
  },
  {
    label: 'จัดการ',
    icon: ShieldCheck,
    items: [
      { label: 'คำขอลูกค้า', icon: ClipboardList, path: '/admin/requests', badge: 'requests' },
      { label: 'อนุมัติ', icon: Shield, path: '/admin/approvals', badge: 'approvals' },
    ],
  },
  {
    label: 'ตั้งค่า',
    icon: Settings,
    items: [
      { label: 'ข้อมูลบริษัท', icon: Building2, path: '/admin/settings/company' },
      { label: 'ข้อมูลส่วนตัว', icon: User, path: '/admin/settings/profile' },
      { label: 'ผู้ติดต่อ', icon: Users, path: '/admin/contacts' },
      { label: 'เอกสาร', icon: FileArchive, path: '/admin/documents' },
      { label: 'สิทธิ์', icon: Shield, path: '/admin/permissions' },
    ],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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

  useEffect(() => {
    const checkAdminAndApprovals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      const isAdmin = userData?.role === 'admin';
      setIsAdminUser(isAdmin);
      if (isAdmin) {
        const { data: count } = await supabase.rpc('count_pending_approvals');
        setPendingApprovals(count || 0);
      }
    };
    checkAdminAndApprovals();
    const interval = setInterval(checkAdminAndApprovals, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Helpers
  const isGroupActive = (group: NavGroup) =>
    group.items.some(
      (item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/')
    );

  const getBadgeCount = (item: NavItem): number => {
    if (item.badge === 'requests') return pendingRequestsCount;
    if (item.badge === 'approvals') return pendingApprovals;
    return 0;
  };

  const getGroupBadgeCount = (group: NavGroup): number =>
    group.items.reduce((sum, item) => sum + getBadgeCount(item), 0);

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

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-1">
                {standaloneItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button variant={isActive ? 'secondary' : 'ghost'} className="gap-2">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}

                {navGroups.map((group) => {
                  const GroupIcon = group.icon;
                  const groupActive = isGroupActive(group);
                  const groupBadge = getGroupBadgeCount(group);

                  if (group.adminOnly && !isAdminUser) return null;

                  return (
                    <DropdownMenu key={group.label}>
                      <DropdownMenuTrigger asChild>
                        <Button variant={groupActive ? 'secondary' : 'ghost'} className="gap-2 relative">
                          <GroupIcon className="w-4 h-4" />
                          {group.label}
                          <ChevronDown className="w-3 h-3 opacity-60" />
                          {groupBadge > 0 && (
                            <Badge
                              variant="destructive"
                              className="absolute -top-1 -right-1 px-1 py-0 min-w-[16px] h-4 text-[10px]"
                            >
                              {groupBadge}
                            </Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        {group.items.map((item) => {
                          if (item.path === '/admin/approvals' && !isAdminUser) return null;
                          const Icon = item.icon;
                          const itemBadge = getBadgeCount(item);
                          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                          return (
                            <DropdownMenuItem
                              key={item.path}
                              onClick={() => navigate(item.path)}
                              className={`gap-2 cursor-pointer ${isActive ? 'bg-accent' : ''}`}
                            >
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              <span className="flex-1">{item.label}</span>
                              {itemBadge > 0 && (
                                <Badge
                                  variant={item.badge === 'requests' ? 'destructive' : 'default'}
                                  className={`ml-auto px-1.5 py-0 text-xs ${item.badge === 'approvals' ? 'bg-amber-600 text-white' : ''}`}
                                >
                                  {itemBadge}
                                </Badge>
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile menu trigger */}
              <div className="md:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MenuIcon className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 p-0">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-sm">ENT</span>
                        </div>
                        <span className="font-semibold">Admin Panel</span>
                      </div>
                    </div>
                    <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
                      {standaloneItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                            <Button variant={isActive ? 'secondary' : 'ghost'} className="w-full justify-start gap-2">
                              <Icon className="w-4 h-4" />
                              {item.label}
                            </Button>
                          </Link>
                        );
                      })}

                      {navGroups.map((group) => {
                        if (group.adminOnly && !isAdminUser) return null;
                        const GroupIcon = group.icon;
                        const groupActive = isGroupActive(group);
                        const groupBadge = getGroupBadgeCount(group);

                        return (
                          <Collapsible key={group.label} defaultOpen={groupActive}>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" className="w-full justify-between gap-2">
                                <span className="flex items-center gap-2">
                                  <GroupIcon className="w-4 h-4" />
                                  {group.label}
                                  {groupBadge > 0 && (
                                    <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">
                                      {groupBadge}
                                    </Badge>
                                  )}
                                </span>
                                <ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-4 space-y-1 pt-1">
                              {group.items.map((item) => {
                                if (item.path === '/admin/approvals' && !isAdminUser) return null;
                                const Icon = item.icon;
                                const itemBadge = getBadgeCount(item);
                                const isActive = location.pathname === item.path;
                                return (
                                  <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                                    <Button variant={isActive ? 'secondary' : 'ghost'} size="sm" className="w-full justify-start gap-2">
                                      <Icon className="w-3.5 h-3.5" />
                                      <span className="flex-1 text-left">{item.label}</span>
                                      {itemBadge > 0 && (
                                        <Badge
                                          variant={item.badge === 'requests' ? 'destructive' : 'default'}
                                          className={`px-1 py-0 text-[10px] ${item.badge === 'approvals' ? 'bg-amber-600 text-white' : ''}`}
                                        >
                                          {itemBadge}
                                        </Badge>
                                      )}
                                    </Button>
                                  </Link>
                                );
                              })}
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      })}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>

              <LangToggle variant="compact" />
              <ThemeToggle />
              {userId && <NotificationCenter userId={userId} />}

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
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

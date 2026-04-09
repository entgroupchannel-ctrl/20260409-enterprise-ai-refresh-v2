import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User, FileText, Heart, FolderOpen, Bell, Wrench,
  ArrowLeft, LogOut, Shield, PanelLeftClose, PanelLeft,
  Plus, Package, ChevronDown, ChevronRight, CreditCard,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import FooterCompact from "@/components/FooterCompact";

// ─── Lazy-import child pages ───
import MyProfile from "@/pages/MyProfile";
import MyAccountQuotes from "@/pages/MyAccountQuotes";
import MyAccountWishlist from "@/pages/MyAccountWishlist";
import MyDocuments from "@/pages/MyDocuments";
import MyNotifications from "@/pages/MyNotifications";
import MyDemos from "@/pages/MyDemos";
import UserQuoteCreate from "@/pages/UserQuoteCreate";
import MyOrders from "@/pages/MyOrders";
import MyInvoices from "@/pages/MyInvoices";

type Tab = "profile" | "quotes" | "quote_create" | "orders" | "invoices" | "wishlist" | "documents" | "notifications" | "demos";

/* ─── Menu group definitions ─── */
interface MenuItem { id: Tab; label: string; icon: typeof User; badge?: number }
interface MenuGroup { label: string; icon: typeof User; items: MenuItem[]; defaultOpen?: boolean }

const MyAccount = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (path: string): Tab => {
    if (path.includes("/quotes/create")) return "quote_create";
    if (path.includes("/quotes")) return "quotes";
    if (path.includes("/orders")) return "orders";
    if (path.includes("/invoices")) return "invoices";
    if (path.includes("/wishlist")) return "wishlist";
    if (path.includes("/documents")) return "documents";
    if (path.includes("/notifications")) return "notifications";
    if (path.includes("/demos")) return "demos";
    return "profile";
  };

  const getInitialTab = (): Tab => {
    try {
      const override = sessionStorage.getItem("ent_myaccount_tab");
      if (override) {
        sessionStorage.removeItem("ent_myaccount_tab");
        return override as Tab;
      }
    } catch { /* silent */ }
    return getTabFromPath(location.pathname);
  };

  const [tab, setTab] = useState<Tab>(getInitialTab());
  const [sidebarMode, setSidebarMode] = useState<"full" | "icon" | "hidden">("full");
  const [unreadCount, setUnreadCount] = useState(0);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    sales: true,
    account: true,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin-login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  // Fetch unread count
  const fetchUnread = useCallback(async () => {
    if (!user) return;
    try {
      const { count } = await (supabase.from as any)("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setUnreadCount(count || 0);
    } catch { /* silent */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => { fetchUnread(); }, [fetchUnread, tab]);

  // Realtime: listen for new notifications
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("user-notifications-realtime")
      .on(
        "postgres_changes" as any,
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          setUnreadCount((prev) => prev + 1);
          // Show toast for new notification
          if (payload.new) {
            const n = payload.new as { title?: string; message?: string };
            import("@/hooks/use-toast").then(({ toast }) => {
              toast({
                title: n.title || "แจ้งเตือนใหม่",
                description: n.message || "",
              });
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  /* ─── Grouped menu structure ─── */
  const menuGroups: { key: string; group: MenuGroup }[] = [
    {
      key: "sales",
      group: {
        label: "งานขาย",
        icon: FileText,
        items: [
          { id: "quotes", label: "ใบเสนอราคา", icon: FileText },
          { id: "quote_create", label: "สร้างใบเสนอราคา", icon: Plus },
          { id: "orders", label: "คำสั่งซื้อ", icon: Package },
          { id: "invoices", label: "ใบแจ้งหนี้/ใบเสร็จ", icon: CreditCard },
        ],
      },
    },
    {
      key: "account",
      group: {
        label: "บัญชีของฉัน",
        icon: User,
        items: [
          { id: "profile", label: "โปรไฟล์", icon: User },
          { id: "wishlist", label: "รายการถูกใจ", icon: Heart },
          { id: "documents", label: "ศูนย์เอกสาร", icon: FolderOpen },
          { id: "notifications", label: "แจ้งเตือน", icon: Bell, badge: unreadCount },
          { id: "demos", label: "ทดลองใช้งาน", icon: Wrench },
        ],
      },
    },
  ];

  // Flat list for mobile
  const allItems = menuGroups.flatMap((g) => g.group.items);

  // Determine which group contains current tab (auto-open)
  const findGroupForTab = (t: Tab) => menuGroups.find((g) => g.group.items.some((i) => i.id === t));

  const handleSetTab = (t: Tab) => {
    setTab(t);
    // Ensure the group containing this tab is open
    const g = findGroupForTab(t);
    if (g && !openGroups[g.key]) {
      setOpenGroups((prev) => ({ ...prev, [g.key]: true }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="บัญชีของฉัน — ENT Group" description="จัดการบัญชี โปรไฟล์ ใบเสนอราคา และเอกสาร" path="/my-account" />

      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-sm text-primary hover:underline flex items-center gap-1.5">
                <ArrowLeft size={14} /> กลับหน้าหลัก
              </Link>
              <div className="w-px h-5 bg-border hidden sm:block" />
              <h1 className="text-lg font-display font-bold text-foreground hidden sm:block">บัญชีของฉัน</h1>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 hover:bg-primary/20 transition-colors"
                >
                  <Shield size={12} /> Admin Dashboard
                </Link>
              )}
              <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[180px]">{user.email}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut size={16} /> ออก
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex gap-0">
          {/* ═══ Sidebar — collapsible groups ═══ */}
          {sidebarMode !== "hidden" && (
            <aside
              className={`shrink-0 hidden md:block transition-all duration-200 ${
                sidebarMode === "full" ? "w-56" : "w-14"
              }`}
              style={{ marginRight: sidebarMode === "full" ? 20 : 10 }}
            >
              <nav className="card-surface rounded-xl p-2.5 sticky top-16">
                {/* Toggle */}
                <button
                  onClick={() => setSidebarMode(sidebarMode === "full" ? "icon" : "full")}
                  className="w-full flex items-center justify-center py-2 mb-1 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-secondary/60 transition-colors"
                  title={sidebarMode === "full" ? "ยุบเมนู" : "ขยายเมนู"}
                >
                  {sidebarMode === "full" ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
                </button>

                {menuGroups.map(({ key, group }) => {
                  const isOpen = openGroups[key] ?? true;
                  const GroupIcon = group.icon;
                  const hasActiveTab = group.items.some((i) => i.id === tab);

                  return (
                    <div key={key} className="mb-1">
                      {/* Group header */}
                      {sidebarMode === "full" ? (
                        <button
                          onClick={() => toggleGroup(key)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                            hasActiveTab ? "text-primary" : "text-muted-foreground/60 hover:text-muted-foreground"
                          }`}
                        >
                          <GroupIcon size={13} className="shrink-0" />
                          <span className="flex-1 text-left">{group.label}</span>
                          {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </button>
                      ) : (
                        <div className="flex items-center justify-center py-1.5">
                          <div className={`w-6 h-px rounded ${hasActiveTab ? "bg-primary/40" : "bg-border"}`} />
                        </div>
                      )}

                      {/* Group items */}
                      {(sidebarMode === "icon" || isOpen) && group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSetTab(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                            tab === item.id
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                          } ${sidebarMode === "icon" ? "justify-center" : ""}`}
                          title={sidebarMode === "icon" ? item.label : undefined}
                        >
                          <item.icon size={16} className="shrink-0" />
                          {sidebarMode === "full" && (
                            <span className="flex-1 text-left truncate">{item.label}</span>
                          )}
                          {sidebarMode === "full" && item.badge && item.badge > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                              {item.badge > 9 ? "9+" : item.badge}
                            </span>
                          )}
                          {sidebarMode === "icon" && item.badge && item.badge > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
                          )}
                        </button>
                      ))}
                    </div>
                  );
                })}

                {/* Hide sidebar */}
                <div className="border-t border-border/50 mt-2 pt-1">
                  <button
                    onClick={() => setSidebarMode("hidden")}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-muted-foreground/40 hover:text-foreground hover:bg-secondary/60 transition-colors"
                    title="ซ่อนเมนูทั้งหมด"
                  >
                    <PanelLeftClose size={12} className="shrink-0" />
                    {sidebarMode === "full" && <span>ซ่อนเมนู</span>}
                  </button>
                </div>
              </nav>
            </aside>
          )}

          {/* ═══ Mobile tab bar ═══ */}
          <div className="md:hidden w-full mb-4 overflow-x-auto flex gap-1.5 border-b border-border pb-2.5 -mx-1 px-1">
            {allItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSetTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors relative ${
                  tab === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/60"
                }`}
              >
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span className="ml-1 px-1 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ═══ Main Content ═══ */}
          <main className="flex-1 min-w-0">
            {sidebarMode === "hidden" && (
              <button
                onClick={() => setSidebarMode("icon")}
                className="hidden md:flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <PanelLeft size={12} /> แสดงเมนู
              </button>
            )}

            {tab === "profile" && <MyProfile />}
            {tab === "quotes" && <MyAccountQuotes onNavigate={handleSetTab} />}
            {tab === "quote_create" && <UserQuoteCreate onNavigate={() => handleSetTab("quotes")} />}
            {tab === "orders" && <MyOrders />}
            {tab === "invoices" && <MyInvoices />}
            {tab === "wishlist" && <MyAccountWishlist />}
            {tab === "documents" && <MyDocuments />}
            {tab === "notifications" && <MyNotifications />}
            {tab === "demos" && <MyDemos />}
          </main>
        </div>
      </div>

      <FooterCompact />
    </div>
  );
};

export default MyAccount;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Receipt,
  ArrowLeft, Users, FileText, Mail, TrendingUp,
  Filter, RefreshCw, Eye, Clock, CheckCircle, XCircle,
  Star, Phone, Building2, MessageSquare, LogOut, Shield, Download,
  CalendarClock, Hash, Wallet, Code2, Cloud,
  PanelLeftClose, PanelLeft, Package, FolderOpen, BarChart3, Headphones, Activity,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/contexts/I18nContext";
import LangToggle from "@/components/LangToggle";
import EngagementAnalytics from "@/components/EngagementAnalytics";
import AdminDocumentManager from "@/components/AdminDocumentManager";
import AdminProductCatalog from "@/components/AdminProductCatalog";
import AdminQuoteReview from "@/components/AdminQuoteReview";
import AdminSalesOrders from "@/components/AdminSalesOrders";
import AdminInvoiceManager from "@/components/AdminInvoiceManager";
import AdminBillingManager from "@/components/AdminBillingManager";
import AdminDeliveryManager from "@/components/AdminDeliveryManager";
import AdminPaymentManager from "@/components/AdminPaymentManager";
import AdminUserManagement from "@/components/AdminUserManagement";
import NotificationBell from "@/components/NotificationBell";
import RevenueChart from "@/components/RevenueChart";
import { usePermissions, type PermissionKey } from "@/hooks/usePermissions";
import AdminSessionMonitor from "@/components/AdminSessionMonitor";

import AddContactForm from "@/components/AddContactForm";
import AddSoftwareInquiryDialog from "@/components/AddSoftwareInquiryDialog";

type Tab = "dashboard" | "contacts" | "subscribers" | "chatleads" | "software" | "engagement" | "documents" | "catalog" | "quote_review" | "users" | "sales_orders" | "invoices" | "billing" | "delivery" | "payments" | "session_monitor";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  qualified: "bg-primary/10 text-primary border-primary/20",
  closed: "bg-muted text-muted-foreground border-border",
  quoted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  negotiating: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  won: "bg-green-500/10 text-green-400 border-green-500/20",
  lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  new: "ใหม่",
  contacted: "ติดต่อแล้ว",
  qualified: "มีศักยภาพ",
  closed: "ปิดแล้ว",
  quoted: "ส่งใบเสนอราคาแล้ว",
  negotiating: "เจรจา",
  won: "สำเร็จ",
  lost: "ไม่สำเร็จ",
};

const LeadScoreBadge = ({ score }: { score: number }) => {
  const color =
    score >= 60 ? "text-green-400" :
    score >= 40 ? "text-yellow-400" :
    score >= 20 ? "text-orange-400" : "text-muted-foreground";
  return (
    <span className={`flex items-center gap-1 text-xs font-bold ${color}`}>
      <Star size={12} /> {score}
    </span>
  );
};

const parseDetails = (details: string | null) => {
  if (!details) return { timeline: "", qty: "", budget: "", extra: "" };
  const timeline = details.match(/\[timeline:\s*([^\]]*)\]/)?.[1]?.trim() || "";
  const qty = details.match(/\[qty:\s*([^\]]*)\]/)?.[1]?.trim() || "";
  const budget = details.match(/\[budget:\s*([^\]]*)\]/)?.[1]?.trim() || "";
  const extra = details.replace(/\[timeline:[^\]]*\]/g, "").replace(/\[qty:[^\]]*\]/g, "").replace(/\[budget:[^\]]*\]/g, "").trim();
  return { timeline, qty, budget, extra };
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, isSuperAdmin, loading: authLoading, signOut } = useAuth();
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("dashboard");
  // Note: keep-mounted pattern was reverted (caused stuck spinner bugs).
  // Tabs are now conditionally rendered — only the active tab is mounted.
  const [contacts, setContacts] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [chatLeads, setChatLeads] = useState<any[]>([]);
  const [softwareInquiries, setSoftwareInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Track if initial fetch has completed — used to prevent spinner on background refreshes
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sidebarMode, setSidebarMode] = useState<"full" | "icon" | "hidden">("full");
  const { can, getLevel, loading: permsLoading } = usePermissions();
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [addSoftwareOpen, setAddSoftwareOpen] = useState(false);

  // Map tab → permission key
  const tabPermission: Record<Tab, PermissionKey> = {
    dashboard: "sales.quote_review",  // Dashboard accessible to anyone with sales access
    contacts: "sales.contacts",
    quote_review: "sales.quote_review",
    chatleads: "sales.chatleads",
    software: "sales.software",
    catalog: "product.catalog",
    documents: "product.documents",
    engagement: "marketing.engagement",
    subscribers: "marketing.subscribers",
    users: "system.users",
    
    sales_orders: "sales.quote_review",
    invoices: "sales.quote_review",
    billing: "sales.quote_review",
    delivery: "sales.quote_review",
    payments: "sales.quote_review",
    session_monitor: "system.users",
  };

  // Check if current tab allows edit
  const canEditCurrentTab = can(tabPermission[tab], "edit");

  /**
   * Fetch all dashboard data.
   * @param silent - If true, don't show loading spinner (background refresh)
   */
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [c, q, s, cl, sw] = await Promise.all([
        (supabase.from as any)("contact_submissions").select("*").order("created_at", { ascending: false }),
        (supabase.from as any)("quote_requests").select("*").order("created_at", { ascending: false }),
        (supabase.from as any)("subscribers").select("*").order("created_at", { ascending: false }),
        (supabase.from as any)("chat_leads").select("*").order("created_at", { ascending: false }),
        (supabase.from as any)("software_inquiries").select("*").order("created_at", { ascending: false }),
      ]);
      if (c.data) setContacts(c.data);
      if (q.data) setQuotes(q.data);
      if (s.data) setSubscribers(s.data);
      if (cl.data) setChatLeads(cl.data);
      if (sw.data) setSoftwareInquiries(sw.data);
    } finally {
      if (!silent) setLoading(false);
      setInitialLoaded(true);
    }
  };

  // FIX 1: Use user?.id (primitive) instead of user (object)
  // Prevents re-evaluation when token refreshes (user ref may change but ID stays same)
  useEffect(() => {
    if (!authLoading && user && !isAdmin) {
      navigate("/admin-login", { replace: true });
    }
    if (!authLoading && !user) {
      navigate("/admin-login", { replace: true });
    }
  }, [authLoading, isAdmin, user?.id, navigate]);

  // Initial fetch when isAdmin becomes true. Subsequent isAdmin changes (e.g.
  // identity stays admin) won't re-trigger thanks to initialLoaded guard.
  useEffect(() => {
    if (isAdmin && !initialLoaded) {
      fetchData();
    }
  }, [isAdmin, initialLoaded]);

  // Background refresh for status updates — uses silent fetch to avoid spinner
  const refreshSilently = () => fetchData(true);

  // Listen for cross-component tab switching (e.g. invoice → payments)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail === "string") {
        setTab(detail as Tab);
        setStatusFilter("all");
        setSelectedItem(null);
      }
    };
    window.addEventListener("admin-switch-tab", handler);
    return () => window.removeEventListener("admin-switch-tab", handler);
  }, []);

  const updateStatus = async (table: string, id: string, status: string) => {
    const { error } = await (supabase.from(table as any) as any).update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "อัปเดตสถานะเรียบร้อย" });
      refreshSilently();
    }
  };

  const stats = {
    totalContacts: contacts.length,
    totalQuotes: quotes.length,
    totalSubscribers: subscribers.length,
    newLeads: contacts.filter(c => c.status === "new").length + quotes.filter(q => q.status === "new").length,
    highScoreLeads: [...contacts, ...quotes].filter(i => i.lead_score >= 50).length,
  };

  const filteredContacts = statusFilter === "all" ? contacts : contacts.filter(c => c.status === statusFilter);
  const filteredQuotes = statusFilter === "all" ? quotes : quotes.filter(q => q.status === statusFilter);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("th-TH", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  if (authLoading || permsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">
            {authLoading ? "กำลังตรวจสอบสิทธิ์..." : "กำลังโหลดสิทธิ์การใช้งาน..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-primary hover:underline flex items-center gap-1.5">
                <ArrowLeft size={14} /> {t("admin.backToHome")}
              </Link>
              <h1 className="text-xl font-display font-bold text-foreground">{t("admin.adminDashboard")}</h1>
            </div>
            <div className="flex items-center gap-4">
              {isSuperAdmin && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <Shield size={12} /> Super Admin
                </span>
              )}
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <NotificationBell
                onNavigate={(linkType, linkId) => {
                  // Map notification link_type → admin tab
                  const typeToTab: Record<string, Tab> = {
                    quote: "quote_review",
                    contact: "contacts",
                    order: "sales_orders",
                    invoice: "invoices",
                    billing: "billing",
                    delivery: "delivery",
                    payment: "payments",
                  };
                  const targetTab = typeToTab[linkType];
                  if (targetTab) {
                    setTab(targetTab);
                    // Cross-component selection will be handled via custom event
                    window.dispatchEvent(
                      new CustomEvent("admin-select-entity", {
                        detail: { type: linkType, id: linkId },
                      })
                    );
                  }
                }}
              />
              <LangToggle variant="compact" />
              <ThemeToggle />
              <button
                onClick={() => fetchData()}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> {t("common.refresh")}
              </button>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut size={16} /> {t("common.logout")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-0">
          {/* ═══ Sidebar — 3 states: full (220px) / icon (52px) / hidden (0px) ═══ */}
          {sidebarMode !== "hidden" && (
            <aside
              className={`shrink-0 hidden md:block transition-all duration-200 ${
                sidebarMode === "full" ? "w-56" : "w-14"
              }`}
              style={{ marginRight: sidebarMode === "full" ? 20 : 10 }}
            >
              <nav className="card-surface rounded-xl p-2 sticky top-20">
                {/* Toggle button */}
                <button
                  onClick={() => setSidebarMode(sidebarMode === "full" ? "icon" : "full")}
                  className="w-full flex items-center justify-center py-2 mb-1 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-secondary/60 transition-colors"
                  title={sidebarMode === "full" ? "ยุบเมนู" : "ขยายเมนู"}
                >
                  {sidebarMode === "full" ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
                </button>

                {/* ─── งานขาย / Sales ─── */}
                {sidebarMode === "full" && (
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/40 px-3 pt-2 pb-1">{t("admin.sales")}</p>
                )}
                {([
                  { id: "dashboard" as Tab, label: t("admin.dashboard"), icon: BarChart3, count: 0 },
                  { id: "contacts" as Tab, label: t("admin.contacts"), icon: MessageSquare, count: contacts.filter(c => c.status === "new").length },
                  { id: "quote_review" as Tab, label: t("admin.quotes"), icon: FileText, count: quotes.filter(q => q.status === "new").length },
                  { id: "sales_orders" as Tab, label: t("admin.salesOrders"), icon: Package, count: 0 },
                  { id: "billing" as Tab, label: t("admin.billing"), icon: FileText, count: 0 },
                  { id: "invoices" as Tab, label: t("admin.invoices"), icon: Receipt, count: 0 },
                  { id: "delivery" as Tab, label: t("admin.delivery"), icon: Package, count: 0 },
                  { id: "payments" as Tab, label: t("admin.payments"), icon: Wallet, count: 0 },
                ]).filter((item) => can(tabPermission[item.id], "view")).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setTab(item.id); setStatusFilter("all"); setSelectedItem(null); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      tab === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    } ${sidebarMode === "icon" ? "justify-center" : ""}`}
                    title={sidebarMode === "icon" ? item.label : undefined}
                  >
                    <item.icon size={16} className="shrink-0" />
                    {sidebarMode === "full" && <span className="flex-1 text-left truncate">{item.label}</span>}
                    {sidebarMode === "full" && item.count > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold">{item.count}</span>
                    )}
                    {sidebarMode === "icon" && item.count > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
                    )}
                  </button>
                ))}

                {/* Live Chat - External Link */}
                <button
                  onClick={() => navigate("/admin/livechat")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/60 ${sidebarMode === "icon" ? "justify-center" : ""}`}
                  title={sidebarMode === "icon" ? "Live Chat" : undefined}
                >
                  <Headphones size={16} className="shrink-0" />
                  {sidebarMode === "full" && <span className="flex-1 text-left truncate">Live Chat</span>}
                </button>
                {/* ─── การตลาด / Marketing ─── */}
                {sidebarMode === "full" && (
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/40 px-3 pt-3 pb-1">{t("admin.marketing")}</p>
                )}
                {sidebarMode === "icon" && <div className="border-t border-border/50 my-1" />}
                {([
                  { id: "chatleads" as Tab, label: t("admin.chatLeads"), icon: MessageSquare, count: chatLeads.filter(c => c.status === "new").length },
                  { id: "software" as Tab, label: t("admin.software"), icon: Code2, count: 0 },
                  { id: "engagement" as Tab, label: t("admin.engagement"), icon: BarChart3, count: 0 },
                  { id: "subscribers" as Tab, label: t("admin.subscribers"), icon: Mail, count: 0 },
                ]).filter((item) => can(tabPermission[item.id], "view")).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setTab(item.id); setStatusFilter("all"); setSelectedItem(null); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      tab === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    } ${sidebarMode === "icon" ? "justify-center" : ""}`}
                    title={sidebarMode === "icon" ? item.label : undefined}
                  >
                    <item.icon size={16} className="shrink-0" />
                    {sidebarMode === "full" && <span className="flex-1 text-left truncate">{item.label}</span>}
                    {sidebarMode === "full" && item.count > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold">{item.count}</span>
                    )}
                    {sidebarMode === "icon" && item.count > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
                    )}
                  </button>
                ))}

                {/* ─── สินค้า / Products ─── */}
                {sidebarMode === "full" && (
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/40 px-3 pt-3 pb-1">{t("admin.products")}</p>
                )}
                {sidebarMode === "icon" && <div className="border-t border-border/50 my-1" />}
                {([
                  { id: "catalog" as Tab, label: t("admin.catalog"), icon: Package },
                  { id: "documents" as Tab, label: t("admin.documents"), icon: FolderOpen },
                ]).filter((item) => can(tabPermission[item.id], "view")).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setTab(item.id); setStatusFilter("all"); setSelectedItem(null); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      tab === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    } ${sidebarMode === "icon" ? "justify-center" : ""}`}
                    title={sidebarMode === "icon" ? item.label : undefined}
                  >
                    <item.icon size={16} className="shrink-0" />
                    {sidebarMode === "full" && <span className="flex-1 text-left truncate">{item.label}</span>}
                  </button>
                ))}

                {/* ระบบ / System */}
                {can("system.users", "view") && (
                  <>
                    {sidebarMode === "full" && (
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/40 px-3 pt-3 pb-1">{t("admin.system")}</p>
                    )}
                    {sidebarMode === "icon" && <div className="border-t border-border/50 my-1" />}
                    <button
                      onClick={() => { setTab("users"); setStatusFilter("all"); setSelectedItem(null); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        tab === "users"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      } ${sidebarMode === "icon" ? "justify-center" : ""}`}
                      title={sidebarMode === "icon" ? t("admin.users") : undefined}
                    >
                      <Shield size={16} className="shrink-0" />
                      {sidebarMode === "full" && <span className="flex-1 text-left truncate">{t("admin.users")}</span>}
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => { setTab("session_monitor"); setStatusFilter("all"); setSelectedItem(null); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          tab === "session_monitor"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        } ${sidebarMode === "icon" ? "justify-center" : ""}`}
                        title={sidebarMode === "icon" ? "Session Monitor" : undefined}
                      >
                        <Activity size={16} className="shrink-0" />
                        {sidebarMode === "full" && <span className="flex-1 text-left truncate">Session Monitor</span>}
                      </button>
                    )}
                  </>
                )}

                {/* Hide sidebar completely */}
                <div className="border-t border-border/50 mt-2 pt-1">
                  <button
                    onClick={() => setSidebarMode("hidden")}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] text-muted-foreground/40 hover:text-foreground hover:bg-secondary/60 transition-colors"
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
          <div className="md:hidden w-full mb-4 overflow-x-auto flex gap-1 border-b border-border pb-2">
            {([
              { id: "dashboard" as Tab, label: "ภาพรวม" },
              { id: "contacts" as Tab, label: "ติดต่อ" },
              { id: "quote_review" as Tab, label: "ใบเสนอราคา" },
              { id: "sales_orders" as Tab, label: "ยอดขาย" },
              { id: "billing" as Tab, label: "ใบวางบิล" },
              { id: "invoices" as Tab, label: "ใบแจ้งหนี้" },
              { id: "delivery" as Tab, label: "ใบส่งสินค้า" },
              { id: "payments" as Tab, label: "จ่ายเงิน" },
              { id: "catalog" as Tab, label: "สินค้า" },
              { id: "engagement" as Tab, label: "Engagement" },
              { id: "documents" as Tab, label: "เอกสาร" },
              { id: "chatleads" as Tab, label: "Chat Leads" },
              { id: "subscribers" as Tab, label: "สมาชิก" },
              { id: "software" as Tab, label: "ซอฟต์แวร์" },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setStatusFilter("all"); setSelectedItem(null); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ═══ Main Content ═══ */}
          <main className="flex-1 min-w-0 admin-content-area">
            {/* Show sidebar button when hidden */}
            {sidebarMode === "hidden" && (
              <button
                onClick={() => setSidebarMode("icon")}
                className="hidden md:flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <PanelLeft size={12} /> แสดงเมนู
              </button>
            )}

            {/* Stats row removed — only show on dashboard tab */}

        {/* CONDITIONAL RENDERING: Only mount the active tab.
            REVERTED from keep-mounted because keep-mounted caused multiple side effects:
            - Multiple components mounted simultaneously → multiple "Refresh" buttons in DOM
            - React event delegation confusion (clicks landing on hidden components)
            - Race conditions on visibility change → state corruption
            - "Stuck loading" spinner that wouldn't recover
            
            Trade-off: Tab switch re-fetches data (~500ms) but is RELIABLE.
            See conversation for full debugging history. */}

        {tab === "dashboard" && (
          <div className="space-y-4">
            {/* Sales overview stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "ยอดขายรวม / Total Sales", value: stats.totalQuotes, icon: TrendingUp, color: "text-green-500" },
                { label: "ใบเสนอราคา / Quotes", value: stats.totalQuotes, icon: FileText, color: "text-purple-400" },
                { label: "ติดต่อใหม่ / New Leads", value: stats.newLeads, icon: Users, color: "text-yellow-400" },
                { label: "Lead คุณภาพสูง / High Quality", value: stats.highScoreLeads, icon: Star, color: "text-primary" },
              ].map((s) => (
                <div key={s.label} className="card-surface rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon size={16} className={s.color} />
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                  <span className="text-3xl font-bold text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
            {/* Revenue chart */}
            <RevenueChart />
            {/* Sales Dashboard (moved from sales_orders sub-tab) */}
            <AdminSalesOrders viewMode="dashboard" />
          </div>
        )}

        {tab === "engagement" && <EngagementAnalytics />}
        {tab === "documents" && <AdminDocumentManager />}
        {tab === "catalog" && <AdminProductCatalog />}
        {tab === "quote_review" && <AdminQuoteReview />}
        {tab === "sales_orders" && <AdminSalesOrders viewMode="orders" />}
        {tab === "billing" && <AdminBillingManager />}
        {tab === "invoices" && <AdminInvoiceManager />}
        {tab === "delivery" && <AdminDeliveryManager />}
        {tab === "payments" && <AdminPaymentManager />}
        {tab === "users" && <AdminUserManagement />}
        {tab === "session_monitor" && <AdminSessionMonitor />}

        {/* Legacy fallback for tabs that don't have dedicated managers (contacts, chatleads, software, subscribers) */}
        {!["dashboard", "engagement", "documents", "catalog", "quote_review", "sales_orders", "billing", "invoices", "delivery", "payments", "users", "session_monitor"].includes(tab) && (
        <>
        {/* Filter & Export */}
        {tab === "chatleads" ? (
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={() => {
                const headers = ["Name", "Email", "Phone", "Company", "LINE ID", "Interest", "Score", "Status", "Created At"];
                const rows = chatLeads.map((l: any) => [
                  l.name || "", l.email || "", l.phone || "", l.company || "", l.line_id || "",
                  l.interest || "", l.lead_score, l.status, l.created_at
                ]);
                const csv = [headers, ...rows].map(r => r.map((c: any) => `"${c}"`).join(",")).join("\n");
                const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `chat_leads_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        ) : tab === "subscribers" ? (
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={() => {
                const headers = ["Email", "Name", "Source", "Active", "Created At"];
                const rows = subscribers.map((s: any) => [
                  s.email, s.name || "", s.source || "", s.is_active ? "Yes" : "No", s.created_at
                ]);
                const csv = [headers, ...rows].map(r => r.map((c: string) => `"${c}"`).join(",")).join("\n");
                const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `subscribers_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="all">ทั้งหมด</option>
              {(tab === "contacts"
                ? ["new", "contacted", "qualified", "closed"]
                : ["new", "quoted", "negotiating", "won", "lost"]
              ).map((s) => (
                <option key={s} value={s}>{statusLabels[s]}</option>
              ))}
            </select>
            {tab === "contacts" && (
              <button
                onClick={() => setAddContactOpen(true)}
                className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <span className="text-lg leading-none">+</span> เพิ่มติดต่อ
              </button>
            )}
            {tab === "software" && (
              <button
                onClick={() => setAddSoftwareOpen(true)}
                className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <span className="text-lg leading-none">+</span> เพิ่มสอบถามซอฟต์แวร์
              </button>
            )}
          </div>
        )}

        {tab === "contacts" && addContactOpen && (
          <AddContactForm onSuccess={() => fetchData(true)} onClose={() => setAddContactOpen(false)} />
        )}

        <AddSoftwareInquiryDialog
          open={addSoftwareOpen}
          onOpenChange={setAddSoftwareOpen}
          onSuccess={() => fetchData(true)}
        />

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">กำลังโหลด...</div>
            ) : tab === "contacts" ? (
              filteredContacts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">ยังไม่มีข้อมูล</div>
              ) : filteredContacts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem({ ...item, _type: "contact" })}
                  className={`w-full text-left card-surface rounded-xl p-4 hover:border-primary/30 transition-colors ${
                    selectedItem?.id === item.id ? "border-primary/50 ring-1 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-base font-bold text-foreground">{item.name}</span>
                      {item.company && (
                        <span className="ml-2 text-xs text-muted-foreground flex items-center gap-1 inline-flex">
                          <Building2 size={12} /> {item.company}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <LeadScoreBadge score={item.lead_score} />
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${statusColors[item.status]}`}>
                        {statusLabels[item.status]}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-1.5">{item.message}</p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70">
                    <span>{item.email}</span>
                    {item.phone && <span className="flex items-center gap-0.5"><Phone size={10} /> {item.phone}</span>}
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {formatDate(item.created_at)}</span>
                    {item.business_card_data && (
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold">📇 นามบัตร</span>
                    )}
                  </div>
                </button>
              ))
            ) : tab === "software" ? (
              softwareInquiries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">ยังไม่มีการสอบถามซอฟต์แวร์</div>
              ) : softwareInquiries.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem({ ...item, _type: "software" })}
                  className={`w-full text-left card-surface rounded-xl p-4 hover:border-primary/30 transition-colors ${
                    selectedItem?.id === item.id ? "border-primary/50 ring-1 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-base font-bold text-foreground">{item.name}</span>
                      {item.company && (
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center gap-1">
                          <Building2 size={12} /> {item.company}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        item.service_type === "saas" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      }`}>
                        {item.service_type === "saas" ? "SaaS" : "พัฒนาเฉพาะ"}
                      </span>
                      <LeadScoreBadge score={item.lead_score} />
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${statusColors[item.status] || statusColors.new}`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </div>
                  </div>
                  {item.current_problems && <p className="text-sm text-muted-foreground line-clamp-1 mb-1.5">{item.current_problems}</p>}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70">
                    <span>{item.email}</span>
                    {item.phone && <span className="flex items-center gap-0.5"><Phone size={10} /> {item.phone}</span>}
                    {item.budget_range && <span className="flex items-center gap-0.5"><Wallet size={8} /> {item.budget_range}</span>}
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {formatDate(item.created_at)}</span>
                  </div>
                </button>
              ))
            ) : tab === "chatleads" ? (
              chatLeads.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">ยังไม่มี Chat Lead</div>
              ) : chatLeads.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem({ ...item, _type: "chatlead" })}
                  className={`w-full text-left card-surface rounded-xl p-4 hover:border-primary/30 transition-colors ${
                    selectedItem?.id === item.id ? "border-primary/50 ring-1 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-base font-bold text-foreground">{item.name || "ไม่ระบุชื่อ"}</span>
                      {item.company && (
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center gap-1">
                          <Building2 size={12} /> {item.company}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <LeadScoreBadge score={item.lead_score} />
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${statusColors[item.status] || statusColors.new}`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </div>
                  </div>
                  {item.interest && <p className="text-sm text-muted-foreground line-clamp-1 mb-1.5">สนใจ: {item.interest}</p>}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70">
                    {item.email && <span>{item.email}</span>}
                    {item.phone && <span className="flex items-center gap-0.5"><Phone size={10} /> {item.phone}</span>}
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {formatDate(item.created_at)}</span>
                  </div>
                </button>
              ))
            ) : (
              subscribers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">ยังไม่มีสมาชิก</div>
              ) : subscribers.map((item) => (
                <div key={item.id} className="card-surface rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-foreground">{item.email}</span>
                      {item.name && <span className="ml-2 text-xs text-muted-foreground">({item.name})</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${item.is_active ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-[11px] text-muted-foreground/70">{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedItem ? (
              <div className="card-surface rounded-xl p-6 sticky top-20">
                <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <Eye size={16} /> รายละเอียด
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">ชื่อ:</span>
                    <span className="ml-2 text-foreground font-medium">{selectedItem.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">อีเมล:</span>
                    <a href={`mailto:${selectedItem.email}`} className="ml-2 text-primary hover:underline">{selectedItem.email}</a>
                  </div>
                  {selectedItem.phone && (
                    <div>
                      <span className="text-muted-foreground">โทรศัพท์:</span>
                      <a href={`tel:${selectedItem.phone}`} className="ml-2 text-primary hover:underline">{selectedItem.phone}</a>
                    </div>
                  )}
                  {selectedItem.company && (
                    <div>
                      <span className="text-muted-foreground">บริษัท:</span>
                      <span className="ml-2 text-foreground">{selectedItem.company}</span>
                    </div>
                  )}
                  {selectedItem.line_id && (
                    <div>
                      <span className="text-muted-foreground">LINE:</span>
                      <span className="ml-2 text-foreground">{selectedItem.line_id}</span>
                    </div>
                  )}
                  {selectedItem.whatsapp && (
                    <div>
                      <span className="text-muted-foreground">WhatsApp:</span>
                      <span className="ml-2 text-foreground">{selectedItem.whatsapp}</span>
                    </div>
                  )}
                  {selectedItem.callback_time && (
                    <div>
                      <span className="text-muted-foreground">เวลาติดต่อ:</span>
                      <span className="ml-2 text-foreground">{selectedItem.callback_time}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground">Lead Score:</span>
                    <span className="ml-2"><LeadScoreBadge score={selectedItem.lead_score} /></span>
                  </div>

                  {selectedItem._type === "contact" && (
                    <>
                      {selectedItem.category && (
                        <div>
                          <span className="text-muted-foreground">หมวดหมู่:</span>
                          <span className="ml-2 text-foreground">{selectedItem.category}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground block mb-1">ข้อความ:</span>
                        <p className="text-foreground bg-muted/30 rounded-lg p-3 text-xs leading-relaxed">{selectedItem.message}</p>
                      </div>
                      {selectedItem.business_card_data && (
                        <div className="pt-2 border-t border-border">
                          <span className="text-muted-foreground block mb-2 flex items-center gap-1">📇 ข้อมูลจากนามบัตร</span>
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1.5">
                            {selectedItem.business_card_data.name && (
                              <div className="text-xs"><span className="text-muted-foreground">ชื่อ:</span> <span className="text-foreground font-medium">{selectedItem.business_card_data.name}</span></div>
                            )}
                            {selectedItem.business_card_data.position && (
                              <div className="text-xs"><span className="text-muted-foreground">ตำแหน่ง:</span> <span className="text-foreground">{selectedItem.business_card_data.position}</span></div>
                            )}
                            {selectedItem.business_card_data.company && (
                              <div className="text-xs"><span className="text-muted-foreground">บริษัท:</span> <span className="text-foreground">{selectedItem.business_card_data.company}</span></div>
                            )}
                            {selectedItem.business_card_data.email && (
                              <div className="text-xs"><span className="text-muted-foreground">อีเมล:</span> <span className="text-primary">{selectedItem.business_card_data.email}</span></div>
                            )}
                            {selectedItem.business_card_data.phone && (
                              <div className="text-xs"><span className="text-muted-foreground">โทร:</span> <span className="text-foreground">{selectedItem.business_card_data.phone}</span></div>
                            )}
                            {selectedItem.business_card_data.address && (
                              <div className="text-xs"><span className="text-muted-foreground">ที่อยู่:</span> <span className="text-foreground">{selectedItem.business_card_data.address}</span></div>
                            )}
                            <div className="text-[11px] text-muted-foreground/60 pt-1">
                              สแกนเมื่อ: {selectedItem.business_card_data.scanned_at ? new Date(selectedItem.business_card_data.scanned_at).toLocaleString("th-TH") : "-"}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedItem._type === "quote" && (
                    <>
                      <div>
                        <span className="text-muted-foreground block mb-1">สินค้า:</span>
                        <div className="space-y-1">
                          {Array.isArray(selectedItem.products) && selectedItem.products.filter((p: any) => p.category).map((p: any, i: number) => (
                            <div key={i} className="bg-muted/30 rounded-lg p-2 text-xs">
                              <span className="font-medium">{p.category}</span>
                              {p.model && <span className="text-muted-foreground ml-1">— {p.model}</span>}
                              <span className="text-primary ml-1">×{p.qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {selectedItem.details && (() => {
                        const parsed = parseDetails(selectedItem.details);
                        const hasStructured = parsed.timeline || parsed.qty || parsed.budget;
                        return (
                          <div className="space-y-2">
                            {hasStructured && (
                              <div className="grid grid-cols-3 gap-2">
                                {parsed.timeline && (
                                  <div className="rounded-lg bg-muted/40 p-2 text-center">
                                    <CalendarClock size={12} className="mx-auto mb-0.5 text-primary" />
                                    <p className="text-[11px] text-muted-foreground">ระยะเวลา</p>
                                    <p className="text-xs font-medium text-foreground">{parsed.timeline}</p>
                                  </div>
                                )}
                                {parsed.qty && (
                                  <div className="rounded-lg bg-muted/40 p-2 text-center">
                                    <Hash size={12} className="mx-auto mb-0.5 text-primary" />
                                    <p className="text-[11px] text-muted-foreground">จำนวน</p>
                                    <p className="text-xs font-medium text-foreground">{parsed.qty}</p>
                                  </div>
                                )}
                                {parsed.budget && (
                                  <div className="rounded-lg bg-muted/40 p-2 text-center">
                                    <Wallet size={12} className="mx-auto mb-0.5 text-primary" />
                                    <p className="text-[11px] text-muted-foreground">งบประมาณ</p>
                                    <p className="text-xs font-medium text-foreground">{parsed.budget}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            {parsed.extra && (
                              <div>
                                <span className="text-muted-foreground block mb-1">ความต้องการเพิ่มเติม:</span>
                                <p className="text-foreground bg-muted/30 rounded-lg p-3 text-xs leading-relaxed">{parsed.extra}</p>
                              </div>
                            )}
                            {!hasStructured && (
                              <div>
                                <span className="text-muted-foreground block mb-1">รายละเอียด:</span>
                                <p className="text-foreground bg-muted/30 rounded-lg p-3 text-xs leading-relaxed">{selectedItem.details}</p>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {selectedItem._type === "software" && (
                    <>
                      <div>
                        <span className="text-muted-foreground">ประเภทบริการ:</span>
                        <span className={`ml-2 inline-flex items-center gap-1 font-medium ${
                          selectedItem.service_type === "saas" ? "text-blue-400" : "text-purple-400"
                        }`}>
                          {selectedItem.service_type === "saas" ? <><Cloud size={12} /> SaaS</> : <><Code2 size={12} /> พัฒนาเฉพาะ</>}
                        </span>
                      </div>
                      {selectedItem.budget_range && (
                        <div>
                          <span className="text-muted-foreground">งบประมาณ:</span>
                          <span className="ml-2 text-foreground">{selectedItem.budget_range}</span>
                        </div>
                      )}
                      {selectedItem.timeline && (
                        <div>
                          <span className="text-muted-foreground">ระยะเวลา:</span>
                          <span className="ml-2 text-foreground">{selectedItem.timeline}</span>
                        </div>
                      )}
                      {selectedItem.current_problems && (
                        <div>
                          <span className="text-muted-foreground block mb-1">ปัญหาปัจจุบัน:</span>
                          <p className="text-foreground bg-muted/30 rounded-lg p-3 text-xs leading-relaxed">{selectedItem.current_problems}</p>
                        </div>
                      )}
                      {selectedItem.requirements && (
                        <div>
                          <span className="text-muted-foreground block mb-1">ความต้องการ:</span>
                          <p className="text-foreground bg-muted/30 rounded-lg p-3 text-xs leading-relaxed">{selectedItem.requirements}</p>
                        </div>
                      )}
                    </>
                  )}

                  {selectedItem._type === "chatlead" && (
                    <>
                      {selectedItem.interest && (
                        <div>
                          <span className="text-muted-foreground">สนใจ:</span>
                          <span className="ml-2 text-foreground">{selectedItem.interest}</span>
                        </div>
                      )}
                      {selectedItem.conversation_summary && (
                        <div>
                          <span className="text-muted-foreground block mb-1">สรุปการสนทนา:</span>
                          <p className="text-foreground bg-muted/30 rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap">{selectedItem.conversation_summary}</p>
                        </div>
                      )}
                      {Array.isArray(selectedItem.messages) && selectedItem.messages.length > 0 && (
                        <div>
                          <span className="text-muted-foreground block mb-1.5">ข้อความทั้งหมด ({selectedItem.messages.length}):</span>
                          <div className="space-y-1.5 max-h-64 overflow-y-auto rounded-lg bg-muted/20 p-3">
                            {selectedItem.messages.map((m: any, i: number) => (
                              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] rounded-lg px-3 py-1.5 text-xs leading-relaxed ${
                                  m.role === "user"
                                    ? "bg-primary/15 text-foreground"
                                    : "bg-muted/50 text-muted-foreground"
                                }`}>
                                  {m.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Status update */}
                  <div className="pt-3 border-t border-border">
                    <label className="text-muted-foreground block mb-1.5">เปลี่ยนสถานะ:</label>
                    <select
                      value={selectedItem.status}
                      onChange={(e) => {
                        const table = selectedItem._type === "contact" ? "contact_submissions" 
                          : selectedItem._type === "chatlead" ? "chat_leads"
                          : selectedItem._type === "software" ? "software_inquiries"
                          : "quote_requests";
                        updateStatus(table, selectedItem.id, e.target.value);
                      }}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground"
                    >
                      {(selectedItem._type === "contact"
                        ? ["new", "contacted", "qualified", "closed"]
                        : ["new", "quoted", "negotiating", "won", "lost"]
                      ).map((s) => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-surface rounded-xl p-10 text-center text-muted-foreground text-sm">
                <Eye size={24} className="mx-auto mb-2 opacity-30" />
                เลือกรายการเพื่อดูรายละเอียด
              </div>
            )}
          </div>
        </div>
        </>
        )}
          </main>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;

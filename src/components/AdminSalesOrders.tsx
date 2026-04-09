import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package, TrendingUp, Users, DollarSign, Truck, CheckCircle,
  Clock, Loader2, RefreshCw, Search, Eye, ChevronDown,
  FileText, ExternalLink, Copy, MapPin, CreditCard, BarChart3,
  ArrowRight, AlertCircle, XCircle, Box, Printer,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { printQuote } from "@/utils/printQuote";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import DocCrossLinks from "@/components/admin/DocCrossLinks";
import DocumentCrossReference from "@/components/admin/DocumentCrossReference";
import SLAConfiguration from "@/components/admin/SLAConfiguration";

/* ─── Types ─── */
interface SalesOrder {
  id: string;
  order_number: string;
  quote_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_company: string | null;
  customer_address: string | null;
  customer_tax_id: string | null;
  assigned_to: string | null;
  po_number: string | null;
  po_file_url: string | null;
  subtotal: number;
  discount_amount: number;
  grand_total: number;
  net_payable: number;
  payment_terms: string | null;
  delivery_terms: string | null;
  status: string;
  tracking_number: string | null;
  shipping_provider: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  admin_notes: string | null;
  created_at: string;
}

interface SaleStat {
  sale_user_id: string;
  sale_name: string;
  sale_email: string;
  total_orders: number;
  total_revenue: number;
  confirmed_count: number;
  processing_count: number;
  shipped_count: number;
  delivered_count: number;
  completed_count: number;
}

interface MonthlyRevenue {
  month_num: number;
  month_name: string;
  total_revenue: number;
  order_count: number;
}

interface OrderItem {
  id: string;
  model: string;
  name_th: string | null;
  description: string | null;
  category: string | null;
  qty: number;
  unit_label: string | null;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  warranty_terms: string | null;
  admin_notes: string | null;
}

/* ─── Constants ─── */
const STATUS_CFG: Record<string, { label: string; color: string; icon: any }> = {
  confirmed: { label: "ยืนยันแล้ว", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: CheckCircle },
  processing: { label: "กำลังจัดเตรียม", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Package },
  shipped: { label: "จัดส่งแล้ว", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", icon: Truck },
  delivered: { label: "ส่งมอบแล้ว", color: "bg-teal-500/10 text-teal-600 border-teal-500/20", icon: MapPin },
  completed: { label: "เสร็จสมบูรณ์", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  cancelled: { label: "ยกเลิก", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
};

const STATUS_FLOW = ["confirmed", "processing", "shipped", "delivered", "completed"];

const inp = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

/* ─── Component ─── */
interface AdminSalesOrdersProps {
  viewMode?: "orders" | "dashboard";
}

const AdminSalesOrders = ({ viewMode = "orders" }: AdminSalesOrdersProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  // ═══════════════════════════════════════════════════════════════════════════
  // MIGRATED TO REACT QUERY: Prevents spinner-stuck when switching browser tabs
  // - Auto-refetch on window focus (if enabled in App.tsx)
  // - Invalidation via queryClient.invalidateQueries() triggers refetch
  // - Built-in loading/error states
  // ═══════════════════════════════════════════════════════════════════════════

  const [selected, setSelected] = useState<SalesOrder | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [saleFilter, setSaleFilter] = useState("all");
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<"orders" | "dashboard">("dashboard");

  // Edit fields for order
  const [editTracking, setEditTracking] = useState("");
  const [editProvider, setEditProvider] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const [companySettings, setCompanySettings] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase.from as any)("company_settings")
        .select("*").limit(1).maybeSingle();
      if (data) setCompanySettings(data);
    })();
  }, []);

  /* ─── React Query: Fetch all data ─── */
  const currentYear = new Date().getFullYear();

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin", "sales-orders"],
    queryFn: async () => {
      const { data, error } = await (supabase.from as any)("sales_orders")
        .select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as SalesOrder[];
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "sales-stats", currentYear],
    queryFn: async () => {
      const [statsRes, monthlyRes] = await Promise.all([
        supabase.rpc("get_sales_dashboard", { _year: currentYear }),
        supabase.rpc("get_monthly_revenue", { _year: currentYear }),
      ]);
      return {
        salesStats: (statsRes.data || []) as SaleStat[],
        monthlyRevenue: (monthlyRes.data || []) as MonthlyRevenue[],
      };
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  const orders = ordersData ?? [];
  const salesStats = statsData?.salesStats ?? [];
  const monthlyRevenue = statsData?.monthlyRevenue ?? [];
  const loading = ordersLoading || statsLoading;

  /* ─── Fetch order items (still uses useState for selected item) ─── */
  const fetchOrderItems = async (orderId: string) => {
    setItemsLoading(true);
    try {
      const { data } = await (supabase.from as any)("sales_order_items")
        .select("*").eq("order_id", orderId).order("sort_order");
      if (data) setOrderItems(data);
    } catch {}
    setItemsLoading(false);
  };

  /* ─── Refresh helper ─── */
  const refreshData = () => {
    qc.invalidateQueries({ queryKey: ["admin", "sales-orders"] });
    qc.invalidateQueries({ queryKey: ["admin", "sales-stats"] });
  };

  const selectOrder = (o: SalesOrder) => {
    setSelected(o);
    setEditTracking(o.tracking_number || "");
    setEditProvider(o.shipping_provider || "");
    setEditNotes(o.admin_notes || "");
    fetchOrderItems(o.id);
  };

  /* ─── Update Status ─── */
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setSaving(true);
    try {
      const updates: any = { status: newStatus, updated_at: new Date().toISOString() };
      if (newStatus === "shipped") updates.shipped_at = new Date().toISOString();
      if (newStatus === "delivered") updates.delivered_at = new Date().toISOString();
      if (newStatus === "completed") updates.completed_at = new Date().toISOString();

      const { error } = await (supabase.from as any)("sales_orders").update(updates).eq("id", orderId);
      if (error) throw error;

      toast({ title: `อัปเดตสถานะเป็น "${STATUS_CFG[newStatus]?.label || newStatus}"` });
      refreshData();
      if (selected) setSelected({ ...selected, status: newStatus, ...updates });
    } catch (err: any) {
      toast({ title: "ผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  /* ─── Save Tracking/Notes ─── */
  const handleSaveDetails = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const { error } = await (supabase.from as any)("sales_orders").update({
        tracking_number: editTracking || null,
        shipping_provider: editProvider || null,
        admin_notes: editNotes || null,
        updated_at: new Date().toISOString(),
      }).eq("id", selected.id);
      if (error) throw error;
      toast({ title: "บันทึกแล้ว" });
      refreshData();
    } catch (err: any) {
      toast({ title: "ผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  /* ─── Print Sales Order ─── */
  const handlePrintOrder = async (o: SalesOrder) => {
    try {
      const { data: items } = await (supabase.from as any)("sales_order_items")
        .select("*")
        .eq("order_id", o.id)
        .order("sort_order");

      const printItems = (items || []).map((it: any) => ({
        model: it.model,
        qty: it.qty,
        unit_price: it.unit_price,
        discount_percent: it.discount_percent || 0,
        line_total: it.line_total,
        admin_notes: it.admin_notes || null,
        description: it.description,
        _name: it.name_th || it.model,
        _desc: it.description || "",
      }));

      printQuote(
        {
          quote_number: o.order_number,
          name: o.customer_name,
          email: o.customer_email || "",
          phone: o.customer_phone,
          company: o.customer_company,
          details: o.admin_notes,
          company_address: o.customer_address,
          tax_id: o.customer_tax_id,
        },
        printItems,
        {
          discount_amount: o.discount_amount || 0,
          valid_until: "",
          payment_terms: o.payment_terms || "",
          delivery_terms: o.delivery_terms || "",
          include_vat: true,
          vat_percent: 7,
        },
        companySettings || undefined,
        undefined,
        undefined,
        undefined,
        'th',
        'sales_order',
      );
    } catch (err: any) {
      toast({ title: "พิมพ์ไม่สำเร็จ", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Helpers ─── */
  const fp = (n: number) => new Intl.NumberFormat("th-TH").format(Math.round(n));
  const fpd = (n: number) => new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2 }).format(n);
  const fd = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.grand_total, 0);
  const completedRevenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.grand_total, 0);
  const maxMonthlyRev = Math.max(...monthlyRevenue.map((m) => m.total_revenue), 1);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (saleFilter !== "all" && o.assigned_to !== saleFilter) return false;
    if (searchText) {
      const s = searchText.toLowerCase();
      if (![o.order_number, o.customer_name, o.customer_company || "", o.po_number || ""].some((f) => f.toLowerCase().includes(s))) return false;
    }
    return true;
  });

  const getSaleName = (uid: string | null) => {
    if (!uid) return "ไม่ระบุ";
    const found = salesStats.find((s) => s.sale_user_id === uid);
    return found ? found.sale_name : uid.slice(0, 8);
  };

  return (
    <div className="space-y-4">
      {/* Refresh button only (tab toggle removed) */}
      <div className="flex items-center gap-2 justify-end">
        <button onClick={refreshData} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ═══════ Dashboard View ═══════ */}
      {viewMode === "dashboard" && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="card-surface rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><DollarSign size={14} /> <span className="text-xs">รายได้รวม</span></div>
              <p className="text-xl font-bold text-primary">฿{fp(totalRevenue)}</p>
            </div>
            <div className="card-surface rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><CheckCircle size={14} /> <span className="text-xs">เสร็จสมบูรณ์</span></div>
              <p className="text-xl font-bold text-green-500">฿{fp(completedRevenue)}</p>
            </div>
            <div className="card-surface rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><Package size={14} /> <span className="text-xs">Order ทั้งหมด</span></div>
              <p className="text-xl font-bold text-foreground">{orders.filter((o) => o.status !== "cancelled").length}</p>
            </div>
            <div className="card-surface rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><Truck size={14} /> <span className="text-xs">กำลังจัดส่ง</span></div>
              <p className="text-xl font-bold text-indigo-500">{orders.filter((o) => o.status === "shipped").length}</p>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="card-surface rounded-xl p-4">
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-primary" /> รายได้รายเดือน {new Date().getFullYear()}</h4>
            <div className="flex items-end gap-1.5 h-32">
              {monthlyRevenue.map((m) => {
                const pct = maxMonthlyRev > 0 ? (m.total_revenue / maxMonthlyRev) * 100 : 0;
                return (
                  <div key={m.month_num} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">{m.total_revenue > 0 ? `฿${fp(m.total_revenue / 1000)}k` : ""}</span>
                    <div className="w-full rounded-t" style={{ height: `${Math.max(pct, 2)}%`, background: m.total_revenue > 0 ? "var(--color-primary)" : "var(--color-border)", opacity: m.total_revenue > 0 ? 1 : 0.3 }} />
                    <span className="text-[10px] text-muted-foreground">{m.month_name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-Sale Stats */}
          <div className="card-surface rounded-xl p-4">
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2"><Users size={14} className="text-primary" /> ยอดขายแยกตาม Sale</h4>
            {salesStats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="space-y-2">
                {salesStats.map((s) => (
                  <div key={s.sale_user_id} className="p-3 rounded-lg border border-border bg-secondary/10 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {s.sale_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{s.sale_name}</p>
                      <p className="text-[10px] text-muted-foreground">{s.sale_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">฿{fp(s.total_revenue)}</p>
                      <p className="text-[10px] text-muted-foreground">{s.total_orders} orders</p>
                    </div>
                    <div className="flex gap-1.5">
                      {s.confirmed_count > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">{s.confirmed_count} ยืนยัน</span>}
                      {s.processing_count > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600">{s.processing_count} จัดเตรียม</span>}
                      {s.shipped_count > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500">{s.shipped_count} จัดส่ง</span>}
                      {s.completed_count > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">{s.completed_count} สำเร็จ</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════ Orders Tab ═══════ */}
      {viewMode === "orders" && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1 flex-wrap">
              {[{ v: "all", l: "ทั้งหมด" }, ...STATUS_FLOW.map((s) => ({ v: s, l: STATUS_CFG[s].label }))].map((f) => (
                <button key={f.v} onClick={() => setStatusFilter(f.v)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === f.v ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/60"}`}>
                  {f.l} {f.v !== "all" ? `(${orders.filter((o) => o.status === f.v).length})` : ""}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <select value={saleFilter} onChange={(e) => setSaleFilter(e.target.value)} className={`${inp} text-xs py-1.5 w-36`}>
                <option value="all">ทุก Sale</option>
                {salesStats.map((s) => <option key={s.sale_user_id} value={s.sale_user_id}>{s.sale_name}</option>)}
              </select>
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={searchText} onChange={(e) => setSearchText(e.target.value)} className={`${inp} pl-8 py-1.5 text-xs w-40`} placeholder="ค้นหา..." />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Order List */}
            <div className="lg:col-span-2 space-y-1.5 max-h-[75vh] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-12"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
              ) : filteredOrders.length === 0 ? (
                <div className="card-surface rounded-xl p-10 text-center text-muted-foreground text-sm">ไม่มี Order</div>
              ) : filteredOrders.map((o) => {
                const st = STATUS_CFG[o.status] || STATUS_CFG.confirmed;
                return (
                  <button key={o.id} onClick={() => selectOrder(o)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${selected?.id === o.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-foreground">{o.order_number}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{o.customer_name} · {o.customer_company || o.customer_email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-muted-foreground">{fd(o.created_at)}</span>
                      <span className="text-xs font-bold text-primary">฿{fp(o.grand_total)}</span>
                      {o.po_number && <span className="text-[10px] text-muted-foreground">PO: {o.po_number}</span>}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{getSaleName(o.assigned_to)}</div>
                  </button>
                );
              })}
            </div>

            {/* Order Detail */}
            <div className="lg:col-span-3">
              {selected ? (
                <div className="card-surface rounded-xl p-5 space-y-4 sticky top-24 max-h-[85vh] overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{selected.order_number}</h3>
                      <p className="text-xs text-muted-foreground">จาก PO: {selected.po_number || "—"}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${(STATUS_CFG[selected.status] || STATUS_CFG.confirmed).color}`}>
                      {(STATUS_CFG[selected.status] || STATUS_CFG.confirmed).label}
                    </span>
                  </div>

                  {/* Pipeline Progress */}
                  <div className="flex items-center gap-1">
                    {STATUS_FLOW.map((s, i) => {
                      const currentIdx = STATUS_FLOW.indexOf(selected.status);
                      const isActive = i <= currentIdx;
                      const isCurrent = i === currentIdx;
                      const StIcon = STATUS_CFG[s].icon;
                      return (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isCurrent ? "bg-primary/10 text-primary ring-2 ring-primary/20" :
                            isActive ? "bg-primary text-primary-foreground" :
                            "bg-secondary text-muted-foreground/30"
                          }`}>
                            <StIcon size={12} />
                          </div>
                          {i < STATUS_FLOW.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 rounded ${i < currentIdx ? "bg-primary" : "bg-border"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground px-1">
                    {STATUS_FLOW.map((s) => <span key={s}>{STATUS_CFG[s].label}</span>)}
                  </div>

                  {/* Customer Info */}
                  <div className="p-3 rounded-lg bg-secondary/30 border border-border text-sm space-y-1">
                    <p className="font-bold text-foreground">{selected.customer_name}</p>
                    {selected.customer_company && <p className="text-muted-foreground text-xs">{selected.customer_company}</p>}
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {selected.customer_email && <span>{selected.customer_email}</span>}
                      {selected.customer_phone && <span>{selected.customer_phone}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">Sale: <span className="font-medium text-foreground">{getSaleName(selected.assigned_to)}</span></p>
                  </div>

                  {/* PO Info */}
                  {selected.po_file_url && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-teal-500/5 border border-teal-500/15 text-xs">
                      <FileText size={13} className="text-teal-500" />
                      <span className="text-foreground font-medium">PO: {selected.po_number || "—"}</span>
                      <a href={selected.po_file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 ml-auto">
                        <ExternalLink size={11} /> ดูไฟล์
                      </a>
                    </div>
                  )}

                  {/* Line Items */}
                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">รายการสินค้า</h4>
                    {itemsLoading ? (
                      <div className="py-4 text-center"><Loader2 size={14} className="animate-spin text-muted-foreground mx-auto" /></div>
                    ) : orderItems.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">ไม่มีรายการ</p>
                    ) : (
                      <div className="space-y-1.5">
                        {orderItems.map((item, i) => (
                          <div key={item.id} className="p-2 rounded-lg border border-border bg-secondary/10 flex items-start gap-2">
                            <span className="text-xs text-muted-foreground font-bold w-4 pt-0.5">{i + 1}.</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-bold text-foreground">{item.model}</span>
                              {item.name_th && <span className="text-xs text-muted-foreground ml-1.5">{item.name_th}</span>}
                              {item.description && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>}
                            </div>
                            <div className="text-right shrink-0 text-xs">
                              <span className="text-muted-foreground">{item.qty} {item.unit_label || "เครื่อง"}</span>
                              <p className="font-bold text-primary">฿{fp(item.line_total)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-border pt-3 max-w-xs ml-auto space-y-1">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">รวม</span><span>฿{fpd(selected.subtotal)}</span></div>
                    {selected.discount_amount > 0 && <div className="flex justify-between text-xs"><span className="text-muted-foreground">ส่วนลด</span><span className="text-red-400">-฿{fpd(selected.discount_amount)}</span></div>}
                    <div className="flex justify-between text-base font-bold border-t border-border pt-2"><span>ยอดรวม</span><span className="text-primary">฿{fpd(selected.grand_total)}</span></div>
                  </div>

                  {/* Tracking Info */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">ข้อมูลจัดส่ง</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground mb-0.5 block">ผู้ให้บริการขนส่ง</label>
                        <input value={editProvider} onChange={(e) => setEditProvider(e.target.value)} className={`${inp} text-xs`} placeholder="Kerry, Flash, ไปรษณีย์..." />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground mb-0.5 block">เลข Tracking</label>
                        <input value={editTracking} onChange={(e) => setEditTracking(e.target.value)} className={`${inp} text-xs`} placeholder="TH1234567890" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground mb-0.5 block">หมายเหตุ</label>
                      <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className={`${inp} resize-none text-xs`} rows={2} placeholder="บันทึกภายใน..." />
                    </div>
                    <button onClick={handleSaveDetails} disabled={saving}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50">
                      บันทึก
                    </button>
                  </div>

                  {/* Document Cross Reference Flow */}
                  <div className="border-t border-border pt-3">
                    <DocumentCrossReference
                      currentDoc={{ type: 'so', number: selected.order_number, id: selected.id }}
                      relatedDocs={[
                        { type: 'quote' as const, number: '—', id: selected.quote_id },
                        ...(selected.po_number ? [{ type: 'po' as const, number: selected.po_number, id: selected.id }] : []),
                        { type: 'so' as const, number: selected.order_number, id: selected.id },
                      ]}
                      onNavigate={(docType) => {
                        if (docType === 'quote') window.dispatchEvent(new CustomEvent("admin-switch-tab", { detail: "quote_review" }));
                        if (docType === 'bl') window.dispatchEvent(new CustomEvent("admin-switch-tab", { detail: "billing" }));
                      }}
                    />
                    <div className="mt-2">
                      <DocCrossLinks quoteId={selected.quote_id} orderId={selected.id} exclude={["order"]} />
                    </div>
                  </div>

                  {/* SLA Configuration */}
                  <div className="border-t border-border pt-3">
                    <SLAConfiguration
                      orderId={selected.id}
                      onSave={async (config) => {
                        toast({ title: "บันทึก SLA แล้ว", description: `Processing: ${config.processingHours} ${config.processingUnit === 'hours' ? 'ชม.' : 'วัน'}, Shipping: ${config.shippingDays} ${config.shippingUnit === 'hours' ? 'ชม.' : 'วัน'}` });
                      }}
                    />
                  </div>

                  {/* Print */}
                  <div className="border-t border-border pt-3">
                    <button
                      onClick={() => handlePrintOrder(selected)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors w-full justify-center"
                    >
                      <Printer size={14} /> พิมพ์ใบสั่งขาย
                    </button>
                  </div>

                  {/* Create Documents */}
                  <div className="border-t border-border pt-3 space-y-2">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">สร้างเอกสาร</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          try {
                            sessionStorage.setItem("create_billing_order_id", selected.id);
                            window.dispatchEvent(new CustomEvent("admin-switch-tab", { detail: "billing" }));
                          } catch {}
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-yellow-500/10 text-yellow-600 text-xs font-bold hover:bg-yellow-500/20 transition-colors border border-yellow-500/20"
                      >
                        <CreditCard size={14} /> ใบวางบิล
                      </button>
                      <button
                        onClick={() => {
                          try {
                            sessionStorage.setItem("create_invoice_order_id", selected.id);
                            window.dispatchEvent(new CustomEvent("admin-switch-tab", { detail: "invoices" }));
                          } catch {}
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors border border-primary/20"
                      >
                        <FileText size={14} /> ใบแจ้งหนี้
                      </button>
                      <button
                        onClick={() => {
                          try {
                            sessionStorage.setItem("create_delivery_order_id", selected.id);
                            window.dispatchEvent(new CustomEvent("admin-switch-tab", { detail: "delivery" }));
                          } catch {}
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-bold hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                      >
                        <Truck size={14} /> ใบส่งสินค้า
                      </button>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="border-t border-border pt-3 space-y-2">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">เปลี่ยนสถานะ</h4>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_FLOW.map((s) => {
                        const st = STATUS_CFG[s];
                        const currentIdx = STATUS_FLOW.indexOf(selected.status);
                        const targetIdx = STATUS_FLOW.indexOf(s);
                        const isNext = targetIdx === currentIdx + 1;
                        const isPast = targetIdx <= currentIdx;
                        return (
                          <button key={s} onClick={() => handleUpdateStatus(selected.id, s)}
                            disabled={saving || isPast}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all disabled:opacity-30 ${
                              isNext ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" :
                              `border-border text-muted-foreground hover:border-primary/30 ${isPast ? "line-through" : ""}`
                            }`}>
                            <st.icon size={12} /> {st.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-surface rounded-xl p-10 text-center text-muted-foreground text-sm">
                  <Eye size={24} className="mx-auto mb-2 opacity-30" />เลือก Order เพื่อจัดการ
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSalesOrders;

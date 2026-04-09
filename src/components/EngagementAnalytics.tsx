import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
} from "recharts";
import {
  TrendingUp, Eye, Heart, Share2, FileText, MessageSquare,
  Users, Clock, Flame, RefreshCw, Activity,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ───
interface EngagementEvent {
  id: string;
  user_id: string | null;
  session_id: string;
  event_type: string;
  product_slug: string | null;
  product_category: string | null;
  product_name: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface LeadScore {
  lead_id: string;
  user_id: string | null;
  session_id: string;
  engagement_score: number;
  total_events: number;
  products_interacted: number;
  interested_products: string[];
  interested_categories: string[];
  first_seen: string;
  last_seen: string;
}

// ─── Constants ───
const EVENT_LABELS: Record<string, string> = {
  product_view: "ดูสินค้า",
  wishlist_add: "เพิ่ม Wishlist",
  wishlist_remove: "ลบ Wishlist",
  share_line: "แชร์ LINE",
  share_facebook: "แชร์ Facebook",
  share_email: "แชร์ Email",
  share_copy_link: "คัดลอกลิงก์",
  quote_request: "ขอใบเสนอราคา",
  contact_submit: "ส่งข้อความ",
  chat_inquiry: "สอบถาม AI Chat",
};

const EVENT_COLORS: Record<string, string> = {
  product_view: "#60a5fa",
  wishlist_add: "#f472b6",
  wishlist_remove: "#9ca3af",
  share_line: "#06C755",
  share_facebook: "#1877F2",
  share_email: "#f59e0b",
  share_copy_link: "#8b5cf6",
  quote_request: "#10b981",
  contact_submit: "#f97316",
  chat_inquiry: "#6366f1",
};

const PIE_COLORS = ["#60a5fa", "#f472b6", "#06C755", "#1877F2", "#f59e0b", "#8b5cf6", "#10b981", "#f97316", "#6366f1", "#9ca3af"];

// ─── Helpers ───
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "เมื่อสักครู่";
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hours / 24);
  return `${days} วันที่แล้ว`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("th-TH", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

// ─── Main Component ───
const EngagementAnalytics = () => {
  const [events, setEvents] = useState<EngagementEvent[]>([]);
  const [leads, setLeads] = useState<LeadScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"24h" | "7d" | "30d">("7d");

  const fetchData = async () => {
    setLoading(true);
    try {
      const since = new Date();
      if (period === "24h") since.setHours(since.getHours() - 24);
      else if (period === "7d") since.setDate(since.getDate() - 7);
      else since.setDate(since.getDate() - 30);

      const [eventsRes, leadsRes] = await Promise.all([
        (supabase.from as any)("engagement_events")
          .select("*")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: false })
          .limit(5000),
        (supabase.from as any)("engagement_lead_scores")
          .select("*")
          .order("engagement_score", { ascending: false })
          .limit(200),
      ]);

      if (eventsRes.data) setEvents(eventsRes.data);
      if (leadsRes.data) setLeads(leadsRes.data);
    } catch (err) {
      console.error("[engagement-analytics]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [period]);

  // ─── Computed Stats ───
  const uniqueSessions = new Set(events.map((e) => e.session_id)).size;
  const hotLeads = leads.filter((l) => l.engagement_score >= 30);
  const warmLeads = leads.filter((l) => l.engagement_score >= 10 && l.engagement_score < 30);

  const totalViews = events.filter((e) => e.event_type === "product_view").length;
  const totalWishlist = events.filter((e) => e.event_type === "wishlist_add").length;
  const totalQuotes = events.filter((e) => e.event_type === "quote_request").length;
  const conversionRate = totalViews > 0 ? ((totalQuotes / totalViews) * 100).toFixed(1) : "0";

  // Event type breakdown for pie chart
  const eventBreakdown = Object.entries(
    events.reduce<Record<string, number>>((acc, e) => {
      acc[e.event_type] = (acc[e.event_type] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([type, count]) => ({ name: EVENT_LABELS[type] || type, value: count, type }))
    .sort((a, b) => b.value - a.value);

  // Top products
  const topProducts = Object.entries(
    events
      .filter((e) => e.product_slug)
      .reduce<Record<string, { views: number; wishlists: number; shares: number; quotes: number; name: string; category: string }>>((acc, e) => {
        const slug = e.product_slug!;
        if (!acc[slug]) acc[slug] = { views: 0, wishlists: 0, shares: 0, quotes: 0, name: e.product_name || slug, category: e.product_category || "" };
        if (e.event_type === "product_view") acc[slug].views++;
        if (e.event_type === "wishlist_add") acc[slug].wishlists++;
        if (e.event_type.startsWith("share_")) acc[slug].shares++;
        if (e.event_type === "quote_request") acc[slug].quotes++;
        return acc;
      }, {})
  )
    .map(([slug, data]) => ({ slug, ...data, total: data.views + data.wishlists * 3 + data.shares * 5 + data.quotes * 10 }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Funnel data
  const funnelData = [
    { name: "ดูสินค้า", value: totalViews, fill: "#60a5fa" },
    { name: "Wishlist", value: totalWishlist, fill: "#f472b6" },
    { name: "ขอใบเสนอราคา", value: totalQuotes, fill: "#10b981" },
  ].filter((d) => d.value > 0);

  // Recent events (last 20)
  const recentEvents = events.slice(0, 20);

  // ─── Render ───
  return (
    <div className="space-y-6">
      {/* Period Selector + Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {(["24h", "7d", "30d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {p === "24h" ? "24 ชม." : p === "7d" ? "7 วัน" : "30 วัน"}
            </button>
          ))}
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          รีเฟรช
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Events ทั้งหมด", value: events.length, icon: Activity, color: "text-blue-400" },
          { label: "Visitors", value: uniqueSessions, icon: Users, color: "text-green-400" },
          { label: "Hot Leads", value: hotLeads.length, icon: Flame, color: "text-red-400" },
          { label: "Warm Leads", value: warmLeads.length, icon: TrendingUp, color: "text-yellow-400" },
          { label: "Conversion", value: `${conversionRate}%`, icon: FileText, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="card-surface rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={14} className={s.color} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <span className="text-3xl font-bold text-foreground">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Event Type Breakdown (Pie) */}
        <div className="card-surface rounded-xl p-4">
          <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Eye size={14} className="text-primary" /> สัดส่วน Event
          </h3>
          {eventBreakdown.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={eventBreakdown} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                    {eventBreakdown.map((_, i) => (
                      <Cell key={i} fill={EVENT_COLORS[eventBreakdown[i].type] || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v} ครั้ง`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {eventBreakdown.slice(0, 6).map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: EVENT_COLORS[item.type] || PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                    <span className="ml-auto font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">ยังไม่มีข้อมูล</p>
          )}
        </div>

        {/* Conversion Funnel */}
        <div className="card-surface rounded-xl p-4">
          <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" /> Conversion Funnel
          </h3>
          {funnelData.length > 0 ? (
            <div className="space-y-3">
              {funnelData.map((step, i) => {
                const maxVal = funnelData[0].value;
                const pct = maxVal > 0 ? (step.value / maxVal) * 100 : 0;
                const dropOff = i > 0 && funnelData[i - 1].value > 0
                  ? ((1 - step.value / funnelData[i - 1].value) * 100).toFixed(0)
                  : null;
                return (
                  <div key={step.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{step.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{step.value}</span>
                        {dropOff && (
                          <span className="text-xs text-red-400">-{dropOff}%</span>
                        )}
                      </div>
                    </div>
                    <div className="h-6 bg-secondary/40 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all duration-500"
                        style={{ width: `${Math.max(pct, 2)}%`, background: step.fill }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">ยังไม่มีข้อมูล</p>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="card-surface rounded-xl p-4">
        <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <Heart size={14} className="text-primary" /> สินค้ายอดนิยม
        </h3>
        {topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">#</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">สินค้า</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">หมวดหมู่</th>
                  <th className="text-center py-2 text-muted-foreground font-medium">
                    <Eye size={11} className="inline" /> Views
                  </th>
                  <th className="text-center py-2 text-muted-foreground font-medium">
                    <Heart size={11} className="inline" /> Wishlist
                  </th>
                  <th className="text-center py-2 text-muted-foreground font-medium">
                    <Share2 size={11} className="inline" /> Share
                  </th>
                  <th className="text-center py-2 text-muted-foreground font-medium">
                    <FileText size={11} className="inline" /> Quote
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p.slug} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-2 text-muted-foreground">{i + 1}</td>
                    <td className="py-2 font-medium text-foreground">{p.name}</td>
                    <td className="py-2 text-muted-foreground">{p.category}</td>
                    <td className="py-2 text-center">{p.views}</td>
                    <td className="py-2 text-center text-pink-400">{p.wishlists}</td>
                    <td className="py-2 text-center text-blue-400">{p.shares}</td>
                    <td className="py-2 text-center text-green-400 font-bold">{p.quotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-6">ยังไม่มีข้อมูล</p>
        )}
      </div>

      {/* Bottom Row: Hot Leads + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hot Leads */}
        <div className="card-surface rounded-xl p-4">
          <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Flame size={14} className="text-red-400" /> Hot Leads
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              {hotLeads.length}
            </span>
          </h3>
          {hotLeads.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {hotLeads.slice(0, 15).map((lead) => (
                <div key={lead.lead_id} className="flex items-start gap-3 p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <Flame size={14} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground truncate">
                        {lead.user_id ? `User: ${lead.user_id.slice(0, 8)}...` : `Session: ${lead.session_id.slice(0, 12)}...`}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold">
                        Score: {lead.engagement_score}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {lead.interested_products?.slice(0, 4).map((p) => (
                        <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {p}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lead.total_events} events · {lead.products_interacted} สินค้า · ล่าสุด {timeAgo(lead.last_seen)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">ยังไม่มี Hot Lead</p>
          )}
        </div>

        {/* Recent Activity Feed */}
        <div className="card-surface rounded-xl p-4">
          <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Clock size={14} className="text-primary" /> กิจกรรมล่าสุด
          </h3>
          {recentEvents.length > 0 ? (
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {recentEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-secondary/30 transition-colors">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: EVENT_COLORS[ev.event_type] || "#9ca3af" }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-foreground">
                      {EVENT_LABELS[ev.event_type] || ev.event_type}
                    </span>
                    {ev.product_name && (
                      <span className="text-xs text-primary ml-1 font-medium">{ev.product_name}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{timeAgo(ev.created_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">ยังไม่มีกิจกรรม</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngagementAnalytics;

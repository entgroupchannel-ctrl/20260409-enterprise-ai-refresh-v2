import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, FileText, Clock, CheckCircle, Package,
  Phone, Building2, RefreshCw, ChevronDown, ChevronUp,
  CalendarClock, Hash, Wallet,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import FooterCompact from "@/components/FooterCompact";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  new: { label: "รอดำเนินการ", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Clock },
  contacted: { label: "ติดต่อแล้ว", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Phone },
  quoted: { label: "ส่งใบเสนอราคาแล้ว", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: FileText },
  negotiating: { label: "เจรจา", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: Building2 },
  won: { label: "สำเร็จ", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  closed: { label: "ปิดแล้ว", color: "bg-muted text-muted-foreground border-border", icon: CheckCircle },
};

const parseDetails = (details: string | null) => {
  if (!details) return { timeline: "", qty: "", budget: "", extra: "" };
  const timeline = details.match(/\[timeline:\s*([^\]]*)\]/)?.[1]?.trim() || "";
  const qty = details.match(/\[qty:\s*([^\]]*)\]/)?.[1]?.trim() || "";
  const budget = details.match(/\[budget:\s*([^\]]*)\]/)?.[1]?.trim() || "";
  const extra = details.replace(/\[timeline:[^\]]*\]/g, "").replace(/\[qty:[^\]]*\]/g, "").replace(/\[budget:[^\]]*\]/g, "").trim();
  return { timeline, qty, budget, extra };
};

interface QuoteRequest {
  id: string;
  created_at: string;
  status: string;
  products: any[];
  details: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
}

const MyQuotes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin-login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) fetchQuotes();
  }, [user]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({ title: "โหลดข้อมูลไม่สำเร็จ", description: error.message, variant: "destructive" });
      } else {
        setQuotes((data as QuoteRequest[]) || []);
      }
    } catch (err: any) {
      toast({ title: "โหลดข้อมูลไม่สำเร็จ", description: err?.message || "เกิดข้อผิดพลาด", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("th-TH", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <section className="py-10 md:py-14 px-4 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-primary mb-6 hover:underline">
            <ArrowLeft size={12} /> กลับหน้าหลัก
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FileText size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                ใบเสนอราคาของฉัน
              </h1>
              <p className="text-xs text-muted-foreground">ติดตามสถานะคำขอใบเสนอราคาทั้งหมด</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 pb-16 px-4">
        <div className="container max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">{quotes.length} รายการ</span>
            <button
              onClick={fetchQuotes}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <RefreshCw size={12} /> รีเฟรช
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">กำลังโหลด...</div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-16">
              <Package size={40} className="mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground mb-1">ยังไม่มีคำขอใบเสนอราคา</p>
              <Link to="/gt-series" className="text-xs text-primary hover:underline">
                ดูสินค้าและขอใบเสนอราคา →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map((q) => {
                const status = statusConfig[q.status] || statusConfig.new;
                const StatusIcon = status.icon;
                const isExpanded = expandedId === q.id;

                return (
                  <div
                    key={q.id}
                    className="card-surface rounded-xl border border-border overflow-hidden"
                  >
                    {/* Summary row */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.color}`}>
                            <StatusIcon size={10} /> {status.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{formatDate(q.created_at)}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {Array.isArray(q.products) && q.products.length > 0
                            ? q.products.map((p: any) => `${p.category || ""} ${p.model || ""}`.trim()).filter(Boolean).join(", ") || "ไม่ระบุสินค้า"
                            : "ไม่ระบุสินค้า"}
                        </p>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
                    </button>

                    {/* Detail */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-border space-y-3 animate-fade-in">
                        {/* Products */}
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-1.5">สินค้าที่ขอ</p>
                          {Array.isArray(q.products) && q.products.length > 0 ? (
                            <div className="space-y-1">
                              {q.products.map((p: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Package size={12} />
                                  <span>{p.category || "-"}</span>
                                  <span className="text-foreground font-medium">{p.model || "-"}</span>
                                  <span>×{p.qty || 1}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">-</p>
                          )}
                        </div>

                        {q.details && (() => {
                          const parsed = parseDetails(q.details);
                          const hasStructured = parsed.timeline || parsed.qty || parsed.budget;
                          return (
                            <div className="space-y-2">
                              {hasStructured && (
                                <div className="grid grid-cols-3 gap-2">
                                  {parsed.timeline && (
                                    <div className="rounded-lg bg-muted/40 p-2 text-center">
                                      <CalendarClock size={14} className="mx-auto mb-1 text-primary" />
                                      <p className="text-[10px] text-muted-foreground">ระยะเวลา</p>
                                      <p className="text-xs font-medium text-foreground">{parsed.timeline}</p>
                                    </div>
                                  )}
                                  {parsed.qty && (
                                    <div className="rounded-lg bg-muted/40 p-2 text-center">
                                      <Hash size={14} className="mx-auto mb-1 text-primary" />
                                      <p className="text-[10px] text-muted-foreground">จำนวน</p>
                                      <p className="text-xs font-medium text-foreground">{parsed.qty}</p>
                                    </div>
                                  )}
                                  {parsed.budget && (
                                    <div className="rounded-lg bg-muted/40 p-2 text-center">
                                      <Wallet size={14} className="mx-auto mb-1 text-primary" />
                                      <p className="text-[10px] text-muted-foreground">งบประมาณ</p>
                                      <p className="text-xs font-medium text-foreground">{parsed.budget}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                              {parsed.extra && (
                                <div>
                                  <p className="text-xs font-semibold text-foreground mb-1">รายละเอียดเพิ่มเติม</p>
                                  <p className="text-xs text-muted-foreground">{parsed.extra}</p>
                                </div>
                              )}
                              {!hasStructured && (
                                <div>
                                  <p className="text-xs font-semibold text-foreground mb-1">รายละเอียด</p>
                                  <p className="text-xs text-muted-foreground">{q.details}</p>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {q.notes && (
                          <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                            <p className="text-xs font-semibold text-primary mb-1">หมายเหตุจากทีมงาน</p>
                            <p className="text-xs text-foreground">{q.notes}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          {q.company && <span><Building2 className="inline w-3 h-3 mr-0.5" /> {q.company}</span>}
                          {q.phone && <span><Phone className="inline w-3 h-3 mr-0.5" /> {q.phone}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <FooterCompact />
    </div>
  );
};

export default MyQuotes;

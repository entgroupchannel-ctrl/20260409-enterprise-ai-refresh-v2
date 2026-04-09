import { useState, useEffect } from "react";
import {
  FolderOpen, FileText, Download, Clock, CheckCircle,
  XCircle, Loader2, Shield, Lock, Eye, Globe, Star,
  Search, Filter, AlertTriangle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";

/* ─── Types ─── */
interface DocItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  access_level: string; // public, visible, vip, private
  category: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

interface MyRequest {
  id: string;
  document_type: string;
  document_id: string | null;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface MyAccess {
  document_id: string;
}

/* ─── Constants ─── */
const CATEGORY_LABELS: Record<string, string> = {
  company: "เอกสารบริษัท",
  product: "เอกสารสินค้า",
  certificate: "ใบรับรอง",
  general: "ทั่วไป",
};

const ACCESS_LABELS: Record<string, { label: string; icon: typeof Globe; color: string; desc: string }> = {
  public: { label: "ดาวน์โหลดได้", icon: Globe, color: "text-green-500", desc: "สามารถดาวน์โหลดได้ทันที" },
  visible: { label: "ต้องขอสิทธิ์", icon: Lock, color: "text-yellow-500", desc: "ต้องส่งคำขอเพื่อรับสิทธิ์ดาวน์โหลด" },
  vip: { label: "เฉพาะ VIP", icon: Star, color: "text-purple-500", desc: "เฉพาะลูกค้า VIP สามารถดาวน์โหลดได้" },
};

const STATUS_LABELS: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "รอดำเนินการ", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  approved: { label: "อนุมัติแล้ว — ดาวน์โหลดได้", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  rejected: { label: "ไม่ได้รับอนุมัติ", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
};

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

/* ─── Component ─── */
const MyDocuments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { trackEvent } = useEngagementTracker();

  const [activeView, setActiveView] = useState<"browse" | "requests">("browse");
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [requests, setRequests] = useState<MyRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [myAccess, setMyAccess] = useState<Set<string>>(new Set());
  const [userTier, setUserTier] = useState("regular");
  const [searchText, setSearchText] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [requestNotes, setRequestNotes] = useState("");

  /* ─── Fetch ─── */
  const fetchDocs = async () => {
    setDocsLoading(true);
    try {
      const { data } = await (supabase.from as any)("document_library")
        .select("id, title, description, file_url, access_level, category, file_type, file_size, created_at")
        .in("access_level", ["public", "visible", "vip"])
        .order("category")
        .order("title");
      if (data) setDocs(data);
    } catch {}
    setDocsLoading(false);
  };

  const fetchRequests = async () => {
    if (!user) return;
    setReqLoading(true);
    try {
      const { data } = await (supabase.from as any)("document_requests")
        .select("id, document_type, document_id, notes, status, admin_notes, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setRequests(data);
    } catch {}
    setReqLoading(false);
  };

  const fetchMyAccess = async () => {
    if (!user) return;
    try {
      const { data } = await (supabase.from as any)("document_access")
        .select("document_id")
        .eq("user_id", user.id);
      if (data) setMyAccess(new Set(data.map((a: MyAccess) => a.document_id)));
    } catch {}
  };

  const fetchUserTier = async () => {
    if (!user) return;
    try {
      const { data } = await (supabase.from as any)("profiles")
        .select("customer_tier")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.customer_tier) setUserTier(data.customer_tier);
    } catch {}
  };

  useEffect(() => {
    fetchDocs();
    fetchRequests();
    fetchMyAccess();
    fetchUserTier();
    trackEvent({ eventType: "product_view", metadata: { page: "my_documents" } });
  }, [user]);

  /* ─── Check Download Permission ─── */
  const canDownload = (doc: DocItem): boolean => {
    if (doc.access_level === "public") return true;
    if (doc.access_level === "vip" && (userTier === "vip" || userTier === "premium")) return true;
    if (myAccess.has(doc.id)) return true;
    return false;
  };

  const hasPendingRequest = (docId: string): boolean => {
    return requests.some((r) => r.document_id === docId && r.status === "pending");
  };

  /* ─── Download with Logging ─── */
  const handleDownload = async (doc: DocItem) => {
    if (!canDownload(doc)) return;
    if (!doc.file_url) {
      toast({ title: "ไฟล์ยังไม่พร้อม", description: "กรุณาลองใหม่ภายหลัง", variant: "destructive" });
      return;
    }

    // Log download
    try {
      await (supabase.from as any)("document_download_log").insert({
        document_id: doc.id,
        user_id: user?.id,
        method: "direct",
      });
      // Increment download count
      await (supabase.from as any)("document_library")
        .update({ download_count: (doc as any).download_count ? (doc as any).download_count + 1 : 1 })
        .eq("id", doc.id);
    } catch {}

    trackEvent({ eventType: "product_view", metadata: { document_id: doc.id, title: doc.title, action: "download" } });

    // Open file
    window.open(doc.file_url, "_blank");
  };

  /* ─── Request Access ─── */
  const handleRequestAccess = async (doc: DocItem) => {
    if (!user) return;
    try {
      const { error } = await (supabase.from as any)("document_requests").insert({
        user_id: user.id,
        document_type: doc.title,
        document_id: doc.id,
        notes: requestNotes || null,
        status: "pending",
      });
      if (error) throw error;

      trackEvent({ eventType: "contact_submit", metadata: { document_id: doc.id, title: doc.title, action: "request_access" } });
      toast({ title: "ส่งคำขอสำเร็จ", description: "Admin จะตรวจสอบและอนุมัติให้เร็วที่สุด" });
      setRequestingId(null);
      setRequestNotes("");
      fetchRequests();
    } catch (err: any) {
      toast({ title: "ส่งคำขอไม่ได้", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Helpers ─── */
  const fmt = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
  const fmtSize = (b: number | null) => {
    if (!b) return "";
    if (b < 1024) return `${b} B`;
    if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`;
    return `${(b / 1048576).toFixed(1)} MB`;
  };

  const filteredDocs = docs.filter((d) => {
    if (!d.file_url) return false;
    if (filterCat !== "all" && d.category !== filterCat) return false;
    if (searchText && !d.title.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const grouped = filteredDocs.reduce<Record<string, DocItem[]>>((acc, d) => {
    const cat = d.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(d);
    return acc;
  }, {});

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <FolderOpen size={24} className="text-primary" /> คลังเอกสาร
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          ดาวน์โหลดเอกสารบริษัท, แคตตาล็อก และใบรับรองต่างๆ
        </p>
        {userTier !== "regular" && (
          <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold border border-purple-500/20">
            <Star size={12} /> สมาชิก {userTier.toUpperCase()} — ดาวน์โหลดเอกสาร VIP ได้ทันที
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
        <button onClick={() => setActiveView("browse")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
            ${activeView === "browse" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          <FolderOpen size={15} /> เรียกดูเอกสาร
        </button>
        <button onClick={() => setActiveView("requests")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
            ${activeView === "requests" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          <FileText size={15} /> คำขอของฉัน
          {pendingCount > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500 text-white">{pendingCount}</span>}
        </button>
      </div>

      {/* ═══ Browse Documents ═══ */}
      {activeView === "browse" && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="ค้นหาเอกสาร..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className={`${inputClass} pl-9`} />
            </div>
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className={`${inputClass} w-auto`}>
              <option value="all">ทุกหมวด</option>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {docsLoading ? (
            <div className="text-center py-16"><Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" /></div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>ไม่พบเอกสาร</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Shield size={14} className="text-primary" />
                    {CATEGORY_LABELS[cat] || cat}
                    <span className="text-muted-foreground font-normal">({items.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {items.map((doc) => {
                      const allowed = canDownload(doc);
                      const pending = hasPendingRequest(doc.id);
                      const al = ACCESS_LABELS[doc.access_level] || ACCESS_LABELS.visible;
                      const AlIcon = al.icon;

                      return (
                        <div key={doc.id} className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/20 transition-colors">
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${allowed ? "bg-primary/10" : "bg-secondary"}`}>
                              <FileText size={20} className={allowed ? "text-primary" : "text-muted-foreground"} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-foreground text-sm">{doc.title}</h4>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-secondary/50 ${al.color}`}>
                                  <AlIcon size={10} /> {al.label}
                                </span>
                              </div>
                              {doc.description && <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>}
                              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                                {doc.file_type && <span>{doc.file_type.split("/").pop()?.toUpperCase()}</span>}
                                {doc.file_size && <span>{fmtSize(doc.file_size)}</span>}
                                <span>{fmt(doc.created_at)}</span>
                              </div>
                            </div>

                            {/* Action */}
                            <div className="shrink-0">
                              {allowed ? (
                                <button onClick={() => handleDownload(doc)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all">
                                  <Download size={14} /> ดาวน์โหลด
                                </button>
                              ) : pending ? (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-yellow-500/10 text-yellow-600 text-xs font-semibold border border-yellow-500/20">
                                  <Clock size={14} /> รอ Admin อนุมัติ
                                </span>
                              ) : requestingId === doc.id ? (
                                <div className="space-y-2 w-56">
                                  <textarea placeholder="หมายเหตุ (ไม่บังคับ)" value={requestNotes} onChange={(e) => setRequestNotes(e.target.value)}
                                    className={`${inputClass} text-xs resize-none`} rows={2} />
                                  <div className="flex gap-2">
                                    <button onClick={() => handleRequestAccess(doc)}
                                      className="flex-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all">
                                      ยืนยัน
                                    </button>
                                    <button onClick={() => { setRequestingId(null); setRequestNotes(""); }}
                                      className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-secondary transition-all">
                                      ยกเลิก
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button onClick={() => setRequestingId(doc.id)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/10 transition-all">
                                  <Lock size={14} /> ขอเอกสาร
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ My Requests ═══ */}
      {activeView === "requests" && (
        <div className="space-y-4">
          {reqLoading ? (
            <div className="text-center py-16"><Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" /></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p>ยังไม่มีคำขอเอกสาร</p>
              <button onClick={() => setActiveView("browse")} className="mt-3 text-primary text-sm font-medium hover:underline">
                เรียกดูเอกสาร →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {requests.map((req) => {
                const st = STATUS_LABELS[req.status] || STATUS_LABELS.pending;
                const StIcon = st.icon;
                const doc = req.document_id ? docs.find((d) => d.id === req.document_id) : null;
                const canDl = doc && canDownload(doc);

                return (
                  <div key={req.id} className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.color}`}>
                            <StIcon size={11} /> {st.label}
                          </span>
                          <span className="font-semibold text-foreground text-sm">{doc?.title || req.document_type}</span>
                        </div>
                        <div className="mt-1.5 text-xs text-muted-foreground space-y-0.5">
                          {req.notes && <p>หมายเหตุ: {req.notes}</p>}
                          {req.admin_notes && <p>จาก Admin: <span className="text-foreground">{req.admin_notes}</span></p>}
                          <p>ส่งคำขอเมื่อ {fmt(req.created_at)}</p>
                        </div>
                      </div>

                      {/* Download if approved */}
                      {req.status === "approved" && canDl && doc?.file_url && (
                        <button onClick={() => handleDownload(doc)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shrink-0">
                          <Download size={14} /> ดาวน์โหลด
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyDocuments;

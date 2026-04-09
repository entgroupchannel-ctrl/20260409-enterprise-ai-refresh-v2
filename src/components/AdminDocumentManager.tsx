import { useState, useEffect, useRef } from "react";
import {
  FolderOpen, Upload, FileText, Download, Clock, CheckCircle,
  XCircle, Loader2, Trash2, Eye, Search, Shield, Link2,
  Copy, Users, Lock, Unlock, Globe, Star, AlertTriangle,
  ChevronDown, MoreHorizontal, Filter, RefreshCw, UserCheck,
  FileUp, X, Check, ExternalLink, History,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ─── Types ─── */
interface DocLibrary {
  id: string;
  document_type: string;
  title: string;
  description: string | null;
  file_url: string;
  product_model: string | null;
  is_public: boolean;
  download_count: number;
  access_level: string;
  category: string;
  file_size: number | null;
  file_type: string | null;
  share_token: string | null;
  created_at: string;
  updated_at: string | null;
}

interface DocRequest {
  id: string;
  user_id: string;
  document_type: string;
  document_id: string | null;
  product_model: string | null;
  serial_number: string | null;
  notes: string | null;
  status: string;
  file_url: string | null;
  admin_notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string | null;
}

interface DocAccess {
  id: string;
  user_id: string;
  document_id: string;
  granted_by: string | null;
  granted_at: string;
  expires_at: string | null;
  notes: string | null;
}

interface DownloadLog {
  id: string;
  document_id: string;
  user_id: string | null;
  downloaded_at: string;
  method: string;
}

/* ─── Constants ─── */
const ACCESS_LEVELS = [
  { value: "public", label: "สาธารณะ", desc: "ทุกคนเห็น+โหลดได้", icon: Globe, color: "text-green-500" },
  { value: "visible", label: "เห็นได้ — ต้องขอ", desc: "เห็นเอกสาร แต่ต้องขอสิทธิ์ก่อนโหลด", icon: Eye, color: "text-yellow-500" },
  { value: "vip", label: "ลูกค้า VIP", desc: "เฉพาะลูกค้า VIP โหลดได้เลย", icon: Star, color: "text-purple-500" },
  { value: "private", label: "ซ่อน", desc: "ซ่อนจากผู้ใช้ทั่วไป", icon: Lock, color: "text-red-500" },
];

const CATEGORIES = [
  { value: "company", label: "เอกสารบริษัท" },
  { value: "product", label: "เอกสารสินค้า" },
  { value: "certificate", label: "ใบรับรอง / Certificate" },
  { value: "general", label: "ทั่วไป" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "รอดำเนินการ", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  approved: { label: "อนุมัติแล้ว", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  rejected: { label: "ไม่อนุมัติ", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
};

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

const btnPrimary =
  "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50";

const btnSecondary =
  "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-medium hover:bg-secondary transition-all";

/* ─── Component ─── */
const AdminDocumentManager = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"library" | "requests" | "access" | "logs">("library");

  // Library
  const [docs, setDocs] = useState<DocLibrary[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAccess, setFilterAccess] = useState("all");

  // Upload
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", document_type: "general", category: "company", access_level: "visible", product_model: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Requests
  const [requests, setRequests] = useState<DocRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [reqFilter, setReqFilter] = useState("pending");

  // Access
  const [accesses, setAccesses] = useState<DocAccess[]>([]);

  // Logs
  const [logs, setLogs] = useState<DownloadLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // User profiles cache (for showing names instead of IDs)
  const [userProfiles, setUserProfiles] = useState<Record<string, { full_name: string; company_name: string | null }>>({});

  // Edit
  const [editDoc, setEditDoc] = useState<DocLibrary | null>(null);

  /* ─── Fetch ─── */
  const fetchDocs = async () => {
    setDocsLoading(true);
    try {
      const { data } = await (supabase.from as any)("document_library").select("*").order("created_at", { ascending: false });
      if (data) setDocs(data);
    } catch {}
    setDocsLoading(false);
  };

  const fetchRequests = async () => {
    setReqLoading(true);
    try {
      const { data } = await (supabase.from as any)("document_requests").select("*").order("created_at", { ascending: false });
      if (data) {
        setRequests(data);
        // Fetch user profiles for all unique user_ids
        const userIds = [...new Set(data.map((r: DocRequest) => r.user_id))];
        if (userIds.length > 0) {
          const { data: profiles } = await (supabase.from as any)("profiles")
            .select("id, full_name, company_name")
            .in("id", userIds);
          if (profiles) {
            const map: Record<string, { full_name: string; company_name: string | null }> = {};
            profiles.forEach((p: any) => { map[p.id] = { full_name: p.full_name || "", company_name: p.company_name || null }; });
            setUserProfiles((prev) => ({ ...prev, ...map }));
          }
        }
      }
    } catch {}
    setReqLoading(false);
  };

  const fetchAccess = async () => {
    try {
      const { data } = await (supabase.from as any)("document_access").select("*").order("granted_at", { ascending: false });
      if (data) {
        setAccesses(data);
        // Also fetch profiles for access list
        const userIds = [...new Set(data.map((a: DocAccess) => a.user_id))];
        if (userIds.length > 0) {
          const { data: profiles } = await (supabase.from as any)("profiles")
            .select("id, full_name, company_name")
            .in("id", userIds);
          if (profiles) {
            const map: Record<string, { full_name: string; company_name: string | null }> = {};
            profiles.forEach((p: any) => { map[p.id] = { full_name: p.full_name || "", company_name: p.company_name || null }; });
            setUserProfiles((prev) => ({ ...prev, ...map }));
          }
        }
      }
    } catch {}
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const { data } = await (supabase.from as any)("document_download_log").select("*").order("downloaded_at", { ascending: false }).limit(100);
      if (data) setLogs(data);
    } catch {}
    setLogsLoading(false);
  };

  useEffect(() => { fetchDocs(); fetchRequests(); fetchAccess(); }, []);
  useEffect(() => { if (activeTab === "logs") fetchLogs(); }, [activeTab]);

  /* ─── Upload ─── */
  const handleFileUpload = async () => {
    if (!uploadFile || !uploadForm.title) {
      toast({ title: "กรุณากรอกชื่อเอกสารและเลือกไฟล์", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const filePath = `docs/${Date.now()}_${uploadFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("documents").upload(filePath, uploadFile, { contentType: uploadFile.type });
      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath);
      const fileUrl = urlData?.publicUrl || "";

      const { error: insErr } = await (supabase.from as any)("document_library").insert({
        document_type: uploadForm.document_type,
        title: uploadForm.title,
        description: uploadForm.description || null,
        file_url: fileUrl,
        product_model: uploadForm.product_model || null,
        is_public: uploadForm.access_level !== "private",
        access_level: uploadForm.access_level,
        category: uploadForm.category,
        file_size: uploadFile.size,
        file_type: uploadFile.type,
        download_count: 0,
      });
      if (insErr) throw insErr;

      toast({ title: "อัปโหลดเอกสารสำเร็จ" });
      setShowUpload(false);
      setUploadFile(null);
      setUploadForm({ title: "", description: "", document_type: "general", category: "company", access_level: "visible", product_model: "" });
      fetchDocs();
    } catch (err: any) {
      toast({ title: "อัปโหลดล้มเหลว", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  /* ─── Approve / Reject ─── */
  const handleApproveRequest = async (req: DocRequest) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await (supabase.from as any)("document_requests")
        .update({ status: "approved", approved_by: user?.id, approved_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", req.id);

      if (req.document_id) {
        await (supabase.from as any)("document_access").upsert({
          user_id: req.user_id, document_id: req.document_id, granted_by: user?.id,
          notes: `อนุมัติจากคำขอ #${req.id.slice(0, 8)}`,
        }, { onConflict: "user_id,document_id" });
      }

      try {
        await (supabase.from as any)("notifications").insert({
          user_id: req.user_id, type: "document_ready",
          title: "คำขอเอกสารได้รับอนุมัติ",
          message: `เอกสาร "${req.document_type}" พร้อมดาวน์โหลดแล้ว`,
          link: "/my-account?tab=documents",
        });
      } catch {}

      toast({ title: "อนุมัติคำขอสำเร็จ" });
      fetchRequests();
      fetchAccess();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  const handleRejectRequest = async (req: DocRequest) => {
    const reason = prompt("เหตุผลที่ปฏิเสธ (ไม่บังคับ):");
    try {
      await (supabase.from as any)("document_requests")
        .update({ status: "rejected", admin_notes: reason || "ไม่อนุมัติ", updated_at: new Date().toISOString() })
        .eq("id", req.id);

      try {
        await (supabase.from as any)("notifications").insert({
          user_id: req.user_id, type: "document_rejected",
          title: "คำขอเอกสารไม่ได้รับอนุมัติ",
          message: reason || "ไม่อนุมัติ",
          link: "/my-account?tab=documents",
        });
      } catch {}

      toast({ title: "ปฏิเสธคำขอแล้ว" });
      fetchRequests();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Share Link ─── */
  const handleShareLink = async (doc: DocLibrary) => {
    try {
      if (doc.share_token) {
        const link = `${window.location.origin}/documents/share/${doc.share_token}`;
        await navigator.clipboard.writeText(link);
        toast({ title: "คัดลอกลิงก์แชร์แล้ว", description: link });
      } else {
        const { data, error } = await (supabase.rpc as any)("generate_doc_share_token", { _document_id: doc.id });
        if (error) throw error;
        const link = `${window.location.origin}/documents/share/${data}`;
        await navigator.clipboard.writeText(link);
        toast({ title: "สร้างและคัดลอกลิงก์แชร์แล้ว", description: link });
        fetchDocs();
      }
    } catch (err: any) {
      toast({ title: "ไม่สามารถสร้างลิงก์ได้", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Delete / Update ─── */
  const handleDeleteDoc = async (doc: DocLibrary) => {
    if (!confirm(`ลบเอกสาร "${doc.title}"?`)) return;
    try {
      if (doc.file_url?.includes("/documents/")) {
        const path = doc.file_url.split("/documents/")[1];
        if (path) await supabase.storage.from("documents").remove([decodeURIComponent(path)]);
      }
      await (supabase.from as any)("document_library").delete().eq("id", doc.id);
      toast({ title: "ลบเอกสารแล้ว" });
      fetchDocs();
    } catch (err: any) {
      toast({ title: "ลบไม่ได้", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdateDoc = async () => {
    if (!editDoc) return;
    try {
      await (supabase.from as any)("document_library").update({
        title: editDoc.title, description: editDoc.description,
        access_level: editDoc.access_level, category: editDoc.category,
        is_public: editDoc.access_level !== "private",
        updated_at: new Date().toISOString(),
      }).eq("id", editDoc.id);
      toast({ title: "บันทึกสำเร็จ" });
      setEditDoc(null);
      fetchDocs();
    } catch (err: any) {
      toast({ title: "บันทึกไม่ได้", description: err.message, variant: "destructive" });
    }
  };

  const handleRevokeAccess = async (id: string) => {
    if (!confirm("ยกเลิกสิทธิ์?")) return;
    await (supabase.from as any)("document_access").delete().eq("id", id);
    toast({ title: "ยกเลิกสิทธิ์แล้ว" });
    fetchAccess();
  };

  /* ─── Helpers ─── */
  const fmt = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const fmtSize = (b: number | null) => {
    if (!b) return "—";
    if (b < 1024) return `${b} B`;
    if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1048576).toFixed(1)} MB`;
  };
  const getUserDisplayName = (uid: string): string => {
    const p = userProfiles[uid];
    if (p?.full_name && p?.company_name) return `${p.full_name} (${p.company_name})`;
    if (p?.full_name) return p.full_name;
    return uid.slice(0, 12) + "…";
  };

  const accessBadge = (level: string) => {
    const a = ACCESS_LEVELS.find((l) => l.value === level);
    if (!a) return null;
    const Icon = a.icon;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-secondary/50">
        <Icon size={11} className={a.color} /> {a.label}
      </span>
    );
  };

  const filteredDocs = docs.filter((d) => {
    if (filterCategory !== "all" && d.category !== filterCategory) return false;
    if (filterAccess !== "all" && d.access_level !== filterAccess) return false;
    if (searchText && !d.title.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const filteredRequests = reqFilter === "all" ? requests : requests.filter((r) => r.status === reqFilter);
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const tabs = [
    { id: "library" as const, label: "คลังเอกสาร", icon: FolderOpen, count: docs.length },
    { id: "requests" as const, label: "คำขอเอกสาร", icon: FileText, count: pendingCount },
    { id: "access" as const, label: "สิทธิ์การเข้าถึง", icon: Users, count: accesses.length },
    { id: "logs" as const, label: "ประวัติดาวน์โหลด", icon: History, count: null },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">ศูนย์จัดการเอกสาร</h2>
          <p className="text-sm text-muted-foreground mt-1">อัปโหลด, จัดการสิทธิ์, อนุมัติคำขอ และแชร์เอกสาร</p>
        </div>
        <button onClick={() => setShowUpload(true)} className={btnPrimary}>
          <Upload size={16} /> อัปโหลดเอกสาร
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${activeTab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon size={15} />
              <span className="hidden sm:inline">{t.label}</span>
              {t.count !== null && t.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${t.id === "requests" && pendingCount > 0 ? "bg-red-500 text-white" : "bg-muted text-muted-foreground"}`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══ TAB: Library ═══ */}
      {activeTab === "library" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="ค้นหาเอกสาร..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className={`${inputClass} pl-9`} />
            </div>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`${inputClass} w-auto`}>
              <option value="all">ทุกหมวด</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select value={filterAccess} onChange={(e) => setFilterAccess(e.target.value)} className={`${inputClass} w-auto`}>
              <option value="all">ทุกระดับ</option>
              {ACCESS_LEVELS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          {docsLoading ? (
            <div className="text-center py-16"><Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" /></div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>ยังไม่มีเอกสารในคลัง</p>
              <button onClick={() => setShowUpload(true)} className={`${btnPrimary} mt-4`}><Upload size={15} /> อัปโหลดเอกสารแรก</button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl border border-border bg-card hover:bg-secondary/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground text-sm">{doc.title}</h4>
                        {accessBadge(doc.access_level)}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {CATEGORIES.find((c) => c.value === doc.category)?.label || doc.category}
                        </span>
                      </div>
                      {doc.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{doc.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                        <span>{fmt(doc.created_at)}</span>
                        <span>{fmtSize(doc.file_size)}</span>
                        <span className="flex items-center gap-1"><Download size={11} /> {doc.download_count}</span>
                        {!doc.file_url && <span className="text-yellow-500 flex items-center gap-1"><AlertTriangle size={11} /> ยังไม่มีไฟล์</span>}
                        {doc.share_token && <span className="text-primary flex items-center gap-1"><Link2 size={11} /> มีลิงก์แชร์</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="เปิดไฟล์">
                          <ExternalLink size={15} />
                        </a>
                      )}
                      <button onClick={() => handleShareLink(doc)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary" title="สร้าง/คัดลอกลิงก์แชร์">
                        <Link2 size={15} />
                      </button>
                      <button onClick={() => setEditDoc(doc)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="แก้ไข">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => handleDeleteDoc(doc)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-red-500" title="ลบ">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB: Requests ═══ */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {["pending", "approved", "rejected", "all"].map((s) => (
              <button key={s} onClick={() => setReqFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${reqFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {s === "all" ? "ทั้งหมด" : STATUS_CONFIG[s]?.label || s}
                {s === "pending" && pendingCount > 0 && <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{pendingCount}</span>}
              </button>
            ))}
          </div>

          {reqLoading ? (
            <div className="text-center py-16"><Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" /></div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <CheckCircle size={40} className="mx-auto mb-3 opacity-30" />
              <p>ไม่มีคำขอ{reqFilter === "pending" ? "ที่รอดำเนินการ" : ""}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRequests.map((req) => {
                const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                const Icon = sc.icon;
                const docRef = req.document_id ? docs.find((d) => d.id === req.document_id) : null;
                return (
                  <div key={req.id} className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sc.color}`}>
                            <Icon size={11} /> {sc.label}
                          </span>
                          <span className="font-semibold text-foreground text-sm">
                            {docRef?.title || req.document_type}
                          </span>
                        </div>
                        <div className="mt-1.5 text-xs text-muted-foreground space-y-0.5">
                          <p>ผู้ขอ: <span className="text-foreground font-medium">{getUserDisplayName(req.user_id)}</span></p>
                          {req.notes && <p>หมายเหตุ: <span className="text-foreground">{req.notes}</span></p>}
                          {req.admin_notes && <p>Admin: <span className="text-foreground">{req.admin_notes}</span></p>}
                          <p>{fmt(req.created_at)}</p>
                        </div>
                      </div>
                      {req.status === "pending" && (
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleApproveRequest(req)}
                            className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs font-semibold hover:bg-green-500/20 transition-colors flex items-center gap-1">
                            <Check size={13} /> อนุมัติ
                          </button>
                          <button onClick={() => handleRejectRequest(req)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 transition-colors flex items-center gap-1">
                            <X size={13} /> ปฏิเสธ
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB: Access ═══ */}
      {activeTab === "access" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">สิทธิ์เข้าถึงเอกสารที่กำหนดเฉพาะ user — จากการอนุมัติคำขอ หรือ admin กำหนดเอง</p>
          {accesses.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p>ยังไม่มีสิทธิ์เฉพาะ — จะเกิดขึ้นเมื่ออนุมัติคำขอเอกสาร</p>
            </div>
          ) : (
            <div className="space-y-2">
              {accesses.map((a) => {
                const doc = docs.find((d) => d.id === a.document_id);
                return (
                  <div key={a.id} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <UserCheck size={14} className="text-green-500 shrink-0" />
                        <span className="text-sm font-medium text-foreground">{getUserDisplayName(a.user_id)}</span>
                        <span className="text-muted-foreground text-xs">→</span>
                        <span className="text-sm text-foreground font-medium">{doc?.title || "เอกสาร #" + a.document_id.slice(0, 8)}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 flex flex-wrap gap-3">
                        <span>อนุมัติเมื่อ {fmt(a.granted_at)}</span>
                        {a.expires_at && <span className="text-yellow-500">หมดอายุ {fmt(a.expires_at)}</span>}
                        {a.notes && <span>— {a.notes}</span>}
                      </div>
                    </div>
                    <button onClick={() => handleRevokeAccess(a.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors" title="ยกเลิกสิทธิ์">
                      <XCircle size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ TAB: Logs ═══ */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">ประวัติดาวน์โหลดเอกสาร (ล่าสุด 100 รายการ)</p>
            <button onClick={fetchLogs} className={btnSecondary}><RefreshCw size={14} /> รีเฟรช</button>
          </div>
          {logsLoading ? (
            <div className="text-center py-16"><Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" /></div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <History size={40} className="mx-auto mb-3 opacity-30" />
              <p>ยังไม่มีประวัติดาวน์โหลด</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead className="bg-secondary/50">
                  <tr className="text-muted-foreground">
                    <th className="text-left py-2.5 px-3 font-medium">เวลา</th>
                    <th className="text-left py-2.5 px-3 font-medium">User</th>
                    <th className="text-left py-2.5 px-3 font-medium">เอกสาร</th>
                    <th className="text-left py-2.5 px-3 font-medium">ช่องทาง</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const doc = docs.find((d) => d.id === log.document_id);
                    return (
                      <tr key={log.id} className="border-t border-border/50 hover:bg-secondary/30">
                        <td className="py-2 px-3 text-muted-foreground">{fmt(log.downloaded_at)}</td>
                        <td className="py-2 px-3 font-medium text-foreground">{log.user_id ? getUserDisplayName(log.user_id) : "—"}</td>
                        <td className="py-2 px-3">{doc?.title || log.document_id.slice(0, 12)}</td>
                        <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{log.method}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══ MODAL: Upload ═══ */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><FileUp size={20} className="text-primary" /> อัปโหลดเอกสาร</h3>
              <button onClick={() => setShowUpload(false)} className="p-1.5 rounded-lg hover:bg-secondary"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">ชื่อเอกสาร *</label>
                <input type="text" placeholder="เช่น หนังสือรับรองบริษัท" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">คำอธิบาย</label>
                <textarea placeholder="รายละเอียดเอกสาร..." value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} className={`${inputClass} resize-none`} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">หมวดหมู่</label>
                  <select value={uploadForm.category} onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })} className={inputClass}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">ระดับสิทธิ์</label>
                  <select value={uploadForm.access_level} onChange={(e) => setUploadForm({ ...uploadForm, access_level: e.target.value })} className={inputClass}>
                    {ACCESS_LEVELS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
              </div>
              {/* Access level description */}
              <div className="p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                {ACCESS_LEVELS.find((a) => a.value === uploadForm.access_level)?.desc}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">เลือกไฟล์ *</label>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.rar" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className={`${btnSecondary} w-full justify-center`}>
                  <Upload size={15} />
                  {uploadFile ? <span className="truncate">{uploadFile.name} ({fmtSize(uploadFile.size)})</span> : <span>Browse ไฟล์... (PDF, DOC, XLS, JPG, ZIP)</span>}
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button onClick={() => setShowUpload(false)} className={btnSecondary}>ยกเลิก</button>
              <button onClick={handleFileUpload} disabled={uploading || !uploadFile || !uploadForm.title} className={btnPrimary}>
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                {uploading ? "กำลังอัปโหลด..." : "อัปโหลด"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: Edit ═══ */}
      {editDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditDoc(null)}>
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">แก้ไขเอกสาร</h3>
              <button onClick={() => setEditDoc(null)} className="p-1.5 rounded-lg hover:bg-secondary"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">ชื่อเอกสาร</label>
                <input type="text" value={editDoc.title} onChange={(e) => setEditDoc({ ...editDoc, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">คำอธิบาย</label>
                <textarea value={editDoc.description || ""} onChange={(e) => setEditDoc({ ...editDoc, description: e.target.value })} className={`${inputClass} resize-none`} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">หมวดหมู่</label>
                  <select value={editDoc.category} onChange={(e) => setEditDoc({ ...editDoc, category: e.target.value })} className={inputClass}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">ระดับสิทธิ์</label>
                  <select value={editDoc.access_level} onChange={(e) => setEditDoc({ ...editDoc, access_level: e.target.value })} className={inputClass}>
                    {ACCESS_LEVELS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
              </div>
              {editDoc.share_token && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">ลิงก์แชร์</label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={`${window.location.origin}/documents/share/${editDoc.share_token}`} className={`${inputClass} text-xs font-mono`} />
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/documents/share/${editDoc.share_token}`); toast({ title: "คัดลอกแล้ว" }); }} className={btnSecondary}><Copy size={14} /></button>
                  </div>
                </div>
              )}
              {editDoc.file_url && (
                <div className="text-xs text-muted-foreground">
                  ไฟล์: <a href={editDoc.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{editDoc.file_url.split("/").pop()}</a>
                  {editDoc.file_size && <span className="ml-2">({fmtSize(editDoc.file_size)})</span>}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button onClick={() => setEditDoc(null)} className={btnSecondary}>ยกเลิก</button>
              <button onClick={handleUpdateDoc} className={btnPrimary}><Check size={15} /> บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDocumentManager;

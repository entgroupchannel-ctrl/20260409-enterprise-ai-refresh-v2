import { useState, useEffect, useMemo } from "react";
import {
  Phone, Mail, Building2, MessageSquare, Clock, Plus, X, Loader2,
  User, Users, AlertCircle, CheckCircle, Calendar, ArrowRight,
  PhoneCall, Globe, MapPin, MessageCircle, FileText,
  TrendingUp, Filter, Search, ChevronDown, Send, Edit3,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

/* ─── Types ─── */
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  line_id: string | null;
  whatsapp: string | null;
  callback_time: string | null;
  category: string | null;
  message: string;
  lead_score: number;
  status: string;
  case_type: string | null;
  priority: string | null;
  source: string | null;
  assigned_to: string | null;
  assigned_team: string | null;
  follow_up_date: string | null;
  converted_to_quote_id: string | null;
  closed_at: string | null;
  closed_by: string | null;
  created_by: string | null;
  notes: string | null;
  business_card_data: any;
  created_at: string;
}

interface Activity {
  id: string;
  contact_id: string;
  activity_type: string;
  content: string | null;
  metadata: any;
  created_by: string | null;
  created_at: string;
}

interface StaffMember {
  user_id: string;
  email: string;
  full_name: string;
  roles: string[];
}

/* ─── Config ─── */
const CASE_TYPES = [
  { value: "sales",   label: "งานขาย",     color: "bg-blue-500/10 text-blue-500 border-blue-500/20",       icon: TrendingUp },
  { value: "service", label: "งานบริการ",  color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: User },
  { value: "support", label: "งานสนับสนุน", color: "bg-teal-500/10 text-teal-500 border-teal-500/20",      icon: MessageCircle },
];

const PRIORITIES = [
  { value: "low",    label: "ต่ำ",     color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  { value: "normal", label: "ปกติ",   color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { value: "high",   label: "สูง",     color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  { value: "urgent", label: "ด่วน",   color: "bg-red-500/10 text-red-400 border-red-500/20" },
];

const STATUSES = [
  { value: "new",         label: "ใหม่",         color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { value: "contacted",   label: "ติดต่อแล้ว",   color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  { value: "qualified",   label: "คุณสมบัติผ่าน", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { value: "in_progress", label: "ดำเนินการ",   color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  { value: "closed",      label: "ปิดงาน",       color: "bg-green-500/10 text-green-500 border-green-500/20" },
];

const SOURCES = [
  { value: "web_form", label: "ฟอร์มเว็บ",    icon: Globe },
  { value: "phone",    label: "โทรศัพท์",     icon: PhoneCall },
  { value: "walkin",   label: "เดินเข้ามา",   icon: MapPin },
  { value: "line",     label: "LINE",          icon: MessageCircle },
  { value: "email",    label: "อีเมล",        icon: Mail },
  { value: "other",    label: "อื่นๆ",         icon: MessageSquare },
];

const ACTIVITY_TYPES: Record<string, { label: string; icon: typeof FileText; color: string }> = {
  note:             { label: "บันทึก",         icon: FileText,    color: "text-gray-400" },
  call:             { label: "โทรศัพท์",       icon: Phone,       color: "text-blue-400" },
  email:            { label: "ส่งอีเมล",       icon: Mail,        color: "text-purple-400" },
  sms:              { label: "ส่ง SMS",        icon: MessageSquare, color: "text-green-400" },
  line:             { label: "LINE",           icon: MessageCircle, color: "text-green-500" },
  meeting:          { label: "นัดหมาย",        icon: Calendar,    color: "text-indigo-400" },
  status_change:    { label: "เปลี่ยนสถานะ",   icon: ArrowRight,  color: "text-yellow-400" },
  assignment:       { label: "มอบหมาย",        icon: User,        color: "text-blue-400" },
  priority_change:  { label: "เปลี่ยนความสำคัญ", icon: AlertCircle, color: "text-orange-400" },
  case_type_change: { label: "เปลี่ยนประเภท",  icon: Edit3,       color: "text-purple-400" },
  follow_up_set:    { label: "ตั้งติดตาม",     icon: Clock,       color: "text-cyan-400" },
  converted:        { label: "แปลงเป็น Quote", icon: CheckCircle, color: "text-green-500" },
};

const inp = "w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary";
const lbl = "text-xs font-medium text-muted-foreground mb-1 block";

/* ─── Utilities ─── */
const fmtDate = (s: string) => {
  const d = new Date(s);
  return d.toLocaleString("th-TH", { day: "2-digit", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" });
};

const fmtRelative = (s: string) => {
  const diff = Date.now() - new Date(s).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "เมื่อสักครู่";
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ชม.ที่แล้ว`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} วันที่แล้ว`;
  return fmtDate(s);
};

/* ─── Component ─── */
const AdminContactsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [caseFilter, setCaseFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignFilter, setAssignFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Manual entry dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "", email: "", phone: "", company: "",
    line_id: "", whatsapp: "",
    case_type: "sales", priority: "normal", source: "phone",
    message: "", assigned_team: "sales",
  });

  // Activity input
  const [newActivityType, setNewActivityType] = useState<"note" | "call" | "email" | "line" | "meeting">("note");
  const [newActivityContent, setNewActivityContent] = useState("");

  /* ─── Fetch ─── */
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Failed to fetch contacts:", error);
        toast({ title: "โหลดข้อมูลไม่สำเร็จ", description: error.message, variant: "destructive" });
        setContacts([]);
      } else {
        setContacts((data || []) as ContactSubmission[]);
      }
    } catch (err: any) {
      console.error("fetchContacts crashed:", err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const { data } = await supabase.rpc("get_internal_staff");
      if (data) setStaff(data as StaffMember[]);
    } catch (err) {
      console.warn("Failed to fetch staff:", err);
    }
  };

  const fetchActivities = async (contactId: string) => {
    const { data } = await supabase
      .from("contact_activities")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false });
    setActivities((data || []) as Activity[]);
  };

  useEffect(() => {
    fetchContacts();
    fetchStaff();
  }, []);

  useEffect(() => {
    if (selected) fetchActivities(selected.id);
    else setActivities([]);
  }, [selected?.id]);

  /* ─── Filtered list ─── */
  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (caseFilter !== "all" && c.case_type !== caseFilter) return false;
      if (priorityFilter !== "all" && c.priority !== priorityFilter) return false;
      if (assignFilter === "mine" && c.assigned_to !== user?.id) return false;
      if (assignFilter === "unassigned" && c.assigned_to !== null) return false;
      if (assignFilter !== "all" && assignFilter !== "mine" && assignFilter !== "unassigned" && c.assigned_to !== assignFilter) return false;
      if (searchText) {
        const s = searchText.toLowerCase().trim();
        const searchable = [
          c.name, c.email, c.phone || "", c.company || "",
          c.line_id || "", c.whatsapp || "",
          c.message || "", c.notes || "", c.category || "",
        ].join(" ").toLowerCase();
        if (!searchable.includes(s)) return false;
      }
      return true;
    });
  }, [contacts, statusFilter, caseFilter, priorityFilter, assignFilter, searchText, user?.id]);

  /* ─── Stats ─── */
  const stats = useMemo(() => ({
    total: contacts.length,
    new: contacts.filter(c => c.status === "new").length,
    inProgress: contacts.filter(c => c.status === "in_progress").length,
    urgent: contacts.filter(c => c.priority === "urgent" && c.status !== "closed").length,
    mine: contacts.filter(c => c.assigned_to === user?.id && c.status !== "closed").length,
  }), [contacts, user]);

  /* ─── Update contact ─── */
  const updateContact = async (id: string, updates: Partial<ContactSubmission>) => {
    setSaving(true);
    try {
      const { error } = await (supabase.from as any)("contact_submissions").update(updates).eq("id", id);
      if (error) throw error;
      await fetchContacts();
      if (selected?.id === id) {
        const updated = (await supabase.from("contact_submissions").select("*").eq("id", id).maybeSingle()).data as ContactSubmission | null;
        if (updated) setSelected(updated);
        await fetchActivities(id);
      }
      toast({ title: "อัปเดตสำเร็จ" });
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  /* ─── Create new contact (manual entry) ─── */
  const createContact = async () => {
    if (!newContact.name || (!newContact.phone && !newContact.email)) {
      toast({ title: "กรุณากรอกข้อมูล", description: "ต้องมีชื่อ และ เบอร์โทรหรืออีเมล", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await (supabase.from as any)("contact_submissions").insert({
        name: newContact.name,
        email: newContact.email || `noemail-${Date.now()}@manual.local`,
        phone: newContact.phone || null,
        company: newContact.company || null,
        line_id: newContact.line_id || null,
        whatsapp: newContact.whatsapp || null,
        message: newContact.message || "(รับเรื่องทางโทรศัพท์)",
        case_type: newContact.case_type,
        priority: newContact.priority,
        source: newContact.source,
        assigned_team: newContact.assigned_team,
        assigned_to: user?.id || null,
        status: "new",
        created_by: user?.id || null,
      });
      if (error) throw error;

      toast({ title: "บันทึกเรื่องเรียบร้อย" });
      setCreateOpen(false);
      setNewContact({
        name: "", email: "", phone: "", company: "",
        line_id: "", whatsapp: "",
        case_type: "sales", priority: "normal", source: "phone",
        message: "", assigned_team: "sales",
      });
      await fetchContacts();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  /* ─── Add activity (note/call/email/etc) ─── */
  const addActivity = async () => {
    if (!selected || !newActivityContent.trim()) return;
    setSaving(true);
    try {
      const { error } = await (supabase.from as any)("contact_activities").insert({
        contact_id: selected.id,
        activity_type: newActivityType,
        content: newActivityContent.trim(),
        created_by: user?.id || null,
      });
      if (error) throw error;
      setNewActivityContent("");
      await fetchActivities(selected.id);
      toast({ title: "บันทึกแล้ว" });
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  /* ─── Convert to Quote ─── */
  const convertToQuote = async () => {
    if (!selected || !user) return;
    if (!confirm(`สร้างใบเสนอราคาใหม่จากเรื่องนี้?\n\nลูกค้า: ${selected.name}\nบริษัท: ${selected.company || "-"}`)) return;

    setSaving(true);
    try {
      const { data: quote, error } = await (supabase.from as any)("quote_requests").insert({
        name: selected.name,
        email: selected.email,
        phone: selected.phone,
        company: selected.company,
        line_id: selected.line_id,
        whatsapp: selected.whatsapp,
        details: selected.message,
        products: [],
        status: "new",
        assigned_to: selected.assigned_to || user.id,
      }).select().single();
      if (error) throw error;

      // Link back + log activity
      await (supabase.from as any)("contact_submissions").update({
        converted_to_quote_id: (quote as any).id,
        status: "qualified",
      }).eq("id", selected.id);

      await (supabase.from as any)("contact_activities").insert({
        contact_id: selected.id,
        activity_type: "converted",
        content: `แปลงเป็นใบเสนอราคา ${(quote as any).quote_number || "(ใหม่)"}`,
        metadata: { quote_id: (quote as any).id, quote_number: (quote as any).quote_number },
        created_by: user.id,
      });

      toast({ title: "สร้างใบเสนอราคาเรียบร้อย", description: (quote as any).quote_number || "" });
      await fetchContacts();
      const updated = (await supabase.from("contact_submissions").select("*").eq("id", selected.id).maybeSingle()).data as ContactSubmission | null;
      if (updated) setSelected(updated);
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  /* ─── Helpers ─── */
  const staffName = (uid: string | null) => {
    if (!uid) return "ยังไม่มอบหมาย";
    const s = staff.find(x => x.user_id === uid);
    return s?.full_name || "Unknown";
  };

  const cfg = (arr: any[], val: string | null) => arr.find(x => x.value === val);

  /* ─── Render ─── */
  return (
    <div className="space-y-4">
      {/* ═══ Header + Stats ═══ */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">ติดต่อเข้ามา</h2>
          <p className="text-xs text-muted-foreground mt-0.5">รับเรื่อง · มอบหมาย · ติดตาม · แปลงเป็นใบเสนอราคา</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} /> รับเรื่องใหม่
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {[
          { label: "ทั้งหมด",   value: stats.total,      color: "text-foreground" },
          { label: "ใหม่",      value: stats.new,        color: "text-blue-500" },
          { label: "ดำเนินการ", value: stats.inProgress, color: "text-orange-500" },
          { label: "ด่วน",      value: stats.urgent,     color: "text-red-500" },
          { label: "ของฉัน",    value: stats.mine,       color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="card-surface rounded-xl p-3">
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-surface rounded-xl p-3 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหา: ชื่อ, เบอร์, บริษัท, ข้อความ..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={`${inp} pl-8 pr-7 py-1.5 text-xs`}
          />
          {searchText && (
            <button onClick={() => setSearchText("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={12} />
            </button>
          )}
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inp} text-xs py-1.5 w-32`}>
          <option value="all">ทุกสถานะ</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <select value={caseFilter} onChange={(e) => setCaseFilter(e.target.value)} className={`${inp} text-xs py-1.5 w-32`}>
          <option value="all">ทุกประเภท</option>
          {CASE_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className={`${inp} text-xs py-1.5 w-28`}>
          <option value="all">ทุกระดับ</option>
          {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>

        <select value={assignFilter} onChange={(e) => setAssignFilter(e.target.value)} className={`${inp} text-xs py-1.5 w-36`}>
          <option value="all">ทุกคน</option>
          <option value="mine">ของฉัน</option>
          <option value="unassigned">ยังไม่มอบหมาย</option>
          {staff.map(s => <option key={s.user_id} value={s.user_id}>{s.full_name}</option>)}
        </select>
      </div>

      {/* ═══ Main grid: list + detail ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: list */}
        <div className="lg:col-span-2 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Loader2 size={20} className="mx-auto mb-2 animate-spin" /> กำลังโหลด...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <MessageSquare size={24} className="mx-auto mb-2 opacity-30" /> ไม่พบข้อมูล
            </div>
          ) : filtered.map((c) => {
            const caseCfg = cfg(CASE_TYPES, c.case_type);
            const priCfg  = cfg(PRIORITIES, c.priority);
            const stCfg   = cfg(STATUSES, c.status);
            const srcCfg  = cfg(SOURCES, c.source);
            const SrcIcon = srcCfg?.icon || Globe;
            const isSelected = selected?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full text-left card-surface rounded-xl p-4 hover:border-primary/30 transition-colors ${
                  isSelected ? "border-primary/50 ring-1 ring-primary/20" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-foreground">{c.name}</span>
                      {c.company && (
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          <Building2 size={11} /> {c.company}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    {priCfg && c.priority !== "normal" && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${priCfg.color}`}>
                        {priCfg.label}
                      </span>
                    )}
                    {caseCfg && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${caseCfg.color}`}>
                        {caseCfg.label}
                      </span>
                    )}
                    {stCfg && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${stCfg.color}`}>
                        {stCfg.label}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-1.5">{c.message}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 flex-wrap">
                  {c.email && !c.email.endsWith("@manual.local") && <span>{c.email}</span>}
                  {c.phone && <span className="flex items-center gap-0.5"><Phone size={10} /> {c.phone}</span>}
                  <span className="flex items-center gap-0.5"><SrcIcon size={10} /> {srcCfg?.label}</span>
                  <span className="flex items-center gap-0.5"><Clock size={10} /> {fmtRelative(c.created_at)}</span>
                  {c.assigned_to && (
                    <span className="flex items-center gap-0.5 text-primary"><User size={10} /> {staffName(c.assigned_to)}</span>
                  )}
                  {c.converted_to_quote_id && (
                    <span className="flex items-center gap-0.5 text-green-500"><CheckCircle size={10} /> แปลงแล้ว</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: detail panel */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="card-surface rounded-xl p-5 sticky top-4 max-h-[calc(100vh-100px)] overflow-y-auto space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-border">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground">{selected.name}</h3>
                  {selected.company && <p className="text-xs text-muted-foreground mt-0.5">{selected.company}</p>}
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>

              {/* Contact info */}
              <div className="space-y-1.5 text-xs">
                {selected.email && !selected.email.endsWith("@manual.local") && (
                  <div className="flex items-center gap-2"><Mail size={12} className="text-muted-foreground shrink-0" />
                    <a href={`mailto:${selected.email}`} className="text-primary hover:underline truncate">{selected.email}</a></div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-2"><Phone size={12} className="text-muted-foreground shrink-0" />
                    <a href={`tel:${selected.phone}`} className="text-primary hover:underline">{selected.phone}</a></div>
                )}
                {selected.line_id && (
                  <div className="flex items-center gap-2"><MessageCircle size={12} className="text-muted-foreground shrink-0" />
                    <span>{selected.line_id}</span></div>
                )}
              </div>

              {/* Message */}
              <div>
                <div className={lbl}>ข้อความ</div>
                <p className="text-xs text-foreground bg-muted/30 rounded-lg p-2.5 whitespace-pre-line leading-relaxed">{selected.message}</p>
              </div>

              {/* Quick controls */}
              <div className="space-y-2">
                <div>
                  <label className={lbl}>ประเภทเคส</label>
                  <select value={selected.case_type || "sales"}
                    onChange={(e) => updateContact(selected.id, { case_type: e.target.value })}
                    disabled={saving}
                    className={`${inp} text-xs py-1.5`}>
                    {CASE_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className={lbl}>ความสำคัญ</label>
                  <select value={selected.priority || "normal"}
                    onChange={(e) => updateContact(selected.id, { priority: e.target.value })}
                    disabled={saving}
                    className={`${inp} text-xs py-1.5`}>
                    {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className={lbl}>สถานะ</label>
                  <select value={selected.status}
                    onChange={(e) => updateContact(selected.id, { status: e.target.value })}
                    disabled={saving}
                    className={`${inp} text-xs py-1.5`}>
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className={lbl}>มอบหมายให้ทีม</label>
                  <select value={selected.assigned_team || ""}
                    onChange={(e) => updateContact(selected.id, { assigned_team: e.target.value || null })}
                    disabled={saving}
                    className={`${inp} text-xs py-1.5`}>
                    <option value="">- ไม่ระบุ -</option>
                    <option value="sales">ทีมขาย</option>
                    <option value="service">ทีมบริการ</option>
                    <option value="support">ทีมสนับสนุน</option>
                  </select>
                </div>

                <div>
                  <label className={lbl}>มอบหมายให้บุคคล</label>
                  <select value={selected.assigned_to || ""}
                    onChange={(e) => updateContact(selected.id, { assigned_to: e.target.value || null })}
                    disabled={saving}
                    className={`${inp} text-xs py-1.5`}>
                    <option value="">- ไม่มอบหมาย -</option>
                    {staff.map(s => <option key={s.user_id} value={s.user_id}>{s.full_name}</option>)}
                  </select>
                </div>

                <div>
                  <label className={lbl}>วันที่ติดตาม</label>
                  <input type="date"
                    value={selected.follow_up_date || ""}
                    onChange={(e) => updateContact(selected.id, { follow_up_date: e.target.value || null })}
                    disabled={saving}
                    className={`${inp} text-xs py-1.5`} />
                </div>
              </div>

              {/* Convert to Quote button */}
              {!selected.converted_to_quote_id && selected.case_type === "sales" && (
                <button
                  onClick={convertToQuote}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-60"
                >
                  <ArrowRight size={13} /> แปลงเป็นใบเสนอราคา
                </button>
              )}
              {selected.converted_to_quote_id && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-bold">
                  <CheckCircle size={13} /> แปลงเป็นใบเสนอราคาแล้ว
                </div>
              )}

              {/* Activity log */}
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-foreground">ประวัติกิจกรรม ({activities.length})</div>
                </div>

                {/* Add activity input */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex gap-1.5">
                    <select value={newActivityType} onChange={(e) => setNewActivityType(e.target.value as any)}
                      className={`${inp} text-xs py-1.5 w-24`}>
                      <option value="note">บันทึก</option>
                      <option value="call">โทร</option>
                      <option value="email">อีเมล</option>
                      <option value="line">LINE</option>
                      <option value="meeting">นัดหมาย</option>
                    </select>
                    <input
                      type="text"
                      placeholder="พิมพ์รายละเอียด..."
                      value={newActivityContent}
                      onChange={(e) => setNewActivityContent(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addActivity()}
                      className={`${inp} text-xs py-1.5 flex-1`}
                    />
                    <button
                      onClick={addActivity}
                      disabled={!newActivityContent.trim() || saving}
                      className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                </div>

                {/* Activity timeline */}
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {activities.length === 0 ? (
                    <div className="text-center py-4 text-[11px] text-muted-foreground">ยังไม่มีกิจกรรม</div>
                  ) : activities.map((a) => {
                    const aCfg = ACTIVITY_TYPES[a.activity_type] || ACTIVITY_TYPES.note;
                    const Icon = aCfg.icon;
                    return (
                      <div key={a.id} className="flex gap-2 text-[11px]">
                        <div className={`shrink-0 mt-0.5 ${aCfg.color}`}><Icon size={12} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-foreground">{a.content}</div>
                          <div className="text-muted-foreground/70 text-[10px] mt-0.5">
                            {a.created_by ? staffName(a.created_by) : "ระบบ"} · {fmtRelative(a.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="card-surface rounded-xl p-10 text-center text-muted-foreground text-sm sticky top-4">
              <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
              เลือกเรื่องเพื่อดูรายละเอียด
            </div>
          )}
        </div>
      </div>

      {/* ═══ Manual Entry Dialog ═══ */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setCreateOpen(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">รับเรื่องใหม่</h3>
                <p className="text-xs text-muted-foreground mt-0.5">กรอกข้อมูลลูกค้าที่ติดต่อเข้ามา</p>
              </div>
              <button onClick={() => setCreateOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>ชื่อลูกค้า *</label>
                  <input type="text" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} className={inp} placeholder="ชื่อ-นามสกุล" />
                </div>
                <div>
                  <label className={lbl}>บริษัท</label>
                  <input type="text" value={newContact.company} onChange={(e) => setNewContact({ ...newContact, company: e.target.value })} className={inp} placeholder="ชื่อบริษัท" />
                </div>
                <div>
                  <label className={lbl}>เบอร์โทร *</label>
                  <input type="tel" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} className={inp} placeholder="081-234-5678" />
                </div>
                <div>
                  <label className={lbl}>อีเมล</label>
                  <input type="email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} className={inp} placeholder="email@example.com" />
                </div>
                <div>
                  <label className={lbl}>LINE ID</label>
                  <input type="text" value={newContact.line_id} onChange={(e) => setNewContact({ ...newContact, line_id: e.target.value })} className={inp} placeholder="@lineid" />
                </div>
                <div>
                  <label className={lbl}>WhatsApp</label>
                  <input type="text" value={newContact.whatsapp} onChange={(e) => setNewContact({ ...newContact, whatsapp: e.target.value })} className={inp} placeholder="+66..." />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                <div>
                  <label className={lbl}>ที่มา</label>
                  <select value={newContact.source} onChange={(e) => setNewContact({ ...newContact, source: e.target.value })} className={inp}>
                    {SOURCES.filter(s => s.value !== "web_form").map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>ประเภทเคส</label>
                  <select value={newContact.case_type} onChange={(e) => setNewContact({ ...newContact, case_type: e.target.value, assigned_team: e.target.value })} className={inp}>
                    {CASE_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>ความสำคัญ</label>
                  <select value={newContact.priority} onChange={(e) => setNewContact({ ...newContact, priority: e.target.value })} className={inp}>
                    {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={lbl}>มอบหมายให้ทีม</label>
                <select value={newContact.assigned_team} onChange={(e) => setNewContact({ ...newContact, assigned_team: e.target.value })} className={inp}>
                  <option value="sales">ทีมขาย</option>
                  <option value="service">ทีมบริการ</option>
                  <option value="support">ทีมสนับสนุน</option>
                </select>
              </div>

              <div>
                <label className={lbl}>รายละเอียด/ข้อความ</label>
                <textarea
                  rows={4}
                  value={newContact.message}
                  onChange={(e) => setNewContact({ ...newContact, message: e.target.value })}
                  className={`${inp} resize-y min-h-[80px]`}
                  placeholder="สรุปสิ่งที่ลูกค้าต้องการ..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
              <button onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent">
                ยกเลิก
              </button>
              <button
                onClick={createContact}
                disabled={saving || !newContact.name || (!newContact.phone && !newContact.email)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                บันทึกเรื่อง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactsManager;

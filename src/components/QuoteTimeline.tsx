import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Clock, CheckCircle, XCircle, MessageSquare, Send, DollarSign,
  Truck, CreditCard, Shield, AlertTriangle, Loader2, ChevronDown,
  ArrowRight, Timer, Package, CornerDownRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { notifyQuoteStatus, getSaleInfo } from "@/utils/notifyQuoteStatus";

/* ─── Types ─── */
interface QuoteMessage {
  id: string;
  quote_id: string;
  sender_id: string | null;
  sender_role: string;
  message_type: string;
  subject: string | null;
  content: string;
  proposed_value: string | null;
  resolution: string;
  old_value: string | null;
  new_value: string | null;
  sla_deadline: string | null;
  sla_met: boolean | null;
  responded_at: string | null;
  created_at: string;
}

interface QuoteTimelineProps {
  quoteId: string;
  quoteNumber: string;
  currentUserId?: string;
  isAdmin?: boolean;
  onQuoteUpdated?: () => void;
}

/* ─── Constants ─── */
const NEGOTIATION_SUBJECTS = [
  { value: "price", label: "สอบถามราคาพิเศษ", icon: DollarSign, placeholder: "เช่น สนใจราคาพิเศษสำหรับ 5 เครื่องขึ้นไป" },
  { value: "delivery", label: "ปรึกษาเรื่องจัดส่ง", icon: Truck, placeholder: "เช่น ต้องการจัดส่งภายใน 3 วัน เป็นไปได้ไหม" },
  { value: "credit_term", label: "สนใจเครดิตเทอม", icon: CreditCard, placeholder: "เช่น สนใจเครดิต 30 วันหลังส่งมอบ" },
  { value: "warranty", label: "เพิ่มแพ็กเกจประกัน", icon: Shield, placeholder: "เช่น สนใจประกันแบบ 3 ปี" },
  { value: "quantity", label: "ปรับจำนวนสั่งซื้อ", icon: Package, placeholder: "เช่น ต้องการเพิ่มเป็น 10 เครื่อง" },
  { value: "other", label: "ข้อเสนอแนะอื่นๆ", icon: MessageSquare, placeholder: "รายละเอียดเพิ่มเติม..." },
];

const RESOLUTION_BADGE: Record<string, { label: string; color: string }> = {
  pending: { label: "รอตอบ", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  accepted: { label: "ยอมรับ", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  rejected: { label: "ปฏิเสธ", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  counter: { label: "ข้อเสนอใหม่", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  info: { label: "", color: "" },
};

const ROLE_CONFIG: Record<string, { label: string; color: string; dot: string; bubble: string }> = {
  customer: { label: "ลูกค้า", color: "bg-blue-500/10 text-blue-600", dot: "#185FA5", bubble: "var(--color-background-info)" },
  admin: { label: "Admin", color: "bg-teal-500/10 text-teal-600", dot: "#0F6E56", bubble: "var(--color-background-success)" },
  system: { label: "ระบบ", color: "bg-gray-500/10 text-gray-500", dot: "var(--color-text-tertiary)", bubble: "var(--color-background-secondary)" },
};

const SUBJECT_LABELS: Record<string, string> = {
  price: "ราคา", delivery: "การจัดส่ง", credit_term: "เครดิตเทอม",
  warranty: "การรับประกัน", quantity: "จำนวนสินค้า", other: "อื่นๆ",
};

const inp = "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

/* ─── Component ─── */
const QuoteTimeline = ({ quoteId, quoteNumber, currentUserId, isAdmin = false, onQuoteUpdated }: QuoteTimelineProps) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [sending, setSending] = useState(false);

  // Send form
  const [formMode, setFormMode] = useState<"message" | "negotiate">("message");
  const [msgText, setMsgText] = useState("");
  const [negSubject, setNegSubject] = useState("price");
  const [negReason, setNegReason] = useState("");
  const [negProposed, setNegProposed] = useState("");

  // Admin response
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [adminAction, setAdminAction] = useState<"accepted" | "rejected" | "counter">("accepted");
  const [adminReply, setAdminReply] = useState("");
  const [adminCounterValue, setAdminCounterValue] = useState("");

  /* ─── React Query: messages for this quote ─── */
  const { data: messages = [], isLoading: loading } = useQuery({
    queryKey: ["quote-messages", quoteId],
    enabled: !!quoteId,
    queryFn: async () => {
      const { data, error } = await (supabase.from as any)("quote_messages")
        .select("*")
        .eq("quote_id", quoteId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as QuoteMessage[];
    },
  });

  // Backward-compat helper for save handlers — invalidate cache → React Query refetches
  const fetchMessages = () => {
    qc.invalidateQueries({ queryKey: ["quote-messages", quoteId] });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ─── Send Message (Customer or Admin) ─── */
  const handleSendMessage = async () => {
    if (!msgText.trim()) return;
    setSending(true);
    try {
      const slaDeadline = new Date();
      slaDeadline.setHours(slaDeadline.getHours() + (isAdmin ? 48 : 24));

      await (supabase.from as any)("quote_messages").insert({
        quote_id: quoteId,
        sender_id: currentUserId,
        sender_role: isAdmin ? "admin" : "customer",
        message_type: "message",
        content: msgText.trim(),
        resolution: "info",
      });

      // Update last action
      await (supabase.from as any)("quote_requests").update({
        last_action_by: isAdmin ? "admin" : "customer",
        last_action_at: new Date().toISOString(),
      }).eq("id", quoteId);

      setMsgText("");
      fetchMessages();
    } catch (err: any) {
      toast({ title: "ส่งไม่ได้", description: err.message, variant: "destructive" });
    }
    setSending(false);
  };

  /* ─── Send Negotiation Request (Customer) ─── */
  const handleSendNegotiation = async () => {
    if (!negReason.trim()) {
      toast({ title: "กรุณาให้เหตุผล", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const slaDeadline = new Date();
      slaDeadline.setHours(slaDeadline.getHours() + 24);

      const subjectLabel = SUBJECT_LABELS[negSubject] || negSubject;

      await (supabase.from as any)("quote_messages").insert({
        quote_id: quoteId,
        sender_id: currentUserId,
        sender_role: "customer",
        message_type: "negotiation",
        subject: negSubject,
        content: negReason.trim(),
        proposed_value: negProposed.trim() || null,
        resolution: "pending",
        sla_deadline: slaDeadline.toISOString(),
      });

      // Update quote status
      await (supabase.from as any)("quote_requests").update({
        status: "negotiating",
        last_action_by: "customer",
        last_action_at: new Date().toISOString(),
      }).eq("id", quoteId);

      // Notify admin/sales (assigned or all internal staff)
      try {
        // Get quote's assigned_to
        const { data: qData } = await (supabase.from as any)("quote_requests")
          .select("assigned_to")
          .eq("id", quoteId).single();
        const assignedId = qData?.assigned_to || null;
        const notifTitle = `ลูกค้าส่งข้อเสนอเพิ่มเติม — ${quoteNumber}`;
        const notifMessage = `เรื่อง: ${subjectLabel} — ${negReason.trim().slice(0, 80)}`;

        if (assignedId) {
          await (supabase.from as any)("notifications").insert({
            user_id: assignedId,
            type: "negotiation",
            title: notifTitle,
            message: notifMessage,
            link: `/admin?tab=quote_review&quote=${quoteId}`,
            link_type: "quote",
            link_id: quoteId,
          });
        } else {
          // Fallback: notify all internal staff
          const { data: staff } = await (supabase.rpc as any)("get_internal_staff");
          if (Array.isArray(staff) && staff.length > 0) {
            const inserts = staff
              .filter((s: any) => s?.id)
              .map((s: any) => ({
                user_id: s.id,
                type: "negotiation",
                title: notifTitle,
                message: notifMessage,
                link: `/admin?tab=quote_review&quote=${quoteId}`,
                link_type: "quote",
                link_id: quoteId,
              }));
            if (inserts.length > 0) {
              await (supabase.from as any)("notifications").insert(inserts);
            }
          }
        }
      } catch {}

      toast({ title: "ส่งข้อเสนอเรียบร้อยแล้ว", description: "ทีมงานจะตอบกลับภายใน 24 ชม." });

      // Send email: negotiation_customer (notify sale)
      try {
        const { data: quoteData } = await (supabase.from as any)("quote_requests")
          .select("email, name, quote_number, grand_total, assigned_to, products")
          .eq("id", quoteId).single();
        if (quoteData) {
          const saleInfo = await getSaleInfo(quoteData.assigned_to);
          notifyQuoteStatus({
            event: "negotiation_customer",
            quoteId,
            customerEmail: quoteData.email,
            customerName: quoteData.name,
            quoteNumber: quoteData.quote_number || quoteNumber,
            grandTotal: quoteData.grand_total,
            negotiationSubject: subjectLabel,
            counterValue: negProposed.trim() || undefined,
            ...saleInfo,
          });
        }
      } catch {}

      setNegReason("");
      setNegProposed("");
      setFormMode("message");
      fetchMessages();
      onQuoteUpdated?.();
    } catch (err: any) {
      toast({ title: "ส่งไม่ได้", description: err.message, variant: "destructive" });
    }
    setSending(false);
  };

  /* ─── Admin Respond to Negotiation ─── */
  const handleAdminRespond = async (msgId: string) => {
    if (!adminReply.trim() && adminAction !== "accepted") {
      toast({ title: "กรุณากรอกข้อความตอบกลับ", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      // Update original message resolution
      await (supabase.from as any)("quote_messages").update({
        resolution: adminAction,
        responded_at: new Date().toISOString(),
        sla_met: true,
        new_value: adminAction === "accepted" ? "ยอมรับตามที่ลูกค้าขอ" : (adminAction === "counter" ? adminCounterValue : null),
      }).eq("id", msgId);

      const slaDeadline = new Date();
      slaDeadline.setHours(slaDeadline.getHours() + 48);

      // Post admin reply message
      const actionLabel = adminAction === "accepted" ? "ยอมรับคำขอ" : adminAction === "rejected" ? "ปฏิเสธคำขอ" : "เสนอทางเลือก";
      const content = adminAction === "accepted"
        ? (adminReply.trim() || "ยอมรับตามที่ลูกค้าขอ")
        : adminReply.trim();

      await (supabase.from as any)("quote_messages").insert({
        quote_id: quoteId,
        sender_id: currentUserId,
        sender_role: "admin",
        message_type: adminAction === "counter" ? "negotiation" : "message",
        subject: messages.find((m) => m.id === msgId)?.subject || null,
        content,
        proposed_value: adminAction === "counter" ? adminCounterValue : null,
        resolution: adminAction === "counter" ? "pending" : "info",
        sla_deadline: adminAction === "counter" ? slaDeadline.toISOString() : null,
      });

      // Update quote
      const newStatus = adminAction === "accepted" ? "won" : "negotiating";
      await (supabase.from as any)("quote_requests").update({
        status: newStatus,
        last_action_by: "admin",
        last_action_at: new Date().toISOString(),
      }).eq("id", quoteId);

      // Notify customer
      const quote = await (supabase.from as any)("quote_requests").select("user_id").eq("id", quoteId).single();
      if (quote.data?.user_id) {
        try {
          await (supabase.from as any)("notifications").insert({
            user_id: quote.data.user_id,
            type: "negotiation_reply",
            title: `Admin ตอบกลับ — ${quoteNumber}`,
            message: `${actionLabel}: ${content.slice(0, 80)}`,
            link: "/my-account?tab=quotes",
          });
        } catch {}
      }

      toast({ title: `${actionLabel}แล้ว` });

      // Send email: negotiation_admin_reply (notify customer)
      try {
        const { data: quoteInfo } = await (supabase.from as any)("quote_requests")
          .select("email, name, quote_number, grand_total, assigned_to")
          .eq("id", quoteId).single();
        if (quoteInfo?.email) {
          const saleInfo = await getSaleInfo(quoteInfo.assigned_to);
          notifyQuoteStatus({
            event: "negotiation_admin_reply",
            quoteId,
            customerEmail: quoteInfo.email,
            customerName: quoteInfo.name,
            quoteNumber: quoteInfo.quote_number || quoteNumber,
            grandTotal: quoteInfo.grand_total,
            counterValue: adminAction === "counter" ? adminCounterValue : (adminAction === "accepted" ? "ยอมรับตามที่ลูกค้าขอ" : "ปฏิเสธ"),
            ...saleInfo,
          });
        }
      } catch {}

      setRespondingTo(null);
      setAdminReply("");
      setAdminCounterValue("");
      fetchMessages();
      onQuoteUpdated?.();
    } catch (err: any) {
      toast({ title: "ตอบกลับไม่ได้", description: err.message, variant: "destructive" });
    }
    setSending(false);
  };

  /* ─── Helpers ─── */
  const fmt = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const isOverdue = (deadline: string | null) => deadline ? new Date(deadline) < new Date() : false;

  /* ─── Render ─── */
  if (loading) return <div className="text-center py-8"><Loader2 size={18} className="animate-spin text-muted-foreground mx-auto" /></div>;

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีข้อความ</p>
        ) : (
          messages.map((msg) => {
            const role = ROLE_CONFIG[msg.sender_role] || ROLE_CONFIG.system;
            const isPending = msg.resolution === "pending";
            const canRespond = isAdmin && isPending && msg.sender_role === "customer" && msg.message_type === "negotiation";
            const customerCanAccept = !isAdmin && isPending && msg.sender_role === "admin" && msg.message_type === "negotiation";

            return (
              <div key={msg.id} className="flex gap-2.5 items-start">
                {/* Dot */}
                <div className="flex flex-col items-center shrink-0 pt-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: role.dot }} />
                  <div className="w-px flex-1 bg-border/50 mt-1" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2">
                  {/* Header */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[11px] text-muted-foreground">{fmt(msg.created_at)}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${role.color}`}>{role.label}</span>
                    {msg.message_type === "negotiation" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        {msg.subject ? (SUBJECT_LABELS[msg.subject] || msg.subject) : "ต่อรอง"}
                      </span>
                    )}
                    {msg.resolution && msg.resolution !== "info" && msg.resolution !== "pending" && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${RESOLUTION_BADGE[msg.resolution]?.color || ""}`}>
                        {RESOLUTION_BADGE[msg.resolution]?.label || msg.resolution}
                      </span>
                    )}
                    {isPending && msg.message_type === "negotiation" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 flex items-center gap-1">
                        <Timer size={9} /> รอตอบ
                      </span>
                    )}
                  </div>

                  {/* Bubble */}
                  <div className="rounded-lg p-3 text-sm" style={{ background: role.bubble, borderRadius: msg.sender_role === "customer" ? "0 8px 8px 8px" : "8px 0 8px 8px" }}>
                    {msg.message_type === "negotiation" && msg.subject && (
                      <div className="text-xs font-bold text-foreground mb-1">
                        {msg.sender_role === "customer" ? "ความต้องการเพิ่มเติม" : "ข้อเสนอ"}: {SUBJECT_LABELS[msg.subject] || msg.subject}
                      </div>
                    )}
                    <div className="text-foreground/90 whitespace-pre-wrap">{msg.content}</div>
                    {msg.proposed_value && (
                      <div className="mt-2 px-2.5 py-1.5 rounded bg-background/60 border border-border/50 text-xs">
                        <span className="text-muted-foreground">เสนอ: </span>
                        <span className="font-bold text-foreground">{msg.proposed_value}</span>
                      </div>
                    )}
                    {msg.new_value && msg.resolution === "accepted" && (
                      <div className="mt-2 px-2.5 py-1.5 rounded bg-green-500/10 border border-green-500/20 text-xs text-green-700">
                        <CheckCircle size={11} className="inline mr-1" /> {msg.new_value}
                      </div>
                    )}
                  </div>

                  {/* SLA Warning */}
                  {msg.sla_deadline && isPending && (
                    <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${isOverdue(msg.sla_deadline) ? "text-red-500" : "text-muted-foreground"}`}>
                      {isOverdue(msg.sla_deadline) ? <AlertTriangle size={10} /> : <Clock size={10} />}
                      {isOverdue(msg.sla_deadline) ? "เกิน SLA!" : "ตอบภายใน"} {fmt(msg.sla_deadline)}
                    </div>
                  )}

                  {/* Admin Respond Button */}
                  {canRespond && respondingTo !== msg.id && (
                    <button onClick={() => { setRespondingTo(msg.id); setAdminAction("accepted"); setAdminReply(""); setAdminCounterValue(""); }}
                      className="mt-2 text-xs text-primary hover:underline font-medium flex items-center gap-1">
                      <CornerDownRight size={12} /> ตอบกลับคำขอนี้
                    </button>
                  )}

                  {/* Customer Accept Counter-Offer Button */}
                  {customerCanAccept && (
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => handleCustomerAcceptCounter(msg.id)}
                        className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs font-bold hover:bg-green-500/20 flex items-center gap-1">
                        <CheckCircle size={12} /> ยอมรับ
                      </button>
                      <button onClick={() => { setFormMode("negotiate"); setNegSubject(msg.subject || "price"); }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-bold hover:bg-amber-500/20 flex items-center gap-1">
                        <MessageSquare size={12} /> เจรจาต่อ
                      </button>
                    </div>
                  )}

                  {/* Admin Response Form (Inline) */}
                  {respondingTo === msg.id && (
                    <div className="mt-3 p-3 rounded-xl border border-primary/20 bg-background space-y-3">
                      <div className="flex gap-1.5">
                        {(["accepted", "counter", "rejected"] as const).map((a) => (
                          <button key={a} onClick={() => setAdminAction(a)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              adminAction === a
                                ? a === "accepted" ? "bg-green-500/10 text-green-600 border-green-500/30"
                                  : a === "counter" ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                  : "bg-red-500/10 text-red-500 border-red-500/30"
                                : "border-border text-muted-foreground hover:border-primary/30"
                            }`}>
                            {a === "accepted" ? "ยอมรับ" : a === "counter" ? "เสนอทางเลือก" : "ปฏิเสธ"}
                          </button>
                        ))}
                      </div>

                      {adminAction === "counter" && (
                        <input value={adminCounterValue} onChange={(e) => setAdminCounterValue(e.target.value)}
                          placeholder="ข้อเสนอใหม่ เช่น ฿11,900/เครื่อง หรือ เครดิต 15 วัน" className={`${inp} text-xs`} />
                      )}

                      <textarea value={adminReply} onChange={(e) => setAdminReply(e.target.value)}
                        placeholder={adminAction === "accepted" ? "ข้อความเพิ่มเติม (ไม่บังคับ)" : "เหตุผล / Solution..."}
                        className={`${inp} resize-none text-xs`} rows={2} />

                      <div className="flex justify-end gap-2">
                        <button onClick={() => setRespondingTo(null)} className="px-3 py-1.5 rounded-lg border border-border text-xs">ยกเลิก</button>
                        <button onClick={() => handleAdminRespond(msg.id)} disabled={sending}
                          className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1">
                          {sending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} ส่ง
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ═══ Send Form ═══ */}
      <div className="border-t border-border pt-3 space-y-3">
        {/* Mode Toggle */}
        <div className="flex gap-1.5">
          <button onClick={() => setFormMode("message")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${formMode === "message" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}>
            <MessageSquare size={12} className="inline mr-1" /> ข้อความ
          </button>
          {!isAdmin && (
            <button onClick={() => setFormMode("negotiate")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${formMode === "negotiate" ? "bg-amber-500/10 text-amber-600" : "text-muted-foreground hover:bg-secondary"}`}>
              <MessageSquare size={12} className="inline mr-1" /> ข้อเสนอเพิ่มเติม
            </button>
          )}
        </div>

        {formMode === "message" ? (
          /* Simple message */
          <div className="flex gap-2">
            <input value={msgText} onChange={(e) => setMsgText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder="พิมพ์ข้อความ..." className={`${inp} text-xs flex-1`} />
            <button onClick={handleSendMessage} disabled={sending || !msgText.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1">
              {sending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} ส่ง
            </button>
          </div>
        ) : (
          /* Negotiation form */
          <div className="space-y-3 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <div className="grid grid-cols-2 gap-2">
              {NEGOTIATION_SUBJECTS.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.value} onClick={() => setNegSubject(s.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left ${
                      negSubject === s.value ? "bg-amber-500/10 text-amber-700 border-amber-500/30" : "border-border text-muted-foreground hover:border-amber-500/20"
                    }`}>
                    <Icon size={13} /> {s.label}
                  </button>
                );
              })}
            </div>

            <input value={negProposed} onChange={(e) => setNegProposed(e.target.value)}
              placeholder={NEGOTIATION_SUBJECTS.find((s) => s.value === negSubject)?.placeholder || "ข้อเสนอที่ต้องการ..."}
              className={`${inp} text-xs`} />

            <textarea value={negReason} onChange={(e) => setNegReason(e.target.value)}
              placeholder="รายละเอียดที่ต้องการแจ้งทีมงาน... (จำเป็น)" className={`${inp} resize-none text-xs`} rows={2} />

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock size={10} /> ทีมงานจะตอบกลับภายใน 24 ชม.
              </span>
              <button onClick={handleSendNegotiation} disabled={sending || !negReason.trim()}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 disabled:opacity-50 flex items-center gap-1">
                {sending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} ส่งข้อเสนอ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ─── Customer Accept Counter-Offer ─── */
  async function handleCustomerAcceptCounter(msgId: string) {
    setSending(true);
    try {
      await (supabase.from as any)("quote_messages").update({
        resolution: "accepted", responded_at: new Date().toISOString(), sla_met: true,
      }).eq("id", msgId);

      await (supabase.from as any)("quote_messages").insert({
        quote_id: quoteId, sender_id: currentUserId, sender_role: "customer",
        message_type: "accepted", content: "ยอมรับข้อเสนอ", resolution: "info",
      });

      await (supabase.from as any)("quote_requests").update({
        status: "won", last_action_by: "customer", last_action_at: new Date().toISOString(),
      }).eq("id", quoteId);

      toast({ title: "ยอมรับข้อเสนอแล้ว" });
      fetchMessages();
      onQuoteUpdated?.();
    } catch (err: any) {
      toast({ title: "ผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSending(false);
  }
};

export default QuoteTimeline;

import { useState, useEffect, useRef } from "react";
import {
  FileText, Clock, CheckCircle, ChevronUp, Loader2, CalendarClock,
  Download, ThumbsUp, MessageSquare, Plus, MoreHorizontal,
  Printer, Share2, Copy, Trash2, RefreshCw, Info, Package,
  Upload, FileCheck, AlertCircle, Send,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import QuoteDialog from "@/components/QuoteDialog";
import QuoteTimeline from "@/components/QuoteTimeline";
import { printQuote } from "@/utils/printQuote";
import { notifyQuoteStatus, getSaleInfo, productSummaryText } from "@/utils/notifyQuoteStatus";

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "แบบร่าง", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  new: { label: "รอดำเนินการ", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  contacted: { label: "ติดต่อแล้ว", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  quoted: { label: "ส่งราคาแล้ว", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  negotiating: { label: "เจรจา", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  won: { label: "ตกลงราคา", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  po_received: { label: "รับ PO แล้ว", color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  lost: { label: "ไม่สำเร็จ", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const SPEC_LABELS: Record<string, string> = {
  cpu: "CPU", ram: "RAM", com: "COM", usb: "USB", lan: "LAN", display: "จอ",
  gpio: "GPIO", sim: "SIM", gen: "Gen", fanless: "Fanless", ip_rating: "IP",
};

interface QuoteRequest {
  id: string; quote_number: string | null; created_at: string; status: string;
  products: any[]; details: string | null; name: string; email: string;
  subtotal: number; discount_amount: number; grand_total: number;
  valid_until: string | null; payment_terms: string | null; delivery_terms: string | null;
  pdf_url: string | null; customer_response: string | null;
  phone: string | null; company: string | null;
  customer_address: string | null;
  customer_tax_id: string | null;
  po_file_url: string | null; po_file_name: string | null; po_number: string | null;
  po_uploaded_at: string | null; po_status: string | null; po_notes: string | null;
}

interface LineItem {
  id: string; model: string; category: string | null; qty: number;
  unit_price: number; discount_percent: number; line_total: number;
  custom_specs: Record<string, string>; admin_notes: string | null;
  description: string | null;
  _name?: string; _specs?: Record<string, string>;
}

interface CatalogProduct {
  id: string; model: string; name_th: string; specs: Record<string, string>;
}

const MyAccountQuotes = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lineItems, setLineItems] = useState<Record<string, LineItem[]>>({});
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [reQuoteProducts, setReQuoteProducts] = useState<any[] | null>(null);
  const [responding, setResponding] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const poFileRef = useRef<HTMLInputElement>(null);
  const [poUploading, setPoUploading] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [printingId, setPrintingId] = useState<string | null>(null);
  const [poNumber, setPoNumber] = useState("");
  const [poNotes, setPoNotes] = useState("");
  const [companySettings, setCompanySettings] = useState<any>(null);

  const fetchQuotes = async () => {
    
    if (!user) {
      
      setLoading(false);
      return;
    }
    setLoading(true);
    
    try {
      const { data, error } = await (supabase.from as any)("quote_requests")
        .select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      
      if (error) throw error;
      if (data) setQuotes(data);
    } catch (err: any) {
      console.error("[MAQ] fetchQuotes failed:", err);
      toast({
        title: "โหลดข้อมูลไม่สำเร็จ",
        description: err?.message || "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      
      setLoading(false);
    }
  };

  const fetchCatalog = async () => {
    const { data } = await (supabase.from as any)("product_catalog")
      .select("id, model, name_th, specs").eq("is_active", true);
    if (data) setCatalog(data);
  };

  useEffect(() => {
    
    fetchQuotes(); fetchCatalog();
    (async () => {
      try {
        const { data } = await (supabase.from as any)("company_settings").select("*").eq("id", "default").single();
        if (data) setCompanySettings(data);
      } catch {}
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpenId(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchLineItems = async (quoteId: string): Promise<LineItem[]> => {
    try {
      const { data } = await (supabase.from as any)("quote_line_items")
        .select("*").eq("quote_id", quoteId).order("sort_order");
      if (data) {
        // Enrich with catalog
        const enriched = data.map((it: LineItem) => {
          const cat = catalog.find((c) => c.model === it.model);
          return { ...it, _name: cat?.name_th || "", _specs: cat?.specs || it.custom_specs || {} };
        });
        setLineItems((prev) => ({ ...prev, [quoteId]: enriched }));
        return enriched;
      }
    } catch {}
    return [];
  };

  const handleExpand = (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!lineItems[id]) fetchLineItems(id);
    setMenuOpenId(null);
  };

  const handleEditDraft = (q: QuoteRequest) => {
    try {
      sessionStorage.setItem("ent_edit_draft_id", q.id);
    } catch { /* silent */ }
    if (onNavigate) {
      onNavigate("quote_create");
    }
  };

  const handleCustomerResponse = async (qid: string, response: string) => {
    setResponding(true);
    try {
      await (supabase.from as any)("quote_requests").update({
        customer_response: response,
        status: response === "accepted" ? "won" : "negotiating",
      }).eq("id", qid);
      toast({ title: response === "accepted" ? "ยืนยันสั่งซื้อเรียบร้อยแล้ว" : "ส่งข้อเสนอเพิ่มเติมแล้ว" });
      fetchQuotes();
    } catch {}
    setResponding(false);
  };

  const handlePrintQuote = async (q: QuoteRequest) => {
    if (printingId) return;
    setPrintingId(q.id);
    try {
      const freshItems = await fetchLineItems(q.id);
      const saleInfo = await getSaleInfo((q as any).assigned_to || null);
      printQuote(
        { quote_number: q.quote_number, name: q.name, email: q.email, phone: q.phone, company: q.company, details: q.details, company_address: q.customer_address, tax_id: q.customer_tax_id },
        freshItems.map((it) => ({ ...it, _name: it._name, _specs: it._specs })),
        {
          discount_amount: q.discount_amount, valid_until: q.valid_until || "",
          payment_terms: q.payment_terms || "", delivery_terms: q.delivery_terms || "",
          include_vat: true, vat_percent: companySettings?.vat_percent || 7,
        },
        companySettings || undefined,
        saleInfo.saleName,
        undefined,
        saleInfo.saleEmail,
      );
    } catch (err: any) {
      toast({ title: "พิมพ์ไม่สำเร็จ", description: err.message || "เกิดข้อผิดพลาด", variant: "destructive" });
    } finally {
      setPrintingId(null);
    }
  };

  const handleShare = async (q: QuoteRequest) => {
    const url = `${window.location.origin}/my-account?tab=quotes&id=${q.id}`;
    if (navigator.share) {
      await navigator.share({ title: `ใบเสนอราคา ${q.quote_number}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "คัดลอกลิงก์แล้ว" });
    }
    setMenuOpenId(null);
  };

  const handleCopyLink = async (q: QuoteRequest) => {
    const text = q.pdf_url || `ใบเสนอราคา ${q.quote_number || ""} — ฿${q.grand_total > 0 ? q.grand_total.toLocaleString() : "รอราคา"}`;
    await navigator.clipboard.writeText(text);
    toast({ title: "คัดลอกแล้ว" });
    setMenuOpenId(null);
  };

  const handleDuplicate = (q: QuoteRequest) => { setReQuoteProducts(q.products); setMenuOpenId(null); };

  const handleDelete = async (q: QuoteRequest) => {
    if (!confirm(`ลบใบเสนอราคา ${q.quote_number || "Draft"} ?`)) return;
    await (supabase.from as any)("quote_requests").delete().eq("id", q.id);
    toast({ title: "ลบแล้ว" });
    fetchQuotes();
    setMenuOpenId(null);
  };

  const handleSubmitDraft = async (q: QuoteRequest) => {
    if (submittingId) return;
    if (!confirm(`ส่งใบเสนอราคา ${q.quote_number || "Draft"} ให้ Admin ตรวจสอบ?`)) return;
    setSubmittingId(q.id);
    try {
      const { error } = await (supabase.from as any)("quote_requests")
        .update({ status: "new" })
        .eq("id", q.id);
      if (error) throw error;
      toast({ title: "ส่งใบเสนอราคาเรียบร้อย!", description: "ทีมขายจะตรวจสอบและอนุมัติภายใน 2 ชม." });
      setMenuOpenId(null);
      fetchQuotes();
    } catch (err: any) {
      toast({ title: "ส่งไม่สำเร็จ", description: err.message, variant: "destructive" });
    } finally {
      setSubmittingId(null);
    }
  };

  const handlePoUpload = async (quoteId: string, file: File) => {
    if (!user) return;
    setPoUploading(true);
    try {
      const ext = file.name.split(".").pop() || "pdf";
      const path = `${user.id}/${quoteId}_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("purchase-orders").upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;

      // Get URL (signed or public depending on bucket)
      const { data: urlData } = await supabase.storage.from("purchase-orders").createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year
      const fileUrl = urlData?.signedUrl || path;

      // Update quote
      const { error: dbErr } = await (supabase.from as any)("quote_requests").update({
        po_file_url: fileUrl,
        po_file_name: file.name,
        po_number: poNumber.trim() || null,
        po_uploaded_at: new Date().toISOString(),
        po_uploaded_by: user.id,
        po_notes: poNotes.trim() || null,
        po_status: "uploaded",
      }).eq("id", quoteId);
      if (dbErr) throw dbErr;

      // Notify admin — use REAL user IDs (notifications.user_id is NOT NULL in current schema)
      const q = quotes.find((qq) => qq.id === quoteId);
      try {
        const targetUserId = (q as any)?.assigned_to || null;
        const notifTitle = `📥 ลูกค้าส่ง PO — ${q?.quote_number || ""}`;
        const notifMessage = `${q?.name || "ลูกค้า"} ส่ง PO: ${poNumber || file.name}`;

        if (targetUserId) {
          // Notify the assigned sales person
          await (supabase.from as any)("notifications").insert({
            user_id: targetUserId,
            type: "po_uploaded",
            title: notifTitle,
            message: notifMessage,
            link: `/admin?tab=quote_review&quote=${quoteId}`,
            link_type: "quote",
            link_id: quoteId,
          });
        } else {
          // Fallback: notify all internal staff (admin/super_admin/sales)
          try {
            const { data: staff } = await (supabase.rpc as any)("get_internal_staff");
            if (Array.isArray(staff) && staff.length > 0) {
              const inserts = staff
                .filter((s: any) => s?.id)
                .map((s: any) => ({
                  user_id: s.id,
                  type: "po_uploaded",
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
          } catch (err) {
            console.warn("Failed to notify all staff:", err);
          }
        }
      } catch (err) {
        console.warn("Failed to send PO upload notification:", err);
      }

      toast({ title: "อัปโหลด PO สำเร็จ", description: "ทีมขายจะตรวจสอบและดำเนินการต่อ" });

      // Send email: po_uploaded (q already declared above for notification)
      if (q) {
        const saleInfo = await getSaleInfo((q as any).assigned_to || null);
        notifyQuoteStatus({
          event: "po_uploaded",
          quoteId,
          customerEmail: q.email,
          customerName: q.name,
          quoteNumber: q.quote_number || "",
          grandTotal: q.grand_total,
          poNumber: poNumber || "",
          poFileName: file.name,
          ...saleInfo,
        });
      }

      setPoNumber("");
      setPoNotes("");
      fetchQuotes();
    } catch (err: any) {
      toast({ title: "อัปโหลดไม่สำเร็จ", description: err.message, variant: "destructive" });
    }
    setPoUploading(false);
  };

  const fp = (n: number) => new Intl.NumberFormat("th-TH").format(n);
  const fd = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });

  const productSummary = (products: any[]) => {
    if (!products?.length) return "";
    const first = products[0]?.model || "";
    return products.length === 1 ? first : `${first} +${products.length - 1} รายการ`;
  };

  const renderSpecs = (specs: Record<string, string>) => (
    <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[10px]">
      {Object.entries(specs).filter(([, v]) => v && v !== "No").map(([k, v]) => (
        <span key={k} className="text-muted-foreground">
          <span className="font-medium text-foreground/50">{SPEC_LABELS[k] || k}:</span> {v === "Yes" ? "✓" : v}
        </span>
      ))}
    </div>
  );

  
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5">
          <FileText size={18} className="text-primary" /> ใบเสนอราคาของฉัน
        </h2>
        <button onClick={fetchQuotes} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-secondary/60">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> รีเฟรช
        </button>
      </div>

      <div className="card-surface rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={32} className="mx-auto mb-3 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">ยังไม่มีใบเสนอราคา</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
               <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-semibold uppercase tracking-wide">วันที่</th>
                  <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-semibold uppercase tracking-wide">เลขที่</th>
                  <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-semibold uppercase tracking-wide">สินค้า</th>
                  <th className="text-right px-4 py-2.5 text-xs text-muted-foreground font-semibold uppercase tracking-wide">ยอดรวม</th>
                  <th className="text-center px-4 py-2.5 text-xs text-muted-foreground font-semibold uppercase tracking-wide">สถานะ</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => {
                  const status = statusConfig[q.status] || statusConfig.new;
                  const isExpanded = expandedId === q.id;
                  const items = lineItems[q.id] || [];
                  const hasPrice = q.grand_total > 0;
                  const isQuoted = ["quoted", "negotiating"].includes(q.status);

                  return (
                    <tr key={q.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors cursor-pointer group" onClick={() => handleEditDraft(q)}>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap tabular-nums">{fd(q.created_at)}</td>
                      <td className="px-4 py-3">
                        <button onClick={(e) => { e.stopPropagation(); handleExpand(q.id); }} className="text-left hover:text-primary transition-colors">
                          <span className="font-bold text-foreground">{q.quote_number || "Draft"}</span>
                          {q.customer_response === "accepted" && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">ยอมรับแล้ว</span>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground"><span className="line-clamp-1">{productSummary(q.products)}</span></td>
                      <td className="px-4 py-3 text-right text-sm font-bold tabular-nums">{hasPrice ? `฿${fp(q.grand_total)}` : <span className="text-muted-foreground font-normal text-xs">รอราคา</span>}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${status.color}`}>{status.label}</span>
                          {q.status === "quoted" && q.grand_total > 0 && (
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleCustomerResponse(q.id, "accepted"); }}
                                    disabled={responding}
                                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/30 font-bold hover:bg-green-500/20 transition-colors whitespace-nowrap"
                                  >
                                    <ThumbsUp size={11} /> ยืนยันสั่งซื้อ
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[220px] text-center">
                                  <p className="text-xs">ยืนยันรับราคานี้และดำเนินการสั่งซื้อ ระบบจะสร้างใบ PO ให้อัตโนมัติ</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 relative" ref={menuOpenId === q.id ? menuRef as React.RefObject<HTMLTableCellElement> : undefined}>
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === q.id ? null : q.id); }} className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground">
                                <MoreHorizontal size={16} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left"><p className="text-xs">ตัวเลือกเพิ่มเติม</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {menuOpenId === q.id && (
                          <div className="absolute right-2 top-10 z-20 bg-card border border-border rounded-xl shadow-xl py-1.5 w-52 animate-fade-in">
                            {q.status === "draft" && (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleSubmitDraft(q); }}
                                  disabled={submittingId === q.id}
                                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-primary/10 text-primary font-medium disabled:opacity-50"
                                >
                                  <Send size={14} /> {submittingId === q.id ? "กำลังส่ง..." : "ส่งให้ Admin ตรวจสอบ"}
                                </button>
                                <div className="border-t border-border my-1"></div>
                              </>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); handleExpand(q.id); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary/60"><FileText size={14} /> ดูรายละเอียด</button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handlePrintQuote(q); setMenuOpenId(null); }}
                              disabled={printingId === q.id}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary/60 disabled:opacity-50"
                            >
                              <Printer size={14} /> {printingId === q.id ? "กำลังโหลด..." : "พิมพ์ใบเสนอราคา"}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleShare(q); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary/60"><Share2 size={14} /> แชร์ให้ผู้เกี่ยวข้อง</button>
                            {q.pdf_url && <a href={q.pdf_url} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary/60"><Download size={14} /> ดาวน์โหลด PDF</a>}
                            <button onClick={(e) => { e.stopPropagation(); handleCopyLink(q); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary/60"><Copy size={14} /> คัดลอกลิงก์</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDuplicate(q); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary/60"><Plus size={14} /> สร้างใบเสนอราคาใหม่จากรายการนี้</button>
                            <div className="border-t border-border my-1"></div>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(q); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"><Trash2 size={14} /> ลบใบเสนอราคา</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ═══ Expanded Detail ═══ */}
            {expandedId && (() => {
              const q = quotes.find((q) => q.id === expandedId);
              if (!q) return null;
              const items = lineItems[q.id] || [];
              const hasPrice = q.grand_total > 0;
              const isQuoted = ["quoted", "negotiating"].includes(q.status);
              const status = statusConfig[q.status] || statusConfig.new;

              return (
                <div className="border-t-2 border-primary/20 bg-secondary/5 p-5 sm:p-6 animate-fade-in">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-bold text-foreground">{q.quote_number || "Draft"}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${status.color}`}>{status.label}</span>
                      {q.valid_until && <span className="text-xs text-muted-foreground flex items-center gap-1"><CalendarClock size={12} /> ยืนราคาถึง {new Date(q.valid_until).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}</span>}
                    </div>
                    <button onClick={() => setExpandedId(null)} className="text-muted-foreground hover:text-foreground"><ChevronUp size={16} /></button>
                  </div>

                  {/* Line Items with Specs */}
                  {items.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {items.map((item, i) => (
                        <div key={item.id} className="p-3 rounded-lg border border-border bg-background">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-bold">{i + 1}.</span>
                                <span className="font-bold text-foreground text-sm">{item.model}</span>
                                {item.category && <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{item.category}</span>}
                              </div>
                              {item._name && <p className="text-xs text-muted-foreground mt-1">{item._name}</p>}
                              {item.description && (
                                <p className="text-xs text-foreground/80 mt-1.5 whitespace-pre-line leading-relaxed">{item.description}</p>
                              )}
                              {item._specs && Object.keys(item._specs).length > 0 && (
                                <div className="mt-1.5">{renderSpecs(item._specs)}</div>
                              )}
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <div className="text-xs text-muted-foreground">{item.qty} × ฿{fp(item.unit_price)}</div>
                              {item.discount_percent > 0 && <div className="text-[10px] text-red-400">-{item.discount_percent}%</div>}
                              <div className="text-sm font-bold text-primary mt-0.5">฿{fp(item.line_total)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    Array.isArray(q.products) && q.products.length > 0 && (
                      <div className="space-y-1 mb-4">
                        {q.products.map((p: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">{p.category}</span>
                            <span className="font-medium">{p.model}</span>
                            <span className="text-primary">×{p.qty}</span>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {/* Totals */}
                  {hasPrice && (
                    <div className="border-t border-border pt-3 mb-4 max-w-sm ml-auto">
                      <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">รวมก่อนส่วนลด</span><span>฿{fp(q.subtotal)}</span></div>
                      {q.discount_amount > 0 && <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">ส่วนลด</span><span className="text-red-400">-฿{fp(q.discount_amount)}</span></div>}
                      <div className="flex justify-between text-base font-bold pt-1 border-t border-border"><span>ยอดรวมสุทธิ</span><span className="text-primary">฿{fp(q.grand_total)}</span></div>
                    </div>
                  )}

                  {/* Terms */}
                  {(q.payment_terms || q.delivery_terms || q.valid_until) && (
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border mb-4">
                      <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">เงื่อนไข</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {q.valid_until && <div><span className="text-muted-foreground">ราคายืนถึง:</span> <span className="font-medium">{new Date(q.valid_until).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}</span></div>}
                        {q.payment_terms && <div><span className="text-muted-foreground">เงื่อนไขชำระ:</span> <span className="font-medium">{q.payment_terms}</span></div>}
                        {q.delivery_terms && <div><span className="text-muted-foreground">เงื่อนไขจัดส่ง:</span> <span className="font-medium">{q.delivery_terms}</span></div>}
                        <div><span className="text-muted-foreground">การรับประกัน:</span> <span className="font-medium">1 ปี Carry-in</span></div>
                      </div>
                    </div>
                  )}

                  {/* ═══ Timeline / Conversation ═══ */}
                  <div className="border-t border-border pt-4 mb-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">สนทนา / ต่อรอง</h4>
                    <QuoteTimeline
                      quoteId={q.id}
                      quoteNumber={q.quote_number || ""}
                      currentUserId={user?.id}
                      isAdmin={false}
                      onQuoteUpdated={fetchQuotes}
                    />
                  </div>

                  {/* ═══ PO Upload Section (shown when status = won or po_received) ═══ */}
                  {(q.status === "won" || q.status === "po_received") && (
                    <div className="border-t border-border pt-4 mb-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <FileCheck size={13} className="text-teal-500" /> ใบสั่งซื้อ (Purchase Order)
                      </h4>

                      {/* Already uploaded */}
                      {q.po_file_url ? (
                        <div className="space-y-3">
                          <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                                <FileCheck size={18} className="text-teal-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-foreground">{q.po_file_name || "PO Document"}</p>
                                {q.po_number && <p className="text-xs text-muted-foreground mt-0.5">เลข PO: <span className="font-medium text-foreground">{q.po_number}</span></p>}
                                {q.po_uploaded_at && <p className="text-[10px] text-muted-foreground mt-0.5">อัปโหลดเมื่อ {new Date(q.po_uploaded_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>}
                                {q.po_notes && <p className="text-xs text-muted-foreground mt-1">{q.po_notes}</p>}
                              </div>
                              <div className="shrink-0 flex flex-col items-end gap-1.5">
                                {q.po_status === "uploaded" && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 flex items-center gap-1">
                                    <Clock size={9} /> รอตรวจสอบ
                                  </span>
                                )}
                                {q.po_status === "approved" && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 flex items-center gap-1">
                                    <CheckCircle size={9} /> อนุมัติแล้ว
                                  </span>
                                )}
                                {q.po_status === "rejected" && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1">
                                    <AlertCircle size={9} /> ถูกปฏิเสธ
                                  </span>
                                )}
                                <a href={q.po_file_url} target="_blank" rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline flex items-center gap-1">
                                  <Download size={12} /> ดูไฟล์
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Re-upload if rejected */}
                          {q.po_status === "rejected" && (
                            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/15 text-xs text-red-600">
                              <AlertCircle size={12} className="inline mr-1" />
                              PO ถูกปฏิเสธ — กรุณาอัปโหลดใหม่
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Upload form — only when status = won and no PO yet */
                        q.status === "won" && (
                          <div className="p-4 rounded-xl bg-teal-500/5 border border-dashed border-teal-500/30 space-y-3">
                            <div className="text-center">
                              <Upload size={24} className="mx-auto mb-2 text-teal-500/50" />
                              <p className="text-sm font-medium text-foreground">อัปโหลดใบสั่งซื้อ (PO)</p>
                              <p className="text-xs text-muted-foreground mt-1">ส่ง PO เพื่อยืนยันการสั่งซื้อ — รองรับ PDF, Word, Excel, รูปภาพ</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">เลข PO (ถ้ามี)</label>
                                <input
                                  value={poNumber}
                                  onChange={(e) => setPoNumber(e.target.value)}
                                  placeholder="เช่น PO-2026-001"
                                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">หมายเหตุ (ไม่บังคับ)</label>
                                <input
                                  value={poNotes}
                                  onChange={(e) => setPoNotes(e.target.value)}
                                  placeholder="เช่น ส่งของภายในสัปดาห์หน้า"
                                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                              </div>
                            </div>

                            <input ref={poFileRef} type="file" className="hidden"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePoUpload(q.id, file);
                              }}
                            />
                            <button
                              onClick={() => poFileRef.current?.click()}
                              disabled={poUploading}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-500 text-white text-sm font-bold hover:bg-teal-600 transition-colors disabled:opacity-50"
                            >
                              {poUploading ? (
                                <><Loader2 size={14} className="animate-spin" /> กำลังอัปโหลด...</>
                              ) : (
                                <><Upload size={14} /> เลือกไฟล์แล้วส่ง PO</>
                              )}
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2.5 pt-4 border-t border-border">
                    {q.pdf_url && (
                      <a href={q.pdf_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
                        <Download size={14} /> ดาวน์โหลด PDF
                      </a>
                    )}
                    <button onClick={() => handlePrintQuote(q)}
                      disabled={printingId === q.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
                      <Printer size={14} /> {printingId === q.id ? "กำลังโหลด..." : "พิมพ์ใบเสนอราคา"}
                    </button>
                    <button onClick={() => handleShare(q)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 size={14} /> แชร์
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {reQuoteProducts && <QuoteDialog open={true} onClose={() => setReQuoteProducts(null)} initialProducts={reQuoteProducts} />}
    </div>
  );
};

export default MyAccountQuotes;

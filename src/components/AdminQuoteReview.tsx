import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText, CheckCircle, Clock, Loader2, RefreshCw, Eye, Plus, Trash2, XCircle,
  Search, User, Building2, Phone, Mail, Upload, Info, X, ExternalLink,
  FileUp, Paperclip, Printer, Share2, ChevronDown, CalendarDays, Link2,
  UserCircle2, Users, ArrowRightLeft, FileCheck, AlertCircle, Package, ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import QuoteTimeline from "@/components/QuoteTimeline";
import QuoteStatusTimeline from "@/components/QuoteStatusTimeline";
import QuoteActions from "@/components/QuoteActions";
import DocCrossLinks from "@/components/admin/DocCrossLinks";
import { notifyQuoteStatus, getSaleInfo, productSummaryText } from "@/utils/notifyQuoteStatus";
import { printQuote } from "@/utils/printQuote";

/* ─── Types ─── */
interface QuoteRequest {
  id: string; quote_number: string | null; chain_number: string | null; created_at: string; status: string;
  products: any[]; details: string | null; name: string; email: string;
  phone: string | null; line_id: string | null; whatsapp: string | null;
  company: string | null; user_id: string | null;
  customer_address: string | null;
  customer_tax_id: string | null;
  subtotal: number; discount_amount: number; grand_total: number;
  valid_until: string | null; payment_terms: string | null; delivery_terms: string | null;
  approved_by: string | null; approved_at: string | null; pdf_url: string | null;
  customer_response: string | null; notes: string | null;
  assigned_to: string | null;
  po_file_url: string | null; po_file_name: string | null; po_number: string | null;
  po_uploaded_at: string | null; po_status: string | null; po_notes: string | null;
  vat_amount: number | null; withholding_tax: number | null;
  include_vat: boolean | null; include_withholding_tax: boolean | null;
}

interface SalesTeamMember {
  user_id: string; email: string; full_name: string; role: string;
}

interface LineItem {
  id: string; quote_id: string; product_id: string | null; model: string;
  category: string | null; qty: number; unit_price: number; discount_percent: number;
  line_total: number; custom_specs: Record<string, string>; admin_notes: string | null;
  description: string | null;
  sort_order: number;
  _name?: string; _desc?: string; _specs?: Record<string, string>;
}

interface CatalogProduct {
  id: string; model: string; name_th: string; category: string;
  base_price: number; specs: Record<string, string>; description: string;
}

interface DocLibraryItem { id: string; title: string; file_url: string; category: string; }

/* ─── Constants ─── */
const STATUS_CFG: Record<string, { label: string; color: string; order: number }> = {
  pending: { label: "รอตอบกลับ", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", order: 0 },
  quote_sent: { label: "ส่งใบเสนอราคาแล้ว", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", order: 1 },
  po_uploaded: { label: "รับ PO แล้ว", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", order: 2 },
  po_approved: { label: "อนุมัติ PO", color: "bg-green-500/10 text-green-500 border-green-500/20", order: 3 },
  completed: { label: "เสร็จสิ้น", color: "bg-teal-500/10 text-teal-600 border-teal-500/20", order: 4 },
  cancelled: { label: "ยกเลิก", color: "bg-red-500/10 text-red-400 border-red-500/20", order: 5 },
};

const DELIVERY_OPTS = [
  "ส่งฟรีทั่วประเทศ", "ส่งฟรีในเขต กทม. และปริมณฑล",
  "จัดส่งภายใน 3-5 วันทำการ", "จัดส่งภายใน 7-14 วันทำการ",
  "จัดส่งภายใน 15-30 วันทำการ (สินค้าสั่งผลิต)", "รับสินค้าเองที่บริษัท",
  "จัดส่งพร้อมติดตั้ง", "ตามที่ตกลง",
];

const PAYMENT_OPTS = [
  "มัดจำ 70% ส่วนที่เหลือจ่ายก่อนส่งสินค้า",
  "ชำระเต็มจำนวนก่อนจัดส่ง", "มัดจำ 50% ที่เหลือจ่ายก่อนจัดส่ง",
  "30 วันหลังส่งมอบ", "60 วันหลังส่งมอบ",
  "เครดิต 30 วัน", "เครดิต 45 วัน", "ตามที่ตกลง",
];

const VALIDITY_PRESETS = [
  { label: "15 วัน", days: 15 }, { label: "30 วัน", days: 30 }, { label: "45 วัน", days: 45 },
];

const SPEC_LABELS: Record<string, string> = {
  cpu: "CPU", ram: "RAM", com: "COM", usb: "USB", lan: "LAN", display: "จอ",
  gpio: "GPIO", sim: "SIM", gen: "Gen", fanless: "Fanless", ip_rating: "IP",
};

const inp = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";
const lbl = "text-[11px] font-medium text-muted-foreground mb-1 block";

/* ─── Component ─── */
const AdminQuoteReview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const pdfRef = useRef<HTMLInputElement>(null);

  // URL state — quoteId in URL drives detail mode (shareable, browser back works)
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuoteId = searchParams.get("quoteId");
  const isDetailMode = !!urlQuoteId;

  // Navigation helpers
  const openQuoteDetail = (quoteId: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("quoteId", quoteId);
    setSearchParams(next, { replace: false });
  };
  const backToList = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("quoteId");
    setSearchParams(next, { replace: false });
    setSelected(null);
  };

  // Local UI state (not data — data lives in React Query below)
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [items, setItems] = useState<LineItem[]>([]);
  const [lineLoading, setLineLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "value_high" | "value_low">("newest");
  const [searchText, setSearchText] = useState("");
  const [expandItem, setExpandItem] = useState<number | null>(null);
  const [catFilter, setCatFilter] = useState("all");
  const [catSearch, setCatSearch] = useState("");
  const [pdfUp, setPdfUp] = useState(false);
  const [showDocPick, setShowDocPick] = useState(false);
  const [assignFilter, setAssignFilter] = useState<string>("all");
  const [hasOrder, setHasOrder] = useState(false);
  const [hasBilling, setHasBilling] = useState(false);
  const [creatingDocs, setCreatingDocs] = useState(false);

  const [edit, setEdit] = useState({
    discount_amount: 0, valid_until: "", payment_terms: "มัดจำ 70% ส่วนที่เหลือจ่ายก่อนส่งสินค้า",
    delivery_terms: "ส่งฟรีทั่วประเทศ", pdf_url: "", notes: "",
    include_vat: true, include_withholding_tax: false,
  });

  /* ─── React Query: All admin quote-review data in 1 query ───
   * - Loads in parallel: quotes, catalog, doc lib, sales team, super-admin role, company settings
   * - Auto-refetch on window focus (fixes visibility-change stuck bug)
   * - Single loading state for all 6 fetches
   */
  const { data: qrData, isLoading: loading } = useQuery({
    queryKey: ["admin", "quote-review", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const [quotesRes, catalogRes, docLibRes, salesTeamRes, superAdminRes, companyRes] = await Promise.all([
        (supabase.from as any)("quote_requests")
          .select("*")
          .order("created_at", { ascending: false }),
        (supabase.from as any)("product_catalog")
          .select("id, model, name_th, category, base_price, specs, description")
          .eq("is_active", true).order("category").order("model"),
        (supabase.from as any)("document_library")
          .select("id, title, file_url, category")
          .order("title"),
        supabase.rpc("get_sales_team").then(r => r, () => ({ data: null, error: null })),
        user?.id
          ? supabase.rpc("has_role", { _user_id: user.id, _role: "super_admin" }).then(r => r, () => ({ data: false, error: null }))
          : Promise.resolve({ data: false, error: null }),
        (supabase.from as any)("company_settings").select("*").eq("id", "default").single().then((r: any) => r, () => ({ data: null, error: null })),
      ]);
      if (quotesRes.error) {
        toast({ title: "โหลดข้อมูลไม่สำเร็จ", description: quotesRes.error.message, variant: "destructive" });
        throw quotesRes.error;
      }
      return {
        quotes: (quotesRes.data || []) as QuoteRequest[],
        catalog: (catalogRes.data || []) as CatalogProduct[],
        docLib: (docLibRes.data || []) as DocLibraryItem[],
        salesTeam: (salesTeamRes.data || []) as SalesTeamMember[],
        isSuperAdmin: !!superAdminRes.data,
        companySettings: companyRes.data ?? null,
      };
    },
  });

  const quotes = qrData?.quotes ?? [];
  const catalog = qrData?.catalog ?? [];
  const docLib = qrData?.docLib ?? [];
  const salesTeam = qrData?.salesTeam ?? [];
  const isSuperAdmin = qrData?.isSuperAdmin ?? false;
  const companySettings = qrData?.companySettings ?? null;

  // Helpers for save handlers + Refresh button — invalidate cache → React Query auto refetch
  const fetchQuotes = (_silent?: boolean) => {
    qc.invalidateQueries({ queryKey: ["admin", "quote-review", user?.id] });
  };

  // Derived: categories from catalog
  const categories = useMemo(() => {
    const cats = new Set(catalog.map((p) => p.category));
    return Array.from(cats).sort();
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    let result = catalog;
    if (catFilter !== "all") {
      result = result.filter((p) => p.category === catFilter);
    }
    if (catSearch.trim()) {
      const s = catSearch.toLowerCase().trim();
      result = result.filter((p) => {
        const haystack = [
          p.model || "",
          p.name_th || "",
          p.category || "",
          p.description || "",
        ].join(" ").toLowerCase();
        return haystack.includes(s);
      });
    }
    return result;
  }, [catalog, catFilter, catSearch]);

  /* ─── Old fetch functions removed — all data now comes from useQuery above ─── */

  // Sync URL ?quoteId=... → selected quote (handles shareable URLs + browser back/forward)
  useEffect(() => {
    if (!urlQuoteId) {
      // URL has no quoteId → list mode → clear selection
      if (selected) setSelected(null);
      return;
    }
    // URL has quoteId → find in loaded quotes and select
    if (quotes.length === 0) return; // wait for quotes to load
    if (selected?.id === urlQuoteId) return; // already selected
    const found = quotes.find((q) => q.id === urlQuoteId);
    if (found) {
      selectQuote(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuoteId, quotes]);

  // Listen for cross-component selection (e.g. from NotificationBell click)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type === "quote" && detail?.id) {
        const found = quotes.find((q) => q.id === detail.id);
        if (found) {
          openQuoteDetail(found.id); // sync URL — useEffect above will select
        }
      }
    };
    window.addEventListener("admin-select-entity", handler);
    return () => window.removeEventListener("admin-select-entity", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes]);

  /* ─── Select Quote ─── */
  const selectQuote = async (q: QuoteRequest) => {
    setSelected(q);
    setExpandItem(null);
    setCatFilter("all");

    // Mark PO as viewed (audit log) — only if quote has a PO
    if (q.po_status && q.po_file_url) {
      try {
        await (supabase.rpc as any)("mark_po_viewed", { _quote_id: q.id });
        // Auto-transition uploaded → under_review on first view
        if (q.po_status === "uploaded") {
          await (supabase.from as any)("quote_requests")
            .update({ po_status: "under_review", po_review_started_at: new Date().toISOString() })
            .eq("id", q.id);
          q = { ...q, po_status: "under_review" } as QuoteRequest;
          setSelected(q);
        }
      } catch (err) {
        console.warn("Failed to mark PO viewed:", err);
      }
    }

    const validDate = q.valid_until ? q.valid_until.split("T")[0] : addDays(15);
    setEdit({
      discount_amount: q.discount_amount || 0,
      valid_until: validDate,
      payment_terms: q.payment_terms || "มัดจำ 70% ส่วนที่เหลือจ่ายก่อนส่งสินค้า",
      delivery_terms: q.delivery_terms || "ส่งฟรีทั่วประเทศ",
      pdf_url: q.pdf_url || "", notes: q.notes || "",
      include_vat: q.include_vat ?? true,
      include_withholding_tax: q.include_withholding_tax ?? false,
    });

    setLineLoading(true);
    try {
      const { data: ex } = await (supabase.from as any)("quote_line_items").select("*").eq("quote_id", q.id).order("sort_order");
      if (ex && ex.length > 0) {
        setItems(ex.map((it: LineItem) => enrich(it)));
      } else {
        setItems((q.products || []).map((p: any, i: number) => {
          const cat = catalog.find((c) => c.model === p.model);
          return enrich({
            id: `t-${i}`, quote_id: q.id, product_id: cat?.id || null, model: p.model || "",
            category: p.category || cat?.category || "", qty: p.qty || 1,
            unit_price: cat?.base_price || 0, discount_percent: 0,
            line_total: (cat?.base_price || 0) * (p.qty || 1),
            custom_specs: cat?.specs || {}, admin_notes: null,
            description: cat?.description || null,
            sort_order: i,
          });
        }));
      }
    } catch (err) {
      console.error("[selectQuote] Failed to load line items:", err);
      setItems([]);
    } finally {
      setLineLoading(false);
    }
    // Check if order/billing already created for this quote
    checkExistingDocs(q.id);
  };

  const enrich = (it: LineItem): LineItem => {
    const cat = catalog.find((c) => c.id === it.product_id || c.model === it.model);
    return { ...it, _name: cat?.name_th || "", _desc: cat?.description || "", _specs: cat?.specs || it.custom_specs || {} };
  };

  /* ─── Line Items ─── */
  const addLine = () => setItems((p) => [...p, {
    id: `t-${Date.now()}`, quote_id: selected?.id || "", product_id: null,
    model: "", category: "", qty: 1, unit_price: 0, discount_percent: 0,
    line_total: 0, custom_specs: {}, admin_notes: null,
    description: null,
    sort_order: p.length,
    _name: "", _desc: "", _specs: {},
  }]);

  const removeLine = (i: number) => items.length > 1 && setItems((p) => p.filter((_, idx) => idx !== i));

  const updateLine = (i: number, field: string, value: any) => {
    setItems((prev) => {
      const u = [...prev];
      (u[i] as any)[field] = value;
      u[i].line_total = Math.round(u[i].unit_price * (1 - u[i].discount_percent / 100) * u[i].qty);
      return u;
    });
  };

  const pickProduct = (i: number, pid: string) => {
    const p = catalog.find((c) => c.id === pid);
    if (!p) return;
    setItems((prev) => {
      const u = [...prev];
      // Auto-fill description from catalog ONLY if line description is empty
      // (don't overwrite admin's custom description when changing model)
      const newDesc = u[i].description && u[i].description.trim() !== "" ? u[i].description : (p.description || null);
      u[i] = { ...u[i], product_id: p.id, model: p.model, category: p.category,
        unit_price: p.base_price, line_total: p.base_price * u[i].qty,
        custom_specs: p.specs, description: newDesc,
        _name: p.name_th, _desc: p.description, _specs: p.specs };
      return u;
    });
  };

  /* ─── PDF Upload ─── */
  const handlePdfUp = async (file: File) => {
    setPdfUp(true);
    try {
      const path = `quotes/${selected?.quote_number || "q"}_${Date.now()}.pdf`;
      const { error } = await supabase.storage.from("documents").upload(path, file, { contentType: "application/pdf" });
      if (error) throw error;
      const { data } = supabase.storage.from("documents").getPublicUrl(path);
      setEdit((f) => ({ ...f, pdf_url: data?.publicUrl || "" }));
      toast({ title: "อัปโหลด PDF สำเร็จ" });
    } catch (err: any) {
      toast({ title: "อัปโหลดไม่ได้", description: err.message, variant: "destructive" });
    }
    setPdfUp(false);
  };

  /* ─── Print ─── */
  const handlePrint = () => {
    if (!selected) return;
    const saleInfo = salesTeam.find((s) => s.user_id === selected.assigned_to);
    printQuote(
      { quote_number: selected.quote_number, name: selected.name, email: selected.email, phone: selected.phone, company: selected.company, details: selected.details, company_address: selected.customer_address, tax_id: selected.customer_tax_id },
      items.map((it) => ({ ...it, _name: it._name, _desc: it._desc, _specs: it._specs, _unit: (it as any)._unit })),
      {
        discount_amount: edit.discount_amount, valid_until: edit.valid_until,
        payment_terms: edit.payment_terms, delivery_terms: edit.delivery_terms,
        include_vat: edit.include_vat, vat_percent: companySettings?.vat_percent || 7,
        include_withholding_tax: edit.include_withholding_tax, withholding_tax_percent: companySettings?.withholding_tax_percent || 3,
      },
      companySettings || undefined,
      saleInfo?.full_name,
      undefined,
      saleInfo?.email,
    );
  };

  /* ─── Share Link ─── */
  const handleShare = async () => {
    if (!selected) return;
    const url = `${window.location.origin}/my-account?tab=quotes&id=${selected.id}`;
    if (navigator.share) {
      await navigator.share({ title: `ใบเสนอราคา ${selected.quote_number}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "คัดลอกลิงก์แล้ว" });
    }
  };

  /* ─── Approve ─── */
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);
  const grand = subtotal - edit.discount_amount;
  const hasZeroPriceItems = items.length > 0 && items.some((i) => !i.unit_price || i.unit_price === 0);

  const handleApprove = async () => {
    if (!selected || !user) return;
    setSaving(true);
    try {
      await (supabase.from as any)("quote_line_items").delete().eq("quote_id", selected.id);
      const toInsert = items.map((it, i) => ({
        quote_id: selected.id, product_id: it.product_id, model: it.model,
        category: it.category, qty: it.qty, unit_price: it.unit_price,
        discount_percent: it.discount_percent, custom_specs: it.custom_specs,
        admin_notes: it.admin_notes,
        description: it.description,
        sort_order: i,
      }));
      if (toInsert.length) {
        const { error } = await (supabase.from as any)("quote_line_items").insert(toInsert);
        if (error) throw error;
      }
      const { error: qErr } = await (supabase.from as any)("quote_requests").update({
        status: "quote_sent", subtotal, discount_amount: edit.discount_amount, grand_total: grand,
        valid_until: edit.valid_until || null, payment_terms: edit.payment_terms || null,
        delivery_terms: edit.delivery_terms || null, pdf_url: edit.pdf_url || null,
        notes: edit.notes || null, approved_by: user.id, approved_at: new Date().toISOString(),
      }).eq("id", selected.id);
      if (qErr) throw qErr;

      if (selected.user_id) {
        try {
          await (supabase.from as any)("notifications").insert({
            user_id: selected.user_id, type: "quote_status",
            title: "ใบเสนอราคาพร้อมแล้ว",
            message: `${selected.quote_number || "#"} มูลค่า ฿${grand.toLocaleString()}`,
            link: "/my-account?tab=quotes",
          });
        } catch {}
      }
      toast({ title: "อนุมัติสำเร็จ", description: `฿${grand.toLocaleString()}` });

      // Send email: quoted
      if (selected.email) {
        const saleInfo = await getSaleInfo(selected.assigned_to);
        notifyQuoteStatus({
          event: "quoted",
          quoteId: selected.id,
          customerEmail: selected.email,
          customerName: selected.name,
          quoteNumber: selected.quote_number || "",
          grandTotal: grand,
          products: productSummaryText(selected.products),
          ...saleInfo,
        });
      }

      setSelected(null);
      fetchQuotes();
    } catch (err: any) {
      toast({ title: "ผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  /* ─── Helpers ─── */
  const fp = (n: number) => new Intl.NumberFormat("th-TH").format(n);
  const fd = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const addDays = (d: number) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };

  const getAdminName = (uid: string | null): string => {
    if (!uid) return "ยังไม่มอบหมาย";
    const found = salesTeam.find((s) => s.user_id === uid);
    return found ? found.full_name : uid.slice(0, 8);
  };

  const getAdminShortName = (uid: string | null): string => {
    if (!uid) return "—";
    const found = salesTeam.find((s) => s.user_id === uid);
    if (!found) return "?";
    const name = found.full_name;
    return name.length > 10 ? name.slice(0, 10) + "…" : name;
  };

  const handleReassign = async (quoteId: string, newAdminId: string) => {
    try {
      const { error } = await supabase.rpc("reassign_quote", { _quote_id: quoteId, _new_admin_id: newAdminId });
      if (error) throw error;
      toast({ title: "มอบหมายใหม่สำเร็จ", description: `ส่งให้ ${getAdminName(newAdminId)}` });
      fetchQuotes();
      if (selected) setSelected({ ...selected, assigned_to: newAdminId });
    } catch (err: any) {
      toast({ title: "ผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── PO Approve / Reject / Request Clarification ─── */
  const handlePoAction = async (
    quoteId: string,
    action: "approved" | "rejected" | "pending_clarification",
    reason?: string
  ) => {
    setSaving(true);
    try {
      const updates: any = {
        po_status: action,
        po_reviewed_by: user?.id || null,
        po_reviewed_at: new Date().toISOString(),
      };
      if (action === "approved") {
        updates.status = "po_uploaded";
      }
      const { error } = await (supabase.from as any)("quote_requests").update(updates).eq("id", quoteId);
      if (error) throw error;

      const quote = quotes.find((q) => q.id === quoteId);

      // Note: notification + audit log are handled by DB trigger now (log_po_state_change)
      // No need to manually insert notifications here

      const actionLabels: Record<string, string> = {
        approved: "อนุมัติ PO สำเร็จ",
        rejected: "ปฏิเสธ PO แล้ว",
        pending_clarification: "ส่งคำขอข้อมูลเพิ่มเติมแล้ว",
      };
      toast({ title: actionLabels[action] });

      if (quote?.email && action !== "pending_clarification") {
        const saleInfo = await getSaleInfo(quote.assigned_to);
        notifyQuoteStatus({
          event: action === "approved" ? "po_approved" : "po_rejected",
          quoteId: quoteId,
          customerEmail: quote.email,
          customerName: quote.name,
          quoteNumber: quote.quote_number || "",
          grandTotal: quote.grand_total,
          poNumber: quote.po_number || "",
          rejectReason: reason,
          ...saleInfo,
        });
      }

      fetchQuotes();
      if (selected) selectQuote({ ...selected, ...updates });
    } catch (err: any) {
      toast({ title: "ผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  /* ─── Check if Order/Billing already exist for selected quote ─── */
  const checkExistingDocs = async (quoteId: string) => {
    const [orderRes, billingRes] = await Promise.all([
      (supabase.from as any)("sales_orders").select("id").eq("quote_id", quoteId).limit(1),
      (supabase.from as any)("billing_notes").select("id").eq("quote_id", quoteId).limit(1),
    ]);
    setHasOrder((orderRes.data || []).length > 0);
    setHasBilling((billingRes.data || []).length > 0);
  };

  /* ─── Manual Create Order + Billing (fallback when trigger didn't fire) ─── */
  const manualCreateOrderAndBilling = async (quoteId: string) => {
    if (!user) return;
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return;

    setCreatingDocs(true);
    try {
      // Check again to prevent duplicates
      const { data: existingOrder } = await (supabase.from as any)("sales_orders").select("id").eq("quote_id", quoteId).limit(1);
      const { data: existingBilling } = await (supabase.from as any)("billing_notes").select("id").eq("quote_id", quoteId).limit(1);

      let orderId: string | null = existingOrder?.[0]?.id || null;
      let billingId: string | null = existingBilling?.[0]?.id || null;

      // Create Sales Order if not exists
      if (!orderId) {
        const { data: order, error: orderErr } = await (supabase.from as any)("sales_orders").insert({
          quote_id: quoteId,
          customer_name: quote.name,
          customer_email: quote.email,
          customer_phone: quote.phone,
          customer_company: quote.company,
          user_id: quote.user_id,
          assigned_to: quote.assigned_to,
          po_number: quote.po_number,
          po_file_url: quote.po_file_url,
          po_file_name: quote.po_file_name,
          subtotal: quote.subtotal,
          discount_amount: quote.discount_amount,
          vat_amount: quote.vat_amount || 0,
          withholding_tax: quote.withholding_tax || 0,
          grand_total: quote.grand_total,
          net_payable: quote.grand_total - (quote.withholding_tax || 0),
          payment_terms: quote.payment_terms,
          delivery_terms: quote.delivery_terms,
          status: "confirmed",
        }).select().single();
        if (orderErr) throw orderErr;
        orderId = order.id;

        // Copy line items — use admin's edited description if available
        const orderItems = items.map((li, i) => ({
          order_id: orderId,
          product_id: li.product_id,
          model: li.model,
          category: li.category,
          name_th: li._name,
          description: li.description || li._desc,
          qty: li.qty,
          unit_price: li.unit_price,
          discount_percent: li.discount_percent,
          line_total: li.line_total,
          specs: li.custom_specs,
          admin_notes: li.admin_notes,
          sort_order: li.sort_order || i,
        }));
        await (supabase.from as any)("sales_order_items").insert(orderItems);
      }

      // Create Billing Note if not exists
      if (!billingId) {
        const { data: billing, error: billingErr } = await (supabase.from as any)("billing_notes").insert({
          quote_id: quoteId,
          order_id: orderId,
          customer_name: quote.name,
          customer_company: quote.company,
          customer_email: quote.email,
          customer_phone: quote.phone,
          po_number: quote.po_number,
          po_file_url: quote.po_file_url,
          subtotal: quote.subtotal,
          discount_amount: quote.discount_amount,
          vat_amount: quote.vat_amount || 0,
          withholding_tax: quote.withholding_tax || 0,
          grand_total: quote.grand_total,
          payment_terms: quote.payment_terms,
          due_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
          assigned_to: quote.assigned_to,
          user_id: quote.user_id,
          status: "draft",
          created_by: user.id,
        }).select().single();
        if (billingErr) throw billingErr;
        billingId = billing.id;

        // Copy line items — use admin's edited description if available
        const billingItems = items.map((li, i) => ({
          billing_note_id: billingId,
          product_id: li.product_id,
          model: li.model,
          category: li.category,
          description: li.description || li._desc || li._name || li.model,
          qty: li.qty,
          unit_price: li.unit_price,
          discount_percent: li.discount_percent,
          line_total: li.line_total,
          sort_order: li.sort_order || i,
        }));
        await (supabase.from as any)("billing_note_items").insert(billingItems);
      }

      toast({ title: "สร้างเอกสารสำเร็จ", description: "สร้าง Sales Order + ใบวางบิลเรียบร้อย" });
      setHasOrder(true);
      setHasBilling(true);
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
    setCreatingDocs(false);
  };
  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    if (!user) return;
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return;

    // Confirm important transitions
    if (newStatus === "po_approved" && !confirm("ยืนยันอนุมัติ PO?\n\n• ระบบจะสร้าง Sales Order + ใบวางบิลอัตโนมัติ\n• สถานะจะเปลี่ยนเป็น 'เสร็จสิ้น'\n• ลูกค้าจะได้รับแจ้งเตือน")) return;
    if (newStatus === "cancelled" && !confirm("ยืนยันยกเลิกใบเสนอราคานี้?")) return;

    setSaving(true);
    try {
      // Use RPC for status transitions (handles auto SO+BL on po_approved)
      const { data, error } = await supabase.rpc("update_quote_status", {
        p_quote_id: quoteId,
        p_new_status: newStatus,
        p_admin_id: user.id,
      });
      if (error) throw error;

      const result = data as any;

      // Show SO+BL info if created
      if (result?.so_number) {
        toast({
          title: "อนุมัติ PO แล้ว",
          description: `สร้าง SO (${result.so_number}) และ BL (${result.bl_number}) อัตโนมัติแล้ว`,
        });
      } else {
        toast({ title: "เปลี่ยนสถานะแล้ว", description: `→ ${(STATUS_CFG[newStatus] || { label: newStatus }).label}` });
      }

      fetchQuotes();
      const finalStatus = result?.status || newStatus;
      if (selected?.id === quoteId) selectQuote({ ...quote, status: finalStatus as string });
    } catch (err: any) {
      toast({ title: "ผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  /* ─── Reset Status (preserve messages, files, conversation) ─── */
  const handleResetStatus = async (quoteId: string) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return;
    if (!confirm(
      `เคลียร์สถานะใบเสนอราคา ${quote.quote_number || ""} กลับเป็น "รอตอบกลับ"?\n\n` +
      "• ข้อความ/สนทนาทั้งหมดจะยังคงอยู่\n" +
      "• ไฟล์ PO/เอกสารจะไม่ถูกลบ\n" +
      "• เฉพาะสถานะที่จะถูกรีเซ็ต"
    )) return;

    setSaving(true);
    try {
      const { data, error } = await supabase.rpc("update_quote_status", {
        p_quote_id: quoteId,
        p_new_status: "pending",
        p_admin_id: user?.id || null,
      });
      if (error) throw error;

      toast({ title: "รีเซ็ตสถานะแล้ว", description: "ข้อความและไฟล์ยังคงอยู่ครบ" });
      fetchQuotes();
      if (selected?.id === quoteId) selectQuote({ ...quote, status: "pending", customer_response: null, po_status: null });
    } catch (err: any) {
      toast({ title: "ผิดพลาด", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const filtered = quotes.filter((q) => {
    if (q.status === "draft") return false;

    // Filter by status
    if (statusFilter === "po_uploaded") {
      if (q.status !== "po_uploaded") return false;
    } else if (statusFilter !== "all" && q.status !== statusFilter) {
      return false;
    }

    if (searchText) {
      const s = searchText.toLowerCase().trim();
      // Build searchable text from all relevant fields
      const productsText = Array.isArray(q.products)
        ? q.products.map((p: any) => `${p?.model || ""} ${p?.name || ""} ${p?.category || ""}`).join(" ")
        : "";
      const searchable = [
        q.name,
        q.email,
        q.quote_number || "",
        q.chain_number || "",       // ค้นด้วย chain number (เช่น "2026-0042" หรือ "0042")
        q.company || "",
        q.phone || "",
        q.line_id || "",            // LINE ID
        q.whatsapp || "",           // WhatsApp
        q.po_number || "",          // เลข PO
        q.details || "",            // รายละเอียด
        q.notes || "",              // โน้ต admin
        productsText,               // สินค้า/รุ่น/หมวดหมู่
      ].join(" ").toLowerCase();
      if (!searchable.includes(s)) return false;
    }
    // Assignment filter
    if (assignFilter === "mine" && q.assigned_to !== user?.id) return false;
    if (assignFilter === "unassigned" && q.assigned_to !== null) return false;
    if (assignFilter !== "all" && assignFilter !== "mine" && assignFilter !== "unassigned" && q.assigned_to !== assignFilter) return false;
    return true;
  }).sort((a, b) => {
    // Apply user-selected sort order
    switch (sortBy) {
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "value_high":
        return (b.grand_total || 0) - (a.grand_total || 0);
      case "value_low":
        return (a.grand_total || 0) - (b.grand_total || 0);
      case "newest":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Count per status (for badges) — exclude drafts
  const nonDraft = quotes.filter((q) => q.status !== "draft");
  const statusCounts = {
    all: nonDraft.length,
    pending: nonDraft.filter((q) => q.status === "pending").length,
    quote_sent: nonDraft.filter((q) => q.status === "quote_sent").length,
    po_uploaded: nonDraft.filter((q) => q.status === "po_uploaded").length,
    completed: nonDraft.filter((q) => q.status === "completed").length,
    cancelled: nonDraft.filter((q) => q.status === "cancelled").length,
  };

  const renderSpecs = (specs: Record<string, string>) => (
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px]">
      {Object.entries(specs).filter(([, v]) => v && v !== "No").map(([k, v]) => (
        <span key={k} className="text-muted-foreground"><span className="font-medium text-foreground/60">{SPEC_LABELS[k] || k}:</span> {v === "Yes" ? "✓" : v}</span>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1 flex-wrap items-center">
          {[
            { v: "all",          l: "ทั้งหมด",         c: statusCounts.all },
            { v: "pending",      l: "รอตอบกลับ",       c: statusCounts.pending },
            { v: "quote_sent",   l: "ส่งราคาแล้ว",     c: statusCounts.quote_sent },
            { v: "po_uploaded",  l: "รอตรวจ PO",       c: statusCounts.po_uploaded },
            { v: "completed",    l: "เสร็จสิ้น",       c: statusCounts.completed },
            { v: "cancelled",    l: "ยกเลิก",          c: statusCounts.cancelled },
          ].map((f) => (
            <button
              key={f.v}
              onClick={() => { setStatusFilter(f.v); if (urlQuoteId) backToList(); }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                statusFilter === f.v ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/60"
              }`}
            >
              {f.l}
              {f.c > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  statusFilter === f.v ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  {f.c}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Sales person filter */}
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-muted-foreground" />
            <select value={assignFilter} onChange={(e) => setAssignFilter(e.target.value)} className={`${inp} text-xs py-1.5 w-36`}>
              <option value="all">ทุกคน ({quotes.filter((q) => q.status !== "draft").length})</option>
              <option value="mine">ของฉัน ({quotes.filter((q) => q.assigned_to === user?.id).length})</option>
              <option value="unassigned">ยังไม่มอบหมาย ({quotes.filter((q) => !q.assigned_to && q.status !== "draft").length})</option>
              {isSuperAdmin && salesTeam.map((s) => (
                <option key={s.user_id} value={s.user_id}>{s.full_name} ({quotes.filter((q) => q.assigned_to === s.user_id).length})</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="ค้นหา: ชื่อ, เบอร์, เลข, สินค้า, PO..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={`${inp} pl-8 pr-7 py-1.5 text-xs w-64`}
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="ล้างการค้นหา"
              >
                <X size={12} />
              </button>
            )}
          </div>
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`${inp} text-xs py-1.5 w-32`}
            title="เรียงลำดับ"
          >
            <option value="newest">↓ ใหม่สุด</option>
            <option value="oldest">↑ เก่าสุด</option>
            <option value="value_high">↓ ราคาสูง</option>
            <option value="value_low">↑ ราคาต่ำ</option>
          </select>
          <button onClick={() => fetchQuotes()} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><RefreshCw size={12} className={loading ? "animate-spin" : ""} /></button>
        </div>
      </div>

      {/* Result count + active filter info */}
      {(searchText || statusFilter !== "all" || assignFilter !== "all") && (
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground -mt-1">
          <span>พบ <strong className="text-foreground">{filtered.length}</strong> รายการ</span>
          {searchText && (
            <span>· ค้นหา: <strong className="text-foreground">"{searchText}"</strong></span>
          )}
        </div>
      )}

      {/* ═══ A3: Conditional layout — list mode OR detail mode ═══ */}
      {!isDetailMode ? (
        /* ─── LIST MODE: full-width list (no detail panel) ─── */
        <div className="space-y-1.5">
          {loading ? <div className="text-center py-12"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
          : filtered.length === 0 ? <div className="card-surface rounded-xl p-10 text-center text-muted-foreground text-sm">ไม่มีใบเสนอราคา</div>
          : filtered.map((q) => {
            const st = STATUS_CFG[q.status] || STATUS_CFG.pending;
            return (
              <button
                key={q.id}
                onClick={() => openQuoteDetail(q.id)}
                className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-4"
              >
                {/* Quote number + status (left) */}
                <div className="flex items-center gap-2 min-w-[180px]">
                  <span className="text-sm font-bold text-foreground">{q.quote_number || "Q-draft"}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${st.color}`}>{st.label}</span>
                </div>
                {/* Customer info (middle, flexible) */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{q.name}{q.company ? ` · ${q.company}` : ""}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{q.email}</p>
                </div>
                {/* Sale assigned (right-middle) */}
                <div className="hidden md:flex items-center gap-1 min-w-[120px]">
                  {q.assigned_to ? (
                    <>
                      <UserCircle2 size={12} className="text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground truncate">{getAdminShortName(q.assigned_to)}</span>
                    </>
                  ) : q.status !== "draft" ? (
                    <>
                      <UserCircle2 size={12} className="text-orange-400" />
                      <span className="text-[11px] text-orange-400">ยังไม่มอบหมาย</span>
                    </>
                  ) : null}
                </div>
                {/* Date (right) */}
                <div className="hidden sm:block text-[11px] text-muted-foreground min-w-[80px] text-right">
                  {fd(q.created_at)}
                </div>
                {/* Total (right-most) */}
                <div className="text-sm font-bold text-primary min-w-[90px] text-right">
                  {q.grand_total > 0 ? `฿${fp(q.grand_total)}` : "—"}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* ─── DETAIL MODE: full-width detail with back button ─── */
        <div className="space-y-3">
          {/* Back button bar */}
          <button
            onClick={backToList}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>กลับไปรายการใบเสนอราคา</span>
          </button>

          {/* Detail panel — full width */}
          {!selected ? (
            <div className="card-surface rounded-xl p-10 text-center text-muted-foreground text-sm">
              {loading ? (
                <><Loader2 size={20} className="animate-spin mx-auto mb-2" /> กำลังโหลดใบเสนอราคา...</>
              ) : (
                <><Eye size={24} className="mx-auto mb-2 opacity-30" />ไม่พบใบเสนอราคานี้</>
              )}
            </div>
          ) : (
            <div className="card-surface rounded-xl p-5 space-y-5">
              {/* Header + Status Change + Actions */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-bold text-foreground">{selected.quote_number || "Draft"}</h3>
                <div className="flex items-center gap-2">
                  <button onClick={handleShare} className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2"><Share2 size={14} /> แชร์</button>
                  <button onClick={handlePrint} className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2"><Printer size={14} /> พิมพ์</button>
                  {/* Status Dropdown */}
                  <select
                    value={selected.status}
                    onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                    disabled={saving}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${(STATUS_CFG[selected.status] || STATUS_CFG.pending).color}`}
                  >
                    {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                  {/* Reset Button */}
                  <button
                    onClick={() => handleResetStatus(selected.id)}
                    disabled={saving || selected.status === "pending"}
                    className="p-2.5 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-30"
                    title="เคลียร์สถานะ (รีเซ็ตกลับเป็นรอตอบกลับ ข้อมูลไม่หาย)"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
               </div>

              {/* ═══ Quote Status Timeline ═══ */}
              <QuoteStatusTimeline status={selected.status} className="my-2" />

              {/* ═══ Admin Quick Actions ═══ */}
              <QuoteActions
                status={selected.status}
                userRole="admin"
                onDownloadPDF={selected.pdf_url ? () => window.open(selected.pdf_url!, '_blank') : undefined}
                onViewPO={selected.po_file_url ? () => window.open(selected.po_file_url!, '_blank') : undefined}
                onApprovePO={selected.po_status && ["uploaded", "under_review", "pending_clarification"].includes(selected.po_status) ? () => handlePoAction(selected.id, "approved") : undefined}
                onRejectPO={selected.po_status && ["uploaded", "under_review", "pending_clarification"].includes(selected.po_status) ? () => {
                  const reason = prompt("เหตุผลที่ปฏิเสธ PO:");
                  if (reason !== null) handlePoAction(selected.id, "rejected", reason);
                } : undefined}
                onViewSO={() => window.dispatchEvent(new CustomEvent("admin-switch-tab", { detail: "sales_orders" }))}
                onViewBL={() => window.dispatchEvent(new CustomEvent("admin-switch-tab", { detail: "billing" }))}
                loading={saving}
              />


              <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">ข้อมูลลูกค้า</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="flex items-center gap-2 text-foreground"><User size={13} className="text-primary" /> {selected.name}</span>
                  <span className="flex items-center gap-2 text-foreground"><Mail size={13} className="text-primary" /> {selected.email}</span>
                  {selected.company && <span className="flex items-center gap-2 text-foreground"><Building2 size={13} className="text-primary" /> {selected.company}</span>}
                  {selected.phone && <span className="flex items-center gap-2 text-foreground"><Phone size={13} className="text-primary" /> {selected.phone}</span>}
                </div>
                {selected.details && <p className="text-xs text-muted-foreground p-2 rounded bg-background border border-border">{selected.details}</p>}
              </div>

              {/* ═══ Assigned Sales Person ═══ */}
              <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex items-center gap-3">
                <UserCircle2 size={18} className="text-indigo-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-wider">Sale ผู้ดูแล</p>
                  <p className="text-sm font-bold text-foreground">
                    {selected.assigned_to ? getAdminName(selected.assigned_to) : <span className="text-orange-400">ยังไม่มอบหมาย</span>}
                  </p>
                </div>
                {/* Super Admin can reassign */}
                {isSuperAdmin && (
                  <div className="flex items-center gap-1.5">
                    <ArrowRightLeft size={12} className="text-muted-foreground" />
                    <select
                      value={selected.assigned_to || ""}
                      onChange={(e) => e.target.value && handleReassign(selected.id, e.target.value)}
                      className={`${inp} text-[11px] py-1 w-36`}
                    >
                      <option value="">มอบหมายให้...</option>
                      {salesTeam.map((s) => (
                        <option key={s.user_id} value={s.user_id}>
                          {s.full_name} {s.role === "super_admin" ? "(SA)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* ═══ Line Items ═══ */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-foreground">รายการสินค้า</h4>
                  <button onClick={addLine} className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"><Plus size={12} /> เพิ่มรายการ</button>
                </div>

                {/* Filter row: category + keyword search */}
                <div className="flex items-center gap-2 mb-3">
                  <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={`${inp} text-xs py-1.5 w-44 shrink-0`}>
                    <option value="all">ทุกหมวด ({catalog.length})</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c} ({catalog.filter((p) => p.category === c).length})</option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="ค้นหารุ่น, ชื่อ, รายละเอียด..."
                      value={catSearch}
                      onChange={(e) => setCatSearch(e.target.value)}
                      className={`${inp} pl-7 pr-7 text-xs py-1.5`}
                    />
                    {catSearch && (
                      <button
                        type="button"
                        onClick={() => setCatSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  {(catFilter !== "all" || catSearch) && (
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {filteredCatalog.length} รายการ
                    </span>
                  )}
                </div>

                {lineLoading ? <div className="py-4 text-center"><Loader2 size={16} className="animate-spin text-muted-foreground mx-auto" /></div>
                : (
                  <div className="space-y-3">
                    {items.map((item, i) => (
                      <div key={item.id} className="rounded-xl border border-border bg-secondary/10 overflow-hidden">
                        <div className="p-3 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-5 shrink-0 font-bold">{i + 1}.</span>
                          <select value={item.product_id || ""} onChange={(e) => e.target.value && pickProduct(i, e.target.value)} className={`${inp} text-xs flex-1`}>
                            <option value="">เลือกสินค้า ({filteredCatalog.length} รุ่น)...</option>
                            {filteredCatalog.map((cp) => (
                              <option key={cp.id} value={cp.id}>{cp.model} — ฿{fp(cp.base_price)}</option>
                            ))}
                          </select>
                          <button onClick={() => setExpandItem(expandItem === i ? null : i)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary" title="รายละเอียด"><Info size={14} /></button>
                          <button onClick={() => removeLine(i)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground/40 hover:text-red-500"><Trash2 size={13} /></button>
                        </div>

                        {/* Expanded Specs */}
                        {expandItem === i && (item._name || item._desc) && (
                          <div className="mx-3 mb-2 p-3 rounded-lg bg-background border border-border/50 space-y-1.5">
                            {item._name && <p className="text-xs font-semibold text-foreground">{item._name}</p>}
                            {item._desc && <p className="text-[10px] text-muted-foreground line-clamp-3">{item._desc}</p>}
                            {item._specs && Object.keys(item._specs).length > 0 && renderSpecs(item._specs)}
                          </div>
                        )}

                        {/* Always show mini specs when product selected */}
                        {expandItem !== i && item._name && (
                          <div className="mx-3 mb-2 px-2 py-1.5 rounded bg-background/50 text-[10px] text-muted-foreground">
                            {item._name}
                            {item._specs && Object.entries(item._specs).filter(([, v]) => v && v !== "No" && v !== "Yes").slice(0, 4).map(([k, v]) => (
                              <span key={k} className="ml-2">{SPEC_LABELS[k] || k}: {v}</span>
                            ))}
                          </div>
                        )}

                        <div className="px-3 pb-2 grid grid-cols-4 gap-2">
                          <div><label className={lbl}>รุ่น</label><input value={item.model} onChange={(e) => updateLine(i, "model", e.target.value)} className={`${inp} text-xs`} /></div>
                          <div><label className={lbl}>จำนวน</label><input type="number" min="1" value={item.qty} onChange={(e) => updateLine(i, "qty", parseInt(e.target.value) || 1)} className={`${inp} text-xs`} /></div>
                          <div><label className={lbl}>ราคา/หน่วย</label><input type="number" value={item.unit_price} onChange={(e) => updateLine(i, "unit_price", parseFloat(e.target.value) || 0)} className={`${inp} text-xs`} /></div>
                          <div><label className={lbl}>ส่วนลด %</label><input type="number" min="0" max="100" value={item.discount_percent} onChange={(e) => updateLine(i, "discount_percent", parseFloat(e.target.value) || 0)} className={`${inp} text-xs`} /></div>
                        </div>

                        {/* รายละเอียดสินค้า — แสดงให้ลูกค้าเห็น */}
                        <div className="px-3 pb-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className={lbl}>รายละเอียดสินค้า <span className="text-[9px] text-muted-foreground/70">(ลูกค้าจะเห็น)</span></label>
                            {item._desc && item.description !== item._desc && (
                              <button
                                type="button"
                                onClick={() => updateLine(i, "description", item._desc || null)}
                                className="text-[9px] text-primary hover:underline"
                                title="ใช้รายละเอียดจากคลังสินค้า"
                              >
                                ↺ คืนค่าเดิม
                              </button>
                            )}
                          </div>
                          <textarea
                            value={item.description || ""}
                            onChange={(e) => updateLine(i, "description", e.target.value)}
                            placeholder={item._desc ? "ปรับแต่งรายละเอียดสำหรับใบเสนอราคานี้..." : "เพิ่มรายละเอียดสินค้า (ดึงจากคลังสินค้าอัตโนมัติเมื่อเลือกรุ่น)"}
                            rows={3}
                            className={`${inp} text-[11px] resize-y min-h-[60px]`}
                          />
                        </div>

                        <div className="px-3 pb-3 text-right text-xs font-bold text-primary">฿{fp(item.line_total)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ═══ Totals ═══ */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">รวมก่อนส่วนลด</span><span className="font-medium">฿{fp(subtotal)}</span></div>
                <div className="flex justify-between text-xs items-center gap-2"><span className="text-muted-foreground">ส่วนลดรวม (฿)</span><input type="number" value={edit.discount_amount} onChange={(e) => setEdit((f) => ({ ...f, discount_amount: parseFloat(e.target.value) || 0 }))} className={`${inp} text-xs w-28 text-right`} /></div>
                <div className="flex justify-between text-base font-bold border-t border-border pt-3"><span>ยอดรวมสุทธิ</span><span className="text-primary">฿{fp(grand)}</span></div>
              </div>

              {/* ═══ Terms ═══ */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">เงื่อนไข</h4>
                <div className="grid grid-cols-2 gap-3">
                  {/* Validity */}
                  <div>
                    <label className={lbl}>ราคายืนถึง</label>
                    <div className="flex gap-1.5">
                      {VALIDITY_PRESETS.map((p) => (
                        <button key={p.days} onClick={() => setEdit((f) => ({ ...f, valid_until: addDays(p.days) }))} className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${edit.valid_until === addDays(p.days) ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <input type="date" value={edit.valid_until} onChange={(e) => setEdit((f) => ({ ...f, valid_until: e.target.value }))} className={`${inp} text-xs mt-1.5`} />
                  </div>
                  {/* Payment */}
                  <div>
                    <label className={lbl}>เงื่อนไขชำระ</label>
                    <select value={edit.payment_terms} onChange={(e) => setEdit((f) => ({ ...f, payment_terms: e.target.value }))} className={inp}>
                      {PAYMENT_OPTS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  {/* Delivery */}
                  <div className="col-span-2">
                    <label className={lbl}>เงื่อนไขจัดส่ง</label>
                    <select value={edit.delivery_terms} onChange={(e) => setEdit((f) => ({ ...f, delivery_terms: e.target.value }))} className={inp}>
                      {DELIVERY_OPTS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  {/* VAT & WHT */}
                  <div className="col-span-2 flex gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input type="checkbox" checked={edit.include_vat} onChange={(e) => setEdit((f) => ({ ...f, include_vat: e.target.checked }))} className="rounded border-border text-primary w-3.5 h-3.5" />
                      ภาษีมูลค่าเพิ่ม {companySettings?.vat_percent || 7}%
                    </label>
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input type="checkbox" checked={edit.include_withholding_tax} onChange={(e) => setEdit((f) => ({ ...f, include_withholding_tax: e.target.checked }))} className="rounded border-border text-primary w-3.5 h-3.5" />
                      หัก ณ ที่จ่าย {companySettings?.withholding_tax_percent || 3}%
                    </label>
                  </div>
                </div>
              </div>

              {/* ═══ PDF / Attach ═══ */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">แนบไฟล์</h4>
                <div className="flex gap-2">
                  <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handlePdfUp(e.target.files[0])} />
                  <button onClick={() => pdfRef.current?.click()} disabled={pdfUp} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary/50 text-xs text-muted-foreground hover:text-primary transition-all">
                    {pdfUp ? <Loader2 size={13} className="animate-spin" /> : <FileUp size={13} />} {pdfUp ? "กำลังอัปโหลด..." : "อัปโหลด PDF"}
                  </button>
                  <button onClick={() => setShowDocPick(true)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary/50 text-xs text-muted-foreground hover:text-primary transition-all">
                    <Paperclip size={13} /> จากคลังเอกสาร
                  </button>
                </div>
                {edit.pdf_url && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/20 text-xs">
                    <FileText size={13} className="text-green-500" />
                    <a href={edit.pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate flex-1">{edit.pdf_url.split("/").pop()}</a>
                    <button onClick={() => setEdit((f) => ({ ...f, pdf_url: "" }))} className="text-muted-foreground hover:text-red-500"><X size={12} /></button>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className={lbl}>หมายเหตุ Admin</label>
                <textarea value={edit.notes} onChange={(e) => setEdit((f) => ({ ...f, notes: e.target.value }))} className={`${inp} resize-none`} rows={2} placeholder="บันทึกภายใน..." />
              </div>

              {/* ═══ Timeline / Conversation ═══ */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">สนทนา / ต่อรอง</h4>
                <QuoteTimeline
                  quoteId={selected.id}
                  quoteNumber={selected.quote_number || ""}
                  currentUserId={user?.id}
                  isAdmin={true}
                  onQuoteUpdated={() => { fetchQuotes(); if (selected) selectQuote(selected); }}
                />
              </div>

              {/* ═══ PO Review Section (Admin) ═══ */}
              {selected.po_file_url && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck size={13} className="text-teal-500" /> ใบสั่งซื้อ (PO) จากลูกค้า
                  </h4>
                  <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                        <FileCheck size={18} className="text-teal-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">{selected.po_file_name || "PO Document"}</p>
                        {selected.po_number && <p className="text-xs text-muted-foreground">เลข PO: <span className="font-medium text-foreground">{selected.po_number}</span></p>}
                        {selected.po_uploaded_at && <p className="text-[10px] text-muted-foreground">อัปโหลดเมื่อ {new Date(selected.po_uploaded_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>}
                        {selected.po_notes && <p className="text-xs text-muted-foreground mt-1">หมายเหตุ: {selected.po_notes}</p>}
                        <a href={selected.po_file_url} target="_blank" rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium">
                          <ExternalLink size={12} /> เปิดดูไฟล์ PO
                        </a>
                      </div>
                      <div className="shrink-0">
                        {selected.po_status === "uploaded" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">รอตรวจสอบ</span>
                        )}
                        {selected.po_status === "under_review" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">กำลังตรวจ</span>
                        )}
                        {selected.po_status === "pending_clarification" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20">รอข้อมูลเพิ่ม</span>
                        )}
                        {selected.po_status === "approved" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">อนุมัติแล้ว</span>
                        )}
                        {selected.po_status === "rejected" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">ปฏิเสธ</span>
                        )}
                      </div>
                    </div>

                    {/* SLA indicator */}
                    {(selected as any).po_review_due && ["uploaded", "under_review"].includes(selected.po_status || "") && (
                      <div className="mt-2 pt-2 border-t border-teal-500/15">
                        {(selected as any).po_overdue ? (
                          <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                            <AlertCircle size={11} /> เลย SLA แล้ว — กำหนดตรวจ {new Date((selected as any).po_review_due).toLocaleString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        ) : (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock size={11} /> SLA: ตรวจภายใน {new Date((selected as any).po_review_due).toLocaleString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Admin Actions for PO — show for uploaded, under_review, pending_clarification */}
                    {["uploaded", "under_review", "pending_clarification"].includes(selected.po_status || "") && (
                      <div className="mt-3 pt-3 border-t border-teal-500/15 flex gap-2 flex-wrap">
                        <button
                          onClick={() => handlePoAction(selected.id, "approved")}
                          disabled={saving}
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-600 text-xs font-bold hover:bg-green-500/20 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={13} /> อนุมัติ PO
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt("รายละเอียดที่ต้องการเพิ่มเติม:");
                            if (reason) handlePoAction(selected.id, "pending_clarification", reason);
                          }}
                          disabled={saving}
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-600 text-xs font-bold hover:bg-orange-500/20 transition-colors disabled:opacity-50"
                        >
                          <AlertCircle size={13} /> ขอข้อมูลเพิ่ม
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt("เหตุผลที่ปฏิเสธ PO:");
                            if (reason !== null) handlePoAction(selected.id, "rejected", reason);
                          }}
                          disabled={saving}
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          <XCircle size={13} /> ปฏิเสธ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No PO yet but status is won */}
              {!selected.po_file_url && selected.status === "quote_sent" && (
                <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/15 text-xs text-yellow-700 flex items-center gap-2">
                  <Clock size={13} /> รอลูกค้าส่งใบสั่งซื้อ (PO)
                </div>
              )}

              {/* Cross-reference links */}
              {["completed", "po_approved"].includes(selected.status) && (
                <div className="p-3 rounded-xl bg-secondary/20 border border-border">
                  <DocCrossLinks quoteId={selected.id} exclude={["quote"]} />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border">
                {/* ปุ่ม Print ถูกย้ายไปบนขวาแล้ว */}
                {hasZeroPriceItems && !["completed", "po_approved"].includes(selected.status) && (
                  <div className="mb-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                    <span className="text-base leading-none">⚠️</span>
                    <div className="flex-1">
                      <div className="font-bold mb-0.5">มีรายการที่ยังไม่ได้กำหนดราคา</div>
                      <div className="opacity-90">กรุณากำหนดราคาทุกรายการก่อนอนุมัติ — ราคา 0 บาทไม่สามารถส่งให้ลูกค้าได้</div>
                    </div>
                  </div>
                )}
                {["completed", "po_approved"].includes(selected.status) ? (
                  <div className="flex-1 flex flex-col gap-2">
                    {hasOrder && hasBilling ? (
                      <>
                        <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 text-green-600 border border-green-500/20 text-sm font-bold">
                          <CheckCircle size={14} /> สร้าง Order + ใบวางบิลแล้ว
                        </div>
                        <button
                          onClick={() => window.dispatchEvent(new CustomEvent("admin-switch-tab", { detail: "sales_orders" }))}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 text-xs font-bold hover:bg-blue-500/20 transition-colors"
                        >
                          <Package size={14} /> ดู Sales Order
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => manualCreateOrderAndBilling(selected.id)}
                        disabled={creatingDocs}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-colors disabled:opacity-60"
                      >
                        {creatingDocs ? <Loader2 size={14} className="animate-spin" /> : <Package size={14} />}
                        {creatingDocs ? "กำลังสร้าง..." : "สร้าง Sales Order + ใบวางบิล"}
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleApprove}
                    disabled={saving || items.length === 0 || hasZeroPriceItems}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    {hasZeroPriceItems ? "กรุณากำหนดราคาก่อนอนุมัติ" : "อนุมัติ + ส่งราคาให้ลูกค้า"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Doc Picker Modal */}
      {showDocPick && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDocPick(false)}>
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h3 className="text-sm font-bold flex items-center gap-2"><Paperclip size={16} className="text-primary" /> เลือกจากคลังเอกสาร</h3>
              <button onClick={() => setShowDocPick(false)} className="p-1 rounded-lg hover:bg-secondary"><X size={16} /></button>
            </div>
            <div className="p-4 space-y-1">
              {docLib.filter((d) => d.file_url).map((doc) => (
                <button key={doc.id} onClick={() => { setEdit((f) => ({ ...f, pdf_url: doc.file_url })); setShowDocPick(false); toast({ title: `แนบ "${doc.title}"` }); }}
                  className="w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors flex items-center gap-3">
                  <FileText size={16} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{doc.title}</p><p className="text-[11px] text-muted-foreground">{doc.category}</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuoteReview;

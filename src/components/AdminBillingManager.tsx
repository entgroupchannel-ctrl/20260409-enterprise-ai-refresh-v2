import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText, Send, CheckCircle, Clock, Loader2, RefreshCw, Search,
  Eye, ChevronDown, Building2, Phone, Mail, Hash, ArrowRight,
  AlertCircle, XCircle, CreditCard, Receipt, Printer, Calendar,
  Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import DocCrossLinks from "@/components/admin/DocCrossLinks";
import { printQuote } from "@/utils/printQuote";

/* ─── Types ─── */
interface BillingNote {
  id: string;
  billing_number: string;
  quote_id: string | null;
  order_id: string | null;
  customer_name: string;
  customer_company: string | null;
  customer_address: string | null;
  customer_tax_id: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  po_number: string | null;
  subtotal: number;
  discount_amount: number;
  vat_amount: number;
  withholding_tax: number;
  grand_total: number;
  billing_date: string;
  due_date: string | null;
  payment_terms: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

interface BillingItem {
  id: string;
  model: string;
  category: string | null;
  description: string | null;
  qty: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  sort_order: number;
}

interface POQuote {
  id: string;
  quote_number: string | null;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  po_number: string | null;
  subtotal: number;
  discount_amount: number;
  vat_amount: number;
  withholding_tax: number;
  grand_total: number;
  payment_terms: string | null;
  user_id: string | null;
  assigned_to: string | null;
  // For tracking already-created billings
  hasBilling?: boolean;
  existingBillingNumber?: string | null;
  existingBillingStatus?: string | null;
}

/* ─── Status Config ─── */
const STATUS_CFG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: "ร่าง", color: "bg-muted text-muted-foreground border-border", icon: Clock },
  sent: { label: "ส่งแล้ว", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Send },
  invoiced: { label: "สร้างใบแจ้งหนี้แล้ว", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  cancelled: { label: "ยกเลิก", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
};

const fmt = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 2 });
const fmtDate = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });

/* ═══════════════════════════════════════════════════ */
const AdminBillingManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBilling, setSelectedBilling] = useState<BillingNote | null>(null);
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);

  // Create from PO dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [poQuotes, setPOQuotes] = useState<POQuote[]>([]);
  const [poLoading, setPOLoading] = useState(false);
  const [companySettings, setCompanySettings] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase.from as any)("company_settings")
        .select("*").limit(1).maybeSingle();
      if (data) setCompanySettings(data);
    })();
  }, []);

  /* ─── Fetch ─── */
  /* ─── React Query: Auto-handles refetch on tab focus, dedupe, retry ─── */
  const { data: billings = [], isLoading: loading } = useQuery({
    queryKey: ["admin", "billings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("billing_notes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast({ title: "โหลดข้อมูลไม่สำเร็จ", description: error.message, variant: "destructive" });
        throw error;
      }
      return (data || []) as BillingNote[];
    },
    enabled: !!user?.id,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnMount: "always",
  });

  // Helper to trigger refetch (used by save handlers + refresh button)
  const fetchBillings = () => {
    qc.invalidateQueries({ queryKey: ["admin", "billings"] });
  };

  const fetchBillingItems = async (billingId: string) => {
    const { data } = await supabase
      .from("billing_note_items")
      .select("*")
      .eq("billing_note_id", billingId)
      .order("sort_order");
    setBillingItems((data as any) || []);
  };

  /* ─── Fetch ALL quotes ready for billing (po_approved OR won) — show all + mark which already have billing ─── */
  const fetchPOQuotes = async () => {
    setPOLoading(true);
    // Fetch quotes that are EITHER po_approved OR won (ตกลงราคา)
    const { data } = await supabase
      .from("quote_requests")
      .select("id, quote_number, name, company, email, phone, po_number, subtotal, discount_amount, vat_amount, withholding_tax, grand_total, payment_terms, user_id, assigned_to, status, po_status")
      .or("po_status.eq.approved,status.eq.won,status.eq.po_received")
      .order("created_at", { ascending: false });

    // Mark each quote whether it already has a billing note (sourced from current `billings` state)
    const billingMap = new Map<string, BillingNote>();
    billings.forEach(b => {
      if (b.quote_id) billingMap.set(b.quote_id, b);
    });

    const enriched = (data || []).map((q: any) => {
      const existing = billingMap.get(q.id);
      return {
        ...q,
        hasBilling: !!existing,
        existingBillingNumber: existing?.billing_number || null,
        existingBillingStatus: existing?.status || null,
      };
    }) as POQuote[];

    // Sort: not-yet-created first, already-created last
    enriched.sort((a, b) => {
      if (a.hasBilling === b.hasBilling) return 0;
      return a.hasBilling ? 1 : -1;
    });

    setPOQuotes(enriched);
    setPOLoading(false);
  };

  /* ─── Create Billing from PO Quote ─── */
  const createBillingFromQuote = async (quote: POQuote) => {
    try {
      // Get order_id from sales_orders (use maybeSingle — order may not exist yet)
      const { data: order } = await (supabase.from as any)("sales_orders")
        .select("id")
        .eq("quote_id", quote.id)
        .maybeSingle();

      const { data: billing, error } = await (supabase.from as any)("billing_notes").insert({
        quote_id: quote.id,
        order_id: order?.id || null,
        customer_name: quote.name,
        customer_company: quote.company,
        customer_email: quote.email,
        customer_phone: quote.phone,
        po_number: quote.po_number,
        subtotal: quote.subtotal,
        discount_amount: quote.discount_amount,
        vat_amount: quote.vat_amount || 0,
        withholding_tax: quote.withholding_tax || 0,
        grand_total: quote.grand_total,
        payment_terms: quote.payment_terms,
        due_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        assigned_to: quote.assigned_to,
        user_id: quote.user_id,
        created_by: user?.id,
        status: "draft",
      }).select().single();

      if (error) throw error;

      // Copy line items
      const { data: lineItems } = await supabase
        .from("quote_line_items")
        .select("*")
        .eq("quote_id", quote.id)
        .order("sort_order");

      if (lineItems && lineItems.length > 0 && billing) {
        const billingItems = (lineItems as any[]).map((li) => ({
          billing_note_id: (billing as any).id,
          product_id: li.product_id,
          model: li.model,
          category: li.category,
          description: li.admin_notes || li.model,
          qty: li.qty,
          unit_price: li.unit_price,
          discount_percent: li.discount_percent || 0,
          line_total: li.line_total || Math.round(li.unit_price * (1 - (li.discount_percent || 0) / 100) * li.qty * 100) / 100,
          sort_order: li.sort_order || 0,
        }));
        await (supabase.from as any)("billing_note_items").insert(billingItems);
      }

      toast({ title: "สร้างใบวางบิลสำเร็จ", description: `เลขที่ ${(billing as any).billing_number}` });
      setCreateDialogOpen(false);
      fetchBillings();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Create Invoice from Billing ─── */
  const createInvoiceFromBilling = async (billing: BillingNote) => {
    try {
      const { data: items } = await supabase
        .from("billing_note_items")
        .select("*")
        .eq("billing_note_id", billing.id)
        .order("sort_order");

      const { data: inv, error } = await (supabase.from as any)("invoices").insert({
        quote_id: billing.quote_id,
        order_id: billing.order_id,
        billing_note_id: billing.id,
        customer_name: billing.customer_name,
        customer_company: billing.customer_company,
        customer_address: billing.customer_address,
        customer_tax_id: billing.customer_tax_id,
        customer_email: billing.customer_email,
        customer_phone: billing.customer_phone,
        subtotal: billing.subtotal,
        discount_amount: billing.discount_amount,
        vat_amount: billing.vat_amount,
        withholding_tax: billing.withholding_tax,
        grand_total: billing.grand_total,
        payment_terms: billing.payment_terms,
        due_date: billing.due_date,
        created_by: user?.id,
      }).select().single();

      if (error) throw error;

      if (inv && items && items.length > 0) {
        const invoiceItems = (items as any[]).map((bi: any) => ({
          invoice_id: (inv as any).id,
          product_id: bi.product_id,
          model: bi.model,
          category: bi.category,
          description: bi.description,
          qty: bi.qty,
          unit_price: bi.unit_price,
          discount_percent: bi.discount_percent,
          line_total: bi.line_total,
          sort_order: bi.sort_order,
        }));
        await (supabase.from as any)("invoice_items").insert(invoiceItems);
      }

      await (supabase.from as any)("billing_notes")
        .update({ status: "invoiced", updated_at: new Date().toISOString() })
        .eq("id", billing.id);

      toast({ title: "สร้างใบแจ้งหนี้สำเร็จ", description: `เลขที่ ${(inv as any).invoice_number}` });
      fetchBillings();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Update Status ─── */
  const updateStatus = async (id: string, status: string) => {
    const { error } = await (supabase.from as any)("billing_notes")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "อัปเดตสถานะสำเร็จ" }); fetchBillings(); }
  };

  /* ─── Print Billing ─── */
  const handlePrintBilling = async (b: BillingNote) => {
    try {
      const { data: items } = await supabase
        .from("billing_note_items")
        .select("*")
        .eq("billing_note_id", b.id)
        .order("sort_order");

      const printItems = (items || []).map((it: any) => ({
        model: it.model,
        qty: it.qty,
        unit_price: it.unit_price,
        discount_percent: it.discount_percent || 0,
        line_total: it.line_total,
        admin_notes: null,
        description: it.description,
        _name: it.model,
        _desc: it.description || "",
      }));

      printQuote(
        {
          quote_number: b.billing_number,
          name: b.customer_name,
          email: b.customer_email || "",
          phone: b.customer_phone,
          company: b.customer_company,
          details: b.notes,
          company_address: b.customer_address,
          tax_id: b.customer_tax_id,
        },
        printItems,
        {
          discount_amount: b.discount_amount || 0,
          valid_until: b.due_date || "",
          payment_terms: b.payment_terms || "",
          delivery_terms: "",
          include_vat: (b.vat_amount || 0) > 0,
          vat_percent: 7,
        },
        companySettings || undefined,
        undefined,
        undefined,
        undefined,
        'th',
        'billing',
      );
    } catch (err: any) {
      toast({ title: "พิมพ์ไม่สำเร็จ", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Filter ─── */
  const filtered = billings.filter(b => {
    const matchSearch = !search || b.billing_number.toLowerCase().includes(search.toLowerCase()) || b.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: billings.length,
    draft: billings.filter(b => b.status === "draft").length,
    sent: billings.filter(b => b.status === "sent").length,
    invoiced: billings.filter(b => b.status === "invoiced").length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">ใบวางบิล (Billing Notes)</h2>
          <p className="text-xs text-muted-foreground">สร้างจาก PO ที่อนุมัติแล้ว → สร้างใบแจ้งหนี้</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setCreateDialogOpen(true); fetchPOQuotes(); }}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90"
          >
            <Plus size={14} /> สร้างใบวางบิล
          </button>
          <button onClick={fetchBillings} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <RefreshCw size={12} /> รีเฟรช
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "ทั้งหมด", value: stats.total, color: "text-foreground" },
          { label: "ร่าง", value: stats.draft, color: "text-muted-foreground" },
          { label: "ส่งแล้ว", value: stats.sent, color: "text-blue-500" },
          { label: "สร้าง Invoice แล้ว", value: stats.invoiced, color: "text-green-500" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาเลขที่ / ชื่อลูกค้า..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
          <option value="all">ทุกสถานะ</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" /> กำลังโหลด...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">ไม่พบใบวางบิล</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => {
            const st = STATUS_CFG[b.status] || STATUS_CFG.draft;
            const isSelected = selectedBilling?.id === b.id;
            return (
              <div key={b.id} className="border border-border rounded-xl overflow-hidden bg-card">
                <div className="p-4 cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => {
                  if (isSelected) { setSelectedBilling(null); setBillingItems([]); }
                  else { setSelectedBilling(b); fetchBillingItems(b.id); }
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${st.color}`}>{st.label}</div>
                      <div>
                        <div className="font-bold text-sm text-foreground">{b.billing_number}</div>
                        <div className="text-xs text-muted-foreground">{b.customer_name}{b.customer_company ? ` · ${b.customer_company}` : ""}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">฿{fmt(b.grand_total)}</div>
                      <div className="text-[10px] text-muted-foreground">{fmtDate(b.created_at)}</div>
                    </div>
                  </div>
                  {b.po_number && (
                    <div className="mt-2 text-[10px] text-muted-foreground">
                      <Hash size={10} className="inline mr-1" />PO: {b.po_number}
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="border-t border-border p-4 bg-accent/5 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-muted-foreground mb-1 font-medium">ข้อมูลลูกค้า</div>
                        <div className="space-y-1">
                          {b.customer_company && <div className="flex items-center gap-1"><Building2 size={11} />{b.customer_company}</div>}
                          {b.customer_email && <div className="flex items-center gap-1"><Mail size={11} />{b.customer_email}</div>}
                          {b.customer_phone && <div className="flex items-center gap-1"><Phone size={11} />{b.customer_phone}</div>}
                          {b.customer_tax_id && <div className="flex items-center gap-1"><Hash size={11} />Tax: {b.customer_tax_id}</div>}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1 font-medium">รายละเอียด</div>
                        <div className="space-y-1">
                          <div>วันที่วางบิล: {fmtDate(b.billing_date)}</div>
                          {b.due_date && <div>ครบกำหนด: {fmtDate(b.due_date)}</div>}
                          {b.payment_terms && <div>เงื่อนไข: {b.payment_terms}</div>}
                        </div>
                      </div>
                    </div>

                    {billingItems.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-2">รายการสินค้า ({billingItems.length})</div>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-border text-muted-foreground">
                              <th className="text-left py-1 pr-2">#</th>
                              <th className="text-left py-1">รายการ</th>
                              <th className="text-right py-1">จำนวน</th>
                              <th className="text-right py-1">ราคา</th>
                              <th className="text-right py-1">รวม</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billingItems.map((item, i) => (
                              <tr key={item.id} className="border-b border-border/50">
                                <td className="py-1.5 pr-2 text-muted-foreground">{i + 1}</td>
                                <td className="py-1.5">
                                  <div className="font-medium">{item.model}</div>
                                  {item.description && item.description !== item.model && (
                                    <div className="text-muted-foreground">{item.description}</div>
                                  )}
                                </td>
                                <td className="py-1.5 text-right">{item.qty}</td>
                                <td className="py-1.5 text-right">{fmt(item.unit_price)}</td>
                                <td className="py-1.5 text-right font-medium">{fmt(item.line_total)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="mt-3 flex justify-end">
                          <div className="w-48 space-y-1 text-xs">
                            <div className="flex justify-between"><span className="text-muted-foreground">รวม</span><span>{fmt(b.subtotal)}</span></div>
                            {b.discount_amount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">ส่วนลด</span><span className="text-red-400">-{fmt(b.discount_amount)}</span></div>}
                            {b.vat_amount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">VAT 7%</span><span>{fmt(b.vat_amount)}</span></div>}
                            {b.withholding_tax > 0 && <div className="flex justify-between"><span className="text-muted-foreground">หัก ณ ที่จ่าย</span><span className="text-red-400">-{fmt(b.withholding_tax)}</span></div>}
                            <div className="flex justify-between font-bold border-t border-border pt-1"><span>รวมทั้งสิ้น</span><span>฿{fmt(b.grand_total)}</span></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Related Documents */}
                    <div className="pt-2 border-t border-border">
                      <DocCrossLinks quoteId={b.quote_id} orderId={b.order_id} billingId={b.id} exclude={["billing"]} />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                      {b.status === "draft" && (
                        <button onClick={() => updateStatus(b.id, "sent")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-medium hover:bg-blue-500/20">
                          <Send size={12} /> ส่งใบวางบิล
                        </button>
                      )}
                      {(b.status === "draft" || b.status === "sent") && (
                        <button onClick={() => createInvoiceFromBilling(b)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20">
                          <ArrowRight size={12} /> สร้างใบแจ้งหนี้จากใบวางบิลนี้
                        </button>
                      )}
                      <button
                        onClick={() => handlePrintBilling(b)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20"
                      >
                        <Printer size={12} /> พิมพ์
                      </button>
                      {b.status !== "cancelled" && b.status !== "invoiced" && (
                        <button onClick={() => updateStatus(b.id, "cancelled")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-400">
                          <XCircle size={12} /> ยกเลิก
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ Create from PO Dialog ═══ */}
      {createDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setCreateDialogOpen(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-xl shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-1 text-foreground">สร้างใบวางบิลจาก PO</h3>
            <p className="text-xs text-muted-foreground mb-4">
              เลือก PO ที่อนุมัติแล้วเพื่อสร้างใบวางบิล
              {poQuotes.length > 0 && (
                <>
                  {" — "}
                  <span className="font-medium text-foreground">
                    {poQuotes.filter(q => !q.hasBilling).length}
                  </span>{" "}
                  พร้อมสร้าง
                  {poQuotes.filter(q => q.hasBilling).length > 0 && (
                    <>
                      {" · "}
                      <span className="text-muted-foreground/60">
                        {poQuotes.filter(q => q.hasBilling).length} สร้างแล้ว
                      </span>
                    </>
                  )}
                </>
              )}
            </p>

            {poLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> กำลังโหลด...
              </div>
            ) : poQuotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <AlertCircle size={20} className="mx-auto mb-2 opacity-40" />
                ไม่มี PO ที่พร้อมสร้างใบวางบิล<br />
                <span className="text-[10px]">(ยังไม่มี PO ที่อนุมัติ หรือยังไม่ได้ตกลงราคา)</span>
              </div>
            ) : (
              <div className="space-y-2">
                {poQuotes.map(q => {
                  const isCreated = q.hasBilling;
                  return (
                    <div
                      key={q.id}
                      className={`border rounded-lg p-3 transition-colors ${
                        isCreated
                          ? "border-border/40 bg-muted/30 opacity-60"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className={`text-sm font-bold ${isCreated ? "text-muted-foreground" : "text-foreground"}`}>
                              {q.quote_number || "—"}
                            </div>
                            {isCreated && (
                              <div className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 text-[9px] font-bold flex items-center gap-1">
                                <CheckCircle size={9} /> สร้างแล้ว
                              </div>
                            )}
                          </div>
                          <div className={`text-xs ${isCreated ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                            {q.name}{q.company ? ` · ${q.company}` : ""}
                          </div>
                          {q.po_number && (
                            <div className="text-[10px] text-muted-foreground/80 mt-0.5">
                              <Hash size={9} className="inline mr-0.5" />PO: {q.po_number}
                            </div>
                          )}
                          {isCreated && q.existingBillingNumber && (
                            <div className="text-[10px] text-green-600/80 mt-0.5">
                              → ใบวางบิล: <span className="font-medium">{q.existingBillingNumber}</span>
                              {q.existingBillingStatus && (
                                <span className="text-muted-foreground/60"> · {STATUS_CFG[q.existingBillingStatus]?.label || q.existingBillingStatus}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-3 shrink-0">
                          <div className={`text-sm font-bold ${isCreated ? "text-muted-foreground" : "text-foreground"}`}>
                            ฿{fmt(q.grand_total)}
                          </div>
                          {isCreated ? (
                            <div className="mt-1 px-3 py-1 rounded-lg bg-muted text-muted-foreground/60 text-[10px] font-medium cursor-not-allowed inline-flex items-center gap-0.5">
                              <CheckCircle size={10} /> สร้างแล้ว
                            </div>
                          ) : (
                            <button
                              onClick={() => createBillingFromQuote(q)}
                              className="mt-1 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/90"
                            >
                              <Plus size={10} className="inline mr-0.5" /> สร้าง
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button onClick={() => setCreateDialogOpen(false)} className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBillingManager;

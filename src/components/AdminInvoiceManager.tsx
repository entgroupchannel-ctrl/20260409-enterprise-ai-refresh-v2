import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText, Receipt, FileCheck, Plus, Eye, RefreshCw, Search,
  Clock, CheckCircle, Send, AlertCircle, Loader2, ChevronDown,
  Building2, Phone, Mail, Printer, Download, ArrowRight,
  DollarSign, Calendar, Hash, XCircle, CreditCard, Truck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import DocCrossLinks from "@/components/admin/DocCrossLinks";
import { printQuote } from "@/utils/printQuote";

/* ─── Types ─── */
interface Invoice {
  id: string;
  invoice_number: string;
  quote_id: string | null;
  order_id: string | null;
  billing_note_id: string | null;
  customer_name: string;
  customer_company: string | null;
  customer_address: string | null;
  customer_tax_id: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  invoice_date: string;
  due_date: string | null;
  subtotal: number;
  discount_amount: number;
  vat_amount: number;
  withholding_tax: number;
  grand_total: number;
  status: string;
  payment_terms: string | null;
  notes: string | null;
  user_id: string | null;
  assigned_to: string | null;
  created_at: string;
}

interface TaxInvoice {
  id: string;
  tax_invoice_number: string;
  invoice_id: string | null;
  customer_name: string;
  customer_company: string | null;
  customer_tax_id: string | null;
  customer_address: string | null;
  issue_date: string;
  subtotal: number;
  vat_amount: number;
  grand_total: number;
  status: string;
  created_at: string;
}

interface ReceiptDoc {
  id: string;
  receipt_number: string;
  invoice_id: string | null;
  payment_record_id: string | null;
  customer_name: string;
  customer_company: string | null;
  payment_date: string;
  payment_method: string | null;
  amount_paid: number;
  status: string;
  created_at: string;
}

interface InvoiceItem {
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
  // For tracking already-created invoices
  hasInvoice?: boolean;
  existingInvoiceNumber?: string | null;
  existingInvoiceStatus?: string | null;
}

interface PaymentForDoc {
  id: string;
  payment_number: string;
  invoice_id: string | null;
  amount_paid: number;
  payment_method: string;
  payment_date: string;
  bank_name: string | null;
  reference_number: string | null;
  slip_url: string | null;
}

type DocTab = "invoices" | "tax_invoices" | "receipts";

/* ─── Status Config ─── */
const INV_STATUS: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: "ร่าง", color: "bg-muted text-muted-foreground border-border", icon: Clock },
  sent: { label: "ส่งแล้ว", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Send },
  paid: { label: "ชำระแล้ว", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  overdue: { label: "เกินกำหนด", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: AlertCircle },
  cancelled: { label: "ยกเลิก", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

const TIV_STATUS: Record<string, { label: string; color: string }> = {
  draft: { label: "ร่าง", color: "bg-muted text-muted-foreground border-border" },
  issued: { label: "ออกแล้ว", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  cancelled: { label: "ยกเลิก", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const RCP_STATUS: Record<string, { label: string; color: string }> = {
  draft: { label: "ร่าง", color: "bg-muted text-muted-foreground border-border" },
  issued: { label: "ออกแล้ว", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  cancelled: { label: "ยกเลิก", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const PAYMENT_METHODS: Record<string, string> = {
  transfer: "โอนเงิน",
  cash: "เงินสด",
  cheque: "เช็ค",
  credit_card: "บัตรเครดิต",
};

const fmt = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 2 });
const fmtDate = (d: string) => new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });

/* ═══════════════════════════════════════════════════ */
const AdminInvoiceManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [docTab, setDocTab] = useState<DocTab>("invoices");
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // Create from PO dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [poQuotes, setPOQuotes] = useState<POQuote[]>([]);
  const [poLoading, setPOLoading] = useState(false);

  // Create Tax Invoice / Receipt from Payment dialog
  const [tivFromPayOpen, setTivFromPayOpen] = useState(false);
  const [rcpFromPayOpen, setRcpFromPayOpen] = useState(false);
  const [confirmedPayments, setConfirmedPayments] = useState<PaymentForDoc[]>([]);
  const [payDocLoading, setPayDocLoading] = useState(false);
  const [companySettings, setCompanySettings] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase.from as any)("company_settings")
        .select("*").limit(1).maybeSingle();
      if (data) setCompanySettings(data);
    })();
  }, []);

  /* ─── React Query: Invoices + Tax Invoices + Receipts ─── */
  const { data: invoiceData, isLoading: loading } = useQuery({
    queryKey: ["admin", "invoices"],
    queryFn: async () => {
      const [inv, tiv, rcp] = await Promise.all([
        supabase.from("invoices").select("*").order("created_at", { ascending: false }),
        supabase.from("tax_invoices").select("*").order("created_at", { ascending: false }),
        supabase.from("receipts").select("*").order("created_at", { ascending: false }),
      ]);
      if (inv.error) throw inv.error;
      if (tiv.error) throw tiv.error;
      if (rcp.error) throw rcp.error;
      return {
        invoices: (inv.data || []) as Invoice[],
        taxInvoices: (tiv.data || []) as TaxInvoice[],
        receipts: (rcp.data || []) as ReceiptDoc[],
      };
    },
    enabled: !!user?.id,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnMount: "always",
  });

  const invoices = invoiceData?.invoices ?? [];
  const taxInvoices = invoiceData?.taxInvoices ?? [];
  const receipts = invoiceData?.receipts ?? [];

  // Helper for save handlers + refresh button
  const fetchAll = () => {
    qc.invalidateQueries({ queryKey: ["admin", "invoices"] });
  };

  const fetchInvoiceItems = async (invoiceId: string) => {
    const { data } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("sort_order");
    setInvoiceItems((data as any) || []);
  };

  /* ─── Fetch ALL quotes ready for invoice (po_approved OR won) — show all + mark which already have invoice ─── */
  const fetchPOQuotes = async () => {
    setPOLoading(true);
    const { data } = await supabase
      .from("quote_requests")
      .select("id, quote_number, name, company, email, phone, po_number, subtotal, discount_amount, vat_amount, withholding_tax, grand_total, payment_terms, user_id, assigned_to, status, po_status")
      .or("po_status.eq.approved,status.eq.won,status.eq.po_received")
      .order("created_at", { ascending: false });

    // Mark each quote whether it already has an invoice
    const invoiceMap = new Map<string, Invoice>();
    invoices.forEach(i => {
      if (i.quote_id) invoiceMap.set(i.quote_id, i);
    });

    const enriched = (data || []).map((q: any) => {
      const existing = invoiceMap.get(q.id);
      return {
        ...q,
        hasInvoice: !!existing,
        existingInvoiceNumber: existing?.invoice_number || null,
        existingInvoiceStatus: existing?.status || null,
      };
    }) as POQuote[];

    // Sort: not-yet-created first, already-created last
    enriched.sort((a, b) => {
      if (a.hasInvoice === b.hasInvoice) return 0;
      return a.hasInvoice ? 1 : -1;
    });

    setPOQuotes(enriched);
    setPOLoading(false);
  };

  /* ─── Fetch confirmed payments for creating tax invoices / receipts ─── */
  const fetchConfirmedPayments = async () => {
    setPayDocLoading(true);
    const { data } = await supabase
      .from("payment_records")
      .select("id, payment_number, invoice_id, amount_paid, payment_method, payment_date, bank_name, reference_number, slip_url")
      .eq("status", "confirmed")
      .order("created_at", { ascending: false });
    setConfirmedPayments((data || []) as any);
    setPayDocLoading(false);
  };

  /* ─── Create Invoice from PO Quote ─── */
  const createInvoiceFromQuote = async (quote: POQuote) => {
    try {
      // Use maybeSingle — order/billing may not exist yet
      const { data: order } = await (supabase.from as any)("sales_orders").select("id").eq("quote_id", quote.id).maybeSingle();
      const { data: billing } = await (supabase.from as any)("billing_notes").select("id").eq("quote_id", quote.id).maybeSingle();
      const { data: lineItems } = await supabase.from("quote_line_items").select("*").eq("quote_id", quote.id).order("sort_order");

      const { data: inv, error } = await (supabase.from as any)("invoices").insert({
        quote_id: quote.id,
        order_id: order?.id || null,
        billing_note_id: billing?.id || null,
        customer_name: quote.name,
        customer_company: quote.company,
        customer_email: quote.email,
        customer_phone: quote.phone,
        subtotal: quote.subtotal,
        discount_amount: quote.discount_amount,
        vat_amount: quote.vat_amount || 0,
        withholding_tax: quote.withholding_tax || 0,
        grand_total: quote.grand_total,
        payment_terms: quote.payment_terms,
        user_id: quote.user_id,
        assigned_to: quote.assigned_to,
        created_by: user?.id,
        due_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      }).select().single();

      if (error) throw error;

      if (inv && lineItems && lineItems.length > 0) {
        const items = (lineItems as any[]).map((li, i) => ({
          invoice_id: (inv as any).id,
          product_id: li.product_id,
          model: li.model,
          category: li.category,
          description: li.admin_notes || li.model,
          qty: li.qty || 1,
          unit_price: li.unit_price || 0,
          discount_percent: li.discount_percent || 0,
          line_total: li.line_total || 0,
          sort_order: li.sort_order || i,
        }));
        await (supabase.from as any)("invoice_items").insert(items);
      }

      // If billing note exists and is still draft, mark it as invoiced
      if (billing?.id) {
        await (supabase.from as any)("billing_notes")
          .update({ status: "invoiced", updated_at: new Date().toISOString() })
          .eq("id", billing.id)
          .eq("status", "draft");
      }

      toast({ title: "สร้างใบแจ้งหนี้สำเร็จ", description: `เลขที่ ${(inv as any).invoice_number}` });
      setCreateDialogOpen(false);
      fetchAll();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Create from Sales Order (via sessionStorage) ─── */
  const createInvoiceFromOrder = async (orderId: string) => {
    try {
      const { data: order } = await supabase.from("sales_orders").select("*").eq("id", orderId).maybeSingle();
      if (!order) throw new Error("ไม่พบ Order");
      const { data: orderItems } = await supabase.from("sales_order_items").select("*").eq("order_id", orderId).order("sort_order");

      const { data: inv, error } = await supabase.from("invoices").insert({
        quote_id: (order as any).quote_id,
        order_id: orderId,
        customer_name: (order as any).customer_name,
        customer_company: (order as any).customer_company,
        customer_email: (order as any).customer_email,
        customer_phone: (order as any).customer_phone,
        subtotal: (order as any).subtotal,
        discount_amount: (order as any).discount_amount,
        vat_amount: (order as any).vat_amount,
        withholding_tax: (order as any).withholding_tax,
        grand_total: (order as any).grand_total,
        payment_terms: (order as any).payment_terms,
        user_id: (order as any).user_id,
        assigned_to: (order as any).assigned_to,
        created_by: user?.id,
        due_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      } as any).select().single();

      if (error) throw error;

      if (orderItems && (inv as any)) {
        const items = (orderItems as any[]).map((oi, i) => ({
          invoice_id: (inv as any).id,
          product_id: oi.product_id,
          model: oi.model,
          category: oi.category,
          description: oi.description || oi.name_th,
          qty: oi.qty || 1,
          unit_price: oi.unit_price || 0,
          discount_percent: oi.discount_percent || 0,
          line_total: oi.line_total || 0,
          sort_order: oi.sort_order || i,
        }));
        await supabase.from("invoice_items").insert(items as any);
      }

      toast({ title: "สร้างใบแจ้งหนี้สำเร็จ", description: `เลขที่ ${(inv as any).invoice_number}` });
      fetchAll();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Create Tax Invoice from Invoice ─── */
  const createTaxInvoice = async (invoice: Invoice) => {
    try {
      const { data, error } = await supabase.from("tax_invoices").insert({
        invoice_id: invoice.id,
        quote_id: invoice.quote_id,
        order_id: invoice.order_id,
        customer_name: invoice.customer_name,
        customer_company: invoice.customer_company,
        customer_address: invoice.customer_address,
        customer_tax_id: invoice.customer_tax_id,
        subtotal: invoice.subtotal,
        vat_amount: invoice.vat_amount,
        grand_total: invoice.grand_total,
        created_by: user?.id,
      } as any).select().single();
      if (error) throw error;
      toast({ title: "สร้างใบกำกับภาษีสำเร็จ", description: `เลขที่ ${(data as any).tax_invoice_number}` });
      fetchAll();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Create Tax Invoice from Payment ─── */
  const createTaxInvoiceFromPayment = async (payment: PaymentForDoc) => {
    try {
      // Get invoice info if linked
      let customerName = "ลูกค้า";
      let customerCompany: string | null = null;
      let customerTaxId: string | null = null;
      let customerAddress: string | null = null;
      let quoteId: string | null = null;
      let orderId: string | null = null;

      if (payment.invoice_id) {
        const { data: inv } = await supabase.from("invoices").select("*").eq("id", payment.invoice_id).maybeSingle();
        if (inv) {
          const i = inv as any;
          customerName = i.customer_name;
          customerCompany = i.customer_company;
          customerTaxId = i.customer_tax_id;
          customerAddress = i.customer_address;
          quoteId = i.quote_id;
          orderId = i.order_id;
        }
      }

      const { data, error } = await supabase.from("tax_invoices").insert({
        invoice_id: payment.invoice_id,
        quote_id: quoteId,
        order_id: orderId,
        payment_record_id: payment.id,
        customer_name: customerName,
        customer_company: customerCompany,
        customer_tax_id: customerTaxId,
        customer_address: customerAddress,
        subtotal: payment.amount_paid / 1.07,
        vat_amount: payment.amount_paid - (payment.amount_paid / 1.07),
        grand_total: payment.amount_paid,
        created_by: user?.id,
      } as any).select().single();

      if (error) throw error;
      toast({ title: "สร้างใบกำกับภาษีสำเร็จ", description: `เลขที่ ${(data as any).tax_invoice_number}` });
      setTivFromPayOpen(false);
      fetchAll();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Create Receipt from Invoice ─── */
  const createReceipt = async (invoice: Invoice) => {
    try {
      const { data, error } = await supabase.from("receipts").insert({
        invoice_id: invoice.id,
        quote_id: invoice.quote_id,
        order_id: invoice.order_id,
        customer_name: invoice.customer_name,
        customer_company: invoice.customer_company,
        amount_paid: invoice.grand_total,
        payment_method: "transfer",
        created_by: user?.id,
      } as any).select().single();
      if (error) throw error;
      toast({ title: "สร้างใบเสร็จรับเงินสำเร็จ", description: `เลขที่ ${(data as any).receipt_number}` });
      fetchAll();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Create Receipt from Payment ─── */
  const createReceiptFromPayment = async (payment: PaymentForDoc) => {
    try {
      let customerName = "ลูกค้า";
      let customerCompany: string | null = null;
      let quoteId: string | null = null;
      let orderId: string | null = null;

      if (payment.invoice_id) {
        const { data: inv } = await supabase.from("invoices").select("*").eq("id", payment.invoice_id).maybeSingle();
        if (inv) {
          const i = inv as any;
          customerName = i.customer_name;
          customerCompany = i.customer_company;
          quoteId = i.quote_id;
          orderId = i.order_id;
        }
      }

      const { data, error } = await supabase.from("receipts").insert({
        invoice_id: payment.invoice_id,
        quote_id: quoteId,
        order_id: orderId,
        payment_record_id: payment.id,
        customer_name: customerName,
        customer_company: customerCompany,
        amount_paid: payment.amount_paid,
        payment_method: payment.payment_method,
        payment_date: payment.payment_date,
        status: "issued",
        created_by: user?.id,
      } as any).select().single();

      if (error) throw error;
      toast({ title: "สร้างใบเสร็จรับเงินสำเร็จ", description: `เลขที่ ${(data as any).receipt_number}` });
      setRcpFromPayOpen(false);
      fetchAll();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Create Delivery Note from Invoice ─── */
  const createDeliveryFromInvoice = async (invoice: Invoice) => {
    try {
      const { data: invItems } = await supabase
        .from("invoice_items").select("*")
        .eq("invoice_id", invoice.id).order("sort_order");

      const { data: delivery, error } = await (supabase.from as any)("delivery_notes").insert({
        invoice_id: invoice.id,
        billing_note_id: invoice.billing_note_id || null,
        quote_id: invoice.quote_id,
        order_id: invoice.order_id,
        customer_name: invoice.customer_name,
        customer_company: invoice.customer_company,
        customer_address: invoice.customer_address,
        customer_phone: invoice.customer_phone,
        delivery_address: invoice.customer_address,
        created_by: user?.id,
      }).select().single();

      if (error) throw error;

      if (delivery && invItems && invItems.length > 0) {
        const items = (invItems as any[]).map((ii: any) => ({
          delivery_note_id: (delivery as any).id,
          model: ii.model,
          description: ii.description,
          qty: ii.qty || 1,
          sort_order: ii.sort_order || 0,
        }));
        await (supabase.from as any)("delivery_note_items").insert(items);
      }

      toast({ title: "สร้างใบส่งสินค้าสำเร็จ", description: `เลขที่ ${(delivery as any).delivery_number}` });
      fetchAll();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Update status ─── */
  const updateInvoiceStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("invoices").update({ status, updated_at: new Date().toISOString() } as any).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "อัปเดตสถานะสำเร็จ" }); fetchAll(); }
  };

  const updateTaxInvoiceStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("tax_invoices").update({ status, updated_at: new Date().toISOString() } as any).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "อัปเดตสถานะสำเร็จ" }); fetchAll(); }
  };

  const updateReceiptStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("receipts").update({ status, updated_at: new Date().toISOString() } as any).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "อัปเดตสถานะสำเร็จ" }); fetchAll(); }
  };

  /* ─── Print Invoice ─── */
  const handlePrintInvoice = async (inv: Invoice) => {
    try {
      const { data: items } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", inv.id)
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
          quote_number: inv.invoice_number,
          name: inv.customer_name,
          email: inv.customer_email || "",
          phone: inv.customer_phone,
          company: inv.customer_company,
          details: inv.notes,
          company_address: inv.customer_address,
          tax_id: inv.customer_tax_id,
        },
        printItems,
        {
          discount_amount: inv.discount_amount || 0,
          valid_until: inv.due_date || "",
          payment_terms: inv.payment_terms || "",
          delivery_terms: "",
          include_vat: (inv.vat_amount || 0) > 0,
          vat_percent: 7,
        },
        companySettings || undefined,
        undefined,
        undefined,
        undefined,
        'th',
        'invoice',
      );
    } catch (err: any) {
      toast({ title: "พิมพ์ไม่สำเร็จ", description: err.message, variant: "destructive" });
    }
  };

  /* ─── Filter ─── */
  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = !search || inv.invoice_number.toLowerCase().includes(search.toLowerCase()) || inv.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredTaxInvoices = taxInvoices.filter(t => {
    const matchSearch = !search || t.tax_invoice_number.toLowerCase().includes(search.toLowerCase()) || t.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredReceipts = receipts.filter(r => {
    const matchSearch = !search || r.receipt_number.toLowerCase().includes(search.toLowerCase()) || r.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    totalInvoices: invoices.length,
    unpaid: invoices.filter(i => i.status === "sent").length,
    paid: invoices.filter(i => i.status === "paid").length,
    totalTaxInvoices: taxInvoices.length,
    totalReceipts: receipts.length,
    totalRevenue: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.grand_total, 0),
  };

  /* ─── Payment dialog helper (render) ─── */
  const renderPaymentPickerDialog = (
    title: string,
    open: boolean,
    onClose: () => void,
    onSelect: (p: PaymentForDoc) => void,
    existingIds: string[],
  ) => {
    if (!open) return null;
    const available = confirmedPayments.filter(p => !existingIds.includes(p.id));
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-xl shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-bold mb-1 text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mb-4">เลือกรายการจ่ายเงินที่ยืนยันแล้ว</p>
          {payDocLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm"><Loader2 size={16} className="animate-spin inline mr-2" />กำลังโหลด...</div>
          ) : available.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <AlertCircle size={20} className="mx-auto mb-2 opacity-40" />ไม่มีรายการจ่ายเงินที่พร้อมใช้
            </div>
          ) : (
            <div className="space-y-2">
              {available.map(p => (
                <div key={p.id} className="border border-border rounded-lg p-3 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-foreground">{p.payment_number}</div>
                      <div className="text-xs text-muted-foreground">
                        {PAYMENT_METHODS[p.payment_method] || p.payment_method}
                        {p.bank_name ? ` · ${p.bank_name}` : ""}
                        {p.reference_number ? ` · Ref: ${p.reference_number}` : ""}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{fmtDate(p.payment_date)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-500">฿{fmt(p.amount_paid)}</div>
                      <button onClick={() => onSelect(p)}
                        className="mt-1 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/90">
                        <Plus size={10} className="inline mr-0.5" /> สร้าง
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">ปิด</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ─── Header Stats ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "ใบแจ้งหนี้", value: stats.totalInvoices, icon: FileText, color: "text-blue-500" },
          { label: "รอชำระ", value: stats.unpaid, icon: Clock, color: "text-orange-500" },
          { label: "ชำระแล้ว", value: stats.paid, icon: CheckCircle, color: "text-green-500" },
          { label: "รายได้รวม", value: `฿${fmt(stats.totalRevenue)}`, icon: DollarSign, color: "text-primary" },
        ].map((s, i) => (
          <div key={i} className="card-surface rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={16} className={s.color} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ─── Sub-tabs with Create Buttons ─── */}
      <div className="flex items-center gap-2 border-b border-border pb-2 flex-wrap">
        {([
          { id: "invoices" as DocTab, label: "ใบแจ้งหนี้", icon: FileText, count: stats.totalInvoices },
          { id: "tax_invoices" as DocTab, label: "ใบกำกับภาษี", icon: FileCheck, count: stats.totalTaxInvoices },
          { id: "receipts" as DocTab, label: "ใบเสร็จรับเงิน", icon: Receipt, count: stats.totalReceipts },
        ]).map(t => (
          <button key={t.id} onClick={() => { setDocTab(t.id); setSelectedInvoice(null); setStatusFilter("all"); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${docTab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <t.icon size={14} />{t.label}<span className="text-xs ml-1 opacity-60">({t.count})</span>
          </button>
        ))}

        <div className="flex-1" />

        {/* Create buttons per tab */}
        {docTab === "invoices" && (
          <button onClick={() => { setCreateDialogOpen(true); fetchPOQuotes(); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90">
            <Plus size={12} /> สร้างจาก PO
          </button>
        )}
        {docTab === "tax_invoices" && (
          <button onClick={() => { setTivFromPayOpen(true); fetchConfirmedPayments(); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90">
            <Plus size={12} /> สร้างจากการจ่ายเงิน
          </button>
        )}
        {docTab === "receipts" && (
          <button onClick={() => { setRcpFromPayOpen(true); fetchConfirmedPayments(); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90">
            <Plus size={12} /> สร้างจากการจ่ายเงิน
          </button>
        )}

        <button onClick={fetchAll} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> รีเฟรช
        </button>
      </div>

      {/* ─── Search + Filter ─── */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาเลขที่ / ชื่อลูกค้า..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground">
          <option value="all">ทุกสถานะ</option>
          {docTab === "invoices" && Object.entries(INV_STATUS).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
          {docTab === "tax_invoices" && Object.entries(TIV_STATUS).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
          {docTab === "receipts" && Object.entries(RCP_STATUS).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="inline animate-spin mr-2" size={16} />กำลังโหลด...</div>
      ) : (
        <>
          {/* ═══ INVOICES TAB ═══ */}
          {docTab === "invoices" && (
            <div className="space-y-2">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">ยังไม่มีใบแจ้งหนี้</div>
              ) : filteredInvoices.map(inv => {
                const st = INV_STATUS[inv.status] || INV_STATUS.draft;
                const StIcon = st.icon;
                const isSelected = selectedInvoice?.id === inv.id;

                return (
                  <div key={inv.id} className="card-surface rounded-xl border border-border overflow-hidden">
                    <button onClick={() => { if (isSelected) setSelectedInvoice(null); else { setSelectedInvoice(inv); fetchInvoiceItems(inv.id); } }}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0"><FileText size={18} className="text-blue-500" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold text-foreground">{inv.invoice_number}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${st.color}`}><StIcon size={10} /> {st.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{inv.customer_company || inv.customer_name} • {fmtDate(inv.invoice_date)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">฿{fmt(inv.grand_total)}</p>
                        {inv.due_date && <p className="text-[10px] text-muted-foreground">ครบ {fmtDate(inv.due_date)}</p>}
                      </div>
                    </button>

                    {isSelected && (
                      <div className="border-t border-border p-4 space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-muted-foreground mb-1">ลูกค้า</p>
                            <p className="font-medium text-foreground">{inv.customer_name}</p>
                            {inv.customer_company && <p className="text-muted-foreground flex items-center gap-1"><Building2 size={10} />{inv.customer_company}</p>}
                            {inv.customer_email && <p className="text-muted-foreground flex items-center gap-1"><Mail size={10} />{inv.customer_email}</p>}
                            {inv.customer_phone && <p className="text-muted-foreground flex items-center gap-1"><Phone size={10} />{inv.customer_phone}</p>}
                          </div>
                          <div>
                            {inv.customer_tax_id && <p className="text-muted-foreground">เลขผู้เสียภาษี: <span className="text-foreground font-medium">{inv.customer_tax_id}</span></p>}
                            {inv.payment_terms && <p className="text-muted-foreground mt-1">เงื่อนไข: <span className="text-foreground">{inv.payment_terms}</span></p>}
                          </div>
                        </div>

                        {invoiceItems.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-foreground mb-2">รายการสินค้า</p>
                            <div className="rounded-lg border border-border overflow-hidden">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-muted/50">
                                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">#</th>
                                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">รุ่น</th>
                                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">รายละเอียด</th>
                                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">จำนวน</th>
                                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">ราคา</th>
                                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">รวม</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {invoiceItems.map((item, i) => (
                                    <tr key={item.id} className="border-t border-border/50">
                                      <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                                      <td className="px-3 py-2 font-medium text-foreground">{item.model}</td>
                                      <td className="px-3 py-2 text-muted-foreground">{item.description || item.category || "-"}</td>
                                      <td className="px-3 py-2 text-right">{item.qty}</td>
                                      <td className="px-3 py-2 text-right">{fmt(item.unit_price)}</td>
                                      <td className="px-3 py-2 text-right font-medium">{fmt(item.line_total)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <div className="w-64 space-y-1 text-xs">
                            <div className="flex justify-between"><span className="text-muted-foreground">ยอดรวม</span><span>฿{fmt(inv.subtotal)}</span></div>
                            {inv.discount_amount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">ส่วนลด</span><span className="text-red-400">-฿{fmt(inv.discount_amount)}</span></div>}
                            {inv.vat_amount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">VAT 7%</span><span>฿{fmt(inv.vat_amount)}</span></div>}
                            {inv.withholding_tax > 0 && <div className="flex justify-between"><span className="text-muted-foreground">หัก ณ ที่จ่าย 3%</span><span className="text-red-400">-฿{fmt(inv.withholding_tax)}</span></div>}
                            <div className="flex justify-between border-t border-border pt-1 font-bold text-sm"><span>ยอดสุทธิ</span><span className="text-primary">฿{fmt(inv.grand_total)}</span></div>
                          </div>
                        </div>

                        {/* Related Documents */}
                        <div className="pt-2 border-t border-border">
                          <DocCrossLinks quoteId={inv.quote_id} orderId={inv.order_id} billingId={inv.billing_note_id} invoiceId={inv.id} exclude={["invoice"]} />
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                          {inv.status === "draft" && (
                            <button onClick={() => updateInvoiceStatus(inv.id, "sent")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-medium hover:bg-blue-500/20">
                              <Send size={12} /> ส่งใบแจ้งหนี้
                            </button>
                          )}
                          {inv.status === "sent" && (
                            <button onClick={() => { window.dispatchEvent(new CustomEvent("admin-switch-tab", { detail: "payments" })); }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-xs font-medium hover:bg-green-500/20">
                              <CreditCard size={12} /> บันทึกจ่ายเงิน
                            </button>
                          )}
                          {(inv.status === "draft" || inv.status === "sent" || inv.status === "paid") && (
                            <button onClick={() => createDeliveryFromInvoice(inv)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-600 text-xs font-medium hover:bg-teal-500/20">
                              <Truck size={12} /> สร้างใบส่งสินค้า
                            </button>
                          )}
                          {(inv.status === "sent" || inv.status === "paid") && !taxInvoices.some(t => t.invoice_id === inv.id) && (
                            <button onClick={() => createTaxInvoice(inv)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 text-xs font-medium hover:bg-purple-500/20">
                              <FileCheck size={12} /> สร้างใบกำกับภาษี
                            </button>
                          )}
                          {inv.status === "paid" && !receipts.some(r => r.invoice_id === inv.id) && (
                            <button onClick={() => createReceipt(inv)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500 text-xs font-medium hover:bg-orange-500/20">
                              <Receipt size={12} /> สร้างใบเสร็จรับเงิน
                            </button>
                          )}
                          <button
                            onClick={() => handlePrintInvoice(inv)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20"
                          >
                            <Printer size={12} /> พิมพ์
                          </button>
                          {inv.status !== "cancelled" && inv.status !== "paid" && (
                            <button onClick={() => updateInvoiceStatus(inv.id, "cancelled")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-400">
                              <XCircle size={12} /> ยกเลิก
                            </button>
                          )}
                        </div>

                        {inv.notes && <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">{inv.notes}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══ TAX INVOICES TAB ═══ */}
          {docTab === "tax_invoices" && (
            <div className="space-y-2">
              {filteredTaxInvoices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">ยังไม่มีใบกำกับภาษี</div>
              ) : filteredTaxInvoices.map(tiv => {
                const st = TIV_STATUS[tiv.status] || TIV_STATUS.draft;
                return (
                  <div key={tiv.id} className="card-surface rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0"><FileCheck size={18} className="text-purple-500" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold text-foreground">{tiv.tax_invoice_number}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${st.color}`}>{st.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {tiv.customer_company || tiv.customer_name} • {fmtDate(tiv.issue_date)}
                          {tiv.customer_tax_id && ` • TAX: ${tiv.customer_tax_id}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">฿{fmt(tiv.grand_total)}</p>
                        <p className="text-[10px] text-muted-foreground">VAT ฿{fmt(tiv.vat_amount)}</p>
                      </div>
                      <div className="flex gap-1">
                        {tiv.status === "draft" && (
                          <button onClick={() => updateTaxInvoiceStatus(tiv.id, "issued")} className="px-2 py-1 rounded text-[10px] bg-green-500/10 text-green-500 hover:bg-green-500/20">ออกเอกสาร</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══ RECEIPTS TAB ═══ */}
          {docTab === "receipts" && (
            <div className="space-y-2">
              {filteredReceipts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">ยังไม่มีใบเสร็จรับเงิน</div>
              ) : filteredReceipts.map(rcp => {
                const st = RCP_STATUS[rcp.status] || RCP_STATUS.draft;
                return (
                  <div key={rcp.id} className="card-surface rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0"><Receipt size={18} className="text-orange-500" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold text-foreground">{rcp.receipt_number}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${st.color}`}>{st.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {rcp.customer_company || rcp.customer_name} • {fmtDate(rcp.payment_date)}
                          {rcp.payment_method && ` • ${PAYMENT_METHODS[rcp.payment_method] || rcp.payment_method}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0"><p className="text-sm font-bold text-foreground">฿{fmt(rcp.amount_paid)}</p></div>
                      <div className="flex gap-1">
                        {rcp.status === "draft" && (
                          <button onClick={() => updateReceiptStatus(rcp.id, "issued")} className="px-2 py-1 rounded text-[10px] bg-green-500/10 text-green-500 hover:bg-green-500/20">ออกเอกสาร</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══ Create Invoice from PO Dialog ═══ */}
      {createDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setCreateDialogOpen(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-xl shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-1 text-foreground">สร้างใบแจ้งหนี้จาก PO</h3>
            <p className="text-xs text-muted-foreground mb-4">
              เลือก PO ที่อนุมัติแล้วเพื่อสร้างใบแจ้งหนี้
              {poQuotes.length > 0 && (
                <>
                  {" — "}
                  <span className="font-medium text-foreground">
                    {poQuotes.filter(q => !q.hasInvoice).length}
                  </span>{" "}
                  พร้อมสร้าง
                  {poQuotes.filter(q => q.hasInvoice).length > 0 && (
                    <>
                      {" · "}
                      <span className="text-muted-foreground/60">
                        {poQuotes.filter(q => q.hasInvoice).length} สร้างแล้ว
                      </span>
                    </>
                  )}
                </>
              )}
            </p>
            {poLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm"><Loader2 size={16} className="animate-spin inline mr-2" />กำลังโหลด...</div>
            ) : poQuotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <AlertCircle size={20} className="mx-auto mb-2 opacity-40" />ไม่มี PO ที่พร้อมสร้างใบแจ้งหนี้
              </div>
            ) : (
              <div className="space-y-2">
                {poQuotes.map(q => {
                  const isCreated = q.hasInvoice;
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
                          {isCreated && q.existingInvoiceNumber && (
                            <div className="text-[10px] text-green-600/80 mt-0.5">
                              → ใบแจ้งหนี้: <span className="font-medium">{q.existingInvoiceNumber}</span>
                              {q.existingInvoiceStatus && (
                                <span className="text-muted-foreground/60"> · {INV_STATUS[q.existingInvoiceStatus]?.label || q.existingInvoiceStatus}</span>
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
                            <button onClick={() => createInvoiceFromQuote(q)}
                              className="mt-1 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/90">
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
              <button onClick={() => setCreateDialogOpen(false)} className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">ปิด</button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Invoice from Payment Dialog */}
      {renderPaymentPickerDialog(
        "สร้างใบกำกับภาษีจากการจ่ายเงิน",
        tivFromPayOpen,
        () => setTivFromPayOpen(false),
        createTaxInvoiceFromPayment,
        taxInvoices.map(t => t.id),
      )}

      {/* Receipt from Payment Dialog */}
      {renderPaymentPickerDialog(
        "สร้างใบเสร็จรับเงินจากการจ่ายเงิน",
        rcpFromPayOpen,
        () => setRcpFromPayOpen(false),
        createReceiptFromPayment,
        receipts.filter(r => r.payment_record_id).map(r => r.payment_record_id!),
      )}
    </div>
  );
};

export default AdminInvoiceManager;

import { useState, useEffect } from "react";
import { FileText, Receipt, Download, Eye, Clock, CheckCircle, AlertCircle, Filter, Printer } from "lucide-react";
import { printQuote } from "@/utils/printQuote";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  customer_name: string;
  customer_company: string | null;
  customer_address: string | null;
  customer_tax_id: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  subtotal: number;
  discount_amount: number;
  vat_amount: number;
  withholding_tax: number;
  grand_total: number;
  status: string;
  payment_terms: string | null;
  notes: string | null;
  created_at: string;
}

interface ReceiptRow {
  id: string;
  receipt_number: string;
  payment_date: string;
  customer_name: string;
  customer_company: string | null;
  customer_address: string | null;
  customer_tax_id: string | null;
  customer_phone: string | null;
  receipt_type: string | null;
  amount_paid: number;
  payment_method: string | null;
  status: string;
  notes: string | null;
  invoice_id: string | null;
  created_at: string;
}

interface TaxInvoice {
  id: string;
  tax_invoice_number: string;
  issue_date: string;
  customer_name: string;
  customer_company: string | null;
  customer_tax_id: string | null;
  subtotal: number;
  vat_amount: number;
  grand_total: number;
  status: string;
  notes: string | null;
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
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  draft: { label: "แบบร่าง", variant: "secondary", icon: Clock },
  sent: { label: "ส่งแล้ว", variant: "default", icon: FileText },
  paid: { label: "ชำระแล้ว", variant: "default", icon: CheckCircle },
  overdue: { label: "เกินกำหนด", variant: "destructive", icon: AlertCircle },
  cancelled: { label: "ยกเลิก", variant: "outline", icon: AlertCircle },
  issued: { label: "ออกแล้ว", variant: "default", icon: CheckCircle },
};

const MyInvoices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [taxInvoices, setTaxInvoices] = useState<TaxInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [companySettings, setCompanySettings] = useState<any>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRow | null>(null);
  const [receiptDetailOpen, setReceiptDetailOpen] = useState(false);
  const [receiptInvoiceData, setReceiptInvoiceData] = useState<any>(null);
  const [receiptItemsData, setReceiptItemsData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase.from as any)("company_settings")
        .select("*").limit(1).maybeSingle();
      if (data) setCompanySettings(data);
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [invRes, rcpRes, tivRes] = await Promise.all([
        supabase.from("invoices").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
        supabase.from("receipts").select("*").order("created_at", { ascending: false }),
        supabase.from("tax_invoices").select("*").order("created_at", { ascending: false }),
      ]);
      setInvoices((invRes.data as any[]) || []);
      setReceipts((rcpRes.data as any[]) || []);
      setTaxInvoices((tivRes.data as any[]) || []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (inv: Invoice) => {
    setSelectedInvoice(inv);
    setDetailOpen(true);
    const { data } = await supabase.from("invoice_items").select("*").eq("invoice_id", inv.id).order("sort_order");
    setInvoiceItems((data as any[]) || []);
  };

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

  const openReceiptDetail = async (rcp: ReceiptRow) => {
    setSelectedReceipt(rcp);
    setReceiptDetailOpen(true);
    if (rcp.receipt_type === "full" && rcp.invoice_id) {
      const { data: inv } = await supabase.from("invoices").select("*").eq("id", rcp.invoice_id).maybeSingle();
      setReceiptInvoiceData(inv);
      const { data: items } = await supabase.from("invoice_items").select("*").eq("invoice_id", rcp.invoice_id).order("sort_order");
      setReceiptItemsData((items as any[]) || []);
    } else {
      setReceiptInvoiceData(null);
      setReceiptItemsData([]);
    }
  };

  const handlePrintReceipt = (rcp: ReceiptRow) => {
    try {
      const docType = rcp.receipt_type === "simple" ? "receipt_simple" as const : "receipt_full" as const;

      const printItems = docType === "receipt_full"
        ? receiptItemsData.map((it: any) => ({
            model: it.model,
            qty: it.qty,
            unit_price: it.unit_price,
            discount_percent: it.discount_percent || 0,
            line_total: it.line_total,
            admin_notes: null,
            description: it.description,
            _name: it.model,
            _desc: it.description || "",
          }))
        : [];

      printQuote(
        {
          quote_number: rcp.receipt_number,
          name: rcp.customer_name,
          email: receiptInvoiceData?.customer_email || "",
          phone: rcp.customer_phone,
          company: rcp.customer_company,
          details: rcp.notes,
          company_address: rcp.customer_address || receiptInvoiceData?.customer_address || null,
          tax_id: rcp.customer_tax_id || receiptInvoiceData?.customer_tax_id || null,
          payment_date: rcp.payment_date,
          payment_method: rcp.payment_method,
          amount_paid: rcp.amount_paid,
          receiver_name: companySettings?.receiver_name || null,
          receiver_position: companySettings?.receiver_position || null,
        },
        printItems,
        {
          discount_amount: receiptInvoiceData?.discount_amount || 0,
          valid_until: "",
          payment_terms: "",
          delivery_terms: "",
          include_vat: docType === "receipt_full",
          vat_percent: 7,
        },
        companySettings || undefined,
        undefined,
        undefined,
        undefined,
        'th',
        docType,
      );
    } catch (err: any) {
      toast({ title: "พิมพ์ไม่สำเร็จ", description: err.message, variant: "destructive" });
    }
  };

  const fmt = (n: number | null) => (n ?? 0).toLocaleString("th-TH", { minimumFractionDigits: 2 });
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "-";

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = statusConfig[status] || { label: status, variant: "outline" as const, icon: Clock };
    return (
      <Badge variant={cfg.variant} className="text-xs gap-1">
        <cfg.icon size={12} />
        {cfg.label}
      </Badge>
    );
  };

  // Summary cards
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === "paid").length;
  const pendingAmount = invoices.filter(i => i.status === "sent").reduce((s, i) => s + (i.grand_total || 0), 0);
  const totalPaid = receipts.reduce((s, r) => s + (r.amount_paid || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">ใบแจ้งหนี้ & ใบเสร็จ</h2>
        <p className="text-sm text-muted-foreground mt-1">ดูเอกสารทางการเงินทั้งหมดของคุณ</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalInvoices}</p>
            <p className="text-xs text-muted-foreground mt-1">ใบแจ้งหนี้ทั้งหมด</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{paidInvoices}</p>
            <p className="text-xs text-muted-foreground mt-1">ชำระแล้ว</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">฿{fmt(pendingAmount)}</p>
            <p className="text-xs text-muted-foreground mt-1">ค้างชำระ</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">฿{fmt(totalPaid)}</p>
            <p className="text-xs text-muted-foreground mt-1">ยอดชำระรวม</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="invoices">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices" className="text-xs sm:text-sm gap-1">
            <FileText size={14} /> ใบแจ้งหนี้ ({invoices.length})
          </TabsTrigger>
          <TabsTrigger value="tax_invoices" className="text-xs sm:text-sm gap-1">
            <FileText size={14} /> ใบกำกับภาษี ({taxInvoices.length})
          </TabsTrigger>
          <TabsTrigger value="receipts" className="text-xs sm:text-sm gap-1">
            <Receipt size={14} /> ใบเสร็จ ({receipts.length})
          </TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="mt-4">
          {invoices.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <FileText size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">ยังไม่มีใบแจ้งหนี้</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">เลขที่</TableHead>
                    <TableHead className="text-xs font-semibold">วันที่</TableHead>
                    <TableHead className="text-xs font-semibold hidden sm:table-cell">กำหนดชำระ</TableHead>
                    <TableHead className="text-xs font-semibold text-right">ยอดรวม</TableHead>
                    <TableHead className="text-xs font-semibold text-center">สถานะ</TableHead>
                    <TableHead className="text-xs font-semibold text-center w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map(inv => (
                    <TableRow key={inv.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-xs font-medium text-primary">{inv.invoice_number}</TableCell>
                      <TableCell className="text-xs">{fmtDate(inv.invoice_date)}</TableCell>
                      <TableCell className="text-xs hidden sm:table-cell">{fmtDate(inv.due_date)}</TableCell>
                      <TableCell className="text-xs text-right font-medium">฿{fmt(inv.grand_total)}</TableCell>
                      <TableCell className="text-center"><StatusBadge status={inv.status} /></TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => openDetail(inv)} className="h-7 w-7 p-0">
                          <Eye size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Tax Invoices Tab */}
        <TabsContent value="tax_invoices" className="mt-4">
          {taxInvoices.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <FileText size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">ยังไม่มีใบกำกับภาษี</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">เลขที่</TableHead>
                    <TableHead className="text-xs font-semibold">วันที่ออก</TableHead>
                    <TableHead className="text-xs font-semibold hidden sm:table-cell">เลขผู้เสียภาษี</TableHead>
                    <TableHead className="text-xs font-semibold text-right">ยอดรวม</TableHead>
                    <TableHead className="text-xs font-semibold text-center">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxInvoices.map(tiv => (
                    <TableRow key={tiv.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-xs font-medium text-primary">{tiv.tax_invoice_number}</TableCell>
                      <TableCell className="text-xs">{fmtDate(tiv.issue_date)}</TableCell>
                      <TableCell className="text-xs hidden sm:table-cell">{tiv.customer_tax_id || "-"}</TableCell>
                      <TableCell className="text-xs text-right font-medium">฿{fmt(tiv.grand_total)}</TableCell>
                      <TableCell className="text-center"><StatusBadge status={tiv.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Receipts Tab */}
        <TabsContent value="receipts" className="mt-4">
          {receipts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Receipt size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">ยังไม่มีใบเสร็จรับเงิน</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">เลขที่</TableHead>
                    <TableHead className="text-xs font-semibold">วันที่ชำระ</TableHead>
                    <TableHead className="text-xs font-semibold hidden sm:table-cell">วิธีชำระ</TableHead>
                    <TableHead className="text-xs font-semibold text-right">จำนวนเงิน</TableHead>
                     <TableHead className="text-xs font-semibold text-center">สถานะ</TableHead>
                    <TableHead className="text-xs font-semibold text-center w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map(rcp => (
                    <TableRow key={rcp.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-xs font-medium text-primary">{rcp.receipt_number}</TableCell>
                      <TableCell className="text-xs">{fmtDate(rcp.payment_date)}</TableCell>
                      <TableCell className="text-xs hidden sm:table-cell capitalize">{rcp.payment_method || "-"}</TableCell>
                      <TableCell className="text-xs text-right font-medium">฿{fmt(rcp.amount_paid)}</TableCell>
                      <TableCell className="text-center"><StatusBadge status={rcp.status} /></TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => openReceiptDetail(rcp)} className="h-7 w-7 p-0">
                          <Eye size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                {selectedInvoice?.invoice_number}
              </DialogTitle>
              {selectedInvoice && (
                <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(selectedInvoice)} className="gap-1.5 text-xs mr-6">
                  <Printer size={14} /> พิมพ์
                </Button>
              )}
            </div>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4">
              {/* Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">วันที่:</span>
                  <span className="ml-2 font-medium">{fmtDate(selectedInvoice.invoice_date)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">กำหนดชำระ:</span>
                  <span className="ml-2 font-medium">{fmtDate(selectedInvoice.due_date)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">สถานะ:</span>
                  <span className="ml-2"><StatusBadge status={selectedInvoice.status} /></span>
                </div>
                {selectedInvoice.payment_terms && (
                  <div>
                    <span className="text-muted-foreground">เงื่อนไข:</span>
                    <span className="ml-2 text-xs">{selectedInvoice.payment_terms}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              {invoiceItems.length > 0 && (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-xs">#</TableHead>
                        <TableHead className="text-xs">รุ่น</TableHead>
                        <TableHead className="text-xs text-right">จำนวน</TableHead>
                        <TableHead className="text-xs text-right">ราคา/หน่วย</TableHead>
                        <TableHead className="text-xs text-right">รวม</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoiceItems.map((item, i) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs">{i + 1}</TableCell>
                          <TableCell className="text-xs font-medium">{item.model}</TableCell>
                          <TableCell className="text-xs text-right">{item.qty}</TableCell>
                          <TableCell className="text-xs text-right">฿{fmt(item.unit_price)}</TableCell>
                          <TableCell className="text-xs text-right font-medium">฿{fmt(item.line_total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Totals */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">ราคาก่อนภาษี</span><span>฿{fmt(selectedInvoice.subtotal)}</span></div>
                {(selectedInvoice.discount_amount ?? 0) > 0 && (
                  <div className="flex justify-between text-red-400"><span>ส่วนลด</span><span>-฿{fmt(selectedInvoice.discount_amount)}</span></div>
                )}
                {(selectedInvoice.vat_amount ?? 0) > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">VAT 7%</span><span>฿{fmt(selectedInvoice.vat_amount)}</span></div>
                )}
                {(selectedInvoice.withholding_tax ?? 0) > 0 && (
                  <div className="flex justify-between text-amber-400"><span>หัก ณ ที่จ่าย 3%</span><span>-฿{fmt(selectedInvoice.withholding_tax)}</span></div>
                )}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>ยอดรวมสุทธิ</span>
                  <span className="text-primary">฿{fmt(selectedInvoice.grand_total)}</span>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
                  <strong>หมายเหตุ:</strong> {selectedInvoice.notes}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Detail Dialog */}
      <Dialog open={receiptDetailOpen} onOpenChange={setReceiptDetailOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Receipt size={18} className="text-primary" />
                {selectedReceipt?.receipt_number}
              </DialogTitle>
              {selectedReceipt && (
                <Button variant="outline" size="sm" onClick={() => handlePrintReceipt(selectedReceipt)} className="gap-1.5 text-xs mr-6">
                  <Printer size={14} /> พิมพ์
                </Button>
              )}
            </div>
          </DialogHeader>

          {selectedReceipt && (
            <div className="space-y-4">
              {/* Receipt Type Badge */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedReceipt.receipt_type === "simple" ? "แบบย่อ" : "เต็มรูปแบบ (มี VAT)"}
                </Badge>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">วันที่ชำระ:</span>
                  <span className="ml-2 font-medium">{fmtDate(selectedReceipt.payment_date)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">วิธีชำระ:</span>
                  <span className="ml-2 font-medium">{selectedReceipt.payment_method || "-"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ลูกค้า:</span>
                  <span className="ml-2 font-medium">{selectedReceipt.customer_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">สถานะ:</span>
                  <span className="ml-2"><StatusBadge status={selectedReceipt.status} /></span>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">จำนวนเงินที่รับ</p>
                <p className="text-2xl font-bold text-primary">฿{fmt(selectedReceipt.amount_paid)}</p>
              </div>

              {selectedReceipt.notes && (
                <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
                  <strong>หมายเหตุ:</strong> {selectedReceipt.notes}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyInvoices;

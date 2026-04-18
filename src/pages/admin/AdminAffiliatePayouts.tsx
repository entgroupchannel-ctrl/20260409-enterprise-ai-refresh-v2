import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Loader2, Search, Plus, ExternalLink, Wallet, CheckCircle2, Clock, XCircle, BadgeCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/layouts/AdminLayout";
import { format } from "date-fns";

type StatusFilter = "all" | "pending" | "approved" | "paid" | "cancelled";

interface PayoutRow {
  id: string;
  affiliate_id: string;
  payout_number: string;
  period_start: string;
  period_end: string;
  amount: number;
  lead_count: number;
  payment_method: string;
  payment_reference: string | null;
  status: string;
  notes: string | null;
  approved_at: string | null;
  paid_at: string | null;
  created_at: string;
}

interface AffiliateMini {
  id: string;
  full_name: string;
  affiliate_code: string;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  promptpay_id: string | null;
}

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  approved: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  cancelled: "bg-muted text-muted-foreground",
};

const statusIcon: Record<string, any> = {
  pending: Clock,
  approved: BadgeCheck,
  paid: CheckCircle2,
  cancelled: XCircle,
};

export default function AdminAffiliatePayouts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<PayoutRow[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateMini[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // create form
  const [fAffiliate, setFAffiliate] = useState("");
  const [fStart, setFStart] = useState(format(new Date(new Date().setDate(1)), "yyyy-MM-dd"));
  const [fEnd, setFEnd] = useState(format(new Date(), "yyyy-MM-dd"));
  const [fAmount, setFAmount] = useState("");
  const [fLeadCount, setFLeadCount] = useState("");
  const [fMethod, setFMethod] = useState("bank_transfer");
  const [fNotes, setFNotes] = useState("");

  const load = async () => {
    setLoading(true);
    const [{ data: payoutData }, { data: affData }] = await Promise.all([
      (supabase.from as any)("affiliate_payouts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("affiliates")
        .select("id, full_name, affiliate_code, bank_name, bank_account_number, bank_account_name, promptpay_id")
        .eq("status", "approved")
        .order("full_name"),
    ]);
    setRows((payoutData as PayoutRow[]) || []);
    setAffiliates((affData as AffiliateMini[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const c = { all: rows.length, pending: 0, approved: 0, paid: 0, cancelled: 0 };
    for (const r of rows) if (r.status in c) (c as any)[r.status]++;
    return c;
  }, [rows]);

  const totals = useMemo(() => {
    let pending = 0, paid = 0;
    for (const r of rows) {
      if (r.status === "pending" || r.status === "approved") pending += Number(r.amount);
      if (r.status === "paid") paid += Number(r.amount);
    }
    return { pending, paid };
  }, [rows]);

  const affMap = useMemo(() => {
    const m: Record<string, AffiliateMini> = {};
    for (const a of affiliates) m[a.id] = a;
    return m;
  }, [affiliates]);

  const filtered = useMemo(() => {
    let list = rows;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => {
        const a = affMap[r.affiliate_id];
        return (
          r.payout_number.toLowerCase().includes(q) ||
          a?.full_name.toLowerCase().includes(q) ||
          a?.affiliate_code.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [rows, statusFilter, search, affMap]);

  const resetCreate = () => {
    setFAffiliate("");
    setFAmount("");
    setFLeadCount("");
    setFMethod("bank_transfer");
    setFNotes("");
  };

  const createPayout = async () => {
    if (!fAffiliate || !fAmount) {
      toast({ title: "กรุณากรอกข้อมูลให้ครบ", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payoutNumber = `PO-AF-${format(new Date(), "yyyyMMdd-HHmmss")}`;
    const { error } = await (supabase.from as any)("affiliate_payouts").insert({
      affiliate_id: fAffiliate,
      payout_number: payoutNumber,
      period_start: fStart,
      period_end: fEnd,
      amount: Number(fAmount),
      lead_count: Number(fLeadCount || 0),
      payment_method: fMethod,
      notes: fNotes || null,
      created_by: user?.id || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: "สร้างไม่สำเร็จ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "สร้างรายการจ่ายเรียบร้อย" });
    setCreateOpen(false);
    resetCreate();
    load();
  };

  const updateStatus = async (
    row: PayoutRow,
    newStatus: "approved" | "paid" | "cancelled",
    reference?: string,
  ) => {
    const update: any = { status: newStatus };
    if (newStatus === "approved") {
      update.approved_at = new Date().toISOString();
      update.approved_by = user?.id;
    }
    if (newStatus === "paid") {
      update.paid_at = new Date().toISOString();
      update.paid_by = user?.id;
      if (reference) update.payment_reference = reference;
    }
    const { error } = await (supabase.from as any)("affiliate_payouts").update(update).eq("id", row.id);
    if (error) {
      toast({ title: "อัปเดตไม่สำเร็จ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `อัปเดตเป็น ${newStatus}` });
    load();
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Affiliate Payouts | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Affiliate Payouts</h1>
            <p className="text-sm text-muted-foreground">
              จัดการการจ่ายค่าคอมมิชชันให้กับ Affiliate
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus size={14} /> สร้างรายการจ่าย
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard icon={Clock} label="รอดำเนินการ" value={counts.pending} accent="amber" />
          <MetricCard icon={BadgeCheck} label="อนุมัติแล้ว (รอจ่าย)" value={counts.approved} accent="blue" />
          <MetricCard
            icon={Wallet}
            label="ยอดค้างจ่าย"
            value={`฿${totals.pending.toLocaleString("th-TH")}`}
            accent="amber"
          />
          <MetricCard
            icon={CheckCircle2}
            label="จ่ายแล้วสะสม"
            value={`฿${totals.paid.toLocaleString("th-TH")}`}
            accent="emerald"
          />
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <TabsList>
                  <TabsTrigger value="all">ทั้งหมด ({counts.all})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
                  <TabsTrigger value="paid">Paid ({counts.paid})</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled ({counts.cancelled})</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหา เลขที่ / ชื่อ / code..."
                  className="pl-8"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">ไม่พบรายการ</div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลขที่</TableHead>
                      <TableHead>Affiliate</TableHead>
                      <TableHead>ช่วงเวลา</TableHead>
                      <TableHead className="text-right">Leads</TableHead>
                      <TableHead className="text-right">จำนวนเงิน</TableHead>
                      <TableHead>วิธีจ่าย</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => {
                      const a = affMap[r.affiliate_id];
                      const Icon = statusIcon[r.status] || Clock;
                      return (
                        <TableRow key={r.id} className="hover:bg-muted/40">
                          <TableCell className="font-mono text-xs">{r.payout_number}</TableCell>
                          <TableCell>
                            {a ? (
                              <Link
                                to={`/admin/affiliates/${r.affiliate_id}`}
                                className="hover:text-primary"
                              >
                                <div className="font-medium text-sm">{a.full_name}</div>
                                <div className="text-xs text-muted-foreground font-mono">@{a.affiliate_code}</div>
                              </Link>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap">
                            {format(new Date(r.period_start), "d MMM")} – {format(new Date(r.period_end), "d MMM yy")}
                          </TableCell>
                          <TableCell className="text-right text-sm">{r.lead_count}</TableCell>
                          <TableCell className="text-right text-sm font-semibold">
                            ฿{Number(r.amount).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-xs">{r.payment_method}</TableCell>
                          <TableCell>
                            <Badge className={statusColor[r.status] || ""} variant="secondary">
                              <Icon size={10} className="mr-1" />
                              {r.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {r.status === "pending" && (
                              <Button size="sm" variant="ghost" onClick={() => updateStatus(r, "approved")}>
                                อนุมัติ
                              </Button>
                            )}
                            {r.status === "approved" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const ref = window.prompt("เลขอ้างอิงการโอน (optional)") || "";
                                  updateStatus(r, "paid", ref);
                                }}
                              >
                                บันทึกการจ่าย
                              </Button>
                            )}
                            {(r.status === "pending" || r.status === "approved") && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                                onClick={() => {
                                  if (confirm("ยกเลิกรายการนี้?")) updateStatus(r, "cancelled");
                                }}
                              >
                                ยกเลิก
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สร้างรายการจ่ายค่าคอมมิชชัน</DialogTitle>
            <DialogDescription>เลือก Affiliate และระบุยอดที่จะจ่าย</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Affiliate (เฉพาะที่อนุมัติแล้ว)</label>
              <Select value={fAffiliate} onValueChange={setFAffiliate}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือก Affiliate" />
                </SelectTrigger>
                <SelectContent>
                  {affiliates.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.full_name} (@{a.affiliate_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {fAffiliate && affMap[fAffiliate] && (
              <div className="text-xs bg-muted/40 rounded p-2 space-y-0.5">
                <div className="font-medium">ข้อมูลบัญชีรับเงิน:</div>
                <div>ธนาคาร: {affMap[fAffiliate].bank_name || "—"}</div>
                <div>เลขบัญชี: {affMap[fAffiliate].bank_account_number || "—"}</div>
                <div>ชื่อบัญชี: {affMap[fAffiliate].bank_account_name || "—"}</div>
                <div>PromptPay: {affMap[fAffiliate].promptpay_id || "—"}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Period start</label>
                <Input type="date" value={fStart} onChange={(e) => setFStart(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Period end</label>
                <Input type="date" value={fEnd} onChange={(e) => setFEnd(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">จำนวนเงิน (฿)</label>
                <Input
                  type="number"
                  value={fAmount}
                  onChange={(e) => setFAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">จำนวน Leads</label>
                <Input
                  type="number"
                  value={fLeadCount}
                  onChange={(e) => setFLeadCount(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">วิธีจ่าย</label>
              <Select value={fMethod} onValueChange={setFMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">โอนธนาคาร</SelectItem>
                  <SelectItem value="promptpay">PromptPay</SelectItem>
                  <SelectItem value="cash">เงินสด</SelectItem>
                  <SelectItem value="other">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">โน้ต</label>
              <Input value={fNotes} onChange={(e) => setFNotes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={saving}>
              ยกเลิก
            </Button>
            <Button onClick={createPayout} disabled={saving || !fAffiliate || !fAmount}>
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
              สร้างรายการ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string | number;
  accent: "amber" | "emerald" | "blue" | "primary";
}) {
  const map: Record<string, string> = {
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    primary: "bg-primary/10 text-primary",
  };
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${map[accent]}`}>
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-lg font-bold truncate">{value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

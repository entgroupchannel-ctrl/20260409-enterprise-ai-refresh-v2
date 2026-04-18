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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Search, ExternalLink, Download, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/layouts/AdminLayout";
import AffiliateTabsBar from "@/components/admin/affiliate/AffiliateTabsBar";
import { format } from "date-fns";

type StatusFilter = "all" | "new" | "qualified" | "converted" | "rejected";

interface LeadRow {
  id: string;
  affiliate_id: string;
  affiliate_code: string;
  source_type: string;
  status: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_company: string | null;
  deal_value: number | null;
  notes: string | null;
  created_at: string;
  qualified_at: string | null;
  converted_at: string | null;
  rejected_reason: string | null;
}

interface AffiliateMini {
  id: string;
  full_name: string;
  affiliate_code: string;
}

const statusColor: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  qualified: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  converted: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rejected: "bg-destructive/15 text-destructive",
};

export default function AdminAffiliateLeads() {
  const { toast } = useToast();
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateMini[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [affiliateFilter, setAffiliateFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<LeadRow | null>(null);
  const [editStatus, setEditStatus] = useState("new");
  const [editDealValue, setEditDealValue] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editRejected, setEditRejected] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: leadsData }, { data: affData }] = await Promise.all([
      supabase
        .from("affiliate_leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("affiliates")
        .select("id, full_name, affiliate_code")
        .order("full_name"),
    ]);
    setRows((leadsData as LeadRow[]) || []);
    setAffiliates((affData as AffiliateMini[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const c = { all: rows.length, new: 0, qualified: 0, converted: 0, rejected: 0 };
    for (const r of rows) if (r.status in c) (c as any)[r.status]++;
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (affiliateFilter !== "all") list = list.filter((r) => r.affiliate_id === affiliateFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.customer_name?.toLowerCase().includes(q) ||
          r.customer_email?.toLowerCase().includes(q) ||
          r.customer_company?.toLowerCase().includes(q) ||
          r.affiliate_code.toLowerCase().includes(q),
      );
    }
    return list;
  }, [rows, statusFilter, affiliateFilter, search]);

  const totalDeal = rows
    .filter((r) => r.status === "converted")
    .reduce((s, r) => s + Number(r.deal_value || 0), 0);

  const openEdit = (r: LeadRow) => {
    setEditing(r);
    setEditStatus(r.status);
    setEditDealValue(r.deal_value ? String(r.deal_value) : "");
    setEditNotes(r.notes || "");
    setEditRejected(r.rejected_reason || "");
  };

  const saveLead = async () => {
    if (!editing) return;
    setSaving(true);
    const now = new Date().toISOString();
    const update: any = {
      status: editStatus,
      deal_value: editDealValue ? Number(editDealValue) : null,
      notes: editNotes || null,
      rejected_reason: editStatus === "rejected" ? editRejected || null : null,
    };
    if (editStatus === "qualified" && !editing.qualified_at) update.qualified_at = now;
    if (editStatus === "converted" && !editing.converted_at) update.converted_at = now;

    const { error } = await supabase.from("affiliate_leads").update(update).eq("id", editing.id);
    setSaving(false);
    if (error) {
      toast({ title: "บันทึกไม่สำเร็จ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "บันทึกเรียบร้อย" });
    setEditing(null);
    load();
  };

  const exportCSV = () => {
    const headers = ["created_at", "affiliate_code", "customer_name", "customer_email", "customer_company", "source_type", "status", "deal_value"];
    const lines = [headers.join(",")];
    for (const r of filtered) {
      lines.push([
        r.created_at,
        r.affiliate_code,
        r.customer_name || "",
        r.customer_email || "",
        r.customer_company || "",
        r.source_type,
        r.status,
        r.deal_value || 0,
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `affiliate-leads-${format(new Date(), "yyyyMMdd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Affiliate Leads | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <AffiliateTabsBar />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Affiliate Leads</h1>
            <p className="text-sm text-muted-foreground">
              จัดการ Lead ที่เข้ามาผ่านลิงก์ Affiliate รวมศูนย์
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV} disabled={filtered.length === 0}>
            <Download size={14} /> Export CSV
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MiniMetric label="Leads ทั้งหมด" value={counts.all} />
          <MiniMetric label="New" value={counts.new} accent="blue" />
          <MiniMetric label="Converted" value={counts.converted} accent="emerald" />
          <MiniMetric
            label="Deal Value (closed)"
            value={`฿${totalDeal.toLocaleString("th-TH")}`}
            accent="primary"
          />
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <TabsList>
                  <TabsTrigger value="all">ทั้งหมด ({counts.all})</TabsTrigger>
                  <TabsTrigger value="new">New ({counts.new})</TabsTrigger>
                  <TabsTrigger value="qualified">Qualified ({counts.qualified})</TabsTrigger>
                  <TabsTrigger value="converted">Converted ({counts.converted})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex gap-2 flex-wrap">
                <Select value={affiliateFilter} onValueChange={setAffiliateFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="ทุก Affiliate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุก Affiliate</SelectItem>
                    {affiliates.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.full_name} (@{a.affiliate_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหา ลูกค้า/บริษัท/code..."
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">ไม่พบ Lead</div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>วันที่</TableHead>
                      <TableHead>ลูกค้า</TableHead>
                      <TableHead>บริษัท</TableHead>
                      <TableHead>Affiliate</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Deal Value</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id} className="hover:bg-muted/40">
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(r.created_at), "d MMM yy")}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{r.customer_name || "—"}</div>
                          <div className="text-xs text-muted-foreground">{r.customer_email || ""}</div>
                        </TableCell>
                        <TableCell className="text-sm">{r.customer_company || "—"}</TableCell>
                        <TableCell>
                          <Link
                            to={`/admin/affiliates/${r.affiliate_id}`}
                            className="text-primary hover:underline text-xs font-mono inline-flex items-center gap-1"
                          >
                            @{r.affiliate_code} <ExternalLink size={10} />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{r.source_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColor[r.status] || ""} variant="secondary">
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {r.deal_value ? `฿${Number(r.deal_value).toLocaleString("th-TH")}` : "—"}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>
                            จัดการ
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>จัดการ Lead</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="text-sm">
                <div className="font-medium">{editing.customer_name || "(ไม่ระบุชื่อ)"}</div>
                <div className="text-xs text-muted-foreground">{editing.customer_email}</div>
                <div className="text-xs text-muted-foreground">{editing.customer_company}</div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">สถานะ</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">new</SelectItem>
                    <SelectItem value="qualified">qualified</SelectItem>
                    <SelectItem value="converted">converted</SelectItem>
                    <SelectItem value="rejected">rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editStatus === "converted" && (
                <div>
                  <label className="text-xs text-muted-foreground">มูลค่า Deal (บาท)</label>
                  <Input
                    type="number"
                    value={editDealValue}
                    onChange={(e) => setEditDealValue(e.target.value)}
                    placeholder="0"
                  />
                </div>
              )}

              {editStatus === "rejected" && (
                <div>
                  <label className="text-xs text-muted-foreground">เหตุผลที่ปฏิเสธ</label>
                  <Input value={editRejected} onChange={(e) => setEditRejected(e.target.value)} />
                </div>
              )}

              <div>
                <label className="text-xs text-muted-foreground">โน้ตภายใน</label>
                <Input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>
              ยกเลิก
            </Button>
            <Button onClick={saveLead} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function MiniMetric({
  label,
  value,
  accent = "muted",
}: {
  label: string;
  value: string | number;
  accent?: "muted" | "blue" | "emerald" | "primary";
}) {
  const map: Record<string, string> = {
    muted: "text-foreground",
    blue: "text-blue-600 dark:text-blue-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    primary: "text-primary",
  };
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`text-lg font-bold mt-1 ${map[accent]}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

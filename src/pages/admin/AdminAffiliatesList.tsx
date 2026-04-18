import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, ExternalLink, Users, Award, TrendingUp, Clock, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/layouts/AdminLayout";
import { format } from "date-fns";

type Status = "all" | "pending" | "approved" | "rejected" | "suspended";
type SortKey = "newest" | "oldest" | "revenue" | "leads" | "name";

interface Row {
  id: string;
  affiliate_code: string;
  full_name: string;
  email: string;
  phone: string | null;
  current_company: string | null;
  current_position: string | null;
  linkedin_url: string;
  tier: string;
  status: string;
  total_leads: number;
  total_qualified_leads: number;
  total_closed_sales: number;
  total_revenue_generated: number;
  total_commission_earned: number;
  created_at: string;
  approved_at: string | null;
}

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rejected: "bg-destructive/15 text-destructive",
  suspended: "bg-muted text-muted-foreground",
};

const tierColor: Record<string, string> = {
  bronze: "bg-amber-700/15 text-amber-800 dark:text-amber-400",
  silver: "bg-slate-400/15 text-slate-700 dark:text-slate-300",
  gold: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  platinum: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
};

export default function AdminAffiliatesList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>("pending");
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("affiliates")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setRows(data as Row[]);
    setLoading(false);
  };

  const counts = useMemo(() => {
    const c = { all: rows.length, pending: 0, approved: 0, rejected: 0, suspended: 0 };
    for (const r of rows) {
      if (r.status in c) (c as any)[r.status]++;
    }
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (status !== "all") list = list.filter((r) => r.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.full_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.affiliate_code.toLowerCase().includes(q) ||
          r.current_company?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [rows, status, search]);

  const totalRevenue = rows.reduce((sum, r) => sum + Number(r.total_revenue_generated || 0), 0);
  const totalCommission = rows.reduce((sum, r) => sum + Number(r.total_commission_earned || 0), 0);
  const approvedCount = counts.approved;

  return (
    <AdminLayout>
      <Helmet>
        <title>Affiliates | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Affiliates</h1>
          <p className="text-sm text-muted-foreground">
            จัดการใบสมัคร Affiliate และอนุมัติพันธมิตรใหม่
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard icon={Clock} label="รออนุมัติ" value={counts.pending} accent="amber" />
          <MetricCard icon={Users} label="Active Affiliates" value={approvedCount} accent="emerald" />
          <MetricCard
            icon={TrendingUp}
            label="Revenue ที่นำมา"
            value={`฿${totalRevenue.toLocaleString("th-TH")}`}
            accent="primary"
          />
          <MetricCard
            icon={Award}
            label="ค่าคอมรวม (สะสม)"
            value={`฿${totalCommission.toLocaleString("th-TH")}`}
            accent="violet"
          />
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <Tabs value={status} onValueChange={(v) => setStatus(v as Status)}>
                <TabsList>
                  <TabsTrigger value="pending">รออนุมัติ ({counts.pending})</TabsTrigger>
                  <TabsTrigger value="approved">อนุมัติแล้ว ({counts.approved})</TabsTrigger>
                  <TabsTrigger value="rejected">ปฏิเสธ ({counts.rejected})</TabsTrigger>
                  <TabsTrigger value="suspended">ระงับ ({counts.suspended})</TabsTrigger>
                  <TabsTrigger value="all">ทั้งหมด ({counts.all})</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหา ชื่อ / อีเมล / code..."
                  className="pl-8"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                ไม่พบข้อมูล
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Affiliate</TableHead>
                      <TableHead>Company / Position</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Leads</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id} className="hover:bg-muted/40">
                        <TableCell>
                          <Link to={`/admin/affiliates/${r.id}`} className="block">
                            <div className="font-medium">{r.full_name}</div>
                            <div className="text-xs text-muted-foreground">{r.email}</div>
                            <div className="text-xs text-primary font-mono mt-0.5">@{r.affiliate_code}</div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>{r.current_company || "—"}</div>
                          <div className="text-xs text-muted-foreground">{r.current_position || ""}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={tierColor[r.tier] || ""} variant="secondary">
                            {r.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColor[r.status] || ""} variant="secondary">
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {r.total_qualified_leads}/{r.total_leads}
                        </TableCell>
                        <TableCell className="text-right text-sm">{r.total_closed_sales}</TableCell>
                        <TableCell className="text-right text-sm">
                          ฿{Number(r.total_revenue_generated || 0).toLocaleString("th-TH")}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(r.created_at), "d MMM yy")}
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/admin/affiliates/${r.id}`}
                            className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                          >
                            ดู <ExternalLink size={12} />
                          </Link>
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
    </AdminLayout>
  );
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string | number;
  accent: "amber" | "emerald" | "primary" | "violet";
}) => {
  const accentClasses: Record<string, string> = {
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    primary: "bg-primary/10 text-primary",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  };
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentClasses[accent]}`}>
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
};

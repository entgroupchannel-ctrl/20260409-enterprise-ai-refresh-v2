/**
 * Admin — Partner Applications List
 * Reviewers see all applications; filter by status/country; sort by score.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, Building2, MapPin, Star, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/layouts/AdminLayout";

type Status = "all" | "draft" | "submitted" | "reviewing" | "approved" | "rejected" | "on_hold";

interface Row {
  id: string;
  application_number: string | null;
  company_name_en: string | null;
  company_name_local: string | null;
  country: string | null;
  city: string | null;
  contact_name: string | null;
  contact_email: string | null;
  product_categories: string[] | null;
  status: string;
  current_stage: number;
  auto_score: number | null;
  manual_score: number | null;
  submitted_at: string | null;
  created_at: string;
}

const statusColor: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  reviewing: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rejected: "bg-destructive/15 text-destructive",
  on_hold: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
};

export default function AdminPartnerApplications() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("partner_applications")
        .select("id, application_number, company_name_en, company_name_local, country, city, contact_name, contact_email, product_categories, status, current_stage, auto_score, manual_score, submitted_at, created_at")
        .order("submitted_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (error) {
        toast({ title: "โหลดข้อมูลล้มเหลว", description: error.message, variant: "destructive" });
      } else {
        setRows((data ?? []) as Row[]);
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [toast]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length, draft: 0, submitted: 0, reviewing: 0, approved: 0, rejected: 0, on_hold: 0 };
    rows.forEach((r) => { c[r.status] = (c[r.status] ?? 0) + 1; });
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!q) return true;
      return (
        (r.company_name_en ?? "").toLowerCase().includes(q) ||
        (r.company_name_local ?? "").toLowerCase().includes(q) ||
        (r.contact_email ?? "").toLowerCase().includes(q) ||
        (r.application_number ?? "").toLowerCase().includes(q) ||
        (r.country ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, status, search]);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6 admin-content-area">
        <Helmet><title>Partner Applications | Admin</title></Helmet>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Partner Applications</h1>
          <p className="text-muted-foreground text-sm mt-1">รายการสมัคร Chinese Factory Partners — คัดกรอง / ให้คะแนน / อนุมัติ</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/partner" target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-2" />ดูหน้า Landing</a>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">กรอง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={status} onValueChange={(v) => setStatus(v as Status)}>
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">ทั้งหมด ({counts.all})</TabsTrigger>
              <TabsTrigger value="submitted">ส่งใหม่ ({counts.submitted ?? 0})</TabsTrigger>
              <TabsTrigger value="reviewing">กำลังพิจารณา ({counts.reviewing ?? 0})</TabsTrigger>
              <TabsTrigger value="on_hold">พักไว้ ({counts.on_hold ?? 0})</TabsTrigger>
              <TabsTrigger value="approved">อนุมัติ ({counts.approved ?? 0})</TabsTrigger>
              <TabsTrigger value="rejected">ปฏิเสธ ({counts.rejected ?? 0})</TabsTrigger>
              <TabsTrigger value="draft">ร่าง ({counts.draft ?? 0})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="ค้นหาชื่อบริษัท / อีเมล / เลขที่..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin inline" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">ไม่มีรายการตรงกับเงื่อนไข</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เลขที่ / บริษัท</TableHead>
                  <TableHead>ประเทศ</TableHead>
                  <TableHead>ผู้ติดต่อ</TableHead>
                  <TableHead>หมวดสินค้า</TableHead>
                  <TableHead className="text-center">คะแนน</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const score = r.manual_score ?? r.auto_score;
                  return (
                    <TableRow key={r.id} className="cursor-pointer hover:bg-muted/40" onClick={() => window.location.assign(`/admin/partners/${r.id}`)}>
                      <TableCell>
                        <div className="font-medium flex items-center gap-2"><Building2 className="w-4 h-4 text-muted-foreground" />{r.company_name_en || r.company_name_local || "—"}</div>
                        <div className="text-xs text-muted-foreground mt-1">{r.application_number ?? `(stage ${r.current_stage}/5)`}</div>
                      </TableCell>
                      <TableCell><span className="inline-flex items-center gap-1 text-sm"><MapPin className="w-3 h-3" />{r.country ?? "—"}{r.city ? `, ${r.city}` : ""}</span></TableCell>
                      <TableCell>
                        <div className="text-sm">{r.contact_name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{r.contact_email ?? ""}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {(r.product_categories ?? []).slice(0, 2).join(", ") || "—"}
                        {(r.product_categories?.length ?? 0) > 2 && <span className="text-muted-foreground"> +{(r.product_categories!.length - 2)}</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {score != null ? (
                          <span className="inline-flex items-center gap-1 font-semibold"><Star className="w-3 h-3 fill-amber-500 text-amber-500" />{score}</span>
                        ) : <span className="text-muted-foreground text-xs">—</span>}
                      </TableCell>
                      <TableCell><Badge variant="outline" className={statusColor[r.status] ?? ""}>{r.status}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {(r.submitted_at ? new Date(r.submitted_at) : new Date(r.created_at)).toLocaleDateString("th-TH")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

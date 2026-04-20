import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import SiteNavbar from "@/components/SiteNavbar";
import FooterCompact from "@/components/FooterCompact";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2, MousePointerClick, Users, CheckCircle2, Wallet,
  LayoutDashboard, Link2, BarChart3, UserCog, Megaphone,
} from "lucide-react";
import LinkBuilderTab from "@/components/affiliate/LinkBuilderTab";
import AnalyticsTab from "@/components/affiliate/AnalyticsTab";
import AccountTab from "@/components/affiliate/AccountTab";
import CampaignsTab from "@/components/affiliate/CampaignsTab";
import EarningsCard from "@/components/affiliate/EarningsCard";

interface Affiliate {
  id: string;
  affiliate_code: string;
  full_name: string;
  email: string;
  status: string;
  tier: string;
}

interface Stats {
  total_clicks: number;
  clicks_30d: number;
  total_leads: number;
  qualified_leads: number;
  converted_leads: number;
  total_deal_value: number;
}

interface LeadRow {
  id: string;
  created_at: string;
  source_type: string;
  status: string;
  customer_name: string | null;
  customer_company: string | null;
  deal_value: number | null;
}

export default function AffiliateDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login?redirect=/affiliate/dashboard");
      return;
    }
    (async () => {
      try {
        const { data: aff, error: affErr } = await (supabase.from as any)("affiliates")
          .select("id, affiliate_code, full_name, email, status, tier")
          .eq("user_id", user.id)
          .maybeSingle();
        if (affErr) throw affErr;

        if (!aff) {
          setAffiliate(null);
          setLoading(false);
          return;
        }
        setAffiliate(aff);

        const [{ data: statsData }, { data: leadsData }] = await Promise.all([
          (supabase.rpc as any)("affiliate_my_stats"),
          (supabase.from as any)("affiliate_leads")
            .select("id, created_at, source_type, status, customer_name, customer_company, deal_value")
            .eq("affiliate_id", aff.id)
            .order("created_at", { ascending: false })
            .limit(50),
        ]);

        if (statsData && statsData.length > 0) setStats(statsData[0]);
        setLeads(leadsData || []);
      } catch (err: any) {
        toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading, navigate, toast]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <FooterCompact />
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteNavbar />
        <div className="flex-1 container mx-auto px-4 py-16 max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-3">คุณยังไม่ได้เป็น Affiliate</h1>
          <p className="text-muted-foreground mb-6">
            สมัครเป็น Affiliate Partner ของ ENT Group เพื่อเริ่มสร้างรายได้จากการแนะนำลูกค้า B2B
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link to="/affiliate/apply">สมัครเป็น Affiliate</Link></Button>
            <Button variant="outline" asChild><Link to="/affiliate">ดูรายละเอียดโปรแกรม</Link></Button>
          </div>
        </div>
        <FooterCompact />
      </div>
    );
  }

  const statusColor =
    affiliate.status === "approved" ? "default" :
    affiliate.status === "pending" ? "secondary" : "destructive";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNavbar />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              สวัสดี {affiliate.full_name} — รหัสของคุณ: <span className="font-mono font-semibold text-primary">{affiliate.affiliate_code}</span>
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant={statusColor as any}>{affiliate.status}</Badge>
            <Badge variant="outline">tier: {affiliate.tier}</Badge>
          </div>
        </div>

        {affiliate.status !== "approved" && (
          <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20 mb-6">
            <CardContent className="p-4 text-sm">
              บัญชีของคุณกำลังรอการอนุมัติ — ลิงก์อ้างอิงจะใช้งานเก็บคลิกได้ แต่ค่าคอมมิชชันจะเริ่มนับหลังอนุมัติ
            </CardContent>
          </Card>
        )}

        <Tabs value={tab} onValueChange={(v) => setSearchParams({ tab: v })}>
          <TabsList className="grid grid-cols-3 sm:grid-cols-5 w-full sm:w-auto mb-6">
            <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="w-4 h-4" /> ภาพรวม</TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-2"><Megaphone className="w-4 h-4" /> แคมเปญ</TabsTrigger>
            <TabsTrigger value="links" className="gap-2"><Link2 className="w-4 h-4" /> สร้างลิงก์</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="w-4 h-4" /> สถิติ</TabsTrigger>
            <TabsTrigger value="account" className="gap-2"><UserCog className="w-4 h-4" /> บัญชี</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EarningsCard />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={MousePointerClick} label="คลิกทั้งหมด" value={stats?.total_clicks ?? 0} sub={`${stats?.clicks_30d ?? 0} ใน 30 วัน`} />
              <StatCard icon={Users} label="Lead ที่ส่งต่อ" value={stats?.total_leads ?? 0} sub={`${stats?.qualified_leads ?? 0} qualified`} />
              <StatCard icon={CheckCircle2} label="ปิดการขาย" value={stats?.converted_leads ?? 0} sub="deals" />
              <StatCard
                icon={Wallet}
                label="ยอดขายรวม"
                value={`฿${(stats?.total_deal_value ?? 0).toLocaleString("th-TH")}`}
                sub="ที่ปิดได้"
              />
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Lead ล่าสุด ({leads.length})</h3>
                {leads.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    ยังไม่มี Lead — ไปที่แท็บ "สร้างลิงก์" เพื่อเริ่มแชร์
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b text-left text-xs text-muted-foreground">
                        <tr>
                          <th className="py-2 pr-3">วันที่</th>
                          <th className="py-2 pr-3">ลูกค้า</th>
                          <th className="py-2 pr-3">บริษัท</th>
                          <th className="py-2 pr-3">ประเภท</th>
                          <th className="py-2 pr-3">สถานะ</th>
                          <th className="py-2 pr-3 text-right">มูลค่า</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.slice(0, 15).map((l) => (
                          <tr key={l.id} className="border-b last:border-0">
                            <td className="py-2 pr-3 whitespace-nowrap text-xs">
                              {new Date(l.created_at).toLocaleDateString("th-TH")}
                            </td>
                            <td className="py-2 pr-3">{l.customer_name || "—"}</td>
                            <td className="py-2 pr-3">{l.customer_company || "—"}</td>
                            <td className="py-2 pr-3">
                              <Badge variant="outline" className="text-xs">{l.source_type}</Badge>
                            </td>
                            <td className="py-2 pr-3">
                              <Badge variant={l.status === "converted" ? "default" : "secondary"} className="text-xs">
                                {l.status}
                              </Badge>
                            </td>
                            <td className="py-2 pr-3 text-right">
                              {l.deal_value ? `฿${Number(l.deal_value).toLocaleString("th-TH")}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignsTab affiliateCode={affiliate.affiliate_code} />
          </TabsContent>

          <TabsContent value="links">
            <LinkBuilderTab affiliateCode={affiliate.affiliate_code} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab affiliateId={affiliate.id} />
          </TabsContent>

          <TabsContent value="account">
            <AccountTab affiliateId={affiliate.id} />
          </TabsContent>
        </Tabs>
      </div>

      <FooterCompact />
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, sub,
}: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          <Icon className="w-4 h-4" />
          {label}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

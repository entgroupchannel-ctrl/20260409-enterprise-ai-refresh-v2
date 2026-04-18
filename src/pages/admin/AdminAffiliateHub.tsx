import { useNavigate, useSearchParams } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutDashboard, Megaphone, Users, ClipboardList, DollarSign, ArrowRight } from "lucide-react";
import AffiliateCampaignsManager from "@/components/admin/affiliate/AffiliateCampaignsManager";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MousePointerClick, Award, CheckCircle2, Wallet } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <Icon className="w-4 h-4" /> {label}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function QuickLinkCard({ icon: Icon, title, desc, to, count }: any) {
  const navigate = useNavigate();
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(to)}>
      <CardContent className="p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold">{title}</h3>
            {count !== undefined && <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{count}</span>}
          </div>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
      </CardContent>
    </Card>
  );
}

function AffiliateOverview() {
  const [stats, setStats] = useState({ affiliates: 0, campaigns: 0, leads: 0, converted: 0, revenue: 0, pendingPayouts: 0 });
  useEffect(() => {
    (async () => {
      const [a, c, l, conv, rev, pp] = await Promise.all([
        (supabase.from as any)("affiliates").select("id", { count: "exact", head: true }).eq("status", "approved"),
        (supabase.from as any)("affiliate_campaigns").select("id", { count: "exact", head: true }).eq("is_active", true),
        (supabase.from as any)("affiliate_leads").select("id", { count: "exact", head: true }),
        (supabase.from as any)("affiliate_leads").select("id", { count: "exact", head: true }).eq("status", "converted"),
        (supabase.from as any)("affiliate_leads").select("deal_value").eq("status", "converted"),
        (supabase.from as any)("affiliate_payouts").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      const totalRev = (rev.data || []).reduce((s: number, r: any) => s + Number(r.deal_value || 0), 0);
      setStats({
        affiliates: a.count || 0,
        campaigns: c.count || 0,
        leads: l.count || 0,
        converted: conv.count || 0,
        revenue: totalRev,
        pendingPayouts: pp.count || 0,
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={Users} label="Affiliates" value={stats.affiliates} sub="approved" />
        <StatCard icon={Megaphone} label="Campaigns" value={stats.campaigns} sub="active" />
        <StatCard icon={MousePointerClick} label="Leads" value={stats.leads} />
        <StatCard icon={CheckCircle2} label="Converted" value={stats.converted} />
        <StatCard icon={Wallet} label="Revenue" value={`฿${stats.revenue.toLocaleString("th-TH")}`} sub="closed" />
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-primary" /> Flow ระบบ Affiliate (สรุป 6 ขั้น)
          </h3>
          <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
            <li><strong>สร้าง Campaign</strong> — Cart (สินค้า+ราคา) หรือ Quote Template</li>
            <li><strong>Affiliate share link</strong> — <code className="bg-muted px-1 rounded text-xs">/c/[slug]?ref=[code]</code></li>
            <li><strong>ลูกค้าคลิก</strong> — cookie 90 วัน + บันทึก click พร้อม campaign_id</li>
            <li><strong>ลูกค้ากดขอใบเสนอราคา</strong> — สร้าง lead ผูก campaign + affiliate</li>
            <li><strong>Admin อนุมัติ + ปิด PO</strong> — เปลี่ยนสถานะ lead เป็น converted</li>
            <li><strong>จ่ายค่าคอมฯ</strong> — สร้าง payout รายเดือน</li>
          </ol>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        <QuickLinkCard icon={Users} title="จัดการ Affiliates" desc="ดู/อนุมัติคนที่สมัครและจัดการ tier" to="/admin/affiliates" count={stats.affiliates} />
        <QuickLinkCard icon={ClipboardList} title="Leads" desc="ลีดจาก campaign — อนุมัติเพื่อให้ affiliate ได้คอมฯ" to="/admin/affiliate-leads" count={stats.leads} />
        <QuickLinkCard icon={DollarSign} title="Payouts" desc="สร้างและจ่ายค่าคอมมิชชันรายเดือน" to="/admin/affiliate-payouts" count={stats.pendingPayouts} />
        <QuickLinkCard icon={Megaphone} title="Campaigns" desc="สร้างตะกร้า/quote template ให้ affiliate ใช้แชร์" to="/admin/affiliate?tab=campaigns" count={stats.campaigns} />
      </div>
    </div>
  );
}

export default function AdminAffiliateHub() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "overview";
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="admin-content-area space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold">Affiliate Program</h1>
          <p className="text-sm text-muted-foreground mt-1">
            จัดการแคมเปญ, affiliate, ลีด และการจ่ายค่าคอมมิชชันในที่เดียว
          </p>
        </div>

        <Tabs value={tab} onValueChange={(v) => {
          if (v === "affiliates") return navigate("/admin/affiliates");
          if (v === "leads") return navigate("/admin/affiliate-leads");
          if (v === "payouts") return navigate("/admin/affiliate-payouts");
          setParams({ tab: v });
        }}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full sm:w-auto mb-4">
            <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="w-4 h-4" /> ภาพรวม</TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-2"><Megaphone className="w-4 h-4" /> Campaigns</TabsTrigger>
            <TabsTrigger value="affiliates" className="gap-2"><Users className="w-4 h-4" /> Affiliates</TabsTrigger>
            <TabsTrigger value="leads" className="gap-2"><ClipboardList className="w-4 h-4" /> Leads</TabsTrigger>
            <TabsTrigger value="payouts" className="gap-2"><DollarSign className="w-4 h-4" /> Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><AffiliateOverview /></TabsContent>
          <TabsContent value="campaigns"><AffiliateCampaignsManager /></TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

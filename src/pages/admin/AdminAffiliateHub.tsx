import { useSearchParams } from "react-router-dom";
import AdminPageLayout from "@/components/admin/AdminPageLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutDashboard, Megaphone, Users, ClipboardList, DollarSign } from "lucide-react";
import AdminAffiliatesList from "./AdminAffiliatesList";
import AdminAffiliateLeads from "./AdminAffiliateLeads";
import AdminAffiliatePayouts from "./AdminAffiliatePayouts";
import AffiliateCampaignsManager from "@/components/admin/affiliate/AffiliateCampaignsManager";
import { Card, CardContent } from "@/components/ui/card";
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

function AffiliateOverview() {
  const [stats, setStats] = useState({ affiliates: 0, campaigns: 0, leads: 0, converted: 0, revenue: 0 });
  useEffect(() => {
    (async () => {
      const [a, c, l, conv, rev] = await Promise.all([
        (supabase.from as any)("affiliates").select("id", { count: "exact", head: true }).eq("status", "approved"),
        (supabase.from as any)("affiliate_campaigns").select("id", { count: "exact", head: true }).eq("is_active", true),
        (supabase.from as any)("affiliate_leads").select("id", { count: "exact", head: true }),
        (supabase.from as any)("affiliate_leads").select("id", { count: "exact", head: true }).eq("status", "converted"),
        (supabase.from as any)("affiliate_leads").select("deal_value").eq("status", "converted"),
      ]);
      const totalRev = (rev.data || []).reduce((s: number, r: any) => s + Number(r.deal_value || 0), 0);
      setStats({
        affiliates: a.count || 0,
        campaigns: c.count || 0,
        leads: l.count || 0,
        converted: conv.count || 0,
        revenue: totalRev,
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
        <StatCard icon={Wallet} label="Revenue" value={`฿${stats.revenue.toLocaleString("th-TH")}`} sub="closed deals" />
      </div>

      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Flow ระบบ Affiliate (สรุป)</h3>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li><strong>Admin สร้าง Campaign</strong> — เลือก Cart (สินค้า+ราคา) หรือ Quote Template (ใบเสนอราคา draft)</li>
            <li><strong>Affiliate share link</strong> — <code className="bg-muted px-1 rounded">/c/[slug]?ref=[code]</code> ผ่าน social/chat</li>
            <li><strong>ลูกค้าคลิก</strong> — ระบบตั้ง cookie 90 วัน + บันทึก click พร้อม campaign_id</li>
            <li><strong>ลูกค้ากดขอใบเสนอราคา</strong> — สร้าง affiliate_lead ผูก campaign + affiliate</li>
            <li><strong>Admin อนุมัติ + ปิด PO</strong> — ตรวจสอบที่แท็บ "Leads" และเปลี่ยนสถานะเป็น converted</li>
            <li><strong>จ่ายค่าคอมฯ</strong> — สร้าง payout ที่แท็บ "Payouts" (รายเดือน)</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminAffiliateHub() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "overview";

  return (
    <AdminPageLayout title="Affiliate Program" description="จัดการแคมเปญ, affiliate, ลีด และการจ่ายค่าคอมมิชชันในที่เดียว">
      <Tabs value={tab} onValueChange={(v) => setParams({ tab: v })}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full sm:w-auto mb-4">
          <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="w-4 h-4" /> ภาพรวม</TabsTrigger>
          <TabsTrigger value="campaigns" className="gap-2"><Megaphone className="w-4 h-4" /> Campaigns</TabsTrigger>
          <TabsTrigger value="affiliates" className="gap-2"><Users className="w-4 h-4" /> Affiliates</TabsTrigger>
          <TabsTrigger value="leads" className="gap-2"><ClipboardList className="w-4 h-4" /> Leads</TabsTrigger>
          <TabsTrigger value="payouts" className="gap-2"><DollarSign className="w-4 h-4" /> Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><AffiliateOverview /></TabsContent>
        <TabsContent value="campaigns"><AffiliateCampaignsManager /></TabsContent>
        <TabsContent value="affiliates"><AdminAffiliatesList /></TabsContent>
        <TabsContent value="leads"><AdminAffiliateLeads /></TabsContent>
        <TabsContent value="payouts"><AdminAffiliatePayouts /></TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
}

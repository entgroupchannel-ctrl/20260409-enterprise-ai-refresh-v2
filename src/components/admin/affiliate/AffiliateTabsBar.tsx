import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Megaphone, Users, ClipboardList, DollarSign } from "lucide-react";

export default function AffiliateTabsBar() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const params = new URLSearchParams(search);
  const tab = params.get("tab");

  let value = "overview";
  if (pathname.startsWith("/admin/affiliates")) value = "affiliates";
  else if (pathname.startsWith("/admin/affiliate-leads")) value = "leads";
  else if (pathname.startsWith("/admin/affiliate-payouts")) value = "payouts";
  else if (pathname.startsWith("/admin/affiliate")) value = tab === "campaigns" ? "campaigns" : "overview";

  const handleChange = (v: string) => {
    if (v === "affiliates") navigate("/admin/affiliates");
    else if (v === "leads") navigate("/admin/affiliate-leads");
    else if (v === "payouts") navigate("/admin/affiliate-payouts");
    else if (v === "campaigns") navigate("/admin/affiliate?tab=campaigns");
    else navigate("/admin/affiliate");
  };

  return (
    <div className="space-y-1">
      <div>
        <h1 className="text-2xl font-bold">Affiliate Program</h1>
        <p className="text-sm text-muted-foreground">จัดการแคมเปญ, affiliate, ลีด และการจ่ายค่าคอมมิชชันในที่เดียว</p>
      </div>
      <Tabs value={value} onValueChange={handleChange}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full sm:w-auto mt-3">
          <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="w-4 h-4" /> ภาพรวม</TabsTrigger>
          <TabsTrigger value="campaigns" className="gap-2"><Megaphone className="w-4 h-4" /> Campaigns</TabsTrigger>
          <TabsTrigger value="affiliates" className="gap-2"><Users className="w-4 h-4" /> Affiliates</TabsTrigger>
          <TabsTrigger value="leads" className="gap-2"><ClipboardList className="w-4 h-4" /> Leads</TabsTrigger>
          <TabsTrigger value="payouts" className="gap-2"><DollarSign className="w-4 h-4" /> Payouts</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

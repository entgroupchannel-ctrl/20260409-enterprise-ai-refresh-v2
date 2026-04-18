import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, MousePointerClick, Target } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend,
} from "recharts";

interface Click {
  id: string;
  created_at: string;
  landing_path: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  converted_to_lead: boolean;
}

interface Lead {
  id: string;
  created_at: string;
  status: string;
  deal_value: number | null;
}

export default function AnalyticsTab({ affiliateId }: { affiliateId: string }) {
  const [loading, setLoading] = useState(true);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const sinceISO = since.toISOString();

      const [clicksRes, leadsRes] = await Promise.all([
        (supabase.from as any)("affiliate_clicks")
          .select("id, created_at, landing_path, utm_source, utm_campaign, converted_to_lead")
          .eq("affiliate_id", affiliateId)
          .gte("created_at", sinceISO)
          .order("created_at", { ascending: true })
          .limit(1000),
        (supabase.from as any)("affiliate_leads")
          .select("id, created_at, status, deal_value")
          .eq("affiliate_id", affiliateId)
          .gte("created_at", sinceISO)
          .order("created_at", { ascending: true })
          .limit(500),
      ]);

      setClicks(clicksRes.data || []);
      setLeads(leadsRes.data || []);
      setLoading(false);
    })();
  }, [affiliateId]);

  const dailyData = useMemo(() => {
    const map = new Map<string, { date: string; clicks: number; leads: number }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, { date: key.slice(5), clicks: 0, leads: 0 });
    }
    clicks.forEach(c => {
      const k = c.created_at.slice(0, 10);
      const e = map.get(k); if (e) e.clicks++;
    });
    leads.forEach(l => {
      const k = l.created_at.slice(0, 10);
      const e = map.get(k); if (e) e.leads++;
    });
    return Array.from(map.values());
  }, [clicks, leads]);

  const sourceData = useMemo(() => {
    const m = new Map<string, number>();
    clicks.forEach(c => {
      const s = c.utm_source || "direct";
      m.set(s, (m.get(s) || 0) + 1);
    });
    return Array.from(m.entries()).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [clicks]);

  const topPaths = useMemo(() => {
    const m = new Map<string, number>();
    clicks.forEach(c => {
      const p = c.landing_path || "/";
      m.set(p, (m.get(p) || 0) + 1);
    });
    return Array.from(m.entries()).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [clicks]);

  const conversionRate = clicks.length > 0 ? ((leads.length / clicks.length) * 100).toFixed(1) : "0.0";
  const totalDealValue = leads.reduce((sum, l) => sum + (Number(l.deal_value) || 0), 0);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat icon={MousePointerClick} label="คลิก 30 วัน" value={clicks.length} />
        <MiniStat icon={TrendingUp} label="Lead 30 วัน" value={leads.length} />
        <MiniStat icon={Target} label="Conversion Rate" value={`${conversionRate}%`} />
        <MiniStat icon={TrendingUp} label="ยอดขายรวม" value={`฿${totalDealValue.toLocaleString("th-TH")}`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">คลิก & Lead รายวัน (30 วัน)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="cl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ld" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fill="url(#cl)" name="Clicks" />
              <Area type="monotone" dataKey="leads" stroke="hsl(var(--secondary))" fill="url(#ld)" name="Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">แหล่งที่มา (UTM Source)</CardTitle></CardHeader>
          <CardContent>
            {sourceData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">ยังไม่มีข้อมูล</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sourceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                  <YAxis dataKey="source" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={80} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">หน้ายอดนิยม</CardTitle></CardHeader>
          <CardContent>
            {topPaths.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="space-y-1.5">
                {topPaths.map(p => (
                  <div key={p.path} className="flex items-center gap-2 text-sm">
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded flex-1 truncate">{p.path}</code>
                    <Badge variant="secondary">{p.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          <Icon className="w-4 h-4" />{label}
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

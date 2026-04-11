import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, CircleCheckBig, MessageSquareText, Timer, Trophy,
  Percent, BadgeDollarSign, CalendarClock,
} from 'lucide-react';

interface Stats {
  total_quotes: number;
  accepted_count: number;
  rejected_count: number;
  expired_count: number;
  negotiating_count: number;
  acceptance_rate: number;
  avg_revisions: number;
  avg_negotiation_rounds: number;
  avg_quote_value: number;
  total_won_value: number;
  avg_discount_given: number;
  max_discount_given: number;
  quotes_with_discount: number;
  avg_days_to_close: number;
}

interface TrendPoint {
  date: string;
  quotes_created: number;
  quotes_accepted: number;
  quotes_rejected: number;
  total_value: number;
}

interface SalesPerformer {
  sales_id: string;
  sales_name: string;
  total_revisions: number;
  quotes_handled: number;
  avg_discount: number;
  acceptance_rate: number;
  total_value: number;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency', currency: 'THB',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);

const formatCompact = (n: number) => {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `฿${(n / 1_000).toFixed(0)}K`;
  return formatCurrency(n);
};

export default function NegotiationAnalytics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [performers, setPerformers] = useState<SalesPerformer[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<30 | 90 | 365>(30);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - period);
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = new Date().toISOString().split('T')[0];

      const [statsRes, trendsRes, performersRes] = await Promise.all([
        supabase.rpc('get_negotiation_stats', {
          p_start_date: startStr,
          p_end_date: endStr,
        }),
        supabase.rpc('get_negotiation_trends', { p_days: period }),
        supabase.rpc('get_top_sales_performers', {
          p_limit: 10,
          p_start_date: startStr,
        }),
      ]);

      if (statsRes.data) setStats(statsRes.data as any);
      if (trendsRes.data) {
        setTrends(
          (trendsRes.data as any[]).map((t) => ({
            ...t,
            date: new Date(t.date).toLocaleDateString('th-TH', {
              month: 'short',
              day: 'numeric',
            }),
          }))
        );
      }
      if (performersRes.data) setPerformers(performersRes.data as SalesPerformer[]);
    } catch (e) {
      console.error('Error loading analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          กำลังโหลดข้อมูลสถิติ...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Period selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Negotiation Analytics
        </h2>
        <div className="flex gap-1">
          {([30, 90, 365] as const).map((d) => (
            <Button
              key={d}
              variant={period === d ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(d)}
            >
              {d === 30 ? '30 วัน' : d === 90 ? '90 วัน' : '1 ปี'}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards — 4 cols */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">ใบเสนอราคาทั้งหมด</p>
                <p className="text-2xl font-bold mt-1">{stats.total_quotes}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Acceptance Rate</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.acceptance_rate}%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stats.accepted_count} จาก {stats.total_quotes}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg. Revisions</p>
                <p className="text-2xl font-bold mt-1">{stats.avg_revisions}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ต่อรอง {stats.avg_negotiation_rounds} รอบ
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-amber-500/30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg. Days to Close</p>
                <p className="text-2xl font-bold mt-1">{stats.avg_days_to_close}</p>
                <p className="text-xs text-muted-foreground mt-0.5">วัน</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Won Value</p>
                <p className="text-lg font-bold">{formatCompact(stats.total_won_value)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Avg. Quote Value</p>
                <p className="text-lg font-bold">{formatCompact(stats.avg_quote_value)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Percent className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-xs text-muted-foreground">Avg. Discount Given</p>
                <p className="text-lg font-bold">{stats.avg_discount_given}%</p>
                <p className="text-xs text-muted-foreground">Max: {stats.max_discount_given}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs text-muted-foreground">In Negotiation</p>
                <p className="text-lg font-bold">{stats.negotiating_count}</p>
                <p className="text-xs text-muted-foreground">
                  Expired: {stats.expired_count}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">📈 Quote Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="quotes_created"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="สร้างใหม่"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="quotes_accepted"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="ยอมรับ"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="quotes_rejected"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="ปฏิเสธ"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Top Sales (Top 10)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {performers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                ยังไม่มีข้อมูล
              </p>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {performers.map((p, i) => (
                  <div
                    key={p.sales_id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted/50"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0 ? 'bg-amber-500 text-white' :
                      i === 1 ? 'bg-gray-400 text-white' :
                      i === 2 ? 'bg-amber-700 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.sales_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatCompact(p.total_value)}</span>
                        <span>•</span>
                        <span>{p.acceptance_rate}%</span>
                      </div>
                    </div>
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

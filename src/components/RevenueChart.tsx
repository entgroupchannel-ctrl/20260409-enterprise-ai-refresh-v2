import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, Minus, Calendar, Loader2,
  DollarSign, ShoppingCart,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/* ─── Types ─── */
type ViewMode = "week" | "month" | "quarter" | "year";

interface WeeklyRow {
  day_of_week: number;
  day_name: string;
  total_revenue: number;
  order_count: number;
}

interface MonthlyRow {
  month_num: number;
  month_name: string;
  total_revenue: number;
  order_count: number;
}

interface QuarterlyRow {
  quarter_num: number;
  quarter_label: string;
  total_revenue: number;
  order_count: number;
}

interface YearlyRow {
  year_num: number;
  year_label: string;
  total_revenue: number;
  order_count: number;
}

interface ChartPoint {
  label: string;
  current: number;
  previous?: number;
  count: number;
  prevCount?: number;
}

/* ─── Helpers ─── */
const fmtBaht = (n: number) => {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `฿${(n / 1_000).toFixed(1)}K`;
  return `฿${n.toFixed(0)}`;
};

const fmtFull = (n: number) =>
  n.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const calcGrowth = (curr: number, prev: number): number => {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
};

const CURRENT_YEAR = new Date().getFullYear();

const DAY_ORDER = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];

/* ─── Component ─── */
const RevenueChart = () => {
  const [mode, setMode] = useState<ViewMode>("month");
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [showYoY, setShowYoY] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["admin", "revenue", mode, year, showYoY, weekOffset],
    queryFn: async () => {
      if (mode === "week") {
        const { data } = await supabase.rpc("get_weekly_revenue", { _week_offset: weekOffset } as any);
        return {
          weekly: (data || []) as WeeklyRow[],
          monthly: [] as MonthlyRow[],
          monthlyPrev: [] as MonthlyRow[],
          quarterly: [] as QuarterlyRow[],
          quarterlyPrev: [] as QuarterlyRow[],
          yearly: [] as YearlyRow[],
        };
      } else if (mode === "month") {
        const [curr, prev] = await Promise.all([
          supabase.rpc("get_monthly_revenue", { _year: year }),
          showYoY ? supabase.rpc("get_monthly_revenue", { _year: year - 1 }) : Promise.resolve({ data: [] }),
        ]);
        return {
          weekly: [] as WeeklyRow[],
          monthly: (curr.data || []) as MonthlyRow[],
          monthlyPrev: (prev.data || []) as MonthlyRow[],
          quarterly: [] as QuarterlyRow[],
          quarterlyPrev: [] as QuarterlyRow[],
          yearly: [] as YearlyRow[],
        };
      } else if (mode === "quarter") {
        const [curr, prev] = await Promise.all([
          supabase.rpc("get_quarterly_revenue", { _year: year }),
          showYoY ? supabase.rpc("get_quarterly_revenue", { _year: year - 1 }) : Promise.resolve({ data: [] }),
        ]);
        return {
          weekly: [] as WeeklyRow[],
          monthly: [] as MonthlyRow[],
          monthlyPrev: [] as MonthlyRow[],
          quarterly: (curr.data || []) as QuarterlyRow[],
          quarterlyPrev: (prev.data || []) as QuarterlyRow[],
          yearly: [] as YearlyRow[],
        };
      } else {
        const { data } = await supabase.rpc("get_yearly_revenue", { _years_back: 5 });
        return {
          weekly: [] as WeeklyRow[],
          monthly: [] as MonthlyRow[],
          monthlyPrev: [] as MonthlyRow[],
          quarterly: [] as QuarterlyRow[],
          quarterlyPrev: [] as QuarterlyRow[],
          yearly: (data || []) as YearlyRow[],
        };
      }
    },
  });

  const weekly = data?.weekly ?? [];
  const monthly = data?.monthly ?? [];
  const monthlyPrev = data?.monthlyPrev ?? [];
  const quarterly = data?.quarterly ?? [];
  const quarterlyPrev = data?.quarterlyPrev ?? [];
  const yearly = data?.yearly ?? [];

  /* ─── Build chart data ─── */
  const chartData: ChartPoint[] = useMemo(() => {
    if (mode === "week") {
      return DAY_ORDER.map((dayName) => {
        const dayData = weekly.find((w) => w.day_name === dayName);
        return {
          label: dayName,
          current: dayData ? Number(dayData.total_revenue) || 0 : 0,
          count: dayData ? Number(dayData.order_count) || 0 : 0,
        };
      });
    }
    if (mode === "month") {
      return monthly.map((m) => {
        const prev = monthlyPrev.find((p) => p.month_num === m.month_num);
        return {
          label: m.month_name,
          current: Number(m.total_revenue) || 0,
          previous: prev ? Number(prev.total_revenue) || 0 : undefined,
          count: Number(m.order_count) || 0,
          prevCount: prev ? Number(prev.order_count) || 0 : undefined,
        };
      });
    }
    if (mode === "quarter") {
      return quarterly.map((q) => {
        const prev = quarterlyPrev.find((p) => p.quarter_num === q.quarter_num);
        return {
          label: `Q${q.quarter_num}`,
          current: Number(q.total_revenue) || 0,
          previous: prev ? Number(prev.total_revenue) || 0 : undefined,
          count: Number(q.order_count) || 0,
          prevCount: prev ? Number(prev.order_count) || 0 : undefined,
        };
      });
    }
    return yearly.map((y) => ({
      label: y.year_label,
      current: Number(y.total_revenue) || 0,
      count: Number(y.order_count) || 0,
    }));
  }, [mode, weekly, monthly, monthlyPrev, quarterly, quarterlyPrev, yearly]);

  /* ─── Stats ─── */
  const stats = useMemo(() => {
    const totalCurrent = chartData.reduce((s, d) => s + d.current, 0);
    const totalPrev = chartData.reduce((s, d) => s + (d.previous || 0), 0);
    const totalCount = chartData.reduce((s, d) => s + d.count, 0);
    const growth = calcGrowth(totalCurrent, totalPrev);
    const avgPerPeriod = chartData.length > 0 ? totalCurrent / chartData.length : 0;
    const bestPeriod = chartData.reduce(
      (best, curr) => (curr.current > (best?.current || 0) ? curr : best),
      null as ChartPoint | null
    );
    return { totalCurrent, totalPrev, totalCount, growth, avgPerPeriod, bestPeriod };
  }, [chartData]);

  /* ─── Week label ─── */
  const weekLabel = useMemo(() => {
    if (weekOffset === 0) return "สัปดาห์นี้";
    if (weekOffset === -1) return "สัปดาห์ก่อน";
    return `${Math.abs(weekOffset)} สัปดาห์ก่อน`;
  }, [weekOffset]);

  /* ─── Period label for stats ─── */
  const periodLabel = mode === "week" ? "วัน" : mode === "month" ? "เดือน" : mode === "quarter" ? "ไตรมาส" : "ปี";

  /* ─── Custom tooltip ─── */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const curr = payload.find((p: any) => p.dataKey === "current");
    const prev = payload.find((p: any) => p.dataKey === "previous");
    const point = payload[0]?.payload as ChartPoint;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-xs">
        <div className="font-bold text-foreground mb-1.5">{label}</div>
        {curr && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-sm bg-primary"></div>
            <span className="text-muted-foreground">{mode === "week" ? weekLabel : String(year)}:</span>
            <span className="font-bold text-foreground">฿{fmtFull(curr.value)}</span>
          </div>
        )}
        {prev && prev.value > 0 && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-sm bg-muted-foreground/40"></div>
            <span className="text-muted-foreground">{year - 1}:</span>
            <span className="font-bold text-muted-foreground">฿{fmtFull(prev.value)}</span>
          </div>
        )}
        {point?.count !== undefined && (
          <div className="text-[10px] text-muted-foreground mt-1 pt-1 border-t border-border">
            <ShoppingCart size={9} className="inline mr-1" />
            {point.count} ออเดอร์
            {point.prevCount !== undefined && ` (ปีก่อน ${point.prevCount})`}
          </div>
        )}
      </div>
    );
  };

  /* ─── Year selector options ─── */
  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = CURRENT_YEAR; y >= CURRENT_YEAR - 4; y--) years.push(y);
    return years;
  }, []);

  /* ─── Render ─── */
  return (
    <div className="card-surface rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <DollarSign size={16} className="text-primary" />
            กราฟรายได้
            {mode === "week" && <span className="text-muted-foreground font-normal"> · {weekLabel}</span>}
            {mode !== "year" && mode !== "week" && <span className="text-muted-foreground font-normal"> · {year}</span>}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {mode === "week" && "รายได้รายวัน (จันทร์–อาทิตย์)"}
            {mode === "month" && "รายได้รายเดือน"}
            {mode === "quarter" && "รายได้รายไตรมาส"}
            {mode === "year" && "รายได้รายปี (5 ปีล่าสุด)"}
            {showYoY && mode !== "year" && mode !== "week" && ` · เทียบกับปี ${year - 1}`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode toggle */}
          <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
            {([
              { v: "week", l: "รายสัปดาห์" },
              { v: "month", l: "รายเดือน" },
              { v: "quarter", l: "ไตรมาส" },
              { v: "year", l: "รายปี" },
            ] as const).map((m) => (
              <button
                key={m.v}
                onClick={() => setMode(m.v)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  mode === m.v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.l}
              </button>
            ))}
          </div>

          {/* Week selector */}
          {mode === "week" && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setWeekOffset(weekOffset - 1)}
                className="px-2 py-1.5 rounded-lg border border-border text-xs hover:bg-secondary"
              >
                ←
              </button>
              <span className="px-3 py-1.5 text-xs font-medium min-w-[100px] text-center">
                {weekLabel}
              </span>
              <button
                onClick={() => setWeekOffset(Math.min(0, weekOffset + 1))}
                disabled={weekOffset >= 0}
                className="px-2 py-1.5 rounded-lg border border-border text-xs hover:bg-secondary disabled:opacity-30"
              >
                →
              </button>
            </div>
          )}

          {/* Year selector */}
          {mode !== "year" && mode !== "week" && (
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none focus:border-primary"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}

          {/* YoY toggle */}
          {mode !== "year" && mode !== "week" && (
            <button
              onClick={() => setShowYoY(!showYoY)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                showYoY
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
              title="เทียบกับปีก่อนหน้า (Year-over-Year)"
            >
              YoY
            </button>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="rounded-xl border border-border bg-background/50 p-3">
          <div className="text-[10px] text-muted-foreground">รายได้รวม</div>
          <div className="text-lg font-bold text-foreground mt-0.5">{fmtBaht(stats.totalCurrent)}</div>
          {showYoY && stats.totalPrev > 0 && mode !== "year" && mode !== "week" && (
            <div className={`text-[10px] mt-1 flex items-center gap-1 ${
              stats.growth > 0 ? "text-green-500" : stats.growth < 0 ? "text-red-500" : "text-muted-foreground"
            }`}>
              {stats.growth > 0 ? <TrendingUp size={10} /> : stats.growth < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
              {stats.growth > 0 ? "+" : ""}{stats.growth.toFixed(1)}% YoY
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-background/50 p-3">
          <div className="text-[10px] text-muted-foreground">จำนวนออเดอร์</div>
          <div className="text-lg font-bold text-foreground mt-0.5">{stats.totalCount}</div>
          <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
            <ShoppingCart size={10} /> ออเดอร์
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/50 p-3">
          <div className="text-[10px] text-muted-foreground">เฉลี่ย/{periodLabel}</div>
          <div className="text-lg font-bold text-foreground mt-0.5">{fmtBaht(stats.avgPerPeriod)}</div>
        </div>

        <div className="rounded-xl border border-border bg-background/50 p-3">
          <div className="text-[10px] text-muted-foreground">{periodLabel}สูงสุด</div>
          <div className="text-lg font-bold text-foreground mt-0.5">
            {stats.bestPeriod ? fmtBaht(stats.bestPeriod.current) : "-"}
          </div>
          {stats.bestPeriod && (
            <div className="text-[10px] text-primary mt-1 flex items-center gap-1">
              <Calendar size={10} /> {stats.bestPeriod.label}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            <Loader2 size={20} className="animate-spin mr-2" /> กำลังโหลด...
          </div>
        ) : chartData.length === 0 || stats.totalCurrent === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
            <DollarSign size={32} className="opacity-30" />
            <p>ยังไม่มีข้อมูลรายได้</p>
            <p className="text-[10px]">ข้อมูลจะแสดงเมื่อมี Sales Order ที่อนุมัติแล้ว</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={fmtBaht}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
              {showYoY && mode !== "year" && mode !== "week" && (
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                  formatter={(value) => (value === "current" ? `ปี ${year}` : `ปี ${year - 1}`)}
                />
              )}
              {showYoY && mode !== "year" && mode !== "week" && (
                <Bar
                  dataKey="previous"
                  fill="hsl(var(--muted-foreground))"
                  fillOpacity={0.3}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={mode === "quarter" ? 80 : 40}
                />
              )}
              <Bar
                dataKey="current"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
                maxBarSize={mode === "week" ? 60 : mode === "quarter" ? 80 : 40}
              >
                {chartData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill="hsl(var(--primary))"
                    fillOpacity={entry.label === stats.bestPeriod?.label ? 1 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;

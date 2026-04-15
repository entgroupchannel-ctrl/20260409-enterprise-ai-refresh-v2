import { useEffect, useRef } from 'react';

declare const Chart: any;

const CHART_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';

function loadChartJS(): Promise<void> {
  return new Promise(resolve => {
    if (typeof Chart !== 'undefined') { resolve(); return; }
    const s = document.createElement('script');
    s.src = CHART_CDN;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

function useChart(id: string, builder: () => any, deps: any[]) {
  const chartRef = useRef<any>(null);
  useEffect(() => {
    loadChartJS().then(() => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (!canvas) return;
      chartRef.current?.destroy();
      chartRef.current = new Chart(canvas, builder());
    });
    return () => chartRef.current?.destroy();
  }, deps);
}

const COLORS = {
  blue:   '#378ADD', blueLight: '#85B7EB', bluePale: '#B5D4F4',
  green:  '#1D9E75', greenLight: '#5DCAA5',
  amber:  '#EF9F27', amberLight: '#FAC775',
  red:    '#E24B4A',
  purple: '#7F77DD',
  gray:   '#888780',
};

const baseOpts = (darkMode: boolean) => ({
  color:       darkMode ? '#c2c0b6' : '#5F5E5A',
  borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
});

function isDark() {
  return document.documentElement.classList.contains('dark') ||
         window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const tickFont = { family: '"Anthropic Sans", sans-serif', size: 11 };
const tooltipStyle = (dark: boolean) => ({
  backgroundColor: dark ? '#2C2C2A' : '#fff',
  titleColor:  dark ? '#E8E6DC' : '#2C2C2A',
  bodyColor:   dark ? '#B4B2A9' : '#5F5E5A',
  borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
  borderWidth: 1,
  padding: 10,
  cornerRadius: 8,
  displayColors: true,
  boxWidth: 10, boxHeight: 10,
});

/* ═══════════════════════════════════════════════════════════════
   1. Quote Status Donut  — Executive tab
   Data: execData.statusBreakdown (Record<string, number>)
═══════════════════════════════════════════════════════════════ */
export function QuoteStatusDonut({ statusBreakdown }: { statusBreakdown: Record<string, number> }) {
  const statusMeta: Record<string, { label: string; color: string }> = {
    pending:     { label: 'รอดำเนินการ', color: COLORS.amber },
    quote_sent:  { label: 'ส่งราคาแล้ว', color: COLORS.blue },
    in_review:   { label: 'กำลังตรวจสอบ', color: COLORS.purple },
    po_uploaded: { label: 'PO แนบแล้ว', color: COLORS.blueLight },
    completed:   { label: 'เสร็จสิ้น', color: COLORS.green },
    rejected:    { label: 'ปฏิเสธ', color: COLORS.red },
    cancelled:   { label: 'ยกเลิก', color: COLORS.gray },
    draft:       { label: 'ร่าง', color: '#B4B2A9' },
  };

  const entries = Object.entries(statusBreakdown).filter(([, v]) => v > 0);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  useChart('chart-quote-status', () => {
    const dark = isDark();
    const bo = baseOpts(dark);
    return {
      type: 'doughnut',
      data: {
        labels: entries.map(([k]) => statusMeta[k]?.label ?? k),
        datasets: [{
          data: entries.map(([, v]) => v),
          backgroundColor: entries.map(([k]) => statusMeta[k]?.color ?? COLORS.gray),
          borderWidth: 2,
          borderColor: dark ? '#2C2C2A' : '#fff',
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle(dark),
            callbacks: {
              label: (ctx: any) => ` ${ctx.label}: ${ctx.raw} (${Math.round((ctx.raw / total) * 100)}%)`,
            },
          },
        },
      },
    };
  }, [JSON.stringify(statusBreakdown)]);

  const entries2 = Object.entries(statusBreakdown).filter(([, v]) => v > 0);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
          <canvas id="chart-quote-status" role="img"
            aria-label={`Quote status breakdown: total ${total} quotes`}>
            {entries2.map(([k, v]) => `${statusMeta[k]?.label ?? k}: ${v}`).join(', ')}
          </canvas>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          }}>
            <span style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)' }}>{total}</span>
            <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>ทั้งหมด</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {entries2.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: statusMeta[k]?.color ?? COLORS.gray, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', flex: 1 }}>{statusMeta[k]?.label ?? k}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-primary)' }}>{v}</span>
              <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', width: 30, textAlign: 'right' }}>
                {Math.round((v / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. Revenue Trend Line  — Executive tab
   Data: array of { month: string; revenue: number } (last 8 months)
   Build this by grouping payment_records by month in loadExecData
═══════════════════════════════════════════════════════════════ */
export function RevenueTrendLine({ data }: { data: { month: string; revenue: number }[] }) {
  useChart('chart-revenue-trend', () => {
    const dark = isDark();
    return {
      type: 'line',
      data: {
        labels: data.map(d => d.month),
        datasets: [{
          label: 'รายรับ (฿)',
          data: data.map(d => d.revenue),
          borderColor: COLORS.green,
          backgroundColor: 'rgba(29,158,117,0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: COLORS.green,
          pointBorderColor: dark ? '#2C2C2A' : '#fff',
          pointBorderWidth: 2,
          borderWidth: 2.5,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle(dark),
            callbacks: {
              label: (ctx: any) => ` ฿${Math.round(ctx.raw).toLocaleString('en-US')}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: tickFont, color: dark ? '#888780' : '#5F5E5A', autoSkip: false },
            border: { display: false },
          },
          y: {
            grid: { color: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: {
              font: tickFont, color: dark ? '#888780' : '#5F5E5A',
              callback: (v: any) => v >= 1000000 ? `฿${Math.round(v/1000000)}M` : v >= 1000 ? `฿${Math.round(v/1000)}k` : `฿${v}`,
            },
            border: { display: false },
          },
        },
      },
    };
  }, [JSON.stringify(data)]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 200 }}>
      <canvas id="chart-revenue-trend" role="img"
        aria-label="Revenue trend over recent months">
        {data.map(d => `${d.month}: ฿${d.revenue.toLocaleString()}`).join(', ')}
      </canvas>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. Win/Loss Donut  — Sales tab
   Data: salesData.wonQuotes, .lostQuotes, remaining active
═══════════════════════════════════════════════════════════════ */
export function WinLossDonut({
  won, lost, active,
}: { won: number; lost: number; active: number }) {
  const total = won + lost + active;
  const winRate = total === 0 ? 0 : Math.round((won / total) * 100);

  useChart('chart-win-loss', () => {
    const dark = isDark();
    return {
      type: 'doughnut',
      data: {
        labels: ['ปิดได้', 'ไม่สำเร็จ', 'กำลังดำเนินการ'],
        datasets: [{
          data: [won, lost, active],
          backgroundColor: [COLORS.green, COLORS.red, COLORS.amber],
          borderWidth: 2,
          borderColor: dark ? '#2C2C2A' : '#fff',
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle(dark),
            callbacks: {
              label: (ctx: any) => ` ${ctx.label}: ${ctx.raw} (${Math.round((ctx.raw / total) * 100)}%)`,
            },
          },
        },
      },
    };
  }, [won, lost, active]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
        <canvas id="chart-win-loss" role="img"
          aria-label={`Win rate ${winRate}%, ${won} won, ${lost} lost, ${active} active`}>
          Won: {won}, Lost: {lost}, Active: {active}
        </canvas>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 18, fontWeight: 500, color: COLORS.green }}>{winRate}%</span>
          <span style={{ fontSize: 9, color: 'var(--color-text-secondary)' }}>Win rate</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {[
          { label: 'ปิดได้', value: won, color: COLORS.green },
          { label: 'ไม่สำเร็จ', value: lost, color: COLORS.red },
          { label: 'กำลังดำเนินการ', value: active, color: COLORS.amber },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: r.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', flex: 1 }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: 500 }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. Top Customers Horizontal Bar  — Sales tab
   Data: salesData.topCustomers [{ name, value }]
═══════════════════════════════════════════════════════════════ */
export function TopCustomersBar({ customers }: { customers: { name: string; company?: string; value: number }[] }) {
  const top = customers.slice(0, 7);
  const height = Math.max(200, top.length * 42 + 60);

  useChart('chart-top-customers', () => {
    const dark = isDark();
    return {
      type: 'bar',
      data: {
        labels: top.map(c => c.company || c.name),
        datasets: [{
          label: 'มูลค่า (THB)',
          data: top.map(c => c.value),
          backgroundColor: top.map((_, i) => {
            const alpha = 1 - i * 0.1;
            return `rgba(55,138,221,${Math.max(0.3, alpha)})`;
          }),
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle(dark),
            callbacks: {
              label: (ctx: any) => ` ฿${Math.round(ctx.raw).toLocaleString('en-US')}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: {
              font: tickFont, color: dark ? '#888780' : '#5F5E5A',
              callback: (v: any) => v >= 1000000 ? `${Math.round(v/1000000)}M` : v >= 1000 ? `${Math.round(v/1000)}k` : v,
            },
            border: { display: false },
          },
          y: {
            grid: { display: false },
            ticks: { font: tickFont, color: dark ? '#888780' : '#5F5E5A' },
            border: { display: false },
          },
        },
      },
    };
  }, [JSON.stringify(customers)]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <canvas id="chart-top-customers" role="img"
        aria-label="Top customers by deal value">
        {top.map(c => `${c.name}: ฿${c.value.toLocaleString()}`).join(', ')}
      </canvas>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. AR vs AP Grouped Bar  — Finance tab
   Data: array of { month, ar, ap } — build in loadFinanceData
   Group invoices.grand_total by month for AR
   Group purchase_orders.grand_total by month for AP
═══════════════════════════════════════════════════════════════ */
export function ArApGroupedBar({ data }: { data: { month: string; ar: number; ap: number }[] }) {
  useChart('chart-ar-ap', () => {
    const dark = isDark();
    return {
      type: 'bar',
      data: {
        labels: data.map(d => d.month),
        datasets: [
          {
            label: 'AR ค้างรับ (฿)',
            data: data.map(d => d.ar),
            backgroundColor: COLORS.blue,
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'AP ค้างจ่าย ($→฿)',
            data: data.map(d => d.ap),
            backgroundColor: COLORS.amber,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle(dark),
            callbacks: {
              label: (ctx: any) => ` ${ctx.dataset.label}: ฿${Math.round(ctx.raw).toLocaleString('en-US')}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: tickFont, color: dark ? '#888780' : '#5F5E5A', autoSkip: false, maxRotation: 45 },
            border: { display: false },
          },
          y: {
            grid: { color: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: {
              font: tickFont, color: dark ? '#888780' : '#5F5E5A',
              callback: (v: any) => v >= 1000000 ? `฿${Math.round(v/1000000)}M` : `฿${Math.round(v/1000)}k`,
            },
            border: { display: false },
          },
        },
      },
    };
  }, [JSON.stringify(data)]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.blue }} />
          AR ค้างรับ (฿)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.amber }} />
          AP ค้างจ่าย
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', height: 220 }}>
        <canvas id="chart-ar-ap" role="img"
          aria-label="Monthly AR versus AP comparison">
          {data.map(d => `${d.month}: AR ฿${d.ar.toLocaleString()}, AP ฿${d.ap.toLocaleString()}`).join('; ')}
        </canvas>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. Repair Status Bar  — Operations tab
   Data: opsData.repairByStatus (Record<status, count>)
═══════════════════════════════════════════════════════════════ */
export function RepairStatusBar({ repairByStatus }: { repairByStatus: Record<string, number> }) {
  const statusColor: Record<string, string> = {
    pending:    COLORS.amber,
    diagnosing: COLORS.blue,
    repairing:  COLORS.blueLight,
    waiting_parts: COLORS.purple,
    ready:      COLORS.greenLight,
    completed:  COLORS.green,
    cancelled:  COLORS.gray,
    rejected:   COLORS.red,
  };
  const statusLabel: Record<string, string> = {
    pending: 'รอรับงาน', diagnosing: 'วินิจฉัย', repairing: 'กำลังซ่อม',
    waiting_parts: 'รอชิ้นส่วน', ready: 'พร้อมรับ', completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก', rejected: 'ปฏิเสธ',
  };

  const entries = Object.entries(repairByStatus).filter(([, v]) => v > 0);
  const height = Math.max(160, entries.length * 38 + 60);

  useChart('chart-repair-status', () => {
    const dark = isDark();
    return {
      type: 'bar',
      data: {
        labels: entries.map(([k]) => statusLabel[k] ?? k),
        datasets: [{
          label: 'จำนวนงาน',
          data: entries.map(([, v]) => v),
          backgroundColor: entries.map(([k]) => statusColor[k] ?? COLORS.gray),
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle(dark),
            callbacks: {
              label: (ctx: any) => ` ${ctx.raw} งาน`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: { font: tickFont, color: dark ? '#888780' : '#5F5E5A' },
            border: { display: false },
          },
          y: {
            grid: { display: false },
            ticks: { font: tickFont, color: dark ? '#888780' : '#5F5E5A' },
            border: { display: false },
          },
        },
      },
    };
  }, [JSON.stringify(repairByStatus)]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <canvas id="chart-repair-status" role="img"
        aria-label="Repair orders by status">
        {entries.map(([k, v]) => `${statusLabel[k] ?? k}: ${v}`).join(', ')}
      </canvas>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. Supplier PO Value Bar  — Operations tab
   Data: array of { name: string; value: number } (USD)
═══════════════════════════════════════════════════════════════ */
export function SupplierPoBar({ suppliers }: { suppliers: { name: string; value: number }[] }) {
  const top = suppliers.slice(0, 6);
  const height = Math.max(180, top.length * 42 + 60);

  useChart('chart-supplier-po', () => {
    const dark = isDark();
    return {
      type: 'bar',
      data: {
        labels: top.map(s => s.name.length > 18 ? s.name.slice(0, 18) + '…' : s.name),
        datasets: [{
          label: 'ยอดซื้อ (USD)',
          data: top.map(s => s.value),
          backgroundColor: top.map((_, i) => {
            const alpha = 1 - i * 0.12;
            return `rgba(239,159,39,${Math.max(0.25, alpha)})`;
          }),
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle(dark),
            callbacks: {
              label: (ctx: any) => ` $${Math.round(ctx.raw).toLocaleString('en-US')}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: {
              font: tickFont, color: dark ? '#888780' : '#5F5E5A',
              callback: (v: any) => v >= 1000 ? `$${Math.round(v/1000)}k` : `$${v}`,
            },
            border: { display: false },
          },
          y: {
            grid: { display: false },
            ticks: { font: tickFont, color: dark ? '#888780' : '#5F5E5A' },
            border: { display: false },
          },
        },
      },
    };
  }, [JSON.stringify(suppliers)]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <canvas id="chart-supplier-po" role="img"
        aria-label="Purchase order value per supplier">
        {top.map(s => `${s.name}: $${s.value.toLocaleString()}`).join(', ')}
      </canvas>
    </div>
  );
}

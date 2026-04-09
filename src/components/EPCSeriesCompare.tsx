import { useState, useMemo } from "react";
import { Monitor, Cpu, DollarSign, TrendingUp, Filter, FileText, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ───── Data ───── */
type EPCModel = {
  id: string;
  name: string;
  displayType: "Square 4:3" | "Wide 16:9";
  size: string;
  sizeNum: number;
  resolution: string;
  cpuTier: "entry" | "mid" | "high";
  cpu: string;
  cpuShort: string;
  price: number;
  priceLabel: string;
  config: string;
  com: string;
  tierColor: string;
  tierLabel: string;
};

const allModels: EPCModel[] = [
  // Square 10"
  { id: "s10-j1900", name: "EPC-S1062A", displayType: "Square 4:3", size: '10"', sizeNum: 10, resolution: "1024×768", cpuTier: "entry", cpu: "Intel® Celeron® J1900", cpuShort: "J1900", price: 27990, priceLabel: "฿27,990", config: "J1900 / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  { id: "s10-j6412", name: "EPC-S1072A", displayType: "Square 4:3", size: '10"', sizeNum: 10, resolution: "1024×768", cpuTier: "entry", cpu: "Intel® Celeron® J6412", cpuShort: "J6412", price: 27990, priceLabel: "฿27,990", config: "J6412 / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  { id: "s10-i3", name: "EPC-S1092A", displayType: "Square 4:3", size: '10"', sizeNum: 10, resolution: "1024×768", cpuTier: "mid", cpu: "Intel® Core™ i3-10110U", cpuShort: "i3-10110U", price: 31990, priceLabel: "฿31,990", config: "i3-10110U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  { id: "s10-i5", name: "EPC-S1092A", displayType: "Square 4:3", size: '10"', sizeNum: 10, resolution: "1024×768", cpuTier: "mid", cpu: "Intel® Core™ i5-10210U", cpuShort: "i5-10210U", price: 34990, priceLabel: "฿34,990", config: "i5-10210U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  { id: "s10-i3g12", name: "EPC-S1022A", displayType: "Square 4:3", size: '10"', sizeNum: 10, resolution: "1024×768", cpuTier: "high", cpu: "Intel® Core™ i3-1215U", cpuShort: "i3-1215U", price: 31990, priceLabel: "฿31,990", config: "i3-1215U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  { id: "s10-i5g12", name: "EPC-S1022A", displayType: "Square 4:3", size: '10"', sizeNum: 10, resolution: "1024×768", cpuTier: "high", cpu: "Intel® Core™ i5-1235U", cpuShort: "i5-1235U", price: 33990, priceLabel: "฿33,990", config: "i5-1235U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  // Square 12"
  { id: "s12-j1900", name: "EPC-S1262A", displayType: "Square 4:3", size: '12"', sizeNum: 12, resolution: "1024×768", cpuTier: "entry", cpu: "Intel® Celeron® J1900", cpuShort: "J1900", price: 27990, priceLabel: "฿27,990", config: "J1900 / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  { id: "s12-j6412", name: "EPC-S1272A", displayType: "Square 4:3", size: '12"', sizeNum: 12, resolution: "1024×768", cpuTier: "entry", cpu: "Intel® Celeron® J6412", cpuShort: "J6412", price: 27990, priceLabel: "฿27,990", config: "J6412 / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  { id: "s12-i3", name: "EPC-S1292A", displayType: "Square 4:3", size: '12"', sizeNum: 12, resolution: "1024×768", cpuTier: "mid", cpu: "Intel® Core™ i3-10110U", cpuShort: "i3-10110U", price: 32990, priceLabel: "฿32,990", config: "i3-10110U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  { id: "s12-i5", name: "EPC-S1292A", displayType: "Square 4:3", size: '12"', sizeNum: 12, resolution: "1024×768", cpuTier: "mid", cpu: "Intel® Core™ i5-10210U", cpuShort: "i5-10210U", price: 34990, priceLabel: "฿34,990", config: "i5-10210U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  { id: "s12-i7", name: "EPC-S1292A", displayType: "Square 4:3", size: '12"', sizeNum: 12, resolution: "1024×768", cpuTier: "mid", cpu: "Intel® Core™ i7-10510U", cpuShort: "i7-10510U", price: 36990, priceLabel: "฿36,990", config: "i7-10510U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  { id: "s12-i3g12", name: "EPC-S1222A", displayType: "Square 4:3", size: '12"', sizeNum: 12, resolution: "1024×768", cpuTier: "high", cpu: "Intel® Core™ i3-1215U", cpuShort: "i3-1215U", price: 32990, priceLabel: "฿32,990", config: "i3-1215U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  { id: "s12-i5g12", name: "EPC-S1222A", displayType: "Square 4:3", size: '12"', sizeNum: 12, resolution: "1024×768", cpuTier: "high", cpu: "Intel® Core™ i5-1235U", cpuShort: "i5-1235U", price: 33990, priceLabel: "฿33,990", config: "i5-1235U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  { id: "s12-i7g12", name: "EPC-S1222A", displayType: "Square 4:3", size: '12"', sizeNum: 12, resolution: "1024×768", cpuTier: "high", cpu: "Intel® Core™ i7-1250U", cpuShort: "i7-1250U", price: 36990, priceLabel: "฿36,990", config: "i7-1250U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  // Square 15"
  { id: "s15-j1900", name: "EPC-S1562A", displayType: "Square 4:3", size: '15"', sizeNum: 15, resolution: "1024×768", cpuTier: "entry", cpu: "Intel® Celeron® J1900", cpuShort: "J1900", price: 27990, priceLabel: "฿27,990", config: "J1900 / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  { id: "s15-j6412", name: "EPC-S1572A", displayType: "Square 4:3", size: '15"', sizeNum: 15, resolution: "1024×768", cpuTier: "entry", cpu: "Intel® Celeron® J6412", cpuShort: "J6412", price: 27990, priceLabel: "฿27,990", config: "J6412 / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  { id: "s15-i3", name: "EPC-S1592A", displayType: "Square 4:3", size: '15"', sizeNum: 15, resolution: "1024×768", cpuTier: "mid", cpu: "Intel® Core™ i3-10110U", cpuShort: "i3-10110U", price: 32990, priceLabel: "฿32,990", config: "i3-10110U / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  { id: "s15-i5", name: "EPC-S1592A", displayType: "Square 4:3", size: '15"', sizeNum: 15, resolution: "1024×768", cpuTier: "mid", cpu: "Intel® Core™ i5-10210U", cpuShort: "i5-10210U", price: 35990, priceLabel: "฿35,990", config: "i5-10210U / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  { id: "s15-i7", name: "EPC-S1592A", displayType: "Square 4:3", size: '15"', sizeNum: 15, resolution: "1024×768", cpuTier: "mid", cpu: "Intel® Core™ i7-10510U", cpuShort: "i7-10510U", price: 36990, priceLabel: "฿36,990", config: "i7-10510U / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  { id: "s15-i3g12", name: "EPC-S1522A", displayType: "Square 4:3", size: '15"', sizeNum: 15, resolution: "1024×768", cpuTier: "high", cpu: "Intel® Core™ i3-1215U", cpuShort: "i3-1215U", price: 32990, priceLabel: "฿32,990", config: "i3-1215U / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  { id: "s15-i5g12", name: "EPC-S1522A", displayType: "Square 4:3", size: '15"', sizeNum: 15, resolution: "1024×768", cpuTier: "high", cpu: "Intel® Core™ i5-1235U", cpuShort: "i5-1235U", price: 34990, priceLabel: "฿34,990", config: "i5-1235U / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  { id: "s15-i7g12", name: "EPC-S1522A", displayType: "Square 4:3", size: '15"', sizeNum: 15, resolution: "1024×768", cpuTier: "high", cpu: "Intel® Core™ i7-1250U", cpuShort: "i7-1250U", price: 36990, priceLabel: "฿36,990", config: "i7-1250U / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  // Square 17"
  { id: "s17-j1900", name: "EPC-S1762A", displayType: "Square 4:3", size: '17"', sizeNum: 17, resolution: "1280×1024", cpuTier: "entry", cpu: "Intel® Celeron® J1900", cpuShort: "J1900", price: 29990, priceLabel: "฿29,990", config: "J1900 / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  { id: "s17-i5", name: "EPC-S1792A", displayType: "Square 4:3", size: '17"', sizeNum: 17, resolution: "1280×1024", cpuTier: "mid", cpu: "Intel® Core™ i5-10210U", cpuShort: "i5-10210U", price: 36990, priceLabel: "฿36,990", config: "i5-10210U / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  { id: "s17-i5g12", name: "EPC-S1722A", displayType: "Square 4:3", size: '17"', sizeNum: 17, resolution: "1280×1024", cpuTier: "high", cpu: "Intel® Core™ i5-1235U", cpuShort: "i5-1235U", price: 36990, priceLabel: "฿36,990", config: "i5-1235U / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  // Wide 13.3"
  { id: "w13-j1900", name: "EPC-W1362A", displayType: "Wide 16:9", size: '13.3"', sizeNum: 13.3, resolution: "1920×1080", cpuTier: "entry", cpu: "Intel® Celeron® J1900", cpuShort: "J1900", price: 29990, priceLabel: "฿29,990", config: "J1900 / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  { id: "w13-i5", name: "EPC-W1392A", displayType: "Wide 16:9", size: '13.3"', sizeNum: 13.3, resolution: "1920×1080", cpuTier: "mid", cpu: "Intel® Core™ i5-10210U", cpuShort: "i5-10210U", price: 36990, priceLabel: "฿36,990", config: "i5-10210U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  { id: "w13-i5g12", name: "EPC-W1322A", displayType: "Wide 16:9", size: '13.3"', sizeNum: 13.3, resolution: "1920×1080", cpuTier: "high", cpu: "Intel® Core™ i5-1235U", cpuShort: "i5-1235U", price: 36990, priceLabel: "฿36,990", config: "i5-1235U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  // Wide 15.6"
  { id: "w15-j1900", name: "EPC-W1562A", displayType: "Wide 16:9", size: '15.6"', sizeNum: 15.6, resolution: "1920×1080", cpuTier: "entry", cpu: "Intel® Celeron® J1900", cpuShort: "J1900", price: 29990, priceLabel: "฿29,990", config: "J1900 / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  { id: "w15-i5g12", name: "EPC-W1522A", displayType: "Wide 16:9", size: '15.6"', sizeNum: 15.6, resolution: "1920×1080", cpuTier: "high", cpu: "Intel® Core™ i5-1235U", cpuShort: "i5-1235U", price: 37990, priceLabel: "฿37,990", config: "i5-1235U / 4G RAM / 128G SSD", com: "2×RS232 + 1×RS485", tierColor: "text-amber-500", tierLabel: "Gen 12" },
  // Wide 18.5"
  { id: "w18-j1900", name: "EPC-W1862A", displayType: "Wide 16:9", size: '18.5"', sizeNum: 18.5, resolution: "1920×1080", cpuTier: "entry", cpu: "Intel® Celeron® J1900", cpuShort: "J1900", price: 32990, priceLabel: "฿32,990", config: "J1900 / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  { id: "w18-i3", name: "EPC-W1892A", displayType: "Wide 16:9", size: '18.5"', sizeNum: 18.5, resolution: "1920×1080", cpuTier: "mid", cpu: "Intel® Core™ i3-10110U", cpuShort: "i3-10110U", price: 34990, priceLabel: "฿34,990", config: "i3-10110U / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-sky-500", tierLabel: "Standard" },
  // Wide 21.5"
  { id: "w21-j6412", name: "EPC-W2172A", displayType: "Wide 16:9", size: '21.5"', sizeNum: 21.5, resolution: "1920×1080", cpuTier: "entry", cpu: "Intel® Celeron® J6412", cpuShort: "J6412", price: 34990, priceLabel: "฿34,990", config: "J6412 / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
  // Wide 23.6"
  { id: "w24-j6412", name: "EPC-W2472A", displayType: "Wide 16:9", size: '23.6"', sizeNum: 23.6, resolution: "1920×1080", cpuTier: "entry", cpu: "Intel® Celeron® J6412", cpuShort: "J6412", price: 36990, priceLabel: "฿36,990", config: "J6412 / 4G RAM / 128G SSD", com: "4×RS232 + 2×RS485", tierColor: "text-emerald-500", tierLabel: "Entry" },
];

const viewModes = [
  { id: "specs" as const, label: "สเปก", icon: Cpu },
  { id: "price" as const, label: "ราคา", icon: DollarSign },
  { id: "value" as const, label: "ความคุ้มค่า", icon: TrendingUp },
];

const displayTypes = ["ทั้งหมด", "Square 4:3", "Wide 16:9"];
const cpuTiers = ["ทุกระดับ", "entry", "mid", "high"];
const cpuTierLabels: Record<string, string> = { "ทุกระดับ": "ทุกระดับ CPU", entry: "Celeron (Entry)", mid: "Core Gen 10", high: "Core Gen 12" };

interface Props {
  onQuote: (name: string) => void;
}

const EPCSeriesCompare = ({ onQuote }: Props) => {
  const [viewMode, setViewMode] = useState<"specs" | "price" | "value">("specs");
  const [displayFilter, setDisplayFilter] = useState("ทั้งหมด");
  const [cpuFilter, setCpuFilter] = useState("ทุกระดับ");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filtered = useMemo(() => {
    setPage(1);
    return allModels.filter((m) => {
      if (displayFilter !== "ทั้งหมด" && m.displayType !== displayFilter) return false;
      if (cpuFilter !== "ทุกระดับ" && m.cpuTier !== cpuFilter) return false;
      return true;
    });
  }, [displayFilter, cpuFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getValueScore = (m: EPCModel) => {
    const cpuScore = m.cpuTier === "high" ? 90 : m.cpuTier === "mid" ? 70 : 50;
    const sizeScore = Math.min(100, (m.sizeNum / 24) * 100);
    const priceEfficiency = ((cpuScore + sizeScore) / 2) / (m.price / 10000);
    return Math.round(priceEfficiency * 10);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-0.5">
          {viewModes.map((v) => (
            <button
              key={v.id}
              onClick={() => setViewMode(v.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                viewMode === v.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              <v.icon size={12} />
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={12} className="text-muted-foreground" />
          <select value={displayFilter} onChange={(e) => setDisplayFilter(e.target.value)}
            className="text-[11px] border border-border rounded-md px-2 py-1 bg-background text-foreground">
            {displayTypes.map((d) => <option key={d} value={d}>{d === "ทั้งหมด" ? "ทุกประเภทจอ" : d}</option>)}>

          </select>
          <select value={cpuFilter} onChange={(e) => setCpuFilter(e.target.value)}
            className="text-[11px] border border-border rounded-md px-2 py-1 bg-background text-foreground">
            {cpuTiers.map((t) => <option key={t} value={t}>{cpuTierLabels[t]}</option>)}>

          </select>
          <span className="text-[10px] text-muted-foreground">{filtered.length}/{allModels.length} รายการ</span>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">ไม่พบสินค้าที่ตรงกับตัวกรอง</div>
      ) : (
        <div className="card-surface rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-primary/5 border-b border-border">
                  <th className="text-left px-3 py-2 font-semibold text-foreground">รุ่น</th>
                  <th className="text-left px-3 py-2 font-semibold text-foreground">จอ</th>
                  <th className="text-left px-3 py-2 font-semibold text-foreground">CPU</th>
                  {viewMode === "specs" && (
                    <>
                      <th className="text-left px-3 py-2 font-semibold text-foreground">Resolution</th>
                      <th className="text-left px-3 py-2 font-semibold text-foreground">COM</th>
                      <th className="text-left px-3 py-2 font-semibold text-foreground">Config</th>
                    </>
                  )}
                  {viewMode === "price" && (
                    <>
                      <th className="text-left px-3 py-2 font-semibold text-foreground">Config</th>
                      <th className="text-right px-3 py-2 font-semibold text-foreground">ราคา</th>
                    </>
                  )}
                  {viewMode === "value" && (
                    <>
                      <th className="text-right px-3 py-2 font-semibold text-foreground">ราคา</th>
                      <th className="text-center px-3 py-2 font-semibold text-foreground">คะแนน</th>
                      <th className="text-center px-3 py-2 font-semibold text-foreground">ความคุ้มค่า</th>
                    </>
                  )}
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginated.map((m) => {
                  const score = getValueScore(m);
                  const stars = score >= 80 ? 5 : score >= 65 ? 4 : score >= 50 ? 3 : 2;
                  return (
                    <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-semibold text-foreground">{m.name}</span>
                          <Badge className={`text-[9px] px-1 py-0 ${m.tierColor} bg-transparent border ${m.cpuTier === "entry" ? "border-emerald-500/30" : m.cpuTier === "mid" ? "border-sky-500/30" : "border-amber-500/30"}`}

                            {m.tierLabel}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                        {m.size} <span className="text-[10px]">({m.displayType.split(" ")[1]})</span>
                      </td>
                      <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{m.cpuShort}</td>

                      {viewMode === "specs" && (
                        <>
                          <td className="px-3 py-2.5 text-muted-foreground">{m.resolution}</td>
                          <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{m.com}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{m.config}</td>
                        </>
                      )}
                      {viewMode === "price" && (
                        <>
                          <td className="px-3 py-2.5 text-muted-foreground">{m.config}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-primary whitespace-nowrap">{m.priceLabel}</td>
                        </>
                      )}
                      {viewMode === "value" && (
                        <>
                          <td className="px-3 py-2.5 text-right font-medium text-primary whitespace-nowrap">{m.priceLabel}</td>
                          <td className="px-3 py-2.5 text-center font-bold text-foreground">{score}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex justify-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={10} className={i < stars ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"} />
                              ))}
                            </div>
                          </td>
                        </>
                      )}

                      <td className="px-3 py-2.5">
                        <button onClick={() => onQuote(m.name)} className="text-primary hover:text-primary/80 transition-colors" title="ขอใบเสนอราคา">
                          <FileText size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
              <p className="text-[11px] text-muted-foreground">
                แสดง {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} จาก {filtered.length} รายการ
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="w-7 h-7 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded text-[11px] font-medium transition-colors ${
                      p === page ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"
                    }`}

                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EPCSeriesCompare;

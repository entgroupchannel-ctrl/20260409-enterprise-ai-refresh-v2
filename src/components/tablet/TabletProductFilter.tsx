import { useMemo } from "react";
import { X, Filter, Cpu, Monitor, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface TabletFilterState {
  os: string;
  screenSize: string;
  cpuBrand: string;
  priceRange: string;
  hasPrice: boolean | null;
}

export const defaultTabletFilters: TabletFilterState = {
  os: "all",
  screenSize: "all",
  cpuBrand: "all",
  priceRange: "all",
  hasPrice: null,
};

export const osOptions = [
  { id: "all", name: "ทั้งหมด" },
  { id: "Windows", name: "Windows" },
  { id: "Android", name: "Android" },
];

export const screenSizeOptions = [
  { id: "all", name: "ทุกขนาด" },
  { id: '8"', name: '8 นิ้ว' },
  { id: '10"', name: '10 นิ้ว' },
  { id: '10.1"', name: '10.1 นิ้ว' },
  { id: '10.95"', name: '10.95 นิ้ว' },
  { id: '11.6"', name: '11.6 นิ้ว' },
];

export const cpuBrandOptions = [
  { id: "all", name: "ทุก CPU" },
  { id: "Intel", name: "Intel" },
  { id: "Rockchip", name: "Rockchip / RK" },
  { id: "MTK", name: "MediaTek" },
];

export const priceRangeOptions = [
  { id: "all", name: "ทุกราคา" },
  { id: "under20k", name: "ต่ำกว่า ฿20,000" },
  { id: "20k-25k", name: "฿20,000 - ฿25,000" },
  { id: "over25k", name: "มากกว่า ฿25,000" },
  { id: "contact", name: "สอบถามราคา" },
];

type TabletProduct = {
  os: string;
  size: string;
  cpu: string;
  price?: string;
};

function useTabletFilterCounts(allProducts: TabletProduct[]) {
  return useMemo(() => {
    const os: Record<string, number> = { all: allProducts.length };
    const screen: Record<string, number> = { all: allProducts.length };
    const cpu: Record<string, number> = { all: allProducts.length };
    let hasPriceCount = 0;

    for (const p of allProducts) {
      os[p.os] = (os[p.os] || 0) + 1;
      screen[p.size] = (screen[p.size] || 0) + 1;

      if (p.cpu.toLowerCase().includes("intel")) cpu["Intel"] = (cpu["Intel"] || 0) + 1;
      else if (p.cpu.toLowerCase().includes("rk") || p.cpu.toLowerCase().includes("rockchip")) cpu["Rockchip"] = (cpu["Rockchip"] || 0) + 1;
      else if (p.cpu.toLowerCase().includes("mt") || p.cpu.toLowerCase().includes("mtk")) cpu["MTK"] = (cpu["MTK"] || 0) + 1;

      if (p.price) hasPriceCount++;
    }

    return { os, screen, cpu, hasPriceCount };
  }, [allProducts]);
}

interface TabletProductFilterProps {
  filters: TabletFilterState;
  onFilterChange: (filters: TabletFilterState) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  resultCount: number;
  allProducts: TabletProduct[];
}

const TabletProductFilter = ({
  filters,
  onFilterChange,
  isMobileOpen,
  onMobileClose,
  resultCount,
  allProducts,
}: TabletProductFilterProps) => {
  const counts = useTabletFilterCounts(allProducts);

  const hasActiveFilters =
    filters.os !== "all" ||
    filters.screenSize !== "all" ||
    filters.cpuBrand !== "all" ||
    filters.priceRange !== "all" ||
    filters.hasPrice !== null;

  const clearFilters = () => onFilterChange({ ...defaultTabletFilters });

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          ตัวกรองสินค้า
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive/80 text-xs h-7 px-2">
            <X className="w-3 h-3 mr-1" />
            ล้างทั้งหมด
          </Button>
        )}
        >
      </div>

      {/* Result Count */}
      <div className="px-3 py-2.5 bg-primary/5 rounded-lg border border-primary/10">
        <p className="text-sm font-semibold text-primary">
          พบ <span className="text-lg">{resultCount}</span> รายการ
        </p>
      </div>

      <Accordion type="multiple" defaultValue={["os", "screen", "cpu", "price"]} className="space-y-1.5">
        {/* OS */}
        <AccordionItem value="os" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              ระบบปฏิบัติการ
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {osOptions.map((option) => {
              const count = counts.os[option.id] || 0;
              const isActive = filters.os === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onFilterChange({ ...filters, os: option.id })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                    isActive ? "bg-primary text-primary-foreground font-medium shadow-sm" : "hover:bg-muted/70 text-foreground"
                  }`}
                  >
                  <span>{option.name}</span>
                  <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"}`}>{count}</span>
                </button>
              );
            })}
            >
          </AccordionContent>
        </AccordionItem>

        {/* Screen Size */}
        <AccordionItem value="screen" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              ขนาดหน้าจอ
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {screenSizeOptions.map((option) => {
              const count = counts.screen[option.id] || 0;
              const isActive = filters.screenSize === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onFilterChange({ ...filters, screenSize: option.id })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                    isActive ? "bg-primary text-primary-foreground font-medium shadow-sm" : count === 0 && option.id !== "all" ? "text-muted-foreground/50 cursor-not-allowed" : "hover:bg-muted/70 text-foreground"
                  }`}
                  >
                  disabled={count === 0 && option.id !== "all"}
                >
                  <span>{option.name}</span>
                  <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"}`}>{count}</span>
                </button>
              );
            })}
            >
          </AccordionContent>
        </AccordionItem>

        {/* CPU Brand */}
        <AccordionItem value="cpu" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Processor
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {cpuBrandOptions.map((option) => {
              const count = counts.cpu[option.id] || 0;
              const isActive = filters.cpuBrand === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onFilterChange({ ...filters, cpuBrand: option.id })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                    isActive ? "bg-primary text-primary-foreground font-medium shadow-sm" : count === 0 && option.id !== "all" ? "text-muted-foreground/50 cursor-not-allowed" : "hover:bg-muted/70 text-foreground"
                  }`}
                  >
                  disabled={count === 0 && option.id !== "all"}
                >
                  <span>{option.name}</span>
                  <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"}`}>{count}</span>
                </button>
              );
            })}
            >
          </AccordionContent>
        </AccordionItem>

        {/* Price / Features */}
        <AccordionItem value="price" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              ช่วงราคา
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {priceRangeOptions.map((option) => {
              const isActive = filters.priceRange === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onFilterChange({ ...filters, priceRange: option.id })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive ? "bg-primary text-primary-foreground font-medium shadow-sm" : "hover:bg-muted/70 text-foreground"
                  }`}
                  >
                  {option.name}
                </button>
              );
            })}
            >
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 card-surface p-4 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <>
          <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden animate-in fade-in duration-200" onClick={onMobileClose} />
          <aside className="fixed inset-y-0 left-0 w-80 max-w-[90vw] bg-card z-50 lg:hidden overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">ตัวกรองสินค้า</h2>
                <button onClick={onMobileClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterContent />
              <div className="mt-4 pt-4 border-t border-border">
                <Button onClick={onMobileClose} className="w-full">
                  ดูผลลัพธ์ ({resultCount} รายการ)
                </Button>
              </div>
            </div>
          </aside>
        </>
      )}
      >
    </>
  );
};

export default TabletProductFilter;

/* ═══════ Active Filter Chips ═══════ */
export const TabletActiveFilterChips = ({
  filters,
  onFilterChange,
}: {
  filters: TabletFilterState;
  onFilterChange: (f: TabletFilterState) => void;
}) => {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.os !== "all") chips.push({ label: filters.os, onRemove: () => onFilterChange({ ...filters, os: "all" }) });
  if (filters.screenSize !== "all") {
    const s = screenSizeOptions.find((o) => o.id === filters.screenSize);
    chips.push({ label: s?.name || filters.screenSize, onRemove: () => onFilterChange({ ...filters, screenSize: "all" }) });
  }
  if (filters.cpuBrand !== "all") {
    const c = cpuBrandOptions.find((o) => o.id === filters.cpuBrand);
    chips.push({ label: c?.name || filters.cpuBrand, onRemove: () => onFilterChange({ ...filters, cpuBrand: "all" }) });
  }
  if (filters.priceRange !== "all") {
    const p = priceRangeOptions.find((o) => o.id === filters.priceRange);
    chips.push({ label: p?.name || filters.priceRange, onRemove: () => onFilterChange({ ...filters, priceRange: "all" }) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground shrink-0">ตัวกรอง:</span>
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors group"
        >
          {chip.label}
          <X className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
      >
      <button onClick={() => onFilterChange({ ...defaultTabletFilters })} className="text-xs text-destructive hover:text-destructive/80 transition-colors underline underline-offset-2">
        ล้างทั้งหมด
      </button>
    </div>
  );
};

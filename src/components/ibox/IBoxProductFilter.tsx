import { useMemo } from "react";
import { X, Filter, Cpu, Network, Zap, Flame, Factory, Globe, Radio, Car, Eye, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IBoxProduct } from "@/data/ibox-products";

export interface IBoxFilterState {
  category: string;
  cpuGen: string;
  comPorts: string;
  lanPorts: string;
  poe: boolean | null;
  pcie: boolean | null;
  formFactor: string;
  performance: string;
}

export const defaultFilters: IBoxFilterState = {
  category: "all",
  cpuGen: "all",
  comPorts: "all",
  lanPorts: "all",
  poe: null,
  pcie: null,
  formFactor: "all",
  performance: "all",
};

export const categoryOptions = [
  { id: "all", name: "ทั้งหมด", icon: LayoutGrid },
  { id: "AI Edge Computing", name: "AI Edge Computing / GPU", icon: Flame },
  { id: "Embedded Box PC", name: "Embedded Box PC", icon: Factory },
  { id: "Gateway", name: "Gateway / DIN Rail", icon: Globe },
  { id: "PoE & Multi-LAN", name: "PoE & Multi-LAN", icon: Radio },
  { id: "Vehicle & Special", name: "Vehicle & Special", icon: Car },
  { id: "Machine Vision", name: "Machine Vision (AEOLUS)", icon: Eye },
];

export const cpuGenerations = [
  { id: "all", name: "ทุกรุ่น CPU" },
  { id: "14th Gen", name: "Intel 14th Gen" },
  { id: "13th Gen", name: "Intel 13th Gen (Raptor Lake)" },
  { id: "12th-14th Gen", name: "Intel 12th-14th Gen" },
  { id: "12th Gen", name: "Intel 12th Gen (Alder Lake)" },
  { id: "11th Gen", name: "Intel 11th Gen (Tiger Lake)" },
  { id: "10th Gen", name: "Intel 10th Gen" },
  { id: "8th-9th Gen", name: "Intel 8th-9th Gen" },
  { id: "6th-9th Gen", name: "Intel 6th-9th Gen" },
  { id: "9th Gen", name: "Intel 9th Gen" },
  { id: "Gemini Lake", name: "Intel Celeron (Gemini Lake)" },
  { id: "Elkhart Lake", name: "Intel Celeron (Elkhart Lake)" },
  { id: "ARM", name: "ARM Processor" },
];

const formFactorOptions = [
  { id: "all", name: "ทุกรูปแบบ" },
  { id: "fanless", name: "Fanless Box PC" },
  { id: "mini", name: "Mini PC" },
  { id: "compact", name: "Compact PC" },
  { id: "embedded", name: "Embedded PC" },
];

const performanceOptions = [
  { id: "all", name: "ทุกระดับ" },
  { id: "entry", name: "Entry-level" },
  { id: "mid", name: "Mid-range" },
  { id: "high", name: "High-performance" },
];

export const portFilters = {
  comPorts: [
    { id: "all", name: "ทุกจำนวน", min: 0, max: 99 },
    { id: "1-2", name: "1-2 พอร์ต", min: 1, max: 2 },
    { id: "3-4", name: "3-4 พอร์ต", min: 3, max: 4 },
    { id: "5+", name: "5+ พอร์ต", min: 5, max: 99 },
  ],
  lanPorts: [
    { id: "all", name: "ทุกจำนวน", min: 0, max: 99 },
    { id: "1-2", name: "1-2 พอร์ต", min: 1, max: 2 },
    { id: "3-4", name: "3-4 พอร์ต", min: 3, max: 4 },
    { id: "5-6", name: "5-6 พอร์ต", min: 5, max: 6 },
    { id: "7+", name: "7+ พอร์ต", min: 7, max: 99 },
  ],
};

/** Compute how many products match each option value */
function useFilterCounts(allProducts: IBoxProduct[]) {
  return useMemo(() => {
    const cat: Record<string, number> = {};
    const cpu: Record<string, number> = {};
    const ff: Record<string, number> = {};
    const perf: Record<string, number> = {};
    let poeCount = 0;
    let pcieCount = 0;

    for (const p of allProducts) {
      cat[p.category] = (cat[p.category] || 0) + 1;
      if (p.specs.cpuGen) cpu[p.specs.cpuGen] = (cpu[p.specs.cpuGen] || 0) + 1;
      ff[p.formFactor] = (ff[p.formFactor] || 0) + 1;
      perf[p.performance] = (perf[p.performance] || 0) + 1;
      if (p.specs.poe) poeCount++;
      if (p.specs.pcie) pcieCount++;
    }
    cat["all"] = allProducts.length;
    cpu["all"] = allProducts.length;
    ff["all"] = allProducts.length;
    perf["all"] = allProducts.length;

    return { cat, cpu, ff, perf, poeCount, pcieCount };
  }, [allProducts]);
}

interface IBoxProductFilterProps {
  filters: IBoxFilterState;
  onFilterChange: (filters: IBoxFilterState) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  resultCount: number;
  allProducts: IBoxProduct[];
}

const IBoxProductFilter = ({
  filters,
  onFilterChange,
  isMobileOpen,
  onMobileClose,
  resultCount,
  allProducts,
}: IBoxProductFilterProps) => {
  const counts = useFilterCounts(allProducts);

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.cpuGen !== "all" ||
    filters.comPorts !== "all" ||
    filters.lanPorts !== "all" ||
    filters.poe !== null ||
    filters.pcie !== null ||
    filters.formFactor !== "all" ||
    filters.performance !== "all";

  const clearFilters = () => onFilterChange({ ...defaultFilters });

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
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-destructive hover:text-destructive/80 text-xs h-7 px-2"
          >
            <X className="w-3 h-3 mr-1" />
            ล้างทั้งหมด
          </Button>
        )}
      </div>

      {/* Result Count */}
      <div className="px-3 py-2.5 bg-primary/5 rounded-lg border border-primary/10">
        <p className="text-sm font-semibold text-primary">
          พบ <span className="text-lg">{resultCount}</span> รายการ
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["category", "formFactor", "performance", "cpu", "ports", "features"]}
        className="space-y-1.5"
      >
        {/* Category */}
        <AccordionItem value="category" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            หมวดสินค้า
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {categoryOptions.map((option) => {
              const count = counts.cat[option.id] || 0;
              const isActive = filters.category === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onFilterChange({ ...filters, category: option.id })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 group/item ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "hover:bg-muted/70 text-foreground"
                  }`}
                  {option.icon && <option.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "" : "text-muted-foreground group-hover/item:text-primary"}`} />}
                  <span className="flex-1">{option.name}</span>
                  <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                  }`}>{count}</span>
                </button>
              );
            })}
          </AccordionContent>
        </AccordionItem>

        {/* Form Factor */}
        <AccordionItem value="formFactor" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            ตาม Form Factor
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {formFactorOptions.map((option) => {
              const count = counts.ff[option.id] || 0;
              const isActive = filters.formFactor === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onFilterChange({ ...filters, formFactor: option.id })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "hover:bg-muted/70 text-foreground"
                  }`}
                  <span>{option.name}</span>
                  <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                  }`}>{count}</span>
                </button>
              );
            })}
          </AccordionContent>
        </AccordionItem>

        {/* Performance */}
        <AccordionItem value="performance" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            ตามระดับประสิทธิภาพ
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {performanceOptions.map((option) => {
              const count = counts.perf[option.id] || 0;
              const isActive = filters.performance === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onFilterChange({ ...filters, performance: option.id })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "hover:bg-muted/70 text-foreground"
                  }`}
                  <span>{option.name}</span>
                  <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                  }`}>{count}</span>
                </button>
              );
            })}
          </AccordionContent>
        </AccordionItem>

        {/* CPU Generation */}
        <AccordionItem value="cpu" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Processor
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5 max-h-52 overflow-y-auto">
            {cpuGenerations.map((gen) => {
              const count = counts.cpu[gen.id] || 0;
              const isActive = filters.cpuGen === gen.id;
              return (
                <button
                  key={gen.id}
                  onClick={() => onFilterChange({ ...filters, cpuGen: gen.id })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : count === 0 && gen.id !== "all"
                      ? "text-muted-foreground/50 cursor-not-allowed"
                      : "hover:bg-muted/70 text-foreground"
                  }`}
                  disabled={count === 0 && gen.id !== "all"}
                >
                  <span className="truncate mr-2">{gen.name}</span>
                  <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md shrink-0 ${
                    isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                  }`}>{count}</span>
                </button>
              );
            })}
          </AccordionContent>
        </AccordionItem>

        {/* Ports */}
        <AccordionItem value="ports" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" />
              I/O Ports
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">COM Ports</p>
              <div className="flex flex-wrap gap-1.5">
                {portFilters.comPorts.map((port) => (
                  <button
                    key={port.id}
                    onClick={() => onFilterChange({ ...filters, comPorts: port.id })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.comPorts === port.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                    {port.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">LAN Ports</p>
              <div className="flex flex-wrap gap-1.5">
                {portFilters.lanPorts.map((port) => (
                  <button
                    key={port.id}
                    onClick={() => onFilterChange({ ...filters, lanPorts: port.id })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.lanPorts === port.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                    {port.name}
                  </button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Features */}
        <AccordionItem value="features" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              คุณสมบัติพิเศษ
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <label className="text-sm text-foreground cursor-pointer">PoE Support</label>
                <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{counts.poeCount}</span>
              </div>
              <Switch
                checked={filters.poe === true}
                onCheckedChange={(checked) =>
                  onFilterChange({ ...filters, poe: checked ? true : null })
                }
              />
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <label className="text-sm text-foreground cursor-pointer">PCIe Expansion</label>
                <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{counts.pcieCount}</span>
              </div>
              <Switch
                checked={filters.pcie === true}
                onCheckedChange={(checked) =>
                  onFilterChange({ ...filters, pcie: checked ? true : null })
                }
              />
            </div>
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
          <div
            className="fixed inset-0 bg-foreground/50 z-40 lg:hidden animate-in fade-in duration-200"
            onClick={onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 w-80 max-w-[90vw] bg-card z-50 lg:hidden overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">ตัวกรองสินค้า</h2>
                <button
                  onClick={onMobileClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
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
    </>
  );
};

export default IBoxProductFilter;

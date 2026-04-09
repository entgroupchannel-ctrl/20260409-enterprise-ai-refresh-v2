import { useMemo } from "react";
import { X, Filter, Cpu, Monitor, Laptop, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { RuggedNotebook } from "@/data/rugged-notebook-products";

export interface NotebookFilterState {
  os: string;
  screenSize: string;
  cpuBrand: string;
  protection: string;
  priceRange: string;
}

export const defaultNotebookFilters: NotebookFilterState = {
  os: "all",
  screenSize: "all",
  cpuBrand: "all",
  protection: "all",
  priceRange: "all",
};

export const nbOsOptions = [
  { id: "all", name: "ทั้งหมด" },
  { id: "Windows", name: "Windows" },
  { id: "Linux", name: "Linux" },
];

export const nbScreenOptions = [
  { id: "all", name: "ทุกขนาด" },
  { id: '14"', name: '14 นิ้ว' },
  { id: '15.6"', name: '15.6 นิ้ว' },
];

export const nbCpuOptions = [
  { id: "all", name: "ทุก CPU" },
  { id: "Ultra", name: "Intel Core Ultra (AI)" },
  { id: "i7", name: "Intel Core i7" },
  { id: "i5", name: "Intel Core i5" },
];

export const nbProtectionOptions = [
  { id: "all", name: "ทุกระดับ" },
  { id: "IP65", name: "IP65" },
  { id: "IP66", name: "IP66" },
  { id: "IP67", name: "IP67" },
];

export const nbPriceOptions = [
  { id: "all", name: "ทุกราคา" },
  { id: "under50k", name: "ต่ำกว่า ฿50,000" },
  { id: "50k-80k", name: "฿50,000 - ฿80,000" },
  { id: "over80k", name: "มากกว่า ฿80,000" },
  { id: "contact", name: "สอบถามราคา" },
];

function useNotebookFilterCounts(products: RuggedNotebook[]) {
  return useMemo(() => {
    const os: Record<string, number> = { all: products.length };
    const screen: Record<string, number> = { all: products.length };
    const cpu: Record<string, number> = { all: products.length };
    const prot: Record<string, number> = { all: products.length };

    for (const p of products) {
      os[p.os] = (os[p.os] || 0) + 1;
      screen[p.screenSize] = (screen[p.screenSize] || 0) + 1;

      const cpuLc = p.cpu.toLowerCase();
      if (cpuLc.includes("ultra")) cpu["Ultra"] = (cpu["Ultra"] || 0) + 1;
      if (cpuLc.includes("i7")) cpu["i7"] = (cpu["i7"] || 0) + 1;
      if (cpuLc.includes("i5")) cpu["i5"] = (cpu["i5"] || 0) + 1;

      if (p.protection.includes("IP67")) prot["IP67"] = (prot["IP67"] || 0) + 1;
      else if (p.protection.includes("IP66")) prot["IP66"] = (prot["IP66"] || 0) + 1;
      else if (p.protection.includes("IP65")) prot["IP65"] = (prot["IP65"] || 0) + 1;
    }

    return { os, screen, cpu, prot };
  }, [products]);
}

interface NotebookProductFilterProps {
  filters: NotebookFilterState;
  onFilterChange: (f: NotebookFilterState) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  resultCount: number;
  allProducts: RuggedNotebook[];
}

const FilterOption = ({
  label,
  count,
  isActive,
  onClick,
  disabled,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
      isActive
        ? "bg-primary text-primary-foreground font-medium shadow-sm"
        : disabled
        ? "text-muted-foreground/50 cursor-not-allowed"
        : "hover:bg-muted/70 text-foreground"
    }`}
    >
    <span>{label}</span>
    <span
      className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
        isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
      }`}
      >
      {count}
    </span>
  </button>
);

const NotebookProductFilter = ({
  filters,
  onFilterChange,
  isMobileOpen,
  onMobileClose,
  resultCount,
  allProducts,
}: NotebookProductFilterProps) => {
  const counts = useNotebookFilterCounts(allProducts);

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => v !== defaultNotebookFilters[k as keyof NotebookFilterState]
  );

  const clearFilters = () => onFilterChange({ ...defaultNotebookFilters });

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          ตัวกรองสินค้า
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive/80 text-xs h-7 px-2">
            <X className="w-3 h-3 mr-1" /> ล้างทั้งหมด
          </Button>
        )}
        >
      </div>

      <div className="px-3 py-2.5 bg-primary/5 rounded-lg border border-primary/10">
        <p className="text-sm font-semibold text-primary">
          พบ <span className="text-lg">{resultCount}</span> รายการ
        </p>
      </div>

      <Accordion type="multiple" defaultValue={["os", "screen", "cpu", "protection", "price"]} className="space-y-1.5">
        <AccordionItem value="os" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2"><Laptop className="w-4 h-4 text-primary" /> ระบบปฏิบัติการ</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {nbOsOptions.map((o) => (
              <FilterOption key={o.id} label={o.name} count={counts.os[o.id] || 0} isActive={filters.os === o.id} onClick={() => onFilterChange({ ...filters, os: o.id })} />
            ))}
            >
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="screen" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2"><Monitor className="w-4 h-4 text-primary" /> ขนาดหน้าจอ</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {nbScreenOptions.map((o) => (
              <FilterOption key={o.id} label={o.name} count={counts.screen[o.id] || 0} isActive={filters.screenSize === o.id} onClick={() => onFilterChange({ ...filters, screenSize: o.id })} disabled={o.id !== "all" && (counts.screen[o.id] || 0) === 0} />
            ))}
            >
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cpu" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" /> Processor</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {nbCpuOptions.map((o) => (
              <FilterOption key={o.id} label={o.name} count={counts.cpu[o.id] || 0} isActive={filters.cpuBrand === o.id} onClick={() => onFilterChange({ ...filters, cpuBrand: o.id })} disabled={o.id !== "all" && (counts.cpu[o.id] || 0) === 0} />
            ))}
            >
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="protection" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> ระดับกันน้ำ</span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {nbProtectionOptions.map((o) => (
              <FilterOption key={o.id} label={o.name} count={counts.prot[o.id] || 0} isActive={filters.protection === o.id} onClick={() => onFilterChange({ ...filters, protection: o.id })} disabled={o.id !== "all" && (counts.prot[o.id] || 0) === 0} />
            ))}
            >
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border border-border rounded-lg px-3 transition-colors data-[state=open]:border-primary/20 data-[state=open]:bg-primary/[0.02]">
          <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
            ช่วงราคา
          </AccordionTrigger>
          <AccordionContent className="pb-3 space-y-0.5">
            {nbPriceOptions.map((o) => (
              <button
                key={o.id}
                onClick={() => onFilterChange({ ...filters, priceRange: o.id })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  filters.priceRange === o.id ? "bg-primary text-primary-foreground font-medium shadow-sm" : "hover:bg-muted/70 text-foreground"
                }`}
                >
                {o.name}
              </button>
            ))}
            >
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 card-surface p-4 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
          <FilterContent />
        </div>
      </aside>

      {isMobileOpen && (
        <>
          <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden animate-in fade-in duration-200" onClick={onMobileClose} />
          <aside className="fixed inset-y-0 left-0 w-80 max-w-[90vw] bg-card z-50 lg:hidden overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">ตัวกรองสินค้า</h2>
                <button onClick={onMobileClose} className="p-2 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <FilterContent />
              <div className="mt-4 pt-4 border-t border-border">
                <Button onClick={onMobileClose} className="w-full">ดูผลลัพธ์ ({resultCount} รายการ)</Button>
              </div>
            </div>
          </aside>
        </>
      )}
      >
    </>
  );
};

export default NotebookProductFilter;

/* ═══════ Active Filter Chips ═══════ */
export const NotebookActiveFilterChips = ({
  filters,
  onFilterChange,
}: {
  filters: NotebookFilterState;
  onFilterChange: (f: NotebookFilterState) => void;
}) => {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.os !== "all") chips.push({ label: filters.os, onRemove: () => onFilterChange({ ...filters, os: "all" }) });
  if (filters.screenSize !== "all") {
    const s = nbScreenOptions.find((o) => o.id === filters.screenSize);
    chips.push({ label: s?.name || filters.screenSize, onRemove: () => onFilterChange({ ...filters, screenSize: "all" }) });
  }
  if (filters.cpuBrand !== "all") {
    const c = nbCpuOptions.find((o) => o.id === filters.cpuBrand);
    chips.push({ label: c?.name || filters.cpuBrand, onRemove: () => onFilterChange({ ...filters, cpuBrand: "all" }) });
  }
  if (filters.protection !== "all") {
    chips.push({ label: filters.protection, onRemove: () => onFilterChange({ ...filters, protection: "all" }) });
  }
  if (filters.priceRange !== "all") {
    const p = nbPriceOptions.find((o) => o.id === filters.priceRange);
    chips.push({ label: p?.name || filters.priceRange, onRemove: () => onFilterChange({ ...filters, priceRange: "all" }) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground shrink-0">ตัวกรอง:</span>
      {chips.map((chip) => (
        <button key={chip.label} onClick={chip.onRemove} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors group">
          {chip.label}
          <X className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
      >
      <button onClick={() => onFilterChange({ ...defaultNotebookFilters })} className="text-xs text-destructive hover:text-destructive/80 transition-colors underline underline-offset-2">
        ล้างทั้งหมด
      </button>
    </div>
  );
};

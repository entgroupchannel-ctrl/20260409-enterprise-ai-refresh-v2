import { X } from "lucide-react";
import { IBoxFilterState, defaultFilters, categoryOptions, cpuGenerations, portFilters } from "./IBoxProductFilter";

interface ActiveFilterChipsProps {
  filters: IBoxFilterState;
  onFilterChange: (filters: IBoxFilterState) => void;
}

const formFactorLabels: Record<string, string> = {
  fanless: "Fanless Box PC",
  mini: "Mini PC",
  compact: "Compact PC",
  embedded: "Embedded PC",
};

const performanceLabels: Record<string, string> = {
  entry: "Entry-level",
  mid: "Mid-range",
  high: "High-performance",
};

const ActiveFilterChips = ({ filters, onFilterChange }: ActiveFilterChipsProps) => {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.category !== "all") {
    const cat = categoryOptions.find((c) => c.id === filters.category);
    chips.push({
      label: cat?.name || filters.category,
      onRemove: () => onFilterChange({ ...filters, category: "all" }),
    });
  }

  if (filters.formFactor !== "all") {
    chips.push({
      label: formFactorLabels[filters.formFactor] || filters.formFactor,
      onRemove: () => onFilterChange({ ...filters, formFactor: "all" }),
    });
  }

  if (filters.performance !== "all") {
    chips.push({
      label: performanceLabels[filters.performance] || filters.performance,
      onRemove: () => onFilterChange({ ...filters, performance: "all" }),
    });
  }

  if (filters.cpuGen !== "all") {
    const cpu = cpuGenerations.find((c) => c.id === filters.cpuGen);
    chips.push({
      label: cpu?.name || filters.cpuGen,
      onRemove: () => onFilterChange({ ...filters, cpuGen: "all" }),
    });
  }

  if (filters.comPorts !== "all") {
    const port = portFilters.comPorts.find((p) => p.id === filters.comPorts);
    chips.push({
      label: `COM ${port?.name || filters.comPorts}`,
      onRemove: () => onFilterChange({ ...filters, comPorts: "all" }),
    });
  }

  if (filters.lanPorts !== "all") {
    const port = portFilters.lanPorts.find((p) => p.id === filters.lanPorts);
    chips.push({
      label: `LAN ${port?.name || filters.lanPorts}`,
      onRemove: () => onFilterChange({ ...filters, lanPorts: "all" }),
    });
  }

  if (filters.poe === true) {
    chips.push({
      label: "PoE Support",
      onRemove: () => onFilterChange({ ...filters, poe: null }),
    });
  }

  if (filters.pcie === true) {
    chips.push({
      label: "PCIe Expansion",
      onRemove: () => onFilterChange({ ...filters, pcie: null }),
    });
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
          {chip.label}
          <X className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
      <button
        onClick={() => onFilterChange({ ...defaultFilters })}
        className="text-xs text-destructive hover:text-destructive/80 transition-colors underline underline-offset-2">
        ล้างทั้งหมด
      </button>
    </div>
  );
};

export default ActiveFilterChips;

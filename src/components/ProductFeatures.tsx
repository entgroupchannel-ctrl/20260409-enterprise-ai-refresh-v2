import {
  Cpu, Network, Cable, Monitor, CircuitBoard, MemoryStick,
  HardDrive, Fan, Zap, Timer, Wifi, Shield, Box, Antenna,
  ScanLine, Thermometer, Weight, Ruler, type LucideIcon
} from "lucide-react";

export type FeatureItem = {
  icon: LucideIcon;
  label: string;
  detail?: string;
};

/** Map keywords to best-fit icons */
const iconMap: [RegExp, LucideIcon][] = [
  [/cpu|intel|celeron|core i|processor|h-series|tdp/i, Cpu],
  [/lan|ethernet|rj45|i225v|2\.5g/i, Network],
  [/com|rs232|rs422|rs485|db9|serial/i, Cable],
  [/hdmi|vga|display|triple|dual.*display|monitor/i, Monitor],
  [/gpio/i, CircuitBoard],
  [/ram|ddr|so-dimm|dimm|memory/i, MemoryStick],
  [/ssd|hdd|nvme|sata|m-sata|m\.2|storage/i, HardDrive],
  [/fanless|เงียบ|aluminum|alloy|โครง/i, Fan],
  [/9.?36v|ไฟ|phoenix|power|atx/i, Zap],
  [/awal|watchdog|wake.*lan|rtc/i, Timer],
  [/wifi|bluetooth|dual.band|เสาอากาศ/i, Wifi],
  [/sim|3g|4g|5g|lte|module/i, Antenna],
  [/wall.*mount|vesa|din.*rail/i, Box],
  [/ip6[5-9]|waterproof|กันน้ำ|ทนฝุ่น/i, Shield],
  [/scan|barcode/i, ScanLine],
  [/อุณหภูมิ|temperature|°c/i, Thermometer],
  [/kg|น้ำหนัก|weight/i, Weight],
  [/mm|ขนาด|dimension|size/i, Ruler],
];

function pickIcon(text: string): LucideIcon {
  for (const [re, Icon] of iconMap) {
    if (re.test(text)) return Icon;
  }
  return Shield;
}

/** Auto-assign icons from plain text features */
export function autoFeatures(items: string[]): FeatureItem[] {
  return items.map((text) => ({
    icon: pickIcon(text),
    label: text,
  }));
}

interface ProductFeaturesProps {
  title?: string;
  features: FeatureItem[] | string[];
  columns?: 1 | 2;
}

const ProductFeatures = ({ title = "Products Features", features, columns = 2 }: ProductFeaturesProps) => {
  const resolved: FeatureItem[] =
    typeof features[0] === "string"
      ? autoFeatures(features as string[])
      : (features as FeatureItem[]);

  return (
    <div className="card-surface overflow-hidden">
      <div className="p-5 border-b border-border">
        <h4 className="font-display font-bold text-foreground text-lg">{title}</h4>
      </div>
      <div className={`grid gap-0 divide-y divide-border ${columns === 2 ? "md:grid-cols-2 md:divide-y-0" : ""}`}>
        {resolved.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/30 ${
                columns === 2 && i % 2 === 0 ? "md:border-r md:border-border" : ""
              } ${columns === 2 && i >= 2 ? "md:border-t md:border-border" : ""}`}
              >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                <Icon size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug">{feat.label}</p>
                {feat.detail && (
                  <p className="text-xs text-muted-foreground mt-0.5">{feat.detail}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFeatures;

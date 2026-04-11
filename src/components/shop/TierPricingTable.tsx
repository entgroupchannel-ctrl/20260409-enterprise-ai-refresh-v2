import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface PriceTier {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
  discount: string;
  label: string;
}

interface TierPricingProps {
  basePrice: number;
  basePriceVat?: number;
  tiers?: PriceTier[];
  selectedQuantity?: number;
  onQuantityChange?: (qty: number) => void;
}

const defaultTiers = (basePrice: number): PriceTier[] => [
  { minQty: 1, maxQty: 4, pricePerUnit: basePrice, discount: '', label: '1-4 ชิ้น' },
  { minQty: 5, maxQty: 9, pricePerUnit: Math.round(basePrice * 0.93), discount: '-7%', label: '5-9 ชิ้น' },
  { minQty: 10, maxQty: 49, pricePerUnit: Math.round(basePrice * 0.86), discount: '-14%', label: '10-49 ชิ้น' },
  { minQty: 50, maxQty: null, pricePerUnit: 0, discount: 'สอบถาม', label: '50+ ชิ้น' },
];

function fmt(n: number) {
  return n.toLocaleString('th-TH');
}

export default function TierPricingTable({ basePrice, tiers, selectedQuantity = 1 }: TierPricingProps) {
  const activeTiers = tiers || defaultTiers(basePrice);

  const activeTierIdx = activeTiers.findIndex(t =>
    selectedQuantity >= t.minQty && (t.maxQty === null || selectedQuantity <= t.maxQty)
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Tag className="w-4 h-4" />
        <span>ราคาขายส่ง (Volume Pricing)</span>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        {activeTiers.map((tier, idx) => {
          const isActive = idx === activeTierIdx;
          const savings = tier.pricePerUnit > 0 ? (basePrice - tier.pricePerUnit) * (selectedQuantity >= tier.minQty ? selectedQuantity : tier.minQty) : 0;

          return (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                isActive ? "bg-primary/10 border-l-4 border-l-primary" : "border-l-4 border-l-transparent",
                idx < activeTiers.length - 1 && "border-b border-border"
              )}
            >
              <span className={cn("font-medium", isActive && "text-primary")}>{tier.label}</span>
              <div className="flex items-center gap-3">
                {tier.pricePerUnit > 0 ? (
                  <>
                    <span className={cn("font-bold", isActive && "text-primary")}>฿{fmt(tier.pricePerUnit)}/ชิ้น</span>
                    {tier.discount && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {tier.discount}
                      </Badge>
                    )}
                  </>
                ) : (
                  <span className="text-primary font-medium">ขอราคาพิเศษ</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">ราคาก่อน VAT 7%</p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Percent, Banknote } from 'lucide-react';

interface Props {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  onChange: (percent: number, amount: number) => void;
  onBlur?: () => void;
  disabled?: boolean;
  label?: string;
  compact?: boolean;
}

type Mode = 'percent' | 'baht';

export default function DiscountInput({
  subtotal,
  discountPercent,
  discountAmount,
  onChange,
  onBlur,
  disabled = false,
  label = 'ส่วนลดรวมทั้งใบเสนอราคา',
  compact = false,
}: Props) {
  const [mode, setMode] = useState<Mode>('percent');
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (mode === 'percent') {
      setDisplayValue(discountPercent > 0 ? String(discountPercent) : '');
    } else {
      setDisplayValue(discountAmount > 0 ? String(discountAmount) : '');
    }
  }, [mode, discountPercent, discountAmount]);

  const handleModeSwitch = (newMode: Mode) => {
    if (newMode === mode) return;
    setMode(newMode);
  };

  const handleInputChange = (val: string) => {
    setDisplayValue(val);
    const numVal = val === '' ? 0 : parseFloat(val);
    if (isNaN(numVal)) {
      onChange(0, 0);
      return;
    }

    if (mode === 'percent') {
      const clampedPercent = Math.max(0, Math.min(100, numVal));
      const amount = subtotal * (clampedPercent / 100);
      onChange(clampedPercent, Math.round(amount * 100) / 100);
    } else {
      const clampedAmount = Math.max(0, Math.min(subtotal, numVal));
      const percent = subtotal > 0 ? (clampedAmount / subtotal) * 100 : 0;
      onChange(Math.round(percent * 100) / 100, clampedAmount);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const hasDiscount = discountPercent > 0 || discountAmount > 0;

  const content = (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          type="number"
          min="0"
          max={mode === 'percent' ? '100' : subtotal}
          step="0.01"
          value={displayValue}
          placeholder="0.00"
          className="max-w-[180px]"
          disabled={disabled || (mode === 'baht' && subtotal <= 0)}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={onBlur}
        />
        <div className="inline-flex rounded-md border border-border overflow-hidden">
          <Button
            type="button"
            variant={mode === 'percent' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'h-9 px-3 rounded-none',
              mode === 'percent' && 'bg-primary text-primary-foreground'
            )}
            onClick={() => handleModeSwitch('percent')}
            disabled={disabled}
          >
            <Percent className="w-3.5 h-3.5 mr-1" />
            %
          </Button>
          <Button
            type="button"
            variant={mode === 'baht' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'h-9 px-3 rounded-none border-l border-border',
              mode === 'baht' && 'bg-primary text-primary-foreground'
            )}
            onClick={() => handleModeSwitch('baht')}
            disabled={disabled || subtotal <= 0}
          >
            <Banknote className="w-3.5 h-3.5 mr-1" />
            ฿
          </Button>
        </div>
      </div>

      {hasDiscount && subtotal > 0 && (
        <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2 flex-wrap">
          <span className="font-medium">= -฿{formatCurrency(discountAmount)}</span>
          <span className="text-xs text-muted-foreground">
            {mode === 'percent'
              ? `(${discountPercent.toFixed(2)}%)`
              : `(คิดเป็น ${discountPercent.toFixed(2)}%)`}
          </span>
        </div>
      )}

      {subtotal <= 0 && (
        <p className="text-xs text-muted-foreground">
          ต้องเพิ่มสินค้าก่อนจึงจะใส่ส่วนลดได้
        </p>
      )}
    </div>
  );

  if (compact) return content;

  return (
    <div className="p-4 bg-muted/30 rounded-lg border border-border">
      <Label className="text-sm font-medium text-foreground mb-2 block">{label}</Label>
      {content}
    </div>
  );
}

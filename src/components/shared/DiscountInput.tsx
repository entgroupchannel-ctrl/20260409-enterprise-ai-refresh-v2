import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Percent, Banknote } from 'lucide-react';

interface Props {
  /** Subtotal (after line-item discounts, before overall discount) */
  subtotal: number;
  
  /** Current discount percentage (0-100) */
  discountPercent: number;
  
  /** Current discount amount in baht */
  discountAmount: number;
  
  /** 
   * Called when value changes.
   * Both percent and amount are provided.
   * Parent should store BOTH for accuracy.
   */
  onChange: (percent: number, amount: number) => void;
  
  /** Called on blur (for save-on-blur pattern) */
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
  
  // Track whether user is currently typing — don't override displayValue from props
  const isTypingRef = useRef(false);

  // Sync display value when external values change AND user is not typing
  useEffect(() => {
    if (isTypingRef.current) return;
    
    if (mode === 'percent') {
      setDisplayValue(discountPercent > 0 ? formatNumber(discountPercent) : '');
    } else {
      setDisplayValue(discountAmount > 0 ? formatNumber(discountAmount) : '');
    }
  }, [mode, discountPercent, discountAmount]);

  // Format number for display: strip trailing zeros after decimal
  const formatNumber = (n: number): string => {
    if (n === 0) return '';
    return parseFloat(n.toFixed(2)).toString();
  };

  // Handle mode switch — preserve equivalent value
  const handleModeSwitch = (newMode: Mode) => {
    if (newMode === mode || disabled) return;
    isTypingRef.current = false;
    setMode(newMode);
  };

  // Handle text input — accept any input, validate on blur
  const handleInputChange = (raw: string) => {
    isTypingRef.current = true;
    
    if (raw === '') {
      setDisplayValue('');
      onChange(0, 0);
      return;
    }
    
    // Allow only digits and one decimal point
    const cleaned = raw.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const sanitized = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('') 
      : cleaned;
    
    setDisplayValue(sanitized);
    
    const numVal = parseFloat(sanitized);
    if (isNaN(numVal) || numVal < 0) {
      onChange(0, 0);
      return;
    }
    
    if (mode === 'percent') {
      const clampedPercent = Math.min(100, numVal);
      const exactAmount = subtotal * clampedPercent / 100;
      const roundedAmount = Math.round(exactAmount * 100) / 100;
      onChange(clampedPercent, roundedAmount);
    } else {
      const clampedAmount = Math.min(subtotal, numVal);
      const exactPercent = subtotal > 0 ? (clampedAmount / subtotal) * 100 : 0;
      const roundedPercent = Math.round(exactPercent * 10000) / 10000;
      onChange(roundedPercent, clampedAmount);
    }
  };

  const handleBlur = () => {
    isTypingRef.current = false;
    
    if (mode === 'percent') {
      setDisplayValue(discountPercent > 0 ? formatNumber(discountPercent) : '');
    } else {
      setDisplayValue(discountAmount > 0 ? formatNumber(discountAmount) : '');
    }
    
    if (onBlur) onBlur();
  };

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(n);

  const hasDiscount = discountPercent > 0 || discountAmount > 0;

  const content = (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          type="text"
          inputMode="decimal"
          value={displayValue}
          placeholder={mode === 'percent' ? '0' : '0.00'}
          className="max-w-[180px]"
          disabled={disabled || (mode === 'baht' && subtotal <= 0)}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleBlur}
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
          <span className="font-medium">= -฿{fmtCurrency(discountAmount)}</span>
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

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Percent, Banknote } from 'lucide-react';

export type DiscountType = 'percent' | 'baht';

interface Props {
  /** Subtotal (after line-item discounts) — used for display only */
  subtotal: number;
  
  /** Discount type */
  discountType: DiscountType;
  
  /** Discount value (interpreted by type) */
  discountValue: number;
  
  /** 
   * Called when value or type changes.
   * Parent stores type + value directly.
   */
  onChange: (type: DiscountType, value: number) => void;
  
  /** Called on blur (for save-on-blur pattern) */
  onBlur?: () => void;
  
  disabled?: boolean;
  label?: string;
  compact?: boolean;
}

export default function DiscountInput({
  subtotal,
  discountType,
  discountValue,
  onChange,
  onBlur,
  disabled = false,
  label = 'ส่วนลดรวมทั้งใบเสนอราคา',
  compact = false,
}: Props) {
  const [displayValue, setDisplayValue] = useState<string>('');
  const isTypingRef = useRef(false);

  // Sync display value when external value changes (and not typing)
  useEffect(() => {
    if (isTypingRef.current) return;
    setDisplayValue(discountValue > 0 ? formatNumber(discountValue) : '');
  }, [discountValue, discountType]);

  // Strip trailing zeros for clean display
  const formatNumber = (n: number): string => {
    if (n === 0) return '';
    return parseFloat(n.toFixed(2)).toString();
  };

  // Handle type switch — value resets to 0 (intentional)
  const handleTypeSwitch = (newType: DiscountType) => {
    if (newType === discountType || disabled) return;
    isTypingRef.current = false;
    onChange(newType, 0);
  };

  const handleInputChange = (raw: string) => {
    isTypingRef.current = true;
    
    if (raw === '') {
      setDisplayValue('');
      onChange(discountType, 0);
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
      onChange(discountType, 0);
      return;
    }
    
    // Clamp based on type
    const clamped = discountType === 'percent'
      ? Math.min(100, numVal)
      : Math.min(subtotal, numVal);
    
    onChange(discountType, clamped);
  };

  const handleBlur = () => {
    isTypingRef.current = false;
    setDisplayValue(discountValue > 0 ? formatNumber(discountValue) : '');
    if (onBlur) onBlur();
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(n);

  // Calculate the OTHER value for display reference only
  const computedAmount = discountType === 'percent'
    ? subtotal * discountValue / 100
    : discountValue;
  
  const computedPercent = discountType === 'baht' && subtotal > 0
    ? (discountValue / subtotal) * 100
    : discountValue;

  const hasDiscount = discountValue > 0;

  const content = (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          type="text"
          inputMode="decimal"
          value={displayValue}
          placeholder={discountType === 'percent' ? '0' : '0.00'}
          className="max-w-[180px]"
          disabled={disabled || (discountType === 'baht' && subtotal <= 0)}
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleBlur}
        />
        
        <div className="inline-flex rounded-md border border-border overflow-hidden">
          <Button
            type="button"
            variant={discountType === 'percent' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'h-9 px-3 rounded-none',
              discountType === 'percent' && 'bg-primary text-primary-foreground'
            )}
            onClick={() => handleTypeSwitch('percent')}
            disabled={disabled}
          >
            <Percent className="w-3.5 h-3.5 mr-1" />
            %
          </Button>
          <Button
            type="button"
            variant={discountType === 'baht' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              'h-9 px-3 rounded-none border-l border-border',
              discountType === 'baht' && 'bg-primary text-primary-foreground'
            )}
            onClick={() => handleTypeSwitch('baht')}
            disabled={disabled || subtotal <= 0}
          >
            <Banknote className="w-3.5 h-3.5 mr-1" />
            ฿
          </Button>
        </div>
      </div>

      {hasDiscount && subtotal > 0 && (
        <div className="text-sm text-green-600 dark:text-green-400">
          {discountType === 'percent' ? (
            <span>= -฿{formatCurrency(computedAmount)}</span>
          ) : (
            <span>
              = ส่วนลด <strong>฿{formatCurrency(discountValue)}</strong>
              <span className="text-xs text-muted-foreground ml-2">
                (≈ {computedPercent.toFixed(2)}%)
              </span>
            </span>
          )}
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

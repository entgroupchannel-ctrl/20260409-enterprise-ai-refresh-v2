import { ShoppingCart, FileText } from 'lucide-react';
import { getPendingQuote } from '@/hooks/usePendingQuote';
import { useMemo } from 'react';

export function PendingItemsBanner() {
  const pending = useMemo(() => getPendingQuote(), []);
  const cartRaw = useMemo(() => {
    try {
      const raw = localStorage.getItem('cart_guest');
      return raw ? JSON.parse(raw) as any[] : [];
    } catch { return []; }
  }, []);

  const hasPending = pending && pending.products.length > 0;
  const hasCart = cartRaw.length > 0;

  if (!hasPending && !hasCart) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <ShoppingCart className="w-4 h-4" />
        <span>มีรายการรอดำเนินการ</span>
      </div>
      <p className="text-xs text-muted-foreground pl-6">
        {hasPending && (
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            ใบเสนอราคา {pending.products.length} รายการ
          </span>
        )}
        {hasCart && (
          <span className="flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" />
            ตะกร้า {cartRaw.length} รายการ
          </span>
        )}
      </p>
      <p className="text-[11px] text-muted-foreground pl-6">
        เข้าสู่ระบบเพื่อดำเนินการต่อ — ข้อมูลจะถูกกู้คืนอัตโนมัติ
      </p>
    </div>
  );
}

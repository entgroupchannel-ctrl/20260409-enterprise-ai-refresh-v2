import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface CartBadgeProps {
  className?: string;
  iconClassName?: string;
}

export default function CartBadge({ className = '', iconClassName = 'w-5 h-5' }: CartBadgeProps) {
  const { count } = useCart();

  return (
    <Link to="/cart" className={`relative inline-flex items-center ${className}`} aria-label="ตะกร้าสินค้า">
      <ShoppingCart className={iconClassName} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

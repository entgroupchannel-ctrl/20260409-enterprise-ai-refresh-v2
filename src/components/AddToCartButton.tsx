import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

interface AddToCartButtonProps {
  productModel: string;
  productName?: string;
  productDescription?: string;
  estimatedPrice?: number;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showQuantity?: boolean;
  iconOnly?: boolean;
}

export default function AddToCartButton({
  productModel,
  productName,
  productDescription,
  estimatedPrice,
  variant = 'default',
  size = 'default',
  className = '',
  showQuantity = false,
  iconOnly = false,
}: AddToCartButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart({
        model: productModel,
        name: productName,
        description: productDescription,
        quantity: qty,
        price: estimatedPrice,
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showQuantity && (
        <div className="flex items-center border border-border rounded-md">
          <button className="px-2 py-1 hover:bg-muted transition-colors" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14} /></button>
          <span className="px-2 text-sm font-medium min-w-[2rem] text-center">{qty}</span>
          <button className="px-2 py-1 hover:bg-muted transition-colors" onClick={() => setQty(qty + 1)}><Plus size={14} /></button>
        </div>
      )}
      <Button variant={variant} size={iconOnly ? 'icon' : size} onClick={handleAdd} disabled={adding} title="เพิ่มเข้าตะกร้า">
        <ShoppingCart className={iconOnly ? "w-4 h-4" : "w-4 h-4 mr-2"} />
        {!iconOnly && (adding ? 'กำลังเพิ่ม...' : 'เพิ่มเข้าตะกร้า')}
      </Button>
    </div>
  );
}

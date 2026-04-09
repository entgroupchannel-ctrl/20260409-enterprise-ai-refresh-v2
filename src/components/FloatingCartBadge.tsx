import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingCart, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function FloatingCartBadge() {
  const { items, count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!user || items.length === 0 || isDismissed) return null;

  const totalPrice = items.reduce((sum, item) => {
    return sum + ((item.estimated_price || 0) * item.quantity);
  }, 0);

  const firstModel = items[0]?.product_model || '';

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl shadow-2xl overflow-hidden max-w-[400px]">
        <div className="p-5 relative">
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
            aria-label="ปิด"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-lg">
                {items.length} รุ่น ({count} ชิ้น)
                {totalPrice > 0 && (
                  <span className="ml-2">฿{totalPrice.toLocaleString()}</span>
                )}
              </p>
              <p className="text-sm text-white/90">{firstModel}</p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/cart')}
            className="w-full bg-white text-teal-600 hover:bg-white/90 font-semibold shadow-lg"
            size="lg"
          >
            สร้างใบเสนอราคา
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-xs text-white/80 mt-3 text-center leading-relaxed">
            + เลือกสินค้ารุ่นอื่นเพิ่มได้ แล้วค่อยมาสร้างใบเสนอราคารวมกันได้เลย
          </p>
        </div>
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Minus, Plus, X, Send, Loader2 } from 'lucide-react';

interface QuoteProduct {
  model: string;
  description: string;
  qty: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
}

interface SelectedProductsPanelProps {
  products: QuoteProduct[];
  onUpdateQty: (index: number, qty: number) => void;
  onRemove: (index: number) => void;
  onClearAll: () => void;
  onSubmit: () => void;
  submitting: boolean;
  canSubmit: boolean;
}

export default function SelectedProductsPanel({
  products, onUpdateQty, onRemove, onClearAll, onSubmit, submitting, canSubmit,
}: SelectedProductsPanelProps) {
  const totalQty = products.reduce((sum, p) => sum + p.qty, 0);

  return (
    <div className="overflow-y-auto pr-1">
      <div className="sticky top-0 bg-background pb-3 mb-3 z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            สินค้าที่เลือก ({products.length})
          </h3>
          {products.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="h-6 text-xs text-destructive hover:text-destructive">
              ล้างทั้งหมด
            </Button>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center">
          <ShoppingCart className="w-14 h-14 mx-auto mb-3 text-muted-foreground opacity-20" />
          <p className="text-sm text-muted-foreground mb-1">ยังไม่มีสินค้า</p>
          <p className="text-xs text-muted-foreground">ค้นหาและเพิ่มสินค้าจากคอลัมน์กลาง</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            {products.map((product, index) => (
              <div key={index} className="p-3 border border-border rounded-lg bg-muted/20">
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{product.model}</p>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onRemove(index)}>
                    <X className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdateQty(index, product.qty - 1)}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={product.qty}
                    onChange={(e) => onUpdateQty(index, parseInt(e.target.value) || 1)}
                    className="h-6 w-14 text-center text-sm"
                  />
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdateQty(index, product.qty + 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground">เครื่อง</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">จำนวนสินค้า:</span>
              <span className="font-medium">{totalQty} เครื่อง</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">รายการทั้งหมด:</span>
              <span className="font-medium">{products.length} รายการ</span>
            </div>
          </div>

          <Button onClick={onSubmit} disabled={!canSubmit || submitting} className="w-full">
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังส่ง...</>
            ) : (
              <><Send className="w-4 h-4 mr-2" /> ส่งคำขอ ({products.length} รายการ)</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

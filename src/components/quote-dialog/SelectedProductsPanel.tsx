import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Minus, Plus, X, Send, Loader2, Star } from 'lucide-react';

interface QuoteProduct {
  model: string;
  description: string;
  qty: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  specs?: string;
}

interface SelectedProductsPanelProps {
  products: QuoteProduct[];
  onUpdateQty: (index: number, qty: number) => void;
  onUpdateSpecs: (index: number, specs: string) => void;
  onRemove: (index: number) => void;
  onClearAll: () => void;
  onSubmit: () => void;
  submitting: boolean;
  canSubmit: boolean;
  primaryModel?: string;
}

export default function SelectedProductsPanel({
  products, onUpdateQty, onUpdateSpecs, onRemove, onClearAll, onSubmit, submitting, canSubmit, primaryModel,
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
            {products.map((product, index) => {
              const isPrimary = product.model === primaryModel;
              return (
                <div
                  key={index}
                  className={`p-3 border rounded-lg ${isPrimary ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-muted/20'}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {isPrimary && <Star className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />}
                        <p className="font-semibold text-sm truncate">{product.model}</p>
                      </div>
                      {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                      )}
                      {isPrimary && (
                        <span className="text-[10px] text-primary font-medium">สินค้าหลัก</span>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onRemove(index)}>
                      <X className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground w-12">จำนวน:</span>
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

                  {/* Spec / Notes per product */}
                  <Textarea
                    placeholder={isPrimary ? "ระบุสเปกเพิ่มเติม เช่น RAM 16GB, SSD 512GB..." : "หมายเหตุ (ถ้ามี)"}
                    value={product.specs || ''}
                    onChange={(e) => onUpdateSpecs(index, e.target.value)}
                    rows={isPrimary ? 2 : 1}
                    className="text-xs resize-none"
                  />
                </div>
              );
            })}
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

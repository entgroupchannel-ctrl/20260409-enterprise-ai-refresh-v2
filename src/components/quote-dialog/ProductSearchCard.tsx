import { Button } from '@/components/ui/button';
import { Package, Plus, Check } from 'lucide-react';
import type { CatalogProduct } from '@/lib/product-catalog';

interface ProductSearchCardProps {
  product: CatalogProduct;
  isAdded: boolean;
  onAdd: () => void;
}

export default function ProductSearchCard({ product, isAdded, onAdd }: ProductSearchCardProps) {
  return (
    <div className="p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all">
      <div className="flex items-start gap-3">
        {product.image ? (
          <img
            src={product.image}
            alt={product.model}
            className="w-12 h-12 object-contain rounded border border-border bg-background shrink-0"
           loading="lazy" decoding="async"/>
        ) : (
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-0.5">{product.model}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{product.name}</p>
          {product.price && (
            <p className="text-xs font-semibold text-primary">{product.price}</p>
          )}
        </div>

        <Button
          variant={isAdded ? 'secondary' : 'outline'}
          size="sm"
          onClick={onAdd}
          disabled={isAdded}
          className="shrink-0 h-7 text-xs"
        >
          {isAdded ? (
            <><Check className="w-3 h-3 mr-1" /> เพิ่มแล้ว</>
          ) : (
            <><Plus className="w-3 h-3 mr-1" /> เพิ่ม</>
          )}
        </Button>
      </div>
    </div>
  );
}

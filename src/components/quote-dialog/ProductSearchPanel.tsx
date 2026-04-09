import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, Loader2, Lightbulb } from 'lucide-react';
import { searchCatalogProducts, getCatalogCategories, type CatalogProduct } from '@/lib/product-catalog';
import ProductSearchCard from './ProductSearchCard';

interface ProductSearchPanelProps {
  selectedModels: string[];
  relatedProducts: CatalogProduct[];
  onAddProduct: (product: CatalogProduct) => void;
}

export default function ProductSearchPanel({ selectedModels, relatedProducts, onAddProduct }: ProductSearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CatalogProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    ...getCatalogCategories().map((c) => ({ id: c, label: c })),
  ];

  const doSearch = useCallback((query: string, category: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const results = searchCatalogProducts(query, 10, category);
    setSearchResults(results.filter((r) => !selectedModels.includes(r.model)));
    setIsSearching(false);
  }, [selectedModels]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (searchQuery.length >= 2) {
      setIsSearching(true);
      timerRef.current = setTimeout(() => doSearch(searchQuery, selectedCategory), 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [searchQuery, selectedCategory, doSearch]);

  return (
    <div className="overflow-y-auto pr-2 border-x border-border px-4">
      <div className="sticky top-0 bg-background pb-3 mb-3 space-y-3 z-10">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Search className="w-4 h-4" />
          ค้นหาสินค้า
        </h3>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหารุ่นสินค้า, ชื่อ..."
            className="pl-10 h-9"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="h-6 text-xs px-2"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {searchQuery.length >= 2 ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {isSearching ? 'กำลังค้นหา...' : `พบ ${searchResults.length} รายการ`}
          </p>
          {searchResults.length === 0 && !isSearching ? (
            <div className="py-10 text-center">
              <Package className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">ไม่พบสินค้า</p>
              <p className="text-xs text-muted-foreground mt-1">ลองค้นหาด้วยคำอื่น</p>
            </div>
          ) : (
            searchResults.map((product) => (
              <ProductSearchCard
                key={product.model}
                product={product}
                isAdded={selectedModels.includes(product.model)}
                onAdd={() => onAddProduct(product)}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="font-medium">แนะนำสินค้า</span>
          </div>
          {relatedProducts.map((product) => (
            <ProductSearchCard
              key={product.model}
              product={product}
              isAdded={selectedModels.includes(product.model)}
              onAdd={() => onAddProduct(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

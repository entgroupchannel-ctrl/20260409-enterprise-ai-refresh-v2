import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, Loader2, Lightbulb, LayoutGrid } from 'lucide-react';
import { searchCatalogProducts, getCatalogCategories, browseCatalogProducts, type CatalogProduct } from '@/lib/product-catalog';
import ProductSearchCard from './ProductSearchCard';

interface ProductSearchPanelProps {
  selectedModels: string[];
  relatedProducts: CatalogProduct[];
  onAddProduct: (product: CatalogProduct) => void;
  compact?: boolean;
}

export default function ProductSearchPanel({ selectedModels, relatedProducts, onAddProduct, compact }: ProductSearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CatalogProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showBrowse, setShowBrowse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const categories = useMemo(() => [
    { id: 'all', label: 'ทั้งหมด' },
    ...getCatalogCategories().map((c) => ({ id: c, label: c })),
  ], []);

  // Browse products for the selected category
  const browseProducts = useMemo(() => {
    if (!showBrowse && searchQuery.length < 2) return [];
    return browseCatalogProducts(selectedCategory, 30);
  }, [showBrowse, selectedCategory, searchQuery]);

  const doSearch = useCallback((query: string, category: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const results = searchCatalogProducts(query, 20, category);
    setSearchResults(results.filter((r) => !selectedModels.includes(r.model)));
    setIsSearching(false);
  }, [selectedModels]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (searchQuery.length >= 2) {
      setIsSearching(true);
      setShowBrowse(false);
      timerRef.current = setTimeout(() => doSearch(searchQuery, selectedCategory), 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [searchQuery, selectedCategory, doSearch]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (showBrowse || searchQuery.length >= 2) {
      // Re-trigger search with new category
    }
  };

  const containerClass = compact
    ? 'overflow-y-auto max-h-[60vh]'
    : 'overflow-y-auto pr-2 border-x border-border px-4';

  const displayProducts = searchQuery.length >= 2 ? searchResults : (showBrowse ? browseProducts : []);

  return (
    <div className={containerClass}>
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
              onClick={() => handleCategoryChange(cat.id)}
              className="h-6 text-xs px-2"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Browse all button */}
        {searchQuery.length < 2 && !showBrowse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBrowse(true)}
            className="w-full h-7 text-xs text-primary"
          >
            <LayoutGrid className="w-3 h-3 mr-1.5" />
            ดูสินค้าทั้งหมดในระบบ
          </Button>
        )}
      </div>

      {searchQuery.length >= 2 || showBrowse ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {isSearching ? 'กำลังค้นหา...' : `พบ ${displayProducts.length} รายการ`}
          </p>
          {displayProducts.length === 0 && !isSearching ? (
            <div className="py-10 text-center">
              <Package className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">ไม่พบสินค้า</p>
              <p className="text-xs text-muted-foreground mt-1">ลองค้นหาด้วยคำอื่น</p>
            </div>
          ) : (
            displayProducts.map((product) => (
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
          {relatedProducts.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm mb-3">
                <Lightbulb className="w-4 h-4 text-primary" />
                <span className="font-medium">สินค้าแนะนำ</span>
              </div>
              {relatedProducts.map((product) => (
                <ProductSearchCard
                  key={product.model}
                  product={product}
                  isAdded={selectedModels.includes(product.model)}
                  onAdd={() => onAddProduct(product)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

import { useState, useCallback } from "react";
import { ShoppingCart, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuoteDialog from "@/components/QuoteDialog";

interface MultiSelectQuoteBarProps {
  selectedProducts: Set<string>;
  onClear: () => void;
  productCategory: string;
}

const MultiSelectQuoteBar = ({ selectedProducts, onClear, productCategory }: MultiSelectQuoteBarProps) => {
  const [showDialog, setShowDialog] = useState(false);

  if (selectedProducts.size === 0 && !showDialog) return null;

  return (
    <>
      {selectedProducts.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground rounded-full shadow-2xl px-6 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold text-sm">{selectedProducts.size} รุ่น</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full font-bold"
            onClick={() => setShowDialog(true)}
          >
            <FileText className="w-4 h-4 mr-1.5" /> ขอใบเสนอราคารวม
          </Button>
          <button onClick={onClear} className="p-1 hover:bg-primary-foreground/20 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <QuoteDialog
        open={showDialog}
        onClose={() => { setShowDialog(false); onClear(); }}
        productCategory={productCategory}
        initialProducts={Array.from(selectedProducts).map(name => ({
          category: productCategory,
          model: name,
          qty: 1,
        }))}
      />
    </>
  );
};

export default MultiSelectQuoteBar;

/** Hook to manage multi-select state */
export function useMultiSelect() {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((name: string) => {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedProducts(new Set()), []);

  return { selectedProducts, toggleSelect, clearSelection };
}

import { useState, useCallback, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface QuoteCartItem {
  id: string;
  model: string;
  category: string;
  productName: string;
  qty: number;
  unitPrice: number;
  catalogProductId: string | null;
  specs: Record<string, string>;
}

interface QuoteCartContext {
  items: QuoteCartItem[];
  totalItems: number;
  addProduct: (model: string, category: string, productName: string, qty?: number) => Promise<void>;
  removeProduct: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartCtx = createContext<QuoteCartContext>({
  items: [],
  totalItems: 0,
  addProduct: async () => {},
  removeProduct: () => {},
  updateQty: () => {},
  clearCart: () => {},
});

export const useQuoteCart = () => useContext(CartCtx);

// SessionStorage key
const CART_KEY = "ent_quote_cart";

const loadCart = (): QuoteCartItem[] => {
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveCart = (items: QuoteCartItem[]) => {
  try { sessionStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* silent */ }
};

export const QuoteCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<QuoteCartItem[]>(loadCart);

  // Persist to sessionStorage
  useEffect(() => { saveCart(items); }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const addProduct = useCallback(async (model: string, category: string, productName: string, qty = 1) => {
    // Check if already in cart
    const existing = items.find(
      (item) => item.model.toLowerCase() === model.toLowerCase()
    );
    if (existing) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === existing.id ? { ...item, qty: item.qty + qty } : item
        )
      );
      return;
    }

    // Try to find in product_catalog for price mapping
    let catalogProductId: string | null = null;
    let unitPrice = 0;
    let specs: Record<string, string> = {};

    try {
      // Search by model (exact match first, then partial)
      const { data } = await (supabase.from as any)("product_catalog")
        .select("id, model, base_price, specs")
        .eq("is_active", true)
        .ilike("model", model)
        .limit(1);

      if (data && data.length > 0) {
        catalogProductId = data[0].id;
        unitPrice = data[0].base_price || 0;
        specs = data[0].specs || {};
      } else {
        // Try partial match
        const { data: partial } = await (supabase.from as any)("product_catalog")
          .select("id, model, base_price, specs")
          .eq("is_active", true)
          .ilike("model", `%${model}%`)
          .limit(1);

        if (partial && partial.length > 0) {
          catalogProductId = partial[0].id;
          unitPrice = partial[0].base_price || 0;
          specs = partial[0].specs || {};
        }
      }
    } catch { /* silent — price will be 0, admin will set later */ }

    const newItem: QuoteCartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      model,
      category,
      productName,
      qty,
      unitPrice,
      catalogProductId,
      specs,
    };

    setItems((prev) => [...prev, newItem]);
  }, [items]);

  const removeProduct = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartCtx.Provider value={{ items, totalItems, addProduct, removeProduct, updateQty, clearCart }}>
      {children}
    </CartCtx.Provider>
  );
};

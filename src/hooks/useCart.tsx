import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  user_id: string;
  product_model: string;
  product_name: string | null;
  product_description: string | null;
  quantity: number;
  estimated_price: number | null;
  added_at: string;
  updated_at: string;
}

interface CartContextValue {
  items: CartItem[];
  loading: boolean;
  count: number;
  addToCart: (product: { model: string; name?: string; description?: string; quantity?: number; price?: number }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data } = await (supabase.from as any)('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });
    setItems((data as CartItem[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (product: { model: string; name?: string; description?: string; quantity?: number; price?: number }) => {
    if (!user) return;
    const qty = product.quantity || 1;

    // Check existing
    const { data: existing } = await (supabase.from as any)('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_model', product.model)
      .maybeSingle();

    if (existing) {
      await (supabase.from as any)('cart_items')
        .update({ quantity: existing.quantity + qty })
        .eq('id', existing.id);
    } else {
      await (supabase.from as any)('cart_items')
        .insert({
          user_id: user.id,
          product_model: product.model,
          product_name: product.name || null,
          product_description: product.description || null,
          quantity: qty,
          estimated_price: product.price || null,
        });
    }

    toast({ title: 'เพิ่มเข้าตะกร้าแล้ว', description: `${product.model} x ${qty}` });
    await fetchCart();
  }, [user, fetchCart, toast]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    await (supabase.from as any)('cart_items').update({ quantity }).eq('id', itemId);
    await fetchCart();
  }, [fetchCart]);

  const removeItem = useCallback(async (itemId: string) => {
    await (supabase.from as any)('cart_items').delete().eq('id', itemId);
    await fetchCart();
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    if (!user) return;
    await (supabase.from as any)('cart_items').delete().eq('user_id', user.id);
    setItems([]);
  }, [user]);

  return (
    <CartContext.Provider value={{ items, loading, count: items.reduce((s, i) => s + i.quantity, 0), addToCart, updateQuantity, removeItem, clearCart, refresh: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};

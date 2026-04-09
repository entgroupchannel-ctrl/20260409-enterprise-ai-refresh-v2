import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'pendingQuote';

export interface PendingQuoteData {
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_company: string | null;
  notes: string | null;
  products: Array<{
    model: string;
    description: string;
    qty: number;
    unit_price: number;
    discount_percent: number;
    line_total: number;
  }>;
}

export function savePendingQuote(data: PendingQuoteData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearPendingQuote() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getPendingQuote(): PendingQuoteData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Hook: auto-submits a pending quote after user logs in.
 * Call this in Login/Register pages or any page where user lands after auth.
 */
export function useAutoSubmitPendingQuote(userId: string | undefined) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!userId || submittingRef.current) return;

    const pending = getPendingQuote();
    if (!pending) return;

    submittingRef.current = true;
    clearPendingQuote();

    (async () => {
      try {
        const { data, error } = await (supabase.from as any)('quote_requests')
          .insert({
            quote_number: '',
            customer_name: pending.customer_name,
            customer_email: pending.customer_email,
            customer_phone: pending.customer_phone,
            customer_company: pending.customer_company,
            notes: pending.notes,
            products: pending.products,
            status: 'pending',
            subtotal: 0,
            vat_amount: 0,
            grand_total: 0,
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: 'ส่งคำขอใบเสนอราคาสำเร็จ',
          description: `เลขที่ ${data.quote_number} — เราจะติดต่อกลับภายใน 24 ชม.`,
        });

        setTimeout(() => navigate('/my-quotes'), 1200);
      } catch (error: any) {
        toast({
          title: 'ไม่สามารถส่งคำขอได้',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        submittingRef.current = false;
      }
    })();
  }, [userId]);
}

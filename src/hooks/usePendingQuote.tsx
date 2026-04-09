const STORAGE_KEY = 'pendingQuote';

export interface PendingQuoteProduct {
  model: string;
  description: string;
  qty: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
}

export interface PendingQuoteData {
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_company: string | null;
  notes: string | null;
  products: PendingQuoteProduct[];
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

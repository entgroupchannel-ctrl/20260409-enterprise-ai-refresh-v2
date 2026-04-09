import { formatDistance } from "date-fns";
import { th } from "date-fns/locale";

/** Format number as Thai Baht currency */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(amount);

/** Status color tokens */
export const getStatusColor = (status: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    pending:     { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
    quote_sent:  { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    po_uploaded: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    po_approved: { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
    completed:   { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200" },
    rejected:    { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200" },
  };
  return colors[status] || colors.pending;
};

/** Status Thai label */
export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: "รอตอบกลับ",
    quote_sent: "ส่งราคาแล้ว",
    po_uploaded: "รอตรวจ PO",
    po_approved: "อนุมัติแล้ว",
    completed: "เสร็จสิ้น",
    rejected: "ปฏิเสธ",
  };
  return labels[status] || status;
};

/** Calculate SLA remaining time */
export const calculateSLARemaining = (dueDate: Date) => {
  const diff = dueDate.getTime() - Date.now();
  const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
  const minutes = Math.floor((Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes, isUrgent: hours < 12 && diff >= 0, isBreached: diff < 0 };
};

/** Relative time in Thai */
export const formatRelativeTime = (date: Date | string): string =>
  formatDistance(new Date(date), new Date(), { addSuffix: true, locale: th });

/** Quote product type */
export interface QuoteProduct {
  model: string;
  description: string;
  category: string;
  qty: number;
  unit_price: number;
  discount_percent: number;
  discount_amount?: number;
  line_total: number;
  notes?: string;
}

/** Quote request type */
export interface QuoteRequest {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  customer_address?: string;
  customer_tax_id?: string;
  products: QuoteProduct[];
  subtotal?: number;
  discount_percent?: number;
  discount_amount?: number;
  vat_percent?: number;
  vat_amount?: number;
  grand_total?: number;
  status: string;
  assigned_to?: string;
  created_by?: string;
  valid_until?: string;
  payment_terms?: string;
  delivery_terms?: string;
  warranty_terms?: string;
  notes?: string;
  internal_notes?: string;
  sla_response_due?: string;
  sla_po_review_due?: string;
  sla_breached?: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  viewed_at?: string;
  po_uploaded_at?: string;
  approved_at?: string;
  rejected_at?: string;
  completed_at?: string;
}

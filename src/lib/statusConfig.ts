/**
 * Centralized status configuration for quote/PO/SO workflows.
 * Used by StatusBadge and any component that needs status labels or colors.
 */

export type QuoteStatus =
  | 'draft'
  | 'pending'
  | 'quote_sent'
  | 'negotiating'
  | 'accepted'
  | 'po_uploaded'
  | 'po_confirmed'
  | 'po_approved'
  | 'completed'
  | 'rejected'
  | 'expired'
  | 'cancelled'
  | 'on_hold';

interface StatusConfig {
  th: string;
  en: string;
  color: string; // Tailwind classes for badge styling (light + dark)
}

export const statusConfig: Record<string, StatusConfig> = {
  draft: {
    th: 'ร่าง',
    en: 'Draft',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400',
  },
  pending: {
    th: 'รอใบเสนอราคา',
    en: 'Pending Quote',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  quote_sent: {
    th: 'ส่งราคาแล้ว',
    en: 'Quote Sent',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  negotiating: {
    th: 'กำลังต่อรอง',
    en: 'Negotiating',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  accepted: {
    th: 'ลูกค้ารับราคาแล้ว',
    en: 'Accepted',
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  },
  po_uploaded: {
    th: 'รอตรวจสอบ PO',
    en: 'PO Under Review',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
  po_confirmed: {
    th: 'ยืนยัน PO แล้ว',
    en: 'PO Confirmed',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  po_approved: {
    th: 'อนุมัติแล้ว',
    en: 'Approved',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  completed: {
    th: 'เสร็จสิ้น',
    en: 'Completed',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  rejected: {
    th: 'ปฏิเสธ',
    en: 'Rejected',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  expired: {
    th: 'หมดอายุ',
    en: 'Expired',
    color: 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-400',
  },
  cancelled: {
    th: 'ยกเลิก',
    en: 'Cancelled',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400',
  },
  on_hold: {
    th: 'พักไว้ชั่วคราว',
    en: 'On Hold',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
};

export const getStatusLabel = (status: string, lang: 'th' | 'en' = 'th'): string => {
  return statusConfig[status]?.[lang] || status;
};

export const getStatusColor = (status: string): string => {
  return statusConfig[status]?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400';
};

/** Sale Order statuses */
export const soStatusConfig: Record<string, StatusConfig> = {
  draft: {
    th: 'ร่าง',
    en: 'Draft',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400',
  },
  confirmed: {
    th: 'ยืนยันแล้ว',
    en: 'Confirmed',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  preparing: {
    th: 'กำลังจัดเตรียม',
    en: 'Preparing',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  ready_to_ship: {
    th: 'พร้อมจัดส่ง',
    en: 'Ready to Ship',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
  shipped: {
    th: 'จัดส่งแล้ว',
    en: 'Shipped',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  delivered: {
    th: 'ส่งมอบแล้ว',
    en: 'Delivered',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  completed: {
    th: 'เสร็จสมบูรณ์',
    en: 'Completed',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  cancelled: {
    th: 'ยกเลิก',
    en: 'Cancelled',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  in_production: {
    th: 'กำลังจัดเตรียม',
    en: 'In Production',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  processing: {
    th: 'กำลังดำเนินการ',
    en: 'Processing',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
};

export const getSOStatusLabel = (status: string, lang: 'th' | 'en' = 'th'): string => {
  return soStatusConfig[status]?.[lang] || status;
};

export const getSOStatusColor = (status: string): string => {
  return soStatusConfig[status]?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400';
};

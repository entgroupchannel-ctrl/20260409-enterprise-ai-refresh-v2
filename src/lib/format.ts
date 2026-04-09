/** Format number as Thai Baht currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format date in Thai locale */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/** Format datetime in Thai locale */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/** Calculate time remaining */
export function timeRemaining(dueDate: string | Date): { hours: number; minutes: number; overdue: boolean } {
  const diff = new Date(dueDate).getTime() - Date.now();
  const overdue = diff < 0;
  const absDiff = Math.abs(diff);
  return {
    hours: Math.floor(absDiff / (1000 * 60 * 60)),
    minutes: Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60)),
    overdue,
  };
}

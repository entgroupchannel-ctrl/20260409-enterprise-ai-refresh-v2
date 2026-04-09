/** Format number as Thai Baht currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format date in Thai locale (Bangkok timezone) */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(date));
}

/** Format datetime in Thai locale (Bangkok timezone) */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(new Date(date));
}

/** Format short date dd MMM yyyy (Bangkok timezone) */
export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(date));
}

/** Format short datetime dd MMM yyyy HH:mm (Bangkok timezone) */
export function formatShortDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(new Date(date));
}

/** Format full date dd MMMM yyyy (Bangkok timezone) */
export function formatFullDate(date: string | Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(date));
}

/** Format time only HH:mm (Bangkok timezone) */
export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
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

/** Relative time in Thai (e.g. "2 นาทีที่แล้ว") - timezone-safe */
export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const absDiff = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  const minutes = Math.floor(absDiff / 60000);
  const hours = Math.floor(absDiff / 3600000);
  const days = Math.floor(absDiff / 86400000);

  let text: string;
  if (minutes < 1) text = "เมื่อสักครู่";
  else if (minutes < 60) text = `${minutes} นาที`;
  else if (hours < 24) text = `${hours} ชั่วโมง`;
  else if (days < 30) text = `${days} วัน`;
  else text = formatShortDate(date);

  if (minutes < 1) return text;
  return isFuture ? `ใน ${text}` : `${text}ที่แล้ว`;
}

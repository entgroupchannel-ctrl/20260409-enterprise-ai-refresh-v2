import { cn } from "@/lib/utils";
import { Check, Clock, FileText, Send, Package, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

const steps = [
  { key: "pending", label: "รอใบเสนอราคา", icon: Clock },
  { key: "quote_sent", label: "ได้รับราคาแล้ว", icon: Send },
  { key: "po_confirmed", label: "ส่ง PO แล้ว", icon: FileText },
  { key: "po_approved", label: "อนุมัติแล้ว", icon: Check },
  { key: "completed", label: "เสร็จสิ้น", icon: Package },
];

const statusOrder: Record<string, number> = {
  pending: 0,
  quote_sent: 1,
  po_uploaded: 1, // same as quote_sent (files uploaded but not sent yet)
  po_confirmed: 2,
  po_approved: 3,
  completed: 4,
  rejected: -1,
};

interface QuoteTimelineProps {
  currentStatus: string;
  size?: "sm" | "md" | "lg";
}

export default function QuoteTimeline({ currentStatus, size = "sm" }: QuoteTimelineProps) {
  const currentIndex = statusOrder[currentStatus] ?? 0;
  const isRejected = currentStatus === "rejected";

  if (isRejected) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-destructive">
        <XCircle className="w-5 h-5" />
        <span className="font-semibold">ไม่อนุมัติ</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "rounded-full flex items-center justify-center transition-colors",
                  size === "lg" ? "w-10 h-10" : size === "md" ? "w-9 h-9" : "w-8 h-8",
                  isDone && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary/20 text-primary ring-2 ring-primary",
                  !isDone && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? (
                  <CheckCircle2 className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
                ) : (
                  <Icon className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
                )}
              </div>
              <span
                className={cn(
                  "mt-1 text-center whitespace-nowrap",
                  size === "lg" ? "text-xs" : size === "md" ? "text-[11px]" : "text-[10px]",
                  isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mt-[-1rem]",
                  index < currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Badge variant for list views
const badgeColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  quote_sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  po_uploaded: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  po_confirmed: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  po_approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const badgeLabels: Record<string, string> = {
  pending: "รอใบเสนอราคา",
  quote_sent: "ได้รับราคาแล้ว",
  po_uploaded: "ส่ง PO แล้ว",
  po_confirmed: "ยืนยันคำสั่งซื้อแล้ว",
  po_approved: "อนุมัติแล้ว",
  completed: "เสร็จสิ้น",
  rejected: "ไม่อนุมัติ",
};

export function QuoteTimelineBadge({ currentStatus }: { currentStatus: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        badgeColors[currentStatus] || badgeColors.pending
      )}
    >
      {badgeLabels[currentStatus] || currentStatus}
    </span>
  );
}

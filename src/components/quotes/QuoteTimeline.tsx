import { Check, Clock, FileText, Send, Upload, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/lib/quote-utils";

const steps = [
  { key: "pending", label: "รอตอบกลับ", icon: Clock },
  { key: "quote_sent", label: "ส่งราคาแล้ว", icon: Send },
  { key: "po_uploaded", label: "อัปโหลด PO", icon: Upload },
  { key: "po_approved", label: "อนุมัติแล้ว", icon: ThumbsUp },
  { key: "completed", label: "เสร็จสิ้น", icon: Check },
];

interface QuoteTimelineProps {
  currentStatus: string;
  className?: string;
}

const QuoteTimeline = ({ currentStatus, className }: QuoteTimelineProps) => {
  const currentIdx = steps.findIndex((s) => s.key === currentStatus);
  const isRejected = currentStatus === "rejected";

  return (
    <div className={cn("flex items-center gap-1 overflow-x-auto py-2", className)}>
      {steps.map((step, i) => {
        const Icon = step.icon;
        const done = i <= currentIdx && !isRejected;
        const active = i === currentIdx && !isRejected;
        const colors = getStatusColor(done ? step.key : "pending");

        return (
          <div key={step.key} className="flex items-center gap-1 shrink-0">
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                done ? `${colors.bg} ${colors.text} ${colors.border}` : "bg-secondary text-muted-foreground border-border",
                active && "ring-2 ring-primary/30"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("w-6 h-0.5 rounded", done ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
      {isRejected && (
        <div className="flex items-center gap-1 shrink-0">
          <div className="w-6 h-0.5 rounded bg-destructive" />
          <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
            ปฏิเสธ
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteTimeline;

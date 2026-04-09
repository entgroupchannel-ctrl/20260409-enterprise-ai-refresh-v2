import { cn } from "@/lib/utils";
import { Clock, AlertTriangle } from "lucide-react";
import { calculateSLARemaining } from "@/lib/quote-utils";

interface SLABadgeProps {
  dueDate: Date | string;
  breached?: boolean;
}

const SLABadge = ({ dueDate, breached = false }: SLABadgeProps) => {
  const { hours, minutes, isUrgent, isBreached } = calculateSLARemaining(new Date(dueDate));

  if (breached || isBreached) {
    return (
      <div className="flex items-center gap-1.5 text-destructive text-xs font-medium">
        <AlertTriangle className="w-3.5 h-3.5" />
        เกินกำหนดแล้ว!
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5 text-xs font-medium", {
      "text-destructive": isUrgent,
      "text-orange-600": hours < 24 && !isUrgent,
      "text-muted-foreground": hours >= 24,
    })}>
      <Clock className="w-3.5 h-3.5" />
      SLA: {hours} ชม. {minutes} นาที
    </div>
  );
};

export default SLABadge;

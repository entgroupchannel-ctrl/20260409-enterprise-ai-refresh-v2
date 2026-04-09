import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  count: number;
  value?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "urgent" | "warning" | "success";
  onClick?: () => void;
}

const MetricsCard = ({ title, count, value, icon, trend, trendValue, variant = "default", onClick }: MetricsCardProps) => (
  <Card
    className={cn("cursor-pointer transition-all hover:shadow-lg", {
      "border-destructive/30 bg-destructive/5": variant === "urgent",
      "border-orange-300 bg-orange-50 dark:bg-orange-950/20": variant === "warning",
      "border-green-300 bg-green-50 dark:bg-green-950/20": variant === "success",
    })}
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon && <div className="text-2xl">{icon}</div>}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-foreground">{count}</div>
      {value && <p className="text-sm text-muted-foreground mt-1">{value}</p>}
      {trend && trendValue && (
        <div className={cn("text-xs mt-2 flex items-center gap-1", {
          "text-green-600": trend === "up",
          "text-destructive": trend === "down",
          "text-muted-foreground": trend === "neutral",
        })}>
          {trend === "up" && "↑"}{trend === "down" && "↓"}{trend === "neutral" && "→"}
          {trendValue}
        </div>
      )}
    </CardContent>
  </Card>
);

export default MetricsCard;

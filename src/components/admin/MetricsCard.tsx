import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  count: number;
  value?: string;
  icon?: ReactNode;
  variant?: 'default' | 'urgent' | 'warning' | 'success';
  onClick?: () => void;
}

export default function MetricsCard({
  title,
  count,
  value,
  icon,
  variant = 'default',
  onClick,
}: MetricsCardProps) {
  return (
    <Card
      className={cn(
        'transition-all hover:shadow-lg',
        onClick && 'cursor-pointer',
        {
          'border-destructive/30 bg-destructive/5': variant === 'urgent',
          'border-orange-300 bg-orange-50 dark:bg-orange-950/20': variant === 'warning',
          'border-green-300 bg-green-50 dark:bg-green-950/20': variant === 'success',
        }
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-2xl">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{count}</div>
        {value && <p className="text-sm text-muted-foreground mt-1">{value}</p>}
      </CardContent>
    </Card>
  );
}

import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuoteTimelineProps {
  status: string;
  compact?: boolean;
  className?: string;
}

export function QuoteTimeline({ status, compact = false, className }: QuoteTimelineProps) {
  const steps = [
    { key: 'pending', label: 'รอดำเนินการ' },
    { key: 'quote_sent', label: 'ส่งราคาแล้ว' },
    { key: 'po_uploaded', label: 'อัปโหลด PO' },
    { key: 'po_approved', label: 'อนุมัติ PO' },
    { key: 'completed', label: 'เสร็จสมบูรณ์' },
  ];

  const displayStatus = status === 'po_confirmed' ? 'po_uploaded' : status;
  const currentIndex = steps.findIndex(s => s.key === displayStatus);

  const isRejected = status === 'rejected';
  const isCancelled = status === 'cancelled';

  if (isRejected || isCancelled) {
    return (
      <div className={cn('flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg', className)}>
        <XCircle className="w-8 h-8 text-destructive flex-shrink-0" />
        <div>
          <p className="font-semibold text-destructive">
            {isRejected ? 'ใบเสนอราคาถูกปฏิเสธ' : 'ใบเสนอราคาถูกยกเลิก'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isRejected ? 'Quote ไม่ได้รับการอนุมัติ' : 'Quote ถูกยกเลิกแล้ว'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Steps row with connectors */}
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = currentIndex >= 0 && index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = currentIndex < 0 || index > currentIndex;
          // Connector is "active" if the step it leads to is completed or current
          const connectorActive = currentIndex >= 0 && index < currentIndex;

          const StepIcon = isCompleted ? CheckCircle2 : Circle;

          return (
            <div key={step.key} className="flex items-start flex-1 min-w-0">
              {/* Step circle + label */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'bg-primary/10 border-primary text-primary animate-pulse',
                    isUpcoming && 'bg-background border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                {!compact && (
                  <span
                    className={cn(
                      'text-xs mt-2 text-center max-w-[72px]',
                      isCompleted && 'text-primary font-medium',
                      isCurrent && 'text-foreground font-semibold',
                      isUpcoming && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                )}
              </div>

              {/* Connector line between this step and the next */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center self-start pt-[18px] px-1">
                  <div
                    className={cn(
                      'h-0.5 w-full rounded-full transition-colors',
                      connectorActive ? 'bg-primary' : 'bg-muted-foreground/20'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

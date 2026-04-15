import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const FULL_STEPS = ['pending', 'received', 'diagnosing', 'quoted', 'approved', 'repairing', 'done', 'delivered'];
const IN_WARRANTY_STEPS = ['pending', 'received', 'diagnosing', 'repairing', 'done', 'delivered'];

const STEP_LABELS: Record<string, string> = {
  pending: 'รอรับเครื่อง',
  received: 'รับเครื่องแล้ว',
  diagnosing: 'วิเคราะห์',
  quoted: 'เสนอราคา',
  approved: 'อนุมัติ',
  repairing: 'ซ่อม',
  done: 'เสร็จ',
  delivered: 'ส่งคืน',
};

interface Props {
  currentStatus: string;
  isChargeable: boolean;
  className?: string;
}

export default function RepairStatusTimeline({ currentStatus, isChargeable, className }: Props) {
  const steps = isChargeable ? FULL_STEPS : IN_WARRANTY_STEPS;
  const currentIdx = steps.indexOf(currentStatus);
  const isTerminal = ['rejected', 'cancelled'].includes(currentStatus);

  return (
    <div className={cn('flex items-center gap-1 overflow-x-auto py-2', className)}>
      {steps.map((step, i) => {
        const isCompleted = !isTerminal && currentIdx > i;
        const isCurrent = currentStatus === step;
        return (
          <div key={step} className="flex items-center">
            {i > 0 && (
              <div className={cn(
                'w-6 h-0.5 mx-0.5',
                isCompleted ? 'bg-primary' : 'bg-border'
              )} />
            )}
            <div className="flex flex-col items-center gap-1 min-w-[56px]">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all',
                isCompleted && 'bg-primary border-primary text-primary-foreground',
                isCurrent && 'border-primary bg-primary/10 text-primary ring-2 ring-primary/30 animate-pulse',
                !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground/50',
              )}>
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={cn(
                'text-[10px] leading-tight text-center whitespace-nowrap',
                isCurrent ? 'font-semibold text-primary' : 'text-muted-foreground',
              )}>
                {STEP_LABELS[step]}
              </span>
            </div>
          </div>
        );
      })}
      {isTerminal && (
        <div className="flex items-center">
          <div className="w-6 h-0.5 mx-0.5 bg-destructive/50" />
          <div className="flex flex-col items-center gap-1 min-w-[56px]">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 border-destructive bg-destructive/10 text-destructive">
              ✕
            </div>
            <span className="text-[10px] leading-tight text-center whitespace-nowrap font-semibold text-destructive">
              {currentStatus === 'rejected' ? 'ปฏิเสธ' : 'ยกเลิก'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

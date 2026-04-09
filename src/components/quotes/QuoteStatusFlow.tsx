import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { key: 'pending', label: 'ส่งคำขอ' },
  { key: 'quote_sent', label: 'ได้รับราคา' },
  { key: 'po_uploaded', label: 'ส่ง PO' },
  { key: 'po_approved', label: 'อนุมัติ' },
];

const STATUS_TO_STEP: Record<string, number> = {
  pending: 0,
  quote_sent: 1,
  po_uploaded: 2,
  po_approved: 3,
  completed: 4,
  rejected: -1,
};

interface QuoteStatusFlowProps {
  status: string;
  mini?: boolean;
  className?: string;
}

export default function QuoteStatusFlow({ status, mini = false, className }: QuoteStatusFlowProps) {
  const currentStep = STATUS_TO_STEP[status] ?? 0;
  const isRejected = status === 'rejected';

  if (mini) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {STEPS.map((step, index) => {
          const isCompleted = !isRejected && currentStep > index;
          const isCurrent = !isRejected && currentStep === index;

          return (
            <div key={step.key} className="flex items-center gap-1">
              {index > 0 && (
                <div className={cn('w-4 h-0.5', isCompleted ? 'bg-primary' : 'bg-border')} />
              )}
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-primary/10 border-primary text-primary'
                    : isRejected
                    ? 'bg-destructive/10 border-destructive/30 text-destructive'
                    : 'bg-muted border-border text-muted-foreground'
                )}
                title={step.label}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : isRejected && index === 0 ? (
                  <XCircle className="w-3 h-3" />
                ) : (
                  index + 1
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between relative">
        {STEPS.map((step, index) => {
          const isCompleted = !isRejected && currentStep > index;
          const isCurrent = !isRejected && currentStep === index;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
              {index > 0 && (
                <div
                  className={cn(
                    'absolute top-4 right-1/2 w-full h-0.5',
                    isCompleted ? 'bg-primary' : 'bg-border'
                  )}
                  style={{ zIndex: -1 }}
                />
              )}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-muted border-border text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs mt-2 font-medium text-center',
                  isCompleted || isCurrent ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground mt-3 text-center">
        {isRejected
          ? 'ใบเสนอราคาถูกปฏิเสธ'
          : status === 'completed'
          ? 'ดำเนินการเสร็จสิ้น'
          : status === 'pending'
          ? 'กำลังเตรียมใบเสนอราคา...'
          : status === 'quote_sent'
          ? 'รอลูกค้าตอบกลับ'
          : status === 'po_uploaded'
          ? 'มี PO รอตรวจสอบ'
          : status === 'po_approved'
          ? 'อนุมัติแล้ว รอดำเนินการ'
          : ''}
      </p>
    </div>
  );
}

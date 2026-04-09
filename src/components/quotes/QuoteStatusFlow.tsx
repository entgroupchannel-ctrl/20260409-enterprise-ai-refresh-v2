import { CheckCircle2 } from 'lucide-react';
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
  className?: string;
}

export default function QuoteStatusFlow({ status, className }: QuoteStatusFlowProps) {
  const currentStep = STATUS_TO_STEP[status] ?? 0;
  const isRejected = status === 'rejected';

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between relative">
        {STEPS.map((step, index) => {
          const isCompleted = !isRejected && currentStep > index;
          const isCurrent = !isRejected && currentStep === index;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
              {/* Connector line (before circle) */}
              {index > 0 && (
                <div
                  className={cn(
                    'absolute top-4 right-1/2 w-full h-0.5',
                    isCompleted ? 'bg-emerald-500' : 'bg-border'
                  )}
                  style={{ zIndex: -1 }}
                />
              )}

              {/* Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-primary/10 border-primary text-primary'
                    : isRejected && index > 0
                    ? 'bg-muted border-border text-muted-foreground'
                    : 'bg-muted border-border text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-xs mt-2 font-medium text-center',
                  isCompleted
                    ? 'text-emerald-600'
                    : isCurrent
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status message */}
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

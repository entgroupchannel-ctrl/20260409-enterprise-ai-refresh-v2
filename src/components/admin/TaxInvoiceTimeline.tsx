import { Clock, CircleCheckBig, Check, Ban } from 'lucide-react';

interface Props {
  currentStatus: string;
}

const STEPS = [
  { key: 'pending', label: 'รอดำเนินการ', icon: Clock },
  { key: 'partially_paid', label: 'ชำระบางส่วน', icon: CircleCheckBig },
  { key: 'paid', label: 'ชำระแล้ว', icon: Check },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  partially_paid: 1,
  paid: 2,
  cancelled: -1,
};

export default function TaxInvoiceTimeline({ currentStatus }: Props) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Ban className="w-3.5 h-3.5 text-gray-500" />
        <span className="line-through">ยกเลิกแล้ว</span>
      </div>
    );
  }

  const currentIndex = STATUS_INDEX[currentStatus] ?? 0;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx <= currentIndex;
        return (
          <div key={step.key} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                isActive
                  ? idx === STEPS.length - 1
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-gray-50 text-gray-400 border-gray-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <span className={`text-[10px] ${isActive ? 'text-blue-400' : 'text-gray-300'}`}>—</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

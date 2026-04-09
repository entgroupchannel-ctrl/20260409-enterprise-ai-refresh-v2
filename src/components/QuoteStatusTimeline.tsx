import { Check } from "lucide-react";

interface QuoteStatusTimelineProps {
  status: string;
  className?: string;
}

const STEPS = [
  { key: 'pending', label: 'ส่งคำขอ', shortLabel: 'คำขอ' },
  { key: 'quote_sent', label: 'ได้รับราคา', shortLabel: 'ราคา' },
  { key: 'po_uploaded', label: 'ส่ง PO', shortLabel: 'PO' },
  { key: 'po_approved', label: 'อนุมัติ', shortLabel: 'อนุมัติ' },
];

const QuoteStatusTimeline = ({ status, className = "" }: QuoteStatusTimelineProps) => {
  const currentIndex = STEPS.findIndex(s => s.key === status);
  const isCompleted = status === 'completed';
  const activeIndex = isCompleted ? STEPS.length - 1 : currentIndex;

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop: Full labels */}
      <div className="hidden sm:block">
        <div className="flex items-center gap-2 mb-3">
          {STEPS.map((step, idx) => {
            const isActive = idx <= activeIndex;
            const isCurrent = idx === activeIndex;
            
            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  isActive 
                    ? 'bg-primary border-primary' 
                    : 'bg-background border-border'
                }`}>
                  {isActive && (
                    <Check size={14} className="text-primary-foreground" strokeWidth={3} />
                  )}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                  )}
                </div>
                
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                    idx < activeIndex ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between">
          {STEPS.map((step, idx) => {
            const isActive = idx <= activeIndex;
            return (
              <div key={step.key} className="flex-1 text-center">
                <p className={`text-xs transition-colors ${
                  isActive 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground'
                }`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Compact version */}
      <div className="sm:hidden">
        <div className="flex items-center gap-1.5 mb-2">
          {STEPS.map((step, idx) => {
            const isActive = idx <= activeIndex;
            
            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                  isActive 
                    ? 'bg-primary border-primary' 
                    : 'bg-background border-border'
                }`}>
                  {isActive && (
                    <Check size={10} className="text-primary-foreground" strokeWidth={3} />
                  )}
                </div>
                
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 rounded transition-all ${
                    idx < activeIndex ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between">
          {STEPS.map((step, idx) => {
            const isActive = idx <= activeIndex;
            return (
              <div key={step.key} className="flex-1 text-center">
                <p className={`text-[10px] transition-colors ${
                  isActive 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground'
                }`}>
                  {step.shortLabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuoteStatusTimeline;
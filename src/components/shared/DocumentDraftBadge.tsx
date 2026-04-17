/**
 * DocumentDraftBadge
 * Shows unsaved status + Save / Discard buttons in document page headers.
 * Used by: QuoteDetail, InvoiceDetail, TaxInvoiceDetail, ReceiptDetail, CreditNoteDetail
 */
import { Cloud, CloudOff, Loader2, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  isDirty: boolean;
  saving: boolean;
  lastSaved: Date | null;
  onSave: () => void;
  onDiscard?: () => void;
  disabled?: boolean;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function DocumentDraftBadge({
  isDirty,
  saving,
  lastSaved,
  onSave,
  onDiscard,
  disabled,
}: Props) {
  if (saving) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>กำลังบันทึก...</span>
      </div>
    );
  }

  if (isDirty) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
          <CloudOff className="w-3.5 h-3.5" />
          <span>ยังไม่ได้บันทึก</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400"
          onClick={onDiscard}
          disabled={disabled}
        >
          <RotateCcw className="w-3 h-3" />
          ยกเลิก
        </Button>
        <Button
          size="sm"
          className="h-7 text-xs gap-1 bg-primary hover:bg-primary/90"
          onClick={onSave}
          disabled={disabled}
        >
          <Save className="w-3 h-3" />
          บันทึก
        </Button>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
        <Cloud className="w-3.5 h-3.5" />
        <span>บันทึกแล้ว {formatTime(lastSaved)}</span>
      </div>
    );
  }

  return null;
}

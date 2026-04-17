/**
 * DocumentNotesEditor
 * Reusable draft-aware notes editor for Invoice, TaxInvoice, Receipt, CreditNote.
 * Shows DocumentDraftBadge and saves only when user clicks บันทึก or leaves page.
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DocumentDraftBadge from '@/components/shared/DocumentDraftBadge';
import type { DocumentTable } from '@/hooks/useDocumentDraft';

interface Props {
  table: DocumentTable;
  id: string;
  initialNotes: string | null;
  initialInternalNotes?: string | null;
  showInternalNotes?: boolean;
  disabled?: boolean;
  onSaved?: () => void;
}

export default function DocumentNotesEditor({
  table,
  id,
  initialNotes,
  initialInternalNotes = null,
  showInternalNotes = true,
  disabled = false,
  onSaved,
}: Props) {
  const { toast } = useToast();
  const [notes, setNotes] = useState(initialNotes || '');
  const [internalNotes, setInternalNotes] = useState(initialInternalNotes || '');
  const [savedNotes, setSavedNotes] = useState(initialNotes || '');
  const [savedInternalNotes, setSavedInternalNotes] = useState(initialInternalNotes || '');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isDirty = notes !== savedNotes || internalNotes !== savedInternalNotes;

  const handleSave = async () => {
    setSaving(true);
    try {
      const patch: Record<string, string | null> = { notes: notes || null };
      if (showInternalNotes) patch.internal_notes = internalNotes || null;

      const { error } = await (supabase as any)
        .from(table)
        .update(patch)
        .eq('id', id);

      if (error) throw error;

      setSavedNotes(notes);
      setSavedInternalNotes(internalNotes);
      setLastSaved(new Date());
      toast({ title: '✅ บันทึกหมายเหตุแล้ว' });
      onSaved?.();
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setNotes(savedNotes);
    setInternalNotes(savedInternalNotes);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            หมายเหตุ
          </CardTitle>
          <DocumentDraftBadge
            isDirty={isDirty}
            saving={saving}
            lastSaved={lastSaved}
            onSave={handleSave}
            onDiscard={handleDiscard}
            disabled={disabled}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${id}-notes`} className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" />
            หมายเหตุสำหรับลูกค้า
            <span className="text-[10px] font-normal">(แสดงในเอกสารที่พิมพ์)</span>
          </Label>
          <Textarea
            id={`${id}-notes`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="เช่น: ขอบคุณที่ใช้บริการ, รายละเอียดเงื่อนไขเพิ่มเติม..."
            rows={3}
            disabled={disabled}
            className="text-sm resize-none"
          />
        </div>

        {showInternalNotes && (
          <div className="space-y-2">
            <Label htmlFor={`${id}-internal`} className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-600" />
              หมายเหตุภายใน
              <span className="text-[10px] font-normal text-amber-700">(เห็นเฉพาะทีมงาน)</span>
            </Label>
            <Textarea
              id={`${id}-internal`}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="บันทึกภายใน: ติดต่อลูกค้าทาง LINE, ลูกค้าขอแบ่งจ่าย, ฯลฯ"
              rows={3}
              disabled={disabled}
              className="text-sm resize-none border-amber-200 focus-visible:ring-amber-400 bg-amber-50/30"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lock, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InternalNotesEditorProps {
  quoteId: string;
  initialValue?: string | null;
  disabled?: boolean;
  onSaved?: () => void;
}

export default function InternalNotesEditor({
  quoteId,
  initialValue,
  disabled = false,
  onSaved,
}: InternalNotesEditorProps) {
  const { toast } = useToast();
  const [value, setValue] = useState(initialValue || '');
  const [saved, setSaved] = useState(initialValue || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(initialValue || '');
    setSaved(initialValue || '');
  }, [initialValue]);

  const isDirty = value !== saved;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('quote_requests')
        .update({ internal_notes: value || null })
        .eq('id', quoteId);
      if (error) throw error;
      setSaved(value);
      toast({ title: '✅ บันทึกหมายเหตุภายในแล้ว' });
      onSaved?.();
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            หมายเหตุภายในทีม
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-normal">
            🔒 ลูกค้าไม่เห็น
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 bg-muted/40 rounded-b-lg border-t border-border space-y-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="โน้ตภายใน เช่น: Margin, strategy, ประวัติลูกค้า..."
          rows={5}
          disabled={disabled}
          className="text-sm resize-none border border-amber-400/70 dark:border-amber-600/70 bg-amber-50/60 dark:bg-amber-950/30 focus-visible:border-amber-500 text-foreground font-medium"
        />
        {isDirty && (
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSave} disabled={saving || disabled}>
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

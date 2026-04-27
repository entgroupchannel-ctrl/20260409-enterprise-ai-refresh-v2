import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// (Select removed — replaced with chip buttons)
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard, Truck, ShieldCheck, Calendar, FileText, Lock,
} from 'lucide-react';
import DocumentDraftBadge from '@/components/shared/DocumentDraftBadge';

interface QuoteTermsEditorProps {
  quoteId: string;
  initialValues: {
    payment_terms?: string | null;
    delivery_terms?: string | null;
    warranty_terms?: string | null;
    notes?: string | null;
    internal_notes?: string | null;
    valid_until?: string | null;
  };
  disabled?: boolean;
  onSaved?: () => void;
  hideInternalNotes?: boolean;
}

interface Template {
  id: string;
  template_type: string;
  label: string;
  content: string;
  is_default: boolean;
}

export default function QuoteTermsEditor({
  quoteId,
  initialValues,
  disabled = false,
  onSaved,
  hideInternalNotes = false,
}: QuoteTermsEditorProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);

  // ── Local draft state ──────────────────────────────────────────────────────
  const [paymentTerms, setPaymentTerms] = useState(initialValues.payment_terms || '');
  const [deliveryTerms, setDeliveryTerms] = useState(initialValues.delivery_terms || '');
  const [warrantyTerms, setWarrantyTerms] = useState(initialValues.warranty_terms || '');
  const [notes, setNotes] = useState(initialValues.notes || '');
  const [internalNotes, setInternalNotes] = useState(initialValues.internal_notes || '');
  const [validUntil, setValidUntil] = useState(initialValues.valid_until || '');

  // Track saved snapshot to compute isDirty
  const [saved, setSaved] = useState({
    payment_terms: initialValues.payment_terms || '',
    delivery_terms: initialValues.delivery_terms || '',
    warranty_terms: initialValues.warranty_terms || '',
    notes: initialValues.notes || '',
    internal_notes: initialValues.internal_notes || '',
    valid_until: initialValues.valid_until || '',
  });
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isDirty =
    paymentTerms !== saved.payment_terms ||
    deliveryTerms !== saved.delivery_terms ||
    warrantyTerms !== saved.warranty_terms ||
    notes !== saved.notes ||
    internalNotes !== saved.internal_notes ||
    validUntil !== saved.valid_until;

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const { data } = await (supabase.from as any)('quote_term_templates')
          .select('*')
          .order('sort_order', { ascending: true });
        if (data) setTemplates(data);
      } catch (e) {
        console.info('Templates table not available');
      }
    };
    loadTemplates();
  }, []);

  useEffect(() => {
    if (templates.length === 0) return;
    if (!initialValues.payment_terms) {
      const d = templates.find(t => t.template_type === 'payment' && t.is_default);
      if (d) setPaymentTerms(d.content);
    }
    if (!initialValues.delivery_terms) {
      const d = templates.find(t => t.template_type === 'delivery' && t.is_default);
      if (d) setDeliveryTerms(d.content);
    }
    if (!initialValues.warranty_terms) {
      const d = templates.find(t => t.template_type === 'warranty' && t.is_default);
      if (d) setWarrantyTerms(d.content);
    }
    if (!initialValues.notes) {
      const d = templates.find(t => t.template_type === 'notes' && t.is_default);
      if (d) setNotes(d.content);
    }
    if (!initialValues.valid_until) {
      const future = new Date();
      future.setDate(future.getDate() + 14);
      setValidUntil(future.toISOString().split('T')[0]);
    }
  }, [templates]);

  // ── Flush all fields to DB ─────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({
          payment_terms: paymentTerms || null,
          delivery_terms: deliveryTerms || null,
          warranty_terms: warrantyTerms || null,
          notes: notes || null,
          internal_notes: internalNotes || null,
          valid_until: validUntil || null,
        } as any)
        .eq('id', quoteId);

      if (error) throw error;

      setSaved({
        payment_terms: paymentTerms,
        delivery_terms: deliveryTerms,
        warranty_terms: warrantyTerms,
        notes,
        internal_notes: internalNotes,
        valid_until: validUntil,
      });
      setLastSaved(new Date());
      toast({ title: '✅ บันทึกเงื่อนไขแล้ว' });
      onSaved?.();
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setPaymentTerms(saved.payment_terms);
    setDeliveryTerms(saved.delivery_terms);
    setWarrantyTerms(saved.warranty_terms);
    setNotes(saved.notes);
    setInternalNotes(saved.internal_notes);
    setValidUntil(saved.valid_until);
  };

  const getTemplatesByType = (type: string) => templates.filter(t => t.template_type === type);

  const applyTemplate = (type: string, templateId: string, setter: (v: string) => void) => {
    const template = templates.find(t => t.id === templateId);
    if (template) setter(template.content);
  };

  const setValidityDays = (days: number) => {
    const future = new Date();
    future.setDate(future.getDate() + days);
    setValidUntil(future.toISOString().split('T')[0]);
  };

  const daysUntilExpiry = validUntil
    ? Math.ceil((new Date(validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const renderTemplateChips = (type: string, setter: (v: string) => void) => {
    const tpls = getTemplatesByType(type);
    if (tpls.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1">
        {tpls.map(t => (
          <button
            key={t.id}
            type="button"
            disabled={disabled}
            onClick={() => setter(t.content)}
            className="text-[11px] px-2 py-0.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {t.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* ── Draft status bar ── */}
      <div className="flex items-center justify-between min-h-[28px]">
        <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-primary" />
          เงื่อนไขและหมายเหตุ
        </span>
        <DocumentDraftBadge
          isDirty={isDirty}
          saving={saving}
          lastSaved={lastSaved}
          onSave={handleSave}
          onDiscard={handleDiscard}
          disabled={disabled}
        />
      </div>

      {/* Customer-visible Terms */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            เงื่อนไข (ลูกค้าเห็น)
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-muted/40 rounded-b-lg border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium">
                <CreditCard className="w-3.5 h-3.5 text-green-600" />เงื่อนไขการชำระเงิน
              </Label>
              {renderTemplateChips('payment', setPaymentTerms)}
              <Textarea
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="เช่น: เงินสด / โอน / เช็ค ชำระก่อนส่งมอบ"
                rows={2} disabled={disabled}
                className="flex min-h-[80px] w-full rounded-md px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-sm resize-none border border-input focus-visible:border-primary text-foreground font-medium bg-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium">
                <Truck className="w-3.5 h-3.5 text-blue-600" />เงื่อนไขการจัดส่ง
              </Label>
              {renderTemplateChips('delivery', setDeliveryTerms)}
              <Textarea
                value={deliveryTerms}
                onChange={(e) => setDeliveryTerms(e.target.value)}
                placeholder="เช่น: จัดส่งฟรีในเขต กทม."
                rows={2} disabled={disabled}
                className="flex min-h-[80px] w-full rounded-md px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-sm resize-none border border-input focus-visible:border-primary text-foreground font-medium bg-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />เงื่อนไขการรับประกัน
              </Label>
              {renderTemplateChips('warranty', setWarrantyTerms)}
              <Textarea
                value={warrantyTerms}
                onChange={(e) => setWarrantyTerms(e.target.value)}
                placeholder="เช่น: รับประกัน 1 ปี"
                rows={2} disabled={disabled}
                className="flex min-h-[80px] w-full rounded-md px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-sm resize-none border border-input focus-visible:border-primary text-foreground font-medium bg-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />ใบเสนอราคามีผลถึง
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date" value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  disabled={disabled}
                  className="text-sm h-9 flex-1 border border-input bg-muted/60 dark:bg-muted/30 focus-visible:border-primary text-foreground font-medium"
                />
                {daysUntilExpiry !== null && (
                  <span className={`text-xs whitespace-nowrap ${daysUntilExpiry < 7 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                    {daysUntilExpiry > 0 ? `${daysUntilExpiry} วัน` : daysUntilExpiry === 0 ? '⚠️ วันนี้' : `⚠️ -${Math.abs(daysUntilExpiry)} วัน`}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {[7, 14, 30, 60].map(days => (
                  <Button key={days} size="sm" variant="outline"
                    onClick={() => setValidityDays(days)} disabled={disabled}
                    className="h-7 text-xs px-2 flex-1">+{days}</Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="flex items-center gap-1.5 text-xs font-medium">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />หมายเหตุเพิ่มเติม (ลูกค้าเห็น)
              </Label>
              {renderTemplateChips('notes', setNotes)}
              <Textarea
                value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="หมายเหตุทั่วไปที่ลูกค้าจะเห็น..."
                rows={2} disabled={disabled}
                className="flex min-h-[80px] w-full rounded-md px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-sm resize-none border border-input focus-visible:border-primary text-foreground font-medium bg-slate-100"
              />
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Internal Notes */}
      {!hideInternalNotes && (
        <Card className="border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                หมายเหตุภายในทีม (ลูกค้าไม่เห็น)
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-normal">
                🔒 admin/sales เท่านั้น
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 bg-muted/40 rounded-b-lg border-t border-border">
            <Textarea
              value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="โน้ตภายใน เช่น: Margin, strategy, ประวัติลูกค้า..."
              rows={3} disabled={disabled}
              className="text-sm resize-none bg-background border border-amber-400/70 dark:border-amber-600/70 bg-amber-50/60 dark:bg-amber-950/30 focus-visible:border-amber-500 text-foreground font-medium"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

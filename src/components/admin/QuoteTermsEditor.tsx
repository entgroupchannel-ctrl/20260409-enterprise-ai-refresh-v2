import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard, Truck, ShieldCheck, Calendar, FileText, Lock,
} from 'lucide-react';

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
}: QuoteTermsEditorProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);

  const [paymentTerms, setPaymentTerms] = useState(initialValues.payment_terms || '');
  const [deliveryTerms, setDeliveryTerms] = useState(initialValues.delivery_terms || '');
  const [warrantyTerms, setWarrantyTerms] = useState(initialValues.warranty_terms || '');
  const [notes, setNotes] = useState(initialValues.notes || '');
  const [internalNotes, setInternalNotes] = useState(initialValues.internal_notes || '');
  const [validUntil, setValidUntil] = useState(initialValues.valid_until || '');

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const { data } = await (supabase.from as any)('quote_term_templates')
          .select('*')
          .order('sort_order', { ascending: true });
        if (data) setTemplates(data);
      } catch (e) {
        console.info('Templates table not available, using free text only');
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

  const getTemplatesByType = (type: string) =>
    templates.filter(t => t.template_type === type);

  const saveField = async (field: string, value: string | null) => {
    try {
      const updateData: Record<string, string | null> = { [field]: value || null };
      const { error } = await supabase
        .from('quote_requests')
        .update(updateData as any)
        .eq('id', quoteId);
      if (error) throw error;
      onSaved?.();
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const applyTemplate = (type: string, templateId: string, setter: (v: string) => void, field: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setter(template.content);
      saveField(field, template.content);
    }
  };

  const setValidityDays = (days: number) => {
    const future = new Date();
    future.setDate(future.getDate() + days);
    const dateStr = future.toISOString().split('T')[0];
    setValidUntil(dateStr);
    saveField('valid_until', dateStr);
  };

  const daysUntilExpiry = validUntil
    ? Math.ceil((new Date(validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const renderTemplateSelect = (
    type: string,
    setter: (v: string) => void,
    field: string,
  ) => {
    const tpls = getTemplatesByType(type);
    if (tpls.length === 0) return null;
    return (
      <Select
        onValueChange={(v) => applyTemplate(type, v, setter, field)}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="เลือกจาก template หรือพิมพ์เอง" />
        </SelectTrigger>
        <SelectContent>
          {tpls.map(t => (
            <SelectItem key={t.id} value={t.id}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="space-y-4">
      {/* Customer-visible Terms — Grid layout */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            เงื่อนไขและหมายเหตุ (ลูกค้าเห็น)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">

            {/* Column 1, Row 1: Payment Terms */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium">
                <CreditCard className="w-3.5 h-3.5 text-green-600" />
                เงื่อนไขการชำระเงิน
              </Label>
              {renderTemplateSelect('payment', setPaymentTerms, 'payment_terms')}
              <Textarea
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                onBlur={() => saveField('payment_terms', paymentTerms)}
                placeholder="เช่น: เงินสด / โอน / เช็ค ชำระก่อนส่งมอบ"
                rows={2}
                disabled={disabled}
                className="text-sm resize-none"
              />
            </div>

            {/* Column 2, Row 1: Delivery Terms */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                เงื่อนไขการจัดส่ง
              </Label>
              {renderTemplateSelect('delivery', setDeliveryTerms, 'delivery_terms')}
              <Textarea
                value={deliveryTerms}
                onChange={(e) => setDeliveryTerms(e.target.value)}
                onBlur={() => saveField('delivery_terms', deliveryTerms)}
                placeholder="เช่น: จัดส่งฟรีในเขต กทม."
                rows={2}
                disabled={disabled}
                className="text-sm resize-none"
              />
            </div>

            {/* Column 1, Row 2: Warranty Terms */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                เงื่อนไขการรับประกัน
              </Label>
              {renderTemplateSelect('warranty', setWarrantyTerms, 'warranty_terms')}
              <Textarea
                value={warrantyTerms}
                onChange={(e) => setWarrantyTerms(e.target.value)}
                onBlur={() => saveField('warranty_terms', warrantyTerms)}
                placeholder="เช่น: รับประกัน 1 ปี"
                rows={2}
                disabled={disabled}
                className="text-sm resize-none"
              />
            </div>

            {/* Column 2, Row 2: Valid Until (compact) */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                ใบเสนอราคามีผลถึง
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  onBlur={() => saveField('valid_until', validUntil)}
                  disabled={disabled}
                  className="text-sm h-9 flex-1"
                />
                {daysUntilExpiry !== null && (
                  <span className={`text-xs whitespace-nowrap ${daysUntilExpiry < 7 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                    {daysUntilExpiry > 0
                      ? `${daysUntilExpiry} วัน`
                      : daysUntilExpiry === 0
                      ? '⚠️ วันนี้'
                      : `⚠️ -${Math.abs(daysUntilExpiry)} วัน`}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {[7, 14, 30, 60].map(days => (
                  <Button
                    key={days}
                    size="sm"
                    variant="outline"
                    onClick={() => setValidityDays(days)}
                    disabled={disabled}
                    className="h-7 text-xs px-2 flex-1"
                  >
                    +{days}
                  </Button>
                ))}
              </div>
            </div>

            {/* Full width row: Customer Notes */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="flex items-center gap-1.5 text-xs font-medium">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                หมายเหตุเพิ่มเติม (ลูกค้าเห็น)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-2">
                {renderTemplateSelect('notes', setNotes, 'notes')}
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => saveField('notes', notes)}
                  placeholder="หมายเหตุทั่วไปที่ลูกค้าจะเห็น..."
                  rows={2}
                  disabled={disabled}
                  className="text-sm resize-none"
                />
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Internal Notes — compact */}
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
        <CardContent className="pt-0">
          <Textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            onBlur={() => saveField('internal_notes', internalNotes)}
            placeholder="โน้ตภายใน เช่น: Margin, strategy, ประวัติลูกค้า..."
            rows={3}
            disabled={disabled}
            className="text-sm bg-background resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}

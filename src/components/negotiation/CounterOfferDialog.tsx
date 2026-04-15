import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProductEditor from '@/components/admin/ProductEditor';
import FreeItemsEditor, { type FreeItem } from './FreeItemsEditor';
import { Send, Save, AlertTriangle, Loader2 } from 'lucide-react';

interface CounterOfferDialogProps {
  quoteId: string;
  currentRevisionId?: string | null;
  negotiationRequestId?: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const calculateTotals = (
  products: any[], 
  discountPercent: number, 
  vatPercent: number,
  discountAmountOverride?: number
) => {
  const subtotal = (products || []).reduce((sum: number, p: any) => {
    const lineGross = (Number(p.qty) || 0) * (Number(p.unit_price) || 0);
    const lineDiscount = lineGross * ((Number(p.discount_percent) || 0) / 100);
    return sum + (lineGross - lineDiscount);
  }, 0);
  const discountAmount = discountAmountOverride !== undefined && discountAmountOverride > 0
    ? Math.min(subtotal, discountAmountOverride)
    : subtotal * (discountPercent / 100);
  const beforeVat = subtotal - discountAmount;
  const vatAmount = beforeVat * (vatPercent / 100);
  return { subtotal, discountAmount, beforeVat, vatAmount, grandTotal: beforeVat + vatAmount };
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

export default function CounterOfferDialog({
  quoteId,
  currentRevisionId,
  negotiationRequestId,
  open,
  onClose,
  onSuccess,
}: CounterOfferDialogProps) {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [freeItems, setFreeItems] = useState<FreeItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [vatPercent, setVatPercent] = useState(7);
  const [changeReason, setChangeReason] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingBase, setLoadingBase] = useState(false);

  // Load base data from current revision when dialog opens
  useEffect(() => {
    if (!open) return;

    const loadBase = async () => {
      setLoadingBase(true);
      try {
        if (currentRevisionId) {
          const { data } = await (supabase.from as any)('quote_revisions')
            .select('*')
            .eq('id', currentRevisionId)
            .single();

          if (data) {
            setProducts(data.products || []);
            setFreeItems(data.free_items || []);
            setDiscountPercent(data.discount_percent || 0);
            setDiscountAmount(data.discount_amount || 0);
            setVatPercent(data.vat_percent || 7);
            setValidUntil(data.valid_until || '');
          }
        } else {
          // Fallback: load from quote_requests
          const { data } = await supabase
            .from('quote_requests')
            .select('products, discount_percent, vat_percent, valid_until, free_items')
            .eq('id', quoteId)
            .single();

          if (data) {
            setProducts((data as any).products || []);
            setFreeItems((data as any).free_items || []);
            setDiscountPercent((data as any).discount_percent || 0);
            setDiscountAmount((data as any).discount_amount || 0);
            setVatPercent((data as any).vat_percent || 7);
            setValidUntil((data as any).valid_until || '');
          }
        }

        // Reset form fields
        setChangeReason('');
        setInternalNotes('');
      } catch (e) {
        console.error('Error loading base revision:', e);
      } finally {
        setLoadingBase(false);
      }
    };

    loadBase();
  }, [open, currentRevisionId, quoteId]);

  const totals = useMemo(
    () => calculateTotals(products, discountPercent, vatPercent, discountAmount),
    [products, discountPercent, vatPercent, discountAmount]
  );

  const freeItemsTotal = freeItems.reduce((s, fi) => s + (fi.total_value || 0), 0);
  const needsApproval = discountPercent > 8 || freeItemsTotal > 5000;

  const handleSave = async (sendToCustomer: boolean) => {
    if (!changeReason.trim()) {
      toast({ title: 'กรุณาระบุเหตุผล/ข้อความ', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      // Get user info
      const { data: userData } = await supabase.from('users').select('full_name, role').eq('id', authUser.id).single();

      // Get next revision number
      const { data: nextNum } = await supabase.rpc('get_next_revision_number', { p_quote_id: quoteId });
      const revisionNumber = nextNum || 1;

      const revisionStatus = sendToCustomer && !needsApproval ? 'sent' : 'draft';

      // Insert revision
      const { data: revData, error: revError } = await (supabase.from as any)('quote_revisions').insert({
        quote_id: quoteId,
        revision_number: revisionNumber,
        revision_type: revisionNumber === 1 ? 'initial' : 'admin_offer',
        created_by: authUser.id,
        created_by_name: userData?.full_name || authUser.email || 'Admin',
        created_by_role: userData?.role || 'admin',
        products: products,
        free_items: freeItems,
        subtotal: totals.subtotal,
        discount_percent: discountPercent,
        discount_amount: totals.discountAmount,
        vat_percent: vatPercent,
        vat_amount: totals.vatAmount,
        grand_total: totals.grandTotal,
        change_reason: changeReason,
        requires_approval: needsApproval,
        approval_status: needsApproval ? 'pending' : 'none',
        status: revisionStatus,
        sent_at: sendToCustomer && !needsApproval ? new Date().toISOString() : null,
        valid_until: validUntil || null,
        internal_notes: internalNotes || null,
      }).select('id').single();

      if (revError) throw revError;

      // ✅ Only update quote snapshot when actually sending (not for drafts)
      const shouldPublish = sendToCustomer && !needsApproval;

      if (shouldPublish) {
        const quoteUpdate: any = {
          current_revision_id: revData.id,
          current_revision_number: revisionNumber,
          total_revisions: revisionNumber,
          free_items: freeItems,
          products: products,
          subtotal: totals.subtotal,
          discount_percent: discountPercent,
          discount_amount: totals.discountAmount,
          vat_percent: vatPercent,
          vat_amount: totals.vatAmount,
          grand_total: totals.grandTotal,
          valid_until: validUntil || null,
          status: 'negotiating',
          sent_at: new Date().toISOString(),
        };
        await supabase.from('quote_requests').update(quoteUpdate).eq('id', quoteId);
      } else {
        // Draft — only bump total_revisions, don't touch quote snapshot
        await supabase.from('quote_requests').update({
          total_revisions: revisionNumber,
        }).eq('id', quoteId);
      }

      // Update negotiation request if linked
      if (negotiationRequestId) {
        await (supabase.from as any)('quote_negotiation_requests')
          .update({
            status: 'counter_offered',
            responded_by: authUser.id,
            responded_at: new Date().toISOString(),
            resulted_in_revision_id: revData.id,
          })
          .eq('id', negotiationRequestId);
      }

      // Send chat message
      if (sendToCustomer && !needsApproval) {
        await supabase.from('quote_messages').insert({
          quote_id: quoteId,
          sender_id: authUser.id,
          sender_name: userData?.full_name || 'Admin',
          sender_role: 'admin',
          content: `📤 ส่ง Revision ${revisionNumber} แล้ว — ${changeReason}`,
          message_type: 'revision',
        });
      }

      toast({
        title: sendToCustomer ? 'ส่ง Counter Offer แล้ว' : 'บันทึก Draft แล้ว',
        description: needsApproval ? '⚠️ ส่วนลดเกิน threshold — รอ Super Admin อนุมัติ' : undefined,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>✏️ สร้าง Counter Offer</DialogTitle>
        </DialogHeader>

        {loadingBase ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">กำลังโหลดข้อมูล...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Products */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">📦 รายการสินค้า</Label>
              <ProductEditor
                products={products}
                onUpdate={(updated) => setProducts(updated)}
                disabled={false}
              />
            </div>

            <Separator />

            {/* Free Items */}
            <FreeItemsEditor freeItems={freeItems} onChange={setFreeItems} />

            <Separator />

            {/* Discount + Valid Until */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">ส่วนลดรวม (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={discountPercent || ''}
                  placeholder="0"
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div>
                <Label className="text-sm">ราคานี้ใช้ได้ถึง</Label>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
            </div>

            {/* Approval warning */}
            {needsApproval && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  ⚠️ ส่วนลด {'>'}8% หรือของแถม {'>'} ฿5,000 — ต้องขออนุมัติจาก Super Admin ก่อนส่ง
                </p>
              </div>
            )}

            {/* Totals */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>ยอดสินค้า</span><span>{formatCurrency(totals.subtotal)}</span></div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ส่วนลด {discountPercent}%</span>
                  <span>-{formatCurrency(totals.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between"><span>ก่อน VAT</span><span>{formatCurrency(totals.beforeVat)}</span></div>
              <div className="flex justify-between"><span>VAT {vatPercent}%</span><span>{formatCurrency(totals.vatAmount)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>รวมสุทธิ</span>
                <span className="text-primary">{formatCurrency(totals.grandTotal)}</span>
              </div>
              {freeItemsTotal > 0 && (
                <div className="flex justify-between text-amber-600 text-xs">
                  <span>+ ของแถมมูลค่า</span>
                  <span>{formatCurrency(freeItemsTotal)} (ฟรี)</span>
                </div>
              )}
            </div>

            {/* Reason + Internal Notes */}
            <div>
              <Label className="text-sm">📝 เหตุผล / ข้อความถึงลูกค้า *</Label>
              <Textarea
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="เช่น: ลด 10% + แถมเมาส์ 5 ตัว ตามที่คุยกัน..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm">📌 หมายเหตุภายใน (ลูกค้าไม่เห็น)</Label>
              <Textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="เช่น: Margin เหลือ 12% — ลูกค้า repeat OK"
                rows={2}
                className="mt-1"
              />
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          💡 <strong>บันทึก Draft</strong> = เก็บไว้ ให้คุณกลับมาแก้/ส่งทีหลัง ลูกค้ายังไม่เห็น
          <br />
          📤 <strong>ส่งให้ลูกค้า</strong> = ส่งทันที ลูกค้าเห็นราคาใหม่ + รอตอบรับ
        </p>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>ยกเลิก</Button>
          <Button variant="secondary" onClick={() => handleSave(false)} disabled={saving || loadingBase}>
            <Save className="w-4 h-4 mr-1" />
            บันทึก Draft (ยังไม่ส่ง)
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving || loadingBase}>
            <Send className="w-4 h-4 mr-1" />
            {needsApproval ? 'บันทึกและขออนุมัติ' : 'บันทึกและส่งให้ลูกค้าเลย'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

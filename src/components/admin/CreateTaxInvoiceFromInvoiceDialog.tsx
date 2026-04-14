import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string | null;
  onSuccess?: (taxInvoiceId: string) => void;
}

export default function CreateTaxInvoiceFromInvoiceDialog({
  open, onOpenChange, invoiceId, onSuccess,
}: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [existingTaxInvoices, setExistingTaxInvoices] = useState<any[]>([]);

  const [taxInvoiceDate, setTaxInvoiceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open || !invoiceId) return;
    loadInvoice();
  }, [open, invoiceId]);

  useEffect(() => {
    if (!open) {
      setInvoice(null);
      setItems([]);
      setExistingTaxInvoices([]);
      setDeliveryAddress('');
      setDeliveryDate('');
      setDeliveryMethod('');
      setTrackingNumber('');
      setNotes('');
      setTaxInvoiceDate(new Date().toISOString().split('T')[0]);
    }
  }, [open]);

  const loadInvoice = async () => {
    if (!invoiceId) return;
    setLoading(true);
    try {
      const [invRes, itemsRes, taxRes] = await Promise.all([
        (supabase as any).from('invoices').select('*').eq('id', invoiceId).maybeSingle(),
        (supabase as any).from('invoice_items').select('*').eq('invoice_id', invoiceId).order('display_order'),
        (supabase as any).from('tax_invoices').select('id, tax_invoice_number, tax_invoice_date, grand_total').eq('invoice_id', invoiceId).order('created_at', { ascending: false }),
      ]);

      if (invRes.error) throw invRes.error;
      if (itemsRes.error) throw itemsRes.error;
      if (taxRes.error) throw taxRes.error;

      setInvoice(invRes.data);
      setItems(itemsRes.data || []);
      setExistingTaxInvoices(taxRes.data || []);

      if (invRes.data?.customer_address) {
        setDeliveryAddress(invRes.data.customer_address);
      }
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!invoice || !user?.id) return;

    if (items.length === 0) {
      toast({
        title: 'ไม่สามารถสร้าง',
        description: 'ใบวางบิลต้นทางไม่มีรายการสินค้า',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const taxInvoicePayload = {
        invoice_id: invoice.id,
        sale_order_id: invoice.sale_order_id,
        customer_id: invoice.customer_id,
        customer_name: invoice.customer_name,
        customer_company: invoice.customer_company,
        customer_address: invoice.customer_address,
        customer_tax_id: invoice.customer_tax_id,
        customer_branch_type: invoice.customer_branch_type,
        customer_branch_code: invoice.customer_branch_code,
        customer_branch_name: invoice.customer_branch_name,
        tax_invoice_date: taxInvoiceDate,
        subtotal: invoice.subtotal,
        discount_amount: invoice.discount_amount || 0,
        vat_amount: invoice.vat_amount || 0,
        withholding_tax_amount: invoice.withholding_tax_amount || 0,
        grand_total: invoice.grand_total,
        status: 'pending',
        delivery_address: deliveryAddress || null,
        delivery_date: deliveryDate || null,
        delivery_method: deliveryMethod || null,
        tracking_number: trackingNumber || null,
        notes: notes || null,
        created_by: user.id,
      };

      const { data: taxInv, error: txErr } = await (supabase as any)
        .from('tax_invoices')
        .insert(taxInvoicePayload)
        .select()
        .single();

      if (txErr) throw txErr;

      const txItems = items.map((it: any, idx: number) => ({
        tax_invoice_id: taxInv.id,
        product_id: it.product_id || null,
        product_name: it.product_name || 'ไม่ระบุ',
        product_description: it.product_description || null,
        sku: it.sku || null,
        quantity: it.quantity || 1,
        unit: it.unit || 'ชิ้น',
        unit_price: it.unit_price || 0,
        discount_percent: it.discount_percent || 0,
        discount_amount: it.discount_amount || 0,
        line_total: it.line_total || 0,
        display_order: idx,
      }));

      const { error: itemsErr } = await (supabase as any)
        .from('tax_invoice_items')
        .insert(txItems);

      if (itemsErr) {
        await (supabase as any).from('tax_invoices').delete().eq('id', taxInv.id);
        throw itemsErr;
      }

      toast({
        title: '✅ สร้างใบกำกับภาษีสำเร็จ',
        description: `${taxInv.tax_invoice_number} • ${formatCurrency(taxInv.grand_total)}`,
      });

      onOpenChange(false);
      if (onSuccess) {
        onSuccess(taxInv.id);
      } else {
        navigate(`/admin/tax-invoices/${taxInv.id}`);
      }
    } catch (e: any) {
      toast({ title: 'สร้างไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(n);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            สร้างใบกำกับภาษี
          </DialogTitle>
          <DialogDescription>
            {invoice && `จากใบวางบิล ${invoice.invoice_number}`}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !invoice ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>ไม่พบข้อมูลใบวางบิล</p>
          </div>
        ) : (
          <div className="space-y-4">
            {existingTaxInvoices.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-900">
                      ใบวางบิลนี้มีใบกำกับภาษีอยู่แล้ว ({existingTaxInvoices.length})
                    </p>
                    <ul className="text-xs text-amber-800 mt-1 space-y-0.5">
                      {existingTaxInvoices.map((tx: any) => (
                        <li key={tx.id} className="font-mono">
                          • {tx.tax_invoice_number} • {formatCurrency(tx.grand_total)} • {new Date(tx.tax_invoice_date).toLocaleDateString('th-TH')}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-amber-700 mt-1">
                      คุณสามารถสร้างเพิ่มได้ (สำหรับ partial payment หรือ installment)
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Card className="bg-muted/40">
              <CardContent className="pt-4 pb-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ลูกค้า:</span>
                  <span className="font-medium">{invoice.customer_company || invoice.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เลขผู้เสียภาษี:</span>
                  <span className="font-mono text-xs">{invoice.customer_tax_id || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">รายการสินค้า:</span>
                  <span>{items.length} รายการ</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>ยอดรวมทั้งสิ้น:</span>
                  <span className="text-primary">฿{formatCurrency(invoice.grand_total || 0)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="tax-date">วันที่ออกใบกำกับภาษี *</Label>
              <Input
                id="tax-date"
                type="date"
                value={taxInvoiceDate}
                onChange={(e) => setTaxInvoiceDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-3 p-3 bg-muted/20 rounded">
              <Label className="text-sm font-semibold">ข้อมูลการจัดส่ง (ถ้ามี)</Label>
              <div className="space-y-2">
                <Label htmlFor="delivery-addr" className="text-xs">ที่อยู่จัดส่ง</Label>
                <Textarea
                  id="delivery-addr"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={2}
                  placeholder="ถ้าไม่ระบุจะใช้ที่อยู่ลูกค้า"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="delivery-date" className="text-xs">วันที่จัดส่ง</Label>
                  <Input
                    id="delivery-date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="delivery-method" className="text-xs">วิธีจัดส่ง</Label>
                  <Input
                    id="delivery-method"
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    placeholder="เช่น Kerry, ขนส่งเอง"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tracking" className="text-xs">เลข Tracking</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-notes">หมายเหตุ</Label>
              <Textarea
                id="tax-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="หมายเหตุภายในหรือบนเอกสาร..."
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading || submitting || !invoice || items.length === 0}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                กำลังสร้าง...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-1.5" />
                สร้างใบกำกับภาษี
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

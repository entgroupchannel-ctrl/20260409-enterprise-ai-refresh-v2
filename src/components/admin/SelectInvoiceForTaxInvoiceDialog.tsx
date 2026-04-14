import { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2, FileText, CheckCircle2, Building2 } from 'lucide-react';

interface InvoiceWithAvailablePayments {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_company: string | null;
  grand_total: number;
  status: string;
  available_payment_count: number;
  available_payment_total: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectInvoice: (invoiceId: string) => void;
}

export default function SelectInvoiceForTaxInvoiceDialog({
  open, onOpenChange, onSelectInvoice,
}: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceWithAvailablePayments[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (open) {
      loadInvoices();
      setSearch('');
    }
  }, [open]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const [invRes, payRes, taxRes] = await Promise.all([
        (supabase as any)
          .from('invoices')
          .select('id, invoice_number, customer_name, customer_company, grand_total, status')
          .in('status', ['paid', 'partially_paid'])
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(100),
        (supabase as any)
          .from('payment_records')
          .select('id, invoice_id, amount')
          .eq('verification_status', 'verified'),
        (supabase as any)
          .from('tax_invoices')
          .select('id, payment_record_id')
          .is('deleted_at', null)
          .not('payment_record_id', 'is', null),
      ]);

      if (invRes.error) throw invRes.error;
      if (payRes.error) throw payRes.error;
      if (taxRes.error) throw taxRes.error;

      const usedPaymentIds = new Set(
        (taxRes.data || []).map((t: any) => t.payment_record_id)
      );

      const invoiceMap = new Map<string, InvoiceWithAvailablePayments>();
      for (const inv of invRes.data || []) {
        invoiceMap.set(inv.id, {
          ...inv,
          available_payment_count: 0,
          available_payment_total: 0,
        });
      }

      for (const pay of payRes.data || []) {
        if (usedPaymentIds.has(pay.id)) continue;
        const inv = invoiceMap.get(pay.invoice_id);
        if (inv) {
          inv.available_payment_count += 1;
          inv.available_payment_total += Number(pay.amount || 0);
        }
      }

      const filtered = Array.from(invoiceMap.values()).filter(
        (inv) => inv.available_payment_count > 0
      );

      setInvoices(filtered);
    } catch (e: any) {
      toast({
        title: 'โหลดใบวางบิลไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (inv: InvoiceWithAvailablePayments) => {
    onOpenChange(false);
    onSelectInvoice(inv.id);
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(n);

  const filtered = invoices.filter((inv) => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
    return (
      inv.invoice_number.toLowerCase().includes(s) ||
      inv.customer_name.toLowerCase().includes(s) ||
      (inv.customer_company || '').toLowerCase().includes(s)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            เลือกใบวางบิลเพื่อสร้างใบกำกับภาษี
          </DialogTitle>
          <DialogDescription>
            แสดงเฉพาะใบวางบิลที่มี verified payment ยังไม่ได้ออกใบกำกับภาษี
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาเลขที่, ลูกค้า, บริษัท..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                {search ? 'ไม่พบใบวางบิลที่ค้นหา' : 'ไม่มีใบวางบิลที่พร้อมสร้างใบกำกับภาษี'}
              </p>
              {!search && (
                <p className="text-xs mt-1">
                  ต้องมี verified payment ที่ยังไม่ได้ออกใบกำกับภาษี
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((inv) => (
                <Card
                  key={inv.id}
                  className="cursor-pointer hover:bg-muted/30 hover:shadow-sm transition-all"
                  onClick={() => handleSelect(inv)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-semibold text-sm">
                            {inv.invoice_number}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              inv.status === 'paid'
                                ? 'bg-green-50 text-green-700 border-green-300 text-[10px]'
                                : 'bg-amber-50 text-amber-700 border-amber-300 text-[10px]'
                            }
                          >
                            {inv.status === 'paid' ? 'ชำระแล้ว' : 'ชำระบางส่วน'}
                          </Badge>
                        </div>
                        <p className="text-sm flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-muted-foreground" />
                          {inv.customer_company || inv.customer_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-300"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {inv.available_payment_count} payment พร้อม
                          </Badge>
                          <span className="text-muted-foreground">
                            รวม ฿{formatCurrency(inv.available_payment_total)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground">ยอดใบวางบิล</div>
                        <div className="text-lg font-bold text-primary">
                          ฿{formatCurrency(inv.grand_total)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

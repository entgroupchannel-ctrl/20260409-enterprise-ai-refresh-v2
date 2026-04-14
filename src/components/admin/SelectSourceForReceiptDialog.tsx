import { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2, Receipt, CheckCircle2, Building2, FileText } from 'lucide-react';

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

interface TaxInvoiceWithAvailablePayments {
  id: string;
  tax_invoice_number: string;
  invoice_id: string;
  customer_name: string;
  customer_company: string | null;
  grand_total: number;
  payment_record_id: string | null;
  has_available_payment: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectInvoice: (invoiceId: string) => void;
  onSelectTaxInvoice: (taxInvoiceId: string) => void;
}

export default function SelectSourceForReceiptDialog({
  open, onOpenChange, onSelectInvoice, onSelectTaxInvoice,
}: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceWithAvailablePayments[]>([]);
  const [taxInvoices, setTaxInvoices] = useState<TaxInvoiceWithAvailablePayments[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'invoices' | 'tax-invoices'>('invoices');

  useEffect(() => {
    if (open) {
      loadData();
      setSearch('');
      setActiveTab('invoices');
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invRes, txRes, payRes, rcpRes] = await Promise.all([
        (supabase as any)
          .from('invoices')
          .select('id, invoice_number, customer_name, customer_company, grand_total, status')
          .in('status', ['paid', 'partially_paid'])
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(100),
        (supabase as any)
          .from('tax_invoices')
          .select('id, tax_invoice_number, invoice_id, customer_name, customer_company, grand_total, payment_record_id')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(100),
        (supabase as any)
          .from('payment_records')
          .select('id, invoice_id, amount')
          .eq('verification_status', 'verified'),
        (supabase as any)
          .from('receipts')
          .select('id, payment_record_id')
          .is('deleted_at', null),
      ]);

      if (invRes.error) throw invRes.error;
      if (txRes.error) throw txRes.error;
      if (payRes.error) throw payRes.error;
      if (rcpRes.error) throw rcpRes.error;

      const usedInReceipts = new Set(
        (rcpRes.data || []).map((r: any) => r.payment_record_id).filter(Boolean)
      );

      // Compute available payments per invoice
      const invoiceMap = new Map<string, InvoiceWithAvailablePayments>();
      for (const inv of invRes.data || []) {
        invoiceMap.set(inv.id, {
          ...inv,
          available_payment_count: 0,
          available_payment_total: 0,
        });
      }

      for (const pay of payRes.data || []) {
        if (usedInReceipts.has(pay.id)) continue;
        const inv = invoiceMap.get(pay.invoice_id);
        if (inv) {
          inv.available_payment_count += 1;
          inv.available_payment_total += Number(pay.amount || 0);
        }
      }

      const filteredInvoices = Array.from(invoiceMap.values()).filter(
        (inv) => inv.available_payment_count > 0
      );

      // Tax invoices: check if their linked payment has a receipt
      const filteredTaxInvoices = (txRes.data || []).map((tx: any) => ({
        ...tx,
        has_available_payment:
          tx.payment_record_id && !usedInReceipts.has(tx.payment_record_id),
      })).filter((tx: any) => tx.has_available_payment);

      setInvoices(filteredInvoices);
      setTaxInvoices(filteredTaxInvoices);
    } catch (e: any) {
      toast({
        title: 'โหลดข้อมูลไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectInvoice = (inv: InvoiceWithAvailablePayments) => {
    onOpenChange(false);
    onSelectInvoice(inv.id);
  };

  const handleSelectTaxInvoice = (tx: TaxInvoiceWithAvailablePayments) => {
    onOpenChange(false);
    onSelectTaxInvoice(tx.id);
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(n);

  const filteredInvoices = invoices.filter((inv) => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
    return (
      inv.invoice_number.toLowerCase().includes(s) ||
      inv.customer_name.toLowerCase().includes(s) ||
      (inv.customer_company || '').toLowerCase().includes(s)
    );
  });

  const filteredTaxInvoices = taxInvoices.filter((tx) => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
    return (
      tx.tax_invoice_number.toLowerCase().includes(s) ||
      tx.customer_name.toLowerCase().includes(s) ||
      (tx.customer_company || '').toLowerCase().includes(s)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            เลือกแหล่งที่มาสำหรับสร้างใบเสร็จ
          </DialogTitle>
          <DialogDescription>
            สร้างจาก <strong>ใบวางบิล</strong> หรือ <strong>ใบกำกับภาษี</strong> ที่มี verified payment ยังไม่ได้ออกใบเสร็จ
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

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="invoices" className="gap-2">
                <FileText className="w-4 h-4" />
                ใบวางบิล
                {invoices.length > 0 && <Badge variant="secondary">{invoices.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="tax-invoices" className="gap-2">
                <FileText className="w-4 h-4" />
                ใบกำกับภาษี
                {taxInvoices.length > 0 && <Badge variant="secondary">{taxInvoices.length}</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="space-y-2 mt-4">
              {loading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">
                    {search ? 'ไม่พบใบวางบิลที่ค้นหา' : 'ไม่มีใบวางบิลที่พร้อมสร้างใบเสร็จ'}
                  </p>
                </div>
              ) : (
                filteredInvoices.map((inv) => (
                  <Card
                    key={inv.id}
                    className="cursor-pointer hover:bg-muted/30 hover:shadow-sm transition-all"
                    onClick={() => handleSelectInvoice(inv)}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-semibold text-sm">
                              {inv.invoice_number}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {inv.status === 'paid' ? 'ชำระแล้ว' : 'ชำระบางส่วน'}
                            </Badge>
                          </div>
                          <p className="text-sm flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-muted-foreground" />
                            {inv.customer_company || inv.customer_name}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {inv.available_payment_count} payment พร้อม
                            </Badge>
                            <span className="text-muted-foreground">
                              รวม ฿{formatCurrency(inv.available_payment_total)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-muted-foreground">ยอดรวม</div>
                          <div className="text-lg font-bold text-primary">
                            ฿{formatCurrency(inv.grand_total)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="tax-invoices" className="space-y-2 mt-4">
              {loading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredTaxInvoices.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">
                    {search ? 'ไม่พบใบกำกับภาษีที่ค้นหา' : 'ไม่มีใบกำกับภาษีที่พร้อมสร้างใบเสร็จ'}
                  </p>
                </div>
              ) : (
                filteredTaxInvoices.map((tx) => (
                  <Card
                    key={tx.id}
                    className="cursor-pointer hover:bg-muted/30 hover:shadow-sm transition-all"
                    onClick={() => handleSelectTaxInvoice(tx)}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-semibold text-sm">
                              {tx.tax_invoice_number}
                            </span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-[10px]">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              payment พร้อม
                            </Badge>
                          </div>
                          <p className="text-sm flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-muted-foreground" />
                            {tx.customer_company || tx.customer_name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-muted-foreground">ยอดรวม</div>
                          <div className="text-lg font-bold text-primary">
                            ฿{formatCurrency(tx.grand_total)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

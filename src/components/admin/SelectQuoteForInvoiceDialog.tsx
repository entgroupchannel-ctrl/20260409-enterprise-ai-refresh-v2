import { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Loader2, FileText, CircleCheckBig } from 'lucide-react';
import type { InvoiceSource } from '@/components/admin/CreateInvoiceFromSODialog';

interface QuoteRow {
  id: string;
  quote_number: string | null;
  customer_name: string;
  customer_company: string | null;
  customer_address: string | null;
  customer_email: string;
  customer_phone: string | null;
  customer_tax_id: string | null;
  payment_terms: string | null;
  notes: string | null;
  grand_total: number | null;
  status: string;
  has_sale_order: boolean | null;
  has_invoice: boolean | null;
  created_at: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (source: InvoiceSource) => void;
}

export default function SelectQuoteForInvoiceDialog({
  open,
  onOpenChange,
  onSelect,
}: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [search, setSearch] = useState('');
  const [loadingQuoteId, setLoadingQuoteId] = useState<string | null>(null);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('quote_requests')
        .select(
          'id, quote_number, customer_name, customer_company, customer_address, customer_email, customer_phone, customer_tax_id, payment_terms, notes, grand_total, status, has_sale_order, has_invoice, created_at'
        )
        .eq('status', 'po_approved')
        .eq('has_invoice', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setQuotes((data as QuoteRow[]) || []);
    } catch (e: any) {
      toast({
        title: 'โหลดใบเสนอราคาไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadQuotes();
      setSearch('');
    }
  }, [open]);

  const handleSelectQuote = async (quote: QuoteRow) => {
    setLoadingQuoteId(quote.id);
    try {
      const { data: revData, error: revErr } = await (supabase as any)
        .from('quote_revisions')
        .select('subtotal, vat_amount, grand_total, products')
        .eq('quote_id', quote.id)
        .order('revision_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (revErr) throw revErr;
      if (!revData) {
        toast({
          title: 'ไม่พบข้อมูล revision',
          description: 'ใบเสนอราคานี้ไม่มี revision — ไม่สามารถสร้าง invoice',
          variant: 'destructive',
        });
        return;
      }

      // Try to find branch info from contacts table (by tax_id match)
      let branchType: string | null = null;
      let branchCode: string | null = null;
      let branchName: string | null = null;

      if (quote.customer_tax_id) {
        try {
          const { data: contactData } = await (supabase as any)
            .from('contacts')
            .select('branch_type, branch_code, branch_name')
            .eq('tax_id', quote.customer_tax_id)
            .limit(1)
            .maybeSingle();
          
          if (contactData) {
            branchType = contactData.branch_type || null;
            branchCode = contactData.branch_code || null;
            branchName = contactData.branch_name || null;
          }
        } catch (e) {
          console.warn('Contact branch lookup failed:', e);
        }
      }

      const source: InvoiceSource = {
        type: 'quote',
        quote: {
          id: quote.id,
          quote_number: quote.quote_number || '',
          customer_name: quote.customer_name,
          customer_company: quote.customer_company,
          customer_address: quote.customer_address,
          customer_email: quote.customer_email,
          customer_phone: quote.customer_phone,
          customer_tax_id: quote.customer_tax_id,
          customer_branch_type: branchType,
          customer_branch_code: branchCode,
          customer_branch_name: branchName,
          payment_terms: quote.payment_terms,
          notes: quote.notes,
          subtotal: Number(revData.subtotal) || 0,
          vat_amount: Number(revData.vat_amount) || 0,
          grand_total: Number(revData.grand_total) || 0,
          products: revData.products || [],
        },
      };

      onOpenChange(false);
      setTimeout(() => onSelect(source), 100);
    } catch (e: any) {
      toast({
        title: 'โหลดข้อมูลไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingQuoteId(null);
    }
  };

  const filtered = quotes.filter((q) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      q.quote_number?.toLowerCase().includes(s) ||
      q.customer_name.toLowerCase().includes(s) ||
      q.customer_company?.toLowerCase().includes(s) ||
      q.customer_email.toLowerCase().includes(s)
    );
  });

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(n);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            เลือกใบเสนอราคาเพื่อสร้างใบวางบิล
          </DialogTitle>
          <DialogDescription>
            แสดงเฉพาะใบเสนอราคาที่ PO อนุมัติแล้ว (พร้อมเก็บเงิน)
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหา: เลขที่ใบเสนอราคา, ชื่อลูกค้า, บริษัท, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">ไม่มีใบเสนอราคาที่พร้อมสร้างใบวางบิล</p>
              <p className="text-xs mt-1">
                Quote ต้อง: status = po_approved + ยังไม่มีใบวางบิล
              </p>
            </div>
          ) : (
            filtered.map((quote) => {
              const isLoading = loadingQuoteId === quote.id;
              return (
                <Card
                  key={quote.id}
                  className={`cursor-pointer hover:border-primary hover:bg-accent/40 transition-colors ${
                    isLoading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                  onClick={() => !isLoading && handleSelectQuote(quote)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-semibold">
                            {quote.quote_number || quote.id.slice(0, 8)}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-green-50 text-green-700 border-green-300"
                          >
                            <CircleCheckBig className="w-3 h-3 mr-1" />
                            PO อนุมัติแล้ว
                          </Badge>
                          {quote.has_sale_order && (
                            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-300">
                              มี SO แล้ว
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium text-sm mt-1 truncate">
                          {quote.customer_name}
                        </p>
                        {quote.customer_company && (
                          <p className="text-xs text-muted-foreground truncate">
                            {quote.customer_company}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground truncate">
                          {quote.customer_email}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">ยอดรวม</p>
                        <p className="text-base font-bold text-primary">
                          {formatCurrency(quote.grand_total || 0)}
                        </p>
                        {isLoading && (
                          <Loader2 className="w-4 h-4 animate-spin text-primary ml-auto mt-1" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center pt-1 border-t">
            แสดง {filtered.length} รายการ • คลิกเพื่อเลือก
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

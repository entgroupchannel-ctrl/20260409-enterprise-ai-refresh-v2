import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  FileText,
  Calendar,
  Building2,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatShortDateTime } from '@/lib/format';

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_company: string | null;
  customer_address: string | null;
  products: any[];
  subtotal: number;
  vat_amount: number;
  grand_total: number;
  status: string;
  created_at: string;
  accepted_at: string | null;
  po_uploaded_at: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (quote: Quote) => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(n);

export default function SelectQuoteForSODialog({ open, onOpenChange, onSelect }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    loadEligibleQuotes();
  }, [open]);

  const loadEligibleQuotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('id, quote_number, customer_name, customer_company, customer_address, products, subtotal, vat_amount, grand_total, status, created_at, accepted_at, po_uploaded_at')
        .in('status', ['po_approved', 'po_confirmed', 'po_uploaded', 'accepted'])
        .or('has_sale_order.is.null,has_sale_order.eq.false')
        .is('deleted_at', null)
        .order('po_uploaded_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setQuotes((data as Quote[]) || []);
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

  const filtered = quotes.filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      q.quote_number.toLowerCase().includes(s) ||
      q.customer_name.toLowerCase().includes(s) ||
      (q.customer_company || '').toLowerCase().includes(s)
    );
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      accepted: { label: 'ยอมรับแล้ว', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      po_uploaded: { label: 'อัปโหลด PO', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
      po_confirmed: { label: 'ยืนยัน PO', className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
      po_approved: { label: 'อนุมัติ PO แล้ว', className: 'bg-primary/10 text-primary' },
    };
    const cfg = map[status] || { label: status, className: 'bg-muted text-muted-foreground' };
    return <Badge className={cfg.className}>{cfg.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            เลือกใบเสนอราคาเพื่อสร้าง Sale Order
          </DialogTitle>
          <DialogDescription>
            แสดงเฉพาะใบเสนอราคาที่ผ่านการอนุมัติ และยังไม่ได้สร้าง SO
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหา: เลขที่ใบเสนอ / ชื่อลูกค้า / บริษัท"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 -mx-1 px-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-medium">
                  {search ? 'ไม่พบใบเสนอราคาตามคำค้น' : 'ไม่มีใบเสนอราคาที่พร้อมสร้าง SO'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {search
                    ? 'ลองเปลี่ยนคำค้นหา'
                    : 'ใบเสนอราคาต้องผ่านสถานะ accepted/po_uploaded/po_approved ก่อน'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((quote) => (
              <Card
                key={quote.id}
                className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                onClick={() => {
                  onSelect(quote);
                  onOpenChange(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-primary">{quote.quote_number}</span>
                        {getStatusBadge(quote.status)}
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Building2 className="w-3.5 h-3.5" />
                          <span className="truncate">
                            {quote.customer_company || quote.customer_name}
                          </span>
                        </div>
                        {quote.customer_company && (
                          <p className="text-xs text-muted-foreground ml-5">
                            ผู้ติดต่อ: {quote.customer_name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          ใบเสนอ: {formatShortDateTime(quote.created_at)}
                        </span>
                        {quote.po_uploaded_at && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            PO: {formatShortDateTime(quote.po_uploaded_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {quote.products?.length || 0} รายการ
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">ยอดรวม</p>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(quote.grand_total)}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filtered.length > 0 && !loading && (
          <p className="text-xs text-muted-foreground text-center">
            พบ {filtered.length} ใบเสนอราคาที่พร้อมสร้าง SO
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

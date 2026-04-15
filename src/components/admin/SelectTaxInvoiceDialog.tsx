import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (taxInvoiceId: string) => void;
}

export default function SelectTaxInvoiceDialog({ open, onOpenChange, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [taxInvoices, setTaxInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      setTaxInvoices([]);
      return;
    }
    loadTaxInvoices();
  }, [open, debouncedSearch]);

  const loadTaxInvoices = async () => {
    setLoading(true);
    try {
      let query = (supabase as any)
        .from('tax_invoices')
        .select('id, tax_invoice_number, customer_name, customer_company, grand_total, tax_invoice_date, status')
        .neq('status', 'cancelled')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (debouncedSearch) {
        query = query.or(
          `tax_invoice_number.ilike.%${debouncedSearch}%,customer_name.ilike.%${debouncedSearch}%,customer_company.ilike.%${debouncedSearch}%`
        );
      }

      const { data: tiList, error } = await query;
      if (error) throw error;

      if (tiList && tiList.length > 0) {
        const tiIds = tiList.map((t: any) => t.id);
        const { data: existingCNs } = await (supabase as any)
          .from('credit_notes')
          .select('original_tax_invoice_id')
          .in('original_tax_invoice_id', tiIds)
          .eq('status', 'issued')
          .is('deleted_at', null);

        const cnSet = new Set((existingCNs || []).map((cn: any) => cn.original_tax_invoice_id));

        const enriched = tiList.map((ti: any) => ({
          ...ti,
          hasCN: cnSet.has(ti.id),
        }));

        setTaxInvoices(enriched);
      } else {
        setTaxInvoices([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>เลือกใบกำกับภาษี</DialogTitle>
          <DialogDescription>
            เลือกใบกำกับภาษีที่ต้องการออกใบลดหนี้
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหา: เลขที่ TI / ชื่อลูกค้า / บริษัท"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 space-y-1 mt-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : taxInvoices.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">
                {debouncedSearch ? 'ไม่พบใบกำกับภาษีที่ตรง' : 'ไม่พบใบกำกับภาษี'}
              </p>
            </div>
          ) : (
            taxInvoices.map((ti) => (
              <button
                key={ti.id}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  ti.hasCN
                    ? 'opacity-50 cursor-not-allowed bg-muted/30 border-muted'
                    : 'hover:bg-primary/5 hover:border-primary/30 cursor-pointer border-border'
                }`}
                onClick={() => {
                  if (!ti.hasCN) {
                    onOpenChange(false);
                    onSelect(ti.id);
                  }
                }}
                disabled={ti.hasCN}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{ti.tax_invoice_number}</span>
                      {ti.hasCN && (
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-300">
                          มี CN แล้ว
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {ti.customer_company || ti.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(ti.tax_invoice_date)}
                    </p>
                  </div>
                  <p className="font-mono text-sm font-semibold shrink-0">
                    ฿{formatCurrency(ti.grand_total)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

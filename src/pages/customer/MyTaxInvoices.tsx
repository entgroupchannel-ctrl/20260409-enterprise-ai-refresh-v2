import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText, Search, Loader2, CircleCheckBig, Clock, Ban, Building2,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

interface TaxInvoice {
  id: string;
  tax_invoice_number: string;
  tax_invoice_date: string;
  status: string;
  grand_total: number;
  customer_company: string | null;
  invoice_id: string;
}

const STATUS_LABELS: Record<string, { label: string; cls: string; icon: any }> = {
  pending: { label: 'รอดำเนินการ', cls: 'bg-blue-100 text-blue-700 border-blue-300', icon: Clock },
  paid: { label: 'ชำระแล้ว', cls: 'bg-green-100 text-green-700 border-green-300', icon: CircleCheckBig },
  partially_paid: { label: 'ชำระบางส่วน', cls: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock },
  cancelled: { label: 'ยกเลิก', cls: 'bg-gray-100 text-gray-500 border-gray-300', icon: Ban },
};

export default function MyTaxInvoices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [taxInvoices, setTaxInvoices] = useState<TaxInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) loadTaxInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadTaxInvoices = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('tax_invoices')
        .select('id, tax_invoice_number, tax_invoice_date, status, grand_total, customer_company, invoice_id')
        .eq('customer_id', user?.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTaxInvoices((data as TaxInvoice[]) || []);
    } catch (e: any) {
      toast({
        title: 'โหลดใบกำกับภาษีไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const statusCounts = {
    all: taxInvoices.length,
    pending: taxInvoices.filter((t) => t.status === 'pending').length,
    partially_paid: taxInvoices.filter((t) => t.status === 'partially_paid').length,
    paid: taxInvoices.filter((t) => t.status === 'paid').length,
    cancelled: taxInvoices.filter((t) => t.status === 'cancelled').length,
  };

  const filtered = taxInvoices.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      return (
        t.tax_invoice_number.toLowerCase().includes(s) ||
        (t.customer_company || '').toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <CustomerLayout title="ใบกำกับภาษีของฉัน">
      <SEOHead title="ใบกำกับภาษีของฉัน" description="รายการใบกำกับภาษีของลูกค้า" />
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">ใบกำกับภาษีของฉัน</h1>
          <p className="text-xs text-muted-foreground">
            รวม {taxInvoices.length} รายการ
          </p>
        </div>

          {/* Search + Filter */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาเลขที่, บริษัท..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="all" className="gap-2">
                    ทั้งหมด <Badge variant="secondary">{statusCounts.all}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="gap-2">
                    รอดำเนินการ <Badge variant="secondary">{statusCounts.pending}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="partially_paid" className="gap-2">
                    ชำระบางส่วน <Badge variant="secondary">{statusCounts.partially_paid}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="paid" className="gap-2">
                    ชำระแล้ว <Badge variant="secondary">{statusCounts.paid}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="cancelled" className="gap-2">
                    ยกเลิก <Badge variant="secondary">{statusCounts.cancelled}</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* List */}
          <div className="text-sm text-muted-foreground">
            พบ {filtered.length} รายการ
          </div>

          {loading ? (
            <Card>
              <CardContent className="py-16 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">ไม่มีใบกำกับภาษี</p>
                <p className="text-xs mt-1">
                  ใบกำกับภาษีจะปรากฏที่นี่หลังแอดมินสร้างให้
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((t) => {
                const info = STATUS_LABELS[t.status] || STATUS_LABELS.pending;
                const Icon = info.icon;
                return (
                  <Card
                    key={t.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/my-tax-invoices/${t.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-semibold">{t.tax_invoice_number}</span>
                            <Badge variant="outline" className={info.cls}>
                              <Icon className="w-3 h-3 mr-1" />
                              {info.label}
                            </Badge>
                          </div>
                          {t.customer_company && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {t.customer_company}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            วันที่: {formatDate(t.tax_invoice_date)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-muted-foreground mb-1">ยอดรวม</div>
                          <div className="text-lg font-bold text-primary">
                            {formatCurrency(t.grand_total)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
    </CustomerLayout>
  );
}

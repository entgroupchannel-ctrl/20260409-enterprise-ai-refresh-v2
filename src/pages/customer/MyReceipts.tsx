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
import {
  Receipt, Search, Loader2, Building2, Calendar, ArrowLeft,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

interface ReceiptRow {
  id: string;
  receipt_number: string;
  receipt_date: string;
  amount: number;
  payment_method: string | null;
  customer_company: string | null;
  invoice_id: string | null;
  tax_invoice_id: string | null;
}

export default function MyReceipts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) loadReceipts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadReceipts = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('receipts')
        .select('id, receipt_number, receipt_date, amount, payment_method, customer_company, invoice_id, tax_invoice_id')
        .eq('customer_id', user?.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceipts((data as ReceiptRow[]) || []);
    } catch (e: any) {
      toast({ title: 'โหลดใบเสร็จไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(n);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

  const filtered = receipts.filter((r) => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
    return (
      r.receipt_number.toLowerCase().includes(s) ||
      (r.customer_company || '').toLowerCase().includes(s)
    );
  });

  return (
    <>
      <SEOHead title="ใบเสร็จรับเงินของฉัน" description="รายการใบเสร็จรับเงินของลูกค้า" />
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              กลับ
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Receipt className="w-6 h-6 text-primary" />
                ใบเสร็จรับเงินของฉัน
              </h1>
              <p className="text-xs text-muted-foreground">
                รวม {receipts.length} รายการ
              </p>
            </div>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาเลขที่, บริษัท..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Result count */}
          <div className="text-sm text-muted-foreground">
            พบ {filtered.length} รายการ
          </div>

          {/* List */}
          {loading ? (
            <Card>
              <CardContent className="py-16 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">ไม่มีใบเสร็จรับเงิน</p>
                <p className="text-xs mt-1">
                  ใบเสร็จจะปรากฏที่นี่หลังแอดมินออกให้
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((r) => (
                <Card
                  key={r.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/my-receipts/${r.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-semibold">{r.receipt_number}</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-[10px]">
                            ออกแล้ว
                          </Badge>
                          {r.payment_method && (
                            <Badge variant="outline" className="text-[10px]">
                              {r.payment_method === 'bank_transfer' ? 'โอน' : r.payment_method}
                            </Badge>
                          )}
                        </div>
                        {r.customer_company && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {r.customer_company}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(r.receipt_date)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground mb-1">จำนวนเงิน</div>
                        <div className="text-xl font-bold text-primary">
                          {formatCurrency(r.amount)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
    
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Receipt, Search, Loader2, Calendar } from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';

interface ReceiptRow {
  id: string;
  receipt_number: string;
  customer_name: string;
  customer_company: string | null;
  receipt_date: string;
  amount: number;
  payment_method: string | null;
  invoice_id: string | null;
  tax_invoice_id: string | null;
  created_at: string;
}

export default function AdminReceiptsList() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const t = setTimeout(loadData, 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadData = async () => {
    setLoading(true);
    try {
      let query = (supabase as any)
        .from('receipts')
        .select('id, receipt_number, customer_name, customer_company, receipt_date, amount, payment_method, invoice_id, tax_invoice_id, created_at')
        .order('created_at', { ascending: false });

      if (search.trim()) {
        const s = search.trim();
        query = query.or(`receipt_number.ilike.%${s}%,customer_name.ilike.%${s}%,customer_company.ilike.%${s}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReceipts((data as ReceiptRow[]) || []);
    } catch (e: any) {
      toast({ title: 'โหลดรายการไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(n);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Receipt className="w-6 h-6 text-primary" />
              ใบเสร็จรับเงิน
            </h1>
            <p className="text-xs text-muted-foreground">
              รวม {receipts.length} รายการ
            </p>
          </div>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-blue-800">
              💡 ใบเสร็จรับเงินสร้างจาก <strong>ใบวางบิล</strong> หรือ <strong>ใบกำกับภาษี</strong> ที่มีการชำระเงิน verified แล้ว
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาเลขที่, ลูกค้า, บริษัท..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="py-16 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : receipts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">ยังไม่มีใบเสร็จรับเงิน</p>
              <p className="text-xs mt-1">
                สร้างจากหน้าใบวางบิลหรือใบกำกับภาษีที่ชำระแล้ว
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {receipts.map((r) => (
              <Card
                key={r.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/admin/receipts/${r.id}`)}
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
                      <p className="text-sm font-medium">
                        {r.customer_company || r.customer_name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(r.receipt_date).toLocaleDateString('th-TH')}
                        </span>
                        <span>{formatRelativeTime(r.created_at)}</span>
                      </div>
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
    </AdminLayout>
  );
}

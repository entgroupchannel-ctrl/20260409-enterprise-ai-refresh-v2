import { useEffect, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Loader2, Receipt } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_company: string | null;
  invoice_date: string;
  due_date: string | null;
  invoice_type: string;
  status: string;
  grand_total: number;
  sale_order_id: string | null;
  created_at: string;
}

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: 'all', label: 'ทุกสถานะ' },
  { value: 'draft', label: 'ฉบับร่าง' },
  { value: 'sent', label: 'ส่งแล้ว' },
  { value: 'partially_paid', label: 'ชำระบางส่วน' },
  { value: 'paid', label: 'ชำระแล้ว' },
  { value: 'overdue', label: 'เกินกำหนด' },
  { value: 'cancelled', label: 'ยกเลิก' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'ทุกประเภท' },
  { value: 'full', label: 'เต็มจำนวน' },
  { value: 'downpayment', label: 'มัดจำ' },
  { value: 'installment', label: 'งวดแบ่ง' },
  { value: 'final', label: 'ส่วนที่เหลือ' },
];

export default function AdminInvoicesList() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      let query = (supabase as any)
        .from('invoices')
        .select(
          'id, invoice_number, customer_name, customer_company, invoice_date, due_date, invoice_type, status, grand_total, sale_order_id, created_at',
          { count: 'exact' }
        )
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      if (typeFilter !== 'all') query = query.eq('invoice_type', typeFilter);
      if (search.trim()) {
        const s = search.trim();
        query = query.or(`invoice_number.ilike.%${s}%,customer_name.ilike.%${s}%,customer_company.ilike.%${s}%`);
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      setInvoices((data as Invoice[]) || []);
      setTotalCount(count || 0);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [page, statusFilter, typeFilter]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      loadInvoices();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(n);

  const formatDate = (s: string | null) => {
    if (!s) return '-';
    return new Date(s).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      draft: { label: 'ฉบับร่าง', cls: 'bg-gray-100 text-gray-700 border-gray-300' },
      sent: { label: 'ส่งแล้ว', cls: 'bg-blue-100 text-blue-700 border-blue-300' },
      partially_paid: { label: 'ชำระบางส่วน', cls: 'bg-amber-100 text-amber-700 border-amber-300' },
      paid: { label: 'ชำระแล้ว', cls: 'bg-green-100 text-green-700 border-green-300' },
      overdue: { label: 'เกินกำหนด', cls: 'bg-red-100 text-red-700 border-red-300' },
      cancelled: { label: 'ยกเลิก', cls: 'bg-gray-100 text-gray-500 border-gray-300 line-through' },
    };
    const m = map[status] || { label: status, cls: 'bg-gray-100 text-gray-700' };
    return <Badge variant="outline" className={`text-xs ${m.cls}`}>{m.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      full: { label: 'เต็มจำนวน', cls: 'bg-blue-50 text-blue-700' },
      downpayment: { label: 'มัดจำ', cls: 'bg-purple-50 text-purple-700' },
      installment: { label: 'งวดแบ่ง', cls: 'bg-amber-50 text-amber-700' },
      final: { label: 'ส่วนที่เหลือ', cls: 'bg-teal-50 text-teal-700' },
    };
    const m = map[type] || { label: type, cls: 'bg-gray-50' };
    return <Badge variant="outline" className={`text-[10px] ${m.cls}`}>{m.label}</Badge>;
  };

  return (
    <AdminLayout>
      <AdminPageLayout
        title="ใบวางบิล"
        description={`จัดการใบวางบิล/ใบแจ้งหนี้ ทั้งหมด ${totalCount.toLocaleString()} รายการ`}
        actionButton={{
          label: 'สร้างใบวางบิล',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => {},
        }}
      >
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหา: เลขที่ใบวางบิล, ชื่อลูกค้า, บริษัท..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="ประเภท" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : invoices.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">ยังไม่มีใบวางบิล</p>
                <p className="text-xs mt-1">
                  สร้างใบวางบิลใหม่จากหน้า Sale Order (Phase 2B)
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[160px]">เลขที่</TableHead>
                        <TableHead>ลูกค้า</TableHead>
                        <TableHead className="w-[110px]">ประเภท</TableHead>
                        <TableHead className="w-[110px]">วันที่</TableHead>
                        <TableHead className="w-[110px]">ครบกำหนด</TableHead>
                        <TableHead className="text-right w-[140px]">จำนวนเงิน</TableHead>
                        <TableHead className="w-[120px]">สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id} className="hover:bg-accent/50 cursor-pointer">
                          <TableCell className="font-mono text-xs font-semibold">
                            {inv.invoice_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{inv.customer_name}</p>
                              {inv.customer_company && (
                                <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                                  {inv.customer_company}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(inv.invoice_type)}</TableCell>
                          <TableCell className="text-xs">{formatDate(inv.invoice_date)}</TableCell>
                          <TableCell className="text-xs">
                            {inv.due_date ? (
                              <span className={
                                inv.status !== 'paid' && inv.status !== 'cancelled' &&
                                new Date(inv.due_date) < new Date()
                                  ? 'text-red-600 font-semibold'
                                  : ''
                              }>
                                {formatDate(inv.due_date)}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-sm">
                            {formatCurrency(inv.grand_total)}
                          </TableCell>
                          <TableCell>{getStatusBadge(inv.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      แสดง {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalCount)} จาก {totalCount.toLocaleString()} รายการ
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                      >
                        ก่อนหน้า
                      </Button>
                      <span className="flex items-center px-3 text-sm">
                        หน้า {page} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        ถัดไป
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </AdminPageLayout>
    </AdminLayout>
  );
}

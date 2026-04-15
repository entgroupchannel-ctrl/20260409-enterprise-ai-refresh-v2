import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Tabs, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search, Loader2, FileText, FileMinus, Plus,
} from 'lucide-react';
import CreateCreditNoteDialog from '@/components/admin/CreateCreditNoteDialog';
import SelectTaxInvoiceDialog from '@/components/admin/SelectTaxInvoiceDialog';

const REASON_LABELS: Record<string, string> = {
  return: 'สินค้าคืน',
  damaged: 'ของเสียหาย',
  price_correction: 'ปรับปรุงราคา',
  quantity_error: 'จำนวนผิดพลาด',
  additional_discount: 'ส่วนลดเพิ่มเติม',
  service_cancelled: 'ยกเลิกบริการ',
  other: 'อื่นๆ',
};

const PAGE_SIZE = 50;

export default function AdminCreditNotesList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [creditNotes, setCreditNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'issued' | 'voided'>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { loadData(); }, [debouncedSearch, statusFilter, page]);

  const loadData = async () => {
    setLoading(true);
    try {
      let query = (supabase as any).from('credit_notes')
        .select('*', { count: 'exact' })
        .is('deleted_at', null);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (debouncedSearch) {
        query = query.or(
          `credit_note_number.ilike.%${debouncedSearch}%,customer_name.ilike.%${debouncedSearch}%,customer_company.ilike.%${debouncedSearch}%`
        );
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setCreditNotes(data || []);
      setTotalCount(count || 0);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <AdminLayout>
      <AdminPageLayout
        title="ใบลดหนี้ (Credit Notes)"
        description={`ทั้งหมด ${totalCount.toLocaleString()} รายการ`}
      >
        {/* Filters */}
        <Card className="mb-4">
          <CardContent className="p-3 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหา: เลขที่ CN / ชื่อลูกค้า"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <TabsList>
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="issued">ใช้งาน</TabsTrigger>
                <TabsTrigger value="voided">ยกเลิก</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : creditNotes.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <FileMinus className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>ไม่พบใบลดหนี้</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เลขที่</TableHead>
                    <TableHead>วันที่</TableHead>
                    <TableHead>ลูกค้า</TableHead>
                    <TableHead>เหตุผล</TableHead>
                    <TableHead className="text-right">ยอดลดหนี้</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditNotes.map((cn) => (
                    <TableRow
                      key={cn.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/admin/credit-notes/${cn.id}`)}
                    >
                      <TableCell className="font-mono text-sm font-semibold">
                        {cn.credit_note_number}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(cn.credit_note_date)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium truncate max-w-[200px]">
                          {cn.customer_company || cn.customer_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {REASON_LABELS[cn.reason_code] || cn.reason_code}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-red-600 font-semibold">
                        -฿{formatCurrency(cn.grand_total)}
                      </TableCell>
                      <TableCell>
                        {cn.status === 'issued' ? (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                            ใช้งาน
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-300 line-through">
                            ยกเลิก
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              หน้า {page} / {totalPages} • รวม {totalCount.toLocaleString()} รายการ
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                ก่อนหน้า
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                ถัดไป
              </Button>
            </div>
          </div>
        )}
      </AdminPageLayout>
    </AdminLayout>
  );
}

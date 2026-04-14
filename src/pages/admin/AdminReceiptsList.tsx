import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Receipt, Search, Loader2, Calendar, Trash2, MoreVertical } from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [deletingReceipt, setDeletingReceipt] = useState<any>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);

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
        .is('deleted_at', null)
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

  const handleSoftDelete = async () => {
    if (!deletingReceipt) return;
    setDeleting(true);
    try {
      const { data, error } = await (supabase as any).rpc('soft_delete_receipt', {
        p_receipt_id: deletingReceipt.id,
        p_reason: deleteReason.trim() || null,
      });
      if (error) throw error;

      toast({
        title: '🗑️ ย้ายไปถังขยะแล้ว',
        description: (data as any)?.message,
      });
      setDeletingReceipt(null);
      setDeleteReason('');
      await loadData();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
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
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/trash?tab=receipts">
              <Trash2 className="w-4 h-4 mr-2" />
              ถังขยะ
            </Link>
          </Button>
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
                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">จำนวนเงิน</div>
                        <div className="text-xl font-bold text-primary">
                          {formatCurrency(r.amount)}
                        </div>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => navigate(`/admin/receipts/${r.id}`)}>
                              ดู
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(r.receipt_number)}>
                              คัดลอกเลขที่
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeletingReceipt(r)}
                              className="text-red-600 focus:text-red-700 focus:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              ย้ายถังขยะ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={!!deletingReceipt}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingReceipt(null);
            setDeleteReason('');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-700">
              <Trash2 className="w-5 h-5" />
              ย้ายใบเสร็จไปถังขยะ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              ใบเสร็จ <span className="font-mono font-semibold">{deletingReceipt?.receipt_number}</span>
              {' '}จะถูกย้ายไปถังขยะ — สามารถกู้คืนได้ภายหลัง
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-semibold">เหตุผล (ไม่บังคับ)</label>
            <Textarea
              placeholder="เช่น: ออกผิด, ลูกค้าขอยกเลิก..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows={2}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSoftDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? 'กำลังย้าย...' : 'ย้ายถังขยะ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

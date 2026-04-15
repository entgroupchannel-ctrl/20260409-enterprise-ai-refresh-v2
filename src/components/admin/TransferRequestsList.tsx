import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Search, MoreHorizontal, Eye, Edit, Copy, Trash2, DollarSign, Clock, CheckCircle, FileText } from 'lucide-react';
import TransferStatusBadge from './TransferStatusBadge';

interface TransferRequest {
  id: string;
  transfer_number: string;
  supplier_name: string;
  supplier_id: string;
  amount: number;
  currency: string;
  exchange_rate: number | null;
  amount_thb: number | null;
  total_cost_thb: number | null;
  status: string;
  priority: string | null;
  requested_transfer_date: string | null;
  due_date: string | null;
  created_at: string;
  purpose: string;
  purchase_order_ids: string[] | null;
}

interface PORef { id: string; po_number: string; }

interface Props {
  onEdit?: (id: string) => void;
}

export default function TransferRequestsList({ onEdit }: Props) {
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [poMap, setPoMap] = useState<Record<string, string>>({});

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('international_transfer_requests')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      const list = (data as TransferRequest[]) || [];
      setTransfers(list);

      // Resolve PO numbers
      const allPoIds = [...new Set(list.flatMap(t => t.purchase_order_ids || []))];
      if (allPoIds.length > 0) {
        const { data: pos } = await supabase.from('purchase_orders').select('id, po_number').in('id', allPoIds);
        if (pos) {
          const map: Record<string, string> = {};
          for (const p of pos as any[]) map[p.id] = p.po_number;
          setPoMap(map);
        }
      }
    } catch (err: any) {
      toast.error('โหลดข้อมูลล้มเหลว: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransfers(); }, [statusFilter]);

  const filtered = useMemo(() => {
    if (!search) return transfers;
    const q = search.toLowerCase();
    return transfers.filter(t =>
      t.transfer_number?.toLowerCase().includes(q) ||
      t.supplier_name?.toLowerCase().includes(q) ||
      t.purpose?.toLowerCase().includes(q)
    );
  }, [transfers, search]);

  const stats = useMemo(() => {
    const all = transfers.length;
    const pending = transfers.filter(t => t.status === 'pending').length;
    const approved = transfers.filter(t => t.status === 'approved').length;
    const totalThb = transfers
      .filter(t => t.status !== 'cancelled' && t.status !== 'rejected')
      .reduce((sum, t) => sum + (t.total_cost_thb || t.amount_thb || 0), 0);
    return { all, pending, approved, totalThb };
  }, [transfers]);

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบคำขอนี้?')) return;
    const { error } = await supabase
      .from('international_transfer_requests')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('ลบแล้ว');
    fetchTransfers();
  };

  const handleDuplicate = async (transfer: TransferRequest) => {
    const { error } = await supabase
      .from('international_transfer_requests')
      .insert({
        supplier_id: transfer.supplier_id,
        supplier_name: transfer.supplier_name,
        amount: transfer.amount,
        currency: transfer.currency,
        exchange_rate: transfer.exchange_rate,
        amount_thb: transfer.amount_thb,
        bank_name: '',
        bank_account_number: '',
        swift_code: '',
        purpose: transfer.purpose,
        priority: transfer.priority,
        status: 'draft',
      });
    if (error) { toast.error(error.message); return; }
    toast.success('สร้างสำเนาแล้ว');
    fetchTransfers();
  };

  const fmt = (n: number | null) => n != null ? n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

  return (
    <div className="space-y-6">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">ทั้งหมด</p><p className="text-2xl font-bold">{stats.all}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10"><Clock className="h-5 w-5 text-yellow-600" /></div>
            <div><p className="text-xs text-muted-foreground">รออนุมัติ</p><p className="text-2xl font-bold">{stats.pending}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10"><CheckCircle className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-xs text-muted-foreground">อนุมัติแล้ว</p><p className="text-2xl font-bold">{stats.approved}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-xs text-muted-foreground">มูลค่ารวม (THB)</p><p className="text-lg font-bold">฿{fmt(stats.totalThb)}</p></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="ค้นหา transfer number, supplier..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            <SelectItem value="draft">ร่าง</SelectItem>
            <SelectItem value="pending">รออนุมัติ</SelectItem>
            <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
            <SelectItem value="transferred">โอนแล้ว</SelectItem>
            <SelectItem value="rejected">ปฏิเสธ</SelectItem>
            <SelectItem value="cancelled">ยกเลิก</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เลขที่</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">THB</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">กำลังโหลด...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">ไม่พบรายการ</TableCell></TableRow>
              ) : filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.transfer_number}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{t.supplier_name}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(t.amount)}</TableCell>
                  <TableCell><Badge variant="outline">{t.currency}</Badge></TableCell>
                  <TableCell className="text-right font-mono">{t.exchange_rate ? fmt(t.exchange_rate) : '-'}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(t.total_cost_thb || t.amount_thb)}</TableCell>
                  <TableCell><TransferStatusBadge status={t.status} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(t.id)}><Eye className="h-4 w-4 mr-2" />ดูรายละเอียด</DropdownMenuItem>
                        {['draft', 'rejected'].includes(t.status) && (
                          <DropdownMenuItem onClick={() => onEdit?.(t.id)}><Edit className="h-4 w-4 mr-2" />แก้ไข</DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDuplicate(t)}><Copy className="h-4 w-4 mr-2" />สร้างสำเนา</DropdownMenuItem>
                        {['draft', 'rejected'].includes(t.status) && (
                          <DropdownMenuItem onClick={() => handleDelete(t.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />ลบ</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

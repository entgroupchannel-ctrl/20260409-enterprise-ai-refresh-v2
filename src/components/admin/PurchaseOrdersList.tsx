import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Search, MoreHorizontal, Edit, Trash2, Plus, Loader2, ArrowRightLeft } from 'lucide-react';
import CreatePurchaseOrderDialog from './CreatePurchaseOrderDialog';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'ร่าง', variant: 'secondary' },
  sent: { label: 'ส่งแล้ว', variant: 'default' },
  confirmed: { label: 'ยืนยัน', variant: 'default' },
  shipped: { label: 'จัดส่ง', variant: 'default' },
  received: { label: 'รับแล้ว', variant: 'default' },
  cancelled: { label: 'ยกเลิก', variant: 'destructive' },
};

interface PO {
  id: string;
  po_number: string;
  supplier_id: string;
  grand_total: number | null;
  currency: string | null;
  status: string;
  order_date: string | null;
  expected_delivery: string | null;
  created_at: string;
}

interface TransferRef {
  id: string;
  transfer_number: string;
  status: string;
  amount: number;
  currency: string;
}

export default function PurchaseOrdersList() {
  const [orders, setOrders] = useState<PO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  // Transfer back-references: po_id -> TransferRef[]
  const [transferRefs, setTransferRefs] = useState<Record<string, TransferRef[]>>({});

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('id, po_number, supplier_id, grand_total, currency, status, order_date, expected_delivery, created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) { toast.error(error.message); setLoading(false); return; }
    const list = (data as PO[]) || [];
    setOrders(list);

    // Fetch transfer back-references for all POs
    if (list.length > 0) {
      const { data: transfers } = await supabase
        .from('international_transfer_requests')
        .select('id, transfer_number, status, amount, currency, purchase_order_ids')
        .is('deleted_at', null);
      if (transfers) {
        const refs: Record<string, TransferRef[]> = {};
        for (const t of transfers as any[]) {
          const poIds: string[] = t.purchase_order_ids || [];
          for (const poId of poIds) {
            if (!refs[poId]) refs[poId] = [];
            refs[poId].push({
              id: t.id,
              transfer_number: t.transfer_number,
              status: t.status,
              amount: t.amount,
              currency: t.currency,
            });
          }
        }
        setTransferRefs(refs);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return o.po_number?.toLowerCase().includes(q) || (o.supplier_name || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [orders, search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบ PO นี้?')) return;
    const { error } = await supabase.from('purchase_orders').update({ deleted_at: new Date().toISOString() } as any).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('ลบแล้ว');
    fetchOrders();
  };

  const handleEdit = (id: string) => {
    setEditId(id);
    setDialogOpen(true);
  };

  const fmt = (n: number | null) => n != null ? n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

  const statusBadge = (status: string) => {
    const cfg = STATUS_MAP[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ค้นหา PO, supplier..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              {Object.entries(STATUS_MAP).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { setEditId(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" />สร้าง PO
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เลข PO</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Grand Total</TableHead>
                <TableHead>สกุลเงิน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>Transfer อ้างอิง</TableHead>
                <TableHead>วันที่สั่ง</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">ไม่พบรายการ</TableCell></TableRow>
              ) : filtered.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.po_number}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{o.supplier_name || '-'}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(o.grand_total)}</TableCell>
                  <TableCell><Badge variant="outline">{o.currency || '-'}</Badge></TableCell>
                  <TableCell>{statusBadge(o.status)}</TableCell>
                  <TableCell>
                    {transferRefs[o.id]?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {transferRefs[o.id].map(t => (
                          <Badge key={t.id} variant="outline" className="text-xs font-mono cursor-default" title={`${t.transfer_number} — ${t.status}`}>
                            <ArrowRightLeft className="w-3 h-3 mr-1" />
                            {t.transfer_number}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">ยังไม่มีคำขอโอน</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{o.order_date || '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(o.id)}><Edit className="h-4 w-4 mr-2" />แก้ไข</DropdownMenuItem>
                        {['draft'].includes(o.status) && (
                          <DropdownMenuItem onClick={() => handleDelete(o.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />ลบ</DropdownMenuItem>
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

      <CreatePurchaseOrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editId={editId}
        onSaved={fetchOrders}
      />
    </div>
  );
}

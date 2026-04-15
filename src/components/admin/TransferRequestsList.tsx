import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Search, MoreHorizontal, Eye, Edit, Copy, Trash2, DollarSign, Clock, CheckCircle, FileText, Send, ShieldCheck, XCircle, Upload, Loader2, Mail, Printer } from 'lucide-react';
import TransferStatusBadge from './TransferStatusBadge';
import TransferEmailModal from './TransferEmailModal';
import TransferPrintDialog from './TransferPrintDialog';
import { useAuth } from '@/hooks/useAuth';

const DOC_TYPE_LABELS: Record<string, string> = {
  proforma_invoice: 'PI', commercial_invoice: 'CI', air_waybill: 'AWB',
  packing_list: 'PL', certificate: 'Cert', other: 'อื่นๆ',
};
interface DocRef { id: string; document_type: string; file_url: string; title: string; }

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
  created_by: string | null;
}

interface Props {
  onEdit?: (id: string) => void;
}

export default function TransferRequestsList({ onEdit }: Props) {
  const { isSuperAdmin, profile } = useAuth();
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [poMap, setPoMap] = useState<Record<string, string>>({});
  const [docMap, setDocMap] = useState<Record<string, DocRef[]>>({});
  const [supplierEmails, setSupplierEmails] = useState<Record<string, string | null>>({});
  const [piMap, setPiMap] = useState<Record<string, string>>({});
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTarget, setEmailTarget] = useState<TransferRequest | null>(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [printTargetId, setPrintTargetId] = useState<string | null>(null);

  // Approval dialogs
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<TransferRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Confirm transfer dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<TransferRequest | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);

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
        const { data: pos } = await supabase.from('purchase_orders').select('id, po_number, pi_number, supplier_id').in('id', allPoIds);
        if (pos) {
          const map: Record<string, string> = {};
          const piM: Record<string, string> = {};
          const supplierIds = new Set<string>();
          for (const p of pos as any[]) {
            map[p.id] = p.po_number;
            if (p.pi_number) piM[p.id] = p.pi_number;
            if (p.supplier_id) supplierIds.add(p.supplier_id);
          }
          setPoMap(map);
          setPiMap(piM);

          // Resolve supplier emails
          const sIds = [...supplierIds];
          if (sIds.length > 0) {
            const { data: sups } = await supabase.from('suppliers').select('id, email').in('id', sIds);
            if (sups) {
              const em: Record<string, string | null> = {};
              for (const s of sups as any[]) em[s.id] = s.email;
              setSupplierEmails(em);
            }
          }
        }
      }

      // Resolve attached documents
      const transferIds = list.map(t => t.id);
      if (transferIds.length > 0) {
        const { data: docs } = await supabase.from('supplier_documents')
          .select('id, document_type, file_url, title, transfer_request_id')
          .in('transfer_request_id', transferIds);
        if (docs) {
          const dm: Record<string, DocRef[]> = {};
          for (const d of docs as any[]) {
            const tid = d.transfer_request_id;
            if (!dm[tid]) dm[tid] = [];
            dm[tid].push({ id: d.id, document_type: d.document_type, file_url: d.file_url, title: d.title });
          }
          setDocMap(dm);
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

  // Submit for approval (draft → pending) + notify super_admins
  const handleSubmitForApproval = async (t: TransferRequest) => {
    setActionLoading(t.id);
    try {
      const { error } = await supabase
        .from('international_transfer_requests')
        .update({ status: 'pending', updated_at: new Date().toISOString() })
        .eq('id', t.id);
      if (error) throw error;

      // Notify all super_admins
      const { data: admins } = await supabase.from('users').select('id').eq('role', 'super_admin').eq('is_active', true);
      if (admins?.length) {
        const notifs = admins.map((a: any) => ({
          user_id: a.id,
          type: 'transfer_approval',
          title: '📋 คำขอโอนเงินต่างประเทศรออนุมัติ',
          message: `${t.transfer_number} — ${t.currency} ${fmtNum(t.amount)} — ${t.supplier_name}`,
          priority: 'high',
          action_url: '/admin/international-transfer',
          action_label: 'ตรวจสอบ',
          link_type: 'transfer',
          link_id: t.id,
        }));
        await supabase.from('notifications').insert(notifs);
      }

      toast.success('ส่งอนุมัติแล้ว');
      fetchTransfers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Approve (via RPC)
  const handleApprove = async (t: TransferRequest) => {
    setActionLoading(t.id);
    try {
      const { data, error } = await supabase.rpc('approve_transfer_request', { p_transfer_id: t.id });
      if (error) throw error;
      const result = data as any;
      if (!result?.success) throw new Error(result?.error || 'Failed');
      toast.success(`อนุมัติ ${result.transfer_number} แล้ว`);
      fetchTransfers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Reject (via RPC)
  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) { toast.error('กรุณาระบุเหตุผล'); return; }
    setActionLoading(rejectTarget.id);
    try {
      const { data, error } = await supabase.rpc('reject_transfer_request', {
        p_transfer_id: rejectTarget.id, p_reason: rejectReason.trim(),
      });
      if (error) throw error;
      const result = data as any;
      if (!result?.success) throw new Error(result?.error || 'Failed');
      toast.success(`ปฏิเสธ ${result.transfer_number} แล้ว`);
      setRejectDialogOpen(false);
      setRejectTarget(null);
      setRejectReason('');
      fetchTransfers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Confirm transfer sent (via RPC)
  const handleConfirmSent = async () => {
    if (!confirmTarget) return;
    setActionLoading(confirmTarget.id);
    try {
      let slipUrl: string | null = null;
      // Upload slip if provided
      if (slipFile) {
        const path = `${confirmTarget.supplier_id}/${confirmTarget.id}/slip_${Date.now()}_${slipFile.name}`;
        const { error: upErr } = await supabase.storage.from('supplier-documents').upload(path, slipFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
        slipUrl = urlData.publicUrl;
      }

      const { data, error } = await supabase.rpc('confirm_transfer_sent', {
        p_transfer_id: confirmTarget.id,
        p_slip_url: slipUrl,
      });
      if (error) throw error;
      const result = data as any;
      if (!result?.success) throw new Error(result?.error || 'Failed');
      toast.success(`ยืนยันโอน ${result.transfer_number} แล้ว`);
      setConfirmDialogOpen(false);
      setConfirmTarget(null);
      setSlipFile(null);
      fetchTransfers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const fmtNum = (n: number | null) => n != null ? n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

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
            <div><p className="text-xs text-muted-foreground">มูลค่ารวม (THB)</p><p className="text-lg font-bold">฿{fmtNum(stats.totalThb)}</p></div>
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
                <TableHead>PO อ้างอิง</TableHead>
                <TableHead>เอกสาร</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>แจ้ง</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">กำลังโหลด...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">ไม่พบรายการ</TableCell></TableRow>
              ) : filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.transfer_number}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{t.supplier_name}</TableCell>
                  <TableCell className="text-right font-mono">{fmtNum(t.amount)}</TableCell>
                  <TableCell><Badge variant="outline">{t.currency}</Badge></TableCell>
                  <TableCell className="text-right font-mono">{t.exchange_rate ? fmtNum(t.exchange_rate) : '-'}</TableCell>
                  <TableCell className="text-right font-mono">{fmtNum(t.total_cost_thb || t.amount_thb)}</TableCell>
                  <TableCell>
                    {(t.purchase_order_ids?.length ?? 0) > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {t.purchase_order_ids!.map(poId => (
                          <Badge key={poId} variant="outline" className="text-xs font-mono">
                            {poMap[poId] || poId.slice(0, 8)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {(docMap[t.id]?.length ?? 0) > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {docMap[t.id].map(d => (
                          <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer" title={d.title}>
                            <Badge variant="secondary" className="text-[10px] h-5 cursor-pointer hover:bg-primary/20">
                              {DOC_TYPE_LABELS[d.document_type] || d.document_type}
                            </Badge>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell><TransferStatusBadge status={t.status} /></TableCell>
                  <TableCell>
                    {(t as any).email_notification_status === 'sent' ? (
                      <Badge variant="default" className="text-[10px]">📧 ส่งแล้ว</Badge>
                    ) : (t as any).email_notification_status === 'preview_only' ? (
                      <Badge variant="secondary" className="text-[10px]">📋 Copy แล้ว</Badge>
                    ) : t.status === 'transferred' ? (
                      <Badge variant="outline" className="text-[10px]">⏳ ยังไม่แจ้ง</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={actionLoading === t.id}>
                          {actionLoading === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(t.id)}>
                          <Eye className="h-4 w-4 mr-2" />ดูรายละเอียด
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setPrintTargetId(t.id); setPrintDialogOpen(true); }}>
                          <Printer className="h-4 w-4 mr-2" />พิมพ์ฟอร์ม
                        </DropdownMenuItem>

                        {/* Draft actions */}
                        {t.status === 'draft' && (
                          <>
                            <DropdownMenuItem onClick={() => onEdit?.(t.id)}>
                              <Edit className="h-4 w-4 mr-2" />แก้ไข
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSubmitForApproval(t)}>
                              <Send className="h-4 w-4 mr-2" />ส่งอนุมัติ
                            </DropdownMenuItem>
                          </>
                        )}

                        {/* Pending actions (super_admin only) */}
                        {t.status === 'pending' && isSuperAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleApprove(t)} className="text-green-600">
                              <ShieldCheck className="h-4 w-4 mr-2" />อนุมัติ
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setRejectTarget(t); setRejectReason(''); setRejectDialogOpen(true); }} className="text-destructive">
                              <XCircle className="h-4 w-4 mr-2" />ปฏิเสธ
                            </DropdownMenuItem>
                          </>
                        )}

                        {/* Approved actions */}
                        {t.status === 'approved' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setConfirmTarget(t); setSlipFile(null); setConfirmDialogOpen(true); }} className="text-blue-600">
                              <Upload className="h-4 w-4 mr-2" />ยืนยันโอนแล้ว
                            </DropdownMenuItem>
                          </>
                        )}

                        {/* Transferred actions — email supplier */}
                        {t.status === 'transferred' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setEmailTarget(t); setEmailModalOpen(true); }}>
                              <Mail className="h-4 w-4 mr-2" />📧 แจ้ง Supplier
                            </DropdownMenuItem>
                          </>
                        )}

                        {/* Rejected actions */}
                        {t.status === 'rejected' && (
                          <DropdownMenuItem onClick={() => onEdit?.(t.id)}>
                            <Edit className="h-4 w-4 mr-2" />แก้ไข
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDuplicate(t)}>
                          <Copy className="h-4 w-4 mr-2" />สร้างสำเนา
                        </DropdownMenuItem>

                        {['draft', 'rejected'].includes(t.status) && (
                          <DropdownMenuItem onClick={() => handleDelete(t.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />ลบ
                          </DropdownMenuItem>
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

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ปฏิเสธคำขอโอนเงิน</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {rejectTarget?.transfer_number} — {rejectTarget?.currency} {rejectTarget ? fmtNum(rejectTarget.amount) : ''}
            </p>
            <div className="space-y-1">
              <Label className="text-sm">เหตุผลที่ปฏิเสธ *</Label>
              <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="ระบุเหตุผล..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim() || !!actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <XCircle className="w-4 h-4 mr-1" />}
              ปฏิเสธ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Transfer Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ยืนยันโอนเงินแล้ว</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {confirmTarget?.transfer_number} — {confirmTarget?.currency} {confirmTarget ? fmtNum(confirmTarget.amount) : ''} → {confirmTarget?.supplier_name}
            </p>
            <div className="space-y-1">
              <Label className="text-sm">แนบสลิปโอนเงิน (ไม่บังคับ)</Label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setSlipFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleConfirmSent} disabled={!!actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
              ยืนยันโอนแล้ว
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Email Modal */}
      {emailTarget && (
        <TransferEmailModal
          open={emailModalOpen}
          onOpenChange={setEmailModalOpen}
          transfer={emailTarget as any}
          supplier={{
            email: supplierEmails[emailTarget.supplier_id] || null,
            company_name: emailTarget.supplier_name,
          }}
          poNumbers={poMap}
          piNumbers={piMap}
          onStatusUpdated={fetchTransfers}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import TransferStatusBadge from './TransferStatusBadge';
import {
  Upload, Download, Trash2, FileText, Loader2,
  Plus, ShieldCheck, CheckCircle, Clock, DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  supplierId: string;
  supplierName?: string;
  defaultTab?: 'documents' | 'po_pi' | 'transfers';
}
interface Doc {
  id: string; title: string; document_type: string; document_number: string | null;
  file_url: string; file_name: string | null; file_size: number | null;
  amount: number | null; currency: string | null; issue_date: string | null;
  created_at: string; purchase_order_id: string | null; transfer_request_id: string | null;
  uploaded_by: string | null;
}
interface PO {
  id: string; po_number: string; pi_number: string | null; ci_number: string | null;
  order_date: string | null; expected_delivery: string | null; grand_total: number | null;
  currency: string | null; status: string; items: any; shipping_cost: number | null; handling_fee: number | null;
}
interface Transfer {
  id: string; transfer_number: string; amount: number; currency: string;
  amount_thb: number | null; exchange_rate: number | null; status: string;
  priority: string | null; purpose: string; purchase_order_ids: string[] | null;
  requested_transfer_date: string | null; transferred_at: string | null; created_at: string;
  transfer_slip_url: string | null; invoice_reference: string | null;
  bank_name: string; bank_account_number: string; bank_account_name: string | null;
  swift_code: string; notes: string | null;
}

const DOC_TYPES = [
  { value: 'proforma_invoice',   label: 'Proforma Invoice (PI)',   short: 'PI'   },
  { value: 'commercial_invoice', label: 'Commercial Invoice (CI)', short: 'CI'   },
  { value: 'air_waybill',        label: 'Air Waybill (AWB)',       short: 'AWB'  },
  { value: 'packing_list',       label: 'Packing List',            short: 'PL'   },
  { value: 'transfer_slip',      label: 'หลักฐานการโอนเงิน',        short: 'SLIP' },
  { value: 'certificate',        label: 'Certificate',             short: 'CERT' },
  { value: 'contract',           label: 'Contract / Agreement',    short: 'CTR'  },
  { value: 'other',              label: 'อื่นๆ',                    short: 'DOC'  },
];
const docShort = (type: string) => DOC_TYPES.find(d => d.value === type)?.short ?? type.toUpperCase();

const POStatusBadge = ({ status }: { status: string }) => {
  const cfg: Record<string, { label: string; cls: string }> = {
    draft:     { label: 'ร่าง',        cls: 'bg-muted text-muted-foreground' },
    confirmed: { label: 'ยืนยันแล้ว',  cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    shipped:   { label: 'จัดส่งแล้ว',  cls: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    received:  { label: 'รับแล้ว',     cls: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    cancelled: { label: 'ยกเลิก',     cls: 'bg-red-100 text-red-800' },
  };
  const c = cfg[status] ?? { label: status, cls: 'bg-muted' };
  return <Badge className={`text-xs ${c.cls}`}>{c.label}</Badge>;
};

export default function SupplierDocumentsHub({ supplierId, defaultTab = 'documents' }: Props) {
  const { profile, isAccountant, isAdmin, isSuperAdmin } = useAuth();
  const canFinance = isAccountant || isAdmin || isSuperAdmin;

  const [docs,      setDocs]      = useState<Doc[]>([]);
  const [pos,       setPos]       = useState<PO[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [uploadOpen,       setUploadOpen]       = useState(false);
  const [uploadDocType,    setUploadDocType]    = useState('proforma_invoice');
  const [uploadDocNumber,  setUploadDocNumber]  = useState('');
  const [uploadTitle,      setUploadTitle]      = useState('');
  const [uploadAmount,     setUploadAmount]     = useState('');
  const [uploadCurrency,   setUploadCurrency]   = useState('USD');
  const [uploadIssueDate,  setUploadIssueDate]  = useState('');
  const [uploadPoId,       setUploadPoId]       = useState('');
  const [uploadTransferId, setUploadTransferId] = useState('');
  const [uploadFile,       setUploadFile]       = useState<File | null>(null);
  const [uploading,        setUploading]        = useState(false);

  const [confirmOpen,   setConfirmOpen]   = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<Transfer | null>(null);
  const [slipFile,      setSlipFile]      = useState<File | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadAll(); }, [supplierId]);

  const loadAll = async () => {
    setLoading(true);
    const [docRes, poRes, trRes] = await Promise.all([
      supabase.from('supplier_documents').select('*').eq('supplier_id', supplierId).order('created_at', { ascending: false }),
      supabase.from('purchase_orders').select('id,po_number,pi_number,ci_number,order_date,expected_delivery,grand_total,currency,status,items,shipping_cost,handling_fee').eq('supplier_id', supplierId).is('deleted_at', null).order('created_at', { ascending: false }),
      supabase.from('international_transfer_requests').select('id,transfer_number,amount,currency,amount_thb,exchange_rate,status,priority,purpose,purchase_order_ids,requested_transfer_date,transferred_at,created_at,transfer_slip_url,invoice_reference,bank_name,bank_account_number,bank_account_name,swift_code,notes').eq('supplier_id', supplierId).is('deleted_at', null).order('created_at', { ascending: false }),
    ]);
    setDocs((docRes.data as Doc[]) ?? []);
    setPos((poRes.data as PO[]) ?? []);
    setTransfers((trRes.data as Transfer[]) ?? []);
    setLoading(false);
  };

  const poById: Record<string, PO> = {};
  for (const po of pos) poById[po.id] = po;

  const resetUpload = () => {
    setUploadDocType('proforma_invoice'); setUploadDocNumber(''); setUploadTitle('');
    setUploadAmount(''); setUploadCurrency('USD'); setUploadIssueDate('');
    setUploadPoId(''); setUploadTransferId(''); setUploadFile(null);
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) { toast.error('กรุณากรอกชื่อเอกสารและเลือกไฟล์'); return; }
    setUploading(true);
    const ext = uploadFile.name.split('.').pop();
    const path = `${supplierId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('supplier-documents').upload(path, uploadFile);
    if (upErr) { toast.error('อัปโหลดล้มเหลว: ' + upErr.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
    const { error } = await supabase.from('supplier_documents').insert({
      supplier_id: supplierId, document_type: uploadDocType,
      document_number: uploadDocNumber || null, title: uploadTitle,
      file_url: urlData.publicUrl, file_name: uploadFile.name, file_size: uploadFile.size,
      amount: uploadAmount ? parseFloat(uploadAmount) : null, currency: uploadCurrency,
      issue_date: uploadIssueDate || null,
      purchase_order_id: uploadPoId || null,
      transfer_request_id: uploadTransferId || null,
      uploaded_by: profile?.id ?? null,
    } as any);
    if (error) toast.error('บันทึกล้มเหลว: ' + error.message);
    else { toast.success('อัปโหลดสำเร็จ'); setUploadOpen(false); resetUpload(); loadAll(); }
    setUploading(false);
  };

  const deleteDoc = async (id: string) => {
    if (!confirm('ต้องการลบเอกสารนี้?')) return;
    await supabase.from('supplier_documents').delete().eq('id', id);
    toast.success('ลบแล้ว'); loadAll();
  };

  const approveTransfer = async (t: Transfer) => {
    setActionLoading(t.id);
    const { error } = await supabase.from('international_transfer_requests')
      .update({ status: 'approved', approved_by: profile?.id, approved_at: new Date().toISOString() } as any)
      .eq('id', t.id);
    if (error) toast.error('อนุมัติล้มเหลว');
    else { toast.success('อนุมัติแล้ว'); loadAll(); }
    setActionLoading(null);
  };

  const confirmTransfer = async () => {
    if (!confirmTarget) return;
    setActionLoading(confirmTarget.id);
    let slipUrl: string | undefined;
    if (slipFile) {
      const ext = slipFile.name.split('.').pop();
      const path = `slips/${confirmTarget.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('supplier-documents').upload(path, slipFile);
      if (upErr) { toast.error('อัปโหลด Slip ล้มเหลว'); setActionLoading(null); return; }
      const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
      slipUrl = urlData.publicUrl;
      await supabase.from('supplier_documents').insert({
        supplier_id: supplierId, document_type: 'transfer_slip',
        title: `Transfer Slip — ${confirmTarget.transfer_number}`,
        file_url: slipUrl, file_name: slipFile.name, file_size: slipFile.size,
        transfer_request_id: confirmTarget.id, uploaded_by: profile?.id ?? null,
        currency: confirmTarget.currency, amount: confirmTarget.amount,
      } as any);
    }
    const { error } = await supabase.from('international_transfer_requests')
      .update({ status: 'transferred', transferred_at: new Date().toISOString(), ...(slipUrl ? { transfer_slip_url: slipUrl } : {}) } as any)
      .eq('id', confirmTarget.id);
    if (error) toast.error('บันทึกล้มเหลว');
    else { toast.success('ยืนยันการโอนแล้ว'); setConfirmOpen(false); setConfirmTarget(null); setSlipFile(null); loadAll(); }
    setActionLoading(null);
  };

  const openUploadFor = (opts: { poId?: string; transferId?: string; po?: PO }) => {
    resetUpload();
    if (opts.poId) setUploadPoId(opts.poId);
    if (opts.transferId) setUploadTransferId(opts.transferId);
    if (opts.po) { setUploadTitle(`เอกสาร ${opts.po.po_number}`); if (opts.po.pi_number) setUploadDocNumber(opts.po.pi_number); }
    setUploadOpen(true);
  };

  const totalPoUSD       = pos.reduce((s, p) => s + (p.grand_total ?? 0), 0);
  const totalTransferred = transfers.filter(t => t.status === 'transferred').reduce((s, t) => s + t.amount, 0);
  const pendingCount     = transfers.filter(t => ['pending', 'approved'].includes(t.status)).length;

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'เอกสารทั้งหมด', value: docs.length,      Icon: FileText,    color: 'text-foreground'  },
          { label: 'PO ทั้งหมด',    value: pos.length,       Icon: CheckCircle, color: 'text-blue-500'    },
          { label: 'โอนแล้ว (USD)', value: `$${totalTransferred.toLocaleString('en-US',{minimumFractionDigits:2})}`, Icon: DollarSign, color: 'text-green-500' },
          { label: 'รออนุมัติ/โอน', value: pendingCount,     Icon: Clock,       color: 'text-yellow-500'  },
        ].map(c => (
          <Card key={c.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-xl font-bold">{c.value}</p>
                </div>
                <c.Icon className={`w-6 h-6 ${c.color} opacity-30`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <TabsList>
            <TabsTrigger value="documents" className="text-xs">
              📄 เอกสาร ({docs.length})
            </TabsTrigger>
            <TabsTrigger value="po_pi" className="text-xs">
              📋 PO &amp; PI ({pos.length})
            </TabsTrigger>
            <TabsTrigger value="transfers" className="text-xs gap-1">
              💸 โอนเงิน ({transfers.length})
              {pendingCount > 0 && (
                <Badge className="bg-yellow-500 text-white text-[10px] px-1 py-0 h-4 ml-0.5">{pendingCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <Button size="sm" onClick={() => { resetUpload(); setUploadOpen(true); }}>
            <Plus className="w-4 h-4 mr-1" /> อัปโหลดเอกสาร
          </Button>
        </div>

        {/* TAB 1: เอกสาร */}
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-0">
              {docs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">ยังไม่มีเอกสาร</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setUploadOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" /> อัปโหลดแรก
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">ประเภท</TableHead>
                      <TableHead>ชื่อเอกสาร</TableHead>
                      <TableHead>เลขเอกสาร</TableHead>
                      <TableHead>อ้างอิง PO / PI</TableHead>
                      <TableHead>อ้างอิง Transfer</TableHead>
                      <TableHead className="text-right">จำนวนเงิน</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {docs.map(doc => {
                      const linkedPo = doc.purchase_order_id ? poById[doc.purchase_order_id] : null;
                      const linkedTr = doc.transfer_request_id ? transfers.find(t => t.id === doc.transfer_request_id) : null;
                      return (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <Badge variant="outline" className="text-xs font-mono px-1.5">{docShort(doc.document_type)}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-sm leading-tight">{doc.title}</div>
                            {doc.file_name && <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">{doc.file_name}</div>}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{doc.document_number ?? '—'}</TableCell>
                          <TableCell>
                            {linkedPo ? (
                              <div className="text-xs leading-relaxed">
                                <div className="font-mono font-semibold text-blue-700 dark:text-blue-400">{linkedPo.po_number}</div>
                                {linkedPo.pi_number && <div className="text-muted-foreground">PI: {linkedPo.pi_number}</div>}
                              </div>
                            ) : <span className="text-muted-foreground text-xs">—</span>}
                          </TableCell>
                          <TableCell>
                            {linkedTr ? (
                              <div className="text-xs leading-relaxed">
                                <div className="font-mono">{linkedTr.transfer_number}</div>
                                <TransferStatusBadge status={linkedTr.status} />
                              </div>
                            ) : <span className="text-muted-foreground text-xs">—</span>}
                          </TableCell>
                          <TableCell className="text-right text-sm tabular-nums">
                            {doc.amount ? `${doc.currency} ${Number(doc.amount).toLocaleString('en-US',{minimumFractionDigits:2})}` : '—'}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(doc.issue_date ?? doc.created_at), 'dd MMM yy', { locale: th })}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-0.5 justify-end">
                              <Button size="icon" variant="ghost" className="w-7 h-7" asChild>
                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer"><Download className="w-3.5 h-3.5" /></a>
                              </Button>
                              <Button size="icon" variant="ghost" className="w-7 h-7 text-destructive hover:text-destructive" onClick={() => deleteDoc(doc.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: PO & PI */}
        <TabsContent value="po_pi">
          <Card>
            <CardContent className="p-0">
              {pos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">ยังไม่มีใบสั่งซื้อ</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลข PO</TableHead>
                      <TableHead>PI Number</TableHead>
                      <TableHead>CI Number</TableHead>
                      <TableHead>วันที่สั่ง</TableHead>
                      <TableHead>กำหนดส่ง</TableHead>
                      <TableHead className="text-right">ยอดรวม</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">เอกสาร</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pos.map(po => {
                      const poDocs = docs.filter(d => d.purchase_order_id === po.id);
                      const isOverdue = po.expected_delivery && new Date(po.expected_delivery) < new Date() && po.status !== 'received';
                      return (
                        <TableRow key={po.id}>
                          <TableCell className="font-mono text-xs font-bold">{po.po_number}</TableCell>
                          <TableCell>
                            {po.pi_number
                              ? <span className="font-mono text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">{po.pi_number}</span>
                              : <span className="text-muted-foreground text-xs">—</span>}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{po.ci_number ?? '—'}</TableCell>
                          <TableCell className="text-xs">
                            {po.order_date ? format(new Date(po.order_date), 'dd MMM yy', { locale: th }) : '—'}
                          </TableCell>
                          <TableCell className="text-xs">
                            {po.expected_delivery
                              ? <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                                  {format(new Date(po.expected_delivery), 'dd MMM yy', { locale: th })}
                                  {isOverdue && ' ⚠️'}
                                </span>
                              : '—'}
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm tabular-nums">
                            {po.currency} {Number(po.grand_total ?? 0).toLocaleString('en-US',{minimumFractionDigits:2})}
                          </TableCell>
                          <TableCell><POStatusBadge status={po.status} /></TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end flex-wrap">
                              {poDocs.slice(0, 3).map(d => (
                                <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer">
                                  <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-muted px-1.5">{docShort(d.document_type)}</Badge>
                                </a>
                              ))}
                              {poDocs.length > 3 && <Badge variant="secondary" className="text-[10px]">+{poDocs.length - 3}</Badge>}
                              <Button size="sm" variant="ghost" className="text-xs h-6 px-1.5" onClick={() => openUploadFor({ poId: po.id, po })}>
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: โอนเงิน */}
        <TabsContent value="transfers">
          <div className="space-y-3">
            {transfers.length === 0 ? (
              <Card><CardContent className="text-center py-12 text-muted-foreground text-sm">ยังไม่มีรายการโอนเงิน</CardContent></Card>
            ) : transfers.map(t => {
              const coveredPos = (t.purchase_order_ids ?? []).map(pid => poById[pid]).filter(Boolean);
              const piNumbers  = coveredPos.map(po => po.pi_number).filter(Boolean) as string[];
              const trDocs     = docs.filter(d => d.transfer_request_id === t.id);
              const borderCls  = t.status === 'pending' ? 'border-l-4 border-l-yellow-400'
                               : t.status === 'approved' ? 'border-l-4 border-l-blue-400'
                               : t.status === 'transferred' ? 'border-l-4 border-l-green-400' : '';
              return (
                <Card key={t.id} className={borderCls}>
                  <CardContent className="pt-4 pb-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold">{t.transfer_number}</span>
                          <TransferStatusBadge status={t.status} />
                          {t.priority === 'urgent' && <Badge className="bg-red-100 text-red-700 text-xs">🔴 ด่วน</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{t.purpose}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold tabular-nums">
                          {t.currency} {Number(t.amount).toLocaleString('en-US',{minimumFractionDigits:2})}
                        </p>
                        {t.amount_thb && (
                          <p className="text-xs text-muted-foreground">
                            ≈ ฿{Number(t.amount_thb).toLocaleString()}{t.exchange_rate ? ` (@ ${t.exchange_rate})` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PI & PO Reference */}
                    {(piNumbers.length > 0 || coveredPos.length > 0 || t.invoice_reference) && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 text-xs space-y-1.5">
                        <p className="font-semibold text-blue-800 dark:text-blue-300 tracking-wide uppercase text-[10px] mb-1">📋 เอกสารอ้างอิง</p>
                        {piNumbers.length > 0 && (
                          <div className="flex gap-2 items-center flex-wrap">
                            <span className="text-muted-foreground w-20 shrink-0">PI Number</span>
                            <div className="flex gap-1 flex-wrap">
                              {piNumbers.map((pi, i) => (
                                <Badge key={i} variant="outline" className="font-mono text-xs bg-white dark:bg-background">{pi}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {coveredPos.length > 0 && (
                          <div className="flex gap-2 items-center flex-wrap">
                            <span className="text-muted-foreground w-20 shrink-0">PO Number</span>
                            <div className="flex gap-1 flex-wrap">
                              {coveredPos.map(po => (
                                <Badge key={po.id} variant="outline" className="font-mono text-xs bg-white dark:bg-background">{po.po_number}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {t.invoice_reference && (
                          <div className="flex gap-2 items-center">
                            <span className="text-muted-foreground w-20 shrink-0">Invoice Ref</span>
                            <span className="font-mono">{t.invoice_reference}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bank info — Finance only */}
                    {canFinance && (
                      <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs grid grid-cols-2 gap-x-6 gap-y-1">
                        <div><span className="text-muted-foreground block">ธนาคาร</span><span className="font-medium">{t.bank_name}</span></div>
                        <div><span className="text-muted-foreground block">SWIFT</span><span className="font-mono">{t.swift_code}</span></div>
                        <div><span className="text-muted-foreground block">เลขบัญชี</span><span className="font-mono">{t.bank_account_number}</span></div>
                        <div><span className="text-muted-foreground block">ชื่อบัญชี</span><span className="font-medium">{t.bank_account_name ?? '—'}</span></div>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex gap-4 text-[11px] text-muted-foreground flex-wrap">
                      <span>สร้าง: {format(new Date(t.created_at), 'dd MMM yy HH:mm', { locale: th })}</span>
                      {t.requested_transfer_date && <span>กำหนดโอน: {format(new Date(t.requested_transfer_date), 'dd MMM yy', { locale: th })}</span>}
                      {t.transferred_at && <span className="text-green-600 font-medium">✅ โอนแล้ว: {format(new Date(t.transferred_at), 'dd MMM yy HH:mm', { locale: th })}</span>}
                    </div>

                    {/* Docs + Actions */}
                    <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t">
                      <div className="flex gap-1 flex-wrap items-center">
                        {t.transfer_slip_url && (
                          <a href={t.transfer_slip_url} target="_blank" rel="noopener noreferrer">
                            <Badge variant="secondary" className="text-xs gap-1 cursor-pointer hover:bg-muted">
                              <FileText className="w-3 h-3" /> Slip
                            </Badge>
                          </a>
                        )}
                        {trDocs.map(d => (
                          <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">{docShort(d.document_type)}: {d.title}</Badge>
                          </a>
                        ))}
                        {!t.transfer_slip_url && trDocs.length === 0 && (
                          <span className="text-xs text-muted-foreground italic">ยังไม่มีเอกสารแนบ</span>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => openUploadFor({ transferId: t.id })}>
                          <Plus className="w-3 h-3 mr-0.5" /> แนบ
                        </Button>
                        {(isAdmin || isSuperAdmin) && t.status === 'pending' && (
                          <Button size="sm" className="text-xs h-7 bg-blue-600 hover:bg-blue-700" disabled={actionLoading === t.id} onClick={() => approveTransfer(t)}>
                            {actionLoading === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><ShieldCheck className="w-3 h-3 mr-0.5" /> อนุมัติ</>}
                          </Button>
                        )}
                        {canFinance && t.status === 'approved' && (
                          <Button size="sm" className="text-xs h-7 bg-green-600 hover:bg-green-700" onClick={() => { setConfirmTarget(t); setConfirmOpen(true); }}>
                            <Upload className="w-3 h-3 mr-0.5" /> ยืนยันโอน + Slip
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      <Dialog open={uploadOpen} onOpenChange={open => { if (!open) { setUploadOpen(false); resetUpload(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>📎 อัปโหลดเอกสาร</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">ประเภทเอกสาร *</Label>
                <Select value={uploadDocType} onValueChange={setUploadDocType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DOC_TYPES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">เลขเอกสาร (PI/CI/อื่นๆ)</Label>
                <Input value={uploadDocNumber} onChange={e => setUploadDocNumber(e.target.value)} placeholder="GTA20260409001" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">ชื่อเอกสาร *</Label>
              <Input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="PI สินค้าล็อต Q2-2026" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">ผูกกับ PO (ถ้ามี)</Label>
              <Select value={uploadPoId} onValueChange={setUploadPoId}>
                <SelectTrigger><SelectValue placeholder="ไม่ระบุ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ไม่ระบุ</SelectItem>
                  {pos.map(po => <SelectItem key={po.id} value={po.id}>{po.po_number}{po.pi_number ? ` — PI: ${po.pi_number}` : ''}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">ผูกกับ Transfer (ถ้ามี)</Label>
              <Select value={uploadTransferId} onValueChange={setUploadTransferId}>
                <SelectTrigger><SelectValue placeholder="ไม่ระบุ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ไม่ระบุ</SelectItem>
                  {transfers.map(t => <SelectItem key={t.id} value={t.id}>{t.transfer_number} — {t.currency} {Number(t.amount).toLocaleString()} [{t.status}]</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">จำนวนเงิน</Label>
                <Input type="number" value={uploadAmount} onChange={e => setUploadAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">สกุลเงิน</Label>
                <Select value={uploadCurrency} onValueChange={setUploadCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['USD','EUR','GBP','JPY','CNY','THB'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">วันที่ออกเอกสาร</Label>
              <Input type="date" value={uploadIssueDate} onChange={e => setUploadIssueDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">ไฟล์ *</Label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx" onChange={e => setUploadFile(e.target.files?.[0] ?? null)} />
              <p className="text-[11px] text-muted-foreground">PDF, JPG, PNG, XLSX, DOCX</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setUploadOpen(false); resetUpload(); }}>ยกเลิก</Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}อัปโหลด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Transfer Modal */}
      <Dialog open={confirmOpen} onOpenChange={open => { if (!open) { setConfirmOpen(false); setConfirmTarget(null); setSlipFile(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>✅ ยืนยันการโอนเงิน</DialogTitle></DialogHeader>
          {confirmTarget && (
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Transfer</span><span className="font-mono font-bold">{confirmTarget.transfer_number}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">จำนวน</span><span className="font-bold text-green-700">{confirmTarget.currency} {Number(confirmTarget.amount).toLocaleString('en-US',{minimumFractionDigits:2})}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">ธนาคาร</span><span>{confirmTarget.bank_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">เลขบัญชี</span><span className="font-mono text-xs">{confirmTarget.bank_account_number}</span></div>
              </div>
              {(() => {
                const covPos = (confirmTarget.purchase_order_ids ?? []).map(id => poById[id]).filter(Boolean);
                const pis = covPos.map(p => p.pi_number).filter(Boolean);
                return pis.length > 0 ? (
                  <div className="flex gap-2 text-sm items-center flex-wrap">
                    <span className="text-muted-foreground">PI อ้างอิง:</span>
                    {pis.map((pi, i) => <Badge key={i} variant="outline" className="font-mono">{pi}</Badge>)}
                  </div>
                ) : null;
              })()}
              <div className="space-y-1">
                <Label className="text-xs">แนบ Transfer Slip (PDF/รูป)</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setSlipFile(e.target.files?.[0] ?? null)} />
                <p className="text-[11px] text-muted-foreground">แนบหลักฐานการโอนจากธนาคาร</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setConfirmOpen(false); setConfirmTarget(null); setSlipFile(null); }}>ยกเลิก</Button>
            <Button className="bg-green-600 hover:bg-green-700" disabled={!!actionLoading} onClick={confirmTransfer}>
              {actionLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}ยืนยันโอนแล้ว
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

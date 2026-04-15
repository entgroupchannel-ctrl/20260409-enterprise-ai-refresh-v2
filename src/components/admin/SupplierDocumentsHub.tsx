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
import { Upload, Download, Trash2, FileText, Loader2, Plus, ShieldCheck, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  supplierId: string;
  supplierName?: string;
  defaultTab?: 'documents' | 'po_pi' | 'transfers';
}

const DOC_TYPES = [
  { value: 'proforma_invoice', label: 'Proforma Invoice (PI)', short: 'PI' },
  { value: 'commercial_invoice', label: 'Commercial Invoice (CI)', short: 'CI' },
  { value: 'air_waybill', label: 'Air Waybill (AWB)', short: 'AWB' },
  { value: 'packing_list', label: 'Packing List', short: 'PL' },
  { value: 'transfer_slip', label: 'หลักฐานการโอนเงิน', short: 'SLIP' },
  { value: 'certificate', label: 'Certificate', short: 'CERT' },
  { value: 'contract', label: 'Contract / Agreement', short: 'CTR' },
  { value: 'other', label: 'อื่นๆ', short: 'DOC' },
];

const docTypeShort = (type: string) =>
  DOC_TYPES.find(d => d.value === type)?.short || type.toUpperCase();

const POStatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    received: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  const label: Record<string, string> = {
    draft: 'ร่าง', confirmed: 'ยืนยันแล้ว', shipped: 'จัดส่งแล้ว',
    received: 'รับแล้ว', cancelled: 'ยกเลิก',
  };
  return (
    <Badge className={`text-xs ${map[status] || 'bg-muted'}`}>
      {label[status] || status}
    </Badge>
  );
};

export default function SupplierDocumentsHub({ supplierId, supplierName, defaultTab }: Props) {
  const { profile, isAccountant, isAdmin, isSuperAdmin } = useAuth();
  const canManageTransfer = isAccountant || isAdmin || isSuperAdmin;

  const [docs, setDocs] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload modal
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('proforma_invoice');
  const [uploadDocNumber, setUploadDocNumber] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAmount, setUploadAmount] = useState('');
  const [uploadCurrency, setUploadCurrency] = useState('USD');
  const [uploadIssueDate, setUploadIssueDate] = useState('');
  const [uploadPoId, setUploadPoId] = useState('');
  const [uploadTransferId, setUploadTransferId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [activeTab, setActiveTab] = useState(defaultTab || 'documents');

  useEffect(() => { loadAll(); }, [supplierId]);

  const loadAll = async () => {
    setLoading(true);
    const [docRes, poRes, trRes] = await Promise.all([
      supabase
        .from('supplier_documents')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false }),
      supabase
        .from('purchase_orders')
        .select('id, po_number, pi_number, ci_number, order_date, expected_delivery, grand_total, currency, status, shipping_cost, handling_fee')
        .eq('supplier_id', supplierId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
      supabase
        .from('international_transfer_requests')
        .select('id, transfer_number, amount, currency, amount_thb, exchange_rate, status, priority, purpose, purchase_order_ids, requested_transfer_date, transferred_at, created_at, transfer_slip_url, invoice_reference, bank_name, bank_account_number, bank_account_name, swift_code, notes')
        .eq('supplier_id', supplierId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
    ]);
    setDocs((docRes.data as any[]) || []);
    setPos((poRes.data as any[]) || []);
    setTransfers((trRes.data as any[]) || []);
    setLoading(false);
  };

  const poById: Record<string, any> = {};
  for (const po of pos) poById[po.id] = po;

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) {
      toast.error('กรุณากรอกชื่อเอกสารและเลือกไฟล์');
      return;
    }
    setUploading(true);
    const ext = uploadFile.name.split('.').pop();
    const path = `${supplierId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('supplier-documents').upload(path, uploadFile);
    if (upErr) {
      toast.error('อัปโหลดไฟล์ไม่สำเร็จ: ' + upErr.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
    const { error } = await supabase.from('supplier_documents').insert({
      supplier_id: supplierId,
      document_type: uploadDocType,
      document_number: uploadDocNumber || null,
      title: uploadTitle,
      file_url: urlData.publicUrl,
      file_name: uploadFile.name,
      file_size: uploadFile.size,
      amount: uploadAmount ? parseFloat(uploadAmount) : null,
      currency: uploadCurrency,
      issue_date: uploadIssueDate || null,
      purchase_order_id: uploadPoId || null,
      transfer_request_id: uploadTransferId || null,
      uploaded_by: profile?.id || null,
    });
    if (error) {
      toast.error('บันทึกไม่สำเร็จ: ' + error.message);
    } else {
      toast.success('อัปโหลดเอกสารสำเร็จ');
      setUploadOpen(false);
      resetUploadForm();
      loadAll();
    }
    setUploading(false);
  };

  const resetUploadForm = () => {
    setUploadDocType('proforma_invoice');
    setUploadDocNumber('');
    setUploadTitle('');
    setUploadAmount('');
    setUploadCurrency('USD');
    setUploadIssueDate('');
    setUploadPoId('');
    setUploadTransferId('');
    setUploadFile(null);
  };

  const deleteDoc = async (id: string) => {
    if (!confirm('ต้องการลบเอกสารนี้?')) return;
    await supabase.from('supplier_documents').delete().eq('id', id);
    toast.success('ลบเอกสารแล้ว');
    loadAll();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const totalPoValue = pos.reduce((s, p) => s + (p.grand_total || 0), 0);
  const totalTransferred = transfers
    .filter(t => t.status === 'transferred')
    .reduce((s, t) => s + (t.amount || 0), 0);
  const pendingTransfers = transfers.filter(t => ['pending', 'approved'].includes(t.status));

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 pb-3">
          <p className="text-xs text-muted-foreground">เอกสารทั้งหมด</p>
          <p className="text-2xl font-bold">{docs.length}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3">
          <p className="text-xs text-muted-foreground">PO / PI</p>
          <p className="text-2xl font-bold">{pos.length}</p>
          <p className="text-xs text-muted-foreground">USD {totalPoValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3">
          <p className="text-xs text-muted-foreground">โอนแล้ว (USD)</p>
          <p className="text-2xl font-bold text-green-600">{totalTransferred.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-3">
          <p className="text-xs text-muted-foreground">รออนุมัติ/โอน</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingTransfers.length}</p>
        </CardContent></Card>
      </div>

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <TabsList>
            <TabsTrigger value="documents" className="text-xs">📄 เอกสาร ({docs.length})</TabsTrigger>
            <TabsTrigger value="po_pi" className="text-xs">📋 PO & PI ({pos.length})</TabsTrigger>
            <TabsTrigger value="transfers" className="text-xs">
              💸 โอนเงิน ({transfers.length})
              {pendingTransfers.length > 0 && (
                <Badge className="ml-1 bg-yellow-500 text-white text-xs px-1 py-0">{pendingTransfers.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <Button size="sm" onClick={() => setUploadOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> อัปโหลดเอกสาร
          </Button>
        </div>

        {/* === TAB 1: เอกสาร === */}
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
                      <TableHead className="w-20">ประเภท</TableHead>
                      <TableHead>ชื่อเอกสาร</TableHead>
                      <TableHead>เลขเอกสาร</TableHead>
                      <TableHead>อ้างอิง PO</TableHead>
                      <TableHead>อ้างอิง Transfer</TableHead>
                      <TableHead className="text-right">จำนวนเงิน</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead className="text-right w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {docs.map(doc => {
                      const linkedPo = doc.purchase_order_id ? poById[doc.purchase_order_id] : null;
                      const linkedTransfer = doc.transfer_request_id
                        ? transfers.find(t => t.id === doc.transfer_request_id) : null;
                      return (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <Badge variant="outline" className="text-xs font-mono">{docTypeShort(doc.document_type)}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-sm">{doc.title}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{doc.file_name}</div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{doc.document_number || '-'}</TableCell>
                          <TableCell>
                            {linkedPo ? (
                              <div className="text-xs space-y-0.5">
                                <div className="font-mono font-medium text-blue-700 dark:text-blue-400">{linkedPo.po_number}</div>
                                {linkedPo.pi_number && <div className="text-muted-foreground">PI: {linkedPo.pi_number}</div>}
                              </div>
                            ) : <span className="text-muted-foreground text-xs">-</span>}
                          </TableCell>
                          <TableCell>
                            {linkedTransfer ? (
                              <div className="text-xs space-y-0.5">
                                <div className="font-mono font-medium">{linkedTransfer.transfer_number}</div>
                                <TransferStatusBadge status={linkedTransfer.status} />
                              </div>
                            ) : <span className="text-muted-foreground text-xs">-</span>}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {doc.amount ? `${doc.currency} ${Number(doc.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {doc.issue_date
                              ? format(new Date(doc.issue_date), 'dd MMM yy', { locale: th })
                              : doc.created_at
                              ? format(new Date(doc.created_at), 'dd MMM yy', { locale: th })
                              : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
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

        {/* === TAB 2: PO & PI === */}
        <TabsContent value="po_pi">
          <Card>
            <CardContent className="p-0">
              {pos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground"><p className="text-sm">ยังไม่มีใบสั่งซื้อ</p></div>
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
                      const poDocuments = docs.filter(d => d.purchase_order_id === po.id);
                      return (
                        <TableRow key={po.id}>
                          <TableCell className="font-mono text-xs font-bold">{po.po_number}</TableCell>
                          <TableCell>
                            {po.pi_number ? (
                              <span className="font-mono text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">{po.pi_number}</span>
                            ) : <span className="text-muted-foreground text-xs">-</span>}
                          </TableCell>
                          <TableCell>
                            {po.ci_number ? <span className="font-mono text-xs">{po.ci_number}</span> : <span className="text-muted-foreground text-xs">-</span>}
                          </TableCell>
                          <TableCell className="text-xs">{po.order_date ? format(new Date(po.order_date), 'dd MMM yy', { locale: th }) : '-'}</TableCell>
                          <TableCell className="text-xs">
                            {po.expected_delivery ? (
                              <span className={new Date(po.expected_delivery) < new Date() && po.status !== 'received' ? 'text-red-600 font-medium' : ''}>
                                {format(new Date(po.expected_delivery), 'dd MMM yy', { locale: th })}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm">
                            {po.currency} {Number(po.grand_total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell><POStatusBadge status={po.status} /></TableCell>
                          <TableCell className="text-right">
                            {poDocuments.length > 0 ? (
                              <div className="flex gap-1 justify-end flex-wrap">
                                {poDocuments.slice(0, 3).map(d => (
                                  <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer">
                                    <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">{docTypeShort(d.document_type)}</Badge>
                                  </a>
                                ))}
                                {poDocuments.length > 3 && <Badge variant="secondary" className="text-xs">+{poDocuments.length - 3}</Badge>}
                              </div>
                            ) : (
                              <Button size="sm" variant="ghost" className="text-xs h-6" onClick={() => {
                                setUploadPoId(po.id);
                                setUploadTitle(`เอกสาร ${po.po_number}`);
                                setUploadDocNumber(po.pi_number || '');
                                setUploadOpen(true);
                              }}>
                                <Plus className="w-3 h-3 mr-0.5" /> เพิ่ม
                              </Button>
                            )}
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

        {/* === TAB 3: โอนเงิน === */}
        <TabsContent value="transfers">
          <div className="space-y-3">
            {transfers.length === 0 ? (
              <Card><CardContent className="text-center py-12 text-muted-foreground"><p className="text-sm">ยังไม่มีรายการโอนเงิน</p></CardContent></Card>
            ) : transfers.map(t => {
              const coveredPos = (t.purchase_order_ids || []).map((pid: string) => poById[pid]).filter(Boolean);
              const piNumbers = coveredPos.map((po: any) => po.pi_number).filter(Boolean);
              const transferDocs = docs.filter(d => d.transfer_request_id === t.id);

              return (
                <Card key={t.id} className={
                  t.status === 'pending' ? 'border-yellow-300' :
                  t.status === 'approved' ? 'border-blue-300' :
                  t.status === 'transferred' ? 'border-green-300' : ''
                }>
                  <CardContent className="pt-4 pb-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold">{t.transfer_number}</span>
                          <TransferStatusBadge status={t.status} />
                          {t.priority === 'urgent' && <Badge className="bg-red-100 text-red-700 text-xs">🔴 ด่วน</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{t.purpose}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{t.currency} {Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        {t.amount_thb && (
                          <p className="text-xs text-muted-foreground">≈ ฿{Number(t.amount_thb).toLocaleString()}{t.exchange_rate && ` (@ ${t.exchange_rate})`}</p>
                        )}
                      </div>
                    </div>

                    {/* PI & PO reference */}
                    {(coveredPos.length > 0 || piNumbers.length > 0) && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 mb-3 text-xs space-y-1.5">
                        <p className="font-semibold text-blue-800 dark:text-blue-300 text-xs uppercase tracking-wide mb-1">📋 อ้างอิงเอกสาร</p>
                        {piNumbers.length > 0 && (
                          <div className="flex gap-2 items-center flex-wrap">
                            <span className="text-muted-foreground w-20 shrink-0">PI Number</span>
                            <div className="flex gap-1 flex-wrap">
                              {piNumbers.map((pi: string, i: number) => (
                                <Badge key={i} variant="outline" className="font-mono text-xs bg-white dark:bg-background">{pi}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {coveredPos.length > 0 && (
                          <div className="flex gap-2 items-center flex-wrap">
                            <span className="text-muted-foreground w-20 shrink-0">PO Number</span>
                            <div className="flex gap-1 flex-wrap">
                              {coveredPos.map((po: any) => (
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

                    {/* Bank info (accountant/admin only) */}
                    {canManageTransfer && (
                      <div className="bg-muted/40 rounded-lg p-3 mb-3 text-xs grid grid-cols-2 gap-x-4 gap-y-1">
                        <div><span className="text-muted-foreground">ธนาคาร</span><p className="font-medium">{t.bank_name}</p></div>
                        <div><span className="text-muted-foreground">SWIFT</span><p className="font-mono">{t.swift_code}</p></div>
                        <div><span className="text-muted-foreground">เลขบัญชี</span><p className="font-mono">{t.bank_account_number}</p></div>
                        <div><span className="text-muted-foreground">ชื่อบัญชี</span><p className="font-medium">{t.bank_account_name}</p></div>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex gap-4 text-xs text-muted-foreground mb-3 flex-wrap">
                      <span>สร้าง: {format(new Date(t.created_at), 'dd MMM yy HH:mm', { locale: th })}</span>
                      {t.requested_transfer_date && <span>กำหนดโอน: {format(new Date(t.requested_transfer_date), 'dd MMM yy', { locale: th })}</span>}
                      {t.transferred_at && <span className="text-green-600 font-medium">✅ โอนแล้ว: {format(new Date(t.transferred_at), 'dd MMM yy HH:mm', { locale: th })}</span>}
                    </div>

                    {/* Documents + actions */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-1 flex-wrap">
                        {t.transfer_slip_url && (
                          <a href={t.transfer_slip_url} target="_blank" rel="noopener noreferrer">
                            <Badge variant="secondary" className="text-xs gap-1 cursor-pointer hover:bg-muted"><FileText className="w-3 h-3" /> Transfer Slip</Badge>
                          </a>
                        )}
                        {transferDocs.map(d => (
                          <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">{docTypeShort(d.document_type)}: {d.title}</Badge>
                          </a>
                        ))}
                        {!t.transfer_slip_url && transferDocs.length === 0 && (
                          <span className="text-xs text-muted-foreground italic">ยังไม่มีเอกสารแนบ</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => {
                          setUploadTransferId(t.id);
                          setUploadTitle(`เอกสาร ${t.transfer_number}`);
                          if (coveredPos[0]?.pi_number) setUploadDocNumber(coveredPos[0].pi_number);
                          setUploadOpen(true);
                        }}>
                          <Plus className="w-3 h-3 mr-0.5" /> แนบเอกสาร
                        </Button>
                        {(isAdmin || isSuperAdmin) && t.status === 'pending' && (
                          <Button size="sm" className="text-xs h-7 bg-blue-600 hover:bg-blue-700"><ShieldCheck className="w-3 h-3 mr-0.5" /> อนุมัติ</Button>
                        )}
                        {canManageTransfer && t.status === 'approved' && (
                          <Button size="sm" className="text-xs h-7 bg-green-600 hover:bg-green-700"><Upload className="w-3 h-3 mr-0.5" /> ยืนยันโอน + แนบ Slip</Button>
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
      <Dialog open={uploadOpen} onOpenChange={open => { if (!open) { setUploadOpen(false); resetUploadForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>📎 อัปโหลดเอกสาร</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">ประเภทเอกสาร *</Label>
                <Select value={uploadDocType} onValueChange={setUploadDocType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DOC_TYPES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">เลขเอกสาร (PI/CI/เลขอื่น)</Label>
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
                  {pos.map(po => <SelectItem key={po.id} value={po.id}>{po.po_number}{po.pi_number ? ` (PI: ${po.pi_number})` : ''}</SelectItem>)}
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
                <Label className="text-xs">จำนวนเงิน (ถ้ามี)</Label>
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
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
              <p className="text-xs text-muted-foreground">PDF, JPG, PNG, XLSX, DOCX</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setUploadOpen(false); resetUploadForm(); }}>ยกเลิก</Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
              อัปโหลด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

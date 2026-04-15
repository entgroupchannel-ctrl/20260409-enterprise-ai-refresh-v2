import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Upload, FileText, Download, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const docTypes = [
  { value: 'proforma_invoice', label: 'Proforma Invoice (PI)' },
  { value: 'commercial_invoice', label: 'Commercial Invoice (CI)' },
  { value: 'air_waybill', label: 'Air Waybill (AWB)' },
  { value: 'packing_list', label: 'Packing List' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'contract', label: 'Contract' },
  { value: 'other', label: 'อื่นๆ' },
];

interface Supplier { id: string; company_name: string; supplier_code: string | null; }
interface Doc {
  id: string; title: string; document_type: string; document_number: string | null;
  file_url: string; file_name: string | null; amount: number | null; currency: string | null;
  issue_date: string | null; created_at: string;
}

export default function SupplierDocumentForm() {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form
  const [docType, setDocType] = useState('proforma_invoice');
  const [docNumber, setDocNumber] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [issueDate, setIssueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    supabase
      .from('suppliers')
      .select('id, company_name, supplier_code')
      .is('deleted_at', null)
      .order('company_name')
      .then(({ data }) => setSuppliers((data as Supplier[]) || []));
  }, []);

  useEffect(() => {
    if (selectedSupplier) loadDocs();
  }, [selectedSupplier]);

  const loadDocs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('supplier_documents')
      .select('*')
      .eq('supplier_id', selectedSupplier)
      .order('created_at', { ascending: false });
    setDocs((data as Doc[]) || []);
    setLoading(false);
  };

  const upload = async () => {
    if (!selectedSupplier || !file || !title.trim()) {
      toast({ title: 'กรุณากรอกข้อมูลให้ครบ', variant: 'destructive' });
      return;
    }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${selectedSupplier}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('supplier-documents').upload(path, file);
    if (uploadErr) {
      toast({ title: 'อัปโหลดไม่สำเร็จ', description: uploadErr.message, variant: 'destructive' });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
    const { error } = await supabase.from('supplier_documents').insert({
      supplier_id: selectedSupplier,
      document_type: docType,
      document_number: docNumber || null,
      title,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
      amount: amount ? parseFloat(amount) : null,
      currency,
      issue_date: issueDate || null,
    } as any);
    if (error) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'อัปโหลดสำเร็จ' });
      setTitle(''); setDocNumber(''); setAmount(''); setFile(null); setIssueDate('');
      loadDocs();
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Supplier select */}
      <Card>
        <CardHeader><CardTitle className="text-base">เลือก Supplier</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="max-w-md"><SelectValue placeholder="เลือก Supplier..." /></SelectTrigger>
            <SelectContent>
              {suppliers.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.supplier_code} — {s.company_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSupplier && (
        <>
          {/* Upload form */}
          <Card>
            <CardHeader><CardTitle className="text-base">อัปโหลดเอกสาร</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">ประเภทเอกสาร</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {docTypes.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">เลขเอกสาร</Label>
                  <Input value={docNumber} onChange={e => setDocNumber(e.target.value)} placeholder="PI-2026-001" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">ชื่อเอกสาร *</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="PI สินค้าล็อต Q2" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">จำนวนเงิน</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">สกุลเงิน</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['USD','EUR','GBP','JPY','CNY','THB'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">วันที่ออกเอกสาร</Label>
                  <Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">ไฟล์ *</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx" onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={upload} disabled={uploading}>
                {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
                อัปโหลด
              </Button>
            </CardContent>
          </Card>

          {/* Docs list */}
          <Card>
            <CardHeader><CardTitle className="text-base">เอกสารที่อัปโหลด ({docs.length})</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
              ) : docs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">ยังไม่มีเอกสาร</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>ชื่อ</TableHead>
                      <TableHead>เลขเอกสาร</TableHead>
                      <TableHead className="text-right">จำนวนเงิน</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead className="text-right">ดาวน์โหลด</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {docs.map(d => (
                      <TableRow key={d.id}>
                        <TableCell className="text-xs">{docTypes.find(t => t.value === d.document_type)?.label || d.document_type}</TableCell>
                        <TableCell className="font-medium">{d.title}</TableCell>
                        <TableCell className="font-mono text-xs">{d.document_number || '-'}</TableCell>
                        <TableCell className="text-right">{d.amount ? `${d.amount.toLocaleString()} ${d.currency}` : '-'}</TableCell>
                        <TableCell className="text-xs">{d.issue_date ? format(new Date(d.issue_date), 'dd MMM yy', { locale: th }) : '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" asChild>
                            <a href={d.file_url} target="_blank" rel="noopener noreferrer"><Download className="w-4 h-4" /></a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

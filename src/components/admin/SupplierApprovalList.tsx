import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import SupplierStatusBadge from './SupplierStatusBadge';
import { CheckCircle, XCircle, Loader2, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface Supplier {
  id: string;
  supplier_code: string | null;
  company_name: string;
  country: string | null;
  contact_name: string | null;
  email: string | null;
  status: string;
  created_at: string;
}

export default function SupplierApprovalList() {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('suppliers')
      .select('id, supplier_code, company_name, country, contact_name, email, status, created_at')
      .eq('status', 'pending')
      .is('deleted_at', null)
      .order('created_at', { ascending: true });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setSuppliers((data as Supplier[]) || []);
    setLoading(false);
  };

  const approve = async (id: string) => {
    setProcessing(true);
    const { error } = await supabase
      .from('suppliers')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'อนุมัติแล้ว' });
      load();
    }
    setProcessing(false);
  };

  const reject = async () => {
    setProcessing(true);
    const { error } = await supabase
      .from('suppliers')
      .update({ status: 'rejected', rejection_reason: rejectReason })
      .eq('id', rejectDialog.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'ปฏิเสธแล้ว' });
      setRejectDialog({ open: false, id: '' });
      setRejectReason('');
      load();
    }
    setProcessing(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  if (suppliers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">ไม่มี Supplier รออนุมัติ</h3>
          <p className="text-sm text-muted-foreground mt-1">Supplier ที่ส่งเรื่องรอจะแสดงที่นี่</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" /> รออนุมัติ ({suppliers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัส</TableHead>
                <TableHead>บริษัท</TableHead>
                <TableHead>ประเทศ</TableHead>
                <TableHead>ผู้ติดต่อ</TableHead>
                <TableHead>วันที่ส่ง</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.supplier_code}</TableCell>
                  <TableCell className="font-medium">{s.company_name}</TableCell>
                  <TableCell>{s.country || '-'}</TableCell>
                  <TableCell>{s.contact_name || '-'}</TableCell>
                  <TableCell className="text-sm">{format(new Date(s.created_at), 'dd MMM yy', { locale: th })}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" onClick={() => approve(s.id)} disabled={processing}>
                      <CheckCircle className="w-4 h-4 mr-1" /> อนุมัติ
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setRejectDialog({ open: true, id: s.id })} disabled={processing}>
                      <XCircle className="w-4 h-4 mr-1" /> ปฏิเสธ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={rejectDialog.open} onOpenChange={(o) => { if (!o) setRejectDialog({ open: false, id: '' }); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>ปฏิเสธ Supplier</DialogTitle></DialogHeader>
          <Textarea placeholder="เหตุผลที่ปฏิเสธ..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, id: '' })}>ยกเลิก</Button>
            <Button variant="destructive" onClick={reject} disabled={!rejectReason.trim() || processing}>
              {processing && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} ยืนยันปฏิเสธ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

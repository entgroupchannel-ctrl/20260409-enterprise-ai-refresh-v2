import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TransferStatusBadge from './TransferStatusBadge';
import { Loader2, DollarSign, Clock, CheckCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface Summary {
  supplier_id: string;
  company_name: string;
  supplier_code: string | null;
  total_transfers: number;
  total_paid: number;
  total_paid_thb: number;
  pending_amount: number;
  last_payment_date: string | null;
}

export default function SupplierPaymentHistory() {
  const [data, setData] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('supplier_payment_summary')
      .select('*')
      .order('total_paid', { ascending: false })
      .then(({ data: d }) => {
        setData((d as Summary[]) || []);
        setLoading(false);
      });
  }, []);

  const totalPaid = data.reduce((s, d) => s + (d.total_paid || 0), 0);
  const totalPaidTHB = data.reduce((s, d) => s + (d.total_paid_thb || 0), 0);
  const totalPending = data.reduce((s, d) => s + (d.pending_amount || 0), 0);
  const totalTransfers = data.reduce((s, d) => s + (d.total_transfers || 0), 0);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">โอนทั้งหมด</p>
                <p className="text-2xl font-bold">{totalTransfers}</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">จ่ายแล้ว (USD)</p>
                <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">จ่ายแล้ว (THB)</p>
                <p className="text-2xl font-bold">฿{totalPaidTHB.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">รอโอน (USD)</p>
                <p className="text-2xl font-bold">${totalPending.toLocaleString()}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle className="text-base">ประวัติการจ่ายตาม Supplier</CardTitle></CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">ยังไม่มีข้อมูลการโอนเงิน</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัส</TableHead>
                  <TableHead>บริษัท</TableHead>
                  <TableHead className="text-right">โอนทั้งหมด</TableHead>
                  <TableHead className="text-right">จ่ายแล้ว (USD)</TableHead>
                  <TableHead className="text-right">จ่ายแล้ว (THB)</TableHead>
                  <TableHead className="text-right">รอโอน (USD)</TableHead>
                  <TableHead>โอนล่าสุด</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(d => (
                  <TableRow key={d.supplier_id}>
                    <TableCell className="font-mono text-xs">{d.supplier_code}</TableCell>
                    <TableCell className="font-medium">{d.company_name}</TableCell>
                    <TableCell className="text-right">{d.total_transfers}</TableCell>
                    <TableCell className="text-right font-medium">${(d.total_paid || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">฿{(d.total_paid_thb || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">${(d.pending_amount || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-xs">
                      {d.last_payment_date ? format(new Date(d.last_payment_date), 'dd MMM yy', { locale: th }) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

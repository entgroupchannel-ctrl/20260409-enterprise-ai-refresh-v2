import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Shield, CheckCircle2, XCircle, Eye, Clock,
  Gift, TrendingDown, User, Building2,
} from 'lucide-react';
import { formatShortDateTime } from '@/lib/format';

interface PendingRevision {
  id: string;
  quote_id: string;
  revision_number: number;
  created_by_name: string;
  created_by_role: string;
  created_at: string;
  products: any[];
  free_items: any[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  vat_amount: number;
  grand_total: number;
  change_reason: string | null;
  internal_notes: string | null;
  approval_status: string;
  quote: {
    quote_number: string;
    customer_name: string;
    customer_company: string | null;
  };
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency', currency: 'THB', minimumFractionDigits: 0,
  }).format(amount);

export default function AdminApprovals() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [pending, setPending] = useState<PendingRevision[]>([]);
  const [history, setHistory] = useState<PendingRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: pendingData } = await (supabase.from as any)('quote_revisions')
        .select(`
          *,
          quote:quote_requests!inner(quote_number, customer_name, customer_company)
        `)
        .eq('requires_approval', true)
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      const { data: historyData } = await (supabase.from as any)('quote_revisions')
        .select(`
          *,
          quote:quote_requests!inner(quote_number, customer_name, customer_company)
        `)
        .eq('requires_approval', true)
        .in('approval_status', ['approved', 'rejected'])
        .order('approved_at', { ascending: false })
        .limit(50);

      setPending(pendingData || []);
      setHistory(historyData || []);
    } catch (error: any) {
      toast({
        title: 'โหลดข้อมูลล้มเหลว',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (revisionId: string) => {
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('approve_revision', {
        p_revision_id: revisionId,
        p_approver_id: user.id,
        p_send_to_customer: true,
      });

      if (error) throw error;
      if (!(data as any)?.success) {
        throw new Error((data as any)?.error || 'Approval failed');
      }

      toast({
        title: '✅ อนุมัติสำเร็จ',
        description: 'Counter Offer ส่งให้ลูกค้าแล้ว',
      });

      await loadData();
    } catch (error: any) {
      toast({
        title: 'อนุมัติไม่สำเร็จ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectingId || !rejectReason.trim()) {
      toast({ title: 'กรุณาระบุเหตุผล', variant: 'destructive' });
      return;
    }

    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('reject_revision', {
        p_revision_id: rejectingId,
        p_approver_id: user.id,
        p_reason: rejectReason,
      });

      if (error) throw error;
      if (!(data as any)?.success) {
        throw new Error((data as any)?.error || 'Rejection failed');
      }

      toast({ title: '❌ ปฏิเสธ Counter Offer แล้ว' });
      setRejectingId(null);
      setRejectReason('');
      await loadData();
    } catch (error: any) {
      toast({
        title: 'ปฏิเสธไม่สำเร็จ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const renderRevisionCard = (rev: PendingRevision, isPending: boolean) => {
    const freeItemsValue = (rev.free_items || []).reduce(
      (sum: number, fi: any) => sum + (fi.total_value || 0), 0
    );

    return (
      <Card key={rev.id} className={isPending ? 'border-amber-200 dark:border-amber-800' : ''}>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => navigate(`/admin/quotes/${rev.quote_id}`)}
                  className="font-bold text-primary hover:underline"
                >
                  {rev.quote.quote_number}
                </button>
                <Badge variant="outline">Rev {rev.revision_number}</Badge>
                {isPending ? (
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    <Clock className="w-3 h-3 mr-1" />
                    รออนุมัติ
                  </Badge>
                ) : rev.approval_status === 'approved' ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    อนุมัติแล้ว
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    ปฏิเสธ
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {rev.created_by_name}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {rev.quote.customer_company || rev.quote.customer_name}
                </span>
                <span>{formatShortDateTime(rev.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {rev.discount_percent > 8 && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                <TrendingDown className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 dark:text-amber-400">
                  ส่วนลด {rev.discount_percent}% (เกิน 8%)
                </span>
              </div>
            )}
            {freeItemsValue > 5000 && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                <Gift className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 dark:text-amber-400">
                  ของแถม {formatCurrency(freeItemsValue)} (เกิน ฿5,000)
                </span>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">ยอดรวมก่อนส่วนลด</div>
              <div className="font-semibold">{formatCurrency(rev.subtotal)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">ยอดสุทธิ</div>
              <div className="font-bold text-primary text-lg">
                {formatCurrency(rev.grand_total)}
              </div>
            </div>
          </div>

          {rev.change_reason && (
            <div className="text-sm">
              <span className="text-muted-foreground">💬 เหตุผล: </span>
              <span>{rev.change_reason}</span>
            </div>
          )}
          {rev.internal_notes && (
            <div className="text-sm p-2 bg-muted/50 rounded">
              <span className="text-muted-foreground">📌 โน้ตภายใน: </span>
              <span>{rev.internal_notes}</span>
            </div>
          )}

          {isPending && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/admin/quotes/${rev.quote_id}`)}
              >
                <Eye className="w-4 h-4 mr-1" />
                ดูรายละเอียด
              </Button>
              <Button
                size="sm"
                onClick={() => handleApprove(rev.id)}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                อนุมัติ + ส่งให้ลูกค้า
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setRejectingId(rev.id)}
                disabled={processing}
              >
                <XCircle className="w-4 h-4 mr-1" />
                ปฏิเสธ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            อนุมัติ Counter Offers
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Counter Offers ที่เกิน threshold (ส่วนลด {'>'} 8% หรือของแถม {'>'} ฿5,000)
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">รออนุมัติ</div>
              <div className="text-3xl font-bold text-amber-600">{pending.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">อนุมัติแล้ว (50 ล่าสุด)</div>
              <div className="text-3xl font-bold text-green-600">
                {history.filter((h) => h.approval_status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">ปฏิเสธ (50 ล่าสุด)</div>
              <div className="text-3xl font-bold text-red-600">
                {history.filter((h) => h.approval_status === 'rejected').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="pending">
              รออนุมัติ
              {pending.length > 0 && (
                <Badge className="ml-2 bg-amber-600">{pending.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">ประวัติ</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">กำลังโหลด...</p>
            ) : pending.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-3" />
                  <p className="font-semibold">ไม่มี Counter Offers รออนุมัติ</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ทุกคำขอได้รับการตอบกลับแล้ว
                  </p>
                </CardContent>
              </Card>
            ) : (
              pending.map((rev) => renderRevisionCard(rev, true))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            {history.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  ยังไม่มีประวัติการอนุมัติ
                </CardContent>
              </Card>
            ) : (
              history.map((rev) => renderRevisionCard(rev, false))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!rejectingId} onOpenChange={(v) => !v && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ปฏิเสธ Counter Offer</DialogTitle>
            <DialogDescription>
              กรุณาระบุเหตุผลในการปฏิเสธเพื่อแจ้ง sales
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="เช่น: Margin ต่ำเกินไป, ไม่ตรงกับนโยบายบริษัท..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingId(null)} disabled={processing}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing}>
              ยืนยันปฏิเสธ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

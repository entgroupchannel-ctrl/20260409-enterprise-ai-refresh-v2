import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/layouts/AdminLayout';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Check,
  X,
  Eye,
  FileText,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface ChangeRequest {
  id: string;
  quote_id: string;
  request_type: string;
  request_reason: string | null;
  requested_by: string;
  requested_by_role: string;
  status: string;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  new_files: any | null;
  metadata: any;
  created_at: string;
  completed_at: string | null;
  quote_number?: string;
  customer_name?: string;
}

const requestTypeLabels: Record<string, string> = {
  edit: 'ขอแก้ไข PO',
  cancel: 'ขอยกเลิก PO',
  customer_edit: 'ลูกค้าขอแก้ไข PO',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const statusLabels: Record<string, string> = {
  pending: 'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ปฏิเสธ',
  completed: 'เสร็จสิ้น',
};

export default function AdminRequests() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();

  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [processing, setProcessing] = useState(false);

  // Review dialog
  const [reviewTarget, setReviewTarget] = useState<ChangeRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('po_change_requests')
        .select('*, quote_requests:quote_id(quote_number, customer_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((r: any) => ({
        ...r,
        quote_number: (r as any).quote_requests?.quote_number,
        customer_name: (r as any).quote_requests?.customer_name,
      }));
      setRequests(mapped);
    } catch (error: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!reviewTarget) return;
    setProcessing(true);
    try {
      const updates: any = {
        status: reviewAction === 'approve' ? 'approved' : 'rejected',
        reviewed_by: profile?.email || 'admin',
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes,
      };
      if (reviewAction === 'approve') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('po_change_requests')
        .update(updates)
        .eq('id', reviewTarget.id);

      if (error) throw error;

      // Add system message to quote
      await supabase.from('quote_messages').insert({
        quote_id: reviewTarget.quote_id,
        sender_role: 'system',
        sender_name: 'System',
        content: reviewAction === 'approve'
          ? `✅ คำขอ${requestTypeLabels[reviewTarget.request_type] || reviewTarget.request_type}ได้รับการอนุมัติแล้ว`
          : `❌ คำขอ${requestTypeLabels[reviewTarget.request_type] || reviewTarget.request_type}ถูกปฏิเสธ${reviewNotes ? `: ${reviewNotes}` : ''}`,
        message_type: 'status_change',
      });

      // If approved cancel request, update quote status
      if (reviewAction === 'approve' && reviewTarget.request_type === 'cancel') {
        await supabase
          .from('quote_requests')
          .update({ status: 'cancelled' } as any)
          .eq('id', reviewTarget.quote_id);
      }

      toast({
        title: reviewAction === 'approve' ? 'อนุมัติคำขอสำเร็จ' : 'ปฏิเสธคำขอสำเร็จ',
      });
      setReviewTarget(null);
      setReviewNotes('');
      await loadRequests();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const filteredRequests = requests
    .filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          (r.quote_number || '').toLowerCase().includes(q) ||
          (r.customer_name || '').toLowerCase().includes(q) ||
          (r.requested_by || '').toLowerCase().includes(q) ||
          (r.request_reason || '').toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const statusCounts = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageLayout
        title="คำขอแก้ไข/ยกเลิก PO"
        description="จัดการคำขอแก้ไขและยกเลิก Purchase Order จาก Admin และลูกค้า"
        searchPlaceholder="ค้นหาเลข Quote, ชื่อลูกค้า, ผู้ขอ..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterOptions={[
          { value: 'newest', label: 'ล่าสุด → เก่าสุด' },
          { value: 'oldest', label: 'เก่าสุด → ล่าสุด' },
        ]}
        filterValue={sortBy}
        onFilterChange={setSortBy}
        statsTabs={[
          { label: 'ทั้งหมด', value: 'all', count: requests.length },
          { label: 'รออนุมัติ', value: 'pending', count: statusCounts.pending || 0 },
          { label: 'อนุมัติแล้ว', value: 'approved', count: statusCounts.approved || 0 },
          { label: 'ปฏิเสธ', value: 'rejected', count: statusCounts.rejected || 0 },
        ]}
        activeTab={statusFilter}
        onTabChange={setStatusFilter}
        resultsCount={filteredRequests.length}
      >
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="ไม่มีคำขอ"
            description="ยังไม่มีคำขอแก้ไข/ยกเลิก PO ในระบบ"
          />
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <Card key={req.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={statusColors[req.status] || ''}>
                          {statusLabels[req.status] || req.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {requestTypeLabels[req.request_type] || req.request_type}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-foreground mt-2">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <button
                          onClick={() => navigate(`/admin/quotes/${req.quote_id}`)}
                          className="text-primary hover:underline font-medium"
                        >
                          {req.quote_number || 'Quote'}
                        </button>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground truncate">{req.customer_name || '-'}</span>
                      </div>

                      {req.request_reason && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          💬 {req.request_reason}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {req.requested_by} ({req.requested_by_role})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(req.created_at), 'dd MMM yyyy HH:mm', { locale: th })}
                        </span>
                      </div>

                      {req.review_notes && (
                        <p className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded p-2">
                          📝 หมายเหตุ: {req.review_notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/quotes/${req.quote_id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        ดู Quote
                      </Button>

                      {req.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setReviewTarget(req);
                              setReviewAction('approve');
                              setReviewNotes('');
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            อนุมัติ
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setReviewTarget(req);
                              setReviewAction('reject');
                              setReviewNotes('');
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            ปฏิเสธ
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AdminPageLayout>

      {/* Review Dialog */}
      <Dialog open={!!reviewTarget} onOpenChange={(open) => !open && setReviewTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  อนุมัติคำขอ
                </span>
              ) : (
                <span className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  ปฏิเสธคำขอ
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              {reviewTarget && (
                <>
                  {requestTypeLabels[reviewTarget.request_type]} · {reviewTarget.quote_number}
                  <br />
                  ขอโดย: {reviewTarget.requested_by} ({reviewTarget.requested_by_role})
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {reviewTarget?.request_reason && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <Label className="text-xs text-muted-foreground">เหตุผลของผู้ขอ:</Label>
              <p className="mt-1 text-foreground">{reviewTarget.request_reason}</p>
            </div>
          )}

          <div>
            <Label>หมายเหตุ {reviewAction === 'reject' ? '*' : '(ถ้ามี)'}</Label>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder={reviewAction === 'approve' ? 'หมายเหตุเพิ่มเติม...' : 'ระบุเหตุผลที่ปฏิเสธ...'}
              rows={3}
              className="mt-1"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewTarget(null)} disabled={processing}>
              ยกเลิก
            </Button>
            <Button
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
              onClick={handleReview}
              disabled={processing || (reviewAction === 'reject' && !reviewNotes)}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : reviewAction === 'approve' ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              {processing ? 'กำลังดำเนินการ...' : reviewAction === 'approve' ? 'ยืนยันอนุมัติ' : 'ยืนยันปฏิเสธ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

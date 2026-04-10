import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, Shield, CheckCircle2 } from 'lucide-react';

interface Props {
  revisionId: string;
  isSuperAdmin: boolean;
  onRefresh: () => void;
}

export default function PendingApprovalBanner({ revisionId, isSuperAdmin, onRefresh }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [revision, setRevision] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase.from as any)('quote_revisions')
        .select('*')
        .eq('id', revisionId)
        .single();
      setRevision(data);
    };
    load();
  }, [revisionId]);

  if (!revision || !revision.requires_approval || revision.approval_status !== 'pending') {
    return null;
  }

  const handleQuickApprove = async () => {
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('approve_revision', {
        p_revision_id: revisionId,
        p_approver_id: user.id,
        p_send_to_customer: true,
      });

      if (error || !(data as any)?.success) {
        throw new Error((data as any)?.error || error?.message);
      }

      toast({ title: '✅ อนุมัติและส่งให้ลูกค้าแล้ว' });
      onRefresh();
    } catch (e: any) {
      toast({ title: 'ผิดพลาด', description: e.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                Counter Offer Rev {revision.revision_number} รออนุมัติจาก Super Admin
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                {revision.discount_percent > 8 && `ส่วนลด ${revision.discount_percent}% (เกิน 8%) • `}
                ลูกค้ายังไม่เห็น revision นี้จนกว่าจะอนุมัติ
              </p>
            </div>
          </div>
          {isSuperAdmin && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleQuickApprove}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                อนุมัติ + ส่ง
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/admin/approvals')}
              >
                <Shield className="w-4 h-4 mr-1" />
                ไปหน้าอนุมัติ
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

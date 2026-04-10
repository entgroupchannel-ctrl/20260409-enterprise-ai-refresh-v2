import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle2, XCircle, Edit } from 'lucide-react';
import { formatShortDateTime } from '@/lib/format';

interface NegotiationRequest {
  id: string;
  quote_id: string;
  request_type: string;
  requested_discount_percent: number | null;
  requested_discount_amount: number | null;
  requested_free_items: any[];
  message: string;
  status: string;
  admin_response: string | null;
  created_at: string;
}

interface NegotiationRequestsListProps {
  quoteId: string;
  onCreateCounter: (requestId: string) => void;
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

const typeLabels: Record<string, string> = {
  discount: 'ขอลดราคา',
  free_items: 'ขอของแถม',
  price_change: 'เปลี่ยนราคา',
  spec_change: 'เปลี่ยนสเปก',
  payment_terms: 'เปลี่ยนเงื่อนไข',
  other: 'อื่นๆ',
};

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'รอตอบ', variant: 'default' },
    accepted: { label: 'ยอมรับแล้ว', variant: 'secondary' },
    partial: { label: 'ยอมรับบางส่วน', variant: 'outline' },
    rejected: { label: 'ปฏิเสธ', variant: 'destructive' },
    counter_offered: { label: 'เสนอกลับแล้ว', variant: 'outline' },
  };
  const cfg = map[status] || map.pending;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};

export default function NegotiationRequestsList({
  quoteId,
  onCreateCounter,
  onAccept,
  onReject,
}: NegotiationRequestsListProps) {
  const [requests, setRequests] = useState<NegotiationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [quoteId]);

  const loadRequests = async () => {
    try {
      const { data, error } = await (supabase.from as any)('quote_negotiation_requests')
        .select('*')
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRequests(data);
      }
    } catch (e) {
      console.error('Error loading negotiation requests:', e);
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  if (loading || requests.length === 0) return null;

  return (
    <Card className={pendingRequests.length > 0 ? 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10' : ''}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="w-4 h-4" />
          คำขอต่อรอง ({requests.length})
          {pendingRequests.length > 0 && (
            <Badge variant="destructive" className="text-[10px]">{pendingRequests.length} รอตอบ</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="p-3 rounded-lg border border-border bg-background space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">{typeLabels[req.request_type] || req.request_type}</span>
                {statusBadge(req.status)}
              </div>
              <span className="text-xs text-muted-foreground">{formatShortDateTime(req.created_at)}</span>
            </div>

            <p className="text-sm whitespace-pre-wrap">{req.message}</p>

            {req.requested_discount_percent && (
              <p className="text-xs text-muted-foreground">ขอลด: {req.requested_discount_percent}%</p>
            )}

            {req.admin_response && (
              <div className="bg-muted p-2 rounded text-xs">
                <span className="font-semibold">ตอบกลับ:</span> {req.admin_response}
              </div>
            )}

            {req.status === 'pending' && (
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => onCreateCounter(req.id)}>
                  <Edit className="w-3 h-3 mr-1" />
                  สร้าง Counter Offer
                </Button>
                {onAccept && (
                  <Button size="sm" variant="outline" className="text-green-600" onClick={() => onAccept(req.id)}>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    ยอมรับ
                  </Button>
                )}
                {onReject && (
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => onReject(req.id)}>
                    <XCircle className="w-3 h-3 mr-1" />
                    ปฏิเสธ
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

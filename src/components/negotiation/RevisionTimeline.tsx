import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { History, ChevronDown, ChevronUp, Gift, CheckCircle2, Clock, Send, User } from 'lucide-react';
import { formatShortDateTime } from '@/lib/format';
import RevisionCompareView from './RevisionCompareView';

export interface Revision {
  id: string;
  quote_id: string;
  revision_number: number;
  revision_type: string;
  created_by: string | null;
  created_by_name: string;
  created_by_role: string;
  created_at: string;
  products: any[];
  free_items: any[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  vat_percent: number;
  vat_amount: number;
  grand_total: number;
  change_reason: string | null;
  customer_message: string | null;
  requires_approval: boolean;
  approval_status: string;
  status: string;
  sent_at: string | null;
  valid_until: string | null;
  internal_notes: string | null;
}

interface RevisionTimelineProps {
  quoteId: string;
  currentRevisionId?: string;
  viewerRole: 'admin' | 'customer';
  onSelectRevision?: (revision: Revision) => void;
  onCreateCounter?: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

export default function RevisionTimeline({
  quoteId,
  currentRevisionId,
  viewerRole,
  onSelectRevision,
  onCreateCounter,
}: RevisionTimelineProps) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    loadRevisions();
  }, [quoteId]);

  const loadRevisions = async () => {
    try {
      const { data, error } = await (supabase.from as any)('quote_revisions')
        .select('*')
        .eq('quote_id', quoteId)
        .order('revision_number', { ascending: false });

      if (!error && data) {
        setRevisions(data);
      }
    } catch (e) {
      console.error('Error loading revisions:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground text-sm">
          กำลังโหลดประวัติ...
        </CardContent>
      </Card>
    );
  }

  if (revisions.length === 0) return null;

  const roleIcon = (role: string) => {
    if (role === 'customer') return <User className="w-3.5 h-3.5" />;
    return <Send className="w-3.5 h-3.5" />;
  };

  const roleLabel = (role: string) => {
    if (viewerRole === 'customer') {
      return role === 'customer' ? 'คุณ' : 'ทีมขาย';
    }
    return role === 'customer' ? 'ลูกค้า' : role === 'system' ? 'ระบบ' : 'admin';
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: string }> = {
      draft: { label: 'ร่าง', variant: 'bg-gray-100 text-gray-700' },
      sent: { label: 'ส่งแล้ว', variant: 'bg-blue-100 text-blue-700' },
      accepted: { label: 'ยอมรับ', variant: 'bg-green-100 text-green-700' },
      rejected: { label: 'ปฏิเสธ', variant: 'bg-red-100 text-red-700' },
      superseded: { label: 'แทนที่แล้ว', variant: 'bg-gray-100 text-gray-500' },
    };
    const cfg = map[status] || map.draft;
    return <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', cfg.variant)}>{cfg.label}</span>;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="w-4 h-4" />
            ประวัติการต่อรอง ({revisions.length} revision{revisions.length > 1 ? 's' : ''})
          </CardTitle>
          <div className="flex gap-2">
            {revisions.length >= 2 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCompare(true)}
              >
                🔄 เปรียบเทียบ
              </Button>
            )}
            {viewerRole === 'admin' && onCreateCounter && (
              <Button size="sm" variant="outline" onClick={onCreateCounter}>
                + สร้าง Counter Offer
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {revisions.map((rev) => {
          const isCurrent = rev.id === currentRevisionId;
          const isExpanded = expandedId === rev.id;
          const freeItems = rev.free_items || [];

          return (
            <div
              key={rev.id}
              className={cn(
                'border rounded-lg transition-colors',
                isCurrent ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
              )}
            >
              {/* Header row */}
              <button
                className="w-full flex items-center gap-3 p-3 text-left"
                onClick={() => setExpandedId(isExpanded ? null : rev.id)}
              >
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                  isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {isCurrent ? <CheckCircle2 className="w-4 h-4" /> : roleIcon(rev.created_by_role)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">Rev {rev.revision_number}</span>
                    <span className="text-xs text-muted-foreground">— {roleLabel(rev.created_by_role)}</span>
                    {statusBadge(rev.status)}
                    {isCurrent && <Badge variant="outline" className="text-[10px] h-4">ปัจจุบัน</Badge>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{formatShortDateTime(rev.created_at)}</span>
                    {rev.grand_total > 0 && (
                      <span className="text-xs font-semibold text-primary">{formatCurrency(rev.grand_total)}</span>
                    )}
                    {freeItems.length > 0 && (
                      <span className="text-xs text-amber-600 flex items-center gap-0.5">
                        <Gift className="w-3 h-3" /> +{freeItems.length} ของแถม
                      </span>
                    )}
                  </div>
                </div>

                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                  {rev.change_reason && (
                    <p className="text-sm text-foreground">💬 {rev.change_reason}</p>
                  )}
                  {rev.customer_message && (
                    <p className="text-sm text-muted-foreground italic">"{rev.customer_message}"</p>
                  )}

                  {/* Products summary */}
                  <div className="space-y-1">
                    {(rev.products || []).map((p: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span>{p.model} × {p.qty}</span>
                        <span>{formatCurrency(p.line_total || (p.qty * p.unit_price))}</span>
                      </div>
                    ))}
                  </div>

                  {/* Free items */}
                  {freeItems.length > 0 && (
                    <div className="space-y-1 bg-amber-50 dark:bg-amber-900/10 rounded p-2">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">🎁 ของแถม</p>
                      {freeItems.map((fi: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span>{fi.model} × {fi.qty}</span>
                          <span className="text-muted-foreground">มูลค่า {formatCurrency(fi.total_value || 0)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="space-y-1 text-xs border-t border-border pt-2">
                    <div className="flex justify-between">
                      <span>ยอดรวม</span>
                      <span>{formatCurrency(rev.subtotal)}</span>
                    </div>
                    {rev.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>ส่วนลด {rev.discount_percent}%</span>
                        <span>-{formatCurrency(rev.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>VAT {rev.vat_percent}%</span>
                      <span>{formatCurrency(rev.vat_amount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm">
                      <span>รวมสุทธิ</span>
                      <span className="text-primary">{formatCurrency(rev.grand_total)}</span>
                    </div>
                  </div>

                  {/* Internal notes (admin only) */}
                  {viewerRole === 'admin' && rev.internal_notes && (
                    <div className="bg-muted p-2 rounded text-xs">
                      <span className="font-semibold">📌 โน้ตภายใน:</span> {rev.internal_notes}
                    </div>
                  )}

                  {/* Action: select this revision */}
                  {onSelectRevision && viewerRole === 'admin' && !isCurrent && (
                    <Button size="sm" variant="outline" className="w-full" onClick={() => onSelectRevision(rev)}>
                      ใช้เป็นฐานสร้าง Revision ใหม่
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>

      <RevisionCompareView
        quoteId={quoteId}
        open={showCompare}
        onClose={() => setShowCompare(false)}
      />
    </Card>
  );
}

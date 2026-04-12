import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { History, ChevronDown, ChevronUp, Gift, CheckCircle2, Clock, Send, User, Trash2, Printer } from 'lucide-react';
import { formatShortDateTime } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';
import RevisionCompareView from './RevisionCompareView';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  onRefresh?: () => void;
  onPrintRevision?: (revision: Revision) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

export default function RevisionTimeline({
  quoteId,
  currentRevisionId,
  viewerRole,
  onSelectRevision,
  onCreateCounter,
  onRefresh,
  onPrintRevision,
}: RevisionTimelineProps) {
  const { toast } = useToast();
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompare, setShowCompare] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deletingDraft, setDeletingDraft] = useState<Revision | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handlePublishDraft = async (draftRevision: Revision) => {
    if (draftRevision.requires_approval && draftRevision.approval_status === 'pending') {
      toast({
        title: 'รออนุมัติ',
        description: 'Revision นี้ต้องรอ Super Admin อนุมัติก่อน',
        variant: 'destructive',
      });
      return;
    }

    setPublishingId(draftRevision.id);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      // 1. Mark current sent revisions as superseded
      await (supabase.from as any)('quote_revisions')
        .update({ status: 'superseded' })
        .eq('quote_id', quoteId)
        .eq('status', 'sent');

      // 2. Update draft → sent
      const nowIso = new Date().toISOString();
      await (supabase.from as any)('quote_revisions')
        .update({ 
          status: 'sent',
          sent_at: nowIso,
        })
        .eq('id', draftRevision.id);

      // 3. Update quote_requests — snapshot this revision as the current one
      await supabase.from('quote_requests').update({
        current_revision_id: draftRevision.id,
        current_revision_number: draftRevision.revision_number,
        products: draftRevision.products,
        free_items: draftRevision.free_items as any,
        subtotal: draftRevision.subtotal,
        discount_percent: draftRevision.discount_percent,
        discount_amount: draftRevision.discount_amount,
        vat_percent: draftRevision.vat_percent,
        vat_amount: draftRevision.vat_amount,
        grand_total: draftRevision.grand_total,
        valid_until: draftRevision.valid_until,
        status: 'negotiating',
        sent_at: nowIso,
      } as any).eq('id', quoteId);

      // 4. Chat message
      await supabase.from('quote_messages').insert({
        quote_id: quoteId,
        sender_id: authUser.id,
        sender_name: draftRevision.created_by_name,
        sender_role: 'admin',
        content: `📤 ส่ง Revision ${draftRevision.revision_number} ให้ลูกค้า — ${draftRevision.change_reason || ''}`,
        message_type: 'revision',
      });

      toast({ title: '✅ ส่งให้ลูกค้าแล้ว', description: `Revision ${draftRevision.revision_number} ถูกส่งเรียบร้อย` });
      await loadRevisions();
      onRefresh?.();
    } catch (e: any) {
      toast({ title: 'ส่งไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setPublishingId(null);
    }
  };

  const handleDeleteDraft = async () => {
    if (!deletingDraft) return;
    setDeleting(true);
    try {
      await (supabase.from as any)('quote_revisions')
        .delete()
        .eq('id', deletingDraft.id)
        .eq('status', 'draft');
      toast({ title: '✅ ลบ Draft แล้ว', description: `Revision ${deletingDraft.revision_number} ถูกลบเรียบร้อย` });
      setDeletingDraft(null);
      await loadRevisions();
      onRefresh?.();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
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

  const draftCount = revisions.filter(r => r.status === 'draft').length;

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
      draft: { label: '📝 Draft (ยังไม่ส่ง)', variant: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
      sent: { label: '📤 ส่งแล้ว', variant: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      accepted: { label: '✅ ยอมรับ', variant: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      rejected: { label: '❌ ปฏิเสธ', variant: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      superseded: { label: '🔄 แทนที่แล้ว', variant: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
    };
    const cfg = map[status] || map.draft;
    return <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', cfg.variant)}>{cfg.label}</span>;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="w-4 h-4" />
            ประวัติการต่อรอง ({revisions.length} revision{revisions.length > 1 ? 's' : ''})
            {viewerRole === 'admin' && draftCount > 0 && (
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                📝 {draftCount} draft
              </Badge>
            )}
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
          const isDraft = rev.status === 'draft';

          return (
            <div
              key={rev.id}
              className={cn(
                'border rounded-lg transition-colors',
                isDraft ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10' :
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
                  isDraft ? 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200' :
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

                {/* Inline print button (collapsed view) */}
                {onPrintRevision && rev.status !== 'draft' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrintRevision(rev);
                    }}
                    className="p-1 hover:bg-accent rounded transition-colors"
                    title={`พิมพ์ Rev ${rev.revision_number}`}
                  >
                    <Printer className="w-4 h-4 text-muted-foreground hover:text-primary" />
                  </button>
                )}

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

                  {/* Draft action buttons (admin only) */}
                  {viewerRole === 'admin' && isDraft && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-dashed border-amber-300 dark:border-amber-700">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublishDraft(rev);
                        }}
                        disabled={publishingId === rev.id}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        {publishingId === rev.id ? 'กำลังส่ง...' : 'ส่งให้ลูกค้า'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingDraft(rev);
                        }}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        ลบ Draft
                      </Button>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-2">
                    {/* Print this revision — ทุก revision ยกเว้น draft */}
                    {onPrintRevision && rev.status !== 'draft' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => onPrintRevision(rev)}
                      >
                        <Printer className="w-3.5 h-3.5 mr-1" />
                        พิมพ์ Rev {rev.revision_number}
                      </Button>
                    )}

                    {/* Use as base */}
                    {onSelectRevision && viewerRole === 'admin' && !isCurrent && !isDraft && (
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => onSelectRevision(rev)}>
                        ใช้เป็นฐานสร้าง Revision ใหม่
                      </Button>
                    )}
                  </div>
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

      {/* Delete Draft Confirmation Dialog */}
      <AlertDialog open={!!deletingDraft} onOpenChange={(v) => !v && setDeletingDraft(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              ยืนยันการลบ Draft
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  คุณกำลังจะลบ <strong>Revision {deletingDraft?.revision_number}</strong> ที่เป็น draft
                </p>
                {deletingDraft && (
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">สร้างเมื่อ:</span>
                      <span>{formatShortDateTime(deletingDraft.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ยอดรวม:</span>
                      <span className="font-semibold">{formatCurrency(deletingDraft.grand_total)}</span>
                    </div>
                    {deletingDraft.discount_percent > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ส่วนลด:</span>
                        <span>{deletingDraft.discount_percent}%</span>
                      </div>
                    )}
                    {deletingDraft.free_items && deletingDraft.free_items.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ของแถม:</span>
                        <span>{deletingDraft.free_items.length} รายการ</span>
                      </div>
                    )}
                    {deletingDraft.change_reason && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-0.5">เหตุผล:</p>
                        <p className="text-xs italic">"{deletingDraft.change_reason}"</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <span className="text-destructive">⚠️</span>
                  <p className="text-xs text-destructive">
                    การกระทำนี้ไม่สามารถย้อนกลับได้ — Draft จะถูกลบออกจากระบบถาวร
                    <br />
                    <span className="text-muted-foreground">
                      (Draft นี้ยังไม่เคยถูกส่งให้ลูกค้า — ลูกค้าไม่เห็นและไม่ทราบเรื่อง)
                    </span>
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDraft}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'กำลังลบ...' : '🗑️ ลบ Draft'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

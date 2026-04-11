import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowRight, TrendingUp, TrendingDown, Minus, Gift, Package,
} from 'lucide-react';

interface Revision {
  id: string;
  revision_number: number;
  created_at: string;
  created_by_name: string;
  created_by_role: string;
  products: any[];
  free_items: any[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  vat_amount: number;
  grand_total: number;
  change_reason: string | null;
}

interface Props {
  quoteId: string;
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency', currency: 'THB', minimumFractionDigits: 0,
  }).format(n);

const DiffBadge = ({ diff }: { diff: number }) => {
  if (Math.abs(diff) < 0.01) {
    return (
      <Badge variant="outline" className="text-xs">
        <Minus className="w-3 h-3 mr-1" /> ไม่เปลี่ยน
      </Badge>
    );
  }
  if (diff < 0) {
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
        <TrendingDown className="w-3 h-3 mr-1" />
        {formatCurrency(Math.abs(diff))}
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="text-xs">
      <TrendingUp className="w-3 h-3 mr-1" />
      +{formatCurrency(diff)}
    </Badge>
  );
};

export default function RevisionCompareView({ quoteId, open, onClose }: Props) {
  const [allRevisions, setAllRevisions] = useState<Revision[]>([]);
  const [revAId, setRevAId] = useState<string>('');
  const [revBId, setRevBId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    loadRevisions();
  }, [open, quoteId]);

  const loadRevisions = async () => {
    setLoading(true);
    try {
      const { data } = await (supabase.from as any)('quote_revisions')
        .select('*')
        .eq('quote_id', quoteId)
        .order('revision_number', { ascending: true });

      if (data) {
        setAllRevisions(data);
        if (data.length >= 2) {
          setRevAId(data[0].id);
          setRevBId(data[data.length - 1].id);
        } else if (data.length === 1) {
          setRevAId(data[0].id);
          setRevBId(data[0].id);
        }
      }
    } catch (e) {
      console.error('Error loading revisions:', e);
    } finally {
      setLoading(false);
    }
  };

  const revA = allRevisions.find((r) => r.id === revAId);
  const revB = allRevisions.find((r) => r.id === revBId);

  const calcFreeItemsTotal = (items: any[]) =>
    (items || []).reduce((s: number, i: any) => s + (i.total_value || 0), 0);

  const renderColumn = (rev: Revision | undefined, label: string) => {
    if (!rev) {
      return (
        <Card>
          <CardContent className="p-4 text-muted-foreground text-sm">
            เลือก revision
          </CardContent>
        </Card>
      );
    }

    const freeItemsTotal = calcFreeItemsTotal(rev.free_items);

    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{label}</Badge>
            <span className="text-xs text-muted-foreground">
              {rev.created_by_name}
            </span>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">รายการสินค้า</p>
            <p className="font-semibold flex items-center gap-1">
              <Package className="w-3 h-3" /> {rev.products?.length || 0} รายการ
            </p>
          </div>

          <Separator />

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ยอดสินค้า</span>
              <span>{formatCurrency(rev.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ส่วนลด</span>
              <span className="text-green-600">
                {rev.discount_percent}% ({formatCurrency(rev.discount_amount)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT</span>
              <span>{formatCurrency(rev.vat_amount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>รวมสุทธิ</span>
              <span className="text-primary">{formatCurrency(rev.grand_total)}</span>
            </div>
          </div>

          {rev.free_items && rev.free_items.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold flex items-center gap-1 mb-1">
                  <Gift className="w-3 h-3 text-amber-600" />
                  ของแถม ({rev.free_items.length})
                </p>
                <div className="text-xs space-y-0.5">
                  {rev.free_items.map((fi: any, i: number) => (
                    <div key={i} className="flex justify-between text-muted-foreground">
                      <span>{fi.model} × {fi.qty}</span>
                      <span>{formatCurrency(fi.total_value || 0)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-semibold text-amber-600 mt-1">
                  มูลค่ารวม: {formatCurrency(freeItemsTotal)}
                </p>
              </div>
            </>
          )}

          {rev.change_reason && (
            <>
              <Separator />
              <p className="text-xs text-muted-foreground italic">
                💬 {rev.change_reason}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const grandTotalDiff = (revB?.grand_total || 0) - (revA?.grand_total || 0);
  const discountDiff = (revB?.discount_percent || 0) - (revA?.discount_percent || 0);
  const freeItemsDiff = calcFreeItemsTotal(revB?.free_items || []) - calcFreeItemsTotal(revA?.free_items || []);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🔄 เปรียบเทียบ Revisions
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center py-8 text-muted-foreground">กำลังโหลด...</p>
        ) : allRevisions.length < 2 ? (
          <p className="text-center py-8 text-muted-foreground">
            ต้องมีอย่างน้อย 2 revisions จึงจะเปรียบเทียบได้
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 items-center">
              <Select value={revAId} onValueChange={setRevAId}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือก Revision A" />
                </SelectTrigger>
                <SelectContent>
                  {allRevisions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      Rev {r.revision_number} — {r.created_by_name} ({formatCurrency(r.grand_total)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={revBId} onValueChange={setRevBId}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือก Revision B" />
                </SelectTrigger>
                <SelectContent>
                  {allRevisions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      Rev {r.revision_number} — {r.created_by_name} ({formatCurrency(r.grand_total)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderColumn(revA, `Rev ${revA?.revision_number || '-'}`)}
              {renderColumn(revB, `Rev ${revB?.revision_number || '-'}`)}
            </div>

            {revA && revB && revA.id !== revB.id && (
              <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-2">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    สรุปการเปลี่ยนแปลง (Rev {revA.revision_number} → Rev {revB.revision_number})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="text-muted-foreground">ยอดสุทธิ</span>
                      <DiffBadge diff={grandTotalDiff} />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="text-muted-foreground">ส่วนลด</span>
                      <Badge variant="outline" className="text-xs">
                        {discountDiff > 0 ? '+' : ''}{discountDiff.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background rounded">
                      <span className="text-muted-foreground">ของแถม</span>
                      <Badge className={
                        freeItemsDiff > 0 
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }>
                        {freeItemsDiff > 0 ? '+' : ''}{formatCurrency(freeItemsDiff)}
                      </Badge>
                    </div>
                  </div>

                  {grandTotalDiff < 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      💰 ลูกค้าประหยัด {formatCurrency(Math.abs(grandTotalDiff))} เทียบกับ Rev {revA.revision_number}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

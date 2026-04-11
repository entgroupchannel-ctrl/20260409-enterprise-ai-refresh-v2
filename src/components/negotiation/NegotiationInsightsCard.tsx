import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Gift, Sparkles } from 'lucide-react';

interface Insights {
  has_data: boolean;
  total_revisions?: number;
  negotiation_rounds?: number;
  first_offer?: {
    revision_number: number;
    grand_total: number;
    discount_percent: number;
  };
  current_offer?: {
    revision_number: number;
    grand_total: number;
    discount_percent: number;
    free_items_value: number;
  };
  customer_savings?: number;
  savings_percent?: number;
}

interface Props {
  quoteId: string;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency', currency: 'THB', minimumFractionDigits: 0,
  }).format(n);

export default function NegotiationInsightsCard({ quoteId }: Props) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.rpc('get_quote_negotiation_insights', {
          p_quote_id: quoteId,
        });
        setInsights(data as any);
      } catch (e) {
        console.error('Error loading insights:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [quoteId]);

  if (loading || !insights?.has_data) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Negotiation Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2 bg-muted/30 rounded">
            <p className="text-xs text-muted-foreground">Revisions</p>
            <p className="text-xl font-bold">{insights.total_revisions || 0}</p>
          </div>
          <div className="p-2 bg-muted/30 rounded">
            <p className="text-xs text-muted-foreground">รอบการต่อรอง</p>
            <p className="text-xl font-bold">{insights.negotiation_rounds || 0}</p>
          </div>
        </div>

        {insights.first_offer && insights.current_offer && 
         insights.first_offer.revision_number !== insights.current_offer.revision_number && (
          <>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Rev {insights.first_offer.revision_number} (เริ่มต้น)</span>
                <span>{formatCurrency(insights.first_offer.grand_total)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Rev {insights.current_offer.revision_number} (ปัจจุบัน)</span>
                <span className="text-primary">{formatCurrency(insights.current_offer.grand_total)}</span>
              </div>
            </div>

            {(insights.customer_savings || 0) > 0 && (
              <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-center">
                <p className="text-xs text-green-700 dark:text-green-400">ลูกค้าประหยัด</p>
                <p className="font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(insights.customer_savings || 0)}
                  <span className="text-xs ml-1">({insights.savings_percent}%)</span>
                </p>
              </div>
            )}

            {(insights.current_offer.free_items_value || 0) > 0 && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-sm">
                <Gift className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 dark:text-amber-400">
                  ของแถม: {formatCurrency(insights.current_offer.free_items_value || 0)}
                </span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

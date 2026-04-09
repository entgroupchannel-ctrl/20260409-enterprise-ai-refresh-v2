import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Search,
  Eye,
  Calendar,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
} from 'lucide-react';
import QuoteTimeline from '@/components/rfq/QuoteTimeline';
import { formatDistanceToNow, format } from 'date-fns';
import { th } from 'date-fns/locale';

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  grand_total: number;
  created_at: string;
  sent_at: string | null;
  products: any[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'รอตอบกลับ', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  quote_sent: { label: 'ส่งราคาแล้ว', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: FileText },
  po_uploaded: { label: 'ส่ง PO แล้ว', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Upload },
  po_confirmed: { label: 'ส่ง PO แล้ว', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Upload },
  po_approved: { label: 'อนุมัติแล้ว', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
  completed: { label: 'เสร็จสิ้น', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
  rejected: { label: 'ปฏิเสธ', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

export default function MyQuotes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) loadQuotes();
  }, [user]);

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('customer_email', user?.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes((data || []) as Quote[]);
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter((q) =>
    q.quote_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(amount);

  const stats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === 'pending' || q.status === 'quote_sent').length,
    approved: quotes.filter((q) => q.status === 'po_approved' || q.status === 'completed').length,
    totalValue: quotes.reduce((sum, q) => sum + (q.grand_total || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">ใบเสนอราคาของฉัน</h1>
            </div>
            <Button onClick={() => navigate('/')} variant="ghost" size="sm">
              กลับหน้าหลัก
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Compact Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'ทั้งหมด', value: stats.total, cls: 'text-foreground' },
            { label: 'รอดำเนินการ', value: stats.pending, cls: 'text-yellow-600 dark:text-yellow-400' },
            { label: 'อนุมัติ', value: stats.approved, cls: 'text-green-600 dark:text-green-400' },
            { label: 'มูลค่ารวม', value: formatCurrency(stats.totalValue), cls: 'text-primary' },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground leading-none mb-1">{s.label}</p>
              <p className={`text-sm font-bold ${s.cls} truncate`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาเลขที่ใบเสนอราคา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>

        {/* Quote List */}
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              {searchQuery ? 'ไม่พบใบเสนอราคา' : 'ยังไม่มีใบเสนอราคา'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/request-quote')} size="sm" className="mt-3">
                ขอใบเสนอราคา
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredQuotes.map((quote) => {
              const statusInfo = statusConfig[quote.status] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;
              const productCount = quote.products?.length || 0;
              const productSummary = quote.products
                ?.slice(0, 2)
                .map((p: any) => p.model)
                .join(', ');
              const moreCount = productCount > 2 ? productCount - 2 : 0;

              return (
                <div
                  key={quote.id}
                  className="bg-card border border-border rounded-lg px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/my-quotes/${quote.id}`)}
                >
                  {/* Row 1: Quote number + Status + Amount */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {quote.quote_number}
                      </span>
                      <Badge className={`${statusInfo.color} text-[10px] px-1.5 py-0 shrink-0`}>
                        <StatusIcon className="w-2.5 h-2.5 mr-0.5" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                      {formatCurrency(quote.grand_total || 0)}
                    </span>
                  </div>

                  {/* Row 2: Date + Products */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(quote.created_at), 'dd MMM yy', { locale: th })}
                      {' · '}
                      {productSummary}
                      {moreCount > 0 && ` +${moreCount}`}
                    </span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true, locale: th })}
                    </span>
                  </div>

                  {/* Row 3: Timeline */}
                  <div className="mt-1.5">
                    <QuoteTimeline currentStatus={quote.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

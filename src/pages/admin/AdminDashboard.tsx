import { useEffect, useState } from 'react';
import NegotiationAnalytics from '@/components/admin/NegotiationAnalytics';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import MetricsCard from '@/components/admin/MetricsCard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Timer,
  CircleCheckBig,
  ShieldAlert,
  FileSearch,
  ScanEye,
  CheckCheck,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';

interface QuoteMetrics {
  pending: number;
  quote_sent: number;
  po_uploaded: number;
  completed: number;
  total: number;
}

interface UrgentQuote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_company: string | null;
  grand_total: number | null;
  status: string;
  sla_po_review_due: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<QuoteMetrics>({
    pending: 0, quote_sent: 0, po_uploaded: 0, completed: 0, total: 0,
  });
  const [urgentQuotes, setUrgentQuotes] = useState<UrgentQuote[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: quotes, error: quotesError } = await supabase
        .from('quote_requests')
        .select('status, grand_total')
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      const metricsData = quotes?.reduce(
        (acc, quote) => {
          acc.total++;
          if (quote.status === 'pending') acc.pending++;
          if (quote.status === 'quote_sent') acc.quote_sent++;
          if (quote.status === 'po_uploaded') acc.po_uploaded++;
          if (quote.status === 'completed') acc.completed++;
          return acc;
        },
        { pending: 0, quote_sent: 0, po_uploaded: 0, completed: 0, total: 0 }
      );

      setMetrics(metricsData || metrics);

      const twelveHoursFromNow = new Date();
      twelveHoursFromNow.setHours(twelveHoursFromNow.getHours() + 12);

      const { data: urgentData } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('status', 'po_uploaded')
        .lt('sla_po_review_due', twelveHoursFromNow.toISOString())
        .order('sla_po_review_due', { ascending: true })
        .limit(5);

      setUrgentQuotes((urgentData as UrgentQuote[]) || []);

      const { data: recentData } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentQuotes(recentData || []);
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // StatusBadge is now imported from @/components/ui/StatusBadge

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

  const calculateTimeRemaining = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (diff < 0) return { text: 'เกินกำหนดแล้ว!', isOverdue: true };
    if (hours < 1) return { text: `${minutes} นาที`, isOverdue: false };
    return { text: `${hours} ชม. ${minutes} นาที`, isOverdue: false };
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">ภาพรวมใบเสนอราคา</p>
          </div>
          <Button onClick={() => navigate('/admin/quotes')}>
            <FileText className="w-4 h-4 mr-2" />
            ดูทั้งหมด
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard title="🟡 รอตอบกลับ" count={metrics.pending} icon={<Clock />} variant="warning" onClick={() => navigate('/admin/quotes?status=pending')} />
          <MetricsCard title="🟢 รอลูกค้า" count={metrics.quote_sent} icon={<FileText />} onClick={() => navigate('/admin/quotes?status=quote_sent')} />
          <MetricsCard title="🔴 รอตรวจ PO" count={metrics.po_uploaded} icon={<AlertCircle />} variant="urgent" onClick={() => navigate('/admin/quotes?status=po_uploaded')} />
          <MetricsCard title="✅ สำเร็จ" count={metrics.completed} icon={<CheckCircle2 />} variant="success" onClick={() => navigate('/admin/quotes?status=completed')} />
        </div>

        {urgentQuotes.length > 0 && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                🚨 ต้อง Action ด่วน (SLA &lt; 12hr)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {urgentQuotes.map((quote) => {
                const timeRemaining = calculateTimeRemaining(quote.sla_po_review_due);
                return (
                  <Card key={quote.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/admin/quotes/${quote.id}`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{quote.quote_number}</span>
                          <span className="text-muted-foreground">{quote.customer_company || quote.customer_name}</span>
                          <span className="font-medium text-primary">{formatCurrency(quote.grand_total || 0)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <StatusBadge status={quote.status} />
                          <span className={timeRemaining.isOverdue ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                            ⏰ เหลือเวลา: {timeRemaining.text}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); navigate(`/admin/quotes/${quote.id}`); }}>
                          <Eye className="w-4 h-4 mr-1" /> ดู PO
                        </Button>
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/quotes/${quote.id}?action=approve`); }}>
                          <CheckCheck className="w-4 h-4 mr-1" /> อนุมัติ
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>📋 รายการล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate(`/admin/quotes/${quote.id}`)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{quote.quote_number}</span>
                      <span className="text-muted-foreground text-sm">{quote.customer_company || quote.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <StatusBadge status={quote.status} />
                      <span>{formatRelativeTime(quote.created_at)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">{formatCurrency(quote.grand_total || 0)}</div>
                  </div>
                </div>
              ))}
              {recentQuotes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">ยังไม่มีใบเสนอราคา</div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Phase 5: Negotiation Analytics Section */}
        <div className="mt-8">
          <NegotiationAnalytics />
        </div>
      </div>
    </AdminLayout>
  );
}

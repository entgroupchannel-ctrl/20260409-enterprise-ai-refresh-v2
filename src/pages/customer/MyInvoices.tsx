import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Receipt, Search, Loader2, AlertCircle,
  CircleCheckBig, Clock, Ban, Calendar,
  Hourglass, CheckCircle2,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  invoice_type: string;
  status: string;
  grand_total: number;
  customer_company: string | null;
  installment_number: number | null;
  installment_total: number | null;
  downpayment_percent: number | null;
  quote_id: string | null;
  payment_ui_state?: 'none' | 'pending' | 'rejected' | 'verified-partial' | 'verified-full';
  pending_count?: number;
}

const STATUS_LABELS: Record<string, { label: string; cls: string; icon: any }> = {
  draft: { label: 'ร่าง', cls: 'bg-gray-100 text-gray-700 border-gray-300', icon: Clock },
  sent: { label: 'รอชำระ', cls: 'bg-blue-100 text-blue-700 border-blue-300', icon: Clock },
  partially_paid: { label: 'ชำระบางส่วน', cls: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock },
  paid: { label: 'ชำระแล้ว', cls: 'bg-green-100 text-green-700 border-green-300', icon: CircleCheckBig },
  overdue: { label: 'เกินกำหนด', cls: 'bg-red-100 text-red-700 border-red-300', icon: AlertCircle },
  cancelled: { label: 'ยกเลิก', cls: 'bg-gray-100 text-gray-500 border-gray-300', icon: Ban },
};

const TYPE_LABELS: Record<string, string> = {
  full: 'เต็มจำนวน',
  downpayment: 'มัดจำ',
  installment: 'งวดแบ่ง',
  final: 'ส่วนที่เหลือ',
};

function computePaymentUIState(
  records: any[],
  invoiceStatus: string
): 'none' | 'pending' | 'rejected' | 'verified-partial' | 'verified-full' {
  if (records.length === 0) return 'none';

  const sorted = [...records].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const hasPending = records.some((r) => r.verification_status === 'pending');
  const hasVerified = records.some((r) => r.verification_status === 'verified');
  const latest = sorted[0];

  if (latest.verification_status === 'rejected' && !hasPending) return 'rejected';
  if (hasPending) return 'pending';
  if (hasVerified) return invoiceStatus === 'paid' ? 'verified-full' : 'verified-partial';
  return 'none';
}

export default function MyInvoices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) loadInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadInvoices = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: invData, error: invErr } = await (supabase as any)
        .from('invoices')
        .select(
          'id, invoice_number, invoice_date, due_date, invoice_type, status, grand_total, customer_company, installment_number, installment_total, downpayment_percent, quote_id'
        )
        .eq('customer_id', user.id)
        .is('deleted_at', null)
        .neq('status', 'draft')
        .order('created_at', { ascending: false });

      if (invErr) throw invErr;

      const invoicesList = (invData as Invoice[]) || [];

      // Load payment records for all invoices (batch)
      if (invoicesList.length > 0) {
        const invoiceIds = invoicesList.map((i) => i.id);
        const { data: payData } = await (supabase as any)
          .from('payment_records')
          .select('id, invoice_id, amount, verification_status, created_at')
          .in('invoice_id', invoiceIds);

        const paymentsByInvoice = new Map<string, any[]>();
        for (const p of payData || []) {
          if (!paymentsByInvoice.has(p.invoice_id)) {
            paymentsByInvoice.set(p.invoice_id, []);
          }
          paymentsByInvoice.get(p.invoice_id)!.push(p);
        }

        for (const inv of invoicesList) {
          const records = paymentsByInvoice.get(inv.id) || [];
          inv.pending_count = records.filter((r: any) => r.verification_status === 'pending').length;
          inv.payment_ui_state = computePaymentUIState(records, inv.status);
        }
      }

      setInvoices(invoicesList);
    } catch (e: any) {
      toast({
        title: 'โหลดใบวางบิลไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = (inv: Invoice): boolean => {
    if (!inv.due_date) return false;
    if (inv.status === 'paid' || inv.status === 'cancelled') return false;
    return new Date(inv.due_date) < new Date();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(amount);

  const formatDate = (s: string | null) =>
    s ? new Date(s).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

  const filteredInvoices = invoices.filter((inv) => {
    if (search.trim()) {
      const s = search.toLowerCase();
      const matches =
        inv.invoice_number.toLowerCase().includes(s) ||
        (inv.customer_company || '').toLowerCase().includes(s);
      if (!matches) return false;
    }
    if (statusFilter === 'pending') {
      return inv.status === 'sent' || inv.status === 'partially_paid' || isOverdue(inv);
    }
    if (statusFilter === 'paid') return inv.status === 'paid';
    if (statusFilter === 'overdue') return isOverdue(inv);
    return true;
  });

  const counts = {
    all: invoices.length,
    pending: invoices.filter((i) =>
      i.status === 'sent' || i.status === 'partially_paid' || isOverdue(i)
    ).length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    overdue: invoices.filter((i) => isOverdue(i)).length,
  };

  const totalDue = invoices
    .filter((i) => i.status === 'sent' || i.status === 'partially_paid' || isOverdue(i))
    .reduce((sum, i) => sum + (i.grand_total || 0), 0);

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>กรุณาเข้าสู่ระบบ</p>
        <Button className="mt-4" onClick={() => navigate('/login')}>เข้าสู่ระบบ</Button>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="ใบวางบิลของฉัน | ENT Group" description="ดูและดาวน์โหลดใบวางบิล" />
      <div className="container mx-auto p-4 md:p-6 max-w-5xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              กลับ
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Receipt className="w-6 h-6 text-primary" />
                ใบวางบิลของฉัน
              </h1>
              <p className="text-sm text-muted-foreground">
                ทั้งหมด {invoices.length} รายการ
              </p>
            </div>
          </div>

          {totalDue > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-3 px-4">
                <div className="text-xs text-blue-700">รวมที่ต้องชำระ</div>
                <div className="text-xl font-bold text-blue-900">
                  {formatCurrency(totalDue)}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหา: เลขที่ใบวางบิล, บริษัท..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="w-full justify-start flex-wrap h-auto">
                <TabsTrigger value="all" className="gap-2">
                  ทั้งหมด <Badge variant="secondary">{counts.all}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2">
                  รอชำระ <Badge variant="secondary">{counts.pending}</Badge>
                </TabsTrigger>
                <TabsTrigger value="paid" className="gap-2">
                  ชำระแล้ว <Badge variant="secondary">{counts.paid}</Badge>
                </TabsTrigger>
                <TabsTrigger value="overdue" className="gap-2 text-red-600">
                  เกินกำหนด <Badge variant="destructive">{counts.overdue}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Invoice List */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Receipt className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-sm font-medium">ไม่พบใบวางบิล</p>
              <p className="text-xs text-muted-foreground mt-1">
                {statusFilter === 'all'
                  ? 'ยังไม่มีใบวางบิลในระบบ'
                  : 'ไม่มีรายการในสถานะนี้'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((inv) => {
              const overdueFlag = isOverdue(inv);
              const effectiveStatus = overdueFlag ? 'overdue' : inv.status;
              const statusInfo = STATUS_LABELS[effectiveStatus] || STATUS_LABELS.draft;
              const StatusIcon = statusInfo.icon;

              return (
                <Card
                  key={inv.id}
                  className="cursor-pointer hover:border-primary hover:shadow-sm transition-all"
                  onClick={() => navigate(`/my-invoices/${inv.id}`)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-sm font-bold">{inv.invoice_number}</span>
                          <Badge variant="outline" className={`text-[10px] ${statusInfo.cls}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                            {TYPE_LABELS[inv.invoice_type] || inv.invoice_type}
                            {inv.invoice_type === 'downpayment' && inv.downpayment_percent != null &&
                              ` ${inv.downpayment_percent}%`}
                            {inv.invoice_type === 'installment' && inv.installment_number != null &&
                              ` ${inv.installment_number}/${inv.installment_total}`}
                          </Badge>
                          {/* Payment UI state badges */}
                          {inv.payment_ui_state === 'pending' && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-[10px]">
                              <Hourglass className="w-3 h-3 mr-1" />
                              ส่งสลิปแล้ว รอตรวจ
                              {(inv.pending_count ?? 0) > 1 && ` (${inv.pending_count})`}
                            </Badge>
                          )}
                          {inv.payment_ui_state === 'rejected' && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 text-[10px]">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              สลิปถูกปฏิเสธ
                            </Badge>
                          )}
                          {inv.payment_ui_state === 'verified-partial' && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-[10px]">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              ชำระบางส่วน
                            </Badge>
                          )}
                        </div>
                        {inv.customer_company && (
                          <p className="text-sm text-muted-foreground truncate">
                            {inv.customer_company}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            ออก: {formatDate(inv.invoice_date)}
                          </span>
                          {inv.due_date && (
                            <span className={`flex items-center gap-1 ${
                              overdueFlag ? 'text-red-600 font-semibold' : ''
                            }`}>
                              <Clock className="w-3 h-3" />
                              ครบกำหนด: {formatDate(inv.due_date)}
                              {overdueFlag && ' (เกินกำหนด)'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground">จำนวนเงิน</div>
                      <div className="text-lg font-bold text-primary">
                          {formatCurrency(inv.grand_total)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
    
  );
}

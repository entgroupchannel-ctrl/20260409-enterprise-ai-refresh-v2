import { useEffect, useState } from 'react';
import QuoteStatusFlow from '@/components/quotes/QuoteStatusFlow';
import QuoteStatusDropdown from '@/components/admin/QuoteStatusDropdown';
import QuoteActionsMenu from '@/components/admin/QuoteActionsMenu';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_company: string | null;
  status: string;
  grand_total: number | null;
  created_at: string;
  sent_at: string | null;
  po_uploaded_at: string | null;
  sla_breached: boolean | null;
  sla_po_review_due: string | null;
  assigned_to: string | null;
}

export default function AdminQuotesList() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at_desc');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadQuotes();
    const urlStatus = searchParams.get('status');
    if (urlStatus) setStatusFilter(urlStatus);
  }, [searchParams]);

  useEffect(() => {
    filterAndSortQuotes();
  }, [quotes, searchQuery, statusFilter, sortBy]);

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setQuotes((data as Quote[]) || []);
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortQuotes = () => {
    let result = [...quotes];
    if (statusFilter !== 'all') result = result.filter((q) => q.status === statusFilter);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (q) =>
          q.quote_number.toLowerCase().includes(query) ||
          q.customer_name.toLowerCase().includes(query) ||
          q.customer_email.toLowerCase().includes(query) ||
          q.customer_company?.toLowerCase().includes(query)
      );
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'created_at_desc': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_at_asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'amount_desc': return (b.grand_total || 0) - (a.grand_total || 0);
        case 'amount_asc': return (a.grand_total || 0) - (b.grand_total || 0);
        case 'quote_number_desc': return b.quote_number.localeCompare(a.quote_number);
        case 'quote_number_asc': return a.quote_number.localeCompare(b.quote_number);
        default: return 0;
      }
    });
    setFilteredQuotes(result);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'secondary' | 'default' | 'destructive' }> = {
      pending: { label: 'รอตอบกลับ', variant: 'secondary' },
      quote_sent: { label: 'ส่งราคาแล้ว', variant: 'default' },
      po_uploaded: { label: 'รอตรวจ PO', variant: 'destructive' },
      po_approved: { label: 'อนุมัติแล้ว', variant: 'default' },
      completed: { label: 'เสร็จสิ้น', variant: 'secondary' },
      rejected: { label: 'ปฏิเสธ', variant: 'destructive' },
    };
    const config = variants[status] || { label: status, variant: 'default' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

  const calculateSLATime = (dueDate: string | null) => {
    if (!dueDate) return null;
    const diff = new Date(dueDate).getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (diff < 0) return { text: 'เกินกำหนด', isOverdue: true, isUrgent: false };
    const isUrgent = hours < 12;
    if (hours < 1) return { text: `${minutes} นาที`, isOverdue: false, isUrgent: true };
    return { text: `${hours} ชม.`, isOverdue: false, isUrgent };
  };

  const getStatusCounts = () => ({
    all: quotes.length,
    pending: quotes.filter((q) => q.status === 'pending').length,
    quote_sent: quotes.filter((q) => q.status === 'quote_sent').length,
    po_uploaded: quotes.filter((q) => q.status === 'po_uploaded').length,
    po_approved: quotes.filter((q) => q.status === 'po_approved').length,
    completed: quotes.filter((q) => q.status === 'completed').length,
  });

  const statusCounts = getStatusCounts();

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
            <h1 className="text-3xl font-bold text-foreground">ใบเสนอราคา</h1>
            <p className="text-muted-foreground mt-1">จัดการและติดตามสถานะใบเสนอราคา</p>
          </div>
          <Button onClick={() => navigate('/admin/quotes/new')}>
            <FileText className="w-4 h-4 mr-2" />
            สร้างใบเสนอราคา
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="ค้นหาเลขที่, ชื่อ, อีเมล, บริษัท..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="เรียงตาม" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at_desc">ล่าสุด → เก่าสุด</SelectItem>
                    <SelectItem value="created_at_asc">เก่าสุด → ล่าสุด</SelectItem>
                    <SelectItem value="amount_desc">ราคา สูง → ต่ำ</SelectItem>
                    <SelectItem value="amount_asc">ราคา ต่ำ → สูง</SelectItem>
                    <SelectItem value="quote_number_desc">เลขที่ ล่าสุด</SelectItem>
                    <SelectItem value="quote_number_asc">เลขที่ เก่าสุด</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="all" className="gap-2">ทั้งหมด <Badge variant="secondary">{statusCounts.all}</Badge></TabsTrigger>
                  <TabsTrigger value="pending" className="gap-2">รอตอบ <Badge variant="secondary">{statusCounts.pending}</Badge></TabsTrigger>
                  <TabsTrigger value="quote_sent" className="gap-2">รอลูกค้า <Badge variant="secondary">{statusCounts.quote_sent}</Badge></TabsTrigger>
                  <TabsTrigger value="po_uploaded" className="gap-2">รอตรวจ PO <Badge variant="destructive">{statusCounts.po_uploaded}</Badge></TabsTrigger>
                  <TabsTrigger value="po_approved" className="gap-2">อนุมัติแล้ว <Badge variant="secondary">{statusCounts.po_approved}</Badge></TabsTrigger>
                  <TabsTrigger value="completed" className="gap-2">สำเร็จ <Badge variant="secondary">{statusCounts.completed}</Badge></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>พบ {filteredQuotes.length} รายการ{searchQuery && ` จากการค้นหา "${searchQuery}"`}</span>
        </div>

        <div className="space-y-3">
          {filteredQuotes.map((quote) => {
            const slaTime = quote.status === 'po_uploaded' ? calculateSLATime(quote.sla_po_review_due) : null;
            return (
              <Card key={quote.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/admin/quotes/${quote.id}`)}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-lg">{quote.quote_number}</span>
                        {quote.sla_breached && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="w-3 h-3" /> SLA เกิน
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="text-foreground">{quote.customer_company || quote.customer_name}</span>
                        <span className="text-muted-foreground">{quote.customer_email}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {getStatusBadge(quote.status)}
                        <QuoteStatusFlow status={quote.status} mini />
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true, locale: th })}
                        </span>
                        {slaTime && (
                          <span className={`flex items-center gap-1 font-medium ${slaTime.isOverdue ? 'text-destructive' : slaTime.isUrgent ? 'text-orange-600' : 'text-muted-foreground'}`}>
                            <AlertCircle className="w-3 h-3" /> SLA: {slaTime.text}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">ยอดรวม</div>
                        <div className="text-xl font-bold text-primary">{formatCurrency(quote.grand_total || 0)}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); navigate(`/admin/quotes/${quote.id}`); }}>
                          <Eye className="w-4 h-4 mr-1" /> ดู
                        </Button>
                        {quote.status === 'po_uploaded' && (
                          <>
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/quotes/${quote.id}?action=approve`); }}>
                              <CheckCircle2 className="w-4 h-4 mr-1" /> อนุมัติ
                            </Button>
                            <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); navigate(`/admin/quotes/${quote.id}?action=reject`); }}>
                              <XCircle className="w-4 h-4 mr-1" /> ปฏิเสธ
                            </Button>
                          </>
                        )}
                        {quote.status === 'pending' && (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/quotes/${quote.id}?action=send`); }}>
                            <FileText className="w-4 h-4 mr-1" /> ส่งราคา
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredQuotes.length === 0 && (
            <Card>
              <CardContent className="p-12">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">ไม่พบใบเสนอราคา</p>
                  <p className="text-sm">{searchQuery ? 'ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรอง' : 'ยังไม่มีใบเสนอราคาในระบบ'}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Search,
  Clock,
  Plus,
  Package,
} from 'lucide-react';
import QuoteTimeline from '@/components/rfq/QuoteTimeline';
import { formatRelativeTime } from '@/lib/format';

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  grand_total: number;
  created_at: string;
  products: any[];
}

export default function MyQuotes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch = q.quote_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);

  const statusCounts = {
    all: quotes.length,
    pending: quotes.filter((q) => q.status === 'pending').length,
    quote_sent: quotes.filter((q) => q.status === 'quote_sent').length,
    po_uploaded: quotes.filter((q) => q.status === 'po_uploaded').length,
    po_approved: quotes.filter((q) => q.status === 'po_approved').length,
    completed: quotes.filter((q) => q.status === 'completed').length,
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
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">ใบเสนอราคาของฉัน</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate('/request-quote')} className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">สร้างใบเสนอราคาใหม่</span>
                <span className="sm:hidden">สร้างใหม่</span>
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                กลับหน้าหลัก
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาเลขที่ใบเสนอราคา..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full lg:w-auto">
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full lg:w-auto">
                  <TabsTrigger value="all" className="gap-1 text-xs lg:text-sm">
                    ทั้งหมด <Badge variant="secondary" className="ml-1">{statusCounts.all}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="gap-1 text-xs lg:text-sm">
                    รอตอบ <Badge variant="secondary" className="ml-1">{statusCounts.pending}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="quote_sent" className="gap-1 text-xs lg:text-sm">
                    ได้รับราคา <Badge variant="secondary" className="ml-1">{statusCounts.quote_sent}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="po_uploaded" className="gap-1 text-xs lg:text-sm">
                    ส่ง PO <Badge variant="secondary" className="ml-1">{statusCounts.po_uploaded}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="po_approved" className="gap-1 text-xs lg:text-sm">
                    อนุมัติ <Badge variant="secondary" className="ml-1">{statusCounts.po_approved}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="gap-1 text-xs lg:text-sm">
                    เสร็จสิ้น <Badge variant="secondary" className="ml-1">{statusCounts.completed}</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <span>พบ {filteredQuotes.length} รายการ{searchQuery && ` จากการค้นหา "${searchQuery}"`}</span>
        </div>

        {/* Quote Cards - Compact */}
        <div className="space-y-3">
          {filteredQuotes.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">
                    {searchQuery ? 'ไม่พบใบเสนอราคา' : 'ยังไม่มีใบเสนอราคา'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {searchQuery ? 'ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรอง' : 'เริ่มต้นสร้างใบเสนอราคาแรกของคุณ'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => navigate('/request-quote')}>
                      <Plus className="w-4 h-4 mr-2" />
                      สร้างใบเสนอราคา
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredQuotes.map((quote) => (
              <Card
                key={quote.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/my-quotes/${quote.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-lg">{quote.quote_number}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {quote.products?.length || 0} รายการ
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(quote.created_at)}
                        </span>
                      </div>

                      {/* Timeline - Prominent section */}
                      <div className="pt-3 mt-3 border-t border-border">
                        <QuoteTimeline currentStatus={quote.status} size="lg" />
                      </div>
                    </div>

                    {/* Right: Price */}
                    <div className="text-right lg:min-w-[200px]">
                      <div className="text-xs text-muted-foreground mb-1">ยอดรวม</div>
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(quote.grand_total || 0)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

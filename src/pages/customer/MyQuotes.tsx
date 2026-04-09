// src/pages/customer/MyQuotes.tsx
// Customer RFQ List - Complete UX with Navigation & Actions

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { QuoteTimelineBadge } from '@/components/rfq/QuoteTimeline';
import {
  Search,
  FileText,
  Plus,
  Eye,
  Clock,
  Home,
  MoreVertical,
  Download,
  Printer,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  grand_total: number;
  created_at: string;
  sent_at: string | null;
  products: any[];
  sla_expires_at: string | null;
  priority: string;
}

export default function MyQuotes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      loadQuotes();
      const unsub = subscribeToUpdates();
      return unsub;
    }
  }, [user]);

  useEffect(() => {
    filterQuotes();
  }, [quotes, searchQuery, statusFilter]);

  const loadQuotes = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('customer_email', userData.user.email!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes((data as any[]) || []);
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

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('quote_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quote_requests' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setQuotes((prev) =>
              prev.map((q) =>
                q.id === (payload.new as any).id ? { ...q, ...payload.new } : q
              )
            );
            if ((payload.old as any).status !== (payload.new as any).status) {
              toast({
                title: 'มีการอัปเดต',
                description: `${(payload.new as any).quote_number} - ${getStatusLabel((payload.new as any).status)}`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  };

  const filterQuotes = () => {
    let filtered = quotes;
    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.products?.some((p: any) => p.model?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }
    setFilteredQuotes(filtered);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'รอใบเสนอราคา',
      quote_sent: 'ได้รับราคาแล้ว',
      po_uploaded: 'ส่ง PO แล้ว',
      po_approved: 'อนุมัติแล้ว',
      completed: 'เสร็จสิ้น',
      rejected: 'ไม่อนุมัติ',
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount: number) => {
    if (!amount || amount === 0) return '-';
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
  };

  const handlePrintQuote = (quoteId: string) => {
    window.open(`/my-quotes/${quoteId}?print=true`, '_blank');
  };

  const handleDownloadPDF = async (quoteId: string) => {
    toast({ title: 'กำลังดาวน์โหลด', description: 'กรุณารอสักครู่...' });
  };

  const handleShareQuote = (quote: Quote) => {
    const url = `${window.location.origin}/my-quotes/${quote.id}`;
    navigator.clipboard.writeText(url);
    toast({ title: 'คัดลอกลิงก์แล้ว', description: 'คุณสามารถแชร์ลิงก์นี้ได้' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                กลับหน้าหลัก
              </Button>
              <div className="h-6 w-px bg-border" />
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                <Home className="w-4 h-4 inline mr-1" />
                หน้าแรก
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                โปรไฟล์
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">📋 ใบเสนอราคาของฉัน</h1>
            <p className="text-muted-foreground">ติดตามสถานะและจัดการใบเสนอราคาของคุณ</p>
          </div>
          <Button onClick={() => navigate('/request-quote')} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            สร้างใบขอเสนอราคาใหม่
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('all')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{quotes.length}</p>
                <p className="text-sm text-muted-foreground mt-1">ทั้งหมด</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('pending')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{quotes.filter((q) => q.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground mt-1">รอใบเสนอราคา</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('quote_sent')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{quotes.filter((q) => q.status === 'quote_sent').length}</p>
                <p className="text-sm text-muted-foreground mt-1">ได้รับราคา</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('completed')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{quotes.filter((q) => ['po_approved', 'completed'].includes(q.status)).length}</p>
                <p className="text-sm text-muted-foreground mt-1">เสร็จสิ้น</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="ค้นหาเลขที่ใบเสนอราคา, รุ่นสินค้า..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                  <SelectItem value="pending">รอใบเสนอราคา</SelectItem>
                  <SelectItem value="quote_sent">ได้รับราคาแล้ว</SelectItem>
                  <SelectItem value="po_uploaded">ส่ง PO แล้ว</SelectItem>
                  <SelectItem value="po_approved">อนุมัติแล้ว</SelectItem>
                  <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                  <SelectItem value="rejected">ไม่อนุมัติ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quotes List */}
        <div className="space-y-4">
          {filteredQuotes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">ไม่มีใบเสนอราคา</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' ? 'ไม่พบข้อมูลที่ค้นหา' : 'คุณยังไม่มีใบเสนอราคา'}
                </p>
                <Button onClick={() => navigate('/request-quote')}>
                  <Plus className="w-4 h-4 mr-2" />
                  สร้างใบขอเสนอราคาใหม่
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredQuotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground hover:text-primary cursor-pointer" onClick={() => navigate(`/my-quotes/${quote.id}`)}>
                          {quote.quote_number}
                        </h3>
                        <QuoteTimelineBadge currentStatus={quote.status} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true, locale: th })}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/my-quotes/${quote.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />ดูรายละเอียด
                        </DropdownMenuItem>
                        {quote.status !== 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handlePrintQuote(quote.id)}>
                              <Printer className="w-4 h-4 mr-2" />พิมพ์
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadPDF(quote.id)}>
                              <Download className="w-4 h-4 mr-2" />ดาวน์โหลด PDF
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleShareQuote(quote)}>
                          <Share2 className="w-4 h-4 mr-2" />แชร์
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">รายการสินค้า</p>
                      <p className="text-sm font-semibold">{quote.products?.length || 0} รายการ</p>
                    </div>
                    {quote.grand_total > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">ยอดรวม</p>
                        <p className="text-lg font-bold text-primary">{formatCurrency(quote.grand_total)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">สถานะ</p>
                      <p className="text-sm font-semibold">{getStatusLabel(quote.status)}</p>
                    </div>
                  </div>

                  {quote.priority === 'urgent' && quote.sla_expires_at && (
                    <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                      ⚠️ ต้องดำเนินการก่อน {formatDistanceToNow(new Date(quote.sla_expires_at), { addSuffix: true, locale: th })}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button variant="default" size="sm" onClick={() => navigate(`/my-quotes/${quote.id}`)}>
                      <Eye className="w-4 h-4 mr-1" />ดูรายละเอียด
                    </Button>
                    {quote.status === 'quote_sent' && (
                      <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(quote.id)}>
                        <Download className="w-4 h-4 mr-1" />ดาวน์โหลด PDF
                      </Button>
                    )}
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

// src/pages/customer/MyQuotes.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  FileText,
  Clock,
  Eye,
  Download,
  Upload,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
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
        .eq('customer_email', userData.user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
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

  const filterQuotes = () => {
    let filtered = quotes;

    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.products?.some((p) =>
            p.model?.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    setFilteredQuotes(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
    > = {
      pending: { label: 'รอตอบกลับ', variant: 'secondary' },
      quote_sent: { label: 'ได้รับราคาแล้ว', variant: 'default' },
      po_uploaded: { label: 'ส่ง PO แล้ว', variant: 'outline' },
      po_approved: { label: 'อนุมัติแล้ว', variant: 'default' },
      completed: { label: 'เสร็จสิ้น', variant: 'outline' },
      rejected: { label: 'ไม่อนุมัติ', variant: 'destructive' },
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">ใบเสนอราคาของฉัน</h1>
            <p className="text-gray-600">ติดตามสถานะและจัดการใบเสนอราคาของคุณ</p>
          </div>
          <Button onClick={() => navigate('/request-quote')} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            ขอใบเสนอราคาใหม่
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {quotes.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">ทั้งหมด</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {quotes.filter((q) => q.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">รอตอบกลับ</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {quotes.filter((q) => q.status === 'quote_sent').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">ได้รับราคา</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {quotes.filter((q) => q.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">เสร็จสิ้น</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="ค้นหาเลขที่ใบเสนอราคา, รุ่นสินค้า..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                  <SelectItem value="pending">รอตอบกลับ</SelectItem>
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
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  ไม่มีใบเสนอราคา
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== 'all'
                    ? 'ไม่พบข้อมูลที่ค้นหา'
                    : 'คุณยังไม่มีใบเสนอราคา'}
                </p>
                <Button onClick={() => navigate('/request-quote')}>
                  <Plus className="w-4 h-4 mr-2" />
                  ขอใบเสนอราคาใหม่
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredQuotes.map((quote) => (
              <Card
                key={quote.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/my-quotes/${quote.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-lg">{quote.quote_number}</span>
                        {getStatusBadge(quote.status)}
                      </div>

                      <div className="text-sm text-gray-600">
                        {quote.products?.length || 0} รายการ
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(new Date(quote.created_at), {
                          addSuffix: true,
                          locale: th,
                        })}
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                      {quote.grand_total > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">ยอดรวม</p>
                          <p className="text-xl font-bold text-blue-600">
                            {formatCurrency(quote.grand_total)}
                          </p>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/my-quotes/${quote.id}`);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        ดูรายละเอียด
                      </Button>
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

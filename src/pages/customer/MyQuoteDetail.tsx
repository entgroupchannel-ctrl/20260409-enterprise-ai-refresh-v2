// src/pages/customer/MyQuoteDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QuoteStatusFlow from '@/components/quotes/QuoteStatusFlow';
import {
  ArrowLeft,
  Download,
  Upload,
  FileText,
  Clock,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_company: string | null;
  customer_address: string | null;
  products: any[];
  subtotal: number;
  vat_amount: number;
  grand_total: number;
  notes: string | null;
  payment_terms: string | null;
  delivery_terms: string | null;
  warranty_terms: string | null;
  created_at: string;
  sent_at: string | null;
  valid_until: string | null;
}

export default function MyQuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      loadQuoteDetail();
    }
  }, [id, user]);

  const loadQuoteDetail = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', id)
        .eq('customer_email', userData.user.email)
        .single();

      if (error) throw error;
      setQuote(data);
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/my-quotes');
    } finally {
      setLoading(false);
    }
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

  if (!quote) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/my-quotes')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับ
          </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{quote.quote_number}</h1>
              <div className="flex items-center gap-2">
                {getStatusBadge(quote.status)}
                <span className="text-sm text-gray-500">
                  สร้างเมื่อ {format(new Date(quote.created_at), 'dd MMMM yyyy', { locale: th })}
                </span>
              </div>
            </div>
            {quote.status === 'quote_sent' && (
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                อัปโหลด PO
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Progress Timeline */}
          <Card>
            <CardContent className="pt-6">
              <QuoteProgressStepper status={quote.status} />
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลผู้ขอใบเสนอราคา</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">ชื่อ</p>
                  <p className="font-medium">{quote.customer_name}</p>
                </div>
              </div>
              {quote.customer_company && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">บริษัท</p>
                    <p className="font-medium">{quote.customer_company}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">อีเมล</p>
                  <p className="font-medium">{quote.customer_email}</p>
                </div>
              </div>
              {quote.customer_phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">โทรศัพท์</p>
                    <p className="font-medium">{quote.customer_phone}</p>
                  </div>
                </div>
              )}
              {quote.customer_address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">ที่อยู่</p>
                    <p className="font-medium">{quote.customer_address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle>รายการสินค้า</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quote.products && quote.products.length > 0 ? (
                  quote.products.map((product: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">{product.model || 'N/A'}</h4>
                          <p className="text-sm text-gray-600">{product.description}</p>
                        </div>
                        {product.line_total > 0 && (
                          <div className="text-right ml-4">
                            <p className="font-semibold text-blue-600">
                              {formatCurrency(product.line_total)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>จำนวน: {product.qty || 0}</span>
                        {product.unit_price > 0 && (
                          <>
                            <span>ราคา/หน่วย: {formatCurrency(product.unit_price)}</span>
                            {product.discount_percent > 0 && (
                              <span className="text-green-600">
                                ส่วนลด {product.discount_percent}%
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">ไม่มีรายการสินค้า</p>
                )}
              </div>

              {quote.grand_total > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ยอดรวม</span>
                      <span className="font-semibold">{formatCurrency(quote.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ภาษีมูลค่าเพิ่ม 7%</span>
                      <span className="font-semibold">{formatCurrency(quote.vat_amount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-blue-600">ยอดรวมทั้งสิ้น</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(quote.grand_total)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Terms */}
          {(quote.payment_terms || quote.delivery_terms || quote.warranty_terms || quote.notes) && (
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลเพิ่มเติม</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quote.payment_terms && (
                  <div>
                    <h4 className="font-semibold mb-1">เงื่อนไขการชำระเงิน</h4>
                    <p className="text-gray-600 text-sm">{quote.payment_terms}</p>
                  </div>
                )}
                {quote.delivery_terms && (
                  <div>
                    <h4 className="font-semibold mb-1">เงื่อนไขการจัดส่ง</h4>
                    <p className="text-gray-600 text-sm">{quote.delivery_terms}</p>
                  </div>
                )}
                {quote.warranty_terms && (
                  <div>
                    <h4 className="font-semibold mb-1">การรับประกัน</h4>
                    <p className="text-gray-600 text-sm">{quote.warranty_terms}</p>
                  </div>
                )}
                {quote.notes && (
                  <div>
                    <h4 className="font-semibold mb-1">หมายเหตุ</h4>
                    <p className="text-gray-600 text-sm">{quote.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {quote.status === 'quote_sent' && (
            <div className="flex gap-3 justify-end">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                ดาวน์โหลด PDF
              </Button>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                อัปโหลด PO
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

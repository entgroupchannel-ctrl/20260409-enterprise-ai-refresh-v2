// src/pages/customer/MyQuoteDetail.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QuoteTimeline from '@/components/rfq/QuoteTimeline';
import POUploadDialog from '@/components/quotes/POUploadDialog';
import {
  ArrowLeft,
  Download,
  Printer,
  Upload,
  FileText,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company: string;
  customer_address: string;
  customer_tax_id: string;
  products: any[];
  notes: string;
  subtotal: number;
  vat_amount: number;
  grand_total: number;
  payment_terms: string;
  delivery_terms: string;
  warranty_terms: string;
  created_at: string;
  sent_at: string | null;
  valid_until: string | null;
}

export default function MyQuoteDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPOUpload, setShowPOUpload] = useState(false);
  const [poFiles, setPoFiles] = useState<any[]>([]);
  const isPrintMode = searchParams.get('print') === 'true';

  useEffect(() => {
    if (id && user) {
      loadQuote();
      loadPOFiles();
    }
  }, [id, user]);

  useEffect(() => {
    if (isPrintMode && quote) setTimeout(() => window.print(), 500);
  }, [isPrintMode, quote]);

  const loadQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', id!)
        .single();

      if (error) throw error;
      if (!data) {
        toast({ title: 'ไม่พบข้อมูล', description: 'ไม่พบใบเสนอราคานี้หรือคุณไม่มีสิทธิ์เข้าถึง', variant: 'destructive' });
        navigate('/my-quotes');
        return;
      }
      setQuote({ ...data, products: (data.products as any) || [] } as any);
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
      navigate('/my-quotes');
    } finally {
      setLoading(false);
    }
  };

  const loadPOFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_files')
        .select('*')
        .eq('quote_id', id!)
        .eq('category', 'po')
        .order('uploaded_at', { ascending: false });

      if (!error && data) {
        setPoFiles(data);
      }
    } catch (error) {
      console.error('Error loading PO files:', error);
    }
  };

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    toast({ title: 'กำลังดาวน์โหลด', description: 'กรุณารอสักครู่...' });
  };

  const handleUploadPO = () => {
    setShowPOUpload(true);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(amount);

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

  if (!quote) return null;

  return (
    <div className="min-h-screen bg-background">
      {!isPrintMode && (
        <div className="bg-card border-b border-border sticky top-0 z-10 print:hidden">
          <div className="container max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => navigate('/my-quotes')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                กลับรายการ
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />พิมพ์
                </Button>
                {quote.status !== 'pending' && (
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-2" />ดาวน์โหลด PDF
                  </Button>
                )}
                {quote.status === 'quote_sent' && (
                  <Button size="sm" onClick={handleUploadPO}>
                    <Upload className="w-4 h-4 mr-2" />อัปโหลด PO
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{quote.quote_number}</h1>
          <p className="text-muted-foreground">
            สร้างเมื่อ {format(new Date(quote.created_at), 'dd MMMM yyyy, HH:mm', { locale: th })}
          </p>
        </div>

        <Card className="mb-6 print:hidden">
          <CardContent className="pt-6">
            <QuoteTimeline currentStatus={quote.status} size="lg" />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              ข้อมูลผู้ขอใบเสนอราคา
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">ชื่อ-นามสกุล</p>
                    <p className="font-semibold">{quote.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">อีเมล</p>
                    <p className="font-semibold">{quote.customer_email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">โทรศัพท์</p>
                    <p className="font-semibold">{quote.customer_phone || '-'}</p>
                  </div>
                </div>
              </div>

              {quote.customer_company && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">บริษัท</p>
                      <p className="font-semibold">{quote.customer_company}</p>
                    </div>
                  </div>
                  {quote.customer_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">ที่อยู่</p>
                        <p className="font-semibold">{quote.customer_address}</p>
                      </div>
                    </div>
                  )}
                  {quote.customer_tax_id && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">เลขผู้เสียภาษี</p>
                        <p className="font-semibold">{quote.customer_tax_id}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              รายการสินค้า
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">รุ่น</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">รายละเอียด</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">จำนวน</th>
                    {quote.status !== 'pending' && (
                      <>
                        <th className="px-4 py-3 text-right text-sm font-semibold">ราคา/หน่วย</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">ส่วนลด</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">รวม</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {quote.products?.map((product: any, index: number) => (
                    <tr key={index} className="border-b border-border">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 font-semibold">{product.model}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{product.description}</td>
                      <td className="px-4 py-3 text-right">{product.qty}</td>
                      {quote.status !== 'pending' && (
                        <>
                          <td className="px-4 py-3 text-right">{formatCurrency(product.unit_price || 0)}</td>
                          <td className="px-4 py-3 text-right">{product.discount_percent || 0}%</td>
                          <td className="px-4 py-3 text-right font-semibold">{formatCurrency(product.line_total || 0)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {quote.status !== 'pending' && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ยอดรวม</span>
                    <span className="font-semibold">{formatCurrency(quote.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT 7%</span>
                    <span className="font-semibold">{formatCurrency(quote.vat_amount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>ยอดรวมทั้งสิ้น</span>
                    <span className="text-primary">{formatCurrency(quote.grand_total)}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* PO Files Section */}
        {poFiles.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                เอกสาร Purchase Order (PO)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {poFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">
                          {file.file_name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>
                            {format(new Date(file.uploaded_at), 'dd MMM yyyy HH:mm', {
                              locale: th,
                            })}
                          </span>
                          {file.file_size && (
                            <span>
                              {(file.file_size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.file_url, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      ดาวน์โหลด
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">สถานะ:</span>{' '}
                  {quote.status === 'po_uploaded' && 'ทีมงานกำลังตรวจสอบ PO ของคุณ'}
                  {quote.status === 'po_approved' && 'PO ได้รับการอนุมัติแล้ว'}
                  {quote.status === 'completed' && 'เสร็จสิ้น'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {quote.notes && (
          <Card className="mb-6">
            <CardHeader><CardTitle>หมายเหตุ</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{quote.notes}</p>
            </CardContent>
          </Card>
        )}

        {!isPrintMode && quote.status === 'quote_sent' && (
          <div className="flex gap-3 justify-center print:hidden">
            <Button variant="outline" size="lg" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />ดาวน์โหลด PDF
            </Button>
            <Button size="lg" onClick={handleUploadPO}>
              <Upload className="w-4 h-4 mr-2" />อัปโหลด PO
            </Button>
          </div>
        )}
      </div>

      <POUploadDialog
        open={showPOUpload}
        onOpenChange={setShowPOUpload}
        quoteId={quote.id}
        quoteNumber={quote.quote_number}
        onSuccess={() => {
          loadQuote();
          loadPOFiles();
        }}
      />
    </div>
  );
}
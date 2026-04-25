import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Download, AlertCircle, Eye, Clock, FileText } from 'lucide-react';
import QuotePDFTemplate from '@/components/admin/QuotePDFTemplate';
import { mergeRevisionWithQuote } from '@/lib/quote-pdf-merge';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function SharedQuotePage() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const autoDownload = searchParams.get('download') === '1';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ code: string; message: string; expired_at?: string } | null>(null);
  const [data, setData] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const downloadFiredRef = useRef(false);

  useEffect(() => {
    if (!token) return;
    load('view');
  }, [token]);

  const load = async (action: 'view' | 'download') => {
    setLoading(true);
    try {
      const { data: result, error: rpcError } = await (supabase as any).rpc('get_shared_quote', {
        p_token: token,
        p_action: action,
      });
      if (rpcError) throw rpcError;
      if (result?.error) {
        setError({ code: result.error, message: result.message, expired_at: result.expired_at });
        setData(null);
      } else {
        setData(result);
        setError(null);
      }
    } catch (e: any) {
      setError({ code: 'unknown', message: e.message || 'เกิดข้อผิดพลาด' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      // Log download
      await (supabase as any).rpc('get_shared_quote', { p_token: token, p_action: 'download' });

      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('quote-pdf-template');
      if (!element) return;
      const opt = {
        margin: [15, 15, 20, 15],
        filename: `${data.quote.quote_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  // Auto-download once data is ready
  useEffect(() => {
    if (autoDownload && data && !downloadFiredRef.current) {
      downloadFiredRef.current = true;
      setTimeout(handleDownload, 500);
    }
  }, [autoDownload, data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
          <p className="text-muted-foreground">กำลังโหลดใบเสนอราคา...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const titleMap: Record<string, string> = {
      not_found: 'ไม่พบลิงก์',
      revoked: 'ลิงก์ถูกยกเลิก',
      expired: 'ลิงก์หมดอายุ',
      quote_missing: 'ไม่พบใบเสนอราคา',
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
            <h1 className="text-xl font-bold">{titleMap[error.code] || 'เกิดข้อผิดพลาด'}</h1>
            <p className="text-muted-foreground text-sm">{error.message}</p>
            {error.expired_at && (
              <p className="text-xs text-muted-foreground">
                หมดอายุเมื่อ {format(new Date(error.expired_at), 'd MMM yyyy HH:mm', { locale: th })}
              </p>
            )}
            <p className="text-xs text-muted-foreground pt-3">
              กรุณาติดต่อผู้ที่ส่งลิงก์มาให้เพื่อขอลิงก์ใหม่
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const { quote, revision, company, salePerson, bankAccounts, shareInfo } = data;

  // Build a fallback revision if missing
  const safeRevision = revision || {
    id: 'fallback',
    revision_number: 1,
    products: quote.products || [],
    free_items: quote.free_items || [],
    subtotal: quote.subtotal || 0,
    discount_percent: quote.discount_percent,
    discount_amount: quote.discount_amount,
    vat_percent: quote.vat_percent || 7,
    vat_amount: quote.vat_amount || 0,
    grand_total: quote.grand_total || 0,
    valid_until: quote.valid_until,
    created_at: quote.created_at,
    created_by_name: salePerson?.full_name || '',
    customer_message: null,
  };

  return (
    <>
      <Helmet>
        <title>ใบเสนอราคา {quote.quote_number}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-muted/30">
        {/* Top bar */}
        <div className="bg-background border-b sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold">ใบเสนอราคา {quote.quote_number}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> หมดอายุ {format(new Date(shareInfo.expires_at), 'd MMM yyyy HH:mm', { locale: th })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {shareInfo.view_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" /> {shareInfo.download_count}
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={handleDownload} disabled={downloading}>
              {downloading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />กำลังสร้าง PDF...</>
              ) : (
                <><Download className="w-4 h-4 mr-2" />ดาวน์โหลด PDF</>
              )}
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-4">
          <div className="bg-white shadow-lg">
            {company ? (
              <QuotePDFTemplate
                quote={quote}
                revision={mergeRevisionWithQuote(safeRevision, quote)}
                companyInfo={{
                  name_th: company.name_th,
                  name_en: company.name_en,
                  address_th: company.address_th,
                  address_en: company.address_en,
                  phone: company.phone,
                  fax: company.fax,
                  email: company.email,
                  website: company.website,
                  tax_id: company.tax_id,
                  branch_type: company.branch_type,
                  branch_code: company.branch_code,
                  branch_name: company.branch_name,
                  logo_url: company.logo_url,
                }}
                salePerson={salePerson}
                bankAccounts={bankAccounts || []}
              />
            ) : (
              <div className="p-8 text-center text-muted-foreground">ไม่พบข้อมูลบริษัท</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

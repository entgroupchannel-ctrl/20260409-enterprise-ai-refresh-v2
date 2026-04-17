import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Download, AlertCircle, Eye, Clock, Receipt } from 'lucide-react';
import ReceiptPDFTemplate from '@/components/admin/ReceiptPDFTemplate';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function SharedReceiptPage() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const autoDownload = searchParams.get('download') === '1';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ code: string } | null>(null);
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
      const { data: result, error: rpcError } = await (supabase as any).rpc('get_shared_receipt', {
        p_token: token,
        p_action: action,
      });
      if (rpcError) throw rpcError;
      if (result?.error) {
        setError({ code: result.error });
        setData(null);
      } else {
        setData(result);
        setError(null);
      }
    } catch (e: any) {
      setError({ code: 'unknown' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await (supabase as any).rpc('get_shared_receipt', { p_token: token, p_action: 'download' });
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('receipt-pdf-template');
      if (!element) return;
      await html2pdf().set({
        margin: [15, 15, 20, 15],
        filename: `${data.receipt.receipt_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }).from(element).save();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

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
          <p className="text-muted-foreground">กำลังโหลดใบเสร็จ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const titleMap: Record<string, string> = {
      invalid_token: 'ไม่พบลิงก์',
      revoked: 'ลิงก์ถูกยกเลิก',
      expired: 'ลิงก์หมดอายุ',
      receipt_not_found: 'ไม่พบใบเสร็จ',
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
            <h1 className="text-xl font-bold">{titleMap[error.code] || 'เกิดข้อผิดพลาด'}</h1>
            <p className="text-xs text-muted-foreground pt-3">
              กรุณาติดต่อผู้ที่ส่งลิงก์มาให้เพื่อขอลิงก์ใหม่
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;
  const { receipt, items, company, invoiceNumber, taxInvoiceNumber, link } = data;

  // Compute totals from items (fallback if not provided)
  const subtotal = (items || []).reduce((s: number, i: any) => s + Number(i.line_total || 0), 0);

  return (
    <>
      <Helmet>
        <title>ใบเสร็จรับเงิน {receipt.receipt_number}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-muted/30">
        <div className="bg-background border-b sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold">ใบเสร็จรับเงิน {receipt.receipt_number}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> หมดอายุ {format(new Date(link.expires_at), 'd MMM yyyy HH:mm', { locale: th })}
                  </span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {link.view_count}</span>
                  <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {link.download_count}</span>
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
          <div id="receipt-pdf-template" className="bg-white shadow-lg">
            {company ? (
              <ReceiptPDFTemplate
                receipt={receipt}
                items={items || []}
                subtotal={subtotal}
                companyInfo={{
                  name_th: company.name_th,
                  name_en: company.name_en,
                  address_th: company.address_th,
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
                invoiceNumber={invoiceNumber}
                taxInvoiceNumber={taxInvoiceNumber}
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

// src/components/admin/InvoicePrintPreviewDialog.tsx
import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, Loader2, AlertCircle } from 'lucide-react';
import InvoicePDFTemplate from './InvoicePDFTemplate';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { supabase } from '@/integrations/supabase/client';

interface InvoicePrintPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  items: any[];
}

export default function InvoicePrintPreviewDialog({
  open,
  onOpenChange,
  invoice,
  items,
}: InvoicePrintPreviewDialogProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { settings: companySettings, loading: companyLoading } = useCompanySettings();
  const [salePerson, setSalePerson] = useState<any>(null);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [quoteNumber, setQuoteNumber] = useState<string | undefined>();
  const [loadingExtra, setLoadingExtra] = useState(true);

  useEffect(() => {
    if (!open) return;
    loadExtraData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, invoice?.created_by, invoice?.quote_id, companySettings?.id]);

  const loadExtraData = async () => {
    setLoadingExtra(true);
    try {
      if (invoice?.created_by) {
        const { data: userData } = await (supabase as any).from('users')
          .select('full_name, position, signature_url, show_signature_on_quotes')
          .eq('id', invoice.created_by)
          .maybeSingle();
        setSalePerson(userData);
      }

      if (companySettings?.id) {
        const { data: bankData } = await (supabase as any)
          .from('company_bank_accounts')
          .select('bank_name, account_number, account_name, branch, account_type, is_default')
          .eq('company_id', companySettings.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        setBankAccounts(bankData || []);
      }

      if (invoice?.quote_id) {
        const { data: quoteData } = await (supabase as any)
          .from('quote_requests')
          .select('quote_number')
          .eq('id', invoice.quote_id)
          .maybeSingle();
        if (quoteData?.quote_number) setQuoteNumber(quoteData.quote_number);
      }
    } catch (e) {
      console.error('loadExtraData error:', e);
    } finally {
      setLoadingExtra(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0 }).format(amount);

  const handlePrint = () => {
    setIsPrinting(true);

    const printContent = document.getElementById('invoice-pdf-template');
    if (!printContent) {
      setIsPrinting(false);
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setIsPrinting(false);
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invoice.invoice_number}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            @media print { body { margin: 0; padding: 0; } }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #2563eb; color: white; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        setIsPrinting(false);
      };
    };
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('invoice-pdf-template');
      if (!element) return;

      const opt = {
        margin: 10,
        filename: `${invoice.invoice_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const isLoading = companyLoading || loadingExtra;

  const companyInfo = companySettings ? {
    name_th: companySettings.name_th || 'บริษัท อี เอ็น ที กรุ๊ป จำกัด',
    name_en: companySettings.name_en,
    address_th: companySettings.address_th,
    address_en: companySettings.address_en,
    phone: companySettings.phone,
    fax: companySettings.fax,
    email: companySettings.email,
    website: companySettings.website,
    tax_id: companySettings.tax_id,
    branch_type: companySettings.branch_type,
    branch_code: companySettings.branch_code,
    branch_name: companySettings.branch_name,
    logo_url: companySettings.logo_url,
  } : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-primary" />
                พิมพ์ใบวางบิล
              </DialogTitle>
              <DialogDescription>
                {invoice.invoice_number}
                {invoice.grand_total ? ` • ฿${formatCurrency(invoice.grand_total)}` : ''}
              </DialogDescription>
            </div>
            <div className="flex gap-2 pr-8">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={isPrinting || isLoading || !companySettings}
              >
                <Printer className="w-4 h-4 mr-2" />
                {isPrinting ? 'กำลังพิมพ์...' : 'พิมพ์'}
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isDownloading || isLoading || !companySettings}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        ) : !companyInfo ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm text-muted-foreground">
              ไม่พบข้อมูลบริษัท — กรุณาตั้งค่าในหน้า /admin/settings/company
            </p>
          </div>
        ) : (
          <div className="border rounded">
            <InvoicePDFTemplate
              invoice={invoice}
              items={items}
              companyInfo={companyInfo}
              salePerson={salePerson}
              bankAccounts={bankAccounts}
              quoteNumber={quoteNumber}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

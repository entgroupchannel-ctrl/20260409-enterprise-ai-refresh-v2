import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, Loader2, AlertCircle } from 'lucide-react';
import TaxInvoicePDFTemplate from './TaxInvoicePDFTemplate';
import { useCompanySettings } from '@/hooks/useCompanySettings';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxInvoice: any;
  items: any[];
  invoiceNumber?: string;
  /** When true (customer view), force copyType=original and disable the "สำเนา" button. */
  customerMode?: boolean;
}

export default function TaxInvoicePrintPreviewDialog({
  open, onOpenChange, taxInvoice, items, invoiceNumber, customerMode = false,
}: Props) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copyType, setCopyType] = useState<'original' | 'copy'>('original');

  const { settings: companySettings, loading: companyLoading } = useCompanySettings();

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0 }).format(n);

  const handlePrint = async () => {
    setIsPrinting(true);
    const printContent = document.getElementById('tax-invoice-pdf-template');
    if (!printContent) { setIsPrinting(false); return; }

    const { openPrintPreview } = await import('@/lib/print-helper');
    openPrintPreview({
      element: printContent,
      title: taxInvoice.tax_invoice_number,
      onDone: () => setIsPrinting(false),
    });
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { generatePDFWithHeaderFooter } = await import('@/lib/pdf-helper');
      const element = document.getElementById('tax-invoice-pdf-template');
      if (!element) return;

      await generatePDFWithHeaderFooter(element, {
        filename: `${taxInvoice.tax_invoice_number}.pdf`,
        headerLeft: companySettings?.name_th || 'ENT Group',
        headerRight: `ใบกำกับภาษี ${taxInvoice.tax_invoice_number}`,
        footerCenter: 'เอกสารนี้ออกโดยระบบอัตโนมัติ',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const companyInfo = companySettings ? {
    name_th: companySettings.name_th || 'บริษัท อีเอ็นที กรุ๊ป จำกัด',
    name_en: companySettings.name_en,
    address_th: companySettings.address_th,
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
                พิมพ์ใบกำกับภาษี
              </DialogTitle>
              <DialogDescription>
                {taxInvoice.tax_invoice_number}
                {taxInvoice.grand_total ? ` • ฿${formatCurrency(taxInvoice.grand_total)}` : ''}
              </DialogDescription>
            </div>
            <div className="flex gap-2 items-center pr-8">
              {/* Copy type toggle */}
              <div className="flex border rounded overflow-hidden text-xs">
                <button
                  className={`px-3 py-1.5 ${copyType === 'original' ? 'bg-purple-600 text-white' : 'bg-muted text-muted-foreground'}`}
                  onClick={() => setCopyType('original')}
                >
                  ต้นฉบับ
                </button>
                <button
                  type="button"
                  disabled={customerMode}
                  aria-disabled={customerMode}
                  title={customerMode ? 'สำเนาสำหรับเจ้าหน้าที่เท่านั้น' : undefined}
                  className={`px-3 py-1.5 ${copyType === 'copy' && !customerMode ? 'bg-gray-600 text-white' : 'bg-muted text-muted-foreground'} ${customerMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => { if (!customerMode) setCopyType('copy'); }}
                >
                  สำเนา
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={handlePrint} disabled={isPrinting || companyLoading || !companySettings}>
                <Printer className="w-4 h-4 mr-2" />
                {isPrinting ? 'กำลังพิมพ์...' : 'พิมพ์'}
              </Button>
              <Button size="sm" onClick={handleDownloadPDF} disabled={isDownloading || companyLoading || !companySettings}>
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {companyLoading ? (
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
            <TaxInvoicePDFTemplate
              taxInvoice={taxInvoice}
              items={items}
              companyInfo={companyInfo}
              invoiceNumber={invoiceNumber}
              copyType={copyType}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

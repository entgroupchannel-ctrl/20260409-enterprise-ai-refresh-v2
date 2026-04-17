import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, Loader2, AlertCircle } from 'lucide-react';
import CreditNotePDFTemplate from './CreditNotePDFTemplate';
import { useCompanySettings } from '@/hooks/useCompanySettings';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditNote: any;
  items: any[];
  originalTaxInvoiceNumber?: string;
}

export default function CreditNotePrintPreviewDialog({
  open,
  onOpenChange,
  creditNote,
  items,
  originalTaxInvoiceNumber,
}: Props) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { settings: companySettings, loading: companyLoading } = useCompanySettings();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0 }).format(amount);

  const handlePrint = () => {
    setIsPrinting(true);
    const printContent = document.getElementById('credit-note-pdf-template');
    if (!printContent) { setIsPrinting(false); return; }

    const printWindow = window.open('', '_blank');
    if (!printWindow) { setIsPrinting(false); return; }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${creditNote.credit_note_number}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            @media print { body { margin: 0; padding: 0; } }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #dc2626; color: white; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
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
      const { generatePDFWithHeaderFooter } = await import('@/lib/pdf-helper');
      const element = document.getElementById('credit-note-pdf-template');
      if (!element) return;

      await generatePDFWithHeaderFooter(element, {
        filename: `${creditNote.credit_note_number}.pdf`,
        headerLeft: companySettings?.name_th || 'ENT Group',
        headerRight: `ใบลดหนี้ ${creditNote.credit_note_number}`,
        footerCenter: 'เอกสารนี้ออกโดยระบบอัตโนมัติ',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const companyInfo = companySettings ? {
    name_th: companySettings.name_th || 'บริษัท อี เอ็น ที กรุ๊ป จำกัด',
    name_en: companySettings.name_en,
    address_th: companySettings.address_th,
    phone: companySettings.phone,
    fax: companySettings.fax,
    email: companySettings.email,
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
                <Printer className="w-5 h-5 text-red-600" />
                พิมพ์ใบลดหนี้
              </DialogTitle>
              <DialogDescription>
                {creditNote.credit_note_number}
                {creditNote.grand_total ? ` • -฿${formatCurrency(creditNote.grand_total)}` : ''}
              </DialogDescription>
            </div>
            <div className="flex gap-2 pr-8">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={isPrinting || companyLoading || !companySettings}
              >
                <Printer className="w-4 h-4 mr-2" />
                {isPrinting ? 'กำลังพิมพ์...' : 'พิมพ์'}
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isDownloading || companyLoading || !companySettings}
              >
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
            <CreditNotePDFTemplate
              creditNote={creditNote}
              items={items}
              companyInfo={companyInfo}
              originalTaxInvoiceNumber={originalTaxInvoiceNumber}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// src/components/admin/PrintPreviewDialog.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, X } from 'lucide-react';
import QuotePDFTemplate from './QuotePDFTemplate';

interface PrintPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteData: any;
  onPrint?: () => void;
  onDownloadPDF?: () => void;
}

export default function PrintPreviewDialog({
  open,
  onOpenChange,
  quoteData,
  onPrint,
  onDownloadPDF,
}: PrintPreviewDialogProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    
    // Get the PDF template element
    const printContent = document.getElementById('quote-pdf-template');
    if (!printContent) return;

    // Create new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Write content to new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>พิมพ์ใบเสนอราคา - ${quoteData.quote_number}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #2563eb;
              color: white;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        setIsPrinting(false);
      };
    };

    if (onPrint) onPrint();
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      // Dynamic import html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.getElementById('quote-pdf-template');
      if (!element) return;

      const opt = {
        margin: 10,
        filename: `${quoteData.quote_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      await html2pdf().set(opt).from(element).save();
      
      if (onDownloadPDF) onDownloadPDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>ตัวอย่างใบเสนอราคา</DialogTitle>
              <DialogDescription>
                {quoteData.quote_number} - {quoteData.customer_name}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={isPrinting}
              >
                <Printer className="w-4 h-4 mr-2" />
                {isPrinting ? 'กำลังพิมพ์...' : 'พิมพ์'}
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* PDF Preview */}
        <div className="border rounded-lg overflow-hidden bg-gray-100 p-4">
          <QuotePDFTemplate data={quoteData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

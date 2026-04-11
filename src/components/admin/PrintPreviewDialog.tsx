// src/components/admin/PrintPreviewDialog.tsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, X, Loader2, AlertCircle } from 'lucide-react';
import QuotePDFTemplate from './QuotePDFTemplate';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { supabase } from '@/integrations/supabase/client';

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

  // Load company + bank + sale person
  const { settings: companySettings, loading: companyLoading } = useCompanySettings();
  const [salePerson, setSalePerson] = useState<any>(null);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(true);

  useEffect(() => {
    if (!open) return;
    loadExtraData();
  }, [open, quoteData?.created_by, companySettings?.id]);

  const loadExtraData = async () => {
    setLoadingExtra(true);
    try {
      // 1. Load sale person from quote.created_by
      if (quoteData?.created_by) {
        const { data: userData } = await (supabase as any).from('users')
          .select('full_name, position, signature_url, show_signature_on_quotes')
          .eq('id', quoteData.created_by)
          .maybeSingle();
        setSalePerson(userData);
      }

      // 2. Load bank accounts (only active)
      if (companySettings?.id) {
        const { data: bankData } = await (supabase as any)
          .from('company_bank_accounts')
          .select('bank_name, account_number, account_name, branch, account_type, is_default')
          .eq('company_id', companySettings.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        setBankAccounts(bankData || []);
      }
    } catch (e) {
      console.error('loadExtraData error:', e);
    } finally {
      setLoadingExtra(false);
    }
  };

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

  const isLoading = companyLoading || loadingExtra;

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
                {isDownloading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* PDF Preview */}
        <div className="border rounded-lg overflow-hidden bg-gray-100 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">กำลังโหลดข้อมูลบริษัท...</p>
              </div>
            </div>
          ) : !companySettings ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-3" />
              <p className="font-semibold mb-1">ไม่พบข้อมูลบริษัท</p>
              <p className="text-sm text-muted-foreground mb-3">
                กรุณาตั้งค่าข้อมูลบริษัทก่อน
              </p>
              <Button onClick={() => window.location.href = '/admin/settings/company'}>
                ไปที่ตั้งค่าบริษัท
              </Button>
            </div>
          ) : (
            <QuotePDFTemplate 
              data={quoteData}
              companyInfo={{
                name_th: companySettings.name_th,
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
              }}
              salePerson={salePerson}
              bankAccounts={bankAccounts}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

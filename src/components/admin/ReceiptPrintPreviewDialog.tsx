import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, Loader2, AlertCircle } from 'lucide-react';
import ReceiptPDFTemplate from './ReceiptPDFTemplate';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: any;
  invoiceNumber?: string;
  taxInvoiceNumber?: string;
}

export default function ReceiptPrintPreviewDialog({
  open, onOpenChange, receipt, invoiceNumber, taxInvoiceNumber,
}: Props) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copyType, setCopyType] = useState<'original' | 'copy'>('original');
  const [items, setItems] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount_amount: 0,
    discount_percent: 0,
    vat_amount: 0,
    vat_percent: 7,
    withholding_tax_amount: 0,
    withholding_tax_percent: 3,
  });
  const [loadingItems, setLoadingItems] = useState(false);

  const { settings: companySettings, loading: companyLoading } = useCompanySettings();

  useEffect(() => {
    if (!open || !receipt) return;

    const loadItems = async () => {
      setLoadingItems(true);
      try {
        // Priority 1: tax_invoice_items
        if (receipt.tax_invoice_id) {
          const [txRes, txItemsRes] = await Promise.all([
            (supabase as any)
              .from('tax_invoices')
              .select('subtotal, discount_amount, discount_percent, vat_amount, vat_percent, withholding_tax_amount, withholding_tax_percent, grand_total')
              .eq('id', receipt.tax_invoice_id)
              .maybeSingle(),
            (supabase as any)
              .from('tax_invoice_items')
              .select('*')
              .eq('tax_invoice_id', receipt.tax_invoice_id)
              .order('display_order'),
          ]);

          if (txRes.data && txItemsRes.data) {
            const sourceTotal = Number(txRes.data.grand_total || 0);
            const ratio = sourceTotal > 0 ? receipt.amount / sourceTotal : 1;

            setItems(
              (txItemsRes.data || []).map((it: any) => ({
                ...it,
                line_total: Number(it.line_total || 0) * ratio,
                discount_amount: Number(it.discount_amount || 0) * ratio,
              }))
            );
            setTotals({
              subtotal: Number(txRes.data.subtotal || 0) * ratio,
              discount_amount: Number(txRes.data.discount_amount || 0) * ratio,
              discount_percent: Number(txRes.data.discount_percent || 0),
              vat_amount: Number(txRes.data.vat_amount || 0) * ratio,
              vat_percent: Number(txRes.data.vat_percent || 7),
              withholding_tax_amount: Number(txRes.data.withholding_tax_amount || 0) * ratio,
              withholding_tax_percent: Number(txRes.data.withholding_tax_percent || 3),
            });
            return;
          }
        }

        // Priority 2: invoice_items
        if (receipt.invoice_id) {
          const [invRes, invItemsRes] = await Promise.all([
            (supabase as any)
              .from('invoices')
              .select('subtotal, discount_amount, discount_percent, vat_amount, vat_percent, withholding_tax_amount, withholding_tax_percent, grand_total')
              .eq('id', receipt.invoice_id)
              .maybeSingle(),
            (supabase as any)
              .from('invoice_items')
              .select('*')
              .eq('invoice_id', receipt.invoice_id)
              .order('display_order'),
          ]);

          if (invRes.data && invItemsRes.data) {
            const sourceTotal = Number(invRes.data.grand_total || 0);
            const ratio = sourceTotal > 0 ? receipt.amount / sourceTotal : 1;

            setItems(
              (invItemsRes.data || []).map((it: any) => ({
                ...it,
                line_total: Number(it.line_total || 0) * ratio,
                discount_amount: Number(it.discount_amount || 0) * ratio,
              }))
            );
            setTotals({
              subtotal: Number(invRes.data.subtotal || 0) * ratio,
              discount_amount: Number(invRes.data.discount_amount || 0) * ratio,
              discount_percent: Number(invRes.data.discount_percent || 0),
              vat_amount: Number(invRes.data.vat_amount || 0) * ratio,
              vat_percent: Number(invRes.data.vat_percent || 7),
              withholding_tax_amount: Number(invRes.data.withholding_tax_amount || 0) * ratio,
              withholding_tax_percent: Number(invRes.data.withholding_tax_percent || 3),
            });
            return;
          }
        }

        // Fallback
        setItems([]);
        setTotals({
          subtotal: receipt.amount,
          discount_amount: 0,
          discount_percent: 0,
          vat_amount: 0,
          vat_percent: 7,
          withholding_tax_amount: 0,
          withholding_tax_percent: 3,
        });
      } catch (e) {
        console.error('Failed to load receipt items:', e);
        setItems([]);
      } finally {
        setLoadingItems(false);
      }
    };

    loadItems();
  }, [open, receipt?.id, receipt?.tax_invoice_id, receipt?.invoice_id]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0 }).format(n);

  const handlePrint = async () => {
    setIsPrinting(true);
    const printContent = document.getElementById('receipt-pdf-template');
    if (!printContent) { setIsPrinting(false); return; }

    const { openPrintPreview } = await import('@/lib/print-helper');
    openPrintPreview({
      element: printContent,
      title: receipt.receipt_number,
      onDone: () => setIsPrinting(false),
    });
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { generatePDFWithHeaderFooter } = await import('@/lib/pdf-helper');
      const original = document.getElementById('receipt-pdf-template');
      if (!original) return;

      // Clone off-screen with print-safe sizing so the header (e.g. "ใบเสร็จรับเงิน",
      // เลขที่เอกสาร) is not clipped by html2pdf's page margins.
      const clone = original.cloneNode(true) as HTMLElement;
      clone.id = 'receipt-pdf-template-print';
      // A4 printable width = 210mm - 2*12mm side margin = 186mm
      clone.style.width = '186mm';
      clone.style.minHeight = 'auto';
      clone.style.padding = '0';
      clone.style.margin = '0';
      clone.style.boxSizing = 'border-box';

      const holder = document.createElement('div');
      holder.style.position = 'fixed';
      holder.style.left = '-10000px';
      holder.style.top = '0';
      holder.style.background = '#fff';
      holder.appendChild(clone);
      document.body.appendChild(holder);

      try {
        await generatePDFWithHeaderFooter(clone, {
          filename: `${receipt.receipt_number}.pdf`,
          headerLeft: companySettings?.name_th || 'ENT Group',
          headerRight: `Receipt ${receipt.receipt_number}`,
          footerCenter: 'เอกสารนี้ออกโดยระบบอัตโนมัติ',
          bottomMargin: 28,
        });
      } finally {
        document.body.removeChild(holder);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
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

  if (!receipt) return null;

  const isLoading = companyLoading || loadingItems;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-primary" />
                พิมพ์ใบเสร็จรับเงิน
              </DialogTitle>
              <DialogDescription>
                {receipt.receipt_number}
                {receipt.amount ? ` • ฿${formatCurrency(receipt.amount)}` : ''}
              </DialogDescription>
            </div>
            <div className="flex gap-2 items-center pr-8">
              <div className="flex border rounded overflow-hidden text-xs">
                <button
                  className={`px-3 py-1.5 ${copyType === 'original' ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'}`}
                  onClick={() => setCopyType('original')}
                >
                  ต้นฉบับ
                </button>
                <button
                  className={`px-3 py-1.5 ${copyType === 'copy' ? 'bg-gray-600 text-white' : 'bg-muted text-muted-foreground'}`}
                  onClick={() => setCopyType('copy')}
                >
                  สำเนา
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={handlePrint} disabled={isPrinting || isLoading || !companySettings}>
                <Printer className="w-4 h-4 mr-2" />
                {isPrinting ? 'กำลังพิมพ์...' : 'พิมพ์'}
              </Button>
              <Button size="sm" onClick={handleDownloadPDF} disabled={isDownloading || isLoading || !companySettings}>
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">กำลังโหลด...</p>
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
            <ReceiptPDFTemplate
              receipt={receipt}
              items={items}
              subtotal={totals.subtotal}
              discount_amount={totals.discount_amount}
              discount_percent={totals.discount_percent}
              vat_amount={totals.vat_amount}
              vat_percent={totals.vat_percent}
              withholding_tax_amount={totals.withholding_tax_amount}
              withholding_tax_percent={totals.withholding_tax_percent}
              companyInfo={companyInfo}
              invoiceNumber={invoiceNumber}
              taxInvoiceNumber={taxInvoiceNumber}
              copyType={copyType}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

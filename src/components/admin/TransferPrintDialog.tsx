import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, Loader2, AlertCircle } from 'lucide-react';
import TransferPrintTemplate from './TransferPrintTemplate';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { supabase } from '@/integrations/supabase/client';

const fmt = (n: number | null) =>
  n != null ? n.toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '';

interface TransferPrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transferId: string;
  poMap?: Record<string, string>;
  piMap?: Record<string, string>;
}

export default function TransferPrintDialog({
  open, onOpenChange, transferId, poMap = {}, piMap = {},
}: TransferPrintDialogProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [transfer, setTransfer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { settings: company, loading: companyLoading } = useCompanySettings();

  useEffect(() => {
    if (!open || !transferId) return;
    setLoading(true);
    supabase.from('international_transfer_requests')
      .select('*')
      .eq('id', transferId)
      .single()
      .then(({ data }) => { setTransfer(data); setLoading(false); });
  }, [open, transferId]);

  const poNumbers = (transfer?.purchase_order_ids || []).map((id: string) => poMap[id] || id.slice(0, 8));
  const piNumbers = (transfer?.purchase_order_ids || []).map((id: string) => piMap[id] || '');

  const handlePrint = () => {
    setIsPrinting(true);
    const el = document.getElementById('transfer-print-template');
    if (!el) return;

    const w = window.open('', '_blank');
    if (!w) return;

    w.document.write(`<!DOCTYPE html><html><head>
      <title>${transfer?.transfer_number || 'Transfer'}</title>
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        @media print { body { margin: 0; } @page { size: A4; margin: 10mm; } }
      </style>
    </head><body>${el.innerHTML}</body></html>`);
    w.document.close();
    w.onload = () => {
      w.print();
      w.onafterprint = () => { w.close(); setIsPrinting(false); };
    };
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const el = document.getElementById('transfer-print-template');
      if (!el) return;

      await html2pdf().set({
        margin: 10,
        filename: `${transfer?.transfer_number || 'Transfer'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(el).save();
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const isLoading = loading || companyLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-primary" />
                พิมพ์ฟอร์มโอนเงินต่างประเทศ
              </DialogTitle>
              <DialogDescription>
                {transfer?.transfer_number}
                {transfer?.amount ? ` • ${transfer.currency} ${fmt(transfer.amount)}` : ''}
              </DialogDescription>
            </div>
            <div className="flex gap-2 pr-8">
              <Button variant="outline" size="sm" onClick={handlePrint} disabled={isPrinting || isLoading}>
                <Printer className="w-4 h-4 mr-2" />
                {isPrinting ? 'กำลังพิมพ์...' : 'พิมพ์'}
              </Button>
              <Button size="sm" onClick={handleDownloadPDF} disabled={isDownloading || isLoading}>
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="border rounded-lg overflow-hidden bg-gray-100 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          ) : !transfer ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-3" />
              <p className="font-semibold">ไม่พบข้อมูลคำขอโอนเงิน</p>
            </div>
          ) : (
            <TransferPrintTemplate
              transfer={transfer}
              poNumbers={poNumbers}
              piNumbers={piNumbers}
              companyName={company?.name_th || company?.name_en || undefined}
              companyAddress={company?.address_th || company?.address_en || undefined}
              companyPhone={company?.phone || undefined}
              companyEmail={company?.email || undefined}
              companyTaxId={company?.tax_id || undefined}
              logoUrl={company?.logo_url || undefined}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

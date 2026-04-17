import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreVertical, Eye, Printer, Copy, Trash2, FileMinus, Share2,
} from 'lucide-react';

interface Props {
  taxInvoiceId: string;
  taxInvoiceNumber: string;
  status: string;
  onDelete?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  onCreateCreditNote?: () => void;
}

export default function TaxInvoiceActionsMenu({
  taxInvoiceId,
  taxInvoiceNumber,
  status,
  onDelete,
  onPrint,
  onShare,
  onCreateCreditNote,
}: Props) {
  const navigate = useNavigate();

  const handleView = () => navigate(`/admin/tax-invoices/${taxInvoiceId}`);

  const handlePrint = () => {
    if (onPrint) onPrint();
    else navigate(`/admin/tax-invoices/${taxInvoiceId}?action=print`);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(taxInvoiceNumber);
  };

  const canDelete = status !== 'paid';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="w-4 h-4 mr-2" />
          ดู
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          พิมพ์ / PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyNumber}>
          <Copy className="w-4 h-4 mr-2" />
          คัดลอกเลขที่
        </DropdownMenuItem>

        {onShare && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              แชร์ลิงก์ให้ลูกค้า
            </DropdownMenuItem>
          </>
        )}

        {status !== 'cancelled' && onCreateCreditNote && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onCreateCreditNote}>
              <FileMinus className="w-4 h-4 mr-2" />
              สร้างใบลดหนี้
            </DropdownMenuItem>
          </>
        )}

        {canDelete && onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600 focus:text-red-700 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              ย้ายถังขยะ
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

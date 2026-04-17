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
  MoreVertical, Eye, Printer, Copy, Trash2, Download, Share2,
} from 'lucide-react';

interface Props {
  invoiceId: string;
  invoiceNumber: string;
  status: string;
  onDelete?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function InvoiceActionsMenu({
  invoiceId,
  invoiceNumber,
  status,
  onDelete,
  onPrint,
  onDownload,
  onShare,
}: Props) {
  const navigate = useNavigate();

  const handleView = () => navigate(`/admin/invoices/${invoiceId}`);

  const handlePrint = () => {
    if (onPrint) onPrint();
    else navigate(`/admin/invoices/${invoiceId}?action=print`);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(invoiceNumber);
  };

  const canDelete = status !== 'paid' && status !== 'partially_paid';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="w-4 h-4 mr-2" />
          ดู
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          พิมพ์ / PDF
        </DropdownMenuItem>
        {onDownload && (
          <DropdownMenuItem onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            ดาวน์โหลด
          </DropdownMenuItem>
        )}
        {onShare && (
          <DropdownMenuItem onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            แชร์ลิงก์ให้ลูกค้า
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleCopyNumber}>
          <Copy className="w-4 h-4 mr-2" />
          คัดลอกเลขที่
        </DropdownMenuItem>

        {canDelete && onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
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

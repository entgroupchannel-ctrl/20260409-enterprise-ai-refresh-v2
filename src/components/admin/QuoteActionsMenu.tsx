// src/components/admin/QuoteActionsMenu.tsx
import { useState } from 'react';
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
  MoreVertical,
  Edit,
  Printer,
  Share2,
  Copy,
  Eye,
  Trash2,
} from 'lucide-react';

interface QuoteActionsMenuProps {
  quoteId: string;
  quoteNumber: string;
  status: string;
  onDelete?: () => void;
  onPrint?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  onDuplicate?: () => void;
}

export default function QuoteActionsMenu({
  quoteId,
  quoteNumber,
  status,
  onDelete,
  onPrint,
  onCopy,
  onShare,
  onDuplicate,
}: QuoteActionsMenuProps) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/admin/quotes/${quoteId}`);
  };

  const handleEdit = () => {
    navigate(`/admin/quotes/${quoteId}?mode=edit`);
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      navigate(`/admin/quotes/${quoteId}?action=print`);
    }
  };

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else {
      // Copy quote number to clipboard
      navigator.clipboard.writeText(quoteNumber);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          แก้ไข
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          พิมพ์
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          แชร์ลิงก์ให้ลูกค้า
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          ดาวน์โหลด
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <Printer className="mr-2 h-4 w-4" />
          พิมพ์จำนวนซอง
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          สร้างซ้ำ
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          ลบ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

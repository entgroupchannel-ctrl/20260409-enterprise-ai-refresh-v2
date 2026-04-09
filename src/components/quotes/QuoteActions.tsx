import { Button } from "@/components/ui/button";
import { Send, Upload, Check, X, FileText, Eye } from "lucide-react";

interface QuoteActionsProps {
  status: string;
  role: "admin" | "customer";
  onSendQuote?: () => void;
  onUploadPO?: () => void;
  onApprovePO?: () => void;
  onReject?: () => void;
  onViewPDF?: () => void;
  onMarkComplete?: () => void;
  loading?: boolean;
}

const QuoteActions = ({
  status,
  role,
  onSendQuote,
  onUploadPO,
  onApprovePO,
  onReject,
  onViewPDF,
  onMarkComplete,
  loading = false,
}: QuoteActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Admin: Send quote */}
      {role === "admin" && status === "pending" && onSendQuote && (
        <Button onClick={onSendQuote} disabled={loading} size="sm">
          <Send className="w-4 h-4 mr-1.5" /> ส่งใบเสนอราคา
        </Button>
      )}

      {/* Customer: Upload PO */}
      {role === "customer" && status === "quote_sent" && onUploadPO && (
        <Button onClick={onUploadPO} disabled={loading} size="sm">
          <Upload className="w-4 h-4 mr-1.5" /> อัปโหลด PO
        </Button>
      )}

      {/* Admin: Approve/Reject PO */}
      {role === "admin" && status === "po_uploaded" && (
        <>
          {onApprovePO && (
            <Button onClick={onApprovePO} disabled={loading} size="sm" className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-1.5" /> อนุมัติ PO
            </Button>
          )}
          {onReject && (
            <Button onClick={onReject} disabled={loading} size="sm" variant="destructive">
              <X className="w-4 h-4 mr-1.5" /> ปฏิเสธ
            </Button>
          )}
        </>
      )}

      {/* Admin: Mark Complete */}
      {role === "admin" && status === "po_approved" && onMarkComplete && (
        <Button onClick={onMarkComplete} disabled={loading} size="sm">
          <Check className="w-4 h-4 mr-1.5" /> เสร็จสิ้น
        </Button>
      )}

      {/* View PDF */}
      {onViewPDF && (
        <Button onClick={onViewPDF} variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-1.5" /> ดู PDF
        </Button>
      )}
    </div>
  );
};

export default QuoteActions;

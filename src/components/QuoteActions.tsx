import { Download, Upload, Eye, CheckCircle, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuoteActionsProps {
  status: string;
  userRole: 'customer' | 'admin';
  onDownloadPDF?: () => void;
  onUploadPO?: () => void;
  onViewPO?: () => void;
  onApprovePO?: () => void;
  onRejectPO?: () => void;
  onViewSO?: () => void;
  onViewBL?: () => void;
  loading?: boolean;
}

const QuoteActions = ({
  status,
  userRole,
  onDownloadPDF,
  onUploadPO,
  onViewPO,
  onApprovePO,
  onRejectPO,
  onViewSO,
  onViewBL,
  loading = false,
}: QuoteActionsProps) => {
  
  if (userRole === 'customer') {
    switch (status) {
      case 'pending':
        return (
          <div className="text-sm text-muted-foreground">
            รอทีมงานตอบกลับ...
          </div>
        );
      
      case 'quote_sent':
        return (
          <div className="flex flex-wrap gap-2">
            {onDownloadPDF && (
              <Button variant="outline" size="sm" onClick={onDownloadPDF} className="gap-2">
                <Download size={14} />
                ดาวน์โหลด PDF
              </Button>
            )}
            {onUploadPO && (
              <Button size="sm" onClick={onUploadPO} className="gap-2" disabled={loading}>
                <Upload size={14} />
                อัปโหลด PO
              </Button>
            )}
          </div>
        );
      
      case 'po_uploaded':
        return (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
              ส่ง PO แล้ว กำลังรอตรวจสอบภายใน 24 ชั่วโมง
            </div>
            {onViewPO && (
              <Button variant="outline" size="sm" onClick={onViewPO} className="gap-2">
                <Eye size={14} />
                ดู PO ที่ส่ง
              </Button>
            )}
          </div>
        );
      
      case 'po_approved':
      case 'completed':
        return (
          <div className="space-y-2">
            <div className="text-sm text-green-600 font-medium flex items-center gap-2">
              <CheckCircle size={16} />
              PO ได้รับการอนุมัติแล้ว
            </div>
            <div className="flex flex-wrap gap-2">
              {onViewSO && (
                <Button variant="outline" size="sm" onClick={onViewSO} className="gap-2">
                  <FileText size={14} />
                  ดู Sales Order
                </Button>
              )}
              {onViewBL && (
                <Button variant="outline" size="sm" onClick={onViewBL} className="gap-2">
                  <FileText size={14} />
                  ดู Billing Note
                </Button>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  }
  
  if (userRole === 'admin') {
    switch (status) {
      case 'pending':
        return (
          <div className="text-sm text-muted-foreground">
            กำลังเตรียมใบเสนอราคา...
          </div>
        );
      
      case 'quote_sent':
        return (
          <div className="flex flex-wrap gap-2">
            {onDownloadPDF && (
              <Button variant="outline" size="sm" onClick={onDownloadPDF} className="gap-2">
                <Eye size={14} />
                ดู PDF
              </Button>
            )}
          </div>
        );
      
      case 'po_uploaded':
        return (
          <div className="flex flex-wrap gap-2">
            {onViewPO && (
              <Button variant="outline" size="sm" onClick={onViewPO} className="gap-2">
                <Eye size={14} />
                ดู PO
              </Button>
            )}
            {onApprovePO && (
              <Button 
                size="sm" 
                onClick={onApprovePO}
                className="gap-2 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                <CheckCircle size={14} />
                อนุมัติ PO
              </Button>
            )}
            {onRejectPO && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRejectPO}
                className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
                disabled={loading}
              >
                <XCircle size={14} />
                ปฏิเสธ
              </Button>
            )}
          </div>
        );
      
      case 'po_approved':
      case 'completed':
        return (
          <div className="space-y-2">
            <div className="text-sm text-green-600 font-medium flex items-center gap-2">
              <CheckCircle size={16} />
              อนุมัติแล้ว • สร้าง SO + BL เรียบร้อย
            </div>
            <div className="flex flex-wrap gap-2">
              {onViewSO && (
                <Button variant="outline" size="sm" onClick={onViewSO} className="gap-2">
                  <FileText size={14} />
                  ดู SO
                </Button>
              )}
              {onViewBL && (
                <Button variant="outline" size="sm" onClick={onViewBL} className="gap-2">
                  <FileText size={14} />
                  ดู BL
                </Button>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  }
  
  return null;
};

export default QuoteActions;
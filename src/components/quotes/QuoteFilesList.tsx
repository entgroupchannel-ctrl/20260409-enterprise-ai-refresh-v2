import { FileText, Download, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/quote-utils";

interface QuoteFile {
  id: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  category: string;
  uploaded_at: string;
}

interface QuoteFilesListProps {
  files: QuoteFile[];
  editable?: boolean;
  onDelete?: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  quote_pdf: "ใบเสนอราคา",
  customer_po: "ใบ PO",
  attachment: "เอกสารแนบ",
  reference: "เอกสารอ้างอิง",
};

const QuoteFilesList = ({ files, editable = false, onDelete }: QuoteFilesListProps) => {
  if (files.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">ยังไม่มีไฟล์</p>;
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-secondary/30 transition-colors">
          <FileText className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.file_name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{categoryLabels[file.category] || file.category}</span>
              <span>·</span>
              <span>{file.file_size ? `${(file.file_size / 1024).toFixed(0)} KB` : ""}</span>
              <span>·</span>
              <span>{formatRelativeTime(file.uploaded_at)}</span>
            </div>
          </div>
          <a href={file.file_url} target="_blank" rel="noopener noreferrer">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Download className="w-4 h-4" />
            </Button>
          </a>
          {editable && onDelete && (
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onDelete(file.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuoteFilesList;

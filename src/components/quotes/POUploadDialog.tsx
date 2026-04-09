import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, FileText, Loader2 } from 'lucide-react';

interface POUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  quoteNumber: string;
  customerName?: string;
  onSuccess: () => void;
}

export default function POUploadDialog({
  open,
  onOpenChange,
  quoteId,
  quoteNumber,
  customerName,
  onSuccess,
}: POUploadDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.size <= 10 * 1024 * 1024);
      if (newFiles.length < (e.target.files?.length || 0)) {
        toast({ title: 'ไฟล์บางรายการเกิน 10 MB', description: 'ไฟล์ที่เกินขนาดถูกข้ามไป', variant: 'destructive' });
      }
      setFiles((prev) => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({ title: 'กรุณาเลือกไฟล์', description: 'กรุณาเลือกไฟล์ PO อย่างน้อย 1 ไฟล์', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const uploadedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(i + 1);
        const fileExt = file.name.split('.').pop();
        const fileName = `${quoteNumber}-PO-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `po-files/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('quote-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('quote-files')
          .getPublicUrl(filePath);

        uploadedFiles.push({
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
        });
      }

      // Insert file records
      const { error: insertError } = await supabase
        .from('quote_files')
        .insert(
          uploadedFiles.map((f) => ({
            quote_id: quoteId,
            category: 'po' as string,
            ...f,
          }))
        );
      if (insertError) throw insertError;

      // Add message if notes provided
      if (notes.trim()) {
        await supabase.from('quote_messages').insert({
          quote_id: quoteId,
          sender_name: customerName || 'ลูกค้า',
          sender_role: 'customer',
          content: `📎 อัปโหลด PO (${uploadedFiles.length} ไฟล์)\n${notes}`,
          message_type: 'text',
        } as any);
      }

      toast({ title: 'อัปโหลดสำเร็จ', description: `อัปโหลด PO ${files.length} ไฟล์แล้ว` });
      setFiles([]);
      setNotes('');
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({ title: 'อัปโหลดไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      f => f.size <= 10 * 1024 * 1024 && /\.(pdf|png|jpe?g)$/i.test(f.name)
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>อัปโหลด PO (Purchase Order)</DialogTitle>
          <DialogDescription>
            อัปโหลด PO สำหรับ {quoteNumber} — รองรับหลายไฟล์พร้อมกัน
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          <div>
            <Label>ไฟล์ PO *</Label>
            <div
              className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-foreground font-medium mb-1">
                คลิกเพื่อเลือกไฟล์ หรือ ลากไฟล์มาวาง
              </p>
              <p className="text-xs text-muted-foreground">
                รองรับ PDF, PNG, JPG (สูงสุด 10 MB/ไฟล์)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>ไฟล์ที่เลือก ({files.length})</Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-8 h-8 text-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={uploading}>
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label>หมายเหตุเพิ่มเติม</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุข้อมูลเพิ่มเติม เช่น เลขที่ PO, วันที่ต้องการสินค้า..."
              rows={3}
              disabled={uploading}
              className="text-foreground bg-background border-border"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            ยกเลิก
          </Button>
          <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                อัปโหลด {uploadProgress}/{files.length} ไฟล์...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                อัปโหลด {files.length > 0 && `(${files.length} ไฟล์)`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

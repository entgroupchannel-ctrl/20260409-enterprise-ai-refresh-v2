import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileText, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface POUploadFormProps {
  quoteId: string;
  onSuccess?: () => void;
}

const POUploadForm = ({ quoteId, onSuccess }: POUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      // Upload to storage
      const filePath = `po/${quoteId}/${Date.now()}_${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from("quote-files")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("quote-files").getPublicUrl(fileData.path);

      // Create file record
      await (supabase.from as any)("quote_files").insert({
        quote_id: quoteId,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        category: "customer_po",
      });

      // Update quote status
      await (supabase.from as any)("quote_requests").update({ status: "po_uploaded" }).eq("id", quoteId);

      // Fetch quote info for email context
      const { data: quoteRow } = await (supabase.from as any)("quote_requests")
        .select("quote_number, customer_name, customer_email")
        .eq("id", quoteId)
        .maybeSingle();

      const origin = typeof window !== 'undefined' ? window.location.origin : '';

      // Notify admins (in-app + email) + send customer confirmation
      import('@/lib/notifications').then(({ notifyAdmins, notifyAdminsByEmail, sendQuoteStatusEmail }) => {
        notifyAdmins({
          type: 'po_uploaded',
          title: 'ลูกค้าอัปโหลด PO ใหม่',
          message: `${quoteRow?.customer_name ?? ''} — ${quoteRow?.quote_number ?? quoteId}`,
          priority: 'high',
          actionUrl: `/admin/quotes/${quoteId}`,
          actionLabel: 'ตรวจสอบ PO',
          linkType: 'quote',
          linkId: quoteId,
        });
        notifyAdminsByEmail({
          subject: `[PO] ลูกค้าอัปโหลด PO ใหม่ ${quoteRow?.quote_number ?? ''}`,
          status: 'po_uploaded',
          customerName: quoteRow?.customer_name,
          quoteNumber: quoteRow?.quote_number,
          viewUrl: `${origin}/admin/quotes/${quoteId}`,
        });
        if (quoteRow?.customer_email) {
          sendQuoteStatusEmail({
            recipientEmail: quoteRow.customer_email,
            customerName: quoteRow.customer_name,
            quoteNumber: quoteRow.quote_number,
            status: 'po_uploaded',
            viewUrl: `${origin}/my/quotes/${quoteId}`,
            note: 'เราได้รับ PO ของคุณแล้ว ทีมงานกำลังตรวจสอบและจะแจ้งผลภายในเร็ว ๆ นี้',
          });
        }
      });

      toast({ title: "อัปโหลด PO สำเร็จ" });
      setFile(null);
      onSuccess?.();
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">คลิกเพื่อเลือกไฟล์ PO</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG (สูงสุด 10MB)</p>
      </div>

      {file && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
          <FileText className="w-5 h-5 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setFile(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
        {uploading ? "กำลังอัปโหลด..." : "อัปโหลด PO"}
      </Button>
    </div>
  );
};

export default POUploadForm;

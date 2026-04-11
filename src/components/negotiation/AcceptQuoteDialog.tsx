import { useState, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle2, Gift, Upload, FileText, FileCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcceptQuoteDialogProps {
  quoteId: string;
  quoteNumber: string;
  grandTotal: number;
  freeItems?: any[];
  validUntil?: string | null;
  currentRevisionId?: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

export default function AcceptQuoteDialog({
  quoteId,
  quoteNumber,
  grandTotal,
  freeItems = [],
  validUntil,
  currentRevisionId,
  open,
  onClose,
  onSuccess,
}: AcceptQuoteDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirmMethod, setConfirmMethod] = useState<'later' | 'upload' | 'use_quote'>('later');
  const [poFiles, setPoFiles] = useState<File[]>([]);
  const [poNotes, setPoNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.size <= 10 * 1024 * 1024);
      if (newFiles.length < (e.target.files?.length || 0)) {
        toast({ title: 'ไฟล์บางรายการเกิน 10 MB', description: 'ไฟล์ที่เกินขนาดถูกข้ามไป', variant: 'destructive' });
      }
      setPoFiles(prev => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setPoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const uploadPOFiles = async () => {
    const uploaded: any[] = [];
    for (const file of poFiles) {
      const fileName = `po-files/${quoteId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('quote-files')
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('quote-files')
        .getPublicUrl(fileName);

      const { data: fileRecord } = await supabase.from('quote_files').insert({
        quote_id: quoteId,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: user?.id,
        category: 'po',
        description: poNotes || null,
      } as any).select().single();

      uploaded.push(fileRecord);
    }
    return uploaded;
  };

  const handleAccept = async () => {
    if (!accepted) {
      toast({ title: 'กรุณายอมรับเงื่อนไข', variant: 'destructive' });
      return;
    }

    setProcessing(true);
    try {
      // 1. Update revision
      if (currentRevisionId) {
        await (supabase.from as any)('quote_revisions')
          .update({ status: 'accepted', responded_at: new Date().toISOString() })
          .eq('id', currentRevisionId);

        await (supabase.from as any)('quote_revisions')
          .update({ status: 'superseded' })
          .eq('quote_id', quoteId)
          .eq('status', 'sent')
          .neq('id', currentRevisionId);
      }

      // 2. Path-specific actions
      let newQuoteStatus: string;
      let chatMessage: string;

      if (confirmMethod === 'upload' && poFiles.length > 0) {
        const uploadedFiles = await uploadPOFiles();
        newQuoteStatus = 'po_uploaded';
        chatMessage = `✅ ยอมรับใบเสนอราคาแล้ว + แนบ PO ${uploadedFiles.length} ไฟล์`;
      } else if (confirmMethod === 'use_quote') {
        newQuoteStatus = 'po_confirmed';
        chatMessage = '✅ ยอมรับใบเสนอราคา + ใช้ใบเสนอราคาเป็น PO (ลูกค้าไม่มีระบบ PO formal)';

        await supabase.from('quote_files').insert({
          quote_id: quoteId,
          file_name: `${quoteNumber}-AsPO.pdf`,
          file_url: '#virtual-po',
          file_type: 'application/pdf',
          file_size: 0,
          uploaded_by: user?.id,
          category: 'po_virtual',
        } as any);
      } else {
        newQuoteStatus = 'accepted';
        chatMessage = '✅ ยอมรับใบเสนอราคาแล้ว — รอแนบ PO ภายหลัง';
      }

      // 3. Update quote status
      await supabase.from('quote_requests').update({
        status: newQuoteStatus,
        accepted_at: new Date().toISOString(),
        accepted_by: user?.id || null,
        ...(newQuoteStatus === 'po_uploaded' && { po_uploaded_at: new Date().toISOString() }),
      } as any).eq('id', quoteId);

      // 4. Send chat message
      await supabase.from('quote_messages').insert({
        quote_id: quoteId,
        sender_name: user?.email || 'ลูกค้า',
        sender_role: 'customer',
        content: chatMessage + (poNotes ? `\n\n📝 หมายเหตุ: ${poNotes}` : ''),
        message_type: 'status_change',
      });

      toast({
        title: '✅ ยอมรับสำเร็จ',
        description:
          confirmMethod === 'upload' ? 'ส่ง PO ให้ทีมงานเรียบร้อย' :
          confirmMethod === 'use_quote' ? 'ใช้ใบเสนอราคาเป็น PO เรียบร้อย' :
          'รอแนบ PO ในหน้าถัดไป',
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const radioOption = (value: 'later' | 'upload' | 'use_quote', icon: React.ReactNode, title: string, desc: string) => (
    <button
      type="button"
      onClick={() => setConfirmMethod(value)}
      className={cn(
        'w-full text-left p-3 rounded-lg border-2 transition-all',
        confirmMethod === value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0',
          confirmMethod === value ? 'border-primary' : 'border-muted-foreground'
        )}>
          {confirmMethod === value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm flex items-center gap-2">{icon}{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </div>
    </button>
  );

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            ยืนยันยอมรับราคา
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {/* Quote summary */}
              <div className="bg-muted rounded-lg p-3 space-y-1">
                <p className="text-sm">ใบเสนอราคา <strong>{quoteNumber}</strong></p>
                <div className="flex justify-between font-bold text-foreground">
                  <span>ยอดรวมทั้งสิ้น</span>
                  <span className="text-primary text-lg">{formatCurrency(grandTotal)}</span>
                </div>
                {freeItems.length > 0 && (
                  <div className="flex items-center gap-1 text-amber-600 text-xs">
                    <Gift className="w-3 h-3" />
                    + ของแถม {freeItems.length} รายการ
                  </div>
                )}
                {validUntil && (
                  <p className="text-xs text-muted-foreground">⏱️ ใช้ได้ถึง: {validUntil}</p>
                )}
              </div>

              {/* Choose confirmation method */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">เลือกวิธีการยืนยัน:</Label>
                {radioOption('later', <CheckCircle2 className="w-4 h-4 text-green-600" />, 'ยอมรับก่อน — แนบ PO ภายหลัง', 'ระบบจะแจ้ง admin ว่าคุณยอมรับแล้ว และให้คุณแนบ PO ในภายหลัง')}
                {radioOption('upload', <Upload className="w-4 h-4 text-blue-600" />, 'แนบ PO ตอนนี้', 'ถ้าคุณมีไฟล์ PO พร้อมแล้ว — แนบทันทีเพื่อเร่งกระบวนการ')}
                {radioOption('use_quote', <FileCheck className="w-4 h-4 text-amber-600" />, 'ใช้ใบเสนอราคานี้เป็น PO', 'สำหรับลูกค้าที่ไม่มีระบบ PO formal — ระบบจะถือว่าใบเสนอราคานี้คือ PO')}
              </div>

              {/* File picker for upload path */}
              {confirmMethod === 'upload' && (
                <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    แนบไฟล์ PO
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-muted-foreground">ขนาดสูงสุด: 10 MB ต่อไฟล์</p>

                  {poFiles.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {poFiles.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-background rounded text-sm">
                          <FileText className="w-4 h-4 text-primary shrink-0" />
                          <span className="flex-1 truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                          <button onClick={() => removeFile(i)} className="text-destructive hover:bg-destructive/10 rounded p-0.5">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Textarea
                    placeholder="หมายเหตุเพิ่มเติม (optional)"
                    value={poNotes}
                    onChange={(e) => setPoNotes(e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              )}

              {/* Info for use_quote path */}
              {confirmMethod === 'use_quote' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm flex items-start gap-2">
                    <FileCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>
                      ระบบจะถือว่าใบเสนอราคา <strong>{quoteNumber}</strong> เป็นเอกสาร PO อย่างเป็นทางการ — admin จะดำเนินการต่อทันที
                    </span>
                  </p>
                </div>
              )}

              {/* Terms checkbox */}
              <div className="flex items-start gap-2 pt-2 border-t">
                <Checkbox
                  id="accept-terms"
                  checked={accepted}
                  onCheckedChange={(v) => setAccepted(!!v)}
                />
                <Label htmlFor="accept-terms" className="text-sm cursor-pointer leading-tight">
                  ยืนยันว่าข้าพเจ้าได้ตรวจสอบรายการสินค้า ราคา และเงื่อนไขแล้ว ยอมรับใบเสนอราคานี้ตามวิธีที่เลือกข้างต้น
                </Label>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAccept}
            disabled={processing || !accepted || (confirmMethod === 'upload' && poFiles.length === 0)}
          >
            {processing ? 'กำลังดำเนินการ...' :
              confirmMethod === 'upload' ? '✅ ยอมรับ + ส่ง PO' :
              confirmMethod === 'use_quote' ? '✅ ยืนยันใช้เป็น PO' :
              '✅ ยอมรับราคา'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

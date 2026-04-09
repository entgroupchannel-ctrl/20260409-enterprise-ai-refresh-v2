import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Edit,
  XCircle,
  AlertCircle,
  List,
  Trash2,
  Save,
  Send,
  Check,
  X,
  FileText,
  Download,
  Clock,
} from 'lucide-react';
import { formatShortDateTime } from '@/lib/format';

// ==========================================
// Security Constants & Helpers
// ==========================================
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];
const DANGEROUS_EXTENSIONS = ['.exe', '.sh', '.bat', '.cmd', '.scr', '.js', '.vbs', '.ps1'];
const MAX_REASON_LENGTH = 1000;

const validateFiles = (files: FileList | null): string | null => {
  if (!files || files.length === 0) return null;
  if (files.length > MAX_FILES) {
    return `สามารถอัปโหลดได้สูงสุด ${MAX_FILES} ไฟล์`;
  }
  for (const file of Array.from(files)) {
    if (file.size > MAX_FILE_SIZE) {
      return `ไฟล์ ${file.name} ใหญ่เกิน 10MB`;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `ไฟล์ ${file.name} ไม่ได้รับอนุญาต (รับเฉพาะ PDF, PNG, JPG)`;
    }
    const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (DANGEROUS_EXTENSIONS.includes(ext)) {
      return `ไม่อนุญาตไฟล์ประเภท ${ext}`;
    }
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `ไฟล์ ${file.name} นามสกุลไม่ถูกต้อง`;
    }
    if (file.name.includes('../') || file.name.includes('..\\')) {
      return 'ชื่อไฟล์ไม่ถูกต้อง';
    }
  }
  return null;
};

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .substring(0, MAX_REASON_LENGTH);
};

const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._\-\u0E00-\u0E7F]/g, '_')
    .replace(/\.+/g, '.')
    .substring(0, 100);
};

const generateSecurePath = (quoteId: string, originalName: string): string => {
  const sanitized = sanitizeFilename(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${quoteId}/${timestamp}_${random}_${sanitized}`;
};

// ==========================================
// Types
// ==========================================
interface POFile {
  id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  category: string;
  uploaded_at: string;
  uploaded_by: string | null;
}

interface ChangeRequest {
  id: string;
  request_type: string;
  status: string;
  requested_by: string;
  requested_by_role: string;
  request_reason: string | null;
  new_files: any[] | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
}

interface POActionsMenuProps {
  quoteId: string;
  quoteNumber: string;
  poFiles: POFile[];
  userRole: 'super_admin' | 'admin' | 'sales';
  userEmail: string;
  onRefresh: () => void;
}

export default function POActionsMenu({
  quoteId,
  quoteNumber,
  poFiles,
  userRole,
  userEmail,
  onRefresh,
}: POActionsMenuProps) {
  const { toast } = useToast();

  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRequestEditDialog, setShowRequestEditDialog] = useState(false);
  const [showRequestCancelDialog, setShowRequestCancelDialog] = useState(false);
  const [showRequestsDialog, setShowRequestsDialog] = useState(false);

  // Form states
  const [editReason, setEditReason] = useState('');
  const [newFiles, setNewFiles] = useState<FileList | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [requestFiles, setRequestFiles] = useState<FileList | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedFilesToKeep, setSelectedFilesToKeep] = useState<string[]>([]);

  // Change requests
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);

  useEffect(() => {
    loadChangeRequests();
  }, [quoteId]);

  useEffect(() => {
    setSelectedFilesToKeep(poFiles.map((f) => f.id));
  }, [poFiles]);

  const loadChangeRequests = async () => {
    const { data } = await (supabase.from as any)('po_change_requests')
      .select('*')
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: false });
    if (data) setChangeRequests(data);
  };

  const pendingCount = changeRequests.filter((r) => r.status === 'pending').length;

  // Validated file change handler
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (files: FileList | null) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setter(null);
      return;
    }
    const error = validateFiles(files);
    if (error) {
      toast({ title: 'ไฟล์ไม่ถูกต้อง', description: error, variant: 'destructive' });
      e.target.value = '';
      setter(null);
      return;
    }
    setter(files);
  };

  // Secure file upload helper
  const secureUploadFile = async (targetQuoteId: string, file: File, prefix = '') => {
    const fileName = prefix + generateSecurePath(targetQuoteId, file.name);
    const { data: uploadData, error } = await supabase.storage
      .from('quote-files')
      .upload(fileName, file);

    if (error || !uploadData) {
      throw new Error(`อัปโหลดไฟล์ ${file.name} ไม่สำเร็จ: ${error?.message}`);
    }

    const { data: { publicUrl } } = supabase.storage.from('quote-files').getPublicUrl(fileName);

    return { publicUrl, fileName, originalName: file.name, size: file.size, storagePath: fileName };
  };

  // Get next version number via RPC (uses advisory lock)
  const getNextVersion = async (): Promise<number> => {
    const { data, error } = await supabase.rpc('get_next_po_version', { p_quote_id: quoteId });
    if (error) throw new Error('ไม่สามารถสร้างเวอร์ชันใหม่: ' + error.message);
    return data as number;
  };

  // ==========================================
  // Super Admin: Edit PO directly
  // ==========================================
  const handleEditPO = async () => {
    // Validate new files
    const fileError = validateFiles(newFiles);
    if (fileError) {
      toast({ title: 'ไฟล์ไม่ถูกต้อง', description: fileError, variant: 'destructive' });
      return;
    }

    setProcessing(true);
    const rollbackActions: (() => Promise<void>)[] = [];

    try {
      // 1. Get safe version number via DB function
      const nextVersion = await getNextVersion();

      // 2. Save version WITH VERIFICATION
      const versionPayload = {
        quote_id: quoteId,
        version_number: nextVersion,
        files: poFiles.map((f) => ({ id: f.id, file_url: f.file_url, file_name: f.file_name })),
        created_by: userEmail,
        change_reason: sanitizeInput(editReason) || 'แก้ไข PO',
      };

      const { data: versionData, error: versionError } = await (supabase.from as any)('po_versions')
        .insert(versionPayload)
        .select()
        .single();

      if (versionError || !versionData) {
        throw new Error('ไม่สามารถบันทึก version สำรอง: ' + (versionError?.message || 'unknown'));
      }

      // Verify backup integrity
      const savedFiles = versionData.files as any[];
      if (!savedFiles || savedFiles.length !== poFiles.length) {
        await (supabase.from as any)('po_versions').delete().eq('id', versionData.id);
        throw new Error('การตรวจสอบ version สำรองไม่ผ่าน — ยกเลิกการแก้ไข');
      }

      rollbackActions.push(async () => {
        await (supabase.from as any)('po_versions').delete().eq('id', versionData.id);
      });

      // 3. Delete removed files (DB records only — storage files kept as backup)
      const filesToDelete = poFiles.filter((f) => !selectedFilesToKeep.includes(f.id));
      for (const file of filesToDelete) {
        await supabase.from('quote_files').delete().eq('id', file.id);
      }

      // 4. Upload new files with secure paths
      if (newFiles && newFiles.length > 0) {
        for (const file of Array.from(newFiles)) {
          const uploaded = await secureUploadFile(quoteId, file);

          await supabase.from('quote_files').insert({
            quote_id: quoteId,
            file_url: uploaded.publicUrl,
            file_name: file.name,
            file_size: file.size,
            category: 'po',
            uploaded_by: userEmail,
          } as any);
        }
      }

      // 5. System message
      await supabase.from('quote_messages').insert({
        quote_id: quoteId,
        sender_role: 'system',
        sender_name: 'System',
        content: `PO ถูกแก้ไขโดย ${userEmail} — ${sanitizeInput(editReason) || 'ไม่ระบุเหตุผล'} (v${nextVersion})`,
      });

      toast({ title: 'แก้ไข PO สำเร็จ', description: `บันทึกเวอร์ชัน ${nextVersion} เรียบร้อย` });
      setShowEditDialog(false);
      setEditReason('');
      setNewFiles(null);
      onRefresh();
    } catch (error: any) {
      // Rollback in reverse order
      for (const rollback of rollbackActions.reverse()) {
        try { await rollback(); } catch (e) { console.error('Rollback failed:', e); }
      }
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  // ==========================================
  // Super Admin: Cancel PO directly
  // ==========================================
  const handleCancelPO = async () => {
    if (!cancelReason.trim()) {
      toast({ title: 'กรุณาระบุเหตุผล', variant: 'destructive' });
      return;
    }

    setProcessing(true);
    try {
      // 1. Save version before cancel
      const nextVersion = await getNextVersion();

      const { data: versionData, error: versionError } = await (supabase.from as any)('po_versions')
        .insert({
          quote_id: quoteId,
          version_number: nextVersion,
          files: poFiles.map((f) => ({ id: f.id, file_url: f.file_url, file_name: f.file_name })),
          created_by: userEmail,
          change_reason: `ยกเลิก PO: ${sanitizeInput(cancelReason)}`,
        })
        .select()
        .single();

      if (versionError || !versionData) {
        throw new Error('ไม่สามารถบันทึก version สำรอง');
      }

      // 2. Revert quote status
      await supabase
        .from('quote_requests')
        .update({ status: 'quote_sent' } as any)
        .eq('id', quoteId);

      // Delete PO files
      for (const file of poFiles) {
        await supabase.from('quote_files').delete().eq('id', file.id);
      }

      // 4. System message
      await supabase.from('quote_messages').insert({
        quote_id: quoteId,
        sender_role: 'system',
        sender_name: 'System',
        content: `PO ถูกยกเลิกโดย ${userEmail} — ${sanitizeInput(cancelReason)} (v${nextVersion})`,
      });

      toast({ title: 'ยกเลิก PO สำเร็จ' });
      setShowCancelDialog(false);
      setCancelReason('');
      onRefresh();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  // ==========================================
  // Admin: Request Edit/Cancel
  // ==========================================
  const handleRequestSubmit = async (type: 'edit' | 'cancel') => {
    const reason = type === 'edit' ? requestReason : cancelReason;
    if (!reason.trim()) {
      toast({ title: 'กรุณาระบุเหตุผล', variant: 'destructive' });
      return;
    }

    // Validate files for edit requests
    if (type === 'edit') {
      const fileError = validateFiles(requestFiles);
      if (fileError) {
        toast({ title: 'ไฟล์ไม่ถูกต้อง', description: fileError, variant: 'destructive' });
        return;
      }
    }

    setProcessing(true);
    try {
      let uploadedFiles: any[] = [];

      if (type === 'edit' && requestFiles && requestFiles.length > 0) {
        for (const file of Array.from(requestFiles)) {
          const uploaded = await secureUploadFile(quoteId, file, 'temp/');
          uploadedFiles.push({
            file_url: uploaded.publicUrl,
            file_name: file.name,
            file_size: file.size,
          });
        }
      }

      await (supabase.from as any)('po_change_requests').insert({
        quote_id: quoteId,
        request_type: type,
        requested_by: userEmail,
        requested_by_role: userRole,
        request_reason: sanitizeInput(reason),
        new_files: uploadedFiles.length > 0 ? uploadedFiles : null,
      });

      await supabase.from('quote_messages').insert({
        quote_id: quoteId,
        sender_role: 'system',
        sender_name: 'System',
        content: `${userEmail} ขอ${type === 'edit' ? 'แก้ไข' : 'ยกเลิก'} PO — ${sanitizeInput(reason)}`,
      });

      toast({ title: 'ส่งคำขอสำเร็จ', description: 'รอ Super Admin อนุมัติ' });

      if (type === 'edit') {
        setShowRequestEditDialog(false);
        setRequestReason('');
        setRequestFiles(null);
      } else {
        setShowRequestCancelDialog(false);
        setCancelReason('');
      }

      await loadChangeRequests();
      onRefresh();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  // ==========================================
  // Super Admin: Approve/Reject Request
  // ==========================================
  const handleReviewRequest = async (requestId: string, action: 'approved' | 'rejected', notes?: string) => {
    setProcessing(true);
    try {
      await (supabase.from as any)('po_change_requests')
        .update({
          status: action,
          reviewed_by: userEmail,
          reviewed_at: new Date().toISOString(),
          review_notes: notes || null,
          ...(action === 'approved' ? { completed_at: new Date().toISOString() } : {}),
        })
        .eq('id', requestId);

      const request = changeRequests.find((r) => r.id === requestId);

      if (action === 'approved' && request?.request_type === 'cancel') {
        await supabase
          .from('quote_requests')
          .update({ status: 'quote_sent' } as any)
          .eq('id', quoteId);

        for (const file of poFiles) {
          await supabase.from('quote_files').delete().eq('id', file.id);
        }
      }

      if (action === 'approved' && request?.request_type === 'edit' && request.new_files) {
        const nextVersion = await getNextVersion();

        const { error: versionError } = await (supabase.from as any)('po_versions')
          .insert({
            quote_id: quoteId,
            version_number: nextVersion,
            files: poFiles.map((f) => ({ id: f.id, file_url: f.file_url, file_name: f.file_name })),
            created_by: userEmail,
            change_reason: `อนุมัติคำขอแก้ไข: ${request.request_reason}`,
          });

        if (versionError) {
          throw new Error('ไม่สามารถบันทึก version: ' + versionError.message);
        }

        for (const f of request.new_files) {
          await supabase.from('quote_files').insert({
            quote_id: quoteId,
            file_url: f.file_url,
            file_name: f.file_name,
            file_size: f.file_size || null,
            category: 'po',
            uploaded_by: request.requested_by,
          } as any);
        }
      }

      await supabase.from('quote_messages').insert({
        quote_id: quoteId,
        sender_role: 'system',
        sender_name: 'System',
        content: `คำขอ${request?.request_type === 'edit' ? 'แก้ไข' : 'ยกเลิก'} PO ถูก${action === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}โดย ${userEmail}`,
      });

      toast({ title: action === 'approved' ? 'อนุมัติสำเร็จ' : 'ปฏิเสธสำเร็จ' });
      await loadChangeRequests();
      onRefresh();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  if (poFiles.length === 0) return null;

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {userRole === 'super_admin' && (
          <>
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              แก้ไข PO
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCancelDialog(true)}
              className="text-destructive hover:text-destructive"
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5" />
              ยกเลิก PO
            </Button>
          </>
        )}

        {(userRole === 'admin' || userRole === 'sales') && (
          <>
            <Button variant="outline" size="sm" onClick={() => setShowRequestEditDialog(true)}>
              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
              ขอแก้ไข PO
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRequestCancelDialog(true)}
              className="text-orange-600 hover:text-orange-700"
            >
              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
              ขอยกเลิก PO
            </Button>
          </>
        )}

        {pendingCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setShowRequestsDialog(true)}>
            <List className="w-3.5 h-3.5 mr-1.5" />
            คำขอ ({pendingCount})
          </Button>
        )}
      </div>

      {/* Super Admin: Edit PO Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>แก้ไข PO</DialogTitle>
            <DialogDescription>แก้ไขไฟล์ PO สำหรับ {quoteNumber}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm">ไฟล์ PO ปัจจุบัน</Label>
              <div className="border border-border rounded-lg p-3 mt-1.5 bg-muted/30 space-y-2">
                {poFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{file.file_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </a>
                      <button
                        onClick={() =>
                          setSelectedFilesToKeep((prev) =>
                            prev.includes(file.id) ? prev.filter((id) => id !== file.id) : [...prev, file.id]
                          )
                        }
                        className="p-1 hover:bg-destructive/10 rounded"
                      >
                        <Trash2
                          className={`w-4 h-4 ${
                            selectedFilesToKeep.includes(file.id) ? 'text-muted-foreground' : 'text-destructive'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm">อัปโหลดไฟล์ใหม่</Label>
              <Input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, setNewFiles)}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                รองรับ PDF, PNG, JPG (ไฟล์ละไม่เกิน 10MB, สูงสุด {MAX_FILES} ไฟล์)
              </p>
            </div>

            <div>
              <Label className="text-sm">เหตุผลในการแก้ไข</Label>
              <Textarea
                value={editReason}
                onChange={(e) => setEditReason(e.target.value.substring(0, MAX_REASON_LENGTH))}
                rows={3}
                placeholder="ระบุเหตุผล..."
                className="mt-1.5"
                maxLength={MAX_REASON_LENGTH}
              />
              <p className="text-xs text-muted-foreground text-right mt-0.5">
                {editReason.length}/{MAX_REASON_LENGTH}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={processing}>
              ยกเลิก
            </Button>
            <Button onClick={handleEditPO} disabled={processing}>
              <Save className="w-4 h-4 mr-2" />
              {processing ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Super Admin: Cancel PO Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยกเลิก PO</AlertDialogTitle>
            <AlertDialogDescription>
              การยกเลิก PO จะลบไฟล์ PO ทั้งหมดและเปลี่ยนสถานะกลับเป็น "ส่งราคาแล้ว"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label className="text-sm">เหตุผลในการยกเลิก *</Label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value.substring(0, MAX_REASON_LENGTH))}
              rows={3}
              placeholder="ระบุเหตุผล..."
              className="mt-1.5"
              maxLength={MAX_REASON_LENGTH}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelPO}
              disabled={processing || !cancelReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? 'กำลังดำเนินการ...' : 'ยืนยันยกเลิก PO'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Admin: Request Edit Dialog */}
      <Dialog open={showRequestEditDialog} onOpenChange={setShowRequestEditDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>ขอแก้ไข PO</DialogTitle>
            <DialogDescription>ส่งคำขอแก้ไข PO ไปยัง Super Admin</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-200">ต้องได้รับอนุมัติ</p>
                <p className="text-xs text-orange-700 dark:text-orange-400">
                  คำขอนี้จะถูกส่งไปยัง Super Admin เพื่อพิจารณา
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm">ไฟล์ PO ใหม่ (ถ้ามี)</Label>
              <Input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, setRequestFiles)}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                รองรับ PDF, PNG, JPG (ไฟล์ละไม่เกิน 10MB, สูงสุด {MAX_FILES} ไฟล์)
              </p>
            </div>
            <div>
              <Label className="text-sm">เหตุผลในการขอแก้ไข *</Label>
              <Textarea
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value.substring(0, MAX_REASON_LENGTH))}
                rows={4}
                placeholder="กรุณาระบุเหตุผลอย่างละเอียด..."
                className="mt-1.5"
                maxLength={MAX_REASON_LENGTH}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestEditDialog(false)} disabled={processing}>
              ยกเลิก
            </Button>
            <Button onClick={() => handleRequestSubmit('edit')} disabled={processing || !requestReason.trim()}>
              <Send className="w-4 h-4 mr-2" />
              {processing ? 'กำลังส่ง...' : 'ส่งคำขอ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin: Request Cancel Dialog */}
      <Dialog open={showRequestCancelDialog} onOpenChange={setShowRequestCancelDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>ขอยกเลิก PO</DialogTitle>
            <DialogDescription>ส่งคำขอยกเลิก PO ไปยัง Super Admin</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-200">ต้องได้รับอนุมัติ</p>
                <p className="text-xs text-red-700 dark:text-red-400">
                  การยกเลิก PO ต้องได้รับอนุมัติจาก Super Admin
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm">เหตุผลในการขอยกเลิก *</Label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value.substring(0, MAX_REASON_LENGTH))}
                rows={4}
                placeholder="กรุณาระบุเหตุผลอย่างละเอียด..."
                className="mt-1.5"
                maxLength={MAX_REASON_LENGTH}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestCancelDialog(false)} disabled={processing}>
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRequestSubmit('cancel')}
              disabled={processing || !cancelReason.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              {processing ? 'กำลังส่ง...' : 'ส่งคำขอยกเลิก'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pending Requests List */}
      <Dialog open={showRequestsDialog} onOpenChange={setShowRequestsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>คำขอแก้ไข/ยกเลิก PO</DialogTitle>
            <DialogDescription>จัดการคำขอจาก Admin หรือลูกค้า</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {changeRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={request.request_type === 'cancel' ? 'destructive' : 'default'}
                          className="text-xs"
                        >
                          {request.request_type === 'edit' ? 'แก้ไข' : 'ยกเลิก'}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            request.status === 'pending'
                              ? 'border-orange-300 text-orange-700'
                              : request.status === 'approved'
                              ? 'border-green-300 text-green-700'
                              : 'border-red-300 text-red-700'
                          }`}
                        >
                          {request.status === 'pending'
                            ? 'รออนุมัติ'
                            : request.status === 'approved'
                            ? 'อนุมัติแล้ว'
                            : 'ปฏิเสธ'}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate">
                          โดย {request.requested_by}
                        </span>
                      </div>

                      <p className="text-sm text-foreground mb-1">
                        <strong>เหตุผล:</strong> {request.request_reason || '-'}
                      </p>

                      {request.new_files && (request.new_files as any[]).length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          ไฟล์ใหม่: {(request.new_files as any[]).length} ไฟล์
                        </p>
                      )}

                      {request.review_notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          หมายเหตุ: {request.review_notes}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-1.5">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatShortDateTime(request.created_at)}
                      </p>
                    </div>

                    {userRole === 'super_admin' && request.status === 'pending' && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleReviewRequest(request.id, 'approved')}
                          disabled={processing}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          อนุมัติ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReviewRequest(request.id, 'rejected', 'ปฏิเสธ')}
                          disabled={processing}
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          ปฏิเสธ
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {changeRequests.length === 0 && (
              <p className="text-center text-muted-foreground py-8">ไม่มีคำขอ</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

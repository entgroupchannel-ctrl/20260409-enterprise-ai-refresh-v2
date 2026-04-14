import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, Loader2, FileText, X } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  { value: 'company', label: '🏢 ข้อมูลบริษัท' },
  { value: 'tax', label: '💰 ภาษี' },
  { value: 'banking', label: '🏦 ธนาคาร' },
  { value: 'personnel', label: '👤 บุคคล' },
  { value: 'certification', label: '📜 มาตรฐาน' },
  { value: 'catalog', label: '📦 แคตตาล็อก' },
  { value: 'other', label: '📎 อื่นๆ' },
];

const ACCESS_LEVELS = [
  { value: 'public', label: '🌐 Public — ใครก็ดาวน์โหลดได้' },
  { value: 'authenticated', label: '🔒 Authenticated — ลูกค้า login แล้ว' },
  { value: 'customer_active', label: '🎯 Customer Active — มี quote/order' },
  { value: 'internal', label: '🏢 Internal — พนักงาน ENT เท่านั้น' },
];

const MAX_SIZE = 20 * 1024 * 1024;

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/webp',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function UploadCompanyDocumentDialog({ open, onOpenChange, onSuccess }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('company');
  const [accessLevel, setAccessLevel] = useState('authenticated');
  const [version, setVersion] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('company');
    setAccessLevel('authenticated');
    setVersion('');
    setValidFrom('');
    setValidUntil('');
    setIsFeatured(false);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!ALLOWED_TYPES.includes(f.type)) {
      toast({ title: 'ไฟล์ไม่รองรับ', description: 'รองรับ PDF, JPEG, PNG, WebP, Excel, Word', variant: 'destructive' });
      return;
    }

    if (f.size > MAX_SIZE) {
      toast({ title: 'ไฟล์ใหญ่เกินไป', description: 'ขนาดสูงสุด 20 MB', variant: 'destructive' });
      return;
    }

    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
  };

  const handleUpload = async () => {
    if (!file || !title.trim() || !user) {
      toast({ title: 'กรุณากรอกข้อมูลให้ครบ', description: 'ชื่อเอกสารและไฟล์', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const timestamp = Date.now();
      const ext = file.name.split('.').pop();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const safePath = `${category}/${timestamp}_${randomSuffix}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('company-documents')
        .upload(safePath, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = await supabase.storage
        .from('company-documents')
        .createSignedUrl(safePath, 604800);

      if (!urlData?.signedUrl) throw new Error('Failed to generate URL');

      const { error: dbErr } = await (supabase as any)
        .from('company_documents')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          category,
          access_level: accessLevel,
          file_url: urlData.signedUrl,
          file_path: safePath,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          version: version.trim() || null,
          valid_from: validFrom || null,
          valid_until: validUntil || null,
          is_featured: isFeatured,
          is_active: true,
          created_by: user.id,
        });

      if (dbErr) {
        await supabase.storage.from('company-documents').remove([safePath]);
        throw dbErr;
      }

      toast({ title: '✅ อัปโหลดสำเร็จ', description: title });
      resetForm();
      onOpenChange(false);
      onSuccess();
    } catch (e: any) {
      toast({ title: 'อัปโหลดไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!uploading) onOpenChange(o); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            อัปโหลดเอกสารบริษัท
          </DialogTitle>
          <DialogDescription>เพิ่มเอกสารสำหรับให้ลูกค้าดาวน์โหลด</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File upload */}
          <div>
            <Label>ไฟล์ *</Label>
            {file ? (
              <div className="mt-1 p-3 border rounded bg-muted/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  disabled={uploading}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-1">
                <Input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.xls,.xlsx,.doc,.docx" onChange={handleFileChange} />
                <p className="text-xs text-muted-foreground mt-1">รองรับ PDF, JPEG, PNG, WebP, Excel, Word • สูงสุด 20 MB</p>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="title">ชื่อเอกสาร *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="เช่น หนังสือรับรองบริษัท" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="description">คำอธิบาย</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียดเอกสาร (ไม่บังคับ)" rows={2} className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>หมวดหมู่ *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>สิทธิ์การเข้าถึง *</Label>
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACCESS_LEVELS.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="version">เวอร์ชั่น</Label>
            <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="เช่น 2026-Q1 หรือ v2.0" className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="valid_from">ใช้ได้ตั้งแต่</Label>
              <Input id="valid_from" type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="valid_until">หมดอายุ</Label>
              <Input id="valid_until" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="mt-1" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded border">
            <div>
              <Label>เอกสารเด่น</Label>
              <p className="text-xs text-muted-foreground">แสดงด้านบนในหน้ารายการของลูกค้า</p>
            </div>
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }} disabled={uploading}>ยกเลิก</Button>
            <Button onClick={handleUpload} disabled={uploading || !file || !title.trim()}>
              {uploading ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> กำลังอัปโหลด...</> : <><Upload className="w-4 h-4 mr-1.5" /> อัปโหลด</>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

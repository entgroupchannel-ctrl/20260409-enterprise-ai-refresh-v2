import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2, Pencil } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
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
  { value: 'public', label: '🌐 Public' },
  { value: 'authenticated', label: '🔒 Authenticated' },
  { value: 'customer_active', label: '🎯 Customer Active' },
  { value: 'internal', label: '🏢 Internal' },
];

export default function EditCompanyDocumentDialog({ open, onOpenChange, document, onSuccess }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('company');
  const [accessLevel, setAccessLevel] = useState('authenticated');
  const [version, setVersion] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (document && open) {
      setTitle(document.title || '');
      setDescription(document.description || '');
      setCategory(document.category || 'company');
      setAccessLevel(document.access_level || 'authenticated');
      setVersion(document.version || '');
      setValidFrom(document.valid_from || '');
      setValidUntil(document.valid_until || '');
      setIsFeatured(document.is_featured || false);
      setIsActive(document.is_active !== false);
    }
  }, [document, open]);

  const handleSave = async () => {
    if (!document?.id || !title.trim()) return;

    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('company_documents')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          category,
          access_level: accessLevel,
          version: version.trim() || null,
          valid_from: validFrom || null,
          valid_until: validUntil || null,
          is_featured: isFeatured,
          is_active: isActive,
        })
        .eq('id', document.id);

      if (error) throw error;

      toast({ title: '✅ บันทึกแล้ว' });
      onOpenChange(false);
      onSuccess();
    } catch (e: any) {
      toast({ title: 'บันทึกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!saving) onOpenChange(o); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            แก้ไขเอกสาร
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>ไฟล์</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {document.file_name} • {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : '-'}
            </p>
            <p className="text-xs text-muted-foreground">💡 ต้องการเปลี่ยนไฟล์? ลบเอกสารนี้แล้วอัปโหลดใหม่</p>
          </div>

          <div>
            <Label>ชื่อเอกสาร *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label>คำอธิบาย</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>หมวดหมู่</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>สิทธิ์การเข้าถึง</Label>
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACCESS_LEVELS.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>เวอร์ชั่น</Label>
            <Input value={version} onChange={(e) => setVersion(e.target.value)} className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>ใช้ได้ตั้งแต่</Label>
              <Input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>หมดอายุ</Label>
              <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="mt-1" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded border">
            <Label>เอกสารเด่น</Label>
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>

          <div className="flex items-center justify-between p-3 rounded border">
            <div>
              <Label>เปิดใช้งาน</Label>
              <p className="text-xs text-muted-foreground">ปิด = ซ่อนจากลูกค้า</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>ยกเลิก</Button>
            <Button onClick={handleSave} disabled={saving || !title.trim()}>
              {saving ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> กำลังบันทึก...</> : <><Save className="w-4 h-4 mr-1.5" /> บันทึก</>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

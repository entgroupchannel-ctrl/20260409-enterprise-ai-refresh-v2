import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User } from 'lucide-react';

interface ContactFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company: string;
  notes: string;
}

interface ContactFormPanelProps {
  formData: ContactFormData;
  onChange: (field: string, value: string) => void;
  loading: boolean;
  emailDisabled: boolean;
}

export default function ContactFormPanel({ formData, onChange, loading, emailDisabled }: ContactFormPanelProps) {
  return (
    <div className="overflow-y-auto pr-2">
      <div className="sticky top-0 bg-background pb-2 mb-3 z-10">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <User className="w-4 h-4" />
          ข้อมูลติดต่อ
        </h3>
      </div>

      {loading ? (
        <div className="py-8 text-center">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">กำลังโหลด...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">ชื่อ-นามสกุล <span className="text-destructive">*</span></Label>
            <Input value={formData.customer_name} onChange={(e) => onChange('customer_name', e.target.value)} placeholder="สมชาย ใจดี" className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">อีเมล <span className="text-destructive">*</span></Label>
            <Input type="email" value={formData.customer_email} onChange={(e) => onChange('customer_email', e.target.value)} placeholder="email@example.com" className="h-8 text-sm" disabled={emailDisabled} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">เบอร์โทร</Label>
            <Input value={formData.customer_phone} onChange={(e) => onChange('customer_phone', e.target.value)} placeholder="081-234-5678" className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">บริษัท</Label>
            <Input value={formData.customer_company} onChange={(e) => onChange('customer_company', e.target.value)} placeholder="บริษัท ABC จำกัด" className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">หมายเหตุ</Label>
            <Textarea value={formData.notes} onChange={(e) => onChange('notes', e.target.value)} placeholder="ระบุความต้องการเพิ่มเติม..." rows={3} className="text-sm resize-none" />
          </div>
        </div>
      )}
    </div>
  );
}

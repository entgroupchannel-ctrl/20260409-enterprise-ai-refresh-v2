import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Copy, Mail, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface POData {
  id: string;
  po_number: string;
  pi_number?: string | null;
  order_date?: string | null;
  expected_delivery?: string | null;
  grand_total?: number | null;
  subtotal?: number | null;
  shipping_fee?: number | null;
  handling_fee?: number | null;
  currency?: string | null;
  payment_terms?: string | null;
  price_terms?: string | null;
  loading_port?: string | null;
  destination?: string | null;
  items?: Array<{ model: string; quantity: number; unit_price: number; total: number }>;
}

interface SupplierData {
  email?: string | null;
  company_name?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po: POData;
  supplier?: SupplierData | null;
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return '-';
  try { return format(new Date(d), 'dd/MM/yyyy'); } catch { return d; }
}

function fmtNum(n: number | null | undefined): string {
  if (n == null) return '0.00';
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function generateEmailBody(po: POData, userName: string, userEmail: string): string {
  const itemsText = po.items?.map(item =>
    `• ${item.model} × ${item.quantity} units @ $${fmtNum(item.unit_price)} = $${fmtNum(item.total)}`
  ).join('\n') || '(ตามเอกสาร PO ที่แนบ)';

  return `Dear ${po.pi_number ? 'Supplier' : 'Supplier'},

Please find attached our Purchase Order ${po.po_number}.

Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PO Number    : ${po.po_number}
PI Number    : ${po.pi_number || '-'}
Date         : ${fmtDate(po.order_date)}
Delivery By  : ${fmtDate(po.expected_delivery)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Items:
${itemsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal     : $${fmtNum(po.subtotal)}
Shipping     : $${fmtNum(po.shipping_fee)}
Handling     : $${fmtNum(po.handling_fee)}
Total        : ${po.currency || 'USD'} ${fmtNum(po.grand_total)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment Terms : ${po.payment_terms || '-'}
Price Terms   : ${po.price_terms || '-'}
Loading Port  : ${po.loading_port || '-'}
Destination   : ${po.destination || '-'}

Please confirm receipt of this order and provide an estimated shipping date.

Best regards,
${userName}
ENT Group
Email: ${userEmail}
`;
}

export default function EmailPreviewModal({ open, onOpenChange, po, supplier }: Props) {
  const { profile } = useAuth();
  const [extraTo, setExtraTo] = useState('');
  const [toList, setToList] = useState<string[]>([]);
  const [extraCc, setExtraCc] = useState('');
  const [ccList, setCcList] = useState<string[]>([]);

  const userName = profile?.full_name || 'ENT Group';
  const userEmail = profile?.email || '';
  const body = generateEmailBody(po, userName, userEmail);
  const subject = `Purchase Order ${po.po_number} - ENT Group`;

  const allTo = [supplier?.email, ...toList].filter(Boolean) as string[];
  const allCc = [userEmail, ...ccList].filter(Boolean) as string[];

  const addEmail = (list: string[], setList: (l: string[]) => void, val: string, setVal: (v: string) => void) => {
    const email = val.trim();
    if (!email || !email.includes('@')) return;
    if (!list.includes(email)) setList([...list, email]);
    setVal('');
  };

  const handleCopy = async () => {
    const fullText = `To: ${allTo.join(', ')}\nCC: ${allCc.join(', ')}\nSubject: ${subject}\n\n${body}`;
    await navigator.clipboard.writeText(fullText);
    toast.success('คัดลอกเนื้อหาอีเมลแล้ว');

    // Log to DB
    await supabase.from('po_email_logs').insert({
      po_id: po.id,
      sent_by: profile?.id || null,
      recipients: allTo,
      cc: allCc,
      subject,
      body,
      status: 'preview_only',
    } as any);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>📧 ส่งอีเมลใบสั่งซื้อ</DialogTitle>
            <Badge variant="outline" className="text-yellow-600 border-yellow-400 text-xs">
              🚧 Preview เท่านั้น
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipients */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">ถึง (To)</Label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {allTo.map((e, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {e}
                  {i > 0 && <X className="w-3 h-3 cursor-pointer" onClick={() => setToList(toList.filter((_, j) => j !== i - 1))} />}
                </Badge>
              ))}
              <Input
                className="w-48 h-7 text-xs"
                placeholder="เพิ่มอีเมล..."
                value={extraTo}
                onChange={e => setExtraTo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addEmail(toList, setToList, extraTo, setExtraTo)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">สำเนา (CC)</Label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {allCc.map((e, i) => (
                <Badge key={i} variant="outline" className="gap-1">
                  {e}
                  {i > 0 && <X className="w-3 h-3 cursor-pointer" onClick={() => setCcList(ccList.filter((_, j) => j !== i - 1))} />}
                </Badge>
              ))}
              <Input
                className="w-48 h-7 text-xs"
                placeholder="เพิ่ม CC..."
                value={extraCc}
                onChange={e => setExtraCc(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addEmail(ccList, setCcList, extraCc, setExtraCc)}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">หัวข้อ</Label>
            <Input value={subject} readOnly className="text-sm bg-muted" />
          </div>

          {/* Attachments */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">แนบไฟล์</Label>
            <div className="flex gap-2">
              <Badge variant="secondary">📄 PO-{po.po_number}.pdf (auto)</Badge>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">เนื้อหาอีเมล (Preview)</Label>
            <div className="border rounded-lg p-4 bg-muted/50 font-mono text-xs whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {body}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-1" /> Copy เนื้อหา
          </Button>
          <Button disabled className="opacity-60 cursor-not-allowed" title="จะเปิดใช้งานใน Phase ถัดไป">
            <Mail className="w-4 h-4 mr-1" /> ส่งอีเมล (เร็วๆ นี้)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Copy, Mail, X, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface TransferData {
  id: string;
  transfer_number: string;
  supplier_name: string;
  supplier_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  purpose: string;
  purchase_order_ids?: string[] | null;
  transferred_at?: string | null;
  transfer_slip_url?: string | null;
  bank_name?: string | null;
}

interface SupplierData {
  email?: string | null;
  company_name?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transfer: TransferData;
  supplier?: SupplierData | null;
  poNumbers?: Record<string, string>;
  piNumbers?: Record<string, string>;
  onStatusUpdated?: () => void;
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return '-';
  try { return format(new Date(d), 'dd/MM/yyyy'); } catch { return d; }
}

function fmtNum(n: number | null | undefined): string {
  if (n == null) return '0.00';
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function generateTransferEmailBody(
  transfer: TransferData,
  poNumbers: Record<string, string>,
  piNumbers: Record<string, string>,
  userName: string,
  userEmail: string,
): string {
  const poNums = (transfer.purchase_order_ids || []).map(id => poNumbers[id] || id.slice(0, 8)).join(', ');
  const piNums = (transfer.purchase_order_ids || []).map(id => piNumbers[id]).filter(Boolean).join(', ');

  return `Dear ${transfer.supplier_name},

We are pleased to inform you that we have completed the payment transfer for your reference.

Payment Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Transfer Ref : ${transfer.transfer_number}
PO Number    : ${poNums || '-'}
PI Number    : ${piNums || '-'}
Amount       : ${transfer.currency} ${fmtNum(transfer.amount)}
Transfer Date: ${fmtDate(transfer.transferred_at || transfer.created_at)}
Bank         : ${transfer.bank_name || 'Bangkok Bank'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please find attached the transfer slip for your records.

Kindly confirm receipt and proceed with the shipment as per the agreed delivery schedule.

Best regards,
${userName}
ENT Group - Procurement Team
Email: ${userEmail}
`;
}

export default function TransferEmailModal({
  open, onOpenChange, transfer, supplier, poNumbers = {}, piNumbers = {}, onStatusUpdated,
}: Props) {
  const { profile } = useAuth();
  const [extraTo, setExtraTo] = useState('');
  const [toList, setToList] = useState<string[]>([]);
  const [extraDocs, setExtraDocs] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userName = profile?.full_name || 'ENT Group';
  const userEmail = profile?.email || '';
  const body = generateTransferEmailBody(transfer, poNumbers, piNumbers, userName, userEmail);
  const subject = `Payment Transferred - ${transfer.transfer_number} | Ref PO: ${(transfer.purchase_order_ids || []).map(id => poNumbers[id] || '').filter(Boolean).join(', ') || '-'}`;

  const allTo = [supplier?.email, ...toList].filter(Boolean) as string[];
  const allCc = [userEmail].filter(Boolean) as string[];

  const poNums = (transfer.purchase_order_ids || []).map(id => poNumbers[id] || id.slice(0, 8)).join(', ');
  const piNums = (transfer.purchase_order_ids || []).map(id => piNumbers[id]).filter(Boolean).join(', ');

  const addEmail = (val: string) => {
    const email = val.trim();
    if (!email || !email.includes('@')) return;
    if (!toList.includes(email)) setToList([...toList, email]);
    setExtraTo('');
  };

  const handleExtraDocsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setExtraDocs(prev => [...prev, ...files]);
  };

  const handleCopy = async () => {
    const fullText = `To: ${allTo.join(', ')}\nCC: ${allCc.join(', ')}\nSubject: ${subject}\n\n${body}`;
    await navigator.clipboard.writeText(fullText);
    toast.success('คัดลอกเนื้อหาอีเมลแล้ว');

    // Update transfer email status + log
    await Promise.all([
      supabase.from('international_transfer_requests')
        .update({
          email_notification_status: 'preview_only',
          email_notified_at: new Date().toISOString(),
          email_notified_by: profile?.id || null,
        } as any)
        .eq('id', transfer.id),
      supabase.from('po_email_logs').insert({
        transfer_id: transfer.id,
        sent_by: profile?.id || null,
        recipients: allTo,
        cc: allCc,
        subject,
        body,
        status: 'preview_only',
      } as any),
    ]);

    onStatusUpdated?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>📧 แจ้ง Supplier หลังโอนเงิน</DialogTitle>
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
                onKeyDown={e => e.key === 'Enter' && addEmail(extraTo)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium">สำเนา (CC)</Label>
            <div className="flex flex-wrap gap-1.5">
              {allCc.map((e, i) => (
                <Badge key={i} variant="outline">{e}</Badge>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">หัวข้อ</Label>
            <Input value={subject} readOnly className="text-sm bg-muted" />
          </div>

          {/* PI/PO Reference */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm mb-2">📋 อ้างอิงเอกสาร</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">PI Number</span>
                <p className="font-medium text-xs">{piNums || '-'}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">PO Number</span>
                <p className="font-medium text-xs">{poNums || '-'}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Transfer Ref</span>
                <p className="font-medium text-xs">{transfer.transfer_number}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Amount</span>
                <p className="font-medium text-xs text-green-700 dark:text-green-400">
                  {transfer.currency} {fmtNum(transfer.amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">แนบเอกสาร</Label>

            {transfer.transfer_slip_url && (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded border text-sm">
                <span>📄</span>
                <span className="text-xs flex-1">หลักฐานการโอน (Transfer Slip)</span>
                <Badge variant="secondary" className="text-[10px]">auto</Badge>
              </div>
            )}

            <div
              className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5 mx-auto text-muted-foreground" />
              <p className="text-xs text-muted-foreground mt-1">
                แนบเอกสารเพิ่มเติม (CI, Packing List, ฯลฯ)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.xlsx"
                className="hidden"
                onChange={handleExtraDocsUpload}
              />
            </div>

            {extraDocs.map((doc, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>📎 {doc.name}</span>
                <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => setExtraDocs(extraDocs.filter((_, j) => j !== i))}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">เนื้อหาอีเมล (Preview)</Label>
            <div className="border rounded-lg p-4 bg-muted/50 font-mono text-xs whitespace-pre-wrap max-h-[250px] overflow-y-auto">
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

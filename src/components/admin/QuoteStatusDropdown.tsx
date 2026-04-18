// src/components/admin/QuoteStatusDropdown.tsx
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// These options are ACTIONS (open dialog/navigate) — not status updates
const ACTION_OPTIONS = new Set([
  'create_invoice',
  'create_tax',
  'create_receipt',
  'create_po',
  'split_invoice',
  'split_tax',
  'split_receipt',
  'deposit_invoice',
  'deposit_tax',
  'deposit_receipt',
]);

interface QuoteStatusDropdownProps {
  quoteId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
  onAction?: (action: string, quoteId: string) => void;
  disabled?: boolean;
}

const statusOptions = [
  { value: 'pending', label: 'รออนุมัติ', color: 'text-yellow-700', group: '' },
  { value: 'approved', label: 'อนุมัติ', color: 'text-green-700', group: '' },
  { value: 'create_invoice', label: 'สร้างใบวางบิล/ใบแจ้งหนี้', color: 'text-blue-700', group: 'สร้างเอกสาร' },
  { value: 'create_tax', label: 'สร้างใบส่งสินค้า/ใบกำกับภาษี', color: 'text-blue-600', group: 'สร้างเอกสาร' },
  { value: 'create_receipt', label: 'สร้างใบกำกับภาษี/ใบเสร็จรับเงิน (เงินสด)', color: 'text-blue-500', group: 'สร้างเอกสาร' },
  { value: 'create_po', label: 'สร้างใบสั่งซื้อ', color: 'text-blue-400', group: 'สร้างเอกสาร' },
  { value: 'split_invoice', label: 'แบ่งจ่ายใบวางบิล/ใบแจ้งหนี้', color: 'text-purple-700', group: 'แบ่งจ่าย' },
  { value: 'split_tax', label: 'แบ่งจ่ายใบส่งสินค้า/ใบกำกับภาษี', color: 'text-purple-600', group: 'แบ่งจ่าย' },
  { value: 'split_receipt', label: 'แบ่งจ่ายใบกำกับภาษี/ใบเสร็จรับเงิน (เงินสด)', color: 'text-purple-500', group: 'แบ่งจ่าย' },
  { value: 'deposit_invoice', label: 'มัดจำใบวางบิล/ใบแจ้งหนี้', color: 'text-cyan-700', group: 'มัดจำ' },
  { value: 'deposit_tax', label: 'มัดจำใบส่งสินค้า/ใบกำกับภาษี', color: 'text-cyan-600', group: 'มัดจำ' },
  { value: 'deposit_receipt', label: 'มัดจำใบกำกับภาษี/ใบเสร็จรับเงิน (เงินสด)', color: 'text-cyan-500', group: 'มัดจำ' },
  { value: 'rejected', label: 'ไม่อนุมัติ', color: 'text-red-700', group: '' },
];

export default function QuoteStatusDropdown({
  quoteId,
  currentStatus,
  onStatusChange,
  onAction,
  disabled = false,
}: QuoteStatusDropdownProps) {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newValue: string) => {
    if (newValue === currentStatus) return;

    // Check if this is an action (not a status change)
    if (ACTION_OPTIONS.has(newValue)) {
      if (newValue === 'create_invoice') {
        if (onAction) {
          onAction('create_invoice', quoteId);
        } else {
          toast({
            title: 'ฟีเจอร์ยังไม่พร้อม',
            description: 'ปุ่มนี้ต้องเรียกจากหน้าที่รองรับ',
            variant: 'destructive',
          });
        }
      } else {
        // Other actions — coming soon
        const option = statusOptions.find((s) => s.value === newValue);
        toast({
          title: '⏳ กำลังพัฒนา',
          description: `ฟีเจอร์ "${option?.label}" จะเปิดใช้งานในเฟสถัดไป`,
        });
      }
      return; // Don't update status
    }

    // Normal status change
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ 
          status: newValue,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quoteId);

      if (error) throw error;

      await supabase.from('quote_messages').insert({
        quote_id: quoteId,
        sender_name: 'System',
        sender_role: 'system',
        content: `เปลี่ยนสถานะเป็น "${statusOptions.find(s => s.value === newValue)?.label}"`,
        message_type: 'status_change',
      });

      // Notify customer about status change
      const { data: quoteData } = await supabase
        .from('quote_requests')
        .select('created_by, quote_number, customer_name, customer_email')
        .eq('id', quoteId)
        .maybeSingle();

      if (quoteData?.created_by) {
        import('@/lib/notifications').then(({ createNotification }) => {
          createNotification({
            userId: quoteData.created_by!,
            type: 'quote_status_change',
            title: `สถานะใบเสนอราคาเปลี่ยนแปลง`,
            message: `${quoteData.quote_number} เปลี่ยนเป็น "${statusOptions.find(s => s.value === newValue)?.label}"`,
            actionUrl: `/my-account/quotes/${quoteId}`,
            actionLabel: 'ดูรายละเอียด',
            linkType: 'quote',
            linkId: quoteId,
          });
        });
      } else if (newValue === 'approved' && quoteData?.customer_email) {
        // Guest quote approved → send email with register invite
        supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'quote-sent-guest-invite',
            recipientEmail: quoteData.customer_email,
            idempotencyKey: `quote-sent-guest-${quoteId}`,
            templateData: {
              customerName: quoteData.customer_name || '',
              quoteNumber: quoteData.quote_number || '',
              customerEmail: quoteData.customer_email,
              viewUrl: `${window.location.origin}/quote/share/${quoteId}`,
            },
          },
        }).catch((e) => console.warn('[quote-sent-guest-invite] send failed', e));
      }

      toast({
        title: 'เปลี่ยนสถานะสำเร็จ',
        description: `อัปเดตเป็น "${statusOptions.find(s => s.value === newValue)?.label}"`,
      });

      if (onStatusChange) {
        onStatusChange(newValue);
      }
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const currentOption = statusOptions.find((s) => s.value === currentStatus);

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={disabled || updating}
    >
      <SelectTrigger 
        className="w-full min-w-[200px]"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue>
          <span className={currentOption?.color}>
            {updating ? 'กำลังอัปเดต...' : currentOption?.label || currentStatus}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(() => {
          let lastGroup = '';
          return statusOptions.map((opt) => {
            const showSeparator = opt.group && opt.group !== lastGroup;
            lastGroup = opt.group;
            return (
              <div key={opt.value}>
                {showSeparator && (
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-1">
                    {opt.group}
                  </div>
                )}
                <SelectItem value={opt.value}>
                  <span className={opt.color}>{opt.label}</span>
                </SelectItem>
              </div>
            );
          });
        })()}
      </SelectContent>
    </Select>
  );
}

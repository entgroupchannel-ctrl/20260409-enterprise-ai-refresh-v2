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

interface QuoteStatusDropdownProps {
  quoteId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
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
  disabled = false,
}: QuoteStatusDropdownProps) {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quoteId);

      if (error) throw error;

      // Add system message
      await supabase.from('quote_messages').insert({
        quote_id: quoteId,
        sender_name: 'System',
        sender_role: 'system',
        content: `เปลี่ยนสถานะเป็น "${statusOptions.find(s => s.value === newStatus)?.label}"`,
        message_type: 'status_change',
      });

      toast({
        title: 'เปลี่ยนสถานะสำเร็จ',
        description: `อัปเดตเป็น "${statusOptions.find(s => s.value === newStatus)?.label}"`,
      });

      if (onStatusChange) {
        onStatusChange(newStatus);
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

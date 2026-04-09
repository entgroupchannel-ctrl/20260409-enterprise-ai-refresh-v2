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
  { value: 'pending', label: 'รอตอบกลับ', color: 'text-yellow-700' },
  { value: 'quote_sent', label: 'ส่งใบเสนอราคา/ใบแจ้งหนี้', color: 'text-blue-700' },
  { value: 'po_uploaded', label: 'ส่งใบสั่งซื้อ/ใบกำกับภาษี', color: 'text-orange-700' },
  { value: 'po_approved', label: 'ส่งใบกำกับภาษี/ใบเสร็จรับเงิน (ดึงสด)', color: 'text-green-700' },
  { value: 'completed', label: 'ส่งสิ้งซื้อ', color: 'text-gray-700' },
  { value: 'awaiting_invoice', label: 'แบงค์จ่ายใบวางบิล/ใบแจ้งหนี้', color: 'text-purple-700' },
  { value: 'awaiting_tax', label: 'แบงค์จ่ายใบสั่งซื้อ/ใบกำกับภาษี', color: 'text-indigo-700' },
  { value: 'awaiting_receipt', label: 'แบงค์จ่ายใบกำกับภาษี/ใบเสร็จรับเงิน (ดึงสด)', color: 'text-teal-700' },
  { value: 'partial_invoice', label: 'มัดจำใบวางบิล/ใบแจ้งหนี้', color: 'text-cyan-700' },
  { value: 'partial_tax', label: 'มัดจำใบสั่งซื้อ/ใบกำกับภาษี', color: 'text-sky-700' },
  { value: 'partial_receipt', label: 'มัดจำใบกำกับภาษี/ใบเสร็จรับเงิน (ดึงสด)', color: 'text-emerald-700' },
  { value: 'rejected', label: 'ไม่อนุมัติ', color: 'text-red-700' },
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
        <SelectItem value="pending">
          <span className="text-yellow-700">อนุมัติ</span>
        </SelectItem>
        <SelectItem value="quote_sent">
          <span className="text-blue-700">ส่งใบวางบิล/ใบแจ้งหนี้</span>
        </SelectItem>
        <SelectItem value="po_uploaded">
          <span className="text-orange-700">ส่งใบสั่งซื้อ/ใบกำกับภาษี</span>
        </SelectItem>
        <SelectItem value="po_approved">
          <span className="text-green-700">ส่งใบกำกับภาษี/ใบเสร็จรับเงิน (ดึงสด)</span>
        </SelectItem>
        <SelectItem value="completed">
          <span className="text-gray-700">ส่งสิ้งซื้อ</span>
        </SelectItem>
        <SelectItem value="awaiting_invoice">
          <span className="text-purple-700">แบงค์จ่ายใบวางบิล/ใบแจ้งหนี้</span>
        </SelectItem>
        <SelectItem value="awaiting_tax">
          <span className="text-indigo-700">แบงค์จ่ายใบสั่งซื้อ/ใบกำกับภาษี</span>
        </SelectItem>
        <SelectItem value="awaiting_receipt">
          <span className="text-teal-700">แบงค์จ่ายใบกำกับภาษี/ใบเสร็จรับเงิน (ดึงสด)</span>
        </SelectItem>
        <SelectItem value="partial_invoice">
          <span className="text-cyan-700">มัดจำใบวางบิล/ใบแจ้งหนี้</span>
        </SelectItem>
        <SelectItem value="partial_tax">
          <span className="text-sky-700">มัดจำใบสั่งซื้อ/ใบกำกับภาษี</span>
        </SelectItem>
        <SelectItem value="partial_receipt">
          <span className="text-emerald-700">มัดจำใบกำกับภาษี/ใบเสร็จรับเงิน (ดึงสด)</span>
        </SelectItem>
        <SelectItem value="rejected">
          <span className="text-red-700">ไม่อนุมัติ</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

// src/components/admin/AssignedSalesBadge.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from 'lucide-react';

interface AssignedSalesBadgeProps {
  assignedTo: string | null;
  size?: 'sm' | 'md';
}

export default function AssignedSalesBadge({ assignedTo, size = 'sm' }: AssignedSalesBadgeProps) {
  const [salesName, setSalesName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assignedTo) {
      loadSalesName();
    } else {
      setLoading(false);
    }
  }, [assignedTo]);

  const loadSalesName = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', assignedTo)
        .maybeSingle();

      if (error) throw error;
      setSalesName(data?.full_name || '');
    } catch (error) {
      console.error('Error loading sales name:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-1 text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        <User className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
        <span>...</span>
      </div>
    );
  }

  if (!assignedTo || !salesName) {
    return (
      <div className={`flex items-center gap-1 text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        <User className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
        <span>ยังไม่มอบหมาย</span>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return name.substring(0, 2);
  };

  const initials = getInitials(salesName);

  return (
    <div className={`flex items-center gap-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      <div
        className={`${
          size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
        } rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold`}
        title={salesName}
      >
        {initials}
      </div>
      <span className="text-gray-700 font-medium truncate max-w-[120px]" title={salesName}>
        {salesName}
      </span>
    </div>
  );
}

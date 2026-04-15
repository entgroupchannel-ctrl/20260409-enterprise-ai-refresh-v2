import { Badge } from '@/components/ui/badge';
import { Clock, Package, Search, DollarSign, CheckCircle, Wrench, PartyPopper, Send, XCircle, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; icon: any; className: string }> = {
  pending: {
    label: 'รอรับเครื่อง',
    icon: Clock,
    className: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700',
  },
  received: {
    label: 'รับเครื่องแล้ว',
    icon: Package,
    className: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
  },
  diagnosing: {
    label: 'กำลังวิเคราะห์',
    icon: Search,
    className: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700',
  },
  quoted: {
    label: 'รอลูกค้าอนุมัติ',
    icon: DollarSign,
    className: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700',
  },
  approved: {
    label: 'อนุมัติแล้ว',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
  },
  repairing: {
    label: 'กำลังซ่อม',
    icon: Wrench,
    className: 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-700',
  },
  done: {
    label: 'ซ่อมเสร็จ',
    icon: PartyPopper,
    className: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700',
  },
  delivered: {
    label: 'ส่งคืนแล้ว',
    icon: Send,
    className: 'bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-700',
  },
  rejected: {
    label: 'ปฏิเสธ',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
  },
  cancelled: {
    label: 'ยกเลิก',
    icon: Ban,
    className: 'bg-muted text-muted-foreground border-border',
  },
};

interface Props {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function RepairStatusBadge({ status, size = 'md', className }: Props) {
  const config = STATUS_CONFIG[status] || { label: status, icon: Clock, className: 'bg-muted text-muted-foreground border-border' };
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      <Icon className={cn('mr-1', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      {config.label}
    </Badge>
  );
}

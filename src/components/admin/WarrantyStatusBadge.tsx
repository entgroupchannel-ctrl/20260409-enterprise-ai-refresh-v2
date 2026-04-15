import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, ShieldX, Clock, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  status: 'active' | 'expiring' | 'expired' | 'void' | 'pending_verification' | 'not_registered';
  daysRemaining?: number;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUS_CONFIG = {
  active: {
    label: 'ในประกัน',
    icon: Shield,
    className: 'bg-green-100 text-green-700 hover:bg-green-100 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
  },
  expiring: {
    label: 'ใกล้หมด',
    icon: Clock,
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700',
  },
  expired: {
    label: 'หมดประกัน',
    icon: ShieldX,
    className: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
  },
  void: {
    label: 'ยกเลิก',
    icon: ShieldX,
    className: 'bg-muted text-muted-foreground hover:bg-muted border-border',
  },
  pending_verification: {
    label: 'รออนุมัติ',
    icon: ShieldAlert,
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
  },
  not_registered: {
    label: 'ยังไม่ลงทะเบียน',
    icon: HelpCircle,
    className: 'bg-muted text-muted-foreground hover:bg-muted border-border',
  },
};

export default function WarrantyStatusBadge({ status, daysRemaining, size = 'md', className }: Props) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_registered;
  const Icon = config.icon;

  let suffix = '';
  if ((status === 'active' || status === 'expiring') && daysRemaining !== undefined) {
    suffix = ` (${daysRemaining} วัน)`;
  } else if (status === 'expired' && daysRemaining !== undefined) {
    suffix = ` (${Math.abs(daysRemaining)} วันที่แล้ว)`;
  }

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      <Icon className={cn('mr-1', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      {config.label}{suffix}
    </Badge>
  );
}

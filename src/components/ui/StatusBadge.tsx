import { Badge } from '@/components/ui/badge';
import { getStatusLabel, getStatusColor, getSOStatusLabel, getSOStatusColor } from '@/lib/statusConfig';
import { useI18n } from '@/contexts/I18nContext';

interface StatusBadgeProps {
  status: string;
  type?: 'quote' | 'so';
  className?: string;
}

export function StatusBadge({ status, type = 'quote', className = '' }: StatusBadgeProps) {
  const { lang } = useI18n();

  const langKey = lang === "zh" ? "en" : lang;
  const label = type === 'so' ? getSOStatusLabel(status, langKey) : getStatusLabel(status, langKey);
  const color = type === 'so' ? getSOStatusColor(status) : getStatusColor(status);

  return (
    <Badge className={`${color} border-0 font-medium ${className}`}>
      {label}
    </Badge>
  );
}

export default StatusBadge;

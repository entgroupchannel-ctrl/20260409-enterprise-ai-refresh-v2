import { Badge } from '@/components/ui/badge';

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'ร่าง', className: 'bg-muted text-muted-foreground' },
  pending: { label: 'รออนุมัติ', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  approved: { label: 'อนุมัติแล้ว', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  rejected: { label: 'ปฏิเสธ', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  suspended: { label: 'ระงับ', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
};

export default function SupplierStatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig.draft;
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
}

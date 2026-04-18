import { Badge } from '@/components/ui/badge';

export const LIFECYCLE_STAGES = [
  { value: 'discovery',     label: 'Discovery',         color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
  { value: 'pre_qualified', label: 'Pre-qualified',     color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'video_call',    label: 'Video Call',        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { value: 'sample',        label: 'Sample',            color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { value: 'pilot',         label: 'Pilot Order',       color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  { value: 'partner',       label: 'Active Partner',    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  { value: 'disqualified',  label: 'Disqualified',      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
] as const;

export type LifecycleStage = typeof LIFECYCLE_STAGES[number]['value'];

export default function SupplierLifecycleBadge({ stage }: { stage: string | null | undefined }) {
  const cfg = LIFECYCLE_STAGES.find(s => s.value === stage) ?? LIFECYCLE_STAGES[0];
  return <Badge className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>;
}

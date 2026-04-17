import { formatProductSpec } from '@/lib/format-spec';

interface Props {
  description?: string | null;
  /** สำหรับใน UI admin (text-sm) หรือใน PDF (text-sm gray) */
  variant?: 'ui' | 'pdf';
}

/**
 * แสดงรายละเอียดสินค้าแบบจัดระเบียบ
 * - section heading (ตัวหนา)
 * - field bullet (• Label: value)
 * - text ทั่วไป
 *
 * ถ้า admin ใส่ \n เองจะใช้ตามนั้น
 */
export default function ProductSpecDisplay({ description, variant = 'ui' }: Props) {
  const { lines } = formatProductSpec(description);

  if (lines.length === 0) return null;

  const baseColor = variant === 'pdf' ? 'text-gray-700' : 'text-muted-foreground';
  const sectionColor = variant === 'pdf' ? 'text-gray-900' : 'text-foreground';

  return (
    <div className={`text-sm space-y-1 leading-relaxed ${baseColor}`}>
      {lines.map((line, idx) => {
        if (line.type === 'section') {
          return (
            <div key={idx} className={`font-semibold uppercase tracking-wide text-xs mt-2 ${sectionColor}`}>
              {line.label}
              {line.value && <span className={`ml-2 font-normal normal-case tracking-normal ${baseColor}`}>{line.value}</span>}
            </div>
          );
        }
        if (line.type === 'field') {
          return (
            <div key={idx} className="flex gap-2 pl-2">
              <span className="text-primary shrink-0">•</span>
              <span>
                <span className={`font-medium ${sectionColor}`}>{line.label}:</span>{' '}
                <span>{line.value}</span>
              </span>
            </div>
          );
        }
        return (
          <p key={idx} className="whitespace-pre-line">{line.value}</p>
        );
      })}
    </div>
  );
}

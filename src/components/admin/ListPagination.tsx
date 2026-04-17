import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface ListPaginationProps {
  /** Current 1-indexed page */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total filtered items count */
  totalItems: number;
  /** Sum of grand_total across ALL filtered items (not just current page) */
  totalAmount: number;
  /** Optional secondary sum (e.g. current page only) */
  pageAmount?: number;
  /** Currency formatter */
  formatCurrency: (n: number) => string;
  /** Page size options */
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  /** Label for the entity (e.g. "ใบเสนอราคา") */
  itemLabel?: string;
}

export default function ListPagination({
  page,
  pageSize,
  totalItems,
  totalAmount,
  pageAmount,
  formatCurrency,
  pageSizeOptions = [20, 50, 100, 200],
  onPageChange,
  onPageSizeChange,
  itemLabel = 'รายการ',
}: ListPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIdx = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, totalItems);

  const goFirst = () => onPageChange(1);
  const goPrev = () => onPageChange(Math.max(1, safePage - 1));
  const goNext = () => onPageChange(Math.min(totalPages, safePage + 1));
  const goLast = () => onPageChange(totalPages);

  // Generate compact page numbers (max 5 visible)
  const getPageNumbers = (): number[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safePage <= 3) return [1, 2, 3, 4, 5];
    if (safePage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2];
  };

  return (
    <div className="rounded-lg border bg-card">
      {/* Summary row */}
      <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          แสดง <span className="font-medium text-foreground">{startIdx.toLocaleString('th-TH')}</span>
          {' – '}
          <span className="font-medium text-foreground">{endIdx.toLocaleString('th-TH')}</span>
          {' จาก '}
          <span className="font-medium text-foreground">{totalItems.toLocaleString('th-TH')}</span>{' '}
          {itemLabel}
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">ยอดรวมทั้งหมด</div>
          <div className="text-xl font-bold text-primary">{formatCurrency(totalAmount)}</div>
          {typeof pageAmount === 'number' && pageAmount !== totalAmount && (
            <div className="text-xs text-muted-foreground">
              หน้านี้: <span className="font-medium">{formatCurrency(pageAmount)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pagination row */}
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">รายการต่อหน้า</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goFirst}
            disabled={safePage === 1}
            aria-label="หน้าแรก"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goPrev}
            disabled={safePage === 1}
            aria-label="ก่อนหน้า"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((p) => (
            <Button
              key={p}
              variant={p === safePage ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goNext}
            disabled={safePage === totalPages}
            aria-label="ถัดไป"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goLast}
            disabled={safePage === totalPages}
            aria-label="หน้าสุดท้าย"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

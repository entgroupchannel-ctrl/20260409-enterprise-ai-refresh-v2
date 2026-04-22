import { X, ShoppingBag, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AddToCartButton from '@/components/AddToCartButton';

interface Product {
  id: string;
  slug: string;
  model: string;
  name: string;
  thumbnail_url: string | null;
  cpu: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  storage_type: string | null;
  has_wifi: boolean;
  has_4g: boolean;
  os: string | null;
  form_factor: string | null;
  unit_price: number;
  stock_status: string | null;
}

interface CompareProps {
  products: Product[];
  onRemove: (slug: string) => void;
}

type SpecRow = {
  key: string;
  label: string;
  type?: 'boolean' | 'currency' | 'status';
  bestDirection?: 'highest' | 'lowest';
  unit?: string;
};

const specRows: SpecRow[] = [
  { key: 'cpu', label: 'CPU' },
  { key: 'ram_gb', label: 'RAM', unit: 'GB', bestDirection: 'highest' },
  { key: 'storage_gb', label: 'Storage', unit: 'GB', bestDirection: 'highest' },
  { key: 'storage_type', label: 'Storage Type' },
  { key: 'has_wifi', label: 'WiFi', type: 'boolean' },
  { key: 'has_4g', label: '4G LTE', type: 'boolean' },
  { key: 'os', label: 'OS' },
  { key: 'form_factor', label: 'Form Factor' },
  { key: 'unit_price', label: 'ราคา/หน่วย', type: 'currency', bestDirection: 'lowest' },
  { key: 'stock_status', label: 'สถานะสต็อก', type: 'status' },
];

function fmt(n: number) { return n.toLocaleString('th-TH'); }

function getCellValue(product: Product, row: SpecRow): string {
  const val = (product as any)[row.key];
  if (val === null || val === undefined) return '-';
  if (row.type === 'boolean') return val ? '✅' : '❌';
  if (row.type === 'currency') return `฿${fmt(val)}`;
  if (row.type === 'status') {
    return val === 'available' ? '🟢 มีสินค้า' : val === 'low_stock' ? '🟡 ใกล้หมด' : '🔴 หมด';
  }
  return row.unit ? `${val} ${row.unit}` : String(val);
}

function getBestIndex(products: Product[], row: SpecRow): number {
  if (!row.bestDirection || products.length < 2) return -1;
  const vals = products.map(p => {
    const v = (p as any)[row.key];
    return typeof v === 'number' ? v : (v === true ? 1 : 0);
  });
  if (row.bestDirection === 'highest') {
    const max = Math.max(...vals);
    return vals.indexOf(max);
  }
  const nonZero = vals.filter(v => v > 0);
  if (nonZero.length === 0) return -1;
  const min = Math.min(...nonZero);
  return vals.indexOf(min);
}

export default function SpecComparisonTable({ products, onRemove }: CompareProps) {
  if (products.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground sticky left-0 bg-background z-10 min-w-[120px]" />
            {products.map(p => (
              <th key={p.slug} className="p-3 text-center min-w-[180px]">
                <div className="space-y-2">
                  <button onClick={() => onRemove(p.slug)} className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                  <Link to={`/shop/${p.slug}`}>
                    <div className="w-24 h-24 mx-auto bg-muted rounded-lg overflow-hidden">
                      <img
                        src={p.thumbnail_url || '/product-placeholder.svg'}
                        alt={p.model}
                        className="w-full h-full object-contain"
                        onError={(e) = loading="lazy" decoding="async"> {
                          const img = e.currentTarget;
                          if (!img.src.endsWith('/product-placeholder.svg')) {
                            img.src = '/product-placeholder.svg';
                          }
                        }}
                      />
                    </div>
                  </Link>
                  <p className="font-semibold text-sm">{p.model}</p>
                  <div className="flex gap-1 justify-center">
                    <AddToCartButton productModel={p.model} productName={p.name} size="sm" variant="outline" />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specRows.map((row, ri) => {
            const bestIdx = getBestIndex(products, row);
            return (
              <tr key={row.key} className={ri % 2 === 0 ? 'bg-muted/30' : ''}>
                <td className="p-3 text-sm font-medium sticky left-0 bg-background z-10 border-r border-border">{row.label}</td>
                {products.map((p, pi) => (
                  <td key={p.slug} className={cn("p-3 text-center text-sm", pi === bestIdx && "text-primary font-semibold")}>
                    {getCellValue(p, row)}
                    {pi === bestIdx && row.bestDirection && <span className="ml-1">⭐</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

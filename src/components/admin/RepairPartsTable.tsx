import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

export interface RepairPart {
  id?: string;
  part_name: string;
  part_sku: string;
  part_description: string;
  quantity: number;
  unit_price: number;
  product_id?: string | null;
}

interface Props {
  parts: RepairPart[];
  onChange: (parts: RepairPart[]) => void;
  readOnly?: boolean;
}

export default function RepairPartsTable({ parts, onChange, readOnly }: Props) {
  const addPart = () => {
    onChange([...parts, { part_name: '', part_sku: '', part_description: '', quantity: 1, unit_price: 0 }]);
  };

  const updatePart = (idx: number, field: keyof RepairPart, value: any) => {
    const updated = [...parts];
    (updated[idx] as any)[field] = value;
    onChange(updated);
  };

  const removePart = (idx: number) => {
    onChange(parts.filter((_, i) => i !== idx));
  };

  const partsTotal = parts.reduce((sum, p) => sum + p.quantity * p.unit_price, 0);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-2 px-1 min-w-[160px]">ชิ้นส่วน</th>
              <th className="py-2 px-1 w-24">SKU</th>
              <th className="py-2 px-1 w-16 text-center">จำนวน</th>
              <th className="py-2 px-1 w-28 text-right">ราคา/หน่วย</th>
              <th className="py-2 px-1 w-28 text-right">รวม</th>
              {!readOnly && <th className="py-2 px-1 w-10" />}
            </tr>
          </thead>
          <tbody>
            {parts.map((p, i) => (
              <tr key={i} className="border-b">
                <td className="py-1.5 px-1">
                  {readOnly ? p.part_name : (
                    <Input value={p.part_name} onChange={e => updatePart(i, 'part_name', e.target.value)} placeholder="ชื่อชิ้นส่วน" className="h-8" />
                  )}
                </td>
                <td className="py-1.5 px-1">
                  {readOnly ? (p.part_sku || '-') : (
                    <Input value={p.part_sku} onChange={e => updatePart(i, 'part_sku', e.target.value)} placeholder="SKU" className="h-8" />
                  )}
                </td>
                <td className="py-1.5 px-1">
                  {readOnly ? p.quantity : (
                    <Input type="number" min={1} value={p.quantity} onChange={e => updatePart(i, 'quantity', parseInt(e.target.value) || 1)} className="h-8 text-center" />
                  )}
                </td>
                <td className="py-1.5 px-1">
                  {readOnly ? (
                    <span className="block text-right">{p.unit_price.toLocaleString()}</span>
                  ) : (
                    <Input type="number" min={0} value={p.unit_price} onChange={e => updatePart(i, 'unit_price', parseFloat(e.target.value) || 0)} className="h-8 text-right" />
                  )}
                </td>
                <td className="py-1.5 px-1 text-right font-medium">
                  ฿{(p.quantity * p.unit_price).toLocaleString()}
                </td>
                {!readOnly && (
                  <td className="py-1.5 px-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removePart(i)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {parts.length === 0 && (
              <tr><td colSpan={readOnly ? 5 : 6} className="py-4 text-center text-muted-foreground">ยังไม่มีชิ้นส่วน</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={4} className="py-2 px-1 text-right">รวมค่าชิ้นส่วน:</td>
              <td className="py-2 px-1 text-right">฿{partsTotal.toLocaleString()}</td>
              {!readOnly && <td />}
            </tr>
          </tfoot>
        </table>
      </div>
      {!readOnly && (
        <Button variant="outline" size="sm" onClick={addPart}>
          <Plus className="w-3.5 h-3.5 mr-1" /> เพิ่มชิ้นส่วน
        </Button>
      )}
    </div>
  );
}

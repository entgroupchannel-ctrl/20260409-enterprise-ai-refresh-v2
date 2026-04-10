import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Plus, Trash2 } from 'lucide-react';

export interface FreeItem {
  id: string;
  model: string;
  description?: string;
  qty: number;
  unit_value: number;
  total_value: number;
  added_by: 'admin' | 'system';
  added_at: string;
  notes?: string;
}

interface FreeItemsEditorProps {
  freeItems: FreeItem[];
  onChange: (items: FreeItem[]) => void;
  disabled?: boolean;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);

export default function FreeItemsEditor({ freeItems, onChange, disabled }: FreeItemsEditorProps) {
  const totalValue = freeItems.reduce((sum, item) => sum + (item.total_value || 0), 0);

  const addItem = () => {
    const newItem: FreeItem = {
      id: crypto.randomUUID(),
      model: '',
      qty: 1,
      unit_value: 0,
      total_value: 0,
      added_by: 'admin',
      added_at: new Date().toISOString(),
    };
    onChange([...freeItems, newItem]);
  };

  const updateItem = (index: number, field: keyof FreeItem, value: any) => {
    const updated = [...freeItems];
    (updated[index] as any)[field] = value;
    // Recalculate total_value
    if (field === 'qty' || field === 'unit_value') {
      updated[index].total_value = (Number(updated[index].qty) || 0) * (Number(updated[index].unit_value) || 0);
    }
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(freeItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-sm font-semibold">
          <Gift className="w-4 h-4 text-amber-500" />
          ของแถม (Free Items)
        </Label>
        {!disabled && (
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            เพิ่มของแถม
          </Button>
        )}
      </div>

      {freeItems.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-3">ไม่มีของแถม</p>
      ) : (
        <div className="space-y-2">
          {freeItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/10 rounded border border-amber-200 dark:border-amber-800">
              <div className="flex-1 grid grid-cols-4 gap-2">
                <Input
                  placeholder="ชื่อ/รุ่น"
                  value={item.model}
                  onChange={(e) => updateItem(index, 'model', e.target.value)}
                  disabled={disabled}
                  className="text-sm col-span-2"
                />
                <Input
                  type="number"
                  placeholder="จำนวน"
                  min={1}
                  value={item.qty || ''}
                  onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)}
                  disabled={disabled}
                  className="text-sm"
                  onFocus={(e) => e.target.select()}
                />
                <Input
                  type="number"
                  placeholder="มูลค่า/หน่วย"
                  min={0}
                  value={item.unit_value || ''}
                  onChange={(e) => updateItem(index, 'unit_value', parseFloat(e.target.value) || 0)}
                  disabled={disabled}
                  className="text-sm"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              {!disabled && (
                <Button type="button" size="icon" variant="ghost" className="shrink-0 h-8 w-8 text-destructive" onClick={() => removeItem(index)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {freeItems.length > 0 && (
        <div className="text-right text-sm">
          <span className="text-muted-foreground">มูลค่าของแถมรวม: </span>
          <span className="font-semibold text-amber-600">{formatCurrency(totalValue)}</span>
          <span className="text-xs text-muted-foreground ml-1">(ฟรี)</span>
        </div>
      )}
    </div>
  );
}

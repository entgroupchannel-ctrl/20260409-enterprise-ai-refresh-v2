import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency, type QuoteProduct } from "@/lib/quote-utils";

interface QuoteItemsFormProps {
  items: QuoteProduct[];
  onChange: (items: QuoteProduct[]) => void;
}

const emptyItem: QuoteProduct = {
  model: "",
  description: "",
  category: "",
  qty: 1,
  unit_price: 0,
  discount_percent: 0,
  line_total: 0,
};

const QuoteItemsForm = ({ items, onChange }: QuoteItemsFormProps) => {
  const updateItem = (index: number, field: keyof QuoteProduct, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    // Recalculate line total
    const item = updated[index];
    const base = item.qty * item.unit_price;
    item.line_total = base - (base * item.discount_percent / 100);
    onChange(updated);
  };

  const addItem = () => onChange([...items, { ...emptyItem }]);
  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg border border-border bg-card">
          <div className="col-span-3">
            <label className="text-[10px] text-muted-foreground uppercase">รุ่น</label>
            <Input value={item.model} onChange={(e) => updateItem(i, "model", e.target.value)} placeholder="GT-156" className="h-8 text-sm" />
          </div>
          <div className="col-span-4">
            <label className="text-[10px] text-muted-foreground uppercase">รายละเอียด</label>
            <Input value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} placeholder="15.6 Panel PC..." className="h-8 text-sm" />
          </div>
          <div className="col-span-1">
            <label className="text-[10px] text-muted-foreground uppercase">จำนวน</label>
            <Input type="number" min={1} value={item.qty} onChange={(e) => updateItem(i, "qty", parseInt(e.target.value) || 1)} className="h-8 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] text-muted-foreground uppercase">ราคา/หน่วย</label>
            <Input type="number" min={0} value={item.unit_price} onChange={(e) => updateItem(i, "unit_price", parseFloat(e.target.value) || 0)} className="h-8 text-sm" />
          </div>
          <div className="col-span-1">
            <label className="text-[10px] text-muted-foreground uppercase">ลด%</label>
            <Input type="number" min={0} max={100} value={item.discount_percent} onChange={(e) => updateItem(i, "discount_percent", parseFloat(e.target.value) || 0)} className="h-8 text-sm" />
          </div>
          <div className="col-span-1 flex items-end gap-1">
            <span className="text-xs font-medium text-foreground mb-2">{formatCurrency(item.line_total)}</span>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeItem(i)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full">
        <Plus className="w-4 h-4 mr-1.5" /> เพิ่มรายการ
      </Button>
    </div>
  );
};

export default QuoteItemsForm;

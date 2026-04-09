// src/components/admin/ProductEditor.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  model: string;
  description: string;
  qty: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  notes?: string;
}

interface ProductEditorProps {
  products: Product[];
  onUpdate: (products: Product[]) => void;
  disabled?: boolean;
}

export default function ProductEditor({ products, onUpdate, disabled = false }: ProductEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editForm, setEditForm] = useState<Product>({
    model: '',
    description: '',
    qty: 1,
    unit_price: 0,
    discount_percent: 0,
    line_total: 0,
    notes: '',
  });

  const calculateLineTotal = (qty: number, unitPrice: number, discount: number) => {
    const subtotal = qty * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const handleFormChange = (field: string, value: any) => {
    const updated = { ...editForm, [field]: value };
    
    // Recalculate line total when qty, price, or discount changes
    if (['qty', 'unit_price', 'discount_percent'].includes(field)) {
      updated.line_total = calculateLineTotal(
        updated.qty,
        updated.unit_price,
        updated.discount_percent
      );
    }
    
    setEditForm(updated);
  };

  const handleAdd = () => {
    const newProducts = [...products, editForm];
    onUpdate(newProducts);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...products[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    
    const newProducts = [...products];
    newProducts[editingIndex] = editForm;
    onUpdate(newProducts);
    setEditingIndex(null);
    resetForm();
  };

  const handleDelete = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    onUpdate(newProducts);
  };

  const resetForm = () => {
    setEditForm({
      model: '',
      description: '',
      qty: 1,
      unit_price: 0,
      discount_percent: 0,
      line_total: 0,
      notes: '',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-3">
      {products.map((product, index) => (
        <div key={index}>
          {editingIndex === index ? (
            // Edit Mode
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>รุ่น/Model *</Label>
                    <Input
                      value={editForm.model}
                      onChange={(e) => handleFormChange('model', e.target.value)}
                      placeholder="เช่น GT-156"
                    />
                  </div>
                  <div>
                    <Label>รายละเอียด</Label>
                    <Input
                      value={editForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="รายละเอียดสินค้า"
                    />
                  </div>
                  <div>
                    <Label>จำนวน *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={editForm.qty}
                      onChange={(e) => handleFormChange('qty', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>ราคา/หน่วย (บาท) *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={editForm.unit_price}
                      onChange={(e) => handleFormChange('unit_price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>ส่วนลด (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editForm.discount_percent}
                      onChange={(e) =>
                        handleFormChange('discount_percent', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div>
                    <Label>ยอดรวม</Label>
                    <Input
                      value={formatCurrency(editForm.line_total)}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>หมายเหตุ</Label>
                    <Textarea
                      value={editForm.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      placeholder="หมายเหตุเพิ่มเติม..."
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingIndex(null);
                      resetForm();
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    ยกเลิก
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Save className="w-4 h-4 mr-2" />
                    บันทึก
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // View Mode
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center gap-2 text-foreground">
                    {product.model || 'N/A'}
                    <span className="text-xs text-muted-foreground font-normal">x{product.qty}</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  {product.notes && (
                    <p className="text-sm text-primary mt-1">หมายเหตุ: {product.notes}</p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-primary">
                    {formatCurrency(product.line_total || 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(product.unit_price)} / หน่วย
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-4">
                  <span>จำนวน: {product.qty}</span>
                  <span>ราคา/หน่วย: {formatCurrency(product.unit_price)}</span>
                  {product.discount_percent > 0 && (
                    <span className="text-green-600 dark:text-green-400">ส่วนลด {product.discount_percent}%</span>
                  )}
                </div>
                
                {!disabled && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(index)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      แก้ไข
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      ลบ
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Button */}
      {!disabled && (
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มรายการสินค้า
        </Button>
      )}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>เพิ่มรายการสินค้า</DialogTitle>
            <DialogDescription>กรอกข้อมูลสินค้าที่ต้องการเพิ่ม</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label>รุ่น/Model *</Label>
              <Input
                value={editForm.model}
                onChange={(e) => handleFormChange('model', e.target.value)}
                placeholder="เช่น GT-156"
              />
            </div>
            <div>
              <Label>รายละเอียด</Label>
              <Input
                value={editForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="รายละเอียดสินค้า"
              />
            </div>
            <div>
              <Label>จำนวน *</Label>
              <Input
                type="number"
                min="1"
                value={editForm.qty}
                onChange={(e) => handleFormChange('qty', parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label>ราคา/หน่วย (บาท) *</Label>
              <Input
                type="number"
                min="0"
                value={editForm.unit_price}
                onChange={(e) => handleFormChange('unit_price', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>ส่วนลด (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={editForm.discount_percent}
                onChange={(e) =>
                  handleFormChange('discount_percent', parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Label>ยอดรวม</Label>
              <Input
                value={formatCurrency(editForm.line_total)}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="md:col-span-2">
              <Label>หมายเหตุ</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="หมายเหตุเพิ่มเติม..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!editForm.model || editForm.qty <= 0 || editForm.unit_price <= 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มสินค้า
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

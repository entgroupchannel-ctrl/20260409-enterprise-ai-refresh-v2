import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, type QuoteProduct } from "@/lib/quote-utils";
import { Pencil, Trash2 } from "lucide-react";

interface QuoteProductListProps {
  products: QuoteProduct[];
  editable?: boolean;
  onEdit?: (index: number, product: QuoteProduct) => void;
  onRemove?: (index: number) => void;
}

const QuoteProductList = ({ products, editable = false, onEdit, onRemove }: QuoteProductListProps) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>รายการสินค้า</TableHead>
          <TableHead className="text-right">จำนวน</TableHead>
          <TableHead className="text-right">ราคา/หน่วย</TableHead>
          <TableHead className="text-right">ส่วนลด</TableHead>
          <TableHead className="text-right">รวม</TableHead>
          {editable && <TableHead className="w-20" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="font-medium text-foreground">{product.model}</div>
              <div className="text-sm text-muted-foreground">{product.description}</div>
              {product.notes && <div className="text-xs text-muted-foreground mt-1">📝 {product.notes}</div>}
            </TableCell>
            <TableCell className="text-right">{product.qty}</TableCell>
            <TableCell className="text-right">{formatCurrency(product.unit_price)}</TableCell>
            <TableCell className="text-right">{product.discount_percent > 0 ? `${product.discount_percent}%` : "-"}</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(product.line_total)}</TableCell>
            {editable && (
              <TableCell>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit?.(index, product)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onRemove?.(index)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default QuoteProductList;

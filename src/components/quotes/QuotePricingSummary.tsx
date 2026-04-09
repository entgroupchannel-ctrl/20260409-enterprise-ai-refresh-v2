import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/quote-utils";

interface QuotePricingSummaryProps {
  subtotal: number;
  discountAmount: number;
  vatPercent: number;
  vatAmount: number;
  grandTotal: number;
}

const QuotePricingSummary = ({ subtotal, discountAmount, vatPercent, vatAmount, grandTotal }: QuotePricingSummaryProps) => (
  <Card>
    <CardContent className="p-4 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">ยอดรวม</span>
        <span className="text-foreground">{formatCurrency(subtotal)}</span>
      </div>
      {discountAmount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">ส่วนลด</span>
          <span className="text-destructive">-{formatCurrency(discountAmount)}</span>
        </div>
      )}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">VAT {vatPercent}%</span>
        <span className="text-foreground">{formatCurrency(vatAmount)}</span>
      </div>
      <Separator />
      <div className="flex justify-between text-lg font-bold">
        <span className="text-foreground">รวมทั้งสิ้น</span>
        <span className="text-primary">{formatCurrency(grandTotal)}</span>
      </div>
    </CardContent>
  </Card>
);

export default QuotePricingSummary;

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusLabel, formatRelativeTime, type QuoteRequest } from "@/lib/quote-utils";
import SLABadge from "./SLABadge";
import { cn } from "@/lib/utils";
import { Building, Mail, Phone } from "lucide-react";

interface QuoteSummaryCardProps {
  quote: QuoteRequest;
  onClick?: () => void;
}

const QuoteSummaryCard = ({ quote, onClick }: QuoteSummaryCardProps) => {
  const colors = getStatusColor(quote.status);

  return (
    <Card
      className={cn("cursor-pointer hover:shadow-md transition-all border", colors.border)}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-mono font-bold text-primary">{quote.quote_number}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{quote.customer_name}</p>
          </div>
          <Badge className={cn("text-xs", colors.bg, colors.text, colors.border)} variant="outline">
            {getStatusLabel(quote.status)}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {quote.customer_company && (
            <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {quote.customer_company}</span>
          )}
          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {quote.customer_email}</span>
          {quote.customer_phone && (
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {quote.customer_phone}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{formatRelativeTime(quote.created_at)}</span>
          {quote.grand_total && (
            <span className="font-bold text-foreground">
              {new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(quote.grand_total)}
            </span>
          )}
        </div>

        {quote.sla_response_due && quote.status === "pending" && (
          <SLABadge dueDate={quote.sla_response_due} breached={quote.sla_breached} />
        )}
        {quote.sla_po_review_due && quote.status === "po_uploaded" && (
          <SLABadge dueDate={quote.sla_po_review_due} breached={quote.sla_breached} />
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteSummaryCard;

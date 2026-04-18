import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatNowButtonProps {
  productModel: string;
  productName?: string;
  className?: string;
  size?: "sm" | "icon" | "default";
  variant?: "outline" | "ghost" | "secondary";
}

/**
 * Small icon-only "Chat now" button that opens the GeneralChatWidget
 * with a prefilled message focused on a specific product.
 */
const ChatNowButton = ({
  productModel,
  productName,
  className,
  size = "icon",
  variant = "outline",
}: ChatNowButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const label = productName && productName !== productModel
      ? `${productModel} — ${productName}`
      : productModel;
    const message = `สนใจสอบถามรายละเอียดสินค้า: ${label}`;
    window.dispatchEvent(
      new CustomEvent("ent:open-chat", { detail: { message } }),
    );
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleClick}
      className={cn("h-8 w-8 shrink-0", className)}
      title={`แชทกับทีมขายเกี่ยวกับ ${productModel}`}
      aria-label={`Chat now about ${productModel}`}
    >
      <MessageCircle className="w-3.5 h-3.5" />
    </Button>
  );
};

export default ChatNowButton;

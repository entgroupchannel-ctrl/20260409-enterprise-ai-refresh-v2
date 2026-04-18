import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface ChatNowButtonProps {
  productModel: string;
  productName?: string;
  className?: string;
  size?: "sm" | "icon" | "default";
  variant?: "outline" | "ghost" | "secondary";
  tooltipLabel?: string;
}

/**
 * Small icon-only "Chat now" button that opens the GeneralChatWidget
 * with a prefilled message focused on a specific product.
 * Uses shadcn Tooltip for hover hint.
 */
const ChatNowButton = ({
  productModel,
  productName,
  className,
  size = "icon",
  variant = "outline",
  tooltipLabel,
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

  const hint = tooltipLabel ?? `แชทกับทีมขายเกี่ยวกับ ${productModel}`;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size={size}
            variant={variant}
            onClick={handleClick}
            className={cn("h-8 w-8 shrink-0", className)}
            aria-label={`Chat now about ${productModel}`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipPrimitive.Portal>
          <TooltipContent
            side="top"
            align="center"
            sideOffset={8}
            collisionPadding={16}
            avoidCollisions
            className="text-xs z-[200] max-w-[240px]"
          >
            {hint}
          </TooltipContent>
        </TooltipPrimitive.Portal>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChatNowButton;

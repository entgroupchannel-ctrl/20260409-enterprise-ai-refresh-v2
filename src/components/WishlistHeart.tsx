import { Heart } from "lucide-react";
import { useWishlist, WishlistItem } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface WishlistHeartProps {
  item: WishlistItem;
  className?: string;
  size?: number;
}

const WishlistHeart = ({ item, className, size = 18 }: WishlistHeartProps) => {
  const { isLiked, toggle } = useWishlist();
  const liked = isLiked(item.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
        liked
          ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50",
        className
      )}
      title={liked ? "เอาออกจากรายการถูกใจ" : "เพิ่มในรายการถูกใจ"}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart size={size} className={liked ? "fill-current" : ""} />
    </button>
  );
};

export default WishlistHeart;

import { useState, useRef, useEffect } from "react";
import { Share2, Facebook, Link2, ThumbsUp } from "lucide-react";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";

interface ShareButtonsProps {
  url: string;
  title: string;
  compact?: boolean;
  productId?: string;
  productCategory?: string;
}

const ShareButtons = ({ url, title, compact = false, productId, productCategory }: ShareButtonsProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useEngagementTracker();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "width=600,height=400");
    trackEvent({ eventType: "share_facebook", productId, productCategory, productName: title });
    setShowMenu(false);
  };

  const shareToLine = () => {
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, "_blank", "width=600,height=400");
    trackEvent({ eventType: "share_line", productId, productCategory, productName: title });
    setShowMenu(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    trackEvent({ eventType: "share_copy_link", productId, productCategory, productName: title });
    setShowMenu(false);
  };

  const iconSize = compact ? 11 : 13;
  const btnClass = compact
    ? "inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
    : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors";

  return (
    <div className="flex gap-1.5 items-center">
      {/* Like */}
      <button
        onClick={() => setLiked(!liked)}
        className={`${btnClass} ${liked ? "text-primary border-primary/30 bg-primary/5" : ""}`}
      >
        <ThumbsUp size={iconSize} className={liked ? "fill-current" : ""} />
        {!compact && (liked ? "ถูกใจแล้ว" : "ถูกใจ")}
      </button>

      {/* Share dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={btnClass}
        >
          <Share2 size={iconSize} />
          {!compact && "แชร์"}
        </button>

        {showMenu && (
          <div className="absolute bottom-full mb-2 right-0 z-50 min-w-[160px] rounded-xl border border-border bg-popover shadow-lg p-1.5 animate-fade-in">
            <button
              onClick={shareToFacebook}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-secondary/60 transition-colors"
            >
              <Facebook size={14} className="text-[#1877F2]" />
              Facebook
            </button>
            <button
              onClick={shareToLine}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-secondary/60 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#06C755"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
              LINE
            </button>
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-secondary/60 transition-colors"
            >
              <Link2 size={14} className="text-muted-foreground" />
              {copied ? "คัดลอกแล้ว ✓" : "คัดลอกลิงก์"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareButtons;

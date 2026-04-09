import { Globe } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface LangToggleProps {
  variant?: "icon" | "compact" | "full";
  className?: string;
}

const LangToggle = ({ variant = "compact", className = "" }: LangToggleProps) => {
  const { lang, toggleLang } = useI18n();

  if (variant === "icon") {
    return (
      <button
        onClick={toggleLang}
        className={`p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground ${className}`}
        title={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
        aria-label="Toggle language"
      >
        <Globe size={16} />
      </button>
    );
  }

  if (variant === "full") {
    return (
      <div className={`inline-flex rounded-lg border border-border bg-background p-0.5 ${className}`}>
        <button
          onClick={() => lang !== "th" && toggleLang()}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            lang === "th" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
          ไทย
        </button>
        <button
          onClick={() => lang !== "en" && toggleLang()}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
          EN
        </button>
      </div>
    );
  }

  // Default: compact
  return (
    <button
      onClick={toggleLang}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ${className}`}
      title={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
    >
      <Globe size={12} />
      {lang === "th" ? "EN" : "ไทย"}
    </button>
  );
};

export default LangToggle;

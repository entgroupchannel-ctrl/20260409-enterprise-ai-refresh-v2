import { Globe } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import type { Lang } from "@/contexts/messages";

interface LangToggleProps {
  variant?: "icon" | "compact" | "full";
  className?: string;
}

const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "th", label: "ไทย", short: "TH" },
  { code: "en", label: "EN", short: "EN" },
  { code: "zh", label: "中文", short: "中" },
];

const LangToggle = ({ variant = "compact", className = "" }: LangToggleProps) => {
  const { lang, setLang } = useI18n();

  // Cycle: th → en → zh → th
  const cycleLang = () => {
    const idx = LANGS.findIndex((l) => l.code === lang);
    const next = LANGS[(idx + 1) % LANGS.length];
    setLang(next.code);
  };

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  const nextLang = LANGS[(LANGS.findIndex((l) => l.code === lang) + 1) % LANGS.length];

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={cycleLang}
        className={`p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground ${className}`}
        title={`Switch to ${nextLang.label}`}
        aria-label="Toggle language"
      >
        <Globe size={16} />
      </button>
    );
  }

  if (variant === "full") {
    return (
      <div className={`inline-flex rounded-lg border border-border bg-background p-0.5 ${className}`}>
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => lang !== l.code && setLang(l.code)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              lang === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={cycleLang}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ${className}`}
      title={`Switch to ${nextLang.label}`}
      aria-label="Toggle language"
    >
      <Globe size={12} />
      {current.short}
    </button>
  );
};

export default LangToggle;

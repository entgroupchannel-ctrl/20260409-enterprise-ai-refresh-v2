import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import LineQRButton from "@/components/LineQRButton";

const TiktokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.35 8.35 0 0 0 4.76 1.49V6.75a4.79 4.79 0 0 1-1-.06z" />
  </svg>
);

const socials = [
  { icon: <Facebook size={18} />, label: "Facebook", href: "https://www.facebook.com/entgroup.th/", bg: "bg-[#1877F2]" },
  { icon: <Instagram size={18} />, label: "Instagram", href: "https://www.instagram.com/entgroupcompany/", bg: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]" },
  { icon: <TiktokIcon size={18} />, label: "TikTok", href: "https://www.tiktok.com/@entgroup", bg: "bg-[#010101]" },
  { icon: <Youtube size={18} />, label: "YouTube", href: "https://www.youtube.com/@ENTGROUP-TH", bg: "bg-[#FF0000]" },
];

const SocialRibbon = () => {
  const location = useLocation();
  const isHiddenPage = location.pathname.startsWith("/admin");
  const [expanded, setExpanded] = useState(true);

  if (isHiddenPage) return null;

  return (
    <div
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 transition-transform duration-500 ease-in-out"
      style={{ transform: `translateY(-50%) translateX(${expanded ? "0" : "-100%"})` }}
    >
      <div className="flex flex-col gap-0.5">
        {socials.map((s, i) => (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2.5 px-3 py-2.5 ${s.bg} text-white rounded-r-lg shadow-md hover:pr-5 transition-all duration-200 text-xs font-medium`}
          >
            <span className="shrink-0">{s.icon}</span>
            <span className="whitespace-nowrap">{s.label}</span>
          </a>
        ))}
        <LineQRButton className="flex items-center gap-2.5 px-3 py-2.5 bg-[#06C755] text-white rounded-r-lg shadow-md hover:pr-5 transition-all duration-200 text-xs font-medium">
          <span className="shrink-0"><MessageCircle size={18} /></span>
          <span className="whitespace-nowrap">LINE</span>
        </LineQRButton>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute top-1/2 -translate-y-1/2 w-7 h-14 rounded-r-lg bg-[#1a1a2e] text-white flex items-center justify-center shadow-lg border border-white/10 hover:bg-[#16213e] transition-colors"
        style={{ right: "-28px" }}
        aria-label={expanded ? "ซ่อน" : "แสดง Social"}
      >
        <svg
          width="10" height="16" viewBox="0 0 10 16" fill="none"
          className={`transition-transform duration-300 ${expanded ? "" : "rotate-180"}`}
        >
          <path d="M8 2L2 8L8 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default SocialRibbon;


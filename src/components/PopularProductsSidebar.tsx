import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, FileText } from "lucide-react";

const searchTags = [
  { label: "Mini PC สำนักงาน", href: "/mini-pc" },
  { label: "Industrial PC ทนร้อนทนฝุ่น", href: "/gt-series" },
  { label: "Panel PC จอสัมผัสโรงงาน", href: "/panel-pc-gtg" },
  { label: "Firewall สำหรับ SME", href: "/minipc-firewall" },
  { label: "Zero Client ประหยัดพลังงาน", href: "/vcloudpoint" },
  { label: "Rugged Tablet กันน้ำกันกระแทก", href: "/rugged-tablet" },
];

export default function PopularProductsSidebar() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-[9999] transition-all duration-500 ease-in-out ${expanded ? "translate-x-0" : "translate-x-[calc(100%-28px)]"}`}>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center justify-center w-7 shrink-0 rounded-l-xl bg-white/10 backdrop-blur-md border border-r-0 border-white/15 text-white/50 hover:text-white hover:bg-white/20 transition-colors"
        title="สินค้ายอดนิยม"
      >
        <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? "rotate-90" : "-rotate-90"}`} />
      </button>
      <div className="flex flex-col gap-2 p-3 rounded-l-xl bg-black/40 backdrop-blur-xl border border-r-0 border-white/10">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-white/40">สินค้ายอดนิยม</p>
        {searchTags.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => navigate(tag.href)}
            className="text-left px-3 py-2 rounded-lg bg-white/5 text-white/80 text-xs border border-white/10 hover:bg-white/15 hover:border-white/25 hover:text-white transition-all whitespace-nowrap"
          >
            {tag.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => navigate("/shop")}
          className="mt-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold border border-primary/40 hover:opacity-90 transition-all whitespace-nowrap shadow-sm"
        >
          <FileText className="w-3.5 h-3.5" />
          ขอใบเสนอราคา (RFQ)
        </button>
      </div>
    </div>
  );
}

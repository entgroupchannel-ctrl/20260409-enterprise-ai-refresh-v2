import { Link } from "react-router-dom";
import { ArrowRight, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { jetsonProducts } from "@/data/jetson-products";

// 8 รุ่นแนะนำ Edge AI: เน้น IPC + Y Series (Dev Kit Jetson Nano-class)
const RECOMMENDED_IDS = [
  // IPC (Industrial PC for Edge AI)
  "ipc-18f1e1",
  "ipc-11f1e2",
  "ipc-8f1e1",
  "ipc-nano-sys-2006",
  // Y Series Development Systems (Jetson Nano/NX class dev kit)
  "y-c18-dev",
  "y-c17-dev",
  "y-c13-dev",
  "y-c28-dev",
];

const fmtPrice = (n: number | null | undefined) =>
  n && n > 0 ? `฿${n.toLocaleString("th-TH")}` : "สอบถามราคา";

const JetsonRecommendedRow = () => {
  const items = RECOMMENDED_IDS.map((id) => jetsonProducts.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <section
      aria-labelledby="jetson-recommended-title"
      className="relative z-10"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
        <div>
          <Badge variant="secondary" className="mb-2 gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            รุ่นแนะนำสำหรับ Edge AI
          </Badge>
          <h3
            id="jetson-recommended-title"
            className="text-xl md:text-2xl font-bold tracking-tight"
          >
            NVIDIA Jetson — <span className="text-primary">IPC</span> &{" "}
            <span className="text-primary">Y Series Dev Kit</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            8 รุ่นยอดนิยม — Industrial PC สำหรับ Production และ Y-Series Dev Kit สำหรับ Prototyping
          </p>
        </div>
        <Link
          to="/shop?category=jetson"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline self-start md:self-end"
        >
          ดู NVIDIA Jetson ทั้งหมดใน /shop <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {items.map((p) => {
          const href = `/shop?category=jetson&q=${encodeURIComponent(p.name)}`;
          const isIPC = p.category === "embedded-systems";
          return (
            <Link
              key={p.id}
              to={href}
              className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-200"
            >
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img
                  src={p.image}
                  alt={p.nameTH}
                  loading="lazy"
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/product-placeholder.svg";
                  }}
                />
                <Badge
                  variant="secondary"
                  className="absolute top-1.5 left-1.5 text-[9px] font-semibold"
                >
                  {isIPC ? "IPC" : "Y Series"}
                </Badge>
                {p.badgeTH && (
                  <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground shadow">
                    {p.badgeTH}
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col p-2">
                <h4 className="text-xs font-bold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                  {p.nameTH}
                </h4>
                <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">
                  {p.subtitleTH}
                </p>
                <p className="mt-1.5 text-[11px] font-bold text-primary">
                  {fmtPrice(p.priceTHB)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default JetsonRecommendedRow;

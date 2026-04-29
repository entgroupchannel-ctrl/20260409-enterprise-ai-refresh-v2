import { Link } from "react-router-dom";
import { ArrowRight, Cpu, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// รุ่นแนะนำ 8 รุ่น: 4 EPC Panel PC (Wide) + 4 EPC Box Series
// ใช้ข้อมูลตรงกับ src/pages/EPCSeries.tsx และ src/pages/EPCBoxSeries.tsx
const RECOMMENDED = [
  {
    id: "epc-w13",
    series: "EPC Panel PC",
    name: "EPC-W13X2A",
    desc: '13.3" 16:9 — Compact Touch Panel PC',
    image: "/images/wix/0597a3_a24a2701c3274227be9a623a39fcad77_c5875973.png",
    href: "/epc-series#wide",
  },
  {
    id: "epc-w15",
    series: "EPC Panel PC",
    name: "EPC-W15X2A",
    desc: '15.6" 16:9 — Wide Touch Panel PC',
    image: "/images/wix/0597a3_f72a672e77bc413a90eaa099e8bcfe0e_679aa82e.png",
    href: "/epc-series#wide",
  },
  {
    id: "epc-w18",
    series: "EPC Panel PC",
    name: "EPC-W18X2A",
    desc: '18.5" 16:9 — Industrial Wide Display',
    image: "/images/wix/0597a3_1afba5b0dac84a259a2dd29c1fda6909_57745515.png",
    href: "/epc-series#wide",
  },
  {
    id: "epc-w21",
    series: "EPC Panel PC",
    name: "EPC-W21X2A",
    desc: '21.5" 16:9 — Full HD Touch Panel PC',
    image: "/images/wix/0597a3_cfe6c90e6ba44ef3ba3a0aa5a698f32d_2b0c00e1.png",
    href: "/epc-series#wide",
  },
  {
    id: "epc-10xa",
    series: "EPC Box",
    name: "EPC-10XA Series",
    desc: "Compact 200mm — Edge / POS / งานทั่วไป",
    image: "/images/wix/0597a3_e66a5a6616b64254a920d2c6f05b93f8_48ed79f4.png",
    href: "/epc-box-series#10xa",
  },
  {
    id: "epc-20xa",
    series: "EPC Box",
    name: "EPC-20XA Series",
    desc: "CPU แรง 24/7 — ระบายความร้อนดีขึ้น 68%",
    image: "/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png",
    href: "/epc-box-series#20xa",
  },
  {
    id: "epc-30xa",
    series: "EPC Box",
    name: "EPC-30XA Series",
    desc: "Rack/Panel Mount 337mm — Low Profile",
    image: "/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png",
    href: "/epc-box-series#30xa",
  },
  {
    id: "epc-40xa",
    series: "EPC Box",
    name: "EPC-40XA Series",
    desc: "Mission-Critical Flagship — ระบายความร้อน +168%",
    image: "/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png",
    href: "/epc-box-series#40xa",
  },
];

const EPCRecommendedRow = () => {
  return (
    <section
      aria-labelledby="epc-recommended-title"
      className="pb-2"
    >
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
          <div>
            <Badge variant="secondary" className="mb-2 gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              รุ่นแนะนำสำหรับ Touch PC / Box PC
            </Badge>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">
              รุ่นแนะนำ — <span className="text-primary">EPC Panel PC</span> & <span className="text-primary">EPC Box Series</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/epc-series"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              EPC Panel PC ทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              to="/epc-box-series"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              EPC Box Series ทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {RECOMMENDED.map((p) => {
            // Map row id (e.g. 'epc-w13') to shop detail slug (e.g. 'epc-w13x2a' / 'epc-10xa')
            const shopSlug = p.name.toLowerCase().replace(/\s+series$/, '');
            const shopHref = `/shop/${shopSlug}`;
            return (
              <div
                key={p.id}
                className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <Link to={p.href} className="block" aria-label={`ดูรายละเอียด ${p.name}`}>
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-1.5 left-1.5 text-[9px] font-semibold"
                    >
                      {p.series}
                    </Badge>
                  </div>
                </Link>
                <div className="flex-1 flex flex-col p-2">
                  <Link to={p.href} className="block">
                    <h4 className="text-xs font-bold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {p.name}
                    </h4>
                    <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">
                      {p.desc}
                    </p>
                  </Link>
                  <div className="mt-2 flex items-center gap-2 text-[10px]">
                    <Link
                      to={p.href}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-1.5 py-1 rounded-md border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      หน้าสินค้า <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      to={shopHref}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-1.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={`ดู ${p.name} ในร้านค้า`}
                    >
                      <ShoppingBag className="w-3 h-3" /> /shop
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EPCRecommendedRow;

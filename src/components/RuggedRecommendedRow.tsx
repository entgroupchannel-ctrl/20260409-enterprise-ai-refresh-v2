import { Link } from "react-router-dom";
import { ArrowRight, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// รุ่นแนะนำ 8 รุ่น: 3 Rugged Tablet + 3 Rugged Notebook + 2 Handheld
// ใช้ข้อมูลตรงกับ src/data/rugged-*-products.ts
type PromoTag = {
  label: string;
  cls: string;
};

const PROMO_TAGS: PromoTag[] = [
  { label: "🔥 ขายดี", cls: "bg-red-500 text-white" },
  { label: "⚡ ส่งไว", cls: "bg-amber-500 text-white" },
  { label: "🛡 ทนทาน", cls: "bg-blue-600 text-white" },
  { label: "💰 ประหยัด", cls: "bg-emerald-600 text-white" },
];

const RECOMMENDED = [
  {
    id: "f9a",
    series: "Rugged Tablet",
    name: "F9A",
    desc: '10.1" Industrial Tablet — Windows 11',
    image: "/images/rugged/f9a-_j8J-x2I.jpg",
    href: "/rugged-tablet/f9a",
    promoIdx: 0, // ขายดี
  },
  {
    id: "em-x15a",
    series: "Rugged Notebook",
    name: "EM-X15A",
    desc: '15.6" FHD 1000 nits — MIL-STD-810H',
    image: "/images/rugged/em-x15a-V7O0Cy_Y.png",
    href: "/rugged-notebook/em-x15a",
    promoIdx: 2, // ทนทาน
  },
  {
    id: "w65g",
    series: "Handheld",
    name: "W65G",
    desc: 'Handheld PDA — IP67 + Barcode Scanner',
    image: "/images/rugged/w65g-N3AQKXJb.png",
    href: "/handheld/w65g",
    promoIdx: 1, // ส่งไว
  },
  {
    id: "f9e",
    series: "Rugged Tablet",
    name: "F9E",
    desc: '10.1" Elite — Intel i5 / Dual USB-C',
    image: "/images/rugged/f9e-C3MseYpo.png",
    href: "/rugged-tablet/f9e",
    promoIdx: 3, // ประหยัด
  },
  {
    id: "em-x14a",
    series: "Rugged Notebook",
    name: "EM-X14A",
    desc: '14" Intel i7 — Thunderbolt 4',
    image: "/images/rugged/em-x14a-CeYNitLa.png",
    href: "/rugged-notebook/em-x14a",
    promoIdx: 0, // ขายดี
  },
  {
    id: "a55gt",
    series: "Handheld",
    name: "A55GT",
    desc: 'Android 5G Handheld — กันน้ำกันกระแทก',
    image: "/images/rugged/a55gt-8EiW4LT7.jpg",
    href: "/handheld/a55gt",
    promoIdx: 1, // ส่งไว
  },
  {
    id: "em-x15m",
    series: "Rugged Notebook",
    name: "EM-X15M",
    desc: 'AI PC — Intel Core Ultra + Intel Arc',
    image: "/images/rugged/em-x15a-V7O0Cy_Y.png",
    href: "/rugged-notebook/em-x15m",
    promoIdx: 2, // ทนทาน
  },
  {
    id: "em-i22j",
    series: "Rugged Tablet",
    name: "EM-I22J",
    desc: '12.2" 2-in-1 — คีย์บอร์ดถอดได้',
    image: "/images/rugged/em-i22j-BG1wttE6.png",
    href: "/rugged-tablet/em-i22j",
    promoIdx: 3, // ประหยัด
  },
];

const RuggedRecommendedRow = () => {
  return (
    <section
      aria-labelledby="rugged-recommended-title"
      className="px-4 md:px-8 pb-8 md:pb-12"
    >
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
          <div>
            <Badge variant="secondary" className="mb-2 gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              รุ่นแนะนำ — Rugged Devices
            </Badge>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">
              8 รุ่นแนะนำ — <span className="text-primary">Rugged Tablet</span>, <span className="text-primary">Notebook</span> & <span className="text-primary">Handheld</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/rugged-tablet"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Tablet ทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              to="/rugged-notebook"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Notebook ทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              to="/handheld"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Handheld ทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {RECOMMENDED.map((p) => {
            const tag = PROMO_TAGS[p.promoIdx];
            return (
              <Link
                key={p.id}
                to={p.href}
                className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-200"
              >
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
                  <span
                    className={`absolute top-1.5 right-1.5 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-md animate-pulse ${tag.cls}`}
                  >
                    {tag.label}
                  </span>
                </div>
                <div className="flex-1 flex flex-col p-2">
                  <h4 className="text-xs font-bold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                    {p.name}
                  </h4>
                  <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">
                    {p.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RuggedRecommendedRow;

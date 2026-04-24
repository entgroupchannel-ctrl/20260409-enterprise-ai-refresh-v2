import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Download, Shield, ThermometerSun, Sparkles,
  Maximize, Settings, Zap, CheckCircle2, Monitor, Truck, Wrench, Phone,
  RefreshCw, Cpu, Server, HardDrive, Cable, AlertTriangle, ShieldCheck,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MiniNavbar from "@/components/MiniNavbar";
import FooterCompact from "@/components/FooterCompact";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import AddToCartButton from "@/components/AddToCartButton";
import PriceDisclaimer from "@/components/PriceDisclaimer";

/* ─── Detail data per model ─── */
const IMG_10 = "/images/fpm/products/fpm-1002s-10inch.jpg";
const IMG_15K = "/images/fpm/products/fpm-1502k-15-6inch.jpg";
const IMG_17 = "/images/fpm/products/fpm-1702k-17-3inch.jpg";
const IMG_RFID = "/images/fpm/products/fpm-1502b-rfid.jpg";

const lifestyleAll = [
  "/images/fpm/lifestyle/install-1.jpg",
  "/images/fpm/lifestyle/install-2.jpg",
  "/images/fpm/lifestyle/install-3.jpg",
  "/images/fpm/lifestyle/install-4.jpg",
  "/images/fpm/lifestyle/install-5.jpg",
];

type ModelDetail = {
  model: string;
  size: string;
  resolution: string;
  ratio: string;
  touch: "Capacitive" | "Resistive";
  brightness: number;
  price: string;
  images: string[];
  highlight: string;
  description: string;
  features: string[];
  ports: string[];
  datasheet?: string;
  badge?: string;
};

const MODELS: Record<string, ModelDetail> = {
  "fpm-0801a": {
    model: "FPM-0801A", size: '8"', resolution: "1024x768", ratio: "4:3", touch: "Resistive", brightness: 300, price: "10,990",
    images: [IMG_10, ...lifestyleAll],
    highlight: "8-inch Resistive Touch — Embedded Compact",
    description: "จอภาพสัมผัสขนาดเล็ก 8 นิ้ว เหมาะสำหรับงาน Embedded ในเครื่องจักรขนาดเล็ก รองรับการสัมผัสด้วยปากกาและถุงมือ",
    features: ["IP65 Front Panel", "Wide Temp -20°C ถึง 70°C", "Resistive Touch (ปากกา/ถุงมือใช้ได้)", "VESA 75 Mounting"],
    ports: ["VGA", "HDMI", "USB 2.0", "DC 12V Input"],
  },
  "fpm-0802a": {
    model: "FPM-0802A", size: '8"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "12,990",
    images: [IMG_10, ...lifestyleAll],
    highlight: "8-inch Capacitive — Multi-touch",
    description: "จอ 8 นิ้ว Capacitive Multi-touch สำหรับงานที่ต้องการการสัมผัสที่ลื่นไหลและรองรับนิ้ว",
    features: ["IP65 Front Panel", "Multi-touch", "Optical Bonding Optional", "VESA 75"],
    ports: ["VGA", "HDMI", "USB 2.0", "DC 12V"],
  },
  "fpm-1001a": {
    model: "FPM-1001A", size: '10"', resolution: "1024x768", ratio: "4:3", touch: "Resistive", brightness: 300, price: "12,990",
    images: [IMG_10, ...lifestyleAll],
    highlight: "10-inch Resistive — Industrial Workhorse",
    description: "จอ 10 นิ้ว Resistive ทนทานสำหรับสายการผลิต ทำงานได้กับถุงมือและปากกา Stylus",
    features: ["IP65", "Wide Temp", "Resistive (ปากกา/ถุงมือ)", "VESA 75/100"],
    ports: ["VGA", "HDMI", "USB", "DC 12V"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_5d760f5082bb435aaa29a55ab6298a02.pdf",
  },
  "fpm-1002a": {
    model: "FPM-1002A", size: '10"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "14,990",
    images: [IMG_10, ...lifestyleAll],
    highlight: "10-inch Capacitive — Modern Touch UX",
    description: "จอ 10 นิ้ว Capacitive Multi-touch ระดับสมาร์ทโฟน เหมาะกับ HMI ยุคใหม่ที่ต้องการประสบการณ์ลื่นไหล",
    features: ["IP65 Front Panel", "10-point Multi-touch", "Anti-glare", "Optical Bonding"],
    ports: ["VGA", "HDMI", "USB 2.0", "DC 12V"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_5d760f5082bb435aaa29a55ab6298a02.pdf",
  },
  "fpm-1202a": {
    model: "FPM-1202A", size: '12"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "15,990",
    images: [IMG_10, ...lifestyleAll],
    highlight: "12-inch Capacitive — Best Seller",
    description: "ขนาดยอดนิยมสำหรับงาน HMI โรงงาน ขนาด 12 นิ้วลงตัวพอดีไม่ใหญ่ไม่เล็ก",
    features: ["IP65", "Multi-touch", "Wide Temp", "VESA 75/100", "Optical Bonding"],
    ports: ["VGA", "HDMI", "USB 2.0", "Aviation Connector (Optional)"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_a3754cf13eaa40b09346e93fdb46c16a.pdf",
  },
  "fpm-1501a": {
    model: "FPM-1501A", size: '15"', resolution: "1024x768", ratio: "4:3", touch: "Resistive", brightness: 300, price: "17,990",
    images: [IMG_RFID, ...lifestyleAll],
    highlight: "15-inch Resistive — Heavy Duty",
    description: "จอ 15 นิ้ว Resistive ขนาดมาตรฐานสำหรับสายการผลิตและงานควบคุมเครื่องจักร",
    features: ["IP65", "Resistive", "Wide Temp -20°C ถึง 70°C", "VESA 100"],
    ports: ["VGA", "HDMI", "USB", "DC 12V"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_69e01e1d7ddb4da6a215f9b617bf7bd4.pdf",
  },
  "fpm-1502a": {
    model: "FPM-1502A", size: '15"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "19,990",
    images: [IMG_RFID, ...lifestyleAll],
    highlight: "15-inch Capacitive — Customizable RFID Edition",
    description: "จอ 15 นิ้ว Capacitive Multi-touch รองรับการเพิ่ม RFID Reader สำหรับงาน Smart Warehouse และ Production Line Traceability",
    features: ["IP65 Front Panel", "Multi-touch", "RFID Customization", "Optical Bonding", "Aviation Connector"],
    ports: ["VGA", "HDMI", "USB 2.0", "RS-232/485 Optional", "RFID Module Optional"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_69e01e1d7ddb4da6a215f9b617bf7bd4.pdf",
    badge: "RFID Ready",
  },
  "fpm-1702a": {
    model: "FPM-1702A", size: '17"', resolution: "1280x1024", ratio: "5:4", touch: "Capacitive", brightness: 300, price: "21,990",
    images: [IMG_17, ...lifestyleAll],
    highlight: "17-inch SXGA — Square Screen",
    description: "จอ 17 นิ้ว 5:4 SXGA สำหรับห้องคอนโทรล CNC และงานที่ต้องการพื้นที่แสดงผลแบบสี่เหลี่ยมจัตุรัส",
    features: ["IP65", "5:4 SXGA", "Multi-touch", "Optical Bonding", "VESA 100"],
    ports: ["VGA", "HDMI", "DVI", "USB 2.0"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_8753cbe1d9c5428b8b55f81c9b98ee3a.pdf",
  },
  "fpm-1902a": {
    model: "FPM-1902A", size: '19"', resolution: "1280x1024", ratio: "5:4", touch: "Capacitive", brightness: 300, price: "21,990",
    images: [IMG_17, ...lifestyleAll],
    highlight: "19-inch SXGA — Control Room Standard",
    description: "จอ 19 นิ้ว 5:4 ขนาดมาตรฐานห้องคอนโทรล รองรับการแสดงผลพร้อมกันหลาย Window",
    features: ["IP65", "5:4 SXGA", "Multi-touch", "Wide Viewing Angle"],
    ports: ["VGA", "HDMI", "DVI", "USB 2.0"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_2e25c9d6f2974be5bcfbcf356f82f568.pdf",
  },
  "fpm-1502k": {
    model: "FPM-1502K", size: '15.6"', resolution: "1920x1080", ratio: "16:9", touch: "Capacitive", brightness: 300, price: "19,990",
    images: [IMG_15K, ...lifestyleAll],
    highlight: "15.6-inch FHD Wide — Modern HMI",
    description: "จอ 15.6 นิ้ว Full HD 16:9 สำหรับ HMI และ Dashboard ยุคใหม่ ดีไซน์บางเฉียบ Optical Bonding",
    features: ["IP65", "Full HD 1920x1080", "Multi-touch", "Slim Bezel", "Optical Bonding"],
    ports: ["HDMI", "DisplayPort", "USB Type-C", "USB 2.0"],
  },
  "fpm-2102k": {
    model: "FPM-2102K", size: '21.5"', resolution: "1920x1080", ratio: "16:9", touch: "Capacitive", brightness: 300, price: "24,990",
    images: [IMG_17, ...lifestyleAll],
    highlight: "21.5-inch FHD — Big Picture HMI",
    description: "จอใหญ่ 21.5 นิ้ว Full HD 16:9 เหมาะกับ Dashboard, Big Data Visualization และงานที่ต้องการพื้นที่กว้าง",
    features: ["IP65", "Full HD", "Multi-touch", "Wide Viewing", "Optical Bonding"],
    ports: ["HDMI", "DisplayPort", "VGA", "USB 2.0"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_ccc895a9d8314d8396843387d8120e18.pdf",
  },
  "fpm-2402ka": {
    model: "FPM-2402KA", size: '24"', resolution: "1920x1080", ratio: "16:9", touch: "Capacitive", brightness: 300, price: "Call",
    images: [IMG_17, ...lifestyleAll],
    highlight: "24-inch FHD — Maximum Visibility",
    description: "จอใหญ่สุดในซีรีส์ 24 นิ้ว Full HD สำหรับห้องคอนโทรลใหญ่ Big Data, Military, Mission-critical",
    features: ["IP65", "Full HD", "Multi-touch", "Wide Temperature", "Customizable"],
    ports: ["HDMI", "DisplayPort", "VGA", "USB 2.0", "Aviation Connector"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/005637_21234f29c0c045f380e17e101ce14e17.pdf",
    badge: "Flagship",
  },
};

const FEATURE_ICONS: Record<string, typeof Shield> = {
  IP65: Shield,
  Wide: ThermometerSun,
  Optical: Sparkles,
  Multi: Zap,
  RFID: Settings,
  VESA: Maximize,
};

const pickIcon = (text: string) => {
  for (const [key, Icon] of Object.entries(FEATURE_ICONS)) {
    if (text.includes(key)) return Icon;
  }
  return CheckCircle2;
};

const FPMSeriesDetail = () => {
  const { model } = useParams<{ model: string }>();
  const data = model ? MODELS[model.toLowerCase()] : null;
  const [activeImg, setActiveImg] = useState(0);

  if (!data) return <Navigate to="/fpm-series" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`${data.model} — ${data.highlight} | FPM Series`}
        description={`${data.model} ${data.size} ${data.touch} Touch Monitor — ${data.description}`}
        path={`/fpm-series/${model}`}
      />
      <BreadcrumbJsonLd items={[
        { name: "สินค้า", path: "/products" },
        { name: "FPM Series", path: "/fpm-series" },
        { name: data.model, path: `/fpm-series/${model}` },
      ]} />

      <MiniNavbar />

      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/fpm-series" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-4">
            <ArrowLeft size={14} /> กลับ FPM Series
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Gallery */}
            <div>
              <div className="aspect-square rounded-2xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center p-8">
                <img
                  src={data.images[activeImg]}
                  alt={`${data.model} - ${activeImg + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-6 gap-2 mt-3">
                {data.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-lg border overflow-hidden transition ${
                      i === activeImg ? "border-primary ring-2 ring-primary/30" : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
                  FPM Series
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase border border-amber-500/30">
                  IP65
                </span>
                {data.badge && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase border border-emerald-500/30">
                    {data.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-black text-foreground mb-2">{data.model}</h1>
              <p className="text-lg text-primary font-bold mb-4">{data.highlight}</p>
              <p className="text-muted-foreground leading-relaxed mb-6">{data.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <Spec label="ขนาด" value={data.size} />
                <Spec label="ความละเอียด" value={data.resolution} />
                <Spec label="อัตราส่วน" value={data.ratio} />
                <Spec label="Touch" value={data.touch} />
                <Spec label="ความสว่าง" value={`${data.brightness} nits`} />
                <Spec label="ราคา" value={data.price === "Call" ? "ติดต่อสอบถาม" : `฿${data.price}`} highlight />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <AddToCartButton
                  productModel={data.model}
                  productName={`FPM ${data.size} Touch Monitor`}
                  productDescription={`${data.size} ${data.resolution} ${data.touch}`}
                />
                <QuoteRequestButton productModel={data.model} productName={data.model} />
                {data.datasheet && (
                  <a
                    href={data.datasheet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition text-sm font-bold"
                  >
                    <Download size={14} /> Datasheet
                  </a>
                )}
              </div>

              <PriceDisclaimer />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
            คุณสมบัติเด่น
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.features.map((f, i) => {
              const Icon = pickIcon(f);
              return (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <p className="text-sm text-foreground font-medium leading-relaxed">{f}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ports */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
            พอร์ตเชื่อมต่อ
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.ports.map((p) => (
              <span key={p} className="px-4 py-2 rounded-lg border border-border bg-card text-foreground font-mono text-sm">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Back to series */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/fpm-series" className="group flex items-center gap-4 p-6 rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/40 transition-all">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Monitor size={24} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">FPM Series</div>
              <h3 className="text-lg font-display font-bold text-foreground">ดูรุ่นอื่นทั้งหมด 12 รุ่น →</h3>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" size={24} />
          </Link>
        </div>
      </section>

      <FooterCompact />
    </div>
  );
};

const Spec = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="p-3 rounded-lg border border-border bg-card">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
    <div className={`font-bold ${highlight ? "text-primary text-lg" : "text-foreground"}`}>{value}</div>
  </div>
);

export default FPMSeriesDetail;

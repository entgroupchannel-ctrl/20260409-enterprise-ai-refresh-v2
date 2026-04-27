import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
type TabKey = "gallery" | "specs" | "dimensions" | "faq";
import {
  ArrowLeft, ArrowRight, Download, Shield, ThermometerSun, Sparkles,
  Maximize, Settings, Zap, CheckCircle2, Monitor, Truck, Wrench, Phone,
  RefreshCw, Cpu, Server, HardDrive, Cable, AlertTriangle, ShieldCheck,
  Images, ClipboardList, HelpCircle, ZoomIn, X, Ruler,
  ChevronLeft, ChevronRight, Pause, Play,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MiniNavbar from "@/components/MiniNavbar";
import FooterCompact from "@/components/FooterCompact";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import AddToCartButton from "@/components/AddToCartButton";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import bundleGT from "@/assets/fpm-bundle-gt.jpg";
import bundleEPC from "@/assets/fpm-bundle-epc.jpg";
import bundleUPC from "@/assets/fpm-bundle-upc.jpg";

/* ─── Image sets per real cesipc model ─── */
const IMG_10 = "/images/fpm/products/fpm-1002s-10inch.jpg";
const IMG_15K = "/images/fpm/products/fpm-1502k-15-6inch.jpg";
const IMG_17 = "/images/fpm/products/fpm-1702k-17-3inch.jpg";
const IMG_RFID = "/images/fpm/products/fpm-1502b-rfid.jpg";

// Real product gallery sets (downloaded from cesipc.com)
// Note: For 1202C/1502K/1702K/2102K series the *-01.png file is a DIMENSION DRAWING
// (separated into its own array so it can be shown in the Dimensions tab, not the gallery)
const GALLERY_1002S = ["/images/fpm/products/fpm-1002s-01.png", "/images/fpm/products/fpm-1002s-02.png"];
const DIM_1002S: string[] = []; // no dimension drawing available
const GALLERY_1202C = ["/images/fpm/products/fpm-1202c-02.png", "/images/fpm/products/fpm-1202c-03.png", "/images/fpm/products/fpm-1202c-04.png"];
const DIM_1202C = ["/images/fpm/products/fpm-1202c-01.png"];
const GALLERY_1502K = ["/images/fpm/products/fpm-1502k-02.png", "/images/fpm/products/fpm-1502k-03.png", "/images/fpm/products/fpm-1502k-04.png"];
const DIM_1502K = ["/images/fpm/products/fpm-1502k-01.png"];
const GALLERY_1702K = ["/images/fpm/products/fpm-1702k-02.png", "/images/fpm/products/fpm-1702k-03.png", "/images/fpm/products/fpm-1702k-04.png"];
const DIM_1702K = ["/images/fpm/products/fpm-1702k-01.png"];
const GALLERY_2102K = ["/images/fpm/products/fpm-2102k-02.png", "/images/fpm/products/fpm-2102k-03.png"];
const DIM_2102K = ["/images/fpm/products/fpm-2102k-01.png"];

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
  dimensions?: string[];
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
    images: [...GALLERY_1002S, ...lifestyleAll], dimensions: DIM_1002S,
    highlight: "8-inch Resistive Touch — Embedded Compact",
    description: "จอภาพสัมผัสขนาดเล็ก 8 นิ้ว เหมาะสำหรับงาน Embedded ในเครื่องจักรขนาดเล็ก รองรับการสัมผัสด้วยปากกาและถุงมือ",
    features: ["IP65 Front Panel", "Wide Temp -20°C ถึง 70°C", "Resistive Touch (ปากกา/ถุงมือใช้ได้)", "VESA 75 Mounting"],
    ports: ["VGA", "HDMI", "USB 2.0", "DC 12V Input"],
  },
  "fpm-0802a": {
    model: "FPM-0802A", size: '8"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "12,990",
    images: [...GALLERY_1002S, ...lifestyleAll], dimensions: DIM_1002S,
    highlight: "8-inch Capacitive — Multi-touch",
    description: "จอ 8 นิ้ว Capacitive Multi-touch สำหรับงานที่ต้องการการสัมผัสที่ลื่นไหลและรองรับนิ้ว",
    features: ["IP65 Front Panel", "Multi-touch", "Optical Bonding Optional", "VESA 75"],
    ports: ["VGA", "HDMI", "USB 2.0", "DC 12V"],
  },
  "fpm-1001a": {
    model: "FPM-1001A", size: '10"', resolution: "1024x768", ratio: "4:3", touch: "Resistive", brightness: 300, price: "12,990",
    images: [...GALLERY_1002S, ...lifestyleAll], dimensions: DIM_1002S,
    highlight: "10-inch Resistive — Industrial Workhorse",
    description: "จอ 10 นิ้ว Resistive ทนทานสำหรับสายการผลิต ทำงานได้กับถุงมือและปากกา Stylus",
    features: ["IP65", "Wide Temp", "Resistive (ปากกา/ถุงมือ)", "VESA 75/100"],
    ports: ["VGA", "HDMI", "USB", "DC 12V"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/fpm/FPM-1001A-Datasheet.pdf",
  },
  "fpm-1002a": {
    model: "FPM-1002A", size: '10"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "14,990",
    images: [...GALLERY_1002S, ...lifestyleAll], dimensions: DIM_1002S,
    highlight: "10-inch Capacitive — Modern Touch UX",
    description: "จอ 10 นิ้ว Capacitive Multi-touch ระดับสมาร์ทโฟน เหมาะกับ HMI ยุคใหม่ที่ต้องการประสบการณ์ลื่นไหล",
    features: ["IP65 Front Panel", "10-point Multi-touch", "Anti-glare", "Optical Bonding"],
    ports: ["VGA", "HDMI", "USB 2.0", "DC 12V"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/fpm/FPM-1002A-Datasheet.pdf",
  },
  "fpm-1202a": {
    model: "FPM-1202A", size: '12"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "15,990",
    images: [...GALLERY_1202C, ...lifestyleAll], dimensions: DIM_1202C,
    highlight: "12-inch Capacitive — Best Seller",
    description: "ขนาดยอดนิยมสำหรับงาน HMI โรงงาน ขนาด 12 นิ้วลงตัวพอดีไม่ใหญ่ไม่เล็ก",
    features: ["IP65", "Multi-touch", "Wide Temp", "VESA 75/100", "Optical Bonding"],
    ports: ["VGA", "HDMI", "USB 2.0", "Aviation Connector (Optional)"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/fpm/FPM-1202A-Datasheet.pdf",
  },
  "fpm-1501a": {
    model: "FPM-1501A", size: '15"', resolution: "1024x768", ratio: "4:3", touch: "Resistive", brightness: 300, price: "17,990",
    images: [...GALLERY_1502K, ...lifestyleAll], dimensions: DIM_1502K,
    highlight: "15-inch Resistive — Heavy Duty",
    description: "จอ 15 นิ้ว Resistive ขนาดมาตรฐานสำหรับสายการผลิตและงานควบคุมเครื่องจักร",
    features: ["IP65", "Resistive", "Wide Temp -20°C ถึง 70°C", "VESA 100"],
    ports: ["VGA", "HDMI", "USB", "DC 12V"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/fpm/FPM-1501A-Datasheet.pdf",
  },
  "fpm-1502a": {
    model: "FPM-1502A", size: '15"', resolution: "1024x768", ratio: "4:3", touch: "Capacitive", brightness: 300, price: "19,990",
    images: [IMG_RFID, ...GALLERY_1502K, ...lifestyleAll], dimensions: DIM_1502K,
    highlight: "15-inch Capacitive — Customizable RFID Edition",
    description: "จอ 15 นิ้ว Capacitive Multi-touch รองรับการเพิ่ม RFID Reader สำหรับงาน Smart Warehouse และ Production Line Traceability",
    features: ["IP65 Front Panel", "Multi-touch", "RFID Customization", "Optical Bonding", "Aviation Connector"],
    ports: ["VGA", "HDMI", "USB 2.0", "RS-232/485 Optional", "RFID Module Optional"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/fpm/FPM-1502A-Datasheet.pdf",
    badge: "RFID Ready",
  },
  "fpm-1702a": {
    model: "FPM-1702A", size: '17"', resolution: "1280x1024", ratio: "5:4", touch: "Capacitive", brightness: 300, price: "21,990",
    images: [...GALLERY_1702K, ...lifestyleAll], dimensions: DIM_1702K,
    highlight: "17-inch SXGA — Square Screen",
    description: "จอ 17 นิ้ว 5:4 SXGA สำหรับห้องคอนโทรล CNC และงานที่ต้องการพื้นที่แสดงผลแบบสี่เหลี่ยมจัตุรัส",
    features: ["IP65", "5:4 SXGA", "Multi-touch", "Optical Bonding", "VESA 100"],
    ports: ["VGA", "HDMI", "DVI", "USB 2.0"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/fpm/FPM-1702A-Datasheet.pdf",
  },
  "fpm-1902a": {
    model: "FPM-1902A", size: '19"', resolution: "1280x1024", ratio: "5:4", touch: "Capacitive", brightness: 300, price: "21,990",
    images: [...GALLERY_1702K, ...lifestyleAll], dimensions: DIM_1702K,
    highlight: "19-inch SXGA — Control Room Standard",
    description: "จอ 19 นิ้ว 5:4 ขนาดมาตรฐานห้องคอนโทรล รองรับการแสดงผลพร้อมกันหลาย Window",
    features: ["IP65", "5:4 SXGA", "Multi-touch", "Wide Viewing Angle"],
    ports: ["VGA", "HDMI", "DVI", "USB 2.0"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/fpm/FPM-1902A-Datasheet.pdf",
  },
  "fpm-1502k": {
    model: "FPM-1502K", size: '15.6"', resolution: "1920x1080", ratio: "16:9", touch: "Capacitive", brightness: 300, price: "19,990",
    images: [...GALLERY_1502K, ...lifestyleAll], dimensions: DIM_1502K,
    highlight: "15.6-inch FHD Wide — Modern HMI",
    description: "จอ 15.6 นิ้ว Full HD 16:9 สำหรับ HMI และ Dashboard ยุคใหม่ ดีไซน์บางเฉียบ Optical Bonding",
    features: ["IP65", "Full HD 1920x1080", "Multi-touch", "Slim Bezel", "Optical Bonding"],
    ports: ["HDMI", "DisplayPort", "USB Type-C", "USB 2.0"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/fpm/FPM-1502K-Datasheet.pdf",
  },
  "fpm-2102k": {
    model: "FPM-2102K", size: '21.5"', resolution: "1920x1080", ratio: "16:9", touch: "Capacitive", brightness: 300, price: "24,990",
    images: [...GALLERY_2102K, ...lifestyleAll], dimensions: DIM_2102K,
    highlight: "21.5-inch FHD — Big Picture HMI",
    description: "จอใหญ่ 21.5 นิ้ว Full HD 16:9 เหมาะกับ Dashboard, Big Data Visualization และงานที่ต้องการพื้นที่กว้าง",
    features: ["IP65", "Full HD", "Multi-touch", "Wide Viewing", "Optical Bonding"],
    ports: ["HDMI", "DisplayPort", "VGA", "USB 2.0"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/fpm/FPM-2102K-Datasheet.pdf",
  },
  "fpm-2402ka": {
    model: "FPM-2402KA", size: '24"', resolution: "1920x1080", ratio: "16:9", touch: "Capacitive", brightness: 300, price: "Call",
    images: [...GALLERY_2102K, ...lifestyleAll], dimensions: DIM_2102K,
    highlight: "24-inch FHD — Maximum Visibility",
    description: "จอใหญ่สุดในซีรีส์ 24 นิ้ว Full HD สำหรับห้องคอนโทรลใหญ่ Big Data, Military, Mission-critical",
    features: ["IP65", "Full HD", "Multi-touch", "Wide Temperature", "Customizable"],
    ports: ["HDMI", "DisplayPort", "VGA", "USB 2.0", "Aviation Connector"],
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/fpm/FPM-2402KA-Datasheet.pdf",
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
  const [activeTab, setActiveTab] = useState<TabKey>("gallery");
  const [activeImg, setActiveImg] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);
  const totalImgs = data?.images?.length ?? 0;
  const goNext = () => setActiveImg((i) => (i + 1) % Math.max(totalImgs, 1));
  const goPrev = () => setActiveImg((i) => (i - 1 + Math.max(totalImgs, 1)) % Math.max(totalImgs, 1));

  useEffect(() => {
    if (!autoPlay || paused || totalImgs <= 1) return;
    const t = setInterval(() => setActiveImg((i) => (i + 1) % totalImgs), 4000);
    return () => clearInterval(t);
  }, [autoPlay, paused, totalImgs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalImgs, lightbox]);

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
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition">หน้าหลัก</Link>
            <span>/</span>
            <Link to="/fpm-series" className="hover:text-primary transition">FPM Series</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{data.model}</span>
          </div>
          <Link
            to="/fpm-series"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all text-sm font-bold mb-6"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            ดูรุ่นอื่นใน FPM Series ทั้งหมด
            <Monitor size={14} className="opacity-60" />
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Gallery */}
            <div>
              <div
                className="relative aspect-square rounded-2xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center p-8 group"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {data.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${data.model} - ${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    className={`absolute inset-0 m-auto max-w-full max-h-full object-contain p-8 transition-opacity duration-500 ${
                      i === activeImg ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  />
                ))}

                {/* Counter */}
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur-sm border border-border text-xs font-semibold text-muted-foreground">
                  {activeImg + 1} <span className="opacity-60">/ {totalImgs}</span>
                </div>

                {/* Auto-play toggle */}
                {totalImgs > 1 && (
                  <button
                    type="button"
                    onClick={() => setAutoPlay((v) => !v)}
                    aria-label={autoPlay ? "หยุดเลื่อนอัตโนมัติ" : "เริ่มเลื่อนอัตโนมัติ"}
                    className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-sm border border-border text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
                  >
                    {autoPlay ? <Pause size={12} /> : <Play size={12} />}
                    {autoPlay ? "Auto" : "หยุด"}
                  </button>
                )}

                {/* Prev / Next */}
                {totalImgs > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="ภาพก่อนหน้า"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="ภาพถัดไป"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Auto-play progress bar */}
                {autoPlay && !paused && totalImgs > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/40 z-10 overflow-hidden">
                    <div
                      key={activeImg}
                      className="h-full bg-primary"
                      style={{ animation: "fpm-progress 4s linear forwards" }}
                    />
                  </div>
                )}
              </div>

              {/* Progress dots */}
              {totalImgs > 1 && (
                <div className="flex gap-1.5 justify-center mt-3">
                  {data.images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      aria-label={`ไปยังภาพที่ ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeImg ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Thumbnails */}
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

              <style>{`@keyframes fpm-progress { from { width: 0% } to { width: 100% } }`}</style>
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

      {/* ═══ Build Your Solution — Compact Bundle Picker ═══ */}
      <section className="py-10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-primary block mb-1">
                Build Your Solution
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                จับคู่ {data.model} กับ Industrial PC
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                เลือกใส่ตะกร้าได้ทีละชิ้น — ส่งคำขอใบเสนอราคารวมในใบเดียว
              </p>
            </div>
            <Link to="/cart" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
              ดูตะกร้า <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Compact bundle items: 3 GT models with real pricing + 1 warranty card */}
            {[
              {
                model: "GT1000",
                name: "GT1000 Fanless PC",
                desc: "Celeron N2920 · USB 6 · COM 2 · LAN 2 · VGA+HDMI",
                tag: "เริ่มต้น",
                price: 15990,
                Icon: Cpu,
                href: "/gt-series#gt1000",
              },
              {
                model: "GT2000",
                name: "GT2000 — ยอดนิยม",
                desc: "i5-3317U · USB 8 (4×3.0) · COM 4 · LAN 2 · VGA+HDMI",
                tag: "Best Seller",
                price: 15990,
                Icon: Server,
                href: "/gt-series#gt2000",
              },
              {
                model: "GT4000",
                name: "GT4000 + GPIO",
                desc: "i5-4200U · USB 8 · COM 6 · GPIO · VESA Mount",
                tag: "GPIO",
                price: 24990,
                Icon: HardDrive,
                href: "/gt-series#gt4000",
              },
            ].map(({ model: m, name, desc, tag, price, Icon, href }) => (
              <div key={m} className="group p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary flex items-center justify-center">
                    <Icon size={18} strokeWidth={2.25} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {tag}
                  </span>
                </div>
                <h3 className="font-display font-bold text-foreground text-sm mb-1">{name}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-2 flex-1">{desc}</p>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-[10px] text-muted-foreground">เริ่มต้น</span>
                  <span className="text-base font-bold text-primary">฿{price.toLocaleString("th-TH")}</span>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <AddToCartButton
                    productModel={m}
                    productName={name}
                    productDescription={`จับคู่กับ ${data.model}`}
                    estimatedPrice={price}
                  />
                  <Link
                    to={href}
                    className="text-[11px] font-bold text-primary hover:underline whitespace-nowrap"
                  >
                    ดู →
                  </Link>
                </div>
              </div>
            ))}

            {/* Warranty card */}
            {(() => {
              const basePrice = parseInt(data.price.replace(/,/g, ""), 10);
              const isNumeric = !isNaN(basePrice);
              const y2 = isNumeric ? Math.round(basePrice * 0.15) : null;
              const y3 = isNumeric ? Math.round(basePrice * 0.20) : null;
              const fmt = (n: number) => `฿${n.toLocaleString("th-TH")}`;
              return (
                <div className="p-4 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                      <ShieldCheck size={18} strokeWidth={2.25} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      Optional
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-foreground text-sm mb-2">Extended Warranty</h3>
                  <ul className="text-[11px] space-y-1.5 mb-3 flex-1">
                    <li className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">ปีที่ 1</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">ฟรี</span>
                    </li>
                    <li className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">ปีที่ 2 (+15%)</span>
                      <span className="font-bold text-foreground">{y2 ? fmt(y2) : "สอบถาม"}</span>
                    </li>
                    <li className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">ปีที่ 3 (+20%)</span>
                      <span className="font-bold text-foreground">{y3 ? fmt(y3) : "สอบถาม"}</span>
                    </li>
                  </ul>
                  <AddToCartButton
                    productModel={`WARRANTY-Y2-${data.model}`}
                    productName={`Extended Warranty Y2 — ${data.model}`}
                    productDescription={`ขยายประกันปีที่ 2 (15% ของราคาสินค้า)${y2 ? ` ≈ ${fmt(y2)}` : ""}`}
                  />
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Tabs: Gallery / Specifications / FAQ */}
      <section className="py-12 border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
            {([
              { key: "gallery" as const, label: "Product Images & Sizes", Icon: Images, show: true },
              { key: "specs" as const, label: "Specifications", Icon: ClipboardList, show: true },
              { key: "dimensions" as const, label: "Dimensions", Icon: Ruler, show: !!(data.dimensions && data.dimensions.length) },
              { key: "faq" as const, label: "FAQ", Icon: HelpCircle, show: true },
            ]).filter((t) => t.show).map(({ key, label, Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`group inline-flex items-center gap-2 px-5 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 -mb-px ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-foreground"
                  }`}>
                    <Icon size={15} strokeWidth={2.25} />
                  </span>
                  {label}
                </button>
              );
            })}
          </div>

          {activeTab === "gallery" && (() => {
            // Gallery now contains ONLY product photos + lifestyle/install shots
            // (Dimension drawings live in their own tab)
            const sorted = [...data.images].sort((a, b) => {
              const aIsExtra = /lifestyle|install/i.test(a) ? 1 : 0;
              const bIsExtra = /lifestyle|install/i.test(b) ? 1 : 0;
              return aIsExtra - bIsExtra;
            });
            const captionFor = (src: string, i: number) => {
              if (/lifestyle|install/i.test(src)) return `การติดตั้งจริง #${i + 1}`;
              return `${data.model} — มุมที่ ${i + 1}`;
            };
            return (
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground">
                    ภาพสินค้าหลัก ตามด้วยภาพการติดตั้งจริง — คลิกภาพเพื่อขยาย
                    {data.dimensions && data.dimensions.length > 0 && (
                      <span className="ml-1">
                        (ดูแบบมิติได้ที่แท็บ <button onClick={() => setActiveTab("dimensions")} className="text-primary font-bold hover:underline">Dimensions</button>)
                      </span>
                    )}
                  </p>
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <ZoomIn size={12} /> {sorted.length} ภาพ
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {sorted.map((src, i) => {
                    const caption = captionFor(src, i);
                    return (
                      <button
                        key={i}
                        onClick={() => setLightbox({ src, caption })}
                        className="group relative aspect-square rounded-lg border border-border bg-card overflow-hidden flex items-center justify-center p-2 hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <img
                          src={src}
                          alt={caption}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-background/80 backdrop-blur text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn size={12} />
                        </span>
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent px-2 py-1.5 text-[10px] font-medium text-foreground text-left leading-tight">
                          {caption}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {activeTab === "dimensions" && data.dimensions && data.dimensions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                    <Ruler size={18} className="text-primary" />
                    Mechanical Dimensions
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    แบบมิติทางวิศวกรรมของ {data.model} — คลิกภาพเพื่อขยาย หรือดาวน์โหลดได้จาก Datasheet
                  </p>
                </div>
                {data.datasheet && (
                  <a
                    href={data.datasheet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition text-sm font-bold"
                  >
                    <Download size={14} /> Datasheet PDF
                  </a>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.dimensions.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox({ src, caption: `${data.model} — Dimension Drawing` })}
                    className="group relative rounded-xl border-2 border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-[4/3] bg-white flex items-center justify-center p-4">
                      <img
                        src={src}
                        alt={`${data.model} mechanical dimensions ${i + 1}`}
                        className="max-w-full max-h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {data.model} Dimension {data.dimensions!.length > 1 ? `#${i + 1}` : ""}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
                        <ZoomIn size={12} /> ขยายดู
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-display font-bold text-foreground mb-4">คุณสมบัติเด่น</h3>
                <div className="space-y-3">
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
              <div>
                <h3 className="text-lg font-display font-bold text-foreground mb-4">พอร์ตเชื่อมต่อ</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {data.ports.map((p) => (
                    <span key={p} className="px-4 py-2 rounded-lg border border-border bg-card text-foreground font-mono text-sm">{p}</span>
                  ))}
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-4">ข้อมูลทั่วไป</h3>
                <div className="space-y-2 text-sm">
                  {[
                    ["ขนาดหน้าจอ", data.size], ["ความละเอียด", data.resolution], ["อัตราส่วน", data.ratio],
                    ["ระบบสัมผัส", data.touch], ["ความสว่าง", `${data.brightness} nits`],
                    ["มาตรฐาน", "IP65 Front Panel"], ["รับประกัน", "1 ปี (ต่อปี 2: +15%, ปี 3: +20%)"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="text-foreground font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="max-w-3xl space-y-4">
              {[
                { q: `${data.model} ใช้กับงานอะไรได้บ้าง?`, a: `${data.model} เหมาะกับ HMI โรงงาน, SCADA, PLC Operator Interface, Machine Control Panel, ห้องคอนโทรล CNC และงาน Mission-critical ที่ต้องการมาตรฐาน IP65` },
                { q: "รับประกันกี่ปี และมีบริการ On-site ไหม?", a: "รับประกันมาตรฐาน 1 ปี (ฟรี) — ขยายความคุ้มครองได้: ปีที่ 2 = 15% ของราคาสินค้า, ปีที่ 3 = 20% ของราคาสินค้า พร้อมเคลม On-site ภายใน 48 ชม. ทั่วประเทศ" },
                { q: "ต่อกับ Industrial PC ของ ENT รุ่นไหนได้บ้าง?", a: "เชื่อมต่อได้กับ GT Series, EPC Box Series, UPC Series หรือ Industrial PC ที่ลูกค้ามีอยู่แล้ว ผ่านพอร์ตมาตรฐาน HDMI / VGA / USB" },
                { q: "ทำไมไม่ใช้ Panel PC แบบรวมในตัวเดียว?", a: "Panel PC แบบ All-in-One หากชิ้นส่วนใดเสียต้องส่งซ่อมยกชุด หยุดสายผลิตหลายวัน — แบบแยกจอ-แยก PC สามารถเปลี่ยนเฉพาะส่วนที่เสีย ลดเวลา Downtime" },
                { q: "สั่งทำสเปกพิเศษ (RFID / Custom Logo / Wide Voltage) ได้ไหม?", a: "ได้ ENT รับสั่งทำ ODM Custom: เพิ่ม RFID Reader, Custom BIOS, Boot Logo, รองรับไฟ 9V-36V DC ติดต่อทีมขายเพื่อสอบถาม MOQ" },
                { q: "จัดส่งและติดตั้งอย่างไร?", a: "จัดส่ง: คิดค่าขนส่งตามจริง (ไม่ฟรี) — กรณีงานโครงการต่อรองเป็นเคส ๆ ไป\nติดตั้ง: ลูกค้าติดตั้งเองได้ หรือจ้างทีมวิศวกร ENT ติดตั้ง/ทดสอบที่ไซต์งาน โดยต้องกำหนด SOW (Scope of Work) ก่อนเสนอราคา\nรับประกัน: 1 ปี (มาตรฐาน) — สามารถซื้อ Extended Warranty ปีที่ 2 และ 3 ในราคาพิเศษ" },
              ].map((item, i) => (
                <details key={i} className="group p-4 rounded-xl border border-border bg-card">
                  <summary className="cursor-pointer font-bold text-foreground flex items-center justify-between gap-4 list-none">
                    <span>Q: {item.q}</span>
                    <ArrowRight size={16} className="text-primary group-open:rotate-90 transition-transform shrink-0" />
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed pl-4 border-l-2 border-primary/30 whitespace-pre-line">A: {item.a}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust / Service Badges */}
      <section className="relative py-14 border-y border-border/60 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-black">
        {/* Ambient glows */}
        <div aria-hidden className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        {/* Subtle dot pattern */}
        <div aria-hidden className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/40 mb-3 backdrop-blur">
              <ShieldCheck size={12} /> ENT Service Promise
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
              ซื้อกับ ENT Group มั่นใจได้
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "รับประกัน 1 ปี (ฟรี)", desc: "ต่อปี 2: +15% / ปี 3: +20% ของราคาสินค้า" },
              { icon: Truck, title: "ส่งทั่วประเทศ", desc: "คิดค่าขนส่งตามจริง — โครงการต่อรองเป็นเคส" },
              { icon: Wrench, title: "ติดตั้ง & เทรน", desc: "ทีมวิศวกรช่วย Setup และอบรมการใช้งาน" },
              { icon: Phone, title: "Support 24/7", desc: "Hotline + Remote Support ตลอดอายุการใช้งาน" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:border-primary/50 hover:bg-white/[0.07] transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary flex items-center justify-center mb-3 ring-1 ring-primary/30">
                  <item.icon size={22} />
                </div>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-slate-300/90 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Separate Display vs Panel PC */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30 mb-3">
                <AlertTriangle size={12} /> ลดความเสี่ยง
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                ทำไม "แยกจอ + แยก PC" ดีกว่า Panel PC?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Panel PC แบบ All-in-One เมื่อชิ้นส่วนใดชิ้นหนึ่งเสีย ต้องส่งซ่อมยกชุด
                หยุดสายการผลิตนานหลายวัน ค่าซ่อมแพง — FPM Touch Monitor ออกแบบให้
                <span className="text-foreground font-bold"> เชื่อมต่อกับ Industrial PC</span> ที่คุณมีอยู่ หรือเลือก ENT GT/EPC/UPC Series
                เปลี่ยนเฉพาะส่วนที่เสียได้ทันที
              </p>
              <div className="space-y-3">
                {[
                  "เปลี่ยน PC ได้โดยไม่ต้องเปลี่ยนจอ",
                  "อัปเกรด CPU/RAM/Storage ตามต้องการ",
                  "ซ่อมเฉพาะจุด ไม่ต้องหยุดทั้งระบบ",
                  "ใช้ร่วมกับ PC เดิมที่มีอยู่ได้ทันที",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={14} />
                    </div>
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-5 rounded-xl border-2 border-destructive/30 bg-destructive/5">
                <div className="text-xs font-bold uppercase tracking-wider text-destructive mb-2">Panel PC</div>
                <h4 className="font-display font-bold text-foreground mb-3">All-in-One</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-destructive">✕</span> เสียยกชุด</li>
                  <li className="flex items-start gap-2"><span className="text-destructive">✕</span> ซ่อมนาน 7-14 วัน</li>
                  <li className="flex items-start gap-2"><span className="text-destructive">✕</span> อัปเกรดยาก</li>
                  <li className="flex items-start gap-2"><span className="text-destructive">✕</span> ค่าซ่อมแพง</li>
                </ul>
              </div>
              <div className="p-5 rounded-xl border-2 border-primary/40 bg-primary/5 relative">
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                  แนะนำ
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">FPM + PC</div>
                <h4 className="font-display font-bold text-foreground mb-3">Modular</h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" /> เปลี่ยนเฉพาะจุด</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" /> สลับใช้ภายใน 5 นาที</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" /> อัปเกรดอิสระ</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" /> ประหยัดระยะยาว</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compatible Solutions */}
      <section className="py-12 border-b border-border bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30 mb-3">
              <Cable size={12} /> Integration Ready
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              เชื่อมต่อกับ Industrial PC ของ ENT
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {data.model} ใช้พอร์ตมาตรฐาน (HDMI / VGA / USB) เชื่อมต่อกับ Industrial PC ได้ทุกรุ่น
              หรือเลือกชุด Bundle ที่ ENT จัดให้พอดี
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Cpu, name: "GT Series", tagline: "Embedded Box PC", to: "/gt-series",
                desc: "Mini PC ทนทาน Fanless สำหรับ HMI โรงงาน — เลือกได้หลายรุ่นตาม CPU/RAM",
                badge: "Best Match", img: bundleGT,
                alt: `${data.model} เชื่อมต่อกับ GT Series Mini PC ผ่าน HDMI`,
              },
              {
                icon: Server, name: "EPC Box Series", tagline: "Edge Computing", to: "/epc-box-series",
                desc: "Industrial Box PC พลังสูง รองรับ AI/Edge Computing ขยาย I/O ได้",
                badge: "High Performance", img: bundleEPC,
                alt: `${data.model} เชื่อมต่อกับ EPC Box Series สำหรับ AI/Edge Computing`,
              },
              {
                icon: HardDrive, name: "UPC Series", tagline: "Ultra-Compact PC", to: "/upc-series",
                desc: "Mini PC ขนาดเล็กพิเศษ ติดตั้งหลังจอแบบ VESA Mount เนียนกริบ",
                badge: "Space Saving", img: bundleUPC,
                alt: `${data.model} ติดตั้ง UPC Series หลังจอแบบ VESA Mount`,
              },
            ].map((sol) => (
              <Link
                key={sol.name}
                to={sol.to}
                className="group rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/9] bg-gradient-to-br from-secondary/40 to-background overflow-hidden">
                  <img
                    src={sol.img}
                    alt={sol.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/95 text-white text-[10px] font-bold uppercase shadow-md backdrop-blur">
                    {sol.badge}
                  </span>
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-background/95 text-primary flex items-center justify-center shadow-lg backdrop-blur group-hover:scale-110 transition-transform">
                    <sol.icon size={20} />
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{sol.tagline}</div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">{sol.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{sol.desc}</p>
                  <div className="inline-flex items-center gap-1 text-sm text-primary font-bold group-hover:gap-2 transition-all">
                    ดูรุ่นทั้งหมด <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bundle CTA */}
          <div className="mt-6 p-5 rounded-xl border border-primary/30 bg-card/60 backdrop-blur flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <RefreshCw size={18} />
              </div>
              <div>
                <div className="font-bold text-foreground">ต้องการชุด Bundle: จอ + PC + ติดตั้ง?</div>
                <div className="text-sm text-muted-foreground">ทีม ENT จัดสเปกพร้อมใช้งาน + ส่วนลดพิเศษ</div>
              </div>
            </div>
            <QuoteRequestButton productModel={`Bundle: ${data.model} + Industrial PC`} productName={`${data.model} Bundle Solution`} />
          </div>
        </div>
      </section>

      {/* Back to series */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/fpm-series" className="group flex items-center gap-4 p-6 rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/40 transition-all bg-[#575c60]">
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

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card">
          <DialogTitle className="sr-only">{lightbox?.caption ?? "Image"}</DialogTitle>
          {lightbox && (
            <div className="flex flex-col">
              <div className="aspect-video bg-muted/40 flex items-center justify-center p-6">
                <img src={lightbox.src} alt={lightbox.caption} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="px-5 py-3 border-t border-border text-sm font-medium text-foreground">
                {lightbox.caption}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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

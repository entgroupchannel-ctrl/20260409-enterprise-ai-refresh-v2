import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Monitor, Hand, ShieldCheck, Zap, Sun, Maximize2,
  Building2, GraduationCap, Factory, Sparkles, Phone, MessageCircle,
  PackageCheck, Boxes, Ruler, BadgeCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MiniNavbar from "@/components/MiniNavbar";
import FooterCompact from "@/components/FooterCompact";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import AddToCartButton from "@/components/AddToCartButton";
import { DatasheetButton, hasDatasheet } from "@/components/datasheet/DatasheetButton";
import { LineQRDialog } from "@/components/LineQRDialog";
import heroImg from "@/assets/interactive-display-hero.jpg";
import B2BWorkflowBanner from "@/components/B2BWorkflowBanner";

// Use case images by screen size (small → large)
import uc27 from "@/assets/usecase/uc-27-checkin.jpg";
import uc32 from "@/assets/usecase/uc-32-selforder.jpg";
import uc43 from "@/assets/usecase/uc-43-wayfinding.jpg";
import uc55 from "@/assets/usecase/uc-55-classroom.jpg";
import uc65 from "@/assets/usecase/uc-65-boardroom.jpg";
import uc86 from "@/assets/usecase/uc-86-controlroom.jpg";

const SIZE_USE_CASES = [
  {
    img: uc27,
    size: '27"',
    title: "Self Check-in คลินิก / โรงพยาบาล",
    desc: "วางบนเคาน์เตอร์ลงทะเบียนผู้ป่วย ลดคิว ลดงานพนักงาน รองรับสแกนบัตรประชาชนและพิมพ์บัตรคิว",
    products: [
      { label: "HD27", href: "/products/displays-27?model=hd27" },
      { label: "GD27C Kiosk", href: "/products/displays-27?model=gd27c" },
    ],
  },
  {
    img: uc32,
    size: '32"',
    title: "Self-Order ร้านอาหาร / คาเฟ่",
    desc: "หน้าจอแนวตั้ง สั่งอาหารด้วยตัวเอง ชำระเงินผ่าน QR PromptPay เชื่อมต่อ POS และเครื่องพิมพ์ใบเสร็จ",
    products: [
      { label: "HD32", href: "/products/displays-32?model=hd32" },
      { label: "KD32B Kiosk", href: "/products/displays-32?model=kd32b" },
    ],
  },
  {
    img: uc43,
    size: '43"',
    title: "Wayfinding ห้างสรรพสินค้า / อาคาร",
    desc: "แผนที่นำทางภายในอาคาร ค้นหาร้านค้า ห้องน้ำ ลิฟต์ รองรับหลายภาษา ใช้กับ Wall-Mount หรือ Floor Stand",
    products: [
      { label: "HD43", href: "/products/displays-43?model=hd43" },
      { label: "KD43B Floor Stand", href: "/products/displays-43?model=kd43b" },
    ],
  },
  {
    img: uc55,
    size: '55"',
    title: "Smart Classroom / ห้องเรียนยุคใหม่",
    desc: "แทนกระดานดำ เขียน-วาด-นำเสนอ Active Learning เชื่อมแท็บเล็ตนักเรียน บันทึกและแชร์บทเรียนได้ทันที",
    products: [
      { label: "HD55", href: "/products/displays-55?model=hd55" },
      { label: "HR55", href: "/products/displays-55?model=hr55" },
    ],
  },
  {
    img: uc65,
    size: '65"',
    title: "Boardroom / ห้องประชุมผู้บริหาร",
    desc: "ประชุมไฮบริด นำเสนอ Dashboard / KPI พร้อม Video Conference (Zoom / Teams) และ Wireless Casting",
    products: [
      { label: "HD65", href: "/products/displays-65?model=hd65" },
      { label: "HR65", href: "/products/displays-65?model=hr65" },
    ],
  },
  {
    img: uc86,
    size: '86"',
    title: "Control Room / War Room โรงงาน",
    desc: "แสดง MES / SCADA / Andon แบบ Real-time ติดตามสายการผลิต OEE และคุณภาพ ใช้งาน 24/7 เกรดอุตสาหกรรม",
    products: [
      { label: "RZ86B", href: "/products/displays-86?model=rz86b" },
      { label: "RZ98B (98\")", href: "/products/displays-98?model=rz98b" },
    ],
  },
];

// Product card hero images — เลือกภาพที่สื่อความหมายชัดเจน + variation ของ wallpaper เพื่อลดความซ้ำซ้อน
import imgHd27 from "@/assets/touchwo/hd27/mon-2.jpg";          // bloom green wallpaper
import imgGd27c from "@/assets/touchwo/gd27c/p-1.jpg";          // portrait kiosk Win10
import imgHd32 from "@/assets/touchwo/hd32-hero-clean.jpg";     // Win11 bloom
import imgHr32 from "@/assets/touchwo/hr32-hero-clean.jpg";
import imgKd32b from "@/assets/touchwo/kd32b-hero-clean.jpg";
import imgHd43 from "@/assets/touchwo/hd43/card-hero.jpg";      // Win11 bloom (purple)
import imgHr43 from "@/assets/touchwo/hr43/card-hero.jpg";      // Ubuntu sunset mountains
import imgKd43b from "@/assets/touchwo/kd43b/mon-1.jpg";        // floor stand kiosk Win10
import imgHd49 from "@/assets/touchwo/hd49/p-front.jpg";        // Touch-to-Order menu (use case)
import imgHr49 from "@/assets/touchwo/hr49/p-1.jpg";            // Win10 monitor
import imgHd55 from "@/assets/touchwo/hd55/card-hero.jpg";      // Win11 bloom (slim bezel)
import imgHr55 from "@/assets/touchwo/hr55/card-hero.jpg";      // Material You pastel waves
import imgHd65 from "@/assets/touchwo/hd65/p-monitor.jpg";      // Win10 monitor (large)
import imgHr65 from "@/assets/touchwo/hr65/card-hero.jpg";      // Aurora green/teal
import imgRz65b from "@/assets/touchwo/rz65b/p-windows.jpg";    // floor stand kiosk Win10
import imgRz75b from "@/assets/touchwo/rz75b/p-windows.jpg";    // 75" mobile stand Win11
import imgRz85b from "@/assets/touchwo/rz85b/p-windows.jpg";    // 85" boardroom Win11
import imgRz86b from "@/assets/touchwo/rz86b/p-windows.jpg";    // 86" auditorium Win11
import imgRz98b from "@/assets/touchwo/rz98b/p-windows.jpg";    // 98" mega auditorium Win11
import imgGd238c from "@/assets/touchwo/gd238c/p-1a.jpg";       // wall-mount portrait

// Accessory images for filter chips & feature cards
import accDesktopStand from "@/assets/accessories/desktop-stand.jpg";
import accFoldableStand from "@/assets/accessories/foldable-stand.jpg";
import accAdjustableArm from "@/assets/accessories/adjustable-arm.jpg";
import accWallMount from "@/assets/accessories/wall-mount.jpg";
import accAioDesktopStand from "@/assets/accessories/aio-desktop-stand.jpg";
import accAioWallMount from "@/assets/accessories/aio-wall-mount.jpg";

// Map slug → asset image (override DB image_url for consistent presentation)
const PRODUCT_IMAGES: Record<string, string> = {
  "interactive-display-hd27": imgHd27,
  "interactive-kiosk-gd27c": imgGd27c,
  "interactive-display-hd32": imgHd32,
  "interactive-display-hr32": imgHr32,
  "interactive-kiosk-kd32b": imgKd32b,
  "interactive-display-hd43": imgHd43,
  "interactive-display-hr43": imgHr43,
  "interactive-kiosk-kd43b": imgKd43b,
  "interactive-display-hd49": imgHd49,
  "interactive-display-hr49": imgHr49,
  "interactive-display-hd55": imgHd55,
  "interactive-display-hr55": imgHr55,
  "interactive-display-hd65": imgHd65,
  "interactive-display-hr65": imgHr65,
  "interactive-kiosk-rz65b": imgRz65b,
  "interactive-kiosk-rz75b": imgRz75b,
  "interactive-kiosk-rz85b": imgRz85b,
  "interactive-kiosk-rz86b": imgRz86b,
  "interactive-kiosk-rz98b": imgRz98b,
  "interactive-kiosk-gd238c": imgGd238c,
};

// ลำดับการแสดงผล: เริ่มจาก 27" → 32" → 43" → 49" → 55" → 65" → 23.8"
const SIZE_ORDER: Record<string, number> = {
  "27": 1, "32": 2, "43": 3, "49": 4, "55": 5, "65": 6, "75": 7, "85": 8, "86": 9, "98": 10, "23.8": 11,
};
const sizeRank = (p: { tags: string[] | null; slug: string }) => {
  for (const [size, rank] of Object.entries(SIZE_ORDER)) {
    if (p.tags?.some(t => t === `${size}-inch`)) return rank;
  }
  return 99;
};

type Product = {
  id: string;
  sku: string | null;
  model: string;
  name: string;
  description: string | null;
  slug: string;
  form_factor: string | null;
  image_url: string | null;
  tags: string[] | null;
};

const SIZE_FILTERS = [
  { label: "ทั้งหมด", value: "all" },
  { label: '27"', value: "27" },
  { label: '32"', value: "32" },
  { label: '43"', value: "43" },
  { label: '49"', value: "49" },
  { label: '55"', value: "55" },
  { label: '65"', value: "65" },
  { label: '75"', value: "75" },
  { label: '85"', value: "85" },
  { label: '86"', value: "86" },
  { label: '98"', value: "98" },
  { label: '23.8" Kiosk', value: "23.8" },
];

// Series ที่มีหน้ารายละเอียดเฉพาะ (Android/x86/Monitor variants) แต่ยังไม่ถูก seed ลง DB
const EXTRA_PRODUCTS: Product[] = [
  {
    id: "extra-hd43",
    sku: "HD43",
    model: "HD43",
    name: 'Interactive Touch Display HD43 — 43" Configurable AIO',
    description: '43" PCAP 10-point — เลือกได้ทั้ง Touch Monitor / Android PC / Windows x86 PC',
    slug: "interactive-display-hd43",
    form_factor: "Wall / VESA / Desktop",
    image_url: null,
    tags: ["43-inch", "pcap", "android", "x86", "touch-monitor"],
  },
  {
    id: "extra-kd43b",
    sku: "KD43B",
    model: "KD43B",
    name: 'Interactive Touch Kiosk KD43B — 43" Floor Stand',
    description: '43" Floor-Stand Kiosk — Monitor / Android RK3568 / Windows x86 พร้อมขาตั้งพื้น',
    slug: "interactive-kiosk-kd43b",
    form_factor: "Floor Stand Kiosk",
    image_url: null,
    tags: ["43-inch", "kiosk", "floor-stand", "pcap"],
  },
  {
    id: "extra-gd238c",
    sku: "GD238C",
    model: "GD238C",
    name: 'Wall-Mount Touch Kiosk GD238C — 23.8" FHD',
    description: '23.8" Wall-Mount Kiosk — PCAP 10-point, Mohs 7 glass, Android/x86 พร้อมแนว Portrait/Landscape',
    slug: "interactive-kiosk-gd238c",
    form_factor: "Wall-Mount Kiosk",
    image_url: null,
    tags: ["23.8-inch", "kiosk", "wall-mount", "pcap", "fhd"],
  },
  {
    id: "extra-hd27",
    sku: "HD27",
    model: "HD27",
    name: 'Interactive Touch Display HD27 — 27" Configurable AIO',
    description: '27" FHD PCAP 10-point — Touch Monitor / Android (RK3568/3288/3588) / Windows x86 (J6412/i5/i7)',
    slug: "interactive-display-hd27",
    form_factor: "Wall / VESA / Desktop",
    image_url: null,
    tags: ["27-inch", "pcap", "android", "x86", "touch-monitor"],
  },
  {
    id: "extra-gd27c",
    sku: "GD27C",
    model: "GD27C",
    name: 'Wall-Mount Touch Kiosk GD27C — 27" FHD',
    description: '27" Wall-Mount Kiosk — PCAP 10-point, Android RK3568/RK3588 หรือ x86 (Optional)',
    slug: "interactive-kiosk-gd27c",
    form_factor: "Wall-Mount Kiosk",
    image_url: null,
    tags: ["27-inch", "kiosk", "wall-mount", "pcap"],
  },
  {
    id: "extra-hr49",
    sku: "HR49",
    model: "HR49",
    name: 'Interactive Touch Display HR49 — 49" Configurable AIO',
    description: '49" FHD PCAP 10-point — Sleek Unibody / IP65 / Mohs 7 — Touch Monitor / Windows OPS (i3/i5/i7) / Android (RK3568/3288/3588)',
    slug: "interactive-display-hr49",
    form_factor: "Wall / Floor / Mobile Stand",
    image_url: null,
    tags: ["49-inch", "pcap", "android", "x86", "touch-monitor", "large-format"],
  },
  {
    id: "extra-hd49",
    sku: "HD49",
    model: "HD49",
    name: 'Interactive Touch Display HD49 — 49" Slim Bezel 13mm',
    description: '49" FHD PCAP 10-point — Ultra-slim 13mm Bezel (iPad-like) / IP65 / Mohs 7 — Touch Monitor / Windows (J6412/i5/i7) / Android (RK3568/3288/3588) + Wi-Fi 5GHz + BLE 5.0',
    slug: "interactive-display-hd49",
    form_factor: "Wall / Floor / Desktop / Embedded",
    image_url: null,
    tags: ["49-inch", "pcap", "android", "x86", "touch-monitor", "slim-bezel", "large-format"],
  },
  {
    id: "extra-hd55",
    sku: "HD55",
    model: "HD55",
    name: 'Interactive Touch Display HD55 — 55" Slim Bezel 13mm',
    description: '55" FHD PCAP 10-point — Ultra-slim 13mm Bezel (iPad-like) — Touch Monitor / Windows (J6412/i5/i7) / Android (RK3568/3288/3588) + Wi-Fi 5GHz + BLE 5.0',
    slug: "interactive-display-hd55",
    form_factor: "Wall / Floor / Desktop / Embedded",
    image_url: null,
    tags: ["55-inch", "pcap", "android", "x86", "touch-monitor", "slim-bezel", "large-format"],
  },
  {
    id: "extra-hd65",
    sku: "HD65",
    model: "HD65",
    name: 'Interactive Touch Display HD65 — 65" Slim Bezel',
    description: '65" 4K PCAP 10-point — Ultra-slim Bezel — Touch Monitor / Windows / Android (RK3568/3288/3588) สำหรับ Boardroom / Signage / Smart Classroom',
    slug: "interactive-display-hd65",
    form_factor: "Wall / Floor / Desktop / Embedded",
    image_url: null,
    tags: ["65-inch", "pcap", "android", "x86", "touch-monitor", "slim-bezel", "large-format"],
  },
  {
    id: "extra-rz65b",
    sku: "RZ65B",
    model: "RZ65B",
    name: 'Interactive Touch Kiosk RZ65B — 65" Floor Stand Unibody',
    description: '65" Vandal-proof Unibody Kiosk — IP65 / Mohs 7 — Android / Windows สำหรับ Public Self-service & Wayfinding',
    slug: "interactive-kiosk-rz65b",
    form_factor: "Floor Stand Kiosk",
    image_url: null,
    tags: ["65-inch", "kiosk", "floor-stand", "pcap", "vandal-proof"],
  },
  {
    id: "extra-rz75b",
    sku: "RZ75B",
    model: "RZ75B",
    name: 'Interactive Touch Display RZ75B — 75" 4K UHD Modular',
    description: '75" 4K UHD PCAP 10-point — Modular Smart Terminal — Touch Monitor / Windows OPS (i3/i5/i7) / Android (RK3568/3288/3588) — IP65 / Mohs 7',
    slug: "interactive-kiosk-rz75b",
    form_factor: "Wall / Floor / Mobile Stand",
    image_url: null,
    tags: ["75-inch", "pcap", "android", "x86", "touch-monitor", "large-format", "4k-uhd"],
  },
  {
    id: "extra-rz85b",
    sku: "RZ85B",
    model: "RZ85B",
    name: 'Interactive Touch Display RZ85B — 85" 4K UHD Modular',
    description: '85" 4K UHD PCAP 10-point — Modular Smart Terminal — Touch Monitor / Windows OPS (i3/i5/i7) / Android (RK3568/3288/3588) — IP65 / Mohs 7 / Auditorium-grade',
    slug: "interactive-kiosk-rz85b",
    form_factor: "Wall / Floor / Mobile Stand",
    image_url: null,
    tags: ["85-inch", "pcap", "android", "x86", "touch-monitor", "large-format", "4k-uhd"],
  },
  {
    id: "extra-rz86b",
    sku: "RZ86B",
    model: "RZ86B",
    name: 'Interactive Touch Display RZ86B — 86" 4K UHD Modular',
    description: '86" 4K UHD PCAP 10-point — Modular Smart Terminal — Touch Monitor / Windows OPS (i3/i5/i7) / Android (RK3568/3288/3588) — IP65 / Mohs 7 / Auditorium-grade',
    slug: "interactive-kiosk-rz86b",
    form_factor: "Wall / Floor / Mobile Stand",
    image_url: null,
    tags: ["86-inch", "pcap", "android", "x86", "touch-monitor", "large-format", "4k-uhd"],
  },
  {
    id: "extra-rz98b",
    sku: "RZ98B",
    model: "RZ98B",
    name: 'Interactive Touch Display RZ98B — 98" 4K UHD Modular',
    description: '98" 4K UHD PCAP 10-point — Modular Smart Terminal — Touch Monitor / Windows OPS (i3/i5/i7) / Android (RK3568/3288/3588) — IP65 / Mohs 7 / Mega Auditorium-grade',
    slug: "interactive-kiosk-rz98b",
    form_factor: "Wall / Floor / Mobile Stand",
    image_url: null,
    tags: ["98-inch", "pcap", "android", "x86", "touch-monitor", "large-format", "4k-uhd"],
  },
];

const FEATURES = [
  { icon: PackageCheck, title: "KIOSK สำเร็จรูป พร้อมใช้งาน", desc: "ครบทั้งจอ + คอมพิวเตอร์ + OS ในเครื่องเดียว เปิดกล่อง เสียบปลั๊ก ใช้งานได้ทันที ไม่ต้องประกอบเอง" },
  { icon: Boxes, title: "ไม่มียอดขั้นต่ำ (No MOQ)", desc: "สั่งซื้อ 1 เครื่องก็ได้ ทุกองค์กรเป็นเจ้าของได้ ไม่ว่าจะ SME, ร้านค้า, โรงเรียน หรือองค์กรขนาดใหญ่" },
  { icon: Ruler, title: "11 ขนาด ตั้งแต่ 23.8\" – 98\"", desc: "เลือกขนาดได้ครบ — เคาน์เตอร์เล็ก, ห้องประชุม, ออดิทอเรียม, จุดบริการลูกค้า ทุก use case มีรุ่นที่ใช่" },
  { icon: Hand, title: "PCAP / IR Touch 10 จุด", desc: "หน้าจอสัมผัสเกรดอุตสาหกรรม ตอบสนอง <5ms รองรับเขียน-วาด-สัมผัสพร้อมกัน 10 จุด" },
  { icon: ShieldCheck, title: "กระจกนิรภัย Mohs 7", desc: "ทนการกระแทก กันรอยขีดข่วน เกรด IP65 ใช้งานได้ในพื้นที่สาธารณะและสภาพแวดล้อมหนัก" },
  { icon: BadgeCheck, title: "รับประกัน 1 ปี · ขยายได้สูงสุด 3 ปี", desc: "รับประกันมาตรฐาน 1 ปี และซื้อขยายประกันเพิ่มได้สูงสุด 3 ปี ดูแลโดยทีมวิศวกรในประเทศไทย พร้อมอะไหล่สำรอง" },
];

const USE_CASES = [
  {
    icon: Building2,
    title: "Retail / POS / Self-Order",
    desc: "ร้านค้า ร้านอาหาร โชว์รูม — สั่งอาหารด้วยตัวเอง, จัดการคิว, นำทางลูกค้า, แสดงโปรโมชัน",
    bullets: ["Self-order Kiosk", "Queue Management", "Wayfinding", "Digital Catalog"],
  },
  {
    icon: GraduationCap,
    title: "Meeting Room / Education",
    desc: "ห้องประชุม ห้องเรียน Active Learning — ใช้แทนกระดาน, นำเสนอ, จัดประชุมไฮบริด",
    bullets: ["Interactive Whiteboard", "Video Conference", "Active Classroom", "War Room"],
  },
  {
    icon: Factory,
    title: "Industrial / Factory HMI",
    desc: "หน้าจอควบคุมเครื่องจักร, MES Dashboard, Andon Board, Control Room",
    bullets: ["MES / SCADA HMI", "Andon Display", "Production KPI", "Quality Control"],
  },
];

export default function InteractiveDisplay() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<string>("all");
  const [lineOpen, setLineOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, sku, model, name, description, slug, form_factor, image_url, tags")
        .eq("category", "Interactive Touch Display")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (!mounted) return;
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  // Merge สินค้าที่ seed อยู่ใน DB เข้ากับซีรีส์เสริม (ไม่ซ้ำ slug) แล้วจัดเรียงตามขนาด
  const allProducts: Product[] = [
    ...products,
    ...EXTRA_PRODUCTS.filter(e => !products.some(p => p.slug === e.slug)),
  ].sort((a, b) => sizeRank(a) - sizeRank(b));

  const filtered = size === "all"
    ? allProducts
    : allProducts.filter(p => p.tags?.some(t => t === `${size}-inch`));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title='Interactive Touch Display 27"–98" | จอทัชสกรีนอุตสาหกรรม | ENT Group'
        description='จอทัชสกรีนอุตสาหกรรมขนาด 27"-98" สำหรับห้องประชุม, Retail, Education, Factory HMI — IR Touch 10 จุด, IP65, Anti-glare, รับประกัน 1 ปี ขยายได้สูงสุด 3 ปี'
        path="/interactive-display"
      />
      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", path: "/" },
        { name: "Interactive Touch Display", path: "/interactive-display" },
      ]} />

      <MiniNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="คนไทยใช้งานตู้ KIOSK ในห้างสรรพสินค้า"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/20" />
        </div>
        <div className="relative z-10 container max-w-7xl mx-auto px-6 py-12 md:py-16">
          <Badge variant="secondary" className="mb-4">B2B • Enterprise Grade</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl">
            Interactive Touch Display
            <span className="block text-primary mt-2 text-3xl md:text-5xl">
              จอทัชสกรีน 27" – 98" สำหรับงานอุตสาหกรรม
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            จอสัมผัส IR Touch 10 จุด ระดับอุตสาหกรรม ตอบสนอง &lt;5ms — สำหรับห้องประชุม, ร้านค้า,
            ห้องเรียน, โรงงาน และจุดบริการลูกค้า รับประกัน 1 ปี · ซื้อขยายเพิ่มได้สูงสุด 3 ปี
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href="#products">ดูสินค้าทั้งหมด</a>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLineOpen(true)}>
              <MessageCircle className="mr-2 h-4 w-4" /> ปรึกษาผู้เชี่ยวชาญ
            </Button>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="container max-w-7xl mx-auto px-6 py-16 border-t border-border">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">เลือกขนาดที่เหมาะกับงานคุณ</h2>
            <p className="text-muted-foreground mt-2">มี 11 ขนาด: 27", 32", 43", 49", 55", 65", 75", 85", 86", 98" และ 23.8" Kiosk</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SIZE_FILTERS.map(f => (
              <Button
                key={f.value}
                size="sm"
                variant={size === f.value ? "default" : "outline"}
                onClick={() => setSize(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">กำลังโหลดสินค้า...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">ไม่พบสินค้าในขนาดนี้</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((p) => {
              // Override links for series pages with multiple OS variants
              const is32 = p.tags?.includes("32-inch") || p.slug === "interactive-display-hd32";
              const is43 = p.tags?.includes("43-inch") || ["interactive-display-hr43","interactive-display-hd43","interactive-kiosk-kd43b"].includes(p.slug);
              const is238 = p.tags?.includes("23.8-inch") || p.slug === "interactive-kiosk-gd238c";
              const is27 = p.tags?.includes("27-inch") || ["interactive-display-hd27","interactive-kiosk-gd27c"].includes(p.slug);
              const is49 = p.tags?.includes("49-inch") || ["interactive-display-hr49","interactive-display-hd49"].includes(p.slug);
              const is55 = p.tags?.includes("55-inch") || ["interactive-display-hd55","interactive-display-hr55"].includes(p.slug);
              const is65 = p.tags?.includes("65-inch") || ["interactive-display-hd65","interactive-display-hr65","interactive-kiosk-rz65b"].includes(p.slug);
              const is75 = p.tags?.includes("75-inch") || p.slug === "interactive-kiosk-rz75b";
              const is85 = p.tags?.includes("85-inch") || p.slug === "interactive-kiosk-rz85b";
              const is86 = p.tags?.includes("86-inch") || p.slug === "interactive-kiosk-rz86b";
              const is98 = p.tags?.includes("98-inch") || p.slug === "interactive-kiosk-rz98b";
              const model49 = p.slug === "interactive-display-hd49" ? "hd49" : "hr49";
              const model55 = p.slug === "interactive-display-hd55" ? "hd55" : "hr55";
              const model65 =
                p.slug === "interactive-display-hd65" ? "hd65" :
                p.slug === "interactive-kiosk-rz65b" ? "rz65b" : "hr65";
              const model43 =
                p.slug === "interactive-display-hr43" ? "hr43" :
                p.slug === "interactive-kiosk-kd43b" ? "kd43b" : "hd43";
              const model27 = p.slug === "interactive-kiosk-gd27c" ? "gd27c" : "hd27";
              const detailHref = is98
                ? `/products/displays-98?model=rz98b`
                : is86
                ? `/products/displays-86?model=rz86b`
                : is85
                ? `/products/displays-85?model=rz85b`
                : is75
                ? `/products/displays-75?model=rz75b`
                : is65
                ? `/products/displays-65?model=${model65}`
                : is55
                ? `/products/displays-55?model=${model55}`
                : is49
                ? `/products/displays-49?model=${model49}`
                : is27
                ? `/products/displays-27?model=${model27}`
                : is238
                ? "/products/displays-23.8?model=gd238c"
                : is43
                ? `/products/displays-43?model=${model43}`
                : is32
                ? "/products/displays-32?model=hd32"
                : `/products/${p.slug}`;
              const cardImg = PRODUCT_IMAGES[p.slug] || p.image_url;
              return (
              <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <Link to={detailHref} className="block">
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                    {cardImg ? (
                      <img
                        src={cardImg}
                        alt={`${p.model} ${p.name}`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0078D4] via-[#1a4a8a] to-[#3DDC84]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Monitor className="h-24 w-24 text-white/85 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" strokeWidth={1.25} />
                        </div>
                      </>
                    )}
                    {/* OS chips */}
                    <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                      <span className="px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#0078D4] shadow-sm">Windows</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#3DDC84] text-[10px] font-bold text-[#0a3d1f] shadow-sm">Android</span>
                    </div>
                    <Badge className="absolute top-3 left-3 z-10" variant="secondary">{p.model}</Badge>
                  </div>
                </Link>
                <CardContent className="p-5">
                <Link to={detailHref} className="block group/title">
                    <h3 className="font-semibold text-base mb-1 line-clamp-2 min-h-[3rem] group-hover/title:text-primary transition-colors">
                      {p.name.replace("Interactive Touch Display ", "")}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mb-3">{p.form_factor}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[3.75rem]">
                    {p.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button asChild size="sm" variant="secondary" className="w-full">
                      <Link to={detailHref}>ดูรายละเอียด</Link>
                    </Button>
                    <QuoteRequestButton
                      productModel={p.model}
                      productName={p.name}
                      size="sm"
                      className="w-full"
                    />
                    <AddToCartButton
                      productModel={p.model}
                      productName={p.name}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    />
                    {hasDatasheet(p.model) && (
                      <DatasheetButton
                        productModel={p.model}
                        variant="ghost"
                        size="sm"
                        className="w-full text-primary hover:bg-primary/5"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* B2B Workflow Banner — แจ้งให้ลูกค้าทราบว่าสั่งผ่านใบเสนอราคา ไม่ใช่ขายออนไลน์ */}
      <section className="border-y border-border bg-muted/30">
        <B2BWorkflowBanner variant="full" showShopCta={false} />
      </section>

      {/* Use cases by screen size */}
      <section className="container max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-3">Use Case ตามขนาดจอ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">เลือกขนาดให้เหมาะกับการใช้งานจริง</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            ตัวอย่างการนำจอแต่ละขนาดไปใช้งานในสถานการณ์จริง — จากเคาน์เตอร์เล็กถึงห้องประชุม / Control Room
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIZE_USE_CASES.map((uc) => (
            <Card key={uc.size + uc.title} className="overflow-hidden border-border hover:border-primary/50 hover:shadow-lg transition-all group">
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <img
                  src={uc.img}
                  alt={`${uc.size} — ${uc.title}`}
                  loading="lazy"
                  width={1280}
                  height={896}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <Badge className="absolute top-3 left-3 z-10 text-sm font-bold px-3 py-1">{uc.size}</Badge>
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <h3 className="text-white font-semibold text-lg drop-shadow-md">{uc.title}</h3>
                </div>
              </div>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{uc.desc}</p>
                <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground self-center mr-1">รุ่นแนะนำ:</span>
                  {uc.products.map((pr) => (
                    <Link
                      key={pr.href}
                      to={pr.href}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
                    >
                      {pr.label}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Accessories */}
      <section className="border-t border-border bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Badge variant="outline" className="mb-3">Accessories — ส่งตรงจากโรงงาน</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">อุปกรณ์เสริมของแท้ สำหรับ Interactive Display ทุกขนาด</h2>
            <p className="text-muted-foreground">
              ขาตั้งโต๊ะ / ขายึดผนัง / แขนปรับระดับ / ขาตั้ง AIO — รองรับหน้าจอ 5"–65"+
              เลือกตามขนาดจอของคุณเพื่อดูเฉพาะรุ่นที่เข้ากันได้
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
            {[
              { size: "27", label: '27"', img: accDesktopStand },
              { size: "32", label: '32"', img: accFoldableStand },
              { size: "43", label: '43"', img: accAdjustableArm },
              { size: "49", label: '49"', img: accWallMount },
              { size: "55", label: '55"', img: accAioDesktopStand },
              { size: "65", label: '65"', img: accAioWallMount },
              { size: "", label: "ดูทั้งหมด", img: accWallMount },
            ].map((s) => (
              <Link
                key={s.label}
                to={s.size ? `/accessories?size=${s.size}` : "/accessories"}
                className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all aspect-square"
              >
                <img
                  src={s.img}
                  alt={`Accessories สำหรับจอ ${s.label}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                  <div className="text-base font-bold text-white drop-shadow-md">{s.label}</div>
                  <div className="text-[11px] text-white/80">Accessories</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                img: accDesktopStand,
                title: "Desktop / Foldable Stand",
                desc: "ขาตั้งวางโต๊ะมาตรฐาน + พับเก็บได้ รองรับ 15\"–27\"",
                href: "/accessories?size=27",
              },
              {
                img: accWallMount,
                title: "Wall Mount + Adjustable Arm",
                desc: "ขายึดผนัง VESA + แขนปรับระดับ รองรับ 5\"–65\"",
                href: "/accessories?size=43",
              },
              {
                img: accAioDesktopStand,
                title: "All-in-One Stand (GD Series)",
                desc: "ขาตั้ง / ขายึดโลหะทั้งชิ้น สำหรับ AIO 15.6\"–43\"",
                href: "/accessories",
              },
            ].map((c) => (
              <Link key={c.title} to={c.href} className="group">
                <Card className="border-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all h-full">
                  <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                    <img
                      src={c.img}
                      alt={c.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1.5 group-hover:text-primary transition-colors">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link to="/accessories">
                <Boxes className="mr-2 h-4 w-4" /> ดู Accessories ทั้งหมด
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">ทำไม KIOSK สำเร็จรูปของเราถึงต่าง</h2>
          <p className="text-muted-foreground mt-3">ครบ จบในเครื่องเดียว — ไม่ต้องประกอบ ไม่มียอดขั้นต่ำ ทุกองค์กรเป็นเจ้าของได้</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, idx) => {
            const gradients = [
              "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
              "bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent",
              "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent",
              "bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent",
              "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent",
              "bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent",
              "bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent",
              "bg-gradient-to-br from-fuchsia-500/10 via-fuchsia-500/5 to-transparent",
              "bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent",
            ];
            return (
              <Card key={f.title} className={`border-border hover:border-primary/50 transition-all hover:shadow-md ${gradients[idx % gradients.length]}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-lg bg-background/70 backdrop-blur-sm p-2.5 shadow-sm">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{f.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Use cases */}
      <section className="border-y border-border bg-muted/30">
        <div className="container max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">ใช้งานได้หลากหลาย</h2>
            <p className="text-muted-foreground mt-3">3 กลุ่มเป้าหมายหลักที่ลูกค้าเลือกใช้งาน</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {USE_CASES.map((u) => (
              <Card key={u.title} className="bg-background">
                <CardContent className="p-6">
                  <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                    <u.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{u.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{u.desc}</p>
                  <ul className="space-y-1.5">
                    {u.bullets.map(b => (
                      <li key={b} className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">ต้องการคำแนะนำเฉพาะโครงการ?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            ทีมวิศวกรของเราพร้อมช่วยออกแบบ-สำรวจหน้างาน-เลือกขนาด-รูปแบบติดตั้ง
            พร้อมเสนอราคาแบบ Bulk สำหรับโครงการมากกว่า 5 จุด
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/quote-request">
                <Phone className="mr-2 h-4 w-4" /> ขอใบเสนอราคา
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLineOpen(true)}>
              <MessageCircle className="mr-2 h-4 w-4" /> แชท LINE @entgroup
            </Button>
          </div>
        </div>
      </section>

      <FooterCompact />
      <LineQRDialog open={lineOpen} onClose={() => setLineOpen(false)} />
    </div>
  );
}

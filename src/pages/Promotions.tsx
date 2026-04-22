import { useState } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import {
  ArrowLeft, Clock, Tag, Gift, Bell, ChevronDown, ExternalLink,
  Zap, Percent, Calendar, PartyPopper, Sparkles, Timer, FileDown, Flame, Phone
} from "lucide-react";
import promotionsHeroBg from "@/assets/promotions-hero-bg.jpg";
import promoEmT195Hero from "@/assets/promo-em-t195-hero.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FooterCompact from "@/components/FooterCompact";
import LineQRButton from "@/components/LineQRButton";

/* ───── SEO ───── */
const promotionsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "โปรโมชั่นและส่วนลด ENT Group",
  "url": "https://www.entgroup.co.th/promotions",
  "description": "รวมโปรโมชั่นพิเศษจาก ENT Group สำหรับ Industrial PC, Mini PC, Rugged Tablet และอุปกรณ์คอมพิวเตอร์อุตสาหกรรม",
  "isPartOf": {
    "@type": "WebSite",
    "name": "ENT Group",
    "url": "https://www.entgroup.co.th",
  },
};

/* ───── Types ───── */
type PromoStatus = "active" | "ended" | "recurring";

interface Promo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: PromoStatus;
  period: string;
  endDate?: string;
  badge?: string;
  image: string;
  highlights: string[];
  products: string[];
  ctaLabel: string;
  ctaHref: string;
  downloadHref?: string;
}

/* ───── Promotion Data (เรียงจากเก่าไปใหม่) ───── */
const promotions: Promo[] = [
  // === ENDED promos (oldest first) ===
  {
    id: "stainless-panel",
    title: "Panel PC กันน้ำ Stainless Steel",
    subtitle: "สำหรับไลน์ผลิตอาหาร",
    description: "Industrial Panel PC แบบกันน้ำ วัสดุสแตนเลส SUS304 พร้อม Core i5, 15.6/17\" LED, 10-point PCAP ทำความสะอาดง่าย เหมาะสำหรับโรงงานอาหาร",
    status: "ended",
    period: "ก.ค. — ก.ย. 2567",
    image: "/images/wix/0597a3_7b6521bd482145efb111e6b876b3724a_9fec0c05.png",
    highlights: [
      "Stainless Steel SUS304",
      "กันน้ำรอบทิศทาง",
      "Core i5-6200U, 8GB, 128GB SSD",
      "Windows 11 พร้อมใช้",
    ],
    products: ["Waterproof Panel PC"],
    ctaLabel: "ดูสินค้า",
    ctaHref: "/waterproof-pc",
    downloadHref: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_3a9dd05ae16848d28ed0197b0534bae0.pdf",
  },
  {
    id: "gt5000-win50",
    title: "GT5000 + Windows Pro ลด 50%",
    subtitle: "พร้อมลุยทุกงานในโรงงาน",
    description: "ซื้อ GT5000 Industrial PC ในราคาปกติ รับส่วนลด Windows 10/11 Pro OEM ทันที 50%! ทนทาน พอร์ตครบ RS232/RS485/RS422 + GPIO",
    status: "ended",
    period: "ก.ย. — 31 ต.ค. 2567",
    image: "/images/wix/0597a3_805b3ce1b9bb473783490aefbcaff690_9f1d49c9.png",
    highlights: [
      "Windows Pro OEM ลด 50%",
      "GT5000 Industrial Grade",
      "GPIO สำหรับควบคุมอุปกรณ์",
      "Intel Core Processor",
    ],
    products: ["GT5000"],
    ctaLabel: "ดู GT Series",
    ctaHref: "/gt-series",
  },
  {
    id: "mini-pc-budget",
    title: "Mini PC ราคาประหยัด",
    subtitle: "เริ่มต้น 11,900 บาท",
    description: "มินิคอมพิวเตอร์สเปคดี ราคาเข้าถึงง่าย i3 Gen10 8GB 256GB WiFi เพียง 11,900 บาท หรือ i3 Gen13 เพียง 12,900 บาท + ส่วนลด 50% Windows OEM",
    status: "ended",
    period: "ต.ค. — ธ.ค. 2567",
    image: "/images/wix/0597a3_36c3b6f976464c92a2638e03febec078_ff7afdb2.png",
    highlights: [
      "i3 Gen10 8GB 256GB — 11,900 บาท",
      "i3 Gen13 8GB 256GB — 12,900 บาท",
      "Windows Pro OEM ลด 50%",
      "WiFi ในตัว",
    ],
    products: ["Mini PC"],
    ctaLabel: "ดู Mini PC",
    ctaHref: "/mini-pc",
  },
  {
    id: "flood-vcloudpoint",
    title: "vCloudpoint ลด 30% ช่วยโรงเรียนน้ำท่วม",
    subtitle: "ร่วมฟื้นฟูการศึกษา สู้ภัยน้ำท่วม",
    description: "ENTGROUP ร่วมเป็นส่วนหนึ่งในการฟื้นฟูระบบการศึกษา ด้วยโซลูชัน vCloudpoint ลด 30% สำหรับทุกโรงเรียนที่ประสบภัย ฟรีติดตั้ง+อบรม+ประกัน 3 ปี",
    status: "ended",
    period: "โครงการพิเศษ 2567",
    badge: "CSR",
    image: "/images/wix/0597a3_4a0a3cd6b903466aa7a6be2c574f9f17_79537af4.png",
    highlights: [
      "ลด 30% สำหรับโรงเรียนประสบภัย",
      "ฟรีติดตั้ง + อบรม + ซอฟต์แวร์",
      "ประกัน 3 ปีเต็ม",
      "10 โรงเรียนแรก รับอุปกรณ์เสริมฟรี 10,000 บาท",
    ],
    products: ["vCloudpoint"],
    ctaLabel: "ติดต่อเรา",
    ctaHref: "https://line.me/R/ti/p/@entgroup",
  },
  // === ACTIVE promos ===
  {
    id: "em-t195-rugged",
    title: "EM-T195 Rugged Tablet 5G",
    subtitle: "บาง เบา ทน — 10.1\" Android 11 | IP65 | 5G",
    description: "Rugged Tablet ระดับพรีเมียม บางเพียง 10.5mm น้ำหนัก 650g กันน้ำ IP65 รองรับ 5G พร้อม NFC และ Barcode Scanner สำหรับงานคลังสินค้า ขนส่ง และภาคสนาม",
    status: "active" as PromoStatus,
    period: "สินค้าใหม่ 2568",
    badge: "🆕 NEW",
    image: promoEmT195Hero,
    highlights: [
      "จอ 10.1\" FHD สัมผัสได้แม้สวมถุงมือ",
      "บาง 10.5mm เบา 650g พกพาสะดวก",
      "กันน้ำกันฝุ่น IP65 ทนตก 1.2 เมตร",
      "รองรับ 5G / NFC / Barcode Scanner",
    ],
    products: ["EM-T195"],
    ctaLabel: "ดูรายละเอียด",
    ctaHref: "/rugged-tablet/em-t195",
  },
  {
    id: "starter-plus",
    title: "STARTER PLUS+ อัพสเปคฟรี!",
    subtitle: "สั่งรุ่น Starter ทุกซีรีส์ — RAM & SSD อัพฟรี",
    description: "สั่งรุ่น STARTER ของทุกซีรีส์ รับอัพเกรดฟรี RAM 4→8GB (มูลค่า 1,200 บาท) + SSD 128→256GB (มูลค่า 1,500 บาท) ประหยัดสูงสุด 2,700 บาท/เครื่อง",
    status: "active",
    period: "จนถึง 31 ธ.ค. 2568",
    endDate: "2568-12-31",
    badge: "คุ้มสุด",
    image: "/images/wix/0597a3_edb77d9f4150436f837edf75bf00a6e6_55c2b56b.png",
    highlights: [
      "RAM 4GB → อัพฟรี 8GB",
      "SSD 128GB → อัพฟรี 256GB",
      "ประหยัดสูงสุด 2,700 บาท/เครื่อง",
      "ใช้ได้ทุกซีรีส์: GT, GB, GK, IPC, EPC",
    ],
    products: ["GT Series", "GB Series", "GK Series", "IPC Panel", "EPC Panel", "IPC-110"],
    ctaLabel: "สั่งซื้อเลย",
    ctaHref: "https://line.me/R/ti/p/@entgroup",
    downloadHref: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_06163a4987de4c12adfa292df1f757ec.pdf",
  },
  {
    id: "endyear-windows",
    title: "END YEAR SALE แถม Windows ฟรี!",
    subtitle: "GT Series + Windows OEM & IOT มูลค่า 3,900-4,900 บาท",
    description: "ซื้อคอมพิวเตอร์อุตสาหกรรม GT Series รับฟรี Windows 10/11 Pro OEM หรือ Windows 10/11 IOT มูลค่าสูงสุด 4,900 บาท สำหรับโรงงาน โกดัง ระบบควบคุมอัตโนมัติ",
    status: "active",
    period: "จนถึง 31 ธ.ค. 2568",
    endDate: "2568-12-31",
    badge: "HOT",
    image: "/images/wix/0597a3_db1433a3bf0c4657a1f5d99352280129_8b3388da.png",
    highlights: [
      "แถมฟรี Windows 10/11 Pro OEM",
      "หรือ Windows 10/11 IOT",
      "มูลค่าสูงสุด 4,900 บาท",
      "Fanless + พอร์ตครบครัน",
    ],
    products: ["GT Series"],
    ctaLabel: "สั่งซื้อเลย",
    ctaHref: "https://line.me/R/ti/p/@entgroup",
    downloadHref: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_4c6eedfeac264eef81608a356d68732f.pdf",
  },
  {
    id: "wifi6-free",
    title: "ซื้อ 1 แถม 1! WiFi 6 ฟรี",
    subtitle: "Industrial PC + WiFi 6 Upgrade มูลค่า 3,900 บาท",
    description: "เปลี่ยนโรงงานสู่โรงงานอัจฉริยะ! ซื้อ Industrial PC รับฟรี WiFi 6 Module มูลค่า 3,900 บาท เชื่อมต่อเร็วกว่า ทรงพลังกว่า",
    status: "active",
    period: "จนถึง 31 ธ.ค. 2568",
    endDate: "2568-12-31",
    image: "/images/wix/0597a3_dc716eff20664aae8238509cca867668_0f736af8.png",
    highlights: [
      "ฟรี WiFi 6 Module มูลค่า 3,900 บาท",
      "เชื่อมต่อเร็วกว่าด้วย WiFi 6",
      "เหมาะกับ Smart Factory",
      "ใช้ได้กับ GT & GB Series",
    ],
    products: ["GT Series", "GB Series"],
    ctaLabel: "สั่งซื้อเลย",
    ctaHref: "https://line.me/R/ti/p/@entgroup",
  },
  // === RECURRING ===
  {
    id: "monday-deal",
    title: "โปรวันจันทร์!",
    subtitle: "ดีลพิเศษทุกวันจันทร์ แอดไลน์สอบถาม",
    description: "โปรนี้จัดทุกวันจันทร์! ลูกค้าสามารถทักแอดไลน์สอบถามได้เลย ราคาพิเศษสำหรับสินค้าหลากหลายรุ่น เปลี่ยนทุกสัปดาห์",
    status: "recurring",
    period: "ทุกวันจันทร์",
    badge: "Weekly",
    image: "/images/wix/0597a3_e37368a316ff4090b336d904f95bf018_37b04f66.png",
    highlights: [
      "ดีลพิเศษเปลี่ยนทุกสัปดาห์",
      "ราคาเฉพาะวันจันทร์เท่านั้น",
      "หลากหลายรุ่น หลากหลายซีรีส์",
      "แอดไลน์ @entgroup สอบถามได้เลย",
    ],
    products: ["สินค้าหลากหลาย"],
    ctaLabel: "แอดไลน์สอบถาม",
    ctaHref: "https://line.me/R/ti/p/@entgroup",
  },
];

/* ───── Helper ───── */
const statusConfig: Record<PromoStatus, { label: string; color: string; icon: typeof Tag }> = {
  active: { label: "กำลังจัด", color: "bg-green-500 text-white", icon: Zap },
  ended: { label: "สิ้นสุดแล้ว", color: "bg-muted text-muted-foreground", icon: Clock },
  recurring: { label: "จัดประจำ", color: "bg-amber-500 text-white", icon: Bell },
};

const activePromos = promotions.filter((p) => p.status === "active");
const recurringPromos = promotions.filter((p) => p.status === "recurring");
const endedPromos = [...promotions.filter((p) => p.status === "ended")].reverse(); // newest first

const hasCurrentPromos = activePromos.length > 0 || recurringPromos.length > 0;

/* ───── Components ───── */
const PromoCard = ({ promo, featured = false }: { promo: Promo; featured?: boolean }) => {
  const [expanded, setExpanded] = useState(featured);
  const sc = statusConfig[promo.status];

  return (
    <div className={`card-surface overflow-hidden transition-all duration-300 ${
      promo.status === "active" ? "border-primary/30 shadow-lg" : ""
    } ${featured ? "md:col-span-2" : ""}`}>

      <div className={`flex flex-col ${featured ? "md:flex-row" : ""}`}>

        {/* Image */}
        <div className={`relative bg-secondary/30 flex items-center justify-center p-6 ${
          featured ? "md:w-2/5" : ""
        }`}>

          {promo.badge && (
            <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              promo.status === "active" ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
            }`}>

              {promo.badge}
            </span>
          )}
          <span className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.color}`}>

            <sc.icon size={10} /> {sc.label}

          </span>
          {promo.ctaHref ? (
            <Link to={promo.ctaHref}>

              <img
                src={promo.image}
                alt={promo.title}
                className={`object-contain ${featured ? "max-h-64" : "max-h-48"} hover:scale-105 transition-transform duration-300`}
                loading="lazy"
              />
            </Link>
          ) : (
            <img
              src={promo.image}
              alt={promo.title}
              className={`object-contain ${featured ? "max-h-64" : "max-h-48"}`}
              loading="lazy"
            />
          )}
        </div>

        {/* Content */}
        <div className={`flex-1 p-5 ${featured ? "md:p-8" : ""}`}>

          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground font-medium">{promo.period}</span>
          </div>
          <h3 className={`font-bold text-foreground mb-1 ${featured ? "text-xl md:text-2xl" : "text-lg"}`}>

            {promo.title}
          </h3>
          <p className={`text-primary font-medium mb-3 ${featured ? "text-sm" : "text-xs"}`}>{promo.subtitle}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{promo.description}</p>

          {/* Highlights */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-primary font-medium mb-3 hover:underline">
            {expanded ? "ซ่อนรายละเอียด" : "ดูรายละเอียดเพิ่มเติม"}
            <ChevronDown size={14} className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>

          <div className={`overflow-hidden transition-[max-height] duration-300 ${expanded ? "max-h-[500px]" : "max-h-0"}`}>

            <ul className="space-y-1.5 mb-4">
              {promo.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">✓</span> {h}

                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {promo.products.map((p) => (
                <span key={p} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-secondary border border-border text-muted-foreground">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-2">
            {promo.ctaHref.includes("line.me") ? (
              <LineQRButton
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 ${
                  promo.status === "active"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}>
                {promo.ctaLabel}
              </LineQRButton>
            ) : (
              <a
                href={promo.ctaHref}
                target={promo.ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={promo.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 ${
                  promo.status === "active"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}>
                {promo.ctaLabel}
              </a>
            )}
            {promo.downloadHref && (
              <a
                href={promo.downloadHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                <FileDown size={14} /> PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───── Main Page ───── */
const Promotions = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="โปรโมชั่นและส่วนลด Industrial PC, Mini PC, Rugged Tablet — ENT Group"
        description="รวมโปรโมชั่นพิเศษประจำเดือนจาก ENT Group ส่วนลด Industrial PC, Mini PC, Panel PC, Rugged Tablet และอุปกรณ์คอมพิวเตอร์อุตสาหกรรม พร้อมข้อเสนอสุดคุ้ม"
        path="/promotions"
        keywords="โปรโมชั่น ENT Group, ส่วนลด Industrial PC, ส่วนลด Mini PC, โปรโมชั่น Rugged Tablet, ราคาพิเศษ ENT Group, Industrial PC ลดราคา"
        jsonLd={promotionsJsonLd}
      />
      {/* Nav */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> หน้าแรก
          </Link>
          <h1 className="text-sm font-bold">​</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[340px] md:min-h-[400px]">
        <img
          src={promotionsHeroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={768}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container max-w-5xl mx-auto px-6 py-16 relative text-center text-white">
          <PartyPopper className="mx-auto text-yellow-400 mb-4" size={48} />
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-4">
            โปรโมชั่น<span className="text-gradient">พิเศษ</span>
          </h1>
          {hasCurrentPromos ? (
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              ข้อเสนอสุดพิเศษสำหรับสินค้าคอมพิวเตอร์อุตสาหกรรม — อัพเดทล่าสุด
            </p>
          ) : (
            <div className="max-w-lg mx-auto">
              <p className="text-lg text-white/80 mb-3">ขณะนี้ยังไม่มีโปรโมชั่น</p>
              <p className="text-yellow-400 font-semibold text-xl inline-flex items-center gap-2"><Bell className="w-5 h-5" /> อดใจรอสักนิด! โปรดีๆ กำลังจะมา</p>
              <p className="text-sm text-white/60 mt-2">แอดไลน์ @entgroup เพื่อรับแจ้งเตือนโปรใหม่ก่อนใคร</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-400">{activePromos.length}</div>
              <div className="text-xs text-white/70">โปรกำลังจัด</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">{recurringPromos.length}</div>
              <div className="text-xs text-white/70">โปรจัดประจำ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white/60">{endedPromos.length}</div>
              <div className="text-xs text-white/70">โปรที่ผ่านมา</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-t border-border">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <Tabs defaultValue="current" className="space-y-8">
            <TabsList className="w-full justify-start bg-secondary/30 p-1 h-auto flex-wrap">
              <TabsTrigger value="current" className="text-xs sm:text-sm gap-1.5">
                <Zap size={14} /> กำลังจัด ({activePromos.length + recurringPromos.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="text-xs sm:text-sm gap-1.5">
                <Clock size={14} /> โปรที่ผ่านมา ({endedPromos.length})
              </TabsTrigger>
              <TabsTrigger value="notify" className="text-xs sm:text-sm gap-1.5">
                <Bell size={14} /> รับแจ้งเตือน
              </TabsTrigger>
            </TabsList>

            {/* Current Promos */}
            <TabsContent value="current">
              {activePromos.length > 0 && (
                <div className="mb-8">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-foreground mb-6">
                    <Sparkles className="text-primary" size={22} /> โปรโมชั่นปัจจุบัน
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activePromos.map((p, i) => (
                      <PromoCard key={p.id} promo={p} featured={i === 0} />
                    ))}
                  </div>
                </div>
              )}

              {recurringPromos.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-foreground mb-6">
                    <Bell className="text-amber-500" size={22} /> โปรจัดประจำ
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {recurringPromos.map((p) => (
                      <PromoCard key={p.id} promo={p} />
                    ))}
                  </div>
                </div>
              )}

              {activePromos.length === 0 && recurringPromos.length === 0 && (
                <div className="text-center py-16">
                  <Timer className="mx-auto text-muted-foreground mb-4" size={48} />
                  <h3 className="text-2xl font-bold text-foreground mb-2">อดใจรอสักนิด!</h3>
                  <p className="text-muted-foreground">โปรโมชั่นใหม่ๆ กำลังจะมาเร็วๆ นี้ แอดไลน์เพื่อรับแจ้งเตือนก่อนใคร</p>
                </div>
              )}
            </TabsContent>

            {/* Past Promos */}
            <TabsContent value="past">
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground mb-2">
                <Clock className="text-muted-foreground" size={22} /> โปรที่ผ่านมา
              </h2>
              <p className="text-sm text-muted-foreground mb-6">โปรเหล่านี้อาจกลับมาอีกในอนาคต — แอดไลน์เพื่อไม่พลาด!</p>
              <div className="grid md:grid-cols-2 gap-6">
                {endedPromos.map((p) => (
                  <PromoCard key={p.id} promo={p} />
                ))}
              </div>
            </TabsContent>

            {/* Notify */}
            <TabsContent value="notify">
              <div className="max-w-lg mx-auto text-center py-12">
                <Bell className="mx-auto text-primary mb-6" size={56} />
                <h2 className="text-2xl font-bold text-foreground mb-3">ไม่อยากพลาดโปรดีๆ?</h2>
                <p className="text-muted-foreground mb-8">
                  แอดไลน์ @entgroup เพื่อรับข่าวสารโปรโมชั่นพิเศษ ดีลเฉพาะลูกค้าไลน์ และข้อเสนอ Flash Sale ก่อนใคร
                </p>

                <LineQRButton
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity mb-6">
                  เพิ่มเพื่อน LINE @entgroup
                </LineQRButton>

                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { icon: Gift, text: "โปรพิเศษเฉพาะ LINE" },
                    { icon: Zap, text: "Flash Sale ก่อนใคร" },
                    { icon: Percent, text: "ส่วนลดสูงสุด 50%" },
                  ].map((item) => (
                    <div key={item.text} className="card-surface p-4 text-center">
                      <item.icon className="mx-auto text-primary mb-2" size={24} />
                      <p className="text-xs text-muted-foreground font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-secondary/20">
        <div className="container max-w-3xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">ต้องการใบเสนอราคา?</h2>
          <p className="text-muted-foreground mb-6">ติดต่อเราเพื่อขอราคาพิเศษสำหรับโปรเจกต์ของคุณ</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LineQRButton
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              LINE @entgroup
            </LineQRButton>
            <a
              href="tel:0957391053"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-secondary/50 transition-colors">
              <Phone className="w-4 h-4" /> 095-739-1053
            </a>
          </div>
        </div>
      </section>
      <FooterCompact />
    </div>
  );
};


export default Promotions;


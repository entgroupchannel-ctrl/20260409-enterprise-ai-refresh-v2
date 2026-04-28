import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Ruler } from "lucide-react";
import kd156bHero from "@/assets/touchwo/kd156b/KD156-1A.jpg";
import kd215bHero from "@/assets/touchwo/kd215b/KD215-1.jpg";
import kd32bHero from "@/assets/touchwo/kd32b-hero-clean.jpg";
import kd43bHero from "@/assets/touchwo/kd43b/mon-1.jpg";
import gd215cHero from "@/assets/touchwo/gd215c/GD215-1A.jpg";
import gd238c3Hero from "@/assets/touchwo/gd238c/L-1.jpg";
import gd27cHero from "@/assets/touchwo/gd27c/p-1.jpg";
import dm080nfHero from "@/assets/touchwork/DM080NF-Monitor.jpg";
import dm080wgHero from "@/assets/touchwork/DM080WG-Monitor.jpg";
import dm101gHero from "@/assets/touchwork/DM101G-Monitor.jpg";
import dm104gHero from "@/assets/touchwork/DM104G-Monitor.jpg";
import dm121gHero from "@/assets/touchwork/DM121G-Monitor.jpg";
import dm15gHero from "@/assets/touchwork/DM15G-Monitor.jpg";
import dm156gHero from "@/assets/touchwork/DM156G-Monitor.jpg";
import dm17gHero from "@/assets/touchwork/DM17G-Monitor.jpg";
import dm19gHero from "@/assets/touchwork/DM19G-Monitor.jpg";
import dm215gHero from "@/assets/touchwork/DM215G-Monitor.jpg";
import gd133Hero from "@/assets/touchwork/GD133-Monitor.jpg";

const gd32cHero = "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/product-images/touchwo/gd32c/gallery-01.jpg";

interface KioskModel {
  slug: string;            // e.g. "displays-32"
  modelCode: string;       // e.g. "KD32B"
  size: string;            // e.g. '32"'
  shortName: string;
  tagline: string;
  startingPrice: number;   // baht
  image: string;
  productHref: string;     // full spec page link
}

const ALL_MODELS: KioskModel[] = [
  {
    slug: "displays-15.6",
    modelCode: "KD156B",
    size: '15.6"',
    shortName: "KD156B Series",
    tagline: 'ตู้คีออสก์ตั้งพื้น 15.6" — Compact Desktop / Floor-Stand',
    startingPrice: 22990,
    image: kd156bHero,
    productHref: "/products/displays-15.6?model=kd156b",
  },
  {
    slug: "displays-21.5",
    modelCode: "KD215B",
    size: '21.5"',
    shortName: "KD215B Series",
    tagline: 'ตู้คีออสก์ตั้งพื้น 21.5" FHD — Banking / Self-service',
    startingPrice: 27990,
    image: kd215bHero,
    productHref: "/products/displays-21.5?model=kd215b",
  },
  {
    slug: "displays-32",
    modelCode: "KD32B",
    size: '32"',
    shortName: "KD32B Series",
    tagline: 'ตู้คีออสก์ตั้งพื้น 32" — Wayfinding / Banking',
    startingPrice: 39990,
    image: kd32bHero,
    productHref: "/products/displays-32?model=kd32b",
  },
  {
    slug: "displays-43",
    modelCode: "KD43B",
    size: '43"',
    shortName: "KD43B Series",
    tagline: 'ตู้คีออสก์ตั้งพื้น 43" — Public Self-service / QSR',
    startingPrice: 49990,
    image: kd43bHero,
    productHref: "/products/displays-43?model=kd43b",
  },
  {
    slug: "gd215c",
    modelCode: "GD215C",
    size: '21.5"',
    shortName: "GD215C Wall Kiosk",
    tagline: 'Wall-Mount 21.5" Bezel 13mm — แขวนผนัง / ตั้งพื้น / วางเคาน์เตอร์',
    startingPrice: 36990,
    image: gd215cHero,
    productHref: "/products/displays-21.5?model=gd215c",
  },
  {
    slug: "gd238c3",
    modelCode: "GD238C3",
    size: '23.8"',
    shortName: "GD238C3 Wall Kiosk (Landscape)",
    tagline: 'Wall-Mount 23.8" 16:9 Bezel 13mm — Reception / Digital Menu',
    startingPrice: 42990,
    image: gd238c3Hero,
    productHref: "/products/displays-23.8?model=gd238c3",
  },
  {
    slug: "gd32c",
    modelCode: "GD32C",
    size: '32"',
    shortName: "GD32C Wall Kiosk (Portrait)",
    tagline: 'Wall-Mount 32" 9:16 Bezel 13mm — Retail / Self-service / POS',
    startingPrice: 39990,
    image: gd32cHero,
    productHref: "/products/displays-32?model=gd32c",
  },
  {
    slug: "gd27c",
    modelCode: "GD27C",
    size: '27"',
    shortName: "GD27C Wall Kiosk",
    tagline: 'Wall-Mount 27" PCAP Bezel 16mm — POS / Healthcare / Banking',
    startingPrice: 34990,
    image: gd27cHero,
    productHref: "/products/displays-27?model=gd27c",
  },
  {
    slug: "dm080nf",
    modelCode: "DM080NF",
    size: '8"',
    shortName: "DM080NF Industrial Touch PC",
    tagline: 'จอสัมผัส 8" PCAP Mohs 7 — Monitor / Android / Windows',
    startingPrice: 13990,
    image: dm080nfHero,
    productHref: "/touchwork/dm080nf",
  },
  {
    slug: "dm080wg",
    modelCode: "DM080WG",
    size: '8"',
    shortName: "DM080WG Widescreen Touch PC",
    tagline: 'จอสัมผัส 8" 16:10 Mohs 7 — Monitor / Android / Windows',
    startingPrice: 13990,
    image: dm080wgHero,
    productHref: "/touchwork/dm080wg",
  },
  {
    slug: "dm101g",
    modelCode: "DM101G",
    size: '10.1"',
    shortName: "DM101G Industrial Touch PC",
    tagline: 'จอสัมผัส 10.1" 16:10 PCAP — Monitor / Android / Windows • รองรับ 1920×1200',
    startingPrice: 13990,
    image: dm101gHero,
    productHref: "/touchwork/dm101g",
  },
  {
    slug: "dm104g",
    modelCode: "DM104G",
    size: '10.4"',
    shortName: "DM104G Industrial Touch PC",
    tagline: 'จอสัมผัส 10.4" 4:3 — Backlight 30,000 ชม. • Monitor / Android / Windows',
    startingPrice: 13990,
    image: dm104gHero,
    productHref: "/touchwork/dm104g",
  },
  {
    slug: "dm121g",
    modelCode: "DM121G",
    size: '12.1"',
    shortName: "DM121G Industrial Touch PC",
    tagline: 'จอสัมผัส 12.1" 4:3 Capacitive 10pt — Monitor / Android / Windows • Backlight 30,000 ชม.',
    startingPrice: 14990,
    image: dm121gHero,
    productHref: "/touchwork/dm121g",
  },
  {
    slug: "dm15g",
    modelCode: "DM15G",
    size: '15"',
    shortName: "DM15G Industrial Touch PC",
    tagline: 'จอสัมผัส 15" 4:3 Mohs 7 — Monitor / Android / Windows • ขนาดมาตรฐานโรงงาน',
    startingPrice: 15990,
    image: dm15gHero,
    productHref: "/touchwork/dm15g",
  },
  {
    slug: "dm156g",
    modelCode: "DM156G",
    size: '15.6"',
    shortName: "DM156G Industrial Touch PC",
    tagline: 'จอสัมผัส 15.6" 16:9 Full HD 1920×1080 — Monitor / Android / Windows • Widescreen ยอดนิยม',
    startingPrice: 16990,
    image: dm156gHero,
    productHref: "/touchwork/dm156g",
  },
  {
    slug: "dm17g",
    modelCode: "DM17G",
    size: '17"',
    shortName: "DM17G Industrial Touch PC",
    tagline: 'จอสัมผัส 17" 5:4 Tempered 7H — Monitor / Android / Windows • Backlight 30,000 ชม.',
    startingPrice: 15990,
    image: dm17gHero,
    productHref: "/touchwork/dm17g",
  },
  {
    slug: "dm19g",
    modelCode: "DM19G",
    size: '19"',
    shortName: "DM19G Industrial Touch PC",
    tagline: 'จอสัมผัส 19" 5:4 Workstation — Monitor / Android 11-13 / Windows 10-11 • IP65 + VESA 100',
    startingPrice: 16990,
    image: dm19gHero,
    productHref: "/touchwork/dm19g",
  },
  {
    slug: "dm215g",
    modelCode: "DM215G",
    size: '21.5"',
    shortName: "DM215G Industrial Touch PC",
    tagline: 'จอสัมผัส 21.5" 16:9 Full HD Workstation — Monitor / Android 11-13 / Windows 10-11 • IP65 + VESA 100',
    startingPrice: 17990,
    image: dm215gHero,
    productHref: "/touchwork/dm215g",
  },
];

const fmt = (n: number) => n.toLocaleString("th-TH");

export default function RelatedKioskModels({ currentSlug }: { currentSlug: string }) {
  const items = ALL_MODELS.filter((m) => m.slug !== currentSlug);
  if (items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 pb-10">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold">รุ่นที่คุณอาจชอบ</h2>
          <p className="text-xs text-muted-foreground">ตู้คีออสก์ตั้งพื้น KD-Series ขนาดอื่น — โครงสร้างเดียวกัน เลือกขนาดให้เหมาะกับพื้นที่</p>
        </div>
        <Link to="/shop?category=Floor-Stand+Kiosk" className="text-xs text-primary hover:underline hidden sm:inline-flex items-center gap-1">
          ดูทั้งหมด <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((m) => (
          <Card key={m.slug} className="group overflow-hidden hover:shadow-md transition-shadow">
            <Link to={`/shop/${m.slug}`} className="block">
              <div className="aspect-[4/3] bg-muted/30 overflow-hidden">
                <img
                  src={m.image}
                  alt={`${m.modelCode} ${m.size} Floor-Stand Kiosk`}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
            <CardContent className="p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Ruler className="w-3 h-3" /> {m.size}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">{m.modelCode}</span>
              </div>
              <Link to={`/shop/${m.slug}`} className="block hover:text-primary">
                <h3 className="font-semibold text-sm leading-tight line-clamp-1">{m.shortName}</h3>
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">{m.tagline}</p>
              <div className="flex items-center justify-between pt-1.5 border-t">
                <div className="text-xs">
                  <span className="text-muted-foreground">เริ่มต้น </span>
                  <span className="font-bold text-primary">฿{fmt(m.startingPrice)}</span>
                </div>
                <Link
                  to={m.productHref}
                  className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-0.5"
                >
                  สเปก <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
